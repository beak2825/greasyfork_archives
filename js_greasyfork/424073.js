// ==UserScript==
// @name         Scrollbar Style
// @version      1.1
// @description  Script that change the scrollbar style.
// @author       Spielberg
// @include      https://www.youtube.com/*
// @match             *://*/*
// @namespace https://greasyfork.org/users/392551
// @downloadURL https://update.greasyfork.org/scripts/424073/Scrollbar%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/424073/Scrollbar%20Style.meta.js
// ==/UserScript==
 
const scrollbarStyle = document.createElement('style');
 
scrollbarStyle.innerHTML = 'body {overflow-x: hidden;overflow-y: scroll;overflow-y: overlay;}::-webkit-scrollbar {width: 8px;}::-webkit-scrollbar-track {background: #181818;border-left-width: 1px;border-left-style: solid;border-left-color: #606060;}::-webkit-scrollbar-thumb {background: #606060;border-left-width: 1px;border-left-style: solid;border-left-color: #606060;}::-webkit-scrollbar-thumb:hover {background: #606060;border-left-width: 1px;border-left-style: solid;border-left-color: #606060;}';
 
document.body.append(scrollbarStyle);
