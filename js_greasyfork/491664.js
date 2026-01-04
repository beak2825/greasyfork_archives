// ==UserScript==
// @name         Gaia Online Friends & Ignore List Search
// @namespace    https://greasyfork.org/en/users/1265537-kloob
// @version      0.5
// @description  Search all pages of your Gaia friends or ignore list & flash the matching username in the list itself.
// @author       You
// @match        https://www.gaiaonline.com/profiles/*/*/?mode=friends*
// @match        https://www.gaiaonline.com/profiles/*/*/?mode=ignored*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/491664/Gaia%20Online%20Friends%20%20Ignore%20List%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/491664/Gaia%20Online%20Friends%20%20Ignore%20List%20Search.meta.js
// ==/UserScript==

(function(){
  'use strict';

  // ===  CONFIG & MODE  ===
  const params = new URLSearchParams(window.location.search);
  const mode   = params.get('mode');             // "friends" or "ignored"
  if (mode !== 'friends' && mode !== 'ignored') return;

  const PLACEHOLDER = mode === 'friends'
                    ? 'Search Friends...'
                    : 'Search Ignored Users...';

  // ===  SEARCH BOX  ===
  function addSearchBox(){
    if (document.getElementById('userSearchContainer')) return;

    const c = document.createElement('div');
    c.id = 'userSearchContainer';
    Object.assign(c.style, {
      backgroundColor: 'black',
      color:           'white',
      padding:         '5px',
      zIndex:          9999,
      position:        'relative'
    });

    const input = document.createElement('input');
    input.id          = 'userSearch';
    input.type        = 'text';
    input.placeholder = PLACEHOLDER;
    Object.assign(input.style, {
      backgroundColor: 'black',
      color:           'white',
      border:          'none'
    });

    c.appendChild(input);
    const hdr = document.getElementById('header_left');
    if (!hdr) return;
    hdr.parentNode.insertBefore(c, hdr);

    input.addEventListener('keypress', e => {
      if (e.key === 'Enter' && input.value.trim()) {
        searchUsers(input.value.trim());
      }
    });
  }

  // ===  COLLECT ALL PAGINATION LINKS  ===
  function getAllPageLinks(){
    const base  = window.location.href.split('?')[0];
    const first = `${base}?mode=${mode}`;
    const s     = new Set([first]);
    document.querySelectorAll('.pagination a[href]')
            .forEach(a => s.add(a.href));
    return Array.from(s).sort((a,b)=>{
      const sa = parseInt(new URL(a).searchParams.get('start'))||0;
      const sb = parseInt(new URL(b).searchParams.get('start'))||0;
      return sa - sb;
    });
  }

  // ===  AJAX FETCH  ===
  function fetchPage(url){
    return new Promise((res, rej)=>{
      GM_xmlhttpRequest({
        method: 'GET', url,
        onload(resp){
          resp.status >= 200 && resp.status < 300
            ? res(resp.responseText)
            : rej(resp.statusText);
        },
        onerror(err){ rej(err) }
      });
    });
  }

  // ===  MAIN SEARCH  ===
  async function searchUsers(term){
    const input    = document.getElementById('userSearch');
    const original = input.placeholder;
    let dots       = 0;
    const anim     = setInterval(()=>{
      input.placeholder = `Searching ${mode} list${'.'.repeat(dots)}`;
      dots = (dots+1)%4;
    }, 500);

    input.value = '';
    try {
      for (const url of getAllPageLinks()) {
        await new Promise(r=>setTimeout(r,800));
        const html = await fetchPage(url);
        const doc  = new DOMParser()
                       .parseFromString(html,'text/html');
        for (const a of doc.querySelectorAll('ul>li>span>a')) {
          const name = a.textContent.trim();
          if (name.toLowerCase().includes(term.toLowerCase())) {
            clearInterval(anim);
            // redirect to the page where they live, with a highlight param
            window.location.href = url
              + `&highlight=${encodeURIComponent(name)}`;
            return;
          }
        }
      }
      // no match: show inline message
      clearInterval(anim);
      showNoMatch(term);
    } catch(err) {
      console.error(err);
      clearInterval(anim);
      showNoMatch(term);
    } finally {
      clearInterval(anim);
      input.placeholder = original;
      input.value       = term;
    }
  }

  // ===  NO-MATCH FEEDBACK  ===
  function showNoMatch(term){
    const old = document.getElementById('searchResult');
    if (old) old.remove();
    const d = document.createElement('div');
    d.id = 'searchResult';
    d.textContent = `No match for “${term}.”`;
    Object.assign(d.style, {
      marginTop: '10px', color: 'white'
    });
    document.getElementById('userSearchContainer')
            .appendChild(d);
  }

  // ===  HIGHLIGHT ON PAGE LOAD  ===
  function highlightFromParam(){
    const name = new URLSearchParams(window.location.search)
                   .get('highlight');
    if (!name) return;

    for (const a of document.querySelectorAll('ul>li>span>a')) {
      if (a.textContent.trim().toLowerCase() === name.toLowerCase()) {
        // scroll into view
        a.scrollIntoView({behavior:'smooth', block:'center'});
        // flash it 6 times
        let f = 0;
        const iv = setInterval(()=>{
          a.style.backgroundColor =
            (f%2===0 ? 'limegreen' : '');
          f++;
          if (f>5) {
            clearInterval(iv);
            a.style.backgroundColor = '';
          }
        }, 400);
        break;
      }
    }
  }

  // ===  BOOTSTRAP  ===
  new MutationObserver((_, obs)=>{
    if (document.getElementById('gaia_header')
     && !document.getElementById('userSearch')
    ) {
      obs.disconnect();
      addSearchBox();
      highlightFromParam();
    }
  }).observe(document.body, {childList:true, subtree:true});

})();
