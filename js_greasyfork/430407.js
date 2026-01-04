// ==UserScript==
// @name         LSP
// @namespace    WenkeChen/HRMS
// @version      0.22
// @description  Hello, LSP!
// @author       WenkeChen
// @match        https://i.mdpi.cn/*
// @match        http://blog.mdpi.lab/team/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @resource     ViewerCSS https://cdn.bootcdn.net/ajax/libs/viewerjs/1.10.0/viewer.min.css
// @require      https://cdn.bootcdn.net/ajax/libs/viewerjs/1.10.0/viewer.min.js
// @icon         https://i.mdpi.cn/build/img/favicon.ico
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/430407/LSP.user.js
// @updateURL https://update.greasyfork.org/scripts/430407/LSP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const viewer_css = GM_getResourceText("ViewerCSS");
    GM_addStyle(viewer_css);

    // Your code here...
    $('img').each(function(i, t) {
        let src = $(t).attr('src');
        if (src.indexOf('/public_files/avatars') >= 0) {
            let width = $(t).width();
            let height = $(t).height();
            let newSrc = src.replaceAll(/(medium|small|large)/g, 'original');
            $(t).attr('src', newSrc);
            $(t).attr('width', width);
            $(t).attr('height', height);
        }
    });
    new Viewer($('body')[0], {
        filter(image) {
            return image.src.indexOf('/public_files/avatars') > 0 && image.src.indexOf('original') > 0;
        },
    });

    $('img').on('click', function(e) {
        let img = e.currentTarget;
        let src = $(img).attr('src');
        if (src.indexOf('/public_files/avatars') >= 0) {
            e.preventDefault();
        }
    });
})();