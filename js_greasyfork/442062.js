// ==UserScript==
// @name         linxb_edhtm
// @namespace    https://greasyfork.org/zh-CN/users/884732-linxb
// @version      0.1
// @description  linxb工具集，可以编辑网页
// @author       linxb
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @exclude      *://*bilibili*/*
// @exclude      *://*jin10*/*
// @exclude      *://*.bing.*/*
// @exclude      *://*.baidu.*/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @charset      UTF-8
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442062/linxb_edhtm.user.js
// @updateURL https://update.greasyfork.org/scripts/442062/linxb_edhtm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function linxb_edhtm_do_change(){
      console.log("ENTER:linxb_edhtm_do_change");

      if(document.body.contentEditable != "true"){
        document.body.contentEditable = "true";
      } else {
        document.body.contentEditable = window.init_contentEditable;
      }
      console.log("EXIT:linxb_edhtm_do_change");
      return false;
    }
    window.init_contentEditable = document.body.contentEditable;
    window.linxb_edhtm_do_change = linxb_edhtm_do_change;

    var button = '<a href="javascript:;" onclick="linxb_edhtm_do_change();return false;" style="width: 40px; height: 40px; border-radius: 20px; text-align: center; line-height: 40px; font-size: 20px !important; font-family: Arial !important; color: white !important; text-decoration:none; font-weight: 500; display: block; background: green; opacity: 0.6; z-index: 100000; position: fixed; right: 20px; bottom: 20px;" title="编辑网页" target="_blank">编</a>';
    $("body:first").prepend(button);

})();