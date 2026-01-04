// ==UserScript==
// @name         ChatGPT Black-Gold (v3.4.4, black bg + gold text selection + global AI toolbar & header share)
// @namespace    lukas.tools
// @version      3.4.4
// @description  基于 v3.4 的稳定版：用户气泡黑金（短消息也亮）；发送/语音/停止按钮黑金；输入框与 AI 消息选中文本=黑底金字；Alt+G 开关。新增：AI 消息下方工具栏（Copy/Like/Dislike/Read/Canvas/Share/Try again）默认黑金，悬停金色高亮；右上 Share 与弹窗 Create link 黑金。严格排除代码块 Copy 与 Canvas 预览 Copy，保持默认。
// @license      MIT
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545504/ChatGPT%20Black-Gold%20%28v344%2C%20black%20bg%20%2B%20gold%20text%20selection%20%2B%20global%20AI%20toolbar%20%20header%20share%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545504/ChatGPT%20Black-Gold%20%28v344%2C%20black%20bg%20%2B%20gold%20text%20selection%20%2B%20global%20AI%20toolbar%20%20header%20share%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ======================= CSS ======================= */
  const CSS = `
:root{
  --deep:#07080a;
  --deep2:#0f1013;
  --gold-hi:#ffd95a;    /* 高光金（更黄） */
  --gold:#ffc93a;       /* 正金 */
  --gold-mid:#e9b030;
  --gold-edge:#956a0a;
  --ivory:#fff7e6;      /* 用户气泡内文字更亮 */
  --ivory-2:#f0e6c5;
  --edge:#2a2c31;
}

.chat-bgb-on *{ transition: background-color .15s, color .15s, border-color .15s, box-shadow .15s, opacity .15s; }

/* ===== 按钮：发送 / 语音 / 停止 与 通用工具按钮 ===== */
.chat-bgb-on .bgb-action{
  color:var(--gold-hi) !important;
  background:
    linear-gradient(18deg, rgba(255,232,140,.36) 0%, rgba(255,232,140,0) 14%),
    radial-gradient(120% 160% at 30% -20%, rgba(255,217,90,.42), transparent 58%),
    linear-gradient(180deg, var(--deep2), var(--deep)) !important;
  border:1px solid var(--gold) !important;
  border-radius:9999px !important;
  box-shadow:0 0 0 1px rgba(149,106,10,.35) inset, 0 10px 24px rgba(255,217,90,.18);
}
.chat-bgb-on .bgb-action:hover{
  background:linear-gradient(180deg, var(--gold-hi), var(--gold)) !important;
  color:#151515 !important;
}
.chat-bgb-on .bgb-action svg{ color:inherit !important; fill:currentColor !important; }

/* ===== 仅用户气泡（AI 不改外观） ===== */
.chat-bgb-on .bgb-user{
  position:relative; color:var(--ivory);
  background:
    linear-gradient(16deg, rgba(255,232,140,.22) 0%, rgba(255,232,140,0) 12%),
    radial-gradient(200px 120px at 22% 6%, rgba(255,217,90,.28), rgba(255,217,90,0) 60%),
    radial-gradient(85% 120% at 16% -18%, rgba(255,201,58,.16), rgba(255,201,58,0) 62%),
    linear-gradient(180deg, #14161b, #0a0b0e) !important;
  border-radius:22px; box-shadow:0 12px 28px rgba(255,217,90,.08); overflow:hidden;
}
.chat-bgb-on .bgb-user::before{
  content:""; position:absolute; inset:0; border-radius:inherit; padding:1.25px;
  background:linear-gradient(135deg, var(--gold-hi) 0%, var(--gold) 42%, var(--gold-edge) 72%, var(--gold-hi) 100%);
  -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude; pointer-events:none;
}
.chat-bgb-on .bgb-user::after{
  content:""; position:absolute; inset:2px; border-radius:inherit;
  background:
    linear-gradient(180deg, rgba(255,255,255,.12), rgba(255,255,255,0) 14%),
    linear-gradient(180deg, rgba(0,0,0,0) 68%, rgba(0,0,0,.26) 100%);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.02); pointer-events:none;
}
.chat-bgb-on .bgb-user :is(p,span,li,div){ text-shadow:0 1px 0 rgba(0,0,0,.22); }
.chat-bgb-on .bgb-user a{ color:var(--gold-hi) !important; }
.chat-bgb-on .bgb-user code, .chat-bgb-on .bgb-user pre{
  background:#0f1114 !important; color:var(--ivory) !important; border:1px solid var(--edge) !important;
}
.chat-bgb-on .bgb-user svg{ color:var(--ivory-2); fill:currentColor; }

/* ===== 选中（Selection）：黑底金字 ===== */
.chat-bgb-on .bgb-composer::selection, .chat-bgb-on .bgb-composer *::selection{ background: var(--deep) !important; color: var(--gold-hi) !important; }
.chat-bgb-on .bgb-assistSel::selection, .chat-bgb-on .bgb-assistSel *::selection{ background: var(--deep) !important; color: var(--gold-hi) !important; }
`;

  const STYLE_ID = 'bgb-style-v344';

  function injectCSS(){
    if (!document.getElementById(STYLE_ID)){
      const s = document.createElement('style');
      s.id = STYLE_ID; s.textContent = CSS; document.documentElement.appendChild(s);
    }
    document.documentElement.classList.add('chat-bgb-on');
  }

  /* ======================= 用户气泡定位（仅用户） ======================= */
  function findBubble(turn){
    const divs = turn.querySelectorAll('div');
    let best=null, score=-1;
    for (const el of divs){
      if (el.closest('form')) continue;
      const cs = getComputedStyle(el);
      if (cs.display==='inline') continue;
      const r = ['borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius']
        .map(k=>parseFloat(cs[k])||0).reduce((a,b)=>a+b,0);
      if (r < 20) continue;
      const bg = cs.backgroundColor; if (!bg || /rgba?\(0,\s*0,\s*0,\s*0\)/.test(bg)) continue;
      const pad = ['paddingTop','paddingRight','paddingBottom','paddingLeft']
        .map(k=>parseFloat(cs[k])||0).reduce((a,b)=>a+b,0);
      const rect = el.getBoundingClientRect();
      const sc = pad + r + Math.min(rect.width, 900) + Math.min(rect.height, 600);
      if (sc > score){ best = el; score = sc; }
    }
    return best;
  }
  function styleUserTurn(turn){
    if (turn.dataset.messageStyled==='1') return;
    if (turn.getAttribute('data-message-author-role')!=='user') return;
    const bubble = findBubble(turn); if (!bubble) return;
    bubble.classList.add('bgb-user');
    turn.dataset.messageStyled='1';
  }
  function styleAllUserTurns(){ document.querySelectorAll('[data-message-author-role]').forEach(styleUserTurn); }

  /* ======================= 选中区域标记 ======================= */
  function markComposer(){
    const el = document.querySelector('form textarea, form [contenteditable="true"][role="textbox"]');
    const box = el ? (el.closest('form') || el) : null;
    if (box && !box.classList.contains('bgb-composer')) box.classList.add('bgb-composer');
  }
  function markAssistantSelection(){
    document.querySelectorAll('[data-message-author-role="assistant"]').forEach(el=>{
      if (!el.classList.contains('bgb-assistSel')) el.classList.add('bgb-assistSel');
    });
  }

  /* ======================= 发送/语音/停止 ======================= */
  function isVoice(btn){
    const t=(btn.getAttribute('aria-label')||btn.title||'').toLowerCase();
    const id=(btn.getAttribute('data-testid')||'').toLowerCase();
    return /voice|microphone|mic|语音|麦克/.test(t) || /voice|microphone|mic/.test(id);
  }
  function isSend(btn){
    const t=(btn.getAttribute('aria-label')||'').toLowerCase();
    const id=(btn.getAttribute('data-testid')||'').toLowerCase();
    return /send|发送/.test(t) || /send/.test(id);
  }
  function isStop(btn){
    const t=(btn.getAttribute('aria-label')||'').toLowerCase();
    const id=(btn.getAttribute('data-testid')||'').toLowerCase();
    return /stop|停止|cancel|中止/.test(t) || /stop/.test(id);
  }
  function markActions(){
    document.querySelectorAll('form button').forEach(b=>{
      if (b.classList.contains('bgb-action')) return;
      if (isSend(b) || isVoice(b) || isStop(b)) b.classList.add('bgb-action');
    });
  }

  /* ======================= 工具栏（全局扫描） ======================= */
  function bgb_isExcluded(btn){
    const label=(btn.getAttribute('aria-label')||btn.title||btn.innerText||'').toLowerCase();
    const testid=(btn.getAttribute('data-testid')||'').toLowerCase();
    // 代码/编辑器区的 Copy（保持默认）
    if (/copy\s*code|复制代码|代码|code/.test(label) || /copy.*code|copy-code|code-copy/.test(testid)) return true;
    if (btn.closest('pre, code, [data-testid*="code" i], [data-testid*="copy-code" i], .cm-editor, .monaco-editor')) return true;
    // Canvas 预览（未展开）右上角 Copy（保持默认）
    if (/copy/.test(label) && btn.closest('[data-kind*="canvas" i], [data-testid*="canvas" i], figure')) return true;
    return false;
  }
  function bgb_isToolbarButton(btn){
    const lab=(btn.getAttribute('aria-label')||btn.title||btn.innerText||'').toLowerCase();
    const id =(btn.getAttribute('data-testid')||'').toLowerCase();
    let hit = /\b(copy|share|like|dislike|good|bad|read|朗读|speak|audio|canvas|try\s*again|retry|regenerate|more|更多|反馈|feedback|赞|踩|复制|分享|画布)\b/.test(lab)
           || /(copy|share|like|dislike|read|speak|audio|canvas|retry|regenerate|more|overflow|feedback)/.test(id);
    if (!hit){
      const svg = btn.querySelector('[aria-label],[title]');
      const svgl = (svg && (svg.getAttribute('aria-label')||svg.getAttribute('title')||'').toLowerCase()) || '';
      hit = /\b(copy|share|like|dislike|read|speak|audio|canvas|retry|regenerate|more|feedback)\b/.test(svgl);
    }
    return hit;
  }
  function markGlobalToolbar(){
    const CAND=':is(button,[role="button"],a[href])';
    document.querySelectorAll(CAND).forEach(btn=>{
      if (btn.classList.contains('bgb-action')) return;
      if (bgb_isExcluded(btn)) return;
      if (!bgb_isToolbarButton(btn)) return;
      btn.classList.add('bgb-action');
    });
    // 顶部 Share（右上角）
    document.querySelectorAll('header ' + CAND).forEach(b=>{
      const t=(b.getAttribute('aria-label')||b.title||'').toLowerCase();
      const id=(b.getAttribute('data-testid')||'').toLowerCase();
      if (/share|分享/.test(t) || /share/.test(id)) b.classList.add('bgb-action');
    });
    // Share 弹窗里的 Create link
    document.querySelectorAll('[role="dialog"] ' + CAND).forEach(b=>{
      const t=(b.getAttribute('aria-label')||b.title||b.innerText||'').toLowerCase();
      const id=(b.getAttribute('data-testid')||'').toLowerCase();
      if (/create.*link/.test(t) || (/create|link/.test(id) && /share|link/.test(id))) b.classList.add('bgb-action');
    });
  }

  /* ======================= Init & Observe ======================= */
  function runAll(){
    injectCSS();
    styleAllUserTurns();
    markComposer();
    markAssistantSelection();
    markActions();
    markGlobalToolbar();
  }

  runAll();

  const mo = new MutationObserver(()=>{ runAll(); });
  mo.observe(document.documentElement, {subtree:true, childList:true});

  // Alt+G 开关（持久化）
  window.addEventListener('keydown', e=>{
    if (e.altKey && (e.key==='g' || e.key==='G')){
      e.preventDefault();
      const on = document.documentElement.classList.toggle('chat-bgb-on');
      localStorage.setItem('bgb_on', on ? 'on' : 'off');
    }
  }, true);
  if (localStorage.getItem('bgb_on')==='off'){
    document.documentElement.classList.remove('chat-bgb-on');
  }
})();
