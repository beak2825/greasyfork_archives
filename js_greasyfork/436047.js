// ==UserScript==
// @name         超星学习通考试粘贴助手
// @namespace    1318346689@qq.com
// @version      0.1
// @description  超星学习通考试时可以直接粘贴进输入框
// @author       mafei007
// @license MIT
// @match        https://mooc1-api.chaoxing.com/exam/test/*
// @downloadURL https://update.greasyfork.org/scripts/436047/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%80%83%E8%AF%95%E7%B2%98%E8%B4%B4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/436047/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%80%83%E8%AF%95%E7%B2%98%E8%B4%B4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var myQuestionId = 'answer' + $("#questionId").val();
    var myEditor = UE.getEditor(myQuestionId, {'pasteplain':true});
    myEditor.removeListener('beforepaste', myEditor_paste);
    console.log("可以粘贴了");
    // Your code here...
})();