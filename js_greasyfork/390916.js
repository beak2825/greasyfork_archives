// ==UserScript==
// @name Schoology Grades Made Easy
// @namespace https://kiawildberger.github.io
// @description Gets grade percentages from DOM and displays them in an easy-to-read format. Full class details are still available in the old format below.
// @match http://*.schoology.com/grades/grades
// @match https://*.schoology.com/grades/grades
// @noframes
// @version 1.0.1
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/390916/Schoology%20Grades%20Made%20Easy.user.js
// @updateURL https://update.greasyfork.org/scripts/390916/Schoology%20Grades%20Made%20Easy.meta.js
// ==/UserScript==

$(document).ready(() => {
    function id(e) {
        if(!e.includes("!")) return Array.from(document.querySelectorAll(e))
        return document.querySelector(e);
    }
    let grades = id(".course-grade-wrapper>.course-grade-value>.awarded-grade>.numeric-grade>.rounded-grade")
    let courses = id(`a.sExtlink-processed[href="#"]`)
    let courseNames = [];
    courses.forEach(e => {
        courseNames.push(e.innerText.split(":")[0])
    })
    let finalString = "";
    for(i in courseNames) {
        finalString += `${courseNames[i]}: <b>${grades[i].textContent}</b><br><br><br>`
    }
    let d = document.createElement('div')
    d.innerHTML = finalString;
    let c = document.getElementById('main-inner').innerHTML
    document.getElementById('main-inner').innerHTML = ''
    document.getElementById('main-inner').innerHTML += d.outerHTML + c;
})