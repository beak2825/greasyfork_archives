// ==UserScript==
// @name         Clog (Colourful Gamelog)
// @namespace    blaseball
// @version      1.5.2
// @description  adds styles to certain game events
// @author       Myno (with help from Clair and Quincognito)
// @match        https://blaseball.com/*
// @match        https://www.blaseball.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blaseball.com
// @downloadURL https://update.greasyfork.org/scripts/458787/Clog%20%28Colourful%20Gamelog%29.user.js
// @updateURL https://update.greasyfork.org/scripts/458787/Clog%20%28Colourful%20Gamelog%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const NAMESPACE = "Colourful Gamelog";
//text used to track clog events
    const events = {
        "incin":[" incinerates"],
        "alternate":["'s Alternate!"],
        "swear":[" swear"," Swear"], //ty clair!!
        "curse":[" curse"," Can't Lose"], //ty clair!!
        "favor":[" rules in", " favor"], //ty clair!!
        "rogue":["Rogue Umpire"],
        "mage":["Mage Umpire"],
        "knight":["Knight Umpire"],
        "bard":["Bard Umpire"],
        "crash":[" crashes into"],

        "end_of_top":["End of the top "],
        "end_of_bottom":["End of the bottom "],
        "out":["gets the out", "forced out", "fly out", "Fly out", " groundout", " Groundout", " out.", "makes the catch", "is right there to make the catch.", //ty quincognito!!
              " catch."," catch!"],
        "score":[" scores!"," hits a Home Run!"],
        "ball":["Ball,","Ball."," a walk."," a ball outside"],
        "walk":[" a walk."],
        "hustle":[" hustles "],
        "strike":["Strike,","Strike."," a strike."," strikes ","Foul ball.","Foul tip.", "Foul.", "curls out of play."],
        "new_batter":[" steps up to bat."],
        "single":[" a Single!"," a single!"],
        "double":[" a Double!"," a double!,  hustles all the way to second!"],
        "triple":[" a Triple!"," a triple!"," hustles all the way to third!"],
        "home_run":[" a Home Run!"],
        "drama":["..."]
    }
    //if this text appears, DO NOT treat this as an event
    // eg "can't make the catch..." messages will not be clog_out events even though they contain "catch."
    const ignore_events={
        "out":["catch..."]
    }
//default styling applied to .clog_[event] elements
//these styles can be overwritten by editing them here (not recommended) or creating a css userstyle to change .clog_score, .clog_incin etc etc
    const eventcss = {
        "score":"color: #ff9900; font-weight: 600;",
        "incin":"color: #6666ff; font-weight: 600;",
        "alternate":"color: #ff3333; font-weight: 600;",
        "swear":"color: #ccccee; font-weight: 600;", //ty clair!!
        "curse":"color: #ff9966; font-weight: 600;", //ty clair!!
        "drama":"font-style: italic;"
    }


    var css = "";
    for(let shortclass in eventcss){
        css+=`.clog_`+shortclass+` {`+eventcss[shortclass]+`} `
    }
    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    var nodeprocess = function(node){
        let eventhappen = {};
        if(node.classList && node.classList.contains("game-widget__log")){
            for(let listid in events){
                eventhappen[listid] = false;
                for(let phrase of events[listid]){
                    if(node.innerText.includes(phrase)){
                        node.classList.add("clog_"+listid);
                        eventhappen[listid] = listid;
                    }
                }
                if(!!ignore_events[listid]){
                    for(let phrase of ignore_events[listid]){
                        if(node.innerText.includes(phrase)){
                            if(node.classList.contains("clog_"+listid)){
                                node.classList.remove("clog_"+listid);
                            }
                            eventhappen[listid] = false;
                            break;
                        }
                    }
                }
                if(eventhappen[listid]!=listid && node.classList.contains("clog_"+listid)){
                    node.classList.remove("clog_"+listid)
                }
            }
        }
        console.log(eventhappen)
    };

    const callback = function(mutationsList, observer) {
        var logs = document.querySelectorAll(".game-widget__log");
        for(let log of logs){
            nodeprocess(log)
        }
    };

    if (document.hasOwnProperty("_BLASEBALL_USERSCRIPT_REGISTER")) {
        document._BLASEBALL_USERSCRIPT_REGISTER(NAMESPACE, callback, (mutations) => (document.querySelectorAll(".game-widget")));
    } else {
        const main = document.getElementsByTagName("body")[0];
        const config = { childList: true, subtree: true };
        const mutationCallback = function(mutationsList, observer) {
            callback(mutationsList);
            observer.disconnect();
            observer.observe(main, config);
        };

        const observer = new MutationObserver(mutationCallback);
        observer.observe(main, config);
    }
})();