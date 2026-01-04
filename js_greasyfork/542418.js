// ==UserScript==
// @name         Torn Faction Export
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds faction member export button to top of page. copies results to clipboard if requested, downloads to csv. Name,  id, level, link
// @author       bort
// @license MIT
// @match        https://www.torn.com/factions.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/542418/Torn%20Faction%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/542418/Torn%20Faction%20Export.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const apiKey = await getApiKey();
  if (!apiKey) return;

  // Determine which faction is being viewed
  const viewedFactionId = getFactionIdFromURL();

  // Determine which faction you're in
  const profileRes = await fetch(`https://api.torn.com/user/?selections=profile&key=${apiKey}`);
  const profileData = await profileRes.json();
  if (profileData.error) return alert(`API Error (profile): ${profileData.error.error}`);
  const myFactionId = profileData.faction?.faction_id;

  // Exit early if not viewing your own faction
  if (viewedFactionId && String(viewedFactionId) !== String(myFactionId)) return;

  // Create button only if you're on your own faction page
  const container = document.createElement('div');
  container.style.background = 'yellow';
  container.style.color = 'black';
  container.style.padding = '10px';
  container.style.fontWeight = 'bold';
  container.style.fontSize = '14px';
  container.style.textAlign = 'center';
  container.style.borderBottom = '2px solid black';
  container.style.zIndex = '9999';

  const button = document.createElement('button');
  button.textContent = '📋 Export Faction Members';
  button.style.padding = '6px 12px';
  button.style.marginLeft = '10px';
  button.style.cursor = 'pointer';
  button.style.fontWeight = 'bold';

  container.appendChild(document.createTextNode('Faction Export Tool'));
  container.appendChild(button);
  document.body.prepend(container);

  button.addEventListener('click', async () => {
    const factionRes = await fetch(`https://api.torn.com/faction/?selections=basic&key=${apiKey}`);
    const data = await factionRes.json();
    if (data.error) return alert(`API Error: ${data.error.error}`);

    const members = data.members;
    const rows = [['Name', 'ID', 'Level', 'Profile Link']];
    for (const [id, m] of Object.entries(members)) {
      rows.push([m.name, id, m.level, `https://www.torn.com/profiles.php?XID=${id}`]);
    }

    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');

    if (confirm('Copy member list to clipboard as well?')) {
      GM_setClipboard(csv);
      alert('✅ Copied to clipboard.');
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const urlBlob = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = 'faction_members.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(urlBlob);
  });

  function getFactionIdFromURL() {
    const match = window.location.href.match(/[\?&]ID=(\d+)/i);
    return match ? match[1] : null;
  }

  async function getApiKey() {
    let key = GM_getValue('apiKey');
    if (!key || !/^[a-z0-9]{16,}$/i.test(key)) {
      key = prompt('Enter your Torn API key (must include faction & basic access):');
      if (key && /^[a-z0-9]{16,}$/i.test(key)) {
        GM_setValue('apiKey', key);
      } else {
        alert('Invalid API key.');
        return null;
      }
    }
    return key;
  }
})();