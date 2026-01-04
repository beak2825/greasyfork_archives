// ==UserScript==
// @name         Delete Weibo Comment
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Lu
// @match        https://weibo.com/comment/*
// @resource html http://tampermonkey.net/index.html
// @downloadURL https://update.greasyfork.org/scripts/371685/Delete%20Weibo%20Comment.user.js
// @updateURL https://update.greasyfork.org/scripts/371685/Delete%20Weibo%20Comment.meta.js
// ==/UserScript==
window.setInterval(deleteComment,1000);
    var item1=document.getElementsByClassName("W_ficon ficon_close S_ficon")
    var item2=document.getElementsByClassName("W_btn_a btn_34px")
function deleteComment() {
    'use strict';
    if ( item1.length>0){
        item1[1].click()
        item2[0].click()
    }
    else {
    document.getElementsByClassName("page next S_txt1 S_line1")[0].click()}
      // Your code here...
    };