// ==UserScript==
// @license MIT
// @name         send
// @namespace    http://tampermonkey.net/
// @version      0.48
// @description  gsend
// @author       HolynnChen
// @match        *://*.twitter.com/*
// @match        *://*.youtube.com/*
// @match        *://*.facebook.com/*
// @match        *://*.reddit.com/*
// @match        *://*.5ch.net/*
// @match        *://*.discord.com/*
// @match        *://*.telegram.org/*
// @match        *://*.voice.google.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@2.5.2/base64.min.js
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/475253/send.user.js
// @updateURL https://update.greasyfork.org/scripts/475253/send.meta.js
// ==/UserScript==

//保护可能被覆盖的方法
const tmpIFrame = document.createElement("iframe");
document.body.appendChild(tmpIFrame);
window.sessionStorage = tmpIFrame.contentWindow.sessionStorage;
const sessionStorage = window.sessionStorage;
document.body.removeChild(tmpIFrame);
//

const transdict={'谷歌翻译':translate_gg,'关闭翻译':()=>{}};
const startup={};
const baseoptions = {
    'enable_pass_lang': {
        declare: '不翻译中文',
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
    },
    'fullscrenn_hidden':{
        declare: '全屏时不显示',
        default_value: true,
    }
};

const [enable_pass_lang,remove_url,show_info,fullscrenn_hidden]=Object.keys(baseoptions).map(key=>'【翻译机】使用【gv】规则');

const globalProcessingSave=[];

function initPanel(){

    let choice='谷歌翻译';
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
        if(true)temp.setAttribute('checked',true)
        enable_details.appendChild(temp);
        enable_details.innerHTML+="<span>"+i+"</span><br>";
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
            i.checked=true
        }
    };
    for(let i of enable_details.querySelectorAll('input'))i.onclick=_=>{title.innerText="控制面板（请刷新以应用）";GM_setValue('enable_rule:'+i.name,i.checked)}
    let open=document.createElement('div');
    open.style=`z-index:9999;height:35px;width:35px;background-color:#fff;position:fixed;border:1px solid rgba(0,0,0,0.2);border-radius:17.5px;right:'9px'};top:'9px'};text-align-last:center;color:#000000;display:flex;align-items:center;justify-content:center;cursor: pointer;font-size:15px;user-select:none`;
    open.innerHTML="译";
    open.onclick=()=>{mask.style.display='flex'};
    open.draggable=true;
    open.addEventListener("dragstart",function(ev){this.tempNode=document.createElement('div');this.tempNode.style="width:1px;height:1px;opacity:0";document.body.appendChild(this.tempNode);ev.dataTransfer.setDragImage(this.tempNode,0,0);this.oldX=ev.offsetX-Number(this.style.width.replace('px',''));this.oldY=ev.offsetY});
    open.addEventListener("drag",function(ev){if(!ev.x&&!ev.y)return;this.style.right=Math.max(window.innerWidth-ev.x+this.oldX,0)+"px";this.style.top=Math.max(ev.y-this.oldY,0)+"px"});
    open.addEventListener("dragend",function(ev){GM_setValue("position_right",this.style.right);GM_setValue("position_top",this.style.top);document.body.removeChild(this.tempNode)});
    open.addEventListener("touchstart", ev=>{ev.preventDefault();ev=ev.touches[0];open._tempTouch={};const base=open.getClientRects()[0];open._tempTouch.oldX=base.x+base.width-ev.clientX;open._tempTouch.oldY=base.y-ev.clientY});
    open.addEventListener("touchmove",ev=>{ev=ev.touches[0];open.style.right=Math.max(window.innerWidth-open._tempTouch.oldX-ev.clientX,0)+'px';open.style.top=Math.max(ev.clientY+open._tempTouch.oldY,0)+'px';open._tempIsMove=true});
    open.addEventListener("touchend",()=>{GM_setValue("position_right",open.style.right);GM_setValue("position_top",open.style.top);if(!open._tempIsMove){mask.style.display='flex'};open._tempIsMove=false})
    window.top.document.body.appendChild(open);
    window.top.document.querySelector('.js_translate option[value='+choice+']').selected=true;
    if(fullscrenn_hidden)window.top.document.addEventListener('fullscreenchange',()=>{open.style.display=window.top.document.fullscreenElement?"none":"flex"});
}

const rules={
	'gv':[{
        name:'gv',
        matcher:/https:\/\/voice.google.com\/.+/,
        selector:baseSelector('div[class*=subject-content-container]'),
        textGetter:baseTextGetter,
        textSetter:baseTextSetter
    }]
};


(function() {
    'use strict';
    const GetActiveRule = ()=>Object.entries(rules).filter(([key])=>true).map(([_,group])=>group).flat().find(item=>item.matcher.test(document.location.href));
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
        const choice='谷歌翻译';
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
    PromiseRetryWrap(startup['谷歌翻译']).then(()=>{document.js_translater=setInterval(main,20)});
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
    //e.innerHTML+=`<span style="white-space:pre-wrap">\n\n${show_info?"-----------"+name+"-----------":""}\n\n`+text+'</span>';
	e.innerHTML+=`<span style="white-space:pre-wrap">\n`+text+'</span>';
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
	console.log("raw====>"+raw);
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
    return await BaseTranslate('谷歌翻译',raw,options,res=>JSON.parse(JSON.parse(res.slice(res.indexOf('[')))[0][2])[1][0][0][5].map(item=>item[0]).join(''))
}
//--反向翻译--start
function translate_gg2(raw){
	console.log("raw====>"+raw);
    const options = {
        method:"POST",
        url:"https://translate.google.com/_/TranslateWebserverUi/data/batchexecute",
        data: "f.req="+encodeURIComponent(JSON.stringify([[["MkEWBc",JSON.stringify([[raw,"auto","en-US",true],[null]]),null,"generic"]]])),
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "Host": "translate.google.com",
        },
        anonymous:true,
        nocache:true,
    }
	var gg2=BaseTranslate('谷歌翻译',raw,options,res=>JSON.parse(JSON.parse(res.slice(res.indexOf('[')))[0][2])[1][0][0][5].map(item=>item[0]).join(''));
	console.log('gg2====>'+gg2);
    return gg2;
}
//--谷歌翻译--end
//--异步请求包装工具--start

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
			console.log(name+'-'+raw+'####'+result);
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
function waitElement(selector, times, interval, flag = true) {
	var _times    = times || 50,     // 默认50次
		_interval = interval || 100, // 默认每次间隔100毫秒
		_selector = selector, //选择器
		_iIntervalID,
		_flag = flag; //定时器id

	return new Promise(function (resolve, reject) {
		_iIntervalID = setInterval(function () {
			if (!_times) { //是0就退出
				clearInterval(_iIntervalID);
				reject();
			}
			_times <= 0 || _times--; //如果是正数就 --
			var _self = document.querySelector(_selector); //再次选择
			if ((_flag && _self) || (!_flag && !_self)) { //判断是否取到
				clearInterval(_iIntervalID);
				resolve(_self);
			}
		}, _interval);
	});
}


const simulateKeyPress = (element) => {
  element.dispatchEvent(new Event('change', {
    bubbles: true,
    cancelable: true
  }));
}

//waitElement('.md-body-1.layout-align-start-stretch.layout-row.gvMessageEntry-inputRoot')
//	.then(result => {
		//var ac=document.getElementsByClassName('md-body-1 layout-align-start-stretch layout-row gvMessageEntry-inputRoot')[0].offsetWidth;
		//console.log("class in----"+ac);
		//document.getElementsByClassName('md-body-1 layout-align-start-stretch layout-row gvMessageEntry-inputRoot')[0].style.visibility='hidden';
//	})





/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
*/
var zNode       = document.createElement ('div');
zNode.innerHTML = '<input type="text" id="t1" /><button id="myButton" type="button">'
                + '发送!</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

document.getElementById('t1').addEventListener('keydown', function(e){
	var theEvent = e || window.event;
　　var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
　　if (code == 13) {
		ButtonClickAction(this);
	}
});


function ButtonClickAction (zEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
        of the screen.
    */
	document.getElementById('myButton').innerHTML='正在翻译...';
	document.getElementById('myButton').disabled = true;
    var aaa=document.getElementById ("t1").value;
	console.log('aaa===>'+aaa);
	var ccc=translate_gg2(aaa);

	var func = function(i){

		return function(){
			if (i >= 75) return;
			console.log("turn no. " + i);

			if(sessionStorage.getItem('谷歌翻译-'+aaa)){
				console.log("ccc====>"+ccc);
				var gvMessageEditor='textarea[gv-test-id="gv-message-input"], textarea[aria-label="Type a message"], textarea[aria-label="Add a caption"], #gv-message-input, div[gv-test-id="gv-message-input"]';
				var messageEditor = document.querySelector(gvMessageEditor);
				//document.getElementById('input_0').value=sessionStorage.getItem('谷歌翻译-'+aaa);
				document.getElementsByClassName("ng-pristine ng-valid md-input")[0].value=sessionStorage.getItem('谷歌翻译-'+aaa);
				simulateKeyPress(messageEditor);
				document.getElementById('ib2').click();
				document.getElementById('myButton').innerHTML='发送!';
				document.getElementById('myButton').disabled = false;
				document.getElementById('t1').value='';
				i=76;
			}else{
				console.log("turn nos. " + i);
				console.log('not ready');
				setTimeout(func(++i), 500);
			}
		}
	}
	setTimeout(func(0), 500);



}

//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               absolute;
        right:                    0;
        bottom:                   0;
        font-size:              20px;
        background:             orange;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }
` );