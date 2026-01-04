// ==UserScript==
// @name         ResorteScript
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Script para filtrar a resortin
// @author       Tu vieja
// @match        https://www.managerzone.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428369/ResorteScript.user.js
// @updateURL https://update.greasyfork.org/scripts/428369/ResorteScript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    filterThreads();
    filterComments();

    function filterThreads() {

        var even = document.getElementsByClassName('even');
        var odd = document.getElementsByClassName('odd');
        for (var i = 0; i < even.length; ++i) {
            var item = even[i];
            if(item.innerHTML.includes('<a href="/?p=profile&amp;uid=8239142">elresorte</a>')) {
                item.style.display = 'none';
            }
        }

        for (var j = 0; j < odd.length; ++j) {
            var oddItem = odd[j];
            if(oddItem.innerHTML.includes('<a href="/?p=profile&amp;uid=8239142">elresorte</a>')) {
                oddItem.style.display = 'none';
            }
        }
    }

    function filterComments() {
        var hitlist = document.getElementsByClassName('hitlist_dl forum_body');
        for (var i = 0; i < hitlist.length; ++i) {
            var item = hitlist[i];
            if(item.innerHTML.includes('<a href="/?p=profile&amp;uid=8239142">elresorte</a>')) {
                item.style.display = 'none';
            }
        }
    }


})();
