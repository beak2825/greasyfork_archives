// ==UserScript==
// @name         IMDb - Set default user reviews sorting
// @namespace    https://github.com/Procyon-b
// @version      0.5
// @description  Select which sorting option should be used by default when click on a link "User reviews"
// @author       Achernar
// @include      /^https:\/\/www\.imdb\.com\/title\/[^\/]+\/(reference\/?)?(\?.*)?$/
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/433573/IMDb%20-%20Set%20default%20user%20reviews%20sorting.user.js
// @updateURL https://update.greasyfork.org/scripts/433573/IMDb%20-%20Set%20default%20user%20reviews%20sorting.meta.js
// ==/UserScript==

(function() {
"use strict";

var L, sort, c={ 'helpfulnessScore':'Helpfulness', 'submissionDate':'Review date', 'totalVotes':'Total votes', 'reviewVolume':'Prolific reviewer', 'userRating':'Review rating'};

function fix() {
  L=document.querySelectorAll('a[href*="/title/"][href*="/reviews"], a[href^="reviews"]');
  sort=GM_getValue('sort','helpfulnessScore');

  L.forEach(function(e){
    let H=e.href.split('?');
    if (!H[0].endsWith('reviews') && !H[0].endsWith('reviews/')) return;
    let s=H[1] || '';
    let r=[];
    s.split('&').forEach(function(e){
      var p=e.split('=');
      if (p[0]) r[p.shift().trim()]=p.join('=');
      });
    if (sort=='unset') delete r.sort;
    else r.sort=sort;
    let r2=[];
    for (let k in r) { r2.push(k+'='+r[k]); }

    H[1]=r2.join('&');
    if (H[1]=='') H.pop();
    e.href=H.join('?');
    });

  }

fix();


var dialog=document.createElement('div'); 
dialog.id='fix_def_sort';
dialog.innerHTML=`<style>
#fix_def_sort {
  position: absolute;
  color: black;
  background-color:white;
  top: 4em;
  z-index: 100 !important;
  font-size: 13px;
  font-family: arial;
  padding: 3px 8px;
  border: 2px solid gray;
  min-width: 23em;
  text-align: left;
}
#fix_def_sort, #fix_def_sort * {
  white-space: nowrap;
}
#fix_def_sort #close {
  float: right;
  color: red;
  cursor: pointer;
  z-index: 10;
}
.reviewSortSettings {
  position: relative !important;
}
</style><b>Select default user reviews sorting</b> &nbsp; <div id="close">&#10062;</div><br>
<select><option value="unset">[ unset ]</option></select>
`;

dialog.querySelector('#close').onclick=function(){
  dialog.parentNode.classList.toggle('reviewSortSettings',false);
  dialog.remove();
  };

var E, sel=dialog.querySelector('select');
if (sel) {
  for (let k in c) {
    sel.innerHTML+='<option value="'+k+'"'+(k==sort?' selected':'')+'>'+c[k]+'</option>';
    }
  sel.onchange=function(){
    GM_setValue('sort',this.value);
    fix();
    }
  }

if (L.length) 
  for (let i=0; E=L[i]; i++) {
    E.addEventListener('click', function(ev){
      if (ev.ctrlKey && ev.altKey) {
        this.parentNode.appendChild(dialog);
        this.parentNode.classList.toggle('reviewSortSettings',true);
        ev.preventDefault();
        ev.stopPropagation();
        }
      }, {capture:true});
    }


})();