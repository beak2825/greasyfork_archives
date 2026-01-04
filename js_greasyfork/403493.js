// ==UserScript==
// @name            Image Download with Ctrl+Click/Shift/MMB [GLOBAL]
// @namespace       imageSaving
// @description     Image downloading for most single-image pages, with Ctrl+Click, Shift or MMB-Click combinations
// @author          NightLancerX
// @match           *://*/*.jpg*
// @match           *://*/*.png*
// @match           *://*/*.jpeg*
// @match           *://*/*.gif*
// @version         2.5
// @homepageURL     https://github.com/NightLancer/PixivPreview
// @license         MIT License
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/403493/Image%20Download%20with%20Ctrl%2BClickShiftMMB%20%5BGLOBAL%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/403493/Image%20Download%20with%20Ctrl%2BClickShiftMMB%20%5BGLOBAL%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let img = document.querySelectorAll('img')[0];
    let imgSrc = img.src;

    let main = function()
    {
        let anchor = document.createElement('a'), name;
        name = (imgSrc.indexOf('?')>-1)? imgSrc.substring(imgSrc.lastIndexOf("/")+1, imgSrc.indexOf('?')): imgSrc.substring(imgSrc.lastIndexOf("/")+1);
        try {name = decodeURI(name);} catch(e){};
        anchor.href = img.src;
        anchor.target = '_self';
        anchor.download = name;
        document.body.appendChild(anchor);
        anchor.click();
        main = ()=>{};
    };

    //save with Ctrl+Click
    img.onclick = function(e){
        if (e.ctrlKey){
            e.preventDefault();
            main();
        }
    };

    //save with Shift
    document.onkeyup = function(e){
        if (e.keyCode == 16){
            main();
        }
    };

    //save with MMB-click
    img.onmouseup = function(e){
        if (e.button == 1){
            main();
        }
    };
})();