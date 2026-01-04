// ==UserScript==
// @name           Zoom redirector with Subdomains
// @match          https://zoom.us/*
// @match          https://*.zoom.us/*
// @version        1.0
// @author         clemente, Adam Novak
// @license        MIT
// @description    Transparently redirects any meeting links to use Zoom's browser based web client
// @icon           https://i.imgur.com/y8BXA8l.png
// @inject-into    content
// @run-at         document-start
// @noframes
// @namespace https://greasyfork.org/users/22981
// @downloadURL https://update.greasyfork.org/scripts/399800/Zoom%20redirector%20with%20Subdomains.user.js
// @updateURL https://update.greasyfork.org/scripts/399800/Zoom%20redirector%20with%20Subdomains.meta.js
// ==/UserScript==

const url = new URL(document.URL);
const match = /^\/[js]\/(\d+)\/?$/.exec(url.pathname);
if (match === undefined || match === null || match[1] === undefined) {
  return;
}

const urlEnding = match[0][1];
const meetingId = match[1];
const mapping = {'j': '/join', 's': '/start'};

document.location.pathname = '/wc/' + encodeURIComponent(meetingId) + mapping[urlEnding];