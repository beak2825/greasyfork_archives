// ==UserScript==
// @version 1.0
// @name Sticky Performance
// @namespace sticky_performance_header
// @description makes the performance header sticky
// @include https://learn.galvanize.com
// @downloadURL https://update.greasyfork.org/scripts/30588/Sticky%20Performance.user.js
// @updateURL https://update.greasyfork.org/scripts/30588/Sticky%20Performance.meta.js
// ==/UserScript==

var table = document.querySelector('table')
var thead = document.querySelector('thead')
var filters = document.querySelector('.clear-filters')
table.style.display = 'block'
table.style.height = '500px'
table.style.overflow = 'scroll'
thead.style.position = 'absolute'
thead.style.left = '30%'
filters.style.display = 'none'