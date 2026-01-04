// ==UserScript==
// @name         [银河奶牛]将身上材料的数量导出为json文件
// @namespace    http://tampermonkey.net/
// @version      0.02
// @description  将身上材料的数量导出为json文件
// @author       Truth_Light
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @license      Truth_Light
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/513046/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%B0%86%E8%BA%AB%E4%B8%8A%E6%9D%90%E6%96%99%E7%9A%84%E6%95%B0%E9%87%8F%E5%AF%BC%E5%87%BA%E4%B8%BAjson%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/513046/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%B0%86%E8%BA%AB%E4%B8%8A%E6%9D%90%E6%96%99%E7%9A%84%E6%95%B0%E9%87%8F%E5%AF%BC%E5%87%BA%E4%B8%BAjson%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const itemList = {};
    let item_name_to_hrid, item_hrid_to_name;

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
            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 &&
                socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
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
            if (obj && obj.type === "init_client_data") {
                item_hrid_to_name = obj.itemDetailMap;
                for (const key in item_hrid_to_name) {
                    if (item_hrid_to_name[key] && typeof item_hrid_to_name[key] === 'object' && item_hrid_to_name[key].name) {
                        item_hrid_to_name[key] = item_hrid_to_name[key].name;
                    }
                }
                item_name_to_hrid = Object.fromEntries(
                    Object.entries(item_hrid_to_name).map(([key, value]) => [value, key])
                );
            } else if (obj && obj.type === "init_character_data") {
                let characterItems = obj.characterItems;
                characterItems.forEach(item => {
                    const itemName = item_hrid_to_name[item.itemHrid];
                    const itemCount = item.count;
                    if (itemList[itemName]) {
                        itemList[itemName] += itemCount;
                    } else {
                        itemList[itemName] = itemCount;
                    }
                });
                console.log(itemList);
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
        return message;
    }

    function downloadItemListAsFile() {
        const blob = new Blob([JSON.stringify(itemList, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "item_list.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    GM_registerMenuCommand("导出文件", downloadItemListAsFile);
    hookWS();
})();
