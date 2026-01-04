// ==UserScript==
// @name         Science Tokyo Portal Login Part1 公開用
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A login script for ScienceTokyo Portal first factor.
// @author       Amanami_217
// @match        https://isct.ex-tic.com/auth/session
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532695/Science%20Tokyo%20Portal%20Login%20Part1%20%E5%85%AC%E9%96%8B%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532695/Science%20Tokyo%20Portal%20Login%20Part1%20%E5%85%AC%E9%96%8B%E7%94%A8.meta.js
// ==/UserScript==
//改変、再配布を認めますが、必ず原著者を明記してください。

//使い方
//「関数定義」の「ユーザー名を入力」のところにユーザー名、「パスワードを入力」のところにパスワードを入力
//Part2に続く

(function() {

//Timeline
//setTimeout(関数,累積時間ミリ秒)

setTimeout(username1,200);
setTimeout(username2,400);
setTimeout(switching,600);
setTimeout(password1,800);
setTimeout(password2,1000);

})();

//関数定義

//Section 1

function username1() {
    document.querySelector("#identifier").value = "xxxx0000";//ユーザー名を入力
}

function username2() {
    document.querySelector(".btn.btn-info").click();
}

function switching() {
    document.querySelector("#password-form-selector").click();
}

function password1() {
    document.querySelector("#password").value = "password1234";//パスワードを入力
}

function password2() {
    document.querySelector(".btn.btn-info").click();
}