/* globals jQuery, $, waitForKeyElements */
// ==UserScript==
// @name         Freebitcoin
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Estratégia Rewards Point doações 127UMVHURFAzuR8cxTxkMsDusKGboKgfiF
// @author       Daniel1MsN
// @match        https://freebitco.in/?op=home
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419369/Freebitcoin.user.js
// @updateURL https://update.greasyfork.org/scripts/419369/Freebitcoin.meta.js
// ==/UserScript==
function PaginaInicial(){
if(!$("#free_play_payout_table").is(":visible")){$("#free_play_link_li > a").trigger("click");}
}
function Comprar(B1,IID){//IID free_points_rewards or fp_bonus_rewards
    var RP=parseFloat($("#rewards_tab > div:nth-child(2) > div > div.reward_table_box.br_0_0_5_5.user_reward_points.font_bold").text().replace(',',''));
    if(!$("#rewards_tab > div.row.reward_category_container_main_div > div").is(":visible")){
        $("body > div.large-12.fixed > div > nav > section > ul > li.new_dropdown > div > a.rewards_link").trigger("click");
            }
    if(!$("#free_points_rewards > p").is(":visible")){
        $("#rewards_tab > div.row.reward_category_container_main_div > div > div:nth-child("+B1+") > div.reward_category_name").trigger("click");
    }
    if(RP>=1200){$("#"+IID+" > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > button").trigger("click");PaginaInicial();}else
    if(RP>=600){$("#"+IID+" > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > button").trigger("click");PaginaInicial();}else
    if(RP>=300){$("#"+IID+" > div:nth-child(4) > div:nth-child(2) > div:nth-child(3) > button").trigger("click");PaginaInicial();}else
    if(RP>=120){$("#"+IID+" > div:nth-child(5) > div:nth-child(2) > div:nth-child(3) > button").trigger("click");PaginaInicial();}else
    if(RP>=12){$("#"+IID+" > div:nth-child(6) > div:nth-child(2) > div:nth-child(3) > button").trigger("click");PaginaInicial();}else{PaginaInicial();rodar();}
}
function rodar(){
    if($("#free_play_form_button").is(":visible")){

    $("#free_play_form_button").trigger("click");

    }
}
setInterval(function(){
    if($("#free_play_form_button").is(":visible")){
        if($("#bonus_container_free_points").is(":visible")){rodar();}else{
            Comprar(6,"free_points_rewards");
        }
    }
}, 2800);