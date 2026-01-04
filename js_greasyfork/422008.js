// ==UserScript==
// @name         CrunchyRoll Theater Mode
// @namespace    https://bblok.tech
// @version      1.2
// @description  Watch anime in a comfortable wide view
// @author       Theblockbuster1
// @icon         https://www.crunchyroll.com/favicons/favicon-32x32.png
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @match        https://www.crunchyroll.com/*
// @match        https://crunchyroll.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422008/CrunchyRoll%20Theater%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/422008/CrunchyRoll%20Theater%20Mode.meta.js
// ==/UserScript==

var jq = jQuery.noConflict();

jq(function() {
    if (!jq('#showmedia_video_player')[0]) return; // only run on a video page

    // some parts "borrowed" and edited from https://chrome.google.com/webstore/detail/crunchyroll-theater-mode/fccfjcklfpanhmcgbpcmpjhgindhmlbp
    jq('head').prepend(`<style>
body.crunchyroll-theater-mode header+a,
body.crunchyroll-theater-mode .message_box,
body.crunchyroll-theater-mode #message_box {
    display: none!important;
}
body.crunchyroll-theater-mode #template_container {
    width: auto!important;
}
body.crunchyroll-theater-mode .player-container {
    width: 100%!important;
    height: 100%!important;
}
body.crunchyroll-theater-mode #showmedia_video_box_wide {
    width: 100%!important;
    height: 100%!important;
    order: 1!important;
}
body.crunchyroll-theater-mode #showmedia_video_player {
    position: relative!important;
    width: var(--container-width) !important;
    padding-bottom: 0px!important;
    height: 56.25vw!important;
    max-height: calc(100vh - 80px) !important;
}
body.crunchyroll-theater-mode #showmedia_video_player iframe {
    max-height: calc(100vh - 80px)!important;
    position: absolute!important;
    width: 100%!important;
    height: 100%!important;
    left: 0!important;
    top: 0!important;
}

body.crunchyroll-theater-mode #main_content {
    width: 65% !important;
}
body.crunchyroll-theater-mode #sidebar {
    width: 34% !important;
    margin-top: var(--player-height);
}

#main_content textarea {
    width: 100% !important;
    box-sizing: border-box;
}


/* removes episode selector carousel limit */
.collection-carousel, .collection-carousel-contents {
    width: unset !important;
}
</style>`);


    // Remove banner and ad elements
    jq('#marketing_banner').remove();
    jq('.game-banner-wrapper').remove();
    jq('#showmedia_free_trial_signup').remove();

    jq('<span class="right" style="margin-left: 3px"><button id="toggle-theater" class="add-queue-button not-queued" type="button" style="opacity: 1;"><div class="firefox-flex-fix" style="opacity: 1;"><svg xmlns="http://www.w3.org/2000/svg" fill="rgb(232, 230, 227)" viewBox="0 0 640 512" width="18" height="18" style="margin: 6"><path d="M592 0H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h245.1v32h-160c-17.7 0-32 14.3-32 32s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32h-160v-32H592c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zm-16 352H64V64h512v288z"/></svg><span class="queue-label" style="opacity: 1;">Theater</span></div></button><span class="block" style="opacity: 1;"></span></span>').insertBefore('.showmedia-submenu #sharing_add_queue_button');

    jq(`<li class="userpanel-item"><a class="header-icon" token="topbar" onclick="window.scroll({top: ${jq('.site-header').height()+1}, left: 0, behavior: 'smooth'});"><div class="icon-container"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18" style="margin: 6"><path fill="currentColor" d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path></svg></div></a></li>`).prependTo('.header-userpanel > ul');

    let parent = jq('#showmedia_video_box').parent();

    jq('#toggle-theater').click(function() {
        if (jq(this).hasClass('not-queued')) {
            localStorage.theater = 'true';
            jq(this).removeClass('not-queued').addClass('in-queue');

            jq('body').addClass('crunchyroll-theater-mode');
            document.documentElement.style.setProperty('--player-height', jq('#showmedia_video_player').css('height'));
            document.documentElement.style.setProperty('--container-width', jq('#template_container').css('width'));
            window.scroll({top: jq('.site-header').height()+1, left: 0, behavior: 'smooth'});
        } else {
            localStorage.theater = 'false';
            jq(this).removeClass('in-queue').addClass('not-queued');

            jq('body').removeClass('crunchyroll-theater-mode');
        }
    });

    if (localStorage.theater === 'true') jq('#toggle-theater').click();

    jq(window).resize(function() {
        document.documentElement.style.setProperty('--player-height', jq('#showmedia_video_player').css('height'));
        document.documentElement.style.setProperty('--container-width', jq('#template_container').css('width'));
    });
});