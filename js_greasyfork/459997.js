// ==UserScript==
// @name         chatGPT tools Plus（修改版）
// @namespace    http://tampermonkey.net/
// @version      3.6.7
// @description  Google、必应、百度、Yandex、360搜索、谷歌镜像、搜狗、b站、F搜、duckduckgo、CSDN侧边栏Chat搜索，集成国内一言，星火，天工，混元，通义AI，ChatGLM，360智脑,miniMax，DeepSeek、Gemini。即刻体验AI，无需翻墙，无需注册，无需等待！
// @description:en  Google, Bing, Baidu, Yandex, 360 Search, Google Mirror, Sogou, B Station, F Search, DuckDuckgo, CSDN sidebar CHAT search, integrate domestic words, star fire, sky work, righteous AI, Chatglm, 360 wisdom, 360 wisdom brain. Experience AI immediately, no need to turn over the wall, no registration, no need to wait!
// @description:zh-TW     Google、必應、百度、Yandex、360搜索、谷歌鏡像、搜狗、b站、F搜、duckduckgo、CSDN側邊欄Chat搜索，集成國內一言，星火，天工，通義AI，ChatGLM，360智腦。即刻體驗AI，無需翻墻，無需註冊，無需等待！
// @author       夜雨
// @match      https://cn.bing.com/*
// @match      https://www.bing.com/*
// @match      *://*.bing.com/*
// @match      https://chat.openai.com/chat
// @match      https://www.google.com/*
// @match      https://duckduckgo.com/*
// @match      https://www.so.com/s*
// @match      *://m.so.com/s*
// @match      *://www.baidu.com/s*
// @match      https://www.baidu.com/*
// @match      https://m.baidu.com/*
// @match      *://baidu.com/s*
// @match      *://yandex.ru/search*
// @match      *://yandex.com/search*
// @match      https://search.ecnu.cf/search*
// @match      https://search.aust.cf/search*
// @match      https://search.*.cf/search*
// @match      https://*.cf:*/*
// @match      *://gooo.azurewebsites.net/*
// @match      https://fsoufsou.com/search*
// @match      https://www.google.com.hk/*
// @match      *://www.sogou.com/*
// @match      *://m.sogou.com/*
// @match      *://chat.scnet.cn/*
// @match      *://wap.sogou.com/*
// @match      *://*.tiangong.cn/*
// @match      *://www.bilibili.com/video/*
// @match      *://blog.csdn.net/*/article/details/*
// @match      *://chatglm.cn/*
// @icon64      data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAZlBMVEUAAAD///+hoaFoaGhsbGy7u7vd3d2+vr76+vra2tr29va2trYrKyvg4ODs7OxXV1dgYGCtra0xMTGXl5fExMQ6OjqOjo7R0dEVFRWnp6dSUlIiIiIcHBwLCwt4eHhycnKEhIRHR0f14+hfAAADN0lEQVRYhe1WyZajMAyEsMQshgABEwIJ+f+fbC02W0yHnjnNvNYFDFbZKpUlO86v/e/Wpve/8M4TFckwSvI/cx8z11g2/tw9vZKrEIKe159GUkvwipPxVb4eQQzvYV12XX3Y/x6BT5LqUZkgWixEHF/9/hAAeozz0I8nOtzoccDfg8CbaZQrYkOGYUaEFO2RDUTT4MZefjkMpVcQo5/Wr2DSi9/bhlYPhukvZqf41l3hiiFv8xJR2CslIT+XXfc+YapojY60kG1ZA0rknj+lL4YtnGCQ4lbESSczf5R6Ugc5ee4AoL9KAwbwYXDWXJTXhaDhf2L3R44rxzkbgFgHn55Y0JJjzyeONpYLDn4CCPn7A46VaggjwIB6eEltAOConCUAcZVDXBKIHHgbp9IZ4KW0AZj8LAHaQEzaY0lmHk60AXiQ8XYFEDoVrRpXOmSfdQFfbMe7MuTOJMLU6IJqkh7PuTMVrhosAJCp2xrApA6Lk+p4VllMQjsAcNNkpzeQlKkPHhQb0VkAEgO8TSMaVqhMH/EyW57W2R7moNoBCjwDPg1QzM07QAk7o+wUrIcNwAVZ1ktAROE7gBMaEq4kaW8NgHlQOsrULiUoHjGT40PIqngHOIGYzRK22ggJz3TpbrCt7AMU9gPZwc4y5slJC7FO4woAxmcLgMMi0dF1ymSOtnMEYFDczxqtdJRM6HlAbhSvARIqHG+G5BJGqONoK2opooIMLQFaYMvWs0EJruNRV1b8vy+wqDtbEj2caAcQg5NWdIQL6IJPjIGg1gDKhLINARyxed4DpgLFq+vvKoRiEszGWmlCy0OmcyrqSxKr/eaUzFvDGnDWCX2d5zQmNdJsO4xoz8XeyqcpIdRexZ0BBOYl2r2wyHfwB2WFO0zBjS/Zv2Vc8Pey3l3kor0iR65Q+61Vr6GmttNSOtxRf+jgvfnW3eFa4CZ+3fb1k1q1uC0D3GmKC2s5zkxKvieqWbKQPvFpfbRnNF+pYn/+3ny6m0zW+9eYDIMxlQsbvKuO3zfrV5fWKMc4GLu6G+m2KY/fNNnu6/vu2drTv7fFjVuOP3dHy5MolJEqrKfvoPXp57vpr/3r9gUxwiW4OiuC3wAAAABJRU5ErkJggg==
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_openInTab
// @grant      GM_registerMenuCommand
// @grant      GM_setValue
// @grant      GM_getValue
// @grant      GM_getResourceText
// @grant      GM_setClipboard
// @grant      GM_info
// @run-at     document-end
// @require    https://bowercdn.net/c/jquery-3.4.0/dist/jquery.min.js
// @require    https://s4.zstatic.net/ajax/libs/showdown/2.1.0/showdown.min.js
// @require    https://s4.zstatic.net/ajax/libs/highlight.js/11.7.0/highlight.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require    https://s4.zstatic.net/ajax/libs/KaTeX/0.16.6/katex.min.js
// @require    https://bowercdn.net/c/toastr-2.1.3/toastr.min.js
// @require    https://s4.zstatic.net/ajax/libs/marked/13.0.2/marked.min.js
// @resource toastCss  https://cdn.bootcdn.net/ajax/libs/toastr.js/2.1.3/toastr.min.css
// @resource katexCss  https://cdn.bootcdn.net/ajax/libs/KaTeX/0.16.6/katex.css
// @connect    api.forchange.cn
// @connect    hunyuan.tencent.com
// @connect    yuanbao.tencent.com
// @connect    baichuan-ai.com
// @connect    chatbot.theb.ai
// @connect    cbjtestapi.binjie.site
// @connect    freechatgpt.xgp.one
// @connect    luntianxia.uk
// @connect    xjai.pro
// @connect    zw7.lol
// @connect    chatforai.store
// @connect   aifree.site
// @connect   ai5.wuguokai.top
// @connect   chat.aidutu.cn
// @connect   aichat.leiluan.cc
// @connect   chat.gptservice.xyz
// @connect   promplate.dev
// @connect   ai.ls
// @connect   letsearches.com
// @connect   powerchat.top
// @connect   wobcw.com
// @connect   chat.68686.ltd
// @connect   qianwen.biz.aliyun.com
// @connect   t-chat.cn
// @connect   free.anzz.top
// @connect   chat.ohtoai.com
// @connect   freeopenai.xyz
// @connect   supremes.pro
// @connect   onrender.com
// @connect   free-chat.asia
// @connect   chat7.aifks001.online
// @connect   a0.chat
// @connect   chatgpt.com
// @connect   www.ftcl.store
// @connect   sunls.me
// @connect   chat.bushiai.com
// @connect   chatgpt.qdymys.cn
// @connect   pp2pdf.com
// @connect   api.aichatos.cloud
// @connect   binjie.fun
// @connect   ai.fakeopen.com
// @connect   chat2.wuguokai.cn
// @connect   www.gtpcleandx.xyz
// @connect   gpt.esojourn.org
// @connect   free-api.cveoy.top
// @connect   chatcleand.xyz
// @connect   gptforlove.com
// @connect   xcbl.cc
// @connect   hz-it-dev.com
// @connect   6bbs.cn
// @connect   toyaml.com
// @connect   38.47.97.76
// @connect   lbb.ai
// @connect   lovebaby.today
// @connect   gamejx.cn
// @connect   chat86.cn
// @connect   ai001.live
// @connect   ai003.live
// @connect   ai006.live
// @connect   promptboom.com
// @connect   hehanwang.com
// @connect   caipacity.com
// @connect   chatzhang.top
// @connect   51mskd.com
// @connect   forwardminded.xyz
// @connect   1chat.cc
// @connect   api.minimax.chat
// @connect   cytsee.com
// @connect   skybyte.me
// @connect   alllinkai1.com
// @connect   baidu.com
// @connect   scnet.cn
// @connect   chatgptdddd.com
// @connect   anfans.cn
// @connect   bing.com
// @connect   openai.com
// @connect   generativelanguage.googleapis.com
// @connect   tongyi.aliyun.com
// @connect   qianwen.aliyun.com
// @connect   yuxin-ai.com
// @connect   xinghuo.xfyun.cn
// @connect   geetest.com
// @connect   neice.tiangong.cn
// @connect   chat.tiangong.cn
// @connect   work.tiangong.cn
// @connect   yeyu2048.xyz
// @connect   chatglm.cn
// @connect   open.bigmodel.cn
// @connect   gptgo.ai
// @connect   chat.360.cn
// @connect   mixerbox.com
// @connect   ohmygpt.com
// @connect   muspimerol.site
// @connect   frechat.xyz
// @compatible   Chrome
// @compatible   Firefox
// @license    MIT
// @website    https://yeyu2048.xyz/gpt.html

// @downloadURL https://update.greasyfork.org/scripts/459997/chatGPT%20tools%20Plus%EF%BC%88%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/459997/chatGPT%20tools%20Plus%EF%BC%88%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

// import {
//     GM_registerMenuCommand,GM_openInTab,GM_xmlhttpRequest,GM_setValue,GM_getValue,
//     GM_setClipboard,GM_addStyle
// }  from "../jslib/tampermonkey";
(function () {
    'use strict';


    const JSver = '3.6.7';


    function getGPTMode() {
        return localStorage.getItem("GPTMODE");
    }

    let darkTheme = localStorage.getItem("darkTheme")
    console.log(darkTheme)

    //katex Css
    try {
        GM_addStyle(GM_getResourceText("katexCss"))
    }catch (e) {}

    //toastr css
    try {
        GM_addStyle(GM_getResourceText("toastCss"))
    }catch (e) {}



    //(prefers-color-scheme: light)
    function addHeadCss() {
        if(!document.getElementById("github-markdown-link")){
            if(!darkTheme) {
                //暗黑
                $("head").append($(
                    '<link id="github-markdown-link" rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/github-markdown-css/5.2.0/github-markdown-dark.min.css">'
                ));
            }else{
                $("head").append($(
                    '<link id="github-markdown-link" rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.min.css">'
                ));
            }

        }
        if(!document.getElementById("highlight-link")){
            if(!darkTheme) {
                //暗黑
                $("head").append($(
                    '<link id="highlight-link" rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/styles/monokai-sublime.min.css">'
                ));
            }else{
                $("head").append($(
                    '<link id="highlight-link" rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/styles/atom-one-light.min.css">'
                ));
            }

        }

        //spark-js
        if(!document.getElementById("spark-js")){
            $("head").append($(
                '<script id="spark-js" src="https://static.geetest.com/g5/gd.js"></script>'
            ));
        }

    }
    setTimeout(addHeadCss)
    setInterval(addHeadCss,5000)




    try {
        console.log(
            `%c【chatGPT tools Plus】${JSver} 已加载`,
            'color: yellow;font-size: large;font-weight: bold;background-color: darkblue;'
        );
        const menu_updateChat_id = GM_registerMenuCommand("更新Chat", function (event) {
            GM_openInTab("https://greasyfork.org/zh-CN/scripts/459997")
        }, "updateChat");
        const menu_groupNum_id = GM_registerMenuCommand("交流群", function (event) {
            Toast.info("交流群7：817298021\n交流群6：792365186\n交流群4：745163513\n交流群3:177193765\n交流群2:734403992\n交流群1:710808464\n交流总群：249733992",
                "QQ交流群", {timeOut: 15000} )
        }, "groupNum");

        const menu_pubkey_id = GM_registerMenuCommand("更新key", function (event) {
            Toast.info("正在更新...")
            setPubkey();
        }, "PUBKEY");

        //禁用console 未转义警告
        hljs.configure({
            ignoreUnescapedHTML: true
        })

        //toastr配置
        toastr.options = {
            // "closeButton": false,
            // "debug": false,
            // "newestOnTop": false,
            // "progressBar": false,
            "positionClass": "toast-top-right", // 提示框位置，这里填类名
            // "preventDuplicates": false,
            // "onclick": null,
            "showDuration": "300",              // 提示框渐显所用时间
            "hideDuration": "300",              // 提示框隐藏渐隐时间
            "timeOut": "3000",                  // 提示框持续时间
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }


    } catch (ex) {
        console.error(ex)
    }

    //toastr 封装  ----start----
    const Toast = {

        warn: function(msg, title, options) {
            try {
                toastr.warning(msg, title, options)
            }catch (e) {}
        },
        info: function(msg, title, options) {
            try {
                toastr.info(msg, title, options)
            }catch (e) {}
        },
        success: function(msg, title, options) {
            try {
                toastr.success(msg, title, options)
            }catch (e) {}
        },
        error: function(msg, title, options) {
            try {
                toastr.error(msg, title, options)
            }catch (e) {}
        },
    };

    //toastr 封装  ----end----

    //封装GM_xmlhttpRequest ---start---
    async function GM_fetch(details) {
       return new Promise((resolve, reject) =>{
           switch (details.responseType){
               case "stream":
                   details.onloadstart = (res)=>{
                       resolve(res)
                   }
                   break;
               default:
                   details.onload = (res)=>{
                       resolve(res)
                   };
           }

           details.onerror = (res)=>{
               reject(res)
           };
           details.ontimeout = (res)=>{
               reject(res)
           };
           details.onabort = (res)=>{
               reject(res)
           };

           //中断支持
           if(details.responseType === "stream"){
               abortXml = GM_xmlhttpRequest(details)
           }else{
               GM_xmlhttpRequest(details)
           }

        });
    }

    function GM_httpRequest(details, callBack, errorCallback, timeoutCallback, abortCallback){
        if(callBack){
            switch (details.responseType){
                case "stream":
                    details.onloadstart = callBack;
                    break;
                default:
                    details.onload = callBack
            }
        }
        if(errorCallback){
            details.onerror = errorCallback;
        }
        if(timeoutCallback){
            details.ontimeout = timeoutCallback;
        }
        if(abortCallback){
            details.onabort = abortCallback;
        }
        console.log(details)
        //中断支持
        if(details.responseType === "stream"){
            abortXml = GM_xmlhttpRequest(details)
        }else{
            GM_xmlhttpRequest(details)
        }
    }

    //封装GM_xmlhttpRequest ---end---


    //is TM
    function isTM(){
        try{
            if(/Tampermonkey/gi.test(GM_info.scriptHandler)){
                return true;
            }else{
                return false;
            }
        }catch (e) {
            return false;
        }
    }

    //获取chrome版本
    function getChromeVersion() {
        try {
            const brands = navigator.userAgentData.brands
            for (let i = 0; i < brands.length; i++) {
               if(/Chromium/gi.test(brand[i].brand )){
                   return Number(brand[i].version)
               }
            }
        }catch (e) {
            return 0
        }
        return 0
    }

    const generateRandomIP = () => {
        const ip = [];
        for (let i = 0; i < 4; i++) {
            ip.push(Math.floor(Math.random() * 256));
        }
        console.log(ip.join('.'))
        return ip.join('.');
    }


    //动态pubkey
    function setPubkey() {
        let GPTMODE = getGPTMode()
        if(GPTMODE === "ZhipuAI"){
            localStorage.removeItem("ZhipuapiKey")
            let manualInput = confirm("请输入你自己的apiKey");
            if (manualInput) {
                let ZhipuapiKey = prompt("请输入您的智谱apikey", "");
                if (ZhipuapiKey) {
                    localStorage.setItem("ZhipuapiKey", ZhipuapiKey)
                    zhipu_apiKey = ZhipuapiKey
                }
            }
        }else if(GPTMODE === "Gemini"){
            localStorage.removeItem("gemini_key")
            let manualInput = confirm("请输入你自己的apiKey");
            if (manualInput) {
                let gm_key = prompt("请输入您的gemini apikey", "");
                if (gm_key) {
                    localStorage.setItem("gemini_key", gm_key)
                    gemini_key = gm_key
                }
            }
        }else if(GPTMODE === "miniMax"){

            localStorage.removeItem("minimax_group_id")
            let minimax_group_id_input = prompt("请输入您的minimax_group_id", "");
            if (minimax_group_id_input) {
                localStorage.setItem("minimax_group_id", minimax_group_id_input)
                minimax_group_id = minimax_group_id_input;
            }

            localStorage.removeItem("minimax_api_key")
            let minimax_api_key_input = prompt("请输入您的minimax_api_key", "");
            if (minimax_api_key_input){
                localStorage.setItem("minimax_api_key",minimax_api_key_input)
                minimax_api_key = minimax_api_key_input;
            }

        }else {
            //Toast.error("该线路不适用")
        }

    }


    //enc-start
    async function digestMessage(r) {
        const hash = CryptoJS.SHA256(r);
        return hash.toString(CryptoJS.enc.Hex);
    }

    const generateSignatureWithPkey = async r => {
        const {
            t: e,
            m: t,
            pkey: n
        } = r;
        console.log("CURRENT KEY:" + n)
        const a = `${e}:${t}:${n}`;
        return await digestMessage(a);
    };

    let aesKey = "hj6cdzrhj72x8ht1";
    const AES_CBC = {

        encrypt: function(e, t) {
            return CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(e), CryptoJS.enc.Utf8.parse(t), {
                iv: CryptoJS.enc.Utf8.parse(aesKey),
                mode: CryptoJS.mode.CBC
            }).toString()
        },
        decrypt: function(e, t) {
            return CryptoJS.AES.decrypt(e, CryptoJS.enc.Utf8.parse(t), {
                iv: CryptoJS.enc.Utf8.parse(aesKey),
                mode: CryptoJS.mode.CBC
            }).toString(CryptoJS.enc.Utf8)
        }
    };
    //enc-end

    //start


    function addChatBtn() {

        let mybtn =
            `<span class="bg s_btn_wr"><input type="button" id="mybtn" value="加载chat" class="bg s_btn"></span>`;
        $(".bg.s_btn_wr").after(mybtn)
        document.getElementById("mybtn").addEventListener("click", function () {
            console.log("reloadPage")
            if (window.location.href.indexOf("baidu.com\/s") > -1) {
                GM_add_box_style(2)
                addBothStyle()
                keyEvent()
                appendBox(2).then((res) => {
                    pivElemAddEventAndValue(2)
                })
            }
        })
    }

    function isMobile() {
        let userAgentInfo = navigator.userAgent.toLowerCase();
        let mobileAgents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod","Mobile"];
        let mobile_flag = false;
        //根据userAgent判断是否是手机
        for (let v = 0; v < mobileAgents.length; v++) {
            if (userAgentInfo.indexOf(mobileAgents[v].toLowerCase()) > -1) {
                mobile_flag = true;
                break;
            }
        }
        return mobile_flag;
    }


    //end

    const katex_options = {displayMode: false, throwOnError: false}
    function toRawText(exp){
        //处理html标签
        try {
            exp =  exp.replace(/\&amp;/gi, "&").replace(/<br>/g,"\n").replace(/<br \/>/g,"\n")
                .replace(/\&gt;/g,">").replace(/\&lt;/g,"<")
            // 处理矩阵
            exp = exp.replace(/\\begin\{bmatrix\}(.*?)\\end\{bmatrix\}/g, (_, tex) => {
                //debugger
                return `\\begin\{bmatrix\}${tex.replace(/\\/g,"\\\\")}\\end\{bmatrix\}`;
            })
            exp = exp.replace(/\\begin\{pmatrix\}(.*?)\\end\{pmatrix\}/g, (_, tex) => {
                //debugger
                return `\\begin\{pmatrix\}${tex.replace(/\\/g,"\\\\")}\\end\{pmatrix\}`;
            })
        }catch (e) { }

        return exp;
    }
    function katexTohtml(rawHtml) {
       // console.log("========katexTohtml start=======")
        let renderedHtml = rawHtml;
        try {
             renderedHtml = rawHtml.replace(/<em>/g, "").replace(/<\/em>/g, "").replace(/\$\$(.*?)\$\$/g, (_, tex) => {
                //debugger
                return katex.renderToString(toRawText(tex), katex_options);
            });
            renderedHtml = renderedHtml.replace(/\$(.*?)\$/g, (_, tex) => {
                //debugger
                return katex.renderToString(toRawText(tex), katex_options);
            });
        }catch (ex) {
            console.error(ex)
        }

       // console.log("========katexTohtml end=======")
        //console.log(renderedHtml)

        return renderedHtml;
    }



    let rawAns = undefined;
    let isShowRaw = false;
    //显示答案并高亮代码函数
    function showAnserAndHighlightCodeStr(codeStr) {
        if(!codeStr) return
        rawAns = codeStr;//记录原文
        try {
            document.getElementById('gptAnswer').innerHTML = mdConverter(codeStr)
        } catch (ex) {
            console.error(ex)
        }
        highlightCodeStr()//高亮
        //添加代码复制按钮 start
        let preList =  document.querySelectorAll("#gptAnswer pre")
        preList.forEach((pre)=>{
            try{
                if(!pre.querySelector(".btn-pre-copy")){
                    //<span class=\"btn-pre-copy\" onclick='preCopy(this)'>复制代码</span>
                    let copyBtn = document.createElement("span");
                    copyBtn.setAttribute("class","btn-pre-copy");
                    copyBtn.addEventListener("click",(event)=>{
                        let _this = event.target
                        console.log(_this)
                       let pre = _this.parentNode;
                       console.log(pre.innerText)
                       _this.innerText = '';
                       GM_setClipboard(pre.innerText, "text");
                        _this.innerText = '复制成功'
                        Toast.success("复制成功!")
                       setTimeout(() =>{
                           _this.innerText = '复制代码'
                       },2000)
                    })
                    copyBtn.innerText = '复制代码'
                    pre.insertBefore(copyBtn, pre.firstChild)
                }
            }catch (e) {
                console.log(e)
            }
        })
        //添加代码复制按钮 end
    }

    //高亮代码函数
    function highlightCodeStr() {
        let gptAnswerDiv = document.querySelector("#gptAnswer");
        gptAnswerDiv.querySelectorAll('pre code').forEach((el) => {
            hljs.highlightElement(el);
        });
    }

    //顶级配置
    let webSessionId
    let autoClick = localStorage.getItem("autoClick")
    let autoTips = localStorage.getItem("autoTips")? localStorage.getItem("autoTips") :'on';
    let isFullScreen = false;
    let your_qus;
    let abortXml;
    let regx = /search.*?\.cf/g;
    if (window.location.href.indexOf("bing.com") > -1) {

        GM_add_box_style(0)
        addBothStyle()
        keyEvent()
        appendBox(0).then((res) => {
            pivElemAddEventAndValue(0)
        })
        //linkToBing_beautification_script()
    }
    if (window.location.href.indexOf("google.com") > -1 || window.location.href.match(regx)) {
        GM_add_box_style(1)
        addBothStyle()
        keyEvent()
        appendBox(1).then((res) => {
            if(isMobile()){
                pivElemAddEventAndValue(11)
            }else {
                pivElemAddEventAndValue(1)
            }
        })
    }
    if (window.location.href.indexOf("baidu.com\/s") > -1 && !isMobile()) {
        GM_add_box_style(2)
        addBothStyle()
        keyEvent()
        appendBox(2).then((res) => {
            pivElemAddEventAndValue(2)
        })
    } else if (window.location.href.indexOf("https:\/\/m.baidu.com") > -1 || (window.location.href.indexOf(
        "baidu.com") > -1 && isMobile())) { //手机百度
        GM_add_box_style(2)
        addBothStyle()
        keyEvent()
        appendBox(6).then((res) => {
            pivElemAddEventAndValue(2)
        })
    }
    //俄罗斯yandex
    if (window.location.href.indexOf("yandex.ru\/search") > -1 || window.location.href.indexOf(
        "yandex.com\/search") > -1) {
        GM_add_box_style(1)
        addBothStyle()
        keyEvent()
        appendBox(3).then((res) => {
            pivElemAddEventAndValue(3)
        })
    }

    //360so
    if (window.location.href.indexOf("so.com\/s") > -1) {
        GM_add_box_style(1)
        addBothStyle()
        keyEvent()
        appendBox(4).then((res) => {
            if(isMobile()){
                pivElemAddEventAndValue(9)
            }else {
                pivElemAddEventAndValue(4)
            }
        })
    }

    //fsoufsou
    if (window.location.href.indexOf("fsoufsou.com\/search") > -1) {
        setTimeout(() => {
            GM_add_box_style(1)
            addBothStyle()
            keyEvent()
            appendBox(5).then((res) => {
                pivElemAddEventAndValue(5)
            })
        }, 3000)
    }

    //duckduckgo.com
    if (window.location.href.indexOf("duckduckgo.com\/\?q") > -1) {
        GM_add_box_style(1)
        addBothStyle()
        keyEvent()
        appendBox(7).then((res) => {
            pivElemAddEventAndValue(7)
        })
    }

    //sogou.com
    if (window.location.href.indexOf("sogou.com") > -1) {
        GM_add_box_style(1)
        addBothStyle()
        keyEvent()
        appendBox(8).then((res) => {
            if(isMobile()){
                pivElemAddEventAndValue(10)
            }else{
                pivElemAddEventAndValue(8)
            }
        })
    }

    //bilibili.com
    if (window.location.href.includes("bilibili.com")) {
        GM_add_box_style(1)
        addBothStyle()
        keyEvent()
        appendBox(9).then((res) => {
            pivElemAddEventAndValue(null)
        })
    }


    //csdn
    if (window.location.href.includes("blog.csdn.net")) {
        GM_add_box_style(1)
        addBothStyle()
        keyEvent()
        appendBox(10).then((res) => {
            pivElemAddEventAndValue(null)
            document.getElementById('hideGptDiv').click()
        })
    }

    //顶级函数
    function uuid() { //uuid 产生
        let s = [];
        let hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        return s.join("");
    }

    function GM_add_box_style(case_web) {
        case_web = 2;
        switch (case_web) {
            case 2:
                GM_addStyle(`
    #gptAnswer{
       margin: 10px;
       border-top: solid;
       border-bottom: solid;
    }
    #gptInput{
        border-radius: 20px;
        flex: 1;
        padding-left: 10px;
        height: 35px;
        border:0;
        background-color: transparent;
        font-size: 15px;
        font-weight: 500;
    }
    #button_GPT:hover{
        cursor: pointer;
    }
    #gptDiv{
        width:452px;
        flex: 1;
        display: flex;
        flex-direction: column;
        height: fit-content;
    }
    #gptInputBox{
        display:flex;
        justify-content: space-around;
        border-radius: 20px;
        border: 1px solid #c4c7ce;
        margin-left: 10px;
    }
    #button_GPT{
        border: 0;
        background-color: transparent;
        font-size: 14px;
        padding: 5px;
    }
    #gptStatus{
        margin-left: 10px;
    }
    #modeSelect {
        border: 1px solid #c4c7ce;
        border-radius: 10px;
        margin: 3px;
        text-align: center;
        color: RGB(193,73,55);
        -webkit-appearance: none;
    }
    
    #modeSelect::-webkit-scrollbar {
      width: 8px; /* 滚动条宽度 */
    }
    
    #modeSelect::-webkit-scrollbar-thumb {
      background-color: #888; /* 滚动条颜色 */
      border-radius: 4px; /* 滚动条圆角 */
    }
    
    #modeSelect::-webkit-scrollbar-thumb:hover {
      background-color: #555; /* 滚动条悬停时颜色 */
    }
    
    #modeSelect::-webkit-scrollbar-track {
      background-color: #f1f1f1; /* 滚动条背景色 */
      border-radius: 4px; /* 滚动条背景圆角 */
    }
    
    .chatSetting{
        display: block;
        text-align: right;
        margin-top: 10px;
        margin-right: 8px;
        margin-bottom: 1px;
    }
    .chatHide{
         display: none;
    }
    
    #chatSetting{
       text-decoration: none !important;
    }
    #chatSetting:hover{
       cursor: pointer;
       text-decoration: underline !important;
    }
    
    #website a:nth-child(odd){
        color: #ffbb00;
    }
    
    #website a:nth-child(even){
        color: #0bbbac;
    }
    
    #website a {
        border: 1px solid;
        border-radius: 3px;
        margin-right: 9px;
        margin-bottom: 5px;
    }
    #website hr {
        border: none;
        border-top: 1px dashed #999;
        margin: 5px 0px 5px 0px;
    }

    gptDiv p{
        white-space: pre-line;
    }
    
    pre .btn-pre-copy{
        text-align: right;
        display: block;
    }
    
    pre .btn-pre-copy:hover{
        cursor: pointer;
    }
    
    .fullScreen{
        z-index: 999 !important;
        position: fixed  !important;
        top: 0  !important;
        left: 0  !important;
        right: 0  !important;
        width: 100%  !important;
        height: 100%  !important;
        bottom: 0  !important;
        overflow-y: scroll !important;
    }
    
    .bgtransparent{
        background-color: transparent !important;
    }
    
    .floating-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #007bff;
      color: #fff;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.25);
      z-index: 9999 !important;
    }

    .floating-button a {
      text-decoration: none;
      color: inherit;
      z-index: 9999 !important;
    }
    
    /* fix bilibili高级弹幕背景问题 */
    #bilibili-player pre {
      background-color: transparent !important;
       overflow-x: hidden; !important;
       overflow-y: hidden; !important;
    }
    
    `)
                break;
            default:
                Toast.error("参数没设定")
        }

    }

    function do_it() {

        isShowRaw = false; //设置显示原文
        rawAns = undefined;//设置显示原文

        document.getElementById('gptAnswer').innerHTML = `<div>加载中<span id="dot"></span></div>`;
        //自定义模式
        let GPTMODE = getGPTMode()
        if (GPTMODE && GPTMODE === "YeYu") {
            console.log("当前模YeYu")
            //YeYu()
            //end if
            return;
        } else if (GPTMODE && GPTMODE === "THEBAI") {
            console.log("当前模式XJAI")
            THEBAI()
            //end if
            return;
        } else if (GPTMODE && GPTMODE === "YQCLOUD") {
            console.log("当前模式YQCLOUD")
            YQCLOUD()
            //end if
            return;
        } else if (GPTMODE && GPTMODE === "TDCHAT") {
            console.log("当前模式TDCHAT")
            TDCHAT()
            //end if
            return;
        }   else if (GPTMODE && GPTMODE === "AILS") {

            console.log("AILS")
            AILS()

            return;
            //end if
        } else if (GPTMODE && GPTMODE === "CVEOY") {
            console.log("CVEOY")
            CVEOY();

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "TOYAML") {
            console.log("TOYAML")
            TOYAML();

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "newBing") {
            console.log("newBing")
            newBing();

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "AIFREE") {
            console.log("AIFREE")
            AIFREE();

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "OPENAI" || GPTMODE === "OPENAI-3.5") {
            console.log("OPENAI-3.5")
            OPENAI("text-davinci-002-render-sha")

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "Gemini") {
            console.log("Gemini")
            Gemini()

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "TONGYI") {
            console.log("TONGYI")
            TONGYI()

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "SPARK") {
            console.log("SPARK")
            SPARK()

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "TIANGONG") {
            console.log("TIANGONG")
            TIANGONG()

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "Hunyuan") {
            console.log("Hunyuan")
            Hunyuan('')

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "DeepSeekYuanBao") {
            console.log("DeepSeekYuanBao")
            Hunyuan('deepseek')

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "YIYAN") {
            console.log("YIYAN")
            YIYAN()

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "DeepSeek") {
            console.log("DeepSeek")
            DeepSeek()

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "ChatGLM") {
            console.log("ChatGLM")
            ChatGLM()

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "ChatGLM4") {
            console.log("ChatGLM4")
            ChatGLM4()

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "ZhipuAI") {
            console.log("ZhipuAI")
            ZhipuAI()

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "chatforai") {
            console.log("chatforai")
            chatforai()

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "Zhinao360") {
            console.log("Zhinao360")
            Zhinao360()

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "BAICHUAN") {
            console.log("BAICHUAN")
            BAICHUAN()

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "MixerBox") {
            console.log("MixerBox")
            MixerBox()

            return;
            //end if
        }else if (GPTMODE && GPTMODE === "miniMax") {
            console.log("miniMax")
            miniMax()

            return;
            //end if
        }

        console.log("默认线路:")
        AIFREE()

    }



    function creatBox() {
        return new Promise((resolve) => {
            let divE = document.createElement('div');
            let divId = document.createAttribute("id"); //创建属性
            divId.value = 'gptDiv'; //设置属性值
            divE.setAttributeNode(divId); //给div添加属性
            let pE = document.createElement('p');
            let pClass = document.createAttribute('class');
            pClass.value = 'textClass';
            pE.setAttributeNode(pClass)
            let pText = document.createTextNode("");
            pE.appendChild(pText);
            divE.appendChild(pE);
            divE.classList.add("gpt-container");
            divE.classList.add("markdown-body");
            divE.innerHTML = `
    <div id="gptInputBox">
        <input autocomplete="off" placeholder="若用不了,请更新KEY或切换线路" id="gptInput" list="suggestions" type=text><button id="button_GPT" ><svg width="15px" height="15px" focusable="false" viewBox="0 0 24 24"><path fill="#34a853" d="M10 2v2a6 6 0 0 1 6 6h2a8 8 0 0 0-8-8"></path><path fill="#ea4335" d="M10 4V2a8 8 0 0 0-8 8h2c0-3.3 2.7-6 6-6"></path><path fill="#fbbc04" d="M4 10H2a8 8 0 0 0 8 8v-2c-3.3 0-6-2.69-6-6"></path><path fill="#4285f4" d="M22 20.59l-5.69-5.69A7.96 7.96 0 0 0 18 10h-2a6 6 0 0 1-6 6v2c1.85 0 3.52-.64 4.88-1.68l5.69 5.69L22 20.59"></path></svg>搜索</button>
        <datalist id="suggestions">
        </datalist>
    </div>
    <div class="chatSetting"><a id="chatSetting"><svg fill="#909399" width="15px" height="15px" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.85 22.25h-3.7c-.74 0-1.36-.54-1.45-1.27l-.27-1.89c-.27-.14-.53-.29-.79-.46l-1.8.72c-.7.26-1.47-.03-1.81-.65L2.2 15.53c-.35-.66-.2-1.44.36-1.88l1.53-1.19c-.01-.15-.02-.3-.02-.46 0-.15.01-.31.02-.46l-1.52-1.19c-.59-.45-.74-1.26-.37-1.88l1.85-3.19c.34-.62 1.11-.9 1.79-.63l1.81.73c.26-.17.52-.32.78-.46l.27-1.91c.09-.7.71-1.25 1.44-1.25h3.7c.74 0 1.36.54 1.45 1.27l.27 1.89c.27.14.53.29.79.46l1.8-.72c.71-.26 1.48.03 1.82.65l1.84 3.18c.36.66.2 1.44-.36 1.88l-1.52 1.19c.01.15.02.3.02.46s-.01.31-.02.46l1.52 1.19c.56.45.72 1.23.37 1.86l-1.86 3.22c-.34.62-1.11.9-1.8.63l-1.8-.72c-.26.17-.52.32-.78.46l-.27 1.91c-.1.68-.72 1.22-1.46 1.22zm-3.23-2h2.76l.37-2.55.53-.22c.44-.18.88-.44 1.34-.78l.45-.34 2.38.96 1.38-2.4-2.03-1.58.07-.56c.03-.26.06-.51.06-.78s-.03-.53-.06-.78l-.07-.56 2.03-1.58-1.39-2.4-2.39.96-.45-.35c-.42-.32-.87-.58-1.33-.77l-.52-.22-.37-2.55h-2.76l-.37 2.55-.53.21c-.44.19-.88.44-1.34.79l-.45.33-2.38-.95-1.39 2.39 2.03 1.58-.07.56a7 7 0 0 0-.06.79c0 .26.02.53.06.78l.07.56-2.03 1.58 1.38 2.4 2.39-.96.45.35c.43.33.86.58 1.33.77l.53.22.38 2.55z"></path><circle cx="12" cy="12" r="3.5" fill="#909399"></circle></svg>设置</a></div>
    <div id=gptCueBox>
    <p class="chatHide" id="gptStatus">
   <select id="modeSelect">
      <option value="Default">默认接口</option>
      <option style="display: none" value="newBing">New Bing</option>
      <option style="display: none" value="OPENAI-3.5">OPENAI-3.5</option>
      <option value="Gemini">Gemini-2.0</option>
      <option value="DeepSeek">DeepSeek(满血)</option>
      <option value="TONGYI">通义千问</option>
      <option value="YIYAN">百度文心</option>
      <option value="SPARK">讯飞星火</option>
      <option value="TIANGONG">天工AI</option>
      <option value="Hunyuan">腾讯元宝</option>
      <option value="DeepSeekYuanBao">腾讯Deepseek(联网)</option>
      <option value="ChatGLM">ChatGLM</option>
      <option value="ChatGLM4">ChatGLM4</option>
      <option value="ZhipuAI">智谱AI</option>
      <option value="Zhinao360">360智脑</option>
      <option value="BAICHUAN">百川AI</option>
      <option value="miniMax">miniMax</option>
      <option value="AIFREE">AIFREE</option>
      <option value="chatforai">chatforai</option>
      <option value="MixerBox">MixerBox</option>
      <option style="display: none" value="THEBAI">XJAI</option>
      <option value="YQCLOUD">YQCLOUD</option>
      <option value="TDCHAT">TDCHAT</option>
      <option value="AILS">AILS</option>
      <option value="CVEOY">CVEOY</option>
      <option value="TOYAML">TOYAML</option>
    </select> 部分线路需要科学上网</p>
	<p class="chatHide" id="warn" style="margin: 10px"  ><a id="updatePubkey" style="color: #4e6ef2;" href="javascript:void(0)"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class=" iconify iconify--ri" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M18.537 19.567A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 2.136-.67 4.116-1.81 5.74L17 12h3a8 8 0 1 0-2.46 5.772l.997 1.795Z"></path></svg>更新KEY</a>:适用于自定义、智谱、Gemini</p>
	<p class="chatHide" id="autoClickP" style="margin: 10px"  ><a id="autoClick" style="color: #4e6ef2;" href="javascript:void(0)"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="text-lg iconify iconify--ri" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M15 4H5v16h14V8h-4V4ZM3 2.992C3 2.444 3.447 2 3.998 2H16l5 5v13.992A1 1 0 0 1 20.007 22H3.993A1 1 0 0 1 3 21.008V2.992Zm9 8.508a2.5 2.5 0 1 1 0-5a2.5 2.5 0 0 1 0 5ZM7.527 17a4.5 4.5 0 0 1 8.945 0H7.527Z"></path></svg>自动点击开关</a>:用于设置搜索是否自动点击</p>
	<p class="chatHide" id="darkThemeP" style="margin: 10px"  ><a id="darkTheme" style="color: #4e6ef2;" href="javascript:void(0)"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class=" iconify iconify--ri" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.997c-5.523 0-10-4.478-10-10c0-5.523 4.477-10 10-10s10 4.477 10 10c0 5.522-4.477 10-10 10Zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16Zm0-2v-12a6 6 0 0 1 0 12Z"></path></svg>暗黑模式开关</a>:用于设置暗黑/白天</p>
	<p class="chatHide" id="autoTipsP" style="margin: 10px"><a id="autoTips"  href="javascript:void(0)"><svg withd="15" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12,2c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9S16.97,2,12,2z M12,18c-3.86,0-7-3.14-7-7s3.14-7,7-7s7,3.14,7,7S15.86,18,12,18z" fill="#fff" stroke="#000"></path>
      <circle cx="12" cy="12" r="5" fill="#ffd700"></circle>
      <path d="M12,17v1a1,1,0,0,1-2,0V17" stroke="#000" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M13,14.5h-2a.5.5,0,0,1-.5-.5v-1a.5.5,0,0,1,.5-.5h2a.5.5,0,0,1,.5.5v1A.5.5,0,0,1,13,14.5Z" fill="#fff" stroke="#000"></path>
    </svg>自动提示开关</a>:用于设置是否开启提示</p>
	<div class="chatHide" id="website" style="margin-left: 10px; ">
	    <hr>
        <a target="_blank"  href="https://chat.deepseek.com/">DeepSeek</a>
        <a target="_blank"  href="https://yiyan.baidu.com/">文心</a>
        <a target="_blank"  href="https://qianwen.aliyun.com/">通义</a>
        <a target="_blank"  href="https://www.tiangong.cn/">天工</a>
        <a target="_blank"  href="https://xinghuo.xfyun.cn/">讯飞</a>
        <a target="_blank"  href="https://hunyuan.tencent.com/">元宝</a>
        <a target="_blank"  href="https://www.doubao.com/chat/">豆包</a>
        <hr>
        <a target="_blank"  href="https://chatgpt.com">OpenAI</a>
        <a target="_blank"  href="https://www.bing.com/search?q=Bing+AI&showconv=1">Bing</a>
        <a target="_blank"  href="https://gemini.google.com/app">Gemini</a>
        <a target="_blank"  href="https://claude.ai/">Claude</a>
        <a target="_blank"  href="https://chatglm.cn/chat">GLM</a>
        <a target="_blank"  href="https://www.baichuan-ai.com/">百川</a>
        <hr>
        <a target="_blank"  href="https://kimi.moonshot.cn/">Kimi</a>
        <a target="_blank"  href="https://chat.360.cn/">360智脑</a>
        <a target="_blank"  href="https://chat.sensetime.com/">商量</a>
        <a target="_blank"  href="https://poe.com/">Poe</a>
        <a target="_blank"  href="https://taichu-web.ia.ac.cn/#/chat">紫东</a>
        <a target="_blank"  href="https://chat.deepseek.com/">DeepSeek</a>
        <hr>
        <a target="_blank"  href="https://greasyfork.org/scripts/459997">更新</a>
        <a  href="https://q1.qlogo.cn/g?b=qq&nk=2471543762&s=640">用爱发电</a>
        <hr>
	</div>
   <article id="gptAnswer" class="markdown-body"><div id="gptAnswer_inner">版本: ${JSver} 已启动,部分线路需要科学上网,更换AI接口请点击"设置"。当前线路: ${getGPTMode() || "Default"};当前自动点击状态: ${localStorage.getItem("autoClick") || "关闭"}</article>
    </div>
    <span class="speak" style="margin-right: 10px;text-align: right">
    <a id="speakAnser" style="cursor: pointer" href="javascript:void(0)" >
       <svg width="20" height="20" viewBox="0 0 17 16">
          <path d="M9 16.5v-9l6 4.5-6 4.5z" fill="#909399"></path>
          <path d="M0 0h24v24H0z" fill="none"></path>
    </svg>朗读</a>
    
    <a id="copyAns" style="cursor: pointer" href="javascript:void(0)" >
       <svg width="12" height="12" data-v-13fede38="" t="1679666016648" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6241" class="icon"><path data-v-13fede38="" d="M661.333333 234.666667A64 64 0 0 1 725.333333 298.666667v597.333333a64 64 0 0 1-64 64h-469.333333A64 64 0 0 1 128 896V298.666667a64 64 0 0 1 64-64z m-21.333333 85.333333H213.333333v554.666667h426.666667v-554.666667z m191.829333-256a64 64 0 0 1 63.744 57.856l0.256 6.144v575.701333a42.666667 42.666667 0 0 1-85.034666 4.992l-0.298667-4.992V149.333333H384a42.666667 42.666667 0 0 1-42.368-37.674666L341.333333 106.666667a42.666667 42.666667 0 0 1 37.674667-42.368L384 64h447.829333z" fill="#909399" p-id="6242"></path></svg>
       复制</a>
    
    <a id="rawAns" style="cursor: pointer" href="javascript:void(0)" >
       <svg width="13" height="13" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" stroke="#909399" stroke-width="4" fill="none"></circle>
    </svg>原文</a>
    
    <a id="stopAns" style="cursor: pointer" href="javascript:void(0)">
       <svg width="13" height="13" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="#909399" d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm6.7 15.3c-.2.2-.5.2-.7 0L12 12.7l-6.1 4.6c-.2.2-.5.2-.7 0-.2-.2-.2-.5 0-.7l6.1-4.6-6.1-4.6c-.2-.2-.2-.5 0-.7s.5-.2.7 0L12 11.3l6.1-4.6c.2-.2.5-.2.7 0 .2.2.2.5 0 .7l-6.1 4.6 6.1 4.6c.2.2.2.5 0 .7z"></path>
    </svg>中断</a>
    
    <a id="fullScreen" style="cursor: pointer" href="javascript:void(0)">
       <svg width="13" height="13" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="14" rx="2" ry="2" stroke="black" fill="#909399"/>
      <line x1="3" y1="8" x2="21" y2="8" stroke="black" stroke-width="2"/>
      <line x1="3" y1="16" x2="21" y2="16" stroke="black" stroke-width="2"/>
    </svg>全屏</a>
    
    <a id="hideGptDiv" style="cursor: pointer" href="javascript:void(0)">
       <svg width="13" height="13" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#909399"></circle>
      <circle cx="12" cy="12" r="5" fill="#fff"></circle>
    </svg>隐藏</a>

</span>`;
            resolve(divE)
        })
    }

    let speakAudio;
    let isPlayend = true;
    async function pivElemAddEventAndValue(append_case) {
        let search_content

        try {
            if (append_case === 11) {//手机google
                search_content = document.querySelector("#tsf textarea").value
            }
            if (append_case === 10) {//手机sogou
                search_content = document.querySelector("input#keyword").value
            }
            if (append_case === 9) {//手机360
                search_content = document.querySelector("input#q").value
            }
            if (append_case === 8) {
                search_content = document.querySelector("input#upquery").value
            }
            if (append_case === 7) {
                search_content = document.querySelector("#search_form input").value
            }
            if (append_case === 5) {
                search_content = document.getElementById("search-input").value
            }

            if (append_case === 4) {
                search_content = document.getElementById("keyword").value
            }

            if (append_case === 3) {
                search_content = document.querySelectorAll("input")[0].value
            }

            if (append_case === 2) {
                search_content = document.getElementById('kw').value
            }
            if (append_case === 1) {
                try {
                    search_content = document.querySelector(
                        "#tsf > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input:nth-child(3)"
                    ).value
                } catch (e) {
                    search_content = document.querySelector("textarea").value
                }

            }
            if (append_case === 0) {
                search_content = document.getElementsByClassName('b_searchbox')[0].value
                if (!search_content) {
                    search_content = document.querySelector("textarea[class='b_searchbox']").value;
                }
            }
        } catch (e) {
            console.log(e)
        }

        document.getElementById("gptInput").value = search_content || ''
        document.getElementById('button_GPT').addEventListener('click', () => {
            your_qus = document.getElementById("gptInput").value

            //字体设置
            if(your_qus.startsWith("/font-size:")){
                let fontSize = your_qus.substring("/font-size:".length)
                document.querySelector("#gptDiv").style.fontSize = fontSize;
                localStorage.setItem("gpt_font_size",fontSize)
                Toast.success(`字体设置成功:${fontSize}`)
                return
            }

            //禁用历史记录
            if(your_qus.startsWith("/history_disable:")){
                let dis = your_qus.substring("/history_disable:".length)
                history_disable = (dis === 'true' ? true : false);
                localStorage.setItem("history_disable", dis)
                Toast.success(`禁用历史记录设置成功:${history_disable}`)
                return
            }

            do_it()

        })

        //搜索建议
        document.getElementById('gptInput').addEventListener('keyup', () => {
            console.log("autoTips:",autoTips)
            if(autoTips !== 'on') return

            let current;
            let word = document.getElementById('gptInput').value;
            if(!word) return;
            if(current){
                current.abort();
            }
            console.log(word)
            current = GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.baidu.com/sugrec?&prod=pc&wd="+encodeURIComponent(word),
                responseType: "text",
                onload:(r) => {
                    //console.log(r)
                    if (r.status === 200) {
                        //console.log(r);
                        let dataList = JSON.parse(r.responseText).g;
                        const su = document.querySelector('#suggestions');
                        su.innerHTML = '';
                        dataList && dataList.forEach(v => {
                            const optionElement = document.createElement('option');
                            optionElement.value = v.q;
                            optionElement.innerText = v.q;
                            su.appendChild(optionElement);
                        });
                    }

                }
            });
        })

        document.getElementById('updatePubkey').addEventListener('click', () => {
            Toast.info("正在更新，请稍后...")
            setPubkey()
        })

        document.getElementById('autoClick').addEventListener('click', () => {
            if(autoClick){
                localStorage.removeItem("autoClick")
                autoClick = undefined;
                Toast.error("自动点击已经关闭")
            }else{
                localStorage.setItem("autoClick", "开启")
                autoClick = "开启"
                Toast.success("自动点击已经开启")
            }
        })

        document.getElementById('autoTips').addEventListener('click', () => {
            if(autoTips === 'on'){
                //关闭
                localStorage.setItem("autoTips", "off")
                autoTips = "off"
                Toast.error("自动提示已关")
            }else{
                //开启
                localStorage.setItem("autoTips", "on")
                autoTips = "on"
                Toast.success("自动提示已开启")
            }
        })

        document.getElementById('darkTheme').addEventListener('click', () => {
            try{
                document.getElementById("github-markdown-link").remove()
                document.getElementById("highlight-link").remove()
            }catch (e) { console.error(e) }

            if(darkTheme){
                localStorage.removeItem("darkTheme")
                darkTheme = undefined;
                Toast.success("暗黑已经开启")
            }else{
                localStorage.setItem("darkTheme", "关闭")
                darkTheme = "关闭"
                Toast.error("暗黑已经关闭")
            }
        })
        //朗读
        document.getElementById('speakAnser').addEventListener('click', () => {
           let ans = document.querySelector("#gptAnswer");
           if(!isPlayend){
               Toast.success('已暂停播放!');
               speakAudio.pause();
               isPlayend = true;
               return;
           }else {
               Toast.warn('音频已停止,正在重新播放！')
           }
           if(ans){
              // let speakText = encodeURIComponent(ans.innerText);
               let speakText = ans.innerText;

               //new sogou api
               // 弹出对话框询问用户是否同意
               const result = confirm("是否启用外国口音朗读? 默认为中文口音。");
               let dialect = "zh-CHS"
               if (result) {
                   dialect = "en"
                   console.log("英文朗读！");
               }

               let f = JSON.stringify({
                   curTime: Date.now(),
                   rate: "1",
                   spokenDialect: dialect,
                   text: speakText
               })

              let sParam =  CryptoJS.AES.encrypt(f.replace(/^"|"$/g, ""), CryptoJS.enc.Utf8.parse("76350b1840ff9832eb6244ac6d444366"), {
                   "iv": CryptoJS.enc.Utf8.parse(atob("AAAAAAAAAAAAAAAAAAAAAA==") || "76350b1840ff9832eb6244ac6d444366"),
                   "mode": CryptoJS.mode.CBC,
                   "pad": CryptoJS.pad.Pkcs7
               }).toString();


               speakAudio = new Audio(`https://fanyi.sogou.com/openapi/external/getWebTTS?S-AppId=102356845&S-Param=${encodeURIComponent(sParam)}`);
               speakAudio.play()
               isPlayend = false;
               speakAudio.addEventListener("ended",function() {
                   isPlayend = true;
                   Toast.success('音频已播放完毕！');
               })
           }
        })

        //原文切换
        document.getElementById('rawAns').addEventListener('click', (ev) => {
           let ans = document.querySelector("#gptAnswer");
           if(!rawAns) {
               Toast.error("原文无内容")
               return
           };
           if(!isShowRaw){
               ans.innerText = rawAns;
               isShowRaw = true;
               Toast.success("已为你显示原文")
           }else{
               showAnserAndHighlightCodeStr(rawAns)
               isShowRaw = false;
               Toast.success("已为你显示非原文")
           }

        })

        //中断回答
        document.getElementById('stopAns').addEventListener('click', (ev) => {
           try{
               if(abortXml){
                   abortXml.abort();
                   abortXml = undefined;
               }else {
                   Toast.error("无法中断!")
               }
           }catch(ex){
               console.error("中断失败：",ex)
               Toast.error("中断失败!")
           }
        })

        //全屏
        document.getElementById('fullScreen').addEventListener('click', (ev) => {
           try{
               if(!isFullScreen){
                   document.getElementById("gptDiv").classList.add("fullScreen")
                   isFullScreen = true;
               }else {
                   document.getElementById("gptDiv").classList.remove("fullScreen")
                   isFullScreen = false;
               }

           }catch(ex){
               console.error("ex：",ex)
               Toast.error("未知异常!")
           }
        })
        //隐藏
        document.getElementById('hideGptDiv').addEventListener('click', (ev) => {
           try{
               $("body").append(`<div class="floating-button"><a href="javascript:void(0)">显示</a></div>`)
               $(".floating-button a").click(function() {
                   $("#gptDiv").show();
                   $(".floating-button").remove()
               });
               $("#gptDiv").hide();
           }catch(ex){
               console.error("ex：",ex)
               Toast.error("未知异常!")
           }
        })

        //复制答案
        document.getElementById('copyAns').addEventListener('click', (ev) => {
           let ans = document.querySelector("#gptAnswer");
           if(isShowRaw){
               GM_setClipboard(rawAns, "text");
           }else{
               let cps = document.querySelectorAll(".btn-pre-copy");
               for (let cp of cps){
                   cp.innerText = ''
               }
               GM_setClipboard(ans.innerText, "text");

               for (let cp of cps){
                   cp.innerText = '复制代码'
               }
           }
            Toast.success("复制成功!")
        })

        document.getElementById('modeSelect').addEventListener('change', () => {
            const selectEl = document.getElementById('modeSelect');
            const selectedValue = selectEl.options[selectEl.selectedIndex].value;
            localStorage.setItem('GPTMODE', selectedValue);

            Toast.success(`切换成功，当前线路:${selectedValue}`)
        });

        let chatSetting = false;
        document.getElementById('chatSetting').addEventListener('click', () => {
          if(!chatSetting){
             //显示内容
             try{
                 document.querySelector("#gptStatus").classList.remove("chatHide")
                 document.querySelector("#warn").classList.remove("chatHide")
                 document.querySelector("#autoClickP").classList.remove("chatHide")
                 document.querySelector("#darkThemeP").classList.remove("chatHide")
                 document.querySelector("#website").classList.remove("chatHide")
                 document.querySelector("#autoTipsP").classList.remove("chatHide")
             }catch (e) {
                 console.log(e)
             }
              chatSetting = true;
          }else{
              //隐藏
              try{
                  document.querySelector("#gptStatus").classList.add("chatHide")
                  document.querySelector("#warn").classList.add("chatHide")
                  document.querySelector("#autoClickP").classList.add("chatHide")
                  document.querySelector("#darkThemeP").classList.add("chatHide")
                  document.querySelector("#website").classList.add("chatHide")
                  document.querySelector("#autoTipsP").classList.add("chatHide")
              }catch (e) {
                  console.log(e)
              }
              chatSetting = false;
          }
        })

    }

    async function appendBox(append_case) {
        return new Promise((resolve, reject) => {
            creatBox().then((divE) => {
                let resetWidth = (width)=>{
                    try {
                        if(width){
                            document.querySelector("#gptDiv").style.setProperty("width",width);
                            return
                        }
                        document.querySelector("#gptDiv").style.setProperty("width",
                            "100%")
                        /*document.querySelector("#gptInput").setAttribute("class",
                            "se-input adjust-input")*/
                    } catch (e) {
                        console.error(e)
                    }
                }

                switch (append_case) {
                    case 0: //bing
                        if (divE) {
                            if(isMobile()){
                                //手机bing
                                document.getElementById('b_results').prepend(divE)
                                resetWidth();
                            }else{
                                document.getElementById('b_context').prepend(divE)
                            }
                        }
                        break;
                    case 1: //google
                        if(isMobile()){
                            //手机google
                            document.querySelector("div#msc").after(divE);
                            resetWidth();
                        }else if (document.getElementsByClassName('TQc1id ')[0]) {
                            document.getElementsByClassName('TQc1id ')[0].prepend(divE);
                        } else {
                            //other
                            document.getElementById("rcnt").appendChild(divE);
                        }
                        break;
                    case 2: //baidu
                        if (document.getElementById('content_right')) {
                            document.getElementById('content_right').prepend(divE)
                        }
                        break;
                    case 3: //yandex
                        if (document.getElementById('search-result-aside')) {
                            document.getElementById('search-result-aside').prepend(divE)
                        }
                        break;
                    case 4: //360
                        if(isMobile()){
                            //手机360
                            document.getElementById("search-box").appendChild(divE);
                            resetWidth();
                        }else{
                            if (document.getElementById('side')) {
                                document.getElementById('side').prepend(divE)
                            }
                        }

                        break;
                    case 5: //fsoufsou
                        if(isMobile()){
                            //手机fsou
                            let frow = document.querySelectorAll(".flex-row")[3]
                            if (frow.children!==undefined ) {
                                frow.children.item(0).prepend(divE)
                            }
                            resetWidth()
                        }else{
                            let frow = document.querySelectorAll(".flex-row")[2]
                            if (frow.children!==undefined && frow.children.length === 2) {
                                frow.children.item(1).prepend(divE)
                            } else {
                                frow.innerHTML = frow.innerHTML +
                                    `<div><div class="wiki-container" style="margin-left: 124px!important;padding: 15px!important;">${divE.innerHTML}</div></div>`
                            }
                        }

                        break;
                    case 6: //手机百度
                        if (document.getElementById('page-bd')) {
                            document.getElementById('page-bd').prepend(divE)
                            //调整css
                            resetWidth();
                        }
                        break;
                    case 7: //duckduckgo
                        if(isMobile()){
                            //手机dockgo
                            document.querySelector('form#search_form').after(divE)
                            resetWidth();
                        }else{
                            if (document.querySelector('[data-area="sidebar"]')) {
                                document.querySelector('[data-area="sidebar"]').prepend(divE)
                            }
                        }
                        break;
                   case 8: //sogou
                        if(isMobile()){
                            //手机搜狗
                            document.querySelector('form#searchform').after(divE)
                            resetWidth();
                        }else{
                            if (document.querySelector('div.right')) {
                                document.querySelector('div.right').prepend(divE)
                            }
                        }

                        break;
                    case 9: //bilibili
                        if (document.querySelector('div#danmukuBox')) {
                            document.querySelector('div#danmukuBox').children.item(0).prepend(divE)
                            resetWidth();
                        }

                        break;

                    case 10: //csdn
                        let asideDiv = document.querySelector("aside.blog_container_aside div")
                        if (asideDiv) {
                            asideDiv.after(divE)
                            let t = asideDiv.offsetTop + asideDiv.offsetHeight + 5;
                            const screenHeight = window.screen.height;
                            document.querySelector("#gptDiv").setAttribute("style",
                                `position: fixed;top: ${t}px;left: 0px;z-index: 9999;width:410px;`)

                            //滚动条
                            document.querySelector("#gptAnswer").setAttribute("style",
                                `height: ${screenHeight/5}px;overflow-y:scroll`)


                        }

                        break;
                    default:
                        if (divE) {
                            console.log(`啥情况${divE}`)
                        }
                }
            }).catch((err) => {
                throw new Error(err)
            }).finally(()=>{
                if(autoClick){
                    setTimeout(() => {
                        document.getElementById("button_GPT").click(); //自动点击
                    }, 1500)
                }
            })

            resolve("finished")
        })
    }

    //焦点函数
    function isBlur() {
        let myInput = document.getElementById('gptInput');
        if (myInput === document.activeElement) {
            return 1
        } else {
            return 0
        }
    }

    function keyEvent() {
        document.onkeydown = function (e) {
            let keyNum = window.event ? e.keyCode : e.which;
            if (13 === keyNum) {
                if (isBlur()) {
                    document.getElementById('button_GPT').click()
                } else {
                    console.log("失焦不执行")
                }

            }


        }

    }




    function addBothStyle() {
        GM_addStyle(`
    .gpt-container {
        box-sizing: border-box;
        height: -webkit-min-content;
        height: min-content;
        width: 455px;
        margin-top: 8px;
        margin-bottom: 8px;
        border: 1px solid #dfe1e5;
        border-radius: 8px;
        overflow: hidden;
        padding: 15px;
        background-color:#fcfcfc
    }

    #dot{
        height: 4px;
        width: 4px;
        display: inline-block;
        border-radius: 2px;
        animation: dotting 2.4s  infinite step-start;
    }
   @keyframes dotting {
        25%{
            box-shadow: 4px 0 0 #71777D;
        }
        50%{
            box-shadow: 4px 0 0 #71777D ,14px 0 0 #71777D;
        }
        75%{
            box-shadow: 4px 0 0 #71777D ,14px 0 0 #71777D, 24px 0 0 #71777D;
        }
    }
    pre{
        overflow-x: scroll;
        overflow-y: hidden;
        background: #fffaec;
        border-radius: 4px;
        padding: 14px 3px;
    }
    pre::-webkit-scrollbar {
     
    }`);
    }



    function Uint8ArrayToString(fileData) {
        let dataString = "";
        for (let i = 0; i < fileData.length; i++) {
            dataString += String.fromCharCode(fileData[i]);
        }

        return dataString;
    }

    function decodeUnicode(str) {
        str = str.replace(/\\/g, "%");
        //转换中文
        str = unescape(str);
        //将其他受影响的转换回原来
        str = str.replace(/%/g, "\\");
        //对网址的链接进行处理
        str = str.replace(/\\/g, "");
        return str;
    }


    (function (extension) {
        if (typeof showdown !== 'undefined') {
            // global (browser or node.js global)
            extension(showdown);
        } else if (typeof define === 'function' && define.amd) {
            // AMD
            define(['showdown'], extension);
        } else if (typeof exports === 'object') {
            // Node, CommonJS-like
            module.exports = extension(require('showdown'));
        } else {
            // showdown was not found so an error is thrown
            throw Error('Could not find showdown library');
        }
    }(function (showdown) {
        // loading extension into showdown
        showdown.extension('myext', function () {
            return [
                //to katex
                {
                    type:   'output',
                    filter: function (source, converter, options) {
                        //debugger
                        return katexTohtml(source);
                    }
                },
                // filter xss
                {
                    type:  'output',
                    filter: function (source, converter, options) {
                        //debugger
                        return  source.replace(/<script/gi, '&lt;script').replace(/<meta/gi, '&lt;meta');
                    }
                },
                //Adds simple footnotes

                {
                    type: 'output',
                    filter: text => text.replace(
                        /^\[\^([\d\w]+)\]:\s*((\n+(\s{2,4}|\t).+)+)$/mg,
                        (str, name, rawContent, _, padding) => {
                            const content = converter.makeHtml(rawContent.replace(new RegExp(`^${padding}`, 'gm'), ''))
                            return `<div class="footnote" id="footnote-${name}"><a href="#footnote-${name}"><sup>[${name}]</sup></a>:${content}</div>`
                        }
                    )
                },
                {
                    type: 'lang',
                    filter: text => text.replace(
                        /^\[\^([\d\w]+)\]:( |\n)((.+\n)*.+)$/mg,
                        (str, name, _, content) =>
                            `<small class="footnote" id="footnote-${name}"><a href="#footnote-${name}"><sup>[${name}]</sup></a>: ${content}</small>`
                    )
                },
                {
                    type: 'lang',
                    filter: text => text.replace(
                        /\[\^([\d\w]+)\]/m,
                        (str, name) => `<a href="#footnote-${name}"><sup>[${name}]</sup></a>`
                    )
                },

                //replace \n
                {
                    type: 'lang',
                    filter: text => text.replace(/\\n+/g, "\n")
                },
                /**
                 * Showdown Icon Extension, Glyphicon and FontAwesome support for showdown
                 * http://github.com/dbtek/showdown-icon
                 * 2014, Ismail Demirbilek
                 * License: MIT
                 */
                {
                    type: "lang",
                    regex: "\\B(\\\\)?@glyphicon-([\\S]+)\\b",
                    replace: function(a, b, c) {
                        return b === "\\" ? a : '<span class="glyphicon glyphicon-' + c + '">' + "</span>"
                    }
                },
                {
                    type: "lang",
                    regex: "\\B(\\\\)?@fa-([\\S]+)\\b",
                    replace: function(a, b, c) {
                        return b === "\\" ? a : '<i class="fa fa-' + c + '">' + "</i>"
                    }
                }

            ];
        })
    }));
    function mdConverter(rawData) {
        let tmpData = rawData;
        let converter = new showdown.Converter({
            extensions: ['myext']
        });
        converter.setOption('tables',
            true); //启用表格选项。从showdown 1.2.0版开始，表支持已作为可选功能移入核心拓展，showdown.table.min.js扩展已被弃用
        converter.setOption('openLinksInNewWindow',true) //链接在新窗口打开
        converter.setOption('strikethrough', true) //删除线
        converter.setOption('emoji', true) //开启emoji

        /***
         * original: John Gruber 规范中的原始 Markdown 风格
         * vanilla：对决基础风味（v1.3.1 起）
         * github: GitHub 风格的 Markdown，或 GFM
         */
        showdown.setFlavor('github');

        try {
            return converter.makeHtml(rawData);
        }catch (ex) {
            console.error(ex)
            //fix script markdown render
            try {
                return katexTohtml(marked.parse(rawData))
            }catch (ex) {
                console.error("备用渲染失败")
            }
        }
        return tmpData;

    }

    //实时监控
    setInterval(() => {
        //百度
        if (window.location.href.indexOf("baidu.com\/s") > -1 && !isMobile()) {
            if (!document.getElementById("gptDiv") && document.getElementById("mybtn")) {
                document.getElementById("mybtn").click()
            }

            if (!document.getElementById("gptDiv") && !document.getElementById("mybtn")) {
                addChatBtn();
                document.getElementById("mybtn").click()
            }

        }
        //360 注意请如果你在360相关浏览器上使用插件。360搜索将不会生效，因为已被浏览器禁用在so.com网址上使用
        if (window.location.href.indexOf("so.com\/s") > -1 && !document.getElementById("gptDiv")) {
            GM_add_box_style(1)
            addBothStyle()
            keyEvent()
            appendBox(4).then((res) => {
                pivElemAddEventAndValue(4)
            })
        }
        //bilibli
        if (window.location.href.indexOf("bilibili.com\/video") > -1 && !document.getElementById("gptDiv")) {
            GM_add_box_style(1)
            addBothStyle()
            keyEvent()
            appendBox(9).then((res) => {
                pivElemAddEventAndValue(null)
            })
        }

    }, 2000)


    function generateRandomString(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }



    let messageChain2 = [];//AILS

    let messageChain10 = [];//PRTBOOM

    function addMessageChain(messageChain, element,maxLength) {
        maxLength = maxLength || 6;
        if (messageChain.length >= maxLength) {
            messageChain.shift();
        }
        messageChain.push(element);
        console.log(messageChain,maxLength)
        return messageChain;
    }

    function formattedDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();

        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDay = day < 10 ? `0${day}` : day;

        return `${year}-${formattedMonth}-${formattedDay}`;
    }



    let ails_clientv = "0.1.293";
    let ails_signKey = "WI,2rU#_r:r~aF4aJ36[.Z(/8Rv93Rf";
    function AILS() {

        let vtime = function converTimestamp(t) {
            const e = parseInt(t)
                , n = e % 10
                , r = n % 2 === 0 ? n + 1 : n;
            return (e - n + r).toString()
        }

        let now = vtime(new Date().getTime());
        const pk = `${ails_signKey}:${your_qus.length}`;//查看js的generateSignature函数中的key
        let Baseurl = "https://api.caipacity.com/"
        generateSignatureWithPkey({
            t: now,
            m: your_qus || "",
            pkey: pk
        }).then(sign => {
            addMessageChain(messageChain2, {role: "user", content: your_qus})//连续话
            console.log(sign)
            GM_fetch({
                method: "POST",
                url: Baseurl + "v1/chat/completions?full=false",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer free",
                    "client-id": uuidv4(),
                    "client-v": ails_clientv,
                    "Referer": "https://ai.ls/",
                    "from-url": "https://ai.ls/?chat=1",
                    "origin": "https://ai.ls",
                    "X-Forwarded-For": generateRandomIP(),
                    "accept": "application/json"
                },
                data: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: messageChain2,
                    stream: true,
                    t: `${now}`,
                    d: formattedDate(),
                    s: sign,
                    temperature:0.6
                }),
                responseType: "stream"
            }).then((stream) => {
                let result = [];
                let finalResult;
                const reader = stream.response.getReader();
                reader.read().then(function processText({done, value}) {
                    if (done) {
                        finalResult = result.join("")
                        try {
                            console.log(finalResult)
                            addMessageChain(messageChain2, {
                                role: "assistant",
                                content: finalResult
                            })
                            showAnserAndHighlightCodeStr(finalResult)
                        } catch (e) {
                            console.log(e)
                        }
                        return;
                    }
                    try {
                        let d = new TextDecoder("utf8").decode(new Uint8Array(value));
                        console.log(d)
                        /*d.split("\n").forEach(item=>{
                            try {
                                let chunk = JSON.parse(item.replace(/data:/,"").trim())
                                    .choices[0].delta.content;
                                result.push(chunk)
                            }catch (ex){}
                        })*/
                        result.push(d)
                        showAnserAndHighlightCodeStr(result.join(""))
                    } catch (e) {
                        console.log(e)
                    }

                    return reader.read().then(processText);
                });
            },(reason)=>{
                console.log(reason)
                Toast.error("未知错误!")
            }).catch((ex)=>{
                console.log(ex)
            });

        });
    }


    async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    let ds_x_token_dasclient = ""

    async function initDS_x_token_dasclient() {
        if (location.href.includes("scnet.cn")) {
            ds_x_token_dasclient = localStorage.getItem("user_chat_token");
            console.log("ds_x_token_dasclient",ds_x_token_dasclient)
            GM_setValue("ds_x_token_dasclient", ds_x_token_dasclient)
            try {
                if(ds_x_token_dasclient){
                   Toast.info("ds_x_token_dasclient 获取成功：",ds_x_token_dasclient)
                }else{
                    Toast.info("`ds_x_token_dasclient获取失败，请再次刷新.`",ds_x_token_dasclient)
                }
            }catch (e) {}
        } else {
            ds_x_token_dasclient =  GM_getValue("ds_x_token_dasclient")
        }
    }

    setTimeout(initDS_x_token_dasclient)


    async function DeepSeek() {


        showAnserAndHighlightCodeStr(`此线路为超算互联Deepseek线路，如果出错请尝试打开官方后刷新页面再试：[Deepseek](https://chat.scnet.cn/)`)

        if(!ds_x_token_dasclient){
            showAnserAndHighlightCodeStr(`x_token_dasclient为空，请尝试打开官方后刷新页面再试：[Deepseek](https://chat.scnet.cn/)`)
            return
        }
        console.warn("x_token_dasclient:",ds_x_token_dasclient)



        let baseURL = "https://chat.scnet.cn/";
        let res = await GM_fetch({
            method: "POST",
            url: baseURL + "api/chat/Ask/",
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json",
                "x-token-dasclient": ds_x_token_dasclient,
                "Referer": baseURL
            },
            data:  JSON.stringify(
                {
                    "modelType": "DeepSeek-R1-671B",
                    "query": your_qus,
                    "conversationId": "",
                    "messageType": "local"
                }
            )
        });
        if (res.status === 200) {
            console.log('ds：成功....')
            console.log(res)
            let ds_messageId = JSON.parse(res.responseText).data.messageId;
            console.log("ds_messageId",ds_messageId)


            GM_fetch({
                method: "GET",
                url: `https://chat.scnet.cn/api/chat/GetReplay?messageId=${ds_messageId}&query=&modelType=DeepSeek-R1-671B`,
                headers: {
                    "Referer": baseURL,
                    "x-token-dasclient": ds_x_token_dasclient,
                    "accept": "text/event-stream",
                },
                responseType: "stream"
            }).then((stream) => {
                let result = [];
                let finalResult;
                const reader = stream.response.getReader();
                reader.read().then(function processText({done, value}) {
                    if (done) {
                        finalResult = result.join("")
                        showAnserAndHighlightCodeStr(finalResult)
                        return;
                    }

                    try {

                        let d = new TextDecoder("utf8").decode(new Uint8Array(value));
                        console.log("raw:",d)
                        let responseItem = d.trim().split("\n");
                        console.warn(responseItem)
                        responseItem.forEach(item=>{
                            try {
                                if(item && item.startsWith("data:")){
                                    let ii = item.replace(/data:/gi,"")
                                    console.log("ii:",ii)
                                    if(ii){
                                        if(ii.length > 2 ){
                                            result.push(ii.trim().slice(1,-1))
                                        }else{
                                            result.push(ii.trim())
                                        }
                                        showAnserAndHighlightCodeStr(result.join(""))
                                    }
                                }
                            }catch (ex){
                                console.error(item)
                            }
                        })
                    } catch (e) {
                        console.log(e)
                    }

                    return reader.read().then(processText);
                });
            },function (err) {
                console.log(err)
                Toast.error("未知错误!")
            }).catch((ex)=>{
                console.log(ex)
                Toast.error("未知错误!")
            })


        } else {
            console.log(res)
            Toast.error('访问失败了')
        }

    }


    //取某个cookie的值
    function getCookieValue(cookies, cookieName) {
        let name = cookieName + "=";
        let cookieArray = cookies.split(';');
        for(let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return "";
    }

    //取header的cookie
    function getCookies(headers) {
        let cookieArray = headers.split('\r\n');
        cookieArray.forEach(item => {
            if(item.startsWith('set-cookie')){
                return item;
            }
        })
        return "";
    }



    let userId_yqcloud = "#/chat/" + Date.now();
    //fix 24.3.12 https://chat18.aichatos.xyz
    function YQCLOUD() {
        console.log(userId_yqcloud)
        abortXml = GM_xmlhttpRequest({
            method: "POST",
            //url: "https://cbjtestapi.binjie.site:7777/api/generateStream",
            url:  "https://api.binjie.fun/api/generateStream",
            headers: {
                "Content-Type": "application/json",
                "Referer": "https://chat18.aichatos.xyz",
                "origin":  "https://chat18.aichatos.xyz",
                "accept": "application/json, text/plain, */*"
            },
            data: JSON.stringify({
                prompt: your_qus,
                apikey: "",
                system: "",
                withoutContext: false,
                userId: userId_yqcloud,
                network: true
            }),
            onloadstart: (stream) => {
                let result = [];
                const reader = stream.response.getReader();
                reader.read().then(function processText({done, value}) {
                    if (done) {
                        let finalResult = result.join("").
                        replace(/gptxyy/gi,"")
                            .replace(/aichatos/gi,"")
                            .replace(/https?:\/\/[^\s]+/g,"")
                        showAnserAndHighlightCodeStr(finalResult)
                        return;
                    }
                    let d = new TextDecoder("utf8").decode(new Uint8Array(value));
                    result.push(d)
                    try {
                        console.log(result.join(""))
                        showAnserAndHighlightCodeStr(result.join("").
                        replace(/gptxyy/gi,"")
                            .replace(/aichatos/gi,"")
                            .replace(/https?:\/\/[^\s]+/g,""))
                    } catch (e) {
                        console.log(e)
                    }
                    return reader.read().then(processText);
                });
            },
            responseType: "stream",
            onerror: function (err) {
                console.log(err)
                Toast.error("未知错误!")
            }
        })

    }


    let parentID_thebai;

    //https://f2.cnote.top/#/chat/1002
    function THEBAI() {
        let ops = {};
        if (parentID_thebai) {
            ops = {parentMessageId: parentID_thebai};
        }
        console.log(ops)
        abortXml = GM_xmlhttpRequest({
            method: "POST",
            url: "https://p1api.xjai.pro/freeapi/chat-process",
            headers: {
                "Content-Type": "application/json",
                "Referer": "https://f2.cnote.top/",
                "accept": "application/json, text/plain, */*"
            },
            data: JSON.stringify({
                "prompt": your_qus,
                "options": ops,
                "systemMessage": "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.",
                "temperature": 0.8,
                "top_p": 1
            }),
            onloadstart: (stream) => {
                const reader = stream.response.getReader();
                let result = []
                reader.read().then(function processText({done, value}) {
                    if (done) {
                        showAnserAndHighlightCodeStr(result.join("").replace(/x-code.fun/gi,"")
                            .replace(/bilibili/gi,"").replace(/xjai/gi,"")
                            .replace(/ymiai/gi,"").replace(/aiflarepro/gi,"")
                            .split(/\.*?\&/gi)[2])

                        return;
                    }
                    try {
                        let byteArray = new Uint8Array(value);
                        let decoder = new TextDecoder('utf-8');
                        let d = decoder.decode(byteArray);
                        try {
                            let jsonObj = JSON.parse(d.trim())
                            if (jsonObj.id) {
                                parentID_thebai = jsonObj.id;
                            }
                        }catch (e) {  }
                        console.log(d)
                        result.push(d)
                        showAnserAndHighlightCodeStr(result.join("").replace(/x-code.fun/gi,"")
                            .replace(/bilibili/gi,"")
                            .replace(/xjai/gi,"")
                            .replace(/ymiai/gi,"").replace(/aiflarepro/gi,""))


                    } catch (e) {
                        console.error(e)
                    }

                    return reader.read().then(processText);
                });
            },
            responseType: "stream",
            onerror: function (err) {
                console.log(err)
                Toast.error("未知错误!")
            }
        })
    }





    /*setTimeout(async () => {
        let rr = await GM_fetch({
            method: "GET",
            url: `https://yeyu2048.xyz/chat/haohula.json?r=${Math.random()}`
        });
        if (rr.status === 200) {
            console.log(rr)
            let result = JSON.parse(rr.responseText);


        } else {
            console.error(rr)
        }

    })*/

    function isTokenExpired(token) {
        if(!token) return true
        try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));

            if (!tokenData.exp) {
                return false;
            }

            const expirationTime = tokenData.exp * 1000; // Convert expiration time to milliseconds
            const currentTime = new Date().getTime();

            if (currentTime > expirationTime) {
                return true;
            } else {
                return false;
            }
        }catch (e) {
            return false
        }

        return true;
    }


    let bingSocket;
    let bing_sourceAttributions;
    let bing_result;
    function initBingSocket() {
        let socket = new WebSocket(`wss://sydney.bing.com/sydney/ChatHub`);

        // 监听连接成功事件

        socket.addEventListener('open', (event) => {
            console.log('initBingSocket 连接成功');
            bingSocket = socket;
            showAnserAndHighlightCodeStr("BingSocket:已连接，请勿重新点击，结果返回较慢请耐心等待，若长时间没反应则不可用。注意：本线路为new bing官网线路。若要使用线路,则需要科学上网和登录微软账号:[BING AI](https://cn.bing.com/search?q=Bing+AI&showconv=1&FORM=hpcodx)")
        });

        // 监听接收消息事件
        socket.addEventListener('message', (event) => {
            console.log('initBingSocket 接收到消息：', event.data);
            let revData = event.data;
            try{
                let rr = revData.replace(String.fromCharCode(0x1e),"");

                try{
                    let ref = '\n'
                    if(rr.startsWith('{"type":2')){
                        console.warn("bing_sourceAttributions foreach")
                        bing_sourceAttributions && bing_sourceAttributions.forEach((sb,index) =>{
                            try{
                                ref += `${index}.[${sb.providerDisplayName}](${sb.seeMoreUrl})\n\n`
                            }catch (e) {console.error("sb", e)}
                        })
                        showAnserAndHighlightCodeStr(bing_result + ref);
                    }
                }catch (ex) { /*console.error("bing_sourceAttributions  ex ", JSON.parse(rr))*/ }


                let ans = JSON.parse(rr).arguments[0].messages[0].text;
                bing_result = (ans ? ans : bing_result)
                console.log(bing_result)
                showAnserAndHighlightCodeStr(bing_result)
                if(conversationId){
                    isStartOfSession = false;
                }

                if(JSON.parse(rr).arguments[0].messages[0].sourceAttributions){
                    let sb = JSON.parse(rr).arguments[0].messages[0].sourceAttributions;
                    bing_sourceAttributions = sb.length > 0 ? sb : bing_sourceAttributions;

                    console.warn('bing_sourceAttributions',bing_sourceAttributions)
                }

            }catch (e) {

            }
            /*if(revData.includes("allowReconnect")){
                isStartOfSession = true;
            }*/

        });
    }

   //setTimeout(initBingSocket,1000)
    let isStartOfSession = true;
    let conversationId;
    let clientId;
    let conversationSignature;
    let invocationId = 0;
    let toneStyle = 'fast';
   async function newBing() {

       setTimeout(initBingSocket)
       await delay(2000)

       const genRanHex = (size) =>
           [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')

       if(isStartOfSession){
           console.log("isStartOfSession:",isStartOfSession)
           let req1 = await GM_fetch({
               method: "GET",
               url: "https://www.bing.com/turing/conversation/create"
           })
           let r = req1.responseText;
           console.log(r)
           conversationId = JSON.parse(r).conversationId;
           clientId = JSON.parse(r).clientId;
           conversationSignature = JSON.parse(r).conversationSignature;

       }



       if (bingSocket.readyState === 1) {
           // 发送协议和版本号
           const protocol = {protocol: "json", version: 1};
           bingSocket.send(JSON.stringify(protocol) + String.fromCharCode(0x1e));

           await delay(1000)
           // 发送请求类型
           const type = {type: 6};
           bingSocket.send(JSON.stringify(type) + String.fromCharCode(0x1e));

           await delay(500)
           //发送提问
           if(!isStartOfSession){
               invocationId += 1;
           }
           let toneOption
           if (toneStyle === 'creative') {
               toneOption = 'h3imaginative'
           } else if (toneStyle === 'precise') {
               toneOption = 'h3precise'
           } else if (toneStyle === 'fast') {
               // new "Balanced" mode, allegedly GPT-3.5 turbo
               toneOption = 'galileo'
           } else {
               // old "Balanced" mode
               toneOption = 'harmonyv3'
           }
           const msg = {
               "arguments": [{
                   "conversationId": conversationId,
                   "sliceIds": ["222dtappid", "225cricinfo", "224locals0"],
                   "optionsSets": [
                       'nlu_direct_response_filter',
                       'deepleo',
                       'disable_emoji_spoken_text',
                       'responsible_ai_policy_235',
                       'enablemm',
                       toneOption,
                       'dtappid',
                       'cricinfo',
                       'cricinfov2',
                       'dv3sugg',
                       'nojbfedge',
                   ],
                   "traceId": genRanHex(32),
                   "source": "cib",
                   "isStartOfSession": isStartOfSession,
                   "message": {
                       "author": "user",
                       "text": your_qus,
                       "messageType": "Chat"
                   },
                   "conversationSignature": conversationSignature,
                   "participant": {
                       "id": clientId
                   }
               }],
               "invocationId": `${invocationId}`,
               "target": "chat",
               "type": 4
           }

           bingSocket.send(JSON.stringify(msg) + String.fromCharCode(0x1e));
          /* if(isStartOfSession){
               isStartOfSession = false;
           }*/
       }



    }



   function uuidv4() {
       let d = new Date().getTime(); // get current timestamp in ms (to ensure UUID uniqueness)
       let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
           let r = (d + Math.random() * 16) % 16 | 0 // generate random nibble
            d = Math.floor(d / 16) // correspond each UUID digit to unique 4-bit chunks of timestamp
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16) // generate random hexadecimal digit
        })
        return uuid
    }

    //OPENAI update wss 2024.3.12
   //let messageChain_openai = [];
   let openai_conversation_id ;
   let openai_parent_message_id ;
   let history_disable = false ;
   async function OPENAI(GPTModel){
       // addMessageChain(messageChain_openai,{
       //     "role": "user",
       //     "id": uuidv4(),
       //     "content": {
       //         "content_type": "text",
       //         "parts": [
       //             your_qus
       //         ]
       //     },
       //     "metadata":{}
       // },20)
       showAnserAndHighlightCodeStr(`此线路为OpenAI官网线路：${GPTModel}，使用前确定有访问权限且登录账号：[OPENAI官网](https://chatgpt.com/)`)
       let req1 = await GM_fetch({
           method: "GET",
           url: "https://chatgpt.com/api/auth/session"
       })
       let r = req1.responseText;
       console.log(r)
       let accessToken;
       try{
           accessToken = JSON.parse(r).accessToken;
       }catch (e) {
           showAnserAndHighlightCodeStr("验证出错,请确认有权限访问OPENAI官网[OPENAI](https://chatgpt.com/)")
       }

       if(!accessToken){
           showAnserAndHighlightCodeStr("验证出错,请确认有权限OPENAI官网[OPENAI](https://chatgpt.com/)")
       }

       let paramObj = {
           action: "next",
           messages: [{
               "author": {
                    "role": "user"
                },
               "id": uuidv4(),
               "content": {
                   "content_type": "text",
                   "parts": [
                       your_qus
                   ]
               },
               "metadata":{}
           }],
           model: GPTModel,
           parent_message_id: openai_parent_message_id ? openai_parent_message_id : uuidv4(),
           suggestions: [],
           arkose_token: null,
           history_and_training_disabled: history_disable,
           timezone_offset_min: new Date().getTimezoneOffset()
       }
       if(openai_conversation_id){
           try {
               Reflect.set(paramObj,"conversation_id", openai_conversation_id)
           }catch (ex) {
               console.error(ex)
           }
       }
       console.log(paramObj)

       let sendData = JSON.stringify(paramObj)
       GM_fetch({
           method: 'POST',
           url: 'https://chatgpt.com/backend-api/conversation',
           headers: {
               'Content-Type': 'application/json',
                Authorization: 'Bearer ' + accessToken,
                'origin': 'https://chatgpt.com',
                'Referer': 'https://chatgpt.com/',
           },
           responseType: "stream",
           data: sendData
       }).then((stream)=> {
           let reader = stream.response.getReader()
           let reqJsonStr;
           reader.read().then(function processText({done, value}) {
               if (done) {

                   //连接openai websocket
                   let reqJson = JSON.parse(reqJsonStr)
                   //openai_conversation_id = reqJson.openai_conversation_id
                   let wssurl = reqJson.wss_url

                   let socket = new WebSocket(wssurl);
                   socket.addEventListener('open', (event) => {
                       console.log('OpenAI wss 连接成功');
                   });
                   socket.addEventListener('message', (event) => {
                       console.log('OpenAISocket 接收到消息：', event.data);
                       let revData = event.data;
                       try{
                           let revJSON = JSON.parse(revData);
                           if(revJSON.type == 'http.response.body'){
                               openai_parent_message_id = revJSON.message_id
                               if(revJSON.body !== 'ZGF0YTogW0RPTkVdCgo='){
                                   //处理结果
                                   try{
                                       let responseItem = atob(revJSON.body)
                                       console.log(responseItem)
                                       showAnserAndHighlightCodeStr(JSON.parse(responseItem.slice(6)).message.content.parts[0])
                                       if(JSON.parse(responseItem.slice(6)).conversation_id){
                                           openai_conversation_id = JSON.parse(responseItem.slice(6)).conversation_id
                                           openai_parent_message_id = JSON.parse(responseItem.slice(6)).message.id
                                       }
                                   }catch (ex) {
                                       console.error(ex)
                                   }
                               }

                           }

                       }catch (ex) { }

                   });



                   console.log("===done==")
                   // addMessageChain(messageChain_openai,{
                   //     "role": "assistant",
                   //     "id": uuidv4(),
                   //     "content": {
                   //         "content_type": "text",
                   //         "parts": [
                   //             answer
                   //         ]
                   //     },
                   //     "metadata":{}
                   // }, 20)
                   return
               }
               reqJsonStr = String.fromCharCode(...Array.from(value))

               /*try{
                   let responseItem = String.fromCharCode(...Array.from(value))
                   console.log(responseItem)
                   let items = responseItem.split('\n\n')
                   if (items.length > 2) {
                       let lastItem = items.slice(-3, -2)[0]
                       if (lastItem.startsWith('data: [DONE]')) {
                           responseItem = items.slice(-4, -3)[0]
                       } else {
                           responseItem = lastItem
                       }
                   }
                   if (responseItem.startsWith('data: {')) {
                       answer = JSON.parse(responseItem.slice(6)).message.content.parts[0]
                       showAnserAndHighlightCodeStr(answer)
                       if(JSON.parse(responseItem.slice(6)).conversation_id){
                           openai_conversation_id = JSON.parse(responseItem.slice(6)).conversation_id
                           openai_parent_message_id = JSON.parse(responseItem.slice(6)).message.id
                       }

                   } else if (responseItem.startsWith('data: [DONE]')) {

                       // return
                   }
               }catch (e) {
                   console.error(e)
               }*/

               return reader.read().then(processText)
           },function (reason) {
               console.log(reason)
               Toast.error("未知错误!")
           }).catch((ex)=>{
               console.log(ex)
               Toast.error("未知错误!")
           })
       })
   }

    //Gemini api
    let gemini_key = localStorage.getItem("gemini_key")
    async function Gemini(GPTModel){

       if(!gemini_key){
           showAnserAndHighlightCodeStr(`gemini_key为空,请点击设置-更新key,请到获取[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)`)
           return
       }

        showAnserAndHighlightCodeStr(`请稍后。。。此线路为google官网线路，使用前确定apikey的正确性(设置-更新key),[key获取](https://aistudio.google.com/app/apikey)`)


        GM_fetch({
            method: 'POST',
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${gemini_key}`,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                "accept": "text/event-stream"
                /*'Accept-Language':'zh-CN,zh;q=0.9'*/
            },
            responseType: "stream",
            data: JSON.stringify({
                contents: [{
                    parts: [{ text: your_qus }],
                }],
            })
        }).then((stream)=> {
            let reader = stream.response.getReader()
            let answer = [];
            reader.read().then(function processText({done, value}) {
                if (done) {
                    console.log("===done==")
                    showAnserAndHighlightCodeStr(JSON.parse(answer.join("")).candidates[0].content.parts[0].text)

                    return
                }
                try{
                    let responseItem = new TextDecoder("utf8").decode(new Uint8Array(value))
                    showAnserAndHighlightCodeStr(responseItem)
                    answer.push(responseItem)
                    console.warn(responseItem)
                }catch (e) {
                    console.error(e)
                }

                return reader.read().then(processText)
            },function (reason) {
                console.log(reason)
                Toast.error("未知错误!")
            }).catch((ex)=>{
                console.log(ex)
                Toast.error("未知错误!")
            })
        })
    }


   let csrfToken;
   async function setCsrfToken(){
       let req1 = await GM_fetch({
           method: "GET",
           url: "https://tongyi.aliyun.com/qianwen/",
           headers: {
               "origin":"https://qianwen.aliyun.com",
               "referer":"https://tongyi.aliyun.com/qianwen/"
           }
       })
       let r = req1.responseText;
       console.log(r);
       try{
           csrfToken =  /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/g.exec(r)[0];
           console.log("csrfToken:",csrfToken)
       }catch (e) {
           Toast.error("csrfToken获取失败")
       }
    }
   setTimeout(()=>{
       if(getGPTMode()==="TONGYI"){
           setCsrfToken()
       }
   })


    let tongyi_sessionId = '';
    let tongyi_pMsgId;

    //通义千问 2023年5月13日
   async function TONGYI(){
        /*if(tongyi_first){
           let req1 = await GM_fetch({
               method: "POST",
               url: "https://qianwen.aliyun.com/addSession",
               headers: {
                   "origin":"https://qianwen.aliyun.com/",
                   "referer":"https://qianwen.aliyun.com/chat",
                   "Content-Type": "application/json",
                   "Bx-V": "2.5.3",
                   "x-platform": "pc_tongyi",
                   "x-xsrf-token": csrfToken
               },
               data:JSON.stringify({
                   "firstQuery": your_qus
               })
           })
           let r = req1.responseText;
           //console.log(r);

           try{
               tongyi_sessionId = JSON.parse(r).data.sessionId;
               tongyi_first = false;
           }catch (e) {
               tongyi_first = true;
               showAnserAndHighlightCodeStr("出错,请确认已登录通义官网[通义](https://tongyi.aliyun.com/qianwen/)")
               setTimeout(setCsrfToken)
           }
       }
*/
       showAnserAndHighlightCodeStr("请稍后....该接口需登录通义官网[通义](https://tongyi.aliyun.com/qianwen/)")


       let sendData = JSON.stringify({
           "action": "next",
           "userAction": tongyi_sessionId ? "chat" : "new_top",
          // "msgId": generateRandomString(32),
           "parentMsgId": (tongyi_sessionId && tongyi_pMsgId) ? tongyi_pMsgId : generateRandomString(32),
           "requestId":   generateRandomString(32),
           "contents": [
               {
                   "contentType": "text",
                   "content": your_qus,
                   "role": "user"
               }
           ],
           "sessionId": tongyi_sessionId ? tongyi_sessionId : '',
          // "sessionId": "",
           "sessionType": "text_chat",
           "model": "",
           "mode": "chat",
           "params": {"fileUploadBatchId": ""}

       })

       GM_fetch({
           method: 'POST',
           url:  'https://qianwen.biz.aliyun.com/dialog/conversation',
           headers: {
               "origin": "https://tongyi.aliyun.com",
               "referer":"https://tongyi.aliyun.com/qianwen/",
               "Content-Type": "application/json",
               "accept": "text/event-stream",
               "x-platform": "pc_tongyi",
               "x-xsrf-token": csrfToken
           },
           responseType: "stream",
           data: sendData
       }).then((stream)=> {
           let reader = stream.response.getReader()
           let answer;
           reader.read().then(function processText({done, value}) {
               if (done) {
                   console.log("===done==")
                   return
               }
               let responseItem = new TextDecoder("utf-8").decode(value)
               console.log(responseItem)
               /*{
                   "aiDisclaimer": false,
                   "canFeedback": true,
                   "canRegenerate": true,
                   "canShare": true,
                   "canShow": true,
                   "contentFrom": "text",
                   "contentType": "text",
                   "contents": [
                   {
                       "content": "你好！有什么我能帮助你的吗？",
                       "contentType": "text",
                       "id": "102416421db845179064dd046d5ce8d4_0",
                       "role": "assistant",
                       "status": "generating"
                   }
               ],
                   "msgId": "102416421db845179064dd046d5ce8d4",
                   "msgStatus": "generating",
                   "params": {},
                   "parentMsgId": "4880983feec04eae862ce2e08d67fc09",
                   "sessionId": "95812ea382de4b4e82051a7272d965cb",
                   "sessionOpen": true,
                   "sessionShare": true,
                   "sessionWarnNew": false,
                   "stopReason": "null",
                   "traceId": "0bc3b2e817159180903973007eb266"
               }*/

               responseItem.split("\n").forEach(item=>{
                   try {
                       let jsonObj = JSON.parse(item.replace(/data: /gi,"").trim())

                       jsonObj.contents.forEach((item)=>{

                           if(item.contentType === 'text'){
                               let content = item.content;
                               console.log(content)
                               showAnserAndHighlightCodeStr(content)
                           }
                       })


                       if(!tongyi_sessionId){
                           tongyi_sessionId = jsonObj.sessionId;
                           console.log("tongyi_sessionId:",tongyi_sessionId)
                       }
                       if(tongyi_pMsgId !== jsonObj.msgId){
                           tongyi_pMsgId = jsonObj.msgId;
                           console.log("tongyi_pMsgId:",tongyi_sessionId)
                       }



                   }catch (ex){}
               })

               return reader.read().then(processText)
           },function (reason) {
               console.log(reason)
               Toast.error("未知错误!")
           }).catch((ex)=>{
               console.log(ex)
               Toast.error("未知错误!")
           })
       })


  }




    //星火相关====start=====
    let sp_appId = 'ihuqg3dmuzcr2kmghumvivsk7c3l4joe';
    let sp_fd = String(+new Date()).slice(-6);//a = (a = String(+new Date)).substring(a.length - 6)
    let sp_chatId;
    let sp_GtToken;

    async function init_sp_appId() {

        sp_appId = 'ihuqg3dmuzcr2kmghumvivsk7c3l4joe'
        return
        //get https://xinghuo.xfyun.cn/chat
        //script defer="defer" src="/static/js/main.04f3ec36.js"></script>
        let req1 = await GM_fetch({
            method: "GET",
            url: "https://xinghuo.xfyun.cn/chat",
            headers: {
                "origin":"https://xinghuo.xfyun.cn",
                "referer":"https://xinghuo.xfyun.cn/"
            }
        })
        let r = req1.responseText;
        //console.log(r);
        let mainjs;

        try{

            mainjs = /src="(\/static\/js\/main.*?.js)"/.exec(r)[1];//https://xinghuo.xfyun.cn/static/js/main.04f3ec36.js
            console.log("mainjs:",mainjs)
        }catch (e) {
            console.error(r)
            Toast.error("出错了，js获取失败")
        }

        if(mainjs){
            console.log("https://xinghuo.xfyun.cn"+ mainjs.trim())
            let req2 = await GM_fetch({
                method: "GET",
                url: "https://xinghuo.xfyun.cn"+ mainjs.trim(),
                headers: {
                    "origin":"https://xinghuo.xfyun.cn",
                    "referer":"https://xinghuo.xfyun.cn/"
                }
            })
            let rr = req2.responseText;

            console.log(rr.substring(0,100))
            try{
                const re = /appId:"(.*?)"/gi;
                let match;
                while ((match = re.exec(rr)) !== null) {
                    console.log(match[1]);
                    sp_appId = match[1];
                }
                /*let index = rr.indexOf("appId");
                if (index !== -1) {
                    let sp_appId = rr.substring(index, index + 10); // 指定文本
                }*/
                console.log("sp_appId:",sp_appId)
            }catch (e) {
                console.error(e)
                Toast.error("出错了,sp_appId获取失败",)
            }
        }


    }

    /*setTimeout(()=>{
        if(getGPTMode()==="SPARK"){
            init_sp_appId()
        }
    })*/
    async function init_sp_chatId() {
        //https://xinghuo.xfyun.cn/iflygpt/u/chat-list/v1/create-chat-list
        let req1 = await GM_fetch({
            method: "POST",
            url: "https://xinghuo.xfyun.cn/iflygpt/u/chat-list/v1/create-chat-list",
            headers: {
                "accept": "application/json, text/plain, */*",
                "x-requested-with": "XMLHttpRequest",
                "origin":"https://xinghuo.xfyun.cn",
                "Content-Type":"application/json",
                "referer":"https://xinghuo.xfyun.cn/desk"
            },
            data:"{}"
        })
        let r = req1.responseText;
        try{
            sp_chatId = JSON.parse(r).data.id;
            console.log("sp_chatId:",sp_chatId)
        }catch (e) {
            console.error(r)
            Toast.error("sp_chatId获取失败")
        }



    }

    setTimeout(()=>{
        if(getGPTMode()==="SPARK"){
            init_sp_chatId()
        }
    },500)

    async function get_sp_GtToken() {
        return new Promise(async (resolve, reject) => {

            //https://riskct.geetest.com/g2/api/v1/pre_load?client_type=h5&callback=geetest_时间戳
            let timestamp = Date.now();
            let req1 = await GM_fetch({
                method: "GET",
                url: `https://riskct.geetest.com/g2/api/v1/pre_load?client_type=h5&callback=geetest_${timestamp}`,
                headers: {
                    "accept": "*/*",
                    "referer": "https://xinghuo.xfyun.cn/"
                }
            })
            let r = req1.responseText;
            console.log(r);
            try {
                let rr = r.replace(`geetest_${timestamp}(`,
                    "");
                rr = rr.substring(0, rr.length - 1)
                console.log("rr", rr)
                let rj = JSON.parse(rr);
                console.log("rj:");
                console.log(rj);

                //====
                let config = {
                    appId: sp_appId,
                    js: rj.data.js,
                    staticPath: rj.data.staticPath,
                    gToken: rj.data.gToken
                }
                console.log("config")
                console.log(config)
                setTimeout(() => {
                    initGeeGuard(config, (gd) => {
                        console.log(gd)
                        if (gd.data.gee_token) {
                            sp_GtToken = gd.data.gee_token;
                            resolve(sp_GtToken)
                        }else{
                            reject("出错")
                        }
                    })
                }, 500)


            } catch (e) {
                console.error(e)
                setTimeout(init_sp_chatId)
                reject("出错")
            }
        })

    }


    //解码
    function decodeSpark(src) {
       /*let rv = function(e) {
            return e.replace(/[^A-Za-z0-9\+\/]/g, "")
        }*/

        let dv =  function(e) {
                //return Buffer.from(e, "base64").toString("utf8")
            // 将 base64 编码的字符串转换为字节数组
            const bytes = CryptoJS.enc.Base64.parse(e);
            // 将字节数组转换为 UTF-8 字符串
            return bytes.toString(CryptoJS.enc.Utf8);
        }//等价BASE64解码 6KaB

         /*let  fv = function(e) {
                return dv(function(e) {
                    return rv(e.replace(/[-_]/g, (function(e) {
                            return "-" == e ? "+" : "/"
                        }
                    )))
                }(e))
         };*/
       return dv(src);
    }



    let spark_first = true;
    async function SPARK(){
        showAnserAndHighlightCodeStr("请稍后,第一次切换到该线路需要刷新页面，该线路为官网线路,使用前确保已经登录[讯飞星火](https://xinghuo.xfyun.cn/)")
        if(!sp_chatId){
            showAnserAndHighlightCodeStr("chatId为空，请重试。。。使用前确保已经登录[讯飞星火](https://xinghuo.xfyun.cn/)")
            init_sp_chatId()
            return
        }

        await get_sp_GtToken()
        console.log("sp_GtToken",sp_GtToken)
        //重命名
        if(spark_first){
           let req1 = await GM_fetch({
                method: "POST",
                url: "https://xinghuo.xfyun.cn/iflygpt/u/chat-list/v1/rename-chat-list",
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "x-requested-with": "XMLHttpRequest",
                    "origin":"https://xinghuo.xfyun.cn",
                    "Content-Type":"application/json",
                    "referer":"https://xinghuo.xfyun.cn/desk"
                },
                data:JSON.stringify({
                    "chatListId": sp_chatId,
                    "chatListName": your_qus.substring(0,10)
                })
            })
            let r = req1.responseText;
            console.log("rename chat:",r)
            spark_first = false;
        }

        //提问

        let sendData = `------WebKitFormBoundaryAS7tSr3osJng5Nxk\r\nContent-Disposition: form-data; name=\"fd\"\r\n\r\n${sp_fd}\r\n------WebKitFormBoundaryAS7tSr3osJng5Nxk\r\nContent-Disposition: form-data; name=\"clientType\"\r\n\r\n2\r\n------WebKitFormBoundaryAS7tSr3osJng5Nxk\r\nContent-Disposition: form-data; name=\"chatId\"\r\n\r\n${sp_chatId}\r\n------WebKitFormBoundaryAS7tSr3osJng5Nxk\r\nContent-Disposition: form-data; name=\"text\"\r\n\r\n${your_qus}\r\n------WebKitFormBoundaryAS7tSr3osJng5Nxk\r\nContent-Disposition: form-data; name=\"GtToken\"\r\n\r\n${sp_GtToken}\r\n------WebKitFormBoundaryAS7tSr3osJng5Nxk--\r\n`;
        GM_fetch({
            method: 'POST',
            url: 'https://xinghuo.xfyun.cn/iflygpt-chat/u/chat_message/chat',
            headers: {
                "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryAS7tSr3osJng5Nxk",
                "challenge": "undefined",
                "seccode": "",
                "validate": "undefined",
                "accept": "text/event-stream",
                "x-requested-with": "XMLHttpRequest",
                "origin":"https://xinghuo.xfyun.cn",
                "referer":"https://xinghuo.xfyun.cn/desk"
            },
            responseType: "stream",
            data: sendData
        }).then((stream)=> {
            let reader = stream.response.getReader()
            let ans = []
            //let de = []
            reader.read().then(function processText({done, value}) {
                if (done) {
                    console.log("===done==")
                    //console.log(de)
                    return
                }
                let responseItem = new TextDecoder("utf-8").decode(value)
                console.log(responseItem)

                responseItem.split("\n").forEach(item=>{
                    try {
                        let ii = item.replace(/data:/gi,"").trim();
                        if(ii && ii !==""){
                            let chunk = decodeSpark(ii)
                            //de.push(item.replace(/data:/gi,"").trim())
                            ans.push(chunk)
                            showAnserAndHighlightCodeStr(ans.join(""))
                        }
                    }catch (ex){
                        console.error(item)
                    }
                })

                return reader.read().then(processText)
            },function (reason) {
                console.log(reason)
                Toast.error("未知错误!")
            }).catch((ex)=>{
                console.log(ex)
                Toast.error("未知错误!")
            })
        })


    }

    //星火相关====end=====



    //天工 ----start--------

    let tg_k_device_hash;

    async function initDeviceHash() {
        if (location.href.includes("tiangong.cn")) {
            tg_k_device_hash = getCookieValue(document.cookie,"k_device_hash");
            console.log("tg_k_device_hash",tg_k_device_hash)
            GM_setValue("tg_k_device_hash", tg_k_device_hash)
            try {
                if(tg_k_device_hash){
                    document.querySelector('textarea').placeholder = `device_hash获取成功:${tg_k_device_hash}`
                }else{
                    document.querySelector('textarea').placeholder = `device_hash获取失败，请再次刷新.`
                }
            }catch (e) {}
            setTimeout(initDeviceHash,2000)
        } else {
            tg_k_device_hash =  GM_getValue("tg_k_device_hash")
        }
    }

    setTimeout(initDeviceHash)



    let tg_conversation_id
    async function TIANGONG(){
        showAnserAndHighlightCodeStr("请稍后...使用该线路，请确保已经登天工官网获取token后刷新页面。[天工AI](https://www.tiangong.cn/)")
        console.log("tg_k_device_hash:",tg_k_device_hash)
        if(!tg_k_device_hash){
            showAnserAndHighlightCodeStr("device_hash错误了。请确保已经登天工官网获取device_hash后刷新页面。[天工AI](https://www.tiangong.cn/)")
            return
        }



        //请求
        let req1 = await GM_fetch({
            method: "POST",
            url: "https://work.tiangong.cn/dialogue-aggregation/dialogue/aggregation/v1/chat/sensitive/words",
            headers: {
                "accept": "application/json, text/plain, */*",
                "origin":"https://www.tiangong.cn",
                "referer":"https://www.tiangong.cn/",
                "channel": "",
                "content-type": "application/json",
                "device": "Web",
                "device_hash": tg_k_device_hash,
                "device_id": tg_k_device_hash,
            },
            data:JSON.stringify({
                data:{
                    content: your_qus,
                    source: "web"
                }
            })
        })
        let req1Text = req1.responseText;
        console.log(req1Text)
        //获取对话id
        let req2 = await GM_fetch({
            method: "GET",
            url: "https://work.tiangong.cn/agents_api/user/dialogue_list?offset=0",
            headers: {
                "accept": "application/json, text/plain, */*",
                "origin":"https://www.tiangong.cn",
                "referer":"https://www.tiangong.cn/",
                "channel": "",
                "content-type": "application/json",
                "device": "Web",
                "device_hash": tg_k_device_hash,
                "device_id": tg_k_device_hash,
            },
        })
        let req2Text = req2.responseText;
        console.log(req2Text)
        tg_conversation_id = JSON.parse(req2Text).data.datalist[0].session_id
        console.log("tg_conversation_id",tg_conversation_id)


        //获取信息信息

        //连接天工 websocket

        let wssurl = `wss://work.tiangong.cn/dialogue-aggregation/dialogue/aggregation/v2/agent?device=Web&device_id=${tg_k_device_hash}&device_hash=${tg_k_device_hash}`

        let socket = new WebSocket(wssurl);
        socket.addEventListener('open', (event) => {
            console.log('天工 wss 连接成功');
            socket.send(JSON.stringify({
                "agent_id": "016",
                "agent_type": "universal",
                "conversation_id": tg_conversation_id,
                "prompt": {
                    "ask_from": "user",
                    "ask_id": null,
                    "content": your_qus,
                    "prompt_content": null,
                    "template_id": null,
                    "action": null,
                    "file": null,
                    "template": null,
                    "copilot": false,
                    "bubble_text": null,
                    "publish_agent": null,
                    "copilot_option": null
                }
            }))
        });

        let tg_result = []
        socket.addEventListener('message', (event) => {
            console.log('天工 接收到消息：', event.data);
            let revData = event.data;
            try{
                 let revJSON = JSON.parse(revData);
                 if(revJSON.type == 1){
                     try {
                         tg_result.push(revJSON.arguments[0].messages[0].text)
                         showAnserAndHighlightCodeStr(tg_result.join(""))
                     }catch (e) { }
                 }

            }catch (ex) { }

        });



    }


    //天工 ----end--------



    //问心一言 ----start---

    let yy_aisearch_id;
    let yy_pvId;
    let yy_sessionId;

    async function initYiYAN(){
        let req1 = await GM_fetch({
            method: "GET",
            url: `https://chat.baidu.com/?pcasync=pc&asyncRenderUrl=&passportStaticPage=https%3A%2F%2Fwww.baidu.com%2Fcache%2Fuser%2Fhtml%2Fv3Jump.html&from=pc_tab&word=${encodeURI(your_qus)}&source=pd_ic`,
            headers: {
                "accept": "*/*",
                "origin":"https://www.baidu.com",
                "referer":`https://www.baidu.com/`
            },
            data:JSON.stringify({
                data:{}
            })
        })
        let r = req1.responseText;
        yy_aisearch_id =  /"aisearch_id":"(.*?)"/i.exec(r)[1];
        yy_pvId =  /"pvId":"(.*?)"/i.exec(r)[1];
        yy_sessionId =  /"sessionId":"(.*?)"/i.exec(r)[1];
        console.log("yy_aisearch_id:",yy_aisearch_id)
        console.log("yy_pvId:",yy_pvId)
        console.log("yy_sessionId:",yy_sessionId)
    }
    setTimeout(()=>{
        if(getGPTMode() === 'YIYAN'){
            initYiYAN()
        }
    })
    async function YIYAN() {
        showAnserAndHighlightCodeStr("请稍后...该线路为官网线路，使用该线路，请确保已经登百度账号，再刷新页面。[百度](https://www.baidu.com/)")
        GM_fetch({
            method: 'POST',
            url: 'https://chat-ws.baidu.com/aichat/api/conversation',
            headers: {
                "origin":"https://www.baidu.com",
                "referer":`https://www.baidu.com/`,
                "Content-Type": "application/json",
                "accept": "text/event-stream"
            },
            responseType: "stream",
            data: JSON.stringify({
                "message": {
                    "inputMethod": "keyboard",
                    "isRebuild": false,
                    "content": {
                        "query": your_qus,
                        "qtype": 0
                    }
                },
                "sessionId": yy_sessionId,
                "aisearchId": yy_aisearch_id,
                "pvId": yy_pvId
            })
        }).then((stream)=> {
            let reader = stream.response.getReader()
            let ans = []
            let preResponseItem = '';//前一记录
            let combineItem = [];//合并
            let referenceList;//引用
            reader.read().then(function processText({done, value}) {
                if (done) {
                    console.log("===done==")
                    //console.log(de)
                    let result = ans.join("");
                    let arr = result.match(/\^(.*?)\^/g);
                    let oldArr = arr.slice()
                    if(referenceList && referenceList.length > 0){
                        for (let i = 0; i < arr.length; i++) {
                            for (let j = 0; j < referenceList.length; j++) {
                                if(arr[i].includes(`[${j+1}]`)){
                                    let url = referenceList[j].url;
                                    arr[i] = arr[i].replace(`[${j+1}]`,`[${j+1}](${url})`)
                                }
                            }
                        }
                    }
                    console.log("arr:",arr)
                    console.log("oldArr:",oldArr)
                    for (let i = 0; i < oldArr.length; i++) {
                        result =  result.replace(oldArr[i],arr[i].replace(/\^/g,""))
                    }
                    showAnserAndHighlightCodeStr(result)

                    return
                }
                let responseItem = new TextDecoder("utf-8").decode(value)
                console.log(responseItem)
                if(!responseItem.includes("event:ping") && !responseItem.startsWith("event:messag")){
                    combineItem.push(preResponseItem)
                    combineItem.push(responseItem)
                    preResponseItem = '';//恢复初始
                    responseItem = combineItem.join("")//合并
                    console.log("combineItem:",responseItem)
                    combineItem = [];//清空

                }else if(!responseItem.includes("event:ping")){
                    preResponseItem = responseItem;
                }


                responseItem.split("\n").forEach(item=>{
                    try {
                        let ii = item.replace(/data:/gi,"").trim();
                        if(ii && ii !==""){
                            let chunk = JSON.parse(ii).data.message.content.generator.text
                            //de.push(item.replace(/data:/gi,"").trim())
                            ans.push(chunk)
                            showAnserAndHighlightCodeStr(ans.join(""))
                            if(JSON.parse(ii).data.message.content.generator.referenceList){
                                referenceList = JSON.parse(ii).data.message.content.generator.referenceList
                            }

                        }
                    }catch (ex){
                        console.error(item)
                    }
                })

                return reader.read().then(processText)
            },function (reason) {
                Toast.error("未知错误!")
                console.log(reason)
            }).catch((ex)=>{
                Toast.error("未知错误!")
                console.log(ex)
            })
        })

    }
    //问心一言 ----end---


    //腾讯混元 ----start-----
    let hunyuan_tUserId = '';
    let hunyuan_count = 0;

    async function initHunyuanID() {
        if (location.href.includes("hunyuan.tencent.com") || location.href.includes("yuanbao.tencent.com")) {
            hunyuan_tUserId = getCookieValue(document.cookie,"hy_user");
            GM_setValue("hunyuan_tUserId", hunyuan_tUserId)
            if(hunyuan_tUserId){
                 Toast.info(`hunyuan_tUserId获取成功:${hunyuan_tUserId}`)
            }else{
                setTimeout(initHunyuanID, 5000)
                if(hunyuan_count < 3){
                    Toast.info(`hunyuan_tUserId获取失败，请再次刷新!`)
                }
                hunyuan_count++;
            }

        } else {
            hunyuan_tUserId =  GM_getValue("hunyuan_tUserId")
        }
    }
    //setTimeout(initHunyuanID)


    let hunyuan_isfirst = true;
    let hunyuan_chatId ;
    async function initHunyuan(){

        let req1 = await GM_fetch({
            method: "POST",
            url: `https://hunyuan.tencent.com/api/generate/id`,
            headers: {
                "accept": "application/json, text/plain, */*",
                "origin":"https://hunyuan.tencent.com",
                "referer":`https://hunyuan.tencent.com/bot/chat`,
                "t-userid": hunyuan_tUserId,
                "x-requested-with": "XMLHttpRequest",
                "x-source": "web"
            },
            data:null
        })
        let r = req1.responseText;
        hunyuan_chatId = r;
        if(hunyuan_chatId) hunyuan_isfirst = false;
        console.error("hunyuan_chatId:",r)
    }

   /* fetch('https://yuanbao.tencent.com/api/chat/ca7b253f-a1a7-4e24-82ca-667cc0fbd98d', {
        method: 'POST',
        headers: {
            'authority': 'yuanbao.tencent.com',
            'accept': '*!/!*',
            'accept-language': 'zh-CN,zh;q=0.9',
            'cache-control': 'no-cache',
            'chat_version': 'v1',
            'content-type': 'text/plain;charset=UTF-8',
            'cookie': '_ga=GA1.2.1033776250.1698727525; _gcl_au=1.1.484286265.1713846526; hy_source=web; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2229491242%22%2C%22first_id%22%3A%2218b840cf7219d8-044a60801af8344-1f7e152e-1440000-18b840cf7229ea%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E5%BC%95%E8%8D%90%E6%B5%81%E9%87%8F%22%7D%2C%22identities%22%3A%22eyIkaWRlbnRpdHlfY29va2llX2lkIjoiMThiODQwY2Y3MjE5ZDgtMDQ0YTYwODAxYWY4MzQ0LTFmN2UxNTJlLTE0NDAwMDAtMThiODQwY2Y3MjI5ZWEiLCIkaWRlbnRpdHlfbG9naW5faWQiOiIyOTQ5MTI0MiJ9%22%2C%22history_login_id%22%3A%7B%22name%22%3A%22%24identity_login_id%22%2C%22value%22%3A%2229491242%22%7D%2C%22%24device_id%22%3A%2218b840cf7219d8-044a60801af8344-1f7e152e-1440000-18b840cf7229ea%22%7D; hy_user=Bcw9KJaWemFaQ9iL; hy_token=bP9sp/yaXedZmIELMZz0hGSfpb6zW8UN7hFQeec8RFQIVAhWHCHLbFxq0tF5U6pO',
            'origin': 'https://yuanbao.tencent.com',
            'pragma': 'no-cache',
            'referer': 'https://yuanbao.tencent.com/chat/naQivTmsDa',
            'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.95 Safari/537.36',
            'x-requested-with': 'XMLHttpRequest',
            'x-source': 'web'
        },
        body: '{"model":"gpt_175B_0404","prompt":"你叫我什么","plugin":"Adaptive","displayPrompt":"你很牛吗","displayPromptType":1,"options":{},"multimedia":[],"agentId":"naQivTmsDa","version":"v2"}'
    });
    */
    async function Hunyuan(mtag) {

        showAnserAndHighlightCodeStr("请稍后...deepseek较慢。该线路为官网线路，请确保登录[元宝](https://yuanbao.tencent.com/chat)")

        if(!hunyuan_tUserId){
            let req1 = await GM_fetch({
                method: "GET",
                url: `https://yuanbao.tencent.com/api/getuserinfo`,
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "origin":"https://yuanbao.tencent.com",
                    "referer":`https://yuanbao.tencent.com`
                }
            })
            let r = req1.responseText;
            hunyuan_tUserId = JSON.parse(r).userId
            console.warn("hunyuan_tUserId:",hunyuan_tUserId)
            if(!hunyuan_tUserId){
                showAnserAndHighlightCodeStr("UserId获取失败，请登录[元宝](https://yuanbao.tencent.com/chat)")
                return
            }

        }

        if(hunyuan_isfirst && !hunyuan_chatId){
           await initHunyuan()
        }

        let payload = JSON.stringify({
            "model": "gpt_175B_0404",
            "prompt": your_qus,
            "displayPrompt": your_qus,
            "displayPromptType": 1,
            "plugin": "Adaptive",
            "isSkipHistory": false
        })
        //deepseek联网 2025.02
        if(mtag === 'deepseek'){
            payload = JSON.stringify({
                "model": "gpt_175B_0404",
                "prompt": your_qus,
                "displayPrompt": your_qus,
                "displayPromptType": 1,
                "plugin": "Adaptive",
                "isSkipHistory": false,
                "chatModelId": "deep_seek",
                "supportFunctions": [
                    "supportInternetSearch"
                ]
            })
        }


        GM_fetch({
            method: 'POST',
            url: `https://hunyuan.tencent.com/api/chat/${hunyuan_chatId}`,
            headers: {
                "origin":"https://hunyuan.tencent.com",
                "referer":`https://hunyuan.tencent.com/bot/chat`,
                "chat_version": "v1",
                "content-type": "text/plain;charset=UTF-8",
                "accept": "*/*",
                "t-userid": hunyuan_tUserId,
                "x-requested-with": "XMLHttpRequest",
                "x-source": "web"
            },
            responseType: "stream",
            data: payload
        }).then((stream)=> {
            let reader = stream.response.getReader()
            let ans = []
            reader.read().then(function processText({done, value}) {
                if (done) {
                    console.log("===done==")
                    //console.log(de)
                    let result = ans.join("");
                    showAnserAndHighlightCodeStr(result)

                    return
                }
                let responseItem = new TextDecoder("utf-8").decode(value)
                console.log(responseItem)
                responseItem.split("\n").forEach(item=>{
                    try {
                        let ii = item.replace(/data:/gi,"").trim();
                        if(ii && ii !==""){
                            let chunk = ''
                            //de.push(item.replace(/data:/gi,"").trim())

                            //add deepseek 2025.02
                            if(mtag === 'deepseek'){
                               chunk = JSON.parse(ii).content
                            }else{
                                chunk = JSON.parse(ii).msg
                            }


                            ans.push(chunk)
                            showAnserAndHighlightCodeStr(ans.join(""))

                        }
                    }catch (ex){
                        console.error(item)
                    }
                })

                return reader.read().then(processText)
            },function (reason) {
                Toast.error("未知错误!")
                console.log(reason)
            }).catch((ex)=>{
                Toast.error("未知错误!")
                console.log(ex)
            })
        })

    }



    //腾讯混元 ----end-----


    //ChatGLM相关 ----start-----
    //https://chatglm.cn

    let chatgml_token;
    async function init_chatgml_token() {
        if (location.href.includes("chatglm.cn")) {
            chatgml_token = getCookieValue(document.cookie, "chatglm_token")
             GM_setValue("chatgml_token", chatgml_token)
            if (chatgml_token) {
                console.log(`chatgml_token获取成功:${chatgml_token}`)
            } else {
                console.log('invite_Token获取失败，请再次刷新')
            }

        } else if(getGPTMode() === 'ChatGLM' || getGPTMode() === 'ChatGLM4') {
            chatgml_token = await GM_getValue("chatgml_token")
            console.log("chatgml_token:", chatgml_token)
        }
    }
    setTimeout(()=>{
        init_chatgml_token()
        setInterval(init_chatgml_token,5000)
    })

    let chatgml_first = true;
    let chatgml_task_id;
    let chatgml_context_id;
    async function ChatGLM() {
        console.log("chatgml_token:",chatgml_token)
        showAnserAndHighlightCodeStr("请稍后...该线路为官网线路，使用该线路，请确保已经登录并获取token，再刷新页面。[ChatGLM](https://chatglm.cn/)")

        if(!chatgml_token){
            setTimeout(init_chatgml_token)
            showAnserAndHighlightCodeStr("init_chatgml_token为空，请确保已经登录并获取token，再刷新页面。[ChatGLM](https://chatglm.cn/)")
            return
        }
        if (chatgml_first || !chatgml_task_id) {
            let req1 = await GM_fetch({
                method: "POST",
                url: `https://chatglm.cn/chatglm/backend-api/v1/conversation`,
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "authorization": `Bearer ${chatgml_token}`,
                    "origin": "https://chatglm.cn",
                    "content-type": "application/json;charset=UTF-8",
                    "referer": `https://chatglm.cn/detail`
                },
                data: JSON.stringify({
                    "prompt": your_qus
                })
            })
            let r = req1.responseText;
            let jsonObj = JSON.parse(r);
            try {
                chatgml_task_id = jsonObj.result.task_id;
                console.log("chatgml_task_id:",chatgml_task_id)
                chatgml_first = false;
            }catch (e) {
                showAnserAndHighlightCodeStr("task_id出错了，请确保已经登录并获取token，再刷新页面。[ChatGLM](https://chatglm.cn/)")
                return
            }
        }

        let req1 = await GM_fetch({
            method: "POST",
            url: `https://chatglm.cn/chatglm/backend-api/v1/stream_context`,
            headers: {
                "accept": "application/json, text/plain, */*",
                "authorization": `Bearer ${chatgml_token}`,
                "origin": "https://chatglm.cn",
                "content-type": "application/json;charset=UTF-8",
                "referer": `https://chatglm.cn/detail`
            },
            data: JSON.stringify({
                "prompt": your_qus,
                "seed": 69809,
                "max_tokens": 512,
                "conversation_task_id": chatgml_task_id,
                "retry": false,
                "retry_history_task_id": null
            })
        })
        let r = req1.responseText;
        let jsonObj = JSON.parse(r);
        try {
            chatgml_context_id = jsonObj.result.context_id;
            console.log("chatgml_context_id:",chatgml_task_id)
        }catch (e) {
            showAnserAndHighlightCodeStr("context_id出错了，请确保已经登录并获取token，再刷新页面。[ChatGLM](https://chatglm.cn/)")
            return
        }


        GM_fetch({
            method: "GET",
            url: `https://chatglm.cn/chatglm/backend-api/v1/stream?context_id=${chatgml_context_id}`,
            headers: {
                "accept": "text/event-stream",
                "origin": "https://chatglm.cn",
                "referer": `https://chatglm.cn/detail`
            },
            responseType:"stream"
        }).then((stream)=> {
            let reader = stream.response.getReader()

            reader.read().then(function processText({done, value}) {
                if (done) {
                    return
                }
                let responseItem = new TextDecoder("utf-8").decode(value)
               // console.error(responseItem)
                responseItem = responseItem.split("\n\n");
                console.warn(responseItem)
                responseItem.forEach(item=>{
                    try {
                        if(item && item.startsWith("event:add") || item.startsWith("event:finish")){
                            let ii =   item.replace(/data:/gi,"")
                                .replace(/event:add/gi,"")
                                .replace(/event:finish/gi,"")
                                .trim();
                            if(ii){
                                showAnserAndHighlightCodeStr(ii)
                            }
                        }

                    }catch (ex){
                        console.error(item)
                    }
                })

                return reader.read().then(processText)
            },function (reason) {
                Toast.error("未知错误!")
                console.log(reason)
            }).catch((ex)=>{
                Toast.error("未知错误!")
                console.log(ex)
            })
        })


    }

    let glm_conversation_id
    async function ChatGLM4(){
        console.log("chatgml_token:",chatgml_token)
        showAnserAndHighlightCodeStr("请稍后...该线路为官网线路，使用该线路，请确保已经登录并获取token，再刷新页面。[ChatGLM](https://chatglm.cn/)")

        if(!chatgml_token){
            setTimeout(init_chatgml_token)
            showAnserAndHighlightCodeStr("init_chatgml_token为空，请确保已经登录并获取token，再刷新页面。[ChatGLM](https://chatglm.cn/)")
            return
        }

        GM_fetch({
            method: "POST",
            url: `https://chatglm.cn/chatglm/backend-api/assistant/stream`,
            headers: {
                "authorization": `Bearer ${chatgml_token}`,
                "accept": "text/event-stream",
                "content-type": "application/json",
                "origin": "https://chatglm.cn",
                "referer": `https://chatglm.cn/main/alltoolsdetail`
            },
            data:JSON.stringify({
                "assistant_id": "65940acff94777010aa6b796",
                "conversation_id": glm_conversation_id ? glm_conversation_id : "",
                "meta_data": {
                    "mention_conversation_id": "",
                    "is_test": false,
                    "input_question_type": "xxxx",
                    "channel": "",
                    "draft_id": ""
                },
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": your_qus
                            }
                        ]
                    }
                ]
            }),
            responseType:"stream"
        }).then((stream)=> {
            let reader = stream.response.getReader()
            let res = []
            reader.read().then(function processText({done, value}) {
                if (done) {
                    return
                }
                let responseItem = new TextDecoder("utf-8").decode(value)
                 //console.error(responseItem)
                 responseItem = responseItem.split("\n\n");
                console.warn(responseItem)
                if(responseItem.length >= 2 && responseItem[responseItem.length - 2].includes("finish")){

                    responseItem.forEach(item=>{
                        try {
                           let resJson =  JSON.parse(item.replace(/event:message\ndata:/gi,""))
                            let part =  resJson.parts[0].content[0].text
                            if(resJson.parts[0].status == 'finish'){
                                res.push(part)
                                showAnserAndHighlightCodeStr(res.join(""))
                            }else if (resJson.parts[0].status == 'init'){
                                showAnserAndHighlightCodeStr(part)
                            }

                            if(resJson.conversation_id){
                                glm_conversation_id = resJson.conversation_id
                            }

                        }catch (ex){
                            console.error(item)
                        }
                    })
                }


                return reader.read().then(processText)
            },function (reason) {
                Toast.error("未知错误!")
                console.log(reason)
            }).catch((ex)=>{
                Toast.error("未知错误!")
                console.log(ex)
            })
        })
    }


    //ChatGLM相关 ----start-----


    //智谱AI
    let zhipuToken = '4056fc44f1474c1e85e976577f930e40.O6WKndzKWBjQJWcA';
    let zhipuPrompt = []
    let zhipu_apiKey = localStorage.getItem("ZhipuapiKey")

    function base64UrlEncode(str) {
        let encodedSource = CryptoJS.enc.Base64.stringify(str);
        const reg = new RegExp('/', 'g');
        encodedSource = encodedSource.replace(/=+$/,'').replace(/\+/g,'-').replace(reg,'_');
        return encodedSource;
    }
    function generate_token(apikey, exp_seconds) {

        const [id, secretKey] = apikey.split(".");
        const payload = {
            "api_key": id,
            "exp": Date.now() + exp_seconds * 1000,
            "timestamp": Date.now(),
            // "exp": 1687878553567,
            // "timestamp": 1687877553567
        };

        const encodedHeader = base64UrlEncode(CryptoJS.enc.Utf8.parse(JSON.stringify({ alg: 'HS256', sign_type: 'SIGN', typ: "JWT"})));
        const encodedPayload = base64UrlEncode(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)));

        const signature = CryptoJS.HmacSHA256(encodedHeader + '.' + encodedPayload,  secretKey);

        console.log(signature)
        //const encodedSignature = window.btoa(signature);

        const jwt = encodedHeader + '.' + encodedPayload + '.' + base64UrlEncode(signature);

        console.log(jwt);
        return jwt;
    }
    function ZhipuAI(){
        showAnserAndHighlightCodeStr("请稍后。未申请key的，请前往[智谱AI](https://open.bigmodel.cn/usercenter/apikeys)申请，然后点击设置里的更新key")
        if(!localStorage.getItem("ZhipuapiKey")){
            showAnserAndHighlightCodeStr("apikey不存在。请前往[智谱AI](https://open.bigmodel.cn/usercenter/apikeys)申请，然后点击设置里的更新key")
            return
        }
        zhipu_apiKey = zhipu_apiKey || localStorage.getItem("ZhipuapiKey");
        addMessageChain(zhipuPrompt, {"role": "user", "content": your_qus} , 10)
        GM_fetch({
            method: "POST",
            url: `https://open.bigmodel.cn/api/paas/v3/model-api/chatglm_std/sse-invoke`,
            headers: {
                "accept": "text/event-stream",
                "Content-Type":"application/json",
               "Authorization": generate_token(zhipu_apiKey, 1000)
                // "Authorization": 'eyJhbGciOiJIUzI1NiIsInNpZ25fdHlwZSI6IlNJR04iLCJ0eXAiOiJKV1QifQ.eyJhcGlfa2V5IjoiZjM3ZDVlMjFhZDk1NGJhOTM0NmYyOTgwMTgzNDJiMjciLCJleHAiOjE2ODc4Nzg1NTM1NjcsInRpbWVzdGFtcCI6MTY4Nzg3NzU1MzU2N30.e8SMjA0vBaUxXB-WrViFa0-C0qVLechNV5L5s2WoF8c'
            },
            data:JSON.stringify({
                model:"chatglm_std",
                prompt : zhipuPrompt,
                temperature: 0.95,
                top_p: 0.7,
                incremental: true
            }),
            responseType:"stream"
        }).then((stream)=> {
            let reader = stream.response.getReader()
            let ans = [];
            reader.read().then(function processText({done, value}) {
                if (done) {
                    if(ans.length > 0){
                        addMessageChain(zhipuPrompt, {"role": "assistant", "content": ans.join("")} , 10)
                    }
                    return
                }
                let responseItem = new TextDecoder("utf-8").decode(value)
                 console.error(responseItem)
                responseItem = responseItem.split("\n");
                console.warn(responseItem)
                responseItem.forEach(item=>{
                    try {
                        if(item && item.startsWith("data:")){
                            let ii = item.replace(/data:/gi,"")
                            if(ii){
                                ans.push(ii)
                                showAnserAndHighlightCodeStr(ans.join(""))
                            }
                        }
                    }catch (ex){
                        console.error(item)
                    }
                })
                return reader.read().then(processText)
            },function (reason) {
                Toast.error("未知错误!")
                console.log(reason)
            }).catch((ex)=>{
                Toast.error("未知错误!")
                console.log(ex)
            })
        })
    }




    //360智脑 -------start------


    let conversation_id;
    async function Zhinao360(){
        showAnserAndHighlightCodeStr("请稍后...该线路为官网线路，使用该线路，请确保已经登录[360智脑](https://chat.360.cn/)")
        const sendData = JSON.stringify({
            "prompt": your_qus,
            "conversation_id": conversation_id || "",
            "source_type": "prophet_web",
            "role": "00000001",
            "is_regenerate": false,
            "is_so": false
        });
        console.log(conversation_id)

        GM_fetch({
            method: "POST",
            url: `https://chat.360.cn/backend-api/api/common/chat`,
            headers: {
                "accept": "text/event-stream",
                "origin": "https://chat.360.cn",
                "referer": `https://chat.360.cn/index`,
                "content-type": "application/json",
            },
            data: sendData,
            responseType:"stream"
        }).then((stream)=> {
            let reader = stream.response.getReader()
            let result = []
            reader.read().then(function processText({done, value}) {
                if (done) {
                    return
                }
                let responseItem = new TextDecoder("utf-8").decode(value)
                // console.error(responseItem)
                console.warn(responseItem)
                if(responseItem){
                    responseItem.split("\n").forEach(item=>{
                        try{
                            if(item.startsWith("data: CONVERSATIONID####")){
                                conversation_id =  item.replace(/data: CONVERSATIONID####/gi,"")

                            }else if(item.startsWith("data: MESSAGEID####")){

                            }else if(item.startsWith("data")){
                                let i =  item.replace(/data: /gi,"")
                                if(i){
                                    result.push(i)
                                }else{
                                    result.push("\n")
                                }
                            }
                        }catch (e) {}
                    })
                    showAnserAndHighlightCodeStr(result.join(""))
                }

                return reader.read().then(processText)
            },function (reason) {
                console.log(reason)
                Toast.error("未知错误!")
            }).catch((ex)=>{
                Toast.error("未知错误!")
                console.log(ex)
            })
        })

    }

    //360智脑 -------end------



    //百川AI---start


    function getEagleEyeSessionID() {
        for (var e, t, r = 20, n = new Array(r), a = Date.now().toString(36).split(""); r-- > 0; )
            t = (e = 36 * Math.random() | 0).toString(36),
                n[r] = e % 3 ? t : t.toUpperCase();
        for (var i = 0; i < 8; i++)
            n.splice(3 * i + 2, 0, a[i]);
        return n.join("")
    }

    let EagleEyeSessionID = getEagleEyeSessionID();

    function getRandIP() {
        for (var e = [], t = 0; t < 4; t++) {
            var r = Math.floor(256 * Math.random());
            e[t] = (r > 15 ? "" : "0") + r.toString(16)
        }
        return e.join("").replace(/^0/, "1")
    }

    function getEagleEyeTraceID() {
        let e = getRandIP()
            , t = Date.now()
            , r = 1000
            , a = e + t + r + "cced8";
        return a
    }

    let EagleEyeTraceID = getEagleEyeTraceID()


    let bc_session_id = generateRandomString(11)
    let bc_messageId = generateRandomString(13)

    let bc_userID;

    async function getBCUserID() {
        let rr = await GM_fetch({
            method: "GET",
            url: `https://www.baichuan-ai.com/api/auth/session`
        });
        if (rr.status === 200) {
            console.log(rr)
            let result = JSON.parse(rr.responseText);
            bc_userID = result.user.id;
        } else {
            console.error(rr)
        }
    }

    setTimeout(()=>{
        if(getGPTMode()==="BAICHUAN"){
            getBCUserID()
        }
    })


    let bc_parent_id = 0
    let bc_session_info_id

    async function BAICHUAN() {
        console.log("bc_parent_id",bc_parent_id)
        showAnserAndHighlightCodeStr("请耐心等待,该线路为非流式传输较慢,第一次切换到该线路需要刷新页面，该线路为官网线路,使用前确保已经登录[百川](https://www.baichuan-ai.com/chat)")
        if(!bc_userID){
            showAnserAndHighlightCodeStr("userid为空，请重试。。。使用前确保已经登录[百川](https://www.baichuan-ai.com/chat)")
            getBCUserID()
            return
        }

        let now = Date.now()
        GM_fetch({
            method: "POST",
            url: `https://www.baichuan-ai.com/api/chat/v1/chat`,
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'EagleEye-SessionID': EagleEyeSessionID,
                'EagleEye-TraceID': EagleEyeTraceID,
                'EagleEye-pAppName': 'bc7akk1cwt@b6e253f842cced8',
                'Origin': 'https://www.baichuan-ai.com',
                'Referer': 'https://www.baichuan-ai.com/chat',
                'x-requested-with': 'XMLHttpRequest'
            },
            data: JSON.stringify({
                'type': 'input',
                'request_id': uuidv4(),
                'stream': true,
                'prompt': {
                    'id': null,
                    'messageId': `Ub${generateRandomString(13)}`,
                    'session_id': bc_session_id,
                    'data': your_qus,
                    'from': 0,
                    'parent_id': bc_parent_id,
                    'created_at': now,
                    'attachments': []
                },
                'app_info': {
                    'id': 10001,
                    'name': 'baichuan_web'
                },
                'user_info': {
                    'id': bc_userID,
                    'status': 1
                },
                'session_info': {
                    'id': bc_session_info_id ? bc_session_info_id: null,
                    'session_id': bc_session_id,
                    'name': '\u65B0\u7684\u5BF9\u8BDD',
                    'created_at': now
                },
                'assistant_info': {},
                'parameters': {
                    'repetition_penalty': -1,
                    'temperature': -1,
                    'top_k': -1,
                    'top_p': -1,
                    'max_new_tokens': -1,
                    'do_sample': -1,
                    'regenerate': 0,
                    'wse': true
                },
                'history': [],
                'assistant': {},
                'retry': 3
            }),
           // responseType:"stream"
        }).then((stream)=>{
            let responseText =  stream.responseText
            let result = []
            //console.warn(responseText)
            let arr = responseText.split("\n")
            for (let i = 0; i < arr.length; i++) {
                try {
                    result.push(JSON.parse(arr[i]).answer.data)
                    showAnserAndHighlightCodeStr(result.join(""))
                }catch (e) { }
            }
            showAnserAndHighlightCodeStr(result.join(""))

            // let result = []
            // const reader = stream.response.getReader();
            // reader.read().then(function processText({done, value}) {
            //     if (done) {
            //         return;
            //     }
            //     try {
            //         let d = new TextDecoder("utf8").decode(new Uint8Array(value));
            //         console.warn(d)
            //
            //         try {
            //             result.push(JSON.parse(d).answer.data)
            //             showAnserAndHighlightCodeStr(result.join(""))
            //         }catch (e) {
            //             console.error(d)
            //         }
            //
            //         try {
            //             let v = JSON.parse(d).rds
            //             bc_parent_id = v[v.length - 1].id
            //             bc_session_info_id = v[0].id
            //         }catch (e) {
            //             //console.error(d)
            //         }
            //
            //
            //
            //     } catch (e) {
            //         console.log(e)
            //     }
            //
            //     return reader.read().then(processText);
            // });
        },reason => {
            console.log(reason)
            Toast.error("未知错误!")
        }).catch((ex)=>{
            console.log(ex)
            Toast.error("未知错误!")
        })


    }
    //百川AI---end


    let messageChain_chatforai = []
    let chatforai_coverid = uuidv4()

    const generateSignatureChatforai = async(t,e)=>{
        const {t: a, m: r, id: o} = t
            , s = `${o}:${a}:${r}:${e}`;
        return await digestMessage(s)
    }

    function chatforai() {

        let now = Date.now();

        generateSignatureChatforai({
            t: now,
            m: your_qus,
            id: chatforai_coverid
        }, "D6D4X4g9").then(sign => {
            addMessageChain(messageChain_chatforai, {role: "user", content: your_qus})//连续话
            console.log(sign)
            GM_fetch({
                method: "POST",
                url: "https://chatforai.store/api/handle/provider-openai",
                headers: {
                    "Content-Type": "text/plain;charset=UTF-8",
                    "Referer": "https://chatforai.store",
                    "accept": "*/*",
                    "X-Forwarded-For": generateRandomIP(),
                    "X-Real-IP": generateRandomIP(),
                    "Origin": "https://chatforai.store",
                },
                data: JSON.stringify({
                    "conversationId": chatforai_coverid,
                    "conversationType": "chat_continuous",
                    "botId": "chat_continuous",
                    "globalSettings": {
                        "baseUrl": "https://api.openai.com",
                        "model": "gpt-3.5-turbo",
                        "maxTokens": 2048,
                        "messageHistorySize": 5,
                        "temperature": 0.7,
                        "top_p": 1
                    },
                    "prompt": your_qus,
                    "messages": messageChain_chatforai,
                    "sign": sign,
                    "timestamp": now
                }),
                responseType: "stream"
            }).then((stream) => {
                let result = [];
                const reader = stream.response.getReader();
                reader.read().then(function processText({done, value}) {
                    if (done) {
                        let finalResult = result.join("")
                        try {
                            console.log(finalResult)
                            addMessageChain(messageChain_chatforai, {
                                role: "assistant",
                                content: finalResult
                            })
                            showAnserAndHighlightCodeStr(finalResult)
                        } catch (e) {
                            console.log(e)
                        }
                        return;
                    }
                    try {
                        let d = new TextDecoder("utf8").decode(new Uint8Array(value));
                        result.push(d)
                        showAnserAndHighlightCodeStr(result.join(""))
                    } catch (e) {
                        console.log(e)
                    }

                    return reader.read().then(processText);
                });
            },function (reason) {
                console.log(reason)
                Toast.error("未知错误!" + reason.message)

            }).catch((ex)=>{
                console.log(ex)
                Toast.error("未知错误!" + ex.message)
            });

        });
    }


    async function MixerBox() {
        GM_fetch({
            method: "POST",
            url: `https://chatai.mixerbox.com/api/chat/stream`,
            headers: {
                "Referer": "https://chatai.mixerbox.com/chat",
                "origin": "https://chatai.mixerbox.com",
                "accept": "*/*",
                "content-type": "application/json",
                "user-agent": "Mozilla/5.0 (Android 12; Mobile; rv:107.0) Gecko/107.0 Firefox/107.0"
            },
            data:JSON.stringify({
                "prompt": [
                    {
                        "role": "user",
                        "content": your_qus
                    }
                ],
                "lang": "zh",
                "model": "gpt-3.5-turbo",
                "plugins": [],
                "pluginSets": [],
                "getRecommendQuestions": true,
                "isSummarize": false,
                "webVersion": "1.4.5",
                "userAgent": "Mozilla/5.0 (Android 12; Mobile; rv:107.0) Gecko/107.0 Firefox/107.0",
                "isExtension": false
            }),
            responseType:"stream"
        }).then((stream)=>{
            let result = []
            const reader = stream.response.getReader();
            reader.read().then(function processText({done, value}) {
                if (done) {
                    return;
                }
                try {
                    let d = new TextDecoder("utf8").decode(new Uint8Array(value));
                    console.warn(d)
                    d.split("\n").forEach(item=>{
                        try {
                            if(item.startsWith("data")){
                                result.push(item.replace(/data:/gi,""))
                            }
                        }catch (ex){

                        }
                    })
                    showAnserAndHighlightCodeStr(result.join("").
                    replace(/\[space\]/gi," ").
                    replace(/\[NEWLINE\]/gi,"\n").
                    replace(/message_donedone/gi,"\n").
                    replace(/\[DONE\]/gi,"\n"))

                } catch (e) {
                    console.log(e)
                }

                return reader.read().then(processText);
            });
        },reason => {
            console.log(reason)
            Toast.error("未知错误!")
        }).catch((ex)=>{
            console.log(ex)
            Toast.error("未知错误!")
        })


    }



    let minimax_group_id = localStorage.getItem("minimax_group_id")//"172531245...";
    let minimax_api_key = localStorage.getItem("minimax_api_key")// "eyJhbGciOi.....
    let minimax_messageChain = [];
    async function miniMax() {

        if(!minimax_group_id || !minimax_api_key){
            showAnserAndHighlightCodeStr("group_id或api_key不存在，请到[https://api.minimax.chat/](https://api.minimax.chat/)注册，申请。然后点击 设置-》更新秘钥")
        }

        addMessageChain(minimax_messageChain, {
            "sender_type": "USER",
            "sender_name": "用户",
            "text": your_qus
        },10)

        let sendData =  {
            "model": "abab5.5-chat",
            "tokens_to_generate": 1024,
            "temperature": 0.9,
            "top_p": 0.95,
            "stream": false,
            "reply_constraints": {
                "sender_type": "BOT",
                "sender_name": "MM智能助理"
            },
            "sample_messages": [],
            "plugins": [],
            "messages": minimax_messageChain,
            "bot_setting": [
                {
                    "bot_name": "MM智能助理",
                    "content": "MM智能助理是一款由MiniMax自研的，没有调用其他产品的接口的大型语言模型。MiniMax是一家中国科技公司，一直致力于进行大模型相关的研究。"
                }
            ]
        }


        GM_fetch({
            method: "POST",
            url:`https://api.minimax.chat/v1/text/chatcompletion_pro?GroupId=${minimax_group_id}`,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${minimax_api_key}`,
            },
            data: JSON.stringify(sendData),
            responseType:"stream"
        }).then((stream)=>{
            let result = []
            const reader = stream.response.getReader();
            reader.read().then(function processText({done, value}) {
                if (done) {

                    addMessageChain(minimax_messageChain,{
                        "sender_type": "BOT",
                        "sender_name": "MM智能助理",
                        "text": result.join("")
                    },10)
                    return;
                }
                try {
                    let d = new TextDecoder("utf8").decode(new Uint8Array(value));
                    console.warn(d)
                    result.push(JSON.parse(d).reply)
                    showAnserAndHighlightCodeStr(result.join(""))

                } catch (e) {
                    console.log(e)
                }

                return reader.read().then(processText);
            });
        },reason => {
            console.log(reason)
            Toast.error("未知错误!")
        }).catch((ex)=>{
            console.log(ex)
            Toast.error("未知错误!")
        })


    }


    //https://ai1.chagpt.fun/
    function CVEOY() {

        let baseURL = "https://free-api.cveoy.top/";
        GM_xmlhttpRequest({
            method: "POST",
            url: baseURL + "v3/completions",
            headers: {
                "Content-Type": "application/json",
                "origin": "https://ai1.chagpt.fun",
                "Referer": baseURL
            },
            data: JSON.stringify({
                prompt: your_qus
            }),
            onloadstart: (stream) => {
                let result = [];
                const reader = stream.response.getReader();
                reader.read().then(function processText({done, value}) {
                    if (done) {

                        try {
                            let finalResult = result.join("")
                            console.log(finalResult)
                            showAnserAndHighlightCodeStr(finalResult)
                        } catch (e) {
                            console.log(e)
                            Toast.error("未知错误!")
                        }
                        return;
                    }
                    try {
                        let d = new TextDecoder("utf8").decode(new Uint8Array(value));
                        if(d.match(/wxgpt@qq.com/gi)){
                           d = d.replace(/wxgpt@qq.com/gi,"")
                        }
                        result.push(d);
                        console.log(d)
                        showAnserAndHighlightCodeStr(result.join(""))
                    } catch (e) {
                        console.log(e)
                    }

                    return reader.read().then(processText);
                });
            },
            responseType: "stream",
            onerror: function (err) {
                console.log(err)
                Toast.error("未知错误!")
            }
        });

    }



    //获取A类网站key 2023年5月3日
    async function setNormalKey(url) {
       let response = await GM_fetch({
            method: "GET",
            url: url,
           headers: {
               "Referer": url+"/",
               "origin": url,
               "upgrade-insecure-requests":"1"
           }
        });
        let resp = response.responseText;
        if(!resp){
            response = await GM_fetch({
                method: "GET",
                url: url,
                headers: {
                    "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "Referer": url+"/",
                    "origin": url,
                    "cookie":"_h=_1",
                    "upgrade-insecure-requests":"1"
                }
            });
             resp = response.responseText;
        }
        let regex = /component-url="(.*?)"/i;
        let match = resp.match(regex);
        let jsurl = match[1];
        console.log("js url:" + jsurl);
        if (!jsurl) {
            //错误
            console.log(resp)
            Toast.error("未知错误!")
            return
        }
       let rr = await GM_fetch({
            method: "GET",
            url: url + jsurl,
            headers: {
               "Referer": url+"/",
               "origin": url,
                "cookie":"_h=_1"
            }
        });
        resp = rr.responseText;
        regex = /\`\$\{\w\}:\$\{\w\}:(.*?)\`/i;
        match = resp.match(regex);
        let key = match[1];
        console.log(url+":key:",key)
        return key
    }




    //https://s.aifree.site/
    let messageChain_aifree = []
    function AIFREE() {

        let now = Date.now();
        let Baseurl = `https://am.aifree.site/`
        generateSignatureWithPkey({
            t:now,
            m: your_qus || "",
            pkey: {}.PUBLIC_SECRET_KEY || ""
        }).then(sign => {
            addMessageChain(messageChain_aifree, {role: "user", content: your_qus})//连续话
            console.log(sign)
            GM_fetch({
                method: "POST",
                url: Baseurl + "api/generate",
                headers: {
                    "Content-Type": "text/plain;charset=UTF-8",
                    "Referer": Baseurl,
                    "accept": "application/json, text/plain, */*"
                },
                data: JSON.stringify({
                    messages: messageChain_aifree,
                    time: now,
                    pass: null,
                    sign: sign
                }),
                responseType: "stream"
            }).then((stream) => {
                let result = [];
                const reader = stream.response.getReader();
                reader.read().then(function processText({done, value}) {
                    if (done) {
                        let finalResult = result.join("")
                        try {
                            console.log(finalResult)
                            addMessageChain(messageChain_aifree, {
                                role: "assistant",
                                content: finalResult
                            })
                            showAnserAndHighlightCodeStr(finalResult)
                            if(finalResult.includes("Invalid signature") || finalResult.includes("exceeded your current")){
                                Toast.error(`无效或过期，请到设置更新key`)
                            }
                        } catch (e) {
                            console.log(e)
                        }
                        return;
                    }
                    try {
                        let d = new TextDecoder("utf8").decode(new Uint8Array(value));
                        result.push(d)
                        showAnserAndHighlightCodeStr(result.join(""))
                    } catch (e) {
                        console.log(e)
                    }

                    return reader.read().then(processText);
                });
            },function (reason) {
                console.log(reason)
                Toast.error("未知错误!" + reason.message)

            }).catch((ex)=>{
                console.log(ex)
                Toast.error("未知错误!" + ex.message)
            });

        });
    }



    let  formatTime = () => {
        let padZero = (num) => {
            // 如果数字小于 10，前面补一个 0
            return num < 10 ? `0${num}` : num;
        }
        const now = new Date(); // 获取当前时间
        const hours = now.getHours(); // 获取小时
        const minutes = now.getMinutes(); // 获取分钟
        const seconds = now.getSeconds(); // 获取秒数
        // 格式化为 HH:MM:SS 的形式
        return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    }




    function TDCHAT(){
        abortXml = GM_xmlhttpRequest({
            method: "POST",
            url: "http://7shi.zw7.lol/chat.php",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Referer": "http://7shi.zw7.lol/",
                "accept": "application/json, text/plain, */*"
            },
            data: `id=3.5&key=&role=&title=&text=${encodeURIComponent(your_qus).replace(/%/g, '‰')}&length=${your_qus.length}&stream=1`,
            onloadstart: (stream) => {
                let result = [];
                let finalResult = [];
                const reader = stream.response.getReader();
                reader.read().then(function processText({done, value}) {
                    if (done) {
                        finalResult = result.join("")
                        showAnserAndHighlightCodeStr(finalResult.replace(/tdchat/gi,""))
                        return;
                    }

                    try {
                        let d = new TextDecoder("utf8").decode(new Uint8Array(value));
                        console.log("raw:",d)
                        let dd = d.replace(/data: /g, "").split("\n\n")
                        console.log("dd:",dd)
                        dd.forEach(item=>{
                            try {
                                let delta = JSON.parse(item).choices[0].delta.content
                                result.push(delta)
                                showAnserAndHighlightCodeStr(result.join("").replace(/tdchat/gi,""))
                            }catch (e) {

                            }
                        })
                    } catch (e) {
                        console.log(e)
                    }


                    return reader.read().then(processText);
                });
            },
            responseType: "stream",
            onerror: function (err) {
                console.log(err)
                Toast.error("未知错误!" + err.message)
            }
        })

    }


    //
    //23-4-25
    function TOYAML() {

        GM_fetch({
            method: "GET",
            url: "https://toyaml.com/streams?q="+encodeURI(your_qus),
            headers: {
                "Referer": "https://toyaml.com/chat.html",
                "accept": "*/*",
                "x-requested-with": "XMLHttpRequest"

            },
            responseType: "stream"
        }).then((stream) => {
            let finalResult = [];
            const reader = stream.response.getReader();
            reader.read().then(function processText({done, value}) {
                if (done) {
                    return;
                }
                try {
                    // console.log(normalArray)
                    let byteArray = new Uint8Array(value);
                    let decoder = new TextDecoder('utf-8');
                    let nowResult = decoder.decode(byteArray)
                    console.log(nowResult)
                    if(!nowResult.match(/答案来自/)){
                        finalResult.push(nowResult)
                    }
                    showAnserAndHighlightCodeStr(finalResult.join(""))

                } catch (ex) {
                    console.log(ex)
                }

                return reader.read().then(processText);
            });
        }).catch((ex)=>{
            console.log(ex)
            Toast.error("未知错误!" + ex.message)
        })




    }




    //默认设置
    setTimeout(()=>{
        if(localStorage.getItem('GPTMODE')){
            const selectEl = document.getElementById('modeSelect');
            let optionElements = selectEl.querySelectorAll("option");
            for (let op in optionElements) {
                if(optionElements[op].value === localStorage.getItem('GPTMODE')){
                    optionElements[op].setAttribute("selected", "selected");
                    break;
                }
            }
        }

        if(localStorage.getItem('gpt_font_size')){
            document.querySelector("#gptDiv").style.fontSize = localStorage.getItem('gpt_font_size');
        }

        //禁用历史
        if(localStorage.getItem('history_disable')){
            let dis = localStorage.getItem('history_disable');
            history_disable = (dis === 'true' ? true : false);
        }

    },1000)


})();