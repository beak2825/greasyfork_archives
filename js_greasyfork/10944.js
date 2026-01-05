// ==UserScript==
// @name         AO3: Fic's Style, Blacklist, Bookmarks
// @namespace    https://codeberg.org/schegge
// @description  Change the font, size, width and background of a work + blacklist: hide works that contain certain tags or text, have too many tags/fandoms/relationships/chapters/words and other options + fullscreen reading mode + bookmarks: save the position where you stopped reading a fic + number of words for each chapter and estimated reading time
// @version      3.6.7.3
// @author       Schegge
// @match        *://*.archiveofourown.org/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.notification
// @grant        GM.setClipboard
// @grant        GM.registerMenuCommand
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/10944/AO3%3A%20Fic%27s%20Style%2C%20Blacklist%2C%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/10944/AO3%3A%20Fic%27s%20Style%2C%20Blacklist%2C%20Bookmarks.meta.js
// ==/UserScript==

(async function() {
   const SN = 'stblbm';

   // check which page
   const Check = {
      // script version
      version: async function() {
         if (await getStorage('version', 1) !== 3673) {
            setStorage('version', 3673);
            return true;
         }
         return false;
      },
      // on search pages but not on personal user profile
      black: function() {
         let user = document.querySelector('#greeting .user a[href*="/users/"]') || false;
         user = user && window.location.pathname.includes(user.href.split('/users/')[1]);
         return document.querySelector('li.blurb.group:not(.collection):not(.tagset):not(.skins)') && !user;
      },
      // include /works/(numbers) and /works/(numbers)/chapters/(numbers)
      // and exclude /works/(whatever)navigate
      work: function() {
         return /\/works\/\d+(\/chapters\/\d+)?(?!.*navigate)/.test(window.location.pathname);
      },
      // Full Screen
      fullScreen: false
   };


   /** FEATURES **/
   const Feature = {
      style: true,
      book: true,
      black: true,
      wpm: 250,
      font: ''
   };
   Object.assign(Feature, await getStorage('feature', '{}'));


   // Menus
   addCSS(`${SN}-menus`, `/* Menu */
      ::backdrop { background-color: #000; opacity: .6; }
      #${SN}-settings { width: min(600px, 90vw); border: 0; border-radius: 1em; font-size: .9rem;
         background-color: #ddd; color: #111; box-shadow: inset 0 0 5px #999; }
      #${SN}-settings > ul > li { border-top: 1px solid #888; padding: .8em; margin: 0; }
      #${SN}-save-result { font-size: .8em; float: right; }

      li[id|="${SN}"] a,
      #${SN}-storage-open { cursor: pointer; }
      li[id|="${SN}"] .dropdown-menu li a.${SN}-save {
         color: #900 !important; font-weight: bold; text-align: center;
         padding-bottom: 0.75em !important; }
      [id|="${SN}"] input[type="number"],
      [id|="${SN}"] input[type="text"] {
         width: 3.5em; padding: 0 0 0 .2em; margin: 0; }
      [id|="${SN}"] input[type="checkbox"] { margin: 0; }
      [id|="${SN}"] textarea {
         font-size: .9em; line-height: 1.3em; min-height: 4em; padding: .3em;
         margin: .1em .5em; width: calc(100% - 1em); box-sizing: border-box; resize: vertical; }
      li[id|="${SN}"] .${SN}-opts {
         display: flex !important; flex-wrap: nowrap; align-items: center; }

      #${SN}-storage { display: none; font-size: .8em; padding-top: 1em; }
      #${SN}-storage #${SN}-import-storage { height: 8em; }
      #${SN}-storage #${SN}-import-result { text-wrap: auto; height: auto; }

      a.${SN}-book-delete { color: #900 !important; }
      #${SN}-book .${SN}-opts a:first-child { flex-grow: 1; font-size: .9em; }
      div[class*="${SN}-book"] a { margin: 1em .2em 0 0; font-size: .8rem; cursor: pointer; }
      .${SN}-book-left {
         position: fixed; left: 0; bottom: 0; margin: 0 0 1rem 1rem; z-index: 999; }
      .${SN}-book-top { text-align: right;}
      .${SN}-no-book { display: none !important; }

      #${SN}-black .dropdown-menu { min-width: min(28em, 100vw); }
      #${SN}-black .dropdown-menu .${SN}-opts { text-align: center !important; }
      #${SN}-black .dropdown-menu .${SN}-opts > a,
      #${SN}-black .dropdown-menu .${SN}-optsFull > a {
         height: auto; font-size: .8em !important; text-transform: uppercase;
         padding: .3em 0 !important; margin: 0 !important; cursor: default; }
      #${SN}-black .dropdown-menu .${SN}-opts > a { width: 25%; flex: auto; }
      #${SN}-black .dropdown-menu input[type="text"] { width: 12em; }
      #${SN}-black-tags { height: 6em; }

      #${SN}-style {
         position: fixed !important; bottom: 0; right: 0; margin: 0 1rem 1rem 0;
         padding: 0; text-align: right; font-size: .8rem; z-index: 999 !important;
         font-family: 'Lucida Grande', 'Lucida Sans Unicode', Verdana, Helvetica, sans-serif, 'GNU Unifont'; }
      #${SN}-style:not(.${SN}-style-hide) { width: min(28em, calc(100% - 2em)); }
      #${SN}-style:not(.${SN}-style-hide) > ul {
         display: block !important; padding: .5em; margin: 0; border-radius: .3em;
         background-color: #ddd; color: #111; box-shadow: inset 0 0 5px #999; }
      #${SN}-style.${SN}-style-hide > ul { display: none; }
      #${SN}-style li { padding: .4em 0 .2em; margin: 0; border-bottom: 1px solid #888; }
      #${SN}-style input, #${SN}-style select { width: 60%; vertical-align: middle; }
      #${SN}-style button { margin-top: .3em; }
      #${SN}-style-button { padding: .25em .75em; }

      .${SN}-words {
         font-size: .7em; color: inherit; font-family: consolas, monospace;
         text-transform: uppercase; text-align: center; margin: 3em 0 .5em; }`
   );

   const Import = {
      storage: {
         feature: {},
         styling: {},
         bookmarks: [],
         blacklistOpts: {},
         blacklistTags: [],
         blacklistText: [],
         blacklistAuthors: []
      },
      getAllStorage: async function() {
         for (const [key, value] of Object.entries(this.storage)) {
            this.storage[key] = await getStorage(key, JSON.stringify(value));
         }
      },
      importStorage: function(string) {
         if (/^([\s\d]+|[\{\[]+\s*[\}\]]+)$/m.test(string)){
            return 'Import failed: Invalid format.';
         }

         let tempStorage;
         try {
            tempStorage = JSON.parse(string);
         } catch (error) {
            return 'Import failed: ' + error;
         }

         Object.assign(this.storage, tempStorage);
         for (const [key, value] of Object.entries(this.storage)) {
            setStorage(key, value);
         }
         return '';
      }
   };

   const Settings = document.createElement('dialog');
   Settings.id = `${SN}-settings`;
   Settings.innerHTML = `<h3>AO3: Styling, Blacklist, Bookmarks</h3>
      <ul>
         <li><input id="${SN}-settings-style" type="checkbox" ${
            Feature.style ? 'checked' : ''}> Styling</li>
         <li><span title="separate fonts by commas">Custom Fonts</span>
               <textarea id="${SN}-settings-font" spellcheck="false">${
               Feature.font}</textarea></li>
         <li><input id="${SN}-settings-book" type="checkbox" ${
            Feature.book ? 'checked' : ''}> Bookmarks / Full Screen</li>
         <li><input id="${SN}-settings-black" type="checkbox" ${
            Feature.black ? 'checked' : ''}> Blacklist</li>
         <li><input id="${SN}-settings-wpm" type="number" min="0" max="1000" step="10" value="${
            Feature.wpm}"> Words per minute</li>
         <li><span id="${SN}-storage-open">Export / Import Storage</span>
            <ul id="${SN}-storage"><li>Export
                  <textarea id="${SN}-export-storage" disabled></textarea>
                  <button id="${SN}-export-save">save export</button></li>
               <li>Import
                  <textarea id="${SN}-import-storage" spellcheck="false"></textarea></li>
            </ul></li>
         <li><button autofocus id="${SN}-settings-save">Save</button> <button id="${SN}-settings-close">Close</button> <span id="${SN}-save-result"></span></li>
      </ul>`;
   document.body.appendChild(Settings);

   GM.registerMenuCommand('Settings', () => { Settings.showModal(); });
   document.getElementById(`${SN}-settings-close`).addEventListener("click", () => { Settings.close(); });

   document.getElementById(`${SN}-settings-save`).addEventListener('click', function() {
      Feature.style = document.getElementById(`${SN}-settings-style`).checked;
      Feature.font = document.getElementById(`${SN}-settings-font`).value.trim();
      Feature.book = document.getElementById(`${SN}-settings-book`).checked;
      Feature.black = document.getElementById(`${SN}-settings-black`).checked;
      let wpm = document.getElementById(`${SN}-settings-wpm`).value.trim();
      Feature.wpm = wpm ? Math.min(Math.max(parseInt(wpm), 0), 1000) : 0;
      setStorage('feature', Feature);

      let importStorage = document.getElementById(`${SN}-import-storage`).value.trim();
      let result = importStorage ? Import.importStorage(importStorage) : '';

      if (result) {
         document.getElementById(`${SN}-save-result`).textContent = 'Saved with errors: ' + result;
      } else {
         document.getElementById(`${SN}-save-result`).textContent = 'Saved';
         window.location.reload();
      }
   });

   document.getElementById(`${SN}-storage-open`).addEventListener('click', async function(e) {
      await Import.getAllStorage();
      document.getElementById(`${SN}-export-storage`).innerHTML = JSON.stringify(Import.storage);
      this.nextElementSibling.style.display = 'block';
   });

   document.getElementById(`${SN}-export-save`).addEventListener('click', () => {
      GM.setClipboard(JSON.stringify(Import.storage), "text");
      document.getElementById(`${SN}-save-result`).textContent = 'Export copied to the clipboard. Paste it into a file';
   });


   // add estimated reading time for every fic found
   if (Feature.wpm) {
      for (let work of document.querySelectorAll('dl.stats dd.words')) {
         let numWords = work.textContent.replace(/,/g, '');
         work.insertAdjacentHTML('afterend', `<dt>Time:</dt><dd>${countTime(numWords)}</dd>`);
      }
   }


   /** BOOKMARKS **/
   if (Feature.book) {
      const Bookmarks = {
         list: [],
         getValues: async function() {
            this.list = await getStorage('bookmarks', '[]');
         },
         setValues: function() {
            setStorage('bookmarks', this.list);
         },
         fromBook: window.location.search === '?bookmark',
         getUrl: window.location.pathname.split('/works/')[1],
         getTitle: function() {
            let title = document.querySelector('#workskin .preface.group h2.title.heading')
               .textContent.trim().substring(0, 28);
            // get the number of the chapter if chapter by chapter
            if (this.getUrl.includes('/chapters/')) {
               title += ` (${
                  document.querySelector('#chapters > .chapter > .chapter.preface.group > h3 > a')
                     .textContent.replace('Chapter ', 'ch')
               })`;
            }
            return title;
         },
         getPosition: function() {
            let position = getScroll();
            // calculate % if chapter by chapter view or work completed (number/number is the same)
            if (window.location.pathname.includes('/chapters/') ||
                /(\d+)\/\1/.test(document.querySelector('dl.stats dd.chapters').textContent)) {
               position = (position / getDocHeight()).toFixed(4) + '%';
            }
            return position;
         },
         checkIfExist: function(what, link) {
            let url = link || this.getUrl;
            let found = false;
            for (let [index, bookmark] of this.list.entries()) {
               // check if the same fic already exists
               if (bookmark[0].split('/chapters/')[0] !== url.split('/chapters/')[0]) {
                  continue;
               }

               // i need the index to delete the old bookmark (for change or delete)
               if (what === 'cancel') {
                  found = index;
                  break;
               // check if the same chapter
               } else if (bookmark[0] === url) {
                  // retrieve the bookmark position
                  if (what === 'book') {
                     found = bookmark[2];
                     // if the bookmark is in %
                     if (found.toString().includes('%')) {
                        found = parseFloat(found.replace('%', '')) * getDocHeight();
                     }
                  } else {
                     // just check if a bookmark exist
                     found = true;
                  }
                  break;
               }
            }
            return found;
         },
         cancel: function(url) {
            let found = this.checkIfExist('cancel', url);
            // !== false because it can return 0 for the index
            if (found !== false) this.list.splice(found, 1);
         },
         getNew: function() {
            this.cancel();
            this.list.push([this.getUrl, this.getTitle(), this.getPosition()]);
            this.setValues();
         },
         html: function() {
            let bookMenu = document.createElement('li');
            bookMenu.id = `${SN}-book`;
            bookMenu.className = 'dropdown';
            bookMenu.setAttribute('aria-haspopup', 'true');
            bookMenu.innerHTML = '<a class="dropdown-toggle" data-toggle="dropdown" data-target="#">Bookmarks</a>';
            let bookMenuDrop = document.createElement('ul');
            bookMenuDrop.className = 'menu dropdown-menu';
            bookMenu.appendChild(bookMenuDrop);
            document.querySelector('#header ul.primary.navigation.actions').appendChild(bookMenu);

            if (this.list.length) {
               let self = this;
               let clickDelete = function() {
                  self.cancel(this.getAttribute('data-url'));
                  self.setValues();
                  this.style.display = 'none';
                  this.previousSibling.style.opacity = '.4';
               };

               for (let item of this.list) {
                  let bookMenuLi = document.createElement('li');
                  bookMenuLi.className = `${SN}-opts`;
                  bookMenuLi.innerHTML = `<a href="https://archiveofourown.org/works/${
                     item[0]}?bookmark">${item[1]}</a>`;
                  let bookMenuDelete = document.createElement('a');
                  bookMenuDelete.className = `${SN}-book-delete`;
                  bookMenuDelete.title = 'delete bookmark';
                  bookMenuDelete.setAttribute('data-url', item[0]);
                  bookMenuDelete.textContent = 'x';
                  bookMenuDelete.addEventListener('click', clickDelete);
                  bookMenuLi.appendChild(bookMenuDelete);
                  bookMenuDrop.appendChild(bookMenuLi);
               }
            } else {
               bookMenuDrop.innerHTML = '<li><a>No bookmark yet.</a></li>';
            }
         }
      };
      await Bookmarks.getValues();
      Bookmarks.html();

      // Fullscreen
      if (Check.work()) {
         let workskin = document.getElementById('workskin');

         let ficTop = document.createElement('div');
         ficTop.className = `actions ${SN}-book-top`;
         let toFullScreen = document.createElement('a');
         toFullScreen.textContent = 'Full Screen';
         ficTop.appendChild(toFullScreen);
         workskin.insertAdjacentElement('afterbegin', ficTop);

         // changes to create full screen
         let fullScreen = () => {
            if (Check.fullScreen) {
               window.location.replace(window.location.pathname);
               return;
            }

            setScroll(0);
            Check.fullScreen = true;
            window.history.replaceState(null, '', '?bookmark');

            addCSS(`${SN}-fullscreen`, `/* Fullscreen */
               #outer > :not(#inner):not([class*=${SN}]):not([id*=${SN}]),
               #inner > :not(#main),
               #main > :not(#workskin):not(div.work),
               div.work > :not(#workskin) { display: none !important; }
               #main { margin: 0 !important; padding: 0 !important; }
               #workskin .preface { margin: 0; padding-bottom: 0; }
               .preface.group .module { padding-bottom: 0; text-align: center; }
               .preface.group .module h3.heading {
                  display: inline; cursor: pointer; text-align: center; opacity: .5;
                  font-style: italic; font-size: 100%; }
               .preface h3 + p {
                  border: 3px solid rgba(0, 0, 0, .1); border-left: 0; border-right: 0;
                  padding: .6em; margin: 0; }
               .preface.group .module .userstuff { background-color: #fff; }
               .preface.group .module > :not(h3),
               .preface.group .notes.module.hidden,
               .actions:not(div[class*="${SN}-book"]) li > a:not([href*="chapters"]):not([href="#workskin"]) {
                  display: none; }
               .preface.group .module > h3:hover ~ .userstuff,
               .preface.group .module > .userstuff:hover,
               .afterword.preface.group .module > h3:hover + ul,
               .afterword.preface.group .module > ul:hover {
                  display: block !important; position: absolute; width: 100%;
                  max-height: 6em; transform: translateY(-100%);
                  color: inherit; background-color: inherit; padding: 0.5em;
                  text-align: left; margin: 0; overflow: auto; z-index: 999; cursor: pointer; }
               .actions:not(div[class*="${SN}-book"]) { margin: 2em 0 1em; float: initial !important; }`
            );
            // div.work for chapter by chapter
            // .preface.group .module .userstuff { background-color: #fff; } -> in case Styling is disabled
            // to hide notes whith no author's words
            workskin.querySelectorAll(".preface.group .notes.module").forEach(note => {
               if (!note.querySelector('.userstuff')) note.classList.add('hidden');
            });

            toFullScreen.textContent = 'Exit';

            let goToBook = document.createElement('a');
            goToBook.textContent = 'Go to Bookmark';
            goToBook.addEventListener('click', () => {
               setScroll(Bookmarks.checkIfExist('book'));
            });

            let ficLeft = document.createElement('div');
            ficLeft.className = `actions ${SN}-book-left`;

            let deleteBook = document.createElement('a');
            deleteBook.title = 'delete bookmark';
            deleteBook.textContent = 'x';
            deleteBook.addEventListener('click', () => {
               Bookmarks.cancel();
               Bookmarks.setValues();
               goToBook.className = `${SN}-no-book`;
               deleteBook.className = `${SN}-no-book`;
            });

            let newBook = document.createElement('a');
            newBook.title = 'new bookmark';
            newBook.textContent = '+';
            newBook.addEventListener('click', function() {
               Bookmarks.getNew();
               goToBook.className = '';
               deleteBook.className = '';
               this.textContent = 'saved';
               setTimeout(() => { this.textContent = '+'; }, 1000);
            });

            if (!Bookmarks.checkIfExist()) {
               goToBook.className = `${SN}-no-book`;
               deleteBook.className = `${SN}-no-book`;
            }

            ficTop.insertAdjacentElement('afterbegin', goToBook);
            ficLeft.appendChild(deleteBook);
            ficLeft.appendChild(newBook);
            document.querySelector('#outer').appendChild(ficLeft);

            // change the url for prevoious and next chapter and top
            let bottomNav = document.querySelector('#feedback .actions');
            bottomNav.querySelectorAll('li > a').forEach(a => {
               if (/chapter/i.test(a.textContent)) {
                  a.href = a.href.replace('#workskin', '?bookmark');
               }
            });
            bottomNav.querySelector('a[href="#main"]').href = '#workskin';

            workskin.appendChild(bottomNav);
         };

         if (Bookmarks.fromBook) fullScreen();
         toFullScreen.addEventListener('click', fullScreen);
      } // END Check.work()
   } // END Feature.book


   /** FIC'S STYLE + WPM **/
   if (Check.work()) {
      if (Feature.style) {
         addCSS(`${SN}-generalstyle`, `/* General Styling */
            #main div.wrapper { margin-bottom: 1em; }
            #workskin { margin: 0; max-width: none !important; }
            #workskin .notes, #workskin .summary,
            blockquote { font-size: inherit; font-family: inherit; }
            .preface a, #chapters a, .preface a:link, #chapters a:link,
            .preface a:visited, #chapters a:visited, .preface a:visited:hover,
            #chapters a:visited:hover, div.preface .byline a, #workskin #chapters a,
            #chapters a:link, #chapters a:visited { color: inherit !important; }
            #workskin .actions { font-size: .8rem;
               font-family: 'Lucida Grande', 'Lucida Sans Unicode', Verdana, Helvetica, sans-serif; }
            .chapter .preface { border-top: 0; margin-bottom: 0; margin-top: 0; }
            .chapter .preface[role="complementary"] { border-width: 0; margin: 0; }
            .preface.group, div.preface {
               color: inherit; background-color: inherit; margin-left: 0; margin-right: 0;
               padding: 0 2em; font-size: .8em; }
            .preface.group .module { min-height: 0; }
            #workskin #chapters .preface .userstuff p,
            #workskin .preface .userstuff p,
            .userstuff details { margin: .1em auto; line-height: 1.1em; }
            div.preface .jump { margin-top: 1em; font-size: .9em; }
            .preface blockquote { padding: .6em; margin: 0; border-inline-width: 1px;
               border-inline-start-color: rgba(255, 255, 255, .2); }
            .afterword.preface .module h3.heading + ul { padding: .01em .6em; }
            .preface blockquote.userstuff,
            .afterword.preface .module h3.heading + ul {               
               box-shadow: 0 0 2px rgba(0, 0, 0, .8), inset 0 0 2px rgba(255, 255, 255, .5); }
            .preface h3.title {
               background: repeating-linear-gradient(46deg, rgba(0, 0, 0, .05),
                  rgba(0, 0, 0, .15) .49em, rgba(255, 255, 255, .2) .5em, rgba(255, 255, 255, .2) .51em);
               box-shadow: 0 0 2px rgba(0, 0, 0, .8), inset 0 0 2px rgba(255, 255, 255, .5);
               padding: .6em; margin: 0; }
            .preface h3.heading, .userstuff h3 { font-size: inherit; border-width: 0; }
            h3.title a { border: 0; font-style: italic; }
            div.preface .associations,
            .preface .notes h3+p { margin-bottom: 0; font-style: italic; font-size: .8em; }
            #workskin #chapters,
            #workskin #chapters .userstuff { width: 100% !important; box-sizing: border-box; }
            #workskin #chapters .userstuff,
            #workskin #chapters .userstuff p { font-family: inherit; }
            #workskin #chapters .userstuff br { display: block; margin-top: .6em; content: " "; }
            .userstuff hr {
               width: 100%; height: 1px; border: 0; margin: 1.5em 0;
               background-image: linear-gradient(90deg, transparent, rgba(0, 0, 0, .2), transparent),
                  linear-gradient(90deg, transparent, rgba(255, 255, 255, .3), transparent); }
            #workskin #chapters .userstuff blockquote {
               padding-top: 1px; padding-bottom: 1px; margin: 0 .5em; font-size: inherit; }
            .userstuff img { max-width: 100%; height: auto; display: block; margin: auto; }`
         );

         // CSS changes depending on the user
         const Styling = {
            opts: {
               fontName: 'Default',
               colors: 'light',
               textAlign: 'justify',
               fontSize: '100',
               margins: '7',
               lineSpacing: '5'
            },
            fonts: {
               'Default': 'inherit',
               'Arial Black': 'Arial Black, Arial Bold, Gadget, sans-serif',
               'Helvetica': 'Helvetica, Helvetica Neue, sans-serif',
               'Verdana': 'Verdana, Tahoma, sans-serif',
               'Segoe UI': 'Segoe UI, Trebuchet MS, sans-serif',
               'Garamond': 'Garamond, Book Antiqua, Palatino, Baskerville, serif',
               'Georgia': 'Georgia, serif',
               'Times New Roman': 'Times New Roman, Times, serif',
               'Consolas': 'Consolas, Lucida Console, monospace',
               'Courier': 'Courier, Courier New, monospace'
            },
            colors: {
               // background, font color
               light: ['#ffffff', '#000000'],
               grey: ['#e6e6e6', '#111111'],
               sepia: ['#fbf0d9', '#54331b'],
               dark: ['#333333', '#e1e1e1'],
               darkblue: ['#282a36', '#f8f8e6'],
               black: ['#000000', '#ffffff']
            },
            inputs: function() {
               return {
                  fontName: {label: 'Font', options: Object.keys(this.fonts), default: 'Default'},
                  colors: {label: 'Background', options: Object.keys(this.colors), default: 'light'},
                  textAlign: {label: 'Alignment', options: ['default', 'justify', 'left', 'center', 'right'], default: 'justify'},
                  fontSize: {label: 'Text Size', range: [80, 300], default: 100},
                  margins: {label: 'Page Margins', range: [5, 40], default: 7},
                  lineSpacing: {label: 'Line Spacing', range: [3, 14], default: 5}
               };
            },
            getValues: async function() {
               Object.assign(this.opts, await getStorage('styling', '{}'));

               if (Feature.font) {
                  // add custom font to list of fonts
                  let customFonts = Feature.font.split(',').map(f => f.trim()).filter(f => f.length);
                  for (let font of customFonts) this.fonts[font] = font;
               } else if (!this.fonts[this.opts.fontName]) {
                  // if the saved font was a deleted custom font, fall back to default
                  this.opts.fontName = 'Default';
               }
            },
            setValues: function() {
               setStorage('styling', this.opts);

               addCSS(`${SN}-userstyle`, `/* User Styling */
                  #workskin {
                     font-family: ${this.fonts[this.opts.fontName]};
                     font-size: ${parseFloat((this.opts.fontSize/100).toFixed(2))}rem;
                     padding: 0 ${this.opts.margins}%;
                     color: ${this.colors[this.opts.colors][1]};
                     background-color: ${this.colors[this.opts.colors][0]};
                     ${this.opts.textAlign === 'default' ? '' : `text-align: ${this.opts.textAlign};`}
                  }
                  #workskin #chapters .userstuff,
                  #workskin #chapters .userstuff p {
                     line-height: ${parseFloat((this.opts.lineSpacing * 0.4).toFixed(2))}rem;
                     ${this.opts.textAlign === 'default' ? '' : `text-align: ${this.opts.textAlign};`}
                  }
                  #workskin #chapters .userstuff p {
                     margin: ${parseFloat((this.opts.lineSpacing * 0.5 - 1.4).toFixed(2))}rem auto;
                  }
                  #workskin .preface.group .heading {
                     color: ${this.colors[this.opts.colors][1]} !important;
                  }
                  .preface.group .module {
                     color: ${this.colors[this.opts.colors][1]};
                     background-color: ${this.colors[this.opts.colors][0]} !important;
                  }`
               );
            },
            html: function() {
               this.setValues();

               let inputs = this.inputs();

               // the options displayed on the page
               let styleMenu = document.createElement('div');
               styleMenu.id = `${SN}-style`;
               styleMenu.className = `${SN}-style-hide`;

               let h = '';
               for (const [name, input] of Object.entries(inputs)) {
                  h += `<li><label>${input.label}</label>`;
                  if ('options' in input) {
                     h += `<select id="${name}">`;
                     for (const o of input.options) {
                        h += `<option value="${o}" ${o === this.opts[name] ? 'selected' : ''}>${o}</option>`;
                     }
                     h += '</select>';
                  } else {
                     h += `<input type="range" min="${input.range[0]}" max="${input.range[1]}"
                        id="${name}" value="${this.opts[name]}">`;
                  }
                  h += '</li>';
               }
               styleMenu.innerHTML = `<ul>${h}<button id="${SN}-style-save">save</button>
                  <button id="${SN}-style-reset">reset</button></ul>
                  <button id="${SN}-style-button">&#9776;</button>`;

               document.querySelector('#outer').appendChild(styleMenu);

               document.getElementById(`${SN}-style-save`).addEventListener('click', () => {
                  let pos = getScroll() / getDocHeight();
                  for (const name in inputs) {
                     this.opts[name] = styleMenu.querySelector(`#${name}`).value;
                  }
                  this.setValues();
                  setScroll(pos * getDocHeight());
               });

               document.getElementById(`${SN}-style-reset`).addEventListener('click', () => {
                  let pos = getScroll() / getDocHeight();
                  styleMenu.parentElement.removeChild(styleMenu);
                  for (const [name, input] of Object.entries(inputs)) {
                     this.opts[name] = input.default;
                  }
                  this.html();
                  setScroll(pos * getDocHeight());
               });

               document.getElementById(`${SN}-style-button`).addEventListener('click', () => {
                  styleMenu.classList.toggle(`${SN}-style-hide`);
               });
            }
         };
         await Styling.getValues();
         Styling.html();

      } // END Feature.style


      // # words and time for every chapter, if the fic has chapters
      if (Feature.wpm) {
         for (let chapter of document.querySelectorAll('#chapters > .chapter > div.userstuff.module')) {
            // -2 because of hidden <h3>Chapter Text</h3>
            let numWords = chapter.textContent.replace(/['’‘-]/g, '').match(/\w+/g).length - 2;
            chapter.parentElement.insertAdjacentHTML('afterbegin',
               `<div class="${SN}-words">this chapter has ${numWords} words (time: ${
                  countTime(numWords)})</div>`);
         }
      }

      // remove all the non-breaking white spaces
      document.getElementById('chapters').innerHTML = document.getElementById('chapters')
         .innerHTML.replace(/&nbsp;/g, ' ');

   } // END Check.work()


   /** BLACKLIST **/
   if (Feature.black && Check.black()) {
      addCSS(`${SN}-blacklist`,
         `[data-${SN}-visibility="remove"],
         [data-${SN}-visibility="hide"] > :not(.header),
         [data-${SN}-visibility="hide"] > .header > :not(h4) { display: none !important; }

         [data-${SN}-visibility="hide"] > .header,
         [data-${SN}-visibility="hide"] > .header > h4 {
            margin: 0 !important; min-height: auto; width: 80%;
            font-size: .9em; font-style: italic; }

         [data-${SN}-visibility="hide"],
         [data-${SN}-visibility="show"] { opacity: .6; }
         [data-${SN}-visibility="hide"]::before,
         [data-${SN}-visibility="show"]::before {
            content: "\\2573  " attr(data-${SN}-reasons); font-size: .8em; }

         [data-${SN}-visibility] > .${SN}-show-work {
            display: block !important;  width: 100%; cursor: pointer; margin-top: .4em;
            font-size: .8em; text-align: right; text-decoration: underline dotted;
         }
         [data-${SN}-visibility="hide"] > .${SN}-show-work { margin-bottom: -1.4em; }`
      );

      const Blacklist = {
         lists: {
            Tag: [],
            Text: [],
            Author: []
         },
         opts: {
            show: true,
            pause: false,
            maxTags: 0,
            maxRelations: 0,
            minIncomplete: 0,
            minFandoms: 0,
            maxFandoms: 0,
            minChapters: 0,
            maxChapters: 0,
            minWords: 0,
            maxWords: 0,
            langs: ''
         },
         blurb: 'li.blurb.group',
         getValues: async function() {
            this.lists.Tag = await getStorage('blacklistTags', '[]');
            this.lists.Text = await getStorage('blacklistText', '[]');
            this.lists.Author = await getStorage('blacklistAuthors', '[]');
            Object.assign(this.opts, await getStorage('blacklistOpts', '{}'));
         },
         findTags: function(work) {
            return this.opts.maxTags &&
               work.querySelectorAll('.tag').length > this.opts.maxTags;
         },
         findRelations: function(work) {
            return this.opts.maxRelations &&
               work.querySelectorAll('.tags .relationships .tag').length > this.opts.maxRelations;
         },
         findLangs: function(work) {
            return this.opts.langs && work.querySelector('dd.language') &&
               !this.opts.langs.toLowerCase().includes(work.querySelector('dd.language').textContent.toLowerCase().trim());
         },
         getFandoms: function(work) {
            if ((this.opts.minFandoms || this.opts.maxFandoms) && work.querySelector('.header .fandoms .tag')) {
               let numFandoms = work.querySelectorAll('.header .fandoms .tag').length;
               if (this.opts.minFandoms && numFandoms < this.opts.minFandoms ||
                   this.opts.maxFandoms && numFandoms > this.opts.maxFandoms) {
                  return `Fandoms: ${numFandoms}`;
               }
            }
            return [];
         },
         getChapters: function(work) {
            if ((this.opts.minChapters || this.opts.maxChapters) &&
                work.querySelector('dd.chapters')) {
               let numCh = Number(work.querySelector('dd.chapters').textContent.split('/')[0]);
               if (this.opts.minChapters && numCh < this.opts.minChapters ||
                   this.opts.maxChapters && numCh > this.opts.maxChapters) {
                  return `Chapters: ${numCh}`;
               }
            }
            return [];
         },
         getWords: function(work) {
            if ((this.opts.minWords || this.opts.maxWords) && work.querySelector('dd.words')) {
               let numWords = Number(work.querySelector('dd.words').textContent.replace(/,/g, '')) / 1000;
               if (this.opts.minWords && numWords < this.opts.minWords ||
                   this.opts.maxWords && numWords > this.opts.maxWords) {
                  return `Words: ${Math.round(numWords * 1000)}`;
               }
            }
            return [];
         },
         getIncomplete: function(work) {
            if (this.opts.minIncomplete && work.querySelector('.required-tags .complete-no')) {
               // millisecs in an average month = 30.4days*24hrs*60mins*60secs*1000
               let updated = (
                  Date.now() - new Date(work.querySelector('.datetime').textContent).getTime()
                  ) / (30.4*24*60*60*1000);
               if (updated > this.opts.minIncomplete) {
                  return `Updated: ${Math.floor(updated)}mnth ago`;
               }
            }
            return [];
         },
         ifMatch: function(elem, list, flag) {
            let found = false;
            for (let value of this.lists[list]) {
               let pattern = value.trim().replace(/[.+?^${}()|[\]\\]/g, '\\$&');
               if (!pattern) break;
               let target = elem.text;

               // wildcard
               pattern = pattern.replace(/\*/g, '.*');
               // match 2 words in any order
               pattern = pattern.replace(/(.+)&&(.+)/, '(?=.*$1)(?=.*$2).*');
               // only otp
               if (/&!/.test(pattern) && elem.parent === 'relationships') {
                  // to delete fandom's name in the tag
                  target = target.replace(/ \(.+\)$/, '');
                  pattern = pattern.replace(/(.+)&!(.+)/, '(?=.*\\/)((?=.*$1)(?!.*$2)|(?=.*$2)(?!.*$1)).*');
               }

               let regex;
               if (flag === 'free') regex = new RegExp(pattern, 'i'); // for text
               else regex = new RegExp(`^${pattern}$`, 'i');

               if (regex.test(target)) {
                  if (flag === 'free') found = `${list}: ${value}`; // show the rule that matched (for text)
                  else if (elem.parent === 'heading') found = list; // show only list name (for author)
                  else found = `${list}: ${target}`; // show the entire matched tag
                  break;
               }
            }
            return found;
         },
         getReasons: function(work, list, where, flag = '') {
            if (!this.lists[list].length) return [];

            let filtered = [];
            for (let elem of work.querySelectorAll(where)) {
               let found = this.ifMatch({
                     text: elem.textContent.trim(),
                     parent: elem.parentElement.className
                  }, list, flag);
               if (found) filtered.push(found);
            }
            return filtered;
         }, setVisibility: function() {
            // clear previous values
            for (let el of document.querySelectorAll(`${this.blurb}[data-${SN}-visibility]`)) {
               el.removeAttribute(`data-${SN}-visibility`);
               el.removeAttribute(`data-${SN}-reasons`);
               if (el.querySelector(`.${SN}-show-work`)) el.removeChild(el.querySelector(`.${SN}-show-work`));
            }

            // stop if blacklist is paused
            if (this.opts.pause) return;

            // for every work, find reasons, set visibility and add button to show blurb
            for (let work of document.querySelectorAll(this.blurb)) {
               // fix for targeting also Anonymous works
               let h4 = work.querySelector('h4.heading');
               if (h4 && /by[\s\n]+Anonymous$/.test(h4.textContent.trim())) {
                  h4.innerHTML = h4.innerHTML.replace(/(-->\n\s+)Anonymous/m, '$1<a rel="author">Anonymous</a>');
               }

               // check if blacklisted and why
               let reasons = []
                  .concat(this.getReasons(work, 'Author', 'h4.heading a[rel="author"]'))
                  .concat(this.getIncomplete(work))
                  .concat(this.getWords(work))
                  .concat(this.getChapters(work))
                  .concat(this.getFandoms(work))
                  .concat(this.getReasons(work, 'Text', 'h4.heading a:first-child, .summary', 'free'))
                  .concat(this.getReasons(work, 'Tag',
                     '.tags .tag, .required-tags span:not(.warnings) span.text, .header .fandoms .tag'));
               if (this.findRelations(work)) reasons.unshift('Relations');
               if (this.findTags(work)) reasons.unshift('Tags');
               if (this.findLangs(work)) reasons.unshift('Language');
               if (!reasons.length) continue;

               // set visibility and add button to show blurb
               if (this.opts.show) {
                  work.setAttribute(`data-${SN}-visibility`, 'hide');
                  work.setAttribute(`data-${SN}-reasons`, reasons.join(' - '));

                  let btn = document.createElement('div');
                  btn.className = `${SN}-show-work`;
                  btn.textContent = 'show';
                  btn.addEventListener('click', function() {
                     work.setAttribute(`data-${SN}-visibility`, this.textContent);
                     this.textContent = this.textContent === 'show' ? 'hide' : 'show';
                  });
                  work.insertAdjacentElement('afterbegin', btn);
               } else {
                  work.setAttribute(`data-${SN}-visibility`, 'remove');
               }
            }
         },
         getArray: function(string) {
            return string.trim() ? string.split(',').map(s => s.trim()).filter(s => s.length) : [];
         },
         getInt: function(string, min = 0) {
            let number = string.trim() ? Math.max(parseInt(string), 0) : 0;
            if (number < min) number = 0;
            return number;
         },
         setValues: function() {
            // when changes are made manually on the menu
            this.lists.Tag = this.getArray(document.getElementById(`${SN}-black-tags`).value);
            this.lists.Text = this.getArray(document.getElementById(`${SN}-black-text`).value);
            this.lists.Author = this.getArray(document.getElementById(`${SN}-black-authors`).value);
            this.opts.maxTags = this.getInt(document.getElementById(`${SN}-black-maxTags`).value);
            this.opts.maxRelations = this.getInt(document.getElementById(`${SN}-black-maxRelations`).value);
            this.opts.minIncomplete = this.getInt(document.getElementById(`${SN}-black-minIncomplete`).value);
            this.opts.minFandoms = this.getInt(document.getElementById(`${SN}-black-minFandoms`).value);
            this.opts.maxFandoms = this.getInt(document.getElementById(`${SN}-black-maxFandoms`).value);
            this.opts.minChapters = this.getInt(document.getElementById(`${SN}-black-minChapters`).value);
            this.opts.maxChapters = this.getInt(document.getElementById(`${SN}-black-maxChapters`).value, this.opts.minChapters);
            this.opts.minWords = this.getInt(document.getElementById(`${SN}-black-minWords`).value);
            this.opts.maxWords = this.getInt(document.getElementById(`${SN}-black-maxWords`).value, this.opts.minWords);
            this.opts.langs = document.getElementById(`${SN}-black-langs`).value;
            this.opts.show = document.getElementById(`${SN}-black-show`).checked;
            this.opts.pause = document.getElementById(`${SN}-black-pause`).checked;
            setStorage('blacklistTags', this.lists.Tag);
            setStorage('blacklistText', this.lists.Text);
            setStorage('blacklistAuthors', this.lists.Author);
            setStorage('blacklistOpts', this.opts);

            this.setVisibility();
         },
         updateValues: function() {
            // when new tags or authors are added by click
            document.getElementById(`${SN}-black-tags`).value = this.lists.Tag.join(', ');
            document.getElementById(`${SN}-black-authors`).value = this.lists.Author.join(', ');
            setStorage('blacklistTags', this.lists.Tag);
            setStorage('blacklistAuthors', this.lists.Author);

            this.setVisibility();
         },
         html: function() {
            let blackMenu = document.createElement('li');
            blackMenu.id = `${SN}-black`;
            blackMenu.className = 'dropdown';
            blackMenu.setAttribute('aria-haspopup', 'true');
            blackMenu.innerHTML = `<a class="dropdown-toggle" data-toggle="dropdown" data-target="#">Blacklist</a>
               <ul class="menu dropdown-menu">
                  <li>
                     <a class="${SN}-save" id="${SN}-black-save">SAVE</a>
                  </li><li class="${SN}-opts">
                     <a>SHOW REASONS <input id="${SN}-black-show" type="checkbox" ${
                        this.opts.show ? 'checked' : ''}></a>
                     <a>PAUSE <input id="${SN}-black-pause" type="checkbox" ${
                        this.opts.pause ? 'checked' : ''}></a>
                  </li><li class="${SN}-opts">
                     <a title="for works in progress only">updated<br>max
                        <input id="${SN}-black-minIncomplete" type="number" min="0" step="1"
                        title="in months" value="${this.opts.minIncomplete}"></a>
                     <a>tags<br>max
                        <input id="${SN}-black-maxTags" type="number" min="0" step="1" value="${
                           this.opts.maxTags}"></a>
                     <a>relations<br>max
                        <input id="${SN}-black-maxRelations" type="number" min="0" step="1" value="${
                           this.opts.maxRelations}"></a>
                  </li><li class="${SN}-opts">
                     <a>chapters<br>min
                        <input id="${SN}-black-minChapters" type="number" min="0" step="1"
                        value="${this.opts.minChapters}">
                        max <input id="${SN}-black-maxChapters" type="number" min="0" step="1"
                        value="${this.opts.maxChapters}"></a>
                     <a>words<br>min
                        <input id="${SN}-black-minWords" type="number" min="0" step="1"
                        title="in thousands" value="${this.opts.minWords}">
                        max <input id="${SN}-black-maxWords" type="number" min="0" step="1"
                        title="in thousands" value="${this.opts.maxWords}"></a>
                  </li><li class="${SN}-opts">
                     <a>fandoms<br>min
                        <input id="${SN}-black-minFandoms" type="number" min="0" step="1"
                        value="${this.opts.minFandoms}">
                        max <input id="${SN}-black-maxFandoms" type="number" min="0" step="1"
                        value="${this.opts.maxFandoms}"></a>
                     <a title="show only specified">languages<br>
                        <input type="text" id="${SN}-black-langs" spellcheck="false"
                        title="separate languages with spaces" value="${this.opts.langs}"></a>
                  </li><li class="${SN}-optsFull">
                     <a title="tags, fandoms, relations, characters, ratings, warnings, categories, status">tags</a>
                     <textarea id="${SN}-black-tags" spellcheck="false">${
                        this.lists.Tag.join(', ')}</textarea>
                     <a>titles, summaries</a>
                     <textarea id="${SN}-black-text" spellcheck="false">${
                        this.lists.Text.join(', ')}</textarea>
                     <a>authors</a>
                     <textarea id="${SN}-black-authors" spellcheck="false">${
                        this.lists.Author.join(', ')}</textarea>
                  </li><li class="${SN}-opts">
                     <a title="comma">separator: ,</a>
                     <a title="match zero or more of any character (letter, white space, symbol...)">wildcard: *</a>
                     <a title="match two pair of words in any order">pair: &&</a>
                     <a title="hide relationships that only include one person from your favourite pairing (only for tags)">only otp: &!</a>
                  </li>
               </ul>`;
            document.querySelector('#header ul.primary.navigation.actions').appendChild(blackMenu);

            document.getElementById(`${SN}-black-save`).addEventListener('click', function() {
               Blacklist.setValues();
               this.textContent = 'SAVED';
               setTimeout(() => { this.textContent = 'SAVE'; }, 1000);
            });
         },
         altClick: function(event) {
            if (event.altKey) {
               if (event.target.classList.contains('tag') &&
                     !this.lists.Tag.includes(event.target.textContent)) {
                  event.preventDefault();
                  this.lists.Tag.push(event.target.textContent);
                  this.updateValues();
               } else if (event.target.getAttribute('rel') === 'author' &&
                     !this.lists.Author.includes(event.target.textContent)) {
                  event.preventDefault();
                  this.lists.Author.push(event.target.textContent);
                  this.updateValues();
               }
            }
         }
      };

      await Blacklist.getValues();
      Blacklist.setVisibility();
      Blacklist.html();
      document.querySelectorAll(Blacklist.blurb)[0].parentElement.addEventListener("click", Blacklist.altClick.bind(Blacklist));

   } // END Feature.black AND Check.black()


   /** GLOBAL FUNCTIONS **/

   async function getStorage(key, def) {
      // def must be a string of a valid json or a number
      return JSON.parse(await GM.getValue(key, def));
   }

   function setStorage(key, value) {
      // value can be any type
      GM.setValue(key, JSON.stringify(value));
   }

   function addCSS(id, css) {
      // unique id because of styling user changes
      if (document.querySelector(`style#${id}`)) {
         document.querySelector(`style#${id}`).textContent = css;
      } else {
         let style = document.createElement('style');
         style.id = id;
         style.textContent = css;
         document.head.appendChild(style);
      }
   }

   function countTime(num) {
      // estimate reading time
      if (!num) return '?';
      num = Math.round(Number(num) / Feature.wpm);
      let h = Math.floor(num / 60);
      let m = num % 60;
      return `${h > 0 ? `${h}hr ` : ''}${m > 0 ? `${m}min` : ''}` || '<1min';
   }

   function getScroll() {
      return Math.max(document.documentElement.scrollTop, window.scrollY, 0);
   }
   function setScroll(s) {
      window.scroll(0, s);
   }
   function getDocHeight() {
      return Math.max(document.documentElement.scrollHeight, document.documentElement.offsetHeight,
         document.body.scrollHeight, document.body.offsetHeight);
   }


   /** NOTIFICATION FOR UPDATES **/

   if (await Check.version()) {
      /*GM.notification({
         text: '\nFor more details, see the script description on Greasy Fork.',
         title: 'AO3: Styling, Blacklist, Bookmarks (v3.6.7.1)'
      });*/
   }

})();
