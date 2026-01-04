// ==UserScript==
// @name         dmm cookie
// @namespace    undefined
// @description  修改DMM之COOKIE以得以不比封阻
// @author       Kancolle wiki @http://kancolle.wikia.com/wiki/Tutorial:_Proxy_Connection
// @match        *://www.dmm.com/*
// @match        *://www.dmm.com/netgame/*
// @match        *://www.dmm.com/netgame_s/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @version 0.0.1.20171123085753
// @downloadURL https://update.greasyfork.org/scripts/35580/dmm%20cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/35580/dmm%20cookie.meta.js
// ==/UserScript==

document.cookie = "cklg=welcome;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=.dmm.com;path=/";
document.cookie = "cklg=welcome;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=.dmm.com;path=/netgame/";
document.cookie = "cklg=welcome;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=.dmm.com;path=/netgame_s/";
document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=.dmm.com;path=/";
document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=.dmm.com;path=/netgame/";
document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=.dmm.com;path=/netgame_s/";