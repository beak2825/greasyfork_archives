// ==UserScript==
// @name         解决奈菲影视广告过滤界面不显示问题
// @namespace    奈菲影视
// @version      0.2
// @description  解决 奈菲影视 广告过滤界面不显示问题
// @author       SYXIXI
// @match        https://www.nfmovies.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394203/%E8%A7%A3%E5%86%B3%E5%A5%88%E8%8F%B2%E5%BD%B1%E8%A7%86%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%E7%95%8C%E9%9D%A2%E4%B8%8D%E6%98%BE%E7%A4%BA%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/394203/%E8%A7%A3%E5%86%B3%E5%A5%88%E8%8F%B2%E5%BD%B1%E8%A7%86%E5%B9%BF%E5%91%8A%E8%BF%87%E6%BB%A4%E7%95%8C%E9%9D%A2%E4%B8%8D%E6%98%BE%E7%A4%BA%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var containers = document.getElementsByClassName("container");
    for(var i = 0; i < containers.length; i++){
        containers[i].style.display = "block";
    }
})();