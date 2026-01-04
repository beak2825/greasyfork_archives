// ==UserScript==
// @name         Live Tab++
// @namespace    http://razboy.dev/
// @version      0.25
// @description  Appends some functions to the Live Tab of the CWHQ Teach tool that help search.
// @author       You
// @match        https://*.codewizardshq.com/teach/
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/409195/Live%20Tab%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/409195/Live%20Tab%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow.findStudents = (name) => {
        unsafeWindow.document.getElementById("input-60");
        if (unsafeWindow.learn.model._students) unsafeWindow.learn.model.students = unsafeWindow.learn.model._students;
        let studentList = []
        const sortedStudentKeys = Object.keys(unsafeWindow.learn.model.students).filter(e => e.match(new RegExp(name, "gi")))
        sortedStudentKeys.forEach(key => {
            const student = unsafeWindow.learn.model.students[key];
            const list = [student.username, student.class];
            studentList.push(list);
        });

        if (studentList.length == 0) {
            throw new Error(`Student "${name}" does not exist.`);
        }

        studentList = studentList.sort(function(a, b) {
            return a[0].length - b[0].length || a[0].localeCompare(b[0])
        });
        console.table(studentList);
        return studentList;
    }
    unsafeWindow.sortStudents = (name) => {
        if (!unsafeWindow.learn.model._students) unsafeWindow.learn.model._students = unsafeWindow.learn.model.students;

        const sortedStudents = Object.values(unsafeWindow.learn.model._students).filter(e => e.username.match(new RegExp(name, "gi")));
        unsafeWindow.learn.model.students = sortedStudents;
        console.table(sortedStudents);
        return sortedStudents;
    }

    unsafeWindow.createTableFromStudents = (studentList) => {
        let students = studentList.split(/\s/g);
        try {
            students = students.map(student => unsafeWindow.findStudents(student)[0]);
            students = students.map(student => {
                const studentClass = unsafeWindow.learn.model.classes.find(c => c.id == student[1]);
                if (studentClass) {
                    return `${student[0]}: ${studentClass.name} (${student[1]})`;
                } else {
                    return `${student[0]}: ${student[1]}`;
                }
            });
            return students.join("\n");
        }
        catch (e) {
            console.error(e);
        }
    }

})();