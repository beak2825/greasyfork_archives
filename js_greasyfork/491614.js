// ==UserScript==
// @name        百度网盘-群文件搜索结果-路径显示
// @namespace   Violentmonkey Scripts
// @match       https://pan.baidu.com/disk/main*
// @grant       none
// @version     1.2
// @author      luluyu
// @description 2024/4/3 20:21:08
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491614/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98-%E7%BE%A4%E6%96%87%E4%BB%B6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C-%E8%B7%AF%E5%BE%84%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/491614/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98-%E7%BE%A4%E6%96%87%E4%BB%B6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C-%E8%B7%AF%E5%BE%84%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var originalOpen = XMLHttpRequest.prototype.open;
    function updateTitles(responseData) {
        let elements = document.querySelectorAll('.im-pan-list__file-name-title-text.text-ellip.list-name-text.cursor-p');
        let elementIndex = 0; 
         if (elements.length > 0) {
            elements.forEach(function(element) {
                if (elementIndex < responseData.result.length) {
                    let result = responseData.result[elementIndex];
                        let str = decodeURIComponent(result.path)
                        element.title = str.slice(str.indexOf('/', 1) + 1);;
                        elementIndex++;
                }
            });
        }
    }
    XMLHttpRequest.prototype.open = function(method, url) {
        originalOpen.apply(this, arguments);
        this.addEventListener('load', function() {
            if (this.readyState === 4) {
                if (this.status >= 200 && this.status < 300) {
                       let responseData = this.response;
                   if (responseData.result && responseData.result.length > 0) {
                       updateTitles(responseData);
                   }
                }
            }
        });
    };
})();


