// ==UserScript==
// @name         慕课网去除绑定微信服务号提示
// @namespace    http://www.imooc.com
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        *://*.imooc.com/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/382636/%E6%85%95%E8%AF%BE%E7%BD%91%E5%8E%BB%E9%99%A4%E7%BB%91%E5%AE%9A%E5%BE%AE%E4%BF%A1%E6%9C%8D%E5%8A%A1%E5%8F%B7%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/382636/%E6%85%95%E8%AF%BE%E7%BD%91%E5%8E%BB%E9%99%A4%E7%BB%91%E5%AE%9A%E5%BE%AE%E4%BF%A1%E6%9C%8D%E5%8A%A1%E5%8F%B7%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==


(function() {

    //视频弹出层
    $('.js-publicnumber-block').remove();
    $('.js-publicnumber-tipoff').remove();
    $('.js-tipoff-block').remove();
    $('.js-tipoff-box').remove();
    
    //视频右侧栏
    $('.course-right-layout').remove();
})();










