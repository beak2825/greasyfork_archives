// ==UserScript==
// @name        Udemy Course Creation Date
// @namespace   Violentmonkey Scripts
// @match       https://www.udemy.com/course/*
// @grant       none
// @version     1.0
// @license     MIT
// @author      ad3m
// @description This script adds udemy course creation date of course to last updated panel.
// @downloadURL https://update.greasyfork.org/scripts/477550/Udemy%20Course%20Creation%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/477550/Udemy%20Course%20Creation%20Date.meta.js
// ==/UserScript==

const courseId = document.querySelector("[data-clp-course-id]").getAttribute("data-clp-course-id");
const updated = document.querySelector(".last-update-date>span");

fetch(`https://www.udemy.com/api-2.0/courses/${courseId}/?fields[course]=created`)
  .then(response => response.json())
  .then(data => {
    let creationDate = new Date(data.created).toLocaleDateString();
    updated.textContent = `Created ${creationDate} - ${updated.textContent}`;
  });