// ==UserScript==
// @name         Tall Tiles in Ollie
// @namespace    http://prantlf.tk/
// @version      0.5
// @description  Stretches all tiles on a flow perspective to the full page height, unifies margins on all persepctives and tweaks colours a little.
// @author       prantlf@gmail.com
// @match        *://intranet.opentext.com/intranet/*/app
// @match        *://intranet.opentext.com/intranet/*/app/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408637/Tall%20Tiles%20in%20Ollie.user.js
// @updateURL https://update.greasyfork.org/scripts/408637/Tall%20Tiles%20in%20Ollie.meta.js
// ==/UserScript==

(function () {
  'use strict'

  function addStyle (content) {
    const element = document.createElement('style')
    element.type = 'text/css'
    element.innerHTML = content
    element.setAttribute('data-csui-theme-overrides', 'true')
    document.head.appendChild(element)
  }

  addStyle(`
/* back background to recognize widget borders on the right side */
.binf-widgets {
  background: #000;
}

/* tiles on the flow perspective as high as the page to reduce scrolling */
.binf-widgets:not(.csui-mobile) .cs-flow-perspective.grid-rows > .binf-row > .binf-col-xs-12:not(.row-xs-full) {
  height: calc(100vh - 70px);
  min-height: calc(100vh - 70px);
}

/* left and right margins of the perspective as wide as the grid gutter for consistency */
.binf-widgets .cs-perspective-with-breadcrumb-view,
.binf-widgets .cs-perspective-with-breadcrumb-view.cs_perspective_no_left_right_margin {
  padding: 0 15px;
}

/* bottom margin of a full-page widget as high as the gutter for consistency */
.cs-perspective-with-breadcrumb-view .grid-rows.csui-breadcrumbs-visible>.binf-row>.row-xs-full {
  height: calc(100vh - 62px - 32px - 15px);
}
.cs-perspective-with-breadcrumb-view .grid-rows.cs-grid-perspective > .binf-row > .row-xs-full, .cs-perspective-with-breadcrumb-view .grid-rows.cs-zone-perspective > .binf-row > .row-xs-full {
  padding-top: 7.5px;
  padding-bottom: 15px;
}
.cs-perspective-with-breadcrumb-view .grid-rows.csui-breadcrumbs-visible > .binf-row > .row-xs-full {
  height: calc(100vh - 62px - 32px);
}

/* bottom margin of a tabbed perspective as high as the gutter for consistency */
.binf-widgets .cs-tabbed-perspective.csui-breadcrumbs-visible > .cs-header.conws-header-widget.conws-description-available+.cs-content > .tab-panel > .binf-tab-content > .binf-tab-pane:first-child > .binf-row > * {
  height: calc(100vh - 62px - 32px - 48px - 160px + 24px);
}
.cs-tabbed-perspective.cs-collapse.csui-breadcrumbs-visible > .cs-content > .tab-panel > .binf-tab-content > .binf-tab-pane > .binf-row > * {
  height: calc(100vh - 62px - 32px - 48px - 48px - 15px);
}

/* an incomplete fix for the bottom margin ona grid perspective */
@media (min-width: 992px) {
  .grid-rows.csui-breadcrumbs-visible > .binf-row > .row-md-three-quarters {
    height: calc((100vh - 62px - 32px) * .75) !important;
  }
}
.grid-rows.csui-breadcrumbs-visible > .binf-row > .row-lg-three-quarters {
  height: calc((100vh - 62px + 15px - 32px) * .75) !important;
}
@media (min-width: 768px) {
  .grid-rows.csui-breadcrumbs-visible > .binf-row > .row-sm-three-quarters {
    height: calc((100vh - 62px - 32px) * .75)!important;
  }
}

/* dark grey background of the tabbed perspective header to recognise it */
.binf-widgets .cs-perspective-panel .cs-tabbed-perspective > .cs-header.conws-header-widget,
.cs-tabbed-perspective > .cs-content > .tab-panel > .tab-links,
.binf-widgets .tab-panel .conws-header-toolbar-extension {
  background: #222;
}

/* dark grey background of the breadcrumbs to recognise it */
#breadcrumb-wrap .breadcrumb-inner.breadcrumb-inner-header {
  background-color: #222;
}

.binf-widgets .binf-fade {
  opacity: 1;
}
`)
}());
