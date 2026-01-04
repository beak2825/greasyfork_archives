// ==UserScript==
// @name         Redirect localhost or 127.0.0.1 to your pc's true ip address
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Redirect localhost or 127.0.0.1 to your pc's true ip address. 自动将浏览器url的localhost或127.0.0.1跳转到本机当前ip地址，方便web开发。
// @author       aisin
// @include      http://localhost*
// @include      http://127.0.0.1*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376204/Redirect%20localhost%20or%20127001%20to%20your%20pc%27s%20true%20ip%20address.user.js
// @updateURL https://update.greasyfork.org/scripts/376204/Redirect%20localhost%20or%20127001%20to%20your%20pc%27s%20true%20ip%20address.meta.js
// ==/UserScript==

// 代码来源网络，本人只是稍作修改以方便遇到和我同样问题的人，如有侵权请留言告知，我好删除，谢谢。
(function () {
    'use strict';

    var conn = new RTCPeerConnection({
        iceServers: []
    });

    var noop = function () {};

    conn.onicecandidate = function (ice) {
        if (ice.candidate) {
            var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
            var ip_addr = ip_regex.exec(ice.candidate.candidate)[1];
            var url = window.location.href;

            window.location = url.replace(/localhost|127.0.0.1/gi, ip_addr);
            conn.onicecandidate = noop;
        }
    };

    conn.createDataChannel('aisin');
    conn.createOffer(conn.setLocalDescription.bind(conn), noop);
})();