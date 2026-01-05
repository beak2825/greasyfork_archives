// ==UserScript==
// @name         ACS Website Patch
// @namespace    http://tampermonkey.net/
// @namespace    http://greasyfork.org
// @version      1.0.2
// @description  Attempts to fix EVERY. LAST. PROBLEM.
// @author       Colin Reid
// @match        http://acs.campbell.k12.va.us/
// @match        http://acs.campbell.k12.va.us/announcements
// @match        http://acs.campbell.k12.va.us/home
// @match        http://acs.campbell.k12.va.us/athletics
// @match        http://acs.campbell.k12.va.us/school-calendar
// @match        http://acs.campbell.k12.va.us/english
// @match        http://acs.campbell.k12.va.us/foreign-language
// @match        http://acs.campbell.k12.va.us/foreign-language
// @match        http://acs.campbell.k12.va.us/history
// @match        http://acs.campbell.k12.va.us/math
// @match        http://acs.campbell.k12.va.us/physical-education
// @match        http://acs.campbell.k12.va.us/science
// @match        http://acs.campbell.k12.va.us/electives
// @match        http://acs.campbell.k12.va.us/english-language-learners
// @match        http://acs.campbell.k12.va.us/library
// @match        http://acs.campbell.k12.va.us/special-education
// @match        http://www.campbell.k12.va.us/parents-students/food-services
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27226/ACS%20Website%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/27226/ACS%20Website%20Patch.meta.js
// ==/UserScript==

document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Boys", "g"), "Boyeez");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Girls", "g"), "Gurlz");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("boys", "g"), "boyeez");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("girls", "g"), "gurlz");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("English", "g"), "Englizzle");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("History", "g"), "Old Shizzle");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Science", "g"), "Scientizzle");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Athletics", "g"), "Sport Stuff");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Foreign Language", "g"), "Otha Speak");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Math", "g"), "Numbah Stuff");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Cafeteria", "g"), "Y'all Eat Herre");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Physical Education", "g"), "Shizzle fo' Gym Rats");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Campbell County Schools", "g"), "Schools in da Hood");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Track and Field", "g"), "Circle Runnin'");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Home", "g"), "Hood");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Parent Portal", "g"), "Perrnt Purtl");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp(" The ", "g"), " Tha ");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("will be", "g"), "be");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("There", "g"), "Derre");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("there", "g"), "derre");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Thare", "g"), "Derre");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("thare", "g"), "derre");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("meeting", "g"), "meet n' street");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("room", "g"), "hizzouse");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Colonel", "g"), "Kurrnul");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp(" new ", "g"), " fresh ");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("have a ride", "g"), "git yo ride");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("profits", "g"), "Dolla Dolla Bills");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("travel", "g"), "hustle");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("upstairs", "g"), "upsturrz");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("positive", "g"), "positizzle");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("collecting", "g"), "takin");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("donate", "g"), "cough up");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("athletes", "g"), "gym rats");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp(" All ", "g"), " All them ");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp(" with ", "g"), " wit ");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("John Grzenda", "g"), "Da Main Man");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp(" for ", "g"), " fo' ");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp(" and ", "g"), " n' ");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp(" the ", "g"), " tha ");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp(" to ", "g"), " ta ");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp(" is ", "g"), " be ");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp(" must ", "g"), " gotta ");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp(" are ", "g"), " be ");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("There", "g"), "Derre");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Boehler", "g"), "Balla");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Cross Country", "g"), "Runnin'");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Varsity", "g"), "Big Time");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("JV", "g"), "Small Time");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Golf", "g"), "Ball Wackin'");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Baseball", "g"), "Movin' Ball Wackin'");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Softball", "g"), "Big Movin' Ball Wackin'");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Basketball", "g"), "Streetballz");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("B-Team", "g"), "Smalla Time");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Cheer-leading", "g"), "Screamin'");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Volleyball", "g"), "Ball Smackin'");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Football", "g"), "Ball Throwin'");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Soccer", "g"), "Ball Kickin'");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Marching Band", "g"), "Noise Makin'");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Library", "g"), "Liberry");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Special Education", "g"), "School fo' Special Kidz");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Elective Courses", "g"), "Stuff You Like");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Departments", "g"), "Departmuntzz");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("Special Areas", "g"), "Extra Shizzle");
document.body.innerHTML = document.body.innerHTML.replace(new RegExp("School Calendar", "g"), "Imperrtant Dayz");

// ==End==