// ==UserScript==
// @name         Twitter image url fix
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  append :orig to the end of twitter image urls
// @author       TehPolecat
// @match        https://pbs.twimg.com/media/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369823/Twitter%20image%20url%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/369823/Twitter%20image%20url%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = window.location.href;
    if (url.indexOf("name=") > -1) return;
    var parts = url.split('/');
    var filePart = parts[parts.length - 1].replace('?', '');
    var colonIndex = filePart.indexOf(":")
    if (colonIndex > -1) {
       filePart = filePart.substring(0, colonIndex);
    }
    parts[parts.length - 1] = filePart + "?format=" + filePart.split('.')[1] + "&name=orig";
    window.location.replace(parts.join("/"));
})();