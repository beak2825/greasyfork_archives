// ==UserScript==
// @name         Torn Flights iOS
// @namespace    Torn Flights iOS
// @version      2.3.6.iOS
// @description  Changes the scenery during flights, tweaked for iOS
// @author       Mike Pence
// @modified     The_SamminAter
// @messagehide  KermodeBear
// @match        https://www.torn.com/index.php
// @match        http://www.torn.com/index.php
// @requires     https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/380569/Torn%20Flights%20iOS.user.js
// @updateURL https://update.greasyfork.org/scripts/380569/Torn%20Flights%20iOS.meta.js
// ==/UserScript==

$(document).ready(function(){
    //If on flight page
    if($(".clouds").length > 0 && $(".fade-left").length > 0 && $(".fade-right").length > 0 && $(".destination-title").length > 0 && $(".delimiter-999").length > 0){
        //Data
        var hidden = GM_getValue("hidden");
        if(hidden === null || hidden === "" || hidden === "undefined"){
            hidden = "false";
            GM_setValue("hidden", hidden);
        }
        var image = GM_getValue("image");
        if(image === null || image === "" || image === "undefined"){
            image = "Space 2";
            GM_setValue("image", image);
        }
        var color = GM_getValue("color");
        if(color === null || color === "" || color === "undefined"){
            color = "black";
            GM_setValue("color", color);
        }
        //Start UI
        //Background
        var div = $("<div id='MikePenceDiv'></div>");
        div.css("background-color", "white");
        div.css("border", "2.5px solid black");
        div.css("position", "absolute");
        div.css("right", "0px");
        //Hide
        var hideForm = $("<form></form>");
        var hideButton = $("<button id='MikePenceHideButton' type='button'></button>");
        //Image
        var imageForm = $("<form id='MikePenceImageForm'></form>");
        var imageText = $("<span>Image url:</span>");
        imageText.css("margin", "5px");
        var imageField = $("<input id='MikePenceImageField' type='text' name='image' value='" + image + "'>");
        imageField.css("border", "1px solid black");
        imageField.css("border-radius", "2.5px");
        imageField.css("margin", "5px");
        imageField.css("width", "200px");
        var imageDropdown = $("<select id='MikePenceImageDropdown'></select>");
        imageDropdown.css("margin", "5px");
//New order
        var imageDropdownOption6 = $("<option value='custom'>Custom</option>");
        var imageDropdownOption1 = $("<option value='Space 2'>Space 2</option>");
        var imageDropdownOption2 = $("<option value='Space 3'>Space 3</option>");
        var imageDropdownOption5 = $("<option value='Space 1'>Space 1</option>");
        var imageDropdownOption3 = $("<option value='City'>City</option>");
        var imageDropdownOption4 = $("<option value='Sky'>Sky</option>");
        //Color
        var colorForm = $("<form id='MikePenceColorForm'></form>");
        var colorText = $("<span>Text color:&nbsp;</span>");
        colorText.css("margin", "5px");
        var colorRadioBlack = $("<input id='MikePenceColorRadioBlack' type='radio' name='color' value='black'>");
        colorRadioBlack.css("margin", "5px");
        var colorTextBlack = $("<span>&nbsp;Black&nbsp;&nbsp;&nbsp;</span>");
        colorTextBlack.css("margin", "5px");
        var colorRadioWhite = $("<input id='MikePenceColorRadioWhite' type='radio' name='color' value='white'>");
        colorRadioWhite.css("margin", "5px");
        var colorTextWhite = $("<span>&nbsp;White&nbsp;&nbsp;&nbsp;</span>");
        colorTextWhite.css("margin", "5px");
        if(color == "white"){
            colorRadioWhite.attr("checked", "checked");
        }
        else if(color == "black"){
            colorRadioBlack.attr("checked", "checked");
        }
        //Add
        hideForm.append(hideButton);
        div.append(hideForm);
        imageForm.append(imageText);
        imageForm.append(imageField);
        imageForm.append(imageDropdown);
        imageDropdown.append(imageDropdownOption1);
        imageDropdown.append(imageDropdownOption2);
        imageDropdown.append(imageDropdownOption3);
        imageDropdown.append(imageDropdownOption4);
        imageDropdown.append(imageDropdownOption5);
        div.append(imageForm);
        colorForm.append(colorText);
        colorForm.append(colorRadioBlack);
        colorForm.append(colorTextBlack);
        colorForm.append(colorRadioWhite);
        colorForm.append(colorTextWhite);
        div.append(colorForm);
        $(".stage").prepend(div);
        //End UI
        //Hide
        changeHideButton(GM_getValue("hidden"));
        //Image
        var body = $("body");
        changeImage(image);
        body.css("background-size", "cover");
        body.css("-webkit-background-size", "cover");
        body.css("-moz-background-size", "cover");
        body.css("-o-background-size", "cover");
        body.css("background-repeat", "no-repeat");
        body.css("background-origin", "center");
        body.css("background-clip", "center");
        body.css("background-attachment", "fixed");
        //Color
        if(color === "black"){
            colorBlack();
        }
        else if(color === "white"){
            colorWhite();
        }
        //Dropdown
        if(image === "Space 2"){
            imageDropdownOption1.prop("selected", true);
        }
        else if(image === "Space 3"){
            imageDropdownOption2.prop("selected", true);
        }
        else if(image === "City"){
            imageDropdownOption3.prop("selected", true);
        }
        else if(image === "Sky"){
            imageDropdownOption4.prop("selected", true);
        }
        else if(image === "Space 1"){
            imageDropdownOption5.prop("selected", true);
        }
        else{
            imageDropdownOption6.prop("selected", true);
        }
        //Other
        $(".header-wrapper-bottom").remove();
        $(".page-head-delimiter").remove();
        $(".clouds").remove();
        $(".fade-left").remove();
        $(".fade-right").remove();
        $(".delimiter-999").remove();
    }
});

//Hide the travel message
// @name         messagehide
// @version      1
// @author       KermodeBear
(function() {
    'use strict';
    var element = document.getElementsByClassName("popup-info")[0];
    if (element) {
        element.parentNode.removeChild(element);
    }
})();

//Functions
//Click hide button
$("#MikePenceHideButton").click(function(){
    var hidden = GM_getValue("hidden");
    if(hidden){
        changeHideButton(false);
    }
    else{
        changeHideButton(true);
    }
});
//Change hide button
function changeHideButton(hidden){
    if(hidden){
        $("#MikePenceHideButton").html("Show");
        $("#MikePenceImageForm").hide();
        $("#MikePenceColorForm").hide();
        GM_setValue("hidden", true);
    }
    else{
        $("#MikePenceHideButton").html("Hide");
        $("#MikePenceImageForm").show();
        $("#MikePenceColorForm").show();
        GM_setValue("hidden", false);
    }
}
//Change image field
$("#MikePenceImageField").on("change paste keyup", function(){
    changeImage($(this).val());
});
//Click image button
$("#MikePenceImageDropdown").change(function(){
    var selected = $(this).val();
    var image = GM_getValue("image");
    if(selected === "custom"){
        changeImage(image);
    }
    else{
        changeImage(selected);
    }
});
//Change color
$("input[type=radio][name=color]").change(function(){
    if($(this).val() == "white"){
        colorWhite();
        GM_setValue("color", "white");
    }
    else{
        colorBlack();
        GM_setValue("color", "black");
    }
});
//Change image
function changeImage(image){
    if(image === "Space 1"){
        $("body").css("background-image", "url(http://wallpapershome.com/images/wallpapers/galaxy-3840x2160-space-stars-8910.jpg)");
    }
    else if(image === "Space 2"){
        $("body").css("background-image", "url(https://wallpaperscraft.com/image/planet_light_spots_space_86643_1920x1080.jpg)");
    }
    else if(image === "Space 3"){
        $("body").css("background-image", "url(http://wallpapercave.com/wp/rhs5EQW.jpg)");
    }
    else if(image === "City"){
        $("body").css("background-image", "url(https://newevolutiondesigns.com/images/freebies/city-wallpaper-18.jpg)");
    }
    else if(image === "Sky"){
        $("body").css("background-image", "url(https://images6.alphacoders.com/353/thumb-1920-353272.jpg)");
    }
    else{
        $("body").css("background-image", "url(" + image + ")");
    }
    GM_setValue("image", image);
    $("#MikePenceImageField").val(image);
}
//Change color to black
function colorBlack(){
    $("#skip-to-content").css("color", "black");
    $(".content-title").find("h4").css("color", "black");
    $(".server-time").css("color", "black");
    $(".server-date").css("color", "black");
    $(".connect-title").css("color", "black");
    $(".server-title").css("color", "black");
    $(".events").css("color", "black");
    $(".laptop").css("color", "black");
    $(".recruit-citizens").css("color", "black");
    $(".logout").css("color", "black");
    $(".destination-title").css("color", "black");
}
//Change color to white
function colorWhite(){
    $("#skip-to-content").css("color", "white");
    $(".content-title").find("h4").css("color", "white");
    $(".server-time").css("color", "white");
    $(".server-date").css("color", "white");
    $(".connect-title").css("color", "white");
    $(".server-title").css("color", "white");
    $(".events").css("color", "white");
    $(".laptop").css("color", "white");
    $(".recruit-citizens").css("color", "white");
    $(".logout").css("color", "white");
    $(".destination-title").css("color", "white");
}