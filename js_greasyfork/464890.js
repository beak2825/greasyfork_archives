// ==UserScript==
// @name         Shork's Bicocca Utilities
// @name:it      Shork's Bicocca Utilities
// @namespace    http://tampermonkey.net/
// @version      8.0
// @description  Auto-login (S3, e-Learning, EsamiOnline and others), automatically open e-Learning files, resize videos, replace Profile Picture on S3
// @description:it Auto-login (S3, e-Learning e altri), apri automaticamente i file su e-Learning, ridimensiona video, rimpiazza l'immagine profilo su S3
// @author       Shork (Leonardo Gualandris)
// @match        https://elearning.unimib.it/*
// @match        https://idp-idm.unimib.it/idp/profile/*
// @match        https://s3w.si.unimib.it/Root.do*
// @match        https://s3w.si.unimib.it/auth/studente/*
// @match        https://elearning.unimib.it/mod/resource/*
// @match        https://esamionline.elearning.unimib.it/*
// @icon         https://elearning.unimib.it/theme/image.php/bicocca/theme/1680851596/favicon
// @grant        none
// @run-at       document-start
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464890/Shork%27s%20Bicocca%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/464890/Shork%27s%20Bicocca%20Utilities.meta.js
// ==/UserScript==

window.addEventListener ("load", function() {
    //Set the following variables to "true" to enable them.

    //Jump to the login page when visiting e-Learning.
    var eLearning_autoRedirectToLogin = true;

    //Jump to the login page when visiting S3 (Segreterie Online).
    var S3_autoRedirectToLogin = true;

    //Jump to the login page when visiting EsamiOnline
    var esamiOnline_autoRedirectToLogin = true;

    //Automatically fill the login information. You'll need to insert the credentials some lines below.
    var autoLogin = false;

    //Automatically open files in the same tab when clicking files in e-Learning.
    var eLearning_filePageSkipper = true;

    //Resize videos so they better fit the screen in e-Learning.
    var eLearning_videoResize = true;

    //Replace your profile pic in S3 (Segreterie Online) with another one you like better. You'll need to insert the link some lines below.
    var S3_ProfilePicReplacer = false;

    //Enter your credentials to use autoLogin.
    //You have to encode your password to Base64 for it to work: https://www.base64encode.org/
    var username = "";
    var password = "";

    //Enter your image url ("https://examplesite.com") to use S3_ProfilePicReplacer. bit.ly links work.
    var imgurl = "";


    //Do not touch anything below ---------------------------------------------------------------------

    //Regular Expressions to compare the actual page URL and determine if functions can be applied.
    const s3StudentPageURL = new RegExp('https://s3w.si.unimib.it/auth/studente/*');
    const eLearningURL = new RegExp('https://elearning.unimib.it/*');
    const s3RootURL = new RegExp('https://s3w.si.unimib.it/Root.do*');
    const eLearningResourceURL = new RegExp('https://elearning.unimib.it/mod/resource/*');
    const authenticationURL = new RegExp('https://idp-idm.unimib.it/idp/profile/*');
    const eLearningVideoURL = new RegExp('https://elearning.unimib.it/mod/kalvidres/*');
    const esamiOnlineURL = new RegExp('https://esamionline.elearning.unimib.it/*');

    //e-Learning - jump to login
    if(eLearningURL.test(window.location.href) && eLearning_autoRedirectToLogin) {
        try {
            document.getElementsByClassName("fa fa-sign-in")[0].click();
        } catch {};

        try {
            document.getElementsByClassName("btn btn-primary btn-block")[0].click();
        } catch {};
    }

    //e-Learning - open files in the same tab
    if(eLearningResourceURL.test(window.location.href) && eLearning_filePageSkipper) {
        try {
            var linkresource = document.getElementsByClassName("resourceworkaround")[0].children[0].getAttribute("href");
            location.replace (linkresource);
        } catch {};
    }

    //e-Learning - bigger video player
    if(eLearningVideoURL.test(window.location.href) && eLearning_videoResize) {
        setTimeout(function() {
            var iframe = document.querySelector('.kaltura-player-iframe');
            iframe.style.height = '769px'; // New height
            iframe.style.width = '1080px'; // New width
        }, 1500);
    }

    //S3 - replace profile picture
    if(s3StudentPageURL.test(window.location.href) && S3_ProfilePicReplacer && !(imgurl === "")) {
        try {
            document.querySelector('img[alt="Foto Utente"]').src = imgurl;
            document.getElementById("gu-hpstu-boxDatiPersonali").children[0].children[1].children[0].setAttribute("src", imgurl);
        } catch {};
    }

    //S3, e-Learning and others - auto-login with Base64 password
    if(authenticationURL.test(window.location.href) && autoLogin && !(username === "" || password === "")) {
        //Loop protection in case of wrong credentials
        var loginFailTest = document.getElementsByClassName("alert alert-danger d-flex align-items-center alert-dismissible fade show idp-auth-failed-alert");
        if(loginFailTest.length == 0) {
            try {
                document.getElementById("username").value = username;
                document.getElementById("password").value = atob(password);
                document.getElementsByClassName("btn btn-primary btn-lg")[0].click();
            } catch {};
        }
    }

    //S3 - jump to login
    if(s3RootURL.test(window.location.href) && S3_autoRedirectToLogin) {
        //Italian page
        try {
            document.evaluate("//a[text()='dopo il login']", document).iterateNext().click();
        } catch {};

        //English page
        try {
            document.evaluate("//a[text()='login']", document).iterateNext().click();
        } catch {};
    }

    //EsamiOnline - jump to login
    if(esamiOnlineURL.test(window.location.href) && esamiOnline_autoRedirectToLogin) {
        try {
            document.getElementsByClassName("btn btn-primary btn-block")[0].click();
        } catch {};
    }


}, false);