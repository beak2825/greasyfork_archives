// ==UserScript==
// @name         Chzzk Auto-Complete
// @namespace    http://tampermonkey.net/
// @version      2024.12.22
// @description  치지직에서 가사를 자동완성 해줍니다. 일치하는 부분이 있는 가사 찾기(초성도 가능), 입력이 빈 칸일 때 다음 가사 미리 띄우기 등의 기능이 있습니다.
// @author       Nata
// @license      MIT
// @match        https://chzzk.naver.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/519219/Chzzk%20Auto-Complete.user.js
// @updateURL https://update.greasyfork.org/scripts/519219/Chzzk%20Auto-Complete.meta.js
// ==/UserScript==


"use strict";(()=>{var b=(e,{scope:n,equals:s=pe,lazy:o=!0}={})=>{let l={scope:n,equals:s,init:e};l.base=l;let t=Object.create(l);return t.e=98,t.a={get signal(){return ne(t)}},e instanceof Function?(t.r=0,t.u=e,o||(t.e=102,N(t)),t.get=(i=!(t.e&7180))=>{if(i&&N(t),t.e&1)return t.n;throw t.e&2?new Promise((u,r)=>{let p=t.watch(()=>{t.o===void 0?u(t.n):r(t.o),p()})}):t.o},Object.defineProperty(t,"state",{get:()=>({pending:!!(t.e&2)||!(t.e&7180),error:t.o,value:t.n})})):(t.e=105,t.n=e,t.get=()=>t.n,t.set=i=>{J(t,i instanceof Function?i(t.n):i)}),t.watch=i=>{let u=!(t.e&7180);return t.e|=2048,(t.l??=new Set).add(i),u&&N(t),()=>{t.l.delete(i),!t.l.size&&!((t.e&=-2049)&7180)&&W(t)}},t.subscribe=i=>{let u=!(t.e&7180);t.e|=4096;let r={p:i,a:{get signal(){return ne(r)}}};return(t.i??=new Set).add(r),u?N(t):t.e&1&&queueMicrotask(()=>i(t.n,t.a)),()=>{t.i.delete(r),!t.i.size&&!((t.e&=-2049)&7180)&&W(t),r.t!==void 0&&(r.t.abort(),r.t=void 0)}},t};var N=e=>{e.e|=2;let n=++e.r;e.o!==void 0&&(e.o=void 0),e.t!==void 0&&(e.t.abort(),e.t=void 0);try{let s=e.u((o,l=!1)=>{if(n!==e.r)throw void 0;if(o!==e&&(e.scope!==void 0&&(o=l?e.scope(o):e.scope.get(o)),e.e&7180)){(e.c??=new Set).add(o),o.s??=new Set;let t=!!(e.e&32)&&!(o.e&7180);o.e|=1024;let i=o.get(t);return o.s.add(e),i}return o.get()},e.a);me(s)?(s.then(o=>{n===e.r&&J(e,o)},o=>{n===e.r&&te(e,o)}),z(e)):J(e,s)}catch(s){te(e,s)}},J=(e,n)=>{e.e=e.e&-3|1;let s=e.n;!Object.is(n,s)&&!e.equals(n,s)&&(e.n=n,z(e),(e.e&4160)===4160&&(e.e&=-65,de(()=>{if((e.e&4097)===4097)for(let o of e.i)o.t!==void 0&&(o.t.abort(),o.t=void 0),queueMicrotask(()=>o.p(e.n,o.a));e.e|=64})),oe(e))},te=(e,n)=>{e.e&=-4,Object.is(e.o,n)||(e.o=n,z(e),oe(e))},z=e=>{if(e.e&2048)for(let n of e.l)n();e.e&=-129},oe=e=>{if((e.e&1056)===1056){se(e);for(let n of e.s)n.e|=128;for(let n=q.length;n--;){let s=q[n];if(s.e&128)if(N(s),(s.e&1152)===1024){for(let o of s.s)o.e|=128;s.e&=-1025,s.s.clear()}else s.e&=-129;s.e|=32}q=[]}},se=e=>{for(let n of e.s)n.e&32&&n.e&7172&&(n.e&=-33,n.e&1024&&se(n),q.push(n))},W=e=>{e.t!==void 0&&(e.t.abort(),e.t=void 0);for(let n of e.c)n.s.delete(e)&&!n.s.size&&!((e.e&=-1025)&7180)&&W(n);e.c.clear()},ne=e=>{let n=(e.t??=new AbortController).signal;if(n.then===void 0){let s=[];n.then=o=>{n.aborted?o():s.push(o)},n.addEventListener("abort",()=>{for(let o of s)o()},{once:!0,passive:!0})}return n},pe=()=>!1,me=e=>typeof e?.then=="function",q=[],A=[],de=e=>{A.length===0&&queueMicrotask(()=>{let n=A;A=[];for(let s of n)s()}),A.push(e)};var K=["\u3131","\u3132","\u3134","\u3137","\u3138","\u3139","\u3141","\u3142","\u3143","\u3145","\u3146","\u3147","\u3148","\u3149","\u314A","\u314B","\u314C","\u314D","\u314E"],ge=new Set(K.map(e=>e.charCodeAt(0)));var fe=["\u314F","\u3150","\u3151","\u3152","\u3153","\u3154","\u3155","\u3156","\u3157","\u3157\u314F","\u3157\u3150","\u3157\u3163","\u315B","\u315C","\u315C\u3153","\u315C\u3154","\u315C\u3163","\u3160","\u3161","\u3161\u3163","\u3163"];var be=["","\u3131","\u3132","\u3131\u3145","\u3134","\u3134\u3148","\u3134\u314E","\u3137","\u3139","\u3139\u3131","\u3139\u3141","\u3139\u3142","\u3139\u3145","\u3139\u314C","\u3139\u314D","\u3139\u314E","\u3141","\u3142","\u3142\u3145","\u3145","\u3146","\u3147","\u3148","\u314A","\u314B","\u314C","\u314D","\u314E"];var F=e=>{let n="",s=e.length;for(let o=0;o<s;o+=1){let l=e.charCodeAt(o),t=l-44032|0;if(t<0||t>=11172){n+=String.fromCharCode(l);continue}let i=K[t/588|0],u=fe[(t%588|0)/28|0],r=be[t%28|0];n+=i+u+r}return n},ae=e=>{let n="",s=e.length;for(let o=0;o<s;o+=1){let l=e.charCodeAt(o);if(ge.has(l)||l===10||l===32){n+=String.fromCharCode(l);continue}let t=l-44032|0;if(t<0||t>=11172)continue;let i=K[t/588|0];n+=i}return n};var xe=e=>e.nodeType===Node.ELEMENT_NODE,U=(e,n,s=document.body)=>{let o=new WeakMap,l=r=>{let p=[],f=v=>{p.push(v)};o.set(r,p),n(r,f)},t=r=>{let p=o.get(r);o.delete(r);for(let f of p)f()},i=(r,p)=>{if(xe(r)){r.matches(e)&&p(r);for(let f of r.querySelectorAll(e))p(f)}};for(let r of s.querySelectorAll(e))l(r);let u=new MutationObserver(r=>{for(let p of r){for(let f of p.removedNodes)i(f,t);for(let f of p.addedNodes)i(f,l)}});return u.observe(s,{childList:!0,subtree:!0}),u};var re=e=>{let n=!0,s=()=>{n&&(e(),requestAnimationFrame(s))};return requestAnimationFrame(s),()=>{n=!1}};localStorage.getItem("ac.settings")===null&&localStorage.setItem("ac.settings",JSON.stringify({cooltime:2*1e3,nextLyricsCount:3,wsRemovalProb:.02,conRemovalProb:.02,xCoord:0,yCoord:0,opacity:1}));localStorage.getItem("ac.templates")===null&&localStorage.setItem("ac.templates",JSON.stringify([]));var{cooltime:he=2*1e3,nextLyricsCount:ve=3,wsRemovalProb:Ve=.02,conRemovalProb:Be=.02,xCoord:XC=0,yCoord:YC=0,opacity:OP=1}=JSON.parse(localStorage.getItem("ac.settings")??"{}"),ye=JSON.parse(localStorage.getItem("ac.templates")??"[]"),P=b(Math.max(he,2*1e3)),M=b(ve),O=b(Ve),$=b(Be),xc=b(XC),yc=b(YC),op=b(OP),C=b(ye),le=b(0),Q=b(!1),j=b(!1),Se=b(e=>ke(e(C)));re(()=>le.set(performance.now()));var ie=e=>{let n=e.match(/<(.+?)>$/);return n===null?null:n[1]},Z=e=>e.match(/[0-9]+|[a-zA-Z]+|[ㄱ-ㅎㅏ-ㅣ가-힣]+|\S/g)??[],ce=e=>e.toLowerCase().replace(/\s/g," "),Ee=(e,n)=>e.replace(/\s/g,s=>Math.random()<n?"":s),Ce=(e,n)=>e.replace(/[ㄱ-ㅎㅏ-ㅣ !,.;()\[\]<>?^Vv~→←↑↓↖↗↘↙⬈⬉⬊⬋⬌⬅⬆⬇⮕⭠⭡⭢⭣]{4,}/g,s=>s.replace(/./g,o=>Math.random()<n?"":o)),we=e=>{let n=e.split(/\s*\|\s*/g).filter(t=>t.length>0).map(t=>{let i=t.split(":");return{text:i[0],prob:Number.parseFloat(i[1]??-100)/100}});if(n.length===0)return null;let s=0,o=1;for(let t of n)t.prob<0?s+=1:o-=t.prob=Math.min(t.prob,o);let l=o/s;for(let t of n)t.prob<0&&(t.prob=l);return n},Te=({text:e})=>{let n=ce(e),s=F(n);return{split:s,tokens:Z(s),chosungTokens:Z(ae(n))}},Ie=e=>{let n=Math.random(),s=0;for(let{text:o,prob:l}of e)if(s+=l,n<=s)return o;return e[0].text},ke=e=>{let n=[];for(let{title:s,text:o}of e){let l=o.trim().split(/\n+/g),t=l.length;for(let i=0;i<t;i+=1){let u=l[i].trim();if(u.length===0)continue;let r=we(u);if(r===null)continue;let p=r[0].text,f=r.map(Te),v={title:s,texts:r,mainText:p,transformations:f,next:null};i>0&&(n[n.length-1].next=v),n.push(v)}}return n},G=(e,n,s)=>{let o=e.length,l=n.length;if(o>l||o<=0)return null;let t=!1,i=0,u=0,r=0,p=e[0];for(let f=0;f+(o-r)<=l;f++){let v=n[f],B=v.length;if(p.startsWith(v))if(t=!0,p.length>B)p=p.slice(B),u+=1;else if(++r<o)p=e[r];else return i*1e4+f*100+u;else{if(v.startsWith(p)&&r+1>=o)return i*1e4+f*100+u;s?(t=!1,u=0,r=0,p=e[0]):t&&(t=!1,i+=1)}}return null},_e=(e,n)=>{let s=e.length,o=n.length;if(s>o||s<=0)return null;let l=!1,t=0,i=0;for(let u=0;u+(s-i)<=o;u++)if(e[i]===n[u]){if(l=!0,++i>=s)return t*1e4+u*100}else l&&(l=!1,t+=1);return null},Le=(e,n,s)=>{if(n.length===0)return null;if(/\s/.test(n[0]))return[];let o=[],l=[],t=[],i=F(ce(n)),u=Z(i);for(let r of e){let{transformations:p}=r,f=ie(r.title)===s?0:1,v=1e9,B=1e9,T=1e9;for(let{split:_,tokens:L,chosungTokens:c}of p){let d=G(u,L,!0)??G(u,L,!1)??1e9,h=G(u,c,!0)??G(u,c,!1)??1e9,y=_e(i,_)??1e9;v=Math.min(v,d),B=Math.min(B,h),T=Math.min(T,y)}v<1e9&&o.push({template:r,categoryPenalty:f,score:v}),B<1e9&&l.push({template:r,categoryPenalty:f,score:B}),T<1e9&&t.push({template:r,categoryPenalty:f,score:T})}return o.length===0&&(o=l),o.length===0&&(o=t),o.sort((r,p)=>r.categoryPenalty-p.categoryPenalty||r.score-p.score),o.map(r=>r.template)},Ne=({$popupElm:e,$inputElm:n,$text:s,$selection:o,$lastCompletionTime:l,$lastCompletion:t,$lastCompletionCategory:i},u)=>{let r=a=>{let g=n.get();g!==null&&(g.textContent=a,s.set(a))},p=()=>{let a=n.get();if(a===null)return;let g=document.createRange();g.selectNodeContents(a);let x=window.getSelection();x!==null&&(x.removeAllRanges(),x.addRange(g))},f=()=>{let a=n.get();if(a===null||c.get()!==null)return;let g=y.get()[o.get()],x=O.get(),m=$.get();a.focus(),p(),requestAnimationFrame(()=>{r(Ce(Ee(Ie(g.texts),x),m)),a.focus(),p(),o.set(0),l.set(performance.now()),t.set(g),i.set(ie(g.title))})},v=({target:a})=>{o.set(S.get().indexOf(a)),f()},B=()=>{j.set(!0)},T=(a,g)=>{if(a===null)return[];let x=[],m=a.next;for(let E=0;E<g&&m!==null;E+=1)x.push(m),m=m.next;return x},_=()=>{let a=document.createElement("div");return a.innerHTML="\uC124\uC815",a.className="autocomplete_item",a.addEventListener("click",B),a},L=(a,g)=>{let{title:x,mainText:m,next:E}=a,V=document.createElement("div"),I=E?E.mainText:"(\uB05D)",D=g?`\u{1F512}(${g}\uCD08) `:"";return V.innerHTML=`${D}${m} <span class="autocomplete_subtext">\u2192 ${I} @ [${x}]</span>`,V.className="autocomplete_item",V.addEventListener("click",v),V},c=b(a=>{let g=a(le),x=a(l),m=a(P),V=x+m-g;return V<=0?null:(V/1e3).toFixed(1)}),d=b(a=>/^\s$/.test(a(s))),h=b(a=>T(a(t),a(M))),y=b(a=>{if(a(Q))return[];let g=Le(a(Se),a(s),a(i));if(g===null)return a(h);let x=a(t);return g.filter(m=>m!==x).slice(0,10)}),S=b(a=>{if(a(d))return[_()];let g=a(c);return a(y).map(m=>L(m,g))}),w=b(a=>a(S)[a(o)]);return u(y.subscribe(()=>{o.set(0)})),u(S.subscribe((a,{signal:g})=>{e.get().append(...a),g.then(()=>{for(let m of a)m.remove()})})),u(w.subscribe((a,{signal:g})=>{a!==void 0&&(a.classList.add("selected"),a.scrollIntoView({behavior:"instant",block:"nearest"}),g.then(()=>{a.classList.remove("selected")}))})),{handleControlKey:a=>{if(j.get())return;let{ctrlKey:g,altKey:x,metaKey:m,shiftKey:E,key:V,isComposing:I}=a;if(V==="Dead"||V==="Unidentified"||V==="Enter"||g||x||m||E||I)return;let D=d.get(),X=Q.get();if(V==="Escape"&&!D){Q.set(!X);return}if(X)return;let R=y.get().length,Y=o.get(),H=R===0,ee=ue=>{o.set((ue%R+R)%R)};if(V==="ArrowDown"){if(H)return;ee(Y+1)}else if(V==="ArrowUp"){if(H)return;ee(Y-1)}else if(V==="Tab")D?B():H||f();else return;a.preventDefault(),a.stopPropagation()}}};GM_addStyle(`
#autocomplete_popup {
	display: flex;
	position: absolute;
	bottom: 48px;
	width: calc(100% - 10px);
	flex-direction: column;
	height: max-content;
	max-height: 150px;
	overflow: hidden scroll;
	z-index: 9;
	background: rgb(56,58,62);
	border-radius: 12px;
}
.autocomplete_item {
	padding: 8px 28px;
	line-height: normal;
	word-break: keep-all;
	white-space: pre-wrap;
	cursor: pointer;
	user-select: none;
	-webkit-user-select: none;
}
.autocomplete_item:hover, .autocomplete_item.selected {
	background: rgb(79,82,88);
}
.autocomplete_item:active {
	background: rgb(91,94,101);
}
.autocomplete_subtext {
	color: rgba(255, 255, 255, 0.5);
}
`);U("div[class*=live_chatting_input_container]",e=>{let n=document.createElement("div");n.id="autocomplete_popup",xc.subscribe(v=>{n.style.left=`${v}px`}),yc.subscribe(v=>{n.style.bottom=`${48-v}px`}),op.subscribe(v=>{n.style.opacity=`${v}`}),e.appendChild(n);let s=b(n),o=b(null),l=b(""),t=b(0),i=b(0),u=b(null),r=b(null);U("pre[contenteditable]",(p,f)=>{let v=p,B=()=>{l.set(v.textContent??"")};o.set(v),v.addEventListener("input",B);let{handleControlKey:T}=Ne({$popupElm:s,$inputElm:o,$text:l,$selection:t,$lastCompletionTime:i,$lastCompletion:u,$lastCompletionCategory:r},f);v.addEventListener("keydown",T),f(re(B))},e)});GM_addStyle(`
#autocomplete_settings {
	display: none;
	position: fixed;
	top: 32px;
	bottom: 32px;
	left: 32px;
	right: 32px;
	overflow-y: scroll;
	padding: 24px;
	gap: 24px;
	background: rgba(56,58,62,0.875);
	border: 1px solid rgb(115,119,127,0.75);
	border-radius: 12px;
	backdrop-filter: blur(4px);
	z-index: 99999;
}
#autocomplete_settings.opened {
	display: flex;
}
.autocomplete_button {
	display: flex;
	flex-shrink: 0;
	padding: 12px 24px;
	border: 1px solid rgb(115,119,127,0.5);
	border-radius: 6px;
	line-height: normal;
	align-items: center;
	justify-content: center;
	word-break: keep-all;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	cursor: pointer;
	user-select: none;
	-webkit-user-select: none;
}
.autocomplete_button.left {
	justify-content: flex-start;
}
.autocomplete_button:hover, .autocomplete_button.selected {
	background: rgb(79,82,88);
}
.autocomplete_button:active {
	background: rgb(91,94,101);
}
.autocomplete_subtext {
	color: rgba(255, 255, 255, 0.5);
}

.autocomplete_pane {
	display: flex;
	width: 100%;
	height: 100%;
	gap: 8px;
	flex-direction: column;
	overflow-y: scroll;
}
.autocomplete_pane.right_pane {
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
}

.autocomplete_input {
	display: flex;
	position: relative;
	width: 100%;
	margin: 0;
	outline: none;
	border: 2px solid rgb(115,119,127);
	border-radius: 8px;
	padding: 12px 16px;
	line-height: normal;
	align-items: center;
	background: rgb(21,22,25);
	color: white;
	cursor: text;
}
.autocomplete_input:hover, .autocomplete_input:focus {
	background: rgb(33,34,37);
}
.autocomplete_input:hover {
	border-color: rgb(140,145,155);
}
.autocomplete_input:focus {
	border-color: rgb(167,171,180);
}

.autocomplete_textarea {
	display: flex;
	position: relative;
	width: 100%;
	height: 100%;
	margin: 0;
	outline: none;
	border: 2px solid rgb(115,119,127);
	border-radius: 8px;
	padding: 12px 16px;
	line-height: normal;
	align-items: center;
	background: rgb(21,22,25);
	color: white;
	cursor: text;
}
.autocomplete_textarea:hover, .autocomplete_textarea:focus {
	background: rgb(33,34,37);
}
.autocomplete_textarea:hover {
	border-color: rgb(140,145,155);
}
.autocomplete_textarea:focus {
	border-color: rgb(167,171,180);
}

.transition {
	transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
	transition-timing-function: cubic-bezier(.2,1,.5,.95);
	transition-duration: .2s;
}
`);{let e=b(-1),n=b(c=>-Math.min(c(e),0)),s=b(c=>{let d=c(e);return d===null?null:c(C)[d]??null}),o=c=>{let d=document.createElement("div");return d.textContent=c,d},l=(c,d,h=[])=>{let y=document.createElement("button");return y.className="autocomplete_button transition",y.classList.add(...h),y.textContent=c,y.addEventListener("click",d),y},t=(c,d="text")=>{let h=document.createElement("input");return h.className="autocomplete_input transition",h.type=d,h.value=c,h},i=(c,d="")=>{let h=document.createElement("textarea");return h.className="autocomplete_textarea transition",h.placeholder=d,h.value=c,h},u=document.createElement("div");u.id="autocomplete_settings",document.body.appendChild(u);let r=document.createElement("div"),p=document.createElement("div");r.className="autocomplete_pane left_pane",p.className="autocomplete_pane right_pane",u.append(r,p);let f=l("\u2699\uFE0F \uC124\uC815",()=>{e.set(e.get()!==-1?-1:-2)}),v=l("\u{1F4DD} \uD15C\uD50C\uB9BF \uCD94\uAC00\uD558\uAE30",()=>{let c={title:"\uC0C8 \uD15C\uD50C\uB9BF",text:""};C.set([c,...C.get()]),e.set(0)});r.append(f,v);let B=(c,d,h,y)=>{let S=Number(c);return Number.isNaN(S)||S<d||S>h?y:Math.floor(S)};n.subscribe((c,{signal:d})=>{if(c===0)return;if(c===2){let m=i(JSON.stringify(C.get(),null,4)),E=l("\uC800\uC7A5",()=>{let I=JSON.parse(m.value);localStorage.setItem("ac.templates",JSON.stringify(I)),C.set(I)});f.textContent="\u2699\uFE0F \uC124\uC815 - \uC77C\uBC18 \uC124\uC815\uC73C\uB85C \uC804\uD658\uD558\uAE30";let V=[m,E];p.append(...V),d.then(()=>{f.textContent="\u2699\uFE0F \uC124\uC815";for(let I of V)I.remove()});return}b(m=>JSON.stringify({cooltime:m(P),nextLyricsCount:m(M),wsRemovalProb:m(O),conRemovalProb:m($),xCoord:m(xc),yCoord:m(yc),opacity:m(op)})).subscribe(m=>{localStorage.setItem("ac.settings",m)});let y=()=>{let m=B(S.value,2,60,P.get()/1e3)*1e3,E=B(w.value,0,10,M.get()),V=B(k.value,0,100,O.get()*100)/100,I=B(a.value,0,100,$.get()*100)/100,Xc=B(xC.value,-9999,9999,xc.get()),Yc=B(yC.value,-9999,9999,yc.get()),Op=B(oP.value,0,100,op.get()*100)/100;P.set(m),M.set(E),O.set(V),$.set(I),xc.set(Xc),yc.set(Yc),op.set(Op)},S=t((P.get()/1e3).toString(),"number"),w=t(M.get().toString(),"number"),k=t((O.get()*100).toString(),"number"),a=t(($.get()*100).toString(),"number"),xC=t(xc.get().toString(),"number"),yC=t(yc.get().toString(),"number"),oP=t((op.get()*100).toString(),"number"),g=l("\uC800\uC7A5",y);S.min="2",S.max="60",w.min="0",w.max="10",k.min="0",k.max="100",a.min="0",a.max="100",oP.min="0",oP.max="100";let x=[o("\uBBF8\uB9AC \uB744\uC6B8 \uB2E4\uC74C \uD14D\uC2A4\uD2B8\uC758 \uAC1C\uC218:"),w,o("\uB744\uC5B4\uC4F0\uAE30 \uC0AD\uC81C \uD655\uB960 (% \uB2E8\uC704):"),k,o("\uC5F0\uC18D\uD55C \uC790\uC74C/\uBAA8\uC74C \uBC0F \uD2B9\uC218\uBB38\uC790 \uC0AD\uC81C \uD655\uB960 (% \uB2E8\uC704):"),a,o("\uCFE8\uD0C0\uC784 (\uCD08 \uB2E8\uC704, \uCD5C\uC18C 2\uCD08):"),S,"\uC790\uB3D9\uC644\uC131 \uD31D\uC5C5 X\uC88C\uD45C (px \uB2E8\uC704, \uC74C\uC218\uB294 \uC67C\uCABD, \uC591\uC218\uB294 \uC624\uB978\uCABD, -400~0 \uC0AC\uC774\uC758 \uAC12\uC744 \uAD8C\uC7A5):",xC,"\uC790\uB3D9\uC644\uC131 \uD31D\uC5C5 Y\uC88C\uD45C (px \uB2E8\uC704, \uC74C\uC218\uB294 \uC67C\uCABD, \uC591\uC218\uB294 \uC624\uB978\uCABD, -400~0 \uC0AC\uC774\uC758 \uAC12\uC744 \uAD8C\uC7A5):",yC,"\uC790\uB3D9\uC644\uC131 \uD31D\uC5C5 \uD22C\uBA85\uB3C4 (% \uB2E8\uC704, 0~100):",oP,g];p.append(...x),f.textContent="\u2699\uFE0F \uC124\uC815 - \uD15C\uD50C\uB9BF JSON \uD3B8\uC9D1 \uBAA8\uB4DC\uB85C \uC804\uD658\uD558\uAE30",d.then(()=>{for(let m of x)m.remove();f.textContent="\u2699\uFE0F \uC124\uC815"})});let T=({target:c})=>{let d=_.get().indexOf(c);e.set(d)},_=b(c=>c(C).map(({title:d})=>l(d,T,["left"]))),L=b(c=>{let d=c(e);if(d!==null)return c(_)[d]});_.subscribe((c,{signal:d})=>{r.append(...c),d.then(()=>{for(let h of c)h.remove()})}),L.subscribe((c,{signal:d})=>{c!==void 0&&(c.classList.add("selected"),d.then(()=>{c.classList.remove("selected")}))}),s.subscribe((c,{signal:d})=>{if(c===null)return;let{title:h,text:y}=c,S=t(h),w=i(y,`\uD14D\uC2A4\uD2B8\uB294 \uC904 \uB2E8\uC704\uB85C \uAD6C\uBD84\uB418\uBA70, \uBE48 \uC904\uACFC \uAC01 \uD14D\uC2A4\uD2B8\uC758 \uC591\uC606 \uACF5\uBC31\uC740 \uBAA8\uB450 \uBB34\uC2DC\uB429\uB2C8\uB2E4.
\uC790\uB3D9\uC644\uC131 \uC2DC \uD14D\uC2A4\uD2B8\uAC00 \uC5EC\uB7EC \uAC1C \uC911 \uB79C\uB364\uC73C\uB85C \uC120\uD0DD\uB418\uAC8C \uD558\uB824\uBA74, \uD55C \uC904 \uC548\uC5D0\uC11C \uAD6C\uBD84\uD560 \uD14D\uC2A4\uD2B8 \uC0AC\uC774\uC5D0 '|'\uB97C \uB123\uC5B4\uC8FC\uC138\uC694.
* \uC608\uC2DC: \uC5B5\uC6B8\uD558\uB2E4 \uC5B5\uC6B8\uD574 | \uC5B4\uAD6C\uB77C\uB2E4 \uC5B4\uAD6C\uB798 | \u3147\u3131\u3139\u3137 \u3147\u3131\u3139

\uAC01 \uD14D\uC2A4\uD2B8\uC758 \uD655\uB960\uC744 \uC9C0\uC815\uD558\uACE0 \uC2F6\uB2E4\uBA74, ':'\uB85C \uAD6C\uBD84\uD574 \uD655\uB960(% \uB2E8\uC704)\uC744 \uD45C\uAE30\uD574 \uC8FC\uC138\uC694. \uD655\uB960\uC774 \uD45C\uAE30\uB41C \uD14D\uC2A4\uD2B8\uB97C \uC81C\uC678\uD558\uACE0 \uB0A8\uB294 \uD655\uB960\uC740 \uD655\uB960\uC774 \uD45C\uAE30\uB418\uC9C0 \uC54A\uC740 \uD14D\uC2A4\uD2B8\uC5D0 \uBD84\uBC30\uB429\uB2C8\uB2E4.
* \uC608\uC2DC: \uC5B5\uC6B8\uD558\uB2E4 \uC5B5\uC6B8\uD574:50 | \uC5B5\uC6B0\uB797\uB2E4 \uC5B5\uC6B8\uD574 | \uC5B5\uC6B8\uD558\uB2E4 \uC5B5\uC6B0\uB7B3 | \u3147\u3131\u3139\u3137 \u3147\u3131\u3139:40
\uC704 \uC608\uC2DC\uC5D0\uC11C '\uC5B5\uC6B8\uD558\uB2E4 \uC5B5\uC6B8\uD574'\uB294 50% \uD655\uB960\uB85C \uC120\uD0DD\uB418\uBA70, \u3147\u3131\u3139\u3137 \u3147\u3131\u3139\uB294 40% \uD655\uB960\uB85C \uC120\uD0DD\uB429\uB2C8\uB2E4. \uB098\uBA38\uC9C0 10% \uD655\uB960\uC740 \uB0A8\uC740 \uD14D\uC2A4\uD2B8 '\uC5B5\uC6B0\uB797\uB2E4 \uC5B5\uC6B8\uD574'\uC640 '\uC5B5\uC6B8\uD558\uB2E4 \uC5B5\uC6B0\uB7B3'\uC5D0 \uAC01\uAC01 5%\uC529 \uBD84\uBC30\uB429\uB2C8\uB2E4.

:0\uC73C\uB85C \uC124\uC815\uD560 \uACBD\uC6B0 \uD574\uB2F9 \uD14D\uC2A4\uD2B8\uB294 \uC120\uD0DD\uB418\uC9C0 \uC54A\uC9C0\uB9CC \uAC80\uC0C9\uC740 \uB418\uAE30 \uB54C\uBB38\uC5D0, \uAC80\uC0C9\uC6A9 \uD0A4\uC6CC\uB4DC\uB97C \uCD94\uAC00\uD558\uACE0 \uC2F6\uC744 \uB54C \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.
* \uC608\uC2DC: Lost in the echoes of deceit | \uB85C\uC2A4\uD2B8 \uC778 \uB354 \uC5D0\uCF54\uC2A4:0
\uC704 \uC608\uC2DC\uB294 'Lost'\uBFD0\uB9CC \uC544\uB2C8\uB77C '\u3139\u3145\u314C' \uB4F1\uC73C\uB85C\uB3C4 \uAC80\uC0C9\uC774 \uB418\uC9C0\uB9CC, \uD56D\uC0C1 'Lost in the echoes of deceit'\uB9CC\uC774 \uC120\uD0DD\uB429\uB2C8\uB2E4.

\uC790\uB3D9\uC644\uC131 \uBAA9\uB85D\uC5D0\uC11C\uB294 \uCCAB\uBC88\uC9F8 \uD14D\uC2A4\uD2B8\uB9CC \uB098\uD0C0\uB098\uBA70, \uD574\uB2F9 \uD14D\uC2A4\uD2B8\uB97C \uC120\uD0DD \uC2DC \uB79C\uB364\uC73C\uB85C \uC644\uC131\uB429\uB2C8\uB2E4.
\uD14D\uC2A4\uD2B8\uAC00 \uC120\uD0DD\uB41C \uD6C4, \uC124\uC815\uD55C \uC0AD\uC81C \uD655\uB960\uC5D0 \uB530\uB77C \uD2B9\uC815 \uAE00\uC790\uB4E4\uC774 \uB79C\uB364\uD558\uAC8C \uC77C\uBD80 \uC0AD\uC81C\uB420 \uC218 \uC788\uC2B5\uB2C8\uB2E4.`),k=l("\uC800\uC7A5",()=>{let g=e.get();if(g===null)return;let x=C.get(),m=[...x.slice(0,g),{title:S.value,text:w.value},...x.slice(g+1)];localStorage.setItem("ac.templates",JSON.stringify(m)),C.set(m)}),a=l("\uC0AD\uC81C",()=>{let g=e.get();if(g===null)return;if(w.value){alert("\uD15C\uD50C\uB9BF\uC744 \uC0AD\uC81C\uD558\uB824\uBA74 \uD14D\uC2A4\uD2B8\uB97C \uC804\uBD80 \uC9C0\uC6CC \uC8FC\uC138\uC694.");return}let x=C.get(),m=[...x.slice(0,g),...x.slice(g+1)];localStorage.setItem("ac.templates",JSON.stringify(m)),C.set(m)});p.append(S,w,k,a),d.then(()=>{S.remove(),w.remove(),k.remove(),a.remove()})}),j.subscribe((c,{signal:d})=>{c&&(C.set(JSON.parse(localStorage.getItem("ac.templates")??"[]")),u.classList.add("opened"),d.then(()=>{u.classList.remove("opened")}),window.addEventListener("keydown",h=>{h.key==="Escape"&&j.set(!1)},{signal:d}))})}})();
