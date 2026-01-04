// ==UserScript==
// @name         convenient-nuportal-info
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  うざいお知らせを非表示にできる
// @author       p41412
// @match        https://portal.nagoya-u.ac.jp/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388417/convenient-nuportal-info.user.js
// @updateURL https://update.greasyfork.org/scripts/388417/convenient-nuportal-info.meta.js
// ==/UserScript==

(() => {
    // スクロール長いのをなくす
    (() => {
        const info = document.getElementById("info");
        if (info === null) {
            return;
        }
        info.style.minHeight = 0;
    })();

    // 全部表示ボタンを作る
    (() => {
        const info = document.getElementById("info");
        if (info === null) {
            return;
        }
        // お知らせのところ
        const h2 = info.getElementsByTagName("h2")[0];
        const div = document.createElement("div");
        div.innerText = "全て表示する";
        div.style = "height:34px;font-size:16px;border-radius:17px;padding:0 15px;background-color:#42A269;line-height:34px;float:right;color:white;cursor:pointer;";
        div.addEventListener("click", (() => {
            localStorage.clear();
            location.reload();
        }));
        h2.appendChild(div);
    })();

    // 非表示にするボタン
    (() => {
        const info = document.getElementById("info");
        if (info === null) {
            return;
        }
        const articles = Array.from(info.getElementsByTagName("article"));
        articles.map((article) => {
            // localStorageでhiddenになっていたら消す
            if (localStorage.getItem(article.getElementsByTagName("header")[0].innerHTML) === "hidden") {
                article.remove();
                return;
            }
            // 非表示にするボタンを作る
            const div = document.createElement("div");
            div.innerText = "非表示にする";
            div.className = "info-tag";
            div.style = "position:absolute;right:10px;bottom:10px;color:white;cursor:pointer;";
            div.addEventListener("click", ((e) => {
                localStorage.setItem(e.target.parentElement.getElementsByTagName("header")[0].innerHTML, "hidden");
                e.target.parentElement.remove();
            }));
            article.style = "position:relative";
            article.appendChild(div);
        });
    })();
})();