// ==UserScript==
// @name         chatGPT tools Plus ++（免费版）注意！（由于 OpenAI 的限制，暂时无法提供服务）请移步cookie版本！
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  chatGPT free version（免费版）,Google、必应、百度侧边栏Chat搜索，即刻体验AI，无需翻墙，无需注册，无需等待！
// @author       Onion
// @match        https://cn.bing.com/*
// @match        https://www.bing.com/*
// @match      https://chat.openai.com/chat
// @match      https://www.google.com/*
// @match      https://www.google.com.hk/*
// @include    /^https:\/\/www\.baidu\.com\/s\?wd.*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @require    https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @require    https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require    https://cdn.jsdelivr.net/npm/marked@4.2.3/marked.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.1/markdown-it.min.js
// @require    https://unpkg.com/axios/dist/axios.min.js
// @connect   ip-api.com
// @connect   chat.openai.com
// @connect   gpt.chatapi.art
// @license    MIT
// @resource css https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown.css
// @resource css https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css
// @require    https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js


// @downloadURL https://update.greasyfork.org/scripts/456270/chatGPT%20tools%20Plus%20%2B%2B%EF%BC%88%E5%85%8D%E8%B4%B9%E7%89%88%EF%BC%89%E6%B3%A8%E6%84%8F%EF%BC%81%EF%BC%88%E7%94%B1%E4%BA%8E%20OpenAI%20%E7%9A%84%E9%99%90%E5%88%B6%EF%BC%8C%E6%9A%82%E6%97%B6%E6%97%A0%E6%B3%95%E6%8F%90%E4%BE%9B%E6%9C%8D%E5%8A%A1%EF%BC%89%E8%AF%B7%E7%A7%BB%E6%AD%A5cookie%E7%89%88%E6%9C%AC%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/456270/chatGPT%20tools%20Plus%20%2B%2B%EF%BC%88%E5%85%8D%E8%B4%B9%E7%89%88%EF%BC%89%E6%B3%A8%E6%84%8F%EF%BC%81%EF%BC%88%E7%94%B1%E4%BA%8E%20OpenAI%20%E7%9A%84%E9%99%90%E5%88%B6%EF%BC%8C%E6%9A%82%E6%97%B6%E6%97%A0%E6%B3%95%E6%8F%90%E4%BE%9B%E6%9C%8D%E5%8A%A1%EF%BC%89%E8%AF%B7%E7%A7%BB%E6%AD%A5cookie%E7%89%88%E6%9C%AC%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // @require    https://cdnjs.cloudflare.com/ajax/libs/highlightjs-line-numbers.js/2.8.0/highlightjs-line-numbers.min.js

    //重要声明：感谢隔壁作者：zhengbangbo (https://github.com/zhengbangbo/chat-gpt-userscript)的请求处理方式，之前一直不知道怎么处理SSE响应，原来直接就可以用一般的方式来接收，那么对返回数据处理切割就直接借鉴啦！（反正MIT不是嘛）
    //cookie 大家自己想办法弄到，别霍霍我了呜呜
    //对返回结果增加了markdown解析成html

    //请在上面添加一句：油猴因为策略问题没法增加这个js
    //多亏了zhengbangbo大佬，现在已经解决这个策略问题了！
    // @require    https://cdn.jsdelivr.net/npm/marked/marked.min.js



    //顶级配置
    //可以手动配置your_cookie!
    const requestUrl = `https://gpt.chatapi.art/backend-api/conversation`
    var your_qus
    var abortXml
    if (window.location.href.indexOf("bing.com") > -1) {
        getYourCookie()
        GM_add_box_style(0)
        addBothStyle()
        keyEvent()
        appendBox(0).then((res)=>{pivElemAddEventAndValue(0)})
        linkToBing_beautification_script()
    }
    if (window.location.href.indexOf("www.google.com") > -1) {
        GM_add_box_style(1)
        addBothStyle()
        keyEvent()
        appendBox(1).then((res)=>{pivElemAddEventAndValue(1)})
    }
    if (window.location.href.indexOf("https://www.baidu.com/s?wd") > -1) {
        GM_add_box_style(2)
        addBothStyle()
        keyEvent()
        appendBox(2).then((res)=>{pivElemAddEventAndValue(2)})
    }
    if (window.location.href.indexOf("chat.openai.com") > -1) {
        //$.cookie('yourCookie','dumplings', {domain:'qq.com',path:'/'});
        console.log("httpOnly保护，没法拿到cookie，自己复制粘贴控制台")
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

        var uuid = s.join("");
        return uuid;
    }
    function GM_add_box_style(case_web){
        switch (case_web){
            case 0://bing
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





    `)
                break;//baidu
            case 2:GM_addStyle(`
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



    `)
                break;
            default :
                alert("参数没设定")
        }

    }
    function do_it(){
            let finalResult
            let normalArray
            let nowResult
            document.getElementById('gptAnswer').innerHTML=`<div>加载中<span id="dot"></span></div>`

    abortXml=GM_xmlhttpRequest({
        method: "POST",
        url: "https://chat.openai.com/backend-api/conversation",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer `,
        },
        data: JSON.stringify({//抓包conversation就可以看到这个结构
            action: "next",
            messages: [
                {
                    id: uuid(),
                    role: "user",
                    content: {
                        content_type: "text",
                        parts: [your_qus],
                    },
                },
            ],
            model: "text-davinci-002-render",
            parent_message_id: uuid(),
        }),
        //    onprogress: function(msg){console.log(msg)},
        //     onreadystatechange:function(msg){log(msg)},
        onloadstart:(stream)=>{ //肝了好久，终于找到油猴接受SSE的接受方法了
            let result = "";
            const reader = stream.response.getReader();
            let charsReceived = 0;
            reader.read().then(function processText({ done, value }) {
                if (done) {
                    if(finalResult==0){
                        document.getElementById('gptAnswer').innerHTML=`<div>Temporarily unavailable due to OpenAI limitations.（由于 OpenAI 的限制，暂时无法提供服务）请移步<a href="https://greasyfork.org/zh-CN/scripts/456131-chatgpt-tools-plus-cookie%E7%89%88">chatGPT tools plus ++(cookie版)</a></div>`
                    }
                    else{
                        document.getElementById('gptAnswer').innerHTML=`${mdConverter(decodeUnicode(finalResult.replace(/\\n+/g,"\n")))}`
                       // document.querySelector("code").setAttribute("class", "language-javascript hljs");
                        for(let i=0;i<=document.getElementsByTagName("code").length-1;i++){
                        document.getElementsByTagName("code")[i].setAttribute("class", "language-javascript hljs");
                        hljs.highlightAll()//奇怪，为什么不行
                        }
                    }
                    return;
                }

                charsReceived += value.length;
                const chunk = value;
                result += chunk;
                //    log(JSON.stringify(chunk).replace(/\{/,"").replace(/\}/,""))
                normalArray=Array.from(chunk)
                //   String.fromCharCode.apply(null, normalArray)
                nowResult=String.fromCharCode.apply(null, normalArray).match(/(?<=\[).*(?=\])/g)[0]
           //     console.log(mdConverter(decodeUnicode(nowResult.replace(/\\n+/g,"<换行>"))))
                if(nowResult!=="DONE"){
                    finalResult=nowResult
                }

                //                console.log(finalResult)
                document.getElementById('gptAnswer').innerHTML=`${mdConverter(decodeUnicode(finalResult.replace(/\\n+/g,"\n")))}`
                return reader.read().then(processText);
            });
        },
        responseType:"stream",
        /*  onloadend: function (data) {
            var answer
            if (data.response) {
                var data_transform=data.response.split("\n\n")
                if(data_transform){
                    try{
                        data_transform=JSON.parse(data_transform.slice(-3,-2)[0].slice(6))
                        answer=data_transform.message.content.parts[0]
                        document.getElementById('gptAnswer').innerHTML=marked.parse(answer)
                        //    if(!getCookieObject().preQuesAns){
                        //           window.document.cookie=`preQuesAns=""`
                        //        }
                        // let preQuesAns = getCookieObject().preQuesAns+answer
                        //  window.document.cookie=`preQuesAns=${your_qus}${preQuesAns}`
                        // sendModerations()
                    }catch(err){
                        console.log(`err:${err}`)
                    }
                }
                //     const answer = JSON.parse(data.response.split("\n\n").slice(-3, -2)[0].slice(6)).message.content.parts[0]
            }
        },*/
        onprogress:function(msg){
            //console.log(msg) //Todo
        },
        onerror: function (err) {
            document.getElementById('gptAnswer').innerHTML=`<div>some err happends,errinfo :<br>${err}</div>`
            },
        ontimeout: function (err) {
            document.getElementById('gptAnswer').innerHTML=`<div>Opps!TimeOut,Please try again,errinfo:<br>${err}</div>`
            }
    })
    }
    function creatBox(){
        return new Promise((resolve)=>{
            var divE = document.createElement('div');
            var divId = document.createAttribute("id"); //创建属性
            divId.value = 'gptDiv'; //设置属性值
            divE.setAttributeNode(divId); //给div添加属性
            var pE = document.createElement('p');
            var pClass= document.createAttribute('class');
            pClass.value = 'textClass';
            pE.setAttributeNode(pClass)
            var pText = document.createTextNode("chatGPT tools Plus ++ v0.0.1已启动");
            pE.appendChild(pText);
            divE.appendChild(pE);
            divE.innerHTML=`
    <div id="gptInputBox">
    <input id="gptInput" type=text><button id="button_GPT" >chat一下</button>
    </div>
    <div id=gptCueBox>
    <p id="gptStatus">&nbsp openAI 已就绪，请输入你的问题</p>
   <article id="gptAnswer" class="markdown-body"><div id="gptAnswer_inner">注意！（由于 OpenAI 的限制，暂时无法提供服务）请移步cookie版本！<div></article>
    </div><p></p>`
        resolve(divE)
        })
    }
    async function pivElemAddEventAndValue(append_case){
        var search_content

        if(append_case===2){
            search_content=document.getElementById('kw').value
        }
        if(append_case===1){
            search_content=document.querySelector("#tsf > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input:nth-child(3)").value
        }
        if(append_case===0){
            search_content=document.getElementsByClassName('b_searchbox')[0].value
        }
        document.getElementById("gptInput").value=search_content
        document.getElementById('button_GPT').addEventListener('click',()=>{
            your_qus=document.getElementById("gptInput").value
            do_it()

        })


    }
    async function appendBox(append_case){
        return new Promise((resolve,reject)=>{
            creatBox().then((divE)=>{
                switch (append_case){
                    case 0: //bing
                        if(divE){
                            document.getElementById('b_context').prepend(divE)
                        }
                        break;
                    case 1://google
                        if(document.getElementsByClassName('TQc1id ')[0]){
                            document.getElementsByClassName('TQc1id ')[0].prepend(divE);
                        }
                        else{
                            document.getElementById("rcnt").appendChild(divE);
                        }
                        break;
                    case 2:
                        if(document.getElementById('content_right')){
                            document.getElementById('content_right').prepend(divE)
                        }
                        break;
                    default :
                        if(divE){
                            console.log(`啥情况${divE}`)
                        }
                }}).catch((err)=>{
                throw new Error(err)
            })

            resolve("finished")
        })
    }
    //焦点函数
    function isBlur(){
        var myInput = document.getElementById('gptInput');
        if (myInput == document.activeElement) {
            return 1
        } else {
            return 0
        }
    }
    function keyEvent(){
        document.onkeydown = function (e) {
            var keyNum = window.event ? e.keyCode : e.which;
            if (13 == keyNum) {
                if (isBlur()) {
                    document.getElementById('button_GPT').click()
                }
                else{
                    console.log("失焦不执行")
                }

            }}

    }
    function checkIp(){
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://ip-api.com/json/",
            onloadend: function (data) {
                if(data){
                    try{
                        data=JSON.parse(data.response)
                    }catch(err){
                        console.log(err)
                    }
                    console.log(data.country)
                    if(data.country=="Hong Kong"){
                        document.getElementById('gptStatus').innerHTML=`&nbsp openAI 已就绪，请输入你的问题`
                 }
                }
                else{
                    document.getElementById('gptStatus').innerHTML=`&nbsp openAI 没有就绪，请更换你的IP为非大陆节点`
                  throw new Error('Error while executing the code');
                }
            },
            onerror: function (err) {
                document.getElementById('gptStatus').innerHTML=`&nbsp openAI 没有就绪，请更换你的IP为非大陆节点`
                throw new Error('Error while executing the code');
            },
            ontimeout: function (err) {
                document.getElementById('gptStatus').innerHTML=`&nbsp openAI 没有就绪，请更换你的IP为非大陆节点`
                throw new Error('Error while executing the code');
            }
        })
    }
    function addBothStyle(){
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
    function getYourCookie(){
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://chat.openai.com/api/auth/session",
            onloadend: function (data) {
                if(data){
                    data=JSON.parse(data.response)
                    console.log(data.accessToken)
                    //     window.document.cookie=`your_cookie=${data.accessToken};expire:1000*60*60*24`
                    setCookie("your_cookie",data.accessToken,1)
                }
            },
            onerror: function (err) {
                throw new Error('Error while executing the code');

            },
            ontimeout: function (err) {
                throw new Error('Error while executing the code');
            }
        })


    }
    function setCookie(cname,cvalue,exdays)
    {
        var d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    //原生cookie函数
    function getCookieObject() {
        let cookieString = document.cookie;
        cookieString = cookieString.substring(0, cookieString.length - 1);
        let tempCookieArray = cookieString.split('; ');

        let cookieObject = {}; // 存放 cookie 键值对

        tempCookieArray.forEach(item => {
            let name = item.substring(0, item.indexOf('='));
            let value = item.substring(item.indexOf('=') + 1);
            value = decodeURIComponent(value); // 还原字符串
            cookieObject[name] = value; // 将键值插入中这个对象中
        });

        return cookieObject // 返回包含 cookie 键值对的对象
    }
    function sendModerations(){
        GM_xmlhttpRequest({
            method: "POST",
            url: requestUrl,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${your_cookie}`,
            },
            data:JSON.stringify({
                input:getCookieObject().preQuesAns,
                model:"text-moderation-playground"
            }),
            onloadend: function (data) {
                console.log(data)
            },
            onerror: function (err) {
                throw new Error('Error while executing the code');

            },
            ontimeout: function (err) {
                throw new Error('Error while executing the code');
            }
        })


    }
    function autoClick(){
        document.getElementById('button_GPT').click()
    }
    function linkToBing_beautification_script(){

        if(getCookieObject.blurDeg && getCookieObject.aDeg1 && getCookieObject.aDeg2){
            document.getElementById('gptDiv').style.background=`#ffffff${getCookieObject.aDeg2}`
        document.getElementById('gptDiv').style.backdropFilter=`${getCookieObject.blurDeg}`
    }
    }
    function creatBox_and_addEventlis(append_case){
        var divE = document.createElement('div');
        var divId = document.createAttribute("id"); //创建属性
        divId.value = 'gptDiv'; //设置属性值
        divE.setAttributeNode(divId); //给div添加属性
        var pE = document.createElement('p');
        var pClass= document.createAttribute('class');
        pClass.value = 'textClass';
        pE.setAttributeNode(pClass)
        var pText = document.createTextNode("chatGPT tools Plus ++ v0.1.3已启动");
        pE.appendChild(pText);
        divE.appendChild(pE);
        switch (append_case){
            case 0:
                if(divE){
                    document.getElementById('b_context').prepend(divE)
                }
                break;
            case 1:
                if(document.getElementsByClassName('TQc1id ')[0]){
                    document.getElementsByClassName('TQc1id ')[0].prepend(divE);
                }
                else{
                    document.getElementById("rcnt").appendChild(divE);
                }
                break;
            case 2:
                if(document.getElementById('content_right')){
                    document.getElementById('content_right').prepend(divE)
                }
                break;
            default :
                if(divE){
                    document.getElementById('b_context').prepend(divE)
                }
        }
        document.getElementById('gptDiv').innerHTML=`<div id="gptInputBox"><input id="gptInput"type=text><button id="button_GPT">chat一下</button></div><div id=gptCueBox><p id="gptStatus">&nbsp openAI已就绪，请输入你的问题</p><div id="gptAnswer">chatGPT tools Plus++免费版v0.1.3已启动</div></div><p></p>`
        var search_content
        if(append_case===2){
            search_content=document.getElementById('kw').value
        }
        if(append_case===1){
            search_content=document.querySelector("#tsf > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input:nth-child(3)").value
        }
        if(append_case===0){
            search_content=document.getElementsByClassName('b_searchbox')[0].value
        }
        document.getElementById("gptInput").value=search_content
        document.getElementById('button_GPT').addEventListener('click',()=>{
            your_qus=document.getElementById("gptInput").value
            do_it()

        })
    }
    function log(a){
        console.log(a)
    }

    function Uint8ArrayToString(fileData){
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
        var converter = new showdown.Converter();  //增加拓展table
        converter.setOption('tables', true);  //启用表格选项。从showdown 1.2.0版开始，表支持已作为可选功能移入核心拓展，showdown.table.min.js扩展已被弃用
        var view = converter.makeHtml(rawData);
        return view;
    }



})();