// ==UserScript==
// @name       Volemoji.
// @description Volafile smiles.
// @match      *://volafile.io/*
// @include    *://volafile.io/*
// @require https://cdnjs.cloudflare.com/ajax/libs/emojify.js/0.9.5/emojify.js
// @version 0.0.1.20150715025436
// @namespace https://greasyfork.org/users/13310
// @downloadURL https://update.greasyfork.org/scripts/10980/Volemoji.user.js
// @updateURL https://update.greasyfork.org/scripts/10980/Volemoji.meta.js
// ==/UserScript==

emojify.setConfig({
    img_dir : 'https://cdn.imnjb.me/libs/emojify-js/images/emoji/'
});

//Ignore the commented out shit
/*emojify.run(document.getElementById('chat_messages'));*/

var target_chat = document.querySelector('#chat_messages');

var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        var message = mutation.addedNodes;
                  
        for (var i = 0; i < message.length; i++) {
            emojify.run(message[i]);

            var all = message[i].getElementsByClassName("emoji");
            for (var n = 0; n < all.length; n++) {
                all[n].style.width="20px";
            }
            //message[i].getElementsByClassName("emoji")[total].style.width="20px";
        }
    });
});
 
var config = {
    childList: true
};

observer.observe(target_chat, config);