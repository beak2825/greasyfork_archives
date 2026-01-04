 // ==UserScript==
// @name        Mousehunt Ultimate Horn
// @author      Howie The Almighty
// @version    	2020.11.25
// @namespace   https://github.com
// @description Just to sound horn, nothing fancy, but it bypasses the king's reward.
// @require		https://code.jquery.com/jquery-2.2.2.min.js
// @include		http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @include		http://hi5.com/friend/games/MouseHunt*
// @include		http://mousehunt.hi5.hitgrab.com/*
// @grant		unsafeWindow
// @grant		GM_info
// @downloadURL https://update.greasyfork.org/scripts/416683/Mousehunt%20Ultimate%20Horn.user.js
// @updateURL https://update.greasyfork.org/scripts/416683/Mousehunt%20Ultimate%20Horn.meta.js
// ==/UserScript==



(function() {
    'use strict';

    setTimeout(main_function, 960*1000);
})();

function main_function(){
    hornAPI()
    location.reload()
}

function hornAPI(){
    let timeNow = new Date()
    fetch('https://www.mousehuntgame.com/api/action/turn/me', {
        method: "GET",
    })
    .then(res => res.json())
    .then(res => {
        if (res.success){
            console.log("Successfully horned at " + timeNow.toISOString())
        } else {
            console.log("Failed to horn at " + timeNow.toISOString())
        }
        console.log(res)
    })
}
