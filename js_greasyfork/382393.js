// ==UserScript==
// @name         人人影视：人人下载器链接导出
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  对人人影视资源下载的在线看一栏加入一键链接复制（复制人人客户端下载链接）
// @author       Callback
// @match        http://got001.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/382393/%E4%BA%BA%E4%BA%BA%E5%BD%B1%E8%A7%86%EF%BC%9A%E4%BA%BA%E4%BA%BA%E4%B8%8B%E8%BD%BD%E5%99%A8%E9%93%BE%E6%8E%A5%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/382393/%E4%BA%BA%E4%BA%BA%E5%BD%B1%E8%A7%86%EF%BC%9A%E4%BA%BA%E4%BA%BA%E4%B8%8B%E8%BD%BD%E5%99%A8%E9%93%BE%E6%8E%A5%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict'

    $("div[id$='-APP']")
    $("ul.down-list[format='APP']").parent().append('<a class="btn btn-default rrsharer" style="transition: background-color 0.3s ease 0s; border-color: rgba(0, 0, 0, 0.35); background-color: rgb(193, 230, 198);">复制以上人人下载链接</a>')

    $("a.rrsharer").click(function(){
        let links = []
        $(this).siblings("ul.down-list[format='APP']").find("a[class='btn rrdown btn-download']").each(function(){
            links.push($(this).attr('data-url'))
        })
        GM_setClipboard(links.join('\n'), 'text')
        alert('Copy Success!')
    })
})()