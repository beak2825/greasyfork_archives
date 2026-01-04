// ==UserScript==
// @author        Odd
// @description   Automatically refreshes and attempts to steal from the Snowager or wake up the Turmaculus.
// @grant         GM.xmlHttpRequest
// @grant         GM_xmlhttpRequest
// @include       http://www.neopets.com/medieval/turmaculus.phtml*
// @include       http://www.neopets.com/winter/snowager.phtml
// @include       http://www.neopets.com/winter/snowager2.phtml
// @name          Asleep/Awake Auto-Visitor
// @namespace     Odd@Clraik
// @version       1.2
// @downloadURL https://update.greasyfork.org/scripts/381837/AsleepAwake%20Auto-Visitor.user.js
// @updateURL https://update.greasyfork.org/scripts/381837/AsleepAwake%20Auto-Visitor.meta.js
// ==/UserScript==

var DeadlyDiceWaitMax = 900000; //15 minutes
var DeadlyDiceWaitMin = 600000; //10 minutes
var DelayMax = 2500;
var DelayMin = 1500;
var SnowagerStealWaitMax = 300000; //5 minutes
var SnowagerStealWaitMin = 60000; //1 minute
var SnowagerTimes = [6, 14, 22];
var StopOnAvatar = true;
var TriesMax = 3;
var TurmaculusWakeUpWaitMax = 300000; //5 minutes
var TurmaculusWakeUpWaitMin = 150000; //2.5 minutes

(function () {

    function convertDateFromNst(date) { return new Date((date.getTime() + 28800000) - (Math.max(new Date(date.getFullYear(), 0, 1).getTimezoneOffset(), new Date(date.getFullYear(), 6, 1).getTimezoneOffset()) * 60000)); }

    function convertDateToNst(date) { return new Date((date.getTime() + (Math.max(new Date(date.getFullYear(), 0, 1).getTimezoneOffset(), new Date(date.getFullYear(), 6, 1).getTimezoneOffset()) * 60000)) - 28800000); }

    function getStoredValue(key, defaultValue) {

        var value = localStorage.getItem(key);

        if (value != null) {

            if (typeof value == "string") {

                try { return JSON.parse(value); }
                catch (ex) { }
            }

            return value;
        }

        return defaultValue;
    }

    function setStoredValue(key, value) {

        if (value == null || value === undefined) localStorage.removeItem(key);
        else {

            if (typeof value != "number" && typeof value != "string") value = JSON.stringify(value);

            localStorage.setItem(key, value);
        }
    }

    if (typeof $ == "undefined") $ = unsafeWindow.$;

    if (typeof GM_xmlhttpRequest == "undefined") GM_xmlhttpRequest = GM.xmlHttpRequest;

    switch (location.pathname.match(/\/(.*)$/)[1].toLowerCase()) {

        case "medieval/turmaculus.phtml": {

            var parameters = {};

            (function () { var match, regex = /([^\&\=\?]+)\=([^\&]*)/g; while (match = regex.exec(location.search)) parameters[match[1]] = match[2]; })();

            if (parameters.type == "end") {

                var awoken = ($(".content").text().match(/awok/i) != null);

                if (!awoken || !StopOnAvatar || !$(".content").text().match(/avatar/i)) {

                    setTimeout
                    (

                        function () { location.href = "http://www.neopets.com/medieval/turmaculus.phtml"; },
                        (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin)
                    );
                }
            }
            else {

                var form;
                var status = $("img[src*='medieval/turmaculus']").after("<b style=\"display: block; margin-top: 16px;\"></b>")
                    .next();
                var time = new Date();
                var timeNext = new Date(getStoredValue("asleepAwake.turmaculusTime", new Date(time.getTime() - 60000).toString()));
                var tries = TriesMax;

                function awakenAndGetNextTime() {

                    GM_xmlhttpRequest({

                        method: "GET",
                        onabort: awakenAndGetNextTime_onError,
                        onerror: awakenAndGetNextTime_onError,
                        onload: function (response) {

                            for (var hour, hours, i = 0, j, match, time = convertDateToNst(new Date()), timeNext = null; (i < 5 && !timeNext); i++, time = new Date(time.getFullYear(), time.getMonth(), (time.getDate() + 1))) {

                                match = time.toString()
                                    .match(/^(\w+)\x20+(\w+)\x20+(\d+)\x20+(\d+)/i);

                                if (match = new RegExp((match[1] + "\\,\\x20+" + match[2] + "\\x20+" + match[3].replace(/^0+/, "") + "[a-z]*\\x20+" + match[4] + "\\:\\x20+(\\d+\\x20*[ap]m)(?:\\x20+or\\x20+(\\d+\\x20*pm))?\\x20+nst(?:\\s*<i[^<]*<\\/i>\\s*<br[^>]*>\\s*or\\x20+(\\d+\\x20*[ap]m)(?:\\x20+or\\x20+(\\d+\\x20*pm))?\\x20+nst)?"), "i")
                                    .exec(response.responseText)) {

                                    for (hours = [], j = 1; j < match.length; j++) {

                                        if (hour = parseInt(match[j])) {

                                            if (match[j].match(/\x20*pm$/i)) hour += 12;
                                            else if (hour == 12) hour = 0;

                                            hours.push(hour);
                                        }
                                    }

                                    hours.sort(function (a, b) { return (a - b); });

                                    for (j = 0; (j < hours.length && !timeNext); j++)
                                        if (time < (timeNext = new Date(time.getFullYear(), time.getMonth(), time.getDate(), hours[j]))) timeNext = new Date(timeNext.getTime() + (Math.round(Math.random() * (TurmaculusWakeUpWaitMax - TurmaculusWakeUpWaitMin)) + TurmaculusWakeUpWaitMin));
                                        else timeNext = null;
                                }
                            }

                            if (timeNext) {

                                setStoredValue("asleepAwake.turmaculusTime", (timeNext = convertDateFromNst(timeNext)));

                                if (form) {

                                    form.active_pet.value = $(".sidebarHeader > a[href*='quickref.phtml'] > b").text();
                                    form.wakeup.value = "1";

                                    setTimeout
                                    (

                                        function () { form.submit(); },
                                        (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin)
                                    );
                                }
                                else {

                                    setTimeout
                                    (

                                        function () { location.href = "http://www.neopets.com/medieval/turmaculus.phtml"; },
                                        (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin)
                                    );
                                }

                                return;
                            }

                            status.html("Oops! Could not determine the next time the Turmaculus will be awake!");
                        },
                        timeout: 60000,
                        ontimeout: awakenAndGetNextTime_onError,
                        url: "http://www.neopets.com/~brownhownd"
                    });
                }

                function awakenAndGetNextTime_onError() {

                    if (tries) {

                        tries--;

                        setTimeout(awakenAndGetNextTime, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));
                    }
                    else {

                        status.html("Oops! Couldn't retrieve the next time the Turmaculus will be awake after " + TriesMax + " tries!");
                    }
                }

                if (time > new Date(timeNext.getFullYear(), timeNext.getMonth(), timeNext.getDate(), (timeNext.getHours() + 1))) {

                    status.html("Missed 'em! Finding next awake time...");

                    awakenAndGetNextTime();
                }
                else {

                    function status_onTick() {

                        if (status && timeNext) {

                            time = new Date();
                            var timeRemaining = Math.max((((timeNext.getTime() - time.getTime()) / 1000) % 86400), 0);
                            var writer = [];

                            if (form) {

                                writer.push("Trying to awaken");
                            }
                            else {

                                writer.push("Refreshing");
                            }

                            if (timeRemaining) {

                                var hours = Math.floor(timeRemaining / 3600);
                                var minutes = Math.floor((timeRemaining % 3600) / 60);
                                var seconds = Math.floor((timeRemaining % 3600) % 60);

                                writer.push(" in ");

                                writer.push(hours + ":");

                                if (minutes < 10) writer.push("0");

                                writer.push(minutes + ":");

                                if (seconds < 10) writer.push("0");

                                writer.push(seconds);
                            }
                            else {

                                writer.push("...");
                            }

                            status.html(writer.join(""));

                            if (time >= timeNext) {

                                if (intervalID) {

                                    clearInterval(intervalID);

                                    intervalID = null;
                                }

                                status = null;

                                awakenAndGetNextTime();
                            }
                        }
                    }

                    form = $("form[action='process_turmaculus.phtml']")[0];
                    var intervalID = setInterval(status_onTick, 1000);

                    status_onTick();
                }
            }

            break;
        }
        case "winter/snowager.phtml": {

            var time = new Date();
            var timeNext = new Date(getStoredValue("asleepAwake.snowagerTime", new Date(new Date().getTime() - 60000).toString()));

            if (time >= timeNext) {

                var steal = $("a[href='snowager2.phtml']")[0];

                for (var i = 0, j; time >= timeNext; i++) {

                    for (j = 0; (j < SnowagerTimes.length && time >= timeNext); j++) {

                        timeNext = new Date
                        (

                            new Date(time.getFullYear(), time.getMonth(), (i + time.getDate())).getTime() +
                            //((SnowagerTimes[j] - 1) * 3600000) +
                            (SnowagerTimes[j] * 3600000) +
                            (Math.round(Math.random() * (SnowagerStealWaitMax - SnowagerStealWaitMin)) + SnowagerStealWaitMin)
                        );
                    }
                }

                setStoredValue("asleepAwake.snowagerTime", timeNext);

                if (steal) {

                    setTimeout(function () { steal.click(); }, (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin));

                    break;
                }
            }
            
            var nc = unsafeWindow.nc;
            var status = $("div[style*='winter/snowager']").after("<b style=\"display: block;\">Loading...</b><div style=\"margin: 6px 0 16px;\">Or you could <a href=\"snowager2.phtml\">try stealing now</a>...</div>")
                .next();

            unsafeWindow.nc = function () {

                nc();

                if (status) {

                    var time = new Date();
                    var timeRemaining = Math.max((((timeNext.getTime() - time.getTime()) / 1000) % 86400), 0);
                    var writer = [];

                    if (timeRemaining) {

                        var hours = Math.floor(timeRemaining / 3600);
                        var minutes = Math.floor((timeRemaining % 3600) / 60);
                        var seconds = Math.floor((timeRemaining % 3600) % 60);

                        writer.push("Waiting to steal in ");

                        writer.push(hours + ":");

                        if (minutes < 10) writer.push("0");

                        writer.push(minutes + ":");

                        if (seconds < 10) writer.push("0");

                        writer.push(seconds);
                    }
                    else {

                        writer.push("Refreshing...");
                    }

                    status.html(writer.join(""));

                    if (time >= timeNext) {

                        status = null;

                        setTimeout
                        (

                            function () { location.href = "http://www.neopets.com/winter/snowager.phtml"; },
                            (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin)
                        );
                    }
                }
            };

            break;
        }
        case "winter/snowager2.phtml": {

            if (!StopOnAvatar || !$(".content").text().match(/avatar/i)) {

                setTimeout
                (

                    function () { location.href = "http://www.neopets.com/winter/snowager.phtml"; },
                    (Math.round(Math.random() * (DelayMax - DelayMin)) + DelayMin)
                );
            }

            break;
        }
    }
})();