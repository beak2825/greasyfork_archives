// ==UserScript==
// @name        Audio Categorization Script
// @namespace   starvingstatic
// @description Auto-selects "No" for all options
// @include https://www.mturkcontent.com/dynamic/*
// @include     https://s3.amazonaws.com/mturk_bulk/hits*
// @grant       none
// @version     1.1
// @require http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/11125/Audio%20Categorization%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/11125/Audio%20Categorization%20Script.meta.js
// ==/UserScript==



$("input[value='No']").click(); 