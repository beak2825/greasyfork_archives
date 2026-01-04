// ==UserScript==
// @name         webcept
// @namespace    @textfile
// @description  intercept websim requests
// @version      1.0.3
// @match        https://websim.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/546721/webcept.user.js
// @updateURL https://update.greasyfork.org/scripts/546721/webcept.meta.js
// ==/UserScript==

(()=>{ 'use strict';
const K='wsim_min_intercept_v2';
const D={enabled:1,debug:0,sysOn:1,sys:'',flagsOn:0,f_agent:0,f_worker:0,f_verbose:0,f_tools:0,f_docs:0,f_force:'',loreOn:0,l_api:0,l_mul:0,l_mob:0,l_db:0,l_db21:0,l_llm2:0,l_tw:0,l_cm:0,l_video:0,modelOn:0,model:''};
let S=Object.assign({},D,GM_getValue(K)||{});
const save=()=>GM_setValue(K,S);

GM_addStyle(`.wsi-panel{position:fixed;z-index:2147483647;right:14px;bottom:64px;width:360px;max-width:calc(100vw - 24px);background:#000;color:#fff;border:1px solid #fff;border-radius:0;padding:12px;font:bold 13px 'Courier New',Courier,monospace}.wsi-row{display:flex;align-items:center;gap:8px;margin:8px 0}.wsi-row label{flex:1}.wsi-input,.wsi-text{width:100%;background:#000;color:#fff;border:1px solid #fff;border-radius:0;padding:6px;font:inherit}.wsi-text{min-height:64px}.wsi-actions{display:flex;gap:8px;justify-content:flex-end}.wsi-actions button{background:#000;color:#fff;border:1px solid #fff;border-radius:0;padding:6px 10px;cursor:pointer;font:inherit}`);

const p=document.createElement('div'); p.className='wsi-panel'; p.style.display='none';
p.innerHTML=`
  <div class="wsi-row"><input id="wsi_enabled" type="checkbox"><label for="wsi_enabled">ENABLED</label></div>
  <div class="wsi-row"><input id="wsi_sysOn" type="checkbox"><label for="wsi_sysOn">SYSTEM PROMPT</label></div>
  <div class="wsi-row"><textarea id="wsi_sys" class="wsi-text" placeholder="system prompt..."></textarea></div>

  <div class="wsi-row"><input id="wsi_flagsOn" type="checkbox"><label for="wsi_flagsOn">OVERRIDE FLAGS</label></div>
  <div class="wsi-row"><input id="wsi_f_agent" type="checkbox"><label for="wsi_f_agent">enable_agent_models</label></div>
  <div class="wsi-row"><input id="wsi_f_worker" type="checkbox"><label for="wsi_f_worker">use_worker_generation</label></div>
  <div class="wsi-row"><input id="wsi_f_verbose" type="checkbox"><label for="wsi_f_verbose">verbose_mode</label></div>
  <div class="wsi-row"><input id="wsi_f_tools" type="checkbox"><label for="wsi_f_tools">enable_tool_calls</label></div>
  <div class="wsi-row"><input id="wsi_f_docs" type="checkbox"><label for="wsi_f_docs">enable_feature_docs</label></div>
  <div class="wsi-row"><input id="wsi_f_force" class="wsi-input" placeholder="force_apply_model"></div>

  <div class="wsi-row"><input id="wsi_loreOn" type="checkbox"><label for="wsi_loreOn">OVERRIDE LORE</label></div>
  <div class="wsi-row"><input id="wsi_l_api" type="checkbox"><label for="wsi_l_api">lore.enableApi</label></div>
  <div class="wsi-row"><input id="wsi_l_mul" type="checkbox"><label for="wsi_l_mul">lore.enableMultiplayer_v2</label></div>
  <div class="wsi-row"><input id="wsi_l_mob" type="checkbox"><label for="wsi_l_mob">lore.enableMobilePrompt</label></div>
  <div class="wsi-row"><input id="wsi_l_db" type="checkbox"><label for="wsi_l_db">lore.enableDB</label></div>
  <div class="wsi-row"><input id="wsi_l_db21" type="checkbox"><label for="wsi_l_db21">lore.enableDB_v2_1</label></div>
  <div class="wsi-row"><input id="wsi_l_llm2" type="checkbox"><label for="wsi_l_llm2">lore.enableLLM2</label></div>
  <div class="wsi-row"><input id="wsi_l_tw" type="checkbox"><label for="wsi_l_tw">lore.enableTweaks</label></div>
  <div class="wsi-row"><input id="wsi_l_cm" type="checkbox"><label for="wsi_l_cm">lore.enableComments</label></div>
  <div class="wsi-row"><input id="wsi_l_video" type="checkbox"><label for="wsi_l_video">lore.enableVideo</label></div>

  <div class="wsi-row"><input id="wsi_modelOn" type="checkbox"><label for="wsi_modelOn">OVERRIDE MODEL</label></div>
  <div class="wsi-row"><input id="wsi_model" class="wsi-input" placeholder="model id"></div>

  <div class="wsi-row"><input id="wsi_debug" type="checkbox"><label for="wsi_debug">DEBUG</label></div>
  <div class="wsi-actions"><button id="wsi_save">SAVE</button><button id="wsi_close">CLOSE</button></div>
`;

const q=s=>p.querySelector(s);
const a=()=>{ q('#wsi_enabled').checked=!!S.enabled; q('#wsi_sysOn').checked=!!S.sysOn; q('#wsi_sys').value=S.sys||''; q('#wsi_flagsOn').checked=!!S.flagsOn; q('#wsi_f_agent').checked=!!S.f_agent; q('#wsi_f_worker').checked=!!S.f_worker; q('#wsi_f_verbose').checked=!!S.f_verbose; q('#wsi_f_tools').checked=!!S.f_tools; q('#wsi_f_docs').checked=!!S.f_docs; q('#wsi_f_force').value=S.f_force||''; q('#wsi_loreOn').checked=!!S.loreOn; q('#wsi_l_api').checked=!!S.l_api; q('#wsi_l_mul').checked=!!S.l_mul; q('#wsi_l_mob').checked=!!S.l_mob; q('#wsi_l_db').checked=!!S.l_db; q('#wsi_l_db21').checked=!!S.l_db21; q('#wsi_l_llm2').checked=!!S.l_llm2; q('#wsi_l_tw').checked=!!S.l_tw; q('#wsi_l_cm').checked=!!S.l_cm; q('#wsi_l_video').checked=!!S.l_video; q('#wsi_modelOn').checked=!!S.modelOn; q('#wsi_model').value=S.model||''; q('#wsi_debug').checked=!!S.debug; };

q('#wsi_close').onclick=()=>{ p.style.display='none'; };
q('#wsi_save').onclick=()=>{ S.enabled=q('#wsi_enabled').checked; S.sysOn=q('#wsi_sysOn').checked; S.sys=q('#wsi_sys').value||''; S.flagsOn=q('#wsi_flagsOn').checked; S.f_agent=q('#wsi_f_agent').checked; S.f_worker=q('#wsi_f_worker').checked; S.f_verbose=q('#wsi_f_verbose').checked; S.f_tools=q('#wsi_f_tools').checked; S.f_docs=q('#wsi_f_docs').checked; S.f_force=q('#wsi_f_force').value||''; S.loreOn=q('#wsi_loreOn').checked; S.l_api=q('#wsi_l_api').checked; S.l_mul=q('#wsi_l_mul').checked; S.l_mob=q('#wsi_l_mob').checked; S.l_db=q('#wsi_l_db').checked; S.l_db21=q('#wsi_l_db21').checked; S.l_llm2=q('#wsi_l_llm2').checked; S.l_tw=q('#wsi_l_tw').checked; S.l_cm=q('#wsi_l_cm').checked; S.l_video=q('#wsi_l_video').checked; S.modelOn=q('#wsi_modelOn').checked; S.model=q('#wsi_model').value||''; S.debug=q('#wsi_debug').checked; save(); push(S); p.style.display='none'; };

GM_registerMenuCommand('TOGGLE INTERCEPTOR',()=>{ S.enabled=!S.enabled; save(); push(S); });
GM_registerMenuCommand('SHOW SETTINGS',()=>{ if(!document.body.contains(p))document.body.append(p); a(); p.style.display='block'; });

function inject(c){
  const src=`(function(){ 'use strict';
    if(window.__WSI__&&window.__WSI__.i){ window.__WSI__.s(${JSON.stringify(c)}); return; }
    const W=window.__WSI__={state:${JSON.stringify(c)},i:0,get c(){return this.state},s(p){this.state=Object.assign({},this.state,p||{}); if(this.state.debug)console.log('[WSI] config updated',this.state)}};
    const m=u=>typeof u==='string'&&u.startsWith('https://websim.com/api/v1/sites');
    function t(text){
      let s=W.c,o; try{o=JSON.parse(text)}catch{return null}
      let ch=0,g=o&&o.generate;
      if(s.sysOn&&s.sys&&g&&g.prompt&&typeof g.prompt.text==='string'){const pre='{system:'+JSON.stringify(String(s.sys))+'} '; if(!g.prompt.text.startsWith(pre)){g.prompt.text=pre+g.prompt.text; ch=1}}
      if(s.flagsOn&&g){
        g.flags=g.flags||{};
        const mp=[['enable_agent_models',!!s.f_agent],['use_worker_generation',!!s.f_worker],['verbose_mode',!!s.f_verbose],['enable_tool_calls',!!s.f_tools],['enable_feature_docs',!!s.f_docs]];
        for(const[k,v]of mp){ if(g.flags[k]!==v){ g.flags[k]=v; ch=1 } }
        const fam=s.f_force||''; if(g.flags.force_apply_model!==fam){ g.flags.force_apply_model=fam; ch=1 }
      }
      if(s.loreOn&&g){
        g.lore=g.lore||{};
        const ml=[['enableApi',!!s.l_api],['enableMultiplayer_v2',!!s.l_mul],['enableMobilePrompt',!!s.l_mob],['enableDB',!!s.l_db],['enableDB_v2_1',!!s.l_db21],['enableLLM2',!!s.l_llm2],['enableTweaks',!!s.l_tw],['enableComments',!!s.l_cm],['enableVideo',!!s.l_video]];
        for(const[k,v]of ml){ if(g.lore[k]!==v){ g.lore[k]=v; ch=1 } }
      }
      if(s.modelOn&&s.model&&g&&g.model!==s.model){ g.model=s.model; ch=1 }
      return ch?JSON.stringify(o):null
    }
    const of=window.fetch&&window.fetch.bind(window);
    if(of){ window.fetch=async function(input,init){
      try{
        const s=W.c; if(!s.enabled) return of.apply(this,arguments);
        let url,method;
        if(typeof input==='string'||input instanceof URL){ url=String(input); method=(init&&init.method?String(init.method):'GET').toUpperCase(); }
        else if(input instanceof Request){ url=input.url; method=(init&&init.method?String(init.method):String(input.method||'GET')).toUpperCase(); }
        else return of.apply(this,arguments);
        if(!m(url)||method!=='POST') return of.apply(this,arguments);
        if(init&&init.body!=null){
          const ob=init.body; let text=null;
          if(typeof ob==='string') text=ob;
          else if(ob instanceof Blob) text=await ob.text();
          else if(ob instanceof ArrayBuffer||ArrayBuffer.isView(ob)){ const buf=ob instanceof ArrayBuffer?ob:ob.buffer; text=new TextDecoder().decode(buf); }
          else return of.apply(this,arguments);
          const nt=t(text); if(nt!=null&&nt!==text){ const ni=Object.assign({},init,{body:nt}); if(s.debug)console.log('[WSI] fetch modified (init.body)',{url,method}); return of.call(this,input,ni) }
          return of.apply(this,arguments);
        }
        if(input instanceof Request){
          const req=input; if(req.bodyUsed) return of.apply(this,arguments);
          let text=''; try{text=await req.clone().text()}catch{ return of.apply(this,arguments) }
          if(!text) return of.apply(this,arguments);
          const nt=t(text);
          if(nt!=null&&nt!==text){
            const h=new Headers(req.headers);
            const nr=new Request(req.url,{method:req.method,headers:h,body:nt,mode:req.mode,credentials:req.credentials,cache:req.cache,redirect:req.redirect,referrer:req.referrer,referrerPolicy:req.referrerPolicy,integrity:req.integrity,keepalive:req.keepalive,signal:(init&&init.signal)||req.signal});
            if(s.debug)console.log('[WSI] fetch modified (Request)',{url,method}); return of.call(this,nr)
          }
        }
      }catch(e){ try{ if(W.c.debug)console.warn('[WSI] fetch wrapper error',e) }catch{} }
      return of.apply(this,arguments);
    }}
    if(window.XMLHttpRequest){
      const XO=XMLHttpRequest.prototype.open, XS=XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open=function(method,url){ this.__wsi={m:(method||'GET').toString().toUpperCase(),u:String(url)}; return XO.apply(this,arguments) };
      XMLHttpRequest.prototype.send=function(body){
        try{
          const s=W.c,i=this.__wsi||{};
          if(s.enabled&&i.m==='POST'&&m(i.u)&&typeof body==='string'){
            const nt=t(body); if(nt!=null&&nt!==body){ if(s.debug)console.log('[WSI] XHR modified',{url:i.u,method:i.m}); arguments[0]=nt }
          }
        }catch(e){ try{ if(W.c.debug)console.warn('[WSI] XHR wrapper error',e) }catch{} }
        return XS.apply(this,arguments);
      };
    }
    window.addEventListener('message',e=>{ if(!e||e.source!==window||!e.data)return; const d=e.data; if(d&&d.__wsi&&d.type==='config'){ W.s(d.payload||{}) }});
    W.i=1; if(W.state.debug)console.log('[WSI] Interceptor installed');
  })();`;
  const sc=document.createElement('script'); sc.type='text/javascript'; sc.textContent=src; (document.head||document.documentElement).appendChild(sc); sc.remove();
}

function push(c){ window.postMessage({__wsi:1,type:'config',payload:c},'*'); }
inject(S); push(S);
})();