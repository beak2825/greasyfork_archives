// ==UserScript==
// @name         SA Buttons
// @namespace    http://uberg.nu/
// @version      1.44
// @description  Something Awful Forums functions.
// @author       Ubergnu
// @match        https://forums.somethingawful.com/*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/34574/SA%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/34574/SA%20Buttons.meta.js
// ==/UserScript==


// Some UI values/constants
//
var SPOILER_TEXT_COLOR = ""; // Override for spoiler text color. Set this if there's a custom CSS (like SA Dark Redesign) that messes things up.
var BUTTON_TEXT_COLOR = "#444444";
var BUTTON_TEXT_COLOR_ACTIVE = "#DDDDDD";
var BUTTON_BACKGROUND = "";
var BUTTON_BACKGROUND_ACTIVE = "#888888";
var ELEM_VISIBLE = 1;
var ELEM_HIDDEN = 0;
var ELEM_DIMMED = 0.3;
var MAX_BAN_MESSAGES = 3;
var NO_BANS_IMAGE = "https://i.imgur.com/YQ5tnzB.png";

// Misc globals.
var avatarState;
var spoilerState;
var imageState = false;
var videoState = true;

// Add Menu buttons. Comment out unwanted ones here. Or set the order.
//
$("#content #thread .profilelinks").append("<li class='liSAB btnStop'>Stop</li>");
$("#content #thread .profilelinks").append("<li class='liSAB btnFold'>Fold</li>");
$("#content #thread .profilelinks").append("<li class='liSAB btnFade'>Avs</li>");
$("#content #thread .profilelinks").append("<li class='liSAB btnCtrl'>Buts</li>");
$("#content #thread .profilelinks").append("<li class='liSAB btnSplr'>Splr</li>");
$("#content #thread .profilelinks").append("<li class='liSAB btnProb'>Prob</li>");

// Insert CSS into <head> of page.
//
function addCss() {

    // Count the number of buttons in use.
    var buttonCount = $(".postlinks").eq(0).find(".liSAB").length;

    // Drop shadow for popup.
    var boxShadow = "box-shadow: 8px 8px 25px 0px rgba(0,0,0,0.75) !important;";

    var s = "";
    s += ".btnClosePopup {";
    s += "font-family: 'Roboto',sans-serif !important;";
    s += "font-size: 12px !important;";
    s += "border: none;";
    s += "outline: 0;";
    s += "background-color: #3b6d7d;";
    s += "color: #EEEEEE;";
    s += "border-radius: 9px !important;";
    s += "width: 130px !important;";
    s += "height: 30px !important; ";
    s += "margin-top: 5px;";
    s += "float: right;";
    s += "cursor: pointer;";
    s += boxShadow;
    s += "}";

    s += ".btnClosePopup:hover {";
    s += "background: #82b7c7 !important;";
    s += "color: #000000! important;";
    s += "}";

    s += ".SAB-dialog:focus";
    s += "{";
    s += "outline: none !important;";
    s += "}";

    s += ".msgContent {";
    s += "font-family: 'Roboto',sans-serif;";
    s += "font-size: 14px;";
    s += "width: 508px;";  //412
    s += "height: 258px;"; //154
    s += "background-color: #EEEEEE;";
    s += "margin: 0 auto;";
    s += "padding: 5px;";
    s += "overflow: auto;";
    s += "border-radius: 5px !important;";
    s += "}";

    s += "#msgPopupContent::-webkit-scrollbar-track";
    s += "{";
    s += "-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);";
    s += "border-radius: 10px !important;";
    s += "background-color: #F5F5F5;";
    s += "}";

    s += "#msgPopupContent::-webkit-scrollbar";
    s += "{";
    s += "width: 12px;";
    s += "background-color: #F5F5F5;";
    s += "}";
    s += "";

    s += "#msgPopupContent::-webkit-scrollbar-thumb";
    s += "{";
    s += "border-radius: 10px;";
    s += "-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);";
    s += "background-color: #bbbcbd;";
    s += "}";

    //#msgPopupWindow
    s += ".msgPopup {";
    s += "background-color: #3b6d7d;";
    s += "border-radius: 10px !important;";
    s += "box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75) !important;";
    s += "padding-top: 10px;";
    s += "display:none;";
    s += boxShadow;
    s += "}";

    //s += "#thread ul.profilelinks li:nth-last-of-type(-n+6) { "; // Use this if the buttons count screws up (comment out the row below).
    s += "#thread ul.profilelinks li:nth-last-of-type(-n+" + buttonCount + ") { ";
    s += "max-height: 15px !important; ";
    s += "padding: 0px 13px 10px 13px !important; ";
    s += "margin: 5px 0px 10px 0px; ";
    s += "line-height: 25px !important; ";
    s += "}";

    s += ".SAButton {";
    s += "border-radius: 11px !important;";
    s += "position: relative;";
    s += "font-size: 11px;";
    s += "height: 22px !important;";
    s += "padding: 2px;";
    s += "margin: 0px 0 0px 0 !important;";
    s += "cursor: pointer;";
    s += "color: " + BUTTON_TEXT_COLOR + ";";
    s += "}";

    s += ".ui-widget-overlay.SAB-custom-overlay";
    s += "{";
    s += "background-color: black;";
    s += "background-image: none;";
    s += "opacity: 0.4;";
    s += "z-index: 1040;    ";
    s += "}";

    s += ".SAB-draggable";
    s += "{";
    s += "border-top-left-radius: 20px !important;";
    s += "border-bottom: none;";
    s += "border-top-right-radius: 20px !important;";
    s += "box-shadow: inset 0 0 27px #3b6d7d !important;";
    s += "width: 96%;";
    s += "margin-left: 9px;";
    s += "cursor: move;";
    s += "}";

    // Inject CSS
    var head = document.getElementsByTagName('head')[0];
    var newCss = document.createElement('style');
    newCss.type = "text/css";
    newCss.innerHTML = s;
    head.appendChild(newCss);

    // Get the current text color in use (it can change if a custom CSS is installed). Can be overridden by changing the SPOILER_TEXT_COLOR constant.
    if (SPOILER_TEXT_COLOR === "")
    {
        //var col = $(".postbody").eq(0).attr("color");
        var elem = document.getElementsByClassName("postbody")[0];
        var col = window.getComputedStyle(elem, null).getPropertyValue("color");
        SPOILER_TEXT_COLOR = col;
    }
}
addCss();


// Functions that's probably not wanted by everyone.
//
// Remove special titles.
$(".special_title").hide();
// Completly hide ignored users posts.
$("a[title=\"DON'T DO IT!!\"]").parents().eq(3).hide();


// Menu buttons layout
//
var li = $(".postlinks .liSAB");
li.addClass("SAButton");
li.hover(
    function(){
        $(this).css("color", BUTTON_TEXT_COLOR_ACTIVE);
        $(this).css("height", "20px !important;");
        $(this).css("max-height", "20px !important;");
        $(this).css("border-radius", "10px !important;");
        $(this).animate({backgroundColor: BUTTON_BACKGROUND_ACTIVE}, 'fast', function(){
            if (!$(this).is(":hover"))
                li.css("background-color", BUTTON_BACKGROUND);
        });
    }, function() {
        li.css("background-color", BUTTON_BACKGROUND);
        li.css("color", BUTTON_TEXT_COLOR);
});


// Init the spoiler texts with saved value. Keep it in global var.
//
spoilerState = GM_getValue("SAB_spoilers");
toggleSpoilerText(spoilerState);


// Toggle play/pause for <video> with a click.
//
//$(".gfy_video").click(function(){
//$(".gifv_video, .gfy_video").click(function(){
//$(".gfy_video").click(function(){
// $(".gifv_video , .gfy_video").click(function(){

//     var tag = $(this).attr("tag");
//     alert("tag: " + tag);
//     if(typeof tag == "undefined") {
//         tag = "play";
//     }

//     tag = tag === "pause" ? "play" : "pause";

//     if (tag === "pause")
//     {
//         $(this).find("video")[0].pause();
//         $(this).attr("tag", "pause");
//     } else {
//         $(this).find("video")[0].play();
//         $(this).attr("tag", "play");
//     }

//     // if (videoState) {
//     //     $(this).find("video")[0].pause();
//     // } else {
//     //     $(this).find("video")[0].play();
//     // }
//     // videoState = !videoState;
// });


// Shrink images in posts by double clicking them. Click to restore.
//
$(".postbody").find("img").dblclick(function(){

     var tag = $(this).attr("tag");
     //alert("img tag: " + tag);
    if(typeof tag == "undefined")
        tag = "max";

    tag = tag == "min" ? "max" : "min";

    if (tag == "min")
    {
        $(this).css("height", "20px");
        $(this).css("width", "auto");
        $(this).attr("tag", "min");
    } else {
        $(this).css("height", "");
        $(this).attr("tag", "max");
    }
});


// Prob button click.
//
$(".postlinks ul .btnProb").click(function(){

    // Older Forums version, keep just in case.
    //var userID = $(this).parents().eq(2).find('td').eq(0).find('a').eq(1).attr('href');
    //var parts = userID.split("=");
    //var linkAddress = "/banlist.php?userid=" + parts[2];

    // Get userID and call showProbInfo() for that user.
    //
    var classes = $(this).parents().eq(3).find('tr').eq(0).find('td').eq(0).attr("class");
    var userID = classes.replace(/[^0-9]/gi, '');
    var linkAddress = "/banlist.php?userid=" + userID;

    showProbInfo(linkAddress);
});


// Show popup with ban/probation reason.
//
function showProbInfo(address) {

    // Get the last MAX_BAN_MESSAGES number of entries from the Leper's Colony page.
    $.get(address, function (data) {
        $(".result").html(data);
        var infoText = "";
        var rawText = "";

        // Assemble the popup text.
        for(let i=0; i<MAX_BAN_MESSAGES; i++)
        {
            var text = "";
            var infoRow = $('a[name="list"]', $(data)).nextAll().eq(0).children(":first").children('tr').eq(1+i).children('td'); //.eq(3);
            var time = $(infoRow).eq(1).text();
            var infoField = $(infoRow).eq(3);

            if (typeof $(infoField).html() != "undefined")
                text = $(infoField).html();

            rawText += text;
            infoText += "<i><font size='2'>" + time + "</font></i><br/>" + text;
            if (i<MAX_BAN_MESSAGES)
                infoText += "<br/><br/>";
        }

        // No probations/bans was found. Show a special message.
        if (rawText.length === 0) {
            var img = "<center><img src='" + NO_BANS_IMAGE + "'/></center>";
            infoText = "<i><font size='2'>This user is pure as the driven snow.</font></i><br/><br/>" + img;
        }

        // HTML for the popup.
        var win = "<div class='msgPopup' id='msgPopupWindow'>";
        win += "<p class='msgContent' id='msgPopupContent'>";
        //win += infoText;
        win += "</p></div>";

        // Inject popup HTML into page.
        var html = $.parseHTML(win);
        $("#something_awful").append(html);

        // Open dialog window.
        $(html).dialog({
            autoOpen: true,
            width: 550,
            height: 400,
            modal: true,
            resizable: true,
            open: function(event, ui) {

                // Clear all classes from jquery dialog.
                var main = $("div[aria-describedby='msgPopupWindow']");
                $(main).removeClass();
                $(main).addClass("SAB-dialog");
                $(main).find("div").not(":eq(0)").removeClass();
                $(main).find("button").removeClass();

                // Custom title bar
                var titleBar = $(main).find("div").eq(0);
                $(titleBar).removeClass();
                $(titleBar).addClass("ui-dialog-titlebar SAB-draggable");

                // Add own classes and content
                $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
                $(".msgContent").html(infoText);
                $("#msgPopupWindow").addClass('msgPopup');
                $("#msgPopupContent").addClass('msgContent');
                $(main).find("button").addClass('btnClosePopup');
                $(main).find("button").eq(0).hide();
                $('.ui-widget-overlay').addClass('SAB-custom-overlay');
            },
            buttons: [
                {
                    text: "Close",
                    "class": 'btnClosePopup',
                    click: function () {
                        $(this).dialog("close");
                        $('.ui-widget-overlay').removeClass('SAB-custom-overlay');
                        $("#msgPopupWindow").remove();  // Remove the injected HTML when closing popup.
                    }
                },
            ],
        });
    });
}


// Stop avatar animations
//
$(".postlinks ul .btnStop").click(function(){
    var avs = $(".title img");
    for(i=0; i<avs.length; i++)
        setFirstFrame(avs[i], i);
    gmSetValue("SA_animations", false);
});


// Toggle dim/hide/show all avatars
//
$(".postlinks ul .btnFade").click(function(){

    if (avatarState == "on"){
        $(".title img").animate({opacity: ELEM_DIMMED});
        $(".title canvas").animate({opacity: ELEM_DIMMED});
        gmSetValue("SA_avatars", "dim");
        avatarState = "dim";
    }
    else if(avatarState == "dim"){
        $(".title img").animate({opacity: ELEM_HIDDEN});
        $(".title canvas").animate({opacity: ELEM_HIDDEN});
        gmSetValue("SA_avatars", "off");
        avatarState = "off";
    }
    else if(avatarState == "off"){
        $(".title img").animate({opacity: ELEM_VISIBLE});
        $(".title canvas").animate({opacity: ELEM_VISIBLE});
        gmSetValue("SA_avatars", "on");
        avatarState = "on";
    }
});

// Show/hide spoilers.
//
$(".postlinks ul .btnSplr").click(function() {
    toggleSpoilerText(!spoilerState);
});

function toggleSpoilerText(state) {
    if (state) {
        $(".bbc-spoiler").css("background", "transparent");
        $(".bbc-spoiler").css("color", SPOILER_TEXT_COLOR);
        gmSetValue("SAB_spoilers", true);
        spoilerState = true;
    } else {
        $(".bbc-spoiler").css("background", "black");
        $(".bbc-spoiler").css("color", "black");
        gmSetValue("SAB_spoilers", false);
        spoilerState = false;
    }
}


// Toggle visibility for report/quote buttons
//
$(".postlinks ul .btnCtrl").toggle(
    function(){
        $(".postlinks .postbuttons").children().animate({opacity: ELEM_VISIBLE});
        gmSetValue("SA_reportButtons", true);
    }, function(){
        $(".postlinks .postbuttons").children().animate({opacity: ELEM_HIDDEN});
        gmSetValue("SA_reportButtons", false);
    }
);


// Hide/show posts
//
$(".postlinks ul .btnFold").click(function () {
    $(this).parents().eq(2).prev().find("dl[class='userinfo']").slideToggle(300);
    $(this).parents().eq(2).prev().children().last().slideToggle(300);
    //$(this).parents().eq(2).prev().children().first().children().first().children().slideToggle(500);
});


// Stop avatar animations if set
//
if (!GM_getValue("SA_animations", true))
{
    var avs = $(".title img");

    for(i=0; i<avs.length; i++)
    {
        setFirstFrame(avs[i]);
        //console.log(avs[i]);
    }
}


// Hide/show Report/Quote buttons depending on settings
//
if (GM_getValue("SA_reportButtons", false))
    $(".postlinks .postbuttons").children().animate({opacity: ELEM_VISIBLE});
else
    $(".postlinks .postbuttons").children().animate({opacity: ELEM_HIDDEN});


// Hide/show avatars depending on settings
//
avatarState = GM_getValue("SA_avatars");
switch(avatarState)
{
    case "on":
        $(".title img").animate({opacity: ELEM_VISIBLE});
        $(".title canvas").animate({opacity: ELEM_VISIBLE});
        GM_setValue("SA_avatars", "on");
        break;
    case "off":
        $(".title img").animate({opacity: ELEM_HIDDEN});
        $(".title canvas").animate({opacity: ELEM_HIDDEN});
        GM_setValue("SA_avatars", "off");
        break;
    case "dim":
        $(".title img").animate({opacity: ELEM_DIMMED});
        $(".title canvas").animate({opacity: ELEM_DIMMED});
        GM_setValue("SA_avatars", "dim");
        break;
    default:
        $(".title img").animate({opacity: ELEM_VISIBLE});
        $(".title canvas").animate({opacity: ELEM_VISIBLE});
        GM_setValue("SA_avatars", "on");
        break;
}

// Hide the whole user Title (avatar+text+tags)
//
$(".postlinks ul .btnText").click(function(){
    //var userTitle = $(this).parent().parent().parent().parent().find(".userinfo .title");
    var userTitle = $(this).parents().eq(3).find(".userinfo .title");
    var opa;

    if (avatarState == "on"){ opa = ELEM_VISIBLE; }
    else if(avatarState == "dim"){ opa = ELEM_DIMMED; }
    else if(avatarState == "off"){ opa = ELEM_HIDDEN; }

    if (userTitle.css('opacity') == ELEM_HIDDEN) {
        userTitle.animate({ opacity: opa });
    }else{
        userTitle.animate({ opacity: ELEM_HIDDEN });
    }

});


// -------------------------------------------
// Misc stuff
// -------------------------------------------

// Stop avatar animations
//
function setFirstFrame (img, idx) {
    var newCanvas = document.createElement("canvas");
    newCanvas.height = img.height;
    newCanvas.width = img.width;

    newCanvas.id = "cnvAv";

    newCanvas.getContext("2d").drawImage(img, 0, 0);
    img.parentNode.replaceChild(newCanvas, img);


    if (avatarState == "on")
        $(newCanvas).animate({opacity: ELEM_VISIBLE});

    else if(avatarState == "dim")
        $(newCanvas).animate({opacity: ELEM_DIMMED});

    else if(avatarState == "off")
        $(newCanvas).animate({opacity: ELEM_HIDDEN});

}


// Workaround for getting/setting values from inside an event
//
function gmSetValue(key, val)
{
    setTimeout(function() {
        GM_setValue(key, val);
    }, 0);
}

function gmGetValue(key, defaultval)
{
    setTimeout(function() {
        avatarState = GM_getValue(key, defaultval);
    }, 0);

    return avatarState;
}