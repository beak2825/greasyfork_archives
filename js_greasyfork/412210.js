// ==UserScript==
// @name         Ditch "Messenger" in VK
// @namespace    a
// @version      0.1
// @description  Some meme for meme
// @author       vk.com/vigil33t
// @match        https://vk.com/im
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412210/Ditch%20%22Messenger%22%20in%20VK.user.js
// @updateURL https://update.greasyfork.org/scripts/412210/Ditch%20%22Messenger%22%20in%20VK.meta.js
// ==/UserScript==

(function() {
    if (document.title == "Мессенджер"){
        document.title = "Сообщения";
    }
    document.getElementsByClassName("inl_bl")[5].innerText = "Сообщения";
})();