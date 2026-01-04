// ==UserScript==
// @name         AtCoderVirtualContestNowColorize
// @namespace    https://github.com/tMasaaa
// @version      1.0.0
// @description  Colorize virtual contest being held now
// @author       kaito_tateyama
// @license      MIT
// @include      https://not-522.appspot.com/
// @downloadURL https://update.greasyfork.org/scripts/371707/AtCoderVirtualContestNowColorize.user.js
// @updateURL https://update.greasyfork.org/scripts/371707/AtCoderVirtualContestNowColorize.meta.js
// ==/UserScript==


// 現在時刻(ページを開いた時のみ)
const nowtime = new Date()

// テーブル取得
const table = document.querySelectorAll('.container > table > tbody > tr > td')

// 各コンテストの開始時刻をstart, 終了時刻をendに入れ、現在時刻と比較
for(let i=0;i<table.length; i+=3){
    let start = new Date(table[i+1].innerText)
    let end = new Date(table[i+2].innerText)
    if(start <= nowtime && nowtime < end) {
        table[i].style.backgroundColor = 'rgb(187, 242, 94, 0.5)'
        table[i+1].style.backgroundColor = 'rgb(187, 242, 94, 0.5)'
        table[i+2].style.backgroundColor = 'rgb(187, 242, 94, 0.5)'
    }
}