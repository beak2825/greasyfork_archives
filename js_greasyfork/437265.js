// ==UserScript==
// @name         hho-amazon-extension
// @namespace    https://www.amazon*
// @version      0.2
// @description  amazon!
// @author       miaomiao
// @match        https://www.amazon.co.jp/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.co.jp
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437265/hho-amazon-extension.user.js
// @updateURL https://update.greasyfork.org/scripts/437265/hho-amazon-extension.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.$
    $(document).ready(function() {
        // 添加按钮
        const button = '<button style="position: fixed; top: 100px; right: 100px;z-index: 99999;background: red;color: #fff;" id="hhoBtn">一键上架</button>'
        $('body').append(button);
        // 提示
        const tips = '<p style="position: fixed; top: 140px; right: 40px;z-index: 99999;color: #333;" id="hhoTips"></p>'
        $('body').append(tips);
    })

    // 点击 一键上架
    $(document).on('click',"#hhoBtn", function(){
        saveHtml();
    });

    function saveHtml() {
        // 获取 html 数据
        const arr = decodeURIComponent(location.pathname).split('/')
        const index = arr.indexOf('dp')
        if (index < 0) {
            alert('监测到不是亚马逊详情页哦，如果确认是详情页请联系管理员');
        } else {
            // 是详情页
            const filename = arr[index + 1]
            // 点击所有缩略图
            $('#altImages li').each(function() { $(this).click() })
            // TODO: 滚动到底部

            $('#hhoTips').text(`${filename} 正在上传`)
            /* var myBlob = new Blob([document.documentElement.innerHTML], { "type" : "text\/html" });
            var formData = new FormData()
            formData.append('source', 'amazon')
            formData.append('filename', filename)
            formData.append('file', myBlob) */

            // 发送请求
            $.ajax({
                url: "https://api.hhodata.com/v2/key-value-stores/amazon/records/" + filename,
                method: 'PUT',
                dataType: 'json',
                data: {
                    html: document.documentElement.innerHTML,
                    url: window.location.href,
                    item_code: filename
                },
                complete: function(data) {
                    if (data.status === 201) {
                        $('#hhoTips').text(`${filename} 上传成功`)
                    } else {
                        $('#hhoTips').text(`${filename} 上传失败`)
                    }
                },
                fail: function(err) {
                    $('#hhoTips').text(`${filename} 上传失败`)
                }
            })
        }

    }
})();