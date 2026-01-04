// ==UserScript==
// @name         private Fluxus Key System Bypasser v3
// @version      1.5
// @description  Bypass the Fluxus Key System with ease!
// @author       nonculturedperson / dindin
// @match        *://linkvertise.com/*
// @match        *://*.flux.li/*
// @match        *://*.fluxteam.net/*
// @icon         https://www.google.com/s2/favicons?domain=fluxteam.net
// @license      lol
// @namespace https://greasyfork.org/en/users/1242451
// @downloadURL https://update.greasyfork.org/scripts/483729/private%20Fluxus%20Key%20System%20Bypasser%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/483729/private%20Fluxus%20Key%20System%20Bypasser%20v3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const redirectMap = {
        "https://linkvertise.com/152666/fluxus-windows-check-1": "fluxteam.net/windows/checkpoint/check1.php",
        "https://linkvertise.com/152666/fluxus-windows-check-2/1": "fluxteam.net/windows/checkpoint/check2.php",
        "https://linkvertise.com/152666/fluxus-windows-main/1": "fluxteam.net/windows/checkpoint/main.php",
        "https://fluxteam.net/windows/checkpoint/check1.php": "linkvertise.com/152666/fluxus-windows-check-2/1",
        "https://fluxteam.net/windows/checkpoint/check2.php": "linkvertise.com/152666/fluxus-windows-main/1",
        "https://linkvertise.com/530799/fluxus-android-free2": "fluxteam.net/android/checkpoint/check1.php",
        "https://linkvertise.com/530799/fluxus-android-free": "fluxteam.net/android/checkpoint/main.php",
        "https://fluxteam.net/android/checkpoint/check1.php": "linkvertise.com/530799/fluxus-android-free",
    };

    const currentURL = window.location.href;

    if (currentURL in redirectMap) {
        window.location.replace(`https://${redirectMap[currentURL]}`);
    }

    if(currentURL === "https://fluxteam.net/windows/checkpoint/check1.php") {

    localStorage.setItem('startTime', Date.now());

    }

    if(currentURL === "fluxteam.net/android/checkpoint/check1.php") {

    localStorage.setItem('startTime', Date.now());

    }

    if (location.href.includes(".nexus" && "start.php")) {
        showNotification( { r: 0, g: 128, b: 0 }, "Please wait for Nexus verification...");
    }


    if (currentURL.includes("fluxteam.net/android/checkpoint/start.php?HWID=")) {
        showNotification( { r: 0, g: 128, b: 0 }, "Got HWID! Completing Key System...");
        window.location.replace("https://linkvertise.com/530799/fluxus-android-free2");
    }

    if (currentURL === "https://keysystem.fluxteam.net/android/checkpoint/start.php") {
        showNotification( { r: 255, g: 0, b: 0 }, "No HWID has been entered into the URL! Please enter your HWID into the URL and try again.");
    }


    if (currentURL.includes("flux.li/windows/start.php?HWID=")) {
        const HWID = currentURL.split("=")[1];
        showNotification( { r: 0, g: 128, b: 0 }, "Got HWID! Completing Key System...");
        window.location.href = `https://flux.li/windows/start.php?7b20bcc1dfe26db966bb84f159da392f=false&HWID=${HWID}`;
    }

    if (currentURL === "https://flux.li/windows/start.php") {
        showNotification( { r: 255, g: 0, b: 0 }, "No HWID has been entered into the URL! Please enter your HWID into the URL and try again.");
    }

    if (currentURL === "https://fluxteam.net/windows/checkpoint/main.php") {
        window.stop();
        const startTime = localStorage.getItem('startTime');
        if (startTime) {
        const endTime = Date.now();
        const elapsedSeconds = Math.floor((endTime - parseInt(startTime)) / 1000);
        showNotification(
        { r: 0, g: 128, b: 0 },
        `Successfully bypassed Fluxus Keysystem! It took ${elapsedSeconds} seconds to reach here. Please copy your key and paste it into Fluxus.`
      );
      localStorage.removeItem('startTime')
   }

   if (currentURL === "fluxteam.net/android/checkpoint/main.php") {
        window.stop();
        const startTime = localStorage.getItem('startTime');
        if (startTime) {
        const endTime = Date.now();
        const elapsedSeconds = Math.floor((endTime - parseInt(startTime)) / 1000);
        showNotification(
        { r: 0, g: 128, b: 0 },
        `Successfully bypassed Fluxus Keysystem! It took ${elapsedSeconds} seconds to reach here. Please copy your key and paste it into Fluxus.`
      );
      localStorage.removeItem('startTime')
   } else {
      showNotification(
        { r: 255, g: 0, b: 0 },
        'location unknown please screenshot and send it to me!'
      );
    }
}}
  function showNotification(color, message) {
    const notificationDiv = document.createElement('div');
    notificationDiv.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
    notificationDiv.style.color = 'white';
    notificationDiv.style.position = 'fixed';
    notificationDiv.style.top = '0';
    notificationDiv.style.left = '0';
    notificationDiv.style.width = '100%';
    notificationDiv.style.padding = '10px';
    notificationDiv.style.textAlign = 'center';
    notificationDiv.style.fontWeight = 'bold';
    notificationDiv.textContent = message;
    document.body.appendChild(notificationDiv);
    setTimeout(() => {
      document.body.removeChild(notificationDiv);
    }, 4000);
  }
})();