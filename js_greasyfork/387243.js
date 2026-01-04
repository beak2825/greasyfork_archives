// ==UserScript==
// @name           4chan(nel) fallback captcha
// @author         sanya_v_litvyak
// @version        0.1.1
// @description    fallback captcha for native extension
// @include        http://boards.4chan.org/*
// @include        https://boards.4chan.org/*
// @include        http://boards.4channel.org/*
// @include        https://boards.4channel.org/*
// @run-at         document-end
// @namespace https://greasyfork.org/users/173264
// @downloadURL https://update.greasyfork.org/scripts/387243/4chan%28nel%29%20fallback%20captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/387243/4chan%28nel%29%20fallback%20captcha.meta.js
// ==/UserScript==

// >>>>>>>>>>>>>>>>>>>>>>>>>>READ THIS OTHERWISE IT WON'T WORK<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// This will work only if scripts from google.com is blocked. (and for good reason)
// Add the following to ad blocker filter:
// ||www.google.com/recaptcha/api.js*$script,domain=boards.4channel.org|boards.4chan.org,important

(function() {
    'use strict';

    //ref https://pastebin.com/jYZUJKvb
    function fixCaptcha(){
        var url = "https://www.google.com/recaptcha/api/fallback?k=6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc&hl=en",
            answerBox = '<div style="border-style: none; bottom: 12px; left: 25px; margin: 0px; padding: 0px; right: 25px; background: #f9f9f9; border: 1px solid #c1c1c1; border-radius: 3px; height: 60px; width: 300px;"><textarea id="g-recaptcha-response" name="g-recaptcha-response" class="g-recaptcha-response" style="width: 200px; height: 40px; border: 1px solid #c1c1c1; margin: 10px 25px; padding: 0px; resize: none; "></textarea></div>';
        var iframe = document.createElement('iframe');
        var name = "#qrCaptchaContainer";
        //var name = "#g-recaptcha";
        document.querySelector(name).appendChild(iframe);
        document.querySelector(name + " iframe").setAttribute("src", url);
        document.querySelector(name + " iframe").height = "350px;";
        document.querySelector(name).setAttribute("style", "height: 350px;");
        document.querySelector(name).insertAdjacentHTML("beforeend", answerBox);
    }

    var bdNode = document.documentElement || document.body;
    var config = { childList: true, subtree: true };
    var callback = function(mutationsList, observer) {
        for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                for(var node of mutation.addedNodes) {
                    if (node.id == 'qr' || node.id == 'quickReply') {
                        fixCaptcha();
                    }
                }
            }
        }
    };
    var observer = new MutationObserver(callback);
    observer.observe(document, config);
})();
