// ==UserScript==
// @name          theguardian [fork] [broken]
// @namespace     http://userstyles.org
// @description	  Make the guardian great again!
// @author        coxmichael
// @homepage      https://userstyles.org/styles/154282
// @copyright     2018, coxmichael
// @contributor   Paul "Joey" Clark (https://github.com/joeytwiddle/)
// @license       CC-BY-4.0
// @license       GPL-3.0
// @include       http://www.theguardian.com/*
// @include       https://www.theguardian.com/*
// @include       http://*.www.theguardian.com/*
// @include       https://*.www.theguardian.com/*
// @do-not-run-at document-start
// @version       0.20180116142410-joey17
// @downloadURL https://update.greasyfork.org/scripts/37596/theguardian%20%5Bfork%5D%20%5Bbroken%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/37596/theguardian%20%5Bfork%5D%20%5Bbroken%5D.meta.js
// ==/UserScript==

// An example of the old site, for reference:
// http://web.archive.org/web/20150321110247/http://www.theguardian.com/us

// The new Guardian uses a dark blue, and this yellow on top
//const yellowOrangeHighlight = '#ffe500';
//const yellowOrangeHighlight = 'hsl(54, 100%, 50%)';
// But the original Guardian used a lighter blue.
// Since we reintroduce that blue, we need a different yellow to work with it.

// This yellow was used on the old site, although it never used to touch the blue background.
const yellowOrangeHighlight = `hsl(44, 100%, 65%)`;
// Now that it touches the blue, heavier may be preferable.
//const yellowOrangeHighlight = `hsl(44, 100%, 58%)`;

const activePillarHighlight = '#fff';
//const activePillarHighlight = yellowOrangeHighlight;

(function() {var css = [
	".new-header {",
	"    background: #005689;",
	"}",
	"",
	".pillar-link.pillar-link,",
	".top-bar__item {",
	"    color:#fff;",
	"}",
	"",
	/* Make the tab indicator white instead of multi-coloured */
	".pillar-link.pillar-link:after {",
	"    border-color:" + activePillarHighlight + ";",
	"}",
	/* Skip the white stripe across the bar at the top of the page */
	".pillar-link:not(.pillar-link--current-section):not(:hover):after {",
	"    border-top: 0;",
	"}",
    `
    /* The white activePillarHighlight looks good, except when it merges into other white. */
    /* We can fix it by surrounding it in blue. */
    .l-footer__secondary {
        padding-top: 1px;
    }
    `,
	"",
	".top-bar__item--cta--circle:before {",
	"    background:#4bc6df;",
	"}",
	"",
	".new-header--news .top-bar__item--cta:hover .top-bar__item--cta--circle:before, ",
	".new-header--news .top-bar__item--cta:focus .top-bar__item--cta--circle:before {",
	"    background:#4bc6df;",
	"}",
	"",
	".top-bar__item--cta--text,",
	".rich-link:not(.rich-link--paidfor) .inline-arrow-in-circle-garnett__svg, ",
	".rich-link:not(.rich-link--paidfor).rich-link--pillar-news .inline-arrow-in-circle-garnett__svg,",
	".rich-link:not(.rich-link--paidfor) .rich-link__byline, ",
	".rich-link:not(.rich-link--paidfor) .rich-link__kicker, ",
	".rich-link:not(.rich-link--paidfor) .rich-link__read-more-text, ",
	".rich-link:not(.rich-link--paidfor).rich-link--pillar-news .rich-link__byline, ",
	".rich-link:not(.rich-link--paidfor).rich-link--pillar-news .rich-link__kicker, ",
	".rich-link:not(.rich-link--paidfor).rich-link--pillar-news .rich-link__read-more-text {",
	"    color:#114b6d;",
	"}",
	"",
	".inline-the-guardian-logo__svg path {",
	"    fill:#fff;",
	"}",
	"",
	".veggie-burger {",
	"    background:#4bc6df;",
	"}",
	"",
	"/*  text / headlines */",
	"",
	".fc-today .fc-today__sub,",
	".fc-item--pillar-news .fc-item__kicker,",
	".fc-container__header__title,",
	".fc-sublink--pillar-news .fc-sublink__kicker,",
	".content--pillar-news .byline, .content--pillar-news .content--media .content__headline, .content--pillar-news .old-article-message, .content--pillar-news .pullquote-cite, .content--pillar-news .content__section-label__link, .content--pillar-news a, .paid-content .byline, .paid-content .content--media .content__headline, .paid-content .old-article-message, .paid-content .pullquote-cite, .paid-content .content__section-label__link, .paid-content a,",
	".content--pillar-news .button--secondary, .content--pillar-news .drop-cap, .content--pillar-news .element-pullquote p, .content--pillar-news.content--type-feature .content__headline, .content--pillar-news.content--type-review .content__headline, .content--pillar-news .u-underline, .paid-content .button--secondary, .paid-content .drop-cap, .paid-content .element-pullquote p, .paid-content.content--type-feature .content__headline, .paid-content.content--type-review .content__headline, .paid-content .u-underline {",
	"    color:#005689;",
	"}",
	"",
	".fc-item--pillar-news.fc-item--type-feature .fc-item__headline {",
	"    color:#7b7b7b;",
	"}",
	"",
	".fc-container__header__title {",
	"    padding-top:1em;",
	"    padding-bottom:1em;",
	"}",
	"",
	".fc-item--pillar-news .fc-item__container:before,",
	".rich-link:not(.rich-link--paidfor) .rich-link__avatar__media, .rich-link:not(.rich-link--paidfor) .rich-link__container::before, .rich-link:not(.rich-link--paidfor).rich-link--pillar-news .rich-link__avatar__media, .rich-link:not(.rich-link--paidfor).rich-link--pillar-news .rich-link__container::before {",
	"    background-color:#005689;",
	"}",
	"",
	".fc-item--pillar-news .vjs-big-play-button .vjs-control-text:before,",
	".fc-item--pillar-news .youtube-media-atom__play-button {",
	"    background-color:#005689;",
	"}",
	"",
	".new-header--news .subnav__item--parent:after {",
	"    border-left-color: #005689;",
	"}",
	"",
	"/* rule */",
	"",
	".new-header:not(.new-header--slim):after {",
	"    height: 1px;",
	"}",
	"",
	".content--liveblog .content__meta-container, .content--media .content__meta-container, .content--type-analysis .content__meta-container, .content--type-article .content__meta-container, .content--type-comment .content__meta-container, .content--type-feature .content__meta-container, .content--type-guardianview .content__meta-container, .content--type-immersive .content__meta-container, .content--type-interview .content__meta-container, .content--type-live .content__meta-container, .content--type-matchreport .content__meta-container, .content--type-media .content__meta-container, .content--type-review .content__meta-container, .content--type-quiz .content__meta-container,",
	".fc-item--type-comment .fc-item__container>.fc-item__meta {",
	"    background-image:none;",
	"}",
	"",
	"/*  opinion */",
	"",
	".fc-item--pillar-arts .fc-item__kicker {",
	"    color: #FF9800;",
	"}",
	"",
	".fc-item--pillar-arts .fc-item__container:before {",
	"    background-color:#FF9800;",
	"}",
	"",
	"/* most viewed */",
	".headline-list__link .inline-numbers,",
	".rich-link:not(.rich-link--paidfor) .inline-arrow-in-circle-garnett__svg, .rich-link:not(.rich-link--paidfor).rich-link--pillar-news .inline-arrow-in-circle-garnett__svg {",
	"    fill:#005689;",
	"}",
	"",
	"/* footer */",
	".footer__back-to-top-container {",
	"    background: #005689;",
	"    ",
	"}",
	"",
	"",
	".back-to-top__text {",
	"    color:#fff;",
	"}",
	"",
	".back-to-top__icon-container {",
	"    background-color:#4bc6df;",
	"}",
	"",
	".content--pillar-news .block-share__item .inline-icon, .content--pillar-news .inline-close svg, .content--pillar-news .commentcount2__heading span, .content--pillar-news .old-article-message .old-article-message--clock svg, .content--pillar-news .social-icon svg, .content--pillar-news .social-icon__svg, .paid-content .block-share__item .inline-icon, .paid-content .inline-close svg, .paid-content .commentcount2__heading span, .paid-content .old-article-message .old-article-message--clock svg, .paid-content .social-icon svg, .paid-content .social-icon__svg {",
	"    fill: #797979;",
	"}",
	"",
	".content--liveblog .submeta, .content--media .submeta, .content--type-analysis .submeta, .content--type-article .submeta, .content--type-comment .submeta, .content--type-feature .submeta, .content--type-guardianview .submeta, .content--type-immersive .submeta, .content--type-interview .submeta, .content--type-live .submeta, .content--type-matchreport .submeta, .content--type-media .submeta, .content--type-review .submeta, .content--type-quiz .submeta {",
	"    background:none;",
	"}",
	"",
	".content--pillar-news .block-share__item:focus, .content--pillar-news .block-share__item:hover, .content--pillar-news .social-icon:focus, .content--pillar-news .social-icon:hover, .content--pillar-news .social-icon.social-icon--more:focus, .content--pillar-news .social-icon.social-icon--more:hover, .paid-content .block-share__item:focus, .paid-content .block-share__item:hover, .paid-content .social-icon:focus, .paid-content .social-icon:hover, .paid-content .social-icon.social-icon--more:focus, .paid-content .social-icon.social-icon--more:hover {",
	"    background-color: #005689;",
	"    border: 0.0625rem solid #005689;",
	"}",
	"",
	".content--pillar-news .u-underline:hover, .paid-content .u-underline:hover {",
	"    border-bottom: solid 0.0625rem #005689;",
	"}",
	"",
	".new-header.new-header--open, .menu {",
	"    background-color: #005689;",
	"}",
	"",
	"",
	".menu-item__title {",
	"    color:#fff !important;",
	"}",

    // Remove the ugly new logo and restore the old one
    ".new-header .new-header__logo {",
    "    height: 4.6em;",
    "    padding-top: 1.2em;",
    "}",
    // Something is pushing the text away from the edge; this brings it back
    //"@media (min-width: 81.25em) body:not(.has-page-skin) .new-header__logo {",
    //"    margin-right: -1em;",
    //"}",
    // But that didn't work, so we use !important instead.  Unfortunately, this might override rules for lower widths too.
    ".new-header .new-header__logo {",
    "    margin-right: 0.2em !important;",
    "}",
    // TODO: We should shrink the logo for smaller widths
    // The SVG logo had these sizes:
    // width <  740px => 175x56px
    // width >= 740px => 224x72px
    // width >= 980px => 295x95px
    ".new-header .inline-the-guardian-logo svg {",
    "    display: none;",
    "}",
    ".new-header .inline-the-guardian-logo::before, .inline-the-guardian-logo::after {",
    "    font-size: 360%;",
    "    font-weight: 800;",
    "    letter-spacing: -0.02em;",
    "}",
    ".new-header .inline-the-guardian-logo::before {",
    "    content: 'the';",
    "    color: #9fdce7;",
    "}",
    ".new-header .inline-the-guardian-logo::after {",
    "    content: 'guardian';",
    "    color: white;",
    "}",

    // The yellow CTA clashes against the classic blue.  Shift it towards orange for balance.
    `
    .cta-bar__cta {
        background-color: ${yellowOrangeHighlight};
    }
    .cta-bar__heading {
        color: ${yellowOrangeHighlight};
    }
    .old-article-message {
        background: ${yellowOrangeHighlight};
    }
    .content--pillar-news .old-article-message {
        color: black;
    }
    .contributions__adblock {
        background-color: ${yellowOrangeHighlight};
    }
    .contributions__adblock .contributions__adblock-content {
        border-top-color: ${yellowOrangeHighlight};
    }
    .contributions__adblock .contributions__adblock-button {
        background-color: ${yellowOrangeHighlight};
    }
    .contributions__epic {
        border-top-color: ${yellowOrangeHighlight};
    }
    a[href].contributions__contribute.contributions__contribute--epic, a[href].contributions__learn-more.contributions__learn-more--epic, .contributions__adblock-button a {
        background-color: ${yellowOrangeHighlight};
    }
    .contributions__highlight {
        background-color: ${yellowOrangeHighlight};
    }
    .component-button--primary {
        background-color: ${yellowOrangeHighlight};
    }
    .component-button--primary:hover, .component-button--primary:focus {
        background-color: ${yellowOrangeHighlight};
    }
    ::selection {
        background: ${yellowOrangeHighlight};
    }

    .l-footer {
        background: #005689;
    }
    .footer__back-to-top {
        background-color: #005689;
    }

    /* Hovered links in the header/footer */
    .top-bar__item:hover, .top-bar__item:focus {
        color: ${yellowOrangeHighlight};
    }
    .colophon__item a:hover, .colophon__item a:focus {
        color: ${yellowOrangeHighlight};
    }

    /* Hovered buttons, e.g. in the daily email signup form */
    .email-sub__form--footer .email-sub__submit-button:hover, .email-sub__form--footer .email-sub__submit-button:focus, .email-sub__form--footer .email-sub__submit-button:active {
        background-color: ${yellowOrangeHighlight};
    }

    /* New overlay footer */
    .site-message--subscription-banner {
        background: ${yellowOrangeHighlight};
    }
    `,

    // Instead of the new font "Guardian Egyptian Web" with the sharp serifs
    // use the old font "Guardian Text Egyptian Web" with the softer serifs
    '.d-badge:after,.d2-badge:after,',
    '.gs-webResult .gs-snippet,.gs-imageResult .gs-snippet,',
    '.gsc-thumbnail-inside a.gs-title,',
    '.search-tool__link,',
    '.weather__desc,',
    '.weather__location .search-tool__input,',
    '.tabs__tab a,.tabs__tab .tab__link,',
    '.headline-list__count,',
    '.headline-list__link,',
    '.rich-link__byline,',
    '.rich-link__standfirst,',
    '.site-message,',
    '.adblock-sticky__coin-result,',
    '.adblock-sticky__coin-message,',
    '.adblock-sticky__message,',
    '.adblock-sticky__quote-text,',
    '.adblock-sticky__author,',
    '.breaking-news__item-kicker,.breaking-news__item-headline,',
    '.vjs-error-display>div,',
    '.vjs-overlay--big-title .vjs-overlay__title,',
    '.vjs-overlay--big-title .vjs-overlay__duration,',
    '.vjs-overlay--small-title,',
    '.vjs-embedoverlay-text,',
    '.end-slate-container__heading,',
    '.vjs-fullscreen .end-slate.items--media .item__headline,',
    '.fc-item--media .fc-item__title,',
    '.user__question-title,',
    '.user__question-text,',
    '.dumathoin__blurb,',
    '.crossword__accessible-data--header,',
    '.crossword__clues-header,',
    '.email-sub__header--landing,',
    '.giraffe__heading,',
    '.giraffe__copy,',
    '.contributions__title,',
    '.contributions__paragraph,',
    '.contributions__title--epic--subtle,',
    '.chart--doughnut .chart__unit,',
    '.most-viewed-container--media .most-viewed-container__heading,',
    '.discussion__disabled-msg,',
    '.activity-item__title,',
    '.gallery__caption__title,',
    '.gallery-lightbox__img-caption>strong:first-child,',
    '.gallery-lightbox__img-title,',
    '.live-notifications-explainer__headline,',
    '.right-most-popular-item__headline,',
    '.right-most-popular__byline,',
    '.element-membership--not-upgraded a,',
    '.witness__button,',
    '.football-table__container .table__caption--top,',
    '.team__info,',
    '.goal-attempts__off-target,.goal-attempts__on-target,',
    '.bar-fight__bar,',
    '.chart--football-possession .chart__label-value,',
    '.section-divider,',
    '.player-card__name,',
    '.container__meta .container__meta__title,',
    '.container__meta .container__meta__item,',
    '.fc-container__header__title,.fc-container__header__title--sticky,.container__title,',
    '.fc-container__header__description,',
    '.fc-today,',
    '.fc-container__updated,',
    '.fc-date-headline,',
    '.index-page-header__title,',
    '.index-page-header__description,',
    '.video-overlay .video-overlay__headline,',
    '.fc-sublink__title,',
    '.fc-item__header,.video-overlay__headline,.item__title,.rich-link__header,',
    '.fc-item__liveblog-block__text,',
    '.fc-item__liveblog-block__text:after,',
    '.email-sub--article .email-sub__heading,',
    '.type-5,',
    '.nav--columns .nav__link,',
    '.page-header,',
    '.page-sub-header,',
    '.rich-link .rich-link__header,',
    '.rich-link__read-more-text,',
    '.content__section-label,',
    '.content__series-label,',
    '.content__inline-section,',
    '.content__headline,',
    '.content__standfirst,',
    '.drop-cap,',
    '.content__meta-heading,',
    '.meta__bio,',
    '.content--liveblog .submeta__section-labels .submeta__link,.content--media .submeta__section-labels .submeta__link,.content--type-analysis .submeta__section-labels .submeta__link,.content--type-article .submeta__section-labels .submeta__link,.content--type-comment .submeta__section-labels .submeta__link,.content--type-feature .submeta__section-labels .submeta__link,.content--type-guardianview .submeta__section-labels .submeta__link,.content--type-immersive .submeta__section-labels .submeta__link,.content--type-interview .submeta__section-labels .submeta__link,.content--type-live .submeta__section-labels .submeta__link,.content--type-matchreport .submeta__section-labels .submeta__link,.content--type-media .submeta__section-labels .submeta__link,.content--type-review .submeta__section-labels .submeta__link,.content--type-quiz .submeta__section-labels .submeta__link,',
    '.content--liveblog .content__headline,.content--media .content__headline,.content--type-analysis .content__headline,.content--type-article .content__headline,.content--type-comment .content__headline,.content--type-feature .content__headline,.content--type-guardianview .content__headline,.content--type-immersive .content__headline,.content--type-interview .content__headline,.content--type-live .content__headline,.content--type-matchreport .content__headline,.content--type-media .content__headline,.content--type-review .content__headline,.content--type-quiz .content__headline,',
    '.content--liveblog .element-pullquote.element--supporting .pullquote-cite,.content--liveblog .element-pullquote.element--supporting .pullquote-paragraph,.content--media .element-pullquote.element--supporting .pullquote-cite,.content--media .element-pullquote.element--supporting .pullquote-paragraph,.content--type-analysis .element-pullquote.element--supporting .pullquote-cite,.content--type-analysis .element-pullquote.element--supporting .pullquote-paragraph,.content--type-article .element-pullquote.element--supporting .pullquote-cite,.content--type-article .element-pullquote.element--supporting .pullquote-paragraph,.content--type-comment .element-pullquote.element--supporting .pullquote-cite,.content--type-comment .element-pullquote.element--supporting .pullquote-paragraph,.content--type-feature .element-pullquote.element--supporting .pullquote-cite,.content--type-feature .element-pullquote.element--supporting .pullquote-paragraph,.content--type-guardianview .element-pullquote.element--supporting .pullquote-cite,.content--type-guardianview .element-pullquote.element--supporting .pullquote-paragraph,.content--type-immersive .element-pullquote.element--supporting .pullquote-cite,.content--type-immersive .element-pullquote.element--supporting .pullquote-paragraph,.content--type-interview .element-pullquote.element--supporting .pullquote-cite,.content--type-interview .element-pullquote.element--supporting .pullquote-paragraph,.content--type-live .element-pullquote.element--supporting .pullquote-cite,.content--type-live .element-pullquote.element--supporting .pullquote-paragraph,.content--type-matchreport .element-pullquote.element--supporting .pullquote-cite,.content--type-matchreport .element-pullquote.element--supporting .pullquote-paragraph,.content--type-media .element-pullquote.element--supporting .pullquote-cite,.content--type-media .element-pullquote.element--supporting .pullquote-paragraph,.content--type-review .element-pullquote.element--supporting .pullquote-cite,.content--type-review .element-pullquote.element--supporting .pullquote-paragraph,.content--type-quiz .element-pullquote.element--supporting .pullquote-cite,.content--type-quiz .element-pullquote.element--supporting .pullquote-paragraph,',
    '.content--liveblog .element-pullquote.element--halfWidth .pullquote-cite,.content--liveblog .element-pullquote.element--halfWidth .pullquote-paragraph,.content--media .element-pullquote.element--halfWidth .pullquote-cite,.content--media .element-pullquote.element--halfWidth .pullquote-paragraph,.content--type-analysis .element-pullquote.element--halfWidth .pullquote-cite,.content--type-analysis .element-pullquote.element--halfWidth .pullquote-paragraph,.content--type-article .element-pullquote.element--halfWidth .pullquote-cite,.content--type-article .element-pullquote.element--halfWidth .pullquote-paragraph,.content--type-comment .element-pullquote.element--halfWidth .pullquote-cite,.content--type-comment .element-pullquote.element--halfWidth .pullquote-paragraph,.content--type-feature .element-pullquote.element--halfWidth .pullquote-cite,.content--type-feature .element-pullquote.element--halfWidth .pullquote-paragraph,.content--type-guardianview .element-pullquote.element--halfWidth .pullquote-cite,.content--type-guardianview .element-pullquote.element--halfWidth .pullquote-paragraph,.content--type-immersive .element-pullquote.element--halfWidth .pullquote-cite,.content--type-immersive .element-pullquote.element--halfWidth .pullquote-paragraph,.content--type-interview .element-pullquote.element--halfWidth .pullquote-cite,.content--type-interview .element-pullquote.element--halfWidth .pullquote-paragraph,.content--type-live .element-pullquote.element--halfWidth .pullquote-cite,.content--type-live .element-pullquote.element--halfWidth .pullquote-paragraph,.content--type-matchreport .element-pullquote.element--halfWidth .pullquote-cite,.content--type-matchreport .element-pullquote.element--halfWidth .pullquote-paragraph,.content--type-media .element-pullquote.element--halfWidth .pullquote-cite,.content--type-media .element-pullquote.element--halfWidth .pullquote-paragraph,.content--type-review .element-pullquote.element--halfWidth .pullquote-cite,.content--type-review .element-pullquote.element--halfWidth .pullquote-paragraph,.content--type-quiz .element-pullquote.element--halfWidth .pullquote-cite,.content--type-quiz .element-pullquote.element--halfWidth .pullquote-paragraph,',
    '.content--liveblog .element-pullquote.element--inline .pullquote-cite,.content--liveblog .element-pullquote.element--inline .pullquote-paragraph,.content--media .element-pullquote.element--inline .pullquote-cite,.content--media .element-pullquote.element--inline .pullquote-paragraph,.content--type-analysis .element-pullquote.element--inline .pullquote-cite,.content--type-analysis .element-pullquote.element--inline .pullquote-paragraph,.content--type-article .element-pullquote.element--inline .pullquote-cite,.content--type-article .element-pullquote.element--inline .pullquote-paragraph,.content--type-comment .element-pullquote.element--inline .pullquote-cite,.content--type-comment .element-pullquote.element--inline .pullquote-paragraph,.content--type-feature .element-pullquote.element--inline .pullquote-cite,.content--type-feature .element-pullquote.element--inline .pullquote-paragraph,.content--type-guardianview .element-pullquote.element--inline .pullquote-cite,.content--type-guardianview .element-pullquote.element--inline .pullquote-paragraph,.content--type-immersive .element-pullquote.element--inline .pullquote-cite,.content--type-immersive .element-pullquote.element--inline .pullquote-paragraph,.content--type-interview .element-pullquote.element--inline .pullquote-cite,.content--type-interview .element-pullquote.element--inline .pullquote-paragraph,.content--type-live .element-pullquote.element--inline .pullquote-cite,.content--type-live .element-pullquote.element--inline .pullquote-paragraph,.content--type-matchreport .element-pullquote.element--inline .pullquote-cite,.content--type-matchreport .element-pullquote.element--inline .pullquote-paragraph,.content--type-media .element-pullquote.element--inline .pullquote-cite,.content--type-media .element-pullquote.element--inline .pullquote-paragraph,.content--type-review .element-pullquote.element--inline .pullquote-cite,.content--type-review .element-pullquote.element--inline .pullquote-paragraph,.content--type-quiz .element-pullquote.element--inline .pullquote-cite,.content--type-quiz .element-pullquote.element--inline .pullquote-paragraph,',
    '.content--liveblog .element-pullquote.element--showcase .pullquote-cite,.content--liveblog .element-pullquote.element--showcase .pullquote-paragraph,.content--media .element-pullquote.element--showcase .pullquote-cite,.content--media .element-pullquote.element--showcase .pullquote-paragraph,.content--type-analysis .element-pullquote.element--showcase .pullquote-cite,.content--type-analysis .element-pullquote.element--showcase .pullquote-paragraph,.content--type-article .element-pullquote.element--showcase .pullquote-cite,.content--type-article .element-pullquote.element--showcase .pullquote-paragraph,.content--type-comment .element-pullquote.element--showcase .pullquote-cite,.content--type-comment .element-pullquote.element--showcase .pullquote-paragraph,.content--type-feature .element-pullquote.element--showcase .pullquote-cite,.content--type-feature .element-pullquote.element--showcase .pullquote-paragraph,.content--type-guardianview .element-pullquote.element--showcase .pullquote-cite,.content--type-guardianview .element-pullquote.element--showcase .pullquote-paragraph,.content--type-immersive .element-pullquote.element--showcase .pullquote-cite,.content--type-immersive .element-pullquote.element--showcase .pullquote-paragraph,.content--type-interview .element-pullquote.element--showcase .pullquote-cite,.content--type-interview .element-pullquote.element--showcase .pullquote-paragraph,.content--type-live .element-pullquote.element--showcase .pullquote-cite,.content--type-live .element-pullquote.element--showcase .pullquote-paragraph,.content--type-matchreport .element-pullquote.element--showcase .pullquote-cite,.content--type-matchreport .element-pullquote.element--showcase .pullquote-paragraph,.content--type-media .element-pullquote.element--showcase .pullquote-cite,.content--type-media .element-pullquote.element--showcase .pullquote-paragraph,.content--type-review .element-pullquote.element--showcase .pullquote-cite,.content--type-review .element-pullquote.element--showcase .pullquote-paragraph,.content--type-quiz .element-pullquote.element--showcase .pullquote-cite,.content--type-quiz .element-pullquote.element--showcase .pullquote-paragraph,',
    '.content--type-guardianview .content__headline,.content--type-comment .content__headline,',
    '.content--type-guardianview .content__head--byline-pic .content__header .content__headline__byline,.content--type-comment .content__head--byline-pic .content__header .content__headline__byline,',
    '.content--type-comment:not(.paid-content) .content__standfirst,.content--type-feature:not(.paid-content) .content__standfirst,.content--type-guardianview:not(.paid-content) .content__standfirst,.content--type-review:not(.paid-content) .content__standfirst,',
    '@media (min-width: 46.25em),',
    '.section-football .team__info,',
    '.section-football .match-summary--responsive .team__info,',
    '.section-football .goal-attempts__off-target,.section-football .goal-attempts__on-target,',
    '.section-football .chart--football-possession .chart__label-value,',
    '.section-football .bar-fight__bar,',
    '.content__head--byline-pic .content__header .content__headline__byline,',
    '.blog .from-content-api .block-title,',
    '.dropdown--key-events .dropdown__label,.dropdown--live-feed .dropdown__label,',
    '.blog__related__head,',
    '.blog .content__headline,',
    '.blog .content__section-label,',
    '.content--immersive-article:not(.content--immersive-garnett) .element-pullquote .pullquote-paragraph,.content--immersive-article:not(.content--immersive-garnett) .element-pullquote .pullquote-cite,',
    '.content--immersive-article .section-title,.content--immersive-article .from-content-api>h2,',
    '.content--immersive:not(.immersive-main-media__gallery):not(.paid-content):not(.content--gallery):not(.content--minute-article) .immersive-main-media__headline-container .content__series-label__link,',
    '.content--immersive:not(.immersive-main-media__gallery):not(.paid-content):not(.content--gallery):not(.content--minute-article) .content__standfirst--immersive-article,',
    '.content--minute-article .content__standfirst,',
    '.content__dateline--minute-article,',
    '.block--minute-article .block-elements .block-title,',
    '.block--minute-article.block--minute-article--quote .quoted__contents,',
    '.from-content-api>h2,.from-content-api .block-elements>h2,',
    '.from-content-api table caption,',
    '.element-pullquote blockquote p,',
    '.atom-quiz__score,',
    '.menu-item__title,',
    '.pillar-link,',
    '.top-bar__item--cta,',
    '.subnav-link {',
    "    font-family: 'Guardian Text Egyptian Web',Georgia,serif;",
    "}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();
