// ==UserScript==
// @name         Выплаты Legend-game
// @name:en      Legend-game payouts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT 
// @description     Выводи бабосики!
// @description:en  Withdraw money
// @author       You
// @match        https://legends-game.fun/ru/pay-outs
// @icon         https://www.google.com/s2/favicons?sz=64&domain=legends-game.fun
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450148/%D0%92%D1%8B%D0%BF%D0%BB%D0%B0%D1%82%D1%8B%20Legend-game.user.js
// @updateURL https://update.greasyfork.org/scripts/450148/%D0%92%D1%8B%D0%BF%D0%BB%D0%B0%D1%82%D1%8B%20Legend-game.meta.js
// ==/UserScript==

$('#sender').val("P1070532192"); // Ставим свой Payeer
$('#amount').val("20");          // Ставим свою сумму на вывод

//document.querySelector("#dep-2").click();      // Выбор вывода на Qiwi (Надо менять кошелёк)
//document.querySelector("#dep-3").click();      // Выбор вывода на Y-money (Надо менять кошелёк)
//document.querySelector("#dep-4").click();      // Выбор вывода на Card MC/VISA (Надо менять кошелёк)

function whatDo(){

    document.querySelector(".user-page-btn-a").click(payout());  // Кликает на кнопку вывода
  };

function repeat(){
    setTimeout
    (
        function()
        {
             whatDo();
             repeat()
        },
        2000 // Задержка между кликами
    );
}

repeat();

setTimeout(function(){ location.reload(); }, 20*1000); // Перезагрузка страницы через 20 секунд