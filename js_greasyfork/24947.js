// ==UserScript==
// @name         Алхофарм
// @namespace    bkwar.com
// @version      1.0
// @author Digga
// @description  фармстраниц для bkwar
// @require	  https://ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js
// @include http://bkwar.com/*
// @match        https://greasyfork.org/en/scripts
// @grant         GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/24947/%D0%90%D0%BB%D1%85%D0%BE%D1%84%D0%B0%D1%80%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/24947/%D0%90%D0%BB%D1%85%D0%BE%D1%84%D0%B0%D1%80%D0%BC.meta.js
// ==/UserScript==

$(document).ready(function () {  


  
$('img[src*="/i/dungeon/mobs/"]').click();  
$(':contains("Напасть")').click(); 

$('input[type="checkbox"][name="autohit"]').attr("checked","checked");
$('input[type="submit"][value="Вперед !!!"]').click();  
$('input[type="submit"][value="Вернуться"]').click();  
$('input[type="button"][value="Собрать все"]').click();  
//	$(':contains("Искать")').click(); 

$('img[src="i/priem/hp_enrage.gif"]').click();  
$('img[src="i/priem/hp_defence.gif"]').click();  
$('img[src="i/priem/krit_bloodlust.gif"]').click();


  //вход
   $(':contains("Вход в Пещеру Алхимика")').each(function() {
   		$('input[type="submit"][value="Создать группу"]').click();  
		$('input[type="submit"][value="Начать"]').click();   
      });    
    $('img[src*="/i/dungeon/objects/602.gif?1"]').click();   // телепорт
  
  //33-18   перемещение на 2-й
 $("*[style*='position:absolute;left:33px;top:18px']").each (function () {
  		$('img[src*="/i/dungeon/13.gif"]').each(function() {
  			$('img[src*="/i/dungeon/forward.gif"]').click();  
 			//$('img[src*="/i/dungeon/turnright.gif"]').click();  
      });   
      });  
  $("*[style*='position:absolute;left:33px;top:33px']").each (function () {
  		$('img[src*="/i/dungeon/13.gif"]').each(function() {
  			//$('img[src*="/i/dungeon/forward.gif"]').click();  
 			$('img[src*="/i/dungeon/turnright.gif"]').click();  
      });   
      });  
   
  
  // переместились
   $(':contains("Перемещение прошло успешно")').each(function() {
   		$('img[src*="/i/dungeon/10.gif"]').each(function() {
 			$('img[src*="/i/dungeon/turnright.gif"]').click();  
                         });  
      });  

  
  
  $("*[style*='position:absolute;left:33px;top:33px']").each (function () {
  		$('img[src*="/i/dungeon/11.gif"]').each(function() {
 			$('img[src*="/i/dungeon/turnright.gif"]').click();  
      });   
      });  
  
  
    $("*[style*='position:absolute;left:33px;top:33px']").each (function () {
  		$('img[src*="/i/dungeon/12.gif"]').each(function() {
 			$('img[src*="/i/dungeon/forward.gif"]').click();  
      });   
      });  
  
  
   $(':contains("Вы нашли")').each(function() {
   			$('img[src*="/i/dungeon/ref.gif"]').click();  
      });    
  
  
    $(':contains("Комната с Камином")').each(function() {
			//$('img[src*="/i/dungeon/ref.gif"]').click();  /i/dungeon/left.gif
   			$('img[src*="/i/dungeon/left.gif"]').click();
    });    
  
    $('.lsw0').each(function() {
			$('img[src*="/i/dungeon/forward.gif"]').click(); 
    });  
  
  

  $(':contains("Пещера Алхимика")').each(function() {
       $("*[style*='position:absolute;left:63px;top:33px']").each (function () {
			$('img[src*="/i/dungeon/forward.gif"]').click(); 
  }); 
    });
   $(':contains("Пещера Алхимика")').each(function() {
       $("*[style*='position:absolute;left:63px;top:18px']").each (function () {
			$('img[src*="/i/dungeon/forward.gif"]').click(); 
  }); 
    });
  
  $('img[src*="/i/dungeon/10.gif"]').each(function() {
    $('img[src*="/i/dungeon/forward.gif"]').click();
    });    
    
   $("*[style*='left: 0px;']").each (function () { 
      $('img[src*="/i/dungeon/forward.gif"]').click();
  		  
      });    
    
   $("*[style*='position:absolute;left:63px;top:33px']").each (function () {
  		$('img[src*="/i/dungeon/12.gif"]').each(function() {
 			$('img[src*="/i/dungeon/left.gif"]').click();  
      });   
      });    
  
  
   $("*[style*='position:absolute;left:63px;top:18px']").each (function () {
  		$('img[src*="/i/dungeon/12.gif"]').each(function() {
      $('img[src*="/i/dungeon/forward.gif"]').click();
      });   
      });    
  
  $('img[src="http://bkwar.com//i/empty.gif"]').each(function() {
 			$('img[src*="/i/dungeon/turnright.gif"]').click();  
                         }); 
  
  
      $('img[src*="/i/dungeon/objects/501.gif?1"]').click();   // сундук
        $('img[src*="/i/dungeon/objects/500.gif"]').click();   // сундук

  
  
$(':contains("В этот сундук уже кто-то заглядывал")').each(function() {
		document.location.href ='http://bkwar.com/cave.php?exit=1'
});  
 
 
 
setTimeout(function(){
$('img[src*="/i/dungeon/ref.gif"]').click(); 
}, 4000);

 ////////////////////////////////////////////////////// конец автобота
  
$(':contains("подземелье через")').each(function() {
		//document.location.href ='http://bkwar.com/main.php?edit=1&razdel=1'
        		document.location.href ='http://digga.esy.es//_tools.html'

});  
  $(':contains("ID")').each(function() {

    $('input:radio[name=item]')[29].checked = true;
    $('input[type="submit"][value="Создать"]').click(); 
   document.location.href ='http://bkwar.com/main.php?edit=1&razdel=1'
});  
 
$("a[onclick*='Пропуск Забытых']").click();   
$('input[type="button"][value="Да"]').click();  

$(':contains("использовал заклятие "Пропуск Забытых"")').each(function() {
		document.location.href ='http://bkwar.com/main.php'
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
 




  



	
   

