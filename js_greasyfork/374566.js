// ==UserScript==
// @name         Neopets Reddit Food Club to Petpage Converter
// @namespace    https://greasyfork.org/en/users/200321-realisticerror
// @version      3.1
// @description  Convert a table from the reddit food club page to petpage format
// @author       RealisticError (Clraik)
// @match        https://www.reddit.com/r/neopets/*
// @match        https://old.reddit.com/r/neopets/*
// @match        http://www.neopets.com/editpage.phtml?*
// @match        http://www.neopets.com/preview_homepage.phtml
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/374566/Neopets%20Reddit%20Food%20Club%20to%20Petpage%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/374566/Neopets%20Reddit%20Food%20Club%20to%20Petpage%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Instructions below:
    //Change the variable "playerToCopy" to the username of the player you would like to copy.
    //Change the variable "maxBetAmount" to your maximum bet, this is purely visual, though.
    //The code for your petpage will be printed at the top of the reddit replies section, there will be a large red header that tells you what you need to copy

    //These variables are the ones you need to change!
    var playerToCopy = "x3theforoufusx3";
    var maxBetAmount = "10000";
    var petForPetPage = "";   //Use this if you want to automatically set up your petpage.

    //These variables are internal, don't change them.
    var tableToCopy = $("div[data-author=" + playerToCopy + "] table")[0]
    var betTableString = '&lt;center>&lt;p>&lt;/p>&lt;center>&lt;table border="1" cellpadding="4" cellspacing="2" width="500">&lt;tr>&lt;td align="center" colspan="5">&lt;font size="4" color="black">&lt;b>Current Bets&lt;/b>&lt;/font>&lt;/td>&lt;/tr>' +
        '&lt;tr>&lt;td align="center">&lt;b>Round&lt;/b>&lt;/td>&lt;td align="center">&lt;b>Bet Info&lt;/b>&lt;/td>&lt;td align="center">&lt;b>Amount&lt;/b>&lt;/td>&lt;td align="center">&lt;b>Odds&lt;/b>&lt;/td>&lt;td align="center">&lt;b>Winnings&lt;/b>&lt;/td>&lt;/tr>';
    var runningTotal = 0;
    var petPageToAddTo = 'http://www.neopets.com/editpage.phtml?pet_name=' + petForPetPage;

    // Functions
    function fullNameOfPirate(nameToTranslate) {

        console.log(nameToTranslate);

        switch (nameToTranslate.trim()) {

            case "Franchisco": nameToTranslate = "Franchisco Corvallio";
                break;
            case "Stripey": nameToTranslate = "Ol' Stripey";
                break;
            case "Fairfax": nameToTranslate = "Fairfax the Deckhand"
                break;
            case "Sproggie": nameToTranslate = "Young Sproggie";
                break;
            case "Bonnie": nameToTranslate = "Bonnie Pip Culliford";
                break;
            case "Stuff": nameToTranslate = "Stuff-A-Roo";
                break;
            case "Gooblah": nameToTranslate = "Gooblah The Grarrl";
                break;
            case "Ned": nameToTranslate = "Ned The Skipper";
                break;
            case "Squire": nameToTranslate = "Squire Venable";
                break;
            case "Crossblades": nameToTranslate = "Captain Crossblades";
                break;
            case "Dan": nameToTranslate = "Scurvy Dan The Blade";
                break;
            case "Blackbeard": nameToTranslate = "Admiral Blackbeard";
                break;
            case "Puffo": nameToTranslate = "Puffo The Waister";
                break;
            case "Federismo": nameToTranslate = "Federsimo Corvallio";
                break;
            case "Peg Leg": nameToTranslate = "Peg Leg Percival";
                break;
            case "Lucky": nameToTranslate = "Lucky Mckyriggan";
                break;
            case "Tailhook": nameToTranslate = "The Tailhook Kid";
                break;
            case "Buck": nameToTranslate = "Buck Cutlass"
                break;
            case "Edmund": nameToTranslate = "Sir Edmund Ogletree";
                break;
            case "Orvinn": nameToTranslate = "Orvinn the First Mate";
                break;
            default: nameToTranslate = "Something went wrong, manually insert pirate here!";
                break;

        }
        return nameToTranslate;

    }

    function UpdatePetPage() {

        GM_setValue("PreviewPageAutoClick", true);
        GM_openInTab(petPageToAddTo, true);

    }

    if(window.location.href.includes("food_club_bets")) {
        for(var i = 0; i < tableToCopy.children[1].children.length; i++) {

            var betRow = tableToCopy.children[1].children[i];

            for(var x = 0; x < tableToCopy.children[1].children[i].children.length; x++) {

                var title = "";
                var currentTD = tableToCopy.children[1].children[i].children[x];

                switch(x) {
                    case 0: betTableString += '&lt;tr>&lt;td align="center">&lt;b>' + tableToCopy.children[0].children[0].children[0].innerText + '&lt;/b>&lt;/td>&lt;td>';
                        title = "StartRow";
                        break;
                    case 1: title = "Shipwreck";
                        break;
                    case 2: title = "Lagoon";
                        break;
                    case 3: title = "Treasure Island";
                        break;
                    case 4: title = "Hidden Cove";
                        break;
                    case 5: title = "Harpoon Harry's";
                        break;
                    case 6: betTableString += '&lt;td align="center">' + maxBetAmount + ' NP&lt;/td>'
                        title = "EndRow";
                        break;
                    default: title = "next";
                }

                if (currentTD.innerText.trim().length !== 0)  {

                    if (title === "StartRow") {
                        //skip
                    } else if(title !== "EndRow") {

                        betTableString += '&lt;b>' + title + '&lt;/b>: ' + fullNameOfPirate(currentTD.innerText) + '&lt;br>';

                    } else {
                        var total = (currentTD.innerText.substr(0, currentTD.innerText.indexOf(':')) * maxBetAmount);

                        betTableString += '&lt;td align="center">' + currentTD.innerText + '&lt;/td>&lt;td align="center">'+ total + " NP&lt;/td>&lt;/tr>";
                        runningTotal += total;
                    }

                }

            }


        }

        betTableString += '&lt;tr>&lt;td colspan="4" align="right">&lt;b>Total Possible Winnings&lt;/b>&lt;/td>&lt;td align="center">&lt;b>' + runningTotal + ' NP&lt;/b>&lt;/td>&lt;/tr>&lt;/table>&lt;/center>'

        $('div[data-author=' + playerToCopy + ']').parent()[0].innerHTML = '<div style="background-color:white"> <h1 style="color: red"> Copy the code below and paste it into your petpage, or click this button if you have set up auto-update:' +
            '<input type=button value="Auto Update" id="AutoUpdateButton">  </h1> <br />' + betTableString + '</div>' + $('div[data-author=' + playerToCopy + ']').parent()[0].innerHTML;

        //Add click event to auto update button
        $("#AutoUpdateButton").click(UpdatePetPage);


        betTableString = betTableString.replace(/&lt;/g, '<');

        GM_setValue("RedditFoodClubTable", betTableString);

        //On the petpage window, find the code input and paste the table. Then click preview page.
    } else if(window.location.href === petPageToAddTo) {
        if(GM_getValue("PreviewPageAutoClick")) {

            GM_setValue("PreviewPageAutoClick", false);
            $("#content > table > tbody > tr > td.content > center > center > form > textarea")[0].innerText = GM_getValue("RedditFoodClubTable");
            $('#content > table > tbody > tr > td.content > center > center > form > p:nth-child(4) > input[type="submit"]').click();

            //This will stop the autoclicking of save changes when you're generally editing a petpage.
            GM_setValue("PreviewHomePageClick", true);
        }

        //Save the changes on the next page.
    } else if(window.location.href === 'http://www.neopets.com/preview_homepage.phtml') {

        if(GM_getValue("PreviewHomePageClick")) {
            GM_setValue("PreviewHomePageClick", false);
            $('body > form > center > input[type="submit"]').click();
        }
    }
})();