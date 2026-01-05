// ==UserScript==
// @name            Talent unlocker for boi.pw
// @name:ru         Разблокировщик талантов на boi.pw
// @namespace       ANT0x1
// @version         1.4.1
// @date            2017-09-02
// @description     Removes ads, unlocks the talents and hides the chat on boi.pw
// @description:ru  Удаляет рекламу и разблокирует таланты на boi.pw
// @author          ANT0x1
// @match           https://boi.pw/calculator/my_bild.php*
// @match           http://boi.pw/calculator/my_bild.php*
// @homepage        https://openuserjs.org/scripts/ANT0x1/
// @icon            https://boi.pw/calculator/images/favicon.ico
// @grant           none
// @copyright       2016 - 2017, ANT0x1
// @downloadURL https://update.greasyfork.org/scripts/25829/Talent%20unlocker%20for%20boipw.user.js
// @updateURL https://update.greasyfork.org/scripts/25829/Talent%20unlocker%20for%20boipw.meta.js
// ==/UserScript==
'use strict';

jQuery.fn.exists = function() {
   return $(this).length;
};

$(document).ready(function() {
    document.getElementById('reklama').height = 1;
    window.adblock= '1';
    if ($(".adsbygoogle").exists())
        $('.adsbygoogle').hide();
    document.getElementById('reklama').innerHTML = '<iframe height="1" frameborder="0"/>';
    var block = document.getElementById('main_block');
    var toRemove = block.childNodes[5]
    block.removeChild(toRemove);
    if ($(".chat").exists())
        $(".chat").hide();
    if ($(".talants").exists())
        $(".talants").width('100%');
    $("#si_see").click();//Отключаем синие.
    $("#fi_see").click();//Отключаем фиолетовые.
    //Теперь ставим максимальные уровни
    $(".lvlUU_1").click();//Уровень героя.
    $("#stak").click();//Включаем стак.
    $(".ajUU_1").click();//Альков жизни / Бастион.
    $(".mshUU_1").click();//Монумент штурма / Таран.
    $(".hchUU_1").click();//Храм чистоты / Дом милосердия.
    $(".aUU_1").click();//Арена.
    $(".hsbUU_1").click();//Шпиль безмолвия / Секретная служба.
});
