// ==UserScript==
// @name        ZITS: Zetaboards ImprovemenT Script
// @namespace   zetaboards-improvement
// @homepage   https://greasyfork.org/en/scripts/12509-lash-s-zetaboards-improvement-script/
// @icon http://i57.tinypic.com/2m4ruoz.png
// @description An all-in-one script that works on pretty much every Zetaboards forum, adding a sidebar and other code.
// @include     */index/
// @include     */post/*
// @include     */forum/*
// @include     */topic/*
// @exclude     */home/
// @version     15.5
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle 
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/12509/ZITS%3A%20Zetaboards%20ImprovemenT%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/12509/ZITS%3A%20Zetaboards%20ImprovemenT%20Script.meta.js
// ==/UserScript==
var visible = GM_getValue("sidebar");
var base_url = window.location.origin;
$("body").append ( '                                                \
    <div id="gmRightSideBar">                                       \
        <p>F9 toggles visibility</p>                                \                                                  \
<table class="cat_head" id="collapsed" style="border-collapse:collapse; margin:0px; padding:0px;"> \
<tbody><tr><td><h2><span class="collapse" style="float:initial;"><center>Chat (click to toggle)</center></span></h2></td></tr></tbody></table> \
<table style="display: table; margin:0px; padding: 0px;" cellpadding="0" cellspacing="0"> \
<tbody><tr><td style="width:100%;" valign="top"> \
<div id="chat"> \
</div> \
</td></tr></tbody></table> \
<table class="cat_head" id="collapsed" style="border-collapse:collapse; margin: 0px; padding:0px;"> \
<tbody><tr><td><h2><span class="collapse" style="float:initial;"><center>Subscriptions (click to toggle)</center></span></h2></td></tr></tbody></table> \
<table style="display: table; padding: 0px; margin:0px;" cellpadding="0" cellspacing="0"> \
<tbody><tr><td style="width:100%;" valign="top"> \
<div id="user_control_panel"> \
</div> \
</td></tr></tbody></table> \
</div>                                                          \
' );
$('#cboxdiv').remove().clone().appendTo('#chat');
//-- Fade panel when not in use
var kbShortcutFired = false;
var rightSideBar    = $('#gmRightSideBar');
rightSideBar.hover (
    function () {
        $(this).stop (true, false).fadeTo (50,  1  );
        kbShortcutFired = false;
    },
    function () {
        if ( ! kbShortcutFired ) {
            $(this).stop (true, false).fadeTo (900, 0.1);
        }
        kbShortcutFired = false;
    }
);
rightSideBar.fadeTo (2900, 0.1);

//-- Keyboard shortcut to show/hide our sidebar
$(window).keydown (keyboardShortcutHandler);

function keyboardShortcutHandler (zEvent) {
    //--- On F9, Toggle our panel's visibility
    if (zEvent.which == 120) {  // F9
        kbShortcutFired = true;

        if (rightSideBar.is (":visible") ) {
            GM_setValue("sidebar", "false");
            rightSideBar.stop (true, false).hide ();
        }
        else {
            //-- Reappear opaque to start
            GM_setValue("sidebar", "true");
            rightSideBar.stop (true, false).show ();
            rightSideBar.fadeTo (0, 1);
            rightSideBar.fadeTo (2900, 0.1);
        }

        zEvent.preventDefault ();
        zEvent.stopPropagation ();
        return false;
    }
}
var window_width = $(window).width();
var page_width = document.getElementById("wrap").clientWidth;
if (page_width == 800 && window_width >= 1200){
GM_addStyle ( "                                                     \
    #install-area {                                                 \
    display: none;                                                  \
    }                                                               \
    #gmRightSideBar {                                               \
        position:               fixed;                              \
        top:                    0;                                  \
        left:                  0;                                  \
        margin-left:                 1ex;                                \
        background-color: rgba(255, 0, 0, 0.5)                      \
        width:                  300px;                              \
        z-index:                6666;                               \
        opacity:                0.9;                                \
height: 100%; \
overflow-y: auto; \
overflow-x: hidden;\
    resize:horizontal;\
max-width:300px; \
width:300px; \
    }                                                               \
    #gmRightSideBar p {                                             \
        font-size:              80%;                                \
    }                                                               \
    #gmRightSideBar ul {                                            \
        margin:                 0ex;                                \
    }                                                               \
    }                                                               \
" );
}
if (page_width != 800){
GM_addStyle ( "                                                     \
    #install-area {                                                 \
    display: none;                                                  \
    }                                                               \
    #gmRightSideBar {                                               \
        position:               fixed;                              \
        top:                    0;                                  \
        left:                  0;                                  \
        margin-left:                 1ex;                                \
        background-color: rgba(255, 0, 0, 0.5)                      \
        width:                  200px;                              \
        z-index:                6666;                               \
        opacity:                0.9;                                \
height: 100%; \
overflow-y: auto; \
overflow-x: hidden;\
    resize:horizontal;\
max-width:300px; \
width:200px; \
    }                                                               \
    #gmRightSideBar p {                                             \
        font-size:              80%;                                \
    }                                                               \
    #gmRightSideBar ul {                                            \
        margin:                 0ex;                                \
    }                                                               \
    }                                                               \
" );
}
if (visible == "false"){
                rightSideBar.stop (true, false).hide ();
}
jQuery(function() {
    	var page_url = window.location.href;
    	var base_url = window.location.origin;
    if (page_url != "http://starforcerp.com/site/"){
	jQuery.get(unsafeWindow.main_url+"home"+"?forceads", "", function (data) {
//jQuery(data).find("#boardmeta").appendTo ("#user_control_panel");
//jQuery(data).find("#ucp_splash").appendTo ("#user_control_panel");

jQuery(data).find("#subscriptions").appendTo("#user_control_panel");
jQuery(data).find(".ucp:has(thead tr th:contains(Forum Subscriptions))").appendTo ("#user_control_panel");
jQuery("#subscriptions thead tr th").attr("colspan","2");

jQuery("#subscriptions .c_foot form").remove();
jQuery(".ucp:has(thead tr th:contains(Forum Subscriptions)) .c_foot form").remove();
}, "html");
    }
});
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('iframe {width:100% !important;}');
addGlobalStyle('#subscriptions > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(1) {display:none;}');
addGlobalStyle('#cboxdiv {width:100% !important;}');
addGlobalStyle('table#subscriptions tbody > tr th:nth-child(3), table#subscriptions tbody > tr th:nth-child(4), table#subscriptions tbody > tr th:nth-child(2), table#subscriptions tr[class*="row"] td:nth-child(3), table#subscriptions tr[class*="row"] td:nth-child(4), table#subscriptions tr[class*="row"] td:nth-child(2),table#subscriptions tr[class*="row"] td:nth-child(6), table#subscriptions tbody > tr th:nth-child(6) {display: none;}');
function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}
 
loadjscssfile("http://z3.ifrm.com/63/1/0/p479384/Recent_Updates.js", "js") //dynamically load and add this .js file
if (base_url != "http://starforcerp.com"){
loadjscssfile("http://z3.ifrm.com/63/1/0/p481654/Quick_Search.js", "js") //dynamically load and add this .js file
$('.topic-buttons').prepend(" <a href='"+$('#foot_links a:contains(Track Topic)').attr('href')+"'><img src='http://z5.ifrm.com/9054/18/0/f5307276/track_topic.png' alt='track topic' /></a>");
loadjscssfile("http://z5.ifrm.com/9054/18/0/f5298252/zeta_cookie.js", "js") //dynamically load and add this .js file
loadjscssfile("http://z5.ifrm.com/9054/18/0/f5262218/confirm.js", "js") //dynamically load and add this .js file
loadjscssfile("http://z5.ifrm.com/9054/18/0/f5310358/login_redirect.js", "js") //dynamically load and add this .js file
}
if (base_url != "http://sonic-cyclone.net" && base_url == "http://starforcerp.com"){
$("#fast-reply dd").attr("id","c_post").append("<button id='preview' name='preview' type='button' onclick='Preview(event)' style='margin-right:5px;'>Preview</button>");    
}
if (base_url != "http://sonic-cyclone.net" && base_url != "http://starforcerp.com"){
// "Preview in Fast Reply" created by Holysavior of ZBCode and Javascriptin.com
$("#fast-reply dd").attr("id","c_post").append("<button id='preview' name='preview' type='button' onclick='Preview(event)' style='margin-right:5px;'>Preview</button>");$("#preview").after($("#fast-reply button:contains('Full Reply Screen')"));
var sel = document.getElementById('postlengthchar');
if (sel === null) {
$(".posting #btn_preview,.posting .btn_normal,#fast-reply #btn_preview,#fast-reply .btn_normal").after("<br /><span id='posting_wordchars'><b>0 Characters || 0 Words</b></span>");
$(".posting #c_post-text,#fast-reply dd textarea").keyup(function(){
var characters = $(this).attr("value").length;
var words = $(this).attr("value").split(" ").length;
$("#posting_wordchars").html("<b>"+characters+" Characters || "+words+" Words</b>");
});    
}
}