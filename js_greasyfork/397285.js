
// ==UserScript==
// @name         simplify_sobooks
// @namespace    http://tampermonkey.net/
// @version      0.8.9
// @description  自动下载电子书
// @author       wang long biao
// @include      *://590m.com/*
// @include      *://72k.us/*
// @include      *://sobooks.cc/books/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397285/simplify_sobooks.user.js
// @updateURL https://update.greasyfork.org/scripts/397285/simplify_sobooks.meta.js
// ==/UserScript==				
	
(function() {
    if($('a:contains(城通网盘)').length > 0){
    	location.href = $('a:contains(城通网盘)').attr('href').split('url=')[1];
    }

    setTimeout(() => {
        if($('a:contains(azw3)').length > 0){
            location.href = location.origin + $('a:contains(azw3)').attr('href');
        }
    },2000)

    setTimeout(() => {
        if(file_down){
            file_down( 0, 0);
            setTimeout(() => {
                top.close();
            }, 2000)
        }
    },2000)

})();