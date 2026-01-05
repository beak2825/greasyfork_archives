/*

Following code belongs to Auto Refresh for Google+.
Copyright (C) 2017 Jackson Tan
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.

*/

// ==UserScript==
// @id             GPlusAutoRefresh
// @name           Auto Refresh for Google+
// @version        0.1.0
// @namespace      gplus.autorefresh
// @author         Jackson Tan
// @description    Auto Post Refresh for Google+
// @include        https://plus.google.com/*
// @exclude        /https://plus\.google\.com(/u/\d+)?/?stream/circles/.+/i
// @exclude	       /https://plus\.google\.com(/u/\d+)?/?b/.+/i
// @run-at         document-end
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/28468/Auto%20Refresh%20for%20Google%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/28468/Auto%20Refresh%20for%20Google%2B.meta.js
// ==/UserScript==


(function () {
    'use strict';
    var constants = {
        POST_CLASS_NAME: 'V2SCpf vCjazd',
        POST_UID_ATTRIBUTE: 'data-iid',
        POST_COLUMN_CONTAINER: 'H68wj jxKp7'
    };

    function getCurrentPostList() {
        var elements = document.getElementsByClassName(constants.POST_CLASS_NAME);
        var list = [];

        Array.prototype.forEach.call(elements, function (e) {
            list.push(e.getAttribute(constants.POST_UID_ATTRIBUTE));
        });

        return list;
    }

    function handleResponse(newPost, lastInsertIndex) {
        var currentPost = getCurrentPostList();
        var newNodes = newPost.filter(
            function (e) {
                return currentPost.indexOf(e.getAttribute(constants.POST_UID_ATTRIBUTE)) < 0;
            }
        ).reverse();

        var parentNodes = document.getElementsByClassName(constants.POST_COLUMN_CONTAINER);
        var parentLength = parentNodes.length;

        Array.prototype.forEach.call(newNodes, function (e, i) {
            insertIndex = (lastInsertIndex + 1) % parentLength;
            var parentNode = parentNodes[insertIndex];
            insertIndex === 0 ? parentNode.insertBefore(e, parentNode.firstChild.nextSibling) : parentNode.insertBefore(e, parentNode.firstChild);
        });
    }

    function getUpdatePostList(handler, lastInsertIndex) {
        var http = new XMLHttpRequest();
        var url = document.URL.match(/https:\/\/plus\.google\.com(\/b\/\d+)/) != undefined ? document.URL.match(/https:\/\/plus\.google\.com(\/b\/\d+)/)[0] : document.URL.match(/https:\/\/plus\.google\.com(\/u\/\d)?/)[0];
        url += location.search.indexOf("?") != -1 ? '/' + location.search + '&_reqid=' + (new Date().getTime() % 1000000) + '&rt=j' : '/?_reqid=' + (new Date().getTime() % 1000000) + '&rt=j';
        http.open("GET", url, true);

        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=UTF-8");
        http.responseType = 'document';
        http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
                var body = http.responseXML.body;
                var elements = body.getElementsByClassName(constants.POST_CLASS_NAME);
                var list = [];

                Array.prototype.forEach.call(elements, function (e) {
                    list.push(e);
                });

                handler(list, lastInsertIndex);
            }
        };
        http.send();
    }

    var insertIndex = -1;
    setInterval(function () { getUpdatePostList(handleResponse, insertIndex); }, 10000);
})();