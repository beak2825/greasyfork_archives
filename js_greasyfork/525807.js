// ==UserScript==
// @name         Better Iwara
// @namespace    none
// @version      0.2
// @description  An alternate style for Iwara, made by XLXZ
// @author       XLXZ
// @license      CC BY-NC
// @match        https://*.iwara.tv/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/525807/Better%20Iwara.user.js
// @updateURL https://update.greasyfork.org/scripts/525807/Better%20Iwara.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const count = 4
    const paddingBetween = 1.2;
    let width = (100 - (count) * paddingBetween) / count;


    let css = `
    .container, .container-fluid{
        max-width: 83% !important;
    }
    .col-lg-2,.page-videoList__item{
        flex: 0 0 ${width}% !important;
        max-width: ${width}% !important;
        background-color: var(--body) !important;
        border: 1px solid rgba(0, 0, 0, 0.2);
        box-shadow: 3px 3px 5px 0px rgba(0, 0, 0, 0.2);
        border-radius: 20px;
        padding: 0px !important;
        overflow: hidden;
        margin-right: ${paddingBetween/2}% !important;
        margin-left: ${paddingBetween/2}% !important;

        .block{
             box-shadow: none !important;
             background-color:inherit !important;
        }
    }
    #app > div.page.page-home:first-child > section.content:nth-child(4) > div.container-fluid > div.row.justify-content-center:first-child{
        display: none;
    }
    .text {
        font-size: 1.35rem !important;
    }
    .text--tiny {
        font-size: 0.8rem !important;
        line-height: 1.05rem !important;
    }
    .text--small {
        font-size: 1rem !important;
        line-height: 1.15rem !important;
    }
    .videoTeaser__content {
        padding: 0px 10px 48px 10px !important;
    }
    .videoTeaser__bottom {
        position: absolute;
        bottom: 10px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 100px;
        padding: 20px 15px 20px 5px;
        background-color: var(--body-alt);
        box-shadow: inset 2px 2px 3px 0px rgba(0, 0, 0, 0.2);
    }
`;

    let style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
    //debug
    console.log('Better Iwara loaded');
})();