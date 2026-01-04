// ==UserScript==
// @name               Auto play ads on ani.gamer.com.tw, danmu time jump
// @name:zh-CN         动画疯自动播放广告，弹幕时间空降
// @name:zh-TW         動畫瘋自動播放廣告，彈幕時間空降
// @namespace          ling921
// @version            0.9.0
// @description        Agree to age prompt, auto skip ads when time is up, auto play next video, and register some keyboard shortcuts (see the release notes below for details)
// @description:zh-CN  自动同意年龄提示，到达时间后自动跳过广告(内置播放器广告和两种 google iframe 广告)，自动播放下一集，并注册一些快捷键（详见最下方的更新日志）
// @description:zh-TW  自動同意年齡提示，到達時間後自動跳過廣告(內置播放器廣告和兩種 google iframe 廣告)，自動播放下一集，並註冊一些快捷鍵（詳見最下方的更新日誌）
// @author             ling921
// @match              https://ani.gamer.com.tw/animeVideo.php*
// @match              https://*.safeframe.googlesyndication.com/*
// @match              https://imasdk.googleapis.com/*
// @icon               http://gamer.com.tw/favicon.ico
// @grant              none
// @run-at             document-idle
// @tag                video
// @tag                anime
// @tag                utilities
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/520712/Auto%20play%20ads%20on%20anigamercomtw%2C%20danmu%20time%20jump.user.js
// @updateURL https://update.greasyfork.org/scripts/520712/Auto%20play%20ads%20on%20anigamercomtw%2C%20danmu%20time%20jump.meta.js
// ==/UserScript==

/**
 * Global variable to store video player
 * @type {HTMLVideoElement}
 */
var videoPlayer;

/**
 * Localization text
 */
const i18n = {
  'en': {
    'addEventListenerToPlayer': '🎮 Yay! Connected to the video player~',
    'autoPlayNext': '⏭️ Whoosh~ Auto-jumping to next episode!',
    'agreeAgePrompt': '✨ Of course I\'m old enough! *wink*',
    'skipAds': '🚀 Bye bye ads~ Moving to the good stuff!',
    'dismissDialog': '🎯 Poof! Dialog ad vanished!',
    'dismissButtonHidden': '👀 Hmm... waiting for the dismiss button to show up...',
    'dismissButtonNotFound': '🤔 Eh? Can\'t find the dismiss button anywhere...',
    'skipAdButton': '⚡ Zap! Skipping this ad!',
    'noPlayButton': '😱 Oh no! Can\'t find the play button...',
    'noPrevButton': '⚠️ Oopsie! Previous episode button is missing...',
    'noNextButton': '⚠️ Uh-oh! Next episode button is nowhere to be found...',
    'noDanmuButton': '💬 Ara ara~ Danmu button is hiding...',
    'noTheaterButton': '🎭 Theater mode button seems to be on vacation...',
    'noFullscreenButton': '📺 The fullscreen button is playing hide and seek...',
    'noVideoPlayer': '📼 Eh?! Where did the video player go?',
    'pauseOrPlay': '⏯️ Boop~ Toggling play state!',
    'gotoPrev': '⏮️ Time travel to previous episode!',
    'gotoNext': '⏭️ Leaping to next episode~',
    'toggleDanmu': '💫 Whoosh~ Danmu rain on/off!',
    'toggleTheater': '🎪 Poof~ Theater mode switch!',
    'toggleFullscreen': '🌟 Maximum screen power!',
    'volumeUp': '🔊 Turning up the volume~',
    'volumeDown': '🔉 Making things a bit quieter...',
    'seekBackward': '⏪ Rewinding time~',
    'seekForward': '⏩ Fast forward go brrr!',
    'clickContinue': '✨ Yes yes, continue playing~',
    'videoStuck': '⚠️ Video seems stuck, trying to resume...',
    'resumeFailed': '😢 Oops! Failed to resume playback:',
    'muteAds': '🔇 Shh~ Muting all ad videos~',
    'videoError': '⚠️ Video error detected, refreshing page...'
  },
  'zh-CN': {
    'addEventListenerToPlayer': '🎮 哇！成功连接到播放器啦~',
    'autoPlayNext': '⏭️ 咻咻咻~ 自动跳转下一集！',
    'agreeAgePrompt': '✨ 当然已经成年啦！*眨眼*',
    'skipAds': '🚀 白白啦广告君~ 马上就能看番啦！',
    'dismissDialog': '🎯 啪！广告框框消失啦！',
    'dismissButtonHidden': '👀 诶嘿~等待关闭按钮出现中...',
    'dismissButtonNotFound': '🤔 咦？找不到关闭按钮呢...',
    'skipAdButton': '⚡ 唰！跳过广告！',
    'noPlayButton': '😱 呜哇！找不到播放按钮...',
    'noPrevButton': '⚠️ 糟糕！上一集按钮不见了...',
    'noNextButton': '⚠️ 哎呀！下一集按钮去哪了...',
    'noDanmuButton': '💬 啊啦啦~ 弹幕按钮躲起来了...',
    'noTheaterButton': '🎭 剧场模式按钮去度假了...',
    'noFullscreenButton': '📺 全屏按钮在玩捉迷藏...',
    'noVideoPlayer': '📼 诶诶？！播放器君去哪了？',
    'pauseOrPlay': '⏯️ 啵~ 切换播放状态！',
    'gotoPrev': '⏮️ 时光倒流到上一集！',
    'gotoNext': '⏭️ 飞速跳转下一集~',
    'toggleDanmu': '💫 唰~ 弹幕开关切换！',
    'toggleTheater': '🎪 啪~ 剧场模式变身！',
    'toggleFullscreen': '🌟 全屏模式启动！',
    'volumeUp': '🔊 调大音量中~',
    'volumeDown': '🔉 轻声轻声模式...',
    'seekBackward': '⏪ 时光倒流中~',
    'seekForward': '⏩ 快进冲鸭！',
    'clickContinue': '✨ 好哒好哒，继续播放~',
    'videoStuck': '⚠️ 检测到视频卡住，尝试恢复播放...',
    'resumeFailed': '😢 哎呀！恢复播放失败:',
    'muteAds': '🔇 嘘~ 已将广告视频静音~',
    'videoError': '⚠️ 检测到视频错误，刷新页面...'
  },
  'zh-TW': {
    'addEventListenerToPlayer': '🎮 哇！成功連接到播放器啦~',
    'autoPlayNext': '⏭️ 咻咻咻~ 自動跳轉下一集！',
    'agreeAgePrompt': '✨ 當然已經成年啦！*眨眼*',
    'skipAds': '🚀 掰掰啦廣告君~ 馬上就能看番啦！',
    'dismissDialog': '🎯 啪！廣告框框消失啦！',
    'dismissButtonHidden': '👀 誒嘿~等待關閉按鈕出現中...',
    'dismissButtonNotFound': '🤔 咦？找不到關閉按鈕呢...',
    'skipAdButton': '⚡ 唰！跳過廣告！',
    'noPlayButton': '😱 嗚哇！找不到播放按鈕...',
    'noPrevButton': '⚠️ 糟糕！上一集按鈕不見了...',
    'noNextButton': '⚠️ 哎呀！下一集按鈕去哪了...',
    'noDanmuButton': '💬 啊啦啦~ 彈幕按鈕躲起來了...',
    'noTheaterButton': '🎭 劇場模式按鈕去度假了...',
    'noFullscreenButton': '📺 全螢幕按鈕在玩捉迷藏...',
    'noVideoPlayer': '📼 誒誒？！播放器君去哪了？',
    'pauseOrPlay': '⏯️ 啵~ 切換播放狀態！',
    'gotoPrev': '⏮️ 時光倒流到上一集！',
    'gotoNext': '⏭️ 飛速跳轉下一集~',
    'toggleDanmu': '💫 唰~ 彈幕開關切換！',
    'toggleTheater': '🎪 啪~ 劇場模式變身！',
    'toggleFullscreen': '🌟 全螢幕模式啟動！',
    'volumeUp': '🔊 調大音量中~',
    'volumeDown': '🔉 輕聲輕聲模式...',
    'seekBackward': '⏪ 時光倒流中~',
    'seekForward': '⏩ 快進衝鴨！',
    'clickContinue': '✨ 好啦好啦，繼續播放~',
    'videoStuck': '⚠️ 檢測到視頻卡住，嘗試恢復播放...',
    'resumeFailed': '😢 哎呀！恢復播放失敗:',
    'muteAds': '🔇 噓~ 已將廣告視頻靜音~',
    'videoError': '⚠️ 檢測到視頻錯誤，刷新頁面...'
  }
};

/**
 * Get user language and match the most suitable translation
 * @returns {string} - The language
 */
function getUserLanguage() {
  const lang = navigator.language;
  if (lang.startsWith("en")) return "en";
  if (lang === "zh-CN") return "zh-CN";
  return "zh-TW"; // Default to Traditional Chinese
}

/**
 * Get localized text
 * @param {string} key - The key
 * @returns {string} - The text
 */
function t(key) {
  const lang = getUserLanguage();
  return i18n[lang][key] || i18n["zh-TW"][key];
}

(function () {
  "use strict";

  // Handle top level window
  if (window === window.top) {
    videoPlayer = document.querySelector("#ani_video_html5_api");
    if (videoPlayer) {
      console.log(t("addEventListenerToPlayer"));
      // Auto unmute video player
      videoPlayer.addEventListener("loadstart", () => {
        videoPlayer.muted = false;
      });
      // Auto play next video
      videoPlayer.addEventListener("ended", () => {
        const nextButton = document.querySelector(".vjs-next-button");
        if (nextButton) {
          console.log(t("autoPlayNext"));
          nextButton.click();
        }
      });
    }

    // Attempt to play video
    attemptToPlayVideo();

    // Register keyboard shortcuts
    registerKeyboardShortcuts(document);

    // Define observer to execute functions when DOM changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          removeInsTag(node);
          linkDanmuTime(node);
        });
      });
      agreeAgePrompt();
      removeTitleAds();
      handleVideoPlayerAds();
      ensureShortcutTitles();
      refreshPageWhenVideoError();
    });

    // Start observing the body for changes
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
  // Handle iframe window
  else {
    if (window.location.href.includes("safeframe.googlesyndication.com")) {
      const observer = new MutationObserver(() => {
        handleIframeAds(document);
        muteAllVideos(document);
      });
      observer.observe(document.body, { childList: true, subtree: true });
    } else if (window.location.href.includes("imasdk.googleapis.com")) {
      const observer = new MutationObserver(() => {
        handleIframeAds2(document);
        muteAllVideos(document);
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
})();

/**
 * Attempt to play video
 */
function attemptToPlayVideo() {
  setInterval(() => {
    const playButton = document.querySelector(".vjs-play-control");
    if (playButton && playButton.classList.contains("vjs-playing") && videoPlayer.readyState === 2) {
      console.log(t('videoStuck'));
      videoPlayer.pause();
      videoPlayer.play().catch((err) => console.error(t('resumeFailed'), err));
    }
  }, 300);
}

/**
 * Register keyboard shortcuts
 * @param {Document} doc - The document
 */
function registerKeyboardShortcuts(doc) {
  doc.addEventListener("keydown", (event) => {
    // Ignore input fields event propagation
    if (
      event.target.tagName === "INPUT" ||
      event.target.tagName === "TEXTAREA" ||
      event.target.isContentEditable
    ) {
      return;
    }

    if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
      /**
       * Get the document of the event target
       * @type {Document}
       */
      const _doc = event.target.ownerDocument || doc;

      // P pause or play
      if (event.key === "p") {
        const playButton = _doc.querySelector(".vjs-play-control");
        if (playButton) {
          console.log(t("pauseOrPlay"));
          playButton.click();
        } else {
          console.log(t("noPlayButton"));
        }
      }
      // [ goes to previous video
      else if (event.key === "[") {
        const prevButton = _doc.querySelector(".vjs-pre-button");
        if (prevButton) {
          console.log(t("gotoPrev"));
          prevButton.click();
        } else {
          console.log(t("noPrevButton"));
        }
      }
      // ] goes to next video
      else if (event.key === "]") {
        const nextButton = _doc.querySelector(".vjs-next-button");
        if (nextButton) {
          console.log(t("gotoNext"));
          nextButton.click();
        } else {
          console.log(t("noNextButton"));
        }
      }
      // D enable or disable danmu
      else if (event.key === "d") {
        const danmuButton = _doc.querySelector(
          ".vjs-danmu-button .vjs-menu-button"
        );
        if (danmuButton) {
          console.log(t("toggleDanmu"));
          danmuButton.click();
        } else {
          console.log(t("noDanmuButton"));
        }
      }
      // T enter or exit theater mode
      else if (event.key === "t") {
        const theaterButton = _doc.querySelector(".vjs-indent-button");
        if (theaterButton) {
          console.log(t("toggleTheater"));
          theaterButton.click();
        } else {
          console.log(t("noTheaterButton"));
        }
      }
      // F enter or exit fullscreen
      else if (event.key === "f") {
        const fullscreenButton = _doc.querySelector(".vjs-fullscreen-control");
        if (fullscreenButton) {
          console.log(t("toggleFullscreen"));
          fullscreenButton.click();
        } else {
          console.log(t("noFullscreenButton"));
        }
      }
      // Video player control
      else if (!event.target.closest("video-js")) {
        const dispatchEvent = (eventType) => {
          videoPlayer.dispatchEvent(
            new KeyboardEvent(eventType, {
              key: event.key,
              code: event.code,
              keyCode: event.keyCode,
              which: event.which,
              bubbles: true,
              cancelable: true,
              composed: true,
              isTrusted: true,
            })
          );
        };

        // ↑ video volume up
        if (event.key === "ArrowUp") {
          if (videoPlayer) {
            if (videoPlayer.volume < 1) {
              event.preventDefault();
              console.log(t("volumeUp"));
              dispatchEvent("keydown");
            }
          } else {
            console.log(t("noVideoPlayer"));
          }
        }
        // ↓ video volume down
        else if (event.key === "ArrowDown") {
          if (videoPlayer) {
            if (videoPlayer.volume > 0) {
              event.preventDefault();
              console.log(t("volumeDown"));
              dispatchEvent("keydown");
            }
          } else {
            console.log(t("noVideoPlayer"));
          }
        }
        // ← video backward
        else if (event.key === "ArrowLeft") {
          if (videoPlayer) {
            if (videoPlayer.currentTime > 0) {
              event.preventDefault();
              console.log(t("seekBackward"));
              dispatchEvent("keydown");
            }
          } else {
            console.log(t("noVideoPlayer"));
          }
        }
        // → video forward
        else if (event.key === "ArrowRight") {
          if (videoPlayer) {
            if (videoPlayer.currentTime < videoPlayer.duration) {
              event.preventDefault();
              console.log(t("seekForward"));
              dispatchEvent("keydown");
            }
          } else {
            console.log(t("noVideoPlayer"));
          }
        }
      }
    }
  });
}

/**
 * Agree to age prompt
 */
function agreeAgePrompt() {
  const agePrompt = document.querySelector("button.choose-btn-agree#adult");
  if (agePrompt) {
    agePrompt.click();
    console.log(t("agreeAgePrompt"));
  }
}

/**
 * Remove <ins> tag
 * @param {Node} node - The node
 */
function removeInsTag(node) {
  if (
    node instanceof Element &&
    node.tagName === "INS" &&
    node.parentNode === document.documentElement
  ) {
    node.remove();
  }
}

/**
 * Remove ads in title
 */
function removeTitleAds() {
  const titleAds = document.querySelectorAll('[id^="div-gpt-ad-"]');
  titleAds.forEach((ad) => {
    ad.remove();
  });
}

/**
 * Handle ads in video player
 */
function handleVideoPlayerAds() {
  const skipButton = document.querySelector("#adSkipButton");
  if (skipButton) {
    if (skipButton.classList.contains("enable")) {
      console.log(t("skipAds"));
      skipButton.click();
    } else {
      videoPlayer.muted = true;
    }
  }

  const skipButton2 = document.querySelector(".nativeAD-skip-button.enable");
  if (skipButton2 && !skipButton2.classList.contains("vjs-hidden")) {
    console.log(t("skipAds"));
    skipButton2.click();
  }
}

/**
 * Ensure shortcut titles
 */
function ensureShortcutTitles() {
  /**
   * Ensure title ends with text
   * @param {Element|null} element - The element
   * @param {string} text - The text
   */
  function ensureTitleEndsWith(element, text) {
    if (!element) {
      return;
    }
    const title = element.getAttribute("title");
    if (!title) {
      element.setAttribute("title", text);
    } else if (!title.endsWith(text)) {
      element.setAttribute("title", title + " " + text);
    }
  }

  // Play button
  ensureTitleEndsWith(document.querySelector(".vjs-play-control"), "(P)");
  // Previous button
  ensureTitleEndsWith(document.querySelector(".vjs-pre-button"), "([)");
  // Next button
  ensureTitleEndsWith(document.querySelector(".vjs-next-button"), "(])");
  // Danmu button
  ensureTitleEndsWith(document.querySelector(".vjs-danmu-button"), "(D)");
  // Theater button
  ensureTitleEndsWith(document.querySelector(".vjs-indent-button"), "(T)");
  // Fullscreen button
  ensureTitleEndsWith(document.querySelector(".vjs-fullscreen-control"), "(F)");
}

/**
 * Refresh page when video error
 */
function refreshPageWhenVideoError() {
  const errorDisplay = document.querySelector(".video .vjs-error-display");
  if (errorDisplay && !errorDisplay.classList.contains("vjs-hidden")) {
    console.log(t("videoError"));
    location.reload();
  }
}

/**
 * Link danmu time
 * @param {Node} node - The node
 */
function linkDanmuTime(node) {
  if (node && node.nodeName === "LI" && node.classList.contains("sub-list-li")) {
    const time = node.querySelector("div>b");    // format: 0:00:01
    if (time) {
      time.style.cursor = "pointer";
      time.addEventListener("click", () => {
        videoPlayer.currentTime = parseTime(time.textContent);
      });
    }
    const danmu = node.querySelector(".sub_content span");
    if (danmu) {
      // Find time format 0:00:01 or 00:01 (may multiple)
      const timeRegex = /(\d+:)?[0-5]?\d:[0-5]\d/g;
      const text = danmu.textContent;
      const matches = text.match(timeRegex);
      
      if (matches) {
        // Clear existing content
        danmu.textContent = '';
        
        // Split text by time matches and create elements
        let lastIndex = 0;
        matches.forEach(match => {
          const matchIndex = text.indexOf(match, lastIndex);
          
          // Add text before the time
          if (matchIndex > lastIndex) {
            danmu.appendChild(document.createTextNode(text.substring(lastIndex, matchIndex)));
          }
          
          // Create clickable span for time
          const span = document.createElement("span");
          span.textContent = match;
          span.style.cursor = "pointer";
          span.addEventListener("click", () => {
            videoPlayer.currentTime = parseTime(match);
          });
          danmu.appendChild(span);
          
          lastIndex = matchIndex + match.length;
        });
        
        // Add remaining text after last time
        if (lastIndex < text.length) {
          danmu.appendChild(document.createTextNode(text.substring(lastIndex)));
        }
      }
    }
  }
}

/**
 * Parse time
 * @param {string} time - The time, format: 0:00:01 or 00:01
 * @returns {number} - The seconds
 */
function parseTime(time) {
  const timeParts = time.split(":");
  if (timeParts.length === 2) {
    return parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
  } else if (timeParts.length === 3) {
    return parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseInt(timeParts[2]);
  }
  return 0;
}

/**
 * Handle ads in iframe
 * @param {Document} doc - The iframe document
 */
function handleIframeAds(doc) {
  // Handle continue button
  const resumeButton =
    doc.querySelector(".rewardResumebutton") ||
    doc.querySelector("#resume_video_button");
  if (resumeButton) {
    console.log(t("clickContinue"));
    resumeButton.click();
  }

  // Handle ad dismiss button (1)
  const adsCountDown = doc.querySelector("#count-down-text");
  if (adsCountDown) {
    const dismissDialog = () => {
      const dismissButton = doc.querySelector("#card #dismiss-button-element");
      if (dismissButton) {
        if (dismissButton.style.display !== "none") {
          console.log(t("dismissDialog"));
          dismissButton.click();
        } else {
          console.log(t("dismissButtonHidden"));
        }
      } else {
        console.log(t("dismissButtonNotFound"));
      }
    };
    if (adsCountDown.offsetParent === null) {
      dismissDialog();
    } else if (adsCountDown.textContent === "1 秒後即可獲得獎勵") {
      setTimeout(dismissDialog, 1000);
    }
  }

  // Handle ad dismiss button (2)
  const countDown = doc.querySelector("#count_down");
  if (countDown && countDown.textContent === "0 秒後可獲獎勵") {
    // Handle continue button
    const resumeButton =
      doc.querySelector(".rewardResumebutton") ||
      doc.querySelector("#resume_video_button");
    if (resumeButton) {
      console.log(t("clickContinue"));
      resumeButton.click();
    }
    const closeButton = doc.querySelector("#close_button");
    if (closeButton) {
      console.log(t("dismissDialog"));
      closeButton.click();
    }
  }

  // Handle skip ad button
  const skipButton = doc.querySelector(".videoAdUiSkipButton");
  if (skipButton && !skipButton.classList.contains("videoAdUiHidden")) {
    console.log(t("skipAds"));
    skipButton.click();
  }
}

/**
 * Handle ads in iframe
 * @param {Document} doc - The iframe document
 */
function handleIframeAds2(doc) {
  const skipButton = doc.querySelector('[aria-label="Skip Ad"]');
  if (skipButton) {
    if (skipButton.textContent === "Skip Ad") {
      console.log(t("skipAdButton"));
      skipButton.click();
    } else {
      videoPlayer.muted = true;
    }
  }
}

/**
 * Mute all videos in document
 * @param {Document} doc - The document
 */
function muteAllVideos(doc) {
  const videos = doc.querySelectorAll('video');
  if (videos.length > 0) {
    videos.forEach(video => {
      video.muted = true;
    });
    console.log(t('muteAds'));
  }
}

// Release notes
// 2025-01-25 version 0.9.0
// - 新增播放錯誤時自動刷新頁面
// - 新增彈幕時間識別和點擊跳轉

// 2024-12-29 version 0.8.0
// - 再次優化廣告跳過邏輯
// - 新增廣告自動靜音
// - 新增視頻卡住時自動恢復播放

// 2024-12-29 version 0.7.0
// - 優化 safeframe.googlesyndication.com 的廣告跳過邏輯

// 2024-12-23 version 0.6.0
// - 新增日誌本地化支援
// - 修改日誌描述文本

// 2024-12-18 version 0.5.0
// - 新增自動播放下一集
// - 完善頁面快速鍵相關按鈕的 title 屬性

// 2024-12-16 version 0.4.0
// - 規範版本號

// 2024-12-16 version 0.3
// - 註冊快速鍵 ↑ ↓ ← → 分別控制音量、時間軸
// - 註冊快捷鍵 D 控制彈幕

// 2024-12-15 version 0.2
// - 新增標籤 video, anime, utilities

// 2024-12-14 version 0.1
// - 自動同意年齡確認
// - 廣告倒計時結束結束自動跳過廣告
// - 播放廣告時靜音，播放影片時取消靜音
// - 註冊快捷鍵 [ 和 ] 分別跳到上一個和下一個視頻
// - 註冊快速鍵 P 暫停或播放
// - 註冊快速鍵 T 進入或退出劇院模式
// - 註冊快速鍵 F 進入或退出全螢幕
