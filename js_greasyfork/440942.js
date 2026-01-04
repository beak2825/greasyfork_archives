// ==UserScript==
// @name         AUTO CLAIM FREEBITCOIN FAUCET(2022) - Freebitco.in  by Bitcoinbees.
// @namespace    Freebitco.in Bot Script 
// @version      0.1
// @description  Auto-Spin Roll after 15-30-45 second 
// @description  Scipt Work only when add Script ( Hcaptcha Solver.)
// @description  Freebitco.in links : tinyurl.com/new-users-registration
// @description  For Info E-mail : bitbeez@yandex.com
// @author       Bitcoinbees
// @license      GPL-4.0
// @match        https://freebitco.in/*
// @match        https://freebitco.in/?op=home#
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/440942/AUTO%20CLAIM%20FREEBITCOIN%20FAUCET%282022%29%20-%20Freebitcoin%20%20by%20Bitcoinbees.user.js
// @updateURL https://update.greasyfork.org/scripts/440942/AUTO%20CLAIM%20FREEBITCOIN%20FAUCET%282022%29%20-%20Freebitcoin%20%20by%20Bitcoinbees.meta.js
// ==/UserScript==

//You need add script ( Hcaptcha Solver.)
///////////////////////////////////////////////

var body = $('body');
$('head').append('<meta http-equiv="refresh" content="36" />');
 var img = document.createElement("img");
    img.src = "https://i.postimg.cc/KzddcSkK/BITCOIN-BEE-LOGO.png";
/////////////////////////////////////////////////////////////////////
 body.prepend(
        $('<div/>').attr('style',"position:relative;height:40em;z-index:9;width:75%;background-color:#E6E6E6;color: white; text-align: center;margin:auto; margin-bottom:0;bottom:0;")
            .append(
                $('<div/>').attr('id','autofauce')
                    .append(img).attr('style',"width:20%; height:20%;position:relative;")
                    .append($('<h4/>').attr('style','text-decoration:underline;color: red').text("Auto-Spin Freebitco.in Bot Script"))
                    .append($('<h5/>').attr('style',"color: red").text("By Bitcoin Bees"))
                    .append($('<p/>').attr('style',"color: #000; font-weight:bold;").text("SUPPORT MAIL:"))
                    .append($('<p/>').attr('style',"color: #000;").text("bitbeez@yandex.com"))
                    .append($('<p/>').attr('style',"color: green").text("Referral :https://tinyurl.com/new-users-registration"))
                    .append($('<p/>').attr('style','text-decoration:none;background: -webkit-linear-gradient(top,#0de617 5%,#06980E 100%); padding:4px;font-weight:bolder;color:#fff;border-radius:6px;').text("Click to copy"))
                    .append($('<p/>').attr('style','text-decoration:underline;color:#000;').text("Good Luck."))
                    .append($('<p/>')
                    )

            ).click(function(){
            var $temp = $('<input>').val("https://tinyurl.com/new-users-registration");
            body.append($temp);
            $temp.select();
            document.execCommand("copy");
            $temp.remove();
        })
    ).prepend($('<style/>')
        .text("#autofauce { top:50px;position:relative;margin-right:auto; margin-left:auto;display:block;width:100%;padding-left:0;padding-right:0;}")
)
$(document).ready(function(){
           setTimeout(function(){
             $(".free_play_element").click();
           },15000+Math.random()*1500);
         });


$(document).ready(function(){
           setTimeout(function(){
             $(".free_play_element").click();
           },30000+Math.random()*1500);
         });


$(document).ready(function(){
           setTimeout(function(){
             $(".free_play_element").click();
           },45000+Math.random()*1500);
         });



