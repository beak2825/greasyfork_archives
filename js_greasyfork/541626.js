// ==UserScript==
// @name         Wikipedia Grammar Fix (GPT)
// @namespace    https://openai.com/
// @version      1.0
// @description  Adds a "Fix Grammar (GPT)" button to Wikipedia edit pages.
// @match        https://en.wikipedia.org/w/index.php?title=*&action=edit*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.openai.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541626/Wikipedia%20Grammar%20Fix%20%28GPT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541626/Wikipedia%20Grammar%20Fix%20%28GPT%29.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // Force-inject button repeatedly so it's always visible
  function injectButton() {
    const ta = document.getElementById('wpTextbox1');
    const sum = document.getElementById('wpSummary');
    if (!ta || !sum) return;

    if (!document.getElementById('fixGrammarGPT')) {
      const btn = document.createElement('button');
      btn.id = 'fixGrammarGPT';
      btn.textContent = '🪄 Fix Grammar (GPT)';
      btn.style.marginLeft = '10px';
      btn.style.padding = '4px 8px';
      btn.style.backgroundColor = '#3366cc';
      btn.style.color = 'white';
      btn.style.border = 'none';
      btn.style.borderRadius = '4px';
      btn.style.cursor = 'pointer';

      btn.onclick = async () => {
        let key = GM_getValue("openai_api_key");
        if (!key) {
          key = prompt("Enter your OpenAI API key (starts with sk-)");
          if (!key) return;
          GM_setValue("openai_api_key", key);
        }

        const text = ta.value
          .split('\n')
          .filter(l => !l.includes('[[File:') && !l.includes('[[Category:'))
          .join('\n');

        if (!text.trim()) {
          alert("❌ No content to fix.");
          return;
        }

        btn.disabled = true;
        btn.textContent = 'Fixing...';

        GM_xmlhttpRequest({
          method: 'POST',
          url: 'https://api.openai.com/v1/chat/completions',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + key
          },
          data: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: 'Fix grammar in this Wikipedia article. Keep templates & citations.' },
              { role: 'user', content: text }
            ],
            temperature: 0.3
          }),
          onload(res) {
            try {
              const data = JSON.parse(res.responseText);
              const reply = data.choices?.[0]?.message?.content?.trim();
              if (reply) {
                ta.value = reply;
                btn.textContent = '✅ Fixed!';
              } else {
                alert("❌ GPT returned no response.");
                btn.textContent = '🪄 Fix Grammar (GPT)';
              }
            } catch (e) {
              console.error(e);
              alert("⚠️ Error parsing GPT response.");
              btn.textContent = '🪄 Fix Grammar (GPT)';
            }
            btn.disabled = false;
          },
          onerror() {
            alert("⚠️ API request failed.");
            btn.disabled = false;
            btn.textContent = '🪄 Fix Grammar (GPT)';
          }
        });
      };

      sum.parentNode.appendChild(btn);
      console.log('[FixGPT] Button injected.');
    }
  }

  setInterval(injectButton, 500);
})();
