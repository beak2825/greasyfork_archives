// ==UserScript==
// @name         FB_Downloader
// @namespace    http://tampermonkey.net/
// @version      0.69
// @description  Facebook video downloader (2022)
// @author       a7a beh
// @match        https://*fdownloader.net/*
// @match        https://*.facebook.com/*
// @exclude      https://*.facebook.com/messages/*
// @exclude      https://*.facebook.com/stories/*
// @exclude      https://*.facebook.com/groupcall/*
// @icon         https://*.google.com/s2/favicons?sz=64&domain=fdownloader.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445355/FB_Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/445355/FB_Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...



    let paste = document.getElementById("paste");
    let send = document.querySelector(".btn-red");
    let download = document.querySelector(".button is-success is-small download-link-fb");
    let url = document.querySelector(".search__input");
    let fb = document.querySelector(".oajrlxb2 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys qt6c0cv9 i1ao9s8h esuyzwwr f1sip0of abiwlrkh p8dawk7l lzcic4wl bp9cbjyn e72ty7fz qlfml3jp inkptoze qmr60zad j83agx80 btwxx1t3 tv7at329 taijpn5t d1544ag0 tw6a2znq l9j0dhe7 k4urcfbm tdjehn4e");

    var button = document.createElement("Button");
    button.innerHTML = "Download";
    button.className = "a7a55";
    button.style = "top: 8px;left: 320px;position: absolute;z-index: 99999;padding: 10px;border-radius: 20px;outline: none;width: 110px;height: 38px;border: none;font-size: 15px;font-weight: 600;font-family: inherit; cursor: pointer; transition: 0.3s; ";
    document.body.appendChild(button);

    button.style.opacity = "0.15";


    button.onmouseover = function(){button.style.opacity = "1"};
    button.onmouseout = function(){button.style.opacity = "0.20"};


    function javascript_abort()
    {
        throw new Error('This is not an error. This is just to abort javascript');
    }

    button.addEventListener("click", function () {

        let text = (window.location.href)

        navigator.clipboard.writeText(text).then(function() {

        }, function(err) {
            console.error('Async: Could not copy text: ', err);
            alert("Something went wrong!")
            javascript_abort();
            return;
            function fuck() { }
        });


        setTimeout(fuck, 250);

        function fuck() {
            window.open("https://fdownloader.net/en")
        };


    });


    function tez () {
        document.querySelector(".btn-red").click()
    };

    window.addEventListener("load", function() {
        paste.click();
        url.focus();
        setTimeout(tez, 400);

        //Auto download and close

        setTimeout(function () {
            let quality_check = document.querySelector('[title="Download 720p (HD)"]')
            if (quality_check != null ) {
                if (quality_check.innerHTML == 'Download'){
                    document.querySelector('[title="Download 720p (HD)"]').click()
                    console.log('720p is available')
                };
            } else {
                document.querySelector('[title="Download 360p (SD)"]').click()
                console.log('720p is not available, downloading 360p')
            };
            setTimeout(function(){window.close()},1000);
        }, 2000);

    });






})();