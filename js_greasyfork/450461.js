// ==UserScript==
// @name         Old Reddit button
// @version      1.0
// @description  Provides a button to go to the same page on old.reddit when accidentally ending up on new Reddit.
// @author       Phoenix
// @include      https://*.reddit.com/*
// @exclude	     https://old.reddit.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/952476
// @downloadURL https://update.greasyfork.org/scripts/450461/Old%20Reddit%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/450461/Old%20Reddit%20button.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var node;
  node = document.createElement("DIV");
  node.style = `
  	    display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		top: 9px;
		left: 135px;
		width: 160px;
		height: 30px;
		background-color: red;
		border-radius: 15px;
		z-index: 1000;
		cursor:pointer;
		color: #fff;
		font-weight: bold;`;
  node.textContent = "Switch to old.reddit";
  node.addEventListener("click", function() {location.href = location.href.replace('https://www.','https://old.').replace('https://new.','https://old.'); });
  document.body.appendChild(node);
})();