// ==UserScript==
// @name         gop3-vip
// @namespace    http://tampermonkey.net/
// @version      3.9.15
// @description  world
// @author       You
// @match        *://www.recaptcha.net/*
// @match        *://auth-live.gop3.nl/*
// @icon         https://auth-live.gop3.nl/images/auth/favicons/favicon-32x32.png
// @grant        GM_getTabs
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        window.close
// @run-at       document-start
// @run-in       normal-tabs
// @sandbox      raw
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512292/gop3-vip.user.js
// @updateURL https://update.greasyfork.org/scripts/512292/gop3-vip.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const install_script = () => {
    window && (window.alert = function () {
      location && location.reload();
      window.location && window.location.reload();
    });
  }

  const documentScript = async () => {
    const s = document.createElement('script');
    s.innerHTML = `(${install_script.toString()})();`;
    document.body.appendChild(s);

    const Sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const getQuery = (name) => {
      const r = new URLSearchParams(window.location.search).get(name);
      if (r != null) return decodeURIComponent(r);
      return null;
    };

    const getTab = () => {
      return new Promise((resolve, reject) => {
        GM_getTab((tab) => {
          resolve(tab);
        });
      });
    };
    const getAllTabs = () => {
      return new Promise((resolve, reject) => {
        GM_getTabs((tabs) => {
          resolve(tabs);
        });
      });
    };
    const tabData = await getTab();
    console.log(`getTab: `, tabData);
    tabData.tabopened = true;
    if (!tabData.tabStartTime) {
      tabData.tabStartTime = Date.now();
    }
    GM_saveTab(tabData);

    getQuery('username') && (tabData.username = getQuery('username'), GM_saveTab(tabData));
    const username = getQuery('username') || tabData.username || '';
    const httpport = 58083;
    console.log(`%c username ${username} | httpport ${httpport}`, 'color: green; font-weight: bold; font-size: 16px;');
    if (username && httpport && location.hostname.indexOf('gop3') > 0) {
      for (let i = 0; i < 3; i++) {
        const tabs = await getAllTabs();
        const startURL = `http://127.0.0.1:${httpport}/recaptcha-start?username=${username}&tabs=${Object.keys(tabs).length}`;
        try {
          const result = await (await fetch(startURL)).json();
          console.log(`%c recaptcha-start ${startURL} ${result}`, 'color: green; font-weight: bold; font-size: 16px;');
          if (result && result.code == 0) {
            break;
          }
        } catch (error) {
          console.error(`%c recaptcha-start ${startURL} ${error.message}`, 'color: red; font-weight: bold;', error);
        }
        await Sleep(300);
      }

      window.addEventListener("message", async (e) => {
        console.log(username, e.data);
        if (e.data === 'recaptcha-finish') {
          await Sleep(1000);
          document.querySelector('button') && document.querySelector('button').click() || console.error('form button not found');
        }
      });

      getQuery('username') && setTimeout(async () => {
        const tabData1 = await getTab();
        if (!tabData1 || !tabData1.recaptcha_loaded) {
          location.reload();
        }
        else {
          console.log('recaptcha_loaded', tabData1.recaptcha_loaded);
        }
      }, 180000);

      while (true) {
        const h2 = document.querySelector('h2');
        if (h2 && h2.innerText === 'ALL DONE!') {
          tabData.username = null;
          GM_saveTab(tabData);

          while (true) {
            const tabs = await getAllTabs();
            const setupURL = `http://127.0.0.1:${httpport}/recaptcha-setup?username=${username}&tabs=${Object.keys(tabs).length}&result=true`;
            try {
              const result = await (await fetch(setupURL)).json();
              console.log(`%c recaptcha-setup ${setupURL} ${result}`, 'color: green; font-weight: bold; font-size: 16px;');
              if (result && result.code == 0) {
                break;
              }
            } catch (error) {
              console.error(`%c recaptcha-setup ${setupURL} ${error.message}`, 'color: red; font-weight: bold;', error);
            }
            await Sleep(3000);
          }
          setTimeout(() => {
            try {
              window.gRECAPTCHA && window.gRECAPTCHA.close();
              window.close();
              location.href = 'about:blank';
            }
            catch (e) {
              console.log(e);
              location.href = 'about:blank';
            }
          }, 3000);
          break;
        }
        else if (Date.now() - parseInt(tabData.tabStartTime) >= 300000) {
          tabData.username = null;
          tabData.tabStartTime = null;
          GM_saveTab(tabData);
          while (true) {
            const tabs = await getAllTabs();
            const setupURL = `http://127.0.0.1:${httpport}/recaptcha-setup?username=${username}&tabs=${Object.keys(tabs).length}&result=false`;
            try {
              const result = await (await fetch(setupURL)).json();
              console.log(`%c recaptcha-setup timeout ${setupURL} ${result}`, 'color: green; font-weight: bold; font-size: 16px;');
              if (result && result.code == 0) {
                break;
              }
            } catch (error) {
              console.error(`%c recaptcha-setup ${setupURL} ${error.message}`, 'color: red; font-weight: bold;', error);
            }
            await Sleep(3000);
          }
          setTimeout(() => {
            try {
              window.gRECAPTCHA && window.gRECAPTCHA.close();
              window.close();
              location.href = 'about:blank';
            }
            catch (e) {
              console.log(e);
              location.href = 'about:blank';
            }
          }, 3000);
          break;
        }
        await Sleep(3000);
      }
    }
    else {
      while (true) {
        const anchor = document.querySelector('#recaptcha-anchor');
        if (anchor) {
          const tabData = await getTab();
          if (tabData && !tabData.recaptcha_loaded) {
            tabData.recaptcha_loaded = true;
            GM_saveTab(tabData);
          }
          const mark = anchor.querySelector('.recaptcha-checkbox-checkmark');
          if (mark && anchor.classList.contains('recaptcha-checkbox-checked')) {
            window.parent && window.parent.postMessage("recaptcha-finish", '*');
            return;
          }
          else if (mark && anchor) {
            console.log('anchor classList', anchor.classList);
          }
        }
        await Sleep(2000);
      }
    }
  };

  window.addEventListener('DOMContentLoaded', async () => {
    // const script = document.createElement('script');
    // script.type = 'text/javascript';
    // script.innerHTML = `(${documentScript.toString()})()`;
    // document.body.appendChild(script);
    await documentScript();
  });

  document.readyState === 'complete' && documentScript();

})();