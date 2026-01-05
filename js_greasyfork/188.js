// ==UserScript==
// @name        Side-Reddit
// @version    1.30
// @description Simple side-bar toggle for Reddit
// @include        http://*.reddit.com/*
// @include        http://reddit.com/*
// @include        https://*.reddit.com/*
// @include        https://reddit.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.0/jquery.cookie.min.js
// @grant       GM_addStyle
// @icon        https://monkeyguts.com/icon/141.png
// @namespace https://greasyfork.org/users/59
// @downloadURL https://update.greasyfork.org/scripts/188/Side-Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/188/Side-Reddit.meta.js
// ==/UserScript==

$(document).ready(function () {
  
var showCheck1 = 0;
var pTop = $('.content').css("padding-top");
var cmRight = $('.content').css("margin-right");
var careaRight = $('.commentarea').css("margin-right");
var cMargin = $('.content').css("margin");
var mTop = $('.content').css("margin-top");
var smRight = $('#siteTable').css("margin-right");
var spRight = $('#siteTable').css("padding-right");
var tmRight = $('.thing').css("margin-right");
var zNode1       = document.createElement ('div');
var foo = document.getElementById(".expando-button");    
var percent;
var lastScrollTop = 0;
    
    $(window).scroll(function(event){
   var st = $(this).scrollTop();
   if (st > lastScrollTop){
       $('#myContainer1').css("top", "0");
   } else if (st === 0) {
      $('#myContainer1').css("top", "");
       lastScrollTop = st;
   }
});

zNode1.innerHTML = '<button id="myButton1" type="button">' + '‡</button>';

zNode1.setAttribute ('id', 'myContainer1');
document.getElementById('header-bottom-left').appendChild(zNode1);
    
    $(function () {
    $(".md").css("max-width", "100%");
      $(".commentarea").css("margin-right", "0px");
    });
        
    $("div.expando-button").click(function(){
        $(".md").css("max-width", "100%");
      $(".commentarea").css("margin-right", "0px"); 
    });


//--- Activate the newly added button.
document.getElementById ("myButton1").addEventListener (
    "click", ButtonClickAction, false
);      
    
function ButtonClickAction (zEvent) {
    
if(showCheck1 == 1) {
	   $('.side').show(100, "swing");
       $("#siteTable").each(function () {
         this.style.setProperty("margin-right", "", "important");
         this.style.setProperty("margin-right", "", "important");
});
       $("#siteTable").each(function () {
         this.style.setProperty("margin-right", smRight);
           this.style.setProperty("margin-right", spRight);
});
       $(".thing").each(function () {
         this.style.setProperty("margin-right", "", "important");
           this.style.setProperty("width", "");
});
       $(".thing").each(function () {
         this.style.setProperty("margin-right", "");
});
       $(".content").each(function () {
         //this.style.setProperty("padding-top", "", "important");
         this.style.setProperty("margin-right", "", "important");
         this.style.setProperty("margin-top", "");
         this.style.setProperty("border-right", "");  
});
       $("#myButton1").fadeTo("fast", 1).delay(300).css({"color":"red"});
       showCheck1 = 0; 
       $.cookie("check", 1, { expires: 7, path: "/" });
       $(".md").css("max-width", "");
      $(".commentarea").css("margin-right", careaRight);
    
    if($(".expando").css("display") == "block") {
        $(".md").css("max-width", "");
        $(".commentarea").css("margin-right", careaRight);
    }
    else{
    }
}
else if(showCheck1 === 0) {
   
       $('.side').hide(100, "swing");
       $("#siteTable").each(function () {
         this.style.setProperty("margin-right", "auto", "important");
           this.style.setProperty("padding-right", "5px", "important");
});
    // alert($(".link").css("width"));
    percent = $(".link").width() / $(window).width() * 100;
    // alert(percent);
    if(percent > 97 || percent === 0){
       }
    else {
       $(".thing").each(function () {
           this.style.setProperty("width", "99%");
});
       }
    if($(".content").css("border-right") === 0){
       }
    else {
       $(".content").each(function () {
           this.style.setProperty("border-right", "0");
});
    }
       $(".thing").each(function () {
         this.style.setProperty("margin-right", "auto", "important");
});
       $(".content").each(function () {
         //this.style.setProperty("padding-top", "1px", "important");
         this.style.setProperty("margin-right", "5px", "important");
         this.style.setProperty("margin-top", "7px", "important");
});
       $("#myButton1").fadeTo("fast", 0.5).delay(300).css({"color":"blue"});
       showCheck1 = 1;  
       $.cookie("check", 2, { expires: 7, path: "/" });
       $(".md").css("max-width", "100%");
      $(".commentarea").css("margin-right", "0px");
    if($(".expando").css("display") == "block") {
        $(".md").css("max-width", "100%");
      $(".commentarea").css("margin-right", "0px");
    }
    else{
    }
}
else {
    console.log("Error with Side-Reddit");
}
       
}
    
if($.cookie("check") == 1) {
	   $('.side').show(100, "swing");
       $("#siteTable").each(function () {
         this.style.setProperty("margin-right", "", "important");
         this.style.setProperty("margin-right", "", "important");
});
       $("#siteTable").each(function () {
         this.style.setProperty("margin-right", smRight);
           this.style.setProperty("margin-right", spRight);
});
       $(".thing").each(function () {
         this.style.setProperty("margin-right", "", "important");
           this.style.setProperty("width", "");
});
       $(".thing").each(function () {
         this.style.setProperty("margin-right", "");
});
       $(".content").each(function () {
         //this.style.setProperty("padding-top", "", "important");
         this.style.setProperty("margin-right", "", "important");
         this.style.setProperty("margin-top", "");
         this.style.setProperty("border-right", "");
});
       $("#myButton1").fadeTo("fast", 1).delay(300).css({"color":"red"});
       showCheck1 = 0; 
       $(".md").css("max-width", "");
       $(".commentarea").css("margin-right", careaRight);
    if($(".expando").css("display") == "block") {
        $(".md").css("max-width", "");
        $(".commentarea").css("margin-right", careaRight);
    }
    else{
    }
      
}
else if($.cookie("check") == 2) {
       $('.side').hide(100, "swing");
       $("#siteTable").each(function () {
         this.style.setProperty("margin-right", "auto", "important");
           this.style.setProperty("padding-right", "5px", "important");
});
    percent = $(".link").width() / $(window).width() * 100;
    // alert(percent);
    if(percent > 97 || percent === 0){
       }
    else {
       $(".thing").each(function () {
           this.style.setProperty("width", "99%");
});
       }
    
    if($(".content").css("border-right") === 0){
       }
    else {
       $(".content").each(function () {
           this.style.setProperty("border-right", "0");
});
    }
       $(".thing").each(function () {
         this.style.setProperty("margin-right", "auto", "important");
         // this.style.setProperty("width", "100%");
});
       $(".content").each(function () {
         //this.style.setProperty("padding-top", "1px", "important");
         this.style.setProperty("margin-right", "5px", "important");
         this.style.setProperty("margin-top", "7px", "important");
});
       $("#myButton1").fadeTo("fast", 0.5).delay(300).css({"color":"blue"});
       showCheck1 = 1;
       $(".md").css("max-width", "100%");
       $(".commentarea").css("margin-right", "0px");
    if($(".expando").css("display") == "block") {
        $(".md").css("max-width", "100%");
      $(".commentarea").css("margin-right", "0px");
    }
}
else {
    console.log("Error with Side-Reddit");
}
  
//--- Style our newly added elements using CSS.
GM_addStyle ( multilineStr ( function () {/*!
    #myContainer1 {
        position:               fixed;
        left:	 				0;
        font-size:              1px;
        border:                 0px inset black;
        margin:                 0px;
        opacity:                10.0;
        z-index:                99999;
        padding:                0px 0px;
    }
    #myButton1 {
        cursor:                 pointer;
       	background: 			solid;
        background-color:		#cee3f8;
    	border: 				none !important;
        opacity:				8;
        color:					red;
        font-weight:			bold;
    }
    #myContainer1 p {
        color:                  purple;
        background:             white;
    }
*/} ) );

function multilineStr (dummyFunc) {
    var str = dummyFunc.toString ();
    str     = str.replace (/^[^\/]+\/\*!?/, '') // Strip function () { /*!
            .replace (/\s*\*\/\s*\}\s*$/, '')   // Strip */ }
            .replace (/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
            ;
    return str;
}
    
  //
});
