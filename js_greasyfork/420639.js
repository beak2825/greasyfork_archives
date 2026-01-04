// ==UserScript==
// @name 91wii自动填充回复框
// @namespace 91wii自动填充回复框
// @author    火柴人
// @version    0.1
// @include  https://www.91wii.com/thread*
// @require https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @description 91wii自动填充回复框1.0,可以手动改
// @grant    GM_setValue
// @grant    GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/420639/91wii%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%9B%9E%E5%A4%8D%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/420639/91wii%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E5%9B%9E%E5%A4%8D%E6%A1%86.meta.js
// ==/UserScript==
(function() {
    var messageList = [];
    messageList.push("有点厉害哇");
    messageList.push("謝樓主分享");
    messageList.push("真的太棒了");
    messageList.push("大神出现了，谢谢分享");
    messageList.push("有意思 看看教程");
    messageList.push("厉害啊，学习下");
    messageList.push("感谢大神分享");
    messageList.push("谢谢大佬分享。");
    var mes = GM_getValue("mes",0);
    $("[name='message']").val(messageList[mes]);
    mes++;
    if(mes == messageList.length){
		mes=0
    }
    GM_setValue("mes",mes);
})();