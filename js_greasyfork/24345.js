// ==UserScript==
// @name         Last.fm Interference Inhibitor
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Crudely removes anti-adblock modal from Last.fm's radio waves.
// @author       thebspatrol
// @match        *://last.fm/*
// @match        *://*.last.fm/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/24345/Lastfm%20Interference%20Inhibitor.user.js
// @updateURL https://update.greasyfork.org/scripts/24345/Lastfm%20Interference%20Inhibitor.meta.js
// ==/UserScript==

GM_addStyle (" \
    html { \
        font-size:14px !important; \
        font-family: Open Sans, Lucida Grande, Helvetica Neue, Helvetica, Arial, Sans-serif!important; \
        line-height: 1.71428571!important; \
        color: #222222!important; \
	} \
");

(function() {
    'use strict';

function genTag()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i=0; i < 5; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
    
    var _html = document.getElementsByTagName("html")[0];
    var b = document.body;
    var d = document.createElement(genTag());

    // transfer body and respective CSS to randomly tagged element
    d.innerHTML = document.body.innerHTML;
    d.style.cssText = document.defaultView.getComputedStyle(b, "").cssText;
    d.style.webkitTextFillColor = ""
    _html.replaceChild(d, b);
})();