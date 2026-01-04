// ==UserScript==
// @name         Madrasati Force Solve
// @namespace    https://schools.madrasati.sa/
// @version      0.1
// @description  a script to force solve an assignment in madrasati even if the assignment period is over.
// @author       REVENGE977
// @match        https://schools.madrasati.sa/Student/Home/Assignments*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=madrasati.sa
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457444/Madrasati%20Force%20Solve.user.js
// @updateURL https://update.greasyfork.org/scripts/457444/Madrasati%20Force%20Solve.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let allAssignments = document.querySelectorAll(".table-hover > tbody > tr> td.project-actions")
    if(allAssignments.length > 1) {
        allAssignments.forEach(assignment => {
            let moreinfoBtn = assignment.children.item(0);
            let btnOnClickAttr = moreinfoBtn.getAttribute("onclick");
            if(btnOnClickAttr != null && btnOnClickAttr.includes("view('")) {
                let assignmentId = moreinfoBtn.getAttribute("onclick").split("'")[1];
                let parsedURL = location.href.split("&");

                let subjectId = parsedURL[0].split("SubjectId=")[1];
                let schooldId = parsedURL[1].split("schoolId=")[1];
                let UId = parsedURL[2].split("UId=")[1];
                let type = parsedURL[3].split("type=")[1];

                if(parsedURL[0].includes("Assignments")) {
                    assignment.innerHTML +=
                    `
                    <a href="/Student/Assignments/SolveLectureAssignment/${assignmentId}/${UId}?SchoolId=${schooldId}&published=false&SubjectId=${subjectId}&type=${type}" class="btn btn-primary btn-xs" data-original-title="" title="">
                        <i class="fa fa-pencil-square-o"></i> Force Solve
                    </a>
                    `
                }
            }
        })
    }
})();