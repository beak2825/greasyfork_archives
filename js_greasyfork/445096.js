// ==UserScript==
// @name         社区返回顶部
// @namespace    wjddd
// @version      0.7
// @description  打开网址
// @author       zhumeiling
// @match        http://admin.bbs3839.5054399.com/bbs/*
// @match        http://admin.bbs3839.5054399.com/comment/gameComment-waitAudit.html
// @match        http://admin.bbs3839.5054399.com/comment/gameComment-waitAuditPrivate.html
// @match        http://admin.bbs3839.5054399.com/comment/gameReply-waitAudit.html
// @match        http://admin.bbs3839.5054399.com/comment/gameReply-waitAuditPrivate.html
// @exclude      http://admin.bbs3839.5054399.com/bbs/report-topic.html
// @exclude      http://admin.bbs3839.5054399.com/bbs/report-reply.html
// @exclude      http://admin.bbs3839.5054399.com/bbs/report-comment.html
// @exclude      http://admin.bbs3839.5054399.com/bbs/report-topic.html?req%5Breason_id%5D=0&req%5Bstatus%5D=-1&req%5Brelate_id%5D=&req%5Buid%5D=&req%5Brelate_uid%5D=&req%5Bsid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=
// @exclude      http://admin.bbs3839.5054399.com/bbs/report-topic.html?req%5Breason_id%5D=0&req%5Bstatus%5D=0&req%5Brelate_id%5D=&req%5Buid%5D=&req%5Brelate_uid%5D=&req%5Bsid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=
// @exclude      http://admin.bbs3839.5054399.com/bbs/report-reply.html?req%5Breason_id%5D=0&req%5Bstatus%5D=-1&req%5Brelate_id%5D=&req%5Buid%5D=&req%5Brelate_uid%5D=&req%5Bsid%5D=&req%5Btid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=
// @exclude      http://admin.bbs3839.5054399.com/bbs/report-reply.html?req%5Breason_id%5D=0&req%5Bstatus%5D=0&req%5Brelate_id%5D=&req%5Buid%5D=&req%5Brelate_uid%5D=&req%5Bsid%5D=&req%5Btid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=
// @exclude      http://admin.bbs3839.5054399.com/bbs/report-comment.html?req%5Breason_id%5D=0&req%5Bstatus%5D=-1&req%5Brelate_id%5D=&req%5Buid%5D=&req%5Brelate_uid%5D=&req%5Bsid%5D=&req%5Btid%5D=&req%5Brid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=
// @exclude      http://admin.bbs3839.5054399.com/bbs/report-comment.html?req%5Breason_id%5D=0&req%5Bstatus%5D=0&req%5Brelate_id%5D=&req%5Buid%5D=&req%5Brelate_uid%5D=&req%5Bsid%5D=&req%5Btid%5D=&req%5Brid%5D=&req%5Btime%5D%5Bfrom%5D=&req%5Btime%5D%5Bto%5D=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445096/%E7%A4%BE%E5%8C%BA%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/445096/%E7%A4%BE%E5%8C%BA%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

var x = "scrollTo(0,0)";
setTimeout(x,1000);
setTimeout(x,2000);

