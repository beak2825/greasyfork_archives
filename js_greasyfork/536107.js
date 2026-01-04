// ==UserScript==
// @name        UI changes
// @description Test resizing AH/DLP/SB/SV/QQ ui for mobile and remove a few buttons
// @author      C89sd
// @version     1.25
// @namespace   https://greasyfork.org/users/1376767
// @match       https://*.alternatehistory.com/*
// @match       https://*.spacebattles.com/*
// @match       https://*.darklordpotter.net/*
// @match       https://*.questionablequesting.com/*
// @match       https://*.sufficientvelocity.com/*
// @grant       GM_addStyle
// @run-at      document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/536107/UI%20changes.user.js
// @updateURL https://update.greasyfork.org/scripts/536107/UI%20changes.meta.js
// ==/UserScript==
'use strict';

// Default dark mode text colors:
// SV 230, SB 204, QQ 177
const c = 217; // I like 217, 224

let site = location.hostname.split('.').slice(-2, -1)[0];
const IS_AH = site === 'alternatehistory'
const IS_QQ = site === 'questionablequesting'
const IS_SB = site === 'spacebattles'
const IS_SV = site === 'sufficientvelocity'

const DM = window.getComputedStyle(document.body).color.match(/\d+/g)[0] > 128;

let css;

// text color
if (DM) {
  css +=
   `.actionBar-set.actionBar-set--external .actionBar-actionBar, .message-footer .message-actionBar .actionBar-set a,  .block-tabHeader.block-tabHeader--threadmarkCategoryTabs .tabs-tab, .block--messages .message-cell--threadmark-header, .node-statsMeta .pairs > dt, .structItem-cell .pairs > dt, .js-tagList .tagItem, .pairJustifier .pairs > dt,  .p-body-header .p-description, .block-container , .structItem-minor .structItem-parts a,  .structItem-cell.structItem-cell--main ul.structItem-statuses .structItem-status::before,  .message-cell--main, li, ul, div, time, .structItem-tagBlock .tagItem.labelLink, .structItem-minor .username , .pairs.pairs--justified dt a.hl-base, .pairs.pairs--justified dd a.hl-base, .pairs.pairs--justified dd {
        color: rgb(${c},${c},${c}); }`
} else {  // Make light mode <a> links brighter like Wikipedia, not dark blue
  css +=
   `.bbWrapper a { color: #36c; }
    .bbWrapper a:hover  { color: #3056a9; }`;
}

// Boost title and link brightness per-site in dark mode
let brightness = 1.0;
if (IS_SB) brightness = 0.90;
if (IS_QQ) brightness = 0.90 * 1.232; // 1.232 adjuss from qq to SB
if (IS_SV) brightness = 0.90 * 1.20; // fake value
if (IS_AH) brightness = 0.90 * 1.25;
if (DM) css +=
  `.structItem-title, .message-content a, .message-newIndicator, .notice-content a, .pollResult-bar, .js-badge--alerts::after, .pageNavWrapper, .p-navEl-link--splitMenu,  .username , .reactionsBar-link, .itemListElement, .buttonGroup, .p-breadcrumbs , .p-title,  button.button--link, .block-formSectionHeader {
      filter: brightness(${brightness});
  }
  .structItem-statuses .message-newIndicator { color: black; }`

// Unhide page links at the top of thread
css += `.block-outer .pageNavWrapper { display: block !important; }`
     // + `.pageNavWrapper--mixed .pageNav { display: block !important; } .pageNavSimple { display: none !important; }` // comment out to use simple (mobile) navbar
;

// Fix QQ tabheader being half hidden
css += `.block-tabHeader > .hScroller-scroll.is-calculated { margin-bottom: 0px !important; padding-bottom: 0px !important; overflow: auto; }`

// Attempt to make all sites about the same size
css += `
.block-body--threadmarkBody li { vertical-align: middle; } /* center threadmarks in list */
.block-body--threadmarkBody .message-newIndicator { vertical-align: middle; }

.flashMessage-content, .flashMessage { display: none !important; }

#XF, #XenForo { font-size: 0.9375em !important;  }

html, body { font-size: 15px !important;  line-height: 1.3 !important; }

h1.p-title-value { font-size: 18px !important; }
.threadmarkListingHeader-content.threadmarkListingHeader-content--info.with-icon { display: none !important; } /* QQ: hide title below img */


.structItem-title, .node-title {    font-size: ${ IS_AH ? '15px' : '14px' } !important; }
.structItem-minor, .node-meta, .node-extra  {    font-size: 12px !important; line-height: 1.3 !important; }
.structItem-pageJump { font-size: 10px !important; }
.tagItem {             font-size: 10px !important; }
.structItem-cell {     font-size: 12px !important; }
.pageNavSimple-el {    font-size: 12px !important; }
.p-breadcrumbs { font-size: 12px !important; }

.button--link { font-size: 12px !important;}
.threadmarkListingHeader-contentLink { font-size: 12px !important; }
#top, .inputGroup, .input--inline { font-size: 12px !important; }

.structItem-tagBlock {
  padding-top: 4px !important;
  display: block !important;
}

:root {
  --padTOP: 1px;
  --padBOTTOM: 2px;
}
.structItem-cell--icon {
  width: 54px !important;
  padding: calc(10px + var(--padTOP)) 9px 10px 9px !important;       /* ADD TOP PADDING */
}

.structItem-cell--main, .node-main {
  padding-top: calc(5px + var(--padTOP)) !important;        /* ADD TOP PADDING */
  padding-bottom: 2px !important;

}
.structItem-cell--latest, .structItem-cell--meta {
  padding-right: 8px !important;
  padding-bottom: calc(8px + var(--padBOTTOM)) !important;    /* ADD BOTTOM PADDING */
}


/* Remove ignore button */
.structItem-ignore  { display: none !important; }
`;

GM_addStyle(css);

addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.link--external[target="_blank"]').forEach(link => {
    link.removeAttribute('target');
  });

  // Replace 'Thread Tools' with 'Mark threadmarks read'
  const A = Array.from(document.querySelectorAll('.menuTrigger')).find(e => e.textContent.toLowerCase() === 'thread tools');
  const B = Array.from(document.querySelectorAll('.menu-linkRow')).find(e => e.textContent === 'Mark threadmarks read');
  if (A && B) {
    A.classList.remove('menuTrigger');
    A.style.display = 'flex';
    A.textContent = B.textContent;
    A.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      B.click();
    });
  }

  // Remove thread ignore button.
  const btn = document.querySelector('.button--link[data-sk-ignore="Ignore"]');
  if (btn) btn.remove();
})
