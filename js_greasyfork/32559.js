// ==UserScript==
// @name          WME - Require Slash after editor
// @version      0.0.2
// @namespace    bauzer714
// @description  Fix editor redirect and some silly css
// @author       bauzer714
// @match        https://beta.waze.com/*editor*
// @match        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/*editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32559/WME%20-%20Require%20Slash%20after%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/32559/WME%20-%20Require%20Slash%20after%20editor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var loc = window.location.toString();
    if (loc.indexOf('/editor/') === -1 ) {
      window.location = loc.replace('/editor','/editor/');
    }
    
  //Fix some crappy styling
    var css = ' .waze-radio-container input[type="radio"]:disabled + label,   .waze-radio-container input[type="radio"] label.disable { color: #222 !important; opacity:.8 }';
    var style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
     document.head.appendChild(style);
})();