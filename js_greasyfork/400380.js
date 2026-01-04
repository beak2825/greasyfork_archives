// ==UserScript==
// @name         YWOT No New Window
// @namespace    https://greasyfork.org/en/users/501887-spitfirex86
// @version      1.1
// @description  Opens URL links in current window/tab instead of a new one.
// @author       ~spitfire
// @match        http*://www.yourworldoftext.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400380/YWOT%20No%20New%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/400380/YWOT%20No%20New%20Window.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('yourworld').addEventListener('click', function(e){
        var x = document.elementFromPoint(e.pageX, e.pageY);
        if(x.classList.contains('urlLink')) {
            document.location = x.getAttribute('data-url');
            e.stopPropagation();
        }
    })
})();