// ==UserScript==
// @name         Remove Mark
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  根据【文字全匹配】或者【纯表情图】隐藏楼层
// @author       You
// @match        https://www.south-plus.net/read.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=south-plus.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454449/Remove%20Mark.user.js
// @updateURL https://update.greasyfork.org/scripts/454449/Remove%20Mark.meta.js
// ==/UserScript==

// 试过做折叠起来，点击之后展开，UI 上感觉直接隐藏比较舒服，所以屏蔽规则比较保守：
// 1. 文字规则是全匹配，怕屏蔽错了，不做模糊匹配，图片不算字。规则可以在下面一点自己添加
// 2. 表情屏蔽规则是如果楼里的表情全部是站内表情图就会隐藏；外站的不会被隐藏
(function() {
    'use strict';

    function hideMark() {
        document.querySelectorAll('.tpc_content .f14')
            .forEach((el, index) => {
            const floor = el.closest('.t5');
            if (!floor) { return; }

            const table = floor.querySelector('table')
            const innerText = el.innerText ? el.innerText.trim() : '';

            if (innerText) {
                // 这里可以自己添加文字屏蔽
                const words = ['mark', 'makr', 'mk', 'make', '马克', '马可', '马克吐温', '码住', '马', '马住', '插眼', '顶'];
                if (words.indexOf(innerText.toLocaleLowerCase()) !== -1) {
                    floor.style.display = 'none'
                }
            } else {
                const checkShouldHide = () => {
                    if (index === 0) {
                        const previous = el.previousElementSibling;
                        if (previous && previous.id && previous.id.indexOf('att_') === 0) {
                            return false;
                        }
                    }

                    let faceCount = 0;
                    const imgList = el.querySelectorAll('img');
                    if (!imgList.length) { return false; }
                    imgList.forEach(img => {
                        if (img.src && img.src.indexOf('smile/smallface') !== -1) {
                            faceCount++;
                        }
                    });

                    if (faceCount !== imgList.length) { return false; }
                    return true;
                };

                if (checkShouldHide()) {
                    floor.style.display = 'none';
                }

                return;
            }
        });
    }

    hideMark();

    const observer = new MutationObserver(function (mutationList, observer) {
        hideMark();
    });
    observer.observe(document.querySelector('#main'), { childList: true, });
})();