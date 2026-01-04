// ==UserScript==
// @name         logout on time
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  log out at specified time
// @license      MIT
// @author       Jacob
// @match        https://max.niceincontact.com/index*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484596/logout%20on%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/484596/logout%20on%20time.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function randomInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var hh;
    var mm;
    var ss;

    

    var hf = document.getElementsByClassName("state");
    //console.log(hf);



    function logoutButton() {
        setInterval(function() {
            if(document.getElementsByClassName("dialog-contents hidden").length==1){
                document.getElementsByClassName("confirm-button")[1].click();
            }
        }, 8000)

    }

    function clickOffline(hours, minutes, seconds) {
        var now = new Date();
        var then = new Date();

        if (now.getHours() > hours ||
            (now.getHours() == hours && now.getMinutes() > minutes) ||
            now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
            then.setDate(now.getDate() + 1);
        }
        then.setHours(hours);
        then.setMinutes(minutes);
        then.setSeconds(seconds);

        var timeout = (then.getTime() - now.getTime());
        setTimeout(function() {
            console.log("clicking working offline");
            hf[11].click();
            setTimeout(function() {
                hf[16].click();
            }, 3000);
        }, timeout);
        logoutButton();
    }

   
    const d = new Date();
    let day = d.getDay();
    if(day==1||day==2||day==3||day==4){
        hh = 16;
        mm = randomInteger(30,35);
        ss = randomInteger(2,58);
        clickOffline(hh, mm, ss);
        //clickLogout(hh, mm, ss + 15);
        console.log("logging out at "+hh+":"+mm+":"+ss);
    }
    else if(day==0){
        hh = 23;
        mm = randomInteger(6,7);
        ss = randomInteger(2,58);
        clickOffline(hh, mm, ss);
        //clickLogout(hh, mm, ss + 15);
        console.log("logging out at "+hh+":"+mm+":"+ss);
    }

})();