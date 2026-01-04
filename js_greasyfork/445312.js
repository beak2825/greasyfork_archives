// ==UserScript==
// @name         wk-full-cli
// @namespace    http://tampermonkey.net/
// @version      1.10.1
// @description  镜像，便于<script>使用
// @author       2690874578@qq.com
// @match        *://*.docin.com/p-*
// @match        *://docimg1.docin.com/?wk=true
// @match        *://ishare.iask.sina.com.cn/f/*
// @match        *://ishare.iask.com/f/*
// @match        *://swf.ishare.down.sina.com.cn/?path=*
// @match        *://swf.ishare.down.sina.com.cn/?wk=true
// @match        *://www.deliwenku.com/p-*
// @match        *://file.deliwenku.com/?num=*
// @match        *://file3.deliwenku.com/?num=*
// @match        *://www.doc88.com/p-*
// @match        *://www.360doc.com/content/*
// @match        *://doc.mbalib.com/view/*
// @match        *://www.dugen.com/p-*
// @match        *://max.book118.com/html/*
// @match        *://openapi.book118.com/?*
// @match        *://view-cache.book118.com/pptView.html?*
// @match        *://*.book118.com/?readpage=*
// @match        *://c.gb688.cn/bzgk/gb/showGb?*
// @match        *://www.safewk.com/p-*
// @match        *://www.renrendoc.com/paper/*
// @match        *://www.renrendoc.com/p-*
// @match        *://www.yunzhan365.com/basic/*
// @match        *://book.yunzhan365.com/*index.html*
// @match        *://wenku.so.com/d/*
// @match        *://jg.class.com.cn/cms/resourcedetail.htm?contentUid=*
// @match        *://preview.imm.aliyuncs.com/index.html?url=*/jgjyw/*
// @match        *://www.wenkub.com/p-*.html*
// @match        *://*/manuscripts/?*
// @match        *://gwfw.sdlib.com:8000/*
// @match        *://www.jinchutou.com/shtml/view-*
// @match        *://www.jinchutou.com/p-*
// @match        *://www.nrsis.org.cn/*/read/*
// @match        https://xianxiao.ssap.com.cn/readerpdf/?id=*
// @match        https://xianxiao.ssap.com.cn/index/rpdf/read/id/*/catalog_id/0.html?file=*
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jspdf/2.5.1/jspdf.umd.min.js
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/html2canvas/1.4.1/html2canvas.min.js
// @icon         https://s2.loli.net/2022/01/12/wc9je8RX7HELbYQ.png
// @icon64       https://s2.loli.net/2022/01/12/tmFeSKDf8UkNMjC.png
// @grant        none
// @run-at       document-idle
// @license      GPL-3.0-only
// @create       2021-11-22
// @note         1. 应对 sklib 的 AES 加密
// @downloadURL https://update.greasyfork.org/scripts/445312/wk-full-cli.user.js
// @updateURL https://update.greasyfork.org/scripts/445312/wk-full-cli.meta.js
// ==/UserScript==
(function(){'use strict';class Socket{constructor(target){if(!(target.window&&(target===target.window))){console.log(target);throw new Error(`target is not a [Window Object]`);}
this.target=target;this.connected=false;this.listeners=new Set();}
get[Symbol.toStringTag](){return"Socket";}
talk(message){if(!this.target){throw new TypeError(`socket.target is not a window: ${this.target}`);}
this.target.postMessage(message,"*");}
listen(listener,once=false){if(this.listeners.has(listener)){return;}
let real_listener=listener;if(once){const self=this;function wrapped(e){listener(e);self.notListen(wrapped);}
real_listener=wrapped;}
this.listeners.add(real_listener);window.addEventListener("message",real_listener,true);return real_listener;}
notListen(listener){console.log(listener);console.log("listener delete operation:",this.listeners.delete(listener));window.removeEventListener("message",listener,true);}
_on_pong(e,resolve){if(e.data.pong){this.connected=true;this.listeners.forEach(listener=>listener.ping?this.notListen(listener):0);console.log("Client: Connected!\n"+new Date());resolve(this);}}
_ping(){return new Promise((resolve,reject)=>{const listener=this.listen(e=>this._on_pong(e,resolve));listener.ping=true;setTimeout(()=>reject(new Error(`Timeout Error during receiving pong (>5min)`)),5*60*1000);this.talk({ping:true});});}
_on_ping(e,resolve){if(e.data.ping){this.target=e.source;this.connected=true;this.listeners.forEach(listener=>listener.pong?this.notListen(listener):0);console.log("Server: Connected!\n"+new Date());resolve(this);this.talk({pong:true});}}
_pong(){return new Promise(resolve=>{const listener=this.listen(e=>this._on_ping(e,resolve));listener.pong=true;});}
connect(talk_first){if(talk_first){return this._ping();}
return this._pong();}}
const base={Socket,init_gbk_encoder(){let table;function initGbkTable(){const ranges=[[0xA1,0xA9,0xA1,0xFE],[0xB0,0xF7,0xA1,0xFE],[0x81,0xA0,0x40,0xFE],[0xAA,0xFE,0x40,0xA0],[0xA8,0xA9,0x40,0xA0],[0xAA,0xAF,0xA1,0xFE],[0xF8,0xFE,0xA1,0xFE],[0xA1,0xA7,0x40,0xA0],];const codes=new Uint16Array(23940);let i=0;for(const[b1Begin,b1End,b2Begin,b2End]of ranges){for(let b2=b2Begin;b2<=b2End;b2++){if(b2!==0x7F){for(let b1=b1Begin;b1<=b1End;b1++){codes[i++]=b2<<8|b1;}}}}
table=new Uint16Array(65536);table.fill(0xFFFF);const str=new TextDecoder('gbk').decode(codes);for(let i=0;i<str.length;i++){table[str.charCodeAt(i)]=codes[i];}}
const defaultOnAlloc=(len)=>new Uint8Array(len);const defaultOnError=()=>63;return function(str,onError=null){if(!table){initGbkTable();}
const onAlloc=defaultOnAlloc;onError=onError===null?defaultOnError:onError;const buf=onAlloc(str.length*2);let n=0;for(let i=0;i<str.length;i++){const code=str.charCodeAt(i);if(code<0x80){buf[n++]=code;continue;}
const gbk=table[code];if(gbk!==0xFFFF){buf[n++]=gbk;buf[n++]=gbk>>8;}
else if(code===8364){buf[n++]=0x80;}
else{const ret=onError(i,str);if(ret===-1){break;}
if(ret>0xFF){buf[n++]=ret;buf[n++]=ret>>8;}else{buf[n++]=ret;}}}
return buf.subarray(0,n)}},longest_prefix:function(arr){let table=new Array(arr.length);let maxPrefix=0;table[0]=0;for(let i=1;i<arr.length;i++){while(maxPrefix>0&&arr[i]!==arr[maxPrefix]){maxPrefix=table[maxPrefix-1];}
if(arr[maxPrefix]===arr[i]){maxPrefix++;}
table[i]=maxPrefix;}
return table;},getAllValus:function(iterators){if(iterators.length===0){return[true,[]];}
let values=[];for(let iterator of iterators){let{value,done}=iterator.next();if(done){return[true,[]];}
values.push(value);}
return[false,values];},oldCopy:function(text){document.oncopy=function(event){event.clipboardData.setData('text/plain',text);event.preventDefault();};document.execCommand('Copy',false,null);},b64ToUint6:function(nChr){return nChr>64&&nChr<91?nChr-65:nChr>96&&nChr<123?nChr-71:nChr>47&&nChr<58?nChr+4:nChr===43?62:nChr===47?63:0;},$:function(selector){const self=this?.querySelectorAll?this:document;return[...self.querySelectorAll(selector)];},$$:async function(selector){const self=this?.querySelectorAll?this:document;for(let i=0;i<10;i++){let elems=[...self.querySelectorAll(selector)];if(elems.length>0){return elems;}
await new Promise(r=>setTimeout(r,500));}
throw Error(`"${selector}" not found in 5s`);},stripBlanks:function(text){return text.replace(/([^\r\n])(\s{2,})(?=[^\r\n])/g,"$1 ").replace(/\n{2,}/,"\n");},superAssign:function(target,...sources){sources.forEach(source=>Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)));return target;},makeCRC32:function(){function makeCRCTable(){let c;let crcTable=[];for(var n=0;n<256;n++){c=n;for(var k=0;k<8;k++){c=((c&1)?(0xEDB88320^(c>>>1)):(c>>>1));}
crcTable[n]=c;}
return crcTable;}
const crcTable=makeCRCTable();return function(str){let crc=0^(-1);for(var i=0;i<str.length;i++){crc=(crc>>>8)^crcTable[(crc^str.charCodeAt(i))&0xFF];}
return(crc^(-1))>>>0;};}};const box=`
<div class="wk-box">
    <section class="btns-sec">
        <p class="logo_tit">Wenku Doc Downloader</p>
        <button class="btn-1">展开文档 😈</button>
        <button class="btn-2">空按钮 2</button>
        <button class="btn-3">空按钮 3</button>
        <button class="btn-4">空按钮 4</button>
        <button class="btn-5">空按钮 5</button>
    </section>
    <p class="wk-fold-btn unfold"></p>
</div>
`;const style=`
<style class="wk-style">
    .wk-fold-btn {
        position: fixed;
        left: 151px;
        top: 36%;
        user-select: none;
        font-size: large;
        z-index: 1001;
    }

    .wk-fold-btn::after {
        content: "🐵";
    }
    
    .wk-fold-btn.folded {
        left: 20px;
    }
    
    .wk-fold-btn.folded::after {
        content: "🙈";
    }

    .wk-box {
        position: fixed;
        width: 154px;
        left: 10px;
        top: 32%;
        z-index: 1000;
    }

    .btns-sec {
        background: #E7F1FF;
        border: 2px solid #1676FF;
        padding: 0px 0px 10px 0px;
        font-weight: 600;
        border-radius: 2px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
            'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
            'Segoe UI Emoji', 'Segoe UI Symbol';
    }

    .btns-sec.folded {
        display: none;
    }

    .logo_tit {
        width: 100%;
        background: #1676FF;
        text-align: center;
        font-size: 12px;
        color: #E7F1FF;
        line-height: 40px;
        height: 40px;
        margin: 0 0 16px 0;
    }

    .btn-1 {
        display: block;
        width: 128px;
        height: 28px;
        background: linear-gradient(180deg, #00E7F7 0%, #FEB800 0.01%, #FF8700 100%);
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
        border: none;
        outline: none;
        margin: 8px auto;
        font-weight: bold;
        cursor: pointer;
        opacity: .9;
    }

    .btn-2 {
        display: none;
        width: 128px;
        height: 28px;
        background: #07C160;
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
        border: none;
        outline: none;
        margin: 8px auto;
        font-weight: bold;
        cursor: pointer;
        opacity: .9;
    }

    .btn-3 {
        display: none;
        width: 128px;
        height: 28px;
        background: #FA5151;
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
        border: none;
        outline: none;
        margin: 8px auto;
        font-weight: bold;
        cursor: pointer;
        opacity: .9;
    }

    .btn-4 {
        display: none;
        width: 128px;
        height: 28px;
        background: #1676FF;
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
        border: none;
        outline: none;
        margin: 8px auto;
        font-weight: bold;
        cursor: pointer;
        opacity: .9;
    }

    .btn-5 {
        display: none;
        width: 128px;
        height: 28px;
        background: #ff6600;
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
        border: none;
        outline: none;
        margin: 8px auto;
        font-weight: bold;
        cursor: pointer;
        opacity: .9;
    }


    .btns-sec button:hover {
        opacity: 0.8;
    }

    .btns-sec button:active{
        opacity: 1;
    }

    .btns-sec button[disabled] {
        cursor: not-allowed;
        opacity: 1;
        filter: grayscale(1);
    }

    .wk-popup-container {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        z-index: 999;
        background: 0 0;
    }

    .wk-popup-head {
        font-size: 1.5em;
        margin-bottom: 12px
    }

    .wk-card {
        background: #fff;
        background-image: linear-gradient(48deg, #fff 0, #e5efe9 100%);
        border-top-right-radius: 16px;
        border-bottom-left-radius: 16px;
        box-shadow: -20px 20px 35px 1px rgba(10, 49, 86, .18);
        display: flex;
        flex-direction: column;
        padding: 32px;
        margin: 0;
        max-width: 400px;
        width: 100%
    }

    .content-wrapper {
        font-size: 1.1em;
        margin-bottom: 44px
    }

    .content-wrapper:last-child {
        margin-bottom: 0
    }

    .wk-button {
        align-items: center;
        background: #e5efe9;
        border: 1px solid #5a72b5;
        border-radius: 4px;
        color: #121943;
        cursor: pointer;
        display: flex;
        font-size: 1em;
        font-weight: 700;
        height: 40px;
        justify-content: center;
        width: 150px
    }

    .wk-button:focus {
        border: 2px solid transparent;
        box-shadow: 0 0 0 2px #121943;
        outline: solid 4px transparent
    }

    .link {
        color: #121943
    }

    .link:focus {
        box-shadow: 0 0 0 2px #121943
    }

    .input-wrapper {
        display: flex;
        flex-direction: column
    }

    .input-wrapper .label {
        align-items: baseline;
        display: flex;
        font-weight: 700;
        justify-content: space-between;
        margin-bottom: 8px
    }

    .input-wrapper .optional {
        color: #5a72b5;
        font-size: .9em
    }

    .input-wrapper .input {
        border: 1px solid #5a72b5;
        border-radius: 4px;
        height: 40px;
        padding: 8px
    }

    .modal-header {
        align-items: baseline;
        display: flex;
        justify-content: space-between
    }

    .close {
        background: 0 0;
        border: none;
        cursor: pointer;
        display: flex;
        height: 16px;
        text-decoration: none;
        width: 16px
    }

    .close svg {
        width: 16px
    }

    .modal-wrapper {
        background: rgba(0, 0, 0, .7);
    }

    #wk-popup {
        opacity: 0;
        transition: opacity .25s ease-in-out;
        display: none;
        flex-direction: row;
        justify-content: space-around;
    }

    #wk-popup:target {
        opacity: 1;
        display: flex;
    }

    #wk-popup:target .modal-body {
        opacity: 1;
        transform: translateY(1);
    }

    #wk-popup .modal-body {
        max-width: 500px;
        opacity: 0;
        transform: translateY(-3vh);
        transition: opacity .25s ease-in-out;
        width: 100%;
        z-index: 1
    }

    .outside-trigger {
        bottom: 0;
        cursor: default;
        left: 0;
        position: fixed;
        right: 0;
        top: 0;
    }
</style>
`;const popup=`
<div class="wk-popup-container">
    <div class='modal-wrapper' id='wk-popup'>
        <div class='modal-body wk-card'>
            <div class='modal-header'>
                <h2 class='wk-popup-head'>下载进度条</h2>
                <a href='#!' role='wk-button' class='close' aria-label='close this modal'>
                    <svg viewBox='0 0 24 24'>
                        <path
                            d='M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z'>
                        </path>
                    </svg>
                </a>
            </div>
            <p class='wk-popup-body'>正在初始化内容...</p>
        </div>
        <a href='#!' class='outside-trigger'></a>
    </div>
</div>
`;globalThis.wk$=base.$;globalThis.wk$$=base.$$;const utils={Socket:base.Socket,PDF_LIB_URL:"https://cdn.staticfile.org/pdf-lib/1.17.1/pdf-lib.min.js",encode_to_gbk:base.init_gbk_encoder(),print:function(...args){const time=new Date().toTimeString().slice(0,8);console.info(`[wk ${time}]`,...args);},bytes_to_b64:function(bytes){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=()=>reject(new Error("转换失败",{cause:bytes}));reader.onloadend=()=>resolve(reader.result.split(",")[1]);reader.readAsDataURL(new Blob([bytes]));});},raise:function(reason){alert(reason);throw new Error(reason);},get_stack:function(err){let stack=`${err.stack}`;const matches=stack.matchAll(/at .+?( [(].+[)])/g);for(const group of matches){stack=stack.replace(group[1],"");}
return stack.trim();},join_pdfs:async function(pdfs,loop_fn=null,win=null){const _win=win||window;if(!_win.PDFLib){await this.load_web_script(this.PDF_LIB_URL);}
const combined=await PDFLib.PDFDocument.create();for(const[i,buffer]of this.enumerate(pdfs)){const pdf=await PDFLib.PDFDocument.load(buffer);const pages=await combined.copyPages(pdf,pdf.getPageIndices());for(const page of pages){combined.addPage(page);}
if(loop_fn){loop_fn();}else{this.update_popup(`已经合并 ${i + 1} 组`);}}
return await combined.save();},raise_for_status(response){if(!response.ok){throw new Error(`Fetch Error with status code: ${response.status}`);}},crc32:base.makeCRC32(),help:function(fn,print=true){if(!(fn instanceof Function))
throw new Error(`fn must be a function`);const
_fn=fn.__func__||fn,ARROW_ARG=/^([^(]+?)=>/,FN_ARGS=/^[^(]*\(\s*([^)]*)\)/m,STRIP_COMMENTS=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,fn_text=Function.prototype.toString.call(_fn).replace(STRIP_COMMENTS,''),args=fn_text.match(ARROW_ARG)||fn_text.match(FN_ARGS),doc=fn.__doc__?fn.__doc__:args[0];if(!print)return base.stripBlanks(doc);const color=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);console.log("%c"+doc,`color: ${color}; font: small italic`);},hex_bytes:function(arr){return Array.from(arr).map(byte=>byte.toString(16).padStart(2,"0")).join("");},classof:function(obj){return Object.prototype.toString.call(obj).slice(8,-1);},emphasize_text:function(elem){const rand=Math.random;elem.style.cssText=`
            font-weight: ${200 + parseInt(700 * rand())};
            font-size: ${(1 + rand()).toFixed(1)}em;
            color: hsl(${parseInt(360 * rand())}, ${parseInt(40 + 60 * rand())}%, ${parseInt(60 * rand())}%);
            background-color: yellow;`;},until_stop:async function(elem,timeout=2000){let observer;const timeout_promise=new Promise((_,reject)=>{setTimeout(()=>{observer.disconnect();const error=new Error(`Timeout Error occured on listening DOM mutation (max ${timeout}ms)`,{cause:elem});reject(error);},timeout);});return Promise.race([new Promise(resolve=>{observer=new MutationObserver((_,observer)=>{observer.disconnect();resolve(observer);});observer.observe(elem,{subtree:true,childList:true,attributes:true});}),timeout_promise,]).catch(error=>{if(`${error}`.includes("Timeout Error")){return observer;}
console.error(error);throw error;});},kmp_matching:function(arr,sub_arr){let prefixes=base.longest_prefix(sub_arr);let matches=[];let j=0;let i=0;while(i<arr.length){if(arr[i]===sub_arr[j]){i++;j++;}
if(j===sub_arr.length){matches.push(i-j);j=prefixes[j-1];}
else if(arr[i]!==sub_arr[j]){if(j!==0){j=prefixes[j-1];}else{i++;}}}
return matches;},split_files_by_head:function(bytes,head=null){const sub=bytes.subarray||bytes.slice;head=head||sub.call(bytes,0,8);const indexes=this.kmp_matching(bytes,head);const size=indexes.length;indexes.push(bytes.length);const parts=new Array(size);for(let i=0;i<size;i++){parts[i]=sub.call(bytes,indexes[i],indexes[i+1]);}
return parts;},once:function(fn){let used=false;return function(){if(!used){used=true;return fn();}}},enumerate:function*(iterable){let i=0;for(let value of iterable){yield[i,value];i++;}},zip:function*(...iterables){let iterators=iterables.map(iterable=>iterable[Symbol.iterator]());while(true){const[done,values]=base.getAllValus(iterators);if(done){return;}
if(values.length===1){yield values[0];}else{yield values;}}},range:function*(end,end2=null,step=1){if(step===0){throw new RangeError("step can't be zero");}
const len=end2-end;if(end2&&len&&step&&(len*step<0)){throw new RangeError(`[${end}, ${end2}) with step ${step} is invalid`);}
end2=end2===null?0:end2;let[small,big]=[end,end2].sort((a,b)=>a-b);if(step>0){for(let i=small;i<big;i+=step){yield i;}}else{for(let i=big;i>small;i+=step){yield i;}}},get_all_styles:function(){let styles=[];for(let sheet of document.styleSheets){let rules;try{rules=sheet.cssRules;}catch(e){if(!(e instanceof DOMException)){console.error(e);}
continue;}
for(let rule of rules){styles.push(rule.cssText);}}
return styles.join("\n\n");},copy_text:function(text){console.log(text.length>20?text.slice(0,21)+"...":text);if(!navigator.clipboard){base.oldCopy(text);return;}
navigator.clipboard.writeText(text).catch(_=>base.oldCopy(text));},copy:async function(blob){const data=[new ClipboardItem({[blob.type]:blob})];try{await navigator.clipboard.write(data);console.log(`${blob.type} 成功复制到剪贴板`);}catch(err){console.error(err.name,err.message);}},save:function(file_name,content,type=""){if(!type&&(content instanceof Blob)){type=content.type;}
let blob=null;if(content instanceof Array){blob=new Blob(content,{type});}else{blob=new Blob([content],{type});}
const size=parseInt((blob.size/1024).toFixed(0)).toLocaleString();console.log(`blob saved, size: ${size} KB, type: ${blob.type}`,blob);const url=URL.createObjectURL(blob);const a=document.createElement("a");a.download=file_name||"未命名文件";a.href=url;a.click();URL.revokeObjectURL(url);},toggle_box:function(){let sec=wk$(".wk-box")[0];if(sec.style.display==="none"){sec.style.display="block";return;}
sec.style.display="none";},sleep:async function(delay,max_delay=null){max_delay=max_delay===null?delay:max_delay;delay=delay+(max_delay-delay)*Math.random();return new Promise(resolve=>setTimeout(resolve,delay));},allow_print:function(){const style=document.createElement("style");style.innerHTML=`
            @media print {
                body { display: block; }
            }`;document.head.append(style);},get_param:function(key){return new URL(location.href).searchParams.get(key);},diff:function(main_set,cut_set){const _diff=new Set(main_set);for(let elem of cut_set){_diff.delete(elem);}
return _diff;},enhance_click:async function(i){let btn=this.btn(i);const style=btn.getAttribute("style")||"";btn.setAttribute("style",style+"color: black; font-weight: normal;");await utils.sleep(500);btn=this.btn(i);btn.setAttribute("style",style);},onclick:function(listener,i,new_text=null){const btn=this.btn(i);if(new_text){btn.textContent=new_text;}
async function wrapped_listener(event){const btn=event.target;const text=btn.textContent;btn.disabled=true;try{await listener.call(btn,event);}catch(err){console.error(err);}
btn.disabled=false;btn.textContent=text;}
btn.onclick=wrapped_listener;return wrapped_listener;},btn:function(i){return wk$(`.wk-box [class="btn-${i}"]`)[0];},force_hide:function(selector_or_elems){const cls="force-hide";const elems=selector_or_elems instanceof Array?selector_or_elems:wk$(selector_or_elems);elems.forEach(elem=>{elem.classList.add(cls);});let style=wk$(`style.${cls}`)[0];if(style){return;}
style=document.createElement("style");style.innerHTML=`style.${cls} {
            visibility: hidden !important;
            display: none !important;
        }`;document.head.append(style);},until_visible:async function(elem){let[max,i]=[25,0];let style=getComputedStyle(elem);while(i<=max&&(style.display==="none"||style.visibility!=="hidden")){i++;style=getComputedStyle(elem);await this.sleep(200);}
return elem;},wait_until:async function(isReady,timeout=5000){const gap=200;let chances=parseInt(timeout/gap);chances=chances<1?1:chances;while(!await isReady()){await this.sleep(200);chances-=1;if(!chances){break;}}},print_page:function(){this.toggle_box();setTimeout(window.print,500);setTimeout(this.toggle_box,1000);},toggle_btn:function(i){const btn=this.btn(i);const display=getComputedStyle(btn).display;if(display==="none"){btn.style.display="block";}else{btn.style.display="none";}
return btn;},to_page:function(input,page_num,type){input.value=`${page_num}`;const enter=new KeyboardEvent(type,{bubbles:true,cancelable:true,keyCode:13});input.dispatchEvent(enter);},is_same_origin:function(url){url=new URL(url);if(url.protocol==="data:"){return true;}
if(location.protocol===url.protocol&&location.host===url.host&&location.port===url.port){return true;}
return false;},open_in_new_tab:function(url,fname=""){const a=document.createElement("a");a.href=url;a.target="_blank";if(fname&&this.is_same_origin(url)){a.download=fname;}
a.click();},remove:function(elem_or_selector){try{const cls=this.classof(elem_or_selector);if(cls==="String"){wk$(elem_or_selector).forEach(elem=>elem.remove());}
else if(cls.endsWith("Element")){elem_or_selector.remove();}}catch(e){console.error(e);}},remove_multi:function(elements){for(const elem of elements){this.remove(elem);}},gather:async function(tasks){const results=await Promise.allSettled(tasks);const values=[];for(const result of results){if(result.status==="fulfilled"&&!([NaN,null,undefined].includes(result.value))){values.push(result.value);}}
return values;},elems_to_canvases:async function(elements){if(!globalThis.html2canvas){await this.load_web_script("https://cdn.staticfile.org/html2canvas/1.4.1/html2canvas.min.js");}
if(elements.length===0){throw new Error("htmlToCanvases 未得到任何html元素");}
return this.gather(elements.map(html2canvas));},elems_to_pdf:async function(elements,title="文档"){const canvases=await this.elems_to_canvases(elements);console.log("生成的canvas元素如下：");console.log(canvases);this.imgs_to_pdf(canvases,title);},xhr_get_blob:async function(url){const xhr=new XMLHttpRequest();xhr.open("GET",url);xhr.responseType="blob";return new Promise((resolve,reject)=>{xhr.onload=()=>{const code=xhr.status;if(code>=200&&code<=299){resolve(xhr.response);}
else{reject(new Error(`Network Error: ${code}`));}};xhr.send();});},load_web_script:async function(url){try{const resp=await fetch(url);const code=await resp.text();Function(code)();}catch(e){console.error(e);return new Promise(resolve=>{const script=document.createElement("script");script.src=url;script.onload=resolve;document.body.append(script);});}},b64_to_bytes:function(sBase64,nBlockSize=1){const
sB64Enc=sBase64.replace(/[^A-Za-z0-9\+\/]/g,""),nInLen=sB64Enc.length,nOutLen=nBlockSize?Math.ceil((nInLen*3+1>>>2)/nBlockSize)*nBlockSize:nInLen*3+1>>>2,aBytes=new Uint8Array(nOutLen);for(var nMod3,nMod4,nUint24=0,nOutIdx=0,nInIdx=0;nInIdx<nInLen;nInIdx++){nMod4=nInIdx&3;nUint24|=base.b64ToUint6(sB64Enc.charCodeAt(nInIdx))<<18-6*nMod4;if(nMod4===3||nInLen-nInIdx===1){for(nMod3=0;nMod3<3&&nOutIdx<nOutLen;nMod3++,nOutIdx++){aBytes[nOutIdx]=nUint24>>>(16>>>nMod3&24)&255;}
nUint24=0;}}
return aBytes;},canvas_to_blob:function(canvas,type="image/png"){return new Promise(resolve=>canvas.toBlob(resolve,type,1));},blobs_to_zip:async function(blobs,base_name,ext,zip_name,download=true){const zip=new window.JSZip();for(const[i,blob]of this.enumerate(blobs)){zip.file(`${base_name}-${i+1}.${ext}`,blob,{binary:true});}
if(!download){return zip;}
const zip_blob=await zip.generateAsync({type:"blob"});console.log(zip_blob);this.save(`${zip_name}.zip`,zip_blob);return null;},canvases_to_zip:async function(canvases,title){const tasks=[];for(let canvas of canvases){tasks.push(this.canvas_to_blob(canvas));}
const blobs=await this.gather(tasks);this.blobs_to_zip(blobs,"page","png",title);},imgs_to_pdf:async function(imgs,title,width=0,height=0,blob=false){imgs=Array.from(imgs);if(imgs.length===0){this.raise("没有任何图像用于合并为PDF");}
const first=imgs[0];if(!width&&!height){if(first instanceof Uint8Array){const cover=await createImageBitmap(new Blob([first]));[width,height]=[cover.width,cover.height];}else if(first instanceof HTMLCanvasElement||first instanceof HTMLImageElement){if(first.width&&parseInt(first.width)&&parseInt(first.height)){[width,height]=[first.width,first.height];}else{const
width_str=first.style.width.replace(/(px)|(rem)|(em)/,""),height_str=first.style.height.replace(/(px)|(rem)|(em)/,"");width=parseInt(width_str);height=parseInt(height_str);}}else{throw TypeError("不能处理的画布元素类型："+this.classof(first));}}
console.log(`canvas数据：宽: ${width}px，高: ${height}px`);const orientation=width>height?'l':'p';const pdf=new jspdf.jsPDF(orientation,'px',[height,width]);const last=imgs.pop();const self=this;imgs.forEach((canvas,i)=>{pdf.addImage(canvas,'png',0,0,width,height);pdf.addPage();self?.update_popup(`PDF 已经绘制 ${i + 1} 页`);});pdf.addImage(last,'png',0,0,width,height);if(blob){return pdf.output("blob");}
pdf.save(`${title}.pdf`);},bmp_to_canvas:function(bmp){const canvas=document.createElement("canvas");canvas.height=bmp.height;canvas.width=bmp.width;const ctx=canvas.getContext("bitmaprenderer");ctx.transferFromImageBitmap(bmp);return canvas;},save_urls:function(urls){const _urls=Array.from(urls).map((url)=>{const _url=url.trim();if(url.startsWith("//"))
return"https:"+_url;return _url;}).filter(url=>url);this.save("urls.csv",_urls.join("\n"),"text/csv");},img_blobs_to_pdf:async function(blobs,title="文档",filter=true,blob=false){let tasks=blobs;if(filter){tasks=blobs.filter(blob=>blob.type.startsWith("image/"));}
tasks=await this.gather(tasks.map(blob=>blob.arrayBuffer()));tasks=tasks.map(buffer=>new Uint8Array(buffer));return this.imgs_to_pdf(tasks,title,0,0,blob);},img_urls_to_pdf:async function(urls,title,min_num=0,clear=false,blobs=false){urls=urls[Symbol.iterator]();const first=urls.next().value;if(!this.is_same_origin(first)){console.info("URL 不符合同源策略；转为新标签页打开目标网站");this.open_in_new_tab((new URL(first)).origin);return;}
let tasks,img_blobs,i=3;do{i-=1;tasks=[this.xhr_get_blob(first)];for(const[j,url]of this.enumerate(urls)){tasks.push(this.xhr_get_blob(url));this.update_popup(`已经请求 ${j} 张图片`);}
img_blobs=(await this.gather(tasks)).filter(blob=>blob.type.startsWith("image/"));if(clear){console.clear();}
if(min_num&&img_blobs.length<min_num&&i){console.log(`打盹 2 秒`);await utils.sleep(2000);}else{break;}}while(true)
if(blobs)return img_blobs;await this.img_blobs_to_pdf(img_blobs,title,false);},count_sub_str:function(str,sub){return[...str.matchAll(sub)].length;},sec:function(){const sec=wk$(".wk-box .btns-sec")[0];if(!sec)throw new Error("wk 按钮区找不到");return sec;},_monkey:function(){const mky=wk$(".wk-box .wk-fold-btn")[0];if(!mky)throw new Error("wk 小猴子找不到");return mky;},fold_box:function(){const sec=this.sec();const mky=this._monkey();const display=getComputedStyle(sec).display;if(display!=="block")return false;[sec,mky].forEach(elem=>elem.classList.add("folded"));return true;},unfold_box:function(){const sec=this.sec();const mky=this._monkey();const display=getComputedStyle(sec).display;if(display==="block")return false;[sec,mky].forEach(elem=>elem.classList.remove("folded"));return true;},run_with_prog:async function(i,task){const btn=utils.btn(i);let new_btn;if(!wk$("#wk-popup")[0]){this.add_popup();}
this.fold_box();this.toID("wk-popup");new_btn=btn.cloneNode(true);btn.replaceWith(new_btn);this.onclick(()=>utils.toID("wk-popup"),i,"显示进度");try{await task();}catch(e){console.error(e);}
this.toID("");this.unfold_box();this.remove_popup();new_btn.replaceWith(btn);},create_btns:function(){document.head.insertAdjacentHTML("beforeend",style);document.body.insertAdjacentHTML("beforeend",box);const monkey=wk$(".wk-fold-btn")[0];monkey.onclick=()=>this.fold_box()||this.unfold_box();},add_popup:function(){document.body.insertAdjacentHTML("beforeend",popup);},update_popup:function(text){const body=wk$(".wk-popup-body")[0];if(!body)return;body.textContent=text;},remove_popup:function(){this.remove(wk$(".wk-popup-container")[0]);},toID:function(id){location.hash=`#${id}`;}};function ensure_script_existed(global_obj_name,cdn_url,func){async function inner(...args){if(!window[global_obj_name]){await utils.load_web_script(cdn_url);}
return func(...args);}
base.superAssign(inner,func);return inner;}
for(const prop of Object.keys(utils)){if(!(typeof utils[prop]==="function")&&!`${utils[prop]}`.startsWith("class")){continue;}
if(/ this[.[][a-z_]/.test(`${utils[prop]}`)){const doc=utils.help(utils[prop],false);const fn=utils[prop];utils[prop]=utils[prop].bind(utils);utils[prop].__func__=fn;utils[prop].__doc__=doc;}
const doc_box=[utils.help(utils[prop],false)];Object.defineProperty(utils[prop],"__doc__",{configurable:true,enumerable:true,get(){return doc_box.join("\n");},set(new_doc){doc_box.push(new_doc);},});let obj,url;const name=prop.toLowerCase();if(name.includes("_to_zip")){obj="JSZip";url="https://cdn.staticfile.org/jszip/3.7.1/jszip.min.js";}else if(name.includes("_to_pdf")){obj="jspdf";url="https://cdn.staticfile.org/jspdf/2.5.1/jspdf.umd.min.js";}else{continue;}
utils[prop]=ensure_script_existed(obj,url,utils[prop]);}
utils.b64_to_bytes.__doc__=`
/**
 * b64编码字符串转Uint8Array
 * @param {string} sBase64 b64编码的字符串
 * @param {number} nBlockSize 字节数
 * @returns {Uint8Array} arr
 */
`;utils.blobs_to_zip.__doc__=`
/**
 * 合并blobs到压缩包，然后下载
 * @param {Iterable<Blob>} blobs 
 * @param {string} base_name 文件名通用部分，如 image-1.jpg 中的 image
 * @param {string} ext 扩展名，如 jpg
 * @param {string} zip_name 压缩包名称
 */
`;utils.imgs_to_pdf.__doc__=`
/**
 * 合并图像并导出PDF
 * @param {Iterable<HTMLCanvasElement | Uint8Array | HTMLImageElement>} imgs 图像元素列表
 * @param {string} title 文档标题
 * @param {number} width (可选)页面宽度 默认 0
 * @param {number} height (可选)页面高度 默认 0
 * @param {boolean} blob (可选)是否返回 blob 默认 false
 */
`;utils.img_urls_to_pdf.__doc__=`
/**
 * 下载可以简单直接请求的图片，合并到 PDF 并导出
 * @param {Iterable<string>} urls 图片链接列表
 * @param {string} title 文档名称
 * @param {number} min_num 如果成功获取的图片数量 < min_num, 则等待 2 秒后重试; 默认 0 不重试
 * @param {boolean} clear 是否在请求完成后清理控制台输出，默认false
 */
`;utils.img_blobs_to_pdf.__doc__=`
/**
 * 图片blobs合并并导出为单个PDF
 * @param {Array<Blob>} blobs 
 * @param {string} title (可选)文档名称, 不含后缀, 默认为"文档"
 * @param {boolean} filter (可选)是否过滤 type 不以 "image/" 开头的 blob; 默认为 true
 * @param {boolean} blob (可选)是否返回 blob
 */
`;base.superAssign(wk$,utils);console.info("wk: `wk$` 已经挂载到全局");async function readAllDoc88(){let continue_btn=wk$("#continueButton")[0];if(continue_btn){let cur_page=wk$("#pageNumInput")[0];let page_max=cur_page.parentElement.textContent.replace(" / ","");utils.to_page(cur_page,page_max,"keypress");await utils.sleep(1000);utils.to_page(cur_page,"1","keypress");}
else{for(const i of utils.range(1,6)){utils.toggle_btn(i);}}}
async function hideSelectPopup(){const
elem=(await wk$$("#left-menu"))[0],hide=elem=>elem.style.zIndex=-1;return utils.until_visible(elem).then(hide);}
async function initService(){console.log("正在执行初始化任务");const prop=getCopyAPIValue();globalThis.doc88JS._apis=Object.getOwnPropertyNames(prop).filter(name=>{if(!name.startsWith("_")){return false;}
if(prop[name]===""){return true;}});await hideSelectPopup();}
function getCopyAPIValue(){let aim=globalThis;for(let name of globalThis.doc88JS.copy_api){aim=aim[name];}
return aim;}
function getSelectedText(){if(globalThis.doc88JS.copy_api.length===3){let prop=getCopyAPIValue();for(let name of globalThis.doc88JS._apis){let value=prop[name];if(typeof value==='string'&&value.length>0&&!value.match(/\d/)){globalThis.doc88JS.copy_api.push(name);break;}}}
return getCopyAPIValue();}
function copySelected(){if(getComputedStyle(wk$("#left-menu")[0]).display==="none"){console.log("尚未选中文字");return false;}
utils.copy_text(getSelectedText());return true;}
function onCtrlC(e){if(!(e.code==="KeyC"&&e.ctrlKey===true)){return;}
let now=Date.now();if(now-doc88JS.last_copy_time<500*1){doc88JS.last_copy_time=now;return;}
doc88JS.last_copy_time=now;copySelected();e.stopImmediatePropagation();e.stopPropagation();}
async function walkThrough$2(){let container=wk$("#pageContainer")[0];container.style.display="none";let page_num=wk$("#pageNumInput")[0];let tail=wk$("#readEndDiv > p")[0];let origin=tail.textContent;wk$('.btns_section > [class*="btn-"]').forEach(elem=>elem.style.display="none");let total=parseInt(Config.p_pagecount);try{for(let i=1;i<=total;i++){GotoPage(i);await utils.wait_until(async()=>{let page=wk$(`#page_${i}`)[0];if(!page){wk$("#ym-window .DOC88Window_close")[0].click();await utils.sleep(500);walkThrough$2();throw new Error("walkThrough 递归完成，终止函数");}
return page.width!==300;});utils.emphasize_text(page_num);tail.textContent=`请勿反复点击按钮，耐心等待页面渲染：${i}/${total}`;}}catch(e){console.log(e);return;}
container.style.display="";page_num.style="";tail.textContent=origin;wk$('.btns_section > [class*="btn-"]').forEach(elem=>elem.style.display="block");wk$(".btns_section > .btn-1")[0].style.display="none";}
async function doc88(){globalThis.doc88JS={last_copy_time:0,copy_api:["Core","Annotation","api"]};utils.create_btns();let prepare=function(){let node_list=wk$(".inner_page");let title;if(wk$(".doctopic h1")[0]){title=wk$(".doctopic h1")[0].title;}else{title="文档";}
return[node_list,title];};utils.onclick(readAllDoc88,1);utils.onclick(walkThrough$2,2,"加载所有页面");function imgsToPDF(){if(confirm("确定每页内容都加载完成了吗？")){utils.run_with_prog(3,()=>utils.imgs_to_pdf(...prepare()));}}utils.onclick(imgsToPDF,3,"导出图片到PDF");utils.onclick(()=>{if(confirm("确定每页内容都加载完成了吗？")){utils.canvases_to_zip(...prepare());}},4,"导出图片到ZIP");utils.onclick(btn=>{if(!copySelected()){btn.textContent="未选中文字";}else{btn.textContent="复制成功！";}},5,"复制选中文字");window.addEventListener("keydown",onCtrlC,true);window.addEventListener("mousedown",initService,{once:true,capture:true});}
function get_title$1(){return document.title.slice(0,-6);}
function save_canvases(type){return()=>{if(!wk$(".hkswf-content2 canvas").length){alert("当前页面不适用此按钮");return;}
if(confirm("页面加载完毕了吗？")){const title=get_title$1();const canvases=wk$(".hkswf-content2 canvas");let data_to;switch(type){case"pdf":data_to=utils.imgs_to_pdf;break;case"zip":data_to=utils.canvases_to_zip;break;default:data_to=()=>utils.raise(`未知 type: ${type}`);break;}
data_to(canvases,title);}}}
function get_base_url(){return`https://docimg1.docin.com/docinpic.jsp?`+
`file=`+location.pathname.match(/p-(\d+)[.]html/)[1]+
`&width=1000&sid=`+window.readerConfig.flash_param_hzq+
`&pcimg=1&pageno=`;}
function get_page_num(){return parseInt(wk$(".page_num")[0].textContent.slice(1));}
function init_save_imgs(){const iframe=document.createElement("iframe");iframe.src="https://docimg1.docin.com/?wk=true";iframe.style.display="none";let sock;function on_client_msg(event){if(event.data.author!=="wk"||event.data.action!=="finish")return;sock.notListen(on_client_msg);iframe.remove();utils.toggle_btn(1);utils.toggle_btn(3);}
return(type)=>{return async function(){if(!wk$("[id*=img_] img").length){alert("当前页面不适用此按钮");return;}
utils.toggle_btn(1);utils.toggle_btn(3);document.body.append(iframe);await utils.sleep(500);sock=new utils.Socket(iframe.contentWindow);await sock.connect(false);sock.listen(on_client_msg);sock.talk({author:"wk",type,title:get_title$1(),base_url:get_base_url(),max:get_page_num()});}}}
const save_imgs=init_save_imgs();async function walk_through(){utils.toggle_btn(5);wk$("#contentcontainer")[0].setAttribute("style","visibility: hidden;");const total=get_page_num();const input=wk$("#page_cur")[0];for(let i=1;i<=total;i++){utils.to_page(input,i,"keydown");await utils.wait_until(()=>{const page=wk$(`#page_${i}`)[0];const contents=wk$.call(page,`.canvas_loaded, img`);return contents.length>0;},5000);}
wk$("#contentcontainer")[0].removeAttribute("style");}
function main_page(){utils.create_btns();utils.onclick(save_imgs("pdf"),1,"合并图片为PDF");utils.onclick(save_canvases("pdf"),2,"合并画布为PDF");utils.toggle_btn(2);utils.onclick(save_imgs("zip"),3,"打包图片到ZIP");utils.toggle_btn(3);utils.onclick(save_canvases("zip"),4,"打包画布到ZIP");utils.toggle_btn(4);utils.onclick(walk_through,5,"自动浏览页面");utils.toggle_btn(5);}
function init_background(){const sock=new utils.Socket(window.top);async function on_server_msg(event){if(event.data.author!=="wk")return;const{title,base_url,max,type}=event.data;const urls=Array.from(utils.range(1,max+1)).map(i=>(base_url+i));const imgs=await utils.img_urls_to_pdf(urls,title,0,false,true);switch(type){case"pdf":await utils.img_blobs_to_pdf(imgs,title);break;case"zip":const ext=imgs[0].type?imgs[0].type.split("/")[1]:"png";await utils.blobs_to_zip(imgs,"page",ext,title);break;default:utils.raise(`未知 type: ${type}`);break;}
sock.talk({author:"wk",action:"finish"});sock.notListen(on_server_msg);}
return async function(){sock.listen(on_server_msg);await sock.connect(true);}}
const background=init_background();function docin(){const host=location.hostname;switch(host){case"jz.docin.com":case"www.docin.com":main_page();break;case"docimg1.docin.com":background();break;default:console.log(`未知域名: ${host}`);break;}}
function jumpToHost(){let url=wk$(".data-detail img, .data-detail embed")[0].src;if(!url){alert("找不到图片元素");return;}
let url_obj=new URL(url);let path=url_obj.pathname.slice(1);let query=url_obj.search.slice(1).split("&range")[0];let title=document.title.split(" - ")[0];let target=`${url_obj.protocol}//${url_obj.host}?path=${path}&fname=${title}&${query}`;globalThis.open(target,"hostage");}
function ishare(){utils.create_btns();utils.onclick(jumpToHost,1,"到下载页面");utils.onclick(()=>null,2,"不支持爱问办公");}
function _createDiv(data){let num=utils.count_sub_str(data,data.slice(0,10));let article=document.createElement("div");article.id="article";article.innerHTML=`
        <style class="wk-settings">
            body {
                margin: 0px;
                width: 100%;
                background-color: rgb(95,99,104);
            }
            #article {
                width: 100%;
                display: flex;
                flex-direction: row;
                justify-content: space-around;
            }
            #root-box {
                display: flex;
                flex-direction: column;
                background-color: white;
                padding: 0 2em;
            }
            .gap {
                height: 50px;
                width: 100%;
                background-color: transparent;
            }
        </style>
        <div id="root-box">
        ${
            `<object class="svg-box"></object><div class="gap"></div>`.repeat(num)
        }
    `;Array.from(article.querySelectorAll(".gap")).at(-1).remove();return article;}
function setGap(height){let style=wk$(".wk-settings")[0].innerHTML;wk$(".wk-settings")[0].innerHTML=style.replace(/[.]gap.*?{.*?height:.+?;/s,`.gap { height: ${parseInt(height)}px;`);}
function setGapGUI(){let now=getComputedStyle(wk$(".gap")[0]).height;let new_h=prompt(`当前间距：${now}\n请输入新间距：`);if(new_h){setGap(new_h);}}
function getSVGtext(data){let div=document.createElement("div");div.innerHTML=data;return div.textContent;}
function toDisplayMode1(){let content=globalThis["ishareJS"].content_1;if(!content){content=globalThis["ishareJS"].text.replace(/\n{2,}/g,"<hr>").replace(/\n/g,"<br>").replace(/\s/g,"&nbsp;").replace(/([a-z])([A-Z])/g,"$1 $2");globalThis["ishareJS"].content_1=content;}
wk$("#root-box")[0].innerHTML=content;}
function toDisplayMode2(){let content=globalThis["ishareJS"].content_2;if(!content){content=globalThis["ishareJS"].text.replace(/\n{2,}/g,"<hr>").replace(/\n/g,"").replace(/\s/g,"&nbsp;").replace(/([a-z])([A-Z])/g,"$1 $2").split("<hr>").map(paragraph=>`<p>${paragraph}</p>`).join("");globalThis["ishareJS"].content_2=content;wk$(".wk-settings")[0].innerHTML+=`
            #root-box > p {
                text-indent: 2em;
                width: 40em;
                word-break: break-word;
            }
        `;}
wk$("#root-box")[0].innerHTML=content;}
function changeDisplayModeWrapper(){let flag=true;function inner(){if(flag){toDisplayMode1();}else{toDisplayMode2();}
flag=!flag;}
return inner;}
function handleSVGtext(){globalThis["ishareJS"].text=getSVGtext(globalThis["ishareJS"].data);let change=changeDisplayModeWrapper();utils.onclick(change,4,"切换显示模式");utils.toggle_btn(2);utils.toggle_btn(3);utils.toggle_btn(4);change();}
async function handleSVGurl(svg_url){let resp=await fetch(svg_url);let data=await resp.text();globalThis["ishareJS"].data=data;let sep=data.slice(0,10);let svg_texts=data.split(sep).slice(1).map(svg_text=>sep+svg_text);console.log(`共 ${svg_texts.length} 张图片`);let article=_createDiv(data);let boxes=article.querySelectorAll(".svg-box");boxes.forEach((obj,i)=>{let blob=new Blob([svg_texts[i]],{type:"image/svg+xml"});let url=URL.createObjectURL(blob);obj.data=url;URL.revokeObjectURL(blob);});let body=wk$("body")[0];body.innerHTML="";body.appendChild(article);utils.create_btns();utils.onclick(utils.print_page,1,"打印页面到PDF");utils.onclick(setGapGUI,2,"重设页间距");utils.onclick(handleSVGtext,3,"显示空白点我");utils.toggle_btn(2);utils.toggle_btn(3);}
function getImgUrl(fname,path){if(!fname){throw new Error("URL Param `fname` does not exist.");}
return location.href.replace(/[?].+?&ssig/,"?ssig").replace("?",path+"?");}
async function getData(img_url){let resp=await fetch(img_url);let buffer=await resp.arrayBuffer();return new Uint8Array(buffer);}
function parseData(data){let head=data.slice(0,8);return utils.split_files_by_head(data,head);}
async function imgDataArrsToPDF(fname,img_data_list){return utils.imgs_to_pdf(img_data_list,fname);}
async function saveAsZip(fname,img_data_list){await utils.blobs_to_zip(img_data_list,"page","png",fname);}
async function getImgs(){let[fname,path]=[window.ishareJS.fname,window.ishareJS.path];let img_url=getImgUrl(fname,path);if(path.includes(".svg")){document.title=fname;await handleSVGurl(img_url);return;}
let data=await getData(img_url);let img_data_list=parseData(data);console.log(`共 ${img_data_list.length} 张图片`);window.ishareJS.imgs=img_data_list;utils.onclick(exportPDF$3,2,"下载并导出PDF");utils.toggle_btn(1);utils.toggle_btn(2);}
async function exportPDF$3(){let args=[window.ishareJS.fname,window.ishareJS.imgs];try{await imgDataArrsToPDF(...args);}catch(e){console.error(e);if(`${e}`.includes("RangeError: Invalid string length")){alert("图片合并为 PDF 时失败，请尝试下载图片压缩包");utils.onclick(()=>saveAsZip(...args),3,"导出ZIP");utils.toggle_btn(3);utils.toggle_btn(2);}else{throw e;}}}
function showHints(){wk$("h1")[0].textContent="wk 温馨提示";wk$("p")[0].innerHTML=["下载 270 页的 PPT (70 MB) 需要约 30 秒","请耐心等待，无需反复点击按钮","如果很久没反应，请加 QQ 群反馈问题"].join("<br>");wk$("hr")[0].nextSibling.textContent="403 Page Hostaged By Wenku Doc Downloader";}
async function ishareData(){globalThis["ishareJS"]={data:"",imgs:[],text:"",content_1:"",content_2:"",fname:utils.get_param("fname"),path:utils.get_param("path")};showHints();utils.create_btns();utils.onclick(getImgs,1,"下载数据");}
function showTips$1(){const h2=document.createElement("h2");h2.id="wk-tips";document.body.append(h2);}
function update(text){wk$("#wk-tips")[0].textContent=text;}
function mainTask(){const sock=new utils.Socket(opener);sock.listen(async e=>{if(e.data.wk&&e.data.action){update("图片下载中，请耐心等待...");const url=e.data.img_url;const resp=await fetch(url);update("图片下载完成，正在解析...");const buffer=await resp.arrayBuffer();const whole_data=new Uint8Array(buffer);update("图片解析完成，正在合并...");await utils.imgs_to_pdf(utils.split_files_by_head(whole_data),e.data.title);update("图片合并完成，正在导出 PDF...");}});sock.connect(true);}
function ishareData2(){showTips$1();if(!(window.opener&&window.opener.window)){update("wk: 抱歉，页面出错了");return;}
mainTask();}
function getPageNum(){return parseInt(wk$("span.counts")[0].textContent.split("/")[1]);}
function jumpToHostage(){const
url=new URL(wk$("#pageflash_1 > img")[0].src),num=getPageNum(),fname=document.title.slice(0,-5),path=url.pathname,tail="1.gif";if(!path.endsWith(tail)){throw new Error(`url尾部不为【${tail}】！path：【${path}】`);}
const base_path=path.slice(0,-5);open(`${url.protocol}//${url.host}/?num=${num}&lmt=${lmt}&fname=${fname}&path=${base_path}`);}
function deliwenku(){utils.create_btns();utils.onclick(jumpToHostage,1,"到下载页面");}
function showTips(){const body=`
        <style>
            h1 { color: black; } 
            #main {
                margin: 1vw 5%;
                border-radius: 10%;
            }
            p { font-size: large; }
            .info {
                color: rgb(230,214,110);
                background: rgb(39,40,34);
                text-align: right;
                font-size: medium;
                padding: 1vw;
                border-radius: 4px;
            }
        </style>
        <div id="main">
            <h1>wk: 跳板页面</h1>
            <p>有时候点一次下载等半天没反应，就再试一次</p>
            <p>如果试了 2 次还不行加 QQ 群反馈吧...</p>
            <p>导出的 PDF 如果页面数量少于应有的，那么意味着免费页数就这么多，我也爱莫能助</p>
            <p>短时间连续使用导出按钮会导致 IP 被封禁</p>
            <hr>
            <div class="info">
                文档名称：${deliJS.fname}<br>
                原始文档页数：${deliJS.num}<br>
                最大免费页数：${deliJS.lmt}<br>
            </div>
        </div>`;document.title=utils.get_param("fname");document.body.innerHTML=body;}
function*genURLs(base_url,num){for(let i=1;i<=num;i++){yield`${base_url}${i}.gif`;}}
function genBaseURL(path){return`${location.protocol}//${location.host}${path}`;}
function parseParamsToDeliJS(){const
base_url=genBaseURL(utils.get_param("path")),fname=utils.get_param("fname"),num=parseInt(utils.get_param("num"));let lmt=parseInt(utils.get_param("lmt"));lmt=lmt>3?lmt:20;lmt=lmt>num?num:lmt;window.deliJS={base_url,num,fname,lmt};}
async function exportPDF$2(){utils.toggle_btn(1);await utils.run_with_prog(1,()=>utils.img_urls_to_pdf(genURLs(deliJS.base_url,deliJS.num),deliJS.fname,deliJS.lmt,true));utils.toggle_btn(1);}
async function deliFile(){parseParamsToDeliJS();showTips();utils.create_btns();utils.onclick(exportPDF$2,1,"导出PDF");}
function readAll360Doc(){document.querySelector(".article_showall a").click();utils.toggle_btn(1);utils.toggle_btn(2);utils.toggle_btn(3);utils.toggle_btn(4);}
function saveText_360Doc(){let images=wk$("#artContent img");let content=[];for(let i=0;i<images.length;i++){let src=images[i].src;content.push(`图${i+1}，链接：${src}`);}
let text=wk$("#artContent")[0].textContent;content.push(text);let title=wk$("#titiletext")[0].textContent;utils.save(`${title}.txt`,content.join("\n"));}
function centre(selector,default_offset){const elem=wk$(selector)[0];const offset=prompt("请输入偏移百分位:",default_offset);if(offset.length===1&&offset.search(/[0-9]/)!==-1){elem.style.marginLeft=offset+"%";return true;}
if(offset.length===2&&offset.search(/[1-5][0-9]/)!==-1){elem.style.marginLeft=offset+"%";return true;}
alert("请输入一个正整数，范围在0至59之间，用来使文档居中");return false;}
function printPage360Doc(){if(!confirm("确定每页内容都加载完成了吗？")){return;}
let selector=".fontsize_bgcolor_controler, .atfixednav, .header, .a_right, .article_data, .prev_next, .str_border, .youlike, .new_plbox, .str_border, .ul-similar, #goTop2, #divtort, #divresaveunder, .bottom_controler, .floatqrcode";let elem_list=wk$(selector);let under_doc_1,under_doc_2;try{under_doc_1=wk$("#bgchange p.clearboth")[0].nextElementSibling;under_doc_2=wk$("#bgchange")[0].nextElementSibling.nextElementSibling;}catch(e){}
for(let elem of elem_list){utils.remove(elem);}
utils.remove(under_doc_1);utils.remove(under_doc_2);wk$("a[title]")[0].style.display="none";alert("建议使用:\n偏移量: 20\n缩放: 默认\n");if(!centre(".a_left","20")){return;}
utils.print_page();}
function stopSpread(e){e.stopImmediatePropagation();e.stopPropagation();}
function stopCapturing(){["click","mouseup"].forEach(type=>{document.body.addEventListener(type,stopSpread,true);document["on"+type]=undefined;});["keypress","keydown"].forEach(type=>{window.addEventListener(type,stopSpread,true);window["on"+type]=undefined;});}
function resetImg(doc=document){wk$.call(doc,"img").forEach(elem=>{elem.style.maxWidth="100%";for(let attr of elem.attributes){if(attr.name.endsWith("-src")){elem.setAttribute("src",attr.value);break;}}});}
function getFullScreen(){FullScreenObj.init();wk$("#artContent > p:nth-child(3)")[0]?.remove();let data=wk$("#artfullscreen__box_scr > table")[0].outerHTML;window.doc360JS={data};let html_str=`
        <html><head></head><body style="display: flex; flex-direction: row; justify-content: space-around">
            ${data}
        </body><html>
    `;wk$("html")[0].replaceWith(wk$("html")[0].cloneNode());wk$("html")[0].innerHTML=html_str;resetImg();}
function cleanPage(){getFullScreen();stopCapturing();}
function doc360(){utils.create_btns();utils.onclick(readAll360Doc,1);utils.onclick(saveText_360Doc,2,"导出纯文本");utils.onclick(printPage360Doc,3,"打印页面到PDF");utils.onclick(cleanPage,4,"清理页面(推荐)");}
async function getPDF(){if(!window.DEFAULT_URL){alert("当前文档无法解析，请加 QQ 群反馈");return;}
let title=document.title.split(" - ")[0]+".pdf";let blob=await utils.xhr_get_blob(DEFAULT_URL);utils.save(title,blob);}
function mbalib(){utils.create_btns();utils.onclick(getPDF,1,"下载PDF");}
function isInPreview(){let p_elem=wk$("#preview_tips")[0];if(p_elem&&p_elem.style&&p_elem.style.display==="none"){return true;}
return false;}
async function ensureInPreview(){while(!isInPreview()){if(typeof window.preview!=="function"){alert("脚本失效，请加 QQ 群反馈");throw new Error("preview 全局函数不存在");}
await utils.sleep(500);preview();}}
function toPage(page_num){try{Viewer._GotoPage(page_num);}catch(e){console.error(e);utils.to_page(wk$("#pageNumInput")[0],page_num,"keydown");}}
async function walkThrough$1(){wk$("#pageContainer")[0].style.display="none";let lmt=window.dugenJS.lmt;for(let i of utils.range(1,lmt+1)){toPage(i);await utils.wait_until(()=>wk$(`#outer_page_${i}`)[0].style.width.endsWith("px"));}
wk$("#pageContainer")[0].style.display="";console.log(`共 ${lmt} 页加载完毕`);}
function getNotloadedPages(){let pages=document.querySelectorAll("[id*=pageflash_]");let loaded=new Set();pages.forEach((page)=>{let id=page.id.split("_")[1];id=parseInt(id);loaded.add(id);});let not_loaded=[];for(let i of utils.range(1,window.dugenJS.lmt+1)){if(!loaded.has(i)){not_loaded.push(i);}}
return not_loaded;}
function getImgUrls(){let pages=wk$("[id*=pageflash_]");if(pages.length<window.dugenJS.lmt){let hints=["尚未加载完全部页面","以下页面需要浏览并加载：",getNotloadedPages().join(",")];alert(hints.join("\n"));return[false,[]];}
return[true,pages.map(page=>page.querySelector("img").src)];}
function exportImgUrls(){let[ok,urls]=getImgUrls();if(!ok){return;}
utils.save("urls.csv",urls.join("\n"));}
function exportPDF$1(){let[ok,urls]=getImgUrls();if(!ok){return;}
let title=document.title.split("－")[0];return utils.run_with_prog(3,()=>utils.img_urls_to_pdf(urls,title));}
async function dugen(){await ensureInPreview();window.dugenJS={lmt:window.lmt?window.lmt:20};utils.create_btns();utils.onclick(walkThrough$1,1,"加载可预览页面");utils.onclick(exportImgUrls,2,"导出图片链接");utils.toggle_btn(2);utils.onclick(exportPDF$1,3,"导出PDF");utils.toggle_btn(3);}
const img_tasks=[];function getDocType(){const
elem=wk$(".title .icon.icon-format")[0],cls=elem.classList[2];return cls.split("-")[2];}
function isTypeof(type_list){const type=getDocType();if(type_list.includes(type)){return true;}
return false;}
function is_ppt(){return isTypeof(["ppt","pptx"]);}
function is_excel(){return isTypeof(["xls","xlsm","xlsx"]);}
function getNotLoaded(){const loaded=wk$("[data-id] img[src]").map(img=>parseInt(img.closest("[data-id]").getAttribute("data-id")));return Array.from(utils.diff(utils.range(1,window.book118JS.page_counts+1),loaded));}
function getUrls(){const urls=wk$("[data-id] img[src]").map(img=>img.src);if(urls.length===book118JS.page_counts){return[true,urls,[]];}
return[false,urls,getNotLoaded()];}
async function walkThrough(){utils.toggle_box();const{preview:all}=preview.getPage();for(let i=1;i<=all;i++){preview.jump(i);await utils.wait_until(()=>wk$(`[data-id="${i}"] img`)[0].src,1000);}
console.log("遍历完成");utils.toggle_box();}
function wantUrls(){let[flag,urls,escaped]=getUrls();if(!flag){const hint=["仍有页面没有加载","请浏览并加载如下页面","是否继续导出图片链接？","["+escaped.join(",")+"]"].join("\n");if(!confirm(hint)){return}}
utils.save("urls.csv",urls.join("\n"));}
async function open_iframe(){wk$(".front a")[0].click();const iframes=await wk$$("iframe.preview-iframe");window.open(iframes[0].src);}
function getPageCounts$1(){return window?.preview?.getPage()?.preview||NaN;}
async function common_doc(){await utils.wait_until(()=>!!wk$(".counts")[0]);window.book118JS={doc_type:getDocType(),page_counts:getPageCounts$1()};utils.create_btns();utils.onclick(walkThrough,1,"加载全文");utils.onclick(wantUrls,2,"导出图片链接");utils.toggle_btn(2);}
function table_to_tsv(){return wk$("table").map(table=>{const len=table.rows.length;if(len>1000||len===1){return"";}
return[...table.rows].map(row=>{return[...row.cells].map(cell=>{const img=cell.querySelector("img");if(img){return img.src;}
return cell.textContent.trim().replace(/\n/g,"  ").replace(/\t/g,"    ");}).join("\t");}).join("\n").trim();}).join("\n\n---\n\n");}
function wantEXCEL(){const tsv=table_to_tsv();const bytes=utils.encode_to_gbk(tsv);const fname="原创力表格.tsv";utils.save(fname,bytes);}
function help$1(){const hint=["【导出表格到TSV】只能导出当前 sheet","如果有多张 sheet 请在每个 sheet 上用按钮分别导出 TSV","TSV 文件请用记事本或 Excel 打开","TSV 不能存储图片，所以用图片链接代替","或使用此脚本复制表格到剪贴板：","https://greasyfork.org/zh-CN/scripts/469550",];alert(hint.join("\n"));}
function excel(){utils.create_btns();utils.onclick(wantEXCEL,1,"导出表格到TSV");utils.onclick(help$1,2,"使用说明");utils.toggle_btn(2);}
function cur_page_num(){return parseInt(wk$("#PageIndex")[0].textContent);}
function add_page(){const view=wk$("#view")[0];view.setAttribute("style","");const i=cur_page_num()-1;const cur_view=wk$(`#view${i}`)[0];img_tasks.push(html2canvas(cur_view));utils.btn(1).textContent=`截图: ${img_tasks.length}`;}
function reset_tasks(){img_tasks.splice(0);utils.btn(1).textContent=`截图: 0`;}
function canvas_to_blob(canvas){return utils.canvas_to_blob(canvas);}
async function export_imgs_as_pdf(){alert("正在合并截图，请耐心等待");utils.toggle_btn(3);try{const imgs=await utils.gather(img_tasks);const blobs=await utils.gather(imgs.map(canvas_to_blob));if(!blobs.length){alert("你尚未截取任何页面！");}else{await utils.img_blobs_to_pdf(blobs,"原创力幻灯片");}}catch(err){console.error(err);}
utils.toggle_btn(3);}
function ppt(){utils.create_btns();const btn1=utils.btn(1);btn1.onclick=add_page;btn1.textContent="截图当前页面";utils.onclick(reset_tasks,2,"清空截图");utils.onclick(export_imgs_as_pdf,3,"合并为PDF");utils.toggle_btn(2);utils.toggle_btn(3);}
function book118(){const host=window.location.hostname;if(host==='max.book118.com'){if(is_excel()){utils.create_btns();utils.onclick(open_iframe,1,"访问EXCEL");}else if(is_ppt()){utils.create_btns();utils.onclick(open_iframe,1,"访问PPT");}else{common_doc();}}else if(wk$("#ppt")[0]){if(window.top!==window)return;ppt();}else if(wk$(`[src*="excel.min.js"]`)[0]){excel();}else{console.log(`wk: Unknown host: ${host}`);}}
async function blankBMP(){let canvas=document.createElement("canvas");[canvas.width,canvas.height]=[0,0];return createImageBitmap(canvas);}
async function respToPage(page_url,pms_or_bmp){let center=globalThis.gb688JS;if(pms_or_bmp instanceof ImageBitmap){return pms_or_bmp;}
if(!center.pages_status.get(page_url)){center.pages_status.set(page_url,1);let resp;try{resp=await pms_or_bmp;}catch(err){console.log("下载页面失败");console.error(err);return blankBMP();}
let page_blob=await resp.blob();let page=await createImageBitmap(page_blob);center.pages.set(page_url,page);center.pages_status.set(page_url,0);return page;}
while(center.pages_status.get(page_url)){await utils.sleep(500);}
return center.pages.get(page_url);}
async function getPage(page_url){let pages=globalThis.gb688JS.pages;if(pages.has(page_url)){return respToPage(page_url,pages.get(page_url));}
let resp=fetch(page_url,{"headers":{"accept":"image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8","accept-language":"zh-CN,zh;q=0.9,en;q=0.8","proxy-connection":"keep-alive"},"referrer":location.href,"referrerPolicy":"strict-origin-when-cross-origin","body":null,"method":"GET","mode":"cors","credentials":"include"});pages.set(page_url,resp);return respToPage(page_url,resp);}
function getPostions(page_div){let positions=[];Array.from(page_div.children).forEach(span=>{let paste_pos=span.className.split("-").slice(1).map(v=>parseInt(v)/10);let cut_pos=span.style.backgroundPosition.split(" ").map(v=>Math.abs(parseInt(v)));positions.push([...cut_pos,...paste_pos]);});return positions;}
function getPageURL(page_div){let path=location.pathname.split("/").slice(0,-1).join("/");let prefix=location.origin+path+"/";let url=page_div.getAttribute("bg");if(!url){url=page_div.children[0].style.backgroundImage.split('"')[1];}
return prefix+url;}
async function getAndDrawPage(i,page_div){let url=getPageURL(page_div);let page=await getPage(url);const[page_w,page_h]=[parseInt(page_div.style.width),parseInt(page_div.style.height)];let bg=document.createElement("canvas");bg.width=page_w;bg.height=page_h;let bg_ctx=bg.getContext("2d");bg_ctx.fillStyle="white";bg_ctx.fillRect(0,0,page_w,page_h);const[part_w,part_h]=[page_w/10,page_h/10];getPostions(page_div).forEach(pos=>{bg_ctx.drawImage(page,pos[0],pos[1],part_w,part_h,pos[2]*page_w,pos[3]*page_h,part_w,part_h);});return[i,bg];}
async function turnPagesToPDF(){const tasks=wk$("#viewer .page").map((page_div,i)=>getAndDrawPage(i,page_div));const results=await utils.gather(tasks);results.sort((prev,next)=>prev[0]-next[0]);return utils.imgs_to_pdf(results.map(item=>item[1]),document.title.split("|")[1]);}
function hintThenDownload$1(){let page_num=parseInt(wk$("#numPages")[0].textContent.slice(1));let estimate=Math.ceil(page_num/3);alert(`页数: ${page_num}，预计花费: ${estimate}秒；如遇网络异常可能更久\n请勿反复点击按钮；如果无法导出请 QQ 群反馈`);turnPagesToPDF();}
async function gb688(){globalThis.gb688JS={pages:new Map(),pages_status:new Map()};utils.create_btns();utils.onclick(hintThenDownload$1,1,"导出PDF");}
function getPageCounts(){const counts_str=wk$(".counts")[0].textContent.split("/")[1];const counts=parseInt(counts_str);return counts>20?20:counts;}
function getImgBaseURL(){return wk$("#dp")[0].value;}
function*genImgURLs$1(){let counts=getPageCounts();let base_url=getImgBaseURL();for(let i=1;i<=counts;i++){yield base_url+`${i}.gif`;}}
function fetchThenExportPDF(){let title=document.title.split("_")[0];return utils.img_urls_to_pdf(genImgURLs$1(),title);}
function hintThenDownload(){let hint=["只能导出可预览的页面(最多20页)","请勿短时间反复点击按钮，导出用时大约不到 10 秒","点完后很久没动静请至 QQ 群反馈"];alert(hint.join("\n"));return utils.run_with_prog(1,fetchThenExportPDF);}
async function safewk(){utils.create_btns();utils.onclick(hintThenDownload,1,"导出PDF");}
function _to_page(num){if(window.WebPreview&&WebPreview.Page&&WebPreview.Page.jump){WebPreview.Page.jump(parseInt(num));}else{console.error("window.WebPreview.Page.jump doesn't exist");}}
function to_page(){let num=prompt("请输入要跳转的页码")?.trim();if(/^[0-9]+$/.test(num)){_to_page(num);}else{console.log(`输入值 [${num}] 不是合法整数`);}}
function capture_urls(){if(!confirm("只能导出已经预览页面的链接，是否继续？"))return;let imgs=wk$("[data-id] img");if(imgs.length===0){imgs=wk$("img[data-page]");}
console.log(imgs);const urls=imgs.map(img=>{const src=img.dataset.src||img.src;if(!src)return;return src.startsWith("//")?"https:"+src:src});const lacked=[];const existed=urls.filter((url,i)=>{if(url)return true;lacked.push(i+1);});utils.save_urls(existed);alert(`已经浏览的页面中有 ${lacked.length} 页图片尚未加载，`+
`已经从结果中剔除。\n它们的页码是：\n${lacked}`);}
function*genImgURLs(){const params=window?.previewParams;if(!params)throw new Error("接口为空: window.previewParams");let i=-4;const
base="https://openapi.renrendoc.com/preview/getPreview?",query={temp_view:0,jsoncallback:"a",callback:"b",encrypt:params.encrypt,doc_id:params.doc_id,get _(){return Date.now()},get start(){return i+=5;},};while(true){const keys=Reflect.ownKeys(query);yield base+keys.map(key=>`${key}=${query[key]}`).join("&");}}
async function _fetch_preview_urls(){let
is_empty=true,switch_counts=0,previews=[];for(const[i,url]of utils.enumerate(genImgURLs())){const resp=await fetch(url);utils.raise_for_status(resp);const raw_data=await resp.text(),data=raw_data.slice(2,-1),img_urls=JSON.parse(data).data?.preview_list?.map(pair=>pair.url);if(!img_urls)break;previews=previews.concat(...img_urls);utils.update_popup(`已经请求 ${i + 1} 组图片链接`);if(is_empty!==(img_urls.length?false:true)){is_empty=!is_empty;switch_counts++;}
if(switch_counts===2)break;await utils.sleep(1000);}
const
params=window.previewParams,free=params.freepage||20,base=params.pre||wk$(".page img")[0].src.slice(0,-5),free_urls=Array.from(utils.range(1,free+1)).map(n=>`${base}${n}.gif`);const urls=free_urls.concat(...previews);utils.save_urls(urls);}
function fetch_preview_urls(){return utils.run_with_prog(3,_fetch_preview_urls);}
function help(){alert("【捕获】和【请求】图片链接的区别：\n"+
" - 【捕获】是从当前已经加载的文档页中提取图片链接\n"+
" - 【请求】是使用官方接口直接下载图片链接\n"+
" - 【捕获】使用麻烦，但是稳定\n"+
" - 【请求】使用简单，速度快，但可能失效");}
async function renrendoc(){utils.create_btns();utils.onclick(to_page,1,"跳转到页码");utils.onclick(capture_urls,2,"捕获图片链接");utils.onclick(fetch_preview_urls,3,"请求图片链接");utils.onclick(help,4,"使用说明");utils.toggle_btn(2);utils.toggle_btn(3);utils.toggle_btn(4);}
function get_img_urls(){const src=wk$("#page1 img")[0]?.src;if(src){const path=src.split("?")[0].split("/").slice(3,-1).join("/");const origin=new URL(location.href).origin;const urls=window.htmlConfig.fliphtml5_pages.map(obj=>{const fname=obj.n[0].split("?")[0].split("/").at(-1);return`${origin}/${path}/${fname}`;});const unique=[...new Set(urls)];window.img_urls=unique;return unique;}
const relative_path=wk$(".side-image img")[0].getAttribute("src").split("?")[0];const relative_dir=relative_path.split("/").slice(0,-1).join("/")+"/";const base=location.href;const urls=window.htmlConfig.fliphtml5_pages.map(obj=>{const path=relative_dir+obj.n[0].split("?")[0];const url=new URL(path,base);return url.href.replace("/thumb/","/content-page/");});window.img_urls=urls;return urls;}
function imgs_to_pdf(){const urls=get_img_urls();const title=document.title;const task=()=>utils.img_urls_to_pdf(urls,title);utils.run_with_prog(1,task);alert("正在下载图片，请稍等，时长取决于图片数量\n"+
"如果导出的文档只有一页空白页，说明当前文档不适用");}
function describe_nums(nums){let result="";let start=nums[0];let end=nums[0];for(let i=1;i<nums.length;i++){if(nums[i]===end+1){end=nums[i];}else{if(start===end){result+=start+", ";}else{result+=start+" - "+end+", ";}
start=nums[i];end=nums[i];}}
if(start===end){result+=start;}else{result+=start+" - "+end;}
return result;}
function get_total(){const total=window?.bookConfig?.totalPageCount;if(total){return String(total);}
return wk$("#tfPageIndex input")[0].value.split("/")[1].trim();}
async function data_to_zip(pdfs_data){await utils.blobs_to_zip([],"empty","dat","empty",false);const page_nums=Object.keys(pdfs_data).map(index=>parseInt(index)+1);const len=page_nums.length;const pwds=new Array(len+1);pwds[0]="page-num,password";const zip=new window.JSZip();const total=get_total();const digits=total.length;for(let i=0;i<len;i++){const page_no=page_nums[i];const page_no_str=page_no.toString().padStart(digits,"0");pwds[i+1]=`${page_no_str},${pdfs_data[page_no - 1][1]}`;const blob=pdfs_data[page_no-1][0];zip.file(`page-${page_no_str}.pdf`,blob,{binary:true});}
console.log("zip:",zip);const pwds_blob=new Blob([pwds.join("\n")],{type:"text/plain"});zip.file(`密码本.txt`,pwds_blob,{binary:true});console.info("正在合成压缩包并导出，请耐心等待几分钟......");const zip_blob=await zip.generateAsync({type:"blob"});utils.save(`${document.title}.zip`,zip_blob,"application/zip");}
async function export_zip(event){if(!window.pdfs_data)utils.raise(`pdfs_data 不存在！`);const page_nums=Object.keys(pdfs_data).map(index=>parseInt(index)+1);const donwload=confirm(`已经捕获 ${page_nums.length} 个页面，是否导出？\n`+
`已捕获的页码：${describe_nums(page_nums)}\n`+
`(如果某页缺失可以先多向后翻几页，然后翻回来，来重新加载它)`);if(!donwload)return;const btn=event.target;btn.style.display="none";await data_to_zip(pdfs_data);btn.style.display="block";}
function steal_pdf_when_page_loaded(){window.pdfs_data=[];let page_no=NaN;const _start=PdfLoadingTask.prototype.start;wk$._start=_start;PdfLoadingTask.prototype.start=function(){page_no=this.index;if(!pdfs_data[page_no-1]){pdfs_data[page_no-1]=[];}
return _start.call(this);};const _get_blob=getBlob;wk$._get_blob=_get_blob;window.getBlob=async function(param){const result=await _get_blob.call(this,param);if(page_no>0){const resp=await fetch(result.url);const blob=await resp.blob();pdfs_data[page_no-1]=[blob,result.password];page_no=NaN;}
return result;};utils.onclick(export_zip,1,"导出PDF压缩包");}
async function url_to_item(url){const resp=await fetch(url);const buffer=await resp.arrayBuffer();const bytes=new Uint8Array(buffer);const len=bytes.length;window.downloaded_count++;window.downloaded_size+=len;console.log(`已经下载了 ${downloaded_count} 页，\n`+
`累计下载了 ${(downloaded_size / 1024 / 1024).toFixed(1)} MB`);const pwd=new Uint8Array(6);pwd.set(bytes.subarray(1080,1083));pwd.set(bytes.subarray(-1003,-1000),3);const pwd_str=new TextDecoder().decode(pwd);const pdf=bytes.subarray(1083,-1003);pdf.subarray(0,4000).forEach((byte,i)=>{pdf[i]=255-byte;});return[new Blob([pdf,pdf.subarray(4000)],{type:"application/pdf"}),pwd_str];}
async function donwload_zip(event){const btn=event.target;btn.style.display="none";window.downloaded_count=0;window.downloaded_size=0;const urls=get_img_urls().map(url=>url.replace("/thumb/","/content-page/"));const item_tasks=urls.map(url_to_item);const items=await utils.gather(item_tasks);await data_to_zip(items);btn.style.display="block";}
function judge_file_type(){const ext=window?.htmlConfig?.fliphtml5_pages[0]?.n[0]?.split("?")[0]?.split(".").at(-1);console.log("ext:",ext);if(["zip"].includes(ext)&&window?.PdfLoadingTask&&window?.getBlob){utils.onclick(steal_pdf_when_page_loaded,1,"开始捕获");utils.onclick(donwload_zip,2,"下载PDF压缩包");utils.toggle_btn(2);}
else if(wk$("#page1 img")[0]){utils.onclick(imgs_to_pdf,1,"导出PDF");}
else{utils.onclick(()=>null,1,"此文档不适用");}}
async function yunzhan365(){if(location.pathname.startsWith("/basic")){return;}
utils.create_btns();judge_file_type();}
function exportURLs$1(){const all=parseInt(wk$("[class*=total]")[0]);const imgs=wk$("[class*=imgContainer] img");const got=imgs.length;if(got<all){if(!confirm(`当前浏览页数：${got}，总页数：${all}\n建议浏览剩余页面以导出全部链接\n是否继续导出链接？`)){return;}}
utils.save_urls(imgs.map(img=>img.src));}
function wenku360(){utils.create_btns();utils.onclick(exportURLs$1,1,"导出图片链接");}
async function getFileInfo(){const
uid=new URL(location.href).searchParams.get("contentUid"),resp=await fetch("https://zyjy-resource.webtrn.cn/sdk/api/u/open/getResourceDetail",{"headers":{"accept":"application/json, text/javascript, */*; q=0.01","content-type":"application/json",},"referrer":"https://jg.class.com.cn/","body":`{"params":{"contentUid":"${uid}"}}`,"method":"POST",}),data=await resp.json(),url=data["data"]["downloadUrl"],fname=data["data"]["title"];let ext;try{ext=new URL(url).pathname.split(".").at(-1);}catch(e){console.log(data);throw new Error("API changed, the script is invalid now.");}
return{url,fname,ext};}
async function saveFile(info){const
resp=await fetch(info.url),blob=await resp.blob();utils.save(info.fname+`.${info.ext}`,blob);}
function onCtrlS(e){if(e.code==="KeyS"&&e.ctrlKey){console.log("ctrl + s is captured!!");getFileInfo().then(info=>saveFile(info));e.preventDefault();e.stopImmediatePropagation();e.stopPropagation();}}
function jg(){window.addEventListener("keydown",onCtrlS,true);}
async function estimateTimeCost(){wk$(".w-page").at(-1).scrollIntoView();await utils.sleep(1000);let total=wk$("#pageNumber-text")[0].textContent.split("/")[1];total=parseInt(total);return confirm(["注意，一旦开始截图就无法停止，除非刷新页面。","浏览器窗口最小化会导致截图提前结束！","建议将窗口最大化，这将【显著增大清晰度和文件体积】",`预计耗时 ${1.1 * total} 秒，是否继续？`,].join("\n"));}
async function collectAll(){const imgs=[];let div=wk$(".w-page")[0];let i=0;while(true){const anchor=Date.now();while(!div&&(Date.now()-anchor<1000)){console.log(`retry on page ${i+1}`);await utils.sleep(200);}
if(!div)throw new Error(`can not fetch <div>: page ${i}`);div.scrollIntoView({behavior:"smooth"});await utils.sleep(1000);let canvas=wk$.call(div,"canvas")[0];let j=0;while(!canvas&&j<100){div=div.nextElementSibling;canvas=wk$.call(div,"canvas")[0];j++;}
if(!div)throw new Error(`can not fetch <div>: page ${i}*`);imgs.push(await utils.canvas_to_blob(canvas));console.log(`canvas stored: ${++i}`);div=div.nextElementSibling;if(!div)break;}
console.log("done");return imgs;}
async function scale(up){let s="#magnifyBtn";if(!up){s="#shrinkBtn";}
const btn=wk$(s)[0];for(let _ of utils.range(10)){btn.click();await utils.sleep(500);}}
async function prepare(){if(!await estimateTimeCost()){return;}
utils.toggle_btn(1);await scale(true);let imgs;try{imgs=await collectAll();}catch(e){console.error(e);}finally{scale(false);}
const fname="技工教育网文档";utils.onclick(()=>utils.img_blobs_to_pdf(imgs,fname),2,"导出PDF");utils.toggle_btn(2);utils.onclick(()=>utils.blobs_to_zip(imgs,"page","png",fname),3,"导出ZIP");utils.toggle_btn(3);}
function jgPreview(){utils.create_btns();utils.onclick(prepare,1,"截图文档");}
function getTitle(){return document.title.slice(0,-4);}
function getBaseURL$1(){return wk$("#dp")[0].value;}
function getTotalPageNum(){const num=wk$(".shop3 > li:nth-child(3)")[0].textContent.split("/")[1].trim();return parseInt(num);}
function*imgURLsMaker(base,max){for(let i of utils.range(1,max+1)){yield`${base}${i}.gif`;}}
function getImgURLs(){const
base=getBaseURL$1(),total=getTotalPageNum();return imgURLsMaker(base,total)}
function exportPDF(){const urls=getImgURLs();const title=getTitle();return utils.run_with_prog(2,()=>utils.img_urls_to_pdf(urls,title));}
function exportURLs(){const urls=getImgURLs();utils.save_urls(urls);}
function wenkub(){utils.create_btns();utils.onclick(exportURLs,1,"导出图片链接");utils.onclick(exportPDF,2,"导出PDF(测试)");utils.toggle_btn(2);}
const KEY="5zAUzyJv5xLoYyCCBJdxVw==";function*pageURLGen(){const
url=new URL(location.href),params=url.searchParams,base=url.origin+(window.basePath||"/manuscripts/pdf"),type=params.get("type")||"pdf",id=params.get("id")||new URL(wk$("#pdfContent")[0].src).searchParams.get("id")||utils.raise("书本ID未知");let i=0;let cur_url="";if(window.wk_sklib_url){console.log(`sklib 使用自定义 url: ${window.wk_sklib_url}`);while(true){cur_url=window.wk_sklib_url.replace("{id}",id).replace("{index}",`${i}`);yield[i,cur_url];console.log("wk: target:",cur_url);i++;}}else{while(true){cur_url=`${base}/data/${type}/${id}/${i}?random=null`;yield[i,cur_url];console.log("wk: target:",cur_url);i++;}}}
async function get_bookmarks(){const url=new URL(location.origin);const id=utils.get_param("id");url.pathname=`/manuscripts/pdf/catalog/pdf/${id}`;const resp=await fetch(url.href);const data=await resp.json();const bookmarks=JSON.parse(data.data).outline;return bookmarks;}
async function save_bookmarks(){const bookmarks=await get_bookmarks();const text=JSON.stringify(bookmarks,null,2);utils.save("bookmarks.json",text,{type:"application/json"});}
function decrpyt_pdf_data(encrypted_b64_data,b64_key){console.info("CryptoJS:",window.CryptoJS);const key=CryptoJS.enc.Base64.parse(b64_key);const decrypted=CryptoJS.AES.decrypt(encrypted_b64_data,key,{mode:CryptoJS.mode.ECB,padding:CryptoJS.pad.Pkcs7,});const decrypted_b64=CryptoJS.enc.Base64.stringify(decrypted).toString();return atob(decrypted_b64);}
async function fetch_all_pdfs(){if(window.download_finished){return window.pdfs;}
const prog_btn=utils.btn(3);window.download_finished=false;const pdfs=[];let
last_digest=NaN,size=NaN;if(window.loadPdfInfo){try{const resp=await loadPdfInfo();const info=JSON.parse(resp.data);size=parseInt(info.size)||size;}catch(e){console.error(e);}}
for(const[i,url]of pageURLGen()){const b64_data=await fetch(url).then(resp=>resp.text());if(!b64_data.length)break;const digest=utils.crc32(b64_data);if(digest===last_digest)break;last_digest=digest;const decrypted_b64_data=decrpyt_pdf_data(b64_data,KEY);const decrpyt_data=utils.b64_to_bytes(decrypted_b64_data);pdfs.push(decrpyt_data);const progress=`已经获取 ${i + 1} 组页面，每组`
+(size?` ${size} 页`:'页数未知');console.info(progress);prog_btn.textContent=`${i + 1} 组 / ${size} 页`;}
window.pdfs=pdfs;window.download_finished=true;return pdfs;}
function toggle_dl_btn_wrapper(async_fn){return async function(...args){utils.toggle_btn(1);utils.toggle_btn(2);await async_fn(...args);utils.toggle_btn(1);utils.toggle_btn(2);}}
async function download_pdf$1(){alert("如果看不到进度条请使用开发者工具（F12）查看日志\n"+
"如果文档页数过多可能导致合并PDF失败\n"+
"此时请使用【下载PDF数据集】按钮");const pdfs=await fetch_all_pdfs();const combined=await utils.join_pdfs(pdfs);utils.save(document.title+".pdf",combined,"application/pdf");utils.btn(3).textContent="进度条";}
download_pdf$1=toggle_dl_btn_wrapper(download_pdf$1);async function download_data_bundle(){alert("下载的是 <文档名称>.dat 数据集\n"+
"等价于若干 PDF 的文件顺序拼接\n"+
"请使用工具切割并合并为一份 PDF\n"+
"工具（pdfs-merger）链接在脚本主页");const pdfs=await fetch_all_pdfs();const blob=new Blob(pdfs,{type:"application/octet-stream"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.download=document.title+".dat";a.href=url;a.click();URL.revokeObjectURL(url);console.log("pdf数据集",blob);}
download_data_bundle=toggle_dl_btn_wrapper(download_data_bundle);function sdlib(){const url=new URL(location.href);const encrypted_id=url.pathname.split("/")[2];window.basePath=`/https/${encrypted_id}${basePath}`;}
function load_hooks(){const host_to_fn={"gwfw.sdlib.com":sdlib,};const fn=host_to_fn[location.hostname];if(fn){fn();}}
function sklib(){const iframe=wk$("iframe#pdfContent")[0];if(iframe)return;load_hooks();utils.create_btns();utils.onclick(download_pdf$1,1,"下载PDF");utils.onclick(download_data_bundle,2,"下载PDF数据集");utils.onclick(()=>false,3,"进度条");utils.onclick(save_bookmarks,4,"下载书签");utils.toggle_btn(2);utils.toggle_btn(3);utils.toggle_btn(4);utils.btn(3).style.pointerEvents="none";}
function getBaseURL(){const
elem=wk$("#page_1 img")[0],src=elem.src;if(!src){alert("当前页面不能解析！");return;}
if(!src.endsWith("1.gif")){alert("当前文档不能解析！");throw new Error("第一页图片不以 1.gif 结尾");}
return src.slice(0,-5);}
function*imgURLGen(){const
base=getBaseURL(),max=parseInt(wk$(".counts")[0].textContent.split("/")[1]);for(const i of utils.range(1,max+1)){yield`${base}${i}.gif`;}}
function getURLs(){utils.save_urls(imgURLGen());}
function jinchutou(){utils.create_btns();utils.onclick(getURLs,1,"导出图片链接");}
function get_pdfs(){const size=window?.Page.size;if(!size)utils.raise("无法确定总页码");const path=window?.loadPdf.toString().match(/url:'(.+?)',/)[1];if(!path)utils.raise("无法确定PDF路径");const code=location.pathname.split("/").at(-1);const tasks=[...utils.range(1,size+1)].map(async i=>{const resp=await fetch(path+"?wk=true",{"headers":{"content-type":"application/x-www-form-urlencoded; charset=UTF-8",},"body":`code=${code}&page=${i}`,"method":"POST",});if(!resp.ok)utils.raise(`第 ${i} 页获取失败！`);utils.update_popup(`已经获取第 ${i} 页`);const b64_str=await resp.text();return utils.b64_to_bytes(b64_str);});return utils.gather(tasks);}
function get_title(){return document.title.slice(0,-5);}
function download_pdf(){utils.run_with_prog(1,async()=>{const pdfs=await get_pdfs();debugger;const pdf=await utils.join_pdfs(pdfs);utils.save(get_title(),pdf,"application/pdf");});}
function add_style(){const style=`
    <style>
        #nprogress .nprogress-spinner-icon.forbidden {
            border-top-color: #b171ff;
            border-left-color: #bf8aff;
            animation: nprogress-spinner 2.4s linear infinite;
        }
    </style>
    `;document.body.insertAdjacentHTML("beforeend",style);}
function init_forbid_origin_pdf_fetch(){console.log("hooked xhr.open");wk$(".nprogress-spinner-icon")[0].classList.add("forbidden");const open=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(){const args=Array.from(arguments);const url=args[1];if(!(url.includes("readPage")&&!url.includes("wk=true")))return;this.send=()=>undefined;open.apply(this,args);};return function regain_open(){const url=new URL(location.href);url.searchParams.set("intercept","0");location.assign(url.toString());}}
function nrsis(){utils.create_btns();utils.onclick(download_pdf,1,"下载PDF");if(!utils.get_param("intercept")){add_style();const regain_open=init_forbid_origin_pdf_fetch();utils.onclick(regain_open,2,"恢复页面加载");utils.toggle_btn(2);}}
async function fetch_file_chunk(url,begin,end,onload){const resp=await fetch(url,{headers:{"Range":`bytes=${begin}-${end}`}});const buffer=await resp.arrayBuffer();onload();return buffer;}
function make_pdf_url(){const get_value=(key)=>{const regex=new RegExp(`(?<=${key}=)[0-9]+`);return location.search.match(regex)[0];};const id=get_value("id");const catalog_id=get_value("catalog_id");return`${location.origin}/rpdf/pdf/id/${id}/catalog_id/${catalog_id}.pdf`;}
async function get_file_size(url){const resp=await fetch(url,{headers:{"Range":`bytes=0-1`}});const size_text=resp.headers.get("content-range").split("/")[1];return parseInt(size_text);}
async function export_pdf(event){const btn=event.target;const url=make_pdf_url();const size=await get_file_size(url);const chunk=65536;const times=Math.floor(size/chunk);let finished=0;const update_progress=()=>{finished++;const loaded=((finished*chunk)/1024/1024).toFixed(2);const text=`已下载 ${loaded} MB`;utils.print(`chunk<${finished}>:`,text);btn.textContent=text;};const tasks=[];for(let i=0;i<times;i++){tasks[i]=fetch_file_chunk(url,i*chunk,(i+1)*chunk-1,update_progress,);}
const tail=size%chunk;tasks[times]=fetch_file_chunk(url,size-tail,size-1,update_progress,);const buffers=await utils.gather(tasks);utils.print("--------全部下载完成--------");utils.print("全部数据分片:",{get data(){return buffers;}});const blob=new Blob(buffers);const fname=top.document.title.split("_")[0]+".pdf";utils.save(fname,blob,"application/pdf");}
function xianxiao(){utils.print("进入<先晓书院PDF下载>脚本");utils.create_btns();utils.onclick(export_pdf,1,"下载PDF");}
function hook_log(){const con=window.console;const{log,info,warn,error}=con;if(Object.getOwnPropertyDescriptor(window,"console").configurable&&Object.getOwnPropertyDescriptor(con,"log").configurable){Object.defineProperty(window,"console",{get:function(){return con;},set:function(value){log.call(con,"window.console 想改成",value,"？没门！");},enumerable:false,configurable:false,});const fn_map={log,info,warn,error};Object.getOwnPropertyNames(fn_map).forEach((prop)=>{Object.defineProperty(con,prop,{get:function(){return fn_map[prop];},set:function(value){log.call(con,`console.${prop} 想改成`,value,"？没门！");},enumerable:false,configurable:false,});});}}
function main(host=null){window.wk_main=main;host=host||location.hostname;const url=new URL(location.href);const params=url.searchParams;const path=url.pathname;hook_log();console.log(`当前 host: ${host}\n当前 url: ${url.href}`);if(host.includes("docin.com")){docin();}else if(host==="swf.ishare.down.sina.com.cn"){if(params.get("wk")==="true"){ishareData2();}else{ishareData();}}else if(host.includes("ishare.iask")){ishare();}else if(host==="www.deliwenku.com"){deliwenku();}else if(host.includes("file")&&host.includes("deliwenku.com")){deliFile();}else if(host==="www.doc88.com"){doc88();}else if(host==="www.360doc.com"){doc360();}else if(host==="doc.mbalib.com"){mbalib();}else if(host==="www.dugen.com"){dugen();}else if(host==="c.gb688.cn"){gb688();}else if(host==="www.safewk.com"){safewk();}else if(host.includes("book118.com")){book118();}else if(host==="www.renrendoc.com"){renrendoc();}else if(host.includes("yunzhan365.com")){yunzhan365();}else if(host==="wenku.so.com"){wenku360();}else if(host==="jg.class.com.cn"){jg();}else if(host==="preview.imm.aliyuncs.com"){jgPreview();}else if(host==="www.wenkub.com"){wenkub();}else if((host.includes("sklib")&&path==="/manuscripts/")||host==="gwfw.sdlib.com"){sklib();}else if(host==="www.jinchutou.com"){jinchutou();}else if(host==="www.nrsis.org.cn"){nrsis();}else if(host==="xianxiao.ssap.com.cn"){xianxiao();}else{console.log("匹配到了无效网页");}}
setTimeout(main,1000);})();