// ==UserScript==
// @name        animals_sell
// @namespace   virtonomica
// @description групповое перемещение животных на склад и закупка питания
// @version     1.02
// @author      ctsigma
// @include     http*://virtonomic*.*/*/main/company/view/*/unit_list/animals
// @include     http*://virtonomic*.*/*/window/unit/equipment_animal/*/move_to_storage
// @include     http*://virtonomic*.*/*/main/unit/view/*/supply
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18428/animals_sell.user.js
// @updateURL https://update.greasyfork.org/scripts/18428/animals_sell.meta.js
// ==/UserScript==

var run = function(){

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;

    function doit (arr,data) {
        if (data === undefined) data = '';
        var total = arr.length-1;
        try {

            $('<div id="js-wall" style="position: fixed; top: 0px; left: 0px; background-color: black; z-index: 100000; opacity: 0.2;" />').height($(window).height()).width($(window).width()).prependTo('body');
            $('<div id="js-progress" style="color: black; top: ' + $(window).height() / 2 + 'px; position: fixed; z-index: 10000; font-size: 40pt; text-align: center;" >Выполнено: <span id="js-curr"></span>/' + total + '</div>').width($(window).width()).prependTo('body');

            var num = 1;
            handle = function() {
                if (num >= arr.length) {
                    $('#js-progress').remove();
                    $('#js-wall').remove();
                    alert('Операция выполнена для предприятий: ' + (num-1));
                    history.back();
                    return;
                }

                $('#js-curr').text(num);
                var obj = arr[0].replace('%id%',arr[num]);
                num++;
                $.post(obj,data,handle);
            };

            setCookie('units', 0, -1);
            handle();

        } catch(ex) {
            alert(ex);
        }

    }
    var redirect = function (event) {
        var realm = readCookie('last_realm');
        var arr = [];
        var url = event.target.name.replace('%realm%', realm);
        arr[arr.length] = url;
        $('table.list>tbody>tr:gt(0):has(:checkbox) input:checked').each(function(){
            var id = $(this).attr('id').replace('unit_','');
            //        arr[arr.length] = url.replace('%id%',id);
            arr[arr.length] = id;
        });
        var units = arr.join(',');
        if (units.length > 4090 ) {alert('Выбрано слишком много подразделений. (l='+units.length+'). Операция прервана.');return false;} //размер cookie не больше 4К
        setCookie('units', arr.join(','));
        if (arr.length>0) {
            url = arr[0].replace('%id%',arr[1]);
            try {
                window.location = url;
            } catch (ex) {
                alert('Error: ' + ex);
            }
        }
    };

    function moveToStorage(){
        var arr = readCookie('units');
        if (arr === null) {return false;}
        arr = arr.split(',');
        $('.button205').unbind().click(function() {
            var data = $('form[name=unitEquipmentTerminate]').serialize();
            doit(arr, data);
            return false;
        });
    }

    function SupplyFeed(){
        var realm = readCookie('last_realm');
        var vendorID = parseInt($( '#vendorID' ).prop('value'));
        var productID = parseInt($( '#productID' ).prop('value'));
        var Qty = parseInt($( '#productQty' ).prop('value'));
        var params = "";
        $('table.list>tbody>tr:gt(0):has(:checkbox) input:checked').each(function(){
            var id = $(this).attr('id').replace('unit_','');
            params = params + "unit["+id+"]=on&unit["+id+"][qty]="+Qty+"&";
        });

        if (params.length === 0) {alert('Не выбраны подразделения.');return;}
        params = params + "contractit=Заказать";
        var SupplyURL = location.origin+"/%realm%/window/unit/supply/multiple/vendor:%vendorid%/product:%productid%/brandname:0";
        SupplyURL = SupplyURL.replace('%realm%', realm).replace('%vendorid%', vendorID).replace('%productid%', productID);

        $.ajax({ //отправляем форму на сервер
            type:"POST",
            async: false,
            url:SupplyURL,
            data:params
        });
        alert('ok');
    }

    var MoveToStorageURL = /window\/unit\/equipment_animal\/\d+\/move_to_storage$/;
    var SupplyFeedURL = /main\/unit\/view\/\d+\/supply$/;
    if (MoveToStorageURL.test(document.location.href)) {moveToStorage();}
    //else if (SupplyFeedURL.test(document.location.href)) {SupplyFeed();}
    else {
        var bId = 0;
        $('legend:contains("Операции с животными выбранных ферм")').next().children().children().each(function() {
            var b1 = $('<td><input value="Продажа животных" id="moveStorage_'+bId+'" class="button130" type="button" name="/%realm%/window/unit/equipment_animal/%id%/move_to_storage"></td>').click(redirect);
            var b2 = $('<td><input value="Корм для животных" id="supplyFeed_'+bId+'" class="button130" type="button" name="http://virtonomica.ru/%realm%/main/unit/view/%id%/supply"></td>').click(SupplyFeed);
            $(this)
                .append($('<td width="5"><img width="1" border="0" height="1" alt="" src="/img/1.gif"></td>'))
                .append(b1)
                .append($('<td width="5"><img width="1" border="0" height="1" alt="" src="/img/1.gif"></td>'))
                .append(b2)
                .append($('<td width="5"><img width="1" border="0" height="1" alt="" src="/img/1.gif"></td>'))
                .append($('<td>vendorID:<input id="vendorID" title="Код подразделения" type="text" value="5959683" style="width:100px"></td>'))
                .append($('<td width="5"><img width="1" border="0" height="1" alt="" src="/img/1.gif"></td>'))
                .append($('<td>productID:<input id="productID" title="Код продукта" type="text" value="15746" style="width:100px"></td>'))
                .append($('<td width="5"><img width="1" border="0" height="1" alt="" src="/img/1.gif"></td>'))
                .append($('<td>Qty:<input id="productQty" title="Количество" type="text" value="" style="width:100px"></td>'))
            ;
            ++bId;
        });
    }
};

var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
