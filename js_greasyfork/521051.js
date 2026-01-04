// ==UserScript==
// @name         XMUM Moodle Tweaks
// @namespace    http://tampermonkey.net/
// @version      2025-01-16
// @description  Try to take over the moodle!
// @author       Reality361
// @run-at       document-idle
// @match        https://l.xmu.edu.my/*
// @icon         https://l.xmu.edu.my/pluginfile.php/1/core_admin/favicon/64x64/1726281221/XMUM%20Logo.PNG
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521051/XMUM%20Moodle%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/521051/XMUM%20Moodle%20Tweaks.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    var currentURL = window.location.href;
    // Add E-Services tab at the top
    var navBarElement = document.querySelector("ul.nav.more-nav.navbar-nav");
    var EServices = document.createElement("li");
    var myCoursesElement = document.querySelector('[data-key="mycourses"]');
    navBarElement.insertBefore(EServices, myCoursesElement.nextSibling); // insertAfter()
    EServices.outerHTML = "<li data-key=\"\" class=\"nav-item\" role=\"none\" data-forceintomoremenu=\"false\" id=\"e-services-tab-li\"><a role=\"menuitem\" class=\"nav-link\" href=\"https://eservices.xmu.edu.my/\" target=\"_blank\" tabindex=\"-1\" aria-current=\"true\" id=\"e-services-tab-a\">E-Services</a></li>";

    /*
    var dashboardElement = document.querySelector('[data-key="myhome"]');
    dashboardElement.style.display = "none";
    */
    // Hide "?" button at the bottom
    var moodleBtnElement = document.querySelector('button.btn.btn-icon.bg-secondary.icon-no-margin.btn-footer-popover');
    moodleBtnElement.style.display = "none";

    // Optimize items in the course view
    var activityElements = document.querySelectorAll('div.activity-item');
    activityElements.forEach(element => {
        element.style.padding = "0";
    });
    var itemIconElements = document.querySelectorAll('div.activityiconcontainer.content.courseicon.align-self-start.mr-3, div.activityiconcontainer.collaboration.courseicon.align-self-start.mr-3');
    itemIconElements.forEach(element => {
        element.style.height = "30px";
    });
    var collapseBtnElements = document.querySelectorAll('.btn.btn-icon.mr-1.icons-collapse-expand.justify-content-center.stretched-link');
    collapseBtnElements.forEach(element => {
        element.style.height = "20px";
    });
    var sectionNameElements = document.querySelectorAll('.sectionname.course-content-item.d-flex.align-self-stretch.align-items-center.mb-0');
    sectionNameElements.forEach(h3Element => {
        // new h6
        let h6Element = document.createElement('h6');

        // copy h3 to h6
        h6Element.innerHTML = h3Element.innerHTML;
        for (let i = 0; i < h3Element.attributes.length; i++) {
            h6Element.setAttribute(h3Element.attributes[i].name, h3Element.attributes[i].value);
        }

        // replace h3 with h6
        h3Element.parentNode.replaceChild(h6Element, h3Element);
    });
    var itemPlaceHolderBtnElements = document.querySelectorAll('li.section');
    itemPlaceHolderBtnElements.forEach(element => {
        element.style.paddingTop = "0";
        element.style.paddingBottom = "0";
    });
    // Change color from #0f47ad to #003153
    var secondaryNavigationElements = document.querySelectorAll('.secondary-navigation');
    secondaryNavigationElements.forEach(element => {
        element.style.backgroundColor = "#003153";
    });
    // Change color from #0f47ad to #003153
    var drawerBtnElements = document.querySelectorAll('.btn.icon-no-margin');
    drawerBtnElements.forEach(element => {
        element.style.backgroundColor = "#003153";
    });
    var crossElements = document.querySelectorAll('.icon.fa.fa-times.fa-fw');
    crossElements.forEach(element => {
        element.style.filter = "invert(100%)";
    });
    var regionMainElement = document.querySelector('section#region-main');
    if (currentURL.indexOf('https://l.xmu.edu.my/course/view.php') !== -1) {
        // Hide page header
        var pageHeaderElement = document.getElementById('page-header');
        pageHeaderElement.style.display = "none";
    }

    window.addEventListener('load', function() {
        // your code here
        if (currentURL.indexOf('https://l.xmu.edu.my/course/view.php') !== -1) {
            // Remove <br> in the main region section
            // Has bug, do not use
            // regionMainElement.innerHTML = regionMainElement.innerHTML.replace(/<br\s*\/?>/gi, '');
            // Add a course info button
            var CourseInfoBtnElement = document.createElement("button");
            regionMainElement.insertBefore(CourseInfoBtnElement, regionMainElement.firstChild.nextSibling);
            CourseInfoBtnElement.outerHTML = '<button class="btn btn-outline-secondary btn-sm text-nowrap pull-right" id="view-course-info-btn">Course Information</button>';
            // new course brief
            var CourseBriefParentDivElement = document.querySelector('div.page-header-headings');
            var CourseBriefElement = document.createElement('h6');
            CourseBriefElement.innerHTML = CourseBriefParentDivElement.firstChild.innerHTML;
            regionMainElement.insertBefore(CourseBriefElement, regionMainElement.firstChild);
            // View course info button click event
            var link = document.getElementById("view-course-info-btn");
            if (link) {
                link.addEventListener("click", function() {
                    pageHeaderElement.style.display = (pageHeaderElement.style.display === "none")? "" : "none";
                    CourseBriefElement.style.display = (pageHeaderElement.style.display === "none")? "" : "none";
                }, false);
            }
        }
    }, false);
})();