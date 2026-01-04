// ==UserScript==
// @name         l10
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  try to take over the world!
// @author       You
// @include      http*://hg*.live*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407537/l10.user.js
// @updateURL https://update.greasyfork.org/scripts/407537/l10.meta.js
// ==/UserScript==
window.stop();

(function() {
    'use strict';

window.stop();














   var loadStyle = function(url) {
			var link = document.createElement('link');
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = url;
			var head = document.getElementsByTagName("head")[0];
			head.appendChild(link);
		};

		// css加载





    function loadJS( url, callback ){

    var script = document.createElement('script'),

        fn = callback || function(){};

    script.type = 'text/javascript';



    script.src = url;

    document.getElementsByTagName('head')[0].appendChild(script);

}



//用法
    setTimeout(()=>{
window.webpackJsonp = []
const prefix = document.cookie.includes('md=1') ? 'http://localhost:3000' : 'https://cdn.jsdelivr.net/gh/cjz9032/speeder@latest/public/rubbish'
 	loadStyle(prefix + '/all.css')
  	loadJS(prefix + '/all.js')
    }, 0)






})();














