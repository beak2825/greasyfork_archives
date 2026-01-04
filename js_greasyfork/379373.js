// ==UserScript==
// @name         pr0gramm.com - Page Title Changer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Set new pre-defined page title for pr0gramm.com
// @author       lalelu
// @match        https://pr0gramm.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379373/pr0grammcom%20-%20Page%20Title%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/379373/pr0grammcom%20-%20Page%20Title%20Changer.meta.js
// ==/UserScript==

var settings = {
    'updateIntervalTime' : '10',
    'newTitle' : 'Google' //here is the new title, change it if you want
};

function changeIt(){
    document.title = settings.newTitle;
}

(function() {
    'use strict';

    var oldTitle = document.title;
    window.setInterval(function() {
        if (document.title !== oldTitle){changeIt();}
        oldTitle = document.title;
    }, settings.updateIntervalTime);

})();