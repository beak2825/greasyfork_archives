// ==UserScript==
// @name           fl.ru ps_for_customer_only checked
// @namespace      http://userscripts.org/
// @description    Ставит галочку по умолчанию на чекбокс "Скрыть ответ, сделав его видимым только заказчику (автору проекта)" на странице проекта на www.fl.ru
// @include        http://www.free-lance.ru/projects/*/*.html
// @include        https://www.free-lance.ru/projects/*/*.html
// @include        http://free-lance.ru/projects/*/*.html
// @include        https://free-lance.ru/projects/*/*.html
// @include        http://www.fl.ru/projects/*/*.html
// @include        https://www.fl.ru/projects/*/*.html
// @include        http://fl.ru/projects/*/*.html
// @include        https://fl.ru/projects/*/*.html
// @include        http://old.fl.ru/projects/*/*.html
// @include        https://old.fl.ru/projects/*/*.html
// @version 0.0.1.20150113113839
// @downloadURL https://update.greasyfork.org/scripts/4825/flru%20ps_for_customer_only%20checked.user.js
// @updateURL https://update.greasyfork.org/scripts/4825/flru%20ps_for_customer_only%20checked.meta.js
// ==/UserScript==

document.getElementById("ps_for_customer_only").checked = true;
document.getElementById("ps_for_customer_only").value = 0;