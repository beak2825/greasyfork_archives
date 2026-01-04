// ==UserScript==
// @name         页面净化
// @description  隐藏任意网站的任意元素(图片/视频/文字/广告等)，干干净净地冲浪。
// @version      1.0.0
// @match        https://*.zhihu.com/*
// @match        https://*.bilibili.com/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @namespace    https://greasyfork.org/users/978718
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500776/%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/500776/%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
(function () {
    //公用方法
    const utils = {
        throttle: function (func, wait) {
            let timeout;
            return function () {
                const context = this;
                const args = arguments;
                if (!timeout) {
                    timeout = setTimeout(() => {
                        timeout = null;
                        func.apply(context, args)
                    }, wait)
                }
            }
        }
    }
    //主要逻辑
    const view = {
        //直接隐藏的标签集合(需符合jQuery选择器写法)
        hideNodes: ['img', 'video'],
        //降低透明度的标签集合(需符合jQuery选择器写法)
        opacityNodes: ['.QuestionHeader-title', '.QuestionHeader-content', '.AppHeader-inner'],
        init: function () {
            this.handleNodes()
            this.bindEvents();
        },
        handleNodes: function () {
            this.hideNodes.forEach(function (node) {
                $(node).css({ 'display': 'none' });
            });
            this.opacityNodes.forEach(function (node) {
                $(node).css({ 'opacity': 0.01 });
            });
        },
        bindEvents: function () {
            $(window).on('scroll', utils.throttle(() => {
                this.handleNodes();
            }, 300))
        }
    }
    view.init();
})();