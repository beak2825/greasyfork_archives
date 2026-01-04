// ==UserScript==
// @name         Buttons for Google Photos
// @name:zh-CN   谷歌相册按钮扩展（最近添加按钮、未保存的建议）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add recent button to show recent upload photos, and unsaved button to show unsaved recommend.
// @description:zh-CN  给谷歌相册增加了两个按钮，一个用来展示最近上传的图片，一个用来展示没有保存/关闭掉的个性化建议
// @author       You
// @match        https://photos.google.com/*
// @author       oraant
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/397050/Buttons%20for%20Google%20Photos.user.js
// @updateURL https://update.greasyfork.org/scripts/397050/Buttons%20for%20Google%20Photos.meta.js
// ==/UserScript==

(function() {

    // 获取按钮组
    var button_list = $('.R4TmW:first');

    // 创建分割线
    var hr = $("<hr class='iBSb1b dBapkc DOAbib eZnXWb' style='margin-left:10px;margin-right:15px;'>");

    // 创建“最近添加的照片”按钮removeClass
    var button_recent = $(button_list.children()[0]).clone(); // 复制一个按钮
    $(button_recent).attr("data-location","1001"); // 防止被激活高亮
    $(button_recent).removeClass("ixImeb"); // 去掉激活按钮的类名
    $(button_recent).find(".OOX9bc:first").text("最近添加"); // 改文字
    $(button_recent).find(".FKF6mc:first").attr("href","/search/_tra_"); // 改链接
    $(button_recent).find("path").attr("d","M16.24 7.76C15.07 6.59 13.54 6 12 6v6l-4.24 4.24c2.34 2.34 6.14 2.34 8.49 0 2.34-2.34 2.34-6.14-.01-8.48zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"); // 该图标

    // 创建“未保存的建议”按钮
    var button_unsaved = $(button_list.children()[0]).clone();
    $(button_unsaved).attr("data-location","1002");
    $(button_unsaved).removeClass("ixImeb");
    $(button_unsaved).find(".OOX9bc:first").text("仍未保存");
    $(button_unsaved).find(".FKF6mc:first").attr("href","/unsaved");
    $(button_unsaved).find("path").attr("d","M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z");

    // 将创建的元素添加到页面中
    button_list.append(hr, button_recent, button_unsaved);
})();