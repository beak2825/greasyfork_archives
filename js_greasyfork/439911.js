// ==UserScript==
// @name         Bilibili Dynamic & Column to Flarum Post
// @namespace    https://bbs.mughome.top/
// @version      0.2
// @description  Make a Bilibili dyanamic into Flarum Post content.
// @author       MMINO
// @match        http*://t.bilibili.com/*
// @match        http*://www.bilibili.com/read/*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://unpkg.com/turndown/dist/turndown.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440030/Bilibili%20Dynamic%20%20Column%20to%20Flarum%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/440030/Bilibili%20Dynamic%20%20Column%20to%20Flarum%20Post.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const turndownService = new TurndownService({headingStyle: "atx", bulletListMarker: "-"});
    function isSplitLine(url) {
        let reg = /.*(0117cbba35e51b0bce5f8c2f6a838e8a087e8ee7.png)|(4aa545dccf7de8d4a93c2b2b8e3265ac0a26d216.png)|(71bf2cd56882a2e97f8b3477c9256f8b09f361d3.png)|(db75225feabec8d8b64ee7d3c7165cd639554cbc.png)|(4adb9255ada5b97061e610b682b8636764fe50ed.png)|(02db465212d3c374a43c60fa2625cc1caeaab796.png)/;
        return reg.test(url)
    }
    //Dynamic
    let content = null;
    if (/https?:\/\/t.bilibili.com\/*/.test(location.href) === true) {
        let q = setInterval(() => {
            content = document.querySelector(".content-full");
            if (content !== null) {
                let text = content.innerText;
                clearInterval(q);
                let imgs = document.querySelectorAll(".img-content");
                for (let img of imgs) {
                    let reg = /(\/\/.*)@/;
                    let imgLink = reg.exec(img.style.backgroundImage)[1];
                    text += "\n![动态配图](" + imgLink + ")";
                }
                text += "\n\n> 转载自[" + document.title + "](" + location.href + ")";
                console.log(text);

                let btn = document.createElement("button");
                let parent = document.querySelector(".main-content");
                btn.innerHTML = "点击生成Flarum文章";
                btn.style.padding = "3px";
                btn.onclick = () => {
                    let generated = document.createElement("div");
                    generated.innerText = text;
                    generated.style.backgroundColor = "#B8BFD8";
                    generated.style.marginRight = "32px";
                    generated.style.marginTop = "10px";
                    generated.style.padding = "16px";
                    generated.style.wordWrap = "break-all";
                    generated.style.wordBreak = "normal";
                    parent.appendChild(generated);
                }
                parent.appendChild(btn);
            }
        }, 200);
    }
    //Column
    if (/https?:\/\/www.bilibili.com\/read\/cv*/.test(location.href) === true) {
        let q = setInterval(() => {
            content = document.querySelector("#read-article-holder");
            if (content !== null) {
                let text = "";
                clearInterval(q);
                for (let node of content.childNodes) {
                    if (node.tagName !== "FIGURE") {
                        if (node.tagName === "H1") {
                            text += "### " + node.innerText + "\n";
                        } else {
                            text += turndownService.turndown(node.outerHTML) + "\n\n";
                        }
                    } else if (node.tagName === "FIGURE") {
                        let url = node.querySelector("img").src;
                        let reg = /(\/\/.*)@/;
                        url = reg.exec(url)[1];
                        if (isSplitLine(url)) {
                            text += "\n---\n\n";
                        } else {
                            text += "![配图](" + url + ")\n";
                        }
                    }
                }
                text += "\n\n> 转载自[" + document.title + "](" + location.href + ")";
                console.log(text);

                let btn = document.createElement("button");
                let parent = document.querySelector(".article-container");
                btn.innerHTML = "点击生成Flarum文章";
                btn.id = "flarum-btn"
                btn.style.padding = "3px";
                btn.onclick = () => {
                    let generated = document.createElement("div");
                    generated.innerText = text;
                    generated.style.backgroundColor = "#B8BFD8";
                    generated.style.marginRight = "32px";
                    generated.style.marginTop = "10px";
                    generated.style.padding = "16px";
                    generated.style.wordWrap = "break-all";
                    generated.style.wordBreak = "normal";
                    parent.insertBefore(generated, document.getElementById("flarum-btn").nextSibling);
                }
                parent.prepend(btn);
            }
        }, 200);
    }
})();
