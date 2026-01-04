// ==UserScript==
// @name        Hidden StackOverFlow notifications on Review Queues button
// @match       *://*stackoverflow*/*
// @grant       none
// @version     1.0
// @author      -
// @description 14/4/2020 12:07:25
// @namespace https://greasyfork.org/users/507417
// @downloadURL https://update.greasyfork.org/scripts/400762/Hidden%20StackOverFlow%20notifications%20on%20Review%20Queues%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/400762/Hidden%20StackOverFlow%20notifications%20on%20Review%20Queues%20button.meta.js
// ==/UserScript==
document.querySelector('li.-item.review-button-item').style.display = 'none'
