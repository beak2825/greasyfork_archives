// ==UserScript==
// @name         自动删除在微博发出的所有评论
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  用于删除自己发出的所有微博的评论
// @author       Luigi
// @match        https://weibo.com/comment/*
// @downloadURL https://update.greasyfork.org/scripts/428098/%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E5%9C%A8%E5%BE%AE%E5%8D%9A%E5%8F%91%E5%87%BA%E7%9A%84%E6%89%80%E6%9C%89%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/428098/%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E5%9C%A8%E5%BE%AE%E5%8D%9A%E5%8F%91%E5%87%BA%E7%9A%84%E6%89%80%E6%9C%89%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==
window.setInterval(deleteComment,1000);
    var item1=document.getElementsByClassName("W_ficon ficon_close S_ficon")
    var item2=document.getElementsByClassName("W_btn_a btn_34px")
    var item3=document.getElementsByClassName("W_btn_b btn_34px")
function deleteComment() {
    'use strict';
    if (item1.length>0){
        item1[0].click()
        item2[0].click()
        item3[0].click()
    }
    else {
    document.getElementsByClassName("page next S_txt1 S_line1")[0].click()}
      // Your code here...
    };