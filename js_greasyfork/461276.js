// ==UserScript==
// @name         elementUI icon点击复制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  elementUI icon 页点击图标复制
// @author       ff
// @match        *://element.eleme.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eleme.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461276/elementUI%20icon%E7%82%B9%E5%87%BB%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/461276/elementUI%20icon%E7%82%B9%E5%87%BB%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function () {

        const href = location.href
        if (/component\/icon/.test(href)) bindClick()
        toggoleIcon()
    }


})();


function toggoleIcon () {
    const navs = document.querySelectorAll('.nav-item')
    let iconBtn
    for(let i = 0; i < navs.length; i++) {
        if (/icon/ig.test(navs[i].innerText)) {
            iconBtn = navs[i]
            break
        }
    }
    iconBtn.addEventListener('click', () => {

        setTimeout(bindClick, 1000)
    })
}


function bindClick() {
    const liList = document.querySelectorAll('.icon-list li')
    liList.forEach(li => {
        li.addEventListener('click', () => {
            const text = `<i class="${li.innerText}"></i>`
            copyText(text)
        })
    })

}


function copyText(text){
    var textareaC = document.createElement('textarea');
    textareaC.setAttribute('readonly', 'readonly'); //设置只读属性防止手机上弹出软键盘
    textareaC.value = text;
    document.body.appendChild(textareaC); //将textarea添加为body子元素
    textareaC.select();
    var res = document.execCommand('copy');
    document.body.removeChild(textareaC);//移除DOM元素
    tip('复制成功！')
    return res;
}

let handler
function tip(text) {
    handler && clearTimeout(handler)
    const iconEl = document.querySelector('.success-copy-icon')
    if (iconEl) iconEl.remove()
    const div = document.createElement('div')
    div.className = 'success-copy-icon'
    const styles = `
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 9999;
  width: 100px;
  height: 30px;
  transform: translate(-50%, -50%);
  line-height: 30px;
  text-align: center;
  background-color: lightblue;
  box-shadow: 0 0 20px 5px rgb(150 150 150 / 30%);
  border-radius: 5px;
  `
  div.style = styles
    div.textContent = text
    const body = document.querySelector('body')
    body.appendChild(div)
    handler = setTimeout(() => {
        const iconEl = document.querySelector('.success-copy-icon')
        if (iconEl) iconEl.remove()
    }, 1000)
}