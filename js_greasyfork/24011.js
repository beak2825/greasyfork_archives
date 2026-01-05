// ==UserScript== 
// @name        YandexNumeration
// @namespace   yandsearch 
// @match       http://*/yandsearch?* 
// @match       https://*/yandsearch?* 
// @match       https://yandex.ru/search/*
// @match       https://yandex.*/search/*
// @include 	*yandex*
// @description Нумерация поиска в yandex без удаления рекламы
// @author      Sanek508
// @version     4.3
// @downloadURL https://update.greasyfork.org/scripts/24011/YandexNumeration.user.js
// @updateURL https://update.greasyfork.org/scripts/24011/YandexNumeration.meta.js
// ==/UserScript==    

 var pp = 10,
   p = 1,
   // можете добавить сюда свои сайты для подсветки
   url = ['alpha-t.org','alpha-t.ru','agp24.ru','agrp24.ru','ypb24.ru','remontika-24.ru','remontika38.ru','alpha-irk.ru','sanek508.net']; /* подсвечиваемый домен */
/* корректировка количества результатов на странице */
 var nd = decodeURIComponent(document.cookie).match(new RegExp("nd:([^#.:]*)"));
 if (nd) {
   nd = parseInt(nd[1].trim());
   if (typeof nd === "number" && isFinite(nd)) pp = nd
 }
/* Определение текущей страницы */
 //var b = document.getElementsByClassName("serp-list_left_yes");
 var b = document.getElementsByClassName("pager__item_current_yes");
 if (b.length > 0) {
   b = parseInt((document.all ? b[0].innerText : b[0].textContent).trim());
   if (typeof b === "number" && isFinite(b)) p = b
 }
 var start = (p - 1) * pp;
/* Перебор блоков выдачи */
 [].forEach.call(document.getElementsByClassName("serp-item"), function (e) {
   /* Подсветка контекстной рекламы и её исключение из нумерации */
   if (e.querySelectorAll(".serp-adv__title-text,.serp-item__title_multiline_yes,.label_color_yellow").length > 0) {
     e.setAttribute("style", "background:#ffe5e5");
	 //e.style.display='none';
   } else if (e.querySelectorAll(".z-companies,.z-companies__title,.z-video__head-title,.z-video__title,.z-images__head,.z-images__title,.z-news__title").length > 0) {
   } else {
     /* Перебор результатов в блоке выдачи */
     [].forEach.call(e.querySelectorAll(".serp-item__title,.organic__title-wrapper"), function (d) {
       start++;
       /* Создание элемента нумерации */
       var t = document.createElement("span");
       if (start < 10) { t.setAttribute("style", "float:left;margin-left:-19px;padding-top:20px;"); }
       else { t.setAttribute("style", "float:left;margin-left:-28px;padding-top:20px;"); }
       t.innerHTML = start + ".";
       d.insertBefore(t, d.firstChild);
       /* Перебор ссылок результата и подсветка url */
		 
       [].forEach.call(d.getElementsByClassName("link"), function (f) {
         if (f.hasAttribute("href")) {
		  url.forEach(function(item) {
           if (f.getAttribute("href").match(new RegExp(item, "i"))) {
             //f.setAttribute("style", "background:#c4df9b;");
			 e.setAttribute('style', 'border:1px solid #c4df9b');
           }
		  });
         }
       });
     });
   }
})