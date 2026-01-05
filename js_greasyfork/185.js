// ==UserScript==
// @name       Monster Twitch
// @author	   Tracerman
// @version    2.792
// @description  Stretches stream to max width and hides left navigation bar with an Monster toggle that's to the right of the volume rocker
// @include        http://*.twitch.tv/*
// @include        http://twitch.tv/*
// @exclude		   http://www.twitch.tv/*/chat?popout=
// @exclude		   http://www.twitch.tv/*/popout
// @exclude        http://www.twitch.tv/*/dashboard
// @exclude        http://www.twitch.tv/inbox*
// @exclude        http://www.twitch.tv/subscriptions*
// @exclude        http://store.twitch.tv
// @exclude        http://api.twitch.tv/*
// @exclude        https://api.twitch.tv/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @grant       GM_addStyle
// @copyright  2014  tracerman
// @icon        https://monkeyguts.com//icon/104.png
// @run-at		document-end
// @namespace http://enut.co/dev
// @downloadURL https://update.greasyfork.org/scripts/185/Monster%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/185/Monster%20Twitch.meta.js
// ==/UserScript==

function pReset () {
    console.log("MT: Script deactivated");
    var showCheck3 = 1;
    if(showCheck3 == 1) { 
    $("#channel").removeAttr('style');
    $("#main_col").children(".tse-scroll-content").first().css("position", "");
    $("#chat_line_list").each(function () {
      this.style.setProperty("padding", chatLLPadding, "important");
});
    $("#chat_line_list").each(function () {
      this.style.setProperty("padding", chatLLPadding);
});
    $("#left_col").show(300, "swing");
    $(".editable").show(300, "swing");
    $("#new-user-prompt").show(300, "swing");
    //--- Old Panels Handler $("#channel_panels_contain").show(300, "swing");
    $(".stats-and-actions").show(300, "swing");
    $(".resizer").show(300, "swing");
    $("#right_close").show(300, "swing"); 
    $("#right_col").each(function () {
       this.style.setProperty("width", "", "important");
});
    $("#right_col").each(function () {
       this.style.setProperty("width", "340px");
});
    $("#main_col").removeAttr('style');
    
    $("#main_col").each(function () {
       this.style.setProperty("margin-left", "", "important");
});
    $("#main_col").css("margin-left","").css("width", zWidth);
	$("#main_col").css("width", "");
    $("#main_col").each(function () {
       //--- this.style.setProperty("width", "", "important");
});
    
    if (cDisp == "block") {
        
    $("#main_col").each(function () {
      //--- this.style.setProperty("margin-right", "0px");
});
    }
    
    else {
        $("#main_col").each(function () {
       this.style.setProperty("width", "");
        this.style.setProperty("margin-right", "0px");
});
        
    }
    
   if(zWidth >= 1) {
    
       $("#main_col").each(function () {
        //--- this.style.setProperty("width", "");
          this.style.setProperty("margin-right", "");
}); 
       
    }
    else {       
        
        //--- $("#main_col").css("width", "");
        
    }
    $(".dynamic-player").removeAttr("style");
    $("#player").each(function () {
      this.style.setProperty("position", "relative");
});
    $("#content").each(function () {
        this.style.setProperty("width", "", "important");
});
    $("#content").each(function () {
        this.style.setProperty("width", conWidth);
});
    $("#chat").each(function () {
       this.style.setProperty("width", "", "important");
});
    $("#chat").each(function () {
       this.style.setProperty("width", chatHeight);
});
    $("#chat_line").each(function () {
       this.style.setProperty("width", "", "important");
});
    $("#chat_line").each(function () {
       this.style.setProperty("width", chatLHeight);
});
    $("#chat_line_list").each(function () {
       this.style.setProperty("width", "", "important");
});
    $("#myContainer3").css({"opacity":"0.7"}).delay(300).css({"box-shadow":"inset 0 0 20px black"});
    
    //--- OLD BUTTON BACK .css({"box-shadow":"inset 0 0 20px rgb(138, 138, 138)"});
    //--- Old Chat Button
    $("#chat_speak").animate({"width":"149px"}, "fast");
    //--- New Chat Button
    $(".send-chat-button").css("right", "").css("width", "").css("margin-left", "").css("left", chatLeft);
    $("button.primary").css("background", "");
    $("button.primary").removeAttr("style");
    // Show the video bar
    $("#twitch_chat").animate({"top":"51px"}, "fast");
    $("#chat").removeAttr("style");
    $("#chat").each(function () {
    this.style.setProperty("top", "51px", "important");
        this.style.setProperty("bottom", "0");
});
    $(".tse-content").removeAttr("style");
    $(".ember-chat .chat-messages .tse-content").css("padding", "");
    $("#archives").animate({"top":"51px"}, "fast");
    //--- Chat Bottom
    $(".chat-messages").removeAttr("style");
    $(".chat-buttons-container").css("top", "");
    //--- Old Buttons Border
    $(".dropdown_glyph").css("border", "", "important").css("box-shadow", "", "important");
    //--- New Buttons Border
    $(".button.glyph-only svg").css("margin-left", "");
    $(".button.glyph-only").css("padding", "");
    $(".chat-option-buttons .button").css("margin-right", "").css("border", "", "important").css("box-shadow", "", "important");
    $(".chat-option-buttons .button").removeAttr("style");
    $("button.viewers").css("margin-right", "").css("border", "", "important").css("box-shadow", "", "important");
    $("button.viewers").removeAttr("style");
    $("button.emotemenu").css("margin-right", "").css("margin-left", "").css("border", "", "important").css("box-shadow", "", "important");
    $("button.emotemenu").removeAttr("style");
    $(".normal_button").css("margin-right", "").css("margin-left", "").css("border", "", "important").css("box-shadow", "", "important");
    $(".normal_button").removeAttr("style");
    $(".normal_button").css("background-image", "url('chrome-extension://bfekkhmgloopfmgfeiadglflhgelikbk/dist/images/gif-btn.png')").css("background-repeat", "no-repeat").css("background-position", "50%");
    //--- Chat Background
    $(".chat-messages").css("background", "");
    
    //--- New Chat Interface Features
    $(".ember-chat .chat-interface").removeAttr("style");
    $(".chat-interface").css("background", "").css("border", "", "important").css("box-shadow", "", "!important");
    //--- $(".chat-interface").each(function () {
    //---  this.style.setProperty("height", "134", "!important");
//---}) ;
    $(".textarea-contain").css("top", "").css("left", "").css("right", "");
    
    //--- $(".segmented_tabs").css({"visibility":"visible"}).css({"z-index":"4"});
    //--- $(".segmented_tabs").show(300, "swing");
    $(".tabs").slideDown(300);
    $("#right_col .top").css({"z-index":"4"});
    
    //--- showCheck3 = 2;
    bRotate();
    rTest = 0;
    showCheck3 = 0;
}
        }


/*--- Note, gmMain () will fire under all these conditions:
    1) The page initially loads or does an HTML reload (F5, etc.).
    2) The scheme, host, or port change.  These all cause the browser to
       load a fresh page.
    3) AJAX changes the URL (even if it does not trigger a new HTML load).
*/
var fireOnHashChangesToo    = false;
var pageURLCheckTimer       = setInterval (
    function () {
        if (   this.lastPathStr  !== location.pathname
            || this.lastQueryStr !== location.search
            || (fireOnHashChangesToo && this.lastHashStr !== location.hash)
        ) {
            this.lastPathStr  = location.pathname;
            this.lastQueryStr = location.search;
            this.lastHashStr  = location.hash;
            gmMain ();
            pReset();
            
            
        }
    }
    , 1
);

function gmMain () {  
    
    console.log ('MT: A "New" page has loaded.');
    // DO WHATEVER YOU WANT HERE.
    function ChatWFix(){
 GM_addStyle ( multilineStr ( function () {/*!
    #right_col:before {
    	left: 0px
    }
    */} ) );
    $(".segmented_tabs").css("z-index", "4");
    $("#right_col .top").css("z-index", "4");
    console.log("TM: Chat Left Position Fixed");
}

setTimeout(function () {ChatWFix()}, 5000);
    
    $("#player").ready(function() {
    
var showCheck3 = 0;
var zNode3       = document.createElement ('div');
var pHeight;
var bHeight;
var cHeight = "340px";
var cDisp;
var conWidth;
var resizeT;
var tHeight;
var zHeight;
var mrCheck;
var mmLeft;
var zWidth = $('#main_col').css("width");
var ZWidthCheck = zWidth;
var chatHeight = "340px";
var chatLHeight;
var chatLLHeight;
var chatLLPadding;
var chatLeft;
var intHeight = $(".chat-interface").css("height");

zNode3.innerHTML = '<button id="myButton3" type="button">'
                + '</button>';

zNode3.setAttribute ('id', 'myContainer3');

setTimeout(function () {$("#player").append(zNode3)}, 10000);
        
$(document.body).on ("click", "#myButton3", ButtonClickAction);
var rTest = 360;
        
$(window).resize(function() {
  //update stuff
    if (showCheck3 == 1) {
        setTimeout(function() {
        showCheck3 = 0;
        $("#myButton3").click();
            }, 1400);
    }
 
});
        
function bRotate() {
        setTimeout(function(){$("#myContainer3").css("transform", "rotate(" + rTest + "deg)")}, 500);
}
        
function ButtonClickAction (zEvent) {
    zWidth = $('#main_col').css("width");
if(showCheck3 == 1) { 
    $("#channel").removeAttr('style');
    $("#main_col").children(".tse-scroll-content").first().css("position", "");
    $("#chat_line_list").each(function () {
      this.style.setProperty("padding", chatLLPadding, "important");
});
    $("#chat_line_list").each(function () {
      this.style.setProperty("padding", chatLLPadding);
});
    $("#left_col").show(300, "swing");
    $(".editable").show(300, "swing");
    $("#new-user-prompt").show(300, "swing");
    //--- Old Panels Handler $("#channel_panels_contain").show(300, "swing");
    $(".stats-and-actions").show(300, "swing");
    $(".resizer").show(300, "swing");
    $("#right_close").show(300, "swing"); 
    $("#right_col").each(function () {
       this.style.setProperty("width", "", "important");
});
    $("#right_col").each(function () {
       this.style.setProperty("width", "340px");
});
    $("#main_col").removeAttr('style');
    
    $("#main_col").each(function () {
       this.style.setProperty("margin-left", "", "important");
});
    $("#main_col").css("margin-left","").css("width", zWidth);
	$("#main_col").css("width", "");
    $("#main_col").each(function () {
       //--- this.style.setProperty("width", "", "important");
});
    
    if (cDisp == "block") {
        
    $("#main_col").each(function () {
      //--- this.style.setProperty("margin-right", "0px");
});
    }
    
    else {
        $("#main_col").each(function () {
       this.style.setProperty("width", "");
        this.style.setProperty("margin-right", "0px");
});
        
    }
    
   if(zWidth >= 1) {
    
       $("#main_col").each(function () {
        //--- this.style.setProperty("width", "");
          this.style.setProperty("margin-right", "");
}); 
       
    }
    else {       
        
        //--- $("#main_col").css("width", "");
        
    }
    $(".dynamic-player").removeAttr("style");
    $("#player").each(function () {
      this.style.setProperty("position", "relative");
});
    $("#content").each(function () {
        this.style.setProperty("width", "", "important");
});
    $("#content").each(function () {
        this.style.setProperty("width", conWidth);
});
    $("#chat").each(function () {
       this.style.setProperty("width", "", "important");
});
    $("#chat").each(function () {
       this.style.setProperty("width", chatHeight);
});
    $("#chat_line").each(function () {
       this.style.setProperty("width", "", "important");
});
    $("#chat_line").each(function () {
       this.style.setProperty("width", chatLHeight);
});
    $("#chat_line_list").each(function () {
       this.style.setProperty("width", "", "important");
});
    $("#myContainer3").css({"opacity":"0.7"}).delay(300).css({"box-shadow":"inset 0 0 20px black"});
    
    //--- OLD BUTTON BACK .css({"box-shadow":"inset 0 0 20px rgb(138, 138, 138)"});
    //--- Old Chat Button
    $("#chat_speak").animate({"width":"149px"}, "fast");
    //--- New Chat Button
    $(".send-chat-button").css("right", "").css("width", "").css("margin-left", "").css("left", chatLeft);
    $("button.primary").css("background", "");
    $("button.primary").removeAttr("style");
    // Show the video bar
    $("#twitch_chat").animate({"top":"51px"}, "fast");
    $("#chat").removeAttr("style");
    $("#chat").each(function () {
    this.style.setProperty("top", "51px", "important");
        this.style.setProperty("bottom", "0");
});
    $(".tse-content").removeAttr("style");
    $(".ember-chat .chat-messages .tse-content").css("padding", "");
    $("#archives").animate({"top":"51px"}, "fast");
    //--- Chat Bottom
    $(".chat-messages").removeAttr("style");
    $(".chat-buttons-container").css("top", "");
    //--- Old Buttons Border
    $(".dropdown_glyph").css("border", "", "important").css("box-shadow", "", "important");
    //--- New Buttons Border
    $(".button.glyph-only svg").css("margin-left", "");
    $(".button.glyph-only").css("padding", "");
    $(".chat-option-buttons .button").css("margin-right", "").css("border", "", "important").css("box-shadow", "", "important");
    $(".chat-option-buttons .button").removeAttr("style");
    $("button.viewers").css("margin-right", "").css("border", "", "important").css("box-shadow", "", "important");
    $("button.viewers").removeAttr("style");
    $("button.emotemenu").css("margin-right", "").css("margin-left", "").css("border", "", "important").css("box-shadow", "", "important");
    $("button.emotemenu").removeAttr("style");
    $(".normal_button").css("margin-right", "").css("margin-left", "").css("border", "", "important").css("box-shadow", "", "important");
    $(".normal_button").removeAttr("style");
    $(".normal_button").css("background-image", "url('chrome-extension://bfekkhmgloopfmgfeiadglflhgelikbk/dist/images/gif-btn.png')").css("background-repeat", "no-repeat").css("background-position", "50%");
    //--- Chat Background
    $(".chat-messages").css("background", "");
    
    //--- New Chat Interface Features
    $(".ember-chat .chat-interface").removeAttr("style");
    $(".chat-interface").css("background", "").css("border", "", "important").css("box-shadow", "", "!important");
    //--- $(".chat-interface").each(function () {
    //---  this.style.setProperty("height", "134", "!important");
//---}) ;
    $(".textarea-contain").css("top", "").css("left", "").css("right", "");
    
    //--- $(".segmented_tabs").css({"visibility":"visible"}).css({"z-index":"4"});
    //--- $(".segmented_tabs").show(300, "swing");
    $(".tabs").slideDown(300);
    $("#right_col .top").css({"z-index":"4"});
    
    //--- showCheck3 = 2;
    bRotate();
    rTest = 0;
    showCheck3 = 0;
}
else if(showCheck3 == 0) {
    pHeight = $(".dynamic-player").css("height");
    bHeight = $('#left_col').css("width");
    cHeight = $('#right_col').css("width");
    conWidth = $('#content').css("width");
    tHeight = $('#main_col').css("margin-left");
    zHeight = $('#main_col').css("margin-right");
    chatHeight = $('#chat').css("width");
    chatLHeight = $('#chat_line').css("width");
    chatLLHeight = $('#chat_line_list').css("width");
    chatLLPadding = $('#chat_line_list').css("padding");
    cDisp 	= $('#right_col').css("display");
    localStorage.mmLeft = $('#main_col').css("margin-left");
    //--- zWidth = $('#main_col').css("width");
    chatLeft= $('.send-chat-button').css("left");
    //--- intHeight = $(".chat-interface").css("height");
    
    $("#channel").each(function () {
      this.style.setProperty("padding", "0 0 0 0", "important");
});
    $("#chat_line_list").each(function () {
      this.style.setProperty("padding", "0 0 0", "important");
});
    $(".editable").hide(300, "swing");
    $("#new-user-prompt").hide(300, "swing");
    $("#left_col").hide(300, "swing");
    $(".resizer").hide(300, "swing");
    $(".tabs").slideUp(300);
    //--- Old Panels Handler $("#channel_panels_contain").hide(300, "swing");
    $(".stats-and-actions").hide(300, "swing");
    
    $(".dynamic-player, .dynamic-player object, .dynamic-player video").each(function () {
      this.style.setProperty("height", "100%", "important");
      this.style.setProperty("width", "100%", "important");
});
    $(".dynamic-player").each(function () {
      this.style.setProperty("height", "100%", "important");
      this.style.setProperty("width", "100%", "important");
      this.style.setProperty("z-index", "999");
        
});
    $("#player").each(function () {
      this.style.setProperty("position", "absolute");
    });
    //--- Video Static
    $("#main_col").children(".tse-scroll-content").first().css("position", "static");
    //--- End

    if (cDisp == "block") {
    $("#content").each(function () {
      this.style.setProperty("width", "275px", "important");
});
    $("#right_col").each(function () {
      this.style.setProperty("width", "275px", "important");
});
    $("#chat").animate({"width":"275px"}, "fast");
    $("#chat_line_list").css({"width":""});
    $("#chat_line").animate({"width":"272px"}, "fast");

    $("#main_col").each(function () {
     this.style.setProperty("margin-right", "275px", "important");
      this.style.setProperty("width", "");
});
    
    $("#right_col .top").css({"z-index":"inherit"});
    $("#twitch_chat").css({"top":"0px"});
    $("#chat").each(function () {
      this.style.setProperty("top", "0px", "important");
});
    $(".tse-content").css("padding-bottom", "7px");
    $(".ember-chat .chat-messages .tse-content").css("padding", "0 10px");
    $("#archives").animate({"top":"0px"}, "100");
    //--- Old Chat Button    
    $("#chat_speak").animate({"width":"84px"}, "100");
    //--- New Chat Button
    $(".send-chat-button").css("right", "5px").css("width", "120px").css("margin-left", "auto");
    $("button.primary").animate({"width": "95px"}, 100).css("height", "28px").css("left", "auto");
        
    // $("button.primary_button").css("background", "black");
    // $("button.primary_button").css("background","linear-gradient(black, rgb(100, 65, 165) 5%, black, rgb(100, 65, 165))");
    
        
    //--- Chat Background
    $(".chat-messages").css("overflow", "hidden");
    
    //--- Chat Bottom
    $(".chat-messages").each(function () {
      this.style.setProperty("bottom", "100px", "important");
});
    $(".chat-buttons-container").css("top", "57px");
        
    //--- New Chat Interface Features
    $(".chat-interface").css("left", "0").css("right", "0").css("border-top", "0px none");
    $(".chat-interface").each(function () {
        // this.style.setProperty("height", "100px", "important");
        this.style.setProperty("height", "90px", "important");
        this.style.setProperty("padding", "20px 0");
        // this.style.setProperty("border-top", "0");
});
        
    $(".textarea-contain").css("top", "0").css("left", "0").css("right", "0");
    }
    else {
        $("#content").each(function () {
      this.style.setProperty("width", "0px", "important");
});
    $("#right_col").each(function () {
      this.style.setProperty("width", "0px", "important");
});
        $("#main_col").each(function () {
      this.style.setProperty("margin-right", "0px");
           this.style.setProperty("width", "100%", "important");
});
        
    }
    
    if (zWidth > 0) {
       $("#main_col").each(function () {
        this.style.setProperty("width", "100%", "important");
}); 
       
    }
    else {       
        this.style.setProperty("width", "", "important");
    }
    
    $("#main_col").each(function () {
      this.style.setProperty("margin-left", "0px", "important");      
});
    $("#right_close").hide(300, "swing");     
    
    //--- New Buttons Border
    $(".button.glyph-only").css("padding-left", "4px").css("padding-right", "4px");
    $(".chat-option-buttons .button").css("margin-right", "2px").css("margin-left", "5px").css("height", "24px");
    $(".button.glyph-only svg").css("margin-top", "4px");
   
    $("button.viewers").css("margin-right", "2px");
   
    $("#emote-menu-button").css("margin-right", "2px");
    $("#emote-menu-button").each(function () {
      this.style.setProperty("margin-left", "5px", "important");
      this.style.setProperty("width", "30px", "important");
      this.style.setProperty("height", "28px", "important");
          });
    
    $(".normal_button").css("margin-right", "2px");
    $(".normal_button").each(function () {
      this.style.setProperty("margin-left", "5px", "important");
      this.style.setProperty("width", "30px", "important");
      this.style.setProperty("height", "28px", "important");
         });
    
    
    //--- $("#myContainer3").fadeTo("fast", 1.0).css({"background":"url('http://i61.tinypic.com/ri80w5.png')"}).delay(300).css({"box-shadow":"inset 0 0 20px black"});
    $("#myContainer3").css({"opacity":"1"}).delay(300).css({"box-shadow":"inset 0 0 20px black"});
    bRotate();
    rTest = 360;
    showCheck3 = 1;
 
}
//--- else if(showCheck3 == 2) {
else if(showCheck3 == 5) {    
    if (cDisp == "block") {
        
    $("#main_col").each(function () {
      this.style.setProperty("margin-right", zHeight);
});
    }
    
    else {
        $("#main_col").each(function () {
       this.style.setProperty("margin-right", "0px");
       this.style.setProperty("width", "");
});
        
    }
    
    $("#main_col").each(function () {
       this.style.setProperty("margin-left", tHeight);
});
    
    $("#main_col").css("width", "");
    if (cDisp == "block") {
       $("#main_col").each(function () {
           this.style.setProperty("margin-right", "340px");
}); 
       
    }
    else {       
        $("#main_col").css("margin-right", "0", "important");
    }
 
    $("#myContainer3").fadeTo("fast", 0.5).delay(300).css({"box-shadow":"inset 0 0 20px navy"});
    
    showCheck3 = 0;
}
else if(showCheck3 == 3) {
    
}
    //--- clearInterval(pageURLCheckTimer);
    return false;
    }
    }); 
}




//--- Style our newly added elements using CSS.
GM_addStyle ( multilineStr ( function () {/*!
    #myContainer3 {
        position:               absolute;
        border-radius:			25px;
        transition:				1s ease-in-out;
        background:				url("http://i61.tinypic.com/ri80w5.png");
        opacity:				0.7;
        background-size:		contain !important; 
        box-shadow:				inset 0 0 20px black;
        bottom:                 0;
        left:					0;
        font-size:              13px;
        border:                 0px outset black;
        margin-left:            160px;
        margin-bottom:			0px;
        opacity:                0.5;
        width:					27px !important;
        height:					27px !important;
        z-index:                999;
        padding:                0px 0px;
    }
    #myButton3 {
        cursor:                 pointer;
       	background: 			transparent;
    	border: 				none !important;
        width:					27px !important;
        height:					27px !important;
        color:					purple;
        font-weight:			bold;
    }
    #myContainer3 p {
        color:                  purple;
        background:             transparent;
    }
*/} ) ); 

function multilineStr (dummyFunc) {
    var str = dummyFunc.toString ();
    str     = str.replace (/^[^\/]+\/\*!?/, '') // Strip function () { /*!
            .replace (/\s*\*\/\s*\}\s*$/, '')   // Strip */ }
            //--- .replace (/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
            ;
    return str;
}