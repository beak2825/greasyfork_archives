// ==UserScript==
// @name         推特翻译机
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  该脚本用于翻译推特为中文，不会经过中间服务器。
// @author       HolynnChen
// @match        https://*.quora.com//*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.bootcss.com/crypto-js/3.1.9-1/core.min.js
// @require      https://cdn.bootcss.com/crypto-js/3.1.9-1/md5.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@2.5.2/base64.min.js
// @downloadURL https://update.greasyfork.org/scripts/405374/%E6%8E%A8%E7%89%B9%E7%BF%BB%E8%AF%91%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/405374/%E6%8E%A8%E7%89%B9%E7%BF%BB%E8%AF%91%E6%9C%BA.meta.js
// ==/UserScript==
const transdict={'谷歌翻译':translate_gg,'爱词霸翻译':translate_icib,'必应翻译':translate_biying,'有道翻译':translate_youdao,'腾讯翻译':translate_tencent,'彩云小译':translate_caiyun,'沪江翻译':translate_hj,'DeepL翻译':translate_deepl,'关闭翻译':e=>{e.className+=" js_translate"}};
const startup={'谷歌翻译':translate_gg_startup,'有道翻译':translate_youdao_startup,'腾讯翻译':translate_tencent_startup,'彩云小译':translate_caiyun_startup};
const baseoptions = {
    'enable_pass_lang': {
        declare: '不翻译中文推特',
        default_value: false,
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
        default_value: true,
    }
};

const [enable_pass_lang,remove_url,show_info]=Object.keys(baseoptions).map(key=>GM_getValue(key,baseoptions[key].default_value));
const reactEventKey=()=>Object.keys(document.querySelector('#react-root>div')).find(item=>item.match('^__reactEventHandlers'));

(function() {
    'use strict';
    let choice=GM_getValue('translate_choice','谷歌翻译');
    let main=_=>{
        //for twitter React
        let key=reactEventKey();
        if(!key)return;
        let temp=Array.prototype.map.call(document.querySelectorAll('article div[dir="auto"]:not([data-translate])'),item=>{item.dataset.translate="prepare";return item.parentNode;})
        .map(item=>{
            const obj=item[key].children;
            if(Array.isArray(obj)){
                let index=obj.filter(inner=>inner).findIndex(inner=>inner&&inner.props&&inner.props.lang);
                if (index>-1)return item.children[index];
            }
            if(Object.prototype.toString.call(obj)==='[object Object]' && obj.props && obj.props.lang){
                return item.firstElementChild
            }
            return null;
        }).filter(item=>item);
        for(let i=0;i<temp.length;i++){
            if(temp[i].dataset.translate=="processed")continue;
            temp[i].dataset.translate="processed";
            if(baseText(temp[i]).length==0)continue;
            if(sessionStorage.getItem(choice+'-'+baseText(temp[i]))){
                ce_text(temp[i],choice,sessionStorage.getItem(choice+'-'+baseText(temp[i])));
            }else{
                pass_lang(temp[i]).then(e=>transdict[choice](e));
            }
        }
    };
    (new Promise(startup[choice] ||((a,b)=>a()))).then(_=>setInterval(main,20))
    let select=document.createElement("select");
    select.className='js_translate';
    select.style='height:35px;width:100px;background-color:#fff;border-radius:17.5px;text-align-last:center;color:#000000;margin:5px 0';
    select.onchange=_=>{
        choice=select.value;
        GM_setValue('translate_choice',choice);
        title.innerText="控制面板（请刷新以应用）"
    };
    for(let i in transdict)select.innerHTML+='<option value="'+i+'">'+i+'</option>';
    let mask=document.createElement('div'),dialog=document.createElement("div"),js_dialog=document.createElement("div"),title=document.createElement('p');
    //
    window.top.document.body.appendChild(mask);
    dialog.appendChild(js_dialog);
    mask.appendChild(dialog);
    js_dialog.appendChild(title)
    js_dialog.appendChild(document.createElement('p').appendChild(select));
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
    let open=document.createElement('div');
    open.style=`z-index:9999;height:35px;width:100px;background-color:#fff;position:fixed;border-radius:17.5px;right:${GM_getValue('position_right','9px')};top:${GM_getValue('position_top','9px')};text-align-last:center;color:#000000;display:flex;align-items:center;justify-content:center;cursor: pointer;font-size:15px;user-select:none`;
    open.innerHTML="推特翻译机";
    open.onclick=()=>{mask.style.display='flex'};
    open.draggable=true;
    open.ondragstart=function(ev){this.tempNode=document.createElement('div');this.tempNode.style="width:1px;height:1px;opacity:0";document.body.appendChild(this.tempNode);ev.dataTransfer.setDragImage(this.tempNode,0,0);this.oldX=ev.offsetX-Number(this.style.width.replace('px',''));this.oldY=ev.offsetY};
    open.ondrag=function(ev){if(!ev.x&&!ev.y)return;this.style.right=(window.innerWidth-ev.x+this.oldX)+"px";this.style.top=(ev.y-this.oldY)+"px"};
    open.ondragend=function(ev){GM_setValue("position_right",this.style.right);GM_setValue("position_top",this.style.top);document.body.removeChild(this.tempNode)}
    open.onclick=()=>{mask.style.display='flex'};
    window.top.document.body.appendChild(open);
    window.top.document.querySelector('.js_translate option[value='+choice+']').selected=true;
})();
function baseText(element){
    let content="";
    if(element.localName=='p')content=element.innerText;
    else content=Array.prototype.map.call(Array.prototype.filter.call(element.querySelectorAll('span'),node=>node.parentElement===element),e=>e.innerText).join('');
    if(remove_url)content=content.replace(/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g,'');
    return content;
}
function tk(a){
    var b=sessionStorage.getItem('google_tkk');
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
function ce_text(e,name,text){//change element text
    if(text.length==0)text='翻译异常'
    e.innerHTML+=`\n\n${show_info?"-----------"+name+"-----------":""}\n\n`+text;
}
function translate_gg(e,error){
    let myname='谷歌翻译'
    GM_xmlhttpRequest({
        method:"GET",
        url:'https://translate.google.com/translate_a/single?client=webapp&sl=auto&tl=zh-CN&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&source=btn&ssel=0&tsel=0&kc=0&tk='+tk(baseText(e))+'&q='+encodeURIComponent(baseText(e)),
        onload:(data)=>{
            let s=''
            try{
                data=JSON.parse(data.responseText);
                s=data[0].map(x=>x[0]||'').join('')
                sessionStorage.setItem(myname+'-'+baseText(e),s)
            }catch(err){
                console.log(data.responseText)
                if(error){ce_text(e,myname,'翻译出错');return}
                setTimeout(_=>translate_gg(e,true),3000)
                return
            }
            ce_text(e,myname,s)
    }})
}
function translate_gg_startup(reslove,reject){
    if(!sessionStorage.getItem('google_tkk')){
        GM_xmlhttpRequest({
            method:'GET',
            url:'https://translate.google.com',
            onload:function(res){
                sessionStorage.setItem('google_tkk',res.responseText.match(/tkk:'.*?(?=')/g)[0].slice(5))
                reslove()
            }
        });
    }else{
        reslove()
    }
}

function translate_hj(e,error){
    let myname='沪江翻译'
    GM_xmlhttpRequest({
        method:"POST",
        url:'https://dict.hjenglish.com/v10/dict/translation/jp/cn',
        data:'content='+encodeURIComponent(baseText(e).replace('twitter','推特')),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Cookie':'HJ_UID=0;'
        },
        onload:(data)=>{
            let s=''
            try{
                data=JSON.parse(data.responseText);
                s=data.data.content;
                sessionStorage.setItem(myname+'-'+baseText(e),s)
            }catch(err){
                console.log(data.responseText)
                console.log(baseText(e))
                if(error){ce_text(e,myname,'翻译出错');return}
                setTimeout(_=>translate_hj(e,true),3000)
                return
            }
            ce_text(e,myname,s)
    }})
}
function translate_icib(e,error){
    let myname='爱词霸翻译'
    e.className+=" js_translate";
    GM_xmlhttpRequest({
        method:"POST",
        url:'http://fy.iciba.com/ajax.php?a=fy',
        data:'f=auto&t=auto&w='+encodeURIComponent(baseText(e)),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        onload:(data)=>{
            let s=''
            try{
                data=JSON.parse(data.responseText);
                s=data.content.out;
                sessionStorage.setItem(myname+'-'+baseText(e),s)
            }catch(err){
                console.log(data.responseText)
                console.log(baseText(e))
                if(error){ce_text(e,myname,'翻译出错');return}
                setTimeout(_=>translate_icib(e,true),3000)
                return
            }
            ce_text(e,myname,s)
    }})
}
function translate_biying(e,error){
    let myname='必应翻译'
    GM_xmlhttpRequest({
        method:"POST",
        url:'https://cn.bing.com/ttranslatev3',
        data:'fromLang=auto-detect&to=zh-Hans&text='+encodeURIComponent(baseText(e)),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        onload:(data)=>{
            let s=''
            try{
                data=JSON.parse(data.responseText);
                s=data[0].translations[0].text;
                sessionStorage.setItem(myname+'-'+baseText(e),s)
            }catch(err){
                console.log(data.responseText)
                console.log(baseText(e))
                if(error){ce_text(e,myname,'翻译出错');return}
                setTimeout(_=>translate_biying(e,true),3000)
                return
            }
            ce_text(e,myname,s)
    }})
}
function youdao_data(text){
    let ts=""+(new Date).getTime(),salt=ts+parseInt(10 * Math.random(), 10);
    let result=`i=${encodeURIComponent(text)}&from=AUTO&to=AUTO&smartresult=dict&client=fanyideskweb&salt=${salt}&sign=${CryptoJS.MD5("fanyideskweb"+text+salt+sessionStorage.getItem('youdao_key'))}&ts=${ts}&doctype=json&version=2.1&keyfrom=fanyi.web&action=FY_BY_REALTlME&typoResult=false`
    return result
}
function translate_youdao(e,error){
    let myname='有道翻译'
    GM_xmlhttpRequest({
        method:"POST",
        url:'http://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule',
        data:youdao_data(baseText(e)),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Referer": "http://fanyi.youdao.com/",
            "User-Agent": "test",
        },
        onload:(data)=>{
            let s=''
            try{
                data=JSON.parse(data.responseText);
                s=data.translateResult.map(e=>e.map(t=>t.tgt).join('')).join('\n');
                sessionStorage.setItem(myname+'-'+baseText(e),s)
            }catch(err){
                console.log(data,data.responseText)
                if(error){ce_text(e,myname,'翻译出错');return}
                setTimeout(_=>translate_youdao(e,true),3000)
                return
            }
            ce_text(e,myname,s)
    }})
}
function translate_youdao_startup(reslove,reject){
    if(!sessionStorage.getItem('youdao_key')){
        GM_xmlhttpRequest({
            method:'GET',
            url:'http://fanyi.youdao.com',
            onload:function(res){
                GM_xmlhttpRequest({
                    method:'GET',
                    url:res.responseText.match(/http.*?fanyi.min.js/g)[0],
                    onload:function(res){
                        sessionStorage.setItem('youdao_key',res.responseText.match(/fanyideskweb.{6}".*?(?=")/g)[0].slice(19));
                        reslove()
                    }
                })
            }
        });
    }else{
        reslove()
    }
}
function translate_tencent(e,error){
    let myname='腾讯翻译'
    let qtk=sessionStorage.getItem('tencent_qtk'),qtv=sessionStorage.getItem('tencent_qtv');
    if(qtk && qtv){
        GM_xmlhttpRequest({
            method:'POST',
            url:'https://fanyi.qq.com/api/translate',
            data:`source=auto&target=zh&sourceText=${encodeURIComponent(baseText(e))}&qtv=${encodeURIComponent(qtv)}&qtk=${encodeURIComponent(qtk)}&sessionUuid=translate_uuid${(new Date).getTime()}`,
            headers: {
                "Origin":"https://fanyi.qq.com",
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://fanyi.qq.com/"
            },
            onload:(data)=>{
                let s=''
                try{
                    data=JSON.parse(data.responseText);
                    s=data.translate.records.map(e=>e.targetText).join('');
                    sessionStorage.setItem(myname+'-'+baseText(e),s)
                }catch(err){
                    console.log(baseText(e));
                    if(error){ce_text(e,myname,'翻译出错');return}
                    setTimeout(_=>translate_tencent(e,true),3000)
                    return
                }
                ce_text(e,myname,s)},
            onerror:(err)=>{
                if(error){ce_text(e,myname,'翻译出错');return}
                setTimeout(_=>translate_tencent(e,true),3000)
            }
        });
    }else{
        console.log('无法获取qtk与qtv')
    }
}
function translate_tencent_startup(reslove,reject){
    if(!sessionStorage.getItem('tencent_qtk') || !!sessionStorage.getItem('tencent_qtv')){
        GM_xmlhttpRequest({
            method:'GET',
            url:'https://fanyi.qq.com',
            onload:function(res){
                sessionStorage.setItem('tencent_qtv',res.responseText.match(/qtv=.*?(?=")/g)[0].slice(4))
                sessionStorage.setItem('tencent_qtk',res.responseText.match(/qtk=.*?(?=")/g)[0].slice(4))
                reslove()
            }
        });
    }else{
        reslove()
    }
}
function pass_lang(e){
    return new Promise((reslove,reject)=>{
        if(!enable_pass_lang){
            reslove(e);
            return
        }
        GM_xmlhttpRequest({
            method:"POST",
            url:'https://fanyi.baidu.com/langdetect',
            data:`query=${encodeURIComponent(baseText(e).replace(/[\uD800-\uDBFF]$/, "").slice(0,50))}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            onload:(data)=>{
                try{
                    data=JSON.parse(data.responseText);
                    if(data.lan!='zh')reslove(e);
                }catch(err){
                    reject(err);
                }
        }})
    })
}

function translate_deepl(e,error){
    let myname='DeepL翻译'
    GM_xmlhttpRequest({
        method:"POST",
        url:'https://www2.deepl.com/jsonrpc',
        data:JSON.stringify({
            "jsonrpc":"2.0",
            "method":"LMT_handle_jobs",
            "params":{
                "jobs":[{
                    "kind":"default",
                    "raw_en_sentence":baseText(e)
                }],
                "lang":{"target_lang":"ZH"},
                "timestamp":Date.now()
            }
        }),
        headers: {
            "Content-Type": "application/json",
        },
        onload:(data)=>{
            let s=''
            try{
                data=JSON.parse(data.responseText);
                s=data.result.translations[0].beams[0].postprocessed_sentence;
                sessionStorage.setItem(myname+'-'+baseText(e),s)
            }catch(err){
                console.log(err);
                console.log(data.responseText);
                console.log(data);
                if(error){ce_text(e,myname,'翻译出错');return}
                setTimeout(_=>translate_deepl(e,true),3000)
                return
            }
            ce_text(e,myname,s)
    }})
}

function translate_caiyun_decode(t) {
    let e=(i)=>"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(i);
    return Base64.decode(t.split("").map((j)=>e(j) > -1 ? "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm"[e(j)] : j).join(""));
}
function translate_caiyun_startup(reslove,reject){
    if(!sessionStorage.getItem('caiyun_id') || !!sessionStorage.getItem('caiyun_jwt')){
        let browser_id=CryptoJS.MD5(Math.random().toString()).toString();
        sessionStorage.setItem('caiyun_id',browser_id);
        GM_xmlhttpRequest({
            method:"POST",
            url:'https://api.interpreter.caiyunai.com/v1/user/jwt/generate',
            headers:{
                "Content-Type": "application/json",
                "X-Authorization": "token:qgemv4jr1y38jyq6vhvi",
            },
            data:JSON.stringify({
                "browser_id":browser_id
            }),
            onload:(data)=>{
                try{
                    data=JSON.parse(data.responseText);
                    sessionStorage.setItem('caiyun_jwt',data.jwt);
                    reslove();
                }catch(err){
                    reject(err);
                }
            }
        })
    }else{
        reslove()
    }
}

function translate_caiyun(e,error){
    let myname='彩云小译'
    GM_xmlhttpRequest({
        method:"POST",
        url:'https://api.interpreter.caiyunai.com/v1/translator',
        data:JSON.stringify({
            "source":baseText(e).split('\n'),
            "jsonrpc":"2.0",
            "trans_type": "auto2zh",
            "request_id": "web_fanyi",
            "media": "text",
            "os_type": "web",
            "dict": true,
            "cached": true,
            "replaced": true,
            "detect": true,
            "browser_id": sessionStorage.getItem('caiyun_id')
        }),
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": "token:qgemv4jr1y38jyq6vhvi",
            "T-Authorization": sessionStorage.getItem('caiyun_jwt')
        },
        onload:(data)=>{
            let s=''
            try{
                data=JSON.parse(data.responseText);
                console.log(data,baseText(e).split('\n'));
                s=data.target.map(i=>translate_caiyun_decode(i)).join('\n');
                sessionStorage.setItem(myname+'-'+baseText(e),s)
            }catch(err){
                console.log(err);
                console.log(data.responseText);
                console.log(data);
                if(error){ce_text(e,myname,'翻译出错');return}
                setTimeout(_=>translate_deepl(e,true),3000)
                return
            }
            ce_text(e,myname,s)
    }})
}