// ==UserScript==
// @name         显示磁力链接(磁力熊)
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  磁力熊-显示磁力链接
// @author       🍬oKaShi
// @match        https://www.cilixiong.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cilixiong.com
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456328/%E6%98%BE%E7%A4%BA%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%28%E7%A3%81%E5%8A%9B%E7%86%8A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456328/%E6%98%BE%E7%A4%BA%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%28%E7%A3%81%E5%8A%9B%E7%86%8A%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var result= "<ol style='display:table;margin:auto'>";
    $('body > div.container').html().match(/magnet[^"]+/gm).forEach(i=>{result=result+'<li>'+i+'</li>'});
    result=result+"</ol>";
    $('body > div.container > div.row.col-md-12.text-white.p-5').before('<div style="color:yellow;">'+result+'</div>');
})();