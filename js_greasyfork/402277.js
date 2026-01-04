// ==UserScript==
// @name         Starve.io Map
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  try to take over the world!
// @author       Helpy
// @match        *://starve.io/*
// @grant        none
// @include      http://stackoverflow.com/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js


// @downloadURL https://update.greasyfork.org/scripts/402277/Starveio%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/402277/Starveio%20Map.meta.js
// ==/UserScript==

var version = ("=-Starve.io-=");



function pretty_time_string(num) {
    return ( num < 10 ? "0" : "" ) + num;
  }


    jQuery(document).ready(function(){
    document.title = ('' + " " + version);
    jQuery("a[href='https://iogames.space']").hide();

    jQuery('#nickname_input').css({"color": "","font-size":"24","background-color":""});
    jQuery('#chat_input').css({"color": "","font-size":"20","background-color":""});
    jQuery('#game_canvas').css("image-rendering","initial");
    jQuery('#trevda').css("visibility","hidden");
    jQuery("#loading").css({"background-color": "","color":""});
    jQuery("body").on("contextmenu",function(e){
    return false;
});

    jQuery("body").append ('<img draggable="false" id="myNewImage" border="0" src="https://cdn.discordapp.com/attachments/691584212288929854/692082785493712926/mapv2.png">')
    jQuery("body").append ('<p id="hrs"></p>')
    jQuery('body').append('<p id="ratata"></p>');
    jQuery('body').append('<p id="author"><a target="_blank" href=""></a></p>');

    jQuery("#author").animate({right: '55px'}).css({
        cursor: "url(http://starve.io/img/cursor1.png), pointer",
        boxSizing: "border-box",
        borderRadius: "8px",
        backgroundColor: "#9b2a2d",
        boxShadow: "0px 5px #5f2a2d",
        paddingLeft: "10px",
        paddingRight: "10px",
        webkitTouchCallout: "none",
        webkitUserSelect: "none",
        khtmlUserSelect: "none",
        mozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
        position: "absolute",
        color:"#FFFFFF",
        fontFamily:"Baloo Paaji",
        position: "absolute",
        right:"55px",
        bottom:"30px",

    });

    jQuery("#myNewImage").animate({right: '10px'}).css({
        cursor: "url(http://starve.io/img/cursor0.png), default",
        opacity: "90%",
        imageRendering: "initial",
        webkitTouchCallout: "none",
        webkitUserSelect: "none",
        khtmlUserSelect: "none",
        mozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
        position: "absolute",
        right:"10px",
        bottom:"130px",
        width: "180px",
        height: "180px",
    });

    jQuery("#ratata").animate({right: '43px'}).css({
        cursor: "url(http://starve.io/img/cursor0.png), default",
        boxSizing: "border-box",
        borderRadius: "8px",
        backgroundColor: "#9e4e12",
        boxShadow: "0px 5px #593109",
        paddingLeft: "10px",
        paddingRight: "10px",
        webkitTouchCallout: "none",
        webkitUserSelect: "none",
        khtmlUserSelect: "none",
        mozUserSelect: "none",
        msUserSelect: "none",
        userSelect: "none",
        position: "absolute",
        color:"#FFFFFF",
        fontFamily:"Arial Black",
        position: "absolute",
        right:"45px",
        bottom:"80px",

    });
});