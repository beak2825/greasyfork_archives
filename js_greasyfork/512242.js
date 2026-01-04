// ==UserScript==
// @name         Kimi History Eraser
// @namespace    http://tampermonkey.net/
// @version      2025-01-08
// @description  Help you delete all your kimi history!
// @author       xqm32
// @match        https://kimi.moonshot.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moonshot.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512242/Kimi%20History%20Eraser.user.js
// @updateURL https://update.greasyfork.org/scripts/512242/Kimi%20History%20Eraser.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const deleteAll = async () => {
        const token = window.localStorage.getItem("access_token");
        const chatListResp = await fetch("https://kimi.moonshot.cn/api/chat/list", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: "{}",
        });
        const chatList = await chatListResp.json();
        await Promise.all(
            chatList.items.map(async (chat) => {
                await fetch(`https://kimi.moonshot.cn/api/chat/${chat.id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });
            })
        );
        window.alert(`已删除${chatList.items.length}条`);
        window.location.reload();
    };
    new MutationObserver(() => {
        document.getElementById("deleteAll")?.remove();
        const element = document.querySelector(".history-modal-title");
        if (element === null) return;
        const deleteElement = document.createElement("button");
        element.after(deleteElement);
        deleteElement.id = "deleteAll";
        deleteElement.innerHTML = "删除所有历史对话";
        deleteElement.onclick = deleteAll;
    }).observe(document.querySelector("head"), {
        childList: true,
    });
})();