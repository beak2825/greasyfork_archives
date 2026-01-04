// ==UserScript==
// @name         No Google Doodle
// @namespace    https://github.com/Procyon-b
// @version      0.7.6
// @description  Get rid of Google Doodle logos and link
// @author       Achernar
// @include      https://www.google.tld/
// @include      https://www.google.tld/?*
// @include      https://www.google.tld/webhp*
// @include      https://www.google.tld/search?*
// @include      /^https:\/\/www\.google\.co\.[^.]+\/$/
// @include      /^https:\/\/www\.google\.co\.[^.]+\/\?.*/
// @include      /^https:\/\/www\.google\.co\.[^.]+\/webhp.*/
// @include      /^https:\/\/www\.google\.co\.[^.]+\/search\?.*/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425053/No%20Google%20Doodle.user.js
// @updateURL https://update.greasyfork.org/scripts/425053/No%20Google%20Doodle.meta.js
// ==/UserScript==

(function() {
"use strict";

function addSt(s) {
  if (!s) return;
  var r=document.documentElement || document.head;
  if (!r) {
    setTimeout(function(){addSt(s)},0);
    return;
    }
  st=document.createElement('style');
  r.appendChild(st);
  st.textContent=s;
  }

var st, logo, outer=false, fixed=false, style='#replacedDoodle ~ div, #replacedDoodle ~ canvas {display:none;}';

if (location.pathname.startsWith('/search')) addSt('.sfbg > *,.doodle>:not(.doodleFixed), header#kO001e a > img[src*="/logos/doodles/"], form[role="search"] img[src*="/logos/doodles/"] {display: none;} .logo.doodleFixed img{height:30px;width:92px;} .logo.doodlefixedParent {left:0; top:0; margin:0; padding:0; display: inline; position: unset;}');
addSt('#hplogo > *:not(#replacedDoodle), a img#hplogo {display: none;}'+style);

if (document.readyState != 'loading') fix();
else {
  document.addEventListener('DOMContentLoaded', function(){
    obs.disconnect();
    fix();
    });

  const obs = new MutationObserver(function(muts){
    for (let mut of muts) {
      for (let n of mut.addedNodes) {
        if (n.classList && n.classList.contains('o3j99')) {
          if (n.querySelector('#hplogo')) {
            this.disconnect();
            fix();
            return;
            }
          }
        }
      }
    });
  obs.observe(document, { attributes: false, childList: true, subtree: true});
  }

function fix() {
  if (location.pathname.startsWith('/search')) {
    logo=document.querySelector('.logo.doodle');
    if (logo) ; 
    else if (logo=document.querySelector('header#kO001e a > img[src*="/logos/doodles/"], form[role="search"] a > img[src*="/logos/doodles/"]')) logo=logo.parentNode;
    else if (logo=document.querySelector('.doodle > a')) ;
    else return;
    if (logo.parentNode.classList.contains('logo') ) logo.parentNode.classList.add('doodlefixedParent');
    logo.outerHTML='<div class="logo doodleFixed"><a href="/" id="logo"><img src="/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png"></a></div>';
    return;
    }

  if ( (document.title!='Google') || fixed ) return;
  fixed=true;
  logo=document.querySelector('div#hplogo');
  if (!logo) {
    if (logo = document.querySelector(':scope a img#hplogo')) {
      logo=logo.closest('a');
      outer=true;
      }
    else if (logo = document.querySelector('img#hplogo')) {
      logo=logo.closest('picture') || logo.parentNode;
      outer=true;
      }
    }
  if (logo) {
    let h='<img id="replacedDoodle" style="bottom:0;position:absolute;left:50%;transform:translate(-50%);" src="/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"><style>'+style+'</style>';
    if (outer) logo.outerHTML=h;
    else logo.innerHTML=h;
    setTimeout(function(){
      var a=document.querySelectorAll('#replacedDoodle ~ :not(style)');
      a.forEach(function(e){ e.remove(); });
      }, 300);
    }
  else {
    st.remove();
    }
  }

})();