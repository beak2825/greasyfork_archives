// ==UserScript==
// @name         Destiny Emblem Collector Localization
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  DECLocalization
// @author       xhl6699@https://github.com/xhl6666
// @match        *://destinyemblemcollector.com/*
// @exclude      *://destinyemblemcollector.com/destiny1*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=destinyemblemcollector.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/443167/Destiny%20Emblem%20Collector%20Localization.user.js
// @updateURL https://update.greasyfork.org/scripts/443167/Destiny%20Emblem%20Collector%20Localization.meta.js
// ==/UserScript==

// 给自动转换名字的后端开个api 定时更新mani 实现批量传入hash获取信息

const lang = "zh-cht"

GM_addStyle(`
.emblemtext > h2 {text-align: center;}
.emblemtext > p {text-align: center;}
`)

function getEmblemItemFromPage() {
    var items = document.querySelectorAll(".emblem")
    items = items.isPrototypeOf() == 0 && items.length == 0 ? ["^^"] : items
    return items
}

function getEmblemHash(emblemItem) {
    var emblemLink = emblemItem.querySelector("a");
    if (!emblemLink) {return "0"}
    emblemLink = emblemLink.href;
    // console.log(emblemLink);
    var emblemHash = emblemLink.match(/id=(\d{7,12})/)[1];
    return emblemHash
}

function changeEmblemName(emblemItem, newName, isDetailPage) {
    if (!newName) {console.log(emblemItem); return}
    if (!isDetailPage){
        emblemItem.querySelector(".emblemtext").querySelector("h2").innerHTML += "<br>" + newName;
    } else {
        document.querySelector(".gridemblem-emblemdetail").innerHTML += "<br>" + newName;
        document.querySelector(".gridheader-emblemdetail").querySelector("h1").innerHTML = (lang == "zh-cht") ? "徽章細節：" + newName : "徽章详情：" + newName ;
    }

}

function getEmblemDetailFromBungieApi(emblemItem, lang) {
    console.log(window.location.href);
    if (window.location.href.indexOf("emblem?id=") != -1){
        var isDetailPage = true
        emblemHash = window.location.href.match(/id=(\d{7,12})/)[1];
    } else {
        if (emblemItem == "^^") {return "0"}
        var isDetailPage = false;
        emblemHash = getEmblemHash(emblemItem)
    }
    if (emblemHash == "0") {console.log(emblemItem); return} //改成在名字后加上获取失败
    resp = GM_xmlhttpRequest({
        url:"https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/" + emblemHash + "?lc=" + lang,
        method :"GET",
        responseType: "json",
        headers: {
            "X-API-KEY": "aff47ade61f643a19915148cfcfc6d7d",
        }, 
        onload:function(data){
            var resp = data.response;
            if (!resp || !resp.hasOwnProperty("Response") || !resp.Response.hasOwnProperty("displayProperties") || !resp.Response.displayProperties.hasOwnProperty("name")) {console.log(data.finalUrl, resp); return}
            emblemName = resp.Response.displayProperties.name;
            changeEmblemName(emblemItem, emblemName, isDetailPage)
        }
    })
}

function translateTitleText() {
    var h1 = document.querySelector("h1")
    var h2 = document.querySelector(".no-emblem-message")
    if (h2) {     
        if (h2.innerText == "There are no Exotic rarity emblems in Destiny 2 yet") {h2.innerText = "天命2目前尚未出現異域級徽章"}
        else if (h2.innerText == "There are no Uncommon rarity emblems in Destiny 2 yet") {h2.innerText = "天命2中目前尚未出現罕見徽章"}
    }
    if (!h1) {return}
    switch (true) {
        case h1.innerText.match(/Total Number of Emblems In the DCV \(Destiny Content Vault\): (\d{1,4})/) && true: 
            h1.innerText = "目前存放於DCV（天命內容庫）中的徽章總數：" + RegExp.$1;
            break;
        case h1.innerText.match(/Total Number of Available Emblems: (\d{1,4})/) && true: 
            h1.innerText = "目前可供獲取的徽章總數：" + RegExp.$1;
            break;
        case h1.innerText.match(/Total Number of No Longer Available Emblems: (\d{1,4})/) && true: 
            h1.innerText = "目前無法獲取的徽章總數：" + RegExp.$1;
            break;
        case h1.innerText.match(/Total Number of Unreleased Emblems: (\d{1,4})/) && true: 
            h1.innerText = "目前尚未發佈的徽章總數：" + RegExp.$1;
            break;
        case h1.innerText.match(/Total Number of Universal Code Emblems: (\d{1,4})/) && true: 
            h1.innerText = "目前通用代碼徽章總數：" + RegExp.$1;
            break;
        case h1.innerText.match(/Total Number of Season 16 \(Season of the Risen & The Witch Queen\) Emblems: (\d{1,4})/) && true: 
            h1.innerText = "第16賽季可供獲得的徽章總數（鋒起季節&黑針巫后）：" + RegExp.$1;
            break;
        case h1.innerText.match("Destiny 2 Year 04 (Season 12 - 15) Emblems") && true: 
            h1.innerText = "天命2第4年（第12-15賽季）徽章";
            break;
        case h1.innerText.match("estiny 2 Year 03 (Season 08 - 11) Emblems") && true: 
            h1.innerText = "天命2第3年（第8-11賽季）徽章";
            break;
        case h1.innerText.match("Destiny 2 Year 02 (Season 04 - 07) Emblems") && true: 
            h1.innerText = "天命2第2年（第4-7賽季）徽章";
            break;
        case h1.innerText.match("Destiny 2 Year 01 (Season 01 - 03) Emblems") && true: 
            h1.innerText = "天命2第1年（第1-3賽季）徽章";
            break;
        case h1.innerText.match(/Total Number of Common Emblems: (\d{1,4})/) && true: 
            h1.innerText = "普通徽章總數：" + RegExp.$1;
            break;
        case h1.innerText.match(/Total Number of Rare Emblems: (\d{1,4})/) && true: 
            h1.innerText = "稀有徽章總數：" + RegExp.$1;
            break;
        case h1.innerText.match(/Total Number of Legendary Emblems: (\d{1,4})/) && true: 
            h1.innerText = "傳說徽章總數：" + RegExp.$1;
            break;
        case h1.innerText.match(/Total Number of Account Emblems: (\d{1,4})/) && true: 
            h1.innerText = "賬號徽章總數：" + RegExp.$1;
            break;
        case h1.innerText.match(/Total Number of Competitive Emblems: (\d{1,4})/) && true: 
            h1.innerText = "競賽對戰徽章總數：" + RegExp.$1;
            break;
        case h1.innerText.match(/Total Number of Gambit Emblems: (\d{1,4})/) && true: 
            h1.innerText = "千謀百計徽章總數：" + RegExp.$1;
            break;
        case h1.innerText.match(/Total Number of General Emblems: (\d{1,4})/) && true: 
            h1.innerText = "一般徽章總數：" + RegExp.$1;
            break;
        case h1.innerText.match(/Total Number of Open World Emblems: (\d{1,4})/) && true: 
            h1.innerText = "世界徽章總數：" + RegExp.$1;
            break;
        case h1.innerText.match(/Total Number of Raids Emblems: (\d{1,4})/) && true: 
            h1.innerText = "掠奪任務徽章總數：" + RegExp.$1;
            break;
        case h1.innerText.match(/Total Number of Seasonal Emblems: (\d{1,4})/) && true: 
            h1.innerText = "賽季徽章總數：" + RegExp.$1;
            break;
        case h1.innerText.match(/Total Number of Strikes Emblems: (\d{1,4})/) && true: 
            h1.innerText = "突擊任務代碼徽章總數：" + RegExp.$1;
            break;
        case h1.innerText.match(/Total Number of Trials of Osiris Emblems: (\d{1,4})/) && true: 
            h1.innerText = "歐西里斯的試煉徽章總數：" + RegExp.$1;
            break;
    }    
}

function translateGridHeaderText() {
    items = document.querySelectorAll(".gridheader-index")
    for (var item of items) {
        switch (item.innerText) {
            case "Time-Limited Emblems Currently Available\nThese emblems are only available for a short time, so act fast!": 
                item.innerHTML = "<h2>目前開放的限時徽章</h2><h3>可供獲取這些徽章的時間不長，快行動起來！</h3>";
                break;
            case "Upcoming Emblems\nThese emblems have yet to release, but we know where to get them!": 
                item.innerHTML = "<h2>即將推出的徽章</h2><h3>這些徽章尚未發佈，但是我們知道如何得到它們！</h3>";
                break;
            case "Emblems Only Available During This Current Season\nSeason 16: Season of the Risen runs from February 22nd, 2022 to May 24th, 2022": 
                item.innerHTML = "<h2>當前賽季限時徽章</h2><h3>第16賽季：鋒起賽季開始於2022年2月23日，結束於2022年5月25日</h3>";
                break;
            case "Purchase/Donation Emblems Currently Available\nThese emblems are available as part of a purchase, typically from the Bungie Store": 
                item.innerHTML = "<h2>購買及捐款獲得的徽章</h2><h3>這些徽章從購物或捐款活動中獲得，通常來自Bungie商店</h3>";
                break;
            case "Currently Available Emblems\nAll of the emblems in this list are currently available to obtain in Destiny 2": 
                item.innerHTML = "<h2>目前開放獲得的徽章</h2><h3>這個列表中的所有徽章目前都可以在天命2中獲得</h3>";
                break;
            case "Recently Added Emblems\nThese are the fifty (50) most recently added emblems (descending order)": 
                item.innerHTML = "<h2>最近新增的徽章</h2><h3>下方是最近50個新增的徽章（降序）</h3>";
                break;
            case "Emblems Currently In the Destiny Content Vault (DCV)\nThese emblems are currently in the DCV are are unavailable to earn at this time": 
                item.innerHTML = "<h2>目前處於天命內容庫（DCV）的徽章</h2><h3>這些處於DCV的徽章目前暫時無法獲得</h3>";
                break;
            case "Emblems No Longer Available\nThese emblems were available at one time in Destiny 2, but have been removed": 
                item.innerHTML = "<h2>無法被獲得的徽章</h2><h3>這些徽章在天命2中出現過一段時間，但是已被移除</h3>";
                break;
            case "Recently Added Destiny 2 Emblems\nThese are the ten (10) most recently added emblems to the Destiny 2 API": 
                item.innerHTML = "<h2>最近新增的天命2徽章</h2><h3>下方是最近于天命2 API中新增的10個徽章</h3>";
                break;
            case "Unreleased Emblems\nThese emblems have not yet been made available in Destiny 2 but are present in the database": 
                item.innerHTML = "<h2>尚未發佈的徽章</h2><h3>這些徽章已被添加至天命2數據庫但是尚未啟用</h3>";
                break;
            case "Universal Code Emblems\nThese emblems are available to everyone via a universal code. Go get 'em, Guardian!": 
                item.innerHTML = "<h2>通用代碼徽章</h2><h3>這些徽章對每一個守護者開放，快使用頁面中的通用代碼兌換它們！</h3>";
                break;
            case "Season 16 Emblems\nThese emblems will only be available during Season 16 (Season of the Risen) and The Witch Queen's launch, taking place from February 21st, 2022 to May 24th, 2022.": 
                item.innerHTML = "第16賽季的徽章\n這些徽章只能夠在第16賽季（鋒起季節）第5年資料片《黑針巫后》開放時進行獲取，獲取期間為2021年2月22日至2022年5月25日";
                break;
            case "Season 12 (Season of the Hunt) Emblems\nThese emblems were only available during Season 12 (Season of the Hunt) and Beyond Light's launch, taking place from November 10th, 2020 to February 9th, 2021.\nTotal number of emblems: 4": 
                item.innerHTML = "第12賽季（獵魔賽季）的徽章\n這些徽章僅於第12賽季（獵魔賽季）第4年資料片《光能之上》開放時進行獲取，獲取期間為2020年11月11日至2021年2月10日\n徽章總數：4";
                break;
            case "Season 08 (Season of the Undying) Emblems\nThese emblems were only available during Season 08 (Season of the Undying) and Shadowkeep's launch, taking place from October 1st, 2019 to December 10th, 2019.\nTotal number of emblems: 8": 
                item.innerHTML = "第8賽季（不朽賽季）的徽章\n這些徽章僅於第8賽季（不朽賽季）第3年資料片暗影要塞開放時進行獲取，獲取期間為2019年10月2日至2019年12月11日\n徽章總數：8";
                break;
            case "Season 04 (Forsaken) Emblems\nThese emblems were only available during Season 04 (Forsaken).\nTotal number of emblems: 3": 
                item.innerHTML = "第四賽季（遺落之族）的徽章\n這些徽章只能在第四賽季期間獲得\n徽章總數：3";
                break;
            case "Season 01 (Destiny 2) Emblems\nThese emblems were only available during Season 01 (Destiny 2).\nTotal number of emblems: 5": 
                item.innerHTML = "第一賽季（天命2）徽章\n這些徽章只能在第一賽季（天命2）期間獲得\n徽章總數：5";
                break;
            case "Uncommon Rarity Emblems": 
                item.innerHTML = "罕見";
                break;
            case "Common Rarity Emblems": 
                item.innerHTML = "普通";
                break;
            case "Rare Rarity Emblems": 
                item.innerHTML = "稀有";
                break;
            case "Legendary Rarity Emblems": 
                item.innerHTML = "傳說";
                break;
            case "Exotic Rarity Emblems": 
                item.innerHTML = "異域級";
                break;
            case "Account Emblems": 
                item.innerHTML = "賬號";
                break;
            case "Competitive Emblems\nThese emblems can come from both Crucible (PvP) and Gambit (PvPvE)": 
                item.innerHTML = "競賽對戰";
                break;
            case "Gambit Emblems": 
                item.innerHTML = "千謀百計";
                break;
            case "General Emblems": 
                item.innerHTML = "一般";
                break;
            case "Open World Emblems": 
                item.innerHTML = "世界";
                break;
            case "Raids Emblems": 
                item.innerHTML = "掠奪任務";
                break;
            case "Seasonal Emblems": 
                item.innerHTML = "賽季";
                break;
            case "Strikes Emblems": 
                item.innerHTML = "突擊任務";
                break;
            case "Trials of Osiris Emblems": 
                item.innerHTML = "奧西里斯的試煉";
                break;
            case "All Destiny 2 Emblems": 
                item.innerHTML = "全部天命2徽章";
                break;
        }

    }
}

translateGridHeaderText()
translateTitleText()
var emblemItems = getEmblemItemFromPage()
for (var item of emblemItems) {
    // console.log(item)
    getEmblemDetailFromBungieApi(item, lang);
    // break;
}

// var r = getEmblemDetailFromBungieApi();
// console.log(r)