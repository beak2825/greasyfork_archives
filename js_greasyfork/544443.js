// ==UserScript==
// @name         OC Stalker Frontend PDA Compat
// @namespace    TurtleOCStalker2PDA
// @version      2.2-1
// @description  Fetch OC & user activity info from GitHub and append info in OC tab. Now with PDA compatability.
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @connect      api.github.com
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/544443/OC%20Stalker%20Frontend%20PDA%20Compat.user.js
// @updateURL https://update.greasyfork.org/scripts/544443/OC%20Stalker%20Frontend%20PDA%20Compat.meta.js
// ==/UserScript==

(async function () {
  'use strict';
  const TOOLTIP_MODE = 2; // 1 = short, 2 = detailed
  let viewmode;

  const OC_JSON_URL = 'https://raw.githubusercontent.com/Jeyn-o/OC_Stalker/main/BC_OC.JSON';
  const BC_JSON_URL = 'https://raw.githubusercontent.com/Jeyn-o/OC_Stalker/main/BC_cron.JSON';

  function fetchJson(url) {
  // Use Tampermonkey's GM_xmlhttpRequest if available (bypasses CORS/CSP)
  if (typeof GM_xmlhttpRequest !== 'undefined') {
    viewmode="desktop";
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        headers: { Accept: 'application/json' },
        onload(res) {
          if (res.status >= 200 && res.status < 300) {
            try { resolve(JSON.parse(res.responseText)); }
            catch (err) { reject(`Parse error ${url}: ${err}`); }
          } else reject(`HTTP ${res.status} for ${url}`);
        },
        onerror() { reject(`Network error for ${url}`); }
      });
    });
  }

  // Fall back to fetch if not in Tampermonkey — note this may still fail due to CSP
  return fetch(url, {
    headers: { 'Accept': 'application/json' }
  }).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }
    return response.json();
    viewmode="phone";
  }).catch(error => {
    throw new Error(`Network or parse error for ${url}: ${error}`);
  });
}


  function formatDate(ts) {
    const d = new Date((ts - 3600) * 1000);
    return d.toLocaleString('en-GB', { timeZone: 'Europe/London', hour12: false });
  }

  function waitFor(selector, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      const obs = new MutationObserver(() => {
        const e = document.querySelector(selector);
        if (e) { obs.disconnect(); resolve(e); }
      });
      obs.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => { obs.disconnect(); reject(`Timeout ${selector}`); }, timeout);
    });
  }

function createTimeline(ocData, BC, containerWrapper) {
  function shortFormat(ts) {
    const d = new Date((ts - 3600) * 1000);
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      day: '2-digit', month: '2-digit',
      hour: '2-digit', minute: '2-digit',
      hour12: false
    }).formatToParts(d);
    const day = `${parts.find(p => p.type === 'day').value}.${parts.find(p => p.type === 'month').value}`;
    const month = parts.find(p => p.type === 'month').value;
    const hour = parts.find(p => p.type === 'hour').value;
    const minute = parts.find(p => p.type === 'minute').value;
    return { day, time: `${hour}:${minute}`, text: `${day} ${hour}:${minute}` };
}


  function shortDay(ts) {
    const d = new Date((ts - 3600) * 1000);
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London', day: '2-digit', month: '2-digit'
    }).format(d);
  }

const container = document.createElement('div');
container.style.fontFamily = 'sans-serif';
// if(viewmode=="phone") {container.width = '400px'}; //phoneWIP

const toggleWrapper = document.createElement('div');
toggleWrapper.style.marginBottom = '8px';

const toggleLabel = document.createElement('label');
toggleLabel.style.userSelect = 'none';

const toggleCheckbox = document.createElement('input');
toggleCheckbox.type = 'checkbox';
toggleCheckbox.style.marginRight = '6px';

// Alternative view toggle
toggleLabel.appendChild(toggleCheckbox);
toggleLabel.appendChild(document.createTextNode('Alternate view'));

toggleWrapper.appendChild(toggleLabel);

toggleWrapper.append('--');

// Join/leave log
const infoIcon = document.createElement('span');
infoIcon.textContent = ' ℹ️';
infoIcon.title = 'Join/leave record';
infoIcon.style.cursor = 'pointer';
infoIcon.style.marginLeft = '6px';
infoIcon.style.fontSize = '14px';
infoIcon.style.userSelect = 'none';

toggleWrapper.appendChild(infoIcon);

container.appendChild(toggleWrapper);

const timelineContent = document.createElement('div');
container.appendChild(timelineContent);

// Tooltip
const isDarkMode = document.body.classList.contains('dark-mode');
const tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
if(isDarkMode) {tooltip.style.background ='#555'};
if(isDarkMode) {tooltip.style.color ='#d3d3d3'};
tooltip.style.border = '1px solid #ccc';
tooltip.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
tooltip.style.padding = '10px';
tooltip.style.borderRadius = '6px';
tooltip.style.fontSize = '12px';
tooltip.style.minWidth = '200px';
tooltip.style.zIndex = '1000';
tooltip.style.display = 'none';
tooltip.style.maxWidth = '280px';
tooltip.style.lineHeight = '1.3';
tooltip.style.userSelect = 'text';

// Tooltip close button
const closeBtn = document.createElement('button');
closeBtn.textContent = '×';
closeBtn.style.position = 'absolute';
closeBtn.style.top = '4px';
closeBtn.style.right = '6px';
closeBtn.style.border = 'none';
closeBtn.style.background = 'transparent';
closeBtn.style.cursor = 'pointer';
closeBtn.style.fontSize = '16px';
closeBtn.style.lineHeight = '1';
closeBtn.style.padding = '0';
closeBtn.style.color = '#666';
closeBtn.style.textShadow = '0 0 4px rgba(0, 0, 0, 0.7)';

// Tooltip content
const tooltipContent = document.createElement('pre');
tooltipContent.textContent = 'Slot log';
for(var t=0;t<ocData.action_log.length;t++) {
    tooltipContent.append( `\nTime: ${shortFormat(ocData.action_log[t].timestamp).text}: ${ocData.action_log[t].user_name} ${ocData.action_log[t].action} ${ocData.action_log[t].slot}`);
}

tooltip.appendChild(closeBtn);
tooltip.appendChild(tooltipContent);
document.body.appendChild(tooltip);

tooltip.addEventListener('click', e => e.stopPropagation());

infoIcon.addEventListener('click', (e) => {
  e.stopPropagation(); // prevent event bubbling

  if (tooltip.style.display === 'none') {
    const rect = infoIcon.getBoundingClientRect();
    tooltip.style.top = `${rect.top + window.scrollY}px`;
    tooltip.style.left = `${rect.right + 8 + window.scrollX}px`;
    tooltip.style.display = 'block';
  } else {
    tooltip.style.display = 'none';
  }
});
closeBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  tooltip.style.display = 'none';
});
document.addEventListener('click', () => {
  tooltip.style.display = 'none';
});



function renderMode1() {
  timelineContent.innerHTML = '';
  const users = new Map();
  ocData.action_log.forEach(a => {
    if (!users.has(a.user_id)) users.set(a.user_id, { user_name: a.user_name, joins: [], leaves: [] });
    if (a.action === 'joined') users.get(a.user_id).joins.push(a.timestamp);
    if (a.action === 'left') users.get(a.user_id).leaves.push(a.timestamp);
  });
  const start = Math.min(...[].concat(...[...users.values()].map(u => u.joins)));
  const end = ocData.executed_at || ocData.ready_at || Math.floor(Date.now() / 1000);
  const now = Math.floor(Date.now() / 1000);
  const wouldHaveBeenReady = ocData.would_have_been_ready || ocData.ready_at || end;

  const timeline = document.createElement('div');
  timeline.className = 'oc-timeline';
  timeline.style.fontSize = '12px';
  timeline.style.maxWidth = '750px';
  timeline.style.marginTop = '8px';
  //if(viewmode=="phone") {timeline.style.transform = 'rotate(90deg)'}; //phoneWIP

  users.forEach((u, uid) => {
    const row = document.createElement('div');
    row.className = 'row';
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.marginBottom = '4px';
    const label = document.createElement('div');
    label.textContent = u.user_name;
    label.style.flex = '0 0 100px';
    label.style.overflow = 'hidden';
    label.style.textOverflow = 'ellipsis';
    row.appendChild(label);

    const chart = document.createElement('div');
    chart.style.position = 'relative';
    chart.style.flex = '1';
    chart.style.height = '16px';
    chart.style.background = '#eee';
    chart.style.borderRadius = '4px';

    u.joins.forEach((joinTs, i) => {
      const leaveTs = u.leaves[i] || end;
      const baseLeft = ((joinTs - start) / (end - start)) * 100;
      const baseWidth = ((leaveTs - joinTs) / (end - start)) * 100;
      const base = document.createElement('div');
      base.style.position = 'absolute';
      base.style.top = '0';
      base.style.left = baseLeft + '%';
      base.style.width = baseWidth + '%';
      base.style.height = '100%';
      base.style.background = '#ddd';
      base.style.border = '1px solid black';
      chart.appendChild(base);

      const activities = (BC[uid]?.activities || []).filter(a => a.start < leaveTs && (a.end || end) > joinTs);

      activities.forEach((a, idx) => {
  const segStart = Math.max(a.start, joinTs);
  const segEnd = Math.min(a.end || end, leaveTs);
  const left = ((segStart - start) / (end - start)) * 100;
  const width = ((segEnd - segStart) / (end - start)) * 100;

  const seg = document.createElement('div');
  seg.style.position = 'absolute';
  seg.style.top = '0';
  seg.style.left = `${left}%`;
  seg.style.width = `${width}%`;
  seg.style.height = '100%';
  seg.style.border = '0.5px solid #000';

  // Format times without year and omit second day if same as first
  const sf = shortFormat(a.start);
  const tf = a.end ? shortFormat(a.end) : null;
  const dayFrom = sf.day;
  const dayTo = tf ? tf.day : null;
  const timeFrom = sf.time;

  // Change text if OC is done
  const isLastActivity = idx === activities.length - 1;
  let timeTo;
  if (isLastActivity && ocData.executed_at != null) {
    timeTo = 'Executed';
  } else {
    timeTo = tf ? tf.time : 'Now';
  }

  seg.title = `${a.status} from ${dayFrom} ${timeFrom}${dayTo && dayTo !== dayFrom ? ' until ' + dayTo + ' ' : ' until '}${timeTo}`;

  let bg = '#999';
  if (a.status.startsWith('[Hospital]')) bg = 'orange';
  else if (a.status === 'Fedded') bg = '#800';
  else if (a.status === 'Available') bg = '#6c6';
  else if (a.status === 'Jail') bg = 'cyan';
  else if (a.status.startsWith('[')) {
    if (a.status.endsWith('Idle')) bg = '#3498db';
    else if (a.status.endsWith('Going') || a.status.endsWith('Returning')) bg = '#add8e6';
    else if (a.status.endsWith('ALL') || a.status.endsWith('OFF') || a.status.endsWith('Partial')) bg = '#003366';
  }
  seg.style.background = bg;

  seg.addEventListener('click', e => {
    e.stopPropagation();
    const sf2 = shortFormat(a.start);
    const tf2 = a.end ? shortFormat(a.end) : null;
    const fromStr = `${sf2.day} ${sf2.time}`;
    let untilStr;
    if (isLastActivity && ocData.executed_at != null) {
      untilStr = 'Executed';
    } else if (tf2) {
      untilStr = tf2.day !== sf2.day ? `${tf2.day} ${tf2.time}` : tf2.time;
    } else {
      untilStr = 'Now';
    }
    const text = `${u.user_name}: ${a.status} from ${fromStr} until ${untilStr}`;
    navigator.clipboard.writeText(text).then(() => {
      seg.style.outline = '2px solid #333';
      const tip = document.createElement('div');
      tip.textContent = 'Copied!';
      tip.style.position = 'absolute';
      tip.style.top = '-24px';
      tip.style.left = '50%';
      tip.style.transform = 'translateX(-50%)';
      tip.style.padding = '2px 6px';
      tip.style.background = '#000';
      tip.style.color = '#fff';
      tip.style.fontSize = '10px';
      tip.style.borderRadius = '4px';
      tip.style.opacity = '1';
      tip.style.transition = 'opacity 0.4s ease';
      tip.style.pointerEvents = 'none';
      tip.style.zIndex = '999';
      seg.appendChild(tip);
      setTimeout(() => { tip.style.opacity = '0'; }, 800);
      setTimeout(() => {
        if (tip.parentNode) tip.parentNode.removeChild(tip);
        seg.style.outline = '';
      }, 1300);
    });
  });

  chart.appendChild(seg);
});

    });

    if (end > now) {
      const whiteLeft = ((now - start) / (end - start)) * 100;
      const whiteWidth = ((end - now) / (end - start)) * 100;
      const whiteBlock = document.createElement('div');
      whiteBlock.style.position = 'absolute';
      whiteBlock.style.top = '0';
      whiteBlock.style.left = whiteLeft + '%';
      whiteBlock.style.width = whiteWidth + '%';
      whiteBlock.style.height = '100%';
      whiteBlock.style.background = 'white';
      whiteBlock.style.border = '1px solid black';
      chart.appendChild(whiteBlock);
    }

    if (wouldHaveBeenReady && wouldHaveBeenReady !== end) {
      const linePos = ((wouldHaveBeenReady - start) / (end - start)) * 100;
      if (linePos >= 0 && linePos <= 100) {
        const redLine = document.createElement('div');
        redLine.style.position = 'absolute';
        redLine.style.top = '0';
        redLine.style.left = `${linePos}%`;
        redLine.style.width = '2px';
        redLine.style.height = '100%';
        redLine.style.backgroundColor = 'red';
        redLine.style.zIndex = '10';
        chart.appendChild(redLine);
      }
    }

    row.appendChild(chart);
    timeline.appendChild(row);
  });

  timelineContent.appendChild(timeline);
}


function renderMode2() {
  timelineContent.innerHTML = '';
  const altContainer = document.createElement('div');
  //altContainer.style.maxWidth = '750px';
  if(viewmode=="desktop") {altContainer.style.maxWidth = '750px'};
  if(viewmode=="phone") {altContainer.style.maxWidth = '400px'}; //test
  altContainer.style.marginTop = '8px';
  altContainer.style.fontSize = '12px';
  altContainer.style.display = 'flex';
  altContainer.style.gap = '12px';

  const slotContainers = containerWrapper.querySelectorAll('div.wrapper___Lpz_D');
  slotContainers.forEach(slotDiv => {
    const honorWrap = slotDiv.querySelector('div.honor-text-wrap');
    if (!honorWrap) return;
    const honorSpans = honorWrap.querySelectorAll('span.honor-text');
    if (honorSpans.length < 2) return;
    const userName = honorSpans[1].textContent.trim();
    if (!userName) return;

    const userColumn = document.createElement('div');
    userColumn.style.display = 'flex';
    userColumn.style.flexDirection = 'column';
    userColumn.style.alignItems = 'center';
    userColumn.style.width='119px';
    if(viewmode=="phone") {userColumn.style.width='58px'};
    userColumn.style.flex = '0 0 119px';
    if(viewmode=="phone") {userColumn.style.flex = '0 0 58px'};

    const userLabel = document.createElement('div');
    userLabel.textContent = userName;
    userLabel.style.fontWeight = 'bold';
    userLabel.style.marginBottom = '6px';
    userLabel.style.textAlign = 'center';
    userLabel.style.whiteSpace = 'nowrap';
    userLabel.style.overflow = 'hidden';
    userLabel.style.textOverflow = 'ellipsis';
    userLabel.title = userName;
    userColumn.appendChild(userLabel);

    let userId = null;
    for (let i = ocData.action_log.length - 1; i >= 0; i--) {
      const a = ocData.action_log[i];
      if (a.user_name === userName) {
        userId = a.user_id;
        break;
      }
    }
    if (!userId) { altContainer.appendChild(userColumn); return; }

    const userActions = ocData.action_log.filter(a => a.user_id === userId);
    const joins = userActions.filter(a => a.action === 'joined').map(a => a.timestamp);
    const leaves = userActions.filter(a => a.action === 'left').map(a => a.timestamp);
    const end = ocData.executed_at || ocData.ready_at || Math.floor(Date.now() / 1000);

    joins.forEach((joinTs, i) => {
      const leaveTs = leaves[i] || end;
      const activities = (BC[userId]?.activities || []).filter(a => a.start < leaveTs && (a.end || end) > joinTs);

      activities.forEach(a => {
        let bg = '#999';
        if (a.status.startsWith('[Hospital]')) bg = 'orange';
        else if (a.status === 'Fedded') bg = '#800';
        else if (a.status === 'Available') bg = '#6c6';
        else if (a.status === 'Jail') bg = 'cyan';
        else if (a.status.startsWith('[')) {
          if (a.status.endsWith('Idle')) bg = '#3498db';
          else if (a.status.endsWith('Going') || a.status.endsWith('Returning')) bg = '#add8e6';
          else if (a.status.endsWith('ON') || a.status.endsWith('OFF') || a.status.endsWith('Partial')) bg = '#003366';
        }

        const block = document.createElement('div');
        block.style.width = '100%';
        block.style.marginBottom = '6px';
        block.style.padding = '4px';
        block.style.borderRadius = '4px';
        block.style.boxSizing = 'border-box';
        block.style.background = bg;
        block.style.color = '#000';
        block.style.fontSize = '11px';
        block.style.cursor = 'pointer';
        block.style.border = '1px solid #444';
        block.style.display = 'flex';
        block.style.flexDirection = 'column';
        block.style.alignItems = 'center';
        block.style.justifyContent = 'flex-start';
        block.style.minHeight = '84px';
        if(viewmode=="phone") {block.style.transform = 'rotate(90deg)'};
        if(viewmode=="phone") {block.style.minHeight = '22px';};
        if(viewmode=="phone") {block.style.minWidth = '112px';};
        if(viewmode=="phone") {block.style.marginTop = '33px'};
        if(viewmode=="phone") {block.style.marginBottom = '33px'};

        const statusDiv = document.createElement('div');
        statusDiv.style.fontWeight = 'bold';
        statusDiv.style.marginBottom = '4px';
        statusDiv.style.textAlign = 'center';

        let statusText = a.status;
        statusText = statusText.replace(/ - /g, '');
        statusText = statusText.replace(/\]/g, "]<br>");

        const keywords = ['Mugged', 'Hospitalized', 'Attacked', 'Lost', 'Event'];
        keywords.forEach(keyword => {
          if (statusText.includes(keyword)) {
            statusText = statusText.replace(keyword, `${keyword}<br>`);
          }
        });

        statusDiv.innerHTML = statusText;

        const sf = shortFormat(a.start);
        const tf = a.end ? shortFormat(a.end) : null;
        const fromTime = sf.text;
        const toTime = tf ? tf.text : 'Now';

        const timeSpan = document.createElement('span');
        timeSpan.style.fontSize = '10px';
        if(viewmode=="phone") {timeSpan.style.fontSize = '9px'};
        timeSpan.style.lineHeight = '1.3';
        timeSpan.style.textAlign = 'right';
        timeSpan.style.width = '100%'; // Ensure it takes full width for alignment
        timeSpan.innerHTML = `From: ${fromTime}<br>To: ${toTime}`;
        if(viewmode=="phone") {timeSpan.innerHTML = `${fromTime}<br> to ${toTime}`};

        block.appendChild(statusDiv);
        block.appendChild(timeSpan);

        timeSpan.style.marginTop = 'auto';

        block.addEventListener('click', e => {
          e.stopPropagation();
          const fromDay = sf.day;
          const untilDay = tf ? tf.day : null;
          const fromT = sf.time;
          const untilT = tf ? tf.time : 'Now';
          const text = `${userName}: ${a.status} from ${fromDay} ${fromT} until ${untilDay && untilDay !== fromDay ? untilDay + ' ': ''}${untilT}`;
          navigator.clipboard.writeText(text).then(() => {
            block.style.outline = '2px solid #333';
            const tip = document.createElement('div');
            tip.textContent = 'Copied!';
            tip.style.position = 'absolute';
            tip.style.top = '-20px';
            tip.style.left = '50%';
            tip.style.transform = 'translateX(-50%)';
            tip.style.padding = '2px 6px';
            tip.style.background = '#000';
            tip.style.color = '#fff';
            tip.style.fontSize = '10px';
            tip.style.borderRadius = '4px';
            tip.style.opacity = '1';
            tip.style.transition = 'opacity 0.4s ease';
            tip.style.pointerEvents = 'none';
            tip.style.zIndex = '999';
            block.appendChild(tip);
            setTimeout(() => { tip.style.opacity = '0'; }, 800);
            setTimeout(() => {
              if (tip.parentNode) tip.parentNode.removeChild(tip);
              block.style.outline = '';
            }, 1300);
          });
        });

        userColumn.appendChild(block);
      });
    });

    altContainer.appendChild(userColumn);
  });

  timelineContent.appendChild(altContainer);
}


  renderMode1();
  toggleCheckbox.addEventListener('change', () => {
    toggleCheckbox.checked ? renderMode2() : renderMode1();
  });

  return container;
}



  function injectTrackerGrid(wrapper, ocId, OC, BC) {
    const parent = wrapper.parentElement;
    if (parent.querySelector('.ocToggleButton')) return;

    const btn = document.createElement('button');
    btn.textContent = 'Show Activity Log'; btn.style.margin = '8px 0';
    btn.style.backgroundColor = 'lightblue';
    btn.style.border = '1px solid black';
    btn.style.width = '120px';
    btn.style.borderRadius = '4px';
    btn.style.marginLeft = '5px';

    const logWrapper = document.createElement('div');
    logWrapper.style.display = 'none'; logWrapper.style.margin = '8px 0';

    parent.insertBefore(btn, wrapper.nextSibling);
    parent.insertBefore(logWrapper, btn.nextSibling);

    btn.addEventListener('click', () => {
      if (logWrapper.style.display === 'none') {
        if (!logWrapper.hasChildNodes()) {
          const ocData = OC[ocId];
          if (!ocData) logWrapper.textContent = 'No OC data.';
          else {
            logWrapper.innerHTML = '';
              logWrapper.appendChild(createTimeline(ocData, BC, wrapper));

          }
        }
        logWrapper.style.display = '';
        btn.textContent = 'Hide Activity Log';
      } else {
        logWrapper.style.display = 'none';
        btn.textContent = 'Show Activity Log';
      }
    });
  }

  function scanAndInject(OC, BC) {
    document.querySelectorAll('.tt-oc2-list .wrapper___g3mPt').forEach(w => {
      const p = w.closest('[data-oc-id]');
      if (!p || p.getAttribute('data-oc-tracker') === '1') return;
      const ocId = p.getAttribute('data-oc-id');
      injectTrackerGrid(w, ocId, OC, BC);
      p.setAttribute('data-oc-tracker', '1');
    });
  }

  async function observeContainer(OC, BC) {
    const nod = await waitFor('.tt-oc2-list');
    const obs = new MutationObserver(() => {
      if (!nod.querySelector('.loader___FO798.loader_7___blv7D')) {
        obs.disconnect();
        setTimeout(() => { scanAndInject(OC, BC); obs.observe(nod, { childList: true, subtree: true }); }, 300);
      }
    });
    obs.observe(nod, { childList: true, subtree: true });
    if (!nod.querySelector('.loader___FO798.loader_7___blv7D')) setTimeout(() => scanAndInject(OC, BC), 300);
  }

  //console.clear();
  //console.log(`Viewmode: ${viewmode}`);
  try {
      const [OC, BC] = await Promise.all([fetchJson(OC_JSON_URL), fetchJson(BC_JSON_URL)]);
      observeContainer(OC, BC);
  } catch (e) {
      console.error('OC Stalker Error:', e);
  }
})();
