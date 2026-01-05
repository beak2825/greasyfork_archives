// ==UserScript==
// @name         Osu downloaded Detector
// @version      4.64
// @description  Add an OWNED tag to already downloaded beatmaps, 2 buttons to filter downloaded or not beatmap, page merger (up to 125 pages in the same window ! 5000 beatmaps continuously !)
// @author       Aerath
// @icon           http://osu.ppy.sh/favicon.ico
// @match        https://osu.ppy.sh/p/beatmaplist*
// @match        http://osu.ppy.sh/p/beatmaplist*
// @match        https://osu.ppy.sh/s/*
// @match        http://osu.ppy.sh/s/*
// @match        https://osu.ppy.sh/b/*
// @match        http://osu.ppy.sh/b/*
// @grant GM_setValue
// @grant GM_getValue
// @namespace https://greasyfork.org/users/14048
// @downloadURL https://update.greasyfork.org/scripts/12786/Osu%20downloaded%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/12786/Osu%20downloaded%20Detector.meta.js
// ==/UserScript==

if(window.location.pathname.startsWith("/s/") || window.location.pathname.startsWith("/b/"))
{
    dl_url=document.getElementsByClassName("beatmap_download_link")[0].href.split('/')
    id=dl_url[dl_url.length-1];

    var newtag = document.createElement("span");
    newtag.innerHTML = "<strong style=\"display: inline-block;background: #dad7fb;border: solid 1px #cac7eb;border-radius: 2px;padding: 1px;margin-left: 10px;font-size: 75%;color:" + (contains(GM_getValue("ownedIDS", []), id) ? "red\">OWNED" : "green\">NEW");
    document.getElementsByTagName("h1")[0].appendChild(newtag);
    audio.volume=GM_getValue("volume", 45)/100;
}
else
{
    var optionHTML = '<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>'+
        '<script src="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>'+
        '<a>Options</a>'+
        '<div id="options" style="min-width:250px;display:none;">'+
        '    <h3>Options</h3>'+
        '    Volume : <span id="volume">45%</span><br><i>Automatically saved</i><br>'+
        '    <input id="volumeInput" type="range" min="0" max="100" value="45" step="1"><br>'+
        '    Pages to merge : '+
        '    <input type="number" min="1" max="125" value="5" required="true" name="pageSpin" id="pageSpin" placeholder="Pages" style="width:25px;"><br>'+
        '    <textarea name="idsArea" value=IDS id="idsArea" placeholder="IDs" style="width:85%;height:100px"></textarea><br>'+
        '    <button>Save</button>'+
        '</div>';
    var buttonCSS = "background-color: rgb(169, 169, 255);color: rgb(255, 255, 255);cursor: pointer;display: inline;font-family: 'Arial Grande', Tahoma, Helvetica, Arial, sans-serif;font-size: 10.6666669845581px;height: auto;margin-right: 4px;padding-bottom: 3px;padding-left: 3px;padding-right: 3px;padding-top: 3px;text-decoration: none;width: auto;";
    var textCSS = "color: #3843a6;cursor: pointer;display: inline;font-family: 'Arial Grande', Tahoma, Helvetica, Arial, sans-serif;font-size: 10.6666669845581px;height: auto;margin-right: 4px;padding-bottom: 3px;padding-left: 3px;padding-right: 3px;padding-top: 3px;text-decoration: none;width: auto;";

    var page = getQueryVariable("page");
    if(!page)
        page=1;
    else page = Number(page);

    var s1 = document.createElement("span");
    var s2= document.createElement("span");
    var s3= document.createElement("div");
    s1.setAttribute("style", GM_getValue("show_owned", true) ? buttonCSS : textCSS);
    s2.setAttribute("style", GM_getValue("show_new", true) ? buttonCSS : textCSS);
    s1.addEventListener("click", click_owned, false);
    s2.addEventListener("click", click_new, false);
    s1.innerHTML = "OWNED";
    s2.innerHTML = "NEW";
    s3.innerHTML = optionHTML;
    s3.getElementsByTagName("a")[0].addEventListener("click", options, false);
    s3.getElementsByTagName("button")[0].addEventListener("click", optsave, false);

    document.getElementsByClassName("pagination")[0].appendChild(document.createElement("br"));
    document.getElementsByClassName("pagination")[0].appendChild(document.createElement("br"));
    document.getElementsByClassName("pagination")[0].appendChild(s1);
    document.getElementsByClassName("pagination")[0].appendChild(s2);
    document.getElementsByClassName("pagination")[0].appendChild(document.createElement("br"));
    document.getElementsByClassName("pagination")[0].appendChild(document.createElement("br"));
    document.getElementsByClassName("pagination")[0].appendChild(s3);
    
    document.getElementById("volumeInput").value = GM_getValue("volume", 45);
    document.getElementById("volumeInput").addEventListener("click", volume, false);
    document.getElementById("volumeInput").addEventListener("keydown", volume, false);
    document.getElementById("volumeInput").addEventListener("change", volume, false);

    // Disable first page play js (double declaration=> instant play-stop)
    $(".bmlistt").click(
        function()
        {
            $('.bmlistt>.icon-pause').removeClass("icon-pause").addClass("icon-play");
            if (playBeatmapPreview($(this).parent().attr('id')))
                $(this).find('i').removeClass("icon-play").addClass("icon-pause");
            return false;
        }
    );

    if(GM_getValue("merged_pages", 5) > 1)
        loadBMpage(1,GM_getValue("merged_pages", 5)-1);
    else editBMs();
}

function options()
{
    if(document.getElementById("options").getAttribute("style") == "min-width:250px;display:block;")
        document.getElementById("options").setAttribute("style", "min-width:250px;display:none;");
    else
    {
        document.getElementById("pageSpin").value = GM_getValue("merged_pages", 5);
        document.getElementById("idsArea").innerHTML = GM_getValue("ownedIDS", []);
        document.getElementById("options").setAttribute("style", "min-width:250px;display:block;");
    }
}

function optsave()
{
    GM_setValue("ownedIDS", document.getElementById("idsArea").value.split(","));
    GM_setValue("merged_pages", document.getElementById("pageSpin").value);
    document.getElementById("options").setAttribute("style", "min-width:250px;display:none;");
    location.reload();
}

function loadBMpage(increment,max_increment)
{
    var xhr = createXHR();
    xhr.onreadystatechange=function()
    {
        if(xhr.readyState == 4)
        {
            var storage = document.createElement("div");
            storage.setAttribute("style", "display:none;");
            document.getElementsByTagName("body")[0].appendChild(storage);

            storage.innerHTML = xhr.responseText;
            while(storage.getElementsByClassName("beatmapListing")[1].firstChild)
                document.getElementsByClassName("beatmapListing")[1].appendChild(storage.getElementsByClassName("beatmapListing")[1].firstChild);

            document.getElementsByTagName("body")[0].removeChild(storage);

            if(increment<max_increment)
                loadBMpage(increment+1,max_increment);
            else editBMs();
        } 
    };
    xhr.open("GET", window.location.href+"&page="+(page+increment) , true);
    xhr.send(null);
}

function editBMs()
{
    var bmlist = document.getElementsByClassName("beatmap");

    for (var i = 0; i < bmlist.length; i++)
    {
        var bm = bmlist[i];

        // Show Diffs and source like if hovered
        bm.children[3].children[1].className += '_';
        bm.children[3].children[1].style.display = 'block';
        bm.children[3].children[2].className += '_';
        bm.children[3].children[2].style.display = 'block';

        var id = bm.id;
        var tagdiv = bm.getElementsByClassName("tags")[0];
        var newtag = document.createElement("a");

        if(contains(GM_getValue("ownedIDS", []), id))
        {
            if(!GM_getValue("show_owned", true))
                bm.style.display = 'none';

            newtag.innerHTML = "<p><strong style=\"color:red\">OWNED</strong></p>";
            tagdiv.appendChild(newtag);
        }
        else
        {
            if(!GM_getValue("show_new", true))
                bm.style.display = 'none';

            newtag.innerHTML = "<p><strong style=\"color:green\">NEW</strong></p>";
            tagdiv.appendChild(newtag);
        }
    }

    //reload ppy js: add various functions to inserted bm like audio
    //3rd decleration for first page bms => instant play-stop-play : everything is working now !
    var pj = document.createElement("script");
    pj.setAttribute("type", "text/javascript");
    pj.setAttribute("src", "//s.ppy.sh/js/main.js?1436431322");
    document.getElementsByTagName("body")[0].appendChild(pj);
    pj.addEventListener("load", volume, false);
}


function contains(a, obj)
{
    for (var i = 0; i < a.length; i++)
        if (a[i] == obj)
            return true;
    return false;
}

function click_owned()
{
    GM_setValue("show_owned", !GM_getValue("show_owned", true));
    s1.setAttribute("style", GM_getValue("show_owned", true) ? buttonCSS : textCSS);
    hideShowBMs();
}
function click_new()
{
    GM_setValue("show_new", !GM_getValue("show_new", true));
    s2.setAttribute("style", GM_getValue("show_new", true) ? buttonCSS : textCSS);
    hideShowBMs();
}

function hideShowBMs()
{
    var bmlist = document.getElementsByClassName("beatmap");

    for (var i = 0; i < bmlist.length; i++)
    {
        var bm = bmlist[i];
        var id = bm.id;

        if(contains(GM_getValue("ownedIDS", []), id))
            bm.style.display = GM_getValue("show_owned", true) ? "inline-block" : "none";
        else bm.style.display = GM_getValue("show_new", true) ? "inline-block" : "none";
    }
}

function createXHR() 
{
    var request = false;
    try
    {
        request = new ActiveXObject('Msxml2.XMLHTTP');
    }
    catch (err2)
    {
        try
        {
            request = new ActiveXObject('Microsoft.XMLHTTP');
        }
        catch (err3)
        {
            try
            {
                request = new XMLHttpRequest();
            }
            catch (err1) 
            {
                request = false;
            }
        }
    }
    return request;
}

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++)
    {
        var pair = vars[i].split("=");
        if (pair[0] == variable)
            return pair[1];
    }
}

function volume()
{
    document.getElementById("volume").innerHTML=document.getElementById("volumeInput").value+"%";
    audio.volume=document.getElementById("volumeInput").value/100;
    GM_setValue("volume", document.getElementById("volumeInput").value);
}