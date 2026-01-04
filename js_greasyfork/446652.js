// ==UserScript==
// @name         BKeL(old) Remove Unnecessary Element
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  BKeL page generally have alot of redundant element that serves very little purpose. This script remove element that I deemed unnecessary.
// @author       ntpt7921
// @exclude      http://e-learning.hcmut.edu.vn/
// @match        http://e-learning.hcmut.edu.vn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446652/BKeL%28old%29%20Remove%20Unnecessary%20Element.user.js
// @updateURL https://update.greasyfork.org/scripts/446652/BKeL%28old%29%20Remove%20Unnecessary%20Element.meta.js
// ==/UserScript==

/* I create this script for my personnal use.
 * Javascript is not my forte. So not sure if this script is optimized.
 * Anyone may use it freely.
 * No warranty, may break, use with caution
 */

(function() {
    'use strict';

    /*
     * This script will attempt to remove unneccesary element, if they exist:
     * 1. The page header displaying school logo (we know what website it is, no need for this)
     * 2. The name block on the top of page
     * 3. The left navbar listing of courses. This became useless if you have many courses
     */

    function delete_BKeL_header() {
        let headerContainer = document.querySelector('#site-header .header-main')
        if (headerContainer) {
            headerContainer.style.marginTop = '68px';
            let target = headerContainer.querySelector('.no-home')
            if (target) {
                target.remove()
            }
        }
    }

    function delete_heading_name_block() {
        let target = document.querySelector('#page #page-header')
        if (target) {
            target.remove()
        }
    }

    function delete_navbar_courses_list() {
        let targets = document.querySelectorAll('#nav-drawer .list-group ul li')
        let courses_list_started = false

        for (let testTarget of targets) {
            if (!courses_list_started) {
                let text = testTarget.querySelector('.media .media-body').innerText.trim()
                if (text === 'My courses') {
                    courses_list_started = true
                    testTarget.remove()
                }
            } else {
                testTarget.remove()
            }
        }
    }

    delete_BKeL_header()
    delete_heading_name_block()
    delete_navbar_courses_list()

})();