// ==UserScript==
// @name         Google翻译元件
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  在页面中插入Google 翻译元件。 无需离开页面，无需新增标签页即可进行全页翻译。
// @author       HWSH4
// @match        *://*/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/403501/Google%E7%BF%BB%E8%AF%91%E5%85%83%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/403501/Google%E7%BF%BB%E8%AF%91%E5%85%83%E4%BB%B6.meta.js
// ==/UserScript==

function modify_page(pagelanguage, includedlanguages) {
if (document.querySelector("#google_translate_element")) {
return false;
}
let url = "//translate.google.cn/translate_a/element.js?cb=googleTranslateElementInit";
let loc = new URL(window.location);
if (loc.protocol != "http:" && loc.protocol != "https:") {
url = "https:" + url;
}
let s = `function googleTranslateElementInit() {new google.translate.TranslateElement({pageLanguage: "${pagelanguage}", includedLanguages: "${includedlanguages}", layout: google.translate.TranslateElement.InlineLayout.SIMPLE, multilanguagePage: true,}, "google_translate_element" );}`;
let elem = document.createElement("script");
elem.setAttribute("id", "google_translate_element");
elem.appendChild(document.createTextNode(s));
document.body.appendChild(elem);
elem = document.createElement("script");
elem.setAttribute("src", url);
document.body.appendChild(elem);
return true;
}
true;