// ==UserScript==
// @name         Remove SuperChat
// @namespace    https://space.bilibili.com/703007996/
// @version      0.1
// @description  工具人下次不用劳驾你亲自删SC了
// @author       一个魂
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://greasyfork.org/scripts/417560-bliveproxy/code/bliveproxy.js?version=984333
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437792/Remove%20SuperChat.user.js
// @updateURL https://update.greasyfork.org/scripts/437792/Remove%20SuperChat.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const keywords = []; // list of keywords to be removed ['keyword1', 'keyword2', ...]
    bliveproxy.addCommandHandler('SUPER_CHAT_MESSAGE', command => {
        const { data } = command;
        const { id, message: msg } = data;
        if (keywords.length != 0) {
            console.log(msg);
            for (let i = 0; i < keywords.length; i++) {
                if (msg.includes(keywords[i])) {
                    RemoveSc(id);
                }
            }
        }
    });
    function RemoveSc(id) {
        const urlencoded = new URLSearchParams();
        urlencoded.append('id', id);
        urlencoded.append('csrf', document.cookie.match(/bili_jct=([0-9a-fA-F]{32})/)[1]);
        return new Promise((resolve, reject) => {
            fetch(`https://api.live.bilibili.com/av/v1/SuperChat/remove`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                body: urlencoded
            }
            ).then(response => response.json())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        })
    }
})();