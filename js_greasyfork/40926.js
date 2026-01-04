// ==UserScript==
// @name         Pudge Helper 
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://vk.com/im?invite_chat_id=8589934592022897066&invite_hash=sTe1JAl5G2dfsQ==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40926/Pudge%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/40926/Pudge%20Helper.meta.js
// ==/UserScript==

(function() {
  	var obj = document.getElementsByClassName('im_editable im-chat-input--text _im_text');
    	obj.item(0).innerHTML = 'Богдан лох';
        document.querySelector(".im-send-btn_audio").click();
})();