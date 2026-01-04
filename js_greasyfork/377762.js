// ==UserScript==
// @name         Baidu Helper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在百度搜索页面显示Google搜索按钮
// @author       You
// @match        https://www.baidu.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/377762/Baidu%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/377762/Baidu%20Helper.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';
    // Your code here...
console.log('load')
    $('#form').width('760px')
    $('.s_btn_wr,#s_btn_wr').after('<input type="submit" id="google" value="Google一下" class="btn self-btn bg " style="margin-left:10px;width:100px;color:#fff;letter-spacing:1px;background:#3385ff;border-bottom:1px solid #2d78f4;outline:medium;*border-bottom:0;-webkit-appearance:none;-webkit-border-radius:0;border: 0;height:34px;">')
    $('#google').click(function(){
        window.location.href='https://www.google.com.hk/search?q='+encodeURIComponent($('#kw').val())
    })
})();