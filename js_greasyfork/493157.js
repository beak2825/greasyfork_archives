// ==UserScript==
// @name         telegram翻译
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  该脚本用于翻译各类常用社交网站为中文，不会经过中间服务器。
// @author       HolynnChen
// @match        *://*.telegram.org/a/*
// @connect      fanyi.baidu.com
// @connect      translate.google.com
// @connect      translate.googleapis.com
// @connect      ifanyi.iciba.com
// @connect      www.bing.com
// @connect      fanyi.youdao.com
// @connect      dict.youdao.com
// @connect      m.youdao.com
// @connect      api.interpreter.caiyunai.com
// @connect      papago.naver.com
// @connect      fanyi.qq.com
// @connect      translate.alibaba.com
// @connect      www2.deepl.com
// @connect      transmart.qq.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.7.4/base64.min.js
// @run-at       document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493157/telegram%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/493157/telegram%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

GM_registerMenuCommand('重置控制面板位置(刷新应用)',()=>{
    GM_setValue('position_top','9px');
    GM_setValue('position_right','9px');
})

const sessionStorage = window.sessionStorage;

const transdict={
    '谷歌翻译':translate_gg,
    //'谷歌翻译mobile':translate_ggm,
    //'腾讯翻译':translate_tencent,
   // '腾讯AI翻译': translate_tencentai,
    //'有道翻译':translate_youdao,
    //'有道翻译mobile':translate_youdao_mobile,
    //'百度翻译':translate_baidu,
    //'彩云小译':translate_caiyun,
    //'必应翻译':translate_biying,
    //'Papago翻译':translate_papago,
    //'阿里翻译':translate_alibaba,
    //'爱词霸翻译':translate_icib,
    //'Deepl翻译': translate_deepl,
    '关闭翻译':()=>{}
};
const startup={
    //'有道翻译':translate_youdao_startup,
    '腾讯翻译':translate_tencent_startup,
    '百度翻译':translate_baidu_startup,
    '彩云小译':translate_caiyun_startup,
    'Papago翻译':translate_papago_startup
};
const baseoptions = {
    'enable_pass_lang': {
        declare: '不翻译中文(简体)',
        default_value: true,
        change_func: self => {
            if (self.checked) sessionStorage.clear()
        }
    },
    'enable_pass_lang_cht': {
        declare: '不翻译中文(繁体)',
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
        default_value: true,
    },
    'fullscrenn_hidden':{
        declare: '全屏时不显示',
        default_value: true,
    }
};

var all_languages = [
        {id:'zh-CN', name:'中文简体'},
        //{id:'zh-TW', name:'Chinese Traditional'},
        //{id:'af', name:'Afrikaans'},
        //{id:'sq', name:'Albanian'},
        //{id:'ar', name:'Arabic'},
        //{id:'hy', name:'Armenian'},
        //{id:'az', name:'Azerbaijani'},
        //{id:'eu', name:'Basque'},
        //{id:'be', name:'Belarusian'},
        //{id:'bn', name:'Bengali'},
        //{id:'bs', name:'Bosnian'},
        //{id:'bg', name:'Bulgarian'},
        //{id:'ca', name:'Catalan'},
        //{id:'ceb', name:'Cebuano'},
        //{id:'ny', name:'Chichewa'},
        //{id:'co', name:'Corsican'},
        //{id:'hr', name:'Croatian'},
        //{id:'cs', name:'Czech'},
        //{id:'da', name:'Danish'},
        //{id:'nl', name:'Dutch'},
        {id:'en', name:'英语'},
        //{id:'eo', name:'Esperanto'},
        //{id:'et', name:'Estonian'},
        //{id:'tl', name:'Filipino'},
        //{id:'fi', name:'Finnish'},
        {id:'fr', name:'法语'},
        //{id:'fy', name:'Frisian'},
        //{id:'gl', name:'Galician'},
        //{id:'ka', name:'Georgian'},
        {id:'de', name:'德语'},
        //{id:'el', name:'Greek'},
        //{id:'gu', name:'Gujarati'},
        //{id:'ht', name:'Haitian Creole'},
        //{id:'ha', name:'Hausa'},
        //{id:'haw', name:'Hawaiian'},
        //{id:'iw', name:'Hebrew'},
        //{id:'hi', name:'Hindi'},
        //{id:'hmn', name:'Hmong'},
        //{id:'hu', name:'Hungarian'},
        //{id:'is', name:'Icelandic'},
        //{id:'ig', name:'Igbo'},
        //{id:'id', name:'Indonesian'},
        //{id:'ga', name:'Irish'},
        {id:'it', name:'意大利语'},
        {id:'ja', name:'日语'},
        //{id:'jw', name:'Javanese'},
        //{id:'kn', name:'Kannada'},
        //{id:'kk', name:'Kazakh'},
        //{id:'km', name:'Khmer'},
        {id:'ko', name:'韩语'},
        //{id:'ku', name:'Kurdish (Kurmanji)'},
        //{id:'ky', name:'Kyrgyz'},
        //{id:'lo', name:'Lao'},
        //{id:'la', name:'Latin'},
        //{id:'lv', name:'Latvian'},
        //{id:'lt', name:'Lithuanian'},
        //{id:'lb', name:'Luxembourgish'},
        //{id:'mk', name:'Macedonian'},
        //{id:'mg', name:'Malagasy'},
        //{id:'ms', name:'Malay'},
        //{id:'ml', name:'Malayalam'},
        //{id:'mt', name:'Maltese'},
        //{id:'mi', name:'Maori'},
        //{id:'mr', name:'Marathi'},
        //{id:'mn', name:'Mongolian'},
        //{id:'my', name:'Myanmar (Burmese)'},
        //{id:'ne', name:'Nepali'},
        //{id:'no', name:'Norwegian'},
        //{id:'ps', name:'Pashto'},
        //{id:'fa', name:'Persian'},
        //{id:'pl', name:'Polish'},
        {id:'pt', name:'葡萄牙语'},
        //{id:'ma', name:'Punjabi'},
        //{id:'ro', name:'Romanian'},
        {id:'ru', name:'俄语'},
        //{id:'sm', name:'Samoan'},
        //{id:'gd', name:'Scots Gaelic'},
        //{id:'sr', name:'Serbian'},
        //{id:'st', name:'Sesotho'},
        //{id:'sn', name:'Shona'},
        //{id:'sd', name:'Sindhi'},
        //{id:'si', name:'Sinhala'},
        //{id:'sk', name:'Slovak'},
        //{id:'sl', name:'Slovenian'},
        //{id:'so', name:'Somali'},
        {id:'es', name:'西班牙语'},
        //{id:'su', name:'Sudanese'},
        //{id:'sw', name:'Swahili'},
        //{id:'sv', name:'Swedish'},
        //{id:'tg', name:'Tajik'},
        //{id:'ta', name:'Tamil'},
        //{id:'te', name:'Telugu'},
        {id:'th', name:'泰语'},
        //{id:'tr', name:'Turkish'},
        //{id:'uk', name:'Ukrainian'},
        //{id:'ur', name:'Urdu'},
        //{id:'uz', name:'Uzbek'},
        //{id:'vi', name:'Vietnamese'},
        //{id:'cy', name:'Welsh'},
        //{id:'xh', name:'Xhosa'},
        //{id:'yi', name:'Yiddish'},
        //{id:'yo', name:'Yo
        //{id:'zu', name:'Zulu'}
    ];


var $ = $ || window.$,
        addListenerInterval = null,
        translateInterval = null,
        translateTimeout = null,
        translate_enabled = true,
        translate_ready = false,
        translate_string = '',
        custom_style = '.language_selected{background-color: #00bfa5;}',
        image_uri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFZklEQVR42sWXe0xTVxzHv5drWXkIKBQfE61Y2DIyR3Sy+FrqRgRF1IFD54IawU03dUE2I3ukxTgqPuYjK6KOZRndnFPYJoEpcUunokNxYnFT4wOQp9A/BshD4N6zc1sKvaWV0C7xhEt/59Hf93N+5/c7uWXwlBtjMV6JeBnz5r0KhmGG/BIhxKYPtLW1Qaf7Aa30c9gA4eFTof+9KJ5l2WzaDRhakIhs+sdT6/T5C5cSFi9JaB82wHsb1iFz5/ZmJ8UFy2Jv9JdN1DoLQGwnrcXWvbsJsYsWmB574n1jan/ZpHSXAU4VFA0CKCj4FaGhCjwXGiJI9s8LY6Ehij4gog4IlLsOkPzORptQiDvEajwmJhqLYqL6AWRjJrsGIDjiOF6kah2Jzs4upKRuwxtLYxE1/3WLcD9A4Nhg5wFsE+7q1Wuoq2tAZKQSUqnUdOaGihvQao8gdcsmKBTBgwDGjJviHMBOTbo40NRhebkBWYe+wpLFMViwYD4d47F7zwF0d3cjbVtq/zprgLHjFcMH2LAhGZmagRywympos47i5s1b2PpRCm78/Q9OnSrCh6mbIZdPtBUHzxP1+AkhrgHY1nl7ewcyd+9Da2sbOjs6sGLFMsydM8ueuCkCzwaFOg9g75Lp6elBru4YSkuvwF3ijqTk1XAPDEdF3TOgmn3AZoDG1hH6kkov/QCY7RGZPBtbKs9/c/v4inbucWsfwPpkUQ5YFldVV+Pb3GMwNhuR8GYcymhSGh7wePTCDirJ2LsJRZ+Dx/vtouritJjGUu1gAGFRVfUDFBf/RqugHMHBcqxKfAsyWQDdJY/ss904V69wRVx4+No/NGz9+Z1iAMuiO3fuQvfdcURHRSIiYroo20+W+yLvuo8r4ia77pyGsQJIgiYjnVg7fdwL3Gtm8fyYHtE5mgF8HYrHvsRhpBQouQPcb4ZDEAGg4UKmGWC9APB5Oken3Czi2wtHoqJ+BD6JbsX0oMf9DgRx4bEnPmEUQXZiL4RXCv0tQFPIOIwC3f0AwPLl8cjO2l9IJxZaxP+qkZhCL2EJPp7fgmlBXaZMF8TzDb52w540h8PicIILdPezFMDKwwxaOuxXBBUfAJBIJMjSfuH12jzlmtzLHgG/XJcq3T39lJaqkDId6u3R9Qj07oXOMFlZUumttBVn3QhykzhanoDuIoNDqwgO64GTVwaLC02IQGPJLth9/5oYd1w1clyY2lsmN/Vr9RlMnT7DZM/57KGKlfqqbRNubghBWgyPT/MZXL4PHHybwENCo5IDel+IxS0ReCIA6+6t9vSfBAHCGmBhRqPqEe+nts32jDgOE0YDiUcYcPSoFk4lSIli8IGOh6FGLG4G2MU8vOgAYErCCRXv5qkWbAHiRb8qhmm6aJpbtHKLqvi2p9o6w8f6EOSs5XGvCbh011xJnu7AshkMzlQQaAo4kbjw0N1TgN32AdIOnJHPnDmbniAm2Zvvpf5+vsbQMjU7XTObR0IEUFHTV8Z96wJ9gNFeQPxBDo+6xFeyANB0yQGAj18AdmQVyuWKsCdCHCsFGlpo8q2jZfUvkPK9OOGm0W/uXcli32kOP5Vxomqg4acAe+DwR8BQEMIR5JURzJhMoF4KaM8S5F8Vh9mNes/bzMLYRrD2aI8Ijoafaf7zCQAWCNX+fPm4oODVljEvb19lpZFRCuI9nKOrVpxw9ubp7ocGsNdSc2pVl2t91a6IC30q7hzAjK0177NSvy9dEafNSBNQZizdO3wARdzXXv5hy36kzqKFY3ZGnPDc+qoTS/I6G8qGD8C4SeAfFg/WY5TpzZ2Y/1l+qgzYZKAcbd+2O+pK0dVkMPsbLsD/3f4DRTYAbJ65vloAAAAASUVORK5CYII=',
        send_translation_image = 'data:image/png;base64,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',
        custom_html = '<div class="tranlate-bottom" style="width:80%">'
    +'<div style="margin-top:10px;margin-right:30px;margin-left:20px;"><input type="text" id="originalTextInput" placeholder="输入内容按回车后发送翻译内容" style="width:100%;border:0px;height:30px;border-radius:8px;padding:6px;"/></div>'
    + '<div style="margin:20px;min-height:20px" id="translatedMessage"></div>'
    + '</div>',
        html_language1 = '<div class="menu-item" style="display:table"><button title="Click for translation help!" class="trans_help_btn"><img alt="Translator" draggable="false" src="data:'+ image_uri +'" style="width:32px;height:32px;"/></button></div>',
        username = '',
        is_debug = true,
        lan_select = '',
        help_url = '',
        readyTranslation = '';
    var SOURCE_LANGUAGE = 'zh-CN',
        TRANSLATED_LANGUAGE = 'pt';
const [enable_pass_lang,enable_pass_lang_cht,remove_url,show_info,fullscrenn_hidden]=Object.keys(baseoptions).map(key=>GM_getValue(key,baseoptions[key].default_value));

const globalProcessingSave=[];

function initPanel(){
    const p = window.trustedTypes!==undefined ? window.trustedTypes.createPolicy('default', {createHTML: (string, sink) => string}):{createHTML: (string, sink) => string};
    let choice=GM_getValue('translate_choice','谷歌翻译');
    let choice_lang=GM_getValue('translate_lang_choice','pt');
   // console.log('moren:'+choice_lang)
    let select=document.createElement("select");
    select.className='js_translate';
    select.style='height:35px;width:100px;background-color:#fff;border-radius:17.5px;text-align-last:center;color:#000000;margin:5px 0';
    select.onchange=()=>{
        GM_setValue('translate_choice',select.value);
        title.innerText="控制面板（请刷新以应用）"
    };
    for(let i in transdict)select.innerHTML+=p.createHTML('<option value="'+i+'">'+i+'</option>');
    //
    let translate_lang=document.createElement("select");
    translate_lang.className='js_translate_lang';
    translate_lang.style='height:35px;width:100px;background-color:#fff;border-radius:17.5px;text-align-last:center;color:#000000;margin:5px 0';
    translate_lang.onchange=()=>{
        GM_setValue('translate_lang_choice',translate_lang.value);
        console.log('设置翻译成功')
        title.innerText="控制面板（请刷新以应用）"
    };
    //translate_lang.innerHTML+=p.createHTML('<option value="11">aaaa</option>');
    for(let i in all_languages){
        //console.log(i)
        translate_lang.innerHTML+=p.createHTML('<option value="'+all_languages[i].id+'">'+all_languages[i].name+'</option>');
    }
    let enable_details = document.createElement('details');
    enable_details.innerHTML+=p.createHTML("<summary>启用规则</summary>");
    for(let i in rules){
        let temp=document.createElement('input');
        temp.type='checkbox';
        temp.name=i;
        if(GM_getValue("enable_rule:"+temp.name,true))temp.setAttribute('checked',true)
        enable_details.appendChild(temp);
        enable_details.innerHTML+=p.createHTML("<span>"+i+"</span><br>");
    }
    let mask=document.createElement('div'),dialog=document.createElement("div"),js_dialog=document.createElement("div"),title=document.createElement('p');
    //
    let shadowRoot = document.createElement('div');
    shadowRoot.style="position: absolute;visibility: hidden;";
    window.top.document.body.appendChild(shadowRoot);
    let shadow = shadowRoot.attachShadow({ mode: "closed" })
    shadow.appendChild(mask);
    //window.top.document.body.appendChild(shadow);
    dialog.appendChild(js_dialog);
    mask.appendChild(dialog);
    js_dialog.appendChild(title)
    js_dialog.appendChild(document.createElement('p').appendChild(select));
    js_dialog.appendChild(document.createElement('p').appendChild(translate_lang));
    js_dialog.appendChild(document.createElement('p').appendChild(enable_details));
    //
    mask.style="display: none;position: fixed;height: 100vh;width: 100vw;z-index: 99999;top: 0;left: 0;overflow: hidden;background-color: rgba(0,0,0,0.4);justify-content: center;align-items: center;visibility: visible;"
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
        temp_p.innerHTML+=p.createHTML(baseoptions[i].declare);
    }
    for(let i of js_dialog.querySelectorAll('input')){
        if(i.name&&baseoptions[i.name]){
            i.onclick=_=>{title.innerText="控制面板（请刷新以应用）";GM_setValue(i.name,i.checked);if(baseoptions[i.name].change_func)baseoptions[i.name].change_func(i)}
            i.checked=GM_getValue(i.name,baseoptions[i.name].default_value)
        }
    };
    for(let i of enable_details.querySelectorAll('input'))i.onclick=_=>{title.innerText="控制面板（请刷新以应用）";GM_setValue('enable_rule:'+i.name,i.checked)}
    let open=document.createElement('div');
    open.style=`z-index:9999;height:35px;width:35px;background-color:#fff;position:fixed;border:1px solid rgba(0,0,0,0.2);border-radius:17.5px;right:${GM_getValue('position_right','9px')};top:${GM_getValue('position_top','9px')};text-align-last:center;color:#000000;display:flex;align-items:center;justify-content:center;cursor: pointer;font-size:15px;user-select:none;visibility: visible;`;
    open.innerHTML=p.createHTML("译");
    open.onclick=()=>{mask.style.display='flex'};
    open.draggable=true;
    open.addEventListener("dragstart",function(ev){this.tempNode=document.createElement('div');this.tempNode.style="width:1px;height:1px;opacity:0";document.body.appendChild(this.tempNode);ev.dataTransfer.setDragImage(this.tempNode,0,0);this.oldX=ev.offsetX-Number(this.style.width.replace('px',''));this.oldY=ev.offsetY});
    open.addEventListener("drag",function(ev){if(!ev.x&&!ev.y)return;this.style.right=Math.max(window.innerWidth-ev.x+this.oldX,0)+"px";this.style.top=Math.max(ev.y-this.oldY,0)+"px"});
    open.addEventListener("dragend",function(ev){GM_setValue("position_right",this.style.right);GM_setValue("position_top",this.style.top);document.body.removeChild(this.tempNode)});
    open.addEventListener("touchstart", ev=>{ev.preventDefault();ev=ev.touches[0];open._tempTouch={};const base=open.getClientRects()[0];open._tempTouch.oldX=base.x+base.width-ev.clientX;open._tempTouch.oldY=base.y-ev.clientY});
    open.addEventListener("touchmove",ev=>{ev=ev.touches[0];open.style.right=Math.max(window.innerWidth-open._tempTouch.oldX-ev.clientX,0)+'px';open.style.top=Math.max(ev.clientY+open._tempTouch.oldY,0)+'px';open._tempIsMove=true});
    open.addEventListener("touchend",()=>{GM_setValue("position_right",open.style.right);GM_setValue("position_top",open.style.top);if(!open._tempIsMove){mask.style.display='flex'};open._tempIsMove=false})
    shadow.appendChild(open);
    shadow.querySelector('.js_translate option[value='+choice+']').selected=true;
    shadow.querySelector('.js_translate_lang option[value='+choice_lang+']').selected=true;
    if(fullscrenn_hidden)window.top.document.addEventListener('fullscreenchange',()=>{open.style.display=window.top.document.fullscreenElement?"none":"flex"});
}

const rules={
    'tweetdeck':[{
        name:'tweetdeck',
        matcher:/https:\/\/tweetdeck.twitter.com/,
        selector:baseSelector('.js-quoted-tweet-text,.js-tweet-text,div[dir="auto"][lang]'),
        textGetter:baseTextGetter,
        textSetter:baseTextSetter
    }],
    'twitter':[{
        name:'推特通用',
        matcher:/https:\/\/[a-zA-Z.]*?twitter\.com/,
        selector:baseSelector('div[dir="auto"][lang],div[data-testid=birdwatch-pivot]>div[dir=ltr]'),
        textGetter:baseTextGetter,
        textSetter:(element,name,text)=>{
            element.style=element.style.cssText.replace(/-webkit-line-clamp.*?;/,'')
            baseTextSetter(element,name,text).style.display = 'flex';
        }
    }],
    'youtube':[
        {
            name:'youtube pc通用',
            matcher:/https:\/\/www.youtube.com\/(watch|shorts)/,
            selector: baseSelector("#content>#content-text,#content>#description>.content"),
            textGetter:element=>remove_url?url_filter(element.innerText):element.innerText,
            textSetter:(element,name,text)=>{
                baseTextSetter(element,name,text);
                element.parentNode.parentNode.removeAttribute('collapsed');
            }
        },
        {
            name:'youtube mobile通用',
            matcher:/https:\/\/m.youtube.com\/watch/,
            selector:baseSelector(".comment-text.user-text,.slim-video-metadata-description"),
            textGetter:baseTextGetter,
            textSetter:baseTextSetter
        },
        {
            name:'youtube 短视频',
            matcher:/https:\/\/(www|m).youtube.com\/shorts/,
            selector:baseSelector("#comment-content #content-text,.comment-content .comment-text"),
            textGetter:baseTextGetter,
            textSetter:baseTextSetter
        }
    ],
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
        selector:baseSelector('a[data-click-id=body]:not([class=undefined]),.RichTextJSON-root,#-post-rtjson-content'),
        textGetter:baseTextGetter,
        textSetter:baseTextSetter
    }],
    '5ch':[{
        name:'5ch评论',
        matcher:/http(|s):\/\/.*?.5ch.net\/.+/,
        selector:baseSelector('.post>.post-content'),
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
    'telegram':[
        {
            name:'telegram聊天新',
            matcher:/https:\/\/.*?.telegram.org\/(a|z)\//,
            selector:baseSelector('p.text-content[dir=auto],div.text-content'),
            textGetter:e=>Array.from(e.childNodes).filter(item=>!item.className).map(item=>item.nodeName==="BR"?"\n":item.textContent).join(''),
            textSetter:baseTextSetter
        },
        {
            name:'telegram聊天',
            matcher:/https:\/\/.*?.telegram.org\/.+/,
            selector:baseSelector('div.message[dir=auto],div.im_message_text'),
            textGetter:e=>Array.from(e.childNodes).filter(item=>!item.className).map(item=>item.nodeValue||item.innerText).join(" "),
            textSetter:baseTextSetter
        }
    ],
    'quora':[{
        name:'quora通用',
        matcher:/https:\/\/www.quora.com/,
        selector:baseSelector('div.q-text > span[class] > span.q-box.qu-userSelect--text'),
        textGetter:baseTextGetter,
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
                    console.log("【翻译机】检测到URl变更，当前无匹配规则")
                }
                rule=ruleNew;
            }
        }
    },200)
    console.log(rule?`【翻译机】使用【${rule.name}】规则`:"【翻译机】当前无匹配规则");
    console.log(document.location.href)
    let main=_=>{
        if(!rule)return;
        const choice=GM_getValue('translate_choice','谷歌翻译');
        const choice_lang=GM_getValue('translate_choice_lang','pt');
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
window.onload = function(){
    //TRANSLATED_LANGUAGE = GM_getValue('translate_choice_lang') ? GM_getValue('translate_choice_lang') : TRANSLATED_LANGUAGE;
    TRANSLATED_LANGUAGE=GM_getValue('translate_lang_choice','pt');
   // console.log(TRANSLATED_LANGUAGE);
    const sendMessage = function() {
        setTimeout(function(){
            $('#editable-message-text').focus();
            setTimeout(function(){
                document.execCommand("selectAll");
                setTimeout(function(){
                    let content = $('#translatedMessage').html();
                    document.execCommand("insertText", false, content);
                    setTimeout(function(){
                        $('[aria-label="Send Message"]').click();
                        setTimeout(function(){
                            $('#translatedMessage').html('');
                            $('#originalTextInput').val('').focus();

                        },200);
                    },200);
                }, 200);
            }, 200);
        }, 200);
    }
    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
    var translate = function(sl,dl,txt,cb){
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ sl + "&tl=" + dl +"&dt=t&q=" + encodeURI(txt),
            onload: function(response) {
                //replace the \n
                var _r_text = replaceAll(response.responseText, '\n"', '"');
                //console.log('查看:'+_r_text);
                var _r=JSON.parse(_r_text);
                translate_string = '';
                for(var i=0; i<_r[0].length;i++){
                    translate_string += _r[0][i][0];
                }
                cb.apply({text: translate_string});
            }
        });
    };
    $(".ListItem-button").click(function() {
        if($('.tranlate-bottom').length === 0){
            $('.middle-column-footer').append(custom_html);
            $('#translatedMessage').html('');
            $('#originalTextInput').val('').focus();
            $('#originalTextInput').keyup(function(event){
        if (event.which == 13) {
            retry(
                function(){console.log('translate_ready',translate_ready); return translate_ready;},
                sendMessage,
                function(){alert('翻译失败请重试!');}
            );
            return false;
        }else{
            var $_translate_input_1 = $('#translatedMessage');
            $_translate_input_1.html('输入中...');
            translate_ready = false;
            delay(function(){
                var _input = $.trim(document.getElementById('originalTextInput').value);
                if(_input.length>=2 && _input != readyTranslation){
                    translate(SOURCE_LANGUAGE, TRANSLATED_LANGUAGE, _input, function(){
                        $_translate_input_1.html(this.text);
                        translate_ready = true;
                    });
                }else{
                    $_translate_input_1.html('');
                    readyTranslation = '';
                }
            }, 1000);
        }
    });
        }else{
            $('#translatedMessage').html('');
            $('#originalTextInput').val('').focus();
        }

    });



    function retry(checkCallback, successCallback, failCallback, delay=500, tries=30) {
        if(tries && checkCallback() !== true){
            setTimeout(retry.bind(this, checkCallback, successCallback, failCallback, delay, tries-1), delay);
        }else if(tries<=0){
            failCallback();
        }else{
            successCallback();
        }
    }
	}


//--综合工具区--start



function removeItem(arr,item){
    const index=arr.indexOf(item);
    if(index>-1)arr.splice(index,1);
}

function baseSelector(selector){
    return ()=>{
        const items = document.querySelectorAll(selector);
        return Array.from(items).filter(item=>{
            const nodes = item.querySelectorAll('[data-translate]');
            return !(nodes && Array.from(nodes).some(node=>node.parentNode === item));
        })
    }
}

function baseTextGetter(e){
    return e.innerText;
}

function baseTextSetter(e,name,text){//change element text
    if((text||"").length==0)text='翻译异常';
    const spanNode = document.createElement('span');
    spanNode.style.whiteSpace = "pre-wrap";
    spanNode.innerText = `\n\n${show_info?"-----------"+name+"-----------\n\n":""}`+text;
    spanNode.dataset.translate="processed";
    e.appendChild(spanNode);
    return spanNode;
}

function url_filter(text){
    return text.replace(/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g,'');
}

async function pass_lang(raw){//确认是否为中文，是则中断promise
    if(!enable_pass_lang&&!enable_pass_lang_cht)return;
    try{
        const result = await check_lang(raw)
        if(enable_pass_lang && result == 'zh')return new Promise(()=>{});
        if(enable_pass_lang_cht && result=='cht')return new Promise(()=>{});
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
        url:"https://translate.google.com/_/TranslateWebserverUi/data/batchexecute",
        data: "f.req="+encodeURIComponent(JSON.stringify([[["MkEWBc",JSON.stringify([[raw,"auto","zh-CN",true],[null]]),null,"generic"]]])),
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "Host": "translate.google.com",
        },
        anonymous:true,
        nocache:true,
    }
    return await BaseTranslate('谷歌翻译a',raw,options,res=>JSON.parse(JSON.parse(res.slice(res.indexOf('[')))[0][2])[1][0][0][5].map(item=>item[0]).join(''))
}

//--谷歌翻译--end

//--谷歌翻译mobile--start
async function translate_ggm(raw){
    const options = {
        method:"GET",
        url:"https://translate.google.com/m?tl=zh-CN&q="+encodeURIComponent(raw),
        headers:{
            "Host": "translate.google.com",
        },
        anonymous:true,
        nocache:true,
    }
    return await BaseTranslate('谷歌翻译mobile',raw,options,res=>/class="result-container">((?:.|\n)*?)<\/div/.exec(res)[1])
}
//--谷歌翻译mobile--end

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
    sessionStorage.setItem('baidu_gtk',/window\.gtk = ('|")(.*?)('|")/.exec(res.responseText)[2]);
    sessionStorage.setItem('baidu_token',/token: ('|")(.*?)('|")/.exec(res.responseText)[2])
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
    const sign = CryptoJS.MD5("6key_web_fanyi"+"ifanyiweb8hc9s98e"+raw.replace(/(^\s*)|(\s*$)/g, "")).toString().substring(0,16)
    const options = {
        method:"POST",
        url:`https://ifanyi.iciba.com/index.php?c=trans&m=fy&client=6&auth_user=key_web_fanyi&sign=${sign}`,
        data:'from=auto&t=zh&q='+encodeURIComponent(raw),
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
        url:'https://www.bing.com/ttranslatev3',
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
    const ts = ""+(new Date).getTime();
    const params = {
        keyid: "webfanyi-key-getter",
        client: "fanyideskweb",
        product: "webfanyi",
        appVersion: "1.0.0",
        vendor: "web",
        pointParam: "client,mysticTime,product",
        mysticTime: ts,
        keyfrom: "fanyi.web",
        sign: CryptoJS.MD5(`client=fanyideskweb&mysticTime=${ts}&product=webfanyi&key=asdjnjfenknafdfsdfsd`)
    }
    const options = {
        method:"GET",
        url:`https://dict.youdao.com/webtranslate/key?${Object.entries(params).map(item=>item.join('=')).join('&')}`,
        headers: {
            "Origin": "https://fanyi.youdao.com"
        }
    }
    const res = await Request(options);
    sessionStorage.setItem('youdao_key',JSON.parse(res.responseText).data.secretKey)
}

async function translate_youdao(raw){
    const ts=""+(new Date).getTime();
    const params = {
        i: encodeURIComponent(raw),
        from: 'auto',
        to: '',
        dictResult: 'true',
        keyid: "webfanyi",
        client: "fanyideskweb",
        product: "webfanyi",
        appVersion: "1.0.0",
        vendor: "web",
        pointParam: "client,mysticTime,product",
        mysticTime: ts,
        keyfrom: "fanyi.web",
        sign: CryptoJS.MD5(`client=fanyideskweb&mysticTime=${ts}&product=webfanyi&key=${sessionStorage.getItem('youdao_key')}`)+''
    }
    const options = {
        method:"POST",
        url:'https://dict.youdao.com/webtranslate',
        data:Object.entries(params).map(item=>item.join('=')).join('&'),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": "https://fanyi.youdao.com/",
            "Origin": "https://fanyi.youdao.com",
            "Host": "dict.youdao.com",
            "Cookie": "OUTFOX_SEARCH_USER_ID=0@0.0.0.0"
        },
        anonymous:true,
    }
    const res = await Request(options);
    const decrypted = A(res);
    console.log(decrypted)
    //console.log(decrypted.toString(CryptoJS.enc.Utf8).toString());
    return await BaseTranslate('有道翻译',raw,options,res=>JSON.parse(A(res)).translateResult.map(e=>e.map(t=>t.tgt).join('')).join('\n'))
}

function m(e) {
    return CryptoJS.MD5(e).toString(CryptoJS.enc.Hex);
}

function A (t, o, n) {
    o = "ydsecret://query/key/BRGygVywfNBwpmBaZgWT7SIOUP2T0C9WHMZN39j^DAdaZhAnxvGcCY6VYFwnHl"
    n = "ydsecret://query/iv/C@lZe2YzHtZ2CYgaXKSVfsb7Y4QWHjITPPZ0nQp87fBeJ!Iv6v^6fvi2WN@bYpJ4"
    if (!t)
        return null;
    const a = CryptoJS.enc.Hex.parse(m(o)),
          r = CryptoJS.enc.Hex.parse(m(n)),
          i = CryptoJS.AES.decrypt(t, a, {
              iv: r
          });
    return i.toString(CryptoJS.enc.Utf8);
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
            "Referer": "https://fanyi.qq.com/",
            "X-Requested-With": "XMLHttpRequest",
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
            "Origin": "https://fanyi.caiyunapp.com",
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
    const uri = /"\/(home\..*?.chunk.js)"/.exec(base_res.responseText)[1]
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

//--阿里翻译--start
async function translate_alibaba(raw){
    const options = {
        method: 'POST',
        url:'https://translate.alibaba.com/translationopenseviceapp/trans/TranslateTextAddAlignment.do',
        data:`srcLanguage=auto&tgtLanguage=zh&bizType=message&srcText=${encodeURIComponent(raw)}`,
        headers:{
            "Content-Type":"application/x-www-form-urlencoded",
            "origin": "https://translate.alibaba.com",
            "referer": "https://translate.alibaba.com/",
            "sec-fetch-site": "same-origin",
        }
    }
    return await BaseTranslate('阿里翻译',raw,options,res=>JSON.parse(res).listTargetText[0])
}
//--阿里翻译--end

//--Deepl翻译--start

function getTimeStamp(iCount) {
    const ts = Date.now();
    if (iCount !== 0) {
        iCount = iCount + 1;
        return ts - (ts % iCount) + iCount;
    } else {
        return ts;
    }
}

async function translate_deepl(raw) {
    const id = (Math.floor(Math.random() * 99999) + 100000)* 1000;
    const data = {
        jsonrpc: '2.0',
        method: 'LMT_handle_texts',
        id,
        params: {
            splitting: 'newlines',
            lang: {
                source_lang_user_selected: 'auto',
                target_lang: 'ZH',
            },
            texts: [{
                text: raw,
                requestAlternatives:3
            }],
            timestamp: getTimeStamp(raw.split('i').length - 1)
        }
    }
    let postData = JSON.stringify(data);
    if ((id + 5) % 29 === 0 || (id + 3) % 13 === 0) {
        postData = postData.replace('"method":"', '"method" : "');
    } else {
        postData = postData.replace('"method":"', '"method": "');
    }
    const options = {
        method: 'POST',
        url: 'https://www2.deepl.com/jsonrpc',
        data: postData,
        headers: {
            'Content-Type': 'application/json',
            'Host': 'www.deepl.com',
            'Origin': 'https://www.deepl.com',
            'Referer': 'https://www.deepl.com/'
        },
        anonymous:true,
        nocache:true,
    }
    return await BaseTranslate('Deepl翻译',raw,options,res=>JSON.parse(res).result.texts[0].text)
}

//--Deepl翻译--end

//--腾讯AI翻译--start
async function translate_tencentai(raw){
    const data = {
        "header": {
            "fn": "auto_translation"
        },
        "type": "plain",
        "model_category": "normal",
        "text_domain": "general",
        "source": {
            "lang": "auto",
            "text_list": [raw]
        },
        "target": {
            "lang": "zh"
        }
    }
    const options = {
        method: 'POST',
        url: 'https://transmart.qq.com/api/imt',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Host': 'transmart.qq.com',
            'Origin': 'https://transmart.qq.com',
            'Referer': 'https://transmart.qq.com/'
        },
        anonymous:true,
        nocache:true,
    }
    return await BaseTranslate('腾讯AI翻译',raw,options,res=>JSON.parse(res).auto_translation[0])
}
//--腾讯Ai翻译--end

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
            if(result)sessionStorage.setItem(name+'-'+raw,result);
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