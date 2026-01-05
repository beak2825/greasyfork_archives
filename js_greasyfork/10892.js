// ==UserScript==
// @name        [.01 Nova]Categorize a product. 
// @author robert
// @namespace  https://greasyfork.org/en/users/13168-robert
// @include  https://www.mturkcontent.com/dynamic/hit*
// @version     1
// @grant       none
// @require  http://code.jquery.com/jquery-2.1.0.min.js
// @description:en Hotkeys
// @description Hotkeys
// @downloadURL https://update.greasyfork.org/scripts/10892/%5B01%20Nova%5DCategorize%20a%20product.user.js
// @updateURL https://update.greasyfork.org/scripts/10892/%5B01%20Nova%5DCategorize%20a%20product.meta.js
// ==/UserScript==

// Based heavily on Kadauchi's Nova Compare two products
// https://greasyfork.org/en/scripts/10843-nova-compare-two-products/code

// true if you want to submit immediately after making a selection
var autosubmit=false;
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
if ( $("label:contains('For the product above, which category below fits best?')").length )
{
    $("input:radio[name=category]:first").focus();
    window.onkeydown = function(e)
    {
        if (e.keyCode === 97 || e.keyCode === 49) //1 
        {
            $("input:radio[name=category]:nth(0)").attr('checked', true);
            if (autosubmit)
            {
                $("input[id='submitButton']" ).click();
            }
        }
        if (e.keyCode === 98 || e.keyCode === 50) //2
        {  
            $("input:radio[name=category]:nth(1)").attr('checked', true);
            if (autosubmit) 
            {
                $("input[id='submitButton']" ).click();
            }
        }
        if (e.keyCode === 99 || e.keyCode === 51) //3 
        {   
            $("input:radio[name=category]:nth(2)").attr('checked', true);
            if (autosubmit) 
            {
                $("input[id='submitButton']" ).click();
            }
        }
        if (e.keyCode === 100 || e.keyCode === 52) //4 
        { 
            $("input:radio[name=category]:nth(3)").attr('checked', true);
            if (autosubmit) 
            {
                $("input[id='submitButton']" ).click();
            }
        }
        //"None of the above"
        if (e.keyCode === 96 || e.keyCode === 48) //0 
        { 
            $("input:radio[name=category]:nth(4)").attr('checked', true);
            if (autosubmit) 
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
0 - 4 to check the first 4 radio buttons
0 to check "None of the above"

change autosubmit variable to have script automatically submit after pressing a button

change hideInstructions if you want to hide the instructions 
*/