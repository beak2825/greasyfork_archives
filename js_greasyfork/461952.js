

    // ==UserScript==
    // @name         作业系统优化助手
    // @namespace    http://zy.pmcn.net/index.php
    // @version      0.3
    // @description  -- 略
    // @author       tuite
    // @match        http://zy.pmcn.net/index.php**
    // @grant        none
    // @license      none
// @downloadURL https://update.greasyfork.org/scripts/461952/%E4%BD%9C%E4%B8%9A%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/461952/%E4%BD%9C%E4%B8%9A%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8B.meta.js
    // ==/UserScript==
    (function () {
        'use strict';
        var cs = `@font-face {
            font-family: 'ddt';
            src: url("https://raw.iqiq.io/luzihao1234/mytestfont/main/test/dd.ttf");
            font-weight: normal;
        }
        @font-face {
            font-family: 'sot';
            src: url("https://raw.iqiq.io/luzihao1234/mytestfont/main/test/so.ttf");
            font-weight: normal;
        }
        p, span, td, h4, th, label {
            font-family: sot !important;
            font-size: 1.2em
        }`;
        let e = document.createElement('style');
        e.innerHTML = cs;
        document.body.append(e)
    })();
     

