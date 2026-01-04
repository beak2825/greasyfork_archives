// ==UserScript==
// @name         Udemy Auto Enroll Free Courses
// @namespace    http://tampermonkey.net/
// @version      0.1.5.7
// @description  Udemy auto enroll free courses
// @author       0x01x02x03
// @license MIT
// @match        https://www.udemy.com/course/*/*
// @match        https://www.udemy.com/cart/checkout/express/course/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456087/Udemy%20Auto%20Enroll%20Free%20Courses.user.js
// @updateURL https://update.greasyfork.org/scripts/456087/Udemy%20Auto%20Enroll%20Free%20Courses.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function courseIsFree(){
        console.log("Checking if course is free");
        let freeCourse = document.body.querySelector("#udemy > div.ud-main-content-wrapper > div.ud-main-content > div > div > div:nth-child(3) > div.heading > div.ud-container.lead-container > div:nth-child(2) > div > div > div > div > div.buy-button.buy-box--buy-box-item--2RETv.buy-box--buy-button--35r28 > div > button");
        if (freeCourse == null ){
            alreadyOwned();
        }
        if (freeCourse.textContent == 'Enroll now'){
            freeCourse.click();
        }

    }

    function alreadyOwned(){
        console.log("Checking if course is already owned");
        let owned = document.body.querySelector('#udemy > div.ud-main-content-wrapper > div.ud-main-content > div > div > div.paid-course-landing-page__container > div.sidebar-container-position-manager > div.course-landing-page_sidebar-container > div > div:nth-child(1) > div.sidebar-container--purchase-section--2DONZ > div > div > div.generic-purchase-section--buy-box-main--2o6Au > div > div.buy-button.buy-box--buy-box-item--2RETv.buy-box--buy-button--35r28 > div > button');
        if (owned == null){
            stillFree();
        }
        else if(owned.textContent == 'Buy now'){
            alert("Course no longer free, sorry");
            }
        else if (owned.textContent == 'Go to course'){
            alert("Course already owned!");
        }
        else if(owned.textContent == "Enroll now"){
            autoEnroll();
        }
    }

    function stillFree(){
        console.log("Checking if course is still free");
        let freeOrNot = document.body.querySelector("#udemy > div.ud-main-content-wrapper > div.ud-main-content > div > div > div.paid-course-landing-page__container > div.sidebar-container-position-manager > div.course-landing-page_sidebar-container > div > div:nth-child(1) > div.sidebar-container--purchase-section--2DONZ > div > div > div.generic-purchase-section--buy-box-main--2o6Au > div > div.buy-button.buy-box--buy-box-item--2RETv.buy-box--buy-button--35r28 > div > button");
        if(freeOrNot == null){
            autoEnroll();
        }
        else if (freeOrNot.textContent == 'Buy now'){
            alert("Course no longer free, sorry");
        }
    }

    function autoEnroll() {
        console.log("Trying to add to library");
        let enrollNow = document.body.querySelector('#udemy > div.ud-main-content-wrapper > div.ud-main-content > div > div > div.paid-course-landing-page__container > div.sidebar-container-position-manager > div.course-landing-page_sidebar-container > div > div:nth-child(1) > div.sidebar-container--purchase-section--2DONZ > div > div > div.generic-purchase-section--buy-box-main--2o6Au > div > div.buy-button.buy-box--buy-box-item--2RETv.buy-box--buy-button--35r28 > div > button');
        if (enrollNow == null){
            finalAddToLibrary();
        }
        else if (enrollNow.textContent == 'Enroll now') {
            enrollNow.click();
        }

    }

    function finalAddToLibrary(){
        console.log("Trying to add to library, step 2");
        let finalAdd = document.body.querySelector("#udemy > div.ud-main-content-wrapper > div.ud-main-content > div > div > div > div.marketplace-checkout--checkout-summary--gBdnZ > div > div.marketplace-checkout--marketplace-checkout-button-container--1cpeV > div.marketplace-checkout--button-term-wrapper--2_M-- > div.checkout-button--checkout-button--container--RQKAM > button");
        finalAdd.click();
    }

    setTimeout(courseIsFree, 2000);
})();