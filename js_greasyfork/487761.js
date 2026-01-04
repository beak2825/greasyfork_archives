// ==UserScript==
// @name         Better Gandalf Interface
// @namespace    http://tampermonkey.net/
// @version      2024-03-04
// @description  Removal of elements not required for navigation. Modernisation of the interface
// @author       Arthur Decaen
// @match        https://gandalf.epitech.eu/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487761/Better%20Gandalf%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/487761/Better%20Gandalf%20Interface.meta.js
// ==/UserScript==

var CURRENT_STYLE_DIV = ""

function getStyle(theme) {
    return `
.sectionname {
    border-radius: 8px;
    margin-top: 5px;
}
.containerLinks,
.section.main {
    border-radius: 8px !important;
    box-shadow: 0px 5px 5px rgba(0,0,0,0.12);
    margin-top: 15px !important;
    margin-bottom: 15px !important;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: ${theme == "light" ? "#f2f3f5" : "#2b2d31"} !important;
}
${theme == "light" ? "" : "*:not(.fa) { color: rgb(184,184,184) !important; }"}
#region-main {
    border-radius: 8px;
    box-shadow: 0px 5px 5px rgba(0,0,0,0.12);
    background-color: ${theme == "light" ? "#ffffff" : "#232428"};
}
.pagelayout-mydashboard #region-main {
    box-shadow: none;
}
.block {
    border-radius: 8px !important;
    box-shadow: 0px 5px 5px rgba(0,0,0,0.12) !important;
    border: none !important;
}
.section-summary-activities.mdl-right {
    height: 20px;
    padding-right: 10px;
}
#page>.container {
    background-color: ${theme == "light" ? "#f2f3f5" : "#313338"} !important;
}
#page-footer {
    display: none;
}
#main-navbar {
    background-color: ${theme == "light" ? "#e3e5e8" : "#1e1f22"} !important;
    border: none !important;
    box-shadow: 0px 5px 5px rgba(0,0,0,0.12);
}
.zoomdesc {
    display: none;
}
#page-navbar {
    border-radius: 8px;
    box-shadow: 0px 5px 5px rgba(0,0,0,0.05);
    background-color: ${theme == "light" ? "#ffffff" : "#1e1f22"};
    margin-top: 20px !important;
}
.container.outercont .row:first-child {
    display: flex;
    justify-content: left;
}
#adaptable-page-header-wrapper {
    background: ${theme == "light" ? "#e3e5e8" : "#1e1f22"} !important;
}
a[title="Epitech Gandalf Platform"] img {
    filter: invert(${theme == "light" ? "100%" : "30%"});
}
#block-region-side-post {
    padding-right: 0;
}
#sitetitle h1 {
    color: ${theme == "light" ? "black" : "rgb(184,184,184)"} !important;
}
.search-box,
.search-box input {
    border-radius: 10px !important;
}
#completionprogressid {
    display: none;
}
#section-0 {
    margin-top: 0 !important;
}
.card-text.calendarwrapper {
    padding-left: 15px !important;
    padding-right: 15px !important;
}
.userpicture {
    border-radius: 20px !important;
    box-shadow: 0px 5px 5px rgba(0,0,0,0.2);
}
.courses.category-browse.category-browse-3 .coursebox {
    margin-top 10px;
    margin-bottom: 10px;
}
.collapsible-actions {
    margin: 0 !important;
    padding-right: 25px !important;
}
body {
    background: ${theme == "light" ? "#f2f3f5" : "#2b2d31"} !important;
}
.skillProgressContainer {
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0px 2px 5px rgba(0,0,0,0.05);
    height: 22px;
    border: solid rgba(175,175,175,0.6) 1px;
}
.dateModifiedContainer {
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    margin-bottom: 5px;
}
.dateModifiedContainer p {
    margin-bottom: 0;
}
div.activity-wrapper {
    border: none !important;
}
.switchTheme {
    border: none;
    background: none;
    font-size: 1.3rem;
    transition: rotate .2s ease-in-out;
}
.switchTheme:hover {
    rotate: -10deg;
}
.switchThemeLi {
    display: flex;
    padding-left: 5px;
    padding-right: 5px;
}
[data-region="empty-message"] {
    background: ${theme == "light" ? "#ffffff" : "#232428"};
}
.card.dashboard-card {
    border-radius: 8px;
    overflow: hidden;
    ${theme == "light" ? "background: #e3e5e8 !important;" : "border: none;"}
    margin-bottom: 10px;
    margin-top: 10px;
}
${theme == "light" ? "" : ".course-info-container { background: #383a3f; }"}
.dashboard-card-footer {
    ${theme == "light" ? "" : "background: #383a3f !important;"}
    padding: 0 !important;
}
.dashboard-card-footer .progress {
    border-radius: 0 0 8px 8px;
    overflow: hidden;
    border: none !important;
    height: 15px !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background: ${theme == "light" ? "#f1f1f1" : "#4e5058"} !important;
}
.dashboard-card-footer .small {
    display: none;
}
.pagination li a {
    background: ${theme == "light" ? "#e3e5e8" : "#515151"} !important;
    border: none !important;
    border-radius: 5px;
}
.pagination li:first-child {
    margin-right: 10px;
}
.eventlist .card {
    border-radius: 8px !important;
    overflow: hidden;
}
.btn.btn-secondary {
    border: none;
}
.card-header.calendar_event_course {
    border: none;
    margin-top: 0;
}
.eventlist .card .card-footer {
    display: none;
}
.generalbox {
    border-radius: 8px;
}
.dropdown-menu {
    overflow: visible !important;
}
.modal-header.close {
    padding-left: 10px;
}
.modal-dialog {
    border-radius: 8px;
    overflow: hidden;
}
.modal.show {
    display: flex;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(10px);
}
.modal-header.close {
    padding-left: 10px;
}
${theme == "light" ? "" :
    `.block>.content {
        background: none;
    }
    .block {
        background: #232428 !important;
    }
    .block .header {
        background: none;
    }
    .bg-white {
        background: #b8b8b8 !important;
    }
    .section li.modtype_assign div.activity-wrapper {
        background-color: #404249 !important;
        border: none !important;
    }
    .nav-link.active {
        background: #232428 !important;
    }
    .resultGraphs.active {
        background: #232428 !important;
    }
    .styleSkill:nth-child(even) {
        background: #383a3f !important;
    }
    .skillProgressContainer {
        background: #383a3f;
    }
    .dropdown-item,
    .dropdown-menu {
        background: #383a3f;
    }
    .dropdown-item:hover,
    .dropdown-toggle:hover {
        background-color: #1e1f22 !important;
    }
    .dropdown-menu {
        border-radius: 8px !important;
        box-shadow: 0px 10px 0px rgba(0,0,0,0.2);
    }
    .frontpage-course-list-enrolled .coursebox {
        background: #383a3f !important;
        border: 5px solid #232428;
    }
    .eventlist .card {
        background: #383a3f;
    }
    .btn.btn-secondary {
        background: #515151;
        border: none;
    }
    .card-header.calendar_event_course {
        background: #54565d;
    }
    .generalbox {
        background: #313338 !important;
    }
    .submissionnotgraded {
        background: #313338 !important;
    }
    .modal-dialog .modal-content {
        background-color: #393a3f !important;
    }
    .courses .coursebox {
        background: #383a3f !important;
    }
    .links .linkDiv button img {
        filter: invert(70%);
    }
    `
}
`
}

function switchStyle()
{
    var styleState = localStorage.getItem("betterGandalfInterfaceTheme") ?? "light"
    styleState = styleState == "light" ? "dark" : "light"
    const styles = getStyle(styleState)

    CURRENT_STYLE_DIV.remove()

    CURRENT_STYLE_DIV = document.createElement("style")
    CURRENT_STYLE_DIV.innerText = styles
    document.head.appendChild(CURRENT_STYLE_DIV)
    localStorage.setItem("betterGandalfInterfaceTheme", styleState)

    const icon = document.querySelector("#switchThemeIcon")
    icon.innerHTML = styleState == "light" ? "🌙" : "☀️"
}

(function() {
    'use strict';

    // Remove forum wrapper
    const forums = document.querySelectorAll(".activity.forum.modtype_forum")
    forums.forEach((forum) => forum.remove())

    // Style
    var styleState = localStorage.getItem("betterGandalfInterfaceTheme") ?? "light"
    const styles = getStyle(styleState)
    CURRENT_STYLE_DIV = document.createElement("style")
    CURRENT_STYLE_DIV.innerText = styles
    document.head.appendChild(CURRENT_STYLE_DIV)

    const rightNavBar = document.querySelector(".navbar-nav.ml-auto:not(.my-auto)");
    rightNavBar.innerHTML += `
    <li class="nav-item mr-1 hbl switchThemeLi">
    <button class="switchTheme" id="switchThemeIcon">${styleState == "light" ? "🌙" : "☀️"}</button>
    </li>
    `
    const icon = document.querySelector("#switchThemeIcon")
    icon.addEventListener("click", switchStyle)
})();