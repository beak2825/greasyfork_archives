// ==UserScript==
// @name         COVID-19流行下の日々を集団で記録する日誌 でキーボードでページ移動するスクリプト
// @namespace    https://enigmatic-brushlands-82725-herokuapp.com/
// @version      2025-05-05
// @description  COVID-19流行下の日々を集団で記録する日誌 でキーボードでページ移動するスクリプトです。
// @author       iHok
// @match        https://enigmatic-brushlands-82725-herokuapp.com/
// @match        https://enigmatic-brushlands-82725-herokuapp.com/records
// @match        https://enigmatic-brushlands-82725-herokuapp.com/records/*
// @exclude      https://enigmatic-brushlands-82725-herokuapp.com/new*
// @exclude      https://enigmatic-brushlands-82725-herokuapp.com/records/*/auth*
// @icon         https://enigmatic-brushlands-82725-herokuapp.com/assets/favicon-e4421da733950dad9ab52cf73adc2e206f5690d6e9eddc1abe62922d6f832c1e.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534994/COVID-19%E6%B5%81%E8%A1%8C%E4%B8%8B%E3%81%AE%E6%97%A5%E3%80%85%E3%82%92%E9%9B%86%E5%9B%A3%E3%81%A7%E8%A8%98%E9%8C%B2%E3%81%99%E3%82%8B%E6%97%A5%E8%AA%8C%20%E3%81%A7%E3%82%AD%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%89%E3%81%A7%E3%83%9A%E3%83%BC%E3%82%B8%E7%A7%BB%E5%8B%95%E3%81%99%E3%82%8B%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/534994/COVID-19%E6%B5%81%E8%A1%8C%E4%B8%8B%E3%81%AE%E6%97%A5%E3%80%85%E3%82%92%E9%9B%86%E5%9B%A3%E3%81%A7%E8%A8%98%E9%8C%B2%E3%81%99%E3%82%8B%E6%97%A5%E8%AA%8C%20%E3%81%A7%E3%82%AD%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%89%E3%81%A7%E3%83%9A%E3%83%BC%E3%82%B8%E7%A7%BB%E5%8B%95%E3%81%99%E3%82%8B%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

(()=> {
    'use strict';
    /*
    使い方
    ・ENTER、A、W、←で次のページに移動
    ・」、S、D、→で前のページに移動
    ・キーボードを変更したいときは、『javascript キーコード』で検索やデベロッパーツール＋↓のコメントアウトを外すなどで調べる→追加してください。
    */
    document.addEventListener('keydown', (e) => {
        //    キーを追加したいときは、以下のコメントアウト外して、キーコードを調べてください
        //    console.log(e.code);
        if(e.code === 'Enter'||e.code === 'KeyA'||e.code === 'KeyW'||e.code === 'ArrowLeft'){
            document.querySelector(".sibling__next > a[href*='/records/']")?.click()
        }
        if(e.code === 'Backslash'||e.code === 'KeyS'||e.code === 'KeyD'||e.code === 'ArrowRight'){
            document.querySelector(".sibling__previous > a[href*='/records/']")?.click()
        }
        return false;
    });
})();