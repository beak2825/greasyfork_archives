// ==UserScript==
// @name        Virtonomica: Копирование магазинов...
// @namespace   Virtonomica
// @description  Копирование магазинов через API
// @version  0.14
// @include     https://virtonomica.ru/vera/main/company/view/*/unit_list
// @include     https://virtonomica.ru/vera/main/company/view/*/unit_list?old
// @include     https://virtonomica.ru/vera/main/company/view/*/unit_list?new
// @include     https://virtonomica.ru/vera/main/company/view/*/unit_list/building
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/397274/Virtonomica%3A%20%D0%9A%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/397274/Virtonomica%3A%20%D0%9A%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%BE%D0%B2.meta.js
// ==/UserScript==
var run = function()
{
    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    //alert("start");
    function set_icon_button( unit_id, el, kind )
    {
        site_mode = $("#site_mode").text().trim();
        // режим создания минимального юнита
        var size_mode = "my_size='1'";
        //console.info( "(" + site_mode + ")" );
        if ( site_mode == "build_list" || site_mode == 'unit_list_new' ) {
            el = el.prev();
            //console.info( el );
            size_mode = "my_size='0'";
        }

        el.append("<div class=my_info id=inf_" + unit_id + "></div>");
        el.append("<span class='my_copy' my_kind='" + kind + "' " + size_mode +" shop='" + unit_id + "'>" + $("#img_copy").html() +"</span>");
        if ( kind == "shop" ) el.append("<span class='my_delete' shop='" + unit_id + "'>" + $("#img_del").html() +"</span>");

    }

    // старй дизайн списка юниов (2104 года)
    var tu = $("table.unit-list-2014");
    // если не нашли старй дизайн, то пробуем найти новый
    if ( tu.length == 0) {
        tu = $("table.unit_list_table");
    }
    if (tu.length == 1) {
        // Это у нас список подразделений - рисуем кнопку отображения активации
        // https://cdn2.iconfinder.com/data/icons/oxygen/32x32/apps/assistant.png
        // старый дизайн
        var menu = $("ul.tabu");
        // тут поискать бы новый дизайн (потом)
        if ( menu.length == 0 ) return;

        var company = /(\d+)/.exec(location.href)[0];

        menu.before("<span id=setting_out></span>");
        var wc_setting = $("<li id=setting_img class=my_btn> <img title='Новые кнопки' alt='Новые кнопки' src=https://cdn2.iconfinder.com/data/icons/oxygen/32x32/apps/assistant.png>");

        var li = $("li:last", menu).prev().parent();
        li.append( wc_setting );
        console.log("--add menu--");

        wc_setting.click(function(){
            // старый интерфейс 2014 года
            var table = $("table.unit-list-2014");
            var shop = $("td[class='info i-shop']", table);
            var med = $("td[class='info i-medicine']", table);
            // это будет как бы пусой объект
            var electro = $("span.no_no_no_class", table);
            var workshop = $("span.no_no_no_class", table);
            var animal = $("span.no_no_no_class", table);
            var animal_bee = $("span.no_no_no_class", table);
            var labs = $("span.no_no_no_class", table);
            var site_mode = "unit_list";

            if ( table.length == 0 ) {
                // а вдруг это строящиеся юниты
                table = $("table[class*='unit-construction']");
                site_mode = "build_list";

                if ( table.length == 0 ) {
                    // новый список
                    table= $("table[class*='unit_list_table']");
                    site_mode = "unit_list_new";
                }
                console.info( table );
                shop =  $("span[class*='ut-shop']", table).parent().parent();
                med = $("span[class*='ut-medicine']", table).parent().parent();
                console.info( med );
                // ut-medicine

                // мусоросжигательные
                electro = $("span[class*='ut-incinerator_power'], span[class*='ut-oil_power']", table).parent().parent();
                // заводы
                workshop = $("span[class*='ut-workshop']", table).parent().parent();
                // мельницы
                mill = $("span[class*='ut-mill']", table).parent().parent();
                // звериные фермы
                animal = $("span[class*='ut-animalfarm']", table).parent().parent();
                // пчелиные фермы
                animal_bee = $("span[class*='ut-apiary']", table).parent().parent();
                // лабораториии
                labs = $("span[class*='ut-lab']", table).parent().parent();

            }
            table.after("<div style='display: none;' id=site_mode>" + site_mode+ "</div>");
            table.after("<div style='display: none;' id=img_copy><img src=https://v1.iconsearch.ru/uploads/icons/musthave/48x48/paste.png title='Копировать подразделение'></div>");
            table.after("<div style='display: none;' id=img_del><img src=https://v1.iconsearch.ru/uploads/icons/nuove/128x128/tab_remove.png title='Удалить подразделение'></div>");


            console.log( "Virtonomica: Копирование магазинов..." );
            console.info( shop );


            var st = $("style");
            st.append(".my_copy, .my_delete{cursor:pointer;opacity:0.5;padding: 4px;}");
            st.append(".my_copy:hover{opacity:1.0}");
            st.append(".my_copy img, .my_delete img{width: 24px;}");
            //st.append(".my_delete{cursor:pointer;opacity:0.5;}");
            st.append(".my_delete:hover{opacity:1.0}");
            st.append(".my_info{display:none;padding: 4px;border: solid 1px;border-radius: 8px;}");
            st.append(".icopy{min-width: 80px;}");
            st.append(".my_ibtn{cursor:pointer;border: solid 1px;border-radius: 4px;text-align: center;}");
            st.append(".my_ibtn:hover{background-color: greenyellow;}");

            st.append("#setting_out{color:yellow;font-size: 12px;padding: 8px;}");
            //st.append(".my_btn img {width:24px;}");
            //st.append(".my_info{font-weight:bold;border-bottom: solid 1px;border-right: solid 1px;border-left: solid 1px;padding-left: 12px;padding-right: 12px;padding-right: 12px;background: lightgray;display: none;}");

            // Магазины
            shop.each( function(){
                //console.log( $(this).text() );
                var href = $("a", this);
                var shop_id = /(\d+)/.exec( href.attr('href') )[0];
                //console.log( shop_id );
                set_icon_button( shop_id, $(this), 'shop');
            });

            //Медцентры
            //var med = $("td[class='info i-medicine']", table);
            med.each(function() {
                //console.log( $(this).text() );
                var href = $("a", this);
                var shop_id = /(\d+)/.exec(href.attr('href'))[0];
                set_icon_button( shop_id, $(this), 'medicine');

            });

            // Электростанции
            electro.each(function(){
                var href = $("a", this);
                var shop_id = /(\d+)/.exec(href.attr('href'))[0];
                set_icon_button( shop_id, $(this), 'power');
            });

            // Заводы
            workshop.each(function(){
                var href = $("a", this);
                var shop_id = /(\d+)/.exec(href.attr('href'))[0];
                set_icon_button( shop_id, $(this), 'workshop');
            });
            // мельницы
            mill.each(function(){
                var href = $("a", this);
                var shop_id = /(\d+)/.exec(href.attr('href'))[0];
                set_icon_button( shop_id, $(this), 'mill');
            });
            // звериные фермы
            animal.each(function(){
                var href = $("a", this);
                var shop_id = /(\d+)/.exec(href.attr('href'))[0];
                set_icon_button( shop_id, $(this), 'animalfarm');
            });
            // пчелиные фермы
            animal_bee.each(function(){
                var href = $("a", this);
                var shop_id = /(\d+)/.exec(href.attr('href'))[0];
                set_icon_button( shop_id, $(this), 'animalfarm');
            });
            // лаборатории
            labs.each(function(){
                var href = $("a", this);
                var shop_id = /(\d+)/.exec(href.attr('href'))[0];
                set_icon_button( shop_id, $(this), 'lab');
            });

            // Кнопки
            $(".my_copy").click( function () {
                var shop_id = $(this).attr('shop');
                var kind = $(this).attr('my_kind');
                var size = $(this).attr('my_size');

                console.log( '--click--my_copy---' + shop_id + "(" + kind + ")");

                var form = "Число копий: <input class=icopy id=icopy_" + shop_id + " type=number value='1' my_kind=" + kind +" my_size=" + size + "/>";
                form+= "<div id=run_" + shop_id + " class=my_ibtn shop='" + shop_id + "'>RUN</div>";

                $("#inf_" + shop_id).html( form ).show();

                $("#run_" + shop_id).click(function () {
                    var shop_id = $(this).attr('shop');
                    var copy = $("#icopy_" + shop_id);
                    console.info( copy );
                    console.log( '--run---' + shop_id + ". copy:" + copy.val() );

                    $("#inf_" + shop_id).hide();

                    $.get("https://virtonomica.ru/api/vera/main/token", function( token ) {
                        console.log( token );
                        $.post("https://virtonomica.ru/api/vera/main/unit/view", {id:shop_id}).done( function( data ) {
                            console.log( data );
                            var copy = $("#icopy_" + data.id).val();
                            var kind = $("#icopy_" + data.id).attr('my_kind');
                            var size = $("#icopy_" + data.id).attr('my_size');
                            console.log( "copy=" + copy +", kind=" + kind + ", size=" + size + "|");
                            for( var s=0; s<copy; s++) {
                                console.log("s=" +s );
                                //$.post("https://virtonomica.ru/api/vera/main/unit/info", {id:shop_id}).done( function( data) {
                                var new_size = 1;
                                var distict = data.district_id;
                                if ( size == "0/" ) {
                                    new_size = data.size;
                                    distict = 0;
                                }
                                if ( kind == "shop") {
                                    new_size = data.size;
                                    distict = data.district_id;
                                }


                                $.post("https://virtonomica.ru/api/vera/main/company/build", {token:token, id:company, kind: kind, name: data.name + "~" + (s+1), args:{produce_id:data.unit_type_produce_id, city_id: data.city_id, size: new_size, district_id: distict} }).done( function() {
                                    console.log( data );
                                    $("#setting_out").html( $("#setting_out").html( ) + "создано:" + data.unit_class_kind + " : " + data.id + "<br>");
                                })
                            }
                        });
                    });
                });
            });


            $(".my_delete").click( function () {
                var shop_id = $(this).attr('shop');
                console.log( '--click--my_delete---' + shop_id );

                var form = "<div id=del_" + shop_id + " class=my_ibtn shop='" + shop_id + "'>DEL</div>";

                $("#inf_" + shop_id).html( form ).show();

                $("#del_" + shop_id).click(function () {
                    var shop_id = $(this).attr('shop');
                    var copy = $("#icopy_" + shop_id);
                    console.info( copy );
                    console.log( '--del---' + shop_id + ". copy:" + copy.val() );

                    $("#inf_" + shop_id).hide();

                    $.get("https://virtonomica.ru/api/vera/main/token", function( token ) {
                        console.log( token );
                        $.post("https://virtonomica.ru/api/vera/main/unit/view", {id:shop_id}).done( function( data ) {
                            console.log( data );
                            console.log( "copy=" + copy );

                            //$.post("https://virtonomica.ru/api/vera/main/unit/info", {id:shop_id}).done( function( data) {

                            $.post("https://virtonomica.ru/api/vera/main/unit/destroy", {token:token, id:data.id}).done( function( data ) {
                                //console.log( data );
                                //console.log( "shop_id=" + shop_id  );
                                $("#setting_out").html( $("#setting_out").html( ) + "удалено<br>");
                            });
                        });
                    });
                });
            });
        });
    }
    console.log("--end main build--");
    //return;
    // -- DEBUG ----



}
if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}