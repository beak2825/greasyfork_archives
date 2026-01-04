// ==UserScript==
// @name         [银河奶牛]行动监听模板
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  hookWS模板
// @author       Truth_Light
// @license      Truth_Light
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/519355/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E8%A1%8C%E5%8A%A8%E7%9B%91%E5%90%AC%E6%A8%A1%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/519355/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E8%A1%8C%E5%8A%A8%E7%9B%91%E5%90%AC%E6%A8%A1%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    let active_list
    function hookWS() {
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const oriGet = dataProperty.get;

        dataProperty.get = hookedGet;
        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

        function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) {
                return oriGet.call(this);
            }
            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
                return oriGet.call(this);
            }

            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message });

            return handleMessage(message);
        }
    }

    function handleMessage(message) {
        try {
            let obj = JSON.parse(message);
            if (obj && obj.type === "init_character_data") {
                active_list = formatActionInfo(obj);
            } else if (obj && obj.type === "action_completed" && active_list) {
                if (obj.endCharacterAction && obj.endCharacterAction.actionHrid) {
                    if (active_list["当前行动"] === obj.endCharacterAction.actionHrid && active_list["当前行动的次数"] <= obj.endCharacterAction.currentCount) {
                        active_list["当前行动的次数"] = obj.endCharacterAction.currentCount;
                    } else {
                        sent_message(obj.endCharacterAction.actionHrid);
                        active_list = {
                            "当前行动": obj.endCharacterAction.actionHrid,
                            "当前行动的次数": obj.endCharacterAction.currentCount
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
        return message;
    }

    function formatActionInfo(obj) {
        const characterActions = obj.characterActions;

        if (characterActions && characterActions.length > 0) {
            const action = characterActions[0];
            const actionHrid = action.actionHrid;
            const currentCount = action.currentCount;
            return {
                "当前行动": actionHrid,
                "当前行动的次数": currentCount
            };
        }
    }
    function sent_message(new_active) {
        const message = `行动已切换\n之前行动: ${active_list["当前行动"].match(/\/actions\/([^\/]*)/)[1]}\n行动次数: ${active_list["当前行动的次数"]}\n当前行动: ${new_active.match(/\/actions\/([^\/]*)/)[1]}`
        console.log(message)
    }
    hookWS();
    //可以选择监听actions_updated，这个也能显示详细的行动数据，但是在用户设置队列和取消队列的时候也会触发
})();
