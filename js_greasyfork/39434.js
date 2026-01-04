// ==UserScript==
// @name         Crunchyroll Website Cleaner + Popup Mode
// @namespace    none
// @version      3.8
// @description  This removes premium promotions, shop ads, sn-buttons and adds a Popup feature for non-premium users.
// @author       TheBone_
// @match        *://*.crunchyroll.com/*
// @grant        none
// @icon         http://www.crunchyroll.com/favicon.ico
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/39434/Crunchyroll%20Website%20Cleaner%20%2B%20Popup%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/39434/Crunchyroll%20Website%20Cleaner%20%2B%20Popup%20Mode.meta.js
// ==/UserScript==
(function() {
    'use strict';

    //Inject JS Code directly into CR
    injectjsraw("function customPopupMode() { addGlobalStyle('body.main-page{background-color: black;}'); addGlobalStyle('#template_scroller{background-color: black; width: 100%; height: 100%; position: absolute;}'); addGlobalStyle('#template_container{background-color: black; width: 100%; height: 100%; position: absolute;}'); addGlobalStyle('#template_body{background-color: black; width: 100%; height: 100%; position: absolute;}'); addGlobalStyle('#showmedia_video{background-color: black; width: 100%; height: 100%; position: absolute;}'); addGlobalStyle('#showmedia_video_box{background-color: black; width: 100%; height: 100%; position: absolute;}'); addGlobalStyle('#main_content{background-color: black; width: 100%; height: 100%; position: absolute;}'); addGlobalStyle('#showmedia{background-color: black; width: 100%; height: 100%; position: absolute;}'); addGlobalStyle('#template_container.template-container{background-color: black;width: 100%; height: 100%; position: absolute;}'); $('#showmedia_video_player').attr('height', '100%'); $('#showmedia_video_player').attr('width', '100%'); $('.site-header').remove(); $('#sidebar').remove(); $('#footer').remove(); $('.showmedia-submenu').remove(); $('.white-wrapper').remove(); $('.showmedia-trail').remove(); $('h1').remove(); $('.showmedia-related').remove(); $('.guestbook').remove(); } function addGlobalStyle(css) { var head, style; head = document.getElementsByTagName('head')[0]; if (!head) { return; } style = document.createElement('style'); style.type = 'textconvert/css'; style.innerHTML = css; head.appendChild(style); }");
    injectjsraw("function ShowRelated(){ $('.showmedia-related').show(); $('.cshowrelated').remove(); } function ShowComments(){ $('.guestbook').show(); $('.cshowcomments').remove(); }");

    //UNblockAdBlock
    $("[src='http://static.ak.crunchyroll.com/vendor/blockadblock.js']").attr("src", "dummy.js");
    $("[src='http://static.ak.crunchyroll.com/versioned_assets/js/components/adblocker_message_strategy.e23f3421.js']").attr("src", "dummy.js");

    //hide Related Content
    $('.showmedia-related').hide();
    //remove SN Buttons
    $('.facebook').remove();
    $('.twitter').remove();
    $('.plus-one').remove();
    //remove Ads Button
    $('.right.clearfix').remove();
    //hide News Ticker
    $('#message_box').hide();
    //remove ShopAds-Slidebox
    $('#slidebox').remove();
    //remove Free Trial Box
    $('#showmedia_free_trial_signup').remove();
    //remove Premium Signup in menu
    $('#header_try_premium_free').remove();
    $('.premium-message').remove();
    //remove SN Buttons (Page End)
    $("#social_media").remove();
    //hide Guestbook
    $(".guestbook").hide();
    //remove Shop Ads
    $("#ecom_deal_img_div").remove();
    $("#get_funimation_button").remove();
    //remove adblock message
    $(".adblocker_message").remove();
    //hide Watch on VRV button
    $(".watch-dub-on-vrv").hide();
    //remove cr-expo ad
    $(".cr-expo-banner").remove();


    //add QualityControl to QueueButton
    $(".showmedia-btns").appendTo(".showmedia-submenu");
    $('.queue-button').attr('style', 'margin-left: 1cm; margin-top: 0.17cm; opacity: 1;');
    $(".showmedia-submenu").attr("style"," height: 40px");

    //modify Playback Problems Button (to Popup Feature)

    $("<a id='custompopupmodebtn' href='javascript:void(0);' onclick='customPopupMode();' title='Enable Popup Mode (reload page to disable)'>Popup Mode</a>").appendTo(".showmedia-submenu");
    //add ShowRelated-Button
    $("<p><a class='cshowrelated textconvert-link' onclick='ShowRelated();'>Show Related Titles</a>").appendTo('#showmedia_about_info');
    //add ShowComments-Button
    $("<p><a class='cshowcomments textconvert-link' onclick='ShowComments();'>Show Comments</a>").appendTo('#showmedia_about_info');

    //queueBtn Bugfix
    var element= document.querySelectorAll("ul.portrait-grid > li.hover-bubble > div > button.queue-button");
    $(element).each(function() {
        $(this).attr("style", $(this).attr("style") + "opacity: 0;");
    });

    //make sure to kill all ads
    killAd();
    createCookie('temp_ad_closed',1,7);
})();

function injectjs(link) { $('<script type="textconvert/javascript" src="'+link+'"/>').appendTo($('head')); }
function injectjsraw(link) { $('<script type="textconvert/javascript">'+link+'</script>').appendTo($('head')); }
function contains(selector, text) {
    var elements = document.querySelectorAll(selector);
    return Array.prototype.filter.call(elements, function(element){
        return RegExp(text).test(element.textContent);
    });
}			