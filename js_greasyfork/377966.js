// ==UserScript==
// @name         巴哈姆特之勇造介面固定每頁筆數40
// @description  都9102年了怎麼還會有人想用每頁8筆？
// @namespace    nathan60107
// @version      1.3
// @author       nathan60107(貝果)
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=nathan60107
// @include      https://avatar1.gamer.com.tw/shop.php*
// @include      https://avatar1.gamer.com.tw/wardrobe.php*
// @include      https://avatar1.gamer.com.tw/store_shop.php*
// @include      https://avatar1.gamer.com.tw/search.php*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/377966/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E5%8B%87%E9%80%A0%E4%BB%8B%E9%9D%A2%E5%9B%BA%E5%AE%9A%E6%AF%8F%E9%A0%81%E7%AD%86%E6%95%B840.user.js
// @updateURL https://update.greasyfork.org/scripts/377966/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E4%B9%8B%E5%8B%87%E9%80%A0%E4%BB%8B%E9%9D%A2%E5%9B%BA%E5%AE%9A%E6%AF%8F%E9%A0%81%E7%AD%86%E6%95%B840.meta.js
// ==/UserScript==

function change(){
    if(document.getElementsByClassName("AR-array")[0]==undefined){
        setTimeout(function(){change();}, 2000);
    }else{
        var AR = document.getElementsByClassName("AR-array");
        if(location.toString().match(`https://avatar1.gamer.com.tw/shop.php.*`) ||
           location.toString().match(`https://avatar1.gamer.com.tw/store_shop.php*`)){
            AR[0].children[4].children[0].onclick();
        }else if(location.toString().match(`https://avatar1.gamer.com.tw/wardrobe.php.*`)){
            AR[0].children[3].onclick();
        }else if(location.toString().match(`https://avatar1.gamer.com.tw/search.php.*`)){
            AR[0].children[4].onclick();
        }
    }
}

(function() {
    'use strict';
    change();
})();