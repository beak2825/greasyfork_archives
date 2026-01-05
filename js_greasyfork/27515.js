// ==UserScript==
// @name           Virtonomica: кнопка строительства
// @version        1.00
// @namespace      virtonomica
// @description    Добавляет кнопку строительства на все страницы Виртономики
// @include        http*://virtonomic*.*

// Убираем со страницы строительства, чтобы не конфликтовать с скриптом

// @exclude        http*://virtonomic*.*/*/create/*
// @downloadURL https://update.greasyfork.org/scripts/27515/Virtonomica%3A%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D1%81%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/27515/Virtonomica%3A%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D1%81%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%B0.meta.js
// ==/UserScript==

var run = function() {

    //Выцепляем реалм и номер компании из ссылки на дашборд
    var href12 = $('a.dashboard').attr('href');
    var companyNumber = href12.replace(/\D/g,'');
    var realmName = href12.split('main')[0];
    
   //Создаём элемент, добавляем ссылку на страницу строительства, размещаем в верхней панели
    var bldbtn = document.createElement('li');
    bldbtn.innerHTML = '<a href="'+realmName+'main/unit/create/'+companyNumber+'"><img src="/img/icon/unit_build.png" style="vertical-align:middle;" alt="Создать подразделение" title="Создать подразделение" height="20px"></a>';
    
    $('li.right').before(bldbtn);
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);