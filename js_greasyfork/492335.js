// ==UserScript==
// @name         Cisco U answers reveal
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Tells you if your previous answer was correct in post and pre-assessments
// @author       you
// @license MIT
// @match        https://ondemandelearning.cisco.com/apollo-alpha/*/questions/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cisco.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492335/Cisco%20U%20answers%20reveal.user.js
// @updateURL https://update.greasyfork.org/scripts/492335/Cisco%20U%20answers%20reveal.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getElementByXPath(xpath) {
        return new XPathEvaluator()
            .createExpression(xpath)
            .evaluate(document, XPathResult.FIRST_ORDERED_NODE_TYPE)
            .singleNodeValue
    }
    var open_prototype = XMLHttpRequest.prototype.open,
        intercept_response = function (urlpattern, callback) {
            XMLHttpRequest.prototype.open = function () {
                arguments['1'].match(urlpattern) && this.addEventListener('readystatechange', function (event) {
                    if (this.readyState === 4) {
                        var response = callback(event.target.responseText);
                        Object.defineProperty(this, 'response', { writable: true });
                        Object.defineProperty(this, 'responseText', { writable: true });
                        this.response = this.responseText = response;
                    }
                });
                return open_prototype.apply(this, arguments);
            };
        };

    function correct_div_html(text) {
        return `
    <div id="custom-div-answer" class="bg-green-xlight flex flex-col items-center space-x-2 rounded px-2 py-1">
        <details>
            <summary class="flex items-center space-x-2 rounded px-2 py-1">
                <div class="bg-green-medium text-white-xlight flex items-center justify-center rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="_base_116bes _xs_116bes"><path d="M13.5 2L16 4.5l-9.8 10L0 8.1l2.5-2.5 3.7 3.8z"></path></svg>
                </div>
                <span>Previous answer was correct</span>
            </summary>
            <p>${text}</p>
        </details>
    </div>
    `
    }

    function wrong_div_html(text) {
        return `
    <div id="custom-div-answer" class="bg-red-xlight flex flex-col items-center space-x-2 rounded px-2 py-1">
        <details>
            <summary class="flex items-center space-x-2 rounded px-2 py-1">
                <div class="bg-red-medium text-white-xlight flex items-center justify-center rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="_base_116bes _xs_116bes"><path d="M3.8 1L8 5.2 12.2 1 15 3.8 10.8 8l4.2 4.2-2.8 2.8L8 10.8 3.8 15 1 12.2 5.2 8 1 3.8z"></path></svg>
                </div>
                <span>Previous answer was incorrect.</span>
            </summary>
            <p>${text}</p>
        </details>
    </div>
    `
    }

    function displayAnswer(is_correct, text) {
        console.log(`Your answer was ${is_correct ? "correct" : "incorrect"}.\n${text}`)
        const answer_html = is_correct ? correct_div_html(text) : wrong_div_html(text);
        let div = document.querySelector("#custom-div-answer");
        if (div) {
            div.outerHTML = answer_html;
        } else {
            div = document.createElement("div");
            const childNode = document.getElementById("featured-content");
            childNode.appendChild(div);
            div.outerHTML = answer_html;
        }
    }

    /* response exemple:
    {
    "data": {
            "id": "97136067",
            "type": "question-response",
            "attributes": {
                "correct-value": null,
                "created-at": "2023-10-24T19:30:27.803Z",
                "is-correct": true,
                "value": [
                    "2",
                    "5"
                ]
            },
        },
        "included": [
            {
                "id": "01b4a69bfbea893bb9d0a7f50d1d30db",
                "type": "content",
                "attributes": {
                    "document": {
                        "atoms": [],
                        "cards": [],
                        "markers": [
                            [
                                0,
                                [],
                                "The correct answers are: "
                            ],
                            [
                                1,
                                [
                                    0
                                ],
                                "The network is locally originated via the network command in BGP"
                            ],
    */
    // extract is-correct from response
    intercept_response(/.*\/api\/v4\/question_responses$/, function (response) {
        var json = JSON.parse(response);
        var is_correct = json.data.attributes["is-correct"];
        let text = '';
        json.included.forEach(element => {
            if (element.type == "content") {
                text += element.attributes.document.markers.map(e => e[e.length - 1].replaceAll('>','&gt;')).join('');
            }
        });
        displayAnswer(is_correct, text);
    });

})();