// ==UserScript==
// @name         大麦Ti9抢票助手
// @namespace    https://www.jwang0614.top/scripts
// @version      0.1
// @description  辅助购买Ti门票
// @author       raymonife
// @match        https://detail.damai.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383397/%E5%A4%A7%E9%BA%A6Ti9%E6%8A%A2%E7%A5%A8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/383397/%E5%A4%A7%E9%BA%A6Ti9%E6%8A%A2%E7%A5%A8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    //'use strict';
    // Your code here...
    if(!window.localStorage){
        alert('不支持这个浏览器，请换成Chrome或者Safari。');
        return null;
    }



    var people_num = 1;

    var storage = window.localStorage;
    storage.setItem("people_num", people_num);
    //storage.clear();

    var start = document.createElement("P");
    start.appendChild(document.createTextNode("开始抢票 (ctrl+E)"));
    start.style.lineheight="50px";
    start.style.color="white";
    start.style.fontSize="30px";
    start.style.padding="10px 20px";
    start.style.background="green";
    start.style.position="fixed";
    start.style.right="30px";
    start.style.top="100px";
    start.style.zIndex="10000";

    var stop = document.createElement("P");
    stop.appendChild(document.createTextNode("停止抢票 (ctrl+T)"));
    stop.style.lineheight="50px";
    stop.style.color="white";
    stop.style.fontSize="30px";
    stop.style.padding="10px 20px";
    stop.style.background="black";
    stop.style.position="fixed";
    stop.style.right="30px";
    stop.style.top="200px";
    stop.style.zIndex="10000";

    var notice = document.createElement("DIV");
    notice.style.color="white";
    notice.style.background="darkseagreen";
    notice.style.fontSize="20px";
    notice.style.padding="10px 20px";
    notice.style.position="fixed";
    notice.style.right="30px";
    notice.style.top="300px";
    notice.style.lineheight="30px";
    notice.style.zIndex = "10000";
    var notice_0 = document.createElement("P");
    notice_0.appendChild(document.createTextNode("1.选择场次 2. 填写特权码 3.按Ctrl + E‘开始抢票’"));
    var notice_1 = document.createElement("P");
    notice_1.appendChild(document.createTextNode("脚本会在浏览器本地记住你的特权码"));
    var notice_2 = document.createElement("P");
    notice_2.appendChild(document.createTextNode("如需修改场次/特权码，先停止抢票，手动刷新后重新选择/填写"));
    var notice_3 = document.createElement("P");
    notice_3.appendChild(document.createTextNode("请先登录，填写一个默认地址，输入一个购票人"));
    var notice_4 = document.createElement("P");
    notice_4.appendChild(document.createTextNode("不支持选座"));
    notice_0.style.color = "white";
    notice_0.style.background = "red";
    notice.appendChild(notice_0);

    notice.appendChild(notice_1);
    notice.appendChild(notice_2);


    notice_3.style.color = "red";
    notice_3.style.background = "white";
    notice.appendChild(notice_3);
    notice_4.style.color = "red";
    notice_4.style.background = "white";
    notice.appendChild(notice_4);

    var container = document.querySelector('body');
    container.appendChild(start);
    container.appendChild(stop);
    container.appendChild(notice);


    reload_page();



    document.onkeydown = function() {

        var oEvent = window.event;
        if (oEvent.keyCode == 69 && oEvent.ctrlKey) {
            //alert("你按下了ctrl+E");
            // start
            start.click();
        }else if (oEvent.keyCode == 84 && oEvent.ctrlKey) {
            //alert("你按下了ctrl+T");
            // stop
            stop.click();
        }
    }

    function timedRefresh(timeoutPeriod) {
        window.setTimeout("location.reload(true);",timeoutPeriod);
    }


    start.onclick = function() {
        console.log('开始抢票！');
        //blinkStart();
        document.querySelector('body > div.perform').style.background="darksalmon";
        storage.setItem("isRunning", true);

        get_numbers_from_page();

        timedRefresh(400);

    };

    stop.onclick = function() {
        alert('停止抢票！');
        document.querySelector('body > div.perform').style.background="white";
        storage.setItem("isRunning", false);
        storage.removeItem("isRunning");
        //storage.clear();

    };

    function set_up_check_page() {
        console.log("set up check page");

        var event_ele_num = storage.getItem("event_ele_num");
        var price_ele_num = storage.getItem("price_ele_num");
        var people_num = storage.getItem("people_num");

        if (storage.getItem("isRunning") == "true") {
            document.querySelector('body > div.perform').style.background="darksalmon";
        }

        var event_selections = document.querySelectorAll('body > div.perform > div > div.flex1 > div.hd > div > div.order > div.perform__order__box > div.perform__order__select.perform__order__select__performs > div.select_right > div > div');
        event_selections[event_ele_num].click();
        var price_selections = document.querySelectorAll('body > div.perform > div > div.flex1 > div.hd > div > div.order > div.perform__order__box > div.perform__desc__info + div > div.select_right > div > div');
        price_selections[price_ele_num].click();
        var tequanma = document.querySelector("#privilege_val");
        if(tequanma){
            tequanma.value = storage.getItem("ti_tequanma");

            var tbtn = document.querySelector("body > div.perform > div > div.flex1 > div.hd > div > div.order > div.perform__order__box > div.privilege > div.privilege__int > button");
            if(tbtn.classList.contains("disabled") == false){
                console.log("设置特权码成功。");
                tbtn.click();
            }
        }
        var btn = document.querySelector("body > div.perform > div > div.flex1 > div.hd > div > div.order > div.perform__order__box > div:last-child > div");
        console.log(btn.innerText)
        if (btn) {
            if (btn.classList.contains("disabled") == false) {
                storage.removeItem("isRunning");
                storage.removeItem("price_ele_num");
                storage.removeItem("event_ele_num");
                storage.removeItem("people_num");
                storage.clear();
                btn.click();
            }
        }

        if (storage.getItem("isRunning") == "true") {
            console.log("refreshing");
            timedRefresh(600);
        }

    }

    function get_numbers_from_page() {
        var event_selections = document.querySelectorAll('body > div.perform > div > div.flex1 > div.hd > div > div.order > div.perform__order__box > div.perform__order__select.perform__order__select__performs > div.select_right > div > div');
        var price_selections = document.querySelectorAll('body > div.perform > div > div.flex1 > div.hd > div > div.order > div.perform__order__box > div.perform__desc__info + div > div.select_right > div > div');

        for (var i= 0;i < event_selections.length;i++) {
                if (event_selections[i].classList.contains("active")) {
                    storage.setItem("event_ele_num", i);
                    break;
                }
            }

        for (var j= 0;j < price_selections.length;j++) {
            if (price_selections[j].classList.contains("active")) {
                storage.setItem("price_ele_num", j);
                break;
            }
        }
        var tequanma = document.querySelector("#privilege_val");
        if(tequanma){
            var _v = tequanma.value;
            storage.setItem("ti_tequanma", _v);
        }
    }

    function reload_page() {
        console.log("reload");
        //alert(storage.getItem("isRunning"));
        window.setTimeout(set_up_check_page,300);


    }
})();