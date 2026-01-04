// ==UserScript==
// @name         LibLib图例宽屏化
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Force adjust modal width on liblib.art
// @author       云浩同学
// @match        https://www.liblib.art/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517393/LibLib%E5%9B%BE%E4%BE%8B%E5%AE%BD%E5%B1%8F%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/517393/LibLib%E5%9B%BE%E4%BE%8B%E5%AE%BD%E5%B1%8F%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';


    document.addEventListener('mouseup', function (e) {
        if (e.button === 1) {
            let target = e.target;

            while (target && target.getAttribute('role') !== 'gridcell') {
                target = target.parentElement;
            }

            if (target) {
                e.preventDefault();
                const link = target.querySelector('a');
                if (link && link.href) {
                    window.open(link.href, '_blank');
                }
            }
        }
    }, true);


    document.addEventListener('mousedown', function (e) {
        if (e.button === 1) {
            let target = e.target;

            while (target && target.getAttribute('role') !== 'gridcell') {
                target = target.parentElement;
            }

            if (target) {
                e.preventDefault();
                return false;
            }
        }
    }, true);


    function forceAdjustModalWidth() {
        // 最外层弹窗容器
        const modalSection = document.querySelector('.mantine-Paper-root.mantine-Modal-content');
        if (modalSection) {
            modalSection.style.setProperty('min-width', '90%', 'important');
            modalSection.style.setProperty('max-width', '1400px', 'important');
            modalSection.style.setProperty('margin', '0 auto', 'important');

            // 中间主容器
            const middleContainer = document.querySelector('.w-\\[820px\\].bg-background.mantine-Modal-body');
            if (middleContainer) {
                middleContainer.style.setProperty('width', '100%', 'important');
                middleContainer.classList.remove('w-[820px]');
            }

            // 左侧整体容器
            const leftMainContainer = document.querySelector('.w-80.inline-block');
            if (leftMainContainer) {
                leftMainContainer.style.setProperty('width', '50%', 'important');
                leftMainContainer.classList.remove('w-80');
            }

            // 左侧图片外层容器
            const leftImageWrapper = document.querySelector('.group.relative.overflow-hidden.w-\\[328px\\]');
            if (leftImageWrapper) {
                leftImageWrapper.style.setProperty('width', '100%', 'important');
                leftImageWrapper.classList.remove('w-[328px]');
            }

            // 图片显示容器 -选择器
            const imageContainer = document.querySelector('.flex.items-center.justify-center[style*="width: 320px"]');
            if (imageContainer) {
                const currentStyle = imageContainer.getAttribute('style');
                const newStyle = currentStyle.replace('width: 320px', 'width: 100%');
                imageContainer.setAttribute('style', newStyle);
            }


            const leftButton = document.querySelector('.flex.items-center.justify-center.absolute.z-10.top-\\[17px\\].left-\\[245px\\]');
            const rightButton = document.querySelector('.flex.items-center.justify-center.absolute.z-10.top-\\[17px\\].right-3');

            if (leftButton && rightButton) {

                rightButton.style.cssText += `
        right: 10px !important;
        left: auto !important;
        top: 17px !important;
        position: absolute !important;
    `;


                leftButton.style.cssText += `
        right: 58px !important;
        left: auto !important;
        top: 17px !important;
        position: absolute !important;
    `;
            }


            // 右侧容器
            const rightContainer = document.querySelector('.align-top.ml-\\[18px\\].inline-block.w-\\[434px\\]');
            if (rightContainer) {
                rightContainer.style.setProperty('width', '50%', 'important');
                rightContainer.style.setProperty('margin-left', '0', 'important');
                rightContainer.classList.remove('w-[434px]');
            }
        }
    }

    let timeoutId;
    const observer = new MutationObserver(() => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(forceAdjustModalWidth, 100);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    forceAdjustModalWidth();
})();
