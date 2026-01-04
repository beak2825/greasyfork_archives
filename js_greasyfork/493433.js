// ==UserScript==
// @name        🔵全国图书联盟❤豆瓣🔥京东⭕一键复制🔵一键查询🔍
// @namespace    https://eesk.top
// @version      0.2.2
// @description  全国图书馆参考咨询联盟⭕DXID🔥豆瓣读书❤京东图书🔥读秀SSID❤一键复制🔵一键查询🔍图书电子版⭕图书互助⭕图书文献分享⭕下载电子书，图书联盟，douban.com🔍jd.com👆www.ucdrs.superlib.net👆duxiu.com👆pan.baidu.com⭕比红太狼的平底锅功能更加简便，实用，清洁，只要安装这一个插件即可完成您全网找电子书，1000万+资源，电子书代找，百度网盘图书pdf互助，用完我们的插件请您留下宝贵建议！
// @author       mobi2024
// @icon         data:image/image/vnd.microsoft.icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdM35j1PA+raf398IAAAAAZLC2xWWxNY4oa6uPItoUECObVk/jGNEMYVvZBcAAAAAAAAAAAAAAAAAAAAA+fz8UlrF+d9pzP2DAAAAAH+ntyB7X02BklUsxaphLvO5bzz+uW89/KxoOOuYYjvBb1RAfJycnBIAAAAAAAAAAO76++tlzfr/S8f9naamqj9pOx/HnUgB/9BwF//klEH/77Ju/++zcf/kmEn/z3Ie/6BOCf90Vj+9s7O6JQAAAADd9vnniN/7/xO2/exNWlfmnkAA/8ZvEP/pnCr/1qVL/7SUX961kWPW2KJU/uidMP/feQn/kjsA/3ReUbKZmaoP1fP4kafo9/8fx///PoSQ/8ldAP+sbhb/zJEc/K6Wc5Sff2AIkm1JB66PfGvVlTPz24cQ9shiB/ZmLQn3kYuOVt30+S2o4un2S73p/w+18v+qfjH/pGcO/5RtKOCaioUwn39gCI5xVQmVf2oMrYtxYaR9X26ad2BthWNYcY59fT3MzMwFrtnfh1mChP8gt+7/QbC5/6xwEv+BYS3woHYvr7KAM6m2gzmruYY1qbqIPJmtejqWp2w4l5NZNJdtVEp8AAAAAL/c4yRZUTPdc5B6/w/I//9xlGz/m2Yc/6Z2Hf/Jhxj/yocZ/8SACf/JhgT/y38A/8plAP+iPQD/Uzcq0AAAAAB/f38MWUs8sZloDf9zvbn/Fbrl/317Vt6ojINSq5KDRqiMd0mff2pSp2ob5sd3AP/LagT/lkIB/2FPSKIAAAAAAAAAAXlxc4OMVxL/0KRN/1rG4/8bpdHxlJGUUQAAAAAAAAAAs6KXR7l4HvnPgxj/1IAe/4FLE/+Jg4ZdAAAAAAAAAACfpKotd11F28aIPv/XuoL/Wcjs/yWbw+ybhGKmtIRapLiLT+/UmUT/3Z1M/7yAOf9/a1bExsbUEgAAAAAAAAAAAAAAAJ6eoVSAZUzt16Rt/+zRqP901fP/T7nR/8m1hP/yvH7/6MCM/82kc/+Ea1Pesq2tNaqqqgMAAAAAAAAAAAAAAAAAAAAAenZ6RXxuZMDGp4v/7tW6/4/Z9f9Vw/H/tMjI/8anjO6BbV+mlYWFMAAAAACZzMwFAAAAAAAAAAAAAAAAAAAAAAAAAABdXV0WdnZ2R4l6dHuXhHqbZoORlF264rVTnsa+lbTHKQAAAAAAAAAAndjrDQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbUlJB2ZmMwVtttsOluT6OH3Y/Ghhx/xpUMH8VnbN+V0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @match        *://book.ucdrs.superlib.net/views/specific/*
// @match        *://book.ucdrs.superlib.net/search*
// @match        *://book.douban.com/subject/*
// @match        *://read.douban.com/category/*
// @match        *://item.jd.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.0.0/jquery.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493433/%F0%9F%94%B5%E5%85%A8%E5%9B%BD%E5%9B%BE%E4%B9%A6%E8%81%94%E7%9B%9F%E2%9D%A4%E8%B1%86%E7%93%A3%F0%9F%94%A5%E4%BA%AC%E4%B8%9C%E2%AD%95%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%F0%9F%94%B5%E4%B8%80%E9%94%AE%E6%9F%A5%E8%AF%A2%F0%9F%94%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/493433/%F0%9F%94%B5%E5%85%A8%E5%9B%BD%E5%9B%BE%E4%B9%A6%E8%81%94%E7%9B%9F%E2%9D%A4%E8%B1%86%E7%93%A3%F0%9F%94%A5%E4%BA%AC%E4%B8%9C%E2%AD%95%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%F0%9F%94%B5%E4%B8%80%E9%94%AE%E6%9F%A5%E8%AF%A2%F0%9F%94%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let website = '';
    const isbnReg = /\s*【?ISBN号?】?[:|：]?\s*([0-9\-\·]+)\s*/;
    // 按钮模板
    const copyTpl = ({title = '', isbn = '', ssid = '', doubanid = '', jdid = '', puzzle = false}) => {
        let str = title;
        if(isbn && ssid) {
            str += `#${ssid}`
        } else if(!isbn && ssid){
            str += `#${ssid}`
        } else if(isbn && !ssid){
            str += `#${isbn}`
        }
        let copyBtn = `<button type="button" class="copy" style="padding:0 3px" data-text="${str}">一键复制</button>`
        let titleBtn = `<button type="button" class="copy_title" style="padding:0 3px" data-text="${title}">标题</button>`
        let ssidBtn = `<button type="button" class="copy_ssid" style="padding:0 3px" data-text="${ssid}">DXID</button>`
        let dowmBtn = `<a target="_blank" href="https://eebook.net/so/?ie=utf-8&name=${ssid}">
        <button type="button" class="download" style="padding:0 3px; color:blue;" data-isbn="${ssid}"><font color="#0000FF"><b>DXID查电子图书</b></font></button></a>`
        let isbnBtn = `<button type="button" class="copy_isbn" style="padding:0 3px" data-text="${isbn}">ISBN号</button>`
        let downBtn = `<a target="_blank" href="https://eebook.net/so/?ie=utf-8&name=${isbn}">
        <button type="button" class="download" style="padding:0 3px; color:blue;" data-isbn="${isbn}"><font color="#000080"><b>ISBN查电子图书</b></font></button></a>`
        let jdBtn = `<button type="button" class="copy_doubanid" style="padding:0 3px" data-text="${jdid}">京东id</button>`
        let doubanidBtn = `<button type="button" class="copy_doubanid" data-text="${doubanid}">豆瓣id</button>`
        return `<div class="cn2down" style="margin-top:10px; font-size:14px;display: inline-block;">

${ssid && dowmBtn}
${str && copyBtn}
${title && titleBtn}
${ssid && ssidBtn}
${isbn && isbnBtn}
${isbn && downBtn}
${doubanid && doubanidBtn}
${jdid && jdBtn}
<span class="copy_status" style="color:red;display:none;"></span></div>`
    }
    // 复制
    const copyText = text => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            let textarea = document.createElement('textarea');
            document.body.appendChild(textarea);
            textarea.style.position = 'absolute';
            textarea.style.clip = 'rect(0 0 0 0)';
            textarea.value = text;
            textarea.select();
            document.execCommand('copy', true);
            textarea.remove();
        }
    }
// 图书联盟
    const ucdrs = () => {
        if (location.href.includes("/views/specific/")) {
            // copy 逻辑
            let text = decodeURIComponent($("script:contains(send_requestajax)").text())
            let title = text.match(/sname=(.*?)&/) || '';
            let ssid = text.match(/dx=(.*?)&/) || '';
let isbn = text.match(isbnReg) || '';
            title = title && title[1].replace(/[\+]+?/g, ' ');
            ssid = ssid && ssid[1];
            isbn = isbn ? isbn[1].replace(/-|·/g, '') : '';
            if (ssid) {
                $('.tutilte').append(copyTpl({title, ssid, isbn}));
            } else {
                $('.tutilte').append(copyTpl({title, isbn}));
            }
        } else if(location.href.includes("/search")){
            // 搜索页
            const txtsearch = $('.txtsearch').val();
            let isbn = '';
            if(txtsearch.length === 13 && /[978|979]+?\d{10}/.test(txtsearch)) {
                isbn = $.trim(txtsearch)
            }
            $('td[id="b_img"]').each((i, el) => {
                const lastNode = $(el).parent("tr").find('td:last');
                const title = $(el).parent("tr").find('input[name*="title"]').val().replace(/<[^>]*>/ig, '');
                const ssidA = $(el).parent("tr").find('input[name*="url"]').val();
///修复ssid
function getURLParameter(ssidA, name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(ssidA.split('#')[0]);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));}
var ssid = getURLParameter(ssidA, 'dxNumber'); //
///alert(sside);
//修复ssid
                 if (ssid) {
                    $(lastNode).append(copyTpl({title, ssid, isbn}));
                } else {
                    $(lastNode).append(copyTpl({title, isbn}));
                }
            });
        }}
    // DB
    const douban = () => {
        if (location.href.includes("/subject")) {
            const title = $.trim($('h1 span').text()) || ''
            let isbn = ($('.subject #info').text()).match(isbnReg) || ''
            let doubanid = location.href.match(/\/(\d+?)\//) || ''
            doubanid = doubanid && doubanid[1]
            isbn = isbn && isbn[1]
            $('.subjectwrap').prepend(copyTpl({title, isbn, doubanid}))
        }}
    // JD
    const jd = () => {
        let jdid = location.href.match(/\/(\d+?)\.html/) || ''
        const title = $.trim($('.sku-name').text());
        let isbn = ($('.p-parameter-list').text()).match(isbnReg) || ''
        isbn = isbn && $.trim(isbn[1])
        jdid = jdid && $.trim(jdid[1])
        $('.product-intro .itemInfo-wrap').prepend(copyTpl({title, isbn, jdid}))}
    const getSite = () => {
        const host = location.host
        if(host === 'book.ucdrs.superlib.net') return 'ucdrs'
        if(host === 'book.douban.com') return 'douban'
        if(host === 'item.jd.com') return 'jd'
        if(host === 'read.douban.com') return 'read-douban'
        return false;}
    function run() {
        // GM_addStyle(GM_getResourceText ("customCSS"));
        $(document).on('click', '.cn2down .copy, .cn2down .copy_title, .cn2down .copy_ssid, .cn2down .copy_isbn, .cn2down .copy_doubanid', function(event){
            event.preventDefault();
            const text = $(this).data('text');
            const message = text ? '（复制成功）' : '（暂无信息）'
            copyText(text)
            $(this).siblings('.copy_status').text(message).show().delay(1000).hide(0);
        })
const type = getSite();
        if(type === 'jd') jd()
        if(type === 'douban') douban()
        if(type === 'ucdrs') ucdrs()
    }
    run();
})();