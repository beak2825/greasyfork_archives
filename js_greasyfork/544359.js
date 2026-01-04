// ==UserScript==
// @name         WME AI UR Assist
// @namespace    https://greasyfork.org/users/your-user-id
// @version      20250802.38
// @description  AI UR Assist toggle with UR info display including Description and Discussion fields, Copy Summary and Send to AI buttons with Role and Tone dropdowns near buttons
// @author       TxAgBQ
// @match        https://beta.waze.com/editor/*
// @match        https://*.waze.com/*/editor*
// @exclude      https://*.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544359/WME%20AI%20UR%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/544359/WME%20AI%20UR%20Assist.meta.js
// ==/UserScript==

(function () {
  'use strict';

  async function waitForSidebarTabs() {
    const sidebarTabs = document.querySelector('aside div ul.nav-tabs');
    if (!sidebarTabs) {
      console.log('[AI UR Assist] Sidebar tabs not found, retrying...');
      setTimeout(waitForSidebarTabs, 1000);
      return;
    }

    console.log('[AI UR Assist] Sidebar tabs found, injecting tab.');

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#ai-ur-assist-tab';
    a.setAttribute('data-toggle', 'tab');
    a.style.cursor = 'pointer';
    a.textContent = 'AI UR Assist';
    a.style.userSelect = 'none';

    li.appendChild(a);
    sidebarTabs.appendChild(li);

    const tabContentContainer = document.querySelector('aside div.tab-content');
    if (!tabContentContainer) {
      console.log('[AI UR Assist] Tab content container not found');
      return;
    }

    const tabPane = document.createElement('div');
    tabPane.id = 'ai-ur-assist-tab';
    tabPane.className = 'tab-pane';
    tabPane.style.padding = '10px';
    tabPane.textContent = 'AI UR Assist is currently OFF';

    tabContentContainer.appendChild(tabPane);

    let isOn = localStorage.getItem('wme_ai_ur_assist_on') === 'true';

    function updateToggleUI() {
      if (isOn) {
        a.style.color = '#28a745'; // green
        a.style.fontWeight = 'bold';
        a.style.backgroundColor = 'rgba(40, 167, 69, 0.15)';
        tabPane.textContent = 'AI UR Assist is currently ON\nWaiting for open UR...';
      } else {
        a.style.color = '#dc3545'; // red
        a.style.fontWeight = 'normal';
        a.style.backgroundColor = '';
        tabPane.textContent = 'AI UR Assist is currently OFF';
      }
    }

    updateToggleUI();

    a.addEventListener('click', (evt) => {
      evt.preventDefault();
      isOn = !isOn;
      localStorage.setItem('wme_ai_ur_assist_on', isOn.toString());
      updateToggleUI();
      console.log(`[AI UR Assist] Toggled: ${isOn ? 'ON' : 'OFF'}`);
      if (isOn) {
        startURObserver();
      } else {
        stopURObserver();
        tabPane.textContent = 'AI UR Assist is currently OFF';
      }
    });

    let urObserver = null;

    // Default role and tone selections
    let currentRole = localStorage.getItem('wme_ai_ur_assist_role') || 'Waze volunteer';
    let currentTone = localStorage.getItem('wme_ai_ur_assist_tone') || 'Helpful and professional';

    function parseURInfo() {
      const urTypeEl = document.querySelector(
        '#panel-container > div > wz-card > div > span > div > div.sub-title-and-actions > span'
      );
      const urType = urTypeEl ? urTypeEl.textContent.trim() : 'Unknown UR Type';

      const urDateEl = document.querySelector(
        '#panel-container > div > wz-card > div > span > div > div.reported'
      );
      const urDate = urDateEl ? urDateEl.textContent.trim() : 'Unknown Date';

      const problemEl = document.querySelector(
        '#panel-container > div > wz-card > div > div.content--_7aTH.body > div > div.description.section > div.collapsible.content > div'
      );
      const urProblem = problemEl ? problemEl.textContent.trim() : 'No Description found';

      const discussionEl = document.querySelector(
        '#panel-container > div > wz-card > div > div.content--_7aTH.body > div > div.conversation.section > div.collapsible.content > div > wz-list'
      );
      const urDiscussion = discussionEl ? discussionEl.textContent.trim() : 'No discussion found';

      return { urType, urDate, urProblem, urDiscussion };
    }

    function showURInfo(urInfo) {
      tabPane.textContent = '';
      const wrapper = document.createElement('div');

      const typeEl = document.createElement('div');
      typeEl.innerHTML = `<strong>UR Type:</strong> ${urInfo.urType}`;
      wrapper.appendChild(typeEl);

      const dateEl = document.createElement('div');
      dateEl.innerHTML = `<strong>Submitted:</strong> ${urInfo.urDate}`;
      wrapper.appendChild(dateEl);

      const problemEl = document.createElement('div');
      problemEl.style.marginTop = '10px';
      problemEl.innerHTML = `<strong>Description:</strong><br><pre style="white-space: pre-wrap;">${urInfo.urProblem}</pre>`;
      wrapper.appendChild(problemEl);

      const descEl = document.createElement('div');
      descEl.style.marginTop = '10px';
      descEl.innerHTML = `<strong>Discussion:</strong><br><pre style="white-space: pre-wrap;">${urInfo.urDiscussion}</pre>`;
      wrapper.appendChild(descEl);

      // Container for dropdowns and buttons
      const bottomContainer = document.createElement('div');
      bottomContainer.style.marginTop = '15px';
      bottomContainer.style.display = 'flex';
      bottomContainer.style.flexWrap = 'wrap';
      bottomContainer.style.alignItems = 'center';
      bottomContainer.style.gap = '10px';

      // Role dropdown
      const roleLabel = document.createElement('label');
      roleLabel.textContent = 'Role:';
      roleLabel.style.marginRight = '5px';
      roleLabel.htmlFor = 'aiUrRoleSelect';

      const roleSelect = document.createElement('select');
      roleSelect.id = 'aiUrRoleSelect';
      roleSelect.style.padding = '3px';
      roleSelect.style.minWidth = '180px';

      const roles = [
        'Waze volunteer',
        'Senior map editor',
        'Technical support agent',
        'Customer service rep',
        'Casual helper',
      ];

      roles.forEach((r) => {
        const option = document.createElement('option');
        option.value = r;
        option.textContent = r;
        if (r === currentRole) option.selected = true;
        roleSelect.appendChild(option);
      });

      roleSelect.addEventListener('change', () => {
        currentRole = roleSelect.value;
        localStorage.setItem('wme_ai_ur_assist_role', currentRole);
      });

      // Tone dropdown
      const toneLabel = document.createElement('label');
      toneLabel.textContent = 'Tone:';
      toneLabel.style.marginRight = '5px';
      toneLabel.htmlFor = 'aiUrToneSelect';

      const toneSelect = document.createElement('select');
      toneSelect.id = 'aiUrToneSelect';
      toneSelect.style.padding = '3px';
      toneSelect.style.minWidth = '180px';

      const tones = [
        'Helpful and professional',
        'Friendly and casual',
        'Brief and factual',
        'Encouraging',
        'Strict and formal',
      ];

      tones.forEach((t) => {
        const option = document.createElement('option');
        option.value = t;
        option.textContent = t;
        if (t === currentTone) option.selected = true;
        toneSelect.appendChild(option);
      });

      toneSelect.addEventListener('change', () => {
        currentTone = toneSelect.value;
        localStorage.setItem('wme_ai_ur_assist_tone', currentTone);
      });

      // Append dropdowns with labels
      const roleWrapper = document.createElement('div');
      roleWrapper.style.display = 'flex';
      roleWrapper.style.alignItems = 'center';
      roleWrapper.appendChild(roleLabel);
      roleWrapper.appendChild(roleSelect);

      const toneWrapper = document.createElement('div');
      toneWrapper.style.display = 'flex';
      toneWrapper.style.alignItems = 'center';
      toneWrapper.appendChild(toneLabel);
      toneWrapper.appendChild(toneSelect);

      bottomContainer.appendChild(roleWrapper);
      bottomContainer.appendChild(toneWrapper);

      // Copy Summary Button
      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Copy Summary';
      copyBtn.style.padding = '5px 10px';
      copyBtn.style.cursor = 'pointer';
      copyBtn.addEventListener('click', () => {
        const summaryText = generateSummaryText(urInfo);
        navigator.clipboard.writeText(summaryText).then(() => {
          console.log('[AI UR Assist] Summary copied to clipboard.');
          alert('Summary copied to clipboard.');
        });
      });
      bottomContainer.appendChild(copyBtn);

      // Send to AI Button
      const sendBtn = document.createElement('button');
      sendBtn.textContent = 'Send to AI';
      sendBtn.style.padding = '5px 10px';
      sendBtn.style.cursor = 'pointer';
      sendBtn.addEventListener('click', () => {
        const prompt = generateAIPrompt(urInfo);
        navigator.clipboard.writeText(prompt).then(() => {
          console.log('[AI UR Assist] Prompt copied to clipboard:\n', prompt);
          alert('Prompt copied to clipboard.');
        });
      });
      bottomContainer.appendChild(sendBtn);

      wrapper.appendChild(bottomContainer);

      tabPane.appendChild(wrapper);
    }

    function generateSummaryText(urInfo) {
      return `UR Type: ${urInfo.urType}
Submitted: ${urInfo.urDate}
Description: ${urInfo.urProblem}
Discussion: ${urInfo.urDiscussion}`;
    }

    function generateAIPrompt(urInfo) {
      return `You are a ${currentRole} responding to a map update request in Waze. Please reply in a ${currentTone.toLowerCase()} tone.

Here is the report:

UR Type: ${urInfo.urType}
Submitted: ${urInfo.urDate}
Description: "${urInfo.urProblem}"
Discussion: "${urInfo.urDiscussion}"

Reply to the user in a helpful, professional tone with a request for clarification if needed.`;
    }

    function startURObserver() {
      if (urObserver) return;
      console.log('[AI UR Assist] Starting UR observer.');

      const targetNode = document.querySelector('#panel-container');
      if (!targetNode) {
        console.log('[AI UR Assist] UR container not found.');
        return;
      }

      urObserver = new MutationObserver(() => {
        if (!isOn) return;

        const urTypeEl = document.querySelector(
          '#panel-container > div > wz-card > div > span > div > div.sub-title-and-actions > span'
        );
        if (urTypeEl) {
          const urInfo = parseURInfo();
          console.log('[AI UR Assist] UR detected:', urInfo);
          showURInfo(urInfo);
        } else {
          tabPane.textContent = 'AI UR Assist is currently ON\nNo UR panel open.';
        }
      });

      urObserver.observe(targetNode, { childList: true, subtree: true });

      // Initial check
      const urTypeEl = document.querySelector(
        '#panel-container > div > wz-card > div > span > div > div.sub-title-and-actions > span'
      );
      if (urTypeEl) {
        const urInfo = parseURInfo();
        console.log('[AI UR Assist] UR detected:', urInfo);
        showURInfo(urInfo);
      }
    }

    function stopURObserver() {
      if (urObserver) {
        urObserver.disconnect();
        urObserver = null;
        console.log('[AI UR Assist] Stopped UR observer.');
      }
    }

    if (isOn) startURObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForSidebarTabs);
  } else {
    waitForSidebarTabs();
  }
})();
