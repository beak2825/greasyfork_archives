// ==UserScript==
// @name         Turnip Queuer
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Automatically Queue for the best Turnips
// @author       cpilton
// @require      https://code.jquery.com/jquery-3.5.0.min.js
// @include      *turnip.exchange/island/*
// @include      *turnip.exchange/islands
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402043/Turnip%20Queuer.user.js
// @updateURL https://update.greasyfork.org/scripts/402043/Turnip%20Queuer.meta.js
// ==/UserScript==

var USERNAME = "Mollie"; //Enter your AC name here
var REFRESH_TIME = 5000; //Wait time between re-attempts to join queue
var DESIRED_TURNIPS = 540; //Minimum turnip price for automatic queueing
var opened = [];

(function() {
    'use strict';
    $(document).ready(function() {
        if (window.location.href.indexOf('islands') !== -1) {
            console.log("TURNIP QUEUER: Refreshing Islands in 30 seconds.");
            REFRESH_TIME = 30000;

            setTimeout(function() {
            checkNotes();
            },5000);
            refreshPage();
        } else {
            checkPage();
        }
    });
})();

function checkNotes() {
    var notes = $('.note');
    var timeout = 500;
    $(notes).each(function() {
        var bells = $(this).find('p.ml-2');
        var note = this;
        $(bells).each(function() {
            if (this.innerText.indexOf('Bells') !== -1) {
                var bellValue = parseInt(this.innerText.replace('Bells', ''));
                if (bellValue > DESIRED_TURNIPS) {
                    var turnipCode = $(note).attr('data-turnip-code');
                    if (!opened.includes(turnipCode) && turnipCode !== "00000000") {
                    setTimeout(function() {
                        console.log('TURNIP QUEUER: Opening ' + turnipCode + " at " + bellValue + " bells per turnip");
                        window.open('https://turnip.exchange/island/' + $(note).attr('data-turnip-code'));
                    }, timeout);
                        opened.push(turnipCode);
                        timeout = timeout + 500;
                    }

                }
            }
        });
    });

    if (timeout == 500) {
        console.log("TURNIP QUEUER: No islands offering " + DESIRED_TURNIPS + " bells per turnip or more");
    }
}

function checkPage() {

    var list = $("li");
    var joined = false;

    $(list).each(function() {
        if (this.innerText.indexOf(USERNAME) !== -1) {
            joined == true;
        }
    });

    if (!joined) {
        checkButtons();
    } else {
        console.log("TURNIP QUEUER: You're already in queue.");
    }
}

function checkButtons() {
    var buttons = $("button");
    var join = false;
    var alreadyIn = false;

    $(buttons).each(function(){
        if (this.innerText == "Join this queue") {
            joinQueue(this);
            join = true;
        } else if (this.innerText == "Leave Queue") {
            alreadyIn = true;
            console.log("TURNIP QUEUER: You're already in queue.");
        }
    });

    if (!join && !alreadyIn) {
        console.log("TURNIP QUEUER: Queue is full. Trying again in " + REFRESH_TIME/1000 + " seconds.");
        refreshPage();
    }
}

function refreshPage() {
    setTimeout(function() {
        location.reload();
    }, REFRESH_TIME);
}

function joinQueue(queueButton) {
    queueButton.click();
    console.log("TURNIP QUEUER: Attempting to join queue.");
    setTimeout(function() {
        var input = $("input:text");
        enterName(input);
    },3500);
}


function enterName(inputField) {

inputField.val(USERNAME);
        addToList();
}

function addToList() {
    var buttons = $(".bg-primary");
    var join = false;

    $(buttons).each(function(){
        if (this.innerText == "Join") {
            this.click();
        }
    });

    refreshPage();
}

