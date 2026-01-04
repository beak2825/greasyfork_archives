// ==UserScript==
// @name         market_selection_filter_advanced
// @namespace    http://tampermonkey.net/
// @version      0.6.7
// @description  Функционал на скринах. Добавляет фильтр при выборе артефакта на рынке. Пример: юзер пишет "лук" в специальное поле, в списке артефактов для выбора будут все доступные луки. Работает при выставлении нового лота и поиске артефакта
// @author       You
// @license      none
// @match        https://www.heroeswm.ru/auction*
// @match        https://my.lordswm.com/auction*
// @match        https://www.lordswm.com/auction*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487225/market_selection_filter_advanced.user.js
// @updateURL https://update.greasyfork.org/scripts/487225/market_selection_filter_advanced.meta.js
// ==/UserScript==
const redirectTo = "/auction.php";

function add_text_area(select, extra_function = () => { return false }) {
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
                select.size = 1;
                const selectElement = document.querySelector("#duration");
                selectElement.selectedIndex = 5;
                var event = new Event("change");
                selectElement.dispatchEvent(event);
                extra_function() || setTimeout(() => {
                    let count_el_input = document.querySelector("#anl_price");
                    const artCount = option.textContent.match(/\((\d+)/);
                    if (artCount) document.querySelector("#anl_count").value = artCount[1];
                    else document.querySelector("#anl_count").value = "1";
                    
                    count_el_input.value = "";
                    count_el_input.autocomplete = "off";
                    count_el_input.focus()
                }, 500)
            }
        });
        if (filteredOptions.length > 0) {
            filteredOptions[0].selected = true;
            if (filteredOptions.length == 1) {

                const selectElement = document.querySelector("#duration");
                selectElement.selectedIndex = 5;
                var event = new Event("change");
                selectElement.dispatchEvent(event);
                extra_function() || setTimeout(() => {
                    let count_el_input = document.querySelector("#anl_price");
                    const artCount = filteredOptions[0].textContent.match(/\((\d+)/);
                    if (artCount) document.querySelector("#anl_count").value = artCount[1];
                    else document.querySelector("#anl_count").value = "1";
                    count_el_input.value = "";
                    count_el_input.autocomplete = "off";
                    count_el_input.focus()
                }, 500)
            }
        }
        filteredOptions.forEach(option => select.add(option));
        let max_length = Math.min(filteredOptions.length, 20)
        select.size = textArea.value.length === 0 ? 1 : max_length;


    });

    select.parentNode.insertBefore(textArea, select);
    textArea.focus();
}
if (window.location.href.includes("auction_new_lot")) {
    add_text_area(document.getElementById("sel"));
    const cancelButton = document.querySelector("input[value='Отмена']");
    cancelButton && document.querySelector("#set_mobile_max_width > div:nth-child(2) > form > table > tbody > tr > td:nth-child(1) > input[type=submit]").focus();
    document.querySelector("#anl_count").value = "1";
    const selectElement = document.querySelector("#duration");
    selectElement.selectedIndex = 5;
    var event = new Event("change");
    selectElement.dispatchEvent(event);

} else if (location.href.includes("auction_accept_new_lot")) {
    location.href = location.origin + redirectTo;
} else if (location.pathname === "/auction.php" && location.search === "") {
    const button = document.querySelector("body > center > table:nth-child(2) > tbody > tr > td > table > tbody > tr:nth-child(2) > td.wblight > b > center > a");
    button && button.focus();
    //let el = document.querySelector('select[name="ss2"]')
    //add_text_area(el, window.findsel)
} 
// auction_buy_now

function arrEleInString(string, arr) {
    for (const ele of arr) {
        if (string.includes(ele)) return true;
    }
    return false;
}
document.querySelector("#mark_part > a").addEventListener("click", event => {
    setTimeout(() => {
        const div = document.querySelector("#mark_info_part");
        const allAs = div.querySelectorAll("a");
        const irrelevantAs = Array.from(allAs).filter(a => { return !a.textContent.toLowerCase().includes("магма") || arrEleInString(a.textContent.toLowerCase(), ["плащ", "щит", "сапоги", "кулон", "кинжал", "арбалет", "шлем", "меч"]) });
        for (const a of irrelevantAs) a.remove();
    }, 100);
})