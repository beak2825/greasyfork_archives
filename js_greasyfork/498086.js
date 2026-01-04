// ==UserScript==

// @name 橙光安卓一键破解插件

// @version 0.18

// @description Adds a button to toggle userData.totalFlower

// @author You

// @match        https://*.66rpg.com/h5/*

// @match        https://*.66rpg.com/game/*

// @icon https://example.com/favicon.ico


// @namespace https://greasyfork.org/users/1318954
// @downloadURL https://update.greasyfork.org/scripts/498086/%E6%A9%99%E5%85%89%E5%AE%89%E5%8D%93%E4%B8%80%E9%94%AE%E7%A0%B4%E8%A7%A3%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/498086/%E6%A9%99%E5%85%89%E5%AE%89%E5%8D%93%E4%B8%80%E9%94%AE%E7%A0%B4%E8%A7%A3%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==



(function() {

  'use strict';



  const createButton = (text, position) => {

    const btn = document.createElement('button');

    btn.style.position = 'fixed';

    btn.style.zIndex = '9999';

    btn.style.top = '10px';

    btn.style.left = '10px'; // 将 left 属性设置为 10px

    btn.innerHTML = text;

    btn.style.userSelect = 'none'; // 添加禁止选中文字的样式

    return btn;

  };



  const fsButton = createButton('制霸开启', 'left');

  const exitButton = createButton('退出', 'left');

  exitButton.style.display = 'none'; // 隐藏退出按钮



  let isFullScreen = false;



  const toggleFullscreen = () => {

    if (!isFullScreen) {

      const confirmFullscreen = confirm('确认要进入全屏模式吗？');

      if (confirmFullscreen) {

        enterFullscreen();

      }

    } else {

      exitFullscreen();

    }

  };



  const enterFullscreen = () => {

    const element = document.documentElement;

    isFullScreen = true;

    fsButton.style.display = 'none';



    if (element.requestFullscreen)

      element.requestFullscreen();

    else if (element.mozRequestFullScreen)

      element.mozRequestFullScreen();

    else if (element.webkitRequestFullscreen)

      element.webkitRequestFullscreen();



    if (screen.orientation?.lock('landscape'));

  };



  const exitFullscreen = () => {

    isFullScreen = false;

    fsButton.style.display = 'block';



    if (document.exitFullscreen)

      document.exitFullscreen();

    else if (document.mozCancelFullScreen)

      document.mozCancelFullScreen();

    else if (document.webkitExitFullscreen)

      document.webkitExitFullscreen();



    if (screen.orientation?.unlock());

  };



  const handleFullscreenChange = () => {

    if (document.fullscreenElement ||

      document.mozFullScreenElement ||

      document.webkitFullscreenElement) {

      isFullScreen = true;

      fsButton.style.display = 'none';

      toggleExitButton(); // 更新退出按钮的可见性

    } else {

      isFullScreen = false;

      fsButton.style.display = 'block';

      toggleExitButton(); // 更新退出按钮的可见性

    }

  };



  const toggleExitButton = () => {

    if (isFullScreen) {

      exitButton.style.display = 'block'; // 显示退出按钮

    } else {

      exitButton.style.display = 'none'; // 隐藏退出按钮

    }

  };



  fsButton.addEventListener('click', () => {

    alert('作者：小八小八');

    setTimeout(() => {

      // Set the value of userData.totalFlower to 6600

      if (typeof userData !== 'undefined') {

        userData.totalFlower = 6600;

      }

      if (typeof gIndex !== 'undefined') {

        gIndex = '1670380';

      }

      alert('一键开启成功');

      toggleFullscreen();

    }, 100);

  });



  exitButton.addEventListener('click', exitFullscreen); // 添加退出按钮的点击事件

  document.body.appendChild(fsButton);

  document.body.appendChild(exitButton); // 将退出按钮添加到页面中



  document.addEventListener('fullscreenchange', handleFullscreenChange);

  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

  document.addEventListener('mozfullscreenchange', handleFullscreenChange);



  setInterval(function() {

    if (typeof WX !== 'undefined' && WX !== 'iffyy999') {

      location.reload(); // 破防代码location.reload启用

    }

  }, 10000);

})();
