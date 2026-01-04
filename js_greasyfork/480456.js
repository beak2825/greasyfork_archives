// ==UserScript==
// @name         Repair autofill
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Автозаполнение ремонта, запоминание ника, процента. `Передать` на кнопку энтер. Выставить дефолтный процент ремонта и клавишу для отправления в коде
// @author       Something begins
// @license     none
// @match       https://www.heroeswm.ru/art_transfer*
// @match       https://my.lordswm.com/art_transfer*
// @match       https://www.lordswm.com/art_transfer*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480456/Repair%20autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/480456/Repair%20autofill.meta.js
// ==/UserScript==
const sendKey = "Enter";
const defaultPercent = 101;
const defaultNickname = "";
const cost = 700;
const days = 0.05;
const battles = 1;
const allowRepair = true;
const nameInput = document.querySelector('input[placeholder="Введите имя героя"]');
const transferInput = document.querySelector("body > center > table:nth-child(2) > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(6) > td:nth-child(2) > input[type=radio]:nth-child(3)")
const costInput = document.querySelector("#gold");
const rentInput = document.querySelector("body > center > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(6) > td:nth-child(2) > input[type=radio]:nth-child(5)");
const repairInput = document.querySelector('input[onclick="show_arenda(5)"]');

const inputEvent = new Event('input', {
    bubbles: true,
    cancelable: true,
});
const clickEvent = new Event('click', {
    bubbles: true,
    cancelable: true,
});
let nick = localStorage.getItem("rent_autofill_nick");
if (!nick) {
    nick = defaultNickname;
    localStorage.setItem("rent_autofill_nick", nick);
}
nick = nick.replace("@", "").replace(",", "");
let percent = localStorage.getItem("rent_autofill_percent");
if (!percent) {
    percent = defaultPercent;
    localStorage.setItem("rent_autofill_percent", percent);
}
function sameNickOption(select, nick){
    for (const option of select){
        const optionNick = option.textContent.split("[")[0].trim();
        if (optionNick.toLowerCase() === nick.toLowerCase()) return option.value;
    }
    return nick;
}
function autoFillNick() {
    return new Promise((resolve) => {
        const select = document.getElementById("nick_select");
        setTimeout(() => {
            const instance = $(select).data("select2");
            if (instance) {
                instance.open();

                const nameInput2 = document.querySelector('input[placeholder="Введите имя героя"]');
                nameInput2.value = nick;

                const inputEvent = new Event("input", { bubbles: true });
                nameInput2.dispatchEvent(inputEvent);

                setTimeout(() => {
                    // если вписываемый ник и один из ников в дропдауне совпадают, получается ошибка и выбора не происходит
                    const selectValue = sameNickOption(document.querySelector("#nick_select"), nick);
                    select.value = nick;
                    $(select).trigger("change");
                    instance.close();
                    resolve();
                }, 300);
            } else {
                resolve();
            }
        }, 100);
    });
}


autoFillNick().then(() => {
    console.log("Now run next step...");
    percent = parseInt(percent);
    costInput.value = cost;
    repairInput.checked = true;
    repairInput.dispatchEvent(inputEvent);
    repairInput.dispatchEvent(clickEvent);
    setTimeout(fillRent, 100);

});

// селект не хочет меняться на копипасте
/* document.addEventListener("keyup", event =>{
    if (event.target.className !== "select2-search__field") return;
    const nameInput = document.querySelector('input[placeholder="Введите имя героя"]');
    const oldNick = nameInput.value;
    console.log(oldNick, "old");
    nameInput.value = oldNick.replace("@", "").replace(",", "");
    console.log(nameInput.value, "new")
    if (nameInput.value === oldNick) return;
    setTimeout(()=>{
        for (const option of document.querySelector("#nick_select").children){
            if (option.value !== oldNick) continue;
            option.value = nameInput.value;
            option.innerText = nameInput.value;
        }
    }, 1000)
    //nick_select
}) */
function fillRent(){
    document.querySelector("#ar > table > tbody > tr > td:nth-child(1) > input[type=text]").value = days;
    document.querySelector("#ar > table > tbody > tr > td:nth-child(3) > input[type=text]").value = battles;
    const allowRepairInput = document.querySelector("#ar > table > tbody > tr > td:nth-child(5) > input[type=checkbox]");
    if (allowRepair){
        const fullPrice = parseInt(document.querySelector("#rep > table.wb > tbody > tr:nth-child(6) > td:nth-child(4)").textContent.replace(/,/g, ""));
        const userPercent = localStorage.getItem("rent_autofill_checked") === "checked" ? percent : defaultPercent;
        const repairPrice = Math.round(fullPrice / 100 * userPercent);
        const percentInput = document.querySelector("#rep_price");
        percentInput.value = repairPrice;
        percentInput.dispatchEvent(inputEvent);
        percentInput.insertAdjacentHTML("afterend", `<input type="checkbox" id="remember_percent" ${localStorage.getItem("rent_autofill_checked")}>
<label for="remember_percent">Запомнить процент</label>`);
        monitorPercent();
    }
}
document.addEventListener("input", event => {
    if (event.target.placeholder && event.target.placeholder==="Введите имя героя"){
        localStorage.setItem("rent_autofill_nick", document.querySelector('input[placeholder="Введите имя героя"]').value)
    }
    if (event.target.id === "remember_percent"){
        console.log("checked");
        const checked = document.querySelector("#remember_percent").checked ? "checked" : "";
        localStorage.setItem("rent_autofill_checked", checked);
        const userPercent = document.getElementById('comiss2').textContent.split("%")[0].trim();
        localStorage.setItem("rent_autofill_percent", userPercent);
    }
})
document.addEventListener("keyup", event => {
    if (event.key === sendKey) document.querySelector("input[value='Передать']").click();
})
function monitorPercent() {
    const target = document.getElementById('comiss2');
    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                if (!document.querySelector("#remember_percent").checked) return;
                const userPercent = target.textContent.split("%")[0].trim();
                localStorage.setItem("rent_autofill_percent", userPercent);
            }
        }
    });

    const config = {
        childList: true,
        characterData: true,
        subtree: true
    };

    observer.observe(target, config);
}

