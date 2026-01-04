// ==UserScript==
// @name        iMTwitch
// @namespace   iMAboud
// @match       https://www.twitch.tv/*
// @grant       none
// @version     1.0
// @description minimal and smooth twitch theme
// @downloadURL https://update.greasyfork.org/scripts/497423/iMTwitch.user.js
// @updateURL https://update.greasyfork.org/scripts/497423/iMTwitch.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const css = `
/* Twitch logo */
html body .ScLogoContainer-sc-mx5axi-0 {
    background: url('https://i.imgur.com/q2zFhqF.gif');
    background-color: transparent !important;
    background-size: cover;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
}

/*Live Indicator*/
html body  .tw-channel-status-indicator {
    background: url('https://media.tenor.com/PGhfg5cSGM4AAAAi/red-circle.gif');
    background-color: transparent !important;
    background-size: cover;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
}

/* Hide things */
html body .xVKBI, .gRFhgI , .iwUgDP,.hxCAYc, .hHrBFg, .gRFhgI , .iwUgDP, .OypJE, .kGaJEo, .dszOsc ,.cqKUm,
html body .InjectLayout-sc-1i43xsx-0 > .vertical,
html body .Layout-sc-1xcs6mc-0 .fxCDlb,
html body .InjectLayout-sc-1i43xsx-0 .celebration__overlay .kNREXL,
html body .ScTransformWrapper-sc-1wvuch4-1 .iXjpwc,
html body .ScTransitionBase-sc-hx4quq-0 .iEzfDB .game-card__image .tw-transition,
html body .disclosure-tool,
html body .Layout-sc-1xcs6mc-0 .dqsiIP .headliner-ad,
html body .gdkNRS,
html body .featured-item-video,
html body .Layout-sc-1xcs6mc-0 .fMazMU,
html body .Layout-sc-1xcs6mc-0 .gdkNRS .carousel-metadata--fadeout,
html body .Layout-sc-1xcs6mc-0 .koNLoF .carousel-metadata,
html body .ScDropDownMenuSeparator-sc-sll02v-0,
html body .Layout-sc-1xcs6mc-0 .lkKFaY,
html body .ScTransformWrapper-sc-1wvuch4-1 .ScCornerTop-sc-1wvuch4-2,
html body .ScWrapper-sc-1wvuch4-0 .jTBVCH .tw-hover-accent-effect,
html body .ldSqZG,
html body .chat-input-tray__clickable,
html body .iWWhvN .horizontal,
html body .Layout-sc-1xcs6mc-0 .xxjeD .skip-to-dropdown,
html body .cLfLtl,
html body .bHAUON,
html body .extension-view__iframe,
html body .Layout-sc-1xcs6mc-0 .ehcMTF,
html body .logged-in .dark-theme,
html body .Layout-sc-1xcs6mc-0 .video-player__default-player .video-player__inactive,
html body .video,
html body .click-handler,
html body .channel-info-content > div,
html body .channel-info-content > div > div,
html body .Layout-sc-1xcs6mc-0 .community-highlight-stack__card .community-highlight-stack__card--wide,
html body .dcyYPL:nth-child(4),
html body .Layout-sc-1xcs6mc-0 .kNMrUF .chat-input-tray__open .chat-input-tray__open--persistent,
html body .simplebar-track .horizontal,
html body .Layout-sc-1xcs6mc-0 .cwtKyw .chat-input-container__input-wrapper,
html body .Layout-sc-1xcs6mc-0 .dkddQa .chat-input-container__open .chat-input-container__open--persistent,
html body .Layout-sc-1xcs6mc-0 .jNrYjU .root-scrollable__wrapper,
html body .ScKeyboardPromptText-sc-gsbomr-1,
html body .bkdqPU,
html body .Layout-sc-1xcs6mc-0 .cXbKiY,
html body .CoreText-sc-1txzju1-0 .ScTitleText-sc-d9mj2s-0 .AAWwv .bzDGwQ .tw-title,
html body .Layout-sc-1xcs6mc-0 .eCDqNH .side-nav__title,
html body .Layout-sc-1xcs6mc-0 .jqCeVt .top-nav__menu,
html body .InjectLayout-sc-1i43xsx-0 .iA-duFH .twilight-main,
html body .ScTransitionBase-sc-hx4quq-0 .iEzfDB .tw-transition,
html body .channel-root .channel-root--watch-chat .channel-root--live .channel-root--watch .channel-root--unanimated,
html body .InjectLayout-sc-1i43xsx-0 .click-handler .zzTJm,
html body .InjectLayout-sc-1i43xsx-0 > .ScCoreButtonSecondary-sc-ocjdkq-2,
html body .ScFace-sc-mx5axi-4,
html body .ScEyes-sc-mx5axi-5,
html body .SugpE > .Layout-sc-1xcs6mc-0,
html body .ScBody-sc-mx5axi-3 {
    display: none !important;
    position: absolute !important;
    top: -9999px !important;
    left: -9999px !important;
    background: transparent !important;
    opacity: 0 !important;
}

/* Rounded with no background */
html body .tw-transition,
html body .Layout-sc-1xcs6mc-0,
html body .fSetzA,
html body .Layout-sc-1xcs6mc-0 .jqCeVt .top-nav__menu,
html body .Layout-sc-1xcs6mc-0 .iynFwo .stream-chat,
html body .InjectLayout-sc-1i43xsx-0 .blcfev,
html body #WYSIWGChatInputEditor_SkipChat,
html body .fhQiFC,
html body .channel-root__info,
html body .iTiPMO,
html body .ixiIRM > div,
html body .hGwSPK,
html body #tw-42b59e2b54b3ed8a497119c40f5616f2,
html body .channel-root__right-column,
html body .ScInputBase-sc-vu7u7d-0,
html body .ScInput-sc-19xfhag-0,
html body .gWqzmh,
html body .bYWDyw,
html body .djxcsO,
html body .tw-input,
html body .tw-input--large,
html body .jNIlkd,
html body .tw-combo-input,
html body .hdjkmw,
html body #tw-7be59096c91bbb7b826f2bcc02eaee27,
html body .kjjhRA,
html body .top-nav,
html body .gXxRYI,
html body .video-player__default-player,
html body .video-player__inactive,
html body .skip-to-target,
html body .dcyYPL,
html body .dShujj,
html body .resize-detector,
html body .chat-wysiwyg-input__box,
html body .top-nav__menu,
html body .dqsiIP,
html body .headliner-ad,
html body .ScCoreButton-sc-ocjdkq-0,
html body .ScAspectRatio-sc-18km980-1,
html body .Layout-sc-1xcs6mc-0:nth-child(75),
html body .fhQiFC,
html body .channel-root__info,
html body .iTiPMO,
html body .cBCNTG > .Layout-sc-1xcs6mc-0:nth-child(3),
html body .hGwSPK,
html body .jToAUV,
html body .side-nav-show-more-button,
html body .dRGOOY,
html body .imzcdM,
html body .kuGBVB,
html body .WYSIWGChatInputEditor_SkipChat,
html body .Layout-sc-1xcs6mc-0 .jlCrCH .about-section__panel--content,
html body .chat-room__content,
html body .simplebar-content,
html body .side-nav__scrollable_content,
html body .Layout-sc-1xcs6mc-0 .fhQiFC .chat-room__content,
html body .chat-wysiwyg-input__editor,
html body .side-nav__scrollable_content,
html body .channel-info-content,
html body .Layout-sc-1xcs6mc-0 .ixiIRM,
html body .Layout-sc-1xcs6mc-0 .haGrcr,
html body .Layout-sc-1xcs6mc-0 .dShujj,
html body .channel-root__right-column .channel-root__right-column--expanded,
html body .side-nav-section,
html body .Layout-sc-1xcs6mc-0 .herVPh,
html body .channel-page__video-player,
html body .undefined-child,
html body .Layout-sc-1xcs6mc-0 .dcyYPL .channel-root__main--with-chat,
html body .resize-detector,
html body .Layout-sc-1xcs6mc-0 .bPrCFG .highlight .highlight__collapsed,
html body .channel-root,
html body .channel-root--watch-chat,
html body .channel-root--live,
html body .channel-root--watch,
html body .channel-root--unanimated,
html body .ebXXcv,
html body .jdpzyl {
    background: none !important;
    border-radius: 24px !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
}
/*NOT ROUNDED  FORCED*/
html body .Layout-sc-1xcs6mc-0
{
      border-radius: 11px !important;

}

/* Rounded with transparent bg */

html body .InjectLayout-sc-1i43xsx-0 {
    background-color: hsla(1, 100%, 100%, 0) !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
}

/* Rounded with BG */
html body #root,
html body .hbStTQ ,
html body .hbStTQ ,

html body .bmlpxv,
html body .chat-rules-content,
html body .cHbYms,
html body .tw-tabs,
html body .eCDqNH,
html body .simplebar-content,
html body .capulb,
html body .kelbCv,
html body .eHjcnv .whispers-threads-box__header,
html body .hnGdCZ,
html body .eIpnKc,
html body .eHjcnv,
html body .support-panel,
html body .emote-picker,
html body .emMcNi,
html body .eDUIgp,
html body .hsWEXb,
html body .jYtlWV .eAcvSV .tw-popover-header,
html body .gcEJjU,
html body .ftDwiu,
html body .eAcvSV,
html body .gArFRg,
html body .bPrCFG,
html body .gvrLBv,
html body .eNAmRw,
html body .Layout-sc-1xcs6mc-0 .gyEsuy .bits-buy-card-offer-row,
html body .Layout-sc-1xcs6mc-0 .jljscc,
html body .Layout-sc-1xcs6mc-0 .dcyYPL,
html body .Layout-sc-1xcs6mc-0 .ixiIRM,
html body .Layout-sc-1xcs6mc-0 .ScScrollArea-sc-17qqzr5-0 .dclPEi .chpVl {
    background-color: hsla(260, 8%, 8%, 0.9) !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
}

/*Rounded Only*/
html body  .jRUNHm
{
      border-radius: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

/*Circular*/
html body .chat-badge {
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

html body .Layout-sc-1xcs6mc-0 .guyXeg,
html body .top-nav__search-container {
    padding: 70px !important;
}

html body .CoreText-sc-1txzju1-0,
html body .ScCoreButton-sc-ocjdkq-0,
html body .live-time {
    /* All small Text */
    color: hsla(222, 15%, 90%, 0.5) !important;
    cursor: pointer !important;

}



html body  .CoreText-sc-1txzju1-0 > .ScCoreLink-sc-16kq0mq-0
/*All Link Text*/
{
     color: hsla(1, 100%, 100%, 0.7) !important;

}
html body .eCDqNH > .CoreText-sc-1txzju1-0,
html body .Layout-sc-1xcs6mc-0 .jNrYjU .root-scrollable__wrapper,
html body .gazthU .ScCoreButton-sc-ocjdkq-0 {
    color: hsla(222, 15%, 90%, 0.2) !important;
    text-align: center !important;
    padding: 2px !important;
}


html body .dcyYPL:nth-child(2),
html body .dcyYPL:nth-child(3) {
    /* Dimmed Text */
    color: hsla(222, 15%, 90%, 0.2) !important;
    text-align: center !important;
    padding: 22px !important;

}

/* Add space between the second and third child */
html body .dcyYPL:nth-child(2) {
    margin-bottom: 20px; /* Adjust the value as needed */
}

html body .dcyYPL:nth-child(3) {
    margin-top: 90px; /* Adjust the value as needed */
}

html body .fSetzA,
html body .ceAbGI,
html body .koNLoF {
    /* Accent-1 */
    background-color: hsla(222, 15%, 13%, 0) !important;
    border-radius: 22px !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
        cursor: pointer !important;

}

/* Better Chat */
@keyframes newMessage {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        will-change: transform;
        opacity: 1;
        transform: translateX(5px);
    }
}
html body .chat-line__message:not(.special-message) {
    color: inherit;
    position: relative;
    box-sizing: border-box;
    opacity: 1;
    overflow: hidden;
    padding: 15px !important;
    animation: newMessage 750ms forwards;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
}
html body .chat-line__message:nth-child(2n):not(.special-message) {
    padding: 0 15px;
    background-color: rgba(0, 0, 0, 0.1) !important;
}
html body .chat-line__message:nth-child(2n+1):not(.special-message) {
    padding: 0 15px;
    background-color: inherit !important;
}
html body .special-message {
    color: inherit;
    position: relative;
    box-sizing: border-box;
    padding: 15px !important;
    opacity: 1;
    overflow: hidden;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
}
html body .channel-panels-container, .simplebar-scrollbar, .channel-info-bar {
    backface-visibility: hidden;
}
html body .extension-taskbar, .extension-container {
    display: none;
}


/*Clip Download Button*/
html body .twitchdownload-button {
    background-color: hsla(222, 15%, 90%, 0.5);
    border: none;
    border-radius: 0.4rem;
    margin-right: 6px;
    padding: 5px 2px 5px 2px;
    cursor: pointer;
    width: auto;
    height: 30px;
    display: inline-block;
    align-items: center;
}
html body .twitchdownload-button:hover {
    background-color: hsla(222, 15%, 90%, 0.2);
}
html body .twitchdownload-button:active {
    background-color: hsla(222, 15%, 90%, 0.5);
}
html body .twitchdownload-button:focus {
    background-color: hsla(222, 15%, 90%, 0.5);
}
html body .button-text {
    color: white;
    margin: 0 6px 0 6px;
    font-weight: bold;
}


html body  .dszOsc, .cqKUm, .hxCAYc, .hHrBFg, .OypJE ,.kGaJEo, .gNgtQs, .koNLoF .carousel-metadata {
	/*Testing things to remove*/
      display: none !important;
    position: absolute !important;
    top: -9999px !important;
    left: -9999px !important;
    background: transparent !important;
    opacity: 0 !important;
}


`;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();
