// ==UserScript==
// @name         Grundos Cafe Shopban Timer
// @namespace    https://www.grundos.cafe/
// @namespace    https://grundos.cafe/
// @version      1.4
// @description  Display the remaining time of a Shop Ban in the sidebar, down to the seconds. It will require to visit a shop again after a purchase. Refresh ban will be picked up immediately. Will not work accurately across multiple devices.
// @author       Dark_Kyuubi
// @match        https://www.grundos.cafe/*
// @match        https://grundos.cafe/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459866/Grundos%20Cafe%20Shopban%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/459866/Grundos%20Cafe%20Shopban%20Timer.meta.js
// ==/UserScript==

/**
 * CREDITS: Thanks to "RS Timer ONLY" and "Random Event Tracker" for serving as inspiration on how to solve some problems.
 * Also thanks to wibreth and bankde for some tips.
 */

/**
 * I decided to use Date instead of NST, because bans can last up to 16 hours and I need to determine the day and consider am and pm changes. It's easier to do with Date.
 * In the end I just need hours, mins and secs, so Locale shouldn't be an issue...
 */
let currentTime = new Date().getTime();
let buytimeStorage = "lastTimeBought";
let shopBanStorage = "activeShopBan";
//store this value to have the precise time when the shop ban occured, as there's a delay when the user goes back to the shop to see the actual ban.
let lastBoughtTime = !GM_getValue(buytimeStorage) ? 0 : GM_getValue(buytimeStorage);
//use this value to determine whether the ban is still active or how long it still lasts
let shopBanLiftTime = !GM_getValue(shopBanStorage) ? 0 : GM_getValue(shopBanStorage);
//just create it once...
let shopBanTimerDiv = document.createElement("div");

/**
 * This will display hours:minutes:seconds in the Shops-section of the sidebar.
 * Using ms conversion to have an easy time with Maths...
 * Thanks to the internet for providing me with the Math solutions.
 */
function displayBan() {
    let msLeft = shopBanLiftTime - new Date().getTime();
    shopBanTimerDiv.id = "shopBanTimer";
    shopBanTimerDiv.style = "padding: 1px; font-size: 16px; text-align: center;";
    document.querySelector("div.shops .aio-section-header").insertAdjacentElement("afterend", shopBanTimerDiv);

    if (msLeft > 0) {
        //let's calculate hours, mins and seconds left until the shop ban lift to display them...
        let shopBanLiftHour = Math.floor(msLeft / 1000 / 60 / 60);
        msLeft -= shopBanLiftHour * 1000 * 60 * 60;
        let shopBanLiftMinute = Math.floor(msLeft / 1000 / 60);
        msLeft -= shopBanLiftMinute * 1000 * 60;
        let shopBanLiftSecs = Math.floor(msLeft / 1000);
        if (shopBanLiftSecs < 10) {
            shopBanLiftSecs = "0" + shopBanLiftSecs;
        }
        if (shopBanLiftMinute < 10) {
            shopBanLiftMinute = "0" + shopBanLiftMinute;
        }
        msLeft = 0; //to avoid any bugs...?
        shopBanTimerDiv.innerHTML = "<span class='aio-subtext'>Shopban: " + shopBanLiftHour + ":" + shopBanLiftMinute + ":" + shopBanLiftSecs + "</span>";
    } else {
        //remove element once time has run out
        shopBanTimerDiv.style = "display: none;";
    }
}

function resetValues() {
    lastBoughtTime = 0;
    shopBanLiftTime = 0;
    GM_setValue(buytimeStorage, 0);
    GM_setValue(shopBanStorage, 0);
}

/**
 * This documentation also serves myself (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ I got hella confused in the process of avoiding unncessary operations. I love preserving performance as much as possible.
 * Basically, when shopBanLiftTime is present, a shop ban is active and no new purchase needs to be registered until it has run out.
 * LastBoughtTime is used to figure out the exact time of the ban once the user visits a shop with the ban message after a purchase.
 * The ban message is read and parsed, added on top of the last bought time (or current time if refresh ban), then registered as the shopBanLiftTime.
 * At this point, lastBoughtTime can be cleared up and only shopBanLiftTime should be used on every page to display the remaining ban in a container.
 * Once shopLiftBanTime has exceeded the current time, it should be reset and every purchase should be registered in case a ban might be detected again.
 *
 * This would be so much easier if there was an indication for a ban at the time of purchase, but I'm not going to maintain a list of items that will ban guaranteed, only to handle items that only have a chance to ban differently anyway.
 * Someone else who wants to save that bit of performance, feel free to use my code in a new script and add that. I don't want to bother with such crowdsourced maintenance.
 *
 */
function checkBan() {
    let currentPageURL = window.location.href;
    if (currentPageURL.includes("buyitem")) {
        //let's see if the user bought an item outside of the ban...
        if ([...document.querySelectorAll("p")].filter(element => element.childNodes?.[0]?.nodeValue?.match('accept your offer of'))?.length) {
            //Shopkeeper accepted an offer, so the user bought something! Tracking the time to use it when the user visits a shop.
            GM_setValue(buytimeStorage, currentTime);
        }
    } else if (currentPageURL.includes("viewshop")) {
        //let's see if the user got a ban for their last purchase...
        //due to having to consider refresh ban, I need to check for this every refresh. Performance worries should be negligible.
        var shopBanDurationElement = [...document.querySelectorAll("strong.red")].filter(e => e.childNodes && [...e.childNodes].find(n => n.nodeValue?.match("hour")));
        if (shopBanDurationElement?.length) {
            //read the hour from the detected element...
            let shopBanDuration = parseInt(shopBanDurationElement[0].innerHTML.match(/\d+/)[0]);

            let calculatedShopBanEndTime = calculateShopBanEnd(shopBanDuration);

            //no need for buytime anymore
            GM_setValue(buytimeStorage, 0);
            //only update the shopBanEndTime if none is present or a faster endtime was detected. Fixes a bug when values reset randomly
            if(shopBanLiftTime == 0 || calculatedShopBanEndTime < GM_getValue(shopBanStorage)) {
                shopBanLiftTime = calculatedShopBanEndTime;
                GM_setValue(shopBanStorage, calculatedShopBanEndTime);
            }
        } else if (shopBanLiftTime > 0 && !shopBanDurationElement?.length) {
            /**
             * reset leftover values when no ban is detected.
             * This will catch the ban running out before the calculated time.
             * And it will clear up the last purchase time after no ban has been detected.
             */
            resetValues();
        }
    }

    function calculateShopBanEnd(shopBanDuration) {
        let calculatedShopBanEndTime;
        if (lastBoughtTime > 0) {
            //use the purchase time as reference for the occurence of the ban
            calculatedShopBanEndTime = lastBoughtTime + shopBanDuration * 3600000;
        } else {
            //probably a refresh ban. Also good failsafe.
            calculatedShopBanEndTime = currentTime + shopBanDuration * 3600000;
        }
        return calculatedShopBanEndTime;
    }
}

(function () {
    'use strict';

    //Time of the last purchase is not necessary anymore when the shop ban timeframe has been figured out. Also makes it easier to decide the following operations.
    if (shopBanLiftTime > 0) {
        lastBoughtTime = 0;
        GM_setValue(buytimeStorage, 0);
    }

    //reset shop ban timer when the ban has run out
    if (0 > (shopBanLiftTime - currentTime)) {
        shopBanLiftTime = 0;
        GM_setValue(shopBanStorage, 0);
    }

    checkBan();

    //don't even attempt to display the element when the relevant region isn't showing up.
    if (document.querySelector("div.shops")) {
        if (shopBanLiftTime > 0 && (shopBanLiftTime - new Date().getTime()) > 0) {
            displayBan();
            setInterval(displayBan, 1000);
        }
    }
})();

