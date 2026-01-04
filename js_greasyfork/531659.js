// ==UserScript==
// @name        Youtube全画面
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Execute UserScript
// @author       Your Name
// @match        https://m.youtube.com
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531659/Youtube%E5%85%A8%E7%94%BB%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/531659/Youtube%E5%85%A8%E7%94%BB%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    document.addEventListener('keydown', (e) => {
        
                if (e.key === 'c') {
                    javascript:(function(){
  const DEBUG_MODE = false;
  const MAX_RETRY = 3;
  const DELAY = 500;

  const youtubeClicker = {
    init: function(x, y) {
      this.retryCount = 0;
      this.targetX = x;
      this.targetY = y;
      this.attemptClick();
    },

    attemptClick: function() {
      try {
        const element = this.findDeepElement(this.targetX, this.targetY);
        if (!element) {
          if (this.retryCount < MAX_RETRY) {
            this.retryCount++;
            setTimeout(() => this.attemptClick(), DELAY);
            return;
          }
          throw new Error('要素が見つかりません');
        }

        this.simulateFullClickSequence(element);
        DEBUG_MODE && console.log('YouTubeクリック成功');
      } catch (error) {
        console.error('YouTubeクリックエラー:', error);
      }
    },

    findDeepElement: function(x, y) {
      const traverseShadowDOM = (element) => {
        if (element.shadowRoot) {
          const shadowElement = document.elementFromPoint(x, y);
          return shadowElement ? traverseShadowDOM(shadowElement) : element;
        }
        return element;
      };

      let element = document.elementFromPoint(x, y);
      return element ? traverseShadowDOM(element) : null;
    },

    simulateFullClickSequence: function(element) {
      const rect = element.getBoundingClientRect();
      const clientX = this.targetX;
      const clientY = this.targetY;

      const events = [
        'mousedown', 'mouseup', 'click', 'dblclick'
      ];

      events.forEach(type => {
        const event = new MouseEvent(type, {
          view: window,
          bubbles: true,
          cancelable: true,
          clientX,
          clientY,
          relatedTarget: element
        });
        
        element.dispatchEvent(event);
      });

      DEBUG_MODE && console.log('イベント発火シーケンス完了', {
        element,
        clientX,
        clientY
      });
    }
  };

  /* 実行位置調整（YouTubeのサイドバーを考慮） */
  const adjustForYouTubeUI = () => {
    const sidebarWidth = document.querySelector('ytd-app')?.offsetWidth > 1400 ? 240 : 72;
    return { x: 320 + sidebarWidth, y: 200 };
  };

  /* メイン実行 */
  const { x, y } = adjustForYouTubeUI();
  youtubeClicker.init(x, y);
})();
                }
            
    });
})();