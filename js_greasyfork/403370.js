// ==UserScript==
// @name               Mark Stack Overflow Outdated Answers
// @version            1.1
// @name:zh-CN         标记Stack Overflow的过时答复
// @description        Changed the display time of the Stack Overflow Q & A page to ISO format and marked outdated responses
// @description:zh-CN  将Stack Overflow 问答页面显示时间改为ISO格式的, 并标记出过时的答复
// @namespace          StackOverflow
// @author             fengxiaochuang
// @match              https://*.stackoverflow.com/questions/*
// @grant              none
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/403370/Mark%20Stack%20Overflow%20Outdated%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/403370/Mark%20Stack%20Overflow%20Outdated%20Answers.meta.js
// ==/UserScript==

var currentYear =  (new Date()).getYear();
function check_expired_reply(text){
    var year = text.split("-")[0];
    if ((year * 1) - currentYear < 1898){
        return "<font style='color:red;text-decoration:line-through '>"+ text + "</font>"
    } else {
        return text;
    }
}

$(".relativetime").each(function(index,elem){
    $(this).html(check_expired_reply($(this).prop("title")))
})

$(".relativetime-clean").each(function(index,elem){
    $(this).html(check_expired_reply($(this).prop("title")))
})