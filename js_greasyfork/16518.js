// ==UserScript==
// @name         X IAFD - SEARCH TERMS REVEAL v.11
// @author       janvier56
// @namespace    https://greasyfork.org/fr/users/7434-janvier56
// @description  Add the search term in the top of the results page
// @version      11
// @include      http://www.iafd.com/results.asp?*
// @include      https://www.iafd.com/results.asp?*
// @include      https://www.iafd.com/results.rme/*
// @grant           none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license     unlicense
// @icon         https://external-content.duckduckgo.com/ip3/www.iafd.com.ico

// @downloadURL https://update.greasyfork.org/scripts/16518/X%20IAFD%20-%20SEARCH%20TERMS%20REVEAL%20v11.user.js
// @updateURL https://update.greasyfork.org/scripts/16518/X%20IAFD%20-%20SEARCH%20TERMS%20REVEAL%20v11.meta.js
// ==/UserScript==
// IF you use NoScript enable : dzwnexfz53ofs.cloudfront.net

// FROM : http://stackoverflow.com/questions/540851/jquery-change-element-type-from-hidden-to-input?rq=1
$(document).ready(function(){
  $(".col-xs-12>form>input:first-of-type[type='hidden']").each(function(){
    var name = $(this).attr('name'); // grab name of original
    var value = $(this).attr('value'); // grab value of original
    /* create new visible input */
    var html = $('<input type="text" name="'+name+'" value="'+value+'" />');
    html.css({"color":"gold", "position": "fixed !important" , "top": "40px !important", "z-index":"5000 !important", "padding":"0 2px 1px" , "background-color":"black" , "font-size":"20px" , "border":"1px solid gray" , "border-radius":"10px" ,"height":"30px" , "line-height":"20px" , "text-align":"center" });

    $(this).before(html).remove(); // add new, then remove original input

    $(".col-xs-12>h1").css({"margin-top":"0 !important" });
  });
});