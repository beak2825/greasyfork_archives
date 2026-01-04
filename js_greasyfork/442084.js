// ==UserScript==
// @name     			Next OnePiece Episode
// @description 	    The script adds next and previous episodes buttons to the anime israel website.
// @version  			3.0
// @include  			https://animeisrael.website/watch/fulllink/op/*
// @require 			https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @author 				Popick
// @license       Etay S.
// @namespace https://greasyfork.org/users/892638
// @downloadURL https://update.greasyfork.org/scripts/442084/Next%20OnePiece%20Episode.user.js
// @updateURL https://update.greasyfork.org/scripts/442084/Next%20OnePiece%20Episode.meta.js
// ==/UserScript==


var testDiv = document.getElementsByClassName("content container");
var strEpsideNumber = (window.location.href).slice(57,-4);
var intNextEpisodeNumber = parseInt(strEpsideNumber)+1;
var intPreEpisodeNumber = parseInt(strEpsideNumber)-1;
const fillersList = [54, 55, 56, 57, 58, 59, 60, 61, 98, 99, 101, 102, 131, 132,
                     134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 196, 197, 198, 199,
                     201, 202, 203, 204, 205, 206, 220, 221, 222, 223, 224, 225, 226, 279,
                     281, 282, 283, 291, 292, 303, 317, 318, 319, 326, 327, 328, 329, 330,
                     332, 333, 334, 335, 336, 382, 383, 384, 406, 407, 426, 427, 428, 429,
                     458, 492, 493, 494, 495, 496, 497, 498, 499, 500, 501, 502, 503, 504,
                     506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519,
                     521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 532, 533, 534,
                     536, 537, 538, 539, 540, 541, 542, 575, 576, 577, 578, 590, 626, 627,
                     747, 748, 749, 750, 775, 780, 781, 782, 807, 881, 895, 896];



function goNext(){
  window.open("https://animeisrael.website/watch/fulllink/op/fulllinkop-"+intNextEpisodeNumber+".php","_self"); 
}

function goNextCanon(){
    var nextCanon = intNextEpisodeNumber;
    while (fillersList.includes(nextCanon)){
        nextCanon += 1;
    }
    window.open("https://animeisrael.website/watch/fulllink/op/fulllinkop-"+nextCanon+".php","_self");
}

function openWiki(){
  window.open("https://onepiece.fandom.com/wiki/Episode_"+strEpsideNumber,"_blank"); 
}

function goBack(){
  window.open("https://animeisrael.website/watch/fulllink/op/fulllinkop-"+intPreEpisodeNumber+".php","_self"); 
}



$(testDiv).append('<button id="nextBtn" >Next Episode ('+intNextEpisodeNumber+')</button><button id="backBtn" >Previous Episode ('+intPreEpisodeNumber+')</button>');
$(testDiv).append('<button id="nextCanonBtn" >Next Canon</button>');
$(testDiv).append('<button id="openWikiBtn" >Open Wiki ('+strEpsideNumber+')</button>');


$("#nextBtn").css({
    "float":"right",
    "display": "inline-block",
    "border": "5px solid white",
    "text-align": "center",
    "cursor": "pointer",
    "padding": "0px 16px",
    "border-radius": "2px",
    "min-width": "80px",
    "height": "32px",
    "background-color": "rgb(0, 120, 212)",
    "color": "rgb(255, 255, 255)",
    "font-size": "14px",
    "font-weight": "400",
    "box-sizing": "border-box",
    "border": "1px solid rgb(0, 120, 212)",
});


$("#backBtn").css({
    "float":"left",
    "display": "inline-block",
    "border": "5px solid white",
    "text-align": "center",
    "cursor": "pointer",
    "padding": "0px 16px",
    "border-radius": "2px",
    "min-width": "80px",
    "height": "32px",
    "background-color": "rgb(0, 120, 212)",
    "color": "rgb(255, 255, 255)",
    "font-size": "14px",
    "font-weight": "400",
    "box-sizing": "border-box",
    "border": "1px solid rgb(0, 120, 212)",
});

$("#nextCanonBtn").css({
    "float":"right",
  	"margin-right":"20px",
    "display": "inline-block",
    "border": "5px solid white",
    "text-align": "center",
    "cursor": "pointer",
    "padding": "0px 16px",
    "border-radius": "2px",
    "min-width": "80px",
    "height": "32px",
    "background-color": "rgb(0, 120, 212)",
    "color": "rgb(255, 255, 255)",
    "font-size": "14px",
    "font-weight": "400",
    "box-sizing": "border-box",
    "border": "1px solid rgb(0, 120, 212)",
});

$("#openWikiBtn").css({
    "float":"left",
  	"margin-left":"20px",
    "display": "inline-block",
    "border": "5px solid white",
    "text-align": "center",
    "cursor": "pointer",
    "padding": "0px 16px",
    "border-radius": "2px",
    "min-width": "80px",
    "height": "32px",
    "background-color": "rgb(0, 120, 212)",
    "color": "rgb(255, 255, 255)",
    "font-size": "14px",
    "font-weight": "400",
    "box-sizing": "border-box",
    "border": "1px solid rgb(0, 120, 212)",
});

	         
        
if (fillersList.includes(intNextEpisodeNumber)){
    $("#nextBtn").css("color","red");
}

document.getElementById("nextBtn").onclick = goNext;
document.getElementById("backBtn").onclick = goBack;
document.getElementById("nextCanonBtn").onclick = goNextCanon;
document.getElementById("openWikiBtn").onclick = openWiki;






