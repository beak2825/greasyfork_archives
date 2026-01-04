// ==UserScript==
// @name         禅道 产品 过滤
// @namespace    http://tampermonkey.net/
// @description  只显示某个产品线的产品
// @version      0.1
// @author       tindoc
// @license      MIT
// @match        http://*/zentao/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436724/%E7%A6%85%E9%81%93%20%E4%BA%A7%E5%93%81%20%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/436724/%E7%A6%85%E9%81%93%20%E4%BA%A7%E5%93%81%20%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const prodLineName = '特定的产品线名字'; // 只会显示该产品线的产品
    const firstLevelNavTab = ['产品', '测试']; // 需要做过滤的一级标签

    // 点击下拉框才会加载所有菜单项
    document.querySelector('#currentItem').click();
    document.querySelector('#currentItem').click();

    let fun = () => {
        const menuList = document.querySelectorAll('#defaultMenu li');
        menuList.forEach(
            function(currentValue, currentIndex, listObj) {
                const aElem = currentValue.querySelector('a');

                if (aElem && aElem.text.indexOf(`${prodLineName}/`) === -1) {
                    currentValue.style.display = 'none';
                }
            }
        )
    }

    const currentFirstLevelNavTabName = document.querySelector('#mainmenu > ul .active a').innerText
    if (firstLevelNavTab.includes(currentFirstLevelNavTabName)) {
        sleep(fun, 500); // 无定时可能取不到所有目录
    }
})();

function sleep(fun,time){
    setTimeout(
        ()=>{ fun(); },
        time
    );
}