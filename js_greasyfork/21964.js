// ==UserScript==
// @name         GitHub Editor - Change Default Settings
// @namespace    https://greasyfork.org/users/649
// @version      1.1.21
// @description  change default settings for the github editor
// @author       Adrien Pyke
// @match        *://github.com/*/new/*
// @match        *://github.com/*/edit/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/gh/kufii/My-UserScripts@22210afba13acf7303fc91590b8265faf3c7eda7/libs/gm_config.js
// @require      https://cdn.jsdelivr.net/gh/fuzetsu/userscripts@ec863aa92cea78a20431f92e80ac0e93262136df/wait-for-elements/wait-for-elements.js
// @downloadURL https://update.greasyfork.org/scripts/21964/GitHub%20Editor%20-%20Change%20Default%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/21964/GitHub%20Editor%20-%20Change%20Default%20Settings.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const Config = GM_config([
    {
      key: 'indentMode',
      label: 'Indent mode',
      default: 'tab',
      type: 'dropdown',
      values: [
        { value: 'space', text: 'Spaces' },
        { value: 'tab', text: 'Tabs' }
      ]
    },
    {
      key: 'indentWidth',
      label: 'Indent size',
      default: 4,
      type: 'dropdown',
      values: [2, 4, 8]
    },
    {
      key: 'wrapMode',
      label: 'Line wrap mode',
      default: 'off',
      type: 'dropdown',
      values: [
        { value: 'off', text: 'No wrap' },
        { value: 'on', text: 'Soft wrap' }
      ]
    }
  ]);

  const updateDropdown = function (dropdown, value) {
    dropdown.value = value;
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', false, true);
    dropdown.dispatchEvent(evt);
  };

  const applySettings = function (cfg) {
    const indentMode = document.querySelector('.js-code-indent-mode');
    const indentWidth = document.querySelector('.js-code-indent-width');
    const wrapMode = document.querySelector('.js-code-wrap-mode');

    if (location.href.match(/^https?:\/\/github.com\/[^/]*\/[^/]*\/new\/.*/u)) {
      // new file
      updateDropdown(indentMode, cfg.indentMode);
      updateDropdown(indentWidth, cfg.indentWidth);
      updateDropdown(wrapMode, cfg.wrapMode);
    } else if (
      location.href.match(/^https?:\/\/github.com\/[^/]*\/[^/]*\/edit\/.*/u)
    ) {
      // edit file
      // if the file is using space indentation we don't want to change it
      if (indentMode.value === 'tab') {
        updateDropdown(indentWidth, cfg.indentWidth);
      }
      updateDropdown(wrapMode, cfg.wrapMode);
    }
  };

  GM_registerMenuCommand('GitHub Editor Settings', Config.setup);
  const settings = Config.load();

  waitForElems({
    sel: '.CodeMirror-code',
    onmatch() {
      applySettings(settings);
    }
  });
})();
