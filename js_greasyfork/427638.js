// ==UserScript==
// @name         Chat Translator
// @namespace    chat-translator
// @version      1.0.0
// @description  Chat翻译
// @author       manx98
// @license      MIT; https://opensource.org/licenses/MIT
// @require      https://cdn.bootcss.com/qs/6.7.0/qs.min.js
// @require      https://cdn.bootcss.com/blueimp-md5/2.12.0/js/md5.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @match        https://www.twitch.tv/*
// @match        https://play.afreecatv.com/*
// @icon         data:image/png;base64,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
// @run-at       document-start
// @grant GM_xmlhttpRequest
// @grant GM_download
// @downloadURL https://update.greasyfork.org/scripts/427638/Chat%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/427638/Chat%20Translator.meta.js
// ==/UserScript==
$(function (){

    //百度翻译API
    let BAIDU_TRANSLATE_API={
        appid:"",//百度翻译API appid
        key:"",//百度翻译API Key
        to:"zh",//目的语言
        from:"auto",//目标语言
        sign:function (q,salt){
            return md5(this.appid+q+salt+this.key)
        },
        rand:function(){
            return Math.random().toString(36).slice(-6);
        },
        translate:function(q,callback){
            let st = Date.now();
            let data = {
                q,
                from:this.from,
                to:this.to,
                appid:this.appid,
                salt:st,
                sign:this.sign(q,st)
            }
            Requests.get("http://api.fanyi.baidu.com/api/trans/vip/translate?"+Qs.stringify(data)).then((result)=>{
                if(result.error_code!== undefined){
                    callback({
                        success:false,
                        result:result.error_msg
                    })
                }else{
                    callback({
                        success:true,
                        result:result.trans_result[0].dst
                    })
                }
            })
        }
    }

    //免费的Google Translate API,请求频率限制高(使用这个时不建议开启全局自动翻译)
    let GOOGLE_TRANSLATE_API={
        sl:'auto',//目的类型
        tl:'zh-CN',//目标语言
        translate:function(q,callback){
            let data = {
                client:"gtx",
                dt:"t",
                dj:1,
                ie:"UTF-8",
                sl:this.sl,
                tl:this.tl,
                q
            }
            Requests.get("http://translate.google.cn/translate_a/single?"+Qs.stringify(data)).then((res)=>{
                callback({
                    success:true,
                    result:res.sentences[0].trans
                })
            }).catch(()=>{
                callback({
                    success:false,
                    result:"请求失败！"
                })
            })
        }
    }

    //翻译设置
    const Config ={
        translateInterval: 1000, //翻译间隔(控制请求频率)
        api:GOOGLE_TRANSLATE_API, //使用的翻译API
        autoTranslate:false, //自动全局翻译,是否启用自动,容易触发接口频率限制
    }

    //用于存储不同页面翻译策略
    const TRANSLATE_MODEL={
        "www.twitch.tv":{
            getChatContainer(){
                return $('div[data-test-selector="chat-scrollable-area__message-container"]')
            },
            getChatMessageContainer(dom){
                return $(dom).find('span.text-fragment')
            }
        },
        "play.afreecatv.com":{
            getChatContainer(){
                return $('#chat_area')
            },
            getChatMessageContainer(dom){
                return $(dom).find('dd')
            }
        }
    }

    //简易的跨域请求封装
    const Requests = {
        request:function Requests(query){
            return new Promise((resolve, reject)=>{
                query.onload = function(res) {
                    if (res.status === 200) {
                        let text = res.responseText;
                        let json = JSON.parse(text);
                        resolve(json)
                    }else{
                        reject(res);
                    }
                }
                query.onerror = function(res){
                    reject(res)
                }
                GM_xmlhttpRequest(query);
            })
        },
        get:function(url){
            return this.request({
                method:"get",
                url:url
            })
        },
        post:function(url,data){
            return this.request({
                method:"post",
                url:url,
                data:data,
                headers:{ "Content-Type": "application/x-www-form-urlencoded" }
            })
        }
    }

    //获取Chat容器
    function getChatContainer(){
        return TRANSLATE_MODEL[window.location.host].getChatContainer();
    }

    //获取翻译内容
    function getChatMessage(content){
        let $chartsContainer = TRANSLATE_MODEL[window.location.host].getChatMessageContainer(content);
        if($chartsContainer.length>0)
        {
            if(Config.autoTranslate)
            {
                translateTasks.push($chartsContainer)
            }else{
                addTranslateButton($chartsContainer)
            }
        }
    }

    //华丽的分割
    const HR = `<div style="border-bottom: darkgray 1px solid"></div>`;

    //添加翻译按钮
    function addTranslateButton(target){
        let text = target.text();
        target.html(`${text}${HR}<button mark="my-button-mark" style="border: snow 1px solid;background-color: dodgerblue;width: 100%;color: white"><b>点击翻译</b></button>`)
        target.find('button[mark="my-button-mark"]').click(()=>{
            target.html(`${text}`);
            translate(target)
        })
    }

    //添加重试按钮
    function addRetryButton(target,text,message){
        target.html(`${text}${HR}<button mark="my-button-mark"><b style="border: snow 1px solid;background-color: wheat;width: 100%;color: red">${message}</b></button>"`)
        target.find('button[mark="my-button-mark"]').click(()=>{
            target.html(`${text}`);
            translate(target)
        })
    }

    //翻译指定对话框
    function translate(target){
        let text = target.text().trim();
        if(text.length === 0){
            return
        }
        target.html(`${text}${HR}<b style="color: dodgerblue">开始翻译</b>`)
        Config.api.translate(text,(result)=>{
            if(result.success){
                target.html(`${text}${HR}<b style="color: green">${result.result}</b>`)
            }else{
                addRetryButton(target,text,`翻译失败,点击重试：${result.result}`)
            }
            translateItem = undefined;
        })
    }

    //添加事件监听
    function addEventListener(dom){
        console.log(dom)
        dom.on('DOMNodeInserted',(e)=>{
            getChatMessage(e.target)
        })
    }

    //翻译任务队列
    const translateTasks = []
    //避免并发请求
    let translateItem = undefined;
    //初始化
    function init (dom){
        setInterval(()=>{
            if(translateTasks.length > 0 && !translateItem)
            {
                translateItem = translateTasks.shift()
                translate(translateItem)
            }
        },Config.autoTranslate)
        addEventListener(dom)
    }

    //循环检查对话框是否加载完毕
    function tryInit(){
        let t = setInterval(()=>{
            let $chats = getChatContainer();
            if($chats.length>0){
                init($chats)
                clearInterval(t)
            }
        },1000)
    }
    tryInit();
})