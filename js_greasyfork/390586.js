// ==UserScript==
// @name        Chrome 字体渲染增强
// @namespace   none
// @description Chrome Font Rendering Enhancer
// @version     0.1.1
// @include     *
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/390586/Chrome%20%E5%AD%97%E4%BD%93%E6%B8%B2%E6%9F%93%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/390586/Chrome%20%E5%AD%97%E4%BD%93%E6%B8%B2%E6%9F%93%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var element = document.createElement('style');
    element.innerHTML += '* {text-shadow: transparent 0px 0px 0px, rgba(0,0,0,1) 0px 0px 0px, rgba(0,0,0,1) 0px 0px 0px !important;}';
    document.documentElement.appendChild(element);
}) ();
