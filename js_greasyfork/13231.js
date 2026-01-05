//
// ==UserScript==
// @name           hwm_res_count_init
// @author         Pahan https://greasyfork.org/uk/users/18377-pahan
// @namespace      hwm_pahan
// @description    Заполняет все поля для сдачи ресурсов на производстве   
// @homepage       https://greasyfork.org/en/users/18377-pahan
// @icon           http://dcdn.heroeswm.ru/avatars/30/nc-5/30547.gif
// @version        1.0
// @encoding 	   utf-8
// @include        http://www.heroeswm.ru/object-info.php*
// @downloadURL https://update.greasyfork.org/scripts/13231/hwm_res_count_init.user.js
// @updateURL https://update.greasyfork.org/scripts/13231/hwm_res_count_init.meta.js
// ==/UserScript==


var LElements = document.getElementsByName('count');
//alert(LElements.length);
for (var i = 0; i < LElements.length; i++)
{
  var LElement = LElements[i];
//  alert(LElement.type);
  if (LElement.type == 'text')
    LElement.value = 99;
}
