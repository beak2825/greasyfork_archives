// ==UserScript==
// @name           AliExpress.ru сниппет доставки
// @namespace   aliexpress.ru-delivery-snippet
// @author      smut
// @license MIT
// @description    Отображение вариантов доставки на странице поиска товара
// @match        https://*aliexpress.ru/wholesale?*
// @run-at       document-end
// @version      0.2.1b
// @downloadURL https://update.greasyfork.org/scripts/457354/AliExpressru%20%D1%81%D0%BD%D0%B8%D0%BF%D0%BF%D0%B5%D1%82%20%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/457354/AliExpressru%20%D1%81%D0%BD%D0%B8%D0%BF%D0%BF%D0%B5%D1%82%20%D0%B4%D0%BE%D1%81%D1%82%D0%B0%D0%B2%D0%BA%D0%B8.meta.js
// ==/UserScript==

var country_array = [];
country_array.push('RU', 'CN');
var ratio_array = [];
ratio_array.push(81.4, 11.5, 1);
var SnowContainer = document.querySelector(".product-snippet_ProductSnippet__grid__lido9p");

var observer = new MutationObserver(onMutation);
observer.observe(SnowContainer, {
    childList: true,
    characterData : true,
    subtree: false,
    attributes : false,
});
var first_load = false;
function onMutation(mutations) {
    if (!first_load){
        first_load=true;
        return;
    }
    setTimeout(delivery_snippet(),500);
}
onMutation(observer);

function delivery_snippet(){
    var product = document.querySelectorAll('.product-snippet_ProductSnippet__container__lido9p');
    product.forEach(function(product_card) {
        var datapid = product_card.getAttribute('data-product-id');
        var data_ad = product_card.getAttribute('data-ad');
        var sku_url = product_card.children[0].children[0].getAttribute("href");
        var sku = sku_url.match(/\S+sku_id=(\d*)/);
        var min_price_rub = product_card.children[0].children[1].children[0].children[2].children[1].children[0].textContent.slice(0, -8);
        min_price_rub = parseInt(min_price_rub.replace(/ /g, ''));
        if (data_ad == 'ad'){
            return;
        }
        country_array.forEach(function(country) {
            req_api('USD',0);
            function req_api(tradecurrency,ratio){
                var minPrice = Math.floor(min_price_rub/ratio_array[ratio]*100)/100;
                var url = 'https://aliexpress.ru/aer-api/v1/product/detail/freight?product_id=';
                var payload = '{"productId":' + datapid +',"sendGoodsCountry":"' + country + '","country":"RU","provinceCode":"917477670000000000","cityCode":"917477679070000000","skuId":"'+ sku[1] +'","count":1,"minPrice":' + minPrice +',"maxPrice":990000,"tradeCurrency":"' + tradecurrency + '","displayMultipleFreight":true,"ext":{"p0":"'+ sku[1] +'","p1":"' + minPrice +'","p3":"' + tradecurrency + '","p4":"990000","p5":"0","p7":"{}","hideShipFrom":"false"}}';
                var req = new XMLHttpRequest();
                req.responseType = 'json';
                req.open('POST', url + datapid + '&_bx-v=2.2.3', true);
                req.setRequestHeader('Content-Type', 'application/json');
                req.send(payload);
                req.onreadystatechange = () => {
                    if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
                        var objResponse = req.response;
                        if (objResponse.from == null && country == "CN" && tradecurrency == 'USD'){
                            req_api('CNY',1);
                            return;
                        }else if (objResponse.from == null && country == "RU" && tradecurrency == 'USD'){
                            req_api('RUB',2);
                            return;
                        }else if(objResponse.from == null){
                            return;
                        }
                        var country_div = document.createElement('div');
                        var textnode = document.createTextNode(country);
                        country_div.style.fontWeight = 'bold';
                        country_div.style.fontSize = '10px';
                        country_div.appendChild(textnode);
                        product_card.children[0].children[1].appendChild(country_div);
                        objResponse.methods.forEach(function(delivery_type) {
                            var jsonResponse = JSON.stringify(delivery_type);
                            var delivery_variants = document.createElement('div');
                            var jsonParsed = JSON.parse(jsonResponse);
                            var price = jsonParsed.amount.formatted;
                            if (price == '0,00 руб.'){
                                price = 'Бесплатно';
                            }
                            var textnode = document.createTextNode(jsonParsed.groupName + ': ' + jsonParsed.dateFormat + ' ' + price);
                            delivery_variants.style.fontSize = '10px';
                            delivery_variants.appendChild(textnode);
                            product_card.children[0].children[1].appendChild(delivery_variants);
                        })
                    }
                };
            }
        })
    })
}

window.addEventListener('load', function() {
    delivery_snippet();
}, false);