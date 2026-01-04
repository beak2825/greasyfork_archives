// ==UserScript==
// @name         HacPai 模拟人工抢红包（内部）
// @namespace    https://github.com/adlered
// @version      1.0.2
var version = "1.0.2";
// @description  https://hacpai.com/cr 抢的越快，拿得越少，玩的就是心跳
// @author       Adler
// @connect      hacpai.com/cr
// @include      https://hacpai.com/cr*
// @require      https://code.jquery.com/jquery-1.11.0.min.js
// @note         20-05-11 1.0.0 初版发布
// @downloadURL https://update.greasyfork.org/scripts/403061/HacPai%20%E6%A8%A1%E6%8B%9F%E4%BA%BA%E5%B7%A5%E6%8A%A2%E7%BA%A2%E5%8C%85%EF%BC%88%E5%86%85%E9%83%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/403061/HacPai%20%E6%A8%A1%E6%8B%9F%E4%BA%BA%E5%B7%A5%E6%8A%A2%E7%BA%A2%E5%8C%85%EF%BC%88%E5%86%85%E9%83%A8%EF%BC%89.meta.js
// ==/UserScript==

var redpack_icon = "<svg style='fill: #D23F31' viewBox='0 0 32 32'> <path d='M11.273 12.766c-3.168-0.488-6.006-1.592-8.496-3.191l0.087 0.052v20.147c0.021 1.234 1.027 2.226 2.264 2.226 0 0 0 0 0 0h21.822c1.252-0.005 2.264-1.021 2.264-2.273 0 0 0 0 0-0v0-20.109c-2.405 1.556-5.246 2.664-8.298 3.133l-0.12 0.015c-0.559 2.141-2.476 3.696-4.756 3.696s-4.197-1.555-4.749-3.662l-0.008-0.034zM26.95 0h-21.822c-0 0-0 0-0 0-1.237 0-2.242 0.992-2.264 2.224l-0 0.002v3.12c2.32 2.174 5.299 3.67 8.607 4.156l0.087 0.011c0.803-1.705 2.506-2.863 4.48-2.863s3.678 1.159 4.468 2.833l0.013 0.030c3.396-0.5 6.375-1.999 8.703-4.184l-0.009 0.008v-3.063c0 0 0 0 0-0 0-1.252-1.012-2.268-2.263-2.273h-0z'></path> <path d='M19.33 11.529c-0.005-1.814-1.477-3.282-3.291-3.282-1.818 0-3.291 1.474-3.291 3.291s1.474 3.291 3.291 3.291v0c0 0 0 0 0 0 1.818 0 3.291-1.474 3.291-3.291 0-0.003 0-0.007 0-0.010v0.001z'></path></svg>";
var avaliableRedpack = new Array();

(function() {
    log_init();
    init();
    run();
    listen();
})();

function init() {
    $(".hongbao__item").each(function(index,domEle) {
       let dataId = $(domEle).attr("data-id");
       let unCatched = $(domEle).attr("style") === undefined;
       if (unCatched) {
           // 加入抢红包缓存表
           add(dataId);
       }
    });
}

function run() {
    // 循环时间
    let delay = 3000;

    setInterval(function() {
        let redpack = avaliableRedpack.pop();
        if (redpack !== undefined) {
            catchRedpack(redpack, randomDelay("1500-3000"));
        }
    }, delay);
}

function listen() {
    // 循环时间
    let delay = 500;
    let lastest;

    setInterval(function() {
       let item = $(".hongbao__item");
       let dataId = item.attr("data-id");
       let unCatched = item.attr("style") === undefined;
       if (lastest !== dataId) {
           if (unCatched) {
               // 加入抢红包缓存表
               add(dataId);
           }
           lastest = dataId;
       }
    }, delay);
}

var catchTimes = 0;
var catchCount = 0;

function catchRedpack(dataId, rand) {
    setTimeout(function() {
        $('*[data-id="' + dataId + '"]').click();
        setTimeout(function() {
            let got = $(".hongbao__count").text().replace(/[^0-9]/ig,"");
            $(".dialog").remove();
            $("body").removeAttr("style");
            let date = new Date(parseInt(dataId));
            let time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            catchTimes++;
            let count = parseInt(got);
            if (!isNaN(count)) {
                catchCount += count;
                log(redpack_icon + " " + time + " 的红包抢到 " + got + " 积分，自动延时：" + rand + " ms；累计 " + catchTimes + " 次，共 " + catchCount + " 积分。");
            } else {
                log(redpack_icon + " " + time + " 的红包已抢到，自动延时：" + rand + " ms；累计 " + catchTimes + " 次。");
            }
        }, 2000);
    }, rand);
}

function randomDelay(range) {
    // x 上限，y 下限
    let x = parseInt(range.split("-")[1]);
    let y = parseInt(range.split("-")[0]);
    let rand = parseInt(Math.random() * (x - y + 1) + y);
    return rand;
}

function add(dataId) {
    // 加入抢红包缓存表
    console.info("已加入缓存：" + dataId);
    avaliableRedpack.push(dataId);
}

function log_init() {
    $("#chatContent").after("<br><span class='chats__content' id='assistant'>" + redpack_icon + " 抢红包助手就绪</span>");
}

function log(text) {
    $("#assistant").html(text);
}

function logAppend(text, newline) {
    if (newline) {
        text = text + "<br><br>";
    }
    $("#assistant").html($("#assistant").html() + text);
}