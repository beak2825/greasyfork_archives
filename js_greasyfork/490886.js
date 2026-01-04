// ==UserScript==
// @name         MyImprov Driving Class
// @namespace    http://tampermonkey.net/
// @date         2024-03-26
// @version      1.0.0
// @description  Cause aint no body got time fo dat.
// @author       Unconcerned Citizen
// @match        https://course.myimprov.com/private/course/chapter.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myimprov.com
// @license      WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490886/MyImprov%20Driving%20Class.user.js
// @updateURL https://update.greasyfork.org/scripts/490886/MyImprov%20Driving%20Class.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.addEventListener('load', function() {
        Array.prototype.forEach.call(document.getElementsByClassName("sectiontest"), test => {
            var factor = parseInt(atob(test.getAttributeNode('data-factor').value));

            Array.prototype.forEach.call(test.getElementsByClassName("question"), question => {
                var check = question.getAttributeNode("data-check").value;
                var found = false;

                if(check % factor == 0) {
                    var correct = check / factor;

                    Array.prototype.forEach.call(question.getElementsByTagName("input"), answer => {
                        if(parseInt(answer.value) == correct) {
                            if(!found) {
                                found = true;
                                answer.checked = true;
                            } else {
                                window.alert("Too many answers!");
                                throw new Error("Too many answers!");
                            }
                        }
                    });
                } else {
                    window.alert("Unable to calculate answer!");
                    throw new Error("Unable to calculate answer!");
                }
            });

            Array.prototype.forEach.call(test.getElementsByTagName("a"), btn => {
                if(btn.innerHTML === 'Submit') {
                    btn.click();
                }
            });
        });
    }, false);
})();