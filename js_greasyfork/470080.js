// ==UserScript==
// @name         Ekşi - Takip edilen temizleyici - Ana modül (#1)
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Takip edilen kişilerden pasif olanları unfollow eder. -> !! Ekşi - Takip edilen temizleyici - Gerekli modül (#2) [Unfollow edici modül] ile beraber çalışır. !!
// @author       angusyus
// @include      https://eksisozluk*.com/biri/*
// @include      https://eksisozluk*.com/takip/*

// @license MIT
/*jshint esversion: 10 */
// @downloadURL https://update.greasyfork.org/scripts/470080/Ek%C5%9Fi%20-%20Takip%20edilen%20temizleyici%20-%20Ana%20mod%C3%BCl%20%281%29.user.js
// @updateURL https://update.greasyfork.org/scripts/470080/Ek%C5%9Fi%20-%20Takip%20edilen%20temizleyici%20-%20Ana%20mod%C3%BCl%20%281%29.meta.js
// ==/UserScript==

const DATE_KEY = 'startPassiveCleanRecordingDate';
const AUTHOR_KEY = 'cleaningYazarName';
const BUTTON_ID = 'cleaning-button';
const BUTTON_NAME = "Takipleri Temizle";
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
            console.log("!!! LETS RECORD !!! ");
            startCleaningOps();
        }

    }, 2000);

    //Buton ekleme

    const buttonTab = document.getElementsByClassName("sub-title-menu profile-buttons")[0];

    if(buttonTab != null) {
        buttonTab.appendChild(createButton(BUTTON_ID, BUTTON_NAME));
        document.querySelector("#"+BUTTON_ID).addEventListener("click", onCleanButtonClick);
    }
})();


function onCleanButtonClick(zEvent) {
    alert("Temizlik başlıyor");

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

async function startCleaningOps() {
    var followingNicks = await getFollowingNicks();
    console.log("!!!+ followings: (" + followingNicks.length + ")" + followingNicks);
    console.log("!!!+ Links are ready. Checking activity now started.");

    for (var i = 0; i < followingNicks.length; i++) {
        var nick = followingNicks[i];

        if (localStorage.getItem(FOLLOWING_RECORD_KEY_NICK + nick)) {
            continue;
        }

        await visitURLs(nick);
    }

}

function visitURLs(nick) {
    var url = "https://eksisozluk1923.com/biri/" + nick;
    // Bu nicki kontrol etmek için localStorage a kaydet.
    localStorage.setItem(FOLLOWING_RECORD_KEY_NICK + nick, true);
    localStorage.setItem(FOLLOWING_RECORD_KEY_DATE + nick, new Date().getTime());

    var bb = document.createElement("a");
    bb.setAttribute("href","");
    bb.setAttribute("rel","opener");
    bb.setAttribute("onClick","window.open('"+url+"'); return false");
    bb.setAttribute("style","display: none;");
    console.log(bb);

    bb.click();

    console.log("!!! Link: " + url);

    return new Promise((resolve, reject) => {

        function visitPage() {

            console.log("!!! Operation for " + nick + " is now started.");

            window.addEventListener("focus", function(event)
            {
                console.log("!!! Visiting" + nick + " is probably finished, at:" + new Date());
                resolve();

            }, false);

            window.addEventListener("blur", function(event)
            {
                console.log("!!! " + nick + " is now visiting, at:" + new Date());

            }, false);


            }

        visitPage();
    });
}

async function getFollowingNicks() {

    return new Promise((resolve, reject) => {

        async function extractNicks() {
            await scrollToBottom();

            console.log("!!! Tüm takip/takipçiler tamamen yüklendi.");

            setTimeout(() => {
                //tüm kullanıcılar:
                //var followerNicks = document.querySelectorAll("#follows-nick ");

                // geri takip etmeyenler:
                var followerNicks = document.querySelectorAll("li[data-reverse-follow]:not([data-reverse-follow='true']) > a#follows-nick ");
                const followings = [];

                for (var i = 0; i < followerNicks.length; i++) {
                    var nickContainer = followerNicks[i];
                   followings.push(nickContainer.innerHTML);
                }

                resolve(followings);

            }, 1500);
        }

        extractNicks();
    });
}

function scrollToBottom() {

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