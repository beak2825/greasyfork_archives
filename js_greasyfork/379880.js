// ==UserScript==
// @name         Power School Grade Change
// @namespace    https://jmuse.cf/
// @version      11.0
// @description  Change Ya Grade On Power School!
// @author       Jmuse
// @match        https://williamsburg.powerschool.com/*
// @grant        none
// @run-at       document.start
// @downloadURL https://update.greasyfork.org/scripts/379880/Power%20School%20Grade%20Change.user.js
// @updateURL https://update.greasyfork.org/scripts/379880/Power%20School%20Grade%20Change.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //-- So Really I Just Changed It To Fix My Classes But You Can Send A Request Email For Your Class Name.
    //-- https://goo.gl/forms/46Y7vUL1VQRNHyRX2 <-- Google Form For Class Name.




//-- Grade Letter Change
document.body.innerHTML = document.body.innerHTML.replace(/B/g, 'A');
document.body.innerHTML = document.body.innerHTML.replace(/C/g, 'A');
document.body.innerHTML = document.body.innerHTML.replace(/D/g, 'A');
document.body.innerHTML = document.body.innerHTML.replace(/F/g, 'A');
document.body.innerHTML = document.body.innerHTML.replace(/A-/g, 'A');
document.body.innerHTML = document.body.innerHTML.replace(/B-/g, 'A');
document.body.innerHTML = document.body.innerHTML.replace(/C-/g, 'A');
document.body.innerHTML = document.body.innerHTML.replace(/D-/g, 'A');
document.body.innerHTML = document.body.innerHTML.replace(/F-/g, 'A');



//-- Grade Number Change (Change Any Of The Numbers To Your Grade If Any Of These Are Not The Number)
    document.body.innerHTML = document.body.innerHTML.replace(/73/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/75/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/87/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/100/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/40/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/43/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/45/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/50/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/53/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/55/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/60/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/63/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/65/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/70/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/73/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/75/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/80/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/82/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/83/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/85/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/90/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/93/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/95/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/98/g, '100');
    document.body.innerHTML = document.body.innerHTML.replace(/99/g, '100');

    //-- Fixing Spelling Errors
var curInnerHTML = document.body.innerHTML;
curInnerHTML = curInnerHTML.replace("Aasic Math", "Basic Math");
document.body.innerHTML = curInnerHTML;

curInnerHTML = document.body.innerHTML;
curInnerHTML = curInnerHTML.replace("Intro to Aomputer-KAA", "Intro to Computer-KCC");
document.body.innerHTML = curInnerHTML;

    curInnerHTML = document.body.innerHTML;
curInnerHTML = curInnerHTML.replace("Teacher Aomments", "Teacher Comments");
document.body.innerHTML = curInnerHTML;

    curInnerHTML = document.body.innerHTML;
curInnerHTML = curInnerHTML.replace("School Aulletin", "School Bulletin");
document.body.innerHTML = curInnerHTML;

    curInnerHTML = document.body.innerHTML;
curInnerHTML = curInnerHTML.replace("Alass Registration", "Class Registration");
document.body.innerHTML = curInnerHTML;

    curInnerHTML = document.body.innerHTML;
curInnerHTML = curInnerHTML.replace("Aocument Vault", "Document Vault");
document.body.innerHTML = curInnerHTML;

    curInnerHTML = document.body.innerHTML;
curInnerHTML = curInnerHTML.replace("Aurrent HS Aum GPA Weighted GPA", "Current HS Sum GPA Weighted GPA");
document.body.innerHTML = curInnerHTML;

    curInnerHTML = document.body.innerHTML;
curInnerHTML = curInnerHTML.replace("", "Attendance By Day");
document.body.innerHTML = curInnerHTML;

})();