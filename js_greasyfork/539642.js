// ==UserScript==
// @name         ebay - Mark sponsored item
// @namespace    https://github.com/Procyon-b
// @version      0.4.1
// @description  In search result listing, detect which items are sponsored and mark them with a red outline and opacity
// @author       Achernar
// @match        https://www.ebay.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539642/ebay%20-%20Mark%20sponsored%20item.user.js
// @updateURL https://update.greasyfork.org/scripts/539642/ebay%20-%20Mark%20sponsored%20item.meta.js
// ==/UserScript==

(function() {
"use strict";

//console.info('us()');
var obs;

function init() {
  var cfg={childList:true, subtree:true};
  obs=new MutationObserver(function(mutL){
    //console.info({mutL});
    for(let mut of mutL) {
      if (mut.target && (mut.target.id == 'srp-river-main') ) {
        //console.info('fixing');
        fix(mut.target);
        return;
        }
      }
    });
  try {
    obs.observe(document, cfg);
    document.addEventListener('load', function(){fix();} );
    window.addEventListener('load', function(){fix();} );
    }
  catch(e) { setTimeout(init, 0); }
  }

function isIn(e) {
  var p=e.closest('li');
  var re = e.getBoundingClientRect();
  var rp = p.getBoundingClientRect();

  //console.info(   re.top >= rp.top , re.left >= rp.left , re.bottom <= rp.bottom , re.right <= rp.right );

  return (re.top >= rp.top) && (re.left >= rp.left) && (re.bottom <= rp.bottom) && (re.right <= rp.right);
}

var s;

function fix(r=document) {
  let i,e;
  e=r.querySelector('#srp-river-results > ul > li[id][data-view$=":1"] .su-card-container .su-card-container__footer .s-card__footer--row div[aria-labelledby^="s-"][role="heading"][class]');
  if (e) {
    let s='.su-card-container:has(.su-card-container__footer .s-card__footer--row div[aria-labelledby^="s-"][role="heading"].'+e.className+') {outline: 4px solid red; opacity: .4;}';
    let st=document.createElement('style');
    document.documentElement.appendChild(st);
    st.textContent=s;
    obs.disconnect();
    return;
    }

  e=r.querySelector('#srp-river-results > ul > li[id][data-view$=":1"] .su-card-container .su-card-container__footer .s-card__footer--row b[style^="background-image:"]');
  if (e) {
    let b=e.attributes.style.value.slice(-30).replace(/"/g,'\\"');
    let s='.su-card-container:has(.su-card-container__footer .s-card__footer--row b[style^="background-image:"][style$="'+b+'"]) {outline: 4px solid red; opacity: .4;}';
    let st=document.createElement('style');
    document.documentElement.appendChild(st);
    st.textContent=s;
    obs.disconnect();
    return;
    }


  //ul.srp-results li .s-item__details-section--primary > .s-item__detail--primary:last-child .s-item__sep > [role="text"]
  e=r.querySelector('ul.srp-results li.s-item [aria-labelledby]');
  if (e && (i=e.style.backgroundImage)) {
    i=i.substr(-30);
    r.querySelectorAll(`ul.srp-results li.s-item:has( .s-item__detail .s-item__sep div[style^="background-image:"][style*='${i}'])`).forEach( function(x){
      x.style='outline: 2px solid red; opacity: .4;';
      });
    e=!e;
    }
  if (e) {
console.info({e});
    r.querySelectorAll('ul.srp-results li.s-item:has([aria-labelledby="'+e.attributes['aria-labelledby'].value+'"]').forEach( function(x){
      x.style='outline: 2px solid red; opacity: .4;';
      });
    }

  r.querySelectorAll('ul.srp-results li .s-item__details-section--primary > .s-item__detail--primary:last-child [role="text"] :only-child').forEach( function(x){
    var cs, cs1, R=isIn(x);
    //console.info(R);
    //if (!s) s=x.style.backgroundImage;
    cs=getComputedStyle(x);
    cs1=getComputedStyle(x.parentNode);
    console.info(cs.color, cs.filter, cs1.filter);
    R=( ((cs.filter == 'none') != (cs1.filter == 'none')) && cs.color == 'white')
     || ( ((cs.filter == 'none') != (cs1.filter == 'none')) && cs.color == 'rgb(255, 255, 255)')

     || ( ((cs.filter == 'none') == (cs1.filter == 'none')) && cs.color == 'black')
     || ( ((cs.filter == 'none') == (cs1.filter == 'none')) && cs.color == 'rgb(0, 0, 0)');

    if (R) {
      x.closest('li').style='outline: 2px solid red; opacity: .4;';
      }
    });
  }


init();

})();