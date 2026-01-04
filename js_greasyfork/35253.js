// ==UserScript==
// @name            mobile depl auto focus
// @author          Darek / Matt
// @description     automatically focuses on the keyword search on mobile depl german dictionary site.
// @license         Creative Commons Attribution License
// @version	        1.0
// @include         https://*.depl.pl/*
// @released        2017-11-16
// @updated         2017-11-16
// @compatible      Greasemonkey
// @namespace https://greasyfork.org/users/159510
// @downloadURL https://update.greasyfork.org/scripts/35253/mobile%20depl%20auto%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/35253/mobile%20depl%20auto%20focus.meta.js
// ==/UserScript==
 
function SelectText(element) {
    var doc = document
        , text = doc.getElementById(element)
        , range, selection
    ;    
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

document.onclick = function(e) {    
    if (e.target.className === 'click') {
        SelectText('selectme');
    }
};