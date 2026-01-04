// ==UserScript==
// @name         KnowreMath Hack Unlocker
// @version      1
// @description  Hack for Knowremath
// @author       longkidkoolstar
// @match        https://knowremath.com/*
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @run-at       document-start
// @grant        none
// @license      none
// @namespace godlyredflame
// @downloadURL https://update.greasyfork.org/scripts/491987/KnowreMath%20Hack%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/491987/KnowreMath%20Hack%20Unlocker.meta.js
// ==/UserScript==
/* global ajaxHooker*/

(function() {
    'use strict';

    // Intercept the GraphQL request
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        return new Promise(function(resolve, reject) {
            if (url === "https://graphql-ussplus.knowreapi.com/graphql") {
                // Intercept and modify the response
                const modifiedResponse = {
                    "data": {
                        "UsSchoolPlusMutation": {
                            "mainProblemResult": {
                                "isCorrect": true,
                                "shouldStartWMT": null,
                                "solution": "{\"problemId\":8821217,\"sinodVersion\":2,\"solution\":[{\"type\":\"LineBreak\"},{\"type\":\"Table\",\"cells\":[[{\"type\":\"TableCellBox\",\"elements\":[{\"type\":\"Image\",\"url\":\"https://contents.knowreapi.com/us/illust/marking/png/big_dot.png\"}],\"align\":{\"hor\":\"left\",\"ver\":\"top\"},\"color\":{\"code\":-1},\"size\":{\"width\":0.016666666666667}},{\"type\":\"TableCellBox\",\"elements\":[{\"type\":\"Text\",\"content\":\"Find the value of \",\"wrap\":true,\"whiteSpaces\":false},{\"type\":\"Math\",\"content\":\"x\",\"wrap\":false,\"whiteSpaces\":true,\"innerPadding\":false},{\"type\":\"Text\",\"content\":\" by identifying the numbers with an absolute value of \",\"wrap\":true,\"whiteSpaces\":false},{\"type\":\"Math\",\"content\":\"8\",\"wrap\":false,\"whiteSpaces\":true,\"innerPadding\":false,\"font\":{\"color\":{\"text\":{\"code\":0}}}},{\"type\":\"Text\",\"content\":\".\",\"wrap\":true,\"whiteSpaces\":false}],\"align\":{\"hor\":\"left\",\"ver\":\"middle\"},\"color\":{\"code\":-1}}]],\"size\":{\"width\":1},\"dynamic\":false},{\"type\":\"LineBreak\"},{\"type\":\"Table\",\"cells\":[[{\"type\":\"TableCellBox\",\"elements\":[{\"type\":\"Text\",\"content\":\"The numbers that have an absolute value of \",\"wrap\":true,\"whiteSpaces\":false},{\"type\":\"Math\",\"content\":\"8\",\"wrap\":false,\"whiteSpaces\":true,\"innerPadding\":false,\"font\":{\"color\":{\"text\":{\"code\":0}}}},{\"type\":\"Text\",\"content\":\" are \",\"wrap\":true,\"whiteSpaces\":false},{\"type\":\"Math\",\"content\":\"8\",\"wrap\":false,\"whiteSpaces\":true,\"innerPadding\":false,\"font\":{\"color\":{\"text\":{\"code\":0}}}},{\"type\":\"Text\",\"content\":\" and \",\"wrap\":true,\"whiteSpaces\":false},{\"type\":\"Math\",\"content\":\"-8\",\"wrap\":false,\"whiteSpaces\":true,\"innerPadding\":false,\"font\":{\"color\":{\"text\":{\"code\":0}}}},{\"type\":\"Text\",\"content\":\".\",\"wrap\":true,\"whiteSpaces\":false}],\"align\":{\"hor\":\"left\",\"ver\":\"baseline\"},\"color\":{\"code\":-1},\"padding\":{\"left\":1.25}}]],\"size\":{\"width\":1},\"dynamic\":false},{\"type\":\"LineBreak\",\"height\":1},{\"type\":\"LineBreak\"},{\"type\":\"Table\",\"cells\":[[{\"type\":\"TableCellBox\",\"elements\":[{\"type\":\"Image\",\"url\":\"https://contents.knowreapi.com/us/illust/marking/png/big_dot.png\"}],\"align\":{\"hor\":\"left\",\"ver\":\"top\"},\"color\":{\"code\":-1},\"size\":{\"width\":0.016666666666667}},{\"type\":\"TableCellBox\",\"elements\":[{\"type\":\"Text\",\"content\":\"Conclusion\",\"wrap\":true,\"whiteSpaces\":false}],\"align\":{\"hor\":\"left\",\"ver\":\"middle\"},\"color\":{\"code\":-1}}]],\"size\":{\"width\":1},\"dynamic\":false},{\"type\":\"LineBreak\"},{\"type\":\"Table\",\"cells\":[[{\"type\":\"TableCellBox\",\"elements\":[{\"type\":\"Math\",\"content\":\"x=8\",\"wrap\":false,\"whiteSpaces\":true,\"innerPadding\":false},{\"type\":\"Text\",\"content\":\" or \",\"wrap\":true,\"whiteSpaces\":false},{\"type\":\"Math\",\"content\":\"x=-8\",\"wrap\":false,\"whiteSpaces\":true,\"innerPadding\":false}],\"align\":{\"hor\":\"left\",\"ver\":\"baseline\"},\"color\":{\"code\":-1},\"padding\":{\"left\":1.25}}]],\"size\":{\"width\":1},\"dynamic\":false},{\"type\":\"LineBreak\",\"height\":1}],\"answer\":[]}",
                                "problemEvents": [
                                    {
                                        "reason": "SAME_SKILL_KSS_PERFECT",
                                        "coinValue": null,
                                        "__typename": "ProbEventPayload"
                                    }
                                ],
                                "kssPoint": 100,
                                "__typename": "AnswerMainPayload"
                            },
                            "__typename": "UsSchoolPlusMutation"
                        }
                    }
                };
                // Resolve the promise with the modified response
                resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve(modifiedResponse)
                });
            } else {
                // For other URLs, proceed with the original fetch
                originalFetch(url, options).then(resolve).catch(reject);
            }
        });
    };
})();

