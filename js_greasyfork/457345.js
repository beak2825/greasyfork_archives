// ==UserScript==
// @name        Dark Mode for Duolingo
// @namespace   NekoRect-DM
// @match       https://preview.duolingo.com/*
// @grant       GM_addStyle
// @grant       unsafeWindow
// @version     1.0
// @license     GNU GPLv3
// @author      NekoRect
// @description 2022/12/30 12:16:46
// @downloadURL https://update.greasyfork.org/scripts/457345/Dark%20Mode%20for%20Duolingo.user.js
// @updateURL https://update.greasyfork.org/scripts/457345/Dark%20Mode%20for%20Duolingo.meta.js
// ==/UserScript==

let weburl=unsafeWindow.location.href

if (weburl.indexOf('preview') != -1) {

  // body background & for font color
  GM_addStyle('body{background: #151617; color: #dadada;}')
  console.log('act!')

  // Toolbar
  GM_addStyle('._3g2C1{background-color: #202122; border-bottom-color: #212121}')

  // Drop Menu (of avatar)
  // Modify background
  GM_addStyle('._1KUxv {background-color: #1e1e1e; border: 2px solid #454545;}')
  // its split
  // first part:
  GM_addStyle('._3sYli:first-of-type {border-top: 2px solid #464646;}')
  GM_addStyle('._3sYli{border-bottom: 2px solid #464646;}')
  // second part:
  GM_addStyle('._1KF6e {border-top: 2px solid #464646;}')
  // Primary Text color
  GM_addStyle('._1ccgT {color: #dadada}')
  // Noti Text color
  GM_addStyle('._2WP_P {color: #dadada;}')

  //graph
  GM_addStyle('._3ZuGY{background: #1f2021; border: 2px solid #424547;}')
  // for its primary text color
  GM_addStyle('._3HNwo {color: #e2e2e2;}')
  // secondary text color
  GM_addStyle('._1LpFA {color: #9c9c9c;}')

  //icon zone background
  GM_addStyle('._1JSRd, ._3Qm9a {background-color: #151617}')
  // selected background
  GM_addStyle('._2BPAp {background-color: #233842}')

  //global button - recommend not to use
  // GM_addStyle('.WOZnx:before {background-color: #565656; }')
  // GM_addStyle('.WOZnx {--__internal__border-color: #2b2b2b}')

  // Pratice Part

  // Progress Bar Background
  GM_addStyle('._2YmyD {background: #444444;}')

  // Bottom banner
  GM_addStyle('._399cc{background: #151617; border-top: 0px solid #000;}')
  // Warning Banner (Disabled mic)
  GM_addStyle('._2NxDA {background-color: #3c3624}')
  // Correct Banner
  GM_addStyle('._3e9O1 {background-color: #2e4020;}')
  // Wrong Banner
  GM_addStyle('._3vF5k {background-color: #482425;}')
  // Quit Banner
  GM_addStyle('._3gK3K {background: #262626;}')

  // Global buttons
  GM_addStyle('.WOZnx:before {background-color: #1f2021; border: 0px; box-shadow: 0 0px 0 var(--__internal__border-color)}')

  // Question Type: word bank
  // "check" button (unusable state)
  GM_addStyle('._2NolF.LhRk3:not(._1rl91):before, ._2NolF:disabled:not(._1rl91):before {background-color: #5f5f5f;}')
  // Word bank empty background fix
  GM_addStyle('.WOZnx.LhRk3:not(._1rl91):before, .WOZnx:disabled:not(._1rl91):before {background-color: #282828;}')
  // Visual Guide line
  GM_addStyle('._1HxVp {border-top: 2px solid #454545;}')
  GM_addStyle('._15J0U {border-bottom: 2px solid #454545;}')

  //Speak bubbles
  GM_addStyle('._1KUxv {background-color: #1e1e1e; border: 2px solid #454545;}')
  // its arror
  GM_addStyle('._3p5e9 {background-color: #454545; border: 2px solid #454545;}')

  // Edittext area
  GM_addStyle('._2FKqf {background-color: #1e1e1e; border-color: #454545;}')
  // its hint text
  GM_addStyle('._2ti2i {color: #dadada;}')

  // Question Type: Select
  // Choices button
  GM_addStyle('._3C_oC:before {background-color: #1f2021;}')
  // when selected
  GM_addStyle('._3C_oC.disCS:before, ._3C_oC:active:not(.hfPEz):before {background-color: #233842;}')
  // its text color
  GM_addStyle('._2-OmZ {color: #dadada;}')

  // Question Type: Pic Select
  // Alt text color
  GM_addStyle('._3pn9e {color: #4b4b4b;}')

  // Question Type: Match Pairs
  // Text color
  GM_addStyle('._1O290 {--web-ui_button-color: #454545;}')
}