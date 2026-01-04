// ==UserScript==
// @name         暑期学习专用脚本
// @namespace    1.0
// @version      1.1
// @description  学习公社自动看视频、自动刷新,自动跳过防疲劳
// @author       LLL
// @match        *study.enaea.edu.cn/viewerforccvideo*
// @match        https://core.teacher.vocational.smartedu.cn/*
// @match        *study.enaea.edu.cn/circleIndexRedirect*
// @grant        none
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/544284/%E6%9A%91%E6%9C%9F%E5%AD%A6%E4%B9%A0%E4%B8%93%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/544284/%E6%9A%91%E6%9C%9F%E5%AD%A6%E4%B9%A0%E4%B8%93%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==



(function () {
  let lastVideoSrc = null;

  /* ===============================
   * 工具函数：获取 video 元素
   * =============================== */
  function getVideo() {
    const iframe = document.querySelector('iframe');
    return iframe?.contentDocument?.querySelector('video') || document.querySelector('video');
  }

  /* ===============================
   * 自动跳过已完成的章节
   * =============================== */
  function autoSkipCompleted() {
    const items = document.querySelectorAll('.cvtb-MCK-CsCt-chapterItem');
    for (let i = 0; i < items.length; i++) {
      const progress = items[i].querySelector('.cvtb-MCK-CsCt-studyProgress');
      if (!progress || progress.textContent.trim() !== '100%') {
        items[i].click();
        console.log(`👉 跳过已完成章节，进入第 ${i + 1} 个未完成的`);
        return;
      }
    }
    console.log('✅ 所有章节已完成');
  }

  /* ===============================
   * 主逻辑：处理每个新加载的视频
   * =============================== */
  function handleNewVideo(v) {
    if (!v) return;

    console.log('📌 检测到新视频，开始注入逻辑');

    // 自动播放 + 静音 + 倍速
    v.muted = true;
    v.playbackRate = 2;
    v.play().catch(() => {});

    // 2 秒后检查当前章节是否已完成
    setTimeout(() => {
      const progress = document.querySelector('.current .cvtb-MCK-CsCt-studyProgress');
      if (progress && progress.textContent.trim() === '100%') {
        autoSkipCompleted();
      }
    }, 2000);

    /* ===============================
     * 定时任务：弹窗关闭 + 自动下一节
     * =============================== */
    const modalInterval = setInterval(() => {
      const modal = document.querySelector('.ant-modal-content');
      if (modal && modal.innerText.includes('已学完本资源')) {
        const btn = modal.querySelector('.ant-btn-primary');
        if (btn) {
          console.log('🎯 关闭“已学完”弹窗');
          btn.click();
        }
      }
    }, 2000);

    const nextInterval = setInterval(() => {
      if (v.currentTime >= v.duration - 1) {
        const noModal = !document.querySelector('.ant-modal-content');
        if (noModal) {
          const nextBtn = [...document.querySelectorAll('button, span, a')].find(el =>
            /继续学习|下一节|确定|next|continue|学下一课/i.test(el.textContent.trim())
          );
          if (nextBtn) {
            console.log('👉 自动点击“继续学习”/“下一节”');
            nextBtn.click();
            clearInterval(nextInterval);
            clearInterval(modalInterval);
          }
        }
      }
    }, 3000);
  }

  /* ===============================
   * 启动入口：每 1 秒检测是否换了视频
   * =============================== */
  setInterval(() => {
    const v = getVideo();
    if (v && v.src !== lastVideoSrc) {
      lastVideoSrc = v.src;
      handleNewVideo(v);
    }
  }, 1000);


/* ===============================
 * 后台保活：防止最小化暂停
 * =============================== */
function keepAlive() {
  const v = getVideo();
  if (!v) return;

  // 每 10 秒强制继续播放
  setInterval(() => {
    if (v.paused) {
      v.play().catch(() => {});
      console.log('🔁 后台保活：强制恢复播放');
    }
  }, 10000);

  // 页面可见性变化（最小化/切回）
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      v.play().catch(() => {});
      console.log('🔁 页面恢复可见，重新播放');
    }
  });

  // 模拟用户活动：每 30 秒一次
  setInterval(() => {
    document.dispatchEvent(new MouseEvent('mousemove', {
      clientX: 100 + Math.random() * 200,
      clientY: 100 + Math.random() * 200,
    }));
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  }, 30000);
}

// 启动保活
keepAlive();
})();