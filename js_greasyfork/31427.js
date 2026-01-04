// ==UserScript==
// @name         GCPedia Ace Editor
// @namespace    https://greasyfork.org/users/649
// @version      1.3.1
// @description  Use the Ace Editor when editing things on GCPedia
// @author       Adrien Pyke
// @match        *://www.gcpedia.gc.ca/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/gh/kufii/My-UserScripts@22210afba13acf7303fc91590b8265faf3c7eda7/libs/gm_config.js
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @downloadURL https://update.greasyfork.org/scripts/31427/GCPedia%20Ace%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/31427/GCPedia%20Ace%20Editor.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const SCRIPT_NAME = 'GCPedia Ace Editor';

  const Util = {
    log(...args) {
      args.unshift(`%c${SCRIPT_NAME}:`, 'font-weight: bold;color: #233c7b;');
      console.log(...args);
    },
    q(query, context = document) {
      return context.querySelector(query);
    },
    qq(query, context = document) {
      return Array.from(context.querySelectorAll(query));
    },
    addScript(src, onload) {
      const s = document.createElement('script');
      s.onload = onload;
      s.src = src;
      document.body.appendChild(s);
    },
    addScriptText(code, onload) {
      const s = document.createElement('script');
      s.onload = onload;
      s.textContent = code;
      document.body.appendChild(s);
    },
    appendAfter(elem, elemToAppend) {
      elem.parentNode.insertBefore(elemToAppend, elem.nextElementSibling);
    }
  };

  const Config = GM_config([
    {
      key: 'theme',
      label: 'Theme',
      default: 'monokai',
      type: 'dropdown',
      values: [
        'ambiance',
        'chaos',
        'chrome',
        'clouds',
        'clouds_midnight',
        'cobalt',
        'crimson_editor',
        'dawn',
        'dreamweaver',
        'eclipse',
        'github',
        'gob',
        'idle_fingers',
        'iplastic',
        'katzenmilch',
        'kr_theme',
        'kuroir',
        'merbivore',
        'merbivore_soft',
        'mono_industrial',
        'monokai',
        'solarized_dark',
        'solarized_light',
        'sqlserver',
        'terminal',
        'textmate',
        'tomorrow',
        'tomorrow_night',
        'tomorrow_night_blue',
        'tomorrow_night_bright',
        'tomorrow_night_eighties',
        'twilight',
        'vibrant_ink',
        'xcode'
      ]
    }
  ]);

  waitForElems({
    sel: '#wpTextbox1',
    stop: true,
    onmatch(textArea) {
      const wrapper = document.createElement('div');
      wrapper.id = 'ace';
      wrapper.textContent = textArea.value;

      Util.appendAfter(textArea, wrapper);

      GM_addStyle(`
				.ace_editor {
					height: 600px;
				}
				.wikiEditor-ui,
				#wpTextbox1 {
					display: none;
				}
			`);

      Util.addScript(
        'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.8/ace.js',
        () => {
          const editor = unsafeWindow.ace.edit('ace');
          editor.setTheme(`ace/theme/${Config.load().theme}`);
          editor.getSession().setMode('ace/mode/html');
          editor.resize();

          unsafeWindow.aceEditor = editor;
          unsafeWindow.originalTextArea = textArea;

          Util.addScriptText(
            'aceEditor.getSession().on("change", () => originalTextArea.value = aceEditor.getValue())'
          );

          GM_registerMenuCommand('GCPedia Ace Editor Settings', () =>
            Config.setup(editor)
          );
          Config.onchange = (key, value) =>
            editor.setTheme(`ace/theme/${value}`);
          Config.oncancel = cfg => editor.setTheme(`ace/theme/${cfg.theme}`);
        }
      );
    }
  });
})();
