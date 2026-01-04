// ==UserScript==
// @name         arxiv comment
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show paper comments on the pdf preview page.
// @author       You
// @match        https://arxiv.org/pdf/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.com
// @grant        unsafeWindow
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458398/arxiv%20comment.user.js
// @updateURL https://update.greasyfork.org/scripts/458398/arxiv%20comment.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var xx = '';
    $.get(window.location.href.replace('/pdf', '/abs'), function(data){
        xx = $('.comments', data).last().text().replace('Title:', '');
        console.log(xx);
        if (xx !== undefined && xx !== ''){
            $("body").append(`<div style='left: 50px;top: 10px;background: #1a59b7;color:#ffffff;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 300px;height: 22px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'>${xx}</div>`);
        }
    });
})();