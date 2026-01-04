// ==UserScript==
// @name           Spacom: подсчёт планет
// @version        1.00
// @namespace      Spacom
// @author         Agor71
// @description    Считается число планет в фильтре
// @include        http*://spacom.ru/?act=game/premium*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/30890/Spacom%3A%20%D0%BF%D0%BE%D0%B4%D1%81%D1%87%D1%91%D1%82%20%D0%BF%D0%BB%D0%B0%D0%BD%D0%B5%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/30890/Spacom%3A%20%D0%BF%D0%BE%D0%B4%D1%81%D1%87%D1%91%D1%82%20%D0%BF%D0%BB%D0%B0%D0%BD%D0%B5%D1%82.meta.js
// ==/UserScript==

var run = function() {
    var a = document.createElement('span');
    a.setAttribute( "id", "myspan" );
    var k;
    $('#buildPlanetFilter > input.btn-dark').click(function () {
        k = $('#buildPlanets > div').length;
        $('#myspan').text('('+k+')');
    });
    $('#buildPlanetFilter > input.btn-dark').after(a);
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);