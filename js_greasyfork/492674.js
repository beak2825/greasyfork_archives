// ==UserScript==
// @name               巴哈姆特動畫瘋 威力加強版
// @name:en            Animate-Gamer Enhancement
// @name:zh-TW         巴哈姆特動畫瘋 威力加強版
// @namespace          https://github.com/rod24574575
// @description        一些巴哈姆特動畫瘋的 UX 改善和小功能
// @description:en     Some user experience enhancement and small features for Animate-Gamer.
// @description:zh-TW  一些巴哈姆特動畫瘋的 UX 改善和小功能
// @version            1.1.2
// @license            MIT
// @author             rod24574575
// @homepage           https://github.com/rod24574575/monorepo
// @homepageURL        https://github.com/rod24574575/monorepo
// @supportURL         https://github.com/rod24574575/monorepo/issues
// @match              *://ani.gamer.com.tw/animeVideo.php*
// @run-at             document-idle
// @resource           css https://github.com/rod24574575/monorepo/raw/animate-gamer-enhancement-v1.1.2/packages/animate-gamer-enhancement/animate-gamer-enhancement.css
// @grant              GM.getValue
// @grant              GM.setValue
// @grant              GM.getResourceUrl
// @downloadURL https://update.greasyfork.org/scripts/492674/Animate-Gamer%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/492674/Animate-Gamer%20Enhancement.meta.js
// ==/UserScript==

// TODO: 支援區間重複播放
// TODO: 功能/快捷鍵說明
// TODO: 提供只在此分頁有效的設定

// @ts-check
'use strict';

(function() {
  /**
   * I18n
   */

  const i18n = {
    settings_tab_name: '動畫瘋加強版',
    play_settings: '播放設定',
    auto_agree_content_rating: '自動同意分級確認',
    auto_play_next_episode: '自動播放下一集',
    auto_play_next_episode_tip: '此功能和動畫瘋內建提供的自動播放功能衝突，如果沒有自訂延遲時間的需求，可以直接使用內建的自動播放功能即可',
    auto_play_next_episode_delay: '自動播放延遲時間',
    auto_play_countdown: '倒數{0}秒繼續播放',
    interrupt_play: '中斷播放',
    second: '秒',
    timeline_automation_rule: '時間軸自動化規則',
    timeline_automation_rule_tip: '影片播放至規則所設定的時間時，會觸發該規則的指定操作。\n快捷鍵：\n[\\]帶入目前影片時間',
    add: '新增',
    advance_5s: '快轉5秒',
    advance_60s: '快轉60秒',
    rewind_5s: '倒轉5秒',
    rewind_60s: '倒轉60秒',
    switch_next_episode: '切換到下一集',
    switch_previous_episode: '切換到上一集',
  };

  /**
   * @param {keyof typeof i18n} key
   * @returns {string}
   */
  function getI18n(key) {
    return i18n[key] ?? key;
  }

  /**
   * @param {string} str
   * @param {unknown[]} args
   * @returns {string}
   */
  function formatString(str, ...args) {
    return str.replace(/\{(\d+)\}/g, (_, index) => {
      return String(args[+index]);
    });
  }

  /**
   * Settings
   */

  /**
   * @typedef {| never
   *   | 'advance_5s'
   *   | 'advance_60s'
   *   | 'rewind_5s'
   *   | 'rewind_60s'
   *   | 'switch_next_episode'
   *   | 'switch_previous_episode'
   * } Command
   */

  /**
   * @typedef ShortcutAction
   * @property {string} name
   * @property {Command} cmd
   */

  /**
   * @typedef TimelineAction
   * @property {number} time
   * @property {Command} cmd
   */

  /**
   * @typedef Settings
   * @property {boolean} autoAgreeContentRating
   * @property {boolean} autoPlayNextEpisode
   * @property {number} autoPlayNextEpisodeDelay
   * @property {ShortcutAction[]} shortcutActions
   * @property {TimelineAction[]} timelineActions
   */

  /**
   * @returns {Promise<Settings>}
   */
  async function loadSettings() {
    /** @type {Settings} */
    const settings = {
      autoAgreeContentRating: false,
      autoPlayNextEpisode: false,
      autoPlayNextEpisodeDelay: 5,
      shortcutActions: [
        {
          name: 'PageUp',
          cmd: 'switch_previous_episode',
        },
        {
          name: 'PageDown',
          cmd: 'switch_next_episode',
        },
      ],
      timelineActions: [],
    };

    const entries = await Promise.all(
      Object.entries(settings).map(async ([key, value]) => {
        try {
          value = await GM.getValue(key, value);
        } catch (e) {
          console.warn(e);
        }
        return /** @type {[string, any]} */ ([key, value]);
      }),
    );
    return /** @type {Settings} */ (Object.fromEntries(entries));
  }

  /**
   * @param {Partial<Settings>} settings
   */
  async function saveSettings(settings) {
    await Promise.allSettled(
      Object.entries(settings).map(async ([name, value]) => {
        return GM.setValue(name, value);
      }),
    );
  }

  /**
   * Store
   */

  /**
   * @typedef {HTMLElement} VjsPlayerElement
   */

  /**
   * @param {VjsPlayerElement} vjsPlayer
   */
  function useCommand(vjsPlayer) {
    const videoEl = vjsPlayer.querySelector('video');

    /**
     * @param {number} second
     */
    function advance(second) {
      if (videoEl) {
        videoEl.currentTime += second;
      }
    }

    /**
     * @param {number} second
     */
    function rewind(second) {
      if (videoEl) {
        videoEl.currentTime -= second;
      }
    }

    function switchPreviousEpisode() {
      /** @type {HTMLButtonElement | null} */
      const button = vjsPlayer.querySelector('button.vjs-pre-button');
      button?.click();
    }

    function switchNextEpisode() {
      /** @type {HTMLButtonElement | null} */
      const button = vjsPlayer.querySelector('button.vjs-next-button');
      button?.click();
    }

    /**
     * @param {Command} cmd
     * @returns {boolean}
     */
    function execCommand(cmd) {
      switch (cmd) {
        case 'advance_5s':
          advance(5);
          break;
        case 'advance_60s':
          advance(60);
          break;
        case 'rewind_5s':
          rewind(5);
          break;
        case 'rewind_60s':
          rewind(60);
          break;
        case 'switch_next_episode':
          switchNextEpisode();
          break;
        case 'switch_previous_episode':
          switchPreviousEpisode();
          break;
        default:
          return false;
      }
      return true;
    }

    return {
      execCommand,
    };
  }

  /**
   * @param {VjsPlayerElement} vjsPlayer
   */
  function useContentRating(vjsPlayer) {
    let enabled = false;

    function agreeContentRating() {
      /** @type {HTMLButtonElement | null} */
      const button = vjsPlayer.querySelector('button.choose-btn-agree');
      button?.click();
    }

    /** @type {MutationObserver | undefined} */
    let contentRatingMutationObserver;

    function onAutoAgreeContentRatingChange() {
      contentRatingMutationObserver?.disconnect();

      if (enabled) {
        agreeContentRating();

        contentRatingMutationObserver = new MutationObserver(() => {
          agreeContentRating();
        });
        contentRatingMutationObserver.observe(vjsPlayer, {
          childList: true,
        });
      }
    }

    /**
     * @param {boolean} value
     */
    function enableAutoAgreeContentRating(value) {
      if (enabled === value) {
        return;
      }
      enabled = value;
      onAutoAgreeContentRatingChange();
    }

    return {
      enableAutoAgreeContentRating,
    };
  }

  /**
   * @param {VjsPlayerElement} vjsPlayer
   */
  function useNextEpisode(vjsPlayer) {
    /**
     * @typedef {'due' | 'clear' | 'cancel'} StopCountdownReason
     */

    let enabled = false;
    let delayTime = 0;
    /** @type {{ countdownTimer: number, finishTimer: number, resolve: (reason: StopCountdownReason) => void } | null} */
    let countdownData = null;

    const videoEl = /** @type {HTMLVideoElement | null} */ (vjsPlayer.querySelector('video'));
    const stopEl = /** @type {HTMLElement | null} */ (vjsPlayer.querySelector('.stop'));
    const titleEl = /** @type {HTMLElement | null | undefined} */ (stopEl?.querySelector('#countDownTitle'));
    const nextEpisodeEl = /** @type {HTMLAnchorElement | null | undefined} */ (stopEl?.querySelector('a#nextEpisode'));
    const stopAutoPlayEl = /** @type {HTMLAnchorElement | null | undefined} */ (stopEl?.querySelector('a#stopAutoPlay'));
    const nextEpisodeSvgEl = /** @type {SVGElement | null | undefined} */ (nextEpisodeEl?.querySelector('svg'));
    const nextEpisodeCountdownEl = /** @type {SVGElement | null | undefined} */ (nextEpisodeEl?.querySelector('#countDownCircle'));

    if (!videoEl || !stopEl || !titleEl || !nextEpisodeEl || !stopAutoPlayEl || !nextEpisodeSvgEl || !nextEpisodeCountdownEl) {
      console.warn('Missing elements for next episode auto play.');
    }

    /**
     * @returns {boolean}
     */
    function isStopElShown() {
      return !!stopEl && !stopEl.classList.contains('vjs-hidden');
    }

    /**
     * @param {boolean} display
     */
    function setCountdownUiDisplay(display) {
      if (nextEpisodeEl) {
        if (display) {
          nextEpisodeEl.classList.add('center-btn');
        } else {
          nextEpisodeEl.classList.remove('center-btn');
        }
      }
      if (nextEpisodeSvgEl) {
        if (display) {
          nextEpisodeSvgEl.classList.remove('is-hide');
        } else {
          nextEpisodeSvgEl.classList.add('is-hide');
        }
      }
      if (nextEpisodeCountdownEl) {
        if (display) {
          nextEpisodeCountdownEl.classList.add('is-countdown');
          nextEpisodeCountdownEl.style.animation = `circle-offset ${delayTime}s linear 1 forwards`;
        } else {
          nextEpisodeCountdownEl.classList.remove('is-countdown');
          nextEpisodeCountdownEl.style.animation = '';
        }
      }
      if (stopAutoPlayEl) {
        if (display) {
          stopAutoPlayEl.classList.remove('vjs-hidden', 'is-disabled');

          const stopAutoPlayTextEl = stopAutoPlayEl.querySelector('p');
          if (stopAutoPlayTextEl) {
            stopAutoPlayTextEl.textContent = getI18n('interrupt_play');
          }
        } else {
          stopAutoPlayEl.classList.add('vjs-hidden');
        }
      }
      updateCountdownUi(display ? delayTime : 0);
    }

    /**
     * @param {number} countdownValue
     */
    function updateCountdownUi(countdownValue) {
      if (titleEl) {
        titleEl.textContent = countdownValue ? formatString(getI18n('auto_play_countdown'), countdownValue) : '';
      }
    }

    /**
     * @returns {Promise<StopCountdownReason>}
     */
    async function countdown() {
      clearCountdown();

      setCountdownUiDisplay(true);

      let countdownValue = delayTime;
      const countdownTimer = window.setInterval(() => {
        --countdownValue;
        updateCountdownUi(countdownValue);
      }, 1000);

      /** @type {ReturnType<typeof Promise.withResolvers<StopCountdownReason>>} */
      const { promise, resolve } = Promise.withResolvers();
      const finishTimer = window.setTimeout(() => stopCountdown('due'), delayTime * 1000);

      countdownData = {
        countdownTimer,
        finishTimer,
        resolve,
      };

      const reason = await promise;
      if (reason !== 'clear') {
        setCountdownUiDisplay(false);
      }

      return reason;
    }

    /**
     * @param {StopCountdownReason} reason
     */
    function stopCountdown(reason) {
      if (!countdownData) {
        return;
      }

      const { countdownTimer, finishTimer, resolve } = countdownData;
      window.clearInterval(countdownTimer);
      window.clearTimeout(finishTimer);
      resolve(reason);

      countdownData = null;
    }

    function clearCountdown() {
      return stopCountdown('clear');
    }

    function cancelCountdown() {
      return stopCountdown('cancel');
    }

    /**
     * @returns {Promise<void>}
     */
    async function maybePlayNextEpisode() {
      if (!isStopElShown()) {
        return;
      }

      if (delayTime) {
        const reason = await countdown();

        // Check again whether the stop element is still shown after the countdown.
        if (reason !== 'due' || !isStopElShown()) {
          return;
        }
      }

      nextEpisodeEl?.click();
    }

    /** @type {MutationObserver | undefined} */
    let nextEpisodeMutationObserver;

    function onAutoPlayNextEpisodeChange() {
      if (!stopEl) {
        return;
      }

      nextEpisodeMutationObserver?.disconnect();
      if (enabled) {
        nextEpisodeMutationObserver = new MutationObserver((records) => {
          for (const { type, target, oldValue } of records) {
            // Only handle the class attribute change of the stop element when
            // it becomes visible.
            if (type !== 'attributes' || target !== stopEl || oldValue === null || !oldValue.split(' ').includes('vjs-hidden')) {
              continue;
            }
            maybePlayNextEpisode();
          }
        });
        nextEpisodeMutationObserver.observe(stopEl, {
          attributes: true,
          attributeFilter: ['class'],
          attributeOldValue: true,
        });

        maybePlayNextEpisode();
      } else {
        cancelCountdown();
      }

      if (videoEl) {
        if (enabled) {
          videoEl.addEventListener('emptied', clearCountdown);
        } else {
          videoEl.removeEventListener('emptied', clearCountdown);
        }
      }

      if (stopAutoPlayEl) {
        if (enabled) {
          stopAutoPlayEl.addEventListener('click', cancelCountdown);
        } else {
          stopAutoPlayEl.removeEventListener('emptied', cancelCountdown);
        }
      }
    }

    /**
     * @param {boolean} value
     */
    function enableAutoPlayNextEpisode(value) {
      if (enabled === value) {
        return;
      }
      enabled = value;
      onAutoPlayNextEpisodeChange();
    }

    /**
     * @param {number} value
     */
    function setAutoPlayNextEpisodeDelay(value) {
      if (!isFinite(value)) {
        return;
      }

      value = Math.round(value);
      if (delayTime === value) {
        return;
      }
      delayTime = value;
    }

    return {
      enableAutoPlayNextEpisode,
      setAutoPlayNextEpisodeDelay,
    };
  }

  /**
   * @param {VjsPlayerElement} vjsPlayer
   */
  function useShortcuts(vjsPlayer) {
    /** @type {Map<string, Command>} */
    const customShortcutMap = new Map();
    /** @type {Map<string, Array<() => void>>} */
    const localShortcutMap = new Map();
    const commandStore = useCommand(vjsPlayer);

    /**
     * @param {KeyboardEvent} e
     * @returns {string}
     */
    function getKeyName(e) {
      return e.key;
    }

    /**
     * @param {KeyboardEvent} e
     */
    function getKeyModifier(e) {
      /** @type {string} */
      let str = '';
      if (e.shiftKey) {
        str = 'Shift-' + str;
      }
      if (e.ctrlKey) {
        str = 'Ctrl-' + str;
      }
      if (e.metaKey) {
        str = 'Meta-' + str;
      }
      if (e.altKey) {
        str = 'Alt-' + str;
      }
      return str;
    }

    /**
     * @param {KeyboardEvent} e
     * @returns {string}
     */
    function getKeyFullName(e) {
      return getKeyModifier(e) + getKeyName(e);
    }

    /**
     * @param {KeyboardEvent} e
     */
    function onKeyDown(e) {
      if (e.defaultPrevented) {
        return;
      }

      const name = getKeyFullName(e);

      const cmd = customShortcutMap.get(name);
      if (cmd) {
        commandStore.execCommand(cmd);
        e.preventDefault();
        return;
      }

      const handlers = localShortcutMap.get(name);
      if (handlers && handlers.length > 0) {
        for (const handler of handlers) {
          handler();
        }
        e.preventDefault();
        return;
      }
    }

    /**
     * @param {readonly ShortcutAction[]} value
     */
    function setCustomShortcuts(value) {
      customShortcutMap.clear();
      for (const { name, cmd } of value) {
        customShortcutMap.set(name, cmd);
      }
    }

    /**
     * @param {Record<string, Array<() => void>>} value
     */
    function addLocalShortcuts(value) {
      for (const [name, newHandlers] of Object.entries(value)) {
        let handlers = localShortcutMap.get(name);
        if (!handlers) {
          handlers = [];
          localShortcutMap.set(name, handlers);
        }
        handlers.push(...newHandlers);
      }
    }

    vjsPlayer.addEventListener('keydown', onKeyDown);

    return {
      setCustomShortcuts,
      addLocalShortcuts,
    };
  }

  /**
   * @param {VjsPlayerElement} vjsPlayer
   */
  function useTimelineActions(vjsPlayer) {
    /** @type {TimelineAction[]} */
    const timelineActions = [];

    const videoEl = /** @type {HTMLVideoElement | null} */ (vjsPlayer.querySelector('video'));
    if (videoEl) {
      videoEl.addEventListener('seeking', onVideoTimeSet);
      videoEl.addEventListener('emptied', onVideoTimeSet);
      videoEl.addEventListener('timeupdate', onVideoTimeUpdate);
    }

    let currentTime = -1;
    const commandStore = useCommand(vjsPlayer);

    function onVideoTimeSet() {
      currentTime = -1;
    }

    function onVideoTimeUpdate() {
      const oldCurrentTime = currentTime;
      const newCurrentTime = Math.floor(videoEl?.currentTime ?? 0);
      currentTime = newCurrentTime;

      if (oldCurrentTime < 0 || newCurrentTime <= oldCurrentTime) {
        return;
      }

      let fromIndex = timelineActions.findIndex((action) => (oldCurrentTime < action.time));
      if (fromIndex < 0) {
        return;
      }

      // eslint-disable-next-line no-constant-condition
      while (1) {
        const { time, cmd } = timelineActions[fromIndex];
        if (newCurrentTime < time) {
          break;
        }

        commandStore.execCommand(cmd);
        ++fromIndex;
      }
    }

    /**
     * @param {TimelineAction[]} actions
     */
    function setTimelineActions(actions) {
      timelineActions.length = 0;
      timelineActions.push(...actions);
      timelineActions.sort((a, b) => (a.time - b.time));
    }

    /**
     * @param {number} time
     * @param {Command} command
     */
    function addTimelineAction(time, command) {
      let insertIndex = timelineActions.findIndex((action) => (time < action.time));
      if (insertIndex < 0) {
        insertIndex = timelineActions.length;
      }
      timelineActions.splice(insertIndex, 0, { time, cmd: command });
    }

    /**
     * @param {number} index
     */
    function removeTimelineAction(index) {
      timelineActions.splice(index, 1);
    }

    return {
      setTimelineActions,
      addTimelineAction,
      removeTimelineAction,
    };
  }

  /**
   * @param {VjsPlayerElement} vjsPlayer
   * @param {(settings: Partial<Settings>) => void} callback
   */
  function useSettingUi(vjsPlayer, callback) {
    /**
     * @typedef SettingComponent
     * @property {Element} el
     * @property {() => void} [onMounted]
     * @property {(settings: Partial<Settings>) => void} [onSettings]
     * @property {Record<string, Array<() => void>>} [shortcuts]
     */

    const videoEl = vjsPlayer.querySelector('video');
    /** @type {readonly TimelineAction[]} */
    let timelineActions = [];
    /** @type {SettingComponent | null} */
    let tabContentComponent = null;

    const subtitleFrame = vjsPlayer.closest('.player')?.querySelector('.subtitle');

    const tabContentId = 'ani-tab-content-enhancement';

    async function attachCss() {
      const url = await GM.getResourceUrl('css');

      const linkEl = document.createElement('link');
      linkEl.rel = 'stylesheet';
      linkEl.type = 'text/css';
      linkEl.href = url;
      document.head.appendChild(linkEl);
    }

    function attachTabUi() {
      if (!subtitleFrame) {
        return;
      }

      const tabsEl = subtitleFrame.querySelector('.ani-tabs');
      if (!tabsEl) {
        return;
      }

      const tabItemEl = document.createElement('div');
      tabItemEl.classList.add('ani-tabs__item');

      const tabLinkEl = document.createElement('a');
      tabLinkEl.href = '#' + tabContentId;
      tabLinkEl.classList.add('ani-tabs-link');
      tabLinkEl.textContent = getI18n('settings_tab_name');
      tabLinkEl.addEventListener('click', function(e) {
        e.preventDefault();

        // The pure-js implementation of the same logic from the original site.

        // HACK: workaround for Plus-Ani.
        for (const el of subtitleFrame.querySelectorAll('.ani-tabs-link.is-active, .plus_ani-tabs-link.is-active')) {
          el.classList.remove('is-active');
        }
        this.classList.add('is-active');

        for (const el of /** @type {NodeListOf<HTMLElement>} */ (subtitleFrame.querySelectorAll('.ani-tab-content__item'))) {
          el.style.display = 'none';
        }

        // Must use `getAttribute` to only get the id rather than the full url.
        const targetContentEl = document.getElementById((this.getAttribute('href') ?? '').slice(1));
        if (targetContentEl) {
          targetContentEl.style.display = targetContentEl.classList.contains('setting-program') ? 'flex' : 'block';
        }
      });

      tabItemEl.appendChild(tabLinkEl);
      tabsEl.appendChild(tabItemEl);
    }

    function attachTabContentUi() {
      if (!subtitleFrame) {
        return;
      }

      const tabContentEl = subtitleFrame.querySelector('.ani-tab-content');
      if (!tabContentEl) {
        return;
      }

      /**
       * @param {number} time
       * @returns {{ hour: number, minute: number, second: number }}
       */
      function parseTime(time) {
        return {
          hour: Math.floor(time / 3600),
          minute: Math.floor(time / 60) % 60,
          second: Math.floor(time % 60),
        };
      }

      /**
       * @param {number} hour
       * @param {number} minute
       * @param {number} second
       * @returns {number}
       */
      function serializeTime(hour, minute, second) {
        return hour * 3600 + minute * 60 + second;
      }

      tabContentComponent = createSettingTabComp({
        id: tabContentId,
        sections: [
          {
            title: getI18n('play_settings'),
            items: [
              {
                type: 'checkbox',
                label: getI18n('auto_agree_content_rating'),
                value: false,
                onMounted: (el) => {
                  el.addEventListener('change', (e) => {
                    callback({ autoAgreeContentRating: el.checked });
                  });
                },
                onSettings: (el, { autoAgreeContentRating }) => {
                  if (autoAgreeContentRating !== undefined) {
                    el.checked = autoAgreeContentRating;
                  }
                },
              },
              {
                type: 'checkbox',
                label: getI18n('auto_play_next_episode'),
                labelTip: getI18n('auto_play_next_episode_tip'),
                value: false,
                onMounted: (el) => {
                  el.addEventListener('change', (e) => {
                    callback({ autoPlayNextEpisode: el.checked });
                  });
                },
                onSettings: (el, { autoPlayNextEpisode }) => {
                  if (autoPlayNextEpisode !== undefined) {
                    el.checked = autoPlayNextEpisode;
                  }
                },
              },
              {
                type: 'number',
                label: getI18n('auto_play_next_episode_delay'),
                value: 5,
                max: 10,
                min: 0,
                placeholder: getI18n('second'),
                onMounted: (el) => {
                  el.addEventListener('change', (e) => {
                    callback({ autoPlayNextEpisodeDelay: +el.value });
                  });
                },
                onSettings: (el, { autoPlayNextEpisodeDelay }) => {
                  if (autoPlayNextEpisodeDelay !== undefined) {
                    el.value = String(autoPlayNextEpisodeDelay);
                  }
                },
              },
            ],
          },
          {
            title: getI18n('timeline_automation_rule'),
            id: 'enh-ani-timeline-automation-rule',
            tip: getI18n('timeline_automation_rule_tip'),
            items: [
              {
                type: 'html',
                html: `
                  <div class="ani-setting-item">
                    <div class="enh-ani-timeline-header">
                      <div class="enh-ani-timeline-time">
                        <input type="number" id="enh-ani-timeline-time-hour" class="ani-input" placeholder="0" min="0" max="9">
                        <span class="enh-ani-time-colon">:</span>
                        <input type="number" id="enh-ani-timeline-time-minute" class="ani-input" placeholder="00" min="0" max="59">
                        <span class="enh-ani-time-colon">:</span>
                        <input type="number" id="enh-ani-timeline-time-second" class="ani-input" placeholder="00" min="0" max="59">
                      </div>
                      <div class="enh-ani-timeline-cmd btn-newanime-filter">
                        <input type="text" id="enh-ani-timeline-cmd-input" class="ani-input" readonly>
                        <ul class="filter-items"></ul>
                      </div>
                      <a href="#" role="button" class="bluebtn">${getI18n('add')}</a>
                    </div>
                    <div class="enh-ani-timeline-body">
                      <ul class="sub_list"></ul>
                    </div>
                  </div>
                `,
                onMounted: (el) => {
                  /**
                   * @param {number} value
                   * @param {number} min
                   * @param {number} max
                   * @returns {number}
                   */
                  function clamp(value, min, max) {
                    return Math.max(min, Math.min(max, value));
                  }

                  const hourInputEl = /** @type {HTMLInputElement | null} */ (document.getElementById('enh-ani-timeline-time-hour'));
                  const minuteInputEl = /** @type {HTMLInputElement | null} */ (document.getElementById('enh-ani-timeline-time-minute'));
                  const secondInputEl = /** @type {HTMLInputElement | null} */ (document.getElementById('enh-ani-timeline-time-second'));
                  const cmdInputEl = /** @type {HTMLInputElement | null} */ (document.getElementById('enh-ani-timeline-cmd-input'));

                  const cmdEl = el.querySelector('.enh-ani-timeline-cmd');
                  const cmdOptionsEl = el.querySelector('.filter-items');
                  const addBtnEl = el.querySelector('.bluebtn');

                  if (cmdOptionsEl) {
                    /** @type {Command[]} */
                    const cmdOptions = [
                      'advance_5s',
                      'advance_60s',
                      'rewind_5s',
                      'rewind_60s',
                      'switch_next_episode',
                      'switch_previous_episode',
                    ];
                    for (const cmd of cmdOptions) {
                      const optionEl = document.createElement('li');
                      optionEl.setAttribute('data-cmd', cmd);
                      optionEl.textContent = getI18n(cmd);
                      cmdOptionsEl.appendChild(optionEl);
                    }
                  }

                  cmdEl?.addEventListener('click', function(e) {
                    cmdOptionsEl?.classList.toggle('is-active');

                    const target = e.target;
                    if (target && target instanceof HTMLElement && cmdInputEl) {
                      const optionEl = target.closest('li');
                      if (optionEl) {
                        const parent = optionEl.parentElement;
                        if (parent) {
                          for (const child of parent.children) {
                            child.classList.remove('is-active');
                          }
                        }
                        optionEl.classList.add('is-active');

                        const cmd = /** @type {Command | undefined | null} */ (optionEl.getAttribute('data-cmd'));
                        if (cmd) {
                          cmdInputEl.setAttribute('data-cmd', cmd);
                          cmdInputEl.value = getI18n(cmd);
                        }
                      }
                    }
                  });

                  addBtnEl?.addEventListener('click', function(e) {
                    e.preventDefault();

                    const hour = hourInputEl ? clamp(Math.floor(+hourInputEl.value), 0, 9) : 0;
                    const minute = minuteInputEl ? clamp(Math.floor(+minuteInputEl.value), 0, 59) : 0;
                    const second = secondInputEl ? clamp(Math.floor(+secondInputEl.value), 0, 59) : 0;
                    if (!isFinite(hour) || !isFinite(minute) || !isFinite(second)) {
                      return;
                    }

                    const cmd = /** @type {Command | undefined | null} */ (cmdInputEl?.getAttribute('data-cmd'));
                    if (!cmd) {
                      return;
                    }

                    callback({
                      timelineActions: [
                        ...timelineActions,
                        { time: serializeTime(hour, minute, second), cmd },
                      ].sort((a, b) => (a.time - b.time)),
                    });
                  });
                },
                onSettings: (el, settings) => {
                  if (settings.timelineActions === undefined) {
                    return;
                  }

                  const ulEl = el.querySelector('.enh-ani-timeline-body')?.firstElementChild;
                  if (!ulEl) {
                    return;
                  }

                  ulEl.innerHTML = '<li class="sub-list-li">';
                  for (const [index, { time, cmd }] of timelineActions.entries()) {
                    const { hour, minute, second } = parseTime(time);
                    const timeStr = formatString(
                      '{0}:{1}:{2}',
                      String(hour),
                      String(minute).padStart(2, '0'),
                      String(second).padStart(2, '0'),
                    );

                    const dummyEl = document.createElement('div');
                    dummyEl.innerHTML = `
                      <li class="sub-list-li">
                        <b>${timeStr}</b>
                        <div class="sub_content"><span>${getI18n(cmd)}</span></div>
                        <a href="#" role="button" class="ani-keyword-close">
                          <i class="material-icons">close</i>
                        </a>
                      </li>
                    `;

                    const itemEl = /** @type {Element} */ (dummyEl.firstElementChild);
                    itemEl.querySelector('.ani-keyword-close')?.addEventListener('click', function(e) {
                      e.preventDefault();
                      callback({
                        timelineActions: timelineActions.toSpliced(index, 1),
                      });
                    });

                    ulEl.appendChild(itemEl);
                  }
                },
                shortcuts: {
                  '\\': (el) => {
                    const hourInputEl = /** @type {HTMLInputElement | null} */ (document.getElementById('enh-ani-timeline-time-hour'));
                    const minuteInputEl = /** @type {HTMLInputElement | null} */ (document.getElementById('enh-ani-timeline-time-minute'));
                    const secondInputEl = /** @type {HTMLInputElement | null} */ (document.getElementById('enh-ani-timeline-time-second'));

                    const { hour, minute, second } = parseTime(videoEl?.currentTime ?? 0);
                    if (hourInputEl) {
                      hourInputEl.value = String(hour);
                    }
                    if (minuteInputEl) {
                      minuteInputEl.value = String(minute);
                    }
                    if (secondInputEl) {
                      secondInputEl.value = String(second);
                    }
                  },
                },
              },
            ],
          },
        ],
      });

      tabContentEl.appendChild(tabContentComponent.el);
      tabContentComponent.onMounted?.();
    }

    /**
     * @template {Element} [T=Element]
     * @typedef SettingBaseConfig
     * @property {(el: T) => void} [onMounted]
     * @property {(el: T, settings: Partial<Settings>) => void} [onSettings]
     * @property {Record<string, (el: T) => void>} [shortcuts]
     */

    /**
     * @typedef _SettingCheckboxConfig
     * @property {'checkbox'} type
     * @property {string} [id]
     * @property {string} [label]
     * @property {string} [labelTip]
     * @property {boolean} [value]
     *
     * @typedef {SettingBaseConfig<HTMLInputElement> & _SettingCheckboxConfig} SettingCheckboxConfig
     */

    /**
     * @typedef _SettingNumberConfig
     * @property {'number'} type
     * @property {string} [id]
     * @property {string} [label]
     * @property {string} [labelTip]
     * @property {number} [value]
     * @property {number} [max]
     * @property {number} [min]
     * @property {string} [placeholder]
     *
     * @typedef {SettingBaseConfig<HTMLInputElement> & _SettingNumberConfig} SettingNumberConfig
     */

    /**
     * @typedef _SettingHtmlConfig
     * @property {'html'} type
     * @property {string} html
     *
     * @typedef {SettingBaseConfig & _SettingHtmlConfig} SettingHtmlConfig
     */

    /**
     * @typedef {SettingCheckboxConfig | SettingNumberConfig | SettingHtmlConfig} SettingItemConfig
     */

    /**
     * @typedef SettingSectionConfig
     * @property {string} title
     * @property {string} [id]
     * @property {string} [tip]
     * @property {SettingItemConfig[]} items
     */

    /**
     * @typedef SettingTabConfig
     * @property {string} [id]
     * @property {SettingSectionConfig[]} sections
     */

    /**
     * @param {string} tip
     * @returns {Element}
     */
    function createSettingTipEl(tip) {
      const dummyEl = document.createElement('div');
      dummyEl.innerHTML = `
        <div class="qa-icon" style="display:inline-block;top:1px;">
          <img src="https://i2.bahamut.com.tw/anime/smallQAicon.svg">
        </div>
      `;

      const tipEl = /** @type {Element} */ (dummyEl.firstElementChild);
      tipEl.setAttribute('tip-content', tip);
      return tipEl;
    }

    /**
     * @param {SettingItemConfig} config
     * @returns {DocumentFragment}
     */
    function createSettingItemLabelEl(config) {
      const fragment = document.createDocumentFragment();
      if (('label' in config) && config.label) {
        const dummyEl = document.createElement('div');
        dummyEl.innerHTML = `
          <div class="ani-setting-label">
            <span class="ani-setting-label__mian"></span>
          </div>
        `;

        const labelEl = dummyEl.querySelector('.ani-setting-label');
        if (labelEl) {
          labelEl.textContent = config.label;
        }

        fragment.append(...dummyEl.childNodes);

        if (config.labelTip) {
          fragment.append(createSettingTipEl(config.labelTip));
        }
      }
      return fragment;
    }

    /**
     * @param {SettingItemConfig} config
     * @returns {SettingComponent}
     */
    function createSettingItemComp(config) {
      if (config.type === 'checkbox') {
        const dummyEl = document.createElement('div');
        dummyEl.innerHTML = `
          <div class="ani-setting-item ani-flex">
            <div class="ani-setting-value ani-set-flex-right">
              <div class="ani-checkbox">
                <label class="ani-checkbox__label">
                <input type="checkbox" name="ani-checkbox">
                  <div class="ani-checkbox__button"></div>
                </label>
              </div>
            </div>
          </div>
        `;

        const itemEl = /** @type {HTMLDivElement} */ (dummyEl.firstElementChild);
        itemEl.prepend(createSettingItemLabelEl(config));

        const inputEl = itemEl.querySelector('input');
        if (inputEl) {
          if (config.id) {
            inputEl.id = config.id;
          }
          inputEl.checked = config.value ?? false;
        }

        return {
          ...createSettingComponentAttrs(config, inputEl),
          el: itemEl,
        };
      } else if (config.type === 'number') {
        const dummyEl = document.createElement('div');
        dummyEl.innerHTML = `
          <div class="ani-setting-item ani-flex">
            <div class="ani-setting-value ani-set-flex-right">
              <input type="number" class="ani-input" style="margin:0">
            </div>
          </div>
        `;

        const itemEl = /** @type {HTMLDivElement} */ (dummyEl.firstElementChild);
        itemEl.prepend(createSettingItemLabelEl(config));

        const inputEl = dummyEl.querySelector('input');
        if (inputEl) {
          if (config.id) {
            inputEl.id = config.id;
          }
          inputEl.value = config.value !== undefined ? String(config.value) : '';
          if (config.max !== undefined) {
            inputEl.max = String(config.max);
          }
          if (config.min !== undefined) {
            inputEl.min = String(config.min);
          }
          if (config.placeholder !== undefined) {
            inputEl.placeholder = config.placeholder;
          }
        }

        return {
          ...createSettingComponentAttrs(config, inputEl),
          el: itemEl,
        };
      } else if (config.type === 'html') {
        const dummyEl = document.createElement('div');
        dummyEl.innerHTML = config.html;
        const itemEl = dummyEl.firstElementChild ?? dummyEl;
        return {
          ...createSettingComponentAttrs(config, itemEl),
          el: itemEl,
        };
      } else {
        throw new Error(`Unknown setting item: ${config}`);
      }
    }

    /**
     * @param {SettingSectionConfig} config
     * @returns {SettingComponent}
     */
    function createSettingSectionComp(config) {
      const { title, id, tip, items } = config;

      const sectionEl = document.createElement('div');
      sectionEl.classList.add('ani-setting-section');

      const titleEl = document.createElement('h4');
      titleEl.classList.add('ani-setting-title');
      titleEl.textContent = title;

      if (id) {
        sectionEl.id = id;
      }
      if (tip) {
        const tipEl = createSettingTipEl(tip);
        tipEl.style.marginLeft = '8px';
        titleEl.appendChild(tipEl);
      }

      sectionEl.appendChild(titleEl);

      const itemComponents = items.map((item) => createSettingItemComp(item));
      for (const { el } of itemComponents) {
        sectionEl.append(el);
      }

      return {
        ...mergeSettingComponentAttrs(itemComponents),
        el: sectionEl,
      };
    }

    /**
     * @param {SettingTabConfig} config
     * @returns {SettingComponent}
     */
    function createSettingTabComp(config) {
      const tabEl = document.createElement('div');
      if (config.id) {
        tabEl.id = config.id;
      }
      tabEl.classList.add('ani-tab-content__item');

      const sectionComponents = config.sections.map((section) => createSettingSectionComp(section));
      for (const { el } of sectionComponents) {
        tabEl.append(el);
      }

      return {
        ...mergeSettingComponentAttrs(sectionComponents),
        el: tabEl,
      };
    }

    /**
     * @template {Element} T
     * @param {SettingBaseConfig<T>} config
     * @param {T | null} el
     * @returns {Omit<SettingComponent, 'el'>}
     */
    function createSettingComponentAttrs(config, el) {
      return {
        onMounted: (config.onMounted && el) ? config.onMounted.bind(null, el) : undefined,
        onSettings: (config.onSettings && el) ? config.onSettings.bind(null, el) : undefined,
        shortcuts: (config.shortcuts && el) ?
          Object.fromEntries(
            Object.entries(config.shortcuts).map(([key, handler]) => {
              return [key, [handler.bind(null, el)]];
            }),
          ) :
          undefined,
      };
    }

    /**
     * @param {SettingComponent[]} components
     * @returns {Omit<SettingComponent, 'el'>}
     */
    function mergeSettingComponentAttrs(components) {
      return {
        onMounted() {
          for (const { onMounted } of components) {
            onMounted?.();
          }
        },
        onSettings(settings) {
          for (const { onSettings } of components) {
            onSettings?.(settings);
          }
        },
        shortcuts: components
          .flatMap(({ shortcuts }) => Object.entries(shortcuts ?? {}))
          .reduce((acc, [key, handlers]) => {
            if (!acc[key]) {
              acc[key] = [];
            }
            acc[key].push(...handlers);
            return acc;
          }, /** @type {NonNullable<SettingComponent['shortcuts']>} */ ({})),
      };
    }

    /**
     * @returns {Record<string, Array<() => void>>}
     */
    function getLocalShortcuts() {
      return tabContentComponent?.shortcuts ?? {};
    }

    /**
     * @param {Partial<Settings>} settings
     */
    function applySettings(settings) {
      if (settings.timelineActions) {
        timelineActions = settings.timelineActions;
      }
      tabContentComponent?.onSettings?.(settings);
    }

    attachCss();
    attachTabUi();
    attachTabContentUi();

    return {
      applySettings,
      getLocalShortcuts,
    };
  }

  /**
   * @returns {Promise<VjsPlayerElement>}
   */
  async function waitVjsPlayerElementInit() {
    /**
     * @returns {VjsPlayerElement | null}
     */
    function queryVjsPlayerElement() {
      return document.querySelector('.video-js');
    }

    /**
     * @param {VjsPlayerElement} vjsPlyer
     * @returns {boolean}
     */
    function checkVjsPlayerElementReady(vjsPlyer) {
      return !!vjsPlyer.querySelector('.stop');
    }

    let vjsPlyer = queryVjsPlayerElement();
    if (vjsPlyer && checkVjsPlayerElementReady(vjsPlyer)) {
      return vjsPlyer;
    }

    /** @type {MutationObserver | undefined} */
    let mutationObserver;
    return new Promise((resolve) => {
      mutationObserver = new MutationObserver(async () => {
        if (!vjsPlyer) {
          vjsPlyer = queryVjsPlayerElement();
        }
        if (vjsPlyer && checkVjsPlayerElementReady(vjsPlyer)) {
          resolve(vjsPlyer);
        }
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }).finally(() => {
      mutationObserver?.disconnect();
    });
  }

  async function main() {
    const settings = await loadSettings();
    const vjsPlayerElement = await waitVjsPlayerElementInit();

    const contentRatingStore = useContentRating(vjsPlayerElement);
    const nextEpisodeStore = useNextEpisode(vjsPlayerElement);
    const shortcutsStore = useShortcuts(vjsPlayerElement);
    const timelineActionsStore = useTimelineActions(vjsPlayerElement);
    const settingUiStore = useSettingUi(vjsPlayerElement, (settings) => {
      saveSettings(settings);
      applySettings(settings);
    });

    shortcutsStore.addLocalShortcuts(settingUiStore.getLocalShortcuts());

    /**
     * @param {Partial<Settings>} settings
     */
    function applySettings(settings) {
      if (settings.autoAgreeContentRating !== undefined) {
        contentRatingStore.enableAutoAgreeContentRating(settings.autoAgreeContentRating);
      }
      if (settings.autoPlayNextEpisode !== undefined) {
        nextEpisodeStore.enableAutoPlayNextEpisode(settings.autoPlayNextEpisode);
      }
      if (settings.autoPlayNextEpisodeDelay !== undefined) {
        nextEpisodeStore.setAutoPlayNextEpisodeDelay(settings.autoPlayNextEpisodeDelay);
      }
      if (settings.shortcutActions !== undefined) {
        shortcutsStore.setCustomShortcuts(settings.shortcutActions);
      }
      if (settings.timelineActions !== undefined) {
        timelineActionsStore.setTimelineActions(settings.timelineActions);
      }
      settingUiStore.applySettings(settings);
    }

    applySettings(settings);
  }

  main();
})();
