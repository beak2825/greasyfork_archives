// ==UserScript==
// @name         youtube
// @namespace    http://tampermonkey.net/
// @version      1.22
// @description  Adds theme and gem color switching with modern UI enhancements.
// @match        youtube.com
// @license      You cannot use this, only use this for education 
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/538593/youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/538593/youtube.meta.js
// ==/UserScript==

(function() {
  'use strict';
//BERGER


  const themes = [
    { name: "Sky", glow: "#00bfff", bg: "rgba(0, 191, 255, 0.25)", text: "#e0f7ff" },
    { name: "Ocean", glow: "#1e90ff", bg: "rgba(30, 144, 255, 0.25)", text: "#d6f0ff" },
    { name: "Cyan", glow: "#00ffff", bg: "rgba(0, 255, 255, 0.25)", text: "#e0ffff" },
    { name: "Azure", glow: "#007fff", bg: "rgba(0, 127, 255, 0.25)", text: "#e0f0ff" },
    { name: "Aqua", glow: "#7fdbff", bg: "rgba(127, 219, 255, 0.25)", text: "#e0f9ff" },
    { name: "Gold", glow: "#ffd700", bg: "rgba(255, 215, 0, 0.25)", text: "#fff9e0" },
    { name: "Ivory", glow: "#fffff0", bg: "rgba(255, 255, 240, 0.25)", text: "#000" },
    { name: "Mint", glow: "#3eb489", bg: "rgba(62, 180, 137, 0.25)", text: "#e0ffe5" },
    { name: "Forest", glow: "#228b22", bg: "rgba(34, 139, 34, 0.25)", text: "#e0ffe0" },
    { name: "Lime", glow: "#32cd32", bg: "rgba(50, 205, 50, 0.25)", text: "#f0ffe0" },
    { name: "Teal", glow: "#008080", bg: "rgba(0, 128, 128, 0.25)", text: "#e0ffff" },
    { name: "Emerald", glow: "#50c878", bg: "rgba(80, 200, 120, 0.25)", text: "#e0fff0" },
    { name: "Charcoal", glow: "#36454f", bg: "rgba(54, 69, 79, 0.25)", text: "#f0f0f0" },
    { name: "Slate", glow: "#708090", bg: "rgba(112, 128, 144, 0.25)", text: "#f0f0f0" },
    { name: "Copper", glow: "#b87333", bg: "rgba(184, 115, 51, 0.25)", text: "#fff0e0" },
    { name: "Rose Gold", glow: "#b76e79", bg: "rgba(183, 110, 121, 0.25)", text: "#fce8e0" },
    { name: "Walnut", glow: "#8b5a2b", bg: "rgba(139, 90, 43, 0.25)", text: "#f0e0d6" },
    { name: "Chocolate", glow: "#d2691e", bg: "rgba(210, 105, 30, 0.25)", text: "#fff0e0" },
    { name: "Chestnut", glow: "#954535", bg: "rgba(149, 69, 53, 0.25)", text: "#f5e0d0" },
    { name: "Saddle", glow: "#8b4513", bg: "rgba(139, 69, 19, 0.25)", text: "#f5e6d6" },
    { name: "Coffee", glow: "#4b3621", bg: "rgba(75, 54, 33, 0.25)", text: "#f5f0e0" }
  ];


  const coffeeButton = document.createElement('div');
  coffeeButton.classList.add('sbg-btn');
  coffeeButton.innerHTML = '<i style="font-size: 24px;">☕️</i>';
  coffeeButton.style.cursor = 'pointer';
  coffeeButton.addEventListener('click', () => alert('☕️ Coffee button clicked!'));

  const infoElement = document.querySelector('.sbg.sbg-info');
  const gearsElement = document.querySelector('.sbg.sbg-gears');
  if (infoElement && gearsElement && infoElement.parentNode === gearsElement.parentNode) {
    gearsElement.insertAdjacentElement('afterend', coffeeButton);
  }

  // === Gem Color Button ===
  const gemColors = [
    { name: 'Default', color: null },
    { name: 'Ruby Red', color: [1.0, 0.2, 0.2] },
    { name: 'Emerald Green', color: [0.2, 1.0, 0.4] },
    { name: 'Sapphire Blue', color: [0.2, 0.6, 1.0] },
    { name: 'Amethyst Purple', color: [0.6, 0.2, 1.0] },
    { name: 'Gold', color: [1.0, 0.85, 0.25] },
    { name: 'Void Black', color: [0.05, 0.05, 0.05] },
    { name: 'Neon Pink', color: [1.0, 0.1, 0.9] }
  ];

  let gemColorIndex = parseInt(localStorage.getItem('sb_gem_color_index') || '0');

  function applyGemColor(index) {
    const colorVec = gemColors[index].color;
    if (!window.sbar || !window.sbar.GemMesh || typeof PIXI === 'undefined') return;

    if (!colorVec) {
      sbar.GemMesh.prototype.initOverride = null;
      return;
    }

    sbar.GemMesh.prototype.initOverride = function () {
      if (!this.material || !this.material.uniforms) return;
      this.material.uniforms.color = { value: new PIXI.Point(...colorVec) };
    };
  }

  const gemBtn = document.createElement('div');
  gemBtn.classList.add('sbg-btn');
  gemBtn.innerHTML = '<i style="font-size: 20px;">💎</i>';
  gemBtn.style.cursor = 'pointer';
  gemBtn.title = `Gem Color: ${gemColors[gemColorIndex].name}`;
  gemBtn.addEventListener('click', () => {
    gemColorIndex = (gemColorIndex + 1) % gemColors.length;
    localStorage.setItem('sb_gem_color_index', gemColorIndex);
    applyGemColor(gemColorIndex);
    gemBtn.title = `Gem Color: ${gemColors[gemColorIndex].name}`;
  });

  if (gearsElement && coffeeButton) {
    coffeeButton.insertAdjacentElement('afterend', gemBtn);
  }

  const shaderInit = setInterval(() => {
    if (window.sbar && sbar.GemMesh && window.PIXI) {
      applyGemColor(gemColorIndex);
      clearInterval(shaderInit);
    }
  }, 500);

  // === Styling ===
  GM_addStyle(`
    .sbg.sbg-info,
    .sbg.sbg-gears,
    .sbg-btn {
      background: none !important;
    }
    .sbg-btn {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      box-shadow: 0 0 15px 3px #00bfff;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      margin-left: 5px;
    }
    .sbg-btn i {
      color: #fff;
    }
  `);

  // === Original theme system ===
  let currentThemeIndex = parseInt(localStorage.getItem('sb_theme_index') || 1);

  function removePlayBtnGlow() {
    const oldStyles = document.querySelectorAll('[id^="sb_glow_fix_"]');
    oldStyles.forEach(el => el.remove());
  }

  function addGlowForSpecialClasses(theme) {
    removePlayBtnGlow();
    const style = document.createElement("style");
    style.id = `sb_glow_fix_${Date.now()}`;
    style.textContent = `
      .playbtn, .noselect, .PLAY, .play,
      [data-translate="Team Mode"],
      [data-translate="Survival Mode"],
      [data-translate="Invasion"],
      [data-translate="Pro Deathmatch"],
      [data-translate="Create custom game"] {
        color: ${theme.glow} !important;
        text-shadow:
          0 0 5px ${theme.glow},
          0 0 10px ${theme.glow},
          0 0 20px ${theme.glow} !important;
        background: transparent !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        padding: 0 !important;
        backdrop-filter: none !important;
        transition: color 0.3s ease, text-shadow 0.3s ease !important;
      }
    `;
    document.head.appendChild(style);
  }

  function applyTheme(theme) {
    GM_addStyle(`
      @import url('https://fonts.googleapis.com/css2?family=Exo:wght@400;700&display=swap');
      body, :not(i):not([class*="fa-"]):not([class*="icon-"]):not(.material-icons) {
        font-family: 'Exo', sans-serif !important;
      }
      .changelog-new, .textcentered.community, .sbg-info, .sbg-gears, .developer, .header,
      .modalbody, .option, .big, .modal, .inputwrapper, .gmodes, .play, .playbtn, .noselect,
      .optioncontainer, .settings-content, .optioncontainerwrapper {
        background-color: ${theme.bg} !important;
        border-radius: 12px !important;
        box-shadow: 0 0 15px 3px ${theme.glow} !important;
        backdrop-filter: blur(35px) !important;
        color: ${theme.text} !important;
      }
      .changelog-new *, .textcentered.community *, .sbg-info *, .sbg-gears *, .developer *,
      .header *, .modalbody *, .option *, .big *, .modal *, .inputwrapper *, .gmodes *,
      .play *, .optioncontainer *, .settings-content *, .optioncontainerwrapper * {
        background: none !important;
        color: ${theme.text} !important;
      }
      .fa.fa-caret-right, .fa.fa-caret-left, player {
        color: ${theme.glow} !important;
        text-shadow: 0 0 8px ${theme.glow}, 0 0 16px ${theme.glow}, 0 0 24px ${theme.glow} !important;
      }
      .developer, .header, .option, .big, .modal, .inputwrapper, .gmodes, .play,
      .leaderboard, .elitepass, .modding-space {
        background: none !important;
        border: none !important;
        box-shadow: none !important;
        color: ${theme.glow} !important;
        text-shadow: 0 0 10px ${theme.glow}, 0 0 20px ${theme.glow}, 0 0 30px ${theme.glow} !important;
      }
      .developer *, .header *, .option *, .big *, .modal *, .inputwrapper *,
      .gmodes *, .play *, [data-translate="PLAY"] *, .leaderboard *, .elitepass *, .modding-space * {
        background: none !important;
        border: none !important;
        color: ${theme.glow} !important;
        text-shadow: 0 0 10px ${theme.glow}, 0 0 20px ${theme.glow}, 0 0 30px ${theme.glow} !important;
      }
    `);
    addGlowForSpecialClasses(theme);
  }

  applyTheme(themes[currentThemeIndex]);

  const switchBtn = document.createElement('button');
  switchBtn.textContent = `Theme: ${themes[currentThemeIndex].name}`;
  const savedPos = JSON.parse(localStorage.getItem('sb_theme_btn_pos') || '{}');
  Object.assign(switchBtn.style, {
    position: 'fixed',
    left: savedPos.left || '',
    top: savedPos.top || '',
    bottom: savedPos.bottom || '10px',
    right: savedPos.right || '10px',
    zIndex: '9999',
    padding: '8px 14px',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid #fff',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'move',
    fontSize: '14px',
    backdropFilter: 'blur(5px)',
    boxShadow: '0 0 10px #000'
  });
  document.body.appendChild(switchBtn);

  switchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    localStorage.setItem('sb_theme_index', currentThemeIndex);
    applyTheme(themes[currentThemeIndex]);
    switchBtn.textContent = `Theme: ${themes[currentThemeIndex].name}`;
  });

  switchBtn.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    currentThemeIndex = (currentThemeIndex - 1 + themes.length) % themes.length;
    localStorage.setItem('sb_theme_index', currentThemeIndex);
    applyTheme(themes[currentThemeIndex]);
    switchBtn.textContent = `Theme: ${themes[currentThemeIndex].name}`;
  });

  let isDragging = false;
  let offsetX, offsetY;
  switchBtn.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - switchBtn.getBoundingClientRect().left;
    offsetY = e.clientY - switchBtn.getBoundingClientRect().top;
  });
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      switchBtn.style.left = `${e.clientX - offsetX}px`;
      switchBtn.style.top = `${e.clientY - offsetY}px`;
      switchBtn.style.bottom = 'auto';
      switchBtn.style.right = 'auto';
    }
  });
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      localStorage.setItem('sb_theme_btn_pos', JSON.stringify({
        left: switchBtn.style.left,
        top: switchBtn.style.top,
        right: 'auto',
        bottom: 'auto'
      }));
      isDragging = false;
    }
  });

  document.querySelectorAll('.Training, .training').forEach(el => el.remove());
  document.querySelectorAll('[data-translate-base="music"], .sbg.sbg-facebook, .sbg.sbg-twitter, .sbg.sbg-fw.sbg-fly-mid').forEach(el => el.remove());
  const bottomMenu = document.querySelector('.sbg-discord')?.parentElement;
  document.querySelectorAll('.developer').forEach(btn => bottomMenu?.appendChild(btn));
  document.querySelectorAll('.sbg-container > div:not([data-translate-base="music"])').forEach(el => {
    if (!el.classList.contains('developer') && bottomMenu && !bottomMenu.contains(el)) {
      bottomMenu.appendChild(el);
    }
  });
})();
