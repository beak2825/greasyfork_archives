// ==UserScript==
// @name         复制节点列表
// @namespace    http://tampermonkey.net/
// @version      0.3.5
// @description  try to take over the world!
// @author       hswmartin
// @match        https://nnr.moe/rules/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nnr.moe
// @require      https://cdn.jsdelivr.net/npm/marked@13.0.3/lib/marked.umd.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @grant        unsafeWindow
// @run-at       document-start
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand


// @downloadURL https://update.greasyfork.org/scripts/501124/%E5%A4%8D%E5%88%B6%E8%8A%82%E7%82%B9%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/501124/%E5%A4%8D%E5%88%B6%E8%8A%82%E7%82%B9%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    .swal2-container{
    z-index:5001
    }
    `)
    let oldAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (...args) {
        if (args.length !== 0 && this?.className==="ccp") {
            return;
        }
        return oldAdd.call(this, ...args);
    };

    const target=document.querySelector("body")
    const config = { attributes: true,subtree:true,attributeFilter:["mdui-tooltip"]};
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.target.onclick=null
        });
    });

    // 以上述配置开始观察目标节点
    observer.observe(target, config);

    function copy(){
        let s="| 描述  | host | 起始  | 结束  | 详情  |\n| --- | --- | --- | --- | --- |\n"
        document.querySelectorAll('#add_dialog .mdui-row')[0].querySelectorAll(' .mdui-select option').forEach(o=>{let d=eval("("+o.getAttribute('data')+")");s+="|"+d.name+"|"+d.host+"|"+d.min+"|"+d.max+"|"+d.detail.replaceAll("\n",",")+"|\n"})
        GM_setClipboard(s, "text", console.log(s))
        Swal.fire({
            title: "复制成功",
            text: "已经复制到剪贴板中！！！",
            html: marked.parse(s),
            icon: "success",
            width: "90vw"
        });
    }
    GM_registerMenuCommand("复制节点",copy)
    // Your code here...
})();