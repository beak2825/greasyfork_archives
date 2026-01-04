// ==UserScript==
// @id             巴哈姆特哈啦區文章標題關鍵字封鎖
// @name           巴哈姆特哈啦區文章標題關鍵字封鎖
// @version        20180419
// @namespace      巴哈姆特哈啦區文章標題關鍵字封鎖
// @author         johnny860726
// @description    在巴哈姆特哈啦區瀏覽文章時自動忽略標題含有特定關鍵字的討論串
// @include        *forum.gamer.com.tw/B.php*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/40810/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E5%95%A6%E5%8D%80%E6%96%87%E7%AB%A0%E6%A8%99%E9%A1%8C%E9%97%9C%E9%8D%B5%E5%AD%97%E5%B0%81%E9%8E%96.user.js
// @updateURL https://update.greasyfork.org/scripts/40810/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E5%95%A6%E5%8D%80%E6%96%87%E7%AB%A0%E6%A8%99%E9%A1%8C%E9%97%9C%E9%8D%B5%E5%AD%97%E5%B0%81%E9%8E%96.meta.js
// ==/UserScript==

var keyword = ["寶拉", "polla", "安價", "KFC姊姊", "KFC姐姐", "太后姐姐", "太后姊姊"];
var elems = document.getElementsByClassName("b-list__main__title");
var i, j;

for(i=0; i<elems.length; i++){
    for(j=0; j<keyword.length; j++){
        if(elems[i].innerText.search(keyword[j]) !== -1){
            elems[i].innerText = "本討論串已無文章";
            elems[i].setAttribute("class", "b-list__main__title is-del");
            elems[i].removeAttribute("href");
            break;
        }
    }
}