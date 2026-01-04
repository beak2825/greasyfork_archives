// ==UserScript==
// @name        SkidRow Link Enabler - skidrowreloaded.nl
// @namespace   Scripts
// @match       https://skidrowreloaded.nl/*
// @grant       none
// @version     1.0
// @author      -sjohnson1021
// @description 7/19/2022, 1:44:52 AM
// @downloadURL https://update.greasyfork.org/scripts/448099/SkidRow%20Link%20Enabler%20-%20skidrowreloadednl.user.js
// @updateURL https://update.greasyfork.org/scripts/448099/SkidRow%20Link%20Enabler%20-%20skidrowreloadednl.meta.js
// ==/UserScript==
var x = document.querySelectorAll("a[rel='nofollow noopener']")
x.forEach(EnableLink);

function EnableLink(item) {
  item.text = "Link";
}