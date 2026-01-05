// ==UserScript==
// @name        FB Edit
// @namespace   localhost
// @include     https://www.facebook.com/*
// @require     https://greasyfork.org/scripts/10546-mujs-2-0/code/MUJS%2020.js?version=57895
// @version     1.0
// @grant       none
// @description Fix left panel in FB
// @downloadURL https://update.greasyfork.org/scripts/17038/FB%20Edit.user.js
// @updateURL https://update.greasyfork.org/scripts/17038/FB%20Edit.meta.js
// ==/UserScript==

sel('div#leftCol').style.position = 'fixed';
sel('div#leftCol').style.height = '550px';
sel('div#leftCol').style.overflow = 'auto';