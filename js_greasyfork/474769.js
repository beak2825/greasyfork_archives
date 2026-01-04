// ==UserScript==
// @name         全体のスタイルを表示設定に合わせる
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  小説家になろうのビュワ―全体のスタイルを表示設定に合わせる
// @author       You
// @match        https://ncode.syosetu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=syosetu.com
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/474769/%E5%85%A8%E4%BD%93%E3%81%AE%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB%E3%82%92%E8%A1%A8%E7%A4%BA%E8%A8%AD%E5%AE%9A%E3%81%AB%E5%90%88%E3%82%8F%E3%81%9B%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/474769/%E5%85%A8%E4%BD%93%E3%81%AE%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB%E3%82%92%E8%A1%A8%E7%A4%BA%E8%A8%AD%E5%AE%9A%E3%81%AB%E5%90%88%E3%82%8F%E3%81%9B%E3%82%8B.meta.js
// ==/UserScript==

setTimeout(function() {
    let radio_elem = document.getElementsByName('colorset');
    for(let i = 0; i < radio_elem.length; i++){
        //console.log(radio_elem[i].value);
        radio_elem[i].addEventListener("change", function(){
            //console.log(this.value);
            ColorSetting();
        }, false);
    }
    ColorSetting();
}, 10);

function ColorSetting() {
    let source_color = window.getComputedStyle(document.getElementById("novel_color")).color;
    let source_bgColor = window.getComputedStyle(document.getElementsByTagName("body")[0]).backgroundColor;

    let target_list = [
        "#novel_header",
        ".contents1",
        ".novelview_navi",
        ".wrap_menu_novelview_after",
        ".p-novelgood-form__intro",
        ".p-novelpoint-form",
        "#impression",
        "#novel_attention",
        "#review",
        "#footer",
        "#recommend",
        ".recommend_novel",
        ".reconovel_title",
        ".genre",
        "textarea"
    ];

    let query ="";
    for(let i in target_list){
        query += target_list[i] + ",";
    }
    query = query.slice(0, -1);

    let targets = document.querySelectorAll(query);
    for(let i in targets){
        if (targets.hasOwnProperty(i)) {
            targets[i].style.color = source_color;
            targets[i].style.background = source_bgColor;
        }
    }
}