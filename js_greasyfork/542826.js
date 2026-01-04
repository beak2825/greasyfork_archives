// ==UserScript==
// @name         pinter.pro
// @namespace    http://tampermonkey.net/
// @version      6.7
// @description  Gestion collaborative des profils (ban & tags) avec interface améliorée
// @match        *://sexemodel.com/*
// @match        *://www.sexemodel.com/*
// @match        *://m.sexemodel.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542826/pinterpro.user.js
// @updateURL https://update.greasyfork.org/scripts/542826/pinterpro.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // ===== Airtable config =====
  const AIRTABLE_TOKEN = "patmIxxKmoSuJmA3f.18fe741333ad27c49416a18a7e9c0a45ae1c7e1b5bfee4e191d550decd751c7b";
  const AIRTABLE_BASE = "appUf8jMiwrXzpsP7";
  const TABLE_BAN = "BanList";
  const TABLE_TAGS = "Taglist";

  const CACHE_TTL = 15 * 60 * 1000;
  let bannedList = [];
  let tagMap = {};

  // ===== Tags =====
  const TAGS = [
    {name:"Photos pas ok",score:-1,emoji:"❌📸",type:"neg"},
    {name:"Beaucoup plus vieille",score:-2,emoji:"⏳👵",type:"neg"},
    {name:"Glaçon",score:-2,emoji:"🧊",type:"neg"},
    {name:"Pas impliquée",score:-1,emoji:"🤷‍♀️",type:"neg"},
    {name:"Chrono",score:-1,emoji:"⏱️",type:"neg"},
    {name:"Pas trés propre",score:-1,emoji:"🚿⚠️",type:"neg"},
    {name:"Pas du tout propre",score:-2,emoji:"🚿🚫",type:"neg"},
    {name:"Prix +",score:-1,emoji:"💸🔺",type:"neg"},
    {name:"A fuir urgence",score:-3,emoji:"🤮",type:"neg"},
    {name:"Change-personne",score:-2,emoji:"🎭",type:"neg"},
    {name:"Photos ok",score:+1,emoji:"✅📸",type:"pos"},
    {name:"Top service",score:+3,emoji:"💯",type:"pos"},
    {name:"Propre++",score:+2,emoji:"✨",type:"pos"},
    {name:"Respect temps",score:+1,emoji:"🕰️✅",type:"pos"}
  ];

  // ===== Utils =====
  function isElementVisible(el){
    if(!el||!(el instanceof HTMLElement))return false;
    const s=getComputedStyle(el);
    if(s.display==='none'||s.visibility==='hidden'||s.opacity==='0')return false;
    if(!document.body.contains(el))return false;
    return true;
  }

  function loadBanlistFromCache(){
    const raw=localStorage.getItem('pinterpro_banlist');
    if(!raw)return false;
    const parsed=JSON.parse(raw);
    if(Date.now()-parsed.timestamp<CACHE_TTL){bannedList=parsed.data;return true;}
    return false;
  }

  function saveBanlistToCache(){
    localStorage.setItem('pinterpro_banlist',JSON.stringify({timestamp:Date.now(),data:bannedList}));
  }

  function loadTaglistFromCache(){
    const raw=localStorage.getItem('pinterpro_taglist');
    if(!raw)return false;
    const parsed=JSON.parse(raw);
    if(Date.now()-parsed.timestamp<CACHE_TTL){tagMap=parsed.data;return true;}
    return false;
  }

  function saveTaglistToCache(){
    localStorage.setItem('pinterpro_taglist',JSON.stringify({timestamp:Date.now(),data:tagMap}));
  }

  function showQuickNotif(msg){
    const n=document.createElement('div');
    n.textContent=msg;
    Object.assign(n.style,{position:'fixed',top:'20px',right:'20px',background:'#4caf50',color:'#fff',padding:'8px 12px',borderRadius:'5px',zIndex:'999999',fontWeight:'bold'});
    document.body.appendChild(n);
    setTimeout(()=>n.remove(),1000);
  }

  function showSyncNotif(){
    if(document.getElementById('pinter-sync'))return;
    const sync=document.createElement('div');
    sync.id='pinter-sync';
    sync.textContent='🔄 Sync…';
    Object.assign(sync.style,{position:'fixed',bottom:'20px',right:'20px',background:'#333',color:'#fff',padding:'6px 10px',borderRadius:'5px',zIndex:999999});
    document.body.appendChild(sync);
  }

  function hideSyncNotif(){
    const el=document.getElementById('pinter-sync');
    if(el)el.remove();
  }
  // ===== Airtable calls =====
  async function fetchBanListFromAirtable(){
    const url=`https://api.airtable.com/v0/${AIRTABLE_BASE}/${TABLE_BAN}?pageSize=100`;
    const res=await fetch(url,{headers:{Authorization:`Bearer ${AIRTABLE_TOKEN}`}});
    const data=await res.json();
    return data.records.filter(r=>r.fields.Active===true).map(r=>({
      airtableId:r.id,id:r.fields.ProfilID,name:r.fields.ProfilName||"",date:r.createdTime
    }));
  }

  async function fetchTaglistFromAirtable(){
    const url=`https://api.airtable.com/v0/${AIRTABLE_BASE}/${TABLE_TAGS}?pageSize=1000`;
    const res=await fetch(url,{headers:{Authorization:`Bearer ${AIRTABLE_TOKEN}`}});
    const data=await res.json();
    const map={};
    data.records.forEach(r=>{
      if(!map[r.fields.ProfilID]) map[r.fields.ProfilID] = [];
      map[r.fields.ProfilID].push({
        name: r.fields.Tag,
        score: r.fields.Score
      });
    });
    return map;
  }

  async function pushBanToAirtable(profilID,profilName){
    showSyncNotif();
    try{
      const res=await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${TABLE_BAN}`,{
        method:'POST',
        headers:{
          Authorization:`Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type':'application/json'
        },
        body:JSON.stringify({records:[{fields:{
          ProfilID:profilID,
          ProfilName:profilName,
          Active:true
        }}]})
      });
      hideSyncNotif();
      const json=await res.json();
      if(json.error){
        alert("❌ Erreur Airtable : "+json.error.message);
        return;
      }
      bannedList.push({
        airtableId: json.records[0].id,
        id: profilID,
        name: profilName,
        date: json.records[0].createdTime
      });
      saveBanlistToCache();
      showQuickNotif(`✅ Profil banni : ${profilName}`);
    }catch(e){
      hideSyncNotif();
      alert("❌ Erreur connexion Airtable");
    }
  }

  async function deactivateBan(airtableRecordId){
    showSyncNotif();
    try{
      await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${TABLE_BAN}/${airtableRecordId}`,{
        method:'PATCH',
        headers:{
          Authorization:`Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type':'application/json'
        },
        body:JSON.stringify({fields:{Active:false}})
      });
      hideSyncNotif();
      showQuickNotif('🔄 Profil débanni');
    }catch(e){
      hideSyncNotif();
      alert("❌ Erreur connexion Airtable");
    }
  }

  async function setTags(profilID, tagsSelected) {
  showSyncNotif();
  try {
    // Étape 1 : Récupérer tous les anciens tags actifs pour ce profil dans Airtable
    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${TABLE_TAGS}?filterByFormula=AND(ProfilID="${profilID}",Active=TRUE)`, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`
      }
    });
    const data = await res.json();

    // Étape 2 : Désactiver les anciens en les patchant (Active: false)
    if (data.records) {
      for (const record of data.records) {
        await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${TABLE_TAGS}/${record.id}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${AIRTABLE_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            fields: { Active: false }
          })
        });
      }
    }

    // Étape 3 : Ajouter les nouveaux tags sélectionnés
    for (const t of tagsSelected) {
      await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${TABLE_TAGS}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          records: [{
            fields: {
              ProfilID: profilID,
              Tag: t.name,
              Score: t.score,
              Active: true
            }
          }]
        })
      });
    }

    hideSyncNotif();
  } catch (e) {
    hideSyncNotif();
    alert("❌ Erreur sync tags");
  }
}

  // ===== UI CSS =====
  const style=document.createElement('style');
  style.textContent=`
    .pinter-btn-container{position:absolute;top:5px;right:5px;display:flex;gap:6px;z-index:9999;}
    .pinter-btn-container button{padding:6px 8px;border-radius:6px;font-weight:bold;cursor:pointer;border:none;}
    .pinter-btn-ban{background:#e00;color:#fff;}
    .pinter-btn-tags{background:#007bff;color:#fff;}
    @media (max-width:768px){
      .tagModal, #banManager .content{
        width:100%!important;height:100%!important;border-radius:0!important;max-width:none!important;max-height:none!important;
      }
    }
  `;
  document.head.appendChild(style);

  // ===== Ban Confirmation Panel =====
  function showConfirmPanel(profileID,profileName){
    const old=document.getElementById('banConfirmPanel');
    if(old) old.remove();

    const panel=document.createElement('div');
    panel.id='banConfirmPanel';
    panel.innerHTML=`<div class="inner" style="background:#fff;padding:20px;border-radius:8px;text-align:center;position:relative;">
      <div style="position:absolute;top:5px;right:10px;cursor:pointer;font-size:18px;font-weight:bold;" id="closeBanX">×</div>
      <p style="font-weight:bold;color:#d00;">⚠️ Ce bouton est réservé aux profils arnaqueurs ou dangereux</p>
      <p style="font-size:13px;margin-bottom:15px;">(ex. demande de tickets Transcash, plan suspect).</p>
      <p>Confirmer le ban du profil :</p>
      <p><b>${profileName}</b></p>
      <button id="confirmBan">✅ Confirmer</button>
      <button id="cancelBan">❌ Annuler</button>
    </div>`;
    Object.assign(panel.style,{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:'10001'});
    document.body.appendChild(panel);

    panel.onclick=e=>{if(e.target===panel)panel.remove();};
    panel.querySelector('#closeBanX').onclick=()=>panel.remove();
    panel.querySelector('#cancelBan').onclick=()=>panel.remove();
    panel.querySelector('#confirmBan').onclick=async()=>{
      bannedList.push({id:profileID,name:profileName,date:new Date().toISOString()});
      saveBanlistToCache();
      document.querySelectorAll(`a[href*="${profileID}"]`).forEach(a=>{
        const card=a.closest('div');
        if(card) card.style.display='none';
      });
      await pushBanToAirtable(profileID,profileName);
      panel.remove();
    };
  }

  // ===== Affichage et gestion de la banlist =====
  function showBanManager(){
    const ex=document.getElementById('banManager');
    if(ex){ex.remove();return;}

    const panel=document.createElement('div');
    panel.id='banManager';
    panel.innerHTML=`<div class="content" style="background:#fff;padding:15px;border-radius:8px;max-width:500px;width:90%;max-height:80%;overflow:auto;position:relative;">
      <div class="banCloseX" style="position:absolute;top:8px;right:10px;font-size:20px;font-weight:bold;cursor:pointer;">×</div>
      <h3>Banlist</h3><ul id="banListItems"></ul>
      <div style="text-align:center;margin-top:10px;"><button id="closeBanManager">Fermer</button></div>
    </div>`;
    Object.assign(panel.style,{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:'10002'});
    document.body.appendChild(panel);

    panel.onclick=e=>{if(e.target===panel)panel.remove();};
    panel.querySelector('.banCloseX').onclick=()=>panel.remove();
    panel.querySelector('#closeBanManager').onclick=()=>panel.remove();

    const list=panel.querySelector('#banListItems');
    if(bannedList.length===0){
      list.innerHTML="<li>Aucun profil banni.</li>";
      return;
    }

    bannedList.sort((a,b)=>new Date(b.date)-new Date(a.date)).forEach(item=>{
      const li=document.createElement('li');
      li.style.display='flex';
      li.style.justifyContent='space-between';
      li.style.marginBottom='6px';
      li.innerHTML=`<span>${item.name||'(sans nom)'} [${item.id}]<br><small>${new Date(item.date).toLocaleString()}</small></span>`;
      const btn=document.createElement('button');btn.textContent='Déban';
      btn.onclick=async()=>{
        await deactivateBan(item.airtableId);
        li.remove();
      };
      li.appendChild(btn);
      list.appendChild(li);
    });
  }
  // ===== UI Tag modal =====
  function openTagModal(profilID,profilName){
    const current=tagMap[profilID]||[];
    const overlay=document.createElement('div');
    overlay.className='tagModalOverlay';
    Object.assign(overlay.style,{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:'10001'});

    const modal=document.createElement('div');
    modal.className='tagModal';
    Object.assign(modal.style,{background:'#fff',padding:'20px',borderRadius:'8px',width:'90%',maxWidth:'500px',maxHeight:'80%',overflow:'auto',position:'relative'});

    const closeX=document.createElement('div');
    closeX.textContent='×';
    Object.assign(closeX.style,{position:'absolute',top:'8px',right:'10px',cursor:'pointer',fontSize:'20px',fontWeight:'bold'});
    closeX.onclick=()=>overlay.remove();
    modal.appendChild(closeX);

    const title=document.createElement('h3');
    title.textContent=`Tags pour ${profilName}`;
    title.style.marginBottom='10px';
    modal.appendChild(title);

    const negTitle=document.createElement('div');
    negTitle.textContent='🔴 Négatifs';
    Object.assign(negTitle.style,{fontWeight:'bold',marginTop:'10px',marginBottom:'5px'});
    modal.appendChild(negTitle);

    const negGrid=document.createElement('div');
    Object.assign(negGrid.style,{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'15px'});
    modal.appendChild(negGrid);

    const posTitle=document.createElement('div');
    posTitle.textContent='🟢 Positifs';
    Object.assign(posTitle.style,{fontWeight:'bold',marginTop:'10px',marginBottom:'5px'});
    modal.appendChild(posTitle);

    const posGrid=document.createElement('div');
    Object.assign(posGrid.style,{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'15px'});
    modal.appendChild(posGrid);

    const selected=new Set(current.map(t=>t.name));

    TAGS.forEach(t=>{
      const chip=document.createElement('div');
      chip.textContent=`${t.emoji} ${t.name} (${t.score>0?`+${t.score}`:t.score})`;
      chip.style.border='1px solid #ccc';
      chip.style.padding='4px 6px';
      chip.style.borderRadius='4px';
      chip.style.cursor='pointer';
      if(selected.has(t.name)){
        chip.style.background='#007aff';
        chip.style.color='#fff';
      }
      chip.onclick=()=>{
        if(selected.has(t.name)){
          selected.delete(t.name);
          chip.style.background='';
          chip.style.color='';
        }else{
          selected.add(t.name);
          chip.style.background='#007aff';
          chip.style.color='#fff';
        }
      };
      (t.type==='neg'?negGrid:posGrid).appendChild(chip);
    });

    const footer=document.createElement('div');
    footer.style.textAlign='right';
    footer.style.marginTop='10px';

    const cancel=document.createElement('button');
    cancel.textContent='Annuler';
    cancel.onclick=()=>overlay.remove();

    const valid=document.createElement('button');
    valid.textContent='Valider';
    valid.onclick=async()=>{
      const selectedTags=TAGS.filter(t=>selected.has(t.name));
      tagMap[profilID]=selectedTags;
      saveTaglistToCache();
      updateAllTagButtons();
      await setTags(profilID,selectedTags);
      overlay.remove();
    };

    footer.appendChild(cancel);
    footer.appendChild(valid);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    overlay.onclick=e=>{if(e.target===overlay)overlay.remove();};
    document.body.appendChild(overlay);
  }

  // Mise à jour score tag affiché
  function updateAllTagButtons(){
    document.querySelectorAll('[data-profilid]').forEach(btn=>{
      const id=btn.getAttribute('data-profilid');
      const tags=tagMap[id]||[];
      const score=tags.reduce((acc,t)=>acc+t.score,0);
      btn.textContent=(tags.length===0)?'#':`#${score>0?'+':''}${score}`;
    });
  }

  // Ajout des boutons dans les listings
  function addButtonsToListing(){
    document.querySelectorAll('a[href*="/escort/"]').forEach(link=>{
      const m=link.href.match(/\/escort\/([^\/]+)-(\d+)/);
      if(!m) return;
      const id=m[2], name=decodeURIComponent(m[1]).replace(/-/g,' ');
      const card=link.closest('div');
      if(!card || !isElementVisible(card)) return;
      if(card.querySelector('.pinter-btn-container')) return;
      if(bannedList.some(b=>b.id===id)){card.style.display='none';return;}

      if(getComputedStyle(card).position==='static') card.style.position='relative';

      const containerDiv=document.createElement('div');
      containerDiv.className='pinter-btn-container';

      const ban=document.createElement('button');
      ban.textContent='🚫';
      ban.className='pinter-btn-ban';
      ban.onclick=e=>{
        e.preventDefault();
        e.stopPropagation();
        showConfirmPanel(id,name);
      };

      const tag=document.createElement('button');
      tag.textContent='#';
      tag.className='pinter-btn-tags';
      tag.setAttribute('data-profilid',id);
      tag.onclick=e=>{
        e.preventDefault();
        e.stopPropagation();
        openTagModal(id,name);
      };

      containerDiv.appendChild(ban);
      containerDiv.appendChild(tag);
      card.appendChild(containerDiv);
    });
    updateAllTagButtons();
  }
  // Ajoute les boutons sur une fiche profil
  function addButtonsToProfile(id){
    const bc=document.querySelector('.breadcrumbs a.element.active')||document.querySelector('h1');
    const name=bc?bc.textContent.trim():"(inconnu)";
    const container=document.querySelector('.main-photo')||document.querySelector('h1');
    if(container){
      container.style.position='relative';
      const containerDiv=document.createElement('div');
      containerDiv.className='pinter-btn-container';

      const ban=document.createElement('button');
      ban.textContent='🚫';
      ban.className='pinter-btn-ban';
      ban.onclick=()=>showConfirmPanel(id,name);

      const tag=document.createElement('button');
      tag.textContent='#';
      tag.className='pinter-btn-tags';
      tag.setAttribute('data-profilid',id);
      tag.onclick=()=>openTagModal(id,name);

      containerDiv.appendChild(ban);
      containerDiv.appendChild(tag);
      container.appendChild(containerDiv);

      updateAllTagButtons();
    }
  }

  // Bouton global pour afficher la banlist
  function addGlobalUI(){
    const ui=document.createElement('button');
    ui.textContent='📋 Banlist';
    Object.assign(ui.style,{
      position:'fixed',top:'50px',right:'10px',
      background:'#fff',padding:'6px',border:'1px solid #ccc',
      borderRadius:'4px',zIndex:10000,opacity:0.7
    });
    ui.onmouseenter=()=>ui.style.opacity=1;
    ui.onmouseleave=()=>ui.style.opacity=0.7;
    ui.onclick=showBanManager;
    document.body.appendChild(ui);
  }

  // Observateur DOM pour injecter automatiquement dans les nouveaux listings
  let domObserver;
  function observeDOMChanges(){
    const container=document.querySelector('.content')||document.querySelector('#main')||document.body;
    const callback=(mutationsList)=>{
      domObserver.disconnect();
      addButtonsToListing();
      domObserver.observe(container,{childList:true,subtree:true});
    };
    domObserver=new MutationObserver(callback);
    domObserver.observe(container,{childList:true,subtree:true});
  }

  // Initialisation du script
  (async()=>{
    loadBanlistFromCache();
    loadTaglistFromCache();

    const m=window.location.pathname.match(/\/escort\/([^\/]+)-(\d+)/);
    if(m){
      const id=m[2];
      if(bannedList.some(b=>b.id===id)){
        document.body.innerHTML='<div style="padding:2em;background:#fee;">Ce profil est marqué comme fake.</div>';
        return;
      }
      addButtonsToProfile(id);
    }else{
      addButtonsToListing();
      observeDOMChanges();
    }

    addGlobalUI();

    const freshBan=await fetchBanListFromAirtable();
    bannedList=freshBan;
    saveBanlistToCache();

    const freshTags=await fetchTaglistFromAirtable();
    tagMap=freshTags;
    saveTaglistToCache();
    updateAllTagButtons();
  })();
})();