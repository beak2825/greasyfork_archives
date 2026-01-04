// ==UserScript==
// @name         去你丫的健康测试，去你丫的问卷星
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  垃圾问卷星心理测试，烦死了
// @author       caisezhaopian
// @match        *://www.wjx.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451979/%E5%8E%BB%E4%BD%A0%E4%B8%AB%E7%9A%84%E5%81%A5%E5%BA%B7%E6%B5%8B%E8%AF%95%EF%BC%8C%E5%8E%BB%E4%BD%A0%E4%B8%AB%E7%9A%84%E9%97%AE%E5%8D%B7%E6%98%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/451979/%E5%8E%BB%E4%BD%A0%E4%B8%AB%E7%9A%84%E5%81%A5%E5%BA%B7%E6%B5%8B%E8%AF%95%EF%BC%8C%E5%8E%BB%E4%BD%A0%E4%B8%AB%E7%9A%84%E9%97%AE%E5%8D%B7%E6%98%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var in1 = '在此填入';
    var in2 = '在此填入';
    var in3 = '在此填入';
    var in4 = '在此填入';
    function dianji() {
        in1 = document.getElementById('in01').value;
        in2 = document.getElementById('in02').value;
        in3 = document.getElementById('in03').value;
        in4 = document.getElementById('in04').value;
        var x;
        x = document.getElementsByClassName("label");
        for (var i = 0; i < x.length; i++) {
            if (x[i].innerHTML == in1 || x[i].innerHTML == in2 || x[i].innerHTML == in3 || x[i].innerHTML == in4) { x[i].parentNode.click(); };
        };
    }
    let button1 = document.createElement('button');
    button1.style = "width: 140px;font-size: 25px;position: fixed;top: 10px; right: 80px;cursor: pointer; border-radius: 10px;display: flex;justify-content: center;align-items: center;";
    button1.innerHTML = "自动单选";
    document.querySelector('#pageDiv').appendChild(button1);
    button1.addEventListener('click', function (e) {
        dianji();
    })

    //以下是输入框
    let input_1 = document.createElement('input');
    input_1.setAttribute("id","in01");
    input_1.style = "width: 140px;font-size: 25px;background: rgba(148, 141, 255,.5);position: fixed;top: 80px; right: 0;cursor: pointer; border-radius: 10px;display: flex;justify-content: center;align-items: center;";
    document.querySelector('#pageDiv').appendChild(input_1);
    //-------------------------------------------------
    let button_1 = document.createElement('button');
    button_1.style = "border: none;width: 115px;font-size: 25px;position: fixed;top: 80px; right: 150px;cursor: pointer; border-radius: 10px;display: flex;justify-content: center;align-items: center;";
    button_1.innerHTML = "关键字：";
    document.querySelector('#pageDiv').appendChild(button_1);

    let input_2 = document.createElement('input');
    input_2.setAttribute("id","in02");
    input_2.style = "width: 140px;font-size: 25px;background: rgba(148, 141, 255,.5);position: fixed;top: 150px; right: 0;cursor: pointer; border-radius: 10px;display: flex;justify-content: center;align-items: center;";
    document.querySelector('#pageDiv').appendChild(input_2);
    //-------------------------------------------------
    let button_2 = document.createElement('button');
    button_2.style = "border: none;width: 115px;font-size: 25px;position: fixed;top: 150px; right: 150px;cursor: pointer; border-radius: 10px;display: flex;justify-content: center;align-items: center;";
    button_2.innerHTML = "关键字：";
    document.querySelector('#pageDiv').appendChild(button_2);

    let input_3 = document.createElement('input');
    input_3.setAttribute("id","in03");
    input_3.style = "width: 140px;font-size: 25px;background: rgba(148, 141, 255,.5);position: fixed;top: 220px; right: 0;cursor: pointer; border-radius: 10px;display: flex;justify-content: center;align-items: center;";
    document.querySelector('#pageDiv').appendChild(input_3);
    //-------------------------------------------------
    let button_3 = document.createElement('button');
    button_3.style = "border: none;width: 115px;font-size: 25px;position: fixed;top: 220px; right: 150px;cursor: pointer; border-radius: 10px;display: flex;justify-content: center;align-items: center;";
    button_3.innerHTML = "关键字：";
    document.querySelector('#pageDiv').appendChild(button_3);

    let input_4 = document.createElement('input');
    input_4.setAttribute("id","in04");
    input_4.style = "width: 140px;font-size: 25px;background: rgba(148, 141, 255,.5);position: fixed;top: 290px; right: 0;cursor: pointer; border-radius: 10px;display: flex;justify-content: center;align-items: center;";
    document.querySelector('#pageDiv').appendChild(input_4);
    //-------------------------------------------------
    let button_4 = document.createElement('button');
    button_4.style = "border: none;width: 115px;font-size: 25px;position: fixed;top: 290px; right: 150px;cursor: pointer; border-radius: 10px;display: flex;justify-content: center;align-items: center;";
    button_4.innerHTML = "关键字：";
    document.querySelector('#pageDiv').appendChild(button_4);

    document.getElementById('in01').value = in1;
    document.getElementById('in02').value = in2;
    document.getElementById('in03').value = in3;
    document.getElementById('in04').value = in4;

})();