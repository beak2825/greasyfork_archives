// ==UserScript==
// @name                Office Files Online Preview
// @name:zh-CN          Office 文件在线预览(支持Excel、Word、PowerPoint等格式)
// @name:ja             Officeファイルオンラインプレビュー
// @name:ru             Онлайн предварительный просмотр файлов Office
// @author              scavin
// @namespace           https://github.com/scavin
// @supportURL          https://meta.appinn.net/t/topic/64140
// @homepage            https://www.appinn.com
// @version             0.2.2
// @description         Automatically convert Office file links to Office Online Preview
// @description:zh-CN   自动将Office文件链接转换为Office Online预览，支持Excel、Word、PowerPoint等格式
// @description:ja      Officeファイルリンクを自動的にOffice Onlineプレビューに変換します
// @description:ru      Автоматическое преобразование ссылок на файлы Office для предварительного просмотра в Office Online
// @icon                data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij4KICA8cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9IiMyMTk2NTMiIHJ4PSI2Ii8+CiAgPHRleHQgeD0iMzIiIHk9IjM2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5YTFM8L3RleHQ+CiAgPHBhdGggZD0iTTMyIDQ0QzM2IDQ0IDM5IDQ4IDM5IDUyQzM5IDU2IDM2IDU4IDMyIDU4QzI4IDU4IDI1IDU2IDI1IDUyQzI1IDQ4IDI4IDQ0IDMyIDQ0WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+
// @match               *://*/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/520602/Office%20Files%20Online%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/520602/Office%20Files%20Online%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            let href = e.target.href;
            // 确保获取完整的URL
            let fullUrl = new URL(href, window.location.href).href;

            if (fullUrl.match(/\.(xlsx?|docx?|pptx?)$/i)) {
                e.preventDefault();
                // 使用encodeURI而不是encodeURIComponent来保留URL结构
                let previewUrl = 'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURI(fullUrl);
                window.open(previewUrl, '_blank');
            }
        }
    });
})();
