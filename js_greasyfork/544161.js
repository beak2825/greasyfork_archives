// ==UserScript==
// @name         网页视频倍速控制器
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  通过快捷键控制网页视频播放速度，按下时加速，松开时恢复原速
// @author       模仿煎蛋的太阳
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544161/%E7%BD%91%E9%A1%B5%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/544161/%E7%BD%91%E9%A1%B5%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%8E%A7%E5%88%B6%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认设置
    const DEFAULT_KEYS = {
        'Control': 3.0,
        'Alt': 2.0
    };

    // 自定义速度输入框的默认设置
    const DEFAULT_CUSTOM_SPEED = {
        key: 'Shift+V',
        defaultSpeed: 1.5,
        enabled: true
    };

    // 当前设置
    let speedKeys = JSON.parse(GM_getValue('speedKeys', JSON.stringify(DEFAULT_KEYS)));
    let customSpeedSettings = JSON.parse(GM_getValue('customSpeedSettings', JSON.stringify(DEFAULT_CUSTOM_SPEED)));
    let isKeyDown = {}; // 记录每个按键的状态
    let customSpeedValue = parseFloat(GM_getValue('customSpeedValue', customSpeedSettings.defaultSpeed)); // 当前自定义速度值
    let customSpeedActive = false; // 自定义速度是否激活

    // 保存视频原始速度的对象
    const videoOriginalSpeeds = new WeakMap();

    // 添加设置菜单项
    GM_registerMenuCommand('设置视频倍速控制器', openSettings);

    // 初始化
    function init() {
        // 初始化按键状态
        Object.keys(speedKeys).forEach(key => {
            isKeyDown[key] = false;
        });

        // 添加键盘事件监听器
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        // 监听新视频元素的添加
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.tagName === 'VIDEO') {
                        setupVideoListener(node);
                    } else if (node.querySelectorAll) {
                        node.querySelectorAll('video').forEach(setupVideoListener);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 处理页面上已有的视频元素
        document.querySelectorAll('video').forEach(setupVideoListener);
    }

    // 为视频元素设置事件监听器
    function setupVideoListener(video) {
        // 监听播放速度变化，保存原始速度
        const observer = new MutationObserver(() => {
            if (!isAnyKeyDown() && !customSpeedActive && !videoOriginalSpeeds.has(video)) {
                videoOriginalSpeeds.set(video, video.playbackRate);
            }
        });

        observer.observe(video, {
            attributes: true,
            attributeFilter: ['playbackrate']
        });

        video.addEventListener('ratechange', () => {
            if (!isAnyKeyDown() && !customSpeedActive) {
                videoOriginalSpeeds.set(video, video.playbackRate);
            }
        });

        // 初始设置原始速度
        if (!videoOriginalSpeeds.has(video)) {
            videoOriginalSpeeds.set(video, video.playbackRate);
        }

        video.addEventListener('play', () => {
            // 检查是否有按键被按下，如果有则设置对应速度
            for (const key in speedKeys) {
                if (isKeyDown[key]) {
                    video.playbackRate = speedKeys[key];
                    break;
                }
            }

            // 如果自定义速度激活，设置自定义速度
            if (customSpeedActive) {
                video.playbackRate = customSpeedValue;
            }
        });
    }

    // 检查是否有任何按键被按下
    function isAnyKeyDown() {
        for (const key in isKeyDown) {
            if (isKeyDown[key]) return true;
        }
        return false;
    }

    // 处理按键按下事件
    function handleKeyDown(event) {
        // 处理自定义速度快捷键
        if (customSpeedSettings.enabled && isCustomSpeedKey(event) && !document.getElementById('customSpeedInputContainer')) {
            showCustomSpeedInput();
            event.preventDefault();
            return;
        }

        const key = event.key;
        // 处理预设快捷键
        if (speedKeys.hasOwnProperty(key) && !isKeyDown[key]) {
            isKeyDown[key] = true;
            setAllVideoSpeed(speedKeys[key]);
            event.preventDefault();
        }
    }

    // 处理按键松开事件
    function handleKeyUp(event) {
        const key = event.key;

        // 处理预设快捷键
        if (speedKeys.hasOwnProperty(key) && isKeyDown[key]) {
            isKeyDown[key] = false;
            // 如果还有其他按键按下，设置为对应速度，否则恢复原速
            let restored = false;
            for (const k in speedKeys) {
                if (isKeyDown[k]) {
                    setAllVideoSpeed(speedKeys[k]);
                    restored = true;
                    break;
                }
            }

            // 如果自定义速度激活，保持自定义速度
            if (customSpeedActive) {
                setAllVideoSpeed(customSpeedValue);
                restored = true;
            }

            if (!restored) {
                restoreAllVideoSpeed();
            }
            event.preventDefault();
        }
    }

    // 检查是否按下了自定义速度快捷键
    function isCustomSpeedKey(event) {
        const keys = customSpeedSettings.key.split('+');
        if (keys.length !== 2) return false;

        const modifier = keys[0].trim();
        const mainKey = keys[1].trim();

        return (
            event.key === mainKey &&
            ((modifier === 'Ctrl' && event.ctrlKey) ||
             (modifier === 'Shift' && event.shiftKey) ||
             (modifier === 'Alt' && event.altKey))
        );
    }

    // 显示自定义速度输入框
    // Spotify风格UI设置
    const spotifyStyle = {
      primaryColor: '#1DB954', // Spotify绿
      secondaryColor: 'rgba(29, 185, 84, 0.7)', // 透明度渐变
      bgColor: '#191414', // Spotify深灰背景
      textColor: '#FFFFFF', // 白色文字
      secondaryTextColor: '#B3B3B3', // 浅灰辅助文字
      largeFont: 'bold 24px "Circular", "Helvetica Neue", sans-serif',
      smallFont: '14px "Helvetica Neue", Arial, sans-serif',
      borderRadius: '24px', // Spotify风格圆角
      transition: 'all 0.3s cubic-bezier(0.3, 0, 0, 1)' // Spotify风格动画
    };
    
    // 修改自定义速度输入框样式
    function showCustomSpeedInput() {
      const container = document.createElement('div');
      container.id = 'customSpeedInputContainer';
      container.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                      background: ${spotifyStyle.bgColor}; padding: 30px; border-radius: ${spotifyStyle.borderRadius}; 
                      box-shadow: 0 8px 24px rgba(0,0,0,0.3); z-index: 10001; 
                      font-family: ${spotifyStyle.smallFont}; width: 400px;
                      border: 1px solid rgba(255,255,255,0.1); color: ${spotifyStyle.textColor};
                      transition: ${spotifyStyle.transition};">
          <h2 style="margin: 0 0 20px 0; font: ${spotifyStyle.largeFont};">
            <span style="color: ${spotifyStyle.primaryColor}">自定义速度</span> CUSTOM SPEED
          </h2>
          <div style="margin-bottom: 25px;">
            <label for="customSpeedInput" style="display: block; margin-bottom: 8px; 
                   color: ${spotifyStyle.secondaryTextColor}; font: ${spotifyStyle.smallFont};">播放速度 (0.1-16):</label>
            <input type="number" id="customSpeedInput" min="0.1" max="16" step="0.1" 
                   value="${customSpeedValue}" style="width: 100%; padding: 12px; 
                   background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); 
                   border-radius: ${spotifyStyle.borderRadius}; font-size: 16px;
                   color: ${spotifyStyle.textColor}; transition: ${spotifyStyle.transition};
                   outline: none;">
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button id="closeCustomSpeed" style="background: none; color: ${spotifyStyle.secondaryTextColor}; 
                    border: 1px solid rgba(255,255,255,0.2); padding: 10px 20px; 
                    border-radius: ${spotifyStyle.borderRadius}; cursor: pointer; 
                    transition: ${spotifyStyle.transition};
                    &:hover { background: rgba(255,255,255,0.1); }">取消</button>
            <button id="applyCustomSpeed" style="background: ${spotifyStyle.primaryColor}; 
                    color: white; border: none; padding: 10px 20px; 
                    border-radius: ${spotifyStyle.borderRadius}; cursor: pointer; 
                    transition: ${spotifyStyle.transition};
                    &:hover { background: #1ED760; }">应用</button>
          </div>
        </div>
        <div id="customSpeedOverlay" style="position: fixed; top: 0; left: 0; 
             width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000;
             backdrop-filter: blur(4px);"></div>
      `;
    
      // 添加到页面和事件绑定...
      document.body.appendChild(container);

      // 绑定事件
      container.querySelector('#applyCustomSpeed').addEventListener('click', applyCustomSpeed);
      container.querySelector('#closeCustomSpeed').addEventListener('click', closeCustomSpeedInput);
      container.querySelector('#customSpeedInput').addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
              applyCustomSpeed();
          }
      });
      container.querySelector('#customSpeedOverlay').addEventListener('click', closeCustomSpeedInput);

      // 聚焦到输入框
      container.querySelector('#customSpeedInput').focus();
      container.querySelector('#customSpeedInput').select();
    }

    // 应用自定义速度
    function applyCustomSpeed() {
        const input = document.querySelector('#customSpeedInput');
        const speed = parseFloat(input.value);

        if (isNaN(speed) || speed <= 0) {
            alert('请输入有效的播放速度值');
            return;
        }

        customSpeedValue = speed;
        customSpeedActive = true;

        // 保存自定义速度值
        GM_setValue('customSpeedValue', customSpeedValue);

        // 设置所有视频速度
        setAllVideoSpeed(customSpeedValue);

        // 关闭输入框
        closeCustomSpeedInput();
    }

    // 关闭自定义速度输入框
    function closeCustomSpeedInput() {
        const container = document.querySelector('#customSpeedInputContainer');
        const overlay = document.querySelector('#customSpeedOverlay');
        if (container) container.remove();
        if (overlay) overlay.remove();
    }

    // 设置所有视频元素的播放速度
    function setAllVideoSpeed(speed) {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // 保存当前速度作为原始速度（如果尚未保存）
            if (!videoOriginalSpeeds.has(video)) {
                videoOriginalSpeeds.set(video, video.playbackRate);
            }
            video.playbackRate = speed;
        });
    }

    // 恢复所有视频元素到原始速度
    function restoreAllVideoSpeed() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            const originalSpeed = videoOriginalSpeeds.get(video);
            if (originalSpeed !== undefined) {
                video.playbackRate = originalSpeed;
            } else {
                video.playbackRate = 1.0; // 默认速度
            }
        });
    }

    // 打开设置界面
    // 修改设置窗口样式
    function openSettings() {
      const settingsWindow = document.createElement('div');
      settingsWindow.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                      background: ${spotifyStyle.bgColor}; padding: 30px; border-radius: ${spotifyStyle.borderRadius}; 
                      box-shadow: 0 8px 24px rgba(0,0,0,0.3); z-index: 10000; 
                      font-family: ${spotifyStyle.smallFont}; width: 500px;
                      color: ${spotifyStyle.textColor};">
          <h2 style="margin: 0 0 20px 0; font: ${spotifyStyle.largeFont};">
            视频倍速控制器<span style="font-size: 0.8em; color: ${spotifyStyle.primaryColor}">VIDEO SPEED CONTROL</span>
          </h2>
          <div style="margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #444;">预设快捷键设置</h3>
              <p style="margin: 0 0 10px 0; color: #666;">设置快捷键和对应的播放速度:</p>
              <div id="keySettingsContainer">
                  <!-- 快捷键设置项将通过JavaScript动态添加 -->
              </div>
              <button id="addKeySetting" style="background: ${spotifyStyle.primaryColor}; 
                      color: white; border: none; padding: 12px 24px; 
                      border-radius: ${spotifyStyle.borderRadius}; cursor: pointer; 
                      margin-top: 10px; transition: ${spotifyStyle.transition};
                      &:hover { background: #1ED760; }">添加快捷键</button>
          </div>
      
          <div style="margin-bottom: 20px; padding-top: 10px; border-top: 1px solid #eee;">
              <h3 style="margin: 0 0 10px 0; color: #444;">自定义速度设置</h3>
              <div style="margin-bottom: 10px;">
                  <label style="display: block; margin-bottom: 5px; color: #555;">
                      <input type="checkbox" id="customSpeedEnabled" style="margin-right: 5px;">
                      启用自定义速度功能
                  </label>
              </div>
              <div style="margin-bottom: 10px;">
                  <label for="customSpeedKey" style="display: block; margin-bottom: 5px; color: #555;">触发快捷键:</label>
                  <input type="text" id="customSpeedKey" placeholder="例如: Shift+V"
                         style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                  <p style="margin: 5px 0 0 0; font-size: 12px; color: #888;">格式: Ctrl+V 或 Shift+V 或 Alt+V</p>
              </div>
              <div style="margin-bottom: 10px;">
                  <label for="customSpeedDefault" style="display: block; margin-bottom: 5px; color: #555;">默认播放速度:</label>
                  <input type="number" id="customSpeedDefault" min="0.1" max="16" step="0.1"
                         style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
              </div>
          </div>
      
          <div style="display: flex; justify-content: space-between;">
              <button id="saveSettings" style="background: ${spotifyStyle.primaryColor}; 
                      color: white; border: none; padding: 12px 24px; 
                      border-radius: ${spotifyStyle.borderRadius}; cursor: pointer; 
                      transition: ${spotifyStyle.transition};
                      &:hover { background: #1ED760; }">保存设置</button>
              <button id="resetSettings" style="background: ${spotifyStyle.bgColor}; 
                      color: ${spotifyStyle.textColor}; border: 1px solid rgba(255,255,255,0.2); 
                      padding: 12px 24px; border-radius: ${spotifyStyle.borderRadius}; 
                      cursor: pointer; transition: ${spotifyStyle.transition};
                      &:hover { background: rgba(255,255,255,0.1); }">恢复默认</button>
              <button id="closeSettings" style="background: ${spotifyStyle.bgColor}; 
                      color: ${spotifyStyle.textColor}; border: 1px solid rgba(255,255,255,0.2); 
                      padding: 12px 24px; border-radius: ${spotifyStyle.borderRadius}; 
                      cursor: pointer; transition: ${spotifyStyle.transition};
                      &:hover { background: rgba(255,255,255,0.1); }">关闭</button>
          </div>
      </div>
      <div id="settingsOverlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%;
           background: rgba(0,0,0,0.7); z-index: 9999; backdrop-filter: blur(4px);"></div>
      `;
    
      // 添加到页面
      document.body.appendChild(settingsWindow);
    
      // 填充现有设置
      const container = settingsWindow.querySelector('#keySettingsContainer');
      Object.keys(speedKeys).forEach((key, index) => {
          addKeySettingRow(container, key, speedKeys[key], index);
      });
    
      // 填充自定义速度设置
      settingsWindow.querySelector('#customSpeedEnabled').checked = customSpeedSettings.enabled;
      settingsWindow.querySelector('#customSpeedKey').value = customSpeedSettings.key;
      settingsWindow.querySelector('#customSpeedDefault').value = customSpeedSettings.defaultSpeed;
    
      // 绑定事件
      settingsWindow.querySelector('#addKeySetting').addEventListener('click', () => {
          const index = Object.keys(speedKeys).length;
          addKeySettingRow(container, '', 2.0, index);
      });
    
      settingsWindow.querySelector('#saveSettings').addEventListener('click', saveSettings);
      settingsWindow.querySelector('#resetSettings').addEventListener('click', resetSettings);
      settingsWindow.querySelector('#closeSettings').addEventListener('click', closeSettings);
      settingsWindow.querySelector('#settingsOverlay').addEventListener('click', closeSettings);
      }

      // 添加快捷键设置行
      function addKeySettingRow(container, key, speed, index) {
          const row = document.createElement('div');
          row.style.display = 'flex';
          row.style.marginBottom = '10px';
          row.style.alignItems = 'center';
          row.innerHTML = `
              <select class="keySelect" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-right: 10px;">
                  <option value="">请选择</option>
                  <option value="Control">Ctrl</option>
                  <option value="Shift">Shift</option>
                  <option value="Alt">Alt</option>
                  <option value=" ">空格</option>
              </select>
              <input type="number" class="speedInput" min="0.1" max="16" step="0.1" value="${speed}"
                     style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-right: 10px;">
              <button class="removeKeySetting" style="background: #1ED760; color: white; border: none; width: 24px; height: 24px;
                  border-radius: 50%; cursor: pointer;">×</button>
          `;
    
          row.querySelector('.keySelect').value = key;
          container.appendChild(row);
    
          // 绑定删除事件
          row.querySelector('.removeKeySetting').addEventListener('click', () => {
              container.removeChild(row);
          });
      }

      // 保存设置
      function saveSettings() {
          // 保存预设快捷键设置
          const newSpeedKeys = {};
          const rows = document.querySelectorAll('#keySettingsContainer > div');
    
          let valid = true;
          rows.forEach(row => {
              const key = row.querySelector('.keySelect').value;
              const speed = parseFloat(row.querySelector('.speedInput').value);
    
              if (key && !isNaN(speed) && speed > 0) {
                  newSpeedKeys[key] = speed;
              } else {
                  valid = false;
              }
          });
    
          if (!valid) {
              alert('请确保所有预设快捷键设置项都已正确填写');
              return;
          }
    
          if (Object.keys(newSpeedKeys).length === 0) {
              alert('请至少设置一个快捷键');
              return;
          }
    
          // 保存自定义速度设置
          const customEnabled = document.querySelector('#customSpeedEnabled').checked;
          const customKey = document.querySelector('#customSpeedKey').value.trim();
          const customDefault = parseFloat(document.querySelector('#customSpeedDefault').value);
    
          if (customEnabled && (!customKey || isNaN(customDefault) || customDefault <= 0)) {
              alert('请正确填写自定义速度设置');
              return;
          }
    
          const newCustomSpeedSettings = {
              key: customKey,
              defaultSpeed: customDefault,
              enabled: customEnabled
          };
    
          // 保存到存储
          GM_setValue('speedKeys', JSON.stringify(newSpeedKeys));
          GM_setValue('customSpeedSettings', JSON.stringify(newCustomSpeedSettings));
    
          // 更新当前设置
          speedKeys = newSpeedKeys;
          customSpeedSettings = newCustomSpeedSettings;
    
          // 更新按键状态对象
          isKeyDown = {};
          Object.keys(speedKeys).forEach(key => {
              isKeyDown[key] = false;
          });
    
          alert('设置已保存！');
          closeSettings();
      }

      // 恢复默认设置
      function resetSettings() {
          if (confirm('确定要恢复默认设置吗？')) {
              speedKeys = {...DEFAULT_KEYS};
              customSpeedSettings = {...DEFAULT_CUSTOM_SPEED};
    
              GM_setValue('speedKeys', JSON.stringify(speedKeys));
              GM_setValue('customSpeedSettings', JSON.stringify(customSpeedSettings));
    
              // 更新按键状态对象
              isKeyDown = {};
              Object.keys(speedKeys).forEach(key => {
                  isKeyDown[key] = false;
              });
    
              alert('已恢复默认设置！');
              closeSettings();
          }
      }

      // 关闭设置界面
      function closeSettings() {
          const settingsWindow = document.querySelector('div[style*="position: fixed; top: 50%; left: 50%"]');
          const overlay = document.querySelector('#settingsOverlay');
          if (settingsWindow) settingsWindow.remove();
          if (overlay) overlay.remove();
      }

      // 页面加载完成后初始化
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', init);
      } else {
          init();
      }
  })();

// 添加Apple风格动画效果
function animateElement(element, scale = 1.05) {
  element.style.transition = 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
  element.style.transform = `scale(${scale})`;
  setTimeout(() => {
    element.style.transform = 'scale(1)';
  }, 300);
}