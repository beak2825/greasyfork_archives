// ==UserScript==
// @name         Reddit - fix "new"
// @namespace    https://github.com/Procyon-b
// @version      0.6.11
// @description  Fix "new" reddit behaviour: long-lived page, internal links, moderator page
// @author       Achernar
// @match        https://*.reddit.com/*
// @grant   GM_setValue
// @grant   GM_getValue
// @grant   GM_deleteValue
// @grant   GM_registerMenuCommand
// @grant   GM_unregisterMenuCommand
// @run-at  document-start
// @downloadURL https://update.greasyfork.org/scripts/493986/Reddit%20-%20fix%20%22new%22.user.js
// @updateURL https://update.greasyfork.org/scripts/493986/Reddit%20-%20fix%20%22new%22.meta.js
// ==/UserScript==

(function() {
"use strict";

//à

if (document.contentType != 'text/html') return;

var react, tit={}, options={}, updated={};
const version='0.6.11';
const defOpts={
  version: '',

  enable_LLP: false,
  enable_LLPv2_2: false,
  enable_LLPv3_2: false,
  enable_LLPv4: true,
  timed_LLP: false,
  LLP_TO: 1000,
  hide_NP: false,
  no_tit: false,
  loadMsg: false,
  misc_disLLPstatus: true,

  lnk_rw_intf: true,
  lnk_rw_cmt_www: true,
  lnk_rw_cmt_old: false,
  lnk_rw_chat: true,

  stay_new: true,
  stay_new_old: false,
  force_new: false,

  mod_modLog_r: true,
  mod_modLog_hide: false,
  mod_queues_r: true,
  mod_queues_hide: false,
  mod_LnF_r: true,
  mod_LnF_hide: false,
  mod_Rules_r: true,
  mod_Rules_hide: false,
  mod_RmvR_r: true,
  mod_RmvR_hide: false,
  mod_UMng_r: true,
  mod_UMng_hide: false,
  mod_UMng2_hide: false,
  mod_fix_modmail: true,

  lnk_ext_noref: true,
  lnk_rm_utm: true,

  misc_mark: false,
  misc_rst_o: false,
  misc_nolabel: false,
  misc_noblur: false,
  },
 dlgT=[
  ['-', '<span new>New options have been added.</span><a new id="dismiss">Dismiss</a>'],
  ['{','"Long-lived" page:'],
  ['enable_LLP', 'Trigger long-lived page (enable only if needed)', 'checkbox'],
  ['-'],
  ['{'],
  ['enable_LLPv4', 'Use "clever" method (experimental)', 'checkbox', ['data-grp=enable_LLPv', 'new_0_5'] ],
  ['enable_LLPv3_2', 'Use "forced" method', 'checkbox', ['data-grp=enable_LLPv', 'new_0_4_4'] ],
  ['enable_LLPv2_2', 'Use redirect method (last resort)', 'checkbox', ['data-grp=enable_LLPv', 'new_0_4_2'] ],
  ['-'],
  ['timed_LLP', 'Delay "new post" closing', 'checkbox'],
  ['LLP_TO', '"new post" display time (ms)', 'text', ['style="width: 4em;"', 'onchange="this.value=/^\\D*(\\d+).*$/.exec(this.value)[1]"'] ],
  ['}'],
  ['-'],
  ['hide_NP', 'Hide "new post" form during the trick (empty screen)', 'checkbox'],
  ['no_tit', 'Don\'t try to fix incorrect page title', 'checkbox'],
  ['loadMsg', 'Show loading sign', 'checkbox', ['new_0_5']],
  ['misc_disLLPstatus', 'Display LLP status in menu', 'checkbox', ['new_0_5']],
  ['}'],
  ['-'],
  ['{', 'Rewrite links:'],
  ['', 'Notifications links are already rewritten to "new." by default. You can change the behavior of other links.'],
  ['-'],
  ['lnk_rw_intf', 'Rewrite interface links', 'checkbox'],
  ['lnk_rw_cmt_www', 'Rewrite "www." links in posts & comments', 'checkbox'],
  ['lnk_rw_cmt_old', 'Rewrite "old." links in posts & comments', 'checkbox'],
  ['lnk_rw_chat', 'Rewrite in "Chat" too', 'checkbox', ['new_0_4_0']],
  ['-'],
  ['stay_new', 'Try to keep navigating on "new."', 'checkbox'],
  ['stay_new_old', '... on "new." also from "old." all comments', 'checkbox', ['new_0_4_0']],
  ['force_new', 'Force-redirect all access on "www." to "new."', 'checkbox'],
  ['}'],
  ['-'],
  ['{','Moderation page:'],
  ['mod_modLog_r', 'Add menu item to old "Mod Log" page', 'checkbox'],
  ['mod_modLog_hide', 'Hide current "Mod Log" menu item', 'checkbox'],
  ['-'],
  ['mod_queues_r', 'Add menu item to old "Queues" page', 'checkbox', ['new_0_6_2']],
  ['mod_queues_hide', 'Hide current "Queues" menu item', 'checkbox', ['new_0_6_2']],
  ['-'],
  ['mod_LnF_r', 'Add back removed old menu items from "Look & feel" (community styling, post & user flair)', 'checkbox', ['new_0_6_4']],
  ['mod_LnF_hide', 'Hide current "Look & feel" menu item', 'checkbox', ['new_0_6_4']],
  ['-'],
  ['mod_Rules_r', 'Add menu item to old "Rules" page', 'checkbox', ['new_0_6_6']],
  ['mod_Rules_hide', 'Hide current "Rules" menu item', 'checkbox', ['new_0_6_6']],
  ['-'],
  ['mod_RmvR_r', 'Add menu item to old "Removal reasons" page', 'checkbox', ['new_0_6_8']],
  ['mod_RmvR_hide', 'Hide current "Saved Responses" menu item', 'checkbox', ['new_0_6_8']],
  ['-'],
  ['mod_UMng_r', 'Add menu item to old "User Management" page', 'checkbox', ['new_0_6_9']],
  ['mod_UMng_hide', 'Hide current "Restrited users" menu item', 'checkbox', ['new_0_6_9']],
  ['mod_UMng2_hide', 'Hide current "Mods and members" menu item', 'checkbox', ['new_0_6_11']],
  ['-'],
  ['mod_fix_modmail', 'Fix links also in Modmail', 'checkbox'],
  ['}'],
  ['-'],
  ['{','Misc:'],
  ['lnk_ext_noref', 'Add <code>rel="noreferrer"</code> to external links', 'checkbox'],
  ['lnk_rm_utm', 'Remove tracking <code>&utm_</code> parameter from all links', 'checkbox', ['new_0_5']],
  ['}'],
  ['-'],
  ['{','This dialog:'],
  ['misc_mark', 'Mark option difference from current and default value', 'checkbox'],
  ['misc_rst_o', 'Clicking on the diff mark resets the value', 'checkbox'],
  ['misc_nolabel', 'Clicking on text label of options doesn\'t toggle option', 'checkbox'],
  ['misc_noblur', 'Don\'t blur background', 'checkbox', ['new_0_4_6']],
  ['}'],
  ['-'],
  ['{','Infos:'],
  ['', '<a href="https://procyon-b.github.io/programming/" target="_blank" rel="noreferrer noopener">Homepage</a> &ndash; <a href="https://greasyfork.org/scripts/493986" target="_blank" rel="noreferrer noopener">Script page</a><version>v'+version+'</version>'],
  ['}'],
  ];


function getOpts() {
  try{
  options=GM_getValue('options');
  options=Object.assign({}, defOpts, options);
  }catch(e){
  Object.assign(options, defOpts);
  }
  try{
    updated=GM_getValue('updated', {});
  }catch(e){}
  }

function saveOpts(opt = options) {
  var o, k;
  for (k in opt) {
    if ( (defOpts[k] != undefined) && (opt[k] != defOpts[k]) ) {
      if (!o) o={};
      o[k]=opt[k];
      }
    }
  if (o) GM_setValue('options', o);
  else GM_deleteValue('options');
  if (Object.keys(updated).length) GM_setValue('updated', updated);
  else GM_deleteValue('updated');
  }

getOpts();
if (!options.version) {
  options.version=version;
  saveOpts();
  }
if (options.version != version) {

  // special fix
  if (version == '0.5') { // reddit has enabled LLP everywhere
    options.enable_LLP=false;
    }

  updated['new_'+version.replace(/\./g,'_')]=0;
  options.version=version;
  saveOpts();
  }
const showNew = 1209600000;
if (Object.keys(updated).length) {
  let k, now=Date.now();
  for (k in updated) {
    if ( updated[k] && ((updated[k] + showNew) < now) ) delete updated[k];
    }
  saveOpts();
  }

var st=document.createElement('style');

function ins() {
  document.removeEventListener('DOMContentLoaded', ins);
  window.removeEventListener('load', ins);

  document.documentElement.appendChild(st);
  document.body.addEventListener('click', function(ev){
    if (ev.target.classList.contains('icon-views')) {
      setOptions();
      }
    });
  }

if (document.readyState != 'loading') ins();
else {
  document.addEventListener('DOMContentLoaded', ins);
  window.addEventListener('load', ins);
  }

function tryUntil(F, TO=150, c=-1, fail) {
  if (!c--) {
    fail && fail();
    return;
    }
  try{F();}catch(e){setTimeout(function(){tryUntil(F,TO,c,fail);}, TO)}
  }

tryUntil( function(){document.documentElement.appendChild(st);} );

st.textContent=`.icon-views {cursor: pointer;}
.hideEdit ~ div {
  position: fixed;
  top: 0;
  opacity: 0;
  z-index: -1;
}
body.trick #SHORTCUT_FOCUSABLE_DIV > div:has( #AppRouter-main-content .ListingLayout-outerContainer > ._3ozFtOe6WpJEMUtxDOIvtU > div:first-child:empty + div[style] + div[style*="px"]) ~ div > ._1DK52RbaamLOWw5UPaht_S,
body.trick #AppRouter-main-content .ListingLayout-outerContainer > ._3ozFtOe6WpJEMUtxDOIvtU > div:first-child:empty + div[style] + div[style*="px"] {display: none;}
html[data-loadmsg]::before {
  content: "Loading...";
  position: fixed;
  z-index: 99999999;
  font: 30pt arial;
  margin: calc(50vh - 1em) calc(50% - 2.5em);
  background: #ff4500;
  padding: .5em;
  border-radius: 10px;
  box-shadow: 5px 10px rgba(0, 0, 0, .5);
}
`;

var mnuId;
function setMnu() {
  if (window !== window.top) return;
  try{
  if (mnuId) GM_unregisterMenuCommand(mnuId);
  mnuId=GM_registerMenuCommand('Settings'+(options.misc_disLLPstatus? ': LLP '+(options.enable_LLP?'on':'off')+' ' :'')+(Object.keys(updated).length ?' (new option)':''), function(){
    setOptions();
    });
  }catch(e){}
  }

if (window === window.top) setMnu();

var dlg=false;
function setOptions() {
  if (dlg) return;

  let k, now=Date.now();
  for (k in updated) {
    if (!updated[k]) updated[k]=now;
    else if ( (updated[k] + showNew) < now ) delete updated[k];
    }
  if (k) saveOpts();

  dlg=document.createElement('div');
  dlg.id='triggerLLP-dialog';
  dlg.className="triggerLLP-bg";
  dlg.innerHTML=`<style>
#triggerLLP-options {
  position: relative;
  --margins: 40px;
  max-height: calc( 100vh - 2 * var(--margins) );
  max-width: 530px;
  margin: var(--margins) auto;
  background: var( --color-neutral-background, var(--color-tone-8, white) );
  border: 2px solid gray;
  box-shadow: var( --boxshadow-modal );
  box-sizing: border-box;
}
html > body:not(.res-console-open) #RESNotifications, html >body:not(.res-console-open) #RESShortcutsAddFormContainer,
html > body:not(.res-console-open) .RESDropdownList, html > body:not(.res-console-open):not(.modal-open) .side #search {
  z-index: 2147483646!important;
}
.triggerLLP-bg {
  position: fixed;
  z-index: 2147483647;
  width: calc( 100vw + 40px);
  height: 100vh;
  top: 0;
  left: 0;
  overflow: auto;
  overscroll-behavior: contain;
}
span.tLLP-close {
  position: absolute;
  right: 5px;
  top: 5px;
  border-radius: 15px;
  width: 30px;
  height: 23px;
  text-align: center;
  padding-top: 7px;
  background: var( --color-interactive-background-disabled  );
  cursor: pointer;
}
span.tLLP-close:hover {
  background: var(--color-button-plain-background-hover);
}
span.tLLP-close svg {
  pointer-events: none;
}
#triggerLLP-options h2 {
  font-size: revert;
  background: var( --color-secondary-background-selected, lightgray);
  height: 40px;
  min-height: 40px;
  margin: 0;
  padding-left: 2em;
  line-height: 1.5em;
}
#triggerLLP-options .content {
  padding: 1em;
  margin: 0;
  overflow: auto;
  height: 100%;
  overscroll-behavior: contain;
}
#triggerLLP-options input {
  margin: 0;
  margin-right: 1em;
}
#triggerLLP-options div {
  line-height: 1.5em !important;
}
#triggerLLP-options .empty {
  margin-bottom: 1em;
}
#triggerLLP-options {
  display: flex;
  flex-direction: column;
  pointer-events: initial;
}
#triggerLLP-options .buttons {
  background: var( --color-secondary-background-selected, lightgray);
  padding: 0.5em;
  text-align: center;
  font-size: small;
}
#triggerLLP-options button,
#triggerLLP-options fieldset,
#triggerLLP-options legend {
  margin: revert;
  padding: revert;
  border: revert;
  vertical-align: revert;
}
html.theme-light #triggerLLP-options button {
  background: revert;
  color: revert;
}
html.theme-light #triggerLLP-options input[type="text"] {
  border: revert;
}
#triggerLLP-dialog .cont {
  position: fixed;
  width: calc( 100vw - 18px );
  pointer-events: none;
}
#triggerLLP-dialog:not(.noblur) .cont {
  backdrop-filter: blur(1px);
}
#triggerLLP-dialog.diff input,
#triggerLLP-dialog.diff span.diff {
  position: relative;
}
#triggerLLP-dialog.diff input[type="checkbox"]:not(:disabled):checked:not([data-checked])::before,
#triggerLLP-dialog.diff input[type="checkbox"]:not(:disabled)[data-checked]:not(:checked)::before,
#triggerLLP-dialog.diff span:first-child.diff:not(:has(+ :disabled))::before
{
  color: red;
  content: "*";
  left: -.5em;
  position: absolute;
}
#triggerLLP-dialog.diff input[type="checkbox"]:not(:disabled):checked:not([data-o_checked])::after,
#triggerLLP-dialog.diff input[type="checkbox"]:not(:disabled)[data-o_checked]:not(:checked)::after,
#triggerLLP-dialog.diff input:not(:disabled) + span.diff::after
{
  color: green;
  content: "*";
  right: -.5em;
  position: absolute;
}
#triggerLLP-dialog.diff input + span.diff::after {
  left: -.8em;
  right: unset;
}
#triggerLLP-dialog.diff.rst span.diff {
  cursor: pointer;
}
#triggerLLP-dialog:not(.rst) span.diff,
#triggerLLP-dialog:not(.rst) input::after,
#triggerLLP-dialog:not(.rst) input::before {
  pointer-events: none;
}
#triggerLLP-dialog :disabled ~ *, #triggerLLP-dialog :has(~ :disabled) {
  color: gray;
}
#triggerLLP-dialog a {
  color: #3a80e9;
  text-decoration: revert;
}
#triggerLLP-dialog a:hover {
  color: #47b0db;
}
body[class]:not([class=""]) #triggerLLP-options input[type="text"] {
  padding: 0;
}
body[class]:not([class=""]) #triggerLLP-dialog {
  font-family: IBMPlexSans, Arial, sans-serif !important;
  font-size: 16px !important;
}
body[class]:not([class=""]) #triggerLLP-dialog :not(input[type="text"]):not(h2):not(code) {
  font: inherit;
  text-transform: none;
  letter-spacing: unset;
}
#triggerLLP-options label {
  color: inherit;
}
#triggerLLP-options .item {
  display: flex;
  align-items: baseline;
}
#triggerLLP-dialog.nolabel label {
  pointer-events: none;
}
#triggerLLP-options code {
  font: revert;
}
#triggerLLP-options version {
  float: right;
}
#triggerLLP-options #dismiss {
  float: right;
  font-size: small;
  cursor: pointer;
}
#triggerLLP-options .content.noNew div:has(>[new]) {
  display: none;
}
`+(
Object.keys(updated).length ? '#triggerLLP-options .content:not(.noNew) div:has(> :is([new], ['+Object.keys(updated).join('], [')+'])) { background: rgba(255, 69, 0, .3); }':`
#triggerLLP-options div:has(>[new]) {
  display: none;
}
`
)+`</style>
<div class="cont">
<div id="triggerLLP-options">
<span class="tLLP-close"><svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16">
<path d="m18.442 2.442-.884-.884L10 9.116 2.442 1.558l-.884.884L9.116 10l-7.558 7.558.884.884L10 10.884l7.558 7.558.884-.884L10.884 10l7.558-7.558Z"></path>
</svg></span>
<h2>Fix "New" Reddit - Userscript options</h2>
<diV class="content">
</div>
<div class="buttons"><div><button class="tLLP-save">Save</button> <button class="tLLP-close">Cancel</button> &nbsp; &nbsp; <button class="tLLP-reset">Reset</button> <button class="tLLP-defaults">Defaults</button></div></div>
</div>
</div>
<div style="min-height:101vh;"></div>`;
  document.body.appendChild(dlg);

  var c=dlg.querySelector('.content');
  if (c) fillContent();

  function fillContent(opts = options) {
    let s='';
    for (let v of dlgT) {
      let k =v[0];
      if (k == '-') s+='<div class="empty">'+(v[1]||'')+'</div>';
      else if (k == '') s+='<div>'+v[1]+'</div>';
      else if (k == '{') s+='<fieldset>'+(v[1]?'<legend>'+v[1]+'</legend>':'');
      else if (k == '}') s+='</fieldset>';
      else {
        s+='<div class="item"><span></span><input type="'+v[2]+'" name="'+v[0]+'" '+
            (typeof opts[k] == 'boolean' ? 'id="'+v[0]+'"'+( opts[k] ? 'checked ':'') + (options[k] ? 'data-checked ':'') + (defOpts[k] ? 'data-o_checked ':'')
            :'value="'+opts[k]+'" data-value="'+options[k]+'" data-o_value="'+defOpts[k]+'" ')+
            (v[3] ? v[3].join(' ') : '')+
            '><span></span><label for="'+v[0]+'">'+v[1]+'</label></div>';
        }
      }
    c.innerHTML='<form onsubmit="return false">'+s+'</form>';
    dlg.classList.toggle('diff', options.misc_mark);
    dlg.classList.toggle('rst', options.misc_rst_o);
    dlg.classList.toggle('nolabel', options.misc_nolabel);
    dlg.classList.toggle('noblur', options.misc_noblur);
    dlg.querySelectorAll('input[type="text"]').forEach(txt_diff);
    }

  dlg.addEventListener('click', hevents);
  dlg.addEventListener('change', hevents);

  function hevents(ev){
    var t=ev.target;
    if (t.className == 'tLLP-close') {
      dlg.remove();
      dlg=undefined;
      }
    else if (t.className == 'tLLP-save') {
      let newOpts=JSON.parse(JSON.stringify(options));
      dlg.querySelectorAll('[name]').forEach(function(k){
        if (k.name in defOpts) {
          if (typeof defOpts[k.name] == 'boolean') newOpts[k.name]=k.checked;
          else newOpts[k.name]=k.value;
          }
        });

      saveOpts(newOpts);
      getOpts();
      dlg.remove();
      dlg=undefined;
      setMnu();
      for (let i in ML) ML[i].style.display=options[i] ? 'none' : '';
      }
    else if (t.className == 'tLLP-reset') {
      fillContent();
      }
    else if (t.className == 'tLLP-defaults') {
      fillContent(defOpts);
      }
    else if ( (t.tagName == 'INPUT') && (t.type == 'text') ) {
      txt_diff(t);
      }
    else if ( (t.tagName == 'INPUT') && (t.name=='misc_mark') ) {
      dlg.classList.toggle('diff', t.checked);
      }
    else if ( (t.tagName == 'INPUT') && (t.name=='misc_rst_o') ) {
      dlg.classList.toggle('rst', t.checked);
      }
    else if ( (t.tagName == 'INPUT') && (t.name=='misc_nolabel') ) {
      dlg.classList.toggle('nolabel', t.checked);
      }
    else if ( (t.tagName == 'INPUT') && (t.name=='misc_noblur') ) {
      dlg.classList.toggle('noblur', t.checked);
      }
    else if ( (t.tagName == 'SPAN') && t.classList.contains('cur') ) {
      t.nextElementSibling.value=t.nextElementSibling.dataset.value;
      txt_diff(t.nextElementSibling);
      }
    else if ( (t.tagName == 'SPAN') && t.classList.contains('def') ) {
      t.previousElementSibling.value=t.previousElementSibling.dataset.o_value;
      txt_diff(t.previousElementSibling);
      }
    else if (t.id == 'dismiss') {
      updated={};
      saveOpts();
      c.classList.add('noNew');
      setMnu();
      }

    if (t.dataset.grp) {
      let a=t.closest('form').querySelectorAll('[data-grp="'+t.dataset.grp+'"]').forEach(function(e){
        if (e != t) e.checked=false;
        });
      }
    }
  function txt_diff(e) {
    e.previousElementSibling.classList.toggle('diff', e.value != e.dataset.value);
    e.previousElementSibling.classList.toggle('cur', e.value != e.dataset.value);
    e.nextElementSibling.classList.toggle('diff', e.value != e.dataset.o_value);
    e.nextElementSibling.classList.toggle('def', e.value != e.dataset.o_value);
    }
  }




// Reddit - fix links

var isNew = (location.host == "new.reddit.com");
var isWww = (location.host == "www.reddit.com");
var isOld = (location.host == "old.reddit.com");
var isChat = (location.host == "chat.reddit.com");
var AS=HTMLElement.prototype.attachShadow;

function fixLinks() {

if (isChat && !options.lnk_rw_chat) return;
var clicks={}, delay=10000;
Ccl();
setTimeout(Ccl,12000);

var oldForNew = false, forNew = false;
if (options.stay_new || options.stay_new_old) {
  Gcl();
  forNew=document.referrer.startsWith('https://new.reddit.com/');
  if (!forNew && options.stay_new_old) forNew=/^https:\/\/old\.reddit\.com\/r\/[^\/]+\/comments\//.test(document.referrer);
  if (!isNew && !forNew) {
    forNew=clicks['_staynew_'+location.href];
    // if user reloads, reload as New
    if (forNew) window.addEventListener('unload', function(){
      clicks['_staynew_'+location.href]=Date.now();
      Scl();
      });
    }
  }
var onNew = isNew || forNew;
var toNew = onNew && !isNew;

if (options.force_new) toNew=true;
if ( /^\/r\/[^/]+\/comments\/$/.test(location.pathname)
  || location.href.startsWith('https://www.reddit.com/media')
   ) toNew=false;

if (clicks[location.href]) onNew=true;
if (options.mod_fix_modmail && (location.host == "mod.reddit.com") ) onNew=true;
if (isOld) {
  if (forNew && options.stay_new_old && /^\/r\/[^\/]+\/comments\/$/.test(location.pathname) ) oldForNew=true;
  else return;
  }

if (toNew) {
  if (location.host.startsWith('www.')) {
    let L=location.href.replace(/^https:\/\/www\.reddit\./, 'https://new.reddit.');
    if (!clicks[L]) {
      clicks[L]=Date.now();
      Scl();
      window.stop();
      location.host='new.reddit.com';
      }
    }
  }

if (!onNew) return;

if (isWww || isChat) {
  HTMLElement.prototype.attachShadow=function(m){/*[native */
    var e=this;
    e.sr=AS.call(e,m);
    newObs(e.sr);
    return e.sr;
    }
  }

if (document.readyState != 'loading') init();
else {
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  }

function newObs(r) {
  var o=new MutationObserver(cb), config = { attributes: false, childList: true, subtree: true};
  o.observe(r, config);
  return o;
}

var done=false;
function init() {
  if (done) return;
  done=true;
  document && document.body && chk();

  var obs=newObs(document.body);
  }

function stayNew(ev) {
  if (this.hostname == 'i.redd.it') clicks['_staynew_https://www.reddit.com/media?url='+ encodeURIComponent(this.href) ]=Date.now();
  clicks['_staynew_'+this.href]=Date.now();
  Scl();
  }

function chk(r) {
  var a=(r||document).getElementsByTagName("a");
  if (r && (r.nodeName == 'A')) a=[r, ...a];
  for (let i=0,e; e=a[i]; i++) {
    if (e._fixed) continue;
    e._fixed=true;

    if (options.lnk_rm_utm && e.search) {
      e.search=e.search.replace(/^\?/,'&').replace(/&utm_[^=&]*(?:=[^&]*)/g, '').replace(/^&/, '?');
      }

    if ( (e.hostname == 'i.redd.it')
      || (e.hostname == 'preview.redd.it') ) {
      e.rel=e.rel.replace('noreferrer', '');
      if (!isNew && options.stay_new) {
        e.addEventListener('click',stayNew);
        e.addEventListener('contextmenu',stayNew);
        }
      }
    else if ( !e.hostname.endsWith('redd.it') && !e.hostname.endsWith('reddit.com') ) {
      if (options.lnk_ext_noref && !(e.rel ||'').includes('noreferrer')) e.rel=(e.rel ||'')+' noreferrer';
      }
    else if (/^https?:\/\/(www\.|mod\.|old\.)?reddit\.com\//.test(e.href)) {

      if (/sticky\?num/.test(e.href)) continue;

      if ( e.href.match('^'+location.origin+location.pathname+'(\\?.*)?$') ) {
        if (options.stay_new) {
          e.addEventListener('click',stayNew);
          e.addEventListener('contextmenu',stayNew);
          }
        continue;
        }
      e.oriHref=e.href;
      let uLnk=e.classList.contains('_3t5uN8xUmg0TOwRCOGQEcU');
      if ( (options.lnk_rw_intf && !uLnk) ||
           (options.lnk_rw_cmt_www && uLnk) ||
           e.classList.contains('_1tpiOc0IxpDU113wUs4zi1') ) e.href=e.href.replace(/^https?:\/\/(www\.)?reddit\.com\//,'https://new.reddit.com/');
      if ( (options.lnk_rw_cmt_old && uLnk) ||
           oldForNew ) e.href=e.href.replace(/^https?:\/\/(old\.)?reddit\.com\//,'https://new.reddit.com/');
      }
    }
  }

function cb(mutL) {
  for(let mut of mutL) {
    if (mut.type == 'childList') {
      for (let e,i=0; e=mut.addedNodes[i]; i++) {
        if (e.nodeType == 1) chk(e);
        }
      }
    }
  }


function Scl() {
  if (!Object.keys(clicks).length) localStorage.removeItem("__newL__");
  else localStorage.setItem("__newL__", JSON.stringify(clicks) );
  }

function Gcl() {
  clicks=JSON.parse(localStorage.getItem("__newL__") || '{}');
  return clicks;
  }

function Ccl() {
  Gcl();
  var now=Date.now();
  for (let k in clicks) {
    if ( (clicks[k]+delay) < now ) delete clicks[k];
    }
  Scl();
  }

} // END fixLinks()

fixLinks();




// Reddit - trigger LLP

var noLLP=false, skipSub=0,
    fLLP=function(){},
    enable_LLPv2 = options.enable_LLPv2_2,
    enable_LLPv3 = options.enable_LLPv3_2,
    enable_LLPv4 = options.enable_LLPv4;

if (isNew) {

  fLLP=LLP_sub;

  if (options.enable_LLP) {
    if (enable_LLPv2) {
      if (/^\/r\/[^\/]+\/wiki\//.test(location.pathname)) {
        noLLP=true;
        }
      else if (!location.pathname.endsWith('/submit')) {
        window.stop();
        location=location.origin+'/submit#'+location.href;
        return;
        }
      else if (location.hash) {
        tryUntil(hideNP);
        tryUntil(function(){document.title='Reddit';});
        skipSub=2;
        }
      }

    if (enable_LLPv4) {
      enable_LLPv3=true;
      if ( /^\/r\/[^\/]+\/comments\//.test(location.pathname) ) {
        fLLP=LLP_cmt;
        }
      }

    if (enable_LLPv3) {
      if (/^\/r\/[^\/]+\/wiki\//.test(location.pathname)) {
        noLLP=true;
        }
      if (location.pathname.endsWith('/submit')) {
        skipSub=1;
        if (location.hash.startsWith('#back')) {
          tryUntil(hideNP);
          tryUntil(function(){document.title='Reddit';});
          skipSub=2;
          tit['#back#']='reddit';
          if (!options.no_tit) try{
            let k=location.href.split('#back#')[1];
            document.title=tit['#back#']=sessionStorage.getItem(k) || 'reddit';
            sessionStorage.removeItem(k);
            }catch(e){}
          }
        }
      }

    if (location.pathname.endsWith('/submit') && !location.hash) {
      skipSub=1;
      }

    }

  window.addEventListener('load', LLP);
  if ( (window === window.top) && options.loadMsg && (document.readyState != 'complete') ) {
    if (document.documentElement) document.documentElement.dataset.loadmsg='true';
    else {
      tryUntil( function(){if (document.readyState != 'complete') document.documentElement.dataset.loadmsg='true';} );
      }
    }
  }

var LMTO=0;
function clrLoad(t = 0) {
  if (LMTO) clearTimeout(LMTO);
  return LMTO=setTimeout( function(){delete document.documentElement.dataset.loadmsg;} , t);
  }

function hideNP() {
  if (!options.hide_NP) return;

  function rmCls() {
    setTimeout(function(){document.body.classList.remove('trick');}, t);
    }

  document.body.classList.add('trick');
  let t = (options.timed_LLP ? options.LLP_TO || 1000 : 0)*1 + 10000;
  if (document.readyState != 'loading') rmCls();
    else {
      window.addEventListener('load', rmCls);
      }

  clrLoad(t);
  }

function LLP() {
  var r=document.querySelector('#SHORTCUT_FOCUSABLE_DIV');
  for (let k in r) {
    if (k.startsWith('__reactEventHandlers$')) {
      react=k;
      break;
      }
    }
  if (!react) {
    clrLoad();
    return;
    }
  fLLP();
  }

function LLP_sub() {
  clrLoad();
  if (location.pathname.endsWith('/submit')) ;

  if (noLLP) return;
  if (location.pathname.endsWith('/settings/')) return;
  if (location.pathname.endsWith('/settings')) return;
  if (location.pathname.startsWith('/message/')) return;
  if (location.search.includes('styling')) return;

  // fix no title set in bg win/tab
  setBgTitle();

  if (!options.enable_LLP) return;

  // find link without sub-R
  var e, btn;
  if (enable_LLPv3 && !skipSub) {
    btn='a[href="/settings"], a[href="/premium"]';
    e=document.querySelector(btn);
    }
  else {
    btn='a[href="/submit"]';
    e=document.querySelector(btn);
    }

  if (!e && !skipSub) {
    // try to find in drop-down
    let c=document.querySelector('header button img + i.icon-caret_down, header button svg + i.icon-caret_down, header button i + i.icon-caret_down');
    if (c) {
      c=c.closest('button');
      c[react].onMouseDown({target: c});
      }
    e=document.querySelector(btn);
    }

  // use "+" icon
  if (!e && !skipSub) e=document.querySelector('header button:not([role="menuitem"]) > .icon-add');

  if (e || skipSub) {
    if (!skipSub) {
      hideNP();
      tit[location.href]=document.title;
      e.click();
      if (enable_LLPv3) {
        let key=Math.random();
        if (!options.no_tit) try{ sessionStorage.setItem(key, document.title); }catch(e){}
        history.replaceState({},null, location.origin+'/submit#back#'+key);
        window.stop();
        location.reload();
        return;
        }
      }
    findField();
    }
  }

function LLP_cmt() {
  var r=true;
  try{r=LLP_cmt_all();}catch(e){}
  if (r) LLP_sub();
  }

function LLP_cmt_all() {
  var R;
  clrLoad();

  // post comment - markdown
  if (R=document.querySelector('[data-testid="post-container"] ~ div .public-DraftEditor-content')) {
    let b=R.closest('[data-test-id="comment-submission-form-richtext"]');
    if (b) b=b.parentElement;
    if (b) b=b.querySelector('span > button');
    if (b) { b.click(); b.click(); }
    else return true;
    let e=R.querySelector('.public-DraftStyleDefault-block br[data-text="true"]');
    if (!e) return true;
    e.innerText='o'; R[react].onInput({target:R})
    e.innerText=''; R[react].onInput({target:R})
    if (e=document.querySelector('button[id="USER_DROPDOWN_ID"]')) {e.click();e.click();}
    return;
    }

  // post comment - fancy pants
  else if (R=document.querySelector('[data-testid="post-container"] ~ [data-test-id="comment-submission-form-markdown"] textarea')) {
    console.info('...ok', R);
    R.value='o'; R[react].onChange({target:R, currentTarget:R})
    R.value=''; R[react].onChange({target:R, currentTarget:R})
    R[react].onBlur({target:R});
    return;
    }

  // comment comment - markdown or fancy pants
  else if (R=document.querySelector('button > .icon-comment')) {
    // no reply input should be open
    if (document.querySelector('[data-testid="comment"] ~ div .public-DraftEditor-content')) return true;
    let b;
    if (R) b=R.closest('button');
    if (b) {
      //let p=document.documentElement.scrollTop;
      let bar=b.closest('._3KgrO85L1p9wQbgwG27q4y') || b.parentElement.parentElement;
      if (bar) bar.classList.add('hideEdit');

      //var wsiv=window.scrollIntoView;
      //window.scrollIntoView=function(){};

      b.click();
      clrLoad(10000);
      tryUntil(function(){
        //window.scrollTo(p,0);
        //window.scrollIntoView=wsiv;

        let e, t=document.querySelector('[data-testid="comment"] ~ div .public-DraftEditor-content');

        // markdown
        if (!t) {
          t=document.querySelector('[data-testid="comment"] ~ div textarea');
          t.value='o'; t[react].onChange({target:t, currentTarget:t})
          t.value=''; t[react].onChange({target:t, currentTarget:t})
          e=t.closest('[data-test-id="comment-submission-form-markdown"]');
          }

        // fancypants
        else {
          t[react].onFocus({target:t})
          e=t.querySelector('.public-DraftStyleDefault-block br[data-text="true"]');
          e.innerText='o'; t[react].onInput({target:t})
          e.innerText=''; t[react].onInput({target:t})
          e=t.closest('[data-test-id="comment-submission-form-richtext"]');
          }

        //window.scrollTo(p,0);
        if (e) e=e.parentElement;
        if (e) e=e.querySelector('button[type="reset"]');
        if (e) e.click();
        setTimeout(function(){ if (bar) bar.classList.remove('hideEdit'); },0);
        clrLoad();
        },2,300, LLP_sub );
      }
    return;
    }

  return true;
  }

var max=1000;
function findField() {
  if (!max) return;
  max--;
  var b=document.querySelector('textarea[placeholder][maxlength="300"][rows="1"]');
  if (!b) { setTimeout(findField, 10); return; }
  let tt;
  if ( !options.no_tit && (tt=document.querySelector('html head title')) ) {
    obsTit.observe(tt, {attributes: false, subtree: true, childList: true, characterData: true });
    }
  b.value='e';
  b[react].onChange({target:b});
  b.value='';
  b[react].onChange({target:b});
  if (!(skipSub & 1)) setTimeout(function(){
    var L;
    if (enable_LLPv2 && (L=location.hash.substr(1)).startsWith('https://') ) {
      history.replaceState({},null, L);
      history.pushState({},null, L);
      setTimeout(setBgTitle, 2000);
      history.back();
      setTimeout(function(){history.forward();}, 8000); // fix title
      }
    else
      history.back();
    clickDiscard();
    clrLoad();
    }, options.timed_LLP ? options.LLP_TO || 1000 : 0);
  }

var max2=20;
function clickDiscard(){
  if (!max2) return;
  max2--;
  var b=document.querySelector('div[aria-modal="true"] footer button');
  if (!b) { setTimeout(clickDiscard, 10); return; }
  b.click();
  }

function setBgTitle(x) {
  if (document.visibilityState != 'hidden') return;
  if (enable_LLPv2) {
    if (location.pathname == '/') document.title='Reddit';
    else if (location.pathname.startsWith('/user')) document.title=location.pathname.split('/')[2];
    else if (/^\/(r\/[^\/])+\//.test(location.pathname) ) document.title=RegExp.$1;
    }
  if (location.pathname == '/') return;
  try{
  let t=document.querySelector('h1')?.textContent;
  if (!t && /^\/r\/[^\/]+\/comments\/./.test(location.pathname) ) t=document.querySelector('[data-adclicklocation="title"]')?.textContent;
  if (/^\/r\/[^/]+\/wiki\/([^/]+)/.test(location.pathname)) t=null;
  if (t && (document.title != t) ) document.title = t;
  }catch(e){}
  }


var title;
// monitor title to prevent "submit" to appear
function validTit(s) {
  const S='Submit to |Einreichen bei |Enviar a |Envoyer à |Invia a |Postar no |Enviar para ';
  const H='|Reddit – Entdecke ohne Ende|Reddit - Dive into anything|Reddit - Explora lo que quieras|Reddit: Explora lo que quieras|Reddit - Explorez sans limite|Reddit - Scopri ciò che ti piace|Reddit - Explore o que quiser|Reddit - Explora tudo o que quiseres';
  var RE=new RegExp('^(\([0-9]+\) *)?('+S+(location.pathname=='/' ? '' : H)+')');
  return !RE.test(s);
  }

const obsTit=new MutationObserver(function(muts){
  if (!tit[location.href] && tit['#back#']) {
    document.title=tit[location.href]=tit['#back#'];
    delete tit['#back#'];
    }
  if (!title) title=muts[0].addedNodes[0].textContent;
  var titleOK, skipT=false;
  for (let t,i=muts.length-1; i >= 0 ; i--) {
    t=muts[i].addedNodes[0].textContent;
    if (validTit(t)) {
      titleOK=t;
      skipT=(i==muts.length-1);
      break;
      }
    else {
      let q=RegExp.$1, t=muts[i].removedNodes[0].textContent;
      if (validTit(t)) titleOK=t.replace(/^(\([0-9]+\) *)?/, q);
      }
    }
  let t=tit[location.href];
  if (!t) {this.disconnect()}
  if (!t || !titleOK) return;
  if (!skipT) setTimeout(function(){
    document.title=titleOK;
    },0);
  });
var TO;





// Reddit - fix mod log
// 0.2

  // if on "new"
if (isNew) {

window.addEventListener('popstate', function(){
  setTimeout(selItem, 200);
  });

const aliases={
  '/about/reports': '/about/modqueue',
  '/about/spam': '/about/modqueue',
  '/about/edited': '/about/modqueue',
  '/about/unmoderated': '/about/modqueue',
  '/about/flair': '/about/userflair',
  '/about/muted': '/about/banned',
  '/about/contributors': '/about/banned',
  '/about/moderators': '/about/banned',
  '/about/removal': '/about/rules',

  '/about/emojis': '/about/awards',
  };

const fixLnks={
  '/about/banned': 1,
  '/about/muted': 1,
  '/about/contributors': 1,
  '/about/moderators': 1,
  '/about/moderators/': 1
  };

const w2n = {'approved-users': 'contributors'};

function fixL(e) {
  let a=(e).getElementsByTagName("a");
  for (let i=0,e; e=a[i]; i++) {
    if (e._modfixed) continue;
    e._modfixed=true;
    //let s=e.pathname.replace(/^\/mod\/([^\/]*)\/(.*)/, '/r/$1/about/$2');
    let s=e.pathname.replace(/^\/mod\/([^\/]*)\/(.*)/, function(...a){return '/r/'+a[1]+'/about/'+(w2n[a[2]] || a[2]);} );
    if (s != e.pathname) {
      let a=e.cloneNode(true);
      e.parentNode.insertBefore(a,e);
      e.remove();
      a.pathname=s;
      a.addEventListener('click', clickItem);
      }
    }
  }

function clickItem(ev){
  ev.cancelBubble = true;
  let e=ev.currentTarget;
  history.pushState({},null, e.href);
  history.pushState({},null, e.href);
  //e.firstElementChild.classList.add('_selected');
  //sItem=e.firstElementChild;
  //sItem.classList.add('selected');
  //sItem.style="background-color: #FF4500;";
  setTimeout(function(){
    //history.forward();
    //setTimeout(function(){ p.parentNode.querySelectorAll('.selected').forEach( (e) => e.classList.remove('selected') ); },1000);
    },100);
  ev.preventDefault();
  history.back();
  }

function selItem() {
  var RE= /^(\/r\/[^/]+)(\/about\/([^/]*))/.exec(location.pathname);
  if (!RE) return;
  if (!mnu) return;

  var I;
  if (RE[3])
    I=  mnu.shadowRoot.querySelector('a[href="'+RE[1]+RE[2]+location.search+'"] > :first-child')
     || mnu.shadowRoot.querySelector('a[href^="'+RE[1]+RE[2]+'"] > :first-child')
     || mnu.shadowRoot.querySelector('a[href="'+RE[1]+(aliases[RE[2]] || RE[2])+location.search+'"] > :first-child')
     || mnu.shadowRoot.querySelector('a[href^="'+RE[1]+(aliases[RE[2]] || RE[2])+'"] > :first-child');

  mnu.shadowRoot.querySelectorAll('a > .selected').forEach(function(e){
    if (e === I) { I=null; return; }
    e.classList.remove('selected');
    e.style=undefined;
    });

  if (I) {
    I.classList.add('selected');
    I.style="background-color: #FF4500;";
    }

  if (fixLnks[RE[1]]) fixL(mnu.nextElementSibling);
  }


var hpushState=history.pushState;

history.pushState=function(a,b,u){
  if ( /^\/r\/[^/]+\/about/.test(u) && /^\/r\/[^/]+\/about/.test(location.pathname) ) {
    if (!mClicked && (location.pathname != u.split('?')[0] ) && u.includes('?')) {
      arguments[2]=u.replace(/^.*\/about\/[^?]*/, location.pathname);
      if (!location.search) setTimeout(function(){
        history.back();
        setTimeout(function(){history.forward()},100);
        },0);
      }
    }
  mClicked=false;
  return hpushState.apply(history, arguments);
  }


// find deepest root
var R, ML={};
const obsRoot=new MutationObserver(function(muts){
  for (let mut of muts) {
    if (mut.addedNodes.length) {
      if (R=document.querySelector('#AppRouter-main-content')) {
        this.disconnect();
        o_pg.observe(R, {attributes: false, subtree: false, childList: true});
        fixlocs();
        return;
        }
      }
    }
  });

function startObs() {obsRoot.observe(document.body, {attributes: false, subtree: true, childList: true});}
if (document.body) startObs();
else {
  document.addEventListener('DOMContentLoaded', startObs);
  }



function fixlocs(muts){
  if (/^\/r\/[^/]+\/about/.test(location.pathname) ) fixMod();
  }

const o_pg=new MutationObserver(fixlocs);
var obsmnu;

var mnu, mClicked;
function fixMod() {
  var sItem;
  mnu=null;

  function find(muts){
    if (mnu) {
      // verif
      let e=mnu.shadowRoot.querySelector('a[href^="/mod/"][href$="/log"]');
      if (!e) return;
      obsmnu && obsmnu.disconnect();
      var st=document.createElement('style');
      mnu.shadowRoot.appendChild(st);
      st.textContent=`
a > .w-xs ~ span.items-center:not(:has( > * )) {
overflow: hidden;
text-overflow: ellipsis;
display: inline !important;
line-height: 1.4em;
}
[data-hide] {
opacity: .4;
}
[data-hide] .selected {
background: none !important;
}
`;

      function onclk(ev) {
        console.info(ev, {ev}, {t:this}, {arguments});
        if (!sItem) {
          sItem=mnu.shadowRoot.querySelector('.selected');
          }
        if (sItem) {
          sItem.classList.remove('selected');
          sItem.style='';
          }
        mClicked=ev.currentTarget;
        sItem=mClicked.firstElementChild;
        sItem.classList.add('selected');
        sItem.style="background-color: #FF4500;";
        }

      function fixLnk() {
        oFixLnk.observe(mnu.nextElementSibling , {subtree: true, childList: true});
        }
      
      var oFixLnk=new MutationObserver(function(mutL){
        if ( !fixLnks[ location.pathname.replace(/^\/r\/[^/]+/, '') ] ) {
          this.disconnect();
          return;
          }

        for(let mut of mutL) {
          if (mut.type == 'childList') {
            for (let e,i=0; e=mut.addedNodes[i]; i++) {
              if (e.nodeType == 1) fixL(e);
              }
            }
          }
        });

      // at load:
      if ( fixLnks[ location.pathname.replace(/^\/r\/[^/]+/, '') ] ) {
        fixL(mnu.nextElementSibling);
        fixLnk();
        }


      let moded=false;
      if (options.mod_modLog_r) {
        moded=addItem('a[href^="/mod/"][href$="/log"]', '/about/log', 'mod_modLog_hide') || moded;
        }
      if (options.mod_queues_r) {
        moded=addItem('a[href^="/mod/"][href$="/queue"]', '/about/modqueue', 'mod_queues_hide') || moded;
        }
      if (options.mod_uflair_r) {
        moded=addItem('a[href^="/mod/"][href$="/userflair"]', '/about/userflair', 'mod_uflair_hide') || moded;
        }
      if (options.mod_Rules_r) {
        moded=addItem('a[href^="/mod/"][href$="/rules"]', '/about/rules', 'mod_Rules_hide') || moded;
        }
      if (options.mod_RmvR_r) {
        moded=addItem('a[href^="/mod/"][href$="/saved-responses"]', '/about/removal', 'mod_RmvR_hide', {txt: 'Removal reasons'} ) || moded;
        }
      if (options.mod_UMng_r) {
        moded=addItem('a[href^="/mod/"][href$="/banned"]', '', 'mod_UMng_hide') || moded;
        moded=addItem('a[href^="/mod/"][href$="/moderators"]', '/about/banned', 'mod_UMng2_hide', {txt: 'User Management', fixLnk: true}) || moded;
        }

      if (options.mod_LnF_r) {
        moded=addItem('a[href^="/mod/"][href$="/lookandfeel"]', '/?styling=true', '', {txt:'Community styling'}) || moded;
        moded=addItem('a[href^="/mod/"][href$="/lookandfeel"]', '/about/postflair', '', {txt:'Post flair'}) || moded;
        moded=addItem('a[href^="/mod/"][href$="/lookandfeel"]', '/about/userflair', 'mod_LnF_hide', {txt:'User flair'}) || moded;
        }

      if (moded) mnu.shadowRoot.querySelectorAll('a').forEach(function(e){
        e.addEventListener('click', onclk, {capture: true});
        });

      selItem();

      function addItem(o, n, hide, more={}) {
        var e=mnu.shadowRoot.querySelector(o);
        if (!e) return false;
        var E, R=e.pathname.split('/')[2];
        E=ML[hide]=e.closest('div');
        if (n) {
          var a=E.cloneNode(true);
          delete a.dataset.hide;
          a.removeAttribute('style');
          E.parentNode.insertBefore(a,E);
          }
        E.dataset.hide=hide;
        if (options[hide]) E.style.display='none';
        if (!n) return true;
        e=a.querySelector('a');
        e.target="_self";
        var et=e.querySelector('span.items-center');
        if (et) {
          et.querySelectorAll('.text-brand-onBackground').forEach(function(e){e.remove();});
          if (more.txt) et.innerHTML=more.txt;
          et.innerHTML+=' (old)';
          }
        e.href='/r/'+R+n;
        e.addEventListener('click', clickItem);
        if (more.fixLnk) e.addEventListener('click', fixLnk);
        return true;
        }
      }
    else {
      if (mnu=R.querySelector('mod-nav')) {
        obsmnu && obsmnu.disconnect();
        obsmnu.observe(mnu.shadowRoot, {attributes: false, subtree: true, childList: true});
        return true;
        }
      }
    }

  if(obsmnu) obsmnu.disconnect();
  obsmnu=new MutationObserver(find);
  if (!find(0)) obsmnu.observe(R, {attributes: false, subtree: true, childList: true});
  }

} // if (isNew)


})();