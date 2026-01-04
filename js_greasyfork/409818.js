// ==UserScript==
// @name        美剧天堂 - 一键复制
// @description 在美剧天堂下载Tab中添加"复制全部下载地址"的按钮及其功能
// @namespace   http://tampermonkey.net/
// @match       https://www.meijutt.com/content/*
// @match       https://www.meijutt.tv/content/*
// @grant       none
// @version     1.1
// @author      SkayZhang
// @description 2020/8/23 上午12:00:00
// @downloadURL https://update.greasyfork.org/scripts/409818/%E7%BE%8E%E5%89%A7%E5%A4%A9%E5%A0%82%20-%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/409818/%E7%BE%8E%E5%89%A7%E5%A4%A9%E5%A0%82%20-%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const tabItem = $(".tabs-list");
    tabItem.each(function () {
        const $this = $(this);
        $this.find(".copy").remove();
        $this.find(".thunder_down_all").before(`<a href="javascript:void(0);" class="down_btn">复制全部下载地址</a>`);
    });
})();

$(".down_btn").on("click", function () {
    const $this = $(this);
    const $list = $this.parent().parent().find(".down_list");
    if($list==undefined){
        alert("获取下载列表失败");
        return false;
    }
    if (confirm('确认复制全部下载地址?')) {
        let linkList ="";
        $list.find(".down_part_name a").each(function () {
            linkList += $(this).attr("href")+"\n";
        });
        copyText(linkList);
    }
})

function copyText(text){
    var tag = document.createElement('textarea');
    tag.setAttribute('id', 'mj_copy_input');
    tag.value = text;
    document.getElementsByTagName('body')[0].appendChild(tag);
    document.getElementById('mj_copy_input').select();
    document.execCommand('copy');
    document.getElementById('mj_copy_input').remove();
}