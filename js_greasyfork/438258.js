// ==UserScript==
// @name         hho-tiktok-extension
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  tiktok!
// @author       miaomiao
// @match        https://www.tiktok.com/*
// @icon         https://www.google.com/s2/favicons?domain=tiktok.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438258/hho-tiktok-extension.user.js
// @updateURL https://update.greasyfork.org/scripts/438258/hho-tiktok-extension.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.$
    var title = ''; // 日文标题
    var titleCN = ''; // 中文标题
    var ttnowmLink = ''; // 无水印链接
    var likeNum = 0; // 点赞数
    var commentNum = 0; // 评论数
    var shareNum = 0; // 转发数
    var playNum = 0; // 播放量


    const button = '<button style="position: fixed; top: 100px; right: 100px;z-index: 99999;background: red;color: #fff;" id="hhoBtn">复制信息</button>'
    $('body').append(button);
    const tips = '<div style="position: fixed; top: 140px; right: 100px;z-index: 99999;color: #333;font-size: 8px;cursor: pointer" id="hhoTips"></div>'
    $('body').append(tips);

    $(document).on('click',"#hhoBtn", function(){ copyText() });

    function copyText() {
        const count = window.__NEXT_DATA__.props.pageProps.itemInfo.itemStruct.stats
        title = $('.feed-item-content strong')[0].innerText
        likeNum = count.diggCount
        commentNum = count.commentCount
        shareNum = count.shareCount
        playNum = count.playCount
        // likeNum = $(".bar-item-text[title='like']")[0].innerText
        // commentNum = $(".bar-item-text[title='comment']")[0].innerText
        // shareNum = $(".bar-item-text[title='share']")[0].innerText

        $('#hhoTips').append('<p>准备解析 --' + new Date() + '<p>')
        // 发送请求
        const ttOriginLink = window.__NEXT_DATA__.props.pageProps.seoProps.metaParams.canonicalHref + '?sender_device=pc&sender_web_id=' + window.__NEXT_DATA__.props.initialProps.$wid + '&is_from_webapp=v1&is_copy_url=0'
        $.ajax({
            url: "https://ttwm.athena.hhodata.com/ttwm/tiktok?url=" + encodeURIComponent(ttOriginLink),
            method: 'GET',
            complete: function(data) {
                if (data.status === 200 && data.responseJSON.success) {
                    // 去水印地址ok
                    // console.log(data.responseJSON.data)
                    ttnowmLink = data.responseJSON.data.nowm
                    $('#hhoTips').append('<p>解析成功 --' + new Date() + '<p>')
                    downloadVideo(ttnowmLink, title)
                } else {
                    $('#hhoTips').append('<p>解析失败，请联系管理员或手动解析 -- ' + new Date() + '<p>')
                }
                translate()
            },
            fail: function(err) {
                $('#hhoTips').append('<p>解析失败，请联系管理员或手动解析 -- ' + new Date() + '<p>')
                translate()
            }
        })
    }

    function translate() {
        $('#hhoTips').append('<p>准备翻译 --' + new Date() + '<p>')
        $.ajax({
            url: "https://ttwm.athena.hhodata.com/ttwm/translate?text=" + encodeURIComponent(title),
            method: 'GET',
            complete: function(data) {
                if (data.status === 200 && data.responseJSON.success) {
                    // 翻译ok
                    titleCN = data.responseJSON.data
                    $('#hhoTips').append('<p>翻译成功 --' + new Date() + '<p>')
                } else {
                    $('#hhoTips').append('<p>翻译失败，请联系管理员或手动翻译 -- ' + new Date() + '<p>')
                }

                navigator.clipboard.writeText(`无水印链接：${ttnowmLink}，标题：${title}，标题翻译：${titleCN}，点赞数：${likeNum}，评论数：${commentNum}，转发数：${shareNum}，播放量：${playNum}`).then(res => {
                    $('#hhoTips').append('<p>复制成功 --' + new Date() + '<p>')
                }).catch(err => {
                    $('#hhoTips').append('<p>复制失败 --' + new Date() + '<p>')
                })
            },
            fail: function(err) {
                $('#hhoTips').append('<p>翻译失败，请联系管理员或手动翻译 -- ' + new Date() + '<p>')

                navigator.clipboard.writeText(`无水印链接：${ttnowmLink}，标题：${title}，标题翻译：${titleCN}，点赞数：${likeNum}，评论数：${commentNum}，转发数：${shareNum}，播放量：${playNum}`).then(res => {
                    $('#hhoTips').append('<p>复制成功 --' + new Date() + '<p>')
                }).catch(err => {
                    console.log('复制失败: ', err)
                    $('#hhoTips').append('<p>复制失败 --' + new Date() + '<p>')
                })
            }
        })
    }

    function downloadVideo(link, filename){
        if (!filename) return;
        console.log(link, filename)
        $('#hhoTips').append('<p>准备下载视频 --' + new Date() + '<p>')
        var xhr = new XMLHttpRequest();
        xhr.open('GET', link, true);
        xhr.responseType = 'blob';
        xhr.onload = function() {
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(this.response);
            var tag = document.createElement('a');
            tag.href = imageUrl;
            tag.target = '_blank';
            tag.download = filename;
            document.body.appendChild(tag);
            tag.click();
            $('#hhoTips').append('<p>下载视频成功 --' + new Date() + '<p>')
            document.body.removeChild(tag);
        };
        xhr.onerror = err => {
            $('#hhoTips').append('<p>下载视频失败 --' + new Date() + '<p>')
        };
        xhr.send();
    }
})();