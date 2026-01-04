// ==UserScript==
// @name         Flexebee Test Answers
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Script for fetching Flexebee test answers.
// @author       You
// @match        https://portal.flexebee.co.uk/Files/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483890/Flexebee%20Test%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/483890/Flexebee%20Test%20Answers.meta.js
// ==/UserScript==
/// @match        https://portal.flexebee.co.uk/CourseAdmin/*

/* jshint esversion: 11 */
(function() {
    'use strict';

    window._globalFlexebeeData = {};
    let initialized = false;
    let myInterval;

    window.injectFlexebeeBehaviour = injectBehaviour;

    function initFlexeeBee() {
        if (typeof window.globalProvideData !== 'undefined') {
            initialized = true
            clearInterval(myInterval);
            window.injectFlexebeeBehaviour();
        }
    }

    myInterval = setInterval(initFlexeeBee, 500);
    initFlexeeBee();

    //     // https://stackoverflow.com/q/629671
    //     (function(open) {
    //         XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    //             if (!initialized) {
    //                 this.addEventListener("readystatechange", function() {
    //                     // Done loading, and it's a data injection.
    //                     if (this.responseText.startsWith('window.globalProvideData(')) {
    //                         initialized = true;
    //                         window.injectFlexebeeBehaviour();
    //                     }
    //                     if (this.readyState === 4) {
    //
    //                     }
    //                 }, false);
    //             }
    //             open.apply(this, arguments);
    //         };
    //     })(XMLHttpRequest.prototype.open);

    function injectBehaviour() {
        window.getFlexebeeAnswer = function(slideId, showUser = true) {
            // Get the current slide ID.
            slideId = slideId ||
                document.querySelector('.cs-listitem.cs-selected')?.getAttribute('data-ref')?.split('.')?.pop() ||
                document.querySelector('.slide-transition-container')?.getAttribute('data-reactid')?.split('=')?.pop();
            if (!slideId) {
                console.error('Unrecognized slide: ', slideId);
                return;
            }
            let slide = window._globalFlexebeeData?.scenes?.map(s => s.slides.find(a => a.id === slideId)).filter(Boolean)[0];
            let interactions = slide?.interactions;
            console.log('looking for: ' + slideId);
            let allOptions = [];
            let choiceInputs = [];
            let answers = interactions?.map(i => {
                let answer = i?.answers.find(a => a.status === 'correct');
                console.log('real answer: ', answer);
                let supportedIds = (answer?.evaluate?.statements?.filter(s => s.kind === 'equals').map(s => s.choiceid.replace('choices.', ''))) || [];
                choiceInputs = supportedIds.map(id => id.replace('choice_', '#acc-'));
                allOptions = i.choices.map(c => c.id.replace('choice_', '#acc-'));
                let choices = i.choices.filter(c => supportedIds.includes(c.id));
                return choices.map(c => c.lmstext.trim());
            });

            // The current answer.
            console.log('choice inputs: ', choiceInputs);
            console.log('answers: ', answers);

            if (showUser) {
                if (answers) {
                    alert('Answers for slide "' + slide?.title + '"\n - ' + answers.join('\n - '));
                }
            }

            // Select the default options.
            if (allOptions.length) {
                setTimeout(function() {
                    allOptions.map(selector => {
                        const element = document.querySelector(selector);
                        if (element) {
                            const isCorrectAnswer = choiceInputs.includes(selector);
                            const isChecked = element.checked;
                            let shouldClick = (isCorrectAnswer && !isChecked);
                            if (element.type === 'radio') {
                                // No need to unselect.
                            }
                            else if (element.type === 'choice') {
                                // Try to unselect it.
                                if (isChecked && !isCorrectAnswer) {
                                    shouldClick = true;
                                }
                            }
                            else {
                                console.warn('unsupported field type: "' + element.type + '"', element);
                            }
                            if (shouldClick) {
                                element.click();
                            }
                        }
                    })
                }, 500);
            }

            return {
                nid: slideId,
                title: slide?.title,
                interactions: interactions,
                answers: answers,
                choices: choiceInputs,
            }
        }


        let originalGlobalProvideData = window.globalProvideData;
        window.globalProvideData = function(type, data) {
            // Call the original callback as normal.
            originalGlobalProvideData.apply(originalGlobalProvideData, arguments);

            // Process the flexebee data.
            var d = JSON.parse(data);
            if (type === 'data') {
                // Populate the global slide data answers.
                window._globalFlexebeeData = d;
            }
            else if (type === 'slide') {
                // Log the current slide answers.
                window.getFlexebeeAnswer(d.id, false);
            }
        }

        console.log('window.globalProvideData injected into: ' + window.location);
    }
})();
