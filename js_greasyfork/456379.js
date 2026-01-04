// ==UserScript==
// @name         UploadCC Image Viewer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hover the broken image and click it.
// @author       CY Fung
// @match        https://*/*
// @icon         https://upload.cc/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456379/UploadCC%20Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/456379/UploadCC%20Image%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function imgClick(){
        window.open(this.src,'_blank');
    }

    function setupFix(s){

        if(s.classList.contains('zmtsr-uploaddcc-img-fix')) return;
        s.classList.add('zmtsr-uploaddcc-img-fix');
        s.addEventListener('click', imgClick, false);

    }

    document.addEventListener('animationstart',function(evt){

        if(evt.animationName==='zmtsrUploadccimgfix'){
            setupFix(evt.target);
        }/*else if(evt.animationName === 'uploadccimgfix2'){
        }*/

    },true);

    GM_addStyle(`

@keyframes zmtsrUploadccimgfix {
     0%{
         background-position-x: 1px;
    }
     100%{
         background-position-x:2px;
    }
}
 @keyframes zmtsrUploadccimgfix2 {
     0%{
         background-position-x: 3px;
    }
     100%{
         background-position-x:4px;
    }
}
 img[src^="https://upload.cc/"]{
     cursor:pointer;
     animation: zmtsrUploadccimgfix 1ms;
}
 a[href] img[src^="https://upload.cc/"]{
     animation: initial;
}
 img[src^="https://upload.cc/"]:hover{
     animation: zmtsrUploadccimgfix2 1ms;
}
 a[href] img[src^="https://upload.cc/"]:hover{
     animation: initial;
}


    `);
    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);

})();