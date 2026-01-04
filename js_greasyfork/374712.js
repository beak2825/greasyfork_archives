// ==UserScript==
// @name         巴哈姆特哈啦區顯示單一板務水桶名單
// @namespace    巴哈姆特哈啦區顯示單一板務水桶名單
// @author       johnny860726
// @match        *forum.gamer.com.tw/water.php*
// @run-at       document-end
// @description  可設定僅顯示特定執行者的水桶名單
// @version      20181124
// @downloadURL https://update.greasyfork.org/scripts/374712/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E5%95%A6%E5%8D%80%E9%A1%AF%E7%A4%BA%E5%96%AE%E4%B8%80%E6%9D%BF%E5%8B%99%E6%B0%B4%E6%A1%B6%E5%90%8D%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/374712/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%93%88%E5%95%A6%E5%8D%80%E9%A1%AF%E7%A4%BA%E5%96%AE%E4%B8%80%E6%9D%BF%E5%8B%99%E6%B0%B4%E6%A1%B6%E5%90%8D%E5%96%AE.meta.js
// ==/UserScript==

var bt = document.createElement('button');
bt.setAttribute('type', 'button');
bt.innerText = '只顯示自己';
bt.onclick = function() {
    const str1 = '只顯示自己';
    const str2 = '顯示全部';
    var account = Cookies.get('BAHAID').toLowerCase();
    account = account.toLowerCase();
    var elems = document.querySelectorAll('#BH-master > form > table > tbody > tr');
    for(var i=0; i<elems.length; i++){
        var tmp = elems[i].getElementsByTagName('td')[4].innerText;
        if(tmp.toLowerCase() !== account && tmp !== '執行者'){
            elems[i].style.display = (this.innerText === str1) ? 'none' : '';
        }
    }
    this.innerText = (this.innerText === str1) ? str2 : str1;
}
document.querySelector(".FM-trash").appendChild(bt);