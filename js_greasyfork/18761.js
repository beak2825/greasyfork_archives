// ==UserScript==
// @name        JR Web test defaults
// @version     0.2.1
// @description A script to fill in defaults.
// @author      (JohnnyRS)
// @namespace   https://greasyfork.org/users/6406
// @include     http*://*mturkcontent.com/dynamic*
// @include     http*://s3.amazonaws.com/mturk_bulk*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18761/JR%20Web%20test%20defaults.user.js
// @updateURL https://update.greasyfork.org/scripts/18761/JR%20Web%20test%20defaults.meta.js
// ==/UserScript==

function isHitPage1() { return $('div.panel-heading:contains("Please follow the link to reach the Financial Advisor")').length; }

function setDefaults() {
    $("input#Q1LinktoWebpage[value='Yes']").prop('checked', true);
    $("input#Q3aName[value='Yes']").prop('checked', true);
    $("input#Q3bAddress[value='Yes']").prop('checked', true);
    $("input#Q3cPhone[value='Yes']").prop('checked', true);
    $("input#Q3dEmail[value='Yes']").prop('checked', true);
    $("input#Q3eBackground[value='Yes']").prop('checked', true);
    $("input#Q3fBackground[value='No']").prop('checked', true);
    $("input#Q3gFirstPersonPoV[value='No']").prop('checked', true);
    $("input#Q3hAssociate[value='No']").prop('checked', true);
    $("input#Q3iExperience[value='No']").prop('checked', true);
    $("input#Q3jEducation[value='No']").prop('checked', true);
    $("input#Q3kAreasofFocus[value='No']").prop('checked', true);
    $("input#Q3lCommunityInvolvement[value='No']").prop('checked', true);
    
    $("input#Q1ProfileFound[value='Yes']").prop('checked', true);
    $("input#Q2aFinancialAdvisor[value='Yes']").prop('checked', true);
    $("input#Q5aProfilePhoto[value='Yes']").prop('checked', true);
    $("input#Q5bLinktoWebpage[value='No']").prop('checked', true);
    $("input#Q5cSummary[value='Yes']").prop('checked', true);
    $("input#Q5dFirst[value='First']").prop('checked', true);
    $("input#Q5eInfoBeyondDisclosure[value='Yes']").prop('checked', true);
    $("input#Q5fLogo[value='Wells Fargo Advisors']").prop('checked', true);
    $("input#Q5gSkills[value='No']").prop('checked', true);
    $("input#Q5hEducation[value='No']").prop('checked', true);
    $("input#Q5iVolunteerExperience[value='No']").prop('checked', true);
    $("input#Q5jGroups[value='No']").prop('checked', true);
}

$(function() {
    if ( isHitPage1() ) {
        console.log("found web test");
        setDefaults();
        
        $("input#Q5cSummary[value='No']").click( function() { $("input#Q5dFirst").prop('checked', false); $("input#Q5dThird").prop('checked', false); });
        $("input#Q5cSummary[value='Yes']").click( function() { $("input#Q5dFirst").prop('checked', true); });
        $("input#Q5dThird").click( function() { $("input#Q5dFirst").prop('checked', false); });
        $("input#Q5dFirst").click( function() { $("input#Q5dThird").prop('checked', false); });
        $("input#Q5LinktoWebpage[value='No']").click( function() {
            $("input[type='radio']").prop('checked', false);
            $("input#Q1LinktoWebpage[value='No']").prop('checked', true);
        });
        $("input#Q5LinktoWebpage[value='Yes']").click( function() {
            setDefaults();
            $("input#Q1LinktoWebpage[value='Yes']").prop('checked', true);
        });
        $("input#Q1ProfileFound[value='No']").click( function() {
            $("input[type='radio']").prop('checked', false);
            $("input#Q1ProfileFound[value='No']").prop('checked', true);
        });
        $("input#Q1ProfileFound[value='Yes']").click( function() {
            setDefaults();
            $("input#Q1ProfileFound[value='Yes']").prop('checked', true);
        });
    }
});
