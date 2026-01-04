// ==UserScript==
// @name       上海开放大学/上开自动刷视频
// @namespace   一心向善
// @version    0.3
// @description  上海开放大学相关视频自动学习自动看视频程序，如失效，最新版请进群获取，QQ群：756253160
// @author      Bard
// @license MIT
// @match       https://ids.shou.org.cn/authserver/login?service=https%3a%2f%2fl.shou.org.cn%2fcommon%2flogin.aspx%3fredirectUrl%3d%7e%2fcommon%2findex.aspx
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/490287/%E4%B8%8A%E6%B5%B7%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E4%B8%8A%E5%BC%80%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/490287/%E4%B8%8A%E6%B5%B7%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E4%B8%8A%E5%BC%80%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
  // 登录函数
  function login() {
    // 输入用户名和密码
    document.getElementById('username').value = 'your_username';
    document.getElementById('password').value = 'your_password';

    // 点击登录按钮
    document.getElementById('loginBtn').click();
  }

  // 自动刷视频函数
  function autoScroll() {
    // 等待页面加载完成
    var video = document.getElementById('video');
    while (!video) {
      video = document.getElementById('video');
    }

    // 获取视频容器的高度
    var videoHeight = video.getBoundingClientRect().height;

    // 循环滚动视频
    setInterval(function() {
      // 从上到下滑动
      window.scrollBy(0, videoHeight);

      // 等待视频播放完成
      setTimeout(function() {
        // 点赞
        var likeBtn = document.getElementById('likeBtn');
        if (likeBtn) {
          likeBtn.click();
        }

        // 评论
        var commentBtn = document.getElementById('commentBtn');
        if (commentBtn) {
          commentBtn.click();
        }

        // 关注
        var followBtn = document.getElementById('followBtn');
        if (followBtn) {
          followBtn.click();
        }
      }, 2000);
    }, 2000);
  }

  // 开始自动刷视频
  login();
  autoScroll();
})();