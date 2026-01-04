// ==UserScript==
// @name         ニコニコ動画 最大画質に自動で設定
// @namespace    https://github.com/Edamamesukai
// @version      1.1
// @description  プレミアム会員じゃなくても動作するよ
// @author       Edamame_sukai
// @match        https://www.nicovideo.jp/watch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474753/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E6%9C%80%E5%A4%A7%E7%94%BB%E8%B3%AA%E3%81%AB%E8%87%AA%E5%8B%95%E3%81%A7%E8%A8%AD%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/474753/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%20%E6%9C%80%E5%A4%A7%E7%94%BB%E8%B3%AA%E3%81%AB%E8%87%AA%E5%8B%95%E3%81%A7%E8%A8%AD%E5%AE%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 最初のウィンドウの垂直方向の位置を定数として定義
    const windowY = window.pageYOffset;

    // サイトが完全に読み込まれてから実行する
    const pageLoad = setInterval(function(){
        if (document.getElementsByClassName("PlayerOptionMenuItem VideoQualityMenuItem")[0]) {
            if (document.getElementsByClassName("PlayerOptionMenuItem VideoQualityMenuItem")[0].lastChild.lastChild.className === "PlayerOptionDropdown is-active" && document.getElementsByClassName("PlayerOptionMenuItem VideoQualityMenuItem")[0].lastChild.firstChild.lastChild.children.length !== 0) {
                clearInterval(pageLoad);

                for(var VideoQualityItem of document.getElementsByClassName("PlayerOptionMenuItem VideoQualityMenuItem")[0].lastChild.firstChild.lastChild.children){
                    if (VideoQualityItem.firstChild.className !== "PlayerOptionDropdownItem is-disabled-by-premium") {
                        VideoQualityItem.firstChild.click();
                        console.log(`画質を ${VideoQualityItem.firstChild.innerHTML} に設定しました`);
                        break;
                    }
                }
                document.querySelector('[data-title="設定"]').click();
                // もし動画が再生されてなかったら、再生する
                const videoStart = setInterval(function(){
                    if (document.querySelector('[data-title="停止"]')) {
                        clearInterval(videoStart);
                        console.log("動画が再生されてます");
                    } else {
                        document.querySelector('[data-title="再生"]').click();
                    }
                }, 1000)
                }
            else if (document.getElementsByClassName("PlayerOptionMenuItem VideoQualityMenuItem")[0].lastChild.firstChild.firstChild !== undefined && document.getElementsByClassName("PlayerOptionMenuItem VideoQualityMenuItem")[0].lastChild.lastChild.className === "PlayerOptionDropdown") {
                document.getElementsByClassName("PlayerOptionMenuItem VideoQualityMenuItem")[0].lastChild.firstChild.firstChild.click();
            }
        } else if (document.getElementsByClassName("PlayerOptionContainer")[0] === undefined) {
            document.querySelector('[data-title="設定"]').click();
            // ウィンドウの位置を最初の読み込み位置に直す
            window.scroll(0, windowY);
        }
    }, 10);

})();