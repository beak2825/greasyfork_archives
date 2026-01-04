// ==UserScript==
// @name         All Approve and Decline Pending Request for Discord
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  All Approve and Decline friend requests.
// @author       waki285
// @match        *discord.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/440840/All%20Approve%20and%20Decline%20Pending%20Request%20for%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/440840/All%20Approve%20and%20Decline%20Pending%20Request%20for%20Discord.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    var $ = window.$;
    const config = { attributes: true, childList: true, subtree: true };
    const callback = () => {
        var r = $($("div#pending-tab").children()[1]);
        var m = $(r.children()[0]);
        m.html(`保留中 ー <span class="item-3mHhwr item-3XjbnG themed-2-lozF" role="tab" aria-selected="false" aria-controls="pending-tab" aria-disabled="false" tabindex="-1"  id="all-approve-pending">すべて承諾</span> <span class="item-3mHhwr item-3XjbnG themed-2-lozF" role="tab" aria-selected="false" aria-controls="pending-tab" aria-disabled="false" tabindex="-1" id="all-decline-pending">すべて拒否</span>`);
        $("#all-approve-pending").on("click", async () => {
            window.dispatchEvent(new Event('beforeunload'));
            const ls = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;
            const token = JSON.parse(localStorage.token);
            const _ = { headers: { Authorization: token, "Content-Type": "application/json" }};
            const __ = await (await fetch("https://discord.com/api/v9/users/@me/relationships", _)).json();
            const ___ = __.filter(x => x.type === 3);
            for (let i = 0; i < 50; i++) {
                if (!___.length) return alert("All Approved")
                const ____ = ___[i];
                await fetch("https://discord.com/api/v9/users/@me/relationships/" + ____.id, { ..._, method: "PUT", body: JSON.stringify({}) });
                console.log(`Successfully Approved: ${____.id}`);
            }
        });
        $("#all-decline-pending").on("click", async () => {
            window.dispatchEvent(new Event('beforeunload'));
            const ls = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;
            const token = JSON.parse(localStorage.token);
            const _ = { headers: { Authorization: token }};
            const __ = await (await fetch("https://discord.com/api/v9/users/@me/relationships", _)).json();
            const ___ = __.filter(x => x.type === 3);
            for (let i = 0; i < 50; i++) {
                if (!___.length) return alert("All Declined")
                const ____ = ___[i];
                await fetch("https://discord.com/api/v9/users/@me/relationships/" + ____.id, { ..._, method: "DELETE",});
                console.log(`Successfully Declined: ${____.id}`);
            }
        })
    };/*
    const observer = new MutationObserver(callback);
    observer.observe(target, config);*/
    const observer = async () => new Promise((resolve, reject) => {
        if (document.getElementById("pending-tab")) resolve();
        setInterval(() => {
            if (document.getElementById("pending-tab")) resolve();
        }, 250);
    });
    const notObserver = async () => new Promise((resolve, reject) => {
        if (!document.getElementById("pending-tab")) resolve();
        setInterval(() => {
            if (!document.getElementById("pending-tab")) resolve();
        }, 250);
    });
    while (true) {
        await observer();
        callback();
        await notObserver();
    };
})();