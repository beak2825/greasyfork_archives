// ==UserScript==
// @name         Roblox Server Joiner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Joins a specific server of a Roblox game via a jobId query string
// @author       Karl Bryant
// @match        https://*.roblox.com/games/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392954/Roblox%20Server%20Joiner.user.js
// @updateURL https://update.greasyfork.org/scripts/392954/Roblox%20Server%20Joiner.meta.js
// ==/UserScript==

// Get our query strings
var urlParams = new URLSearchParams(window.location.search);

// Grab our jobId
var jobId = urlParams.get('jobId');

// Grab our path
var path = window.location.pathname;

// Grab our gameId
var gameId = path.match(/\/games\/(\d+)\//);

// If we have a jobId and we have a gameId
if (jobId && gameId[1]) {
    // Join the game!!
    window.Roblox.GameLauncher.joinGameInstance(gameId[1], jobId);
}