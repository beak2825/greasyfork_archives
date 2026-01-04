// ==UserScript==
// @name        H2P: 虎牙自动禁言
// @namespace   http://tampermonkey.net/
// @version     0.0.6
// @icon        https://a.msstatic.com/huya/h5player/room/2006231627/src/img/output/replay-fornotice-icon.png
// @description 虎牙自动禁言
// @author      H2P
// @compatible  chrome
// @require     https://greasyfork.org/scripts/411278-h2p-utils/code/H2P:%20utils.js?version=847435
// @require     https://greasyfork.org/scripts/411280-h2p-notify-util/code/H2P:%20notify%20util.js?version=847422
// @match       *://*.huya.com/*
// @note        2020.09.24-V0.0.06    修复虎牙禁言（禁言更新）
// @downloadURL https://update.greasyfork.org/scripts/405989/H2P%3A%20%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E7%A6%81%E8%A8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/405989/H2P%3A%20%E8%99%8E%E7%89%99%E8%87%AA%E5%8A%A8%E7%A6%81%E8%A8%80.meta.js
// ==/UserScript==

(($util, $H2P, $notifyMgr) => {
  'use strict';

  const HuyaMute = 'h2p-huya-config-mute';
  let config_mute_pre = {
    // 恶意刷屏
    EYiShuaPing: {
      time    : '1800',
      keyWords: [],
    },
    // 谩骂
    ManMa: {
      time    : '1800',
      keyWords: [],
    },
    // 刷广告
    ShuaGuangGao: {
      time    : '1800',
      keyWords: [],
    },
    // 色情
    SeQing: {
      time    : '1800',
      keyWords: [],
    }
  };
  let config_mute = {};
  Object.assign(config_mute, config_mute_pre);
  let config_mute_tmp = JSON.parse(localStorage.getItem(HuyaMute)) || {};
  Object.assign(config_mute, config_mute_tmp);
  for (let key in config_mute) { if (!(key in config_mute_pre)) { delete config_mute[key]; } }
  localStorage.removeItem(HuyaMute);
  localStorage.setItem(HuyaMute, JSON.stringify(config_mute));

  const muteTimes = ['300', '1800', '86400', '604800', '2592000', '31104000'];
  const muteTimes2 = ['5分钟', '30分钟', '1天', '7天', '1个月', '1年'];
  const muteTypes = ['恶意刷屏', '谩骂', '刷广告', '色情'];

  new Promise((resolve, reject) => {
    let style = document.createElement('style');
    style.innerHTML = `
      #h2p-huya-script {
        position        : fixed;
        top             : 60px;
        left            : 0;
        width           : 600px;
        height          : 325px;
        border-radius   : 0 0 10px 0;
        padding         : 10px;
        background      : #eeeeee;
        z-index         : 100000;
      }
      .h2p-huya-div {
        display         : flex;
        flex-flow       : row wrap;
        justify-content : space-between;
      }
      .h2p-huya-layer {
        justify-content : flex-start;
        width           : 140px;
      }
      .h2p-huya-textarea {
        width           : 130px;
        height          : 265px;
        padding         : 5px;
        margin          : 5px 0 0;
        resize          : none;
        font-size       : 10px;
        line-height     : 15px;
      }
      .h2p-huya-button {
        width           : 100%;
        height          : 25px;
        border          : none;
        border-radius   : 5px;
        background-color: #00deba;
        cursor          : pointer;
        outline         : none;
        transition      : all 0.5s;
      }
      .h2p-huya-button:hover {
        background-color: #00ccaa;
      }
      .h2p-huya-button-active {
        background-color: #99aaff;
        transition      : all 0.5s;
      }
      .h2p-huya-button-active:hover {
        background-color: #8899cc;
      }
    `;
    document.body.appendChild(style);

    let div = document.createElement('div');
    div.id = 'h2p-huya-script';
    div.style = 'display: none';
    div.innerHTML = `
      <div class="h2p-huya-div">
        <div class="h2p-huya-layer">
          <label>恶意刷屏：</label>
          <select id="h2p-huya-select-EYiShuaPing">
            <option value="300">5 分钟</option>
            <option value="1800">30 分钟</option>
            <option value="86400">1 天</option>
            <option value="604800">7 天</option>
            <option value="2592000">1 个月</option>
            <option value="31104000">1 年</option>
          </select>
          <textarea id="h2p-huya-textarea-EYiShuaPing" class="h2p-huya-textarea"></textarea>
        </div>
        <div class="h2p-huya-layer">
          <label>谩骂：</label>
          <select id="h2p-huya-select-ManMa">
            <option value="300">5 分钟</option>
            <option value="1800">30 分钟</option>
            <option value="86400">1 天</option>
            <option value="604800">7 天</option>
            <option value="2592000">1 个月</option>
            <option value="31104000">1 年</option>
          </select>
          <textarea id="h2p-huya-textarea-ManMa" class="h2p-huya-textarea"></textarea>
        </div>
        <div class="h2p-huya-layer">
          <label>刷广告：</label>
          <select id="h2p-huya-select-ShuaGuangGao">
            <option value="300">5 分钟</option>
            <option value="1800">30 分钟</option>
            <option value="86400">1 天</option>
            <option value="604800">7 天</option>
            <option value="2592000">1 个月</option>
            <option value="31104000">1 年</option>
          </select>
          <textarea id="h2p-huya-textarea-ShuaGuangGao" class="h2p-huya-textarea"></textarea>
        </div>
        <div class="h2p-huya-layer">
          <label>色情：</label>
          <select id="h2p-huya-select-SeQing">
            <option value="300">5 分钟</option>
            <option value="1800">30 分钟</option>
            <option value="86400">1 天</option>
            <option value="604800">7 天</option>
            <option value="2592000">1 个月</option>
            <option value="31104000">1 年</option>
          </select>
          <textarea id="h2p-huya-textarea-SeQing" class="h2p-huya-textarea"></textarea>
        </div>
      </div>
      <div class="h2p-huya-div">
        <button id="h2p-huya-button" class="h2p-huya-button">启动</button>
      </div>
    `;

    document.body.appendChild(div);

    resolve();
  })
  .then(() => {
    let div = $H2P('div#h2p-huya-script');
    div.addEventListener('change', (e) => {
      const target = e.target;
      if (target.tagName.toLowerCase() !== 'select') return;

      const value = target.selectedOptions[0].value;
      if (target.id === 'h2p-huya-select-EYiShuaPing') {
        config_mute.EYiShuaPing.time = value;
      } else if (target.id === 'h2p-huya-select-ManMa') {
        config_mute.ManMa.time = value;
      } else if (target.id === 'h2p-huya-select-ShuaGuangGao') {
        config_mute.ShuaGuangGao.time = value;
      } else if (target.id === 'h2p-huya-select-SeQing') {
        config_mute.SeQing.time = value;
      }

      localStorage.setItem(HuyaMute, JSON.stringify(config_mute));
    });

    div.addEventListener('input', (e) => {
      const target = e.target;
      if (target.tagName.toLowerCase() !== 'textarea') return;

      const value = target.value;
      if (target.id === 'h2p-huya-textarea-EYiShuaPing') {
        config_mute.EYiShuaPing.keyWords = value.split('\n');
      } else if (target.id === 'h2p-huya-textarea-ManMa') {
        config_mute.ManMa.keyWords = value.split('\n');
      } else if (target.id === 'h2p-huya-textarea-ShuaGuangGao') {
        config_mute.ShuaGuangGao.keyWords = value.split('\n');
      } else if (target.id === 'h2p-huya-textarea-SeQing') {
        config_mute.SeQing.keyWords = value.split('\n');
      }

      localStorage.setItem(HuyaMute, JSON.stringify(config_mute));
    });

    let button = $H2P('button#h2p-huya-button');
    button.addEventListener('click', () => {
      button.classList.toggle('h2p-huya-button-active');
      button.textContent = button.classList.contains('h2p-huya-button-active') ? '启动中' : '启动';
      setINVL_checkMsg();
    });
  })
  .then(() => {
    // 显示设置的禁言时长
    for (let i = 0; i < muteTimes.length; i++) {
      if (config_mute.EYiShuaPing.time === muteTimes[i]) {
        $H2P('select#h2p-huya-select-EYiShuaPing').selectedIndex = i;
      }
      if (config_mute.ManMa.time === muteTimes[i]) {
        $H2P('select#h2p-huya-select-ManMa').selectedIndex = i;
      }
      if (config_mute.ShuaGuangGao.time === muteTimes[i]) {
        $H2P('select#h2p-huya-select-ShuaGuangGao').selectedIndex = i;
      }
      if (config_mute.SeQing.time === muteTimes[i]) {
        $H2P('select#h2p-huya-select-SeQing').selectedIndex = i;
      }
    }
    // 显示禁言内容
    $H2P('textarea#h2p-huya-textarea-EYiShuaPing').value = Array.isArray(config_mute.EYiShuaPing.keyWords) ? config_mute.EYiShuaPing.keyWords.join('\n') : '';
    $H2P('textarea#h2p-huya-textarea-ManMa').value = Array.isArray(config_mute.ManMa.keyWords) ? config_mute.ManMa.keyWords.join('\n') : '';
    $H2P('textarea#h2p-huya-textarea-ShuaGuangGao').value = Array.isArray(config_mute.ShuaGuangGao.keyWords) ? config_mute.ShuaGuangGao.keyWords.join('\n') : '';
    $H2P('textarea#h2p-huya-textarea-SeQing').value = Array.isArray(config_mute.SeQing.keyWords) ? config_mute.SeQing.keyWords.join('\n') : '';
  })
  .then(() => {
    document.addEventListener('keydown', (e) => {
      if (e.shiftKey && e.which == $util.keyCode.j) {
        $H2P('div#h2p-huya-script').style.display = $H2P('div#h2p-huya-script').style.display === 'none' ? '' : 'none';
      }
    });
  })

  let checkMsg = null;
  let muteUser = null;
  let minDataID = -1;             // 检测弹幕开始编号
  function setINVL_checkMsg() {
    if (checkMsg) {
      window.clearInterval(checkMsg);
      window.clearInterval(muteUser);
      checkMsg = null;
      muteUser = null;
      return;
    }
    checkMsg = setInterval(() => {
      if (muteUser) { return; }
      let msgs = $H2P('ul#chat-room__list > li', false).filter(ele => Number(ele.getAttribute('data-id')) > minDataID);
      let index = -1;
      let timeIndex = -1;
      for (let i = 0; i < msgs.length; i++) {
        let ele = msgs[i];
        minDataID = Number(ele.getAttribute('data-id'));
        if (ele.querySelector('span.msg') && ele.querySelector('span.name.J_userMenu')) {
          let user = ele.querySelector('span.name.J_userMenu').textContent;
          let msg = ele.querySelector('span.msg').textContent.replace(/\s*/g, '');
          console.log(`检测[${user}]发的弹幕：${msg}`)
          // 判断是否存在满足禁言的弹幕
          for (let j = 0; j < config_mute.EYiShuaPing.keyWords.length && timeIndex < 0; j++) {
            let keyWord = config_mute.EYiShuaPing.keyWords[j];
            if (keyWord.length > 0 && msg.includes(keyWord)) {
              index = 0;
              timeIndex = muteTimes.indexOf(config_mute.EYiShuaPing.time);
              break;
            }
          }
          for (let j = 0; j < config_mute.ManMa.keyWords.length && timeIndex < 0; j++) {
            let keyWord = config_mute.ManMa.keyWords[j];
            if (keyWord.length > 0 && msg.includes(keyWord)) {
              index = 1;
              timeIndex = muteTimes.indexOf(config_mute.ManMa.time);
              break;
            }
          }
          for (let j = 0; j < config_mute.ShuaGuangGao.keyWords.length && timeIndex < 0; j++) {
            let keyWord = config_mute.ShuaGuangGao.keyWords[j];
            if (keyWord.length > 0 && msg.includes(keyWord)) {
              index = 2;
              timeIndex = muteTimes.indexOf(config_mute.ShuaGuangGao.time);
              break;
            }
          }
          for (let j = 0; j < config_mute.SeQing.keyWords.length && timeIndex < 0; j++) {
            let keyWord = config_mute.SeQing.keyWords[j];
            if (keyWord.length > 0 && msg.includes(keyWord)) {
              index = 3;
              timeIndex = muteTimes.indexOf(config_mute.SeQing.time);
              break;
            }
          }
        }
        if (timeIndex > -1) {
          ele.querySelector('span.name.J_userMenu').click();
          // 开始禁言
          muteUser = setInterval(() => {
            // 禁言后没有该按钮
            const ele_openMute = $H2P('div[class^=user-viewer-content] i[class^=mute-icon]');
            if (ele_openMute) {
              window.clearInterval(muteUser);
              muteUser = null;

              // 该用户已被禁言
              if (ele_openMute.nextSibling.textContent === '解除禁言') {

              } else if (ele_openMute.nextSibling.textContent === '禁止发言') {
                // 隐藏禁言选项框
                let style = document.createElement('style');
                style.id = 'h2p-huya-style-mute';
                style.innerHTML = `
                  #duya-header, #J_mainWrap, #J_roomBd,
                  .mod-sidebar, .duya-header-wrap {
                    z-index         : 99999;
                  }
                  #J_mainWrap, #main_col {
                    background-color: #f4f5f8;
                  }
                  .dlg {
                    display: none!important;
                  }
                `;
                !$H2P('style#h2p-huya-style-mute') && document.body.appendChild(style);

                ele_openMute.click();
                muteUser = setInterval(() => {
                  const muteTime = $H2P(`div[class^=mute-add] div[class^=form-item--]:nth-child(3) p[class^=radio--]`, false);
                  const muteType = $H2P(`div[class^=mute-add] div[class^=form-item--]:nth-child(4) p[class^=radio--]`, false);
                  if (muteTime) {
                    window.clearInterval(muteUser);
                    muteUser = null;

                    // 选择禁言时间和类型
                    muteTime[timeIndex].click();
                    muteType[index].click();
                    muteUser = setInterval(() => {
                      if ($H2P(`a[class^=modal-btn--]`)) {
                        window.clearInterval(muteUser);
                        muteUser = null;

                        console.log(`${new Date().$formatTime()}  --  【${ele.querySelector('span.name.J_userMenu').textContent}】【${muteTypes[index]}】：${ele.querySelector('span.msg').textContent.replace(/\s*/g, '')}  --  禁言【${muteTimes2[timeIndex]}】`);
                        $H2P(`a[class^=modal-btn--]`).click();
                        $H2P('style#h2p-huya-style-mute') && $H2P('style#h2p-huya-style-mute').remove();
                        $H2P('i[class^=ucard-x]').click(); // 关闭个人资料
                      }
                    }, 50);
                  }
                }, 50);
              }
            } else if ($H2P('i[class^=ucard-x]')) {
              window.clearInterval(muteUser);
              muteUser = null;

              console.log(`无法禁言 ${ele.querySelector('span.name.J_userMenu').textContent}`);
              $H2P('i[class^=ucard-x]').click();
            }
          }, 50);
          break;
        };
      }
    }, 500);
  }
})($util, $H2P, $notifyMgr);