// ==UserScript==
// @name        Replicated Site Admin - Duplicate Back Office link
// @namespace   http://userscripts.org/users/6623
// @description Add links to backoffice
// @include     http*://*/admin/*
// @version     1.0.2
// @grant       none
// @locale      en
// @downloadURL https://update.greasyfork.org/scripts/389962/Replicated%20Site%20Admin%20-%20Duplicate%20Back%20Office%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/389962/Replicated%20Site%20Admin%20-%20Duplicate%20Back%20Office%20link.meta.js
// ==/UserScript==

var existingLink = document.querySelectorAll(".navbar a[href='/default/admin']")[0];
existingLink.innerHTML = '<i class="icon-user"></i>';

newLinkLi = existingLink.parentNode.cloneNode(true);
newLink = newLinkLi.querySelectorAll("a")[0];
newLink.href = newLink.href.replace(/default/, 'sc-curtis');
newLink.innerHTML = '<i class="icon-fire"></i>';

existingLink.parentNode.parentNode.insertBefore(newLinkLi, existingLink.parentNode.nextSibling);

newLinkLi = existingLink.parentNode.cloneNode(true);
newLink = newLinkLi.querySelectorAll("a")[0];
newLink.href = newLink.href.replace(/default/, 'curtis');
newLink.innerHTML = '<i class="icon-leaf"></i>';

existingLink.parentNode.parentNode.insertBefore(newLinkLi, existingLink.parentNode.nextSibling);
