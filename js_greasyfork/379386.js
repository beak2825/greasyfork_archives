// ==UserScript==
// @name        SteamDeveloperAndPublisherSearch
// @name:zh-CN  Steam开发商/发行商旧版搜索
// @description Use legacy search when the developer/publisher link is clicked.
// @description:zh-cn 商店页点击开发商或发行商链接将使用旧版本搜索。
// @namespace   https://greasyfork.org/users/255836-icue
// @version     0.70
// @match       https://store.steampowered.com/app/*
// @downloadURL https://update.greasyfork.org/scripts/379386/SteamDeveloperAndPublisherSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/379386/SteamDeveloperAndPublisherSearch.meta.js
// ==/UserScript==

var elements = document.getElementsByClassName("summary column");
for (var i = 0; i < elements.length; i++) {
    if (elements.item(i).id === "developers_list") {
        elements.item(i).querySelectorAll("a").forEach(function (node) {
            if (node.text && node.text !== "") {
                node.href = "https://store.steampowered.com/search/?developer=" + node.text;
            }
        });
        // elements.item(i + 1) should be the publisher list
        if (i + 1 >= elements.length) {
            break;
        }
        elements.item(i + 1).querySelectorAll("a").forEach(function (node) {
            if (node.text && node.text !== "") {
                node.href = "https://store.steampowered.com/search/?publisher=" + node.text;
            }
        });
        break;
    }
}