// ==UserScript==
// @name         [.01 Whisper LLC] Mark Inappropriate Short Text 
// @author       robert, improvements by kadauchi
// @namespace    https://greasyfork.org/en/users/13168-robert
// @include      https://s3.amazonaws.com/mturk_bulk/hits/*
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @description  Hotkeys, hide instructions. autosubmit
// @version      1.1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10910/%5B01%20Whisper%20LLC%5D%20Mark%20Inappropriate%20Short%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/10910/%5B01%20Whisper%20LLC%5D%20Mark%20Inappropriate%20Short%20Text.meta.js
// ==/UserScript==

// Based heavily on Kadauchi's Nova Compare two products
// https://greasyfork.org/en/scripts/10843-nova-compare-two-products/code

// true if you want to submit immediately after making a selection
var autoSubmit=true;
// true if you want to hide the instructions
var hideInstructions=true;
//Instruction hider
if (hideInstructions)
{ 
    $(".panel-body").hide();
    $(".panel-heading").click
    (
        function() 
        {    
            $(".panel-body").toggle();
        }
    );
}
if ( $("p:contains('We provide detailed instructions for this task')").length )
{
    $("input:radio[name=sex]:first").focus();
    window.onkeydown = function(e)
    {
        if (e.keyCode === 97 || e.keyCode === 49) //1 no no
        {
            $("input:radio[name='sex']").eq(0).click();
            $("input:radio[name='solicitation']").eq(0).click();
            if (autoSubmit)
            {
                $("input[id='submitButton']" ).click();
            }
        }
        if (e.keyCode === 98 || e.keyCode === 50) //2 yes no
        {  
            $("input:radio[name='sex']").eq(1).click();
            $("input:radio[name='solicitation']").eq(0).click();
            if (autoSubmit) 
            {
                $("input[id='submitButton']" ).click();
            }
        }
        if (e.keyCode === 99 || e.keyCode === 51) //3 yes yes
        {   
            $("input:radio[name='sex']").eq(1).click();
            $("input:radio[name='solicitation']").eq(1).click();
            if (autoSubmit) 
            {
                $("input[id='submitButton']" ).click();
            }
        }
        if (e.keyCode === 100 || e.keyCode === 52) //4 no yes
        { 
            $("input:radio[name='sex']").eq(0).click();
            $("input:radio[name='solicitation']").eq(1).click();
            if (autoSubmit) 
            {
                $("input[id='submitButton']" ).click();
            }
        }
        // Submit
        if (e.keyCode === 13 ) //enter
        {   
            $("input[id='submitButton']" ).click();
        }
    };
}
/*
select radio buttons in one keypress

1: sex NO,  solicitation NO
2: sex YES, solicitation NO
3: sex YES,  solicitation YES
4: sex NO,  solicitation YES

change autoSubmit to toggle auto-submit
change hideInstructions to toggle instruction hiding
*/