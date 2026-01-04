// ==UserScript==
// @name         clipchamp-tts-download
// @namespace    http://tampermonkey.net/
// @version      v1.0.2
// @description  为 Clipchamp 文本转语音面板增加音频下载按钮
// @author       iuroc
// @match        https://app.clipchamp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clipchamp.com
// @grant        none
// @license      MIT
// @homepage     https://github.com/iuroc/clipchamp-tts-download
// @downloadURL https://update.greasyfork.org/scripts/538157/clipchamp-tts-download.user.js
// @updateURL https://update.greasyfork.org/scripts/538157/clipchamp-tts-download.meta.js
// ==/UserScript==

"use strict";(()=>{var s=Object.getPrototypeOf,_,x,p,f,M={isConnected:1},I=1e3,b,U={},z=s(M),B=s(s),d,k=(e,r,l,t)=>(e??(setTimeout(l,t),new Set)).add(r),A=(e,r,l)=>{let t=p;p=r;try{return e(l)}catch(o){return console.error(o),l}finally{p=t}},w=e=>e.filter(r=>r._dom?.isConnected),j=e=>b=k(b,e,()=>{for(let r of b)r._bindings=w(r._bindings),r._listeners=w(r._listeners);b=d},I),y={get val(){return p?._getters?.add(this),this.rawVal},get oldVal(){return p?._getters?.add(this),this._oldVal},set val(e){p?._setters?.add(this),e!==this.rawVal&&(this.rawVal=e,this._bindings.length+this._listeners.length?(x?.add(this),_=k(_,this,G)):this._oldVal=e)}},H=e=>({__proto__:y,rawVal:e,_oldVal:e,_bindings:[],_listeners:[]}),h=(e,r)=>{let l={_getters:new Set,_setters:new Set},t={f:e},o=f;f=[];let n=A(e,l,r);n=(n??document).nodeType?n:new Text(n);for(let a of l._getters)l._setters.has(a)||(j(a),a._bindings.push(t));for(let a of f)a._dom=n;return f=o,t._dom=n},V=(e,r=H(),l)=>{let t={_getters:new Set,_setters:new Set},o={f:e,s:r};o._dom=l??f?.push(o)??M,r.val=A(e,t,r.rawVal);for(let n of t._getters)t._setters.has(n)||(j(n),n._listeners.push(o));return r},N=(e,...r)=>{for(let l of r.flat(1/0)){let t=s(l??0),o=t===y?h(()=>l.val):t===B?h(l):l;o!=d&&e.append(o)}return e},W=(e,r,...l)=>{let[{is:t,...o},...n]=s(l[0]??0)===z?l:[{},...l],a=e?document.createElementNS(e,r,{is:t}):document.createElement(r,{is:t});for(let[i,c]of Object.entries(o)){let D=u=>u?Object.getOwnPropertyDescriptor(u,i)??D(s(u)):d,R=r+","+i,L=U[R]??=D(s(a))?.set??0,O=i.startsWith("on")?(u,q)=>{let T=i.slice(2);a.removeEventListener(T,q),a.addEventListener(T,u)}:L?L.bind(a):a.setAttribute.bind(a,i),S=s(c??0);i.startsWith("on")||S===B&&(c=V(c),S=y),S===y?h(()=>(O(c.val,c._oldVal),a)):O(c)}return N(a,n)},C=e=>({get:(r,l)=>W.bind(d,e,l)}),F=(e,r)=>r?r!==e&&e.replaceWith(r):e.remove(),G=()=>{let e=0,r=[..._].filter(t=>t.rawVal!==t._oldVal);do{x=new Set;for(let t of new Set(r.flatMap(o=>o._listeners=w(o._listeners))))V(t.f,t.s,t._dom),t._dom=d}while(++e<100&&(r=[...x]).length);let l=[..._].filter(t=>t.rawVal!==t._oldVal);_=d;for(let t of new Set(l.flatMap(o=>o._bindings=w(o._bindings))))F(t._dom,h(t.f,t._dom)),t._dom=d;for(let t of l)t._oldVal=t.rawVal},v={tags:new Proxy(e=>new Proxy(W,C(e)),C()),hydrate:(e,r)=>F(e,h(r,e)),add:N,state:H,derive:V};var{div:E,a:X,button:$}=v.tags,m=v.state(""),K=new MutationObserver(()=>{if(!location.pathname.startsWith("/editor/"))return;let e=document.getElementById("property-panel-drawer-text-to-speech.config");if(!e||e.childElementCount==0)return;let r=e.querySelector(".isPropertyPanel"),l=e?.querySelector(".download-btn"),t=document.querySelector('[data-testid="voice-script-textarea"');!r||!t||l||(t.addEventListener("input",o=>{m.val=o.target.value}),m.val=t.value,v.add(r,E({style:"padding: 0px 16px 12px; display: flex;"},$({class:"download-btn",style:()=>`
                        display: flex;
                        align-items: center;
                        gap: 5px;
                        flex-direction: column;
                        background-color: transparent;
                        border: 1px solid var(--colorNeutralStroke1);
                        flex: 1;
                        color: ${m.val.trim()&&g.val?"black":"var(--colorNeutralForegroundDisabled)"};
                        padding: 8px var(--spacingHorizontalM);
                        border-radius: var(--borderRadiusMedium);
                        font-family: var(--fontFamilyBase);
                        cursor: ${m.val.trim()&&g.val?"pointer":"no-drop"};`,onclick:()=>{if(m.val.trim()&&g.val){let o=prompt("\u8BF7\u8F93\u5165\u4FDD\u5B58\u7684\u6587\u4EF6\u540D",Date.now().toString());if(o==null)return;let n=document.createElement("a");n.href=g.val,n.download=o+".mp3",document.body.appendChild(n),n.click(),n.remove()}}},E({style:"font-weight: var(--fontWeightSemibold);"},"\u4E0B\u8F7D\u97F3\u9891"),E({style:"font-size: 12px; color: var(--colorNeutralForegroundDisabled);"},"\u8BF7\u5148\u9884\u89C8\u540E\u4E0B\u8F7D")))))});K.observe(document.body,{childList:!0,subtree:!0});var g=v.state(""),P=class extends Blob{constructor(r,l){super(r,l),g.val=URL.createObjectURL(this)}};window.Blob=P;})();
// @license      MIT