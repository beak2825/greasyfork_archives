// ==UserScript==
// @name         177pic绅士画廊
// @namespace    https://greasyfork.org/users/439775
// @version      0.7.1
// @description  177pic绅士画廊看图优化，支持触屏与键盘操作
// @author       EricSong
// @match        https://www.177pic.info/html/*
// @include      https://www.177pic.pw/html/*
// @include      https://*.177pica.com/html/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     viewerCss https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.5.0/viewer.min.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.5.0/viewer.min.js
// @downloadURL https://update.greasyfork.org/scripts/395874/177pic%E7%BB%85%E5%A3%AB%E7%94%BB%E5%BB%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/395874/177pic%E7%BB%85%E5%A3%AB%E7%94%BB%E5%BB%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // styles
    GM_addStyle(GM_getResourceText("viewerCss"));
    GM_addStyle(`
.viewer-toolbar>ul>li+li { margin-left: 15px}
@media screen and (max-width: 900px) {
#sidebar {
display: block;
}
}
`);

    function enterFull() {
        const elem = document.querySelector('.viewer-container');
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
        window.isFull = true;
    }

    function exitFull() {
        if (!window.isFull) return;

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }
        window.isFull = false;
    }

    function isLandscape() {
        return window.innerWidth >= window.innerHeight;
    }

    function getImg() {
        return document.querySelector('.viewer-canvas>img');
    }

    // 下一页链接地址
    // 若在最后一页将返回null
    function nextPageHref() {
        const nextPageLink = document.querySelector('.page-links>span').nextElementSibling;
        if (nextPageLink.children.length === 0) return null;
        return nextPageLink.href;
    }

    // 重置backdrop样式
    function resetBackdropStyle() {
        document.querySelector('.viewer-container').classList.add('viewer-backdrop');

    }

    // 自动加载全部
    function autoLazyLoad() {
        document.querySelectorAll('.single-content img').
        forEach(img => img.src = img.getAttribute('data-lazy-src'));
    }

    // viewer
    const config = {
        url: 'data-lazy-src',
        toolbar: {
            prev: {
                show: true,
                size: 'large'
            },
            next: {
                show: true,
                size: 'large',
                click: () => {
                    const totalItems = window.viewer.items.length;
                    if (totalItems === 0) return;
                    const last = window.viewer.items[totalItems - 1];
                    if (!last.classList.contains('viewer-active')) {
                        // 正常下一张图
                        window.viewer.next();
                    } else {
                        // 处于当前页最后一张图，自动下一页
                        const link = nextPageHref();
                        if (!link) {
                            alert('没有了');
                            return
                        } else {
                            window.location.href = link;
                            return
                        }
                    }
                }
            },
            flipVertical: {
                show: true,
                size: 'large',
                click: () => window.isFull ? exitFull() : enterFull()
            },
        },
        backdrop: false, // 禁止backdrop点击
        title: false,
        zIndex: 10000,
        navbar: false,
        loop: false,
        toggleOnDblclick: false,
        hidden: exitFull,
        zoomed: e => window.zoomedRatio = e.detail.ratio,
        viewed: function () {
            // 重置backdrop样式
            resetBackdropStyle();

            // 自动加载全部
            autoLazyLoad();

            // 缩放图片至全屏宽
            const scaleToScreenWidth = () => {
                const img = getImg();
                if (img.naturalWidth > window.innerWidth) {
                    const ratio = window.innerWidth / img.naturalWidth;
                    if (ratio < 1) {
                        this.viewer.zoomTo(window.innerWidth / img.naturalWidth);
                        this.viewer.moveTo(0, img.offsetTop);
                        this.viewer.move(0, img.height * ratio * -0.2)
                    }
                }
            }

            // 缩放图片至全屏高
            const scaleToScreenHeight = () => {
                const img = getImg();
                if (img.naturalHeight > window.innerHeight) {
                    const ratio = window.innerHeight / img.naturalHeight;
                    if (ratio < 1) {
                        this.viewer.zoomTo(ratio);
                        this.viewer.moveTo(img.offsetLeft, 0);
                        this.viewer.move(img.width * ratio * -0.2 ,0)
                    }
                }
            }

            // 横图横屏 || 竖图横屏
            // 缩放图片至全屏高
            if (isLandscape()) {
                scaleToScreenHeight();
                return;
            }

            // 竖屏
            // 缩放图片至全屏宽
            if (!isLandscape()) {
                scaleToScreenWidth();
                return;
            }
        }
    };

    window.viewer = new Viewer(document.querySelector('.single-content'), config);

})();
