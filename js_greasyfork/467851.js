// ==UserScript==
// @name         视频画中画自动开启
// @description  离开当前正在播放视频的标签页后自动开启视频的画中画模式，回到标签页后关闭画中画模式
// @match        *://*/*
// @run-at       document-end
// @version      0.0.1
// @namespace https://greasyfork.org/users/315022
// @downloadURL https://update.greasyfork.org/scripts/467851/%E8%A7%86%E9%A2%91%E7%94%BB%E4%B8%AD%E7%94%BB%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/467851/%E8%A7%86%E9%A2%91%E7%94%BB%E4%B8%AD%E7%94%BB%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF.meta.js
// ==/UserScript==

// 监听 visibilitychange 事件
document.addEventListener('visibilitychange', function() {
  // 检查页面是否隐藏且不处于活动状态
  if (document.visibilityState === 'hidden' && document.visibilityState !== 'active') {
    // 检查是否有正在播放的视频元素
    const videoElement = document.querySelector('video');
    if (videoElement && !videoElement.paused) {
      // 开启画中画模式
      if (!document.pictureInPictureElement) {
        videoElement.requestPictureInPicture();
      }
    }
  } else if (document.visibilityState === 'visible') {
    // 检查是否处于画中画模式
    if (document.pictureInPictureElement) {
      // 退出画中画模式
      document.exitPictureInPicture();
    } else {
      // 检查是否有正在播放的视频元素
      const videoElement = document.querySelector('video');
      if (videoElement && !videoElement.paused) {
        // 开启画中画模式
        if (!document.pictureInPictureElement) {
          videoElement.requestPictureInPicture();
        }
      }
    }
  }
});