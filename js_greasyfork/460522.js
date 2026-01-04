// ==UserScript==
// @name         Trophy Export for forums
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Exports trophy information formatted with forum tags
// @author       UltraTiger
// @match        https://psnprofiles.com/trophy/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/460522/Trophy%20Export%20for%20forums.user.js
// @updateURL https://update.greasyfork.org/scripts/460522/Trophy%20Export%20for%20forums.meta.js
// ==/UserScript==

var gametitle = document.getElementsByTagName('h3')[0]
gametitle = gametitle.getElementsByTagName('a')[0]
gametitle = gametitle.innerHTML

var trophybox = document.getElementsByClassName('even')[0]
var trophyimage = trophybox.getElementsByTagName('a')[0]
var trophytext = trophybox.getElementsByTagName('td')[1]
var trophytitle = trophytext.getElementsByTagName('span')[0]
trophytitle = trophytitle.innerHTML
var trophydesc = trophytext.innerHTML.split("br>")[1].trim()

GM_setClipboard ("[b]"+(gametitle)+"[/b]\r\n\r\n[img]"+(trophyimage)+"[/img]\r\n[b]"+(trophytitle)+"[/b]\r\n"+(trophydesc));