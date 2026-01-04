// ==UserScript==
// @name         market_selection_filter
// @namespace    http://tampermonkey.net/
// @version      0.6.6
// @description  Функционал на скринах. Добавляет фильтр при выборе артефакта на рынке. Пример: юзер пишет "лук" в специальное поле, в списке артефактов для выбора будут все доступные луки. Работает при выставлении нового лота и поиске артефакта
// @author       You
// @license      none
// @match        https://www.heroeswm.ru/auction*
// @match        https://my.lordswm.com/auction*
// @match        https://www.lordswm.com/auction*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463066/market_selection_filter.user.js
// @updateURL https://update.greasyfork.org/scripts/463066/market_selection_filter.meta.js
// ==/UserScript==

function add_text_area(select, extra_function = () =>{return false}) {
    const options = select.options;
    let filteredOptions = [...options];

    const textArea = document.createElement("textarea");
    textArea.style.maxWidth = "90%";
    textArea.placeholder = "Ввести лот для поиска:";
    textArea.addEventListener("input", () => {
        [...options].forEach(option => option.style.display = "block");
        const filterValue = textArea.value.trim().toLowerCase();
        filteredOptions = [...options].filter(option => option.textContent.toLowerCase().includes(filterValue));
        [...options].forEach(option => {
            if (!filteredOptions.includes(option)) option.style.display = "none";
            option.onclick = () => {
            select.dispatchEvent(new Event("change"));
                select.size = 1
            }
        });
        if (filteredOptions.length > 0) {
            filteredOptions[0].selected = true;
            if (filteredOptions.length == 1){
                extra_function() || setTimeout(()=>{let count_el_input = document.getElementById("anl_count");
                count_el_input.value = ""; count_el_input.focus()
                }, 500)
            }
        }
        filteredOptions.forEach(option => select.add(option));
        let max_length = Math.min(filteredOptions.length, 20)
        select.size = textArea.value.length === 0 ? 1 :max_length;

    });

    select.parentNode.insertBefore(textArea, select);
}
if (window.location.href.includes("auction_new_lot")){
    add_text_area(document.getElementById("sel"))
}
else{
    let el = document.querySelector('select[name="ss2"]')
    add_text_area(el, window.findsel)
}

