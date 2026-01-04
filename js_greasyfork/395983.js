// ==UserScript==
// @name     Cookie and the Dalelands
// @description Changes the CD site header to Cookie and the Dalelands
// @version  1
// @grant    none
// @match *://cormyrdalelands.boards.net/*
// @namespace https://greasyfork.org/users/440719
// @downloadURL https://update.greasyfork.org/scripts/395983/Cookie%20and%20the%20Dalelands.user.js
// @updateURL https://update.greasyfork.org/scripts/395983/Cookie%20and%20the%20Dalelands.meta.js
// ==/UserScript==

var logo = document.getElementById("logo");

logo.textContent = "Cookie and the Dalelands";

Object.assign(logo.style, { "background-image": "url('https://i.imgur.com/W5dk66F.png')",
                            "background-repeat": "no-repeat",
                            "height": "90px",
                            "display": "inline-block",
                            "line-height": "90px",
														"padding-left": "90px"
                          });