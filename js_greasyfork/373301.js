// ==UserScript==
// @name         HaremHeroes Buy max stats
// @version      1.31
// @description  Add a button in market to buy maximum stats points at once, so you don't have to click over 9000 times
// @author       Spychopat
// @match        http*://nutaku.haremheroes.com/*
// @match        http*://*.hentaiheroes.com/*
// @namespace JDscripts
// @downloadURL https://update.greasyfork.org/scripts/373301/HaremHeroes%20Buy%20max%20stats.user.js
// @updateURL https://update.greasyfork.org/scripts/373301/HaremHeroes%20Buy%20max%20stats.meta.js
// ==/UserScript==

//$("#equiped plus")[0].click()


var sheet = (function() {
    var style = document.createElement('style');
    document.head.appendChild(style);
    return style.sheet;
})();






function marketCss(){
    sheet.insertRule('plus_buy_all{'
                     +'display:block;'
                     +'position:static;'
                     +'top:0;right:0;'
                     +'color:#fff;'
                     +'text-decoration:none;'
                     +'margin:0;'
                     +'padding-left: 5px;'
                     +'padding-right: 5px;'
                     +'-webkit-border-radius:10%;'
                     +'-moz-border-radius:10%;'
                     +'border-radius:10%;'
                     +'cursor:pointer;'
                     +'text-align:center;'
                     +'background:#057;'
                     +'background:-webkit-linear-gradient(-90deg,#0af 0,#068 50%,#057 51%,#0af 100%);'
                     +'background:-moz-linear-gradient(180deg,#0af 0,#068 50%,#057 51%,#0af 100%);'
                     +'border: 1px solid #000!important;'
                     +'box-shadow: 0 3px 0 rgba(13,22,25,.6), inset 0 3px 0 #6df0ff;');
    sheet.insertRule('plus_buy_all[disabled]{'
                     +'background-image:linear-gradient(to top,#9f9296 0,#847c85 100%)!important;'
                     +'box-shadow: 0 3px 0 rgba(13,22,25,.6),inset 0 3px 0 #b6a6ab!important;');

   sheet.insertRule('#shops #equiped div.sub_block .hero_stats>div>[cur]{'
                    +'display: none;');


    sheet.insertRule('.BuyMax:hover + div {' +
                     'opacity: 1;' +
                     'visibility: visible; }');

    sheet.insertRule('.BuyMaxTooltip {'
                     + 'position: absolute;'
                     + 'z-index: 11;'
                     + 'min-width: 85;'
                     + 'border: 1px solid rgb(255, 255, 255,.73);'
                     + 'border-radius: 7px;'
                     + 'background: #ccd7dd;'
                     + 'padding: 4px 8px 6px;'
                     + 'font-size: 13px;'
                     + 'color: #057;'
                     + 'text-align: left;'
                     + 'pointer-events: none;'
                     + 'visibility: hidden;');

    sheet.insertRule('.BuyMaxIcon{'
                     + 'margin-left: 5px;'
                     + 'width: 20px;'
                     + 'height: 20px;}');

}
function calculateStatPrice(points){
    var cost = 0;
    if(points < 2001){
        cost = 3 + points * 2;
    }else if(points < 4001){
        cost = 4005+(points-2001)*4;
    }else if(points < 6001){
        cost = 12005+(points-4001)*6;
    }else if(points < 8001){
        cost = 24005+(points-6001)*8;
    }else if(points < 10001){
        cost = 40005+(points-8001)*10;
    }else if(points < 12001){
        cost = 60005+(points-10001)*12;
    }else if(points < 14001){
        cost = 84005+(points-12001)*14;
    }else if(points < 16001){
        cost = 112005+(points-14001)*16;
    }
    return cost;
}

function calculateTotalPrice(points){
    var last_price = calculateStatPrice(points);
    var price = 0;
    if(points < 2001) {
        price = (5+last_price)/2*(points);
    } else if(points < 4001){
        price = 4012005+(4009+last_price)/2*(points-2001);
    }else if(points < 6001){
        price = 20026005+(12011+last_price)/2*(points-4001);
    }else if(points < 8001){
        price = 56042005+(24013+last_price)/2*(points-6001);
    }else if(points < 10001){
        price = 120060005+(40015+last_price)/2*(points-8001);
    }else if(points < 12001){
        price = 220080005+(60017+last_price)/2*(points-10001);
    }else if(points < 14001){
        price = 364102005+(84019+last_price)/2*(points-12001);
    }else if(points < 16001){
        price = 560126005+(112021+last_price)/2*(points-14001);
    }
    return price;
}

function ModifyMarket() {
    var last_cost = 0,
        levelPoints = 0,
        levelMoney = 0,
        level = Hero.infos.level;
    /*
    if(level <=25){
        levelPoints = level *40;
    } else {
        levelPoints = 1000 + (level-25)*19;
    }
    */
    levelPoints = level * 30;
    levelMoney = calculateTotalPrice(levelPoints);

    var loc2 = $('.hero_stats').children();
    loc2.each(function() {
        var stat = $(this).attr("hero");
        if(stat == "carac1" || stat == "carac2" || stat == "carac3"){
            var disabled = 'disabled="disabled"';
            if(stat == "carac1" && !$("#equiped plus")[0].getAttribute("disabled"))
                disabled = "";
            if(stat == "carac2" && !$("#equiped plus")[1].getAttribute("disabled"))
                disabled = "";
            if(stat == "carac3" && !$("#equiped plus")[2].getAttribute("disabled"))
                disabled = "";


            var statNumber;
            if(stat == "carac1")
                statNumber = 1;
            if(stat == "carac2")
                statNumber = 2;
            if(stat == "carac3")
                statNumber = 3;

            var currentStatPoints = Hero.infos[stat],
                remainingPoints = levelPoints - currentStatPoints,
                currentMoney = calculateTotalPrice(currentStatPoints),
                remainingMoney = levelMoney - currentMoney;

            $(this).append('<plus_buy_all class="BuyMax" for_carac="'+stat+'" '+disabled+'><span>Buy max</span></plus_all>');
            $(this).append('<div id="BuyMax' + stat +'" class="BuyMaxTooltip">'
                           + 'Buy '+remainingPoints.toLocaleString()
                           + '<img class="BuyMaxIcon" src="https://hh.hh-content.com/pictures/misc/items_icons/'+statNumber+'.png"><br>'
                           + 'For '+remainingMoney.toLocaleString()
                           + '<img class="BuyMaxIcon" src="https://hh.hh-content.com/design/ic_menu-SC.png"><br>'
                           +'</div>');
        }
    });
}


function clickFunction(){
    $("#equiped plus_buy_all").click(function() {
        var carac_num;
        var $me = $(this);
        if ($me.attr("disabled")) return;
        var carac = $me.attr("for_carac");
        if(carac == "carac1")
            carac_num = 0;
        if(carac == "carac2")
            carac_num = 1;
        if(carac == "carac3")
            carac_num = 2;

        var button_plus_stat = $("#equiped plus")[carac_num];

        var auto_click = setInterval(function() {
            //console.log("achat stat");
            //console.log($("#equiped plus").next()[carac_num].getAttribute("value"));
            if(!button_plus_stat ){//|| !$("#equiped plus").next()[carac_num].getAttribute("value") || $("#equiped plus").next()[carac_num].getAttribute("value") == 'MAXED') {
                //console.log("time to stop");
                //$me[0].setAttribute("disabled","disabled");
                clearInterval(auto_click);
                return;
            }
            button_plus_stat.click();
        }, 100);
        $me[0].setAttribute("disabled","disabled");
    });
}

(function() {
    'use strict';
    marketCss();
    ModifyMarket();
    clickFunction();
})();