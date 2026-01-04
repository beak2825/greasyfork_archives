// ==UserScript==
// @name         next chapter
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://weread.qq.com/web/reader/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399320/next%20chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/399320/next%20chapter.meta.js
// ==/UserScript==


window.pro_elt_addEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function () {
    if (!this.eventList) this.eventList = {};
    if (!this.eventList[arguments[0]]) this.eventList[arguments[0]] = [];
    this.eventList[arguments[0]].push(arguments[1]);
    window.pro_elt_addEventListener.apply(this, arguments);
};

setTimeout(() => {
    initScript();
}, 4000);

function initScript() {
    new Promise(resolve => {
        ["visibilitychange", "mouseleave"].forEach(item => {
            document.removeEventListener(item, document.eventList[item][0]);
            delete document.eventList[item];
            console.log("remove ", item);
        });
        resolve();
    }).then(() => {
        return new Promise(() => {
            startRead()
        })
    }).catch(err => {
        console.log(err);
        alert("初始化失败，请重新打开页面！")
    })
}

function startRead(changTime = 61000) {
    setInterval(() => {
        new Promise(resolve => {
            let curChapter = getCurrentChapter();
            let allChapter = getAllChapter();
            console.log("CurrentChaprer:", curChapter, "AllChaprer:", allChapter, new Date().toLocaleTimeString());
            if (curChapter === allChapter) {
                go2firstChapter();
            } else {
                simulatedClick('[class="readerFooter_button"]');
            }
        }).catch(err => {
            console.log(err);
        })
    }, changTime);
}

function getAllChapter(cssSelectorStr = ".readerControls_item") {
    return document.querySelectorAll(cssSelectorStr).length;
}

function getCurrentChapter(cssSelectorStr = ".chapterItem_current") {
    var el = document.querySelector(cssSelectorStr);
    var currentChaprer = [].indexOf.call(el.parentElement.children, el) + 1;
    return currentChaprer;
}

function go2firstChapter(catalogClass = ".catalog", chapterItemClass = ".chapterItem_level1") {
    new Promise(resolve => {
        simulatedClick(catalogClass);
        setTimeout(() => {
            resolve(chapterItemClass);
        }, 2000);
    }).then(className => {
        simulatedClick(className);
    }).catch(err => {
        console.log(err);
        console.log("返回首章错误，可尝试手动返回！！！！！！")

    });
}

function simulatedClick(cssSelectorStr) {
    document.querySelector(cssSelectorStr).dispatchEvent(new MouseEvent("click", {
        screenX: 2481,
        screenY: -180,
        clientX: 413,
        clientY: 797
    }));
    console.log("click: ", cssSelectorStr, new Date().toLocaleTimeString());
}
