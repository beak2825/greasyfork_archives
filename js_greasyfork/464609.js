// ==UserScript==
// @name         YouTuBu click text link open new tab
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.3
// @description  try to take over the world!
// @author       xiaofeiwu
// @match        https://www.youtube.com/
// @run-at       document-end
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464609/YouTuBu%20click%20text%20link%20open%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/464609/YouTuBu%20click%20text%20link%20open%20new%20tab.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(() => {
        // document.body.addEventListener('click', (event) => {
        //     event.stopPropagation();
        //     event.preventDefault(); 
        // })
        const textHrefList = document.querySelectorAll('#video-title-link')
        for (let i = 0; i < textHrefList.length; i++) {
            textHrefList[i].style.backgroundColor = 'skyblue'
        }
        const links = document.querySelectorAll('a[href*="/watch?v="]');
        for (let i = 0; i < links.length; i++) {
            links[i].addEventListener('click', (event) => {
                event.stopPropagation(); // 阻止事件冒泡
                event.preventDefault(); // 阻止链接的跳转行为
                window.open(links[i].href, '_blank'); // 在新标签页中打开链接
            });
        }
    }, 3000)
})();

// GM_addStyle(`
//   #video-title-link {
//       backgroundColor: 'skyBlue'
//   }
// `)