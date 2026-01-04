// ==UserScript==
// @name         腾讯课堂自动签到
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  腾讯课堂自动签到脚本
// @author       内阁首辅
// @match        https://ke.qq.com/webcourse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405866/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/405866/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(clickBtn, 10000)
    // Your code here...
})();

function clickBtn() {
  'use strict';
  let btn_elements = document.getElementsByClassName('s-btn s-btn--primary s-btn--m')
  for (let i = 0; i < btn_elements.length; i++) {
    try {
      if (btn_elements[i].innerHTML == '签到') {
        btn_elements[i].click()
        console.warn('签到按钮已点击')
        setTimeout(clickDone, 3000)
        break
      }
    } catch(err) {
      console.error(`脚本错误:${err}`)
    }
  }
}

function clickDone() {
  'use script';
  let btn_elements_2 = document.getElementsByClassName('s-btn s-btn--primary s-btn--m')
  let count = 0
  for (let i = 0; i < btn_elements_2.length; i++) {
    try {
      if (btn_elements_2[i].innerHTML == '确定') {
        btn_elements_2[i].click()
        console.warn('确定按钮已点击')
        count += 1
        document.querySelector('.applied-text').innerHTML = `已签到${count}次`
        count += 1
        //document.getElementByClassName('applied-text')[0].innerHTML = `已成功签到${count}次`
        break
      }
    } catch(err) {
      console.error(`脚本错误:${err}`)
    }
  }
}