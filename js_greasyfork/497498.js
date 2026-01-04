// ==UserScript==
// @name         簡易ツイ消しマシン
// @namespace    https://x.com/cyberyurayura
// @version      2024-06-10
// @description  全自動ツイ消し＋RT解除
// @author       yura
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497498/%E7%B0%A1%E6%98%93%E3%83%84%E3%82%A4%E6%B6%88%E3%81%97%E3%83%9E%E3%82%B7%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/497498/%E7%B0%A1%E6%98%93%E3%83%84%E3%82%A4%E6%B6%88%E3%81%97%E3%83%9E%E3%82%B7%E3%83%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';
const button = document.createElement("div");
button.style.position = "fixed";
button.style.top = "10px";
button.style.left = "10px";
button.textContent = "ツイ消し開始";
button.style.color = "red";
button.style.cursor = "pointer";
button.addEventListener("click", delete_all);
const body = document.body;
body.appendChild(button);

function delete_all() {
    setInterval(() => {
        //まず、先頭のmoreボタンを押す
        console.log("三点ボタンを探しています…");
        const all_moreButton = document.querySelectorAll('.css-175oi2r');
        const actual_moreButton = Array.from(all_moreButton).filter(element => {
            return element.parentNode.parentNode.parentNode.getAttribute('aria-label') == "もっと見る";
        });
        console.log("三点ボタンが見つかりました。先頭を疑似クリックします。")
        actual_moreButton[0].click();
        setTimeout(() => {
            const all_deleteButton = document.querySelectorAll(".css-1jxf684");
            const actual_deleteButton = Array.from(all_deleteButton).filter(element => {
                return element.innerHTML == "削除";
            });
            //削除ボタンが存在しなければRTなので、解除する
            if (actual_deleteButton.length == 0) {
                console.log("RTを検知しました。RT解除します。");
                actual_moreButton[0].click();
                setTimeout(() => {
                    const all_rtButton = document.querySelectorAll(".css-175oi2r");
                    const actual_rtButton = Array.from(all_rtButton).filter(element => {
                        const ariaLabel = element.parentNode.parentNode.parentNode.getAttribute('aria-label');
                        return ariaLabel && ariaLabel.includes("リポストしました");
                    });
                    actual_rtButton[0].click();
                    setTimeout(() => {
                        const all_deRTButton = document.querySelectorAll(".css-1jxf684");
                        const actual_deRTButton = Array.from(all_deRTButton).filter(element => {
                            return element.innerHTML == "ポストを取り消す";
                        });
                        actual_deRTButton[0].click();
                        console.log("RT解除が正常に完了しました。");
                    }, 500);
                }, 500);
            //存在する場合は削除
            } else {
                console.log("自身のツイートを検知しました。削除します。");
                actual_deleteButton[0].parentNode.parentNode.parentNode.click();
                setTimeout(() => {
                    //削除確定
                    const all_deleteEnterButton = document.querySelectorAll(".css-1jxf684");
                    const actual_deleteEnterButton = Array.from(all_deleteEnterButton).filter(element => {
                        return element.innerHTML == "削除";
                    });
                    actual_deleteEnterButton[0].parentNode.parentNode.parentNode.click();
                    console.log("削除が正常に完了しました。");
                }, 500);
            }
        }, 500);
    }, 2000);
}
})();