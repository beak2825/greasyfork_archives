// ==UserScript==
// @name         собрать ресурсы в шахте

// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://worldofrest.ru/wap/kopat.php?*
// @match        http://worldofrest.ru/wap/cap.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421540/%D1%81%D0%BE%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D1%8B%20%D0%B2%20%D1%88%D0%B0%D1%85%D1%82%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/421540/%D1%81%D0%BE%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D1%80%D0%B5%D1%81%D1%83%D1%80%D1%81%D1%8B%20%D0%B2%20%D1%88%D0%B0%D1%85%D1%82%D0%B5.meta.js
// ==/UserScript==

function do_work()
{
    var list = document.body.getElementsByTagName('IMG');
    for (var i = 0; i < list.length; ++i) {
        var img = list[i];
        if (img.src.indexOf('gif_captcha.php') != -1 ) {
             alert('капча');
             return;
         }
        if (list[i].src.indexOf('http://worldofrest.ru/images/res') != -1) {
            setTimeout(function(){list[i].click();} , Math.random() * 150);
            return;
        }
    }
    var list_a = document.body.getElementsByTagName('A');
    for (i = 0; i < list_a.length; ++i) {
        var a = list_a[i];
        if (a.textContent == 'Продолжить поиски' ) {
            setTimeout(function(){a.click();} , Math.random() * 500);
            return;
        }
    }
}

do_work();