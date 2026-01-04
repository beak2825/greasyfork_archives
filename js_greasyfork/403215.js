// ==UserScript==
// @name         eventbrite Activity add assistant
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       zmg
// @include      https://www.eventbrite.com/e/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/403215/eventbrite%20Activity%20add%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/403215/eventbrite%20Activity%20add%20assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var add_btn_html = '<div><a id="add_event_btn" style="position: fixed;right: 20px;bottom: 20px;padding: 8px 16px;border-radius: 4px;background: #f66;color: #fff;font-size: 16px;cursor: pointer;">add event</a></div>';
    $("body").append(add_btn_html);

    $(function () {
        var eventUrl = window.location.href;
        var temp = "http://content-console.hicoin.io/recommends/events/new?eventurl=" + eventUrl
        $("#add_event_btn").click(function () {
            window.open(temp,"_blank")
        });
    });

})();