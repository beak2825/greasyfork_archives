// ==UserScript==
// @name         网页便利店
// @namespace    https://github.com/maxsky/WebPage-CVS
// @version      0.4.11
// @description  一些网页上的简单处理，使其更适合浏览
// @author       Max Sky
// @match        *://*.blog.csdn.net/article/details/*
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://link.csdn.net/*
// @match        *://gitee.com/link*
// @match        *://www.baidu.com/s*
// @match        *://weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi?*
// @match        *://c.pc.qq.com/*
// @match        *://link.juejin.cn/?target*
// @match        *://mac-torrent-download.net/pw*
// @match        https://www.google.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373649/%E7%BD%91%E9%A1%B5%E4%BE%BF%E5%88%A9%E5%BA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/373649/%E7%BD%91%E9%A1%B5%E4%BE%BF%E5%88%A9%E5%BA%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getCookie(name) {
        name = name + '=';

        let ca = document.cookie.split(';');

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }

        return '';
    }

    let domain = document.location.origin;

    if (domain.indexOf('google.com') > -1) {
        let e = document.getElementsByClassName('gb_d');

        for (let i in e) {
            let item = e[i];

            if (item.getAttribute('data-pid') === '2') {
                item.href = item.href.replace(/https:\/\/.*?\//, 'https://' + document.domain + '/');
            }
        }
    }

    if (domain.indexOf('baidu.com') > -1) {
        $('#wrapper_wrapper').bind('DOMSubtreeModified', function () {
            let rightContent = $(this).find('#content_right');

            if (rightContent) {
                rightContent.hide();
            }
        });
    } else if (domain.indexOf('csdn.net') > -1) {
        if (domain.indexOf('link.csdn.net') > -1) {
            const gitCodeUrl = document.querySelector('a.loading-btn');

            if (gitCodeUrl) {
                location.href = gitCodeUrl.href;
            } else {
                location.href = new URLSearchParams(document.location.search).get('target');
            }
            return;
        }

        if (!getCookie('unlogin_scroll_step')) {
            $('head').append('<style>.login-mark{display:none!important;}#passportbox{display:none!important;}</style>');
        }

        // 移除阅读更多按钮
        $('#content_views .hide-preCode-box').remove();

        // 移除限高
        let codeViews = $('#content_views .set-code-hide');

        codeViews.removeClass('set-code-hide');
        codeViews.addClass('set-code-show');

        // 监听剪切板
        $(document.body).bind('copy', function (e) {
            var clipboard = window.clipboardData; // IE

            if (clipboard === undefined) {
                clipboard = e.originalEvent.clipboardData;
            }

            let clipboardStr = clipboard.getData('text');

            if (clipboardStr !== '' && clipboardStr.indexOf('版权声明：本文为博主原创文章') !== -1) {
                const regex = /(\n—[^]+)/mg;

                clipboardStr = clipboardStr.replace(regex, '');

                if (clipboardStr !== '') {
                    clipboard.setData('text', clipboardStr);
                }
            }
        });
    } else if (domain.indexOf('weixin110.qq.com') > -1) {
        const wxpatt = new RegExp(/(?<=cgiData = ).*(?=;)/g);
        let data = wxpatt.exec(document.body.getElementsByTagName('script')[0].text);

        data = JSON.parse(data);

        if (data.url) {
            let url = data.url.replace(/&#x2f;/g, '/');

            location.href = url.replace(/amp;/g, '&');
        }
    } else if (domain.indexOf('c.pc.qq.com') > -1) {
        const qqpatt = new RegExp(/(?<=">).*/g);

        let eleUrl = $('#url');

        if (eleUrl) {
            location.href = qqpatt.exec($('#url').html());
        } else {
            const objUrl = new URL(location.href);

            location.href = objUrl.searchParams.get('url');
        }
    } else if ((domain.indexOf('link.juejin.cn') > -1) || (domain.indexOf('gitee.com') > -1)) {
        const target = new URL(location.href);

        const targetUrl = target.searchParams.get('target');

        if (targetUrl) {
            location.href = targetUrl;
        }
    } else if (domain.indexOf('mac-torrent-download.net') > -1) {
        if (location.pathname === '/pw.php') {
            const mtpwpatt = new RegExp(/(?<=atob\(').*?(?='\);)/mg);
            const realUrl = mtpwpatt.exec($('#entry-content').html());

            location.href = atob(realUrl);
        } else {
            const patt = new RegExp(/(?<=_0x54f9=\[).*?(?=];)/mg);
            let arrayStr = patt.exec($('#content').prev().html()) + '';

            arrayStr = arrayStr.replace(/\\x/g, '%');
            arrayStr = arrayStr.replace(/'/g, '"');

            let array = $.parseJSON('[' + arrayStr + ']');

            if (typeof (array) === 'object') {
                let pwd = array[array.length - 1];

                pwd = atob(pwd);

                let container = $('#password-container');

                container.on('DOMNodeInserted', function () {
                    $(this).css({
                        'background-color': '#7bc74d',
                        'color': 'white',
                        'cursor': 'pointer'
                    });

                    let passwd = $('#passwd');

                    passwd.css('cursor', 'pointer');
                    passwd.val(pwd);
                });

                container.click(function () {
                    var clipboard = window.clipboardData; // IE

                    if (clipboard === undefined) {
                        const el = document.createElement('textarea');
                        el.value = pwd;
                        document.body.append(el);

                        el.select();
                        document.execCommand('copy');
                    } else {
                        clipboard.setData(pwd);
                    }

                    alert('Copied!');
                });
            }
        }
    }
})();
