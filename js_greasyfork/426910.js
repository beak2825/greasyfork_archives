// ==UserScript==
// @name         twitter vertical view
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  PC版Twitterで縦長表示します
// @author       y_kahou
// @match        https://twitter.com/*
// @grant        none
// @license      MIT
// @noframes
// @require      https://greasyfork.org/scripts/419955-y-method/code/y_method.js?version=908174
// @downloadURL https://update.greasyfork.org/scripts/426910/twitter%20vertical%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/426910/twitter%20vertical%20view.meta.js
// ==/UserScript==

const white = 'r-1ets6dv';
const dark =  'r-18bvks7';
const black = 'r-1kqtdi0';

function styleMode(mode) {
    let mediaDom = `div.css-1dbjc4n.${mode}.r-1867qdf.r-1phboty.r-rs99b7.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg > div`;
    let ret = 
`
${mediaDom} > div > a > div
{
    height: auto!important;
}
${mediaDom} > div > a > div > div:nth-child(1)
{
    padding-bottom: 0!important;
}
${mediaDom} > div > a > div > div,
${mediaDom} > div > a > div > div > div
{
    position: relative;
    width: 100%;
    margin: 0!important;
}
${mediaDom} > div > a > div > div > div > img
{
    position: relative;
}`;
    return ret;
}

addStyle('vertical-view-white', styleMode(white));
addStyle('vertical-view-dark' , styleMode(dark));
addStyle('vertical-view-black', styleMode(black));