// ==UserScript==
// @namespace    https://
// @version      1.0.0
// @description  Select Yes to all.
// @author       LLL
// @icon         http://mturkforum.com/image.php?u=79381&dateline=1464644104
// @name         Alicia's questions
// @include      https://www.mturk.com/mturk/*
// @include      https://s3.amazonaws.com/*
// @include      https://www.mturkcontent.com/dynamic/*
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/34221/Alicia%27s%20questions.user.js
// @updateURL https://update.greasyfork.org/scripts/34221/Alicia%27s%20questions.meta.js
// ==/UserScript==




$(document).ready(function() {
window.focus();



$('input:radio[name="Website broken (if yes dont answer the rest of the questions"][value="No"]')
    .attr('checked', true);

$('input:radio[name="Could you find Payment Options Info"][value="Yes, logos were visible at shopping cart"]')
    .attr('checked', true);

$('input:radio[name="Discover"][value="Yes"]')
    .attr('checked', true);

$('input:radio[name="Visa"][value="Yes"]')
    .attr('checked', true);

$('input:radio[name="PayPal"][value="No"]')
    .attr('checked', true);
});



