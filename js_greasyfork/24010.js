// ==UserScript==
// @name VKgrupNum
// @namespace Sanek508 
// @description Показывает нумерацию в поиске групп vk.com
// @match       https://vk.com/groups?act=catalog*
// @include 	https://vk.com*
// @author Sanek508
// @version 0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24010/VKgrupNum.user.js
// @updateURL https://update.greasyfork.org/scripts/24010/VKgrupNum.meta.js
// ==/UserScript==


   // можете добавить сюда свои сайты для подсветки
   url = ['/alpha-t','/alpha_t','/alphat','/alpha','/remontika38']; /* подсвечиваемый домен */
   var start = 0;
  
    [].forEach.call(document.getElementsByClassName("search_results"), function (e) {
     /* Перебор результатов в блоке выдачи */
     [].forEach.call(e.querySelectorAll(".groups_row"), function (d) {
       start++;
       /* Создание элемента нумерации */
       var t = document.createElement("span");
       t.setAttribute("style", "float:left;margin-left:5px;padding-top:0px;");
       t.innerHTML = start + "";
       d.insertBefore(t, d.firstChild);
       /* Перебор ссылок результата и подсветка url */
		 
       [].forEach.call(d.getElementsByClassName("labeled title"), function (f) {
		  url.forEach(function(item) {
           if (f.innerHTML.match(new RegExp(item, "i"))) {
            // alert(f.innerHTML);
             //f.setAttribute("style", "background:#c4df9b;");
			 d.setAttribute('style', 'border:1px solid #c4df9b');
             [].forEach.call(d.getElementsByClassName("flat_button"), function (g) {
					document.getElementById(g.id).focus();
             });                          
           }
		  });
       });

     });
})
