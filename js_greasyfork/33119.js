//
// Written by Glenn Wiking
// Script Version: 1.0.0a
// Date of issue: 09/12/17
// Date of resolution: 09/12/17
//
// ==UserScript==
// @name        ShadeRoot Instagram
// @namespace   SRIG
// @description Eye-friendly magic in your browser for Instagram
// @version     1.0.0a
// @icon        https://i.imgur.com/YKIGT79.png

// @include        http://*.instagram.*
// @include        https://*.instagram.*
// @downloadURL https://update.greasyfork.org/scripts/33119/ShadeRoot%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/33119/ShadeRoot%20Instagram.meta.js
// ==/UserScript==

function ShadeRootIG(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootIG(
	// BG 1
	'html, body, ._2v79o, ._axuw9, .-cx-PRIVATE-Page__body, .-cx-PRIVATE-Page__main, .-cx-PRIVATE-Page__root, ._io, ._1ewm, ._66ugs, ._66ugs::before, .main, .card-description, .card-description caption strong, .card-description .actions, ._q8pf2 {background-color: #1d2327 !important;}'
	+
	// TEXT COLOR 1
	'body, option, ._ph6vk, ._c59vy, h1, h2, h3, h4, h5, h6, span, p, li {color: #c1cfd5 !important;}'
	+
	'iframe {background: rgb(30, 75, 119) !important; border: 1px solid rgb(23, 64, 99) !important;}'
	+
	// BG2 
	'._f9sjj, ._7g4gl, ._nx5in, ._ouv75, ._psd08, ._s5vjd, .top-bar, .card-info, .card-info caption strong, .card-info-more, .card-info-more caption strong, .card, ._dnf8p {background-color: #172e42 !important; border: 1px solid #104b84 !important;}'
	+
	// LOGO ROUNDING
	'._68swa, .coreSpriteDesktopNavLogoAndWordmark, .coreSpriteDesktopNavProfile, .coreSpriteDesktopStoriesRing, .coreSpriteDesktopStoriesRingSeen, .coreSpriteActivityHeart, .-cx-PRIVATE-NavBar__logo, .top-bar .logo, .embedSpriteGlyph, .elSprite, .embedHideText, .embedSpriteLikesNew, .embedSpriteVerifiedBadgeSmall, .embedSpriteViewCount, .embedSpriteViewCountNew, .embedSpriteCommentsNew, ._tauyc {background-color: #91bfd5 !important; padding: .1em !important; border-radius: 1em !important;}'
	+
	'.coreSpriteNullProfile, .coreSpriteDesktopNavExplore, .coreSpriteDesktopNavActivity, .coreSpriteMobileNavSettings, .coreSpriteCloseLight, .coreSpriteComment, .coreSpriteDesktopNavActivity, .coreSpriteDesktopNavExplore, .coreSpriteHashtag, .coreSpriteHeartFull, .coreSpriteHeartOpen {background-color: #91bfd5 !important; border-radius: 2.5em;}'
	+
	// COLOR 1
	'code, ._hxmdu, ._mb54c, ._mb4af, ._o6mpc, ._h74gn, ._kx10g, ._l9ywh, ._jh9m1, ._avvq0, input, ._76v, .inputtext, ._76v, .textInput, ._1sr9, ._j0gmt, ._1cr2e, ._epyes, .espMetricText, .EmbedCaption, .EmbedTimestamp, .EmbedTimestamp:visited {color: #c9d2d7 !important;}'
	+
	// COLOR 2
	'._fd86t, ._ajwor, ._cd2n1, label {color: #3294c9 !important;}'
	+
	// FORM ITEMS BG
	'._ph6vk, ._sjplo, input, select, textarea, ._1nn6e, ._mahua, ._mi48x {background: #1d496e !important;}'
	+
	'._sjplo, select, textarea, ._1nn6e, ._mahua {border: 1px solid #1a6aa5 !important; color: #d0e4ec !important;}'
	+
	'._ngtox, imgn, .three-step ol {opacity: .85 !important;}'
	+
	// BG 3
	'._s5vm9, ._tpnch, ._28rsa, ._isucp, #subhead {background-color: #11181e !important;}'
	+
	'a, a:visited, strong {color: #257cd2 !important;}'
	+
	'._fsoey {color: #257cd2 !important; border-left: 1px solid #257cd2 !important;}'
	+
	'._6e4x5, ._9dpug, .-cx-PRIVATE-NavBar__root, ._kihls, ._r7o1l {border-bottom: solid 1px #0f4974 !important;}'
	+
	'._8oo9w, ._km7ip {border-top: solid 1px #0f4974 !important;}'
	+
	// BG 4
	'._4ae27 {background: #141a1e !important;}'
	+
	// BUTTON
	'._t78yp, ._5tsk5, ._j798k, ._72wr6 {border-color: #2e70a1 !important; color: #b7e7f8 !important; background: #0d2f50 !important;}'
	+
	'._hql7s, ._o2wxh, ._gimca, ._mahua, ._1ewn, ._brnf8 {background-color: #182029 !important; border-bottom: 1px solid #143b54 !important;}'
	+
	'._h74gn, ._dv59m {background: #233d60 !important;}'
	+
	'._h74gn:hover {background: #194571 !important;}'
	+
	'._mleeu {border-right: 1px solid #113859 !important;}'
	+
	'._28rsa, ._dv59m {border: 1px solid #0b3a59 !important;}'
	+
	'._etlo6:hover {background-color: #1b5a98 !important; border-left-color: #0e395d !important; color: #d4e0e7 !important;}'
	+
	'._jh9m1, ._avvq0, ._leqcz, ._7hhq6, ._bc1a8 {border: 1px solid #266193 !important;}'
	+
	'._leqcz, ._bc1a8 {background: #092d50 !important;}'
	+
	'._e3il2, #react-root, article, footer, header, main, nav, section, .-cx-PRIVATE-SidebarLayout__contentWrapper {background-color: #0e243b !important;}'
	+
	'._742f7 {background: #215b9399 !important; border-radius: 0 1.5em 1.5em 0 !important;}'
	+
	'._r48jm {background: #215b9399 !important; border-radius: 1.5em 0 0 1.5em !important;}'
	+
	'.-cx-PRIVATE-SidebarLayout__content {border-right: 1px solid #11436e !important;}'
	+
	'.-cx-PRIVATE-SidebarLayout__contentWrapper, ._66ugs {border: 1px solid #11283f !important;}'
	+
	'.uiBoxLightblue, article > .inner, .instagram-graph-api-platform, blockquote, code {background-color: #203760 !important; border: 1px dashed #2a85d2 !important;}'
	+
	'._4abhr, ._jlcqs, ._brnf8 {border: 1px solid #0d4287 !important;}'
	+
	'._lfwfo {background: #2363ab !important; border-bottom: solid 1px #154060 !important; color: #d9e3e9 !important;}'
	+
	'._6e4x5, ._b9n99, ._3g81g, ._gs38e {background: #102539 !important;}'
	+
	'.leaflet-container {background: #000 !important;}'
	+
	'.leaflet-tile, .leaflet-marker-icon, .leaflet-zoom-animated {filter: brightness(.8) !important;}'
	+
	'.paging ul li {border: 1px solid #165295 !important;}'
	+
	'.blog-footer {text-shadow: 0 1px 0 rgb(15, 36, 65) !important;}'
	+
	'.fcb {color: #8597a2 !important;}'
	+
	'.page-footer {border-top: 1px solid #163b5a !important; background: #214b6b !important;}'
	+
	'.sidebar-nav {background: #0b1d2a !important;}'
	+
	'.sidebar-nav, .sidebar-content {border-left: 1px solid #133e62 !important; border-right: 1px solid #143d5f !important;}'
	+
	'.sidebar-content > ul > li.active > a, .index-nav > ul > li.active > a {background-color: #223c71 !important; border-bottom-color: #215784 !important;}'
	+
	'.sidebar-content > ul > li a, .index-nav > ul > li a {border-bottom: 1px solid #1e4374 !important; background-color: #192c3e !important;}'
	+
	'.sidebar-content > ul > li a:hover, .index-nav > ul > li a:hover {box-shadow: 0 1px 0 rgb(19, 54, 89) inset, 0px 0px 1px rgba(0, 0, 0, 0.1), 0px 1px 0px rgba(0, 0, 0, 0.02), 0px -2px 0px rgba(0, 0, 0, 0.02) !important;}'
	+
	'.quick-search {border-bottom: solid 1px #16578d !important; background-color: #16436f !important; background-image: linear-gradient(to bottom, #1f5081, #11304e) !important;}'
	+
	'.sidebar-content > ul, .index-nav > ul {border-top: 1px solid #21496b !important;}'
	+
	'.quick-search input {border-color: #2469c2 !important; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) inset, 0 1px 0 rgb(26, 69, 96) !important;}'
	+
	'.sidebar-content > ul > li a:hover, .index-nav > ul > li a:hover {background: #103968 !important;}'
	+
	'.introduction-wrapper-tall .introduction {background: none !important;}'
	+
	'.cta .button {color: #0d2b59 !important;}'
	+
	'.terms, blockquote {border: 1px solid #164771 !important;}'
	+
	'.terms {text-shadow: 0 1px 0 rgb(13, 44, 75) !important;}'
	+
	'.top-bar-actions > li > a {color: #c4dcfb !important;}'
	+
	'th, tr:last-child td, th, td {border-bottom-color: #164274 !important;}'
	+
	'.sidebar-content > ul ul, .index-nav > ul ul {background: #0d253c !important; border-top: 1px solid #134b78; border-bottom: 1px solid #134b78;}'
	+
	'.button-light, .card-info .button {background-color: #112941 !important; background-image: linear-gradient(to bottom, #1a65b0, #11355a) !important; color: #c4dcfb !important;}'
	+
	'.index-nav {border: 1px solid #114a7a !important;}'
	+
	'[type="submit"], .button, .button-light, .card-info .button, .button-disabled {border: 1px solid #0c5aa1 !important;}'
	+
	'.ButtonActive[type="submit"], .ButtonActive.button, .ButtonActive.button-light, .ButtonActive.button-disabled, .ButtonActive.button-grey, .button-active[type="submit"], .button-active.button, .button-active.button-light, .button-active.button-disabled, .button-active.button-grey, .active[type="submit"], .active.button, .active.button-light, .active.button-disabled, .active.button-grey, [type="submit"]:active, .button:active, .button-light:active, .button-disabled:active, .button-grey:active, html.touch .pressed[type="submit"], html.touch .pressed.button, html.touch .pressed.button-light, html.touch .pressed.button-disabled, html.touch .pressed.button-grey {box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.08), inset 0 0 1px rgba(0, 0, 0, 0.08), 0 1px 0 rgba(21, 57, 87, 0.9) !important;}'
	+
	'.-cx-PRIVATE-Navigation__navLink:hover {border-left-color: #0e559b !important;}'
	+
	'.-cx-PRIVATE-Footer__nav {background: #214b6b !important;}'
	+
	'._4rbun {opacity: .9 !important;}'
	+
	'._q8pf2 {border: 1px solid #143b68 !important;}'
	+
	'._tb97a {border-bottom: 1px solid #1e4e8d !important;}'
	+
	'._4w6q {border-top: dashed 1px #327dbc !important;}'
	+
	'._4w6q:last-child {border-bottom: dashed 1px #327dbc !important;}'
	+
	'._y5i {border-top: 1px solid #194774 !important;}'
	+
	'._4-u8 {background-color: #142e4b !important; border-color: #23599e !important;}'
	+
	'._57d8 {background-color: #114e83 !important;}'
	+
	'._ti7l3 {padding-left: 1em;}'
	+
	'._si7dy {border-bottom: 1px solid black;}'
);