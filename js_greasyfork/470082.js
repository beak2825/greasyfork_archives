// ==UserScript==
// @name         Ekşi - Takip edilen temizleyici - Bonus modül (#3) - Kimler takipten çıkmış kontrol eder 
// @namespace    http://tampermonkey.net/
// @version      2
// @description  "Kimler takipten çıkmış kontrol eder." !! Çalışması içni ana modül (#1)'in en az 1 kere çalışıp işini bitirmiş olması gerekli ! Yoksa yalan yanlış bilgi verir.
// @author       angusyus
// @include      https://eksisozluk*.com/takip/*
// @include      https://eksisozluk*.com/biri/*

// @license MIT
/*jshint esversion: 10 */
// @downloadURL https://update.greasyfork.org/scripts/470082/Ek%C5%9Fi%20-%20Takip%20edilen%20temizleyici%20-%20Bonus%20mod%C3%BCl%20%283%29%20-%20Kimler%20takipten%20%C3%A7%C4%B1km%C4%B1%C5%9F%20kontrol%20eder.user.js
// @updateURL https://update.greasyfork.org/scripts/470082/Ek%C5%9Fi%20-%20Takip%20edilen%20temizleyici%20-%20Bonus%20mod%C3%BCl%20%283%29%20-%20Kimler%20takipten%20%C3%A7%C4%B1km%C4%B1%C5%9F%20kontrol%20eder.meta.js
// ==/UserScript==

var followButtonArray = [];

const DATE_KEY = 'startWhoDidUnfollowRecordingDate';
const AUTHOR_KEY = 'cleaningYazarName';
const BUTTON_ID = 'track-who-did-unfollow-button';
const BUTTON_NAME = "Takipten Kim Çıktı?";
const FOLLOWING_RECORD_KEY_NICK = "cleanCheckNick_";
const FOLLOWING_RECORD_KEY_DATE = "cleanCheckDate_";

(function() {
    'use strict';

    //Kayıt başlatmak için zaman kıyaslama kontrolü

    setTimeout(() => {

        const lastDateOfRecordCommand = localStorage.getItem(DATE_KEY);
        console.log("!!! lastDateOfRecordCommand:" + lastDateOfRecordCommand);

        const dateDiffer = new Date().getTime() - lastDateOfRecordCommand;
        console.log("!!! dateDiffer:" + dateDiffer);

        const storedYazarName = localStorage.getItem(AUTHOR_KEY);
        console.log("!!! storedYazarName:" + storedYazarName);

        const currentYazarName = getYazarName();
        console.log("!!! currentYazarName:" + currentYazarName);

        if (dateDiffer < 5000 && storedYazarName == currentYazarName) {
            console.log("!!! LETS TRACK !!! ");
            startTracking();
        }

    }, 2000);

    //Buton ekleme

    const buttonTab = document.getElementsByClassName("sub-title-menu profile-buttons")[0];

    if(buttonTab != null) {
        buttonTab.appendChild(createButton(BUTTON_ID, BUTTON_NAME));
        document.querySelector("#"+BUTTON_ID).addEventListener("click", onTrackButtonClick);
    }
})();


function onTrackButtonClick(zEvent) {
    alert("Kim çıktı takipten seni agucuk gugucuk ?");

    const currentDate = new Date().getTime();
    const yazarName = getYazarName();
    console.log("!!! currentDate:" + currentDate);
    console.log("!!! yazarName:" + yazarName);
    localStorage.setItem(DATE_KEY, currentDate);
    localStorage.setItem(AUTHOR_KEY, yazarName);

    var stats = document.getElementById("user-entry-stats");
    var link = stats.getElementsByTagName("li")[2].getElementsByTagName("a")[0].href;
    location.replace(link);
}

function createButton(id, text) {
  let button = document.createElement("button");
  button.innerText = text;
  button.id = id;
  return button;
}

function getYazarName() {
    try {
        return document.querySelector("#content-body > h1 > a").innerHTML;
    } catch {
        try {
            return document.getElementById("user-profile-title").getAttribute("data-nick");
        } catch {
            return "";
        }
    }
}

async function startTracking() {
    var following = await scrollToBottom();
    startUnfollowerTrackOperation();
}

async function scrollToBottom() {

    return new Promise((resolve, reject) => {

        async function scroll() {
            await scrollToBottomSync();

            console.log("!!! Tüm takip/takipçiler tamamen yüklendi.");

            setTimeout(() => {

                const yazarHeader = document.querySelector("#content-body > h1 > a");
                var yazar = document.querySelector("#content-body > h1 > a").innerHTML;
                var followerNicks = document.querySelectorAll("#follows-nick");

                const takipciler = [];
                for (var i = 0; i < followerNicks.length; i++) {
                    takipciler.push(followerNicks[i].innerHTML);
                }
                resolve(takipciler);

            }, 1500);
        }

        scroll();
    });
}

function scrollToBottomSync() {

    return new Promise((resolve, reject) => {

        function scrollToBottomOperation() {
            window.scrollTo(0, document.body.scrollHeight);
            var followDiv = document.getElementById("follow-list");

            if (followDiv.childElementCount < 100) {
                resolve();
            } else {
                var isPageDone = followDiv.getAttribute('page-done');

                if (isPageDone) {
                    resolve();
                } else {
                    setTimeout(scrollToBottomOperation, 500);
                }
            }
        }
        scrollToBottomOperation();
    });
}


function startUnfollowerTrackOperation() {

    var followerNicks = document.querySelectorAll("#follows-nick");
    const güncelTakipciler = [];
    for (var i = 0; i < followerNicks.length; i++) {
        güncelTakipciler.push(followerNicks[i].innerHTML);
    }

    console.log(güncelTakipciler.length);

    const kayitliTakipciler = [];
    for (var j=0; j<localStorage.length; j++) {
        var key = localStorage.key(j);
        var bool = localStorage.getItem(key);

        if (key.startsWith("cleanCheckNick_") && bool == "true"){
            const newString = key.split("cleanCheckNick_").pop();
            kayitliTakipciler.push(newString);
        }
    }

    console.log("!!! UNFOLLOWER LIST RESULT: " + kayitliTakipciler.filter(n => !güncelTakipciler.includes(n)));
}