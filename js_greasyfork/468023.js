// ==UserScript==
// @name         显示图片 (jQuery)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  thepiratebay连接缩略图显示，类似rarbg
// @author       CursorBot
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://thepiratebay.party/browse
// @downloadURL https://update.greasyfork.org/scripts/468023/%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87%20%28jQuery%29.user.js
// @updateURL https://update.greasyfork.org/scripts/468023/%E6%98%BE%E7%A4%BA%E5%9B%BE%E7%89%87%20%28jQuery%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 等待页面加载完成
    $(document).ready(function () {
         // 创建弹出框
    const $popup = $('<div>').css({
        position: 'fixed',
        display: 'none',
        zIndex: 9999,
        backgroundColor: 'white',
        padding: '5px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        width: '200px',
        height: '500px',
        right: '5px',
        top: '120px',
        overflow: 'auto'
    }).appendTo('body');
    let currentRequest = null;
    let timeoutId = null;
        // 获取id为searchResult的元素
        const $searchResult = $('#searchResult');
        let href = "";
        const executingRequests = [];

        function clearPopup() {
            executingRequests.forEach(function (request) {
                request.abort();
            });
            $popup.empty().hide();
        }
        if ($searchResult.length) {
            // 为searchResult下的tbody添加鼠标移动事件监听
            $searchResult.find('tbody').off('mousemove').on('mousemove', function (event) {
                // 获取事件目标元素
                const $target = $(event.target);

                // 检查目标元素是否为tr下的第三个td里的第一个a连接
                if ($target.is('a') && $target.parent().index() === 1 && $target.closest('tr').length) {
                    // 获取目标元素的href属性
                    if (href == $target.attr('href')) {
                        $popup.show();
                        return;
                    }
                    href = $target.attr('href');
                    if (currentRequest) {
                        currentRequest.abort();
                    }
                    clearPopup()
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                    }
                    timeoutId = setTimeout(function () {
                        // 使用GM_xmlhttpRequest访问链接并获取内容
                        const request = GM_xmlhttpRequest({
                            method: 'GET',
                            url: href,
                            onload: function (response) {
                                // 将响应内容转换为jQuery对象
                                const $response = $(response.responseText);
                                // 获取class为nfo的div里的内容
                                const nfoContent = $response.find('.nfo').html();
                                // 使用正则表达式匹配图片链接
                                const imageUrls = nfoContent.match(/http[^"'\s]+?\.(?:png|jpe?g)/g);
                                // 清空弹出框内容
                                $popup.empty();
                                // 将匹配到的图片链接添加到弹出框
                                if (imageUrls) {
                                    imageUrls.forEach(function (url) {
                                        $('<img>').attr('src', url.replace(/\[\/img\]$/, '')).css({
                                            width: '200px',
                                            height: 'auto'
                                        }).appendTo($popup);
                                    });
                                }
                                else {
                                    //不是标准的连接
                                    const imageUrls1 = nfoContent.match(/https?:\/\/[^\s]+/g);
                                    if (imageUrls1) {
                                        imageUrls1.forEach(function (url) {
                                            const request = GM_xmlhttpRequest({
                                                method: 'GET',
                                                url: url.replace(/<\/pre>$/, ''),
                                                onload: function (response) {
                                                    const $response1 = $(response.responseText);

                                                    // 获取class为nfo的div里的内容
                                                    const src1 = $response1.find('#image-viewer-container img, .fimg.full_img').attr('src');
                                                    $('<img>').attr('src', src1).css({
                                                        width: '200px',
                                                        height: 'auto'
                                                    }).appendTo($popup);
                                                }
                                            })
                                            executingRequests.push(request);
                                        })
                                    }
                                }
                                // 设置弹出框位置并显示
                                $popup.show();
                            }
                        });
                        executingRequests.push(request);
                        currentRequest = request;
                    }, 500)
                }
            });
            // 鼠标移动到弹出框时不隐藏
            $popup.on('mousemove', function () {
                $popup.show();
            });

            // 鼠标移开弹出框时隐藏并清空
            $popup.on('mouseleave', function () {
                $popup.hide();
            });
        }
    });
})();