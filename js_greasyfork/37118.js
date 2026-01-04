// ==UserScript==
// @name        大风堂动漫新番封面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include        http*://www.acwind.net/icdb/year/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37118/%E5%A4%A7%E9%A3%8E%E5%A0%82%E5%8A%A8%E6%BC%AB%E6%96%B0%E7%95%AA%E5%B0%81%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/37118/%E5%A4%A7%E9%A3%8E%E5%A0%82%E5%8A%A8%E6%BC%AB%E6%96%B0%E7%95%AA%E5%B0%81%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    $(function(){
        $('head').append(
`<style>
.dzl_img_cover{
max-width:100%;
max-height: 200px;
}
</style>`);

        $('a[href*="/icdb/"]').each(function(){
            var href = $(this).attr('href');
            var arr = href.split('/');
            var id = arr[2];

            if(id > 0){
                console.log(id);
                $(this).after(`<br><img src="https://icdb-images.acwind.net/icdb/pics/${id}.jpg" class="dzl_img_cover"/>`);
            }
        });
    });
})();