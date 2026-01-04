// ==UserScript==
// @name         Block Hulu Thumbnails
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Crude script to block potential spoilers in Hulu
// @author       Elite
// @match        https://www.hulu.com/*
// @grant        none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/420709/Block%20Hulu%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/420709/Block%20Hulu%20Thumbnails.meta.js
// ==/UserScript==

function checkContainer()
{
    var container = document.getElementsByClassName("L2Content addFocus Details");
    if (container.length == 1)
    {
        hideThumbnails(container[0]);
    }
    setTimeout(checkContainer, 2500);
}

function hideThumbnails(container)
{
    var obj = document.getElementsByClassName("StandardEmphasisHorizontalTileThumbnail__image Image Image__loaded");
    for (var i in obj)
    {
        if (typeof(obj[i]) == "object")
        {
            if (container.contains(obj[i]))
            {
                obj[i].hidden = true;
            }
        }
    }
}


(function() {
    'use strict';
    checkContainer();
})();