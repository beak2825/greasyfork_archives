// ==UserScript==
// @name         碧蓝幻想手机通知助手
// @namespace    muu
// @version      0.5
// @description  碧蓝幻想副本团灭或打完后，手机收到通知
// @author       muu
// @license      MIT
// @match        *://game.granbluefantasy.jp/*
// @match        *://gbf.game.mbga.jp/*
// @icon         http://game.granbluefantasy.jp/favicon.ico
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.7.5/dist/sweetalert2.all.min.js
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/465353/%E7%A2%A7%E8%93%9D%E5%B9%BB%E6%83%B3%E6%89%8B%E6%9C%BA%E9%80%9A%E7%9F%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/465353/%E7%A2%A7%E8%93%9D%E5%B9%BB%E6%83%B3%E6%89%8B%E6%9C%BA%E9%80%9A%E7%9F%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function showSettings(){
        let html = `
<li>
  <input type="text" id="msgUrl" placeholder="链接" class="swal2-input" />
</li>

<li>
  <span>推送：</span>
  <select class="swal2-input" id="msgChannel">
    <option value="1">微信</option>
    <option value="2">QQ</option>
    <option value="3">钉钉</option>
    <option value="4">Discord</option>
    <option value="5">Bark</option>
  </select>
</li>
<li class="lh-item lh-target-blank">
  <label>
    <input id="die" type="checkbox" />
    <span>全灭提醒</span>
  </label>
  <label style="margin-left: 20px">
    <input id="over" type="checkbox" />
    <span>打完提醒</span>
  </label>
</li>
<style type="text/css">
  .swal2-container {
    z-index: 9999;
  }
</style>
        `;
        Swal.fire({
            title: "链接配置",
            html:html,
            showCancelButton: true,
            customClass: {
                popup: "lh-popup",
                content: "lh-content",
                closeButton: "lh-close"
            },
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            didOpen(){
                $("#msgUrl")[0].value = GM_getValue("msgUrl","");
                $("#msgChannel")[0].value = GM_getValue("msgChannel","1");
                $("#die").attr("checked",GM_getValue("die",false));
                $("#over").attr("checked",GM_getValue("over",true));
            }
        }).then((res) =>{
            if (res.isConfirmed) {
                GM_setValue("msgUrl", $("#msgUrl")[0].value);
                GM_setValue("msgChannel", $("#msgChannel")[0].value);
                GM_setValue("die", $("#die").prop('checked')?true:false);
                GM_setValue("over", $("#over").prop('checked')?true:false);
                Swal.fire({
                    toast: true,
                    showConfirmButton: false,
                    timer: 2000,
                    type: 'success',
                    title: '设置成功',
                    customClass: {
                        popup: "lh-popup",
                        content: "lh-content",
                        closeButton: "lh-close"
                    }
                })
            }
        })
    }
    GM_registerMenuCommand("配置", showSettings);
    //全灭通知
    if(GM_getValue("die")){
        window.addEventListener('load', () => {
            setTimeout(() => {
                let hash = location.hash
                if (/^#raid(_multi)?\/\d/.test(hash)) {
                    var tips = document.querySelector(".prt-tips");
                    const observer = new MutationObserver((mutationList) => {
                        if(tips.style.display=="block"){
                            GM_notification({
                                title: '碧蓝幻想全灭了',
                                text: '看一下',
                                timeout: 2000
                            })
                            switch(GM_getValue("msgChannel")){
                                case "3":
                                    GM_xmlhttpRequest({
                                        method: "POST",
                                        url: GM_getValue("msgUrl"),
                                        headers: {
                                            "Content-Type": 'application/json;charset=utf-8'
                                        },
                                        data: JSON.stringify({
                                            "msgtype": "text",
                                            "text": {
                                                "content": "碧蓝幻想团灭了,快来救救啊"
                                            }
                                        })
                                    })
                                    break;
                                case "4":
                                    GM_xmlhttpRequest({
                                        method: "POST",
                                        url: GM_getValue("msgUrl"),
                                        headers: {
                                            "Content-Type": 'application/json;charset=utf-8'
                                        },
                                        data: JSON.stringify({
                                            "content": "碧蓝幻想团灭了,快来救救啊"
                                        })
                                    })
                                    break;
                                default:
                                    GM_xmlhttpRequest({
                                        method: "GET",
                                        url: GM_getValue("msgUrl")+"碧蓝幻想团灭了,快来救救啊"
                                    })
                            }
                        }
                    })
                    observer.observe(tips, { attributes:true })
                }
            }, 2000)
        })
    }
    //打完通知
    if(GM_getValue("over")){
        window.addEventListener('hashchange', () => {
            let hash = location.hash
            if (/^#result_multi\/\d/.test(hash)) {
                GM_notification({
                    title: '碧蓝幻想打完了',
                    text: '看一下',
                    timeout: 2000
                })
                switch(GM_getValue("msgChannel")){
                    case "3":
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: GM_getValue("msgUrl"),
                            headers: {
                                "Content-Type": 'application/json;charset=utf-8'
                            },
                            data: JSON.stringify({
                                "msgtype": "text",
                                "text": {
                                    "content": "碧蓝幻想打完了，速开下一把"
                                }
                            })
                        })
                        break;
                    case "4":
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: GM_getValue("msgUrl"),
                            headers: {
                                "Content-Type": 'application/json;charset=utf-8'
                            },
                            data: JSON.stringify({
                                "content": "碧蓝幻想打完了，速开下一把"
                            })
                        })
                        break;
                    default:
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: GM_getValue("msgUrl")+"碧蓝幻想打完了，速开下一把"
                        })
                }
            }
        })
    }
}());