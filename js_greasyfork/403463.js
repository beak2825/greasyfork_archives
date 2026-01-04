// ==UserScript==
// @name         DeviantArt Eclipse - Extras
// @namespace    http://tampermonkey.net/
// @description  Redesign
// @author       Isi-Daddy
// @include      https://www.deviantart.com/
// @include      https://www.deviantart.com/*
// @version      1.1.19
// @grant GM_getValue
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012

// @downloadURL https://update.greasyfork.org/scripts/403463/DeviantArt%20Eclipse%20-%20Extras.user.js
// @updateURL https://update.greasyfork.org/scripts/403463/DeviantArt%20Eclipse%20-%20Extras.meta.js
// ==/UserScript==

/* timestamp*//*
waitForKeyElements (
    "time",
    klassentest
);

function klassentest (subj) {
    $("._3j4Pa").addClass("button");
    $(".button").css({
        "height" : "100px",
        "width" : "100px",
        "background" : "none"
    });

    var time = subj.attr("datetime").replace("T", " ").slice(0, -5);
    subj.append("<div class='time'>" + time + "</div>");
    subj.append("<div class='after'></div>");

    $(".time").css({
        "visibility" : "hidden",
        "position" : "absolute",
        "color" : "#d6ded4",
        "top": "-26px",
        "border": "1px solid #5c5c5c",
        "padding": "3px 10px",
        "margin-left": "-20px",
        "background" : "#475c4d"
    });

    $(".after").css({
        "visibility":"hidden",
        "width": "0",
        "height": "0",
        "border-left": "5px solid transparent",
        "border-right": "5px solid transparent",
        "border-top": "5px solid #475c4d",
        "position" : "absolute",
        "top": "-5px",
        "margin-left": "30px"
    });

    subj.mouseenter(function(event)
                    {
        //event.stopPropagation()
        $(this).children().addClass("show");
        $(".time.show, .after.show").css({"visibility": "visible"});
    }).mouseleave(function(event){
        //event.stopPropagation()
        $(this).children().removeClass("show");
        $(".time,.after").css({"visibility": "hidden"});
    });
}
*/

//feedback
var noteCount = '';
if($("button._1qPjE._1V7e9").find("span").hasClass("_3i5Bn")){
    noteCount = '<span class="_3i5Bn">' + $("div._2u-H1._28mNT._2ZwRg span._3i5Bn").text()+  '</span>' ;
}
$("button._1qPjE._1V7e9").remove();
$("div._2u-H1._28mNT._2ZwRg").append('<a class="_1qPjE _1V7e9" href="https://www.deviantart.com/notifications/notes/"><span><span class="_2eF0v _2FcoN _3Qsx6"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M19.914 4a1 1 0 011 1v12.586a1 1 0 01-.293.707l-1.414 1.414A1 1 0 0118.5 20h-15a.5.5 0 01-.5-.5 1 1 0 01.4-.8L5 17.5l.02-11.089a1 1 0 01.29-.703l1.396-1.411A1 1 0 017.417 4h12.497zM9 11a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2z"></path></svg></span>'+noteCount+'<span class="_2_n00">Chat</span></span></a>');


//chat
var noteCountChat = '';
if($("button._3Vw-L._1RSIk").find("span").hasClass("_1ez3c")){
    noteCountChat = '<span class="_1ez3c">' + $(".XWyfm._3KrWg._3NUNO span._1ez3c").text()+  '</span>' ;
}
$("button._3Vw-L._1RSIk").remove();
$("div.XWyfm._3KrWg._3NUNO").append('<a class="_3Vw-L _1RSIk" href="https://www.deviantart.com/notifications/notes/"><span><span class="_1bkAn _36ZlA _1n21K"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M19.914 4a1 1 0 011 1v12.586a1 1 0 01-.293.707l-1.414 1.414A1 1 0 0118.5 20h-15a.5.5 0 01-.5-.5 1 1 0 01.4-.8L5 17.5l.02-11.089a1 1 0 01.29-.703l1.396-1.411A1 1 0 017.417 4h12.497zM9 11a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2z"></path></svg></span>'+noteCountChat+'<span class="zMQNN">Chat</span></span></a>');
var theColorIs2 = $('.iRyVV svg').css("color");
$("._2Ae1S._2JjnE._2fqBI svg").css("fill", theColorIs2);
$("._2Ae1S._2JjnE._2fqBI").css({
      "margin-bottom": "-10px"
    });

//profile
var noteCountProfile = '';
if($("button._1lJ-D._3MIsm").find("span").hasClass("_3tPpy")){
    noteCountProfile = '<span class="_3tPpy">' + $("._3GThX.MAP1J._2cZwH span._3tPpy").text()+  '</span>' ;
}
$("button._1lJ-D._3MIsm").remove();
$("div._3GThX.MAP1J._2cZwH").append('<a class="_1lJ-D _3MIsm" href="https://www.deviantart.com/notifications/notes/"><span><span class="pMlS8 _3DiH6 _2sPW1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M19.914 4a1 1 0 011 1v12.586a1 1 0 01-.293.707l-1.414 1.414A1 1 0 0118.5 20h-15a.5.5 0 01-.5-.5 1 1 0 01.4-.8L5 17.5l.02-11.089a1 1 0 01.29-.703l1.396-1.411A1 1 0 017.417 4h12.497zM9 11a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2z"></path></svg></span>'+noteCountProfile+'<span class="_2UWhz">Chat</span></span></a>');
var theColorIs3 = $('._21ei1 svg').css("color");
/*$("._3HH04._3s0_v.YU6Gg svg").css("fill", theColorIs3);
$("._3HH04._3s0_v.YU6Gg").css({
      "margin-bottom": "-10px"
    });*/

//Button  Chat on profile
$("button._3vg-L._1fw_p._2iY-h").remove();
var user = top.location.pathname.substring(1)
$("div.-B55x").append('<a class="_3vg-L _1fw_p _2iY-h" href="https://www.deviantart.com/notifications/notes/#to='+user.split('/')[0]+'"><span>Note</span></a>');
$("a._3vg-L._1fw_p._2iY-h").css({
    "text-align": "center",
    "position": "relative"
});
$( "a._3vg-L._1fw_p._2iY-h" ).hover(
  function() {
    $( this ).css({"color": "#00c787"});
  }, function() {
    $( this ).css({"color": "inherit"});
  }
);
$("a._3vg-L._1fw_p._2iY-h span").css({
    "font-weight": "bold",
    "font-size": "14px",
    "font-family": "inherit",
    "position": "absolute",
    "right": "37px",
    "border-left": "1px solid #d1d9d0",
    "padding": "18px 11px 18px 42px"
    });

//pictures
var noteCountPicture = '';
if($("button._21OYk._6lRyf").find("span").hasClass("_22eC3")){
    noteCountPicture = '<span class="_22eC3">' + $("._1G6s5._31Gyh.NYiDj span._22eC3").text()+  '</span>' ;
}
$("button._21OYk._6lRyf").remove();
$("div._1G6s5._31Gyh.NYiDj").append('<a class="_21OYk _6lRyf" href="https://www.deviantart.com/notifications/notes/"><span><span class="_141Tf esWyG fBTLZ"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M19.914 4a1 1 0 011 1v12.586a1 1 0 01-.293.707l-1.414 1.414A1 1 0 0118.5 20h-15a.5.5 0 01-.5-.5 1 1 0 01.4-.8L5 17.5l.02-11.089a1 1 0 01.29-.703l1.396-1.411A1 1 0 017.417 4h12.497zM9 11a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2z"></path></svg></span>'+noteCountPicture+'<span class="_2NYr-">Chat</span></span>');
/*var theColorIs4 = $('._1jxju svg').css("color");
$("._1jxju._1UM_Z.ysYD1 svg").css("fill", theColorIs4);*/


//generl da
var noteCountdA = '';
if($("button._3BYRx._14hFt").find("span").hasClass("xgEVQ")){
    noteCountdA = '<span class="xgEVQ">' + $("._2xoap._1iYeb.EnfXJ span.xgEVQ").text()+  '</span>' ;
}
$("button._3BYRx._14hFt").remove();
$("div._2xoap._1iYeb.EnfXJ").append('<a class="_3BYRx _14hFt" href="https://www.deviantart.com/notifications/notes/"><span><span class="_2FP2V _37ThK _2LwSX"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M19.914 4a1 1 0 011 1v12.586a1 1 0 01-.293.707l-1.414 1.414A1 1 0 0118.5 20h-15a.5.5 0 01-.5-.5 1 1 0 01.4-.8L5 17.5l.02-11.089a1 1 0 01.29-.703l1.396-1.411A1 1 0 017.417 4h12.497zM9 11a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2z"></path></svg></span>'+noteCountdA+'<span class="_1Tbmy">Chat</span></span>');



//Chat schrift
$("span ._2_n00").remove();
$("span ._2UWhz").remove();
$("span ._2NYr-").remove();
$("span ._1Tbmy").remove();
