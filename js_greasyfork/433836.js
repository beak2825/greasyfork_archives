// ==UserScript==
// @name         Darkness And Fps Booster And Ping Dropped [By AFK]
// @namespace    -
// @version      0.1
// @description  Will boost your fps and ping by heaps
// @author       AFK
// @match        *://*.moomoo.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433836/Darkness%20And%20Fps%20Booster%20And%20Ping%20Dropped%20%5BBy%20AFK%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/433836/Darkness%20And%20Fps%20Booster%20And%20Ping%20Dropped%20%5BBy%20AFK%5D.meta.js
// ==/UserScript==
var removeui = false;// make true if you want action bar and leaderboard, chat to be gone
(function() {//fps booster
    let checker = setInterval(() => {
        let remover = document.getElementById("ot-sdk-btn-floating");
        let remover2 = document.getElementById("partyButton");
        let remover3 = document.getElementById("joinPartyButton");
        let remover4 = document.getElementById("youtuberOf");
        let remover5 = document.getElementById("moomooio_728x90_home");
        let remover6 = document.getElementById("darkness");
        let remover7 = document.getElementById("gameUI");
        if(remover || remover2 || remover3 || remover4 || remover5 || remover6 || remover7){
            remover.remove();
            remover2.remove();
            remover3.remove();
            remover4.remove();
            remover5.remove();
            remover6.remove();
            if(removeui == true){
            remover7.remove();
            }
            clearInterval(checker);
        }
    })
})();