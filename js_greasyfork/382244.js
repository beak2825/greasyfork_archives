// ==UserScript==
// @name        OneGrapeFruit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match       https://service.account.weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382244/OneGrapeFruit.user.js
// @updateURL https://update.greasyfork.org/scripts/382244/OneGrapeFruit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    console.log("jquery ready");
        var script = (function () {/*
     function commit(a,b){
    document.querySelector('#pl_report_complaint_h5 > section.complaint_con > dl:nth-child(3) > dd > ul > li:nth-child('+a+') ').click()
    document.querySelector('#pl_report_complaint_h5 > section.complaint_con > dl:nth-child(4) > dd > ul > li:nth-child('+b+') ').click()
    document.querySelector('#pl_report_complaint_h5 > section.complaint_con > dl:nth-child(4) > dd > ul > li:nth-child('+b+') ').classList.add('cur');
    document.querySelector('#pl_report_complaint_h5 > section.complaint_txt > dl > dd > label > span').click()
    document.querySelector('#pl_report_complaint_h5 > section.complaint_txt > dl > dt > a').click()
    }
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

    var html = (function () {/*
  <dl class="c_c_b" node-type="classBox">
  <dd>
  <ul>
  </ul>
  </dd>
  </dl>
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

//选择对应选项
         function commit(a,b){
    document.querySelector('#pl_report_complaint_h5 > section.complaint_con > dl:nth-child(3) > dd > ul > li:nth-child('+a+') > a').click()
    document.querySelector('#pl_report_complaint_h5 > section.complaint_con > dl:nth-child(4) > dd > ul > li:nth-child('+b+') > a').click()
    document.querySelector('#pl_report_complaint_h5 > section.complaint_txt > dl > dd > label > span').click()
    document.querySelector('#pl_report_complaint_h5 > section.complaint_txt > dl > dt > a').click()
    }
    //屏蔽不良信息
   document.querySelector('#pl_report_complaint_h5 > section.complaint_con > dl.c_c_a > dd').innerHTML=html
    //加入按钮
    var buttonwrap=document.querySelector('#pl_report_complaint_h5 > section.complaint_con > dl.c_c_a > dd > dl > dd > ul')
    var list=["【yhxx/其他】","【yhxx/暴/恐】","【shxx/低/俗】","【shxx/sq图/文】","【shxx/sq视/频】"]
    var func=["commit(5,17)","commit(5,14)","commit(2,5)","commit(2,7)","commit(2,9)"]
    function myFunction(item, index) {
    buttonwrap.innerHTML =  buttonwrap.innerHTML + "<li><a href=\"#\" onclick=\""+script+';'+func[index]+"\">" + item + "</a></li>"
}
   list.forEach(myFunction)
    //  排版美观一点
  document.querySelector('#pl_report_complaint_h5 > section.complaint_con > dl.c_c_a').classList.remove('c_c_a')


    //进行选择

})();