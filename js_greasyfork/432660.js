// ==UserScript==
// @name         Auto-Spin Roll - Freebitco.in  by Giuseppe Tarricone.
// @namespace    https://greasyfork.org/it/users/457042-giuseppe-tarricone
// @version      2.1.1.0
// @description  Auto-Spin Roll after 15-30-45 second 
// @description  Scipt Work only when add Script ( Hcaptcha Solver.)
// @description  Freebitco.in links : https://freebitco.in/?r=29923906
// @description  For Info mail : service.freebitcoin@gmail.com - Telegram : @Giuseppe_rus
// @description  Donate BTC Wallet : 3MmKge1SDiaJZ8x6vMuRFrqGsCtuSSu2yJ
// @author       Giuseppe Tarricone
// @license      GPL-3.0
// @match        https://freebitco.in/*
// @match        https://freebitco.in/?op=home#
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/432660/Auto-Spin%20Roll%20-%20Freebitcoin%20%20by%20Giuseppe%20Tarricone.user.js
// @updateURL https://update.greasyfork.org/scripts/432660/Auto-Spin%20Roll%20-%20Freebitcoin%20%20by%20Giuseppe%20Tarricone.meta.js
// ==/UserScript==

//You need add script ( Hcaptcha Solver.)
// this link :     https://greasyfork.org/it/scripts/425854-hcaptcha-solver-automatically-solves-hcaptcha-in-browser/code

var body = $('body');
  $("#main_deposit_button_top").parent()
        .append("<div class='left new_button_style deposit_withdraw_button_style withdraw_box_button' data-reveal-id='donationModal'>DONATIONS</div>"),$("body")
        .append("<div id='donationModal' class='reveal-modal'> <h3> <center>DONATIONS</center> </h3> <p>If you like my work this is my BTC address.<br>Thank you!</p> <div class='row' id='main_deposit_address_box'> <div class='large-12 small-12 large-centered small-centered columns change_size_css'> <div class='reward_table_box green_prize_rank br_5_5 bold' style='border-bottom: 1px solid #f3cd00; font-weight: bold;'>BTC ADDRESS</div> <div class='reward_table_box br_0_0_5_5 font_bold' style='border-top:none;'> <input type='text' id='main_deposit_address' size='40' style='text-align:center;' value='3MmKge1SDiaJZ8x6vMuRFrqGsCtuSSu2yJ' onclick='this.select();'> <p><img src='//chart.googleapis.com/chart?cht=qr&chs=200x200&chl=3MmKge1SDiaJZ8x6vMuRFrqGsCtuSSu2yJ&chld=H|0'></p> </div> </div> </div> <a class='close-reveal-modal'>×</a> </div>")
     body.prepend(
        $('<div/>').attr('style',"position:fixed;top:50px;left:0;z-index:999;width:350px;background-color:black;color: white; text-align: center;")
            .append(
                $('<div/>').attr('id','autofaucet')
                    .append($('<p/>').attr('style','text-decoration:underline;color: red').text("Auto-Spin Freebitco.in"))
                    .append($('<p/>').attr('style',"color: red").text("By Giuseppe Tarricone"))
                    .append($('<p/>').text("Support Mail : service.freebitcoin@gmail.com"))
                    .append($('<p/>').attr('style',"color: green").text("Referral : https://freebitco.in/?r=29923906"))
                    .append($('<p/>').attr('style','text-decoration:underline;color: red').text("(Click to copy)"))
                    .append($('<p/>').attr('style','text-decoration:underline;color: white').text("Good Luck."))
                    .append($('<p/>')
                    )
            ).click(function(){
            var $temp = $('<input>').val("https://freebitco.in/?r=29923906");
            body.append($temp);
            $temp.select();
            document.execCommand("copy");
            $temp.remove();
        })
    ).prepend($('<style/>')
        .text("#autofaucet p { margin: 0; margin-left: 2px;  text-align: center; }")
)

$(document).ready(function(){
           setTimeout(function(){
             $(".image-center-marker").click();
           },15000+Math.random()*1500);
         });


$(document).ready(function(){
           setTimeout(function(){
             $(".image-center-marker").click();
           },30000+Math.random()*1500);
         });


$(document).ready(function(){
           setTimeout(function(){
             $(".image-center-marker").click();
           },45000+Math.random()*1500);
         });
