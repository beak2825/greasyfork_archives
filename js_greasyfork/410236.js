// ==UserScript==
// @name        WaniKani Fake Numbers
// @version     1.4.2
// @author      UInt2048
// @description Replaces lesson & review numbers above 42 with 42+. Based on Naphthalene's Display lesson/review numbers as categories
// @include     https://www.wanikani.com/*
// @exclude     https://www.wanikani.com/review/*
// @exclude     https://www.wanikani.com/lesson/*
// @run-at      document-end
// @namespace   https://greasyfork.org/users/684166
// @downloadURL https://update.greasyfork.org/scripts/410236/WaniKani%20Fake%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/410236/WaniKani%20Fake%20Numbers.meta.js
// ==/UserScript==

let dashboardOnly = true;

if (dashboardOnly && window.location.pathname == '/review') {
    var reviewQueue = document.getElementById("review-queue-count");
    replaceIfNeeded(reviewQueue);
} else if (dashboardOnly && window.location.pathname == '/lesson') {
    var lessonQueue = document.getElementById("lesson-queue-count");
    replaceIfNeeded(lessonQueue);
}

if (isDashboard()) {
    var baseElement = document.getElementsByClassName("lessons-and-reviews")[0].children[0];
    var valsOnDash = $(baseElement).find("span");
    valsOnDash.each(function(index, element){replaceIfNeeded(element);});
    var navElement = document.getElementsByClassName("navigation")[0];
    var valsOnNav = $(navElement).find("span");
    valsOnNav.each(function(index, element){replaceIfNeeded(element);});

    var extraStudyElement = document.getElementsByClassName("md:mr-3")[0];
    var valsOnStudy = $(extraStudyElement).find("a");
    valsOnStudy.each(function(index, element){replaceIfNeeded(element);});
}

function replaceIfNeeded(element) {
    var inner = element.innerHTML;
    var afterSpace = inner.substr(inner.indexOf(" ") + 1);
    var val = isNaN(parseInt(inner)) ? parseInt(inner.split(" ")[0]) : parseInt(inner);
    if (isNaN(val) || val <= 42) { return; }
    if (!inner.includes(" ")) { element.innerHTML = "42+"; }
    else { element.innerHTML = "42+ " + afterSpace; }
}


function isDashboard() {
    return (window.location.pathname == '/' || window.location.pathname == '/dashboard');
}