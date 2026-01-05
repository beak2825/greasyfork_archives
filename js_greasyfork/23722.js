// ==UserScript==
// @name         Udemy Auto-Buyer
// @author       Yassine Nacer: www.facebook.com/profile.php?id=100010302216530
// @namespace    sc
// @include      https://www.udemy.com/*
// @version      1.1
// @description  Found a big list of Udemy coupons and you are scared of getting tired while adding them all one by one? This userscript will help you to get them in one click.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23722/Udemy%20Auto-Buyer.user.js
// @updateURL https://update.greasyfork.org/scripts/23722/Udemy%20Auto-Buyer.meta.js
// ==/UserScript==


(function() {
    'use strict';
function myFunction() {
   var x = document.getElementsByClassName("course-cta btn btn-lg btn-primary btn-block")[0].click();
}

    myFunction();
})();