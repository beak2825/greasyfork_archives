// ==UserScript==
// @name Darkarr (for Sonarr v3)
// @namespace Wouldn't You Like To Know?
// @version 01.31.2023
// @description Dark theme for Radarr version 3.
// @author peeps with a regex edit from NoahBK
// @license No License
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:^http://localhost:8989/(.*)$)$/
// @downloadURL https://update.greasyfork.org/scripts/459177/Darkarr%20%28for%20Sonarr%20v3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/459177/Darkarr%20%28for%20Sonarr%20v3%29.meta.js
// ==/UserScript==

(function() {
let css = `
/*----------------- COLORS ------------------*/
:root {
    --color-DarkBG: #272727;    /* var(--color-DarkBG) */
    --color-DarkBG2: #333333;    /* var(--color-DarkBG2) */
    --color-White: #D4D4D4;     /* var(--color-White) */
    --color-Grey: #444444;      /* var(--color-Grey) */
    --color-Grey2: #707070;      /* var(--color-Grey2) */    
    --color-Scroll: #555555;      /* var(--color-Scroll) */
    --color-Scroll2: #4a4a4a;      /* var(--color-Scroll2) */
}

/* Background */
body {
    background: var(--color-DarkBG);
    background-color: var(--color-DarkBG);
    color: var(--color-White);
}

/* Side Bar */
.PageSidebar-sidebar-20RVF {
    background-color: var(--color-DarkBG);
    margin-right: -17px !important;
    margin-bottom: -17px !important;
}

.PageSidebarItem-isActiveParentLink-1DcW7 {
    background-color: var(--color-DarkBG);
}

.PageSidebarItem-isActiveItem-2jsqy {
    background-color: var(--color-DarkBG2);
}

/* Scroll Bar Color */
.OverlayScroller-thumb-1E5mt {
    background-color: var(--color-Scroll);
    min-height: 30px;
}

.OverlayScroller-thumb-1E5mt:hover {
    background-color: var(--color-Scroll2);
}

/* Top Bar */
.PageToolbar-toolbar-WwUGV {
    background-color: var(--color-DarkBG);
    color: var(--color-White);
}

.PageToolbarButton-label--Qykn {
    background-color: var(--color-DarkBG);
    color: var(--color-White);
}

.PageHeader-header-JYJAc {
    background-color: var(--color-DarkBG);
    color: var(--color-White);
}

/* Search Box */
.SeriesSearchInput-input-2z4ap {
    width: 400px;
    height: 34px;
    padding: 6px 16px;
    border: none;
    border-bottom: 0;
    border-radius: 4px;
    background-color: var(--color-Grey);
    color: #fff; /* Blinking Cursor */
}

.SeriesSearchInput-container-nVvVV .SeriesSearchInput-seriesContainer-1rk9B {
    border: 0px solid #595959;
    border-radius: 4px;
    background-color: #333333;
    color: var(--color-White);
}

.SeriesSearchInput-highlighted-dGPda {
    background-color: var(--color-Grey);
}

/* Search Scroll Bar */
.SeriesSearchInput-container-nVvVV .SeriesSearchInput-seriesContainer-1rk9B::-webkit-scrollbar-thumb {
    border: 0px solid transparent;
    background-color: var(--color-Scroll);
}

.SeriesSearchInput-container-nVvVV .SeriesSearchInput-seriesContainer-1rk9B::-webkit-scrollbar-thumb:hover {
    border: 0px solid transparent;
    background-color: var(--color-Scroll2);
}

/*Series Options Section*/
.ModalContent-modalContent-f33n- {
    background-color: var(--color-DarkBG);
}

.ModalBody-innerModalBody-3gO-u {
    background-color: var(--color-DarkBG);
    color: var(--color-White);
}

.ModalFooter-modalFooter-3jawm {
    background-color: var(--color-DarkBG);
    color: var(--color-White);
}

.TableOptionsColumn-column-1ErGH {
    background-color: var(--color-Grey);
    color: var(--color-White);
}

.Scroller-vertical-3bAsi.Scroller-autoScroll-2_rs9 {
    background-color: var(--color-Grey);
}

.Scroller-scroller-_8_uO::-webkit-scrollbar-thumb {         /* bottom of scroll section*/
    background-color: var(--color-Scroll);
}

.Scroller-scroller-_8_uO::-webkit-scrollbar-thumb:hover {
    background-color: var(--color-Scroll2);
}

.Input-input-25Gr2 {
    background-color: var(--color-DarkBG);
    color: var(--color-White);
}

.EnhancedSelectInputOption-option-8Cz3_ {           /* Root Folder */
    background-color: var(--color-DarkBG);
    color: var(--color-White);
    padding: 2px 10px;
}

.EnhancedSelectInputOption-option-8Cz3_:Hover {
    background-color: var(--color-Grey);
    color: var(--color-White);
    padding: 2px 10px;
}

.MenuItem-menuItem-Yot4A {
    background-color: var(--color-Grey);
    color: var(--color-White);
}

.MenuItem-menuItem-Yot4A:hover, .MenuItem-menuItem-Yot4A:focus {
    background-color: #515151;
    color: var(--color-White);
}

.SeriesIndexPoster-title-1h3SR {
    background-color: var(--color-DarkBG);
}

.SeriesIndexPosterInfo-info-3ahzo {
    background-color: var(--color-DarkBG);
}

.SeriesIndexPoster-nextAiring-2nqSB {
    background-color: #00ccff;
    color: #272727;
}

.VirtualTableRow-row-P7KbK:hover {
    background: var(--color-Grey);
}

.SeriesIndexOverview-link-3BWTB {
    color: var(--color-White);
}

.SeriesIndexOverview-link-3BWTB:hover {
    color: var(--color-White);
}

.SeriesIndexOverview-info-2BRE5:hover {
    background: var(--color-Grey);
}

/* Custom Filter*/
.TagInput-internalInput-2esEh {                 /* Movie Tag */
    background-color: var(--color-DarkBG);
    color: var(--color-White);
}

.FilterBuilderRow-filterRow-3Vivt:hover {
    background: var(--color-Grey);
}

.AutoSuggestInput-suggestionsContainerOpen-20zQp .AutoSuggestInput-suggestionsContainer-1tCOW {
    background-color: var(--color-DarkBG);
    color: var(--color-White);
}

.AutoSuggestInput-suggestionHighlighted-2s3WQ {
    background-color: var(--color-Grey);
    color: var(--color-White);
}

/*Custom View*/
.Input-input-25Gr2 {
    background-color: var(--color-DarkBG);
    color: var(--color-White);
}

/*TV Details*/
.SeriesDetailsSeason-season-rsdqF {
    margin-bottom: 20px;
    border: 0px solid #e5e5e5;
    border-radius: 4px;
    background-color: var(--color-DarkBG);
}

tr:hover {
    background-color: var(--color-Grey) !important;
    color: var(--color-White) !important;
}

.TableRow-row-2NoqV {
    transition: background-color .1s;
}

.SeriesDetailsSeason-episodes-1BN90 {
    padding-top: 0px;
}

.SeriesDetailsSeason-header-11IdR {
    background-color: var(--color-DarkBG2);
}

.SeriesDetailsSeason-collapseButtonContainer-38tta {
    background-color: var(--color-DarkBG2);
}

.Popover-tooltipBody-3C1-B {
    background-color: var(--color-DarkBG2);
}

.Popover-title-2n2Xp {
    background-color: var(--color-DarkBG2);
}

.AddNewSeriesSearchResult-underlay-2JxgL {
    background-color: var(--color-DarkBG);
    transition: background .1s;
}

.AddNewSeriesSearchResult-underlay-2JxgL:hover {
    background-color: var(--color-Grey);
    transition: background .1s;
}

.PageContentFooter-contentFooter-33N04 {
    padding: 10px;
    background-color: var(--color-DarkBG2);
}

/* Season Pass*/
.SeasonPassSeason-season-1z-Wa {
    border: 0px solid var(--color-White);
    background-color: var(--color-Grey);
}

.SeasonPassSeason-episodes-3Ebns {
    background-color: var(--color-Grey2) ;
    color: var(--color-White)
}

.SeasonPassSeason-allEpisodes-NZB2W {
    background-color: #20923c !important;
}




/*---------------- Calendar ----------------*/

.Button-default-342be {                 /* Buttons */
    background-color: var(--color-DarkBG);
    color: var(--color-White);
}

.Button-default-342be:hover {
    background-color: var(--color-Grey);
    color: var(--color-White);
}

.CalendarDay-day-1-M7C:hover {          /* Calendar Days */
    background-color: var(--color-Grey);
    color: var(--color-White);
}

.DayOfWeek-dayOfWeek-1dJna {            /* Day of Week */
    border-color: #d6d6d6;
    border: 1px solid;
    background-color: var(--color-DarkBG);
    color: var(--color-White);
}

.CalendarDay-isToday-T00Hr {            /* Current Day */
    background-color: #1b72e2;
    color: var(--color-White);
}

.CalendarEvent-seriesTitle-3nGRY {       /* Calendar Text */
    color: #1b72e2;
}

.CalendarEvent-episodeInfo-azFKq {
    color: var(--color-White);
}

.CalendarEvent-airTime-3YsgC {
    color: var(--color-Grey2) ;
}

.AgendaEvent-date-35W3p {
    color: var(--color-White);
}

.AgendaEvent-event-9bQfy:hover {
    background-color: var(--color-Grey)
}


/*---------------- Settings ----------------*/
/* Settings */
.Settings-link-1nMZ_ {
    color: #5d9cec;
}

.Settings-summary-3vkWu {
    color: var(--color-White);
}

/* Media Management */
.FieldSet-legend-2KHms {                /* Top Title */
    color: var(--color-White);
}

.NamingOption-token-3DMOs {             /* Movie Format ? Mark */
    background-color: var(--color-DarkBG);
}

.NamingOption-option-1V6MO:hover .NamingOption-token-3DMOs {
    background-color: var(--color-Grey);
}

.NamingOption-example-39sCU {
    background-color: var(--color-DarkBG);
}

.NamingOption-option-1V6MO:hover .NamingOption-example-39sCU {
    background-color: var(--color-DarkBG);
}

/* Profiles */
button, [type="button"], [type="reset"], [type="submit"] {
    border-radius: 4px;
}

.Card-card-1klRK {
    border-radius: 4px;
    background-color: var(--color-Grey);
    box-shadow: 0 0 0px 0px #e1e1e1;
    color: var(--color-White);
}

.QualityProfileItem-qualityNameContainer-1szcr {
    border-radius: 4px;
    margin-left: 0px;
    background-color: var(--color-DarkBG);
    color: var(--color-White);
}

.QualityProfileItem-dragHandle-3IfDf {
    background-color: var(--color-DarkBG);
    border: 0px none;
    border-radius: 4px;
}

.QualityProfileItemGroup-qualityNameContainer-23tt9 {
    border-radius: 4px;
    margin-left: 0px;
    background-color: var(--color-DarkBG);
    color: var(--color-White);
}

.QualityProfileItemGroup-dragHandle-2P5uE {
    background-color: var(--color-DarkBG);
    border: 0px none;
    border-radius: 4px;
}

.QualityProfileItem-qualityProfileItem-OzlTC {
    border-radius: 4px;
    background: var(--color-DarkBG);
}

.QualityProfileItemGroup-qualityProfileItemGroup-1EgkU.QualityProfileItemGroup-editGroups-1P8D0 {
    background: var(--color-Grey);
}

/* Quality Circle */
.QualityDefinition-thumb-1w8Jg {
    top: 4px;
    z-index: 2!important;
    width: 6px;
    height: 12px;
    border: 1px solid #aaa;
    border-radius: 3px;
    background-color: #ccc;
    text-align: center;
    cursor: default;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
