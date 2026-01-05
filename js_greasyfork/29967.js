// ==UserScript==
// @name         Skype Web Mention
// @namespace    http://web.skype.com/
// @version      0.1
// @description  display list of member in skype group chat, so you can easily mention them by select
// @author       Tuan.Tran
// @match        http://web.skype.com*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/29967/Skype%20Web%20Mention.user.js
// @updateURL https://update.greasyfork.org/scripts/29967/Skype%20Web%20Mention.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$("chatInputAreaWithQuotes").prop("placeholder").val("Test");