// ==UserScript==
// @name         unit_market_list_products
// @namespace    virtonomica
// @version      0.02
// @description  Рынки. Добавление информации в списки!
// @author       ThunderFit
// @include      http*://*virtonomic*.*/*/main/unit_market/list
// @downloadURL https://update.greasyfork.org/scripts/395247/unit_market_list_products.user.js
// @updateURL https://update.greasyfork.org/scripts/395247/unit_market_list_products.meta.js
// ==/UserScript==

(function() {

    var unit_market_list_products = function () {

        let tf_unit_market_list_products =  {
            init: function () {
                this.process();
            },
            process: function () {
                this.update('warehouse', '', this.warehouseCallback);
                this.update('shop', '/trading_hall', this.shopCallback);
            },
            update: function(type, suffixUrl = '', callback) {

                $('.list').find('img[src="/img/unit_types/' + type + '.gif"]').each(function(){
                    let element = $(this).parent().next();
                    let href = element.find('a').last().attr('href');
                    if (typeof href !== undefined) {
                        $.get(href + suffixUrl, function(data){
                            if (typeof callback === 'function') {
                                callback(data, element);
                            } else {
                                let images = $(data).find('.grid').find('img');
                                if (images.length) {
                                    element.next().next().append(images);
                                }
                            }
                        });

                    }
                });

            },
            shopCallback: function (data, element) {
                let images = $(data).find('.grid').find('img');
                let realProducts = [];
                if (images.length) {
                    images.each(function(index, image) {
                        let publicQuantity = $(image).parent().next().next().next().next().text();

                        let quantity = (publicQuantity.replace(/\s+/g, '').replace(/\$/g, '') || 0);
                        if (quantity > 0) {
                            image.title = image.alt + '; ' + publicQuantity + ' шт.';
                            realProducts.push(image)
                        }
                    })
                    if (realProducts.length) {
                        element.next().next().append(realProducts);
                    }
                }

            },
            warehouseCallback: function (data, element) {
                let images = $(data).find('.grid').find('img');
                let realProducts = [];
                if (images.length) {
                    images.each(function(index, image) {
                        let publicQuantity = $(image).parent().next().text();
                        let quantity = (publicQuantity.replace(/\s+/g, '').replace(/\$/g, '') || 0);
                        if (quantity > 0) {
                            image.title = image.alt + '; ' + publicQuantity + ' шт.';
                            realProducts.push(image)
                        }
                    })
                    if (realProducts.length) {
                        element.next().next().append(realProducts);
                    }
                }

            }

        };
        tf_unit_market_list_products.init();
    }


    if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + unit_market_list_products.toString() + ')();';
    document.documentElement.appendChild(script);
}
})();