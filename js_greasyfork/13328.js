// ==UserScript==
// @name         BulSatCom Fusion Sanitizer
// @namespace    https://greasyfork.org/scripts/13328-bulsatcom-fusion-sanitizer/code/BulSatCom%20Fusion%20Sanitizer.user.js
// @version      0.3
// @icon         http://www.google.com/s2/favicons?domain=http://www.bulsat.com/
// @description  Removes all useless content from BulSatCom Fusion Web IPTV. Enjoy pure blackness and full browser viewing area.
// @author       Apostol Apostolov
// @match        https://test.iptv.bulsat.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/13328/BulSatCom%20Fusion%20Sanitizer.user.js
// @updateURL https://update.greasyfork.org/scripts/13328/BulSatCom%20Fusion%20Sanitizer.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Removes content blocks unrelated to IPTV watching. 

function removeContent(element) {
    var element;
    element = document.getElementById(element);
    if (element) {
        element.parentNode.removeChild(element);
    }
}
removeContent('iptvft');
removeContent('copyright');
removeContent('globalheader');

// Injects CSS styles that expand the IPTV UI full screen. 
// Customized for 1920x1200 Chrome in Windows. Height takes in account task-bar and Chrome UI. 

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('body { margin-left: -12px; }');
addGlobalStyle('html { background: #000000 url() repeat-x top;}');
addGlobalStyle('#main { width: 1900px; !important; padding-left: 0px !important; }');
addGlobalStyle('#main, #globalheader, #globalfooter { width: 1900px; !important; }');
addGlobalStyle('#iptv #iptvpc { background: url() no-repeat; height: 300px; padding-top: 75px !important; background-color: #191c1f; }');
addGlobalStyle('#iptv #iptvpc h3 { display:none }');
addGlobalStyle('#iptv #iptvpc #wrapper { width: 1920px !important; height: 150% !important; margin-left: 0px !important }');
addGlobalStyle('#iptv #iptvpc #wrapper #pl { background-color: #191c1f !important; }');
addGlobalStyle('#iptv #iptvpc #wrapper #pl #jw_wrapper { width: 1620px !important; height: 870px !important; margin-top: -75px !important; }');
addGlobalStyle('#iptv #iptvpc #wrapper #epg { width: 100% !important; }');
addGlobalStyle('#epg ul { float: left !important; }');
addGlobalStyle('#iptv #iptvpc #wrapper #list { height: 869px !important; margin-top: -75px; width: 299px !important;}');
addGlobalStyle('#grp { width: 1920px !important; }');
addGlobalStyle('#grp span { width: 12.45% !important; }');
addGlobalStyle('#cfg input[type="button"] { display:none }');

// JavaScript snippet to check if vertical or horisontal scrollbars are displayed due to window resize, and hides them. 

(function() {var css = "body {overflow-y: hidden !important;}";
             if (typeof GM_addStyle != "undefined") {
                 GM_addStyle(css);
             } else if (typeof PRO_addStyle != "undefined") {
                 PRO_addStyle(css);
             } else if (typeof addStyle != "undefined") {
                 addStyle(css);
             } else {
                 var node = document.createElement("style");
                 node.type = "text/css";
                 node.appendChild(document.createTextNode(css));
                 var heads = document.getElementsByTagName("head");
                 if (heads.length > 0) {
                     heads[0].appendChild(node); 
                 } else {
                     // no head yet, stick it whereever
                     document.documentElement.appendChild(node);
                 }
             }
            })();