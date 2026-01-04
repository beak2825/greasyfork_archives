// ==UserScript==
// @name     Transfer PP
// @description Puts transferable PP into field
// @version 1
// @include https://*/game.php?village=*&screen=premium&mode=transfer*
// @namespace https://greasyfork.org/users/151096
// @author FunnyPocketBook
// @downloadURL https://update.greasyfork.org/scripts/376796/Transfer%20PP.user.js
// @updateURL https://update.greasyfork.org/scripts/376796/Transfer%20PP.meta.js
// ==/UserScript==

let recipient = "";

let text = document.querySelector("#content_value > form > table > tbody > tr:nth-child(1) > th").innerText.trim().split(" ");
let amount = text[text.length - 1];
let ppField = document.querySelector("#content_value > form > table > tbody > tr:nth-child(3) > td:nth-child(2) > input[type=\"text\"]");
ppField.value = amount;
document.querySelector("#content_value > form > table > tbody > tr:nth-child(2) > td:nth-child(2) > input").value = recipient;