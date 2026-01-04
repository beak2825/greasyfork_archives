// ==UserScript==
// @name               自用微信公众号文章阅读页面优化
// @match              https://mp.weixin.qq.com/s/*
// @match              https://mp.weixin.qq.com/s?__biz=*
// @grant              none
// @version            1.9
// @author             ZhaoJY
// @description        禁用微信公众号图片延迟加载并优化页面显示效果
// @description:zh-CN  去除图片延迟加载，直接显示原图片；调整字体大小和背景颜色
// @run-at             document-start
// @require            https://code.jquery.com/jquery-3.3.1.min.js
// @icon               https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://mp.weixin.qq.com
// @license            MIT
// @namespace https://greasyfork.org/users/1443756
// @downloadURL https://update.greasyfork.org/scripts/529253/%E8%87%AA%E7%94%A8%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/529253/%E8%87%AA%E7%94%A8%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    // 等待网页完成加载
    window.addEventListener('load', function () {
        // 隐藏二维码
        setTimeout(() => {
            const qrCodeElement = document.querySelector('#js_pc_qr_code');
            if (qrCodeElement) {
                qrCodeElement.setAttribute("style", "display: none !important;");
            }
        }, 1000);

        // 调整主要内容区域的宽度
        const contentWrapperElement = document.querySelector('.rich_media_area_primary_inner');
        if (contentWrapperElement) {
            contentWrapperElement.setAttribute('style', "max-width: 61%;");
        }

        // 插入全局样式以确保字体大小和背景颜色生效
        const styleSheet = `
            .rich_media_area_primary {
                background-color: rgb(211, 239, 209) !important;
            }
            .rich_media_content p,
            .rich_media_content span,
            .rich_media_content div,
            .rich_media_content li {
                font-size: 18px !important;
                line-height: 1.6 !important; /* 可选：调整行高 */
            }
            .rich_media_title {
                font-size: 24px !important;
            }
        `;
        const styleTag = document.createElement('style');
        styleTag.type = 'text/css';
        styleTag.appendChild(document.createTextNode(styleSheet));
        document.head.appendChild(styleTag);
    }, false);

    // 禁用微信图片延迟加载，直接显示原图片
    var $ = window.jQuery;

    $(document).ready(function() {
        setTimeout(function(){
            $('img').each(function(){
                var dataSrc = $(this).attr('data-src');
                if (dataSrc){
                    $(this).attr('src', dataSrc);
                    $(this).removeAttr('data-src');
                }
            });
        }, 1000);
    });

    // 替换文档中的懒加载属性
    document.body.innerHTML = document.body.innerHTML.replace("wx_lazy=1", "");
    document.body.innerHTML = document.body.innerHTML.replace(new RegExp("data-src", "g"), "src");
})();