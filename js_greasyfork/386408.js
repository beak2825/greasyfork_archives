// ==UserScript==
// @name         lolalytics is always japanese language
// @namespace    https://greasyfork.org/users/299154-rnnqq
// @version      0.1
// @description  なんか画面切り替えると英語に戻って日本語でチャンプ検索してたら時間なくなってルーンぐちゃぐちゃで始めさせられてイライラしたから作った
// @author       rnnqq
// @include      https://lolalytics.com/*
// @exclude      https://lolalytics.com/jpn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386408/lolalytics%20is%20always%20japanese%20language.user.js
// @updateURL https://update.greasyfork.org/scripts/386408/lolalytics%20is%20always%20japanese%20language.meta.js
// ==/UserScript==

(function() {
    var URL1 = location.href
    URL1 = URL1.slice("https://lolalytics.com/"+1) //+1って何？よくわからんけど動いた
    var jpURL = "https://lolalytics.com/jpn/"+location.href; //ここのjpnを書き換えれば好きな言語にできる
    location.href = jpURL;
})();
//ページ内のURLを直接変更したほうがスマートだけどやり方がわからないから調べ中