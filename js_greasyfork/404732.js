// ==UserScript==
// @name         Grumpy Wise King autofill
// @namespace    http://tampermonkey.net/
// @version      2021.01.30
// @description  Auto selects the avatar question in Grumpy King
// @match        *://www.neopets.com/medieval/wiseking.phtml
// @match        *://www.neopets.com/medieval/grumpyking.phtml
// @downloadURL https://update.greasyfork.org/scripts/404732/Grumpy%20Wise%20King%20autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/404732/Grumpy%20Wise%20King%20autofill.meta.js
// ==/UserScript==

const $form = $("form[name='form']");

$form.before(`<p style="font-weight:bold; color:green; text-align:center;">Auto-filled by userscript!<br>Also hi, r/neopets discord :)</p>`).find("select").each(function (index, element) {
    const numOptions = $(element).find("option").length;
    const random = Math.floor(Math.random() * (numOptions - 1)) + 1;
    $(element).find("option").eq(random).prop("selected", true);
});

if (document.URL.includes("grumpyking")) {
    //["What", "do", "you do if", "*Leave blank*", "fierce", "Peophins", "*Leave blank*", "has eaten too much", "*Leave blank*", "tin of olives"];
    const avOptions = [3, 8, 6, 1, 39, 118, 1, 32, 1, 143];
    for (let i = 0; i < 10; i++) {
        $(`#qp${i + 1} option`).eq(avOptions[i]).prop("selected", true);
    }
}