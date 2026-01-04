// ==UserScript==
// @name         Find Football Teams
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://melbet.com/line/*
// @match        https://melbet.com/ru/line/*
// @match        https://football.ua/*
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue

// @require https://greasyfork.org/scripts/5279-greasemonkey-supervalues/code/GreaseMonkey_SuperValues.js


// @downloadURL https://update.greasyfork.org/scripts/408327/Find%20Football%20Teams.user.js
// @updateURL https://update.greasyfork.org/scripts/408327/Find%20Football%20Teams.meta.js
// ==/UserScript==

(function() {
    'use strict';
var team1Name = "";
    var team2Name = "";

    function openTeam(){


        console.log("team1Name " +$("h4 > a:contains(" + team1Name + ")").prop('href'));
console.log("team2Name " +$("h4 > a:contains(" + team2Name + ")").prop('href'));
if ((typeof $("h4 > a:contains(" + team1Name + ")").prop('href') !== 'undefined' || $("h4 > a:contains(" + team1Name + ")").prop('href') !== null) && (window.location.href.indexOf(encodeURI(team1Name)) > -1))
        document.location = $("h4 > a:contains(" + team1Name + ")").prop('href');


        if ((typeof $("h4 > a:contains(" + team2Name + ")").prop('href') !== 'undefined' || $("h4 > a:contains(" + team2Name + ")").prop('href') !== null) && (window.location.href.indexOf(encodeURI(team2Name)) > -1))
        document.location = $("h4 > a:contains(" + team2Name + ")").prop('href');



    }

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();


    //wait
    //document.querySelector("#ctl00_columnTop > article > div.clubs > div:nth-child(2) > div > h4 > a")

}

        document.onkeyup = function (e) {
        var key = e.keyCode;
            //alert(key);
            //t-84
if (e.altKey && key == 84)
{
team1Name = document.getElementsByClassName("teamName")[0].textContent;
team2Name = document.getElementsByClassName("teamName")[1].textContent;

    GM_SuperValue.set("team1Name", team1Name);
    GM_SuperValue.set("team2Name", team2Name);





    openInNewTab("https://football.ua/default.aspx?menu_id=search_team&search="+team1Name);

}
        }


          document.onreadystatechange = function () {
    console.log(document.readyState);

team1Name = GM_SuperValue.get("team1Name", "sorry");
team2Name = GM_SuperValue.get("team2Name", "sorry");

    if (document.readyState=="complete" ) {

        if (window.location.href.indexOf("football.ua") > -1) {

            if (window.location.href.indexOf(encodeURI(team1Name)) > -1)
            openInNewTab("https://football.ua/default.aspx?menu_id=search_team&search="+team2Name);

waitForKeyElements(".text", openTeam, 0);
        }

    }
  };



})();