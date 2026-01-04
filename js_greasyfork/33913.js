// ==UserScript==
// @namespace    https://greasyfork.org/en/users/155391-lll
// @version      1.0.0
// @description  Select Yes to the 1st questions and no for the rest.
// @author       LLL
// @icon         http://mturkforum.com/image.php?u=79381&dateline=1464644104
// @name         MTurk Answer Elicitation - Question-answer quality
// @include      https://www.mturk.com/mturk/*
// @include      https://s3.amazonaws.com/*
// @include      https://www.mturkcontent.com/dynamic/*
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/33913/MTurk%20Answer%20Elicitation%20-%20Question-answer%20quality.user.js
// @updateURL https://update.greasyfork.org/scripts/33913/MTurk%20Answer%20Elicitation%20-%20Question-answer%20quality.meta.js
// ==/UserScript==




$(document).ready(function() {
window.focus();



$('input:radio[name="Q-goodquestion"][value="Yes"]')
    .attr('checked', true);

$('input:radio[name="Q-goodanswer"][value="Yes"]')
    .attr('checked', true);

$('input:radio[name="Q-offensive"][value="No"]')
    .attr('checked', true);

$('input:radio[name="Q-timesensitive"][value="No"]')
    .attr('checked', true);

$('input:radio[name="Q-locationsensitive"][value="No"]')
    .attr('checked', true);

$('input:radio[name="Q-subjective"][value="No"]')
    .attr('checked', true);

$('input:radio[name="Q-legal"][value="No"]')
    .attr('checked', true);

$('input:radio[name="Q-medical"][value="No"]')
    .attr('checked', true);
});

//Submit // Enter or Numberpad Enter
if (key === 'Enter') {
$("input[id='submitButton']").click();

}

