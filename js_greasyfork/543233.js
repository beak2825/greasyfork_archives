// ==UserScript==
// @name         CrossChatter
// @namespace    TurtleCrossChatter
// @version      3.1
// @description  enable cross-user profile notes
// @author       Jeyno
// @match        https://www.torn.com/profiles.php?*
// @match        https://www.torn.com/factions.php?step=your*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      raw.githubusercontent.com
// @connect      api.github.com
// @connect      jolly-dust-aada.jenova-fode.workers.dev
// @downloadURL https://update.greasyfork.org/scripts/543233/CrossChatter.user.js
// @updateURL https://update.greasyfork.org/scripts/543233/CrossChatter.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const intervalTime = 100;
      let elapsedTime = 0;

      const interval = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(interval);
          resolve(el);
        }
        elapsedTime += intervalTime;
        if (elapsedTime >= timeout) {
          clearInterval(interval);
          reject(new Error(`Timeout waiting for element: ${selector}`));
        }
      }, intervalTime);
    });
  }

  // ————————— CONFIG —————————
  const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/Jeyn-o/BC_CrossChatter/main/LOG.JSON';
  const GITHUB_API_URL = 'https://api.github.com/repos/Jeyn-o/BC_CrossChatter/contents/LOG.JSON';

  // Variables to hold usernames
  let selfUserName = null;
  let pageUserName = null;

  // —————— Utility HTTP Helpers ——————
function getJSON() {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'POST',
      url: 'https://jolly-dust-aada.jenova-fode.workers.dev/fetch',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CrossChatterScript'
      },
      data: JSON.stringify({
        url: 'https://api.github.com/repos/Jeyn-o/BC_CrossChatter/contents/LOG.JSON'
      }),
      onload: r => {
        if (r.status >= 200 && r.status < 300) {
          const res = JSON.parse(r.responseText);
          const content = JSON.parse(decodeURIComponent(escape(atob(res.content))));
          resolve(content);
        } else {
          reject('Proxy GET failed ' + r.status + ' ' + r.responseText);
        }
      },
      onerror: reject
    });
  });
}




  let latestSha = null;
  function getSha() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: GITHUB_API_URL,
        onload: r => {
          if (r.status >= 200 && r.status < 300) {
            const j = JSON.parse(r.responseText);
            latestSha = j.sha;
            resolve(j.sha);
          } else {
            reject('Fetch SHA failed: ' + r.status);
          }
        },
        onerror: reject
      });
    });
  }



function putJSON(obj) {
  return new Promise((resolve, reject) => {
    const body = {
      message: "CrossChatter update on pageUser " + pageUserName,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(obj, null, 2)))),
      sha: latestSha
    };

    GM_xmlhttpRequest({
      method: 'POST',
      url: 'https://jolly-dust-aada.jenova-fode.workers.dev/put',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(body),
      onload: r => {
        if (r.status >= 200 && r.status < 300) {
          resolve(JSON.parse(r.responseText));
        } else {
          reject('Proxy PUT failed ' + r.status + ' ' + r.responseText);
        }
      },
      onerror: e => reject(e)
    });
  });
}






  async function tryPutJSON(data, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await getSha(); // get the latest sha before each try
      return await putJSON(data); // try to PUT
    } catch (err) {
      if (err.toString().includes('409') && i < retries - 1) {
        console.warn('409 conflict detected, retrying attempt #' + (i + 1)); //kill myself if this keeps bugging out
        continue; // retry
      }
      throw err; // rethrow other errors or after last retry
    }
  }
}


  // ————————— Extract usernames —————————
  function parseSelfName() {
    const inp = document.querySelector('#torn-user');
    if (!inp) return null;
    try {
      const obj = JSON.parse(inp.value);
      return obj.playername;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  function parsePageName() {
    const ul = document.querySelector('ul.info-table');
    if (!ul) return null;

    const firstLi = ul.querySelector('li');
    if (!firstLi) return null;

    const secondDiv = firstLi.querySelector('div:nth-child(2)');
    if (!secondDiv) return null;

    const span = secondDiv.querySelector('span');
    if (!span) return null;

    const match = span.textContent.match(/\[(\d+)\]/);
    if (match) {
      return match[1];
    }
    return null;
  }

// ————————— Build UI —————————
function makeChatterBox() {
    const wrapper = document.createElement('div');
    wrapper.id = 'CrossChatter';
    wrapper.className = 'collapsible rounding mt10';
    wrapper.innerHTML = `
    <div class="Crosstitle title title-black top-round">
      <div class="text">CrossChatter</div>
    </div>
    <main class="background cont-gray bottom-round">
      <div id="CrossChatterLog" style="padding:5px"></div>
      <div id="CrossChatterBox" contenteditable="true" style="min-height:20px; border:1px solid #ccc; padding:5px;margin:0 5px"></div>

      <div style="display:flex; justify-content:space-between; align-items:center; padding:0 5px;">
        <!-- Left-aligned -->
        <select id="statusSelect" style="min-width:90px;border-radius:5px;">
          <option value="">No status</option>
          <option value="GreatMember">Great member</option>
          <option value="Suspicious">Suspicious</option>
          <option value="MonitorClosely">Monitor closely</option>
          <option value="WarningGiven">Warning given</option>
          <option value="MultipleWarningsGiven">Multiple warnings given</option>
          <option value="OnThinIce">On thin ice</option>
          <option value="WelcomeToReApply">Welcome to re-apply</option>
          <option value="Banished">Banished</option>
        </select>

        <!-- Right-aligned -->
        <div style="display:flex; align-items:center; gap:10px;">
          <div id="submitWarning" style="color:red; font-weight:bold; min-width:120px;">
            <h7 style="color:teal">Submitted changes can take up to a minute to appear</h7>
          </div>
          <button style="width:95px;background-color:white;border:1px solid black; position:relative;border-radius:5px;margin:2px 0" id="CrossChatterSubmit">Submit</button>
          <div id="submitLoader" class="loader___FO798 loader_7___blv7D" style="display:none; width:20px; height:20px;"></div>
        </div>
      </div>
    </main>`;

    const container = document.querySelector('div.profile-wrapper');
    container && container.after(wrapper);

    // Collapse toggle logic
    const titleDiv = wrapper.querySelector('.Crosstitle');
    const main = wrapper.querySelector('main');

    const STATE_KEY = 'CrossChatter_collapsed';
    const collapsed = GM_getValue(STATE_KEY, false);
    if (collapsed) main.style.display = 'none';

    titleDiv.addEventListener('click', () => {
      const isCollapsed = main.style.display === 'none';
      main.style.display = isCollapsed ? '' : 'none';
      GM_setValue(STATE_KEY, !isCollapsed);
    });

    return {
      log: wrapper.querySelector('#CrossChatterLog'),
      box: wrapper.querySelector('#CrossChatterBox'),
      button: wrapper.querySelector('#CrossChatterSubmit'),
      statusSelect: wrapper.querySelector('#statusSelect') // Dropdown reference
    };
}




  // Main logic
  async function startScript() {
    selfUserName = parseSelfName();
    pageUserName = parsePageName();

    if (!selfUserName) {
      console.error('Could not find selfUserName.');
      return;
    }
    if (!pageUserName) {
      console.error('Could not find pageUserName.');
      return;
    }

    const elements = makeChatterBox();

async function refresh() {
    try {
        const data = await getJSON();
        const allEntries = data[pageUserName] || {};
        let myEntry = '';
        elements.log.innerHTML = ''; // Clear log before repopulating

        Object.entries(allEntries).forEach(([submitter, value]) => {
            if (submitter === selfUserName) {
                myEntry = value;
            } else if (submitter !== 'Profile note') {
                const div = document.createElement('div');
                div.innerHTML = `<strong>${submitter}:</strong> <pre style="margin:0;">${value}</pre>`;
                div.style.padding = '5px 0';
                elements.log.appendChild(div);
            }
        });

        elements.box.innerText = myEntry;

        // Set dropdown to saved status (Profile note)
        const savedStatus = allEntries["Profile note"] || "";
        if (elements.statusSelect) {
            elements.statusSelect.value = savedStatus;
        }
    } catch (e) {
        console.error(e);
    }
}




elements.button.addEventListener('click', async () => {
    const text = elements.box.innerText.trim();
    const status = elements.statusSelect.value;

    let warning = document.getElementById('submitWarning');
    if (!warning) {
        warning = document.createElement('div');
        warning.id = 'submitWarning';
        warning.style.color = 'red';
        warning.style.marginRight = '10px';
        warning.style.alignSelf = 'center';
        elements.button.parentNode.insertBefore(warning, elements.button);
    }
    warning.style.display = 'none';

    const originalText = elements.button.textContent;
    elements.button.textContent = 'Please wait...';
    elements.button.disabled = true;

    try {
        const data = await getJSON();
        const pageObj = data[pageUserName] || {};

        // Update or remove the current user's note
        if (!text) {
            delete pageObj[selfUserName];
        } else {
            pageObj[selfUserName] = text;
        }

        // Add or remove status
        if (status) {
            pageObj["Profile note"] = status;
        } else {
            delete pageObj["Profile note"];
        }

        // Clean up empty entry
        if (Object.keys(pageObj).length) {
            data[pageUserName] = pageObj;
        } else {
            delete data[pageUserName];
        }

        await tryPutJSON(data);

        warning.style.display = 'none';
    } catch (e) {
        console.error(e);
        warning.textContent = 'Submit failed: ' + (e.message || e);
        if (typeof e === 'object') {
            warning.textContent = 'Submit failed: ' + JSON.stringify(e);
        }

        warning.style.display = 'inline-block';
    } finally {
        elements.button.textContent = "Success!";
        setTimeout(() => {
            elements.button.textContent = originalText;
            elements.button.disabled = false;
        }, 3000);
    }
});

    await refresh();
  }

  if (window.location.href.startsWith('https://www.torn.com/profiles.php')) {
  try {
    await waitForElement('ul.info-table');
    startScript();
  } catch (e) {
    console.error('Element timeout:', e);
  }
  }//end user page
  else if (window.location.href.includes('option=application')) {
  async function markUsersWithChatter() {
    const container = document.querySelector('.rowsWrapper___RuEaw');
    if (!container) return;

    const rows = container.querySelectorAll('.rowWrapper___UyTAC');
    if (!rows.length) return;

    let data;
    try {
      data = await getJSON();
    } catch (e) {
      console.error('Failed to fetch JSON for chatter marks:', e);
      return;
    }

    rows.forEach(row => {
      const tableRow = row.querySelector('.tableRow___G42km');
      const cell = tableRow?.querySelector('.tableCell___lm2Uc ');
      const userInfo = cell?.querySelector('.userInfoBox___LRjPl');
      const honorWrap = userInfo?.querySelector('.honorWrap___BHau4');
      const profileLink = honorWrap?.querySelector('a.linkWrap___ZS6r9.flexCenter___bV1QP');

      if (!profileLink) return;

      const urlParams = new URLSearchParams(profileLink.href.split('?')[1]);
      const xid = urlParams.get('XID');

      if (xid && data[xid]) {
        tableRow.style.border = '2px dashed gold';
        tableRow.title = 'This user has CrossChatter entries';
      }
    });
  }
  setTimeout(markUsersWithChatter, 2000);
  }//end application page

})();
