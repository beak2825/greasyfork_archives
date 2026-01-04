// ==UserScript==
// @name			Screenshot Redirect
// @version			2021.03.30
// @description		Перенаправление на картинку
// @include			http*://screenshot.ru/*
// @exclude			http*://screenshot.ru/*.png
// @icon			https://www.google.com/s2/favicons?domain=screenshot.ru
// @author			Rainbow-Spike
// @namespace       https://greasyfork.org/users/7568
// @homepage        https://greasyfork.org/ru/users/7568-dr-yukon
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/405924/Screenshot%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/405924/Screenshot%20Redirect.meta.js
// ==/UserScript==

window.location.href = document.querySelector ( "#gyazo_img" ).src

/*
for picture source searching by bookmarklet throught Google, Yandex etc.
in Firefox go to about:config address
browser.urlbar.trimURLs
set to false
*/
