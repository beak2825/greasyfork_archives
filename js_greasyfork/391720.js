// ==UserScript==
// @name         Hellvetica VC
// @namespace    https://vc.ru
// @version      0.1
// @description  Hellvetica for vc.ru
// @author       Alex B, https://vk.com/alexbsoft
// @match        https://vc.ru/*
// @grant      GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/391720/Hellvetica%20VC.user.js
// @updateURL https://update.greasyfork.org/scripts/391720/Hellvetica%20VC.meta.js
// ==/UserScript==
(function() {
    //Добавляем шрифт в сайт и заменяем его для всего текста
    GM_addStyle ( `
@font-face {
  font-family: Hellvetica;
  src: local("Hellvetica"),
       local("Hellvetica"),
       url(https://pidor.men/css/Hellvetica.ttf);
  font-weight: 400;
}
body {
        font-family:    Hellvetica, sans-serif !important;
    }
` );
    //Заменяем лого после загрузки всего контента страницы
    setTimeout(replace_logo, 1000);
    function replace_logo(){
        var logo_a = document.getElementsByClassName("main_menu__logo")[0];
        logo_a.innerHTML='<img src="https://pidor.men/css/hell.svg">';
        console.log(logo_a)
    }
})();