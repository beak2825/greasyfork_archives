// ==UserScript==
// 脚本名称
// @name         KJ2100 PlugHelper
// @namespace    https://greasyfork.org/zh-CN/users/249093-kaso-hong/kj2100
// @version      0.0.3
// @description  KJ2100 播放专注辅助
// @author       kasohong
// @match        *://gdhz.kj2100.com/*
// @grant        none
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/387432/KJ2100%20PlugHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/387432/KJ2100%20PlugHelper.meta.js
// ==/UserScript==

(function () {
  'use msgict';

  function createEle(eleName, text, attrs) {
    let ele = document.createElement(eleName);
    ele.innerText = text;
    for (let k in attrs) {
      ele.setAttribute(k, attrs[k]);
    }
    return ele;
  }

  let btnStyle = `
  #KJ2100-PlugHelper-Location {
    position: fixed; top: 60px; left: -90px; opacity: 0.5; z-index: 2147483647;
    background-image: none; cursor:pointer; color: black; background-color: transparent; !important;
    margin: 5px 0px; width: auto; border-radius: 3px; border: #0084ff; outline: none; padding: 3px 6px; height: 26px;
    font-family: Arial, sans-serif; font-size: 12px; transition: left, 0.5s;
    }
  #KJ2100-PlugHelper-Location:hover {
    left: 0px; opacity: 1;
  }
  #KJ2100-PlugHelper-Location svg {
    width: auto; vertical-align: middle; margin-left: 10px; border-style: none;text-align: center;display: inline-block !important;margin-bottom: 2px;
  }`;
  let styleTag = createEle('style', btnStyle, { type: "text/css" });

  // 将按钮图标由原来的img改为了svg，以增强适应性，同时也将对svg的样式设置移到了上面的 btnStyle 中
  let iconSVG = '<?xml version="1.0" encoding="UTF-8"?><svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" fill="white" fill-opacity="0.01"/><path d="M8 6C8 4.89543 8.89543 4 10 4H30L40 14V42C40 43.1046 39.1046 44 38 44H10C8.89543 44 8 43.1046 8 42V6Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M16 20H32" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 28H32" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  let btn = createEle('button', '', { id: "KJ2100-PlugHelper-Location" });
  btn.innerHTML = 'KJ2100 Helper' + iconSVG;

  btn.addEventListener('click', () => {
      var title = document.querySelector('title').text;
      if(!document.querySelector('title').text.startsWith("[PM]")){
          console.log('KJ2100 Helper Init...');
          let regKj2100 = /https:\/\/gdhz.kj2100.com\//;
          if(regKj2100.test(location.toString())){
              console.log('KJ2100 Plug Init.');
              document.querySelector('title').text = '[KJ2100 Helper Init...]' + title;
              setInterval(function () {
                  console.log('KJ2100 Plug Start.');
                  document.querySelector('title').text = '[PM] Start.' + title;
                  if(document.querySelector('.vjs-icon-placeholder') != undefined){
                      document.querySelector('.vjs-icon-placeholder').click();
                  }
                  if(document.querySelector('.vjs-mute-control.vjs-control.vjs-button.vjs-vol-3') != undefined){
                      document.querySelector('.vjs-mute-control.vjs-control.vjs-button.vjs-vol-3').click();
                  }
                  if(document.querySelector('.vjs-progress-holder.vjs-slider.vjs-slider-horizontal') != undefined){
                      var procStr = document.querySelector('.vjs-progress-holder.vjs-slider.vjs-slider-horizontal').ariaValueText;
                      console.log('KJ2100 Plug Now Playing : ' + procStr);
                      document.querySelector('title').text = '[PM]' + procStr + title;
                  }
              }, 1 * 1000);

              console.log('KJ2100 Plug Init Completed.');
          }
      }else{
          console.log('KJ2100 Plug Init Already Completed.');
          document.querySelector('title').text = '[PM] Already Completed.' + title;
      }
  });

  if (window.self === window.top) {
    if (document.querySelector('body')) {
      document.body.appendChild(btn);
      document.body.appendChild(styleTag);
    } else {
      document.documentElement.appendChild(btn);
      document.documentElement.appendChild(styleTag);
    }

    setInterval(function () {
       //if(!document.querySelector('title').text.startsWith("[PM]")){
           btn.click();
       //}
    }, 5 * 1000);

  }
})();