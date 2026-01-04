// ==UserScript==
// @name         ADN skip intro
// @namespace    https://www.youtube.com/watch?v=ia6MnXKM8oE
// @version      1.7
// @description  Auto skip intro
// @author       TheGeogeo
// @match        https://animedigitalnetwork.fr/video/
// @include      https://animedigitalnetwork.fr/video/*
// @icon         https://i.imgur.com/4JfBt4G.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434955/ADN%20skip%20intro.user.js
// @updateURL https://update.greasyfork.org/scripts/434955/ADN%20skip%20intro.meta.js
// ==/UserScript==

function getElementByXpath(d){return document.evaluate(d,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue}window.addEventListener("load",function(){var d=getElementByXpath("/html/body/div[1]/div/div/div[4]/div/div/div[1]/div[1]/div/div/div[1]/div/div/div[7]");setInterval(function(){("vjs-dock vjs-dock-bottom vjs-dock-visible"==(d=getElementByXpath("/html/body/div[1]/div/div/div[4]/div/div/div[1]/div[1]/div/div/div[1]/div/div/div[7]")).className|"vjs-dock vjs-dock-bottom"==d.className)&"Passer l'introduction"==d.children[0].children[0].children[0].children[1].innerHTML&&d.children[0].children[0].children[0].click()},500)},!1);