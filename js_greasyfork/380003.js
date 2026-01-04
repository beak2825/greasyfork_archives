// ==UserScript==
// @name         屏蔽百家号
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去掉百度搜索结果里的百家号内容
// @author       7nc
// @match        http://www.baidu.com/s*
// @match        https://www.baidu.com/s*
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/380003/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%AE%B6%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/380003/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%AE%B6%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    removeBaijiahao();

    // 点击搜索 添加过滤
    document.getElementById("su").onclick = function(e){
       // change wd input
       var input = document.getElementById('kw');
       if(input.value.indexOf('-baijiahao') == -1){
          input.value = input.value + ' -baijiahao';
       }
    };

    function removeBaijiahao(){
          // 获取搜索内容
        var searchContent = location.search;
        var searchText ;
        //console.log('searchContent = '+ searchContent);
        if (searchContent.indexOf("?") != -1) {
            var str = searchContent.substr(1); // 去掉 ?
            var strs = str.split("&");
            for(var i = 0; i < strs.length; i ++) {
                var params = strs[i].split('=');
                var key = params[0];
                if('wd' == key){
                    searchText = params[1];
                    break;
                }
            }
        }
        //console.log(searchText);
        if(searchText.indexOf('-baijiahao') == -1){
            window.location.href = window.location.href.replace(searchText, searchText+" -baijiahao ");
        }

    }





})();