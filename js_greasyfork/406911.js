// ==UserScript==
// @name         cometeo桌面通知
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       colodes
// @match        http://www.cometeo.com/room/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406911/cometeo%E6%A1%8C%E9%9D%A2%E9%80%9A%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/406911/cometeo%E6%A1%8C%E9%9D%A2%E9%80%9A%E7%9F%A5.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
    Notification.requestPermission(function (status) {
        if (Notification.permission !== status) {
            Notification.permission = status;
        }
    });
});

let elementToObserve = document.querySelector('#comments');
let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (e) {
        let addedChats = e.addedNodes;
        var options = {
            silent: true
          }
        var n = new Notification(addedChats[0].innerText,options);
        n.onclick = function () {
            try {
                window.focus();
            }
            catch (ex) { };
        };
    });
});
const config = {
    //    attributes: true,
    childList: true,
    //    characterData: true,
    //    subtree: true
}

function background() {
    observer.observe(elementToObserve, config);
}

function handleVisibilityChange() {
    if (document.hidden) {
        background();
    } else {
        observer.disconnect();
    }
}

document.addEventListener("visibilitychange", handleVisibilityChange, false);