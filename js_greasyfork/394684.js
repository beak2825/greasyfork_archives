// ==UserScript==
// @name           Victory: Мультистройка (api-интерфейс)
// @version        1.00
// @namespace      Victory
// @description    Стройка множества подразделений ч-з api
// @include        https://virtonomica.ru/olga/main/unit/create/4345151
// @downloadURL https://update.greasyfork.org/scripts/394684/Victory%3A%20%D0%9C%D1%83%D0%BB%D1%8C%D1%82%D0%B8%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%20%28api-%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81%29.user.js
// @updateURL https://update.greasyfork.org/scripts/394684/Victory%3A%20%D0%9C%D1%83%D0%BB%D1%8C%D1%82%D0%B8%D1%81%D1%82%D1%80%D0%BE%D0%B9%D0%BA%D0%B0%20%28api-%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var counter,
        token;

    $.ajax({
            url: 'https://virtonomica.ru/api/olga/main/token',
            async: false,
            dataType: 'json',
            type: "get",
            success: function(json){
                token = $(json).selector;
            }
        });

    document.addEventListener('click',modalWindowCheck,false);

    function run() {
        document.removeEventListener('click',modalWindowCheck,false);
        var button2 = document.createElement('button'),
            companyId = location.href.match(/\d+/)[0];
        button2.className = 'btn btn-circle';
        button2.innerHTML = 'Создать несколько...';

        document.querySelector('button.btn-sm:nth-child(2)').before(button2);
        button2.addEventListener('click', buildMultiply, false);

        function buildMultiply() {
            var buildingsCount = prompt('Сколько строить?', 1);
            counter=0;
            for (var i = 0; i < buildingsCount-1; i++) {
                $.ajax({
                    url: 'https://virtonomica.ru/api/?action=company/build&app=adapter_vrt',
                    type: 'post',
                    data: {
                        "base_url": "/api/",
                        "token": token,
                        "id": companyId,
                        "kind": UnitCreateWizard.get('unittype').kind,
                        "name": UnitCreateWizard.name,
                        "args[produce_id]": UnitCreateWizard.get('produce').id,
                        "args[city_id]": UnitCreateWizard.get('city').id,
                        "args[size]": UnitCreateWizard.get('size').size,
                        "args[district_id]": UnitCreateWizard.get('district') ? UnitCreateWizard.get('district').id : 0,
                        "method": "POST"
                    },
                    success: function () {
                        counter++;
                        if (counter===buildingsCount-1) {
                            document.querySelector('button.btn-success.btn-sm:not(.create-button)').click();
                        }
                    }
                })
            }
        }
    }
    function modalWindowCheck() {
        if (!!(~location.href.indexOf('confirm-modal'))) {
            run();
        }
    } //проверяет наличие в url подстроки 'confirm-modal', запускает основную функцию
})();