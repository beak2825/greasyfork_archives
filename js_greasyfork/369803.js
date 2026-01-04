// ==UserScript==
// @name        Atlantis:shop_count
// @namespace   virtonomica
// @description Объем рынка по позициям
// @include     https://*virtonomic*.*/*/main/unit/view/*/supply
// @version     0.04
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/369803/Atlantis%3Ashop_count.user.js
// @updateURL https://update.greasyfork.org/scripts/369803/Atlantis%3Ashop_count.meta.js
// ==/UserScript==
var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    var url_report = "https://virtonomica.ru/vera/main/globalreport/marketing/";
    var url_api = "https://virtonomica.ru/api/vera/main/marketing/report/retail/metrics";

    // Объект с данными о локальных торговцах
    function Local_Trader( price, qv, count, link )
    {
        //цена
        this.price = price;
        // качество
        this.qv = qv;
        // объем рынка
        this.count = count;
        // ссылка на товар (га иконку товара?)
        this.link = link;
    }
    Local_Trader.prototype.Html = function( val ){
        return '<hr><span class=market_size style="color:grey" title="Местные поставщики" market_size='+ val +'>' + numberFormat(val) + '</span>'
    }

    function numberFormat (number) {
        number += '';
        var parts = number.split('.');
        var int = parts[0];
        var dec = parts.length > 1 ? '.' + parts[1] : '';
        var regexp = /(\d+)(\d{3}(\s|$))/;
        while (regexp.test(int)) {
            int = int.replace(regexp, '$1 $2');
        }
        return int + dec;
    }
    // Стили
    var st = $("style");
    if ( $(".my_btn", st).length == 0 ) {
        st.append(".my_btn{cursor:pointer;opacity:0.5;float:left;color: white;}");
        st.append(".my_btn:hover{opacity:1.0}");
        st.append(".my_btn img {width:24px;}");
    }

    var img_supply = 'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAFZElEQVRoge2ZXWxURRTHf7PdbsuWhWa3SmipoEb5WEMaxURjIr5gHzRC3LaJBvVFaVGUgEKLaXCDfAYtfgT7xRsPJhRpSwIKDyQlWB8KGokFlEiErlVoS2RpS7tt7/Fhu9v9pPfu3gIP/JPdzJw5Z+7/f2fu3DNz4T7u4z6mBFLLNqnj87vNIyWMk5fx35SKUGZ3KLVsQ/FxjLlGVfCh2dcCsJjZWRLyAOsTjcRANdv7q6lJ55rRI7B65UtAPdbMAubkg8MBMAZcQthHz1ANXu+oQfKRCI/EQDXbgU0AAnumb2V9+gIqVnahmANAZiYsmB/jrb5ldeXrKZIPoWbQxzDj5MN9pCjC2BQSeY3ancVRJmPkAdbbZkaTB1CwLpXpFC1AySoEH5mZMKcgcYTwZrhonDwAVgfYZsbbUxEx+SpUu/05xHLKSKdTCgtFVFT9OlGdDBWb2kF1TSkp/fg+kjzoEaCUIFrzlFEyAk3FLcX6HmKVcdB0MoYhZ3lv44lYqz4B1wZ/BLrNpmQMajdKSaxVnwCvV0PkkOmc9ONv8oYOJGrQ/x4Q1WQaHaMQvqDMG0jUpF9A79Ap4B+zOBnATQJZ+5I16hfg9WooufOrkagG1q37L1mz0Wz0Tk+jUazy1e0cjAm4OnwyLTrGcYDyqiu3czAmwOvV0qJjFJpl0t2cqRsak3GCNRt/nszp3hVg0XTtpe9NAcIF/g38oMf13hRgkd16nzfjpxLf7IzLR9KHgmwnZDnBOn2UjOxhQAAfijOgWui1t1K+ZCRBpEGYLSDLCdPnQkb2ZJ4XEbWB0udbI43pC3i3KrWzJa9YeOLkNqDKQJQgspPOpdV4lQZgTeniZiCG/IM2K+WFeSxzOXhkmg2AS7cCHO/1U9/VR8/IKIBCqU2424DgXjyVEfADjnB9VBXyQaXPUB9NJ5eP51UKwDMrly8XFGDPSLymDIxprL3g49DVGyGToFiBZ+nhVFahc1E1qzSwd2uh7uj605ko2R0iXzIrlwZ3YRR5p9OJ0+kM13MyLDS6H+LVWeGjDIWwhwOdNuMjULtrDSJfG44LIdsFMx4HgtPmzLPzyYm58yHy169fj7IPjGk82f57aDqBUqXGR8B1qwH4xTjzcdgm7mx5YV4c+dshJ8PCqkLXhEG05cYFlHkDjKmXSVWENSdcfNHliGsWkYTlEIrzZkRWn07tTfx+ZTd5Q88AaxD1E9CvOzbDFi7Om2aLa25untgztbS0xLU/HBWjClJfRoN71L3u0tJGh3/4U0G9AYjA/oEZts2dTU0J97AcbItexWKgaRMZRF1dHcXFxdjt9on26EHR0s6FcvyBLYLaCMwG8hVU5vgDW5JHSPh45q9b8Ro9Hg+NjY0sXLiQjo4OysrKGBwcZCJmONK9O20BiuBh77xFi5m7aHHI9lbyAHU6VDzW60/QrPB4PBw5coSioiLa29spKSmhvz84S4/13Yz07jAjG5XoP0AYS+6uwhO7vquPgbHESWdubi5NTU243W56enrw+/30j2k0+voiuiKlF1ks+/0Al8+d5fL5s0GjJWhLiF57K3ARoGdklLUXfCTLDl0uFy0tLRw9epTZ+fmsPe+jJxD+QPQHvfbWtAUMzLBtFthF8OixW2BXv8P2SdKA8iUjiNrA+HgdunqDdzqvJB0Jl8vFNKeLt3+7QvO1qFRiA+VLRkz/SqkbB9t2EJHMPZBpZVWhi2UuB4/aswD4c3CY4303afT1Rd55ENlB6QspJnNmwSsW3G1bUarKAI+4dPruCQjhu7ZXED4DHpvE8yKKj/AsPRxpvPsCIJih5g0uB1mB8BSMfymFLpAzKEtrsi3l/5kA2Lqr0VM+AAAAAElFTkSuQmCC"';

    var wc_text = $('<div id=at_count_text>');
    var value_market_png = 'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAE+klEQVRogcWZX2xTdRTHP+eudQxKiIKKAUlUYmJ8I4bEmMyID8D+xBcX1gWIMromLg78g0YTSJUEHwCTLVlM1wqi0KIQDRntRoLZgxpjgsQnlWDiEypIYpTh3Nre40PXWdauvb/LvfX7su3e7+/8uef8zjm/3wQfcLQrszIXsAbAbhNkLYCiP4lKBskNRdLPXPVap3gtMBEeC4MmgCULUCZVJNKX2nzSS72Wl8KS3Zke0BMUnTiNWq3NgaZQc6ApJKJPovopEBLV1EjPWLeXuj2LyNGuzMp8QC4DIRXd3ZdqH6zGGwlnXhbkMDAJubVepZlnESnuCULA6YWcAOhLt78LfFbkBl/0Sr9njgjaDoBaQ/W4CoPFn9rhlX4v98iDAM1BuViPmMu3fAsgyENeKTfeI4lwdgPw+fznkXSbzL5XJ3Jq8S2xN/SmOiZM7DKOiCD3m64xhY1lrMPYEUVXm65xAWMd5ntEWVX5SDNlf2bri6jDtxvgiIqumf8sIDowZ4PNwPz3Lvj+p5YgFREpiDVT+j0oTTPz3xvzxTwiAdMFVPlaoowc6T4XBSiIPVJPgAO+cUSMym+8c3SxFWq6aarEDezJwpLoaOffTvlGqRVYFvC99JYgiy2j9DJyRPPmuesWYol/jtiWee66hWnjNatatt2wiJg2XjNHXJRFt1DUv4g0Ys4qg48RcVHf3cLfPeJimLsN+BORD7edWwLcaWyOe9w13DURckp27MhUvnFpVcKi5n8q5rqF4NgRkYacQ26BSQOu6ciRruzdx7afXz4rtuGOlBpwPDy6Ih4eXVGLW3X6TWw5+wgirxSErYXczDVgDba9GvH8YrI2ZhuwRdN3wIpEd+Y4qocjH3f8MJ96iyPJnkyrqrwKdFCcjG1BR6HhPYRynYKeUSSKSC8iOxLh7FnUOhg5uemLOW4sFrNWX1rfrvAG8Pjs82kV+UTVOhBNb/wRINmTzaqyucG+ZCPptnaAxLZzD1DI70all9K9snARGLzyS0sqsOrS+gmF1tmFv6MybEt+OJrqvF4uUbWhPaSEuSyIfLTxZ2BXPDy639JAP6L9KOuAY6vum+q1+M8JgIsFK5+Kpm91Yhb/hyMVOqPpzusFK58Cyi8CW6XKBVkO0fdaRPZuPdH2F8Bw10TojsDUDR8NXhAz+Zal/aeemoRiU54u5Peg8jqwqJxXzZESfkUkduXhb5KxWMz22+BaUFTe7xl/VtFDKBW3OFDbkRIuWMhAb3rz1z7YWBfxLePrLLGHEJ6oxZNEd/bLeiTAVvhAyL3px7/NqiERPnOvEjwg8Bz1JhDlK4n3XQjK5NUXROUtYFkd+TcRPTT1h7wzMNY27ZXR5XBrz1yrPrb9/PKZ/PQ+VPqBplqrBS6j1ks7T27K1OKZItk99rSKDgKP1qGqihwXndlTypCKmcNpTs7KO99kya4dJ9q+d2N4Ccmt42u1YB8AuhzQq+7ZqsOTkypRhopy7RS1ymkV1KyiNadALxWVw48P5Wic9SL0JZimLrYOVJt258NoLjfdjMGc/drzp9p/A/+LifEBI953IWjduDYA7KV+efxT0beLimSfEz6w3156z1B05LGciV2uT0omX9gBKsqpKW77yGeW81XhyQjkydnVsAqV4OlQ6ukh3GG5dt13asGX24SFy7XzcmoKX69FkuHMJkUOFhXpnp3p9nG/dP0Lkfw0vXa0M6IAAAAASUVORK5CYII="/';
    // Добавляем иконки
    var wc = $("<li class=my_btn><img id=at_count alt='Получить объемы рынков' title='Получить объемы рынков' " + value_market_png +"> </li>");

    var container = $('ul.tabu');
    container = $("li:last", container).prev().parent();
    container.append(wc);

    var wc_supply = $("<li class=my_btn><img id=at_supply alt='расчитать снабжение' title='расчитать снабжение' " + img_supply + "> </li>");
    container.append( wc_supply );

    $("#childMenu").before(wc_text);
    $("#at_supply").hide();

    $("#at_supply").click( function() {
        $(".market_size").click();
    });

    $("#at_count").click(function(){
        //console.log('at_count');

        // считываем страницу торгового зала, что бы получить ссылки на рынки товаров магазина
        get_trading_hall();

        //ar main = $("#mainContent")
        ///img/products/bigwatches.gif
        //var goods = $("a[href^='https://virtonomica.ru/vera/main/globalreport/marketing/by_trade_at_cities'] img[src^='/img/products/']", main);
        //console.log( goods );


    });

    function get_trading_hall(){
        var href = location.href.replace('supply','trading_hall');
        $("#at_supply").show();
        //console.info( href );
        $.get(href, function(data) {
            var main = $("#mainContent", data);
            //var goods = $("a[href^='https://virtonomica.ru/vera/main/globalreport/marketing/by_trade_at_cities'] img[src^='/img/products/']", main);
            var goods = $("a[href^='" + url_report +"'] img[src^='/img/products/']", main);
            //console.info( goods );

            for(var i=0; i< goods.length; i++){
                //console.log( "next = " +goods.eq(i).parent().attr('href') );
                url = goods.eq(i).parent().attr('href');
                //console.log(url);

                var link_api = url_api + url.replace(url_report, "");
                //console.info(link_api);

                good_img = goods.eq(i).attr('src');
                //console.log( good_img );

                getAPI_data(link_api, good_img, function(loc){
                    //console.info(loc);

                    var img = $("img[src='" + loc.link+ "']");
                    //console.info( img );

                    img.parent().append('<br>' + loc.Html( loc.count ) )
                });
                //break;
            }
            // считаем что через 2 секунды мы смогли получить данные и ставим на них функцию
            setTimeout(function(){
                $(".market_size").css("cursor","pointer");
                $(".market_size").click(function(){
                    //console.info('market_size');
                    var tr = $(this).parent().parent().parent().parent().parent().parent();
                    //console.info( tr.html() );
                    var table = $("table.noborder", tr).eq(1);
                    //console.info( table );

                    var el = $("td:contains('Количество')", table).next();
                    var storage = parseInt( $.trim( el.text().replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '').replace(' ', '') ) );
                    console.info( storage );

                    var target = parseInt( $(this).attr('market_size') );

                    target = Math.round( target * 0.25 - storage );
                    if ( target < 0 ) target = 0;

                    //<input value="0" name="supplyContractData[quality_constraint_min][2618171]"
                    var inp = $("input[name*='party_quantity']", tr);
                    inp.val( target );

                });
            }, 2000);
        });
    }

    function getAPI_data(url, good_img, callback)
    {
        $.get(url, function(data) {
            //console.info( data );
            var price_mest = parseFloat( data.local_price );
            var qv_mest = parseFloat( data.local_quality );
            var count_market = parseInt( data.local_market_size );

            var LT = new Local_Trader(price_mest, qv_mest, count_market, good_img);
            callback(LT);
        });
    }


    console.log('Atlantis shop count end');
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}