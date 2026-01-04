// ==UserScript==
// @name         Google Photos - Easy Delete
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Delete a photo by pressing !
// @author       You
// @match        https://photos.google.com/photo/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375801/Google%20Photos%20-%20Easy%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/375801/Google%20Photos%20-%20Easy%20Delete.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(document.body.classList.contains('gped-handled')){
        console.warn('Google Photos - Easy Delete : already loaded');
        return;
    }

    document.body.addEventListener('keypress', function(e) {
        if(e.key === '!'){
            document.querySelector('[data-delete-origin] button').click();
            setTimeout(function(){
                document.querySelector('button[autofocus]').click();
            }, 200);
        }
    });

    document.body.classList.add('gped-handled');

})();