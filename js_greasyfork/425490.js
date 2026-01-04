// ==UserScript==
// @name         雨课堂课件导出为pdf
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description 雨课堂课件ppt导出为pdf,需要后端支持,详见https://github.com/ShevonKuan/yuektang_ppt2pdf
// @author       shevon
// @match        https://changjiang.yuketang.cn/web/print
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/425490/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%AF%BE%E4%BB%B6%E5%AF%BC%E5%87%BA%E4%B8%BApdf.user.js
// @updateURL https://update.greasyfork.org/scripts/425490/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%AF%BE%E4%BB%B6%E5%AF%BC%E5%87%BA%E4%B8%BApdf.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setTimeout(function () { console.log('开始执行'); }, 3000);
    $('.controls-btns').append('<p class="print fuckyuketang" title="打印">脚本打印</p>');
    $('.fuckyuketang').on('click', function () {
        var link = new Array();
        $('.fuckyuketang').html('开始获取图片资源信息...');
        var link = new Array();
        $.each($('img.pptimg'), function () {
            link.push($(this).attr('src'));
        });
        $('.fuckyuketang').html('检查打印服务器连接...');
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://localhost:63321/",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            data: JSON.stringify({
                'status': 'ok'
            }),
            onload: function () {
                    alert('开始打印...');
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: "http://localhost:63321/print",
                        headers: {
                            "Content-Type": "application/json;charset=utf-8"
                        },
                        data: JSON.stringify({
                            'title': $(document).attr('title'),
                            'link': link
                        }),
                        onload: function () {
                                alert('已完成打印');
                        },
                        onerror: function () {
                            alert("请求失败");
                        }
                    });
                    $('.fuckyuketang').html('脚本打印');
                
            },
            onerror: function () {
                alert("找不到服务器请重试");
                $('.fuckyuketang').html('脚本打印');
            }
        });

    })


})();
