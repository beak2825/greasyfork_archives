// ==UserScript==
// @name         Content Menu for ituring
// @namespace    http://tampermonkey.net/book/*
// @version      0.1
// @description  javascript
// @author       Sage Kwun
// @match        https://www.ituring.com.cn/book/*
// @grant        BSD
// @downloadURL https://update.greasyfork.org/scripts/423495/Content%20Menu%20for%20ituring.user.js
// @updateURL https://update.greasyfork.org/scripts/423495/Content%20Menu%20for%20ituring.meta.js
// ==/UserScript==
try{
    const article = document.querySelector("#article");
    // 总列表
    let contentMenu = document.createElement("ul");
    // h2的子列表
    let h2Ul = document.createElement("ul");

    // 遍历子结点
    for (let i=0;i < article.children.length;i++) {
        let child = article.children[i];
        if (child.tagName === "H2") {
            // 添加id
            child.id = child.innerText;
            // 添加h2Ul到总列表
            contentMenu.append(h2Ul);
            // 清空h2Ul
            h2Ul = document.createElement("ul");
            // 添加h2Li
            let h2Li = document.createElement("li");
            let h2A = document.createElement("a");
            h2A.href = "#" + child.innerText;
            h2A.innerText = child.innerText;
            h2Li.append(h2A);
            contentMenu.append(h2Li);
        } else if (child.tagName === "H3") {
            // 添加id
            child.id = child.innerHTML;
            // 添加h3_li
            let h3Li = document.createElement("li");
            let h3A = document.createElement("a");
            h3A.href = "#" + child.innerText;
            h3A.innerText = child.innerText;
            h3Li.append(h3A);
            h3Li.style.marginLeft = "20px";
            h2Ul.append(h3Li);
        }
        contentMenu.append(h2Ul);
    }

    // 修改目录
    let menuWrapper = document.querySelector(".side");
    let nativeHeader = menuWrapper.querySelector("h3");
    // 替换标记
    let isNativeHeader = true;
    // 原目录
    let nativeMenu = menuWrapper.querySelector("ul");
    let bd = menuWrapper.querySelector(".bd");
    nativeHeader.style.color = "blue";
    // 添加事件
    nativeHeader.addEventListener("click", ()=>{
        if(isNativeHeader) {
            bd.replaceChild(contentMenu, nativeMenu);
        }else {
            bd.replaceChild(nativeMenu, contentMenu);
        }
        isNativeHeader = !isNativeHeader;
    })
    console.log("success");
}catch{
    console.log("no menu");
}