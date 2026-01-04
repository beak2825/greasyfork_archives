// ==UserScript==
// @name         再见了百度知道和百家号搜索结果
// @namespace    http://tampermonkey.net/
// @home-url     https://greasyfork.org/zh-CN/scripts/371691
// @description  删除百度搜索结果的百度知道和百家号结果
// @version      0.11
// @include      http://www.baidu.com/*
// @include      https://www.baidu.com/*
// @author       vessl
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/371691/%E5%86%8D%E8%A7%81%E4%BA%86%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E5%92%8C%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/371691/%E5%86%8D%E8%A7%81%E4%BA%86%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E5%92%8C%E7%99%BE%E5%AE%B6%E5%8F%B7%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==



(function() {
    'use strict';
    
     $(document).on('DOMSubtreeModified',process);

    function process() {

        var results = document.getElementById('content_left');

            if(!results) return;

            for (var i =0; i < results.children.length; i++) {
              var mu=results.children[i].attributes.mu;
              if(mu&&mu.value.indexOf("https://www.baidu.com/s?tn=news")>=0){
                  results.children[i].parentNode.removeChild(results.children[i]);
                  continue;
              }
                var links = results.children[i].getElementsByClassName('c-showurl');
                if (links && links.length > 0) {
                    var link = links[0];
                    var text = link.innerText;
                    if (text && (text.indexOf('zhidao.baidu') > -1 || text.indexOf('baijia')) > -1){
                        results.children[i].parentNode.removeChild(results.children[i]);
                    }
                }
            }

    }
})();