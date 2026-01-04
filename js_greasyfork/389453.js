// ==UserScript==
// @name         La Presse without crap
// @name:fr      La presse sans la cochonerie
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  Remove crap from lapresse.ca (eg. EXTRA and SUITE sections are in fact Ads, kill adblock detector, etc)
// @description:fr Enlève toute la cochonerie du site lapresse.ca (publicité déguisée, détecteur de adblock, etc.)
// @author       You
// @include      http://www.lapresse.ca/*
// @include      https://www.lapresse.ca/*
// @match        http://www.lapresse.ca
// @match        https://www.lapresse.ca
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389453/La%20Presse%20without%20crap.user.js
// @updateURL https://update.greasyfork.org/scripts/389453/La%20Presse%20without%20crap.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var yPos = 0;
     var elt;
     var isTimeoutInProgress=false;


    //window.noBlocker = false;

    [].forEach.call(
        document.querySelectorAll(".xtra, .SOUTIEN, .promotion, .contribution, .btnContribution, .mainNav__social, .ACT.info.icon, .nousJoindre, .visaCtn, .darkLinkBox, .socialShare, .contributionBox"),
        function (el) {
            el.style.visibility = "hidden";
            if(el != null) el.parentNode.removeChild(el);
        }
    );


    function toggleHeader(){
        elt = document.querySelector(".barreNav");
        if(elt != null){
            if(window.scrollY < 10){
                elt.style.visibility = "visible";
            } else {
                elt.style.visibility = "hidden";
            }
        }

        elt = document.querySelector(".navigation.mainNav");
        if(elt != null){
            if(window.scrollY < 200){
                elt.style.visibility = "visible";
            } else {
                elt.style.visibility = "hidden";
            }
        }

        /*
        elt = document.getElementById("mainHeader");
        if(elt != null){
            if(window.scrollY < 200){
                elt.style.visibility = "visible";
                elt.style.display = "";
            } else {
                elt.style.visibility = "hidden";
                elt.style.display = "none";
            }
        }
        */
    }

    document.getElementsByTagName('body')[0].onscroll = function() {
        console.log("scrolling AAA");
        //toggleHeader();
    };


    //remove the "..." icon because when mouse hover it, it cover the page with a stupid black rectangle.
    //.ACT.info.icon

    //remove the useless navigation bar at the top.
    //.barreNav

    //remove the useless section "nous joindre".
    //.nousJoindre



     function removeOtherCrap(fromSource) {
        //console.log("removeOtherCrap called from " + fromSource);


        /*
        elt = document.getElementsByTagName("BODY")[0];
        if(elt != null){
            elt.style.overflow = 'visible !important';
        }

        [].forEach.call(
            document.querySelectorAll("div[class^='sp_message_'], div[class^='sp_veil']"),
            function (el) {
                el.style.visibility = "hidden";
                //if(el != null) el.parentNode.removeChild(el);
            }
        );
        */

        //window.noBlocker = false;
        [].forEach.call(
            document.querySelectorAll(".sp-message-open"),
            function (el) {
                console.log("LPSLC .sp-message-open REMOVE CLASS!");
                el.classList.remove("sp-message-open");

                window.scroll(0,yPos);
                setTimeout(function(){
                    //console.log("***** SCROLL TO yPos=" + yPos);
                    window.scroll(0,yPos);
                }, 50);
                setTimeout(function(){
                    //console.log("***** SCROLL TO yPos=" + yPos);
                    window.scroll(0,yPos);
                }, 400);

                //other shit ???:
                //overflow: hidden !important;
                //position: fixed !important;
            }
        );

        var fermer = document.getElementById("Fermer");
        if(fermer != undefined ){
            console.log("LPSLC Closing FERMER");
            fermer.click();
            window.scroll(0,yPos);
            setTimeout(function(){
                //console.log("***** SCROLL TO yPos=" + yPos);
                window.scroll(0,yPos);
            }, 100);
            setTimeout(function(){
                //console.log("***** SCROLL TO yPos=" + yPos);
                window.scroll(0,yPos);
            }, 500);

        } else {
            if(window.scrollY > 0){
                yPos = window.scrollY;
            }
            //console.log("***** yPos=" + yPos);
        }

        var elt = document.querySelector("#root-message");
        if(elt != null){
            console.log("LPSLC #root-message FOUND!"); //TEST REQUIRED
            //elt.style.visibility = "hidden";
            //if(elt != null) elt.parentNode.removeChild(elt);
        }

        [].forEach.call(
            document.querySelectorAll(".fc-dialog-container"),
            function (el) {
                console.log("LPSLC .fc-dialog-container");
                el.style.visibility = "hidden";
                if(el != null) el.parentNode.removeChild(el);
            }
        );

        [].forEach.call(
            document.querySelectorAll("iframe.ab-in-app-message.ab-html-message.ab-modal-interactions"),
            function (el) {
                console.log("LPSLC iframe.ab-in-app-message");
                el.style.visibility = "hidden";
                if(el != null) el.parentNode.removeChild(el);
            }
        );

        [].forEach.call(
            document.querySelectorAll(".ab-pause-scrolling"),
            function (el) {
                console.log("LPSLC .ab-pause-scrolling");
                el.style.overflow = "scroll";
            }
        );


        [].forEach.call(
            document.querySelectorAll("div"),
            function (el) {
                if(el.style['z-index'] > '2000000000'){
                    console.log("LPSLC z-index");
                    el.style.visibility = "hidden";
                    if(el != null) el.parentNode.removeChild(el);
                }

            }
        );
    }

    removeOtherCrap("INITIAL");

    for(var i=0; i<200; i++){ //every 100ms during 20 seconds
        setTimeout(function(){
            removeOtherCrap("FREQUENCY");
        }, i*100);
    }
    setInterval(function(){
        removeOtherCrap("Interval");
    }, 400);

    window.onscroll = function() {isScrolling()};
    function isScrolling() {
        toggleHeader();
        if(isTimeoutInProgress){
            console.log("SKIPPING");
             return;
        }
        isTimeoutInProgress = true;
        setTimeout(function(){
            removeOtherCrap("SCROLLING");
            isTimeoutInProgress = false;
        }, 300);
    }




})();