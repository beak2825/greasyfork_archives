// ==UserScript==
// @name        Atlantis:shop_price
// @namespace   virtonomica
// @description Установка цена по местным
// @license MIT
// @include     https://*virtonomic*.*/*/main/unit/view/*/trading_hall
// @version     0.13
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31389/Atlantis%3Ashop_price.user.js
// @updateURL https://update.greasyfork.org/scripts/31389/Atlantis%3Ashop_price.meta.js
// ==/UserScript==
var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    var url_report = "https://virtonomica.ru/vera/main/globalreport/marketing/";
    var url_api = "https://virtonomica.ru/api/vera/main/marketing/report/retail/metrics";

    var loc_storage = function(){
        return({
            'save': function (name,  val){
                try {
                    window.localStorage.setItem( name,  JSON.stringify( val ) );
                } catch(e) {
                    out = "Ошибка добавления в локальное хранилище";
                    //console.log(out);
                }
            },
            'load': function(name){
                obj = JSON.parse( window.localStorage.getItem(name) );
                if ( obj == null ) obj = new Object();
                return obj;
            }
        });
    }

    // Объект с данными о локальных торговцах
    function Local_Trader( price, qv, link )
    {
        this.price = parseFloat(price);
        this.qv = parseFloat(qv);
        this.link = link;
    }
    Local_Trader.prototype.Html = function( val ){
        return '<hr><span style="color:grey" title="Местные поставщики">' + numberFormat( Math.round(val*100)/100 ) + '</span>'
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

    var LS = new loc_storage();

    var wc_text = $('<div id=at_text>');
    // Добавляем иконки
    var wc = $("<li class=my_btn><img id=at_price alt='Выставить цены' src=https://cdn1.iconfinder.com/data/icons/CrystalClear/48x48/apps/aim_protocol.png title='Выставить цены'> </li>");

    var value_market_png = 'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAACD0lEQVRIie3VzWoTURjG8f87zacGS7sSGxGR0GDpRgLpgKA3YFMvQRBMhYKU4sdeELqI4KIVWvAWml6DkFAiEaSWkoXUtF1q6gdtcjI5LkIxiTOTOB3rps9uzpk5vznMed+Bs5xS5KQLpF5XfoDsgt4S9PpRK7z24eGVr6cB656hA4TF4M/Iy8L85cMTwebq5qhSoRmEaZAk6Hgpm4g5wMcpBXVrpjA7vmc3GXAFc9WoitbnVVM/RrjQHnVy/khKiVE0l7en7HDD6an0SiWuzh29RfRzOEb/OnElxtrtN58iA8HplUq8aVEEbngEO5P63mg+6gubuWrUssgLjPmAAiCap5NLOyOucOP84QL+7LQzwxGpZxxhc3VzVLQs+IwC0BKmHWHVDN3F+0FyjWBcd4SBO/8CbUdf6rzqrmNhYvAybaeUTXjqft071lz0soiXuHYut7i0yt58K2UTw72Dvd943+uLuMR2zV74o/+u2K7ZBQt63X+YfF84EFB54MBHtNYMD9lupgsu3J/4grDoG6v1i/f3rtb6wgCxUCAHlHxgN2KR4CunSdviN5e3x5QYRSDuEa1aypoqzyUdq8T2f1yYHd+zlJUGNjygZS3GTTfUEQYozyX3Y+HALS08Y7ADV0PrJ7UG5rsH1z73u3mgPju5tDMSkXpGi2SAJL8/wa5GbyFG3goN5Z0O0ln+a34BvwCkhBG1DgMAAAAASUVORK5CYII="/';

    var wc2 = $("<li class=my_btn><img id=at_local alt='Получить цены местных' " + value_market_png + " title='Получить цены местных'> </li>");

    var container = $('ul.tabu');
    container = $("li:last", container).prev().parent();
    container.append(wc).append(wc2) ;

    $("#childMenu").before(wc_text);

    var wc_form = $('<table><tr><td>Процент от местных (не более чем %):<td><input type="text" id=at_pr value=220><tr><td colspan=2 align=center><button id=at_bt_pr>Выставить</button>');
    $("#at_text").html(wc_form).hide();

    wc.click(function(){
        $("#at_text").toggle();
    });

    $("#at_local").click(function(){
        //console.log('at_local');
        var main = $("#mainContent")
        ///img/products/bigwatches.gif
        var goods = $("a[href^='" + url_report +"'] img[src^='/img/products/']", main);
        //https://virtonomica.ru/vera/main/globalreport/marketing/?product_id=15334&geo=310392/310393/310398
        //console.log( goods );

        for(var i=0; i< goods.length; i++){
            //console.log( "next = " +goods.eq(i).parent().attr('href') );
            url = goods.eq(i).parent().attr('href');
            var link = url_api + url.replace(url_report, "");


            //console.info(link);
            getAPI_data(link, function(loc){
                //console.info(loc);

                var el = $("td[title*='"+loc.link+"']").next().next().next().next().next().next().next().next().next();
                var shop_price = parseFloat( el.text().replace("$","").replace(/\s/g, '') ) ;
                var el_price = $("td[title*='"+loc.link+"']").next().next().next().next().next().next().next();
                var my_price = $("input", el_price).val();
                var my_qv = parseFloat( $("td[title*='"+loc.link+"']").next().next().next().next().text() );
                var market = parseFloat( $("td[title*='"+loc.link+"']").next().next().next().next().next().next().next().next().text().replace("%","").replace(/\s/g, '') );

                if ( my_price < shop_price ) el.css('background-color', '#ffcf00');


                if ( my_price < loc.price ) {
                    el_price.css('background-color', '#ffcf00');
                    console.log(my_price + " ???? " +loc.price);
                }

                el.append( loc.Html(loc.price)  );
                el.next().append(loc.Html(loc.qv) );

                //console.info( my_qv );

                if ( isNaN( my_qv) ) return;

                var my_k = loc.price * Math.sqrt(my_qv / loc.qv);
                //var loc_k = loc.price * Math.sqrt(loc.qv);

                //console.log("my_price=" + my_price + ", my_k=" + my_k );

                if ( my_k > my_price ) el_price.css('background-color', 'rgb(163, 229, 231)');

                if (market > 88 ) $("td[title*='"+loc.link+"']").next().next().next().next().next().next().next().next().css('background-color', '#E9C7A1');

            });

            /*
                        getURL_data(url, function(loc){
                            //console.log(loc);
                            var el = $(loc.link).parent().next().next().next().next().next().next().next().next().next();
                    var shop_price = parseFloat( el.text().replace("$","").replace(/\s/g, '') ) ;
                    var el_price = $(loc.link).parent().next().next().next().next().next().next().next();
                    var my_price = $("input", el_price).val();
                    var my_qv = parseFloat( $(loc.link).parent().next().next().next().next().text() );
                    var market = parseFloat( $(loc.link).parent().next().next().next().next().next().next().next().next().text().replace("%","").replace(/\s/g, '') );
                    //console.info( my_qv );
                    //console.info( shop_price) ;
                    if ( my_price < shop_price ) el.css('background-color', '#ffcf00');

                    if ( my_price < loc.price ) el_price.css('background-color', '#ffcf00');

                             el.append( loc.Html(loc.price)  );
                            el.next().append(loc.Html(loc.qv) );

                    //console.info( my_qv );

                    if ( isNaN( my_qv) ) return;

                    var my_k = loc.price * Math.sqrt(my_qv / loc.qv);
                    //var loc_k = loc.price * Math.sqrt(loc.qv);

                    //console.log("my_price=" + my_price + ", my_k=" + my_k );

                    if ( my_k > my_price ) el_price.css('background-color', 'rgb(163, 229, 231)');

                    if (market > 88 ) $(loc.link).parent().next().next().next().next().next().next().next().next().css('background-color', '#E9C7A1');
                        });
                        //break;
              */
        }

    });

    const wait = (i, ms) => new Promise(resolve => setTimeout(() => resolve(i), ms));

    $("#at_bt_pr").click(function(){
        //console.log('at_bt_pr');

        var main = $("#mainContent")
        ///img/products/bigwatches.gif
        //var goods = $("a[href^='https://virtonomica.ru/vera/main/globalreport/marketing/by_trade_at_cities'] img[src^='/img/products/']", main);
        var goods = $("a[href^='" + url_report +"'] img[src^='/img/products/']", main);

        for(var i=0; i< goods.length; i++){
            url = goods.eq(i).parent().attr('href');
            var link = url_api + url.replace(url_report, "");

            getAPI_data(link, function(loc){
                var el = $("td[title*='"+loc.link+"']").next().next().next().next().next().next().next().next().next();
                my_procent = parseFloat( $("#at_pr").val() );

                var my_qv =  parseFloat( $("td[title*='"+loc.link+"']").next().next().next().next().text() )
                if ( isNaN(my_qv) ) {
                    my_qv =1;
                }
                var k = Math.sqrt(my_qv / loc.qv);

                var my_brand = parseFloat( $("td[title*='"+loc.link+"']").next().next().next().next().next().text() )
                if (my_brand > 0) {
                    k*= Math.sqrt( my_brand );
                }

                if ( k > my_procent/100) k = my_procent/100

                var new_price = Math.round( k * loc.price );

                var inp = $("input", el.parent() ).val( new_price );


            });
            //await new Promise(res => setTimeout(res, 1500 * i));
            //console.log(i + ":------------");

            //await wait(i, (i+1) * 1000);
            //console.info(link);

            /*
                  //console.log( "next = " +goods.eq(i).parent().attr('href') );
                  url = goods.eq(i).parent().attr('href');
                  getURL_data(url, function(loc){
                      //console.log(loc);
                      var el = $(loc.link).parent().next().next().next().next().next().next().next().next().next();
                      my_procent = parseFloat( $("#at_pr").val() );

                      var my_qv =  parseFloat( $(loc.link).parent().next().next().next().next().text() )
                      if ( isNaN(my_qv) ) {
                          my_qv =1;
                      }else {
                          //console.log(loc);
                      }

                      //console.log("my_qv= " + my_qv);
                      var k = Math.sqrt(my_qv / loc.qv);

                      var my_brand = parseFloat( $(loc.link).parent().next().next().next().next().next().text() )
                      if (my_brand > 0) {
                          k*= Math.sqrt( my_brand );
                      }

                      if ( k > my_procent/100) k = my_procent/100

                      var new_price = Math.round( k * loc.price );

                      var inp = $("input", el.parent() ).val( new_price );
                  });
                  //break;
            */
        }
    });

    function getAPI_data(url, callback)
    {
        $.get(url, function(data) {
            //console.info( data );

            var LT = new Local_Trader(data.local_price, data.local_quality, data.name);
            console.log(url + " OK");
            callback(LT);
        }).fail(function ( err ){
            console.log( url + " " +err.status + " " + err.statusText );
            setTimeout( getAPI_data(url, callback), 1500 + Math.random()* 1500);
            console.log( url + " " +err.status + " " + err.statusText + ".............");
        });
    }

    function getURL_data( url, callback )
    {
        $.get(url, function(data) {
            var tr = $("table.grid th:contains('Местные поставщики')", data).parent();
            // цена местных
            var price_mest = parseFloat( $.trim( $("td:eq(0)", tr.next() ).text() ).replace('$','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','') );
            //console.log( price_mest );

            // кач.местных
            var qv_mest = parseFloat( $.trim( $("td:eq(0)", tr.next().next() ).text() ).replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','').replace(' ','') );
            //console.log( qv_mest );

            // this.products[a]['id'] == 351577 ?
            var find_str = "this.products[a]['id'] ==";
            var npos = data.indexOf( find_str );
            //console.log( "npos=" + npos );
            var substr = data.substr( npos + find_str.length );
            npos = substr.indexOf( "?" );
            substr = $.trim( substr.substr(0, npos) );

            //console.log( substr );
            // собираем ссылку
            var find_url = "by_trade_at_cities/";
            npos = url.indexOf(find_url);
            //console.log( "npos=" + npos );
            var left_url = url.substr(0, npos+find_url.length );
            var rigth_url = url.substr(npos+find_url.length  );
            //console.log(left_url + "..." + rigth_url);
            npos = rigth_url.indexOf("/");
            rigth_url = rigth_url.substr(npos);
            //console.log(rigth_url);

            var good_url = left_url + substr + rigth_url;
            //console.log(good_url);

            var str = "a[href='"+ good_url+ "']";

            var LT = new Local_Trader(price_mest, qv_mest, str);
            callback(LT);
        });

    }

    console.log('Atlantis shop price end');
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}