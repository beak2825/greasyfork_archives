// ==UserScript==
// @name         攻略サイトを◯そう(提案)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  アレな攻略サイトを除外するボタンを追加するだけのやつ
// @author       paselin
// @match        https://www.google.com/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395326/%E6%94%BB%E7%95%A5%E3%82%B5%E3%82%A4%E3%83%88%E3%82%92%E2%97%AF%E3%81%9D%E3%81%86%28%E6%8F%90%E6%A1%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/395326/%E6%94%BB%E7%95%A5%E3%82%B5%E3%82%A4%E3%83%88%E3%82%92%E2%97%AF%E3%81%9D%E3%81%86%28%E6%8F%90%E6%A1%88%29.meta.js
// ==/UserScript==

// ここに◯したいサイトのドメインを入れよう
// 例は主にゲーム攻略で検索妨害になるサイトだ！
const killSiteDomain = [
    "kamigame.jp",
    "game8.jp",
    "appmedia.jp",
    "gamewith.jp",
    "gamerch.jp"
];
const toolBar = document.getElementById("hdtb-msb");
var newWrapElement = document.createElement("div");
var newElement = document.createElement("div");
newElement.className = "hdtb-tl";
newElement.id = "hdtb-tls";
newElement.innerHTML = "攻略サイトを除外する";
newWrapElement.appendChild(newElement);
toolBar.appendChild(newWrapElement);

const clickEvent = function(){
    const query = document.getElementsByName("q")[0].value;
    // すでに-siteが入っていたら邪魔をしないようにする
    var newQuery = query;
    if(!query.includes("-site")){
        var killSiteQuery = "";
        killSiteDomain.forEach(function(element){
            killSiteQuery += " -site:" + element;
        });
        newQuery += killSiteQuery;
    }
    location.href = "https://www.google.com/search?q=" + newQuery;
};

newElement.addEventListener('click', clickEvent);