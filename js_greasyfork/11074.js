// ==UserScript==
// @name        twimg redirect to original
// @namespace   https://mzile.net
// @version     1.3.2
// @description Redirect twimg to :orig
// @author      eai04191
// @license     MIT
// @supportURL  https://github.com/eai04191/twimg-redirect-to-original/issues
// @match       *://pbs.twimg.com/media/*
// @exclude     *://pbs.twimg.com/media/*name=orig
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11074/twimg%20redirect%20to%20original.user.js
// @updateURL https://update.greasyfork.org/scripts/11074/twimg%20redirect%20to%20original.meta.js
// ==/UserScript==

//https://pbs.twimg.com/media/ABC.jpg:large
//https://pbs.twimg.com/media/ABC?format=jpg&name=large

var url = window.document.location + "";
url = url.replace(/\?format=/, ".");
url = url.replace(/\&name=/, ":");
//https://pbs.twimg.com/media/ABC.jpg:large
//https://pbs.twimg.com/media/ABC.jpg:large

url = url.replace(/\.(?=[^.]*$)/, "?format=");
//https://pbs.twimg.com/media/ABC?format=jpg:large

url = url.replace( /(:large|:medium|:small|:orig|:thumb|:360x360|:900x900)/, "");
//https://pbs.twimg.com/media/ABC?format=jpg

window.location.replace( url + "&name=orig" );
//https://pbs.twimg.com/media/ABC?format=jpg&name=orig
