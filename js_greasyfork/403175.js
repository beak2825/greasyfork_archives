// ==UserScript==
// @name           The All Mighty
// @namespace      https://greasyfork.org/en/users/560174-adir-avisar
// @description    Wave builder for Travian Legends and Travian Codex Victoria
// @author         Mr Cheeses' team
// @include        *://*.travian.*/*
// @include        *://*.travian.*.*/*
// @include        *://*/*.travian.*/*
// @include        *://*/*.travian.*.*/*

// @version        1.5
// @downloadURL https://update.greasyfork.org/scripts/403175/The%20All%20Mighty.user.js
// @updateURL https://update.greasyfork.org/scripts/403175/The%20All%20Mighty.meta.js
// ==/UserScript==

function OneCodeToRuleThemAll () {
    'use strict';
    var version = '1.5';
    var scriptURL = 'https://greasyfork.org/en/scripts/403175-the-all-mighty';
    var OVER_VIEW_COLUMNS = ['tro', 'bui', 'att']
    var OVER_VIEW_COLORS = ['Blue', 'Black', 'Red']
    var OPTIONS = {
        "/village/statistics" : OVER_VIEW_COLUMNS.forEach(OverViewGenrCol), // Over view
        "/village/statistics?s=0" : OVER_VIEW_COLUMNS.forEach(OverViewGenrCol), // Over view second option
        "build.php?id=39&gid=16" : RobberyPrecenage() // Farm List
    }

    // This function changes the images to the onhover text in the over view.
    // Over View - Start //
    function OverViewGenrCol(name) {
        var counter = 0;
        for(var village = 0; village < document.getElementsByTagName('tbody')[0].getElementsByClassName(name).length; village++){
            // Variable reset
            counter = 1;
            if(document.getElementsByTagName('tbody')[0].getElementsByClassName(name).item(village).getElementsByTagName('img')[0]){
                for(var element = 0; element < document.getElementsByTagName('tbody')[0].getElementsByClassName(name).item(village).getElementsByTagName('a').length;element++){
                    // Change text value
                    document.getElementsByTagName('tbody')[0].getElementsByClassName(name)
                            .item(village).getElementsByTagName('a')[element].innerHTML = document.getElementsByTagName('tbody')[0].getElementsByClassName(name).
                            item(village).getElementsByTagName('img')[0].alt + '</br>'

                    // Change text size
                    document.getElementsByTagName('tbody')[0].getElementsByClassName(name)
                            .item(village).getElementsByTagName('a')[element].style.fontSize = '85%'

                    // Change text color
                    document.getElementsByTagName('tbody')[0].getElementsByClassName(name)
                            .item(village).getElementsByTagName('a')[element].style.color = OVER_VIEW_COLORS[counter % 3]
                     
                    // Add to counter to change the color of the next element
                    counter++
                }
            }
        }
    }
    // Over View - End //

    //****************//
    /******************/
    /******Buffer******/
    /******************/
    //****************//

    // Farm List - Start //
    function RobberyPrecenage() {
        var total = 0;
        var RaidLists = document.getElementsByClassName('troop_details inReturn');


        for (var i = 0; i < RaidLists.length; i++) {
            var RaidList = RaidLists[i];

            var carry = RaidList.getElementsByClassName('carry')

            if(carry.length > 1) {
                var current = carry[0].getElementsByClassName('value')[0].innerText.split('/')[0].replace(/\s/g, '');

                total += parseInt(current.replace(/\D/g, ""), 10);
            }
        }

        var header = document.getElementsByClassName('spacer')[0]

        header.innerText = header.innerText + ' Total = ' + total
    }

    function getValues(str) {
        return str.replace(/\D/g, " ").replace(/\s+/g,' ').trim()
    }

    // Calculate the precenage
    function CalculatePercentage(values) {
        var value = values.split(' ')
        return (value[0] / value[1] * 100).toFixed(2)
    }
    // Farm List - End //

    /********** begin of main code block ************/
    var URL = window.location.href // Get URL
    var URL_SPLITED = URL.split('/') // Split the URL
    var page = URL_SPLITED[URL_SPLITED.length -1] // Get the page

    OPTIONS[page] // Run the function for the page.
    /********** end of main code block ************/
}

OneCodeToRuleThemAll();