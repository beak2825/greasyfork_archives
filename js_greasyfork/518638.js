// ==UserScript==
// @name         Huhu.to fullscreen fix
// @namespace    https://greasyfork.org/en/users/1401432-serbian-fantom
// @version      2024-11-22
// @description  fullscreen fix
// @author       Serbian_Fantom
// @match        https://huhu.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huhu.to
// @grant        none
// @license community
// @downloadURL https://update.greasyfork.org/scripts/518638/Huhuto%20fullscreen%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/518638/Huhuto%20fullscreen%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('fullscreenchange', function(){
        let el = document.querySelector('video-js').lastChild

        if(!el.getAttribute('hidden')){
            el.setAttribute('hidden', true);
        }else{
            el.removeAttribute('hidden');
        }
    })
})();