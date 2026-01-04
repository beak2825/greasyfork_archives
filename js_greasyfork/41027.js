// ==UserScript==
// @name         Calm Quora's annoying red notification dots
// @namespace    joeytwiddle
// @version      1.2.0
// @license      MIT
// @description  The red notifications dots on Quora are annoying, so let's make them grey.  Also hide the popups, separate adverts from content, don't keep opening new tabs, and add some whitespace for readability.
// @author       joeytwiddle
// @match        https://*.quora.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/41027/Calm%20Quora%27s%20annoying%20red%20notification%20dots.user.js
// @updateURL https://update.greasyfork.org/scripts/41027/Calm%20Quora%27s%20annoying%20red%20notification%20dots.meta.js
// ==/UserScript==

var makeRedNotificationsGrey = true;
var makeTheHeaderGray = false;
var hidePopups = true;

// Not removing adverts or promotions, but at least don't make them look like answers. 🙄
var deemphasiseAds = true;
var distinguishPromotedAnswers = true;

var openLinksInThisWindow = true;

// I find the answers on Quora sort of blur into each other
// To address that, this increases the spacing between them
var increaseSeparationOfAnswers1 = true;

// And this indents each answer, but leaves the user's profile picture sticking out
var increaseSeparationOfAnswers2 = true;

function afterPageLoad (callback) {
    //setTimeout(callback, 400);
    document.addEventListener('DOMContentLoaded', () => setTimeout(callback, 4000));
}

if (makeRedNotificationsGrey) {
    // Make the red notification dots grey instead
    //GM_addStyle('.SiteHeaderBadge, .WriteNavbadge, .red_badge, .ui_unread_badge_with_count, .site_header_badge_wrapper .ui_count_badge { background: #ddd !important; background-color: #ddd !important; color: #444 !important; opacity: 0.5; }');
    // This was causing the circle to turn into a rounded square: transform: scale(0.8);
    // Although if we wanted, we could apply it to the parent: .site_header_badge_wrapper { transform: scale(0.8); }
    //GM_addStyle('.qu-bg--red { filter: saturate(0%); }');
    //GM_addStyle('.q-absolute.qu-top--tiny .qu-bg--red { background-color: #ccc; }');
    GM_addStyle('.qu-zIndex--header .qu-bg--red { background-color: #ccc; }');
}

// Just make the whole damn header grey!
// As requested by Keeni: https://greasyfork.org/en/forum/discussion/37380/x
if (makeTheHeaderGray) {
    //GM_addStyle('.SiteHeader, .questions_to_answer_icon { filter: saturate(0%); }');
    //GM_addStyle('.q-fixed.qu-top--0.qu-fullX { filter: saturate(0%); }');
    GM_addStyle('.qu-zIndex--header { filter: saturate(0%); }');
}

if (hidePopups) {
    GM_addStyle('.Growl { display: none !important; }');
}

if (deemphasiseAds) {
    afterPageLoad(function () {
        // Quora's advertisements appear visually a lot like the answers, so it is easy to read an advert and get confused because it's talking about a completely tangential topic.
        // For some reason, I decided not to remove the adverts completely, but to de-emphasise them and differentiate them.
        // The padding is needed so that the text doesn't appear to close to the edge of the red box.
        // A hint of Quora red:
        //var cssForAdverts = { backgroundColor: 'hsl(3, 25%, 90%)', opacity: 0.3, padding: '1em' };
        // Just a light grey
        var cssForAdverts = { backgroundColor: '#f2f2f2', opacity: 0.5, padding: '1em', border: '1px solid #bbb' };
        // No background, just de-emphasise.  The padding is not strictly necessary but it can help to differentiate.
        //var cssForAdverts = { opacity: 0.3, padding: '1em' };
        //var cssForAdverts = { opacity: 0.1, padding: '0em' };
        /*
        //jQuery('.advertiser_endpoint').closest('.outer_content_box').css(cssForAdverts)
        // jQuery isn't always loaded at this point of time, so let's use DOM instead.
        Array.from(document.querySelectorAll('.advertiser_endpoint')).map(ad => ad.closest('.outer_content_box')).forEach(elem => elem && Object.assign(elem.style, cssForAdverts));
        // On the "Home" feed page
        // '.PromptsList'
        Array.from(document.querySelectorAll('.AdStory')).forEach(elem => elem && Object.assign(elem.style, cssForAdverts));
        Array.from(document.querySelectorAll('.dismissed_msg_wrapper')).map(elem => (elem.parentNode || {}).parentNode).forEach(elem => elem && Object.assign(elem.style, cssForAdverts));
        */
        // 2020
        //.q-text.qu-mb--tiny.qu-bold.qu-color--gray_dark_dim.qu-passColorToLinks.TitleText___StyledText-sc-1hpb63h-0.kfJcxX
        //.q-text.qu-mb--tiny.qu-bold -> closest('.spacing_log_question_page_ad') oh
        //Array.from(document.querySelectorAll('.spacing_log_question_page_ad')).forEach(elem => elem && Object.assign(elem.style, cssForAdverts));
        // 2021, promoted questions
        Array.from(document.querySelectorAll('.q-box.qu-borderBottom'))
            .filter(elem => elem.textContent.startsWith('Sponsored by '))
            .forEach(elem => Object.assign(elem.style, cssForAdverts));
    });
}

if (distinguishPromotedAnswers) {
    afterPageLoad(function () {
        // These are sometimes more relevant to the question than standard adverts, so let's not deemphasise them quite so much
        //GM_addStyle('.promoted_answer_wrapper { background-color: #f4f4f4; opacity: 0.7; padding: 1em; border: 1px solid #bbb; }');
        var cssForPromotions = { backgroundColor: '#f4f4f4', opacity: 0.7, padding: '1em', border: '1px solid #bbb' };
        Array.from(document.querySelectorAll('.q-box.qu-borderBottom'))
            .filter(elem => elem.textContent.startsWith('Promoted by '))
            .forEach(elem => Object.assign(elem.style, cssForPromotions));
    });
}

// Beautify avatars
GM_addStyle('.feed_item_answer_user .user { font-weight: 600; }');
GM_addStyle('.NameCredential, .IdentityCredential, .UserCredential { font-style: italic; font-size: 85%; }');

if (increaseSeparationOfAnswers1) {
    // Instead of answers cramped together with horizontal rules separating them, put some nice big whitespace between each answer
    //GM_addStyle('.NewGridQuestionPage .AnswerBase { border-top: none; padding: 50px 0px 50px; }');

    // Or keep the lines close to the top of each answer
    GM_addStyle('.NewGridQuestionPage .AnswerBase { margin: 40px 0px; border-top: none !important; }');
    // This gives the same spacing to the adverts
    GM_addStyle('.content_area { margin: 40px 0px; }');
}

if (increaseSeparationOfAnswers2) {
    GM_addStyle('.Answer { padding-left: 45px; }');
    GM_addStyle('.ContentHeader { margin-left: -47px; }');
}

if (openLinksInThisWindow) {
    afterPageLoad(function () {
        document.body.addEventListener('click', function (evt) {
            var link = evt.target.closest('a');
            if (link && link.getAttribute('target') === '_blank') {
                link.setAttribute('target', '');
            }
        });
    });
}
