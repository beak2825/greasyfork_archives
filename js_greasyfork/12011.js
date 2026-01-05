// ==UserScript==
// @name         Osu downloaded Detector
// @version      4.57
// @description  Add an OWNED tag to already downloaded beatmaps, 2 buttons to filter downloaded or not beatmap, page merger (up to 125 pages in the same window ! 5000 beatmaps continuously !)
// @author       Aerath
// @match        https://osu.ppy.sh/p/beatmaplist*
// @grant GM_setValue
// @grant GM_getValue
// @namespace https://greasyfork.org/users/14048
// @downloadURL https://update.greasyfork.org/scripts/12011/Osu%20downloaded%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/12011/Osu%20downloaded%20Detector.meta.js
// ==/UserScript==

var optionHTML = '<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>'+
    '<script src="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>'+
    '<a>Options</a>'+
    '<div id="options" style="min-width:250px;display:none;">'+
    '    <div>'+
    '      <h3>Options</h3>'+
    '      <input type="number" min=1 max=125 value=5 required="true" name="pageSpin" id="pageSpin" placeholder="Pages"><br>'+
    '      <textarea name="idsArea" value=IDS id="idsArea" placeholder="IDs" style="width:85%;height:100px"></textarea><br>'+
    '      <button>Save</button>'+
    '    </div>'+
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

function options()
{
    document.getElementById("pageSpin").value = GM_getValue("merged_pages", 5);
    document.getElementById("idsArea").innerHTML = GM_getValue("ownedIDS", []);
    document.getElementById("options").setAttribute("style", "min-width:250px;display:block;");
}

function optsave()
{
    GM_setValue("ownedIDS", document.getElementById("idsArea").innerHTML.split(","));
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