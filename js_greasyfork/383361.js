// ==UserScript==
// @name         fxp first comment bot
// @namespace    idk
// @version      1.4
// @description  be the first to comment everytime.
// @author       nktfh100
// @match        https://www.fxp.co.il/*
// @grant    GM_setValue
// @grant    GM_getValue
// @grant    GM_deleteValue
// @noframes
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/383361/fxp%20first%20comment%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/383361/fxp%20first%20comment%20bot.meta.js
// ==/UserScript==

//https://www.fxp.co.il/member.php?u=1089677




function stopButton(){
    $("#stop_button").remove();
    $('body').append('<input type="button" value="Start bot" id="start_button">')
    $("#start_button").css("position", "fixed").css("top", 10).css("left", 10).css('padding', '20px').css('margin', '30px');
    $('#start_button').click(function () { startButton() });

    GM_setValue('state', false);
}

function startButton(){
    $("#start_button").remove();

    $('body').append('<input type="button" value="Stop bot" id="stop_button">')
    $("#stop_button").css("position", "fixed").css("top", 10).css("left", 10).css('padding', '20px').css('margin', '30px');
    $('#stop_button').click(function () { stopButton() });

    GM_setValue('state', 'looking');
    GM_setValue('forum', window.location.href);
    clearInterval(funcLoop);
    funcLoop = setInterval(function() {checkNew();}, 300);
}

function checkNew() {
    var state_ = GM_getValue('state', false);
    if(state_ == 'looking') {

        var count;
        var replays;
        try {
            count = document.querySelector(`ol.threads li.threadbit div.nonsticky ul.threadstats li span.arreplycount a`);
            replays = parseInt(count.innerHTML);
        }
        catch(err) {
            count = document.querySelector(`ol.threads li.threadbit div.nonsticky ul.threadstats li span.arreplycount`);
            replays = parseInt(count.innerHTML);
        }
        console.debug(replays);
        if(replays == 0) {
            console.debug('0!!!');
            GM_setValue('state','posting');
            var post_ = document.querySelector(`ol.threads li.threadbit div.nonsticky div.threadinfo div.inner h3.threadtitle a.title`);
            var startTime = new Date();
            GM_setValue('startTime', startTime);
            post_.click();
        }

    }
    if(state_ == false) {
     clearInterval(funcLoop);
    }
}

var state_ = GM_getValue('state', false);
var funcLoop;
// states: false: not running, looking:waiting for you posts, posting: posting comment

$( document ).ready(function() {

    if (state_ == false) {// if bot is not running
        if (window.location.href.indexOf("forumdisplay.php") > -1) {
            $('body').append('<input type="button" value="Start bot" id="start_button">')
            $("#start_button").css("position", "fixed").css("top", 10).css("left", 10).css('padding', '20px').css('margin', '30px');
            $('#start_button').click(function () { startButton() });

        }
    }

    if(state_ == 'looking') {
        if (window.location.href.indexOf("forumdisplay.php") > -1) {
            console.debug('looking');
            $('body').append('<input type="button" value="Stop bot" id="stop_button">')
            $("#stop_button").css("position", "fixed").css("top", 10).css("left", 10).css('padding', '20px').css('margin', '30px');
            $('#stop_button').click(function () { stopButton() });
            funcLoop = setInterval(function() {checkNew();}, 300);
        }
    }
    if(state_ == "posting") {
        try {
            //code here by dacurse0 to get the text box
            var o = null;
            var t = "";
            var submitButton = document.getElementById("qr_submit");
            var iframe_ = document.getElementsByTagName("iframe");
            var attr;
            for (var i = 0; i < iframe_.length; i++) {
                if (attr = iframe_[i].getAttribute("title"), "Rich text editor, vB_Editor_QR_editor, press ALT 0 for help." == attr) {
                    o = iframe_[i];
                    break
                }
            }
            var textarea = o.contentDocument.getElementsByClassName("forum")[0];
            //
            textarea.scrollIntoView();

            textarea.innerHTML = 'ראשון';

            setTimeout(function(){ submitButton.click(); }, 800);

            setTimeout(function(){ GM_setValue('state', 'looking'); window.location.href = GM_getValue('forum', 'https://www.fxp.co.il/forumdisplay.php?f=21'); }, 2700);
        }
        catch(err) {
            GM_setValue('state', 'looking');
            window.location.href = GM_getValue('forum', 'https://www.fxp.co.il/forumdisplay.php?f=21');
        }
    }

});

