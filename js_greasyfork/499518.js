// ==UserScript==
// @name         皇冠、如梦及同类网站优化
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  优化网站扫资源体验
// @author       JMRY
// @match        *://*.hgzy117.com/*
// @match        *://*.szfszf.com/*
// @match        *://*.szfszf1.com/*
// @match        *://*.szfszf2.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499518/%E7%9A%87%E5%86%A0%E3%80%81%E5%A6%82%E6%A2%A6%E5%8F%8A%E5%90%8C%E7%B1%BB%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/499518/%E7%9A%87%E5%86%A0%E3%80%81%E5%A6%82%E6%A2%A6%E5%8F%8A%E5%90%8C%E7%B1%BB%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

/*
0.2.4 20251010
- 加入标题文字多段复制功能。
0.2.3 20250804
- 加入自动填写输入内入功能。
- 修复文本报错的bug。
0.2.2 20250116
- 加入自动监听页面变化功能。
0.2.1 20241224
- 修复百度网盘无法跳转的bug。
0.2 20240814
- 优化复制首段算法。
0.1 20240217
- 加入链接带密码跳转功能。
- 加入复制成功的提示。
- 完成基本功能。
*/

String.prototype.replaceAll=function(org,tgt){
    return this.split(org).join(tgt);
}

function getTitlePart(title, pos){
    let symbolList=`~\`!@#$%^&*()_+-=[]{}\|;:'",./<>?·～！￥%=…（）—【】｛｝、；：‘’“”，。《》？　`.split(``);
    for(let s of symbolList){
        title=title.replaceAll(s,` `);
    }
    title=title.trim();
    return title.split(` `)[pos];
    /*
    let titleSp=title;
    for(let sp of splist){
        titleSp=titleSp.split(sp)[0];
    }
    return titleSp;
    */
}

function applyCustomStyle(){
    let styleEl=document.createElement(`style`);
    styleEl.innerHTML=`
    .copied{
        color:rgba(0,128,0,1);
    }
    .copied.part{
        color:rgba(128,128,0,1);
    }
    .copyBu, .jumpBu{
        margin-left:4px;
    }
    `;
    document.body.appendChild(styleEl);
}

async function applyTitleCopy(){
    let titleEl=document.getElementById(`thread_subject`);
    if(titleEl){
        let copyBu=document.createElement(`button`);
        copyBu.className=`copyBu`;
        copyBu.innerHTML=`复制`;
        copyBu.addEventListener('click',async function(){
            await navigator.clipboard.writeText(titleEl.innerText.replaceAll(`...`,``).trim());
            titleEl.className='copied';
            if(typeof showPrompt==`function`) showPrompt(null, null, `<span>名字已复制到剪贴板：${await navigator.clipboard.readText()}</span>`, 1500);
        });
        titleEl.parentElement.appendChild(copyBu);
        // 后段复制
        let part=3;
        for(let i=0; i<part; i++){
            let titlePart=getTitlePart(titleEl.innerText, i);
            let copyPartBu=document.createElement(`button`);
            copyPartBu.className=`copyBu`;
            copyPartBu.innerHTML=`复制第${i+1}段`;
            copyPartBu.addEventListener('click',async function(){
                await navigator.clipboard.writeText(titlePart.trim());
                titleEl.className=`copied part ${i}`;
                if(typeof showPrompt==`function`) showPrompt(null, null, `<span>第${i+1}段名字已复制到剪贴板：${await navigator.clipboard.readText()}</span>`, 1500);
            });
            titleEl.parentElement.appendChild(copyPartBu);
        }
        //首段复制
        /*let partSplitList=[
            ` `,`-`,`_`,`,`,`.`,`:`,`;`,`~`,`!`,`+`,
            `，`,`。`,`：`,`；`,`—`,`！`,`？`,`·`,
            `（`,`【`,
        ];
        //let titlePart=getTitlePart(titleEl.innerText, partSplitList);
        let titlePart=getTitlePart(titleEl.innerText, 0);
        let copyPartBu=document.createElement(`button`);
        copyPartBu.className=`copyBu`;
        copyPartBu.innerHTML=`复制首段`;
        copyPartBu.addEventListener('click',async function(){
            await navigator.clipboard.writeText(titlePart.trim());
            titleEl.className='copied part';
            if(typeof showPrompt==`function`) showPrompt(null, null, `<span>首段名字已复制到剪贴板：${await navigator.clipboard.readText()}</span>`, 1500);
        });
        titleEl.parentElement.appendChild(copyPartBu);
        */
    }
}

function applyLinkCopy(){
    if(document.querySelector(`.jumpBu`)!=null){
        observer.disconnect();
        return;
    }
    let showHideEl=document.querySelector(`.showhide`);
    if(showHideEl){
        let panCode=document.querySelector(`.showhide`).innerText.split(`提取码`)[1];
        if(panCode){
            let blackList=[
                `www.osm7.com`,`ainu8`,`爱2`,
            ];
            for(let b of blackList){
                panCode=panCode.replace(b,``); //去除黑名单内的字符串
            }
            panCode=panCode.replace(/[^a-zA-Z0-9]/g, ``);
            let panLink=document.querySelector(`.showhide`).querySelector(`a`).attributes.href.value;
            let jumpBu=document.createElement(`a`);
            jumpBu.href=`${panLink}?pwd=${panCode}`;
            jumpBu.target=`_blank`;
            jumpBu.rel=`noreferrer`;
            jumpBu.className=`jumpBu`;
            jumpBu.innerHTML=`<button class="jumpBu">跳转</button>`;
            showHideEl.appendChild(jumpBu);
            observer.disconnect();
            /*
        let jumpBu=document.createElement(`button`);
        jumpBu.className=`jumpBu`;
        jumpBu.innerHTML=`跳转`;
        jumpBu.addEventListener(`click`,function(){
            window.open(`${panLink}?pwd=${panCode}`);
        });
        showHideEl.appendChild(jumpBu);
        */
        }
        console.log(panCode);
    }
}

function applyAutoInput(){
    let inputText=`强烈支持楼主ing……`;
    let submitBu=document.querySelector(`#fastpostsubmit`);
    let textArea=document.querySelector(`#fastpostmessage`);
    let inputBu=document.createElement(`button`);
    inputBu.id=`inputBu`;
    inputBu.className=`pn pnc vm`;
    inputBu.innerHTML=`一键填写：${inputText}`;
    inputBu.addEventListener(`click`,function(e){
        e.preventDefault();
        textArea.value=inputText;
    });
    submitBu.parentNode.insertBefore(inputBu, submitBu);
}

let observer;
function watchLinkApply(){
    const config = {
        childList: true, // 监听子节点的增删
        attributes: true, // 监听属性变化
        subtree: true, // 监听整个子树
        characterData: true // 监听节点内容或文本的变化
    };
    observer = new MutationObserver((mutationsList, observer) => {
        console.log(`Watched dom changed.`);
        applyLinkCopy();
    });
    const targetNode = document.querySelector(`body`);
    observer.observe(targetNode, config);
}

(function() {
    applyCustomStyle();
    applyTitleCopy();
    applyAutoInput();
    watchLinkApply();
    //applyLinkCopy();
})();