// ==UserScript==
// @name         水源签名档
// @namespace    http://tampermonkey.net/
// @version      0.3.0-beta
// @description  为水源添加签名档功能
// @author       You
// @match        https://shuiyuan.sjtu.edu.cn/*
// @license      GPL-3.0-only
// @grant none
// @require   https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js
// @require   https://cdn.jsdelivr.net/npm/dayjs@1/plugin/relativeTime.js
// @require   https://cdn.jsdelivr.net/npm/dayjs@1/locale/zh-cn.js
// @downloadURL https://update.greasyfork.org/scripts/483529/%E6%B0%B4%E6%BA%90%E7%AD%BE%E5%90%8D%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/483529/%E6%B0%B4%E6%BA%90%E7%AD%BE%E5%90%8D%E6%A1%A3.meta.js
// ==/UserScript==
(async ()=> {
    'use strict';

    // Your code here...
    dayjs.extend(dayjs_plugin_relativeTime)
    dayjs.locale('zh-cn')

    let checked = false
    await waitForPage()
    spawnObserver(document.querySelector("#reply-control"),(records)=>{
        if(records.find((e)=>e.addedNodes[0]?.className === "d-editor-button-bar")){
            document.querySelector("div.save-or-cancel > button.create").insertAdjacentHTML("afterend",`<div style="margin: 1vh 0vw 1vh 2vw;width:20vw;max-width:20em">
            <input type="checkbox" id="appendSignature" name="appendSignature" /><label for="signature" style = "display:inline;">签名档:</label>
    <textarea id="signature" name="signature" style="width:100%;height:5vh"/>
    </div>`)
            document.querySelector("#signature").value = localStorage.getItem("shuiyuan_signature")??""
            document.querySelector("#appendSignature").addEventListener("click", function(){localStorage.setItem('shuiyuan_doAppendSignature', this.checked?"checked":"")});
            document.querySelector("#appendSignature").checked = localStorage.getItem('shuiyuan_doAppendSignature')==="checked";
        }})
    window.require("discourse/models/rest").default.prototype.beforeCreate = function(props){
        const signature = document.querySelector("#signature").value
        localStorage.setItem("shuiyuan_signature", signature)
        console.log(signature)
        checked =document.querySelector("#appendSignature").checked
        if(checked){
            if(signature!==""){
                function formatString(stringToFormat) {
                    return stringToFormat.replaceAll(/\{\{\{(\w+):([\w-]+?)\}\}\}/g, (match, p1, p2) => {
                        if(p1 === "timeUntil") return dayjs(p2).diff(dayjs(),'day')
                        else if(p1 === "timeFrom") return dayjs().diff(dayjs(p2),'day')
                    })
                }
                props.raw = props.raw + `\n<div data-signature>\n\n---\n${formatString(signature)}\n</div>`
                props.hasSignature = true
            }
        }
    }
})();
function waitForPage(){
    return new Promise((resolve, reject)=>{
        if(document.querySelector("#main-outlet-wrapper")!==null) resolve()
        else {
            spawnObserver(document.documentElement, (records, observer)=>{
                if(records.find((e)=>e.addedNodes[0]?.id === "main-outlet-wrapper")){
                    observer.disconnect()
                    resolve()
                }})
        }
    })
}
function spawnObserver(element, callback){
    const replyEditorObserver = new MutationObserver((records,observer)=>{callback(records, observer)});
    replyEditorObserver.observe(element,{subtree: true, childList: true, attributes:false });
}