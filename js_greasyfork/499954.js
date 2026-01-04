// ==UserScript==
// @name         Rain detector for bloxflip and bloxmoon
// @namespace    http://tampermonkey.net/
// @version      2024-07-07-2
// @description  Rain notifications
// @author       Ritba
// @match        https://bloxflip.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxflip.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499954/Rain%20detector%20for%20bloxflip%20and%20bloxmoon.user.js
// @updateURL https://update.greasyfork.org/scripts/499954/Rain%20detector%20for%20bloxflip%20and%20bloxmoon.meta.js
// ==/UserScript==

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
    console.log("Tick")
    let currentTime = new Date(Date.now())
    if(currentTime.getMinutes() == 58){
        if(currentTime.getSeconds() == 58 || currentTime.getSeconds() == 59 || currentTime.getSeconds() == 57 || currentTime.getSeconds() == 56){
            console.log("Bloxmoon Rain");
            new Notification("BloxMoon Rain", {
                body: "Join the Rain"
            });
        }
        else{
            console.log(60 - currentTime.getSeconds())
        }
    }
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