// ==UserScript==
// @name         An auto-trainer??!! (SGChooChoo)
// @namespace    https://digitalfishfun.com
// @version      0.2.9
// @description  Make da whoooole train automagically :D
// @author       joonatoona
// @include      https://www.steamgifts.com/giveaways/new*
// @include      https://www.steamgifts.com/giveaway/*
// @include      https://www.digitalfishfun.com/sgchoochoo*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/20413/An%20auto-trainer%21%21%20%28SGChooChoo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/20413/An%20auto-trainer%21%21%20%28SGChooChoo%29.meta.js
// ==/UserScript==

/*
|-=============================================-|
|  Everything above this point is the script.   |
|Do not modify unless you know what you're doing|
|-=============================================-|
*/

// CONFIG
var config = {
    linkText:"[NEXT]", // TEXT ON THE NEXT LINK [Default: "[NEXT]"]
    autoSubmit:true, // AUTOMATICALLY CLICK THE CREATE BUTTON [Default: true]
    buttonTop:false, // MOVE THE TRAIN BUTTON TO THE TOP [Default: false]
    buttonText:"CHOOO CHOOOOOOO", // TEXT ON THE BUTTON [Default: "CHOOO CHOOOOOOO"]
    groupId:"0000", // COMING SOON [Default: 0000]
    usejQueryUI:false // COMING SOON [Default: false]
};


/*
|-=============================================-|
|  Everything below this point is the script.   |
|Do not modify unless you know what you're doing|
|-=============================================-|
*/


console.log("test");

(function() {
    'use strict';

    console.log("test1");

    var dialogHTML = '<div id="setupTrain"><form><h3 align="center">It appears you haven\'t set up a train yet!</h3><input type="number" id="lenght" name="lenght" placeholder="Gib lenght (In hours)"/><br/>\
    <input type="range" id="lvl" name="lvl" placeholder="Minimum Level" min="0" max="10"/></div>"';

    var cTrain = sessionStorage.getItem("pGid");
    var doCart = sessionStorage.getItem("doCart");
    var isSettings = sessionStorage.getItem("isSettings");
    var timeOpen = parseInt(sessionStorage.getItem("timeOpen"));
    var groupId = "1898";
    var cL = sessionStorage.getItem("cL");
    var desc = sessionStorage.getItem("desc");
    var divTrain;
    
    if (config.usejQueryUI) {
        $("head").append('<link rel="stylesheet" href="https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css"><script src="https://code.jquery.com/ui/1.11.1/jquery-ui.min.js"></script>');
    }
    
    if (config.usejQueryUI) {
        $(document).load(function() {
            $("body").append(dialogHTML);
        });
    }

    function setupTrain() {
        if (config['usejQueryUI']) {
            divTrain =$( "#setupTrain" ).dialog({
                autoOpen: false,
                height: 300,
                width: 350,
                modal: true,
            });
            divTrain.dialog("open");
        }
        else {
            timeOpen = parseInt(prompt("It appears you haven't set up a train yet!\nHow long (In hours) would you like the giveaways to be open for?")*3600000);
            sessionStorage.setItem("timeOpen", timeOpen);
            cL = prompt("It appears you haven't set up a train yet!\nWhat should the minimum contributor level be?");
            sessionStorage.setItem("cL", cL);
            desc = prompt("It appears you haven't set up a train yet!\nWhat should the generic description be?");
            sessionStorage.setItem("desc", desc);
        }
    }

    function formatTime(time) {
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var date = new Date(time);
        var year = date.getFullYear();
        var month = months[date.getMonth()];
        var day = date.getDate();
        var hour = date.getHours();
        var stamp = "am";
        if (hour >= 12) {
            stamp = "pm";
        }
        if (hour > 12) {
            hour -= 12;
        }
        if (hour === 0) {
            hour = 12;
        }
        var min = date.getMinutes();
        if (min < 10) {
            min = "0"+min;
        }
        return month + " " + day + ", " + year + " " + hour + ":" + min + " " + stamp;
    }

    function applyDates() {
        $("input[name='start_time']").val(formatTime(Date.now()));

        $("input[name='end_time']").val(formatTime(Date.now()+timeOpen));
    }

    function applyRegionRestrictions() {
        $("div[data-checkbox-value='0']").trigger("click");
    }

    function applyGroup() {
        $("div[data-checkbox-value='invite_only']").trigger("click");
    }

    function applyLevel() {
        if (cL > 0) {
            $('input[name=contributor_level]').val(cL);
            $('.ui-slider-range').width(cL + '0%');
            $('.ui-slider-handle').css('left', cL + '0%');
            $('input[name=contributor_level]').next('div').find('span').text('level ' + cL);
        }
    }

    function applyGenericDescription(){
        var newDesc = $("textarea[name='description']").val().replace(desc, "") + "\n\n" + desc;
        if (cTrain !== null) {
            newDesc += "\n"+config.linkText+"(https://www.steamgifts.com/giveaway/"+sessionStorage.getItem("pGid")+"/)";
        }
        $("textarea[name='description']").val(newDesc);
    }

    function clickCreate(){
        $("form").first().submit();
    }

    var cPath = window.location.toString().split("/");

    if (cPath[2] == "www.steamgifts.com") {
        if (cPath[cPath.length-1] == "new") {
            if (config.buttonTop) {
                $(".form__rows").before('<br/><div id="addTrain" class="form__submit-button js__submit-form"><i class="fa fa-arrow-circle-right"></i> CHOOO CHOOOOOOO</div>');
            }
            else {
                $(".form__rows").after('<br/><div id="addTrain" class="form__submit-button js__submit-form"><i class="fa fa-arrow-circle-right"></i> CHOOO CHOOOOOOO</div>');
            }
            $("#addTrain").click(function() {
                if (isSettings === null) {
                    setupTrain();
                    if (!config.usejQueryUI) {
                        sessionStorage.setItem("isSettings", true);
                    }
                }
                applyDates();
                applyRegionRestrictions();
                applyGroup();
                applyLevel();
                applyGenericDescription();
                sessionStorage.setItem("doCart", true);
                sessionStorage.setItem("pGid", null);
                if (config.autoSubmit) {
                    clickCreate();
                }
            });
        }

        if (cPath[cPath.length-3] == "giveaway" && doCart == "true") {
            $(".featured__heading").after('<br/><div id="anothaOne" class="form__submit-button js__submit-form"><i class="fa fa-arrow-circle-right"></i> Anotha One</div>');
            $("#anothaOne").click(function() {
                window.location = "https://www.steamgifts.com/giveaways/new";
                sessionStorage.setItem("pGid", cPath[cPath.length-2]);
            });
            sessionStorage.setItem("doCart", false);
            doCart = false;
        }
    }
    if (cPath[2] == "www.digitalfishfun.com") {
        document.write("Test");
    }
})();