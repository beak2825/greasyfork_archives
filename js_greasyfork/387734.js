// ==UserScript==
// @name         Air Dates 7 days colors
// @description  Adds 2 colors to the default colors to tag your shows in Air Dates website, making it enough for one color for each day
// @namespace    https://github.com/ccheraa
// @homepage     https://github.com/ccheraa/air-dates-7-days-colors
// @version      1
// @date         2019-07-22
// @description  add 2 default colors
// @author       ccheraa@gmail.com
// @match        http://www.airdates.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387734/Air%20Dates%207%20days%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/387734/Air%20Dates%207%20days%20colors.meta.js
// ==/UserScript==

"use strict";jQuery(function(){var e=window.document.styleSheets[0];e.insertRule(".soft_f{background-color:#2e9fff}",e.cssRules.length),e.insertRule(".soft_g{background-color:#8a2be2}",e.cssRules.length),e.insertRule(".colors{display:flex;justify-content:flex-start;flex-wrap:wrap}",e.cssRules.length),$("body").on("click","div.entry:not([data-sevened]) div.title",function(){!function(e){e.attr("data-sevened","yes");var s=jQuery(".details .colors .color",e[0]);6===s.length&&jQuery('<span class="color soft_f"></span><span class="color soft_g"></span>').insertAfter(s[s.length-1])}($(this).parent())})});