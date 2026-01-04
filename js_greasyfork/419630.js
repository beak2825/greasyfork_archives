// ==UserScript==
// @name         Archant Customiser
// @namespace    https://github.com/surprisedketchup
// @version      2.0
// @description  Totally customise any Archant news website to any way you like. Get started by clicking the settings icon next to the search button once installed.
// @author       SurprisedKetchup
// @match        https://www.edp24.co.uk/*
// @match        https://edp24.co.uk/*
// @match        http://www.edp24.co.uk/*
// @match        http://edp24.co.uk/*
// @match        https://www.eveningnews24.co.uk/*
// @match        https://www.thetfordandbrandontimes.co.uk/*
// @match        https://www.eadt.co.uk/*
// @match        https://www.becclesandbungayjournal.co.uk/*
// @match        https://www.cambstimes.co.uk/*
// @match        https://www.kilburntimes.co.uk/*
// @match        https://www.ipswichstar.co.uk/*
// @match        https://www.derehamtimes.co.uk/*
// @match        https://www.barkinganddagenhampost.co.uk/*
// @match        https://www.eastlondonadvertiser.co.uk/*
// @match        https://www.elystandard.co.uk/*
// @match        https://www.exmouthjournal.co.uk/*
// @match        https://www.greatyarmouthmercury.co.uk/*
// @match        https://www.hackneygazette.co.uk/*
// @match        https://www.hamhigh.co.uk/*
// @match        https://www.ilfordrecorder.co.uk/*
// @match        https://www.islingtongazette.co.uk/*
// @match        https://www.lowestoftjournal.co.uk/*
// @match        https://www.theneweuropean.co.uk/*
// @match        https://www.newhamrecorder.co.uk/*
// @match        https://www.northnorfolknews.co.uk/*
// @match        https://www.pinkun.com/*
// @match        https://www.royston-crow.co.uk/*
// @match        https://www.sidmouthherald.co.uk/*
// @match        https://www.whtimes.co.uk/*
// @match        https://www.thewestonmercury.co.uk/*
// @match        https://www.dissmercury.co.uk/*
// @match        https://www.dunmowbroadcast.co.uk/*
// @match        https://www.hertsad.co.uk/*
// @match        https://www.huntspost.co.uk/*
// @match        https://www.midweekherald.co.uk/*
// @match        https://www.northdevongazette.co.uk/*
// @match        https://www.northsomersettimes.co.uk/*
// @match        https://www.saffronwaldenreporter.co.uk/*
// @match        https://www.sidmouthherald.co.uk/*
// @match        https://www.wattonandswaffhamtimes.co.uk/*
// @match        https://www.burymercury.co.uk/*
// @match        https://www.wisbechstandard.co.uk/*
// @match        https://www.wymondhamandattleboroughmercury.co.uk/*
// @match        https://www.romfordrecorder.co.uk/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419630/Archant%20Customiser.user.js
// @updateURL https://update.greasyfork.org/scripts/419630/Archant%20Customiser.meta.js
// ==/UserScript==

$('.mdc-top-app-bar__section--align-end').prepend(`<a class="mdc-icon-button material-icons mdc-top-app-bar__navigation-icon mdc-top-app-bar__navigation-icon--search" id="settingsButton">settings</a>`);
$('#settingsButton').removeClass('mdc-top-app-bar__navigation-icon--search');
document.getElementById("settingsButton").addEventListener("click", buttonClick, false);

$.fn.hasProp = function(name,val){
    if(val){
        return $(this).prop(name) === val;
    }
    return $(this).prop(name) !== undefined;
};

if (localStorage.themeColor.charAt(0) == '#') {
    updateThemeColor();
}

if (localStorage.pbColor.charAt(0) == '#') {
    updatePageBackgroundColor();
}

if (localStorage.textColor.charAt(0) == '#') {
    updateTextColor();
}

if (localStorage.linkColor.charAt(0) == '#') {
    updateLinkColor();
}

if (localStorage.storyColor.charAt(0) == '#') {
    updateStoryColor();
}

if (localStorage.promotionsDisabled == "true") {
    removePromotions();
}

if (localStorage.fixKerning == "true") {
    fixKerning();
}

if (localStorage.removeVideos == "true") {
    removeVideos();
}

if (localStorage.disableMostRead == "true") {
    disableMostRead();
}

if (localStorage.disableCommentButton == "true") {
    disableCommentButton();
}

if (localStorage.disableSocialButtons == "true") {
    disableSocialButtons();
}

if (localStorage.disableComments == "true") {
    disableComments();
}

if (localStorage.disableFooter == "true") {
    disableFooter();
}

if (localStorage.removeHeaderLogo == "true") {
    removeHeaderLogo();
}

if (localStorage.removeReadMore == "true") {
    removeReadMore();
}

if (localStorage.enableCommentDownvote == "true") {
    enableCommentDownvote();
}

if (localStorage.removePromotionalStories == "true") {
    removePromotionalStories();
}

if (localStorage.fancyFlairs == "true") {
    fancyFlairs();
}

if (localStorage.getItem("borderRadius") !== null) {
    updateBorderRadius();
}

if (localStorage.getItem("storyBorderRadius") !== null) {
    storyBorderRadius();
}

if (localStorage.getItem("fontSize") !== null) {
    fontSize();
}

function updateAll() {
    updateThemeColor();
    updatePageBackgroundColor();
    updateTextColor();
    updateLinkColor();
    updateStoryColor();
    updateBorderRadius();
    storyBorderRadius();
    fontSize();
    if (localStorage.promotionsDisabled == "true") {
        removePromotions();
    }
    if (localStorage.fixKerning == "true") {
        fixKerning();
    }
    if (localStorage.removeVideos == "true") {
        removeVideos();
    }
    if (localStorage.disableMostRead == "true") {
        disableMostRead();
    }
    if (localStorage.disableSocialButtons == "true") {
        disableSocialButtons();
    }
    if (localStorage.disableCommentButton == "true") {
        disableCommentButton();
    }
    if (localStorage.disableComments == "true") {
        disableComments();
    }
    if (localStorage.disableFooter == "true") {
        disableFooter();
    }
    if (localStorage.removeHeaderLogo == "true") {
        removeHeaderLogo();
    }
    if (localStorage.removeReadMore == "true") {
        removeReadMore();
    }
    if (localStorage.enableCommentDownvote == "true") {
        enableCommentDownvote();
    }
    if (localStorage.removePromotionalStories == "true") {
        removePromotionalStories();
    }
    if (localStorage.fancyFlairs == "true") {
        fancyFlairs();
    }
}

function updateSettings() {
    console.log('Updating Settings...');
    localStorage.themeColor = $('#colorInput').val();
        localStorage.pbColor = $('#pageBackgroundInput').val();
        localStorage.textColor = $('#textColorInput').val();
        localStorage.linkColor = $('#linkColorInput').val();
        localStorage.storyColor = $('#storyColorInput').val();
        if ($('.promotionsDisabled').prop("checked") == true) {
            localStorage.promotionsDisabled = "true";
        } else {
            localStorage.promotionsDisabled = "false";
        }
        if ($('.fixKerning').prop("checked") == true) {
            localStorage.fixKerning = "true";
        } else {
            localStorage.fixKerning = "false";
        }
        if ($('.removeVideos').prop("checked") == true) {
            localStorage.removeVideos = "true";
        } else {
            localStorage.removeVideos = "false";
        }
        if ($('.disableMostRead').prop("checked") == true) {
            localStorage.disableMostRead = "true";
        } else {
            localStorage.disableMostRead = "false";
        }
        if ($('.enableCommentDownvote').prop("checked") == true) {
            localStorage.enableCommentDownvote = "true";
        } else {
            localStorage.enableCommentDownvote = "false";
        }
        if ($('.disableSocialButtons').prop("checked") == true) {
            localStorage.disableSocialButtons = "true";
        } else {
            localStorage.disableSocialButtons = "false";
        }
        if ($('.disableCommentButton').prop("checked") == true) {
            localStorage.disableCommentButton = "true";
        } else {
            localStorage.disableCommentButton = "false";
        }
        if ($('.disableComments').prop("checked") == true) {
            localStorage.disableComments = "true";
        } else {
            localStorage.disableComments = "false";
        }
        if ($('.disableFooter').prop("checked") == true) {
            localStorage.disableFooter = "true";
        } else {
            localStorage.disableFooter = "false";
        }
        if ($('.removeHeaderLogo').prop("checked") == true) {
            localStorage.removeHeaderLogo = "true";
        } else {
            localStorage.removeHeaderLogo = "false";
        }
        if ($('.removeReadMore').prop("checked") == true) {
            localStorage.removeReadMore = "true";
        } else {
            localStorage.removeReadMore = "false";
        }
        if ($('.removePromotionalStories').prop("checked") == true) {
            localStorage.removePromotionalStories = "true";
        } else {
            localStorage.removePromotionalStories = "false";
        }
        if ($('.fancyFlairs').prop("checked") == true) {
            localStorage.fancyFlairs = "true";
        } else {
            localStorage.fancyFlairs = "false";
        }
        localStorage.borderRadius = $('#borderRadius').val();
        localStorage.storyBorderRadius = $('#storyBorderRadius').val();
        localStorage.fontSize = $('#fontSize').val();
    if (localStorage.themeColor.charAt(0) == '#') {
            $('#colorInput').val(localStorage.themeColor)
        }
        $('.colorInput').css("background-color", localStorage.themeColor);
        if (localStorage.themeColor.charAt(0) == '#') {
            $('#pageBackgroundInput').val(localStorage.pbColor)
        }
        $('.pageBackgroundInput').css("background-color", localStorage.pbColor);
        if (localStorage.textColor.charAt(0) == '#') {
            $('#textColorInput').val(localStorage.textColor)
        }
        $('.textColorInput').css("background-color", localStorage.textColor);
        if (localStorage.linkColor.charAt(0) == '#') {
            $('#linkColorInput').val(localStorage.linkColor)
        }
        $('.linkColorInput').css("background-color", localStorage.linkColor);
        if (localStorage.storyColor.charAt(0) == '#') {
            $('#storyColorInput').val(localStorage.storyColor)
        }
}

function buttonClick() {
    if ($('.settingsMenu').length) {
        clearInterval(localStorage.settingsInterval);
        updateAll();
        $('.settingsMenu').remove();
    } else {
        localStorage.settingsInterval = setInterval(updateSettings, 200);
        $('body').prepend(`
            <div class="settingsMenu" style="border-radius: 0.8rem; position: fixed; z-index: 1000; width: 35rem; height: 70vh; top: 8rem; right: 1rem; overflow: auto; background-color: white; overflow-x: hidden; padding: 1rem; -webkit-box-shadow: 0px 0px 33px -7px rgba(0,0,0,0.46); -moz-box-shadow: 0px 0px 33px -7px rgba(0,0,0,0.46); box-shadow: 0px 0px 33px -7px rgba(0,0,0,0.46);">
                <h2 style="font-family: Roboto, sans-serif; font-weight: bold;" class="settingsTitle">Settings</h2>
                <h4 style="font-size: bold; font-style: italic;">Changes are saved automatically; press the cog again to exit. You may need to reload the page for some changes to take effect.</h4>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Fancy Flairs (New): </strong><input type="checkbox" class="fancyFlairs" style="border: none;"></span><br><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Header Background Colour: </strong><span class="colorInput" style="width: 0.8rem; height: 0.8rem; border-radius: 50%; display: inline-block; margin-right: 0.3rem;"></span><input type="text" value="#262626" style="border: none; border-bottom: 1px solid black" style="display: block; float: right;" id="colorInput"/></span><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Page Background Colour: </strong><span class="pageBackgroundInput" style="width: 0.8rem; height: 0.8rem; border-radius: 50%; display: inline-block; margin-right: 0.3rem;"></span><input type="text" value="#171717" style="border: none; border-bottom: 1px solid black" style="float: right;" id="pageBackgroundInput"/></span><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Text Colour: </strong><span class="textColorInput" style="width: 0.8rem; height: 0.8rem; border-radius: 50%; display: inline-block; margin-right: 0.3rem;"></span><input type="text" value="#FFFFFF" style="border: none; border-bottom: 1px solid black" style="float: right;" id="textColorInput"/></span><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Link Colour: </strong><span class="linkColorInput" style="width: 0.8rem; height: 0.8rem; border-radius: 50%; display: inline-block; margin-right: 0.3rem;"></span><input type="text" value="#FFFFFF" style="border: none; border-bottom: 1px solid black" style="float: right;" id="linkColorInput"/></span><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Story Background Colour: </strong><span class="storyColorInput" style="width: 0.8rem; height: 0.8rem; border-radius: 50%; display: inline-block; margin-right: 0.3rem;"></span><input type="text" value="#262626" style="border: none; border-bottom: 1px solid black" style="float: right;" id="storyColorInput"/></span><br><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Disable Banner Promotions: </strong><input type="checkbox" class="promotionsDisabled" style="border: none;" checked></span><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Media Corner Roundness: </strong><input type="range" min="0" max="4" value="0" step="0.01" id="borderRadius"></span><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Story Corner Roundness: </strong><input type="range" min="0" max="4" value="0.5" step="0.01" id="storyBorderRadius"></span><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Main Text Font Size: </strong><input type="range" min="0.8" max="1.5" value="1" step="0.01" id="fontSize"></span><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Fix Kerning: </strong><input type="checkbox" class="fixKerning" style="border: none;" checked></span><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Remove Videos: </strong><input type="checkbox" class="removeVideos" style="border: none;"></span><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Disable Most Read: </strong><input type="checkbox" class="disableMostRead" style="border: none;"></span><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Disable Social Buttons: </strong><input type="checkbox" class="disableSocialButtons" style="border: none;"></span><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Disable Comment Button: </strong><input type="checkbox" class="disableCommentButton" style="border: none;"></span><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Disable Comments: </strong><input type="checkbox" class="disableComments" style="border: none;"></span><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Disable Footer: </strong><input type="checkbox" class="disableFooter" style="border: none;"></span><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Remove Header Logo: </strong><input type="checkbox" class="removeHeaderLogo" style="border: none;"></span><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Remove 'Read More' links: </strong><input type="checkbox" class="removeReadMore" style="border: none;"></span><br>
                <span style="display: inline-block; margin-top: 0.5rem;"><strong>Remove Promotional Stories: </strong><input type="checkbox" class="removePromotionalStories" style="border: none;"></span><br><br>
                <strong class="attribution"><a href="https://greasyfork.org/en/scripts/419630-archant-customiser" target="_blank">Archant Customiser - v2.0</a></strong><br><br>
                <strong class="attribution">Designed and developed by <a href="https://www.reddit.com/user/SurprisedKetchup" target="_blank">SurprisedKetchup</a>.</strong>
            </div>
        `);
        if (localStorage.themeColor.charAt(0) == '#') {
            $('#colorInput').val(localStorage.themeColor)
        }
        $('.colorInput').css("background-color", localStorage.themeColor);
        if (localStorage.themeColor.charAt(0) == '#') {
            $('#pageBackgroundInput').val(localStorage.pbColor)
        }
        $('.pageBackgroundInput').css("background-color", localStorage.pbColor);
        if (localStorage.textColor.charAt(0) == '#') {
            $('#textColorInput').val(localStorage.textColor)
        }
        $('.textColorInput').css("background-color", localStorage.textColor);
        if (localStorage.linkColor.charAt(0) == '#') {
            $('#linkColorInput').val(localStorage.linkColor)
        }
        $('.linkColorInput').css("background-color", localStorage.linkColor);
        if (localStorage.storyColor.charAt(0) == '#') {
            $('#storyColorInput').val(localStorage.storyColor)
        }
        $('.storyColorInput').css("background-color", localStorage.storyColor);
        $('.settingsMenu').css("background-color", localStorage.storyColor);
        $('span').css("color", localStorage.textColor);
        $('.settingsTitle').css("color", localStorage.textColor);
        $('input').css("background-color", localStorage.storyColor);
        $('input').css("color", localStorage.textColor);
        $('input').css("border-bottom", "1px solid white");
        $('.attribution').css("color", localStorage.textColor);
        $('a').css("color", localStorage.linkColor);
        if (localStorage.promotionsDisabled == "true") {
            $('.promotionsDisabled').prop('checked', true);
        } else {
            $('.promotionsDisabled').prop('checked', false);
        }
        if (localStorage.fixKerning == "true") {
            $('.fixKerning').prop('checked', true);
        } else {
            $('.fixKerning').prop('checked', false);
        }
        if (localStorage.removeVideos == "true") {
            $('.removeVideos').prop('checked', true);
        } else {
            $('.removeVideos').prop('checked', false);
        }
        if (localStorage.disableMostRead == "true") {
            $('.disableMostRead').prop('checked', true);
        } else {
            $('.disableMostRead').prop('checked', false);
        }
        if (localStorage.disableSocialButtons == "true") {
            $('.disableSocialButtons').prop('checked', true);
        } else {
            $('.disableSocialButtons').prop('checked', false);
        }
        if (localStorage.disableCommentButton == "true") {
            $('.disableCommentButton').prop('checked', true);
        } else {
            $('.disableCommentButton').prop('checked', false);
        }
        if (localStorage.disableComments == "true") {
            $('.disableComments').prop('checked', true);
        } else {
            $('.disableComments').prop('checked', false);
        }
        if (localStorage.disableFooter == "true") {
            $('.disableFooter').prop('checked', true);
        } else {
            $('.disableFooter').prop('checked', false);
        }
        if (localStorage.removeHeaderLogo == "true") {
            $('.removeHeaderLogo').prop('checked', true);
        } else {
            $('.removeHeaderLogo').prop('checked', false);
        }
        if (localStorage.removeReadMore == "true") {
            $('.removeReadMore').prop('checked', true);
        } else {
            $('.removeReadMore').prop('checked', false);
        }
        if (localStorage.enableCommentDownvote == "true") {
            $('.enableCommentDownvote').prop('checked', true);
        } else {
            $('.enableCommentDownvote').prop('checked', false);
        }
        if (localStorage.removePromotionalStories == "true") {
            $('.removePromotionalStories').prop('checked', true);
        } else {
            $('.removePromotionalStories').prop('checked', false);
        }
        if (localStorage.fancyFlairs == "true") {
            $('.fancyFlairs').prop('checked', true);
        } else {
            $('.fancyFlairs').prop('checked', false);
        }
        if (localStorage.getItem("borderRadius") !== null) {
            $('#borderRadius').val(localStorage.borderRadius);
        }
        if (localStorage.getItem("storyBorderRadius") !== null) {
            $('#storyBorderRadius').val(localStorage.storyBorderRadius);
        }
        if (localStorage.getItem("fontSize") !== null) {
            $('#fontSize').val(localStorage.fontSize);
        }
    }
}

function updateThemeColor() {
    $('.mdc-top-app-bar').css("background-color", localStorage.themeColor);
    $('.mdc-button--raised').css("background-color", localStorage.themeColor);
    $('.footer').css("background-color", localStorage.themeColor);
    $('.mdc-tab__text-label').css("color", localStorage.themeColor);
    $('.overline__category').css("color", localStorage.themeColor);
    $('.read-more').css("color", localStorage.themeColor);
    $('.fa-comment-alt').css("color", localStorage.themeColor);
    $('.mdc-chip').css("background-color", localStorage.themeColor);
    $('.mdc-fab').css("background-color", localStorage.themeColor);
    $('.mdc-tab-indicator__content').css("border-color", localStorage.themeColor);
    $('.article__label').css("background-color", localStorage.themeColor);
    $('.publisher-nav-color::after').css("background-color", localStorage.themeColor);
    $('#search-form').css("background-color", localStorage.themeColor);
    $('.mdc-floating-label').css("background-color", localStorage.themeColor);
    $('.cm-search__filter-mdc-chip--checked').css("background-color", localStorage.themeColor);
    $('.cm-search__filter-mdc-chip--checked').css("opacity", "0.7");
    $('.cm-search__form-button.mdc-button').css("background-color", localStorage.themeColor);
    $('option').css("background-color", localStorage.themeColor);
}

function updatePageBackgroundColor() {
    $('.main-content__inner').css("background-color", localStorage.pbColor);
    $('.mdc-tab').css("background-color", localStorage.pbColor);
    $('.mdc-drawer').css("background-color", localStorage.pbColor);
    $('.mdc-tab-bar').css("border-bottom", "none");
    $('.disqus-comment-count').css("color", localStorage.pbColor);
    $('body').css("background-color", localStorage.pbColor);
}

function updateTextColor() {
    $('p').css("color", localStorage.linkColor);
    $('h1').css("color", localStorage.textColor);
    $('h2').css("color", localStorage.textColor);
    $('h3').css("color", localStorage.textColor);
    $('h4').css("color", localStorage.textColor);
    $('span').css("color", localStorage.textColor);
    $('strong').css("color", localStorage.textColor);
    $('li').css("color", localStorage.textColor);
    $('.post-message').css("color", localStorage.textColor);
    $('.jw-related-shelf-item-title').css("color", localStorage.textColor);
    $('.jw-related-more').css("color", localStorage.textColor);
    $('.jw-related-control').css("color", localStorage.textColor);
    $('.mdc-top-app-bar__navigation-icon').css("color", localStorage.textColor);
    $('.search-form__input').css("color", localStorage.textColor);
    $('.cm-search__status').css("color", localStorage.textColor);
    $('.cm-search-result__item').css("border", "none");
    $('#cm-search-result-page-query').css("color", localStorage.textColor);
    $('#cm-search-sort').css("color", localStorage.textColor);
}

function updateLinkColor() {
    $('a').css("color", localStorage.linkColor);
    $('.publisher-anchor-color').css("color", localStorage.linkColor);
}

function updateStoryColor() {
    $('.mdc-card__primary').css("background-color", localStorage.storyColor);
    $('.mdc-card__info').css("background-color", localStorage.storyColor);
    $('.mdc-card').css("background-color", localStorage.storyColor);
}

function removePromotions() {
    $('a.c37-pencil-slot__anchor').remove();
    $('.html-embed--detail').remove();
    $('.article-sub-promo').remove();
    $('.recommendations-wrapper').remove();
    $('.jw-logo').remove();
    $('.mdc-dialog').remove();
    $('#placement-top').attr("style", "display: none;");
    $('a[href*="/subscribe"]').remove();
    $('a[href*="/support-us"]').remove();
}

function updateBorderRadius() {
    $('.jwplayer').css('border-radius', localStorage.borderRadius + 'rem');
    $('.jw-media').css('border-radius', localStorage.borderRadius + 'rem');
    $('.jw-related-shelf-item-image').css('border-radius', localStorage.borderRadius + 'rem');
    $('.jw-wrapper').css('border-radius', localStorage.borderRadius + 'rem');
    $('.cm-picture').css('border-radius', localStorage.borderRadius + 'rem');
    //$('img').css('border-radius', localStorage.borderRadius + 'rem');
    $(".cm-media").each(function() {
        if (!$(this).hasClass("cm-media--background")) {
            $(this).css('border-radius', localStorage.borderRadius + 'rem');
        }
    });
    $('.jw-related-item-visible').css('border-radius', localStorage.borderRadius + 'rem');
    $('.jw-nextup-tooltip').css('border-radius', localStorage.borderRadius + 'rem');
    $('.jw-related-item').css('border-radius', localStorage.borderRadius + 'rem');
    $('.mdc-fab').css('border-radius', localStorage.borderRadius + 'rem');
    $('.item-media').first().first().find('img:first').css('border-radius', localStorage.borderRadius + 'rem');
    $('.cm-richtext-embedded--image').find(':first-child').find(':first-child').find('img:first').css('border-radius', localStorage.borderRadius + 'rem');
}

function storyBorderRadius() {
    $('.mdc-card').css('border-radius', localStorage.storyBorderRadius + 'rem');
}

function fontSize() {
    $('.mdc-typography--body2').css('font-size', localStorage.fontSize + 'rem');
    $("p").each(function() {
        if (!$(this).hasClass("mdc-typography--overline")) {
            $(this).css('font-size', localStorage.fontSize + 'rem');
        }
    });
}

function fixKerning() {
    $('.badge__name').css("margin-left", "0.5rem");
    $('.article__published').css('margin-top', '1rem');
    $('.article__published').css('margin-bottom', '0.5rem');
    $('.mdc-typography--headline6').css('margin-left', '0.3rem');
    $('.dateTime').css('margin-left', '0.3rem');
    $('.dateTime').css('font-weight', 'normal');
    $('.dateTime').css('font-size', '1.2rem');
    $('.overline__label_color').css('margin-left', '0.3rem');
    $('.overline__label_color').css('margin-bottom', '0.3rem');
    $('.overline__label_color').css('margin-top', '0.3rem');
    $('.mdc-chip').css("cursor", "pointer");
    $('.mdc-chip__text').css("cursor", "pointer");
    $('.mdc-button__icon').css("font-size", "22px");
    $('.reactions').css("display", "none !important");
    $('.reactions').css("visibility", "hidden !important");
    $('.reactions').hide();
}

function removeVideos() {
    $('.item-videos-jw').remove();
    $('.jwplayer').remove();
    $('.lp_videoPlayer').remove();
    $('.jw-related-shelf-container').remove();
}

function disableMostRead() {
    $('.most-read').remove();
}

function disableSocialButtons() {
    $('a[href*="https://reddit.com/submit"]').remove();
    $('a[href*="facebook.com/sharer/sharer.php"]').remove();
    $('a[href*="twitter.com/share"]').remove();
    $('a[href*="linkedin.com/shareArticle"]').remove();
    $('.thread-share__button').css("display", "none");
    $('#native-share').remove();
    $('.nav-footer').remove();
}

function disableCommentButton() {
    $('a.mdc-icon-button.fa-icons.disqus-link').remove();
}

function disableComments() {
    $('#article-comments-disqus').remove();
}

function disableFooter() {
    $('.footer').remove();
}

function removeHeaderLogo() {
    $('.mdc-top-app-bar__title a').css('background-image', 'none');
}

function removeReadMore() {
    $('a:contains("READ MORE:")').remove();
}

function enableCommentDownvote() {
	var downvotes = document.getElementsByClassName("vote-down");
	for (var i = 0; i < downvotes.length; i++) {
		var downvoteCount = downvotes[i].getElementsByClassName("downvote-count");
		if (downvoteCount.length == 0) {
			downvoteCount = document.createElement("span");
			downvoteCount.className = "downvote-count";
			downvoteCount.style.position = "relative";
			downvoteCount.style.top = "-3px";
			downvotes[i].insertBefore(downvoteCount, downvotes[i].firstChild);
		}
		else {
			downvoteCount = downvoteCount[0];
        }
		downvoteCount.innerHTML = downvotes[i].className.split(" ")[2].substring(6);

		if (downvoteCount.innerHTML == "0") {
			downvoteCount.style.display = "none";
        } else {
			downvoteCount.style.display = "";
        }
	}
}

function fancyFlairs() {
    $('.overline__category').each(function() {
        if ($(this).text().includes(' | ')) {
            var text = $(this).text();
            var newText = text.slice(0, -3);
            $(this).text(newText);
        }
        $(this).css('background-color', '#0C7EA8');
        $(this).css('color', 'white');
        $(this).css('padding', '0.15rem');
        $(this).css('border-radius', '0.3rem');
        $(this).css('padding-left', '0.35rem');
        $(this).css('margin-top', '1rem');
        $(this).css('margin-bottom', '0.5rem');
        $(this).css('white-space', 'nowrap');
        if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('coronavirus')) {
            $(this).prepend('<img alt="Coronavirus Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjxwYXRoIGQ9Ik0yMS4yNSwxMC41Yy0wLjQxLDAtMC43NSwwLjM0LTAuNzUsMC43NWgtMS41NGMtMC4xNS0xLjM3LTAuNjktMi42My0xLjUyLTMuNjVsMS4wOS0xLjA5bDAuMDEsMC4wMSBjMC4yOSwwLjI5LDAuNzcsMC4yOSwxLjA2LDBzMC4yOS0wLjc3LDAtMS4wNkwxOC41NCw0LjRjLTAuMjktMC4yOS0wLjc3LTAuMjktMS4wNiwwYy0wLjI5LDAuMjktMC4yOSwwLjc2LTAuMDEsMS4wNWwtMS4wOSwxLjA5IGMtMS4wMi0wLjgyLTIuMjctMS4zNi0zLjY0LTEuNTFWMy41aDAuMDFjMC40MSwwLDAuNzUtMC4zNCwwLjc1LTAuNzVDMTMuNSwyLjM0LDEzLjE2LDIsMTIuNzUsMmgtMS41Yy0wLjQxLDAtMC43NSwwLjM0LTAuNzUsMC43NSBjMCwwLjQxLDAuMzMsMC43NCwwLjc0LDAuNzV2MS41NUM5Ljg3LDUuMTksOC42Miw1Ljc0LDcuNiw2LjU2TDYuNTEsNS40N2wwLjAxLTAuMDFjMC4yOS0wLjI5LDAuMjktMC43NywwLTEuMDYgYy0wLjI5LTAuMjktMC43Ny0wLjI5LTEuMDYsMEw0LjQsNS40NmMtMC4yOSwwLjI5LTAuMjksMC43NywwLDEuMDZjMC4yOSwwLjI5LDAuNzYsMC4yOSwxLjA1LDAuMDFsMS4wOSwxLjA5IGMtMC44MiwxLjAyLTEuMzYsMi4yNi0xLjUsMy42M0gzLjVjMC0wLjQxLTAuMzQtMC43NS0wLjc1LTAuNzVDMi4zNCwxMC41LDIsMTAuODQsMiwxMS4yNXYxLjVjMCwwLjQxLDAuMzQsMC43NSwwLjc1LDAuNzUgYzAuNDEsMCwwLjc1LTAuMzQsMC43NS0wLjc1aDEuNTRjMC4xNSwxLjM3LDAuNjksMi42MSwxLjUsMy42M2wtMS4wOSwxLjA5Yy0wLjI5LTAuMjktMC43Ni0wLjI4LTEuMDUsMC4wMSBjLTAuMjksMC4yOS0wLjI5LDAuNzcsMCwxLjA2bDEuMDYsMS4wNmMwLjI5LDAuMjksMC43NywwLjI5LDEuMDYsMGMwLjI5LTAuMjksMC4yOS0wLjc3LDAtMS4wNmwtMC4wMS0wLjAxbDEuMDktMS4wOSBjMS4wMiwwLjgyLDIuMjYsMS4zNiwzLjYzLDEuNTF2MS41NWMtMC40MSwwLjAxLTAuNzQsMC4zNC0wLjc0LDAuNzVjMCwwLjQxLDAuMzQsMC43NSwwLjc1LDAuNzVoMS41YzAuNDEsMCwwLjc1LTAuMzQsMC43NS0wLjc1IGMwLTAuNDEtMC4zNC0wLjc1LTAuNzUtMC43NWgtMC4wMXYtMS41NGMxLjM3LTAuMTQsMi42Mi0wLjY5LDMuNjQtMS41MWwxLjA5LDEuMDljLTAuMjksMC4yOS0wLjI4LDAuNzYsMC4wMSwxLjA1IGMwLjI5LDAuMjksMC43NywwLjI5LDEuMDYsMGwxLjA2LTEuMDZjMC4yOS0wLjI5LDAuMjktMC43NywwLTEuMDZjLTAuMjktMC4yOS0wLjc3LTAuMjktMS4wNiwwbC0wLjAxLDAuMDFsLTEuMDktMS4wOSBjMC44Mi0xLjAyLDEuMzctMi4yNywxLjUyLTMuNjVoMS41NGMwLDAuNDEsMC4zNCwwLjc1LDAuNzUsMC43NWMwLjQxLDAsMC43NS0wLjM0LDAuNzUtMC43NXYtMS41QzIyLDEwLjg0LDIxLjY2LDEwLjUsMjEuMjUsMTAuNXogTTEzLjc1LDhjMC41NSwwLDEsMC40NSwxLDFzLTAuNDUsMS0xLDFzLTEtMC40NS0xLTFTMTMuMiw4LDEzLjc1LDh6IE0xMiwxM2MtMC41NSwwLTEtMC40NS0xLTFjMC0wLjU1LDAuNDUtMSwxLTFzMSwwLjQ1LDEsMSBDMTMsMTIuNTUsMTIuNTUsMTMsMTIsMTN6IE0xMC4yNSw4YzAuNTUsMCwxLDAuNDUsMSwxcy0wLjQ1LDEtMSwxcy0xLTAuNDUtMS0xUzkuNyw4LDEwLjI1LDh6IE04LjUsMTNjLTAuNTUsMC0xLTAuNDUtMS0xIGMwLTAuNTUsMC40NS0xLDEtMXMxLDAuNDUsMSwxQzkuNSwxMi41NSw5LjA1LDEzLDguNSwxM3ogTTEwLjI1LDE2Yy0wLjU1LDAtMS0wLjQ1LTEtMWMwLTAuNTUsMC40NS0xLDEtMXMxLDAuNDUsMSwxIEMxMS4yNSwxNS41NSwxMC44LDE2LDEwLjI1LDE2eiBNMTMuNzUsMTZjLTAuNTUsMC0xLTAuNDUtMS0xYzAtMC41NSwwLjQ1LTEsMS0xczEsMC40NSwxLDFDMTQuNzUsMTUuNTUsMTQuMywxNiwxMy43NSwxNnogTTE0LjUsMTIgYzAtMC41NSwwLjQ1LTEsMS0xczEsMC40NSwxLDFjMCwwLjU1LTAuNDUsMS0xLDFTMTQuNSwxMi41NSwxNC41LDEyeiIvPjwvc3ZnPg=="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('norfolk live')) {
            $(this).prepend('<img alt="Norfolk Live Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxnPjxwYXRoIGQ9Ik0wLDBoMjR2MjRIMFYweiIgZmlsbD0ibm9uZSIvPjwvZz48Zz48cGF0aCBkPSJNMTQsMTJjMCwwLjc0LTAuNCwxLjM4LTEsMS43MlYyMmgtMnYtOC4yOGMtMC42LTAuMzUtMS0wLjk4LTEtMS43MmMwLTEuMSwwLjktMiwyLTJTMTQsMTAuOSwxNCwxMnogTTEyLDYgYy0zLjMxLDAtNiwyLjY5LTYsNmMwLDEuNzQsMC43NSwzLjMxLDEuOTQsNC40bDEuNDItMS40MkM4LjUzLDE0LjI1LDgsMTMuMTksOCwxMmMwLTIuMjEsMS43OS00LDQtNHM0LDEuNzksNCw0IGMwLDEuMTktMC41MywyLjI1LTEuMzYsMi45OGwxLjQyLDEuNDJDMTcuMjUsMTUuMzEsMTgsMTMuNzQsMTgsMTJDMTgsOC42OSwxNS4zMSw2LDEyLDZ6IE0xMiwyQzYuNDgsMiwyLDYuNDgsMiwxMiBjMCwyLjg1LDEuMiw1LjQxLDMuMTEsNy4yNGwxLjQyLTEuNDJDNC45OCwxNi4zNiw0LDE0LjI5LDQsMTJjMC00LjQxLDMuNTktOCw4LThzOCwzLjU5LDgsOGMwLDIuMjktMC45OCw0LjM2LTIuNTMsNS44MmwxLjQyLDEuNDIgQzIwLjgsMTcuNDEsMjIsMTQuODUsMjIsMTJDMjIsNi40OCwxNy41MiwyLDEyLDJ6Ii8+PC9nPjwvc3ZnPg=="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('food')) {
            $(this).prepend('<img alt="Food and Drink Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMSA5SDlWMkg3djdINVYySDN2N2MwIDIuMTIgMS42NiAzLjg0IDMuNzUgMy45N1YyMmgyLjV2LTkuMDNDMTEuMzQgMTIuODQgMTMgMTEuMTIgMTMgOVYyaC0ydjd6bTUtM3Y4aDIuNXY4SDIxVjJjLTIuNzYgMC01IDIuMjQtNSA0eiIvPjwvc3ZnPg=="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('football')) {
            $(this).prepend('<img alt="Football Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjwvZz48Zz48Zz48cGF0aCBkPSJNMTIsMkM2LjQ4LDIsMiw2LjQ4LDIsMTJjMCw1LjUyLDQuNDgsMTAsMTAsMTBzMTAtNC40OCwxMC0xMEMyMiw2LjQ4LDE3LjUyLDIsMTIsMnogTTEzLDUuM2wxLjM1LTAuOTUgYzEuODIsMC41NiwzLjM3LDEuNzYsNC4zOCwzLjM0bC0wLjM5LDEuMzRsLTEuMzUsMC40NkwxMyw2LjdWNS4zeiBNOS42NSw0LjM1TDExLDUuM3YxLjRMNy4wMSw5LjQ5TDUuNjYsOS4wM0w1LjI3LDcuNjkgQzYuMjgsNi4xMiw3LjgzLDQuOTIsOS42NSw0LjM1eiBNNy4wOCwxNy4xMWwtMS4xNCwwLjFDNC43MywxNS44MSw0LDEzLjk5LDQsMTJjMC0wLjEyLDAuMDEtMC4yMywwLjAyLTAuMzVsMS0wLjczTDYuNCwxMS40IGwxLjQ2LDQuMzRMNy4wOCwxNy4xMXogTTE0LjUsMTkuNTlDMTMuNzEsMTkuODUsMTIuODcsMjAsMTIsMjBzLTEuNzEtMC4xNS0yLjUtMC40MWwtMC42OS0xLjQ5TDkuNDUsMTdoNS4xMWwwLjY0LDEuMTEgTDE0LjUsMTkuNTl6IE0xNC4yNywxNUg5LjczbC0xLjM1LTQuMDJMMTIsOC40NGwzLjYzLDIuNTRMMTQuMjcsMTV6IE0xOC4wNiwxNy4yMWwtMS4xNC0wLjFsLTAuNzktMS4zN2wxLjQ2LTQuMzRsMS4zOS0wLjQ3IGwxLDAuNzNDMTkuOTksMTEuNzcsMjAsMTEuODgsMjAsMTJDMjAsMTMuOTksMTkuMjcsMTUuODEsMTguMDYsMTcuMjF6Ii8+PC9nPjwvZz48L3N2Zz4="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('fc')) {
            $(this).prepend('<img alt="Football Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjwvZz48Zz48Zz48cGF0aCBkPSJNMTIsMkM2LjQ4LDIsMiw2LjQ4LDIsMTJjMCw1LjUyLDQuNDgsMTAsMTAsMTBzMTAtNC40OCwxMC0xMEMyMiw2LjQ4LDE3LjUyLDIsMTIsMnogTTEzLDUuM2wxLjM1LTAuOTUgYzEuODIsMC41NiwzLjM3LDEuNzYsNC4zOCwzLjM0bC0wLjM5LDEuMzRsLTEuMzUsMC40NkwxMyw2LjdWNS4zeiBNOS42NSw0LjM1TDExLDUuM3YxLjRMNy4wMSw5LjQ5TDUuNjYsOS4wM0w1LjI3LDcuNjkgQzYuMjgsNi4xMiw3LjgzLDQuOTIsOS42NSw0LjM1eiBNNy4wOCwxNy4xMWwtMS4xNCwwLjFDNC43MywxNS44MSw0LDEzLjk5LDQsMTJjMC0wLjEyLDAuMDEtMC4yMywwLjAyLTAuMzVsMS0wLjczTDYuNCwxMS40IGwxLjQ2LDQuMzRMNy4wOCwxNy4xMXogTTE0LjUsMTkuNTlDMTMuNzEsMTkuODUsMTIuODcsMjAsMTIsMjBzLTEuNzEtMC4xNS0yLjUtMC40MWwtMC42OS0xLjQ5TDkuNDUsMTdoNS4xMWwwLjY0LDEuMTEgTDE0LjUsMTkuNTl6IE0xNC4yNywxNUg5LjczbC0xLjM1LTQuMDJMMTIsOC40NGwzLjYzLDIuNTRMMTQuMjcsMTV6IE0xOC4wNiwxNy4yMWwtMS4xNC0wLjFsLTAuNzktMS4zN2wxLjQ2LTQuMzRsMS4zOS0wLjQ3IGwxLDAuNzNDMTkuOTksMTEuNzcsMjAsMTEuODgsMjAsMTJDMjAsMTMuOTksMTkuMjcsMTUuODEsMTguMDYsMTcuMjF6Ii8+PC9nPjwvZz48L3N2Zz4="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('run')) {
            $(this).prepend('<img alt="Running Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMy40OSA1LjQ4YzEuMSAwIDItLjkgMi0ycy0uOS0yLTItMi0yIC45LTIgMiAuOSAyIDIgMnptLTMuNiAxMy45bDEtNC40IDIuMSAydjZoMnYtNy41bC0yLjEtMiAuNi0zYzEuMyAxLjUgMy4zIDIuNSA1LjUgMi41di0yYy0xLjkgMC0zLjUtMS00LjMtMi40bC0xLTEuNmMtLjQtLjYtMS0xLTEuNy0xLS4zIDAtLjUuMS0uOC4xbC01LjIgMi4ydjQuN2gydi0zLjRsMS44LS43LTEuNiA4LjEtNC45LTEtLjQgMiA3IDEuNHoiLz48L3N2Zz4="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('speedway')) {
            $(this).prepend('<img alt="Car Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xOC45MiA1LjAxQzE4LjcyIDQuNDIgMTguMTYgNCAxNy41IDRoLTExYy0uNjYgMC0xLjIxLjQyLTEuNDIgMS4wMUwzIDExdjhjMCAuNTUuNDUgMSAxIDFoMWMuNTUgMCAxLS40NSAxLTF2LTFoMTJ2MWMwIC41NS40NSAxIDEgMWgxYy41NSAwIDEtLjQ1IDEtMXYtOGwtMi4wOC01Ljk5ek02LjUgMTVjLS44MyAwLTEuNS0uNjctMS41LTEuNVM1LjY3IDEyIDYuNSAxMnMxLjUuNjcgMS41IDEuNVM3LjMzIDE1IDYuNSAxNXptMTEgMGMtLjgzIDAtMS41LS42Ny0xLjUtMS41cy42Ny0xLjUgMS41LTEuNSAxLjUuNjcgMS41IDEuNS0uNjcgMS41LTEuNSAxLjV6TTUgMTBsMS41LTQuNWgxMUwxOSAxMEg1eiIvPjwvc3ZnPg=="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('car')) {
            $(this).prepend('<img alt="Car Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xOC45MiA1LjAxQzE4LjcyIDQuNDIgMTguMTYgNCAxNy41IDRoLTExYy0uNjYgMC0xLjIxLjQyLTEuNDIgMS4wMUwzIDExdjhjMCAuNTUuNDUgMSAxIDFoMWMuNTUgMCAxLS40NSAxLTF2LTFoMTJ2MWMwIC41NS40NSAxIDEgMWgxYy41NSAwIDEtLjQ1IDEtMXYtOGwtMi4wOC01Ljk5ek02LjUgMTVjLS44MyAwLTEuNS0uNjctMS41LTEuNVM1LjY3IDEyIDYuNSAxMnMxLjUuNjcgMS41IDEuNVM3LjMzIDE1IDYuNSAxNXptMTEgMGMtLjgzIDAtMS41LS42Ny0xLjUtMS41cy42Ny0xLjUgMS41LTEuNSAxLjUuNjcgMS41IDEuNS0uNjcgMS41LTEuNSAxLjV6TTUgMTBsMS41LTQuNWgxMUwxOSAxMEg1eiIvPjwvc3ZnPg=="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('investigation')) {
            $(this).prepend('<img alt="Investigation Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xNS41IDE0aC0uNzlsLS4yOC0uMjdDMTUuNDEgMTIuNTkgMTYgMTEuMTEgMTYgOS41IDE2IDUuOTEgMTMuMDkgMyA5LjUgM1MzIDUuOTEgMyA5LjUgNS45MSAxNiA5LjUgMTZjMS42MSAwIDMuMDktLjU5IDQuMjMtMS41N2wuMjcuMjh2Ljc5bDUgNC45OUwyMC40OSAxOWwtNC45OS01em0tNiAwQzcuMDEgMTQgNSAxMS45OSA1IDkuNVM3LjAxIDUgOS41IDUgMTQgNy4wMSAxNCA5LjUgMTEuOTkgMTQgOS41IDE0eiIvPjwvc3ZnPg=="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('summer')) {
            $(this).prepend('<img alt="Weather Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik02Ljc2IDQuODRsLTEuOC0xLjc5LTEuNDEgMS40MSAxLjc5IDEuNzkgMS40Mi0xLjQxek00IDEwLjVIMXYyaDN2LTJ6bTktOS45NWgtMlYzLjVoMlYuNTV6bTcuNDUgMy45MWwtMS40MS0xLjQxLTEuNzkgMS43OSAxLjQxIDEuNDEgMS43OS0xLjc5em0tMy4yMSAxMy43bDEuNzkgMS44IDEuNDEtMS40MS0xLjgtMS43OS0xLjQgMS40ek0yMCAxMC41djJoM3YtMmgtM3ptLTgtNWMtMy4zMSAwLTYgMi42OS02IDZzMi42OSA2IDYgNiA2LTIuNjkgNi02LTIuNjktNi02LTZ6bS0xIDE2Ljk1aDJWMTkuNWgtMnYyLjk1em0tNy40NS0zLjkxbDEuNDEgMS40MSAxLjc5LTEuOC0xLjQxLTEuNDEtMS43OSAxLjh6Ii8+PC9zdmc+"/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('farm')) {
            $(this).prepend('<img alt="Farming Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjwvZz48Zz48Zz48cGF0aCBkPSJNMTkuNSwxMmMwLjkzLDAsMS43OCwwLjI4LDIuNSwwLjc2VjhjMC0xLjEtMC45LTItMi0yaC02LjI5bC0xLjA2LTEuMDZsMS40MS0xLjQxbC0wLjcxLTAuNzFMOS44Miw2LjM1bDAuNzEsMC43MSBsMS40MS0xLjQxTDEzLDYuNzFWOWMwLDEuMS0wLjksMi0yLDJoLTAuNTRjMC45NSwxLjA2LDEuNTQsMi40NiwxLjU0LDRjMCwwLjM0LTAuMDQsMC42Ny0wLjA5LDFoMy4xNCBDMTUuMywxMy43NSwxNy4xOSwxMiwxOS41LDEyeiIvPjxwYXRoIGQ9Ik0xOS41LDEzYy0xLjkzLDAtMy41LDEuNTctMy41LDMuNXMxLjU3LDMuNSwzLjUsMy41czMuNS0xLjU3LDMuNS0zLjVTMjEuNDMsMTMsMTkuNSwxM3ogTTE5LjUsMTggYy0wLjgzLDAtMS41LTAuNjctMS41LTEuNXMwLjY3LTEuNSwxLjUtMS41czEuNSwwLjY3LDEuNSwxLjVTMjAuMzMsMTgsMTkuNSwxOHoiLz48cGF0aCBkPSJNNCw5aDVjMC0xLjEtMC45LTItMi0ySDRDMy40NSw3LDMsNy40NSwzLDhDMyw4LjU1LDMuNDUsOSw0LDl6Ii8+PHBhdGggZD0iTTkuODMsMTMuODJsLTAuMTgtMC40N0wxMC41OCwxM2MtMC40Ni0xLjA2LTEuMjgtMS45MS0yLjMxLTIuNDNsLTAuNCwwLjg5bC0wLjQ2LTAuMjFsMC40LTAuOUM3LjI2LDEwLjEzLDYuNjQsMTAsNiwxMCBjLTAuNTMsMC0xLjA0LDAuMTEtMS41MiwwLjI2bDAuMzQsMC45MWwtMC40NywwLjE4TDQsMTAuNDJjLTEuMDYsMC40Ni0xLjkxLDEuMjgtMi40MywyLjMxbDAuODksMC40bC0wLjIxLDAuNDZsLTAuOS0wLjQgQzEuMTMsMTMuNzQsMSwxNC4zNiwxLDE1YzAsMC41MywwLjExLDEuMDQsMC4yNiwxLjUybDAuOTEtMC4zNGwwLjE4LDAuNDdMMS40MiwxN2MwLjQ2LDEuMDYsMS4yOCwxLjkxLDIuMzEsMi40M2wwLjQtMC44OSBsMC40NiwwLjIxbC0wLjQsMC45QzQuNzQsMTkuODcsNS4zNiwyMCw2LDIwYzAuNTMsMCwxLjA0LTAuMTEsMS41Mi0wLjI2bC0wLjM0LTAuOTFsMC40Ny0wLjE4TDgsMTkuNTggYzEuMDYtMC40NiwxLjkxLTEuMjgsMi40My0yLjMxbC0wLjg5LTAuNGwwLjIxLTAuNDZsMC45LDAuNEMxMC44NywxNi4yNiwxMSwxNS42NCwxMSwxNWMwLTAuNTMtMC4xMS0xLjA0LTAuMjYtMS41Mkw5LjgzLDEzLjgyeiBNNy4xNSwxNy43N2MtMS41MywwLjYzLTMuMjktMC4wOS0zLjkyLTEuNjJjLTAuNjMtMS41MywwLjA5LTMuMjksMS42Mi0zLjkyYzEuNTMtMC42MywzLjI5LDAuMDksMy45MiwxLjYyIEM5LjQxLDE1LjM4LDguNjgsMTcuMTQsNy4xNSwxNy43N3oiLz48L2c+PC9nPjwvc3ZnPg=="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('health')) {
            $(this).prepend('<img alt="Health Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMiAyMS4zNWwtMS40NS0xLjMyQzUuNCAxNS4zNiAyIDEyLjI4IDIgOC41IDIgNS40MiA0LjQyIDMgNy41IDNjMS43NCAwIDMuNDEuODEgNC41IDIuMDlDMTMuMDkgMy44MSAxNC43NiAzIDE2LjUgMyAxOS41OCAzIDIyIDUuNDIgMjIgOC41YzAgMy43OC0zLjQgNi44Ni04LjU1IDExLjU0TDEyIDIxLjM1eiIvPjwvc3ZnPg=="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('art')) {
            $(this).prepend('<img alt="Art Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0yMyAxOFY2YzAtMS4xLS45LTItMi0ySDNjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMThjMS4xIDAgMi0uOSAyLTJ6TTguNSAxMi41bDIuNSAzLjAxTDE0LjUgMTFsNC41IDZINWwzLjUtNC41eiIvPjwvc3ZnPg=="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('theatre')) {
            $(this).prepend('<img alt="Theatre Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xOCAzdjJoLTJWM0g4djJINlYzSDR2MThoMnYtMmgydjJoOHYtMmgydjJoMlYzaC0yek04IDE3SDZ2LTJoMnYyem0wLTRINnYtMmgydjJ6bTAtNEg2VjdoMnYyem0xMCA4aC0ydi0yaDJ2MnptMC00aC0ydi0yaDJ2MnptMC00aC0yVjdoMnYyeiIvPjwvc3ZnPg=="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('book')) {
            $(this).prepend('<img alt="Book Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xOCAySDZjLTEuMSAwLTIgLjktMiAydjE2YzAgMS4xLjkgMiAyIDJoMTJjMS4xIDAgMi0uOSAyLTJWNGMwLTEuMS0uOS0yLTItMnpNNiA0aDV2OGwtMi41LTEuNUw2IDEyVjR6Ii8+PC9zdmc+"/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('weather')) {
            $(this).prepend('<img alt="Weather Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik02Ljc2IDQuODRsLTEuOC0xLjc5LTEuNDEgMS40MSAxLjc5IDEuNzkgMS40Mi0xLjQxek00IDEwLjVIMXYyaDN2LTJ6bTktOS45NWgtMlYzLjVoMlYuNTV6bTcuNDUgMy45MWwtMS40MS0xLjQxLTEuNzkgMS43OSAxLjQxIDEuNDEgMS43OS0xLjc5em0tMy4yMSAxMy43bDEuNzkgMS44IDEuNDEtMS40MS0xLjgtMS43OS0xLjQgMS40ek0yMCAxMC41djJoM3YtMmgtM3ptLTgtNWMtMy4zMSAwLTYgMi42OS02IDZzMi42OSA2IDYgNiA2LTIuNjkgNi02LTIuNjktNi02LTZ6bS0xIDE2Ljk1aDJWMTkuNWgtMnYyLjk1em0tNy40NS0zLjkxbDEuNDEgMS40MSAxLjc5LTEuOC0xLjQxLTEuNDEtMS43OSAxLjh6Ii8+PC9zdmc+"/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('fire')) {
            $(this).prepend('<img alt="Fire Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIgeT0iMCIvPjwvZz48Zz48cGF0aCBkPSJNMTkuNDgsMTIuMzVjLTEuNTctNC4wOC03LjE2LTQuMy01LjgxLTEwLjIzYzAuMS0wLjQ0LTAuMzctMC43OC0wLjc1LTAuNTVDOS4yOSwzLjcxLDYuNjgsOCw4Ljg3LDEzLjYyIGMwLjE4LDAuNDYtMC4zNiwwLjg5LTAuNzUsMC41OWMtMS44MS0xLjM3LTItMy4zNC0xLjg0LTQuNzVjMC4wNi0wLjUyLTAuNjItMC43Ny0wLjkxLTAuMzRDNC42OSwxMC4xNiw0LDExLjg0LDQsMTQuMzcgYzAuMzgsNS42LDUuMTEsNy4zMiw2LjgxLDcuNTRjMi40MywwLjMxLDUuMDYtMC4xNCw2Ljk1LTEuODdDMTkuODQsMTguMTEsMjAuNiwxNS4wMywxOS40OCwxMi4zNXogTTEwLjIsMTcuMzggYzEuNDQtMC4zNSwyLjE4LTEuMzksMi4zOC0yLjMxYzAuMzMtMS40My0wLjk2LTIuODMtMC4wOS01LjA5YzAuMzMsMS44NywzLjI3LDMuMDQsMy4yNyw1LjA4QzE1Ljg0LDE3LjU5LDEzLjEsMTkuNzYsMTAuMiwxNy4zOHoiLz48L2c+PC9zdmc+"/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('environment')) {
            $(this).prepend('<img alt="Environment Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMSAxNy45M2MtMy45NS0uNDktNy0zLjg1LTctNy45MyAwLS42Mi4wOC0xLjIxLjIxLTEuNzlMOSAxNXYxYzAgMS4xLjkgMiAyIDJ2MS45M3ptNi45LTIuNTRjLS4yNi0uODEtMS0xLjM5LTEuOS0xLjM5aC0xdi0zYzAtLjU1LS40NS0xLTEtMUg4di0yaDJjLjU1IDAgMS0uNDUgMS0xVjdoMmMxLjEgMCAyLS45IDItMnYtLjQxYzIuOTMgMS4xOSA1IDQuMDYgNSA3LjQxIDAgMi4wOC0uOCAzLjk3LTIuMSA1LjM5eiIvPjwvc3ZnPg=="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('climate')) {
            $(this).prepend('<img alt="Environment Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMSAxNy45M2MtMy45NS0uNDktNy0zLjg1LTctNy45MyAwLS42Mi4wOC0xLjIxLjIxLTEuNzlMOSAxNXYxYzAgMS4xLjkgMiAyIDJ2MS45M3ptNi45LTIuNTRjLS4yNi0uODEtMS0xLjM5LTEuOS0xLjM5aC0xdi0zYzAtLjU1LS40NS0xLTEtMUg4di0yaDJjLjU1IDAgMS0uNDUgMS0xVjdoMmMxLjEgMCAyLS45IDItMnYtLjQxYzIuOTMgMS4xOSA1IDQuMDYgNSA3LjQxIDAgMi4wOC0uOCAzLjk3LTIuMSA1LjM5eiIvPjwvc3ZnPg=="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('education')) {
            $(this).prepend('<img alt="Education Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik01IDEzLjE4djRMMTIgMjFsNy0zLjgydi00TDEyIDE3bC03LTMuODJ6TTEyIDNMMSA5bDExIDYgOS00LjkxVjE3aDJWOUwxMiAzeiIvPjwvc3ZnPg=="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('law')) {
            $(this).prepend('<img alt="Law Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIgeD0iMCIvPjwvZz48Zz48Zz48cmVjdCBoZWlnaHQ9IjIwIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjcwNzUgLTAuNzA2NyAwLjcwNjcgMC43MDc1IC01LjY4NTQgMTMuNzE5NCkiIHdpZHRoPSI0IiB4PSIxMS43MyIgeT0iMy43MyIvPjxyZWN0IGhlaWdodD0iOCIgdHJhbnNmb3JtPSJtYXRyaXgoMC43MDcgLTAuNzA3MiAwLjcwNzIgMC43MDcgMC4zMTU3IDExLjI0NikiIHdpZHRoPSI0IiB4PSIxMS43MyIgeT0iMS4yNCIvPjxyZWN0IGhlaWdodD0iOCIgdHJhbnNmb3JtPSJtYXRyaXgoMC43MDcxIC0wLjcwNzEgMC43MDcxIDAuNzA3MSAtOC4xNzIyIDcuNzI1NikiIHdpZHRoPSI0IiB4PSIzLjI0IiB5PSI5LjczIi8+PHJlY3QgaGVpZ2h0PSIyIiB3aWR0aD0iMTIiIHg9IjEiIHk9IjIxIi8+PC9nPjwvZz48L3N2Zz4="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('court')) {
            $(this).prepend('<img alt="Law Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIgeD0iMCIvPjwvZz48Zz48Zz48cmVjdCBoZWlnaHQ9IjIwIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjcwNzUgLTAuNzA2NyAwLjcwNjcgMC43MDc1IC01LjY4NTQgMTMuNzE5NCkiIHdpZHRoPSI0IiB4PSIxMS43MyIgeT0iMy43MyIvPjxyZWN0IGhlaWdodD0iOCIgdHJhbnNmb3JtPSJtYXRyaXgoMC43MDcgLTAuNzA3MiAwLjcwNzIgMC43MDcgMC4zMTU3IDExLjI0NikiIHdpZHRoPSI0IiB4PSIxMS43MyIgeT0iMS4yNCIvPjxyZWN0IGhlaWdodD0iOCIgdHJhbnNmb3JtPSJtYXRyaXgoMC43MDcxIC0wLjcwNzEgMC43MDcxIDAuNzA3MSAtOC4xNzIyIDcuNzI1NikiIHdpZHRoPSI0IiB4PSIzLjI0IiB5PSI5LjczIi8+PHJlY3QgaGVpZ2h0PSIyIiB3aWR0aD0iMTIiIHg9IjEiIHk9IjIxIi8+PC9nPjwvZz48L3N2Zz4="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('crime')) {
            $(this).prepend('<img alt="Law Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIgeD0iMCIvPjwvZz48Zz48Zz48cmVjdCBoZWlnaHQ9IjIwIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjcwNzUgLTAuNzA2NyAwLjcwNjcgMC43MDc1IC01LjY4NTQgMTMuNzE5NCkiIHdpZHRoPSI0IiB4PSIxMS43MyIgeT0iMy43MyIvPjxyZWN0IGhlaWdodD0iOCIgdHJhbnNmb3JtPSJtYXRyaXgoMC43MDcgLTAuNzA3MiAwLjcwNzIgMC43MDcgMC4zMTU3IDExLjI0NikiIHdpZHRoPSI0IiB4PSIxMS43MyIgeT0iMS4yNCIvPjxyZWN0IGhlaWdodD0iOCIgdHJhbnNmb3JtPSJtYXRyaXgoMC43MDcxIC0wLjcwNzEgMC43MDcxIDAuNzA3MSAtOC4xNzIyIDcuNzI1NikiIHdpZHRoPSI0IiB4PSIzLjI0IiB5PSI5LjczIi8+PHJlY3QgaGVpZ2h0PSIyIiB3aWR0aD0iMTIiIHg9IjEiIHk9IjIxIi8+PC9nPjwvZz48L3N2Zz4="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('obituary')) {
            $(this).prepend('<img alt="Obituary Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xNCAySDZjLTEuMSAwLTEuOTkuOS0xLjk5IDJMNCAyMGMwIDEuMS44OSAyIDEuOTkgMkgxOGMxLjEgMCAyLS45IDItMlY4bC02LTZ6bTIgMTZIOHYtMmg4djJ6bTAtNEg4di0yaDh2MnptLTMtNVYzLjVMMTguNSA5SDEzeiIvPjwvc3ZnPg=="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('music')) {
            $(this).prepend('<img alt="Music Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMiAzdjEwLjU1Yy0uNTktLjM0LTEuMjctLjU1LTItLjU1LTIuMjEgMC00IDEuNzktNCA0czEuNzkgNCA0IDQgNC0xLjc5IDQtNFY3aDRWM2gtNnoiLz48L3N2Zz4="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('propert')) {
            $(this).prepend('<img alt="Property Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMCAyMHYtNmg0djZoNXYtOGgzTDEyIDMgMiAxMmgzdjh6Ii8+PC9zdmc+"/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('planning')) {
            $(this).prepend('<img alt="Property Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMCAyMHYtNmg0djZoNXYtOGgzTDEyIDMgMiAxMmgzdjh6Ii8+PC9zdmc+"/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('event')) {
            $(this).prepend('<img alt="Event Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0yMCAxMmMwLTEuMS45LTIgMi0yVjZjMC0xLjEtLjktMi0yLTJINGMtMS4xIDAtMS45OS45LTEuOTkgMnY0YzEuMSAwIDEuOTkuOSAxLjk5IDJzLS44OSAyLTIgMnY0YzAgMS4xLjkgMiAyIDJoMTZjMS4xIDAgMi0uOSAyLTJ2LTRjLTEuMSAwLTItLjktMi0yem0tNC40MiA0LjhMMTIgMTQuNWwtMy41OCAyLjMgMS4wOC00LjEyLTMuMjktMi42OSA0LjI0LS4yNUwxMiA1LjhsMS41NCAzLjk1IDQuMjQuMjUtMy4yOSAyLjY5IDEuMDkgNC4xMXoiLz48L3N2Zz4="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('lockdown')) {
            $(this).prepend('<img alt="Coronavirus Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjxwYXRoIGQ9Ik0yMS4yNSwxMC41Yy0wLjQxLDAtMC43NSwwLjM0LTAuNzUsMC43NWgtMS41NGMtMC4xNS0xLjM3LTAuNjktMi42My0xLjUyLTMuNjVsMS4wOS0xLjA5bDAuMDEsMC4wMSBjMC4yOSwwLjI5LDAuNzcsMC4yOSwxLjA2LDBzMC4yOS0wLjc3LDAtMS4wNkwxOC41NCw0LjRjLTAuMjktMC4yOS0wLjc3LTAuMjktMS4wNiwwYy0wLjI5LDAuMjktMC4yOSwwLjc2LTAuMDEsMS4wNWwtMS4wOSwxLjA5IGMtMS4wMi0wLjgyLTIuMjctMS4zNi0zLjY0LTEuNTFWMy41aDAuMDFjMC40MSwwLDAuNzUtMC4zNCwwLjc1LTAuNzVDMTMuNSwyLjM0LDEzLjE2LDIsMTIuNzUsMmgtMS41Yy0wLjQxLDAtMC43NSwwLjM0LTAuNzUsMC43NSBjMCwwLjQxLDAuMzMsMC43NCwwLjc0LDAuNzV2MS41NUM5Ljg3LDUuMTksOC42Miw1Ljc0LDcuNiw2LjU2TDYuNTEsNS40N2wwLjAxLTAuMDFjMC4yOS0wLjI5LDAuMjktMC43NywwLTEuMDYgYy0wLjI5LTAuMjktMC43Ny0wLjI5LTEuMDYsMEw0LjQsNS40NmMtMC4yOSwwLjI5LTAuMjksMC43NywwLDEuMDZjMC4yOSwwLjI5LDAuNzYsMC4yOSwxLjA1LDAuMDFsMS4wOSwxLjA5IGMtMC44MiwxLjAyLTEuMzYsMi4yNi0xLjUsMy42M0gzLjVjMC0wLjQxLTAuMzQtMC43NS0wLjc1LTAuNzVDMi4zNCwxMC41LDIsMTAuODQsMiwxMS4yNXYxLjVjMCwwLjQxLDAuMzQsMC43NSwwLjc1LDAuNzUgYzAuNDEsMCwwLjc1LTAuMzQsMC43NS0wLjc1aDEuNTRjMC4xNSwxLjM3LDAuNjksMi42MSwxLjUsMy42M2wtMS4wOSwxLjA5Yy0wLjI5LTAuMjktMC43Ni0wLjI4LTEuMDUsMC4wMSBjLTAuMjksMC4yOS0wLjI5LDAuNzcsMCwxLjA2bDEuMDYsMS4wNmMwLjI5LDAuMjksMC43NywwLjI5LDEuMDYsMGMwLjI5LTAuMjksMC4yOS0wLjc3LDAtMS4wNmwtMC4wMS0wLjAxbDEuMDktMS4wOSBjMS4wMiwwLjgyLDIuMjYsMS4zNiwzLjYzLDEuNTF2MS41NWMtMC40MSwwLjAxLTAuNzQsMC4zNC0wLjc0LDAuNzVjMCwwLjQxLDAuMzQsMC43NSwwLjc1LDAuNzVoMS41YzAuNDEsMCwwLjc1LTAuMzQsMC43NS0wLjc1IGMwLTAuNDEtMC4zNC0wLjc1LTAuNzUtMC43NWgtMC4wMXYtMS41NGMxLjM3LTAuMTQsMi42Mi0wLjY5LDMuNjQtMS41MWwxLjA5LDEuMDljLTAuMjksMC4yOS0wLjI4LDAuNzYsMC4wMSwxLjA1IGMwLjI5LDAuMjksMC43NywwLjI5LDEuMDYsMGwxLjA2LTEuMDZjMC4yOS0wLjI5LDAuMjktMC43NywwLTEuMDZjLTAuMjktMC4yOS0wLjc3LTAuMjktMS4wNiwwbC0wLjAxLDAuMDFsLTEuMDktMS4wOSBjMC44Mi0xLjAyLDEuMzctMi4yNywxLjUyLTMuNjVoMS41NGMwLDAuNDEsMC4zNCwwLjc1LDAuNzUsMC43NWMwLjQxLDAsMC43NS0wLjM0LDAuNzUtMC43NXYtMS41QzIyLDEwLjg0LDIxLjY2LDEwLjUsMjEuMjUsMTAuNXogTTEzLjc1LDhjMC41NSwwLDEsMC40NSwxLDFzLTAuNDUsMS0xLDFzLTEtMC40NS0xLTFTMTMuMiw4LDEzLjc1LDh6IE0xMiwxM2MtMC41NSwwLTEtMC40NS0xLTFjMC0wLjU1LDAuNDUtMSwxLTFzMSwwLjQ1LDEsMSBDMTMsMTIuNTUsMTIuNTUsMTMsMTIsMTN6IE0xMC4yNSw4YzAuNTUsMCwxLDAuNDUsMSwxcy0wLjQ1LDEtMSwxcy0xLTAuNDUtMS0xUzkuNyw4LDEwLjI1LDh6IE04LjUsMTNjLTAuNTUsMC0xLTAuNDUtMS0xIGMwLTAuNTUsMC40NS0xLDEtMXMxLDAuNDUsMSwxQzkuNSwxMi41NSw5LjA1LDEzLDguNSwxM3ogTTEwLjI1LDE2Yy0wLjU1LDAtMS0wLjQ1LTEtMWMwLTAuNTUsMC40NS0xLDEtMXMxLDAuNDUsMSwxIEMxMS4yNSwxNS41NSwxMC44LDE2LDEwLjI1LDE2eiBNMTMuNzUsMTZjLTAuNTUsMC0xLTAuNDUtMS0xYzAtMC41NSwwLjQ1LTEsMS0xczEsMC40NSwxLDFDMTQuNzUsMTUuNTUsMTQuMywxNiwxMy43NSwxNnogTTE0LjUsMTIgYzAtMC41NSwwLjQ1LTEsMS0xczEsMC40NSwxLDFjMCwwLjU1LTAuNDUsMS0xLDFTMTQuNSwxMi41NSwxNC41LDEyeiIvPjwvc3ZnPg=="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('cricket')) {
            $(this).prepend('<img alt="Cricket Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjwvZz48Zz48Zz48Zz48cGF0aCBkPSJNMTUuMDUsMTIuODFMNi41Niw0LjMyYy0wLjM5LTAuMzktMS4wMi0wLjM5LTEuNDEsMEwyLjMyLDcuMTVjLTAuMzksMC4zOS0wLjM5LDEuMDIsMCwxLjQxbDguNDksOC40OSBjMC4zOSwwLjM5LDEuMDIsMC4zOSwxLjQxLDBsMi44My0yLjgzQzE1LjQ0LDEzLjgzLDE1LjQ0LDEzLjIsMTUuMDUsMTIuODF6Ii8+PHJlY3QgaGVpZ2h0PSI2IiB0cmFuc2Zvcm09Im1hdHJpeCgwLjcwNzEgLTAuNzA3MSAwLjcwNzEgMC43MDcxIC04LjUyNjQgMTcuNzU2MikiIHdpZHRoPSIyIiB4PSIxNi4xNyIgeT0iMTYuMTciLz48L2c+PGNpcmNsZSBjeD0iMTguNSIgY3k9IjUuNSIgcj0iMy41Ii8+PC9nPjwvZz48L3N2Zz4="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('police')) {
            $(this).prepend('<img alt="Police Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjxwYXRoIGQ9Ik0xMiwxTDMsNXY2YzAsNS41NSwzLjg0LDEwLjc0LDksMTJjNS4xNi0xLjI2LDktNi40NSw5LTEyVjVMMTIsMXogTTE0LjUsMTIuNTlsMC45LDMuODhMMTIsMTQuNDJsLTMuNCwyLjA1bDAuOS0zLjg3IGwtMy0yLjU5bDMuOTYtMC4zNEwxMiw2LjAybDEuNTQsMy42NEwxNy41LDEwTDE0LjUsMTIuNTl6Ii8+PC9zdmc+"/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('coronavirus')) {
            $(this).prepend('<img alt="Coronavirus Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src=""/>');
        }
    });
    $('.overline__label_color').each(function() {
        if ($(this).text().includes(' | ')) {
            var text = $(this).text();
            var newText = text.slice(0, -3);
            $(this).text(newText);
        }
        $(this).css('background-color', '#25853F');
        $(this).css('color', 'white');
        $(this).css('padding', '0.15rem');
        $(this).css('border-radius', '0.3rem');
        $(this).css('padding-left', '0.35rem');
        $(this).css('margin-top', '0.5rem');
        $(this).css('margin-bottom', '0.5rem');
        $(this).css('white-space', 'nowrap');
        if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('video')) {
            $(this).prepend('<img alt="Video Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xNyAxMC41VjdjMC0uNTUtLjQ1LTEtMS0xSDRjLS41NSAwLTEgLjQ1LTEgMXYxMGMwIC41NS40NSAxIDEgMWgxMmMuNTUgMCAxLS40NSAxLTF2LTMuNWw0IDR2LTExbC00IDR6Ii8+PC9zdmc+"/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('opinion')) {
            $(this).prepend('<img alt="Opinion Icon" style="height: 0.75rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgwem0xNS4zNSA2LjQxbC0xLjc3LTEuNzdjLS4yLS4yLS41MS0uMi0uNzEgMEw2IDExLjUzVjE0aDIuNDdsNi44OC02Ljg4Yy4yLS4xOS4yLS41MSAwLS43MXoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMjAgMkg0Yy0xLjEgMC0xLjk5LjktMS45OSAyTDIgMjJsNC00aDE0YzEuMSAwIDItLjkgMi0yVjRjMC0xLjEtLjktMi0yLTJ6TTYgMTR2LTIuNDdsNi44OC02Ljg4Yy4yLS4yLjUxLS4yLjcxIDBsMS43NyAxLjc3Yy4yLjIuMi41MSAwIC43MUw4LjQ3IDE0SDZ6bTEyIDBoLTcuNWwyLTJIMTh2MnoiLz48L3N2Zz4="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('live')) {
            $(this).prepend('<img alt="Live Icon" style="height: 0.75rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxnPjxwYXRoIGQ9Ik0wLDBoMjR2MjRIMFYweiIgZmlsbD0ibm9uZSIvPjwvZz48Zz48cGF0aCBkPSJNMTQsMTJjMCwwLjc0LTAuNCwxLjM4LTEsMS43MlYyMmgtMnYtOC4yOGMtMC42LTAuMzUtMS0wLjk4LTEtMS43MmMwLTEuMSwwLjktMiwyLTJTMTQsMTAuOSwxNCwxMnogTTEyLDYgYy0zLjMxLDAtNiwyLjY5LTYsNmMwLDEuNzQsMC43NSwzLjMxLDEuOTQsNC40bDEuNDItMS40MkM4LjUzLDE0LjI1LDgsMTMuMTksOCwxMmMwLTIuMjEsMS43OS00LDQtNHM0LDEuNzksNCw0IGMwLDEuMTktMC41MywyLjI1LTEuMzYsMi45OGwxLjQyLDEuNDJDMTcuMjUsMTUuMzEsMTgsMTMuNzQsMTgsMTJDMTgsOC42OSwxNS4zMSw2LDEyLDZ6IE0xMiwyQzYuNDgsMiwyLDYuNDgsMiwxMiBjMCwyLjg1LDEuMiw1LjQxLDMuMTEsNy4yNGwxLjQyLTEuNDJDNC45OCwxNi4zNiw0LDE0LjI5LDQsMTJjMC00LjQxLDMuNTktOCw4LThzOCwzLjU5LDgsOGMwLDIuMjktMC45OCw0LjM2LTIuNTMsNS44MmwxLjQyLDEuNDIgQzIwLjgsMTcuNDEsMjIsMTQuODUsMjIsMTJDMjIsNi40OCwxNy41MiwyLDEyLDJ6Ii8+PC9nPjwvc3ZnPg=="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('exclusive')) {
            $(this).prepend('<img alt="Exclusive Icon" style="height: 0.75rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTIgMTcuMjdMMTguMTggMjFsLTEuNjQtNy4wM0wyMiA5LjI0bC03LjE5LS42MUwxMiAyIDkuMTkgOC42MyAyIDkuMjRsNS40NiA0LjczTDUuODIgMjF6Ii8+PC9zdmc+"/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('special report')) {
            $(this).prepend('<img alt="Special Report Icon" style="height: 0.75rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTIgMTcuMjdMMTguMTggMjFsLTEuNjQtNy4wM0wyMiA5LjI0bC03LjE5LS42MUwxMiAyIDkuMTkgOC42MyAyIDkuMjRsNS40NiA0LjczTDUuODIgMjF6Ii8+PC9zdmc+"/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('updated')) {
            $(this).prepend('<img alt="Updated Icon" style="height: 0.75rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIgeD0iMCIvPjwvZz48Zz48Zz48Zz48cGF0aCBkPSJNMjEsMTAuMTJoLTYuNzhsMi43NC0yLjgyYy0yLjczLTIuNy03LjE1LTIuOC05Ljg4LTAuMWMtMi43MywyLjcxLTIuNzMsNy4wOCwwLDkuNzlzNy4xNSwyLjcxLDkuODgsMCBDMTguMzIsMTUuNjUsMTksMTQuMDgsMTksMTIuMWgyYzAsMS45OC0wLjg4LDQuNTUtMi42NCw2LjI5Yy0zLjUxLDMuNDgtOS4yMSwzLjQ4LTEyLjcyLDBjLTMuNS0zLjQ3LTMuNTMtOS4xMS0wLjAyLTEyLjU4IHM5LjE0LTMuNDcsMTIuNjUsMEwyMSwzVjEwLjEyeiBNMTIuNSw4djQuMjVsMy41LDIuMDhsLTAuNzIsMS4yMUwxMSwxM1Y4SDEyLjV6Ii8+PC9nPjwvZz48L2c+PC9zdmc+"/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('gallery')) {
            $(this).prepend('<img alt="Gallery Icon" style="height: 0.75rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0yMiAxNlY0YzAtMS4xLS45LTItMi0ySDhjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTJjMS4xIDAgMi0uOSAyLTJ6bS0xMS00bDIuMDMgMi43MUwxNiAxMWw0IDVIOGwzLTR6TTIgNnYxNGMwIDEuMS45IDIgMiAyaDE0di0ySDRWNkgyeiIvPjwvc3ZnPg=="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('review')) {
            $(this).prepend('<img alt="Review Icon" style="height: 0.75rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgwem0xNS4zNSA2LjQxbC0xLjc3LTEuNzdjLS4yLS4yLS41MS0uMi0uNzEgMEw2IDExLjUzVjE0aDIuNDdsNi44OC02Ljg4Yy4yLS4xOS4yLS41MSAwLS43MXoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMjAgMkg0Yy0xLjEgMC0xLjk5LjktMS45OSAyTDIgMjJsNC00aDE0YzEuMSAwIDItLjkgMi0yVjRjMC0xLjEtLjktMi0yLTJ6TTYgMTR2LTIuNDdsNi44OC02Ljg4Yy4yLS4yLjUxLS4yLjcxIDBsMS43NyAxLjc3Yy4yLjIuMi41MSAwIC43MUw4LjQ3IDE0SDZ6bTEyIDBoLTcuNWwyLTJIMTh2MnoiLz48L3N2Zz4="/>');
        } else if (!$(this).html().includes('data:image/svg+xml;base64') && $(this).html().toLowerCase().includes('gallery')) {
            $(this).prepend('<img alt="Gallery Icon" style="height: 0.75rem; line-height: 2rem; vertical-align: middle; display: inline; margin-top: -0.1rem; margin-right: 0.3rem;" src=""/>');
        }
    });
    if ($('.article__label').length) {
        $('.article__label').css('background-color', '#25853F');
        $('.article__label').css('color', 'white');
        $('.article__label').css('border-radius', '0.3rem');
        $('.article__label').css('vertical-align', 'middle');
        if (!$('.article__label').html().includes('data:image/svg+xml;base64') && $('.article__label').html().toLowerCase().includes('video')) {
            $('.article__label').prepend('<img alt="Video Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-right: 0.4rem; margin-top: -0.1rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xNyAxMC41VjdjMC0uNTUtLjQ1LTEtMS0xSDRjLS41NSAwLTEgLjQ1LTEgMXYxMGMwIC41NS40NSAxIDEgMWgxMmMuNTUgMCAxLS40NSAxLTF2LTMuNWw0IDR2LTExbC00IDR6Ii8+PC9zdmc+"/>');
        } else if (!$('.article__label').html().includes('data:image/svg+xml;base64') && $('.article__label').html().toLowerCase().includes('opinion')) {
            $('.article__label').prepend('<img alt="Opinion Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-right: 0.4rem; margin-top: -0.1rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgwem0xNS4zNSA2LjQxbC0xLjc3LTEuNzdjLS4yLS4yLS41MS0uMi0uNzEgMEw2IDExLjUzVjE0aDIuNDdsNi44OC02Ljg4Yy4yLS4xOS4yLS41MSAwLS43MXoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMjAgMkg0Yy0xLjEgMC0xLjk5LjktMS45OSAyTDIgMjJsNC00aDE0YzEuMSAwIDItLjkgMi0yVjRjMC0xLjEtLjktMi0yLTJ6TTYgMTR2LTIuNDdsNi44OC02Ljg4Yy4yLS4yLjUxLS4yLjcxIDBsMS43NyAxLjc3Yy4yLjIuMi41MSAwIC43MUw4LjQ3IDE0SDZ6bTEyIDBoLTcuNWwyLTJIMTh2MnoiLz48L3N2Zz4="/>');
        } else if (!$('.article__label').html().includes('data:image/svg+xml;base64') && $('.article__label').html().toLowerCase().includes('live')) {
            $('.article__label').prepend('<img alt="Live Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-right: 0.4rem; margin-top: -0.1rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxnPjxwYXRoIGQ9Ik0wLDBoMjR2MjRIMFYweiIgZmlsbD0ibm9uZSIvPjwvZz48Zz48cGF0aCBkPSJNMTQsMTJjMCwwLjc0LTAuNCwxLjM4LTEsMS43MlYyMmgtMnYtOC4yOGMtMC42LTAuMzUtMS0wLjk4LTEtMS43MmMwLTEuMSwwLjktMiwyLTJTMTQsMTAuOSwxNCwxMnogTTEyLDYgYy0zLjMxLDAtNiwyLjY5LTYsNmMwLDEuNzQsMC43NSwzLjMxLDEuOTQsNC40bDEuNDItMS40MkM4LjUzLDE0LjI1LDgsMTMuMTksOCwxMmMwLTIuMjEsMS43OS00LDQtNHM0LDEuNzksNCw0IGMwLDEuMTktMC41MywyLjI1LTEuMzYsMi45OGwxLjQyLDEuNDJDMTcuMjUsMTUuMzEsMTgsMTMuNzQsMTgsMTJDMTgsOC42OSwxNS4zMSw2LDEyLDZ6IE0xMiwyQzYuNDgsMiwyLDYuNDgsMiwxMiBjMCwyLjg1LDEuMiw1LjQxLDMuMTEsNy4yNGwxLjQyLTEuNDJDNC45OCwxNi4zNiw0LDE0LjI5LDQsMTJjMC00LjQxLDMuNTktOCw4LThzOCwzLjU5LDgsOGMwLDIuMjktMC45OCw0LjM2LTIuNTMsNS44MmwxLjQyLDEuNDIgQzIwLjgsMTcuNDEsMjIsMTQuODUsMjIsMTJDMjIsNi40OCwxNy41MiwyLDEyLDJ6Ii8+PC9nPjwvc3ZnPg=="/>');
        } else if (!$('.article__label').html().includes('data:image/svg+xml;base64') && $('.article__label').html().toLowerCase().includes('exclusive')) {
            $('.article__label').prepend('<img alt="Exclusive Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-right: 0.4rem; margin-top: -0.1rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTIgMTcuMjdMMTguMTggMjFsLTEuNjQtNy4wM0wyMiA5LjI0bC03LjE5LS42MUwxMiAyIDkuMTkgOC42MyAyIDkuMjRsNS40NiA0LjczTDUuODIgMjF6Ii8+PC9zdmc+"/>');
        } else if (!$('.article__label').html().includes('data:image/svg+xml;base64') && $('.article__label').html().toLowerCase().includes('special report')) {
            $('.article__label').prepend('<img alt="Special Report Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-right: 0.4rem; margin-top: -0.1rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTIgMTcuMjdMMTguMTggMjFsLTEuNjQtNy4wM0wyMiA5LjI0bC03LjE5LS42MUwxMiAyIDkuMTkgOC42MyAyIDkuMjRsNS40NiA0LjczTDUuODIgMjF6Ii8+PC9zdmc+"/>');
        } else if (!$('.article__label').html().includes('data:image/svg+xml;base64') && $('.article__label').html().toLowerCase().includes('updated')) {
            $('.article__label').prepend('<img alt="Updated Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-right: 0.4rem; margin-top: -0.1rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDI0IDI0IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0cHgiIGZpbGw9IiNGRkZGRkYiPjxnPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIgeD0iMCIvPjwvZz48Zz48Zz48Zz48cGF0aCBkPSJNMjEsMTAuMTJoLTYuNzhsMi43NC0yLjgyYy0yLjczLTIuNy03LjE1LTIuOC05Ljg4LTAuMWMtMi43MywyLjcxLTIuNzMsNy4wOCwwLDkuNzlzNy4xNSwyLjcxLDkuODgsMCBDMTguMzIsMTUuNjUsMTksMTQuMDgsMTksMTIuMWgyYzAsMS45OC0wLjg4LDQuNTUtMi42NCw2LjI5Yy0zLjUxLDMuNDgtOS4yMSwzLjQ4LTEyLjcyLDBjLTMuNS0zLjQ3LTMuNTMtOS4xMS0wLjAyLTEyLjU4IHM5LjE0LTMuNDcsMTIuNjUsMEwyMSwzVjEwLjEyeiBNMTIuNSw4djQuMjVsMy41LDIuMDhsLTAuNzIsMS4yMUwxMSwxM1Y4SDEyLjV6Ii8+PC9nPjwvZz48L2c+PC9zdmc+"/>');
        } else if (!$('.article__label').html().includes('data:image/svg+xml;base64') && $('.article__label').html().toLowerCase().includes('gallery')) {
            $('.article__label').prepend('<img alt="Gallery Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-right: 0.4rem; margin-top: -0.1rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0yMiAxNlY0YzAtMS4xLS45LTItMi0ySDhjLTEuMSAwLTIgLjktMiAydjEyYzAgMS4xLjkgMiAyIDJoMTJjMS4xIDAgMi0uOSAyLTJ6bS0xMS00bDIuMDMgMi43MUwxNiAxMWw0IDVIOGwzLTR6TTIgNnYxNGMwIDEuMS45IDIgMiAyaDE0di0ySDRWNkgyeiIvPjwvc3ZnPg=="/>');
        } else if (!$('.article__label').html().includes('data:image/svg+xml;base64') && $('.article__label').html().toLowerCase().includes('review')) {
            $('.article__label').prepend('<img alt="Review Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-right: 0.4rem; margin-top: -0.1rem;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iI0ZGRkZGRiI+PHBhdGggZD0iTTAgMGgyNHYyNEgwem0xNS4zNSA2LjQxbC0xLjc3LTEuNzdjLS4yLS4yLS41MS0uMi0uNzEgMEw2IDExLjUzVjE0aDIuNDdsNi44OC02Ljg4Yy4yLS4xOS4yLS41MSAwLS43MXoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMjAgMkg0Yy0xLjEgMC0xLjk5LjktMS45OSAyTDIgMjJsNC00aDE0YzEuMSAwIDItLjkgMi0yVjRjMC0xLjEtLjktMi0yLTJ6TTYgMTR2LTIuNDdsNi44OC02Ljg4Yy4yLS4yLjUxLS4yLjcxIDBsMS43NyAxLjc3Yy4yLjIuMi41MSAwIC43MUw4LjQ3IDE0SDZ6bTEyIDBoLTcuNWwyLTJIMTh2MnoiLz48L3N2Zz4="/>');
        } else if (!$('.article__label').html().includes('data:image/svg+xml;base64') && $('.article__label').html().toLowerCase().includes('gallery')) {
            $('.article__label').prepend('<img alt="Gallery Icon" style="height: 1rem; line-height: 2rem; vertical-align: middle; display: inline; margin-right: 0.4rem; margin-top: -0.1rem;" src=""/>');
        }
    }
}

function removePromotionalStories() {
    $('.overline__label_color').each(function() {
        if ($(this).text().includes('Promotion')) {
            $(this).parent().parent().parent().parent().parent().remove();
        } else if ($(this).text().includes('Ad')) {
            $(this).parent().parent().parent().parent().parent().remove();
        }
    });
}

window.setInterval(function(){
    updateAll();
}, 500);

function rgb2hex(rgb) {
    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}