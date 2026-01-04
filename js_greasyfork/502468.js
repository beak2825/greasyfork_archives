// ==UserScript==
// @name         RMRP Forum Script
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  try to take over the world!
// @author       Shprotik
// @match       https://forum.rmrp.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rmrp.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502468/RMRP%20Forum%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/502468/RMRP%20Forum%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Хранилище для кастомных ответов
    const savedDat = localStorage.getItem('RMRP');
    let dataObjects;

    if (savedDat) {
        dataObjects = JSON.parse(savedDat);
        console.log('Previous Data:', dataObjects);
    } else {
        dataObjects = [];
    }

    // Хранилище для избранных ответов
    const favouritesDates = localStorage.getItem("Foreverr");
    let favouritesObject;

    if (favouritesDates) {
        favouritesObject = JSON.parse(favouritesDates)
    } else {
        favouritesObject = {};
    }

    // Хранилище для настройки подсветки
    const lightInfo = localStorage.getItem('LIGHT');
    let boolLight;

    if (lightInfo) {
        boolLight = JSON.parse(lightInfo)
    } else {
        boolLight = false;
    }

    var buttons = document.querySelector("div.formButtonGroup-primary");

    // Создание div контейнера с меню
    var divDivMenu = document.createElement("div");
    divDivMenu.className = "menu-container-rmscript";

    // Создание кнопки для открытия меню с шаблонами
    var buttonShablon = document.createElement("button")
    buttonShablon.className = "button--primary button button--icon button--icon--reply";
    buttonShablon.innerHTML = "Заготовки";
    buttonShablon.type = "button";
    buttonShablon.addEventListener("click", function () {
        MenuCall()
    })

    function MenuCall(event=0) {
        // Добавление Title для меню
        var titleMenu = document.createElement("div");
        titleMenu.className = "menu-title";
        titleMenu.style.padding = "20px";
        titleMenu.style.backgroundColor = "#0b0b2e";
        titleMenu.style.position = "fixed";
        titleMenu.style.top = "10%";
        titleMenu.style.left = "50%";
        titleMenu.style.width = "50%";
        titleMenu.style.height = "6%";
        titleMenu.style.transform = "translate(-50%, -50%)";
        titleMenu.style.borderTopLeftRadius = "16px";
        titleMenu.style.borderTopRightRadius = "16px";
        titleMenu.style.borderBottom = "0.5px solid #eac28d";
        titleMenu.style.boxShadow = "4px 6px 12px rgba(0, 0, 0.5, 0.5)";

        var selectAnswer = document.createElement("span");
        selectAnswer.innerHTML = "Выберите меню:";
        selectAnswer.style.fontWeight = "bold";
        selectAnswer.style.fontSize = "16px";
        titleMenu.appendChild(selectAnswer);

        // Добавление Main для меню
        var mainMenu = document.createElement("div");
        mainMenu.className = "menu-main";
        mainMenu.style.padding = "20px";
        mainMenu.style.backgroundColor = "#1a1a47";
        mainMenu.style.position = "fixed";
        mainMenu.style.top = "35%";
        mainMenu.style.left = "50%";
        mainMenu.style.width = "50%";
        mainMenu.style.height = "45%";
        mainMenu.style.transform = "translate(-50%, -50%)";
        mainMenu.style.borderBottomLeftRadius = "16px";
        mainMenu.style.borderBottomRightRadius = "16px";
        mainMenu.style.borderBottom = "1px solid #1b1b3e";
        mainMenu.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.5)";

        // Добавление черного экрана
        var blackFon = document.createElement("div");
        blackFon.style.backgroundColor = "#000";
        blackFon.style.opacity = "0.4";
        blackFon.style.width = "100%";
        blackFon.style.height = "100%";
        blackFon.style.position = "fixed";
        blackFon.style.top = "0";
        blackFon.style.left = "0";
        blackFon.addEventListener("click", function() {
            blackFon.remove();
            titleMenu.remove();
            mainMenu.remove()
        })

        var Ryblevka = document.createElement("button");
        Ryblevka.className = "value-buttonRyblevka";
        Ryblevka.innerHTML = "Рублевка";
        Ryblevka.style.margin = "7px";
        Ryblevka.style.padding = "7px 10px";
        Ryblevka.style.backgroundColor = "#1379ff";
        Ryblevka.style.color = "white";
        Ryblevka.style.borderRadius = "7px";
        Ryblevka.style.fontWeight = "bold";
        Ryblevka.style.border = "None";
        Ryblevka.style.boxShadow = "10px 7px 10px rgba(19,121,255, 0.5)";
        Ryblevka.style.transition = "box-shadow 0.3s ease";
        Ryblevka.addEventListener("click", function () {
            // Активация функций
            ClearMainMenu()
            BackButtServer()
            RyblevkaButt(mainMenu)
            selectAnswer.innerHTML = "Выберите шаблон из раздела Рублевки:"
        })

        var Arbat = document.createElement("button");
        Arbat.className = "value-buttonArbat";
        Arbat.innerHTML = "Арбат";
        Arbat.style.margin = "7px";
        Arbat.style.padding = "7px 10px";
        Arbat.style.backgroundColor = "#ffb413";
        Arbat.style.color = "white";
        Arbat.style.borderRadius = "7px";
        Arbat.style.fontWeight = "bold";
        Arbat.style.border = "None";
        Arbat.style.boxShadow = "10px 7px 10px rgba(255, 180, 19, 0.5)";
        Arbat.style.transition = "box-shadow 0.3s ease";
        Arbat.addEventListener("click", function () {
            // Активация функций
            ClearMainMenu()
            BackButtServer()
            ArbatButt(mainMenu)
            selectAnswer.innerHTML = "Выберите шаблон из раздела Арбата:"
        })

        var Forevers = document.createElement("button");
        Forevers.className = "value-buttonSetting";
        Forevers.innerHTML = "Избранное";
        Forevers.style.margin = "7px";
        Forevers.style.padding = "7px 10px";
        Forevers.style.backgroundColor = "#15f354";
        Forevers.style.color = "white";
        Forevers.style.borderRadius = "7px";
        Forevers.style.fontWeight = "bold";
        Forevers.style.border = "None";
        Forevers.style.boxShadow = "10px 7px 10px rgba(21,243,84, 0.5)";
        Forevers.addEventListener("click", function () {
            ClearMainMenu()
            selectAnswer.innerHTML = "Избранное:"
            BackButtServer()

            ForevorList(favouritesObject, mainMenu)

            function ForevorList(forevs, func) {
                console.log(forevs);

                // Получаем массив ключей
                Object.keys(forevs).forEach(key => {
                    // Получаем значение по текущему ключу
                    var value = forevs[key];

                    // Создаем кнопку
                    var button = document.createElement("button");

                    // Используем ключ как класс кнопки
                    button.className = key;
                    // Используем значение как внутренний HTML кнопки
                    button.innerHTML = key;
                    button.style.margin = "7px";
                    button.style.paddingRight = "10px";
                    button.style.paddingLeft = "10px";
                    button.style.paddingTop = "7px";
                    button.style.paddingBottom = "7px";
                    button.style.borderRadius = "7px";
                    button.style.fontWeight = "bold";

                    let keyupHandler
                    button.addEventListener("mouseenter", function () {
                        button.style.backgroundColor = "#0b0b2e";
                        button.style.color = "white"
                        button.style.border = "1px solid #1C1C57FF";

                        keyupHandler = function (event) {
                            if (event.code === "KeyD") {
                                console.log(key)
                                delete favouritesObject[key];
                                localStorage.setItem('Foreverr', JSON.stringify(favouritesObject));
                            }
                        };

                        document.addEventListener("keyup", keyupHandler);
                    })

                    button.addEventListener("mouseleave", function () {
                        button.style.backgroundColor = "#15f354";
                        button.style.color = "white";
                        button.style.border = "None"

                        document.removeEventListener("keyup", keyupHandler);
                    })

                    if (boolLight) {
                        button.style.backgroundColor = "#15f354";
                        button.style.color = "white";
                        button.style.border = "None";
                        button.style.boxShadow = "10px 7px 10px rgba(21,243,84, 0.5)";
                        button.style.transition = "box-shadow 0.3s ease";
                    } else {
                        button.style.backgroundColor = "#0b0b2e";
                        button.style.color = "white";
                        button.style.border = "1px solid #1C1C57FF";
                    }

                    // Добавляем обработчик клика
                    button.addEventListener("click", function () {
                        blackFon.remove();
                        titleMenu.remove();
                        mainMenu.remove();

                        const dlElement = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_name"]');
                        const ddElement = dlElement.querySelector('dd');

                        const youName = document.querySelector("span.p-navgroup-linkText")

                        const report_user_id = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_id"]');
                        const user_id = report_user_id.querySelector('dd');
                        console.log(value)

                        value = value.replace("YouNick", youName.innerHTML)
                        value = value.replace("Nick", ddElement.innerHTML)
                        value = value.replace("StaticReport", user_id.innerHTML)

                        var inputTextMenu = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible");
                        // document.querySelector("span.fr-placeholder").innerHTML = "";
                        inputTextMenu.innerHTML = value;
                    });

                    func.appendChild(button);
                });
            }
        })

        var Setting = document.createElement("button");
        Setting.className = "value-buttonSetting";
        Setting.innerHTML = "Настройки";
        Setting.style.margin = "7px";
        Setting.style.padding = "7px 10px";
        Setting.style.backgroundColor = "#f32015";
        Setting.style.color = "white";
        Setting.style.borderRadius = "7px";
        Setting.style.fontWeight = "bold";
        Setting.style.border = "None";
        Setting.style.boxShadow = "10px 7px 10px rgba(243,32,21, 0.5)";
        Setting.style.transition = "box-shadow 0.3s ease";
        Setting.addEventListener("click", function () {
            ClearMainMenu()
            selectAnswer.innerHTML = "Настройки:"
            BackButtServer()

            var checkBox = document.createElement("input");
            checkBox.type = "checkbox";
            checkBox.id = "myCheckbox";
            checkBox.style.backgroundColor = "#f32015";
            checkBox.style.color = "white";
            checkBox.style.borderRadius = "7px";
            checkBox.style.fontWeight = "bold";
            checkBox.style.boxShadow = "8px 4px 6px rgba(243,32,21, 0.5)";
            checkBox.style.transition = "box-shadow 0.3s ease";
            checkBox.style.marginRight = "15px";
            checkBox.style.marginTop = "15px";
            checkBox.style.transform = "scale(1.2)";
            checkBox.style.transformOrigin = "top left";
            checkBox.checked = boolLight
            checkBox.addEventListener("change", function () {
                localStorage.setItem("LIGHT", JSON.stringify(checkBox.checked))
            })

            var label = document.createElement("label");
            label.style.padding = "7px 10px";
            label.style.backgroundColor = "#f32015";
            label.style.color = "white";
            label.style.borderRadius = "7px";
            label.style.fontWeight = "bold";
            label.style.border = "None";
            label.style.boxShadow = "10px 7px 10px rgba(243,32,21, 0.5)";
            label.style.transition = "box-shadow 0.3s ease";
            label.innerHTML = "Подсветка кнопок"

            mainMenu.appendChild(checkBox);
            mainMenu.appendChild(label);
        })

        document.body.appendChild(divDivMenu);
        divDivMenu.appendChild(blackFon);
        divDivMenu.appendChild(titleMenu);

        mainMenu.appendChild(Ryblevka)
        mainMenu.appendChild(Arbat)

        mainMenu.appendChild(Forevers)
        mainMenu.appendChild(Setting)

        divDivMenu.appendChild(mainMenu);

        // Функции
        function BackButtServer() {
            var div = document.createElement("div");
            var button = document.createElement("button")
            button.className = "back-button";
            button.innerHTML = "← Вернутся назад";
            button.style.margin = "5px";
            button.style.paddingRight = "10px";
            button.style.paddingLeft = "10px";
            button.style.paddingTop = "7px";
            button.style.paddingBottom = "7px";
            button.style.borderRadius = "7px";
            button.style.backgroundColor = "#0b0b2e";
            button.style.color = "white"
            button.style.fontWeight = "bold";
            button.style.border = "1px solid #0b0b2e";
            button.style.boxShadow = `8px 8px 8px rgba(${parseInt("#0b0b2e".slice(1, 3), 16)}, ${parseInt("#0b0b2e".slice(3, 5), 16)}, ${parseInt("#0b0b2e".slice(5, 7), 16)}, 0.5)`;
            button.addEventListener("click", function () {
                selectAnswer.innerHTML = "Выберите сервер:"
                ClearMainMenu()
                mainMenu.appendChild(Ryblevka)
                mainMenu.appendChild(Arbat)
                mainMenu.appendChild(Forevers)
                mainMenu.appendChild(Setting)
            })
            div.appendChild(button)
            mainMenu.appendChild(div)
        }

        function RyblevkaButt(div) {

            let keyupHandler;
            function AddButton(value, func) {
                var button = document.createElement("button")
                button.className = value.Title;
                button.innerHTML = value.Title;
                button.style.margin = "7px";
                button.style.paddingRight = "10px";
                button.style.paddingLeft = "10px";
                button.style.paddingTop = "7px";
                button.style.paddingBottom = "7px";
                button.style.borderRadius = "7px";
                button.style.fontWeight = "bold"

                if (boolLight) {
                    button.style.backgroundColor = "#1379ff";
                    button.style.color = "white";
                    button.style.border = "None";
                    button.style.boxShadow = "10px 7px 10px rgba(19,121,255, 0.5)";
                    button.style.transition = "box-shadow 0.3s ease";

                    button.addEventListener("mouseenter", function () {
                        button.style.backgroundColor = "#0b0b2e";
                        button.style.color = "white"
                        button.style.border = "1px solid #1C1C57FF";

                        keyupHandler = function (event) {
                            if (event.code === "KeyI") {
                                if (value.Title in favouritesObject) {
                                    console.log("Уже есть")
                                } else {
                                    const dlElement = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_name"]');
                                    const ddElement = dlElement.querySelector('dd');

                                    const youName = document.querySelector("span.p-navgroup-linkText")

                                    const report_user_id = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_id"]');
                                    const user_id = report_user_id.querySelector('dd');

                                    console.log(value)
                                    console.log(ddElement.innerHTML)

                                    value.Body = value.Body.replace(ddElement.innerHTML, "Nick")
                                    value.Body = value.Body.replace(youName.innerHTML, "YouNick")
                                    value.Body = value.Body.replace(user_id.innerHTML, "StaticReport")

                                    favouritesObject[value.Title] = value.Body

                                    localStorage.setItem('Foreverr', JSON.stringify(favouritesObject));
                                    console.log(favouritesObject)

                                    ClearMainMenu()
                                    selectAnswer.innerHTML = "Избранное:"
                                    BackButtServer()

                                    ForevorList(favouritesObject, mainMenu)

                                    function ForevorList(forevs, func) {
                                        console.log(forevs);

                                        // Получаем массив ключей
                                        Object.keys(forevs).forEach(key => {
                                            // Получаем значение по текущему ключу
                                            var value = forevs[key];

                                            // Создаем кнопку
                                            var button = document.createElement("button");

                                            // Используем ключ как класс кнопки
                                            button.className = key;
                                            // Используем значение как внутренний HTML кнопки
                                            button.innerHTML = key;
                                            button.style.margin = "7px";
                                            button.style.paddingRight = "10px";
                                            button.style.paddingLeft = "10px";
                                            button.style.paddingTop = "7px";
                                            button.style.paddingBottom = "7px";
                                            button.style.borderRadius = "7px";
                                            button.style.fontWeight = "bold";

                                            if (boolLight) {
                                                button.style.backgroundColor = "#15f354";
                                                button.style.color = "white";
                                                button.style.border = "None";
                                                button.style.boxShadow = "10px 7px 10px rgba(21,243,84, 0.5)";
                                                button.style.transition = "box-shadow 0.3s ease";
                                            } else {
                                                button.style.backgroundColor = "#0b0b2e";
                                                button.style.color = "white";
                                                button.style.border = "1px solid #1C1C57FF";
                                            }

                                                // Добавляем обработчик клика
                                                button.addEventListener("click", function () {
                                                blackFon.remove();
                                                titleMenu.remove();
                                                mainMenu.remove();

                                                const dlElement = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_name"]');
                                                const ddElement = dlElement.querySelector('dd');

                                                const youName = document.querySelector("span.p-navgroup-linkText")

                                                const report_user_id = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_id"]');
                                                const user_id = report_user_id.querySelector('dd');
                                                console.log(value)

                                                value = value.replace("YouNick", youName.innerHTML)
                                                value = value.replace("Nick", ddElement.innerHTML)
                                                value = value.replace("StaticReport", user_id.innerHTML)

                                                var inputTextMenu = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible");
                                                document.querySelector("span.fr-placeholder").innerHTML = "";
                                                inputTextMenu.innerHTML = value;
                                            });

                                            func.appendChild(button);
                                        });
                                    }
                                }

                            }
                        };

                        document.addEventListener("keyup", keyupHandler);
                    })

                    button.addEventListener("mouseleave", function () {
                        button.style.backgroundColor = "#1379ff";
                        button.style.color = "white";
                        button.style.border = "None"

                        document.removeEventListener("keyup", keyupHandler);
                    })
                } else {
                    button.style.backgroundColor = "#0b0b2e";
                    button.style.color = "white"
                    button.style.fontWeight = "bold";
                    button.style.border = "1px solid #1C1C57FF";
                }
                button.addEventListener("click", function () {
                    blackFon.remove();
                    titleMenu.remove();
                    mainMenu.remove();

                    var inputTextMenu = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible")
                    document.querySelector("span.fr-placeholder").innerHTML = ""
                    inputTextMenu.innerHTML = value.Body
                })
                func.appendChild(button)
            }

            function DelCutomButton(value, func) {
                var button = document.createElement("button")
                button.className = value.Title;
                button.innerHTML = value.Title;
                button.style.margin = "7px";
                button.style.paddingRight = "10px";
                button.style.paddingLeft = "10px";
                button.style.paddingTop = "7px";
                button.style.paddingBottom = "7px";
                button.style.backgroundColor = "#0b0b2e";
                button.style.color = "white"
                button.style.borderRadius = "7px";
                button.style.fontWeight = "bold";
                button.style.border = "1px solid #1C1C57FF";
                button.addEventListener("click", function () {
                    blackFon.remove();
                    titleMenu.remove();
                    mainMenu.remove();

                    dataObjects = dataObjects.filter(item => item.Title !== value.Title);
                    localStorage.setItem('RMRP', JSON.stringify(dataObjects));

                    console.log(dataObjects);
                })
                func.appendChild(button)
            }
            function BackButt() {
                var button = document.createElement("button")
                button.className = "back-button";
                button.innerHTML = "← Вернутся назад";
                button.style.margin = "5px";
                button.style.paddingRight = "10px";
                button.style.paddingLeft = "10px";
                button.style.paddingTop = "7px";
                button.style.paddingBottom = "7px";
                button.style.borderRadius = "7px";

                if (boolLight) {
                    button.style.backgroundColor = "#0050b6";
                    button.style.color = "white";
                    button.style.border = "None";
                    button.style.boxShadow = "10px 7px 10px rgba(0, 80, 182, 0.5)";
                    button.style.transition = "box-shadow 0.3s ease";
                } else {
                    button.style.backgroundColor = "#0b0b2e";
                    button.style.color = "white"
                    button.style.fontWeight = "bold";
                    button.style.border = "1px solid #0b0b2e";
                    button.style.boxShadow = `8px 8px 8px rgba(${parseInt("#0b0b2e".slice(1, 3), 16)}, ${parseInt("#0b0b2e".slice(3, 5), 16)}, ${parseInt("#0b0b2e".slice(5, 7), 16)}, 0.5)`;
                }
                button.addEventListener("click", function () {
                    selectAnswer.innerHTML = "Выберите меню:"
                    ClearMainMenu()
                    BackButtServer()
                    RyblevkaButt(mainMenu)
                })
                mainMenu.appendChild(button)
            }

            function CustomButt() {
                var buttonCkeck = document.createElement("button_check")
                buttonCkeck.className = "back-button";
                buttonCkeck.innerHTML = "Просмотр добавленных ответов";
                buttonCkeck.style.margin = "5px";
                buttonCkeck.style.paddingRight = "10px";
                buttonCkeck.style.paddingLeft = "10px";
                buttonCkeck.style.paddingTop = "7px";
                buttonCkeck.style.paddingBottom = "7px";
                buttonCkeck.style.backgroundColor = "#0b0b2e";
                buttonCkeck.style.color = "white"
                buttonCkeck.style.borderRadius = "7px";
                buttonCkeck.style.fontWeight = "bold";
                buttonCkeck.style.border = "1px solid #0b0b2e";
                buttonCkeck.style.boxShadow = `8px 8px 8px rgba(${parseInt("#0b0b2e".slice(1, 3), 16)}, ${parseInt("#0b0b2e".slice(3, 5), 16)}, ${parseInt("#0b0b2e".slice(5, 7), 16)}, 0.5)`;
                buttonCkeck.addEventListener("click", function () {
                    selectAnswer.innerHTML = "Просмотр добавленных ответов"
                    ClearMainMenu()
                    BackButt()

                    var variantDiv = document.createElement("div");

                    dataObjects.forEach(function (value) {
                        AddButton(value, variantDiv)
                    })

                    mainMenu.appendChild(variantDiv)
                })

                var buttonAdd = document.createElement("buttonAdd")
                buttonAdd.className = "back-button";
                buttonAdd.innerHTML = "Добавить ответ";
                buttonAdd.style.margin = "5px";
                buttonAdd.style.paddingRight = "10px";
                buttonAdd.style.paddingLeft = "10px";
                buttonAdd.style.paddingTop = "7px";
                buttonAdd.style.paddingBottom = "7px";
                buttonAdd.style.backgroundColor = "#0b0b2e";
                buttonAdd.style.color = "white"
                buttonAdd.style.borderRadius = "7px";
                buttonAdd.style.fontWeight = "bold";
                buttonAdd.style.border = "1px solid #0b0b2e";
                buttonAdd.style.boxShadow = `8px 8px 8px rgba(${parseInt("#0b0b2e".slice(1, 3), 16)}, ${parseInt("#0b0b2e".slice(3, 5), 16)}, ${parseInt("#0b0b2e".slice(5, 7), 16)}, 0.5)`;
                buttonAdd.addEventListener("click", function () {
                    selectAnswer.innerHTML = "Добавление кастомного ответа"
                    ClearMainMenu()
                    AddCustom()
                })

                var buttonDel = document.createElement("buttonDel")
                buttonDel.className = "back-button";
                buttonDel.innerHTML = "Удалить шаблон";
                buttonDel.style.margin = "5px";
                buttonDel.style.paddingRight = "10px";
                buttonDel.style.paddingLeft = "10px";
                buttonDel.style.paddingTop = "7px";
                buttonDel.style.paddingBottom = "7px";
                buttonDel.style.backgroundColor = "#0b0b2e";
                buttonDel.style.color = "white"
                buttonDel.style.borderRadius = "7px";
                buttonDel.style.fontWeight = "bold";
                buttonDel.style.border = "1px solid #0b0b2e";
                buttonDel.style.boxShadow = `8px 8px 8px rgba(${parseInt("#0b0b2e".slice(1, 3), 16)}, ${parseInt("#0b0b2e".slice(3, 5), 16)}, ${parseInt("#0b0b2e".slice(5, 7), 16)}, 0.5)`;
                buttonDel.addEventListener("click", function () {
                    selectAnswer.innerHTML = "Удаление ответа"
                    ClearMainMenu()
                    BackButt()

                    var variantDiv = document.createElement("div");

                    dataObjects.forEach(function (value) {
                        DelCutomButton(value, variantDiv)
                    })

                    mainMenu.appendChild(variantDiv)
                })

                mainMenu.appendChild(buttonAdd)
                mainMenu.appendChild(buttonCkeck)
                mainMenu.appendChild(buttonDel)
            }


            var ButtonsRyblevka = [
                {
                    "Fraction": "Жалобы на игроков",
                    "Color": "#0b0b2e",
                    "Function": function () {
                        ClearMainMenu()
                        const dlElement = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_name"]');
                        const ddElement = dlElement.querySelector('dd');

                        const youName = document.querySelector("span.p-navgroup-linkText")

                        const report_user_id = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_id"]');
                        const user_id = report_user_id.querySelector('dd');
                        selectAnswer.innerHTML = "Шаблоны для 'Жалобы на игроков'"
                        BackButt()

                        var Nick = ddElement
                        var varrDict = [
                            {
                                "Title": "Отказ",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p id="isPasted" style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый <span style="color: rgb(250, 197, 28);">&nbsp;${Nick.innerHTML} (${user_id.innerHTML})</span></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует&nbsp; ${youName.innerHTML}</span></strong></em></span></p><p style="text-align: center;"><span style="font-size: ;"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250,197,28);">Ваша жалоба получает отказ</em></span></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p><p><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением,
Администратор RMRP</span></em></strong></span></p></div>`
                            },
                            {
                                "Title": "Нарушение правил",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p id="isPasted" style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый <span style="color: rgb(250, 197, 28);">&nbsp;${Nick.innerHTML} (${user_id.innerHTML})</span></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует&nbsp; ${youName.innerHTML}</span></strong></em></span></p><p style="text-align: center;"><span style="font-size: ;"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250,197,28);">Ваша жалобу получает отказ по причине: Н<em id="isPasted"><strong>арушения правил подачи жалоб.</strong></em></span></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p><p><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением,
Администратор RMRP</span></em></strong></span></p></div>`
                            },
                            {
                                "Title": "Одобрение жалобы на адм",
                                "Body": `<p id="isPasted" style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый <span style="color: rgb(250, 197, 28);">${Nick.innerHTML} (${user_id.innerHTML})</span></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует ${youName.innerHTML}</span></strong></em></span></p><p style="text-align: center;"><span style="font-size: ;"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250,197,28);">Администратор вынес вердикт корректно и обоснованно по всем указанным в вашей жалобе нарушениям.</span></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением,
Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "Передать ЗГА",
                                "Body": `<p style="text-align: center;" id="isPasted"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый <span style="color: rgb(250, 197, 28);">${Nick.innerHTML} (${user_id.innerHTML})</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(255, 255, 255);">Рассмотрение данной </span><span style="color: rgb(250,197,28);">жалобы </span><span style="color: rgb(255, 255, 255);">будет передана -</span><span style="color: rgb(41, 105, 176);">&nbsp;</span><span style="color: rgb(247,218,100);">Заместителю главного администратора.</span></strong></em></span><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Ожидайте рассмотрение в течении <span style="color: rgb(247,218,100);">48 часов.</span></strong></em></span><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "Передать ГА",
                                "Body": `<p style="text-align: center;" id="isPasted"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый <span style="color: rgb(250, 197, 28);">${Nick.innerHTML} (${user_id.innerHTML})</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(255, 255, 255);">Рассмотрение данной </span><span style="color: rgb(250,197,28);">жалобы </span><span style="color: rgb(255, 255, 255);">будет передана -</span><span style="color: rgb(41, 105, 176);">&nbsp;</span><span style="color: rgb(247,218,100);">Главного администратора.</span></strong></em></span><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Ожидайте рассмотрение в течении <span style="color: rgb(247,218,100);">48 часов.</span></strong></em></span><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "DM",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за DM</span><span style="color: rgb(226, 80, 65);"> - Бан 120 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "DB",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за DB</span><span style="color: rgb(226, 80, 65);"> - Бан 120 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "NRPCop",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за NRPCop</span><span style="color: rgb(226, 80, 65);"> - Бан 300 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "MF",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p<p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за MF</span><span style="color: rgb(226, 80, 65);"> - Mute 30-90 минут / Ban 30-60 минут (оффтоп в репорты)</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "Leave RP",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Leave RP</span><span style="color: rgb(226, 80, 65);"> - Бан 240 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "Cheat",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Cheat</span><span style="color: rgb(226, 80, 65);"> - Бан Навсегда</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "Покрывательство Cheat",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Покрывательство читов</span><span style="color: rgb(226, 80, 65);"> - Бан 31 день</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "Обман в кости",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Обман в кости</span><span style="color: rgb(226, 80, 65);"> - Бан 180 дней</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "Оскорбление",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Оскорбление</span><span style="color: rgb(226, 80, 65);"> - Мут 240 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "Оскорбление родных",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Оскорбление Родных</span><span style="color: rgb(226, 80, 65);"> - Бан 7 дней</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "Дискриминация",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Дискриминация</span><span style="color: rgb(226, 80, 65);"> - Бан 3 дня</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "CA",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Caps Abuse</span><span style="color: rgb(226, 80, 65);"> - Mute 30 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "Dead Speak",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за разговор во время смерти</span><span style="color: rgb(226, 80, 65);"> - Mute 15-30 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "VA",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Voice Abuse</span><span style="color: rgb(226, 80, 65);"> - Mute 5-60 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "МА",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Music Abuse</span><span style="color: rgb(226, 80, 65);"> - Ban 5-30 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "RS",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Referal Spam</span><span style="color: rgb(226, 80, 65);"> - Ban 3 дня</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "NRP",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Non RP Cop</span><span style="color: rgb(226, 80, 65);"> - Ban 300 минут / warn</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "AR",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Amoral Rule</span><span style="color: rgb(226, 80, 65);"> - Ban 1-3 дня / Mute 240-480 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "SGA",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Save Gun Abuse</span><span style="color: rgb(226, 80, 65);"> - Ban 120 минут + Pacifist 120 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "RTA",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Revive Time Abuse</span><span style="color: rgb(226, 80, 65);"> - Ban 120-180 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "AA",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за AFK Abuse</span><span style="color: rgb(226, 80, 65);"> - Ban 60 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {
                                "Title": "TA",
                                "Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Trunk Abuse</span><span style="color: rgb(226, 80, 65);"> - Ban 180 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`
                            },

                            {"Title": "PA","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Provocative Actions</span><span style="color: rgb(226, 80, 65);"> - Mute 180 минут / Ban 60-180 минут / Pacifist 300 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "FRP / PG","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Fear RP / Power Gaming</span><span style="color: rgb(226, 80, 65);"> - Ban 120-240 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "NLR","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за New Life Rule</span><span style="color: rgb(226, 80, 65);"> - Ban 60-180 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "RK","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Revenge Kill / Repeat Kill</span><span style="color: rgb(226, 80, 65);"> - Ban 240 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "DM","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Death Match</span><span style="color: rgb(226, 80, 65);"> - Pacifist 300 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "FD","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Free Damage</span><span style="color: rgb(226, 80, 65);"> - Pacifist 240 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "Mass FD","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Mass Free Damage</span><span style="color: rgb(226, 80, 65);"> - Pacifist 1 день</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "Mass DM","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Mass Death Match</span><span style="color: rgb(226, 80, 65);"> - Ban 3 дня</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "DCTAP / DTAP / LTAP","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Disconnected / Deception / Leave To Avoid Punishment</span><span style="color: rgb(226, 80, 65);"> - Ban 240 минут / Ban 14 дней / Mute 5-7 дней</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "MG","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Metagaming</span><span style="color: rgb(226, 80, 65);"> - Mute 30-60 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "NRD","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Non RP Drive</span><span style="color: rgb(226, 80, 65);"> - Ban 120 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "DB","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за DriveBy</span><span style="color: rgb(226, 80, 65);"> - Ban 120 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "SK","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Spawn Kill</span><span style="color: rgb(226, 80, 65);"> - Pacifist 360 min</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "Mass SK","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Mass Spawn Kill</span><span style="color: rgb(226, 80, 65);"> - Ban 5 дней</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "TK","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Team Kill</span><span style="color: rgb(226, 80, 65);"> - Pacifist 300 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "CK","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Character Kill</span><span style="color: rgb(226, 80, 65);"> - Убийство персонажа без права вернуться на 15 дней</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "MR","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Media Rule</span><span style="color: rgb(226, 80, 65);"> - Ban 240 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "PB","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Player Block</span><span style="color: rgb(226, 80, 65);"> - Ban 60 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "LRP","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Leave RP</span><span style="color: rgb(226, 80, 65);"> - Ban 240-300 минут + Pacifist 240 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "Слив склада","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за 'Слив склада'</span><span style="color: rgb(226, 80, 65);"> - Ban 31 день, удаление взятых предметов</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "ППО","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Правило первого отката</span><span style="color: rgb(226, 80, 65);"> - Ban 30 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "DC","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Dress Code</span><span style="color: rgb(226, 80, 65);"> - Ban 60 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                            {"Title": "Помеха МП","Body": `<p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} (${user_id.innerHTML})</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Помеха мп</span><span style="color: rgb(226, 80, 65);"> - Respawn / Ban 15-30 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Желаем вам приятной игры на <span style="color: rgb(250, 197, 28);">RMRP</span>, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(250, 197, 28);">С уважением, Администратор RMRP</span></em></strong></span></p>`},

                        ]

                        var variantDiv = document.createElement("div");

                        varrDict.forEach(function (value) {
                            AddButton(value, variantDiv)
                        })
                        mainMenu.appendChild(variantDiv)
                    }
                },

                {
                    "Fraction": "Амнистия",
                    "Color": "#0b0b2e",
                    "Function": function () {
                        ClearMainMenu()
                        const dlElement = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_name"]');
                        const ddElement = dlElement.querySelector('dd');

                        const youName = document.querySelector("span.p-navgroup-linkText")

                        const report_user_id = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_id"]');
                        const user_id = report_user_id.querySelector('dd');
                        selectAnswer.innerHTML = "Шаблоны для 'Жалобы на амнистию'"
                        BackButt()

                        var Nick = ddElement
                        var varrDict = [
                            {
                                "Title": "Одобрено",
                                "Body": `<h1 style="font-size: 18px;" data-id="CENTERIBI++++COLORrgb235+107+86+COLORCOLORrgb147+101+184+COLORCOLORrgb235+107+86+COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong>До<em>брого времени суток уважаемый 
                <span style="color: rgb(247,218,100);">${Nick.innerHTML} (${user_id.innerHTML})</span>&nbsp;</em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBI++COLORrgb85+57+130COLOR+COLORrgb85+57+130RMRPCOLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em>Вас приветствует 
                <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации 
                <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBI++++COLORrgb147+101+184COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em>Просмотрев вашу амнистию, выношу 
                <span style="color: rgb(247,218,100);">вердикт:</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBBICENTER">
            <p style="text-align: center;"><br></p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBICOLORrgb255+255+255++COLORCOLORrgb147+101+184COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em><span style="color: rgb(255, 255, 255);">Ваша амнистия была</span>
                <span style="color: rgb(247,218,100);">&nbsp;одобрена!</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBICOLORrgb147+101+184+COLORCOLORrgb255+255+255+COLORCOLORrgb147+101+184COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em><span style="color: rgb(247,218,100);">Наказание&nbsp;</span>
                <span style="color: rgb(255, 255, 255);">будет снято,&nbsp;</span>
                <span style="color: rgb(247,218,100);">ожидайте</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBBICENTER">
            <p style="text-align: center;"><br></p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBICOLORrgb255+255+255.COLOR+COLORrgb147+101+184.COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em><span style="color: rgb(255, 255, 255);">Рассмотрено.</span> 
                <span style="color: rgb(247,218,100);">Закрыто.</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIB+++BCOLORrgb85+57+130BIRMRPIBCOLORICENTER">
            <p style="text-align: center;">
                <em><strong>Приятной игры на&nbsp;</strong>
                <span style="color: rgb(250,197,28);"><strong><em>RMRP!</em></strong></span></em>
            </p>
         </h1>`
                            },

                            {
                                "Title": "Отказано",
                                "Body": `<h1 style="font-size: 18px;" data-id="CENTERIBI++++COLORrgb235+107+86+COLORCOLORrgb147+101+184+COLORCOLORrgb235+107+86+COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong>До<em>брого времени суток уважаемый 
                <span style="color: rgb(247,218,100);">${Nick.innerHTML} (${user_id.innerHTML})</span>&nbsp;</em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBI++COLORrgb85+57+130COLOR+COLORrgb85+57+130RMRPCOLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em>Вас приветствует 
                <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации 
                <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBI++++COLORrgb147+101+184COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em>Просмотрев вашу амнистию, выношу 
                <span style="color: rgb(250,197,28);">вердикт:</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBBICENTER">
            <p style="text-align: center;"><br></p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBICOLORrgb255+255+255++COLORCOLORrgb147+101+184COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em><span style="color: rgb(255, 255, 255);">Ваша амнистия была</span>
                <span style="color: rgb(247,218,100);">&nbsp;отказана!</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBICOLORrgb147+101+184+COLORCOLORrgb255+255+255+COLORCOLORrgb147+101+184COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBBICENTER">
            <p style="text-align: center;"><br></p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBICOLORrgb255+255+255.COLOR+COLORrgb147+101+184.COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em><span style="color: rgb(255, 255, 255);">Рассмотрено.</span> 
                <span style="color: rgb(247,218,100);">Закрыто.</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIB+++BCOLORrgb85+57+130BIRMRPIBCOLORICENTER">
            <p style="text-align: center;">
                <em><strong>Приятной игры на&nbsp;</strong>
                <span style="color: rgb(250,197,28);"><strong><em>RMRP!</em></strong></span></em>
            </p>
         </h1>`
                            }
                        ]

                        var variantDiv = document.createElement("div");

                        varrDict.forEach(function (value) {
                            AddButton(value, variantDiv)
                        })
                        mainMenu.appendChild(variantDiv)
                    }
                },

                {
                    "Fraction": "Жалобы на администрацию",
                    "Color": "#0b0b2e",
                    "Function": function () {
                        ClearMainMenu()
                        const dlElement = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_name"]');
                        const ddElement = dlElement.querySelector('dd');

                        const youName = document.querySelector("span.p-navgroup-linkText")

                        const report_user_id = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_id"]');
                        const user_id = report_user_id.querySelector('dd');

                        selectAnswer.innerHTML = "Шаблоны для 'Жалобы на администрацию'"
                        BackButt()

                        var Nick = ddElement
                        var varrDict = [
                            {
                                "Title": "Неправильная форма подачи",
                                "Body": `<h1 id="isPasted" style="text-align: center;"><strong>До<em>брого времени суток уважаемый <span style="color: rgb(247,218,100);">${Nick.innerHTML} (${user_id.innerHTML})</span></em></strong></h1><h1 style="text-align: center;"><strong><em>Вас приветствует <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></h1><h1 style="text-align: center;"><em><strong>Просмотрев вашу <span style="color: rgb(247,218,100);">жалобу</span>, выношу <span style="color: rgb(247,218,100);">вердикт:</span></strong></em></h1><h1 style="text-align: center;"><br></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong>В вашей жалобе были замечены <span style="color: rgb(247,218,100)">нарушения&nbsp;</span>правил подачи</strong></em></strong></em></strong></em></strong></em></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong>Ознакомьтесь с ними в данном <span style="color: rgb(247,218,100)">"</span></strong></em></strong></em></strong></em></strong></em><a href="https://forum.rmrp.ru/threads/pravila-podachi-zhaloby-na-administratora.11/" target="_blank" rel="noopener noreferrer"><em><strong><em><strong><em><strong><em><strong><span style="color: rgb(247,218,100)">РАЗДЕЛE"</span></strong></em></strong></em></strong></em></strong></em></a></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong>При последующих жалобах не соблюдающих&nbsp;</strong></em></strong></em></strong></em></strong></em><a href="https://forum.rmrp.ru/threads/pravila-podachi-zhaloby-na-administratora.11/" target="_blank" rel="noopener noreferrer"><em><strong><em><strong><em><strong><em><strong><span style="color: rgb(247,218,100)">ПРАВИЛА ПОДАЧИ</span></strong></em></strong></em></strong></em></strong></em></a><em><strong><em><strong><em><strong><em><strong>&nbsp;к вам могут быть применены санкции</strong></em></strong></em></strong></em></strong></em></h1><h1 style="text-align: center;"><br></h1><h1 style="text-align: center;"><strong><em><span style="color: rgb(255, 255, 255);">Рассмотрено.</span> <span style="color: rgb(247,218,100);">Закрыто.</span></em></strong></h1><h1 style="text-align: center;"><strong><em>Приятной игры на <span style="color: rgb(250,197,28);">RMRP!</span></em></strong></h1>`
                            },

                            {
                                "Title": "Не работают доква",
                                "Body": `<h1 id="isPasted" style="text-align: center;"><strong>До<em>брого времени суток уважаемый <span style="color: rgb(247,218,100);">${Nick.innerHTML} (${user_id.innerHTML})</span></em></strong></h1><h1 style="text-align: center;"><strong><em>Вас приветствует <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></h1><h1 style="text-align: center;"><em><strong>Просмотрев вашу <span style="color: rgb(247,218,100);">жалобу</span>, выношу <span style="color: rgb(247,218,100);">вердикт:</span></strong></em></h1><h1 style="text-align: center;"><br></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong>В вашей жалобе были замечены не рабочие доказательства</strong></em></strong></em></strong></em></strong></em></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong>Перепроверьте их и подайте жалобу снова</strong></em></strong></em></strong></em></strong></em><a href="https://forum.rmrp.ru/threads/pravila-podachi-zhaloby-na-administratora.11/" target="_blank" rel="noopener noreferrer"></a></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong>При последующих жалобах не соблюдающих&nbsp;</strong></em></strong></em></strong></em></strong></em><a href="https://forum.rmrp.ru/threads/pravila-podachi-zhaloby-na-administratora.11/" target="_blank" rel="noopener noreferrer"><em><strong><em><strong><em><strong><em><strong><span style="color: rgb(247,218,100)">ПРАВИЛА ПОДАЧИ</span></strong></em></strong></em></strong></em></strong></em></a><em><strong><em><strong><em><strong><em><strong>&nbsp;к вам могут быть применены санкции</strong></em></strong></em></strong></em></strong></em></h1><h1 style="text-align: center;"><br></h1><h1 style="text-align: center;"><strong><em><span style="color: rgb(255, 255, 255);">Рассмотрено.</span> <span style="color: rgb(247,218,100);">Закрыто.</span></em></strong></h1><h1 style="text-align: center;"><strong><em>Приятной игры на <span style="color: rgb(250,197,28);">RMRP!</span></em></strong></h1>`
                            },

                            {
                                "Title": "Нет нарушений",
                                "Body": `<h1 id="isPasted" style="text-align: center;"><strong>До<em>брого времени суток уважаемый <span style="color: rgb(247,218,100);">${Nick.innerHTML} (${user_id.innerHTML})</span></em></strong></h1><h1 style="text-align: center;"><strong><em>Вас приветствует <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></h1><h1 style="text-align: center;"><em><strong>Просмотрев вашу <span style="color: rgb(247,218,100);">жалобу</span>, выношу <span style="color: rgb(247,218,100);">вердикт:</span></strong></em></h1><h1 style="text-align: center;"><br></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong>В ваших <span style="color: rgb(247,218,100)">доказательствах </span>не было замечено <span style="color: rgb(247,218,100);">нарушений </span>от <span style="color: rgb(247,218,100);">администратора</span>.</strong></em></strong></em></strong></em></strong></em></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong>За <span style="color: rgb(247,218,100);">клевету </span>в сторону <span style="color: rgb(247,218,100);">администрации </span>вы можете получить <span style="color: rgb(247,218,100);">наказание.</span></strong></em></strong></em></strong></em></strong></em></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong>Если у вас появятся более существенные <span style="color: rgb(247,218,100);">доказательства </span>подайте </strong></em></strong></em></strong></em></strong></em><a href="https://forum.rmrp.ru/forums/zhaloby-na-administraciju.40/" target="_blank" rel="noopener noreferrer"><em><strong><em><strong><em><strong><em><strong><span style="color: rgb(247,218,100);">жалобу </span></strong></em></strong></em></strong></em></strong></em></a><em><strong><em><strong><em><strong><em><strong>снова</strong></em></strong></em></strong></em></strong></em><br></h1><h1 style="text-align: center;"><br></h1><h1 style="text-align: center;"><strong><em><span style="color: rgb(255, 255, 255);">Рассмотрено.</span> <span style="color: rgb(247,218,100);">Закрыто.</span></em></strong></h1><h1 style="text-align: center;"><strong><em>Приятной игры на <span style="color: rgb(250,197,28);">RMRP!</span></em></strong></h1>`
                            },

                            {
                                "Title": "Недостаточно докв",
                                "Body": `<h1 id="isPasted" style="text-align: center;"><strong>До<em>брого времени суток уважаемый <span style="color: rgb(247,218,100);">${Nick.innerHTML} (${user_id.innerHTML})</span></em></strong></h1><h1 style="text-align: center;"><strong><em>Вас приветствует <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></h1><h1 style="text-align: center;"><em><strong>Просмотрев вашу <span style="color: rgb(247,218,100);">жалобу</span>, выношу <span style="color: rgb(247,218,100);">вердикт:</span></strong></em></h1><h1 style="text-align: center;"><br></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong>Ваших <span style="color: rgb(247,218,100)">доказательств было </span>недостаточно, <span style="color: rgb(247,218,100);">нарушений </span>от <span style="color: rgb(247,218,100);">администратора не найдено</span>.</strong></em></strong></em></strong></em></strong></em></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong>За <span style="color: rgb(247,218,100);">клевету </span>в сторону <span style="color: rgb(247,218,100);">администрации </span>вы можете получить <span style="color: rgb(247,218,100);">наказание.</span></strong></em></strong></em></strong></em></strong></em></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong>Если у вас появятся более существенные <span style="color: rgb(247,218,100);">доказательства </span>подайте </strong></em></strong></em></strong></em></strong></em><a href="https://forum.rmrp.ru/forums/zhaloby-na-administraciju.40/" target="_blank" rel="noopener noreferrer"><em><strong><em><strong><em><strong><em><strong><span style="color: rgb(247,218,100);">жалобу </span></strong></em></strong></em></strong></em></strong></em></a><em><strong><em><strong><em><strong><em><strong>снова</strong></em></strong></em></strong></em></strong></em><br></h1><h1 style="text-align: center;"><br></h1><h1 style="text-align: center;"><strong><em><span style="color: rgb(255, 255, 255);">Рассмотрено.</span> <span style="color: rgb(247,218,100);">Закрыто.</span></em></strong></h1><h1 style="text-align: center;"><strong><em>Приятной игры на <span style="color: rgb(250,197,28);">RMRP!</span></em></strong></h1>`
                            },

                            {
                                "Title": "Наказание по ошибке",
                                "Body": `<h1 id="isPasted" style="text-align: center;"><strong>До<em>брого времени суток уважаемый <span style="color: rgb(247,218,100);">${Nick.innerHTML} (${user_id.innerHTML})</span></em></strong></h1><h1 style="text-align: center;"><strong><em>Вас приветствует <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></h1><h1 style="text-align: center;"><em><strong>Просмотрев вашу <span style="color: rgb(247,218,100);">жалобу</span>, выношу <span style="color: rgb(247,218,100);">вердикт:</span></strong></em></h1><h1 style="text-align: center;"><br></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong>После получения <span style="color: rgb(247,218,100);">доказательств&nbsp;</span>у <span style="color: rgb(247,218,100);">администратора</span>, стало известно, что <span style="color: rgb(247,218,100);">наказание&nbsp;</span>выдано по <span style="color: rgb(247,218,100);">ошибке</span></strong></em></strong></em></strong></em></strong></em></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong>Ваше <span style="color: rgb(247,218,100);">наказание </span>будет снято в течении <span style="color: rgb(226, 80, 65);">24 часов</span></strong></em></strong></em></strong></em></strong></em></h1><blockquote><h1 style="text-align: center;"><strong><span style="color: rgb(250,197,28);">Приносим свои извинения</span></strong><br></h1></blockquote><h1 style="text-align: center;"><br></h1><h1 style="text-align: center;"><strong><em><span style="color: rgb(255, 255, 255);">Рассмотрено.</span> <span style="color: rgb(247,218,100);">Закрыто.</span></em></strong></h1><h1 style="text-align: center;"><strong><em>Приятной игры на <span style="color: rgb(250,197,28);">RMRP!</span></em></strong></h1>`
                            },

                            {
                                "Title": "Беседа с администратором",
                                "Body": `<h1 id="isPasted" style="text-align: center;"><strong>До<em>брого времени суток уважаемый <span style="color: rgb(247,218,100);">${Nick.innerHTML} (${user_id.innerHTML})</span></em></strong></h1><h1 style="text-align: center;"><strong><em>Вас приветствует <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></h1><h1 style="text-align: center;"><em><strong>Просмотрев вашу <span style="color: rgb(247,218,100);">жалобу</span>, выношу <span style="color: rgb(247,218,100);">вердикт:</span></strong></em></h1><h1 style="text-align: center;"><br></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong><span style="color: rgb(255, 255, 255);">С </span><span style="color: rgb(247,218,100);">администратором </span><span style="color: rgb(255, 255, 255);">будет проведена </span><span style="color: rgb(247,218,100);">беседа</span></strong></em></strong></em></strong></em></strong></em><br></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong>Ваше <span style="color: rgb(247,218,100);">наказание&nbsp;</span>будет снято в течении <span style="color: rgb(226, 80, 65);">24 часов</span></strong></em></strong></em></strong></em></strong></em></h1><blockquote><h1 style="text-align: center;"><strong><span style="color: rgb(250,197,28);">Приносим свои извинения</span></strong><br></h1></blockquote><h1 style="text-align: center;"><br></h1><h1 style="text-align: center;"><strong><em><span style="color: rgb(255, 255, 255);">Рассмотрено.</span> <span style="color: rgb(247,218,100);">Закрыто.</span></em></strong></h1><h1 style="text-align: center;"><strong><em>Приятной игры на <span style="color: rgb(250,197,28);">RMRP!</span></em></strong></h1>`
                            },

                            {
                                "Title": "Наказание администратору",
                                "Body": `<h1 id="isPasted" style="text-align: center;"><strong>До<em>брого времени суток уважаемый <span style="color: rgb(247,218,100);">${Nick.innerHTML} (${user_id.innerHTML})</span></em></strong></h1><h1 style="text-align: center;"><strong><em>Вас приветствует <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></h1><h1 style="text-align: center;"><em><strong>Просмотрев вашу <span style="color: rgb(247,218,100);">жалобу</span>, выношу <span style="color: rgb(247,218,100);">вердикт:</span></strong></em></h1><h1 style="text-align: center;"><br></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong><span style="color: rgb(255, 255, 255);"></span><span style="color: rgb(247,218,100);">Администратор </span><span style="color: rgb(255, 255, 255);">будет наказан</strong></em></strong></em></strong></em></strong></em><br></h1><h1 style="text-align: center;"><em><strong><em><strong><em><strong><em><strong>Ваше <span style="color: rgb(247,218,100);">наказание&nbsp;</span>будет снято в течении <span style="color: rgb(226, 80, 65);">24 часов</span></strong></em></strong></em></strong></em></strong></em></h1><blockquote><h1 style="text-align: center;"><strong><span style="color: rgb(250,197,28);">Приносим свои извинения</span></strong><br></h1></blockquote><h1 style="text-align: center;"><br></h1><h1 style="text-align: center;"><strong><em><span style="color: rgb(255, 255, 255);">Рассмотрено.</span> <span style="color: rgb(247,218,100);">Закрыто.</span></em></strong></h1><h1 style="text-align: center;"><strong><em>Приятной игры на <span style="color: rgb(250,197,28);">RMRP!</span></em></strong></h1>`
                            },
                        ]

                        var variantDiv = document.createElement("div");

                        varrDict.forEach(function (value) {
                            AddButton(value, variantDiv)
                        })
                        mainMenu.appendChild(variantDiv)
                    }
                },

                {
                    "Fraction": "Жалобы на лидеров",
                    "Color": "#0b0b2e",
                    "Function": function () {
                        ClearMainMenu()
                        const dlElement = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_name"]');
                        const ddElement = dlElement.querySelector('dd');

                        const youName = document.querySelector("span.p-navgroup-linkText")

                        const report_user_id = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_id"]');
                        const user_id = report_user_id.querySelector('dd');

                        selectAnswer.innerHTML = "Шаблоны для 'Жалобы на администрацию'"
                        BackButt()

                        var Nick = ddElement
                        var varrDict = [
                            {
                                "Title": "Одобрено",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p id="isPasted" style="text-align: center;"><strong><span style="font-size: 18px;">Доброго времени суток ${Nick.innerHTML}! Вас приветствует ${youName.innerHTML}&nbsp;</span></strong><span style="color: rgb(250, 197, 28); font-size: 18px;"><strong>Главный следящий</strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><br></strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><br></strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong>Внимательно ознакомившись с вашей <span style="color: rgb(250, 197, 28);">жалобой</span>, выношу вердикт:</strong></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><span style="color: rgb(184, 49, 47);">Лидер будет наказан.</span></strong></span></p><p style="text-align: center;"><strong><span style="font-size: 18px; color: rgb(184, 49, 47);">Рассмотрено. Закрыто.&nbsp;</span></strong></p></div>`
                            },

                            {
                                "Title": "Отказано",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p id="isPasted" style="text-align: center;"><strong><span style="font-size: 18px;">Доброго времени суток ${Nick.innerHTML}! Вас приветствует ${youName.innerHTML}&nbsp;</span></strong><span style="color: rgb(250, 197, 28); font-size: 18px;"><strong>Главный следящий</strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><br></strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><br></strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong>Внимательно ознакомившись с вашей <span style="color: rgb(250, 197, 28);">жалобой</span>, выношу вердикт:</strong></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><span style="color: rgb(184, 49, 47);">Жалоба отказана.</span></strong></span></p><p style="text-align: center;"><strong><span style="font-size: 18px; color: rgb(184, 49, 47);">Рассмотрено. Закрыто.&nbsp;</span></strong></p></div>`
                            },

                            {
                                "Title": "Недост. Докв",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p id="isPasted" style="text-align: center;"><strong><span style="font-size: 18px;">Доброго времени суток ${Nick.innerHTML}! Вас приветствует ${youName.innerHTML}&nbsp;</span></strong><span style="color: rgb(250, 197, 28); font-size: 18px;"><strong>Главный следящий</strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><br></strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><br></strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong>Внимательно ознакомившись с вашей <span style="color: rgb(250, 197, 28);">жалобой</span>, выношу вердикт:</strong></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><span style="color: rgb(184, 49, 47);">Доказательств недостаточно.</span></strong></span></p><p style="text-align: center;"><strong><span style="font-size: 18px; color: rgb(184, 49, 47);">Рассмотрено. Закрыто.&nbsp;</span></strong></p></div>`
                            },

                            {
                                "Title": "Нет нарушений",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p id="isPasted" style="text-align: center;"><strong><span style="font-size: 18px;">Доброго времени суток ${Nick.innerHTML}! Вас приветствует ${youName.innerHTML}&nbsp;</span></strong><span style="color: rgb(250, 197, 28); font-size: 18px;"><strong>Главный следящий</strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><br></strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><br></strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong>Внимательно ознакомившись с вашей <span style="color: rgb(250, 197, 28);">жалобой</span>, выношу вердикт:</strong></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><span style="color: rgb(184, 49, 47);">Нет нарушений, отказано.</span></strong></span></p><p style="text-align: center;"><strong><span style="font-size: 18px; color: rgb(184, 49, 47);">Рассмотрено. Закрыто.&nbsp;</span></strong></p></div>`
                            },
                        ]

                        var variantDiv = document.createElement("div");

                        varrDict.forEach(function (value) {
                            AddButton(value, variantDiv)
                        })
                        mainMenu.appendChild(variantDiv)
                    }
                },

                {
                    "Fraction": "Кастомные шаблоны",
                    "Color": "#0b0b2e",
                    "Function": function () {
                        ClearMainMenu()
                        selectAnswer.innerHTML = "Ваши шаблоны"
                        BackButt()
                        CustomButt()
                    }
                },
            ]

            ButtonsRyblevka.forEach(function (fraction) {
                var button = document.createElement("button")
                button.className = fraction.Fraction;
                button.innerHTML = fraction.Fraction;
                button.style.margin = "7px";
                button.style.paddingRight = "10px";
                button.style.paddingLeft = "10px";
                button.style.paddingTop = "7px";
                button.style.paddingBottom = "7px";
                button.style.backgroundColor = fraction.Color;
                button.style.color = "white"
                button.style.borderRadius = "7px";
                button.style.fontWeight = "bold";
                button.style.border = "1px solid #1C1C57FF";
                button.style.boxShadow = `8px 8px 8px rgba(${parseInt(fraction.Color.slice(1, 3), 16)}, ${parseInt(fraction.Color.slice(3, 5), 16)}, ${parseInt(fraction.Color.slice(5, 7), 16)}, 0.5)`;

                button.addEventListener("click", fraction.Function || function() {});
                div.appendChild(button)
            })
        }

        function ClearMainMenu() {
            while (mainMenu.firstChild) {
                mainMenu.removeChild(mainMenu.firstChild);
            }
        }

        function AddCustom() {
            var input = document.createElement("input");
            input.style.display = "none";
            input.style.marginRight = "1%"
            input.style.borderRadius = "5px";
            input.style.border = "2px solid white";
            input.style.backgroundColor = "transparent"
            input.style.color = "white"
            input.style.fontWeight = "bold"
            input.style.width = "10%"
            input.style.height = "7%"
            input.value = "#ffffff"
            input.maxLength = 7

            var colorbutton = document.createElement("button")
            colorbutton.style.backgroundColor = "transparent"
            colorbutton.style.borderRadius = "10px";
            colorbutton.style.border = "2px solid white";
            colorbutton.style.color = "white";
            colorbutton.style.width = "40px"
            colorbutton.style.height = "40px"
            colorbutton.style.fontSize = "20px"
            colorbutton.style.marginBottom = "4%"
            colorbutton.innerHTML = "<i class=\"far fa-palette\" aria-hidden=\"true\"></i>"
            colorbutton.addEventListener("click", function () {
                if (input.style.display === "none") {
                    input.style.display = "inline";
                } else {
                    var selectedText = window.getSelection();
                    var range = selectedText.getRangeAt(0);
                    var span = document.createElement("span");
                    span.style.color = input.value;
                    range.surroundContents(span);
                    input.style.display = "none";
                }
            })

            var leftcenter = document.createElement("button")
            leftcenter.style.backgroundColor = "transparent"
            leftcenter.style.borderRadius = "10px";
            leftcenter.style.border = "2px solid white";
            leftcenter.style.color = "white";
            leftcenter.style.width = "40px"
            leftcenter.style.height = "40px"
            leftcenter.style.fontSize = "20px"
            leftcenter.style.marginLeft = "5%"
            leftcenter.innerHTML = "<i class=\"far fa-align-left\" aria-hidden=\"true\"></i>"
            leftcenter.addEventListener("click", function () {
                var selectedText = window.getSelection();
                if (selectedText.rangeCount > 0) {
                    var range = selectedText.getRangeAt(0);
                    var fragment = range.extractContents();
                    var container = document.createElement("div");
                    container.style.textAlign = "left";
                    container.appendChild(fragment);
                    range.insertNode(container);
                    input.style.display = "none";
                    window.getSelection().removeAllRanges()
                }
            })

            var centercenter = document.createElement("button")
            centercenter.style.backgroundColor = "transparent"
            centercenter.style.borderRadius = "10px";
            centercenter.style.border = "2px solid white";
            centercenter.style.color = "white";
            centercenter.style.width = "40px"
            centercenter.style.height = "40px"
            centercenter.style.fontSize = "20px"
            centercenter.style.marginLeft = "1%"
            centercenter.innerHTML = "<i class=\"far fa-align-center\" aria-hidden=\"true\"></i>"
            centercenter.addEventListener("click", function () {
                var selectedText = window.getSelection();
                if (selectedText.rangeCount > 0) {
                    var range = selectedText.getRangeAt(0);
                    var fragment = range.extractContents();
                    var container = document.createElement("div");
                    container.style.textAlign = "center";
                    container.appendChild(fragment);
                    range.insertNode(container);
                    input.style.display = "none";
                    window.getSelection().removeAllRanges()
                }
            })

            var rightcenter = document.createElement("button")
            rightcenter.style.backgroundColor = "transparent"
            rightcenter.style.borderRadius = "10px";
            rightcenter.style.border = "2px solid white";
            rightcenter.style.color = "white";
            rightcenter.style.width = "40px"
            rightcenter.style.height = "40px"
            rightcenter.style.fontSize = "20px"
            rightcenter.style.marginLeft = "1%"
            rightcenter.innerHTML = "<i class=\"far fa-align-right\" aria-hidden=\"true\"></i>"
            rightcenter.addEventListener("click", function () {
                var selectedText = window.getSelection();
                if (selectedText.rangeCount > 0) {
                    var range = selectedText.getRangeAt(0);
                    var fragment = range.extractContents();
                    var container = document.createElement("div");
                    container.style.textAlign = "right";
                    container.appendChild(fragment);
                    range.insertNode(container);
                    input.style.display = "none";
                    window.getSelection().removeAllRanges()
                }
            })

            var link = document.createElement("input");
            link.style.display = "none";
            link.style.marginRight = "1%"
            link.style.marginLeft = "2%"
            link.style.borderRadius = "5px";
            link.style.border = "2px solid white";
            link.style.backgroundColor = "transparent"
            link.style.color = "white"
            link.style.fontWeight = "bold"
            link.style.width = "20%"
            link.style.height = "7%"
            link.value = "https://forum.rmrp.ru/"

            var linkbutton = document.createElement("button")
            linkbutton.style.backgroundColor = "transparent"
            linkbutton.style.borderRadius = "10px";
            linkbutton.style.border = "2px solid white";
            linkbutton.style.color = "white";
            linkbutton.style.width = "40px"
            linkbutton.style.height = "40px"
            linkbutton.style.fontSize = "20px"
            linkbutton.style.marginLeft = "1%"
            linkbutton.innerHTML = "<i class=\"far fa-link\" aria-hidden=\"true\"></i>"
            linkbutton.addEventListener("click", function () {
                if (link.style.display === "none") {
                    link.style.display = "inline";
                }  else {
                    var selectedText = window.getSelection();
                    if (selectedText.toString().length > 0) {
                        var url = link.value.trim();
                        if (url) {
                            var range = selectedText.getRangeAt(0);
                            var a = document.createElement("a");
                            a.href = url;
                            a.textContent = selectedText.toString();
                            a.style.fontSize = "18px"
                            a.style.color = "inherit";
                            range.deleteContents();
                            range.insertNode(a);
                        }
                    }
                    link.style.display = "none";
                }
            })

            var size = document.createElement("input");
            size.style.display = "none";
            size.style.marginRight = "1%"
            size.style.marginLeft = "2%"
            size.style.borderRadius = "5px";
            size.style.border = "2px solid white";
            size.style.backgroundColor = "transparent"
            size.style.color = "white"
            size.style.fontWeight = "bold"
            size.style.width = "7%"
            size.style.height = "7%"
            size.value = "18"
            size.maxLength = 2
            size.type = "number"
            size.min = 5;
            size.max = 30;
            size.addEventListener("input", function() {
                if (parseInt(size.value) > 30) {
                    size.value = "30";
                }

                if (parseInt(size.value) < 1) {
                    size.value = "5";
                }
            });

            var textsize = document.createElement("button")
            textsize.style.backgroundColor = "transparent"
            textsize.style.borderRadius = "10px";
            textsize.style.border = "2px solid white";
            textsize.style.color = "white";
            textsize.style.width = "40px"
            textsize.style.height = "40px"
            textsize.style.fontSize = "20px"
            textsize.style.marginLeft = "1%"
            textsize.innerHTML = "<i class=\"far fa-paragraph\" aria-hidden=\"true\"></i>"
            textsize.addEventListener("click", function () {
                if (size.style.display === "none") {
                    size.style.display = "inline";
                } else {
                    // Получаем выделенный текст
                    var selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        var range = selection.getRangeAt(0);
                        var span = document.createElement("span");
                        span.style.fontSize = size.value + "px";
                        var fragment = range.extractContents();
                        span.appendChild(fragment);
                        range.insertNode(span);
                        size.style.display = "none";
                    }
                }
            });

            var backbutton = document.createElement("button")
            backbutton.style.backgroundColor = "transparent"
            backbutton.style.borderRadius = "10px";
            backbutton.style.border = "2px solid white";
            backbutton.style.color = "white";
            backbutton.style.width = "40px"
            backbutton.style.height = "40px"
            backbutton.style.fontSize = "20px"
            backbutton.style.marginRight = "1%"
            backbutton.innerHTML = "<i class=\"far fa-undo\" aria-hidden=\"true\"></i>"
            backbutton.addEventListener("click", function () {
                ClearMainMenuArbat()
                RyblevkaButt(mainMenu)
            });

            const youName = document.querySelector("span.p-navgroup-linkText")
            var editableDiv = document.createElement("div");
            editableDiv.style.width = "70%";
            editableDiv.style.height = "80%";
            editableDiv.style.resize = "none";
            editableDiv.style.backgroundColor = "#0f0f30";
            editableDiv.style.color = "white";
            editableDiv.style.fontWeight = "bold";
            editableDiv.style.borderRadius = "10px";
            editableDiv.style.border = "2px solid white";
            editableDiv.style.padding = "10px";
            editableDiv.style.overflowY = "auto";
            editableDiv.style.whiteSpace = "pre-wrap";
            editableDiv.innerHTML = `Здравствуйте уважаемый ${youName.innerHTML}
В данном разделе вы можете создавать свои скрипты
Сверху вы можете увидеть инструменты для работы с текстом Для вставки текста вы можете использовать хэш цвета <div><a href="https://forum.rmrp.ru/" style="color: inherit;">
(например <span style="color: rgb(0, 0, 0);"><span style="color: rgb(51, 51, 51);">#fff</span></span>)</a></div><div><a href="https://forum.rmrp.ru/" style="color: inherit;">
Чтобы перекраска сработала в момент закрытия меню с указание хэша у вас должен быть выделен желаемый текст для перекраски</a><div></div><div><br></div><div>
Добавление ссылки аналогично добавлению цвета, при добавлении ссылки размер текста с ссылкой изменится на 18px</div><div><br></div><div>
Изменения размера текста аналогично цвету и добавлению ссылки</div><div>
</div><div style="text-align: center;"><div></div></div></div><div><div style="text-align: center;"><div></div></div></div><div><div><div><div style="text-align: center;"><div></div><div style="text-align: right;"><div></div><div style="text-align: left;"><div>Максимальный размер - <span style="font-size: 30px;">30</span></div><div>
Минимальный размер - <span style="font-size: 5px;">5<span style="font-size: 15px;"> (5)</span></span></div></div><div><span style="font-size: 5px;"><span style="font-size: 15px;"></span></span></div></div><div><span style="font-size: 5px;"><span style="font-size: 15px;"></span></span></div></div><div><span style="font-size: 5px;"><span style="font-size: 15px;"></span></span></div></div><div></div></div><div></div></div><div><span style="font-size: 5px;"><span style="font-size: 15px;"><br></span></span></div><div><br></div><div>Чтобы выровнить текст, нужно выделить желаемый текст для выравнивания</div><div><div style="text-align: center;">Выбрать один из вариантов выравнивания</div><div style="text-align: center;"><div style="text-align: left;">Лево</div><div style="text-align: left;"><div style="text-align: center;">Центр</div><div style="text-align: center;"><div style="text-align: right;">Право</div><div style="text-align: right;"><br></div><div style="text-align: right;"><div style="text-align: center;">Кастомные комманды для получения информации</div><div style="text-align: center;"><span style="font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);">!you - Ваш никнейм</span></div><div style="text-align: center;"><span style="font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"><div style="text-align: right;"><div style="text-align: center;">!nick - Ник того кто написал жалобу</div></div></span></div><div style="text-align: center;"><div style="text-align: right;"><div style="text-align: left;"><div style="text-align: center;"><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><div><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><div><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><div>!id - Ид игрока который написал жалобу</div><p></p><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><div>!idreport - Ид нарушителя</div><p></p></div><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><div>!time - Время нарушения</div><p></p><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><div>!info - Краткое описание</div><p></p></div><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><div>!dock - Доказательства</div><div><br></div><div>При вводе этих команд в ваш шаблон вы получите вместо комманды информацию</div><p></p></div></div></div></div></div></div></div></div></div></div>`;

            var title = document.createElement("input");
            title.style.width = "200px"
            title.style.height = "40px"
            title.innerHTML = "Очистить шаблон"
            title.style.backgroundColor = "#0f0f30";
            title.style.position = "fixed";
            title.style.border = "2px solid white";
            title.style.fontWeight = "bold"
            title.style.color = "white"
            title.style.borderRadius = "10px";
            title.style.fontSize = "14px";
            title.style.left = "685px"
            title.style.top = "230px"
            title.style.textAlign = "center"
            title.value = "Название шаблона"

            var clearbutton = document.createElement("button");
            clearbutton.style.width = "200px"
            clearbutton.style.height = "40px"
            clearbutton.innerHTML = "Очистить шаблон"
            clearbutton.style.backgroundColor = "#0f0f30";
            clearbutton.style.position = "fixed";
            clearbutton.style.border = "2px solid white";
            clearbutton.style.fontWeight = "bold"
            clearbutton.style.color = "white"
            clearbutton.style.borderRadius = "10px";
            clearbutton.style.fontSize = "18px";
            clearbutton.style.left = "685px"
            clearbutton.style.top = "280px"
            clearbutton.addEventListener("click", function () {
                editableDiv.innerHTML = ""
            })

            var savebutton = document.createElement("button");
            savebutton.style.width = "200px"
            savebutton.style.height = "40px"
            savebutton.innerHTML = "Сохранить"
            savebutton.style.backgroundColor = "#0f0f30";
            savebutton.style.position = "fixed";
            savebutton.style.border = "2px solid white";
            savebutton.style.fontWeight = "bold"
            savebutton.style.color = "white"
            savebutton.style.borderRadius = "10px";
            savebutton.style.fontSize = "18px";
            savebutton.style.left = "685px"
            savebutton.style.top = "330px"
            savebutton.addEventListener("click", function () {
                editableDiv.innerHTML = editableDiv.innerHTML.replace("!you", youName.innerHTML);

                var nick = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_name"]');
                var nickItog = nick.querySelector("dd");
                editableDiv.innerHTML = editableDiv.innerHTML.replace("!nick", nickItog.innerHTML);

                var id = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_id"]');
                var idItog = id.querySelector("dd");
                editableDiv.innerHTML = editableDiv.innerHTML.replace("!id", idItog.innerHTML);

                var idReport = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_id1"]');
                var idReportItog = idReport.querySelector("dd");
                editableDiv.innerHTML = editableDiv.innerHTML.replace("!idreport", idReportItog.innerHTML);

                var timeReport = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_time"]');
                var timeReportItog = timeReport.querySelector("dd");
                editableDiv.innerHTML = editableDiv.innerHTML.replace("!time", timeReportItog.innerHTML);

                var infoReport = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_description"]');
                var infoReportItog = infoReport.querySelector("dd");
                editableDiv.innerHTML = editableDiv.innerHTML.replace("!info", infoReportItog.innerHTML);

                var dock = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_proofs"]');
                var dockReportItog = dock.querySelector("dd");
                editableDiv.innerHTML = editableDiv.innerHTML.replace("!dock", dockReportItog.innerHTML);

                const newObject = {
                    "Title": title.value,
                    "Body": editableDiv.innerHTML
                };

                dataObjects.push(newObject);

                localStorage.setItem('RMRP', JSON.stringify(dataObjects));

                blackFon.remove();
                titleMenu.remove();
                mainMenu.remove();

                console.log('New Data saved:', dataObjects);
            })

            editableDiv.setAttribute("contenteditable", "true");

            mainMenu.appendChild(backbutton)

            mainMenu.appendChild(input)
            mainMenu.appendChild(colorbutton);

            mainMenu.appendChild(link)
            mainMenu.appendChild(linkbutton);

            mainMenu.appendChild(size)
            mainMenu.appendChild(textsize)

            mainMenu.appendChild(leftcenter)
            mainMenu.appendChild(centercenter)
            mainMenu.appendChild(rightcenter)

            mainMenu.appendChild(savebutton)
            mainMenu.appendChild(clearbutton)
            mainMenu.appendChild(title)

            mainMenu.appendChild(editableDiv);
        }

        function ArbatButt(div) {
            function AddButton(value, func) {
                var button = document.createElement("button")
                button.className = value.Title;
                button.innerHTML = value.Title;
                button.style.margin = "7px";
                button.style.paddingRight = "10px";
                button.style.paddingLeft = "10px";
                button.style.paddingTop = "7px";
                button.style.paddingBottom = "7px";
                button.style.borderRadius = "7px";
                button.style.fontWeight = "bold";

                let keyupHandler;

                if (boolLight) {
                    button.style.backgroundColor = "#ffb413";
                    button.style.color = "white";
                    button.style.boxShadow = "10px 7px 10px rgba(255, 180, 19, 0.5)";
                    button.style.transition = "box-shadow 0.3s ease";
                    button.style.border = "None"

                    button.addEventListener("mouseenter", function () {
                        button.style.backgroundColor = "#0b0b2e";
                        button.style.color = "white"
                        button.style.border = "1px solid #1C1C57FF";

                        keyupHandler = function (event) {
                            if (event.code === "KeyI") {
                                if (value.Title in favouritesObject) {
                                    console.log("Уже есть")
                                } else {
                                    const dlElement = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_name"]');
                                    const ddElement = dlElement.querySelector('dd');

                                    const youName = document.querySelector("span.p-navgroup-linkText")

                                    const report_user_id = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_id"]');
                                    const user_id = report_user_id.querySelector('dd');

                                    console.log(value)
                                    console.log(ddElement.innerHTML)

                                    value.Body = value.Body.replace(ddElement.innerHTML, "Nick")
                                    value.Body = value.Body.replace(youName.innerHTML, "YouNick")
                                    value.Body = value.Body.replace(user_id.innerHTML, "StaticReport")

                                    favouritesObject[value.Title] = value.Body

                                    localStorage.setItem('Foreverr', JSON.stringify(favouritesObject));
                                    console.log(favouritesObject)

                                    ClearMainMenu()
                                    selectAnswer.innerHTML = "Избранное:"
                                    BackButtServer()

                                    ForevorList(favouritesObject, mainMenu)

                                    function ForevorList(forevs, func) {
                                        console.log(forevs);

                                        // Получаем массив ключей
                                        Object.keys(forevs).forEach(key => {
                                            // Получаем значение по текущему ключу
                                            var value = forevs[key];

                                            // Создаем кнопку
                                            var button = document.createElement("button");

                                            // Используем ключ как класс кнопки
                                            button.className = key;
                                            // Используем значение как внутренний HTML кнопки
                                            button.innerHTML = key;
                                            button.style.margin = "7px";
                                            button.style.paddingRight = "10px";
                                            button.style.paddingLeft = "10px";
                                            button.style.paddingTop = "7px";
                                            button.style.paddingBottom = "7px";
                                            button.style.borderRadius = "7px";
                                            button.style.fontWeight = "bold";

                                            if (boolLight) {
                                                button.style.backgroundColor = "#15f354";
                                                button.style.color = "white";
                                                button.style.border = "None";
                                                button.style.boxShadow = "10px 7px 10px rgba(21,243,84, 0.5)";
                                                button.style.transition = "box-shadow 0.3s ease";
                                            } else {
                                                button.style.backgroundColor = "#0b0b2e";
                                                button.style.color = "white";
                                                button.style.border = "1px solid #1C1C57FF";
                                            }

                                                // Добавляем обработчик клика
                                                button.addEventListener("click", function () {
                                                blackFon.remove();
                                                titleMenu.remove();
                                                mainMenu.remove();

                                                const dlElement = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_name"]');
                                                const ddElement = dlElement.querySelector('dd');

                                                const youName = document.querySelector("span.p-navgroup-linkText")

                                                const report_user_id = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_id"]');
                                                const user_id = report_user_id.querySelector('dd');
                                                console.log(value)

                                                value = value.replace("YouNick", youName.innerHTML)
                                                value = value.replace("Nick", ddElement.innerHTML)
                                                value = value.replace("StaticReport", user_id.innerHTML)

                                                var inputTextMenu = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible");
                                                // document.querySelector("span.fr-placeholder").innerHTML = "";
                                                inputTextMenu.innerHTML = value;
                                            });

                                            func.appendChild(button);
                                        });
                                    }
                                }

                            }
                        };

                        document.addEventListener("keyup", keyupHandler);
                    })

                    button.addEventListener("mouseleave", function () {
                        button.style.backgroundColor = "#ffb413";
                        button.style.color = "white";
                        button.style.border = "None"

                        document.removeEventListener("keyup", keyupHandler);
                    })

                } else {
                    button.style.backgroundColor = "#0b0b2e";
                    button.style.color = "white"
                    button.style.border = "1px solid #1C1C57FF";
                }
                button.addEventListener("click", function () {
                    blackFon.remove();
                    titleMenu.remove();
                    mainMenu.remove();

                    var inputTextMenu = document.querySelector("div.fr-element.fr-view.fr-element-scroll-visible")
                    document.querySelector("span.fr-placeholder").innerHTML = ""
                    inputTextMenu.innerHTML = value.Body
                })

                func.appendChild(button)
            }



            function DelCutomButton(value, func) {
                var button = document.createElement("button")
                button.className = value.Title;
                button.innerHTML = value.Title;
                button.style.margin = "7px";
                button.style.paddingRight = "10px";
                button.style.paddingLeft = "10px";
                button.style.paddingTop = "7px";
                button.style.paddingBottom = "7px";
                button.style.backgroundColor = "#0b0b2e";
                button.style.color = "white"
                button.style.borderRadius = "7px";
                button.style.fontWeight = "bold";
                button.style.border = "1px solid #1C1C57FF";
                button.addEventListener("click", function () {
                    blackFon.remove();
                    titleMenu.remove();
                    mainMenu.remove();

                    dataObjects = dataObjects.filter(item => item.Title !== value.Title);
                    localStorage.setItem('RMRP', JSON.stringify(dataObjects));

                    console.log(dataObjects);
                })
                func.appendChild(button)
            }
            function BackButtArbat() {
                var button = document.createElement("button")
                button.className = "back-button";
                button.innerHTML = "← Вернутся назад";
                button.style.margin = "5px";
                button.style.paddingRight = "10px";
                button.style.paddingLeft = "10px";
                button.style.paddingTop = "7px";
                button.style.paddingBottom = "7px";
                button.style.borderRadius = "7px";
                if (boolLight) {
                    button.style.backgroundColor = "#d89404";
                    button.style.color = "white";
                    button.style.boxShadow = "10px 7px 10px rgba(216, 148, 4, 0.5)";
                    button.style.transition = "box-shadow 0.3s ease";
                    button.style.border = "None"
                } else {
                    button.style.backgroundColor = "#0b0b2e";
                    button.style.color = "white"
                    button.style.fontWeight = "bold";
                    button.style.border = "1px solid #0b0b2e";
                    button.style.boxShadow = `8px 8px 8px rgba(${parseInt("#0b0b2e".slice(1, 3), 16)}, ${parseInt("#0b0b2e".slice(3, 5), 16)}, ${parseInt("#0b0b2e".slice(5, 7), 16)}, 0.5)`;
                }

                button.addEventListener("click", function () {
                    selectAnswer.innerHTML = "Выберите меню:"
                    ClearMainMenuArbat()
                    BackButtServer()
                    ArbatButt(mainMenu)
                })
                mainMenu.appendChild(button)
            }

            function CustomButt() {
                var buttonCkeck = document.createElement("button_check")
                buttonCkeck.className = "back-button";
                buttonCkeck.innerHTML = "Просмотр добавленных ответов";
                buttonCkeck.style.margin = "5px";
                buttonCkeck.style.paddingRight = "10px";
                buttonCkeck.style.paddingLeft = "10px";
                buttonCkeck.style.paddingTop = "7px";
                buttonCkeck.style.paddingBottom = "7px";
                buttonCkeck.style.backgroundColor = "#0b0b2e";
                buttonCkeck.style.color = "white"
                buttonCkeck.style.borderRadius = "7px";
                buttonCkeck.style.fontWeight = "bold";
                buttonCkeck.style.border = "1px solid #0b0b2e";
                buttonCkeck.style.boxShadow = `8px 8px 8px rgba(${parseInt("#0b0b2e".slice(1, 3), 16)}, ${parseInt("#0b0b2e".slice(3, 5), 16)}, ${parseInt("#0b0b2e".slice(5, 7), 16)}, 0.5)`;
                buttonCkeck.addEventListener("click", function () {
                    selectAnswer.innerHTML = "Просмотр добавленных ответов"
                    ClearMainMenuArbat()
                    BackButtArbat()

                    var variantDiv = document.createElement("div");

                    dataObjects.forEach(function (value) {
                        AddButton(value, variantDiv)
                    })

                    mainMenu.appendChild(variantDiv)
                })

                var buttonAdd = document.createElement("buttonAdd")
                buttonAdd.className = "back-button";
                buttonAdd.innerHTML = "Добавить ответ";
                buttonAdd.style.margin = "5px";
                buttonAdd.style.paddingRight = "10px";
                buttonAdd.style.paddingLeft = "10px";
                buttonAdd.style.paddingTop = "7px";
                buttonAdd.style.paddingBottom = "7px";
                buttonAdd.style.backgroundColor = "#0b0b2e";
                buttonAdd.style.color = "white"
                buttonAdd.style.borderRadius = "7px";
                buttonAdd.style.fontWeight = "bold";
                buttonAdd.style.border = "1px solid #0b0b2e";
                buttonAdd.style.boxShadow = `8px 8px 8px rgba(${parseInt("#0b0b2e".slice(1, 3), 16)}, ${parseInt("#0b0b2e".slice(3, 5), 16)}, ${parseInt("#0b0b2e".slice(5, 7), 16)}, 0.5)`;
                buttonAdd.addEventListener("click", function () {
                    selectAnswer.innerHTML = "Добавление кастомного ответа"
                    ClearMainMenuArbat()
                    AddCustomArbat()
                })

                var buttonDel = document.createElement("buttonDel")
                buttonDel.className = "back-button";
                buttonDel.innerHTML = "Удалить шаблон";
                buttonDel.style.margin = "5px";
                buttonDel.style.paddingRight = "10px";
                buttonDel.style.paddingLeft = "10px";
                buttonDel.style.paddingTop = "7px";
                buttonDel.style.paddingBottom = "7px";
                buttonDel.style.backgroundColor = "#0b0b2e";
                buttonDel.style.color = "white"
                buttonDel.style.borderRadius = "7px";
                buttonDel.style.fontWeight = "bold";
                buttonDel.style.border = "1px solid #0b0b2e";
                buttonDel.style.boxShadow = `8px 8px 8px rgba(${parseInt("#0b0b2e".slice(1, 3), 16)}, ${parseInt("#0b0b2e".slice(3, 5), 16)}, ${parseInt("#0b0b2e".slice(5, 7), 16)}, 0.5)`;
                buttonDel.addEventListener("click", function () {
                    selectAnswer.innerHTML = "Удаление ответа"
                    ClearMainMenuArbat()
                    BackButtArbat()

                    var variantDiv = document.createElement("div");

                    dataObjects.forEach(function (value) {
                        DelCutomButton(value, variantDiv)
                    })

                    mainMenu.appendChild(variantDiv)
                })

                mainMenu.appendChild(buttonAdd)
                mainMenu.appendChild(buttonCkeck)
                mainMenu.appendChild(buttonDel)
            }


            var ButtonsArbat = [
                {
                    "Fraction": "Жалобы на игроков",
                    "Color": "#0b0b2e",
                    "Function": function () {
                        ClearMainMenuArbat()
                        const dlElement = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_name"]');
                        const ddElement = dlElement.querySelector('dd');

                        const youName = document.querySelector("span.p-navgroup-linkText")

                        const report_user_id = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_id"]');
                        const user_id = report_user_id.querySelector('dd');
                        selectAnswer.innerHTML = "Шаблоны для 'Жалобы на игроков'"
                        BackButtArbat()

                        var Nick = ddElement
                        var varrDict = [
                            {
                                "Title": "Одобрение жалобы на адм ",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><div style="text-align: center;"><strong><span style="font-size: 18px;">Доброго времени суток, уважаемый <span style="color: rgb(250, 197, 28);">

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</span></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Вас приветствует ${youName.innerHTML}</span></strong></em></span></p><p style="text-align: center;"><span style="color: rgb(184, 49, 47);"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Администратор вынес вердикт корректно и обоснованно по всем указанным в вашей жалобе нарушениям.</span></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p><p></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(41, 105, 176);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px; color: rgb(41, 105, 176);"><em><strong><br></strong></em></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением,
Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "Передать ЗГА",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;" id="isPasted"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый <span style="color: rgb(250, 197, 28);">

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Рассмотрение данной жалобы будет передана - Заместителю главного администратора.</span></strong></em></span><span style="color: rgb(184, 49, 47);"><br></span></p><p style="text-align: center;"><span style="color: rgb(184, 49, 47);"><br></span></p><p style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><em><strong>Ожидайте рассмотрение в течении 48 часов.</strong></em></span><span style="color: rgb(184, 49, 47);"><br></span></p><p style="text-align: center;"><span style="color: rgb(184, 49, 47);"><br></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "Передать ГА",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;" id="isPasted"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый <span style="color: rgb(250, 197, 28);">

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Рассмотрение данной жалобы будет передана - Заместителю главного администратора.</span></strong></em></span><span style="color: rgb(184, 49, 47);"><br></span></p><p style="text-align: center;"><span style="color: rgb(184, 49, 47);"><br></span></p><p style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><em><strong>Ожидайте рассмотрение в течении 48 часов.</strong></em></span><span style="color: rgb(184, 49, 47);"><br></span></p><p style="text-align: center;"><span style="color: rgb(184, 49, 47);"><br></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "NRPCop",
                                "Body": `<div class="fr-wrapper" dir="ltr" style="max-height: 701px; overflow: auto;"><div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 
\t
\t\t
\t\t\t${Nick.innerHTML}
\t\t
\t
(
\t
\t\t
\t\t\t${user_id.innerHTML}
\t\t
\t
)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за NRPCop</span><span style="color: rgb(226, 80, 65);"> - Бан Ban 300 минут / warn</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><span style="color: rgb(41, 105, 176);"><br></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div><span class="fr-placeholder" style="font-size: 15px; line-height: 21px; margin-top: 0px; padding-top: 10px; padding-left: 20px; margin-left: 0px; padding-right: 20px; margin-right: 0px; text-align: left;"></span></div>`
                            },


                            {
                                "Title": "Cheat",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый


        ${Nick.innerHTML}


(


        ${user_id.innerHTML}


)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Cheat - Бан навсегда</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "Покрывательство Cheat",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Покрывательство читов</span><span style="color: rgb(226, 80, 65);"> - Бан 31 день</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "Обман в кости",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Обман в кости</span><span style="color: rgb(226, 80, 65);"> - Бан 180 дней</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "Оскорбление",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Оскорбление</span><span style="color: rgb(226, 80, 65);"> - Мут 240 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><span style="color: rgb(184, 49, 47);"><br></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "Оскорбление родных",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} ( ${user_id.innerHTML} )</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Оскорбление Родных</span><span style="color: rgb(226, 80, 65);">&nbsp;-&nbsp;<strong id="isPasted">Ban 15-31 день</strong></span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><span style="color: rgb(184, 49, 47);"><br></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "Дискриминация",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Дискриминация</span><span style="color: rgb(226, 80, 65);">&nbsp;- Бан 7 дней</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "CA",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} ( ${user_id.innerHTML} )</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Caps Abuse</span><span style="color: rgb(226, 80, 65);">&nbsp;-&nbsp;<strong id="isPasted">Mute 5-30 минут</strong></span></strong></em></span></p></blockquote><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "Dead Speak",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за разговор во время смерти</span><span style="color: rgb(226, 80, 65);"> - Mute 15-30 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><span style="color: rgb(184, 49, 47);"><br></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "VA",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} ( ${user_id.innerHTML} )</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Voice Abuse</span><span style="color: rgb(226, 80, 65);">&nbsp;-&nbsp;<strong id="isPasted">Mute 60 минут</strong></span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "МА",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} ( ${user_id.innerHTML} )</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Music Abuse</span><span style="color: rgb(226, 80, 65);">&nbsp;-&nbsp;<strong id="isPasted">Ban 60 минут</strong></span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "RS",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Referal Spam</span><span style="color: rgb(226, 80, 65);"> - Ban 3 дня</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "NRP",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Non RP Cop</span><span style="color: rgb(226, 80, 65);"> - Ban 240 минут / Ban 1 день</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "AR",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Amoral Rule</span><span style="color: rgb(226, 80, 65);">&nbsp;- Ban 7 дней / Mute 360 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "SGA",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Save Gun Abuse</span><span style="color: rgb(226, 80, 65);"> - Ban 120 минут + Pacifist 120 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "RTA",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} ( ${user_id.innerHTML} )</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Revive Time Abuse</span><span style="color: rgb(226, 80, 65);">&nbsp;-&nbsp;<strong id="isPasted">Ban 60-120 минут</strong></span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><span style="color: rgb(184, 49, 47);"><br></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "AA",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за AFK Abuse</span><span style="color: rgb(226, 80, 65);">&nbsp;- Ban 120 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {
                                "Title": "TA",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Trunk Abuse</span><span style="color: rgb(226, 80, 65);"> - Ban 180 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`
                            },

                            {"Title": "PA","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} ( ${user_id.innerHTML} )</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Provocative Actions</span><span style="color: rgb(226, 80, 65);">&nbsp;-&nbsp;<strong id="isPasted">Mute 180 минут / Ban 300 минут / Pacifist 300 минут</strong></span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "FRP / PG","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Fear RP / Power Gaming</span><span style="color: rgb(226, 80, 65);"> - Ban 120-240 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "NLR","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} ( ${user_id.innerHTML} )</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за New Life Rule</span><span style="color: rgb(226, 80, 65);">&nbsp;- <strong id="isPasted">Ban 240 мину</strong>т</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "RK","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Revenge Kill / Repeat Kill</span><span style="color: rgb(226, 80, 65);">&nbsp;- Ban 300 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "DM","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} ( ${user_id.innerHTML} )</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Death Match</span><span style="color: rgb(226, 80, 65);">&nbsp;-&nbsp;<strong id="isPasted">[Pacifist 420 минут</strong></span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "FD","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Free Damage</span><span style="color: rgb(226, 80, 65);">&nbsp;- Pacifist 360 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "Mass FD","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Mass Free Damage</span><span style="color: rgb(226, 80, 65);"> - Pacifist 1 день</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><span style="color: rgb(184, 49, 47);"><br></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "Mass DM","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} ( ${user_id.innerHTML} )</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Mass Death Match</span><span style="color: rgb(226, 80, 65);">&nbsp;-&nbsp;<strong id="isPasted">Ban 5 дней + Pacifist 420 минут</strong></span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "DCTAP / DTAP / LTAP","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} ( ${user_id.innerHTML} )</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Disconnected / Deception / Leave To Avoid Punishment</span><span style="color: rgb(226, 80, 65);">&nbsp;- Ban 240 минут / Ban 14 дней /&nbsp;<strong id="isPasted">Ban на х3 срок от нарушенного правила</strong></span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "MG","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Metagaming</span><span style="color: rgb(226, 80, 65);">&nbsp;- Mute 60-120 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "NRD","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Non RP Drive</span><span style="color: rgb(226, 80, 65);"> - Ban 60-120 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "DB","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} ( ${user_id.innerHTML} )</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за DriveBy</span><span style="color: rgb(226, 80, 65);">&nbsp;-&nbsp;<strong id="isPasted">Ban 120-240 минут</strong></span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><span style="color: rgb(184, 49, 47);"><br></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "SK","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} ( ${user_id.innerHTML} )</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Spawn Kill</span><span style="color: rgb(226, 80, 65);">&nbsp;- <strong id="isPasted">Pacifist 360 минут</strong></span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "Mass SK","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый ${Nick.innerHTML} ( ${user_id.innerHTML} )</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Mass Spawn Kill</span><span style="color: rgb(226, 80, 65);">&nbsp;-&nbsp;<strong id="isPasted">Ban 5 дней + <strong>Pacifist 360 минут</strong></strong></span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "TK","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Team Kill</span><span style="color: rgb(226, 80, 65);">&nbsp;- Pacifist 360 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "CK","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Character Kill</span><span style="color: rgb(226, 80, 65);">&nbsp;- Убийство персонажа без права вернуться на 14 дней</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "MR","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Media Rule</span><span style="color: rgb(226, 80, 65);"> - Ban 240 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "PB","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Player Block</span><span style="color: rgb(226, 80, 65);"> - Ban 60 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><span style="color: rgb(184, 49, 47);"><br></span></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "LRP","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Leave RP</span><span style="color: rgb(226, 80, 65);">&nbsp;- Ban 240-420 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "Слив склада","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за 'Слив склада'</span><span style="color: rgb(226, 80, 65);"> - Ban 31 день, удаление взятых предметов</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "ППО","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Правило первого отката</span><span style="color: rgb(226, 80, 65);"> - Ban 30 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "DC","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Dress Code</span><span style="color: rgb(226, 80, 65);"> - Ban 60 минут</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                            {"Title": "Помеха МП","Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p style="text-align: center;"><span style="font-size: 18px;"><em><strong>Доброго времени суток, уважаемый 

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(250, 197, 28);">Вас приветствует администратор RMRP</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><blockquote><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(209, 72, 65);">Игрок понесет наказание за Помеха мп</span><span style="color: rgb(226, 80, 65);">&nbsp;- Respawn</span></strong></em></span></p></blockquote><p style="text-align: center;"><br></p><p><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Желаем вам приятной игры на RMRP, если у вас возникнут дополнительные вопросы или потребуется дальнейшая помощь, пожалуйста, не стесняйтесь обращаться к нам.</span></strong></em></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">С уважением, Администратор RMRP</span></em></strong></span></p></div>`},

                        ]

                        var variantDiv = document.createElement("div");

                        varrDict.forEach(function (value) {
                            AddButton(value, variantDiv)
                        })
                        mainMenu.appendChild(variantDiv)
                    }
                },

                {
                    "Fraction": "Амнистия",
                    "Color": "#0b0b2e",
                    "Function": function () {
                        ClearMainMenuArbat()
                        const dlElement = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_name"]');
                        const ddElement = dlElement.querySelector('dd');

                        const youName = document.querySelector("span.p-navgroup-linkText")

                        const report_user_id = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_id"]');
                        const user_id = report_user_id.querySelector('dd');
                        selectAnswer.innerHTML = "Шаблоны для 'Жалобы на амнистию'"
                        BackButtArbat()

                        var Nick = ddElement
                        var varrDict = [
                            {
                                "Title": "Одобрено",
                                "Body": `<h1 style="font-size: 18px;" data-id="CENTERIBI++++COLORrgb235+107+86+COLORCOLORrgb147+101+184+COLORCOLORrgb235+107+86+COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong>До<em>брого времени суток уважаемый 
                <span style="color: rgb(247,218,100);">${Nick.innerHTML} (${user_id.innerHTML})</span>&nbsp;</em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBI++COLORrgb85+57+130COLOR+COLORrgb85+57+130RMRPCOLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em>Вас приветствует 
                <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации 
                <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBI++++COLORrgb147+101+184COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em>Просмотрев вашу амнистию, выношу 
                <span style="color: rgb(250,197,28);">вердикт:</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBBICENTER">
            <p style="text-align: center;"><br></p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBICOLORrgb255+255+255++COLORCOLORrgb147+101+184COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em><span style="color: rgb(184,49,47);">Ваша амнистия была</span>
                <span style="color: rgb(184,49,47);">&nbsp;одобрена!</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBICOLORrgb147+101+184+COLORCOLORrgb255+255+255+COLORCOLORrgb147+101+184COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em><span style="color: rgb(184,49,47);">Наказание&nbsp;</span>
                <span style="color: rgb(184,49,47);">будет снято,&nbsp;</span>
                <span style="color: rgb(184,49,47);">ожидайте</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBBICENTER">
            <p style="text-align: center;"><br></p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBICOLORrgb255+255+255.COLOR+COLORrgb147+101+184.COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em><span style="color: rgb(19,121,255);">Рассмотрено.</span> 
                <span style="color: rgb(19,121,255);">Закрыто.</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIB+++BCOLORrgb85+57+130BIRMRPIBCOLORICENTER">
            <p style="text-align: center;">
                <em><strong>Приятной игры на&nbsp;</strong>
                <span style="color: rgb(19,121,255);"><strong><em>RMRP!</em></strong></span></em>
            </p>
         </h1>`
                            },

                            {
                                "Title": "Отказано",
                                "Body": `<h1 style="font-size: 18px;" data-id="CENTERIBI++++COLORrgb235+107+86+COLORCOLORrgb147+101+184+COLORCOLORrgb235+107+86+COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong>До<em>брого времени суток уважаемый 
                <span style="color: rgb(247,218,100);">${Nick.innerHTML} (${user_id.innerHTML})</span>&nbsp;</em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBI++COLORrgb85+57+130COLOR+COLORrgb85+57+130RMRPCOLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em>Вас приветствует 
                <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации 
                <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBI++++COLORrgb147+101+184COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em>Просмотрев вашу амнистию, выношу 
                <span style="color: rgb(250,197,28);">вердикт:</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBBICENTER">
            <p style="text-align: center;"><br></p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBICOLORrgb255+255+255++COLORCOLORrgb147+101+184COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em><span style="color: rgb(184,49,47);">Ваша амнистия была</span>
                <span style="color: rgb(184,49,47);">&nbsp;отказана!</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBICOLORrgb147+101+184+COLORCOLORrgb255+255+255+COLORCOLORrgb147+101+184COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBBICENTER">
            <p style="text-align: center;"><br></p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIBICOLORrgb255+255+255.COLOR+COLORrgb147+101+184.COLORIBICENTER">
            <p style="text-align: center;">
                <em><strong><em><span style="color: rgb(19,121,255);">Рассмотрено.</span> 
                <span style="color: rgb(19,121,255);">Закрыто.</span></em></strong></em>
            </p>
         </h1>
         <h1 style="font-size: 18px;" data-id="CENTERIB+++BCOLORrgb85+57+130BIRMRPIBCOLORICENTER">
            <p style="text-align: center;">
                <em><strong>Приятной игры на&nbsp;</strong>
                <span style="color: rgb(19,121,255);"><strong><em>RMRP!</em></strong></span></em>
            </p>
         </h1>`
                            }
                        ]

                        var variantDiv = document.createElement("div");

                        varrDict.forEach(function (value) {
                            AddButton(value, variantDiv)
                        })
                        mainMenu.appendChild(variantDiv)
                    }
                },

                {
                    "Fraction": "Жалобы на администрацию",
                    "Color": "#0b0b2e",
                    "Function": function () {
                        ClearMainMenuArbat()
                        const dlElement = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_name"]');
                        const ddElement = dlElement.querySelector('dd');

                        const youName = document.querySelector("span.p-navgroup-linkText")

                        const report_user_id = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_id"]');
                        const user_id = report_user_id.querySelector('dd');

                        selectAnswer.innerHTML = "Шаблоны для 'Жалобы на администрацию'"
                        BackButtArbat()

                        var Nick = ddElement
                        var varrDict = [
                            {
                                "Title": "Неправильная форма подачи",
                                "Body": `<div class="fr-wrapper" dir="ltr" style="max-height: 701px; overflow: auto;"><div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><h1 id="isPasted" style="text-align: center;"><strong><span style="font-size: 18px;">До<em>брого времени суток уважаемый <span style="color: rgb(247,218,100);">

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</span></em></span></strong></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><strong><em>Вас приветствует <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Просмотрев вашу жалобу, выношу вердикт:</span></strong></em></span></h1><h1 style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><em><strong><em><strong><em><strong><em><strong>В вашей жалобе были замечены нарушения правил подачи</strong></em></strong></em></strong></em></strong></em></span></h1><h1 style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><em><strong><em><strong><em><strong><em><strong>Ознакомьтесь с ними в данном "</strong></em></strong></em></strong></em></strong></em><em><strong><em><strong><em><strong><em><strong>РАЗДЕЛE"</strong></em></strong></em></strong></em></strong></em></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><span style="color: rgb(184, 49, 47);"><em><strong><em><strong><em><strong><em><strong>При последующих жалобах не соблюдающих&nbsp;</strong></em></strong></em></strong></em></strong></em><em><strong><em><strong><em><strong><em><strong>ПРАВИЛА ПОДАЧИ</strong></em></strong></em></strong></em></strong></em></span><em><strong><em><strong><em><strong><em><strong><span style="color: rgb(184, 49, 47);">&nbsp;к вам могут быть применены санкции</span></strong></em></strong></em></strong></em></strong></em></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">Рассмотрено. Закрыто.</span></em></strong></span></h1><h1 style="text-align: center;"><strong><em><span style="font-size: 18px; color: rgb(41, 105, 176);">Приятной игры на </span><span style="color: rgb(41, 105, 176); font-size: 18px;">RMRP!</span></em></strong></h1></div><span class="fr-placeholder" style="font-size: 15px; line-height: 21px; margin-top: 0px; padding-top: 10px; padding-left: 20px; margin-left: 0px; padding-right: 20px; margin-right: 0px; text-align: left;"></span></div>`
                            },

                            {
                                "Title": "Не работают доква",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><h1 id="isPasted" style="text-align: center;"><strong><span style="font-size: 18px;">До<em>брого времени суток уважаемый <span style="color: rgb(247,218,100);">

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</span></em></span></strong></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><strong><em>Вас приветствует <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Просмотрев вашу жалобу, выношу вердикт:</span></strong></em></span></h1><h1 style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><em><strong><em><strong><em><strong><em><strong>В вашей жалобе были замечены не рабочие доказательства</strong></em></strong></em></strong></em></strong></em></span></h1><h1 style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><em><strong><em><strong><em><strong><em><strong>Перепроверьте их и подайте жалобу снова</strong></em></strong></em></strong></em></strong></em><a href="https://forum.rmrp.ru/threads/pravila-podachi-zhaloby-na-administratora.11/" target="_blank" rel="noopener noreferrer"></a></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><span style="color: rgb(184, 49, 47);"><em><strong><em><strong><em><strong><em><strong>При последующих жалобах не соблюдающих&nbsp;</strong></em></strong></em></strong></em></strong></em><em><strong><em><strong><em><strong><em><strong>ПРАВИЛА ПОДАЧИ</strong></em></strong></em></strong></em></strong></em></span><em><strong><em><strong><em><strong><em><strong><span style="color: rgb(184, 49, 47);">&nbsp;к вам могут быть применены санкции</span></strong></em></strong></em></strong></em></strong></em></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">Рассмотрено. Закрыто.</span></em></strong></span></h1><h1 style="text-align: center;"><strong><em><span style="font-size: 18px; color: rgb(41, 105, 176);">Приятной игры на </span><span style="color: rgb(41, 105, 176); font-size: 18px;">RMRP!</span></em></strong></h1></div>`
                            },

                            {
                                "Title": "Нет нарушений",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><h1 id="isPasted" style="text-align: center;"><strong><span style="font-size: 18px;">До<em>брого времени суток уважаемый <span style="color: rgb(247,218,100);">

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</span></em></span></strong></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><strong><em>Вас приветствует <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Просмотрев вашу жалобу, выношу вердикт:</span></strong></em></span></h1><h1 style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><em><strong><em><strong><em><strong><em><strong>В ваших доказательствах не было замечено нарушений от администратора.</strong></em></strong></em></strong></em></strong></em></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><span style="color: rgb(184, 49, 47);"><em><strong><em><strong><em><strong><em><strong>Если у вас появятся более существенные доказательства подайте </strong></em></strong></em></strong></em></strong></em><em><strong><em><strong><em><strong><em><strong>жалобу&nbsp;</strong></em></strong></em></strong></em></strong></em></span><em><strong><em><strong><em><strong><em><strong><span style="color: rgb(184, 49, 47);">снова</span></strong></em></strong></em></strong></em></strong></em><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">Рассмотрено. Закрыто.</span></em></strong></span></h1><h1 style="text-align: center;"><strong><em><span style="font-size: 18px; color: rgb(41, 105, 176);">Приятной игры на </span><span style="color: rgb(41, 105, 176); font-size: 18px;">RMRP!</span></em></strong></h1></div>`
                            },

                            {
                                "Title": "Недостаточно докв",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><h1 id="isPasted" style="text-align: center;"><strong><span style="font-size: 18px;">До<em>брого времени суток уважаемый <span style="color: rgb(247,218,100);">

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</span></em></span></strong></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><strong><em>Вас приветствует <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Просмотрев вашу жалобу, выношу вердикт:</span></strong></em></span></h1><h1 style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><em><strong><em><strong><em><strong><em><strong>Ваших доказательств было недостаточно, нарушений от администратора не найдено.</strong></em></strong></em></strong></em></strong></em></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><span style="color: rgb(184, 49, 47);"><em><strong><em><strong><em><strong><em><strong>Если у вас появятся более существенные доказательства подайте </strong></em></strong></em></strong></em></strong></em><em><strong><em><strong><em><strong><em><strong>жалобу&nbsp;</strong></em></strong></em></strong></em></strong></em></span><em><strong><em><strong><em><strong><em><strong><span style="color: rgb(184, 49, 47);">снова</span></strong></em></strong></em></strong></em></strong></em><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">Рассмотрено. Закрыто.</span></em></strong></span></h1><h1 style="text-align: center;"><strong><em><span style="font-size: 18px; color: rgb(41, 105, 176);">Приятной игры на </span><span style="color: rgb(41, 105, 176); font-size: 18px;">RMRP!</span></em></strong></h1></div>`
                            },

                            {
                                "Title": "Наказание по ошибке",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><h1 id="isPasted" style="text-align: center;"><strong><span style="font-size: 18px;">До<em>брого времени суток уважаемый <span style="color: rgb(247,218,100);">

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</span></em></span></strong></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><strong><em>Вас приветствует <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><em><strong>Просмотрев вашу <span style="color: rgb(247,218,100);">жалобу</span>, выношу <span style="color: rgb(247,218,100);">вердикт:</span></strong></em></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><em><strong><em><strong><em><strong><em><strong><span style="color: rgb(184, 49, 47);">После получения доказательств у администратора, стало известно, что наказание выдано по ошибке</span></strong></em></strong></em></strong></em></strong></em></span></h1><h1 style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><em><strong><em><strong><em><strong><em><strong>Ваше наказание будет снято в течении 24 часов</strong></em></strong></em></strong></em></strong></em></span></h1><blockquote><h1 style="text-align: center;"><span style="font-size: 18px;"><strong><span style="color: rgb(184, 49, 47);">Приносим свои извинения</span></strong><br></span></h1></blockquote><h1 style="text-align: center;"><span style="font-size: 18px;"><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">Рассмотрено. Закрыто.</span></em></strong></span></h1><h1 style="text-align: center;"><strong><em><span style="font-size: 18px; color: rgb(41, 105, 176);">Приятной игры на </span><span style="color: rgb(41, 105, 176); font-size: 18px;">RMRP!</span></em></strong></h1></div>`
                            },

                            {
                                "Title": "Беседа с администратором",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><h1 id="isPasted" style="text-align: center;"><strong><span style="font-size: 18px;">До<em>брого времени суток уважаемый <span style="color: rgb(247,218,100);">

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</span></em></span></strong></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><strong><em>Вас приветствует <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Просмотрев вашу жалобу, выношу вердикт:</span></strong></em></span></h1><h1 style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><em><strong><em><strong><em><strong><em><strong>С администратором будет проведена беседа</strong></em></strong></em></strong></em></strong></em><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><em><strong><em><strong><em><strong><em><strong>Ваше наказание&nbsp;будет снято в течении 24 часов</strong></em></strong></em></strong></em></strong></em></span></h1><blockquote><h1 style="text-align: center;"><span style="font-size: 18px;"><strong><span style="color: rgb(184, 49, 47);">Приносим свои извинения</span></strong><br></span></h1></blockquote><h1 style="text-align: center;"><span style="font-size: 18px;"><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">Рассмотрено. Закрыто.</span></em></strong></span></h1><h1 style="text-align: center;"><strong><em><span style="font-size: 18px; color: rgb(41, 105, 176);">Приятной игры на </span><span style="color: rgb(41, 105, 176); font-size: 18px;">RMRP!</span></em></strong></h1></div>`
                            },

                            {
                                "Title": "Наказание администратору",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><h1 id="isPasted" style="text-align: center;"><strong><span style="font-size: 18px;">До<em>брого времени суток уважаемый <span style="color: rgb(247,218,100);">

    
        ${Nick.innerHTML}
    

(

    
        ${user_id.innerHTML}
    

)</span></em></span></strong></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><strong><em>Вас приветствует <span style="color: rgb(250,197,28);">руководство&nbsp;</span>администрации <span style="color: rgb(250,197,28);">RMRP, ${youName.innerHTML}</span></em></strong></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><em><strong><span style="color: rgb(184, 49, 47);">Просмотрев вашу жалобу, выношу вердикт:</span></strong></em></span></h1><h1 style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><em><strong><em><strong><em><strong><em><strong>Администратор будет наказан</strong></em></strong></em></strong></em></strong></em><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px; color: rgb(184, 49, 47);"><em><strong><em><strong><em><strong><em><strong>Ваше наказание&nbsp;будет снято в течении 24 часов</strong></em></strong></em></strong></em></strong></em></span></h1><blockquote><h1 style="text-align: center;"><span style="font-size: 18px;"><strong><span style="color: rgb(184, 49, 47);">Приносим свои извинения</span></strong><br></span></h1></blockquote><h1 style="text-align: center;"><span style="font-size: 18px;"><br></span></h1><h1 style="text-align: center;"><span style="font-size: 18px;"><strong><em><span style="color: rgb(41, 105, 176);">Рассмотрено. Закрыто.</span></em></strong></span></h1><h1 style="text-align: center;"><strong><em><span style="font-size: 18px; color: rgb(41, 105, 176);">Приятной игры на </span><span style="color: rgb(41, 105, 176); font-size: 18px;">RMRP!</span></em></strong></h1></div>`
                            },
                        ]

                        var variantDiv = document.createElement("div");

                        varrDict.forEach(function (value) {
                            AddButton(value, variantDiv)
                        })
                        mainMenu.appendChild(variantDiv)
                    }
                },

                {
                    "Fraction": "Жалобы на лидеров",
                    "Color": "#0b0b2e",
                    "Function": function () {
                        ClearMainMenu()
                        const dlElement = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_name"]');
                        const ddElement = dlElement.querySelector('dd');

                        const youName = document.querySelector("span.p-navgroup-linkText")

                        const report_user_id = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_id"]');
                        const user_id = report_user_id.querySelector('dd');

                        selectAnswer.innerHTML = "Шаблоны для 'Жалобы на администрацию'"
                        BackButtArbat()

                        var Nick = ddElement
                        var varrDict = [
                            {
                                "Title": "Одобрено",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p id="isPasted" style="text-align: center;"><strong><span style="font-size: 18px;">Доброго времени суток${Nick.innerHTML}! Вас приветствует ${youName.innerHTML}&nbsp;</span></strong><span style="color: rgb(250, 197, 28); font-size: 18px;"><strong>Главный следящий</strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><br></strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><br></strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><span style="color: rgb(184, 49, 47);">Внимательно ознакомившись с вашей жалобой, выношу вердикт:</span></strong></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><span style="color: rgb(41, 105, 176);">Лидер будет наказан.</span></strong></span></p><p style="text-align: center;"><strong><span style="font-size: 18px; color: rgb(41, 105, 176);">Рассмотрено. Закрыто. </span></strong></p></div>`
                            },

                            {
                                "Title": "Отказано",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p id="isPasted" style="text-align: center;"><strong><span style="font-size: 18px;">Доброго времени суток${Nick.innerHTML}! Вас приветствует ${youName.innerHTML}&nbsp;</span></strong><span style="color: rgb(250, 197, 28); font-size: 18px;"><strong>Главный следящий</strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><br></strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><br></strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><span style="color: rgb(184, 49, 47);">Внимательно ознакомившись с вашей жалобой, выношу вердикт:</span></strong></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><span style="color: rgb(41, 105, 176);">Жалоба отказана.</span></strong></span></p><p style="text-align: center;"><strong><span style="font-size: 18px; color: rgb(41, 105, 176);">Рассмотрено. Закрыто. </span></strong></p></div>`
                            },

                            {
                                "Title": "Недост. Докв",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p id="isPasted" style="text-align: center;"><strong><span style="font-size: 18px;">Доброго времени суток${Nick.innerHTML}! Вас приветствует ${youName.innerHTML}&nbsp;</span></strong><span style="color: rgb(250, 197, 28); font-size: 18px;"><strong>Главный следящий</strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><br></strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><br></strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><span style="color: rgb(184, 49, 47);">Внимательно ознакомившись с вашей жалобой, выношу вердикт:</span></strong></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><span style="color: rgb(41, 105, 176);">Недостаточно доказательств.</span></strong></span></p><p style="text-align: center;"><strong><span style="font-size: 18px; color: rgb(41, 105, 176);">Рассмотрено. Закрыто. </span></strong></p></div>`
                            },

                            {
                                "Title": "Нет нарушений",
                                "Body": `<div class="fr-element fr-view fr-element-scroll-visible" dir="ltr" contenteditable="true" style="min-height: 100px;" aria-disabled="false" spellcheck="true"><p id="isPasted" style="text-align: center;"><strong><span style="font-size: 18px;">Доброго времени суток${Nick.innerHTML}! Вас приветствует ${youName.innerHTML}&nbsp;</span></strong><span style="color: rgb(250, 197, 28); font-size: 18px;"><strong>Главный следящий</strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><br></strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><br></strong></span></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><span style="color: rgb(184, 49, 47);">Внимательно ознакомившись с вашей жалобой, выношу вердикт:</span></strong></span></p><p style="text-align: center;"><br></p><p style="text-align: center;"><br></p><p style="text-align: center;"><span style="font-size: 18px;"><strong><span style="color: rgb(41, 105, 176);">Нет нарушений.</span></strong></span></p><p style="text-align: center;"><strong><span style="font-size: 18px; color: rgb(41, 105, 176);">Рассмотрено. Закрыто. </span></strong></p></div>`
                            },
                        ]

                        var variantDiv = document.createElement("div");

                        varrDict.forEach(function (value) {
                            AddButton(value, variantDiv)
                        })
                        mainMenu.appendChild(variantDiv)
                    }
                },

                {
                    "Fraction": "Кастомные шаблоны",
                    "Color": "#0b0b2e",
                    "Function": function () {
                        ClearMainMenuArbat()
                        selectAnswer.innerHTML = "Ваши шаблоны"
                        BackButtArbat()
                        CustomButt()
                    }
                },
            ]

            ButtonsArbat.forEach(function (fraction) {
                var button = document.createElement("button")
                button.className = fraction.Fraction;
                button.innerHTML = fraction.Fraction;
                button.style.margin = "7px";
                button.style.paddingRight = "10px";
                button.style.paddingLeft = "10px";
                button.style.paddingTop = "7px";
                button.style.paddingBottom = "7px";
                button.style.backgroundColor = fraction.Color;
                button.style.color = "white"
                button.style.borderRadius = "7px";
                button.style.fontWeight = "bold";
                button.style.border = "1px solid #1C1C57FF";
                button.style.boxShadow = `8px 8px 8px rgba(${parseInt(fraction.Color.slice(1, 3), 16)}, ${parseInt(fraction.Color.slice(3, 5), 16)}, ${parseInt(fraction.Color.slice(5, 7), 16)}, 0.5)`;

                button.addEventListener("click", fraction.Function || function() {});
                div.appendChild(button)
            })
        }

        function ClearMainMenuArbat() {
            while (mainMenu.firstChild) {
                mainMenu.removeChild(mainMenu.firstChild);
            }
        }

        function AddCustomArbat() {
            var input = document.createElement("input");
            input.style.display = "none";
            input.style.marginRight = "1%"
            input.style.borderRadius = "5px";
            input.style.border = "2px solid white";
            input.style.backgroundColor = "transparent"
            input.style.color = "white"
            input.style.fontWeight = "bold"
            input.style.width = "10%"
            input.style.height = "7%"
            input.value = "#ffffff"
            input.maxLength = 7

            var colorbutton = document.createElement("button")
            colorbutton.style.backgroundColor = "transparent"
            colorbutton.style.borderRadius = "10px";
            colorbutton.style.border = "2px solid white";
            colorbutton.style.color = "white";
            colorbutton.style.width = "40px"
            colorbutton.style.height = "40px"
            colorbutton.style.fontSize = "20px"
            colorbutton.style.marginBottom = "4%"
            colorbutton.innerHTML = "<i class=\"far fa-palette\" aria-hidden=\"true\"></i>"
            colorbutton.addEventListener("click", function () {
                if (input.style.display === "none") {
                    input.style.display = "inline";
                } else {
                    var selectedText = window.getSelection();
                    var range = selectedText.getRangeAt(0);
                    var span = document.createElement("span");
                    span.style.color = input.value;
                    range.surroundContents(span);
                    input.style.display = "none";
                }
            })

            var leftcenter = document.createElement("button")
            leftcenter.style.backgroundColor = "transparent"
            leftcenter.style.borderRadius = "10px";
            leftcenter.style.border = "2px solid white";
            leftcenter.style.color = "white";
            leftcenter.style.width = "40px"
            leftcenter.style.height = "40px"
            leftcenter.style.fontSize = "20px"
            leftcenter.style.marginLeft = "5%"
            leftcenter.innerHTML = "<i class=\"far fa-align-left\" aria-hidden=\"true\"></i>"
            leftcenter.addEventListener("click", function () {
                var selectedText = window.getSelection();
                if (selectedText.rangeCount > 0) {
                    var range = selectedText.getRangeAt(0);
                    var fragment = range.extractContents();
                    var container = document.createElement("div");
                    container.style.textAlign = "left";
                    container.appendChild(fragment);
                    range.insertNode(container);
                    input.style.display = "none";
                    window.getSelection().removeAllRanges()
                }
            })

            var centercenter = document.createElement("button")
            centercenter.style.backgroundColor = "transparent"
            centercenter.style.borderRadius = "10px";
            centercenter.style.border = "2px solid white";
            centercenter.style.color = "white";
            centercenter.style.width = "40px"
            centercenter.style.height = "40px"
            centercenter.style.fontSize = "20px"
            centercenter.style.marginLeft = "1%"
            centercenter.innerHTML = "<i class=\"far fa-align-center\" aria-hidden=\"true\"></i>"
            centercenter.addEventListener("click", function () {
                var selectedText = window.getSelection();
                if (selectedText.rangeCount > 0) {
                    var range = selectedText.getRangeAt(0);
                    var fragment = range.extractContents();
                    var container = document.createElement("div");
                    container.style.textAlign = "center";
                    container.appendChild(fragment);
                    range.insertNode(container);
                    input.style.display = "none";
                    window.getSelection().removeAllRanges()
                }
            })

            var rightcenter = document.createElement("button")
            rightcenter.style.backgroundColor = "transparent"
            rightcenter.style.borderRadius = "10px";
            rightcenter.style.border = "2px solid white";
            rightcenter.style.color = "white";
            rightcenter.style.width = "40px"
            rightcenter.style.height = "40px"
            rightcenter.style.fontSize = "20px"
            rightcenter.style.marginLeft = "1%"
            rightcenter.innerHTML = "<i class=\"far fa-align-right\" aria-hidden=\"true\"></i>"
            rightcenter.addEventListener("click", function () {
                var selectedText = window.getSelection();
                if (selectedText.rangeCount > 0) {
                    var range = selectedText.getRangeAt(0);
                    var fragment = range.extractContents();
                    var container = document.createElement("div");
                    container.style.textAlign = "right";
                    container.appendChild(fragment);
                    range.insertNode(container);
                    input.style.display = "none";
                    window.getSelection().removeAllRanges()
                }
            })

            var link = document.createElement("input");
            link.style.display = "none";
            link.style.marginRight = "1%"
            link.style.marginLeft = "2%"
            link.style.borderRadius = "5px";
            link.style.border = "2px solid white";
            link.style.backgroundColor = "transparent"
            link.style.color = "white"
            link.style.fontWeight = "bold"
            link.style.width = "20%"
            link.style.height = "7%"
            link.value = "https://forum.rmrp.ru/"

            var linkbutton = document.createElement("button")
            linkbutton.style.backgroundColor = "transparent"
            linkbutton.style.borderRadius = "10px";
            linkbutton.style.border = "2px solid white";
            linkbutton.style.color = "white";
            linkbutton.style.width = "40px"
            linkbutton.style.height = "40px"
            linkbutton.style.fontSize = "20px"
            linkbutton.style.marginLeft = "1%"
            linkbutton.innerHTML = "<i class=\"far fa-link\" aria-hidden=\"true\"></i>"
            linkbutton.addEventListener("click", function () {
                if (link.style.display === "none") {
                    link.style.display = "inline";
                }  else {
                    var selectedText = window.getSelection();
                    if (selectedText.toString().length > 0) {
                        var url = link.value.trim();
                        if (url) {
                            var range = selectedText.getRangeAt(0);
                            var a = document.createElement("a");
                            a.href = url;
                            a.textContent = selectedText.toString();
                            a.style.fontSize = "18px"
                            a.style.color = "inherit";
                            range.deleteContents();
                            range.insertNode(a);
                        }
                    }
                    link.style.display = "none";
                }
            })

            var size = document.createElement("input");
            size.style.display = "none";
            size.style.marginRight = "1%"
            size.style.marginLeft = "2%"
            size.style.borderRadius = "5px";
            size.style.border = "2px solid white";
            size.style.backgroundColor = "transparent"
            size.style.color = "white"
            size.style.fontWeight = "bold"
            size.style.width = "7%"
            size.style.height = "7%"
            size.value = "18"
            size.maxLength = 2
            size.type = "number"
            size.min = 5;
            size.max = 30;
            size.addEventListener("input", function() {
                if (parseInt(size.value) > 30) {
                    size.value = "30";
                }

                if (parseInt(size.value) < 1) {
                    size.value = "5";
                }
            });

            var textsize = document.createElement("button")
            textsize.style.backgroundColor = "transparent"
            textsize.style.borderRadius = "10px";
            textsize.style.border = "2px solid white";
            textsize.style.color = "white";
            textsize.style.width = "40px"
            textsize.style.height = "40px"
            textsize.style.fontSize = "20px"
            textsize.style.marginLeft = "1%"
            textsize.innerHTML = "<i class=\"far fa-paragraph\" aria-hidden=\"true\"></i>"
            textsize.addEventListener("click", function () {
                if (size.style.display === "none") {
                    size.style.display = "inline";
                } else {
                    // Получаем выделенный текст
                    var selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                        var range = selection.getRangeAt(0);
                        var span = document.createElement("span");
                        span.style.fontSize = size.value + "px";
                        var fragment = range.extractContents();
                        span.appendChild(fragment);
                        range.insertNode(span);
                        size.style.display = "none";
                    }
                }
            });

            var backbutton = document.createElement("button")
            backbutton.style.backgroundColor = "transparent"
            backbutton.style.borderRadius = "10px";
            backbutton.style.border = "2px solid white";
            backbutton.style.color = "white";
            backbutton.style.width = "40px"
            backbutton.style.height = "40px"
            backbutton.style.fontSize = "20px"
            backbutton.style.marginRight = "1%"
            backbutton.innerHTML = "<i class=\"far fa-undo\" aria-hidden=\"true\"></i>"
            backbutton.addEventListener("click", function () {
                ClearMainMenuArbat()
                ArbatButt(mainMenu)
            });

            const youName = document.querySelector("span.p-navgroup-linkText")
            var editableDiv = document.createElement("div");
            editableDiv.style.width = "70%";
            editableDiv.style.height = "80%";
            editableDiv.style.resize = "none";
            editableDiv.style.backgroundColor = "#0f0f30";
            editableDiv.style.color = "white";
            editableDiv.style.fontWeight = "bold";
            editableDiv.style.borderRadius = "10px";
            editableDiv.style.border = "2px solid white";
            editableDiv.style.padding = "10px";
            editableDiv.style.overflowY = "auto";
            editableDiv.style.whiteSpace = "pre-wrap";
            editableDiv.innerHTML = `Здравствуйте уважаемый ${youName.innerHTML}
В данном разделе вы можете создавать свои скрипты
Сверху вы можете увидеть инструменты для работы с текстом Для вставки текста вы можете использовать хэш цвета <div><a href="https://forum.rmrp.ru/" style="color: inherit;">
(например <span style="color: rgb(0, 0, 0);"><span style="color: rgb(51, 51, 51);">#fff</span></span>)</a></div><div><a href="https://forum.rmrp.ru/" style="color: inherit;">
Чтобы перекраска сработала в момент закрытия меню с указание хэша у вас должен быть выделен желаемый текст для перекраски</a><div></div><div><br></div><div>
Добавление ссылки аналогично добавлению цвета, при добавлении ссылки размер текста с ссылкой изменится на 18px</div><div><br></div><div>
Изменения размера текста аналогично цвету и добавлению ссылки</div><div>
</div><div style="text-align: center;"><div></div></div></div><div><div style="text-align: center;"><div></div></div></div><div><div><div><div style="text-align: center;"><div></div><div style="text-align: right;"><div></div><div style="text-align: left;"><div>Максимальный размер - <span style="font-size: 30px;">30</span></div><div>
Минимальный размер - <span style="font-size: 5px;">5<span style="font-size: 15px;"> (5)</span></span></div></div><div><span style="font-size: 5px;"><span style="font-size: 15px;"></span></span></div></div><div><span style="font-size: 5px;"><span style="font-size: 15px;"></span></span></div></div><div><span style="font-size: 5px;"><span style="font-size: 15px;"></span></span></div></div><div></div></div><div></div></div><div><span style="font-size: 5px;"><span style="font-size: 15px;"><br></span></span></div><div><br></div><div>Чтобы выровнить текст, нужно выделить желаемый текст для выравнивания</div><div><div style="text-align: center;">Выбрать один из вариантов выравнивания</div><div style="text-align: center;"><div style="text-align: left;">Лево</div><div style="text-align: left;"><div style="text-align: center;">Центр</div><div style="text-align: center;"><div style="text-align: right;">Право</div><div style="text-align: right;"><br></div><div style="text-align: right;"><div style="text-align: center;">Кастомные комманды для получения информации</div><div style="text-align: center;"><span style="font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);">!you - Ваш никнейм</span></div><div style="text-align: center;"><span style="font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"><div style="text-align: right;"><div style="text-align: center;">!nick - Ник того кто написал жалобу</div></div></span></div><div style="text-align: center;"><div style="text-align: right;"><div style="text-align: left;"><div style="text-align: center;"><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><div><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><div><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><div>!id - Ид игрока который написал жалобу</div><p></p><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><div>!idreport - Ид нарушителя</div><p></p></div><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><div>!time - Время нарушения</div><p></p><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><div>!info - Краткое описание</div><p></p></div><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><p data-xf-p="1" style="margin-bottom: 0px; margin-top: 0px; font-weight: 400; text-align: left; white-space-collapse: collapse; background-color: rgba(3, 2, 41, 0.3);"></p><div>!dock - Доказательства</div><div><br></div><div>При вводе этих команд в ваш шаблон вы получите вместо комманды информацию</div><p></p></div></div></div></div></div></div></div></div></div></div>`;

            var title = document.createElement("input");
            title.style.width = "200px"
            title.style.height = "40px"
            title.innerHTML = "Очистить шаблон"
            title.style.backgroundColor = "#0f0f30";
            title.style.position = "fixed";
            title.style.border = "2px solid white";
            title.style.fontWeight = "bold"
            title.style.color = "white"
            title.style.borderRadius = "10px";
            title.style.fontSize = "14px";
            title.style.left = "685px"
            title.style.top = "230px"
            title.style.textAlign = "center"
            title.value = "Название шаблона"

            var clearbutton = document.createElement("button");
            clearbutton.style.width = "200px"
            clearbutton.style.height = "40px"
            clearbutton.innerHTML = "Очистить шаблон"
            clearbutton.style.backgroundColor = "#0f0f30";
            clearbutton.style.position = "fixed";
            clearbutton.style.border = "2px solid white";
            clearbutton.style.fontWeight = "bold"
            clearbutton.style.color = "white"
            clearbutton.style.borderRadius = "10px";
            clearbutton.style.fontSize = "18px";
            clearbutton.style.left = "685px"
            clearbutton.style.top = "280px"
            clearbutton.addEventListener("click", function () {
                editableDiv.innerHTML = ""
            })

            var savebutton = document.createElement("button");
            savebutton.style.width = "200px"
            savebutton.style.height = "40px"
            savebutton.innerHTML = "Сохранить"
            savebutton.style.backgroundColor = "#0f0f30";
            savebutton.style.position = "fixed";
            savebutton.style.border = "2px solid white";
            savebutton.style.fontWeight = "bold"
            savebutton.style.color = "white"
            savebutton.style.borderRadius = "10px";
            savebutton.style.fontSize = "18px";
            savebutton.style.left = "685px"
            savebutton.style.top = "330px"
            savebutton.addEventListener("click", function () {
                editableDiv.innerHTML = editableDiv.innerHTML.replace("!you", youName.innerHTML);

                var nick = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_name"]');
                var nickItog = nick.querySelector("dd");
                editableDiv.innerHTML = editableDiv.innerHTML.replace("!nick", nickItog.innerHTML);

                var id = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_id"]');
                var idItog = id.querySelector("dd");
                editableDiv.innerHTML = editableDiv.innerHTML.replace("!id", idItog.innerHTML);

                var idReport = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_user_id1"]');
                var idReportItog = idReport.querySelector("dd");
                editableDiv.innerHTML = editableDiv.innerHTML.replace("!idreport", idReportItog.innerHTML);

                var timeReport = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_time"]');
                var timeReportItog = timeReport.querySelector("dd");
                editableDiv.innerHTML = editableDiv.innerHTML.replace("!time", timeReportItog.innerHTML);

                var infoReport = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_description"]');
                var infoReportItog = infoReport.querySelector("dd");
                editableDiv.innerHTML = editableDiv.innerHTML.replace("!info", infoReportItog.innerHTML);

                var dock = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_proofs"]');
                var dockReportItog = dock.querySelector("dd");
                editableDiv.innerHTML = editableDiv.innerHTML.replace("!dock", dockReportItog.innerHTML);

                const newObject = {
                    "Title": title.value,
                    "Body": editableDiv.innerHTML
                };

                dataObjects.push(newObject);

                localStorage.setItem('RMRP', JSON.stringify(dataObjects));

                blackFon.remove();
                titleMenu.remove();
                mainMenu.remove();

                console.log('New Data saved:', dataObjects);
            })

            editableDiv.setAttribute("contenteditable", "true");

            mainMenu.appendChild(backbutton)

            mainMenu.appendChild(input)
            mainMenu.appendChild(colorbutton);

            mainMenu.appendChild(link)
            mainMenu.appendChild(linkbutton);

            mainMenu.appendChild(size)
            mainMenu.appendChild(textsize)

            mainMenu.appendChild(leftcenter)
            mainMenu.appendChild(centercenter)
            mainMenu.appendChild(rightcenter)

            mainMenu.appendChild(savebutton)
            mainMenu.appendChild(clearbutton)
            mainMenu.appendChild(title)

            mainMenu.appendChild(editableDiv);
        }
        switch (event) {
            case "Arbat":
                ClearMainMenu()
                BackButtServer()
                ArbatButt(mainMenu)
                break

            case "Ryblevka":
                ClearMainMenu()
                BackButtServer()
                RyblevkaButt(mainMenu)
                break
        }
    }

    var onlineDevList = {"Даниил Воронин": false, "Ашот Воронни": true}

    var onlineDev = document.querySelectorAll("a.username ")
    if (onlineDev) {
        onlineDev.forEach(function (member) {
            name = member.innerHTML
            if (name === "Даниил Воронин" || name === "Ашот Воронин") {
                onlineDevList[name] = true
            }
        })

        var myProfile = document.querySelector("div.p-navgroup.p-account.p-navgroup--member")
        var myNick = myProfile.querySelector("span.avatar.avatar--xxs")
        var myId = myNick.getAttribute("data-user-id")
        if (myId === "10460") onlineDevList["Даниил Воронин"] = true
        if (myId === "604") onlineDevList["Ашот Воронни"] = true
    }

    var member = document.querySelector("ol.memberOverviewBlocks")
    if (member) {
        var devForumScriptMember = document.createElement("li")
        devForumScriptMember.className = "memberOverviewBlock"

        var titleDevForumScriptMember = document.createElement("h3")
        titleDevForumScriptMember.className = "block-textHeader"
        var linkDevForumScriptMember = document.createElement("a")
        linkDevForumScriptMember.className = "memberOverViewBlock-title"
        linkDevForumScriptMember.innerHTML = "Члены команды Forum Script"

        var listDevForumScriptMember = document.createElement("ol")
        listDevForumScriptMember.className = "memberOverviewBlock-list"
        function AddMember(ids, hrefs, name, linkA) {
            // Аватарки
            var members = document.createElement("li")
            var profile = document.createElement("div")
            profile.className = "contentRow contentRow--alignMiddle"

            var avatar = document.createElement("div")
            avatar.className = "contentRow-figure"

            var avatarLink = document.createElement("a")
            avatarLink.className = "avatar avatar--xs"
            avatarLink.href = hrefs
            avatarLink.setAttribute("data-user-id", ids)

            var avatarImg = document.createElement("img")
            avatarImg.className = `avatar-u=${ids}-s`;
            avatarImg.alt = name
            avatarImg.src = linkA

            // Ник нейм

            var memberNick = document.createElement("div")
            memberNick.className = "contentRow-main"

            var title = document.createElement("h3")
            title.className = "contentRow-title"

            var linkNick = document.createElement("a")
            linkNick.className = "username "
            linkNick.href = hrefs
            linkNick.dir = "auto"
            linkNick.setAttribute("data-xf-init", "member-tooltip")
            linkNick.setAttribute("id", "js-XFUniqueId50")
            linkNick.setAttribute("data-user-id", ids)

            var textNick = document.createElement("span")
            textNick.className = "username--style12 username--staff username--moderator username--admin"
            textNick.innerHTML = name
            textNick.style.color = "#ff9100"

            avatarLink.appendChild(avatarImg)
            avatar.appendChild(avatarLink)

            linkNick.appendChild(textNick)
            title.appendChild(linkNick)
            memberNick.appendChild(title)

            profile.appendChild(avatar)
            profile.appendChild(memberNick)

            members.appendChild(profile)
            listDevForumScriptMember.appendChild(members)
        }

        AddMember("604", "/members/ashot-voronin.604/", "Ашот Воронин", "/data/avatars/l/0/604.jpg?1710086478")
        AddMember("10460", "/members/daniil-voronin.10460/", "Даниил Воронин", "/data/avatars/l/10/10460.jpg?1723253464")


        titleDevForumScriptMember.appendChild(linkDevForumScriptMember)
        devForumScriptMember.appendChild(titleDevForumScriptMember)
        devForumScriptMember.appendChild(listDevForumScriptMember)

        member.appendChild(devForumScriptMember)
    }

    if (buttons) {
        buttons.appendChild(buttonShablon);
    }

    var username = document.querySelector("span.username")
    if (username) {
        var id = username.getAttribute("data-user-id")
        if (id) {
            if (id === "604" || id === "10460") {
                var infoCrask = document.querySelector("em.userBanner.userBanner.userBanner--silver")
                var craska = infoCrask.querySelector("strong")
                craska.innerHTML = "Forum Script DEV"
                craska.style.color = "white"
                craska.style.fontSize = "12px"

                infoCrask.style.backgroundColor = "#ff9100"
                infoCrask.style.borderColor = "#ff9100"

                var nick = document.querySelector("span.username");
                nick.style.color = "#ff9100";
                nick.className = "username--style12 username--moderator username--admin";
                nick.style.color = "#ff9100";
            }
        }
    }

    var dock = document.querySelector('dl.pairs.pairs--columns.pairs--fixedSmall.pairs--customField[data-field="report_proofs"]');
    if (dock) {
        var dockReportItog = dock.querySelector("dd");
        var link = dockReportItog.querySelector("a").href
        if (link.includes("/yout")) {
            var idYT = link.slice(-11)
            dockReportItog.querySelector("a").innerHTML = ""

            const iframe = document.createElement('iframe');
            iframe.width = '560';
            iframe.height = '315';
            iframe.src = `https://www.youtube.com/embed/${idYT}`;
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            dockReportItog.appendChild(iframe);
        }}
})();