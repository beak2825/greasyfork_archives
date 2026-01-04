// ==UserScript==
// @name         规范tophonetics音标
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  将tophonetics网站上美式音标符号替换为牛津网站上的音标符号 https://www.oxfordlearnersdictionaries.com/definition/english/
// @author       Juliet
// @match        https://tophonetics.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tophonetics.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463879/%E8%A7%84%E8%8C%83tophonetics%E9%9F%B3%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/463879/%E8%A7%84%E8%8C%83tophonetics%E9%9F%B3%E6%A0%87.meta.js
// ==/UserScript==

(function() {
//对于tophonetics网站

    'use strict';
    //oʊ替换为əʊ
    let oʊ = document.getElementById("transcr_output").innerHTML;
    document.getElementById("transcr_output").innerHTML = oʊ.replace(/oʊ/g, "əʊ");

    //ɜr替换为ər
    let ɜr = document.getElementById("transcr_output").innerHTML;
    document.getElementById("transcr_output").innerHTML = ɜr.replace(/ɜr/g, "ər");

    //ɜ替换为e
    let ɛ = document.getElementById("transcr_output").innerHTML;
    document.getElementById("transcr_output").innerHTML = ɛ.replace(/ɛ/g, "e");

    //ɪr替换为ɪər
    let ɪr = document.getElementById("transcr_output").innerHTML;
    document.getElementById("transcr_output").innerHTML = ɪr.replace(/ɪr/g, "ɪər");

    //er替换为eər
    let er = document.getElementById("transcr_output").innerHTML;
    document.getElementById("transcr_output").innerHTML = er.replace(/er/g, "eər");

    //jʊr替换为jʊər
    let jʊr = document.getElementById("transcr_output").innerHTML;
    document.getElementById("transcr_output").innerHTML = jʊr.replace(/jʊr/g, "jʊər");

    //ʧ替换为tʃ
    let ʧ = document.getElementById("transcr_output").innerHTML;
    document.getElementById("transcr_output").innerHTML = ʧ.replace(/ʧ/g, "tʃ");

})();