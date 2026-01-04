// ==UserScript==
// @name         MOOC一键互评
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  MOOC一键互评.
// @author       孟夏十二
// @match        https://www.icourse163.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icourse163.org
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480943/MOOC%E4%B8%80%E9%94%AE%E4%BA%92%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/480943/MOOC%E4%B8%80%E9%94%AE%E4%BA%92%E8%AF%84.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    let time = 5 //循环次数
    let bt = document.createElement("button");
    bt.innerHTML = '一键互评';
    bt.onclick = async function (event) {
        start()
            
    };
    bt.style.position = "fixed"
    bt.style.top = "50%"
    bt.style.left = 0;
    bt.style.zIndex = "1300"
    document.body.append(bt);
})();
function run() {
    let cc = ["好好好", "再接再厉", "还可以"]
    var index = Math.random() * cc.length
    let texts = document.getElementsByClassName("j-textarea")
    Array.from(texts).forEach(item => {
        item.value = cc[Math.floor(Math.random() * cc.length)]})
        var divs = document.querySelectorAll('.s');
        divs.forEach(function (div) {
            var radios = div.querySelectorAll('input[type="radio"]');
            var lastRadio = radios[radios.length - 1];
            lastRadio.checked = true;
        });
    var as = document.getElementsByClassName("j-submitbtn")
    var submitbt = as[as.length - 1]
    submitbt.click();
    var backtns = document.getElementsByClassName("j-backbtn")
    var backtn = backtns[backtns.length - 1]
    backtn.click()
  }
  function start(){
    console.log("satyyyyyyy")
         /* elmGetter.get(".j-getnextbtn").then(btns => {
            console.log(btns)
            btns.click()})  */
            var startbtns = document.getElementsByClassName("j-getnextbtn")
            var startbtn = startbtns[0];
            startbtn.click();    
    setTimeout(run, 1000)      
  }