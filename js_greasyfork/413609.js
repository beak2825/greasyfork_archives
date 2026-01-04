// ==UserScript==
// @name         Auction Countdown Timer for Mobile
// @namespace    hardy.auction.timer
// @version      1.1
// @description  Display Countdown timer on Auction page for mobile.
// @author       Hardy[2131687]
// @match        https://www.torn.com/amarket.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/413609/Auction%20Countdown%20Timer%20for%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/413609/Auction%20Countdown%20Timer%20for%20Mobile.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    
 
    let array = ["extremely", "very", "rare", "limited", "uncommon"];
    var obj = {};
    
    function countdown() {
        var now = Date.now();
        var index = obj.index;
        var ul = document.querySelectorAll(".items-list")[index].children;
        for (var t = 0; t < ul.length -1; t++) {
            var countDownDate = (ul[t].querySelector(".hardy_hidden_stamp").innerText)*1000;
            var distance = countDownDate - now;
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            ul[t].querySelector(".item-cont-wrap .title .t-gray-6").innerText = days + "d " + hours + "h "+ minutes + "m " + seconds + "s ";
            if (distance < 0) {
                ul[t].querySelector(".item-cont-wrap .title .t-gray-6").innerText = "Expired";
            }
        }
    }
    
    $( document ).ajaxComplete((event, jqXHR, ajaxObj) => {
        if (jqXHR.responseText && ajaxObj.data) {
            let url = ajaxObj.url;
            let data = ajaxObj.data;
            let response = JSON.parse(jqXHR.responseText);
            if (data.includes("getAuctionItemsList") && response.success) {
                let list = response["list"];
                let type = data.split("type=")[1];
                let index = array.indexOf(type);
                obj.index = index;
                var li = document.querySelectorAll(".items-list")[index].children;
                for (var k = 0; k < li.length -1; k++) {
                    var newnode = document.createElement("div");
                    newnode.className = "hardy_hidden_stamp";
                    newnode.innerText = Math.floor(Date.now()/1000) + list[k]["timer"].value;
                    li[k].appendChild(newnode);
                }
                var cd = setInterval(countdown, 1000);
            }
        }
    });
 
 
    GM_addStyle(` .hardy_hidden_stamp {display: none;} `)
 
})();
 
