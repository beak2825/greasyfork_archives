/* globals jQuery, $, waitForKeyElements */
// ==UserScript==
// @name         Indeed Autofill
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically applies to Indeed applications once you've hit apply.
// @author       ganondorc
// @match        https://m5.apply.indeed.com/beta/indeedapply/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=indeed.com
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468132/Indeed%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/468132/Indeed%20Autofill.meta.js
// ==/UserScript==

var $ = jQuery;
$.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});
window.setInterval(function() {
    if ($('body:contains("Answer this question to continue")').length > 0) {
        // If it does, stop
        return;
    }

    var bachelorRadioButton = $('input[type="radio"][value*="Bachelor\'s"]:first');
    var resumeElement = $('span[title="MY NAME.pdf"]');
    var submitApplicationElement = $('div:contains("Submit your application")');
    var addSupportingDocumentsElement = $('a[aria-label="Add Supporting documents"]');
    var editSupportingDocumentsElement = $('a[aria-label="Edit Supporting documents"]');
    var relevantExperienceElement = $('span:contains("Relevant experience")');
    var continueToApplicationElement = $(":contains('Continue to application')");
    var previousCoverLetterAvailableElement = $("span:contains('Previous cover letter available')");
    var declineToIdentifyRadioElement = $("label:contains('I decline to identify') input[type='radio']");
    var protectedVeteranRadioElement = $('label:contains("I IDENTIFY AS ONE OR MORE OF THE CLASSIFICATIONS OF PROTECTED VETERAN LISTED ABOVE") input[type="radio"]');
    var disabilityRadioElement = $('label:contains("Yes, I Have A Disability, Or Have A History/Record Of Having A Disability") input[type="radio"]');

    var continueButton = $("button.ia-continueButton");

    bachelorRadioButton.prop("checked", true).change().trigger("click").trigger("submit");

    if (resumeElement.length) {
        resumeElement.click();
        continueButton.click();
    }

    if (submitApplicationElement.length && addSupportingDocumentsElement.length) {
        var selector = 'div.ia-Review-EmptyDocuments a';
        var element = document.querySelector(selector);
        if (element) {
            var rect = element.getBoundingClientRect();
            var clickEvent = new MouseEvent("click", {
                "view": window,
                "bubbles": true,
                "cancelable": false,
                "clientX": rect.left + 16,
                "clientY": rect.top + 13
            });
            element.dispatchEvent(clickEvent);
        }
    }

    if (editSupportingDocumentsElement.length) {
        continueButton.click();
    }

    if (relevantExperienceElement.length) {
        continueButton.click();
    }

    if(continueToApplicationElement.length === 0) {
        $('span:contains("Return to job search")').click();
    }

    if (previousCoverLetterAvailableElement.length) {
        previousCoverLetterAvailableElement.click();
        continueButton.click();
    }

    if (declineToIdentifyRadioElement.length) {
        declineToIdentifyRadioElement.click();
        $("select option:contains('I decline to identify')").prop('selected', true);
        continueButton.click();
    }

    if (protectedVeteranRadioElement.length) {
        protectedVeteranRadioElement.prop('checked', true);
        continueButton.click();
    }

    if (disabilityRadioElement.length) {
        disabilityRadioElement.prop('checked', true);
        continueButton.click();
    }


    $('button#downshift-0-toggle-button span span').text("Weekday");
    // $("#downshift-0-toggle-button").click();
    $('button#downshift-1-toggle-button span span').text("Anytime");
    // $("#downshift-1-toggle-button").click();

}, 1000);
jQuery.noConflict();
