// ==UserScript==
// @name         Удалить метакарт
// @namespace    https://greasyfork.org/ru/scripts/383168
// @version      0.3
// @description  Оптимизация процесса проверки
// @author       М
// @run-at       document-body
// @include      https://megalith.edadeal.ru/admin/cage/complaint/moderate/*
// @downloadURL https://update.greasyfork.org/scripts/383168/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B8%D1%82%D1%8C%20%D0%BC%D0%B5%D1%82%D0%B0%D0%BA%D0%B0%D1%80%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/383168/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B8%D1%82%D1%8C%20%D0%BC%D0%B5%D1%82%D0%B0%D0%BA%D0%B0%D1%80%D1%82.meta.js
// ==/UserScript==
var toRemove = document.getElementsByClassName("metacards-iframe")[0];
toRemove.parentElement.removeChild(toRemove);

document.getElementById("alias_for_item_1").rows = "5";
document.getElementById("alias_for_item_1").cols = "20";
document.getElementById("alias_for_item_2").rows = "5";
document.getElementById("alias_for_item_2").cols = "20";
document.getElementById("alias_for_item_3").rows = "5";
document.getElementById("alias_for_item_3").cols = "20";
document.getElementById("alias_for_item_4").rows = "5";
document.getElementById("alias_for_item_4").cols = "20";
document.getElementById("alias_for_item_5").rows = "5";
document.getElementById("alias_for_item_5").cols = "20";
document.getElementById("alias_for_item_6").rows = "5";
document.getElementById("alias_for_item_6").cols = "20";
document.getElementById("alias_for_item_7").rows = "5";
document.getElementById("alias_for_item_7").cols = "20";
document.getElementById("alias_for_item_8").rows = "5";
document.getElementById("alias_for_item_8").cols = "20";
document.getElementById("alias_for_item_9").rows = "5";
document.getElementById("alias_for_item_9").cols = "20";
document.getElementById("alias_for_item_10").rows = "5";
document.getElementById("alias_for_item_10").cols = "20";