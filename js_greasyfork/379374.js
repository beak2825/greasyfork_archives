// ==UserScript==
// @name         监瘾get
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  3DM
// @author       You
// @match        https://www.douyu.com/directory/myFollow
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/379374/%E7%9B%91%E7%98%BEget.user.js
// @updateURL https://update.greasyfork.org/scripts/379374/%E7%9B%91%E7%98%BEget.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function GMaddStyle(cssText){
        let a = document.createElement('style');
        a.textContent = cssText;
        let doc = document.head || document.documentElement;
        doc.appendChild(a);
    }
    GMaddStyle(`
.get3dm{
	animation-name: breath;
	animation-duration: 1s;
	animation-timing-function: ease-in-out;
	animation-iteration-count: infinite;
}

@-webkit-keyframes breath {
	from {
        border: 5px #700 solid;
	}
	50%  {
        border: 1px #2d2e36 solid;
	}
	to   {
        border: 5px #700 solid;
	}
}
    `);
    window.onscroll= function(){
        //console.log('ccdd');
        $('.DyLiveCover-wrap').each(function(){
            if($(this).attr('href')=='/610588'){
                $(this).addClass('get3dm');
            }
        });
        $('.DyLiveRecord').each(function(){
            if($(this).attr('href')=='/610588'){
                $(this).addClass('get3dm');
            }
        });
    };
})();