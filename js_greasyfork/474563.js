// ==UserScript==
// @name        Twitch Usercard Redirect
// @namespace   Violentmonkey Scripts
// @version     1.1.0
// @match       https://www.twitch.tv/popout/*/viewercard/*
// @grant       none
// @author      Ltrademark
// @icon        https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @license     MIT
// @description Redirects twitch usercard pages to use rustlog, a third-party twitch usercard history viewer.
// @downloadURL https://update.greasyfork.org/scripts/474563/Twitch%20Usercard%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/474563/Twitch%20Usercard%20Redirect.meta.js
// ==/UserScript==

let urlPaths = window.location.pathname.replace('/popout/', ''),
    cleanPaths = urlPaths.replace(/\//g, ' ').split(' ');
let channel = cleanPaths[0],
    username = cleanPaths[2];

let rustLogRoot = 'logs.ivr.fi';

let newUrl = `https://${rustLogRoot}/?channel=${channel}&username=${username}`;

window.location.replace(newUrl)