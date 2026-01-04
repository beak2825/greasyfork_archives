// ==UserScript==
// @name         pageup/pagedown button
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  try to take over the world!
// @author       zjsxwc
// @match        http://*
// @match        https://*/*
// @match        https://*.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414699/pageuppagedown%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/414699/pageuppagedown%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //var html2 = $("body").html().replace(/script/g, "scpt"); $("body").html(html2);

    window.pageup = function pageup() {
        scrollBy(0, -window.screen.availHeight*0.85);
    }

    window.pagedown = function pagedown() {
        scrollBy(0,  window.screen.availHeight*0.85);
    }

    window.pagetop = function pagetop() {
        scrollTo(0,  10);
    }

    //工具条
    var tool_bar = $('<div id="tool-bar" style="top:45%;right:0px;position:fixed;float:right;font-size:0.5em;z-index: 9999999;"></div>');
    tool_bar.append("<p style='float:right'><div id='up' onclick='pageup()' style=\"background-color: rgba(243,0,0,0.3);margin-bottom: 30px;height: 25px;z-index: 9999999;\">UP</div></p>");
    tool_bar.append("<p style='float:right'><div id='down' onclick='pagedown()' style=\"background-color: rgba(243,0,0,0.3);margin-bottom: 50px;height: 25px;z-index: 9999999;\">DOWN</div></p>");
    tool_bar.append("<p style='float:right'><div id='top' onclick='pagetop()' style=\"background-color: rgba(243,0,0,0.3);margin-bottom: 30px;height: 25px;z-index: 9999999;\">TOP</div></p>");
    $('body').append(tool_bar);

    document.body.style.backgroundColor="white";
    $('#undefined').hide();

})();