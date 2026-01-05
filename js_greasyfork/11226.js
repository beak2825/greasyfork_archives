// ==UserScript==
// @name          CH Ben Peterson Demographics Defaults
// @description   Select your specified answers for gender and birth year on Ben Peterson's HITs. You must edit the script to specify your answers.
// @version       1.1c
// @author        clickhappier
// @namespace     clickhappier
// @include       https://www.mturkcontent.com/dynamic/*
// @include       https://www.photofeeler.com/mturk/*
// @require       http://code.jquery.com/jquery-latest.min.js
// @grant         GM_log
// @downloadURL https://update.greasyfork.org/scripts/11226/CH%20Ben%20Peterson%20Demographics%20Defaults.user.js
// @updateURL https://update.greasyfork.org/scripts/11226/CH%20Ben%20Peterson%20Demographics%20Defaults.meta.js
// ==/UserScript==


// *** put MALE or FEMALE, in all-capital letters like that, between the below quotes: ***
var yourGender = "";

// *** put the year you were born, such as 1970 or 1996, between the below quotes: ***
var yourYear = "";


$( document ).ready(function() {  // make sure to wait till page is fully ready (necessary for photofeeler-hosted version in FF)
    // if this is a Ben Peterson HIT with demographics questions
    if ( $('div.demographics span.grey-box select.select-demo').length > 0 )
    {
        var matchedGender, matchedYear;

        // select your gender, if specified above
        if ( yourGender !== "" )
        {
            var phGenderOption = $('div.demographics span.grey-box select.select-demo[name="gender"] option').filter( function(){ return $(this).val() == yourGender; } );
            var mtcGenderOption = $('div.demographics span.grey-box select.select-demo.select-gender option').filter( function(){ return $(this).val() == yourGender; } );
            // photofeeler-hosted version - verifies you're in the right HIT group
            if ( phGenderOption.length > 0 ) 
            {  // if value is in list for this hit
                matchedGender = true;
                phGenderOption.prop('selected', true).trigger('change');
            }
            // mturkcontent-hosted version - after trying several variations, haven't gotten the verification test working properly for this version, hopefully it will be unnecessary if he finishes moving all the HIT types to the new photofeeler version
            else if ( mtcGenderOption.filter(function(){ return $(this).css("display") != "none"; } ).length > 0 )
            {  // if value is in list for this hit
                matchedGender = true;
                mtcGenderOption.prop('selected', true).trigger('change');
            }
            else
            {
                window.alert("This Ben Peterson HIT doesn't have an option for the gender you provided in the Demographics Defaults script, so you should probably return this HIT.");
            }
        }
    
        // select your birth year, if specified above
        if ( yourYear !== "" )
        {
            var pfYearOption = $('div.demographics span.grey-box select.select-demo[name="birth_year"] option').filter( function(){ return $(this).val() == yourYear; } );
            var mtcYearOption = $('div.demographics span.grey-box select.select-demo.select-birth-year option').filter( function(){ return $(this).val() == yourYear; } );
            // photofeeler-hosted version - verifies you're in the right HIT group
            if ( pfYearOption.length > 0 )
            {  // if value is in list for this hit
                matchedYear = true;
                pfYearOption.prop('selected', true).trigger('change');
            }
            // mturkcontent-hosted version - after trying several variations, haven't gotten the verification test working properly for this version, hopefully it will be unnecessary if he finishes moving all the HIT types to the new photofeeler version
            else if ( mtcYearOption.filter(function(){ return $(this).css("display") != "none"; } ).length > 0 )
            {  // if value is in list for this hit
                matchedYear = true;
                mtcYearOption.prop('selected', true).trigger('change');
            }
            else
            {
                window.alert("This Ben Peterson HIT doesn't have an option for the birth year you provided in the Demographics Defaults script, so you should probably return this HIT.");
            }
        }

        // select the 'I have read the instructions.' checkbox, only if you've filled in your gender and year, and (only in photofeeler-hosted HITs) they match this HIT's options
        if ( (yourGender !== "") && (yourYear !== "") && (matchedGender === true) && (matchedYear === true) )
        {
            $('div.instructions-confirm').find('input[type="checkbox"][name="read_instructions"]').prop('checked', true);
        }
    }
});
// http://stackoverflow.com/questions/2248976/check-if-value-is-in-select-list-with-jquery , http://stackoverflow.com/questions/15924751/check-if-a-element-is-displaynone-or-block-on-click-jquery
