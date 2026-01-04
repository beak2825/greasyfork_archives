// ==UserScript==
// @name         斗鱼弹幕抽奖自动发送（自用）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  斗鱼弹幕抽奖自动发送
// @author       man Wang
// @match        https://www.douyu.com/*
// @icon         https://www.google.com/s2/favicons?domain=douyu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438876/%E6%96%97%E9%B1%BC%E5%BC%B9%E5%B9%95%E6%8A%BD%E5%A5%96%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/438876/%E6%96%97%E9%B1%BC%E5%BC%B9%E5%B9%95%E6%8A%BD%E5%A5%96%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==
/*
const btn = document.querySelector('.ChatSend-button')
            if (btn.text == '开火'){
                s.value=s.placeholder
                btn.click()
            }
*/
(function() {
    alert('脚本启动')
    var num = 0 // 计次
    // 1
    //新建一个div元素节点
    var div=document.createElement("div");
	var divStyle = document.createAttribute("style"); //创建属性
    divStyle.value = 'width:50px;height:50px; background-color:pink;z-index:999999;position:fixed;top0;right:0'
	var divId = document.createAttribute("id"); //创建属性
    divId.value = 'asdd'
    div.setAttributeNode(divStyle) // 绑定属性
    div.setAttributeNode(divId) // 绑定属性
    //把div元素节点添加到body元素节点中成为其子节点，但是放在body的现有子节点的最后
    document.body.appendChild(div);
    //插入到最前面
    document.body.insertBefore(div, document.body.firstElementChild);
    // 初始次数
    document.querySelector('#asdd').innerText=num
    // 1
    setInterval(item => {
        var s = document.querySelector('.ChatSend-txt')
        if (s.placeholder !== '这里输入聊天内容' || s.placeholder !== '试着输入“#帮助”，看看会发生什么吧' || s.placeholder !== '一条弹幕现，八百万勇士来相见'){
            // alert(s.placeholder)
            s.value=s.placeholder
            const btn = document.querySelector('.ChatSend-button')
            if (btn.innerText == '开火'){
                s.value=s.placeholder
                btn.click()
                // 计数
                num += 1
                document.querySelector('#asdd').innerText=num
            }
        }
    }, 2000)

})();