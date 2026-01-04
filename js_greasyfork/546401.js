// ==UserScript==
// @name         THM Advisor (Evoplay Texas Hold'em 3D) – v1.0
// @namespace    casino-tools
// @version      1.0
// @description  Advisor-only HUD. Preflop Call/Fold (BB rules) + Flop/Turn EV logic (per hand or per unit + HEW). No clicking.
// @match        https://run.steam-games-powered.com/*
// @match        https://*/table/evoplay/*
// @match        https://*.evoplay.games/*
// @all-frames   true
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546401/THM%20Advisor%20%28Evoplay%20Texas%20Hold%27em%203D%29%20%E2%80%93%20v10.user.js
// @updateURL https://update.greasyfork.org/scripts/546401/THM%20Advisor%20%28Evoplay%20Texas%20Hold%27em%203D%29%20%E2%80%93%20v10.meta.js
// ==/UserScript==

(() => {
  if (!/(evoplay|steam-games-powered\.com\/table)/i.test(String(location.href||''))) return;

  const VERSION = '1.0';
  const $=(s,r=document)=>r.querySelector(s);

  /* --------------------------- State --------------------------- */
  const S = {
    step:'idle',
    hole:[], flop:[], turn:null, river:null,
    baseBet:0, stakeOut:0,
    odds:{win:null, loss:null, tie:null, samples:0},
    optimization:'hand',    // 'hand' | 'unit'
    rules:'standard',       // 'standard' | 'vuetec'
  };

  /* --------------------------- HUD ----------------------------- */
  const SU_SYM={hearts:'♥',spades:'♠',clubs:'♣',diamonds:'♦'};
  function upRank(r){ const t=String(r).toUpperCase(); return t==='T'?'10':t; }
  function fmt(n){ return Number(n||0).toFixed(2); }
  function pct(x){ return (x*100).toFixed(2)+'%'; }

  function buildHUD(){
    if ($('#thm-advisor')) return;
    const html=`
    <div id="thm-advisor" data-thm style="position:fixed;top:10px;right:10px;z-index:2147483647;font:13px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#e7eaf6">
      <div style="background:#151833;border:1px solid #2a2f5c;border-radius:10px;padding:10px 12px;width:410px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <div style="width:8px;height:8px;border-radius:99px;background:#2ecc71"></div>
          <div style="font-weight:600">THM Advisor <span style="opacity:.7">v${VERSION}</span></div>
          <div id="thm-mini" style="margin-left:auto;opacity:.8"></div>
        </div>

        <div style="display:flex;gap:8px;margin-bottom:8px">
          <label style="display:flex;gap:6px;align-items:center;background:#1a1e3a;border:1px solid #2a2f5c;border-radius:8px;padding:6px 8px">
            <span style="font-size:12px;color:#9aa3cc">Optimization</span>
            <select id="thm-opt" style="font-size:12px;background:#0e1125;color:#e7eaf6;border:1px solid #2a2f5c;border-radius:6px;padding:4px">
              <option value="hand">Per hand (EV &gt; 0)</option>
              <option value="unit">Per unit (EV+HEW &gt; 0)</option>
            </select>
          </label>
          <label style="display:flex;gap:6px;align-items:center;background:#1a1e3a;border:1px solid #2a2f5c;border-radius:8px;padding:6px 8px">
            <span style="font-size:12px;color:#9aa3cc">Rules</span>
            <select id="thm-rules" style="font-size:12px;background:#0e1125;color:#e7eaf6;border:1px solid #2a2f5c;border-radius:6px;padding:4px">
              <option value="standard">Standard</option>
              <option value="vuetec">Vuetec</option>
            </select>
          </label>
        </div>

        <div style="background:#1a1e3a;border:1px solid #2a2f5c;border-radius:8px;padding:8px;margin-bottom:8px">
          <div style="font-size:11px;color:#9aa3cc;margin-bottom:2px">Cards</div>
          <div id="thm-cards">—</div>
          <div style="font-size:11px;color:#9aa3cc;margin-top:6px">Board</div>
          <div id="thm-board">—</div>
        </div>

        <div style="background:#0e1125;border:1px solid #2a2f5c;border-radius:8px;padding:10px">
          <div style="font-size:11px;color:#9aa3cc;margin-bottom:4px">Recommendation</div>
          <div id="thm-adv-action" style="font-weight:700;font-size:16px">—</div>
          <div id="thm-adv-reason" style="opacity:.9;margin-top:6px;white-space:pre-line"></div>
          <div id="thm-odds" style="opacity:.85;margin-top:8px;font:12px ui-monospace,Menlo,Consolas,monospace"></div>
        </div>

        <details style="margin-top:10px">
          <summary style="cursor:pointer">Debug / Info</summary>
          <div id="thm-info" style="margin-top:6px;font:12px ui-monospace,Menlo,Consolas,monospace;white-space:pre-wrap"></div>
        </details>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    $('#thm-opt').value=S.optimization;
    $('#thm-rules').value=S.rules;
    $('#thm-opt').onchange=e=>{ S.optimization=e.target.value; refreshHUD(); };
    $('#thm-rules').onchange=e=>{ S.rules=e.target.value; refreshHUD(); };
    refreshHUD();
  }

  function refreshHUD(info){
    $('#thm-mini')?.replaceChildren(document.createTextNode(`Step ${S.step} • Stake ${fmt(S.stakeOut)} • Ante ${fmt(S.baseBet)}`));

    $('#thm-cards')?.replaceChildren(document.createTextNode(
      S.hole.length ? S.hole.map(c=>`${upRank(c.rank)}${SU_SYM[c.suit]||''}`).join(' ') : '—'
    ));

    const f=(S.flop||[]).map(c=>`${upRank(c.rank)}${SU_SYM[c.suit]||''}`).join(' ');
    const t=S.turn?`${upRank(S.turn.rank)}${SU_SYM[S.turn.suit]}`:'';
    const r=S.river?`${upRank(S.river.rank)}${SU_SYM[S.river.suit]}`:'';
    $('#thm-board')?.replaceChildren(document.createTextNode(
      [ f?`Flop: ${f}`:null, t?`Turn: ${t}`:null, r?`River: ${r}`:null ].filter(Boolean).join(' · ') || '—'
    ));

    const rec = advise();
    $('#thm-adv-action')?.replaceChildren(document.createTextNode(rec.action||'—'));
    $('#thm-adv-reason')?.replaceChildren(document.createTextNode(rec.reason||''));

    const o=$('#thm-odds');
    if(o && S.odds.samples){
      const EV = S.odds.win - S.odds.loss;
      o.textContent = `Win ${pct(S.odds.win)} • Loss ${pct(S.odds.loss)} • Tie ${pct(S.odds.tie)} • EV ${fmt(EV)} • n=${S.odds.samples}`;
    } else if (o) {
      o.textContent = '';
    }

    if(info) $('#thm-info').textContent = info;
  }

  /* --------------------- Packet → Cards (sniffer) ---------------------- */
  const FULLSTATE_RX=/\/fullstate\/html5\/evoplay\//i;

  function toCards(obj){
    const arr=[]; for(const k of Object.keys(obj||{}).sort((a,b)=>Number(a)-Number(b))){
      const c=obj[k]; if(c && c.rank && c.suit) arr.push({rank:String(c.rank), suit:String(c.suit)});
    } return arr;
  }

  function onPacket(pkt){
    const spin=pkt?.spin||{};
    const steps=Object.values(spin.steps||{});
    const hands=spin.hands||{};
    const h0=hands['0'] || Object.values(hands)[0] || {};
    const dealer=spin.dealer||{};

    const ante=Number(h0.ante||0); if(ante>0) S.baseBet=ante;
    const total_bet=Number(spin.total_bet||0); if(Number.isFinite(total_bet)) S.stakeOut=total_bet;

    S.hole = toCards(h0?.cards||{});
    const mc = toCards(dealer?.mutual_cards||{});
    S.flop=mc.slice(0,3); S.turn=mc[3]||null; S.river=mc[4]||null;

    // Street inference
    S.step = (S.flop.length===0) ? 'PREFLOP'
       : (!S.turn)           ? 'FLOP'
       : (!S.river)          ? 'TURN'
       :                       'RIVER';

    // Update odds only when action remains (preflop needs no odds; flop/turn do)
    updateOdds();
    refreshHUD(JSON.stringify({
      step:S.step,
      hole:S.hole,
      board:[...S.flop, ...(S.turn?[S.turn]:[]), ...(S.river?[S.river]:[])],
      ante:S.baseBet, stake:S.stakeOut
    }, null, 2));
  }

  function installSniffer(){
    if(window.__thm_sniffer) return; window.__thm_sniffer=true;

    const _fetch=window.fetch;
    window.fetch = async (...a)=>{
      const res=await _fetch(...a);
      try{
        const url = a[0] instanceof Request ? a[0].url : String(a[0]||'');
        if(FULLSTATE_RX.test(url)){
          res.clone().json().then(onPacket)
            .catch(()=>res.clone().text().then(t=>{ try{onPacket(JSON.parse(t))}catch{} }));
        }
      }catch{}
      return res;
    };

    const oOpen=XMLHttpRequest.prototype.open, oSend=XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open=function(m,u,...r){ this.__url=u; return oOpen.call(this,m,u,...r); };
    XMLHttpRequest.prototype.send=function(body){
      this.addEventListener('load', ()=>{
        try{
          const url=this.__url||''; if(!FULLSTATE_RX.test(url)) return;
          const t=this.responseText||this.response; if(!t) return;
          onPacket(JSON.parse(t));
        }catch{}
      });
      return oSend.apply(this, arguments);
    };
  }

  /* --------------------- Odds (Monte Carlo) ---------------------- */
  const RANKS=['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
  const RV = Object.fromEntries(RANKS.map((r,i)=>[r,i]));
  const SUITS=['hearts','diamonds','clubs','spades'];
  function canon(r){ r=String(r).toUpperCase(); return r==='T'?'10':r; }

  function streetSamples(){
    switch(S.step){
      case 'FLOP': return 8000;
      case 'TURN': return 20000;
      default:     return 0; // preflop/river: no odds needed for decision
    }
  }
  function deck52(){
    const out=[]; for(const r of RANKS){ for(const s of SUITS){ const c={rank:r,suit:s}; out.push({code:`${r}-${s}`,card:c}); } } return out;
  }
  function best5of7(cards){
    const ranks=cards.map(c=>canon(c.rank)), suits=cards.map(c=>c.suit);
    const byRank=new Map(), bySuit=new Map();
    ranks.forEach(r=>byRank.set(r,(byRank.get(r)||0)+1));
    suits.forEach(s=>bySuit.set(s,(bySuit.get(s)||0)+1));

    let flushSuit=null; for(const [s,c] of bySuit) if(c>=5){ flushSuit=s; break; }
    function straightTop(vals){
      const s=new Set(vals); if(s.has(RV['A'])) s.add(-1);
      const a=[...s].sort((x,y)=>x-y); let run=1, top=-1;
      for(let i=1;i<a.length;i++){ if(a[i]===a[i-1]+1){ run++; if(run>=5) top=a[i]; } else run=1; }
      return top;
    }

    const allVals=cards.map(c=>RV[canon(c.rank)]);
    let sf=-1, st=-1;
    if(flushSuit){
      const fvals=cards.filter(c=>c.suit===flushSuit).map(c=>RV[canon(c.rank)]);
      sf=straightTop(fvals);
    }
    st=straightTop(allVals);

    const groups=[...byRank.entries()].map(([r,c])=>({r,c,v:RV[r]})).sort((a,b)=> b.c-b.c || b.v-b.v);
    const valsDesc=allVals.sort((a,b)=>b-a);

    if(sf>=0) return [8, sf];
    if(groups[0]?.c===4){ const q=groups[0].v; const k=valsDesc.find(v=>v!==q); return [7,q,k]; }
    if(groups[0]?.c===3 && (groups[1]?.c>=2)) return [6, groups[0].v, groups[1].v];
    if(flushSuit){ const f=cards.filter(c=>c.suit===flushSuit).map(c=>RV[canon(c.rank)]).sort((a,b)=>b-a).slice(0,5); return [5, ...f]; }
    if(st>=0) return [4, st];
    if(groups[0]?.c===3){ const t=groups[0].v; const ks=valsDesc.filter(v=>v!==t).slice(0,2); return [3,t,...ks]; }
    if(groups[0]?.c===2 && groups[1]?.c===2){ const hi=Math.max(groups[0].v,groups[1].v); const lo=Math.min(groups[0].v,groups[1].v); const k=valsDesc.find(v=>v!==hi && v!==lo); return [2,hi,lo,k]; }
    if(groups[0]?.c===2){ const p=groups[0].v; const ks=valsDesc.filter(v=>v!==p).slice(0,3); return [1,p,...ks]; }
    return [0, ...valsDesc.slice(0,5)];
  }
  function cmpHands(a,b){ for(let i=0;i<Math.max(a.length,b.length);i++){ const x=a[i]??-999, y=b[i]??-999; if(x!==y) return x-y; } return 0; }

  function monteCarloOdds(hole, board, samples){
    const need=5-board.length; if(need<0) return {win:0,loss:0,tie:0,samples:0};
    if(samples<=0) return {win:0,loss:0,tie:0,samples:0};
    const deck=deck52();
    const seen=[...hole,...board].map(c=>`${canon(c.rank)}-${c.suit}`);
    const avail=deck.filter(x=>!seen.includes(x.code));

    let win=0, loss=0, tie=0, n=0;
    function drawK(arr,k){ for(let i=arr.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr.slice(0,k); }

    for(let t=0;t<samples;t++){
      const pool=avail.slice();
      const draw=drawK(pool, need+2);
      const rest=draw.slice(0,need).map(x=>x.card);
      const dealerHole=draw.slice(need,need+2).map(x=>x.card);

      const my7=[...hole,...board,...rest];
      const dl7=[...dealerHole,...board,...rest];
      const a=best5of7(my7), b=best5of7(dl7);
      const r=cmpHands(a,b);
      if(r>0) win++; else if(r<0) loss++; else tie++;
      n++;
    }
    return {win:win/n, loss:loss/n, tie:tie/n, samples:n};
  }

  function updateOdds(){
    // Only needed on FLOP/TURN (there is an action there).
    const boardLen = S.flop.length + (S.turn?1:0) + (S.river?1:0);
    if (boardLen===0 || boardLen===5){ S.odds={win:null,loss:null,tie:null,samples:0}; refreshHUD(); return; }
    const board=[...S.flop, ...(S.turn?[S.turn]:[])];
    S.odds = monteCarloOdds(S.hole, board, streetSamples());
    refreshHUD();
  }

  /* ---------------- BB Decision Logic (mapped) ---------------- */
  // Preflop rule from the site:
  // If offsuit and contains a 2 with the OTHER card in {3,4,5,6,7} → Fold
  // Vuetec + optimization=hand adds: offsuit 3-4 → Fold
  function preflopAdvice(){
    if(S.hole.length<2) return {action:'—', reason:'Waiting for cards…'};
    const [c1,c2]=S.hole;
    const s1=c1.suit[0], s2=c2.suit[0];
    const offsuit = s1!==s2;

    const rstr='23456789tjqka';
    const r0=(c1.rank+'').toLowerCase().replace('10','t').replace('1','a')[0];
    const r1=(c2.rank+'').toLowerCase().replace('10','t').replace('1','a')[0];
    const i0=rstr.indexOf(r0), i1=rstr.indexOf(r1);
    const min=Math.min(i0,i1), max=Math.max(i0,i1);

    if(offsuit && min===0 && max>0 && max<6){
      return {action:'Fold', reason:'Offsuit 2 with 3–7 (BB preflop rule).'};
    }
    if(S.rules==='vuetec' && S.optimization==='hand' && offsuit && min===1 && max===2){
      return {action:'Fold', reason:'Vuetec special: offsuit 3–4 (BB preflop rule).'};
    }
    return {action:'Call (use Call button)', reason:'BB rule: Play preflop.'};
  }

  // Postflop EV rule:
  // EV = Win% - Loss%
  // If optimization='unit' → compare EV + HEW (0.0053 standard, 0.0147 vuetec)
  function postflopAdvice(){
    const e=S.odds;
    if(!e || !Number.isFinite(e.win)) return {action:'—', reason:'Computing odds…'};
    const EV = e.win - e.loss;
    const HEW = (S.rules==='vuetec') ? 0.0147 : 0.0053;

    if(S.optimization==='unit'){
      if(EV + HEW > 0) return {action:'Bet (use Coins)', reason:`Per unit: EV ${fmt(EV)} + HEW ${fmt(HEW)} > 0`};
      return {action:'Check', reason:`Per unit: EV ${fmt(EV)} + HEW ${fmt(HEW)} ≤ 0`};
    } else {
      if(EV > 0) return {action:'Bet (use Coins)', reason:`Per hand: EV ${fmt(EV)} > 0`};
      return {action:'Check', reason:`Per hand: EV ${fmt(EV)} ≤ 0`};
    }
  }

  function advise(){
    switch(S.step){
      case 'PREFLOP': return preflopAdvice();
      case 'FLOP':
      case 'TURN':    return postflopAdvice();
      case 'RIVER':   return {action:'—', reason:'No bet after river.'};
      default:        return {action:'—', reason:'Waiting…'};
    }
  }

  /* --------------------------- Boot --------------------------- */
  function init(){ buildHUD(); installSniffer(); }
  if (document.readyState==='complete'||document.readyState==='interactive') init();
  else window.addEventListener('DOMContentLoaded', init);
})();
