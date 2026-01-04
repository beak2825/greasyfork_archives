// ==UserScript==
// @name         Moodle Utilities
// @namespace    https://greasyfork.org/users/502323
// @version      2.0
// @description  extend session validy indefinitely and change dashboard default course view
// @author       John 5G
// @match        https://moodle.medtech.tn/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/419661/Moodle%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/419661/Moodle%20Utilities.meta.js
// ==/UserScript==

(function(open, send) {
    'use strict';
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        if (typeof url === "string") {
            if (url.includes("nosessionupdate=true")) {
                url = url.replace("nosessionupdate=true", "sessionupdate=true");
            }
            if (url.includes("core_course_get_enrolled_courses_by_timeline_classification")) {
                XMLHttpRequest.prototype.send = function(body) {
                    body = body ? body.replace('"classification":"all"', '"classification":"inprogress"') : body
                    send.call(this, body);
                }
            }
        }
        open.call(this, method, url, async, user, pass);
    };
})(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);