// ==UserScript==
// @name         计网答案共享
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!!
// @author       You
// @match        https://forms.office.com/*
// @match        http://forms.office.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465723/%E8%AE%A1%E7%BD%91%E7%AD%94%E6%A1%88%E5%85%B1%E4%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/465723/%E8%AE%A1%E7%BD%91%E7%AD%94%E6%A1%88%E5%85%B1%E4%BA%AB.meta.js
// ==/UserScript==


(function () {
    'use strict';

    var userCode = '781031'
    var host_port = 'https://www.llyc.asia/api'

    setTimeout(function () {
        var questionItems = document.querySelectorAll('div[data-automation-id="choiceItem"]');
        //获得选项类题目的每一个题号

        for (let i = 0; i < questionItems.length; i++) {
            // 获得选项类题目的每一个题号
            var ID_div = questionItems[i];

            // 遍历该题目下的所有选项
            let para = document.createElement("p"); // 创建新的<p>元素
            let node1 = document.createTextNode("选择人: "); // 创建文本节点1
            let span = document.createElement("span"); // 创建新的<span>元素
            span.setAttribute("class", "userInfo"); // 设置<span>的class属性
            para.appendChild(node1); // 向<p>元素追加文本节点1
            para.appendChild(span); // 向<p>元素追加<span>元素
            para.setAttribute("class", "texttext");
            para.style.fontSize = "6px";
            ID_div.appendChild(para);
        }
    }, 1000)

    //
    setInterval(function () {
        var questionItems = document.querySelectorAll('div[data-automation-id="choiceItem"]');
        //按键选择题
        for (let i = 0; i < questionItems.length; i++) {
            //获得选项类题目的每一个选项
            var ID_div = questionItems[i]
            //console.log(ID_div)
            //alert('stop')
            var answer_list = ID_div.querySelectorAll('input[type="radio"]');
            if (answer_list.length != 0) {
                var input = answer_list[0]
                var ID = input.getAttribute('name')
                var Val = input.getAttribute('value')
                if (Val != "" && ID != "" && input.getAttribute('aria-checked') != 'false') {

                    let xhr = new XMLHttpRequest();
                    //设置请求方法
                    let send = host_port + '/push/' + userCode + '/' + ID + '/' + Val + '/' + 2;
                    xhr.open('GET', send);
                    // 发送数据
                    xhr.send(null);
                }

                // 显示答案
                let xhr = new XMLHttpRequest();
                //设置请求方法
                let send = host_port + '/display/' + userCode + '/' + ID
                //alert(ID + send)
                xhr.open('GET', send)
                // 发送数据
                xhr.send(null)
                // 拿到服务端数据后执行相关操作
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        let A = xhr.responseText
                        let data_json = JSON.parse(A)

                        var answer_list = questionItems[i].querySelectorAll('input[type="radio"]');
                        var input = answer_list[0]
                        var Val = input.getAttribute('value')

                        let str = ""
                        for (var val in data_json) {
                            if (val != "split_number") {
                                if (data_json[val] == Val){
                                    str += val + " "
                                }
                            }
                        }
                        var p = questionItems[i].getElementsByClassName('texttext')
                        p[0].innerHTML = str
                    }
                }
            }
        }
    }, 2000)

})();