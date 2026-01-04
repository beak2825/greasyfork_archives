// ==UserScript==
// @name         Make Note Section collapsible at Khalid Farhan academy
// @namespace    http://fb.com/Th3Hopper
// @version      1.0.1
// @description  This script helps you to add two buttons on LWS CMS So that you can easily collapse the "Note" Section.
// @author       Ramin
// @match        *://*academy.khalidfarhan.com/lessons/*
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437364/Make%20Note%20Section%20collapsible%20at%20Khalid%20Farhan%20academy.user.js
// @updateURL https://update.greasyfork.org/scripts/437364/Make%20Note%20Section%20collapsible%20at%20Khalid%20Farhan%20academy.meta.js
// ==/UserScript==
$(".learndash-wrapper").prepend("<div class=\"extend-wrap\"><button id=\"extend-btn\" type=\"button\" class=\"btn btn-danger btn-sm\">close</button> <button type=\"button\" class=\"btn btn-success btn-sm\" id=\"close-btn\">open</button></div>");
$(".learndash-wrapper").prepend("<div class=\"extend-design-css\"><style>.extend-wrap button{padding:3px 15px;font-size:15px}.extend-wrap .btn-danger{background:#eb5b5b}.extend-wrap .btn-success{background:#209653}.learndash-wrapper .bb-lms-header .lms-header-title,.learndash_content_wrap{max-width:100%!important}.extend-wrap{margin-bottom:10px}</style></div>");

$(".learndash-wrapper").prepend("<div class=\"extend-css\"></div>");
$(".extend-css").append("<style>.lms-topic-sidebar-wrapper.materials{display:none}</style>");
$("#extend-btn").click(function () {
    $(".learndash-wrapper").prepend("<div class=\"extend-css\"></div>");
    $(".extend-css").append("<style>.lms-topic-sidebar-wrapper.materials{display:none}</style>");
});
$("#close-btn").click(function () {
    $(".extend-css").remove();
});