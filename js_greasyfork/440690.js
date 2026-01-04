// ==UserScript==
// @name        Virtonomica:Konkurs spy
// @namespace   virtonomica
// @description для конкурса
// @include     https://virtonomica.ru/vera/main/unit/view/*
// @version     2022.02.10
// @license MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/440690/Virtonomica%3AKonkurs%20spy.user.js
// @updateURL https://update.greasyfork.org/scripts/440690/Virtonomica%3AKonkurs%20spy.meta.js
// ==/UserScript==
var run = async function() {

    var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    const api_sell = "https://virtonomica.ru/api/vera/main/unit/shopboard/browse?id=";

    // Идентификатор подразделения
    let id = /(\d+)/.exec(location.href)[0];

    let spy_save = $("<div style='cursor:pointer;float: right;'><img width='24px' title='SPY' alt='SPY' src='https://cdn0.iconfinder.com/data/icons/security-double-color-red-and-black-vol-4/52/spy__person__agent__security-256.png'></div>");
    let spy_out = $("<div id=konkurs_out style='margin:6px;'>");
    console.log("---Virtonomica:Konkurs spy---");

    spy_save.click(function (){
        console.log("---spy_out.click---");
        $("#konkurs_out").text("---spy_out.click---");
        $.get(api_sell + id, function(data){
            $("#konkurs_out").html( 'Server return:' + data.length );
            console.info( data );
            for(let i=-0; i<data.length; i++){
                let good = data[i];
                if ( good.product_symbol != 'shagreen' ) continue;
                let text = "price: " + good.price + "<br>";
                text+= "prev_price: " + good.prev_price + "<br>";
                text+= "sale_constraint: " + good.sale_constraint + "<br>";
                text+= "sales_volume: " + good.sales_volume + "<br>";
                text+= "share_of_the_market: " + good.share_of_the_market + "<br>";
                text+= "quality: " + good.quality + "<br>";
                text+= "quantity: " + good.quantity + "<br>";
                text+= "product_elasticity: " + good.product_elasticity + "<br>";
                text+= "product_necessity: " + good.product_necessity + "<br>";
                $("#konkurs_out").html(text);
                /*
                price
                prev_price
                product_elasticity
                product_necessity
                quality
                quantity
                sale_constraint
                sales_volume
                share_of_the_market
                 */
            }
            //unit_info =  data;
        });
    });

    // Добавить кнопку в меню
    var table = $("div#unit-info div.name");
    console.info( table );
    table.append(spy_save);
    table.append(spy_out);
    //table.append('<div id=spy_text style="float:left"></div>');

    let div = $("div.artf_slots");
    if (div.length > 0){
        div.after(spy_save);
        div.after(spy_out);
        spy_out.css("float","left");
    }
}
// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);