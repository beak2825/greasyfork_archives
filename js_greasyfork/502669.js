// ==UserScript==
// @name         fuclaude
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  fuclaude!
// @author       You
// @match        https://claude.365day.win/*
// @match        https://demo.fuclaude.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=365day.win
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/502669/fuclaude.user.js
// @updateURL https://update.greasyfork.org/scripts/502669/fuclaude.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand("清空fk", function(e) {
        GM_deleteValue("fk")
    }, {
        autoClose: true
    });
    let fk=GM_getValue("fk")

    async function login(url){
        const st=document.querySelector("#submit-token");
        if(st){
            // 创建一个 FormData 对象
            const formData = new FormData();

            // 添加数据到 FormData 对象
            formData.append('action', 'token');
            formData.append('session_key', fk);
            await unsafeWindow.fetch(url,{method:"POST",body:formData})
            location.href="/new"
        }
    }


    if(location.href.indexOf("/login?state=")!==-1){
        console.log(fk)
        if(fk){
            login("/login_token?state="+location.href.split("=")[1])
        }else{
            const target=document.querySelector("body")
            const config = { childList: true};
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    let addedNodesArray = Array.from(mutation.addedNodes);
                    let exists = addedNodesArray.some(node => node.className.indexOf('swal2-container')!==-1 );
                    if(exists){
                        document.querySelector("button.swal2-confirm").addEventListener('click',()=>{
                            fk=document.querySelector("#swal2-input").value
                            GM_setValue('fk', fk);
                            observer.disconnect();
                        })
                    }
                });
            });

            // 以上述配置开始观察目标节点
            observer.observe(target, config);
        }
    }
})();