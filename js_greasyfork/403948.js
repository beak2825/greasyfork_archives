// ==UserScript==
// @name         HDRezka autoplay
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  автопереключение серий. Выразить благодарность - qiwi +79058712310
// @author       CalypsoToolz
// @match        http://getkinopoisk.com/series/*
// @match        http://rezka.tv/series/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403948/HDRezka%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/403948/HDRezka%20autoplay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var mustClick = false;

    setInterval(function() {
        if(mustClick) {
            mustClick = false;
            var player = document.getElementById("cdnplayer");
            player.getElementsByTagName("pjsdiv")[12].click();
            return;
        }
        var ss = document.getElementsByTagName("pjsdiv");
        var index = 0;
        for(var i = 0; i < ss.length; i++) {
            if(ss[i].innerText.startsWith("/ ")) {
                index = i;
                break;
            }
        }
        var current = ss[index - 1].innerText;
        var max = ss[index].innerText.replace("/ ", "");

        if(max !== "0:00") {
            var cArr = current.split(":");
            var mArr = max.split(":");
            if(current === max || (cArr[0] == mArr[0] && cArr[1] == mArr[1] - 1) || (mArr[1] == 0 && cArr[1] == 59)) {
                console.log("current == max");
                var currEpisode = document.getElementsByClassName("b-simple_episode__item active")[0];
                if(currEpisode.nextElementSibling != null) {
                    currEpisode.nextElementSibling.click();
                    mustClick = true;
                }
            } else {
                console.log("current=" + current);
                console.log("max=" + max);
            }
        }
    }, 5000);
})();