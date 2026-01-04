// ==UserScript==
// @name         1337x - Torrent page improvements
// @namespace    NotNeo
// @version      1.5.6
// @description  Makes titles longer on the torrent page and optionally enables the detail box when available.
// @author       NotNeo
// @license      unlicense
// @match        *://*.1337x.to/account
// @match        *://*.1337x.to/torrent/*
// @match        *://*.1337x.st/account
// @match        *://*.1337x.st/torrent/*
// @match        *://*.1337x.ws/account
// @match        *://*.1337x.ws/torrent/*
// @match        *://*.1337x.eu/account
// @match        *://*.1337x.eu/torrent/*
// @match        *://*.1337x.se/account
// @match        *://*.1337x.se/torrent/*
// @match        *://*.1337x.is/account
// @match        *://*.1337x.is/torrent/*
// @match        *://*.1337x.gd/account
// @match        *://*.1337x.gd/torrent/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/33379/1337x%20-%20Torrent%20page%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/33379/1337x%20-%20Torrent%20page%20improvements.meta.js
// ==/UserScript==

var imdbThing, foundIMDB, containerFailureCounter = 0;

var domainArr = [
    "1337x.to/account",
    "1337x.st/account",
    "1337x.ws/account",
    "1337x.eu/account",
    "1337x.se/account",
	"1337x.is/account",
	"1337x.gd/account"
]

function AreInAccount() {
    let istrue = false;
    domainArr.forEach(function(cur){
        if(window.location.href.indexOf(cur) >= 0) {
            istrue = true;
            return false; //breaks out of foreach, not outer function
        }
    });
    return istrue;
}

var hideStreamButt = false;
var hideAnonButt = false;
var hideDirectButt = false;
var usingDetailBox = true;
var usingIMDBLinker = true;//setting to default

if( GM_getValue("usingDetailBox") != null ) {
	usingDetailBox = GM_getValue("usingDetailBox"); //overriding with saved settings if there is one
}
if( GM_getValue("hideAnonButt") != null ) {
	hideAnonButt = GM_getValue("hideAnonButt"); //overriding with saved settings if there is one
}
if( GM_getValue("hideStreamButt") != null ) {
	hideStreamButt = GM_getValue("hideStreamButt"); //overriding with saved settings if there is one
}
if( GM_getValue("hideDirectButt") != null ) {
	hideDirectButt = GM_getValue("hideDirectButt"); //overriding with saved settings if there is one
}
if( GM_getValue("usingIMDBLinker") != null ) {
	usingIMDBLinker = GM_getValue("usingIMDBLinker"); //overriding with saved settings if there is one
}

var imdbInfoText = "If the uploader has an imdb link anywhere in his description, then the button will take you directly to the imdb page for that movie.\\nIf however there is no imdb link in the description, the button will take you to the search results page for the movie name instead.";

if(AreInAccount()) { //if on settings page
    document.getElementById("settings").innerHTML = '<br><input type="checkbox" value="1" name="useDetail" id="useDetailCheckbox" style="transform: scale(1.5);"> <label for="useDetailCheckbox">Show detail box for torrents, when available.</label><br>' +
        '<input type="checkbox" value="1" name="useIMDB" id="usingIMDBLinker" style="transform: scale(1.5);"> <label for="usingIMDBLinker">Show IMDb link button in detail box.</label> <a href="#" onclick="alert(\''+imdbInfoText+'\'); return false;" ><b>?</b></a><br>' +
        '<input type="checkbox" value="1" name="hideAnon" id="hideAnonCheckbox" style="transform: scale(1.5);"> <label for="hideAnonCheckbox">Hide the "Anonymous Download" button</label><br>' +
        '<input type="checkbox" value="1" name="hideDirect" id="hideDirectCheckbox" style="transform: scale(1.5);"> <label for="hideDirectCheckbox">Hide the "Direct Download" button</label><br>' +
        '<input type="checkbox" value="1" name="hideStream" id="hideStreamCheckbox" style="transform: scale(1.5);"> <label for="hideStreamCheckbox">Hide the "Play Now (Stream)" button</label><br>' + document.getElementById("settings").innerHTML;

    document.getElementById("useDetailCheckbox").checked = usingDetailBox; //settings checkbox checked value to saved value (or default, if none are saved)
    document.getElementById("hideAnonCheckbox").checked = hideAnonButt; //settings checkbox checked value to saved value (or default, if none are saved)
    document.getElementById("hideDirectCheckbox").checked = hideDirectButt; //settings checkbox checked value to saved value (or default, if none are saved)
    document.getElementById("hideStreamCheckbox").checked = hideStreamButt; //settings checkbox checked value to saved value (or default, if none are saved)
    document.getElementById("usingIMDBLinker").checked = usingIMDBLinker; //settings checkbox checked value to saved value (or default, if none are saved)

    document.getElementById("useDetailCheckbox").onchange = function() { //on value change
        usingDetailBox = document.getElementById("useDetailCheckbox").checked; //settings current value to the the new
        GM_setValue("usingDetailBox", usingDetailBox); //saving current value
    };
    document.getElementById("hideAnonCheckbox").onchange = function() { //on value change
        hideAnonButt = document.getElementById("hideAnonCheckbox").checked; //settings current value to the the new
        GM_setValue("hideAnonButt", hideAnonButt); //saving current value
    };
    document.getElementById("hideDirectCheckbox").onchange = function() { //on value change
        hideDirectButt = document.getElementById("hideDirectCheckbox").checked; //settings current value to the the new
        GM_setValue("hideDirectButt", hideDirectButt); //saving current value
    };
    document.getElementById("hideStreamCheckbox").onchange = function() { //on value change
        hideStreamButt = document.getElementById("hideStreamCheckbox").checked; //settings current value to the the new
        GM_setValue("hideStreamButt", hideStreamButt); //saving current value
    };
    document.getElementById("usingIMDBLinker").onchange = function() { //on value change
        usingIMDBLinker = document.getElementById("usingIMDBLinker").checked; //settings current value to the the new
        GM_setValue("usingIMDBLinker", usingIMDBLinker); //saving current value
    };
}
else {
    var title = document.getElementsByTagName("title")[0].textContent;
    title = title.substring(9, title.length-16);
    var titleArea = document.getElementsByClassName("box-info-heading")[0];
    if(titleArea.getElementsByTagName("span").length == 2 && title.length > 100) {
        title = title.substring(0, 100) + "...";
    } else if(titleArea.getElementsByTagName("span").length >= 3 && title.length > 85) {
        title = title.substring(0, 85) + "...";
    }
    titleArea.getElementsByTagName("h1")[0].textContent = title;

    if(usingDetailBox) {
        var realDetailBox = document.getElementsByClassName("torrent-detail")[0];
        if(realDetailBox !== undefined) {
            if(!(realDetailBox.offsetWidth > 0 && realDetailBox.offsetHeight > 0)) { //if realDetailBox is not visible, make own
                var datHTML = realDetailBox.innerHTML;
                document.getElementsByClassName("torrent-category-detail")[0].innerHTML += '<div class="torrent-detail clearfix" style="display: inline-block; position: relative; margin-top: 10px; width: 100%;">'+datHTML+'</div>';
            }
        }
    }

    if(usingIMDBLinker) {
        foundIMDB = document.getElementById("description").innerHTML.split("imdb.com/title/tt")[1].split(/[^0-9]+/)[0];
        foundIMDB = "tt"+foundIMDB;
        if (foundIMDB != null) { //if code was found...
            if (!/^tt[0-9]{6,}[0-9]$/.test(foundIMDB)) { //if code is invalid...
                foundIMDB = null; //...make it null
            }
        }
        imdbThing = `<span class="imdbRatingPlugin" data-user="ur000000000" data-title="`+foundIMDB+`" data-style="p2">
									<a href="https://www.imdb.com/title/`+foundIMDB+`/?ref_=plg_rt_1"><img src="https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/images/imdb_37x18.png" alt="" /></a>
								</span>`;

        if(document.getElementsByClassName("torrent-detail")[0]) {
            addGlobalStyle(`.imdbRatingPlugin .rating { background: none; height: unset; position: unset; max-width: unset; } .imdbRatingPlugin { position: absolute; top: 0; right: 0; z-index: 9999; } .torrent-detail-info h3 { margin-right: 105px; }`);
            WaitForContainerThenInsertAndActivate();
        }
        else if(foundIMDB != null) {
            document.querySelectorAll("#description > p:first-child")[0].innerHTML += imdbThing;
            addGlobalStyle(`
#description span.imdbRatingPlugin > .rating .ofTen {padding: 0; line-height: 9px;}
#description span.imdbRatingPlugin > .rating .ofTen::after { content: ""; }
#description span.imdbRatingPlugin > .rating { padding: 0; background: none; height: unset; position: unset; max-width: unset; font-size: 15px; line-height: 15px;}
#description span.imdbRatingPlugin > .rating::after { content: ""; }
#description span.imdbRatingPlugin::after { content: ""; }
#description span.imdbRatingPlugin {display: inline-block; line-height: unset; position: absolute; right: 20px; margin: 3px 0 0 0;}
#description span.imdbRatingPlugin img { vertical-align: middle; }

`);
            ActivateIMDBScript();
        }
    }

    if(hideStreamButt || hideAnonButt || hideDirectButt) {
        try {
            document.querySelectorAll("div.torrent-detail-page ul > li > a").forEach(function(el){
                //alert(el.textContent);
                if((hideStreamButt && el.textContent == "Play No‌w (Str‌eam)") || (hideAnonButt && el.textContent == "An‌on‌ymous Download") || (hideDirectButt && el.textContent == "Dir‌ect Download")) {
                    el.parentNode.style.display = 'none';
                }
            });
        } catch(err) {
            alert("Error getting Stream/Anon button. Please report this via PM to \"NotNeo\"");
        }
    }
}

function WaitForContainerThenInsertAndActivate() {
    let targetLocation = document.getElementById("mCSB_1_container");
    if(targetLocation === null) {
        containerFailureCounter++;
        if(containerFailureCounter >= 200) //Give up if after ~20 seconds we still cannot find the container
        {
            alert("Error getting infobox description container.");
            return;
        }
        setTimeout(WaitForContainerThenInsertAndActivate, 100);
    }
    else {
        targetLocation.innerHTML += imdbThing;
        if(foundIMDB != null) {
            ActivateIMDBScript();
        }
        else {
            let movieName = document.querySelectorAll(".torrent-detail-info h3 a")[0].textContent;
            document.querySelectorAll(".imdbRatingPlugin > a")[0].href = "https://www.imdb.com/find?q="+movieName.trim().replace(/\s/g, "+")+"&s=tt";
        }
    }
}

function ActivateIMDBScript() {
    let imdbScript=document.createElement("script");
    imdbScript.id="imdb-rating-api";
    imdbScript.src="https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/js/rating.js";
    let place = document.getElementsByClassName("imdbRatingPlugin")[0];
    place.parentNode.insertBefore(imdbScript, place);
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}