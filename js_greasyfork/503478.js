// ==UserScript==
// @name        gamescom Epix Tools
// @namespace   Violentmonkey Scripts
// @match       https://discord.com/channels/574865170694799400/1259933715409145966*
// @match       https://www.gamescom.global/*/epix/cards
// @inject-into content
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @version     2.1
// @author      UpDownLeftDie

// @license MIT
// @description Automatically adds all the Epix friends links from the gamescom discord server

// @contributionURL https://www.patreon.com/camkitties
// @supportURL https://discord.gg/hWvWGUDf
// @homepageURL https://greasyfork.org/en/scripts/503478%20gamescom%20epix%20tools

// @downloadURL https://update.greasyfork.org/scripts/503478/gamescom%20Epix%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/503478/gamescom%20Epix%20Tools.meta.js
// ==/UserScript==

let EPIX_IDS = [];
let DISCORD_TOKEN = '';
let EPIX_FRIENDS = [];
let EPIX_BUTTON;


main();
function main() {
  if(location.href.includes('discord.com')) {
    function check(changes, observer) {
      if(document.querySelector('h1')) {
        observer.disconnect();
        discordMain();
      }
    }
  } else {
    function check(changes, observer) {
      if(document.querySelector('.card-list--list-item')) {
        observer.disconnect();
        epixMain();
      }
    }
  }
  (new MutationObserver(check)).observe(document, {childList: true, subtree: true});
}


function epixMain() {
  const mainSection = document.querySelector('section > div');
  const cardsButton = document.createElement('button');
  cardsButton.setAttribute('id', 'loadCardsButton');
  cardsButton.setAttribute('type', 'button');
  cardsButton.textContent = 'Load have/need card lists';

  const screenshotButton = document.createElement('button');
  screenshotButton.setAttribute('id', 'screenshotButton');
  screenshotButton.setAttribute('type', 'button');
  screenshotButton.textContent = 'Show only extra cards';

  const buttonContainer = document.createElement('div');
  buttonContainer.setAttribute('style', 'margin-bottom: 20px; display: flex; justify-content: space-between;');

  buttonContainer.append(cardsButton, screenshotButton)

  mainSection.prepend(buttonContainer);

  document.getElementById("loadCardsButton").addEventListener("click", () => {
    cardsButton.remove();
    epixLoadCards();
  }, false);

  document.getElementById("screenshotButton").addEventListener("click", () => {
    cardsButton.remove();
    screenshotButton.remove();
    document.querySelectorAll('.card-list--list-item').forEach(node => {
      const text = node.textContent;
      if (text === "x1" || !text) {
          node.style.display = "none";
      }
    });
  }, false);
}

async function epixLoadCards() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior:'instant',
  });

  const scrollPercent = 15
  // > -scrollPercent ensure we scroll all the way back to the top
  for(let p = 100; p > -scrollPercent; p -= scrollPercent) {
    await wait(200);
    if (p < 0) p = 0;
    window.scrollTo({
      top: document.body.scrollHeight * (p/100),
      behavior:'smooth',
    });
  }

  const lockedCardSrc = 'KdneecaZTKWwd7aCAkOT';
  let cardsHave = [];
  let cardsNeed = [];
  document.querySelectorAll('.card-list--list-item').forEach(node => {
    const img = node.querySelector('img');
    img.removeAttribute('loading');
  });
  await wait(500);
  document.querySelectorAll('.card-list--list-item').forEach(node => {
    const img = node.querySelector('img');
    const name = img.title;
    if (img.src.includes(lockedCardSrc)) {
      cardsNeed.push(name);
    } else {
      const count = Number(node.textContent.slice(1));
      cardsHave.push({name, count});
    }
  });
  cardsHave.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  cardsNeed.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  const mainSection = document.querySelector('section > div');

  const cardsLists = document.createElement('div');
  cardsLists.setAttribute('class', 'row gx-3 gy-4 g-sm-4');
  cardsLists.setAttribute('style', 'margin-bottom: 25px;')
  cardsLists.innerHTML = `
    <div class="col-6" role="button" tabindex="99">
      Extra Cards:<br />
      <div style="margin-left: 20px;">
        \`${cardsHave.filter(card => card.count > 1).map(card => `${card.name}\` - x${card.count - 1}`).join('<br />`')}
        <p>&nbsp;</p>
      </div>
    </div>
    <div class="col-6" role="button" tabindex="0">
      Cards Need:<br />
      <div style="margin-left: 20px;">
        \`${cardsNeed.join('`<br />`')}\`
      </div>
    </div>
  `;

  mainSection.prepend(cardsLists)
}

function discordMain() {
  EPIX_FRIENDS = [...new Set(GM_getValue('epixFriends') || [])];
  EPIX_IDS = [...new Set(GM_getValue('epixIds') || [])];
  DISCORD_TOKEN = getDiscordToken();
  console.log({EPIX_FRIENDS, EPIX_IDS, DISCORD_TOKEN: !!DISCORD_TOKEN});

  EPIX_BUTTON = document.createElement('button');
  EPIX_BUTTON.setAttribute('id', 'epixButton');
  EPIX_BUTTON.setAttribute('type', 'button');
  EPIX_BUTTON.innerHTML = 'Run Epix Friend Adder';
  document.querySelector('h1').appendChild(EPIX_BUTTON);

  document.getElementById("epixButton").addEventListener("click", handleButton, false);
}

async function handleButton(event) {
  await getEpixIds();

  let count = 0;
  disableButton('Running: added 0');

  let messages = [];
  do {
    const minId = GM_getValue('discordMinId');
    console.log({minId});
    messages = await getDiscordMessages(minId);
    const codes = getEpixCodes(messages);
    console.log({messages, codes});

    for(let i in codes) {
      const promises = EPIX_IDS.map(epixId => connectRequest(epixId, codes[i].code));
      let responses = await Promise.all(promises).catch(err => {
        disableButton("ERROR");
        throw err;
      })
      let json = await responses[0].json();
      let status = json?.data?.status.toUpperCase();

      for(let i in responses) {
        const resp = responses[i];
        console.log({resp})
        if (!resp.ok) {
          if (resp.status === 400 || json?.message?.toLowerCase() === "user not found") {
            status = "USER_NOT_FOUND";
          } else {
            disableButton("ERROR");
            throw resp;
          }
        }
      }

      count++;
      disableButton(`Running: added ${count}`);
      updateFriends(status, codes[i]);
    }
    if (messages.length > 0) {
       GM_setValue('discordMinId', messages[messages.length - 1][0].id);
    }
  } while(messages.length >= 25);


  disableButton("Done!");
}

async function getEpixIds() {
  return new Promise((resolve, reject) => {
    const inputValue = EPIX_IDS?.length ? EPIX_IDS.join(',') : '';
    const dialog = document.createElement('dialog');
    dialog.setAttribute('open', true);
    dialog.setAttribute('id', 'epixIdsDialog')
    dialog.innerHTML = `
      <p>Enter your Epix user id(s) (<strong>NOT the same as your invite id!</strong>)</p>
      To get this go to your <a href="https://www.gamescom.global/en/epix" target="_blank">profile</a>:
        <ol>
          <li>open dev tools</li>
          <li>refresh the page</li>
          <li>look at network requests for "user?userId=XXXXXXX"</li>
        </ol>
      <form method="dialog">
        <label for="epixIds">Epix Id(s):</label>
        <input required id="epixIds" placeholder="b5629b160f555ab4b08ef8e49568b7dd, a49f9b160f555vd4b08ef8e49568b7a2" value="${inputValue}" />
        <label for="discordToken">Discord token:</label>
        <span style="display:flex;">
          <input required id="discordToken" style="flex: 1 0 0;" placeholder="MTMkaJ9HshK2dAx.Fna4Jk.qsKrjSk42jKns9Js32-G3pnH_qcnIskQzy" value="${DISCORD_TOKEN ? DISCORD_TOKEN : ''}" />
          <button id="getDiscordToken" ${!!DISCORD_TOKEN ? "disabled" : null}>Get</button>
        </span>
        <button id="epixIdAddButton" type="submit">START</button>
        <span id="epixError" style="color: red; font-weight: bold;"></span>
      </form>
    `;
    document.body.appendChild(dialog);

    document.getElementById("getDiscordToken").addEventListener("click", (e) => {
      e.preventDefault();

      DISCORD_TOKEN = getDiscordToken();
      document.getElementById("discordToken").value = DISCORD_TOKEN;
    });

    document.getElementById("epixIdAddButton").addEventListener("click", (e) => {
      e.preventDefault();
      const idStr = document.getElementById("epixIds").value;
      const ids = idStr.split(',').reduce((acc, curr) => {
        const id = curr.replace(/\W/gi, '');
        if (!id) return acc;
        acc.push(id);
        return acc;
      }, []);
      EPIX_IDS = ids;

      if(!DISCORD_TOKEN || !EPIX_IDS?.length) {
        document.getElementById("epixError").innerHTML = "ERROR: missing Epix User ID(s) or Discord Token";
        return;
      }

      GM_setValue('epixIds', EPIX_IDS);
      dialog.parentNode.removeChild(dialog);
      resolve();
    }, false);
  });
}

function getEpixCodes(discordMessages) {
  const codes = discordMessages.reduce((acc, curr) => {
    const message = curr[0]
    const matches = message.content.matchAll(/epix-connect=([\w\d]{7})/ig);

    for (const match of matches) {
      if (match?.[1] && !EPIX_FRIENDS.includes(match[1])) {
        acc.push({code: match[1], messageId: message.id});
      }
    }

    return acc;
  }, [])

  return codes;
}


function updateFriends(status, code) {
  if (status === "CONNECTION_SUCCESSFUL" || status === "ALREADY_MATCHED" || status === "USER_NOT_FOUND") {
    EPIX_FRIENDS.push(code.code);
    GM_setValue('epixFriends', EPIX_FRIENDS);
    GM_setValue('discordMinId', code.messageId);
  }

}

/**
 * @param {string} [text] - Button text
 * @returns {null}
 */
function disableButton(text = '') {
  EPIX_BUTTON.toggleAttribute('disabled', true);
  if (text) {
    updateButton(text);
  }
}

/**
 * @param {string} [text] - Button text
 * @returns {null}
 */
function enableButton(text = '') {
  EPIX_BUTTON.toggleAttribute('disabled', false);
  if (text) {
    updateButton(text);
  }
}

/**
 * @param {string} [text] - Button text
 * @returns {null}
 */
function updateButton(text = "Run Epix Friend Adder") {
  EPIX_BUTTON.innerHTML = text;
}


//--- Style our newly added elements using CSS.
GM_addStyle (`
  #epixButton {
    margin-left: 10px;
  }

  #epixIdsDialog {
    position: absolute;
    top: 5rem;
    z-index: 100;
  }
  #epixIdsDialog ol {
    list-style: auto;
    padding-left: 35px;
    margin-bottom: 10px;
  }
  #epixIdsDialog input {
    width: 100%;
  }
  #epixIdsDialog button {
    margin: 5px auto;
    display: block;
    font-size: large;
    background: greenyellow;
    padding: 2px 10px;
  }
`);


async function connectRequest(userId, profileId) {
  return fetch("https://wfppjum4x2.execute-api.eu-central-1.amazonaws.com/production/connection-request", {
    "referrer": "https://www.gamescom.global/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": `{"userId":"${userId}","profileId":"${profileId}"}`,
    "method": "POST",
    "mode": "cors",
    "credentials": "omit"
  });
}


// A lot of this function was adapted from: https://github.com/victornpb/undiscord/blob/master/deleteDiscordMessages.user.js#L652-L712
async function getDiscordMessages(minId) {
  const params = queryString([
    ['limit', 25],
    ['channel_id', '1259933715409145966'],
    ['min_id', minId],
    ['sort_by', 'timestamp'],
    ['sort_order', 'asc'],
    ['has','link'],
  ]);
  let resp;
  try {
    resp = await fetch(`https://discord.com/api/v9/guilds/574865170694799400/messages/search?${params}`, {
      "headers": {
        "accept": "*/*",
        "authorization": DISCORD_TOKEN
      },
      "referrer": "https://discord.com/channels/574865170694799400/1259933715409145966",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    });
  } catch (err) {
    this.state.running = false;
    console.error('Search request threw an error:', err);
    disableButton("ERROR");
    throw err;
  }

  // not indexed yet
  if (resp.status === 202) {
    let w = (await resp.json()).retry_after * 1000 || 30 * 1000;
    console.warn(`This channel isn't indexed yet. Waiting ${w}ms for discord to index it...`);
    await wait(w);
    return await getDiscordMessages(minId);
  }

  if (!resp.ok) {
    // searching messages too fast
    if (resp.status === 429) {
      let w = (await resp.json()).retry_after * 1000 || 30 * 1000;
      console.warn(`Being rate limited by the API for ${w}ms! Increasing search delay...`);
      console.warn(`Cooling down for ${w * 2}ms before retrying...`);

      await wait(w * 2);
      return await getDiscordMessages(minId);
    } else {
      console.error(`Error searching messages, API responded with status ${resp.status}!\n`, await resp.json());
      disableButton("ERROR");
      throw resp;
    }
  }

  const data = await resp.json();
  return data.messages;
}

function getDiscordToken() {
  window.dispatchEvent(new Event('beforeunload'));
  const LS = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;
  try {
    return JSON.parse(LS.token);
  } catch {
    console.info('Could not automatically detect Authorization Token in local storage!');
    console.info('Attempting to grab token using webpack');
    return (window.webpackChunkdiscord_app?.push([[''], {}, e => { window.m = []; for (let c in e.c) window.m.push(e.c[c]); }]), window.m)?.find(m => m?.exports?.default?.getToken !== void 0).exports.default.getToken();
  }
}


const wait = async ms => new Promise(done => setTimeout(done, ms));
const queryString = params => params.filter(p => p[1] !== undefined).map(p => p[0] + '=' + encodeURIComponent(p[1])).join('&');