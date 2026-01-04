// ==UserScript==
// @name         Tool Box
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Replacer Antisonde auto & détection Discord + affichage colonies
// @author       Tristoune
// @match        *://s1.fourmizzz.fr/*
// @match        *://s2.fourmizzz.fr/*
// @match        *://s3.fourmizzz.fr/*
// @grant        GM_xmlhttpRequest
// @connect      s1.fourmizzz.fr
// @connect      s2.fourmizzz.fr
// @connect      s3.fourmizzz.fr
// @connect      discord.com
// @run-at       document-idle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/numeral.js/2.0.6/numeral.min.js
// @require      https://update.greasyfork.org/scripts/534999/MultiFlood.user.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534923/Tool%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/534923/Tool%20Box.meta.js
 // ==/UserScript==
(function(){
  'use strict';

  // ─── CSS Colonies ───────────────────────────────────────────────────────────
  const cssCol = `
    .colonies_zzzelp{ text-align:left; padding-left:15%; padding-bottom:10px; }
    .ligne_colonies_zzzelp{ width:30%; line-height:2.3em; display:inline-block; }
    @media(max-width:976px){ .ligne_colonies_zzzelp{ width:45%; } }
    @media(max-width:600px){ .ligne_colonies_zzzelp{ width:90%; } }
    .boite_membre.colonies_zzzelp_box{
      margin:auto;
      border:1px solid;
      background-color:#d7c384;
      padding:5px;
      margin-bottom:20px;
    }
  `;
  $('<style>').text(cssCol).appendTo('head');

  // ─── CSS Toolbox Icons & Text ────────────────────────────────────────────────
  const cssTool = `
    #toolbox .contenu_boite_compte_plus ul li a {
      position: relative;
      display: block;
      width: 100%;
      text-align: center;
      padding: 4px 0;
    }
    #toolbox .contenu_boite_compte_plus ul li a .icon {
      position: absolute;
      left: 12px;
    }
  `;
  $('<style>').text(cssTool).appendTo('head');

  // ─── Stockage ───────────────────────────────────────────────────────────────
  const H         = location.host.replace(/[.:]/g,'_');
  const K_AS_DOME = H + '_as_dome';
  const K_AS_TDC  = H + '_as_tdc';
  const K_PS      = H + '_auto_place_sec';
  const K_DS      = H + '_auto_detect_sec';
  const K_PE      = H + '_auto_place_on';
  const K_DE      = H + '_auto_detect_on';
  const K_WH      = H + '_discord_wh';

  let asDome    = +localStorage.getItem(K_AS_DOME) || 5;
  let asTdc     = +localStorage.getItem(K_AS_TDC)  || 1;
  let placeSec  = +localStorage.getItem(K_PS)     || 0;
  let detectSec = +localStorage.getItem(K_DS)     || 30;
  let placeOn   = localStorage.getItem(K_PE)==='true';
  let detectOn  = localStorage.getItem(K_DE)==='true';
  let webhook   = localStorage.getItem(K_WH)    || '';

  // ─── Discord ────────────────────────────────────────────────────────────────
  function sendDiscord(msg, cb){
    if(!webhook){
      console.log('[🐜] webhook non configuré');
      if(cb) cb();
      return;
    }
    GM_xmlhttpRequest({
      method:  'POST',
      url:     webhook,
      headers: {'Content-Type':'application/json'},
      data:    JSON.stringify({content: msg}),
      onload:  r=>{
        console.log(`[🐜] Discord → ${r.status}`);
        if(cb) cb();
      },
      onerror: ()=>{
        console.log('[🐜] Erreur Discord');
        if(cb) cb();
      }
    });
  }

  // ─── Replace Antisonde ───────────────────────────────────────────────────────
  function performReplaceAntisonde(){
    const CORR = [1,2,3,4,5,6,14,7,8,9,10,13,11,12];
    const $sim = $('.simulateur').first();
    if(!$sim.length) return;
    let idx = -1;
    $sim.find('tr[align=center]').each((i,tr)=>{
      const $td = $(tr).find('td');
      const tdc = numeral($td.eq(2).find('span').text()).value()||0;
      let dome=0; $td.slice(3,-2).each((_,c)=> dome+=numeral($(c).text()).value()||0);
      const loge = numeral($td.eq(-2).text()).value()||0;
      if(tdc+dome+loge>0 && idx<0) idx = i;
    });
    if(idx<0) return;
    const choix = CORR[idx];
    const $t    = $('#t'), name=$t.attr('name'), val=$t.val();
    const base  = `http://${location.host}/Armee.php`;

    // 1) Autorisation
    $.post(`${base}?deplacement=3&${name}=${val}`, ()=>{
      // 2) Vers Dôme
      $.post(`${base}?Transferer=Envoyer`
             +`&LieuOrigine=3&LieuDestination=2`
             +`&ChoixUnite=unite${choix}`
             +`&nbTroupes=${asDome}`
             +`&${name}=${val}`, ()=>{
        // 3) Vers TDC
        $.post(`${base}?Transferer=Envoyer`
               +`&LieuOrigine=3&LieuDestination=1`
               +`&ChoixUnite=unite${choix}`
               +`&nbTroupes=${asTdc}`
               +`&${name}=${val}`, ()=>{
          // alerte Discord puis reload
          sendDiscord(`✅ Antisonde replacé : Dôme=${asDome}, TDC=${asTdc}`, ()=>location.reload());
        });
      });
    });
  }

  // ─── Détection des troupes ennemies ───────────────────────────────────────────
  function detectOtherTroops(){
    GM_xmlhttpRequest({
      method: 'GET',
      url:    `${location.protocol}//${location.host}/Armee.php`,
      onload(res){
        const doc = new DOMParser().parseFromString(res.responseText,'text/html');
        doc.querySelectorAll('span.cliquable').forEach(sp=>{
          const m = (sp.getAttribute('onclick')||'').match(/remplirFormulaire\((\d+),'(\w+)',2,3\)/);
          if(!m) return;
          const cnt = +m[1], u = m[2];
          if(u!=='unite1' && cnt>0){
            const row  = sp.closest('tr'),
                  d    = row.querySelector('div.pas_sur_telephone'),
                  nm   = d ? d.textContent.trim() : row.cells[0].textContent.trim();
            sendDiscord(`⚠️ Alerte : ${cnt.toLocaleString()}×${nm} en fourmilière`);
          }
        });
      }
    });
  }

  // ─── Colonies UI & Logic ─────────────────────────────────────────────────────
  function removeEl(el){ el?.parentNode?.removeChild(el); }
  function formatSuffix(n){
    if(n>=1e9) return (n/1e9).toFixed(2).replace(/\.?0+$/,'')+'G';
    if(n>=1e6) return (n/1e6).toFixed(2).replace(/\.?0+$/,'')+'M';
    if(n>=1e3) return (n/1e3).toFixed(2).replace(/\.?0+$/,'')+'K';
    return ''+n;
  }
  function collectColonies(){
    const box = document.querySelector('#centre center .boite_membre');
    if(!box) return [];
    const rows = Array.from(box.querySelectorAll('tr')), list = [];
    rows.forEach(r=>{
      if(r.cells[0]?.textContent.trim()===''){
        const a = r.querySelector('a');
        if(a) list.push({ name:a.textContent.trim(), url:a.href });
        removeEl(r);
      }
    });
    return list;
  }
  function fetchInfo(div,p){
    fetch(`Membre.php?Pseudo=${encodeURIComponent(p)}`)
      .then(r => r.text())
      .then(html => {
        const d  = new DOMParser().parseFromString(html,'text/html');
        const al = d.querySelector('.boite_membre table a[href*="classementAlliance.php?"]');
        const tag = al ? `<a target="_blank" href="${al.href}">${al.textContent.trim()}</a>` : '-';
        const raw = d.querySelector('.tableau_score')?.rows[1]?.cells[1]?.textContent.trim()||'';
        const num = parseInt(raw.replace(/\D+/g,''),10)||0;
        const tdc = formatSuffix(num);
        div.innerHTML = `<a target="_blank" href="${div.dataset.url}">${p}</a> ( <span class="TAG_colonies_zzzelp">${tag}</span> <span class="TDC_colonies_zzzelp">${tdc}</span> )`;
      })
      .catch(console.error);
  }
  function enhanceProfile(){
    const cols = collectColonies();
    if(!cols.length) return;
    const box = document.createElement('div');
    box.className = 'boite_membre colonies_zzzelp_box';
    box.innerHTML = `
      <h4>Colonies</h4>
      <div class="colonies_zzzelp" style="display:none">
        ${cols.map(c=>`<div class="ligne_colonies_zzzelp" data-url="${c.url}">${c.name} (…)</div>`).join('')}
      </div>`;
    const centre = document.querySelector('#centre center'),
          pbs    = centre.querySelectorAll('.boite_membre');
    if(pbs.length>=2) pbs[1].parentNode.insertBefore(box,pbs[1].nextSibling);
    else centre.appendChild(box);
    box.querySelectorAll('.ligne_colonies_zzzelp').forEach((d,i)=>fetchInfo(d,cols[i].name));
  }
  function toggleColoniesBox(){
    const list = document.querySelector('.colonies_zzzelp');
    if(!list) return;
    list.style.display = list.style.display==='none'?'':'none';
  }

  // ─── Paramètres Panel ────────────────────────────────────────────────────────
  function createPanel(){
    if($('#fourmizzz-panel').length) return;
    $(`
      <div id="fourmizzz-panel" style="
        position:fixed; top:400px; right:45px;
        background:#fff; border:2px solid #333;
        padding:10px; z-index:99999;
        font:12px Arial,sans-serif;
        width:260px; max-height:80vh;
        overflow-y:auto; box-shadow:0 0 8px rgba(0,0,0,0.3);
        border-radius:4px; display:none;
      ">
        <h4 style="margin:0 0 6px;color:#f90">⚙️ Paramètres Antisonde</h4>
        <label>Antisonde Dôme :</label><br>
        <input id="as-dome" type="number" value="${asDome}" style="width:100%;margin-bottom:6px;"><br>
        <label>Antisonde TDC :</label><br>
        <input id="as-tdc" type="number" value="${asTdc}" style="width:100%;margin-bottom:12px;"><br>
        <label>Webhook Discord :</label><br>
        <input id="discord-webhook" type="text" placeholder="https://discord.com/api/…" value="${webhook}" style="width:100%;margin-bottom:12px;"><br>
        <label><input id="place-on" type="checkbox" ${placeOn?'checked':''}> Auto-Replacer (sec <input id="place-sec" type="number" min="0" max="59" value="${placeSec}" style="width:50px;">)</label><br><br>
        <label><input id="detect-on" type="checkbox" ${detectOn?'checked':''}> Auto-Détection (sec <input id="detect-sec" type="number" min="0" max="59" value="${detectSec}" style="width:50px;">)</label>
      </div>
    `).appendTo('body')
      .find('#as-dome').on('input',    e=>{ asDome=+e.target.value; localStorage.setItem(K_AS_DOME,asDome); })
      .end().find('#as-tdc').on('input', e=>{ asTdc=+e.target.value;  localStorage.setItem(K_AS_TDC,asTdc); })
      .end().find('#discord-webhook').on('change', e=>{ webhook=e.target.value; localStorage.setItem(K_WH,webhook); })
      .end().find('#place-on').on('change',  e=>{ placeOn=e.target.checked; localStorage.setItem(K_PE,placeOn); })
      .end().find('#place-sec').on('input',  e=>{ let v=Math.min(59,Math.max(0,+e.target.value)); placeSec=v; localStorage.setItem(K_PS,v); e.target.value=v; })
      .end().find('#detect-on').on('change', e=>{ detectOn=e.target.checked; localStorage.setItem(K_DE,detectOn); })
      .end().find('#detect-sec').on('input', e=>{ let v=Math.min(59,Math.max(0,+e.target.value)); detectSec=v; localStorage.setItem(K_DS,v); e.target.value=v; });
  }
  function togglePanel(){ $('#fourmizzz-panel').toggle(); }

  // ─── CSS & Boîte Outils d’origine ────────────────────────────────────────────
  function injectToolbox(){
    if($('#toolbox').length) return;
    $(`
      <div id="toolbox" class="boite_compte_plus" style="
        position:fixed; top:100px; right:100px;
        width:190px; background:#525543;
        border-radius:4px; font:13px Arial,sans-serif;
        color:#d3d9b8; text-align:center; z-index:1000;
      ">
        <div class="titre_colonne_cliquable" style="font-size:16px;">Boîte Outils</div>
        <div class="contenu_boite_compte_plus">
          <ul style="list-style:none;margin:0;padding:60px 0;">
            <li style="margin-bottom:12px;">
              <a href="javascript:void(0)" id="tool-params" style="font-size:14px;color:#d3d9b8;text-decoration:none;cursor:pointer;">
                <span class="icon">⚙️</span><span class="label">Paramètres</span>
              </a>
            </li>
            <li style="margin-bottom:12px;">
              <a href="javascript:void(0)" id="tool-replace" style="font-size:14px;color:#d3d9b8;text-decoration:none;cursor:pointer;">
                <span class="icon">🔄</span><span class="label">Replacer Antisonde</span>
              </a>
            </li>
            <li>
              <a href="javascript:void(0)" id="tool-colonies" style="font-size:14px;color:#d3d9b8;text-decoration:none;cursor:pointer;">
                <span class="icon">🏘️</span><span class="label">Colonies</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    `).appendTo('body');

    $('#tool-params').on('click', togglePanel);
    $('#tool-replace').on('click', performReplaceAntisonde);
    $('#tool-colonies').on('click', e=>{ e.preventDefault(); toggleColoniesBox(); });
  }

  // ─── Main Loops ─────────────────────────────────────────────────────────────
  setInterval(()=>{
    const s = new Date().getSeconds();
    if(placeOn  && s===placeSec ) performReplaceAntisonde();
    if(detectOn && s===detectSec)  detectOtherTroops();
  },1000);

  setInterval(()=>{
    injectToolbox();
    createPanel();
    enhanceProfile();
  },500);

})();