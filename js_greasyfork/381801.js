// ==UserScript==
// @name         吾爱破解论坛左侧文章目录移到右边
// @namespace    https://www.52pojie.cn/thread-918614-1-1.html
// @version      0.1.1
// @description  吾爱破解论坛左侧文章目录移到右边，未使用的时候收起，鼠标移到上面的时候展开，目录较长的时候可以滚动
// @author       Ganlv
// @match        https://www.52pojie.cn/*
// @icon         https://www.52pojie.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381801/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E5%B7%A6%E4%BE%A7%E6%96%87%E7%AB%A0%E7%9B%AE%E5%BD%95%E7%A7%BB%E5%88%B0%E5%8F%B3%E8%BE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/381801/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E5%B7%A6%E4%BE%A7%E6%96%87%E7%AB%A0%E7%9B%AE%E5%BD%95%E7%A7%BB%E5%88%B0%E5%8F%B3%E8%BE%B9.meta.js
// ==/UserScript==

(function () {
    'use stricit';

    function getOffset( el ) {
        var _x = 0;
        var _y = 0;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top: _y, left: _x };
    }

    // toc 对象
    function Toc(tocElement) {
        // toc 元素
        this.tocElement = tocElement;
        var matches = this.tocElement.id.match(/^markdown_toc_(\d+)$/);
        if (!matches) {
            return null;
        }
        // post 元素
        this.postId = parseInt(matches[1]);
        this.postElement = document.getElementById('postmessage_' + this.postId);
        this.tocElement.className += ' toc-side-right';
        this.tocElement.style.maxHeight = (window.innerHeight - 112) + 'px'
        // 创建 container
        this.container = document.createElement('div');
        this.container.className = 'toc-container';
        this.container.append(this.tocElement);
        this.container.style.right = '0';
        // 移动到 post 元素中
        this.postElement.prepend(this.container);
        this.scroll();
    }

    // 当 window.onscroll 触发时调用这个函数可以自动调整 toc 的位置
    Toc.prototype.scroll = function () {
        var offsetTop = getOffset(this.postElement).top;
        if (document.documentElement.scrollTop < offsetTop) {
            // 还未看过这一楼层
            this.container.style.position = 'absolute';
            this.container.style.top = offsetTop + 'px';
        } else {
            var scrollTopMax = offsetTop + this.postElement.offsetHeight - this.container.offsetHeight;
            if (document.documentElement.scrollTop > scrollTopMax) {
                // 已经看完这一楼层
                this.container.style.position = 'absolute';
                this.container.style.top = scrollTopMax + 'px';
            } else {
                // 正在看这一楼层
                this.container.style.position = 'fixed';
                this.container.style.top = '0';
            }
        }
    }

    // 添加样式
    var style = document.createElement('style');
    style.textContent = '.toc-container .toc-side.toc-side-right { width: 240px; margin: 0 -240px 0 0; padding: 20px; background-color: #f9f9f9; border: 1px solid #999; overflow-y: scroll; }'
        + '.toc-container { padding-top: 52px; padding-right: 56px; overflow: hidden; }'
        + '.toc-container:hover .toc-side.toc-side-right { margin-right: initial; }';
    document.querySelector('head').appendChild(style);

    // 获取全部 toc 元素
    var tocSideElements = document.querySelectorAll('.toc-side');
    var tocs = [];
    tocSideElements.forEach(function (el) {
        // 没有内容则不修改
        if (!el.textContent.match(/^\S*$/)) {
            tocs.push(new Toc(el));
        }
    });

    // 添加 scroll 事件
    window.addEventListener('scroll', function (e) {
        for (var i = 0; i < tocs.length; ++i) {
            tocs[i].scroll();
        }
    });
})();