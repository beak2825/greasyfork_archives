// ==UserScript==
// @name         TypingClub layout switcher
// @namespace    Winand
// @version      25.0
// @description  Auto-switch keyboard layouts on TypingClub website
// @homepageURL  https://github.com/Winand/tc_layoutswitcher
// @author       Winand
// @license      MIT
// @match        https://www.typingclub.com/*
// @match        https://www.edclub.com/sportal/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/418196/TypingClub%20layout%20switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/418196/TypingClub%20layout%20switcher.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const url_api = window.location.origin + "/api/v1.1/";
    const url_student = url_api + "student/";
    const url_tokens = window.location.origin + "/auth/refresh_tokens/";
    const url_program = url_api + "program2/"; // e.g. https://www.edclub.com/api/v1.1/program2/3/?edclub=true&_=1239959050370
    const url_program_page = (program_id) => `${window.location.origin}/sportal/program-${program_id}.game`; //https://stackoverflow.com/a/75611091
    // in case there's no saved layout and current program doesn't define one either
    const default_layout = "en,british-pc";

    var token; // authorization token is needed to change layout
    var student_id; // current user numeric id
    var program_id; // current program numeric id
    var program_kbd; // keyboard layout defined in current program
    var keyboard; // current layout
    var keyboard_pending; // layout is being set

    (function(open, send) {
        // https://stackoverflow.com/a/56499250
        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = window.location.origin + url
            this.addEventListener("load", function() {
                var url = this.responseURL;
                if(url == url_tokens && this.status == 200) {
                    if(this.responseText) {
                        const resp = JSON.parse(this.responseText)[0];
                        token = resp.token;
                        console.log("TOKEN REFRESHED", token);
                    } else console.log("TOKEN NOT REFRESHED");
                } else if(url.startsWith(url_program) && !url.includes("/game/") && this.status == 200) {
                    const resp = JSON.parse(this.responseText);
                    program_id = resp.id;
                    console.log("LESSON PLANS LOADED FOR PROGRAM", program_id);
                    program_kbd = resp.keyboard == null ? default_layout : resp.keyboard;
                    var target_kbd = GM_getValue("lang." + program_id);
                    if(target_kbd == undefined) {
                        // set program's default layout
                        GM_setValue("lang." + program_id, program_kbd);
                        target_kbd = program_kbd;
                    }
                    console.log("PROGRAM KBD", program_kbd, "CURRENT", keyboard, "TARGET", target_kbd);
                    if(target_kbd !== keyboard) {
                        console.log("SWITCH TO", target_kbd, "TOKEN", token);

                        fetch(url_student + student_id + "/", {
                            method: 'POST',
                            body: '{"keyboard":"' + target_kbd + '"}',
                            headers: {
                                'authorization': 'Token ' + token,
                                'Content-type': 'application/json',
                                'x-http-method-override': 'PATCH'
                            }
                        }).then(response => {
                            if(response.status == 202) {
                                //https://stackoverflow.com/q/1226714#comment60232404_1226718
                                window.location = url_program_page(program_id)
                            } else console.log("SWITCH FAILED WITH STATUS", response.status);
                        });
                    }
                } else if(url.startsWith(url_student + "me/") && this.status == 200) {
                    const resp = JSON.parse(this.responseText);
                    student_id = resp.id;
                    keyboard = resp.keyboard;
                } else if(url == url_student + student_id + "/" && keyboard_pending !== undefined) {
                    if(this.status == 202) {
                        keyboard = keyboard_pending;
                        GM_setValue("lang." + program_id, keyboard);
                        console.log("MANUAL SWITCH TO", keyboard, "FOR PROGRAM", program_id);
                    } else console.log("MANUAL SWITCH FROM", keyboard, "TO", keyboard_pending, "FOR PROGRAM", program_id, "FAILED");
                }
            }, false);
            open.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function(body) {
            if(this._url == url_student + student_id + "/") {
                // FIXME: 'keyboard' may be undefined if other property is being changed
                keyboard_pending = JSON.parse(body).keyboard || keyboard_pending;
            }
            send.apply(this, arguments);
        };

        if("prototype" in send) {
            console.log("LOADED TOO LATE, TRYING TO REFRESH TOKEN");
            var poll_timer = setInterval(() => {
                if(!token) {
                    console.log("RESTART...");
                    start(); // TypingClub entry point
                } else clearTimeout(poll_timer);
            }, 1000);
        };
    })(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);
})();
