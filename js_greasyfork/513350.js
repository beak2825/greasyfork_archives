// ==UserScript==
// @name         慕课作业一键互评
// @namespace    西电飞舞
// @version      1.1
// @description  自动进行30次作业互评，默认满分（平时分赛高）。去除个别答题界面的禁止复制，要复制文本请用鼠标右键复制。不要用快捷键
// @author       LUOFENGYA
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @include      /https://www.icourse163.org/learn/.*/
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/513350/%E6%85%95%E8%AF%BE%E4%BD%9C%E4%B8%9A%E4%B8%80%E9%94%AE%E4%BA%92%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/513350/%E6%85%95%E8%AF%BE%E4%BD%9C%E4%B8%9A%E4%B8%80%E9%94%AE%E4%BA%92%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    'use strict';
     const div = document.createElement('div')
    document.body.appendChild(div)
    div.style.cssText = "width:60px;height:50px;background-color: pink; position: absolute;top:200px;left:0px;"
    const button2 = document.createElement('button')
    button2.innerText = '我要复制'
    div.appendChild(button2)
    button2.addEventListener('click',function(){
      window.alert=function(){}
    })
    const button = document.createElement('button')
    button.innerText = '开始互评'
    div.appendChild(button)
    button.addEventListener('click', function () {
      function timer1(j) {
        setTimeout(function () {
          const select = document.querySelectorAll('.d')
          // console.log(select)
          for (let i = 0; i < select.length; i++) {
            select[i].children[0].checked = true
          }
          const dianpin = document.querySelectorAll('textarea')
          for (let i = 0; i < dianpin.length; i++) {
            dianpin[i].value = "nice"
          }
          // console.log(dianpin)

          const click = document.querySelector('.u-btn-default')
          // console.log(click)
          click.click()
        }
          , j * 5000);
      }
      function timer2(j) {
        setTimeout(function () {
          const next = document.querySelector('.j-gotonext')
          // console.log(next)
          next.click()
        }
          , j * 10000);
      }

      for (let j = 1; j < 31; j++) {
        timer1(j)
        timer2(j)
      }

    })

    // Your code here...
})();


