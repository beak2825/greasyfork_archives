// ==UserScript==
// @name         Instagram Right-click+Video-Download
// @namespace    https://greasyfork.org/users/661487
// @version      0.5
// @description  Enabled right click and download option in videos
// @author       cckats
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// @preprocessor default
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446043/Instagram%20Right-click%2BVideo-Download.user.js
// @updateURL https://update.greasyfork.org/scripts/446043/Instagram%20Right-click%2BVideo-Download.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var swcss = `
._a3gq ._aagw,_9AhH0,._aagw {
    display: none;
}
._a3gq ._aakl, ._a3gq ._aakh,fXIG0,._aakl, ._aakh {
    height: 135px;
      left: 50%!important;
      margin-left: -67px;
      margin-top: -67px;
      top: 50%!important;
      width: 135px;
      z-index: 1;
}
._ab8w._ab94._ab97._ab9h._ab9m._ab9p._ab9s._abcf._abcg._abck._abcl {
    width: 95%;
}
/*._aatk,._ab1c,._aagt {
    max-height: 85vh;
    object-fit: contain !important;
}
._aam2 {
    max-width: 44vw!important;
}*/
`;
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(swcss);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(swcss);
    } else if (typeof addStyle != "undefined") {
        addStyle(swcss);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(swcss));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            // no head yet, stick it whereever
            document.documentElement.appendChild(node);
        }
    }

    const interval = setInterval(function() {

        if(document.getElementsByClassName("_ab1d")[0] != undefined){
            if(!document.getElementsByClassName("_ab1d")[0].hasAttribute('rightclick') && document.getElementsByClassName("_ab1d")[0].hasAttribute('controls')){
                const clone = document.getElementsByClassName("_ab1d")[0];
                const new_ele = clone.cloneNode(true);
                clone.parentNode.replaceChild(new_ele, clone);
                console.log('Cloned and replaced without events.');
                document.getElementsByClassName("_ab1d")[0].setAttribute('rightclick',"")
                document.getElementsByClassName("_ab1d")[0].setAttribute("controlslist","download")
                document.getElementsByClassName("_ab1d")[0].play();
            }
        }
        for(i=0; i<document.getElementsByClassName("_aagt").length;i++){
            if(document.getElementsByClassName("_ab1d")[i] != ''){
                document.getElementsByClassName("_aagt")[i].srcset=""
            }
        }
    },500)

})();