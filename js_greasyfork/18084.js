// ==UserScript==
// @name          Flat Darkness - Stable
// @namespace     https://github.com/iHydra
// @version       1.5.54
// @description   Custom theme for Hack Forums. Base theme by Sasori.
// @include       http://www.hackforums.net/*
// @include       http://hackforums.net/*
// @author        iHydra/Kondax/Sasori
// @require       https://code.jquery.com/jquery-2.1.4.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.8.0/highlight.min.js
// @resource      MainCSS https://raw.githubusercontent.com/StunningFX/StunningHFs/master/stylesheet_1.5.5.css
// @resource      HLCSS https://raw.githubusercontent.com/isagalaev/highlight.js/master/src/styles/monokai-sublime.css 
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_getResourceText
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/18084/Flat%20Darkness%20-%20Stable.user.js
// @updateURL https://update.greasyfork.org/scripts/18084/Flat%20Darkness%20-%20Stable.meta.js
// ==/UserScript==

var quotedPosts = GM_getValue("quotedPosts") == undefined ? [] : GM_getValue("quotedPosts");
console.log(quotedPosts);
//alert(GM_getValue("quotedPosts"));

/* INFORMATION - READ */
// You can change Highlighter Theme: https://github.com/isagalaev/highlight.js/tree/master/src/styles || Demo of Themes: https://highlightjs.org/static/demo/
// You can change the preview button shortcut key if you scroll down to USER EDITING.

// Copyright (c) 2011 Pete Boere (the-echoplex.net) Free under terms of the MIT license: http://www.opensource.org/licenses/mit-license.php
!function(s){s.fn.alterClass=function(a,e){var r=this;if(-1===a.indexOf("*"))return r.removeClass(a),e?r.addClass(e):r;var n=new RegExp("\\s"+a.replace(/\*/g,"[A-Za-z0-9-_]+").split(" ").join("\\s|\\s")+"\\s","g");return r.each(function(a,e){for(var r=" "+e.className+" ";n.test(r);)r=r.replace(n," ");e.className=s.trim(r)}),e?r.addClass(e):r}}(jQuery);

var MainCSS = GM_getResourceText('MainCSS');
GM_addStyle(MainCSS);
var HLCSS = GM_getResourceText('HLCSS');
GM_addStyle(HLCSS);

/*
 * USER EDITING
 */

var quotedColor = "#00ffd2"; // Color for when quoted by someone - Keep inside quotes - if you enter hex code, put # as prefix. Ex: "#282828" vs. "teal"
var showLogo = false; // true to show logo, false to hide logo
var enableSFW = false; // true to enable SFW, false to disable SFW (Safe For Work)
var previewKey = 'w'; // ALT + {KEY} for Chrome || ALT + SHIFT + {KEY} for Firefox - More Info: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey
var hideMenu = false; // true to remove menu nav links, false to show.
var badges = false; // Badges Feature - false to disable feature. || **NOT DONE**

/*
 * END USER EDITING
 */

$(window).load(function () { // Theme Color Scheme Changer
    var cp = $('<div class=\'cp\'/>');
    var select = $('<div class=\'select\'/>');
    $('body').append(cp, select);
    var colours = {
        'black': '#393939',
        'blue': '#619ECB',
        'green': '#0A8C0E',
        'orange': '#D29C2D',
        'purple': '#724FAD',
        'red': '#CB6161',
        'darkblue': '#00528f',
        'darkgreen': '#0A8C0E',
        'darkorange': '#9A782E',
        'darkpurple': '#4D2D5E',
        'darkred': '#641C1C'
    };
    if (!localStorage.getItem('theme'))
        localStorage.setItem('theme', 'cl-' + Object.keys(colours) [0]);
    $('body').addClass(localStorage.getItem('theme') ? localStorage.getItem('theme')  : 'cl-' + Object.keys(colours) [0]);
    $('.cp').css('background', colours[$('body').attr('class').split(' ') [0].substring(3, $('body').attr('class').split(' ') [0].length)]);
    $.each(colours, function (key, value) {
        select.append($('<div class=\'part\' style=\'background: ' + value + ' !important;\' cid=\'' + key + '\'/>'));
    });
    $('.cp').click(function () {
        $('.select').toggleClass('show');
    });
    $('.part').click(function () {
        var cl = 'cl-' + $(this).attr('cid');
        $('.cp').css('background', colours[$(this).attr('cid')]);
        $('body').alterClass('cl-*', cl);
        localStorage.setItem('theme', cl);
    });
});

/** START SETTINGS PANEL **/

// TBA

/** END SETTINGS PANEL **/


/** Custom Functions **/


$('code').each(function(i, block) { // Highlight Syntax
    hljs.highlightBlock(block);

});   


/*
 * Modifications (jQuery/jS for multi-browser support)
 */

$(document).ready(function () {
    $('div.menu > ul').attr('style','text-align:center !important;');
    $('img[src$="hackforums.net/images/modern_bl/starstaff.png"]').attr('style', 'filter: hue-rotate(5deg) saturate(8); -webkit-filter: hue-rotate(5deg) saturate(8)'); // Staff Stars Color Change
    $('img[src$="hackforums.net/images/modern_bl/dismiss_notice.gif"]').attr('src', 'http://i.imgur.com/uxvQQDI.png'); // PM Notif Dismiss Icon
    $('img[src$="hackforums.net/images/modern_bl/add_buddy.gif"]').attr('src', 'http://i.imgur.com/3d5FKNX.png'); // Add Buddy Icon
    $('img[src$="hackforums.net/images/modern_bl/remove_buddy.gif"]').attr('src', 'http://i.imgur.com/zDwBkq5.png'); // Remove Buddy Icon
    $('img[src$="hackforums.net/images/modern_bl/add_ignore.gif"]').attr('src', 'http://i.imgur.com/u3NZbDu.png'); // Add Ignore Icon
    $('img[src$="hackforums.net/images/modern_bl/remove_ignore.gif"]').attr('src', 'http://i.imgur.com/zDwBkq5.png'); // Remove Ignore Icon
    $('img[src$="/img/disable.png"]').attr('src', 'http://i.imgur.com/LXGekE9.png'); // Disable icon for multi-page loader userscript(not included)
    $('img[src$="/img/enable.png"]').attr('src', 'http://i.imgur.com/YHDATSF.png'); // Enable icon for multi-page loader userscript(not included)
    $('img[src$="hackforums.net/images/modern_bl/minioff.gif"]').attr('src', 'http://i.imgur.com/AP6vLRo.png').attr('style', 'padding-bottom: 2px;'); // No Posts SF Icon
    $('img[src$="hackforums.net/images/modern_bl/miniofflock.gif"]').attr('src', 'http://i.imgur.com/AP6vLRo.png').attr('style', 'padding-bottom: 2px;'); // No Posts SF Icon Locked
    $('img[src$="hackforums.net/images/modern_bl/minion.gif"]').attr('src', 'http://i.imgur.com/Wsl1Gfc.png').attr('style', 'padding-bottom: 3px;'); // New Posts SF icon
    $('img[src$="http://hackforums.net/images/modern_bl/spinner_big.gif"]').attr('src', 'http://i.imgur.com/y3wDcUA.gif'); // Quick Reply Spinner Change
    $('span:contains("Moderated")').addClass('sevenpad'); // Padding fix
    $('link[href*="star_ratings"]').remove(); // Star Ratings Change
    $('#pm_notice').removeClass('pm_alert').addClass('pm_alert2'); // Group vs. PM Alert

    $('code[class="hljs markdown"]').dblclick(function() {
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

    if($("img[id*='multiquote_']").attr("src") === "http://hackforums.net/images/modern_bl/english/postbit_multiquote_on.gif") { // Multiquote IMG to CSS - By Snorlax
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

    if(window.location.href == "http://hackforums.net/misc.php?action=buddypopup"){ // Buddy List Online Status Fix
        $('img[src$="hackforums.net/images/modern_bl/buddy_away.gif"]').attr('src', 'http://i.imgur.com/x7dAaGE.png').attr('style', ''); // Away Status
        $('img[src$="hackforums.net/images/modern_bl/buddy_online.gif"]').attr('src', 'http://i.imgur.com/lpKaTIB.png').attr('style', ''); // Online Status
        $('img[src$="hackforums.net/images/modern_bl/buddy_offline.gif"]').attr('src', 'http://i.imgur.com/EKt4fXk.png').attr('style', ''); // Offline Status  
    }else if(window.location.href == "http://hackforums.net/usercp.php?action=editlists"){
        $('img[src$="hackforums.net/images/modern_bl/buddy_away.gif"]').attr('src', 'http://i.imgur.com/x7dAaGE.png').attr('style', 'vertical-align: top;'); // Away Status
        $('img[src$="hackforums.net/images/modern_bl/buddy_online.gif"]').attr('src', 'http://i.imgur.com/lpKaTIB.png').attr('style', 'vertical-align: top;'); // Online Status
        $('img[src$="hackforums.net/images/modern_bl/buddy_offline.gif"]').attr('src', 'http://i.imgur.com/EKt4fXk.png').attr('style', 'vertical-align: top;'); // Offline Status  
    }else{
        $('img[src$="hackforums.net/images/modern_bl/buddy_away.gif"]').attr('src', 'http://i.imgur.com/x7dAaGE.png').attr('style', 'position: absolute; padding-top: 4px;'); // Away Status
        $('img[src$="hackforums.net/images/modern_bl/buddy_online.gif"]').attr('src', 'http://i.imgur.com/lpKaTIB.png').attr('style', 'position: absolute; padding-top: 4px;'); // Online Status
        $('img[src$="hackforums.net/images/modern_bl/buddy_offline.gif"]').attr('src', 'http://i.imgur.com/EKt4fXk.png').attr('style', 'position: absolute; padding-top: 4px;'); // Offline Status
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
        $('img[src$="http://hackforums.net/images/modern_bl/logo_bl.gif"]').attr('src', 'http://i.imgur.com/fAzkq6w.png');
        $('div[class="logo"]').removeClass("logo").attr('style','text-align:center');
    }

    if(enableSFW === true) { // Enable Safe-For-Work
        $('div[style="overflow:hidden; max-height:200px;"]').attr('class','sigArea');
        $('div[style="overflow:hidden; max-height:200px;"] img').attr('class','sigImage');
        $('td[class="post_avatar"]').attr('style','display:none;');
        var sigShow = $('<input type="button" class="button sigButton" value="toggle" style="position:relative; float:right;" />');

        $("table[id*='post_']").each(function() {
            src = $(this).find("tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > div:nth-child(3) img").attr("src");
            if (src != null) {
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
        var userName = $('strong > a[href^="http://hackforums.net/member.php?action=profile&uid="]').text();
        $('blockquote > cite:contains(' + userName + ')').css({'color': quotedColor, 'font-weight': 'bold','border-bottom': '1px dotted' + quotedColor});
    }

    if(window.location.pathname == "/showstaff.php" || window.location.pathname == "/showmods.php") {
        $('head').append('<style>td.trow1:hover {background: none !important;}</style>')
        $('td[class="trow1"]').attr("style","background: none; border: 0px !important;");
        $('div[style="width: 48%; min-height: 120px;float: left; border: 1px #4F3A6B solid; margin: 4px; padding: 2px;"]').attr("style","").addClass("staffCard");
        $('div[style="width: 48%; float: left; border: 1px #4F3A6B solid; margin: 4px; padding: 2px;"]').attr("style","").addClass("staffCard");
        $('td[class="trow1"][width="75%"]').attr("width","90%").attr("style","border: 0px !important").removeClass('trow1').addClass('staffCardParts').addClass('trow2');
        $('td[width="25%"]').attr("style","").addClass('staffCardParts');
    }

    if(window.location.pathname == "/showgroups.php") {
        $('head').append('<style>td.trow1:hover {background: none !important;}</style>')
        $('td[class="trow1"]').attr("style","background: none; border: 0px !important;");
        $('div[style="width: 46%; min-height:168px;float: left; border: 1px #4F3A6B solid; margin: 4px; padding: 2px;"]').attr("style","").addClass("groupsCard");
        $('td[class="trow1"][width="75%"]').attr("width","90%").attr("style","border: 0px !important").removeClass('trow1').addClass('groupsCardParts').addClass('trow2');
        $('td[width="25%"]').attr("style","").attr("valign","middle").addClass('groupsCardParts');
        $('td[valign="bottom"]').attr("style","background-color: #333; border-radius: 0px; vertical-align: baseline; font-size: 12px;");
        $('table[width="100%"]').attr("height","100%").attr("cellpadding","10");
    }

    if(hideMenu === true) {
        $("div[class='menu']").hide();
    }

    if(badges === true) {
        // BADGES - LIST OF UIDs
        var adminList = [1]; // Omniscient
        var staffList = [1292605,1093501,370510,1570078,992020,1450348]; // Skorp, Roger Waters, Alone Vampire, Sam Winchester, King of Hearts, Walt Disney
        var mentorList = [4066,330676,1320406]; // Judge Dredd, Diabolic, Froggy
        var groupLeadersList = []; // 
        for(var I = 0; I < staffList.length; I++) {
            $("a[href='http://hackforums.net/member.php?action=profile&uid=" + staffList[I] + "']").append('<img title="HF Staff" src="http://i.imgur.com/mfqIyM9.png" style="position: relative;top: 3px;left: 3px;">');
        }
        for(var I = 0; I < mentorList.length; I++) {
            $("a[href='http://hackforums.net/member.php?action=profile&uid=" + mentorList[I] + "']").append('<img title="HF Mentor" src="http://i.imgur.com/mfqIyM9.png" style="position: relative;top: 3px;left: 3px;">');
        }
        for(var I = 0; I < adminList.length; I++) {
            $("a[href='http://hackforums.net/member.php?action=profile&uid=" + adminList[I] + "']").append('<img title="Omniscient" src="http://i.imgur.com/mfqIyM9.png" style="position: relative;top: 3px;left: 3px;">');
        }
        for(var I = 0; I < groupLeadersList.length; I++) {
            $("a[href='http://hackforums.net/member.php?action=profile&uid=" + groupLeadersList[I] + "']").append('<img title="HF Group Leader" src="http://i.imgur.com/mfqIyM9.png" style="position: relative;top: 3px;left: 3px;">');
        }
    }

    $('img[src$="hackforums.net/images/modern_bl/groupimages/english/ub3r.png"]').attr('style', '-webkit-filter: hue-rotate(15deg); filter: hue-rotate(15deg);'); // Uber Userbar Color Change
    $('img[src$="hackforums.net/images/modern_bl/starub3r2.png"]').attr('style', '-webkit-filter: hue-rotate(15deg); filter: hue-rotate(15deg);'); // Uber Stars Color Change
    $('strong span[style="rgb(56, 56, 56)"]').addClass("closedGroup"); // Changes Closed Usergroup Color
    $('strong:contains("Post:") > a[href^="showthread.php?tid="]').attr('id','postLink').attr('style','padding-top: 3px; padding-right: 5px; display: inline-block;'); // Post # Centered  
    $('span[style="color:#383838"]').attr('style','color:#444444;'); // Closed Account Username Color Change
    $('a[href="http://hackforums.net/member.php?action=profile&uid=561239"] > span[class^="group"]').append('<img title="Developer of Flat Darkness" src="http://i.imgur.com/EpQPylI.png" style="position: relative;top: 3px;left: 3px;"/>');
    $('a[href="http://hackforums.net/member.php?action=profile&uid=2377407"] > span[class^="group"]').append('<img title="Developer of Flat Darkness" src="http://i.imgur.com/EpQPylI.png" style="position: relative;top: 3px;left: 3px;"/>');
    
});
