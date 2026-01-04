// ==UserScript==
// @name         Y Combinator Application Status
// @namespace    https://www.linkedin.com/in/jarrettcoggin
// @version      2024-05-07
// @description  Just making it a little easier to track your Y Combinator application status.
// @author       Jarrett Coggin
// @match        https://apply.ycombinator.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ycombinator.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494363/Y%20Combinator%20Application%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/494363/Y%20Combinator%20Application%20Status.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function createAndAppendContent(parent, tag, text) {
        var element = document.createElement(tag);
        element.innerText = text;
        parent.appendChild(element);
    }

    window.addEventListener('load', function() {
        var div = document.querySelector('div[data-react-props]');
        if (div) {
            var rawProps = div.getAttribute("data-react-props");
            try {
                var reactProps = JSON.parse(rawProps);
                console.log(reactProps);
                reactProps.all_apps.forEach(app => {
                    if (app.current_batch) {
                        var appId = app.id;
                        var selector = `a[href='apps/${appId}']`;
                        var linkElement = document.querySelector(selector);
                        if (linkElement) {
                            var parentDiv = linkElement.closest('div.mb-8.overflow-hidden.rounded-xl.bg-white.p-12.shadow-md.hover\\:shadow-xl');
                            var newContent = document.createElement('div');
                            newContent.innerHTML = '<h2>Application Status:</h2>';
                            createAndAppendContent(newContent, 'p', 'Status: ' + app.status);
                            createAndAppendContent(newContent, 'p', 'Rejected: ' + app.rejected);
                            createAndAppendContent(newContent, 'p', 'Stage: ' + app.stage);
                            createAndAppendContent(newContent, 'p', 'Invited: ' + app.invited);
                            createAndAppendContent(newContent, 'p', 'Result: ' + app.result);
                            createAndAppendContent(newContent, 'p', 'Updated At: ' + app.updated_at);
                            createAndAppendContent(newContent, 'p', 'Updated By User At: ' + app.updated_by_user_at);
                            createAndAppendContent(newContent, 'p', 'Interview: ' + app.interview);
                            createAndAppendContent(newContent, 'p', 'Interview in Person: ' + app.interview_in_person);
                            createAndAppendContent(newContent, 'p', 'Interview Questions Filled In: ' + app.interview_questions_filled_in);
                            createAndAppendContent(newContent, 'p', 'Interview Time: ' + app.interview_time);
                            createAndAppendContent(newContent, 'p', 'Interview Within 30 Mins: ' + app.interview_within_30_min);
                            createAndAppendContent(newContent, 'p', 'Last Message Replied To: ' + app.last_message_replied_to);
                            createAndAppendContent(newContent, 'p', 'Messages: ' + app.messages);
                            parentDiv.appendChild(newContent);
                        }
                    }
                });
            } catch (e) {
                console.error('Error parsing JSON or updating the page:', e);
            }
        } else {
            console.log('No div with data-react-props found');
        }
    });
})();
