// ==UserScript==
// @name GOLOS VIK
// @namespace golos.io 
// @description Скрипт для golos.io меняющий оформление и добавляющий новые функции
// @description:ru Скрипт для golos.io меняющий оформление и добавляющий новые функции
// @grant none
// @version 1.06
// @include https://golos.io/*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/26833/GOLOS%20VIK.user.js
// @updateURL https://update.greasyfork.org/scripts/26833/GOLOS%20VIK.meta.js
// ==/UserScript==

/* 
Скрипт для golos.io меняющий оформление и добавляющий новые функции
Автор скрипта https://golos.io/@vik
Скрипт меняет внешний вид ленты постов и добавляет выпадающий блок ответов на все страницы. 
*/

// Прописываем CSS и HTML
var inlinecss = "<style>body{background:url(https://pp.vk.me/c837131/v837131970/2834c/lWcExPA9pfA.jpg) fixed #ededf9}.VotesAndComments{background:#fff;padding:0 25px;border-radius:10px;position:absolute;top:45px;right:0}.PostSummary__body.entry-content{white-space:normal;margin-bottom:20px}span.Author{color:#fff;background:#3adb76;padding:2px 5px;border-radius:2px}.PostSummary__footer{position:relative}ul.Topics li{float:left;background:#fff;padding:0 5px;margin:3px;border-radius:3px}.PostSummary__content{padding:15px}.PostSummary{clear:none;padding:0;width:100%;max-width:600px;margin:0 auto 60px;box-shadow:0 5px 10px -5px rgba(0,0,0,.76);transition:.3s all ease}.PostSummary:hover{box-shadow:0 8px 15px -5px rgba(0,0,0,.8)}img.PostSummary__image{float:none;display:block;width:100%;height:auto;max-width:100%}.PostSummary.with-image .PostSummary__content,.PostSummary.with-image .PostSummary__reblogged_by{margin-left:10px}li.Topics__title{display:block;float:none!important;background:0 0!important}.PostsIndex__topics small{display:block;float:right;margin-top:30px}.Voting__button-up{transition:1s all ease;border-radius:25px;z-index:7}.PostSummary:hover .Voting__button-up{transform:scale(2)}.PostsIndex__topics.column.shrink.show-for-large{position:fixed;right:-60px;top:100px;height:600px;height:80vh;overflow:auto}#answerupdate{cursor:pointer;text-align:center;background:#3adb76;color:#fff}.answerholder{display:none;position:fixed;background:#fff;width:300px;height:600px;height:95vh;font-size:9pt;top:48px;left:0;z-index:77;overflow:hidden}.answerholder .VotesAndComments,.answerholder span.Voting{display:none}.answerholder .PostSummary{margin:0;padding:0;border-bottom:1px solid #efefef}.PostSummary__time_author_category a .Author{color:#fff}.answerholder .PostSummary__body.entry-content{margin-bottom:0}.answerholder .PostSummary__content{padding:5px}.answerholder span.Author{background:0 0;padding:0;color:#000}.answerholder .PostSummary__time_author_category a{color:inherit}.answertarget{padding:25px 0 0;overflow-x:hidden;overflow-y:auto;height:600px;height:90vh}#showanswer{cursor:pointer;position:fixed;top:98px;left:0;background:#266db6;font-size:16px;box-shadow:0 0 3px #000;z-index:78;color:#fff;padding:0 10px;border-radius:0 10px 10px 0}span.vcard>strong{font-size:8pt;word-wrap:break-word}.PostSummary__time_author_category{border:none}#slidetopics { position: fixed; right: -2px; top: 200px; padding: 5px; background: #3adb76; color: white; cursor: pointer; font-weight: 700; border-radius: 5px; z-index: 5; }.go-top { position: fixed; bottom: 2em; left: 2em; text-decoration: none; color: white; background-color: rgba(0, 0, 0, 0.3); font-size: 16px; padding: 1em; display: none; } .go-top:hover { background-color: rgba(0, 0, 0, 0.6); }.ReplyEditor__body,.PostFull { background: white; }.PostFull{padding: 15px;}</style>";
var somehtml = '<div class="answerholder"><h3 id="answerupdate">Обновить ответы</h3><div class="answertarget">Загрузка...</div></div><div id="showanswer">Ответы</div><a href="#0" class="go-top">Вверх</a>';

$(inlinecss).appendTo( "head" ); // Устанавливаем CSS стили
$(somehtml).appendTo( "body" );  // Вставляем необходимые html элементы


// Меняем в постах маленькие фото на большие: 256x128 > 640x480 
var tinyimg = new RegExp('/256x128/'),  // Берем ссылки на маленькие превью
    bigimg = new RegExp('640x480');     // Меняем в ссылка значение разрешения фотографии, обращаясь к проксификатору по ссылке https://imgp.golos.io/640x480/
    function imgtoggle(){
        $('img.PostSummary__image').each(function(){
         var image = $(this);
         image.attr('src', image.attr('src').replace(tinyimg, bigimg)); // Тут происходит ранее описанная замена 256x128 на 640x480
        });
      }  
imgtoggle(); 

// Когда инфинитискролл подгрузил новые посты, снова запускаем замену 256x128 на 640x480
$(document).on('DOMNodeInserted', function(e) { 
    imgtoggle();
});

// Получаем параметры, который пользователь может добавить в конец своей ссылки на аватар.  Синтаксис //domain.tld/img.jpg?css=[css стили] 
// Так же получаем юзернэйм для которого нужно показывать блок ответов
function waitfor(){ // Внутри функции будем ждать полной загрузки страницы и проверять когда появятся необходимые нам ссылки
  
  var Upic = $('.Userpic'); 
  var userpicUrl = $('.Userpic img').attr('src'); // Проверяем ссылку на аватар
  var usernameUrl = Upic.parent().attr('href'); // Проеверяем ссылку на юзернэйм. Нам нужно получить из нее ник текущего пользователя, что бы ответы в виджет загружались именно для вас. 
// Если ссылки уже доступны, выдираем только нужные нам параметры:  
// Фильтруем и получаем параметры, который пользователь добавил в своем аккаунте в конец ссылки на аватар  например //вк.ком/рукалицо.jpg?css=[#content{background:black;}] сделает фон контента черным
      function getParameterByName(name, url) {
          if (!url) {
            url = userpicUrl;
          }
          name = name.replace(/[\[\]]/g, "\\$&");
          var regex = new RegExp("[?&]" + name + "(=([^&]*)|&||$)"),
              results = regex.exec(url);
          if (!results) return null;
          if (!results[2]) return '';
          return decodeURIComponent(results[2].replace(/\+/g, " "));
      }
// Функция с помощью который мы загрузим ответы в будущем.
      function answerupdate(){
       $('.answertarget').load(usernameUrl + '/recent-replies/ #posts_list'); 
      }

if (Upic.length){ 

        
  
  console.log(userpicUrl);
  console.log(usernameUrl);
  
      // Даем возможность обновлять ответы нажатием кнопки "Обновить ответы"
      $('#answerupdate').on('click', function(){ 
        answerupdate(); 
      });

      // Даем возможность открывать/закрывать блок ответов
      var isActive = true;
      $('#showanswer').on( 'click', function() {
        if ( isActive ) {
          answerupdate();
          $('.answerholder').slideDown(); 
       } else {
         $('.answerholder').slideUp();
        }
         isActive = !isActive;
        imgtoggle(); // на всякий случай еще раз меняем превьюшки на большие
      });



      // Получаем то, что после ?css= и перед &  
      
      
  	// Убираем квадратные скобки по бокам из переменной
        var cleaning = getParameterByName('css');
        var stringcss = cleaning.substring(1, cleaning.length - 1);
     
    // Оборачиваем в теги стиля      
        var cleanCSS = $('<style></style>').append(stringcss);
  
  // Подключаем наш кастом стиль. На данный момент он применяется только после полной загрузки страницы, но в следующей версии скрипта я это исправлю.
     
  		cleanCSS.appendTo( "head" );

    //C остальными пармаетрами проще. Можно получить параметр после каждого & в формате //вк.ком/рукалицо.jpg?option1=ON&option2=OFF&option3=BIG
        var option1 = getParameterByName('opt1');  
        var option2 = getParameterByName('opt2');
  		var option3 = getParameterByName('opt3');
   // Пока опции есть как пример и демо функционала, осталось придумать какие опции могуть быть нужны. Например фиксировать ли кнопки редактора или нет. Или отключить большинсво ненужных элементов. 
   
  // В качестве примера отключим топики - метки в сайдбаре 
  		 var notopics = getParameterByName('topics');
  console.log(notopics);  console.log(cleanCSS);
         if (notopics == 'OFF') { 
         $('.PostsIndex__topics').slideUp(); // Топики улетают
         // Добавляем кнопку, по нажатию которой топики выпадут вниз
         $('<div id="slidetopics">Топики</div>').appendTo( "body" );
          
      $('#slidetopics').on( 'click', function() {
        if ( isActive ) {
         
          $('.PostsIndex__topics').slideDown(); 
       } else {
         $('.PostsIndex__topics').slideUp();
        }
         isActive = !isActive;
       });
           
    }
  // Для отключения топиков вставьте в ссылку аватара параметр &notopics=OFF 
  // В следующей версии скина будет больше параметров и настроек  

} 
// Так как мы все еще внутри условия "Если аватарка уже загрузилась" , то если она не загрузилась - мы будем рекурсивно проверять и ждать ее каждую секунду   
    else { 
     setTimeout(waitfor, 1000);
    }
  } 
waitfor();

// Добавляем кнопку-стрелку возвращения в начало страницы
$(document).ready(function() {
			// Show or hide the sticky footer button
			$(window).scroll(function() {
				if ($(this).scrollTop() > 200) {
					$('.go-top').fadeIn(200);
				} else {
					$('.go-top').fadeOut(200);
				}
			});
			
			// Animate the scroll to top
			$('.go-top').click(function(event) {
				event.preventDefault();
				
				$('html, body').animate({scrollTop: 0}, 300);
			})
		});


// Сообщение в консоли браузера.
console.log('Вы установили userscript от golos.io/@vik и сейчас вы смотрите консоль :) ВНИМАНИЕ! Перед установкой этого или похожего скрипта убедитесь, что вы нашли его в надежном источнике! Если вы не уверены, что скрипт оригинальный - обратитесь к опытным пользователям и попросите проверить его на предмет внедрения вредного кода. Вы можете обратиться ко мне в голосе golos.io/@vik/ ');