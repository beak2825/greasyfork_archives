// ==UserScript==
// @name         Phantom-Render 0-ms Translate (CN)
// @namespace    BlackHat.Tech/PhantomRender
// @version      1.0
// @description  首帧即中文：抢占 Cookie + 并行脚本 + 幽灵渲染 + 启发式完成检测。
// @author       ￴
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546896/Phantom-Render%200-ms%20Translate%20%28CN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546896/Phantom-Render%200-ms%20Translate%20%28CN%29.meta.js
// ==/UserScript==

(() => {
  /* 0  · 若本身含大量中文直接退出 */
  const zh = /[\u4e00-\u9fff]/;
  if ( zh.test(document.title) ||
       zh.test((document.documentElement.innerText||'').slice(0,4096)) ) return;

  /* 1 · 抢占：写 googtrans，欺骗服务器"必须中文" */
  const LANG = '/auto/zh-CN';
  document.cookie          = `googtrans=${LANG};path=/;max-age=63072000`;
  localStorage.googtrans   = LANG;
  sessionStorage.googtrans = LANG;

  /* 2 · 基础占位 + CSS 隐身，避免英文闪烁 */
  document.head.insertAdjacentHTML('afterbegin', `
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
    <link rel="dns-prefetch" href="//translate.google.com">
    <link rel="preconnect"  href="https://translate.google.com" crossorigin>
    <link rel="dns-prefetch" href="//translate.googleapis.com">
    <link rel="preconnect"  href="https://translate.googleapis.com" crossorigin>
    <style id="phantom-css">
      body{visibility:hidden!important;opacity:0!important;
           transition:opacity .3s;top:0!important}
      body.phantom-show{visibility:visible!important;opacity:1!important}
      .skiptranslate,#google_translate_element,
      .goog-te-banner-frame,.goog-te-balloon-frame,
      .goog-logo-link,.goog-te-gadget span{display:none!important}
      
      /* 保留 Markdown 链接原始颜色 */
      a font[color] {
        color: inherit !important;
      }
      .markdown-body a font,
      .markdown a font,
      [class*="markdown"] a font,
      article a font,
      .content a font,
      .post a font,
      .article-content a font,
      main a font {
        color: inherit !important;
      }
      a {
        color: revert !important;
      }
      .markdown-body a,
      .markdown a,
      [class*="markdown"] a,
      article a,
      .content a,
      .post a,
      .article-content a,
      main a {
        color: revert !important;
      }
    </style>
  `);
  const phDiv = document.createElement('div');
  phDiv.id = 'google_translate_element';
  phDiv.style.display='none';
  document.documentElement.appendChild(phDiv);

  /* 3 · Google 回调 */
  window.__phInit = () => new google.translate.TranslateElement({
      pageLanguage:'auto',
      includedLanguages:'zh-CN',
      autoDisplay:true,
      layout:google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');

  /* 4 · 并行拉脚本（带缓存）*/
  const SRC = 'https://translate.google.com/translate_a/element.js?cb=__phInit';
  const sc  = document.createElement('script');
  sc.src   = SRC;
  sc.defer = sc.async = true;
  document.head.appendChild(sc);

  /* 5 · 启发式"翻译完成"检测 + Reveal */
  const reveal = () => {
    document.body.classList.add('phantom-show');
    addRestoreBtn();
    fixLinkColors();
    obs && obs.disconnect();
  };
  let timer, obs;
  const waitBody = new MutationObserver((m, o)=>{
    if(!document.body) return;
    o.disconnect();
    obs = new MutationObserver(()=>{
      clearTimeout(timer);
      timer = setTimeout(reveal, 250);   // 250 ms 静默：判定完成
    });
    obs.observe(document.body,{childList:true,subtree:true,characterData:true});
    setTimeout(reveal, 5000);            // 5 s 保险
  });
  waitBody.observe(document.documentElement,{childList:true,subtree:true});

  /* 修复链接颜色 */
  function fixLinkColors() {
    // 移除 Google 翻译添加的 font 标签的 color 属性
    const fonts = document.querySelectorAll('a font[color]');
    fonts.forEach(font => {
      font.removeAttribute('color');
    });
  }

  /* 6 · 恢复原文按钮 */
  function addRestoreBtn(){
    const btn = document.createElement('div');
    btn.textContent='原文';
    Object.assign(btn.style,{
      position:'fixed',right:'20px',bottom:'28px',padding:'6px 14px',
      background:'#ff4d4f',color:'#fff',borderRadius:'6px',
      fontSize:'13px',fontFamily:'sans-serif',cursor:'pointer',
      zIndex:'2147483647',userSelect:'none',opacity:0.6,
      boxShadow:'0 2px 6px rgba(0,0,0,.25)',transition:'opacity .2s'
    });
    btn.onmouseenter=()=>btn.style.opacity=1;
    btn.onmouseleave=()=>btn.style.opacity=0.6;
    btn.onclick=()=>{
      /* 清 cookie → 刷新即回英文；再次点击可再翻译 */
      const exp='Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie=`googtrans=;expires=${exp};path=/;`;
      localStorage.removeItem('googtrans');
      sessionStorage.removeItem('googtrans');
      location.reload();
    };
    document.body.appendChild(btn);
  }
})();