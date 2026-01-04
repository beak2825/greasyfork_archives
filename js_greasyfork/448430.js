// ==UserScript==
// @name         Campo1innovator
// @namespace    http://fau.de/
// @version      0.1
// @description  Keep track on how much time you waste while waiting for campo
// @author       Bernhard Heinloth
// @source       https://gitlab.cs.fau.de/heinloth/1innovator
// @license      GNU AGPL v3
// @match        *://campo.fau.de/*
// @match        *://campo.fau.eu/*
// @match        *://campo.uni-erlangen.de/*
// @match        *://untrusted-campo.fau.de/*
// @match        *://www.campo.fau.de/*
// @match        *://www.campo.fau.eu/*
// @match        *://www.campo.uni-erlangen.de/*
// @match        *://hio-front-prod1.zuv.uni-erlangen.de/*
// @match        *://campus.fau.de/*
// @match        *://campus.uni-erlangen.de/*
// @match        *://www.campus.fau.de/*
// @match        *://www.campus.uni-erlangen.de/*
// @icon         https://www.fau.de/wp-content/themes/FAU-Einrichtungen/img/socialmedia/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448430/Campo1innovator.user.js
// @updateURL https://update.greasyfork.org/scripts/448430/Campo1innovator.meta.js
// ==/UserScript==
var campoTimer = {
    storageLabelStart: 'campoTimerStart',
    storageLabelTotal: 'campoTimerTotal',
    facts: {
        10: "läuft Usain Bolt 100-Meter",
        30: "hättest du dir auch einen TV Werbespot anschauen können",
        56: "beschwert sich Harry auf Youtube darüber, dass Charlie in seinen Finger gebissen hat",
        60: "werden 15 Billyregale für IKEA produziert",
        206: "läuft Hicham El Guerrouj 1500 Meter",
        222: "kann man Los del Rios Macarena durchtanzen",
        355: "hat Queen sein Publikum mit Bohemian Rhapsody beglückt",
        420: "kocht man Hartweizennudeln „Al dente“",
        500: "reist das Licht von der Sonne zur Erde",
        600: "wird eine Tiefkühlpizza im Ofen fertig",
        755: "läuft Joshua Cheptegei 5km",
        1269: "wird Elden Ring (von Speedrunnern) durchgezockt",
        1320: "hätte man auch eine Folge Futurama sehen können",
        1571: "läuft Joshua Cheptegei 10km",
        1628: "wird Half-Life (von Speedrunnern) durchgezockt",
        2580: "reist das Licht von der Sonne zum Jupiter",
        4800: "reist das Licht von der Sonne zum Saturn",
        4877: "wird Super Mario World (von Speedrunnern) durchgezockt",
        7299: "läuft Eliud Kipchoge einen Marathon (42,195 km)",
        10140: "ist Bilbo Beutlin an des Ende des",
        15000: "reist das Licht von der Sonne zum Neptun",
        43560: "kann man einmal komplett die Extended Edition von Herr der Ringe anschauen",
        228600: "kann man sich durch Game of Thrones durchbingen"
    },
    timer: null,
    total: 0,
    overlay: document.createElement('div'),
    refresh: function() {
        var value = localStorage.getItem(campoTimer.storageLabelTotal);
        if (!Number.isNaN(value) && value > campoTimer.total){
            campoTimer.total = parseInt(value);
        }
        return campoTimer.total;
    },
    stop: function() {
        // stop timer
        if (campoTimer.timer != null){
            clearInterval(campoTimer.timer);
            campoTimer.timer = null;
        }
        // hide overlay
        campoTimer.overlay.style.height = "0%";
        // increment total
        var start = sessionStorage.getItem(campoTimer.storageLabelStart);
        if (start > 0) {
            var delta = new Date().getTime() - start;
            if (delta > 0 && delta < 600000) {
                campoTimer.refresh();
                campoTimer.total += delta;
                localStorage.setItem(campoTimer.storageLabelTotal, campoTimer.total);
            } else {
                console.error("Load time delta with invalid range: " + delta);
            }
        }
        sessionStorage.setItem(campoTimer.storageLabelStart, 0);
    },
    showHelper: function(element, value, factor, limit) {
        if (value >= factor * limit) {
            var v = Math.floor(value / factor);
            if (element) {
                element.firstChild.innerHTML = v;
                element.style.position = "relative";
                element.style.visibility = "visible";
            }
            return value - v * factor;
        } else {
            if (element) {
                element.style.position = "absolute";
                element.style.visibility = "hidden";
            }
            return value;
        }
    },
    show: function() {
        // get start time (if available)
        var start = sessionStorage.getItem(campoTimer.storageLabelStart);
        var now = new Date().getTime();
        if (start <= now) {
            // calculate current total
            var current = now - start + campoTimer.total;
            // check facts
            var elFact = document.getElementById('campoTimerFact');
            if (elFact) {
                var matching = Object.keys(campoTimer.facts).filter(function(value){
                    const factTime = 10; // Anzeigezeit in Sekunden
                    return value <= current / 1000 && value > current / 1000 - factTime;
                });
                if (matching.length > 0) {
                    elFact.innerHTML = 'Während deiner Wartezeit ' + campoTimer.facts[matching.pop()];
                    elFact.style.visibility = "visible";
                } else {
                    elFact.style.visibility = "hidden";
                }
            }
            // show timer
            const secs = 1000;
            const mins = 60 * secs;
            const hours = 60 * mins;
            const days = 24 * hours;
            current = campoTimer.showHelper(document.getElementById('campoTimerDays'), current, days, 2)
            current = campoTimer.showHelper(document.getElementById('campoTimerHours'), current, hours, 2)
            current = campoTimer.showHelper(document.getElementById('campoTimerMins'), current, mins, 2)
            current = campoTimer.showHelper(document.getElementById('campoTimerSecs'), current, secs, 0)
        } else {
            // no valid start time -> stop
            console.error("Timer without valid start time: " + start);
            campoTimer.stop();
        }
    },
    start: function() {
        // set start time
        sessionStorage.setItem(campoTimer.storageLabelStart, new Date().getTime());
        // refresh cached total value (in case multiple tabs are used)
        campoTimer.refresh();
        // refresh every second
        campoTimer.timer = setInterval(campoTimer.show, 1000 );
        // show timer now
        campoTimer.show();
        // show overlay
        campoTimer.overlay.style.height = "100%";
    },
    registerJsf: function(){
        // Listen for ajax events
        if (typeof jsf != "undefined") {
            jsf.ajax.addOnEvent(function(data) {
                switch (data.status) {
                    case 'begin':
                        campoTimer.start();
                        break;
                    case "complete":
                    case "success":
                        campoTimer.stop();
                        break;
                }
            });
            jsf.ajax.addOnError(function() {
                campoTimer.stop();
            });
        } else {
            setTimeout(campoTimer.registerJsf, 250);
        }
    },
    init: function() {
        campoTimer.overlay.style.height = "0%";
        campoTimer.overlay.style.width = "100%";
        campoTimer.overlay.style.position = "fixed";
        campoTimer.overlay.style.zIndex = "1";
        campoTimer.overlay.style.top = "0";
        campoTimer.overlay.style.left = "0";
        campoTimer.overlay.style.backgroundColor = "rgba(0,0,0, 0.3)";
        campoTimer.overlay.style.overflowX = "hidden";
        campoTimer.overlay.innerHTML = `<!-- Campo Timer Overlay -->
             <div style="position: relative; top: 25%; width: 100%; height: 100%; text-align: center; margin-top: 30px; color: #bbb;">
              <div style="height: 400px; width: 400px; margin:auto; position: relative; border-radius:200px; border: 3px solid #bbb; background-color:rgba(0,0,0, 0.8)">
               <div style="margin: 0; position: absolute; top: 20%; left: 50%; transform: translate(-50%, 0px); font-size: 14px; text-align: center; width: 70%; font-style: italic;">Nur beim <tt>#1innovator</tt>!</div>
               <div style="margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 28px; text-align: center; width: 90%;">
                Du wartest bereits
                <br>
                <span id="campoTimerDays"><span style="font-size:130%; vertical-align: baseline;">0</span>&nbsp;Tage</span>
                <span id="campoTimerHours"><span style="font-size:130%; vertical-align: baseline;">0</span>&nbsp;Stunden</span>
                <span id="campoTimerMins"><span style="font-size:130%; vertical-align: baseline;">0</span>&nbsp;Minuten</span>
                <span id="campoTimerSecs"><span style="font-size:130%; vertical-align: baseline;">0</span>&nbsp;Sekunden</span>
                <br>
                auf FAU Campo…
               </div>
               <div style="margin: 0; position: absolute; bottom: 13%; left: 50%; transform: translate(-50%, 0); width:70%; font-size:14px;" id="campoTimerFact">&nbsp;</div>
              </div>
             </div>`;
                // add overlay to page
        document.body.insertBefore(campoTimer.overlay, document.body.firstChild);
        // stop any running timer
        campoTimer.stop();
        // cache total value
        campoTimer.refresh();
        // Add Timer start/stop events
        (addEventListener || attachEvent).call(window, addEventListener ? "beforeunload" : "onbeforeunload", campoTimer.start);
        (addEventListener || attachEvent).call(window, addEventListener ? "abort" : "onabort", campoTimer.stop);
        // Register for ajax events
        campoTimer.registerJsf();
    }
};
if (document.readyState === "complete") {
    campoTimer.init();
} else {
    (addEventListener || attachEvent).call(window, addEventListener ? "load" : "onload", campoTimer.init);
}