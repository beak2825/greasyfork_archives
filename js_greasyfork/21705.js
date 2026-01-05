// ==UserScript==
// @name        AnimeHaven No Sidebar
// @description Removes the aside portion of animehaven.to to present a much cleaner viewing experience.
// @namespace   animehaven.to
// @include     http://animehaven.to/dubbed/*
// @include     http://animehaven.to/subbed/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21705/AnimeHaven%20No%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/21705/AnimeHaven%20No%20Sidebar.meta.js
// ==/UserScript==
var mainFloat = document.getElementById('content');
mainFloat.style.width = 'auto';
mainFloat.style.float = 'none';
