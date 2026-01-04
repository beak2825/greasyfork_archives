// ==UserScript==
// @name         Torn Crimes 2.0 Helper
// @namespace    https://torn5k.com
// @version      1.0.0
// @description  Simple helper for crimes 2.0. Adds links to guides for each crime, quick buy link for materials/enhancers and crime chain counter.
// @author       TiltGod5000
// @license      MIT
// @match        https://www.torn.com/loader.php?sid=crimes*
// @match        https://www.torn.com/page.php?sid=crimes*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/516719/Torn%20Crimes%2020%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/516719/Torn%20Crimes%2020%20Helper.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(function () {
  'use strict';
  const svgs = {
    refresh: `<?xml version="1.0" ?><svg fill="#000000" width="800px" height="800px" viewBox="-0.5 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m23.314 8.518v-7.832l-2.84 2.84c-2.172-2.176-5.175-3.522-8.493-3.522-6.627 0-12 5.373-12 12s5.373 12 12 12c4.424 0 8.289-2.394 10.37-5.958l.031-.057-2.662-1.536c-1.57 2.695-4.447 4.478-7.739 4.478-4.93 0-8.927-3.997-8.927-8.927s3.997-8.927 8.927-8.927c2.469 0 4.704 1.002 6.32 2.622l-2.82 2.82h7.834z"/></svg>`,
    guide: `<?xml version="1.0" encoding="utf-8"?><svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><g><path d="M12.75 1a.75.75 0 000 1.5h.69l-1.97 1.97a.75.75 0 001.06 1.06l1.97-1.97v.69a.75.75 0 001.5 0v-2.5a.75.75 0 00-.75-.75h-2.5z"/><path fill-rule="evenodd" d="M1.25 2C.56 2 0 2.56 0 3.25v8.5C0 12.44.56 13 1.25 13H5c.896 0 1.475.205 1.809.448.317.23.441.51.441.802a.751.751 0 101.5 0c0-.292.124-.572.441-.802.334-.243.913-.448 1.809-.448h3.75c.69 0 1.25-.56 1.25-1.25v-4.5a.75.75 0 00-1.5 0v4.25H11c-.878 0-1.64.158-2.25.467v-6.55c0-.788.376-1.42 1.12-1.722a.75.75 0 00-.561-1.39 3.27 3.27 0 00-1.31.941A3.13 3.13 0 007.773 3C7.106 2.354 6.154 2 5 2H1.25zm6 3.417c0-.553-.187-1.015-.522-1.34C6.394 3.753 5.846 3.5 5 3.5H1.5v8H5c.878 0 1.64.158 2.25.467v-6.55z" clip-rule="evenodd"/></g></svg>`,
  };
  const styles = `
    .enhancer-info > a {
      color: red;
      text-decoration: none;
      padding-left: 1rem;
    }
  
    .apiKeyModal {
      position: fixed;
      top: 50px;
      left: 50px;
      width: 400px;
      background-color: #1a1a1a;
      color: #fff;
      border-radius: 0.6rem;
      border: 1px solid #fff;
      box-shadow: 0 0 10px 0 #000;
      display: flex;
      flex-direction: column;
      padding: 1rem 2rem;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      gap: 1rem;
    }
    .apiKeyModal .modal-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .apiKeyModal input {
      width: 100%;
      padding: .5rem;
    }
    .apiKeyModal button {
      background-color: buttonface;
    }
    .crime-chain svg {
      width: .75rem;
      height: .75rem;
      fill: #fff;
    }
    .crime-chain.spinning svg {
      animation: rotate 1s linear infinite;
    }
    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    `;

  const styleSheet = document.createElement('style');
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
  const crimeHeader = document.querySelector('.crimes-app');
  const crimeLink = crimeHeader.querySelector('[class*="link_"]');
  const crimeLinkClass = [...crimeLink.classList].find((className) => className.startsWith('link'));
  const crimeChainElement = document.createElement('div');
  let currentEnhancer = null;
  let crimeChainStore = JSON.parse(localStorage.getItem('crimeChain')) || {
    apiKey: null,
    chain: 0,
    lastCritical: null,
    lastTimeStamp: null,
  };

  const crimeDirectory = new Map([
    [
      'searchforcash',
      {
        title: '[Crimes 2.0] Search For Cash: An In-Depth Guide',
        url: 'https://www.torn.com/forums.php#/p=threads&f=61&t=16343473',
        enhancer: 564,
      },
    ],
    [
      'bootlegging',
      {
        title: '[Crimes 2.0] Bootlegging: An in-depth guide',
        url: 'https://www.torn.com/forums.php#/p=threads&f=61&t=16341811',
        enhancer: 565,
      },
    ],
    [
      'graffiti',
      {
        title: '[Crimes 2.0] Graffiti: An In-Depth Guide',
        url: 'https://www.torn.com/forums.php#/p=threads&f=61&t=16344567',
        enhancer: 979,
      },
    ],
    [
      'shoplifting',
      {
        title: '[Crimes 2.0] Shoplifting: An In-Depth Guide',
        url: 'https://www.torn.com/forums.php#/p=threads&f=61&t=16346491',
        enhancer: 566,
      },
    ],
    [
      'cardskimming',
      {
        title: '[Crimes 2.0] Card Skimming: An In-Depth Guide',
        url: 'https://www.torn.com/forums.php#p=threads&f=61&t=16350490',
        enhancer: 578,
      },
    ],
    [
      'burglary',
      {
        title: '[Crimes 2.0] Burglary: An In-Depth Guide',
        url: 'https://www.torn.com/forums.php#p=threads&f=61&t=16353303',
        enhancer: 1351,
      },
    ],
    [
      'pickpocketing',
      {
        title: '[Crimes 2.0] Pickpocketing: An In-Depth Guide',
        url: 'https://www.torn.com/forums.php#/p=threads&f=61&t=16358739',
        enhancer: 567,
      },
    ],
    [
      'hustling',
      {
        title: '[Crimes 2.0] Hustling: An In-Depth Guide',
        url: 'https://www.torn.com/forums.php#/p=threads&f=61&t=16363421',
        enhancer: 1353,
      },
    ],
    [
      'disposal',
      {
        title: '[Crimes 2.0] Disposal: An In-Depth Guide',
        url: 'https://www.torn.com/forums.php#/p=threads&f=61&t=16367936',
        enhancer: 633,
      },
    ],
    [
      'cracking',
      {
        title: '[Crimes 2.0] Cracking: An In-Depth Guide',
        url: 'https://www.torn.com/forums.php#/p=threads&f=61&t=16373016',
        enhancer: 1354,
      },
    ],
    [
      'forgery',
      {
        title: '[Crimes 2.0] Forgery: An In-Depth Guide',
        url: 'https://www.torn.com/forums.php#/p=threads&f=61&t=16388086',
        enhancer: 1346,
      },
    ],
    [
      'scamming',
      {
        title: '[Crimes 2.0] Scamming: An In-Depth Guide',
        url: 'https://www.torn.com/forums.php#/p=threads&f=61&t=16418415',
        enhancer: 571,
      },
    ],
  ]);

  if (typeof window.interceptFetch === 'undefined' && !document.querySelector('#tt-page-status')) {
    // torntools probably not installed
    function interceptFetch(channel) {
      const oldFetch = window.fetch;
      window.fetch = function () {
        return new Promise((resolve, reject) => {
          oldFetch
            .apply(this, arguments)
            .then(async (response) => {
              const page = response.url.substring(
                response.url.indexOf('torn.com/') + 'torn.com/'.length,
                response.url.indexOf('.php')
              );
              let json = {};
              try {
                json = await response.clone().json();
              } catch {}

              const detail = {
                page,
                json,
                fetch: {
                  url: response.url,
                  status: response.status,
                },
              };

              window.dispatchEvent(
                new CustomEvent(channel, {
                  detail,
                })
              );

              resolve(response);
            })
            .catch((error) => {
              reject(error);
            });
        });
      };
    }
    interceptFetch('tt-fetch');
  }

  async function calculateCrimeChain(fromLastCritical = false, manual = false) {
    const fetchLog = async ({ from, to } = {}) => {
      const params = new URLSearchParams({
        selections: 'log',
        cat: '136',
        key: crimeChainStore.apiKey,
        comment: 'Crime Chain Counter',
      });
      if (from) {
        params.set('from', from);
      } else if (to) {
        params.set('to', to);
      }
      return await fetch(`https://api.torn.com/user/?${params.toString()}`)
        .then((res) => res.json())
        .then(({ log }) => Object.entries(log).map(([, logData]) => logData));
    };

    let crimeChain = 0;
    let lastLog = null;
    let logData = await fetchLog({
      from: manual ? undefined : fromLastCritical ? crimeChainStore.lastCritical : crimeChainStore.lastTimeStamp - 1,
    });
    /*
      I want to avoid an infinite loop like while(true) here to avoid crashing anything/running
      into issues with rate limits. Highly unlikely scenario, but using while(true) just feels wrong.
      */
    for (let i = 0; i < 30; i++) {
      if (logData.length === 0 || logData.some(({ title }) => title.startsWith('Crime critical'))) {
        break;
      }
      logData = logData.concat(await fetchLog({ to: logData.at(-1).timestamp - 1 }));
    }
    for (let i = logData.length; i > 0; i--) {
      const log = logData[i - 1];
      const { title } = log;
      if (title.startsWith('Crime critical')) {
        crimeChain = 0;
      } else if (title.startsWith('Crime success')) {
        crimeChain++;
      } else if (title.startsWith('Crime fail')) {
        crimeChain /= 2;
      }
      lastLog = log;
    }
    return { crimeChain, lastLog };
  }

  async function fetchCrimeLog(manual = false) {
    if (!crimeChainStore.apiKey && manual) return apiKeyModal();
    if (!crimeChainStore.apiKey) return;
    if (!manual && crimeChainStore.lastTimeStamp < Date.now() / 1000 - 60 * 5) return;
    crimeChainElement.classList.add('spinning');
    const { crimeChain, lastLog } = await calculateCrimeChain(manual);
    crimeChainStore.chain = crimeChain;
    crimeChainStore.lastTimeStamp = lastLog.timestamp - 1;
    if (lastLog.log === 9154) {
      crimeChainStore.lastCritical = lastLog.timestamp - 1;
    }
    localStorage.setItem('crimeChain', JSON.stringify(crimeChainStore));
    syncCrimeChain();
    crimeChainElement.classList.remove('spinning');
  }

  function apiKeyModal() {
    const modal = document.createElement('div');
    modal.classList.add('apiKeyModal');
    modal.innerHTML = `
        <p>To accurately display your crime chain, please provide a <b>FULL</b> API key</p>
        <input type="text" placeholder="API Key" />
        <div class="modal-buttons">
          <button type="submit">Submit</button>
          <button>Close</button>
        </div>
      `;
    document.body.appendChild(modal);
    [...modal.querySelectorAll('button')].forEach((button) => {
      button.onclick = () => {
        if (button.type === 'submit') {
          const apiKey = modal.querySelector('input').value;
          if (apiKey) {
            crimeChainStore.apiKey = apiKey;
            localStorage.setItem('crimeChain', JSON.stringify(crimeChainStore));
            fetchCrimeLog(true);
          }
        }
        modal.remove();
      };
    });
  }

  function syncCrimeChain() {
    const refreshButton = document.createElement('button');
    refreshButton.innerHTML = svgs.refresh;
    refreshButton.onclick = () => fetchCrimeLog(true);
    crimeChainElement.textContent = `Current Crime Chain: ${crimeChainStore.chain.toFixed(2)}`;
    crimeChainElement.appendChild(refreshButton);
  }

  function addCrimeChain() {
    crimeChainElement.classList.add('crime-chain');
    crimeHeader.insertBefore(crimeChainElement, document.querySelector('.crimes-app > hr'));
    syncCrimeChain();
  }

  function addLinksToRequiredItems(target) {
    [...target.querySelectorAll('div > [class*="silhouette_"] > img')].forEach((img) => {
      const itemId = /items\/(\d+)/.exec(img.src)[1];
      const linkElement = document.createElement('a');
      linkElement.href = `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${itemId}`;
      linkElement.target = '_blank';
      linkElement.innerHTML = img.outerHTML;
      img.outerHTML = linkElement.outerHTML;
    });
  }

  function addGuideLink() {
    const crimeLocation = window.location.hash.slice(2);
    const guideLink = crimeHeader.querySelector('.guide-link');
    if (crimeLocation === '') {
      guideLink?.remove();
    }
    const crime = crimeDirectory.get(crimeLocation);
    if (crime) {
      const crime = crimeDirectory.get(crimeLocation);

      const urlElement = document.createElement('a');
      urlElement.target = '_blank';
      urlElement.classList.add(crimeLinkClass);
      urlElement.classList.add('guide-link');
      urlElement.setAttribute('data-crime-name', crimeLocation);
      urlElement.innerHTML = `${svgs.guide} ${crime.title}`;
      urlElement.href = crime.url;
      if (!guideLink) {
        const headerElement = crimeHeader.querySelector('.crimes-app-header');
        headerElement.insertBefore(urlElement, headerElement.querySelector('a'));
      } else if (guideLink.getAttribute('data-crime-name') !== crimeLocation) {
        guideLink.outerHTML = urlElement.outerHTML;
      }
    }
  }

  function addEnhancerInfo() {
    const crimeTitle = document.querySelector('.crime-root [class*="title__"]');
    const crimeLocation = window.location.hash.slice(2);
    const crime = crimeDirectory.get(crimeLocation);
    if (crimeTitle && !crimeTitle.classList.contains('enhancer-info') && crime) {
      crimeTitle.classList.add('enhancer-info');
      if (!currentEnhancer?.available) {
        crimeTitle.innerHTML = `${crimeTitle.innerText} <a href="https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${crime.enhancer}" target="_blank">${currentEnhancer.name} NOT AVAILABLE</a>`;
      } else {
        crimeTitle.innerHTML = `${crimeTitle.innerText} ✅`;
      }
    }
  }

  const crimeHeaderObserver = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.target.classList.contains('crimes-app-header')) {
        addGuideLink();
      }
      if (
        mutation.addedNodes[0]?.classList &&
        [...mutation.addedNodes[0]?.classList].some((className) => className.startsWith('crimeSlider__'))
      ) {
        addEnhancerInfo();
      }
      addLinksToRequiredItems(mutation.target);
    }
  });

  crimeHeaderObserver.observe(crimeHeader, {
    childList: true,
    subtree: true,
  });

  addGuideLink();
  addCrimeChain();
  fetchCrimeLog();
  window.addEventListener('tt-fetch', ({ detail }) => {
    const enhancer = detail?.json?.DB?.currentUserStats?.enhancer;
    if (enhancer) {
      currentEnhancer = enhancer;
    }
    const crimeOutcome = detail?.json?.DB?.outcome?.result;
    const ID = detail?.json?.DB?.outcome?.ID;
    if (crimeOutcome) {
      if (crimeOutcome === 'success') {
        crimeChainStore.chain++;
      } else if (crimeOutcome === 'failure') {
        crimeChainStore.chain /= 2;
      } else if (crimeOutcome === 'critical failure' && ID !== null) {
        // needs verification
        crimeChainStore.chain = 0;
      }
      localStorage.setItem('crimeChain', JSON.stringify(crimeChainStore));
      syncCrimeChain();
    }
  });
})();
