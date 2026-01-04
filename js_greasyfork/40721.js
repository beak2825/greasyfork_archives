// ==UserScript==
// @name         跳转到javlibrary片子演员页面
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        *://www.javlibrary.com/cn/?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40721/%E8%B7%B3%E8%BD%AC%E5%88%B0javlibrary%E7%89%87%E5%AD%90%E6%BC%94%E5%91%98%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/40721/%E8%B7%B3%E8%BD%AC%E5%88%B0javlibrary%E7%89%87%E5%AD%90%E6%BC%94%E5%91%98%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var videocast = document.querySelector( '#video_cast .icn_favstar' );
    var parent = document.createElement( 'div' );
    var link = document.createElement( 'a' );
    link.text = '点击这里查看更多';
    link.style.cursor = 'pointer';
    //link.setAttribute( 'data-href', 'vl_star.php?s=' + videocast.getAttribute('id').replace('star_','') );
    link.addEventListener('click',function(){
        window.location.href = 'vl_star.php?s=' + videocast.getAttribute('id').replace('star_','');
    });
    parent.appendChild(link);
    document.getElementById( 'video_cast' ).after(parent);
})();