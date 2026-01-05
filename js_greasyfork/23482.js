// ==UserScript==
// @name         GGn Cover on Hover
// @namespace    https://orbitalzero.ovh/scripts
// @version      0.07
// @include      https://gazellegames.net/*
// @description  Shows a torrent cover on hovering its title with the mouse. Inspired by OppaiTime's similar function (-> all credits to OT's devs).
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant GM.xmlHttpRequest
// @grant GM_xmlHttpRequest
// @author       NeutronNoir
// @downloadURL https://update.greasyfork.org/scripts/23482/GGn%20Cover%20on%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/23482/GGn%20Cover%20on%20Hover.meta.js
// ==/UserScript==

var image_css = "\
        #cover_container {\
            position: fixed;\
			right: 10px;\
			top: 10px;\
			z-index: 999999;\
		}\
        #cover_container>img {\
            max-width: 300px;\
            max-height: 300px;\
		}\
	";

function addStyle(css) {
    var head = document.head, style = document.createElement("style");

    style.type = "text/css";
    if (style.styleSheet) {
        style.styleSheet.css = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
}

NodeList.prototype.forEach = Array.prototype.forEach;   //Fix for FF not having forEach in its NodeLists

(function() {
    'use strict';
    var images = {};
    addStyle(image_css);

    var cover_container = document.createElement("div");
    cover_container.id = "cover_container";

    document.body.appendChild(cover_container);
    
    document.querySelectorAll("[title='View Torrent']").forEach(function (item) {
        //preload all the covers
        var link = item.getAttribute("href");

        GM.xmlHttpRequest({
        		method: "GET",
          	url: "/" + link,
          	onload: function (response) {
                if (!response.responseXML) response.responseXML = new DOMParser().parseFromString(response.responseText, "text/html");	
            		var image_src = response.responseXML.querySelector(".box_albumart img").getAttribute("src");
            		new Image().src = image_src;
            		images[link] = image_src;
            }
        });
    });

    document.querySelectorAll("[title='View Torrent']").forEach( function(item) {
        item.addEventListener("mouseover",function () {
            var cover = document.createElement("img");
            var container = document.getElementById("cover_container");

            container.style.display = "inline-block";
            cover.src = images[this.getAttribute("href")];

            container.appendChild(cover);
        });

        item.addEventListener("mouseleave", function() {
            var cover = document.querySelector("#cover_container>img");
            var container = document.getElementById("cover_container");

            container.removeChild(cover);
            container.display = "none";
        });
    });
})();