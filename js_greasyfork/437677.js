// ==UserScript==
// @name         刷题神器自动答题(网络题库版)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @license      AGPL-3.0
// @description  刷题神器答题脚本
// @match        *://www.shuatishenqi.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlhttpRequest
// @connect      *
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/437677/%E5%88%B7%E9%A2%98%E7%A5%9E%E5%99%A8%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%28%E7%BD%91%E7%BB%9C%E9%A2%98%E5%BA%93%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/437677/%E5%88%B7%E9%A2%98%E7%A5%9E%E5%99%A8%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%28%E7%BD%91%E7%BB%9C%E9%A2%98%E5%BA%93%E7%89%88%29.meta.js
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
    url: "https://note.youdao.com/yws/api/note/914fb78fcb453b7501f3bba257add2e8?sev=j1&editorType=1&unloginId=74814841-4f38-cb82-a76a-e445ec0d2091&editorVersion=new-json-editor&cstk=Rq5khe4P",
    onload: async function (address) {
        // JSON.stringify(字典); // 将字典转换为JSON字符串
        let text = JSON.parse(JSON.parse(address.response)["content"])["5"][0]["5"][0]["7"][0]["8"];
        let dict = JSON.parse(text);
        for (let i of Object.values(dict)) {
            let result = new Promise(resolve => {
                xmlHttpRequest({
                    method: "GET",
                    url: i,
                    onload: xhr => {
                        let root = document.createElement("root");
                        root.innerHTML = xhr.response;
                        console.log(root.querySelector("pre").innerText);
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
    try {
        let Atests = document.getElementsByClassName("Atest");
        for (let i = 0; i < Atests.length; i++) {
            let title = Atests[i].getElementsByClassName("test_title")[0].getElementsByTagName("span")[0].innerText.replace(/(\s+)/, "");
            let topic_title = "";
            let answer = "";
            let radioAs = Atests[i].getElementsByClassName("test_bot")[0].getElementsByClassName("radioA");
            for (let j = 0; j < topics.length; j++) {
                if (topics[j].indexOf("A、") !== -1) {
                    topic_title = topics[j].match(/([\u0000-\uffff]+)A、/)[1];
                } else {
                    continue;
                }
                try {
                    if (similar(topic_title.replaceAll(/[\s"]/g, ""), title.replaceAll(/[\s"]/g, "")) === 0) {
                        answer = topics[j].match(/答案：\s*([A-D]+)/)[1];
                        if (similar(topics[j].match(/A、([\u0000-\uffff]+)B、/)[1].replaceAll(/[\s"]/g, ""), Atests[i].getElementsByClassName("test_bot")[0].getElementsByTagName("dd")[0].getElementsByTagName("span")[1].innerText.replaceAll(/[\s"]/g, "")) +
                            similar(topics[j].match(/B、([\u0000-\uffff]+)C、/)[1].replaceAll(/[\s"]/g, ""), Atests[i].getElementsByClassName("test_bot")[0].getElementsByTagName("dd")[1].getElementsByTagName("span")[1].innerText.replaceAll(/[\s"]/g, "")) +
                            similar(topics[j].match(/C、([\u0000-\uffff]+)D、/)[1].replaceAll(/[\s"]/g, ""), Atests[i].getElementsByClassName("test_bot")[0].getElementsByTagName("dd")[2].getElementsByTagName("span")[1].innerText.replaceAll(/[\s"]/g, "")) +
                            similar(topics[j].match(/D、([\u0000-\uffff]+)答案/)[1].replaceAll(/[\s"]/g, ""), Atests[i].getElementsByClassName("test_bot")[0].getElementsByTagName("dd")[3].getElementsByTagName("span")[1].innerText.replaceAll(/[\s"]/g, "")) === 0
                        ) {
                            answer = topics[j].match(/答案：\s*([A-D]+)/)[1];
                            break;
                        }
                    }
                } catch (err) {
                    if (similar(topic_title, title) == 0) {
                        answer = topics[j].match(/答案：\s*([A-D]+)/)[1];
                        break;
                    }
                }
            }
            for (let a = 0; a < radioAs.length; a++) {
                if (answer.indexOf(radioAs[a].innerText) != -1) {
                    radioAs[a].style.boxShadow = "0 0 20px 5px deepskyblue";
                }
            }
        }
        setTimeout(runScript, 500);
    } catch (err) {
        setTimeout(runScript, 250);
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