// ==UserScript==
// @name        pages
// @namespace   1
// @description Add pages in mail
// @include     http://www.eador.com/B2/privmsg.php?folder=*
// @include     http://eador.com/B2/privmsg.php?folder=*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34032/pages.user.js
// @updateURL https://update.greasyfork.org/scripts/34032/pages.meta.js
// ==/UserScript==

var pgs = document.querySelectorAll("div.float-left > b");
//alert(pgs[1].innerHTML);
var parent = document.querySelector("div.content-block > div.float-left");
var btn = document.querySelector("div.content-block > div.float-left > a");
var nowUrl = window.location.search;
if (nowUrl.search(/&/) !== -1)
    nowUrl = nowUrl.substr(0, nowUrl.search(/&/));
parent.innerHTML = "";
parent.appendChild(btn);

var spn = document.createElement("span");
    spn.className = "pagination";

spn.appendChild(document.createTextNode(" Страницы: "));
var pages;
if (pgs[0].innerHTML == 1)
{
    spn.appendChild(document.createTextNode(pgs[0].innerHTML));

    for (var i = 1; i < pgs[1].innerHTML; i++)
    {
        spn.appendChild(document.createTextNode(", "));
        addPage(i);
    }
}
else {
    pages = document.createElement("a");
    pages.href = "privmsg.php" + nowUrl;
    pages.innerHTML = 1;
    spn.appendChild(pages);

    for (var i = 1; i < pgs[1].innerHTML; i++)
    {
        spn.appendChild(document.createTextNode(", "));
        if (pgs[0].innerHTML == i+1)
        {
            spn.appendChild(document.createTextNode(pgs[0].innerHTML));
            for (i++; i < pgs[1].innerHTML; i++)
            {
                spn.appendChild(document.createTextNode(", "));
                addPage(i);
            }
        }
        else {
            addPage(i);
        }
    }
}

parent.appendChild(spn);

function addPage(i) {
    pages = document.createElement("a");
    pages.href = "privmsg.php" + nowUrl + "&start=" + i * 50;
    pages.innerHTML = i + 1;
    spn.appendChild(pages);
}