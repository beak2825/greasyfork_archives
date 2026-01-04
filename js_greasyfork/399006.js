// ==UserScript==
// @name         不知道有没有用的同传man辅助
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       You
// @match        https://live.bilibili.com/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @description  在发送评论时自动加上【】


// @downloadURL https://update.greasyfork.org/scripts/399006/%E4%B8%8D%E7%9F%A5%E9%81%93%E6%9C%89%E6%B2%A1%E6%9C%89%E7%94%A8%E7%9A%84%E5%90%8C%E4%BC%A0man%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/399006/%E4%B8%8D%E7%9F%A5%E9%81%93%E6%9C%89%E6%B2%A1%E6%9C%89%E7%94%A8%E7%9A%84%E5%90%8C%E4%BC%A0man%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==


(function () {
    // left 和 right 可以改成自己需要的包裹符号，默认使用中文括号
    const left = '【'
    const right= '】'
    



    // 业务逻辑
    function inject(){    
        const chatPanel =  document.getElementsByClassName('control-panel-ctnr')[0]
        if(chatPanel){
            const vChatPanel = chatPanel.__vue__
            if(vChatPanel != undefined){
                const sendDanmaku = vChatPanel.sendDanmaku
                vChatPanel.sendDanmaku = function(n){
                    vChatPanel.chatInput = left+vChatPanel.chatInput+right
                    sendDanmaku(n)
                }
            }else{
                requestAnimationFrame(inject)
            }
        }else{
            requestAnimationFrame(inject)
        }
    }
    inject()
  })();
  
