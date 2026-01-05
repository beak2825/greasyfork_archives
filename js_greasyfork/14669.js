// ==UserScript==
// @name        twimg_redirect_orig2
// @namespace   http://catherine.v0cyc1pp.com/twimg_redirect_orig2.user.js
// @include     http://pbs.twimg.com/media/*
// @include     https://pbs.twimg.com/media/*
// @exclude     http://pbs.twimg.com/media/*:orig#.*
// @exclude     https://pbs.twimg.com/media/*:orig#.*
// @run-at      document-start
// @author      greg10
// @license     GPL 3.0
// @version     2.0
// @grant       none
// @description Redirect twimg to :orig (keep protocol, http or https)
// @downloadURL https://update.greasyfork.org/scripts/14669/twimg_redirect_orig2.user.js
// @updateURL https://update.greasyfork.org/scripts/14669/twimg_redirect_orig2.meta.js
// ==/UserScript==

var str = content.document.location + "";


str = str.replace( /:(large|orig).*$/, "");
//str = str.replace( /^https:/, "http:");
var ext = str.substr( str.length - 3, 3);
//console.log("ext="+ext);

var url = str + ":orig#." + ext;

window.location.replace( url );
