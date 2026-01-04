// ==UserScript==
// @name         interview-unlock
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       aozora
// @match        *://*.poetries.top/*
// @match        *://interview.poetries.top/*
// @match        *://interview2.poetries.top/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448618/interview-unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/448618/interview-unlock.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //删除锁定文章限制 类名
    //let codeBlockStyle = document.createElement('style');
    // codeBlockStyle.type = 'text/css';
    // codeBlockStyle.innerText = `blockquote{display: block !important;}div,ul,li,p{opacity: 1 !important;}.content-lock{display: none !important;}.readMore-wrapper{display: none !important;}`;
    // document.body.appendChild(codeBlockStyle);
    window.onload = function(){
        //删除锁定文章限制 类名
        //GM_addStyle("blockquote{display: block !important;}div,ul,li,p{opacity: 1 !important;}.content-lock{display: none !important;}.readMore-wrapper{display: none !important;}");
        GM_addStyle(".theme-default-content.pay-content .content__default>:nth-child(n+45),.content__default>:nth-child(n){opacity:1 !important;display:block !important;}");
        unlock();
        addBtn();// 添加
        let Intervaltimer = setInterval(function(){
            if(document.querySelector("#iu-est")){
                clearInterval(Intervaltimer);
                dragBtn();
                bindClick();
            } else {
                addBtn();
            }
        },500)
    }
    function unlock(){
        //删除锁定文章限制
        clear_class('#container','lock');
        //删除阅读全文按钮
        clear_node('.readMore-wrapper');
        clear_node('.content-lock');
    }
    // 删除类名
    function clear_class(nodeNane,...classNanes){
        document.querySelector(nodeNane).classList.remove(...classNanes);
    }
    // 删除节点
    function clear_node(nodeNane){
        let node = document.querySelector(nodeNane);
        if(node){
            node.parentNode.removeChild(node);
        }
    }
    let unlockNodeMoveing = false,unlockNodeIsClick=false,timer,screenClientWidth;

    //增加拖动事件 func
    function dragBtn(){
        console.log("touchmove in document","ontouchmove" in document);
        console.log("mousemove in document","onmousemove" in document);
        let touchMode = "ontouchmove" in document;
        let iu_node = document.querySelector("#iu-est");
        let disX = 0,disY = 0;
        if(touchMode){
            //支持touchmove事件，一般用于移动端
            iu_node.addEventListener("touchstart",moveStart)
            document.addEventListener("touchend",moveEnd)
        }else{
            //支持mousemove事件，一般用于pc端
            iu_node.addEventListener("mousedown",moveStart)
            document.addEventListener("mouseup",moveEnd);
        }

        function moveStart(event){
            document.body.style.overflow = 'hidden'
            let iu_node = document.querySelector("#iu-est");
            if(!iu_node.classList.contains('iu-active-est')){
                console.log('no avtive');
                return
            }

            let touch = event.touches?event.touches[0]:event;
            // console.log("moveStart",event);
            // console.log('moveStart',touch.clientX,iu_node.offsetLeft);
            iu_node.style.transition = "null";
            disX = touch.clientX - iu_node.offsetLeft;
            disY = touch.clientY - iu_node.offsetTop;
            if(touchMode){
                //支持touchmove事件，一般用于移动端
                document.addEventListener("touchmove",move);
            }else{
                //支持mousemove事件，一般用于pc端
                document.addEventListener("mousemove",move);
            }
        }

        function move(event){
            let iu_node = document.querySelector("#iu-est");

            let touch = event.touches?event.touches[0]:event;
            iu_node.style.left = touch.clientX - disX + "px";
            iu_node.style.right = screenClientWidth - (touch.clientX - disX) - 70 + "px";
            iu_node.style.top = touch.clientY - disY + "px";
            // console.log('move',touch);
            unlockNodeMoveing = true;
            clearTimeout(timer);
            timer = setTimeout(()=>{
                unlockNodeMoveing = false;
            },150)
        };
        function moveEnd(){
            document.body.style.overflow = 'auto';
            iu_node.style.transition = "0.3s";
            if(touchMode){
                //支持touchmove事件，一般用于移动端
                document.removeEventListener("touchmove",move);
            }else{
                //支持mousemove事件，一般用于pc端
                document.removeEventListener("mousemove",move);
            }

            // 可拖动到屏幕右侧
            let bodyWidth = document.body.clientWidth;
            let iu_nodeWidth = iu_node.offsetLeft + iu_node.offsetWidth/2;
            if(iu_nodeWidth > bodyWidth/2){
                iu_node.style.left = "auto";
                iu_node.style.right = 0;
                iu_node.classList.remove('left');
                iu_node.classList.add('right');
            } else {
                iu_node.style.right = "auto";
                iu_node.style.left = 0;
                iu_node.classList.remove('right');
                iu_node.classList.add('left');
            }
        };
    }

    function bindClick(){
        let unlockNode = document.querySelector('#iu-est');
        let unlockBtn = document.querySelector('.iu-btn-est');
        // 解锁按钮添加点击事件
        function unlockBtnClick(){
            event.stopPropagation();
            if(unlockNodeMoveing===true) return;
            unlock();
            unlockNode.classList.remove('iu-active-est');
            unlockBtn.classList.add('iu-btn-hideen-est');
            document.removeEventListener('click',hiddfun);
        }
        unlockBtn.addEventListener('click',unlockBtnClick.bind(unlockBtn));
        unlockNode.addEventListener('click',(e)=>{
            e.stopPropagation();
            //document 添加点击事件 隐藏解锁按钮
            document.addEventListener('click',hiddfun);
            e.target.classList.add('iu-active-est');
            unlockBtn.classList.remove('iu-btn-hideen-est');
        })
        function hiddfun(e){
            if(unlockNodeMoveing===true) return;
            e.stopPropagation();
            unlockNode.classList.remove('iu-active-est');
            unlockBtn.classList.add('iu-btn-hideen-est');
            //隐藏后 document移除点击事件 隐藏解锁按钮事件
            document.removeEventListener('click',hiddfun);
        }
    }

    //添加按钮 func
    function addBtn(){
        let node = document.createElement("interview-unlock");
        node.id = "iu-est";
        node.classList.add('left')
        // node.className = "interview-unlock";
        // 再次打开窗口小于之前窗口的情况,导致按钮出现在可视窗口之外
        let screenClientHeight = document.documentElement.clientHeight;
        screenClientWidth = document.documentElement.clientWidth;
        let tempHeight = screenClientHeight - 250;
        node.style.cssText = "position:fixed;top:"+tempHeight+"px;left:0px;right:"+(screenClientWidth-70)+"px;";
        // 改变窗口大小的情况
        window.onresize = function(){
            let screenClientHeight = document.documentElement.clientHeight;
            screenClientWidth = document.documentElement.clientWidth;
            let positionTop = document.querySelector('#iu-est').offsetTop;
            let offsetHeight = node.offsetHeight;
            let tempHeight;
            if (positionTop+offsetHeight>screenClientHeight){
                tempHeight = screenClientHeight - offsetHeight;
            } else{
                tempHeight = positionTop;
            }
            node.style.top = tempHeight + "px";
        }

        node.innerHTML = '<interview-unlock-button class="iu-btn-est iu-btn-hideen-est">解锁</interview-unlock-button>';
        if(window.self === window.top){
            if (document.querySelector("body")){
                document.body.appendChild(node);
            } else {
                document.documentElement.appendChild(node);
            }
        }

        let style = document.createElement("style");
        style.type="text/css";

        var styleInner = "interview-unlock,interview-unlock-button{display:block;}#iu-est{text-align:center;width:70px;height:35px;line-height:35px;border-radius:35px;display:block;cursor:pointer;color:#fff;background-color:red;margin:0;padding:0;opacity:0.5;transition:all 0.3s linear;user-select:none;z-index:9999;}#iu-est.left{transform:translate(-50%,0);}#iu-est.right{transform:translate(50%,0);}#iu-est.iu-active-est{transform:translate(0,0);opacity:1;}.iu-btn-est{cursor:move;}.iu-btn-hideen-est{display:none;}";
        style.innerHTML = styleInner;

        if(document.querySelector("#iu-est")){
            // console.log("通过style插入");
            document.querySelector("#iu-est").appendChild(style);
        } else {
            // console.log("通过GM插入");
            GM_addStyle(styleInner);
        }
    };
})();