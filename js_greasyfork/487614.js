// ==UserScript==
// @name         "Аналитика" TOLIK
// @namespace    Virtonomica
// @version      0.1
// @description  Скрипт создаёт магаз или заправку со страницы "Аналитика" в выбранном городе
// @author       VaryaUsoyanComp
// @match        https://virtonomica.ru/vera/main/globalreport/marketing*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=virtonomica.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487614/%22%D0%90%D0%BD%D0%B0%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0%22%20TOLIK.user.js
// @updateURL https://update.greasyfork.org/scripts/487614/%22%D0%90%D0%BD%D0%B0%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0%22%20TOLIK.meta.js
// ==/UserScript==

let run = async function() {
    var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    var $ = win.$;
    let cityIdMap = {};
    let restrictionInMap = {};
    let countOfLink = 0;
    const cost = 14500000;//РЕКЛАМА

    // Загружаем данные "Название города - id города" в переменную cityIdMap
    cityIdMap = await fetchAndCacheCityData();

    // Загружаем данные "Название города - Ограничения" в переменную restrictionInMap
    restrictionInMap = await fetchAndCacheCityDataRestriction();
    const token = await fetchToken();

    async function fetchToken() {
        const response = await fetch('https://virtonomica.ru/api/vera/main/token');
        if (response.ok) {
            return await response.text();
        } else {
            throw new Error('Ошибка запроса');
        }
    }

    // Переделанные функции с сохранением данных в кеше
    async function fetchAndCacheCityData() {
        try {
            let cityIdMap = JSON.parse(localStorage.getItem('cityIdMap')) || {};
            if (Object.keys(cityIdMap).length === 0) {
                const response = await fetch("https://virtonomica.ru/api/vera/main/geo/city/browse");
                const cities = await response.json();

                for (const cityId in cities) {
                    const city = cities[cityId];
                    cityIdMap[city.city_name] = city.id;
                }

                localStorage.setItem('cityIdMap', JSON.stringify(cityIdMap));
            }

            return cityIdMap;
        } catch (error) {
            console.error("An error occurred:", error);
            throw error;
        }
    }

    async function fetchAndCacheCityDataRestriction() {
        try {
            let restrictionInMap = JSON.parse(localStorage.getItem('restrictionInMap')) || {};
            if (Object.keys(restrictionInMap).length === 0) {
                const response = await fetch("https://virtonomica.ru/api/vera/main/geo/city/browse");
                const cities = await response.json();

                for (const cityId in cities) {
                    const city = cities[cityId];
                    const obj1 = cities[cityId].restrictions;
                    for (const restr in obj1) {
                        if (obj1[restr].name === "Магазин") {
                            restrictionInMap[city.city_name] = obj1[restr].size;
                        }
                    }
                }

                localStorage.setItem('restrictionInMap', JSON.stringify(restrictionInMap));
            }

            $("#btnCreateUnit").text("Создать юнит(ОК)");
            return restrictionInMap;
        } catch (error) {
            console.error("An error occurred:", error);
            throw error;
        }
    }


    // Загрузка и использование данных
    fetchAndCacheCityData().then(cityIdMap => {
        console.log(cityIdMap);
    }).catch(error => {
        console.error("An error occurred:", error);
    });

    fetchAndCacheCityDataRestriction().then(restrictionInMap => {
        console.log(restrictionInMap);
    }).catch(error => {
        console.error("An error occurred:", error);
    });


    const productsForStore = {
        automotiveGoodsOffer: [
            "11024988",
            "11019598",
            "11019597",
            "11018710",
            "11018694",
            "11024990",
            "11023128",
            "11025016",
            "11019599",
            "11018693",
            "11024984",
            "11024991",
            "11019592",
            "11019592",
            "11025012",
            "11018716",
            "11023157"
        ],
        childrensItems: [
            "11018715",
            "11018720",
            "11018726",
            "11018725",
            "11018681",
            "11018683",
            "11018702",
            "11018701",
            "11018682",
            "11023148",
            "11024954"
        ],
        clothing: [
            "11018697",
            "11018686",
            "11018719",
            "11018703",
            "11018717",
            "11018729",
            "11018685",
            "11018707",
            "11024978",
            "11018687",
            "11018722",
            "11018730",
            "11018678",
            "11018705",
            "11018688",
            "11018723",
            "11018699",
            "11018721",
            "11023154"
        ],
        electronics: [
            "11023130",
            "11023137",
            "11018698",
            "11023121",
            "11023142",
            "11023145",
            "11023124",
            "11023123",
            "11023143",
            "11023151",
            "11023122",
            "11023144",
            "11023134",
            "11018724",
            "11023114",
            "11023146",
            "11023147",
            "11023140"
        ],
        food: [
            "17609",
            "11023184",
            "11023186",
            "11023185",
            "11023207",
            "11024949",
            "11023225",
            "11023223",
            "11024196",
            "11023171",
            "11023205",
            "11023211",
            "11023183",
            "11023208",
            "11023209",
            "11023172",
            "11023187",
            "11024951",
            "11024953",
            "11023221",
            "11023162",
            "11023173",
            "11023174",
            "11023175",
            "11018785",
            "11025022",
            "11023189",
            "11023193",
            "11023191",
            "11023192",
            "11023222",
            "11023198",
            "11023166",
            "11023224",
            "11023219",
            "11023215",
            "11023180",
            "11023164",
            "10308920",
            "10308919",
            "10367228",
            "10308921",
            "10308145",
            "11023163",
            "10308922"
        ],
        fuelShop: ["422703", "422705", "422704", "422707"],
        groceries: [
            "11023210",
            "11023206",
            "11023212",
            "11023216",
            "11023182",
            "11023195",
            "11023199",
            "11023214",
            "11023201",
            "11023176",
            "11023177",
            "11023202",
            "11023194",
            "11023220",
            "11023178",
            "11023179",
            "11023213",
            "11023196",
            "11023204",
            "11023188",
            "11023181",
            "11023203",
            "11023115",
            "11023120",
            "11023133",
            "11023153",
            "401966",
            "11023197",
            "11024952"
        ],
        homeGoods: [
            "11018677",
            "11018714",
            "11024962",
            "11018684",
            "11018706",
            "11018713",
            "11018728",
            "11018718",
            "11023129",
            "11018689",
            "11024965",
            "11023131",
            "11024977",
            "11023132",
            "11018708",
            "11018711",
            "11018691",
            "11018704",
            "11024968",
            "11023138",
            "11024970",
            "11018679",
            "11024966",
            "11018696",
            "11023139"
        ],
        industrialGoods: [
            "11024955",
            "11023152",
            "11023150",
            "11023141",
            "11024971",
            "11023155",
            "11023156",
            "11018690",
            "11023136",
            "11023127",
            "11024961",
            "11023126",
            "11023119",
            "11023149"
        ],
        jewellery: [
            "11024943",
            "11024948",
            "11024942",
            "11018727",
            "11024946",
            "11024940",
            "11023117",
            "11018700"
        ],
        pharmacy: [
            "11018668",
            "11018657",
            "11025021",
            "11024969",
            "11018660",
            "11018665",
            "11018669",
            "11018664",
            "11018654",
            "11018662",
            "11018659",
            "11018667",
            "11018658",
            "11024964",
            "11018661",
            "11024967"
        ],
        agricultural: [
            "10367228",
            "10308922",
            "10308920",
            "10308145",
            "10308921",
            "17609",
            "11023184",
            "11023186",
            "11023185",
            "11023163",
            "11023207",
            "11024949",
            "10308919"
        ]
    };



    // Данные для селектов
    const unitTypeOptions = [
        { text: "Все магазы", value: "allShop" },
        { text: "Магазин", value: "shop" }
    ];
    const unitSizeOptions = [
        { text: "100 кв. м", value: 1 },
        { text: "500 кв. м", value: 5 },
        { text: "1 000 кв. м", value: 10 },
        { text: "10 000 кв. м", value: 100 },
        { text: "100 000 кв. м", value: 1000 },
        { text: "300 000 кв. м", value: 3000 }
    ];
    const unitDistrictOptions = [
        { text: "Фешенебельный район", value: 2010 },
        { text: "Центр города", value: 2009 },
        { text: "Спальный район", value: 2008 },
        { text: "Окраина", value: 2007 },
        { text: "Пригород", value: 2006 }
    ];

    function createButton(container, id, text) {
        $(container).append(`<button id="${id}" class="btn">${text}</button>`);
    }

    function createSelect(container, id, options, defaultIndex = 0) {
        const select = $("<select>", { id, class: "selector" });
        options.forEach(option => {
            select.append($("<option>", { text: option.text, value: option.value }));
        });
        $(container).append(select);
        $(`#${id} option`).eq(defaultIndex).prop("selected", true);
    }


    // Создание кнопок
    createButton('.metro_header', 'btnCreateUnit', 'Создать юнит');
    createButton('.metro_header', 'btnRefresh', 'Обновить');


    // Создание селектов
    createSelect('.metro_header', 'unitTypeSelect', unitTypeOptions, 0);
    createSelect('.metro_header', 'unitSizeSelect', unitSizeOptions, 3);
    createSelect('.metro_header', 'unitDistrictSelect', unitDistrictOptions, 0);

    // Создание селекта для выбора отдела для закупки в магаз
    const unitProduceSelectOptions = Object.keys(productsForStore).map(key => ({ text: key, value: key }));

    createSelect('.metro_header', 'unitProduceSelect', unitProduceSelectOptions, 0);

    // Создание инпута для названия юнита
    const unitNameInput = $("<input>", { id: "unitNameInput", type: "text", val: 'Авто с пробегом.' });
    $('.metro_header').append(unitNameInput);

    const unitOptions = {
        allShop:{
            sizes: [
                { text: "100 кв. м", value: 1 },
                { text: "500 кв. м", value: 5 },
                { text: "1 000 кв. м", value: 10 },
                { text: "10 000 кв. м", value: 100 },
                { text: "100 000 кв. м", value: 1000 },
                { text: "300 000 кв. м", value: 3000 }
            ],
            name: 'Walmart Drive.',
            productsForStore: [
                { text: "Автомобильные товары", value: "automotiveGoodsOffer" },
                { text: "Аптека", value: "pharmacy" },
                { text: "Бакалея", value: "groceries" },
                { text: "Детские товары", value: "childrensItems" },
                { text: "Одежда и обувь", value: "clothing" },
                { text: "Продукты питания", value: "food" },
                { text: "Промышленные товары", value: "industrialGoods" },
                { text: "Товары для дома", value: "homeGoods" },
                { text: "Электроника", value: "electronics" },
                { text: "Ювелирка", value: "jewellery" },
                { text: "Сельхоз и Рыба", value: "agricultural" }
            ]
        },
        shop: {
            sizes: [
                { text: "100 кв. м", value: 1 },
                { text: "500 кв. м", value: 5 },
                { text: "1 000 кв. м", value: 10 },
                { text: "10 000 кв. м", value: 100 },
                { text: "100 000 кв. м", value: 1000 },
                { text: "300 000 кв. м", value: 3000 }
            ],
            name: 'Магазин.',
            productsForStore: [
                { text: "Ничего", value: "0" },
                { text: "Машины", value: "automobilCarOffer" },
                { text: "Автомобильные товары", value: "automotiveGoodsOffer" },
                { text: "Аптека", value: "pharmacy" },
                { text: "Бакалея", value: "groceries" },
                { text: "Детские товары", value: "childrensItems" },
                { text: "Одежда и обувь", value: "clothing" },
                { text: "Продукты питания", value: "food" },
                { text: "Промышленные товары", value: "industrialGoods" },
                { text: "Товары для дома", value: "homeGoods" },
                { text: "Электроника", value: "electronics" },
                { text: "Ювелирка", value: "jewellery" },
                { text: "Сельхоз и Рыба", value: "agricultural" }
            ]
        }
    };

    $('#btnRefresh').click(function() {
        const kind = $('#unitTypeSelect').val();
        const options = unitOptions[kind];
        if (options) {
            // Обновление размеров
            $('#unitSizeSelect').empty();
            options.sizes.forEach(option => {
                $('#unitSizeSelect').append($("<option>", { text: option.text, value: option.value }));
            });

            // Обновление имени
            $('#unitNameInput').val(options.name);

            // Обновление продуктов
            // Обновление продуктов
            $('#unitProduceSelect').empty(); // Очистка списка перед добавлением новых опций
            options.productsForStore.forEach(option => {
                $('#unitProduceSelect').append($("<option>", { text: option.text, value: option.value }));
            });

        }
    });

    $('#btnCreateUnit').click(async function() {
        let kind = $('#unitTypeSelect').val();
        const produce = produceSelected($('#unitProduceSelect').val());
        const cityName = $('.globalreport-marketing .retail .unifilter-item div:eq(1) span span span span:eq(0)').attr('title');
        let unitSize = Number($('#unitSizeSelect').val());
        let districtId = Number($('#unitDistrictSelect').val()) || 0;
        let produceId = $('#unitProduceSelect').val() || 0;

        try {
            const sizeRestriction = await hasRestriction(cityName);
            if (sizeRestriction !== null && unitSize > sizeRestriction) {
                console.log("Максимальный размер в данном городе " + (sizeRestriction * 100) + " кв. м");
                unitSize = sizeRestriction;
            } else {
                console.log("Ограничений по размерам нет");
            }

            const cityId = await getId(cityName);

            if (kind === 'allShop') {
                // Для каждого типа магазина в allShop
                for (const productType of unitOptions.allShop.productsForStore) {
                    try {
                        console.log(cityId);
                        // Доступ к тексту и значению
                        let productText = productType.text; // Например, "Машины"

                        if (cityId != null) {
                            let data_ = {
                                method: "POST",
                                base_url: "/api/",
                                token: token, // Убедитесь, что токен был объявлен в вашем коде
                                id: "9675701", // Или другой идентификатор, если он динамический
                                kind: "shop",
                                name: $('#unitNameInput').val() + " " + productText + ". " + cityName,
                                args: {
                                    produce_id: 0,
                                    city_id: cityId,
                                    size: 100,
                                    district_id: 2009,
                                },
                            };

                            console.log("Отправка данных: ", data_);

                            const response = await
                            $.ajax({
                                async: true,
                                type: 'POST',
                                url: 'https://virtonomica.ru/api/?action=company/build&app=adapter_vrt',
                                crossDomain: true,
                                xhrFields: {
                                    withCredentials: true,
                                },
                                data: data_,
                                global: false,
                                dataType: "json"
                            });
                            // Обработка успешного ответа
                            const unitLink = "https://virtonomica.ru/vera/main/unit/view/" + response + "/supply?old";
                            console.log('switch productValue' + productType.value);

                            console.log('unit link - '+ unitLink);
                            const textDisplayAnalytic = createTextDisplayAnalytic();
                            textDisplayAnalytic.text("Ваш " + kind + " с размером " + unitSize * 100 + " кв. м., построен в городе: " + cityName + " с названием: " + data_.name);
                            $(".text-display-analytic").click(function(){
                                window.open(unitLink, '_blank')
                            });
                            setupShop(response, token, produceSelected(productType.value));
                            console.log('switch productValue ' + productType.value);
                            // Дополнительные действия после создания юнита
                            setMarketingProgram(response, token, 2264, 4000000);

                        }
                        else {
                            console.log("Города " + cityName + " не существует");
                        }
                    } catch (error) {
                        console.error("Ошибка при создании магазина: ", error);
                    }
                }
            } else {
                console.log(cityId);
                if (cityId != null) {
                    let data_ = {
                        method: "POST",
                        base_url: "/api/",
                        token: token, // Убедитесь, что токен был объявлен в вашем коде
                        id: "9675701", // Или другой идентификатор, если он динамический
                        kind: kind,
                        name: $('#unitNameInput').val() + " " + $("#unitProduceSelect option:selected").text() + ". " + cityName,
                        args: {
                            produce_id: produceId,
                            city_id: cityId,
                            size: unitSize,
                            district_id: districtId,
                        },
                    };

                    console.log("Отправка данных: ", data_);

                    const response = await
                    $.ajax({
                        async: true,
                        type: 'POST',
                        url: 'https://virtonomica.ru/api/?action=company/build&app=adapter_vrt',
                        crossDomain: true,
                        xhrFields: {
                            withCredentials: true,
                        },
                        data: data_,
                        global: false,
                        dataType: "json"
                    });
                    // Обработка успешного ответа
                    const unitLink = "https://virtonomica.ru/vera/main/unit/view/" + response + "/supply?old";
                    console.log('unit link - '+ unitLink);
                    const textDisplayAnalytic = createTextDisplayAnalytic();
                    textDisplayAnalytic.text("Ваш " + kind + " с размером " + unitSize * 100 + " кв. м., построен в городе: " + cityName + " с названием: " + data_.name);
                    $(".text-display-analytic").click(function(){
                        window.open(unitLink, '_blank')
                    });
                    // Дополнительные действия после создания юнита
                    switch (kind) {
                        case "allShop":
                            setupShop(response, token, produce);
                            break;
                        case "shop":
                            setupShop(response, token, produce);
                            break;
                        default:
                            console.log("Неизвестный тип юнита: " + kind);
                    }
                    setMarketingProgram(response, token, 2264, cost);

                }
                else {
                    console.log("Города " + cityName + " не существует");
                }
            }

        } catch (error) {
            console.error("Ошибка при выполнении запроса: ", error);
        }
    });


    // Функция для отправки запроса по API
    function sendApiRequest(apiUrl, data) {
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        sendRequest(apiUrl, formData);
    }

    // Общие действия для всех типов юнитов
    function setMarketingProgram(response, token, type_ids, cost) {
        const apiUrl = `https://virtonomica.ru/api/?action=unit/marketing/program/set&app=virtonomica&id=${response}&token=${token}&type_ids[]=${type_ids}&cost=${cost}`;
        sendApiRequest(apiUrl, { token: token, method: 'POST', base_url: '/api/' });
    }





    // Действия для магазина
    function setupShop(response, token, produce) {
        sendApiRequest("https://virtonomica.ru/api/vera/main/unit/artefact/attach?format=json&app=adapter_vrt", {
            id: response,
            artefact_id: '301019',
            token: token
        });
        // Товары заказ выбранного отдела по 1 шт каждого
        $.each(produce, function(index, offerId) {
            sendOfferRequest(offerId, response);
        });

    }


    /*------------------------------------------------------------------------------
                        setTimeout(function() {
                            window.location.href = unitLink;
                        }, 5000);

                        $(".text-display-analytic").click(function(){
                            window.open(unitLink, '_blank')
                        });

*/
    async function getId(currentCityName){
        return cityIdMap[currentCityName];
    }


    async function hasRestriction(currentCityName){
        if (currentCityName in restrictionInMap) {
            return restrictionInMap[currentCityName];
        } else {
            return null;
        }
    }

    function createTextDisplayAnalytic() {
        countOfLink++;
        const analyticDiv = $("<div class='text-display-analytic'></div>").addClass(`analytic-${countOfLink}`);
        $('.metro_header').append(analyticDiv);
        return analyticDiv;
    }

    async function sendRequest(apiUrl, formData) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();
            console.log("данные от пост запроса - " + data);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    async function sendOfferRequest(offerId, id) {
        const url = "https://virtonomica.ru/api/vera/main/unit/supply/set?format=json&app=adapter_vrt";

        const formData = new FormData();
        formData.append("token", token);
        formData.append("id", id);
        formData.append("offer_id", offerId);
        formData.append("quality_min", "");
        formData.append("price_constraint", "0");
        formData.append("price_max", "0");
        formData.append("qty", "1");
        fetch(url, {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
            console.log(data); // Здесь вы можете обработать ответ сервера
        })
            .catch(error => {
            console.error("Ошибка при выполнении запроса:", error);
        });
    }

    // Функция для получения массива товаров
    const produceSelected = produce => productsForStore[produce] || 0;

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
    $('.btn').css({
        "color": "#fff",
        "text-decoration": "none",
        "user-select": "none",
        "background": "rgb(212,75,56)",
        "padding": ".7em 1.5em",
        "outline": "none"
    });

    $(".btn").hover(function(){
        $(this).css("background", "rgb(232,95,76)");
    });
    $(".btn").mousedown(function(){
        $(this).css("background", "rgb(152,15,0)");
    });
    //----------------------------------------------------------------------------------------------------------------------------------------------------------

}


if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}