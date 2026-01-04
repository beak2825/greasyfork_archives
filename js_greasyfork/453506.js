// ==UserScript==
// @name         CLAIM TICKETS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  kinesio chupapija
// @author       pacufo
// @match        https://www.managerzone.com/?p=event
// @icon         https://www.google.com/s2/favicons?domain=managerzone.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453506/CLAIM%20TICKETS.user.js
// @updateURL https://update.greasyfork.org/scripts/453506/CLAIM%20TICKETS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    claim();

    function claim() {
        var time = 55000;
        var x = allowed();
        var checkExist = setInterval(function() {
            var claim = document.getElementById('claim');
            claim.click();
            clearInterval(checkExist);
        }, time);
        var check2 = setInterval(function() {
            location.reload();
        }, 55000);
    }

    function allowed() {
    let e = !1,
        jj = ['tactics_box', 'hub-intro', 'flex-wrap hub-widget-container', 'responsive-show', 'team-badge', 'floatRight', 'presentation', 'tactics_hub', 'tactics_1', 'tactics_2', 'tactics_3', 'tactics_box', 'hub-intro', 'flex-wrap hub-widget-container', 'responsive-show', 'team-badge', 'floatRight', 'presentation', 'tactics_hub', 'tactics_1', 'tactics_2', 'tactics_3', 'tactics_box', 'hub-intro', 'flex-wrap hub-widget-container', 'responsive-show', 'team-badge', 'floatRight', 'presentation', 'tactics_hub', 'tactics_1', 'tactics_2', 'tactics_3', 'tactics_box', 'hub-intro', 'flex-wrap hub-widget-container', 'responsive-show', 'team-badge', 'floatRight', 'presentation', 'tactics_hub', 'tactics_1', 'tactics_2', 'tactics_3'],
        a = [{
            u: "c2Fza2UxNw==",
            m: "RVJST1IhIEVzdGUgc2NyaXB0IG5vIGZ1bmNpb25hIGNvbiBwZWxvdHVkb3MuIE1lam9yIGFuZGEgYSBoYWNlcnRlIHVuYSBwYWphLg=="
        }, {
            u: "bWF4d2VsbHNtYXJ0ODE=",
            m: "RWwgc2lzdGVtYSBoYSBkZXRlY3RhZG8gcXVlIHVzdGVkIGVzIGRlbWFzaWFkbyB0cmFtcG9zbyBwYXJhIHVzYXIgZXN0YSBoZXJyYW1pZW50YS4="
        }, {
            u: "bHVra2s0MQ==",
            m: "VXN0ZWQgZXMgdW4gdHJhbXBvc28geSBubyB0aWVuZSBwZXJtaXRpZG8gdXNhciBsYSBoZXJyYW1pZW50YS4="
        }, {
            u: "ZGFya2xpbmU=",
            m: "RWwgc2lzdGVtYSBoYSBkZXRlY3RhZG8gcXVlIHVzdGVkIGVzIHVuIHBlbG90dWRvIHkgbm8gdGllbmUgcGVybWl0aWRvIHVzYXIgbGEgaGVycmFtaWVudGEu"
        }, {
            u: "a2luZXNpbzEw",
            m: "TG9zIHBlbG90dWRvcyBjb21vIHZvcyBubyB0aWVuZW4gcGVybWl0aWRvIHVzYXIgbGEgaGVycmFtaWVudGEgcG9yIGhhYmVyIGFycnVpbmFkbyBlbCBmb3JvLg=="
        }],
        t = document.getElementById("header-username").textContent;
        for (var o = 0; o < a.length; ++o) window.atob(a[o].u) === t && (e = window.atob(a[o].m));
        return e
    }








})();