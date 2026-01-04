// ==UserScript==
// @name         Nutaku reload helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Satellite script for HHAuto++, Nutaku version
// @author       Dorten D
// @match        http*://www.nutaku.net/games/harem-heroes/play*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375410/Nutaku%20reload%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/375410/Nutaku%20reload%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lastAnswer = (new Date()).getTime();
    window.addEventListener('message', function(event)
        {
            if (event.origin=="https://nutaku.haremheroes.com")
            {
                //console.log('NRH: recieved ',event);
                if (event.data.reloadMe)
                {
                    window.location.reload();
                }
                if (event.data.ImAlive)
                {
                    //console.log('NRH: ITS ALIVE!');
                    lastAnswer = (new Date()).getTime();
                }
            }
        }
    );

    setInterval(function(){
        if((new Date()).getTime() - lastAnswer > 15000) {
            console.log("NRH: it's dead :(");
            window.location.reload();
        }
    },2000);
})();