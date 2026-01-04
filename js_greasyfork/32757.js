// ==UserScript==
// @name          Flat Darkness - Stable
// @namespace     https://github.com/iHydra
// @version       1.5.7.1
// @description   Custom theme for Hack Forums.
// @include       http*://www.hackforums.net/*
// @include       http*://hackforums.net/*
// @author        iHydra
// @contributor   Hash G.
// @contributor   Kondax
// @contributor   Sasori
// @contributor   Yani
// @require       https://code.jquery.com/jquery-2.1.4.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.8.0/highlight.min.js
// @resource      MainCSS https://raw.githubusercontent.com/iHydra/flatdarkness/master/userscript/stylesheet_1.5.7.css
// @resource      HLCSS https://raw.githubusercontent.com/isagalaev/highlight.js/master/src/styles/monokai-sublime.css
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_getResourceText
// @run-at        document-ready
// @downloadURL https://update.greasyfork.org/scripts/32757/Flat%20Darkness%20-%20Stable.user.js
// @updateURL https://update.greasyfork.org/scripts/32757/Flat%20Darkness%20-%20Stable.meta.js
// ==/UserScript==

var quotedPosts = GM_getValue("quotedPosts") === undefined ? [] : GM_getValue("quotedPosts");
console.log(quotedPosts);

/* INFORMATION - READ */
// You can change Highlighter Theme: https://github.com/isagalaev/highlight.js/tree/master/src/styles || Demo of Themes: https://highlightjs.org/static/demo/
// You can change the preview button shortcut key if you scroll down to USER EDITING.

// Copyright (c) 2011 Pete Boere (the-echoplex.net) Free under terms of the MIT license: https://www.opensource.org/licenses/mit-license.php
!function(s){s.fn.alterClass=function(a,e){var r=this;if(-1===a.indexOf("*"))return r.removeClass(a),e?r.addClass(e):r;var n=new RegExp("\\s"+a.replace(/\*/g,"[A-Za-z0-9-_]+").split(" ").join("\\s|\\s")+"\\s","g");return r.each(function(a,e){for(var r=" "+e.className+" ";n.test(r);)r=r.replace(n," ");e.className=s.trim(r)}),e?r.addClass(e):r}}(jQuery);

var MainCSS = GM_getResourceText('MainCSS');
GM_addStyle(MainCSS);
var HLCSS = GM_getResourceText('HLCSS');
GM_addStyle(HLCSS);

/* Default settings */
if (!GM_getValue("quotedColor"))
    GM_setValue("quotedColor", "#00ffd2");
if (!GM_getValue("showLogo"))
    GM_setValue("showLogo", "false");
if (!GM_getValue("enableSFW"))
    GM_setValue("enableSFW", "false");
if (!GM_getValue("previewKey"))
    GM_setValue("previewKey", "w");
if (!GM_getValue("hideMenu"))
    GM_setValue("hideMenu", "false");
if (!GM_getValue("showTime"))
    GM_setValue("showTime", "false");
if (!GM_getValue("badges"))
    GM_setValue("badges", "false");

/* Retrieve custom settings */

var quotedColor = GM_getValue("quotedColor"); // Color for when quoted by someone - Keep inside quotes - if you enter hex code, put # as prefix. Ex: "#282828" vs. "teal"
var showLogo = (GM_getValue("showLogo") === "true"); // true to show logo, false to hide logo
var enableSFW = (GM_getValue("enableSFW") === "true"); // true to enable SFW, false to disable SFW (Safe For Work)
var previewKey = GM_getValue("previewKey"); // ALT + {KEY} for Chrome || ALT + SHIFT + {KEY} for Firefox - More Info: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey
var hideMenu = (GM_getValue("hideMenu") === "true"); // true to remove menu nav links, false to show.
var showTime = (GM_getValue("showTime") === "true"); // Show HF MyBB Time (timezone set in User CP)
var badges = (GM_getValue("badges") === "true"); // Badges Feature - false to disable feature. || **NOT DONE**

/* End */

$(window).load(function () { // Theme Color Scheme Changer
    var cp = $('<div class=\'cp\'/>');
    var select = $('<div class=\'select\'/>');
    var scrollTop = $('<a href=\"#\"/ title=\"Scroll to Top\"/ class=\"scrollToTop\"/></a>'); // Scroll To Top
    $('body').append(scrollTop, cp, select);
    var colours = {
        'black': '#393939',
        'blue': '#619ECB',
        'green': '#7ECB61',
        'orange': '#D29C2D',
        'purple': '#724FAD',
        'red': '#CB6161',
        'darkblue': '#00528f',
        'darkgreen': '#35713F',
        'darkorange': '#9A782E',
        'darkpurple': '#4D2D5E',
        'darkred': '#641C1C'
    };
    if (!localStorage.getItem('theme'))
        localStorage.setItem('theme', 'cl-' + Object.keys(colours) [0]);
    $('body').addClass(localStorage.getItem('theme') ? localStorage.getItem('theme')  : 'cl-' + Object.keys(colours) [0]);
    $('.cp').css('background', colours[$('body').attr('class').split(' ') [0].substring(3, $('body').attr('class').split(' ') [0].length)]);

    /* BEGIN SETTINGS MODAL */
    var css = "<style>.part { width: 25px; height: 25px; margin: 10px; border-radius: 50%; display: inline-block; } .link { cursor: pointer; color #fff; }</style>";

    // Modal in itself
    var settings = $('<div class=\'settings_flatdarkness\'/>');
    settings.attr("style", "background-color: rgb(51, 51, 51); bottom: auto; border: 1px solid rgb(0, 0, 0); height: 50%; left: 182px; margin: 0px; max-height: 95%; max-width: 95%; opacity: 1; overflow: auto; padding: 0px; position: fixed; right: auto; top: 128px; width: 75%; z-index: 999; display: none;'><span style='float: right; margin-right: 1%; margin-top: 0.5%;");
    settings.append("<h4>Flat Darkness Settings</h4>");

    // Color picker
    settings.append("<div>Colors:<div class='colors'></div>");
    $.each(colours, function (key, value) {
        settings.find(".colors").append($('<div class=\'part\' style=\'background: ' + value + ' !important;\' cid=\'' + key + '\'/>'));
    });
    settings.find(".colors").append("</div>");

    // Quoted color picker
    settings.append("<div>Quoted color:<div class='quotedColor'><input type='color' value='" + quotedColor + "'</div></div><br>");
    $("body").on("change", "input[type='color']", function() {
        GM_setValue("quotedColor", $("input[type='color']").val());
    });

    // Show logo settings
    settings.append("<div>Show Logo? <span class='link' id='showLogo'>" + showLogo + "</span></div>");
    $("body").on("click", "#showLogo", function() {
        $("#showLogo").html("" + !showLogo + "");
        GM_setValue("showLogo", "" + !showLogo + "");
    });

    // Enable SFW
    settings.append("<div>Enable SFW? <span class='link' id='enableSFW'>" + enableSFW + "</span></div>");
    $("body").on("click", "#enableSFW", function() {
        $("#enableSFW").html("" + !enableSFW + "");
        GM_setValue("enableSFW", "" + !enableSFW + "");
    });

    // Hide menu
    settings.append("<div>Hide Menu? <span class='link' id='hideMenu'>" + hideMenu + "</span></div>");
    $("body").on("click", "#hideMenu", function() {
        $("#hideMenu").html("" + !hideMenu + "");
        GM_setValue("hideMenu", "" + !hideMenu + "");
    });

    // Show time
    settings.append("<div>Show time? <span class='link' id='showTime'>" + showTime + "</span></div>");
    $("body").on("click", "#showTime", function() {
        $("#showTime").html("" + !showTime + "");
        GM_setValue("showTime", "" + !showTime + "");
    });

    // Badges
    settings.append("<div>Show badges? <span class='link' id='badges'>" + badges + "</span></div>");
    $("body").on("click", "#badges ", function() {
        $("#badges").html("" + !badges + "");
        GM_setValue("badges", "" + !badges + "");
    });

    $("body").append(css);
    $("body").append(settings);
    /* END SETTINGS MODAL */

    $('.cp').click(function () {
        $('.settings_flatdarkness').show();
    });
    $('.part').click(function () {
        var cl = 'cl-' + $(this).attr('cid');
        $('.cp').css('background', colours[$(this).attr('cid')]);
        $('body').alterClass('cl-*', cl);
        localStorage.setItem('theme', cl);
    });
});

/** Custom Functions **/

$('code').each(function(i, block) { // Highlight Syntax
    hljs.highlightBlock(block);
});

$(window).scroll(function(){ // Scroll to Top
    if ($(this).scrollTop() > 100) {
        $('.scrollToTop').fadeIn();
    } else {
        $('.scrollToTop').fadeOut();
    }
});
$('.scrollToTop').click(function(){
    $('html, body').animate({scrollTop: 0},800);
    return false;
});

$.fn.textWidth = function(text, font) { // AUTO GROW INPUT
    if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
    $.fn.textWidth.fakeEl.text(text || this.val() || this.text() || this.attr('placeholder')).css('font', font || this.css('font'));
    return $.fn.textWidth.fakeEl.width();
};

$('.width-dynamic').on('input', function() {
    var inputWidth = $(this).textWidth();
    $(this).css({
        width: inputWidth
    });
}).trigger('input');


function inputWidth(elem, minW, maxW) {
    elem = $(this);
    console.log(elem);
}

var targetElem = $('.width-dynamic');

inputWidth(targetElem); // AutoGrowInput

/** Public Vars **/

//var profileLink = $('#panel > strong:nth-child(1) > a:nth-child(1)').attr("href");
//var UserID = profileLink.split("=")[2];
//console.log(UserID);

/*function getBadgeList() {
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://ihydra.net/hf/flatdark/adminList.txt"+ "?t=" + Math.random(),
        onload: function(response){
            var reslines, templine, i, j, donorMap = {};
            reslines = response.responseText.split('\n');
        }
    });
} */

/*
 * Modifications (jQuery/jS for multi-browser support)
 */

$(document).ready(function () {
    if(1 == 1) { // window.location.pathname.indexOf("/newreply.php") == 0
        console.log("bbLive");
        var bbLiveButton = $('<button class="bitButton md-trigger" data-modal="modal-5">Newspaper</button>');
        $('div[class*="messageEditor"]').addClass("test");
        console.log("worked?");
    }
    $('div.menu > ul').attr('style','text-align:center !important;');
    $('img[src="' + imagepath + '/starstaff.png"]').attr('style', 'filter: hue-rotate(5deg) saturate(8); -webkit-filter: hue-rotate(5deg) saturate(8)'); // Staff Stars Color Change
    $('img[src="' + imagepath + '/dismiss_notice.gif"]').attr('src', 'https://i.imgur.com/uxvQQDI.png'); // PM Notif Dismiss Icon
    $('img[src="' + imagepath + '/add_buddy.gif"]').attr('src', 'https://i.imgur.com/3d5FKNX.png'); // Add Buddy Icon
    $('img[src="' + imagepath + '/remove_buddy.gif"]').attr('src', 'https://i.imgur.com/zDwBkq5.png'); // Remove Buddy Icon
    $('img[src="' + imagepath + '/add_ignore.gif"]').attr('src', 'https://i.imgur.com/u3NZbDu.png'); // Add Ignore Icon
    $('img[src="' + imagepath + '/remove_ignore.gif"]').attr('src', 'https://i.imgur.com/zDwBkq5.png'); // Remove Ignore Icon
    $('img[src$="/img/disable.png"]').attr('src', 'https://i.imgur.com/LXGekE9.png'); // Disable icon for multi-page loader userscript(not included)
    $('img[src$="/img/enable.png"]').attr('src', 'https://i.imgur.com/YHDATSF.png'); // Enable icon for multi-page loader userscript(not included)
    $('img[src="' + imagepath + '/minioff.gif"]').attr('src', 'https://i.imgur.com/AP6vLRo.png').attr('style', 'padding-bottom: 2px;'); // No Posts SF Icon
    $('img[src="' + imagepath + '/miniofflock.gif"]').attr('src', 'https://i.imgur.com/AP6vLRo.png').attr('style', 'padding-bottom: 2px;'); // No Posts SF Icon Locked
    $('img[src="' + imagepath + '/minion.gif"]').attr('src', 'https://i.imgur.com/Wsl1Gfc.png').attr('style', 'padding-bottom: 3px;'); // New Posts SF icon
    $('img[src="' + imagepath + '/spinner_big.gif"]').attr('src', 'https://i.imgur.com/y3wDcUA.gif'); // Quick Reply Spinner Change
    $('span:contains("Moderated")').addClass('sevenpad'); // Padding fix
    $('link[href*="star_ratings"]').remove(); // Star Ratings Change
    $('#pm_notice').removeClass('pm_alert').addClass('pm_alert2'); // Group vs. PM Alert
    $('div > code').dblclick(function() {
        $(this).select();
        var text = this,
            range, selection;
        if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(text);
            range.select();
        } else if (window.getSelection) {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });
    if($("img[id*='multiquote_']").attr("src") === imagepath + "/english/postbit_multiquote_on.gif") { // Multiquote IMG to CSS - By Snorlax
        $("img[id*='multiquote_']").hide().after("<button class='button' style='bottom: 7px;position: relative;cursor: pointer;outline: none;'>MQ-</button>");
    } else {
        $("img[id*='multiquote_']").hide().after("<button class='button' style='bottom: 7px;position: relative;cursor: pointer;outline: none;'>MQ+</button>");
    }
    $(".trow1 .button").on("click", function() {
        var postId = $(this).parent().attr("id").match(/multiquote_link_([0-9]*)/)[1];
        if($(this).text() == "MQ-") {
            quotedPosts.splice(quotedPosts.indexOf(postId), 1);
        } else {
            quotedPosts.push(postId);
            console.log(quotedPosts);
        }
        GM_setValue("quotedPosts", quotedPosts);
        $(this).text($(this).text() == "MQ+" ? "MQ-" : "MQ+");
    });
    $(".trow1 .button").each(function() {
        var postId = $(this).parent().attr("id").match(/multiquote_link_([0-9]*)/)[1];
        if(GM_getValue("quotedPosts").indexOf(postId) >= 0) {
            $(this).text("MQ-");
            console.log(postId);
        }
    });
    $("body").on("click", "#quickreply_multiquote", function() {
        console.log("Clicked");
        quotedPosts = [];
        GM_setValue("quotedPosts", quotedPosts);
        $(".button").each(function() {
            $(this).text("MQ+");
            console.log("SET TO MQ+");
        });
    });
    $('.button2[name="previewpost"]').attr('accesskey',previewKey); // Preview Key Hotkey Shortcut
    if(window.location.href == "https://hackforums.net/misc.php?action=buddypopup"){ // Buddy List Online Status Fix
        console.log('buddypopup');
        $('img[src="' + imagepath + '/buddy_away.gif"]').attr('src', 'https://i.imgur.com/x7dAaGE.png').attr('style', ''); // Away Status
        $('img[src="' + imagepath + '/buddy_online.gif"]').attr('src', 'https://i.imgur.com/lpKaTIB.png').attr('style', ''); // Online Status
        $('img[src="' + imagepath + '/buddy_offline.gif"]').attr('src', 'https://i.imgur.com/EKt4fXk.png').attr('style', ''); // Offline Status
        
    }else if(window.location.href == "https://hackforums.net/usercp.php?action=editlists"){
        $('img[src="' + imagepath + '/buddy_away.gif"]').attr('src', 'https://i.imgur.com/x7dAaGE.png').attr('style', 'vertical-align: top;'); // Away Status
        $('img[src="' + imagepath + '/buddy_online.gif"]').attr('src', 'https://i.imgur.com/lpKaTIB.png').attr('style', 'vertical-align: top;'); // Online Status
        $('img[src="' + imagepath + '/buddy_offline.gif"]').attr('src', 'https://i.imgur.com/EKt4fXk.png').attr('style', 'vertical-align: top;'); // Offline Status
    }else{
        $('img[src="' + imagepath + '/buddy_away.gif"]').attr('src', 'https://i.imgur.com/x7dAaGE.png').attr('style', 'position: absolute; padding-top: 4px;'); // Away Status
        $('img[src="' + imagepath + '/buddy_online.gif"]').attr('src', 'https://i.imgur.com/lpKaTIB.png').attr('style', 'position: absolute; padding-top: 4px;'); // Online Status
        $('img[src="' + imagepath + '/buddy_offline.gif"]').attr('src', 'https://i.imgur.com/EKt4fXk.png').attr('style', 'position: absolute; padding-top: 4px;'); // Offline Status
    }
    $("td[class*='trow'] input:checkbox").on("click", function() { // Mods & Staf Only - Highlight checkboxed rows - Conflicts with HFES for me, please test and report back
        console.log("something");
        var selector = $(this).closest("tr").find("td");
        if($(this).is(":checked")) {
            selector.css("background", "#242424");
        } else {
            selector.css("background", "");
        }
    });
    if(window.location.pathname == "/gauth.php"){
        $('span[class="float_right smalltext"]').attr('style','display: block !important'); // Gauth Reset Link Reveal
    }
    if(window.location.pathname == "/reputation.php"){
        $('a[href$="&show=positive"]').attr('style','font-size: 14px; background-color: #2DA546; border: 1px solid #2CC330; padding: 5px 10px 5px 10px; font-weight: bold; color: white;').after("<br/>"); // Positive Rep Box
        $('a[href$="&show=neutral"]').attr('style','font-size: 14px; background-color: #777777; border: 1px solid #949494; padding: 5px 10px 5px 10px; font-weight: bold; color: white;').after("<br/>"); // Neutral Rep Box
        $('a[href$="&show=negative"]').attr('style','font-size: 14px; background-color: #CC4444; border: 1px solid #FF5656; padding: 5px 10px 5px 10px; font-weight: bold; color: white;'); // Negative Rep Box
        $('strong[class="reputation_positive"]:contains("Positives")').remove(); // Legend Text Remove
        $('strong[class="reputation_neutral"]:contains("Neutrals")').remove(); // Legend Text Remove
        $('strong[class="reputation_negative"]:contains("Negatives")').remove(); // Legend Text Remove
        $('span[class="smalltext"]:contains("Total Reputation:")').find("br").remove(); // Received Rep Boxes Layout
        $('strong:contains("Total Reputation:")').before("<br/><br/>"); // Received Rep Boxes Layout
        $('span[class^="repbox"]').after("<br/><br/>"); // Received Rep Boxes Layout
    }
    if(showLogo === true){ // Show Logo
        $('img[src="https://hackforums.net/images/modern_bl/logo_bl.gif"]').attr('src', 'https://i.imgur.com/fAzkq6w.png');
		$('img[src="https://hackforums.net/images/modern_pl/logo_pl.gif"]').attr('src', 'https://i.imgur.com/fAzkq6w.png');
        $('div[class="logo"]').removeClass("logo").attr('style','text-align:center');
    }
    if(enableSFW === true) { // Enable Safe-For-Work
        $('div[style="overflow:hidden; max-height:200px;"]').attr('class','sigArea');
        $('div[style="overflow:hidden; max-height:200px;"] img').attr('class','sigImage');
        $('td[class="post_avatar"]').attr('style','display:none;');
        var sigShow = $('<input type="button" class="button sigButton" value="toggle" style="position:relative; float:right;" />');
        $("table[id*='post_']").each(function() {
            src = $(this).find("tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > div:nth-child(3) img").attr("src");
            if (src !== null) {
                $(this).find("tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > div:nth-child(3) img").attr('style','display:none;');
                $(this).find("tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > div:nth-child(3)").prepend('<input type="button" class="bitButton sigButton" value="toggle" style="position:relative; float:right; outline:none;" />');
            }
        });
        $('.sigButton').click(function() {
            $(this).parent().find('.sigImage').toggleClass("sigReveal");
            $(this).parent().toggleClass("sigResize");

        });
    }
    if(window.location.pathname != "/private.php") {
        var userName = $('div#panel > strong > a[href^="https://hackforums.net/member.php?action=profile&uid="]').text();
		if(!userName) userName = NULL;
        $('blockquote > cite:contains(' + userName + ')').css({'color': quotedColor, 'font-weight': 'bold','border-bottom': '1px dotted' + quotedColor});
    }
    if(window.location.pathname == "/private.php") {
        $('.quick_keys > form:nth-child(1) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(1) > div:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)').attr("style","border-bottom:0px !important;");
        $('#content > div.quick_keys > form > table > tbody > tr > td:nth-child(2) > table:nth-child(1) > tbody > tr > td > table > tbody > tr > td').attr("style","border-bottom:0px !important;");
        //$('input.textbox').addClass('width-dynamic').css('max-width','1020px').css('min-width','250px'); // Input Textbox Auto-Scale to Text Entered
    }
    if(window.location.pathname == "/showstaff.php" || window.location.pathname == "/showmods.php") {
        $('head').append('<style>td.trow1:hover {background: none !important;}</style>');
        $('td[class="trow1"]').attr("style","background: none; border: 0px !important;");
        $('div[style="width: 48%; min-height: 120px;float: left; border: 1px #4F3A6B solid; margin: 4px; padding: 2px;"]').attr("style","").addClass("staffCard");
        $('div[style="width: 48%; float: left; border: 1px #4F3A6B solid; margin: 4px; padding: 2px;"]').attr("style","").addClass("staffCard");
        $('td[class="trow1"][width="75%"]').attr("width","90%").attr("style","border: 0px !important").removeClass('trow1').addClass('staffCardParts').addClass('trow2');
        $('td[width="25%"]').attr("style","").addClass('staffCardParts');
    }
    if(window.location.pathname == "/showgroups.php") {
        $('head').append('<style>td.trow1:hover {background: none !important;}</style>');
        $('td[class="trow1"]').attr("style","background: none; border: 0px !important;");
        $('div[style="width: 46%; min-height:168px;float: left; border: 1px #4F3A6B solid; margin: 4px; padding: 2px;"]').attr("style","").addClass("groupsCard");
        $('td[class="trow1"][width="75%"]').attr("width","90%").attr("style","border: 0px !important").removeClass('trow1').addClass('groupsCardParts').addClass('trow2');
        $('td[width="25%"]').attr("style","").attr("valign","middle").addClass('groupsCardParts');
        $('td[valign="bottom"]').attr("style","background-color: #333; border-radius: 0px; vertical-align: baseline; font-size: 12px;");
        $('table[width="100%"]').attr("height","100%").attr("cellpadding","10");
    }
    if(window.location.pathname == "/newreply.php" || window.location.pathname == "/newthread.php") {
        $('table.tborder:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)').attr("style","border-bottom:0px !important;");
    }
    if(window.location.pathname == "/search.php") {
        $('#content > div.quick_keys > form > table > tbody > tr:nth-child(3) > td:nth-child(2) > table > tbody > tr > td:nth-child(1)').attr("style","border-bottom:0px !important;");
    }
    if (window.location.pathname == "/member.php") {
        $('.quick_keys > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)').attr("style","border-bottom:0px !important;");
        $('.quick_keys > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > br:nth-child(1)').remove();
        var sendToUID = $('.quick_keys > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2) > a:nth-child(1)').attr("href");
        $('span.largetext').append("<a class='bitButton' style='margin-left: 15px;' title='Send Private Message' href='" + sendToUID + "'>Send PM</a>");
    }
    if(hideMenu === true) {
        $("div[class='menu']").hide();
    }
    if(showTime === false) {
        $("div[class='largetext']").hide();
    }
    if(badges === true) { // Badge System >> Displays an icon as an identfier
        var adminList = [1]; // Omniscient
        var staffList = [992020,1292605,1570078]; // King of Hearts, Skorp, Sam Winchester
        var mentorList = [4066,330676,1320406,23809]; // Judge Dredd, Diabolic, Froggy, Viral Dragon
        var groupLeadersList = [992067,1642244,1406453,1121882,1191229,1066501,2052441,431105,80618,370510,55709,1148878,1961000,1469364,1812679,664032,1843672,2110841,561239]; // Nobility, Dubitus, Escrow, Avunit, Arrow, Moeseph, Billie Joe, The Grim, nokia2mon2, Alone Vampire, Glitch, Clique, Zexo, Prada, Ninetales, Water Aura, Infamy, Night Fury
        var devList = [561239, 2577525]; // iHydra, Hash G.
        for(var I = 0; I < devList.length; I++) {
            $("a[href='https://hackforums.net/member.php?action=profile&uid=" + devList[I] + "']").append('<img title="Developer of Flat Darkness" src="https://i.imgur.com/oH5ci89.png" style="position: relative;top: 3px; left: 2px; padding-left: 2px;">');
        }
        for(var I = 0; I < adminList.length; I++) {
            $("a[href='https://hackforums.net/member.php?action=profile&uid=" + adminList[I] + "']").append('<img title="Omniscient" src="https://i.imgur.com/xsUlRrE.png" style="position: relative;top: 3px;left: 2px; padding-left: 2px;">');
        }
        for(var I = 0; I < staffList.length; I++) {
            $("a[href='https://hackforums.net/member.php?action=profile&uid=" + staffList[I] + "']").append('<img title="HF Staff" src="https://i.imgur.com/UP5TYS4.png" style="position: relative;top: 3px;left: 2px; padding-left: 2px;">');
        }
        for(var I = 0; I < mentorList.length; I++) {
            $("a[href='https://hackforums.net/member.php?action=profile&uid=" + mentorList[I] + "']").append('<img title="HF Mentor" src="https://i.imgur.com/Tu5taXM.png" style="position: relative;top: 3px;left: 2px; padding-left: 2px;">');
        }
        for(var I = 0; I < groupLeadersList.length; I++) {
            $("a[href='https://hackforums.net/member.php?action=profile&uid=" + groupLeadersList[I] + "']").append('<img title="HF Group Leader" src="https://i.imgur.com/DvGiZJk.png" style="position: relative;top: 3px; left: 2px; padding-left: 2px;">');
        }
    }
    $('img[src="' + imagepath + '/groupimages/english/ub3r.png"]').attr('style', '-webkit-filter: hue-rotate(15deg); filter: hue-rotate(15deg);'); // Uber Userbar Color Change
    $('img[src="' + imagepath + '/starub3r2.png"]').attr('style', '-webkit-filter: hue-rotate(15deg); filter: hue-rotate(15deg);'); // Uber Stars Color Change
    $('strong span[style="rgb(56, 56, 56)"]').addClass("closedGroup"); // Changes Closed Usergroup Color
    $('strong:contains("Post:") > a[href^="showthread.php?tid="]').attr('id','postLink').attr('style','padding-top: 3px; padding-right: 5px; display: inline-block;'); // Post # Centered
    $('span[style="color:#383838"]').attr('style','color:#444444;'); // Closed Account Username Color Change
});

function BBVideoColorReplace(){ //BB Video and Color Icon Replace Delayer
    $('img[src="https://hackforums.net/jscripts/editor_themes/default/images/television.gif"]').attr('src','https://i.imgur.com/nhHILRQ.png'); // BB Editor - Video Embed
    $('img[src$="hackforums.net/jscripts/editor_themes/default/images/color.gif"]').attr('src', 'https://i.imgur.com/ZjMmUit.png'); // BB Editor - Color Picker
};
setTimeout(BBVideoColorReplace, 800);