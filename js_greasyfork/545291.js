// ==UserScript==
// @name         ChatGPT Bubble Theme Pro
// @namespace    https://greasyfork.org/zh-CN/users/1503226-loom29
// @version      1.9.3
// @author       Ech0
// @description  自定义 ChatGPT 气泡：纯色/线性/放射/弥散光渐变、磨砂、外发光、描边、圆角/内边距……支持 Alt+G 打开面板；移动端优化与节流。
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545291/ChatGPT%20Bubble%20Theme%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/545291/ChatGPT%20Bubble%20Theme%20Pro.meta.js
// ==/UserScript==
(function () {
  "use strict";

  const IS_MOBILE = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ||
                    (window.matchMedia && matchMedia("(max-width: 820px)").matches);
  const SAFE_MODE = !!IS_MOBILE;

  /*** 性能：样式节流 + 归拢开关 ***/
  let NEED_ENSURE = true;
  let styleTimer = null;
  const requestStyleUpdate = () => {
    if (styleTimer) return;
    styleTimer = setTimeout(() => { styleTimer = null; applyStyle(); }, IS_MOBILE ? 90 : 45);
  };

  /*** 主题与默认值 ***/
  const THEMES = {
    "海盐": { mode:"diffuse", angle:135, colors:["#89d0d2","#a8ced7","#88b9ce"], weights:[34,33,33], alpha:0.25, blur:10, glow:0, outlineColor:"#78afb0", outlineAlpha:0, outlineWidth:1, radius:16, padV:8, padH:12, textColor:"#2d3d43", soft:10, autoText:false },
    "春日": { mode:"diffuse", angle:130, colors:["#d5e7ab","#e2e29d","#b4d4ab"], weights:[34,33,33], alpha:0.45, blur:9, glow:0, outlineColor:"#b0cda7", outlineAlpha:0, outlineWidth:1, radius:16, padV:8, padH:12, textColor:"#2e3f27", autoText:false },
    "蜜桃": { mode:"diffuse", angle:125, colors:["#f2d8d4","#ebbeb3","#f4d5b8"], weights:[34,33,33], alpha:0.40, blur:8, glow:0, outlineColor:"#e6a08e", outlineAlpha:0, outlineWidth:1, radius:16, padV:8, padH:12, textColor:"#47352e", autoText:false },
    "洋芋": { mode:"diffuse", angle:125, colors:["#9898c5","#b7cfe5","#b9b5c5"], weights:[34,33,33], alpha:0.30, blur:8, glow:0, outlineColor:"#9189be", outlineAlpha:0, outlineWidth:1, radius:16, padV:8, padH:12, textColor:"#4d4860", autoText:false },
    "奶油": { mode:"diffuse", angle:125, colors:["#f0e6d0","#e2dfca","#ecd8c1"], weights:[34,33,33], alpha:0.30, blur:8, glow:0, outlineColor:"#c8b493", outlineAlpha:0, outlineWidth:1, radius:16, padV:8, padH:12, textColor:"#5c5951", autoText:false },
    "湖畔": { mode:"diffuse", angle:135, colors:["#76b9d5","#a9d3d6","#34b7a1"], weights:[34,33,33], alpha:0.70, blur:10, glow:0, outlineColor:"#65b3b8", outlineAlpha:0, outlineWidth:1, radius:16, padV:8, padH:12, textColor:"#09161b", soft:20, autoText:false },
    "热异常": { mode:"linear", angle:180, colors:["#dcd6d6","#eab06d","#e95f28"], weights:[27,47,26], alpha:1, blur:9, glow:0, outlineColor:"#610505", outlineAlpha:0, outlineWidth:1, radius:16, padV:8, padH:12, textColor:"#2e3f27", soft:20, autoText:true },
    "水泥": { mode:"diffuse", angle:135, colors:["#4d5b6f","#626e7a","#4f5863"], weights:[34,33,33], alpha:0.85, blur:10, glow:0, outlineColor:"#0d3f5e", outlineAlpha:0, outlineWidth:1, radius:16, padV:8, padH:12, textColor:"#ffffff", autoText:true },
    "墨玉": { mode:"diffuse", angle:135, colors:["#3c5639","#274b37","#2a5026"], weights:[34,33,33], alpha:0.75, blur:10, glow:0, outlineColor:"#0d631f", outlineAlpha:0, outlineWidth:1, radius:16, padV:8, padH:12, textColor:"#ffffff", autoText:true },
    "红酒": { mode:"diffuse", angle:135, colors:["#640707","#2f0909","#570a29"], weights:[34,33,33], alpha:0.90, blur:10, glow:0, outlineColor:"#651406", outlineAlpha:0, outlineWidth:1, radius:16, padV:8, padH:12, textColor:"#ffffff", autoText:true },
    "纯黑": { mode:"solid", angle:135, colors:["#000000","#000000","#000000"], weights:[100,0,0], alpha:1.00, blur:10, glow:0, outlineColor:"#000000", outlineAlpha:0, outlineWidth:0, radius:16, padV:8, padH:12, textColor:"#ffffff", soft:10, autoText:true }
  };
  const DEFAULTS = {
    targets: { user:true, assistant:false, sendbtn:true },
    followOfSendBtn: "user",
    user: structuredClone(THEMES["海盐"]),
    assistant: structuredClone(THEMES["海盐"]),
    lastTheme: { user:"海盐", assistant:"海盐" },
    overrides: { user:{}, assistant:{} },
    customThemes: {},
    galleryOrder: Object.keys(THEMES),
    panel: { x:null, y:null, w:560, h:560 }
  };

  // —— 这里只声明一次，避免重复声明告警 ——
  const PANEL_ID = "ech0-theme-panel";
  const STYLE_ID = "ech0-theme-style";

  const clone = (x)=>JSON.parse(JSON.stringify(x));
  const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
  const pad2=(n)=>n.toString(16).padStart(2,"0");
  const hexToRgb=(hex)=>{ let h=(hex||"").replace("#","").trim(); if(h.length===3) h=h.split("").map(x=>x+x).join(""); const n=parseInt(h||"000000",16); return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 }; };
  const rgba=(hex,a)=>{ const { r,g,b }=hexToRgb(hex); return `rgba(${r},${g},${b},${clamp(a,0,1)})`; };
  const load=()=>{ try{ const s=GM_getValue("ech0_theme_pro"); if(s) return Object.assign(clone(DEFAULTS), s);}catch{} return clone(DEFAULTS); };
  const save=(cfg)=>{ try{ GM_setValue("ech0_theme_pro", cfg); }catch{} };
  let CFG = load(); // 提前加载，保证后续调用可用

  function hslToRgb(h,s,l){
    h=((h%360)+360)%360; s/=100; l/=100;
    const c=(1-Math.abs(2*l-1))*s, x=c*(1-Math.abs((h/60)%2-1)), m=l-c/2;
    let r=0,g=0,b=0;
    if(h<60){ r=c; g=x; }
    else if(h<120){ r=x; g=c; }
    else if(h<180){ g=c; b=x; }
    else if(h<240){ g=x; b=c; }
    else if(h<300){ r=x; b=c; }
    else { r=c; b=x; }
    return { r:Math.round((r+m)*255), g:Math.round((g+m)*255), b:Math.round((b+m)*255) };
  }
  function parseColorToHex(s){
    if(!s) return null;
    s=s.trim();
    let m=s.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
    if(m){ let h=m[1]; if(h.length===3) h=h.split("").map(x=>x+x).join(""); return "#"+h.toLowerCase(); }
    m=s.match(/^rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
    if(m){ const r=clamp(Math.round(+m[1]),0,255), g=clamp(Math.round(+m[2]),0,255), b=clamp(Math.round(+m[3]),0,255); return "#"+pad2(r)+pad2(g)+pad2(b); }
    m=s.match(/^hsla?\s*\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([\d.]+))?\s*\)$/i);
    if(m){ const { r,g,b }=hslToRgb(+m[1],+m[2],+m[3]); return "#"+pad2(r)+pad2(g)+pad2(b); }
    return null;
  }
  function relLuma(hex){
    const { r,g,b }=hexToRgb(hex);
    const sr=[r,g,b].map(v=>v/255).map(v=>v<=0.04045? v/12.92 : Math.pow((v+0.055)/1.055,2.4));
    return 0.2126*sr[0]+0.7152*sr[1]+0.0722*sr[2];
  }
  function themeLuma(s){
    const w=s.weights||[1,1,1], sum=w.reduce((a,b)=>a+b,0)||1;
    const cols=(s.colors||[]).filter(Boolean); let L=0;
    cols.forEach((c,i)=>{ L+=relLuma(c)*(w[i]||0)/sum; });
    return L;
  }
  const pickAutoTextColor=(s)=> themeLuma(s)>0.55 ? "#000000" : "#ffffff";

  const SOFT=10, MAX_SOFT=50;
  function makeBackground(s){
    const cols=(s.colors||[]).filter(Boolean);
    const c1=cols[0]||"#000000", c2=cols[1]||c1, c3=cols[2]||c2;
    const a1=rgba(c1,s.alpha), a2=rgba(c2,s.alpha), a3=rgba(c3,s.alpha);
    const w=(s.weights||[100,0,0]).map(n=>Math.max(0,+n||0));
    const sum=w.reduce((a,b)=>a+b,0);
    if(s.mode==="solid") return a1;
    const softBase=Math.max(0,Math.min((s.soft??SOFT),MAX_SOFT));
    if(sum<=0) return a1;

    if(s.mode==="diffuse"){
      const k1=w[0]/sum, k2=w[1]/sum, k3=w[2]/sum;
      const angle=typeof s.angle==="number"?s.angle:135;
      return [
        `radial-gradient(60% 60% at 0% 0%, ${a1} ${Math.round(k1*60)}%, transparent 60%)`,
        `radial-gradient(60% 60% at 100% 0%, ${a2} ${Math.round(k2*60)}%, transparent 60%)`,
        `radial-gradient(60% 60% at 0% 100%, ${a3} ${Math.round(k3*60)}%, transparent 60%)`,
        `linear-gradient(${angle}deg, ${a1}, ${a2}, ${a3})`
      ].join(",");
    }

    if(s.mode==="radial"){
      const r1=w[0]/sum*100, r2=(w[0]+w[1])/sum*100;
      const t1=Math.min(softBase,r1,(r2-r1)/2), t2=Math.min(softBase,(r2-r1)/2,100-r2);
      return `radial-gradient(120% 100% at 0% 0%,
        ${a1} 0%, ${a1} ${Math.max(0,r1-t1)}%,
        ${a2} ${Math.min(100,r1+t1)}%, ${a2} ${Math.max(0,r2-t2)}%,
        ${a3} ${Math.min(100,r2+t2)}%, ${a3} 100%)`;
    }

    const p1=w[0]*100/sum, p2=(w[0]+w[1])*100/sum;
    const t1=Math.min(softBase,p1,(p2-p1)/2,100-p1);
    const t2=Math.min(softBase,(p2-p1)/2,100-p2);
    const angle=typeof s.angle==="number"?s.angle:135;
    if(p1<=0 && p2<=0) return `linear-gradient(${angle}deg, ${a3} 0%, ${a3} 100%)`;
    if(p1>=100) return `linear-gradient(${angle}deg, ${a1} 0%, ${a1} 100%)`;
    return `linear-gradient(${angle}deg,
      ${a1} 0%, ${a1} ${Math.max(0,p1-t1)}%,
      ${a2} ${Math.min(100,p1+t1)}%, ${a2} ${Math.max(0,p2-t2)}%,
      ${a3} ${Math.min(100,p2+t2)}%, ${a3} 100%)`;
  }

  const CANDIDATES=[":scope > .markdown",":scope .markdown",":scope .prose",":scope .whitespace-pre-wrap"];
  const getCandidateBlocks=(el)=> Array.from(el.querySelectorAll(CANDIDATES.join(","))).filter(n=>!n.closest(".ech0-bubble"));
  const containsAll=(c,nodes)=> nodes.every(n=>c.contains(n));
  function findCommonContainer(msgEl,nodes){
    if(!nodes.length) return null;
    for(let c=nodes[0].parentElement; c && c!==msgEl; c=c.parentElement){
      if(containsAll(c,nodes)) return c;
    }
    return msgEl;
  }
  function wrapIntoBubble(container,nodes){
    if(!container) return;
    let shell=container.querySelector(":scope > .ech0-bubble");
    if(!shell){ shell=document.createElement("div"); shell.className="ech0-bubble"; container.insertBefore(shell,container.firstChild); }
    const tops=[];
    nodes.forEach(n=>{ let t=n; while(t.parentElement && t.parentElement!==container) t=t.parentElement; if(!tops.includes(t)) tops.push(t); });
    tops.sort((a,b)=>a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1);
    tops.forEach(t=>{ if(t!==shell) shell.appendChild(t); });
  }
  function glueOneMessage(msgEl){
    const nodes=getCandidateBlocks(msgEl);
    if(!nodes.length) return;
    const c=findCommonContainer(msgEl,nodes);
    if (SAFE_MODE){ c.classList.add("ech0-bubble-s"); return; }
    wrapIntoBubble(c,nodes);
  }
  function ensureShells(role){
    document.querySelectorAll(`[data-message-author-role="${role}"]`).forEach(glueOneMessage);
  }

  const SEND_BTN_SEL=[
    'button[data-testid="send-button"]',
    'form button[type="submit"]',
    'button[aria-label="Send"]',
    '[data-testid="composer-send-button"] button'
  ].join(",");
  const makeGlow=(hex,str)=> str>0?`0 6px 18px ${rgba(hex,clamp(str*0.55,0,1))}, 0 0 18px ${rgba(hex,clamp(str*0.35,0,1))}`:"none";

  function cssForRole(role,s){
    const bg=makeBackground(s);
    const outline=rgba(s.outlineColor,s.outlineAlpha);
    const border=(s.outlineAlpha<=0 || s.outlineWidth<=0)?"none":`${s.outlineWidth}px solid ${outline}`;
    const shadow=makeGlow(s.outlineColor,s.glow);
    const pfx=role==="user"?"user":"asst";
    const isLight=themeLuma(s)>0.55;
    const preBg=isLight?"rgba(0,0,0,.08)":"rgba(255,255,255,.12)";
    const preBorder=isLight?"1px solid rgba(0,0,0,.12)":"1px solid rgba(255,255,255,.16)";
    const text=s.autoText?pickAutoTextColor(s):(s.textColor||"#101418");
    const blurPx = IS_MOBILE ? Math.min(s.blur, 4) : s.blur; // 移动端 blur 限幅

    const bubbleSel = SAFE_MODE ? `.ech0-bubble-s` : `.ech0-bubble`;
    const clearHost = SAFE_MODE ? "" : `
[data-message-author-role="${role}"], [data-message-author-role="${role}"] > div,
[data-message-author-role="${role}"] .text-message, [data-message-author-role="${role}"] .relative{
  background:transparent!important; box-shadow:none!important; border-color:transparent!important;
}`;

    return `
:root{ --ech0-${pfx}-text:${text}; }
${clearHost}
[data-message-author-role="${role}"] ${bubbleSel}{
  display:inline-block; width:fit-content; max-width:100%;
  background:${bg}!important; color:var(--ech0-${pfx}-text)!important;
  border:${border}!important; border-radius:${s.radius}px!important;
  padding:${s.padV}px ${s.padH}px!important; box-shadow:${shadow}!important;
  -webkit-backdrop-filter:blur(${blurPx}px)!important; backdrop-filter:blur(${blurPx}px)!important;
}
[data-message-author-role="${role}"] ${bubbleSel} :not(pre):not(code){
  color:var(--ech0-${pfx}-text)!important;
  -webkit-text-fill-color:var(--ech0-${pfx}-text)!important;
}
[data-message-author-role="${role}"] ${bubbleSel} pre{
  background:${preBg}!important; border:${preBorder}!important; border-radius:10px!important;
}`;
  }

  function applyStyle(){
    if (NEED_ENSURE){
      if (CFG.targets.user) ensureShells("user");
      if (CFG.targets.assistant) ensureShells("assistant");
      NEED_ENSURE = false;
    }

    let css=`
.ech0-bubble{ background:transparent; background-clip:padding-box; }
.ech0-bubble-s{ background:transparent; background-clip:padding-box; }
#${PANEL_ID} .hd{ position:sticky; top:0; z-index:5; }
#${PANEL_ID} .previewRow{ position:relative; z-index:1; }
`;

    if(CFG.targets.user) css+=cssForRole("user",CFG.user);
    if(CFG.targets.assistant) css+=cssForRole("assistant",CFG.assistant);

    if(CFG.targets.sendbtn){
      const s=CFG.followOfSendBtn==="assistant"?CFG.assistant:CFG.user;
      const bg=makeBackground(s);
      const outline=rgba(s.outlineColor,s.outlineAlpha);
      const border=(s.outlineAlpha<=0 || s.outlineWidth<=0)?"none":`${s.outlineWidth}px solid ${outline}`;
      const textColor = s.autoText ? pickAutoTextColor(s) : (s.textColor || "#101418");
      const blurPx = IS_MOBILE ? Math.min(s.blur, 4) : s.blur;
      css+=`
${SEND_BTN_SEL}{
  background:${bg}!important; border:${border}!important; border-radius:9999px!important;
  -webkit-backdrop-filter:blur(${blurPx}px)!important; backdrop-filter:blur(${blurPx}px)!important;
  color:${textColor}!important;
}
${SEND_BTN_SEL} svg{
  color:${textColor}!important;
  --send-stroke: 0.10px;
}
${SEND_BTN_SEL} svg *{
  filter:none!important; mix-blend-mode:normal!important; opacity:1!important;
  -webkit-mask-image:none!important; mask:none!important;
  fill:none!important; stroke:currentColor!important; stroke-linecap:round!important; stroke-linejoin:round!important;
  vector-effect:non-scaling-stroke!important; stroke-width:var(--send-stroke)!important; shape-rendering:geometricPrecision; paint-order:stroke fill markers;
}
`;
    }

    let node=document.getElementById(STYLE_ID);
    if(!node){ node=document.createElement("style"); node.id=STYLE_ID; document.head.appendChild(node); }
    node.textContent=css;
    updatePreview();
  }

  function openPanel(){
    if(document.getElementById(PANEL_ID)) return;
    const w=document.createElement("div"); w.id=PANEL_ID;
    w.innerHTML=`
<div class="hd" id="ech0-hd"><strong>Bubble Theme Pro</strong><div class="sp"></div><button data-act="close" title="关闭">✕</button></div>

<div class="bar">
  <label><input type="checkbox" id="t-user"> 用户气泡</label>
  <label><input type="checkbox" id="t-assistant"> AI 气泡</label>
  <label><input type="checkbox" id="t-sendbtn"> 发送按钮</label>
  <span class="sep"></span>
  <label>发送按钮跟随
    <select id="followSel"><option value="user">用户</option><option value="assistant">AI</option></select>
  </label>
</div>

<div class="tabs">
  <button class="tab active" data-role="user">编辑：用户</button>
  <button class="tab" data-role="assistant">编辑：AI</button>
  <div class="sp"></div>
  <button class="chipEdit" id="editChipsBtn">编辑主题</button>
</div>

<div class="chipWall" id="chipWall"></div>

<div class="previewRow">
  <div class="previewLabel">预览：</div>
  <div class="previewWrap"><div id="ech0-preview" class="previewBubble">正在输入中.............</div></div>
</div>

<div class="grid">
  <div class="col">
    <div class="item"><label>背景类型</label>
      <select id="mode"><option value="linear">线性渐变</option><option value="radial">放射渐变</option><option value="diffuse">弥散光渐变</option><option value="solid">纯色</option></select>
    </div>
    <div class="item"><label>角度(线性)</label><div class="dual"><input type="range" id="angleR" min="0" max="360" step="1"><input type="number" id="angle" min="0" max="360" step="1"></div></div>

    <div class="item"><label>文字颜色</label>
      <div class="dualColor">
        <input type="text" id="textHex" class="hex" placeholder="#RRGGBB">
        <input type="color" id="textColor">
        <label class="inline"><input type="checkbox" id="autoText"> 自动</label>
      </div>
    </div>

    <div class="item"><label>颜色1</label><div class="dualColor"><input type="text" id="h1" class="hex" placeholder="#RRGGBB"><input type="color" id="c1"></div></div>
    <div class="item"><label>颜色2</label><div class="dualColor"><input type="text" id="h2" class="hex" placeholder="#RRGGBB"><input type="color" id="c2"></div></div>
    <div class="item"><label>颜色3</label><div class="dualColor"><input type="text" id="h3" class="hex" placeholder="#RRGGBB"><input type="color" id="c3"></div></div>

    <div class="item"><label>配重1/2/3(%)</label>
      <div class="weights">
        <div class="row"><input type="range" id="w1r" min="0" max="100" step="1"><input type="number" id="w1" min="0" max="100" step="1"></div>
        <div class="row"><input type="range" id="w2r" min="0" max="100" step="1"><input type="number" id="w2" min="0" max="100" step="1"></div>
        <div class="row"><input type="range" id="w3r" min="0" max="100" step="1" disabled><input type="number" id="w3" min="0" max="100" step="1" readonly></div>
      </div>
    </div>

    <div class="hint" id="weightHint">配重合计：0%（建议=100%）</div>
  </div>

  <div class="col">
    <div class="item"><label>过渡羽化(%)</label><div class="dual"><input type="range" id="softR" min="0" max="50" step="1"><input type="number" id="soft" min="0" max="50" step="1"></div></div>
    <div class="item"><label>透明度</label><div class="dual"><input type="range" id="alphaR" min="0" max="1" step="0.01"><input type="number" id="alpha" min="0" max="1" step="0.01"></div></div>
    <div class="item"><label>磨砂(blur)</label><div class="dual"><input type="range" id="blurR" min="0" max="30" step="1"><input type="number" id="blur" min="0" max="30" step="1"></div></div>
    <div class="item"><label>发光强度</label><div class="dual"><input type="range" id="glowR" min="0" max="1" step="0.01"><input type="number" id="glow" min="0" max="1" step="0.01"></div></div>

    <div class="item"><label>描边色</label>
      <div class="dualColor">
        <input type="text" id="outlineHex" class="hex" placeholder="#RRGGBB">
        <input type="color" id="outlineColor">
      </div>
    </div>

    <div class="item"><label>描边透明</label><div class="dual"><input type="range" id="outlineAlphaR" min="0" max="1" step="0.01"><input type="number" id="outlineAlpha" min="0" max="1" step="0.01"></div></div>
    <div class="item"><label>描边宽(px)</label><div class="dual"><input type="range" id="outlineWidthR" min="0" max="6" step="1"><input type="number" id="outlineWidth" min="0" max="6" step="1"></div></div>

    <div class="item"><label>圆角(px)</label><div class="dual"><input type="range" id="radiusR" min="0" max="40" step="1"><input type="number" id="radius" min="0" max="40" step="1"></div></div>
    <div class="item"><label>内边距-垂直</label><div class="dual"><input type="range" id="padVR" min="0" max="40" step="1"><input type="number" id="padV" min="0" max="40" step="1"></div></div>
    <div class="item"><label>内边距-水平</label><div class="dual"><input type="range" id="padHR" min="0" max="40" step="1"><input type="number" id="padH" min="0" max="40" step="1"></div></div>
  </div>
</div>

<div class="presets">
  <div class="left">
    <input id="presetName" placeholder="预设名称">
    <button data-act="savePreset">另存为</button>
  </div>
  <div class="right">
    <button data-act="save">保存</button>
    <button data-act="reset">重置默认</button>
  </div>
</div>
`;
    document.body.appendChild(w);

    w.querySelector('[data-act="close"]').addEventListener("click",(ev)=>{ ev.stopPropagation(); w.remove(); });

    GM_addStyle(`
#${PANEL_ID}{ position:fixed; z-index:999999; left:50%; top:60px; transform:translateX(-50%);
  width:${CFG.panel.w||560}px; height:${CFG.panel.h||560}px; background:#fff; color:#1b1f24;
  border:1px solid rgba(0,0,0,.12); border-radius:14px; box-shadow:0 16px 48px rgba(0,0,0,.16);
  overflow:auto; resize:both; font:13px/1.35 system-ui, Segoe UI, Arial; cursor:default; }
#${PANEL_ID} .hd{ position:sticky; top:0; z-index:5; display:flex; align-items:center; gap:8px; padding:8px 10px;
  user-select:none; background:#fff; border-bottom:1px solid rgba(0,0,0,.06); border-top-left-radius:14px; border-top-right-radius:14px; cursor:default; }
#${PANEL_ID} .sp{ flex:1; }
#${PANEL_ID} .bar{ display:flex; align-items:center; gap:8px; padding:6px 10px; flex-wrap:wrap; cursor:default; }
#${PANEL_ID} .sep{ width:1px; height:16px; background:rgba(0,0,0,.08); margin:0 4px; }
#${PANEL_ID} .tabs{ display:flex; align-items:center; gap:6px; padding:6px 10px; border-top:1px solid rgba(0,0,0,.06); cursor:default; }
#${PANEL_ID} .tab{ border:1px solid rgba(0,0,0,.12); background:#f5f7fb; border-radius:8px; padding:5px 8px; cursor:default; }
#${PANEL_ID} .tab.active{ background:#e9eef9; }
#${PANEL_ID} .chipEdit{ border:1px solid rgba(0,0,0,.12); background:#fff; border-radius:999px; padding:5px 10px; cursor:default; }
#${PANEL_ID} .chipWall{ display:flex; flex-wrap:wrap; gap:6px; padding:0 10px 6px; border-bottom:1px solid rgba(0,0,0,.06); cursor:default; }
#${PANEL_ID} .chip{ display:flex; align-items:center; gap:6px; padding:5px 8px; border:1px solid rgba(0,0,0,.12); background:#f7f9fc; border-radius:999px; cursor:default; user-select:none; }
#${PANEL_ID} .chip .dot{ width:14px; height:14px; border-radius:999px; border:1px solid rgba(0,0,0,.12); background:linear-gradient(135deg,var(--c1),var(--c2),var(--c3)); }
#${PANEL_ID} .chip .x{ display:none; width:16px; height:16px; border-radius:50%; border:1px solid rgba(0,0,0,.25); background:#fff; line-height:14px; text-align:center; font-size:11px; }
#${PANEL_ID}.editing .chip .x{ display:inline-block; }
#${PANEL_ID} .chip.active{ background:#e9eef9; border-color:rgba(59,130,246,.35); box-shadow: inset 0 0 0 2px rgba(59,130,246,.18); }
#${PANEL_ID} .previewRow{ display:grid; grid-template-columns:56px 1fr; align-items:center; gap:8px; padding:6px 10px; }
#${PANEL_ID} .previewBubble{ display:inline-block; padding:6px 10px; border-radius:12px; border:1px solid rgba(0,0,0,.12); width:fit-content; max-width:100%; white-space:nowrap; }
#${PANEL_ID} .grid{ display:grid; grid-template-columns:1fr 1fr; gap:6px; padding:6px 10px; }
#${PANEL_ID} .col{ display:flex; flex-direction:column; gap:8px; }
#${PANEL_ID} .item{ display:flex; align-items:center; gap:8px; cursor:default; }
#${PANEL_ID} label{ width:116px; color:#3b4250; }
#${PANEL_ID} .bar label{ width:auto!important; display:inline-flex; align-items:center; gap:8px; margin:0; white-space:nowrap; }
#${PANEL_ID} #followSel{ min-width:92px; padding-right:22px; }
#${PANEL_ID} .dual{ display:flex; align-items:center; gap:6px; }
#${PANEL_ID} .dual input[type="range"]{ width:128px; }
#${PANEL_ID} .dual input[type="number"]{ width:56px; height:26px; line-height:26px; font-size:13px; padding:4px 6px; border-radius:7px; cursor:default; }
#${PANEL_ID} .dualColor{ display:flex; align-items:center; gap:6px; }
#${PANEL_ID} .dualColor input.hex{ width:96px; height:26px; line-height:26px; font-size:13px; }
#${PANEL_ID} .dualColor .inline{ display:inline-flex; align-items:center; gap:4px; font-size:12px; color:#64748b; margin-left:6px; }
#${PANEL_ID} .dualColor input:disabled{ opacity:.6; }
#${PANEL_ID} input[type="color"]{ width:34px; height:24px; border:none; background:transparent; cursor:default; }
#${PANEL_ID} input[type="number"], #${PANEL_ID} select, #${PANEL_ID} input[type="text"]{ font-size:13px; height:26px; line-height:26px; padding:4px 6px; border-radius:7px; border:1px solid rgba(0,0,0,.14); background:#fff; cursor:default; }
#${PANEL_ID} input[type="range"]{ -webkit-appearance:none; appearance:none; background:transparent; height:16px; cursor:default; }
#${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track{ height:3px; border-radius:2px; background:#d1d5db; }
#${PANEL_ID} input[type="range"]::-webkit-slider-thumb{ -webkit-appearance:none; appearance:none; width:12px; height:12px; border-radius:50%; background:#4b5563; border:none; margin-top:-4.5px; }
#${PANEL_ID} .weights .row{ display:flex; align-items:center; gap:6px; margin-bottom:2px; }
#${PANEL_ID} .weights input[type="range"]{ width:128px; }
#${PANEL_ID} .weights input[type="number"]{ width:56px; height:26px; line-height:26px; font-size:13px; }
#${PANEL_ID} .hint{ padding-left:116px; color:#6b7280; }
#${PANEL_ID} .presets{ display:flex; justify-content:space-between; align-items:center; gap:8px; padding:8px 10px; border-top:1px solid rgba(0,0,0,.06); cursor:default; }
#${PANEL_ID} .presets .left{ display:flex; align-items:center; gap:6px; }
#${PANEL_ID} .presets input{ width:140px; cursor:default; }
#${PANEL_ID} button{ background:#f5f7fb; border:1px solid rgba(0,0,0,.12); border-radius:8px; padding:5px 10px; cursor:default; }
#${PANEL_ID} #followSel, #${PANEL_ID} #mode{ font-size:12px; height:26px; line-height:26px; padding:0 24px 0 8px; text-align:center; text-align-last:center; cursor:default; }
#${PANEL_ID} #mode{ min-width:128px; }
#${PANEL_ID} #followSel option, #${PANEL_ID} #mode option{ text-align:center; }
@media (max-width: 820px){
  #${PANEL_ID}{ left:50%!important; top:10px!important; transform:translateX(-50%)!important;
    width:min(94vw, ${CFG.panel.w||560}px)!important; height:min(78vh, ${CFG.panel.h||560}px)!important;
    max-width:96vw; max-height:82vh; -webkit-overflow-scrolling:touch; overscroll-behavior:contain; touch-action:auto; }
  #${PANEL_ID} .hd{ touch-action:none; }
  #${PANEL_ID} .grid{ grid-template-columns:1fr; }
  #${PANEL_ID} .previewRow{ grid-template-columns:48px 1fr; }
}`);
    if(CFG.panel.x!=null && CFG.panel.y!=null){ w.style.left=CFG.panel.x+"px"; w.style.top=CFG.panel.y+"px"; w.style.transform="none"; }

    // 拖动
    (function enableDrag(){
      const hd = w.querySelector("#ech0-hd");
      let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
      const clampToViewport = (nx,ny)=>{
        const pad=8, r=w.getBoundingClientRect(), vw=innerWidth, vh=innerHeight;
        nx = Math.max(pad, Math.min(vw - r.width - pad, nx));
        ny = Math.max(pad, Math.min(vh - r.height - pad, ny));
        return { nx, ny };
      };
      const getPoint = (e) => (e.touches && e.touches[0]) || e;
      const isInteractive = (el) => el && el.closest && el.closest('[data-act="close"],button,select,input,textarea,a');
      function onStart(e){ if (isInteractive(e.target)) return;
        const p=getPoint(e); dragging=true; const r=w.getBoundingClientRect(); sx=p.clientX; sy=p.clientY; ox=r.left; oy=r.top;
        if (hd.setPointerCapture && e.pointerId!=null) hd.setPointerCapture(e.pointerId); e.preventDefault(); }
      function onMove(e){ if(!dragging) return; const p=getPoint(e); let nx=ox+(p.clientX-sx), ny=oy+(p.clientY-sy);
        ({nx,ny}=clampToViewport(nx,ny)); w.style.left=nx+"px"; w.style.top=ny+"px"; w.style.transform="none"; e.preventDefault(); }
      function onEnd(){ if(!dragging) return; dragging=false; const r=w.getBoundingClientRect();
        CFG.panel.x=Math.round(r.left); CFG.panel.y=Math.round(r.top); CFG.panel.w=Math.round(r.width); CFG.panel.h=Math.round(r.height); save(CFG); }
      if (window.PointerEvent){ hd.addEventListener("pointerdown", onStart); addEventListener("pointermove", onMove); addEventListener("pointerup", onEnd); }
      else { hd.addEventListener("mousedown", onStart); addEventListener("mousemove", onMove); addEventListener("mouseup", onEnd);
             hd.addEventListener("touchstart", onStart, { passive:false }); addEventListener("touchmove", onMove, { passive:false }); addEventListener("touchend", onEnd); }
      addEventListener("resize", ()=>{ const r=w.getBoundingClientRect(), {nx,ny}=clampToViewport(r.left,r.top); w.style.left=Math.round(nx)+"px"; w.style.top=Math.round(ny)+"px";});
    })();

    const $=(s)=>w.querySelector(s);
    $("#t-user").checked=!!CFG.targets.user;
    $("#t-assistant").checked=!!CFG.targets.assistant;
    $("#t-sendbtn").checked=!!CFG.targets.sendbtn;
    $("#followSel").value=CFG.followOfSendBtn;
    ["t-user","t-assistant","t-sendbtn","followSel"].forEach(id=>{
      $("#"+id).addEventListener("change",()=>{
        CFG.targets.user=$("#t-user").checked;
        CFG.targets.assistant=$("#t-assistant").checked;
        CFG.targets.sendbtn=$("#t-sendbtn").checked;
        CFG.followOfSendBtn=$("#followSel").value;
        save(CFG); NEED_ENSURE = true; requestStyleUpdate();
      });
    });

    let editMode=false, ACTIVE="user";
    const isBuiltin=(name)=> name in THEMES;
    const chipTheme=(name)=> isBuiltin(name)?THEMES[name]:(CFG.customThemes[name]||THEMES["海盐"]);
    function galleryNames(){ const builtins=Object.keys(THEMES), customs=Object.keys(CFG.customThemes||{}), set=new Set([...builtins,...customs]);
      const arr=(CFG.galleryOrder||[]).filter(n=>set.has(n)); for(const n of set){ if(!arr.includes(n)) arr.push(n); } CFG.galleryOrder=arr; save(CFG); return arr; }
    function renderChips(){ const wall=$("#chipWall"); wall.innerHTML=""; const current=CFG.lastTheme[ACTIVE];
      galleryNames().forEach(name=>{ const st=chipTheme(name), btn=document.createElement("div");
        btn.className="chip"; btn.draggable=true; btn.dataset.name=name; if(name===current) btn.classList.add("active");
        btn.innerHTML=`<span class="dot" style="--c1:${st.colors[0]};--c2:${st.colors[1]};--c3:${st.colors[2]}"></span><span class="nm">${name}</span>${isBuiltin(name)?"":'<span class="x" title="删除">×</span>'}`;
        wall.appendChild(btn); }); wall.parentElement.classList.toggle("editing",editMode); }
    function pickThemeByName(name){ CFG.lastTheme[ACTIVE]=name; const over=(CFG.overrides[ACTIVE]||{})[name];
      CFG[ACTIVE]=clone(over||chipTheme(name)); fillForm(); save(CFG); renderChips(); }

    // 标签：用户 / AI
    w.querySelector(".tabs").addEventListener("click",(e)=>{
      const t = e.target.closest(".tab"); if(!t) return;
      const role = t.dataset.role; if(!role || role === ACTIVE) return;
      w.querySelectorAll(".tabs .tab").forEach(x=>x.classList.remove("active")); t.classList.add("active");
      ACTIVE = role; renderChips(); fillForm(); updatePreview();
    });

    $("#editChipsBtn").addEventListener("click",()=>{ editMode=!editMode; $("#editChipsBtn").textContent=editMode?"完成":"编辑主题"; renderChips(); });
    $("#chipWall").addEventListener("click",(e)=>{ const chip=e.target.closest(".chip"); if(!chip) return; const name=chip.dataset.name;
      if(editMode){ if(e.target.classList.contains("x")){ if(isBuiltin(name)) return;
        if(confirm(`删除主题「${name}」？`)){ delete CFG.customThemes[name]; CFG.galleryOrder=CFG.galleryOrder.filter(n=>n!==name); save(CFG); renderChips(); } }
      }else{ pickThemeByName(name); }});
    let dragName=null;
    $("#chipWall").addEventListener("dragstart",(e)=>{ const c=e.target.closest(".chip"); if(!c) return; dragName=c.dataset.name; e.dataTransfer.effectAllowed="move"; });
    $("#chipWall").addEventListener("dragover",(e)=>{ if(!dragName) return; e.preventDefault(); });
    $("#chipWall").addEventListener("drop",(e)=>{ e.preventDefault(); const c=e.target.closest(".chip"); if(!c || !dragName) return;
      const target=c.dataset.name; if(target===dragName) return; const arr=galleryNames(), a=arr.indexOf(dragName), b=arr.indexOf(target);
      arr.splice(b,0,arr.splice(a,1)[0]); CFG.galleryOrder=arr; save(CFG); dragName=null; renderChips(); });
    $("#chipWall").addEventListener("dragend",()=>{ dragName=null; renderChips(); });
    renderChips();

    function bindHex(hexId,colorId){
      const hex=$(hexId), col=$(colorId);
      const setHex = () => { hex.value = (col.value || "#000000").toLowerCase(); };
      const setCol=()=>{ const p=parseColorToHex(hex.value); if(p){ col.value=p; hex.value=p; } };
      setHex(); col.addEventListener("input",()=>{ setHex(); readForm(); requestStyleUpdate(); });
      hex.addEventListener("input",()=>{ setCol(); readForm(); requestStyleUpdate(); });
      hex.addEventListener("change",()=>{ setCol(); readForm(); requestStyleUpdate(); });
      hex.addEventListener("paste",()=>{ setTimeout(()=>{ setCol(); readForm(); requestStyleUpdate(); },0); });
    }
    function bindPair(rangeId,numId,onChange){
      const r=$(rangeId), n=$(numId);
      function sync(from){ if(from==="r"){ n.value=r.value; } else { r.value=n.value; } onChange&&onChange(+n.value); }
      r.addEventListener("input",()=>sync("r")); n.addEventListener("input",()=>sync("n")); sync("n");
    }
    function applyWeightUI(w1,w2){ const w3=clamp(100-w1-w2,0,100); $("#w1r").value=w1; $("#w1").value=w1; $("#w2r").value=w2; $("#w2").value=w2; $("#w3r").value=w3; $("#w3").value=w3; $("#weightHint").textContent=`配重合计：${w1+w2+w3}%（建议=100%）`; }
    function readWeightUIToModel(){ let w1=+$("#w1").value||0, w2=+$("#w2").value||0; if(w1<0) w1=0; if(w1>100) w1=100; if(w2<0) w2=0; if(w1+w2>100) w2=100-w1; const w3=100-w1-w2; applyWeightUI(w1,w2); const s=CFG[ACTIVE]; s.weights=[w1,w2,w3]; return s.weights; }

    $("#w1r").addEventListener("input",()=>{ $("#w1").value=$("#w1r").value; readWeightUIToModel(); requestStyleUpdate(); });
    $("#w2r").addEventListener("input",()=>{ $("#w2").value=$("#w2r").value; readWeightUIToModel(); requestStyleUpdate(); });
    $("#w1").addEventListener("input",()=>{ readWeightUIToModel(); requestStyleUpdate(); });
    $("#w2").addEventListener("input",()=>{ readWeightUIToModel(); requestStyleUpdate(); });

    function fillForm(){
      const s=CFG[ACTIVE];
      $("#mode").value=s.mode; $("#angle").value=s.angle; $("#angleR").value=s.angle;

      $("#textColor").value=s.textColor||"#101418"; $("#textHex").value=$("#textColor").value.toLowerCase();
      $("#autoText").checked=!!s.autoText; const dis=!!s.autoText;
      $("#textHex").disabled=dis; $("#textColor").disabled=dis;
      $("#autoText").onchange=()=>{ const on=$("#autoText").checked; $("#textHex").disabled=on; $("#textColor").disabled=on; readForm(); requestStyleUpdate(); };

      $("#c1").value=s.colors[0]||"#000000"; $("#h1").value=$("#c1").value.toLowerCase();
      $("#c2").value=s.colors[1]||"#000000"; $("#h2").value=$("#c2").value.toLowerCase();
      $("#c3").value=s.colors[2]||"#000000"; $("#h3").value=$("#c3").value.toLowerCase();

      const w1=s.weights?.[0]??34, w2=s.weights?.[1]??33; applyWeightUI(w1,w2);

      $("#soft").value=s.soft??SOFT; $("#softR").value=$("#soft").value;
      $("#alpha").value=s.alpha; $("#alphaR").value=s.alpha;
      $("#blur").value=s.blur; $("#blurR").value=s.blur;
      $("#glow").value=s.glow; $("#glowR").value=$("#glow").value;

      $("#outlineColor").value=s.outlineColor; $("#outlineHex").value=$("#outlineColor").value.toLowerCase();
      $("#outlineAlpha").value=s.outlineAlpha; $("#outlineAlphaR").value=$("#outlineAlpha").value;
      $("#outlineWidth").value=s.outlineWidth; $("#outlineWidthR").value=$("#outlineWidth").value;

      $("#radius").value=s.radius; $("#radiusR").value=s.radius;
      $("#padV").value=s.padV; $("#padVR").value=$("#padV").value;
      $("#padH").value=s.padH; $("#padHR").value=$("#padH").value;

      bindHex("#h1","#c1"); bindHex("#h2","#c2"); bindHex("#h3","#c3"); bindHex("#textHex","#textColor"); bindHex("#outlineHex","#outlineColor");
      bindPair("#angleR","#angle",()=>{ CFG[ACTIVE].angle=+$("#angle").value; });
      bindPair("#softR","#soft",()=>{ CFG[ACTIVE].soft=+$("#soft").value; });
      bindPair("#alphaR","#alpha",()=>{ CFG[ACTIVE].alpha=+$("#alpha").value; });
      bindPair("#blurR","#blur",()=>{ CFG[ACTIVE].blur=+$("#blur").value; });
      bindPair("#glowR","#glow",()=>{ CFG[ACTIVE].glow=+$("#glow").value; });
      bindPair("#outlineAlphaR","#outlineAlpha",()=>{ CFG[ACTIVE].outlineAlpha=+$("#outlineAlpha").value; });
      bindPair("#outlineWidthR","#outlineWidth",()=>{ CFG[ACTIVE].outlineWidth=+$("#outlineWidth").value; });
      bindPair("#radiusR","#radius",()=>{ CFG[ACTIVE].radius=+$("#radius").value; });
      bindPair("#padVR","#padV",()=>{ CFG[ACTIVE].padV=+$("#padV").value; });
      bindPair("#padHR","#padH",()=>{ CFG[ACTIVE].padH=+$("#padH").value; });

      requestStyleUpdate();
    }
    function readForm(){
      const s=CFG[ACTIVE];
      s.mode=$("#mode").value; s.angle=+$("#angle").value;
      s.autoText=$("#autoText").checked;
      const parsedText=parseColorToHex($("#textHex").value)||$("#textColor").value; s.textColor=parsedText||s.textColor||"#101418";
      s.colors=[$("#c1").value,$("#c2").value,$("#c3").value].filter(Boolean);
      s.weights=readWeightUIToModel();
      s.soft=+$("#soft").value; s.alpha=+$("#alpha").value; s.blur=+$("#blur").value; s.glow=+$("#glow").value;
      const parsedOutline=parseColorToHex($("#outlineHex").value)||$("#outlineColor").value; s.outlineColor=parsedOutline||"#000000";
      s.outlineAlpha=+$("#outlineAlpha").value; s.outlineWidth=+$("#outlineWidth").value;
      s.radius=+$("#radius").value; s.padV=+$("#padV").value; s.padH=+$("#padH").value;

      const tname=CFG.lastTheme[ACTIVE]; if(!CFG.overrides[ACTIVE]) CFG.overrides[ACTIVE]={};
      CFG.overrides[ACTIVE][tname]=clone(s);
      save(CFG);
    }

    w.querySelector(".grid").addEventListener("input",()=>{ readForm(); requestStyleUpdate(); });
    w.querySelector(".grid").addEventListener("change",()=>{ readForm(); requestStyleUpdate(); });

    w.querySelector('[data-act="save"]').addEventListener("click",()=>{ save(CFG); alert("已保存配置"); });
    w.querySelector('[data-act="savePreset"]').addEventListener("click",()=>{
      const name=$("#presetName").value.trim(); if(!name){ alert("请输入预设名称"); return; }
      if(THEMES[name] && !confirm("同名内置主题已存在，是否覆盖为自定义？")) return;
      if(!CFG.customThemes) CFG.customThemes={};
      CFG.customThemes[name]=clone(CFG[ACTIVE]); CFG.galleryOrder=[...new Set([name,...CFG.galleryOrder])];
      CFG.lastTheme[ACTIVE]=name; delete (CFG.overrides[ACTIVE]||{})[name]; save(CFG); renderChips(); pickThemeByName(name); alert("已另存为自定义主题");
    });
    w.querySelector('[data-act="reset"]').addEventListener("click",()=>{
      const name=CFG.lastTheme[ACTIVE];
      const source=isBuiltin(name)?THEMES[name]:CFG.customThemes[name];
      if(!source){ alert("未找到默认主题定义"); return; }
      if(CFG.overrides[ACTIVE]) delete CFG.overrides[ACTIVE][name];
      CFG[ACTIVE]=clone(source); save(CFG); fillForm(); requestStyleUpdate(); alert("已重置为默认");
    });

    fillForm();
  }

  function updatePreview(){
    const wp = document.getElementById("ech0-preview");
    if (!wp) return;
    const active = document.querySelector(`#${PANEL_ID} .tab.active`);
    const role = active ? active.dataset.role : "user";
    const s = role === "assistant" ? CFG.assistant : CFG.user;

    const bg = makeBackground(s);
    const outline = rgba(s.outlineColor, s.outlineAlpha);
    const border = (s.outlineAlpha <= 0 || s.outlineWidth <= 0) ? "none" : `${s.outlineWidth}px solid ${outline}`;
    const text = s.autoText ? (themeLuma(s)>0.55 ? "#000" : "#fff") : (s.textColor || "#111");
    const blurPx = IS_MOBILE ? Math.min(s.blur, 4) : s.blur;

    wp.style.background = bg;
    wp.style.border = border;
    wp.style.borderRadius = s.radius + "px";
    wp.style.padding = `${s.padV}px ${s.padH}px`;
    wp.style.color = text;
    wp.style.webkitTextFillColor = text;
    wp.style.webkitBackdropFilter = `blur(${blurPx}px)`;
    wp.style.backdropFilter = `blur(${blurPx}px)`;
    wp.style.boxShadow = makeGlow(s.outlineColor, s.glow);
    wp.textContent = "正在输入中.............";
  }

  // 面板开关（只此一处声明）
  const togglePanel = () => {
    const p = document.getElementById(PANEL_ID);
    if (p) { p.remove(); } else { openPanel(); }
  };
  document.addEventListener("keydown", (e) => {
    if (e.altKey && e.key.toLowerCase() === "g") { e.preventDefault(); togglePanel(); }
  });
  GM_registerMenuCommand("打开/关闭设置面板 (Alt+G)", togglePanel);

  // 初次渲染
  NEED_ENSURE = true;
  requestStyleUpdate();

  // 监听新节点：仅置位“需要归拢”，由节流器统一更新
  const mo = new MutationObserver(() => { NEED_ENSURE = true; requestStyleUpdate(); });
  mo.observe(document.querySelector("main") || document.documentElement, { childList: true, subtree: true });

})();
