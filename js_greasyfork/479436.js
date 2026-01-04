// ==UserScript==
// @name         Ajuster le panneau latéral Gmail
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto adjust Gmail left panel width. Activated by a double click on the left panel background.
// @author       Bacomino
// @match        https://mail.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479436/Ajuster%20le%20panneau%20lat%C3%A9ral%20Gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/479436/Ajuster%20le%20panneau%20lat%C3%A9ral%20Gmail.meta.js
// ==/UserScript==
const tamperIsOk = false
setTimeout(() => {

    document.querySelector("[jscontroller = 'nwtiKd']")
        .querySelector(".at9")
        .addEventListener("dblclick", function (e) {
        if (document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth != "max-content"){
            document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth = "max-content";
            document.querySelector("[jscontroller = 'nwtiKd']").style.width = "max-content";

            document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.maxWidth = "max-content";
            document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.width = "max-content";
        }else{
            document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth = "256px";
            document.querySelector("[jscontroller = 'nwtiKd']").style.width = "256px";

            document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.maxWidth = "256px";
            document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.width = "256px";
        }
        tamperIsOk = true;
    });


}, 2000);


setTimeout(() => {

    if (tamperIsOk == false) {
        document.querySelector("[jscontroller = 'nwtiKd']")
            .querySelector(".at9")
            .addEventListener("dblclick", function (e) {
            if (document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth != "max-content"){
                document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth = "max-content";
                document.querySelector("[jscontroller = 'nwtiKd']").style.width = "max-content";

                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.maxWidth = "max-content";
                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.width = "max-content";
            }else{
                document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth = "256px";
                document.querySelector("[jscontroller = 'nwtiKd']").style.width = "256px";

                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.maxWidth = "256px";
                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.width = "256px";
            }
        });
        tamperIsOk = true;
    }

}, 5000);


setTimeout(() => {

    if (tamperIsOk == false) {
        document.querySelector("[jscontroller = 'nwtiKd']")
            .querySelector(".at9")
            .addEventListener("dblclick", function (e) {
            if (document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth != "max-content"){
                document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth = "max-content";
                document.querySelector("[jscontroller = 'nwtiKd']").style.width = "max-content";

                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.maxWidth = "max-content";
                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.width = "max-content";
            }else{
                document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth = "256px";
                document.querySelector("[jscontroller = 'nwtiKd']").style.width = "256px";

                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.maxWidth = "256px";
                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.width = "256px";
            }
        });
        tamperIsOk = true;
    }

}, 7500);

setTimeout(() => {

    if (tamperIsOk == false) {
        document.querySelector("[jscontroller = 'nwtiKd']")
            .querySelector(".at9")
            .addEventListener("dblclick", function (e) {
            if (document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth != "max-content"){
                document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth = "max-content";
                document.querySelector("[jscontroller = 'nwtiKd']").style.width = "max-content";

                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.maxWidth = "max-content";
                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.width = "max-content";
            }else{
                document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth = "256px";
                document.querySelector("[jscontroller = 'nwtiKd']").style.width = "256px";

                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.maxWidth = "256px";
                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.width = "256px";
            }
        });
        tamperIsOk = true;
    }

}, 10000);

setTimeout(() => {

    if (tamperIsOk == false) {
        document.querySelector("[jscontroller = 'nwtiKd']")
            .querySelector(".at9")
            .addEventListener("dblclick", function (e) {
            if (document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth != "max-content"){
                document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth = "max-content";
                document.querySelector("[jscontroller = 'nwtiKd']").style.width = "max-content";

                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.maxWidth = "max-content";
                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.width = "max-content";
            }else{
                document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth = "256px";
                document.querySelector("[jscontroller = 'nwtiKd']").style.width = "256px";

                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.maxWidth = "256px";
                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.width = "256px";
            }
        });
        tamperIsOk = true;
    }

}, 15000);

setTimeout(() => {

    if (tamperIsOk == false) {
        document.querySelector("[jscontroller = 'nwtiKd']")
            .querySelector(".at9")
            .addEventListener("dblclick", function (e) {
            if (document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth != "max-content"){
                document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth = "max-content";
                document.querySelector("[jscontroller = 'nwtiKd']").style.width = "max-content";

                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.maxWidth = "max-content";
                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.width = "max-content";
            }else{
                document.querySelector("[jscontroller = 'nwtiKd']").style.minWidth = "256px";
                document.querySelector("[jscontroller = 'nwtiKd']").style.width = "256px";

                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.maxWidth = "256px";
                document.querySelector("[jscontroller = 'nwtiKd']").querySelector(".aBO").style.width = "256px";
            }
        });
        tamperIsOk = true;
    }

}, 20000);
