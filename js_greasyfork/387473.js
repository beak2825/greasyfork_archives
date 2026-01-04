// ==UserScript==
// @name         NGA阴阳师板块版头可动态切换
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @author       You
// @include      https://ngabbs.com/thread.php?fid=538
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387473/NGA%E9%98%B4%E9%98%B3%E5%B8%88%E6%9D%BF%E5%9D%97%E7%89%88%E5%A4%B4%E5%8F%AF%E5%8A%A8%E6%80%81%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/387473/NGA%E9%98%B4%E9%98%B3%E5%B8%88%E6%9D%BF%E5%9D%97%E7%89%88%E5%A4%B4%E5%8F%AF%E5%8A%A8%E6%80%81%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 版头
    const topicDom = document.querySelector('#toptopics')
    topicDom.style.display = 'none' // 默认隐藏
    // 添加切换按钮
    const buttonDom = document.createElement('button')
    buttonDom.id = '_myButton'
    buttonDom.innerText = '显示版头'
    // 按钮容器
    const pbDom = document.querySelector('#m_pbtntop')
    pbDom.appendChild(buttonDom)
    // 绑定事件
    buttonDom.onclick = () => {
        if (topicDom.style.display === 'none') {
            buttonDom.innerText = '隐藏版头'
            topicDom.style.display = ''
        } else {
            buttonDom.innerText = '显示版头'
            topicDom.style.display = 'none'
        }
    }
    // 样式
    pbDom.style.position = 'relative'
    buttonDom.style.padding = '10px 20px'
    buttonDom.style.position = 'absolute'
    buttonDom.style.top = '0'
    // 隐藏其他
    document.querySelector('#m_threads').querySelector('.w100').childNodes.forEach(item => {
        if (item.toString() === '[object HTMLSpanElement]') {
            item.style.display = 'none'
        }
    })
    document.querySelector('#mainmenu').style.marginBottom = 0
})();