// ==UserScript==
// @name         Aria石墨ASS工具
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Aria吧 ASS
// @author       You
// @match        https://shimo.im/tables/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shimo.im
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448591/Aria%E7%9F%B3%E5%A2%A8ASS%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/448591/Aria%E7%9F%B3%E5%A2%A8ASS%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

function addStyle() {
    let css = `
    .ariaAudio2 {
        border: 3px solid red;
        font-size: 20px;
        padding: 5px 10px;
        border-radius : 10px;
    }
    `
    GM_addStyle(css)
}

function waitForKeyElements(
    selectorTxt,
    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction,
    /* Required: The code to run when elements are
                           found. It is passed a jNode to the matched
                           element.
                       */
    bWaitOnce,
    /* Optional: If false, will continue to scan for
                      new elements even after the first match is
                      found.
                  */
    iframeSelector
    /* Optional: If set, identifies the iframe to
                          search.
                      */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents()
        .find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each(function() {
            var jThis = $(this);
            var alreadyFound = jThis.data('alreadyFound') || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction(jThis);
                if (cancelFound)
                    btargetsFound = false;
                else
                    jThis.data('alreadyFound', true);
            }
        });
    } else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval(timeControl);
        delete controlObj[controlKey]
    } else {
        //--- Set a timer, if needed.
        if (!timeControl) {
            timeControl = setInterval(function() {
                    waitForKeyElements(selectorTxt,
                        actionFunction,
                        bWaitOnce,
                        iframeSelector
                    );
                },
                300
            );
            controlObj[controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}


const audioDict = {
    "AriaBene_014": "https://tcdn.aquamizunashi.site/newBeneBD/00014_audio.ogg",
    "AriaBene_015": "https://tcdn.aquamizunashi.site/newBeneBD/00015_audio.ogg",
    "AriaBene_016": "https://tcdn.aquamizunashi.site/newBeneBD/00016_audio.ogg",
    "AriaBene_017": "https://tcdn.aquamizunashi.site/newBeneBD/00017_audio.ogg",
    "AriaBene_020": "https://tcdn.aquamizunashi.site/newBeneBD/00020_audio.ogg",
}

function createHTML() {
    let logo = document.querySelector("#file-header-title-input")
    let logoParent = logo.parentElement.parentElement;

    let logoAllParent = logoParent.parentElement
    $(logoAllParent).find(".ariaAudio").remove();
    $(logoAllParent).find(".ariaAudio2").remove();

    // 创建一个自己的结构
    let example = document.createElement("div")
        // 给 example 这个 div 设置类名
    example.classList.add("wrap")
    example.classList.add("ariaAudio")

    let isNew = logo.value.startsWith('AriaBene_')
    if (isNew) {
        example.innerHTML = `<audio controls preload="auto" id="testPlayer" src="${audioDict[logo.value]}">
        </audio>`
    } else {
        example.innerHTML = `<audio controls preload="auto" id="testPlayer" src="https://tcdn.aquamizunashi.site/.%20.%20.ARIA%20The%20BENEDIZIONE_audio_index0.ogg">
        </audio>`
    }
    logoAllParent.appendChild(example)

    if (!isNew) {
        let outVideo = document.createElement("div")
        outVideo.classList.add("ariaAudio2")
        outVideo.innerHTML = `<a href="https://tcdn.aquamizunashi.site/TestPlayer/testPlayMusic.html" target="_blank">预览视频字幕效果</a>`

        logoAllParent.appendChild(outVideo)
    }
}

function OnPlayBack(e) {
    // console.log(`play ${audioE.currentTime}`)
    if (audioE.currentTime >= window.testPlayendTime) {
        console.log(`play end [${window.playStartSec}],[${window.testPlayendTime}]`)
        audioE.pause();
        audioE.removeEventListener("timeupdate", OnPlayBack)
    }
}

function parseAssTime(timeStr) {
    if (typeof(timeStr) != 'string') {
        return 0;
    }

    // 0:15:23.04
    let timeElements = timeStr.split(/[:.]/);

    let hour = Number(timeElements[0]);
    let minutes = Number(timeElements[1]);
    let seconds = Number(timeElements[2]);
    let milliseconds = Number(timeElements[3]);

    let smallSeconds = milliseconds * 1.0 / 100;

    return hour * 3600 + minutes * 60 + seconds + smallSeconds;
}

function DelayRefreshBtn() {
    setTimeout(function() {
        console.log('refresh now buttons');
        findAvailableLine();
    }, 100);
}

function PlayMusicInternal(start, end, speed) {
    window.testPlayendTime = parseAssTime(end);
    window.playStartSec = parseAssTime(start);

    console.log(`play start [${start}] to [${end}], [${window.playStartSec}],[${window.testPlayendTime}]`)
    audioE.playbackRate = (speed <= 0 || speed > 2) ? 1 : speed;
    audioE.play();

    audioE.currentTime = window.playStartSec;
    audioE.removeEventListener("timeupdate", OnPlayBack)
    audioE.addEventListener("timeupdate",
        OnPlayBack
    );

    //DelayRefreshBtn();
}

function PlayMusic(start, end) {
    PlayMusicInternal(start, end, 1);
}

function PlaySlow(start, end) {
    PlayMusicInternal(start, end, 0.5);
}

function MusicPause() {
    let audioE = document.getElementById("testPlayer");
    audioE.pause();

    //DelayRefreshBtn();
}

function AddLineButton(curLine) {
    let time1 = curLine.find(".cell.field-1").find("div.inner").first();
    let time2 = curLine.find(".cell.field-2").find("div.inner").first();
    let jap = curLine.find(".cell.field-4").find("div.inner").first();
    let number = curLine.find(".cell.field-3").find("div.inner").first();

    //console.log(`line [${number.text()}], time1:[${time1.text()}], time2:[${time2.text()}], jap:[${jap.text()}]`);
    //console.log(`line [${number.text()}], time1:[${time1.text()}]`);

    time1.parent().append(
        `
                <div class="yinAll" style="position: absolute;z-index: 3;top: 50%;left: 50%;margin: 0 auto;">
                    <button onclick="window.PlayMusic('${time1.text()}', '${time2.text()}')">播放</button>
                    <button onclick="window.PlaySlow('${time1.text()}', '${time2.text()}')">慢放</button>
                    <button onclick="window.MusicPause()">暂停</button>
                </div>
                `
    );
}

function CheckAndAddLineButton(element) {
    let curLine = $(element);
    if (curLine.find(".yinAll").length > 0) {
        return;
    }
    AddLineButton(curLine);
}


function ProcessSingleLine(element) {
    let curLine = $(element);
    curLine.find(".yinAll").remove();
    AddLineButton(curLine);
}

function findSpecifiedLine(targetGUID) {
    let allEle = $(".grid-view.grid-view-top.grid-view-right").first();

    let targetLine = null;
    allEle.find(".record-item.record-item-parent").each(
        function(idx, element) {
            if ($(element).find(".cell.field-1").size() > 0) {
                let curLine = $(element);
                let guid = curLine.attr("data-record-guid");

                if (targetGUID == guid) {
                    targetLine = curLine;
                    return false;
                }
            }
        }
    );
    return targetLine;
}

function findAvailableLine() {
    let allEle = $(".grid-view.grid-view-top.grid-view-right").first();

    allEle.find(".record-item.record-item-parent").each(
        function(idx, element) {
            if ($(element).find(".cell.field-1").size() > 0) {
                ProcessSingleLine(element);
            }
        }
    );
}

function OnListContentChanged(mutation) {
    findAvailableLine();
    //let line1 = $(target).find(".record-item.record-item-parent").first();
    //let number = line1.find(".cell.field-3").first().children("div");
    //let jap = line1.find(".cell.field-4").first().children("div");
    //
    //console.log(`changed, ${line1.attr("data-record-guid")}, [${number.text()}], [${jap.text()}]`);
}

function addWatchForChanged() {
    // Select the target node.
    var target = document.querySelector(".grid-view.grid-view-top.grid-view-right")

    // Create an observer instance.
    var observer = new MutationObserver(OnListContentChanged);

    // Pass in the target node, as well as the observer options.
    observer.observe(target, {
        childList: true
    });
}


function TickCheckLines() {
    let allEle = $(".grid-view.grid-view-top.grid-view-right").first();

    allEle.find(".record-item.record-item-parent").each(
        function(idx, element) {
            if ($(element).find(".cell.field-1").size() > 0) {
                CheckAndAddLineButton(element);
            }
        }
    );
}

function clearInterProcessor() {
    document.removeEventListener('keydown', OnkeyEvent);
    if (window.assCheckerAria != null && window.assCheckerAria != undefined) {
        console.log("clear button checker");
        clearInterval(window.assCheckerAria);
        window.assCheckerAria = null;
    }
}

function addIntervalProcessor() {
    clearInterProcessor();
    window.assCheckerAria = setInterval(TickCheckLines, 1000);

    document.addEventListener('keydown', OnkeyEvent);
    console.log("restore button checker");
}

function OnkeyEvent(e) {
    if (e.key == "F2") {
        let line = $('.record-item.record-item-parent.active').get(1);
        if (line != undefined && line != null) {
            console.log(`按下快捷键，准备自动播放`)
            let curLine = $(line);
            let time1 = curLine.find(".cell.field-1").find("div.inner").first();
            let time2 = curLine.find(".cell.field-2").find("div.inner").first();

            PlayMusic(time1.text(), time2.text());
        }
    }
}

function realStaff() {

    (function(window) { // and more arguments if you need it

        console.log(window); // here, should be the real 'window'
        window.PlayMusic = PlayMusic;
        window.PlaySlow = PlaySlow;
        window.MusicPause = MusicPause;
    })(window.unsafeWindow);


    // 1. 添加音频
    createHTML();

    // 2. 初始化音频
    window.audioE = document.getElementById("testPlayer");
    window.audioE.load();
    window.audioE.oncanplaythrough = (event) => {
        console.log('I think I can play through the entire ' +
            'video without ever having to stop to buffer.');
    };

    // 3. 初始化添加按钮
    findAvailableLine();

    // 4. 观测滚动
    addWatchForChanged();

    // 周期监听
    addIntervalProcessor();

    CheckBackGround();
}

function CheckBackGround() {
    document.addEventListener("visibilitychange", function() {
        var string = document.visibilityState
        console.log(string)
        if (string === 'hidden') { // 当页面由前端运行在后端时，出发此代码
            clearInterProcessor();
            console.log('我被隐藏了')
        }
        if (string === 'visible') { // 当页面由隐藏至显示时
            addIntervalProcessor();
            console.log('欢迎回来')
        }
    });
}

(function() {
    'use strict';
    addStyle();
    waitForKeyElements(".grid-view.grid-view-top.grid-view-right", realStaff);

})();