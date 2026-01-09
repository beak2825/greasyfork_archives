// ==UserScript==
// @name         Block Youtube Users
// @namespace    https://codeberg.org/schegge
// @description  Hide videos of blacklisted users/channels and comments
// @version      2.6.2.5
// @author       Schegge
// @compatible   firefox
// @match        https://www.youtube.com/*
// @exclude      *://*.youtube.com/embed/*
// @exclude      *://*.youtube.com/live_chat*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.notification
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/11057/Block%20Youtube%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/11057/Block%20Youtube%20Users.meta.js
// ==/UserScript==

// fix trusted-types
if (typeof window != "undefined" && ('trustedTypes' in window) && ('createPolicy' in window.trustedTypes) &&
   (typeof window.trustedTypes.createPolicy == "function") && !window.trustedTypes.defaultPolicy) {
   window.trustedTypes.createPolicy('default', {createScriptURL: s => s, createScript: s => s, createHTML: s => s});
}

(async function() {

   /* VALUES */

   const Values = {
      storageVer: '1',
      storageSep: ',',
      storageTimer: 1000,
      storageComment: '',
      storageVideo: '',
      storageAdd: '',
      storageHideShorts: '',
      storageVideoOwner: '',
      storageBlacklist: [],
      storageWhitelist: [],
      menuOpen: false,
      menuPause: false
   };

   // get saved values
   Values.storageVer = await GM.getValue('byuver', '1');
   Values.storageSep = await GM.getValue('sep', ',');
   Values.storageTimer = await GM.getValue('timer', 1000);
   Values.storageComment = await GM.getValue('hidecomments', '');
   Values.storageVideo = await GM.getValue('enablepause', '');
   Values.storageAdd = await GM.getValue('enableadd', '');
   Values.storageHideShorts = await GM.getValue('hideshorts', '');
   Values.storageVideoOwner = await GM.getValue('videoowner', '');
   Values.storageBlacklist = getArray(await GM.getValue('savedblocks', ''));
   Values.storageWhitelist = getArray(await GM.getValue('savedwhites', ''));

   // get array from string
   function getArray(string) {
      if (!string) return [];
      return string.split(Values.storageSep).map(v => v.trim()).filter(v => v.length);
   }

   const Where = {
      renderer: `ytd-rich-item-renderer,
         ytd-video-renderer,
         ytd-channel-renderer,
         ytd-playlist-renderer,
         ytd-playlist-video-renderer,
         ytd-playlist-panel-video-renderer,
         ytd-movie-renderer,
         ytd-compact-video-renderer,
         ytd-compact-movie-renderer,
         ytd-compact-radio-renderer,
         ytd-compact-autoplay-renderer,
         ytd-compact-playlist-renderer,
         ytd-grid-video-renderer,
         ytd-grid-playlist-renderer,
         ytd-watch-next-secondary-results-renderer yt-lockup-view-model
         ${Values.storageVideoOwner ? ', ytd-video-owner-renderer' : ''}
         ${Values.storageComment ? ', ytd-comment-view-model.ytd-comment-replies-renderer, ytd-comment-view-model.ytd-comment-thread-renderer' : ''}`,

      // home, related and page playlist: #metadata > :not([hidden]) #text.ytd-channel-name
      //    ^ not hidden because of search video
      // search video: #channel-info #text.ytd-channel-name
      // search channel: #channel-title.ytd-channel-renderer span.ytd-channel-renderer, #info #text.ytd-channel-name, #metadata #subscribers.ytd-channel-renderer
      // videos playlist: #byline.ytd-playlist-panel-video-renderer
      // user video: #owner #upload-info #channel-name #text.ytd-channel-name
      // comment: #author-text span.ytd-comment-view-model, #name #text.ytd-channel-name
      // > view-model selectors
      // home: yt-content-metadata-view-model a
      // playlists: .yt-content-metadata-view-model-wiz__metadata-row a[href^="/@"], .yt-content-metadata-view-model-wiz__metadata-row a[href^="/channel/"]
      // side recs: yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-row:first-of-type, .yt-content-metadata-view-model-wiz__metadata-text:first-of-type, 
      user: `#metadata > :not([hidden]) #text.ytd-channel-name,
         #channel-info #text.ytd-channel-name,
         #channel-title.ytd-channel-renderer span.ytd-channel-renderer,
         #info #text.ytd-channel-name,
         #metadata #subscribers.ytd-channel-renderer,
         #byline.ytd-playlist-panel-video-renderer,
         yt-content-metadata-view-model a[href^="/@"],
         yt-content-metadata-view-model a[href^="/channel/"],
         yt-content-metadata-view-model .yt-content-metadata-view-model__metadata-row:first-of-type span,
         .yt-content-metadata-view-model-wiz__metadata-row a[href^="/@"],
         .yt-content-metadata-view-model-wiz__metadata-row a[href^="/channel/"],
         .yt-content-metadata-view-model-wiz__metadata-text:first-of-type
         ${Values.storageVideoOwner ? ', #owner #upload-info #channel-name #text.ytd-channel-name' : ''}
         ${Values.storageComment ? ', [id*="author"] yt-formatted-string#text[title], #author-text span.ytd-comment-view-model, #name #text.ytd-channel-name' : ''}`,

      // if the above aren't found
      userFailSafe: 'a[href^="/@"], a[href^="/channel/"], .ytd-channel-name a',

      videoPage: {
         parentId: 'owner',
         channel: '#owner #upload-info #channel-name #text.ytd-channel-name',
         video: '#player video.video-stream.html5-main-video'
      },

      masthead: {
         parent: '#container.ytd-masthead',
         buttonsId: 'buttons'
      }
   };

   /* INTERVAL FOR BLACKLISTING */

   search();
   setInterval(search, Values.storageTimer);

   if (Values.storageHideShorts) hideShortsCSS();

   /* CSS */

   document.head.insertAdjacentHTML('beforeend', `<style>
      [data-block="yes"] { display: none!important; }
      .byu-add { float: left; margin-right: .4em; cursor: pointer; color: var(--yt-brand-youtube-red, red); background-color: var(--yt-spec-additive-background); border-radius: 100%; font-size: 1em; width: 1.4em; height: 1.4em; line-height: 1.4em; text-align: center; font-weight: lighter; }
      #byu-icon { display: inline-block; position: relative; text-align: center; width: 40px; height: 24px; margin: 0 8px; font-weight: 400; color: var(--yt-spec-text-primary); }
      #byu-icon span { color: var(--yt-spec-icon-active-other); cursor: pointer; font-size: 20px; vertical-align: middle; }
      #byu-options { width: 400px; max-width: 80vw; display: flex; flex-flow: row wrap; align-items: baseline; position: fixed; right: 1em; padding: 1em; text-align: center; font-size: 1.2em;  color: var(--yt-spec-text-primary); background-color: var(--yt-spec-menu-background); z-index: 99999; border-radius: 1em; box-shadow: 0 .3em 2em 0 var(--yt-spec-static-overlay-background-light); }
      #byu-options div { width: 33%; flex-grow: 1; box-sizing: border-box; padding: .6em; }
      #byu-save { font-weight: bold; cursor: pointer; color: var(--yt-brand-youtube-red, red); }
      #byu-pause { cursor: pointer; }
      #byu-options .byu-textarea { width: 100%; }
      #byu-options .byu-textarea span { width: 100%; text-align: center; font-weight: bold; }
      #byu-options .byu-textarea textarea { line-height: 1.2em; resize: vertical; width: 100%; padding: .4em; color: var(--yt-spec-text-primary); background-color: var(--yt-spec-additive-background); box-sizing: border-box; border: 0; border-radius: 1em; }
      #byu-options .byu-textarea textarea#byu-blacklist { height: 8em; }
      #byu-options .byu-textarea textarea#byu-whitelist { height: 4em; }
      #byu-options input { color: var(--yt-spec-text-primary); background-color: var(--yt-spec-additive-background); border: 0; padding: 0 2px; height: 1.6em; line-height: 1em; vertical-align: middle; box-sizing: border-box; margin: 0; border-radius: .5em; }
      #byu-sep { width: 1em; }
      #byu-timer { width: 4.5em; }
      #byu-video-page-black { font-size: 1.2em; padding: var(--yt-button-padding); background: var(--yt-brand-youtube-red, red); color: #fff; border-radius: 2em; margin-right: .8em; font-weight: bold; }
   </style>`);

   /* VIDEO FIRST PAGE */

   if (Values.storageVideo && /\/watch/.test(window.location.href)) {
      let waitUserVideo = setInterval(() => {
         if (document.querySelector(Where.videoPage.channel)) {
            clearInterval(waitUserVideo);

            let username = document.querySelector(Where.videoPage.channel).textContent.trim();
            if (ifMatch(username.toLowerCase())) {
               let video = document.querySelector(Where.videoPage.video);
               video.pause();
               video.currentTime = 0;

               let divBlack = document.createElement('div');
               divBlack.id = 'byu-video-page-black';
               divBlack.title = username;
               divBlack.textContent = 'BLACKLISTED';
               document.getElementById(Where.videoPage.parentId).insertAdjacentElement('afterbegin', divBlack);
            }
         }
      }, 1000);
   }

   /* BLACKLIST MENU */

   document.body.insertAdjacentHTML('beforeend', `<div id="byu-options" style="display: none;">
      <div><span id="byu-save">SAVE</span></div>
      <div><span id="byu-pause">pause</span></div>
      <div class="byu-textarea"><span>blacklist</span>
         <textarea spellcheck="false" id="byu-blacklist">${Values.storageBlacklist.join(`${Values.storageSep} `)}</textarea></div>
      <div class="byu-textarea"><span>whitelist</span>
         <textarea spellcheck="false" id="byu-whitelist">${Values.storageWhitelist.join(`${Values.storageSep} `)}</textarea></div>
      <div title="separator between usernames">
         <input id="byu-sep" type="text" maxlength="1" value="${Values.storageSep}"> separator</div>
      <div title="interval between new checks in ms">
         <input id="byu-timer" type="number" min="500" max="5000" step="500" title="milliseconds" value="${Values.storageTimer}"> timer</div>
      <div title="always show x buttons">
         <input id="byu-enableadd" type="checkbox" value="clickadd" ${Values.storageAdd ? 'checked' : ''}> show buttons</div>
      <div title="target also video owner on view page">
         <input id="byu-videoowner" type="checkbox" value="videoowner" ${Values.storageVideoOwner ? 'checked' : ''}> video owner</div>
      <div title="from direct link if user is blacklisted">
         <input id="byu-enablepause" type="checkbox" value="pausevideo" ${Values.storageVideo ? 'checked' : ''}> pause video</div>
      <div title="hide comments from specific users">
         <input id="byu-hidecomments" type="checkbox" value="comments" ${Values.storageComment ? 'checked' : ''}> comments</div>
      <div title="hide all shorts">
         <input id="byu-hideshorts" type="checkbox" value="hideshorts" ${Values.storageHideShorts ? 'checked' : ''}> hide all shorts</div>
   </div>`);

   // for the B wait till the masthead buttons are added
   const buttonB = document.createElement('div');
   buttonB.id = 'byu-icon';
   buttonB.innerHTML = '<span>B</span>';

   let waitButton = setInterval(() => {
      if (document.getElementById(Where.masthead.buttonsId)) {
         clearInterval(waitButton);
         document.getElementById(Where.masthead.buttonsId).insertAdjacentElement('beforebegin', buttonB);
         document.head.insertAdjacentHTML('beforeend', `<style>#byu-options { top:${
            document.querySelector(Where.masthead.parent).offsetHeight
         }px; }</style>`);
      }
   }, 1000);

   // open / close menu
   buttonB.addEventListener('click', openMenu);
   document.addEventListener('keydown', function(e) {
      if (e.ctrlKey && e.altKey && e.key == 'b') {
         openMenu();
      }
   });

   function openMenu() {
      let byuOpts = document.getElementById('byu-options');
      byuOpts.style = byuOpts.style.display === 'none' ? '' : 'display: none;';
      buttonB.style.fontWeight = buttonB.style.fontWeight === '500' ? '' : '500';

      Values.menuOpen = !Values.menuOpen;
      if (Values.storageAdd) return;

      if (Values.menuOpen) {
         search();
      } else {
         document.querySelectorAll('.byu-add').forEach(el => el.parentElement.removeChild(el));
      }
   }

   // save changes
   document.getElementById('byu-save').addEventListener('click', function() {
      if (/[*"]|^$/.test(document.getElementById('byu-sep').value)) {
         this.text('ERROR! separator');
      } else {
         Values.storageSep = document.getElementById('byu-sep').value;
         Values.storageTimer = Math.max(parseInt(document.getElementById('byu-timer').value, 10), 500) || 1000;
         Values.storageComment = document.getElementById('byu-hidecomments').checked ? 'yes' : '';
         Values.storageVideo = document.getElementById('byu-enablepause').checked ? 'yes' : '';
         Values.storageAdd = document.getElementById('byu-enableadd').checked ? 'yes' : '';
         Values.storageHideShorts = document.getElementById('byu-hideshorts').checked ? 'yes' : '';
         Values.storageVideoOwner = document.getElementById('byu-videoowner').checked ? 'yes' : '';
         Values.storageBlacklist = getArray(document.getElementById('byu-blacklist').value.trim());
         Values.storageWhitelist = getArray(document.getElementById('byu-whitelist').value.trim());
         GM.setValue('sep', Values.storageSep);
         GM.setValue('timer', Values.storageTimer);
         GM.setValue('hidecomments', Values.storageComment);
         GM.setValue('enablepause', Values.storageVideo);
         GM.setValue('enableadd', Values.storageAdd);
         GM.setValue('hideshorts', Values.storageHideShorts);
         GM.setValue('videoowner', Values.storageVideoOwner);
         GM.setValue('savedblocks', Values.storageBlacklist.join(`${Values.storageSep} `));
         GM.setValue('savedwhites', Values.storageWhitelist.join(`${Values.storageSep} `));
         this.textContent = 'SAVED';
         search(true);
         hideShortsCSS();
      }
      setTimeout(() => this.textContent = 'SAVE', 2000);
   });

   // pause
   document.getElementById('byu-pause').addEventListener('click', function() {
      Values.menuPause = !Values.menuPause;
      if (Values.menuPause) {
         document.querySelectorAll('[data-block="yes"]').forEach(el => el.dataset.block = '');
         this.textContent = 'paused';
      } else {
         search(true);
         this.textContent = 'pause';
      }
      hideShortsCSS();
   });

   /* BLACKLISTING FUNCTIONS */

   // global search
   function search(blacklistChanged = false) {
      for (let el of document.querySelectorAll(Where.renderer)) {
         // check if blacklisted
         findMatch(el, blacklistChanged);
      }
   }

   // check if blacklisted, get username, add "x" buttons
   function findMatch(el, blacklistChanged) {
      let addButton = true;

      // retrieve current username
      let userEl = el.querySelector(Where.user);
      let username = userEl?.textContent?.trim();
      if (!username) {
         // to try to not make the script completely break if yt changes
         // search with broader classes but don't add "x" buttons
         username = el.querySelector(Where.userFailSafe)?.textContent?.trim();
         if (!username) return;
         addButton = false;
      }
      username = username.toLowerCase();

      // add "x" when menu is open or always add selected
      if (addButton &&
         (Values.menuOpen || Values.storageAdd) &&
         !el.querySelector('.byu-add')) {

         let addBtn = document.createElement('div');
         addBtn.className = 'byu-add';
         addBtn.textContent = 'x';
         addBtn.addEventListener('click', addToBlacklist);
         addBtn.addEventListener('contextmenu', addToBlacklist);
         userEl.insertAdjacentElement('beforebegin', addBtn);
      }

      // if blacklist is paused, stop
      if (Values.menuPause) return;

      // if blacklist or content are changed
      if (blacklistChanged || el.dataset.username !== username) {
         el.dataset.username = username;

         // hide if match
         if (ifMatch(username)) {
            el.dataset.block = 'yes';
         // show if it was hidden with another username or deleted username from blacklist
         } else if (el.dataset.block) {
            el.dataset.block = '';
         }
      }
   }

   // check if it needs to be blacklisted
   function ifMatch(u) {
      return (
         !Values.storageWhitelist.some(w => u === w.toLowerCase()) &&
         Values.storageBlacklist.some(b => {
            b = b.toLowerCase();
            if (b.startsWith('*')) {
               b = b.replace('*', '');
               return b && u.includes(b);
            } else {
               return u === b;
            }
         })
      );
   }

   // add usernames to blacklist
   function addToBlacklist(e) {
      e.preventDefault();
      e.stopPropagation();

      let username = this.nextElementSibling.textContent.trim().toLowerCase();

      if (!Values.storageBlacklist.includes(username)) {
         Values.storageBlacklist.push(username);
         let blacks = Values.storageBlacklist.join(`${Values.storageSep} `);
         document.getElementById('byu-blacklist').value = blacks;
         GM.setValue('savedblocks', blacks);
         search(true);
      }
   }

   // css to hide shorts
   function hideShortsCSS() {
      let css = Values.storageHideShorts && !Values.menuPause ? `ytd-reel-shelf-renderer,
         ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]),
         a[title="Shorts"],
         ytd-rich-item-renderer:has(a[href^="/shorts/"]),
         ytd-compact-video-renderer:has(a[href^="/shorts/"]), 
         ytd-video-renderer:has(a.yt-simple-endpoint[href*="shorts"]),
         grid-shelf-view-model:has(ytm-shorts-lockup-view-model) {
            display: none !important;
         }` : '';

      if (!document.getElementById('byu-hideshorts-css')) {
         document.head.insertAdjacentHTML('beforeend', `<style id="byu-hideshorts-css">${css}</style>`);
      } else {
         document.getElementById('byu-hideshorts-css').textContent = css;
      }
   }

   /* NEW VERSION NOTIFICATION */

   if (Values.storageVer !== '2.6.2.5') {
      Values.storageVer = '2.6.2.5';
      GM.setValue('byuver', Values.storageVer);

      /*GM.notification({
         text: '\nFor more details, see the script description on Greasy Fork.',
         title: 'BLOCK YOUTUBE USERS [2.6.2]'
      });*/
   }

})();
