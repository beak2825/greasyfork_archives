// ==UserScript==
// @name         HWM Hunting top
// @namespace    http://tampermonkey.net/
// @version      2023-12-19
// @description  Кнопка для просмотра своих охот и фильтр по названию существ
// @author       Tags
// @match https://www.heroeswm.ru/pl_hunter_stat.php?id=*
// @match        https://www.heroeswm.ru/pl_info.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482657/HWM%20Hunting%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/482657/HWM%20Hunting%20top.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(location.href.includes(`pl_info.php`)){
        const row = document.querySelectorAll(".wb[valign=middle]")[0].querySelectorAll("td[align=right]")[0];
        const loopa = row.querySelector("td");
        const img = document.createElement("td");
        const insertedElement = loopa.parentNode.insertBefore(img, loopa);
        let params = new URLSearchParams(location.search);
        let uid = params.get('id') // 'chrome-instant'
        insertedElement.innerHTML = `<a href="pl_hunter_stat.php?id=${uid}"><img class="show_hint" width="24" height="24" border="0" src="https://dcdn.heroeswm.ru/i/mobile_view/icons_add/lapa.png" hint="Достижения в охоте" align="right" hwm_hint_added="1"></a>`;
    }


    if(location.href.includes(`pl_hunter_stat.php`)){
        
        function filter(table){
            let input, filter, tr, td, i, txtValue;
            input = document.getElementById("creatureFilterInput");
            filter = input.value.toUpperCase();
            tr = table.getElementsByTagName("tr");

            for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[0];
                if (td) {
                    txtValue = td.textContent || td.innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                    }
                }
            }
        }
        const table = document.querySelector(`table`);

        const search = Object.assign(document.createElement("input"), {
            type: `text`,
            id:`creatureFilterInput`,
            placeholder:`Поиск по названию существа`,
            onchange:function(e){filter(table)},
            onkeyup:function(e){filter(table)}

        });
        
        table.parentNode.insertBefore(search, table);


    }
})();