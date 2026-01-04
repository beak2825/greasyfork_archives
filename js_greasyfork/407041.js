// ==UserScript==
// @name         Shoptet "Stavy objednávek na více řádků"
// @namespace    mailto:azuzula.cz@gmail.com
// @version      1.32
// @description  Rozbalí všechny záložky stavů objednávek do více řádků.
// @author       Zuzana Nyiri
// @match        */admin/prehled-objednavek/*
// @match        */admin/prehlad-objednavok/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407041/Shoptet%20%22Stavy%20objedn%C3%A1vek%20na%20v%C3%ADce%20%C5%99%C3%A1dk%C5%AF%22.user.js
// @updateURL https://update.greasyfork.org/scripts/407041/Shoptet%20%22Stavy%20objedn%C3%A1vek%20na%20v%C3%ADce%20%C5%99%C3%A1dk%C5%AF%22.meta.js
// ==/UserScript==

(function() {
    var stavyObjednavek = document.getElementsByClassName('tabs')[0];
    if (stavyObjednavek != null){
        var listItems = stavyObjednavek.getElementsByTagName("li");

        stavyObjednavek.style.marginBottom = '4em'; // hodnota '4em' rozšíří klikatelnou oblast pro záložky na dva řádky. Pokud potřebujete víc řádků, přčtěte za každý řádek 2. Tedy '6em' pro tři řádky atd.
        for (var i = 0; i < listItems.length; i++)
        {
            if (listItems[i].className == "native-hidden")
            {
                listItems[i].className = "";
            }
            if (listItems[i].className == "active native-hidden")
            {
                listItems[i].className = "";
                listItems[i].style.fontWeight='bold';
            }
            if (listItems[i].className == "active")
            {
                listItems[i].className = "";
                listItems[i].style.fontWeight='bold';
            }
            if (listItems[i].className == "ui-state-default dropdown-handler active")
            {
                listItems[i].className = "";
            }
        }
    }
})();