// ==UserScript==
// @name         Style for Coze Bot App mode
// @namespace    https://www.velhlkj.com/
// @version      1.1.5
// @description  Make Coze Bot looks better!
// @author       Velade
// @match        https://www.coze.com/store/bot/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-body
// @license      Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/496925/Style%20for%20Coze%20Bot%20App%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/496925/Style%20for%20Coze%20Bot%20App%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
                    /*官方阴影*/
                    .ULoOs2TMkJkb2BgT_MKa {
                        display: none !important;
                    }
                    /*新对话按钮*/
                    .NyvVfPwFXFYvQFyXUtTl {
                        padding-left: 0 !important;
                    }
                    /*标题列*/
                    .nZxnu8KzOis7qKnDx66E {
                        position: fixed !important;
                        top: 5px !important;
                        right: 5px !important;
                        width: 80px !important;
                        height: 40px !important;
                        filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.5)) !important;
                    }

                    .nZxnu8KzOis7qKnDx66E > div:first-child {
                        display: none !important;
                    }

                    .nZxnu8KzOis7qKnDx66E > div:nth-child(2) > div:nth-child(2){
                        display: none !important;
                    }
                    /*对话区域主体*/
                    .O4fwdEnt3QgzBjrYtohO {
                        -webkit-mask: linear-gradient(180deg,hsla(0,0%,100%,0) 5px, #fff calc(8.11% + 5px), #fff 91.89%, hsla(0,0%,100%,0)) !important;
                        mask: linear-gradient(180deg,hsla(0,0%,100%,0) 5px, #fff calc(8.11% + 5px), #fff 91.89%, hsla(0,0%,100%,0)) !important;
                    }
                    /*底部声明：改为导航栏占位*/
                    .pStAbHgTdAlDVUlpMOGP {
                        opacity: 0 !important;
                        height: 5px !important;
                    }
                    .pStAbHgTdAlDVUlpMOGP > span {
                        display: none;
                    }
                    /*斜体样式*/
                    .flow-markdown-body em.proced{
                        display: none !important;
                    }
                    .flow-markdown-body em.vel-em-action {
                        display: block !important;
                        clear: both !important;
                        color: #FF69B4 !important;
                        font-style: normal !important;
                    }
                    .flow-markdown-body em.vel-em-other {
                        display: inline-block !important;
                        clear: none !important;
                        color: #FF69B4 !important;
                        font-style: normal !important;
                    }
    `;
    document.head.appendChild(style);
    
    let pendingNodes = new Array();

    let timer = null;

    let observer = new MutationObserver(mutations=>{
        mutations.forEach(mutation=>{
            if(mutation.type === 'childList' || mutation.type === "characterData"){
                let newPush = false;
                mutation.addedNodes.forEach((node)=>{
                    if(node.matches && (node.matches(".vel-em-action") || node.matches(".vel-em-other"))) return;
                    pendingNodes.push(node);
                    newPush = true;
                })
               if(newPush) PostProc();
            }
        })
    });
    
    // 获取textnode
    function getTextNodes(ele) {
        if (ele.nodeType == 3) return [ele];
        const nodes = ele.childNodes;
        const textnodes = [];
        for (const i in nodes) {
            if (nodes[i].nodeType == 3) {
                textnodes.push(nodes[i]);
            } else {

                const r = getTextNodes(nodes[i]);
                for (const tn of r) {
                    textnodes.push(tn);
                }
            }
        }
        return textnodes;
    }
    
    // 后处理
    function PostProc(delay = 50) {
        if(timer) clearTimeout(timer);
        timer = setTimeout(()=>{
            const _pendingNodes = [...new Set(pendingNodes)];
            let node;
            while(node = _pendingNodes.shift()) {
                if(!node.querySelectorAll) continue;
                if(node.textContent.match(/\*\([^\)]+?\)\*/)) {
                    const nl = getTextNodes(node);
                    for(const n of nl) {
                         if(n.nodeValue.match(/\*\([^\)]+?\)\*/)){
                             const newNode = document.createElement("span");
                             newNode.innerHTML = n.nodeValue.replaceAll(/\*\(([^\)]+?)\)\*/g, `<em class="vel-em-action">$1</em>`);
                             n.replaceWith(newNode);
                         }
                    }
                }else if(node.tagName.toLowerCase() == "em") {
                    if(node.matches(".proced") || node.matches(".vel-em-action") || node.matches(".vel-em-other")) continue;
                    if(node.textContent.match(/^[\(（].+?[\)）]$/)) {
                        const em = document.createElement("em");
                        em.textContent = node.textContent.replaceAll(/[\(\)（）]/g,"");
                        em.classList.add("vel-em-action");
                        node.classList.add("proced");
                        node.after(em);
                    }
                    else node.classList.add("vel-em-other");
                }else if(node.matches(".math-inline")){
                    if(node.parentElement.querySelector(".vel-em-action")) continue;
                    const em = document.createElement("em");
                    em.textContent = node.textContent.replaceAll(/[\(\)（）]/g,"");
                    em.classList.add("vel-em-action");
                    node.parentElement.classList.remove("vel-em-other");
                    node.parentElement.classList.add("proced");
                    node.parentElement.after(em);
                }else{
                    node.querySelectorAll(`em:not(.vel-em-action, .vel-em-other)`).forEach(n=>{
                        if(n.textContent.match(/^[\(（].+?[\)）]$/)) {
                            if(n.parentElement.querySelector(".vel-em-action")) return;
                            const em = document.createElement("em");
                            em.textContent = n.textContent.replaceAll(/[\(\)（）]/g,"");
                            em.classList.add("vel-em-action");
                            n.classList.add("proced");
                            n.after(em);
                        }
                        else n.classList.add("vel-em-other");
                    })
                }
            }
        }, delay);
    }
    const config = { childList: true, subtree: true,characterData: true };
    const targetNode = document.body;
    observer.observe(targetNode, config);
})();