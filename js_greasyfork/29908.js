// ==UserScript==
// @name         Duolingo Enable Japanese
// @namespace    https://github.com/InacioNeto/DuolingoEnableJapanese/
// @version      0.1
// @description  Enables Japanese on Duolingo.
// @author       You
// @match        https://www.duolingo.com/
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/29908/Duolingo%20Enable%20Japanese.user.js
// @updateURL https://update.greasyfork.org/scripts/29908/Duolingo%20Enable%20Japanese.meta.js
// ==/UserScript==

$("li[data-value='eo']").attr('data-value', 'ja');
$("span[data-value='eo']").attr('data-value', 'ja');
$("span[data-value='ja']").text('Japanese');
$('span[class="flag flag-svg-micro flag-eo"]').attr("class", "flag flag-svg-micro flag-ja");
