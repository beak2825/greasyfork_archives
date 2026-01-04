// ==UserScript==
// @name         秘迹搜索居中
// @namespace    https://slaier.github.io/
// @version      1.0
// @author       苏莱尔, slaier
// @description  秘迹搜索搜索结果居中显示
// @icon         https://mijisou.com/themes/entropage/img/favicon.png?staticVersion=1557735741
// @include      https://mijisou.com/search?*
// @include      https://mijisou.com/?*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/389248/%E7%A7%98%E8%BF%B9%E6%90%9C%E7%B4%A2%E5%B1%85%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/389248/%E7%A7%98%E8%BF%B9%E6%90%9C%E7%B4%A2%E5%B1%85%E4%B8%AD.meta.js
// ==/UserScript==


(function(){
    document.getElementById('sidebar_results').className = "col-sm-4 col-sm-pull-12";
    document.getElementById('main_results').className = "col-sm-8 col-sm-push-3";
    let search_page = document.getElementsByClassName('search-page')[0];
    search_page.style = "padding:0;";
    search_page.className = "search-container col-sm-8 col-sm-push-3";
  
    let result_container = document.getElementsByClassName('result-container')[0];
    result_container.style = "width: unset;";
  
    let slogan2 = document.getElementsByClassName('slogan2')[0];
    slogan2.style = "margin-right: 100px;"
  
})();