// ==UserScript==
// @name         Digga's power
// @namespace    bkwar.com
// @version      1.0
// @description  автобой для bkwar
// @require	  http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js
// @include http://bkwar.com/*
// @match        https://greasyfork.org/en/scripts
// @grant         GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/24746/Digga%27s%20power.user.js
// @updateURL https://update.greasyfork.org/scripts/24746/Digga%27s%20power.meta.js
// ==/UserScript==

 var t;  // объявляем глобальную переменную, которая будет доступна
            // в любом месте при выполнении скриптов




$(document).ready(function () {  







  //чекбокс
var checkbox_one = document.createElement('input');
		checkbox_one.setAttribute('id', 'ch1');
		checkbox_one.setAttribute('name', 'checkbox_one');
		checkbox_one.setAttribute('type', 'checkbox');
		checkbox_one.style.position = "absolute";
		checkbox_one.style.left = '10px';
		checkbox_one.style.top = '10px';
  		checkbox_one.class = 'synchronize';
$("#HP1").after(checkbox_one);  




$("#checkbox_one").css({"color":"green"});
//$('img[src*="/i/dungeon/mobs/"]').click();  
//$(':contains("Напасть")').click(); 

$('input[type="checkbox"][name="autohit"]').attr("checked","checked");
$('input[type="submit"][value="Вперед !!!"]').click();  
$('input[type="submit"][value="Вернуться"]').click();  
$('input[type="button"][value="Собрать все"]').click();  


$('img[src="i/priem/hp_enrage.gif"]').click();  
$('img[src="i/priem/hp_defence.gif"]').click();  
$('img[src="i/priem/krit_bloodlust.gif"]').click();
;



$("#ch1").change(function(){ 
if($(this).attr("checked")){ 
  
  	$(document).find('img[src*="/i/dungeon/mobs/"]').click();  
	$(':contains("Напасть")').click(); 
}else{ 
  checkbox_one.setAttribute('checked', 'unchecked');
}}); 

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
 
$("#ch1").prop({
  disabled: true
});
  
	});
   
