// ==UserScript==
// @name        HWM_Css_Modificator
// @namespace   emptimd
// @description Модификация шрифта и другого визуала
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/forum_messages\.php\?tid=\d+/
// @version     1.0.0
// @downloadURL https://update.greasyfork.org/scripts/397054/HWM_Css_Modificator.user.js
// @updateURL https://update.greasyfork.org/scripts/397054/HWM_Css_Modificator.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

(function(){ // wrapper start

//----------------------------------------------------------------------------//
// Крч. Тут можно менять значения переменных типа размер шрифта
//----------------------------------------------------------------------------//

var forumFontSize = '0.85em'; // Размер шрифта на форуме, пистаь любое css значение (15px, 1em тд)

var forumFontSelector = 'table.c_darker td, table.c_darkers td a:link, table.c_darkers td a:visited';



// Создаём стиле и добовляем наши стили на страничку
var css = forumFontSelector + ' { font-size: '+forumFontSize+'; }',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

head.appendChild(style);

style.type = 'text/css';
if (style.styleSheet){
  // This is required for IE8 and below.
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}

  
}()); // wrapper end