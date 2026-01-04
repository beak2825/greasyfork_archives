// ==UserScript==
// @name        Steam 自动通过年龄检查
// @namespace   tea.pm
// @match       https://store.steampowered.com/agecheck/app/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant       none
// @version     1.0
// @author      cljnnn
// @description 2020/8/19 上午10:03:09
// @downloadURL https://update.greasyfork.org/scripts/408980/Steam%20%E8%87%AA%E5%8A%A8%E9%80%9A%E8%BF%87%E5%B9%B4%E9%BE%84%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/408980/Steam%20%E8%87%AA%E5%8A%A8%E9%80%9A%E8%BF%87%E5%B9%B4%E9%BE%84%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

$("#ageDay").val("1");
$("#ageMonth").val("January");
$("#ageYear").val("2000");
$("div.agegate_text_container a:first").click();