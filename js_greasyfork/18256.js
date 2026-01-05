// ==UserScript==
// @name        Hide All Plugins
// @description Shows empty navigator.plugins and navigator.mimeTypes collections to selected websites
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @copyright   Copyright 2016 Jefferson Scher
// @license     BSD 3-clause
// @include     http://www.jeffersonscher.com/res/plugins.html
// @include     http://video.gazzetta.it/*
// @version     0.5
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/18256/Hide%20All%20Plugins.user.js
// @updateURL https://update.greasyfork.org/scripts/18256/Hide%20All%20Plugins.meta.js
// ==/UserScript==
// See: https://github.com/dillbyrne/random-agent-spoofer/issues/283#issuecomment-163059386 
Object.defineProperty(navigator, "plugins", {value: []});
Object.defineProperty(navigator, "mimeTypes", {value: []});