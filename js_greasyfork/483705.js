// ==UserScript==
// @name         economist-unlock
// @namespace    https://github.com/flyyuan
// @version      2024-01-02-1
// @description  to read Paid Articles of economist.com for Free
// @author       flyyuan
// @match        *://*.economist.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483705/economist-unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/483705/economist-unlock.meta.js
// ==/UserScript==





(function() {
    'use strict';

let loadCustomPage = () => {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", window.location.href, true);

    xhr.onerror = function () {
        document.documentElement.innerHTML = "Error getting Page!";
    };

    xhr.send()

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.documentElement.innerHTML = "Removing the Subscription..."
            removeSubscription(this.responseText);
        }
        else if(this.readyState == 0){
            document.documentElement.innerHTML = "Initiating the Request..."
        }
        else if(this.readyState == 1){
            document.documentElement.innerHTML = "Establishing the Server..."
        }
        else if(this.readyState == 2){
            document.documentElement.innerHTML = "Request Recieved..."
        }
        else if(this.readyState == 3){
            document.documentElement.innerHTML = "Processing the Request..."
        }
        else{
            document.documentElement.innerHTML = "Error Finding the Page!"
        }
    };
}

let removeSubscription = (htmlContentStr)=>{
    let wrapper = document.createElement("DIV");
    wrapper.innerHTML = htmlContentStr;

    let paywalls = wrapper.querySelectorAll(".paywall");
    let subscriptions = wrapper.querySelectorAll(".subscription-benefits");

    paywalls.forEach((paywall) => {
        paywall.remove()
    })
    subscriptions.forEach((subscription) => {
        subscription.remove()
    })

    document.documentElement.innerHTML = "Removing the Ads..."
    removeAds(wrapper.innerHTML)
}

let removeAds = (htmlContentStr) => {
    let wrapper = document.createElement("DIV");
    wrapper.innerHTML = htmlContentStr;

    let adverts = wrapper.querySelectorAll(".advert");
    adverts.forEach((advert) => {
        advert.remove()
    })

    putNewPage(wrapper)
}


let putNewPage = (pageHtml) => document.documentElement.innerHTML = pageHtml.innerHTML;

window.stop();
loadCustomPage();
})();