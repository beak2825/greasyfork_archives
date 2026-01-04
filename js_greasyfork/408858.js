// ==UserScript==
// @name         coursera Interactive Transcript modifier
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  a coursera Interactive Transcript modifier
// @match        https://www.coursera.org/learn/*
// @grant        none
// @home-url https://greasyfork.org/en/scripts/408858-cousera-interactive-transcript-modifier
// @homepageURL https://greasyfork.org/en/scripts/408858-cousera-interactive-transcript-modifier
// @author LiAlbert
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/408858/coursera%20Interactive%20Transcript%20modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/408858/coursera%20Interactive%20Transcript%20modifier.meta.js
// ==/UserScript==
var flag = 0


function changeSub() {
    if (flag == 0) {
        var activePhrase = document.querySelector('.rc-Phrase.active');
        if (activePhrase) {
            document.querySelector('.rc-Transcript').style.display = 'none';
            var header = document.querySelector(".rc-ItemHeader");
            if(header) header.parentElement.removeChild(header);

            document.querySelector('.ItemPageLayout_container').style.top = 0;
            document.querySelector('.ItemPageLayout_container').style.height = "100%";

            var div = document.createElement('div');
            div.id = 'currentsub'
            if (activePhrase) div.textContent = activePhrase.textContent
            var video = document.querySelector('.video-container');
            if (video == null) {
                video = document.querySelector('.video-main-player-container');
                document.querySelector('.video-name').style.display = 'none';
            }
            video.parentElement.insertBefore(div, video.nextSibling);

            div.style.textAlign = "center";
            div.style.fontSize = "40px";
            div.style.marginTop = "10px";
            div.style.lineHeight = "41px";
            div.style.height = "82px";
            div.style.fontFamily = "Times New Roman";
            div.style.fontWeight = "bold";
            var player = document.querySelector('video');
            div.onmouseover = function () {
                player.pause();
                div.onmouseout = function () { player.play(); };
            };
            div.onmouseout = function () { player.play(); };
            div.onclick = function () {
                var text = window.getSelection().toString();
                navigator.clipboard.writeText(text).then(function () {
                    console.log('Async: Copying ' + text + ' to clipboard was successful!');
                }, function (err) {
                    console.error('Async: Could not copy text: ', err);
                });
                div.onmouseout = function () { };
            };

            player.onkeypress = function (event) {
                var x = event.keyCode;
                if (x == 37) { player.pause(); player.currentTime = player.currentTime - 0.1; player.play(); }
                if (x == 39) { player.pause(); player.currentTime = player.currentTime + 0.1; player.play(); }
            }
            flag = 1;
        }
    }
    else {
        div = document.getElementById('currentsub');
        if (div) {
            if(div.textContent !== document.querySelector('.rc-Phrase.active').textContent)
            {
                div.textContent = document.querySelector('.rc-Phrase.active').textContent;
                if (document.querySelector('.rc-Transcript').style.display != 'none') document.querySelector('.rc-Transcript').style.display = 'none';
            }
        }
        else { flag = 0; }

    }

}
setInterval(changeSub, 30);
