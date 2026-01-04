// ==UserScript==
// @name start.gg Dark Mode
// @namespace start.gg
// @version 1.0.0
// @description Stolen from start.gg Plus Chrome extension
// @author Julie
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/545203/startgg%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/545203/startgg%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `/* dear future reader */
/* have fun descending into my madness */
/* - julie */
:not(
  /* non-title text (gray-ish by default)  */
  [class*="regionWrapper-APP_TOURNAMENT_PAGE-FeatureCanvas-root-makeStyles-jss"] :not([class*="regionWrapper-APP_TOURNAMENT_PAGE-FeatureCanvas-title-makeStyles-jss"]),
  /* buttons (blue by default) */
  .appEntry-MuiButton-label, .appEntry-MuiButton-label *, .appEntry-MuiButtonBase-root, .appEntry-MuiButtonBase-root *, .regionWrapper-APP_TOURNAMENT_PAGE-FeatureCanvas-MuiButtonBase-root, .regionWrapper-APP_TOURNAMENT_PAGE-FeatureCanvas-MuiButtonBase-root *,
  /* h5 (complete text at the top, gray by default) */
  /* h5:not([class*="appEntry-header14-makeStyles-jss"],:not([class])), */
  /* complete text for real i swear */
  /* .appEntry-MuiTypography-root.sggK8ZeW.sgg2IzuF[class*="appEntry-header14-makeStyles-jss"].appEntry-MuiTypography-body1, */
  /* i give up the complete text is white now this site sucks */

  /* blue links? */
  .sgg3Kw9L.sgg3DBTA,
  /* user id */
  [class*="regionWrapper-USER_PAGE_WITH_BANNER-FeatureHeading-grey\\.primary-makeStyles-jss"],
  
  [class*="regionWrapper-APP_SETTINGS_OVERLAY_PAGE-GlobalNav-grey\\.primary-makeStyles-jss"],
  /* blue edit bio */
  [class*="regionWrapper-USER_PAGE_WITH_BANNER-GlobalNav-prefix-makeStyles-jss"], [class*="regionWrapper-USER_PAGE_WITH_BANNER-GlobalNav-prefix-makeStyles-jss"] *,
  /* gray profile create date */
  /* wait for css4 sadge [class*="regionWrapper-USER_PAGE_WITH_BANNER-ProfileHeading-root-makeStyles-jss"]:has(> [title*="User Since"]), */
  
  .regionWrapper-USER_PAGE_WITH_BANNER-GlobalNav-MuiTypography-colorPrimary:not(
    /* user profile page sidebar  */
    .sgg1OAFg,.sgg13k6s,.sggxbi5m,.sgg1Ff3D, 
    /* user profile page top left dropdown   */
    .sgg3Kw9L.sgg2RBnw
  ), 
  .regionWrapper-USER_PAGE_WITH_BANNER-GlobalNav-MuiTypography-colorPrimary:not(
    .sgg1OAFg,.sgg13k6s,.sggxbi5m,.sgg1Ff3D,.sgg3Kw9L.sgg2RBnw
  ) *,
  a:not(.sgg1sD7J:not(.sggXOKua.sgg1fD0D>.sgg1sD7J),.text-black,.sgg1fkvT,.sgg3Kw9L),
  /* more blue buttons */
  [class*="regionWrapper-USER_PAGE-FeatureCanvas-button-makeStyles-jss"], [class*="regionWrapper-USER_PAGE-FeatureCanvas-button-makeStyles-jss"] *,
  [class*="regionWrapper-USER_PAGE-FeatureCanvas-label-makeStyles-jss"], [class*="regionWrapper-USER_PAGE-FeatureCanvas-label-makeStyles-jss"] *,
  /* blue dates on results page... */
  .regionWrapper-USER_PAGE-GlobalNav-MuiTypography-root[class*="regionWrapper-USER_PAGE-FeatureCanvas-root-makeStyles-jss"][class*="regionWrapper-USER_PAGE-FeatureCanvas-root-makeStyles-jss"][class*="regionWrapper-USER_PAGE-FeatureCanvas-root-makeStyles-jss"][class*="regionWrapper-USER_PAGE-FeatureCanvas-root-makeStyles-jss"][class*="regionWrapper-USER_PAGE-FeatureHeading-label12-makeStyles-jss"].regionWrapper-USER_PAGE-GlobalNav-MuiTypography-body1, .regionWrapper-USER_PAGE-GlobalNav-MuiTypography-root[class*="regionWrapper-USER_PAGE-FeatureCanvas-root-makeStyles-jss"][class*="regionWrapper-USER_PAGE-FeatureCanvas-root-makeStyles-jss"][class*="regionWrapper-USER_PAGE-FeatureCanvas-root-makeStyles-jss"][class*="regionWrapper-USER_PAGE-FeatureCanvas-root-makeStyles-jss"][class*="regionWrapper-USER_PAGE-FeatureHeading-label12-makeStyles-jss"].regionWrapper-USER_PAGE-GlobalNav-MuiTypography-body1 *,
  .gg-color-slate,
  .sgg1Ff3D,
  .fa-caret-right,
  .match-player-name-container,
  .prefix
),
/* tournament schedule tourney titles?? i have no idea why it got caught in the not above i hate smashgg */
.appEntry-MuiTypography-root[class*="regionWrapper-APP_SETTINGS_OVERLAY_PAGE-FeatureCanvas-title-makeStyles-jss"][class*="regionWrapper-APP_SETTINGS_OVERLAY_PAGE-FeatureCanvas-title-makeStyles-jss"][class*="appEntry-body16-makeStyles-jss"].appEntry-MuiTypography-body1.appEntry-MuiTypography-noWrap,
.regionWrapper-APP_TOURNAMENT_PAGE-FeatureCanvas-MuiTableCell-head,
/* event titles on tournament main page */
.sgg3Kw9L.sgg2RBnw,
input,
h5,
/* user role in admin permissions */
.sgg1USfM,.sgg1kgL8,
.navbar-nav li.active>a,
/* standings */
.sggV1gDI,
.regionWrapper-APP_TOURNAMENT_PAGE-GlobalNav-MuiTypography-h5,
[class*="regionWrapper-APP_TOURNAMENT_PAGE-FeatureCanvas-gamerTag-makeStyles-jss"],
[class*="regionWrapper-APP_TOURNAMENT_PAGE-FeatureCanvas-attendeeLink-makeStyles-jss"],
/* full profile link */
.regionWrapper-APP_TOURNAMENT_PAGE-GlobalNav-MuiTypography-root[class*="regionWrapper-APP_TOURNAMENT_PAGE-FeatureCanvas-label-makeStyles-jss"][class*="regionWrapper-APP_TOURNAMENT_PAGE-DesktopProfileNav-body16-makeStyles-jss"].regionWrapper-APP_TOURNAMENT_PAGE-GlobalNav-MuiTypography-body1,
[class*=regionWrapper-APP_TOURNAMENT_PAGE-GlobalNav-gamerTag-makeStyles-jss],
.appEntry-MuiTypography-root[class*="regionWrapper-APP_TOURNAMENT_PAGE-FeatureCanvas-label-makeStyles-jss"][class*="appEntry-body16-makeStyles-jss"].appEntry-MuiTypography-body1,
.navigation-sggxVcUA .link-sggr7B--,
.breadcrumbLink-sgg1QE3Z,
.root-sggMrwNO
{
  color: white !important;
}

[class*="regionWrapper-APP_TOURNAMENT_PAGE-FeatureCanvas-nameSection-makeStyles-jss"],
[class*="regionWrapper-APP_TOURNAMENT_PAGE-GlobalNav-nameSection-makeStyles-jss"],
[class*="regionWrapper-APP_TOURNAMENT_PAGE_WITH_BANNER-GlobalNav-nameSection-makeStyles-jss"],
[class*="nameSection-makeStyles-jss"],
.sgg1Ff3D
{
  /* full name text */
  color: #B1B1B1 !important;
}

/* todo: fix hover */
.profileNavContainer,
.intercom-sggzD-HE,
.action-sggITV7X,
.MuiInputBase-adornedStart
{
  background-color: #121212 !important;
}

.regionWrapper-APP_LEGACY-FeatureCanvas,
.appEntry-MuiPaper-root,
.regionWrapper-APP_SETTINGS_OVERLAY_PAGE-FeatureCanvas-MuiTable-root,
.regionWrapper-APP_TOURNAMENT_PAGE-FeatureCanvas-MuiTable-root,
/* not colored sidebar in bracket section */
header:not(.sgg15V3Y.sgg1BpbL.sgg3gHar.sggjooyc.sgg2IzuF),
/* game in sidebar */
.sgg1yOFc, .sgg1yOFc :not(*, * [style*="background-image"]),
.sgg1BH2f, .sgg1BH2f :not(*, * [style*="background-image"]), 
section,
/* .AttendeesTable :not([variant="standard"], input, .regionWrapper-APP_TOURNAMENT_PAGE-FeatureCanvas-MuiFormControl-root), */
.AttendeesTable :not(fieldset),
/* """background""" */
.sgg1apK4,
/* floating registration button at the bottom */
.sgg2pTAp,
/* main page carousel */
.sgg2kY5I,
/* tiny rounded corners on input elements */
.regionWrapper-APP_SETTINGS_OVERLAY_PAGE-FeatureCanvas-MuiFormControl-root,
.regionWrapper-APP_TOURNAMENT_PAGE-FeatureCanvas-MuiFormControl-root,
.page-section,
.gg-card,
/* user page -> schedule -> pagination at bottom */
.sgg2vKef,
.appEntry-MuiDrawer-root,
.appEntry-MuiDrawer-docked,
/* tournament header */
.sgg2Fv5m,
.profileBelowHeader,
table,
table + div,
.table,
.pagination, .pagination :not(.active) *,
/* create tournament header */
.sgg1iDNq,
/* admin details header */
.sgg2h1cC,
.gg-form-box,
.seed-panel,
.flex-pane-main,
.shadow-box,
.modal-container,
.MatchHeader,
.tab-pane,
.match-panel,
.modal-tabs,
.Card.match-display,
.sggFWUTf.sgg3hlED.sgg3-sWS,
.MuiCardContent-root.tss-9qcx7a-content.mui-1qw96cp,
.EventItemContainer-sggJZRR7,
.MuiDrawer-root
{
  background-color: #222222 !important;
}

/* placing in entrant card */
/* (original is background image so need new rule) */
.sgg1k35w.sgg30sfD.sgg1BpbL.sgg3D4Wl{
  background: #222222;
}

/*main page carousel gradient */
.scrollRight .alice-carousel__wrapper:after
{
  background: linear-gradient(
    90deg,hsla(0,0%,100%,0) 0,#121212) !important;
}
.scrollLeft .alice-carousel__wrapper:before{
  background: linear-gradient(
    270deg,hsla(0,0%,100%,0) 0,#121212) !important;
}

/* "show more" gradient */
.sgg1ElIj {
  background: linear-gradient(
180deg,hsla(0,0%,100%,0) 0,#121212) !important;
}

.desktopProfileNav .profileNavBanner:after{
  background: none !important;
}


*:after{
  background: none !important;
}

/* inputs */
.regionWrapper-APP_SETTINGS_OVERLAY_PAGE-FeatureCanvas-MuiInputBase-root,
.regionWrapper-APP_TOURNAMENT_PAGE-FeatureCanvas-MuiInputBase-root,
.regionWrapper-APP_LEGACY-FeatureCanvas-MuiInputBase-root,
.gg-card-heading,
.gg-card-footer,
.form-control, .form-control *
[class*="regionWrapper-APP_SETTINGS_OVERLAY_PAGE-FeatureCanvas-root-makeStyles-jss"].appEntry-MuiTypography-root.appEntry-MuiTypography-overline,
/* help button in bottom right draggable dashboard thing */
.sgg2Q6-r,
.pagination, .pagination .active *,
/* tournament edit image drag and drop */
.sgg2z2Gz,.sgg3yqu0,
textarea,
/* tournament edit rules */
.sgg1oTKb,
.well,
.breadcrumb,
.Select-control,
.Select-aria-only,
.match-player,
.Card__body,
.Card{
  background-color: #3b3b3b !important;
}

:root{
  /* remove gradient effect (that wasnt even visible to begin with?? wtf smashgg) */
  --color-white: #222222 !important;
}

.alert-success{
  background-color: transparent !important;
}

.regionWrapper-APP_SETTINGS_OVERLAY_PAGE-FeatureCanvas-MuiInputLabel-outlined.regionWrapper-APP_SETTINGS_OVERLAY_PAGE-FeatureCanvas-MuiInputLabel-shrink {
  /* first/last name labels are off by like 6 px */
  transform: translate(14px, -12px) scale(0.75) !important;
}

.match .match-spacer, .rr-match .match-spacer, .match>.match-affix-wrapper>.match-section:first-child, .rr-match>.match-affix-wrapper>.match-section:first-child, .match>.match-affix-wrapper>.match-section, .rr-match>.match-affix-wrapper>.match-section {
  border-color: gray !important;
}

.fa .fa-caret-right::before{
  color: gray !important;
}

.match-player-name-container, .prefix{
  color: lightgray !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
