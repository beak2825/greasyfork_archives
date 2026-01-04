// ==UserScript==
// @name         System Notifications
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Restore classic System Notifications
// @author       NCloud
// @match        https://gamefaqs.gamespot.com/boards*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475910/System%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/475910/System%20Notifications.meta.js
// ==/UserScript==
if ($('.g_forum #ndrop').length > 0) {
$('.board').before('<p style="text-align: center; background-color: #ff0; padding: 1px;">You have one or more unread <a href="https://gamefaqs.gamespot.com/user/notifications">System Notifications</a>. Please read them at your earliest convenience.</p>')
}