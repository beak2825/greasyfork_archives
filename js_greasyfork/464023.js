// ==UserScript==
// @name         LZT Image Chat Viewer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Данное расширение позволяет просматривать изображения в чате без наведения
// @author       Shark | zelenka.guru/shark
// @match        https://zelenka.guru/chatbox/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464023/LZT%20Image%20Chat%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/464023/LZT%20Image%20Chat%20Viewer.meta.js
// ==/UserScript==

(function() {
    setInterval(check_imgs, 1);
})();




function check_imgs(){
    let messages = document.querySelectorAll('.chat2-message-text-inner')
    for (let i = 0; i < messages.length; i++) {
        let obj = messages[i];
        let check = obj.querySelectorAll('a')
        if (check){
            for (let b = 0; b < check.length; b++){
                let link = check[b].href;
                if (link.includes('imgur.com')){
                    let img = document.createElement('img');
                    img.src = link;
                    check[b].remove();
                    obj.append(img);
                }
            }
        }
    }
}