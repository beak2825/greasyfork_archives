// ==UserScript==
// @name         Tidal album links
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Adds a button that scrapes album links/titles and outputs them to a new tab
// @author       Wenno
// @match        https://listen.tidal.com/artist/*
// @grant        none
// @locale       English
// @downloadURL https://update.greasyfork.org/scripts/38093/Tidal%20album%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/38093/Tidal%20album%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getLinks() {
        var elems = document.querySelectorAll(".grid__interactions");

        var links = [];

        for (var i = 0; i < elems.length; i++) {
            var title = elems[i].parentNode.querySelector(".grid__item__detail__text__title").innerText;
            links.push({title: title, href: elems[i].href});
        }

        return links;
    }

    function displayLinks() {
        var links = getLinks();
        var linksStr = "";

        links.forEach(function(x) {
            //linksStr += `<a href="${x.href}" target="_blank">${x.title}</a><br>`;
            linksStr += `${x.title} - ${x.href}<br>`;
        });

        var newWindow = window.open();
        newWindow.document.body.innerHTML = linksStr;
    }

    function addButton() {
        var div = document.createElement("div");
        div.className = "artist-header__links";
        div.addEventListener("click", function() {
            displayLinks();
        });

        var span = document.createElement("span");
        span.className = "js-components-artistRadio--artistRadio-2xobmp js-radio-button";

        var i = document.createElement("i");
        i.className = "icon-Buttons_share share-button__icon";

        var span2 = document.createElement("span");
        span2.innerText = "Get links";

        var header = document.querySelector(".js-components-artistHeader--artistHeader-3PWW9F");

        span.appendChild(i);
        span.appendChild(span2);
        div.appendChild(span);
        header.appendChild(div);
    }

    function checkReady() {
        setTimeout(function() {
            console.log("lol");
            var a = document.querySelector(".artist-header__links");

            if (a !== undefined) {
                addButton();
            } else {
                checkReady();
            }
        }, 1000);
    }

    setTimeout(function() {
        checkReady();
    }, 5000);
})();