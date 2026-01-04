// ==UserScript==
// @name         Tapd文档目录
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @author       ziyue7575
// @description  tapd文档目录（原文档有目录的优化展示，没有目录生成目录）
// @match        https://www.tapd.cn/*/documents/show/*
// @icon         https://www.google.com/s2/favicons?domain=tapd.cn
// @grant        none
// @license MIT
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/490183/Tapd%E6%96%87%E6%A1%A3%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/490183/Tapd%E6%96%87%E6%A1%A3%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //创建css文件
    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode(`.wiki-toc{
        font-size: 14px;
        }
    
        .wiki-toc .category{
        display:none}
        .wiki-toc .content div div {
        padding:6px 0;
    
        }
        .wiki-toc .content div div:hover{
        background-color:#f5f2f2}
    `);

    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);

    $('#toggleCategory').click();
    $('.detail-tab-ul').prepend('<li class="detail-tab-li" id="li-wiki-toc"><a rel="wiki-toc-tpl">目录</a></li>')

    //读取tapd生成的目录
    var tocClassName = '.wiki-toc';
    var doc = $(tocClassName).clone();

    if (doc.length == 0) {
        //重新读取tapd生成的目录
        tocClassName = '.toc'
        doc = $(tocClassName).clone();
    }
    if (doc.length == 0) {
        //还是没有，自己拼接
        doc = $('#htmlDom');
        var allDoc = doc.children();
        var list = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7']
        doc = $("<div>");
        addDiv(doc, allDoc, list)

    } else {
        $(tocClassName).hide()
    }
    var script = $('<script id="wiki-toc-tpl" type="text/html">目录<\/script>');

    $('body').append(script);
    $('#li-wiki-toc').on('click', function () {
        //生成的目录设置进去
        $("#detail-content").html(doc)
    })

    //切换到目录标签页
    setTimeout(function () {
        $('#li-wiki-toc').click();
        $('.fd-comments').hide();
    }, 200)


})();

function addDiv(doc, allDoc, list) {
    if (allDoc.length > 0) {
        for (let index = 0; index < allDoc.length; index++) {
            var element = $(allDoc[index]);
            var name = element.prop("tagName").toLowerCase();
            if (name) {
                if (name=='div') {
                    var allChilDoc = element.children();
                    addDiv(doc,allChilDoc,list)
                }else {
                    var indexof = list.indexOf(name);
                    if (indexof != -1) {
                        var html1 = '<li class="toc-li"><a class="level-' + (indexof + 1) + '"   href="#' + element.attr('id') + '"   >' + element.text() + ' </a></li>';
                        doc.append(html1);
                    }
                }

            }

        }
    }
}
