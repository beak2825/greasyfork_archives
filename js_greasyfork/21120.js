// ==UserScript==
// @name         UT Registration Improved
// @namespace    https://greasyfork.org/en/scripts/21120-ut-registration-improved
// @version      0.1.1
// @description  Improving UT course selection.
// @author       Allen
// @include      https://utdirect.utexas.edu/apps/registrar/course_schedule/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.0.0.js
// @require      https://code.jquery.com/ui/1.11.4/jquery-ui.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/chosen/1.5.1/chosen.jquery.js
// @downloadURL https://update.greasyfork.org/scripts/21120/UT%20Registration%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/21120/UT%20Registration%20Improved.meta.js
// ==/UserScript==

var address = window.location.href;

const fosStr = "fos_fl=";
const levelStr = "level=";

var fos = GetFoS();
var level = GetLevel();

var fosElement = document.getElementById("fos_fl");
var fosOptions = fosElement.options;

var formElement = fosElement.parentElement;

//-------------------------------------------------------------------------------

// ACTUAL CODE STARTS HERE

LevelControl();
SetFoSSelection(fos);



$("head").append (
    '<link '
    + 'href="https://cdnjs.cloudflare.com/ajax/libs/chosen/1.5.1/chosen.css" '
    + 'rel="stylesheet" type="text/css">'
);


$("#fos_fl").chosen();

$("#fos_fl_chosen").css("display", "inline-block");

$(".chosen-drop").css( "width", "400px");
$(".chosen-drop").css( "position", "fixed");

$('#fos_fl').on('chosen:showing_dropdown', function(evt, params) {
    $(".chosen-drop").css( "display", "block");
    $(".chosen-drop").css( "top", "auto");
    $(".chosen-drop").css( "left", "auto");
});

$('#fos_fl').on('chosen:hiding_dropdown', function(evt, params) {
    $(".chosen-drop").css( "display", "none");
    $(".chosen-drop").css( "top", "none");
    $(".chosen-drop").css( "left", "none");
});


// CODE ENDS HERE

//-------------------------------------------------------------------------------

// Gets index of whatever string you're searching for in the current URL
function GetIndex(str) {
    var index = address.indexOf(str);

    if (index > 0){
        return index + str.length;
    }
    else{
        return -1;
    }
}

// Gets the current Field of Study user is searching
function GetFoS() {

    var str = "";
    var index = GetIndex(fosStr);

    if (index > 0){
        var andIndex = index;
        while(address.charAt(andIndex) != '&' && andIndex != address.length){
            andIndex++;
        }

        str = address.substring(index, andIndex);
        str = str.replace('+', ' ');
        str = str.replace("%20", ' ');


    }

    return str;
}

// Gets the current Level user is searching
function GetLevel() {
    var str = "";
    var index = GetIndex(levelStr);

    if (index > 0){
        str = address.substring(index, index + 1);
        // return str;
    }

    return str;
}

// Sets the selected item in the Field of Study dropdown list
function SetFoSSelection(str){

    var index = 0;

    while(fosOptions[index].getAttribute("value") != str){
        index++;
    }

    fosElement.selectedIndex = index;

}

// Sets the selected item in the Level dropdown list
function SetLevelSelection(str, levelElement, levelOptions){

    var index = 0;

    while(levelOptions[index].getAttribute("value") != str){
        index++;
    }

    levelElement.selectedIndex = index;
}

// Runs the Level Selection
function LevelControl(){
    if (document.getElementById("level") == undefined){
        return;
    }

    var levelElement = document.getElementById("level");
    var levelOptions = levelElement.options;

    SetLevelSelection(level, levelElement, levelOptions);
}
