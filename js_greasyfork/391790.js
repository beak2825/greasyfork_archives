// ==UserScript==
// @name         LingQ
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  same site better UX
// @author       ibn_rushd
// @match        https://www.lingq.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/391790/LingQ.user.js
// @updateURL https://update.greasyfork.org/scripts/391790/LingQ.meta.js
// ==/UserScript==

GM_addStyle(`
.lessons-wrap .current-lesson {
    background: #f6f6f6;
    padding: 30px 10px !important;
    box-shadow: 0 5px 5px 0 #c3bfbf;
    margin: 0 0px 5px 0px;
}

.today-counter span {
    color: white;
    position: relative;
    height: 55px;
    line-height: 55px;
    z-index: 1;
}

.today-counter .btn_update {
    color: black;
    padding: 0 10px 0 10px;
    cursor: pointer;
    font-size: 25px;
    color: white;
    transform: rotate(154deg);
    transition: transform 800ms ease;
}

.btn_update:hover {
    transform: rotate(0deg);
    padding: 0 10px 0 10px;
    top: -1px;
}

.lessons-wrap {
    padding: 0px !important;
}

.lessons-wrap .lesson-item k
    padding: 10px !important;
}`);

//GLOBAL

var data = [];
var topbar = document.querySelector('.counters.nav');
var lang = window.location.pathname.split('/')[3];
var url = "https://www.lingq.com/api/v2/" + lang + "/milestones/";
var span_lingq;

function setLingqDailies() {
    var today_counter = document.createElement("li");
    today_counter.setAttribute('class','today-counter counter-item');
    var lingq_text = document.createElement("span");
    lingq_text.setAttribute('class','lingq_text');
    var btn_update = document.createElement("span");
    btn_update.setAttribute('class','btn_update');
    btn_update.innerHTML = "&#x21ba;";
    today_counter.appendChild(lingq_text);
    today_counter.appendChild(btn_update);
    topbar.appendChild(today_counter);
    span_lingq = document.querySelector('.today-counter.counter-item .lingq_text');
    btn_update = document.querySelector('.today-counter.counter-item .btn_update');
    btn_update.addEventListener('click', function() { updateDailyLingq() }, false);
    span_lingq.innerText = "?? Lingq's";
}

async function updateDailyLingq() {
    console.log("updateDailyLing");
    span_lingq.innerText = "Loading...";
    var response = await fetch(url).then(response => response.json())
    span_lingq.innerText = response.stats.lingqs_daily + " Lingq's";
}

function continueWithLastLessonInCourse() {
    console.log("connectTriggersToBlueWords");

    if (window.location.href.indexOf("course") != -1) {
        var lessons = document.querySelector('.lessons-wrap .lesson-list');
        if (lessons) {
            var lessons_items = document.querySelector('.lessons-wrap .lesson-list .lesson-item');
            var total_completed = document.querySelectorAll('.completed').length;
            var current_lesson = lessons.childNodes[total_completed];
            lessons.insertBefore(current_lesson, lessons.firstChild);
            //change css
            lessons.firstChild.classList.add("current-lesson");
        }
    }
}

addEventListener('load', function () {
    //1a. (beta) add total lingq in top bar
    setLingqDailies();

    //1b. (beta) update daily lingq when loaded.
    updateDailyLingq();

    //1c. (broken) update btn for daily lingq

    //2. (beta) make sure the last course you did before completing is the first one in the course list.
    continueWithLastLessonInCourse();

    //3. (alpha) hover translate translates
    if (window.location.href.indexOf("chunk") != -1) {
        var sentence_btn = document.querySelector(".sentence-size");
        if(sentence_btn.classList.contains("active")) {
            console.log("sentence mode");
            var translate_btn = document.querySelector(".lesson .loadedContent .btn");
            translate_btn.addEventListener("mouseover", function () {
                translate_btn.click();
            });
        }
    }

});
