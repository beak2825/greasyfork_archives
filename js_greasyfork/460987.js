// ==UserScript==
// @name         gitee 自动填充commit到pr标题
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  gitee 自动填充commit到pr标题，多个则拼接
// @author       xxyangyoulin
// @match        https://gitee.com/*/pull/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460987/gitee%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85commit%E5%88%B0pr%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/460987/gitee%20%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85commit%E5%88%B0pr%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

function handle(){
    let prt = document.getElementById('pull_request_title')
    if (!prt) return
    Array.prototype.forEach.call(document.getElementsByClassName('markdown-body'),function(item,index,arr){
        if(item.innerText.indexOf("Merge ")===0)return
        if(prt.value)prt.value = prt.value+"; "
        prt.value = prt.value+item.innerText
    });

    //默认删除本分支
    if(document.getElementById("pull_request_source_branch").value!="develop")
        document.getElementsByClassName("prune-checkbox")[0].click();

    Array.prototype.forEach.call(document.getElementsByName('normal_commit'),function(item,index,arr){
        item.removeAttribute('disabled')
        item.classList.remove("disabled")
    });
}
(function() {
    window.onload = function name() {
        setTimeout(() => {
            handle();
            document.getElementById('pull_request_source_branch').onchange = function(){
                console.log(1)
                handle();
            }
        }, 500);
    }
})();