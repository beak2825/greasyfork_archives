// ==UserScript==
// @name         BL R9.75 Script Manager
// @namespace    Bootleggers R9.75
// @version      0.0.4
// @description  Manage various scripts
// @author       BD
// @include      https://www.bootleggers.us/*
// @require      https://code.jquery.com/jquery-3.3.1.js
// @update       https://greasyfork.org/scripts/35754-bl-r9-75-script-manager/code/BL%20R975%20Script%20Manager.user.js
// @downloadURL https://update.greasyfork.org/scripts/35754/BL%20R975%20Script%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/35754/BL%20R975%20Script%20Manager.meta.js
// ==/UserScript==

$(document).ready(function() {
    var login = document.querySelectorAll("[value='Login!']")[0];
    var checkHealth = true;
    var yourName = localStorage.getItem("yourName") != null ? localStorage.getItem("yourName") : false;
    if ((!yourName) && (window.location.href != "https://www.bootleggers.us/")) {
        RetrieveUsername();
    }

    //If not the login or health/protection purchasing/repairing pages, check users health
    if ((checkHealth) && (!login) && (window.location.href.includes(".php")) && (!window.location.href.includes(".php?b=1"))) {
        CheckHealth();
    } else if (window.location.href == "https://www.bootleggers.us/scripts") {
        SetupScripts();
    } else if (window.location.href == "https://www.bootleggers.us/jailscript") {
        JailScriptWrapper();
    } else if ((window.location.href == "https://www.bootleggers.us/") ||  (window.location.href.includes("logout.php")) ){
        CleanUpPreferences();
    } else {
        document.title = yourName + " | " + document.title;
    }

    function SetupScripts() {
        document.title = yourName + " | Scripts";
        $("body").css({"margin": "0"});
        var crimesFrame = document.createElement("iframe");
        crimesFrame.width = "50%";
        crimesFrame.height = "50%";
        crimesFrame.style.position = "absolute";
        crimesFrame.src = "https://www.bootleggers.us/crimes.php";
        var gtaFrame = document.createElement("iframe");
        gtaFrame.width = "50%";
        gtaFrame.height = "50%";
        gtaFrame.style.position = "absolute";
        gtaFrame.style.left = "50%"
        gtaFrame.src = "https://www.bootleggers.us/autoburglary.php";
        var racketsFrame = document.createElement("iframe");
        racketsFrame.width = "50%";
        racketsFrame.height = "50%";
        racketsFrame.style.position = "absolute";
        racketsFrame.style.top = "50%";
        racketsFrame.src = "https://www.bootleggers.us/rackets.php";
        var blFrame = document.createElement("iframe");
        blFrame.width = "50%";
        blFrame.height = "50%";
        blFrame.style.position = "absolute";
        blFrame.style.top = "50%";
        blFrame.style.left = "50%";
        blFrame.src = "https://www.bootleggers.us/trainstation.php?s=2";
        var ocFrame = document.createElement("iframe");
        ocFrame.width = "100%";
        ocFrame.height = "50%";
        ocFrame.style.position = "absolute";
        ocFrame.style.top = "100%";
        ocFrame.src = "https://www.bootleggers.us/orgcrime.php";
        $("body").children().remove();
        $("body").append(crimesFrame);
        $("body").append(gtaFrame);
        $("body").append(racketsFrame);
        $("body").append(blFrame);
        $("body").append(ocFrame);
        $("iframe").css({"border-width":"0px"});
        setTimeout(function() {
            window.location.href = "https://www.bootleggers.us/scripts";
        }, 300000);
    }

    function JailScriptWrapper() {
        document.title = yourName + " | Jail Script";
        $("body").css({"margin": "0"});
        var jailFrame = document.createElement("iframe");
        jailFrame.width = "100%";
        jailFrame.height = "100%";
        jailFrame.style.position = "absolute";
        jailFrame.src = "https://www.bootleggers.us/jail.php";
        $("body").children().remove();
        $("body").append(jailFrame);
        $("iframe").css({"border-width":"0px"});
        setTimeout(function() {
            window.location.href = "https://www.bootleggers.us/jailscript";
        }, 5000);
    }

    function RetrieveUsername() {
        console.log("Script paused, retrieving your username from server. This should only ever happen once");
        $.ajax({
            async: false,
            type: "GET",
            url: "https://www.bootleggers.us/profile.php?tab=vote",
            success: function(data) {
                yourName = data.split("incentive=")[1].split(".")[0];
                localStorage.setItem("yourName", yourName);
                console.log("Script resumed");
            }
        });
    }

    function CheckHealth() {
        var health = document.querySelectorAll("[data-player-bar='health']")[0].getElementsByClassName("label")[0].innerText;
        var protection = document.querySelectorAll("[data-player-bar='protection']")[0].getElementsByClassName("label")[0].innerText;
        if (eval(health) < 1) {
            window.location.href = "https://www.bootleggers.us/gold.php?b=1";
        } else if (eval(protection) < 1) {
            window.location.href = "https://www.bootleggers.us/buy.php?b=1";
        }
    }

    function CleanUpPreferences() {
        localStorage.getItem("yourName") ? localStorage.removeItem("yourName") : null;
        localStorage.getItem("busting") ? localStorage.removeItem("busting") : null;
        localStorage.getItem("mission8") ? localStorage.removeItem("mission8") : null;
        localStorage.getItem("travelOveride") ? localStorage.removeItem("travelOveride") : null;
        localStorage.getItem("travelAllowed") ? localStorage.removeItem("travelAllowed") : null;
        localStorage.getItem("OCTravelAllowed") ? localStorage.removeItem("OCTravelAllowed") : null;
    }
});
