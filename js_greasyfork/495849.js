// ==UserScript==
// @name         合工大启用复制
// @namespace    https://wyq.icu/
// @version      0.0.2
// @description  合工大考试启用复制
// @author       wangyuqi
// @match        *://learning.wencaischool.net/openlearning/exam/portal/exam.jsp?exam_id=*&type=work&content_id=*&type=work&is_make_up=undefined
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495849/%E5%90%88%E5%B7%A5%E5%A4%A7%E5%90%AF%E7%94%A8%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/495849/%E5%90%88%E5%B7%A5%E5%A4%A7%E5%90%AF%E7%94%A8%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var iframe = document.getElementById('cboxIframe'); // 替换为实际的iframe ID
    if (iframe) {
        // 在iframe中执行 JavaScript 代码
        var iframeWindow = iframe.contentWindow;
        iframeWindow.postMessage('document.onkeydown = null;', '*');
        iframeWindow.postMessage('document.onselectstart = null;', '*');
        iframeWindow.postMessage('document.oncopy = null;', '*');
        iframeWindow.postMessage('document.oncut = null;', '*');
        iframeWindow.postMessage('document.onpaste = null;', '*');
        iframeWindow.postMessage('document.getElementById("tblDataList").onselectstart = null;', '*');
    }
})();
/** 以下为提取答案的 js 代码先放着
let tbody = document.querySelector("#_block_content_exam_1 > form > table > tbody");
let tr_list = tbody.querySelectorAll('tr[correctstatus="1"]');
div_list = [];
for(let i=0;i<tr_list.length;i++){
    tr = tr_list[i];
    temp_div = document.querySelector("#"+ tr.id + " > td:nth-child(2) > table:nth-child(2) > tbody > tr:nth-child(2) > td > div:nth-child(2)")
    console.log("第"+String(Number(i)+1)+"题:"+temp_div.innerText)
}
//       *://learning.wencaischool.net/openlearning/exam/portal/exam.jsp?exam_id=*&type=work&content_id=*&type=work&is_make_up=undefined
//       *://learning.wencaischool.net/openlearning/exam/portal/view_answer.jsp?exam_id=*&score_id=*&content_id=*&type=work&is_make_up=undefined&reexamine=0&*
**/