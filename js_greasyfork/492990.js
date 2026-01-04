

// ==UserScript==
// @name         globalinterpark 辅助锁票
// @namespace    http://tampermonkey.net/
// @version      2024-03-30
// @description  简单的锁票脚本 辅助锁票
// @description  具体使用查看 https://www.bilibili.com/video/BV1Tm41127An/
// @license AGPL
// @author       Kxuan
// @match        https://gpoticket.globalinterpark.com/Global/Play/Book/BookMain.asp
// @icon         https://www.google.com/s2/favicons?sz=64&domain=globalinterpark.com
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/492990/globalinterpark%20%E8%BE%85%E5%8A%A9%E9%94%81%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/492990/globalinterpark%20%E8%BE%85%E5%8A%A9%E9%94%81%E7%A5%A8.meta.js
// ==/UserScript==



(function () {
    'use strict';

    var hasTicket = GM_getValue("hasTicket", false); // 默认值为 false

    var ticketIndex = GM_getValue("ticketIndex", 0); // 默认值为 false


    var currentIndex = 0;


    // 避免调试的时候进不来

    GM_setValue("hasTicket", false);
    GM_setValue("ticketIndex", 0);

    GM_log("已经进入了选座的界面")

    // 点击下一步

    nextStep()

    setTimeout(function () {
        titckLook()
    }, 20000); // 20000 毫秒后执行，即20S 
})();




function nextStep() {

    GM_log("点击去下一步")
    window.addEventListener('load', function () {
        const specificButton = document.querySelector('#LargeNextBtnLink')

        if (specificButton) {
            console.log("已经找到了这个按钮")
            specificButton.click();
        } else {
            console.log('未找到特定的按钮');
        }
    }, false);

    //

}






function titckLook() {

    console.log("点击区域抢票")

    var topWin = document.getElementById("ifrmSeat").contentWindow;

    if(topWin == null || topWin == undefined){

        console.log("被ban了")
    }

    // 1是vip区 2是r区域 3是s区域

    topWin.fnSwapGrade(3);


    var intervalId = setInterval(function () {


        // 如果还没有抢到票的的话，那么就是可以继续执行
        if (!GM_getValue("hasTicket")) {
            let areaArr = ['003', '004', '005']
            console.log("当前要选取的区域是--->", areaArr[GM_getValue("ticketIndex")])

            //topWin.fnBlockSeatUpdate('', '', areaArr[GM_getValue("ticketIndex")].toString())

            var ifrmSeatDetail = topWin.document.getElementById("ifrmSeatDetail").contentWindow;

            let avticks = ifrmSeatDetail.document.getElementsByClassName("SeatN")[0];

            if (avticks == undefined || avticks == null) {
                console.log("没票，要继续刷")
            } else {
                avticks.click()
                console.log("已经成功锁定票,点击确认锁定")

                GM_setValue("hasTicket", true);
                topWin.fnSelect();

                //autoInfo();
                clearInterval(intervalId);

            }

            let nextIndex = (GM_getValue("ticketIndex") + 1) % areaArr.length;

            GM_setValue("ticketIndex", nextIndex)


        }


    }, 600);
}


