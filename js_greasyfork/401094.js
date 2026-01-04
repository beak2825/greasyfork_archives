// ==UserScript==
// @name         Tarif/Service
// @namespace    Tarif/Service
// @name:ru      Tarif/Service
// @description:ru     Инструмент для Beeline
// @description:en     Tool for Beeline
// @include     https://*.beeline.ru/*
// @version     0.1
// @grant       none
// @author      BEELINE
// @description Инструмент для Beeline
// @downloadURL https://update.greasyfork.org/scripts/401094/TarifService.user.js
// @updateURL https://update.greasyfork.org/scripts/401094/TarifService.meta.js
// ==/UserScript==

$('body').prepend(`
<style>
.zTool {
    margin: 10px;
}
.zTool * {
    margin: 5px;
}
.zTool pre {
    white-space: pre-wrap;
    word-wrap: break-word;
}
#socs th {
    border: 1px solid black;
    padding: 5px;
    font-weight: bold;
}
#socs td {
    border: 1px solid black;
    padding: 5px;
}
a {
    cursor: pointer;
}
</style>
`);

if (~$('body').text().indexOf('Войдите, чтобы получить доступ к вашим персональным данным.')) {
    $('body').prepend(`<div class="zTool"><b>Авторизируйтесь для пользования инструментом!</b></div>`);
} else {
    $('body').prepend(`
<div class="zTool">
    <hr>
    <section id="blockOff">
        
        <input hidden id="URLz" class="URIoff" size="100%" type="text">
        <input hidden id="URLzz" class="UURIoff" size="100%" type="text">
        
        <table id="dataoff">
            <tbody>
                <tr>
                    <td hidden>Имя:</td>
                    <td>Параметры:</td>
                </tr>
                <tr hidden class="get">
                    <td hidden>
                        <input type="text" value="X-Requested-With" size="30"> </td>
                    <td>
                        <input type="text" value="XMLHttpRequest" size="50"> </td>
                </tr>
                <tr hidden class="get">
                    <td hidden>
                        <input type="text" value="isMultiOffer" size="30"> </td>
                    <td>
                        <input id="soc_input" type="text" value="true" size="50" placeholder="Введите soc или нажмите на нужный ниже"> </td>
                </tr>
                <tr hidden class="get">
                    <td hidden>
                        <input type="text" value="freeActivation" size="30"> </td>
                    <td>
                        <input id="socс_input" type="text" value="true" size="50" placeholder="Введите сок скидки"> </td>
                </tr>
                            <tr hidden class="get">
                    <td hidden>
                        <input type="text" value="rcRatePeriod" size="30"> </td>
                    <td>
                        <input id="" type="text" value="1" size="50" placeholder=""> </td>
                </tr>
                            <tr hidden class="get">
                    <td hidden>
                        <input type="text" value="subgroupId" size="30"> </td>
                    <td>
                        <input id="" type="text" value="821232" size="50" placeholder=""> </td>
                </tr>
                                        <tr hidden class="get">
                    <td hidden>
                        <input type="text" value="campId" size="30"> </td>
                    <td>
                        <input id="" type="text" value="701080" size="50" placeholder=""> </td>
                </tr>
                                        <tr class="get">
                    <td hidden>
                        <input type="text" value="soc" size="30"> </td>
                    <td>
                        <input id="" type="text" value="" size="50" placeholder=" Введите СОК тарифа/услуги"> </td>
                </tr>
                            <tr class="get">
                    <td hidden>
                        <input type="text" value="discountSoc" size="30"> </td>
                    <td>
                        <input id="" type="text" value="" size="50" placeholder="Введите СОК скидки"> </td>
                </tr>
                            <tr hidden class="get">
                    <td hidden>
                        <input type="text" value="basketSocs" size="30"> </td>
                    <td>
                        <input id="" type="text" value="" size="50" placeholder="Соки корзины"> </td>
                </tr>
            </tbody>
        </table>
        <hr>
        <ul>
                    </td>
            </table>
        </ul>
        
Подключить:
        <button onclick="send('off')">Тариф</button>
        <button onclick="send1('off')">Услугу</button><br>
        <button onclick="getSocs()">Проверить подключенные услуги</button><br>




    </section>
    <hr>

    <span style="display: none" id="zLoading">Отправляем запрос...</span>
    <b id="zOtvetText" style="display:none">Ответ:</b>
    <pre id="zOtvet"></pre>

    <script>
        var socs = $('.soc');
        for (var i = 0; i < socs.length; i++) {
            socs[i].onclick = function() {
                $('#soc_input').val(this.innerHTML);
            }
        }
        var socs = $('.socс');
        for (var i = 0; i < socs.length; i++) {
            socs[i].onclick = function() {
                $('#socс_input').val(this.innerHTML);
            }
        }

        function send(type) {
            var data = [];
            $('#data' + type + ' tbody tr.get').each(function() {
                data[$(this).find('td:nth-child(1) input').val()] = $(this).find('td:nth-child(2) input').val();
            });
            data = Object.assign({}, data);
            $('#zLoading').show();
            $('#zOtvetText').hide();
            $('#zOtvet').hide();
            $.ajax({
                url: $('.URI' + type).val(),
                type: 'POST',
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(data),
                complete: function(jqXHR, textStatus) {
                    switch (jqXHR.status) {
                        case 200:
                            $('#zLoading').hide();
                            $('#zOtvetText').show();
                            var data = JSON.parse(jqXHR.responseText),
                                resp;
                            if (data.isSucceeded) {
                                resp = '<font color="green">Тариф успешно подключен!</font>';
                            } else {
                                resp = '<font color="red">Тариф не подключен!</font>';
                            }

                            $('#zOtvet').show().html(resp);
                            break;
                        default:
                            $('#zLoading').hide();
                            $('#zOtvetText').show();
                            $('#zOtvet').show().html('Какая-то ошибка!');
                    }
                }
            });
        }
        function send1(type) {
            var data = [];
            $('#data' + type + ' tbody tr.get').each(function() {
                data[$(this).find('td:nth-child(1) input').val()] = $(this).find('td:nth-child(2) input').val();
            });
            data = Object.assign({}, data);
            $('#zLoading').show();
            $('#zOtvetText').hide();
            $('#zOtvet').hide();
            $.ajax({
                url: $('.UURI' + type).val(),
                type: 'POST',
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(data),
                complete: function(jqXHR, textStatus) {
                    switch (jqXHR.status) {
                        case 200:
                            $('#zLoading').hide();
                            $('#zOtvetText').show();
                            var data = JSON.parse(jqXHR.responseText),
                                resp;
                            if (data.isSucceeded) {
                                resp = '<font color="green">Услуга успешно подключена!</font>';
                            } else {
                                resp = '<font color="red">Услуга не подключена!</font>';
                            }

                            $('#zOtvet').show().html(resp);
                            break;
                        default:
                            $('#zLoading').hide();
                            $('#zOtvetText').show();
                            $('#zOtvet').show().html('Какая-то ошибка!');
                    }
                }
            });
        }
        function getSocs() {
            $('#zLoading').show();
            $('#zOtvetText').hide();
            $('#zOtvet').hide();
            $.ajax({
                url: 'https://' + document.domain + '/gtm/getdatalayerauth',
                type: 'POST',
                contentType: "application/json;charset=UTF-8",
                complete: function(jqXHR, textStatus) {
                    switch (jqXHR.status) {
                        case 200:
                            $('#zLoading').hide();
                            $('#zOtvetText').show();
                            var list = [],
                                data = JSON.parse(jqXHR.responseText);
                            data = data.View.List[0].AvailableServices;
                            for (var i = 0; i < data.length; i++) {
                                list.push(data[i].AvailableServiceId + ' - ' + data[i].AvailableServiceName + '<br>');
                            }
                            $('#zOtvet').show().html(list);
                            break;
                        default:
                            $('#zLoading').hide();
                            $('#zOtvetText').show();
                            $('#zOtvet').show().html('Какая-то ошибка!');
                    }
                }
            });
        }
    </script>
</div>
`);
    document.getElementById('URLz').value = "https://"+document.domain+"/customers/products/mobile/tariffs/connecttariffbascket/"
    document.getElementById('URLzz').value = "https://"+document.domain+"/customers/products/mobile/services/connectmobileserviceforupsaleoffer/"
}