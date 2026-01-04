// ==UserScript==
// @name         Создание магаза или автозаправки со страницы "аналитика"
// @namespace    Virtonomica
// @version      0.1
// @description  Скрипт создаёт магаз или заправку со страницы "Аналитика" в выбранном городе
// @author       VaryaUsoyanComp
// @match        https://virtonomica.ru/anna/main/globalreport/marketing*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=virtonomica.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469425/%D0%A1%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B0%20%D0%B8%D0%BB%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B8%20%D1%81%D0%BE%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B%20%22%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0%22.user.js
// @updateURL https://update.greasyfork.org/scripts/469425/%D0%A1%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B0%20%D0%B8%D0%BB%D0%B8%20%D0%B0%D0%B2%D1%82%D0%BE%D0%B7%D0%B0%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B8%20%D1%81%D0%BE%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B%20%22%D0%B0%D0%BD%D0%B0%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0%22.meta.js
// ==/UserScript==

let run = function() {
    var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    var $ = win.$;
    let cityName = "";
    let unitSize = 0;
    let cityId = null;
    let kind = "";
    let unitName = "";
    let districtId = null;
    let restriction = false;

    //Создание кнопки
    $('.metro_header').append(`<button id="btnCreateUnit">Создать юнит</button>`);


    //Создание селекта для выбора типа юнита(магаз или автозаправка)
    var unitTypeSelect = $("<select>", { id: "unitTypeSelect", class: "selector" });
    unitTypeSelect.append($("<option>", { text: "Магазин", value: "shop" }));
    unitTypeSelect.append($("<option>", { text: "Автозаправка", value: "fuel" }));
    $('.metro_header').append(unitTypeSelect);
    $("#unitTypeSelect option:eq(0)").prop("selected", true);

    //Создание селекта для выбора размера юнита
    var unitSizeSelect = $("<select>", { id: "unitSizeSelect", class: "selector" });
    unitSizeSelect.append($("<option>", { text: "100 кв. м", value: 1 }));
    unitSizeSelect.append($("<option>", { text: "500 кв. м", value: 5 }));
    unitSizeSelect.append($("<option>", { text: "1 000 кв. м", value: 10 }));
    unitSizeSelect.append($("<option>", { text: "10 000 кв. м", value: 100 }));
    unitSizeSelect.append($("<option>", { text: "100 000 кв. м", value: 1000 }));
    $('.metro_header').append(unitSizeSelect);
    $("#unitSizeSelect option:eq(3)").prop("selected", true);


    //Создание селекта для выбора района постройки
    var unitDistrictSelect = $("<select>", { id: "unitDistrictSelect", class: "selector" });
    unitDistrictSelect.append($("<option>", { text: "Фешенебельный район", value: 2010 }));
    unitDistrictSelect.append($("<option>", { text: "Центр города", value: 2009 }));
    unitDistrictSelect.append($("<option>", { text: "Спальный район", value: 2008 }));
    unitDistrictSelect.append($("<option>", { text: "Окраина", value: 2007 }));
    unitDistrictSelect.append($("<option>", { text: "Пригород", value: 2006 }));
    $('.metro_header').append(unitDistrictSelect);

    //Создание инпута для названия юнита
    var input = $("<input>", { id: "unitNameInput", type: "text" });
    $('.metro_header').append(input);
    $('#unitNameInput').val('Магазин.');

    ////////////////////////////////////////////////////////css оформление селектора\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    $('#unitNameInput').css({
        'border': '2px solid #007bff',
        'border-radius': '5px',
        'font-size': '16px',
        'font-family': 'Arial, sans-serif',
        'padding': '10px',
        "height": "30px",
        'width': '250px',
        'background-color': '#fff',
        'color': '#000'
    });

    $('#unitNameInput').focus(function() {
        $(this).css({
            'outline': 'none',
            'border-color': '#007bff'
        });
    });

    $('#unitNameInput').blur(function() {
        $(this).css({
            'border-color': '#ddd'
        });
    });
    //----------------------------------------------------------------------------------------------------------------------------------------------------------

    ////////////////////////////////////////////////////////css оформление селектора\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    $('.selector').css({
        "width": "90px",
        "height": "30px",
        "font-size": "16px",
        "font-family": "Arial, sans-serif",
        "color": "#444",
        "background-color": "#fff",
        "border": "1px solid #ccc",
        "border-radius": "1px",
        "padding": "2px"
    })
    //----------------------------------------------------------------------------------------------------------------------------------------------------------

    ///////////////////////////////////////////////////////////css оформление кнопки//////////////////////////////////////////////////////\
    $('#btnCreateUnit').css({
        "color": "#fff",
        "text-decoration": "none",
        "user-select": "none",
        "background": "rgb(212,75,56)",
        "padding": ".7em 1.5em",
        "outline": "none"
    });

    $(".btnScript").hover(function(){
        $(this).css("background", "rgb(232,95,76)");
    });
    $(".btnScript").mousedown(function(){
        $(this).css("background", "rgb(152,15,0)");
    });
    //----------------------------------------------------------------------------------------------------------------------------------------------------------


    $('#btnCreateUnit').click(function(){

        cityId = null;
        kind = $('#unitTypeSelect').val();
        console.log("kind");

        if(kind === "shop"){
            $('#unitSizeSelect option:eq(0)').val(1);
            $('#unitSizeSelect option:eq(1)').val(5);
            $('#unitSizeSelect option:eq(2)').val(10);
            $('#unitSizeSelect option:eq(3)').val(100);
            $('#unitSizeSelect option:eq(4)').val(1000);
            districtId = Number($('#unitDistrictSelect').val());
        } else {
            $('#unitSizeSelect option:eq(0)').val(1);
            $('#unitSizeSelect option:eq(1)').val(3);
            $('#unitSizeSelect option:eq(2)').val(10);
            $('#unitSizeSelect option:eq(3)').val(30);
            $('#unitSizeSelect option:eq(4)').val(100);
            districtId = 0;
        }

        unitSize = Number($('#unitSizeSelect').val());
        cityName = $('.globalreport-marketing .retail .unifilter-item div:eq(1) span span span span:eq(0)').attr('title');
        unitName = $('#unitNameInput').val() + " " + cityName;

        hasRestriction(cityName).then(size => {
            if(size !== null){
                console.log("Максимальный размер в данном городе " + (size*100) + " кв. м");
                if(unitSize > size){
                    unitSize = size;
                }
            } else {
                console.log("Ограничений нет");
            }});


        getId(cityName).then(id => {
            cityId = id;
            console.log(cityId);
            let data_ = {
                "method"  : "POST",
                "base_url": "/api/",
                "token"   : "63f6aa8b20f9a",
                "id"      : "5463412",
                "kind"    : kind,
                "name"    : unitName,
                "args"    : {
                    "produce_id" : 0,
                    "city_id"    : cityId,
                    "size"       : unitSize,
                    "district_id": districtId,

                },
            };
            console.log(data_);

            if(cityId != null){
                $.ajax({
                    async      : true,
                    type       : 'POST',
                    url        : 'https://virtonomica.ru/api/?action=company/build&app=adapter_vrt',
                    crossDomain: true,
                    xhrFields  : {
                        withCredentials: true,
                    },
                    data       : data_,
                    global     : false,
                    dataType   : "json",
                    success: function (response) {
                        const unitLink = "https://virtonomica.ru/anna/main/unit/view/" + response;
                        console.log(unitLink);
                        $('.metro_header').append("<div class='text-display-analytic'></div>");
                        $(".text-display-analytic").text("Здесь описывается состояние процесса.");
                        $(".text-display-analytic").text("Ваш " + kind + " c размером " +
                                                         unitSize*100 + " кв. м., построен в городе: " +
                                                         cityName + " c названием: " + unitName );
                        $(".text-display-analytic").click(function(){
                             window.open(unitLink, '_blank')
                        });
                    },
                });
            } else {
                $('.text-display-analytic').text("Города " + cityName + " не существует");
            }


        });



    });

    async function getId(currentCityName){
        let response = await fetch("https://virtonomica.ru/api/anna/main/geo/city/browse");
        let cities = await response.json();

        for(const city in cities){
            if(currentCityName === cities[city].city_name){
                return cities[city].id;
            }
        }
        return null;
    }


    async function hasRestriction(currentCityName){
        let response = await fetch("https://virtonomica.ru/api/anna/main/geo/city/browse");
        let cities = await response.json();

        for(const city in cities){
            if(currentCityName === cities[city].city_name){
                let obj1 = cities[city].restrictions;
                for(const restr in obj1){
                    if(obj1[restr].name === "Магазин"){
                        return obj1[restr].size;
                    }
                }
            }
        }
        return null;
    }


}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}