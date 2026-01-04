// ==UserScript==
// @name         SHKT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  刷课
// @author       You
// @match        https://42.51.69.234:8003/*
// @icon         https://www.google.com/s2/favicons?domain=69.234
// @grant        none
// @license MIT 
// @require     https://cdn.bootcss.com/jquery/2.1.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/435665/SHKT.user.js
// @updateURL https://update.greasyfork.org/scripts/435665/SHKT.meta.js
// ==/UserScript==

(function () {
    'SKT';
    var time = 'init';
    setInterval(function () {
        const $pv = $(".pv-playpause");
        $pv.click();
        $pv.click();
    }, 290000);

    setInterval(function () {



        const tempTime = $(".pv-time-current").text();

        console.log('tempTime' + tempTime)
        console.log('time' + time)

        if (tempTime === time) {
            $(".pv-playpause").click()
        }
        time = tempTime
    }, 10000);

    var rateOfProgress = 'init';

    setInterval(function () {
        const node = $(".font-w7.text-aaa.sum.style.beginstyle")[0].children[1];
        let tempRateOfProgress = node.innerText;
        console.log('tempRateOfProgress' + tempRateOfProgress)
        console.log('rateOfProgress' + rateOfProgress)

        if (tempRateOfProgress === rateOfProgress) {
            autoPlayUnfinished();
            console.log("===")
        }
        rateOfProgress = tempRateOfProgress;
    }, 60000);

    function autoPlayUnfinished() {
        console.log('autoPlayUnfinished')
        //find unfinished
        //get  "span" node
        var children = $(".clearfix.videoLi").children(".progress.video-progress").children("span");
        console.log(children.size())
        //find !=100%
        for (let i = 0; i < children.size(); i++) {
            console.log(children[i].innerText)
            if (children[i].innerText === "100%") {
                continue;
            }
            $(".clearfix.videoLi").children(".progress.video-progress").children("div")[i].click()
            $(".clearfix.videoLi").children(".progress.video-progress").children("div")[i].click()
            break;
        }
    }
})();