// ==UserScript==
// @name         文档下载使能
// @namespace    https://github.com/dadaewqq/fun
// @version      2.3
// @description  在hio文档预览页面上添加一个下载按钮
// @author       dadaewqq
// @match        https://hio.oppo.com/app/ozone/*/gotoOzoneCircleKbItemDetail*
// @match        https://hio.oppo.com/app/kb/center/view*
// @match        https://hio.oppo.com/app/videoCourse/detail/*
// @match        https://hio.oppo.com/app/module/detail*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508120/%E6%96%87%E6%A1%A3%E4%B8%8B%E8%BD%BD%E4%BD%BF%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/508120/%E6%96%87%E6%A1%A3%E4%B8%8B%E8%BD%BD%E4%BD%BF%E8%83%BD.meta.js
// ==/UserScript==




(function() {
    'use strict';

    // 防止与其他库冲突
    var $ = window.jQuery.noConflict(true);

    // 获取当前页面 URL
    var currentUrl = window.location.href;

    // 判断 URL 是否匹配特定的视频课程详情页
    if (currentUrl.startsWith('https://hio.oppo.com/app/videoCourse/detail/')) {
        // 提取课程 ID
        var pathnameParts = location.pathname.split("/");
        var courseId = pathnameParts[pathnameParts.length - 1];

        // 构建 API 请求地址
        var apiUrl = `https://hio.oppo.com/app/videoCourse/getDetail?id=${courseId}`;

        // 发送 AJAX 请求
        $.ajax({
            url: apiUrl,
            type: "GET",
            headers: {
                Accept: "application/json",
            },
            success: function (response) {
                if (response && response.data && response.data.contents && response.data.contents.length > 0) {
                    // 遍历所有内容
                    response.data.contents.forEach(function(content, index) {
                        var downloadUrl = content.fileUrl;
                        var fileName = content.fileName || document.title;

                        // 提取文件后缀名
                        var fileExtension = downloadUrl.split(".").pop();

                        // 创建浮动按钮
                        var downloadButton = $('<button>下载 ' + (index + 1) + '</button>').css({
                            position: "fixed",
                            top: (60 + index * 50) + "px", // 每个按钮的垂直位置不同，以防重叠
                            left: "20px",
                            padding: "10px 20px",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            zIndex: 10000,
                        });

                        // 按钮点击事件，下载文件
                        downloadButton.on("click", function () {
                            var link = document.createElement("a");
                            link.href = downloadUrl;
                            link.download = fileName + "." + fileExtension;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        });

                        // 将按钮添加到页面上
                        $("body").append(downloadButton);
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX 请求失败：", status, error);
            },
        });
    } else if (currentUrl.startsWith('https://hio.oppo.com/app/module/detail')) {

        // 提取课程 ID
		var courseId = location.search;


        // 构建 API 请求地址
        var apiUrl = `https://hio.oppo.com/app/module/detail-info${courseId}`;

        // 发送 AJAX 请求
        $.ajax({
            url: apiUrl,
            type: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            success: function(response) {
                if (response && response.module && response.module.res && response.module.res.res_src_link.length > 0) {
                    var content = response.module.res;
                    var downloadUrl = content.res_src_link;
                    var fileName = content.res_title || document.title;

                    // 提取文件后缀名
                    var fileExtension = downloadUrl.split('.').pop();

                    // 创建浮动按钮
                    var downloadButton = $('<button id="downloadButton">下载</button>').css({
                        position: 'fixed',
                        top: '60px',
                        left: '20px',
                        padding: '10px 20px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        zIndex: 10000
                    });

                    // 按钮点击事件，下载文件
                    downloadButton.on('click', function() {
                        var link = document.createElement('a');
                        link.href = downloadUrl;
                        link.download = fileName + '.' + fileExtension;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });

                    // 将按钮添加到页面上
                    $('body').append(downloadButton);
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX 请求失败：", status, error);
            }
        });
    }
    else {
        // 处理非视频课程详情页的情况

        $(document).ready(function() {
            var downloadUrl = null;
            var fileName = document.title;

            // 尝试查找包含 isImage('xxx') 的元素
            var isImageElement = $("*:contains('isImage(')");
            if (isImageElement.length) {
                var regex = /isImage\('([^']+)'\);/;
                var match = regex.exec(isImageElement.text());
                if (match) {
                    downloadUrl = match[1];
                    fileName = document.title; // 保持页面标题作为文件名前缀
                }
            }
            // 如果找到了下载链接，创建下载按钮
            if (downloadUrl) {
                // 提取文件后缀名
                var fileExtension = downloadUrl.split('.').pop();

                // 创建浮动按钮
                var downloadButton = $('<button id="downloadButton">下载</button>').css({
                    position: 'fixed',
                    top: '60px',  // 向下移动一些
                    left: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    zIndex: 10000
                });

                // 按钮点击事件，下载文件
                downloadButton.on('click', function() {
                    var link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = fileName + '.' + fileExtension; // 使用提取的文件名和文件后缀名
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });

                // 将按钮添加到页面上
                $('body').append(downloadButton);
            }
        });
    }
})();