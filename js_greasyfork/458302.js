// ==UserScript==
// @name         儿子群词条自动更新脚本
// @namespace    https://xypp.cc/wordPicker/
// @version      1.2.1
// @description  儿子群词条提取器脚本
// @author       小鱼飘飘
// @match        https://gartic.io/*
// @grant        GM_xmlhttpRequest
// @connect      xypp.cc
// @downloadURL https://update.greasyfork.org/scripts/458302/%E5%84%BF%E5%AD%90%E7%BE%A4%E8%AF%8D%E6%9D%A1%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/458302/%E5%84%BF%E5%AD%90%E7%BE%A4%E8%AF%8D%E6%9D%A1%E8%87%AA%E5%8A%A8%E6%9B%B4%E6%96%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
const setNativeValue = (element, value) => {
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(element, value);
    } else {
        valueSetter.call(element, value);
    }
    element.dispatchEvent(new Event('input', { bubbles: true }));
};

var btn = null;

async function delay(del) {
    return new Promise(function (s) { setTimeout(s, del); });
}
async function getData() {
    return new Promise(function (s, e) {
        GM_xmlhttpRequest({
            url: "https://xypp.cc/wordPicker?api=list",
            method: "GET",
            onload: function (xhr) {
                var data = JSON.parse(xhr.responseText);
                s(data);
            }, onerror: e
        });
    })
}
async function updateStart() {
    btn.innerText = "下载中";

    let data = await getData();
    let mpFlg = {};
    data.forEach(element => {
        mpFlg[element.toUpperCase()] = 1;
    });
    let existed = document.body.querySelectorAll(".contentWords .words .word");
    for (let i = 0; i < existed.length; i++) {
        btn.innerText = `删除词检测[${i}/${existed.length}]`;
        if (mpFlg[existed[i].innerText.toUpperCase()]) {
            mpFlg[existed[i].innerText.toUpperCase()] = 2;
        } else {
            existed[i].querySelector(".del").click();
            await delay(150);
        }
    }
    var iptEl = document.body.querySelector(".globalSettings form label.text input");
    var btEl = document.body.querySelector(".globalSettings form label.btAdd input.btAdd");
    for (let i = 0; i < data.length; i++) {
        btn.innerText = `新词更新[${i}/${data.length}]`;
        if (mpFlg[data[i]] != 1) continue;
        setNativeValue(iptEl, data[i]);
        await delay(150);
        btEl.click();
        await delay(150);
    }
    btn.innerText = "从儿子群词库更新";
}
setTimeout(function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var MutationObserverConfig = {
        childList: true,
        subtree: true,
        characterData: true
    };
    var observer = new MutationObserver(function (mutations) {
        setTimeout(function () {
            if (document.getElementsByTagName("h2")[0].innerText.includes("主题编辑器")
                && (!document.querySelector("#btn_sonswordpicker"))) {
                btn = document.createElement("button");
                btn.className = "btBlueBig";
                btn.innerText = "从儿子群词库更新";
                btn.id = "btn_sonswordpicker";
                btn.setAttribute("style", `font-weight: bold;padding-left: 10px;`);
                btn.onclick = updateStart;
                document.body.querySelector(".actions.themeMobile").appendChild(btn);
            }
        }, 4000);
    });
    observer.observe(document.body.querySelector("#content"), MutationObserverConfig);
}, 4000);