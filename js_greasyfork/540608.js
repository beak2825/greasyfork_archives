// ==UserScript==
// @name         Auto Dịch Tiếng Việt Bôi Đen
// @namespace    https://github.com/thuyetabd/Boi-Den-Dich-Tieng-Viet/
// @version      2.0
// @description  Bôi đen văn bản, click 🌐 để dịch sang Tiếng Việt; click lần nữa để hoàn nguyên.
// @author       Phan Đình Thuyết - https://www.facebook.com/phandinhthuyet/
// @match        http://*/*
// @match        https://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      translate.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/540608/Auto%20D%E1%BB%8Bch%20Ti%E1%BA%BFng%20Vi%E1%BB%87t%20B%C3%B4i%20%C4%90en.user.js
// @updateURL https://update.greasyfork.org/scripts/540608/Auto%20D%E1%BB%8Bch%20Ti%E1%BA%BFng%20Vi%E1%BB%87t%20B%C3%B4i%20%C4%90en.meta.js
// ==/UserScript==

(() => {
  'use strict';

  /* ---------- CSS ---------- */
  GM_addStyle(`
    #vi-icon{position:fixed;z-index:2147483646;cursor:pointer;font-size:18px;padding:4px 7px;background:#fff8;border:1px solid #aaa;border-radius:5px;box-shadow:0 2px 6px rgba(0,0,0,.35);user-select:none;display:none;transition:background .2s}
    #vi-icon:hover{background:#fff}
    .vi-translated{background:rgba(255,255,0,.12);border-radius:3px;cursor:pointer;}
  `);

  /* ---------- State ---------- */
  let icon, selText='', selRange=null, translatedSpan=null;

  /* ---------- Helpers ---------- */
  const translate = (text, cb) => {
    const url=`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=${encodeURIComponent(text)}`;
    GM_xmlhttpRequest({method:'GET',url,onload:r=>{
      if(r.status===200){
        try{const data=JSON.parse(r.responseText);const t=data[0].map(s=>s[0]).join('');cb(null,t);}catch(e){cb(e);} }
      else cb(new Error(r.status));
    },onerror:e=>cb(e),ontimeout:()=>cb(new Error('timeout'))});
  };

  /* ---------- Icon ---------- */
  function ensureIcon(){ if(icon) return; icon=document.createElement('div'); icon.id='vi-icon'; icon.textContent='🌐'; document.body.appendChild(icon);
    icon.onmousedown=e=>e.stopPropagation();
    icon.onclick=e=>{e.stopPropagation(); onIcon(); hideIcon();};
  }
  const showIcon=(x,y)=>{ensureIcon(); icon.style.left=x+'px'; icon.style.top=y+'px'; icon.style.display='block';};
  const hideIcon=()=>{icon&& (icon.style.display='none');};

  /* ---------- Actions ---------- */
  function onIcon(){
    // Nếu đang chọn span đã dịch -> hoàn nguyên
    if(translatedSpan){
      const original=translatedSpan.dataset.original;
      translatedSpan.replaceWith(document.createTextNode(original));
      translatedSpan=null;
      return;
    }
    if(!selText||!selRange) return;
    translate(selText,(err,res)=>{
      if(err||!res) return alert('Không dịch được');
      const span=document.createElement('span');
      span.className='vi-translated';
      span.dataset.original=selText;
      span.textContent=res;
      selRange.deleteContents();
      selRange.insertNode(span);
    });
  }

  /* ---------- Selection handling ---------- */
  document.addEventListener('mouseup',e=>{
    if(icon&&icon.contains(e.target)) return;
    setTimeout(()=>{
      const sel=window.getSelection();
      if(!sel.rangeCount){ hideIcon(); return; }
      const text=sel.toString().trim();
      if(text){
        selText=text;
        selRange=sel.getRangeAt(0).cloneRange();
        translatedSpan=selRange.startContainer.parentElement?.closest('.vi-translated')||null;
        const rects=selRange.getClientRects();
        const rect=rects.length?rects[rects.length-1]:selRange.getBoundingClientRect();
        showIcon(rect.right+5,rect.bottom+5);
      }else hideIcon();
    },0);
  });

  document.addEventListener('mousedown',e=>{if(!(icon&&icon.contains(e.target))) hideIcon();});

})(); 
