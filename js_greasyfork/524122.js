// ==UserScript==
// @name         CAT Ticket Mixer
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Adds a button to Open Ticket Summary to open CAT Ticket Mixer (round-robin mixing, in-page)
// @author       Rob Clayton
// @match        https://workplace.plus.net/reports/tickets/open_tickets_report.html?strLocation=SouthAfrica
// @grant        GM_setClipboard
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524122/CAT%20Ticket%20Mixer.user.js
// @updateURL https://update.greasyfork.org/scripts/524122/CAT%20Ticket%20Mixer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.addEventListener('load', function () {
    const tableHeader = document.querySelector('td.table-header[colspan="4"]');
    const tableElement = tableHeader ? tableHeader.closest('table') : null;

    if (!tableElement) {
      console.error('CAT Ticket Mixer: table not found.');
      return;
    }

    const buttonContainer = document.createElement('div');
    buttonContainer.style.textAlign = 'center';
    buttonContainer.style.marginBottom = '10px';

    const newButton = document.createElement('button');
    newButton.textContent = 'Open CAT Ticket Mixer';
    Object.assign(newButton.style, {
      appearance: 'auto',
      cursor: 'pointer',
      padding: '10px 20px',
      borderWidth: '2px',
      borderStyle: 'outset',
      borderColor: 'buttonborder'
    });

    newButton.addEventListener('click', function () {
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CAT Ticket Mixer</title>
<style>
  body { font-family: Arial, sans-serif; margin: 20px; text-align: center; }
  .inputs { display: flex; justify-content: center; gap: 10px; margin-bottom: 15px; flex-wrap: wrap; }
  textarea {
    height: 100px; width: 250px; resize: vertical; overflow: auto; white-space: nowrap;
  }
  button { display: inline-block; padding: 10px 20px; font-size: 16px; margin: 10px; }
  .output {
    background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd;
    max-height: 240px; overflow: auto; white-space: pre; display: inline-block;
    margin-top: 20px; text-align: left; min-width: 250px; margin-bottom: 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  }
  #copyMsg { display:none; font-size:12px; color:green; margin-left:8px; }
</style>
</head>
<body>
  <h1>CAT Ticket Mixer</h1>

  <div class="inputs">
    <textarea id="input1" placeholder="Paste tickets here"></textarea>
    <textarea id="input2" placeholder="Paste tickets here"></textarea>
    <textarea id="input3" placeholder="Paste tickets here"></textarea>
    <textarea id="input4" placeholder="Paste tickets here"></textarea>
  </div>

  <div>
    <button id="processButton">Shuffle</button>
    <button id="resetButton">Reset</button>
  </div>

  <h2 id="outputHeading" style="display:none;">Shuffled Tickets</h2>
  <div class="output" id="output"></div>

  <div>
    <button id="copyButton" style="display:none;">Copy to Clipboard</button>
    <span id="copyMsg">Copied!</span>
  </div>

<script>
  const inputs = ['input1','input2','input3','input4'].map(id => document.getElementById(id));
  const outputDiv = document.getElementById('output');
  const outputHeading = document.getElementById('outputHeading');
  const copyButton = document.getElementById('copyButton');
  const copyMsg = document.getElementById('copyMsg');
  let shuffledText = '';

  function atLeastTwoPopulated() {
    return inputs.filter(el => el.value.trim() !== '').length >= 2;
  }

  function roundRobinMix(arrays) {
    const active = arrays.map(a => a.slice()).filter(a => a.length > 0);
    const result = [];
    let any = true;
    while (any) {
      any = false;
      for (const batch of active) {
        if (batch.length > 0) {
          any = true;
          const i = Math.floor(Math.random() * batch.length);
          result.push(batch.splice(i, 1)[0]);
        }
      }
    }
    return result;
  }

  document.getElementById('processButton').addEventListener('click', () => {
    if (!atLeastTwoPopulated()) {
      alert('Please populate at least two input fields before processing.');
      return;
    }

    const batches = inputs.map(el =>
      el.value.split('\\n').map(s => s.trim()).filter(Boolean)
    );

    const result = roundRobinMix(batches);
    shuffledText = result.join('\\n');

    outputDiv.textContent = shuffledText;
    outputHeading.style.display = 'block';
    copyButton.style.display = 'inline-block';
    copyMsg.style.display = 'none';
  });

  document.getElementById('resetButton').addEventListener('click', () => {
    inputs.forEach(el => el.value = '');
    outputDiv.textContent = '';
    outputHeading.style.display = 'none';
    copyButton.style.display = 'none';
    copyMsg.style.display = 'none';
    shuffledText = '';
  });

  document.getElementById('copyButton').addEventListener('click', async () => {
    if (!shuffledText) return;
    try {
      if (typeof GM_setClipboard === 'function') {
        GM_setClipboard(shuffledText, { type: 'text', mimetype: 'text/plain' });
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shuffledText);
      } else {
        const ta = document.createElement('textarea');
        ta.value = shuffledText; document.body.appendChild(ta);
        ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
      copyMsg.style.display = 'inline';
      setTimeout(() => copyMsg.style.display = 'none', 1500);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  });
</script>
</body>
</html>
      `;

      // Replace current page content (in-page mode)
      document.open();
      document.write(htmlContent);
      document.close();
    });

    tableElement.parentNode.insertBefore(buttonContainer, tableElement);
    buttonContainer.appendChild(newButton);
  });
})();
