// ==UserScript==
// @name         Nefty Авто Покупка(Без кнопки)
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Покупает сразу после загрузки страницы
// @author       0xDeadOS
// @match        *://*/*
// @grant        none
// @run-at      document-onload
// @downloadURL https://update.greasyfork.org/scripts/437939/Nefty%20%D0%90%D0%B2%D1%82%D0%BE%20%D0%9F%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%28%D0%91%D0%B5%D0%B7%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/437939/Nefty%20%D0%90%D0%B2%D1%82%D0%BE%20%D0%9F%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%28%D0%91%D0%B5%D0%B7%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%29.meta.js
// ==/UserScript==
window.onload =(function () {
    var boolOnCheck = false;
    //Капчи
    setTimeout(function() {
        try {
            console.log("Пробуем нажать на re капчу");
            document.getElementsByClassName("recaptcha-checkbox-checkmark")[0].click();
        }
        catch (e){
            console.error("Не получилось нажать на re капчу"+ e);
        }
        try {
            console.log("Пробуем нажать на google капчу");
            document.getElementsByClassName("rc-button goog-inline-block")[0].click();
        }
        catch (e){
            console.error("Не получилось нажать на google капчу"+ e);
        }
    },62);             
    var StartBuy = function()
    {
        (function Buying()
        {
            //Проверка на галочку в "Skip purchase confirmation"
            if(boolOnCheck == false){
                try {
                        for (let index = 0; index < document.getElementsByTagName("input").length; index++) {
                            if(document.getElementsByTagName("input")[index].checked == false && document.getElementsByTagName("input")[index].type == "checkbox"){
                                document.getElementsByTagName("input")[index].click();
                                boolOnCheck = true;
                                console.log("Поставил галочку");
                            }
                            if(document.getElementsByTagName("input")[index].checked == true)
                            {
                                boolOnCheck = true;
                            }
                        }
                    }                
                catch(e){
                    console.error(e)
                }
            }
            try {
            console.log(document.getElementsByClassName("v-btn v-btn--block")[0].innerHTML)
            }
            catch{}
            try {
                if(document.getElementsByClassName("v-btn v-btn--block")[0].disabled != true)
                {
                    document.getElementsByClassName("v-btn v-btn--block")[0].click(); //buy bytton
                    console.log('Кнопка купить нажата.');
                    return 0;
                }
            }
            catch{
                console.log("Кнопка покупки не найдена.");
            }
            setTimeout(Buying, 5);
        })();
    };
    setTimeout(StartBuy, 5);
})();