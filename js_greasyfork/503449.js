// ==UserScript==  
// @name         91porny 高清跳转HD to Normal View Redirect  
// @namespace    http://tampermonkey.net/  
// @version      0.1  
// @description  Redirect from HD view to normal view on 91porny.com  
// @author       Your Name  
// @match        https://91porny.com/*  
// @license      MIT  
// @grant        none  
// @downloadURL https://update.greasyfork.org/scripts/503449/91porny%20%E9%AB%98%E6%B8%85%E8%B7%B3%E8%BD%ACHD%20to%20Normal%20View%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/503449/91porny%20%E9%AB%98%E6%B8%85%E8%B7%B3%E8%BD%ACHD%20to%20Normal%20View%20Redirect.meta.js
// ==/UserScript==    
  
(function() {  
    'use strict';  
  
    // 检查当前URL是否包含'viewhd'  
    if (window.location.href.includes('viewhd')) {  
        // 替换URL中的'viewhd'为'view'  
        var newUrl = window.location.href.replace('viewhd', 'view');  
          
        // 跳转到新的URL  
        window.location.href = newUrl;  
    }  
})();