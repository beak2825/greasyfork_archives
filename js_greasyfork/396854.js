// ==UserScript==
// @name         MSCHF Discord Counter
// @namespace    https://mschf.xyz/
// @version      1.3
// @description  Counter bot lmao
// @author       why?
// @match        https://discordapp.com/channels/671536906290331676/673311648643285022
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/396854/MSCHF%20Discord%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/396854/MSCHF%20Discord%20Counter.meta.js
// ==/UserScript==

var token = localStorage.getItem('token').slice(1, -1);
console.log(token);

window.addEventListener('load', function (event) {
    'use strict';

    console.log('starting...');

    setInterval(function() {
        var message = document.querySelector('[class^="message-"]:last-child');
        var now = parseInt(message.querySelector('[class^="markup-"]').textContent);
        if (
            window.location.pathname !== "/channels/671536906290331676/673311648643285022" ||
            (document.querySelector('[class^="message-"]:nth-last-child(2)') && (parseInt(document.querySelector('[class^="message-"]:nth-last-child(2)').querySelector('[class^="markup-"]').textContent) !== now - 1))
        ) {
            console.log('Some nigga fucked it up.');
            return;
        }
        var username = message.querySelector('[class^="username-"]').textContent;
        var current = document.querySelector('[class^="sidebar-"] [class^="panels-"] [class^="container-"] [class^="size14-"]').textContent;
        if (username != current) {
            fetch('https://discordapp.com/api/v6/channels/673311648643285022/messages', {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({
                    content: now + 1,
                    nonce: Math.floor(Math.random() * (999999999999999999 - 100000000000000000 + 1)) + 999999999999999999,
                    tts: false
                })
            });
            console.log('it should be ' + (now + 1) + ' now')
        } else console.log(username + ' is you.');
    }, 6000);
});