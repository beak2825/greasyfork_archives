// ==UserScript==
// @name         隐藏转推和ad (Twitter hide retweet)
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  隐藏主页时间线上转发的推文和ad
// @author       reimu
// @match        https://twitter.com/home
// @match        https://twitter.com
// @icon         https://abs.twimg.com/favicons/twitter.2.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465279/%E9%9A%90%E8%97%8F%E8%BD%AC%E6%8E%A8%E5%92%8Cad%20%28Twitter%20hide%20retweet%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465279/%E9%9A%90%E8%97%8F%E8%BD%AC%E6%8E%A8%E5%92%8Cad%20%28Twitter%20hide%20retweet%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // retweet, ad
    GM_addStyle(`
        div[data-testid=cellInnerDiv]
        :has(path[d="M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z"]
            ,path[d="M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z"]
            )
        {
            display:none
        },

    `);
    let div=document.createElement('div');
    div.setAttribute("style",`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.9);
        z-index: 9999;
        display:none;
    `);
    let img=document.createElement('img');
    img.setAttribute("style",`
        max-height: 100%;
        max-width: 100%;
        margin: auto;
    `);
    div.append(img);

    document.body.append(div);
    document.body.addEventListener('click',e=>{
        let target=e.target;
        if(target==div||target==img){
            div.style.display='none';
            e.stopPropagation();
            e.preventDefault();
        }else if(target.tagName==='IMG'&&target.src.indexOf('?format=')>-1&&location.pathname=='/home'&&target.closest('article')){
            let src=target.src;
            src=src.split('&name=')[0]+ '&name=large';
            e.stopPropagation();
            e.preventDefault();
            img.src=src;
            div.style.display='flex';
        }
    },true);
})();