// ==UserScript==
// @name         Technopat Sosyal UA
// @version      1.0
// @description  Sayfada Rusya veya Ukrayna ile ilgili bir sey gordugunde logoyu Ukrayna versiyonuyla degistirir.
// @author       Cinar Yilmaz <cinaryilmaz.gnu@gmail.com>
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @match        https://www.technopat.net/sosyal/*
// @icon         https://i.imgur.com/L7y6RQb.png
// @license      GPLv3
// @grant        none
// @namespace    tps-ua
// @downloadURL https://update.greasyfork.org/scripts/443885/Technopat%20Sosyal%20UA.user.js
// @updateURL https://update.greasyfork.org/scripts/443885/Technopat%20Sosyal%20UA.meta.js
// ==/UserScript==

const old_url = "/sosyal/styles/default/xenforo/technopat-logo.png";
const new_url = "https://i.imgur.com/FZJNW0l.png";
const searchfor = ["Rusya", "Ukrayna"];

for (let word in searchfor) {
    if ($("*:contains('"+word+"')").length > 0) {
        $(document).ready(function(){
            $("img[src='"+old_url+"']").attr("src", new_url);
        });
    }
}
// ==UserScript==