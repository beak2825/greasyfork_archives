// ==UserScript==
// @name         numenchatdo
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  对一个chatgpt对话网站:https://www.datanumen.com/blogs/chatgpt/,修改了其对话框样式,优化对话列表样式;增加可复制代码
// @author       winlam,rorinl
// @match        *://www.datanumen.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=datanumen.com
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @license      MIT
// @noframes     true
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/466237/numenchatdo.user.js
// @updateURL https://update.greasyfork.org/scripts/466237/numenchatdo.meta.js
// ==/UserScript==
(function() {
    var imgs = ['data:image/png;base64,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',
                'data:image/png;base64,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'];
    var style=`<style>.codepre{position: relative;}.codepre_true{content: "copy";position: absolute;width: 50px;right: 1%;height: 24px;background: #80808040;top: 12%;border-radius: 5px;display: flex;justify-content: center;align-items: center;transition: all .8s;}.mwai-text{width:94%;}.mwai-name{width:5.4%;}.mwai-name img{width:45px;}html{overflow: hidden;}.mwai-chat .mwai-content .mwai-conversation{height:80vh;}.mwai-chat .mwai-input textarea{height:none;}.mwai-chat .mwai-content{height: 100%;position: fixed;top: 0;left: 0;width: 100%;z-index: 9;}header.site-header,.footer-widgets,#footer,a.go-to,.float-social{display: none;}.mwai-input textarea{background: #d5d5d5;}.mwai-content{border-radius: 0;}.mwai-chat .mwai-text{padding-top: 13px;}</style>`;
    var ele=document.createElement('div');
    ele.innerHTML=style;
    document.getElementsByTagName('head')[0].appendChild(ele.firstElementChild);
    document.title = 'ChatGPT3.5';

    /*改变消息列的头像*/
    function refreshheadicon(){
        document.querySelectorAll(".mwai-ai .mwai-name").forEach((item)=>{item.innerHTML='<img src="'+imgs[0]+'" />';});
        document.querySelectorAll(".mwai-user .mwai-name").forEach((item)=>{item.innerHTML='<img src="'+imgs[1]+'" />';});
        codecopyadd();
        //console.log('refreshheadicon');
    }

    /*copy工具*/
    function codecopyadd(){
        //console.log("codecopyadd():");
        let pres = document.querySelectorAll(".mwai-ai pre:not(.codepre)");
        for(let i=0;i<pres.length;i++){
            pres[i].classList.add("codepre");
            let codepre_true = document.createElement("span");
            codepre_true.innerText = "复制";
            codepre_true.className="codepre_true";
            pres[i].appendChild(codepre_true);
            //赋予点击事件
            codepre_true.addEventListener('click',function(e){
                // 获取要复制的内容
                let textToCopy = codepre_true.parentNode.querySelector("code").innerHTML;

                // 创建一个 textarea 元素并将其插入到文档中
                const tempElement = document.createElement("textarea");
                document.body.appendChild(tempElement);

                // 将要复制的文本设置为 tempElement 的值
                tempElement.value = textToCopy;

                // 选择 tempElement 的文本
                tempElement.select();

                // 复制该文本
                document.execCommand("copy");

                // 移除 tempElement 元素
                document.body.removeChild(tempElement);
                console.log('复制了');
            });
        }
    }

    /*避免没替换-持续判断是否已改变*/
    function refreshheadicon_interval(){
        let inter = setInterval(function(){
            //console.log('refreshheadicon_interval');
            let getaiheadicon = document.querySelectorAll(".mwai-name img");
            //console.log('getaiheadicon---',getaiheadicon.length);
            if(getaiheadicon.length==0){
                refreshheadicon();
            }else{
                clearInterval(inter);
            }
        },1000);
    }

    function removetextarealistens(){
        setTimeout(function(){
            const element = document.querySelector('.mwai-chat .mwai-input textarea');
            const clonedElement = element.cloneNode(true);
            element.parentNode.replaceChild(clonedElement, element);
            element.oninput=function(eve){
                element.removeAttribute('style');
                document.querySelector('.mwai-chat .mwai-content .mwai-conversation').scrollTop=document.querySelector('.mwai-chat .mwai-content .mwai-conversation').scrollHeight
            }
            element.onclick=function(eve){
                element.removeAttribute('style');
                document.querySelector('.mwai-chat .mwai-content .mwai-conversation').scrollTop=document.querySelector('.mwai-chat .mwai-content .mwai-conversation').scrollHeight
            }
            element.onfocus=function(eve){
                element.removeAttribute('style');
                document.querySelector('.mwai-chat .mwai-content .mwai-conversation').scrollTop=document.querySelector('.mwai-chat .mwai-content .mwai-conversation').scrollHeight
            }
        },500);
    }
    /*通过按钮状态-改变消息列的头像*/
    function observericon2refreshicon(){
        let obinterval = setInterval(function(){
            let targetNode = document.querySelector('.mwai-input button');
            if(targetNode){
                console.log('observericon2refreshicon');
                const callback = function(mutationsList, observer) {
                    for(let mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            if (mutation.target.textContent !== mutation.oldValue) {
                                refreshheadicon();
                            }
                        }
                    }
                };
                const observer = new MutationObserver(callback);
                const config = { attributes: true, childList: true, subtree: true, characterData: true, attributeOldValue: true, characterDataOldValue: true };
                observer.observe(targetNode, config);
                clearInterval(obinterval);
            }
        },1000);
    }

    window.onlaod=function(){
        /*内容去圆角,输入框高度设定*/
        document.querySelector(".mwai-content").style.borderRadius = '0';
        refreshheadicon_interval();
        observericon2refreshicon();
    }
    refreshheadicon_interval();
    observericon2refreshicon();
})();