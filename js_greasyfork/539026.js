// ==UserScript==
// @name         Skirbblio FR 0.3
// @namespace    https://greasyfork.org/en/users/1084087-infornia
// @version      0.3.0
// @description  Aide au jeu skribbl.io avec un dictionnaire étendu de mots français (simples + composés)
// @author       fermion
// @match        https://skribbl.io/*
// @match        https://www.skribbl.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @locale       fr
// @downloadURL https://update.greasyfork.org/scripts/539026/Skirbblio%20FR%2003.user.js
// @updateURL https://update.greasyfork.org/scripts/539026/Skirbblio%20FR%2003.meta.js
// ==/UserScript==

(function(){
  'use strict';

  /*** MODULE 1: WordListManager ***/
  class WordListManager {
    constructor(key){
      this.key = key;
      this.correct = new Set(GM_getValue(key, []));
      this.freq = [];
      this.big = new Set();
    }

    async init(){
      const urls = [
        'https://raw.githubusercontent.com/HubTou/dict-fr-AU-DELA/main/dict-fr-AU-DELA-common-compound-words.combined',
        'https://raw.githubusercontent.com/HubTou/dict-fr-AU-DELA/main/dict-fr-AU-DELA-common-words.combined',
        'https://raw.githubusercontent.com/words/an-array-of-french-words/main/index.json'
      ];

      const [compoundsTxt, simplesTxt, jsonArr] = await Promise.all(
        urls.map(u => fetch(u).then(r => r.ok ? r.text() : ''))
      );

      let words = [];
      try {
        const jsonWords = JSON.parse(jsonArr);
        words = [
          ...compoundsTxt.split('\n'),
          ...simplesTxt.split('\n'),
          ...jsonWords
        ];
      } catch (e) {
        console.error("Erreur JSON : ", e);
        words = [
          ...compoundsTxt.split('\n'),
          ...simplesTxt.split('\n')
        ];
      }

      const cleaned = words
        .map(w => w.trim().toLowerCase())
        .filter(Boolean);

      this.freq = cleaned;
      cleaned.forEach(w => this.big.add(w));
      this.correct.forEach(w => this.big.add(w));
      this.save();
    }

    save(){ GM_setValue(this.key, [...this.correct]); }
    add(w){ if(!this.correct.has(w)){ this.correct.add(w); this.save(); } }
    rank(w){ const i = this.freq.indexOf(w); return i >= 0 ? i : this.freq.length; }

    filter(cands, pattern, parts, close, guessed, prefix){
      return cands.filter(w => {
        if(guessed.has(w)) return false;
        if(close && levenshtein(w, close) > 1) return false;
        if(w.split(' ').length !== parts.length) return false;
        if(!new RegExp(`^${pattern}$`, 'i').test(w)) return false;
        if(prefix && !w.startsWith(prefix)) return false;
        return true;
      }).map(w => ({ w, score: this.rank(w) }))
        .sort((a, b) => a.score - b.score)
        .map(o => o.w);
    }
  }

  /*** MODULE 2: GuessEngine ***/
  class GuessEngine {
    constructor(wm){
      this.wm = wm;
      this.guessed = new Set();
      this.close = '';
    }
    reset(){ this.guessed.clear(); this.close = ''; }
    noteClose(w){ this.close = w; }
    onReveal(w){ this.wm.add(w); }
    generate(hints, input){
      const patt = hints.map(ch => ch === '_' ? '.' : ch).join('');
      const parts = patt.split(' ');
      return this.wm.filter([...this.wm.big], patt, parts, this.close, this.guessed, input);
    }
    remember(w){ this.guessed.add(w); }
  }

  /*** MODULE 3: GuiManager ***/
  class GuiManager {
    constructor(onClick, onExport){
      this.createUI();
      this.exportBtn.onclick = onExport;
      this.showSavedBtn.onclick = () => this.renderSaved();
      document.addEventListener('keydown', e => {
        if(e.key === 'F2'){
          const vis = this.panel.style.display !== 'none';
          this.panel.style.display = vis ? 'none' : 'block';
          GM_setValue('visible', !vis);
        }
      });
    }

    createUI(){
      this.panel = document.createElement('div');
      Object.assign(this.panel.style, {
        position:'fixed', bottom:'0', right:'0', width:'100%',
        background:'#fff', zIndex:9999, boxShadow: '0 -2px 6px rgba(0,0,0,0.2)'
      });
      document.body.appendChild(this.panel);

      this.exportBtn = document.createElement('button');
      this.exportBtn.textContent = 'Export';
      Object.assign(this.exportBtn.style, {
        position:'absolute', bottom:'100%', right:'0', margin:'5px'
      });
      this.panel.appendChild(this.exportBtn);

      this.showSavedBtn = document.createElement('button');
      this.showSavedBtn.textContent = 'Mots enregistrés';
      Object.assign(this.showSavedBtn.style, {
        position:'absolute', bottom:'100%', right:'80px', margin:'5px'
      });
      this.panel.appendChild(this.showSavedBtn);

      this.container = document.createElement('div');
      Object.assign(this.container.style, {
        display:'flex', flexWrap:'wrap', gap:'6px',
        maxHeight:'200px', overflowY:'auto', padding:'10px'
      });
      this.panel.appendChild(this.container);

      const vis = GM_getValue('visible', true);
      this.panel.style.display = vis ? 'block' : 'none';
    }

    render(list, inputEl, engine){
      this.container.innerHTML = '';
      list.slice(0, 100).forEach((w, i) => {
        const div = document.createElement('div');
        div.textContent = w;
        Object.assign(div.style, {
          fontWeight:'bold', padding:'5px',
          background:`hsl(${360*i/(list.length||1)},100%,50%)`,
          color:'#fff', cursor:'pointer', borderRadius:'4px'
        });
        div.onclick = () => {
          inputEl.value = w;
          engine.remember(w);
          engine.wm.add(w);
          const form = document.querySelector('#game-chat form');
          form.dispatchEvent(new Event('submit', { bubbles:true, cancelable:true }));
        };
        this.container.appendChild(div);
      });
    }

    renderSaved(){
      this.container.innerHTML = '';
      const list = [...GM_getValue('correctAnswers', [])].sort();
      list.forEach((w, i) => {
        const div = document.createElement('div');
        div.textContent = w;
        Object.assign(div.style, {
          fontWeight:'bold', padding:'5px',
          background:`hsl(${360*i/(list.length||1)},60%,45%)`,
          color:'#fff', borderRadius:'4px'
        });
        this.container.appendChild(div);
      });
    }
  }

  /*** UTILS ***/
  function levenshtein(a,b){
    const m=a.length,n=b.length;
    const M=Array.from({length:n+1},(_,i)=>[i]);
    for(let j=0;j<=m;j++) M[0][j]=j;
    for(let i=1;i<=n;i++) for(let j=1;j<=m;j++)
      M[i][j]=(b[i-1]===a[j-1]?M[i-1][j-1]:Math.min(M[i-1][j-1]+1,M[i][j-1]+1,M[i-1][j]+1));
    return M[n][m];
  }

  /*** MAIN ***/
  async function main(){
    const wm = new WordListManager('correctAnswers');
    await wm.init();

    const engine = new GuessEngine(wm);
    const gui = new GuiManager(null, exportNew);
    gui.onGuess = w => engine.remember(w);

    const inputEl = document.querySelector('#game-chat input');

    function update(){
      const hints = [...document.querySelectorAll('.hints .hint')].map(e => e.textContent);
      const list = engine.generate(hints, inputEl.value.trim());
      gui.render(list, inputEl, engine);
    }

    function exportNew(){
      const a = document.createElement('a');
      const blob = new Blob([[...wm.correct].join('\n')], {type:'text/plain;charset=utf-8'});
      a.href = URL.createObjectURL(blob);
      a.download = 'words.txt';
      a.click();
    }

    ['input','keydown'].forEach(ev => inputEl.addEventListener(ev, update));

    const hintObs = new MutationObserver(m => update());
    document.querySelectorAll('.hints .container, .words, #game-word')
      .forEach(el => el && hintObs.observe(el, {childList:true,subtree:true}));

    const chatObs = new MutationObserver(muts => {
      muts.forEach(mut => mut.addedNodes.forEach(node => {
        const msg = node.textContent || '';
        const col = getComputedStyle(node).color;

        if(col==='rgb(226, 203, 0)' && msg.includes('is close!')){
          engine.noteClose(msg.split(' ')[0]);
        }

        if(col==='rgb(57, 117, 206)'){
          engine.reset();
        }

        if([...document.querySelectorAll('.hints .hint')].every(e=>e.classList.contains('uncover'))){
          const correct = [...document.querySelectorAll('.hints .hint')]
            .map(e => e.textContent).join(' ').toLowerCase();
          engine.onReveal(correct);
        }
      }));
    });

    const chatC = document.querySelector('.chat-content');
    if(chatC) chatObs.observe(chatC, {childList:true});

    update();
  }

  main();
})();
