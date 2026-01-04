// ==UserScript==
// @name         Show spammers
// @version      1.6
// @description  Show CB spammers
// @author       A Meaty Alt
// @include      /email\.deadfrontier\.com/
// @grant        none
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/33854/Show%20spammers.user.js
// @updateURL https://update.greasyfork.org/scripts/33854/Show%20spammers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    createTextWrappers();
    setInterval(checkForCaps, 1000);

    function createTextWrappers(){
        var it = setInterval(() => {
            var title = document.getElementById("RNL");
            if(title){
                clearInterval(it);
                var wrapper = document.createElement("div");
                wrapper.id = "spammersWrapper";
                var text = document.createElement("textarea");
                text.id = "spammersNames";
                wrapper.appendChild(text);
                title.appendChild(wrapper);
            }
        }, 100);
    }
    function checkForCaps(){
        var senders = document.getElementsByClassName("UN");
        for(var i=0; i<senders.length; i++){
            var sender = senders[i];
            var message = sender.nextSibling.textContent;
            var caps = countCaps(message);
            if(caps > 5 && !isUsername(message)){
                var text = document.getElementById("spammersNames");
                var senderName = sender.innerText.match(/(.*):/)[1];
                if(!isSpammerListed(text.value, senderName))
                    text.value += "Repeated caps: "+senderName + "\n";
            }
        }
        function isUsername(message){
            var namesContainer = document.getElementById("UL");
            var children = namesContainer.children;
            for(var i=0; i<children.length; i++){
                var name = children[i].title;
                name = name.replace(/ /g,'');
                message = message.replace(/ /g,'');
                name = name.toLowerCase();
                if(message.toLowerCase() == name)
                    return true;
            }
            return false;
        }

        function isSpammerListed(text, name){
            return text.indexOf(name) > -1;
        }
        function isCap(letter){
            return isLetter(letter) && letter === letter.toUpperCase();
        }
        function isLetter(str) {
            return str.length === 1 && str.match(/[a-z]/i);
        }
        function countCaps(message){
            var caps = 0;
            var maxCaps = 0;
            message = message.replace(/ /g,'');
            for(var i=0; i<message.length; i++){
                if(isCap(message[i])){
                    if(++caps > maxCaps){
                        maxCaps = caps;
                    }
                }
                else
                    caps = 0;
            }
            return maxCaps;
        }
    }
})();