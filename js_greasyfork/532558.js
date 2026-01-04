// ==UserScript==
// @name         useless_buttons
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Удаляет при просмотре боя кнопку `вернуться назад` и  `вернуться на страницу героя`, в десктоп клиенте убирает кнопку `информация`
// @author       Something begins
// @license      University of Sugma
// @match       https://www.heroeswm.ru/war*
// @match       https://my.lordswm.com/war*
// @match       https://www.lordswm.com/war*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/532558/useless_buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/532558/useless_buttons.meta.js
// ==/UserScript==

function observeDisplay(el){
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "attributes" && mutation.attributeName === "style" && el.style.display !== "none") {
                el.style.display = "none";
            }
        }
    });
    observer.observe(el, {
        attributes: true,
        attributeFilter: ["style"]
    });

}
const mobileInterval = setInterval(() => {
    if ([typeof android, typeof iOS].includes("undefined")) return;
    clearInterval(mobileInterval);
    const selectors = ["back_to_game", "back_to_home"];
    if (!android && !iOS) selectors.push("info_on");
    const buttonsLoadedInterval = setInterval(()=>{

        selectors.forEach(selector=>{
            const el = document.querySelector("#"+selector);
            if (el) {
                el.style.display = "none";
                observeDisplay(el);
                clearInterval(buttonsLoadedInterval);
            }
        })
    }, 100);
}, 100);



