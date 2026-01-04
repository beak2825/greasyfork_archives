// ==UserScript==
// @name        tame 59iedu
// @namespace   Violentmonkey Scripts
// @match       https://jswxgk.59iedu.com/*
// @grant       window.close
// @version     1.2.0
// @author      someone
// @description tame jswxgk 59iedu
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/427836/tame%2059iedu.user.js
// @updateURL https://update.greasyfork.org/scripts/427836/tame%2059iedu.meta.js
// ==/UserScript==

// 考试：判断全部选择正确，单选随机偶尔看一眼，多选全部选择ABCD，基本可以通过。

// 课程中心
if (location.pathname.startsWith('/center/')) {
  const observer = new MutationObserver(() => {
    /**
     * 打开第一个未完成的年度培训课程
     * 已通过课程会有子元素 span.pass 从而在图标上显示通过标签
     */
    if (location.pathname === '/center/home' && document.querySelectorAll('a.current').length) {
      // 选择第一个尚未合格课程
      for (i = 0; i < document.querySelectorAll('a.hover-btn').length; i++) {
        if (
          document
            .querySelectorAll('li[ng-repeat="item in teacherClass"]')
            [i].contains(document.querySelectorAll('span.pass')[i])
        ) {
          continue;
        } else {
          document.querySelectorAll('a.hover-btn')[i].click();
          break;
        }
      }
    }
    // 自动打开待学习课程
    if (
      location.pathname.startsWith('/center/myRealClass/') &&
      document.querySelectorAll(
        'a[href="javascript:void (0);"][ng-click="events.tryListen($event,item.courseId)"]'
      ).length
    ) {
      // 需要允许弹窗
      document
        .querySelector(
          'a[href="javascript:void (0);"][ng-click="events.tryListen($event,item.courseId)"]'
        )
        .click();
      observer.disconnect();
      // 1.5小时后刷新，避免长时间不动被无提示弹出
      setTimeout(() => location.reload(), 1.5 * 60 * 60 * 1000);
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

// 课程播放页面
if (location.pathname.startsWith('/play/')) {
  const observer = new MutationObserver(() => {
    // 自动关闭废弃课程播放页面
    if (document.title === '对不起，您已经打开另外一个播放页面！当前页面无法继续播放！') {
      window.close();
    }
    if (document.querySelectorAll('div[id^="questionUi_tab_id_wof"]').length) {
      // 可能有多个问题，且生成时间不一致，如果操作非最后一个则崩溃，故延迟处理
      setTimeout(() => {
        let qus = document.querySelectorAll('div[id^="questionUi_tab_id_wof"]');
        console.info('Paused' + qus.length);
        // 需要回答最后一个
        let realQus = qus[qus.length - 1];
        // 问题未生成就操作会导致崩溃
        if (!realQus.querySelector('div.d-qus-body[data-id="topic"]')) return;
        // 将问题拆成列表
        let qusArray = realQus
          .querySelector('div.d-qus-body[data-id="topic"]')
          .textContent.trim()
          .split(' ');
        // console.info(qusArray);
        let firstNumber = Number(qusArray[0]);
        let secondNumber = Number(qusArray[2]);
        // 计算四则运算获得准确答案
        let realAns = 0;
        if (qusArray[1] === '+') {
          realAns = firstNumber + secondNumber;
        } else if (qusArray[1] === '-') {
          realAns = firstNumber - secondNumber;
        } else if (qusArray[1] === 'x') {
          realAns = firstNumber * secondNumber;
        } else {
          realAns = firstNumber / secondNumber;
        }
        console.info('realAns: ' + realAns);

        // 获取选项
        let ans = realQus.querySelectorAll('.d-slt.y');
        if (ans.length === 0) return;
        // console.info(ans);
        // 三次回答错误会提示本题失效
        for (let i of ans) {
          // 获取选项内容
          let thisAns = i.textContent.trim().split(' ').pop();
          if (Number(thisAns) === realAns) {
            // console.info(thisAns);
            // 选中正确答案
            i.querySelector('input').click();
          }
        }
        // 提交答案
        realQus.querySelector('button.blue').click();
        if (
          realQus.querySelector('button.blue[data-action="close"]') &&
          realQus.querySelector('span.tip').textContent !== '回答错误，请重新作答！'
        ) {
          realQus.querySelector('button.blue[data-action="close"]').click();
        }
      }, 10000);
    } else if (
      // 解除浏览器限制后视频自动播放
      document.getElementById('lesson_player_box_container_new_hwCloud_dom_baby') &&
      document
        .getElementById('lesson_player_box_container_new_hwCloud_dom_baby')
        .getAttribute('class')
        .includes('vjs-paused')
    ) {
      document.getElementById(
        'lesson_player_box_container_new_hwCloud_dom_baby_html5_api'
      ).muted = true;
    } else if (
      // .current 有两个，整个列表是第一个，当前课程是第二个
      document.querySelectorAll('li.current').length &&
      // 当前课程已完成
      document.querySelectorAll('li.current')[1].textContent.startsWith('100%') &&
      // 最后一课未完成
      document.querySelectorAll(`span[ng-bind="firstMedia.schedule + '%'"]`)[
        document.querySelectorAll(`span[ng-bind="firstMedia.schedule + '%'"]`).length - 1
      ].textContent !== '100%'
    ) {
      // 跳转到第一个未完成课程
      for (
        let i = 0;
        i < document.querySelectorAll(`span[ng-bind="firstMedia.schedule + '%'"]`).length;
        i++
      ) {
        if (
          document.querySelectorAll(`span[ng-bind="firstMedia.schedule + '%'"]`)[i].textContent !==
          '100%'
        ) {
          console.info(i);
          document.querySelectorAll('li.ng-scope[ng-init]')[i].click();
          location.reload();
          break;
        } else {
          continue;
        }
      }
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}
