// ==UserScript==
// @name         JanitorAI Chat Copier
// @namespace    https://greasyfork.org/users/your-name
// @version      1.4
// @description  Automatically scroll up and copy chat to clipboard.
// @match        https://janitorai.com/chats/*
// @match        https://www.janitorai.com/chats/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542856/JanitorAI%20Chat%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/542856/JanitorAI%20Chat%20Copier.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const STEP_MS   = 200;
  const PAGE_FRAC = 0.9;
  const UP_CAP    = 800;
  const MIN_LEN   = 3;
  const NAME_MAX  = 60;
  const DROP_PAT  = /^(typing|loading|thinking|processing|\.\.\.)$/i;

  const BTN_ID = "ja-copy-chat-btn";

  const ZW_RE = /\u200b|\u200c|\u200d|\ufeff/g;
  const stripZW = s => s.replace(ZW_RE, "");
  const tidy = s => s ? stripZW(s).replace(/\r/g,"").replace(/\s+\n/g,"\n").replace(/\n{3,}/g,"\n\n").trim() : "";
  const normKey = s => stripZW(s).toLowerCase().replace(/\s+/g,"");
  const msgKey = (name, body) => normKey((name||"")+"::"+body);
  const fmt = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const MSG_WRAPPER_SEL = `
    [data-message-id],
    [data-testid*="message"],
    [class*="message"],
    [class*="Message"],
    [class*="chatline"],
    [class*="chatLine"],
    [class*="bubble"],
    article,
    li[role="article"]
  `;
  const NAME_SEL = `
    [data-testid*="name"],
    [data-testid*="author"],
    [data-author],
    [data-user-name],
    [data-username],
    [data-speaker],
    [class*="name"],
    [class*="Name"],
    [class*="author"],
    [class*="Author"],
    [class*="username"],
    header,
    h1,h2,h3,strong,b
  `;
  const BODY_SEL = `
    [data-testid*="message-text"],
    [data-testid*="content"],
    .message-text,
    .msg-text,
    .prose,
    .markdown,
    .content
  `;

  function isVisible(el){
    if(!(el instanceof Element)) return false;
    const st=getComputedStyle(el);
    if(st.display==="none"||st.visibility==="hidden"||+st.opacity===0) return false;
    const r=el.getBoundingClientRect();
    if(!r || r.height<12 || r.width<2) return false;
    const vh=window.innerHeight;
    if(r.bottom < -vh*0.25) return false;
    if(r.top    >  vh*1.25) return false;
    return true;
  }

  function findScrollEl(){
    const cands=[...document.querySelectorAll("div,main,section,article")];
    let best=null,score=-1;
    for(const el of cands){
      const st=getComputedStyle(el);
      if(!/(auto|scroll)/i.test(st.overflowY)) continue;
      const h=el.scrollHeight-el.clientHeight;
      if(h<=0) continue;
      const s=h + el.querySelectorAll("*").length;
      if(s>score){score=s;best=el;}
    }
    return best || document.scrollingElement || document.body;
  }

  function extractName(wrapper){
    const label = wrapper.querySelector(NAME_SEL);
    if(label){
      const n = tidy(label.innerText || label.textContent || "");
      if(n && n.length <= NAME_MAX && !DROP_PAT.test(n)) return n;
    }
    const raw = wrapper.innerText || wrapper.textContent || "";
    if(!raw) return "";
    const lines = raw.split(/\n+/).map(l=>l.trim()).filter(Boolean);
    if(lines.length>1 && lines[0].length>0 && lines[0].length<=NAME_MAX){
      if(lines[1].length >= MIN_LEN) return lines[0];
    }
    return "";
  }

  function extractBody(wrapper, nameUsed){
    const inner = wrapper.querySelector(BODY_SEL);
    let raw;
    if(inner && inner!==wrapper){
      raw = inner.innerText || inner.textContent || "";
    }else{
      raw = wrapper.innerText || wrapper.textContent || "";
    }
    raw = tidy(raw||"");
    if(nameUsed){
      const esc = nameUsed.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      raw = raw.replace(new RegExp("^"+esc+"\\s*\\n?"),"").trim();
    }
    return raw;
  }

  let scrollContainer=null;
  function captureStep(store, step, winScroll){
    if(document.hidden) return;
    const nodes=scrollContainer.querySelectorAll(MSG_WRAPPER_SEL);
    for(const w of nodes){
      if(!isVisible(w)) continue;

      let id = w.getAttribute("data-message-id") ||
               w.getAttribute("data-id") ||
               w.id ||
               null;

      let name = extractName(w);
      const body = tidy(extractBody(w, name));

      if(body.length < MIN_LEN) continue;
      if(DROP_PAT.test(body)) continue;
      if(!name) name="";

      const key = id ? ("id:"+id) : msgKey(name, body);
      if(store.has(key)) continue;
      store.set(key, {name, body, step});
    }
  }

  async function captureAll(){
    scrollContainer = findScrollEl();
    const winScroll=(scrollContainer===document.scrollingElement||scrollContainer===document.body);

    const getTop = ()=>winScroll?window.scrollY:scrollContainer.scrollTop;
    const setTop = v =>winScroll?window.scrollTo(0,v):(scrollContainer.scrollTop=v);
    const getStep= ()=> (winScroll?window.innerHeight:scrollContainer.clientHeight)*PAGE_FRAC;

    const store=new Map();
    let step=0;

    captureStep(store, step++, winScroll);

    for(let i=0;i<UP_CAP;i++){
      const before=getTop();
      if(before<=0) break;
      const next=Math.max(0,before-getStep());
      setTop(next);
      // eslint-disable-next-line no-await-in-loop
      await new Promise(r=>setTimeout(r,STEP_MS));
      captureStep(store, step++, winScroll);
      const after=getTop();
      if(after===before||after===0) break;
    }

    // We captured bottom->top; earliest messages seen last = highest step
    const arr=[...store.values()].sort((a,b)=>b.step-a.step);

    const lines=[];
    for(const m of arr){
      lines.push(m.name ? `${m.name}: ${m.body}` : m.body);
    }

    // fallback if nothing
    if(!lines.length){
      const raw = tidy(scrollContainer.innerText||"");
      if(raw) lines.push(raw);
    }

    return lines;
  }

  async function copyOut(str){
    const msg = `Copied Chat with ${fmt(str.length)} characters in total.`;
    try{
      await navigator.clipboard.writeText(str);
      alert(msg);
    }catch(_){
      const ta=document.createElement("textarea");
      ta.value=str;
      ta.style.position="fixed";ta.style.top="-9999px";
      document.body.appendChild(ta);ta.focus();ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert(msg + " (fallback).");
    }
  }

  async function handleCopy(){
    const btn=document.getElementById(BTN_ID);
    if(btn){btn.disabled=true;btn.textContent="Capturing…";}
    const lines=await captureAll();
    const out=lines.join("\n\n");
    await copyOut(out);
    if(btn){btn.disabled=false;btn.textContent="Copy Chat";}
  }

  function addButton(){
    let btn=document.getElementById(BTN_ID);
    if(btn) return;
    btn=document.createElement("button");
    btn.id=BTN_ID;
    btn.textContent="Copy Chat";
    btn.style.cssText=`
      position:fixed;
      bottom:12px;
      right:12px;
      z-index:2147483647;
      padding:6px 10px;
      font-size:13px;
      cursor:pointer;
      background:#2d72d9;
      color:#fff;
      border:none;
      border-radius:4px;
    `;
    btn.addEventListener("click",handleCopy);
    document.body.appendChild(btn);
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",addButton,{once:true});
  }else{
    addButton();
  }
})();
