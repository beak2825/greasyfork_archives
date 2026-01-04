// ==UserScript==
// @name         Keylol根据关键词屏蔽帖子
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  根据关键词，屏蔽掉Keylol论坛里不想要看到的帖子
// @author       QYMtutututu
// @match        https://keylol.com/*
// @icon         https://www.google.com/s2/favicons?domain=keylol.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429559/Keylol%E6%A0%B9%E6%8D%AE%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/429559/Keylol%E6%A0%B9%E6%8D%AE%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function add() {
    var text = document.createElement("input")
    var btn = document.createElement("button")

    text.setAttribute("type", "text")
    text.id = "text2001"
    text.width = "200"
    text.height = "30"

    btn.setAttribute("type", "button")
    btn.id = "btn2001"
    btn.width = "30"
    btn.height = "30"
    btn.innerHTML = "请添加屏蔽关键字"
    document.body.append(text,btn)
}
function Start(){
    var numArr = []
    var a = document.getElementsByTagName("a")
    document.getElementById("btn2001").onclick = function () {
        var val = document.getElementById("text2001").value
        numArr.push(val)
        if (val != "") {
            console.log('查询到数据，当前数据类型为:' + typeof (val))

            /* 此时找到数据，进行循环对比 */
            for (var i = 0, j = a.length; i < j; i++) {
                for (var x = 0, v = numArr.length; x < v; x++) {
                    if (a[i].innerText.search(numArr[x]) != -1) {

                        /* Test */
                        console.log('找到关键词,根据关键词巡查到的句子是:' + a[i].innerText)/* 测试是否能找到对应标签内容 */
                        console.log(numArr.length)/* 测试输入关键词是否进入数组 */

                        /* 找到，进行屏蔽 */
                        var tbody = a[i].parentNode.parentNode.parentNode
                        tbody.style.display = "none"
                        console.log('根据关键词，屏蔽帖子成功')
                    } else {
                        console.log('没找到当前输入的关键词')
                    }
                }
            }
        } else {
            console.log('数据为空')
        }
    }
}
/* 执行区 */
add()
Start()
})();