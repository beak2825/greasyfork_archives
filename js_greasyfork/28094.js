// ==UserScript==
// @name        FL Direct Link
// @namespace   https://fetlife.com/*
// @description Add a Direct Link to FL
// @include     https://fetlife.com/users/*/pictures/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28094/FL%20Direct%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/28094/FL%20Direct%20Link.meta.js
// ==/UserScript==

var img = document.querySelector('img.fl-picture__img.fl-disable-interaction');
var imgUrl = img.getAttribute("src");
var sideBarSection = document.querySelector('aside.fl-content-sidebar section');
var linkElement = document.createElement('a');
var label = document.createTextNode('Open photo in new tab »');
linkElement.appendChild(label);
linkElement.setAttribute('target', '_blank');
linkElement.setAttribute('href', imgUrl);

var linkContainer = document.createElement('div');
linkContainer.style["text-align"] = "center";
linkContainer.appendChild(linkElement);

sideBarSection.appendChild(linkContainer);
