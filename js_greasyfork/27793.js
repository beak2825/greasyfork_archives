// ==UserScript==
// @name         Orsm.net Ads Remover
// @namespace    http://what/
// @version      1.0.6
// @description  Removes all myfreecams.com ads orsm.net
// @match        http://orsm.net/*
// @match        http://*.orsm.net/*
// @run-at       document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @icon         data:image/png;base64,AAABAAEAEBAAAAAAAABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAQAMAAAAAAAAAAAAAAAAAAAAAAAD////////////////////9/f26zu3u8/z2+f/C1/b9/f3////////////////////////////////////4+PhShdHN4f7U1NXk5OTl7/9TjeP3+Pn////////////////////////////7+/tKd7yBs/+wsbITFBQTFBTIyMmpy/8/etL7+/v///////////////////////+Jl64Vcfvv8fNOT1D7+/v4+PlNTk/19fUrgP6AmcH////////////////////v7+8hX75wqf/7+/v7+/v////////7+/v7+/uZwv8VYtXv7+////////////////+jpagEZfbC2v/////////////////////////p8P8AZv6dp7b///////////////9leZcAZv/t8//////////////////////////7/f8EaP9Ze6////////////////9CYpIAZv/4+/////////////////////////////8Tcf82Zav///////////////84WowAZv/1+P////////////////////////////8Nbv8sXab///////////////9MZYkAZv/W5v/////////////////////////3+v8AZv9AaKL///////////////98gYgCZfqJuP////////////////////////+41P8AZv9yg53///////////////+/v78cX8Qhef/7/P////////////////////9Ej/8PYt+/v7/////////////////7+/tca4EEZfeWv//////////////////I3f8BZv5SbZb7+/v////////////////////p6elIY40MafTT5P/////////u9P8Yc/w9ZqTp6en////////////////////////////19fWOl6Vdi9D09//7+/9fjtSImLH19fX///////////////////////////////////////////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27793/Orsmnet%20Ads%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/27793/Orsmnet%20Ads%20Remover.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

window.addEventListener('DOMContentLoaded', function(e) {
	jQuery('a[href*="myfreecams.com"]').remove();
	window.removeEventListener(e.type, arguments.callee, true);
}, true);
