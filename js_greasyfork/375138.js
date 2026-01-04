// ==UserScript==
// @name Space Kings: Search fields
// @namespace https://greasyfork.org/ru/users/229054-rovor
// @description Space Kings: Автоматически собирает поля обломков
// @version 1.0
// @creator Rovor
// @include http://*uni1.spacekings.ru/galaxy.php*
// @downloadURL https://update.greasyfork.org/scripts/375138/Space%20Kings%3A%20Search%20fields.user.js
// @updateURL https://update.greasyfork.org/scripts/375138/Space%20Kings%3A%20Search%20fields.meta.js
// ==/UserScript==

(function() {
if (!!$("[style*='background-color']")[0]) {
var $send = $("[style*='background-color: #']")[0].children[0].attributes[1].value;
eval($send.substr($send.indexOf("doit"),$send.indexOf("' >")-$send.indexOf("doit")))
}
if ($("[name~='system']")[0].value != 499 || $("[name~='galaxy']")[0].value != 9) {
    if ($("[name~='system']")[0].value != 499){
galaxy_submit('systemRight');
    }
    else {
$("[name~='system']")[0].value = 1;
galaxy_submit('galaxyRight');
    }}
})();