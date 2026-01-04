// ==UserScript==
// @name         side view
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.douban.com/group/topic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377677/side%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/377677/side%20view.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var script = document.createElement('script');
    script.setAttribute('async', 'async');
    script.setAttribute('src', 'https://www.googletagservices.com/tag/js/gpt.js');
    document.body.appendChild(script);

    var script1 = document.createElement('script');
    script1.innerHTML = `
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
googletag.cmd.push(function() {
googletag.defineSlot('/1249652/Douban_OSV_Desktop_SIDEVIEW_1x1', [1, 1], 'div-gpt-ad-1549930076082-0').addService(googletag.pubads());
googletag.pubads().enableSingleRequest();
googletag.enableServices();
});
`;
    document.body.appendChild(script1);

    document.body.innerHTML = document.body.innerHTML + "<div id='div-gpt-ad-1549930076082-0' style='height:1px; width:1px;'></div>";
    var script2 = document.createElement('script');
    script2.innerHTML = `googletag.cmd.push(function() { googletag.display('div-gpt-ad-1549930076082-0'); });`;
    document.getElementById('div-gpt-ad-1549930076082-0').appendChild(script2);
})();