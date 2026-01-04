// ==UserScript==
// @name        Remove Links Rewriter - google.com
// @namespace   Violentmonkey Scripts
// @match       https://www.google.com/search
// @grant       none
// @version     0.2.1
// @license     MIT
// @description 25/11/2020 07:58:00
// @downloadURL https://update.greasyfork.org/scripts/405621/Remove%20Links%20Rewriter%20-%20googlecom.user.js
// @updateURL https://update.greasyfork.org/scripts/405621/Remove%20Links%20Rewriter%20-%20googlecom.meta.js
// ==/UserScript==

window.onload = function () {
    var removeOMD = (elms, ads) => {
        if(ads){
            elms = elms.children;
        }

        if (elms !== null && elms !== undefined) {
            for (e in elms) {
                if (elms.item(e) !== null) {
                    var links = elms.item(e).getElementsByTagName('a');
                    for (i in links) {
                        let link = links[i];
                        let omd = link.onmousedown;
                        let ocl = link.onclick;
                        if (typeof (omd) === 'function') {
                            link.removeAttribute('onmousedown');
                        }
                        if (typeof (ocl) === 'function') {
                            link.removeAttribute('onclick');
                        }
                    }
                }
            }
        }
    };

    //SEO links
    var gelms = document.getElementsByClassName('g');
    removeOMD(gelms);

    //Ads links
    // var adselms = document.getElementsByClassName('ads-ad'); // Deprecated
    var adselms = document.getElementById('tads');
    removeOMD(adselms, 1);

    // Rewrite function overwritten
    function rwt(obj, str1, str2, str3, str4, str5, str6, str7, str8, str9, event) {
        return true;
    }
}
