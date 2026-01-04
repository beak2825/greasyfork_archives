// ==UserScript==
// @name         新华三社区黑名单
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  给社区添加黑名单过滤
// @author       covis
// @match        https://bbs.h3c.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant  unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449196/%E6%96%B0%E5%8D%8E%E4%B8%89%E7%A4%BE%E5%8C%BA%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/449196/%E6%96%B0%E5%8D%8E%E4%B8%89%E7%A4%BE%E5%8C%BA%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const blackInput=`<div style="width:100%;display: flex;align-items: center;">
    <input id="blacklistInput" type="text" autocomplete="off" placeholder="请输入黑名单作者" class="el-input__inner" style="height:30px">
    <button id="blacklist-button" type="button" class="el-button el-button--primary el-button--mini" style="margin-left:10px"><!----><!----><span>添加</span></button>
    </div>`

    document.querySelector('#app').__vue__.$router.afterHooks.push(()=>{
        let timer = setTimeout(()=>{
            console.log('路由发生改变') ;
            console.log(window.location.href) ;
            if(window.location.href===`https://bbs.h3c.com/`){
                console.log(document.getElementById("black-list"))
                if(document.getElementById("black-list")===null){
                    init()
                }
            }
        },500)
        })

    function init(){
        let timer = setTimeout(()=>{
            const body = document.getElementById("right-part");
            var curHtml = body.innerHTML;
            body.innerHTML= `<div id="black-list" style="padding: 0 10px;margin-top: 5px;">`+ blackInput + `<div id="black-list-span" style="margin-top: 5px;"></div></div>` + curHtml
            //  body.innerHTML= blackInput + curHtml
            document.getElementById("blacklist-button").addEventListener("click", addBlackList );
            var curLength=0
            let interval = setInterval(()=>{
                var ul = document.getElementsByClassName('article-list-ul')[0];
                if(ul&&ul.childNodes.length!==curLength){
                    clear()
                    curLength=ul.childNodes.length
                }

            },200)
            refreshBlackList()
            setUrlBlank()
        },500)
    }


    function setUrlBlank(){
        var alist= document.getElementsByClassName('context-container')
        for (let i = 0; i < alist.length; i++) {
            alist[i].addEventListener("click", newOpen );
        }
        var alist2= document.getElementsByClassName('text-wrapper')
        for (let i = 0; i < alist2.length; i++) {
            alist2[i].removeEventListener('click',"",false)
        }

    }
    function newOpen(){
        console.log("xxxxx")
    }
    function getBlackList(){
        console.log("getBlackList")
        var list = localStorage.getItem("blacklist")
        const blackList = document.getElementById("black-list-span");

        if(list){
            var list2=list.split(";")
            var flag=0
            for (let i = 0; i < list2.length; i++) {
                var spanElement = document.createElement("span");
                spanElement.setAttribute("class", "el-tag el-tag--danger el-tag--small el-tag--light")
                spanElement.setAttribute("style", "margin: 2px;")
                spanElement.innerHTML = list2[i]

                var iElement = document.createElement("i");
                iElement.setAttribute("class", "el-tag__close el-icon-close")
                iElement.setAttribute("id", "xxx-"+i)
                iElement.setAttribute("title", list2[i])
                spanElement.appendChild(iElement);
                blackList.appendChild(spanElement);
                document.getElementById("xxx-" + i).addEventListener("click", removeBlackList );
            }
        }
        return blackList;
    }

    function removeBlackList(){
        var title= this.getAttribute("title")
        var list = localStorage.getItem("blacklist")
        var result="";
        if(list){
            var list2=list.split(";")
            var index = list2.indexOf(title)

            if (index > -1) {
                list2.splice(index, 1);
            }
            for (let i = 0; i < list2.length; i++) {
                if(i===0){
                    result = list2[i]
                }else{
                    result = result +";"+ list2[i]
                }
            }
            localStorage.setItem("blacklist",result)
            refreshBlackList()
            clear()
        }
    }

    function addBlackList(){
        console.log("addBlacklist")
        var text = document.getElementById("blacklistInput").value;
        if(text===null || text==="" || text===" "){
            console.log("空值不处理")
            return;
        }
        var list = localStorage.getItem("blacklist")
        if(list){
            var list2=list.split(";")
            var flag=0
            for (let i = 0; i < list2.length; i++) {
                if(list2[i]===text){
                    flag=1
                }
            }
            if(flag===0){
                localStorage.setItem("blacklist", list +";"+ text)
                document.getElementById("blacklistInput").value=""
                clear()
            }
        }else{
            localStorage.setItem("blacklist",text)
            document.getElementById("blacklistInput").value=""
            clear()
        }
        refreshBlackList()
    }

    function refreshBlackList(){
        console.log("refreshBlackList")
        const blackList = document.getElementById("black-list-span");
        while (blackList.hasChildNodes()) {
            blackList.removeChild(blackList.firstChild);
        }
        getBlackList();
        clear()
    }

    function isBlackList(user){
        var exist=false
        var list = localStorage.getItem("blacklist")
        if(list){
            var list2=list.split(";")
            for (let i = 0; i < list2.length; i++) {
                if(user===list2[i]){
                    exist=true
                }
            }
        }
        return exist;
    }

    function clear(){
        var ul=document.getElementsByClassName('article-list-ul')[0];
        for (let i = 0; i < ul.childNodes.length; i++) {
            const element = ul.childNodes[i];
            for (let j = 0; j < element.childNodes.length; j++) {
                const element2 = element.childNodes[j];
                if(element2.className==="context-container"){
                    for (let k = 0; k < element2.childNodes.length; k++) {
                        const element3 = element2.childNodes[k];
                        if(element3.className==="meta-container"){
                            const element4 = element3.firstChild
                            for (let w = 0; w < element4.childNodes.length; w++) {
                                const element5 = element4.childNodes[w];
                                if(element5.className==="el-popover__reference-wrapper"){
                                    const end = element5.firstChild
                                    var elementStyle = element.style
                                    if(isBlackList(end.innerText)){
                                        elementStyle['display'] = 'none'
                                    }else{
                                        elementStyle['display'] = ''
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Your code here...
})();