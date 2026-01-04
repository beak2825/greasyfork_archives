// ==UserScript==
// @name         twitter translator
// @version      0.1
// @description  twitter translator fork version
// @match        *://*.twitter.com/*
// @match        *://*.youtube.com/*
// @match        *://*.facebook.com/*
// @match        *://*.reddit.com/*
// @match        *://*.5ch.net/*
// @match        *://*.discord.com/*
// @match        *://*.telegram.org/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@2.5.2/base64.min.js
// @run-at       document-body
// @namespace https://greasyfork.org/users/395405
// @downloadURL https://update.greasyfork.org/scripts/436207/twitter%20translator.user.js
// @updateURL https://update.greasyfork.org/scripts/436207/twitter%20translator.meta.js
// ==/UserScript==

//保护可能被覆盖的方法
const tmpIFrame = document.createElement("iframe");
document.body.appendChild(tmpIFrame);
window.sessionStorage = tmpIFrame.contentWindow.sessionStorage;
const sessionStorage = window.sessionStorage; // 也就discord能干出这种事
document.body.removeChild(tmpIFrame);
//

const transdict={'谷歌翻译':translate_gg,'腾讯翻译':translate_tencent,'有道翻译':translate_youdao,'有道翻译mobile':translate_youdao_mobile,'百度翻译':translate_baidu,'彩云小译':translate_caiyun,'必应翻译':translate_biying,'Papago翻译':translate_papago,'爱词霸翻译':translate_icib,'关闭翻译':()=>{}};
const startup={'有道翻译':translate_youdao_startup,'腾讯翻译':translate_tencent_startup,'百度翻译':translate_baidu_startup,'彩云小译':translate_caiyun_startup,'Papago翻译':translate_papago_startup};
const baseoptions = {
    'enable_pass_lang': {
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
    'show_info': {
        declare: '显示翻译源',
        default_value: false,
    },
    'fullscrenn_hidden':{
        declare: '全屏时不显示',
        default_value: true,
    }
};

const [enable_pass_lang,remove_url,show_info,fullscrenn_hidden]=Object.keys(baseoptions).map(key=>GM_getValue(key,baseoptions[key].default_value));

const globalProcessingSave=[];

function initPanel(){
    let choice=GM_getValue('translate_choice','谷歌翻译');
    let select=document.createElement("select");
    select.className='js_translate';
    select.style='height:35px;width:100px;background-color:#fff;border-radius:17.5px;text-align-last:center;color:#000000;margin:5px 0';
    select.onchange=()=>{
        GM_setValue('translate_choice',select.value);
        title.innerText="控制面板（请刷新以应用）"
    };
    for(let i in transdict)select.innerHTML+='<option value="'+i+'">'+i+'</option>';
    //
    let enable_details = document.createElement('details');
    enable_details.innerHTML+="<summary>启用规则</summary>"
    for(let i in rules){
        let temp=document.createElement('input');
        temp.type='checkbox';
        temp.name=i;
        if(GM_getValue("enable_rule:"+temp.name,true))temp.setAttribute('checked',true)
        enable_details.appendChild(temp);
        enable_details.innerHTML+="<span>"+rules[i].name+"</span><br>";
    }
    let mask=document.createElement('div'),dialog=document.createElement("div"),js_dialog=document.createElement("div"),title=document.createElement('p');
    //
    window.top.document.body.appendChild(mask);
    dialog.appendChild(js_dialog);
    mask.appendChild(dialog);
    js_dialog.appendChild(title)
    js_dialog.appendChild(document.createElement('p').appendChild(select));
    js_dialog.appendChild(document.createElement('p').appendChild(enable_details));
    //
    mask.style="display: none;position: fixed;height: 100vh;width: 100vw;z-index: 99999;top: 0;left: 0;overflow: hidden;background-color: rgba(0,0,0,0.4);justify-content: center;align-items: center;"
    mask.addEventListener('click',event=>{if(event.target===mask)mask.style.display='none'});
    dialog.style='padding:0;border-radius:10px;background-color: #fff;box-shadow: 0 0 5px 4px rgba(0,0,0,0.3);';
    js_dialog.style="min-height:10vh;min-width:10vw;display:flex;flex-direction:column;align-items:center;padding:10px;border-radius:4px;color:#000";
    title.style='margin:5px 0;font-size:20px;';
    title.innerText="控制面板";
    for(let i in baseoptions){
        let temp=document.createElement('input'),temp_p=document.createElement('p');
        js_dialog.appendChild(temp_p);
        temp_p.appendChild(temp);
        temp.type='checkbox';
        temp.name=i;
        temp_p.style="display:flex;align-items: center;margin:5px 0"
        temp_p.innerHTML+=baseoptions[i].declare;
    }
    for(let i of js_dialog.querySelectorAll('input')){
        if(i.name&&baseoptions[i.name]){
            i.onclick=_=>{title.innerText="控制面板（请刷新以应用）";GM_setValue(i.name,i.checked);if(baseoptions[i.name].change_func)baseoptions[i.name].change_func(i)}
            i.checked=GM_getValue(i.name,baseoptions[i.name].default_value)
        }
    };
    for(let i of enable_details.querySelectorAll('input'))i.onclick=_=>{title.innerText="控制面板（请刷新以应用）";GM_setValue('enable_rule:'+i.name,i.checked)}
    let open=document.createElement('div');
    open.style=`z-index:9999;height:35px;width:35px;background-color:#fff;position:fixed;border:1px solid rgba(0,0,0,0.2);border-radius:17.5px;right:${GM_getValue('position_right','9px')};top:${GM_getValue('position_top','9px')};text-align-last:center;color:#000000;display:flex;align-items:center;justify-content:center;cursor: pointer;font-size:15px;user-select:none`;
    open.innerHTML="译";
    open.onclick=()=>{mask.style.display='flex'};
    open.draggable=true;
    open.addEventListener("dragstart",function(ev){this.tempNode=document.createElement('div');this.tempNode.style="width:1px;height:1px;opacity:0";document.body.appendChild(this.tempNode);ev.dataTransfer.setDragImage(this.tempNode,0,0);this.oldX=ev.offsetX-Number(this.style.width.replace('px',''));this.oldY=ev.offsetY});
    open.addEventListener("drag",function(ev){if(!ev.x&&!ev.y)return;this.style.right=(window.innerWidth-ev.x+this.oldX)+"px";this.style.top=(ev.y-this.oldY)+"px"});
    open.addEventListener("dragend",function(ev){GM_setValue("position_right",this.style.right);GM_setValue("position_top",this.style.top);document.body.removeChild(this.tempNode)});
    open.addEventListener("touchstart", ev=>{ev.preventDefault();ev=ev.touches[0];open._tempTouch={};const base=open.getClientRects()[0];open._tempTouch.oldX=base.x+base.width-ev.clientX;open._tempTouch.oldY=base.y-ev.clientY});
    open.addEventListener("touchmove",ev=>{ev=ev.touches[0];open.style.right=(window.innerWidth-open._tempTouch.oldX-ev.clientX)+'px';open.style.top=(ev.clientY+open._tempTouch.oldY)+'px';open._tempIsMove=true});
    open.addEventListener("touchend",()=>{GM_setValue("position_right",open.style.right);GM_setValue("position_top",open.style.top);if(!open._tempIsMove){mask.style.display='flex'};open._tempIsMove=false})
    window.top.document.body.appendChild(open);
    window.top.document.querySelector('.js_translate option[value='+choice+']').selected=true;
    if(fullscrenn_hidden)window.top.document.addEventListener('fullscreenchange',()=>{open.style.display=window.top.document.fullscreenElement?"none":"flex"});
}

const rules={
    'tweetdeck':[{
        name:'tweetdeck',
        matcher:/https:\/\/tweetdeck.twitter.com/,
        selector:baseSelector('.js-quoted-tweet-text,.js-tweet-text'),
        textGetter:baseTextGetter,
        textSetter:baseTextSetter
    }],
    'twitter':[{
        name:'推特通用',
        matcher:/https:\/\/[a-zA-Z.]*?twitter\.com/,
        selector:baseSelector('article div[dir="auto"][lang]'),
        textGetter:baseTextGetter,
        textSetter:baseTextSetter
    }],
    'youtube':[{
        name:'youtube pc通用',
        matcher:/https:\/\/www.youtube.com\/watch/,
        selector:()=>{
            const result=[...document.querySelectorAll('#content>#content-text,#content>#description>.content')].filter(item=>item.childNodes.length==item.__data.text.runs.length);
            return result;
        },
        textGetter:element=>remove_url?url_filter(element.innerText):element.innerText,
        textSetter:(element,name,text)=>{
            element.updateText_([...element.__data.text.runs,{text:`\n\n${show_info?"-----------"+name+"-----------":""}\n\n`+text}]);
            element.parentNode.parentNode.removeAttribute('collapsed');
        }
    }],
    'youtube_m':[{
        name:'youtube mobile通用',
        matcher:/https:\/\/m.youtube.com\/watch/,
        selector:baseSelector(".comment-text.user-text,.slim-video-metadata-description"),
        textGetter:baseTextGetter,
        textSetter:baseTextSetter
    }],
    'facebook':[{
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
            return content;
        },
        textSetter:(e,name,text)=>setTimeout(baseTextSetter,0,e,name,text)
    }],
    'reddit':[{
        name:'reddit通用',
        matcher:/https:\/\/www.reddit.com\/.*/,
        selector:baseSelector('a[data-click-id=body],.RichTextJSON-root'),
        textGetter:baseTextGetter,
        textSetter:baseTextSetter
    }],
    '5ch':[{
        name:'5ch评论',
        matcher:/http(|s):\/\/.*?.5ch.net\/.+/,
        selector:baseSelector('.post>.message'),
        textGetter:baseTextGetter,
        textSetter:baseTextSetter
    }],
    'discord':[{
        name:'discord聊天',
        matcher:/https:\/\/discord.com\/.+/,
        selector:baseSelector('div[class*=messageContent]'),
        textGetter:baseTextGetter,
        textSetter:baseTextSetter
    }],
    'telegram':[{
        name:'telegram聊天新',
        matcher:/https:\/\/.*?.telegram.org\/z\//,
        selector:baseSelector('p.text-content[dir=auto]'),
        textGetter:e=>Array.from(e.childNodes).filter(item=>!item.className).map(item=>item.nodeName==="BR"?"\n":item.textContent).join(''),
        textSetter:baseTextSetter
    },
    {
        name:'telegram聊天',
        matcher:/https:\/\/.*?.telegram.org\/.+/,
        selector:baseSelector('div.message[dir=auto]'),
        textGetter:e=>Array.from(e.childNodes).filter(item=>!item.className).map(item=>item.nodeValue||item.innerText).join(" "),
        textSetter:baseTextSetter
    }]
};


(function() {
    'use strict';
    const GetActiveRule = ()=>Object.entries(rules).filter(([key])=>GM_getValue("enable_rule:"+key,true)).map(([_,group])=>group).flat().find(item=>item.matcher.test(document.location.href));
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
    console.log(rule?`【翻译机】使用【${rule.name}】规则`:"【翻译机】当前无匹配规则");
    let main=_=>{
        if(!rule)return;
        const choice=GM_getValue('translate_choice','谷歌翻译');
        const temp=[...new Set(rule.selector())];
        for(let i=0;i<temp.length;i++){
            const now=temp[i];
            if(globalProcessingSave.includes(now))continue;
            globalProcessingSave.push(now);
            const text=remove_url?url_filter(rule.textGetter(now)):rule.textGetter(now);
            if(text.length==0)continue;
            if(sessionStorage.getItem(choice+'-'+text)){
                rule.textSetter(now,choice,sessionStorage.getItem(choice+'-'+text));
                removeItem(globalProcessingSave,now)
            }else{
                pass_lang(text).then(lang=>transdict[choice](text,lang)).then(s=>{
                    rule.textSetter(now,choice,s);
                    removeItem(globalProcessingSave,now);
                })
            }
        }
    };
    PromiseRetryWrap(startup[GM_getValue('translate_choice','谷歌翻译')]).then(()=>{document.js_translater=setInterval(main,20)});
    initPanel();
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
    return e.innerText;
}

function baseTextSetter(e,name,text){//change element text
    if((text||"").length==0)text='翻译异常';
    e.innerHTML+=`<span style="white-space:pre-wrap;color:red;font-weight:bold;background-color:#FFCACA">\n${show_info?"-----------"+name+"-----------":""}　　`+text+'　🀄</span>';
}

function url_filter(text){
    return text.replace(/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g,'');
}

async function pass_lang(raw){//确认是否为中文，是则中断promise
    if(!enable_pass_lang)return;
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


function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

//--综合工具区--end

//--谷歌翻译--start
async function translate_gg(raw){
    const options = {
        method:"POST",
        url:"https://translate.google.cn/_/TranslateWebserverUi/data/batchexecute",
        data: "f.req="+encodeURIComponent(JSON.stringify([[["MkEWBc",JSON.stringify([[raw,"auto","zh-TW",true],[null]]),null,"generic"]]])),
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

//--百度翻译--start
function tk(a,b){
    var d = b.split(".");
    b = Number(d[0]) || 0;
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var k = a.charCodeAt(g);
        128 > k ? e[f++] = k : (2048 > k ? e[f++] = k >> 6 | 192 : (55296 == (k & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (k = 65536 + ((k & 1023) << 10) + (a.charCodeAt(++g) & 1023),
        e[f++] = k >> 18 | 240,
        e[f++] = k >> 12 & 63 | 128) : e[f++] = k >> 12 | 224,
        e[f++] = k >> 6 & 63 | 128),
        e[f++] = k & 63 | 128)
    }
    a = b;
    for (f = 0; f < e.length; f++)a = Fo(a+e[f], "+-a^+6");
    a = Fo(a, "+-3^+b+-f");
    a ^= Number(d[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;
    return a.toString() + "." + (a ^ b)
}
function Fo(a, b) {
    for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2);
        d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
        d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
        a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d
    }
    return a
}

async function translate_baidu_startup(){
    if(sessionStorage.getItem('baidu_gtk')&&sessionStorage.getItem('baidu_token'))return;
    const options = {
        method:'GET',
        url:'https://fanyi.baidu.com',
    }
    const res = await Request(options);
    sessionStorage.setItem('baidu_gtk',/window\.gtk = '(.*?)'/.exec(res.responseText)[1]);
    sessionStorage.setItem('baidu_token',/token: '(.*?)'/.exec(res.responseText)[1])
}

async function translate_baidu(raw,lang){
    if(!lang){
        lang = await check_lang(raw)
    }
    const processed_raw = raw.length>30?(raw.substr(0,10)+raw.substr(~~(raw.length/2)-5,10)+raw.substr(-10)):raw;//process
    const tk_key = sessionStorage.getItem('baidu_gtk');
    const token = sessionStorage.getItem('baidu_token');//get token
    const options = {
        method:"POST",
        url:'https://fanyi.baidu.com/v2transapi',
        data:'from='+lang+'&to=zh&query='+encodeURIComponent(raw)+'&simple_means_flag=3&sign='+tk(processed_raw,tk_key)+"&token="+token+"&domain=common",
        headers: {
            "referer": 'https://fanyi.baidu.com',
            "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
        },
    }
    return await BaseTranslate('百度翻译',raw,options,res=>JSON.parse(res).trans_result.data.map(item=>item.dst).join('\n'))
}

//--百度翻译--end

//--爱词霸翻译--start

async function translate_icib(raw){
    const options = {
        method:"POST",
        url:'http://fy.iciba.com/ajax.php?a=fy',
        data:'f=auto&t=auto&w='+encodeURIComponent(raw),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }
    return await BaseTranslate('爱词霸翻译',raw,options,res=>JSON.parse(res).content.out)
}

//--爱词霸翻译--end


//--必应翻译--start

async function translate_biying(raw){
    const options = {
        method:"POST",
        url:'https://cn.bing.com/ttranslatev3',
        data:'fromLang=auto-detect&to=zh-Hans&text='+encodeURIComponent(raw),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }
    return await BaseTranslate('必应翻译',raw,options,res=>JSON.parse(res)[0].translations[0].text)
}

//--必应翻译--end

//--有道翻译--start

async function translate_youdao_startup(){
    if(sessionStorage.getItem('youdao_key'))return;
    const options = {
        method:'GET',
        url:'http://fanyi.youdao.com',
    }
    const res = await Request(options);
    options.url = res.responseText.match(/http.*?fanyi.min.js/g)[0];
    const js_res = await Request(options);
    sessionStorage.setItem('youdao_key',/"fanyideskweb"[+a-z]{5}"(.*?)"/.exec(js_res.responseText)[1]);
}

async function translate_youdao(raw){
    const ts=""+(new Date).getTime(),salt=ts+parseInt(10 * Math.random(), 10);
    const result=[
        'i='+encodeURIComponent(raw),
        'salt='+salt,
        'sign='+CryptoJS.MD5("fanyideskweb"+raw+salt+sessionStorage.getItem('youdao_key')),
        'ts='+ts,
        'doctype=json&version=2.1&keyfrom=fanyi.web&action=FY_BY_REALTlME&typoResult=false&from=AUTO&to=AUTO&smartresult=dict&client=fanyideskweb'
    ].join('&')
    const options = {
        method:"POST",
        url:'http://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule',
        data:result,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Referer": "http://fanyi.youdao.com/",
            "User-Agent": "test",
        },
    }
    return await BaseTranslate('有道翻译',raw,options,res=>JSON.parse(res).translateResult.map(e=>e.map(t=>t.tgt).join('')).join('\n'))
}

//--有道翻译--end

//--有道翻译m--start
async function translate_youdao_mobile(raw){
    const options = {
        method:"POST",
        url:'http://m.youdao.com/translate',
        data:"inputtext="+encodeURIComponent(raw)+"&type=AUTO",
        anonymous:true,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }
    return await BaseTranslate('有道翻译mobile',raw,options,res=>/id="translateResult">\s*?<li>([\s\S]*?)<\/li>\s*?<\/ul/.exec(res)[1])
}
//--有道翻译m--end

//--腾讯翻译--start

async function translate_tencent_startup(){
    setTimeout(translate_tencent_startup,10000)//token刷新
    const base_options = {
        method: 'GET',
        url: 'http://fanyi.qq.com',
        anonymous:true,
        headers: {
            "User-Agent": "test",
        }
    }
    const base_res = await Request(base_options)
    const uri = /reauthuri = "(.*?)"/.exec(base_res.responseText)[1]
    const options = {
        method:'POST',
        url:'https://fanyi.qq.com/api/'+uri
    }
    const res = await Request(options);
    const data = JSON.parse(res.responseText);
    sessionStorage.setItem('tencent_qtv',data.qtv)
    sessionStorage.setItem('tencent_qtk',data.qtk)
}


async function translate_tencent(raw){
    const qtk=sessionStorage.getItem('tencent_qtk'),qtv=sessionStorage.getItem('tencent_qtv');
    const options = {
        method:'POST',
        url:'https://fanyi.qq.com/api/translate',
        data:`source=auto&target=zh&sourceText=${encodeURIComponent(raw)}&qtv=${encodeURIComponent(qtv)}&qtk=${encodeURIComponent(qtk)}&sessionUuid=translate_uuid${Date.now()}`,
        headers: {
            "Host":"fanyi.qq.com",
            "Origin":"https://fanyi.qq.com",
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": "https://fanyi.qq.com/"
        }
    }
    return await BaseTranslate('腾讯翻译',raw,options,res=>JSON.parse(res).translate.records.map(e=>e.targetText).join(''))
}

//--腾讯翻译--end

//--彩云翻译--start

async function translate_caiyun_startup(){
    if(sessionStorage.getItem('caiyun_id') && sessionStorage.getItem('caiyun_jwt'))return;
    const browser_id=CryptoJS.MD5(Math.random().toString()).toString();
    sessionStorage.setItem('caiyun_id',browser_id);
    const options= {
        method:"POST",
        url:'https://api.interpreter.caiyunai.com/v1/user/jwt/generate',
        headers:{
            "Content-Type": "application/json",
            "X-Authorization": "token:qgemv4jr1y38jyq6vhvi",
        },
        data:JSON.stringify({browser_id}),
    }
    const res = await Request(options);
    sessionStorage.setItem('caiyun_jwt',JSON.parse(res.responseText).jwt);
}

async function translate_caiyun(raw){
    const source="NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm";
    const dic=[..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"].reduce((dic,current,index)=>{dic[current]=source[index];return dic},{});
    const decoder = line => Base64.decode([...line].map(i=>dic[i]||i).join(""))
    const options = {
        method:"POST",
        url:'https://api.interpreter.caiyunai.com/v1/translator',
        data:JSON.stringify({
            "source":raw.split('\n'),
            "trans_type": "auto2zh",
            "detect": true,
            "browser_id": sessionStorage.getItem('caiyun_id')
        }),
        headers: {
            "X-Authorization": "token:qgemv4jr1y38jyq6vhvi",
            "T-Authorization": sessionStorage.getItem('caiyun_jwt')
        }
    }
    return await BaseTranslate('彩云小译',raw,options,res=>JSON.parse(res).target.map(decoder).join('\n'))
}

//--彩云翻译--end

//--papago翻译--start

async function translate_papago_startup(){
    if(sessionStorage.getItem('papago_key'))return;
    const base_options = {
        method: 'GET',
        url: 'https://papago.naver.com/',
        anonymous:true,
    }
    const base_res = await Request(base_options)
    const uri = /"\/(vendors~home\..*?)"/.exec(base_res.responseText)[1]
    const options = {
        method:'GET',
        url:'https://papago.naver.com/'+uri
    }
    const res = await Request(options);
    const key = /AUTH_KEY:"(.*?)"/.exec(res.responseText)[1];
    sessionStorage.setItem('papago_key',key);
}

async function translate_papago(raw){
    const time= Date.now();
    const options = {
        method:'POST',
        url:'https://papago.naver.com/apis/n2mt/translate',
        data:`deviceId=${time}&source=auto&target=zh-CN&text=${encodeURIComponent(raw)}`,
        headers:{
            "authorization":'PPG '+time+':'+CryptoJS.HmacMD5(time+'\nhttps://papago.naver.com/apis/n2mt/translate\n'+time, sessionStorage.getItem('papago_key')).toString(CryptoJS.enc.Base64),
            "x-apigw-partnerid":"papago",
            "device-type":'pc',
            "timestamp":time,
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }
    return await BaseTranslate('Papago',raw,options,res=>JSON.parse(res).translatedText)
}

//--papago翻译--end

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