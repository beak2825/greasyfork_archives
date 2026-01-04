// ==UserScript==
// @name         forecast_store
// @namespace    virtonomica
// @version      0.03
// @description  Прогноз работы предприятия с офисом!
// @author       ThunderFit
// @include      http*://*virtonomic*.*/*/main/unit/view/*
// @downloadURL https://update.greasyfork.org/scripts/395648/forecast_store.user.js
// @updateURL https://update.greasyfork.org/scripts/395648/forecast_store.meta.js
// ==/UserScript==

(function() {

    var forecast_store = function () {

        let tf_forecast_store =  {
            typeNone: 0,
            typeShop: 1,
            typeService: 2,
            typeFactory: 4,
            typeIT: 8,
            init: function (type) {
                if (!this.checkType(type)) {
                    return;
                }
                this.setRealm();
                this.setOfficeId();
                let button = $('div[onclick="return forecast();"]');
                button.removeAttr('onclick');
                button.on('click', this.click.bind(this));
                button.closest('.button_div').before('<div style="padding: 6px;" class="tf_office_summary"></div>');
            },
            click: function() {
                forecast();
                if (this.officeId > 0) {
                    $.post('/' + this.realm + '/ajax/unit/forecast', {'unit_id' : this.officeId}, function(data){
                        $('.tf_office_summary').text('Эффективность офиса: ' + sayNumber(Math.min(data['productivity'], 1)*100) + ' %');
                    }, 'json');
                }
            },
            setRealm: function (){
                this.realm = window.location.href.match(/\/(\w+)\/main\/unit\/view/)[1];
            },
            setOfficeId: function () {
                this.unitId = parseInt(window.location.href.match(/\/main\/unit\/view\/(\w+)/)[1]);
                $.get('/api/' + this.realm + '/main/unit/summary', {'id' : this.unitId}, this.setOfficeCallback.bind(this), 'json');
            },
            setOfficeCallback: function (data) {
                this.officeId = parseInt(data.office_id);
            },
            checkType: function (type) {
                this.type = type;
                let result = false;
                if (this.type === this.typeShop || this.type === this.typeFactory) {
                    result = true;
                }
                return result;
            }
        };

        let isShop = $('i.fa.fa-shopping-cart').length > 0;
        let isFactory = $('i.fa.fa-industry').length > 0;

        let type = isShop ? tf_forecast_store.typeShop : (
            isFactory
            ? tf_forecast_store.typeFactory
            : tf_forecast_store.typeNone
        );
        tf_forecast_store.init(type);
    }

    if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + forecast_store.toString() + ')();';
    document.documentElement.appendChild(script);
}
})();