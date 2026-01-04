// ==UserScript==
// @name          Fix for Moodle/TUWEL 2023 update
// @namespace     Violentmonkey Scripts
// @match         https://tuwel.tuwien.ac.at/*
// @match         https://moodle.*/*
// @exclude-match https://moodle.tld/*
// @grant         GM_addStyle
// @version       1.0
// @author        Tonitrus
// @description   Fixes the size of some elements to fit more content on screen.
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/476190/Fix%20for%20MoodleTUWEL%202023%20update.user.js
// @updateURL https://update.greasyfork.org/scripts/476190/Fix%20for%20MoodleTUWEL%202023%20update.meta.js
// ==/UserScript==

GM_addStyle(` /* slightly smaller section headings */
  h3.sectionname {
    font-size: 20px;
    font-weight: bold!important;
  }
`);

GM_addStyle(` /* smaller files/links on course pages */
  .activity-item {
    padding: 0px!important;
  }
  .activityiconcontainer {
    width: 30px;
    height: 30px;
  }
`);

GM_addStyle(` /* smaller thumbnails in course list */
  .dashboard-list-img {
    height: 2rem;
  }
`);

GM_addStyle(` /* fixed spacing of download button in directory */
  .activity-altcontent button {
    margin: 10px;
  }
  .activity-altcontent .container-fluid {
    padding-top: 0px;
  }
`);
