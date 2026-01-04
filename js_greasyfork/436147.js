// ==UserScript==
// @name         【晋江文学城】文章收藏页面只显示连载的文章
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  此脚本控制界面隐藏行
// @author       QAQ
// @match        http://my.jjwxc.net/backend/favorite.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436147/%E3%80%90%E6%99%8B%E6%B1%9F%E6%96%87%E5%AD%A6%E5%9F%8E%E3%80%91%E6%96%87%E7%AB%A0%E6%94%B6%E8%97%8F%E9%A1%B5%E9%9D%A2%E5%8F%AA%E6%98%BE%E7%A4%BA%E8%BF%9E%E8%BD%BD%E7%9A%84%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/436147/%E3%80%90%E6%99%8B%E6%B1%9F%E6%96%87%E5%AD%A6%E5%9F%8E%E3%80%91%E6%96%87%E7%AB%A0%E6%94%B6%E8%97%8F%E9%A1%B5%E9%9D%A2%E5%8F%AA%E6%98%BE%E7%A4%BA%E8%BF%9E%E8%BD%BD%E7%9A%84%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

// 只显示连载的文章
function onlyShowSerialize(){
    var tbs = document.querySelectorAll('.favoritelisttable');
    if(!tbs){
        return;
    }
    var searchCol = 3; // 要搜索的列index
    for(var i = 0; i < tbs.length; i++){
        var tb = tbs[i];
        var rowsLength = tb.rows.length;
        for(var j = 0; j < rowsLength; j++){
            if(!tb.rows[j] || !tb.rows[j].cells[searchCol]){
                continue;
            }
            var searchText = tb.rows[j].cells[searchCol].innerText; // 取得table行，列的值
            if(searchText == '完结'){
                tb.rows[j].style.display = 'none';
            }else{
                tb.rows[j].style.display = '';
            }
        }
    }
}

// 显示所有的文章
function showAll(){
    var tbs = document.querySelectorAll('.favoritelisttable');
    if(!tbs){
        return;
    }
    for(var i = 0; i < tbs.length; i++){
        var tb = tbs[i];
        var rowsLength = tb.rows.length;
        for(var j = 0; j < rowsLength; j++){
            tb.rows[j].style.display = '';
        }
    }
}

// 添加只显示连载按钮
function addSerializeButton(){
    var button = document.createElement('button');
    button.addEventListener('click', onlyShowSerialize);
    button.textContent='只显示连载';
    button.style.cssText ="position: fixed;z-index: 999999;display: flex;top: 40%; right: 20px;";
    document.getElementsByTagName('body')[0].appendChild(button);
}

// 添加显示所有按钮
function addShowAllButton(){
    var button = document.createElement('button');
    button.addEventListener('click', onlyShowSerialize);
    button.textContent='显示所有';
    button.style.cssText ="position: fixed;z-index: 999999;display: flex;top: 45%; right: 20px;";
    document.getElementsByTagName('body')[0].appendChild(button);
}

(function() {
    addSerializeButton();
    addShowAllButton();
})();
