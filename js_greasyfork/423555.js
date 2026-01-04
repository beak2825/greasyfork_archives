// ==UserScript==
// @name         测试脚本
// @namespace
// @include      *
// @version      0.1.4
// @description  测试专用脚本
// @author       ymzhao
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/703945
// @downloadURL https://update.greasyfork.org/scripts/423555/%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/423555/%E6%B5%8B%E8%AF%95%E8%84%9A%E6%9C%AC.meta.js
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