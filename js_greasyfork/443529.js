// ==UserScript==
// @name         Improved blacklist function&&ブラックリスト機能の改善
// @namespace    null
// @version      1.1.2
// @description  Block several channels at once&&一度に複数のチャネルをブロックする
// @author       null
// @match        *://*.youtube.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/443529/Improved%20blacklist%20function%E3%83%96%E3%83%A9%E3%83%83%E3%82%AF%E3%83%AA%E3%82%B9%E3%83%88%E6%A9%9F%E8%83%BD%E3%81%AE%E6%94%B9%E5%96%84.user.js
// @updateURL https://update.greasyfork.org/scripts/443529/Improved%20blacklist%20function%E3%83%96%E3%83%A9%E3%83%83%E3%82%AF%E3%83%AA%E3%82%B9%E3%83%88%E6%A9%9F%E8%83%BD%E3%81%AE%E6%94%B9%E5%96%84.meta.js
// ==/UserScript==
(function() {
Add_URL_List()
    function Add_URL_List (){
        let language = navigator.language,URL_list=[],show,SetList,wait
        let yagoo=document.querySelector("#html-body"),map,map2,destination
        let Menu_Set = new MutationObserver((E) => {
            if(E[0]?.addedNodes[0]?.nodeName =="YTCP-CHANNEL-SETTINGS-DIALOG"){
                let allblock=E[0]?.addedNodes[0]
                map = allblock.children[0].children[0].children[0].children[1]
                show=allblock.querySelector("h1#dialog-title")
                Menu_Set.disconnect()
                Menu_Map.observe(map,{childList: true})
            }
        });
        yagoo&&Menu_Set.observe(yagoo,{childList: true})
        let Menu_Map = new MutationObserver((E) => {
            if (E[0]?.addedNodes[0].nodeName =="YTCP-NAVIGATION"){
                map2 = E[0]?.addedNodes[0]
                Menu_Map.disconnect()
                Menu_Map2.observe(map2,{childList: true,subtree:true})
            }
        });
        let Menu_Map2 = new MutationObserver((item) => {
            item.forEach((node)=>{
                node.addedNodes.forEach((no)=>{
                    if (no.nodeName =="YTCP-COMMUNITY-SETTINGS"){
                        destination=no
                        fun()
                        Menu_Map2.disconnect()
                    }
                })
            })
        });
        function language_(en,zh,jp) {
            switch (language) {
                case "en-US":
                    return en
                case "zh-CN":
                    return zh
                case "ja":
                    return jp
                default:
                    return en
            }
        }
        function Queue_(){
            SetList.value = URL_list.length-1
            let ul = URL_list.shift()
            WriteBlock(ul)
            wait=setTimeout(()=>{
                let pvp=document.querySelectorAll("#text-input")[2]
                pvp.innerText= ""
                pvp.value= ""
                URL_list.length&&Queue_()
            },2000)
        }
        function WriteBlock(url){
            let pvp=document.querySelectorAll("#text-input")[2]
            let ie= new InputEvent("input")
            pvp.innerText= url
            pvp.value= url
            pvp.dispatchEvent(ie);
            pvp.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.focus()
            let event = document.createEvent('Event')
            event = new KeyboardEvent('keyup',{keyCode: 13})
            pvp.focus()
            pvp.dispatchEvent(event)
        }
        const on = GM_registerMenuCommand(language_("Blacklist extension script","黑名单扩展脚本","ブラックリスト拡張スクリプト"), () => {
            destination&&fun()
        });
        function fun(){
            document.querySelectorAll("ytcp-channel-picker-form-container")[0].disabled=true
            document.querySelectorAll("ytcp-channel-picker-form-container")[0].style.display="none"
            document.querySelectorAll("ytcp-channel-picker-form-container")[1].disabled=true
            document.querySelectorAll("ytcp-channel-picker-form-container")[1].style.display="none"
            document.querySelectorAll("ytcp-channel-picker-form-container")[2].querySelector("#chip-bar-container-hint").innerHTML +=
                '<input id="SetList" type="button" value="Add" style="border: 0px;">'
            document.querySelectorAll("ytcp-channel-picker-form-container")[2].querySelector("#chip-bar-container-hint").parentNode.innerHTML +=
                '<div style="height: 150px;width: 600px;"><textarea id="URL_List" placeholder="'+
                language_("Channel URL ","频道网址","チャネルURL")
                +'" style="width: 600px;height: 150px;background: #000000fa;margin: 0px;border: 0px;color: #f5f5dcb5;"></textarea></div>'
            document.querySelector("#SetList").onclick=()=>{
                URL_list = document.querySelector("#URL_List").value.split('\n')
                Queue_()
            }
            SetList = document.querySelector("#SetList")
            let Yagoo=document.querySelectorAll("tp-yt-paper-listbox#channel-results-container")[2]
            let Menu_Set = new MutationObserver((E) => {
                if (E[0].addedNodes[0]&&E[0].addedNodes[0].tagName == "TP-YT-PAPER-ITEM"){
                    Yagoo.click()
                    Yagoo.children[0].click()
                }
            });
            Menu_Set.disconnect()
            Menu_Set.observe(Yagoo,{childList: true,})
        }
    }
})();