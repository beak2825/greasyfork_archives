// ==UserScript==
// @name                pure reading
// @name:zh-CN          阅读模式
// @description         Update site style for reading 
// @description:zh-CN   修改特定网站界面的样式以便阅读
// @version             0.1.8
// @author              jferroal
// @license             GPL-3.0
// @require             https://greasyfork.org/scripts/31793-jmul/code/JMUL.js?version=209567
// @include             http://*
// @include             https://*
// @run-at              document-end
// @namespace           https://greasyfork.org/users/34556
// @downloadURL https://update.greasyfork.org/scripts/35530/pure%20reading.user.js
// @updateURL https://update.greasyfork.org/scripts/35530/pure%20reading.meta.js
// ==/UserScript==

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const { Element } = window.JMUL || { Element: {} };

class ToRemove {
    constructor (toRemoveSelectors) {
        this.toRemoveSelectors = toRemoveSelectors;
    }

    startRemove () {
        this.toRemoveSelectors.forEach(s => {
            const elems = document.querySelectorAll(s);
            if (elems && elems.length) {
                elems.forEach(e => e.remove());
            }
        });
    }
}

class ToUpdate {
    constructor (toUpdateElements) {
        this.toUpdateElements = toUpdateElements;
    }

    startUpdate () {
        this.toUpdateElements.forEach(e => {
            const elem = document.querySelector(e.selector);
            if (elem) {
                const jElem = new Element(elem);
                jElem.setCss(e.styles);
            }
        });
    }
}

module.exports = { ToRemove, ToUpdate };
},{}],2:[function(require,module,exports){
const { Sites } = require('./sites');

(function () {
    Sites.forEach(site => {
        site.start(window.location.href);
    });
})();
},{"./sites":3}],3:[function(require,module,exports){
const { ToRemove, ToUpdate } = require('./Operator');

class Site {
    constructor (siteSetting) {
        this.workingTimeout = null;
        this.match = (url) => siteSetting.url.test(url);
        this.toRemove = new ToRemove(siteSetting.toRemove);
        this.toUpdate = new ToUpdate(siteSetting.toUpdate);
    }


    start (url) {
        if (!this.match(url)) return;
        if (this.workingTimeout) {
            clearTimeout(this.workingTimeout);
            this.workingTimeout = null;
        }
        return new Promise((res) => {
            this.workingTimeout = setTimeout(() => {
                this.toRemove.startRemove();
                this.toUpdate.startUpdate();
                res('done')
            }, 100);
        });
    }
}

const Jobbole = {
    url: /http:\/\/.*\.jobbole\.com\/.*/,
    toRemove: [
        '#top-nav',
        'header',
        '.copyright-area',
        '#breadcrumb',
        '#main-nav',
        '#sidebar',
        '.entry-meta',
        '#full-btm',
        '#full-top',
        '.post-adds',
        '#author-bio',
        '#cboxOverlay',
        '#colorBox',
        '#article-comment',
        '#comment_list',
        '.clear',
        'footer',
        '#bottom',
        '.textwidget',
    ],
    toUpdate: [ {
        selector: '#wrapper',
        styles: {
            padding: 0,
            background: 'transparent',
        },
    }, {
        selector: 'body',
        styles: {
            background: '#E3EDCD',
            'padding-top': '80px',
        },
    }, {
        selector: '.grid-8',
        styles: {
            'width': '100%',
        },
    } ],
};

const Cartoonmad = {
    url: /http:\/\/www\.cartoonmad\.com\/comic\/\d{5,}\.html/,
    // 这里是 traps, 因为 dom 操作是同步的, 当一个 element 被删除之后, 如果使用 nth-child 这样的顺序相关的 selector 的时候, 一定要注意
    toRemove: [
        'body > table > tbody > tr:nth-child(1)',
        'body > table > tbody > tr:nth-child(1)',
        'body > table > tbody > tr:nth-child(1)',
        'body > table > tbody > tr:nth-child(1)',
        'body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td:nth-child(2)',
        'body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td:nth-child(2)',
        'body > table > tbody > tr:nth-child(3)',
    ],
    toUpdate: [],
};

const CSDNBlog = {
    url: /http:\/\/blog\.csdn\.net\/.*?\/article\/details\/.*/,
    toRemove: [
        '.switchDOM',
        '.csdn-toolbar',
        '.toolbar-s',
        '#toolbar-tpl-scriptId',
        '.left_fixed',
        '.right_fixed',
        '.pop_win',
        '.pop_mask',
        '.pop_CA_cover',
        '.pop_CA_cover',
        '.pop_CA',
        '.report_dialog',
        'aside',
        '.article_copyright',
        '.article_collect',
        '.comment_box',
        '.comment_li_outbox',
        '.more_comment',
        '.recommend_tit',
        '.recommend_list',
        'ul.right_bar',
    ],
    toUpdate: [ {
        selector: '.container',
        styles: {
            width: '960px',
        },
    } ],
};

const BaiduSearch = {
    url: /https?:\/\/www\.baidu\.com\/s.*/,
    toRemove: [
        '#content_left > div:not(.result)',
        '#content_right',
        '#rs',
    ],
    toUpdate: [ {
        selector: '#container',
        styles: {
            width: '100%',
            display: 'flex',
            'flex-direction': 'column',
            'align-items': 'center',
        },
    }, {
        selector: '#content_left',
        styles: {
            padding: 0,
        },
    }, {
        selector: '#page',
        styles: {
            padding: 0,
        },
    }, {
        selector: '.head_nums_cont_inner .nums,',
        styles: {
            width: '100%',
            margin: 0,
        },
    } ],
};

module.exports = {
    Sites: [ new Site(Jobbole), new Site(Cartoonmad), new Site(CSDNBlog), new Site(BaiduSearch) ],
};
},{"./Operator":1}]},{},[2]);
