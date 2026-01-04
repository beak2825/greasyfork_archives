// ==UserScript==
// @name         Wolvesville Helper-RedScorpion
// @author       RedScorpion
// @run-at       document-start
// @match        *://*.wolvesville.com/*
// @include      *://googleads.g.doubleclick.net/pagead/*
// @description  Group of scripts that make woolvesville easier
// @namespace    https://github.com/redscorpionx/wov-helper
// @homepageURL  https://github.com/redscorpionx/wov-helper
// @icon         https://i.ibb.co/8rKCTJQ/5f565bfe5ce3ee00048bd0de.png
// @license      GPL-3.0 License
// @version      1.6.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440666/Wolvesville%20Helper-RedScorpion.user.js
// @updateURL https://update.greasyfork.org/scripts/440666/Wolvesville%20Helper-RedScorpion.meta.js
// ==/UserScript==


console.log("Script started");
window.addEventListener('load', function () {
    console.log("script loaded");
    openPage();

    var newBtn = document.createElement("button");
    newBtn.id = "newBtnId";
    newBtn.style = "text-size-adjust: 100%; -webkit-tap-highlight-color: rgba(255, 255, 255, 0); pointer-events: auto;-webkit-box-direction: normal;-webkit-box-orient: vertical;border: 0px solid black;box-sizing: border-box;display: flex;flex-basis: auto;flex-direction: column;flex-shrink: 0; min-height: 0px;padding: 0px;position: relative;z-index: 0;border-radius: 6px;margin: 8px;-webkit-box-pack: center;justify-content: center;-webkit-box-align: center;align-items: center;user-select: none;cursor: pointer;touch-action: manipulation;background-color: rgba(0, 0, 0, 0.44);height: 50px;min-width: 50px;padding-left: 16px;padding-right: 16px;";
    newBtn.innerHTML = "<img src='https://i.ibb.co/bJ9pZC8/kisspng-digital-marketing-online-advertising-promotional-m-ad-icon-5b376e6d4125d9-188261301530359140.png' width = '50' height = '50'>";

    function appendBtn() {
        var topRow = document.getElementsByClassName("css-1dbjc4n r-1awozwy r-18u37iz r-o4qtl5 r-12vffkv r-13qz1uu r-1g40b8q")[2].childNodes[1];
        topRow.appendChild(newBtn);
    }

    var newBtn1 = document.createElement("button");
    newBtn1.id = "newBtnId";
    newBtn1.style = "text-size-adjust: 100%; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); pointer-events: auto;-webkit-box-direction: normal;-webkit-box-orient: vertical;border: 0px solid black;box-sizing: border-box;display: flex;flex-basis: auto;flex-direction: column;flex-shrink: 0; min-height: 0px;padding: 0px;position: relative;z-index: 0;border-radius: 6px;margin: 8px;-webkit-box-pack: center;justify-content: center;-webkit-box-align: center;align-items: center;user-select: none;cursor: pointer;touch-action: manipulation;background-color: rgba(0, 0, 0, 0.44);height: 50px;min-width: 50px;padding-left: 16px;padding-right: 16px;";
    newBtn1.innerHTML = "<img src='https://i.ibb.co/R2Lm2vC/Untitled-1.png' width = '50' height = '50'>";

    function appendBtn1() {
        var topRow = document.getElementsByClassName("css-1dbjc4n r-1awozwy r-18u37iz r-o4qtl5 r-12vffkv r-13qz1uu r-1g40b8q")[2].childNodes[1];
        topRow.appendChild(newBtn1);
    }

    var checkExist = setInterval(function () {

        var adBox = document.getElementById("ad_position_box");
        var arrow = document.getElementsByClassName("css-1dbjc4n r-1kihuf0 r-1mlwlqe r-1d2f490 r-1udh08x r-zchlnj").length;
        var ctBtn = document.getElementById("newBtnId");

        if (typeof (adBox) != 'undefined' && adBox != null) {
            //console.log("adbox found");

            var count_down_text = document.getElementById("count-down-text").innerHTML;
            var dismiss_button_element = document.getElementById("dismiss-button-element");
            //console.log(count_down_text);

            if (count_down_text == 'Reward in 1 seconds') {
                var timeOut = setTimeout(function () {
                    dismiss_button_element.click();
                }, 1000);
            }
        }

        if (arrow) {
            if (ctBtn == null) {
                appendBtn();
                appendBtn1();
            }
        }
    }, 1000);

    newBtn.onclick = function () {
        console.log("boom");
        watchBtn();
    };

    newBtn1.onclick = function () {
        console.log("boomer");
        window.open('https://www.paypal.com/donate?hosted_button_id=FM8WEPNHK5XAE');
        //watchBtn();
    };

    function watchBtn() {
        var checkExist = setInterval(function () {
            var watchVideoRI = document.getElementsByClassName("css-1dbjc4n r-1xfd6ze r-1loqt21 r-edyy15 r-1otgn73 r-lrvibr")[0].__reactResponderId;
            var watchVideo = document.getElementsByClassName("css-901oao r-1niwhzg r-1vr29t4 r-q4m81j")[0];

            if (typeof (watchVideoRI) != 'undefined' && watchVideoRI != null) {
                watchVideo.click();
                console.log("clicked watch/spin");

            } else {
                console.log('Watch Video Unclickable');
            }
        }, 1000);
    }


    //thanks to ThebestkillerTBK for the below function
    function openPage() {
        var orignalSetItem = localStorage.setItem;
        localStorage.setItem = function (k, v) {
            if (k == "open-page") {
                localStorage.removeItem(k);
                console.log("Tried to detect multi window, blocked");
                return;
            }
            orignalSetItem.apply(this, arguments);
        };
    }

});