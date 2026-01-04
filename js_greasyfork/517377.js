// ==UserScript==
// @name         哔哩哔哩屏蔽
// @namespace    http://quhou-pingbi.net/
// @version      1.0.0
// @description  屏蔽评论，可以自定义匹配规则（正则）
// @author       xygod
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @require      https://update.greasyfork.org/scripts/517325/1483922/QuHouLibary.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517377/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/517377/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    handleBlockComment()

    // 添加自定义样式
    addDialogStyle()
    const _fetch = fetch
    window.fetch = function(...req){
      console.log(req)
      return _fetch(...req)
    }
    function addDialogStyle(){
        GM_addStyle(`
        #tm-dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        #tm-dialog {
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        }
        #tm-dialog input {
            width: 100%;
            padding: 5px;
            margin: 10px 0;
        }
        #tm-dialog button {
            margin: 5px;
            padding: 5px 10px;
        }
    `);
    }

    // 创建并显示对话框
    function showInputDialog() {
        const overlay = document.createElement('div');
        overlay.id = 'tm-dialog-overlay';

        const dialog = document.createElement('div');
        dialog.id = 'tm-dialog';

        const input = document.createElement('input');
        setTimeout(function(){
            input.focus()
        })
        input.value = GM_getValue("comment_rule") || null
        input.type = 'text';
        input.placeholder = '请输入校验规则';

        const submitButton = document.createElement('button');
        submitButton.textContent = '确定';
        submitButton.onclick = function() {
            const inputValue = input.value;
            GM_setValue("comment_rule",inputValue)
            handleBlockComment()
            GM_notification({
                text: inputValue,
                title: '当前评论校验规则为：',
                timeout: 6000
            });
            document.body.removeChild(overlay);
        };

        const clearButton = document.createElement('button');
        clearButton.textContent = '清空';
        clearButton.onclick = function() {
            GM_setValue("comment_rule",null)
            location.reload()
        };

        const cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.onclick = function() {
            document.body.removeChild(overlay);
        };

        dialog.appendChild(input);
        dialog.appendChild(submitButton);
        dialog.appendChild(clearButton);
        dialog.appendChild(cancelButton);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
    }

    // 注册菜单命令
    GM_registerMenuCommand('打开输入对话框', showInputDialog);
    async function handleBlockComment(){
        const commentRule = GM_getValue("comment_rule") || null
        console.log("commentRule:",commentRule)
        if(!commentRule) return
        Element.prototype._attachShadow = Element.prototype.attachShadow
        Element.prototype.attachShadow = function(){
            return this._attachShadow({mode:"open"})
        }
        function findShadowHost(element) {
            while (element) {
                if (element.nodeType === Node.DOCUMENT_FRAGMENT_NODE && element.host) {
                    return element.host;
                }
                element = element.parentNode || element.host;
            }
            return null;
        }
        const commentWrap = await qq.findDom("bili-comments")
        const comments = await qq.findAllDom("#feed bili-comment-thread-renderer",commentWrap.shadowRoot)
        comments.forEach(async r => {
            const comment = await qq.findDom("#comment",r.shadowRoot)
            const replies = await qq.findDom("#replies",r.shadowRoot)
            checkMainComment(comment)
            checkRepliesComment(replies)
        },1000)

        function checkMainComment(comment){
            const text = comment.shadowRoot.querySelector("#body #main #content bili-rich-text").shadowRoot.querySelector("#contents").innerText
            const regex = new RegExp(commentRule)
            if(regex.test(text)){
                console.log("正则校验成功，删除此条评论：" , comment)
                const host = findShadowHost(comment)
                host && host.remove()
            }
        }
        function checkRepliesComment(comment){
            const replies = comment.querySelector("bili-comment-replies-renderer").shadowRoot.querySelectorAll("#expander #expander-contents bili-comment-reply-renderer")
            replies.forEach(r=>{
              const text =  r.shadowRoot.querySelector("#body #main bili-rich-text").shadowRoot.querySelector("#contents").innerText
              const regex = new RegExp(commentRule)
              if(regex.test(text)){
                  console.log("正则校验成功，删除此条评论：" , comment)
                  r.remove()
              }
            })
        }
    }
    // Your code here...
})();