// ==UserScript==
// @name         哔哩哔哩、知乎、爱奇艺去黑白
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description bilibili_remove_gray_func
// @author       Onion
// @match        https://www.bilibili.com/
// @match        https://www.iqiyi.com/
// @match        https://www.zhihu.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @license     MIT
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/455739/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%81%E7%9F%A5%E4%B9%8E%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E5%8E%BB%E9%BB%91%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/455739/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%81%E7%9F%A5%E4%B9%8E%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E5%8E%BB%E9%BB%91%E7%99%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setTimeout(() => {
        if (window.location.href.indexOf("www.bilibili.com") > -1) {
            window.onload = () => {
                document.querySelector("HTML").attributes.class.textContent = ""
            }
        }
        if (window.location.href.indexOf("www.iqiyi.com") > -1) {
            const addCss_aqy = `
         .gray{
         filter:grayscale(0%)
         }
         `
                // const style = document.createElement('style');
                // console.log("gray nO1!")
                // style.type = 'text/css';
                // style.innerHTML = addcss;
                // document.getElementsByTagName('body')[0].appendChild(style);
            GM_addStyle(`${addCss_aqy}`)
        }
        if (window.location.href.indexOf("www.zhihu.com") > -1) {
            const addCss_zhihu=`
            .itcauecng{
            filter: grayscale(0)!important
            }
            `
            GM_addStyle(`${addCss_zhihu}`)


        }

    }, 100)





})();