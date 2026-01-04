// ==UserScript==
// @name         GoBattle.io Combo Double Jump
// @namespace    http://tampermonkey.net/
// @version      6.9
// @description  Gobattle 
// @match        https://gobattle.io/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @author       Nightwave
// @downloadURL https://update.greasyfork.org/scripts/546914/GoBattleio%20Combo%20Double%20Jump.user.js
// @updateURL https://update.greasyfork.org/scripts/546914/GoBattleio%20Combo%20Double%20Jump.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const TIMING = {
    dash:   { hold: 20, gap: 20 },     // ultra-fast double dash
    jump:   { hold: 70, gap: 60 },     // jump hold
    turn1:  { hold: 140, gap: 30 },    // first half of split turn
    turn2:  { hold: 140, gap: 50 },    // second half of split turn
    ultra:  { hold: 20, gap: 20 }      // Down Down → V ultra-fast
  };

  // Segment 1: Double Jump → Double Dash → Split Turn
  const SEG1 = [
    {key:'ArrowUp',   t:'jump'},      // first jump
    {key:'ArrowUp',   t:'jump'},      // second jump
    {key:'ArrowLeft', t:'dash'},
    {key:'ArrowLeft', t:'dash'},
    {key:'ArrowRight', t:'turn1'},
    {key:'ArrowRight', t:'turn2'}
  ];

  // Segment 2: Down Down → V ultra-fast
  const SEG2 = [
    {key:'ArrowDown', t:'ultra'},
    {key:'ArrowDown', t:'ultra'},
    {key:'KeyV',      t:'ultra'}
  ];

  const MIRROR = { ArrowLeft:'ArrowRight', ArrowRight:'ArrowLeft' };
  const mirrorSeq = seq => seq.map(s => ({...s, key: MIRROR[s.key]||s.key}));

  const origAdd = EventTarget.prototype.addEventListener;
  const downL = [], upL = [];
  EventTarget.prototype.addEventListener = function(type, fn, opt){
    if (type==='keydown' && typeof fn==='function') downL.push({t:this,f:fn});
    if (type==='keyup' && typeof fn==='function') upL.push({t:this,f:fn});
    return origAdd.call(this,type,fn,opt);
  };

  const codes = {
    ArrowLeft:[37,'ArrowLeft'], ArrowUp:[38,'ArrowUp'], ArrowRight:[39,'ArrowRight'], ArrowDown:[40,'ArrowDown'],
    KeyV:[86,'v']
  };

  function makeEvt(type, code){
    const c = codes[code] || [0, code];
    return {
      type,key:c[1],code,keyCode:c[0],which:c[0],repeat:false,
      altKey:false,ctrlKey:false,shiftKey:false,metaKey:false,
      target:document.activeElement||document.body,
      preventDefault(){},stopPropagation(){},stopImmediatePropagation(){}
    };
  }

  function fire(type,code){
    if (!code) return;
    const e = makeEvt(type,code);
    const list = type==='keydown'?downL:upL;
    for(const {t,f} of list){try{f.call(t,e);}catch{}}
  }

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));

  async function tap(key,t){
    fire('keydown',key);
    await sleep(t.hold);
    fire('keyup',key);
    await sleep(t.gap);
  }

  async function runCombo(seq){
    const canvas=document.querySelector('canvas'); if(canvas) canvas.focus();
    for(const {key,t} of seq){ await tap(key,TIMING[t]); }
  }

  async function runFullCombo(seq1, seq2){
    await runCombo(seq1);
    await runCombo(seq2);
    // Release all keys to prevent stuck movement
    for(const k of ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyV']) fire('keyup',k);
  }

  window.addEventListener('keydown',e=>{
    if(e.repeat)return;
    if(/INPUT|TEXTAREA/.test((e.target&&e.target.tagName)||''))return;
    if(e.key.toLowerCase()==='h'){e.preventDefault();runFullCombo(SEG1, SEG2);}
    if(e.key.toLowerCase()==='g'){e.preventDefault();runFullCombo(mirrorSeq(SEG1), mirrorSeq(SEG2));}
  },true);

})();
