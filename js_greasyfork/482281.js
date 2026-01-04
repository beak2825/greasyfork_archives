// ==UserScript==
// @name         TORN: Halp! Hook
// @namespace    http://torn.city.com.dot.com.com
// @version      0.0.2
// @description  Pings IHD discord server when your life goes down
// @author       IronHydeDragon[2428902]
// @match        https://www.torn.com/*
// @license      MIT
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/482281/TORN%3A%20Halp%21%20Hook.user.js
// @updateURL https://update.greasyfork.org/scripts/482281/TORN%3A%20Halp%21%20Hook.meta.js
// ==/UserScript==

//////// USER SETTINGS ////////

const userSettings = {
  pingSleepTime: 30, // [seconds] How long should the script wait before pinging you again
};

//////// GETTERS AND SETTERS ////////

async function loadDisplayedLife() {
  const lifeEl = await requireElement('.life___PlnzK .bar-value___NTdce');
  setLifeState(lifeEl.childNodes[0].textContent);
}

function setLifeState(number) {
  localStorage.setItem('halpLife', JSON.stringify(number));
}

function getLifeState() {
  return JSON.parse(localStorage.getItem('halpLife')) || undefined;
}

function setLastPing(timestamp) {
  localStorage.setItem('halpLastPing', JSON.stringify(timestamp));
}
function getLastPing() {
  return JSON.parse(localStorage.getItem('halpLastPing')) || undefined;
}

//////// UTIL FUNCTIONS /////////

async function requireElement(selectors, conditionsCallback) {
  try {
    return await new Promise((res, rej) => {
      maxCycles = 500;
      let current = 1;
      const interval = setInterval(() => {
        if (document.querySelector(selectors)) {
          if (conditionsCallback === undefined) {
            clearInterval(interval);
            return res(document.querySelector(selectors));
          }
          if (conditionsCallback(document.querySelector(selectors))) {
            clearInterval(interval);
            return res(document.querySelector(selectors));
          }
        }
        if (current === maxCycles) {
          clearInterval(interval);
          rej(false);
        }
        current++;
      }, 10);
    });
  } catch (err) {
    console.error(err);
  }
}

//////// WEBHOOKS ////////
// <@397041894972194817>

const whUrl =
  'https://discord.com/api/webhooks/1184811578177093672/hhMHjC4-DW1ebnI6nJNoQ7J7GYJ3zL70OtOk6FirvcvcGo5A8zbdOwK1hhwFixyjAfcn';

const GM_xmlOptions = {
  url: whUrl,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  data: JSON.stringify({
    username: 'PingWebhookPing',
    content: `<@911922372985098240> Your being ATTACKED!!!\n\n**[STASH THE CASH](https://www.torn.com/companies.php?step=your&type=1#/option=funds)**`,
    allowed_mentions: {
      parse: ['users', 'roles'],
    },
  }),
  onload: async (res) => console.log('Ping Sent'),
};

// async function fetchPostWebhook() {
//   const res = await fetch(
//     'https://discord.com/api/webhooks/1184811578177093672/hhMHjC4-DW1ebnI6nJNoQ7J7GYJ3zL70OtOk6FirvcvcGo5A8zbdOwK1hhwFixyjAfcn',
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         username: 'PingWebhookPing',
//         content: `<@911922372985098240> Your being ATTACKED!!!\n\n**[STASH THE CASH](https://www.torn.com/companies.php?step=your&type=1#/option=funds)**`,
//         allowed_mentions: {
//           parse: ['users', 'roles'],
//         },
//       }),
//     }
//   );

//   const data = await res.text();
//   console.log('webhook response: ', data);
//   return data;
// }

async function pingWebhook() {
  try {
    console.log('Halp Ping sending!'); // TEST

    GM_xmlhttpRequest(GM_xmlOptions);

    // await fetchPostWebhook();
  } catch (error) {
    console.error(error);
  }
}

function lifeDrainCallback(mutationList, observer) {
  for (const mutation of mutationList) {
    const lifeState = +getLifeState();
    const curLife = +mutation.target.textContent;

    if (curLife > lifeState) {
      setLifeState(curLife);
    }

    if (curLife < lifeState) {
      setLifeState(curLife);

      if (Date.now() - getLastPing() < userSettings.pingSleepTime * 1000)
        return;

      setLastPing(Date.now());
      pingWebhook();
    }
  }
}

async function lifeObserver() {
  if (!(await requireElement('.life___PlnzK .bar-value___NTdce'))) return;
  const observer = new MutationObserver(lifeDrainCallback);
  observer.observe(document.querySelector('.life___PlnzK .bar-value___NTdce'), {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });
}

(async () => {
  try {
    console.log('🏥 Halp! Hook script is ON!'); // TEST
    await loadDisplayedLife();

    lifeObserver();
  } catch (error) {
    console.error(error);
  }
})();
