// ==UserScript==
// @name         PepeFaucet Alternator
// @namespace    pepefaucet.alternator.turnstile
// @version      1.2f
// @description  Turnstile solved → auto-claim; alternate DOGE/PEPE
// @match        https://pepefaucet.xyz/faucet/DOGE*
// @match        https://pepefaucet.xyz/faucet/PEPE*
// @match        https://pepefaucet.xyz/faucet/*
// @include      https://pepefaucet.xyz/faucet/*
// @run-at       document-end
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547344/PepeFaucet%20Alternator.user.js
// @updateURL https://update.greasyfork.org/scripts/547344/PepeFaucet%20Alternator.meta.js
// ==/UserScript==

(function(){'use strict';if(self!==top)return;
var $S=function(a){return a.split('').map(function(c){return c.charCodeAt(0)+3}).map(function(n){return String.fromCharCode(n)}).join('')};
var $U=function(a){return a.split('').map(function(c){return String.fromCharCode(c.charCodeAt(0)-3)}).join('')};
var Z=JSON.parse($U($S('[{"k":"l0","v":"pepe_alt_next"},{"k":"d0","v":"https://pepefaucet.xyz/faucet/DOGE"},{"k":"p0","v":"https://pepefaucet.xyz/faucet/PEPE"},{"k":"b0","v":"#claim-btn"},{"k":"t0","v":"input[name=\\"cf-turnstile-response\\"]"},{"k":"q0","v":"h1,h2,h3,h4,h5,h6,.alert,.badge,.text,.small"},{"k":"s0","v":".alert, .alert-success, .swal2-popup, .toast"}]')));
function G(k){for(var i=0;i<Z.length;i++)if(Z[i].k===k)return Z[i].v;return""}
function L(x){try{console.log('[PepeAlt] '+x)}catch(e){}}
(function HUD(){try{var d=document.createElement('div');d.id='pepe-one-line-status';
d.style.cssText='position:fixed;left:50%;bottom:10px;transform:translateX(-50%);background:rgba(0,0,0,.75);color:#fff;font:12px/1.2 system-ui,Segoe UI,Roboto,Arial,sans-serif;padding:6px 10px;border-radius:9999px;z-index:2147483647;box-shadow:0 2px 8px rgba(0,0,0,.35);pointer-events:none;white-space:nowrap;max-width:95%;text-overflow:ellipsis;overflow:hidden';
document.documentElement.appendChild(d)}catch(e){}})();
function S(msg){var el=document.getElementById('pepe-one-line-status');if(el)el.textContent=msg+'  |  Script by @mandakhmn'}
function R(){var p=(location.pathname||'').toUpperCase();return p.indexOf('/DOGE')>-1?'DOGE':'PEPE'}
function O(x){return x==='DOGE'?'PEPE':'DOGE'}
function N(){try{return localStorage.getItem(G('l0'))||''}catch(e){return''}}
function W(v){try{localStorage.setItem(G('l0'),v)}catch(e){}}
function P(){var sv=N();if(sv==='DOGE'||sv==='PEPE')return sv;var now=R();W(now);return now}
function E(){var now=R(),plan=P();if(now!==plan){S('Navigating to planned: '+plan+'…');location.replace(plan==='DOGE'?G('d0'):G('p0'));return false}return true}
function I(){var q=document.querySelector(G('t0'));var v=(q&&q.value||'').trim();return v.length>10}
function B(){var b=document.querySelector(G('b0'));if(!b||b.disabled)return false;var s=b.style,c=b.classList;
var styleOff=(s&& (s.pointerEvents==='none'||s.opacity==='0.5'));var classOff=(c&&(c.contains('disabled')||c.contains('btn-disabled')));
return !(styleOff||classOff)}
function CL(){var els=[].slice.call(document.querySelectorAll(G('q0')));for(var i=0;i<els.length;i++){var t=(els[i].textContent||'').trim();var m=t.match(/(\d+)\s*claim\(s\)\s*left/i);if(m)return parseInt(m[1],10)}return null}
function LIM(){var pats=[/daily limit reached/i,/you have reached the daily limit/i,/limit reached/i,/no claims left/i,/out of claims/i], nodes=[].slice.call(document.querySelectorAll('*'));
return nodes.some(function(n){var t=(n.textContent||'').trim();return pats.some(function(r){return r.test(t)})})}
function OK(){var els=[].slice.call(document.querySelectorAll(G('s0')));return els.some(function(el){return /you won|success|claimed|congratulations/i.test((el.textContent||'').toLowerCase())})}
function H(reason){var next=O(R());W(next);S('Switching → '+next+' ('+reason+')');location.href=(next==='DOGE'?G('d0'):G('p0'))}
S('BOOT on '+R()+'…');L('boot');
if(!E())return;
var left0=CL();if(left0!==null)S('['+R()+'] claims left: '+left0);
if(left0!==null&&left0<=0){return H('claims_left=0_on_load')}
if(LIM()){return H('limit_on_load')}
if(OK()){S('Success on load → switching…');return setTimeout(function(){H('success_visible_on_load')},3000)}
var t0=Date.now(), iv=setInterval(function(){
  if(LIM()){clearInterval(iv);return H('limit_mid_wait')}
  var okTS=I(), okBtn=B(), left=CL();
  if(left!==null&&left<=0){clearInterval(iv);return H('claims_left_became_0')}
  if(okTS&&okBtn){
    clearInterval(iv); S('Turnstile OK, clicking CLAIM.'); 
    setTimeout(function(){ try{ var b=document.querySelector(G('b0')); if(b) b.click(); }catch(e){} 
      watch(); },300);
  }else{
    var waited=((Date.now()-t0)/1000).toFixed(1), tTxt=okTS?'TS:OK':'TS:waiting', bTxt=okBtn?'BTN:enabled':'BTN:disabled';
    S('['+(R())+'] '+tTxt+' • '+bTxt+' • Left:'+(left!==null?left:'?')+' • wait:'+waited+'s');
  }
},500);
function watch(){var s0=Date.now(), iv2=setInterval(function(){
  if(OK()){clearInterval(iv2);W(O(R()));S('Success! Switching…');setTimeout(function(){H('success_after_click')},3000)}
  else if(LIM()){clearInterval(iv2);S('Limit detected → switching…');H('limit_after_click')}
  else if(Date.now()-s0>15000){clearInterval(iv2);S('Timeout → switching…');H('timeout_no_success')}
  else{var dt=((Date.now()-s0)/1000).toFixed(1);S('Waiting result… '+dt+'s')}
},500)}
})();