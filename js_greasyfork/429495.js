// ==UserScript==
// @name         MangaDex Condensed
// @namespace    suckerfree
// @license      MIT
// @version      51
// @description  Enhance MangaDex with lots of display options to make it easier to find unread chapters.
// @author       Nalin
// @match        https://mangadex.org/*
// @icon         https://www.google.com/s2/favicons?domain=mangadex.org
//
// @require      https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@2207c5c1322ebb56e401f03c2e581719f909762a/gm_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/429495/MangaDex%20Condensed.user.js
// @updateURL https://update.greasyfork.org/scripts/429495/MangaDex%20Condensed.meta.js
// ==/UserScript==

(function() {
  // Configure GM_config.
  GM_config.init(
  {
    'id': 'MangaDexCondensed',
    'fields': {
      'CoverMode': {
        'label': 'Popup/Enlarge Cover When Hovered On',
        'type': 'select',
        'options': ['Container', 'Title + Cover', 'Title', 'Cover', 'Never'],
        'default': 'Cover'
      },
      'CoverStyle': {
        'label': 'Preview Cover Style',
        'type': 'select',
        'options': ['Small', 'Full Size', 'Hidden'],
        'default': 'Small'
      },
      'CoverExpandDirection': {
        'label': 'Cover Expands',
        'type': 'select',
        'options': ['Down', 'Float Up', 'Float Down'],
        'default': 'Float Up'
      },
      'ReadChapterStyle': {
        'label': 'Read Chapter Style',
        'type': 'select',
        'options': ['Darken Background', 'Lighten Text', 'Hide'],
        'default': 'Darken Background'
      },
      'LeftClickMode': {
        'label': 'Left Click Opens In',
        'type': 'select',
        'options': ['Same Window', 'New Window'],
        'default': 'Same Window'
      },
      'CondenseElements': {
        'label': 'Condense Page Elements (reduce whitespace)',
        'type': 'checkbox',
        'default': true
      },
      'CondenseFonts': {
        'label': 'Adjust Font Sizes and Weights',
        'type': 'checkbox',
        'default': true
      }
    },
    'events': {
      'open': function() {
        const s = GM_config.frame.style;
        s.inset = '100px auto auto calc(50% - 500px/2)';
        s.width = '500px';
        s.height = '310px';
      },
      'save': function() { location.reload(); },
      'reset': function() { location.reload(); }
    },
    'css': '#MangaDexCondensed_header { margin-bottom: 15px !important; }'
  });

  // Adds a style to the <head> tags.
  function addGlobalStyle(css) {
    const head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    const style = document.createElement('style');
    style.type = 'text/css';
    style.setAttribute('from', 'mdc');
    style.innerHTML = css;
    head.appendChild(style);
  }

  // Creates the settings button.
  function createSettingsButton(divData, svgData) {
    const config = document.createElement('button');
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // Settings gear icon uses the CC0 (public domain) license.
    // https://www.svgrepo.com/svg/201666/settings-gear

    path1.setAttribute('stroke', 'currentColor');
    path1.setAttribute('stroke-width', '1');
    path1.setAttribute('d', `M491.584,192.579l-55.918-6.914c-0.919-2.351-1.884-4.682-2.892-6.993l34.648-44.428
      c7.227-9.267,6.412-22.464-1.899-30.773l-57.028-56.996c-8.308-8.304-21.502-9.114-30.763-1.893L333.32,79.216
      c-2.312-1.008-4.644-1.974-6.994-2.894l-6.915-55.904c-1.443-11.66-11.348-20.415-23.097-20.415h-80.637
      c-11.748,0-21.656,8.755-23.097,20.416l-6.914,55.904c-2.349,0.919-4.681,1.884-6.988,2.89l-44.415-34.642
      c-9.261-7.222-22.458-6.414-30.768,1.894l-57.021,57.009c-8.31,8.307-9.123,21.506-1.896,30.771l34.644,44.417
      c-1.012,2.312-1.978,4.647-2.9,7.002l-55.906,6.914C8.757,194.022,0,203.927,0,215.676v80.64c0,11.75,8.758,21.658,20.421,23.097
      l55.901,6.903c0.919,2.352,1.884,4.686,2.894,6.994l-34.641,44.417c-7.224,9.264-6.411,22.46,1.894,30.767l57.021,57.031
      c8.307,8.31,21.507,9.121,30.773,1.896l44.417-34.648c2.306,1.007,4.638,1.974,6.987,2.891l6.914,55.921
      c1.441,11.66,11.348,20.416,23.097,20.416h80.637c11.748,0,21.655-8.755,23.097-20.416l6.915-55.92
      c2.351-0.92,4.682-1.885,6.993-2.892l44.425,34.65c9.266,7.225,22.463,6.414,30.771-1.898l57.015-57.031
      c8.307-8.308,9.117-21.504,1.893-30.768l-34.641-44.409c1.012-2.313,1.978-4.647,2.898-7.002l55.901-6.903
      c11.661-1.44,20.421-11.348,20.421-23.097v-80.64C512,203.927,503.243,194.022,491.584,192.579z M465.455,275.74l-49.864,6.158
      c-9.151,1.131-16.772,7.556-19.431,16.386c-2.813,9.337-6.56,18.387-11.138,26.903c-4.367,8.124-3.525,18.063,2.147,25.335
      l30.898,39.613l-27.924,27.932l-39.621-30.905c-7.269-5.668-17.202-6.513-25.327-2.15c-8.513,4.572-17.565,8.319-26.905,11.134
      c-8.827,2.661-15.25,10.279-16.381,19.427l-6.169,49.883h-39.492l-6.167-49.883c-1.131-9.146-7.551-16.763-16.375-19.425
      c-9.367-2.825-18.417-6.571-26.899-11.132c-8.122-4.369-18.061-3.527-25.336,2.147l-39.615,30.902L93.929,390.13l30.897-39.618
      c5.671-7.273,6.513-17.206,2.147-25.328c-4.568-8.501-8.315-17.554-11.137-26.911c-2.662-8.825-10.282-15.247-19.43-16.376
      l-49.861-6.156v-39.492l49.866-6.167c9.146-1.131,16.763-7.551,19.423-16.375c2.824-9.356,6.572-18.406,11.143-26.9
      c4.374-8.124,3.533-18.067-2.143-25.342l-30.903-39.62l27.924-27.918l39.62,30.902c7.273,5.672,17.209,6.513,25.335,2.146
      c8.493-4.565,17.541-8.31,26.896-11.132c8.825-2.662,15.247-10.279,16.378-19.427l6.166-49.867h39.494l6.169,49.869
      c1.133,9.148,7.557,16.767,16.384,19.427c9.328,2.811,18.379,6.557,26.902,11.135c8.122,4.364,18.055,3.522,25.325-2.149
      l39.616-30.894l27.927,27.912l-30.897,39.618c-5.666,7.267-6.513,17.191-2.158,25.311c4.58,8.54,8.328,17.599,11.138,26.923
      c2.661,8.825,10.279,15.248,19.427,16.381l49.878,6.169V275.74z`);

    path2.setAttribute('stroke', 'currentColor');
    path2.setAttribute('stroke-width', '1');
    path2.setAttribute('d', `M255.997,155.153c-55.606,0-100.845,45.244-100.845,100.856c0,55.603,45.239,100.839,100.845,100.839
      c55.609,0,100.852-45.236,100.852-100.839C356.849,200.397,311.606,155.153,255.997,155.153z M255.997,310.303
      c-29.941,0-54.3-24.356-54.3-54.294c0-29.947,24.359-54.311,54.3-54.311c29.944,0,54.306,24.363,54.306,54.311
      C310.303,285.947,285.941,310.303,255.997,310.303z`);

    icon.classList.add('icon', 'text-icon-contrast', 'text-undefined');
    icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    icon.setAttribute('width', '24');
    icon.setAttribute('height', '24');
    icon.setAttribute('viewBox', '0 0 512 512');
    icon.setAttribute('fill', 'currentColor');

    config.classList.add('condensed-settings');
    config.addEventListener('click', function() { GM_config.open(); });

    if (svgData !== undefined) {
      path1.setAttribute(svgData, '');
      path2.setAttribute(svgData, '');
      icon.setAttribute(svgData, '');
    }
    if (divData !== undefined) {
      icon.setAttribute(divData, '');
      config.setAttribute(divData, '');
    }

    icon.append(path1);
    icon.append(path2);
    config.append(icon);

    return config;
  }

  // Helper function for finding data- attributes.
  const findDataAttribute = function(e) {
    for (const attribute of e.attributes) {
      if (attribute.name.startsWith('data-'))
        return attribute.name;
      return null;
    }
  }

  // Function for toggling a read chapter on mouse click.
  const toggleRead = function(ev) {
    //debugger;
    const tag = ev.target.tagName.toUpperCase();
    if (['SVG', 'PATH'].includes(tag)) return;
    if (ev.target.classList.contains('group-tag')) return;
    if (ev.target.classList.contains('user-tag')) return;
    if (ev.target.classList.contains('pill')) return;
    if (ev.target.closest('a.comment-container') !== null) return;
    if (ev.target.closest('.read') !== null) return;
    //if (ev.target.attributes.title?.value.includes('comments') ?? false) return;
    const chapter = ev.target.closest('.chapter');
    if (chapter === null) return;
    const ind = chapter.getElementsByTagName('svg')[0];
    if (ind !== undefined)
      ind.dispatchEvent(new MouseEvent('click'));
  }

  const removeElementEvents = function(elements) {
    // Assemble the list of elements to check.
    // JS really sucks sometimes.
    let arr = [];
    if (elements instanceof NodeList)
      arr.push(Array.from(elements));
    else arr.push([elements] || []);

    let clones = [];

    arr.flat(Infinity).forEach((element) => {

      // Clone the node in question.
      const clone = element.cloneNode(false);

      // Move all the children over to the clone and replace the original.
      [...element.childNodes].forEach((n) => clone.appendChild(n));
      element.replaceWith(clone);
      clones.push(clone);
    });

    return clones;
  }

  const rebindLeftClick = function(chapter) {
    [...chapter.querySelectorAll('a')].forEach((a) => a.setAttribute('target', '_blank'));
  }

  // Store this so when we change pages, we can disconnect it.
  let current_page_observers = [];
  let previous_pathname = '';

  ///////////////////////////////////////////////////////////////////////////////

  function addStyles() {
    // Follow.
    {
      const style = `
        /* Thin out the container padding. */
        #__nuxt[mdcpage="follow"][mdcce="true"] .chapter-feed__container {padding: 0.25rem !important;}

        /* Adjust the location of the cover image. */
        #__nuxt[mdcpage="follow"][mdccover="Small"] .chapter-feed__container {grid-template-columns: 41px minmax(0,1fr) !important;}
        #__nuxt[mdcpage="follow"][mdccover="Small"] .chapter-feed__cover {width: 41px !important; height: 53px !important; max-height: initial !important; padding-bottom: 0px !important;}
        #__nuxt[mdcpage="follow"][mdccover="Hidden"] .chapter-feed__container {grid-template-areas: "title title" "list list" !important;}
        #__nuxt[mdcpage="follow"][mdccover="Hidden"] .chapter-feed__cover {display:none;}

        /* Remove bolding of the chapter titles. */
        /* Adjust the font size of the title. */
        #__nuxt[mdcpage="follow"][mdccf="true"] .chapter-link {font-weight: normal !important; font-size: 0.75rem !important;}

        /* Cover expansion. */
        #__nuxt[mdcpage="follow"][mdccoverenabled="true"] .chapter-feed__container.mdc-cover-expand {grid-template-columns: 140px minmax(0,1fr) !important; position: relative;}
        #__nuxt[mdcpage="follow"][mdccoverenabled="true"] .chapter-feed__container.mdc-cover-expand a.chapter-feed__cover {width: 140px !important; height: 196px !important;}
        #__nuxt[mdcpage="follow"][mdccoverenabled="true"] .mdc-cover-expand .chapter-feed__cover {display:revert;}
        #__nuxt[mdcpage="follow"][mdccoverenabled="true"][mdccover="Hidden"] .chapter-feed__container.mdc-cover-expand {grid-template-areas: "art title" "art list" !important;}
        #__nuxt[mdcpage="follow"][mdccoverenabled="true"][mdccoverfloat="true"] .mdc-cover-expand:not(.expand) .chapter-feed__cover {outline: 4px solid rgb(var(--md-accent)); position: absolute; z-index: 1;}
        #__nuxt[mdcpage="follow"][mdccoverenabled="true"][mdccoverfloat="true"][mdcstyle="Darken Background"] .mdc-cover-expand.condensed-read:not(.expand) .chapter-feed__cover {outline-color: rgb(var(--mdc-read-background)) !important;}
        #__nuxt[mdcpage="follow"][mdccoverenabled="true"][mdccoverexpand="Float Up"] .mdc-cover-expand:not(.expand) .chapter-feed__cover {bottom: 0px;}
        #__nuxt[mdcpage="follow"][mdccoverenabled="true"][mdccoverexpand="Float Down"] .mdc-cover-expand .chapter-feed__cover {top: 0px;}
      `;

      addGlobalStyle(style);
    }

    // Title / Group.
    {
      const style = `
        /* Remove the spacing and apply chapter line separators. */
        #__nuxt[mdcpage="title"][mdcce="true"] .flex.flex-col.gap-2 {gap: 0rem !important;}
        #__nuxt[mdcpage="title"][mdcce="true"] .chapter {border-bottom: 1px solid rgb(var(--md-accent-30)) !important;}

        /* Remove bolding of chapter titles and adjust the font size, but leave a little bolding for unread. */
        #__nuxt[mdcpage="title"][mdccf="true"] .chapter:not(.read) .chapter-link {font-weight: 500 !important; font-size: 0.75rem !important;}
        #__nuxt[mdcpage="title"][mdccf="true"] .chapter.read .chapter-link {font-weight: normal !important; font-size: 0.75rem !important;}
        #__nuxt[mdcpage="title"][mdccf="true"] .bg-accent.rounded-sm.read .font-bold {font-weight: normal !important;}

        /* Adjust line height of unread chapters. */
        #__nuxt[mdcpage="title"][mdcce="true"] .chapter:not(.read) > div.chapter-grid {line-height: 1.25rem;}
      `;

      addGlobalStyle(style);
    }

    // All.
    {
      const style = `
        /* Settings cog. */
        button.condensed-settings {position: relative;}
        button.condensed-settings::after {background: #000; opacity: 0; content: ""; position: absolute; top: 0; bottom: 0; left: 0; right: 0; transition: all .1s ease-out;}
        button.condensed-settings:hover::after {opacity: 0.2;}

        /* Adjust the font size and styling. */
        #__nuxt[mdccf="true"] .chapter-feed__title {font-size: 0.75rem !important;}
        #__nuxt[mdccf="true"] .chapter-grid {font-size: 0.75rem !important;}
        #__nuxt[mdccf="true"] .chapter-grid .font-bold {font-weight: normal !important;}

        /* Alter the grid spacing to give more room for the chapter name. */
        @media (min-width:48rem) {
          #__nuxt[mdcce="true"] .chapter-grid {grid-template-areas: "title spacer groups uploader views timestamp comments" !important;}
          #__nuxt[mdcce="true"] .chapter-grid {grid-template-columns: auto auto fit-content(100%) fit-content(100%) min-content min-content 6ch !important;}
          #__nuxt[mdcce="true"] .chapter-grid {padding-top: 0.15rem !important; padding-bottom: 0 !important; row-gap: 0.15rem !important;}
        }

        /* Adjust container margin to be smaller. */
        #__nuxt[mdcce="true"] .chapter-feed__container.mb-4 {margin-bottom: 0.5rem !important;}

        /* Adjust the lift color for read chapters. */
        .chapter.read .pill.lift:hover {background-color:rgb(var(--md-accent-10)) !important;}
        .chapter.read .group-tag.lift:hover {background-color:rgb(var(--md-accent-10)) !important;}

        /* Add a lift for comments. */
        .chapter.read [title*="comment"]:hover {background-color:rgb(var(--md-accent-10));}

        /* Identify read chapters easier. */
        /* Darken the background color. */
        .light #__nuxt[mdcstyle="Darken Background"] {--mdc-read-background: var(--md-accent-50);}
        .dark #__nuxt[mdcstyle="Darken Background"] {--mdc-read-background: var(--md-background);}
        #__nuxt[mdcstyle="Darken Background"] .chapter.read {background-color:rgb(var(--mdc-read-background)) !important;}
        #__nuxt[mdcstyle="Darken Background"] .condensed-read {background-color:rgb(var(--mdc-read-background)) !important;}
        #__nuxt[mdcstyle="Darken Background"] .bg-accent.rounded-sm.read {background-color:rgb(var(--md-read-background)) !important;}
        .light #__nuxt[mdcstyle="Darken Background"] .chapter.read {color:#828282 !important;}
        .dark #__nuxt[mdcstyle="Darken Background"] .chapter.read {color:#6a6a6a !important;}

        /* Gray out the chapter name. */
        .light #__nuxt[mdcstyle="Lighten Text"] .chapter.read {color:#b9b9b9 !important;}
        .dark  #__nuxt[mdcstyle="Lighten Text"] .chapter.read {color:#6a6a6a !important;}

        /* Hide. */
        #__nuxt[mdcstyle="Hide"] .chapter.read {display:none !important;}
        #__nuxt[mdcstyle="Hide"] .condensed-read {display:none !important;}

        /* Support popup. */
        .pe-none {pointer-events: none;}
        .pe-auto {pointer-events: auto;}
        .panel-width {width: var(--drawer-menu-width);}
      `;

      addGlobalStyle(style);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  function pageFollows() {
    const container_selector = '#__nuxt';
    const config_class = 'controls';

    function style() {
      const coverMode = GM_config.get('CoverMode');
      const coverStyle = GM_config.get('CoverStyle');
      const coverExpand = GM_config.get('CoverExpandDirection');
      const readStyle = GM_config.get('ReadChapterStyle');
      const condenseElements = GM_config.get('CondenseElements');
      const condenseFonts = GM_config.get('CondenseFonts');

      const nuxt = document.getElementById('__nuxt');

      nuxt.setAttribute('mdcpage', 'follow');
      nuxt.setAttribute('mdccover', coverStyle);
      nuxt.setAttribute('mdccoverexpand', coverExpand);
      nuxt.setAttribute('mdcstyle', readStyle);
      if (condenseElements) nuxt.setAttribute('mdcce', condenseElements);
      if (condenseFonts) nuxt.setAttribute('mdccf', condenseFonts);

      if (coverStyle !== 'Hidden' || coverStyle === 'Hidden' && ['Title + Cover', 'Container'].includes(coverMode))
        nuxt.setAttribute('mdccoverenabled', true);
      if (['Float Up', 'Float Down'].includes(coverExpand))
        nuxt.setAttribute('mdccoverfloat', true);
    }

    function observer() {
      const apply_js_cb = async function(mutationsList, observer) {

        let loadedOne = false;
        const containers = document.getElementsByClassName('chapter-feed__container');
        for (const container of containers) {
          const title = container.getElementsByClassName('chapter-feed__title')[0];
          const cover = container.getElementsByClassName('chapter-feed__cover')[0];
          const chapters = container.getElementsByClassName('chapter-feed__chapters')[0];

          if (title && cover && chapters) {
            // Abort if we've already processed this title.
            // Our observer can get called multiple times.
            if (title.classList.contains('condensed-parsed'))
              return;

            // Mark that we loaded at least one thing.
            // We know the page has loaded so we can try to inject the settings cog latter on.
            loadedOne = true;

            const coverMode = GM_config.get('CoverMode');
            const coverStyle = GM_config.get('CoverStyle');
            const coverExpand = GM_config.get('CoverExpandDirection');
            let count = 0;
            let hideTimeout = 0;
            let touchAndMove = false;

            // If we are popping the cover out, add some grace for the hide.
            if (coverStyle === 'Hidden') {
              if (coverMode === 'Title + Cover') hideTimeout = 100;
              if (coverMode === 'Container') hideTimeout = 50;
            }

            const hide = function(e, t = hideTimeout) {
              console.log('[MDC] Hiding cover via ' + e.type);
              touchAndMove = false;

              // Compact mode doesn't show the cover.  Trying to mess with it will break the page.
              if (container.classList.contains('compact')) return;

              setTimeout(() => {
                if (--count <= 0) {
                  count = 0;
                  container.classList.remove('mdc-cover-expand');
                }
              }, t);
            };
            const show = function(e) {
              console.log('[MDC] Showing cover via ' + e.type);

              // Compact mode doesn't show the cover.  Trying to mess with it will break the page.
              if (container.classList.contains('compact')) return;

              ++count;
              container.classList.add('mdc-cover-expand');
            };
            const touchMove = function(e) {
              touchAndMove = true;
            }
            const contextMenu = function(e) {
              if (touchAndMove) {
                e.preventDefault();
                console.log('[MDC] Preventing contextmenu due to touch and hold.');
              } else {
                hide(e);
              }
            }

            // Controls our method of showing covers.
            // Mouse enters: Show the cover and move the chapters over to the next column.
            // Mouse leaves: Hide the cover and span the chapters across the whole grid row.
            if (coverStyle !== 'Full Size') {
              const events = [['mouseenter', show], ['mouseleave', hide], ['touchstart', show], ['touchend', hide], ['touchcancel', hide], ['touchmove', touchMove], ['contextmenu', contextMenu]];
              if (coverMode === 'Container') {
                events.forEach((ev) => container.addEventListener(ev[0], ev[1]));
              }
              if (coverMode === 'Title' || coverMode == 'Title + Cover') {
                events.forEach((ev) => title.addEventListener(ev[0], ev[1]));
              }
              if (coverMode === 'Cover' || coverMode == 'Title + Cover') {
                events.forEach((ev) => cover.addEventListener(ev[0], ev[1]));
              }
            }

            // Adding our event listeners might have triggered a weird browser issue where our mouseenter event got triggered twice.
            // I noticed this happens on Firefox if your mouse is already over a cover image on page load.
            // Set our count to 0 to allow the hide function to properly clean up.
            setTimeout(() => { count = 0; }, 1);

            // Set up default state (cover hidden).
            if (coverStyle === 'Hidden') {
              hide(undefined, 0);
            }

            // Add functionality for each chapter.
            for (const chapter of chapters.querySelectorAll('.chapter')) {

              // Remove events from the child anchor tags.
              // These Vue events cancel the event bubble which prevents our changes from working.
              removeElementEvents(chapter.querySelectorAll('a'));

              // Alter anchor target.
              const leftClickMode = GM_config.get('LeftClickMode');
              if (leftClickMode === 'New Window')
                rebindLeftClick(chapter);

              // Add event to mark the chapter as read when clicked.
              // MangaDex will throw an error if a page navigation happens at the same time so don't bind on click
              // unless we re-target clicks to open in a new window.
              chapter.addEventListener('auxclick', toggleRead);
              if (leftClickMode === 'New Window')
                chapter.addEventListener('click', toggleRead);
            }

            // Remove the alt-text on the flag.
            // This prevents text overlap on the title when MangaDex isn't loading.
            const flag = title.firstElementChild;
            if (flag !== null) flag.alt = '';

            // Mark that we've processed this title.
            title.classList.add('condensed-parsed');
          }
        }

        if (loadedOne) {
          addConfig();
          fixSupportPopup();
        }
      };

      // Used to prevent spawning a bunch of setTimeouts if we have rapid mutation callbacks.
      let waiting_for_timeout = false;

      // Applies "read" status to the whole manga container if every chapter under it has been read.
      const apply_read_cb = async function(mutationsList, observer) {

        // We disconnect our observer so the changes we make don't cause new mutations.
        if (observer !== undefined) {
          observer.disconnect();
          observer.takeRecords();
        }

        if (mutationsList.some((e) => e.attributeName === 'class')) {

          // Only process if we are waiting for a callback.
          if (!waiting_for_timeout) {
            waiting_for_timeout = true;

            // Set a small timeout so the changes apply before we test for read chapters.
            setTimeout(() => {
              waiting_for_timeout = false;
              const containers = document.getElementsByClassName('chapter-feed__container');

              for (const container of containers) {
                const chapters = container.getElementsByClassName('chapter-feed__chapters')[0];
                if (!chapters)
                  continue;

                const chapter = chapters.getElementsByClassName('chapter');

                // If all chapters for this title have been read, apply the condensed-read class to the container.
                if (Array.prototype.every.call(chapter, (e) => e.classList.contains('read'))) {
                  container.classList.add('condensed-read');
                }
                else {
                  container.classList.remove('condensed-read');
                }
              }

              // Reconnect our observer now that we pushed changes.
              try {
                const page_container = document.querySelector(container_selector);
                observer.observe(page_container, {attributes: true, subtree: true, attributeFilter: ['class']});
              } catch (error) {}
            }, 10);
          }
        }
      };

      try {
        //debugger;
        const page_container = document.querySelector(container_selector);
        const chapter_observer = new MutationObserver(apply_js_cb);
        chapter_observer.observe(page_container, {attributes: false, childList: true, subtree: true});

        const read_observer = new MutationObserver(apply_read_cb);
        read_observer.observe(page_container, {attributes: true, subtree: true, attributeFilter: ['class']});

        current_page_observers.push(chapter_observer, read_observer);

        apply_js_cb();
      } catch (error) {}
    }

    function addConfig() {
      const controls = document.getElementsByClassName(config_class)[0];
      if (controls === undefined || controls.getElementsByClassName('condensed-settings').length !== 0)
        return;

      const divData = findDataAttribute(controls.firstElementChild);
      const svgData = findDataAttribute(controls.firstElementChild.firstElementChild);

      const config = createSettingsButton(divData, svgData);
      config.classList.add('item');
      controls.append(config);
    }

    // Avoid adding tons of duplicate styles.
    if (current_page_observers.length === 0) {
      style();
      observer();
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  function pageTitle() {
    const container_selector = '#__nuxt';
    const config_class = '.layout-container div.sm\\:ml-2 .flex.mb-6';
    const config_class2 = '.layout-container div.sm\\:ml-2 .flex.mb-2';

    function style() {
      const coverStyle = GM_config.get('CoverStyle');
      const readStyle = GM_config.get('ReadChapterStyle');
      const condenseElements = GM_config.get('CondenseElements');
      const condenseFonts = GM_config.get('CondenseFonts');

      const nuxt = document.getElementById('__nuxt');

      nuxt.setAttribute('mdcpage', 'title');
      nuxt.setAttribute('mdccover', coverStyle);
      nuxt.setAttribute('mdcstyle', readStyle);
      if (condenseElements) nuxt.setAttribute('mdcce', condenseElements);
      if (condenseFonts) nuxt.setAttribute('mdccf', condenseFonts);
    }

    function observer() {
      const apply_js_cb = function(mutationsList, observer) {

        // Try to add our settings button.
        addConfig();
        fixSupportPopup();

        const chapters = document.querySelectorAll('.chapter');
        for (const chapter of chapters) {
          // Abort if we've already processed this chapter.
          // Our observer can get called multiple times.
          if (chapter.classList.contains('condensed-parsed'))
            return;

          // Mark that we've processed this chapter.
          chapter.classList.add('condensed-parsed');

          // Put the "read" class on chapter group titles so we can gray out the group text.
          const read = chapter.classList.contains('read');
          if (read) {
            // Check if we are in a group.  We can test this by going to the parent and checking if we have a sibling (the title).
            const is_group = chapter.parentElement.previousElementSibling !== null;
            if (is_group) {
              chapter.parentElement.parentElement.classList.add('read');
            }
          }

          // Remove events from the child anchor tags.
          // These Vue events cancel the event bubble which prevents our changes from working.
          removeElementEvents(chapter.querySelectorAll('a'));

          // Alter anchor target.
          const leftClickMode = GM_config.get('LeftClickMode');
          if (leftClickMode === 'New Window')
            rebindLeftClick(chapter);

          // Add event to mark the chapter as read when clicked.
          // MangaDex will throw an error if a page navigation happens at the same time so don't bind on click
          // unless we re-target clicks to open in a new window.
          chapter.addEventListener('auxclick', toggleRead);
          if (leftClickMode === 'New Window')
            chapter.addEventListener('click', toggleRead);
        }
      };

      try {
        //debugger;
        const page_container = document.querySelector(container_selector);
        const chapter_observer = new MutationObserver(apply_js_cb);
        chapter_observer.observe(page_container, {attributes: false, childList: true, subtree: true});

        current_page_observers.push(chapter_observer);
      } catch (error) {}
    }

    function addConfig() {
      let controls = document.getElementsByClassName('controls')[0];
      if (controls === undefined)
        controls = document.querySelector(config_class);
      if (controls === null)
        controls = document.querySelector(config_class2);
      if (controls === undefined || controls === null || controls.getElementsByClassName('condensed-settings').length !== 0)
        return;

      // Abort if we've already added our control.
      if (controls.classList.contains('condensed-parsed'))
        return;

      // Mark that we've added this control.
      controls.classList.add('condensed-parsed');

      const config = createSettingsButton();
      config.classList.add('rounded', 'relative', 'md-btn', 'flex', 'items-center', 'overflow-hidden', 'px-3', 'justify-center', 'text-black',
                           'dark:text-white', 'bg-accent', 'hover:bg-accent-darken', 'active:bg-accent-darken2',
                           'dark:bg-accent-lighten2', 'dark:hover:bg-accent-lighten', 'dark:active:bg-accent', 'px-0');
      config.style.minHeight = '48px';
      config.style.minWidth = '48px';
      controls.append(config);
    }

    if (current_page_observers.length === 0) {
      style();
      observer();
      addConfig();
      fixSupportPopup();
    }
  }

  ///////////////////////////////////////////////////////////////////////////////

  function fixSupportPopup() {
    //debugger;
    const supportButton = document.querySelector('button.md-btn ~ a.md-btn[href*="support-us"]');
    if (supportButton !== null) {
      const wrapper = supportButton.closest('.z-20')
      const inner = wrapper.firstElementChild;
      if (wrapper !== null && inner !== null) {
        wrapper.classList.add('panel-width');
        wrapper.classList.add('pe-none');
        inner.classList.add('pe-auto');
        return;
      }
    }
    console.warn("[MDC] fixSupportPopup is no longer working.");
  }

  ///////////////////////////////////////////////////////////////////////////////
  // This is our loader.
  //debugger;
  const pageContentSelector = '#__nuxt';
  const bootstrap_loader = function(mutationsList, observer) {
    console.log('[MDC] Bootstrap loader.');
    observer.disconnect();
    observer.takeRecords();

    // Detects page changes.
    const page_transfer_loader = function(mutationsList, observer) {

      const full_location = location.pathname + location.search;
      if (previous_pathname === full_location)
        return;

      previous_pathname = full_location;
      if (current_page_observers.length !== 0) {
        current_page_observers.forEach((x) => { x.disconnect(); x.takeRecords(); });
        current_page_observers = [];
      }

      // Choose the style function to apply.
      const follows = [/\/titles\/feed/, /\/titles\/latest/, /\/my\/history/, /\/user\//, /\/group\//];
      const title = [/\/title\//, /\/titles\/follows/];
      let pageFunction = undefined;
      if (follows.filter((url) => url.test(full_location)).length > 0)
        pageFunction = pageFollows;
      else if (title.filter((url) => url.test(full_location)).length > 0)
        pageFunction = pageTitle;

      if (pageFunction !== undefined) {
        console.log(`[MDC] Page detected, calling ${pageFunction.name}.`);
        pageFunction();
      }

      // observer.observe(content_container, {attributes: false, childList: true, subtree: true});
    };

    const content_container = document.querySelector(pageContentSelector);
    const content_observer = new MutationObserver(page_transfer_loader);
    content_observer.observe(content_container, {attributes: false, childList: true, subtree: true});

    // Test for the page already being loaded.  This is a race condition that could break the observer.
    if (content_container.hasChildNodes()) {
      console.log('[MDC] Page loaded, jumping to page detection.');
      page_transfer_loader([], content_observer);
    }
  };

  // This is the first bootstrap loader.
  // This will catch the main page being loaded.
  // At this point, we switch over to our page transfer loader which will detect page changes.
  window.addEventListener('load', (event) => {
    // Apply the styles now.  They will sit for all future pages.
    addStyles();

    const load_observer = new MutationObserver(bootstrap_loader);
    load_observer.observe(document.body, {attributes: false, childList: true, subtree: false});

    // Test for the page already being loaded.  This is a race condition that could break the observer.
    //debugger;
    const content_container = document.querySelector(pageContentSelector);
    if (content_container != null && content_container.hasChildNodes()) {
      console.log('[MDC] Page loaded, jumping to bootstrap.');
      bootstrap_loader([], load_observer);
    }
  });
})();
