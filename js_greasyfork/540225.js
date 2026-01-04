// ==UserScript==
// @name         BBS Betriebe Timetable Enhancer
// @namespace    http://tampermonkey.net/
// @version      2025-06-20 2
// @description  This userscript tries to enhance the Timetable viewing experience on the site of BBS Betriebe
// @author       Jonas
// @match        *://bbs-betriebe.de/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540225/BBS%20Betriebe%20Timetable%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/540225/BBS%20Betriebe%20Timetable%20Enhancer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const css = `
        .navbar.custom .navbar-nav > li > a {
          color: rgb(241, 241, 241);
          text-shadow: none;
        }

        span {
          color : rgb(241, 241, 241) !important;
          max-width: 40ch !important;
        }

        a {
          color: rgb(241, 241, 241);
        }

        th {
          background-color: oklch(0.35 0.05 142.6) !important;
        }

        .table-striped>tbody>tr:nth-of-type(odd) {
          background-color: #121212;
        }

        .navbar.custom .navbar-brand {
          color: rgb(241, 241, 241);
          background-color: #0f0f0f;
        }

        .navbar.custom .navbar-nav > .active > a,.navbar.custom .navbar-nav > .active > a:hover,.navbar.custom .navbar-nav > .active > a:focus {
          color: rgb(241, 241, 241);
          background-color: #0f0f0f;
        }

        #main-nav.custom {
          background-color: #0f0f0f;
          border-color: transparent;
        }
        body.custom {
          color: rgb(241, 241, 241);
          background-color: #0f0f0f;
        }

        .panel-info {
          border-color: #0f0f0f !important;
        }

        .panel-info>.panel-heading {
          color: rgb(241, 241, 241);
          background-color: rgba(39,39,39,255);
          border-color: #0f0f0f !important;
        }

        .panel-body {
          background-color: #0f0f0f;
          border-color: #0f0f0f !important;
        }

        .FieldDiv {
          background-color: #0f0f0f;
        }

        #stacks_in_48057_page1 .FieldDiv input[type="text"],
        #stacks_in_48057_page1 .FieldDiv input[type="date"],
        #stacks_in_48057_page1 .FieldDiv input[type="datetime"],
        #stacks_in_48057_page1 .FieldDiv input[type="datetime-local"],
        #stacks_in_48057_page1 .FieldDiv input[type="time"],
        #stacks_in_48057_page1 .FieldDiv input[type="email"],
        #stacks_in_48057_page1 .FieldDiv input[type="url"],
        #stacks_in_48057_page1 .FieldDiv input[type="color"],
        #stacks_in_48057_page1 .FieldDiv input[type="month"],
        #stacks_in_48057_page1 .FieldDiv input[type="week"],
        #stacks_in_48057_page1 .FieldDiv input[type="number"],
        #stacks_in_48057_page1 .FieldDiv input[type="search"],
        #stacks_in_48057_page1 .FieldDiv input[type="tel"],
        #stacks_in_48057_page1 .FieldDiv input[type="password"],
        #stacks_in_48057_page1 .FieldDiv input[type="checkbox"],
        #stacks_in_48057_page1 .FieldDiv input[type="radio"],
        #stacks_in_48057_page1 .FieldDiv input[type="file"],
        #stacks_in_48057_page1 .FieldDiv select,
        #stacks_in_48057_page1 .FieldDiv textarea {
          font-family: inherit;
          font-size: inherit;
          color: rgb(241, 241, 241);
          background-color: rgba(39,39,39,255);
          border-color: rgba(39,39,39,255);
          border-radius: 4px;
        }

        .alert-warning, .alert-info{
          background-color: gray;
          color: rgb(241, 241, 241);
          border-color: gray;
        }

        #stacks_in_24208_page4  .navbar-default {
          background-color: #121212 !important;
          border-color: #121212 !important;
        }

        #stacks_in_47995_page1  .navbar-default {
          background-color: #121212 !important;
          border-color: #121212 !important;
        }

        .btn-info, .btn, .btn-primary:hover, .btn-warning:hover {
          background-color: rgba(39,39,39,255);
          border-color: rgba(39,39,39,255);
        }

        .input-group-addon {
          background-color: rgba(39,39,39,255);
          border-color: rgba(39,39,39,255);
        }

        #DateInput_1 {
          border-radius: 4px 0px 0px 4px !important;
        }

        .table-bordered>tbody>tr>td,.table-bordered>tbody>tr>th,.table-bordered>tfoot>tr>td,.table-bordered>tfoot>tr>th,.table-bordered>thead>tr>td,.table-bordered>thead>tr>th {
          border: 0px solid #ddd;
        }

        .table-bordered {
          border:0px solid #ddd;
        }

        .nav-tabs {
          border-bottom:0px solid #ddd;
        }

        .slider {
          background-color: rgba(39,39,39,255);
        }

        input:checked + .slider {
            background-color:  rgb(241, 241, 241);
        }

        .panel {
          border-color: #121212 !important;
        }

        .panel-danger>.panel-heading {
          background-color: #121212;
          color: rgb(241, 241, 241);
          border-color: transparent;
        }

        .page-header {
          border-bottom: 0px solid #ddd;
        }
    `;

  // this all seems horrible, id probably need to rewrite this all

  if (!getDarkModeState()) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches ?? false) {
      toggleDarkMode(css);
    }
  } else {
    toggleDarkMode(css);
  }

  let li = document.createElement("li");
  li.style = "margin-bottom: 0px; margin-top: 5px;";
  let darkModeButton = document.createElement("button");
  li.appendChild(darkModeButton);

  darkModeButton.className = "btn btn-primary";
  darkModeButton.innerHTML = "Switch UI Mode";
  document.body.querySelector('ul[class="nav navbar-nav"]').appendChild(li);
  darkModeButton.onclick = () => {
    if (getDarkModeState()) {
      untoggleDarkMode();
    }
    else {
      toggleDarkMode(css);
    }
  }



})();

function toggleDarkMode(css) {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  styleNode.id = "darkModeStyle";
  document.body.appendChild(styleNode);

  localStorage.setItem("darkMode", "true")
}

function untoggleDarkMode() {
  document.getElementById("darkModeStyle").remove();
  localStorage.setItem("darkMode", "false")
}

function getDarkModeState() {
  return localStorage.getItem("darkMode") === "true";
}