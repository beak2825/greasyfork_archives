// ==UserScript==
// @name         chatGPT tools Cutoff（精简版）
// @namespace    http://tampermonkey.net/
// @version      1.0.14
// @description  Google、必应、百度、Yandex、360搜索、谷歌镜像、Fsou、duckduckgo侧边栏Chat搜索，即刻体验AI，无需翻墙，无需注册，无需等待！
// @author       原版作者 夜雨 chatGPT tools Plus（修改版）
// @match        https://cn.bing.com/*
// @match        https://www.bing.com/*
// @match      https://chat.openai.com/chat
// @match      https://www.google.com/*
// @match      https://duckduckgo.com/*
// @match      https://www.so.com/s*
// @match      http*://www.baidu.com/s*
// @match      https://www.baidu.com*
// @match      https://m.baidu.com/*
// @match      http*://yandex.ru/search*
// @match      http*://yandex.com/search*
// @match      https://search.ecnu.cf/search*
// @match      https://search.aust.cf/search*
// @match      https://search.*.cf/search*
// @match      https://fsoufsou.com/search*
// @match      https://www.google.com.hk/*
// @include    /^https:\/\/www\.baidu\.com\/s\?wd.*$/
// @icon       https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       GM_openInTab
// @grant      GM_registerMenuCommand
// @grant      GM_setValue
// @grant      GM_getValue
// @run-at     document-end
// @require    https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @require    https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require    https://cdn.bootcdn.net/ajax/libs/marked/4.3.0/marked.min.js
// @require    https://cdn.bootcdn.net/ajax/libs/markdown-it/13.0.1/markdown-it.min.js
// @require    https://unpkg.com/axios/dist/axios.min.js
// @connect    api.forchange.cn
// @connect    wenxin110.top
// @connect    gpt008.com
// @connect    chatforai.cc
// @connect    api.aigcfun.com
// @connect    www.aiai.zone
// @connect    chatbot.theb.ai
// @connect    cbjtestapi.binjie.site
// @connect    ai.bo-e.com
// @connect    a.mydog.buzz
// @connect    freechatgpt.xgp.one
// @connect    gptkey.oss-cn-hangzhou.aliyuncs.com
// @connect    luntianxia.uk
// @connect    chat.51buygpt.com
// @connect    chat.extkj.cn
// @connect    mirrorchat.extkj.cn
// @connect    api.tdchat0.com
// @connect    chat6.xeasy.me
// @connect   chat.wuguokai.cn
// @connect   ai5.wuguokai.top
// @connect   chat.aidutu.cn
// @connect   aichat.leiluan.cc
// @connect   chat.gptservice.xyz
// @connect   gpt66.cn
// @connect   ai.ls
// @connect   chatgpt.letsearches.com
// @connect   gpt.wobcw.com
// @connect   chat.68686.ltd
// @connect   www.aitianhu.com
// @connect   free.anzz.top
// @connect   chat.ohtoai.com
// @connect   freeopenai.xyz
// @connect   supremes.pro
// @connect   chat.bnu120.space
// @connect   chat7.aifks001.online
// @connect   ai.usesless.com
// @connect   www.ftcl.store
// @connect   chat.sunls.me
// @connect   chat.wobcw.com
// @connect   www.pizzagpt.it
// @connect   www.phind.com
// @connect   anfans.cn
// @connect   chat.bushiai.com
// @connect   chatgpt.qdymys.cn
// @license    MIT
// @website    https://blog.yeyusmile.top/gpt.html
// @require    https://cdn.bootcdn.net/ajax/libs/showdown/2.1.0/showdown.min.js
// @require    https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/highlight.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require    https://cdn.bootcdn.net/ajax/libs/KaTeX/0.16.4/katex.min.js
 
// @downloadURL https://update.greasyfork.org/scripts/464405/chatGPT%20tools%20Cutoff%EF%BC%88%E7%B2%BE%E7%AE%80%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/464405/chatGPT%20tools%20Cutoff%EF%BC%88%E7%B2%BE%E7%AE%80%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
    // grant       GM_getResourceText
    // resource markdownCss https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown.css
    // resource highlightCss https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css
    //  GM_addStyle(GM_getResourceText("markdownCss"));
    // GM_addStyle(GM_getResourceText("highlightCss"));
 
 
    //(prefers-color-scheme: light)
    $("head").append($(
        '<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/github-markdown-css/5.2.0/github-markdown.css" media="(prefers-color-scheme: dark)">'
    ));
    $("head").append($(
        '<link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/styles/base16/default-dark.min.css">'
    ));
    $("head").append($(
        '<link href="https://cdn.bootcss.com/github-markdown-css/2.10.0/github-markdown.min.css" rel="stylesheet">'
    ));
    $("head").append($(
        '<link href="https://cdn.bootcdn.net/ajax/libs/KaTeX/0.16.4/katex.css" rel="stylesheet">'
    ));
    $("head").append($(
        '<script src="https://intumu.com/static/js/marked.min.js"></script>'
    ));
    $("head").append($(
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_HTML"></script>'
    ));
 
    try {
        //禁用console 未转义警告
        hljs.configure({
            ignoreUnescapedHTML: true
        })
        const menu_updateChat_id = GM_registerMenuCommand("更新Chat", function (event) {
            GM_openInTab("https://greasyfork.org/zh-CN/scripts/464405")
        }, "updateChat");
        const menu_groupNum_id = GM_registerMenuCommand("网页版", function (event) {
            alert("网页版：https://intumu.com/chatgpt")
        }, "groupNum");
 
        const menu_pubkey_id = GM_registerMenuCommand("更新key", function (event) {
            alert("正在更新...")
            setPubkey();
        }, "PUBKEY");
    } catch (e) {
        console.log(e)
    }
 
 
    //动态pubkey
    function setPubkey() {
        //default:
        let generateRandomIP = () => {
            const ip = [];
            for (let i = 0; i < 4; i++) {
                ip.push(Math.floor(Math.random() * 256));
            }
            console.log(ip.join('.'))
            return ip.join('.');
        }
 
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.aigcfun.com/fc/key",
            headers: {
                "Content-Type": "application/json",
                "Referer": `https://aigcfun.com/`,
                "X-Forwarded-For": generateRandomIP()
            },
            onload: function (response) {
                let resp = response.responseText;
                let pubkey = JSON.parse(resp).data;
                if (!pubkey) {
                    document.getElementById("gptAnswer").innerText = "获取pubkey失败"
                    return
                }
                console.log("pubkey:" + pubkey);
                //GM_setValue("pubkey", pubkey)
                localStorage.setItem("pubkey", pubkey)
                document.getElementById("gptAnswer").innerText = "pubkey更新成功:" + pubkey
                document.getElementById("pubkey").innerText = "  专属码:" + pubkey
            }
        });
    }
 
    function getPubkey() {
        //return GM_getValue("pubkey");
        return localStorage.getItem("pubkey");
    }
 
 
    //setPubkey()
    //console.log("GET KEY:" + getPubkey())
 
 
    //enc-start
    async function digestMessage(r) {
        const hash = CryptoJS.SHA256(r);
        return hash.toString(CryptoJS.enc.Hex);
    }
 
    const generateSignature = async r => {
        const {
            t: e,
            m: t
        } = r;
        //const n = {}.PUBLIC_SECRET_KEY;
        let n = getPubkey();
        if (!n) {
            console.log("pubkey不存在，使用默认")
            n = "k6zeE77ge7XF"
        }
        console.log("CURRENT KEY:" + n)
        const a = `${e}:${t}:${n}`;
        return await digestMessage(a);
    };
 
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
    //enc-end
    
        //start
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
            GM_xmlhttpRequest(details)
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
        GM_xmlhttpRequest(details);
    }
 
    //封装GM_xmlhttpRequest ---end---
 
    function addChatBtn() {
 
        let mybtn =
            `<span class="bg s_btn_wr"><input type="button" id="mybtn" value="重载GPT" class="bg s_btn"></span>`;
        $(".bg.s_btn_wr").after(mybtn)
        document.getElementById("mybtn").addEventListener("click", function () {
            console.log("reloadPage")
            if (window.location.href.indexOf("https:\/\/www.baidu.com\/s") > -1) {
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
        var userAgentInfo = navigator.userAgent.toLowerCase();
        var mobileAgents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var mobile_flag = false;
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
 
    function katexTohtml(rawHtml) {
        console.log("========katexTohtml start=======")
        let renderedHtml = rawHtml.replace(/<em>/g, "").replace(/<\/em>/g, "").replace(/\$\$(.*?)\$\$/g, (_, tex) => {
            //debugger
            return katex.renderToString(tex, {displayMode: false, throwOnError: false});
        });
        renderedHtml = renderedHtml.replace(/\$(.*?)\$/g, (_, tex) => {
            //debugger
            return katex.renderToString(tex, {displayMode: false, throwOnError: false});
        });
        console.log("========katexTohtml end=======")
        return renderedHtml;
    }
 
    //显示答案并高亮代码函数
    function showAnserAndHighlightCodeStr(codeStr) {
        try {
            document.getElementById('gptAnswer').innerHTML = `${katexTohtml(mdConverter(codeStr.replace(/\\n+/g, "\n")))}`
        } catch (e) {
            document.getElementById('gptAnswer').innerHTML = `${mdConverter(codeStr.replace(/\\n+/g, "\n"))}`
        }
        for (let i = 0; i <= document.getElementsByTagName("code").length - 1; i++) {
            document.getElementsByTagName("code")[i].setAttribute("class",
                "hljs");
            hljs.highlightAll()
        }
    }
 
    //高亮代码函数
    function highlightCodeStr() {
        for (let i = 0; i <= document.getElementsByTagName("code").length - 1; i++) {
            document.getElementsByTagName("code")[i].setAttribute("class",
                "hljs");
            hljs.highlightAll()
        }
    }
 
    //顶级配置
    var webSessionId
    var convoId
    var your_qus
    var abortXml
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
    if (window.location.href.indexOf("www.google.com") > -1 || window.location.href.match(regx)) {
        GM_add_box_style(1)
        addBothStyle()
        keyEvent()
        appendBox(1).then((res) => {
            pivElemAddEventAndValue(1)
        })
    }
    if (window.location.href.indexOf("https:\/\/www.baidu.com\/s") > -1 && !isMobile()) {
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
            pivElemAddEventAndValue(4)
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
 
    //顶级函数
    function uuid() { //uuid 产生
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
 
        return s.join("");
    }
 
    function GM_add_box_style(case_web) {
        switch (case_web) {
            case 0: //bing
                GM_addStyle(`
    #gptAnswer{
   margin: 15px;
   border-top: solid;
    border-bottom: solid;
    }
    #gptInput{
    width:74%;
    border-radius: 4px;
    }
    #gptInputBox{
        display: flex;
    justify-content: space-around;
    }
 
    #button_GPT:hover{
    background:#ffffffcc;
    }
    #gptDiv{
     border-radius: 8px;
    padding: 10px;
    margin-bottom: 9px;
    width:452px;
    translate:-20px;
    background:#ffffffcc;
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    }
    #button_GPT{
    }
    #button_GPT{
    background: transparent;
    border-radius: 4px;
 
    }
    #gptCueBox{
        translate: 3px;
    }
 
	 p{white-space: pre-line}
 
 
    `)
                break;
            case 1: //google
                GM_addStyle(`
    #gptAnswer{
   margin: 15px;
   border-top: solid;
    border-bottom: solid;
    }
    #gptInput{
    border-radius: 4px;
    width: 68%;
    }
    #button_GPT:hover{
    background:#dcdcdccc;
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
    }
    #button_GPT{
    background: transparent;
    border-radius: 3px;
     font-size: 14px;
    }
    #gptStatus{
        margin-left: 7px;
        }
 
 
 p{white-space: pre-line}
 
 
    `)
                break; //baidu
            case 2:
                GM_addStyle(`
    #gptAnswer{
   margin: 15px;
   border-top: solid;
    border-bottom: solid;
    }
    #gptInput{
    border-radius: 4px;
    width: 68%;
    }
    #button_GPT:hover{
    background:#4e6ef2;
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
    }
    #button_GPT{
    background: #4460d4;
    border-radius: 3px;
    font-size: 14px;
    }
    #gptStatus{
        margin-left: 7px;
        }
 
    p{white-space: pre-line}
 
    `)
                break;
            default:
                alert("参数没设定")
        }
 
    }
 
    var messageChain1 = [
        {
            role: "system",
            content: "请以markdown的形式返回答案"
        }
    ];
 
    function addMessageChain(messageChain, element) {
        if (messageChain.length >= 6) {
            messageChain.shift();
        }
        messageChain.push(element);
        console.log(messageChain)
    }
 
    function do_it(your_qus) {
        document.getElementById('gptAnswer').innerHTML = `<div>加载中<span id="dot"></span></div>`;
        console.log("defualt")
        const now = Date.now();
        console.log(now);
        generateSignature({
            t: now,
            m: your_qus || ""
        }).then(sign => {
            console.log(sign)
            addMessageChain(messageChain1, {role: "user", content: your_qus})//连续话
            abortXml = GM_xmlhttpRequest({
                method: "POST",
                url: "https://api.aigcfun.com/api/v1/text?key=" + getPubkey(),
                //url: "https://chatforai.cc/api/generate",
                headers: {
                    "Content-Type": "application/json",
                    "Referer": `https://aigcfun.com/`
                },
                data: JSON.stringify({
                    messages: messageChain1,
                    tokensLength: your_qus.length + 10,
                    model: "gpt-3.5-turbo"
 
                }),
                //	data: JSON.stringify({
                //	prompt: "Human:"+your_qus+"\nAI:",
                //		tokensLength: your_qus.length
                //	}),
 
                onload: function (res) {
                    if (res.status === 200) {
                        console.log('成功....')
                        console.log(res.response)
                        let rest = JSON.parse(res.response).choices[0].text
                        console.log(rest)
 
                        try {
                            showAnserAndHighlightCodeStr(rest);
                            addMessageChain(messageChain1, {
                                role: "assistant",
                                content: rest
                            })
                        } catch (e) {
                            //TODO handle the exception
                            document.getElementById('gptAnswer').innerHTML = `${rest}`
                        }
 
                        highlightCodeStr()
                    } else {
                        console.log('失败')
                        console.log(res)
                        document.getElementById('gptAnswer').innerHTML = '访问失败了'
                    }
                },
 
                responseType: "application/json;charset=UTF-8",
 
                onprogress: function (msg) {
                    //console.log(msg) //Todo
                },
                onerror: function (err) {
                    document.getElementById('gptAnswer').innerHTML =
                        `<div>some err happends,errinfo :<br>${err.messages}</div>`
                },
                ontimeout: function (err) {
                    document.getElementById('gptAnswer').innerHTML =
                        `<div>Opps!TimeOut,Please try again,errinfo:<br>${err.messages}</div>`
                }
            });
        });
 
    }
 
 
    function LEMURCHAT(your_qus) {
 
        let baseURL = "http://lemurchat.anfans.cn/";
 
        GM_fetch({
            method: "POST",
            url: baseURL + "api/chat/conversation-trial",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Linux; Android 9; Redmi 4 Prime) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Mobile Safari/537.36"
            },
            data: `{"messages":"[{\\"content\\":\\"\\",\\"id\\":\\"LEMUR_AI_SYSTEM_SETTING\\",\\"isSensitive\\":false,\\"needCheck\\":false,\\"role\\":\\"system\\"},{\\"content\\":\\"${your_qus}\\",\\"isSensitive\\":false,\\"needCheck\\":true,\\"role\\":\\"user\\"}]"}`,
            //data: `{"messages":"[{\\"content\\":\\"\\",\\"id\\":\\"LEMUR_AI_SYSTEM_SETTING\\",\\"isSensitive\\":false,\\"needCheck\\":false,\\"role\\":\\"system\\"},{\\"content\\":\\"你好\\",\\"isSensitive\\":false,\\"needCheck\\":true,\\"role\\":\\"user\\"}]"}`,
            responseType: "stream"
        }).then((stream)=>{
            const reader = stream.response.getReader();
            let result = [];
            reader.read().then(function processText({done, value}) {
                if (done) {
                    highlightCodeStr()
                    return;
                }
                try {
                    let d = new TextDecoder("utf8").decode(new Uint8Array(value));
                    console.log("raw:",d)
                    let dd = d.replace(/data: /g, "").split("\n\n")
                    console.log("dd:",dd)
                    dd.forEach(item=>{
                        try {
                            let delta = /content\\":\\"(.*?)\\"/gi.exec(item)[1]
                            result.push(delta.replace(/\\\\n/g,"\n"))
                            showAnserAndHighlightCodeStr(result.join(""))
                        }catch (e) {
 
                        }
                    })
 
                } catch (e) {
                    console.log(e)
                }
 
                return reader.read().then(processText);
            });
        },function (err) {
            console.log(err)
        }).catch((ex)=>{
            console.log(ex)
        });
 
    }
    
 
    function creatBox() {
        return new Promise((resolve) => {
            var divE = document.createElement('div');
            var divId = document.createAttribute("id"); //创建属性
            divId.value = 'gptDiv'; //设置属性值
            divE.setAttributeNode(divId); //给div添加属性
            var pE = document.createElement('p');
            var pClass = document.createAttribute('class');
            pClass.value = 'textClass';
            pE.setAttributeNode(pClass)
            var pText = document.createTextNode("chatGPT tools Plus 已启动");
            pE.appendChild(pText);
            divE.appendChild(pE);
            divE.innerHTML = `
                <div id="gptInputBox">
                <input id="gptInput" type=text></div>
                <div id="gptInputBox">
                <button class="s_btn" id="button_GPT" style='margin-top:30px' > 问一问 </button>
                </div>
                <div id=gptCueBox>
                <p id="gptStatus">&nbsp&nbsp
                <select id="modeSelect" style='display: none;'>
                <option value="Default">默认线路</option>
                </select> 
                <p style="color: green;"  >&nbsp;&nbsp;网页版界面更美观→→→<a style="color: red;" href="https://intumu.com/chatgpt"  target="_blank"> GPT网页版 </a>←←←</p>
                <article id="gptAnswer" class="markdown-body"><div id="gptAnswer_inner">已启动连续对话模式~<div></article>
 
                </div>`
            resolve(divE);
 
 
        })
    }
 
    async function pivElemAddEventAndValue(append_case) {
        var search_content
 
        try {
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
 
        document.getElementById("gptInput").value = search_content
        document.getElementById('button_GPT').addEventListener('click', () => {
            your_qus = document.getElementById("gptInput").value
            // do_it(your_qus)
            LEMURCHAT(your_qus)
 
        })
        document.getElementById('updatePubkey').addEventListener('click', () => {
            document.getElementById("gptAnswer").innerText = "正在更新，请稍后..."
            setPubkey()
        })
 
        document.getElementById('modeSelect').addEventListener('change', () => {
            const selectEl = document.getElementById('modeSelect');
            const selectedValue = selectEl.options[selectEl.selectedIndex].value;
            localStorage.setItem('GPTMODE', selectedValue);
 
            if (selectedValue === 'COOLAI') {
                initSocket();
            }
            document.getElementById('gptAnswer').innerHTML = `切换成功，当前模式:${selectedValue}模式`;
        });
 
 
    }
 
    async function appendBox(append_case) {
        return new Promise((resolve, reject) => {
            creatBox().then((divE) => {
                switch (append_case) {
                    case 0: //bing
                        if (divE) {
                            document.getElementById('b_context').prepend(divE)
                        }
                        break;
                    case 1: //google
                        if (document.getElementsByClassName('TQc1id ')[0]) {
                            document.getElementsByClassName('TQc1id ')[0].prepend(divE);
                        } else {
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
                        if (document.getElementById('side')) {
                            document.getElementById('side').prepend(divE)
                        }
                        break;
                    case 5: //fsoufsou
                        let frow = document.querySelectorAll(".flex-row")[2]
                        if (frow.children.length == 2) {
                            frow.children.item(1).prepend(divE)
                        } else {
                            frow.innerHTML = frow.innerHTML +
                                `<div><div class="wiki-container" style="margin-left: 124px;">${divE.innerHTML}</div></div>`
                        }
 
                        break;
                    case 6: //手机百度
                        if (document.getElementById('page-bd')) {
                            document.getElementById('page-bd').prepend(divE)
                            //调整css
                            try {
                                document.querySelector("#gptDiv").style.setProperty("width",
                                    "100%")
                                document.querySelector("#gptInput").setAttribute("class",
                                    "se-input adjust-input")
                                    document.querySelector("#con-ar").setAttribute("style",'display: none;')
                            } catch (e) {
                                //TODO handle the exception
                            }
                            setTimeout(() => {
                                document.getElementById("button_GPT").click(); //自动点击
                            }, 1500)
                        }
                        break;
                    case 7: //duckduckgo
                        if (document.querySelector('.results--sidebar div')) {
                            document.querySelector('.results--sidebar div').prepend(divE)
                        }
                        break;
                    default:
                        if (divE) {
                            console.log(`啥情况${divE}`)
                        }
                }
            }).catch((err) => {
                throw new Error(err)
            })
 
            resolve("finished")
        })
    }
 
    //焦点函数
    function isBlur() {
        var myInput = document.getElementById('gptInput');
        if (myInput == document.activeElement) {
            return 1
        } else {
            return 0
        }
    }
 
    function keyEvent() {
        document.onkeydown = function (e) {
            var keyNum = window.event ? e.keyCode : e.which;
            if (13 == keyNum) {
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
 }
    `)
    }
 
 
    function log(a) {
        console.log(a)
    }
 
    function Uint8ArrayToString(fileData) {
        var dataString = "";
        for (var i = 0; i < fileData.length; i++) {
            dataString += String.fromCharCode(fileData[i]);
        }
 
        return dataString
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
 
    function mdConverter(rawData) {
        var converter = new showdown.Converter(); //增加拓展table
        converter.setOption('tables',
            true); //启用表格选项。从showdown 1.2.0版开始，表支持已作为可选功能移入核心拓展，showdown.table.min.js扩展已被弃用
        return converter.makeHtml(rawData);
    }
 
    //实时监控百度,360按钮消失
    setInterval(() => {
        //百度
        if (window.location.href.indexOf("https:\/\/www.baidu.com\/s") > -1 && !isMobile()) {
            if (!document.getElementById("gptDiv") && document.getElementById("mybtn")) {
                document.getElementById("mybtn").click()
            }
 
            if (!document.getElementById("gptDiv") && !document.getElementById("mybtn")) {
                addChatBtn();
                document.getElementById("mybtn").click()
            }
            document.querySelector("#con-ar").setAttribute("style",'display: none;')
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
 
    }, 2000)
 
 
    function generateRandomString(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
 
 
 
})();