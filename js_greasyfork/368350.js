// ==UserScript==
// @name         Auto-submit Alma Report Card Grades
// @namespace    https://greasyfork.org/en/users/8332-sreyemnayr
// @version      0.1
// @description  When you need to edit/save every teacher's grade for the whole school.
// @author       Ryan Meyers
// @match        https://*.getalma.com/report-cards/batches/*/input?student=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368350/Auto-submit%20Alma%20Report%20Card%20Grades.user.js
// @updateURL https://update.greasyfork.org/scripts/368350/Auto-submit%20Alma%20Report%20Card%20Grades.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
document.getElementsByClassName('submission orange')[0].parentElement.parentElement.getElementsByClassName('edit')[0].click();
    setTimeout(function(){
    document.getElementsByClassName('med-blue-bg')[1].click();
}, 2000);
        }, 2000);
})();