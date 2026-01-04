// ==UserScript==
// @name         规范牛津词典音标
// @namespace    http://tampermonkey.net/
// @version      0.3
// @versiondescription       增加了牛津美式中/y/替换为/j/
// @description  牛津词典中音标修改为标准样式
// @author       Juliet
// @match        https://www.oxfordlearnersdictionaries.com/definition/english/*
// @match        https://www.oxfordlearnersdictionaries.com/definition/american_english/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oxfordlearnersdictionaries.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463391/%E8%A7%84%E8%8C%83%E7%89%9B%E6%B4%A5%E8%AF%8D%E5%85%B8%E9%9F%B3%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/463391/%E8%A7%84%E8%8C%83%E7%89%9B%E6%B4%A5%E8%AF%8D%E5%85%B8%E9%9F%B3%E6%A0%87.meta.js
// ==/UserScript==



(function() {
    //对于English和American English均适用

        'use strict';

        let regexs = [/ː/g, /ɜ/g,/t̮/g,/ɛr/g,/ɛ/g,/o/g,/ɪr/g,/ʊr/g,/y/g]
        let substitute = ["", "ə","t","er","e","ə","ɪr","ʊr","j"]

        let elements = document.getElementsByClassName("phon")

        for (let el of elements) {
            let ex
            regexs.forEach((item, index) => {
                ex = el.innerHTML.replace(item, substitute[index])
                if (el.innerHTML != ex) {
                    el.innerHTML = ex
                }
            })

        }

    })();