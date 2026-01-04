// ==UserScript==
// @name         Twitter Image Switch With Drag
// @name:ja      Twitter Image Switch With Drag
// @name:zh-CN   Twitter 拖曳切换图像
// @name:zh-TW   Twitter 拖曳切換圖片
// @description         Switch between previous and next images by dragging the mouse, click on the image to close it.
// @description:ja      マウスをドラッグして前後の画像を切り替え、画像をクリックして閉じます。
// @description:zh-cn   使用鼠标拖曳来切换上一张或下一张图像, 点击图像即可关闭图像
// @description:zh-tw   使用滑鼠拖曳來切換上一張或下一張圖片, 點擊圖片即可關閉圖片
// @namespace    none
// @version      0.1.9
// @author       ShanksSU
// @match        https://x.com/*
// @match        https://mobile.x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @compatible   Chrome
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492542/Twitter%20Image%20Switch%20With%20Drag.user.js
// @updateURL https://update.greasyfork.org/scripts/492542/Twitter%20Image%20Switch%20With%20Drag.meta.js
// ==/UserScript==
function ImageSwitchWithDrag() {
    function clickBtn(name) {
        const btn = document.querySelector(`div[aria-labelledby="modal-header"] button[aria-label*="${name}"]`);
        if (btn) {
            btn.click();
            return true;
        }
        return false;
    }

    GM_addStyle('img { -webkit-user-drag: none; }');

    window.addEventListener('wheel', function({ deltaY, target: { tagName, baseURI } }) {
        if (tagName == 'IMG' && /\/photo\//.test(baseURI)) {
            if (deltaY < 0) clickBtn('Previous slide');
            else if (deltaY > 0) clickBtn('Next slide');
        }
    });

    let initialXCoordinate = 0;
    let clickCount = 0;
    const doubleClickThreshold = 300;
    window.addEventListener('mousedown', function({ clientX }) {
        initialXCoordinate = clientX;
    });

    window.addEventListener(
        'mouseup',
        function({ button, clientX, target: { tagName, baseURI }, timeStamp }) {
            if (button !== 0 || !(tagName == 'IMG' && /\/photo\//.test(baseURI))) return;
            const distanceMovedX = clientX - initialXCoordinate;
            clickCount++;
            setTimeout(() => {
                if (clickCount === 1) {
                    if (Math.abs(distanceMovedX) === 0) {
                        if (baseURI === window.location.href) {
                            clickBtn('Close');
                        }
                    } else if (distanceMovedX > 0) {
                        clickBtn('Previous slide');
                    } else if (distanceMovedX < 0) {
                        clickBtn('Next slide');
                    }
                } else if (clickCount === 2) {
                    clickBtn('Likes. Like');
                }
                clickCount = 0;
            }, doubleClickThreshold);
        }
    );

}
ImageSwitchWithDrag();