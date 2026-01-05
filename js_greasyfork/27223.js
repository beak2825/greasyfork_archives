// ==UserScript==
// @name         ACS Homepage Patch
// @namespace    http://tampermonkey.net/
// @namespace    http://greasyfork.org
// @version      1.0.4
// @description  Attempts to fix EVERY. LAST. PROBLEM.
// @author       Colin Reid
// @match        http://home.campbell.k12.va.us/
// @match        http://home.campbell.k12.va.us/index.php?school=ACS&type=STU
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27223/ACS%20Homepage%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/27223/ACS%20Homepage%20Patch.meta.js
// ==/UserScript==

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Programs and Web Sites", "g"), "Distractions From the Fact That You Have Actually Been Sent to Prison");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("My Favorite Links", "g"), "Stuff You May or May Not Have Clicked On");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("CVCC offers Summer Academy summer camp programs each year for age groups 7-11, 11-14, and 14+.", "g"), "Day camp, but school");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("To help us best determine what camps should be offered in 2016, we are asking for your help. Please respond to this survey by December 22.", "g"), "   ");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Altavista Combined School web page", "g"), "Useless, outdated web page.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("ArcGIS includes a Living Atlas of the World, comprised of authoritative maps and data on thousands of topics.", "g"), "Look forward to using this, as your Geography class will briefly use this. Briefly.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Animated Educational Site for Kids - Science, Social Studies, English, Math, Arts", "g"), "Overrated flash animations that still explain more than the teacher does.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("CK-12 Foundation provides free online textbooks, flashcards, adaptive practice, real world examples, simulations.", "g"), "Online textbooks. THERE IS NO ESCAPE");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Online curriculum for Cornerstone Learning Center", "g"), "Online torture device for Cornerstone Learning Center.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("II online textbooks.", "g"), "II online textbooks. Don't worry, we'll still get mad if you didn't bring them home.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Library card catalog program. See what books are available.", "g"), "Library card catalog program. A.K.A: The Only Useful Site Listed Here.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("History Textbooks by Five Ponds Press. Our World, Our Virginia, and Our America online textbooks are included.", "g"), "Even more textbooks. Jeez, it's like we want you to LEARN or something.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Research tool that provides access to thousands of articles from journals and magazines.", "g"), "Research tool that provides access to absolutely nothing of use.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Google mail, calendar", "g"), "Google Calendar");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("available online anytime, anywhere.", "g"), "available online anytime, anywhere. But if you try to access your e-mail, you'll be sorry. You'll ALL be sorry! AHAHAHAHAHAHAHA!");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Holt McDougal online textbook website by Houghton Mifflin Harcourt. Access your online textbook content.", "g"), "EVEN MORE TEXTBOOKS. You have no excuse.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Student login for the I Can Learn online math software. Use this link to access it from home.", "g"), "Student login for the I Can Learn online Numerical Torture software for use at home. You are not loved.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Student login for the I Can Learn online math software. Use this link to access it at school.", "g"), "Student login for the I Can Learn online Numerical Torture software for use at school. Slightly more tolerable.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("i-Ready offers an adaptive diagnostic, and both teacher-led and individualized online instruction for a complete blended learning solution.", "g"), "Used to supplement the cancer that is CompassLearning.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Student and parent access to the Infinite Campus portal. Access assignments, grades, and other information.", "g"), "Check your grades. Or don't. Our little secret: We don't actually care about you.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Create, play and share fun learning games for any subject, for all ages, for free!", "g"), "Classroom game software you might use once, but don't get your hopes up.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Practice resources for MAP Math. Hosted by South Washington County Schools in Minnesota.", "g"), "Some activities might not function properly at this time. Or at all. It's hosted in Minnesota, so...");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("More practice resources for MAP Math. Hosted by Belle Plaine Schools in Minnesota.", "g"), "Some activities still may not function properly, but we tried our best. After all, it's in a DIFFERENT part of Minnesota!");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Khan Academy practice exercises correlated to RIT for Common Core Math MAP for Grade 6+.", "g"), "Khan Academy: because we can't");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Practice resources for MAP Reading. Hosted by South Washington County Schools in Minnesota.", "g"), "This one's also hosted in Minnesota, so activities may not function properly, but this time it's Reading!");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("More practice resources for MAP Reading. Hosted by Clinton Community School District in Wisconsin.", "g"), "More reading, but hosted in Wisconsin!");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Support materials for geography, history, earth science and more.", "g"), "Maps, maps, and more maps. Also, there's maps. Did we mention that they have maps, too?");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Student E-books for the Microsoft IT Academy program.", "g"), "Instruction manuals. Not reccomended for testosterone-driven teenage boys.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Online course management system", "g"), "Online course management system. For people willing to carry a 12 Lbs. computer instead of a planner like everyone else. Yeah, keep pretending you're a special little snowflake.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Microsoft Office 365 gives you online access to the full Microsoft Office suite of tools, including Word, Excel, etc.", "g"), "For students who can't be bothered to OPEN THE START MENU.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Student log-in for PowerTest. Click here to take your test. (formerly iTest by Interactive Achievement)", "g"), "Student log-in for PowerTest Mind-Numbing software.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Student access to Scholastic Read 180.", "g"), "We use this for the Special kids because, despite previous demonstration of adequate knowledge, we think they're stupid.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Rosetta Stone language learning suite.", "g"), "Heh. Yeah. We're totally not paying for that.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Typing tutor software that combines exercises and video", "g"), "Typing tutor software that combines pain and crippling depression.");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Search the World Book encyclopedia online.", "g"), "Don't search the World Book encyclopedia. If you do, your brain will EXPLODE!");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Troubleshooting", "g"), "I DON'T KNOW HOW TO FIX IT I SWEAR");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Altavista Combined School", "g"), "Altavista Juvenile Correctional Facility");

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Some activities may not function properly at this time.", "g"), "   ");

// ==End==