// ==UserScript==
// @name         hide texturemap
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hides texturesMap of delta agario extension
// @author       Vences#2919
// @match        *://agar.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agar.io
// @grant        window.close
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442086/hide%20texturemap.user.js
// @updateURL https://update.greasyfork.org/scripts/442086/hide%20texturemap.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var interval = setInterval(function(){
        console.log('attempting to remove textureMap');
        if (unsafeWindow.Texture && unsafeWindow.Texture.texturesMap) {
            unsafeWindow.Texture.texturesMap.clear();
            console.log('textureMap removed successfuly!');
            clearInterval(interval);
        }
    }, 2000);

})();