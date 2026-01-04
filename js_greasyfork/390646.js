// ==UserScript==
// @name SDScrewedUp
// @namespace Violentmonkey Scripts
// @match *://hd/*
// @grant none
// @description Script adds button 'Косяк инженера' to SD
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/390646/SDScrewedUp.user.js
// @updateURL https://update.greasyfork.org/scripts/390646/SDScrewedUp.meta.js
// ==/UserScript==

document.getElementById('ShareRequest_Div').innerHTML = '<a href="http://192.168.2.153/dashboard/screwed_up?id='+document.getElementById('requestId').innerHTML+'" target="_blank">Косяк инженера</a>'

