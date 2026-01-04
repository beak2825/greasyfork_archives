// ==UserScript==
// @name        Dead Frontier - Tweaks
// @author      Discord: MoistGoat#5382
// @version     1.13.2
// @grant       window.close
// @description Makes using the browser portion better.
// @match       *://*.deadfrontier.com/*
// @namespace   https://greasyfork.org/users/966234
// @downloadURL https://update.greasyfork.org/scripts/452447/Dead%20Frontier%20-%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/452447/Dead%20Frontier%20-%20Tweaks.meta.js
// ==/UserScript==

$(document).ready(function () {
////// General changes -- OUTPOST
// Hides the top bar prompting if you have issues with Flash/Unity Webplayer
$("body > table:nth-child(1)").remove();

// Removes the Facebook bar
$("body > table:nth-child(2) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > div").remove();

// These following two remove the footer stuff below chat/music
$("body > table:nth-child(3)").remove();
$("body > table:nth-child(4)").remove();


// Fixes dusk shop text to not be multiline
$("#block13 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(5)").width("550");
$("body > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1)").remove();
// This section specifically looks for the screen being under the height of 800. Specifically created for Steam Deck usage.
// Also will prevent these tweaks being applied if you ever connect a monitor to the Steam Deck.
if (window.screen.availHeight < "801") {
    // Resizes the overall page sort of to remove the scroll bar for a cleaner look
    $("body > table:nth-child(2) > tbody > tr").height("715");

    // Makes the top 'banner' size smaller
    $("body > table:nth-child(2) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1)").height("29");

    // Changes the 'banner' image to a modified one to rectify resizing
    $("body > table:nth-child(2) > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td").css('background-image','url(https://i.imgur.com/76Kb1ZW.jpg)');

    // Changes left and right sides of the page to match the top 'banner' properly
    $("body > table:nth-child(2) > tbody > tr > td:nth-child(1)").css('background-image','url(https://i.imgur.com/9XE6Gni.jpg)');
    $("body > table:nth-child(2) > tbody > tr > td:nth-child(3)").css('background-image','url(https://i.imgur.com/RbEbMfF.jpg)');
}

////// INNER CITY SCREEN CLEANUP & AUTO LAUNCH
if (window.location.href == "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=21") {
  // Auto-opens the client
	// let elToClick = document.querySelector('#block13 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1) > button:nth-child(1)');
	// elToClick.click();

    // Disables "Launch Standalone Client" for a couple of seconds
   	//$("#block13 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1)").css('visibility',"hidden");

    // Moves the back to outpost button down, fixes it going hidden.
    document.querySelector("#block13 > table > tbody > tr > td > table > tbody > tr > td > div > table > tbody > tr:nth-child(1) > td > div > div > div").setAttribute("style", "position: relative;width: 700px;margin-left: auto;margin-right: auto;top: -400px;");

    // Hides the redundant "Launch in Browser" button
	$("#block13 > table > tbody > tr > td > table > tbody > tr > td > div > table > tbody > tr:nth-child(1) > td > div > div > table > tbody > tr:nth-child(2)").hide();

	// Hides the message about anti-virus
	$("#block13 > table > tbody > tr > td > table > tbody > tr > td > div > table > tbody > tr:nth-child(1) > td > div > div > table > tbody > tr:nth-child(6) > td > font").hide();

	// Moves the contents of the page up more
	$("body > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)").css('verticalAlign',"top");

	// Changes "Don't have standalone client" text
    $("#block13 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(1) > b:nth-child(1) > font:nth-child(1)").text("Client out of date?");

	// Changes "Windows Installer (50mb)" text
	$("#block13 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(1) > a:nth-child(4) > font:nth-child(1)").text("Latest Client Installer (50mb)");

    // Changes "Open Chat" text
	$("body > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(4) > a:nth-child(1) > font:nth-child(1)").text("Join Official Discord");

	// Spacing fix
	$("#block13 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1)").height("400");

 	// Re-enables "Launch Standalone Client" after 4 seconds, giving time for the game to launch alone.
	setTimeout(function () {
        document.querySelector("#block13 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(1)").innerHTML = '<a href="deadfrontier:hopethishelps" target="_blank"></a>'
        $("#block13 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(1) > a:nth-child(1)").text("Launching the client not working on Linux/Steam Deck? Click here to fix.");
        $("#block13 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1)").css('visibility',"visible") },1000);

    // Crude fix that prevents page from automatically refreshing and attempting to open multiple clients by loading a different page in 2 minutes time after loading.
    // As ideal it would be, the script cannot autoclose the tab itself without requiring user to do a workaround, which can pose a security risk.
    // Also I have no clue how to bypass the auto reloading of the page, so this will have to suffice.
    setTimeout(function () {
        window.close(); // Uses window close instead for now. If this is an issue please let me know!
       // window.location.href = 'https://files.deadfrontier.com/deadfrontier/DF3Dimages/misc/header.jpg';
    },120000);

}

});




