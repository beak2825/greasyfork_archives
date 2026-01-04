// ==UserScript==
// @name        保存下载  高教书苑 等 网站加密电子书的小工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @match       *://ebook.hep.com.cn/*
// @description  保存  高教书苑 等 网站加密电子书的小工具
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510565/%E4%BF%9D%E5%AD%98%E4%B8%8B%E8%BD%BD%20%20%E9%AB%98%E6%95%99%E4%B9%A6%E8%8B%91%20%E7%AD%89%20%E7%BD%91%E7%AB%99%E5%8A%A0%E5%AF%86%E7%94%B5%E5%AD%90%E4%B9%A6%E7%9A%84%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/510565/%E4%BF%9D%E5%AD%98%E4%B8%8B%E8%BD%BD%20%20%E9%AB%98%E6%95%99%E4%B9%A6%E8%8B%91%20%E7%AD%89%20%E7%BD%91%E7%AB%99%E5%8A%A0%E5%AF%86%E7%94%B5%E5%AD%90%E4%B9%A6%E7%9A%84%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    
    const originalCreateObjectURL = URL.createObjectURL;

    
    URL.createObjectURL = function(blob) {
        const objectURL = originalCreateObjectURL(blob);

      
        const timestamp = Date.now();
        const filename = `blob-content-${timestamp}.webp`;  //

        
        const link = document.createElement('a');
        link.href = objectURL;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log(`Blob URL detected: ${objectURL}, file saved as ${filename}`);

        return objectURL;
    };})();