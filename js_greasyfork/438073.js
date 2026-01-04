// ==UserScript==
// @name         fava
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cate or overide
// @author       You
// @match        http://localhost:5000/**
// @icon         https://www.google.com/s2/favicons?domain=undefined.localhost
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438073/fava.user.js
// @updateURL https://update.greasyfork.org/scripts/438073/fava.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setTimeout(main, 500);
})();

(function () {
    handleRegx("n(s)a")
})();

function main() {
    let es = document.querySelectorAll("body > article > div > fava-journal > ol > .transaction > p");

    for (let ele of es) {
        // console.log(ele);
        ele.querySelector(".flag").append(createBtn(ele));
    }
}

function createBtn(ele) {
    let btn = document.createElement("div");
    btn.innerText = "[copy]";
    btn.style = `font-size:.30rem;color: blue;`;
    btn.onclick = function () {
        let txt = generateOverideRule(ele);
        navigator.clipboard.writeText(txt).then(r => toast("拷贝成功:\n" + txt, 1000));
    };
    return btn;
}

function generateOverideRule(ele) {
    console.log(ele);
    let time = ele.querySelector(".datecell").innerText;
    let payee = ele.querySelector(".description > .payee").innerText;
    let desc = ele.querySelector(".description ").innerText.replace(payee, "");
    let change = ele.querySelector(".change").innerText.replace(",", "").replace("CNY", "");

    if (payee.indexOf("拼多多") !== -1) {
        let txt = time + ",商品标题," + change;
        return txt;
    } else {
        let txt = time + " .*" + handleRegx(desc) + ".*";
        if (payee) {
            txt = txt + handleRegx(payee) + ".*";
        }
        txt = txt + ": None toWhich";

        // console.log(time);
        // console.log(desc);
        return txt;
    }
}

function handleRegx(text) {
    let rst = text.replace("(", "\\(").replace(")", "\\)").replace(/[\r\n]/g, "");
    // console.log(rst);
    return rst;
}

function toast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    let m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = `font-size: .32rem;
    color: rgb(255, 255, 255);
    background-color: rgba(0, 0, 0, 0.6);
    padding: 10px 15px;
    margin: 0 0 0 -60px;
    border-radius: 4px;
    position: fixed;
    top: 50%;
    left: 50%;
    width: 300px;
    text-align: center;`;
    document.body.appendChild(m);
    setTimeout(function () {
        let d = 0.5;
        m.style.opacity = '0';
        setTimeout(function () {
            document.body.removeChild(m)
        }, d * 1000);
    }, duration);
}