// ==UserScript==
// @name         dnvod.tv hack
// @namespace    https://greasyfork.org/zh-CN/scripts/29130-dnvod-tv-hack
// @version      0.3
// @description  try to take over the world! *** let this script run in the document-start ***
// @author       march511@gmail.com
// @match        http://www.dnvod.tv/Movie/Readyplay.aspx?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29130/dnvodtv%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/29130/dnvodtv%20hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var xhr = window.XMLHttpRequest;
    var open = xhr.prototype.open;
    xhr.prototype.open = function (method, url, async, user, password) {

        console.log('Checking', url);
        if (url.startsWith('/Movie/GetResource.ashx')) {

            this.addEventListener('load', function (e) {

                var result = JSON.parse(this.responseText);
                var url = result.http.provider;
                console.log('opening', url);
                window.open(url);

            });

        }

        return open.apply(this, arguments);
    };

}) ();