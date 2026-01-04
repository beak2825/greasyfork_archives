// ==UserScript==
// @name         Show me your token
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  get the token from the request in this page
// @author       ddhjy
// @match        https://bytest-admin.bytedance.net/edge/publish/linux/cluster/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458168/Show%20me%20your%20token.user.js
// @updateURL https://update.greasyfork.org/scripts/458168/Show%20me%20your%20token.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var open = XMLHttpRequest.prototype.open;
    var headers = {};
    XMLHttpRequest.prototype.open = function() {
        console.log("XMLHttpRequest.open(method: " + arguments[0] + ", url: " + arguments[1] + ")");
        open.apply(this, arguments);
    };

    var setRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        headers[header] = value;
        setRequestHeader.apply(this, arguments);
    };

    var added = false;
    var send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        console.log("XMLHttpRequest.send(data: " + arguments[0] + ")");
        console.log("headers: ", headers);
        if(headers["X-Jwt-Token"] && !added) {
            added = true;
            var div = document.createElement("div");
            div.innerHTML = headers["X-Jwt-Token"];
            document.body.insertBefore(div, document.body.firstChild);
        }
        headers = {};
        send.apply(this, arguments);
    };

})();