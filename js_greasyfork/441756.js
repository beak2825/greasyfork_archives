// ==UserScript==
// @name         網站頁面翻譯補釘
// @name:zh-CN   网站页面翻译补丁
// @name:en      Website page translation patch
// @namespace    https://www.velhlkj.com/
// @version      5.7.0
// @description  此腳本用於在網站翻譯前對部份問題進行修復，例如鏈接失效或消失、下拉列表框因翻譯而導致值不匹配、翻譯後換行丟失內容堆在一起等問題。相容於動態更新的頁面內容。
// @description:zh-cn 此脚本用于在网站翻译前对部份问题进行修复，例如链接失效或消失、下拉列表框因翻译而导致值不匹配、翻译后换行丢失内容堆在一起等问题。兼容动态更新的页面内容。
// @description:en This script is used to fix some problems before the website is translated, such as invalid or missing links, mismatched values ​​in drop-down list boxes due to translation, and the problem of content being piled together because line breaks are lost after translation. Compatible with page content updated dynamically.
// @author       龍翔翎
// @match        <all_urls>
// @include      *
// @icon         data:image/png;base64,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
// @grant        none
// @run-at       context-menu
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441756/%E7%B6%B2%E7%AB%99%E9%A0%81%E9%9D%A2%E7%BF%BB%E8%AD%AF%E8%A3%9C%E9%87%98.user.js
// @updateURL https://update.greasyfork.org/scripts/441756/%E7%B6%B2%E7%AB%99%E9%A0%81%E9%9D%A2%E7%BF%BB%E8%AD%AF%E8%A3%9C%E9%87%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var eleList = [];
    let linkIndex = 0; //初始化編號
    function setTrans(){
        const source = eleList.shift();
        if(!source) return;
        if(source.tagName.toLowerCase() == "a" && !source.textContent.replaceAll(/[\s]/g) == ""){
            if(window.getComputedStyle(source).display == "inline"){ //如果元素的原始樣式是「行內」，則改為「行內塊」也有「塊」元素才能正確隱藏
                source.style.display = "inline-block";
                //source.style.float = "left";
            }
            const faker = source.cloneNode(true); //複製原始元素來創建偽元素
            source.setAttribute('translate', 'no'); //原始元素設為不可翻譯（非Google翻譯插件可能不遵守此屬性）
            /*>>> 處理原始元素樣式以隱藏原始元素*/
            source.style.width = "0";
            source.style.height = "0";
            source.style.overflow = "hidden";
            source.style.margin = "0";
            source.style.padding = "0";
            source.style.border = "0";
            /*<<< 原始鏈接樣式處理完畢*/
            source.setAttribute("data-vntl-mark", "vel-no-translate-link-" + linkIndex); //為原始鏈接添加data-vntl-mark屬性，屬性值是唯一ID（這裡不直接使用id屬性的原因是為了防止部份網頁已經對鏈接設定了id，佔用可能會出問題）

            faker.removeAttribute("id"); //移除偽鏈接的id屬性，避免id衝突
            faker.removeAttribute("href"); //移除偽鏈接的href屬性，偽鏈接不應具有任何跳轉能力
            faker.setAttribute('data-faker', source.getAttribute("data-vntl-mark")); //添加偽鏈接的data-faker屬性，用來紀錄對應的原始鏈接data-vntl-mark
            faker.setAttribute("onclick",`window.fakeLinkClick(this)`);
            //添加偽鏈接的click事件，用以觸發原始鏈接點擊。（這裡只能用onclick，Google翻譯會重新創建被翻譯的元素，會導致EventListener這類綁定上去的事件，及內部自定義屬性全部丟失，這也是原始鏈接被翻譯後可能會有問題的主要原因，但明文寫在html中的則不會消失，因此用onclick是唯一可用的方案）
            source.after(faker); //將偽鏈接添加到原始鏈接之後
            linkIndex ++; //增加編號
        }else if(source.tagName.toLowerCase() == "select"){
            let _options = source.querySelectorAll("option"); //獲取所有選項
            for(let _option of _options){ //處理每一個選項
                _option.setAttribute('translate', 'no'); //原始元素設為不可翻譯（非Google翻譯插件可能不遵守此屬性）
                let _tipItem = document.createElement('option'); //創建用於翻譯的選項
                _tipItem.setAttribute("disabled","disabled"); //用於翻譯的選項本身不可被選擇
                _tipItem.textContent = "↓ " + _option.textContent; //為用於翻譯的選項設定文本
                _option.parentElement.insertBefore(_tipItem,_option); //在真正的選項上方插入翻譯的選項
            }
            source.setAttribute('data-vnts-processed', true);
            /* 注：因為部份遊戲作者和引擎的偷懶行為，他們會直接使用選項文本作為選項值，因此不能直接替換為假的option，或在選項內添加註釋，因此通過添加被Disabled的選項作為一種對真正選項的註釋 */
        }
        setTrans(); //遞歸進行下一個元素的處理
    }

    function fixTextNode() {
        let _brs = Array.from(document.querySelectorAll("br:not([data-vnts-fixed])"));
        for(const _br of _brs) {
            let blank_div = document.createElement("div");
            blank_div.setAttribute("class","vnts-br-fixer");
            blank_div.setAttribute("style","display:inline-block;height:0.5rem; clear:both; overflow:hidden; padding:0; margin:0;");
            _br.before(blank_div);
            _br.setAttribute("data-vnts-fixed","true");
        }
    }

    window.fakeLinkClick = (fakeLink) => {
        let vntsID = fakeLink.getAttribute("data-faker");
        let sourceEle = document.querySelector(`a[data-vntl-mark="${vntsID}"]`);
        sourceEle.click();
        setTimeout((th,s)=>{
            th.innerHTML = s.innerHTML;
        },10,fakeLink,sourceEle)
    }

    // 使用 MutationObserver 監聽節點變化
    const observer = new MutationObserver(function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // 處理新增節點
                mutation.addedNodes.forEach(node => {
                    if (!node.getAttribute || !node.tagName ||
                        node.getAttribute("data-faker") ||
                        node.getAttribute("data-vnts-processed") ||
                        node.getAttribute("class") == "vnts-br-fixer") return;
                    if (["a", "select"].includes(node.tagName.toLowerCase())) {
                        eleList.push(node);
                    } else {
                        let _eleList = node.querySelectorAll('a:not([data-faker]):not([data-vntl-mark]), select:not([data-vnts-processed])');
                        eleList.push(...Array.from(_eleList));
                    }
                    setTrans();
                    fixTextNode();
                });

                // 處理移除節點
                mutation.removedNodes.forEach(node => {
                    setTimeout(() => {
                        if (node.getAttribute && node.getAttribute("data-vntl-mark")) {
                            let mark = node.getAttribute("data-vntl-mark");
                            let faker = document.querySelector(`[data-faker="${mark}"]`);
                            if (faker) faker.parentElement.removeChild(faker);
                        }
                    }, 10);
                });
            }
        }
    });

// 開始觀察整個文檔，監聽子節點的變化
observer.observe(document, { childList: true, subtree: true });

    //初始執行（初始時機為點擊右鍵選單中插件名的動作）初始執行只觸發一次
    fixTextNode();
    eleList = document.querySelectorAll('a:not([data-faker]):not([data-vntl-mark]), select:not([data-vnts-processed])') //提取所有不是 [偽元素] 與 [被處理過的元素] 的元素添加到元素列表
    eleList = Array.from(eleList);
    setTrans(); //觸發處理功能開始處理隊列

    //設定不提前翻譯故事儲存庫中的內容
    let tws = document.querySelectorAll("tw-storydata,tw-storydata tw-passagedata");
    for(const tw of tws){
        tw.setAttribute('translate', 'no');
    }

    //處理腳本激活成功提示
    let tipstyle = document.createElement("style"); //創建樣式表元素
    //為樣式表添加內容
    tipstyle.textContent = `
    @keyframes showtip {
        0% {
            opacity: 0;
        }
        15% {
            opacity: 1;
        }
        85%{
            opacity: 1;
        }
        100%{
            opacity: 0;
        }
    }
    #vel-patch-tip {
        display: block;
        position: fixed;
        top: calc(50% - 50px);
        left: calc(50% - 225px);
        width: 450px;
        height: 100px;
        line-height: 100px;
        background-color: #056b00;
        backdrop-filter: blur(30px);
        opacity: 0;
        border-radius: 10px;
        animation: showtip 3s;
        text-align: center;
        pointer-events: none;
        z-index:99999999;
        color: white;
        font-weight: bold;
        font-size: 20px;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
    }`;
    tipstyle.id = "vel-patch-tipstyle"; //設定樣式表ID用以刪除
    document.body.appendChild(tipstyle); //將樣式表添加到頁面
    let tip = document.createElement("div"); //創建提示框元素
    tip.textContent = "網站頁面翻譯補釘應用成功，可以開始翻譯頁面"; //添加提示框內容
    tip.id = "vel-patch-tip"; //設定提示框ID用以刪除
    document.body.appendChild(tip); //添加提示框（因為animation屬性，它會自動以動畫顯示並消失）
    //設定一個計時器以在提示框播放完畢後刪除添加的臨時樣式表與div提示框。
    setTimeout(function(){
        document.body.removeChild(document.querySelector(`#vel-patch-tipstyle`));
        document.body.removeChild(document.querySelector(`#vel-patch-tip`));
    },3000);
})();