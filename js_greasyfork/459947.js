// ==UserScript==
// @name         Link ze strony produktu do panelu
// @namespace    http://butosklep.pl/
// @version      1.2
// @description  Skrypt do dodania linku ze strony produktu do edycji w panelu butosklep
// @author       Marcin
// @match        https://butosklep.pl/product-*
// @icon         https://butosklep.pl/gfx/pol/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459947/Link%20ze%20strony%20produktu%20do%20panelu.user.js
// @updateURL https://update.greasyfork.org/scripts/459947/Link%20ze%20strony%20produktu%20do%20panelu.meta.js
// ==/UserScript==
 
function createLink() {
    const DOMAIN = "https://butosklep.pl"
    let productNameH1 = document.querySelector(".product_name__name");
    let productID = document.querySelector("#projector_form").getAttribute("data-" + "product_id");
    productNameH1.innerHTML = `<a href=${DOMAIN}/panel/products-list.php?__iai_shop_panel%5B__encoding%5D=utf-8&product_type%5B0%5D=product_item&product_type%5B1%5D=product_configurable&product_type%5B2%5D=product_packaging&product_type%5B3%5D=product_bundle&product_type%5B4%5D=product_collection&product_type%5B5%5D=product_virtual&product_type%5B6%5D=product_service&kategoria2b=&kategoria2a=&deliverer=&deliverer_sel=&firmab=&firm_sel=&fullSearch=&note=&productcode=&products_codes=${productID}&location_option=&location_stock=1&location=&wsp=&widb=&auctions_type=&newproducts=&trait_group_type=n&pricerange=&price_range_start=&price_range_end=&view=21&pps=100&deliveryButton=Szukaj&sort%5Bcolumn%5D=id&sort%5Btype%5D=d&config_width=1000&specialColumns%5Binput%5D=1&v=21 style="text-decoration: none !important;">${productNameH1.innerHTML}</a>`;  
}

createLink();