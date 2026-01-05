// ==UserScript==
// Имя скрипта
// @name WofhSendInfoUserJS
// Описание скрипта
// @description Юзерскрипт версия 1.4
// @author xz
// @license MIT
// @version 1.4
// Указываем что бы скрипт работал только на определенном сайте
// @include http://w*.wofh.ru/*
// @namespace https://greasyfork.org/users/5805
// @downloadURL https://update.greasyfork.org/scripts/5459/WofhSendInfoUserJS.user.js
// @updateURL https://update.greasyfork.org/scripts/5459/WofhSendInfoUserJS.meta.js
// ==/UserScript==
(function (window, undefined) {
    var w;
    if (typeof unsafeWindow != undefined) {
        w = unsafeWindow
    } else {
        w = window;
    }
    if (w.self != w.top) {
        return;
    }

    // Функция для установки Куки
    function setCookie(name, value, options) {
        options = options || {};
        var expires = options.expires;
        if (typeof expires == 'number' && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }
        value = encodeURIComponent(value);
        var updatedCookie = name + '=' + value;
        for (var propName in options) {
            updatedCookie += '; ' + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += '=' + propValue;
            }
        }
        document.cookie = updatedCookie;
    }

    // Функция для получения Куки
    function getCookie(name) {
        var matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '$1') + '=([^;]*)'));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    
    // Функция отправки инфы
    function SendInfo(mode, town, info) {
        // Собственно отправим инфу
        // Что бы видеть что отправляется (сам текст) можно раскоментить след. строку (т.е. убрать два слэша):
        // alert(send);
         console.log(info); 

        // Поставим куки, что бы каждую секунду инфу на сервер не слать, а с периодом в час
        setCookie('WofhUserJS' + mode + obj.town.id, 1, {
            expires: 3600
        });
        
        if (mode=='trade') {
            setCookie('WofhUserJStown' + obj.town.id, 1, {
                expires: 3600
            });
        }
        
        // выведем сообщение что данные отправлены
        jQuery('.m2').append('<script type="text/javascript">setTimeout(function(){$(".box11").fadeOut("slow")},2000);</script><span><div class="box11"><b><font color="red">Данные отправлены</font></b></div>');

        $.ajax({
            url: 'http://wofh.biz/citiesinsert.php',
            dataType: 'json',
            type: 'POST',
            data: info
        });
    }

    // Получаем HTML код текущей странички
    var n = jQuery('head').text();
    // Ищем общую инфу по городам и аккаунте:
    n = n.match('var servodata.*]}');
    c = n[0] + '}';
    c = c.replace('var servodata = ', '');
    var obj = jQuery.parseJSON(c);
    
    // Получаем HTML код 
    // Ищем инфу по торговле:
    var data = jQuery('body').text();
    var m = data.match('JSN.market.parseData.*}')

    if (m != null) {
        
        // Считаем Куки и проверим если час еще не прошел то выходим, иначе идем дальше
        // Инфа город + потоки
        if (getCookie('WofhUserJStrade' + obj.town.id) == 1) {
            return;            
        }    
        
        market = m[0];
   		var send = c + 'market' + market + '';
        
		SendInfo("trade", obj.town.id, send);
        
    } else {
        
        // Считаем Куки и проверим если час еще не прошел то выходим, иначе идем дальше
        // По городу инфа
        if (getCookie('WofhUserJStown' + obj.town.id) == 1) {
            return;
        } 
        
        SendInfo("town", obj.town.id, c);
        
    }

})(window);