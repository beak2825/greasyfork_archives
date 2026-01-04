// ==UserScript==
// @name        Choose Course To Move Out
// @namespace   Choose Course To Move Out
// @match       https://fap.fpt.edu.vn/FrontOffice/Courses.aspx*
// @grant       none
// @version     1.0
// @author      -
// @description 11:36:11 9/12/2024
// @downloadURL https://update.greasyfork.org/scripts/520202/Choose%20Course%20To%20Move%20Out.user.js
// @updateURL https://update.greasyfork.org/scripts/520202/Choose%20Course%20To%20Move%20Out.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const targetCourseName = "Project Management";


    window.addEventListener('load', function() {
        const rows = document.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 1) {
                const courseName = cells[1].innerText.trim();
                console.log(`Kiểm tra lớp: ${courseName}`);
                if (courseName === targetCourseName) {
                    const moveLink = row.querySelector('a[title="Xin chuyen mon hoc nay sang lop khac"]');
                    if (moveLink) {
                        moveLink.click(); 
                    } else {
                        console.log(`Không tìm thấy liên kết "Chuyển lớp" cho lớp: ${courseName}`);
                    }
                }
            }
        });
    });
})();