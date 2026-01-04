// ==UserScript==
// @name         查看历史wiki页面
// @namespace    http://tampermonkey.net/
// @version      2024-01-13
// @description  查看历史wiki页面，避免查看popo页面
// @author       You
// @match        http://doc.hz.netease.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netease.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488650/%E6%9F%A5%E7%9C%8B%E5%8E%86%E5%8F%B2wiki%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/488650/%E6%9F%A5%E7%9C%8B%E5%8E%86%E5%8F%B2wiki%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';




    function appenLink(){
     var links = document.getElementsByTagName('a');
        for (var i = 0; i < links.length; i++) {
            var href = links[i].getAttribute('href');
            if (href && !href.includes('&move_to_popo=false') && !href.includes('?move_to_popo=false')) {
                if (href.includes('?')) {
                    links[i].setAttribute('href', href + '&move_to_popo=false');
                } else {
                    links[i].setAttribute('href', href + '?move_to_popo=false');
                }
            }
        }
    }


   function main(){
       // 添加点击事件处理程序到document对象
       document.addEventListener('click', function(event) {
           appenLink();
       });

   }

 main();




})();