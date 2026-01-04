// ==UserScript==
// @name         tweetranslator
// @description  translate tweets by google....
// @match        https://twitter.com/*
// @match        *://*.twitter.com/*
// @match        *://*.youtube.com/*
// @match        *://*.facebook.com/*
// @match        *://*.reddit.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @version 0.0.1.20220711215151
// @namespace https://greasyfork.org/users/395405
// @downloadURL https://update.greasyfork.org/scripts/447616/tweetranslator.user.js
// @updateURL https://update.greasyfork.org/scripts/447616/tweetranslator.meta.js
// ==/UserScript==


const startup={};
const baseoptions = {
    'enableIgnoreTranslationInMandarin': {
        declare: '不翻译中文',
        default_value: true,
        change_func: self => {
            if (self.checked) sessionStorage.clear()
        }
    },
    'remove_url': {
        declare: '自动过滤url',
        default_value: true,
    },
};

const [enableIgnoreTranslationInMandarin,remove_url]=Object.keys(baseoptions).map(key=>GM_getValue(key,baseoptions[key].default_value));

const globalProcessingSave=[];



const rules={
    'tweetdeck':{
        name:'tweetdeck',
        matcher:/https:\/\/tweetdeck.twitter.com/,
        selector:baseSelector('.js-quoted-tweet-text,.js-tweet-text'),
        textGetter:baseTextGetter,
        textSetter:baseTextSetter
    },
    'twitter':{
        name:'推特通用',
        matcher:/https:\/\/[a-zA-Z.]*?twitter\.com/,
        selector:baseSelector('article div[dir="auto"][lang]'),
        textGetter:baseTextGetter,
        textSetter:baseTextSetter
    },
    'youtube':{
        name:'youtube pc通用',
        matcher:/https:\/\/www.youtube.com\/watch\?v=*/,
        selector:()=>{
            const result=[...document.querySelectorAll('#content>#content-text,#content>#description>.content')].filter(item=>item.childNodes.length==item.__data.text.runs.length);
            return result;
        },
        textGetter:element=>remove_url?url_filter(element.innerText):element.innerText,
        textSetter:(element,name,text)=>{
            element.updateText_([...element.__data.text.runs,{text:`\n🀄️`+text}]);
            element.parentNode.parentNode.removeAttribute('collapsed');
        }
    },
    'youtube_m':{
        name:'youtube mobile通用',
        matcher:/https:\/\/m.youtube.com\/watch\?v=*/,
        selector:baseSelector(".comment-text.user-text,.slim-video-metadata-description"),
        textGetter:baseTextGetter,
        textSetter:baseTextSetter
    },
    'facebook':{
        name:'facebook通用',
        matcher:/https:\/\/www.facebook.com\/.+/,
        selector: baseSelector('div[data-ad-comet-preview=message],li>div>div[role=article] div>span[dir=auto]'),
        textGetter:element=>{
            const key = Object.keys(document.querySelector('div>div')||{}).find(item=>item.match('^__reactProps'));
            let content = element.tagName==="DIV"?element.innerText:element[key].children.props.textWithEntities.text;
            if(element.tagName==="SPAN"){
                const more = element.querySelector('div>div[role=button]');
                if(more)more.click();
            }
            if(remove_url)content=url_filter(content);
            return content;
        },
        textSetter:(e,name,text)=>setTimeout(baseTextSetter,0,e,name,text)
    },
    'reddit':{
        name:'reddit通用',
        matcher:/https:\/\/www.reddit.com\/.*/,
        selector:baseSelector('a[data-click-id=body],.RichTextJSON-root'),
        textGetter:baseTextGetter,
        textSetter:baseTextSetter
    },
};


(function() {
    'use strict';
    const GetActiveRule = ()=>rules[Object.keys(rules).filter(item=>GM_getValue("enable_rule:"+item,true)).find(item=>rules[item].matcher.test(document.location.href))];
    let url=document.location.href;
    let rule=GetActiveRule();
    setInterval(()=>{
        if(document.location.href!=url){
            url=document.location.href;
            const ruleNew=GetActiveRule();
            if(ruleNew!=rule){
                if(ruleNew!=null){
                    console.log(`【翻译机】检测到URl变更，改为使用【${ruleNew.name}】规则`)
                }else{
                    console.log("【翻译机】当前无匹配规则")
                }
                rule=ruleNew;
            }
        }
    },200)
    let main=_=>{
        if(!rule)return;
        const choice=GM_getValue('translate_choice','谷歌翻译');
        const temp=[...new Set(rule.selector())];
        for(let i=0;i<temp.length;i++){
            const now=temp[i];
            if(globalProcessingSave.includes(now))continue;
            globalProcessingSave.push(now);
            const text=rule.textGetter(now);
            if(text.length==0)continue;
            if(sessionStorage.getItem(choice+'-'+text)){
                rule.textSetter(now,choice,sessionStorage.getItem(choice+'-'+text));
                removeItem(globalProcessingSave,now)
            }else{
                ignoreTranslationInMandarin(text).then(lang=>GOOG_transl(text,lang)).then(s=>{
                    rule.textSetter(now,choice,s);
                    removeItem(globalProcessingSave,now);
                })
            }
        }
    };
    PromiseRetryWrap(startup[GM_getValue('translate_choice','谷歌翻译')]).then(()=>{document.js_translater=setInterval(main,20)});
})();

//--综合工具区--start

function removeItem(arr,item){
    const index=arr.indexOf(item);
    if(index>-1)arr.splice(index,1);
}

function baseSelector(selector){
    return ()=>Array.from(document.querySelectorAll(selector.split(',').map(item=>item+':not([data-translate])').join(',')),item=>{item.dataset.translate="processed";return item;})
}

function baseTextGetter(e){
    return remove_url?url_filter(e.innerText):e.innerText;
}

function baseTextSetter(e,name,text){//change element text
    if(text.length==0)text='⚠⚠翻译失败⚠⚠';
    e.innerHTML+=`<span style="white-space:pre-wrap">\n🀄️`+text+'</span>';
}

function url_filter(text){
    return text.replace(/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g,'');
}

async function ignoreTranslationInMandarin(raw){//确认是否为中文，是则中断promise
    if(!enableIgnoreTranslationInMandarin)return;
    try{
        const result = await check_lang(raw)
        if(result=='zh')return new Promise(()=>{});
        return result
    }catch(err){
        console.log(err);
        return
    }
    return
}

async function check_lang(raw){
    const options = {
        method:"POST",
        url:'https://fanyi.baidu.com/langdetect',
        data:'query='+encodeURIComponent(raw.replace(/[\uD800-\uDBFF]$/, "").slice(0,50)),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }
    const res = await Request(options);
    try{
        return JSON.parse(res.responseText).lan
    }catch(err){
        console.log(err);
        return
    }
}

//--综合工具区--end

//--谷歌翻译--start
async function GOOG_transl(raw){
    const options = {
        method:"POST",
        url:"https://translate.google.cn/_/TranslateWebserverUi/data/batchexecute",
        data: "f.req="+encodeURIComponent(JSON.stringify([[["MkEWBc",JSON.stringify([[raw,"auto","zh-CN",true],[null]]),null,"generic"]]])),
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "Host": "translate.google.cn",
        },
        anonymous:true,
        nocache:true,
    }
    return await BaseTranslate('谷歌翻译',raw,options,res=>JSON.parse(JSON.parse(res.slice(res.indexOf('[')))[0][2])[1][0][0][5].map(item=>item[0]).join(''))
}

//--谷歌翻译--end

//--异步请求包装工具--start

async function PromiseRetryWrap(task,options,...values){
    const {RetryTimes,ErrProcesser} = options||{};
    let retryTimes = RetryTimes||5;
    const usedErrProcesser = ErrProcesser || (err =>{throw err});
    if(!task)return;
    while(true){
        try{
            return await task(...values);
        }catch(err){
            if(!--retryTimes){
                console.log(err);
                return usedErrProcesser(err);
            }
        }
    }
}

async function BaseTranslate(name,raw,options,processer){
    const toDo = async ()=>{
        var tmp;
        try{
            const data = await Request(options);
            tmp = data.responseText;
            const result = await processer(tmp);
            sessionStorage.setItem(name+'-'+raw,result)
            return result
        }catch(err){
            throw {
                responseText: tmp,
                err: err
            }
        }
    }
    return await PromiseRetryWrap(toDo,{RetryTimes:3,ErrProcesser:()=>"翻译出错"})
}

function Request(options){
    return new Promise((reslove,reject)=>GM_xmlhttpRequest({...options,onload:reslove,onerror:reject}))
}

//--异步请求包装工具--end