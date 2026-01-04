// ==UserScript==
// @name        AtCoder Editorial Cover
// @version      1.0
// @description AtCoderの解説を隠し、ボタンを押して少しずつ表示させる
// @include     https://atcoder.jp/contests/*/editorial/*
// @namespace https://github.com/milkcoffeen
// @auther milkcoffee
// @downloadURL https://update.greasyfork.org/scripts/439361/AtCoder%20Editorial%20Cover.user.js
// @updateURL https://update.greasyfork.org/scripts/439361/AtCoder%20Editorial%20Cover.meta.js
// ==/UserScript==

var pTags = document.querySelectorAll('p, li');;
var length = pTags.length;
var ar = []
length = length - 11; //ページ最後の「投稿日時」などを隠さないように長さを調整

for (var i = 0; i < length; i++) {
    ar[i] = pTags[i].innerHTML;　//取得した文字列を保存する
}
var cnt = 29; //ページ上部の文字を隠さないようにする

for (i = 0; i < length; i++) { //初期状態
    if(i<cnt){
        pTags[i].innerHTML = ar[i];
    }else{
        pTags[i].innerHTML = '<span style="background-color:#0f0f0f"> ' + ar[i]+ '</span>';
    }
}
(function(){
    let button = document.createElement('button'); //Nextボタン
    let all = document.createElement('all'); //Allボタン
    button.className = 'btn btn-default';
    all.className = 'btn btn-default';
    button.innerText = 'Next';
    all.innerText = 'All';
    button.onclick = () => {
        for (var i = 0; i < length; i++) {
            if(i<=cnt){
                pTags[i].innerHTML = ar[i];
            }else{
                pTags[i].innerHTML = '<span style="background-color:#0f0f0f"> ' + ar[i]+ '</span>';
            }
        }
        cnt = cnt + 1;
    };
    all.onclick = () => {
        cnt = cnt + 1000;
        for (i = 0; i < length; i++) {
            pTags[i].innerHTML = ar[i];
        }
    }
    let a = document.getElementById('contest-nav-tabs');
    a.parentNode.insertBefore(all, a.nextSibling);
    a.parentNode.insertBefore(button, a.nextSibling);
})();