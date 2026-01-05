// ==UserScript==
// @name         imgflip change default private mode
// @namespace    https://www.facebook.com/groups/149902775172788
// @version      0.1
// @description  imgflip user script change default private mode
// @author       S.C.
// @match        https://imgflip.com/memegenerator*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11973/imgflip%20change%20default%20private%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/11973/imgflip%20change%20default%20private%20mode.meta.js
// ==/UserScript==

var defaultPrivate = true;

var change = function(){
    var $ = jQuery;
    var control = $ && $('.gen-private');
    if (control){
        control.prop('checked', defaultPrivate).trigger('change');
    } else {
        setTimeout(change, 250);
    }
}

change();

