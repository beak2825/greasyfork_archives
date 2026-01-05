// ==UserScript==
// @name         WK Auto Commit (edited)
// @namespace    WKAUTOCOMMIT
// @version      0.42
// @description  Auto commit for Wanikani with critical list edit.
// @author       Johannes Mikulasch
// @match        http://www.wanikani.com/review/session*
// @match        https://www.wanikani.com/review/session*
// @match        http://www.wanikani.com/lesson/session*
// @match        https://www.wanikani.com/lesson/session*
// @grant        none
// @run-at       document-end
// @license      
// @downloadURL https://update.greasyfork.org/scripts/16969/WK%20Auto%20Commit%20%28edited%29.user.js
// @updateURL https://update.greasyfork.org/scripts/16969/WK%20Auto%20Commit%20%28edited%29.meta.js
// ==/UserScript==

/*
 * WK Auto Commit
 * If you typed in the correct answer then it is automatically commited.
 * Therefore, you have to use the 'enter' key way less than before.
 *
 * Version 0.42
 *  Added Mixed mode.
 * Version 0.41
 *  Fixed an issue with random mode when users did not have Ultimate Reorder script active.
 * Version 0.40
 *  Improved UI and such.
 * Version 0.35
 *  Edit by WillNiels to stop auto committing critical items
 * Version 0.3
 *  Script works now on the Lessons page too
 * Version 0.2
 *  Makes script work with Greasemonkey and Firefox
 * Version 0.1
 *  Initial version
 *
 */


/* jshint -W097 */
'use strict';

var activated = true;
var mode;
var click_threshold = 600;

var on_lessons_page = false;


// ---- Tweak these as needed ---- //
var percentCritical = '95'; // If you get an item correct less than this percent, it won't auto commit.
var randomChance = .50;  // If random is on it will only auto commit this often. ( 0 [never] to 1 [always] )

// Mixed mode, both rates apply
var percentCriticalMixed = '75'; // If you get an item correct less than this percent, it won't auto commit.
var randomChanceMixed = .80;  // Random chance to commit (limiting kanji only) if passed critical test.
// ------------------------------- //

//don't change these!
var apiKey;
var crit_list = [];
var thisItem;
var lastItem = null;
var roll = 0;

var RandomFn = Math.randomB || Math.random;

var detect_lessons_page = function() {
    // Returns true if on lessons page
    var current_url = window.location.href;
    var lessonsPattern = /^http[s]?:\/\/www.wanikani.com\/lesson\/session.*/;
    return lessonsPattern.test(current_url);
};

var toggle = function () {
    //Note: mode is only saved if user clicks the button.
    switch (mode) {
        case 'always': // To Mixed
            switchMode('mixed');
            break;
        case 'mixed': // To Critical
            if( on_lessons_page )
                switchMode('random');
            else 
                switchMode('critical');
            break;
        case 'critical': // To Random
            switchMode('random');
            break;
        case 'random': // To OFF
            switchMode('off');
            break;
        case 'off': // To Always
            switchMode('always');
            break;
    }
    saveMode();
};

var switchMode = function ( switchto ){
    switch (switchto) {
        case 'critical': // To Critical
            $("#WKAUTOCOMMIT_button").prop('title', "Switch to Random Mode");
            $("#WKAUTOCOMMIT_button").css({"opacity":"1.0"});
            $("#WKAUTOCOMMIT_button").css({"background-color":"#5C5"});
            $("#WKAUTOCOMMIT_button").text("Auto Commit: Critical List");
            mode = 'critical';
            generateList( percentCritical );
            break;
        case 'random': // To Random
            $("#WKAUTOCOMMIT_button").prop('title', "Switch auto commit OFF");
            $("#WKAUTOCOMMIT_button").css({"opacity":"1.0"});
            $("#WKAUTOCOMMIT_button").css({"background-color":"#55C"});
            $("#WKAUTOCOMMIT_button").text("Auto Commit: Random");
            mode = 'random';
            break;
        case 'off': // To OFF
            $("#WKAUTOCOMMIT_button").prop('title', "Switch to Always Mode");
            $("#WKAUTOCOMMIT_button").css({"opacity":"0.5"});
            $("#WKAUTOCOMMIT_button").css({"background-color":"#555"});
            $("#WKAUTOCOMMIT_button").text("Auto Commit: OFF");
            mode = 'off';
            break;
        case 'always': // To Always
            $("#WKAUTOCOMMIT_button").prop('title', "Switch to Mixed Mode");
            $("#WKAUTOCOMMIT_button").css({"opacity":"1.0"});
            $("#WKAUTOCOMMIT_button").css({"background-color":"#C55"});
            $("#WKAUTOCOMMIT_button").text("Auto Commit: Always");
            mode = 'always';
            break;
        case 'mixed': // To Always
            $("#WKAUTOCOMMIT_button").prop('title', "Switch to Critical Mode (or Random if on lessons)");
            $("#WKAUTOCOMMIT_button").css({"opacity":"1.0"});
            $("#WKAUTOCOMMIT_button").css({"background-color":"#2CC"});
            $("#WKAUTOCOMMIT_button").text("Auto Commit: Mixed");
            mode = 'mixed';
            generateList( percentCriticalMixed );
            break;
    }
};

var sanitize = function (str1) {
    var str2 = str1.replace(/\s/g, ''); // Removes Whitespaces
    str2 = str2.toLowerCase();
    return str2;
};

var commit = function () {
    $("#answer-form form button").click();
    setTimeout(function(){ $("#answer-form form button").click();}, click_threshold);
};

var check_input = function () {

    if (on_lessons_page) {
        var currentItem = $.jStorage.get("l/currentQuizItem");
        var currentquestiontype = $.jStorage.get("l/questionType");
    } else {
        var currentItem = $.jStorage.get("currentItem");
        var currentquestiontype = $.jStorage.get("questionType");

        // If the item is critical, don't auto submit
        if(mode == 'critical' || mode == 'mixed' ){
            thisItem = (currentItem.rad || currentItem.voc || currentItem.kan);
            for( var i in crit_list ){
                if( crit_list[i] == thisItem ){
                    return;
                }
            }
        }

    }


    // Random chance to block the item.
    if( currentItem != lastItem  ){
        roll = RandomFn(); //Really be careful here, weird things happen to the random function in my case.
    }
    //console.log("Roll is set to: " + roll + " with type: " + typeof(roll));

    lastItem = currentItem;

    if( mode == 'random'){
        if(roll > randomChance ){
            //console.log("Roll is more than the chance so we won't autocommit.");
            if(mode != 'random') console.log("This should never happen... random != " + mode);
            return;
        }
    }else if( mode == 'mixed' && currentItem.kan ){
        if(roll > randomChanceMixed ){
            //In mixed mode, kanji are randomly blocked but at a lower rate.
            if(mode != 'random') console.log("This should never happen... random != " + mode);
            return;
        }
    }


    var currentresponse = $("#user-response").val();

    var currentitem_response = null;

    // Get possible responses from current item depending on the task (reading or meaning)
    if (currentquestiontype === "meaning") {
        currentitem_response = currentItem.en;
        if (currentItem.syn) {
            currentitem_response = currentitem_response.concat(currentItem.syn);
        }
    } else if (currentquestiontype === "reading") {
        if (currentItem.voc) { // Vocab word
            currentitem_response = currentItem.kana;
        } else if (currentItem.emph === 'kunyomi') { // Kanji: Kun reading
            currentitem_response = currentItem.kun;
        } else if (currentItem.emph === 'onyomi') { // Kanji: On reading 
            currentitem_response = currentItem.on;
        } else {
            console.log("WK Auto Commit: Could not find response");
        }
    }

    for (var i in currentitem_response) {
        if (sanitize(currentresponse) === sanitize(currentitem_response[i]) ) {
            commit();
        }
    }
};

var register_check_input = function () {
    $("#user-response").on("keyup", function (event) {    
        if (mode != 'off') {
            check_input();
        }
    });
};

var addButtons = function () {

    $("<div />", {
        id : "WKAUTOCOMMIT_button",
        title : "Switch to Critical Mode",
    })
        .text("Auto Commit: Always")
        .css({"background-color":"#C55"})
        .css({"opacity":"1"})
        .css({"display":"inline-block"})
        .css({"font-size":"0.8125em"})
        .css({"color":"#FFF"})
        .css({"cursor":"pointer"})
        .css({"padding":"10px"})
        .css({"vertical-align":"bottom"})
        .on("click", toggle)
        .prependTo("footer");
};

var generateList = function (percent){
    crit_list = [];

    $.getJSON('/api/user/'+apiKey+'/critical-items/' + percent, function(json){
        if (json.error && json.error.code === 'user_not_found') {
            localStorage.removeItem('apiKey');
        }
        $(json.requested_information).each(function(i,v){
            try {
                var thing = v.character
                crit_list.push(thing);
            } catch(e) {}
        });
    });
};

var saveMode = function () {
    if( on_lessons_page )
        localStorage.setItem('wkac_lesson_mode',mode);
    else
        localStorage.setItem('wkac_review_mode',mode);
}

var loadMode = function () {
    if( on_lessons_page )
        mode = localStorage.getItem('wkac_lesson_mode');
    else
        mode = localStorage.getItem('wkac_review_mode');
}

//Thank you Wanikani Real Numbers
function retrieveAPIkey() {
    for(var i=0;i<document.getElementsByClassName('span6').length;i++){
        if(document.getElementsByClassName('span6')[i].getAttribute('placeholder')=="Key has not been generated")
            apiKey = document.getElementsByClassName('span6') [i].getAttribute('value');
    }
    alert('WaniKani Real Numbers API key set to: ' + apiKey);
    if (apiKey) {
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('WRN_doneReviews', 'true');
        //GM_setValue('apikey', apikey);
        //GM_setValue('doneReviews', true);
    }
}

var init = function () {  
    console.log('WK Auto Commit (a plugin for Wanikani): Initialization started');
    on_lessons_page = detect_lessons_page();
    addButtons();
    register_check_input();

    apiKey = localStorage.getItem('apiKey');
    if (!apiKey) {
        if (window.location.href.indexOf('account') != - 1) {
            retrieveAPIkey();
            apiKey = localStorage.getItem('apiKey');
        } else {
            var okcancel = confirm('WaniKani Auto Commit has no API key entered!\nPress OK to go to your settings page and retrieve your API key!');
            if (okcancel == true) {
                window.location = 'https://www.wanikani.com/account';
            }
        }
    }

    loadMode();
    if(!mode ){
        mode = 'always';
        saveMode();
    }

    switchMode(mode);

    console.log('WK Auto Commit: Initialization ended');
};

$(function(){
    init();
});