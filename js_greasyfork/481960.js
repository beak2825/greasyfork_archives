// ==UserScript==
// @name         Northern Enspire
// @namespace    https://yellowpencil.enspire.ca/
// @version      2023-12-11
// @description  Cleaning up interface
// @author       Don
// @match        https://yellowpencil.enspire.ca/project/time/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=enspire.ca
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481960/Northern%20Enspire.user.js
// @updateURL https://update.greasyfork.org/scripts/481960/Northern%20Enspire.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var container = document.querySelector(".js-project-block-time-logs");
    var targetDiv = document.querySelector(".project-block-tasks-list-container");
    targetDiv.appendChild(container);

    var singleTasks = document.querySelector(".project-block-tasks-single .panel");
    var singleTasksTarget = document.querySelector(".project-time-track");
    singleTasksTarget.append(singleTasks);

    // Select the project-block-tasks-list element
    var projectTaskList = document.querySelector('.project-block-tasks-list');

    // Check if projectTaskList is not null
    if (projectTaskList) {
        // Remove the class 'col-lg-6'
        projectTaskList.classList.remove('col-lg-6', 'col-sm-6');

        // Add the class 'col-lg-10'
        projectTaskList.classList.add('col-lg-10', 'col-sm-9');
    }

})();