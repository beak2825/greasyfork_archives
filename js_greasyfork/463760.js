// ==UserScript==
// @name        AtCoder Editorial Cover
// @version      1.1
// @description AtCoderの解説を隠し、ボタンを押して少しずつ表示させる
// @include     https://atcoder.jp/contests/*/editorial/*
// @auther milkcoffee
// @namespace https://greasyfork.org/users/1055060
// @downloadURL https://update.greasyfork.org/scripts/463760/AtCoder%20Editorial%20Cover.user.js
// @updateURL https://update.greasyfork.org/scripts/463760/AtCoder%20Editorial%20Cover.meta.js
// ==/UserScript==

var pTags = document.querySelectorAll('p, li, ul li, h1, h2, h3, h4, h5');
var length = pTags.length;
var ar = []
length = length - 11; //ページ最後の「投稿日時」などを隠さないように長さを調整

for (var i = 0; i < length; i++) {
    ar[i] = pTags[i].innerHTML;　//取得した文字列を保存する
}
var cnt = 35; //ページ上部の文字を隠さないようにする

for (i = 0; i < length; i++) { //初期状態
    if(i<cnt){
        pTags[i].innerHTML = ar[i];
    }else{
        pTags[i].innerHTML = '<span style="background-color:#333"> ' + ar[i]+ '</span>';
        if(ar[i].slice(0, 4) == '<img'){
            pTags[i].innerHTML = '<img style="display:none"  ' + ar[i].slice(4,10000);
        }
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
                pTags[i].innerHTML = '<span style="background-color:#333"> ' + ar[i]+ '</span>';
                if(ar[i].slice(0, 4) == '<img'){
                    pTags[i].innerHTML = '<img style="display:none"  ' + ar[i].slice(4,10000);
                }
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