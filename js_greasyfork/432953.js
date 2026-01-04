// ==UserScript==
// @name         Steam - 添加搜索按鈕
// @namespace    http://tampermonkey.net/
// @version      0.8.3
// @description  在Steam商店頁面加上搜索按鈕
// @author       CatTime
// @match        http*://store.steampowered.com/app/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/432953/Steam%20-%20%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/432953/Steam%20-%20%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function () {

    // 1. 定義包含名稱和網址的陣列
    const websites = [
        { name: "FitGirl", url: "https://fitgirl-repacks.site/?s={1}" },
        { name: "online-fix", url: "https://online-fix.me/index.php?do=search&subaction=search&story={1}" },
        { name: "PSearchEngine", url: "https://cse.google.com/cse?cx=20c2a3e5f702049aa&q={1}" },
        { name: "RaveGameSearch", url: "https://ravegamesearch.pages.dev/#gsc.tab=0&gsc.q={1}" },
        { name: "GOG-Games", url: "https://gog-games.to/?search={1}" },
        { name: "ElAmigos", url: "https://www.google.com.tw/search?q={1}+site%3Aelamigos.site" },
        { name: "GLOAD", url: "https://gload.to/?s={1}"}
    ];
    var appNamearr = [];
    const appid = (window.location.pathname.match(/\/app\/(\d+)/) ?? [null, null])[1];
    if (appid === null) { return; }
    let appName;

    fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}&l=english`)
        .then(response => response.json())
        .then(data => {
            if (data[appid].success) {
                appName = data[appid].data.name;
                // 在此可以使用 appName 進行其他程式碼的處理
                const args = [appid, appName];
                // 2. 在網頁 div.purchase_area_spacer 後面插入多個按鈕
                const purchaseAreaSpacer = document.querySelector("div.purchase_area_spacer");
                const button = document.createElement("div");
                button.classList.add("btn_addtocart");

                for (let i = 0; i < websites.length; i++) {
                    const website = websites[i];


                    const link = document.createElement("a");
                    link.classList.add("btn_green_steamui", "btn_medium");
                    var url = website.url;
                    url = url.replace(/{(\d)}/g, (match, index) => args[index]);

                    link.setAttribute("href", url);
                    link.setAttribute("target", "_blank");
                    const span = document.createElement("span");
                    span.textContent = website.name;
                    link.appendChild(span);
                    button.appendChild(link);

                }
                purchaseAreaSpacer.insertAdjacentElement("afterend", button);
            }
        })
        .catch(error => console.error(error));



})();


