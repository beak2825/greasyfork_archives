// ==UserScript==
// @name         Bluesky Content Manager
// @namespace    https://greasyfork.org/en/users/567951-stuart-saddler
// @version      3.5.2
// @description  A powerful and reliable content filter for Bluesky. Features a keyword blocklist, manual/auto whitelisting, and alt-text enforcement.
// @license      MIT
// @match        https://bsky.app/*
// @icon         https://i.ibb.co/YySpmDk/Bluesky-Content-Manager.png
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @connect      bsky.social
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/518614/Bluesky%20Content%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/518614/Bluesky%20Content%20Manager.meta.js
// ==/UserScript==

(async function () {
'use strict';

/*** DEBUG CONFIG: Set to true to enable console logging for troubleshooting ***/
const DEBUG_MODE = false;
const DEEP_DEBUG = false; // Enables even more verbose logging
function debugLog(...args) { if (DEBUG_MODE) console.log('[BCM-DEBUG]', ...args); }
function debugWarn(...args) { if (DEBUG_MODE) console.warn('[BCM-WARN]', ...args); }
function debugError(...args) { if (DEBUG_MODE) console.error('[BCM-ERROR]', ...args); }
function deepDebug(...args) { if (DEEP_DEBUG) console.log('[BCM-DEEP]', ...args); }

/*** CONFIG & GLOBALS ***/
let filteredTerms, manualWhitelistTerms, autoWhitelistEnabled, whitelistedUsers, altTextEnforcementEnabled;
let blockedCount = 0, menuCommandId = null;
let sessionBlockedPosts = [];
const processedPosts = new WeakMap();
let totalPostsProcessed = 0, totalPostsBlocked = 0;

// Safe initialization with error handling
function initializeSettings() {
  try {
    filteredTerms = (JSON.parse(GM_getValue('filteredTerms','[]'))||[]).map(t=>t.trim().toLowerCase()).filter(Boolean);
    manualWhitelistTerms = (JSON.parse(GM_getValue('manualWhitelistTerms','[]'))||[]).map(t=>t.trim().toLowerCase()).filter(Boolean);
    autoWhitelistEnabled = GM_getValue('autoWhitelistEnabled', false);
    whitelistedUsers = new Set((JSON.parse(GM_getValue('whitelistedUsers','[]'))||[]).map(u=>normalizeUsername(u)));
    altTextEnforcementEnabled = GM_getValue('altTextEnforcementEnabled', false);

    debugLog('🔧 Settings initialized:', {
      filteredTermsCount: filteredTerms.length,
      manualWhitelistTermsCount: manualWhitelistTerms.length,
      autoWhitelistEnabled,
      altTextEnforcementEnabled,
      whitelistedUsersCount: whitelistedUsers.size
    });
  } catch (error) {
    debugError('Failed to initialize settings:', error);
    filteredTerms = []; manualWhitelistTerms = []; autoWhitelistEnabled = false;
    whitelistedUsers = new Set(); altTextEnforcementEnabled = false;
  }
}

/*** CSS ***/
const CSS = `
.content-filtered { display: none !important; height: 0 !important; overflow: hidden !important; }
.bluesky-filter-dialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; z-index: 1000000; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 300px; max-width: 520px; font-family: Arial, sans-serif; color:#333; max-height: 80vh; overflow-y: auto; }
.bluesky-filter-dialog h2 { margin-top: 0; color: #0079d3; font-size: 1.5em; font-weight: bold; }
.bluesky-filter-dialog h3 { margin: 15px 0 5px 0; color: #0079d3; font-size: 1.1em; font-weight: bold; }
.bluesky-filter-dialog .section-label { font-size: 1.1em; font-weight: bold; margin: 0 0 5px 0; color: #0079d3; }
.bluesky-filter-dialog textarea { width: calc(100% - 16px); height: 100px; padding: 8px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; font-family: monospace; background:#f9f9f9; color:#000; }
.bluesky-filter-dialog label { display:block; margin-top:10px; font-size:0.9em; color:#333; }
.bluesky-filter-dialog input[type="checkbox"] { margin-right:6px; }
.bluesky-filter-dialog .row { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
.bluesky-filter-dialog .button-container { display:flex; justify-content:flex-end; gap:10px; margin-top:10px; }
.bluesky-filter-dialog button { padding:8px 16px; border:none; border-radius:4px; cursor:pointer; font-size:1em; }
.bluesky-filter-dialog .save-btn { background-color:#0079d3; color:white; }
.bluesky-filter-dialog .cancel-btn { background-color:#f2f2f2; color:#333; }
.bluesky-filter-overlay { position: fixed; inset:0; background: rgba(0,0,0,0.5); z-index: 999999; }
.blocked-posts-section { margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; }
.blocked-posts-list { max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; background: #f9f9f9; }
.blocked-post-item { padding: 8px 10px; border-bottom: 1px solid #eee; font-size: 0.85em; line-height: 1.3; }
.blocked-post-item:last-child { border-bottom: 0; }
.blocked-post-excerpt { color:#333; margin-bottom:4px; }
.blocked-post-reason { color:#666; font-size:0.8em; font-style:italic; }
.no-blocked-posts { padding: 20px; text-align:center; color:#888; font-style:italic; }
`;
GM_addStyle(CSS);

/*** UTILS ***/
function normalizeUsername(u){
  const normalized = u.toLowerCase().replace(/[\u200B-\u200F\u202A-\u202F]/g,'').trim();
  deepDebug('Normalized username:', u, '->', normalized);
  return normalized;
}
function escapeRegExp(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
function cleanText(t){ return t.normalize('NFKD').replace(/\s+/g,' ').toLowerCase().trim(); }
function termToRegex(term){
  if (!term || typeof term !== 'string' || term.trim() === '') return null;
  try {
    const esc = escapeRegExp(term);
    // This check correctly identifies simple words that benefit from word boundaries.
    const isPlainWord = /^[a-z]+$/i.test(term) && term.length >= 3;

    if (isPlainWord) {
        // For plain words, use word boundaries and common suffixes.
        const suffix = '(?:s|es|ed|ing|er|ers)?';
        return new RegExp(`\\b${esc}${suffix}\\b`, 'i');
    } else {
        // For emojis, phrases, or terms with special characters, don't use word boundaries.
        // This creates a simple, direct substring search.
        return new RegExp(esc, 'i');
    }
  } catch (error) {
    debugError('Failed to create regex for term:', term, error);
    return null;
  }
}
function getPostContainer(node){
  let cur=node;
  while(cur&&cur!==document.body){
    if(cur.matches('[data-testid="post"], div[role="link"], article')) return cur;
    cur=cur.parentElement;
  }
  return null;
}
function shouldRequireAltText(img) {
    const imgSrc = img.src || '';
    if (imgSrc.includes('/avatar') || imgSrc.includes('/banner')) {
        deepDebug('Image skipped (URL pattern) - likely avatar/banner:', imgSrc.substring(0, 70));
        return false;
    }
    if (img.closest('[data-testid="avatar"]') || img.classList.contains('avatar')) {
        deepDebug('Image skipped (DOM marker) - avatar:', imgSrc.substring(0, 70));
        return false;
    }
    const w = img.naturalWidth || img.width || 0;
    const h = img.naturalHeight || img.height || 0;
    if (w > 0 && h > 0 && (w <= 48 || h <= 48)) {
        deepDebug('Image skipped - too small:', `${w}x${h}`, imgSrc.substring(0, 70));
        return false;
    }
    if (img.getAttribute('aria-hidden') === 'true' || (img.getAttribute('role') || '').toLowerCase() === 'presentation') {
        deepDebug('Image skipped - decorative/presentation:', imgSrc.substring(0, 70));
        return false;
    }
    debugLog('Image REQUIRES alt-text:', `${w}x${h}`, imgSrc.substring(0, 70));
    return true;
}
function shouldProcessPage(){
  const p=window.location.pathname;
  const should = p !== '/notifications';
  deepDebug('Should process page?', p, '->', should);
  return should;
}

/*** WHITELIST BY CONTENT ***/
function isWhitelistedByContent(post){
  if (manualWhitelistTerms.length === 0) return false;
  const allText = post.textContent || "";
  const postText = post.querySelector('div[data-testid="postText"]')?.textContent || "";
  const altTexts = Array.from(post.querySelectorAll('img')).map(img => img.alt || img.getAttribute('aria-label') || "").join(" ");
  const ariaTitles = Array.from(post.querySelectorAll('[aria-label],[title]')).map(el => `${el.getAttribute('aria-label')||''} ${el.getAttribute('title')||''}`).join(' ');
  const combined = `${allText} ${postText} ${altTexts} ${ariaTitles}`;
  const cleaned = cleanText(combined);

  for (const term of manualWhitelistTerms) {
    const re = termToRegex(term);
    if (re && (re.test(combined) || re.test(cleaned))) {
      debugLog('✅ Post whitelisted by content term:', term);
      return true;
    }
  }
  return false;
}

/*** BLOCKED-POSTS LEDGER ***/
function addBlockedPost(post, reason, keyword){
  const excerpt = extractPostExcerpt(post);
  const author = extractAuthorHandle(post);
  const timestamp = new Date().toLocaleTimeString();
  const postId = `${author}:${excerpt.substring(0,50)}:${reason}:${keyword}`;
  if (!sessionBlockedPosts.some(b => b.postId === postId)) {
    sessionBlockedPosts.unshift({ postId, excerpt, author, reason, keyword, timestamp });
    // The 50-post limit has been removed to allow for a complete session log.
  }
  totalPostsBlocked++;
}
function extractPostExcerpt(post){
  const postText = post.querySelector('div[data-testid="postText"]');
  if (postText && postText.textContent.trim()) {
    const t=postText.textContent.trim(); return t.length>100? t.slice(0,100)+'...' : t;
  }
  const all=(post.textContent||'').replace(/\s+/g,' ').trim();
  return all? (all.length>100? all.slice(0,100)+'...' : all) : '[No text content]';
}
function extractAuthorHandle(post){
  const a = post.querySelector('a[href^="/profile/"]');
  if (!a) return '[Unknown author]';
  const seg = a.href.split('/profile/')[1]?.split(/[/?#]/)[0];
  return seg ? `@${seg}` : '[Unknown author]';
}

/*** MENU UI ***/
async function refreshSettings(){
  try {
    filteredTerms = (JSON.parse(await GM_getValue('filteredTerms','[]'))||[]).map(t=>t.trim().toLowerCase()).filter(Boolean);
    manualWhitelistTerms = (JSON.parse(await GM_getValue('manualWhitelistTerms','[]'))||[]).map(t=>t.trim().toLowerCase()).filter(Boolean);
    altTextEnforcementEnabled = await GM_getValue('altTextEnforcementEnabled', false);
    autoWhitelistEnabled = await GM_getValue('autoWhitelistEnabled', false);
  } catch (error) { debugError('Failed to refresh settings:', error); }
}
function updateMenuCommand(){
  if (menuCommandId) GM_unregisterMenuCommand(menuCommandId);
  menuCommandId = GM_registerMenuCommand(`Configure Filters (${totalPostsBlocked} blocked)`, showConfigUI);
}
async function showConfigUI(){ await refreshSettings(); createConfigUI(); }
function createConfigUI(){
  const overlay=document.createElement('div'); overlay.className='bluesky-filter-overlay';
  const dialog=document.createElement('div'); dialog.className='bluesky-filter-dialog';
  const blockedHTML = sessionBlockedPosts.length ? sessionBlockedPosts.map(p=>`<div class="blocked-post-item"><div class="blocked-post-excerpt">"${p.excerpt}" - ${p.author}</div><div class="blocked-post-reason">Blocked by "${p.keyword}" (${p.reason}) at ${p.timestamp}</div></div>`).join('') : '<div class="no-blocked-posts">No posts blocked this session</div>';
  dialog.innerHTML = `<h2>Bluesky Content Manager</h2><div class="section-label">Blocklist Keywords</div><textarea spellcheck="false" id="blocklist-textarea">${filteredTerms.join('\n')}</textarea><div class="row"><label><input type="checkbox" id="alt-text-checkbox" ${altTextEnforcementEnabled?'checked':''}> Enforce Alt-Text</label><label><input type="checkbox" id="auto-whitelist-checkbox" ${autoWhitelistEnabled?'checked':''}> Auto-Whitelist Followed Accounts</label></div><div class="section-label" style="margin-top:10px;">Manual Whitelist Override</div><div style="font-size:0.85em;color:#666;margin-top:-6px;">@usernames or keywords that override blocking (e.g., @alice.bsky.social or important)</div><textarea spellcheck="false" id="whitelist-textarea">${manualWhitelistTerms.join('\n')}</textarea><div class="blocked-posts-section"><h3>Blocked Posts This Session (${sessionBlockedPosts.length})</h3><div class="blocked-posts-list">${blockedHTML}</div></div><div class="button-container"><button class="cancel-btn">Cancel</button><button class="save-btn">Save</button></div>`;
  document.body.appendChild(overlay); document.body.appendChild(dialog);
  const close=()=>{ dialog.remove(); overlay.remove(); };
  dialog.querySelector('.cancel-btn').addEventListener('click', close);
  overlay.addEventListener('click', close);
  dialog.querySelector('.save-btn').addEventListener('click', async ()=>{
    const terms = dialog.querySelector('#blocklist-textarea').value.split('\n').map(l=>l.trim().toLowerCase()).filter(Boolean);
    const whitelist = dialog.querySelector('#whitelist-textarea').value.split('\n').map(l=>l.trim().toLowerCase()).filter(Boolean);
    await GM_setValue('filteredTerms', JSON.stringify(terms)); await GM_setValue('manualWhitelistTerms', JSON.stringify(whitelist)); await GM_setValue('altTextEnforcementEnabled', dialog.querySelector('#alt-text-checkbox').checked); await GM_setValue('autoWhitelistEnabled', dialog.querySelector('#auto-whitelist-checkbox').checked);
    blockedCount=0; updateMenuCommand(); close(); location.reload();
  });
}

/*** AUTH & FOLLOWS ***/
let sessionToken=null, currentUserDid=null;
async function waitForAuth(){
  debugLog('Waiting for auth...');
  return new Promise((res,rej)=>{
    let tries=0, max=30;
    (function check(){
      tries++;
      const s=localStorage.getItem('BSKY_STORAGE');
      if(s){
        try{
          const p=JSON.parse(s);
          if(p.session?.accounts?.[0]?.accessJwt){
            sessionToken=p.session.accounts[0].accessJwt; currentUserDid=p.session.accounts[0].did;
            debugLog('Auth successful:', currentUserDid);
            return res();
          }
        }catch(e){ debugError('Auth parse error:', e); }
      }
      if(tries>=max) { debugWarn('Auth timeout'); return rej('Auth timeout'); }
      setTimeout(check,1000);
    })();
  });
}
async function fetchAllFollows(cursor=null, acc=[]){
  let url=`https://bsky.social/xrpc/app.bsky.graph.getFollows?actor=${encodeURIComponent(currentUserDid)}`;
  if(cursor) url+=`&cursor=${cursor}`;
  debugLog('Fetching follows:', url);
  return new Promise((res,rej)=>{
    GM_xmlhttpRequest({
      method:'GET', url, headers:{ 'Authorization':`Bearer ${sessionToken}`, 'Accept':'application/json' },
      onload(resp){
        if(resp.status===200){
          try{
            const d=JSON.parse(resp.responseText); const all=acc.concat(d.follows||[]);
            if(d.cursor) return fetchAllFollows(d.cursor, all).then(res).catch(rej);
            return res(all);
          }catch(e){ return rej(e); }
        }
        rej(`HTTP ${resp.status}`);
      },
      onerror:e=>{ rej(e); }
    });
  });
}
async function autoWhitelistFollowedAccounts(){
  if(!sessionToken||!currentUserDid) return;
  try{
    const f = await fetchAllFollows();
    f.forEach(u=>{
      let handle = (u.subject?.handle)||u.handle; let did = (u.subject?.did)||u.did;
      if(handle){ if(!handle.startsWith('@')) handle='@'+handle; whitelistedUsers.add(normalizeUsername(handle)); }
      if(did){ whitelistedUsers.add(normalizeUsername('@'+did)); }
    });
    debugLog('Auto-whitelisted', f.length, 'followed accounts');
  }catch(e){ debugError('Auto-whitelist error:', e); }
}

/*** CORE FILTER ***/
function regexMatchAny(text, terms){
  if (!text || !terms || terms.length === 0) return null;
  const cleaned = cleanText(text);
  for(const term of terms){
    try {
      const re = termToRegex(term);
      if (re && (re.test(text) || re.test(cleaned))) {
        debugLog('🎯 MATCH FOUND:', term, 'in text:', text.substring(0, 50) + '...');
        return term;
      }
    } catch(e) { continue; }
  }
  return null;
}
async function processPost(post){
  totalPostsProcessed++;
  if(!shouldProcessPage()) return;
  const container=getPostContainer(post);
  if(!container) return;

  const postTextNode = container.querySelector('div[data-testid="postText"]');
  const postText = postTextNode ? postTextNode.textContent : '';
  const author = extractAuthorHandle(container);
  const sig = [postText, author].join('||');
  if (processedPosts.get(container) === sig) return;
  processedPosts.set(container, sig);

  if(isWhitelisted(container) || isWhitelistedByContent(container)) {
    debugLog('✅ Post whitelisted by user or content');
    return;
  }

  const imgsAll = Array.from(container.querySelectorAll('img'));

  if (altTextEnforcementEnabled) {
    const imagesNeedingAlt = imgsAll.filter(shouldRequireAltText);
    if (imagesNeedingAlt.length > 0) {
      const missingAlt = imagesNeedingAlt.some(img => !(img.alt || '').trim());
      if (missingAlt) {
        debugLog('🚫 BLOCKING POST - Alt-text enforcement');
        addBlockedPost(container, "Alt-text enforcement", "missing alt-text");
        container.classList.add('content-filtered'); blockedCount++; updateMenuCommand(); return;
      }
    }
  }

  const checkAndBlock = (text, reason, terms) => {
    if (!text) return false;
    const matched = regexMatchAny(text, terms);
    if(matched){
      debugLog(`🚫 BLOCKING POST - ${reason} match:`, matched);
      addBlockedPost(container, reason, matched); container.classList.add('content-filtered'); blockedCount++; updateMenuCommand(); return true;
    }
    return false;
  };

  for(const img of imgsAll){
    const txt = ((img.alt ?? img.getAttribute('aria-label')) ?? '').trim();
    if(checkAndBlock(txt, "Alt-text keyword", filteredTerms)) return;
  }
  const authorLink=container.querySelector('a[href^="/profile/"]');
  if(authorLink) if(checkAndBlock(authorLink.querySelector('span')?.textContent||authorLink.textContent||"", "Author name", filteredTerms)) return;
  if(checkAndBlock(postText, "Post text", filteredTerms)) return;
  const ariaTitles = Array.from(container.querySelectorAll('[aria-label],[title]')).map(el => `${el.getAttribute('aria-label')||''} ${el.getAttribute('title')||''}`).join(' ');
  if(checkAndBlock(ariaTitles, "ARIA/TITLE attribute", filteredTerms)) return;
  if(checkAndBlock(container.textContent||"", "General content", filteredTerms)) return;

  debugLog('✅ POST PASSED ALL FILTERS');
}
function isWhitelisted(post){
  const link=post.querySelector('a[href^="/profile/"]');
  if(!link) return false;
  const id=link.href.split('/profile/')[1]?.split(/[/?#]/)[0];
  return whitelistedUsers.has(normalizeUsername('@'+id));
}

/*** OBSERVE + ROUTE WATCH ***/
function observePosts(){
  debugLog('👀 Starting post observation...');
  const processNode = (node) => {
    if (node.nodeType !== 1) return;
    const container = getPostContainer(node);
    if (container) setTimeout(() => processPost(container), 150);
  };
  const observer=new MutationObserver(muts=>{
    if(!shouldProcessPage()) return;
    for (const m of muts) {
      for (const node of m.addedNodes) processNode(node);
      if (m.type === 'attributes') processNode(m.target);
    }
  });
  observer.observe(document.body,{ childList:true, subtree:true, attributes:true, attributeFilter:['alt','aria-label','src']});
}

/*** INIT ***/
async function main() {
    debugLog('🚀 Bluesky Content Manager starting...');
    initializeSettings();
    document.querySelectorAll('[data-testid="post"], article').forEach(el=>processPost(el));
    updateMenuCommand();
    observePosts();

    try{
        await waitForAuth();
        if(autoWhitelistEnabled) await autoWhitelistFollowedAccounts();
        debugLog('✅ Initialization complete with auth');
    }catch(e){
        debugWarn('Auth failed, continuing without auto-whitelist:', e);
        debugLog('✅ Initialization complete without auth');
    }

    debugLog('🎯 Script fully loaded.');
}

main();

})();
