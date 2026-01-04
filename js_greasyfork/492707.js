// ==UserScript==
// @name         Monyi RO
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  Monyi RO auto daily check in
// @author       Kumara Tempura
// @match        *://www.monyiro.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.1/jquery.toast.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492707/Monyi%20RO.user.js
// @updateURL https://update.greasyfork.org/scripts/492707/Monyi%20RO.meta.js
// ==/UserScript==
// web worker by DreamNya
let checkIn = true,
    refresh = true,
    backToHome = true;
let delay = 100;
let worker_fuc = "setInterval(()=>{postMessage('')},"+delay+")"; //Worker函数
let worker_Blob = new Blob([worker_fuc]); //生成一个Blob
let worker_URL = URL.createObjectURL(worker_Blob); //生成一个Blob链接
let worker = new Worker(worker_URL); //创建一个Web Worker

worker.onmessage = function (e) {
    toCheckIn()
}

let start = performance.now();
let past = start;
let i = 1;

function getDatetime(){
    var d = new Date($.now());
    var h = d.getHours();
    h = (h < 10) ? ("0" + h) : h ;

    var m = d.getMinutes();
    m = (m < 10) ? ("0" + m) : m ;

    var s = d.getSeconds();
    s = (s < 10) ? ("0" + s) : s ;
    var currentDatetime = $.datepicker.formatDate('yy-mm-dd', new Date()) + " " + h + ":" + m + ":" + s;
    return currentDatetime;
}

function getTime(){
    var d = new Date($.now());
    var h = d.getHours();
    h = (h < 10) ? ("0" + h) : h ;

    var m = d.getMinutes();
    m = (m < 10) ? ("0" + m) : m ;

    var s = d.getSeconds();
    s = (s < 10) ? ("0" + s) : s ;
    var currentTime = h + ":" + m + ":" + s;
    return currentTime;
}

async function toCheckIn()
{
    let currentTime = getTime(),
        breakdownTime = currentTime.split(':'),
        currentLocation = window.location.href,
        matches = currentLocation.match('id=dsu_paulsign:sign'),
        isHome = currentLocation.match(/^http:\/\/www.monyiro.com\/forum.php$/),
        doneElement = $("h1:contains('您今天已經簽到過了或者簽到時間還未開始')");
    if((currentTime >= '00:00:00' && currentTime <= '00:00:59') || (matches != null && doneElement.length <= 0))
    {
        if(matches == null && refresh && isHome)
        {
            console.log('reload');
            refresh = false;
            window.location.href = 'http://www.monyiro.com/plugin.php?id=dsu_paulsign:sign';
        }
        if(matches != null && checkIn)
        {
            console.log('check in');
            checkIn = false;
            await $("li[id='fd']").click();
            await sleep(100);
            await $("input[name='todaysay']").val('簽到一個');
            await sleep(100);
            await $(".tr3.tac > div > a").click();
        }
    }
    else if(matches != null && backToHome)
    {
        backToHome = false;
        window.location.href = 'http://www.monyiro.com/';
    }
    else if(refresh && isHome && breakdownTime[0] != '00' && breakdownTime[1] == '00' && breakdownTime[2] == '00')
    {
        refresh = false;
        window.location.href = 'http://www.monyiro.com/';
    }
}

async function sleep(ms = DefaultDelay)
{
    return new Promise(r => setTimeout(r, ms));
}