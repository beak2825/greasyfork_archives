// ==UserScript==
// @name         html5-notification-api
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       Nei
// @match        https://catwar.su/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @description  Used htlm5 notification in GC
// @downloadURL https://update.greasyfork.org/scripts/461639/html5-notification-api.user.js
// @updateURL https://update.greasyfork.org/scripts/461639/html5-notification-api.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let intervalId;
    function notifyMe() {
        if(document.querySelector("#sek")){
            let arr =  document.querySelector("#sek").textContent.split(" ");
            let time;
            if(arr.length === 4){
                time = arr[0]*60*1000 + arr[2]*1000 - 500;
            }
            if(arr.length === 2){
                time = arr[0]*1000 - 500;
            }
            // intervalId = setTimeout(notice, time);
            document.querySelector("#cancel").addEventListener("click", clearInterval);
        }
    }
    $('#block_deys').bind("DOMSubtreeModified",function(){
        document.querySelectorAll(".dey").forEach((item) =>
                                                  item.addEventListener("click", intervalNotify)
                                                 )
    })
    $('#block_mess').bind("DOMSubtreeModified",function(){
        let time;
        if(document.querySelector("#sek")){
            let arr = document.querySelector("#sek").textContent.split(" ");
            if(arr.length === 4){
                time = arr[0]*60*1000 + arr[2]*1000 - 500;
            }
            if(arr.length === 2){
                time = arr[0]*1000 - 500;
            }
            console.log(time);
            if(time < 1500){
                notice();
            }
        }

    })



    function intervalNotify(){
        setTimeout(notifyMe, 500);

    }

    function clearInterval(){
        clearTimeout(intervalId);
    }

    function notice(){
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            const notification = new Notification("Действие закончилось");

        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
                if (permission === "granted") {
                    const notification = new Notification("Действие закончилось");
                    // …
                }
            });
        }
    }
})();