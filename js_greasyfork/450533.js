// ==UserScript==
// @name         净化常用国内博客
// @namespace    https://github.com/jackkke
// @namespace    https://gitee.com/jackkke
// @version      1.5
// @description  纯净进行 Ctrl+C, 贯彻执行 write once run everywhere.源码：https://jsrun.net/dHsKp
// @author       jackkke hangao1204@hotmail.com
// @match        *://blog.csdn.net/*
// @match        *://www.cnblogs.com/*
// @match        *://www.jianshu.com/*
// @match        *://juejin.cn/*
// @match        *://www.oschina.net/*
// @match        *://segmentfault.com/*
// @match        *://www.jb51.net/*
// @downloadURL https://update.greasyfork.org/scripts/450533/%E5%87%80%E5%8C%96%E5%B8%B8%E7%94%A8%E5%9B%BD%E5%86%85%E5%8D%9A%E5%AE%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/450533/%E5%87%80%E5%8C%96%E5%B8%B8%E7%94%A8%E5%9B%BD%E5%86%85%E5%8D%9A%E5%AE%A2.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let blogSiteDb = {
        csdn: {
            siteId: 'csdn',
            remove_class: ['blog_container_aside', 'insert-baidu-box', 'first-recommend-box', 'second-recommend-box', 'blog-footer-bottom', 'template-box', 'recommend-nps-box', 'tool-QRcode', 'kind_person', 'csdn-common-logo-advert', 'toolbar-advert'],
            remove_id: ['asideHotArticle', 'asideNewComments', 'asideArchive', 'asideNewNps', 'asideSearchArticle',],
            remove_more: ['.csdn-side-toolbar a:not(:last-child)',],
            pro_styles: []
        },
        'cnblogs': {
            siteId: 'cnblogs',
            remove_class: [],
            remove_id: ['cnblogs_c1', 'under_post_card1', 'under_post_card2', 'sideBar'],
            remove_more: [],
            pro_styles: ['#mainContent{margin: 0;}', '.forFlow{margin: 15px;}']
        },
        'jianshu': {
            siteId: 'jianshu',
            remove_class: ['_13lIbp', 'ouvJEz:last-of-type', '_1jKNin'],
            remove_id: [],
            remove_more: ['footer', 'footer ~ div', 'aside',],
            pro_styles: []
        },
        'juejin': {
            siteId: 'juejin',
            remove_class: ['.extension', '.recommended-area', '.sidebar', '.article-suspended-panel'],
            remove_id: [],
            remove_more: [],
            pro_styles: []
        },
        'oschina': {
            siteId: 'oschina',
            remove_class: ['other-articles-box', 'detail-toolbar-box', 'sidebar-box', 'codeBlock'],
            remove_id: ['footer'],
            remove_more: [],
            pro_styles: []
        },
        'segmentfault': {
            siteId: 'segmentfault',
            remove_class: ['functional-area-left', 'right-side', 'recommend-list-wrap', 'border-width-2'],
            remove_id: ['#footer'],
            remove_more: [],
            pro_styles: []
        },
        'jb51': {
            siteId: 'jb51',
            remove_class: ['xgcomm', 'main-right', 'art_xg'],
            remove_id: ['footer', 'ewm', 'right-share'],
            remove_more: [],
            pro_styles: []
        }
    };
    let handle = function (host, type) {
        const hosts = host.split('.');
        const id = hosts[hosts.length - 2];
        if (blogSiteDb.hasOwnProperty(id)) {
            console.log('refine current site [' + id + '] by jackkke');
            if (type === 'style') {
                handleCss(blogSiteDb[id])
            } else if (type === 'javascript') {
                handleJs(blogSiteDb[id])
            } else {
                console.error('处理类型有误！')
            }
        }
    };
    let handleCss = function (db) {
        let style = document.createElement('style');
        db.remove_class.forEach(function (css) {
            style.appendChild(document.createTextNode('.' + css + '{display: none!important;}'))
        });
        db.remove_id.forEach(function (id) {
            style.appendChild(document.createTextNode('#' + id + '{display: none!important;}'))
        });
        db.remove_more.forEach(function (more) {
            style.appendChild(document.createTextNode(more + '{display: none!important;}'))
        });
        db.pro_styles.forEach(function (pro_style) {
            style.appendChild(document.createTextNode(pro_style))
        });
        document.getElementsByTagName('head')[0].appendChild(style)
    };
    let handleJs = function (db) {
        db.remove_class.forEach(function (css) {
            let elements = document.getElementsByClassName(css);
            if (elements && elements.length > 0) {
                Array.prototype.forEach.call(elements, function (element) {
                    element.remove()
                })
            }
        });
        db.remove_id.forEach(function (id) {
            document.getElementById(id).remove()
        })
    };
    handle(location.host, 'style');

    function newLoadHandler() {
        handle(location.host, 'javascript')
    }
    var oldLoadHandler = window.onload;
    window.onload = function () {
        if (oldLoadHandler) {
            oldLoadHandler()
        }
        newLoadHandler()
    }
})();