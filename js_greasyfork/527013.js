// ==UserScript==
// @name         2ch過去ログ（タイピ）URL自動変更
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  kakoにリンクを変更
// @author       tube
// @match        https://kako.5ch.net/test/read.cgi/pc/*
// @match        https://kako.5ch.net/test/read.cgi/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=5ch.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527013/2ch%E9%81%8E%E5%8E%BB%E3%83%AD%E3%82%B0%EF%BC%88%E3%82%BF%E3%82%A4%E3%83%94%EF%BC%89URL%E8%87%AA%E5%8B%95%E5%A4%89%E6%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/527013/2ch%E9%81%8E%E5%8E%BB%E3%83%AD%E3%82%B0%EF%BC%88%E3%82%BF%E3%82%A4%E3%83%94%EF%BC%89URL%E8%87%AA%E5%8B%95%E5%A4%89%E6%9B%B4.meta.js
// ==/UserScript==


function hrefConvert(){
    let aTags = document.querySelectorAll('a');
    aTags.forEach((v) => {
        const HREF = v.href;

        // 変換済みスキップ
        if (HREF.startsWith('https://kako.5ch.net/test/read.cgi')) return;

        let url = null;

        if (HREF.endsWith('.html')) {
            const match = HREF.match(/\/(\d+)\.html$/);
            if (match) url = match[1];
        } else {
            const patterns = [/read\.cgi\/pc\/(\d+)/, /read\.cgi\?bbs=pc\&key=(\d+)/, /read\.cgi\/hobby\/(\d+)\.*/, /read\.cgi\/.+\/(\d+)\.*/ ];

            let match = patterns.find(pattern => HREF.match(pattern));
            if (match){
                url = HREF.match(match)[0]
            }

        }

        if (url) {
            //とりあえず背景変えてわかりやすくしとく
            v.href = locationChange(url);
            v.style.backgroundColor = '#b6b9ff';
        }
    });

    function locationChange(url) {
        return 'https://kako.5ch.net/test/' + url;
    }
}

window.addEventListener('load', () => {
    setTimeout(hrefConvert, 500);
});
