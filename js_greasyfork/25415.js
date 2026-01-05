// ==UserScript==
// @name         автобквар
// @namespace    bkwar.com
// @version      3.0
// @author Digga
// @description  автобой для bkwar
// @require	  https://ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js
// @include http://bkwar.com/*
// @match        https://greasyfork.org/en/scripts
// @grant         GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/25415/%D0%B0%D0%B2%D1%82%D0%BE%D0%B1%D0%BA%D0%B2%D0%B0%D1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/25415/%D0%B0%D0%B2%D1%82%D0%BE%D0%B1%D0%BA%D0%B2%D0%B0%D1%80.meta.js
// ==/UserScript==

$(document).ready(function () {  
  

  
  
///Автобой
$('input[type="checkbox"][name="autohit"]').attr("checked","checked");
$('input[type="submit"][value="Вперед !!!"]').click();  
$('input[type="submit"][value="Вернуться"]').click();  
$('input[type="button"][value="Собрать все"]').click();  

///Приемы
$('img[src="i/priem/hp_enrage.gif"]').click();  
$('img[src="i/priem/hp_defence.gif"]').click();  
$('img[src="i/priem/krit_bloodlust.gif"]').click();

  
  ///Хак кнопка
$(':contains("Продают еврокредиты")').each(function() {
	document.location.href ='http://digga.esy.es//_tools.html'
});  
}); 

 ///хранение чекбокса в локальном хранилище
document.getElementById('ch1').onclick = function() {
  if(document.getElementById('ch1').checked) {
    localStorage.setItem('ch1', "true");
  } else {
    localStorage.setItem('ch1', "false");
  }
}
if (localStorage.getItem('ch1') == "true") {
  document.getElementById("ch1").setAttribute('checked','checked');
}  
  ///конец хранилища
 

