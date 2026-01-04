// ==UserScript==
// @name         Brazzers - TWEAKED
// @namespace    none
// @version      0.9
// @description  View many short scenes without limits and links to download FULL scenes from LimeTorrents.
// @author       Bob Crawley
// @copyright    2021, bobcrawley (https://openuserjs.org/users/bobcrawley)
// @license      MIT
// @match        https://www.brazzers.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421554/Brazzers%20-%20TWEAKED.user.js
// @updateURL https://update.greasyfork.org/scripts/421554/Brazzers%20-%20TWEAKED.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function torrentify(){

        // Declaring variables to stop script from spazzing out.
        var i
        var sceneName

        // Add Torrentz link for scenes using jQuery

        // For all scenes on navigation pages
        var sceneCard = document.querySelectorAll("div.dtkdna-4.dtkdna-10");

        for (i=0; i<sceneCard.length; i++) {
            if (sceneCard[i].innerHTML.search("limetorrents.info")==-1)
            {
                sceneName = sceneCard[i].innerText;
                sceneCard[i].innerHTML += ('<span style="padding-left:5px;"><a target="_blank" href="https://www.limetorrents.info/search/all/'+sceneName+'"><img src="https://www.limetorrents.info/favicon.ico" width="16" height="16"></a></span>')
            }
        };

        // Not sure what this applies to.
        var sceneView = document.querySelectorAll("h2.sc-1b6bgon-1.kOFSRa");

        for (i=0; i<sceneView.length; i++) {
            if (sceneView[i].innerHTML.search("limetorrents.info")==-1)
            {
                sceneName = sceneView[i].innerText;
                sceneCard[i].innerHTML += ('<span style="padding-left:5px;"><a target="_blank" href="https://www.limetorrents.info/search/all/'+sceneName+'"><img src="https://www.limetorrents.info/favicon.ico" width="16" height="16"></a></span>')
            }
        };

        // For single page
        var singleScene = document.querySelector("h2.sc-1b6bgon-2.font-secondary")
        if(singleScene != null)
        {
            if (singleScene.innerHTML.search("limetorrents.info")==-1)
            {
                sceneName = singleScene.innerText;
                singleScene.innerHTML += ('<span style="padding-left:5px;"><a target="_blank" href="https://www.limetorrents.info/search/all/'+sceneName+'"><img src="https://www.limetorrents.info/favicon.ico" width="16" height="16"></a></span>')
            }
        }

        console.log("running torrentify")

    }

    function triggerButton() {
        var torrentTriggerButton = document.createElement("BUTTON");
        var torrentTriggerButtonText = document.createTextNode("Click me");
        torrentTriggerButton.appendChild(torrentTriggerButtonText);

        var bigButton = document.querySelector("div.udqyc6-0.ioxKuO")
        var smallButton = document.querySelector("div.udqyc6-0.jCNwqs")

        if (smallButton){
            smallButton.innerHTML = "<a id='torrentify' href='javascript:void(0);'> torrentify </a>"
        }

        if (bigButton){
            bigButton.innerHTML = "<a id='torrentify' href='javascript:void(0);'> torrentify </a>"
        }

        console.log("running triggerButton")
    }

    function cookiesFix() {
        function setCookies(cookieName, cookieValue, domainName, cookieExpires) {
            document.cookie = cookieName + "=" + cookieValue + ";path=/; domain=" + domainName + "; expires=" + cookieExpires;
        };

        var domainName = ".brazzers.com";

        // Unlimited Scene Views
        setCookies("cb-scene", "off", domainName, "");

        // Remove Social Media side
        setCookies("social-media", "off", domainName, "");

        // Bypass homepage I Agree
        setCookies("iAgree", "1", domainName, "");
        setCookies("ats", "eyJhIjo5NDk2LCJjIjo1NjU4NTQyNSwibiI6MTQsInMiOjg2LCJlIjo4NDI2LCJwIjozfQ==", domainName, "");

        // Remove bottom Join Now banner
        setCookies("wep1-29934-fl-rem", "1", domainName, "");

        // Remove below banner
        var banner = document.getElementsByClassName("sc-1mhpkp8-3 fJgjZN");
        if(banner[0] != null)
        {
        banner[0].innerHTML = ""
        };

        console.log("running cookiesFix")
    }

    document.addEventListener('click',() => {
        triggerButton();
        torrentify();
        cookiesFix();
    });

})();
