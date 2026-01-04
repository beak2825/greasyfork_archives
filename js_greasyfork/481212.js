// ==UserScript==
// @name         Hack10fastfingers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try it
// @license MIT  k
// @author       Duy
// @match        https://10fastfingers.com/top1000/english/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=10fastfingers.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481212/Hack10fastfingers.user.js
// @updateURL https://update.greasyfork.org/scripts/481212/Hack10fastfingers.meta.js
// ==/UserScript==

$( "#inputfield" ).keyup(function() { $("#inputfield").val( $(".highlight").text() )});