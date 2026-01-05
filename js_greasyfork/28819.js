// ==UserScript==
// @name         Raw text copier for TV programmes
// @namespace    https://tv.yandex.ru/
// @version      0.2
// @description  This is a script for Yandex TV and Mail.ru TV programmes that adds raw text for easier copying into any app as a plain text
// @author       Kenya-West
// @include      https://tv.mail.ru*
// @include      https://tv.yandex.ru*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28819/Raw%20text%20copier%20for%20TV%20programmes.user.js
// @updateURL https://update.greasyfork.org/scripts/28819/Raw%20text%20copier%20for%20TV%20programmes.meta.js
// ==/UserScript==

setInterval(function () {
    main()
}, 500)

function main() {
    let textarea;
    document.querySelector("#textarea__rawtext") ? textarea = document.querySelector("#textarea__rawtext") : textarea = createTextarea();
    textarea ? textarea.value = getInfo() : null;

    function createTextarea() {
        const textarea = document.createElement("textarea");
        textarea.id = "textarea__rawtext";
        textarea.classList = ["cols__column cols__column_small_14"];
        textarea.style.height = 300;
        const parent = document.querySelector(".cols__column_sidebar > .cols__inner");
        const ad = document.querySelector(".cols__column_sidebar > .cols__inner > .sticky-springs");
        if (ad && parent) document.querySelector(".cols__column_sidebar > .cols__inner").insertBefore(textarea, ad);
        return textarea;
    }

    function getInfo() {
        let rawText = "";
        document.querySelectorAll(".p-channels__items > .p-channels__item").forEach((element) => {
            rawText = rawText + element.querySelector(".p-channels__item__info .p-channels__item__info__title__link").innerText.replace(/LIVE$/gi, "") + "\n\n";
            element.querySelectorAll(".p-programms__items > .p-programms__item").forEach((item) => {
                let info = "";
                info = item.querySelector(".p-programms__item__time__value").innerText;
                info = info + " " + item.querySelector(".p-programms__item__name__link").innerText;
                rawText = rawText + info + "\n";
            });
            rawText = rawText + "\n\n";
        });
        return rawText;
    }
}
