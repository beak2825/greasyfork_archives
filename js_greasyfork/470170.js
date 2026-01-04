// ==UserScript==
// @name         Ekşi - Takip edilenleri takip et
// @namespace    http://tampermonkey.net/
// @version      1
// @description  "Kişininin takip ettiklerini takip eden bot". Bu şahıs bunları takip ediyorsa bir bildiği vardır, ben de takip edicem diyorsan tıkla.
// @author       angusyus
// @include      https://eksisozluk*.com/biri/*
// @include      https://eksisozluk*.com/takip/*

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470170/Ek%C5%9Fi%20-%20Takip%20edilenleri%20takip%20et.user.js
// @updateURL https://update.greasyfork.org/scripts/470170/Ek%C5%9Fi%20-%20Takip%20edilenleri%20takip%20et.meta.js
// ==/UserScript==
/*jshint esversion: 10 */

var followButtonArray = [];

(function() {
    'use strict';

    setTimeout(() => {

        const lastDateOfRecordCommand = localStorage.getItem('startFollowingFollowDate');
        console.log("!!! lastDateOfRecordCommand:" + lastDateOfRecordCommand);

        const dateDiffer = new Date().getTime() - lastDateOfRecordCommand;
        console.log("!!! dateDiffer:" + dateDiffer);

        const storedYazarName = localStorage.getItem('followingFollowYazarName');
        console.log("!!! storedYazarName:" + storedYazarName);

        const currentYazarName = getYazarName();
        console.log("!!! currentYazarName:" + currentYazarName);

        if (dateDiffer < 10000 && storedYazarName == currentYazarName) {
            console.log("!!! LETS RECORD !!! ");
            startRecording();
        }

    }, 2000);

    const buttonTab = document.getElementsByClassName("sub-title-menu profile-buttons")[0];

    if(buttonTab != null) {
        buttonTab.appendChild(createButton("start-following-follow", "Takipleri Takip"));
        document.querySelector("#start-following-follow").addEventListener("click", onFollowStartButtonClick);
    }
})();


function onFollowStartButtonClick(zEvent) {
    alert ("Takip etme başlıyor");

    const currentDate = new Date().getTime();
    const yazarName = getYazarName();
    console.log("!!! currentDate:" + currentDate);
    console.log("!!! yazarName:" + yazarName);
    localStorage.setItem('startFollowingFollowDate', currentDate);
    localStorage.setItem('followingFollowYazarName', yazarName);

    var stats = document.getElementById("user-entry-stats");
    var link = stats.getElementsByTagName("li")[2].getElementsByTagName("a")[0].href;
    location.replace(link);
}

async function startRecording() {
    var following = await scrollToBottom();
    console.log("!!!+ followers: (" + following.length + ")" + following);

    startFollowingOperation();
}

async function scrollToBottom() {

    return new Promise((resolve, reject) => {

        async function scroll() {
            await scrollToBottomSync();

            console.log("!!! BBBBBİTTTİİ");

            setTimeout(() => {

                const yazarHeader = document.querySelector("#content-body > h1 > a");
                var yazar = document.querySelector("#content-body > h1 > a").innerHTML;
                var followerNicks = document.querySelectorAll("#follows-nick");
                var i;
                const takipciler = [];
                for (i = 0; i < followerNicks.length; i++) {
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

            console.log("!!! followDiv.childElementCount:" + followDiv.childElementCount);

            if (followDiv.childElementCount < 100) {
                console.log("!!! bitti");
                resolve();
            } else {
                var isPageDone = followDiv.getAttribute('page-done');

                if (isPageDone) {
                    console.log("!!! bitti");
                    resolve();
                } else {
                    console.log("!!! Devam");
                    setTimeout(scrollToBottomOperation, 500);
                }
            }
        }

        scrollToBottomOperation();

    });
}


function startFollowingOperation() {
    var list = document.getElementById("follow-list").getElementsByTagName("li");
    followButtonArray = [];

    for (var i = 0; i < list.length; i++) {
        var ele = list[i];
        var pp = ele.getElementsByTagName("img")[0].getAttribute("src");
        var defaultPp = "//ekstat.com/img/default-profile-picture-dark.svg";
        var spanList = ele.getElementsByTagName("span");
        var buttonText = null;

        try {
            buttonText = spanList[spanList.length-1].innerText;
        } catch (error) {

        }

        if (buttonText != null) {

            var isNotFollowing = buttonText != "takip ediliyor";

            if(pp != defaultPp && isNotFollowing) {
                var followButton = ele.querySelector("#buddy-link");
                followButtonArray.push(followButton);
            }
        }
    }

    if(followButtonArray.length > 0) {
        clickOnFollowButtons();
    } else {
        console.log("!!! takip edilecek kimse yok !!!");
        var mp3_url = 'https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3';
        (new Audio(mp3_url)).play();
    }
}

async function clickOnFollowButtons() {

    console.log("takip başladı, sayı:" + followButtonArray.length);

    for (var i = 0; i < followButtonArray.length; i++) {

        if (i % 10 == 0 && i > 1) {
            await delay(10000);
        }

        await new Promise((resolve) => {
            setTimeout(() => {
                followButtonArray[i].click();

                resolve(true);
            }, 1500);
        });

    }
    console.log("!!! takip butonları tıklandı, tekrar başlatılacak.");
    startFollowingOperation();
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

function simulateClick(element){
    trigger(element, 'mousedown' );
    trigger(element, 'click' );
    trigger(element, 'mouseup' );

    function trigger( elem, event ) {
      elem.dispatchEvent( new MouseEvent(event));
    }
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