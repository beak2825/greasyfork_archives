// ==UserScript==
// @name         百里半自动答题(网络题库版)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      AGPL-3.0
// @description  百里版答题脚本
// @include      http*://*edu.bailiban.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlhttpRequest
// @connect      *
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/437684/%E7%99%BE%E9%87%8C%E5%8D%8A%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%28%E7%BD%91%E7%BB%9C%E9%A2%98%E5%BA%93%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/437684/%E7%99%BE%E9%87%8C%E5%8D%8A%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%28%E7%BD%91%E7%BB%9C%E9%A2%98%E5%BA%93%E7%89%88%29.meta.js
// ==/UserScript==

function xmlHttpRequest(arrange) {
    if (GM_xmlhttpRequest !== undefined) {
        GM_xmlhttpRequest(arrange);
    } else {
        GM.xmlhttpRequest(arrange);
    }
}

let topics = [];
xmlHttpRequest({
    method: "GET",
    url: "https://note.youdao.com/yws/api/note/914fb78fcb453b7501f3bba257add2e8/WEBdb56d579c585f0e6844f8ee65e438545?sev=j1&editorType=1&unloginId=74814841-4f38-cb82-a76a-e445ec0d2091&editorVersion=new-json-editor&cstk=BM6Ezwfd",
    onload: async function (address) {
        // JSON.stringify(字典); // 将字典转换为JSON字符串
        let text = "";
        JSON.parse(JSON.parse(address.response)["content"])["5"].forEach(line => {
            try {
                text += line["5"]["0"]["7"]["0"]["8"];
            } catch {
                // 排除下标异常错误
            }
        });
        let dict = JSON.parse(text);
        for (let i of Object.values(dict)) {
            let result = new Promise(resolve => {
                xmlHttpRequest({
                    method: "GET",
                    url: i,
                    onload: xhr => {
                        let root = document.createElement("root");
                        root.innerHTML = xhr.response;
                        console.log();
                        resolve(root.querySelector("pre").innerText.split(/\n[0-9]+、/));
                    }
                });
            });
            topics = topics.concat(await result);
        }
        alert("共导入" + topics.length + "道题");
        runScript();
    }
});

function runScript() {
    function detectMobile() {
        return (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/Windows Phone/i) ||
            navigator.userAgent.match(/Symbian/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/hpwOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i));
    }

    let isPhone = Boolean(detectMobile());

    try {
        let title = document.querySelector("div.testContent div.ql-editor").innerText;    //  || document.querySelector("code.hljs").getAttribute("v-html")
        // document.querySelectorAll(".ql-editor.hljs.language-undefined")[3]
        for (let j = 0; j < topics.length; j++) {
            let topic_title
            if (topics[j].indexOf("A、") !== -1) topic_title = topics[j].match(/([\u0000-\uffff]+)A、/)[1]; else continue;
            if (similar(topic_title.replaceAll(/[\s"]/g, ""), title.replaceAll(/[\s"]/g, "")) === 0) {
                let selector = {
                    "A": topics[j].match(/A、([\u0000-\uffff]+)B、/)[1],
                    "B": topics[j].match(/B、([\u0000-\uffff]+)C、/)[1],
                    "C": topics[j].match(/C、([\u0000-\uffff]+)D、/)[1],
                    "D": topics[j].match(/D、([\u0000-\uffff]+)答案/)[1]
                };
                let answer = [];
                topics[j].match(/答案：\s*([A-D]+)/)[1].split("").forEach(index => answer.push(selector[index]));
                for (let i = 1; i <= 4; i++) {
                    for (let item of answer) {
                        try {
                            if (similar(item.replaceAll(/[\s"]/g, ""), document.querySelectorAll("div.testContent div[class$=-group]>label>span>p>span.ql-editor")[i].replaceAll(/[\s"]/g, "")) === 0) {
                                document.querySelectorAll("div.testContent div[class$=-group]>label>span")[i].style.color = "#0f0";
                            }
                        } catch {
                            // 排除 null 值错误
                        }
                    }
                }
            }
        }
        setTimeout(runScript, 500);
    } catch (err) {
        setTimeout(runScript, 400);
    }
}

function similar(self, other, offset = 3) {
    let maxlenght = self.length > other.length ? self.length : other.length, couont = 0;
    for (let i = 0; i < maxlenght; i++) {
        for (let j = i; j < i + offset; j++) {
            if (self[i] !== undefined && (self[i] === other[j] || self[j] === other[i])) {
                do {
                    couont++;
                    i++;
                    j++;
                } while (self[i] !== undefined && (self[i] === other[j] || self[j] === other[i]));
                break;
            }
        }
    }
    // 返回有多少个字符未匹配
    return maxlenght - couont;
}