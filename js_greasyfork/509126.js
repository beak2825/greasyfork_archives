// ==UserScript==
// @name         Binance Moonbix
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  autoclicker for binance moonbix
// @author       anonymous
// @match        https://www.binance.com/zh-CN/game/tg/moon-bix?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=binance.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509126/Binance%20Moonbix.user.js
// @updateURL https://update.greasyfork.org/scripts/509126/Binance%20Moonbix.meta.js
// ==/UserScript==

(async function () {
  'use strict';
  const originalHTMLHeadELementAppendChild = HTMLHeadElement.prototype.appendChild

  const HASH = 'cd14f2cf.b2ecd746'
  const againKey = "crypto-miner-btn-play-again"
  const continueKey = 'crypto-miner-btn-continue'
  const gameTabKey = 'hwam-myinfo-candysource-game'

  function simulateClick(element) {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.dispatchEvent(event);
  }

  const i18nResource = await getI18nResource()

  function getI18nResource() {
    const data = JSON.parse(__APP_DATA.textContent)
    const i18nUrl = `${data.runtimeConfig.I18N_BASE_PUBLIC + data.basename}/growth-game-ui`
    return fetch(i18nUrl).then(res => res.json())
  }

  function clickTaskTab() {
    const taskTab = Array.from(document.querySelectorAll('.components_container__tab__1mbN9')).find(tab => {
      return tab.textContent.includes(i18nResource[gameTabKey]);
    });

    if (taskTab) {
      simulateClick(taskTab);
      return true;
    } else {
      return false;
    }
  }

  function startGame() {
    const startButton = document.querySelector('[class^=Game_entry__playBtn]');
    if (startButton) {
      simulateClick(startButton);
      return true;
    } else {
      return false;
    }
  }

  function clickPlayAgainButton() {
    const buttons = document.querySelectorAll('.bn-button.bn-button__primary.data-size-middle');
    const regexp = new RegExp(i18nResource[againKey].replace('{{remaining}}', '\\d+'))
    for (const button of buttons) {
      if (button.textContent.match(regexp)) {
        simulateClick(button);
        return true;
      }
    }
    return false;
  }

  function clickContinueButton() {
    const buttons = document.querySelectorAll('.bn-button.bn-button__primary.data-size-middle');
    const regexp = new RegExp(i18nResource[continueKey])
    for (const button of buttons) {
      if (button.textContent.match(regexp)) {
        simulateClick(button);
        return true;
      }
    }
  }

  setInterval(() => {
    clickTaskTab()
    startGame()
    clickPlayAgainButton()
    clickContinueButton()
  }, 1000);

  function hajickPhaser(Phaser) {
    const OriginalPhaserGame = Phaser.Game
    Phaser.Game = class Game extends OriginalPhaserGame {
      constructor(config) {
        const originalScene = config.scene

        super({
          ...config,
          scene: class extends originalScene {
            startGame() {
              super.startGame()
              // const e = 999999
              // this.gameDuration = 1e3 * e
              // this.timeLeft = this.gameDuration
              // this.timeLeftSec = e
            }
            getTargetAngle() {
              const closestItem = this.items.children.entries.reduce((closest, item) => {
                const distance = Math.sqrt((item.x - this.player.x) ** 2 + (item.y - this.player.y) ** 2)
                return distance < closest.distance ? { item, distance } : closest
              }, { item: null, distance: Infinity })
              const angle = 90 + Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(closestItem.item.x, closestItem.item.y, this.player.x, this.player.y))
              return angle
            }
            update(...args) {
              super.update(...args)
              const targetAngle = this.getTargetAngle()
              if (Math.abs(this.stick.angle - targetAngle) <= 1) {
                this.fireHook()
              }
            }
          }
        });
      }
    }
  }

  HTMLHeadElement.prototype.appendChild = function (node) {
    const result = originalHTMLHeadELementAppendChild.call(this, node)
    if (node.src?.includes(HASH)) {
      const originalOnload = node.onload;
      node.onload = function () {
        if (originalOnload) {
          originalOnload.apply(this, arguments);
        }
        const checkPhaser = () => {
          if (window.Phaser) {
            hajickPhaser(window.Phaser)
          } else {
            setTimeout(checkPhaser, 100); // 每100毫秒检查一次
          }
        };
        checkPhaser();
      };
    }
    return result
  }
})();
