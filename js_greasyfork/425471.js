// ==UserScript==
// @name         哔哩哔哩长按加速
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  bilibili speedup
// @author       You
// @include      *.bilibili.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425471/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%95%BF%E6%8C%89%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/425471/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%95%BF%E6%8C%89%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    // console.log("？？？？？？？？？？？？？？？？");
    // document.οnkeydοwn = function (event) {
    //     console.log(event.which);
    // }

    // document.οnkeyup = function (event) {
    //     console.log(event);
    // }


    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e.keyCode == 48 && e.altKey) {
            // alert("你按下了alt 0");
            getVideo().playbackRate = 1;
        }

        if (e.keyCode == 49 && e.altKey) {
            // alert("你按下了alt 1");
            getVideo().playbackRate = 1.5;
        }

        if (e.keyCode == 50 && e.altKey) {
            // alert("你按下了alt 2");
            getVideo().playbackRate = 2;
        }

        if (e.keyCode == 51 && e.altKey) {
            // alert("你按下了alt 3");
            getVideo().playbackRate = 3;
        }

        if (e.keyCode == 52 && e.altKey) {
            // alert("你按下了alt 4");
            getVideo().playbackRate = 4;
        }

        if (e.keyCode == 53 && e.altKey) {
            // alert("你按下了alt 5");
            getVideo().playbackRate = 5;
        }
        if (e.keyCode == 54 && e.altKey) {
            // alert("你按下了alt 6");
            getVideo().playbackRate = 6;
        }
    };

    document.onkeyup = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e.keyCode == 48 && e.altKey) {
            // alert("你按下了alt 0");
            getVideo().playbackRate = 1;
        }

        if (e.keyCode == 49 && e.altKey) {
            // alert("你按下了alt 1");
            getVideo().playbackRate = 1;
        }

        if (e.keyCode == 50 && e.altKey) {
            // alert("你按下了alt 2");
            getVideo().playbackRate = 1;
        }

        if (e.keyCode == 51 && e.altKey) {
            // alert("你按下了alt 3");
            getVideo().playbackRate = 1;
        }

        if (e.keyCode == 52 && e.altKey) {
            // alert("你按下了alt 4");
            getVideo().playbackRate = 1;
        }

        if (e.keyCode == 53 && e.altKey) {
            // alert("你按下了alt 5");
            getVideo().playbackRate = 1;
        }
        if (e.keyCode == 54 && e.altKey) {
            // alert("你按下了alt 6");
            getVideo().playbackRate = 1;
        }
    };

    function getVideo() {
        return document.querySelector('video') || document.querySelector("bwp-video");
    }

})();