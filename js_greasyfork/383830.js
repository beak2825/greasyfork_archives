// ==UserScript==
// @name         Klavogonki chat media-enabler
// @namespace    natribu.org
// @version      0.1
// @description  Allows to view and send audio and images to kalogonki chat
// @author       z0-govnokoder
// @match        http://klavogonki.ru/gamelist/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383830/Klavogonki%20chat%20media-enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/383830/Klavogonki%20chat%20media-enabler.meta.js
// ==/UserScript==

(function() {
    // govnocoded by z0
    var chatContent = document.getElementsByClassName("messages-content")[0];
    var chatMessages = chatContent.getElementsByTagName("div")[0];
    var msgs = chatMessages.getElementsByTagName("p");
    String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

    function makeChatBetter(){
            for (let index = 0; index < msgs.length; index++) {
        var item = msgs[index];
        var msg = item.innerText.split(">")[1].replace(new RegExp("\\r?\\n", "g"), "");

        if (msg.substring(0,3) == "IMG"){
            var imgData = msg.split(",");
            var imgPath = imgData[1];
            item.innerHTML = item.innerHTML.replaceAll("IMG,"+imgPath,"<img src=\""+imgPath+"\" width=auto height=200>");
        }
        if (msg.substring(0,5) == "AUDIO"){
            var auData = msg.split(",");
            var auPath = auData[1];
            item.innerHTML = item.innerHTML.replaceAll("IMG,"+imgPath,"<img src=\""+imgPath+"\" width=auto height=200>");

        }
        }
    }

 setInterval(makeChatBetter, 20);
    })();