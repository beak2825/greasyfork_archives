// ==UserScript==
// @name          BetterK3Browser
// @namespace     https://www.knuddels.de
// @version       2.2.0
// @description   Optimiert die Verwendung mit dem Browserchat
// @author        Rho
// @license       Proprietary
// @match         https://app.knuddels.de/*
// @match         https://preview.knuddels.de/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/505767/BetterK3Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/505767/BetterK3Browser.meta.js
// ==/UserScript==

(function() {
  'use strict';

  try {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: function() { return false; }
    });
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: function() { return 'visible'; }
    });
  } catch (err) {
    console.error("Kann document.hidden oder document.visibilityState nicht überschreiben", err);
  }

  document.addEventListener('visibilitychange', function(e) {
    e.stopImmediatePropagation();
  }, true);

  const originalAddEventListener = Document.prototype.addEventListener;
  Document.prototype.addEventListener = function(type, listener, options) {
    if (type === 'visibilitychange') return;
    originalAddEventListener.call(this, type, listener, options);
  };

  let scriptEnabled = localStorage.getItem('BetterK3Browser_scriptEnabled') === 'true';
  let intervalIds = {};

  function startScript() {
    if (intervalIds.awayCheck || intervalIds.reconnectLostConnection || intervalIds.reconnectOtherDevice || intervalIds.enterChannel) {
      return;
    }
    scheduleRandomAwayCheck();
    intervalIds.reconnectLostConnection = setInterval(checkForReconnectLostConnectionPopup, 1000);
    intervalIds.reconnectOtherDevice = setInterval(checkForReconnectPopup, 300000);
    intervalIds.enterChannel = setInterval(checkForEnterPopup, 1000);
  }

  function stopScript() {
    if (intervalIds.awayCheck) {
      clearTimeout(intervalIds.awayCheck);
      intervalIds.awayCheck = null;
    }
    if (intervalIds.reconnectLostConnection) {
      clearInterval(intervalIds.reconnectLostConnection);
      intervalIds.reconnectLostConnection = null;
    }
    if (intervalIds.reconnectOtherDevice) {
      clearInterval(intervalIds.reconnectOtherDevice);
      intervalIds.reconnectOtherDevice = null;
    }
    if (intervalIds.enterChannel) {
      clearInterval(intervalIds.enterChannel);
      intervalIds.enterChannel = null;
    }
  }

  function getLeftNickname() {
    const profileRow = document.querySelector('div.Knu-Flex.alignItems-center.gap-tiny');
    if (!profileRow) return null;
    const nickCol = profileRow.querySelector('div.Knu-FlexCol.cursor-pointer');
    if (!nickCol) return null;
    const nickSpan = nickCol.querySelector('span.Knu-Text.body1.primary');
    if (!nickSpan) return null;
    return nickSpan.textContent.trim();
  }

  function checkAwayStatus() {
    if (!scriptEnabled) return;
    const nickname = getLeftNickname();
    const nicknameListSpans = Array.from(document.querySelectorAll('span.Knu-Text.body1.primary'));
    for (let span of nicknameListSpans) {
      if (span.textContent.trim() === nickname) {
        let parentDiv = span.closest('div.Knu-Flex.px-base.py-6px.alignItems-center');
        if (!parentDiv) {
          let p = span.parentElement;
          for (let i = 0; i < 4; ++i) {
            if (p && p.classList && p.classList.contains('Knu-Flex') && p.classList.contains('alignItems-center')) {
              parentDiv = p;
              break;
            }
            p = p && p.parentElement;
          }
        }
        if (parentDiv) {
          const imgAway = parentDiv.querySelector('img[src*="icon_away_ani_new.gif"], img[src*="away.png"]');
          if (imgAway) {
            writeSlashAndSendChat();
            return;
          }
        }
      }
    }
  }

  function scheduleRandomAwayCheck() {
    if (!scriptEnabled) return;
    checkAwayStatus();
    let delay = getRandomDelay(5000, 60000);
    intervalIds.awayCheck = setTimeout(scheduleRandomAwayCheck, delay);
  }

  function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function checkForReconnectLostConnectionPopup() {
    if (!scriptEnabled) return;
    const popupText = "Verbindung zum Chat verloren";
    const popupElements = document.evaluate(
      `//span[contains(text(), '${popupText}')]`,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    if (popupElements.snapshotLength > 0) {
      const reconnectButtonText = "Neu verbinden";
      const reconnectButton = document.evaluate(
        `//span[contains(text(), '${reconnectButtonText}')]/ancestor::button`,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      if (reconnectButton) {
        reconnectButton.click();
      }
    }
  }

  function checkForReconnectPopup() {
    if (!scriptEnabled) return;
    const popupText = "Du bist aktuell mit einem anderen Gerät in einem Channel verbunden.";
    const popupElements = document.evaluate(
      `//span[contains(text(), '${popupText}')]`,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    if (popupElements.snapshotLength > 0) {
      const reconnectButtonText = "Neu verbinden";
      const reconnectButton = document.evaluate(
        `//span[contains(text(), '${reconnectButtonText}')]/ancestor::button`,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      if (reconnectButton) {
        reconnectButton.click();
      }
    }
  }

  function checkForEnterPopup() {
    if (!scriptEnabled) return;
    const enterButtonText = "Betreten";
    const enterButton = document.evaluate(
      `//span[contains(text(), '${enterButtonText}')]/ancestor::button`,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    if (enterButton) {
      enterButton.click();
    }
  }

  function writeSlashAndSendChat() {
    const chatInput = document.querySelector('.tiptap.ProseMirror');
    if (chatInput) {
      chatInput.focus();
      chatInput.innerHTML = "<p>/</p>";
      chatInput.dispatchEvent(new Event('input', { bubbles: true }));
      setTimeout(() => {
        const enterEvent = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          key: 'Enter',
          code: 'Enter',
          keyCode: 13
        });
        chatInput.dispatchEvent(enterEvent);
      }, 100);
    }
  }

  function insertToggleMenuItem() {
    const textColorClass = scriptEnabled ? 'primary' : 'tertiary';
    const iconBlend = scriptEnabled ? '' : 'mix-blend-mode: luminosity;';
    const toggleItem = document.createElement('div');
    toggleItem.style.display = 'contents';
    toggleItem.innerHTML = `
      <div class=" Knu-Flex flex-1 justifyContent-center position-relative overflow-hidden  flexDirection-column ">
        <div class=" Knu-FlexCol minHeight-40px position-relative cursor-pointer ">
          <div class=" Knu-Flex position-relative alignItems-center height-full borderRadius-minor content-is-dark"
               style="background: rgba(0, 0, 0, 0);">
            <div class="_tiny_vlumc_1"></div>
            <div class=" Knu-FlexCol alignItems-center content-is-dark bg-transparentDark ">
              <div class=" Knu-FlexCol overflow-visible position-relative ">
                <img alt="Toggle" loading="eager" class="Knu-Image pointerEvents-none cover"
                     src="https://cdnc.knuddelscom.de/pics/menu/icon-v2-settings.svg"
                     style="width: 32px; height: 32px; ${iconBlend}">
              </div>
            </div>
            <div class="_minor_vlumc_1"></div>
            <div class=" Knu-Flex flex-1 justifyContent-space-between alignItems-center content-is-dark bg-transparentDark ">
              <span class="Knu-Text body1 ${textColorClass} bold numberOfLines singleLine">BetterK3Browser</span>
            </div>
            <div class="_base_vlumc_1"></div>
          </div>
          <div class=" Knu-Flex position-absolute overflow-hidden borderRadius-100px height-full width-full "
               style="margin-top: 0px; margin-left: 0px;">
            <div class="Knu-Ripple"></div>
          </div>
        </div>
      </div>
    `;

    toggleItem.addEventListener('click', function() {
      scriptEnabled = !scriptEnabled;
      localStorage.setItem('BetterK3Browser_scriptEnabled', scriptEnabled);
      if (scriptEnabled) {
        startScript();
      } else {
        stopScript();
      }
      const textSpan = this.querySelector('span.Knu-Text');
      if (textSpan) {
        textSpan.classList.remove(scriptEnabled ? 'tertiary' : 'primary');
        textSpan.classList.add(scriptEnabled ? 'primary' : 'tertiary');
      }
      const iconImg = this.querySelector('img.Knu-Image');
      if (iconImg) {
        if (scriptEnabled) {
          iconImg.style.removeProperty('mix-blend-mode');
        } else {
          iconImg.style.setProperty('mix-blend-mode', 'luminosity');
        }
      }
    });

    const abmeldenDiv = document.evaluate(
      `//span[normalize-space(text())='Abmelden']/ancestor::div[contains(@class, 'Knu-Flex') and contains(@class, 'justifyContent-center') and contains(@class, 'overflow-hidden')]`,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    if (abmeldenDiv && abmeldenDiv.parentNode) {
      abmeldenDiv.parentNode.insertBefore(toggleItem, abmeldenDiv.nextSibling);
    } else {
      console.error("Konnte den 'Abmelden'-Menüeintrag nicht finden!");
    }
  }

  function waitForMenuContainer() {
    const abmeldenDiv = document.evaluate(
      `//span[normalize-space(text())='Abmelden']/ancestor::div[contains(@class, 'Knu-Flex') and contains(@class, 'justifyContent-center') and contains(@class, 'overflow-hidden')]`,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    if (abmeldenDiv) {
      insertToggleMenuItem();
    } else {
      setTimeout(waitForMenuContainer, 500);
    }
  }

  if (scriptEnabled) {
    startScript();
  }
  waitForMenuContainer();

})();