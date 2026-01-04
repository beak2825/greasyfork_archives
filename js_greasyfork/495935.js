// ==UserScript==
// @name         在洛谷显示CF difficulty
// @namespace    http://tampermonkey.net/
// @version      2024.7.10.1
// @description  CF difficulty
// @author       AbsMatt
// @match        https://www.luogu.com.cn/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495935/%E5%9C%A8%E6%B4%9B%E8%B0%B7%E6%98%BE%E7%A4%BACF%20difficulty.user.js
// @updateURL https://update.greasyfork.org/scripts/495935/%E5%9C%A8%E6%B4%9B%E8%B0%B7%E6%98%BE%E7%A4%BACF%20difficulty.meta.js
// ==/UserScript==

async function GetDif(CFurl) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: CFurl,
            timeout: 5000,
            onload: function(response) {
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(response.responseText, 'text/html');
                let SidebarName = 0;
                for (let i = 1; i <= 20; i++) {
                    const title = htmlDoc.querySelector("#sidebar > div:nth-child(" + i + ") > div.caption.titled");
                    if(!title){continue;}
                    for(let j=0;j<title.textContent.length-1;j++){
                        if (title.textContent[j] === 'P' && title.textContent[j+1] === 'r') {
                            SidebarName = i;
                            break;
                        }
                        if(!(SidebarName === 0))break;
                    }
                }
                if (SidebarName === 0) {
                    reject("Sidebar not found");
                    return;
                }
                for (let i = 1; i <= 10; i++) {
                    const titleElement = htmlDoc.querySelector("#sidebar > div:nth-child(" + SidebarName + ") > div:nth-child(2) > div:nth-child(" + i + ") > span");
                    if (titleElement) {
                        const Tag = titleElement.textContent;
                        let sdif = "";
                        let FLAG = 0;
                        for (let x = 0; x < Tag.length; x++) {
                            if (Tag[x] >= '0' && Tag[x] <= '9') {
                                sdif += Tag[x];
                            }
                            if(Tag[x]=='*')FLAG=1;
                        }
                        if ((!(sdif === ""))&&FLAG) {
                            console.log(sdif);
                            resolve('*' + sdif);
                        }
                    } else {
                        reject("Title element not found");
                    }
                }
            },
            onerror: function(error) {
                reject('Network error: ' + error);
            },
            ontimeout: function() {
                console.error('Request timed out');
                reject('Request timed out');
            }
        });
    });
}

let boolArray = new Array(52).fill(false);
async function processRow(i, retryCount = 0) {
    if (boolArray[i]) return;
    const j = document.querySelector(`#app > div.main-container > main > div > div.card.padding-default > div > div.border.table > div.row-wrap > div:nth-child(${i}) > div.progress`);
    while (j.firstChild) {
        j.removeChild(j.firstChild);
    }
    const newdiv = document.createElement("div");
    const name = document.querySelector(`#app > div.main-container > main > div > div.card.padding-default > div > div.border.table > div.row-wrap > div:nth-child(${i}) > span:nth-child(2)`).textContent;
    const colorname = document.querySelector(`#app > div.main-container > main > div > div.card.padding-default > div > div.border.table > div.row-wrap > div:nth-child(${i}) > div.difficulty > a > span`);
    const computedStyle = window.getComputedStyle(colorname);
    const backcolor = computedStyle.backgroundColor;
    newdiv.style.fontWeight = "bold";
    newdiv.style.color="lightblue";
    newdiv.innerHTML="Waiting";
    j.appendChild(newdiv);
    if (name.startsWith('CF')) {
        const [_, x, ord] = name.match(/CF(\d+)(\w+)/);
        const url = `https://codeforces.com/problemset/problem/${x}/${ord}`;
        try {
            const sdif = await GetDif(url);
            newdiv.innerHTML = sdif;
            newdiv.style.color = backcolor;
            boolArray[i] = true; // Mark as processed
        } catch (error) {
            setTimeout(() => processRow(i, retryCount + 1), 1000); // Retry after 2 seconds
        }
    } else {
        boolArray[i] = true; // Mark non-CF as processed
        newdiv.innerHTML = "";
        newdiv.style.color = backcolor;
    }
}

(async function() {
    console.log('start');
    const place = document.querySelector("#app > div.main-container > main > div > div.card.padding-default > div > div.border.table > div.header-wrap > div > div.progress > span");
    place.innerHTML = "CF难度";
    const container = document.querySelector("#app > div.main-container > main > div > div.card.padding-default > div > div.border.table > div.row-wrap");
    const rows = container.children.length;
    const promises = [];
    // alert(rows);
    for(let k=1;k<=20;k++){
        let tim=15000;
        if(k>2)tim=3000;
        if(k>10)tim=30000;
        console.log("k = "+k);
        for (let i = 1; i<=rows; i++) {
            if (boolArray[i]) {
                console.log(i + " already processed");
                continue;
            }
            promises.push(processRow(i));
        }
        let timeoutPromise = new Promise(resolve => setTimeout(resolve, tim, 'timeout'));

        // 使用 Promise.race 等待 promises 数组或 timeoutPromise 其中之一先完成
        await Promise.race([
            Promise.allSettled(promises),
            timeoutPromise
        ]);
        promises.length=0;

        //ert("start2");
        console.log("start2");
        for (let i = rows/2; i<=rows; i++) {
            if (boolArray[i]) {
                console.log(i + " already processed");
                continue;
            }
            promises.push(processRow(i));
        }
        timeoutPromise = new Promise(resolve => setTimeout(resolve, tim, 'timeout'));

        // 使用 Promise.race 等待 promises 数组或 timeoutPromise 其中之一先完成
        await Promise.race([
            Promise.allSettled(promises),
            timeoutPromise
        ]);
        promises.length=0;
    }
})();