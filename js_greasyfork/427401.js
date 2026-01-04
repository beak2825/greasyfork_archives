// ==UserScript==
// @name            WME Layers Link Remover
// @description     Removes layers from links clicked/opened in Waze
// @namespace 	    http://www.tomputtemans.com/
// @version         1.0
// @grant           none
// @include         https://www.waze.com/editor*&s=*
// @include         https://www.waze.com/editor?s=*
// @include         https://www.waze.com/*/editor*&s=*
// @include         https://www.waze.com/*/editor?s=*
// @include         https://beta.waze.com/editor*&s=*
// @include         https://beta.waze.com/editor?s=*
// @include         https://beta.waze.com/*/editor*&s=*
// @include         https://beta.waze.com/*/editor?s=*
// @exclude         https://www.waze.com/user/*
// @exclude         https://www.waze.com/*/user/*
// @author          vaindil, Glodenox
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/427401/WME%20Layers%20Link%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/427401/WME%20Layers%20Link%20Remover.meta.js
// ==/UserScript==

window.onload = function() {
    window.stop();
    document.write('<style type="text/undefined">');
    var str = window.location.href.replace(/\?s=\d*&/, '?');
    window.location.href = str.replace(/&s=\d*/g, '');
};