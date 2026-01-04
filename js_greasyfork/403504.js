// ==UserScript==
// @name         Gladiatus: Auction house notification tool
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Scipio
// @include      *s*-*.gladiatus.gameforge.com/game/index.php?mod=auction*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403504/Gladiatus%3A%20Auction%20house%20notification%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/403504/Gladiatus%3A%20Auction%20house%20notification%20tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const shortStr = "short";
    const keyShort = "time_short"
    const veryShortStr = "very short";
    const keyVeryShort = "time_very_short"
    const timeExpires = 90;

    const timeShort = null;
    const timeVeryShort = null;
    let statusAuction = document.querySelector(".description_span_right b").innerHTML.toLowerCase();

    function main() {
        let timeRefresh = getCookie('time_refresh');
        let cookieShortTime = getCookie(keyShort);
        let cookieVeryShortTime = getCookie(keyVeryShort);

        let containerElement = document.querySelector("#content article");

        let titleElement = document.createElement("h2");
        titleElement.setAttribute("class", "section-header");
        titleElement.innerHTML="Time auction";

        let contentElement = document.createElement("section");
        contentElement.style.display="block";
        contentElement.style.textAlign = "left";

        if (statusAuction !== shortStr && statusAuction !== veryShortStr) {
            if (cookieShortTime) {
                eraseCookie(keyShort);
                cookieShortTime = null;
            }

            if (cookieVeryShortTime) {
                eraseCookie(keyVeryShort);
                cookieVeryShortTime = null;
            }
        }

        if (statusAuction === shortStr) {
            if (!cookieShortTime) {
                setCookie(keyShort, getCurrentTime(), timeExpires);
                location.reload();
            }
        } else if (statusAuction === veryShortStr) {
            new Audio('https://freesound.org/data/previews/91/91926_7037-lq.mp3').play();
            new Audio('https://freesound.org/data/previews/91/91926_7037-lq.mp3').play();
            if (!cookieVeryShortTime) {
                setCookie(keyVeryShort, getCurrentTime(), timeExpires);
                location.reload();
            }
        }

        let content = "<b>Your current time:</b> <span id='my-timer'></span>" + "</br>";

        if (cookieShortTime) {
            content += "<b>Short: </b>" + cookieShortTime + "(<span id='diff-short-time'></span>)" +"</br>";
        }

        if (cookieVeryShortTime) {
            content += "<b>Very Short: </b>" + cookieVeryShortTime + "(<span id='diff-very-short-time'></span>)" + "</br>";
        }

        content += "<p><b>Time refresh:</b><span id='container_time_refrest'></span> minutes</p>"

        contentElement.innerHTML = content;
        containerElement.appendChild(titleElement);
        containerElement.appendChild(contentElement);

        let refreshTimeSelectElement = createSelectTimeRefresh();
        document.getElementById("container_time_refrest").appendChild(refreshTimeSelectElement);

        let myVar = setInterval(myTimer ,1000);

        if (timeRefresh) {
            refresh(parseInt(timeRefresh));
        } else {
            refresh(1);
        }
    }

    function getCurrentTime() {
        var currentdate = new Date();
        var month = currentdate.getUTCMonth() + 1; //months from 1-12
        var day = currentdate.getUTCDate();
        var year = currentdate.getUTCFullYear();
        var h = currentdate.getHours();
        var m = currentdate.getMinutes();
        var s = currentdate.getSeconds();

        return year + "/" + month + "/" + day + " " + h + ":" + m + ":" + s;
    }

    function getDiffMinutes(a, b) {
        var diff = Math.abs(a - b);
        return Math.floor((diff/1000)/60);
    }

    function refresh(time) {
        if (time !== 0) {
            setTimeout(function() { location.reload(); }, time * 60 * 1000);
        }
    }

    function setCookie(cname, cvalue, minutes) {
        var d = new Date();
        d.setTime(d.getTime() + (minutes*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        // This function will attempt to remove a cookie from all paths.
        var pathBits = location.pathname.split('/');
        var pathCurrent = ' path=';

        // do a simple pathless delete first.
        document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';

        for (var i = 0; i < pathBits.length; i++) {
            pathCurrent += ((pathCurrent.substr(-1) != '/') ? '/' : '') + pathBits[i];
            document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;' + pathCurrent + ';';
        }
    }

    function diffMinutest(a, b) {
        var diff = Math.abs(new Date(a) - new Date(b));
        var minutes = Math.floor((diff/1000)/60);
        var second = diff/1000%60

        return {
            minutes: minutes,
            second: second
        };
    }

    function myTimer() {
        document.getElementById("my-timer").innerHTML = getCurrentTime();
        let cookieShortTime = getCookie(keyShort);
        let cookieVeryShortTime = getCookie(keyVeryShort);

        if (cookieShortTime && !cookieVeryShortTime) {
            let diffObj = diffMinutest(getCurrentTime(), cookieShortTime);

            document.getElementById("diff-short-time").innerHTML = diffObj.minutes + " minutes, " + diffObj.second + " second";
        }

        if (cookieVeryShortTime) {
            let diffObj = diffMinutest(getCurrentTime(), cookieVeryShortTime);
            document.getElementById("diff-very-short-time").innerHTML = diffObj.minutes + " minutes, " + diffObj.second + " second";
        }
    }

    function createSelectTimeRefresh() {
        var refreshTimeSelect = document.createElement('select');
        refreshTimeSelect.id = 'refresh_time';

        for (let i = 0; i < 6; i++) {
            let selectedString = '';
            let timeRefresh = getCookie('time_refresh');
            let textOpt = i !== 0 ? i : 'None';

            refreshTimeSelect.options[i] = new Option(textOpt, i);

            if (!timeRefresh && i === 1) {
                refreshTimeSelect.options[1].selected = 'selected';
            } else if (parseInt(timeRefresh) === i) {
                refreshTimeSelect.options[i].selected = 'selected';
            }
        }

        refreshTimeSelect.addEventListener(
            'change',
            function() {
                var value = this.value;
                setCookie('time_refresh', value, 999999);
                location.reload();
            },
            false
        );

        return refreshTimeSelect;
    }

    main();
})();