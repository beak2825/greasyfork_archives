// ==UserScript==
// @name        AvaBox access
// @namespace   Violentmonkey Scripts
// @match       *://*.cdn-sp.tortugasocial.com/avataria-vk/app/index.html*
// @grant       unsafeWindow
// @run-at      document-end
// @version     1
// @author      Noop1
// @description Данный скрипт позволит играть на кастомном сервере.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/411288/AvaBox%20access.user.js
// @updateURL https://update.greasyfork.org/scripts/411288/AvaBox%20access.meta.js
// ==/UserScript==

var buttons = unsafeWindow.document.getElementById('buttonsRow');

var playAvaBox = '<td class="left">&nbsp;</td><td class="content"><a href="#playAvaBox" onclick=":onclick:"><img src="//cdn-sp.tortugasocial.com/avataria-vk/img/btns/:icon:" border="0" />&nbsp;:title:</a></td><td class="right">&nbsp;</td><td>&nbsp;</td>';

unsafeWindow.playAvaBoxButton = function() {
	unsafeWindow.location.hostname = "avabox.xyz"
}

var avaBoxButtonReplace = playAvaBox.replace(':onclick:', 'playAvaBoxButton();').replace(':icon:', 'InviteFriend.png').replace(':title:', 'Играть в AvaBox');
buttons.innerHTML += avaBoxButtonReplace;