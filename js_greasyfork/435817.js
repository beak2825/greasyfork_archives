// ==UserScript==
// @name           Mangaupdates External Links 14.03.2023
// @namespace      none
// @match        http://www.mangaupdates.com/series/*
// @match        https://www.mangaupdates.com/series/*
// @grant          none
// @version        v1.8
// @description    Adds external links section to MU's series info page, with MangaDex, MangaFox, MangaHere, MangaPark, DynastyScans, NineManga.
// @downloadURL https://update.greasyfork.org/scripts/435817/Mangaupdates%20External%20Links%2014032023.user.js
// @updateURL https://update.greasyfork.org/scripts/435817/Mangaupdates%20External%20Links%2014032023.meta.js
// ==/UserScript==


function getElementByClassName(elementType, className, src)
{
    if (src == null)
    {
        src = document;
    }
    var tags = src.getElementsByTagName(elementType);
    var i;
    for (i = 0; i < tags.length; i++)
    {
        if (tags[i].className == className)
        {
            return tags[i];
        }
    }
    return null;
}

function redirect(link)
{
    //var uriSite;
    //uriSite = '<meta http-equiv=refresh content=\"0;url=' +encodeURIComponent(link)+ '\">';
    //uriSite = encodeURIComponent(link);
    //return uriSite;
    return link;
    //return 'data:text/html;charset=utf-8,' + uriSite;
}

var title = document.getElementsByClassName("releasestitle tabletitle")[0].innerHTML;
var table = document.getElementsByClassName("col-6 p-2 text")[0];
var lastTableElement = table.children[39];
var adsCat = document.evaluate("/html/body/div/table/tbody/tr[3]/td/table/tbody/tr/td[2]/table/tbody/tr[2]/td/table[2]/tbody/tr/td/div/div[2]/div/div[27]", document, null, XPathResult.ANY_TYPE, null).iterateNext();
var linksCat = document.createElement('div');
linksCat.className = "sCat";
linksCat.innerHTML = "<b>External Links</b>";
var linksContent = document.createElement('div');
linksContent.className = "sContent";

table.insertBefore(linksCat, lastTableElement);
table.insertBefore(linksContent, lastTableElement);
table.insertBefore(document.createElement('br'), lastTableElement);

var pageNames = new Array();
var pageAdressBeginning = new Array();
var pageAdressEnding = new Array();
var searchName = new Array();

// MangaDex link
pageNames.push("MangaDex");
pageAdressBeginning.push("https://mangadex.org/titles?q=");
searchName.push(encodeURIComponent(title));
pageAdressEnding.push("");

// MangaHere link
pageNames.push("Mangahere");
pageAdressBeginning.push("http://www.mangahere.co/search.php?name=");
searchName.push(encodeURIComponent(title));
//pageAdressEnding.push(mangaFoxName);

// MangaPark link
pageNames.push("MangaPark");
pageAdressBeginning.push("https://mangapark.net/search?word=");
searchName.push(encodeURIComponent(title));
pageAdressEnding.push("");

// DynastyScans link
pageNames.push("DynastyScans");
pageAdressBeginning.push("https://dynasty-scans.com/search?q=");
searchName.push(encodeURIComponent(title));
pageAdressEnding.push("");

// NineManga link
pageNames.push("NineManga");
pageAdressBeginning.push("https://en.ninemanga.com/search/?wd=");
searchName.push(encodeURIComponent(title));
pageAdressEnding.push("");

// MangaOwl link
pageNames.push("MangaOwl");
pageAdressBeginning.push("https://mangaowl.net/search/1?search=");
searchName.push(encodeURIComponent(title));
pageAdressEnding.push("");

// FanFox link
pageNames.push("FanFox");
pageAdressBeginning.push("https://fanfox.net/search?title=");
searchName.push(encodeURIComponent(title));
pageAdressEnding.push("");

// MangaLife link
pageNames.push("MangaLife");
pageAdressBeginning.push("https://manga4life.com/search/?name=");
searchName.push(encodeURIComponent(title));
pageAdressEnding.push("");

// MangaNato link
pageNames.push("MangaNato");
pageAdressBeginning.push("https://manganato.com/search/story/");
searchName.push(encodeURIComponent(title));
pageAdressEnding.push("");

// MangaTown link
pageNames.push("MangaTown");
pageAdressBeginning.push("https://www.mangatown.com/search?name=");
searchName.push(encodeURIComponent(title));
pageAdressEnding.push("");

// MangaSee link
pageNames.push("MangaSee");
pageAdressBeginning.push("https://mangasee123.com/search/?name=");
searchName.push(encodeURIComponent(title));
pageAdressEnding.push("");

// broken
pageNames.push("");
pageAdressBeginning.push("http://0.0.0.0/");
searchName.push(encodeURIComponent(title));
pageAdressEnding.push("");


for(var i = 0; i < pageNames.length; i++)
{
    var newLink = document.createElement('a');
    newLink.href = redirect(pageAdressBeginning[i] + searchName[i] + pageAdressEnding[i]);
    newLink.innerHTML = pageNames[i];
    linksContent.appendChild(newLink);
    if (i < pageNames.length - 1)
    {
        linksContent.appendChild(document.createTextNode(", "));
    }
}