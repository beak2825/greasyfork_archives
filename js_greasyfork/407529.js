// ==UserScript==
// @name        Percy Synonym Quiz
// @author       Tehapollo
// @version      1.1
// @include      /^https://(www\.mturkcontent|.*\.s3\.amazonaws)\.com/
// @include      *mturkcontent.com*
// @include      *s3.amazonaws.com*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  fill x
// @downloadURL https://update.greasyfork.org/scripts/407529/Percy%20Synonym%20Quiz.user.js
// @updateURL https://update.greasyfork.org/scripts/407529/Percy%20Synonym%20Quiz.meta.js
// ==/UserScript==
let fushadow
setTimeout(function(doesstuff){
if ($("p:contains('You will be shown a sentence with a')").length){
    window.focus();
    $(`[class="instructions"]`).hide()
    fushadow = document.querySelector(`crowd-form`); // don't mess with this
    document.querySelector(`[name="candidate0-bad"]`).click();
    document.querySelector(`[name="candidate1-bad"]`).click();
    document.querySelector(`[name="candidate2-bad"]`).click();
    document.querySelector(`[name="candidate3-bad"]`).click();
    document.querySelector(`[name="candidate4-bad"]`).click();
    document.querySelector(`[name="candidate5-bad"]`).click();
    document.querySelector(`[name="candidate6-bad"]`).click();
    document.querySelector(`[name="candidate7-bad"]`).click();
    document.querySelector(`[name="candidate8-bad"]`).click();
    document.querySelector(`[name="candidate9-bad"]`).click();
    document.querySelector(`[name="candidate10-bad"]`).click();
    document.querySelector(`[name="candidate11-bad"]`).click();
    document.querySelector(`[name="candidate12-bad"]`).click();
    document.querySelector(`[name="candidate13-bad"]`).click();
    document.querySelector(`[name="candidate14-bad"]`).click();
}
},800);