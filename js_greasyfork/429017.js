// ==UserScript==
// @name         验证码自动填充
// @namespace    mscststs
// @version      0.1
// @description  自动写码
// @author       You
// @match        http://111.63.208.5:81/hallEnter/*
// @require https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=713767
// @icon         https://www.google.com/s2/favicons?domain=208.5
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429017/%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/429017/%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (async ()=>{
     await mscststs.wait(".ValidCode");
    // 选择需要观察变动的节点
    const targetNode = document.querySelector(".ValidCode");

    function setCode(){
        const code = targetNode.innerText.replace(/\s/g,"")
        console.log(code);
        document.querySelector(".login-input.code-input > input").value = code;
        document.querySelector(".login-input.code-input > input").dispatchEvent(new Event("input"))
    }

    // 观察器的配置（需要观察什么变动）
    const config = { attributes: true, childList: true, subtree: true };

    // 当观察到变动时执行的回调函数
    const callback = function(mutationsList, observer) {
        setCode()
    };
    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 以上述配置开始观察目标节点
    observer.observe(targetNode, config);
    setCode()
     })()

})();