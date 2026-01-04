// ==UserScript==
// @name         Bonk.io Chat Linkify
// @version      1.0.0
// @description  Makes plain-text links in Bonk.io chat clickable with a Confirm Window for user safety.
// @author       miquella
// @namespace    https://greasyfork.org/en/users/1503369
// @license      MIT
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545608/Bonkio%20Chat%20Linkify.user.js
// @updateURL https://update.greasyfork.org/scripts/545608/Bonkio%20Chat%20Linkify.meta.js
// ==/UserScript==

/*
Safety — Bonk.io Chat Linkify
- No network calls; DOM-only. No data leaves your device.
- Scope: https://bonk.io/gameframe-release.html; edits chat + its own modal.
- Link opens: new tab + rel="noopener noreferrer" (blocks tab-nabbing, hides referrer). Your IP is still visible to the site you visit.
- Consent: shows target domain + warning; you must confirm to open.
- Trust list: stored locally (localStorage key: "bonk_linkify_allow_domains").
- Clear via: localStorage.removeItem("bonk_linkify_allow_domains")
- Theme/SFX: read-only sampling from 'div#leaveconfirmwindow';
- Keys: Esc = cancel, Enter = open (when modal focused).
- Caution: NEVER enter passwords, tokens, or recovery codes from links.
*/

(function(){
  "use strict";

  // Targets: lobby + in-game chat containers (root + message selector)
  var AREAS=[{root:"#newbonklobby_chat_content",msg:".newbonklobby_chat_msg_txt"},{root:"#ingamechatcontent",msg:".ingamechatmessage"}];
  // URL detection (fast heuristic) + trim trailing punctuation
  var URL=/(?:https?:\/\/)?(?:www\.)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s<]*)?/gi, TRAIL=/[),.;!?]+$/;
  // Allowlist storage key (per-browser, local only)
  var KEY_ALLOW="bonk_linkify_allow_domains";

  // Convert plain-text URLs inside a message span into <a> that goes through confirm
  function linkifySpan(span){
    if(!span||span.dataset.linkified) return;
    var text=span.textContent; if(!text||!URL.test(text)) return;
    URL.lastIndex=0; var frag=document.createDocumentFragment(), last=0;
    text.replace(URL,function(m,i){
      if(i>last) frag.appendChild(document.createTextNode(text.slice(last,i)));
      var trailing=""; var cleaned=m.replace(TRAIL,function(p){trailing=p;return"";});
      var href=/^https?:\/\//i.test(cleaned)?cleaned:"https://"+cleaned; // normalize to https
      var a=document.createElement("a");
      a.textContent=cleaned; a.href=href; a.target="_blank"; a.rel="noopener noreferrer nofollow ugc"; // security attrs
      a.addEventListener("click",function(e){e.preventDefault();confirmOrOpen(href);});// route via confirm
      frag.appendChild(a); if(trailing) frag.appendChild(document.createTextNode(trailing));
      last=i+m.length; return m;
    });
    if(last<text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    span.textContent=""; span.appendChild(frag); span.dataset.linkified="1";
  }

  // Initial scan + MutationObserver to catch new messages/edits as they appear
  function scan(root,sel){ var list=root.querySelectorAll(sel); for(var i=0;i<list.length;i++) linkifySpan(list[i]); }
  function initArea(a){
    var r=document.querySelector(a.root); if(!r) return false;
    scan(r,a.msg);
    new MutationObserver(function(records){
      for(var i=0;i<records.length;i++){
        var m=records[i];
        if(m.type==="characterData"){
          var p=m.target&&m.target.parentElement;
          if(p&&p.matches&&p.matches(a.msg)) linkifySpan(p);
        }
        var added=m.addedNodes;
        if(added&&added.length){
          for(var j=0;j<added.length;j++){
            var n=added[j]; if(n.nodeType!==1) continue;
            if(n.matches&&n.matches(a.msg)) linkifySpan(n);
            if(n.querySelectorAll){
              var inner=n.querySelectorAll(a.msg);
              for(var k=0;k<inner.length;k++) linkifySpan(inner[k]);
            }
          }
        }
      }
    }).observe(r,{childList:true,subtree:true,characterData:true});
    return true;
  }

  // Read theme from native "Leave Game?" dialog so modal looks OEM (colors, fonts, radius, shadow)
  function sampleTheme(){
    function pick(s){return document.querySelector(s);}
    var leavePanel=pick("#leaveconfirmwindow")||pick("#leaveconfirmwindowcontainer")||pick(".windowShadow"); // panel-like ref
    var titleBg=pick("#leaveconfirmwindow_textbg")||pick("#leaveconfirmwindow_topbg")||pick(".windowTopBar")||leavePanel; // header strip
    var textRef=pick("#leaveconfirmwindow_text1")||leavePanel||document.body; // text style reference

    var ps=leavePanel?getComputedStyle(leavePanel):null;
    var ts=getComputedStyle(textRef);
    var bs=titleBg?getComputedStyle(titleBg):null;

    var panelBg=(ps&&ps.backgroundColor&&ps.backgroundColor!=="rgba(0, 0, 0, 0)")?ps.backgroundColor:"rgb(22,24,33)"; // fallback if transparent
    var winRadius="3px", btnRadius="2px"; // OEM radii
    var width=(ps&&ps.width&&parseFloat(ps.width))?ps.width:"310px"; // mirror native width
    var titleColor=(titleBg?getComputedStyle(titleBg).color:null)||"rgb(255,255,255)"; // header text color (usually white)
    var titleBgColor=(bs&&bs.backgroundColor)?bs.backgroundColor:"rgb(0,160,140)"; // header strip bg
    var font=(ts&&ts.fontFamily)?ts.fontFamily:"system-ui,sans-serif";
    var shadow=(ps&&ps.boxShadow)?ps.boxShadow:"rgba(0,0,0,0.63) 1px 1px 5px -2px";
    var textColor=(ts&&ts.color)?ts.color:"rgb(198,200,209)";
    return {panelBg,winRadius,btnRadius,width,titleColor,titleBgColor,font,shadow,textColor};
  }

  // Allowlist helpers (localStorage only; never leaves device)
  function getAllow(){ try{ var v=localStorage.getItem(KEY_ALLOW)||"[]"; return JSON.parse(v); }catch(e){ return []; } }
  function setAllow(a){ try{ localStorage.setItem(KEY_ALLOW,JSON.stringify(Array.from(new Set(a)))); }catch(e){} }
  function hostOf(u){ try{ return new URL(u).hostname.toLowerCase(); }catch(e){ return u.replace(/^https?:\/\//i,"").split("/")[0].toLowerCase(); } }

  // Apply native button classes; piggyback global SFX by mimicking hover/press (never clicks)
  function addBtnClasses(el){ el.classList.add("brownButton","brownbutton_classic","buttonShadow","bli-btn"); }
  function wireSFX(el){
    var ref=document.querySelector("#leaveconfirmwindow_okbutton")||document.querySelector("#leaveconfirmwindow_cancelbutton");
    if(!ref) return;
    function fire(t){ try{ ref.dispatchEvent(new MouseEvent(t,{bubbles:true,cancelable:true,view:window})); }catch(e){} }
    el.addEventListener("mouseenter",function(){fire("mouseenter");fire("mouseover");});
    el.addEventListener("mousedown",function(){fire("mousedown");});
    el.addEventListener("mouseup",function(){fire("mouseup");});
  }

  // Open helper (new tab; noopener/noreferrer)
  var isOpen=false;
  function openHref(h){ try{ window.open(h,"_blank","noopener,noreferrer"); }catch(e){ location.href=h; } }

  // Decide: if trusted host, open; else show confirm
  function confirmOrOpen(href){
    var host=hostOf(href);
    if(getAllow().includes(host)) return openHref(href);
    showConfirm(href,host);
  }

  // Build/attach confirm modal (title strip → domain → warning → trust checkbox → actions)
  function showConfirm(href,host){
    if(isOpen) return; isOpen=true;
    var th=sampleTheme(); // re-sample each open to stay in sync with theme

    // Overlay blocks background interaction
    var overlay=document.createElement("div");
    overlay.id="bli_overlay";
    overlay.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:2147483646";

    // Panel (inherits look; explicit bg to match OEM even if class is transparent in theme)
    var panel=document.createElement("div");
    panel.id="bli_panel"; panel.className="windowShadow";
    panel.style.cssText="position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:"+th.width+";padding:0 16px 14px;text-align:center;z-index:2147483647;border-radius:"+th.winRadius+";font-family:"+th.font+";box-shadow:"+th.shadow+";background:"+th.panelBg+";color:"+th.textColor;

    // Header strip (same bg as native title bar)
    var header=document.createElement("div");
    header.id="bli_header";
    header.style.cssText="background:"+th.titleBgColor+";border-radius:"+th.winRadius+" "+th.winRadius+" 0 0;padding:5px 10px;margin:0 -16px 8px -16px";

    // Title text (same color as native header text)
    var headerText=document.createElement("div");
    headerText.id="bli_title"; headerText.textContent="Open external link?";
    headerText.style.cssText="font-size:21px;color:"+th.titleColor;

    // Domain (clear visibility of destination)
    var domain=document.createElement("div");
    domain.id="bli_domain"; domain.textContent=host;
    domain.style.cssText="font-size:13px;opacity:.9;word-break:break-all;margin:2px 0 8px";

    // Warning (social engineering reminders; never asks for secrets)
    var warning=document.createElement("div");
    warning.id="bli_warning";
    warning.innerHTML="Links may lead outside the game. Only continue if you trust the sender. Never enter your passwords, Discord token, or recovery codes.";
    warning.style.cssText="font-size:12px;line-height:1.3;opacity:.85;margin-bottom:8px";

    // Trust checkbox (adds host to local allowlist)
    var trustWrap=document.createElement("label");
    trustWrap.id="bli_trust_wrap"; trustWrap.style.cssText="display:inline-flex;align-items:center;gap:6px;font-size:12px;opacity:.9";
    var trustCb=document.createElement("input"); trustCb.id="bli_trust_checkbox"; trustCb.type="checkbox"; trustCb.style.marginRight="6px";
    var trustLabel=document.createElement("span"); trustLabel.id="bli_trust_label"; trustLabel.textContent="Trust this domain next time";

    // Actions row
    var actions=document.createElement("div");
    actions.id="bli_actions"; actions.style.cssText="display:flex;gap:28px;justify-content:center;margin-top:12px";

    // Buttons (native look + SFX; 2px radius)
    function makeBtn(id,text){
      var b=document.createElement("div"); b.id=id; b.textContent=text; addBtnClasses(b);
      b.style.cssText="min-width:110px;padding:7px 10px;cursor:pointer;user-select:none;text-align:center;border-radius:"+th.btnRadius;
      b.addEventListener("mouseenter",function(){b.style.filter="brightness(1.08)";});
      b.addEventListener("mouseleave",function(){b.style.filter="none";});
      wireSFX(b); return b;
    }
    var btnCancel=makeBtn("bli_cancel","Cancel");
    var btnOpen=makeBtn("bli_open","Open link");

    // Close helpers (Esc=cancel, Enter=confirm)
    function close(){ isOpen=false; overlay.remove(); panel.remove(); window.removeEventListener("keydown",onKey); }
    function onKey(e){ if(e.key==="Escape"){e.preventDefault();close();} if(e.key==="Enter"){e.preventDefault();btnOpen.click();} }

    // Wire button behavior
    btnCancel.addEventListener("click",close);
    btnOpen.addEventListener("click",function(){
      if(trustCb.checked){ var list=getAllow(); list.push(host); setAllow(list); }
      close(); openHref(href);
    });

    // Assemble DOM
    trustWrap.appendChild(trustCb); trustWrap.appendChild(trustLabel);
    actions.appendChild(btnCancel); actions.appendChild(btnOpen);
    header.appendChild(headerText);
    panel.appendChild(header); panel.appendChild(domain); panel.appendChild(warning); panel.appendChild(trustWrap); panel.appendChild(actions);
    document.body.appendChild(overlay); document.body.appendChild(panel);
    window.addEventListener("keydown",onKey);
  }

  // Boot: poll for containers (max ~10s), then stop; minimal overhead
  function boot(){
    var pending=new Set(AREAS.map(function(a){return a.root;})), inited=new Set(), tries=0;
    function tick(){
      for(var i=0;i<AREAS.length;i++){
        var a=AREAS[i]; if(inited.has(a.root)) continue;
        if(initArea(a)){ inited.add(a.root); pending.delete(a.root); }
      }
      if(pending.size&&++tries<=40) return;
      clearInterval(timer);
    }
    var timer=setInterval(tick,250); tick();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot,{once:true}); else boot();
})();