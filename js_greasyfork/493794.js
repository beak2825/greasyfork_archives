// ==UserScript==
// @name         Majmaah University evaluation
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Majmaah University evaluation script
// @author       OSA
// @match        https://edugate.mu.edu.sa/mu/ui/student/student_evaluation/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.mu.edu.sa
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493794/Majmaah%20University%20evaluation.user.js
// @updateURL https://update.greasyfork.org/scripts/493794/Majmaah%20University%20evaluation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const successSpan = document.getElementById("frm:errorMsg2");
    if (successSpan && successSpan.textContent.includes("تم التقييم بنجاح")) {
        console.log("Button clicked and success message found. Redirecting...");
        window.location.href = "https://edugate.mu.edu.sa/mu/ui/student/homeIndex.faces";
        window.location.href = "https://edugate.mu.edu.sa/mu/ui/student/student_evaluation/index/evaluationTypesIndex.faces";
    } else {
        console.log("Button clicked but success message not found. Skipping redirect.");
    }
    function getAllOptInputs() {
        return document.querySelectorAll('input[name^="opt"]');
    }
    const matchingElements = getAllOptInputs();
    for (const element of matchingElements) {
        if (element.name == "opt116" && element.value == "21733" ){
            element.checked = true;
            continue
        }
    else if (/32$/.test(element.value)) {
        console.log(element.value);
        element.checked = true;
    }}
   window.location.href = "javascript:submitForm('/mu')";
}
)();