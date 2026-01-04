// ==UserScript==
// @name         FlippingPhotoWheelVK
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Добавляет листание фото в ВК колёсиком мыши
// @author       Xeleos vk.com/xeleos
// @match        https://vk.com/*
// @downloadURL https://update.greasyfork.org/scripts/389547/FlippingPhotoWheelVK.user.js
// @updateURL https://update.greasyfork.org/scripts/389547/FlippingPhotoWheelVK.meta.js
// ==/UserScript==

(function (window, undefined) {
    if (!window.location.href.match("vk.com")) {
        return
    }

    /*
      1000 - 1 секунда
      скорость следующего срабатывания прокрутки.
      Если хотите, чтобы срабатывало всегда - установите значение 0
      Если у вас глючит колёсико мыши и срабатывает случайно - ставьте значение 200 и случайных срабатываний будет меньше
    */
    var limitSwitchingSpeed = 0;
    var lastDateSwitching = Date.now;
    if (window.addEventListener) {
        if ('onwheel' in document) {
            // IE9+, FF17+, Ch31+
            window.addEventListener("wheel", onWheel);
        } else if ('onmousewheel' in document) {
            // устаревший вариант события
            window.addEventListener("mousewheel", onWheel);
        } else {
            // Firefox < 17
            window.addEventListener("MozMousePixelScroll", onWheel);
        }
    } else { // IE8-
        window.attachEvent("onmousewheel", onWheel);
    }

    function onWheel(e) {
        if(typeof Photoview === 'undefined')
        {
            return;
        }

        e = e || window.event;
        // wheelDelta не даёт возможность узнать количество пикселей
        var delta = e.deltaY || e.detail || e.wheelDelta;
        if(limitSwitchingSpeed !== 0) {
            if((lastDateSwitching + limitSwitchingSpeed) > Date.now()) {
                return;
            }
            else {
                lastDateSwitching = Date.now();
            }
        }
        if(delta<0)
        {
            cur.pvClicked = true; Photoview.show(false, cur.pvIndex - 1, null);
        }
        else
        {
            cur.pvClicked = true; Photoview.show(false, cur.pvIndex + 1, null);
        }
    }
})(window);