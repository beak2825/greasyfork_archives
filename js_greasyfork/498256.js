// ==UserScript==
// @name        tame Zhifa315
// @namespace   Violentmonkey Scripts

// @match       https://wuxishi.zhifa315.com/*

// @grant       none
// @version     0.0.1
// @author      someone
// @license     MIT
// @description tame Wuxi Zhifa315

// @run-at      document-idle

// @grant       window.close
// @grant       window.focus

// @downloadURL https://update.greasyfork.org/scripts/498256/tame%20Zhifa315.user.js
// @updateURL https://update.greasyfork.org/scripts/498256/tame%20Zhifa315.meta.js
// ==/UserScript==

// 学习任务页面
if (location.pathname.startsWith('/mytask/')) {
  // 载入数据有延迟
  const openFirstLearning = setInterval(() => {
    const courseItems = document.getElementsByClassName('courseItem___2sUwU');
    if (courseItems.length > 0) {
      clearInterval(openFirstLearning);
      for (let c of courseItems) {
        // 获取学习进度
        const progress = c.querySelector('.ant-progress-bg').style.width;
        if (progress === '100%') continue;
        // 远程获取课程数据需要随机令牌，故简单粗暴解决
        c.querySelector('.learnBtn___2QGnS').click();
        // 控制是否批量打开，取决于是否能破解学习任务不允许打开多个窗口的系统限制
        break;
      }
    }
    localStorage.setItem('learnStatus', 'begin');
    window.addEventListener('storage', (e) => {
      console.info(e.newValue);
      // 学完一课刷新一次页面
      if (e.newValue === 'end') {
        location.reload();
      }
    });
  }, 1000);
}

// 课程播放页面
if (location.pathname.startsWith('/learn/')) {
  // 最长课时后关闭页面
  setTimeout(() => {
    window.close();
  }, 4.5 * 60 * 60 * 1000);

  let focusTime = 0;
  setInterval(() => {
    if (document.querySelectorAll('video').length === 1) {
      if (focusTime === 0) {
        window.focus();
        focusTime++;
      }
      const course_player = document.querySelector('video');
      course_player.muted = true;
      if (course_player.paused) {
        course_player.play();
      }

      if (document.querySelectorAll('.ant-btn.ant-btn-primary').length > 0) {
        const antAlertText = document.querySelector('.ant-modal-body').textContent;
        console.info(antAlertText);
        if (antAlertText === '信息提示学习任务不允许打开多个窗口知道了') {
          // 强行删除相关元素可以维持课程播放但基本不计时
          // document.querySelector('.ant-modal-root').remove();
          // document.querySelector('video').play();
          localStorage.setItem('learnStatus', 'end');
          window.close();
        } else if (
          antAlertText === '由于您离开页面，视频已暂停播放。' ||
          antAlertText === '该学习任务已经学习完成确 定'
        ) {
          // 必须放在多窗口代码块下方否则会被阻塞
          document.querySelector('.ant-btn.ant-btn-primary').click();
        }
      }

      if (document.querySelector('li[class^="active"]').textContent.endsWith('【已学完】')) {
        let finishedCount = 0;
        for (let i of document.querySelectorAll('div[class^="mainRight"] li[class^="normal"]')) {
          if (!i.textContent.endsWith('【已学完】')) {
            i.click();
          } else {
            finishedCount++;
          }
        }
        if (
          finishedCount ===
          document.querySelectorAll('div[class^="mainRight"] li[class^="normal"]').length
        ) {
          localStorage.setItem('learnStatus', 'end');
          console.info('当前课程已经完成');
          window.close();
        }
      }
    }
  }, 1000);
}
