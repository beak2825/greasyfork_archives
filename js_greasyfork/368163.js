// ==UserScript==
// @name         Youtube gaming switch
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Switching between normal and gaming youtube
// @author       Alexandria96
// @match        *://www.youtube.com/*
// @match        *://gaming.youtube.com/*
// @grant GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/368163/Youtube%20gaming%20switch.user.js
// @updateURL https://update.greasyfork.org/scripts/368163/Youtube%20gaming%20switch.meta.js
// ==/UserScript==

(function() {
    'use strict';

GM_addStyle(
    ".btn-youtube-gaming-css { position:inherit; width:auto; height:auto;" +
    "; background-color:transparent; border:none; outline:none;" +
    "transition: all .2s ease-in-out;" +
    "} " +

    ".btn-youtube-gaming-css:hover { cursor:pointer; transform: scale(1.1); opacity:100%; }"
);

var btn = null;
var btnId = 'btn-youtube-gaming';
var timer = setInterval(intervalInit, 500);

function intervalInit() {
    if (!btn) {
        var type = getType(window.location.href);
        if (type !== -1) {
            init(type);
        }
        else {
            removeElement(btnId);
            btn = null;
        }
    }
    else {
        clearInterval(timer);
    }
}

function init(type) {
    var flagElement = null;
    if (type === 0) {
        flagElement = document.getElementById('end');
        if (!flagElement) {
            return;
        }
        btn = document.createElement('button');
        btn.setAttribute('id', btnId);
        btn.setAttribute('class', 'btn-youtube-gaming-css');
        btn.innerHTML = '<img src="https://image.ibb.co/hJSbwJ/if_youtube_gaming_2199878.png" alt="" border="0">';
        btn.onclick = function() {
            window.location.href = window.location.href.replace('www', 'gaming');
        };
        flagElement.parentNode.insertBefore(btn, flagElement.previousSibling);
    }
    else if (type === 1) {
        flagElement = document.getElementById('search-container');
        if (!flagElement) {
            return;
        }
        btn = document.createElement('button');
        btn.setAttribute('id', btnId);
        btn.setAttribute('class', 'btn-youtube-gaming-css');
        btn.innerHTML = '<img src="https://image.ibb.co/iqah3y/if_youtube2_252069.png" alt="" border="0">';
        btn.onclick = function() {
            window.location.href = window.location.href.replace('gaming', 'www');
        };
        flagElement.parentNode.insertBefore(btn, flagElement.nextSibling);
    }
}

function removeElement(id) {
    alert("Hello");
    var elem = document.getElementById(id);
    if (elem) {
        elem.parentNode.removeChild(elem);
    }
}

function getType(url) {
    if (url.includes('www.youtube.com/')) {
        return 0;
    }
    else if (url.includes('gaming.youtube.com/')) {
        return 1;
    }
    return -1;
}
})();