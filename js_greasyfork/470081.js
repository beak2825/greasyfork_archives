// ==UserScript==
// @name         Ekşi - Takip edilen temizleyici - Gerekli modül (#2) [Unfollow edici modül]
// @namespace    http://tampermonkey.net/
// @version      2
// @description  "Son entry gün hesapla ve duruma göre unfollow et." Çaylak ve yazarlar için ayrı ayrı gün belirleyip, bu günden fazla süredir entry yazmayanları unfollow et. -> !! Çalışması için Ekşi - Takip edilen temizleyici - Ana modül (#1)in yüklenmesi gerekli !!
// @author       angusyus
// @include      https://eksisozluk*.com/biri/*

// @license MIT
/*jshint esversion: 10 */
// @downloadURL https://update.greasyfork.org/scripts/470081/Ek%C5%9Fi%20-%20Takip%20edilen%20temizleyici%20-%20Gerekli%20mod%C3%BCl%20%282%29%20%5BUnfollow%20edici%20mod%C3%BCl%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/470081/Ek%C5%9Fi%20-%20Takip%20edilen%20temizleyici%20-%20Gerekli%20mod%C3%BCl%20%282%29%20%5BUnfollow%20edici%20mod%C3%BCl%5D.meta.js
// ==/UserScript==

const YAZAR_DAY_LIMIT = 40;
const CAYLAK_DAY_LIMIT = 15;
const FOLLOWING_RECORD_KEY_NICK = "cleanCheckNick_";
const FOLLOWING_RECORD_KEY_DATE = "cleanCheckDate_";
const UNFOLLOWED_USER = "unfollowed bsc inactivity: ";

console.log("!!!! SCRIPT START " + new Date());
window.addEventListener('load', function() {

    console.log("!!!! PAGE LOAD: " + new Date());

    setTimeout(() => {
        mainFunc();
    }, 2000);
})

function mainFunc() {
    console.log("!!!! MAIN FUNC CALLED " + new Date());
    var isCaylak = false;
    var dayLimit = YAZAR_DAY_LIMIT;

    try {
        isCaylak = document.querySelector("#user-text-badges > li > a").innerText == "çaylak";
    } catch {}

    console.log("Çaylak mı ? : " + isCaylak);

    if (isCaylak) {
        dayLimit = CAYLAK_DAY_LIMIT;
    }

    var lastEntryDayPass = calculateDays();
    var isUserPassive = lastEntryDayPass > dayLimit;

    var yazarName = getYazarName();

    var yazarStorageKeyNick = FOLLOWING_RECORD_KEY_NICK + yazarName;
    var yazarStorageKeyDate = FOLLOWING_RECORD_KEY_DATE + yazarName;

    var date = localStorage.getItem(yazarStorageKeyDate);
    var currentDate = new Date().getTime();
    const dateDiffer = currentDate - date;

    console.log("!!!! old date: " + date);
    console.log("!!!! current date: " + currentDate);
    console.log("!!!! date differ: " + dateDiffer);

    var isUnfollowCheck = localStorage.getItem(yazarStorageKeyNick) && (dateDiffer < 10000);

    if (isUserPassive) {
        console.log("!!!! THE USER IS PASSIVE");
    }

    if (isUnfollowCheck) {
        console.log("!!!! Unfollow etmek üzere kontrol yapılıyor");
        var unfollowButton = document.querySelector("a.relation-link");
        var isFollowing = unfollowButton.innerText == "takip ediliyor";

        if (isFollowing && isUserPassive) {
            document.getElementsByClassName("dark-theme theme-disabled")[0].style.setProperty('background-color', '#FF0000', 'important');
            console.log("!!!! " + yazarName + "will be UNFOLLOWED.");
            unfollowButton.click();

            setTimeout(() => {
                document.getElementById("confirm-remove-relation").click();
                localStorage.setItem(UNFOLLOWED_USER + yazarName, new Date());
				// yazar nicki unfollow edildiğini belirtmek için false olarak setlenir.
                localStorage.setItem(yazarStorageKeyNick, false);

            }, 500);
        }

        setTimeout(() => {
            window.close();
        }, 1000);

    } else {
        console.log("!!!! Unfollow kontrolü yapılmayacak !");
    }
}

function calculateDays() {
    const date_diff = (date1, date2) => Math.ceil(Math.abs(date1 - date2)/86400000);

    var topics = document.getElementsByClassName("entry-date permalink");

    if (topics.length == 0) {
     return DAY_LIMIT +1 ;
    }

    var isHavePinnedEntry = document.getElementsByClassName("pinned-icon-container").length > 0;

    var idx = 0;

    if (isHavePinnedEntry) {
        idx = 1;
    }

    var rawDate = topics[idx].innerText;
    var lastDate = "";

    if (rawDate.startsWith("#")){
        lastDate = rawDate.substring(11, 21);
    } else {
        lastDate = rawDate.substring(0, 10);
    }

    var lastEntryDayPass = date_diff(new Date(), parseDate(lastDate)) - 1;

    console.log("!!!! Last entry date: " + lastDate);
    console.log("!!!! " + lastEntryDayPass + " days past.");
    return lastEntryDayPass;
}

function parseDate(dateString) {
    //dd.mm.yyyy, or dd.mm.yy
    var dateArr = dateString.split(".");
    if (dateArr.length == 1) {
        return null; //wrong format
    }
    //parse time after the year - separated by space
    var spacePos = dateArr[2].indexOf(" ");
    if(spacePos > 1) {
        var timeString = dateArr[2].substr(spacePos + 1);
        var timeArr = timeString.split(":");
        dateArr[2] = dateArr[2].substr(0, spacePos);
        if (timeArr.length == 2) {
            //minutes only
            return new Date(parseInt(dateArr[2]), parseInt(dateArr[1]-1), parseInt(dateArr[0]), parseInt(timeArr[0]), parseInt(timeArr[1]));
        } else {
            //including seconds
            return new Date(parseInt(dateArr[2]), parseInt(dateArr[1]-1), parseInt(dateArr[0]), parseInt(timeArr[0]), parseInt(timeArr[1]), parseInt(timeArr[2]));
        }
    } else {
        //gotcha at months - January is at 0, not 1 as one would expect
        return new Date(parseInt(dateArr[2]), parseInt(dateArr[1] - 1), parseInt(dateArr[0]));
    }
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