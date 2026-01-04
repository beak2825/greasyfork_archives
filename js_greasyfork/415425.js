// ==UserScript==
// @name Moodel
// @namespace http://tampermonkey.net/
// @version 2.2
// @description try to take over the world!
// @author Alon
// @match https://moodlemoe.lms.education.gov.il/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/415425/Moodel.user.js
// @updateURL https://update.greasyfork.org/scripts/415425/Moodel.meta.js
// ==/UserScript==

(function() {
'use strict';

function addGlobalStyle(css) {
var head, style;
head = document.head;
if (!head) return;
style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = css;
head.appendChild(style);
}

addGlobalStyle('@import url(https://fonts.googleapis.com/earlyaccess/opensanshebrew.css);');
addGlobalStyle('@import url(https://fonts.googleapis.com/earlyaccess/opensanshebrewcondensed.css);');
// עיצוב טקסט
addGlobalStyle('body {font-family: Open Sans Hebrew;}');
// עיגול פינות
addGlobalStyle('img {border-radius: 15px}'); // תמונות
addGlobalStyle('div, li, select, input, .form-control, .nav-link, #id_messageeditable, .editor_atto_content_wrap, a, .btn col-md-12, .nav-link active input, button, section, img, span, body.format-moetopcoll .course-content ul.ctopics #toggle-1, #toggle-2, #toggle-3 {border-radius: 15px}'); // תוכן מתחת לנושאים, חלק ימני של תוכן, נושאים, גישת משתמש, תפריטים שמאליים
addGlobalStyle('a, h2, content, btn btn-primary, sectionhead toggle toggle-arrow {border-radius: 15px}');

// dark mode
addGlobalStyle('#yui_3_17_2_1_1604431436100_185, div.editor_atto_toolbar, body, html, .filemanager-toolbar icon-no-spacing, .col-12, #nav-drawer, #page {background-color: black}')
})();