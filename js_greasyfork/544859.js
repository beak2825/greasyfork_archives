// ==UserScript==
// @name         Masquer_Pubs_Sponsor
// @namespace    Masquer_Pubs_Sponsor
// @version      4.8.0
// @description  Masquer certains éléments sur jeuxvideo.com et discord
// @author       Atlantis
// @icon         https://images.emojiterra.com/google/noto-emoji/unicode-15.1/color/128px/26d4.png
// @match        https://*.jeuxvideo.com/*
// @match        https://risibank.fr/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544859/Masquer_Pubs_Sponsor.user.js
// @updateURL https://update.greasyfork.org/scripts/544859/Masquer_Pubs_Sponsor.meta.js
// ==/UserScript==

/* Liens adblock

www.jeuxvideo.com##.ads.anchorWrapper
www.jeuxvideo.com##.sideLatestPublications.sideModule
analytics.tiktok.com
||outbrain.com^

www.jeuxvideo.com##.layout__row.layout__videoFooter
www.jeuxvideo.com##.sideGameAffiliate.sideModule
www.jeuxvideo.com##.newsletter-popin-modal

risibank.fr##.fa-discord, .favorite-heart
risibank.fr##.themed-container.content .bookmark
risibank.fr##.tabs.btn-group > a.text-muted

discord.com##.app-launcher-entrypoint[class*="buttonContainer"]
discord.com##.user-profile-popout div[class*="container"] > svg

xboxygen.com##.htpub, .uk-section-xsmall





*/

GM_addStyle (`
     /*JVC*/
    .ads.anchorWrapper { display: none; }
    .layout__row.layout__videoFooter { display: none; }
    .sideGameAffiliate.sideModule { display: none; }
    .sideModule.sideLatestPublications { display: none; }
    .newsletter-popin-modal { display: none; }
     /*Risi*/
    .fa-discord, .favorite-heart,
    .tabs.btn-group > a.text-muted,
    .themed-container.content .bookmark {
        display: none ! important ;
    }
    .fa-discord { display: none; }
`);
