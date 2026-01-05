// ==UserScript==
// @name         Steam Queue Clicker
// @namespace    http://steamcommunity.com/id/raikoza
// @version      0.4
// @description  Process your Steam Discovery Queue automatically
// @author       RaikoZA
// @match        http://store.steampowered.com
// @include      http://store.steampowered.com/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26064/Steam%20Queue%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/26064/Steam%20Queue%20Clicker.meta.js
// ==/UserScript==


var come_back = "Come back tomorrow to earn more cards by browsing your Discovery Queue!";
var queue_empty = "dq_item dq_static_pos_2";
var next_in_queue = "next_in_queue_content";
var age_verify_skip = "btnv6_blue_hoverfade btn_small btn_next_in_queue_trigger";
var age_skip = "btnv6_blue_hoverfade btn_small";
var start_new_queue = "next_in_queue_content";
var begin_exploring = "begin_exploring";
var start_queue = "btnv6_lightblue_blue btn_medium";
var stop_queue = "subtext";

var time = new Date();
var get_time = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();


CheckTime();

function CheckTime() {
    if (get_time > "18:00:00") {
        console.log("Time is past 6PM, running script");
        RunClicks();
    } else {
        alert("Script will only run from 6PM onwards");
    }
}

function ClassElement(name) {
    return document.getElementsByClassName(name)[0];
}

function RunClicks() {

    var is_queue_empty = document.getElementsByClassName(queue_empty);

    if (is_queue_empty.length === 0){
        console.log("Your discovery queue is empty, come back tomorrow for more card drops.");
    } else if (document.getElementsByClassName(stop_queue).innerHTML === come_back) {
        console.log("All cards received today, come back tomorrow!");
    } else if (ClassElement(next_in_queue)) {
        ClassElement(next_in_queue).click();
        console.log("Next item in the queue");
    } else if (ClassElement(age_verify_skip)) {
        ClassElement(age_verify_skip).click();
        console.log("Skipping age verification");
    } else if (ClassElement(start_new_queue)) {
        ClassElement(start_new_queue).click();
        console.log("Starting new queue");
    } else if (ClassElement(begin_exploring)) {
        ClassElement(begin_exploring).click();
        console.log("Exploring has begun");
    } else if (ClassElement(start_queue)) {
        ClassElement(start_queue).click();
        console.log("Starting new queue");
    } else if (ClassElement(age_skip)) {
        ClassElement(age_skip).click();
        console.log("Skipping age verification");
    }
}