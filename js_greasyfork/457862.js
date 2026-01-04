// ==UserScript==
// @name         ibon tickets helper
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  buy ibon tickets
// @author       TinaChen
// @match        https://*.ibon.com.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ibon.com.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457862/ibon%20tickets%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/457862/ibon%20tickets%20helper.meta.js
// ==/UserScript==
//場次(時間排序,預設1表示第一場,第n場=n)
const sessions = 1;

//票數
const ticketNumber = 1;

// 是否接受不連號座位
const notSitTogether = true;

(function() {
    //current url
    let url = window.location.href;

    if (url.includes("ActivityInfo/Details")) {

        function selectTime() {
            //自動點擊線上購票
            let btnBuy = document.querySelectorAll('.btn-buy');
            console.log(btnBuy.length);
            if (btnBuy) {
                for (let i = 0; i < btnBuy.length; i++) {
                    if (i == (sessions - 1)) {
                        let isDisabled = $(btnBuy[i]).attr('disabled');
                        if (isDisabled != true) $(btnBuy[i]).click();
                        break;
                    }
                }
            }

        }

        //延遲執行
        setTimeout(selectTime, 700);
    }

    // 自動選擇電腦配位
    let buyTypeCheckbox = document.querySelector("#ctl00_ContentPlaceHolder1_BUY_TYPE_2");
    if (buyTypeCheckbox) buyTypeCheckbox.checked = true;

    // 尋找座位區第一個可點擊之區域(當前畫面可選區域)
    if (url.includes("orders.ibon.com.tw/application") && url.includes("PRODUCT_ID")) {
        let cell = document.querySelectorAll('table tbody tr');
        for (let i = 0; i < cell.length; i++) {
            let trid = $(cell[i]).attr('id');
            let trClass = $(cell[i]).attr('class');
            if (trid && trClass != "disabled") {
                setTimeout(function() {
                    var e = document.createEvent("MouseEvents");
                    e.initEvent("click", true, true);
                    document.getElementById(trid).dispatchEvent(e);
                },
                500);

                break;
            }
            if (i == (cell.length - 1) && !url.includes("SHOW_PLACE_MAP")) {
                alert("T___T 搶輸了....賣光囉!!! 重整看看有沒有釋出的票~");
            }
        }
    }
    // 接受不連號座位
    let sitTogetherCheckBox = document.querySelector("#ctl00_ContentPlaceHolder1_notConsecutive");
    if (sitTogetherCheckBox) sitTogetherCheckBox.checked = notSitTogether;

    // 填入張數
    let buyAmount = document.querySelector("#ctl00_ContentPlaceHolder1_DataGrid_ctl02_AMOUNT_DDL");
    if (buyAmount) buyAmount.value = ticketNumber;

    //點擊下一步按鈕
    let btnNext = document.querySelector("#ctl00_ContentPlaceHolder1_A1");
    if (btnNext) {
        btnNext.click();
    }

    $("#ctl00_ContentPlaceHolder1_CHK").focus();

    //點擊另一種id的下一步按鈕
    let btnNext2 = document.querySelector("#AddShopingCart");
    if (btnNext2) {
        btnNext2.click();
    }

})();