// ==UserScript==
// @name         半月谈听课倍速播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  半月谈听课倍速播放，最高支持4倍速!
// @author       Jersey
// @email        yu_lele@qq.com
// @include      /^http(s?)://*.bytapp.com/**$/
// @match        *://*.bytapp.com/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458886/%E5%8D%8A%E6%9C%88%E8%B0%88%E5%90%AC%E8%AF%BE%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/458886/%E5%8D%8A%E6%9C%88%E8%B0%88%E5%90%AC%E8%AF%BE%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
	$(document).ready(function () {
		$('#app div.flex-align-center').prepend('<button class="2nd" type="button">2倍速</button> &nbsp;&nbsp;&nbsp;');
        $('#app div.flex-align-center').prepend('<button class="3rd" type="button">3倍速</button> &nbsp;&nbsp;&nbsp;');
        $('#app div.flex-align-center').prepend('<button class="4th" type="button">4倍速</button> &nbsp;&nbsp;&nbsp;');
        $('button.2nd').click(function(e){
              console.log('2倍速');
              document.querySelector('video').playbackRate = 2.0;
		})
        $('button.3rd').click(function(e){
              console.log('3倍速');
              document.querySelector('video').playbackRate = 3.0;
		})
        $('button.4th').click(function(e){
              console.log('4倍速');
              document.querySelector('video').playbackRate = 4.0;
		})
	})

})();