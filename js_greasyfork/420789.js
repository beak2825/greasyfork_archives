// ==UserScript==
// @name         快速评论
// @namespace    https://www.zhxlp.com
// @version      0.2.2
// @description  各类网站快速评论
// @author       Zhxlp
// @match        https://weibo.com/ttarticle/p/show?id=*
// @match        https://www.toutiao.com/*
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://tieba.baidu.com/p/*
// @match        https://www.huluer.com/*/
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        window
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/420789/%E5%BF%AB%E9%80%9F%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/420789/%E5%BF%AB%E9%80%9F%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

/* global jQuery */
      function inserToolsBox() {
        if (jQuery('#zhxlp-tools-box').length) return;

        let innerHTML = `
<div id="zhxlp-tools-box">
  <div class="tools comment">
    评论
  </div>
  <div class="tools setting">
    设置
  </div>
</div>
<style type="text/css">
#zhxlp-tools-box {
  display: block;
  width: 50px;
  position: fixed;
  z-index:99999;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
}
#zhxlp-tools-box .tools {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
}
#zhxlp-tools-box .tools:hover {
  cursor: pointer;
  background: rgba(0, 0, 0, 0.7);
}
</style>`;
        jQuery('body').prepend(innerHTML);
      }

      function comment() {
        GM_log('comment');
        const hostname = window.location.hostname.toLowerCase();
        let msg = GM_getValue('msg_data');
        let inputEle;
        if (hostname.indexOf('weibo.com') > -1) {
          inputEle = jQuery('div.WB_feed.WB_feed_v3.WB_feed_v3_one textarea.W_input');
        } else if (hostname.indexOf('toutiao.com') > -1) {
          inputEle = jQuery('#comment-area textarea');
        } else if (hostname.indexOf('zhihu.com') > -1) {
          inputEle = jQuery('.public-DraftStyleDefault-block.public-DraftStyleDefault-ltr');
        } else if (hostname.indexOf('csdn.net') > -1) {
          inputEle = jQuery('#comment_content');
        } else if (hostname.indexOf('tieba.baidu.com') > -1) {
          inputEle = jQuery('#ueditor_replace');
        }else if (hostname.indexOf('huluer.com') > -1) {
          inputEle = jQuery('#comment');
        }
        if (inputEle.length == 1) {
          jQuery(window).scrollTop(inputEle.offset().top - 200);
          inputEle.focus();
          inputEle.val(msg);
          GM_setClipboard(msg,'text');
          inputEle.focus();
        }
      }

      function setting() {
        let msg = prompt('请输入预填充消息', GM_getValue('msg_data'));
        if (msg != null && msg != '') {
          GM_setValue('msg_data', msg);
        }
      }
      (function () {
        'use strict';
        // Your code here...
        GM_log('init');
        inserToolsBox();
        jQuery('#zhxlp-tools-box .tools.comment').off('click').on('click', comment);
        jQuery('#zhxlp-tools-box .tools.setting').off('click').on('click', setting);
      })();