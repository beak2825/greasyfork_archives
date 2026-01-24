// ==UserScript==
// @name          Auto hide next up card for Amazon Prime Video
// @namespace     http://tampermonkey.net/
// @version       2.15.2
// @description   Hides next up card and other obtrusive elements of Amazon Prime Video.
// @author        ryo-fujinone
// @match         https://*.amazon.co.jp/*
// @match         https://*.amazon.com/*
// @match         https://*.amazon.ae/*
// @match         https://*.amazon.co.uk/*
// @match         https://*.amazon.it/*
// @match         https://*.amazon.in/*
// @match         https://*.amazon.eg/*
// @match         https://*.amazon.com.au/*
// @match         https://*.amazon.nl/*
// @match         https://*.amazon.ca/*
// @match         https://*.amazon.sa/*
// @match         https://*.amazon.sg/*
// @match         https://*.amazon.se/*
// @match         https://*.amazon.es/*
// @match         https://*.amazon.de/*
// @match         https://*.amazon.com.tr/*
// @match         https://*.amazon.com.br/*
// @match         https://*.amazon.fr/*
// @match         https://*.amazon.com.be/*
// @match         https://*.amazon.pl/*
// @match         https://*.amazon.com.mx/*
// @match         https://*.amazon.cn/*
// @match         https://*.primevideo.com/*
// @grant         GM_registerMenuCommand
// @grant         GM.registerMenuCommand
// @grant         GM_getResourceText
// @resource      xhook https://cdn.jsdelivr.net/gh/ryo-fujinone/auto-hide-next-up-card-for-amazon-prime-video@78d9834a5e04046a2b75ed8777d88faf3d106064/src/xhook.min.js
// @license       MIT; https://github.com/ryo-fujinone/auto-hide-next-up-card-for-amazon-prime-video/blob/main/LICENSE
// @downloadURL https://update.greasyfork.org/scripts/478102/Auto%20hide%20next%20up%20card%20for%20Amazon%20Prime%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/478102/Auto%20hide%20next%20up%20card%20for%20Amazon%20Prime%20Video.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const observeConfig = Object.freeze({ childList: true, subtree: true });

  const getDefaultOptions = () => {
    return {
      skipAds: true,
      hideSkipIntroBtn: true,
      showSkipIntroBtnOnOverlay: false,
      hideNextup: true,
      temporarilyDisableOverlay: true,
      preventsDarkeningInConjunctionWithNextup: true,
      showNextupOnOverlay: false,
      clickHideButtonForAllNextup: false,
      hideReactions: true,
      showReactionsOnOverlay: false,
      hideRecommendations: true,
      showRecommendationsOnOverlay: false,
      hideRating: true,
      preventsDarkening: false,
      addOutlinesForTextsAndIcons: false,
      addShadowsToSeekBar: false,
      moveCenterButtonsToBottom: false,
      hideTitle: false,
      hideEpisodeTitle: false,
      hideVariousButtonsInTopRight: false,
      hideSeekBar: false,
      hidePlaybackTime: false,
      hideCenterButtons: false,
      hideNextEpisodeButton: false,
      tweakHideSkipIntroButton: false,
      tweakShowVideoResolutionInfo: false,
      useOnLiveTv: false,
      shortcutKey: {
        ctrl: false,
        alt: true,
        shift: false,
        charCode: "KeyP",
      },
      shortcutKeyIsEnabled: true,
      forceHighestResolution_xhook: false,
      forceHighestResolutionLenient_xhook: false,
      showVideoResolution_xhook: false,
      removeAdRelatedData: false,
      enableAutoplay_xhook: false,
      removeNextupTimecodes_xhook: false,
      disableRecommendations_xhook: false,
      disableReactions_xhook: false,
      forcePlayNextEpisode_xhook: false,
      scriptVersion: "2.15.2",
    };
  };

  class ScriptInfo {
    static #info;

    static get() {
      if (this.#info) {
        return this.#info;
      }

      // user script
      try {
        const gmInfo = window.GM_info || GM_info;
        const scriptVer = gmInfo.script.version;
        if (typeof scriptVer === "string") {
          this.#info = {
            scriptType: "user-script",
            scriptVersion: scriptVer,
          };
          return this.#info;
        }
      } catch (e) {
        // console.log(e);
      }

      // chrome/firefox extension
      try {
        const chromeExtVer = chrome?.runtime?.getManifest()?.version;
        if (typeof chromeExtVer === "string") {
          this.#info = {
            scriptType: "chrome-extension",
            scriptVersion: chromeExtVer,
          };
          return this.#info;
        }
      } catch (e) {
        // console.log(e);
      }

      // unknown
      this.#info = {
        scriptType: "unknown",
        scriptVersion: getDefaultOptions().scriptVersion,
      };
      return this.#info;
    }

    static isUserScript() {
      const type = this.get().scriptType;
      return type === "user-script";
    }

    static isChromeExtension() {
      // This is also “true” when using Firefox
      const type = this.get().scriptType;
      return type === "chrome-extension";
    }
  }

  // array of alphabets used to set shortcut keys.
  class CharStore {
    static #chars = [];
    static #codeStrs = [];
    static #startCode = "A".charCodeAt(0);

    static getChars() {
      if (this.#chars.length) {
        return this.#chars;
      }
      [...Array(26)].forEach((_, i) => {
        const char = String.fromCharCode(this.#startCode + i);
        this.#chars.push(char);
      });
      return this.#chars;
    }

    static getCodeStrs() {
      if (this.#codeStrs.length) {
        return this.#codeStrs;
      }
      this.getChars().forEach((c) => {
        this.#codeStrs.push("Key" + c);
      });
      return this.#codeStrs;
    }
  }

  const addStyle = (css, id) => {
    const style = document.createElement("style");
    if (id) {
      style.setAttribute("id", id);
    }
    style.textContent = css;
    document.head.appendChild(style);
  };

  const saveOptionsToChromeStorage = async (newOptions) => {
    await chrome.storage.local.set({ options: newOptions });
  };

  const getOptionsFromChromeStorage = async () => {
    const result = await chrome.storage.local.get(["options"]);
    return result.options;
  };

  const saveOptionsToLocalStorage = (newOptions) => {
    const jsonStr = JSON.stringify(newOptions);
    localStorage.setItem("nextup-ext", jsonStr);
  };

  const getOptionsFromLocalStorage = () => {
    return localStorage.getItem("nextup-ext");
  };

  const saveDefaultOptions = () => {
    return new Promise(async (resolve) => {
      const newOptions = getDefaultOptions();
      if (ScriptInfo.isChromeExtension()) {
        await saveOptionsToChromeStorage(newOptions);
      } else {
        saveOptionsToLocalStorage(newOptions);
      }
      resolve();
    });
  };

  const getOptions = () => {
    return new Promise(async (resolve) => {
      if (ScriptInfo.isChromeExtension()) {
        const options = await getOptionsFromChromeStorage();
        if (!options) {
          await saveDefaultOptions();
          resolve(getDefaultOptions());
        } else {
          resolve(options);
        }
      } else {
        const jsonStr = getOptionsFromLocalStorage();
        if (!jsonStr) {
          await saveDefaultOptions();
          resolve(getDefaultOptions());
        } else {
          resolve(JSON.parse(jsonStr));
        }
      }
    });
  };

  const saveOptions = (_newOptions = {}, shouldReplace = false) => {
    return new Promise(async (resolve) => {
      let newOptions;
      if (shouldReplace) {
        // This pattern is required for the updateOptionVersion function
        newOptions = _newOptions;
      } else {
        // Normal pattern
        const options = await getOptions();
        newOptions = {
          ...options,
          ..._newOptions,
        };
      }

      if (ScriptInfo.isChromeExtension()) {
        await saveOptionsToChromeStorage(newOptions);
      } else {
        saveOptionsToLocalStorage(newOptions);
      }
      resolve();
    });
  };

  const updateOptionVersion = async (scriptInfo) => {
    const options = await getOptions();
    if (options.scriptVersion === scriptInfo.scriptVersion) {
      // Developers can force updates to option values.
      const key = "nextup-ext-force-update-option-version";
      if (localStorage.getItem(key) !== "true") {
        return;
      }
      console.log(`%c${key}`, "color:yellow; font-weight:bold;");
    }

    const defaultOptions = getDefaultOptions();
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      scriptVersion: scriptInfo.scriptVersion,
    };
    const mergedOptionsKeys = Object.keys(mergedOptions);
    const newOptions = mergedOptionsKeys.reduce((obj, key) => {
      if (Object.hasOwn(defaultOptions, key)) {
        obj[key] = mergedOptions[key];
      }
      return obj;
    }, {});

    await saveOptions(newOptions, true);
  };

  const migrateStorage = async () => {
    if (!ScriptInfo.isChromeExtension()) {
      return;
    }
    if (await getOptionsFromChromeStorage()) {
      // localStorage.removeItem("nextup-ext");
      return;
    }

    const jsonStr = getOptionsFromLocalStorage();
    if (!jsonStr) {
      return;
    }

    const options = JSON.parse(jsonStr);
    await saveOptionsToChromeStorage(options);
    // localStorage.removeItem("nextup-ext");
  };

  const getOptionDialog = () => {
    return document.querySelector(".nextup-ext-opt-dialog");
  };

  const getShortcutKeyInput = () => {
    return document.querySelector("#shortcutkey-for-dialog");
  };

  const getVisibleVideo = () => {
    const videos = document.querySelectorAll(".dv-player-fullscreen video");
    if (videos.length === 0) {
      return;
    }
    return Array.from(videos).find((v) => v.checkVisibility());
  };

  const togglePlayAndPause = () => {
    const uiContainer = document.querySelector(
      ".dv-player-fullscreen .webPlayerSDKUiContainer"
    );
    if (uiContainer) {
      uiContainer.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 32 }));
    }
  };

  const playVideo = () => {
    const videos = document.querySelectorAll(".dv-player-fullscreen video");
    if (videos.length === 0) {
      return;
    }
    if (videos.length === 1) {
      const video = videos[0];
      if (video.paused) {
        video.play();
      }
    } else {
      // for LiveTV
      const video = getVisibleVideo();
      if (!video) {
        return;
      }
      try {
        if (video.paused) {
          togglePlayAndPause();
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const pauseVideo = () => {
    const videos = document.querySelectorAll(".dv-player-fullscreen video");
    if (videos.length === 0) {
      return;
    }
    if (videos.length === 1) {
      const video = videos[0];
      if (!video.paused) {
        video.pause();
      }
    } else {
      // for LiveTV
      const video = getVisibleVideo();
      if (!video) {
        return;
      }
      try {
        if (!video.paused) {
          togglePlayAndPause();
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  class Dialog {
    static #clickedOutSide = null;
    static #_clickedOutSide(e) {
      if (e.target.classList.contains("nextup-ext-opt-dialog")) {
        e.target.close();
      }
    }

    static async #setShortcutKeyVal() {
      const options = await getOptions();
      let shortcutKeyStrs = [];
      if (options.shortcutKey.ctrl) {
        shortcutKeyStrs.push("Ctrl");
      }
      if (options.shortcutKey.alt) {
        shortcutKeyStrs.push("Alt");
      }
      if (options.shortcutKey.shift) {
        shortcutKeyStrs.push("Shift");
      }
      const codeStrs = CharStore.getCodeStrs();
      const chars = CharStore.getChars();
      const char = chars[codeStrs.indexOf(options.shortcutKey.charCode)];
      if (char) {
        shortcutKeyStrs.push(char);
      } else {
        shortcutKeyStrs = ["Alt", "P"];
        await saveOptions({ shortcutKey: getDefaultOptions().shortcutKey });
      }

      if (!this.#changeShortcutKeyVal) {
        this.#changeShortcutKeyVal = this.#_changeShortcutKeyVal.bind(this);
      }

      const shortcutKeyStr = shortcutKeyStrs.join(" + ");
      const shortcutKeyInput = getShortcutKeyInput();
      if (shortcutKeyInput) {
        shortcutKeyInput.value = shortcutKeyStr;
        shortcutKeyInput.addEventListener("keydown", this.#changeShortcutKeyVal);
      }
    }

    static #changeShortcutKeyVal = null;
    static async #_changeShortcutKeyVal(e) {
      if (e.code === "Tab" || e.code === "Escape" || e.code === "F5") {
        return;
      }
      const codeStrs = CharStore.getCodeStrs();
      if (codeStrs.indexOf(e.code) === -1 || (!e.ctrlKey && !e.altKey)) {
        e.preventDefault();
        return;
      }

      const newShortcutKeyOptions = getDefaultOptions().shortcutKey;
      let shortcutKeyStrs = [];
      if (e.ctrlKey) {
        shortcutKeyStrs.push("Ctrl");
      }
      newShortcutKeyOptions.ctrl = e.ctrlKey;
      if (e.altKey) {
        shortcutKeyStrs.push("Alt");
      }
      newShortcutKeyOptions.alt = e.altKey;
      if (e.shiftKey) {
        shortcutKeyStrs.push("Shift");
      }
      newShortcutKeyOptions.shift = e.shiftKey;
      const chars = CharStore.getChars();
      const char = chars[codeStrs.indexOf(e.code)];
      shortcutKeyStrs.push(char);
      newShortcutKeyOptions.charCode = e.code;

      const shortcutKeyStr = shortcutKeyStrs.join(" + ");
      const shortcutKeyInput = getShortcutKeyInput();
      shortcutKeyInput.value = shortcutKeyStr;

      await saveOptions({ shortcutKey: newShortcutKeyOptions });
    }

    static async whenOpening() {
      pauseVideo();

      const optDialog = getOptionDialog();
      optDialog.focus();

      await this.#setShortcutKeyVal();
      if (!this.#clickedOutSide) {
        this.#clickedOutSide = this.#_clickedOutSide.bind(this);
      }
      document.addEventListener("click", this.#clickedOutSide);
    }

    static whenClosed() {
      const shortcutKeyInput = getShortcutKeyInput();
      if (shortcutKeyInput) {
        shortcutKeyInput.removeEventListener(
          "keydown",
          this.#changeShortcutKeyVal
        );
      }
      document.removeEventListener("click", this.#clickedOutSide);
      playVideo();
    }
  }

  const createOptionMessages = () => {
    const jaMessages = {
      promptReloadPage: "オプションを変更した場合はページをリロードしてください",
      skipAds: "広告をスキップする",
      skipAds_Tooltip:
        "本編をスキップしてしまわないように1000ミリ秒分を残します。",
      hideSkipIntroBtn: "イントロスキップボタンを非表示にする",
      showSkipIntroBtnOnOverlay:
        "オーバーレイ表示が有効な時はイントロスキップボタンを表示する",
      hideNextup: "Next upを非表示にする",
      temporarilyDisableOverlay:
        "非表示ボタンの自動クリック時に5秒間オーバーレイ表示を無効にする",
      preventsDarkeningInConjunctionWithNextup:
        "Next upの出現と同時に画面が暗くなるのを防ぐ",
      showNextupOnOverlay: "オーバーレイ表示が有効な時はNext upを表示する",
      showNextupOnOverlay_Tooltip:
        "自動再生が無効、或いはNext upの非表示ボタンが自動クリックされない場合に表示されます。",
      clickHideButtonForAllNextup:
        "全てのNext upの非表示ボタンをクリックする（自動再生の完全なキャンセル）",
      clickHideButtonForAllNextup_Tooltip: `通常はこのオプションを有効にする必要はありません。\n
      Next upには「通常のNext up」と「動画終了の数秒前に表示されるNext up」の2つが存在します。
      自動再生が有効な場合はどちらにも非表示ボタンが表示されますが、後者の非表示ボタンはクリックすると自動再生が完全にキャンセルされ、動画が終了すると動画プレイヤーが閉じてしまいます。
      そのため非表示ボタンの自動クリックは通常のNext upでのみ行うようにしていますが、このオプションを使用することでその条件を無視して非表示ボタンを自動クリックさせることが可能です。
      このオプションは念の為に用意しているもので、通常は有効にする必要はありません。`,
      hideReactions: "Reactions（好き/好きではない）を非表示にする",
      showReactionsOnOverlay: "オーバーレイ表示が有効な時はReactionsを表示する",
      showReactionsOnOverlay_Tooltip:
        "Next upの非表示が有効の場合、非表示ボタンの自動クリックでNext upとReactionsがDOMから削除されます。",
      hideRecommendations: "おすすめの商品を非表示にする",
      hideRecommendations_Tooltip: `Hideボタンの自動クリック時に「非表示ボタンの自動クリック時に5秒間オーバーレイ表示を無効にする」の設定が参照されます。
      ライブ配信のカルーセルについては、この機能では非表示の対象にはしていません。`,
      showRecommendationsOnOverlay:
        "オーバーレイ表示が有効な時はおすすめの商品を表示する",
      hideRating: "レーティングを非表示にする",
      preventsDarkening: "オーバーレイ表示が有効な時に暗くならないようにする",
      addOutlinesForTextsAndIcons: "文字とアイコンを黒で縁取りする",
      addShadowsToSeekBar: "シークバーに影をつける",
      moveCenterButtonsToBottom:
        "中央のボタン（再生/停止、戻る、進む）を下部に移動する",
      hideVariousTextAndButtons: "各種テキストやボタンを非表示にする",
      hideVariousTextAndButtons_Tooltip: `Ctrl/Shiftキーを押しながらマウスを操作している間は、非表示にしている要素が表示状態になります。
      右上の各種ボタンについては非表示にしている場合でもクリック可能です。`,
      hideTitle: "タイトルを非表示にする",
      hideEpisodeTitle: "エピソード名を非表示にする",
      hideVariousButtonsInTopRight: "右上の各種ボタンを非表示にする",
      hidePlaybackTime: "再生時間表示を非表示にする",
      hideSeekBar: "シークバーを非表示にする",
      hideCenterButtons: "中央のボタンを非表示にする",
      hideNextEpisodeButton: "次のエピソードボタンを非表示にする",
      tweakHideSkipIntroButton: "イントロスキップボタンの非表示機能を調整する",
      tweakHideSkipIntroButton_Tooltip: `「イントロスキップボタンを非表示にする」が有効になっている場合の挙動を調整します。
      Ctrl/Shiftキーを押しながらマウスを操作している間のみ、イントロスキップボタンが表示状態になります。`,
      tweakShowVideoResolutionInfo: "動画の解像度を表示する機能を調整する",
      tweakShowVideoResolutionInfo_Tooltip: `「左下に動画の解像度を表示する」が有効になっている場合の挙動を調整します。
      Ctrl/Shiftキーを押しながらマウスを操作している間のみ、解像度が表示状態になります。`,
      useOnLiveTv: "実験的: ライブ配信の再生でこの拡張機能を使用する",
      useOnLiveTv_Tooltip: `ライブ配信の再生でこの拡張機能を動作させたい場合に有効にしてください。
      なおこのオプションが無効でもダイアログを開くためのアイコンは表示されます。\n
      ライブ配信で動作確認が取れている機能は以下です。
      - オーバーレイ表示が有効な時に暗くならないようにする
      - 中央のボタン（再生/停止、戻る、進む）を下部に移動する
      - 各種テキストやボタンを非表示にする`,
      enableShortcutKey:
        "動画再生中にショートカットキーでオプションダイアログを開けるようにする",
      shortcutKeyForDialog: "オプションダイアログを開くショートカットキー",
      shortcutKeyForDialog_Tooltip: "Ctrl/Altとアルファベットは必須。",
      monitorNetworkActivity: "通信の監視・改変",
      monitorNetworkActivity_Tooltip: `通信の監視・改変を行うことでプライムビデオの挙動を制御します。
      広告ブロック系の拡張機能との併用は避けることを推奨します。`,
      forceHighestResolution: "強制的に最高画質で再生する",
      forceHighestResolution_Tooltip: `プライムビデオは通信状況やウィンドウサイズなどを基に画質を動的に制御します。
      この機能は、最高画質を強制するために、マニフェスト（MPD）から最高画質以外の情報を除去します。\n
      HD画質（720p/1080p）で再生できるかどうかは、OS・ブラウザ・端末によって変わります。
      ユーザーエージェント要件とWidevine要件があると思われ、両方が満たされない場合、標準画質に制限されるようです。
      WindowsとmacOSの場合、Widevine要件（VMP）を満たすブラウザでのみHD画質で再生可能だと思われます。
      （プライムビデオはChrome、Firefox、Edge、Safari、Operaを公式にサポートし、その他Brave、VivaldiでもHDで再生可能）
      Androidのブラウザを使用する場合、ユーザーエージェントをWindowsかmacOSに偽装することでHD画質で再生できる可能性があります。
      Linuxの場合、HD画質での再生に必要なWidevine要件を満たすことはできません。`,
      forceHighestResolutionLenient:
        "実験的: 最高品質ではない最高解像度での再生を許容する",
      forceHighestResolutionLenient_Tooltip: `「強制的に最高画質で再生する」機能でエラーが発生する場合に有効にすることで、問題が解決する可能性があります。\n
      「強制的に最高画質で再生する」機能では最高解像度の中の最高品質の再生を試みます。
      このオプションを有効にすると、最高品質ではないが最高解像度ではある動画の再生が許容されます。`,
      showVideoResolution: "左下に動画の解像度を表示する",
      removeAdRelatedData: "広告関連のデータを除去する",
      removeAdRelatedData_Tooltip:
        "この機能が有効な時に動画が途中で止まることがある場合は、この機能を無効にしてください。",
      enableAutoplay: "自動再生のフラグをtrueに変更する",
      enableAutoplay_Tooltip: `プライムビデオの設定を変更せずに自動再生を活用するための機能です。
      他の視聴環境の都合で自動再生をオンにしたくない場合に役立ちます。`,
      removeNextupTimecodes: "Next upのタイムコードを除去する",
      removeNextupTimecodes_Tooltip: `通常はこの機能を有効にする必要はありません。\n
      この機能は「通常のNext up」を無効化する機能です。
      「動画終了の数秒前に表示されるNext up」は無効化されません。
      「Next upを非表示にする」機能で問題が発生している場合に、この機能で対処できる可能性があります。\n
      なおこの機能を有効にすると、「おすすめの商品」の表示も無効化されます。
      「おすすめの商品」のみを無効化したい場合はこの機能を有効にせず、「おすすめの商品を無効にする」を有効にしてください。`,
      disableRecommendations: "おすすめの商品を無効にする",
      disableReactions: "Reactions（好き/好きではない）を無効にする",
      forcePlayNextEpisode:
        "実験的: 動画終了時に自動的に閉じた場合に次のエピソードを再生する",
      forcePlayNextEpisode_Tooltip: `この機能は自動再生で6回連続で再生した後に動画が閉じてしまう挙動への対処策として使用可能です。
      また、自動再生の代替手段としても機能します。\n
      Chromeの場合、サイトに対して [音声] の権限を許可する必要があります。
      Firefoxの場合、サイトに対して [自動再生] の権限を許可する必要があります。\n
      この機能はサジェストされたコンテンツに遷移した後の次のエピソードの再生をサポートしていません。
      また、動作の安定性のために次のシーズンへの遷移もサポートしていません。\n
      次のエピソードがあるかどうかの判定に1500ミリ秒の待機時間を設定しています。
      最後まで再生して動画が閉じた場合やEscキーの入力で動画を閉じた場合、必要に応じて1500ミリ秒の間は画面を暗くします。`,
      close: "閉じる",
    };
    const enMessages = {
      promptReloadPage: "If you change the options, please reload the page",
      skipAds: "Skip ads",
      skipAds_Tooltip: "Leave 1000 ms for stability of operation",
      hideSkipIntroBtn: "Hide skip intro button",
      showSkipIntroBtnOnOverlay:
        "Show skip intro button when overlay display is enabled",
      hideNextup: "Hide next up card",
      temporarilyDisableOverlay:
        "Disable overlay for 5 seconds when auto-clicking hide button",
      preventsDarkeningInConjunctionWithNextup:
        "Prevents darkening in conjunction with next up appears",
      showNextupOnOverlay: "Show next up card when overlay display is enabled",
      showNextupOnOverlay_Tooltip:
        "This works if autoplay is disabled or if the next up card's hide button is not clicked automatically.",
      clickHideButtonForAllNextup:
        "Click the hide button for all next-up-cards (cancel autoplay completely)",
      clickHideButtonForAllNextup_Tooltip: `Normally it is not necessary to enable this option.\n
      There are two types of next up cards: “normal next up” and "next up displayed a few seconds before the end of the video".
      A hide button appears on both when autoplay is enabled, but clicking the latter hide button cancels autoplay completely and closes the video player when the video ends.
      Therefore, the auto-click of the hide button is only done with the normal next up card, but this option can be used to ignore that condition and have the hide button auto-click.
      This option is provided just in case and does not normally need to be enabled.`,
      hideReactions: "Hide reactions (like/not for me)",
      showReactionsOnOverlay: "Show Reactions when overlay display is enabled",
      showReactionsOnOverlay_Tooltip:
        "If hide next up card is enabled, auto-clicking the hide button will remove next up card and reactions from the DOM",
      hideRecommendations: "Hide featured items",
      hideRecommendations_Tooltip: `The setting “Disable overlay for 5 seconds when auto-clicking hide button” is referenced when the Hide button in “Featured items” is automatically clicked.
      LiveTV carousels are not targeted for hiding in this feature.`,
      showRecommendationsOnOverlay:
        "Show featured items when overlay display is enabled",
      hideRating: "Hide rating",
      preventsDarkening: "Prevents darkening when overlay display is enabled",
      addOutlinesForTextsAndIcons: "Add outlines for texts and icons",
      addShadowsToSeekBar: "Add shadows to the seek bar",
      moveCenterButtonsToBottom:
        "Move the center buttons(Play/Pause, Back and Forward) to the bottom",
      hideVariousTextAndButtons: "Hide various text and buttons",
      hideVariousTextAndButtons_Tooltip: `While holding down the Ctrl or Shift key and using the mouse, hidden elements will be displayed.
      The various buttons in the top right remain clickable even when hidden.`,
      hideTitle: "Hide title",
      hideEpisodeTitle: "Hide episode title",
      hideVariousButtonsInTopRight: "Hide various buttons in the top right",
      hideSeekBar: "Hide seek bar",
      hidePlaybackTime: "Hide playback time",
      hideCenterButtons: "Hide center buttons",
      hideNextEpisodeButton: "Hide next episode button",
      tweakHideSkipIntroButton: "Tweak the feature to hide skip intro button",
      tweakHideSkipIntroButton_Tooltip: `Tweaks the behavior when [Hide skip intro button] is enabled.
      The intro skip button will only be shown while you are operating the mouse with the Ctrl/Shift keys pressed.`,
      tweakShowVideoResolutionInfo: "Tweak the feature to show video resolution",
      tweakShowVideoResolutionInfo_Tooltip: `Tweaks the behavior when [Show video resolution in bottom left] is enabled.
      The video resolution will only be shown while you are operating the mouse with the Ctrl/Shift keys pressed.`,
      useOnLiveTv: "Experimental: Use this extension on LiveTV",
      useOnLiveTv_Tooltip: `Enable this option if you want this extension to work with LiveTV.
      Note that even if this option is disabled, the icon to open the dialog will still be displayed.\n
      The following features have been confirmed to work with LiveTV.
      - Prevents darkening when overlay display is enabled
      - Move the center buttons(Play/Pause, Back and Forward) to the bottom
      - Hide various text and buttons`,
      enableShortcutKey:
        "Enable shortcut key to open the options dialog during video playback",
      shortcutKeyForDialog: "Shortcut key to open the options dialog",
      shortcutKeyForDialog_Tooltip: "Ctrl/Alt and alphabets are required",
      monitorNetworkActivity: "Monitor and modify network activity",
      monitorNetworkActivity_Tooltip: `Controls Prime Video behavior by monitoring and modifying network activity.
      It is not recommended to use in conjunction with ad-blocking extensions.`,
      forceHighestResolution: "Force playback at highest resolution",
      forceHighestResolution_Tooltip: `Prime Video dynamically controls video quality based on factors like network conditions and window size.
      This feature removes information other than the highest quality from the manifest (MPD) to enforce the highest possible quality.\n
      Whether HD quality (720p/1080p) playback is possible varies by OS, browser, and device.
      It appears there are user agent requirements and Widevine requirements; if both are not met, playback may be restricted to standard quality.
      For Windows and macOS, HD playback seems only possible in browsers meeting the Widevine requirements (VMP).
      (Prime Video officially supports Chrome, Firefox, Edge, Safari, and Opera; Brave and Vivaldi also support HD playback)
      When using an Android browser, spoofing the user agent to Windows or macOS may enable HD playback.
      Linux cannot meet the Widevine requirements necessary for HD playback.`,
      forceHighestResolutionLenient:
        "Experimental: Allow playback of videos that are not of the highest quality",
      forceHighestResolutionLenient_Tooltip: `Enabling this option when an error occurs while using the “Force playback at highest resolution” feature may resolve the issue. \n
      The “Force playback at highest resolution” feature attempts to play videos at the highest quality within the highest resolution available.
      When this option is enabled, playback of videos that are at the highest resolution but not at the highest quality will be allowed.`,
      showVideoResolution: "Show video resolution in bottom left",
      removeAdRelatedData: "Remove ad related data",
      removeAdRelatedData_Tooltip:
        "If videos sometimes stop in the middle when this feature is enabled, please try disabling this feature.",
      enableAutoplay: "Change autoplay flag to true",
      enableAutoplay_Tooltip: `This feature is for using autoplay without changing Prime Video settings.
      This is useful if you do not want to turn on automatic playback in consideration of other viewing devices.`,
      removeNextupTimecodes: "Remove next up timecodes",
      removeNextupTimecodes_Tooltip: `Normally there is no need to enable this feature.\n
      This feature disables “normal next up”.
      This feature does not disable the next up that appears a few seconds before the end of the video.
      If you are having problems with the “Hide next up card” feature, this may help.\n
      If this feature is enabled, the “featured items” display will also be disabled.
      If you wish to disable “featured items” only, please do not enable this feature and enable “Disable featured items”.`,
      disableRecommendations: "Disable featured items",
      disableReactions: "Disable reactions (like/not for me)",
      forcePlayNextEpisode:
        "Experimental: Play the next episode if the video is automatically closed at the end of the video",
      forcePlayNextEpisode_Tooltip: `This feature can be used as a workaround for the behavior of autoplay that closes the video after 6 consecutive plays.
      It also works as an alternative to autoplay.\n
      For Chrome, you must allow [audio] permissions for the site.
      For Firefox, you must allow the [Autoplay] permission for the site.\n
      This feature does not support playing the next episode after transitioning to the suggested content.
      Also, transitions to the next season are not supported for operational stability.\n
      A wait time of 1500 milliseconds is set to determine if the next episode is available.
      If the video is closed after playing to the end or by entering the Esc key, the screen is darkened for 1500 milliseconds if necessary.`,
      close: "Close",
    };
    return /ja|ja-JP/.test(window.navigator.language) ? jaMessages : enMessages;
  };

  const createOptionDialog = async (scriptVersion) => {
    if (getOptionDialog()) {
      return;
    }

    const messages = createOptionMessages();
    const options = await getOptions();

    const regexForMultiineTooltips = /^[^\S\r\n]*/gm;

    const dialogHtmlStr = `
  <dialog class="nextup-ext-opt-dialog"><div class="nextup-ext-opt-dialog-inner">
      <button class="nextup-ext-opt-dialog-close-button">&times;</button>
      <div class="nextup-ext-opt-dialog-tab-wrapper">
          <div class="nextup-ext-opt-dialog-tab nextup-ext-opt-dialog-tab-active" data-target="options">Options</div>
          <div class="nextup-ext-opt-dialog-tab" data-target="about">About</div>
      </div>
      <div class="nextup-ext-opt-dialog-content nextup-ext-opt-dialog-content-active" data-tab-id="options">
          <section>
              <div class="group-title nextup-ext-opt-dialog-note">
                <p>${messages.promptReloadPage}</p>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                <label>
                    <input type="checkbox" id="skip-ads" name="skip-ads" ${
                      options.skipAds ? "checked" : ""
                    } />
                    <p>${messages.skipAds}</p>
                </label>
                <p class="nextup-ext-opt-dialog-tooltip" title="${
                  messages.skipAds_Tooltip
                }" data-msg-id="skipAds"></p>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label>
                      <input type="checkbox" id="hide-skip-intro-btn" name="hide-skip-intro-btn" ${
                        options.hideSkipIntroBtn ? "checked" : ""
                      } />
                      <p>${messages.hideSkipIntroBtn}</p>
                  </label>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label class="indent1">
                      <input type="checkbox" id="show-skip-intro-btn" name="show-skip-intro-btn" ${
                        options.showSkipIntroBtnOnOverlay ? "checked" : ""
                      } />
                      <p>${messages.showSkipIntroBtnOnOverlay}</p>
                  </label>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label>
                      <input type="checkbox" id="hide-nextup" name="hide-nextup" ${
                        options.hideNextup ? "checked" : ""
                      } />
                      <p>${messages.hideNextup}</p>
                  </label>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label class="indent1">
                      <input type="checkbox" id="temporarily-disable-overlay" name="temporarily-disable-overlay" ${
                        options.temporarilyDisableOverlay ? "checked" : ""
                      } />
                      <p>${messages.temporarilyDisableOverlay}</p>
                  </label>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label class="indent1">
                      <input type="checkbox" id="prevents-darkening-in-conjunction-with-nextup" name="prevents-darkening-in-conjunction-with-nextup" ${
                        options.preventsDarkeningInConjunctionWithNextup
                          ? "checked"
                          : ""
                      } />
                      <p>${
                        messages.preventsDarkeningInConjunctionWithNextup
                      }</p>
                  </label>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label class="indent1">
                      <input type="checkbox" id="show-nextup" name="show-nextup" ${
                        options.showNextupOnOverlay ? "checked" : ""
                      } />
                      <p>${messages.showNextupOnOverlay}</p>
                  </label>
                  <p class="nextup-ext-opt-dialog-tooltip" title="${
                    messages.showNextupOnOverlay_Tooltip
                  }" data-msg-id="showNextupOnOverlay"></p>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label class="indent1">
                      <input type="checkbox" id="click-hide-button-for-all-nextup" name="click-hide-button-for-all-nextup" ${
                        options.clickHideButtonForAllNextup ? "checked" : ""
                      } />
                      <p>${messages.clickHideButtonForAllNextup}</p>
                  </label>
                  <p class="nextup-ext-opt-dialog-tooltip" title="${messages.clickHideButtonForAllNextup_Tooltip.replaceAll(
                    regexForMultiineTooltips,
                    ""
                  )}" data-msg-id="clickHideButtonForAllNextup"></p>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label>
                      <input type="checkbox" id="hide-reactions" name="hide-reactions" ${
                        options.hideReactions ? "checked" : ""
                      } />
                      <p>${messages.hideReactions}</p>
                  </label>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label class="indent1">
                      <input type="checkbox" id="show-reactions" name="show-reactions" ${
                        options.showReactionsOnOverlay ? "checked" : ""
                      } />
                      <p>${messages.showReactionsOnOverlay}</p>
                  </label>
                  <p class="nextup-ext-opt-dialog-tooltip" title="${
                    messages.showReactionsOnOverlay_Tooltip
                  }" data-msg-id="showReactionsOnOverlay"></p>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label>
                      <input type="checkbox" id="hide-recommendations" name="hide-recommendations" ${
                        options.hideRecommendations ? "checked" : ""
                      } />
                      <p>${messages.hideRecommendations}</p>
                  </label>
                  <p class="nextup-ext-opt-dialog-tooltip" title="${messages.hideRecommendations_Tooltip.replaceAll(
                    regexForMultiineTooltips,
                    ""
                  )}" data-msg-id="hideRecommendations"></p>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label class="indent1">
                      <input type="checkbox" id="show-recommendations-on-overlay" name="show-recommendations-on-overlay" ${
                        options.showRecommendationsOnOverlay ? "checked" : ""
                      } />
                      <p>${messages.showRecommendationsOnOverlay}</p>
                  </label>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label>
                      <input type="checkbox" id="hide-rationg" name="hide-rationg" ${
                        options.hideRating ? "checked" : ""
                      } />
                      <p>${messages.hideRating}</p>
                  </label>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label>
                      <input type="checkbox" id="prevents-darkening" name="prevents-darkening" ${
                        options.preventsDarkening ? "checked" : ""
                      } />
                      <p>${messages.preventsDarkening}</p>
                  </label>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label class="indent1">
                      <input type="checkbox" id="add-outlines-for-texts-and-icons" name="add-outlines-for-texts-and-icons" ${
                        options.addOutlinesForTextsAndIcons ? "checked" : ""
                      } />
                      <p>${messages.addOutlinesForTextsAndIcons}</p>
                  </label>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label class="indent1">
                      <input type="checkbox" id="add-shadow-to-seek-bar" name="add-shadow-to-seek-bar" ${
                        options.addShadowsToSeekBar ? "checked" : ""
                      } />
                      <p>${messages.addShadowsToSeekBar}</p>
                  </label>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label>
                      <input type="checkbox" id="move-center-buttons-to-bottom" name="move-center-buttons-to-bottom" ${
                        options.moveCenterButtonsToBottom ? "checked" : ""
                      } />
                      <p>${messages.moveCenterButtonsToBottom}</p>
                  </label>
              </div>

              <ul>
                  <li>
                      <div class="nextup-ext-opt-dialog-item-container">
                          <label>
                              <p style="margin-right: 4px;">${
                                messages.hideVariousTextAndButtons
                              }</p>
                          </label>
                          <p class="nextup-ext-opt-dialog-tooltip" title="${messages.hideVariousTextAndButtons_Tooltip.replaceAll(
                            regexForMultiineTooltips,
                            ""
                          )}" data-msg-id="hideVariousTextAndButtons"></p>
                      </div>

                      <ul>
                        <li class="list-style-none ml0">
                          <div class="nextup-ext-opt-dialog-item-container">
                              <label>
                                  <input type="checkbox" id="hide-title" name="hide-title" ${
                                    options.hideTitle ? "checked" : ""
                                  } />
                                  <p>${messages.hideTitle}</p>
                              </label>
                          </div>
                        </li>

                        <li class="list-style-none ml0">
                          <div class="nextup-ext-opt-dialog-item-container">
                              <label>
                                  <input type="checkbox" id="hide-episode-title" name="hide-episode-title" ${
                                    options.hideEpisodeTitle ? "checked" : ""
                                  } />
                                  <p>${messages.hideEpisodeTitle}</p>
                              </label>
                          </div>
                        </li>

                        <li class="list-style-none ml0">
                          <div class="nextup-ext-opt-dialog-item-container">
                              <label>
                                  <input type="checkbox" id="hide-various-buttons-in-top-right" name="hide-various-buttons-in-top-right" ${
                                    options.hideVariousButtonsInTopRight
                                      ? "checked"
                                      : ""
                                  } />
                                  <p>${
                                    messages.hideVariousButtonsInTopRight
                                  }</p>
                              </label>
                          </div>
                        </li>

                        <li class="list-style-none ml0">
                          <div class="nextup-ext-opt-dialog-item-container">
                              <label>
                                  <input type="checkbox" id="hide-seek-bar" name="hide-seek-bar" ${
                                    options.hideSeekBar ? "checked" : ""
                                  } />
                                  <p>${messages.hideSeekBar}</p>
                              </label>
                          </div>
                        </li>

                        <li class="list-style-none ml0">
                          <div class="nextup-ext-opt-dialog-item-container">
                              <label>
                                  <input type="checkbox" id="hide-playback-time" name="hide-playback-time" ${
                                    options.hidePlaybackTime ? "checked" : ""
                                  } />
                                  <p>${messages.hidePlaybackTime}</p>
                              </label>
                          </div>
                        </li>

                        <li class="list-style-none ml0">
                          <div class="nextup-ext-opt-dialog-item-container">
                              <label>
                                  <input type="checkbox" id="hide-center-buttons" name="hide-center-buttons" ${
                                    options.hideCenterButtons ? "checked" : ""
                                  } />
                                  <p>${messages.hideCenterButtons}</p>
                              </label>
                          </div>
                        </li>

                        <li class="list-style-none ml0">
                          <div class="nextup-ext-opt-dialog-item-container">
                              <label>
                                  <input type="checkbox" id="hide-next-episode-button" name="hide-next-episode-button" ${
                                    options.hideNextEpisodeButton
                                      ? "checked"
                                      : ""
                                  } />
                                  <p>${messages.hideNextEpisodeButton}</p>
                              </label>
                          </div>
                        </li>

                        <li class="list-style-none ml0">
                          <div class="nextup-ext-opt-dialog-item-container">
                              <label>
                                  <input type="checkbox" id="tweak-hide-skip-intro-button" name="tweak-hide-skip-intro-button" ${
                                    options.tweakHideSkipIntroButton
                                      ? "checked"
                                      : ""
                                  } />
                                  <p>${messages.tweakHideSkipIntroButton}</p>
                              </label>
                              <p class="nextup-ext-opt-dialog-tooltip" title="${messages.tweakHideSkipIntroButton_Tooltip.replaceAll(
                                regexForMultiineTooltips,
                                ""
                              )}" data-msg-id="tweakHideSkipIntroButton"></p>
                          </div>
                        </li>

                        <li class="list-style-none ml0">
                          <div class="nextup-ext-opt-dialog-item-container">
                              <label>
                                  <input type="checkbox" id="tweak-show-video-resolution-info" name="tweak-show-video-resolution-info" ${
                                    options.tweakShowVideoResolutionInfo
                                      ? "checked"
                                      : ""
                                  } />
                                  <p>${
                                    messages.tweakShowVideoResolutionInfo
                                  }</p>
                              </label>
                              <p class="nextup-ext-opt-dialog-tooltip" title="${messages.tweakShowVideoResolutionInfo_Tooltip.replaceAll(
                                regexForMultiineTooltips,
                                ""
                              )}" data-msg-id="tweakShowVideoResolutionInfo"></p>
                          </div>
                        </li>
                      </ul>
                  </li>
              </ul>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label>
                      <input type="checkbox" id="use-on-live-tv" name="use-on-live-tv" ${
                        options.useOnLiveTv ? "checked" : ""
                      } />
                      <p>${messages.useOnLiveTv}</p>
                  </label>
                  <p class="nextup-ext-opt-dialog-tooltip" title="${messages.useOnLiveTv_Tooltip.replaceAll(
                    regexForMultiineTooltips,
                    ""
                  )}" data-msg-id="useOnLiveTv"></p>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label>
                      <input type="checkbox" id="enable-shortcutkey" name="enable-shortcutkey" ${
                        options.shortcutKeyIsEnabled ? "checked" : ""
                      } />
                      <p>${messages.enableShortcutKey}</p>
                  </label>
              </div>

              <ul>
                  <li>
                      <div class="nextup-ext-opt-dialog-item-container">
                          <label>
                              <p style="margin-right: 4px;">${
                                messages.shortcutKeyForDialog
                              }</p>
                              <input type="text" id="shortcutkey-for-dialog" name="shortcutkey-for-dialog" />
                          </label>
                          <p class="nextup-ext-opt-dialog-tooltip" title="${
                            messages.shortcutKeyForDialog_Tooltip
                          }" data-msg-id="shortcutKeyForDialog"></p>
                      </div>
                  </li>
              </ul>
          </section>

          <section class="nextup-ext-opt-dialog-network-activity-monitoring">
              <div class="group-title">
                  <p>${messages.monitorNetworkActivity}</p>
                  <p class="nextup-ext-opt-dialog-tooltip" title="${messages.monitorNetworkActivity_Tooltip.replaceAll(
                    regexForMultiineTooltips,
                    ""
                  )}" data-msg-id="monitorNetworkActivity"></p>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label>
                      <input type="checkbox" id="force-highest-resolution" name="force-highest-resolution" ${
                        options.forceHighestResolution_xhook ? "checked" : ""
                      } />
                      <p>${messages.forceHighestResolution}</p>
                  </label>
                  <p class="nextup-ext-opt-dialog-tooltip" title="${messages.forceHighestResolution_Tooltip.replaceAll(
                    regexForMultiineTooltips,
                    ""
                  )}" data-msg-id="forceHighestResolution"></p>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label class="indent1">
                      <input type="checkbox" id="force-highest-resolution-lenient" name="force-highest-resolution-lenient" ${
                        options.forceHighestResolutionLenient_xhook
                          ? "checked"
                          : ""
                      } />
                      <p>${messages.forceHighestResolutionLenient}</p>
                  </label>
                  <p class="nextup-ext-opt-dialog-tooltip" title="${messages.forceHighestResolutionLenient_Tooltip.replaceAll(
                    regexForMultiineTooltips,
                    ""
                  )}" data-msg-id="forceHighestResolutionLenient"></p>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label class="indent1">
                      <input type="checkbox" id="show-video-resolution" name="show-video-resolution" ${
                        options.showVideoResolution_xhook ? "checked" : ""
                      } />
                      <p>${messages.showVideoResolution}</p>
                  </label>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label>
                      <input type="checkbox" id="remove-ad-related-data" name="remove-ad-related-data" ${
                        options.removeAdRelatedData ? "checked" : ""
                      } />
                      <p>${messages.removeAdRelatedData}</p>
                  </label>
                  <p class="nextup-ext-opt-dialog-tooltip" title="${
                    messages.removeAdRelatedData_Tooltip
                  }" data-msg-id="removeAdRelatedData"></p>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label>
                      <input type="checkbox" id="enable-autoplay" name="enable-autoplay" ${
                        options.enableAutoplay_xhook ? "checked" : ""
                      } />
                      <p>${messages.enableAutoplay}</p>
                  </label>
                  <p class="nextup-ext-opt-dialog-tooltip" title="${messages.enableAutoplay_Tooltip.replaceAll(
                    regexForMultiineTooltips,
                    ""
                  )}" data-msg-id="enableAutoplay"></p>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label>
                      <input type="checkbox" id="remove-nextup-timecodes" name="remove-nextup-timecodes" ${
                        options.removeNextupTimecodes_xhook ? "checked" : ""
                      } />
                      <p>${messages.removeNextupTimecodes}</p>
                  </label>
                  <p class="nextup-ext-opt-dialog-tooltip" title="${messages.removeNextupTimecodes_Tooltip.replaceAll(
                    regexForMultiineTooltips,
                    ""
                  )}" data-msg-id="removeNextupTimecodes"></p>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label>
                      <input type="checkbox" id="disable-recommendations" name="disable-recommendations" ${
                        options.disableRecommendations_xhook ? "checked" : ""
                      } />
                      <p>${messages.disableRecommendations}</p>
                  </label>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label>
                      <input type="checkbox" id="disable-reactions" name="disable-reactions" ${
                        options.disableReactions_xhook ? "checked" : ""
                      } />
                      <p>${messages.disableReactions}</p>
                  </label>
              </div>

              <div class="nextup-ext-opt-dialog-item-container">
                  <label>
                      <input type="checkbox" id="force-play-next-episode" name="force-play-next-episode" ${
                        options.forcePlayNextEpisode_xhook ? "checked" : ""
                      } />
                      <p>${messages.forcePlayNextEpisode}</p>
                  </label>
                  <p class="nextup-ext-opt-dialog-tooltip" title="${messages.forcePlayNextEpisode_Tooltip.replaceAll(
                    regexForMultiineTooltips,
                    ""
                  )}" data-msg-id="forcePlayNextEpisode"></p>
              </div>
          </section>
      </div>

      <div class="nextup-ext-opt-dialog-content nextup-ext-opt-dialog-about" data-tab-id="about">
          <section>
              <div class="group-title">
                <p>Auto hide next up card for Amazon Prime Video</p>
              </div>
              <ul>
                  <li>
                      <a href="https://github.com/ryo-fujinone/auto-hide-next-up-card-for-amazon-prime-video" target="_blank">GitHub</a>
                  </li>
                  <li>
                      <a href="https://ryo-fujinone.net/blog/" target="_blank">Blog</a>
                  </li>
                  <li>
                      <a href="https://x.com/ryo_fujinone" target="_blank">X (@ryo_fujinone)</a>
                  </li>
              </ul>
          </section>
          <section>
              <div class="group-title">
                <p>Credits</p>
              </div>
              <ul>
                  <li>
                      <p>xhook@1.6.2 / Jaime Pillora / MIT</p>
                      <ul>
                          <li>
                              <a href="https://github.com/ryo-fujinone/xhook" target="_blank">forked by ryo-fujinone</a>
                          </li>
                      </ul>
                  </li>
              </ul>
          </section>
      </div>

      <div class="nextup-ext-opt-dialog-version"><span>v${scriptVersion}</span></div>
  </div></dialog>
  `;

    document.body.insertAdjacentHTML("beforeend", dialogHtmlStr);
    document.documentElement.dataset.nextupExtOptDialogCreated = true;

    const css = `
    .nextup-ext-opt-dialog {
        padding: 0px;
        border: none;
        border-radius: 1em;
        box-shadow: 0px 4px 16px rgb(0 0 0 / 0.8);
        outline: none;
        background-color: #EEE;
    }
    .nextup-ext-opt-dialog-inner {
        padding: 5px 10px 1px 10px;
    }

    .nextup-ext-opt-dialog-close-button {
        position: absolute;
        top: 2px;
        right: 2px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #000;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        text-align: center;
    }
    .nextup-ext-opt-dialog-close-button:hover {
        background-color: rgba(0 0 0 / 0.1);
    }

    .nextup-ext-opt-dialog-tab-wrapper {
        display: flex;
        cursor: pointer;
        margin-top: 5px;
    }
    .nextup-ext-opt-dialog-tab {
        padding: 5px 15px;
        background: #f1f1f1;
        border: 1px solid #ccc;
        border-bottom: none;
        margin-right: 5px;
        border-radius: 5px 5px 0 0;
    }
    .nextup-ext-opt-dialog-tab-active {
        background: #fff;
        border-top: 2px solid #ccc;
    }

    .nextup-ext-opt-dialog-content {
        display: none;
        border: 1px solid #ccc;
        border-radius: 0 0 5px 5px;
        margin-top: -1px;
        padding: 15px;
        height: 450px;
        overflow-y: auto;
        overflow-x: hidden;
        word-break: break-all;
        background-color: white;
    }
    .nextup-ext-opt-dialog-content-active {
        display: block;
        border-top: 1px solid #ccc;
    }

    .nextup-ext-opt-dialog .group-title {
        text-align: center;
        margin-bottom: 7px;
        font-weight: 700;
    }
    .nextup-ext-opt-dialog-note {
      color: green;
    }

    .nextup-ext-opt-dialog-item-container {
      display: flex;
    }
    .nextup-ext-opt-dialog label:has(input[type='checkbox']){
        display: flex;
    }
    .nextup-ext-opt-dialog label.indent1 {
        margin-left: 17.2px;
    }
    .nextup-ext-opt-dialog label p {
        margin-bottom: 5px;
        font-weight: 400;
    }
    .nextup-ext-opt-dialog ul li {
        margin-left: 18px;
    }
    .nextup-ext-opt-dialog ul li.ml0 {
        margin-left: 0;
    }
    .nextup-ext-opt-dialog ul li.list-style-none {
        list-style: none;
    }
    .nextup-ext-opt-dialog ul li label:has(#shortcutkey-for-dialog){
        display: flex;
    }
    .nextup-ext-opt-dialog label input[type='text'] {
        height: 20px;
    }
    .nextup-ext-opt-dialog-network-activity-monitoring {
        border-top: 1px dotted;
        margin-top: 10px;
        padding-top: 10px;
    }
    .nextup-ext-opt-dialog-network-activity-monitoring > .group-title {
        display: flex;
        justify-content: center;
        color: darkslateblue;
    }

    .nextup-ext-opt-dialog-tooltip {
        color: darkviolet;
        text-decoration: underline;
        cursor: help;
        margin-left: 6px;
    }
    .nextup-ext-opt-dialog-tooltip:before {
        content: "\\0028";
    }
    .nextup-ext-opt-dialog-tooltip:after {
        content: "\\0029";
    }

    .nextup-ext-opt-dialog-about .group-title {
        text-align: unset;
    }
    .nextup-ext-opt-dialog-about section {
        margin-bottom: 15px;
    }

    .nextup-ext-opt-dialog-version {
        text-align: right;
        font-size: 12px;
        color: #222;
        padding-top: 1px;
    }
  `;

    addStyle(css);

    const tooltipElements = document.querySelectorAll(
      ".nextup-ext-opt-dialog-tooltip"
    );
    for (const elem of tooltipElements) {
      elem.textContent = " ? ";
      // If clicked, an alert with the same text as the tooltip is displayed.
      elem.addEventListener("click", (e) => {
        const title = e.target.getAttribute("title");
        if (title) {
          let alertText = title;

          const msgId = e.target.dataset.msgId;
          if (msgId) {
            const msg = messages[msgId];
            if (msg) {
              alertText = `[${msg}]\n\n${alertText}`;
            }
          }

          alert(alertText);
        }
      });
    }

    const optDialog = getOptionDialog();

    //  Adjust width of options dialog.
    optDialog.style.setProperty("visibility", "hidden", "important");
    optDialog.toggleAttribute("open");
    let maxWidth = 600;
    if (optDialog.offsetWidth > maxWidth) {
      maxWidth = optDialog.offsetWidth + 30;
    }
    optDialog.style.maxWidth = maxWidth + "px";
    optDialog.style.width = "100%";
    optDialog.toggleAttribute("open");
    optDialog.style.setProperty("visibility", "");

    // Code to run when the dialog is opened and closed
    new MutationObserver(async (_) => {
      if (optDialog.hasAttribute("open")) {
        await Dialog.whenOpening();
      } else {
        Dialog.whenClosed();
      }
    }).observe(optDialog, { attributes: true, attributeFilter: ["open"] });

    // Close the dialog when the close button is pressed
    const closeBtn = optDialog.querySelector(
      ".nextup-ext-opt-dialog-close-button"
    );
    closeBtn.addEventListener("click", () => {
      optDialog.close();
    });

    // Code for switching tabs
    const tabs = optDialog.querySelectorAll(".nextup-ext-opt-dialog-tab");
    const contents = optDialog.querySelectorAll(".nextup-ext-opt-dialog-content");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) =>
          t.classList.remove("nextup-ext-opt-dialog-tab-active")
        );
        contents.forEach((c) =>
          c.classList.remove("nextup-ext-opt-dialog-content-active")
        );

        tab.classList.add("nextup-ext-opt-dialog-tab-active");
        const targetId = tab.dataset.target;
        const targetContent = optDialog.querySelector(
          `.nextup-ext-opt-dialog-content[data-tab-id=${targetId}]`
        );
        targetContent.classList.add("nextup-ext-opt-dialog-content-active");
      });
    });

    // Save when options are changed
    optDialog.addEventListener(
      "click",
      async (e) => {
        const idName = e.target.id;
        if (idName === "") {
          return;
        }

        switch (idName) {
          case "skip-ads":
            await saveOptions({ skipAds: e.target.checked });
            break;
          case "hide-skip-intro-btn":
            await saveOptions({ hideSkipIntroBtn: e.target.checked });
            break;
          case "show-skip-intro-btn":
            await saveOptions({ showSkipIntroBtnOnOverlay: e.target.checked });
            break;
          case "hide-nextup":
            await saveOptions({ hideNextup: e.target.checked });
            break;
          case "temporarily-disable-overlay":
            await saveOptions({ temporarilyDisableOverlay: e.target.checked });
            break;
          case "prevents-darkening-in-conjunction-with-nextup":
            await saveOptions({
              preventsDarkeningInConjunctionWithNextup: e.target.checked,
            });
            break;
          case "show-nextup":
            await saveOptions({ showNextupOnOverlay: e.target.checked });
            break;
          case "click-hide-button-for-all-nextup":
            await saveOptions({ clickHideButtonForAllNextup: e.target.checked });
            break;
          case "hide-reactions":
            await saveOptions({ hideReactions: e.target.checked });
            break;
          case "show-reactions":
            await saveOptions({ showReactionsOnOverlay: e.target.checked });
            break;
          case "hide-recommendations":
            await saveOptions({ hideRecommendations: e.target.checked });
            break;
          case "show-recommendations-on-overlay":
            await saveOptions({ showRecommendationsOnOverlay: e.target.checked });
            break;
          case "hide-rationg":
            await saveOptions({ hideRating: e.target.checked });
            break;
          case "prevents-darkening":
            await saveOptions({ preventsDarkening: e.target.checked });
            break;
          case "add-outlines-for-texts-and-icons":
            await saveOptions({ addOutlinesForTextsAndIcons: e.target.checked });
            break;
          case "add-shadow-to-seek-bar":
            await saveOptions({ addShadowsToSeekBar: e.target.checked });
            break;
          case "move-center-buttons-to-bottom":
            await saveOptions({ moveCenterButtonsToBottom: e.target.checked });
            break;
          case "hide-title":
            await saveOptions({ hideTitle: e.target.checked });
            break;
          case "hide-episode-title":
            await saveOptions({ hideEpisodeTitle: e.target.checked });
            break;
          case "hide-various-buttons-in-top-right":
            await saveOptions({ hideVariousButtonsInTopRight: e.target.checked });
            break;
          case "hide-seek-bar":
            await saveOptions({ hideSeekBar: e.target.checked });
            break;
          case "hide-playback-time":
            await saveOptions({ hidePlaybackTime: e.target.checked });
            break;
          case "hide-center-buttons":
            await saveOptions({ hideCenterButtons: e.target.checked });
            break;
          case "hide-next-episode-button":
            await saveOptions({ hideNextEpisodeButton: e.target.checked });
            break;
          case "tweak-hide-skip-intro-button":
            await saveOptions({ tweakHideSkipIntroButton: e.target.checked });
            break;
          case "tweak-show-video-resolution-info":
            await saveOptions({ tweakShowVideoResolutionInfo: e.target.checked });
            break;
          case "use-on-live-tv":
            await saveOptions({ useOnLiveTv: e.target.checked });
            break;
          case "enable-shortcutkey":
            await saveOptions({ shortcutKeyIsEnabled: e.target.checked });
            break;
          case "force-highest-resolution":
            await saveOptions({ forceHighestResolution_xhook: e.target.checked });
            break;
          case "force-highest-resolution-lenient":
            await saveOptions({
              forceHighestResolutionLenient_xhook: e.target.checked,
            });
            break;
          case "show-video-resolution":
            await saveOptions({ showVideoResolution_xhook: e.target.checked });
            break;
          case "remove-ad-related-data":
            await saveOptions({ removeAdRelatedData: e.target.checked });
            break;
          case "enable-autoplay":
            await saveOptions({ enableAutoplay_xhook: e.target.checked });
            break;
          case "remove-nextup-timecodes":
            await saveOptions({ removeNextupTimecodes_xhook: e.target.checked });
            break;
          case "disable-recommendations":
            await saveOptions({ disableRecommendations_xhook: e.target.checked });
            break;
          case "disable-reactions":
            await saveOptions({ disableReactions_xhook: e.target.checked });
            break;
          case "force-play-next-episode":
            await saveOptions({ forcePlayNextEpisode_xhook: e.target.checked });
            break;
        }
      },
      true
    );
  };

  const addEventListenerForShortcutKey = (options = getDefaultOptions()) => {
    if (!options.shortcutKeyIsEnabled) {
      return;
    }

    document.body.addEventListener("keydown", async (e) => {
      const video = getVisibleVideo();
      if (!video || !video.checkVisibility()) {
        return;
      }

      const shortcutKeyInput = getShortcutKeyInput();
      if (shortcutKeyInput === document.activeElement) {
        return;
      }

      const options = await getOptions();
      if (
        e.code === options.shortcutKey.charCode &&
        e.ctrlKey === options.shortcutKey.ctrl &&
        e.altKey === options.shortcutKey.alt &&
        e.shiftKey === options.shortcutKey.shift
      ) {
        const optDialog = getOptionDialog();
        if (optDialog.hasAttribute("open")) {
          optDialog.close();
        } else {
          optDialog.showModal();
        }
      }
    });
  };

  const createOptionBtnOnNavbar = () => {
    class OptionBtnOnNavbar {
      constructor() {
        this.isFirstCreate = true;
        this.create = this._create.bind(this);
        this.detectNavbarRemove = this._detectNavbarRemove.bind(this);
      }

      _detectNavbarRemove(mutationRecords, detectNavbarRemove) {
        try {
          let filtered = mutationRecords.filter((m) => m.removedNodes.length > 0);
          if (filtered.length === 0) {
            return;
          }
          filtered = filtered.filter((m) => {
            const nodes = Array.from(m.removedNodes).filter((n) => {
              try {
                if (n.matches("#pv-navigation-bar-wrapper")) {
                  return n;
                } else {
                  return false;
                }
              } catch (e) {
                return false;
              }
            });
            return nodes.length ? nodes : false;
          });
          if (filtered.length === 0) {
            return;
          }
          detectNavbarRemove.disconnect();
          setTimeout(() => {
            this.create();
          }, 500);
        } catch (e) {}
      }

      disconnect(observer) {
        if (observer) {
          observer.disconnect();
        }
      }

      _create(_, observer) {
        if (document.querySelector("#pv-nav-option-btn-container")) {
          this.disconnect(observer);
          return;
        }

        const accountDropdownContainer = document.querySelector(
          "#pv-nav-container [data-testid='pv-nav-account-and-profiles-dropdown-container']"
        );
        if (!accountDropdownContainer) {
          return;
        }
        const accountDropdownBtn =
          accountDropdownContainer.querySelector("button");
        if (!accountDropdownBtn) {
          return;
        }
        const imgContainer =
          accountDropdownContainer.querySelector("button > span");
        if (!imgContainer) {
          return;
        }
        this.disconnect(observer);

        if (this.isFirstCreate) {
          this.isFirstCreate = false;
          // The navbar may regenerate once after page load.
          // Therefore, monitor the regenerating of Navbar for 10 seconds.
          const detectNavbarRemove = new MutationObserver(
            this.detectNavbarRemove
          );
          detectNavbarRemove.observe(document, observeConfig);
          setTimeout(() => {
            detectNavbarRemove.disconnect();
          }, 10000);
        }

        const liElement = accountDropdownContainer.parentNode;
        const cloneLi = liElement.cloneNode();
        cloneLi.setAttribute("id", "pv-nav-option-btn-container");
        liElement.after(cloneLi);

        const cloneLiStyle = cloneLi.getAttribute("style");
        const cloneLiStyleRegex = /--nav-list-child-index:\s?(\d+);?/;
        const cloneLiStyleFound = cloneLiStyle?.match(cloneLiStyleRegex);
        if (cloneLiStyleFound) {
          let idx = parseInt(cloneLiStyleFound[1]);
          idx++;
          const newStyle = cloneLiStyle.replace(
            cloneLiStyleRegex,
            `--nav-list-child-index:${idx}`
          );
          // cloneLi.style = newStyle;
          // Use setAttribute to align style formats.
          cloneLi.setAttribute("style", newStyle);
        }

        const cloneContainer = accountDropdownContainer.cloneNode();
        cloneContainer.removeAttribute("data-testid");
        cloneLi.appendChild(cloneContainer);

        const optBtnElement = document.createElement("button");
        optBtnElement.classList.add(...accountDropdownBtn.classList);
        cloneContainer.appendChild(optBtnElement);
        optBtnElement.style.backgroundColor = "rgba(0, 0, 0, 0)";
        optBtnElement.setAttribute("title", "Option - Auto hide next up card");

        const cloneImgContainer = imgContainer.cloneNode();
        optBtnElement.appendChild(cloneImgContainer);

        const imgDataUrl = [
          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNSIgaGVpZ2",
          "h0PSIyNSIgZmlsbD0ibm9uZSIgdmlld0JveD0iMCAwIDI1IDI1Ij48cGF0aCBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZG",
          "QiIGQ9Ik04LjYgNC45OTRjLS4zMzcuMTY2LS42Ni4zNTMtLjk3LjU2bC0xLjk0Ny0uODEyYTEuNSAxLjUgMCAwIDAtMS44NzcuNj",
          "M0TDEuODIyIDguODEyYTEuNSAxLjUgMCAwIDAgLjM5IDEuOTQzbDEuNjc4IDEuMjhhOC41OTYgOC41OTYgMCAwIDAgMCAxLjExOG",
          "wtMS42NzggMS4yOGExLjUgMS41IDAgMCAwLS4zOSAxLjk0M2wxLjk4NCAzLjQzNmExLjUgMS41IDAgMCAwIDEuODc3LjYzNGwxLj",
          "k0Ny0uODEzYy4zMS4yMDcuNjMzLjM5NS45Ny41NmwuMjY5IDIuMDkyYTEuNSAxLjUgMCAwIDAgMS40ODggMS4zMDloMy45NjdhMS",
          "41IDEuNSAwIDAgMCAxLjQ4OC0xLjMwOWwuMjY5LTIuMDkxYy4zMzYtLjE2Ni42Ni0uMzU0Ljk3LS41NjFsMS45NDcuODEzYTEuNS",
          "AxLjUgMCAwIDAgMS44NzctLjYzNGwxLjk4My0zLjQzNmExLjUgMS41IDAgMCAwLS4zODktMS45NDNsLTEuNjc4LTEuMjhhOC42My",
          "A4LjYzIDAgMCAwIDAtMS4xMThsMS42NzgtMS4yOGExLjUgMS41IDAgMCAwIC4zOS0xLjk0M2wtMS45ODQtMy40MzZhMS41IDEuNS",
          "AwIDAgMC0xLjg3Ny0uNjM0bC0xLjk0OC44MTNhOC40NTQgOC40NTQgMCAwIDAtLjk2OS0uNTYxbC0uMjctMi4wOTJhMS41IDEuNS",
          "AwIDAgMC0xLjQ4Ny0xLjMwOGgtMy45NjdhMS41IDEuNSAwIDAgMC0xLjQ4OCAxLjMwOGwtLjI3IDIuMDkyem0xLjgzNCAxLjQxNk",
          "E2LjQ4IDYuNDggMCAwIDAgNy45NCA3Ljg1Mkw1LjMxOCA2Ljc1NyAzLjc3NCA5LjQzbDIuMjU4IDEuNzIyYTYuNDkgNi40OSAwID",
          "AgMCAwIDIuODgxbC0yLjI1OCAxLjcyMyAxLjU0NCAyLjY3NCAyLjYyMi0xLjA5NWE2LjQ2MiA2LjQ2MiAwIDAgMCAyLjQ5NCAxLj",
          "Q0MWwuMzYyIDIuODE3aDMuMDg4bC4zNjMtMi44MTdjLjk0LS4yOSAxLjc5LS43ODggMi40OTMtMS40NDFsMi42MjMgMS4wOTUgMS",
          "41NDQtMi42NzQtMi4yNTktMS43MjNhNi40ODkgNi40ODkgMCAwIDAgMC0yLjg4bDIuMjU5LTEuNzIzLTEuNTQ0LTIuNjc0LTIuNj",
          "IzIDEuMDk1YTYuNDYxIDYuNDYxIDAgMCAwLTIuNDkzLTEuNDQxbC0uMzYzLTIuODE3aC0zLjA4OGwtLjM2MiAyLjgxNnptMS45MD",
          "YgMTAuMTg0YTQgNCAwIDEgMCAwLTggNCA0IDAgMCAwIDAgOHptMC0yYTIgMiAwIDEgMCAwLTQgMiAyIDAgMCAwIDAgNHoiIGNsaX",
          "AtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==",
        ].join("");
        const optBtnImgElement = document.createElement("img");
        optBtnImgElement.setAttribute("src", imgDataUrl);
        optBtnImgElement.style.filter =
          "sepia(100%) saturate(2000%) hue-rotate(120deg)";
        cloneImgContainer.appendChild(optBtnImgElement);

        const profileImgElement = accountDropdownBtn.querySelector(
          "[data-testid*='profile']"
        );
        if (profileImgElement) {
          const adjustOptBtnSize = () => {
            const profileComputedStyle =
              window.getComputedStyle(profileImgElement);
            const width = parseFloat(profileComputedStyle.width);
            const height = parseFloat(profileComputedStyle.height);
            optBtnImgElement.style.width = width + "px";
            optBtnImgElement.style.height = height + "px";
          };
          adjustOptBtnSize();
          window.addEventListener("resize", () => {
            optBtnImgElement.style.width = "";
            optBtnImgElement.style.height = "";
            adjustOptBtnSize();
          });
        }

        if (!document.querySelector("#ext-optionBtnOnNavbar")) {
          const css = `
        body:has(.nextup-ext-opt-dialog[open]):not(:has(.dv-player-fullscreen)) {
          overflow: hidden !important;
        }
      `;
          addStyle(css, "ext-optionBtnOnNavbar");
        }

        // Create buttons for mobile
        let optBtnElement2;
        try {
          const accountDropdownContainer2 = document.querySelector(
            "[data-testid='mobile-nav-wrapper'] [data-testid='pv-nav-account-and-profiles-dropdown-container']"
          );
          const liElement2 = accountDropdownContainer2.parentNode;
          const cloneLi2 = cloneLi.cloneNode(true);
          cloneLi2.setAttribute("id", "pv-nav-option-btn-container");
          liElement2.after(cloneLi2);
          optBtnElement2 = cloneLi2.querySelector("button");
        } catch (e) {
          console.log(e);
        }

        // Add event listeners to both buttons
        [optBtnElement, optBtnElement2].forEach((optBtn) => {
          if (!optBtn) {
            return;
          }
          optBtn.addEventListener("click", (_) => {
            const optDialog = getOptionDialog();
            optDialog.showModal();
          });
        });
      }

      main() {
        this._create();
        if (!document.querySelector("#pv-nav-option-btn-container")) {
          new MutationObserver(this.create).observe(document, {
            ...observeConfig,
            attributes: true,
          });
        }
      }
    }

    const optionBtn = new OptionBtnOnNavbar();
    optionBtn.main();
  };

  const createUserScriptMenu = () => {
    if (!ScriptInfo.isUserScript()) {
      return;
    }
    let name = "Open Options Dialog";
    if (/ja|ja-JP/.test(window.navigator.language)) {
      name = "オプションダイアログを開く";
    }
    // Greasemonkey must use GM.registerMenuCommand, not GM_registerMenuCommand.
    // Tampermonkey and Violentmonkey can use both functions.
    const registerMenuCommand = GM.registerMenuCommand;
    registerMenuCommand(name, () => {
      const optDialog = getOptionDialog();
      if (optDialog && !optDialog.hasAttribute("open")) {
        optDialog.showModal();
      }
    });
  };

  // The runXhook function is executed as an inline script.
  const runXhook = () => {
    const xhookUrl = document.documentElement.dataset.xhookUrl;
    const options = JSON.parse(document.documentElement.dataset.options);
    delete document.documentElement.dataset.xhookUrl;
    delete document.documentElement.dataset.options;

    const isMpd = (request, response) => {
      if (!request.url.match(/\.mpd/)) {
        return false;
      }
      if (response.status !== 200) {
        return;
      }
      if (response.headers?.["content-type"] !== "text/xml") {
        try {
          const text = response.text;
          const regex = new RegExp("^<MPD.+</MPD>$");
          if (!regex.test(text)) {
            return false;
          }
        } catch (e) {
          return false;
        }
      }
      return true;
    };

    const isGetSections = (request, response) => {
      if (!request.url.includes("GetSections")) {
        return false;
      }
      if (request.headers?.accept !== "application/json") {
        return false;
      }
      if (response.status !== 200) {
        return false;
      }
      return true;
    };

    const isGetVodPlaybackResources = (request, response) => {
      if (!request.url.includes("GetVodPlaybackResources")) {
        return false;
      }
      if (response.status !== 200) {
        return false;
      }
      if (response.headers?.["content-type"] !== "application/json") {
        return false;
      }
      return true;
    };

    const hasNextUpV2Resource = (request, response) => {
      if (!request.url.includes("playerChromeResources")) {
        return false;
      }
      if (!request.url.includes("nextUpV2")) {
        return false;
      }
      if (response.status !== 200) {
        return false;
      }
      if (response.headers?.["content-type"] !== "application/json") {
        return false;
      }
      return true;
    };

    const hasReactionsResource = (request, response) => {
      if (!request.url.includes("playerChromeResources")) {
        return false;
      }
      if (!request.url.includes("reaction")) {
        return false;
      }
      if (response.status !== 200) {
        return false;
      }
      if (response.headers?.["content-type"] !== "application/json") {
        return false;
      }
      return true;
    };

    const hasCatalogMetadataV2Resource = (request, response) => {
      if (!request.url.includes("playerChromeResources")) {
        return false;
      }
      if (!request.url.includes("catalogMetadataV2")) {
        return false;
      }
      if (response.status !== 200) {
        return false;
      }
      if (response.headers?.["content-type"] !== "application/json") {
        return false;
      }
      return true;
    };

    const parseISODuration = (duration) => {
      const hoursMatch = duration.match(/(\d+(\.\d+)?)H/);
      const minutesMatch = duration.match(/(\d+(\.\d+)?)M/);
      const secondsMatch = duration.match(/(\d+(\.\d+)?)S/);

      const hours = parseFloat(hoursMatch ? hoursMatch[1] : 0);
      const minutes = parseFloat(minutesMatch ? minutesMatch[1] : 0);
      const seconds = parseFloat(secondsMatch ? secondsMatch[1] : 0);

      return hours * 3600 + minutes * 60 + seconds;
    };

    const formatISODuration = (totalSeconds) => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const parts = [];
      if (hours > 0) parts.push(`${hours}H`);
      if (minutes > 0) parts.push(`${minutes}M`);

      if (seconds > 0 || parts.length === 0) {
        parts.push(`${seconds.toFixed(3)}S`);
      }

      return `PT${parts.join("")}`;
    };

    const sumDurations = (durations) => {
      const totalSeconds = durations.reduce((acc, duration) => {
        return acc + parseISODuration(duration);
      }, 0);

      return formatISODuration(totalSeconds);
    };

    const addStyle = (css, id) => {
      const style = document.createElement("style");
      {
        style.setAttribute("id", id);
      }
      style.textContent = css;
      document.head.appendChild(style);
    };

    class XhookAfter {
      static #queue = [];

      static #mpdId;
      static #mp4Url;
      static #metadataResourceArray = [];
      static #nextUpV2ResourceArray = [];
      static #getVodPlaybackResourcesArray = [];
      static #resolutionInfoArray = [];

      static get mpdId() {
        return this.#mpdId;
      }

      static get mp4Url() {
        return this.#mp4Url;
      }

      static get metadataResourceArray() {
        return this.#metadataResourceArray;
      }

      static get nextUpV2ResourceArray() {
        return this.#nextUpV2ResourceArray;
      }

      static get getVodPlaybackResourcesArray() {
        return this.#getVodPlaybackResourcesArray;
      }

      static get resolutionInfoArray() {
        return this.#resolutionInfoArray;
      }

      static #pushMetadataResourceArray(obj = {}) {
        const entityId = obj.entityId;
        if (!entityId) {
          return;
        }
        if (this.#metadataResourceArray.find((m) => m.entityId === entityId)) {
          return;
        }
        this.#metadataResourceArray.push(obj);
        if (this.#metadataResourceArray > 20) {
          this.#metadataResourceArray.shift();
        }
      }

      static #pushNextUpV2ResourceArray(obj = {}) {
        const entityId = obj.entityId;
        if (!entityId) {
          return;
        }
        if (this.#nextUpV2ResourceArray.find((n) => n.entityId === entityId)) {
          return;
        }
        this.#nextUpV2ResourceArray.push(obj);
        if (this.#nextUpV2ResourceArray > 20) {
          this.#nextUpV2ResourceArray.shift();
        }
      }

      static #pushGetVodPlaybackResourcesArray(obj = {}) {
        const titleId = obj.titleId;
        if (!titleId) {
          return;
        }
        if (
          this.#getVodPlaybackResourcesArray.find((g) => g.titleId === titleId)
        ) {
          return;
        }
        this.#getVodPlaybackResourcesArray.push(obj);
        if (this.#getVodPlaybackResourcesArray > 20) {
          this.#getVodPlaybackResourcesArray.shift();
        }
      }

      static #pushResolutionInfoArray(obj = {}) {
        const baseURL = obj.baseURL;
        if (!baseURL) {
          return;
        }
        if (this.#resolutionInfoArray.find((r) => r.baseURL === baseURL)) {
          return;
        }
        this.#resolutionInfoArray.push(obj);
        if (this.#resolutionInfoArray > 40) {
          this.#resolutionInfoArray.shift();
        }
      }

      static forceHighestResolution(request, response) {
        if (!isMpd(request, response)) {
          return;
        }

        try {
          const mpd = response.text;
          const parser = new DOMParser();
          const dom = parser.parseFromString(mpd, "text/xml");

          const periods = dom.querySelectorAll("Period");
          if (periods.length === 0) {
            return;
          }

          for (const p of periods) {
            const representations = p.querySelectorAll(
              "AdaptationSet[contentType='video'] > Representation"
            );
            if (representations.length === 0) {
              continue;
            }

            const highestRepresentation = Array.from(representations).reduce(
              (acc, cur) => {
                return parseInt(acc.getAttribute("bandwidth")) >
                  parseInt(cur.getAttribute("bandwidth"))
                  ? acc
                  : cur;
              }
            );

            highestRepresentation.setAttribute("highestRepresentation", "true");
            for (const rep of representations) {
              if (!rep.hasAttribute("highestRepresentation")) {
                rep.remove();
              }
            }
          }

          const newMpd = dom.documentElement.outerHTML;
          response.text = newMpd;
        } catch (e) {
          console.log(e);
        }
      }

      static forceHighestResolutionLenient(request, response) {
        // This method attempts to preserve more Representations than forceHighestResolution().
        // - When multiple codecs are mixed, retain a Representation for each codec.
        // - Playback of videos that are at the highest resolution but not at the highest quality will be allowed.
        if (!isMpd(request, response)) {
          return;
        }

        try {
          const mpd = response.text;
          const parser = new DOMParser();
          const dom = parser.parseFromString(mpd, "text/xml");

          const periods = dom.querySelectorAll("Period");
          if (periods.length === 0) {
            return;
          }

          for (const p of periods) {
            const VideoAdaptationSets = p.querySelectorAll(
              "AdaptationSet[contentType='video']"
            );
            if (VideoAdaptationSets.length === 0) {
              return;
            }

            for (const AdaptationSet of VideoAdaptationSets) {
              // *The following is code for functional testing.*
              // const test = AdaptationSet.querySelector("[id='video=501000']");
              // const clone1 = test.cloneNode(true);
              // clone1.setAttribute("id", "video=501001");
              // clone1.setAttribute("codecs", "test");
              // const clone2 = test.cloneNode(true);
              // clone2.setAttribute("id", "video=5010090");
              // clone2.setAttribute("codecs", "test");
              // clone2.setAttribute("height", "999");
              // AdaptationSet.append(clone1);
              // AdaptationSet.append(clone2);

              const representations = AdaptationSet.querySelectorAll(
                "Representation[codecs][width][height]:has(BaseURL)"
              );
              if (representations.length === 0) {
                continue;
              }

              const codecSet = Array.from(representations).reduce((acc, cur) => {
                const codec = cur.getAttribute("codecs");
                try {
                  if (codec) {
                    const mached = codec.match(/^[^\.]+/);
                    if (mached) {
                      acc.add(mached[0]);
                    } else {
                      acc.add(codec);
                    }
                  }
                } catch (e) {
                  console.log(e);
                }
                return acc;
              }, new Set());
              if (codecSet.size === 0) {
                return;
              }

              for (const codec of codecSet) {
                const targetReps = Array.from(representations).filter((rep) => {
                  const targetCodec = rep.getAttribute("codecs");
                  return targetCodec?.includes(codec);
                });
                if (targetReps.length === 0) {
                  return;
                }
                const highestResolution = targetReps.reduce(
                  (acc, cur) => {
                    try {
                      const width = parseInt(cur.getAttribute("width"));
                      const height = parseInt(cur.getAttribute("height"));
                      if (width * height > acc.width * acc.height) {
                        acc.width = width;
                        acc.height = height;
                      }
                    } catch (e) {
                      console.log(e);
                    }
                    return acc;
                  },
                  {
                    width: 0,
                    height: 0,
                  }
                );
                if (highestResolution.width === 0) {
                  return;
                }

                for (const rep of targetReps) {
                  const width = parseInt(rep.getAttribute("width"));
                  const height = parseInt(rep.getAttribute("height"));
                  if (
                    !(
                      width === highestResolution.width &&
                      height === highestResolution.height
                    )
                  ) {
                    rep.setAttribute("sholudRemove", "true");
                  }
                }
              }

              for (const rep of representations) {
                if (rep.hasAttribute("sholudRemove")) {
                  rep.remove();
                }
              }
            }
          }

          const newMpd = dom.documentElement.outerHTML;
          response.text = newMpd;
        } catch (e) {
          console.log(e);
        }
      }

      static showVideoResolution(request, response) {
        const url = request.url;
        if (isMpd(request, response)) {
          try {
            const mpd = response.text;
            const parser = new DOMParser();
            const dom = parser.parseFromString(mpd, "text/xml");
            const periods = dom.querySelectorAll("Period:has(ContentProtection)");
            if (periods.length === 0) {
              return;
            }

            for (const p of periods) {
              const representations = p.querySelectorAll(
                "AdaptationSet[contentType='video'] > Representation"
              );
              if (representations.length === 0) {
                continue;
              }
              for (const rep of representations) {
                const width = rep.getAttribute("width");
                const height = rep.getAttribute("height");
                const baseURL = rep.querySelector("BaseURL");
                if (width && height && baseURL) {
                  this.#pushResolutionInfoArray({
                    width,
                    height,
                    baseURL: baseURL.textContent,
                  });
                }
              }
            }
          } catch (e) {
            console.log(e);
          }
        } else if (url.includes(".mp4")) {
          const pathname = new window.URL(url).pathname;
          const found = pathname.match(/([0-9a-zA-Z-]+)_video_\d+\.mp4$/);
          if (!found) {
            return;
          }
          this.#mpdId = found[1];
          this.#mp4Url = url;
        } else if (hasCatalogMetadataV2Resource(request, response)) {
          const entityId = new window.URL(url).searchParams.get("entityId");
          if (!entityId) {
            return;
          }

          const data = JSON.parse(response.text);
          this.#pushMetadataResourceArray({
            entityId,
            data,
          });
        } else if (isGetVodPlaybackResources(request, response)) {
          const titleId = new window.URL(url).searchParams.get("titleId");
          if (!titleId) {
            return;
          }

          const data = JSON.parse(response.text);
          this.#pushGetVodPlaybackResourcesArray({
            titleId,
            data,
          });
        }
      }

      static removeAdRelatedDataInMpd(request, response) {
        // Legacy
        // Currently, ads can be removed using removeAdRelatedDataInVodPlaybackResources() and removeAdPlaylist().
        if (!isMpd(request, response)) {
          return;
        }

        try {
          const mpd = response.text;
          const parser = new DOMParser();
          const dom = parser.parseFromString(mpd, "text/xml");

          const periods = dom.querySelectorAll("Period");
          if (periods.length === 0) {
            return;
          }

          let removed = false;
          for (const p of periods) {
            const ad1 = p.querySelector("SupplementalProperty[value='Ad']");
            const ad2 = p.querySelector("SupplementalProperty[value='FadeAd']");
            if (!ad1 && !ad2) {
              continue;
            }
            p.remove();
            removed = true;
            console.log("Removed ads (data in mpd)");
          }
          if (!removed) {
            return;
          }

          const newPeriods = dom.querySelectorAll("Period");
          let sumDuration;
          for (const [i, p] of newPeriods.entries()) {
            const duration = p.getAttribute("duration");
            if (i === 0) {
              sumDuration = duration;
              p.removeAttribute("start");
              continue;
            } else {
              p.setAttribute("start", sumDuration);
              sumDuration = sumDurations([sumDuration, duration]);
            }
          }

          const newMpd = dom.documentElement.outerHTML;
          response.text = newMpd;
        } catch (e) {
          console.log(e);
        }
      }

      static removeAdRelatedDataInVodPlaybackResources(request, response) {
        if (!isGetVodPlaybackResources(request, response)) {
          return;
        }

        try {
          const data = JSON.parse(response.text);
          let removed = false;

          // Legacy
          if (delete data.vodPlaybackUrls?.result?.playbackUrls?.cuepoints) {
            removed = true;
          }

          // Latest
          // Based on uBlock Origin's filters (pauseBehavior, pauseAdsResolution, shouldShowOnScrubBar)
          const playbackUrls =
            data.vodPlaylistedPlaybackUrls?.result?.playbackUrls;
          delete playbackUrls?.pauseBehavior;
          delete playbackUrls?.pauseAdsResolution;
          const intraTitlePlaylist = playbackUrls?.intraTitlePlaylist;
          if (intraTitlePlaylist && Array.isArray(intraTitlePlaylist)) {
            for (const obj of intraTitlePlaylist) {
              if (obj.shouldShowOnScrubBar) {
                delete obj.shouldShowOnScrubBar;
              }
            }
            // Hide ad locations on the seek bar
            // It seems uBlock Origin can remove ad locations on the seek bar using the three filters mentioned above.
            // https://www.reddit.com/r/uBlockOrigin/comments/1n7ujvm/comment/ncdqugr/?force-legacy-sct=1
            // For some technical reason, this script appears to require the following code.
            const newIntraTitlePlaylist = [];
            for (const obj of intraTitlePlaylist) {
              if (obj.type === "Main") {
                newIntraTitlePlaylist.push(obj);
              } else {
                removed = true;
              }
            }
            playbackUrls.intraTitlePlaylist = newIntraTitlePlaylist;
          }

          if (intraTitlePlaylist) {
            if (!document.querySelector("#ext-hideAdResumeMessage")) {
              const css = `
              .atvwebplayersdk-ad-resume-message {
                display: none !important;
              }
            `;
              addStyle(css, "ext-hideAdResumeMessage");
            }
          }

          if (removed) {
            console.log("Removed ads (data in VodPlaybackResources)");
          }
          response.text = JSON.stringify(data);
        } catch (e) {
          console.log(e);
        }
      }

      static removeAdPlaylist(request, response) {
        // This method serves as a fallback in case removeAdRelatedDataInVodPlaybackResources() fails.
        if (!request.url.includes("getVideoAds")) {
          return;
        }
        response.text = JSON.stringify({});
        console.log("Removed ads (AdPlaylist)");
      }

      static enableAutoplay(request, response) {
        const _isGetSections = isGetSections(request, response);
        const _hasNextUpV2Resource = hasNextUpV2Resource(request, response);
        if (!_isGetSections && !_hasNextUpV2Resource) {
          return;
        }

        if (_hasNextUpV2Resource) {
          try {
            /**
             * If isMultiTitleExperience is true, this function does not enable autoplay.
             * (If isMultiTitleExperience is true, nextUpV2.carousel will be used instead of nextUpV2.card.)
             */
            const data = JSON.parse(response.text);
            const autoplayConfig =
              data?.resources?.nextUpV2?.card?.autoPlayConfig;
            if (!autoplayConfig) {
              return;
            }
            autoplayConfig.autoplayEnabled = true;
            response.text = JSON.stringify(data);
          } catch (e) {
            console.log(e);
          }
        } else if (_isGetSections) {
          try {
            const data = JSON.parse(response.text);
            const autoplayConfig =
              data?.sections?.bottom?.collections?.collectionList?.[0]
                ?.autoplayConfig;
            if (!autoplayConfig) {
              return;
            }
            autoplayConfig.autoplayEnabled = true;
            response.text = JSON.stringify(data);
          } catch (e) {
            console.log(e);
          }
        }
      }

      static removeNextupTimecodes(request, response) {
        if (!isGetVodPlaybackResources(request, response)) {
          return;
        }

        try {
          const data = JSON.parse(response.text);
          const transitionTimecodes = data.transitionTimecodes?.result?.events;
          if (!transitionTimecodes) {
            return;
          }

          const filteredTimeCodes = transitionTimecodes.filter((t) => {
            const isNextup = ["END_CREDITS", "NEXT_UP"].includes(t.eventType);
            return !isNextup;
          });
          if (transitionTimecodes.length === filteredTimeCodes.length) {
            return;
          }

          data.transitionTimecodes.result.events = filteredTimeCodes;
          response.text = JSON.stringify(data);
        } catch (e) {
          console.log(e);
        }
      }

      static disableRecommendations(request, response) {
        if (!hasNextUpV2Resource(request, response)) {
          return;
        }

        try {
          const data = JSON.parse(response.text);
          const nextUpV2 = data?.resources?.nextUpV2;
          if (!nextUpV2) {
            return;
          }
          if (!Object.hasOwn(nextUpV2, "isMultiTitleExperience")) {
            return;
          }
          nextUpV2.isMultiTitleExperience = false;
          response.text = JSON.stringify(data);
        } catch (e) {
          console.log(e);
        }
      }

      static disableReactions(request, response) {
        if (!hasReactionsResource(request, response)) {
          return;
        }

        try {
          const data = JSON.parse(response.text);
          const reaction = data?.resources?.reaction;
          if (!reaction) {
            return;
          }
          if (!Object.hasOwn(reaction, "shouldShowReactions")) {
            return;
          }
          reaction.shouldShowReactions = false;
          response.text = JSON.stringify(data);
        } catch (e) {
          console.log(e);
        }
      }

      static forcePlayNextEpisode(request, response) {
        const url = request.url;
        if (url.includes(".mp4")) {
          const pathname = new window.URL(url).pathname;
          const found = pathname.match(/([0-9a-zA-Z-]+)_(video|audio)_\d+\.mp4$/);
          if (!found) {
            return;
          }
          this.#mpdId = found[1];
        } else if (hasCatalogMetadataV2Resource(request, response)) {
          const entityId = new window.URL(url).searchParams.get("entityId");
          if (!entityId) {
            return;
          }

          const data = JSON.parse(response.text);
          this.#pushMetadataResourceArray({
            entityId,
            data,
          });
        } else if (hasNextUpV2Resource(request, response)) {
          const entityId = new window.URL(url).searchParams.get("entityId");
          if (!entityId) {
            return;
          }

          const data = JSON.parse(response.text);
          this.#pushNextUpV2ResourceArray({
            entityId,
            data,
          });
        } else if (isGetVodPlaybackResources(request, response)) {
          const titleId = new window.URL(url).searchParams.get("titleId");
          if (!titleId) {
            return;
          }

          const data = JSON.parse(response.text);
          this.#pushGetVodPlaybackResourcesArray({
            titleId,
            data,
          });
        } else ;
      }

      static run(request, response) {
        for (const q of this.#queue) {
          try {
            q.call(this, request, response);
          } catch (e) {
            console.log(e);
          }
        }
      }

      static init(options) {
        if (this.#queue.length) {
          return;
        }

        if (options.forceHighestResolution_xhook) {
          if (!options.forceHighestResolutionLenient_xhook) {
            this.#queue.push(this.forceHighestResolution);
          } else {
            this.#queue.push(this.forceHighestResolutionLenient);
          }
          if (options.showVideoResolution_xhook) {
            this.#queue.push(this.showVideoResolution);
          }
        }
        if (options.removeAdRelatedData) {
          this.#queue.push(this.removeAdRelatedDataInMpd);
          this.#queue.push(this.removeAdRelatedDataInVodPlaybackResources);
          this.#queue.push(this.removeAdPlaylist);
        }
        if (options.enableAutoplay_xhook) {
          this.#queue.push(this.enableAutoplay);
        }
        if (options.removeNextupTimecodes_xhook) {
          this.#queue.push(this.removeNextupTimecodes);
        }
        if (options.disableRecommendations_xhook) {
          this.#queue.push(this.disableRecommendations);
        }
        if (options.disableReactions_xhook) {
          this.#queue.push(this.disableReactions);
        }
        if (options.forcePlayNextEpisode_xhook) {
          this.#queue.push(this.forcePlayNextEpisode);
        }
      }
    }

    XhookAfter.init(options);

    const script = document.createElement("script");
    script.src = xhookUrl;

    script.addEventListener("load", () => {
      xhook.after(function (request, response) {
        /**
         * Although xhook has the feature to modify responses asynchronously, it is not used here.
         * Using that feature on Prime Video often results in an error message on the screen.
         * Error messages are as follows
         * > That shouldn't have happened.
         * > It looks like something went wrong on our side. Let's find you a great video to watch instead.
         */
        XhookAfter.run(request, response);
      });
    });

    document.head.appendChild(script);

    const identificationGetVodPlaybackResources = () => {
      try {
        const getVodPlaybackResources =
          XhookAfter.getVodPlaybackResourcesArray.find((g) => {
            const playbackUrls =
              g.data?.vodPlaylistedPlaybackUrls?.result?.playbackUrls;
            if (!playbackUrls) {
              return;
            }
            const intraTitlePlaylist = playbackUrls.intraTitlePlaylist;
            if (!intraTitlePlaylist) {
              return;
            }
            const mainPlaylist = intraTitlePlaylist.find(
              (pl) => pl.type === "Main" && Array.isArray(pl.urls)
            );
            if (!mainPlaylist) {
              return;
            }
            const mpdUrls = mainPlaylist.urls.map((obj) => obj.url);
            if (mpdUrls.length === 0) {
              return;
            }
            return mpdUrls.some((url) => url.includes(XhookAfter.mpdId));
          });
        return getVodPlaybackResources;
      } catch (e) {
        // console.log(e);
        return;
      }
    };

    const showVideoResolution = () => {
      class ShowVideoResolution {
        constructor(player, video) {
          this.player = player;
          this.video = video;
          this.show = this._show.bind(this);
          this.mp4Url;
        }

        _show(event) {
          if (!event) {
            return;
          }
          if (this.mp4Url === XhookAfter.mp4Url) {
            return;
          }

          let targetElement = this.player.querySelector(
            ".nextup-ext-resolution-info"
          );
          if (targetElement) {
            targetElement.textContent = "";
          }

          // mp4 may not have started playing yet when it loads.
          // This can be addressed by verifying using the title name currently playing.

          let titleElement = this.player.querySelector(
            ".atvwebplayersdk-subtitle-text"
          );
          if (!titleElement || !titleElement?.textContent) {
            // For movies, etc., there is no subtitle-text
            // Previously an empty element, as of December 2025, this element does not exist in movies or similar media.
            titleElement = this.player.querySelector(
              ".atvwebplayersdk-title-text"
            );
          }
          if (!titleElement) {
            return;
          }
          const title = titleElement.textContent;
          if (!title) {
            return;
          }

          const getVodPlaybackResources = identificationGetVodPlaybackResources();
          if (!getVodPlaybackResources) {
            return;
          }

          const titleId = getVodPlaybackResources.titleId;
          const metadataResource = XhookAfter.metadataResourceArray.find(
            (m) => m.entityId === titleId
          );
          if (!metadataResource) {
            return;
          }

          // Verify the title name

          if (
            !title.includes(
              metadataResource.data.resources?.catalogMetadataV2?.catalog?.title
            )
          ) {
            return;
          }

          // The following code must be executed after verifying the title name.

          const resolution = XhookAfter.resolutionInfoArray.find((r) => {
            return XhookAfter.mp4Url.includes(r.baseURL);
          });
          if (!resolution) {
            return;
          }

          if (targetElement) {
            const timeindicator = this.player.querySelector(
              ".atvwebplayersdk-timeindicator-text"
            );
            // If an ad is played, the timeindicator is removed/regenerated.
            if (!timeindicator) {
              targetElement.remove();
              targetElement = null;
              return;
            }
          }

          if (!targetElement) {
            try {
              const timeindicator = this.player.querySelector(
                ".atvwebplayersdk-timeindicator-text"
              );
              if (!timeindicator) {
                return;
              }
              targetElement = timeindicator.cloneNode();
              targetElement.classList.remove(
                "atvwebplayersdk-timeindicator-text"
              );
              targetElement.classList.add("nextup-ext-resolution-info");
              timeindicator.parentNode.append(targetElement);
            } catch (e) {
              console.log(e);
              return;
            }
          }

          const width = resolution.width;
          const height = resolution.height;
          const resolutionText = `${width}×${height}`;
          targetElement.textContent = resolutionText;
          this.mp4Url = XhookAfter.mp4Url;
        }

        runVideoOpenCloseObserver() {
          new MutationObserver((_, videoOpenObserver) => {
            if (!this.player.classList.contains("dv-player-fullscreen")) {
              return;
            }
            videoOpenObserver.disconnect();

            this.video.addEventListener("timeupdate", this.show);

            new MutationObserver((_, videoCloseObserver) => {
              if (this.player.classList.contains("dv-player-fullscreen")) {
                return;
              }
              videoCloseObserver.disconnect();

              this.video.removeEventListener("timeupdate", this.show);
              this.mp4Url = null;

              this.runVideoOpenCloseObserver();
            }).observe(this.player, {
              attributes: true,
              attributeFilter: ["class"],
            });
          }).observe(this.player, {
            attributes: true,
            attributeFilter: ["class"],
          });
        }
      }

      const random = window.crypto.randomUUID().replaceAll("-", "");

      new MutationObserver((_) => {
        const players = document.querySelectorAll(
          `[id*='dv-web-player']:not([data-detected-from-nextup-ext${random}='true'])`
        );
        players.forEach((player) => {
          player.dataset[`detectedFromNextupExt${random}`] = "true";
          new MutationObserver((_, observer) => {
            const video = player.querySelector("video");
            if (!video) {
              return;
            }
            observer.disconnect();
            const s = new ShowVideoResolution(player, video);
            s.runVideoOpenCloseObserver();
          }).observe(player, {
            childList: true,
            subtree: true,
          });
        });
      }).observe(document, { childList: true, subtree: true });
    };

    showVideoResolution();

    const detectNextEpisodeId = () => {
      if (!options.forcePlayNextEpisode_xhook) {
        return;
      }

      class DetectNextEpisodeId {
        constructor(player, video) {
          this.player = player;
          this.video = video;
          this.detect = this._detect.bind(this);
          this.videoSrcObserver = this.createVideoSrcObserver();
        }

        getSubtitleText() {
          const subtitle = this.player.querySelector(
            ".atvwebplayersdk-subtitle-text"
          );
          if (!subtitle) {
            return;
          }
          const newSubtitleText = subtitle.textContent;
          if (!newSubtitleText) {
            return;
          }
          return newSubtitleText;
        }

        _detect(event) {
          if (!event) {
            return;
          }
          const subtitleText = this.getSubtitleText();
          if (!subtitleText) {
            return;
          }

          const getVodPlaybackResources = identificationGetVodPlaybackResources();
          if (!getVodPlaybackResources) {
            return;
          }

          const titleId = getVodPlaybackResources.titleId;
          const metadataResource = XhookAfter.metadataResourceArray.find(
            (m) => m.entityId === titleId
          );
          if (!metadataResource) {
            return;
          }

          if (
            !subtitleText.includes(
              metadataResource.data.resources?.catalogMetadataV2?.catalog?.title
            )
          ) {
            return;
          }

          const nextUpV2Resource = XhookAfter.nextUpV2ResourceArray.find(
            (n) => n.entityId === titleId
          );
          if (!nextUpV2Resource) {
            return;
          }

          const data = nextUpV2Resource.data;
          if (!data.resources.nextUpV2.carousel) {
            const carouselItem = data.resources.nextUpV2.card.carouselItems[0];
            if (!carouselItem) {
              return;
            }

            const autoplayConfig = data.resources?.nextUpV2?.card?.autoPlayConfig;
            if (carouselItem.analytics?.slotType !== "NEXT_EPISODE_SLOT") {
              this.player.dataset.nextEpisodeId = "null";
            } else if (autoplayConfig?.autoplayCardPreferredImage !== "episode") {
              this.player.dataset.nextEpisodeId = "null";
            }

            if (this.player.dataset.nextEpisodeId !== "null") {
              const nextEpisodeId = carouselItem.titleId;
              if (nextEpisodeId) {
                if (!this.player.dataset.nextEpisodeId) {
                  this.player.dataset.nextEpisodeId = nextEpisodeId;
                } else if (this.player.dataset.nextEpisodeId !== nextEpisodeId) {
                  this.player.dataset.nextEpisodeId = nextEpisodeId;
                }
              }
            }
          } else {
            this.player.dataset.nextEpisodeId = "null";
          }

          this.video.removeEventListener("timeupdate", this.detect);

          // Detection of auto play
          this.videoSrc = this.video.getAttribute("src");
          this.videoSrcObserver.observe(this.video, {
            attributes: true,
            attributeFilter: ["src"],
          });
        }

        createVideoSrcObserver() {
          return new MutationObserver((_, observer) => {
            const newVideoSrc = this.video.getAttribute("src");
            if (this.videoSrc !== newVideoSrc) {
              observer.disconnect();
              this.video.addEventListener("timeupdate", this.detect);
              delete this.player.dataset.nextEpisodeId;
            }
          });
        }

        runVideoOpenCloseObserver() {
          new MutationObserver((_, videoOpenObserver) => {
            if (!this.player.classList.contains("dv-player-fullscreen")) {
              return;
            }
            videoOpenObserver.disconnect();

            this.video.addEventListener("timeupdate", this.detect);

            new MutationObserver((_, videoCloseObserver) => {
              if (this.player.classList.contains("dv-player-fullscreen")) {
                return;
              }
              videoCloseObserver.disconnect();

              this.video.removeEventListener("timeupdate", this.detect);
              this.videoSrcObserver.disconnect();

              this.runVideoOpenCloseObserver();
            }).observe(this.player, {
              attributes: true,
              attributeFilter: ["class"],
            });
          }).observe(this.player, {
            attributes: true,
            attributeFilter: ["class"],
          });
        }
      }

      const random = window.crypto.randomUUID().replaceAll("-", "");

      new MutationObserver((_) => {
        const players = document.querySelectorAll(
          `[id*='dv-web-player']:not([data-detected-from-nextup-ext${random}='true'])`
        );
        players.forEach((player) => {
          player.dataset[`detectedFromNextupExt${random}`] = "true";
          new MutationObserver((_, observer) => {
            const video = player.querySelector("video");
            if (!video) {
              return;
            }
            observer.disconnect();
            const d = new DetectNextEpisodeId(player, video);
            d.runVideoOpenCloseObserver();
          }).observe(player, {
            childList: true,
            subtree: true,
          });
        });
      }).observe(document, { childList: true, subtree: true });
    };

    detectNextEpisodeId();
  };

  const injectXhook = (options = getDefaultOptions()) => {
    const xhookOptions = [
      options.forceHighestResolution_xhook,
      options.removeAdRelatedData,
      options.enableAutoplay_xhook,
      options.removeNextupTimecodes_xhook,
      options.disableRecommendations_xhook,
      options.disableReactions_xhook,
      options.forcePlayNextEpisode_xhook,
    ];
    const shouldInjectXhook = xhookOptions.some((opt) => opt);
    if (!shouldInjectXhook) {
      return;
    }

    const injectScript = (fn) => {
      // https://stackoverflow.com/questions/9515704/access-variables-and-functions-defined-in-page-context-from-an-extension
      // https://github.com/logore/amazon-prime-video-1080p
      if (typeof fn !== "function") {
        return;
      }

      let match = fn.toString().match(/{.*}/s);
      let fnStr = match[0].slice(1, match[0].length - 1);

      document.documentElement.setAttribute("onreset", fnStr);
      document.documentElement.dispatchEvent(new CustomEvent("reset"));
      document.documentElement.removeAttribute("onreset");
    };

    document.documentElement.dataset.options = JSON.stringify(options);

    let xhookUrl;
    if (ScriptInfo.isChromeExtension()) {
      try {
        xhookUrl = chrome?.runtime?.getURL("xhook.min.js");
      } catch (e) {}
    } else if (ScriptInfo.isUserScript()) {
      /**
       * The Chrome Web Store is strict about remote code execution, so CDN URLs are not hardcoded
       * Also, GM_getResourceText/URL is not used because we want to share the way xhook is executed with Chrome's extension edition.
       */
      try {
        const gmInfo = window.GM_info || GM_info;
        const resources = gmInfo.script.resources;
        if (Array.isArray(resources)) {
          // Tampermonkey / Violentmonkey
          const xhookResource = resources.find((r) => r.name === "xhook");
          if (xhookResource.url) {
            xhookUrl = xhookResource.url;
          }
        } else if (typeof resources === "object") {
          // Greasemonkey
          if (Object.hasOwn(resources, "xhook")) {
            xhookUrl = resources.xhook.url;
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (xhookUrl) {
      document.documentElement.dataset.xhookUrl = xhookUrl;
      injectScript(runXhook);
    }
  };

  class ElementController {
    constructor(player) {
      this.player = player;
      this.centerOverlaysWrapperIsMarked = false;
    }

    createOptionBtn() {
      new MutationObserver((_, observer) => {
        if (this.player.querySelector(".nextup-ext-opt-btn-container")) {
          observer.disconnect();
          return;
        }

        const btnsContainer = this.player.querySelector(
          ".atvwebplayersdk-hideabletopbuttons-container"
        );
        if (!btnsContainer) {
          return;
        }

        observer.disconnect();

        const optContainer = btnsContainer.querySelector(
          ".atvwebplayersdk-options-wrapper span div:has(.atvwebplayersdk-optionsmenu-button)"
        );
        const clone = optContainer.cloneNode(true);
        clone.classList.add("nextup-ext-opt-btn-container");
        btnsContainer
          .querySelector("div:has(.atvwebplayersdk-options-wrapper)")
          .appendChild(clone);

        const cloneOptBtn = clone.querySelector(
          ".atvwebplayersdk-optionsmenu-button"
        );
        cloneOptBtn.classList.remove("atvwebplayersdk-optionsmenu-button");
        cloneOptBtn.classList.add("nextup-ext-opt-btn");

        const cloneOptBtnImg = cloneOptBtn.querySelector("img");
        cloneOptBtnImg.style.filter =
          "sepia(100%) saturate(2000%) hue-rotate(120deg)";

        const cloneTooltip = clone.querySelector("button + div div");
        cloneTooltip.textContent = "Option - Auto hide next up card";

        cloneOptBtn.addEventListener("click", (_) => {
          const optDialog = getOptionDialog();
          optDialog.showModal();
        });

        new MutationObserver((_, observer2) => {
          if (this.player.querySelector(".nextup-ext-opt-btn-container")) {
            return;
          }
          observer2.disconnect();
          this.createOptionBtn();
        }).observe(btnsContainer, { ...observeConfig, attributes: true });
      }).observe(this.player, { ...observeConfig, attributes: true });
    }

    // for LiveTV
    changeOrderOfVideoElements(options = getOptions()) {
      if (!options.useOnLiveTv) {
        return;
      }

      let videoWrapper;

      const videoElementsObserver = new MutationObserver((_) => {
        if (!videoWrapper) {
          return;
        }

        const videos = videoWrapper.querySelectorAll("video");
        if (videos.length !== 2) {
          return;
        }
        if (
          videos[0].style.display !== "none" ||
          videos[1].style.display !== ""
        ) {
          return;
        }
        if (videos[0].hasAttribute("src") || !videos[1].hasAttribute("src")) {
          return;
        }
        videos[0].before(videos[1]);
      });

      new MutationObserver((_, observer) => {
        /**
         * at amazon.co.jp
         * .rendererContainer - before 2025/05/03 and after 2025/05/07
         * .atvwebplayersdk-video-surface - existed from 2025/05/03 to 2025/05/07
         */
        const wrapper1 = this.player.querySelector(".rendererContainer");
        const wrapper2 = this.player.querySelector(
          ".atvwebplayersdk-video-surface"
        );
        videoWrapper = wrapper1 ?? wrapper2;
        if (!videoWrapper) {
          return;
        }
        observer.disconnect();
        videoElementsObserver.observe(videoWrapper, {
          ...observeConfig,
          attributes: true,
        });
      }).observe(this.player, observeConfig);
    }

    // Preparation for detecting the display state of the overlay.
    markingCenterOverlaysWrapper() {
      if (this.centerOverlaysWrapperIsMarked) {
        return true;
      }

      const playPauseButton = this.player.querySelector(
        ".atvwebplayersdk-playpause-button"
      );
      if (!playPauseButton) {
        return false;
      }
      try {
        const centerOverlaysWrapper =
          playPauseButton.parentNode.parentNode.parentNode.parentNode;
        const hasCursorStyle1 =
          centerOverlaysWrapper.style.cssText.includes("cursor: none");
        const hasCursorStyle2 =
          centerOverlaysWrapper.style.cssText.includes("cursor: pointer");
        if (hasCursorStyle1 || hasCursorStyle2) {
          centerOverlaysWrapper.dataset.ident = "center-overlays-wrapper";
        }
        this.centerOverlaysWrapperIsMarked = true;
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    }

    markingToIdentifyNonDarkeningOverlays() {
      const overlays = this.player.querySelectorAll(
        "div:has(>.atvwebplayersdk-regulatory-overlay) > div"
      );
      if (overlays.length === 0) {
        return;
      }
      if (this.player.querySelector("[data-non-darkening-overlay]")) {
        return;
      }

      const selector =
        "div:has(>.atvwebplayersdk-regulatory-overlay) > div:not(:has(>.atvwebplayersdk-loadingspinner-overlay) ~ div):not(:has(>.atvwebplayersdk-loadingspinner-overlay)):has(> div:nth-child(2):last-child)";
      for (const overlay of overlays) {
        if (!overlay.matches(selector)) {
          overlay.dataset.nonDarkeningOverlay = "true";
        }
      }
    }

    skipAds(options = getDefaultOptions()) {
      if (!options.skipAds) {
        return;
      }

      if (!document.querySelector("#ext-skipAds")) {
        const css = `
        .atvwebplayersdk-ad-timer-countdown {
          display: none !important;
        }
        .atvwebplayersdk-go-ad-free-button {
          display: none !important;
        }
        .atvwebplayersdk-seek-unavailable-text {
          display: none !important;
        }
      `;
        addStyle(css, "ext-skipAds");
      }

      let canSkip = true;
      new MutationObserver((_) => {
        if (!canSkip) {
          return;
        }
        const remainingTimeElem = this.player.querySelector(
          ".atvwebplayersdk-ad-timer-remaining-time"
        );
        if (!remainingTimeElem) {
          return;
        }

        const video = this.player.querySelector("video");
        if (!video?.currentTime) {
          return;
        }

        video.muted = true;
        setTimeout(() => {
          video.muted = false;
        }, 2000);

        const remainingTimeStr = remainingTimeElem.textContent;
        const mached = remainingTimeStr.match(/(\d{1,2}):(\d{2})/);
        if (!mached) {
          video.muted = false;
          return;
        }

        let adTime = 0;
        const remainingTimeArray = [mached[1], mached[2]];
        for (const [i, timeStr] of remainingTimeArray.entries()) {
          adTime +=
            parseInt(timeStr) * Math.pow(60, remainingTimeArray.length - 1 - i);
        }
        if (adTime <= 1) {
          video.muted = false;
          return;
        }

        canSkip = false;
        adTime -= 1;
        console.log(`Skip ${adTime} seconds`);
        video.currentTime += adTime;
        video.muted = false;
        console.log("Skipped ads");

        setTimeout(() => {
          canSkip = true;
        }, 3000);
      }).observe(this.player, { ...observeConfig, characterData: true });
    }

    hideSkipIntroBtn(options = getDefaultOptions()) {
      if (!options.hideSkipIntroBtn || options.tweakHideSkipIntroButton) {
        return;
      }

      if (!document.querySelector("#ext-hideSkipIntroBtn")) {
        const css = `
        .atvwebplayersdk-skipelement-button {
          display: none !important;
        }
      `;
        addStyle(css, "ext-hideSkipIntroBtn");
      }

      if (!options.showSkipIntroBtnOnOverlay) {
        return;
      }

      if (!this.markingCenterOverlaysWrapper()) {
        return;
      }

      const playerContainer = this.player.querySelector(
        ".atvwebplayersdk-player-container"
      );
      const centerOverlaysWrapper = this.player.querySelector(
        "[data-ident='center-overlays-wrapper']"
      );
      new MutationObserver((_) => {
        // Supports situations where a skip intro button is present immediately after the start or where the seek bar jumps to the OP
        const skipIntroBtn = this.player.querySelector(
          ".atvwebplayersdk-skipelement-button"
        );
        if (!skipIntroBtn) {
          centerOverlaysWrapper.dataset.existsSkipIntroBtn = false;
        } else {
          centerOverlaysWrapper.dataset.existsSkipIntroBtn = true;
        }
      }).observe(playerContainer, observeConfig);

      new MutationObserver((_) => {
        const skipIntroBtn = this.player.querySelector(
          ".atvwebplayersdk-skipelement-button"
        );
        if (!skipIntroBtn) {
          return;
        }
        const computedStyle = getComputedStyle(centerOverlaysWrapper);
        if (computedStyle.cursor === "pointer") {
          skipIntroBtn.style.setProperty("display", "block", "important");
        } else {
          skipIntroBtn.style.setProperty("display", "none", "important");
        }
      }).observe(centerOverlaysWrapper, {
        attributes: true,
      });
    }

    preventsDarkeningInConjunctionWithNextup(options = getDefaultOptions()) {
      if (options.preventsDarkening) {
        // If preventsDarkening is enabled, darkening is completely disabled.
        return;
      }
      if (!options.preventsDarkeningInConjunctionWithNextup) {
        return;
      }

      if (
        !document.querySelector("#ext-preventsDarkeningInConjunctionWithNextup")
      ) {
        /**
         * at amazon.co.jp
         * .fkpovp9 - before 2025/05/16
         * .f1makowq - after 2025/05/16
         * The style that hides .fkpovp9 will be removed in the future
         */
        const css = `
        .atvwebplayersdk-player-container:has(.atvwebplayersdk-nextupcard-show) div:has(>.atvwebplayersdk-regulatory-overlay) > div:not([data-non-darkening-overlay]),
        .atvwebplayersdk-player-container:has(.atvwebplayersdk-nextupcard-show) div:has(>.atvwebplayersdk-regulatory-overlay) > div:not([data-non-darkening-overlay]) > div {
          background: transparent !important;
        }

        .atvwebplayersdk-player-container:has(.atvwebplayersdk-nextupcard-show) .fkpovp9:has(~.atvwebplayersdk-regulatory-overlay) {
          opacity: 0 !important;
        }
        .atvwebplayersdk-player-container:has(.atvwebplayersdk-nextupcard-show):has([data-ident='center-overlays-wrapper'][style*='cursor: pointer;']) .fkpovp9:has(~.atvwebplayersdk-regulatory-overlay) {
          opacity: 1 !important;
        }

        /*
          .f1makowq is generated before the nextup element is generated.
          If the cursor is none, hide .f1makowq because .f1makowq flickers for just a moment before nextup is generated.
        */
        div:has(>.atvwebplayersdk-regulatory-overlay):has([data-ident='center-overlays-wrapper'][style*='cursor: none;']) .f1makowq:has(~.atvwebplayersdk-regulatory-overlay) {
          visibility: hidden;
        }
        .atvwebplayersdk-player-container:has(.atvwebplayersdk-nextupcard-show) .f1makowq:has(~.atvwebplayersdk-regulatory-overlay) {
          opacity: 0 !important;
        }
        .atvwebplayersdk-player-container:has(.atvwebplayersdk-nextupcard-show):has([data-ident='center-overlays-wrapper'][style*='cursor: pointer;']) .f1makowq:has(~.atvwebplayersdk-regulatory-overlay) {
          opacity: 1 !important;
        }

        .atvwebplayersdk-player-container:has(.atvwebplayersdk-nextupcard-show):has([data-ident='center-overlays-wrapper'][style*='cursor: pointer;']) .f1makowq:has(~.atvwebplayersdk-regulatory-overlay) div:nth-child(1) {
          background: linear-gradient(180deg,rgba(0, 0, 0, 0.5) 0%,rgba(0, 0, 0, 0.5) 49.48%,rgba(0, 0, 0, 0) 100%) !important;
        }
        .atvwebplayersdk-player-container:has(.atvwebplayersdk-nextupcard-show):has([data-ident='center-overlays-wrapper'][style*='cursor: pointer;']) .f1makowq:has(~.atvwebplayersdk-regulatory-overlay) div:nth-child(2) {
          background: linear-gradient(180deg,rgba(0, 0, 0, 0) 0.98%,rgba(0, 0, 0, 0.7) 53.49%,rgba(0, 0, 0, 0.5) 100%) !important;
        }
      `;
        addStyle(css, "ext-preventsDarkeningInConjunctionWithNextup");
      }
    }

    temporarilyDisableOverlay(options = getDefaultOptions(), delay = 5000) {
      if (!options.temporarilyDisableOverlay) {
        return;
      }
      const playerContainer = this.player.querySelector(
        ".atvwebplayersdk-player-container"
      );
      if (!playerContainer) {
        return;
      }
      playerContainer.style.display = "none";
      setTimeout(() => {
        playerContainer.style.display = "";
      }, delay);
    }

    hideNextupCard(options = getDefaultOptions()) {
      if (!options.hideNextup) {
        return;
      }

      if (!document.querySelector("#ext-hideNextupCard")) {
        const css = `
        .atvwebplayersdk-nextupcard-wrapper {
          display: none !important;
        }
      `;
        addStyle(css, "ext-hideNextupCard");
      }

      new MutationObserver((_, outerObserver) => {
        const wrapper = this.player.querySelector(
          ".atvwebplayersdk-nextupcard-wrapper"
        );
        if (!wrapper) {
          return;
        }
        outerObserver.disconnect();

        new MutationObserver((_) => {
          const hideButton = wrapper.querySelector(
            ".atvwebplayersdk-nextupcardhide-button"
          );
          if (hideButton) {
            const video = this.player.querySelector("video");
            if (!video || options.clickHideButtonForAllNextup) {
              try {
                this.temporarilyDisableOverlay(options, 5000);
                hideButton.click();
              } catch (e) {
                console.log(e);
              }
            } else {
              // Pressing the hide button on the next up card that appears a few seconds before the end of the video seems to cancel autoplay.
              // To avoid closing the video, the decision to click the hide button is based on the time remaining in the video.
              try {
                const currentTime = video.currentTime;
                const duration = video.duration;
                if (duration - currentTime >= 6) {
                  this.temporarilyDisableOverlay(options, 5000);
                  hideButton.click();
                }
              } catch (e) {
                console.log(e);
              }
            }
          }
        }).observe(wrapper, observeConfig);

        this.preventsDarkeningInConjunctionWithNextup(options);

        if (options.showNextupOnOverlay) {
          if (!this.markingCenterOverlaysWrapper()) {
            return;
          }

          const centerOverlaysWrapper = this.player.querySelector(
            "[data-ident='center-overlays-wrapper']"
          );
          new MutationObserver((_) => {
            const img = wrapper.querySelector("img");
            if (!img || !img.getAttribute("src")) {
              centerOverlaysWrapper.dataset.existsNextup = false;
            } else {
              centerOverlaysWrapper.dataset.existsNextup = true;
            }
          }).observe(wrapper, observeConfig);

          new MutationObserver((_) => {
            const img = wrapper.querySelector("img");
            if (!img || !img.getAttribute("src")) {
              wrapper.style.setProperty("display", "none", "important");
              return;
            }
            const computedStyle = getComputedStyle(centerOverlaysWrapper);
            if (computedStyle.cursor === "pointer") {
              wrapper.style.setProperty("display", "block", "important");
            } else {
              wrapper.style.setProperty("display", "none", "important");
            }
          }).observe(centerOverlaysWrapper, {
            attributes: true,
          });
        }
      }).observe(this.player, { ...observeConfig, attributes: true });
    }

    hideReactions(options = getDefaultOptions()) {
      if (!options.hideReactions) {
        return;
      }

      new MutationObserver((_, outerObserver) => {
        const reactionsBtnContainer = this.player.querySelector(
          ".atvwebplayersdk-player-container div:has(> button:nth-child(2):last-child)"
        );
        if (!reactionsBtnContainer) {
          return;
        }
        const btnIcons = reactionsBtnContainer.querySelectorAll(
          "button div[style*='center center no-repeat']"
        );
        if (!btnIcons.length) {
          return;
        }

        // The content may disappear, but the wrapper remains,
        // so the setting of display:none is likely sufficient to do only once.
        outerObserver.disconnect();
        const reactionsWrapper = reactionsBtnContainer.parentNode.parentNode;
        reactionsWrapper.style.display = "none";

        if (!options.showReactionsOnOverlay) {
          return;
        }

        if (!this.markingCenterOverlaysWrapper()) {
          return;
        }

        const centerOverlaysWrapper = this.player.querySelector(
          "[data-ident='center-overlays-wrapper']"
        );
        new MutationObserver((_) => {
          const reactionsBtns = reactionsWrapper.querySelectorAll("button");
          if (!reactionsBtns.length) {
            centerOverlaysWrapper.dataset.existsReactions = false;
          } else {
            centerOverlaysWrapper.dataset.existsReactions = true;
          }
        }).observe(reactionsWrapper, observeConfig);

        const changeReactionsStyle = (_) => {
          const reactionsBtns = reactionsWrapper.querySelectorAll("button");
          if (!reactionsBtns.length) {
            reactionsWrapper.style.display = "none";
            return;
          }
          const computedStyle = getComputedStyle(centerOverlaysWrapper);
          if (computedStyle.cursor === "pointer") {
            reactionsWrapper.style.display = "";
          } else {
            reactionsWrapper.style.display = "none";
          }
        };

        changeReactionsStyle();
        new MutationObserver(changeReactionsStyle).observe(
          centerOverlaysWrapper,
          {
            attributes: true,
          }
        );
      }).observe(this.player, observeConfig);
    }

    hideRecommendations(options = getDefaultOptions()) {
      if (!options.hideRecommendations) {
        return;
      }

      if (!options.showRecommendationsOnOverlay) {
        if (!document.querySelector("#ext-hideRecommendations")) {
          const css = `
          [id^='dv-web-player']:not([data-is-jump-live-button-visible='true']) .atvwebplayersdk-BelowFold {
            display: none !important;
          }
        `;
          addStyle(css, "ext-hideRecommendations");
        }
      }

      // To avoid doing anything to 'Recommendations' when watching LiveTV
      const optionsWrapper = this.player.querySelector(
        ".atvwebplayersdk-options-wrapper"
      );
      if (options.useOnLiveTv && optionsWrapper) {
        const checkJumpLiveButtonStyles = () => {
          const jumpLiveButton = this.player.querySelector(
            ".atvwebplayersdk-jumptolive-button"
          );
          if (jumpLiveButton) {
            if (
              getComputedStyle(jumpLiveButton).display === "block" &&
              jumpLiveButton.style.display === ""
            ) {
              this.player.dataset.isJumpLiveButtonVisible = "true";
            } else {
              delete this.player.dataset.isJumpLiveButtonVisible;
            }
          } else {
            delete this.player.dataset.isJumpLiveButtonVisible;
          }
        };
        checkJumpLiveButtonStyles();
        new MutationObserver((_) => {
          checkJumpLiveButtonStyles();
        }).observe(optionsWrapper, { ...observeConfig, attributes: true });
      }

      // Monitor whether BelowFold has been opened by the user
      let isOpenedByUser = false;
      const hideButtonSelector =
        ".atvwebplayersdk-BelowFold div:not(.atvwebplayersdk-carousel) > button:not([class^=generic-carousel-scroll]):has(span)";
      const stopAutoPlayButtonSelector =
        ".atvwebplayersdk-BelowFold div:not(.atvwebplayersdk-carousel) > button[aria-label]:not([class^=generic-carousel-scroll])";

      this.player.addEventListener("click", (e) => {
        if (
          e.target.closest(hideButtonSelector) ||
          e.target.closest(stopAutoPlayButtonSelector)
        ) {
          isOpenedByUser = false;
          return;
        }

        if (e.target.closest(".generic-carousel-scroll-handles")) {
          isOpenedByUser = true;
          return;
        }

        const belowFold = this.player.querySelector(".atvwebplayersdk-BelowFold");
        if (belowFold) {
          if (getComputedStyle(belowFold).position === "absolute") {
            isOpenedByUser = false;
            return;
          }
        }

        if (e.target.closest(".atvwebplayersdk-BelowFold")) {
          isOpenedByUser = true;
          setTimeout(() => {
            isOpenedByUser = false;
          }, 3000);
        }
      });

      const targetContainer =
        this.player.querySelector(
          "div:has(>.atvwebplayersdk-bottompanel-container)"
        ) ?? this.player;

      new MutationObserver((_) => {
        const hideButton = this.player.querySelector(hideButtonSelector);
        if (!hideButton) {
          return;
        }

        let _isOpenedByUser = isOpenedByUser;
        if (!options.showRecommendationsOnOverlay) {
          _isOpenedByUser = false;
        }

        // If useOnLiveTv is disabled, this will always be false
        const isJumpLiveButtonVisible =
          this.player.dataset.isJumpLiveButtonVisible === "true";

        if (!_isOpenedByUser && !isJumpLiveButtonVisible) {
          try {
            this.temporarilyDisableOverlay(options, 5000);
            const stopAutoPlayButton = this.player.querySelector(
              stopAutoPlayButtonSelector
            );
            if (stopAutoPlayButton) {
              stopAutoPlayButton.click();
            }
            hideButton.click();
          } catch (e) {
            console.log(e);
          }
        }
      }).observe(targetContainer, observeConfig);
    }

    hideRatingText(options = getDefaultOptions()) {
      if (!options.hideRating) {
        return;
      }
      if (!document.querySelector("#ext-hideRatingText")) {
        const css = `
        .atvwebplayersdk-regulatory-overlay {
          display: none !important;
        }
      `;
        addStyle(css, "ext-hideRatingText");
      }
    }

    preventsDarkening(options = getDefaultOptions()) {
      if (!options.preventsDarkening) {
        return;
      }

      if (!document.querySelector("#ext-preventsDarkening")) {
        /**
         * at amazon.co.jp
         * .fkpovp9 - before 2025/05/16
         * .f1makowq - after 2025/05/16
         * The style that hides .fkpovp9 will be removed in the future
         */
        const css = `
        div:has(>.atvwebplayersdk-regulatory-overlay) > div:not([data-non-darkening-overlay]),
        div:has(>.atvwebplayersdk-regulatory-overlay) > div:not([data-non-darkening-overlay]) > div{
          background: transparent !important;
        }
        .fkpovp9:has(~.atvwebplayersdk-regulatory-overlay),
        .f1makowq:has(~.atvwebplayersdk-regulatory-overlay) {
          display: none !important;
        }
        .atvwebplayersdk-BelowFold {
          background: transparent !important;
        }
      `;
        addStyle(css, "ext-preventsDarkening");
      }

      if (options.addOutlinesForTextsAndIcons) {
        if (!document.querySelector("#ext-addOutlinesForTexts")) {
          const cssForText = `
          .atvwebplayersdk-title-text {
            paint-order: stroke fill;
            -webkit-text-stroke: 0.05em black;
            font-weight: bold !important;
            text-shadow: 1px 1px 3px black;
          }
          .atvwebplayersdk-subtitle-text {
            paint-order: stroke fill;
            -webkit-text-stroke: 0.05em black;
            font-weight: bold !important;
            text-shadow: 1px 1px 3px black;
          }
          .atvwebplayersdk-timeindicator-text {
            paint-order: stroke fill;
            -webkit-text-stroke: 0.07em black;
            font-weight: bold !important;
            text-shadow: 1px 1px 2px black;
          }
          .atvwebplayersdk-timeindicator-text span {
            opacity: 1;
            font-weight: bold !important;
            text-shadow: 1px 1px 2px black;
          }
          .atvwebplayersdk-nexttitle-button div:not(:has(img)) {
            paint-order: stroke fill;
            -webkit-text-stroke: 0.07em black;
            font-weight: bold !important;
            text-shadow: 1px 1px 2px black;
          }
          .atvwebplayersdk-hideabletopbuttons-container button + div div,
          .atvwebplayersdk-playerclose-button + div div {
            paint-order: stroke fill;
            -webkit-text-stroke: 0.07em black;
            font-weight: bold !important;
            text-shadow: 1px 1px 2px black;
          }
          /* Next up*/
          .atvwebplayersdk-nextupcard-title, .atvwebplayersdk-nextupcardhide-button {
            paint-order: stroke fill;
            -webkit-text-stroke: 0.07em black;
            font-weight: bold !important;
            text-shadow: 1px 1px 2px black;
          }
          /* Reactions */
          .atvwebplayersdk-player-container div:has(> div > button:nth-child(2):last-child):has(div > button div[style*='center center no-repeat']) div:not([style]):not(:has([style])) {
            paint-order: stroke fill;
            -webkit-text-stroke: 0.07em black;
            font-weight: bold !important;
            text-shadow: 1px 1px 2px black;
          }
          /* Recommendations */
          .atvwebplayersdk-BelowFold span, .atvwebplayersdk-BelowFold div {
            paint-order: stroke fill;
            -webkit-text-stroke: 0.07em black;
            font-weight: bold !important;
            text-shadow: 1px 1px 2px black;
          }
        `;
          addStyle(cssForText, "ext-addOutlinesForTexts");
        }

        if (!document.querySelector("#ext-addOutlinesForIcons")) {
          const cssForImg = `
          .atvwebplayersdk-hideabletopbuttons-container button img,
          .atvwebplayersdk-playerclose-button img {
            filter: drop-shadow(1px 0 0 black) drop-shadow(-1px 0 0 black) drop-shadow(0 1px 0 black) drop-shadow(0 -1px 0 black);
          }
          .nextup-ext-opt-btn img {
            filter: sepia(100%) saturate(2000%) hue-rotate(120deg) drop-shadow(1px 0 0 black) drop-shadow(-1px 0 0 black) drop-shadow(0 1px 0 black) drop-shadow(0 -1px 0 black) !important;
          }
          .atvwebplayersdk-fastseekback-button img,
          .atvwebplayersdk-playpause-button img,
          .atvwebplayersdk-fastseekforward-button img {
            filter: drop-shadow(1px 0 0 black) drop-shadow(-1px 0 0 black) drop-shadow(0 1px 0 black) drop-shadow(0 -1px 0 black);
          }
          .atvwebplayersdk-nexttitle-button img {
            filter: drop-shadow(1px 0 0 black) drop-shadow(-1px 0 0 black) drop-shadow(0 1px 0 black) drop-shadow(0 -1px 0 black);
          }
        `;
          addStyle(cssForImg, "ext-addOutlinesForIcons");
        }

        if (
          options.forceHighestResolution_xhook &&
          options.showVideoResolution_xhook
        ) {
          if (!document.querySelector("#ext-preventsDarkening_ResolutionInfo")) {
            const cssForResolutionInfo = `
          .nextup-ext-resolution-info {
            paint-order: stroke fill;
            -webkit-text-stroke: 0.07em black;
            font-weight: bold !important;
            text-shadow: 1px 1px 2px black;
          }
        `;
            addStyle(
              cssForResolutionInfo,
              "ext-preventsDarkening_ResolutionInfo"
            );
          }
        }
      }

      if (options.addShadowsToSeekBar) {
        if (!document.querySelector("#ext-addShadowsToSeekBar")) {
          const cssForShadows = `
          .atvwebplayersdk-seekbar-range {
            box-shadow: 2px 2px 6px #888;
          }
          .atvwebplayersdk-seekbar-range + span {
            border-right: 5px solid rgb(85, 85, 85);
          }
          .atvwebplayersdk-progress-bar-handle {
            box-shadow: 0px 0px 5px #222;
          }
        `;
          addStyle(cssForShadows, "ext-addShadowsToSeekBar");
        }
      }
    }

    // Move the center buttons(Play/Pause, Back and Forward) to the bottom.
    moveCenterButtonsToBottom(options = getDefaultOptions()) {
      if (!options.moveCenterButtonsToBottom) {
        return;
      }

      const playPauseButton = this.player.querySelector(
        ".atvwebplayersdk-playpause-button"
      );

      const container = playPauseButton.parentNode.parentNode.parentNode;
      const computedStyle = window.getComputedStyle(container);
      if (parseFloat(computedStyle.marginTop) > 0) {
        return;
      }

      container.style.position = "absolute";
      container.style.bottom = 0;
      container.style.zIndex = 999;

      const adjustElementSize = (element) => {
        if (element) {
          const elementComputedStyle = window.getComputedStyle(element);
          const width = parseFloat(elementComputedStyle.width);
          const height = parseFloat(elementComputedStyle.height);
          const newWidth = width * 0.65;
          const newHeight = height * 0.65;
          element.style.setProperty("width", newWidth + "px", "important");
          element.style.setProperty("height", newHeight + "px", "important");
        }
      };

      const buttons = container.querySelectorAll("button");
      for (const button of buttons) {
        adjustElementSize(button);
      }

      window.addEventListener("resize", () => {
        const buttons = container.querySelectorAll("button");
        for (const button of buttons) {
          button.style.width = "";
          button.style.height = "";
          adjustElementSize(button);
        }
      });
    }

    hideVariousTextAndButtons(options = getDefaultOptions()) {
      const relatedOptions = [
        options.hideTitle,
        options.hideEpisodeTitle,
        options.hideVariousButtonsInTopRight,
        options.hideSeekBar,
        options.hidePlaybackTime,
        options.hideCenterButtons,
        options.hideNextEpisodeButton,
        options.tweakHideSkipIntroButton,
        options.tweakShowVideoResolutionInfo,
      ];
      const shouldRun = relatedOptions.some((opt) => opt);
      if (!shouldRun) {
        return;
      }

      const targetkeys = ["Control", "Shift"];
      this.player.classList.add("hide-various-text-and-buttons");

      const isEditable = (elem) => {
        return (
          elem &&
          (elem.isContentEditable ||
            /^(input|textarea|select)$/i.test(elem.tagName))
        );
      };

      this.player.addEventListener("keydown", (e) => {
        if (e.repeat || isEditable(e.target)) {
          return;
        }
        if (targetkeys.includes(e.key)) {
          this.player.classList.remove("hide-various-text-and-buttons");
        }
      });

      this.player.addEventListener("keyup", (e) => {
        if (isEditable(e.target)) {
          return;
        }
        if (targetkeys.includes(e.key)) {
          this.player.classList.add("hide-various-text-and-buttons");
        }
      });

      const hideTitle = () => {
        if (!options.hideTitle) {
          return;
        }

        if (!document.querySelector("#ext-hideTitle")) {
          const css = `
          .hide-various-text-and-buttons .atvwebplayersdk-title-text {
            opacity: 0;
          }
          .atvwebplayersdk-title-text.show {
            opacity: 1;
          }
        `;
          addStyle(css, "ext-hideTitle");
        }

        let hideTimer = null;
        this.player.addEventListener("mousemove", (e) => {
          const title = this.player.querySelector(".atvwebplayersdk-title-text");
          if (!title) {
            return;
          }
          if (e.ctrlKey || e.shiftKey) {
            title.classList.add("show");
            if (hideTimer) {
              clearTimeout(hideTimer);
            }
            hideTimer = setTimeout(() => {
              title.classList.remove("show");
            }, 300);
          } else {
            title.classList.remove("show");
          }
        });
      };

      const hideEpisodeTitle = () => {
        if (!options.hideEpisodeTitle) {
          return;
        }

        if (!document.querySelector("#ext-hideEpisodeTitle")) {
          const css = `
          .hide-various-text-and-buttons .atvwebplayersdk-subtitle-text {
            opacity: 0;
          }
          .atvwebplayersdk-subtitle-text.show {
            opacity: 1;
          }
        `;
          addStyle(css, "ext-hideEpisodeTitle");
        }

        let hideTimer = null;
        this.player.addEventListener("mousemove", (e) => {
          const episodeTitle = this.player.querySelector(
            ".atvwebplayersdk-subtitle-text"
          );
          if (!episodeTitle) {
            return;
          }
          if (e.ctrlKey || e.shiftKey) {
            episodeTitle.classList.add("show");
            if (hideTimer) {
              clearTimeout(hideTimer);
            }
            hideTimer = setTimeout(() => {
              episodeTitle.classList.remove("show");
            }, 300);
          } else {
            episodeTitle.classList.remove("show");
          }
        });
      };

      const hideVariousButtonsInTopRight = () => {
        if (!options.hideVariousButtonsInTopRight) {
          return;
        }

        if (!document.querySelector("#ext-hideVariousButtonsInTopRight")) {
          const css = `
          .hide-various-text-and-buttons .atvwebplayersdk-hideabletopbuttons-container {
            opacity: 0;
          }
          .hide-various-text-and-buttons .atvwebplayersdk-closebutton-wrapper {
            opacity: 0;
          }
          .atvwebplayersdk-hideabletopbuttons-container.show {
            opacity: 1;
          }
          .atvwebplayersdk-closebutton-wrapper.show {
            opacity: 1;
          }
        `;
          addStyle(css, "ext-hideVariousButtonsInTopRight");
        }

        let hideTimer = null;
        this.player.addEventListener("mousemove", (e) => {
          const buttonsContainer = this.player.querySelector(
            ".atvwebplayersdk-hideabletopbuttons-container"
          );
          const closeButtonWrapper = this.player.querySelector(
            ".atvwebplayersdk-closebutton-wrapper"
          );
          if (!buttonsContainer || !closeButtonWrapper) {
            return;
          }
          if (e.ctrlKey || e.shiftKey) {
            buttonsContainer.classList.add("show");
            closeButtonWrapper.classList.add("show");
            if (hideTimer) {
              clearTimeout(hideTimer);
            }
            hideTimer = setTimeout(() => {
              buttonsContainer.classList.remove("show");
              closeButtonWrapper.classList.remove("show");
            }, 300);
          } else {
            buttonsContainer.classList.remove("show");
            closeButtonWrapper.classList.remove("show");
          }
        });
      };

      const hideSeekBar = () => {
        if (!options.hideSeekBar) {
          return;
        }

        if (!document.querySelector("#ext-hideSeekBar")) {
          const css = `
          .hide-various-text-and-buttons .atvwebplayersdk-seekbar-container {
            visibility: hidden;
          }
          .atvwebplayersdk-seekbar-container.show {
            visibility: visible;
          }
        `;
          addStyle(css, "ext-hideSeekBar");
        }

        let hideTimer = null;
        this.player.addEventListener("mousemove", (e) => {
          const seekBar = this.player.querySelector(
            ".atvwebplayersdk-seekbar-container"
          );
          if (!seekBar) {
            return;
          }
          if (e.ctrlKey || e.shiftKey) {
            seekBar.classList.add("show");
            if (hideTimer) {
              clearTimeout(hideTimer);
            }
            hideTimer = setTimeout(() => {
              seekBar.classList.remove("show");
            }, 300);
          } else {
            seekBar.classList.remove("show");
          }
        });
      };

      const hidePlaybackTime = () => {
        if (!options.hidePlaybackTime) {
          return;
        }

        if (!document.querySelector("#ext-hidePlaybackTime")) {
          const css = `
          .hide-various-text-and-buttons .atvwebplayersdk-timeindicator-text {
            visibility: hidden;
          }
          .atvwebplayersdk-timeindicator-text.show {
            visibility: visible;
          }
        `;
          addStyle(css, "ext-hidePlaybackTime");
        }

        let hideTimer = null;
        this.player.addEventListener("mousemove", (e) => {
          const timeindicator = this.player.querySelector(
            ".atvwebplayersdk-timeindicator-text"
          );
          if (!timeindicator) {
            return;
          }
          if (e.ctrlKey || e.shiftKey) {
            timeindicator.classList.add("show");
            if (hideTimer) {
              clearTimeout(hideTimer);
            }
            hideTimer = setTimeout(() => {
              timeindicator.classList.remove("show");
            }, 300);
          } else {
            timeindicator.classList.remove("show");
          }
        });
      };

      const hideCenterButtons = () => {
        if (!options.hideCenterButtons) {
          return;
        }

        if (!document.querySelector("#ext-hideCenterButtons")) {
          const css = `
          .hide-various-text-and-buttons .atvwebplayersdk-fastseekback-button {
            visibility: hidden;
          }
          .hide-various-text-and-buttons .atvwebplayersdk-playpause-button {
            visibility: hidden;
          }
          .hide-various-text-and-buttons .atvwebplayersdk-fastseekforward-button {
            visibility: hidden;
          }
          .atvwebplayersdk-fastseekback-button.show {
            visibility: visible;
          }
          .atvwebplayersdk-playpause-button.show {
            visibility: visible;
          }
          .atvwebplayersdk-fastseekforward-button.show {
            visibility: visible;
          }
        `;
          addStyle(css, "ext-hideCenterButtons");
        }

        let hideTimer = null;
        this.player.addEventListener("mousemove", (e) => {
          const centerButtons = this.player.querySelectorAll(
            ".atvwebplayersdk-fastseekback-button, .atvwebplayersdk-playpause-button, .atvwebplayersdk-fastseekforward-button"
          );
          if (!centerButtons.length && centerButtons.length > 3) {
            return;
          }
          if (e.ctrlKey || e.shiftKey) {
            if (!centerButtons[0].classList.contains("show")) {
              for (const btn of centerButtons) {
                btn.classList.add("show");
              }
            }
            if (hideTimer) {
              clearTimeout(hideTimer);
            }
            hideTimer = setTimeout(() => {
              for (const btn of centerButtons) {
                btn.classList.remove("show");
              }
            }, 300);
          } else {
            if (centerButtons[0].classList.contains("show")) {
              for (const btn of centerButtons) {
                btn.classList.remove("show");
              }
            }
          }
        });
      };

      const hideNextEpisodeButton = () => {
        if (!options.hideNextEpisodeButton) {
          return;
        }

        if (!document.querySelector("#ext-hideNextEpisodeButton")) {
          const css = `
          .hide-various-text-and-buttons .atvwebplayersdk-nexttitle-button {
            visibility: hidden;
          }
          .atvwebplayersdk-nexttitle-button.show {
            visibility: visible;
          }
        `;
          addStyle(css, "ext-hideNextEpisodeButton");
        }

        let hideTimer = null;
        this.player.addEventListener("mousemove", (e) => {
          const nextTitleButton = this.player.querySelector(
            ".atvwebplayersdk-nexttitle-button"
          );
          if (!nextTitleButton) {
            return;
          }
          if (e.ctrlKey || e.shiftKey) {
            nextTitleButton.classList.add("show");
            if (hideTimer) {
              clearTimeout(hideTimer);
            }
            hideTimer = setTimeout(() => {
              nextTitleButton.classList.remove("show");
            }, 300);
          } else {
            nextTitleButton.classList.remove("show");
          }
        });
      };

      const tweakHideSkipIntroButton = () => {
        if (!options.hideSkipIntroBtn || !options.tweakHideSkipIntroButton) {
          return;
        }

        if (!document.querySelector("#ext-hideSkipIntroButton")) {
          const css = `
          .atvwebplayersdk-skipelement-button {
            visibility: hidden;
          }
          .atvwebplayersdk-skipelement-button.show {
            visibility: visible;
          }
        `;
          addStyle(css, "ext-hideSkipIntroButton");
        }

        let hideTimer = null;
        this.player.addEventListener("mousemove", (e) => {
          const skipIntroBtn = this.player.querySelector(
            ".atvwebplayersdk-skipelement-button"
          );
          if (!skipIntroBtn) {
            return;
          }
          if (e.ctrlKey || e.shiftKey) {
            skipIntroBtn.classList.add("show");
            if (hideTimer) {
              clearTimeout(hideTimer);
            }
            hideTimer = setTimeout(() => {
              skipIntroBtn.classList.remove("show");
            }, 300);
          } else {
            skipIntroBtn.classList.remove("show");
          }
        });
      };

      const tweakShowVideoResolutionInfo = () => {
        if (
          !options.showVideoResolution_xhook ||
          !options.tweakShowVideoResolutionInfo
        ) {
          return;
        }

        if (!document.querySelector("#ext-hideVideoResolutionInfo")) {
          const css = `
          .hide-various-text-and-buttons .nextup-ext-resolution-info {
            visibility: hidden;
          }
          .nextup-ext-resolution-info.show {
            visibility: visible;
          }
        `;
          addStyle(css, "ext-hideVideoResolutionInfo");
        }

        let hideTimer = null;
        this.player.addEventListener("mousemove", (e) => {
          const resolutionInfo = this.player.querySelector(
            ".nextup-ext-resolution-info"
          );
          if (!resolutionInfo) {
            return;
          }
          if (e.ctrlKey || e.shiftKey) {
            resolutionInfo.classList.add("show");
            if (hideTimer) {
              clearTimeout(hideTimer);
            }
            hideTimer = setTimeout(() => {
              resolutionInfo.classList.remove("show");
            }, 300);
          } else {
            resolutionInfo.classList.remove("show");
          }
        });
      };

      const fnList = [
        hideTitle,
        hideEpisodeTitle,
        hideVariousButtonsInTopRight,
        hideSeekBar,
        hidePlaybackTime,
        hideCenterButtons,
        hideNextEpisodeButton,
        tweakHideSkipIntroButton,
        tweakShowVideoResolutionInfo,
      ];
      for (const fn of fnList) {
        try {
          fn();
        } catch (e) {
          console.log(e);
        }
      }
    }

    forcePlayNextEpisode(options = getDefaultOptions()) {
      if (!options.forcePlayNextEpisode_xhook) {
        return;
      }

      let titleText = null;
      let titleChanged = false;
      let subtitleText = null;
      const subtitleSet = new Set();
      let existsNextEpisode = false;

      let closeBtn;
      let videoClosedByUser = false;

      const getTitleText = () => {
        const title = this.player.querySelector(".atvwebplayersdk-title-text");
        if (!title) {
          return;
        }
        const newTitleText = title.textContent;
        if (!newTitleText) {
          return;
        }
        return newTitleText;
      };

      const getSubtitleText = () => {
        const subtitle = this.player.querySelector(
          ".atvwebplayersdk-subtitle-text"
        );
        if (!subtitle) {
          return;
        }
        const newSubtitleText = subtitle.textContent;
        if (!newSubtitleText) {
          return;
        }
        return newSubtitleText;
      };

      const titleObserver = new MutationObserver((_, observer) => {
        const newTitleText = getTitleText();
        if (!newTitleText) {
          return;
        }
        if (!titleText) {
          titleText = newTitleText;
        } else if (titleText !== newTitleText) {
          titleChanged = true;
          observer.disconnect();
        }
      });

      const videoInfoObserver = new MutationObserver((_) => {
        if (!this.player.classList.contains("dv-player-fullscreen")) {
          return;
        }
        const nextTitleBtn = this.player.querySelector(
          ".atvwebplayersdk-nexttitle-button"
        );
        if (!nextTitleBtn) {
          const newSubtitleText = getSubtitleText();
          if (!newSubtitleText) {
            subtitleText = null;
            existsNextEpisode = false;
          } else if (newSubtitleText !== subtitleText) {
            subtitleText = newSubtitleText;
            subtitleSet.add(newSubtitleText);
            existsNextEpisode = false;
          }
          return;
        }

        const newSubtitleText = getSubtitleText();
        if (!newSubtitleText) {
          return;
        }

        subtitleText = newSubtitleText;
        subtitleSet.add(newSubtitleText);
        existsNextEpisode = true;
      });

      const infobarObserver = new MutationObserver((_, observer) => {
        const infobarContainer = this.player.querySelector(
          ".atvwebplayersdk-infobar-container"
        );
        if (!infobarContainer) {
          return;
        }

        observer.disconnect();

        titleObserver.observe(this.player, {
          ...observeConfig,
          attributes: true,
        });

        videoInfoObserver.observe(infobarContainer, {
          ...observeConfig,
          attributes: true,
        });
      });

      infobarObserver.observe(this.player, {
        ...observeConfig,
        attributes: true,
      });

      const playNextEpisode = () => {
        // This ID is obtained using xhook
        const nextEpisodeId = this.player.dataset.nextEpisodeId;
        delete this.player.dataset.nextEpisodeId;

        if (titleChanged) {
          console.log("Title changed");
          return;
        }
        if (!subtitleText || !existsNextEpisode) {
          console.log("No next episode");
          return;
        }
        if (videoClosedByUser) {
          // close button
          console.log("Video closed by user");
          return;
        }

        // Temporarily darkens the page.
        document.body.style.filter = "brightness(0)";
        setTimeout(() => {
          document.body.style.filter = "";
        }, 2000);

        setTimeout(() => {
          if (videoClosedByUser) {
            // Esc key
            console.log("Video closed by user");
          } else {
            const movePage = () => {
              if (nextEpisodeId && nextEpisodeId !== "null") {
                // If the dv-web-player does not have the next episode preloaded.
                console.log("Play next episode");
                const origin = window.location.origin;
                let url = `${origin}/gp/video/detail/${nextEpisodeId}/?autoplay=1&t=0&play-next-episode`;
                console.log(url);
                const volumeKey = "atvwebplayersdk_volume";
                const volumeStr = localStorage.getItem(volumeKey);
                const volume = parseFloat(volumeStr);
                if (!Number.isNaN(volume)) {
                  url = `${url}&volume=${volumeStr}`;
                }
                localStorage.setItem(volumeKey, "0");
                setTimeout(() => {
                  window.location.href = url;
                }, 200);
              } else {
                console.log(
                  "Either the last episode has already been played or a problem may have occurred."
                );
              }
            };

            const newSubtitleText = getSubtitleText();
            console.log("Target episode", `[${newSubtitleText}]`);
            if (!newSubtitleText) {
              // This pattern if played from a page other than the individual pages of the series
              movePage();
            } else if (!subtitleSet.has(newSubtitleText)) {
              // Expected normal pattern
              const video = this.player.querySelector("video");
              if (!video.hasAttribute("src")) {
                movePage();
              } else {
                console.log("Play next episode");
                this.player.classList.add("dv-player-fullscreen");
                setTimeout(() => {
                  playVideo();
                }, 500);
              }
            } else {
              // If for some reason the video player information is not updated.
              // This pattern sometimes occurs
              movePage();
            }
          }
          document.body.style.filter = "";
        }, 1500);
      };

      const closeBtnClicked = (e) => {
        if (!e) {
          return;
        }
        videoClosedByUser = true;
      };

      const closeBtnObserver = new MutationObserver((_, observer) => {
        const _closeBtn = this.player.querySelector(
          ".atvwebplayersdk-playerclose-button"
        );
        if (!_closeBtn) {
          return;
        }
        closeBtn = _closeBtn;
        closeBtn.addEventListener("click", closeBtnClicked);
      });

      closeBtnObserver.observe(this.player, {
        ...observeConfig,
        attributes: true,
      });

      const escPressed = (e) => {
        if (!e) {
          return;
        }
        if (e.key !== "Escape") {
          return;
        }
        setTimeout(() => {
          videoClosedByUser = !this.player.classList.contains(
            "dv-player-fullscreen"
          );
        }, 500);
      };

      document.body.addEventListener("keydown", escPressed);

      new MutationObserver((_, outerObserver) => {
        if (!this.player.classList.contains("dv-player-fullscreen")) {
          outerObserver.disconnect();
          infobarObserver.disconnect();
          titleObserver.disconnect();
          videoInfoObserver.disconnect();

          closeBtnObserver.disconnect();
          closeBtn.removeEventListener("click", closeBtnClicked);
          setTimeout(() => {
            document.body.removeEventListener("keydown", escPressed);
          }, 800);

          playNextEpisode();

          new MutationObserver((_, observer) => {
            if (this.player.classList.contains("dv-player-fullscreen")) {
              observer.disconnect();
              this.forcePlayNextEpisode(options);
            }
          }).observe(this.player, {
            attributes: true,
            attributeFilter: ["class"],
          });
        }
      }).observe(this.player, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }
  }

  const restoreVolume = (video, url) => {
    const searchParams = new URL(url).searchParams;
    if (
      searchParams.has("autoplay") &&
      searchParams.has("play-next-episode") &&
      searchParams.has("volume")
    ) {
      const volumeStr = searchParams.get("volume");
      const volume = parseFloat(volumeStr);
      if (!Number.isNaN(volume)) {
        video.volume = volume;
        localStorage.setItem("atvwebplayersdk_volume", volume);
        console.log("Volume restored", volumeStr);
      }
    }
  };

  const main = async () => {
    try {
      await migrateStorage();
    } catch (e) {
      console.log(e);
    }

    const scriptInfo = ScriptInfo.get();
    await updateOptionVersion(scriptInfo);

    const options = await getOptions();
    const url = window.location.href;
    let canRunXhook = true;
    let isFirstPlayer = true;
    let canRestoreVolume = true;

    new MutationObserver((_) => {
      const players = document.querySelectorAll(
        "[id^='dv-web-player']:not([data-detected-from-nextup-ext='true'])"
      );
      players.forEach(async (player) => {
        player.dataset.detectedFromNextupExt = "true";

        if (canRunXhook) {
          canRunXhook = false;
          try {
            injectXhook(options);
          } catch (e) {
            console.log(e);
          }
        }

        const controller = new ElementController(player);

        try {
          controller.changeOrderOfVideoElements(options);
        } catch (e) {
          console.log(e);
        }

        try {
          controller.createOptionBtn();
        } catch (e) {
          console.log(e);
        }

        if (isFirstPlayer) {
          isFirstPlayer = false;
          try {
            createOptionBtnOnNavbar();
          } catch (e) {
            console.log(e);
          }

          try {
            await createOptionDialog(scriptInfo.scriptVersion);
          } catch (e) {
            console.log(e);
          }

          try {
            createUserScriptMenu();
          } catch (e) {
            console.log(e);
          }

          // The shortcut keys for opening the dialog will only work if the video is open.
          addEventListenerForShortcutKey(options);
        }

        new MutationObserver((_, observer) => {
          controller.markingCenterOverlaysWrapper();

          const video = player.querySelector("video");
          if (!video?.checkVisibility()) {
            return;
          }

          observer.disconnect();

          try {
            controller.markingToIdentifyNonDarkeningOverlays();
          } catch (e) {
            console.log(e);
          }

          if (canRestoreVolume) {
            canRestoreVolume = false;
            try {
              // If autoplay is forced, restore volume as needed.
              restoreVolume(video, url);
            } catch (e) {
              console.log(e);
            }
          }

          try {
            controller.skipAds(options);
          } catch (e) {
            console.log(e);
          }

          try {
            controller.hideSkipIntroBtn(options);
          } catch (e) {
            console.log(e);
          }

          try {
            controller.hideNextupCard(options);
          } catch (e) {
            console.log(e);
          }

          try {
            controller.hideReactions(options);
          } catch (e) {
            console.log(e);
          }

          try {
            controller.hideRecommendations(options);
          } catch (e) {
            console.log(e);
          }

          try {
            controller.hideRatingText(options);
          } catch (e) {
            console.log(e);
          }

          try {
            controller.preventsDarkening(options);
          } catch (e) {
            console.log(e);
          }

          try {
            controller.moveCenterButtonsToBottom(options);
          } catch (e) {
            console.log(e);
          }

          try {
            controller.hideVariousTextAndButtons(options);
          } catch (e) {
            console.log(e);
          }

          try {
            controller.forcePlayNextEpisode(options);
          } catch (e) {
            console.log(e);
          }
        }).observe(player, observeConfig);
      });
    }).observe(document, observeConfig);
  };

  main();

})();
