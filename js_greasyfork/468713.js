// ==UserScript==
// @name         5ch surfer
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  5chをちょっと見やすくするやつ
// @author       おれ
// @match        *://*.5ch.net/test/read.cgi/*/*/*
// @match        *://*.5ch.net/*/subback.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468713/5ch%20surfer.user.js
// @updateURL https://update.greasyfork.org/scripts/468713/5ch%20surfer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const REGEX_JUMP = /^http:\/\/jump\.5ch\.net\/\?/; // クッションページの正規表現
    const REGEX_IMG = /https?:\/\/.*\/.*\.(jpg|png|jpeg|gif)$/; // 画像リンクの正規表現
    const REGEX_THREAD = /.*5ch\.net\/test\/read.cgi/; // スレッドの正規表現

    // 自動アンカー
    window.autoanker = function (num) {
        const message = document.getElementsByClassName("formelem maxwidth")[2];
        message.value += `>>${num}\n`;
        // 自動スクロール
        let targetRect = message.getBoundingClientRect();
        let targetTop = targetRect.top + window.pageYOffset;
        window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });
        message.focus();
    }

    // 特定IDのレスをハイライト表示
    window.highlight = function(uid) {
        // 一旦すべてをリセットする
        let elements = document.getElementsByClassName("post");
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = '#EFEFEF';
        }
        // 特定IDのみを対象にする
        elements = document.querySelectorAll(`[data-userid="${uid}"]`);
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor = '#D6D6D6';
        }
    }

    // クラシック版に飛ばす
    let path = location.pathname;
    if (path.indexOf('read.cgi') > -1) {
        let paths = path.split('/');
        if (paths[3] != 'c') {
            let newpath = `/test/read.cgi/c/${paths[3]}/${paths[4]}/${paths[5]}`;
            location.pathname = newpath;
        }
    }

    // ここからリンク周りの処理
    let links = document.links;
    for (let i = 0; i < links.length; i++) {
        let thread = links[i].href.split('/');
        let endpoint = thread[2] + '/' + thread[3] + '/' + thread[4];

        // スレッドをクラシック版にする
        if (REGEX_THREAD.test(endpoint) && thread[5] != 'c') {
            links[i].setAttribute('href',`https://${thread[2]}/test/read.cgi/c/${thread[5]}/${thread[6]}/${thread[7]}`);
        }
        // jump.5ch.netを消す
        if (REGEX_JUMP.test(links[i].href)) {
            let direct_link = links[i].href.replace("http://jump.5ch.net/?","");
            links[i].setAttribute('href',direct_link);
            links[i].setAttribute('rel','noreferrer');
            // 画像ならサムネイルを生成する
            if (REGEX_IMG.test(direct_link)) {
                let message = document.getElementsByClassName("message");
                let image = new Image(30,30);
                image.src = direct_link;
                links[i].appendChild(document.createElement("br"));
                links[i].appendChild(image);
            }
        }

    }

    const post = document.getElementsByClassName("number");
    for (let i = 0; i < post.length; i++) {
        // レス番クリック時
        post[i].addEventListener('click',function() {
            let anker = Number(post[i].innerText);
            window.autoanker(anker);
        });
    }

    const uid = document.getElementsByClassName("uid");
    for (let i = 0; i < uid.length; i++) {
        // IDダブルクリック時
        uid[i].addEventListener('dblclick',function() {
            let id = uid[i].innerText;
            window.highlight(id);
        });
    }
})();