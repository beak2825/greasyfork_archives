// ==UserScript==
// @name        3939 Auto Vote
// @namespace   https://greasyfork.org
// @version     0.0.1
// @description 自動投票
// @author      Pixmi
// @icon        http://www.google.com/s2/favicons?domain=https://y3939.net/
// @match       https://y3939.net/*
// @license     MIT
// @run-at      document-body
// @downloadURL https://update.greasyfork.org/scripts/458165/3939%20Auto%20Vote.user.js
// @updateURL https://update.greasyfork.org/scripts/458165/3939%20Auto%20Vote.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function delay(sec = 1) {
        return new Promise((resolve) => {
            setTimeout(resolve, sec * 1000);
        })
    }

    async function vote() {
        await delay()
        .then(() => {
            const voteButton = document.body.querySelector('#btn_vote');
            voteButton.dispatchEvent(new Event('click'), {});
            return delay();
        })
        .then(() => {
            const voteDialot = document.body.querySelector('#jBox8 #vote_dialog');
            voteDialot.querySelector('.vote_selection:first-child').classList.add('alert-success');
            voteDialot.querySelector('.btn_votepoll').dispatchEvent(new Event('click'), {});
        })
    }

    const observeConfig = {
        childList: true,
        attributes: false,
        characterData: false,
    };

    const ChatObserver = new MutationObserver(function (mutations) {
        mutations.forEach((record) => {
            if (record.addedNodes.length) {
                record.addedNodes.forEach((item) => {
                    let message = item.querySelector(".msg_text");
                    message.querySelector("span.time").remove();
                    if (/^#vote/.test(message.textContent)) vote();
                });
            }
        });
    });

    let bot = setInterval(() => {
        let ChatList = document.body.querySelector("#msg_table > tbody");
        if (ChatList) {
            ChatObserver.observe(ChatList, observeConfig);
            console.log('auto vote enabled.')
            clearInterval(bot);
        }
    }, 2000);
})();