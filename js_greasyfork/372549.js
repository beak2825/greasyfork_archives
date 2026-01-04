// ==UserScript==
// @name         youtube音樂自動播
// @namespace    http://www.y5works.com/
// @version      1.342
// @description  y5works.com專用音樂播放腳本
// @author       Cathy
// @match        www.youtube.com/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372549/youtube%E9%9F%B3%E6%A8%82%E8%87%AA%E5%8B%95%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/372549/youtube%E9%9F%B3%E6%A8%82%E8%87%AA%E5%8B%95%E6%92%AD.meta.js
// ==/UserScript==
var ttt="https://cathytools.web.fc2.com/youtube.js";

var user_set = {
    "start_time": 10,
    "end_time": 18
};
var sec = 1 * 60 * 1000; //分*秒*毫秒
var edct = {
    "timer": null,
    "restsec": sec
};

var nowDate = new Date();
var startDate = new Date();
var endDate = new Date();

var playbtn,
    pause_mesage,
    pause_event,
    ifPasued = false,
    eventCont = 2;


var myDOMEvent = new Promise((resolve, reject) => {
    var yfather = document.querySelector("ytd-app");
    yfather.id = "father_check_point";
    var yfather_e = new MutationObserver(function() {
        resolve(yfather_e);
    });
    yfather_e.observe(document.getElementById("father_check_point"), {
        'attributes': true,
        'attributeFilter': ['is-watch-page']
    });
});

myDOMEvent.then(function(yfather_e) {
    yfather_e.disconnect();
    let sh = startDate.setHours(user_set.start_time);
    let eh = endDate.setHours(user_set.end_time);
    /*edct.timer = setInterval(function() {
        all_day_check_timer(sh, eh);
    }, edct.restsec);*/
}).then(function() {
    document.querySelector("ytd-popup-container").id = "child_check_point";
    pause_mesage = document.getElementById("child_check_point");
    set_check_youtube_event();
});

var cont = 3;

function all_day_check_timer(sh, eh) {
    let nowTime = nowDate.getTime();

    if (ifPasued && sh < nowTime && nowTime < eh) {
        set_check_youtube_event();
        ifPasued = false;
    } else if (sh >= nowTime || nowTime >= eh) {
        if (ifPasued) {
        } else {
            pause_event.disconnect();
            ifPasued = true;
        }
    } else {
    };
}

function set_check_youtube_event(argument) {
    pause_event = new MutationObserver(event);
    var options = {
        'childList': true,
        'subtree': true
    };
    pause_event.observe(pause_mesage, options);
}

function event(data) {
    console.error("觸發事件啦");
    console.log("data", data);
    let playbtnEventCont;

    for (var i = 0; i < data.length; i++) {
        console.log("target", data[i].target);
        console.log("target.id", data[i].target.id);
        if (data[i].target.id == "confirm-button") {
            playbtn = document.querySelector("#confirm-button>a");
            console.log("a link",playbtn);
        }
        if (data[i].target.id == "scrollable") {
            console.log("paused",playbtn);
            playbtnEventCont = playbtn.getAttribute("data-eventCont");
            if (!playbtnEventCont) {
                playbtn.setAttribute("data-eventCont",1);
            };
            playbtnEventCont++;
            playbtn.setAttribute("data-eventCont",playbtnEventCont);
            playbtn.click();
        }
    };
    if (playbtnEventCont>eventCont) {
        location.reload();
    };
}