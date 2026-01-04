// ==UserScript==
// @name         Custom summ on Steam
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Скрипт позволяет указать любую сумму при пополнении кошелька Steam
// @author       You
// @match        http://store.steampowered.com/steamaccount/addfunds
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30860/Custom%20summ%20on%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/30860/Custom%20summ%20on%20Steam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elems = document.getElementsByClassName("addfunds_area_purchase_game game_area_purchase_game");
    var newOne = elems[0].cloneNode(true);
    elems[0].parentNode.insertBefore(newOne, elems[0].parentNode.childNodes[0]);
    newOne.getElementsByTagName("p")[0].innerHTML = "Укажите любую сумму <sup>by JusteG</sup>";
    var inputHolder = newOne.getElementsByClassName("game_purchase_price price")[0];
    inputHolder.setAttribute("style", "padding: 0; margin: 0;");
    inputHolder.innerHTML = '<input type = "number" style = "margin: 0 auto; padding: 5px 15px; font: inherit; background-color: black; color: #b0aeac; border: none; width: 53px;">';
    var customInput = inputHolder.getElementsByTagName("input")[0];
    var actionBtn = inputHolder.parentNode.getElementsByTagName("a")[0];
    actionBtn.removeAttribute("href");
    actionBtn.addEventListener("click", function(){
        submitAddFunds(customInput.value * 100);
    });
    function onValueChange(){
        newOne.getElementsByTagName("h1")[0].innerText = "Добавить " + customInput.value + " pуб.";
    }
    customInput.addEventListener("change", onValueChange);
    customInput.addEventListener("keydown", onValueChange);
    customInput.addEventListener("keyup", onValueChange);
    customInput.value = "1000";
    onValueChange();
})();