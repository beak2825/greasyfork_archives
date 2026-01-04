// ==UserScript==
// @name         s0urce.io bot (keyboard hack with AI)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  S0urce.io bot for hacking
// @author       Firelop
// @match        http://s0urce.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391839/s0urceio%20bot%20%28keyboard%20hack%20with%20AI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/391839/s0urceio%20bot%20%28keyboard%20hack%20with%20AI%29.meta.js
// ==/UserScript==

(function() {
    if(window.ash47_pwnHook == null) {
        window.ash47_seenImages = window.ash47_seenImages || {};


        $('.tool-type-img').get()[0].onload = function() {
            window.ash47_pwnHook();
        }

        $('#tool-type-form').submit(function() {

            window.ash47_didSubmit();

            window.ash47_storeWord();
        });

        $('#tool-type-word').keyup(function() {
            window.ash47_storeWord();
        });

        window.addLibrary = function(loc) {
            var newScript = document.createElement('script');
            newScript.setAttribute('src', loc);
            document.head.appendChild(newScript);
        };

        window.addLibrary('https://cdn.rawgit.com/naptha/tesseract.js/1.0.10/dist/tesseract.js');
    }

    window.ash47_maxSubmitTime = 1000 * 1;
    window.ash47_bonusDelay = 100;

    window.exportBrain = function() {
        console.log('window.importBrain(\'' + JSON.stringify(window.ash47_seenImages) + '\');');
    };

    window.importBrain = function(newBrain, force) {
        try {
            var newSeenImages = JSON.parse(newBrain);

            for(var key in newSeenImages) {
                if(force || !window.ash47_seenImages[key]) {
                    window.ash47_seenImages[key] = newSeenImages[key];
                }
            }

            console.log('Any error, script are started correctly !');
        } catch(e) {
            console.log('An error as append ! restart the script');
        }
    };

    window.ash47_addline = function(txt) {
        var con = $('#cdm-text-container');
        
        con.append($('<div>', {
            text: txt
        }));

        con.scrollTop(con.prop('scrollHeight'));
    };
    window.ash47_storeWord = function() {
        var currentValue = $('#tool-type-word').val();
        var stringNumber = $('.tool-type-img').attr('src');

        if(currentValue.length > 0) {
            window.ash47_seenImages[stringNumber] = currentValue;
        }
    };

    window.ash47_canSubmit = function() {
        if(window.ash47_lastSubmission == null) return true;
        var now = new Date();
        var timeDifference = now - window.ash47_lastSubmission;
        return timeDifference > window.ash47_maxSubmitTime;
    };

    window.ash47_howLongLeft = function() {
        if(window.ash47_lastSubmission == null) return 0;
        var now = new Date();
        var timeDifference = now - window.ash47_lastSubmission;

        if(timeDifference > window.ash47_maxSubmitTime) {
            return window.ash47_bonusDelay;
        } else {
            return timeDifference + window.ash47_bonusDelay;
        }
    };

    window.ash47_doSubmit = function() {
        // Are we allowed to submit?
        if(window.ash47_canSubmit()) {
            // Do the submit
            $('#tool-type-form').submit();
            window.ash47_didSubmit();
        } else {
            setTimeout(function() {
                window.ash47_doSubmit();
            }, window.ash47_howLongLeft());
        }
    };

    window.ash47_didSubmit = function() {
        window.ash47_lastSubmission = new Date();
    };

    window.ash47_pwnHook = function() {
        var stringNumber = $('.tool-type-img').attr('src');
        if(window.ash47_seenImages[stringNumber]) {
            // Store the value
            $('#tool-type-word').val(window.ash47_seenImages[stringNumber]);
           window.ash47_doSubmit();
            return;
        }
        var ourImage = $('.tool-type-img').get()[0];
        Tesseract.recognize($('.tool-type-img').get()[0], {
            tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyz_23'
        })
            .then(function(result) {

                var res = result.text.trim().replace(/ /g, '');

                if(res.length > 0) {
                    // Log what we see
                    window.ash47_addline('I see: ' + res);

                    $('#tool-type-word').val(res);

                    window.ash47_storeWord();

                    window.ash47_doSubmit();
                }
            });
    };
})();