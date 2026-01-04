// ==UserScript==
// @name         RR Tracker v8.6.1 (Visibility Fix)
// @namespace    https://greasyfork.org/users/1493252
// @version      8.6.1 // Reverted logic and applied a more stable visibility fix for Charging Shoots.
// @description RR tracker with cool features, now with integrated Martingale bet auto-start and charged auto-shooting!
//###Your Torn RR Tracker: Quick Guide
//###Auto-Tracking
//###Just open Russian Roulette, and your tracker starts automatically. It records every win and loss, showing your profit, win rate, and streaks.
//###Panel Controls
//###* Drag: Click and drag the ☰ icon to move the panel anywhere you like.
//###* Shift + Drag: Hold Shift and drag with your mouse from anywhere on the panel to move it.
//###* Collapse/Expand: Click the ► (or ▪) icon to shrink or expand the panel.
//###* Hide/Show: If Auto-Hide is on in settings, the tracker hides when you leave RR and reappears when you return.
//###Settings (⚙️ icon)
//###* Panel Opacity: Adjust how see-through the panel is.
//###* Profit/Loss Alerts: Set targets to be notified when you hit a certain profit or loss.
//###* Mini-Bar Count: Choose how many recent games show in the collapsed view.
//###* Mini-Button Size: Adjust the size of the bet buttons in the collapsed view.
//###* Reset Data: Clear all your tracked stats and profit.
//###* Edit Bets: Customize your Martingale bet amounts in a dedicated panel.
//###* Charging Shoots: Toggle the auto-shoot helper panel on or off.
//###Bets (💰 icon)
//###* Smart Bets: The panel now shows your recent match history and allows you to auto-start bets.
//###Charging Shoots (⚡ NEW!)
//###* When enabled in settings, a new panel appears during matches.
//###* Click "+ Add Charge" to load up to 3 shoots.
//###* The script will automatically click the "Shoot" button for you, using one charge per click.
//###* Charges reset to 0 after each match.
//###* This panel can also be moved by holding Shift + Drag or with a two-finger drag on touchscreens.
// @match        https://www.torn.com/page.php?sid=russianRoulette*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543631/RR%20Tracker%20v861%20%28Visibility%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543631/RR%20Tracker%20v861%20%28Visibility%20Fix%29.meta.js
// ==/UserScript==

(function waitUntilReady() {
  'use strict';

  // --- Constants ---
  const PANEL_ID              = 'rr-tracker-panel';
  const STORAGE               = 'torn_rr_tracker_results';
  const PROFIT_STORAGE        = 'torn_rr_total_profit';
  const POS_KEY               = 'rr_panelPos';
  const COLLAPSE_KEY          = 'rr_panelCollapsed';
  const AUTOHIDE_KEY          = 'rr_autoHide';
  const MAX_DISPLAY_KEY       = 'rr_maxDisplayMatches';
  const OPACITY_KEY           = 'rr_panelOpacity';
  const PROFIT_TARGET_KEY     = 'rr_profitTarget';
  const LOSS_LIMIT_KEY        = 'rr_lossLimit';
  const ALERT_SHOWN_PROFIT_KEY= 'rr_alertShownProfit';
  const ALERT_SHOWN_LOSS_KEY  = 'rr_alertShownLoss';
  const MINI_BAR_COUNT_KEY    = 'rr_miniBarCount';
  const MINI_BUTTON_SIZE_KEY  = 'rr_miniButtonSize';
  const MARTINGALE_BETS_STORAGE_KEY = 'RRBets';
  const DEFAULT_MARTINGALE_BETS = [10000, 20000, 40000, 80000, 160000, 320000, 640000, 1280000, 2560000, 5120000, 10240000];
  const EXPECTED_BET_COUNT = DEFAULT_MARTINGALE_BETS.length;
  const CHARGED_SHOOTS_PANEL_ID      = 'rr-charged-shoots-panel';
  const CHARGED_SHOOTS_ENABLED_KEY   = 'rr_chargedshootsEnabled';
  const CHARGED_SHOOTS_POS_KEY       = 'rr_chargedshootsPanelPos';
  // NEW: Key for storing charged shoots count
  const CHARGED_SHOOTS_COUNT_KEY     = 'rr_chargedShootsCount';

  // --- State Variables ---
  let currentMartingaleBets, showBetsPanel, showEditBetsPanel, isDragging, dragMouseX, dragMouseY, isTwoFingerDragging, initialTouchMidX, initialTouchMidY, initialPanelX, initialPanelY;
  let isChargedshootsEnabled, chargedshoots, chargedshootsPanel, chargedshootsDisplay, isChargedPanelDragging, dragChargedPanelMouseX, dragChargedPanelMouseY, isChargedPanelTwoFingerDragging, initialChargedPanelTouchMidX, initialChargedPanelTouchMidY, initialChargedPanelX, initialChargedPanelY;
  let lastPot, roundActive, hasTracked, results, totalProfit, collapsed, autoHide, showSettings, maxDisplayMatches, currentOpacity, profitTarget, lossLimit, alertShownProfit, alertShownLoss, miniBarCount, miniButtonSize;

  // New state variable for charged shoot timing
  let isShootDelayed = false; // Flag to prevent rapid firing

  const nativeSet = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;

  // --- Initial Checks ---
  if (document.getElementById(PANEL_ID)) return;
  if (!document.body.innerText.includes('Password') && !document.body.innerText.includes('POT MONEY') && !document.body.innerText.includes('Shoot') && !document.body.innerText.includes('Players') && !document.querySelector('.create-game-section') && !document.querySelector('.russian-roulette-container')) {
    return setTimeout(waitUntilReady, 200);
  }

  // --- Load Data and Initialize Variables ---
  function initializeState() {
      currentMartingaleBets = []; showBetsPanel = false; showEditBetsPanel = false; isDragging = false; dragMouseX = 0; dragMouseY = 0; isTwoFingerDragging = false; initialTouchMidX = 0; initialTouchMidY = 0; initialPanelX = 0; initialPanelY = 0;
      // MODIFIED: Load chargedshoots from localStorage, default to 0 if not found
      chargedshoots = parseInt(localStorage.getItem(CHARGED_SHOOTS_COUNT_KEY) || '0', 10);
      isChargedPanelDragging = false; dragChargedPanelMouseX = 0; dragChargedPanelMouseY = 0; isChargedPanelTwoFingerDragging = false;
      lastPot = 0; roundActive = true; hasTracked = false;
      results = JSON.parse(localStorage.getItem(STORAGE) || '[]' );
      totalProfit = parseFloat(localStorage.getItem(PROFIT_STORAGE) || '0' );
      collapsed = JSON.parse(localStorage.getItem(COLLAPSE_KEY) || 'false' );
      autoHide = JSON.parse(localStorage.getItem(AUTOHIDE_KEY) || 'false' );
      showSettings = false;
      maxDisplayMatches = parseInt(localStorage.getItem(MAX_DISPLAY_KEY) || '100', 10);
      if (isNaN(maxDisplayMatches) || maxDisplayMatches < 1) { maxDisplayMatches = 100; localStorage.setItem(MAX_DISPLAY_KEY, maxDisplayMatches.toString()); }
      currentOpacity  = parseFloat(localStorage.getItem(OPACITY_KEY) || '0.6' );
      if (isNaN(currentOpacity) || currentOpacity < 0.1 || currentOpacity > 1.0) { currentOpacity = 0.6; localStorage.setItem(OPACITY_KEY, currentOpacity.toString()); }
      profitTarget = parseFloat(localStorage.getItem(PROFIT_TARGET_KEY) || '0' );
      lossLimit = parseFloat(localStorage.getItem(LOSS_LIMIT_KEY) || '0' );
      alertShownProfit = JSON.parse(localStorage.getItem(ALERT_SHOWN_PROFIT_KEY) || 'false' );
      alertShownLoss = JSON.parse(localStorage.getItem(ALERT_SHOWN_LOSS_KEY) || 'false' );
      miniBarCount = parseInt(localStorage.getItem(MINI_BAR_COUNT_KEY) || '10', 10);
      if (isNaN(miniBarCount) || miniBarCount < 1 || miniBarCount > 50) { miniBarCount = 10; localStorage.setItem(MINI_BAR_COUNT_KEY, miniBarCount.toString()); }
      miniButtonSize = parseInt(localStorage.getItem(MINI_BUTTON_SIZE_KEY) || '9', 10);
      if (isNaN(miniButtonSize) || miniButtonSize < 7 || miniButtonSize > 14) { miniButtonSize = 9; localStorage.setItem(MINI_BUTTON_SIZE_KEY, miniButtonSize.toString()); }
      isChargedshootsEnabled = JSON.parse(localStorage.getItem(CHARGED_SHOOTS_ENABLED_KEY) || 'false');
  }
  initializeState();

  // --- UI Creation ---
  const panel = document.createElement('div');
  panel.id = PANEL_ID;
  Object.assign(panel.style, {
    position: 'fixed', top: '12px', left: '12px', background: `rgba(0,0,0,${currentOpacity})`, color: '#fff',
    fontFamily: 'monospace', fontSize: '14px', padding: '36px 12px 12px', borderRadius: '10px',
    boxShadow: '0 0 12px rgba(255,0,0,0.3)', zIndex: '9999999', userSelect: 'none', display: 'flex',
    flexDirection: 'column', gap: '8px', minWidth: '140px'
  });
  document.body.appendChild(panel);
  try { const pos = JSON.parse(localStorage.getItem(POS_KEY) || '{}' ); if (pos.top && pos.left) { panel.style.top = pos.top; panel.style.left = pos.left; } } catch {}

  chargedshootsPanel = document.createElement('div');
  chargedshootsPanel.id = CHARGED_SHOOTS_PANEL_ID;
  Object.assign(chargedshootsPanel.style, {
    position: 'fixed', top: '150px', left: '12px', background: `rgba(0,0,0,${currentOpacity})`, color: '#fff',
    fontFamily: 'monospace', fontSize: '14px', padding: '10px 12px', borderRadius: '10px',
    boxShadow: '0 0 12px rgba(255,0,0,0.3)', zIndex: '9999998', userSelect: 'none', display: 'none',
    flexDirection: 'column', alignItems: 'center', gap: '8px', touchAction: 'none'
  });
  document.body.appendChild(chargedshootsPanel);
  try { const pos = JSON.parse(localStorage.getItem(CHARGED_SHOOTS_POS_KEY) || '{}'); if (pos.top && pos.left) { chargedshootsPanel.style.top = pos.top; chargedshootsPanel.style.left = pos.left; } } catch {}

  const chargedshootsTitle = document.createElement('div'); chargedshootsTitle.textContent = 'Charging Shoots'; chargedshootsTitle.style.fontWeight = 'bold'; chargedshootsPanel.appendChild(chargedshootsTitle);
  chargedshootsDisplay = document.createElement('div'); chargedshootsDisplay.textContent = `Charges: ${chargedshoots} / 3`; chargedshootsDisplay.style.fontSize = '16px'; chargedshootsPanel.appendChild(chargedshootsDisplay);
  const addChargeBtn = document.createElement('button'); addChargeBtn.textContent = '+ Add Charge';
  Object.assign(addChargeBtn.style, { background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', width: '100%' });
  addChargeBtn.onmouseenter = () => addChargeBtn.style.background = 'rgba(255,255,255,0.2)'; addChargeBtn.onmouseleave = () => addChargeBtn.style.background = 'rgba(255,255,255,0.1)';
  // MODIFIED: Save chargedshoots to localStorage when incrementing
  addChargeBtn.onclick = () => { if (chargedshoots < 3) { chargedshoots++; updateChargedshootsDisplay(); localStorage.setItem(CHARGED_SHOOTS_COUNT_KEY, chargedshoots.toString()); } }; chargedshootsPanel.appendChild(addChargeBtn);

  const alertMessageDiv = document.createElement('div');
  alertMessageDiv.id = 'rr-alert-message';
  Object.assign(alertMessageDiv.style, { display: 'none', padding: '8px', marginBottom: '8px', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px', color: 'white', cursor: 'pointer', border: '1px solid transparent', transition: 'background-color 0.3s, border-color 0.3s' });
  panel.appendChild(alertMessageDiv);

  const miniBar = document.createElement('div');
  Object.assign(miniBar.style, { display: 'none', flexDirection: 'column', gap: '2px', padding: '4px 0' });
  panel.appendChild(miniBar);

  const profitMini = document.createElement('div');
  Object.assign(profitMini.style, { display: 'none', fontSize: '14px', fontFamily: 'monospace', margin: '2px 0' });
  panel.appendChild(profitMini);

  const statusDiv = document.createElement('div');
  Object.assign(statusDiv.style, { position: 'absolute', top: '8px', left: '8px', width: '20px', height: '20px', fontSize: '18px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' });
  panel.appendChild(statusDiv);

  const dragHandle = document.createElement('div');
  dragHandle.textContent = '☰';
  Object.assign(dragHandle.style, { position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', fontSize: '18px', cursor: 'move', color: 'rgba(255,255,255,0.7)', touchAction: 'none' });
  panel.appendChild(dragHandle);

  const statsGroup = document.createElement('div');
  Object.assign(statsGroup.style, { display: 'flex', flexDirection: 'column', gap: '4px' });
  panel.appendChild(statsGroup);

  const profitDiv  = document.createElement('div');
  const winrateDiv = document.createElement('div');
  const streakDiv  = document.createElement('div');
  statsGroup.append(profitDiv, winrateDiv, streakDiv);

  const resultsContainer = document.createElement('div');
  Object.assign(resultsContainer.style, { maxHeight: '140px', overflowY: 'auto', marginTop: '4px' });
  statsGroup.appendChild(resultsContainer);

  const settingsPanel = document.createElement('div');
  Object.assign(settingsPanel.style, { display: 'none', flexDirection: 'column', gap: '8px', padding: '12px 0' });
  panel.appendChild(settingsPanel);

  const settingsTitle = document.createElement('div');
  settingsTitle.textContent = 'Settings';
  Object.assign(settingsTitle.style, { fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' });
  settingsPanel.appendChild(settingsTitle);

  const backButtonSettings = document.createElement('button');
  backButtonSettings.textContent = '← Back';
  Object.assign(backButtonSettings.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius:'6px', padding: '4px 8px', cursor: 'pointer', marginBottom: '8px' });
  backButtonSettings.onmouseenter = () => backButtonSettings.style.background = 'rgba(255,255,255,0.2)';
  backButtonSettings.onmouseleave = () => backButtonSettings.style.background = 'rgba(255,255,255,0.1)';
  backButtonSettings.onclick = () => { showSettings = false; showBetsPanel = false; showEditBetsPanel = false; refreshAll(); };
  settingsPanel.appendChild(backButtonSettings);

  const maxMatchesSettingDiv = document.createElement('div'); Object.assign(maxMatchesSettingDiv.style, { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' });
  const maxMatchesLabel = document.createElement('label'); maxMatchesLabel.textContent = 'Max Matches Displayed:'; maxMatchesLabel.htmlFor = 'max-matches-input'; Object.assign(maxMatchesLabel.style, { flexShrink: '0' });
  const maxMatchesInput = document.createElement('input'); maxMatchesInput.type = 'number'; maxMatchesInput.id = 'max-matches-input'; maxMatchesInput.min = '1'; maxMatchesInput.max = '500'; maxMatchesInput.value = maxDisplayMatches; Object.assign(maxMatchesInput.style, { width: '60px', padding: '4px', border: '1px solid #555', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff' });
  maxMatchesInput.onchange = () => { let newValue = parseInt(maxMatchesInput.value, 10); if (isNaN(newValue) || newValue < 1) { newValue = 1; } if (newValue > 500) newValue = 500; maxDisplayMatches = newValue; maxMatchesInput.value = maxDisplayMatches; localStorage.setItem(MAX_DISPLAY_KEY, maxDisplayMatches.toString()); while (results.length > maxDisplayMatches) { results.pop(); } saveResults(); refreshAll(); };
  maxMatchesSettingDiv.append(maxMatchesLabel, maxMatchesInput); settingsPanel.appendChild(maxMatchesSettingDiv);

  const transparencySettingDiv = document.createElement('div'); Object.assign(transparencySettingDiv.style, { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' });
  const transparencyLabel = document.createElement('label'); transparencyLabel.textContent = 'Panel Opacity:'; transparencyLabel.htmlFor = 'transparency-slider'; Object.assign(transparencyLabel.style, { flexShrink: '0' });
  const transparencySlider = document.createElement('input'); transparencySlider.type = 'range'; transparencySlider.id = 'transparency-slider'; transparencySlider.min = '0.1'; transparencySlider.max = '1.0'; transparencySlider.step = '0.05'; transparencySlider.value = currentOpacity; Object.assign(transparencySlider.style, { width: '100px', padding: '4px', border: 'none', background: 'transparent', cursor: 'pointer' });
  transparencySlider.oninput = () => { currentOpacity = parseFloat(transparencySlider.value); panel.style.background = `rgba(0,0,0,${currentOpacity})`; localStorage.setItem(OPACITY_KEY, currentOpacity.toString()); refreshAll(); };
  transparencySettingDiv.append(transparencyLabel, transparencySlider); settingsPanel.appendChild(transparencySettingDiv);

  const profitTargetSettingDiv = document.createElement('div'); Object.assign(profitTargetSettingDiv.style, { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' });
  const profitTargetLabel = document.createElement('label'); profitTargetLabel.textContent = 'Profit Target ($):'; profitTargetLabel.htmlFor = 'profit-target-input'; Object.assign(profitTargetLabel.style, { flexShrink: '0' });
  const profitTargetInput = document.createElement('input'); profitTargetInput.type = 'number'; profitTargetInput.id = 'profit-target-input'; profitTargetInput.min = '0'; profitTargetInput.value = profitTarget; Object.assign(profitTargetInput.style, { width: '80px', padding: '4px', border: '1px solid #555', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff' });
  profitTargetInput.onchange = () => { let newValue = parseInt(profitTargetInput.value, 10); if (isNaN(newValue) || newValue < 0) newValue = 0; profitTarget = newValue; profitTargetInput.value = profitTarget; localStorage.setItem(PROFIT_TARGET_KEY, profitTarget.toString()); alertShownProfit = false; localStorage.setItem(ALERT_SHOWN_PROFIT_KEY, 'false'); refreshAll(); };
  profitTargetSettingDiv.append(profitTargetLabel, profitTargetInput); settingsPanel.appendChild(profitTargetSettingDiv);

  const lossLimitSettingDiv = document.createElement('div'); Object.assign(lossLimitSettingDiv.style, { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' });
  const lossLimitLabel = document.createElement('label'); lossLimitLabel.textContent = 'Loss Limit ($):'; lossLimitLabel.htmlFor = 'loss-limit-input'; Object.assign(lossLimitLabel.style, { flexShrink: '0' });
  const lossLimitInput = document.createElement('input'); lossLimitInput.type = 'number'; lossLimitInput.id = 'loss-limit-input'; lossLimitInput.min = '0'; lossLimitInput.value = lossLimit; Object.assign(lossLimitInput.style, { width: '80px', padding: '4px', border: '1px solid #555', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff' });
  lossLimitInput.onchange = () => { let newValue = parseInt(lossLimitInput.value, 10); if (isNaN(newValue) || newValue < 0) newValue = 0; lossLimit = newValue; lossLimitInput.value = lossLimit; localStorage.setItem(LOSS_LIMIT_KEY, lossLimit.toString()); alertShownLoss = false; localStorage.setItem(ALERT_SHOWN_LOSS_KEY, 'false'); refreshAll(); };
  lossLimitSettingDiv.append(lossLimitLabel, lossLimitInput); settingsPanel.appendChild(lossLimitSettingDiv);

  const clearAlertsBtn = document.createElement('button'); clearAlertsBtn.textContent = '✔️ Clear Alerts'; Object.assign(clearAlertsBtn.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius:'6px', padding: '4px 8px', cursor: 'pointer', marginTop: '4px' });
  clearAlertsBtn.onmouseenter = () => clearAlertsBtn.style.background = 'rgba(255,255,255,0.2)'; clearAlertsBtn.onmouseleave = () => clearAlertsBtn.style.background = 'rgba(255,255,255,0.1)';
  clearAlertsBtn.onclick = () => { alertShownProfit = false; alertShownLoss = false; localStorage.setItem(ALERT_SHOWN_PROFIT_KEY, 'false'); localStorage.setItem(ALERT_SHOWN_LOSS_KEY, 'false'); alertMessageDiv.style.display = 'none'; refreshAll(); };
  settingsPanel.appendChild(clearAlertsBtn);

  const miniBarCountSettingDiv = document.createElement('div'); Object.assign(miniBarCountSettingDiv.style, { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' });
  const miniBarCountLabel = document.createElement('label'); miniBarCountLabel.textContent = 'Mini-Bar Count:'; miniBarCountLabel.htmlFor = 'mini-bar-count-input'; Object.assign(miniBarCountLabel.style, { flexShrink: '0' });
  const miniBarCountInput = document.createElement('input'); miniBarCountInput.type = 'number'; miniBarCountInput.id = 'mini-bar-count-input'; miniBarCountInput.min = '1'; miniBarCountInput.max = '50'; miniBarCountInput.value = miniBarCount; Object.assign(miniBarCountInput.style, { width: '60px', padding: '4px', border: '1px solid #555', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff' });
  miniBarCountInput.onchange = () => { let newValue = parseInt(miniBarCountInput.value, 10); if (isNaN(newValue) || newValue < 1) newValue = 1; if (newValue > 50) newValue = 50; miniBarCount = newValue; miniBarCountInput.value = miniBarCount; localStorage.setItem(MINI_BAR_COUNT_KEY, miniBarCount.toString()); refreshAll(); };
  miniBarCountSettingDiv.append(miniBarCountLabel, miniBarCountInput); settingsPanel.appendChild(miniBarCountSettingDiv);

  const miniButtonSizeSettingDiv = document.createElement('div'); Object.assign(miniButtonSizeSettingDiv.style, { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' });
  const miniButtonSizeLabel = document.createElement('label'); miniButtonSizeLabel.textContent = 'Mini-Button Size:'; miniButtonSizeLabel.htmlFor = 'mini-button-size-slider'; Object.assign(miniButtonSizeLabel.style, { flexShrink: '0' });
  const miniButtonSizeSlider = document.createElement('input'); miniButtonSizeSlider.type = 'range'; miniButtonSizeSlider.id = 'mini-button-size-slider'; miniButtonSizeSlider.min = '7'; miniButtonSizeSlider.max = '14'; miniButtonSizeSlider.step = '1'; miniButtonSizeSlider.value = miniButtonSize; Object.assign(miniButtonSizeSlider.style, { width: '100px', padding: '4px', border: 'none', background: 'transparent', cursor: 'pointer' });
  miniButtonSizeSlider.oninput = () => { miniButtonSize = parseInt(miniButtonSizeSlider.value, 10); localStorage.setItem(MINI_BUTTON_SIZE_KEY, miniButtonSize.toString()); refreshAll(); };
  miniButtonSizeSettingDiv.append(miniButtonSizeLabel, miniButtonSizeSlider); settingsPanel.appendChild(miniButtonSizeSettingDiv);

  const editBetsButton = document.createElement('button'); editBetsButton.textContent = '✏️ Edit Bets'; Object.assign(editBetsButton.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius:'6px', padding: '4px 8px', cursor: 'pointer', marginTop: '4px' });
  editBetsButton.onmouseenter = () => editBetsButton.style.background = 'rgba(255,255,255,0.2)'; editBetsButton.onmouseleave = () => editBetsButton.style.background = 'rgba(255,255,255,0.1)';
  editBetsButton.onclick = () => { showSettings = false; showBetsPanel = false; showEditBetsPanel = true; refreshAll(); };
  settingsPanel.appendChild(editBetsButton);

  const chargedshootsToggleBtn = document.createElement('button');
  const updateChargedshootsButtonText = () => { chargedshootsToggleBtn.textContent = `⚡ Charging Shoots: ${isChargedshootsEnabled ? 'On' : 'Off'}`; };
  updateChargedshootsButtonText();
  Object.assign(chargedshootsToggleBtn.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', marginTop: '4px' });
  chargedshootsToggleBtn.onmouseenter = () => chargedshootsToggleBtn.style.background = 'rgba(255,255,255,0.2)'; chargedshootsToggleBtn.onmouseleave = () => chargedshootsToggleBtn.style.background = 'rgba(255,255,255,0.1)';
  chargedshootsToggleBtn.onclick = () => { isChargedshootsEnabled = !isChargedshootsEnabled; localStorage.setItem(CHARGED_SHOOTS_ENABLED_KEY, JSON.stringify(isChargedshootsEnabled)); updateChargedshootsButtonText(); updateChargedshootsPanelVisibility(); };
  settingsPanel.appendChild(chargedshootsToggleBtn);

  const resetBtn = document.createElement('button'); resetBtn.textContent = '🔄 Reset Data'; Object.assign(resetBtn.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius:'6px', padding: '4px 8px', cursor: 'pointer', marginTop: '4px' });
  resetBtn.onmouseenter = () => resetBtn.style.background = 'rgba(255,255,255,0.2)'; resetBtn.onmouseleave = () => resetBtn.style.background = 'rgba(255,255,255,0.1)';
  // MODIFIED: Also reset chargedshoots and its localStorage value on full data reset
  resetBtn.onclick = () => { if (confirm('Clear all results and reset profit?')) { initializeState(); chargedshoots = 0; localStorage.setItem(CHARGED_SHOOTS_COUNT_KEY, '0'); saveResults(); saveTotalProfit(); localStorage.setItem(ALERT_SHOWN_PROFIT_KEY, 'false'); localStorage.setItem(ALERT_SHOWN_LOSS_KEY, 'false'); currentMartingaleBets = [...DEFAULT_MARTINGALE_BETS]; saveMartingaleBets(currentMartingaleBets); refreshAll(); } };
  settingsPanel.appendChild(resetBtn);

  const autoHideBtn = document.createElement('button'); autoHideBtn.textContent = autoHide ? 'Auto-Hide: On' : 'Auto-Hide: Off'; Object.assign(autoHideBtn.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius:'6px', padding: '4px 8px', cursor: 'pointer', marginTop: '4px' });
  autoHideBtn.onmouseenter = () => autoHideBtn.style.background = 'rgba(255,255,255,0.2)'; autoHideBtn.onmouseleave = () => autoHideBtn.style.background = 'rgba(255,255,255,0.1)';
  autoHideBtn.onclick = () => { autoHide = !autoHide; localStorage.setItem(AUTOHIDE_KEY, JSON.stringify(autoHide)); autoHideBtn.textContent = autoHide ? 'Auto-Hide: On' : 'Auto-Hide: Off'; refreshAll(); };
  settingsPanel.appendChild(autoHideBtn);

  const settingsButton = document.createElement('button');
  settingsButton.textContent = '⚙️ Settings';
  Object.assign(settingsButton.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius:'6px', padding: '4px 8px', cursor: 'pointer', marginTop: '4px' });
  settingsButton.onmouseenter = () => settingsButton.style.background = 'rgba(255,255,255,0.2)';
  settingsButton.onmouseleave = () => settingsButton.style.background = 'rgba(255,255,255,0.1)';
  settingsButton.onclick = () => { showSettings = !showSettings; showBetsPanel = false; showEditBetsPanel = false; refreshAll(); };
  panel.appendChild(settingsButton);

  const betsPanel = document.createElement('div');
  Object.assign(betsPanel.style, { display: 'none', flexDirection: 'column', gap: '8px', padding: '12px 0' });
  panel.appendChild(betsPanel);
  const betsPanelLastMatchesTitle = document.createElement('div'); betsPanelLastMatchesTitle.textContent = `Last ${miniBarCount} Matches`; Object.assign(betsPanelLastMatchesTitle.style, { fontSize: '13px', color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: '-4px' });
  const betsPanelCirclesContainer = document.createElement('div'); Object.assign(betsPanelCirclesContainer.style, { display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center', marginBottom: '6px' });
  betsPanel.appendChild(betsPanelLastMatchesTitle); betsPanel.appendChild(betsPanelCirclesContainer);
  const betsTitle = document.createElement('div'); betsTitle.textContent = 'Smart Bets'; Object.assign(betsTitle.style, { fontSize: '16px', fontWeight: 'bold', marginBottom: '4px', textAlign: 'center' });
  betsPanel.appendChild(betsTitle);
  const backButtonBets = document.createElement('button'); backButtonBets.textContent = '← Back'; Object.assign(backButtonBets.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius:'6px', padding: '4px 8px', cursor: 'pointer', marginBottom: '8px' });
  backButtonBets.onmouseenter = () => backButtonBets.style.background = 'rgba(255,255,255,0.2)'; backButtonBets.onmouseleave = () => backButtonBets.style.background = 'rgba(255,255,255,0.1)';
  backButtonBets.onclick = () => { showBetsPanel = false; showSettings = false; showEditBetsPanel = false; refreshAll(); };
  betsPanel.appendChild(backButtonBets);
  const betButtonsContainer = document.createElement('div'); Object.assign(betButtonsContainer.style, { display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' });
  betsPanel.appendChild(betButtonsContainer);

  const editBetsPanel = document.createElement('div');
  Object.assign(editBetsPanel.style, { display: 'none', flexDirection: 'column', gap: '8px', padding: '12px 0' });
  panel.appendChild(editBetsPanel);
  const editBetsTitle = document.createElement('div'); editBetsTitle.textContent = 'Edit Martingale Bets'; Object.assign(editBetsTitle.style, { fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' });
  editBetsPanel.appendChild(editBetsTitle);
  const backButtonEditBets = document.createElement('button'); backButtonEditBets.textContent = '← Back to Settings'; Object.assign(backButtonEditBets.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius:'6px', padding: '4px 8px', cursor: 'pointer', marginBottom: '8px' });
  backButtonEditBets.onmouseenter = () => backButtonEditBets.style.background = 'rgba(255,255,255,0.2)'; backButtonEditBets.onmouseleave = () => backButtonEditBets.style.background = 'rgba(255,255,255,0.1)';
  backButtonEditBets.onclick = () => { showEditBetsPanel = false; showSettings = true; refreshAll(); };
  editBetsPanel.appendChild(backButtonEditBets);
  const martingaleEditGrid = document.createElement('div'); Object.assign(martingaleEditGrid.style, { display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 10px' });
  editBetsPanel.appendChild(martingaleEditGrid);
  let martingaleEditInputs = [];
  for (let i = 0; i < EXPECTED_BET_COUNT; i++) {
      const label = document.createElement('label'); label.textContent = `Bet ${i + 1}:`; Object.assign(label.style, { fontSize: '13px', paddingTop: '4px' }); martingaleEditGrid.appendChild(label);
      const input = document.createElement('input'); input.type = 'text'; input.placeholder = `e.g., ${i === 0 ? '10k' : (i === 1 ? '30k' : '')}`; Object.assign(input.style, { width: '80px', padding: '4px', border: '1px solid #555', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff' });
      input.onchange = (e) => { const parsed = parseBetInput(e.target.value); if (parsed !== null) { currentMartingaleBets[i] = parsed; saveMartingaleBets(currentMartingaleBets); e.target.value = formatNumberToKMB(parsed); refreshAll(); } else if (e.target.value !== '') { alert('Invalid input. Please enter a positive number or use K/M/B/ suffixes (e.g., 25k, 2.5m).'); e.target.value = formatNumberToKMB(currentMartingaleBets[i]); } };
      martingaleEditGrid.appendChild(input); martingaleEditInputs.push(input);
  }

  const betsButton = document.createElement('button');
  betsButton.textContent = '💰 Bets';
  Object.assign(betsButton.style, { alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius:'6px', padding: '4px 8px', cursor: 'pointer', marginTop: '4px' });
  betsButton.onmouseenter = () => betsButton.style.background = 'rgba(255,255,255,0.2)';
  betsButton.onmouseleave = () => betsButton.style.background = 'rgba(255,255,255,0.1)';
  betsButton.onclick = () => { showBetsPanel = !showBetsPanel; showSettings = false; showEditBetsPanel = false; refreshAll(); };
  panel.appendChild(betsButton);

  // --- Core Functions ---
  const saveResults = () => localStorage.setItem(STORAGE, JSON.stringify(results));
  const saveTotalProfit = () => localStorage.setItem(PROFIT_STORAGE, totalProfit.toString());
  const saveCollapsed = () => localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapsed));
  // NEW: Function to save chargedshoots
  const saveChargedshoots = () => localStorage.setItem(CHARGED_SHOOTS_COUNT_KEY, chargedshoots.toString());

  function updateChargedshootsDisplay() { if(chargedshootsDisplay) chargedshootsDisplay.textContent = `Charges: ${chargedshoots} / 3`; }

  function updateChargedshootsPanelVisibility() {
      const inMatch = document.body.innerText.includes('POT MONEY') && !document.body.innerText.includes('Create Game');
      if (isChargedshootsEnabled && inMatch) {
          chargedshootsPanel.style.display = 'flex';
          chargedshootsPanel.style.background = `rgba(0,0,0,${currentOpacity})`;
      } else {
          chargedshootsPanel.style.display = 'none';
      }
  }

  // MODIFIED: `performAutoShoot` to handle timing and single shoot per charge
  function performAutoShoot() {
      if (!isChargedshootsEnabled || chargedshoots <= 0 || isShootDelayed) return;

      const shootButton = [...document.querySelectorAll('button.torn-btn, button.btn')].find(b => b.textContent.trim().toLowerCase() === 'shoot');

      // Check if the shoot button is visible and not disabled
      if (shootButton && !shootButton.disabled && shootButton.offsetParent !== null) { // offsetParent check ensures element is rendered/visible
          isShootDelayed = true; // Set flag to prevent immediate re-firing

          setTimeout(() => {
              // Re-check button state after delay, as it might have changed
              const currentShootButton = [...document.querySelectorAll('button.torn-btn, button.btn')].find(b => b.textContent.trim().toLowerCase() === 'shoot');

              if (currentShootButton && !currentShootButton.disabled && currentShootButton.offsetParent !== null) {
                  currentShootButton.click();
                  chargedshoots--;
                  // MODIFIED: Save chargedshoots to localStorage after decrementing
                  saveChargedshoots();
                  updateChargedshootsDisplay();
              }
              isShootDelayed = false; // Reset flag after attempting to shoot
          }, 500); // 0.5 second delay
      }
  }

  function parseBetInput(str) {
    str = str.toLowerCase().replace(/,/g,'').trim();
    let m = 1;
    if (str.endsWith('k')) { m=1e3; str=str.slice(0,-1); }
    else if (str.endsWith('m')) { m=1e6; str=str.slice(0,-1); }
    else if (str.endsWith('b')) { m=1e9; str=str.slice(0,-1); }
    let v = parseFloat(str);
    return (isNaN(v)||v<=0) ? null : Math.floor(v*m);
  }

  function formatNumberToKMB(num) {
    if (num === null || isNaN(num)) return '';
    if (num >= 1e9) return (num / 1e9).toFixed(2).replace(/\.00$/, '') + 'b';
    if (num >= 1e6) return (num / 1e6).toFixed(2).replace(/\.00$/, '') + 'm';
    if (num >= 1e3) return (num / 1e3).toFixed(2).replace(/\.00$/, '') + 'k';
    return num.toLocaleString();
  }

  function loadMartingaleBets() {
      let storedBetsArray = [];
      try { const storedJson = localStorage.getItem(MARTINGALE_BETS_STORAGE_KEY); if (storedJson) { const parsed = JSON.parse(storedJson); if (Array.isArray(parsed)) { storedBetsArray = parsed; } } } catch (e) { console.error("Error parsing stored martingale bets:", e); }
      let finalBets = [...DEFAULT_MARTINGALE_BETS];
      storedBetsArray.forEach((bet, index) => { if (index < EXPECTED_BET_COUNT) { const num = parseInt(bet, 10); if (!isNaN(num) && num > 0) { finalBets[index] = num; } } });
      return finalBets;
  }

  function saveMartingaleBets(a){ localStorage.setItem(MARTINGALE_BETS_STORAGE_KEY, JSON.stringify(a)); }

  function startMatch(originalButtonBetValue) {
    const inputBox = document.querySelector('input[aria-label="Money value"]');
    if (inputBox) {
        nativeSet.call(inputBox, originalButtonBetValue.toLocaleString('en-US'));
        inputBox.dispatchEvent(new Event('input',{bubbles:true}));
        inputBox.dispatchEvent(new Event('change',{bubbles:true}));
        const betAfterInputSet = parseBetInput(inputBox.value);
        if (betAfterInputSet === null || betAfterInputSet <= 0) { alert("Invalid bet amount currently in the input box. Please ensure it's a valid number."); return; }
        if (betAfterInputSet < originalButtonBetValue) { alert(`The bet amount in the box ($${betAfterInputSet.toLocaleString()}) is less than the button's intended value ($${originalButtonBetValue.toLocaleString()}).\nMatch not started.`); return; }
        let startButton = [...document.querySelectorAll('button')].find(b => b.textContent.trim().toLowerCase() === 'start');
        if (startButton) startButton.click();
    } else {
        setTimeout(() => { let yesButton = [...document.querySelectorAll('button')].find(b => b.textContent.trim().toLowerCase() === 'yes'); if (yesButton) yesButton.click(); }, 400);
    }
  }

  function buildBetButtons() {
    currentMartingaleBets = loadMartingaleBets();
    betButtonsContainer.innerHTML = '';
    const firstBetRow = document.createElement('div');
    Object.assign(firstBetRow.style, { display: 'flex', justifyContent: 'center', width: '100%' });
    let b0 = document.createElement('button');
    b0.textContent = formatNumberToKMB(currentMartingaleBets[0]);
    b0.title = `$${currentMartingaleBets[0].toLocaleString()}`;
    Object.assign(b0.style, { background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius:'6px', padding: '4px 10px', cursor: 'pointer', fontSize: '11px', minWidth: '80px' });
    b0.onmouseenter = () => b0.style.background = 'rgba(255,255,255,0.2)'; b0.onmouseleave = () => b0.style.background = 'rgba(255,255,255,0.1)';
    b0.onclick = () => startMatch(currentMartingaleBets[0]);
    firstBetRow.appendChild(b0);
    betButtonsContainer.appendChild(firstBetRow);
    for (let i = 1; i < EXPECTED_BET_COUNT; i += 2) {
      const row = document.createElement('div');
      Object.assign(row.style, { display: 'flex', justifyContent: 'space-around', gap: '6px', width: '100%' });
      let b1 = document.createElement('button');
      b1.textContent = formatNumberToKMB(currentMartingaleBets[i]);
      b1.title = `$${currentMartingaleBets[i].toLocaleString()}`;
      Object.assign(b1.style, { background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius:'6px', padding: '4px 10px', cursor: 'pointer', fontSize: '11px', flex: '1', minWidth: '70px' });
      b1.onmouseenter = () => b1.style.background = 'rgba(255,255,255,0.2)'; b1.onmouseleave = () => b1.style.background = 'rgba(255,255,255,0.1)';
      b1.onclick = () => startMatch(currentMartingaleBets[i]);
      row.appendChild(b1);
      if (i + 1 < EXPECTED_BET_COUNT) {
        let b2 = document.createElement('button');
        b2.textContent = formatNumberToKMB(currentMartingaleBets[i+1]);
        b2.title = `$${currentMartingaleBets[i+1].toLocaleString()}`;
        Object.assign(b2.style, { background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius:'6px', padding: '4px 10px', cursor: 'pointer', fontSize: '11px', flex: '1', minWidth: '70px' });
        b2.onmouseenter = () => b2.style.background = 'rgba(255,255,255,0.2)'; b2.onmouseleave = () => b2.style.background = 'rgba(255,255,255,0.1)';
        b2.onclick = () => startMatch(currentMartingaleBets[i+1]);
        row.appendChild(b2);
      }
      betButtonsContainer.appendChild(row);
    }
    martingaleEditInputs.forEach((input, i) => { input.value = formatNumberToKMB(currentMartingaleBets[i]); });
    miniBar.innerHTML = '';
    const miniCirclesContainer = document.createElement('div');
    Object.assign(miniCirclesContainer.style, { display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'center' });
    results.slice(0, miniBarCount).forEach((r, idx) => miniCirclesContainer.append(makeCircle(r.result, r.bet, idx)));
    miniBar.appendChild(miniCirclesContainer);
    betsPanelCirclesContainer.innerHTML = '';
    results.slice(0, miniBarCount).forEach((r, idx) => betsPanelCirclesContainer.append(makeCircle(r.result, r.bet, idx)));
    betsPanelLastMatchesTitle.textContent = `Last ${miniBarCount} Matches`;
    if (collapsed && !showBetsPanel && !showSettings && !showEditBetsPanel) {
        const miniBetContainerTopRow = document.createElement('div'); Object.assign(miniBetContainerTopRow.style, { display: 'flex', flexWrap: 'nowrap', gap: '2px', justifyContent: 'center', marginBottom: '2px' });
        const miniBetContainerBottomRow = document.createElement('div'); Object.assign(miniBetContainerBottomRow.style, { display: 'flex', flexWrap: 'nowrap', gap: '2px', justifyContent: 'center' });
        currentMartingaleBets.forEach((bet, i) => {
            let miniB = document.createElement('button'); miniB.textContent = formatNumberToKMB(bet); miniB.title = `$${bet.toLocaleString()}`;
            Object.assign(miniB.style, { background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius:'6px', padding: '3px 6px', cursor: 'pointer', fontSize: `${miniButtonSize}px`, width: 'auto' });
            miniB.onmouseenter = () => miniB.style.background = 'rgba(255,255,255,0.2)'; miniB.onmouseleave = () => miniB.style.background = 'rgba(255,255,255,0.1)';
            miniB.onclick = () => startMatch(bet);
            if (i < 6) miniBetContainerTopRow.appendChild(miniB); else miniBetContainerBottomRow.appendChild(miniB);
        });
        miniBar.appendChild(miniBetContainerTopRow); miniBar.appendChild(miniBetContainerBottomRow);
    }
  }

  const makeCircle = (result, bet, index) => {
    const container = document.createElement('span');
    Object.assign(container.style, { display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%', backgroundColor: result === 'win' ? '#4CAF50' : '#E53935', marginRight: '2px', cursor: 'pointer', position: 'relative' });
    container.title = `${result.toUpperCase()}: $${bet.toLocaleString()}`;
    container.addEventListener('click', (e) => {
        e.stopPropagation(); if (isDragging || isTwoFingerDragging) return;
        Array.from(container.children).forEach(child => { if (child.classList.contains('rr-temp-popup')) container.removeChild(child); });
        const tempPopup = document.createElement('div'); tempPopup.classList.add('rr-temp-popup'); tempPopup.textContent = `${result.toUpperCase()}: $${bet.toLocaleString()}`;
        Object.assign(tempPopup.style, { position: 'absolute', background: 'rgba(0,0,0,0.9)', border: '1px solid #555', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', whiteSpace: 'nowrap', zIndex: '10000000', top: '-28px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', opacity: '0', transition: 'opacity 0.2s ease-in-out' });
        container.appendChild(tempPopup);
        setTimeout(() => tempPopup.style.opacity = '1', 10);
        setTimeout(() => { tempPopup.style.opacity = '0'; setTimeout(() => { if (container.contains(tempPopup)) container.removeChild(tempPopup); }, 200); }, 1500);
    });
    return container;
  };

  function updateStatus() { statusDiv.textContent = collapsed ? '▪' : (roundActive ? '►' : '▸'); }

  function updatePanelVisibility() {
    const onRRPage = document.body.innerText.includes('POT MONEY') || document.body.innerText.includes('Waiting:') || document.body.innerText.includes('You take your winnings') || document.body.innerText.includes('BANG! You fall down');
    if (!autoHide) { panel.style.display = 'flex'; return; }
    panel.style.display = onRRPage ? 'none' : 'flex';
  }

  function refreshAll() {
    alertMessageDiv.style.display = 'none';
    let showAlert = false, alertText = '', alertBackgroundColor = '', alertBorderColor = '';
    if (lossLimit > 0 && totalProfit <= -lossLimit) { if (!alertShownLoss) { alertShownLoss = true; localStorage.setItem(ALERT_SHOWN_LOSS_KEY, 'true'); } showAlert = true; alertText = `🚨 LOSS LIMIT REACHED! -$${lossLimit.toLocaleString()}`; alertBackgroundColor = 'rgba(229, 57, 53, 0.8)'; alertBorderColor = '#E53935'; }
    else if (profitTarget > 0 && totalProfit >= profitTarget) { if (!alertShownProfit) { alertShownProfit = true; localStorage.setItem(ALERT_SHOWN_PROFIT_KEY, 'true'); } showAlert = true; alertText = `🎯 PROFIT TARGET REACHED! +$${profitTarget.toLocaleString()}`; alertBackgroundColor = 'rgba(76, 175, 80, 0.8)'; alertBorderColor = '#4CAF50'; }
    if (showAlert) { alertMessageDiv.textContent = alertText; Object.assign(alertMessageDiv.style, { background: alertBackgroundColor, borderColor: alertBorderColor, display: 'block' }); }
    const sign = totalProfit >= 0 ? '+' : '–';
    profitMini.textContent = `${sign}$${Math.abs(totalProfit).toLocaleString()}`;
    profitMini.style.color = totalProfit >= 0 ? '#4CAF50' : '#E53935';
    profitDiv.textContent  = `💰 Profit: ${sign}$${Math.abs(totalProfit).toLocaleString()}`;
    profitDiv.style.color  = totalProfit >= 0 ? '#4CAF50' : '#E53935';
    const wins = results.filter(r => r.result==='win').length;
    const tot  = results.length;
    winrateDiv.textContent = `🎯 Win Rate: ${tot?((wins/tot)*100).toFixed(1):'0.0'}% (${wins}/${tot})`;
    let w=0,l=0;
    for (const r of results) { if (r.result==='win') { if(l) break; w++; } else { if(w) break; l++; } }
    streakDiv.textContent = w?`🔥 Streak: ${w}`: l?`💀 Streak: ${l}`:'⏸️ No streak';
    resultsContainer.innerHTML = '';
    results.slice(0, maxDisplayMatches).forEach((r,i) => { const row = document.createElement('div'); row.append(makeCircle(r.result, r.bet, i), document.createTextNode(`${i+1}. ${r.result.toUpperCase()} — $${r.bet.toLocaleString()}`)); resultsContainer.appendChild(row); });
    statsGroup.style.display = 'none'; settingsPanel.style.display = 'none'; betsPanel.style.display = 'none'; editBetsPanel.style.display = 'none'; miniBar.style.display = 'none'; profitMini.style.display = 'none';
    settingsButton.style.display = 'none'; betsButton.style.display = 'none';
    if (showSettings) settingsPanel.style.display = 'flex';
    else if (showBetsPanel) betsPanel.style.display = 'flex';
    else if (showEditBetsPanel) editBetsPanel.style.display = 'flex';
    else if (collapsed) { miniBar.style.display = 'flex'; profitMini.style.display = 'block'; }
    else { statsGroup.style.display = 'flex'; settingsButton.style.display = 'inline-block'; betsButton.style.display = 'inline-block'; }
    buildBetButtons();
    updateStatus();
    updatePanelVisibility();
    updateChargedshootsPanelVisibility();
  }

  function addResult(type) {
    if (!roundActive) return;
    if (type === 'win') totalProfit += lastPot; else totalProfit -= lastPot;
    saveTotalProfit();
    results.unshift({ result: type, bet: lastPot });
    if (results.length > maxDisplayMatches) results.pop();
    saveResults();
    roundActive = false;
    hasTracked  = true;
    chargedshoots = 0; // Charges reset after each match
    // NEW: Save chargedshoots to localStorage after resetting on match end
    saveChargedshoots();
    updateChargedshootsDisplay();
    if (profitTarget > 0 && alertShownProfit && totalProfit < profitTarget) { alertShownProfit = false; localStorage.setItem(ALERT_SHOWN_PROFIT_KEY, 'false'); }
    if (lossLimit > 0 && alertShownLoss && totalProfit > -lossLimit) { alertShownLoss = false; localStorage.setItem(ALERT_SHOWN_LOSS_KEY, 'false'); }
    refreshAll();
  }

  function scanPot() {
    document.querySelectorAll('body *').forEach(el => { const txt = el.innerText?.trim(); if (txt?.includes('POT MONEY:$')) { const m = txt.match(/POT MONEY:\$\s*([\d,]+)/); if (m) lastPot = Math.floor(parseInt(m[1].replace(/,/g,''),10)/2); } });
  }

  function scanResult() {
    if (!roundActive) return;
    document.querySelectorAll('body *').forEach(el => { const txt = el.innerText?.trim(); if (txt?.includes('You take your winnings')) addResult('win'); if (txt?.includes('BANG! You fall down')) addResult('lose'); });
  }

  function scanStart() {
    if (hasTracked && (document.body.innerText.includes('Waiting:') || document.body.innerText.includes('Create Game') || document.querySelector('button.start-game'))) {
      roundActive = true; hasTracked = false; updateStatus();
    }
  }

  const savePos = () => localStorage.setItem(POS_KEY, JSON.stringify({ top: panel.style.top, left: panel.style.left }));
  function onDragMove(e) { if (!isDragging) return; e.preventDefault(); const moveEvent = e.touches ? e.touches[0] : e; if (typeof moveEvent.clientX === 'undefined') return; const dx = moveEvent.clientX - dragMouseX; const dy = moveEvent.clientY - dragMouseY; dragMouseX = moveEvent.clientX; dragMouseY = moveEvent.clientY; panel.style.left = (panel.offsetLeft + dx) + 'px'; panel.style.top  = (panel.offsetTop + dy) + 'px'; }
  function onDragEnd() { if (!isDragging) return; isDragging = false; document.removeEventListener('mousemove', onDragMove); document.removeEventListener('mouseup', onDragEnd); document.removeEventListener('touchmove', onDragMove); document.removeEventListener('touchend', onDragEnd); savePos(); panel.style.cursor = ''; document.body.style.cursor = ''; }
  function startDrag(e) { if (isTwoFingerDragging) return; e.preventDefault(); const startEvent = e.touches ? e.touches[0] : e; if (typeof startEvent.clientX === 'undefined') return; isDragging = true; dragMouseX = startEvent.clientX; dragMouseY = startEvent.clientY; panel.style.cursor = 'grabbing'; document.body.style.cursor = 'grabbing'; document.addEventListener('mousemove', onDragMove); document.addEventListener('mouseup', onDragEnd); document.addEventListener('touchmove', onDragMove, { passive: false }); document.addEventListener('touchend', onDragEnd); }
  dragHandle.addEventListener('mousedown', startDrag);
  dragHandle.addEventListener('touchstart', e => { if (e.touches.length === 1) startDrag(e); });
  panel.addEventListener('mousedown', e => { if (e.shiftKey && e.target !== dragHandle) startDrag(e); });
  panel.addEventListener('touchstart', e => { if (e.touches.length === 2) { e.preventDefault(); isTwoFingerDragging = true; isDragging = false; initialTouchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2; initialTouchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2; initialPanelX = panel.offsetLeft; initialPanelY = panel.offsetTop; panel.style.cursor = 'grabbing'; document.body.style.cursor = 'grabbing'; document.addEventListener('touchmove', onTwoFingerMove, { passive: false }); document.addEventListener('touchend', onTwoFingerEnd); } });
  function onTwoFingerMove(e) { if (!isTwoFingerDragging || e.touches.length !== 2) { onTwoFingerEnd(e); return; } e.preventDefault(); const currentTouchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2; const currentTouchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2; const dx = currentTouchMidX - initialTouchMidX; const dy = currentTouchMidY - initialTouchMidY; panel.style.left = (initialPanelX + dx) + 'px'; panel.style.top  = (initialPanelY + dy) + 'px'; }
  function onTwoFingerEnd(e) { if (!isTwoFingerDragging) return; if (e.touches.length < 2) { document.removeEventListener('touchmove', onTwoFingerMove); document.removeEventListener('touchend', onTwoFingerEnd); savePos(); isTwoFingerDragging = false; panel.style.cursor = ''; document.body.style.cursor = ''; } }

  const saveChargedshootsPos = () => localStorage.setItem(CHARGED_SHOOTS_POS_KEY, JSON.stringify({ top: chargedshootsPanel.style.top, left: chargedshootsPanel.style.left }));
  function onChargedPanelDragMove(e) { if (!isChargedPanelDragging) return; e.preventDefault(); const moveEvent = e.touches ? e.touches[0] : e; if (typeof moveEvent.clientX === 'undefined') return; const dx = moveEvent.clientX - dragChargedPanelMouseX; const dy = moveEvent.clientY - dragChargedPanelMouseY; dragChargedPanelMouseX = moveEvent.clientX; dragChargedPanelMouseY = moveEvent.clientY; chargedshootsPanel.style.left = (chargedshootsPanel.offsetLeft + dx) + 'px'; chargedshootsPanel.style.top = (chargedshootsPanel.offsetTop + dy) + 'px'; }
  function onChargedPanelDragEnd() { if (!isChargedPanelDragging) return; isChargedPanelDragging = false; document.removeEventListener('mousemove', onChargedPanelDragMove); document.removeEventListener('mouseup', onChargedPanelDragEnd); document.removeEventListener('touchmove', onChargedPanelDragMove); document.removeEventListener('touchend', onChargedPanelDragEnd); saveChargedshootsPos(); chargedshootsPanel.style.cursor = ''; document.body.style.cursor = ''; }
  function startChargedPanelDrag(e) { if (isChargedPanelTwoFingerDragging) return; e.preventDefault(); const startEvent = e.touches ? e.touches[0] : e; if (typeof startEvent.clientX === 'undefined') return; isChargedPanelDragging = true; dragChargedPanelMouseX = startEvent.clientX; dragChargedPanelMouseY = startEvent.clientY; chargedshootsPanel.style.cursor = 'grabbing'; document.body.style.cursor = 'grabbing'; document.addEventListener('mousemove', onChargedPanelDragMove); document.addEventListener('mouseup', onChargedPanelDragEnd); document.addEventListener('touchmove', onChargedPanelDragMove, { passive: false }); document.addEventListener('touchend', onChargedPanelDragEnd); }
  chargedshootsPanel.addEventListener('mousedown', e => { if (e.shiftKey) startChargedPanelDrag(e); });
  chargedshootsPanel.addEventListener('touchstart', e => { if (e.touches.length === 2) { e.preventDefault(); isChargedPanelTwoFingerDragging = true; isChargedPanelDragging = false; initialChargedPanelTouchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2; initialChargedPanelTouchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2; initialChargedPanelX = chargedshootsPanel.offsetLeft; initialChargedPanelY = chargedshootsPanel.offsetTop; chargedshootsPanel.style.cursor = 'grabbing'; document.body.style.cursor = 'grabbing'; document.addEventListener('touchmove', onChargedPanelTwoFingerMove, { passive: false }); document.addEventListener('touchend', onChargedPanelTwoFingerEnd); } });
  function onChargedPanelTwoFingerMove(e) { if (!isChargedPanelTwoFingerDragging || e.touches.length !== 2) { onChargedPanelTwoFingerEnd(e); return; } e.preventDefault(); const currentTouchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2; const currentTouchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2; const dx = currentTouchMidX - initialChargedPanelTouchMidX; const dy = currentTouchMidY - initialChargedPanelTouchMidY; chargedshootsPanel.style.left = (initialChargedPanelX + dx) + 'px'; chargedshootsPanel.style.top  = (initialChargedPanelY + dy) + 'px'; }
  function onChargedPanelTwoFingerEnd(e) { if (!isChargedPanelTwoFingerDragging) return; if (e.touches.length < 2) { document.removeEventListener('touchmove', onChargedPanelTwoFingerMove); document.removeEventListener('touchend', onChargedPanelTwoFingerEnd); saveChargedshootsPos(); isChargedPanelTwoFingerDragging = false; chargedshootsPanel.style.cursor = ''; document.body.style.cursor = ''; } }

  statusDiv.addEventListener('click', () => { if (isDragging || isTwoFingerDragging) return; collapsed = !collapsed; if (collapsed) { showSettings = false; showBetsPanel = false; showEditBetsPanel = false; } localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapsed)); refreshAll(); });
  alertMessageDiv.addEventListener('click', () => { alertMessageDiv.style.display = 'none'; });

  // --- Main Loop ---
  refreshAll();
  setInterval(() => {
    updatePanelVisibility();
    scanStart();
    scanPot();
    scanResult();
    updateChargedshootsPanelVisibility();
    performAutoShoot(); // This will now correctly trigger with a delay
  }, 500);

})();
