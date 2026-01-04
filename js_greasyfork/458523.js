// ==UserScript==
// @name         浏览器桌面小可爱
// @namespace    http://tampermonkey.net/
// @icon         https://img-blog.csdnimg.cn/20181221195058594.gif
// @version      0.1
// @description  浏览器桌面小可爱，在浏览器桌面增加一只小可爱，算是娱乐吧
// @author       wll
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458523/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%A1%8C%E9%9D%A2%E5%B0%8F%E5%8F%AF%E7%88%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/458523/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%A1%8C%E9%9D%A2%E5%B0%8F%E5%8F%AF%E7%88%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init(){
        //let imgs = <img alt="" src="http://www.gxjss.cn/zb_users/plugin/cangying/1.gif" style="width:80px;height:80px;position:fixed;left:200px;top:200px;z-index:100;">;
        let imgs=document.createElement("img");
        imgs.src='http://www.gxjss.cn/zb_users/plugin/cangying/1.gif';
        imgs.style='width:80px;height:80px;position:fixed;left:200px;top:200px;z-index:100;';
        document.body.appendChild(imgs);
    }

    init();

})();