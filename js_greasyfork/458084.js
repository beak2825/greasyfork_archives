// ==UserScript==
// @name         Pter Wof Autoer
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      0.1.2
// @description  consume your bonus immediately
// @author       scatking
// @match        https://pterclub.com/*wof.php*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://pterclub.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/458084/Pter%20Wof%20Autoer.user.js
// @updateURL https://update.greasyfork.org/scripts/458084/Pter%20Wof%20Autoer.meta.js
// ==/UserScript==

const timer = ms => new Promise(res => setTimeout(res, ms));
const prize_map = [1,2,3]
var auto = true

async function do_wof() {

    let results = (await fetch("https://pterclub.com/wof/ajax_chs.php?app=lottery_json", {
        "credentials": "include",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
            "X-Requested-With": "XMLHttpRequest",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Sec-GPC": "1",
            "Pragma": "no-cache",
            "Cache-Control": "no-cache"
        },
        "referrer": "https://pterclub.com/dowof.php",
        "method": "GET",
        "mode": "cors"
    }));
    results = await results.json();
    let prize = results.rid;
    //console.log(prize)
    console.log(prize + '等奖');

    if ( prize_map.indexOf(prize) != -1){
        console.log("检测目标奖励，开始执行!");
        alert("检测目标奖励，开始执行!")
        await fetch("https://pterclub.com/dowof.php", {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-User": "?1",
                "Sec-GPC": "1",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            "referrer": "https://pterclub.com/wof.php?pid=9",
            "method": "GET",
            "mode": "cors"
});
        // console.log(i);
        await timer(5000)
        await location.reload();
        // location.reload()
    }
    else {
        await timer(5000)
        await location.reload();
    }
}

(function() {
    if (auto === true){
        do_wof();
    }
})();