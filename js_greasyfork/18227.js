// ==UserScript==
// @name         yy-auto-redir
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  redirect yy security warning page
// @author       LYC
// @include      http://redir.yy.duowan.com/warning.php?url=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18227/yy-auto-redir.user.js
// @updateURL https://update.greasyfork.org/scripts/18227/yy-auto-redir.meta.js
// ==/UserScript==
/* jshint -W097 */

document.location.href = unescape(document.location.href.match("url=(.*?)$")[1]);