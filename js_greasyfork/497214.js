// ==UserScript==
// @name         天天看小说TXT下载
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  小说详情页面点击【TXT下载】按钮开始下载
// @author       Nihaorz
// @match        https://www.ttkan.co/novel/chapters/*
// @match        https://cn.ttkan.co/novel/chapters/*
// @match        https://tw.ttkan.co/novel/chapters/*
// @icon         https://www.bg3.co/novel/imgs/apple-touch-icon-120x120.png

// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497214/%E5%A4%A9%E5%A4%A9%E7%9C%8B%E5%B0%8F%E8%AF%B4TXT%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/497214/%E5%A4%A9%E5%A4%A9%E7%9C%8B%E5%B0%8F%E8%AF%B4TXT%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let blacklist = [
        '•', '▪', '●', '✿', 'щ', 'ш', 'ω', 'т', 'κ', 'д', 'ā', '￠', '℃', '○', 'Ο'
    ]

    let $ul = $('.novel_info ul:eq(0)');
    let title = $ul.find('li:eq(0) h1').html();
    let author = $ul.find('li:eq(1) a').html();
    let filename = title + '-' + author + '.txt';

    let href = window.location.href;
    let address = href.split('/novel/chapters/');
    let novel_id = address[1];
    if (novel_id.includes('\\')) {
        novel_id = novel_id.substring(0, novel_id.indexOf('/'));
    }
    let novel_chapters_url = address[0] + '/api/nq/amp_novel_chapters?language=cn&novel_id=' + novel_id;
    let wordCount = 0;
    let intervalId = null;
    let texts = [];

    let ajaxHtml = function(url, i) {
        let text;
        if (i == undefined) {
            i = 0;
        }
        $.ajax({
            type: 'GET',
            url: url,
            async: false,
            success: function(response, status, xhr) {
                let contetType = xhr.getResponseHeader('Content-Type');
                if (contetType.includes('json')) {
                    i++;
                    console.log(url + ' 请求异常，第' + i + '次重试');
                    text = ajaxHtml(url, i);
                } else {
                    text = response;
                }
            }
        });
        return text;
    }

    let getContents = function(html) {
        let arrays = $(html).find(".content p");
        let contents = [];
        let name = $(html).find('.title h1').html();
        contents.push(name);
        for (let i = 0; i < arrays.length; i++) {
            let content = $(arrays[i]).text().trim();
            let flag = false;
            for (let j = 0; j < blacklist.length; j++) {
                let word = blacklist[j];
                if (content.includes(word)) {
                    flag = true;
                    break;
                }
            }
            if(!flag) {
                contents.push(content);
            }
        }
        return contents;
    }

    let doDownloadAsync = function(items) {
        if (!intervalId) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(function() {
            let count = 0;
            for (let i = 0; i < texts.length; i++) {
                let text = texts[i];
                if (text && text.length > 0) {
                    count++;
                }
            }
            let info = '(下载进度：' + (count / texts.length * 100).toFixed(2) + '%)';
            console.log(info);
            $('#down-info').html(info);
            if (count == texts.length) {
                clearInterval(intervalId);
                intervalId = null;
                download(texts, filename);
            }
        }, 100);
        texts = new Array(items.length);
        for (let i = 0; i < items.length; i++) {
            let url = address[0] + '/novel/pagea/' + novel_id + '_' + items[i].chapter_id + '.html';
            fillContent(texts, i, url);
        }
    }

    let fillContent = function(texts, index, url) {
        $.ajax({
            type: 'GET',
            url: url,
            success: function(html) {
                let contents = getContents(html);
                texts[index] = contents.join('\n\n').trim() + '\n\n\n';
            },
            error: function() {
                fillContent(texts, index, url);
            }
        });
    }

    let refersh = function(progress, wordCount) {
        $('#down-info').html(progress + "%");
    }

    let download = function (strings, filename) {
        // 创建隐藏的可下载链接
        var eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.style.display = 'none';
        // 字符内容转变成blob地址
        var blob = new Blob(strings);
        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
    };

    $('.bookmark').append('<a id="text-down" href="javascript:void(0);">&nbsp;&nbsp;TXT下载&nbsp;&nbsp;<span id="down-info"></span></a>');
    $('#text-down').on('click', function(){
        $.ajax({
            type: 'GET',
            url: novel_chapters_url,
            async: false,
            success: function(data) {
                doDownloadAsync(data.items);
            }
        });
    });
    // Your code here...
})();