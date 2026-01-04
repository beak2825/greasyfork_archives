// ==UserScript==
// @name         Auto delete history like
// @namespace   https://github.com/dxhuii/delWeibo
// @version      0.3
// @description  批量删赞
// @author       plain
// @match        https://weibo.com/like/outbox*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399621/Auto%20delete%20history%20like.user.js
// @updateURL https://update.greasyfork.org/scripts/399621/Auto%20delete%20history%20like.meta.js
// ==/UserScript==

jQuery.noConflict();
(function($) {
    'use strict';
     for(var i=0;i<100;i++){
         setTimeout(function(){
             $('a[action-type="fl_like"]')[0].click();
             //$('a[title="删除此条微博"]')[0].click();
             //$('a[action-type="ok"]')[0].click();
         },1000*i);
     }
})(jQuery);