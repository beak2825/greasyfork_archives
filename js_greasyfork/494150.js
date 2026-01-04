// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-05-11
// @description  fjdlasjlfa
// @author       You
// @match        https://easychair.org/conferences/submission*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=easychair.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494150/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/494150/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.querySelector("div[class='summary']").innerHTML = "<div class=\"pagetitle\">ICIDSSD- ICIAIML2k24 Submission 3<\/div><p>Status: <b>Accepted<\/b>, presentation pending.<\/p><p>For all questions related to processing your submission you should\r\n       contact the conference organizers. <a href=\"\/conferences\/conference_info.cgi?a=32367150&amp;track=316175\">Click here to see information about this conference.<\/a><\/p>"
    document.querySelector("table[id='ec:table2']").innerHTML = "<tbody><tr class=\"grey top\" id=\"row23\"><td class=\"center\" colspan=\"7\"><b>Authors<\/b><\/td><\/tr><tr class=\"grey bottom\" id=\"row26\"><td class=\"center\">first name<\/td><td class=\"center\">last name<\/td><td class=\"center\">email<\/td><td class=\"center\">country<\/td><td class=\"center\">affiliation<\/td><td class=\"center\">Web page<\/td><td class=\"center\">corresponding?<\/td><\/tr><tr id=\"row32\" class=\"green\"><td>Arsh<\/td><td>Kohli<\/td><td>kohliarsh9@gmail.com<\/td><td>India<\/td><td>Netaji Subhas University of Technology<\/td><td><\/td><td class=\"center\">\u2714<\/td><\/tr><tr id=\"row40\" class=\"green\"><td>Rishabh<\/td><td>Thakur<\/td><td>rishabh.thakur.ug20@nsut.ac.in<\/td><td>India<\/td><td>Netaji Subhas University of Technology<\/td><td><\/td><td class=\"center\">\u2714<\/td><\/tr><tr id=\"row48\" class=\"green\"><td>Satvik<\/td><td>Gupta<\/td><td>satvik.ug20@nsut.ac.in<\/td><td>India<\/td><td>Netaji Subhas University of Technology<\/td><td><\/td><td class=\"center\">\u2714<\/td><\/tr><tr class=\"green\" id=\"row56\"><td>Mohit<\/td><td>Godara<\/td><td>mohit.godara.ug20@nsut.ac.in<\/td><td>India<\/td><td>Netaji Subhas University of Technology<\/td><td><\/td><td class=\"center\">\u2714<\/td><\/tr><tr class=\"green\" id=\"row56\"><td>Sujata<\/td><td>Sengar<\/td><td><\/td><td>India<\/td><td>Netaji Subhas University of Technology<\/td><td><\/td><td class=\"center\">\u2714<\/td><\/tr><\/tbody>"
    document.querySelector("tr[id='row6']").innerHTML = "<td>Paper:<\/td><td class=\"value\"><a href=\"\/conferences\/submission_download?submission=6818293&amp;a=32367150&amp;upload=143531&amp;track=316175\"><img src=\"\/images\/uploads\/open.gif\" alt=\"ICIDSSD-_ICIAIML2k24_paper_3.pdf\" title=\"ICIDSSD-_ICIAIML2k24_paper_3.pdf\" style=\"border:0px\"><\/a><span style=\"margin:0pt 7pt 0pt 5pt\">(Mar 31, 17:07 GMT)<\/span><a href=\"\/conferences\/submission_versions.cgi?track=316175&amp;a=32367150&amp;submission=6818293\">(previous versions)<\/a><\/td>"
    document.querySelector("tr[id='row15']").innerHTML = "<td>Submitted<\/td><td class=\"value\">Mar 25, 16:31 GMT<\/td>"
})();