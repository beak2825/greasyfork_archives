// ==UserScript==
// @name         New Student Custom Template
// @namespace    https://queue.gradepotential.com/
// @version      0.2
// @description  Allows fields to be pre-filled with custom template when entering a new student
// @author       Leah Thompson
// @match        https://queue.gradepotential.com/new-student
// @downloadURL https://update.greasyfork.org/scripts/459740/New%20Student%20Custom%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/459740/New%20Student%20Custom%20Template.meta.js
// ==/UserScript==

(function() {

    const student_name = document.getElementsByName("Note.1")[0];
    const current_status = document.getElementsByName("Note.2")[0];
    const student_goals = document.getElementsByName("Note.3")[0];
    const estimated_usage = document.getElementsByName("Note.4")[0];

    student_name.value="is in X grade at X School wanting to work with us for support with ";
    current_status.value="X is struggling and is below grade level. They have some materials. They would like the tutor to bring some and are open for the tutor to suggest more.";
    student_goals.value="Goal: To work with the tutor on an ongoing basis to make sure that X.";
    estimated_usage.value="Estimates meeting X times per week @ 1 hour each session.";
})();