// ==UserScript==
// @name         bilibili视频时长统计
// @namespace    http://tampermonkey.net/
// @description  none
// @version      0.1
// @author       Nefelibata
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461681/bilibili%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/461681/bilibili%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    let hour = 0;
    let minute = 0;
    let second = 0;
    let txt = document.getElementsByClassName('cur-page')[0].innerHTML;
    let page = txt.match(/\/(\d+)/)[1];
    function f1() {
        hour = 0;
        minute = 0;
        second = 0;
        let min = 0;
        let sec = 0;
        if (document.getElementById('divChild')) {
            d.removeChild(document.getElementById('divChild'));
        }
        if (parseInt(input1.value) >= 1 && parseInt(input1.value) <= page && parseInt(input2.value) <= page && parseInt(input1.value) <= parseInt(input2.value)) {
            for (let i = parseInt(input1.value) - 1; i < parseInt(input2.value); i++) {
                let time = document.getElementsByClassName('duration')[i].innerHTML;
                let t = time.match(/\d+/g);
                let h, m ,s
                if (t.length == 3) {
                    h = t[0];
                    m = t[1];
                    s = t[2];
                } else {
                    h = 0;
                    m = t[0];
                    s = t[1];
                }
                hour += parseInt(h);
                min += parseInt(m);
                sec += parseInt(s);
            }
            hour += parseInt(min / 60);
            minute = min - parseInt(min / 60) * 60 + parseInt(sec / 60);
            second = sec - parseInt(sec / 60) * 60;
            if (minute >= 60) {
                hour += parseInt(minute / 60);
                minute = minute - parseInt(minute / 60) * 60;
            }
            if (second >= 60) {
                minute = parseInt(second / 60);
                second = second - parseInt(second / 60) * 60;
            }
            if (input3.value != 1) {
                let total = hour * 3600 + minute * 60 + second;
                total = total / input3.value;
                hour = parseInt(total / 3600);
                minute = parseInt((total % 3600) / 60);
                second = total % 60;
            }
            let d1 = document.createElement('div');
            d1.style.cssText = "margin-top:15px";
            d1.setAttribute("id", "divChild");
            d.appendChild(d1);
            let t1 = document.createTextNode("全" + (parseInt(input2.value) - parseInt(input1.value) + 1) + "集:" + hour + "时" + minute + "分" + parseInt(second) + "秒");
            d1.appendChild(t1);
        } else {
            let d1 = document.createElement('div');
            d1.style.cssText = "margin-top:15px";
            d1.setAttribute("id", "divChild");
            d.appendChild(d1);
            let t1 = document.createTextNode("输入与实际集数不符");
            d1.appendChild(t1);
        }
    }
    function over() {
        btn.style.backgroundColor = "#E4E4E4";
    }
    function out() {
        btn.style.backgroundColor = "#F4F4F4";
    }
    let body = document.body;
    let d = document.createElement("div");
    d.style.cssText = "padding-top:20px;width:150px;height:135px;background-color:#F4F4F4;position:absolute;right:390px;top:235px;border:1px solid #00A1D6;border-radius:8px;color:#00A1D6;z-index:999;text-align:center;font-size:14px";
    body.appendChild(d);
    let d2 = document.createElement("div");
    d.appendChild(d2);
    let t2 = document.createTextNode("第");
    d2.appendChild(t2);
    let input1 = document.createElement('input');
    input1.setAttribute("type", "number");
    input1.style.cssText = "border: 1px solid deepskyblue;width:40px";
    d2.appendChild(input1);
    let t3 = document.createTextNode("集到");
    d2.appendChild(t3);
    let input2 = document.createElement('input');
    input2.setAttribute("type", "number");
    input2.style.cssText = "border: 1px solid deepskyblue;width:40px";
    d2.appendChild(input2);
    let t4 = document.createTextNode("集");
    d2.appendChild(t4);
    let btn = document.createElement('input');
    btn.setAttribute("type", "button");
    btn.setAttribute("value", "计算");
    btn.style.cssText = "width:50px;margin-top:15px;border: 1px solid #00A1D6;cursor:pointer";
    d.appendChild(btn);
    btn.onclick = f1;
    btn.onmouseover = over;
    btn.onmouseout = out;
    let t5 = document.createTextNode("倍速：");
    d2.appendChild(t5);
    let input3 = document.createElement('input');
    input3.setAttribute("type", "number");
    input3.style.cssText = "border: 1px solid deepskyblue;width:50px;margin-top:15px;margin-right:10px";
    input3.value = 1;
    d2.appendChild(input3);
    let t6 = document.createTextNode("倍");
    d2.appendChild(t6);
})();