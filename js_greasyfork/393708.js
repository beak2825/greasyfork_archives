// ==UserScript==
// @name     google translate element
// @version  1
// @grant    none
// @include  http://*
// @include  https://*
// @include  file://*
// @author   zupffwhy
// @homepageURL		https://addons.mozilla.org/firefox/user/12942033/
// @description:ja	Google Translate Elementを自動的にページに挿入する。ページを移動したり新しいタブを開いたりすることなくページ全体を翻訳する。ソースコードを編集して変数"includedlanguages"と"ignorelanguages"を適切に設定するとより便利に使える。
// @description:en	Automatically inserts Google Translate Element into the page. Translate the entire page without leaving page or opening a new tab. You can use it more conveniently by editing the source code and setting the variables "includedlanguages" and "ignorelanguages" appropriately.
// @icon	data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADm0lEQVRYha3XS2idRRTA8V9yU7H4IKLWF6IIPkAXanxg1YW4UxGkUFAs1bY0ira40IUFN1oQmxal4kLQhVALKojahVvxsRDpRlJrq0UXRUFrfTRqk5s0Ls4Z7tyv98YkzQeH72bOzPn+M+c1gdX4CW1M5XshMpXyJk7DoAU+RzB7inIi3/ekzaGFABQD7+IxPIVNlWzAQ1jTGN+MJ/AsJjCD0cUATCXEhj76C3EvVvbRL8fRtLFuMQDtXPwkhnEbRnArbsCu1P9R6W7CLbgSF6duFutPBWAN7hNHWU5lJvWTOXYipZ26j3EO/lwKgIfxgE5MlMDqJdP5/mQpAR7H+cLfW3L8LdyF+3E3XqnAduBGXITflwJgczW2NccOCx8TwbYvAX7Mv6V+SQA2YSAXjwi/z+IgrhX+Li5YlWtbIktqgAEsy/dc0hOAqGZEVpQP/l39fq36OFxQAZQ0nE81bBWQJsDplfFXRbQfz3lfVwaW504vrQA2ihMsun7SquycBFB2MIrvdEf/BD7ER8I1+/F9Qs7i5xw7gG/nkHG8JE+7GYRr8ZXulBvD3gbMUsjGGmAt7mxM+Ax3JNjZSX1MFKWZSuqmNKNTR6Yb84pMpe7lGmCdSKlxfC5yv9fzjU6V7NcV2330zUK2rQbYgjNxGc4VZflqnIcVokhdInzfC6AYfQHX4Dp8UZ1Er7ljKmPH8FtKKa3HRaerpWms3vmEqAvlWd/4YE+AN/oc01xH2JR2QrzfcNcKnRSte0sXAHGTGRVx8LzuYPoAj4qIHRWp1jRYYFeJ4nKz6BGwW6eD9gWonyt0++2Zhn5f46PlfVhkCuwRWTUggrl5oicBtERRKH1gupr0XM4ZTP3+hsGys505bxj/iosMnIEfGmt6nkCp39enslxKtubOhkXvP9AwVnJ+Ze74kRw/IvoEbG/A9nXBoKjju6oFE/gFv6bUEV0g9uo0l8tF8bodZ+XYiJMLVE+A0iYH8XaDtl/0z+LpXLdMp5m18nex+2Vlb84gHEiAGmIumcRVIj4eFDXkKP7CIeGGIRHMBXpOgAJRQLaJ/xnewXtpuN797mrdnh6Aq1M3rHN9L2v7AhSIXs94w8inIgNeFxeXUkOm8/d46nfq1JB5ARSIIeHbIeHTZhouRgrc/wLUIERgHdTdUqdEHEzqBFgt7YZ+Rue+uX2+AOXjxJ1gsTuv5R9x/5j3UwKzJf6P3CECdGwR8qK86PwHULYqSMjoGJwAAAAASUVORK5CYII=
// @namespace https://greasyfork.org/users/417745
// @description Google Translate Elementを自動的にページに挿入する。ページを移動したり新しいタブを開いたりすることなくページ全体を翻訳する。ソースコードを編集して変数"includedlanguages"と"ignorelanguages"を適切に設定するとより便利に使える。
// @downloadURL https://update.greasyfork.org/scripts/393708/google%20translate%20element.user.js
// @updateURL https://update.greasyfork.org/scripts/393708/google%20translate%20element.meta.js
// ==/UserScript==

// Specify a list of languages to translate to.
// If the string is empty, all languages, supported by Google Translate Element are displayed.
// Describe language codes separated by commas. Must not contain whitespace.
// The following URL is not a description of Google Translate Element, but many languages in Google Translate Element will be the same language code.
// https://cloud.google.com/translate/docs/languages
// let includedlanguages = "en,ja,zh-CN"; // Specify only English, Japanese, German, and Chinese (mandarin) as the target languages.
let includedlanguages = "";

// Specify a language (your native language) that is not automatically translated.
// let ignorelanguages = ["ja", "en"]; // Do not translate pages written in Japanese or English.
// let ignorelanguages = navigator.languages; // See https://developer.mozilla.org/docs/Web/API/NavigatorLanguage/languages
let ignorelanguages = [navigator.language]; // See https://developer.mozilla.org/docs/Web/API/NavigatorLanguage/language

// References
// How TO - Google Translate https://www.w3schools.com/howto/howto_google_translate.asp
// List of ISO 639-1 codes https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
// ISO 3166-1 https://en.wikipedia.org/wiki/ISO_3166-1


// Code
function modify_page(pagelanguage, includedlanguages) {
    if (document.querySelector("#google_translate_element")) {
    	return false;
    }
    let url = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
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
}

chrome.i18n.detectLanguage(document.body.innerText).then(langs => {
	//if (ignorelanguages.length === 0) {
  //  ignorelanguages = navigator.languages;
  //}
  if (langs.languages.length === 0 || ignorelanguages.indexOf(langs.languages[0].language) < 0) {
		modify_page("", includedlanguages);
  }
});
