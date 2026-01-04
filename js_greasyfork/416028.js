// ==UserScript==
// @name         还原哔哩哔哩直播间原版粉丝勋章牌子
// @namespace    https://853lab.com/
// @version      0.2
// @description  如题
// @author       853
// @match        https://live.bilibili.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/416028/%E8%BF%98%E5%8E%9F%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E5%8E%9F%E7%89%88%E7%B2%89%E4%B8%9D%E5%8B%8B%E7%AB%A0%E7%89%8C%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/416028/%E8%BF%98%E5%8E%9F%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E5%8E%9F%E7%89%88%E7%B2%89%E4%B8%9D%E5%8B%8B%E7%AB%A0%E7%89%8C%E5%AD%90.meta.js
// ==/UserScript==
// 
// 律师函收到之日，即是我死期到来之时。
// 学写代码学到现在也不过是一枚棋子，随用随弃。
// ：）
// 
(function() {
    'use strict';

    GM_addStyle(`
.fans-medal-label[style^="background-image: -o-linear-gradient(45deg, #5c968e"],.fans-medal-label[style^="background-image: linear-gradient(45deg, rgb(92, 150, 142"]{
    background-image: linear-gradient(45deg, #5cc05c, #5cc05c)!important;
}
.fans-medal-item[style^="border-color: #5c968e"],.fans-medal-item[style^="border-color: rgb(92, 150, 142"]{
    border-color: #5cc05c!important;
}
.fans-medal-level[style^="color: #5c968e"],.fans-medal-level[style^="color: rgb(92, 150, 142"]{
    color: #5cc05c!important;
}
.fans-medal-label[style^="background-image: -o-linear-gradient(45deg, #5d7b9e"],.fans-medal-label[style^="background-image: linear-gradient(45deg, rgb(93, 123, 158"]{
    background-image: linear-gradient(45deg, #5896de, #5896de)!important;
}
.fans-medal-item[style^="border-color: #5d7b9e"],.fans-medal-item[style^="border-color: rgb(93, 123, 158"]{
    border-color: #5896de!important;
}
.fans-medal-level[style^="color: #5d7b9e"],.fans-medal-level[style^="color: rgb(93, 123, 158"]{
    color: #5896de!important;
}
.fans-medal-label[style^="background-image: -o-linear-gradient(45deg, #8d7ca6"],.fans-medal-label[style^="background-image: linear-gradient(45deg, rgb(141, 124, 166"]{
    background-image: linear-gradient(45deg, #a068f1, #a068f1)!important;
}
.fans-medal-item[style^="border-color: #8d7ca6"],.fans-medal-item[style^="border-color: rgb(141, 124, 166"]{
    border-color: #a068f1!important;
}
.fans-medal-level[style^="color: #8d7ca6"],.fans-medal-level[style^="color: rgb(141, 124, 166"]{
    color: #a068f1!important;
}
.fans-medal-label[style^="background-image: -o-linear-gradient(45deg, #be6686"],.fans-medal-label[style^="background-image: linear-gradient(45deg, rgb(190, 102, 134"]{
    background-image: linear-gradient(45deg, #ff86b2, #ff86b2)!important;
}
.fans-medal-item[style^="border-color: #be6686"],.fans-medal-item[style^="border-color: rgb(190, 102, 134"]{
    border-color: #ff86b2!important;
}
.fans-medal-level[style^="color: #be6686"],.fans-medal-level[style^="color: rgb(190, 102, 134"]{
    color: #ff86b2!important;
}
.fans-medal-label[style^="background-image: -o-linear-gradient(45deg, #c79d24"],.fans-medal-label[style^="background-image: linear-gradient(45deg, rgb(199, 157, 36"]{
    background-image: linear-gradient(45deg, #f6be18, #f6be18)!important;
}
.fans-medal-item[style^="border-color: #c79d24"],.fans-medal-item[style^="border-color: rgb(199, 157, 36"]{
    border-color: #f6be18!important;
}
.fans-medal-level[style^="color: #c79d24"],.fans-medal-level[style^="color: rgb(199, 157, 36"]{
    color: #f6be18!important;
}
`);
})();