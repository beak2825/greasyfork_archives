// ==UserScript==
// @name         Создать таблицу Производство-Расход-Запас
// @namespace    Virtonomica
// @version      0.4
// @description  Скрипт добавляет кнопку, чтобы создать таблицу расходов запасов и производствао на странице отчета-расход
// @author       VaryaUsoyanComp
// @match        https://virtonomica.ru/anna/main/company/view/5463412/sales_report
// @icon         https://www.google.com/s2/favicons?sz=64&domain=virtonomica.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480147/%D0%A1%D0%BE%D0%B7%D0%B4%D0%B0%D1%82%D1%8C%20%D1%82%D0%B0%D0%B1%D0%BB%D0%B8%D1%86%D1%83%20%D0%9F%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE-%D0%A0%D0%B0%D1%81%D1%85%D0%BE%D0%B4-%D0%97%D0%B0%D0%BF%D0%B0%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/480147/%D0%A1%D0%BE%D0%B7%D0%B4%D0%B0%D1%82%D1%8C%20%D1%82%D0%B0%D0%B1%D0%BB%D0%B8%D1%86%D1%83%20%D0%9F%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE-%D0%A0%D0%B0%D1%81%D1%85%D0%BE%D0%B4-%D0%97%D0%B0%D0%BF%D0%B0%D1%81.meta.js
// ==/UserScript==

let run = function() {
    var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    var $ = win.$;
    let productData = {};


    $('.metro_header').append(`<button id="collectData" class="button">Собрать данные</button>`);
    $('.metro_header').append(`<button id="createTable" class="button">Создать таблицу</button>`);
    $('.metro_header').append(`<button id="createSearch" class="button">Создать поиск</button>`);
    $('.button').css({
        'background-color': 'green',
        'color': '#fff',
        'border': 'none',
        'padding': '10px 20px',
        'font-size': '12px',
        'cursor': 'pointer'
    });

    // Event handler for the button click
    $('#collectData').click(function () {
        const unitClassIds = [423693, 422811, 422789, 373182, 359822, 1885];
        const companyId = 5463412;
        const pageSize = 1000;
        let allUnitIds = [];

        // Function to fetch unit ids
        async function fetchUnitIds(unitClassId) {
            try {
                const response = await $.ajax({
                    url: `https://virtonomica.ru/api/anna/main/company/units?id=${companyId}&unit_class_id=${unitClassId}&pagesize=${pageSize}`,
                    method: 'GET',
                    dataType: 'json'
                });

                const unitIds = Object.keys(response.data).map(key => response.data[key].id);
                return unitIds;
            } catch (error) {
                console.error(`Error fetching unit ids for unit_class_id ${unitClassId}: ${error.message}`);
                return [];
            }
        }

        // Function to get all unit ids
        async function getAllUnitIds() {
            try {
                const results = await Promise.all(unitClassIds.map(async (unitClassId) => {
                    const unitIds = await fetchUnitIds(unitClassId);
                    return unitIds;
                }));

                // Flatten the array of arrays into a single array
                allUnitIds = results.flat();

                // Call fetchData here to ensure allUnitIds is populated
                await fetchData();

                // Change the text of the button
                $('#collectData').text('Данные собраны');
            } catch (error) {
                console.error("Error fetching unit ids: " + error.message);
            }
        }

        // Function to fetch data for all units
        async function fetchData() {
            try {
                await Promise.all(allUnitIds.map(async (id) => {
                    const data = await $.ajax({
                        url: `https://virtonomica.ru/api/anna/main/unit/supply/summary?id=${id}`,
                        method: 'GET',
                        dataType: 'json'
                    });

                    if (typeof data === 'object' && Object.keys(data).length > 0) {
                        for (const itemId in data) {
                            const item = data[itemId];
                            const productName = item.product_name;
                            const required = parseInt(item.required);

                            if (required > 0) {
                                // Check if productData is an array before using push
                                if (Array.isArray(productData)) {
                                    // If it's an array, you might want to push an object with properties
                                    productData.push({ productName, required });
                                } else {
                                    // If it's not an array, treat it as an object and assign values directly
                                    productData[productName] = (productData[productName] || 0) + required;
                                }
                            }
                        }
                    }
                }));
                console.log(productData);
            } catch (error) {
                console.error("Error fetching product data: " + error.message);
            }
        }

        // Call the function to get all unit ids
        getAllUnitIds();
    });


    $('#createSearch').click(function(){
        console.log(productData);
        var originalData = $(".table-compact tbody").clone();

        // Создаем поле ввода
        var inputField = $('<input type="text" id="searchInput" name="searchInput">');

        // Создаем кнопку поиска
        var searchButton = $('<button type="button">Search</button>');

        // Вставляем поле ввода и кнопку после элемента с классом "alert-info" и перед элементом с классом "by_products"
        $(".alert-info").after(inputField, searchButton);

        // Добавляем обработчик события клика для кнопки
        searchButton.click(function() {
            searchAndFilter();
        });

        $("#searchInput").on('keyup', function(event) {
            // Проверяем, является ли нажатая клавиша Enter (код 13)
            if (event.keyCode === 13) {
                // Вызываем функцию searchAndFilter()
                searchAndFilter();
            }
        });

        // Функция для обработки события поиска и фильтрации
        function searchAndFilter() {
            // Получаем значение из поля ввода
            var searchText = $("#searchInput").val().trim().toLowerCase();

            // Ищем совпадение и фильтруем
            $(".table-compact tbody").each(function() {
                var tdText = $(this).find("td[class*='text-middle']").text().trim().toLowerCase();

                // Регулярное выражение для поиска с начала строки
                var regex = new RegExp("^" + searchText);

                // Проверяем на соответствие регулярному выражению
                if (regex.test(tdText)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
    });



    $('#createTable').click(function () {
        var commodityObjects = [];

        function updateCommodityObjects() {
            $.when(
                $.get("https://virtonomica.ru/api/anna/main/company/report/commodity/reserves?id=5463412"),
                $.get("https://virtonomica.ru/api/anna/main/company/report/commodity/produce?id=5463412"),
                $.get("https://virtonomica.ru/api/anna/main/company/report/commodity/consume?id=5463412")
            ).done(function (reservesData, produceData, consumeData) {
                var reservesMap = {};
                reservesData[0].forEach(function (item) {
                    reservesMap[item.product_symbol] = item.product_count;
                });

                var produceMap = {};
                produceData[0].forEach(function (item) {
                    produceMap[item.product_symbol] = item.qty;
                });

                var consumeMap = {};
                consumeData[0].forEach(function (item) {
                    consumeMap[item.product_symbol] = item.qty;
                });

                commodityObjects = [];

                reservesData[0].forEach(function (item) {
                    var productName = item.product_name;
                    var commodityObject = {
                        symbol: item.product_symbol,
                        name: productName,
                        produce: produceMap[item.product_symbol] || "0",
                        consume: consumeMap[item.product_symbol] || "0",
                        reserves: item.product_count,
                        consumeShop: productData[productName] || "0" // Add the consumeShop field
                    };
                    commodityObjects.push(commodityObject);
                });

                // Вызываем функцию обновления таблицы после получения данных
                updateTable();
            });
        }


        function updateTable() {
            $(".table-compact tbody").remove();

            commodityObjects.forEach(function(item) {
                var tbody = $("<tbody>");

                var tr = $("<tr class=''>");

                var td1 = $("<td class='text-middle width15-on-trans'>");
                var icon = $("<i>")
                .addClass("ico pr-" + item.symbol + " popovers")
                .attr({
                    "data-trigger": "hover",
                    "data-container": "body",
                    "data-placement": "right",
                    "data-content": item.name,
                    "data-original-title": "",
                    "title": ""
                });
                td1.append(icon);
                tr.append(td1);

                var td2 = $("<td class='text-middle width70-on-trans order2-on-trans'>")
                .text(item.name);
                tr.append(td2);

                var td3 = $("<td class='text-middle text-right width40-on-trans order4-on-trans'>")
                .html("<div class='show-on-trans font-blue-oleo'>Произведено:</div>" + formatNumber(item.produce))
                .css("color", "#008000"); // Зеленый цвет
                tr.append(td3);

                var td4 = $("<td class='text-middle text-right width30-on-trans order5-on-trans'>")
                .html("<div class='show-on-trans font-blue-oleo'>Расход:</div>" + formatNumber(item.consume))
                .css("color", "#DC143C"); // Crimson цвет

                // Добавляем div для отображения значения в скобках
                var consumeTotal = parseInt(item.consume) + parseInt(item.consumeShop);
                var formattedConsumeTotal = formatNumber(consumeTotal);
                var consumeDiv = $("<div>").text(`(${formattedConsumeTotal})`).css({
                    color: "#DC143C", // Crimson цвет
                    fontSize: "10px", // Размер шрифта для скобок
                    marginLeft: "5px" // Отступ слева от значения
                });

                // Добавляем div внутрь td4
                td4.append(consumeDiv);
                tr.append(td4);

                var td5 = $("<td class='text-middle text-right width30-on-trans order6-on-trans'>")
                .html("<div class='show-on-trans font-blue-oleo'>Запасы:</div>" + formatNumber(item.reserves))
                .css("color", "#FF8C00"); // Золотой цвет
                tr.append(td5);


                var produce = parseInt(item.produce);
                var difference = consumeTotal - produce;
                var formattedDifference = formatNumber(Math.abs(difference));
                var formattedDifferenceDiv;
                // Устанавливаем цвет текста в зависимости от знака разницы
                var color = difference >= 0 ? "#FF4500" : "#006400";
                var color6div;
                var td6 = $("<td class='text-middle text-right width30-on-trans order3-on-trans'>")
                .html("<div class='show-on-trans font-blue-oleo'>Разница:</div>" + formattedDifference)
                .css({
                    color: color, // Зеленый или Crimson цвет
                    fontWeight: "bold" // Жирный шрифт
                });

                if (difference >= 0) {
                    var roundedDifference = Math.round(Math.abs(parseInt(item.reserves) / difference));
                    formattedDifferenceDiv = formattedDifferenceDiv = "~" + roundedDifference;
                    color6div = "#556B2F";
                } else {
                    formattedDifferenceDiv = "∞";
                    color6div = "#556B2F";

                }

                var differentDiv = $("<div>").text(`(${formattedDifferenceDiv})`).css({
                    color: color6div, //
                    fontSize: "10px", // Размер шрифта для скобок
                    marginLeft: "5px" // Отступ слева от значения
                });

                // Добавляем div внутрь td4
                td6.append(differentDiv);
                tr.append(td6);



                tbody.append(tr);

                $(".table-compact").append(tbody);
            });

            // Изменяем текст в заголовке таблицы
            $(".table-compact thead th:nth-child(2)").text("Произведено");
            $(".table-compact thead th:nth-child(3)").text("Расход");
            $(".table-compact thead th:nth-child(4)").text("Запасы");
            $(".table-compact thead th:nth-child(5)").text("Разница");
        }

        function formatNumber(number) {
            // Функция для форматирования числа с пробелами каждые 3 цифры
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }

        // Вызываем функцию обновления данных
        updateCommodityObjects();


    });

}


if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}
