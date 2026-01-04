// ==UserScript==
// @name         多玩图库原图链接
// @namespace    http://tu.duowan.com/
// @version      1.0
// @description  try to take over the world!
// @author       ZMeng
// @match        http://tu.duowan.com/gallery/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38010/%E5%A4%9A%E7%8E%A9%E5%9B%BE%E5%BA%93%E5%8E%9F%E5%9B%BE%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/38010/%E5%A4%9A%E7%8E%A9%E5%9B%BE%E5%BA%93%E5%8E%9F%E5%9B%BE%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#image-show').prepend('<div id="image-title" style="text-align:center;"></div>');
    setInterval(prepend, 500);
})();
function prepend(){
    console.clear();
    var $imageShow = $('#image-show');
    var $imageTitle = $('#image-title');
    var data = $('#image-show .show-img img').map(function(){return {'src':$(this).attr('src'),'alt':$(this).attr('alt')};}).get()[0];
    var html_a = '<a href="' + data.src + '" style="font-size:18px;color:#fcfcfc;">' + data.alt + '</a>';
    $imageTitle.html(html_a);
}