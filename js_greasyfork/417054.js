// ==UserScript==
// @name         Forexapi
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://forexapi.ru/ru/api/forex?key=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417054/Forexapi.user.js
// @updateURL https://update.greasyfork.org/scripts/417054/Forexapi.meta.js
// ==/UserScript==
var valu = "btcusd";//определение показателя для запроса информации
var beep = (function () {
    var ctxClass = window.audioContext ||window.AudioContext || window.AudioContext || window.webkitAudioContext
    var ctx = new ctxClass();
    return function (duration, type, finishedCallback) {

        duration = +duration;

        // Only 0-4 are valid types.
        type = (type % 5) || 0;

        if (typeof finishedCallback != "function") {
            finishedCallback = function () {};
        }

        var osc = ctx.createOscillator();

        osc.type = type;
        //osc.type = "sine";

        osc.connect(ctx.destination);
        if (osc.noteOn) osc.noteOn(0); // old browsers
        if (osc.start) osc.start(); // new browsers

        setTimeout(function () {
            if (osc.noteOff) osc.noteOff(0); // old browsers
            if (osc.stop) osc.stop(); // new browsers
            finishedCallback();
        }, duration);

    };
})();

setTimeout(function(){
   location.reload();
}, 5000);//функция запроса информации каждые 4 секунды

var valu1 = valu+"prev1" //формирования названия ключа для поиска предыдущего значения
var n1 = window.localStorage.getItem(valu1);//считывание предыдущего значения индекса
var n2 = parseFloat(n1);//форматирование в число предыдущего значения индекса
var skachok = parseInt(0.0005*n2); //определение существенного скачка показателя 0,15% от уровня предыдущего значения
window.console.log(skachok);//вывод на консоль информации об уровне скачка
var ke = valu + "prev2";//перенос предыдущего значения в пред-предыщущее для определения существенного скачка
localStorage.setItem(ke,n1);
window.console.log(n1);
var tex1 = window.document.querySelectorAll("pre")[0].firstChild.wholeText
var numbers = JSON.parse(tex1);
var num = numbers[valu];
var nu = num.bid;
var n = parseFloat(nu); // Теперь будет числом
if (n > n2+skachok) {
beep();
    alert("вверх!!!!!");

}
else if (n < n2-skachok) {
beep();
    alert("вниз!!!!");
};


window.console.log(typeof(n));
//alert(n); // 1
window.console.log(n);
//var tex = tex1[0].firstChild.wholeText
//[0].firstChild.wholeText
//window.console.log(window.document.querySelectorAll("pre")[0].firstChild.wholeText);
//alert(tex1);
window.console.log(typeof(nu));
window.console.log(nu);
ke = valu + "prev1"
localStorage.setItem(ke,nu);
n1 = localStorage.getItem(ke);
window.console.log(n1);