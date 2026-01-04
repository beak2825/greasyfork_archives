// ==UserScript==
// @name         Читаемые цвета ников и т.п.
// @namespace    https://greasyfork.org/en/users/1261878-twice2750
// @version      1.1
// @license      MIT
// @description  Заменяет цвета ников и т.п. на более читаемые
// @match        https://www.fantasyland.ru/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/488778/%D0%A7%D0%B8%D1%82%D0%B0%D0%B5%D0%BC%D1%8B%D0%B5%20%D1%86%D0%B2%D0%B5%D1%82%D0%B0%20%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2%20%D0%B8%20%D1%82%D0%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/488778/%D0%A7%D0%B8%D1%82%D0%B0%D0%B5%D0%BC%D1%8B%D0%B5%20%D1%86%D0%B2%D0%B5%D1%82%D0%B0%20%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2%20%D0%B8%20%D1%82%D0%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Определяем старые цвета
    const oldColors      = ["EF0000", "FF6F01", "9CFF00", "00EAFF", "FF00D9",   // Цвета ников и сообщений
                            "0004FF", "A33636", "0054D3", "6A2323", "9B9134",   // Цвета ников и сообщений
                            "359B38", "282D85", "792885", "348FB0", "62A32D",   // Цвета ников и сообщений
                            "FFFFFF", "292929", "FFFF00", "FFDD68",             // Цвета ников и сообщений
                            "00AAAA",                                           // Цвет хп в логе боя
                            "00FF00",                                           // Цвет восстановления хп в логе боя / Цвет сообщения при появления ёлки
                            "FF0000"];                                          // Цвет потери хп в логе боя

    // Определяем новые цвета для светлого фона (чат/форум)
    const newColorsLight = ["802200", "66380f", "2b390e", "005051", "800080",
                            "0000e0", "552a1b", "0f4880", "6A2323", "382903",
                            "002a00", "282D85", "550055", "004055", "123622",
                            "FFFFFF", "292929", "5a440d", "483c0c",
                            "00AAAA",
                            "104F10",
                            "FF0000"];

    // Определяем новые цвета для тёмного фона (игра)
    const newColorsDark  = ["F7BEBE", "f9bf3b", "9CFF00", "00EAFF", "FFADF3",
                            "9EA0FF", "3D1111", "9EC5FF", "360000", "d4d0ab",
                            "4add8c", "C4C5FF", "F3A8FF", "5CD3FF", "87d37c",
                            "FFFFFF", "292929", "FFFF00", "ffecdb",
                            "42C7C7",
                            "98fe98",
                            "FFB8B8"];

    // Цвет фона чата                 #B6B6B6
    // Цвет фона списка игроков       #A6A6A6
    // Фон форума                     https://www.fantasyland.ru/images/pic.new/battle_bg.jpg (#C7C7C5)
    // Фон игры                       https://www.fantasyland.ru/images/pic/bg.jpg (#6A6A6A)

    // Перехватываем формирование страницы и изменяем элементы
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {

                  // Получаем список всех элементов, добавленных на страницу
                  var addedElements = mutation.addedNodes;
                  for (var i = 0; i < addedElements.length; i++) {
                        var element = addedElements[i];

                        //console.debug(element.tagName, element.baseURI, element.innerHTML, element.color);

                        // Исправляем на форуме отображение жирного текста для браузера Mozilla Firefox
                        if (element.className === 'Sub_FTable' || element.className === 'Sub_FTableTitle') {
                               element.style.fontWeight = "normal";
                        }

                        // Проверяем, принадлежит ли элемент к списку игроков
                        if (element.tagName === 'FONT' && element.baseURI === "https://www.fantasyland.ru/cgi/ch_who.php") {

                              // Заменяем старый цвет на новый цвет для светлого фона
                              for (let i = 0; i < oldColors.length; i++) {
                                    if (element.color === oldColors[i]) {
                                        element.color = newColorsLight[i];
                                      }
                                }
                          }

                        // Проверяем, принадлежит ли элемент к чату
                        else if (element.tagName === 'SCRIPT' && element.baseURI === "https://www.fantasyland.ru/ch/chout.php") {

                              // Заменяем старый цвет на новый цвет для светлого фона
                              for (let i = 0; i < oldColors.length; i++) {
                                  element.innerHTML = element.innerHTML.replace(new RegExp(oldColors[i], 'g'), newColorsLight[i]);
                              }
                        }

                        // Проверяем, принадлежит ли элемент к форуму
                        else if (element.tagName === 'SCRIPT' && (element.baseURI.startsWith("https://www.fantasyland.ru/cgi/forum.php") ||
                                                                 element.baseURI.startsWith("https://www.fantasyland.ru/cgi/f_show_thread.php"))) {

                              // Заменяем старый цвет на новый цвет для светлого фона
                              for (let i = 0; i < oldColors.length; i++) {
                                  element.textContent = element.textContent.replace(new RegExp(oldColors[i], 'g'), newColorsLight[i]);
                              }
                        }

                        // Проверяем, принадлежит ли элемент к логу боя внутри игры
                        else if (element.tagName === 'DIV' && element.closest("div#log") &&
                                 element.baseURI === "https://www.fantasyland.ru/cgi/combat_panel.php") {

                              // Заменяем старый цвет на новый цвет для темного фона
                              for (let i = 0; i < oldColors.length; i++) {
                                  element.innerHTML = element.innerHTML.replace(new RegExp(oldColors[i], 'g'), newColorsDark[i]);
                              }
                        }

                        // Проверяем, принадлежит ли элемент к логу боя в отдельном окне
                        else if (element.tagName === 'FONT' && (element.baseURI.startsWith("https://www.fantasyland.ru/cgi/pl_combat.php") ||
                                                               element.baseURI.startsWith("https://www.fantasyland.ru/cgi/show_combat_details.php"))) {

                              // Заменяем старый цвет на новый цвет для темного фона
                              let fonts = element.querySelectorAll('font');
                              let changedColor = false;
                              let changedDiv = false;
                              for (let i = 0; i < oldColors.length; i++) {

                                    if (element.color === oldColors[i] || element.color === '#' + oldColors[i] ) {
                                        element.color = newColorsDark[i];
                                    }
                              }
                              fonts.forEach(fontDiv => {
                                  for (let i = 0; i < oldColors.length; i++) {
                                        if (fontDiv.color === oldColors[i] || fontDiv.color === '#' + oldColors[i] ) {
                                            fontDiv.color = newColorsDark[i];
                                        }
                                  }
                              });
                        }

                        // Проверяем, принадлежит ли элемент к арене или лабиринту
                        else if (element.tagName === 'TABLE' && element.baseURI === "https://www.fantasyland.ru/cgi/no_combat.php") {

                                // Заменяем старый цвет на новый цвет для темного фона
                                let hiddenDiv = document.createElement('table');
                                hiddenDiv.innerHTML = element.innerHTML;
                                let fonts = hiddenDiv.querySelectorAll('font');
                                let changed = false;
                                fonts.forEach(fontDiv => {
                                    for (let i = 0; i < oldColors.length; i++) {
                                          if (fontDiv.color === oldColors[i] || fontDiv.color === '#' + oldColors[i] ) {
                                              fontDiv.color = newColorsDark[i];
                                              changed = true;
                                          }
                                    }
                                });
                                if (changed) {
                                    element.innerHTML = hiddenDiv.innerHTML;
                                }
                        }

                        // Проверяем, принадлежит ли элемент к турнирной сетке или чему-то другому в игре
                        else if (element.tagName === 'SCRIPT' && element.baseURI != "https://www.fantasyland.ru/ch/chout.php") {

                              // Заменяем старый цвет на новый цвет для темного фона
                              for (let i = 0; i < oldColors.length; i++) {
                                 element.textContent = element.textContent.replace(new RegExp(oldColors[i], 'g'), newColorsDark[i]);
                              }
                        }
                  }
            }
        });
    });

    // Запускаем наблюдение за изменениями на странице
    observer.observe(document, { childList: true, subtree: true });
})();