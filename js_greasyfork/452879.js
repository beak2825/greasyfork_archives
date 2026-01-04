// ==UserScript==
// @name         NovelAII
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  get image from novalAI!
// @author       tumuyan
// @match        https://ai.nya.la/*
// @match        http://ai.nya.la/*
// @match        https://novelai.net/*
// @icon         https://novelai.net//icons/novelai-square.png
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/452879/NovelAII.user.js
// @updateURL https://update.greasyfork.org/scripts/452879/NovelAII.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let ins = document.createElement("div");
    ins.style.color = "#fff";
    ins.style.padding = "10px";

    let a = document.createElement("a");
    a.innerText = "Get Image from API";
    a.style.color = "#fff";
    a.style.padding = "10px";

    let key = GM_getValue("key", "token");
    let token = document.createElement("input");
    token.value = key;
    token.placeholder = "Paste your token here."
    token.type = "password";

    ins.appendChild(a);
    ins.appendChild(token);

    a.onclick = function () {

        let input = document.querySelector("#prompt-input-0");
        if (input.value.replace(/[\s,]/g, "").length < 1) {
            alert("empty input");
        } else {
            key = token.value.replace("token:", "");
            GM_setValue('key', key);

            let shape = document.querySelectorAll("div[class*='singleValue']")[1].innerText.replace(/\(.+/g, "").replace(/\s/g, "");
            let model = document.querySelectorAll("div[class*='singleValue']")[0].innerText;
            let scale = document.querySelector("input[max='100']").value;
            let uc = document.querySelector("textarea").value;
            let seed = document.querySelector("input[placeholder='Enter your image seed here.']").value;

            let url = "http://91.217.139.190:5010/got_image?token=" + key + "&shape=" + shape + "&tags=" + input.value;

            if (model.includes("Full")) {
                url += "&r18=1";
            }

            if (scale != 12) {
                url = url + "&scale=" + scale;
            }

            if (uc.replace(/[\s,]/g, "").length > 0) {
                url = url + "&ntags=" + uc;
            }

            if (seed > 0) {
                url = url + "&seed=" + seed;
            }


            window.open(url, "", "");
        }
    };


    let main_div = document.querySelector('#__next');
    main_div.parentElement.insertBefore(ins, main_div);

})();