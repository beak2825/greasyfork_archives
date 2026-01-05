// ==UserScript==
// @name        HWM_Return_From_Rent
// @namespace   Рианти
// @description Удобный возврат себе артов из аренды (без перезагрузки страницы)
// @include     http://www.heroeswm.ru/arts_arenda.php*
// @version     1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/12738/HWM_Return_From_Rent.user.js
// @updateURL https://update.greasyfork.org/scripts/12738/HWM_Return_From_Rent.meta.js
// ==/UserScript==

var links = document.querySelectorAll('a[href*="arts_arenda.php?art_return="]');

for (var i = 0; i < links.length; i++){
  links[i].onclick = function(e){
    try{
    console.log(e);
    e.preventDefault();
    e.target.innerHTML = 'Забираем';
    sendRequest(e.target.href, function(){
      e.target.innerHTML = 'Забрано';
    });
    } catch (e) {
      console.log(e);
    }
  }
}

function sendRequest(target, onloadFunc){
  GM_xmlhttpRequest({
    overrideMimeType: 'text/plain; charset=windows-1251',
    synchronous: false,
    url: target,
    method: "GET",
    onload: onloadFunc
  });
}