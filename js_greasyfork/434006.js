// ==UserScript==
// @name         phpMyAdmin自动选择编码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  phpMyAdmin 添加字段时自动选择编码为 utf8mb4_general_ci
// @author       Zee Kim
// @include      *://*/index.php?route=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434006/phpMyAdmin%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E7%BC%96%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/434006/phpMyAdmin%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E7%BC%96%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        if(!document.querySelector("#imgpmalogo"))return;
        document.querySelectorAll("select").forEach(v=>{
            for(var i=0; i<v.options.length; i++){
                if(v.options[i].innerHTML == "utf8mb4_general_ci"){
                    v.options[i].selected = true;
                    break;
                }
            }
         });
    },1000);
})();