// ==UserScript==
// @name           Multiple language filter for Google search
// @name:uk        Мовний фільтр для Google пошуку
// @description    Allows you to filter search results in multiple languages. Ukrainian and English are specified by default.
// @description:uk Дозволяє фільтрувати результати пошуку декількома мовами. За замовчуванням вказані Українська та Англійська.
// @namespace      multiple_language_filter_for_google_search
// @include        https://www.google.*/search*
// @author         flackseven
// @version        1.0
// @date           2021-01-04
//@icon            https://i.imgur.com/Q9Hzb39.png
// @downloadURL https://update.greasyfork.org/scripts/419636/Multiple%20language%20filter%20for%20Google%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/419636/Multiple%20language%20filter%20for%20Google%20search.meta.js
// ==/UserScript==

let settings=document.querySelector('#abar_button_opt');
let lr = document.createElement("lr");
lr.innerHTML = '<lr><a href="'+window.location.href.replace(/$/, '&lr=lang_uk|lang_en')+'"><img src="https://i.imgur.com/Q9Hzb39.png"/></a><a href="'+window.location.href.replace(/lr=lang_(.{1,16})/g, '')+'"><img src="https://i.imgur.com/CbSTgxL.png"/></a></lr>'
//Yoy can change lr parameter to another Search Language Codes:
//lang_af|lang_ar|lang_hy|lang_be|lang_bg|lang_ca|lang_zh-CN|lang_zh-TW|lang_hr|lang_cs|lang_da|lang_nl|lang_en|lang_eo|lang_et|lang_tl|lang_fi|lang_fr|lang_de|lang_el|lang_iw|lang_hi|
//|lang_hu|lang_is|lang_id|lang_it|lang_ja|lang_ko|lang_lv|lang_lt|lang_no|lang_fa|lang_pl|lang_pt|lang_ro|lang_sr|lang_sk|lang_sl|lang_es|lang_sw|lang_sv|lang_th|lang_tr|lang_uk|lang_vi
settings.parentNode.insertBefore(lr, settings);