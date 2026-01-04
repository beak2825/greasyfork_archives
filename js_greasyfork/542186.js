// ==UserScript==
// @name         Heart's RW Intro+Table+Outro Combiner
// @namespace    HeartScripts
// @version      1.6.2
// @description  Combines intro, table, outro for Torn forum threads in a compact mobile-friendly layout (Modified version)
// @author       Heart [3034011]
// @match        https://www.torn.com/forums.php*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/542186/Heart%27s%20RW%20Intro%2BTable%2BOutro%20Combiner.user.js
// @updateURL https://update.greasyfork.org/scripts/542186/Heart%27s%20RW%20Intro%2BTable%2BOutro%20Combiner.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Create toggle button (bottom-right as usual)
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '+';
  Object.assign(toggleBtn.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '9999',
    borderRadius: '50%',
    width: '45px',
    height: '45px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    fontSize: '22px',
    boxShadow: '0 0 8px rgba(0,0,0,0.6)',
    cursor: 'pointer',
  });
  document.body.appendChild(toggleBtn);

  // Create main interface container
  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'fixed',
    bottom: '50px',
    right: '10px',
    zIndex: '9999',
    background: '#1e1e1e',
    color: 'white',
    padding: '10px',
    borderRadius: '12px',
    width: '90vw',
    maxWidth: '480px',
    display: 'none',
    flexDirection: 'column',
    gap: '6px',
    boxShadow: '0 0 12px rgba(0,0,0,0.9)',
    fontSize: '13px',
    fontFamily: 'sans-serif',
  });

  // Close button for the main interface
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✖';
  Object.assign(closeBtn.style, {
    position: 'absolute',
    top: '5px',
    right: '8px',
    background: 'transparent',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  });
  closeBtn.onclick = () => {
    container.style.display = 'none'; // Hide interface
  };
  container.appendChild(closeBtn);

  // Create the textarea for the Table HTML (bottom of the interface)
  const tableBox = document.createElement('textarea');
  tableBox.placeholder = 'Table HTML';
  Object.assign(tableBox.style, {
    width: '100%',
    height: '150px',
    background: '#2c2c2c',
    color: 'white',
    border: '1px solid #555',
    padding: '4px',
    borderRadius: '6px',
    fontFamily: 'monospace',
    fontSize: '12px',
    resize: 'vertical',
  });
  container.appendChild(tableBox);

  // Create the result textarea (Mixed Result)
  const resultBox = document.createElement('textarea');
  resultBox.placeholder = 'Mixed Result';
  resultBox.readOnly = true;
  Object.assign(resultBox.style, {
    width: '100%',
    height: '80px',
    background: '#2c2c2c',
    color: 'white',
    border: '1px solid #555',
    padding: '4px',
    borderRadius: '6px',
    fontFamily: 'monospace',
    fontSize: '12px',
    resize: 'none',
  });
  container.appendChild(resultBox);

  // Create a horizontal container for buttons (Intro - Mix - Copy - Outro)
  const btnRow = document.createElement('div');
  Object.assign(btnRow.style, {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '6px',
    marginTop: '6px',
  });

  // Intro button (left)
  const introBtn = document.createElement('button');
  introBtn.textContent = 'Intro';
  Object.assign(introBtn.style, {
    flex: '1',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '6px',
  });

  // Mix button (center-left)
  const mixBtn = document.createElement('button');
  mixBtn.textContent = '🔀 Mix';
  Object.assign(mixBtn.style, {
    flex: '1',
    background: '#333',
    color: 'white',
    border: '1px solid #777',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '8px',
  });

  // Copy button (center-right)
  const copyBtn = document.createElement('button');
  copyBtn.textContent = '📋 Copy';
  Object.assign(copyBtn.style, {
    flex: '1',
    background: '#555',
    color: 'white',
    border: 'none',
    padding: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '6px',
  });

  // Outro button (right)
  const outroBtn = document.createElement('button');
  outroBtn.textContent = 'Outro';
  Object.assign(outroBtn.style, {
    flex: '1',
    background: '#FF5733',
    color: 'white',
    border: 'none',
    padding: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    borderRadius: '6px',
  });

  // Append buttons to btnRow
  btnRow.appendChild(introBtn);
  btnRow.appendChild(mixBtn);
  btnRow.appendChild(copyBtn);
  btnRow.appendChild(outroBtn);

  container.appendChild(btnRow);

  // Append everything to body
  document.body.appendChild(container);

  // Compact panel interface for Intro/Outro editing
  function createOverlayInterface(type) {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      bottom: '50px',
      right: '10px',
      width: '90vw',
      maxWidth: '480px',
      height: '300px',
      background: '#1e1e1e',
      color: 'white',
      zIndex: '10000',
      display: 'none',
      flexDirection: 'column',
      padding: '10px 15px',
      borderRadius: '12px',
      boxShadow: '0 0 12px rgba(0,0,0,0.9)',
      fontFamily: 'sans-serif',
      fontSize: '14px',
      boxSizing: 'border-box',
    });

    // Title
    const title = document.createElement('h2');
    title.textContent = type === 'forumIntro' ? 'Edit Intro HTML' : 'Edit Outro HTML';
    title.style.margin = '0 0 8px 0';
    title.style.fontSize = '16px';
    overlay.appendChild(title);

    // Textarea
    const textArea = document.createElement('textarea');
    Object.assign(textArea.style, {
      flex: '1',
      width: '100%',
      background: '#2c2c2c',
      color: 'white',
      border: '1px solid #555',
      borderRadius: '6px',
      fontFamily: 'monospace',
      fontSize: '13px',
      padding: '8px',
      resize: 'vertical',
      minHeight: '160px',
      marginBottom: '10px',
    });
    overlay.appendChild(textArea);

    // Load saved value from localStorage
    textArea.value = localStorage.getItem(type) || '';

    // Container for buttons (Save and Close)
    const buttonsDiv = document.createElement('div');
    Object.assign(buttonsDiv.style, {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    });

    // Save button
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    Object.assign(saveBtn.style, {
      background: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      cursor: 'pointer',
      padding: '8px 16px',
    });
    saveBtn.onclick = () => {
      localStorage.setItem(type, textArea.value);
      alert(`${type === 'forumIntro' ? 'Intro' : 'Outro'} saved!`);
      overlay.style.display = 'none';
      container.style.display = 'flex';
    };
    buttonsDiv.appendChild(saveBtn);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✖';
    Object.assign(closeBtn.style, {
      background: 'transparent',
      color: 'white',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      padding: '4px 10px',
    });
    closeBtn.onclick = () => {
      overlay.style.display = 'none';
      container.style.display = 'flex';
    };
    buttonsDiv.appendChild(closeBtn);

    overlay.appendChild(buttonsDiv);

    document.body.appendChild(overlay);

    return overlay;
  }

  const introOverlay = createOverlayInterface('forumIntro');
  const outroOverlay = createOverlayInterface('forumOutro');

  // Show/hide overlays on respective button clicks
  introBtn.onclick = () => {
    container.style.display = 'none';
    introOverlay.style.display = 'flex';
  };

  outroBtn.onclick = () => {
    container.style.display = 'none';
    outroOverlay.style.display = 'flex';
  };

  // Toggle main interface visibility
  toggleBtn.onclick = () => {
    container.style.display = container.style.display === 'flex' ? 'none' : 'flex';
  };

  // Mix function combines intro + table + outro and shows in resultBox
  mixBtn.onclick = () => {
    const introHTML = localStorage.getItem('forumIntro') || '';
    const outroHTML = localStorage.getItem('forumOutro') || '';
    const tableHTML = tableBox.value || '';

    const mixed = introHTML + '\n' + tableHTML + '\n' + outroHTML;
    resultBox.value = mixed.trim();
  };

  // Copy mixed result to clipboard
  copyBtn.onclick = () => {
    if (!resultBox.value) {
      alert('Nothing to copy! Please click Mix first.');
      return;
    }
    // Use GM_setClipboard if available, fallback to navigator.clipboard
    if (typeof GM_setClipboard === 'function') {
      GM_setClipboard(resultBox.value);
      alert('Copied to clipboard!');
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(resultBox.value).then(() => {
        alert('Copied to clipboard!');
      }, () => {
        alert('Failed to copy!');
      });
    } else {
      alert('Clipboard API not available');
    }
  };
})();
