// ==UserScript==
// @name Blogger Content Warning Skip
// @description Automatically skips the content warning on blogspot.com sites without reloading the page
// @match http://*.blogspot.com/*
// @version 0.0.1.20190501024552
// @namespace https://greasyfork.org/users/296752
// @downloadURL https://update.greasyfork.org/scripts/382418/Blogger%20Content%20Warning%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/382418/Blogger%20Content%20Warning%20Skip.meta.js
// ==/UserScript==

var fireEvent = function(obj,evt){
    var fireOnThis = obj;
    if (document.createEvent) {
        var evObj = document.createEvent('MouseEvents');
        evObj.initEvent(evt, true, false);
        fireOnThis.dispatchEvent(evObj);
    } else if (document.createEventObject) {
        fireOnThis.fireEvent('on' + evt);
    }
}

var overlay = document.getElementById('injected-iframe');
if (overlay) {
    var nextSibling = overlay.nextElementSibling;
    if (nextSibling.tagName == 'STYLE') nextSibling.parentElement.removeChild(nextSibling);
    overlay.parentElement.removeChild(overlay);
} else if (window.location.href.indexOf('https://www.blogger.com/blogin.g') == 0) {
    fireEvent(document.getElementById('continueButton'), 'click');
}