// ==UserScript==
// @name         石家庄铁道大学自动评教（适用于正方教务）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动评教脚本，仅供学习和参考使用，请勿用于商业用途
// @author       吴某人
// @match        http://jw.stdu.edu.cn/xspjgl/xspj_cxXspjIndex.html?doType=details&gnmkdm=N401605&layout=default&su=20203284
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466713/%E7%9F%B3%E5%AE%B6%E5%BA%84%E9%93%81%E9%81%93%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%EF%BC%88%E9%80%82%E7%94%A8%E4%BA%8E%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/466713/%E7%9F%B3%E5%AE%B6%E5%BA%84%E9%93%81%E9%81%93%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%EF%BC%88%E9%80%82%E7%94%A8%E4%BA%8E%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%EF%BC%89.meta.js
// ==/UserScript==
//出现问题请联系QQ2604051421 记得把su后面的值改成你自己的学号！

(function() {
    'use strict';

    function handleClick() {
        var num = document.getElementById("tempGrid").rows.length-1
console.log('共'+num+'门课')
var i=1;
var timer = setInterval(() => {
  if(i == num+1) {
    console.log('评价结束')
    clearInterval(timer)
  }else{
    console.log('开始评第'+i+'门课')
    var body = document.getElementById(i++)
    if(body!=null) body.click();
    setTimeout(() => {
      var radios = document.getElementsByClassName('radio-pjf');
      var j=0;
      var r=Math.floor(Math.random()*5)+3;
      [...radios].forEach((item) => {
          if(item.getAttribute("data-dyf")=="100") {
            item.checked = true
            j++
          }
 })

var Text = document.getElementsByClassName('form-control');

Text[0].value="无";

Text[1].value="无";

Text[2].value="非常好！";

  document.getElementById('btn_xspj_bc').click()

 document.getElementById('btn_ok').click()

document.getElementById('btn_xspj_tj').click()
         document.getElementById('btn_ok').click()
      console.log('第'+(i-1)+'门课已提交')
    },3000)
  }
},6000)
    }

    const button = document.createElement("button");
    button.textContent = "执行评教操作！";
    button.addEventListener("click", handleClick);

    const container = document.querySelector(".container");
    container.appendChild(button);
})();
