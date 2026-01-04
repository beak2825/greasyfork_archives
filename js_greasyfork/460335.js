// ==UserScript==
// @name         Russian DALL-e parameters keeper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Saves and loads parameters for Kandinsky 2.0 of Russian DALL-e
// @author       You
// @match        https://rudalle.ru/kandinsky2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rudalle.ru
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/460335/Russian%20DALL-e%20parameters%20keeper.user.js
// @updateURL https://update.greasyfork.org/scripts/460335/Russian%20DALL-e%20parameters%20keeper.meta.js
// ==/UserScript==

(function() {

    function GM_wait() {
        if (typeof vt === 'undefined') {
            window.setTimeout(GM_wait, 100);
        }
        else {
            doJob();
        }
    }

    function loadJquery() {
        // Check if jQuery's loaded

        if (typeof vt === 'undefined') {
            var GM_JQ = document.createElement('script');
            GM_JQ.src = 'https://cdn.jsdelivr.net/gh/mehmetemineker/vanilla-toast/lib/vanilla-toast.min.js';
            GM_JQ.type = 'text/javascript';
            document.getElementsByTagName('head')[0].appendChild(GM_JQ);
            GM_wait();
        } else {
            doJob();
        }
    }

    loadJquery();


    function doJob() {
        vt.info("Для сохранения параметров нажмите Alt+Q, для их загрузки нажмите Alt+A, для очистки нажмите Alt+Z.", {duration: 3000});
        if (GM_getValue("image_resolution") !== undefined)
        {
            onAltA();
        }
        document.addEventListener('keydown', onKeydown, true);
    }


    function calcRT (text)
    {
        const wordsPerMinute = 200; // Average case.
        const wordsPerSecond = wordsPerMinute / 60;
        let result;

        let textLength = text.split(" ").length; // Split by words
        if(textLength > 0){
            let value = Math.ceil(textLength / wordsPerSecond);
            result = value;
        }
        return result;
    }

    function onAltQ() {
        var res = document.getElementById("id_img_res").value;
        var style = document.getElementById("id_img_style").value;
        var text = document.getElementById("id_text").value;
        GM_setValue("image_resolution", res);
        GM_setValue("image_style", style);
        GM_setValue("image_text", text);
        vt.success("Сохранено разрешение " + res + ", стиль '" + style + "' и текст '" + text + "'" , {duration: (2500+calcRT(text)*1000)});
        // document.getElementById("id_img_res").value="512x512"
        //vt.info();
    }

    function onAltA() {
        if (GM_getValue("image_resolution") !== undefined)
        {
            var res = GM_getValue("image_resolution");
            var style = GM_getValue("image_style");
            var text = GM_getValue("image_text");
            document.getElementById("id_img_res").value = res;
            document.getElementById("id_img_style").value = style;
            document.getElementById("id_text").value = text;
            document.getElementById("id_captcha_1").focus();
            vt.success("Загружено разрешение, стиль и текст для картинки.", {duration: 1500});
        } else {
            vt.warn("Нет сохраненных настроек для загрузки.");
        }

    }

    function onAltZ()
    {
        if (GM_getValue("image_resolution") !== undefined)
        {
            GM.deleteValue("image_resolution");
            GM.deleteValue("image_style");
            GM.deleteValue("image_text");
            vt.success("Сохраненные настройки очищены.", {duration: 1500});
            document.getElementById("id_text").focus();
        } else {
            vt.warn("Нет сохраненных настроек для очистки.");
        }
    }

    function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        if (evt.altKey && evt.keyCode == 81) {
            onAltQ();
        }
        if (evt.altKey && evt.keyCode == 65) {
            onAltA();
        }
        if (evt.altKey && evt.keyCode == 90) {
            onAltZ();
        }
    }


})();