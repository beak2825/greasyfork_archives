// ==UserScript==
// @name        Gimkit Enhanced Assistant
// @namespace   Violentmonkey Scripts
// @match       *://*.gimkit.com/*
// @grant       none
// @version     1.0
// @author      CMH
// @description Enhanced learning assistant for Gimkit
// @downloadURL https://update.greasyfork.org/scripts/540075/Gimkit%20Enhanced%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/540075/Gimkit%20Enhanced%20Assistant.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Configuration
  const config = {
    highlightCorrectAnswers: true,
    autoAnswerDelay: 0, // Set to 0 to disable auto-answer
    showAnswerStats: true,
    enableKeyboardShortcuts: true
  };

  // Add custom CSS
  const style = document.createElement('style');
  style.textContent = `
    .enhanced-assistant-panel {
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(30, 30, 30, 0.9);
      color: white;
      border: 2px solid #6c5ce7;
      border-radius: 8px;
      padding: 10px;
      z-index: 9999;
      max-width: 300px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      font-family: Arial, sans-serif;
      transition: all 0.3s ease;
    }
    .enhanced-assistant-panel h3 {
      margin-top: 0;
      color: #6c5ce7;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .enhanced-assistant-button {
      background: #6c5ce7;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      margin: 5px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .enhanced-assistant-button:hover {
      background: #5b4bc4;
    }
    .enhanced-assistant-button.active {
      background: #4a3cb3;
      box-shadow: inset 0 0 5px rgba(0,0,0,0.3);
    }
    .study-notes {
      margin-top: 10px;
      border-top: 1px solid #444;
      padding-top: 10px;
    }
    .study-notes textarea {
      width: 100%;
      height: 100px;
      margin-top: 5px;
      border-radius: 4px;
      border: 1px solid #444;
      padding: 5px;
      background: #222;
      color: #eee;
    }
    .timer-display {
      font-size: 1.2em;
      font-weight: bold;
      margin: 5px 0;
      text-align: center;
    }
    .answer-stats {
      margin-top: 10px;
      border-top: 1px solid #444;
      padding-top: 10px;
    }
    .answer-stats-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .answer-stats-item .question {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 10px;
    }
    .answer-stats-item .answer {
      color: #6c5ce7;
      font-weight: bold;
    }
    .hidden {
      display: none;
    }
    .correct-answer {
      box-shadow: 0 0 0 2px #4CAF50 !important;
      position: relative;
    }
    .correct-answer::after {
      content: "✓";
      position: absolute;
      top: 5px;
      right: 5px;
      background: #4CAF50;
      color: white;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
    .settings-section {
      margin-top: 10px;
      border-top: 1px solid #444;
      padding-top: 10px;
    }
    .settings-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
    }
    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }
    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #444;
      transition: .4s;
      border-radius: 20px;
    }
    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
    input:checked + .toggle-slider {
      background-color: #6c5ce7;
    }
    input:checked + .toggle-slider:before {
      transform: translateX(20px);
    }
    .delay-input {
      width: 50px;
      background: #222;
      color: white;
      border: 1px solid #444;
      border-radius: 4px;
      padding: 2px 5px;
    }
    .keyboard-shortcuts {
      margin-top: 10px;
      border-top: 1px solid #444;
      padding-top: 10px;
      font-size: 12px;
    }
    .keyboard-shortcut-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .keyboard-shortcut-item .key {
      background: #333;
      padding: 2px 6px;
      border-radius: 3px;
      border: 1px solid #555;
    }
    .made-by {
      font-size: 10px;
      opacity: 0.7;
      text-align: center;
      margin-top: 10px;
      border-top: 1px solid #444;
      padding-top: 5px;
    }
  `;
  document.head.appendChild(style);

  // Create the assistant panel
  const panel = document.createElement('div');
  panel.className = 'enhanced-assistant-panel';
  panel.innerHTML = `
    <h3>
      <span>Enhanced Assistant</span>
      <span class="version" style="font-size: 10px; opacity: 0.7;">v1.0</span>
    </h3>
    <div class="button-container">
      <button class="enhanced-assistant-button toggle-notes">Notes</button>
      <button class="enhanced-assistant-button toggle-timer">Timer</button>
      <button class="enhanced-assistant-button toggle-stats">Stats</button>
      <button class="enhanced-assistant-button toggle-settings">Settings</button>
      <button class="enhanced-assistant-button toggle-panel">Hide</button>
    </div>

    <div class="study-notes hidden">
      <p>Quick Notes:</p>
      <textarea placeholder="Take notes here..."></textarea>
      <button class="enhanced-assistant-button save-notes">Save</button>
    </div>

    <div class="timer-container hidden">
      <div class="timer-display">00:00</div>
      <div style="display: flex; justify-content: center;">
        <button class="enhanced-assistant-button start-timer">Start</button>
        <button class="enhanced-assistant-button reset-timer">Reset</button>
      </div>
    </div>

    <div class="answer-stats hidden">
      <p>Recent Answers:</p>
      <div class="answer-stats-list"></div>
    </div>

    <div class="settings-section hidden">
      <div class="settings-item">
        <span>Highlight Answers</span>
        <label class="toggle-switch">
          <input type="checkbox" id="highlight-toggle" ${config.highlightCorrectAnswers ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="settings-item">
        <span>Auto-Answer Delay (ms)</span>
        <input type="number" id="auto-answer-delay" class="delay-input" value="${config.autoAnswerDelay}" min="0" max="10000" step="100">
      </div>

      <div class="settings-item">
        <span>Show Answer Stats</span>
        <label class="toggle-switch">
          <input type="checkbox" id="stats-toggle" ${config.showAnswerStats ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="settings-item">
        <span>Keyboard Shortcuts</span>
        <label class="toggle-switch">
          <input type="checkbox" id="shortcuts-toggle" ${config.enableKeyboardShortcuts ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>

    <div class="keyboard-shortcuts ${config.enableKeyboardShortcuts ? '' : 'hidden'}">
      <p>Shortcuts:</p>
      <div class="keyboard-shortcut-item">
        <span>Toggle Panel</span>
        <span class="key">Alt+P</span>
      </div>
      <div class="keyboard-shortcut-item">
        <span>Quick Note</span>
        <span class="key">Alt+N</span>
      </div>
      <div class="keyboard-shortcut-item">
        <span>Timer Start/Pause</span>
        <span class="key">Alt+T</span>
      </div>
    </div>

    <div class="made-by">Made by CMH</div>
  `;
  document.body.appendChild(panel);

  // Timer functionality
  let timerInterval;
  let seconds = 0;
  const timerDisplay = panel.querySelector('.timer-display');
  const startTimerBtn = panel.querySelector('.start-timer');
  const resetTimerBtn = panel.querySelector('.reset-timer');

  function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  startTimerBtn.addEventListener('click', function() {
    if (this.textContent === 'Start') {
      timerInterval = setInterval(function() {
        seconds++;
        updateTimerDisplay();
      }, 1000);
      this.textContent = 'Pause';
    } else {
      clearInterval(timerInterval);
      this.textContent = 'Start';
    }
  });

  resetTimerBtn.addEventListener('click', function() {
    clearInterval(timerInterval);
    seconds = 0;
    updateTimerDisplay();
    startTimerBtn.textContent = 'Start';
  });

  // Toggle functionality
  const toggleNotesBtn = panel.querySelector('.toggle-notes');
  const toggleTimerBtn = panel.querySelector('.toggle-timer');
  const toggleStatsBtn = panel.querySelector('.toggle-stats');
  const toggleSettingsBtn = panel.querySelector('.toggle-settings');
  const togglePanelBtn = panel.querySelector('.toggle-panel');

  const notesSection = panel.querySelector('.study-notes');
  const timerSection = panel.querySelector('.timer-container');
  const statsSection = panel.querySelector('.answer-stats');
  const settingsSection = panel.querySelector('.settings-section');

  function hideAllSections() {
    notesSection.classList.add('hidden');
    timerSection.classList.add('hidden');
    statsSection.classList.add('hidden');
    settingsSection.classList.add('hidden');

    toggleNotesBtn.classList.remove('active');
    toggleTimerBtn.classList.remove('active');
    toggleStatsBtn.classList.remove('active');
    toggleSettingsBtn.classList.remove('active');
  }

  toggleNotesBtn.addEventListener('click', function() {
    if (notesSection.classList.contains('hidden')) {
      hideAllSections();
      notesSection.classList.remove('hidden');
      this.classList.add('active');
    } else {
      notesSection.classList.add('hidden');
      this.classList.remove('active');
    }
  });

  toggleTimerBtn.addEventListener('click', function() {
    if (timerSection.classList.contains('hidden')) {
      hideAllSections();
      timerSection.classList.remove('hidden');
      this.classList.add('active');
    } else {
      timerSection.classList.add('hidden');
      this.classList.remove('active');
    }
  });

  toggleStatsBtn.addEventListener('click', function() {
    if (statsSection.classList.contains('hidden')) {
      hideAllSections();
      statsSection.classList.remove('hidden');
      this.classList.add('active');
    } else {
      statsSection.classList.add('hidden');
      this.classList.remove('active');
    }
  });

  toggleSettingsBtn.addEventListener('click', function() {
    if (settingsSection.classList.contains('hidden')) {
      hideAllSections();
      settingsSection.classList.remove('hidden');
      this.classList.add('active');
    } else {
      settingsSection.classList.add('hidden');
      this.classList.remove('active');
    }
  });

  togglePanelBtn.addEventListener('click', function() {
    if (this.textContent === 'Hide') {
      hideAllSections();
      panel.style.width = 'auto';
      panel.style.height = 'auto';
      panel.style.overflow = 'hidden';
      panel.style.padding = '5px';
      Array.from(panel.children).forEach(child => {
        if (child.tagName !== 'H3' && !child.contains(togglePanelBtn)) {
          child.style.display = 'none';
        }
      });
      this.textContent = 'Show';
    } else {
      panel.style.width = '';
      panel.style.height = '';
      panel.style.overflow = '';
      panel.style.padding = '10px';
      Array.from(panel.children).forEach(child => {
        if (child.tagName !== 'H3') {
          child.style.display = '';
        }
      });
      this.textContent = 'Hide';
    }
  });

  // Save notes functionality
  const saveNotesBtn = panel.querySelector('.save-notes');
  const notesTextarea = panel.querySelector('textarea');

  saveNotesBtn.addEventListener('click', function() {
    const notes = notesTextarea.value;
    localStorage.setItem('gimkitEnhancedNotes', notes);
    alert('Notes saved!');
  });

  // Load saved notes
  const savedNotes = localStorage.getItem('gimkitEnhancedNotes');
  if (savedNotes) {
    notesTextarea.value = savedNotes;
  }

  // Settings functionality
  const highlightToggle = document.getElementById('highlight-toggle');
  const autoAnswerDelayInput = document.getElementById('auto-answer-delay');
  const statsToggle = document.getElementById('stats-toggle');
  const shortcutsToggle = document.getElementById('shortcuts-toggle');
  const keyboardShortcutsSection = panel.querySelector('.keyboard-shortcuts');

  highlightToggle.addEventListener('change', function() {
    config.highlightCorrectAnswers = this.checked;
    localStorage.setItem('gimkitConfig', JSON.stringify(config));
  });

  autoAnswerDelayInput.addEventListener('change', function() {
    config.autoAnswerDelay = parseInt(this.value, 10);
    localStorage.setItem('gimkitConfig', JSON.stringify(config));
  });

  statsToggle.addEventListener('change', function() {
    config.showAnswerStats = this.checked;
    localStorage.setItem('gimkitConfig', JSON.stringify(config));
  });

  shortcutsToggle.addEventListener('change', function() {
    config.enableKeyboardShortcuts = this.checked;
    localStorage.setItem('gimkitConfig', JSON.stringify(config));
    if (this.checked) {
      keyboardShortcutsSection.classList.remove('hidden');
    } else {
      keyboardShortcutsSection.classList.add('hidden');
    }
  });

  // Load saved config
  const savedConfig = localStorage.getItem('gimkitConfig');
  if (savedConfig) {
    try {
      const parsedConfig = JSON.parse(savedConfig);
      Object.assign(config, parsedConfig);

      // Update UI to match loaded config
      highlightToggle.checked = config.highlightCorrectAnswers;
      autoAnswerDelayInput.value = config.autoAnswerDelay;
      statsToggle.checked = config.showAnswerStats;
      shortcutsToggle.checked = config.enableKeyboardShortcuts;

      if (config.enableKeyboardShortcuts) {
        keyboardShortcutsSection.classList.remove('hidden');
      } else {
        keyboardShortcutsSection.classList.add('hidden');
      }
    } catch (e) {
      console.error('Error loading saved config:', e);
    }
  }

  // Answer tracking
  const answerMap = new Map();
  const answerStatsList = panel.querySelector('.answer-stats-list');

  function updateAnswerStats() {
    if (!config.showAnswerStats) return;

    answerStatsList.innerHTML = '';

    // Get the last 5 entries
    const entries = Array.from(answerMap.entries()).slice(-5);

    entries.forEach(([question, answer]) => {
      const item = document.createElement('div');
      item.className = 'answer-stats-item';
      item.innerHTML = `
        <span class="question" title="${question}">${question}</span>
        <span class="answer">${answer}</span>
      `;
      answerStatsList.appendChild(item);
    });
  }

  // Keyboard shortcuts
  if (config.enableKeyboardShortcuts) {
    document.addEventListener('keydown', function(e) {
      // Alt+P to toggle panel
      if (e.altKey && e.key === 'p') {
        togglePanelBtn.click();
      }

      // Alt+N to toggle notes
      if (e.altKey && e.key === 'n') {
        toggleNotesBtn.click();
      }

      // Alt+T to toggle timer
      if (e.altKey && e.key === 't') {
        toggleTimerBtn.click();
      }
    });
  }

  // Detect quiz questions and provide assistance
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === 1) {
            // Check if this is a question container
            const questionElement = node.querySelector && node.querySelector('[data-testid="question-text"]');
            if (questionElement) {
              const questionText = questionElement.textContent.trim();

              // Look for answer options
              const answerOptions = Array.from(document.querySelectorAll('[role="button"]')).filter(el =>
                el.textContent && el.textContent.length > 0 && !el.textContent.includes('Skip')
              );

              // If we have a stored answer for this question
              if (answerMap.has(questionText) && config.highlightCorrectAnswers) {
                const correctAnswer = answerMap.get(questionText);

                // Find and highlight the correct answer
                answerOptions.forEach(option => {
                  if (option.textContent.trim() === correctAnswer) {
                    option.classList.add('correct-answer');

                    // Auto-answer if enabled
                    if (config.autoAnswerDelay > 0) {
                      setTimeout(() => {
                        option.click();
                      }, config.autoAnswerDelay);
                    }
                  }
                });
              }

              // Add click listeners to capture correct answers
              answerOptions.forEach(option => {
                option.addEventListener('click', function() {
                  // We'll check after a short delay if the answer was correct
                  setTimeout(() => {
                    // If we're still on the same question, the answer was wrong
                    // If we moved to a new question, the answer was correct
                    const currentQuestion = document.querySelector('[data-testid="question-text"]');
                    if (currentQuestion && currentQuestion.textContent.trim() !== questionText) {
                      // The answer was correct, store it
                      answerMap.set(questionText, option.textContent.trim());
                      updateAnswerStats();
                    }
                  }, 500);
                }, { once: true });
              });
            }
          }
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('Gimkit Enhanced Assistant loaded successfully!');
})();