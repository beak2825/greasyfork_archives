// ==UserScript==
// @name         Translate webpage
// @namespace    https://github.com/Procyon-b
// @version      0.5.1
// @description  Mimicks chrome's built-in page translator. Can be used as a userscript (from the context menu or always on) or as a bookmarklet (clicking the bookmark translates the page). For Firefox and chrome
// @author       Achernar
// @match        *://*/*
// @run-at       context-menu
// @run-at       document-idle
// @grant   GM_setValue
// @grant   GM_getValue
// @grant   GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/470861/Translate%20webpage.user.js
// @updateURL https://update.greasyfork.org/scripts/470861/Translate%20webpage.meta.js
// ==/UserScript==

javascript:
(function(){
"use strict";

var defLang="",toolbarLang="";

if (document.querySelector('body > .skiptranslate > iframe')) return;
try {
  if (window.frameElement.classList.contains('skiptranslate')) return;
}catch(e){}

var nLang=navigator.language.split('-')[0];

if (defLang == '?') defLang=nLang;
if (toolbarLang == '?') toolbarLang=nLang;

function getCookies() {
  var r={}, a=document.cookie;
  a.split(';').forEach(function(e){
    var p=e.split('=');
    if (p[0]) r[p.shift().trim()]=p.join('=');
    });
  return r;
  };

function clearCookie(n) {
  var h=location.host, s=h.split('.'), a=[' ', h, '.'+h], d, old=(new Date(0)).toUTCString();
  while (s.length > 2) {
    if (s[0]) s[0]='';
    else s.shift();
    a.push(s.join('.'));
    }
  while (d=a.shift()) {
    document.cookie= n+'=;path=/;expires='+old+';'+(d==' ' ? '':'domain='+d+';');
    if (!getCookies()[n]) break;
    }
  }

var translate_to=defLang || '',
    translate_toS='',
    done=false,
    force=true,
    btnAdded=true,
    curVBtn,
    setDefBtn,
    closeBtn,
    GM=false;

try{
  [translate_to, toolbarLang]=getDef();
  btnAdded=false;
  GM=true;
}catch(e){}

var curLang='', curLangS='';
function getDef() {
  return [GM_getValue('translate_to',''), GM_getValue('toolbarLang','')];
  }
function setDef() {
  GM_setValue('translate_to', curLang);
  translate_to=curLang;
  translate_toS=curLangS;
  updCurBtn();
  }

function updCurBtn() {
  if (curVBtn) curVBtn.innerText=(translate_toS && translate_toS+' ('+translate_to+')') || translate_to;
  toggleBtn();
  }

function toggleSite(force) {
  var h='no:'+location.host;
  try{
  aBlocked=GM_getValue('no-all', false);
  blocked= force !== undefined ? !force : GM_getValue(h, false);
  if (force === null) return;
  if (blocked) {
    if (aBlocked) GM_setValue(h, false);
    else GM_deleteValue(h);
    }
  else GM_setValue(h, true);
  }catch(e){}
  }

var trans=true, blocked=false, aBlocked=false, cookies=getCookies();
if (cookies.googtransopt) trans=false;

function isBlocked() {
  let blocked=GM_getValue('no:'+location.host, null);
  aBlocked=GM_getValue('no-all', false);

  if (aBlocked && (blocked === false) ) return false;
  return aBlocked || Boolean(blocked);
  }

try{
blocked=isBlocked();
trans=!blocked;
if (trans && cookies.googtransopt) clearCookie('googtransopt');
}catch(e){}

if (!GM && trans && translate_to && !getCookies().googtrans) document.cookie='googtrans=/auto/'+translate_to+'/; path=/';

var eael=Element.prototype.addEventListener;
Element.prototype.addEventListener=function(ev){
  var e=this;
  if (ev == 'mouseover') {
    if (String(arguments[1]).startsWith('function(c){return a.call(')) return;
    }
  return eael.apply(e,arguments);
  };

var sa=HTMLElement.prototype.setAttribute;
HTMLElement.prototype.setAttribute=function(a){
  var e=this;
  if (a == 'aria-label') {
    let err=(new Error()).stack;
    if (err.includes('https://translate.googleapis.com/_/translate_http/_/js/')) return;
    }
  return sa.apply(e,arguments);
  };

var pm=Performance.prototype.measure;
Performance.prototype.measure=function() {
  var e=this;
  try{
    return pm.apply(e, arguments);
    }catch(e){}
  return false;
  };

new MutationObserver(function(muts) {
  for (let mut of muts) {
    if (mut.addedNodes.length) {
      for (let i=0,n; n=mut.addedNodes[i]; i++) {
        if (n.nodeName == 'IFRAME' && n.classList.contains('skiptranslate') ) {
          addSt(frameSt, n.contentWindow);
          n.onload=function(){
            let e=this;
            frameMut(e);
            }
          }
        else if (n.nodeName == 'DIV') {
          if (n.classList.contains('skiptranslate') ) {
            let tb=document.body.querySelector('body > .skiptranslate > iframe.skiptranslate');
            if (tb) {
              addSt(frameSt, tb.contentWindow);
              frameMut(tb);
              }
            }
          else if (n.parentNode && (n.attributes.length ==1) && n.className && /^[^-_]{6}-[^-_]{6}-[^-_]{6}-[^-_]{6}/i.test(n.className) ) {
            let s=getComputedStyle(n);
            if ( (s.zIndex == '1000') && (s.transitionDelay == '0.6s') ) addSt('.'+n.className.split(' ')[0]+' {display: none;}');
            }
          }
        }
      }
    }
  }).observe(document.body, { attributes: false, subtree: false, childList: true });

function frameMut(f) {
  try{
  f.dataset.done=true;
  new MutationObserver(function(muts) {
    handleFrame(f);
    }).observe(f.contentWindow.document.body, { attributes: false, subtree: true, childList: true });
  handleFrame(f);
  }catch(e){}
  }

function clickIF(ev) {
  var v=this.value;
  if (v === undefined) return;
  if (v == 'turn_off_site') {
    toggleSite(true);
    toggleMenu(false);
    }
  if (v == 'turn_on_site') {
    clearCookie('googtransopt');
    menuFrame.style.display='none';
    toggleSite(false);
    toggleMenu(true);
    }
  else if (v == 'turn_off_all') {
    GM_setValue('no-all', true);
    menuFrame.style.display='none';
    toggleSite(null);
    toggleMenu(!isBlocked());
    closeBtn && closeBtn.click();
    }
  else if (v == 'turn_off_all_m') {
    GM_setValue('no-all', true);
    menuFrame.style.display='none';
    toggleSite(false);
    toggleMenu(!isBlocked());
    }
  else if (v == 'turn_on_all') {
    GM_deleteValue('no-all');
    menuFrame.style.display='none';
    toggleSite(null);
    toggleMenu(!isBlocked());
    }
  else if (v == 'forceMnuLang') {
    let L=null;

    if ( (ev.target.nodeName == 'SELECT') || (ev.target.nodeName == 'OPTION') ) L=ev.target.value;
    else if (!LSelect) L=toolbarLang || nLang;

    if (!LSelect) {
      let r=this.querySelector('div:not(.select)');
      if (r) {
        r.classList.add('select');
        let s='';
        LSelect=document.createElement('select');
        for (let k of Object.keys(CCode).sort() ) {
          s+='<option value="'+k+'">'+k+'</option>';
          }
        LSelect.innerHTML=s;
        r.appendChild(LSelect);
        }
      }

    if (L !== null) {
      toolbarLang=L;
      if (L) GM_setValue('toolbarLang', L);
      else GM_deleteValue('toolbarLang');
      if (LSelect) LSelect.value=toolbarLang;
      }
    }
  else {
    curLang=v;
    curLangS=this.innerText;
    updCurBtn();
    }
  }

function toggleMenu(t) {
  if (!menuFrame) return;
  if (t !== undefined) trans=t;
  menuFrame.contentWindow.document.body.classList.toggle('t_off', !trans);
  menuFrame.contentWindow.document.body.classList.toggle('t_all_off', aBlocked);
  }


function toggleBtn() {
  if (curVBtn) {
    curVBtn.parentNode.classList.toggle('hidden', !translate_to);
    curVBtn.parentNode.classList.toggle('disabled', curLang == translate_to );
    }
  if (setDefBtn) {
    setDefBtn.parentNode.classList.toggle('disabled', curLang == translate_to );
    }
  }

function fixLinks(a, s) {
  if (s) void(0);
  var r;
  for (let i=0, e; e=a[i]; i++) {
    if (e.attributes.href.value == "#") {
      e.href='javascript:void(0)';
      if (!e._cIF_) e.addEventListener('click', clickIF);
      e._cIF_=true;
      if (s && !r && (e.value == s)) r=e;
      }
    }
  return r;
  }

var langFrame, menuFrame, CCode={}, LSelect;

function forceLang(L, A, set=true) {
  var a= A || (langFrame && langFrame.contentWindow.document.body.querySelectorAll('a')) || [];
  if (!L) {
    let i, e, c, cl={};
    for (i=0; e=a[i]; i++) {
      c=e.classList.value;
      if (!cl[c]) cl[c]={c: 0, e: null};
      cl[c].c++;
      cl[c].e=e;
      if (set) CCode[e.value]=e.innerText;
      if (translate_to && !translate_toS && (translate_to == e.value) ) {
        translate_toS=e.innerText;
        updCurBtn();
        }
      }
    for (c in cl) {
      if ( (cl[c].c == 1) && cl[c].e.value) {
        curLang=cl[c].e.value;
        curLangS=cl[c].e.innerText;
        updCurBtn();
        break;
        }
      }
    return;
    }
  for (let i=0, e; e=a[i]; i++) {
    if (e.value == L) {
      if (set) e.click();
      return true;
      }
    }
  }

function handleFrame(f) {
  if (!langFrame) langFrame=f;
  var a;
  try{
    a=f.contentWindow.document.body.querySelectorAll('a');
  }catch(e){
    return;}
  var mnu=fixLinks(a, menuFrame?'':'turn_off_site');
  if (!menuFrame && mnu) {
    function createMnu(mnu, cfg) {
      let e=mnu.cloneNode(true);
      e.addEventListener('click', clickIF);
      e._cIF_=true;
      e.classList.add(cfg.c);
      e.value=cfg.v;
      let t=e.querySelector('.text');
      if (t) {
        t.innerHTML=cfg.s;
        }
      if (cfg.p == 'last') mnu.parentNode.appendChild(e);
      else mnu.parentNode.insertBefore(e, cfg.ns);
      return e;
      }
    menuFrame=f;
    if (GM) {
      let ns=mnu.nextSibling;
      let e=createMnu(mnu,{v: 'turn_on_site', c: 't_on', s: locS('tr_on'), ns});
      createMnu(mnu, {ns, v: 'turn_off_all', c: 't_off_all', s: locS('tr_all_off') });
      createMnu(mnu, {ns, v: 'turn_off_all_m', c: 't_off_allm', s: locS('tr_all_off_s') });
      createMnu(mnu, {ns, v: 'turn_on_all', c: 't_on_all', s: locS('tr_all_on') });
      createMnu(mnu, {ns, v: 'forceMnuLang', c: 'forceMnu', s: '&iquest;?', p: 'last' });
      mnu.classList.add('t_off');
      toggleMenu(trans);
      }
    }
  if (!curLang && (langFrame == f)) forceLang(null, a);

  if (!done) {
    fixLinks(document.body.querySelectorAll('body > #google_translate_element a'));
    }

  var cookies=getCookies();

  if (translate_to && cookies.googtrans && !done) force=false;
  if (translate_to && (!cookies.googtrans || !force) && !done) {
    if (trans && forceLang(translate_to, a, force)) {
      done=true;
      return;
      }
    }

  function createBt(r, cfg, d=document) {
    var m=r.cloneNode(true),
        b=m.querySelector('button[id$="restore"]'),
        e=d.createElement('button');
    e.innerText=cfg.text || '';
    e.id=cfg.id;
    b.parentNode.classList.add(cfg.id);
    b.parentNode.classList.add('addedBtn');
    b.parentNode.replaceChild(e, b);
    r.parentNode.appendChild(m);
    return e;
    }

  if (!btnAdded) {
    let btn=f.contentWindow.document.body.querySelector('button[id$="restore"]');
    if (btn) {
      let r=btn.closest('td');
      setDefBtn=createBt(r, {text: locS('set_def'), id: 'setDefLn'} );
      setDefBtn.onclick=setDef;
      curVBtn=createBt(r, {text: (translate_toS && translate_toS+' ('+translate_to+')') || translate_to, id: 'curDefLn'} );
      curVBtn.onclick=function(){forceLang(translate_to);};
      toggleBtn();
      btnAdded=true;
      closeBtn=f.contentWindow.document.body.querySelector('a[id$="close"]');
      }
    }
  }


function addSt(s, r) {
  try {
    var st=document.createElement('style');
    var R= r || window;
    R.document.documentElement.appendChild(st);
    st.textContent=s;
  }catch(e){
    setTimeout(function(){addSt(s, r)},0); }
};

addSt(`
html[style*="height: 100%;"] {
  height: auto !important;
}
body[style*="position: relative; min-height: 100%; top: 40px;"],
body[style*="position: relative; min-height: 100%; top: 0px;"] {
  min-height: initial !important;
  top: unset !important;
  position: initial !important;
}
body > .skiptranslate > iframe:not(:hover) {
  height: 4px;
  opacity: 0;
}
iframe.skiptranslate,
body > #google_translate_element {
  zoom: ${1/window.getComputedStyle(document.body).zoom};
}
iframe.skiptranslate[title] {
  max-width: 95% !important;
  margin-right: 1em;
}
iframe.skiptranslate[title][style*="; left: 0px;"] {
  left: 1em !important;
}
body > .skiptranslate:not([id]):not([style*="display:"]) ~ #google_translate_element,
body > #google_translate_element:empty {
  display: none;
}
body > #google_translate_element {
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 9999999;
}
body > #google_translate_element.T:hover {
  background: white;
  color: black;
  padding: 0.5em;
  border: 2px solid red;
  font: bold 14px arial;
}
body > #google_translate_element.T:not(:hover) {
  opacity: 0;
  max-width: 3px;
  max-height: 3px;
}

no #google_translate_element img {
  display: none !important;
}
`);

var frameSt=`
body[scroll="no"] {
  overflow-x: auto !important;
}
body[scroll="no"] > div {
  padding-bottom: 20px !important;
}
body[scroll="no"] .setDefLn {
  margin-left: 2em !important;
}
body[scroll="no"] .addedBtn {
  margin-left: 0.5em;
}
body[scroll="no"] .addedBtn.hidden,
body[scroll="no"]:not(.t_off) .t_on,
body[scroll="no"].t_off .t_off,
body[scroll="no"]:not(.t_all_off) .t_on_all,
body[scroll="no"].t_all_off .t_off_all,
body[scroll="no"].t_all_off .t_off_allm {
  display: none !important;
}
body[scroll="no"] .addedBtn.disabled {
  opacity: 0.6;
  pointer-events: none;
}
body[scroll="no"] .forceMnu select {
  margin: 0 1em;
}
`;

function startGT() {
  var r=document.head || document.documentElement;
  var el=document.createElement('script');
  el.textContent=`
  function googleTranslateElementInit() {
    new google.translate.TranslateElement({
      pageLanguage: '',
      autoDisplay: false,
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
  }`;
  r.insertBefore(el,r.firstChild);

  el=document.createElement('script');
  el.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&ok='+(toolbarLang?'&hl='+toolbarLang:'');
  r.insertBefore(el,r.firstChild);
  }

var gte=document.createElement('div');
  gte.id='google_translate_element';
  document.body.appendChild(gte);

var gmi='';
try{
  gmi=GM_info.script['run-at'];
}catch(e){}

function locS(id) {
  if (!gtLang) {
    try{if (gtLang=google && google.translate && google.translate._const && google.translate._const._cl) loc='';
    }catch(e){}
    }
  if (!loc) {
    loc= local[gtLang] || local[gtLang.split('-')[0]] || local[toolbarLang] || local[toolbarLang.split('-')[0]] || local[navigator.language] || local[navigator.language.split('-')[0]] || local.en;
    if (loc._ && (Object.keys(loc).length == 1) ) {
      let L=loc._.split(/\n/);
      [loc.tr_on, loc.tr_all_off, loc.tr_all_off_s, loc.tr_all_on, loc.set_def, loc.float_tit]=L;
      }
    for (let k in local.en) {
      if (!loc[k]) loc[k]=local.en[k];
      }
    }
  return loc[id];
  }

var loc, gtLang='';
const local = {
  en: {
    tr_on: 'Turn on translation for this site',
    tr_all_off: 'Turn off for all sites',
    tr_all_off_s: 'Turn off for all sites except this one',
    tr_all_on: 'Allow translation back on all sites',
    set_def: 'Set as default language',
    float_tit: 'Click to translate'
    },
  fr: {
    tr_on: 'Activer la traduction pour le site',
    tr_all_off: 'Désactiver pour tous les sites',
    tr_all_off_s: 'Désactiver pour tous les sites sauf celui-ci',
    tr_all_on: 'Réactiver la traduction sur tous les sites',
    set_def: 'Choisir comme langue par défaut',
    float_tit: 'Cliquer pour traduire'
    },
  nl: { _: `Schakel in vertaling voor deze site
Schakel uit voor alle sites
Schakel uit voor alle sites behalve deze
Sta vertaling weer toe op alle sites
Instellen als standaardtaal
Klik om te vertalen`},
  es: { _: `Activar la traducción para este sitio
Desactivar para todos los sitios
Desactivar para todos los sitios excepto este
Permitir la traducción en todos los sitios
Establecer como idioma predeterminado
Haga clic para traducir`},
  it: { _:`Attiva la traduzione per questo sito
Disabilita per tutti i siti
Disabilita per tutti i siti tranne questo
Reattivare la traduzione su tutti i siti
Scegli come lingua predefinita
Fai clic per tradurre`},
  de: { _: `Aktivieren Sie die Übersetzung für diese Site
Deaktivieren Sie für alle Websites
Deaktivieren Sie für alle Websites außer diesem
Reaktivieren Sie die Übersetzung an allen Standorten
Wählen Sie als Standardsprache
Klicken Sie hier, um zu übersetzen`},
  pt: { _: `Ative a tradução para este site
Desativar para todos os sites
Desativar para todos os sites, exceto isso
Reativar a tradução em todos os sites
Escolha como linguagem padrão
Clique para traduzir`},
  ja: { _: `このサイトの翻訳をオンにする
すべてのサイトの電源を切る
それ以外のすべてのサイトの電源を切る
すべてのサイトで翻訳を返す
デフォルト言語として設定する
クリックして翻訳する`},
  ar: { _: `تنشيط الترجمة لهذا الموقع
تعطيل لجميع المواقع
تعطيل لجميع المواقع باستثناء هذا
إعادة تنشيط الترجمة على جميع المواقع
اختر كلغة افتراضية
انقر للترجمةة`},
  iw: { _: `הפעל תרגום לאתר זה
כבה לכל האתרים
כבה לכל האתרים למעט זה
אפשר תרגום בחזרה לכל האתרים
הגדר כשפת ברירת מחדל
לחץ לתרגום`},
  'zh-CN': { _: `打开此网站的翻译
关闭所有站点
除此之外，所有网站都关闭
允许在所有站点上翻译
设置为默认语言
单击以翻译`},
  'zh-TW': { _: `打開此網站的翻譯
關閉所有站點
除此之外，所有網站都關閉
允許在所有站點上翻譯
設置為默認語言
單擊以翻譯`}
  };


if (trans || getCookies().googtrans || !GM || ( gmi && (gmi == 'context-menu') ) && (gmi && !gmi.startsWith('document-') ) ) startGT();
else {
  gte.innerHTML='&#167;';
  gte.title=locS('float_tit');
  gte.classList.add('T');
  gte.addEventListener('click', function(){
    this.innerHTML='';
    this.title='';
    this.classList.remove('T');
    startGT();
    }, {once: true});
  }

})()