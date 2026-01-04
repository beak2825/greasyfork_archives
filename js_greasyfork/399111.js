// ==UserScript==
// @name        Virtonomica: Supply 2020
// @namespace   Virtonomica
// @description Выставление снабжения для МЦ, ресторанов (старый дизайн)
// @include     https://virtonomica.ru/vera/main/unit/view/*/supply
// @version     0.10
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/399111/Virtonomica%3A%20Supply%202020.user.js
// @updateURL https://update.greasyfork.org/scripts/399111/Virtonomica%3A%20Supply%202020.meta.js
// ==/UserScript==
var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    var api_token = "https://virtonomica.ru/api/vera/main/token";
    var api_view = "https://virtonomica.ru/api/vera/main/unit/view";

    //var api_supply = "https://virtonomica.ru/api/vera/main/unit/supply/materials";
    /** Получение данных о расходниках */
    var api_supply = "https://virtonomica.ru/api/vera/main/unit/supply/summary";
    // возможны изменения в адресе АПИ...
    //var api_offer = "https://virtonomica.ru/vera/ajax/unit/supply/create";
    var api_offer = "https://virtonomica.ru/vera/main/unit/supply/set";

    var api_test = "https://virtonomica.ru/api/vera/main/unit/supply/materials";

    var script_type = ['repair', 'medicine', 'educational', 'restaurant'];

    var div = $("div.content").eq(0);
    console.log("---Supply 2020---");
    console.info( div );
    div.after("<div id=ext_sup>...</div>");
    // поле для передаяи токена
    div.after("<span id=my_token style='display:none;'></span>");

    var unit_id = /(\d+)/.exec(location.href)[0];
    $.get( api_token, function( token ) {
        $("#my_token").text( token );

        $.post( api_view, {id:unit_id}).done( function( data ) {
            console.info(data);

            if ( !check_type( data.unit_class_kind) ) {
                $("#ext_sup").html('not supported');
                return;
            }
            // текущие продажи в посетителях
            var sales = parseInt( data.sales );
            // максимальыне продажи в посетителях
            var sales_max =  parseInt( data.sales_max );
            var token = $("#my_token").text();
            console.log( "sales_max = " + sales_max );

            console.log("unit_id=" + unit_id);
            $.post( api_supply, {id:unit_id, token: token}).done( function( dat_sup ) {
                console.log("--api_supply--");
                console.info(dat_sup);
                for( var key in dat_sup ){
                    //console.info( key );
                    console.info( dat_sup[key] );
                    if ( dat_sup[key].required == -1 ) {
                        continue;
                    }

                    var prod_name = dat_sup[key].product_name;
                    console.log("____________" + prod_name);
                    // максимальный продажи на сегодня (с учетом расходников, города и т.п.)
                    var req = parseInt( dat_sup[key].required );
                    // сколько на складе сейчас
                    var storage = parseInt( dat_sup[key].quantity );
                    // число расходников на одну продажу
                    var count_to_1_sale = 1;
                    if ( sales > 0 ) {
                        count_to_1_sale = req / sales;
                    }
                    console.log("count_to_1_sale=" + count_to_1_sale);

                    //var power_sup = sales_max * req ;
                    var power_sup = sales_max * count_to_1_sale  ;
                    var storage_target = power_sup * 5;
                    console.log("power_sup (storage_target) = " + storage_target);

                    if ( storage == 0 ) {
                        // если склад пуст, то давайте закупимся до максимума
                        storage_target = power_sup;
                    } else if ( (storage - sales * count_to_1_sale) < power_sup ){
                        storage_target = power_sup;
                    } else if ( storage <= storage_target ){
                        // надо дозакупать неспеша до максимума, неспеша, но больше чем продаем
                        console.log("----0---");
                        storage_target = sales * count_to_1_sale + ( storage_target - storage) /10;
                        console.log("-------storage_target--> " + storage_target);
                        if ( sales == 0 && storage <= power_sup * 2 ) {
                            storage_target = power_sup;
                            console.log("----sales=0---");
                        } else if ( storage + storage_target < sales * count_to_1_sale + power_sup ) {
                            console.log("----01---");
                            storage_target = 2 * power_sup - sales * count_to_1_sale ;
                            if ( storage_target > power_sup ) {
                                console.log("----02---");
                                storage_target = power_sup * 1.1;
                            }
                        }
                    } else if ( storage > storage_target * 2 ){
                        console.log("----2---");
                        storage_target = sales * count_to_1_sale + ( storage_target - storage )/14;
                    } else if ( storage > storage_target * 1.5 ) {
                        console.log("----3---");
                        storage_target = sales * count_to_1_sale + power_sup - ( storage  - power_sup )/30;
                    } else if ( storage > storage_target ){
                        console.log( "sales=" + sales + ", prod_name=" + prod_name + ", req=" + req + ", storage=" + storage + ", storage_target=>" + storage_target);
                        console.log("----1---");
                        console.log("( storage_target - storage )/50 = " + ( storage - storage_target )/50 );
                        storage_target = sales * count_to_1_sale - ( storage - storage_target )/50;
                        console.log( " storage_target=>" + storage_target);
                        // если продаж не было совсем (возможно что это новый запуск или был сбой с другим компонентом)
                        if ( sales == 0 && storage < 2 * power_sup * 5 ) {
                            // опробуем что-то закупить
                            storage_target = (2 * power_sup * 5 - storage) * 0.01;
                        }  else if ( storage_target <= sales * count_to_1_sale * 0.1 ) {
                            storage_target = sales * count_to_1_sale * 0.1;
                        }
                        console.log( "storage_target=>" + storage_target);
                    }
                    // если запасы очень-очень большие, все равно заказать хотя бы чуть чуть
                    if ( storage_target < sales * count_to_1_sale * 0.05 ) {
                        storage_target = Math.round( sales * count_to_1_sale * 0.05 );
                    }

                    storage_target = Math.round( storage_target );

                    console.log( "sales=" + sales + ", prod_name=" + prod_name + ", req=" + req + ", storage=" + storage + ", storage_target=>" + storage_target);

                    var els = $("input[name*='supplyContractData[party_quantity]']");
                    console.info( els );

                    var storage_current = storage_target;

                    // quality
                    var qty_max = -1;
                    var free_max = -1;
                    var offer_max = -1;
                    var count_offer = 0;
                    for( var cid in dat_sup[key].contracts ){
                        //console.info( dat_sup[key].contracts[cid] );
                        count_offer++;

                        var inp_id = dat_sup[key].contracts[cid].offer_id;
                        var free = parseInt( dat_sup[key].contracts[cid].free_for_buy );
                        var qty = parseFloat( dat_sup[key].contracts[cid].quality );
                        var supplier_name =  dat_sup[key].contracts[cid].supplier_name;

                        console.info(supplier_name + ": free=" + free + ", qty=" + qty );

                        var inp = get_offer_input( inp_id );
                        if ( inp == 0 ) {
                            console.log( "---inp==0");
                            continue;
                        }

                        console.log( "storage_current=" + storage_current + " ??? " + "free=" + free)
                        if ( storage_current < free ) {
                            inp.val( storage_current );
                            storage_current -= storage_current;

                            if ( qty_max < qty ) {
                                qty_max =  qty;
                                free_max = free;
                                offer_max = inp_id;
                            }

                        } else {
                            inp.val( free );
                            storage_current -= free;
                        }
                    }
                    console.log("------------********--------------" + storage_current);
                    if ( storage_current > 0 ) {
                        console.log( " smal ++++++++++");
                        $("#ext_sup").html( $("#ext_sup").html() + " " + prod_name + " problem");
                        addNotes(prod_name + " <font color=red>нехватка (" + storage_current + ")</font>");
                    }
                    // если два и более поставщика
                    if ( count_offer > 1 ) {
                        console.log("qty_max=" + qty_max + ", len=" + count_offer );
                        if ( qty_max > 0 ) {
                            if ( free_max > storage_target ) {
                                // если запасов хватает
                                for( var cid in dat_sup[key].contracts ){
                                    var inp_id = dat_sup[key].contracts[cid].offer_id;
                                    var free = dat_sup[key].contracts[cid].free_for_buy;
                                    var qty = dat_sup[key].contracts[cid].quality;

                                    var inp = get_offer_input( inp_id );
                                    if ( inp == 0 ) continue;

                                    if ( inp_id != offer_max ) {
                                        inp.val( 0 );
                                    } else {
                                        inp.val( storage_target );
                                    }
                                }
                            }
                        }
                    }
                }
                $("#ext_sup").html( $("#ext_sup").html() + " finish");

                function get_offer_input( offer_id )
                {
                    //if ( els.length == 0 ) return;
                    //console.log("get_input( " + offer_id + ")");

                    var els = $("input[name*='supplyContractData[party_quantity]']");
                    //console.info( els );

                    for( var k=0; k< els.length; k++){
                        //console.log("k=" + k);
                        //console.info( els.eq(k) );
                        var name = els.eq(k).attr('name').replace("supplyContractData[party_quantity][",'').replace("]","");
                        //console.log( name );
                        if ( name == offer_id) return els.eq(k);
                    }

                    return 0;
                }
            }).fail( function( data ) {
                $("#ext_sup").html('fail');
                console.info( data );
            });

        });

    });

    var loc_storage = function(){
        return({
            'save': function (name,  val){
                try {
                    window.localStorage.setItem( name,  JSON.stringify( val ) );
                    out = "Данные успешно сохранены";
                } catch(e) {
                    out = "Ошибка добавления в локальное хранилище";
                    //console.log(out);
                }
                return out;
            },
            'load': function(name){
                obj = JSON.parse( window.localStorage.getItem(name) );
                if ( obj == null ) obj = new Object();
                return obj;
            }
        });
    }
    /**
     * Добавить заметку к предприятию
     */
    function addNotes( msg ){
        // объект для хранения сообщений
        notes = JSON.parse( window.localStorage.getItem('notes') );
        if ( notes == null ) notes = new Object();

        // Идентификатор подразделения
        var id = /(\d+)/.exec(location.href)[0];

        // дизайно 16.10.2017
        var title = $("div.title h1").text();
        //var type = $.trim( $('ul.tabu li').eq(1).text() );

        var head = $("div.officePlace");
        var type = head.text();
        var nn = type.indexOf("компании");
        if (nn > 0){
            type = type.substring(0, nn);
            var ptrn = /\s*((\S+\s*)*)/;
            type = type.replace(ptrn, "$1");
            ptrn = /((\s*\S+)*)\s*/;
            type = type.replace(ptrn, "$1");
        } else {
            type = '';
        }

        if ( notes[id] == null ) notes[id] = new Object();

        var d = new Date();

        if ( notes[id]['text'] != null) {
            // сообщение для этого подраздления уже есть
            msg = notes[id]['text'] + "<br>" + msg;
        }

        notes[id]['text'] = msg;
        // Количество миллисекунд
        notes[id]['time'] = d.getTime();
        notes[id]['name'] = title;
        notes[id]['type'] = type;

        loc_storage().save('notes', notes);
    }

    function check_type( type )
    {
        var test = script_type.indexOf( type );
        if ( test == -1 ) return false;
        return true;
    }

}
if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}