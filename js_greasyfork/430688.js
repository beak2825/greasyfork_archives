// ==UserScript==
// @name         iai获取名字
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取名字
// @author       hub
// @match        *://*.iai.work/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/430688/iai%E8%8E%B7%E5%8F%96%E5%90%8D%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/430688/iai%E8%8E%B7%E5%8F%96%E5%90%8D%E5%AD%97.meta.js
// ==/UserScript==

let dom = {};
dom.query = jQuery.noConflict(true);
dom.query(document).ready(function ($) {
    'use strict';
    console.log('start!!!');
    const cycle = 1000; // 检测周期

    function copyText(text, callback){ // text: 要复制的内容， callback: 回调
        var tag = document.createElement('input');
        tag.setAttribute('id', 'cp_hgz_input');
        tag.value = text;
        document.getElementsByTagName('body')[0].appendChild(tag);
        document.getElementById('cp_hgz_input').select();
        document.execCommand('copy');
        document.getElementById('cp_hgz_input').remove();
        if(callback) {callback(text)}
    }

    setInterval(function () {
        const CH = $('#channel-header');
        if (!CH) {
            return;
        }
        CH.off('click');
        CH.on('click', function(){
            const id = CH.attr('data-channelid');
            const title = $('.channel-title')[0].innerHTML;
            copyText(`[${id}] ${title}`, function (){console.log(`[${id}] ${title}`)})
        });
    }, cycle);
});