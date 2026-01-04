// ==UserScript==
// @name         Takepoint.io - anti-kick script
// @namespace    http://tampermonkey.net/
// @version      1
// @description  made for marliskilla :) works by pausing the render loop while making a captcha token, putting less load on the cpu/gpu and thus resulting in higher captcha scores.
// @author       You
// @match        https://takepoint.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=takepoint.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442906/Takepointio%20-%20anti-kick%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/442906/Takepointio%20-%20anti-kick%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var loadLoop = setInterval(() => {
        if(ASM_CONSTS) {
            ASM_CONSTS[38092] = function($0) {
                grecaptcha.ready(function() {
                    Browser.mainLoop.pause()
                    setTimeout(() => { //give the client time to finish whatever it was doing last frame
                        grecaptcha.execute("6LcA3gsaAAAAAI-hzo7vC9uApeFk4SpfMKKTRAPs", {
                            action: "connect"
                        }).then(function(token) {
                            var msg = "v," + token;
                            var ptr = Module._malloc(msg.length);
                            Module.stringToUTF8(msg, ptr, msg.length * 4);
                            sockets[$0].send(HEAP8.subarray(ptr, ptr + msg.length));
                            Module._free(ptr);
                            Browser.mainLoop.resume()
                        });
                    }, 33);
                });
            }
            clearInterval(loadLoop)
        }
    }, 20)
})();