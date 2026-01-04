// ==UserScript==
// @name          wsxy_autoPlay
// @namespace     Vionlentmonkey
// @version       0.5
// @description   网上学院函数库：优化视频
// ==/UserScript==

/**
 * 使两类播放器均自动播放
 * 旧版本播放器能否成功调用 HTML5 似乎是玄学问题，检测不到 HTML5 播放器则刷新。
 */
const autoPlay = () => {
  // 自动从课程封面进入播放页面
  if (document.querySelector('img[src="courseware/iconImg/z3.png"]')) {
    document.querySelector('img[src="courseware/iconImg/z3.png"]').click();
  }
  // 学习进度超过 90% 和部分报错会以 alert 弹出。
  unsafeWindow.alert = (message) => {
    GM_notification(message, 'Alert');
    console.log(message);
  };
  const video_media = document.getElementById('video_media'); // 新播放器
  const html5Player = document.getElementById('course_player5'); // 旧播放器
  if (video_media) {
    /**
     * 新播放器是否继续学习对话框调用 confirm，阻塞脚本运行。
     * 测试例：http://218.94.1.175:8087/sfxzwsxy/jypxks/modules/train/ware/course_ware_view.jsp?applyPk=3063755&courseType=1
     */
    unsafeWindow.confirm = (message) => {
      if (message === '是否继续学习？') {
        console.log(message);
        return true;
      } else {
        GM_notification(message, 'Confirm');
        console.log(message);
        // 新旧播放器统一从头播放重新来过
        return false;
      }
    };
    /**
     * 静音模式下自动播放无需用户授权
     * https://developer.mozilla.org/docs/Web/Media/Autoplay_guide#Autoplay_availability
     */
    if (GM_config.get('muted')) {
      video_media.querySelector('video').muted = true;
    }
    /**
     * https://developer.mozilla.org/docs/Web/Guide/Events/Media_events
     * 此处不支持用 .next(clearInterval(...))
     */
    video_media.querySelector('video').play();
  } else if (html5Player) {
    if (GM_config.get('muted')) {
      html5Player.muted = true;
    }
    // 旧播放器是否继续学习对话框
    if (document.getElementById('cancel')) {
      //document.getElementById('confirm').click(); // 继续学习；可能需要多次重复才能完成该课程。
      document.getElementById('cancel').click(); // 大侠还请重新来过
    }
    // 旧播放器自动做题
    const ques = document.querySelectorAll('div.option > label > input[name="que"]');
    if (ques.length > 0) {
      // 兼容多选题
      if (ques.length > 1) {
        ques[1].click();
      }
      ques[0].click();
      document.getElementsByClassName('button')[0].click(); // 提交
      // 下一题
      if (document.getElementsByClassName('button_xia').length === 1) {
        document.getElementsByClassName('button_xia')[0].click();
      }
      // 完成
      if (document.getElementsByClassName('button_wan').length === 1) {
        document.getElementsByClassName('button_wan')[0].click();
      }
    }
    // 此处支持 .next(clearInterval(...))，但不取消可以保证持续播放，即使用户点击页面也不影响。
    html5Player.play();
  } else if (!location.href.endsWith('.mp4')) {
    // 若直接在新标签页打开mp4视频，id 为 media
    location.reload();
  }
};
