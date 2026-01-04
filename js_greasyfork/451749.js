// ==UserScript==
// @name         Bilibili Better Note | 视频笔记增强
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  优化网页端笔记功能
// @author       mscststs
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/h5/note-app/view*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      ISC
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/451749/Bilibili%20Better%20Note%20%7C%20%E8%A7%86%E9%A2%91%E7%AC%94%E8%AE%B0%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/451749/Bilibili%20Better%20Note%20%7C%20%E8%A7%86%E9%A2%91%E7%AC%94%E8%AE%B0%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getPath(node){
        const v = [node];
        while(node = node.parentElement){
            v.push(node);
        }
        return v;
    }
    const styles = `
    .BN-window{
        position:fixed;
        width:500px;
        height:800px;
        display:flex;
        flex-direction:column;
        z-index:100000;
        box-sizing:border-box;
        box-shadow:1px 2px 7px 0 rgba(0,0,0,0.4);
        backgroud-color:white;
    }
    .BN-body{
        flex:auto;
        border-style:none;
    }
`

    function openFrameWindow(href){
        const dragDiv = document.createElement("div");
        const id = "BN-" + (Math.random() + "").replace(".","").slice(1);
        document.body.appendChild(dragDiv);
        dragDiv.outerHTML = `
        <div class="BN-window" id="${id}" style="right:20px; top:20px;">
            <div class="BN-title">
            </div>
            <iframe src="${href}&_id=${id}" class="BN-body"></iframe>
        </div>
        `;
    };

    if(~location.href.indexOf("h5/note-app/view")){
        // 在笔记页面内
        const _id = new URL(location.href).searchParams.get("_id");
        const rawNode = window.parent.document.querySelector("#"+_id);
        // 点击事件接管
        window.addEventListener("click", function(e){
            // 接管 Close 事件
            if(e.target && ~e.target.className.indexOf("close-icon")){
               rawNode.remove();
               return;
            }
            // 接管视频时间节点跳转事件
            if(e.target && e.path && e.path.find(item=>item.className && ~item.className.indexOf("time-tag-item"))){
                const text = e.path.find(item=>~item.className.indexOf("time-tag-item")).innerText;
                const step = [1,60,60*60, 60*60*24]; // 秒、分、时、天 转化为秒时的倍数
                const timeStamp = text.split(":").reverse().reduce((p,c,i)=>p+c*step[i], 0); // 计算实际秒数
                window.parent.player.seek(timeStamp);
                return;
            }
        });
        // 拖拽事件实现
        window.addEventListener("mousedown", function(e){
            const path = getPath(e.target)
            if(e.target && path.length && path.find(i=>i==document.querySelector(".video-page-header"))){
                // 确定是在 header 区域内
                // const {screenX: X,screenY: Y} = e; // 获取原始值

                function moveHandler(e){
                    //console.log("move Event",e)
                    const {movementX, movementY} = e;// 获取当前值
                    rawNode.style.right = (parseInt(rawNode.style.right) - movementX) + "px";
                    rawNode.style.top = (parseInt(rawNode.style.top) + movementY) + "px";
                }

                function uphandler(e){
                    window.removeEventListener("mousemove",moveHandler);
                    window.removeEventListener("mouseup",uphandler);
                }

                window.addEventListener("mousemove",moveHandler);
                window.addEventListener("mouseup",uphandler);
            }
        })
    }else{
        // 在主页面内
        // openFrameWindow("https://www.bilibili.com/h5/note-app/view?cvid=18686954&pagefrom=comment&richtext=true"); // 测试用


        GM_addStyle(styles)
        window.addEventListener("click", function(e){
            // 旧版评论区笔记样式
            if(e.target
               && e.target.tagName === "A"
               && e.target.href
               && e.target.href.startsWith("https://www.bilibili.com/h5/note-app/view")){
                console.log("检查到点击打开笔记", e);
                e.preventDefault();
                e.stopPropagation();
                //const href = e.target.href;
                openFrameWindow(e.target.href);
                return;
            }
            // 新版评论区笔记样式
            if(e.target
              && e.target.className && typeof e.target.className == "string"
              && ~e.target.className.indexOf("open-note-pc")){
                console.log("检查到点击打开笔记", e);
                e.preventDefault();
                e.stopPropagation();
                // 使用 Vue3 组件的关联，获取数据
                openFrameWindow(e.target.__vueParentComponent.parent.props.reply.content.rich_text.note.click_url)
                return;
            }
        }, true)
    }


})();