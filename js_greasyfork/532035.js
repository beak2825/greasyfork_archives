// ==UserScript==
// @name         Shredsauce dark Theme
// @namespace    stylish
// @version      2.0.5Beta
// @description  All black dark theme for Shredsauce by Gheat
// @include      *://shredsauce.com/*
// @include      *://example.com/*
// @include      *://suikagame.io/shredsauce/*
// @include      *://web.archive.org/web/20250216060913/https://www.shredsauce.com/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @license      CC BY-NC-ND 4.0
// @icon         https://github.com/Gheat1/Gheat.net/blob/main/favicon.png?raw=true
// @homepage     https://gheat.net/shredsauce/scripts
// @downloadURL https://update.greasyfork.org/scripts/532035/Shredsauce%20dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/532035/Shredsauce%20dark%20Theme.meta.js
// ==/UserScript==

// © 2025 Gheat. This script is licensed under CC BY-NC-ND 4.0
// https://creativecommons.org/licenses/by-nc-nd/4.0/
// You may use and share this script, but not modify or redistribute it without permission.

(function() {
    /********** Base CSS **********/
    const baseCSS = `
    /* General dark background & text */
    html, body {
  background-color: #000 !important; color: #fff !important; font-family: Arial, sans-serif !important;}
    mobileContainer, #webContainer, .scroll-section, .carousel, .navbar, footer, #contentContainer, #playerContainerOverlay {
      background-color: #000 !important; color: #fff !important;
    }
    /* Buttons */
    button, .btn, .flickity-button, .playButton, #playButton {
      background-color: #333 !important; color: #fff !important; border: 1px solid #555 !important;
    }
    button:hover, .btn:hover, .flickity-button:hover, .playButton:hover, #playButton:hover {
      background-color: #444 !important;
    }
    /* Invert certain nav elements */
    .navbar, .navbar nav ul li a, .social-icons a, .dropdown-content a,
    .logoContainer img, .videoOverlayLogo {
      filter: brightness(0) invert(1) !important;
    }
    /* Some containers forcibly dark */
    #playContainerInfoBox, .updateTitle, .text, .leaderboardContainer,
    .skyscraperContainer, .pull-right, .clearfix {
      background-color: #000 !important; color: #fff !important;
    }
    /* Slightly darken images */
    img, video, .carousel img, .flickity-button svg, .videoOverlayLogo {
      filter: brightness(0.8) !important;
    }
    #playIcon path { fill: #fff !important; }
    /* Links */
    a, a:link, a:visited { color: #66ccff !important; }
    a:hover { color: #00aaff !important; }
    /* Hide ads */
    [class*="ad"], .ad-container, #div-gpt-ad, .banner-ad, .myAds {
      display: none !important;
    }
    /* Remove backgrounds from non-allowed elements */
    *:not(#gheat-menu):not(#slvsh-hud):not(#gheat-tools-popup):not(#gheat-menu-sections):
    not(#gheat-tools-section):not(#gheat-slvsh-section):not(#gheat-settings-hud):
    not(#webContainer):not(.scroll-section):
    not(#playerContainerOverlay):not(.navbar):not(footer):not(#contentContainer):
    not(body):not(html) {
      background-color: transparent !important;
    }
    /* Gheat message label */
    #gheat-message {
      position: fixed; bottom: 10px; right: 20px; font-size: 12px; color: #aaa;
      font-family: monospace; z-index: 99999;
    }
    /* Hide certain containers */
    #leaderboardContainer, #skyscraperContainer,
    div[class*="8p7p6pdb282"] { display: none !important; }
  `;
    const styleElem = document.createElement('style');
    styleElem.innerText = baseCSS;
    document.head.appendChild(styleElem);

    /********** gheat.net/shredsauce **********/
    window.addEventListener('load', () => {

        const msg = document.createElement('div');
        msg.id = 'gheat-message';
        msg.innerText = 'https://gheat.net/shredsauce - Gheat';
        document.body.appendChild(msg);


        const titleDiv = document.querySelector('.updateTitle');
        if (titleDiv) titleDiv.textContent = '';
        const msgContainer = document.querySelector('.text');
        if (msgContainer) {
            msgContainer.innerHTML = `
        <em>gheat.net/shredsauce</em><br>
        <em>April 6 2025</em><br><br>
        Thank you for using my theme<br><br>
        - Gheat
      `;
        const ytSection = document.createElement('div');
        ytSection.id = 'butta-edit';
        ytSection.style.marginTop = '30px';
        ytSection.style.textAlign = 'center';
        ytSection.style.color = '#fff';
        ytSection.style.fontFamily = 'Arial, sans-serif';
        ytSection.innerHTML = `
        <h2 style="margin-bottom: 10px; font-size: 16px; text-align: left;">Butta Park shredsauce edit by Gheat</h2>
        <div style="width: 520px; height: 292px; margin-right: auto;">
          <iframe id="butta-video" width="520" height="292"
            src="https://www.youtube.com/embed/moFxyVw-L78"
            title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write;
            encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
      `;
        msgContainer.appendChild(ytSection);
    }

      /********** Nuke Unwanted **********/
      const allowedIds = [
          'webContainer', 'mobileContainer', 'gheat-message', 'gheat-menu',
          'gheat-menu-header', 'gheat-menu-sections',
          'gheat-tools-popup', 'gheat-tools-section',
          'gheat-slvsh-section', 'gheat-settings-hud',
          'gheat-cheatlist-hud', 'slvsh-hud', 'slvsh-p1-bg', 'slvsh-p2-bg',
          'butta-edit', 'butta-video'
      ];
      function nukeUnwanted() {
          [...document.body.children].forEach(el => {
              if (!allowedIds.includes(el.id)) el.remove();
          });
      }
      setTimeout(() => {
          allowedIds.push('gheat-menu');
          nukeUnwanted();
          const observer = new MutationObserver(() => nukeUnwanted());
          observer.observe(document.body, { childList: true, subtree: true });
      }, 2500);
  });
})();

window.addEventListener('load', () => {

    const video = document.querySelector('video.video');
    const source = video ? video.querySelector('source') : null;
    if (source) {
        source.src = 'https://files.catbox.moe/nmgerh.mp4';
        video.load();
    }

    /********** Gheat Menu Container **********/
    const menu = document.createElement('div');
    menu.id = 'gheat-menu';
    Object.assign(menu.style, {
        position: 'fixed',
        top: '50%',
        right: '20px',
        transform: 'translate(100%, -50%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        borderRadius: '16px',
        zIndex: 99999,
        textAlign: 'center',
        width: 'max-content',
        backdropFilter: 'blur(12px) saturate(140%)',
        WebkitBackdropFilter: 'blur(12px) saturate(140%)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255,255,255,0.1)',
        opacity: '0',
        transition: 'opacity 0.5s ease, transform 0.5s ease'
    });

    if (localStorage.getItem('enableThemeColor') === 'true' && localStorage.getItem('themeColor')) {
        menu.style.background = localStorage.getItem('themeColor');
        setSiteBackground(localStorage.getItem('themeColor'));
    } else {
        menu.style.background = 'rgba(255, 255, 255, 0.1)';
        setSiteBackground('#000');
    }

    setTimeout(() => {
        menu.style.opacity = '1';
        menu.style.transform = 'translate(0, -50%)';
    }, 300);
    document.body.appendChild(menu);

    /********** Collapse Button **********/
    const collapseBtn = document.createElement('button');
    collapseBtn.textContent = "–";
    collapseBtn.title = "Collapse Menu";
    collapseBtn.style.cssText = `
    position: absolute; top: 5px; right: 5px; background: transparent;
    border: none; color: white; font-size: 16px; cursor: pointer;
  `;
    collapseBtn.onclick = () => {
        if (contentWrapper.style.display === 'none') {
            contentWrapper.style.display = 'block';
            collapseBtn.textContent = "–";
        } else {
            contentWrapper.style.display = 'none';
            collapseBtn.textContent = "+";
        }
    };
    menu.appendChild(collapseBtn);

    /********** Content Wrapper **********/
    const contentWrapper = document.createElement('div');
    contentWrapper.style.opacity = '0';
    contentWrapper.style.transition = 'opacity 0.4s ease';
    menu.appendChild(contentWrapper);
    setTimeout(() => { contentWrapper.style.opacity = '1'; }, 200);

    /********** Menu + Buttons **********/
    contentWrapper.innerHTML = `
    <div id="gheat-menu-header" style="display: flex; flex-direction: column; align-items: center; width: 100%;">
      <div style="font-weight: bold; font-size: 16px; margin-bottom: 12px;">✦ Gheat Menu ✦</div>
      <!-- Cheat Sheet -->
      <div style="margin: 5px 0; width: 100%; text-align: center;">
        <button id="cheatBtn" style="padding: 6px 12px; width: 140px; border: none; border-radius: 6px; background: #444; color: white; cursor: pointer;">
          Cheat Sheet
        </button>
      </div>
      <!-- Tools -->
      <div style="margin: 5px 0; width: 100%; text-align: center;">
        <button id="toolsBtn" style="padding: 6px 12px; width: 140px; border: none; border-radius: 6px; background: #444; color: white; cursor: pointer;">
          Tools
        </button>
        <div id="gheat-tools-section" style="
          display: none; flex-direction: column; align-items: center;
          opacity: 0; transform: translateY(-10px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          margin-top: 5px; width: 100%; text-align: center;
        ">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">✦ Tools ✦</div>
          <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
            <button id="btnCustomTextures" style="padding: 6px 12px; width: 140px; border: none; border-radius: 6px; background: #444; color: white; cursor: pointer;">
              Custom Textures Extension
            </button>
            <button id="btnIsItDown" style="padding: 6px 12px; width: 140px; border: none; border-radius: 6px; background: #444; color: white; cursor: pointer;">
              Checking...
            </button>
            <button id="btnBeta" style="padding: 6px 12px; width: 140px; border: none; border-radius: 6px; background: #444; color: white; cursor: pointer;">
              Beta
            </button>
            <button id="btnSettings" style="padding: 6px 12px; width: 140px; border: none; border-radius: 6px; background: #444; color: white; cursor: pointer;">
              Settings
            </button>
          </div>
        </div>
      </div>
      <!-- SLVSH -->
      <div style="margin: 5px 0; width: 100%; text-align: center;">
        <button id="slvshBtn" style="padding: 6px 12px; width: 140px; border: none; border-radius: 6px; background: #444; color: white; cursor: pointer;">
          SLVSH
        </button>
        <div id="gheat-slvsh-section" style="
          display: none; opacity: 0; transform: translateY(-10px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          margin-top: 5px; width: 100%; text-align: center;
        ">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">✦ Slvsh Cup ✦</div>
          <div style="margin-bottom: 8px;">
            <strong>Skier 1 - </strong><span id="p1Letters"></span>
          </div>
          <div style="margin-bottom: 8px;">
            <strong>Skier 2 - </strong><span id="p2Letters"></span>
          </div>
          <div style="margin-bottom: 8px; display: flex; flex-direction: column; gap: 4px; align-items: center;">
            <div>
              <button id="slvshBtnPlus1" style="padding:4px 8px; border:none; border-radius:4px; background:#555; color:white; cursor:pointer;">SK1 +</button>
              <button id="slvshBtnMinus1" style="padding:4px 8px; border:none; border-radius:4px; background:#555; color:white; cursor:pointer;">SK1 -</button>
            </div>
            <div>
              <button id="slvshBtnPlus2" style="padding:4px 8px; border:none; border-radius:4px; background:#555; color:white; cursor:pointer;">SK2 +</button>
              <button id="slvshBtnMinus2" style="padding:4px 8px; border:none; border-radius:4px; background:#555; color:white; cursor:pointer;">SK2 -</button>
            </div>
            <button id="btnSimulateWin" style="padding:4px 8px; border:none; border-radius:4px; background:#222; color:yellow; cursor:pointer; margin-top:5px;">
  Simulate Win
</button>
            <div id="slvshScoreStats" style="margin-top: 5px; font-size: 14px; display: none;">
              Score: <span id="scoreValue">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

    /********** Tools / SLVSH stuff **********/

    document.getElementById('toolsBtn').onclick = () => {
        const toolsPanel = document.getElementById('gheat-tools-section');
        if (!toolsPanel) return;
        const isHidden = (toolsPanel.style.display === 'none' || toolsPanel.style.display === '');
        if (isHidden) {
            toolsPanel.style.display = 'block';
            requestAnimationFrame(() => {
                toolsPanel.style.opacity = '1';
                toolsPanel.style.transform = 'translateY(0)';
            });
        } else {
            toolsPanel.style.opacity = '0';
            toolsPanel.style.transform = 'translateY(-10px)';
            setTimeout(() => { toolsPanel.style.display = 'none'; }, 300);
        }
    };


    document.getElementById('slvshBtn').onclick = () => {
        const slvshPanel = document.getElementById('gheat-slvsh-section');
        const isHidden = (slvshPanel.style.display === 'none' || slvshPanel.style.display === '');
        if (isHidden) {
            slvshPanel.style.display = 'block';
            requestAnimationFrame(() => {
                slvshPanel.style.opacity = '1';
                slvshPanel.style.transform = 'translateY(0)';
            });
        } else {
            slvshPanel.style.opacity = '0';
            slvshPanel.style.transform = 'translateY(-20px)';
            setTimeout(() => { slvshPanel.style.display = 'none'; }, 300);
        }
    };


    const p1Letters = document.getElementById('p1Letters');
    const p2Letters = document.getElementById('p2Letters');
    function updateSlvshScore() {
        let score = parseInt(localStorage.getItem('slvshScore') || "0", 10);

        if (p1Letters.textContent.length >= 5) {
            score++;
            const slvshPanel = document.getElementById('gheat-slvsh-section');
            slvshPanel.style.transition = 'transform 0.5s ease';
            slvshPanel.style.transform = 'scale(1.2)';
            setTimeout(() => { slvshPanel.style.transform = 'scale(1)'; }, 500);
            p1Letters.textContent = "";
        }

        if (p2Letters.textContent.length >= 5) {
            score--;
            p2Letters.textContent = "";
        }
        localStorage.setItem('slvshScore', score);
        const scoreDisplay = document.getElementById('slvshScoreStats');
        if (scoreDisplay) {
            document.getElementById('scoreValue').textContent = score;
            scoreDisplay.style.display = 'block';
        }
    }
    document.getElementById('slvshBtnPlus1').onclick = () => {
        if (p1Letters.textContent.length < 5) {
            p1Letters.textContent += 'SLVSH'[p1Letters.textContent.length];
            updateSlvshScore();
        }
    };
    document.getElementById('slvshBtnMinus1').onclick = () => {
        p1Letters.textContent = p1Letters.textContent.slice(0, -1);
    };
    document.getElementById('slvshBtnPlus2').onclick = () => {
        if (p2Letters.textContent.length < 5) {
            p2Letters.textContent += 'SLVSH'[p2Letters.textContent.length];
            updateSlvshScore();
        }
    };
    document.getElementById('slvshBtnMinus2').onclick = () => {
        p2Letters.textContent = p2Letters.textContent.slice(0, -1);
    };

    document.getElementById('btnSimulateWin').onclick = () => {
        let score = parseInt(localStorage.getItem('slvshScore') || "0", 10);
        score++;
        localStorage.setItem('slvshScore', score);
        const slvshPanel = document.getElementById('gheat-slvsh-section');
        slvshPanel.style.transition = 'transform 0.5s ease';
        slvshPanel.style.transform = 'scale(1.2)';
        setTimeout(() => { slvshPanel.style.transform = 'scale(1)'; }, 500);
        const scVal = document.getElementById('scoreValue');
        if (scVal) {
            scVal.textContent = score;
            document.getElementById('slvshScoreStats').style.display = 'block';
        }
    };


    document.getElementById('btnCustomTextures').onclick = () => {
        window.open("https://gheat.net/shredsauce/tutorials", "_blank");
    };
    document.getElementById('btnIsItDown').onclick = checkStatus;
    checkStatus();

    document.getElementById('btnBeta').onclick = () => {
        const proceed = confirm("Switching to the Beta version will reload the page. Do you want to continue?");
        if (proceed) window.location.href = "https://shredsauce.com/beta";
    };


    document.getElementById('cheatBtn').onclick = () => {
        if (localStorage.getItem('enableEmbedLinks') === 'false') {
            window.open("https://gheat.net/shredsauce/cheats/", "_blank");
        } else {
            toggleCheatHUD();
        }
    };


    document.getElementById('btnSettings').onclick = toggleSettingsHud;

    /********** Helpers **********/

    function toggleCheatHUD() {
        let cheatHud = document.getElementById('gheat-cheatlist-hud');
        if (!cheatHud) {
            cheatHud = document.createElement('div');
            cheatHud.id = 'gheat-cheatlist-hud';
            cheatHud.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(40, 40, 40, 0.75);
        backdrop-filter: blur(12px) saturate(140%);
        -webkit-backdrop-filter: blur(12px) saturate(140%);
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        border-radius: 16px;
        padding: 10px;
        z-index: 100000;
        text-align: center;
        width: 600px; height: 400px;
        display: none; opacity: 0;
        transition: opacity 0.3s ease;
        cursor: move;
      `;
        cheatHud.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">✦ Cheat List ✦</div>
        <iframe src="https://gheat.net/shredsauce/cheats/" style="width:100%; height:calc(100% - 30px); border:none;"></iframe>
      `;
        document.body.appendChild(cheatHud);
        let isDragging=false, offsetX=0, offsetY=0;
        cheatHud.addEventListener('mousedown', e => {
            if (e.offsetY < 30) {
                isDragging=true;
                offsetX=e.clientX - cheatHud.getBoundingClientRect().left;
                offsetY=e.clientY - cheatHud.getBoundingClientRect().top;
            }
        });
        document.addEventListener('mousemove', e => {
            if (isDragging) {
                cheatHud.style.left = (e.clientX - offsetX) + 'px';
                cheatHud.style.top = (e.clientY - offsetY) + 'px';
            }
        });
        document.addEventListener('mouseup', ()=>{isDragging=false;});
    }
      if (cheatHud.style.display === 'none' || cheatHud.style.display === '') {
          cheatHud.style.display = 'block';
          requestAnimationFrame(() => { cheatHud.style.opacity = '1'; });
      } else {
          cheatHud.style.opacity = '0';
          setTimeout(()=>{ cheatHud.style.display='none';}, 300);
      }
  }

    function toggleSettingsHud() {
        let settingsHud = document.getElementById('gheat-settings-hud');
        if (!settingsHud) {
            settingsHud = document.createElement('div');
            settingsHud.id = 'gheat-settings-hud';
            settingsHud.style.cssText = `
        position: fixed;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(40, 40, 40, 0.75);
        backdrop-filter: blur(12px) saturate(130%);
        -webkit-backdrop-filter: blur(12px) saturate(130%);
        border: 1px solid rgba(255,255,255,0.08);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        border-radius: 16px; padding: 0;
        z-index: 100000; width: 280px;
        display: none; opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        cursor: default;
      `;

        const header = document.createElement('div');
        header.id = 'gheat-settings-header';
        header.style.cssText = `
        background: #444;
        color: white;
        padding: 8px;
        cursor: move;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        font-weight: bold;
        text-align: center;
        position: relative;
      `;
        header.textContent = "✦ Settings ✦";


        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'X';
        closeBtn.title = 'Close Settings';
        closeBtn.style.cssText = `
         position: absolute;
         top: 4px;
         right: 8px;
         background: transparent;
         border: none;
         color: white;
         font-size: 16px;
         cursor: pointer;
      `;
        closeBtn.onclick = () => {

            settingsHud.style.opacity = '0';
            settingsHud.style.transform = 'translateY(-10px)';
            setTimeout(() => { settingsHud.style.display = 'none'; }, 300);
        };
        header.appendChild(closeBtn);

        settingsHud.appendChild(header);


        const content = document.createElement('div');
        content.id = 'gheat-settings-content';
        content.style.cssText = `
        padding: 10px; text-align: left;
        background: #333;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
      `;


        content.innerHTML = `
  <div style="margin-bottom: 12px;">
    <strong>Misc:</strong><br>
    <label><input id="chkEmbedLinks" type="checkbox" ${localStorage.getItem('enableEmbedLinks')!=='false'?"checked":""}> Enable embedded Shred Hub links</label><br>
    <label><input id="chkSlvshAnims"  type="checkbox" ${localStorage.getItem('enableSlvshAnims')!=='false'?"checked":""}> Enable SLVSH animations</label><br>
    <label>Is It Down check time: <input id="inpDownTime" type="number" value="${localStorage.getItem('downTime')||8000}" style="width:60px;"> ms</label><br>
    <label>Site Volume:         <input id="rngVolume"     type="range"  min="0" max="100" step="1" value="${localStorage.getItem('siteVolume')||50}" style="width:100px;"></label>
  </div>
  <div style="margin-bottom: 12px;">
    <strong>Color:</strong><br>
    <label>
      <input id="chkThemeColor" type="checkbox" ${localStorage.getItem('enableThemeColor')==='true'?"checked":""}>
      Enable custom theme color
    </label><br>
    <label>
      Theme Color: <input id="inpThemeColor" type="color" value="${localStorage.getItem('themeColor')||'#444444'}">
    </label>
  </div>
  <div style="margin-bottom: 12px;">
    <strong>Color Grade:</strong><br>
    <label>
      <input id="chkColorGrade" type="checkbox" ${localStorage.getItem('enableColorGrade')==='true'?"checked":""}>
      Enable color grade script
    </label><br>
    <label>
      Adjust Saturation: <input id="rngSaturation" type="range" min="0" max="2" step="0.1" value="${localStorage.getItem('saturation')||1}">
    </label><br>
    <label>
      Adjust Hue:        <input id="rngHue" type="range" min="-180" max="180" step="1"   value="${localStorage.getItem('hue')||0}">
    </label><br>
    <button id="btnColdPreset" style="
      margin-top: 6px; padding: 6px 12px; width: 100%;
      border: none; border-radius: 6px; background:#446; color:white; cursor: pointer;">
      Cold Preset ❄️
    </button>
  </div>
  <div style="margin-bottom: 12px;">
    <strong>SLVSH Stats:</strong><br>
    <label>
      <input id="chkSaveStats" type="checkbox" ${localStorage.getItem('saveSlvshStats')==='true'?"checked":""}>
      Save SLVSH score stats
    </label>
  </div>
  <button id="btnShredHub" style="
    margin-top: 10px; padding: 6px 12px; width: 100%;
    border: none; border-radius: 6px; background:#444; color:white; cursor: pointer;
  " onclick="window.open('https://gheat.net/shredsauce', '_blank');">
    Shredhub
  </button>
  <button id="btnSaveSettings" style="
    margin-top: 10px; padding: 6px 12px; width: 100%;
    border: none; border-radius: 6px; background: #444;
    color: white; cursor: pointer;
  ">
    Save Settings
  </button>
`;

        settingsHud.appendChild(content);
        document.body.appendChild(settingsHud);

        setTimeout(() => {
            document.getElementById('chkColorGrade')?.addEventListener('change', e => {
                const enabled = e.target.checked;
                document.getElementById('rngSaturation').disabled = !enabled;
                document.getElementById('rngHue').disabled = !enabled;
                localStorage.setItem('enableColorGrade', enabled);
                updateColorGrade();
            });

            document.getElementById('chkThemeColor')?.addEventListener('change', e => {
                const enabled = e.target.checked;
                document.getElementById('inpThemeColor').disabled = !enabled;
                localStorage.setItem('enableThemeColor', enabled);
                updateColorGrade();
            });

            document.getElementById('inpThemeColor')?.addEventListener('input', () => {
                const color = document.getElementById('inpThemeColor').value;
                localStorage.setItem('themeColor', color);
                const menuEl = document.getElementById('gheat-menu');
                if (menuEl) menuEl.style.background = color;
                setSiteBackground(color);
            });

            document.getElementById('rngSaturation')?.addEventListener('input', e => {
                localStorage.setItem('saturation', e.target.value);
                updateColorGrade();
            });

            document.getElementById('rngHue')?.addEventListener('input', e => {
                localStorage.setItem('hue', e.target.value);
                updateColorGrade();
            });
        }, 600);


        header.onmousedown = function(e) {
            e.preventDefault();
            let shiftX = e.clientX - settingsHud.getBoundingClientRect().left;
            let shiftY = e.clientY - settingsHud.getBoundingClientRect().top;
            function moveAt(pageX, pageY) {
                settingsHud.style.left = (pageX - shiftX)+'px';
                settingsHud.style.top = (pageY - shiftY)+'px';
            }
            function onMouseMove(e2){ moveAt(e2.pageX,e2.pageY); }
            document.addEventListener('mousemove', onMouseMove);
            header.onmouseup = () => {
                document.removeEventListener('mousemove', onMouseMove);
                header.onmouseup = null;
            };
        };
        header.ondragstart = () => false;


        document.getElementById('btnSaveSettings').onclick = () => {
            const embedLinks = document.getElementById('chkEmbedLinks').checked;
            const slvshAnims = document.getElementById('chkSlvshAnims').checked;
            const downTime = document.getElementById('inpDownTime').value;
            const siteVolume = document.getElementById('rngVolume').value;
            const themeColorEnabled = document.getElementById('chkThemeColor').checked;
            const themeColor = document.getElementById('inpThemeColor').value;
            const colorGradeEnabled = document.getElementById('chkColorGrade').checked;
            const saturation = document.getElementById('rngSaturation').value;
            const hue = document.getElementById('rngHue').value;
            const saveStats = document.getElementById('chkSaveStats').checked;



            localStorage.setItem('enableEmbedLinks', embedLinks);
            localStorage.setItem('enableSlvshAnims', slvshAnims);
            localStorage.setItem('downTime', downTime);
            localStorage.setItem('siteVolume', siteVolume);
            localStorage.setItem('enableThemeColor', themeColorEnabled);
            localStorage.setItem('themeColor', themeColor);
            localStorage.setItem('enableColorGrade', colorGradeEnabled);
            localStorage.setItem('saturation', saturation);
            localStorage.setItem('hue', hue);
            localStorage.setItem('saveSlvshStats', saveStats);


            const menuEl = document.getElementById('gheat-menu');
            if (themeColorEnabled) {
                menuEl.style.background = themeColor;
                setSiteBackground(themeColor);
            } else {
                menuEl.style.background = 'rgba(255, 255, 255, 0.1)';
                setSiteBackground('#000');
            }

            updateColorGrade();

            updateVolume();
            alert("Settings saved!");
        };


        document.getElementById('rngSaturation').addEventListener('input', updateColorGrade);

        const rngHue = document.getElementById('rngHue');
        rngHue.addEventListener('input', updateColorGrade);
        document.getElementById('btnColdPreset')?.addEventListener('click', () => {
            localStorage.setItem('enableColorGrade', true);
            localStorage.setItem('saturation', 0.6);
            localStorage.setItem('hue', -20);

            document.getElementById('chkColorGrade').checked = true;
            document.getElementById('rngSaturation').value = 0.6;
            document.getElementById('rngHue').value = -20;
            document.getElementById('rngSaturation').disabled = false;
            document.getElementById('rngHue').disabled = false;

            updateColorGrade();
        });

        document.getElementById('rngVolume').addEventListener('input', updateVolume);
    }
      if (settingsHud.style.display === 'block') {
          settingsHud.style.opacity = '0';
          settingsHud.style.transform = 'translateY(-10px)';
          setTimeout(() => { settingsHud.style.display = 'none'; }, 300);
      } else {
          settingsHud.style.display = 'block';
          requestAnimationFrame(() => {
              settingsHud.style.opacity = '1';
              settingsHud.style.transform = 'translateY(0)';
          });
      }
  }

    /********** Sauce Server Checker **********/
    function checkStatus() {
        const btn = document.getElementById('btnIsItDown');
        if (!btn) return;
        btn.textContent = "Checking...";
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://shredsauce.com/test.php",
            timeout: parseInt(localStorage.getItem('downTime')||"8000",10),
            ontimeout: () => { btn.textContent = "DOWN ❌"; },
            onload: () => { btn.textContent = "UP ✅"; },
            onerror: (err) => { btn.textContent = "DOWN ❌"; console.error("Status check error:", err); }
        });
    }

    /********** Color Grade **********/
    function updateColorGrade() {
        const enableGrade = (localStorage.getItem('enableColorGrade') === 'true');
        const sat = localStorage.getItem('saturation') || '1';
        const hue = localStorage.getItem('hue') || '0';
        let styleEl = document.getElementById('gheat-color-grade');
        if (enableGrade) {
            const filterVal = `brightness(0.8) saturate(${sat}) hue-rotate(${hue}deg) contrast(1.05)`;
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'gheat-color-grade';
                document.head.appendChild(styleEl);
            }
            styleEl.innerText = `html { filter: ${filterVal} !important; }`;
        } else if (styleEl) {
            styleEl.remove();
        }
    }

    /********** Site Volume **********/
    function updateVolume() {
        const vol = parseInt(localStorage.getItem('siteVolume') || '50', 10) / 100;

        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;


            const audioCtxs = [];
            for (const k in window) {
                if (window[k] instanceof AudioCtx) audioCtxs.push(window[k]);
            }

            audioCtxs.forEach(ctx => {
                if (!ctx.gheatGainNode) {
                    const gain = ctx.createGain();
                    gain.gain.value = vol;
                    gain.connect(ctx.destination);
                    ctx.gheatGainNode = gain;

                    const orig = ctx.destination;
                    const patch = ctx.createMediaStreamDestination();
                    ctx.destination = gain;
                } else {
                    ctx.gheatGainNode.gain.value = vol;
                }
            });
        } catch (e) {
            console.warn('Failed to patch WebAudio gain:', e);
        }
    }


    function setSiteBackground(hexColor) {
        let themeEl = document.getElementById('gheat-site-background');
        if (!themeEl) {
            themeEl = document.createElement('style');
            themeEl.id = 'gheat-site-background';
            document.head.appendChild(themeEl);
        }
        themeEl.innerText = `
      html, body,
      #webContainer, #mobileContainer, .scroll-section {
        background-color: ${hexColor} !important;
      }
    `;
  }


    setTimeout(() => {
        updateColorGrade();
        updateVolume();
    }, 1200);

    /********** Update Notifier **********/
    const currentVersion = "2.0.5Beta";
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://update.greasyfork.org/scripts/532035/Shredsauce%20dark%20Theme.meta.js",
        onload: function(resp) {
            if (resp.status === 200) {
                const metaText = resp.responseText;
                const versionMatch = metaText.match(/@version\s+([\S]+)/i);
                if (versionMatch && versionMatch[1]) {
                    const newVersion = versionMatch[1].trim();
                    if (newVersion !== currentVersion) {
                        // Show "Update available!"
                        const updateBtn = document.createElement("button");
                        updateBtn.textContent = "Update available!";
                        updateBtn.style.cssText = `
              margin-top: 10px; padding: 6px 12px; width: 140px;
              border: none; border-radius: 6px; background: #800;
              color: white; cursor: pointer;
            `;
              updateBtn.onclick = () => {
                  window.open("https://greasyfork.org/en/scripts/532035-shredsauce-dark-theme", "_blank");
              };
              const cw = document.querySelector('#gheat-menu > div');
              if (cw) cw.appendChild(updateBtn);
          }
        }
      }
    },
      onerror: function(err){
          console.error("Error checking update:",err);
      }
  });
})();