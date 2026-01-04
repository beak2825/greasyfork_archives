// ==UserScript==
// @name     Update Replicated Site Title
// @version  1.1.0
// @grant    none
// @description Update Replicated Site HTML Title with Environment
// @include  http*://*.mysecureoffice.com/*admin*
// @include  http*://*.com.soundcon2.com/*
// @include  http*://*.com.soundcon3.com/*
// @include  http*://*.com.sc/*
// @include  http*://*.uat.crm.verb.tech/*
// @include  http*://*.beta.crm.verb.tech/*

// @namespace https://greasyfork.org/users/7864
// @downloadURL https://update.greasyfork.org/scripts/373758/Update%20Replicated%20Site%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/373758/Update%20Replicated%20Site%20Title.meta.js
// ==/UserScript==


if (window.location.hostname.includes('mysecureoffice.com') ||
	window.location.hostname.includes('soundconcepts.com')) {
	document.title += ' [Production]';
}

if (window.location.hostname.includes('soundcon2.com')) {
	document.title += ' [Staging]';
}

if (window.location.hostname.includes('soundcon3.com')) {
	document.title += ' [Develop]';
}

if (window.location.hostname.includes('uat.crm.verb.tech')) {
	document.title += ' [UAT]';
}

if (window.location.hostname.includes('beta.crm.verb.tech')) {
	document.title += ' [Beta]';
}

if (window.location.hostname.includes('com.sc') ||
	window.location.hostname.includes('.vagrant')) {
	document.title += ' [Vagrant]';
}