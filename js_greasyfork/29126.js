// ==UserScript==
// @name         Torn Flights
// @namespace    https://www.torn.com/profiles.php?XID=2029670
// @version      3.1
// @description  Changes the scenery during flights
// @author       Mike Pence
// @match        https://www.torn.com/index.php
// @match        http://www.torn.com/index.php
// @requires     https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/29126/Torn%20Flights.user.js
// @updateURL https://update.greasyfork.org/scripts/29126/Torn%20Flights.meta.js
// ==/UserScript==

//Beware of bad coding lol

$(document).ready(function(){
    //If on flight page
    if($(".clouds").length > 0 && $(".fade-left").length > 0 && $(".fade-right").length > 0 && $(".destination-title").length > 0 && $(".delimiter-999").length > 0){
        //Data
        var hidden = GM_getValue("hidden");
        if(hidden === null || hidden === "" || hidden === "undefined"){
            hidden = "false";
            GM_setValue("hidden", hidden);
        }
        var backgroundImage = GM_getValue("backgroundImage");
        if(backgroundImage === null || backgroundImage === "" || backgroundImage === "undefined"){
            backgroundImage = "space1";
            GM_setValue("backgroundImage", backgroundImage);
        }
        var planeImage = GM_getValue("planeImage");
        if(planeImage === null || planeImage === "" || planeImage === "undefined"){
            planeImage = "default";
            GM_setValue("planeImage", planeImage);
        }
        var planeDefaultImage = $("#plane").children().first().attr("src");
        GM_setValue("planeDefaultImage", planeDefaultImage);
        var color = GM_getValue("color");
        if(color === null || color === "" || color === "undefined"){
            color = "black";
            GM_setValue("color", color);
        }
        //Start UI
        //Div
        var div = $("<div id='MikePenceDiv'></div>");
        div.css("background-color", "white");
        // div.css("border", "2.5px solid black");
        div.css("position", "absolute");
        div.css("right", "0px");
        //Text
        var textP = $("<p id='MikePenceText'>Torn Flights - By <a href='https://www.torn.com/profiles.php?XID=2029670#/'>MikePence [2029670]</a></p>");
        textP.css("margin", "5px");
        //Hide
        var hideForm = $("<form></form>");
        var hideButton = $("<button id='MikePenceHideButton' type='button'></button>");
        //Background image
        var backgroundImageForm = $("<form id='MikePenceBackgroundImageForm'></form>");
        var backgroundImageText = $("<span>Background image:</span>");
        backgroundImageText.css("margin", "5px");
        var backgroundImageField = $("<input id='MikePenceBackgroundImageField' type='text' name='backgroundImage' value='" + backgroundImage + "'>");
        backgroundImageField.css("border", "1px solid grey");
        backgroundImageField.css("border-radius", "2.5px");
        backgroundImageField.css("margin", "5px");
        backgroundImageField.css("width", "200px");
        var backgroundImageDropdown = $("<select id='MikePenceBackgroundImageDropdown'></select>");
        backgroundImageDropdown.css("margin", "5px");
        var backgroundImageDropdownOption1 = $("<option value='custom' disabled>Custom</option>");
        var backgroundImageDropdownOption2 = $("<option value='space1'>Space 1</option>");
        var backgroundImageDropdownOption3 = $("<option value='space2'>Space 2</option>");
        var backgroundImageDropdownOption4 = $("<option value='city1'>City 1</option>");
        var backgroundImageDropdownOption5 = $("<option value='city2'>City 2</option>");
        var backgroundImageDropdownOption6 = $("<option value='sky'>Sky</option>");
        //Plane image
        var planeImageForm = $("<form id='MikePencePlaneImageForm'></form>");
        var planeImageText = $("<span>Plane image:</span>");
        planeImageText.css("margin", "5px");
        var planeImageField = $("<input id='MikePencePlaneImageField' type='text' name='planeImage' value='" + planeImage + "'>");
        planeImageField.css("border", "1px solid grey");
        planeImageField.css("border-radius", "2.5px");
        planeImageField.css("margin", "5px");
        planeImageField.css("width", "200px");
        var planeImageDropdown = $("<select id='MikePencePlaneImageDropdown'></select>");
        planeImageDropdown.css("margin", "5px");
        var planeImageDropdownOption1 = $("<option value='custom' disabled>Custom</option>");
        var planeImageDropdownOption2 = $("<option value='default'>Default</option>");
        var planeImageDropdownOption3 = $("<option value='superman'>Superman</option>");
        var planeImageDropdownOption4 = $("<option value='pence'>Pence</option>");
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
        div.append(textP);
        hideForm.append(hideButton);
        div.append(hideForm);
        backgroundImageForm.append(backgroundImageText);
        backgroundImageForm.append(backgroundImageField);
        backgroundImageForm.append(backgroundImageDropdown);
        backgroundImageDropdown.append(backgroundImageDropdownOption1);
        backgroundImageDropdown.append(backgroundImageDropdownOption2);
        backgroundImageDropdown.append(backgroundImageDropdownOption3);
        backgroundImageDropdown.append(backgroundImageDropdownOption4);
        backgroundImageDropdown.append(backgroundImageDropdownOption5);
        backgroundImageDropdown.append(backgroundImageDropdownOption6);
        div.append(backgroundImageForm);
        planeImageForm.append(planeImageText);
        planeImageForm.append(planeImageField);
        planeImageForm.append(planeImageDropdown);
        planeImageDropdown.append(planeImageDropdownOption1);
        planeImageDropdown.append(planeImageDropdownOption2);
        planeImageDropdown.append(planeImageDropdownOption3);
        planeImageDropdown.append(planeImageDropdownOption4);
        div.append(planeImageForm);
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
        //Background image
        var body = $("body");
        changeBackgroundImage(backgroundImage);
        body.css("background-size", "cover");
        body.css("-webkit-background-size", "cover");
        body.css("-moz-background-size", "cover");
        body.css("-o-background-size", "cover");
        body.css("background-repeat", "no-repeat");
        body.css("background-origin", "center");
        body.css("background-clip", "center");
        body.css("background-attachment", "fixed");
        //Plane image
        changePlaneImage(planeImage);
        //Color
        if(color === "black"){
            colorBlack();
        }
        else if(color === "white"){
            colorWhite();
        }
        //Background image dropdown
        if(backgroundImage === "space1"){
            backgroundImageDropdownOption2.prop("selected", true);
        }
        else if(backgroundImage === "space2"){
            backgroundImageDropdownOption3.prop("selected", true);
        }
        else if(backgroundImage === "city1"){
            backgroundImageDropdownOption4.prop("selected", true);
        }
        else if(backgroundImage === "city2"){
            backgroundImageDropdownOption5.prop("selected", true);
        }
        else if(backgroundImage === "sky"){
            backgroundImageDropdownOption6.prop("selected", true);
        }
        else{
            backgroundImageDropdownOption1.prop("selected", true);
        }
        //Plane image dropdown
        if(planeImage === "default"){
            planeImageDropdownOption2.prop("selected", true);
        }
        else if(planeImage === "superman"){
            planeImageDropdownOption3.prop("selected", true);
        }
        else if(planeImage === "pence"){
            planeImageDropdownOption4.prop("selected", true);
        }
        else{
            planeImageDropdownOption1.prop("selected", true);
        }
        //Other
        // $(".header-wrapper-bottom").remove();
        $(".page-head-delimiter").remove();
        $(".clouds").remove();
        $(".fade-left").remove();
        $(".fade-right").remove();
        $(".delimiter-999").remove();
    }
});
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
        $("#MikePenceText").hide();
        $("#MikePenceHideButton").html("Show");
        $("#MikePenceBackgroundImageForm").hide();
        $("#MikePencePlaneImageForm").hide();
        $("#MikePenceColorForm").hide();
        GM_setValue("hidden", true);
    }
    else{
        $("#MikePenceText").show();
        $("#MikePenceHideButton").html("Hide");
        $("#MikePenceBackgroundImageForm").show();
        $("#MikePencePlaneImageForm").show();
        $("#MikePenceColorForm").show();
        GM_setValue("hidden", false);
    }
}
//Change background image field
$("#MikePenceBackgroundImageField").on("change paste keyup", function(){
    var backgroundImage = $(this).val();
    changeBackgroundImage(backgroundImage);
    if(backgroundImage === "space1"){
        $("#MikePenceBackgroundImageDropdown").children("option[value='space1']").first().prop("selected", true);
    }
    else if(backgroundImage === "space2"){
        $("#MikePenceBackgroundImageDropdown").children("option[value='space2']").first().prop("selected", true);
    }
    else if(backgroundImage === "city1"){
        $("#MikePenceBackgroundImageDropdown").children("option[value='city1']").first().prop("selected", true);
    }
    else if(backgroundImage === "city2"){
        $("#MikePenceBackgroundImageDropdown").children("option[value='city2']").first().prop("selected", true);
    }
    else if(backgroundImage === "sky"){
        $("#MikePenceBackgroundImageDropdown").children("option[value='sky']").first().prop("selected", true);
    }
    else{
        $("#MikePenceBackgroundImageDropdown").children("option[value='custom']").first().prop("selected", true);
    }
});
//Click background image button
$("#MikePenceBackgroundImageDropdown").change(function(){
    var selected = $(this).val();
    var backgroundImage = GM_getValue("backgroundImage");
    if(selected === "custom"){
        changeBackgroundImage(backgroundImage);
    }
    else{
        changeBackgroundImage(selected);
    }
});
//Change plane image field
$("#MikePencePlaneImageField").on("change paste keyup", function(){
    var planeImage = $(this).val();
    changePlaneImage(planeImage);
    if(planeImage === "default"){
        $("#MikePencePlaneImageDropdown").children("option[value='default']").first().prop("selected", true);
    }
    else if(planeImage === "superman"){
        $("#MikePencePlaneImageDropdown").children("option[value='superman']").first().prop("selected", true);
    }
    else if(planeImage === "pence"){
        $("#MikePencePlaneImageDropdown").children("option[value='pence']").first().prop("selected", true);
    }
    else{
        $("#MikePencePlaneImageDropdown").children("option[value='custom']").first().prop("selected", true);
    }
});
//Click plane image button
$("#MikePencePlaneImageDropdown").change(function(){
    var selected = $(this).val();
    var planeImage = GM_getValue("planeImage");
    if(selected === "custom"){
        changePlaneImage(planeImage);
    }
    else{
        changePlaneImage(selected);
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
//Change background image
function changeBackgroundImage(backgroundImage){
    if(backgroundImage === "space1"){
        $("body").css("background-image", "url(http://wallpapershome.com/images/wallpapers/galaxy-3840x2160-space-stars-8910.jpg)");
    }
    else if(backgroundImage === "space2"){
        $("body").css("background-image", "url(https://wallpaperscraft.com/image/planet_light_spots_space_86643_1920x1080.jpg)");
    }
    else if(backgroundImage === "city1"){
        $("body").css("background-image", "url(https://i.imgur.com/WdAURtK.jpg)");
    }
    else if(backgroundImage === "city2"){
        $("body").css("background-image", "url(https://newevolutiondesigns.com/images/freebies/city-wallpaper-18.jpg)");
    }
    else if(backgroundImage === "sky"){
        $("body").css("background-image", "url(https://images6.alphacoders.com/353/thumb-1920-353272.jpg)");
    }
    else{
        $("body").css("background-image", "url(" + backgroundImage + ")");
    }
    GM_setValue("backgroundImage", backgroundImage);
    $("#MikePenceBackgroundImageField").val(backgroundImage);
}
//Change plane image
function changePlaneImage(planeImage){
    if(planeImage === "default"){
        $("#plane").children().first().attr("src", GM_getValue("planeDefaultImage"));
        $("#plane").children().first().attr("height", 300);
    }
    else if(planeImage === "superman"){
        $("#plane").children().first().attr("src", "https://media.giphy.com/media/2eh0ovwcQQK2I/giphy.gif");
        $("#plane").children().first().attr("height", 200);
    }
    else if(planeImage === "pence"){
        $("#plane").children().first().attr("src", "https://www.shitpostbot.com/img/sourceimages/mike-pence-head-png-5868809e5cdff.png");
        $("#plane").children().first().attr("height", 200);
    }
    else{
        $("#plane").children().first().attr("src", planeImage);
    }
    GM_setValue("planeImage", planeImage);
    $("#MikePencePlaneImageField").val(planeImage);
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