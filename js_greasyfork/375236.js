// ==UserScript==
// @name         NorthridgehardwoodsLargePreviews
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  replace northridgehardwoods tiny thumb nails with larger previews of the real image
// @author       RickZabel
// @match        https://www.northridgehardwoods.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375236/NorthridgehardwoodsLargePreviews.user.js
// @updateURL https://update.greasyfork.org/scripts/375236/NorthridgehardwoodsLargePreviews.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyPage() {
        var imagem
        for (var x=0; x<document.images.length; x++) {
            imagem = document.images[x];
            if(imagem.src.includes('s.jpg')){
                imagem.src = imagem.src.replace('s.jpg', '.jpg');
                imagem.width = '1000';
                imagem.height = '750';
                //imagem.width = '700';
                //imagem.height = '450';
            }
            console.log(imagem.src);
        }
    }
    window.onload = function () { modifyPage(); }

})();

