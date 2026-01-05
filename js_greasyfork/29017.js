// ==UserScript==
// @name         DT+ hider
// @namespace    Danielv123
// @version      1.1
// @description  Hides all articles that is hidden behind a paywall
// @author       Danielv123
// @match        https://www.dt.no/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29017/DT%2B%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/29017/DT%2B%20hider.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // remove articles on frontpage
    let paidArticles = document.querySelectorAll(".df-skin-paywall");
    let numberOfFreeArticles = document.querySelectorAll(".df-article").length - paidArticles.length;
    console.log("Removed " + paidArticles.length + " paid articles, " + numberOfFreeArticles + " free articles left.");
    for(let i = 0; i < paidArticles.length;i++){
        paidArticles[i].style.display = "none";
    }

    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        if(paidArticles.length > 0 && numberOfFreeArticles > 0){
            var notification = new Notification("Removed " + paidArticles.length + " paid articles, " + numberOfFreeArticles + " free articles left.");
        }
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                if(paidArticles.length > 0 && numberOfFreeArticles > 0){
                    var notification = new Notification("Removed " + paidArticles.length + " paid articles, " + numberOfFreeArticles + " free articles left.");
                }
            }
        });
    }
    // remove articles on article pages
    // find the + sign and trace article box from parentElements
    // timeout apparently required
    setTimeout(function(){
        paidArticles = document.querySelectorAll(".am-premium-logo--imageoverlay");
        for(let i = 0; i < paidArticles.length;i++){
            paidArticles[i].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = "none";
        }
        if(paidArticles && paidArticles.length > 0){
            console.log("Removed " + paidArticles.length + " paid articles");
        }
    },1000);
})();