// ==UserScript==
// @name         无图模式
// @namespace
// @include      *
// @exclude      *://greasyfork.org/*
// @version      0.3.0
// @description  简单的网页无图模式
// @author       ymzhao
// @namespace 
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/420235/%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/420235/%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
GM_addStyle(`
    img {
        display: none;
        opacity: 0;
        visibility: hidden;
        z-index: -1;
    }
    div {background-image:none}
`);
;(function() {
    'use strict';

    // hookImg();
    // function hookImg() {
    //     const property = Object.getOwnPropertyDescriptor(Image.prototype, 'src');
    //     const nativeSet = property.set;
    
    //     function customiseSrcSet(url) {
    //         // do something
    //         console.log('23333333333', url)
    //         nativeSet.call(this, 'abc');
    //     }
    //     Object.defineProperty(Image.prototype, 'src', {
    //         set: customiseSrcSet,
    //     });
    // }
})();