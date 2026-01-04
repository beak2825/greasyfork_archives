// ==UserScript==
// @name         b站帧视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  手动控制画面播放，方便截取指定时刻的画面。
// @author       xh
// @match        https://www.bilibili.com/video/av*
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/391024/b%E7%AB%99%E5%B8%A7%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/391024/b%E7%AB%99%E5%B8%A7%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

// todo: 番区视频不生效，需要修改 match

(function() {

  const $video = document.getElementsByTagName("video")[0];

  let step = 0.1;

  const $container = createContainer();
  const $forward = createButton("前进");
  const $backward = createButton("后退");
  const $control = createControl(step);
  const $time = createText($video.currentTime);


  append($container, document.body);
  append($control, $container);
  append($backward, $container);
  append($forward, $container);
  append($time, $container);

  $video.addEventListener("seeked", function() {
    console.log("seeked");
    $time.setContent("当前时间：" +$video.currentTime);
  });

  $control.addEventListener('change', (ev) => {
    step = +ev.target.value;
  })

  $forward.addEventListener('click', () => {
    console.log('前进:', step);
    $video.currentTime += step;
    // $time.setContent("当前时间：" +$video.currentTime);
  })
  $backward.addEventListener('click', () => {
    $video.currentTime -=step;
    // $time.setContent("当前时间：" +$video.currentTime);
  })


  function createControl(step) {
    const $input = document.createElement('input');
    $input.setAttribute('type', 'number');
    $input.value = step;
    return $input
  }
  function createButton(value) {
    const $backward = document.createElement('button');
    $backward.textContent = value;
    return $backward;
  }
  function createContainer() {
    const $con = document.createElement('div');
    $con.setAttribute('id', "xxx_frameControl")
    $con.style.cssText+=`
position: absolute;
top: 100px;
left: 100px;
z-index: 99999999;
`;
    return $con;
  }
  function createText(content) {
    const $div = document.createElement('span');
    $div.textContent = content;
    $div.setContent = function(newContent) {
      this.textContent = newContent;
    }
    return $div;
  }

  function append($dom, $container) {
    $container.append($dom);
  }

})();