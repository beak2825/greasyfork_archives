// ==UserScript==
// @name         Вывоз на склад
// @namespace    Virtonomica
// @version      0.1
// @description  Скрипт добавляет кнопку, чтобы вывезти все продукты одним кликом на склады
// @author       VaryaUsoyanComp
// @match        https://virtonomica.ru/anna/main/unit/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=virtonomica.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469427/%D0%92%D1%8B%D0%B2%D0%BE%D0%B7%20%D0%BD%D0%B0%20%D1%81%D0%BA%D0%BB%D0%B0%D0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/469427/%D0%92%D1%8B%D0%B2%D0%BE%D0%B7%20%D0%BD%D0%B0%20%D1%81%D0%BA%D0%BB%D0%B0%D0%B4.meta.js
// ==/UserScript==

let run = function() {
    var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    var $ = win.$;

    const url = window.location.href;
    const id = url.split("/view/")[1].split("/")[0].split("?")[0];

    let token;
    fetch('https://virtonomica.ru/api/anna/main/token')
        .then(response => response.json())
        .then(data => {token = data});

    fetch('https://virtonomica.ru/api/anna/main/unit/summary?id=' + id)
        .then(response => response.json())
        .then(data => {
        if(data.unit_class_kind === "shop" || data.unit_class_kind ==="fuel"){
            $('#exportGoods').show();
        }
    });


    $('.metro_header').append(`<button id="exportGoods">Вывезти товары</button>`);

    $('#exportGoods').css({
        'background-color': 'green',
        'color': '#fff',
        'border': 'none',
        'padding': '10px 20px',
        'font-size': '12px',
        'cursor': 'pointer'
    });

     $('#exportGoods').hide();

    function unitIdStorage(product_id){
        //Нефте- и химические продукты
        const arrOilAndChemistry = ["422549","422550","422707","423863","422704","422705","422703","370078"];
        //Оборудование, техника, запчасти
        const arrTechnique =["1518","1525","15338","370077","370079","370080","370081","422716","422717","422718","423276","424207"];
        //Сельскохозяйственные продукты
        const arrAgricultural = ["1491","1492","15742","15743","15744","17609","359847","401966","422544"];
        //Продукты питания
        const arrFood = ["1489", "1490", "1494", "1496", "1497", "1498", "1499", "1500", "1501", "1502", "1503", "1504", "1505", "1506",
                         "1507", "3865", "3869", "15336", "15747", "15748", "15749", "15750", "16006", "335175", "335178", "335179",
                         "335180", "373201", "380000", "380005", "380006", "380007", "401968", "422054", "422055", "422205", "422434",
                         "422545", "422546", "422547", "422553", "423115", "423116", "423117", "423151", "423387", "423388", "335175",
                         "423860", "423862","423482","423925", "423951", "424438", "424630", "424881", "424882"]
        //Промышленные товары
        const arrIndustrial =[];
        //Золото и драгоценности
        const arrGoldAndJewels = ["1524","1526","2540","2546","424631","351577","370076","380008"];
        //Рыбопродукты
        const arrFish = ["335174","335176","335177","335181","380002","423481"];
        //Медицинские товары
        const arrMedical = ["303308","312799","359856","359859","359860","359861","359862","359863","422199","422433","422552","423153",
                            "423160","423483","423950","424508","424628"];



        if (arrOilAndChemistry.includes(product_id)) {
            return 5517057;
        } else if(arrTechnique.includes(product_id)){
            return 5517061;
        }else if(arrAgricultural.includes(product_id)){
            return 5517062;
        }else if(arrFood.includes(product_id)){
            return 5517060;
        }else if(arrGoldAndJewels.includes(product_id)){
            return 5517064;
        }else if(arrFish.includes(product_id)){
            return 5517065;
        }else if(arrMedical.includes(product_id)){
            return 5517066;
        }else {
            return 5536051;
        }
    }


    $('#exportGoods').click(function(){
        $.getJSON("https://virtonomica.ru/api/anna/main/unit/storage/stocks?id="+id, function(data) {
            $.each(data, function(index, element) {
                if(element.qty>0){
                    var post_data = {
                        id: id,
                        unit_id: unitIdStorage(element.product_id),
                        product_id: element.product_id,
                        brandname_id: "0",
                        qty: element.qty,
                        token: token,
                        method: "POST",
                        base_url: "/api/"
                    };
                    console.log(post_data);


                    $.post("https://virtonomica.ru/api/?action=unit/storage/delivery/set&app=virtonomica", post_data, function(response) {
                        console.log(response);
                    });}
            });
        });

    });

}


if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}
