// ==UserScript==
// @name         Pter Wof Eater
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      0.0.5
// @description  consume your bonus immediately
// @author       scatking
// @match        https://pterclub.com/*wof.php*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://pterclub.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/450272/Pter%20Wof%20Eater.user.js
// @updateURL https://update.greasyfork.org/scripts/450272/Pter%20Wof%20Eater.meta.js
// ==/UserScript==

const timer = ms => new Promise(res => setTimeout(res, ms));
const bonus = $(".Detail p:first").text().replace("当前拥有猫粮：","").replaceAll(",","");
var auto = true
console.log(bonus)

async function do_wof(times,auto) {
    if (times>10){
        alert('禁止超过10次！');return false}
    for (var i = 1;i <= times;i++){
        await fetch("https://pterclub.com/dowof.php", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
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
        // location.reload()
    }
            let results = (await await fetch("https://pterclub.com/mybonus.php", {
    "credentials": "include",
    "headers": {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
    },
    "referrer": "https://pterclub.com/usersearch.php?n=cybermon&rt=0&r=&r2=&st=0&em=&ip=&as=0&co=&ma=&ps=0&dt=0&d=&d2=&ult=0&ul=&ul2=&do=0&lst=0&ls=&ls2=&dlt=0&dl=&dl2=&w=0&c=1&submit=%E6%8F%90%E4%BA%A4%E6%9F%A5%E8%AF%A2",
    "method": "GET",
    "mode": "cors"
}));
        results = await results.text();
        let prize = results.match(/(?<=\[<a href="mybonus\.php">).*?:(.*)(?=<span)/m)[1].replaceAll(",","").trim();
        //console.log(prize)
    let net = Number(prize) - Number(bonus)
    console.log('净收益：'+net);
    if (auto === true){
        if ( net > 2000){
            alert("检测到猫粮净收益大于2000，暂停执行!");
            auto = false
        }
        else {
            location.reload();
            await timer(1500)
        }
    }
    else {
        let msg =`恭喜，你已经兑换了${i-1}次了!你的猫粮为${prize}，是否刷新？`;
        if (confirm(msg)===true){
            location.reload();
        };
    }
}

(function() {
    const target = $(".Detail").next().eq(0);
    target.append('<input id="clickme" type="button" value="交换">');
    target.prepend('<input id="multi" value="1" type="text">');
    if (auto === true){
        do_wof(parseInt($('#multi').val()),auto);
    }
    $('#clickme').click(function () {do_wof(parseInt($('#multi').val()),auto)})
})();