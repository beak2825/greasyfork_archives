// ==UserScript==
// @name         BiliBili 直播颜文字
// @namespace    mscststs
// @version      0.12
// @description  恢复直播区颜文字功能
// @author       mscststs
// @match        *://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @require      https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=713767
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432944/BiliBili%20%E7%9B%B4%E6%92%AD%E9%A2%9C%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/432944/BiliBili%20%E7%9B%B4%E6%92%AD%E9%A2%9C%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const IconContainerQuery = ".control-panel-icon-row>.icon-left-part";
    let dataVersion = "data-v-39dcacee";
    const emojiList = ["(⌒▽⌒)", "（￣▽￣）", "(=・ω・=)", "(｀・ω・´)", "(〜￣△￣)〜", "(･∀･)", "(°∀°)ﾉ", "(￣3￣)", "╮(￣▽￣)╭", "_(:3」∠)_", "( ´_ゝ｀)", "←_←", "→_→", "(<_<)", "(>_>)", "(;¬_¬)", '("▔□▔)/', "(ﾟДﾟ≡ﾟдﾟ)!?", "Σ(ﾟдﾟ;)", "Σ( ￣□￣||)", "(´；ω；`)", "（/TДT)/", "(^・ω・^ )", "(｡･ω･｡)", "(●￣(ｴ)￣●)", "ε=ε=(ノ≧∇≦)ノ", "(´･_･`)", "(-_-#)", "（￣へ￣）", "(￣ε(#￣) Σ", "ヽ(`Д´)ﾉ", "（#-_-)┯━┯", "(╯°口°)╯(┴—┴", "←◡←", "( ♥д♥)", "Σ>―(〃°ω°〃)♡→", "⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄", "(╬ﾟдﾟ)▄︻┻┳═一", "･*･:≡(　ε:)", "(汗)", "(苦笑)"];
    const styles = `
.emoji-icon{
    margin: 0 5px;
    font-size: 14px !important;
    transform:scale(1.4);
    vertical-align: middle;
    color: #c8c8c8;
    transition: color cubic-bezier(.22,.58,.12,.98) .4s;
    cursor:default;
    display:inline-block;
    width:20px;
    height:20px;
    user-select:none;
    user-focus:
    outline:none;
}
.emoji-icon:hover, .emoji-icon:focus{
    color:#21a5da !important;
}
#emojiBox{
    transform-origin: 63px bottom;
    width: 280px;
    margin: 0px 0px 0px -140px;
    left: 50%;
    bottom: 100%;
    padding: 10px;
    position: absolute;
    z-index: 699;
    display:flex;
    flex-direction:row;
    justify-content: flex-start;
    flex-flow:row wrap;
}
.emoji-item{
    display:inline-block;
    padding: 4px 4px;
    cursor:pointer;
    user-select:none;
    transition: all 0.25s;
}
.emoji-item:hover{
    color:#21a5da;
}
    `

    let panelVisible = false;

    // 创建 Dom 元素
    function createElement(tag, innerHTML, attrs = {}){
        let ele = document.createElement(tag);
        ele.innerHTML = innerHTML;
        Object.entries(attrs).map(([key,value])=>{
            ele.setAttribute(key,value || "")
        })
        return ele;
    }

    // 创建 Style 标签
    function insertStyle(){
        let styleEle = createElement("style", styles);
        document.head.append(styleEle)
    }

    // 显示面板
    function showPanel(){
        let panel = createElement("div","",{
            class:"border-box dialog-ctnr common-popup-wrap top-center",[dataVersion]:"", id:"emojiBox"
        })
        let parent= document.querySelector("#control-panel-ctnr-box");

        emojiList.forEach(item=>{
            const emojiEle = createElement("span",item,{
                class:"emoji-item"
            })
            emojiEle.addEventListener("click",()=>{
                let ele = document.querySelector("#chat-control-panel-vm > div > div.chat-input-ctnr.p-relative > div > textarea");


                ele.value = ele.value + item;
				let e = new Event('input',{bubbles:true, cancelable: true, composed:true});
				let f = new Event('focus',{bubbles:true, cancelable: true, composed:true});

                ele.dispatchEvent(e);

                ele.focus()
                setTimeout(()=>{
                    ele.dispatchEvent(f);
                },10)
                // 选择表情后关闭面板
                panelVisible =!panelVisible;
                hidePanel();
            })
            panel.append(emojiEle)
        })
        parent.append(panel)

    }
    // 隐藏面板
    function hidePanel(){
        document.querySelector("#emojiBox").remove()

    }

     async function init(){
        let IconContainer = await mscststs.wait(IconContainerQuery);
         // 重设 Data-v 版本
        dataVersion = [...IconContainer.attributes].find(item=>item.name.startsWith("data-v")).name;
         console.log({class:"icon-item icon-font live-skin-main-text emoji-icon", title:"颜文字",[dataVersion]:""})
        // 在 IconConatiner 添加颜文字 Icon
        const emojiIcon = createElement("span",
                                            `☻`,
                                            {class:"icon-item icon-font live-skin-main-text emoji-icon", title:"颜文字",[dataVersion]:"", tabindex:-1}
                                          );
        IconContainer.append(emojiIcon);
        emojiIcon.addEventListener("click",(e)=>{
            panelVisible =!panelVisible;
            if(panelVisible){
                showPanel();
            }else{
                hidePanel();
            }
            e.stopPropagation()
        })
        document.addEventListener("click",()=>{
            if(panelVisible){
                panelVisible =!panelVisible;
                hidePanel();
            }
        })

     };
    // Start
    insertStyle();
    init();
})();