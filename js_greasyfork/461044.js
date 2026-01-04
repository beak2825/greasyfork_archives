// ==UserScript==
// @name Ekool login fixer
// @name:et Ekool login fixer
// @version 1.2
// @match https://login.ekool.eu/*
// @match https://ekool.eu/*
// @match https://www.ekool.eu/*
// @description should replace the username type with the type email so firefox recognizes it as a login field and autofills password
// @description:et Teeb ekooli login lehekülje korda ja laseb firefoxil autofillil ka kasutajanime/emaili formi sisse toppida (loodetavasti)
// @namespace https://greasyfork.org/users/1035267
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js
// @require https://code.jquery.com/jquery-3.5.1.min.js
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/461044/Ekool%20login%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/461044/Ekool%20login%20fixer.meta.js
// ==/UserScript==

//should replace the username type with the type email so firefox recognizes it as a login field and autofills password
function replaceField()
{
  document.querySelectorAll('input[type=username]')[0].type = 'email';
}
alert("BRUH");
waitForKeyElements(".v-text-field__slot",replaceField);
