// ==UserScript==
// @name         CF 随机跳转题目
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  在 Codeforces 上随机跳题
// @author       AbsMatt
// @match        https://codeforces.com/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489623/CF%20%E9%9A%8F%E6%9C%BA%E8%B7%B3%E8%BD%AC%E9%A2%98%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/489623/CF%20%E9%9A%8F%E6%9C%BA%E8%B7%B3%E8%BD%AC%E9%A2%98%E7%9B%AE.meta.js
// ==/UserScript==
let l;
let r;
let siz=0;
let ntag=[];
function isLetter(char) {
    return /^[a-zA-Z]$/.test(char);
}
function makeRequest() {
    return new Promise((resolve, reject) => {
        const min = 1;
        const max = 1900;
        const com = Math.floor(Math.random() * (max - min + 1)) + min;

        const min1 = 1;
        const max1 = 7;
        const alpha = String.fromCharCode(65 + Math.floor(Math.random() * (max1 - min1 + 1)) + min1 - 1);

        // console.log(com);
        // console.log(alpha);
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://codeforces.com/problemset/problem/' + com + '/' + alpha,
            onload: function(response) {
                const URL = 'https://codeforces.com/problemset/problem/' + com + '/' + alpha;
                const parser = new DOMParser();
                const htmlDoc = parser.parseFromString(response.responseText, 'text/html');
                let SidebarName=0;
                for(let i=1;i<=20;i++){
                    const title=htmlDoc.querySelector("#sidebar > div:nth-child("+ i + ") > div.caption.titled");
                    if(title){
                        if(title.textContent[2]=="P"&&title.textContent[3]=="r"){SidebarName=i;break;}
                    }
                }
                console.log(URL);
                console.log(SidebarName);
                let flag = 0;
                if(siz===0)flag=1;
                for (let i = 1; i <=6; i++) {
                    const titleElement = htmlDoc.querySelector("#sidebar > div:nth-child("+ SidebarName +") > div:nth-child(2) > div:nth-child(" + i + ") > span");
                    // console.log(titleElement);
                    if (titleElement) {
                        let Tag = titleElement.textContent;
                        let tag="";
                        let sdif = "";
                        let dif = 0;
                        for(let x=0;x<Tag.length;x++){
                            if(isLetter(Tag[x])){tag=tag+Tag[x];}
                        }
                        tag=tag.toLowerCase();
                        for(let i=1;i<=siz;i++){
                            if(tag===ntag[i]){flag=1;break;}
                        }
                        for (let x = 0; x < Tag.length; x++) {
                            if (Tag[x] >= '0' && Tag[x] <= '9') {
                                sdif = sdif + Tag[x];
                            }
                        }
                        if (!(sdif === ""))dif = Number(sdif);
                        // console.log(sdif);
                        console.log(dif);
                        console.log("tag: "+tag);
                        // console.log("ntag "+ntag);
                        console.log(flag);
                        if (dif >= l && dif <= r && flag===1) {
                            window.open(URL,'_blank');
                            alert("found");
                            throw new Error('Program ended');
                        } else {
                            reject();
                        }
                    } else {
                        console.error('未找到指定元素');
                        reject();
                    }
                }
            },
            onerror: function(error) {
                console.log("sile");
                console.error('发生错误:', error);
                reject();
            }
        });
    });
}
function exjump() {
    let sl=prompt("请输入难度最小值：");
    l = Number(sl);
    let sr=prompt("请输入难度最大值：");
    r = Number(sr);
    let nntag=prompt("请输入想要的标签（没有则不输入），用英文逗号隔开");
    nntag=nntag.toLowerCase();
    console.log(nntag);
    let tmp="";
    for(let i=0;i<nntag.length;i++){
        if(nntag[i]!=',')tmp=tmp+nntag[i];
        if(nntag[i]==','||i==nntag.length-1){
            siz++;
            ntag[siz]=tmp;
            console.log(tmp);
            tmp="";
        }
    }
    let sequence = Promise.resolve();
    for (let i = 0; i< 10000; i++) {
        sequence = sequence.then(() => makeRequest()).catch(() => {});
    }
    // alert("无法找到");
}
(function() {
    'use strict';
    let pos = document.querySelector("#header");
    let butt = document.createElement('button');
    butt.innerText = '随机';
    butt.id = 'free';
    butt.className = 'btn btn-primary';
    butt.style.backgroundColor = '#60A5FA';
    butt.style.borderColor = '#60A5FA'; 
    butt.style.color = "white";
    butt.style.height="2.3em";
    pos.appendChild(butt);
    butt.addEventListener('click', function() {
        exjump();
    });
})();