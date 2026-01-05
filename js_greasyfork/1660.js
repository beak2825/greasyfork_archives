// ==UserScript==
// @name        Paidverts autofiller script
// @namespace   caede
// @description This Paidverts script will automatically fill the fields that you need to type in order to view ads on paidverts.com
// @include	    *://paidverts.com/*
// @include	    *://www.paidverts.com/*
// @version     1.0.8
// @require  	http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant		GM_xmlhttpRequest
// @grant		GM_info
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/1660/Paidverts%20autofiller%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/1660/Paidverts%20autofiller%20script.meta.js
// ==/UserScript==
//////JQuery Compatibility statement//////
this.$ = this.jQuery = jQuery.noConflict(true);
//////JQuery Compatibility statement//////
//body style
GM_addStyle("body { background-color: #07054c; background-image:url('http://i.imgur.com/MdIx1Se.png');}");
//element styles
GM_addStyle("a { color: #07054c; text-shadow: 0 0 0.3em #32c7c5 }");
GM_addStyle("b4 { color: #07054c; }");
GM_addStyle(".member_top { background-image:url('http://i.imgur.com/m6h2T0l.png'); }");
GM_addStyle(".menu_top_one { color: white; background-color: #07054c;}");
GM_addStyle(".link_green a, .link_green_small a { color: #32c7c5; }");
GM_addStyle(".link_green a, .link_green_small a { color: #32c7c5; -webkit-transition: all 0.4s ease-out; -moz-transition: all 0.4s ease-out; -o-transition: all 0.4s ease-out; -ms-transition: all 0.4s ease-out; }");
GM_addStyle("#countdown { color: #07054c; }");
GM_addStyle(".myads_nag { background-color: #07054c; }");
GM_addStyle(".myacc_nag_z { background-color: #07054c; }");
GM_addStyle(".myads_nag_right { background-color: #07054c; }");
GM_addStyle("h2.green { background-color: #07054c; }");
GM_addStyle(".button_green_sans3 { background-color: #07054c; }");


//button styles
GM_addStyle(".create_account { background-color: #32c7c5; color: #07054c; }");
GM_addStyle(".button_green_big { background-color: #32c7c5; color: #07054c; }");
GM_addStyle(".button_green_submit { background-color: #32c7c5; color: #07054c; }");
GM_addStyle(".button_green_small { background-color: #32c7c5; border: 2px solid #32c7c5; color: #07054c; } .button_green_small:hover { border: 2px solid #32c7c5; background-color: white; color: #32c7c5; } ");
GM_addStyle(".button_cashout { background-color: #32c7c5; color: #07054c; border: 1px solid #07054c; } .button_cashout:hover { background-color: white; color: #07054c; border: 1px solid #07054c;  } ");
GM_addStyle(".button_green_sans2, .button_grey_small, .button_grey_big, .button_green_small, .button_green_sans, .button_green_sans2, .button_green_submit, .button_green_big, .button_black_small, .button_black_big  { background-color: #32c7c5; color: #07054c; } .button_green_sans2:hover { border: 2px solid #32c7c5; background-color: white; color: #32c7c5; } ");


//menu styles
GM_addStyle(".menu_top_one { color: white; background-color: #07054c;} ");
//menu icon styles
GM_addStyle(".menu_link_myad { background: url('http://i.imgur.com/qjaae4G.png') no-repeat 194px 7px; } .menu_link_myad:hover { background: url('http://i.imgur.com/qjaae4G.png') no-repeat 194px 7px; }");
GM_addStyle(".menu_link_buyad { background: url('http://i.imgur.com/NMEpLUB.png') no-repeat 194px 7px; } .menu_link_buyad:hover { background: url('http://i.imgur.com/NMEpLUB.png') no-repeat 194px 7px; }");
GM_addStyle(".menu_link_paidad { background: url('http://i.imgur.com/TM66p0C.png') no-repeat 194px 7px; } .menu_link_paidad:hover { background: url('http://i.imgur.com/TM66p0C.png') no-repeat 194px 7px; }");
GM_addStyle(".menu_link_cashout { background: url('http://i.imgur.com/Pkibyb8.png') no-repeat 194px 7px; } .menu_link_cashout:hover { background: url('http://i.imgur.com/Pkibyb8.png') no-repeat 194px 7px; }");
GM_addStyle(".menu_link_ref { background: url('http://i.imgur.com/itdbxD4.png') no-repeat 194px 7px; } .menu_link_ref:hover { background: url('http://i.imgur.com/itdbxD4.png') no-repeat 194px 7px; }");
GM_addStyle(".menu_link_games { background: url('http://i.imgur.com/g12op2r.png') no-repeat 194px 7px; } .menu_link_games:hover { background: url('http://i.imgur.com/g12op2r.png') no-repeat 194px 7px; }");
GM_addStyle(".menu_link_account { background: url('http://i.imgur.com/Vb7Ra8B.png') no-repeat 194px 7px; } .menu_link_account:hover { background: url('http://i.imgur.com/Vb7Ra8B.png') no-repeat 194px 7px; }");
GM_addStyle(".menu_link_stats { background: url('http://i.imgur.com/mzjaE36.png') no-repeat 194px 7px; } .menu_link_stats:hover { background: url('http://i.imgur.com/mzjaE36.png') no-repeat 194px 7px; }");
GM_addStyle(".menu_link_logout { background: url('http://i.imgur.com/sF4LKky.png') no-repeat 194px 7px; } .menu_link_logout:hover { background: url('http://i.imgur.com/sF4LKky.png') no-repeat 194px 7px; }");
GM_addStyle(".menu_link_logout { background: url('http://i.imgur.com/sF4LKky.png') no-repeat 194px 7px; } .menu_link_logout:hover { background: url('http://i.imgur.com/sF4LKky.png') no-repeat 194px 7px; }");
//other styles
GM_addStyle(".green_info { background-color: #28eee7; } ");
GM_addStyle(".top_bar { background-color: #07054c; } ");
GM_addStyle(".button_tp { background-color: #32c7c5; color: #07054c; } .button_tp:hover { border: 2px solid #32c7c5; background-color: white; color: #07054c; } ");

//

$('#copy-1').trigger('click');
$('#copy-2').trigger('click');
$('#copy-3').trigger('click');
setTimeout(function(){
document.getElementById('view_ad').style.display = "block";
$('#view_ad').trigger('click');
}, 100);

setInterval(function(){
var element =  document.getElementById('captcha_button');
var done = document.getElementById('button');

if (typeof(element) != 'undefined' && element != null)
{

    if(element.style.display === "none"){
    }
    else{
            $('.img img')[2].click();
            $('#captcha_button').click();
    }

    if(done.style.display == "inline-block"){
        $('#button').click();
        setInterval( function() {
        $('#closeBtn').click();
        $('#playGridAgn').click();
        },300);

       }


    }

}, 1000);

$("iframe").remove(".frame_bar");
document.getElementById('tips').innerHTML = '<font color="white">This annoying ass ad has been hidden!</font><font color="yellow"> :)</font>';