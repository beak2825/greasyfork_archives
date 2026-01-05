// ==UserScript==
// @name         imgflip remove watermark
// @namespace    https://www.facebook.com/groups/149902775172788
// @version      0.1
// @description  imgflip user script to remove watermark
// @author       S.C.
// @match        https://imgflip.com/memegenerator*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11972/imgflip%20remove%20watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/11972/imgflip%20remove%20watermark.meta.js
// ==/UserScript==

var change = function(){
    var $ = jQuery;
    if (!$)return;
    var control = $ && $('.gen-no-watermark');
    if (control){
        //$(".gen-no-watermark-wrap").show();
        $('.mm-generate').on('mouseover', function(){
            I.user.pro=1;
        });
        control.prop('checked', true).trigger('change');
    } else {
        setTimeout(change, 250);
    }
}

change();