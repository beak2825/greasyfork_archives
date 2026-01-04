// ==UserScript==
// @name         Reload other tabs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reload selected tabs on key combination
// @author       Wojciech Duda
// @license      GNU GPLv3
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant         GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_saveTab
// @grant        GM_getTab

// @downloadURL https://update.greasyfork.org/scripts/451594/Reload%20other%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/451594/Reload%20other%20tabs.meta.js
// ==/UserScript==

(function () {
  //IMPORTANT!
  //Here provide a code of the key that is going to reload all selected pages when pushed.
  //To get a key code go to https://www.toptal.com/developers/keycode
  const secondKey = 83;
  //Here decide if you want to combine the key with control key.
  const control = true;

  ("use strict");
  const rtp = "Reload this tab";
  const drtp = "Don't reload this tab";
  const rap = "Reload all tabs";
  const thisid = Math.random();

  class Tab {
    constructor() {
      if (!GM_getValue("rt")) GM_setValue("rt", []);
      this.#globalData = GM_getValue("rt");
      this.#doReload = window.sessionStorage.getItem("doReload") || false;
    }
    get globalData() {
      return this.#globalData;
    }
    set globalData(val) {
      GM_setValue("rt", val);
      this.#globalData = val;
    }
    get doReload() {
      return this.#doReload;
    }
    set doReload(val) {
      window.sessionStorage.setItem("doReload", true);
      this.#doReload = val;
    }
    #globalData;
    #doReload;
  }
  GM_config.init({
    id: "maincfg",
    fields: {
      key: {
        label: "Code of key to press. Check on https://www.toptal.com/developers/keycode",
        type: "number",
        default: "83",
      },
      useControl: {
        label: "Combine with control?",
        type: "checkbox",
        default: "true",
      },
    },
  });

  const tab = new Tab();

  let rtpid, drtpid;

  function toggleMenu() {
    tab.doReload = !tab.doReload;
    setMenu();
  }

  function setMenu() {
    if (tab.doReload) {
      let newTabs = tab.globalData;
      newTabs = newTabs.splice(newTabs.indexOf(thisid), 1);
      drtpid = GM_registerMenuCommand(drtp, toggleMenu);
      GM_unregisterMenuCommand(rtpid);
      tab.globalData = newTabs;
    } else {
      let newTabs = tab.globalData;
      newTabs.push(thisid);
      rtpid = GM_registerMenuCommand(rtp, toggleMenu);
      GM_unregisterMenuCommand(drtpid);
      tab.globalData = newTabs;
    }
  }

  function reloadAll() {
    GM_setValue("reloadTrigger", Math.random());
  }

  function showConfig(){
    GM_config.open();
    const el = document.createElement('style');
    document.head.appendChild(el);
    document.getElementById('maincfg').style +=`height: 45vh !important;
    position: fixed;
    top: 50%;
    width: 40vw;
    left: 50%;
    opacity: 1;
    display: block;`;
  }

  GM_addValueChangeListener("reloadTrigger", () => {
    if (tab.doReload) location.reload();
  });



  GM_registerMenuCommand(rap, reloadAll);
  GM_registerMenuCommand(
    "Config",
    showConfig
  );
  setMenu(tab.doReload);

  window.addEventListener(
    "keydown",
    /**
     *
     * @param {KeyboardEvent} e
     */
    (e) => {
      if (e.keyCode === GM_config.get('key') && e.ctrlKey === GM_config.get('useControl')) reloadAll();
    }
  );
})();
