// ==UserScript==
// @name         Verm Trending
// @namespace    Verm Trending
// @version      0.1
// @description  Shows page of trending thread topics
// @author       Scripted
// @match        https://v3rmillion.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25640/Verm%20Trending.user.js
// @updateURL https://update.greasyfork.org/scripts/25640/Verm%20Trending.meta.js
// ==/UserScript==
(function() {
    'use strict';
//Created By Scripted aka Jesus the lawn mower
var loungeList = [];
var digitalList = [];
var normMarketList = [];
var roExploitList = [];
var roGamingList = [];
var complete = false; //put this on the final request;
//MAIN FUNCITONS START
function main() {
    fetchPages();
    displayButton();
    createCookies();
}

function fetchPages() {
    getLounge();
    getDigital();
    getNormMarket();
    getRobloxExploiting();
    getRobloxGaming();
}
//creates cookies for new users
function createCookies() {
    var cookieVal = getCookieValue("loungeVisible");
    if (cookieVal != "false") {
        if (cookieVal != "true") {

            //creating lounge cookie 
            var expiration_date = new Date();
            var cookie_string = '';
            expiration_date.setFullYear(expiration_date.getFullYear() + 1);
            cookie_string = "loungeVisible=true; path=/; expires=" + expiration_date.toUTCString();
            document.cookie = cookie_string;


            //creating alert cookie
            var expiration_date = new Date();
            var cookie_string = '';
            expiration_date.setFullYear(expiration_date.getFullYear() + 1);
            cookie_string = "alertsVisible=true; path=/; expires=" + expiration_date.toUTCString();
            document.cookie = cookie_string;

            //creating normal market cookie 
            var expiration_date = new Date();
            var cookie_string = '';
            expiration_date.setFullYear(expiration_date.getFullYear() + 1);
            cookie_string = "nMarketVisible=true; path=/; expires=" + expiration_date.toUTCString();
            document.cookie = cookie_string;

            //creating digital graphics cookie
            var expiration_date = new Date();
            var cookie_string = '';
            expiration_date.setFullYear(expiration_date.getFullYear() + 1);
            cookie_string = "digitalVibile=true; path=/; expires=" + expiration_date.toUTCString();
            document.cookie = cookie_string;

            //creating roblox exploiting cookie
            var expiration_date = new Date();
            var cookie_string = '';
            expiration_date.setFullYear(expiration_date.getFullYear() + 1);
            cookie_string = "roexploitingVisible=true; path=/; expires=" + expiration_date.toUTCString();
            document.cookie = cookie_string;

            //creating roblox gaming cookie
            var expiration_date = new Date();
            var cookie_string = '';
            expiration_date.setFullYear(expiration_date.getFullYear() + 1);
            cookie_string = "rogamingVisible=true; path=/; expires=" + expiration_date.toUTCString();
            document.cookie = cookie_string;
        }
    }
}
//creates display button
function displayButton() {
    var ul = document.getElementsByClassName("ddm")[0];
    var li = document.createElement("li");
    var a = document.createElement("a");
    var img = document.createElement("img");
    img.src = "http://www.freeiconspng.com/uploads/up-arrow-png-12.png";
    img.width = 15;
    img.height = 15;
    a.id = "btnList";
    a.addEventListener("click", displayPages, false);
    a.display = "flex";
    a.style.background = "#2a2a2a";
    a.appendChild(img);
    a.innerHTML += "&nbsp; View Trending Posts";
    li.appendChild(a);
    ul.appendChild(li);
}
//MAIN FUNCTIONS END

//DISPLAYING PAGES START
function displayPages() {
    var check = getCookieValue("alertEnabled");
    if (complete === true) {
        //edits the html wrapper
        document.getElementById("wrapper").innerHTML = newWrap;
        //creates settings even listener
        document.getElementById("showSettings").addEventListener("click", showSettings, false);

        var list = document.getElementsByTagName("tbody")[0];
        //Add threads to the sections

        //setting lounge 
        var loungeCheck = getCookieValue("loungeVisible");
        if (loungeCheck === "true") {
            for (var i = 0; i < loungeList.length; i++) {
                var z = list.querySelector("#loungeEnd");
                list.insertBefore(loungeList[i], z);
            }
        }
        //setting norm market
        var nMarketCheck = getCookieValue("nMarketVisible");
        if (nMarketCheck === "true") {
            for (var i = 0; i < normMarketList.length; i++) {
                z = list.querySelector("#nMarketEnd");
                list.insertBefore(normMarketList[i], z);
            }
        }
        //setting digital graphics
        var digitalCheck = getCookieValue("digitalVibile");
        if (digitalCheck === "true") {
            for (var i = 0; i < digitalList.length; i++) {
                z = list.querySelector("#digitalEnd");
                list.insertBefore(digitalList[i], z);
            }
        }
        //setting roblox exploiting
        var roexploitCheck = getCookieValue("roexploitingVisible");
        if (roexploitCheck === "true") {
            for (var i = 0; i < roExploitList.length; i++) {
                z = list.querySelector("#roexploitEnd");
                list.insertBefore(roExploitList[i], z);
            }
        }

        //setting roblox gaming
        var roGamingCheck = getCookieValue("rogamingVisible");
        if (roGamingCheck === "true") {
            for (var i = 0; i < roGamingList.length; i++) {
                z = list.querySelector("#robloxgameEnd");
                list.insertBefore(roGamingList[i], z);
            }
        }
    } else {
        if (check === "true") {
            alert("Please wait till the requests have finished");
        }
        console.log("Please wait till requests are finished.");
    }
}

//create settings
function showSettings() {
    var set = document.createElement("div");
    set.innerHTML = settingsMenu;
    set.setAttribute("id", "settingsMenuWrapper");
    document.getElementsByTagName("body")[0].appendChild(set);
    document.getElementById("closeSettings").addEventListener("click", closeSettings, false);

    //adding listeners for settings buttons
    //lounge btn listener
    document.getElementById("hideLounge").addEventListener("click", function(e) {
        e = window.event || e;
        if (this === e.target) {
            setCookies("loungeVisible");
            buttonChecks("loungeVisible", "hideLounge", "Lounge");
        }
    });
    //alert btn listener
    document.getElementById("disablePops").addEventListener("click", function(e) {
        e = window.event || e;
        if (this === e.target) {
            setCookies("alertsVisible");
            buttonChecks("alertsVisible", "disablePops", "Alert Notifications");
        }
    });
    //normal market listener
    document.getElementById("hidenMarket").addEventListener("click", function(e) {
        e = window.event || e;
        if (this === e.target) {
            setCookies("nMarketVisible");
            buttonChecks("nMarketVisible", "hidenMarket", "Norm Market");
        }
    });
    //digital grahpics listener
    document.getElementById("hideDigital").addEventListener("click", function(e) {
        e = window.event || e;
        if (this === e.target) {
            setCookies("digitalVibile");
            buttonChecks("digitalVibile", "hideDigital", "Digital Graphics");
        }
    });
    //roblox exploiting listener
    document.getElementById("hideRoExploiting").addEventListener("click", function(e) {
        e = window.event || e;
        if (this === e.target) {
            setCookies("roexploitingVisible");
            buttonChecks("roexploitingVisible", "hideRoExploiting", "Roblox Exploiting");
        }
    });
    //roblox gaming listner
    document.getElementById("hideRoGaming").addEventListener("click", function(e) {
        e = window.event || e;
        if (this === e.target) {
            setCookies("rogamingVisible");
            buttonChecks("rogamingVisible", "hideRoGaming", "Roblox Gaming");
        }
    });
}

function closeSettings() {
    document.getElementById("settingsMenuWrapper").remove();
}
//checks button lables for settings
function buttonChecks(cookie, btnName, txt) {

    //updating button text
    var cookieVal = getCookieValue(cookie);
    var btn = document.getElementById(btnName);

    if (cookieVal === "true") {
        btn.innerText = "Hide " + txt;

    } else {
        btn.innerText = "Show " + txt;

    }
    displayPages();
}
//setting cookies for the settings menu
function setCookies(cookie) {
    //****** personal note all new cookies will need to be added to the cookie creation list for new users.

    var cookieVal = getCookieValue(cookie);
    if (cookieVal === "false") {
        var expiration_date = new Date();
        var cookie_string = '';
        expiration_date.setFullYear(expiration_date.getFullYear() + 1);
        cookie_string = cookie + "=true; path=/; expires=" + expiration_date.toUTCString();
        document.cookie = cookie_string;

    } else {
        var expiration_date = new Date();
        var cookie_string = '';
        expiration_date.setFullYear(expiration_date.getFullYear() + 1);
        cookie_string = cookie + "=false; path=/; expires=" + expiration_date.toUTCString();
        document.cookie = cookie_string;

    }


}

//DISPLAYING PAGES END

//FETCHING THREADS START 
function getLounge() {
    complete = false;
    var loungeDoc;
    var data;
    var xhr = ("XMLHttpRequest" in window) ? new XMLHttpRequest() : new ActiveXObject("Msxml3.XMLHTTP");
    xhr.open("GET", 'https://v3rmillion.net/forumdisplay.php?fid=4&sortby=views&order=desc&datecut=1&prefix=0', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status == 200) {
            data = xhr.responseText;
            var loungeDoc = document.createElement('div');
            loungeDoc.innerHTML = data;
            var x = loungeDoc.getElementsByClassName("inline_row");
            var i = 2;
            for (i; i < 7; i++) {
                loungeList.push(x[i]);
            }
            console.log("Lounge : " + loungeList);
        }
    };
    xhr.send(null);
}

function getDigital() {
    var digitalDoc;
    var data;
    var xhr = ("XMLHttpRequest" in window) ? new XMLHttpRequest() : new ActiveXObject("Msxml3.XMLHTTP");
    xhr.open("GET", 'https://v3rmillion.net/forumdisplay.php?fid=35&sortby=views&order=desc&datecut=1&prefix=0', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status == 200) {
            data = xhr.responseText;
            var digitalDoc = document.createElement('div');
            digitalDoc.innerHTML = data;
            var x = digitalDoc.getElementsByClassName("inline_row");
            var i = 1;
            for (i; i < 7; i++) {
                digitalList.push(x[i]);
            }
            console.log("Digital Graphics : " + digitalList);
        }
    };
    xhr.send(null);
}

function getNormMarket() {
    var nMarketDoc;
    var data;
    var xhr = ("XMLHttpRequest" in window) ? new XMLHttpRequest() : new ActiveXObject("Msxml3.XMLHTTP");
    xhr.open("GET", 'https://v3rmillion.net/forumdisplay.php?fid=11&sortby=views&order=desc&datecut=1&prefix=0', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status == 200) {
            data = xhr.responseText;
            var nMarketDoc = document.createElement('div');
            nMarketDoc.innerHTML = data;
            var x = nMarketDoc.getElementsByClassName("inline_row");
            var i = 2;
            for (i; i < 7; i++) {
                normMarketList.push(x[i]);
            }
            console.log("Normal Market : " + normMarketList);
        }
    };
    xhr.send(null);

}

function getRobloxExploiting() {

    var roExploitDoc;
    var data;
    var xhr = ("XMLHttpRequest" in window) ? new XMLHttpRequest() : new ActiveXObject("Msxml3.XMLHTTP");
    xhr.open("GET", 'https://v3rmillion.net/forumdisplay.php?fid=10&sortby=views&order=desc&datecut=1&prefix=0', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status == 200) {
            data = xhr.responseText;
            var roExploitDoc = document.createElement('div');
            roExploitDoc.innerHTML = data;
            var x = roExploitDoc.getElementsByClassName("inline_row");
            var i = 3;
            for (i; i < 8; i++) {
                roExploitList.push(x[i]);
            }
            console.log("Roblox Exploit : " + roExploitList);

        }
    };
    xhr.send(null);
}

function getRobloxGaming() {

    var roGamingDoc;
    var data;
    var xhr = ("XMLHttpRequest" in window) ? new XMLHttpRequest() : new ActiveXObject("Msxml3.XMLHTTP");
    xhr.open("GET", 'https://v3rmillion.net/forumdisplay.php?fid=9&sortby=views&order=desc&datecut=1&prefix=0', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status == 200) {
            data = xhr.responseText;
            var roGamingDoc = document.createElement('div');
            roGamingDoc.innerHTML = data;
            var x = roGamingDoc.getElementsByClassName("inline_row");
            var i = 0;
            for (i; i < 5; i++) {
                roGamingList.push(x[i]);
            }
            console.log("Roblox Gaming : " + roGamingList);
            complete = true;
        }
    };
    xhr.send(null);
}
//FETCHING THREADS END


//CALLING THE MAIN FUNCITON TO START SCRIPT
main();

//cookie sorting
function getCookieValue(a, b) {
    b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

//html var 
var newWrap = "";
newWrap += "<div id=\"wrapper\">";
newWrap += "<div id=\"container\">";
newWrap += "";
newWrap += "";
newWrap += "<div class=\"navigation\">";
newWrap += "<!-- start: nav_bit -->";
newWrap += "<a href=\"https:\/\/v3rmillion.net\/index.php\">V3rmillion<\/a><!-- start: nav_sep -->";
newWrap += "›";
newWrap += "";
newWrap += "";
newWrap += "<a href=\"https:\/\/v3rmillion.net\/member.php?action=profile&amp;uid=2414\">Trending<\/a>";
newWrap += "";
newWrap += "<br>";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "<\/div>";
newWrap += "";
newWrap += "		<div id=\"content\">";
newWrap += "";
newWrap += "				";
newWrap += "				";
newWrap += "				";
newWrap += "				";
newWrap += "				";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "<table border=\"0\" cellspacing=\"0\" cellpadding=\"10\" class=\"tborder clear\">";
newWrap += "	<tbody><tr>";
newWrap += "		<td class=\"thead\" colspan=\"6\">";
newWrap += "			<div class=\"float_right\">";
newWrap += "				<span class=\"smalltext\"><strong><a href=\"https:\/\/v3rmillion.net\/member.php?action=profile&amp;uid=2414\">View Creators Profile<\/a><\/strong><\/span>";
newWrap += "			<\/div>";
newWrap += "			<div>";
newWrap += "				<strong>Trending<\/strong>";
newWrap += "			<\/div>";
newWrap += "		<\/td>";
newWrap += "	<\/tr>";
newWrap += "	<tr>";
newWrap += "		<td class=\"tcat\" colspan=\"3\" width=\"66%\"><span class=\"smalltext\"><strong><a href=\"forumdisplay.php?fid=4&amp;datecut=9999&amp;prefix=0&amp;sortby=subject&amp;order=asc\">Thread<\/a>  \/ <a href=\"forumdisplay.php?fid=4&amp;datecut=9999&amp;prefix=0&amp;sortby=starter&amp;order=asc\">Author<\/a> <\/strong><\/span><\/td>";
newWrap += "		<td class=\"tcat\" align=\"center\" width=\"7%\"><span class=\"smalltext\"><strong><a href=\"forumdisplay.php?fid=4&amp;datecut=9999&amp;prefix=0&amp;sortby=replies&amp;order=desc\">Replies<\/a> <\/strong><\/span><\/td>";
newWrap += "		<td class=\"tcat\" align=\"center\" width=\"7%\"><span class=\"smalltext\"><strong><a>Views<\/a> <\/strong><\/span><\/td>";
newWrap += "		";
newWrap += "		<td class=\"tcat\" align=\"right\" width=\"20%\"><span class=\"smalltext\"><strong><a href=\"forumdisplay.php?fid=4&amp;datecut=9999&amp;prefix=0&amp;sortby=lastpost&amp;order=desc\">Last Post<\/a> <!-- start: forumdisplay_orderarrow -->";
newWrap += "<span class=\"smalltext\">[<a href=\"forumdisplay.php?fid=4&amp;datecut=9999&amp;prefix=0&amp;sortby=lastpost&amp;order=asc\">asc<\/a>]<\/span>";
newWrap += "<!-- end: forumdisplay_orderarrow --><\/strong><\/span><\/td>";
newWrap += "		";
newWrap += "	<\/tr>";
newWrap += "	";
newWrap += "	";
newWrap += "	";
newWrap += "<tr id=\"Start\">";
newWrap += "<td colspan=\"6\" class=\"trow_sep\">Lounge Section<\/td>";
newWrap += "<\/tr>";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "<tr id=\"loungeEnd\">";
newWrap += "<td class=\"trow_sep\" colspan=\"6\">Normal Market Place<\/td>";
newWrap += "<\/tr><tr id=\"nMarketEnd\">";
newWrap += "<td class=\"trow_sep\" colspan=\"6\">Digital Graphics<\/td>";
newWrap += "<\/tr>";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "	";
newWrap += "<tr id=\"digitalEnd\">";
newWrap += "<td class=\"trow_sep\" colspan=\"6\">";
newWrap += "Roblox Exploiting";
newWrap += "<\/td>";
newWrap += "<\/tr><tr id=\"roexploitEnd\">";
newWrap += "<td class=\"trow_sep\" colspan=\"6\">";
newWrap += "Roblox Gaming";
newWrap += "<\/td>";
newWrap += "<\/tr><tr id=\"robloxgameEnd\">";
newWrap += "<td class=\"trow_sep\" colspan=\"6\">";
newWrap += "   <button id=\"showSettings\" style=\"margin-left: 1170px;\">Settings<\/button>";
newWrap += "<\/td>";
newWrap += "<\/tr><\/tbody><\/table>";
newWrap += "";
newWrap += "";
newWrap += "<br class=\"clear\">";
newWrap += "<br>";
newWrap += "<div class=\"float_left\">";
newWrap += "	<div class=\"float_left\">";
newWrap += "		<dl class=\"thread_legend smalltext\">";
newWrap += "			<dd><span class=\"thread_status newfolder\" title=\"New Posts\">&nbsp;<\/span> New Posts<\/dd>";
newWrap += "			<dd><span class=\"thread_status newhotfolder\" title=\"Hot Thread (New)\">&nbsp;<\/span> Hot Thread (New)<\/dd>";
newWrap += "			<dd><span class=\"thread_status hotfolder\" title=\"Hot Thread (No New)\">&nbsp;<\/span> Hot Thread (No New)<\/dd>";
newWrap += "		<\/dl>";
newWrap += "	<\/div>";
newWrap += "	<div class=\"float_left\">";
newWrap += "		<dl class=\"thread_legend smalltext\">";
newWrap += "			<dd><span class=\"thread_status folder\" title=\"No New Posts\">&nbsp;<\/span> No New Posts<\/dd>";
newWrap += "			<dd><span class=\"thread_status dot_folder\" title=\"Contains Posts by You\">&nbsp;<\/span> Contains Posts by You<\/dd>";
newWrap += "			<dd><span class=\"thread_status lockfolder\" title=\"Locked Thread\">&nbsp;<\/span> Locked Thread<\/dd>";
newWrap += "		<\/dl>";
newWrap += "	<\/div>";
newWrap += "	<br class=\"clear\">";
newWrap += "<\/div>";
newWrap += "";
newWrap += "<br class=\"clear\">";
newWrap += "";
newWrap += "<!-- end: forumdisplay_threadlist -->";
newWrap += "<!-- start: footer -->";
newWrap += "";
newWrap += "";
newWrap += "<div id=\"footer\">";
newWrap += "";
newWrap += "			<ul class=\"bottommenu\">";
newWrap += "                                <h2>Navigation<\/h2>";
newWrap += "								<li><a href=\"\/removals\"><i class=\"fa fa-times\"><\/i>&nbsp; Request Content Removal<\/a><\/li>";
newWrap += "				                <!-- start: footer_contactus -->";
newWrap += "<li><a href=\"https:\/\/v3rmillion.net\/contact.php\"><i class=\"fa fa-envelope\"><\/i>&nbsp; Contact Us<\/a><\/li>";
newWrap += "<!-- end: footer_contactus -->";
newWrap += "				<li><a href=\"legal.html\"><i class=\"fa fa-gavel\"><\/i>&nbsp; Legal Documents<\/a><\/li>";
newWrap += "			<\/ul> ";
newWrap += "		    <ul class=\"bottommenu\">";
newWrap += "                                <h2>Links<\/h2>";
newWrap += "								<li><a href=\"legal.html#priv\"><i class=\"fa fa-eye\"><\/i>&nbsp; Privacy Policy<\/a><\/li>";
newWrap += "								<li><a href=\"rules.php\"><i class=\"fa fa-flag\"><\/i>&nbsp; Rules<\/a><\/li>";
newWrap += "								<li><a href=\"autoupgrade.php\"><i class=\"fa fa-star\"><\/i>&nbsp; Upgrade<\/a><\/li>";
newWrap += "			<\/ul> ";
newWrap += "                        <div class=\"cRem\" id=\"about\">";
newWrap += "                        <h2>About Us<\/h2>";
newWrap += "Vermillion is a Programming and Gaming community forum dedicated to the conversation of a range of topics, within and out of the programming world. Join us today! If you have any questions, feel free to make a thread in our <a href=\"forumdisplay.php?fid=13\">User Support Section<\/a> or <a href=\"contact.php\">contact us by email.<\/a>";
newWrap += "							<br><br>If any content on this site is illegal, infringes on your copyright, or contains personal information, you can <a href=\"\/removals\">request to have it removed with this form<\/a>. If content is in violation of our <a href=\"rules.php\">rules<\/a>, please use the report button or contact a <a href=\"showteam.php\">staff member<\/a>.";
newWrap += "	<\/div>";
newWrap += "<\/div>";
newWrap += "			<div id=\"copyright\">";
newWrap += "				Powered By <a href=\"http:\/\/www.mybb.com\" target=\"_blank\">MyBB<\/a> © 2016";
newWrap += "			<\/div>";
newWrap += "";
newWrap += "<\/div>";
newWrap += "";
newWrap += "";
newWrap += "";
newWrap += "<!-- The following piece of code allows MyBB to run scheduled tasks. DO NOT REMOVE --><!-- start: task_image -->";
newWrap += "<!--<img src=\"https:\/\/v3rmillion.net\/task.php\" width=\"1\" height=\"1\" alt=\"\" \/>-->";
newWrap += "<!-- end: task_image --><!-- End task image code -->";
newWrap += "<script type=\"text\/javascript\">if(MyBB) { $([document, window]).bind(\"load\", function() { MyBB.detectDSTChange('-5'); }); }<\/script>";
newWrap += "";
newWrap += "<\/div>";
newWrap += "<\/div>";

var settingsMenu = "";
settingsMenu += "<div class=\"modal current\" style=\"position: fixed; top: 50%; left: 50%; margin-top: -200px; margin-left: -200px; z-index: 10000; display: block;\">";
settingsMenu += "    <div style=\"overflow-y: auto; max-height: 400px;\">";
settingsMenu += "        <table width=\"100%\" cellspacing=\"0\" cellpadding=\"10\" border=\"0\" align=\"center\" class=\"tborder\">";
settingsMenu += "            <tbody>";
settingsMenu += "                <tr>";
settingsMenu += "                    <td colspan=\"2\" class=\"thead\"><strong>Settings<\/strong><\/td>";
settingsMenu += "                <\/tr>";
settingsMenu += "                <tr>";
settingsMenu += "                    <td class=\"tcat\"><span class=\"smalltext\"><strong>  <button id=\"disablePops\">Hide Alert Notifications<\/button><\/strong><\/span><\/td>";
settingsMenu += "                    <td class=\"tcat\"><span class=\"smalltext\"><strong><button id=\"hideLounge\">Hide Lounge Section<\/button><\/strong><\/span><\/td>";
settingsMenu += "                <\/tr>";
settingsMenu += "                <tr>";
settingsMenu += "                    <td class=\"tcat\"><span class=\"smalltext\"><strong>  <button id=\"hidenMarket\">Hide Normal Market<\/button><\/strong><\/span><\/td>";
settingsMenu += "                    <td class=\"tcat\"><span class=\"smalltext\"><strong><button id=\"hideDigital\">Hide Digital Graphics<\/button><\/strong><\/span><\/td>";
settingsMenu += "                <\/tr>";
settingsMenu += "                <tr>";
settingsMenu += "                    <td class=\"tcat\"><span class=\"smalltext\"><strong>  <button id=\"hideRoExploiting\">Hide Roblox Exploiting<\/button><\/strong><\/span><\/td>";
settingsMenu += "                    <td class=\"tcat\"><span class=\"smalltext\"><strong><button id=\"hideRoGaming\">Hide Roblox Gaming<\/button><\/strong><\/span><\/td>";
settingsMenu += "                <\/tr>";
settingsMenu += "            <\/tbody>";
settingsMenu += "        <\/table>";
settingsMenu += "    <\/div><a id=\"closeSettings\" rel=\"modal:close\" class=\"close-modal \">Close<\/a>";
settingsMenu += "<\/div>";
})();