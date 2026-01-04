// ==UserScript==
// @name         Hameln Tool02
// @namespace    https://greasyfork.org/ja/users/17828-amaicoffee
// @version      1.0.0
// @description  ハーメルンマイページで、栞を挟んだ話数＝最新話数のものを隠す
// @author       amaicoffee
// @license      MIT license
// @match        https://syosetu.org/?mode=login
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435493/Hameln%20Tool02.user.js
// @updateURL https://update.greasyfork.org/scripts/435493/Hameln%20Tool02.meta.js
// ==/UserScript==

// 栞最新10件 お気に入り最新10件 自動推薦（評価傾向）3件 自動推薦（お気に入り）3件


function addStyle() {
    console.log('addStyle()');
    const CENSORED_STYLE = document.createElement('style');
    CENSORED_STYLE.innerText = '.censored { display: none !important;}';
    // CENSORED_STYLE.innerText = '.censored { background-color: grey !important;}'; // デバッグ用
    document.head.appendChild(CENSORED_STYLE);
}

function shioriFilter() {
    console.log('shioriFilter()');
    const shiori_li_nl = document.querySelector('#aside').querySelectorAll('ul')[1].querySelectorAll('li');
    for (let i = 0; i < 10; i++) {
        const mae_wasuu = "全" + shiori_li_nl[i].querySelectorAll('a')[1].innerText;
        const ato_wasuu = shiori_li_nl[i].querySelectorAll('a')[2].innerText;
        if (mae_wasuu == ato_wasuu) {
            console.log("既読：" + shiori_li_nl[i].querySelector('a').innerText);
            shiori_li_nl[i].classList.add('censored');
        } else {
            console.log("未読：" + shiori_li_nl[i].querySelector('a').innerText);
        }

    }
}

function favFilter() {
    console.log('favFilter()');
    const fav_li_nl = document.querySelector('#aside').querySelectorAll('ul')[2].querySelectorAll('li');
    for (let i = 0; i < 10; i++) {
        // 栞ない作品もある。栞あるときだけ処理したい
        if (fav_li_nl[i].querySelectorAll('a').length == 3) {
            const mae_wasuu = fav_li_nl[i].querySelectorAll('a')[1].innerText;
            const ato_wasuu = "栞" + fav_li_nl[i].querySelectorAll('a')[2].innerText;
            if (mae_wasuu == ato_wasuu) {
                console.log("既読：" + fav_li_nl[i].querySelector('a').innerText);
                fav_li_nl[i].classList.add('censored');
            } else {
                console.log("未読：" + fav_li_nl[i].querySelector('a').innerText);
            }
        } else {
            console.log("未読：" + fav_li_nl[i].querySelector('a').innerText);
        }
    }
}

function noticeFilter(){
    console.log('noticeFilter()');
    const noticeDivNode = document.querySelector('#aside > div:nth-child(1)');
    const noticeNumText = document.querySelector('#aside > div:nth-child(1) > ul > li > a > strong').innerText;
    if(noticeNumText == '0'){
        console.log('通知：' + noticeNumText + '件のため通知欄を非表示');
        noticeDivNode.classList.add('censored');
    }
}

function main() {
    console.log('main()');
    addStyle();
    noticeFilter();
    shioriFilter();
    favFilter();
}

(function () {
    console.log('IIFE');
    setTimeout(main, 1 * 1000)
})();