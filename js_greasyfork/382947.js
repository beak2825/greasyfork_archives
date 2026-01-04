// ==UserScript==
// @name         HWM_AddAltClassesToMTPagesOnLgnd
// @namespace    Небылица
// @version      1.0
// @description  Добавляет альты в плашку поиска на страницах игроков МТ на lgnd.ru
// @author       Небылица
// @include      /^https{0,1}:\/\/lgnd\.ru\/mt\d+\/info\/id.+/
// @downloadURL https://update.greasyfork.org/scripts/382947/HWM_AddAltClassesToMTPagesOnLgnd.user.js
// @updateURL https://update.greasyfork.org/scripts/382947/HWM_AddAltClassesToMTPagesOnLgnd.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // определяем элементы под замену и их новый код
    var side1Td = document.querySelector("input[type='radio'][name='r']").parentNode,
        side2Td = side1Td.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.children[1],
        rNewHTML =
            "<td><input type=\"radio\" name=\"r\" value=\"0\" checked=\"checked\"> все|" +
            "<input type=\"radio\" name=\"r\" value=\"1\"><img src=\"http://lgnd.ru/i/r1.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"r\" value=\"2\"><img src=\"http://lgnd.ru/i/r2.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"r\" value=\"3\"><img src=\"http://lgnd.ru/i/r3.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"r\" value=\"4\"><img src=\"http://lgnd.ru/i/r4.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"r\" value=\"5\"><img src=\"http://lgnd.ru/i/r5.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"r\" value=\"6\"><img src=\"http://lgnd.ru/i/r6.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"r\" value=\"7\"><img src=\"http://lgnd.ru/i/r7.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"r\" value=\"8\"><img src=\"http://lgnd.ru/i/r8.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"r\" value=\"9\"><img src=\"http://lgnd.ru/i/r9.gif\" border=\"0\">|" +
            "<br><input type=\"radio\" name=\"r\" value=\"101\"><img src=\"http://lgnd.ru/i/r101.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"r\" value=\"102\"><img src=\"http://lgnd.ru/i/r102.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"r\" value=\"103\"><img src=\"http://lgnd.ru/i/r103.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"r\" value=\"104\"><img src=\"http://lgnd.ru/i/r104.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"r\" value=\"105\"><img src=\"http://lgnd.ru/i/r105.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"r\" value=\"205\"><img src=\"http://lgnd.ru/i/r205.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"r\" value=\"106\"><img src=\"http://lgnd.ru/i/r106.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"r\" value=\"107\"><img src=\"http://lgnd.ru/i/r107.gif\" border=\"0\"></td>",
        erNewHTML =
            "<td><input type=\"radio\" name=\"er\" value=\"0\" checked=\"checked\"> все|" +
            "<input type=\"radio\" name=\"er\" value=\"1\"><img src=\"http://lgnd.ru/i/r1.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"er\" value=\"2\"><img src=\"http://lgnd.ru/i/r2.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"er\" value=\"3\"><img src=\"http://lgnd.ru/i/r3.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"er\" value=\"4\"><img src=\"http://lgnd.ru/i/r4.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"er\" value=\"5\"><img src=\"http://lgnd.ru/i/r5.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"er\" value=\"6\"><img src=\"http://lgnd.ru/i/r6.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"er\" value=\"7\"><img src=\"http://lgnd.ru/i/r7.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"er\" value=\"8\"><img src=\"http://lgnd.ru/i/r8.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"er\" value=\"9\"><img src=\"http://lgnd.ru/i/r9.gif\" border=\"0\">|" +
            "<br><input type=\"radio\" name=\"er\" value=\"101\"><img src=\"http://lgnd.ru/i/r101.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"er\" value=\"102\"><img src=\"http://lgnd.ru/i/r102.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"er\" value=\"104\"><img src=\"http://lgnd.ru/i/r104.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"er\" value=\"105\"><img src=\"http://lgnd.ru/i/r105.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"er\" value=\"205\"><img src=\"http://lgnd.ru/i/r205.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"er\" value=\"106\"><img src=\"http://lgnd.ru/i/r106.gif\" border=\"0\">|" +
            "<input type=\"radio\" name=\"er\" value=\"107\"><img src=\"http://lgnd.ru/i/r107.gif\" border=\"0\"></td>";

    // меняем
    if (side1Td){side1Td.innerHTML = rNewHTML;}
    if (side2Td){side2Td.innerHTML = erNewHTML;}

    // выставляем чеки в нужные радио
    var currentRClassMatch = location.href.match(/\/r\/(\d+)/),
        currentErClassMatch = location.href.match(/\/er\/(\d+)/);
    if (currentRClassMatch){document.querySelector("input[type='radio'][name='r'][value='" + currentRClassMatch[1] + "']").checked = "checked";}
    if (currentErClassMatch){document.querySelector("input[type='radio'][name='er'][value='" + currentErClassMatch[1] + "']").checked = "checked";}
})();