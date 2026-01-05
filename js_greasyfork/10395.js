// ==UserScript==
// @name         ProductRnR
// @namespace    https://greasyfork.org/users/11580
// @version      1.9.1
// @description  Makes all of the ProductRnR HITs easier/faster.
// @author       Kadauchi
// @icon         http://www.mturkgrind.com/data/avatars/l/1/1084.jpg?1432698290
// @include      https://www.mturkcontent.com/dynamic/*
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/10395/ProductRnR.user.js
// @updateURL https://update.greasyfork.org/scripts/10395/ProductRnR.meta.js
// ==/UserScript==

// Marks radio buttons.
$("input[value='notadult']").click(); // Marks Non-Adult.

// Checks to see if we are on the HIT: 
// If you were to select a caption for this image, which one would you prefer?
if ($("h1:contains(If you were to select a caption for this image, which one would you prefer?)").length){
    var Index = 0;

    $("div.documentbox").eq(Index).css({backgroundColor:"lightblue"});
    $("html, body").animate({
        scrollTop: $("div.documentbox").eq(Index).offset().top
    }, 0);

    $(window).keydown(function(e){
        if (e.keyCode == 49 || e.keyCode == 97){ //1 or Numpad 1   
            $(":radio:even").eq(Index).click();
            $("div.documentbox").css({backgroundColor:""});
            Index ++;
            $("div.documentbox").eq(Index).css({backgroundColor:"lightblue"});
            $("html, body").animate({
                scrollTop: $("div.documentbox").eq(Index).offset().top - $("div.documentbox").outerHeight()
            }, 0);
        }
        if (e.keyCode == 50 || e.keyCode == 98 ){ //2 or Numpad 2   
            $(":radio:odd").eq(Index).click();
            $("div.documentbox").css({backgroundColor:""});
            Index ++;
            $("div.documentbox").eq(Index).css({backgroundColor:"lightblue"});
            $("html, body").animate({
                scrollTop: $("div.documentbox").eq(Index).offset().top - $("div.documentbox").outerHeight()
            }, 0);
        }
        if (e.keyCode == 51 || e.keyCode == 99){ //3 or Numpad 3
            $("div.documentbox").css({backgroundColor:""});
            Index --;
            $("div.documentbox").eq(Index).css({backgroundColor:"lightblue"});
            $("html, body").animate({
                scrollTop: $("div.documentbox").eq(Index).offset().top - $("div.documentbox").outerHeight()
            }, 0);

        }
        if (e.keyCode === 13){
            $("button[name='SubmitButton']").click();
        }
    });
}

// Checks to see if we are on the HIT: 
// Identify pages where you can purchase a product (updated HIT & guidelines)
if ($("th:contains(Identify pages where you can purchase a product)").length){
    $("input[value='ShoppingPage_ProductAvailable']").click();
}

// Checks to see if we are on the HIT: 
// Determine whether the provided value of product attribute matches the corresponding value on the page
if ($("th:contains(Determine whether the provided value of product attribute matches the corresponding value on the page.)").length){
    $("input[value='Correct']").click();
}

// Checks to see if we are on the HIT: 
// Identify these images as School appropriate. (WARNING: This HIT may contain adult content. Worker discretion is advised.)
if ($("input[value='AdultImageV2_OkToShow']").length){
    $("input[value='AdultImageV2_OkToShow']").click();
}

// Checks to see if we are on the HIT: 
// Determine whether or not the given image is an image of the product being sold on the provided page				
if ($("h1:contains(Determine whether or not the given image is an image of the product being sold on the provided page.)").length){
    //alert("hi");
    $("input[value='ShoppingImage_MatchesProduct']").prop("checked", true);
}

// Checks to see if we are on the HIT: 
// If you looked at and liked the image above, which of the images below would you be more interested to see?		
if ($("div:contains(You are browsing the web for Images. If you looked at and liked the image above, which of the images below would you be more interested to see?)").length){
    $(":radio:even").click();
}

// Checks to see if we are on the HIT: 
// Choose between two pictures of a given person		
if ($("div:contains(Which of the 2 images would you prefer to represent the given person? You can use the name to search for more context on the person if necessary.)").length){
    $(":radio:even").click();
}

// Checks to see if we are on the HIT: 
// Checks to see if we are on Label images based on their relevance for the query.
if ($("b:contains(Unrelated/Only Indirectly Related)").length){
    ProductRnR_Relevance_Query();
}

function ProductRnR_Relevance_Query(){
    $(":radio").on('change',function(){
        $(this).next(":contains(Related)").parent().parent().css("opacity", "1").css({ backgroundColor: "lightgreen", opacity: "1"});
        $(this).next(":contains(Unrelated/Indirectly Related)").parent().parent().css("opacity", "1").css({ backgroundColor: "red", opacity: "1"});
        $(this).next(":contains(Image didn't load)").parent().parent().css({ backgroundColor: "", opacity: "0.1"});
    });
    $("input[value='QueryImage_Unrelated']").prop("checked", true).change();
    $(".documentbox").click(function(e){e.preventDefault();});
    $('.documentbox').contextmenu( function() {
        return false;
    });
    $(".documentbox").mousedown(function(e){
        switch (e.which) {
            case 1:
                if($(this).find("input:radio:checked").next(":contains(Related):not(:contains('Unrelated'))").length > 0){
                    $(this).find("input[value='QueryImage_Unrelated']").prop("checked", true).change();return false;
                }
                if($(this).find("input:radio:checked").next(":contains(Image didn't load)").length > 0){
                    $(this).find("input[value='QueryImage_Related']").prop("checked", true).change();return false;
                }
                if($(this).find("input:radio:checked").next(":contains(Unrelated/Indirectly Related)").length > 0){
                    $(this).find("input[value='QueryImage_Related']").prop("checked", true).change();return false;
                }
                break;
            case 3:
                $(this).find("input[value='NoLoad']").prop("checked", true).change();return false;
                break;
        }
    });
    $("img").error(function(){
        $(this).parents(".documentbox").find("input[value='NoLoad']").prop("checked", true).change();
    });
}

// Checks to see if we are on the HIT: 
// Checks to see if we are on mark excellent HITs.
if ($("b:contains(excellent)").length){
    ProductRnR_Excellent();
}

function ProductRnR_Excellent(){
    $(":radio").on('change',function(){
        $(this).next(":contains(Excellent)").parent().parent().css("opacity", "1").css({ backgroundColor: "lightgreen", opacity: "1"});
        $(this).next(":contains(Not Excellent)").parent().parent().css("opacity", "1").css({ backgroundColor: "red", opacity: "1"});
        $(this).next(":contains(Image didn't load)").parent().parent().css({ backgroundColor: "", opacity: "0.1"});
    });
    $("input[value='Excellent']").prop("checked", true).change();
    $(".documentbox").click(function(e){e.preventDefault();});
    $('.documentbox').contextmenu( function() {
        return false;
    });
    $(".documentbox").mousedown(function(e){
        switch (e.which) {
            case 1:
                if($(this).find("input:radio:checked").next(":contains(Excellent):not(:contains('Not'))").length > 0){
                    $(this).find("input[value='Bad']").prop("checked", true).change();return false;
                }
                if($(this).find("input:radio:checked").next(":contains(Image didn't load)").length > 0){
                    $(this).find("input[value='Excellent']").prop("checked", true).change();return false;
                }
                if($(this).find("input:radio:checked").next(":contains(Not Excellent)").length > 0){
                    $(this).find("input[value='Excellent']").prop("checked", true).change();return false;
                }
                break;
            case 3:
                $(this).find("input[value='NoLoad']").prop("checked", true).change();return false;
                break;
        }
    });
    $("img").error(function(){
        $(this).parents(".documentbox").find("input[value='NoLoad']").prop("checked", true).change();
    });
}

// Enter will sunmit the HIT.
window.onkeydown = function(event) {
    if (event.keyCode === 13) {
        $("button[name='SubmitButton']").click();
    }
};