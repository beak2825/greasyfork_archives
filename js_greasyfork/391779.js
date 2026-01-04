// ==UserScript==
// @name         Twitterのツイート自動収集
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://twitter.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/391779/Twitter%E3%81%AE%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E8%87%AA%E5%8B%95%E5%8F%8E%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/391779/Twitter%E3%81%AE%E3%83%84%E3%82%A4%E3%83%BC%E3%83%88%E8%87%AA%E5%8B%95%E5%8F%8E%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var DB = {};
    var main = () => {
        $(document).find("article").each((i,elm)=>{
            // var p = $(document).find("article").eq(0).find("div").find("div").eq(2).children().eq(1);
            var p = $(elm).find("div").find("div").eq(2).children().eq(1);
            var href = p.find("a").filter(function(i,e){
                return $(e).attr("aria-label");
            }).first().attr("href"); // ツイートID
            if(!href) return console.error('error_'+i);
            var id = 'id_' + href.match(/[0-9]+$/)[0];
            if(DB[id]) return;
            const text = p.children().eq(1).text().trim().replace(/\n/g, " ");; // ツイート本文
            const time = p.find("time").attr("datetime"); // 時刻
            const f = p.children().filter(function(i,e){
                return $(e).attr("aria-label");
            }).eq(0).children();
            if(!f.length) return console.error(id,time,text);
            var a = f.eq(0).find("div").attr("aria-label").match(/[0-9]+/); // リプライ数
            var reply = a ? a[0] : 0;
            var b = f.eq(1).find("div").attr("aria-label").match(/[0-9]+/); // RT数
            var retweet = b ? b[0] : 0;
            var c = f.eq(2).find("div").attr("aria-label").match(/[0-9]+/) // いいね
            var favorite = c ? c[0] : 0;
            DB[id] = [time, reply, retweet, favorite, text];
        });
    };

    const makeResult = () => {
        const keys = Object.keys(DB);
        const result = [
            [
                "id",
                "time",
                "reply",
                "retweet",
                "favorite",
                "text",
            ]
        ];
        for(const key of keys){
            result.push([key].concat(DB[key]));
        }
        makeFileCSV(result, 'ツイート自動収集');
    };

    const makeFileCSV = (array, file_name) => {
        let strCSV = "";
        for(const line of array) strCSV += line.join(',') + '\r\n';
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);//（文字化け対策）
        const blob = new Blob([bom, strCSV], {type: 'text/csv'});
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.target = '_blank';
        a.download = file_name + '.csv';
        a.click();
    };
    const crawl = () => {
        main();
        scroll(999999,999999);
    };
    const start = () => {
        alert("開始します。");
        setInterval(crawl, 3000);
    };

    $(window).keydown(e=>{
        if(e.key === "F7") start();
        if(e.key === "F8") makeResult();
    });
})();