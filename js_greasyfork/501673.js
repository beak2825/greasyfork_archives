// ==UserScript==
// @name         自动输入fk
// @namespace    http://tampermonkey.net/
// @version      0.2.7
// @description  自动输入fk!
// @author       hswmartinx
// @match        https://gptchat.365day.win/*
// @match        https://new.oaifree.com/*
// @icon         https://hswpicgo.oss-cn-guangzhou.aliyuncs.com/pic/a.svg
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/501673/%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5fk.user.js
// @updateURL https://update.greasyfork.org/scripts/501673/%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5fk.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand("清空fk", function(e) {
        GM_deleteValue("fk")
    }, {
        autoClose: true
    });
    let fk=GM_getValue("fk")


    function login(){
        const st=document.querySelector("#submit-token");
        if(st){
            // 创建一个 FormData 对象
            const formData = new FormData();

            // 添加数据到 FormData 对象
            formData.append('action', 'token');
            formData.append('access_token', fk);
            fetch("/auth/login_token",{method:"POST",body:formData})
            location.href="/"
        }
    }

    if(location.href.indexOf("/auth/login_auth0")!==-1){
        if(fk){
            login()
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