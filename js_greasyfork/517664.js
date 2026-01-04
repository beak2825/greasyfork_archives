// ==UserScript==
// @name         抖音网页版美化
// @namespace    https://suca.cc/
// @version      1.2.1
// @description  美化抖音网页版界面
// @author       SueCha
// @match        https://www.douyin.com/*
// @icon         https://suca.cc/images/alarm.jpg
// @license      Apache
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/517664/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/517664/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
//A
    // 定义样式内容
    const styleContent = `
@media (max-width: 5000px) {
    .byAYwK4P {
        padding-left: var(--swiper-container-padding-left) !important;
        padding-right: 0 ! important;
    }
    .byAYwK4P.XndxUXHg {
        padding-left: 0 ! important;
    }
    .jLGIrBFY{
    display:none ! important;
    }
    .rtWYegYy{
    display:none ! important;
    }
    .hrk7KiGM {
    z-index: 11;
    border: 0;
    transition: all .3s;
    position: absolute;
    top: 20%;
    right: 0;
    transform: translateY(-50%)
    }
    .dYcWlUlB {
    position: relative;
    display: none ! important;
    }
    .L76SgT5E:not(.BoqmDjnr) .IHrj7RhK .wlJhKwNH {
        width: 100%;
        background: linear-gradient(rgba(241,242,245,0),#eff0f3 5%,#eff0f3 10%);
        background: var(--navFooterWrapper--background);
        z-index: 1;
        font-family: PingFang SC,DFPKingGothicGB-Regular,sans-serif;
        font-weight: 400;
        display: none;
    }
    .midControlHigh .E89RjVdY {
    height: auto;
    bottom: 52px;
    transform: scale(1) ! important
    }
    .E7R0E__S .cG83852M {
    padding-right:10px;
    }
    .Pl5rTGP8 .byAYwK4P {
    padding: 0 14px;
    height: calc(100% - 0px) ! important;
    }
}`;

    // 插入样式
    const addStyle = (cssContent) => {
        const styleElement = document.createElement('style');
        styleElement.textContent = cssContent;
        document.head.appendChild(styleElement);
    };

    addStyle(styleContent);
})();
