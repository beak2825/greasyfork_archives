// ==UserScript==
// @name        AvaWorld access
// @namespace   Violentmonkey Scripts
// @match       *://*.cdn-sp.tortugasocial.com/avataria-vk/app/index.html*
// @grant       unsafeWindow
// @run-at      document-end
// @version     1
// @author      Noop1
// @description Данный скрипт позволит играть на кастомном сервере.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/411283/AvaWorld%20access.user.js
// @updateURL https://update.greasyfork.org/scripts/411283/AvaWorld%20access.meta.js
// ==/UserScript==

var buttons = unsafeWindow.document.getElementById('buttonsRow'); // Buttons list

var avazoomplay = '<td class="left">&nbsp;</td><td class="content"><a href="#playavazoom" onclick=":onclick:"><img src="//cdn-sp.tortugasocial.com/avataria-vk/img/btns/:icon:" border="0" />&nbsp;:title:</a></td><td class="right">&nbsp;</td><td>&nbsp;</td>';

unsafeWindow.playAvaWorldButton = function() {
	unsafeWindow.location.hostname = "one.avaworld.site" // Redirect to avazoom server
}

var avazoomplayy = avazoomplay.replace(':onclick:', 'playAvaWorldButton();').replace(':icon:', 'InviteFriend.png').replace(':title:', 'Играть в AvaWorld');
buttons.innerHTML += avazoomplayy;