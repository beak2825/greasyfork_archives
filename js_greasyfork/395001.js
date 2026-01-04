// ==UserScript==
// @name         calculate_store
// @namespace    virtonomica
// @version      0.09
// @description  Управление снабжением предприятия!
// @author       ThunderFit
// @include      http*://*virtonomic*.*/*/main/unit/view/*/supply
// @downloadURL https://update.greasyfork.org/scripts/395001/calculate_store.user.js
// @updateURL https://update.greasyfork.org/scripts/395001/calculate_store.meta.js
// ==/UserScript==

(function() {

    var calculate_store = function () {

        var tf_calculate_store =  {
            typeNone: 0,
            typeShop: 1,
            typeService: 2,
            typeFactory: 4,
            typeIT: 8,
            init: function (type) {
                if (!this.checkType(type)) {
                    return;
                }
                this.defaultRecalculation = 1.5;
                this.defaultMinimalPercent = 75;
                this.recalculation = this.defaultRecalculation;
                this.minimalCount = this.defaultMinimalPercent;

                this.elements = $('table.list tr[id^="product_row"]');
                this.setInputs();
                this.initEvents();
            },
            checkType: function (type) {
                this.type = type;
                let result = false;
                if (this.type === this.typeShop || this.type === this.typeService) {
                    result = true;
                }
                return result;
            },
            setInputs: function () {

                this.manageBlock = $('<div class="tf_calculate_store" id="calculate_store" style="padding: 1em;">');
                this.recalculationInput = $('<input type="text" id="calculate_store_regression" style="width: 35px; text-align: right" value="'+this.defaultRecalculation+'">');
                this.minimalCountPercentInput = $('<input type="text" id="calculate_store_minimal" style="width: 35px; text-align: right" value="'+this.defaultMinimalPercent+'">');
                this.calculateButton = $('<input type="button" id="calculate_store_button" value="Рассчитать корректировки закупок">');
                this.calculateAdditionalButton = $('<input type="button" id="calculate_store_additional_button" value="Рассчитать корректировки закупок">');
                this.manageBlock.prepend($('<div style="margin-bottom: 1em;">')
                                         .append(this.calculateButton)
                                         .append('<span> на </span>')
                                         .append(this.recalculationInput)
                                         .append('<span> пересчета от продаж   </span>')
                                        );
                this.manageBlock.append($('<div style="margin-bottom: 1em;">')
                                        .append('<span> + </span>')
                                        .append(this.calculateAdditionalButton)
                                        .append('<span> с не менее </span>')
                                        .append(this.minimalCountPercentInput)
                                        .append('<span>% от продаж</span>')
                                       );
                this.manageBlock.append($('<input type="button" id="calculate_store_save" value="Сохранить расчеты" onclick="$(\'input[type=submit][name=applyChanges]\').trigger(\'click\');">'));
                $("div#childMenu").append(this.manageBlock);

                this.elements.each(function () {
                    let element = $(this);
                    let inputBlock = element.find('td[id^="quantityField"]');
                    inputBlock.append('<span>Расчет <span/><input type="checkbox" class="tf_use_calculation" checked>');
                });
            },
            initEvents: function () {
                this.calculateButton.on('click', this.calculateClick.bind(this));
                this.calculateAdditionalButton.on('click', this.calculateAdditionalClick.bind(this));
            },
            calculateAdditionalClick: function () {
                let minimalCount = this.getNum(this.minimalCountPercentInput.val(), this.defaultMinimalPercent);
                let recalculation = this.getNum(this.recalculationInput.val(), this.defaultRecalculation);

                this.calculate(recalculation, minimalCount);
            },
            calculateClick: function () {
                let minimalCount = 0;
                let recalculation = this.getNum(this.recalculationInput.val(), this.defaultRecalculation);

                this.calculate(recalculation, minimalCount);
            },
            calculate: function (recalculation, minimalCount) {
                this.recalculation = parseFloat(recalculation);
                this.minimalCount = parseFloat(parseFloat(minimalCount) / 100);

                this.elements.each(this.processInputs.bind(this));
            },
            processInputs: function (index, element) {
                element = $(element);
                let cols = element.children('td');
                let storeCount = this.getStoreCount(cols);
                let saleCount = this.getSaleCount(cols);
                let deliveryCount = this.getDeliveryCount(cols);
                let newOrderInput = element.find('td[id^="quantityField"]').find('input');
                let useCheckbox = element.find('.tf_use_calculation');

                if (useCheckbox.length && useCheckbox[0].checked) {
                    let mainOrderCount = parseInt(saleCount * this.recalculation);
                    let minimalOrderCount = parseInt(saleCount * this.minimalCount);

                    let newOrderCount = parseInt(mainOrderCount - storeCount + saleCount);
                    if (mainOrderCount === storeCount) {
                        newOrderCount = saleCount;
                    }
                    if (mainOrderCount === 0 && storeCount === deliveryCount) {
                        newOrderCount = deliveryCount;
                    }
                    if (newOrderCount <= minimalOrderCount) {
                        newOrderCount = minimalOrderCount;
                    }

                    newOrderInput.val(newOrderCount);
                }
            },
            getDeliveryCount: function (cols) {
                let count = 0;
                switch (this.type) {
                    case this.typeShop:
                        count = this.getNum(this.getTradeBlock(cols).next().next().text());
                        break;
                    case this.typeService:
                        count = this.getNum(this.getTradeBlock(cols).find('td:contains("Закупка")').next().text());
                        break;
                    default:
                        count = 0;
                        break;
                }
                return count;
            },
            getSaleCount: function (cols) {
                let count = 0;
                switch (this.type) {
                    case this.typeShop:
                        count = this.getNum(this.getTradeBlock(cols).find('td:contains("Продано")').next().text());
                        break;
                    case this.typeService:
                        count = this.getNum(this.getTradeBlock(cols).find('td:contains("Расход")').next().text());
                        break;
                    default:
                        count = 0;
                        break;
                }
                return count;
            },
            getStoreCount: function (cols) {
                let count = 0;
                switch (this.type) {
                    case this.typeShop:
                        count = this.getNum(this.getTradeBlock(cols).find('td:contains("Количество")').next().text());
                        break;
                    case this.typeService:
                        count = this.getNum(this.getStoreBlock(cols).find('td:contains("Количество")').next().text());
                        break;
                    default:
                        count = 0;
                        break;
                }
                return count;
            },
            getStoreBlock: function (cols) {
                let storeBlock = $(cols[0]);
                switch (this.type) {
                    case this.typeShop:
                        storeBlock = $(cols[0]);
                        break;
                    case this.typeService:
                    default:
                        storeBlock = $(cols[1]);
                        break;
                }
                return storeBlock;

            },
            getTradeBlock: function (cols) {
                let tradeBlock = $(cols[0]);
                switch (this.type) {
                    case this.typeShop:
                    case this.typeService:
                    default:
                        tradeBlock = $(cols[0]);
                        break;
                }
                return tradeBlock;
            },
            getNum: function (text, defaultNum = 0) {
                return (parseFloat(text.replace(/\s+/g, '').replace(/\$/g, '').replace(/,/, '.')) || defaultNum);
            }
        };

        let isShop = $('#mainContent').find('input[value="Список всех товаров"]').length > 0;
        let isService = !isShop && ($('table.list').length === 2) && ($('td:contains("Расх. на клиента")').length > 0);
        let isFactory = !isShop && !isService && ($('table.list').length === 2) && ($('td:contains("Требуется")').length > 0);
        let isIT = !isShop && !isService && !isFactory && ($('table.list').length === 1) && ($('th:contains("Трафик")').length > 0);

        let type = isShop ? tf_calculate_store.typeShop : (
            isService ? tf_calculate_store.typeService : (
                isFactory ? tf_calculate_store.typeFactory : (
                    isIT ? tf_calculate_store.typeIT
                    : tf_calculate_store.typeNone
                )
            )
        )
        tf_calculate_store.init(type);
    }


    if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + calculate_store.toString() + ')();';
    document.documentElement.appendChild(script);
}
})();