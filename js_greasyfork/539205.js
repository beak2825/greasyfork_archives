// ==UserScript==
// @name        IMDb Full Gallery Redirect
// @namespace   https://greasyfork.org/users/636724-cml99
// @match       http*://*imdb.com/title/*
// @match       http*://*imdb.com/name/*
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @grant       GM_addStyle
// @version     1.0.1
// @author      CML99
// @license     CC-BY-NC-SA-4.0
// @description Clicking the photos section title or more image will open the full tiled view gallery page instead of a single photo.
// @icon        https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @downloadURL https://update.greasyfork.org/scripts/539205/IMDb%20Full%20Gallery%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/539205/IMDb%20Full%20Gallery%20Redirect.meta.js
// ==/UserScript==


var photosTitle = document.querySelector('.ipc-page-section[data-testid="Photos"] a.ipc-title-link-wrapper');
var photosMore = document.querySelector('.ipc-page-section[data-testid="Photos"] a.hide-b-m');

var photosTitleActor = document.querySelector('.ipc-page-wrapper:has(div[data-testid="Filmography"]) .ipc-page-section[data-testid="Photos"] a.ipc-title-link-wrapper');
var photosMoreActor = document.querySelector('.ipc-page-wrapper:has(div[data-testid="Filmography"]) .ipc-page-section[data-testid="Photos"] a.hide-b-m');

const urlSplit = window.location.pathname.split('/').filter(segment => segment);
let ttid = urlSplit[1];

let galleryLink = 'https://www.imdb.com/title/' + ttid + '/mediaindex/';
let galleryLinkActor = 'https://www.imdb.com/name/' + ttid + '/mediaindex/';

photosTitle.href = galleryLink;
photosMore.href = galleryLink;
photosTitleActor.href = galleryLinkActor;
photosMoreActor.href = galleryLinkActor;
