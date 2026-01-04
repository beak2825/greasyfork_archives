// ==UserScript==
// @name        Билайн Рабочий НОЯБРЬ!
// @namespace   Билайн скрипт НОЯБРЬ!
// @name:ru     Билайн Рабочий НОЯБРЬ!
// @description:ru     Билайн Рабочий НОЯБРЬ
// @description:en     Tools for Beeline
// @include     https://*.beeline.ru/*
// @version     14.5 | 14.5
// @grant       none
// @author      Работающий скрипт для скидок Билайн (@airenexxx_tg)!
// @description Билайн Рабочий НОЯБРЬ
// @downloadURL https://update.greasyfork.org/scripts/402422/%D0%91%D0%B8%D0%BB%D0%B0%D0%B9%D0%BD%20%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D0%9D%D0%9E%D0%AF%D0%91%D0%A0%D0%AC%21.user.js
// @updateURL https://update.greasyfork.org/scripts/402422/%D0%91%D0%B8%D0%BB%D0%B0%D0%B9%D0%BD%20%D0%A0%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B9%20%D0%9D%D0%9E%D0%AF%D0%91%D0%A0%D0%AC%21.meta.js
// ==/UserScript==

$('body').prepend(`
<style>
.zTool {
    margin: 15px;
}
.zTool * {
    margin: 5px;
}
.zTool pre {
    black-space: pre-wrap;
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
        Адрес:
        <input id="URLz" class="URIoff" size="100%" type="text">
        <hr>
        <table id="dataoff">
            <tbody>
                <tr>
                    <td>Имя:</td>
                    <td>Значение:</td>
                </tr>
                <tr class="get">
                    <td>
                        <input type="text" value="X-Requested-With" size="30"> </td>
                    <td>
                        <input type="text" value="XMLHttpRequest" size="50"> </td>
                </tr>
                <tr class="get">
                    <td>
                      <input type="text" value="soc" size="30"> </td>
                    <td>э
                        <input id="soc_input" type="text" value="" size="50" placeholder="Введите soc или нажмите на нужный ниже"> </td>
                </tr>
                <tr class="post">
                   td>
                </tr>
            </tbody>
        </table>
        <hr>
        <ul>
            <table id="socs">
                <tr>
                    <th>Всё за 90</th>
                    <th>Всё только для своих</th>
                    <th>Скидочки для всех! -__-</th>
                    <th>Ссылка на ВТДС и Вз90</th>
                </tr>
                <tr>
                    <td>

                        <p><a class="soc">06TMALL90</a> - СФО</p>
                        <p><a class="soc">04CBM_1</a> - ЮФО и СКФО </p>
                        <p><a class="soc">08ALL90</a> - УрФО</p>
                        <p><a class="soc">TMVS90</a> - ЦФО (Москва)</p>
                        <p><a class="soc">ххTMVSE_S</a> - ЦФО (хх – код рег.)</p>
                        <p><a class="soc">03TMVZ_1</a> - ПФО</p>
                        <p><a class="soc">49TM90</a> - ДФО</p>

                    </td>
                    <td>
                        <p><a class="soc">06VSERLTS</a> - СФО</p>
                        <p><a class="soc">04VSERTLS</a> - ЮФО и СКФО</p>
                        <p><a class="soc">CNTVSRLTS</a> - УрФО</p>
                        <p><a class="soc">VIPVSRLTS</a> - ЦФО (Москва)</p>
                        <p><a class="soc">CRVSRLTS</a> - ЦФО</p>
                        <p><a class="soc">BMVSRLTS</a> - ЦФО (Владимир, Рязань)</p>
                        <p><a class="soc">BRNVSRLTS</a> - ЦФО (Брянск)</p>
                        <p><a class="soc">CNTVSRLTS</a> - ПФО</p>
                        <p><a class="soc">NNGVSRLTS</a> - ПФО (Ниж.Новгород)</p>
                        <p><a class="soc">SZVSRLTS</a> - СЗФО</p>
                     </td>
                     <td>
                        <p><a class-"soc">TMDIS90</a> - Скидончик 90% (бессрочно) </p>
                        <p><a class-"soc">TMDIS80</a> - Скидончик 80% (бессрочно)</p>
                        <p><a class-"soc">TMDIS70</a> - Скидончик 70% (бессрочно) </p>
                        <p><a class-"soc">TMDIS60</a> - Скидончик 60% (бессрочно)</p>
                        <p><a class-"soc">TMDISC90</a> - Скидончик 90% (12 месяцев) </p>
                        <p><a class-"soc">ORSCM_T_E</a> - Скидончик 80% (12 месяцев) </p>
                        <p><a class-"soc">TMDISC70</a> - Скидончик 70% (12 месяцев) </p>
                        <p><a class-"soc">ORSCM_T_F</a> - Скидончик 60% (12 месяцев) </p>
                        <p><a class-"soc">TMDISC50</a> - Скидончик 50% (12 месяцев) </p>
                        <p><a class-"soc">SALE_50</a> - Скидончик 50% (1 месяц) </p>
                        <p><a class-"soc">DISC50_6</a> - Скидончик 50% (6 месяцев) </p>
                        <p><a class-"soc">ORSCM_T_S</a> - Скидончик 40% (12 месяцев) </p>
                        <p><a class-"soc">ORSCM_O_H</a> - Скидончик 100% (1 месяц) </p>
                        <p><a class-"soc">DISCONV</a> - Скидка 100% (Стоимость подкл. около 60р.(от региона зависит) </p>
                    </td>
                    <td>
                        <p><a >Всё для своих</a> - <a href="https://beeline.ru/customers/products/mobile/tariffs/details/vsye-dlya-svoikh/" target="_blank">Описание тарифа</a></p>
                        <p><a >Секунда</a> - <a href="https://beeline.ru/customers/products/mobile/tariffs/details/sekunda/" target="_blank">Описание тарифа</a></p>
                        <p><a >Би+</a> - <a href="https://beeline.ru/customers/products/mobile/tariffs/details/bi-plus/" target="_blank">Описание тарифа</a></p>
                        <p><a >Всё для тебя (ПФО)</a> - <a href="https://beeline.ru/customers/products/mobile/tariffs/details/vse-dlya-tebya/" target="_blank">Описание тарифа</a></p>

                    </td>
                    <td>
                        <p><a >https://beeline.ru/customers/products/mobile/tariffs/detailsbysoc/XXXXX/</p>
                        <p><a >XXXXX – soc тарифа</p>
                        <p><a >78SEB -"Где 78 меням под свой регион" тариф с которого можно бесплатно переходить.(Семья для перевода на другой тариф)</p>
                        <p><a >YUG_SEB - Сок ЮГА
                          <p><a >56SEB - Сок ПФО
                          <p><a > Также у меня есть приватная группа. Где собрана почти вся база билайна и не только билайна
                          <p><a > Мой телеграмм для вопросов - https://t.me/spacexrr
                    </td>
                </tr>
            </table>
        </ul>
        <hr>
        <button onclick="send('off')">ЖМАКАЙ!</button>
        <button onclick="getSocs()">Подключенные услуги</button> < | >
		<a href="https://4pda.ru/forum/index.php?showtopic=954346&view=findpost&p=87357010" target="_blank">Защита от любых списаний</a> |
		<a href="https://t.me/airenexxx_tg" target="_blank">НАША ПРИВАТНАЯ ГРУППА, ГДЕ ВЫ МОЖЕТЕ ЗАДАТЬ ВОПРОСЫ!! (ЛС)</a> |
		<a href="https://t.me/airenexxx_tg" target="_blank">Аббревиатуры</a> |



    </section>
    <hr>

    <span style="display: none" id="zLoading">Установка скидки...</span>
    <b id="zOtvetText" style="display:none">Вот ответ:</b>
    <pre id="zOtvet"></pre>

    <script>
        var socs = $('.soc');
        for (var i = 0; i < socs.length; i++) {
            socs[i].onclick = function() {
                $('#soc_input').val(this.innerHTML);
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
                                resp = '<font color="green">Ошибка установки, напишите в телеграмм - https://t.me/spacexrr</font>';
                            } else {
                                resp = '<font color="red">Пиши в телеграмм - https://t.me/spacexrr</font>';
                            }

                            $('#zOtvet').show().html(resp);
                            break;
                        default:
                            $('#zLoading').hide();
                            $('#zOtvetText').show();
                            $('#zOtvet').show().html('Чет ни так, по вопросам в телегу - https://t.me/spacexrr');
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
                            $('#zOtvet').show().html('Пиши в телеграмм - https://t.me/winrone');
                    }
                }
            });
        }
    </script>
</div>
`);
    document.getElementById('URLz').value = "https://"+document.domain+"/customers/products/mobile/tariffs/connecttariff/"
}