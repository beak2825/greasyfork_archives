// ==UserScript==
// @name         ShellShockers Crosshair Colors w/ Shotgun Retical Options. Disable/Enable Crosshair/Retical
// @namespace    http://youtube.com/c/BoseyCC/
// @version      4
// @description  Crosshair color + Enable/Disable Crosshair/Retical(Shotgun Crosshair) Shotgun Retical Color, Crosshair Color - with gradient options(Crosshair only)
// @author       BoseyCC
// @match        *://shellshock.io/*
// @match        *://algebra.best/*
// @match        *://algebra.monster/*
// @match        *://algebra.vip/*
// @match        *://biologyclass.club/*
// @match        *://deadlyegg.com/*
// @match        *://deathegg.life/*
// @match        *://deathegg.world/*
// @match        *://combateggs.com/*
// @match        *://egg.dance/*
// @match        *://eggboy.club/*
// @match        *://eggboy.me/*
// @match        *://eggboy.xyz/*
// @match        *://eggbattle.com/*
// @match        *://eggcombat.com/*
// @match        *://eggfacts.fun/*
// @match        *://egggames.best/*
// @match        *://egghead.institute/*
// @match        *://eggisthenewblack.com/*
// @match        *://eggsarecool.com/*
// @match        *://eggshock.com/*
// @match        *://eggshock.me/*
// @match        *://eggshock.net/*
// @match        *://eggshooter.best/*
// @match        *://eggshooter.com/*
// @match        *://eggwarfare.com/*
// @match        *://eggwars.io/*
// @match        *://geometry.best/*
// @match        *://geometry.monster/*
// @match        *://geometry.pw/*
// @match        *://geometry.report/*
// @match        *://hardboiled.life/*
// @match        *://hardshell.life/*
// @match        *://historicreview.com/*
// @match        *://humanorganising.org/*
// @match        *://mathactivity.club/*
// @match        *://mathactivity.xyz/*
// @match        *://mathdrills.info/*
// @match        *://mathdrills.life/*
// @match        *://mathfun.rocks/*
// @match        *://mathgames.world/*
// @match        *://math.international/*
// @match        *://mathlete.fun/*
// @match        *://mathlete.pro/*
// @match        *://overeasy.club/*
// @match        *://risenegg.com/*
// @match        *://scrambled.tech/*
// @match        *://scrambled.today/*
// @match        *://scrambled.us/*
// @match        *://scrambled.world/*
// @match        *://shellgame.me/*
// @match        *://shellplay.live/*
// @match        *://shellsocks.com/*
// @match        *://shellshock.guru/*
// @match        *://shellshockers.best/*
// @match        *://shellshockers.ca/*
// @match        *://shellshockers.club/*
// @match        *://shellshockers.life/*
// @match        *://shellshockers.site/*
// @match        *://shellshockers.today/*
// @match        *://shellshockers.us/*
// @match        *://shellshockers.website/*
// @match        *://shellshockers.wiki/*
// @match        *://shellshockers.world/*
// @match        *://shellshockers.xyz/*
// @match        *://shockers.one/*
// @match        *://softboiled.club/*
// @match        *://urbanegger.com/*
// @match        *://violentegg.club/*
// @match        *://violentegg.fun/*
// @match        *://yolk.best/*
// @match        *://yolk.life/*
// @match        *://yolk.monster/*
// @match        *://yolk.quest/*
// @match        *://yolk.rocks/*
// @match        *://yolk.tech/*
// @match        *://yolk.today/*
// @match        *://zygote.cafe/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/536146/ShellShockers%20Crosshair%20Colors%20w%20Shotgun%20Retical%20Options%20DisableEnable%20CrosshairRetical.user.js
// @updateURL https://update.greasyfork.org/scripts/536146/ShellShockers%20Crosshair%20Colors%20w%20Shotgun%20Retical%20Options%20DisableEnable%20CrosshairRetical.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CROSSHAIR_COLOR_KEY = 'ss_crosshairPrimary';
  const CROSSHAIR_GRADIENT_KEY = 'ss_crosshairGradient';
  const CROSSHAIR_DIR_KEY = 'ss_crosshairGradientDir';
  const CROSSHAIR_ENABLED_KEY = 'ss_crosshairEnabled';
  const CROSSHAIR_VISIBLE_KEY = 'ss_crosshairVisible';
  const SHOTGUN_COLOR_KEY = 'ss_shotgunReticleColor';
  const SHOTGUN_VISIBLE_KEY = 'ss_shotgunVisible';

  const DEFAULT_PRIMARY = '#ffffff';
  const DEFAULT_GRADIENT = '#00ffff';
  const DEFAULT_DIR = 'none';
  const DEFAULT_SHOTGUN = '#ff0000';

  let overlay = null;

  function addTooltip(btn, text) {
    const tooltip = document.createElement('div');
    tooltip.textContent = text;
    Object.assign(tooltip.style, {
      position: 'absolute',
      top: '100%', // below button
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: '0.3em',
      backgroundColor: 'transparent',
      color: 'darkred',
      fontSize: '0.75em',
      fontWeight: 'normal',
      whiteSpace: 'nowrap',
      opacity: '0',
      pointerEvents: 'none',
      transition: 'opacity 0.3s ease',
      userSelect: 'none',
      zIndex: '16000',
    });
    btn.style.position = 'relative';
    btn.appendChild(tooltip);
    btn.addEventListener('mouseenter', () => { tooltip.style.opacity = '1'; });
    btn.addEventListener('mouseleave', () => { tooltip.style.opacity = '0'; });
  }

  function applyCrosshairStyle() {
    const enabled = localStorage.getItem(CROSSHAIR_ENABLED_KEY) !== 'false';
    const visible = localStorage.getItem(CROSSHAIR_VISIBLE_KEY) !== 'false';
    const primary = localStorage.getItem(CROSSHAIR_COLOR_KEY) || DEFAULT_PRIMARY;
    const gradient = localStorage.getItem(CROSSHAIR_GRADIENT_KEY) || DEFAULT_GRADIENT;
    const dir = localStorage.getItem(CROSSHAIR_DIR_KEY) || DEFAULT_DIR;

    const crosshairs = document.querySelectorAll('#crosshairContainer .crosshair');
    const container = document.querySelector('#crosshairContainer');

    if (!container || !crosshairs.length) return;

    if (!visible) {
      container.style.display = 'none';
      return;
    } else {
      container.style.display = '';
    }

    const gradientStyle = dir === 'none'
      ? primary
      : `linear-gradient(${dir === 'cto' ? 'to bottom' : ''}, ${primary}, ${gradient})`;

    crosshairs.forEach(el => {
      if (!enabled) {
        el.style.background = '';
      } else {
        el.style.background = gradientStyle;
        el.style.backgroundClip = 'border-box';
        el.style.webkitBackgroundClip = 'border-box';
      }
    });
  }

  function applyShotgunStyle() {
    const color = localStorage.getItem(SHOTGUN_COLOR_KEY) || DEFAULT_SHOTGUN;
    const visible = localStorage.getItem(SHOTGUN_VISIBLE_KEY) !== 'false';

    document.querySelectorAll('.shotReticle.border.normal, .shotReticle.fill.normal').forEach(el => {
      el.style.borderColor = color;
      el.style.borderLeftColor = 'transparent';
      el.style.borderRightColor = 'transparent';
      el.style.backgroundColor = 'transparent';
      el.style.display = visible ? '' : 'none';
    });
  }

  function applyAll() {
    applyCrosshairStyle();
    applyShotgunStyle();
  }

  function createOverlay() {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.className = 'popup_window popup_lg centered roundme_md';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: '15000',
      background: 'var(--ss-popupbackground)',
      boxShadow: '0 0 2em rgba(0,0,0,0.8)',
      padding: '1.5em',
      borderRadius: '1em',
      width: '500px',
      maxWidth: '95vw',
      color: 'var(--ss-white)',
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none',
      visibility: 'hidden',
      opacity: '0',
      transition: 'opacity 0.3s ease',
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'popup_close clickme roundme_sm';
    Object.assign(closeBtn.style, {
      position: 'absolute',
      top: '0.5em',
      right: '0.5em',
      background: 'none',
      border: 'none',
      color: 'var(--ss-white)',
      fontSize: '1.6em',
      cursor: 'pointer',
    });
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => hideOverlay();
    overlay.appendChild(closeBtn);
    // no tooltip on close button

    const title = document.createElement('h2');
    title.textContent = 'Scrambler / Crosshair Colors';
    Object.assign(title.style, {
      margin: '0 0 1em 0',
      fontFamily: '"Sigmar One", sans-serif',
      fontWeight: 'normal',
      textAlign: 'center',
      color: 'white',
    });
    overlay.appendChild(title);

    function createToggle(labelText, key, tooltipText) {
      const row = document.createElement('div');
      Object.assign(row.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5em',
      });

      const label = document.createElement('span');
      label.textContent = labelText;
      row.appendChild(label);

      const btn = document.createElement('button');
      btn.className = 'ss_button btn_yolk bevel_yolk btn_md';

      const updateStyleAndText = () => {
        const val = localStorage.getItem(key);
        const isOn = val !== 'false';
        btn.textContent = isOn ? '✔' : '❌';
        if (isOn) {
          btn.style.backgroundColor = 'var(--ss-yellow)';
          btn.style.color = 'black';
        } else {
          btn.style.backgroundColor = 'var(--ss-red)';
          btn.style.color = 'white';
        }
      };

      btn.onclick = () => {
        const current = localStorage.getItem(key);
        const nowOn = current === 'false';
        localStorage.setItem(key, nowOn);
        updateStyleAndText();
        applyAll();
      };

      updateStyleAndText();
      row.appendChild(btn);

      addTooltip(btn, tooltipText);

      return row;
    }

    overlay.appendChild(createToggle('Enable Crosshair Coloring', CROSSHAIR_ENABLED_KEY, 'Toggle coloring effect on crosshair'));
    overlay.appendChild(createToggle('Show Crosshair', CROSSHAIR_VISIBLE_KEY, 'Toggle crosshair visibility'));
    overlay.appendChild(createToggle('Show Shotgun Reticle', SHOTGUN_VISIBLE_KEY, 'Toggle shotgun reticle visibility'));

    function createColorPicker(labelText, key, def, tooltipText) {
      const label = document.createElement('label');
      label.textContent = labelText;
      Object.assign(label.style, {
        marginBottom: '0.5em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '1rem',
      });

      const input = document.createElement('input');
      input.type = 'color';
      input.value = localStorage.getItem(key) || def;
      Object.assign(input.style, {
        width: '3em',
        height: '2em',
        cursor: 'pointer',
      });

      input.addEventListener('input', () => {
        localStorage.setItem(key, input.value);
        applyAll();
      });

      label.appendChild(input);

      addTooltip(input, tooltipText);

      return label;
    }

    overlay.appendChild(createColorPicker('Crosshair Base Color:', CROSSHAIR_COLOR_KEY, DEFAULT_PRIMARY, 'Select the base color of the crosshair'));
    overlay.appendChild(createColorPicker('Gradient Color:', CROSSHAIR_GRADIENT_KEY, DEFAULT_GRADIENT, 'Select the gradient color for the crosshair'));

    const gradientLabel = document.createElement('h3');
    gradientLabel.textContent = 'Gradient Options';
    Object.assign(gradientLabel.style, {
      marginTop: '1em',
      fontSize: '1.2em',
      borderBottom: '1px solid var(--ss-white)',
      paddingBottom: '0.3em',
      color: 'white',
    });
    overlay.appendChild(gradientLabel);

    const dirContainer = document.createElement('div');
    Object.assign(dirContainer.style, {
      display: 'flex',
      gap: '0.5em',
      marginBottom: '1em',
      position: 'relative',
    });

    const solidBtn = document.createElement('button');
    solidBtn.textContent = 'Solid';
    solidBtn.className = 'ss_button btn_yolk bevel_yolk btn_md';
    dirContainer.appendChild(solidBtn);
    addTooltip(solidBtn, 'Use solid crosshair color without gradient');

    const ctoBtn = document.createElement('button');
    ctoBtn.textContent = 'CTO Gradient';
    ctoBtn.className = 'ss_button btn_yolk bevel_yolk btn_md';
    ctoBtn.style.position = 'relative';

    const tooltip = document.createElement('div');
    tooltip.textContent = 'Center to outwards Gradient';
    Object.assign(tooltip.style, {
      position: 'absolute',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      marginTop: '0.3em',
      backgroundColor: 'transparent',
      color: 'darkred',
      fontSize: '0.75em',
      fontWeight: 'normal',
      whiteSpace: 'nowrap',
      opacity: '0',
      pointerEvents: 'none',
      transition: 'opacity 0.3s ease',
      userSelect: 'none',
      zIndex: '16000',
    });
    ctoBtn.appendChild(tooltip);

    ctoBtn.addEventListener('mouseenter', () => { tooltip.style.opacity = '1'; });
    ctoBtn.addEventListener('mouseleave', () => { tooltip.style.opacity = '0'; });
    addTooltip(ctoBtn, 'Gradient from center to outwards');

    dirContainer.appendChild(ctoBtn);

    function updateButtons() {
      const dir = localStorage.getItem(CROSSHAIR_DIR_KEY) || DEFAULT_DIR;
      if (dir === 'none') {
        solidBtn.style.backgroundColor = 'var(--ss-yellow)';
        solidBtn.style.color = 'black';
        ctoBtn.style.backgroundColor = 'var(--ss-yolk)';
        ctoBtn.style.color = 'black';
      } else if (dir === 'cto') {
        ctoBtn.style.backgroundColor = 'var(--ss-yellow)';
        ctoBtn.style.color = 'black';
        solidBtn.style.backgroundColor = 'var(--ss-yolk)';
        solidBtn.style.color = 'black';
      }
    }

    solidBtn.onclick = () => {
      localStorage.setItem(CROSSHAIR_DIR_KEY, 'none');
      updateButtons();
      applyAll();
    };

    ctoBtn.onclick = () => {
      localStorage.setItem(CROSSHAIR_DIR_KEY, 'cto');
      updateButtons();
      applyAll();
    };

    updateButtons();
    overlay.appendChild(dirContainer);

    overlay.appendChild(createColorPicker('Shotgun Reticle Color:', SHOTGUN_COLOR_KEY, DEFAULT_SHOTGUN, 'Select the color of the shotgun reticle'));

    document.body.appendChild(overlay);
    applyAll();
  }

  function showOverlay() {
    if (!overlay) createOverlay();
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
  }

  function hideOverlay() {
    if (!overlay) return;
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.visibility = 'hidden';
    }, 300);
  }

  function addButtonToSettings() {
    const settingsPopup = document.getElementById('settingsPopup');
    if (!settingsPopup) return;

    const container = settingsPopup.querySelector('#popupInnards') || settingsPopup;
    if (document.getElementById('ss_crosshair_settings_btn')) return;

    const btn = document.createElement('button');
    btn.id = 'ss_crosshair_settings_btn';
    btn.textContent = 'Scrambler / Crosshair Colors';
    btn.className = 'ss_button btn_yolk bevel_yolk btn_md';
    Object.assign(btn.style, {
      display: 'block',
      width: '100%',
      marginTop: '1.5em',
      cursor: 'pointer',
    });

    btn.onclick = () => {
      if (!overlay || overlay.style.visibility === 'hidden') {
        showOverlay();
      } else {
        hideOverlay();
      }
    };

    container.appendChild(btn);
  }

  const settingsObserver = new MutationObserver(() => {
    if (document.getElementById('settingsPopup')) {
      addButtonToSettings();
    }
  });

  settingsObserver.observe(document.body, { childList: true, subtree: true });

  if (document.getElementById('settingsPopup')) {
    addButtonToSettings();
  }
})();


(function () {
  'use strict';

  const CROSSHAIR_COLOR_KEY = 'ss_crosshairPrimary';
  const CROSSHAIR_GRADIENT_KEY = 'ss_crosshairGradient';
  const CROSSHAIR_DIR_KEY = 'ss_crosshairGradientDir';
  const CROSSHAIR_ENABLED_KEY = 'ss_crosshairEnabled';
  const CROSSHAIR_VISIBLE_KEY = 'ss_crosshairVisible';
  const SHOTGUN_COLOR_KEY = 'ss_shotgunReticleColor';

  const DEFAULT_PRIMARY = '#ffffff';
  const DEFAULT_GRADIENT = '#00ffff';
  const DEFAULT_DIR = 'none';
  const DEFAULT_SHOTGUN = '#ff0000';

  let overlay = null;

  function applyCrosshairStyle() {
    const enabled = localStorage.getItem(CROSSHAIR_ENABLED_KEY) !== 'false';
    const visible = localStorage.getItem(CROSSHAIR_VISIBLE_KEY) !== 'false';
    const primary = localStorage.getItem(CROSSHAIR_COLOR_KEY) || DEFAULT_PRIMARY;
    const gradient = localStorage.getItem(CROSSHAIR_GRADIENT_KEY) || DEFAULT_GRADIENT;
    const dir = localStorage.getItem(CROSSHAIR_DIR_KEY) || DEFAULT_DIR;

    const crosshairs = document.querySelectorAll('#crosshairContainer .crosshair');
    const container = document.querySelector('#crosshairContainer');

    if (!container || !crosshairs.length) return;

    if (!visible) {
      container.style.display = 'none';
      return;
    } else {
      container.style.display = '';
    }

    const gradientStyle = dir === 'none'
      ? primary
      : `linear-gradient(${dir === 'cto' ? 'to bottom' : ''}, ${primary}, ${gradient})`;

    crosshairs.forEach(el => {
      if (!enabled) {
        el.style.background = '';
      } else {
        el.style.background = gradientStyle;
        el.style.backgroundClip = 'border-box';
        el.style.webkitBackgroundClip = 'border-box';
      }
    });
  }

  function applyShotgunStyle() {
    const color = localStorage.getItem(SHOTGUN_COLOR_KEY) || DEFAULT_SHOTGUN;
    document.querySelectorAll('.shotReticle.border.normal, .shotReticle.fill.normal').forEach(el => {
      el.style.borderColor = color;
      el.style.borderLeftColor = 'transparent';
      el.style.borderRightColor = 'transparent';
      el.style.backgroundColor = 'transparent';
    });
  }

  function applyAll() {
    applyCrosshairStyle();
    applyShotgunStyle();
  }

  function createOverlay() {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.className = 'popup_window popup_lg centered roundme_md';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: '15000',
      background: 'var(--ss-popupbackground)',
      boxShadow: '0 0 2em rgba(0,0,0,0.8)',
      padding: '1.5em',
      borderRadius: '1em',
      width: '500px',
      maxWidth: '95vw',
      color: 'var(--ss-white)',
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none',
      visibility: 'hidden',
      opacity: '0',
      transition: 'opacity 0.3s ease',
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'popup_close clickme roundme_sm';
    Object.assign(closeBtn.style, {
      position: 'absolute',
      top: '0.5em',
      right: '0.5em',
      background: 'none',
      border: 'none',
      color: 'var(--ss-white)',
      fontSize: '1.6em',
      cursor: 'pointer',
    });
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => hideOverlay();
    overlay.appendChild(closeBtn);

    const title = document.createElement('h2');
    title.textContent = 'Scrambler / Crosshair Colors';
    Object.assign(title.style, {
      margin: '0 0 1em 0',
      fontFamily: '"Sigmar One", sans-serif',
      fontWeight: 'normal',
      textAlign: 'center',
    });
    overlay.appendChild(title);

    function createToggle(labelText, key) {
      const row = document.createElement('div');
      Object.assign(row.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5em',
      });

      const label = document.createElement('span');
      label.textContent = labelText;
      row.appendChild(label);

      const btn = document.createElement('button');
      btn.className = 'ss_button btn_yolk bevel_yolk btn_md';

      const updateText = () => {
        const val = localStorage.getItem(key);
        const isOn = val !== 'false';
        btn.textContent = isOn ? '✔' : '❌';
      };

      btn.onclick = () => {
        const current = localStorage.getItem(key);
        const nowOn = current === 'false';
        localStorage.setItem(key, nowOn);
        updateText();
        applyAll();
      };

      updateText();
      row.appendChild(btn);
      return row;
    }

    overlay.appendChild(createToggle('Enable Crosshair Coloring', CROSSHAIR_ENABLED_KEY));
    overlay.appendChild(createToggle('Show Crosshair', CROSSHAIR_VISIBLE_KEY));

    function createColorPicker(labelText, key, def) {
      const label = document.createElement('label');
      label.textContent = labelText;
      Object.assign(label.style, {
        marginBottom: '0.5em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '1rem',
      });

      const input = document.createElement('input');
      input.type = 'color';
      input.value = localStorage.getItem(key) || def;
      Object.assign(input.style, {
        width: '3em',
        height: '2em',
        cursor: 'pointer',
      });

      input.addEventListener('input', () => {
        localStorage.setItem(key, input.value);
        applyAll();
      });

      label.appendChild(input);
      return label;
    }

    overlay.appendChild(createColorPicker('Crosshair Base Color:', CROSSHAIR_COLOR_KEY, DEFAULT_PRIMARY));
    overlay.appendChild(createColorPicker('Gradient Color:', CROSSHAIR_GRADIENT_KEY, DEFAULT_GRADIENT));

    const gradientLabel = document.createElement('h3');
    gradientLabel.textContent = 'Gradient Options';
    Object.assign(gradientLabel.style, {
      marginTop: '1em',
      fontSize: '1.2em',
      borderBottom: '1px solid var(--ss-white)',
      paddingBottom: '0.3em',
    });
    overlay.appendChild(gradientLabel);

    // Gradient direction container
    const dirContainer = document.createElement('div');
    Object.assign(dirContainer.style, {
      display: 'flex',
      gap: '0.5em',
      marginBottom: '1em',
      position: 'relative',
    });

    // Solid button
    const solidBtn = document.createElement('button');
    solidBtn.textContent = 'Solid';
    solidBtn.className = 'ss_button btn_yolk bevel_yolk btn_md';
    dirContainer.appendChild(solidBtn);

    // CTO Gradient button with tooltip
    const ctoBtn = document.createElement('button');
    ctoBtn.textContent = 'CTO Gradient';
    ctoBtn.className = 'ss_button btn_yolk bevel_yolk btn_md';
    ctoBtn.style.position = 'relative';

    // Tooltip element
    const tooltip = document.createElement('div');
    tooltip.textContent = 'Center to outwards Gradient';
    Object.assign(tooltip.style, {
      position: 'absolute',
      bottom: '-1.8em',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'transparent',
      color: 'darkred',
      fontSize: '0.75em',
      fontWeight: 'normal',
      whiteSpace: 'nowrap',
      opacity: '0',
      pointerEvents: 'none',
      transition: 'opacity 0.6s ease',
      userSelect: 'none',
      zIndex: '16000',
    });
    ctoBtn.appendChild(tooltip);

    ctoBtn.addEventListener('mouseenter', () => {
      tooltip.style.opacity = '1';
    });
    ctoBtn.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });

    dirContainer.appendChild(ctoBtn);

    // Set button states based on localStorage
    function updateButtons() {
      const dir = localStorage.getItem(CROSSHAIR_DIR_KEY) || DEFAULT_DIR;
      if (dir === 'none') {
        solidBtn.style.backgroundColor = 'var(--ss-yellow)';
        solidBtn.style.color = 'black';
        ctoBtn.style.backgroundColor = 'var(--ss-yolk)';
        ctoBtn.style.color = 'black';
      } else if (dir === 'cto') {
        ctoBtn.style.backgroundColor = 'var(--ss-yellow)';
        ctoBtn.style.color = 'black';
        solidBtn.style.backgroundColor = 'var(--ss-yolk)';
        solidBtn.style.color = 'black';
      }
    }

    solidBtn.onclick = () => {
      localStorage.setItem(CROSSHAIR_DIR_KEY, 'none');
      updateButtons();
      applyAll();
    };

    ctoBtn.onclick = () => {
      localStorage.setItem(CROSSHAIR_DIR_KEY, 'cto');
      updateButtons();
      applyAll();
    };

    updateButtons();
    overlay.appendChild(dirContainer);

    overlay.appendChild(createColorPicker('Shotgun Reticle Color:', SHOTGUN_COLOR_KEY, DEFAULT_SHOTGUN));

    document.body.appendChild(overlay);
    applyAll();
  }

  function showOverlay() {
    if (!overlay) createOverlay();
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
  }

  function hideOverlay() {
    if (!overlay) return;
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.visibility = 'hidden';
    }, 300);
  }

  function addButtonToSettings() {
    const settingsPopup = document.getElementById('settingsPopup');
    if (!settingsPopup) return;

    const container = settingsPopup.querySelector('#popupInnards') || settingsPopup;
    if (document.getElementById('ss_crosshair_settings_btn')) return;

    const btn = document.createElement('button');
    btn.id = 'ss_crosshair_settings_btn';
    btn.textContent = 'Scrambler / Crosshair Colors';
    btn.className = 'ss_button btn_yolk bevel_yolk btn_md';
    Object.assign(btn.style, {
      display: 'block',
      width: '100%',
      marginTop: '1.5em',
      cursor: 'pointer',
    });

    btn.onclick = () => {
      if (!overlay || overlay.style.visibility === 'hidden') {
        showOverlay();
      } else {
        hideOverlay();
      }
    };

    container.appendChild(btn);
  }

  const observer = new MutationObserver(() => {
    if (document.getElementById('settingsPopup')) {
      addButtonToSettings();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  if (document.getElementById('settingsPopup')) {
    addButtonToSettings();
  }
})();