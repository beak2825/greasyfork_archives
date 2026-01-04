// ==UserScript==
// @name          Count Time
// @description   Count How much time would you pay
// @include       https://www.bilibili.com/video/*
// @version       0.0.1
// @author        sEGuoer
// @namespace https://greasyfork.org/users/1147321
// @downloadURL https://update.greasyfork.org/scripts/472819/Count%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/472819/Count%20Time.meta.js
// ==/UserScript==
let control = "start";
let controlInterval
window.addEventListener("keyup",function (e) {
    e.preventDefault();
    if (e.keyCode === 17){
        if (control === "start"){
            f();
            control = "stop"
            console.log("start")
        }else if(control === "stop"){
            clearInterval(controlInterval)
            control = "start"
            console.log("stop")
        }
    }
})


function f(){
    if (!document.querySelector(".video-episode-card__info-duration")) {
        if (!document.querySelector(".router-link-active .clickitem .duration")) {
        } else {
            heji(".router-link-active .duration", ".link-content img", ".bpx-player-ctrl-time-label .bpx-player-ctrl-time-current", "viewbox_report", "#multi_page .head-con .head-left")
        }
    } else {
        heji(".video-episode-card__info-duration", ".video-episode-card__info-title .cur-play-icon", ".bpx-player-ctrl-time-label .bpx-player-ctrl-time-current", "viewbox_report", ".first-line-left .cur-page")
    }
}


function heji(a, b, c, d, e) {
    controlInterval = setInterval(function () {
        hejiMethod(a, b, c, d, e)
    }, 2000)
}

hejiMethod(".video-episode-card__info-title .cur-play-icon", ".video-episode-card__info-title .cur-play-icon", ".bpx-player-ctrl-time-label .bpx-player-ctrl-time-current", "viewbox_report", ".first-line-left .cur-page")

function deleteCurrentTime(arg) {
    let deleteCurrentTime = 0
    if (arg.length === 3) {
        deleteCurrentTime = parseInt(arg[0]) * 3600 + parseInt(arg[1]) * 60 + parseInt(arg[2])
    } else if (arg.length === 2) {
        deleteCurrentTime = parseInt(arg[0]) * 60 + parseInt(arg[1])
    } else if (arg.length === 1) {
        deleteCurrentTime = parseInt(arg[0])
    }
    console.log(deleteCurrentTime)
    return deleteCurrentTime;
}

function addUseTime(String, Timename, addContent) {
    let element = document.createElement("div");
    element.innerText = String;
    element.className = Timename;
    element.style = "margin-right: 8px";
    console.log("div." + Timename)
    if (!document.querySelector("div." + Timename)) {
        addContent.appendChild(element)
    } else {
        document.querySelector("div." + Timename).innerText = String;
    }
}

function hejiMethod(act, bond, cat, dog, email) {
    var allTime = document.querySelectorAll(act)
    let time = 0
    let needtime = 0
    let selectWhichIsLooking = 0
    allTime.forEach(function (element) {
        let timeGroup = element.textContent.split(':')
        if (selectWhichIsLooking === 1) {
            if (timeGroup.length === 3) {
                let elementTime = parseInt(timeGroup[0]) * 3600 + parseInt(timeGroup[1]) * 60 + parseInt(timeGroup[2])
                time = time + elementTime
                needtime = needtime + elementTime

            } else if (timeGroup.length === 2) {
                let elementTime = parseInt(timeGroup[0]) * 60 + parseInt(timeGroup[1])
                time = time + elementTime
                needtime = needtime + elementTime
            } else if (timeGroup.length === 1) {
                let elementTime = parseInt(timeGroup[0])
                time = time + elementTime
                needtime = needtime + elementTime

            }
        } else if (selectWhichIsLooking === 0) {
            var a = element.parentElement.querySelector(bond)
            console.log(a.getAttribute("style"))
            if (a.getAttribute("style") === "display:none;" || a.getAttribute("style") === "display: none;") {
                if (timeGroup.length === 3) {
                    let elementTime = parseInt(timeGroup[0]) * 3600 + parseInt(timeGroup[1]) * 60 + parseInt(timeGroup[2])
                    time = time + elementTime

                } else if (timeGroup.length === 2) {
                    let elementTime = parseInt(timeGroup[0]) * 60 + parseInt(timeGroup[1])

                    time = time + elementTime
                } else if (timeGroup.length === 1) {
                    let elementTime = parseInt(timeGroup[0])
                    time = time + elementTime
                }
            } else {
                var b = document.querySelector(cat)
                let currentTimeGroup = b.textContent.split(':')
                selectWhichIsLooking = 1
                if (timeGroup.length === 3) {
                    let elementTime = parseInt(timeGroup[0]) * 3600 + parseInt(timeGroup[1]) * 60 + parseInt(timeGroup[2])
                    let deleteTime = deleteCurrentTime(currentTimeGroup)
                    time = time + elementTime
                    needtime = needtime + elementTime - deleteTime

                } else if (timeGroup.length === 2) {
                    let elementTime = parseInt(timeGroup[0]) * 60 + parseInt(timeGroup[1])
                    let deleteTime = deleteCurrentTime(currentTimeGroup)
                    time = time + elementTime
                    needtime = needtime + elementTime - deleteTime
                } else if (timeGroup.length === 1) {
                    let elementTime = parseInt(timeGroup[0])
                    let deleteTime = deleteCurrentTime(currentTimeGroup)
                    time = time + elementTime
                    needtime = needtime + elementTime - deleteTime
                }
            }
        }
    })
    console.log(time)
    let hour1 = parseInt(time / 3600)
    console.log(hour1)

    let minute1 = parseInt(time % 3600 / 60)
    console.log(minute1)

    let second1 = time % 3600 % 60
    console.log(second1)
    let addContent1 = document.getElementById(dog)
    addUseTime("看完合集用时" + hour1 + ":" + minute1 + ":" + second1, "sumTimeWillBeUse", addContent1)
    console.log(needtime)
    let hour2 = parseInt(needtime / 3600)
    console.log(hour2)

    let minute2 = parseInt(needtime % 3600 / 60)
    console.log(minute2)

    let second2 = needtime % 3600 % 60
    console.log(second2)
    let addContent2 = document.querySelector(email)
    addUseTime("看完剩余需" + hour2 + ":" + minute2 + ":" + second2, "remainTime", addContent2)
}

