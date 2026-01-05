
// ==UserScript==
// @name         Report Notifier
// @namespace    whitepimp007
// @description  Enables new reports to provide desktop notifications from within Chrome
// @update       https://greasyfork.org/scripts/27775-report-notifier/code/Report%20Notifier.user.js
// @version      1.6
// @include      https://epicmafia.com/report?status=open
// @include      https://epicmafia.com/report
// @grant        GM_uservar
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_onoffFlag
// @grant        GM_refreshtime
// @grant        GM_alreadyreported
// @downloadURL https://update.greasyfork.org/scripts/27775/Report%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/27775/Report%20Notifier.meta.js
// ==/UserScript==



// Setting up global variables
if (GM_getValue("GM_onoffFlag") === null) {
    GM_setValue("GM_onoffFlag",false);}
if (GM_getValue("GM_uservar") === null) {
    GM_setValue("GM_uservar",0);}
if (GM_getValue("GM_refreshtime") === null) {
    GM_setValue("GM_refreshtime",30);}
if (GM_getValue("GM_alreadyreported") === undefined) {
    GM_setValue("GM_alreadyreported",["Whitepimp007 is great","Ayyyyyyyyyyyy"]);}
// Setting up global variables



// Setting up local variables
var roundNavbar=document.querySelector("ul#subnav.cfix");
var constructResetList=document.createElement("li");
var constructResetLink=document.createElement("a");
var constructNotifierList=document.createElement("li");
var constructNotifierLink=document.createElement("a");

var onoff=GM_getValue("GM_onoffFlag");
var uservar=GM_getValue("GM_uservar");
var refreshtime=GM_getValue("GM_refreshtime");
var alreadyreported=GM_getValue("GM_alreadyreported");
// Setting up local variables



// Checking open reports to prevent duplicates
function enumerateReports(reports) {
    
    var count = 0;
    var numopen=document.getElementsByClassName("normal")[0].innerHTML; // Number of open reports
    if (numopen > 20) {
        numopen=20;
    }
    
    while (count<numopen) {
        if (alreadyreported.includes(document.getElementsByClassName("report_id redbutton")[count].innerHTML)) {
        } else {
            notifyUser(document.getElementsByClassName("user user_teeny report_user1")[count].textContent, // Reporter
                document.getElementsByClassName("user user_teeny report_user2")[count].textContent, // Reported
                document.getElementsByClassName("report_id redbutton")[count].innerHTML, // Report number
                document.getElementsByClassName("report_id redbutton")[count]); // Report link)
            alreadyreported.push(document.getElementsByClassName("report_id redbutton")[count].innerHTML); // Move to array to prevent repeat notifications
        }
        count ++;
    }
    GM_setValue("GM_alreadyreported",alreadyreported);
}
// Checking open reports to prevent duplicates



// Notification block
function notifyUser(reporter, reported, reportnumber, reportlink) {
    if (Notification.permission !== "granted") // Checking for notification permissions
        Notification.requestPermission(); // Getting notification permissions
    else {
        var notification = new Notification(reportnumber, {
            body: reporter+" filed a report against"+reported,
            sound: "http://newt.phys.unsw.edu.au/music/bellplates/sounds/equilateral_plate_no_second_partial.mp3", // Future support
            icon: "https://epicmafia.com/images/logo_new.png", // Epicmafia icon
            requireInteraction: false //CHANGE TO TRUE WHEN DONE WITH FUNCTION
        });
        notification.onclick = function () {
            window.open(reportlink);
        };
        return notification.timestamp; //BUILD OUT TIMESTAMP FOR STACK
    }
}
// Notification block



// Refresh timer block
var numremaining = refreshtime;

function startCount() {
    document.getElementById("counterfunction").textContent = "Notifier - Active ("+numremaining+")";
    numremaining--;
    if (numremaining>0) {
        setTimeout(startCount, 1000);
    } else {
        numremaining = refreshtime;
    }
}
// Refresh timer block



// Building main tab and functionality
if (onoff) {
    constructNotifierLink.textContent="Notifier - Active (";
    constructNotifierList.className = "sel"; // Lucid's tab focus class
    constructNotifierLink.className = "sel"; // Lucid's tab focus class
    constructNotifierLink.id = "counterfunction";
    constructNotifierLink.onclick=function() {
        GM_setValue("GM_onoffFlag",false); // Toggle variables to turn off
        onoff=false; // Toggle variables to turn off
        location.reload();
    };
    
    var refreshtimemilliseconds = refreshtime*1000;
    setTimeout(function(){ location.reload(); }, refreshtimemilliseconds);
    
    enumerateReports(document.getElementById("reports"));
    } else {
        constructNotifierLink.textContent="Notifier - Inactive";
        constructNotifierLink.onclick=function() {
            GM_setValue("GM_onoffFlag",true); // Toggle variables to turn on
            onoff=true; // Toggle variables to turn on
            refreshtime=window.prompt("How often would you like to check for reports in seconds?",refreshtime);
            if (refreshtime<5) {
                refreshtime = 5;
            }
            GM_setValue("GM_refreshtime", refreshtime); // Updating global variable
            location.reload();
            };
        }

constructNotifierList.appendChild(constructNotifierLink);
roundNavbar.appendChild(constructNotifierList);
startCount();
// Building main tab and functionality



// Building reset tab
constructResetLink.textContent="Reset";
constructResetLink.onclick=function() {
    GM_setValue("GM_alreadyreported",["Whitepimp007 is great","Ayyyyyyyyyyyy"]);
    location.reload();
};
constructResetList.appendChild(constructResetLink);
roundNavbar.appendChild(constructResetList);
// Building reset tab
