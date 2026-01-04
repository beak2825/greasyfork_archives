// ==UserScript==
// @name         Twig 翻译文档 installation.html
// @namespace    fireloong
// @version      0.0.2
// @description  Twig 翻译文档
// @author       Itsky71
// @match        https://twig.symfony.com/doc/3.x/installation.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491434/Twig%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20installationhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/491434/Twig%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20installationhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        'Installation': '安装',
        'Install Composer and run the following command to get the latest version:': '安装 Composer 并运行以下命令获取最新版本：'
    };


    $('.section h1 a,.section p').each(function(i,v){
        if(translates.hasOwnProperty($(this).text())) {
            $(this).html(translates[$(this).text()]);
        }else{
            console.log(i,v,$(this).text());
        }
    });
})($);