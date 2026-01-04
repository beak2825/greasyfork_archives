// ==UserScript==
// @name         Bloxflip Rain Autojoin
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  sends notification and plays a sound when a rain event starts and joins it
// @author       blueiicey
// @match        https://bloxflip.com/*
// @icon         https://bloxflip.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499700/Bloxflip%20Rain%20Autojoin.user.js
// @updateURL https://update.greasyfork.org/scripts/499700/Bloxflip%20Rain%20Autojoin.meta.js
// ==/UserScript==

/*
https://greasyfork.org/en/scripts/493122-bloxflip-auto-rain/code
https://greasyfork.org/en/scripts/447509-bloxflip-spam-blocker/code
https://dashboard.hcaptcha.com/welcome_accessibility
https://nopecha.com/ free tier
*/

//gets notif perms
//console.log("notif perms: "+Notification.permission);
if (Notification.permission === "granted") {
    //don't need to request notif perms
} else if (Notification.permission !== "denied") {
   //get notif perms
    alert("Allow notifications to get notified when a rain occurs")
    Notification.requestPermission().then(permission => {
        console.log(permission)
    });
};


//init var
var activeRain = false;

//checks for rain, alerts user and joins rain
setInterval(async function() {  
    //get chat history
    let history = await fetch('https://api.bloxflip.com/chat/history');
    let chat = JSON.parse(await history.text()); //parse it
    
    if(chat.rain.active && !activeRain) { //check rain status
        var sound = new Audio('https://www.myinstants.com/media/sounds/cash-register-sound-fx.mp3');
        sound.play();
        new Notification(chat.rain.prize.toString() + " R$ Rain", {
            body: "Hosted by " + chat.rain.host
        });
        activeRain = true; //set var
        //click join rain bttn
        const b=document.querySelectorAll('div[class*="chatBanner"]');for(const a of b){const p=a.querySelectorAll('p');for(const c of p)if(c.textContent.trim()==='Join For Free'){c.click();break}}
    } else if (!chat.rain.active && activeRain) { //rain stopped
        activeRain = false; //set var
    };
}, 2000);