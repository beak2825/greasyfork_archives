// ==UserScript==
// @name         教务处自动评教
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  全自动评教表单。
// @author       LayneH
// @include      http://jwgl.csuft.edu.cn/jsxsd/xspj/xspj_edit.do*
// @include      http://jwgl.webvpn.csuft.edu.cn/jsxsd/xspj/xspj_edit.do*
// http://jwgl.webvpn.csuft.edu.cn/jsxsd/xspj/xspj_list.do?
// @icon         https://jwc.csuft.edu.cn/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463660/%E6%95%99%E5%8A%A1%E5%A4%84%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/463660/%E6%95%99%E5%8A%A1%E5%A4%84%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==
(function(){
  const text='老师认真负责，讲课精神饱满，有感染力，能吸引学生的注意力。讲述内容充实，信息量大，能反映或联系学科发展的新思想、新概念、新成果。'
  // window.confirm  = ()=>{return true}
  const s = document.createElement('script');
  s.innerHTML = "confirm= function(){return true;};alert = function(){};"
  document.body.appendChild(s)

  // 选择所有符合条件的radio元素
  let radiosToCheck = document.querySelectorAll('input[type="radio"][id$="_1"]');
  // 遍历这些元素并设置它们的checked属性为true
  radiosToCheck.forEach(function(radio) {
    radio.checked = true;
});
  document.querySelector('textarea').value =text
  //   document.querySelector('#tj').click()
  document.querySelector("#issubmit").value = "1";
  document.querySelector("#Form1").submit();
  setTimeout(function (){
    parent.window.close();
   }, 200);
})();