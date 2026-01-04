// ==UserScript==
// @name         Slate Theme for HIT Forker
// @namespace    https://greasyfork.org/en/users/434272-realalexz
// @version      0.6
// @description  Slate Theme (similar to that in MTS HIT Finder) for HIT Forker.
// @author       RealAlexZ
// @icon         https://i.imgur.com/NouzJ6b.jpg
// @include      https://worker.mturk.com/?hit_forker
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/395021/Slate%20Theme%20for%20HIT%20Forker.user.js
// @updateURL https://update.greasyfork.org/scripts/395021/Slate%20Theme%20for%20HIT%20Forker.meta.js
// ==/UserScript==

GM_addStyle('html {color: #aaaaaa; background-color: #272b30 !important; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; font-size: 15px; font-weight: normal;}' +
    'body {margin: 0px;}' +
    '#menubar { background-color: #32383e; margin: 0px; padding: 3px; height:30px; color: #aaaaaa }' +
    '#latest_hits { margin: 5px; }' +
    '#logged_hits { margin: 5px; }' +
    '#config { background-color: #32383e; border: 2px #000000 solid; padding: 2px;}' +

    '#bl_items, #il_items {background-color: #ffffff; height: calc(100% - 64px); overflow-y: scroll;}' +
    '#bl_div, #il_div {background-color: #32383e; border: 2px solid #111111;}' +

    '.add {background-color: #32383e; border: 2px solid #111111;}' +

    '.bl {border: 3px solid  #FF0000;}' +
    '.il {margin-top: 2px !important; margin-bottom: 2px !important; border: 4px solid  #f0fafa;}' +
    '.hidden, .nl_hidden, .bl_hidden, .m_hidden {display: none;}' +
    'button:focus {outline: none !important;}' +
    'a { text-decoration: none !important; font-size: 1.1rem !important; font-weight: 400 !important; line-height: 1.5 !important; margin-left: 4px !important; }' +
    '.tvHigh { background-color: #66c367 !important; }' +
    '.tvFair { background-color: #f69427 !important; }' +
    '.tvLow { background-color: #ec605f !important; }' +
    '.tvNone { background-color: #ffffff !important; }' +
    '.toHigh {background-color: #66c367 !important; }' +
    '.toGood {background-color: #66c367 !important; }' +
    '.toAverage {background-color: #f69427 !important; }' +
    '.toLow {background-color: #ec605f !important; }' +
    '.toPoor {background-color: #ec605f !important; }' +
    '.toNone {background-color: #ffffff !important; }' +
    'div { margin-bottom: 1px !important; }' +
    '#hits_table { font-weight: bolder !important; }' +
    '#log_table { font-weight: bolder !important; }' +
    '.cont { font-weight: 400 !important; }' +
    'button:not(.details):not(.pc):not(.vb):not(.irc):not(.rt):not(.it):not(.slk) { background-color: #383c41 !important; color: #ffffff !important; border: 1px solid  #000000 !important; }' +
    '#scan_button { color: #66c367 !important; }' +
    '.rt, .it {width: 20px; height: 20px; background-color: transparent; margin: 1px;  border: 1px solid  #000000; font-size: 80%; padding: 1px;}' +
    '.pc {width: 20px; height: 20px; background-color: #383c41 !important; color: #ffffff !important; margin: 0.5px;  border: 1px solid  #000000; font-size: 80%; padding: 1px;}' +
    '.vb, .irc, .slk {width: 25px; height: 20px; background-color: #798187 !important; color: #ffffff !important; margin: 0.5px;  border: 1px solid  #000000; font-size: 80%; padding: 1px;}' +
    'td { font-weight: bold; }' +
    '.cont, .hit, .details { color: #000000; }' +
    '.clicked { background-color: grey; }');