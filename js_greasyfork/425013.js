// ==UserScript==
// @namespace    https://greasyfork.org/zh-CN/users/167084-lin-skywood
// @name         盘他搜索时自动添加时间从进及远的搜索条件@skywoodlin
// @description  desc@盘他搜索时自动添加时间从进及远的搜索条件@skywoodlin
// @version      0.2
// @license      LGPLv3
// @author       skywoodlin
// @contributor  skywoodlin
// @match        https://panother.com*
// @match        https://panother.com/search*
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425013/%E7%9B%98%E4%BB%96%E6%90%9C%E7%B4%A2%E6%97%B6%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E6%97%B6%E9%97%B4%E4%BB%8E%E8%BF%9B%E5%8F%8A%E8%BF%9C%E7%9A%84%E6%90%9C%E7%B4%A2%E6%9D%A1%E4%BB%B6%40skywoodlin.user.js
// @updateURL https://update.greasyfork.org/scripts/425013/%E7%9B%98%E4%BB%96%E6%90%9C%E7%B4%A2%E6%97%B6%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E6%97%B6%E9%97%B4%E4%BB%8E%E8%BF%9B%E5%8F%8A%E8%BF%9C%E7%9A%84%E6%90%9C%E7%B4%A2%E6%9D%A1%E4%BB%B6%40skywoodlin.meta.js
// ==/UserScript==
jQuery.noConflict();
(function($) {
    'use strict';
    //debugger;
    let $form = $("form[action='/search']");
    //console.log($form.length)
    if($form.length !== 1) {
        return;
    }
    $form.append('<input type="text" name="sort" value="desc" style="display:none">')
    console.log("skywoodlin: 添加了隐藏的降序排序字段")
    // Your code here...
})(jQuery);