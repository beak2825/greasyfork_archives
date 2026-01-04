// ==UserScript==
// @name        Remove Hideout.co Captcha
// @name:pt-BR  Hideout.co removedor de Captcha
// @namespace   Edited by Potato, Made by /u/harmonictimecube
// @description Title says everything
// @description:pt-br O título diz tudo
// @include     https://hideout.co/watchInactive.php*
// @run-at      document-start
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/395357/Remove%20Hideoutco%20Captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/395357/Remove%20Hideoutco%20Captcha.meta.js
// ==/UserScript==

var url = window.location.href;
var new_url = url.replace("Inactive", "");

window.location.replace(new_url);