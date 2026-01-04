// ==UserScript==
// @name         Go Sci-hub Back
// @name:zh-CN   Go Sci-hub Back
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Go back to origin page from sci-hub opened link
// @description:zh-CN  从scihub打开的文献页面返回原页面
// @author       winding
// @include      *://sci-hub.*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.5.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/407023/Go%20Sci-hub%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/407023/Go%20Sci-hub%20Back.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const r = new RegExp(/https?:\/\/sci-hub.[^/]*\//g);
    let link = window.location.href;
    $('body').append(`<a style="
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    background: #b22222;
    text-align: center;
    font-size: 18px;
    padding: 8px;
    color: #fff;
" href="${link.replace(r, '')}">Back</a>`);
})();
