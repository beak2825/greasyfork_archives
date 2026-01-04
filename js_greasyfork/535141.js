// ==UserScript==
// @name         自动填写身份证号码
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  使用前请添加乘客的姓名和随机的身份证号，脚本会自动生成所有可能的身份证号码，并自动填写到12306的乘客信息页面上用以验算身份证信息是否正确，我愿称之为绝配小工具！
// @author       chiupam
// @icon         https://kyfw.12306.cn/otn/images/favicon.ico
// @match        https://kyfw.12306.cn/otn/passengers/init
// @match        https://kyfw.12306.cn/otn/view/passengers.html
// @match        https://kyfw.12306.cn/otn/view/passenger_edit.html*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/535141/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%BA%AB%E4%BB%BD%E8%AF%81%E5%8F%B7%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/535141/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%BA%AB%E4%BB%BD%E8%AF%81%E5%8F%B7%E7%A0%81.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ===== 用户配置区域（使用前请修改） =====
  
  // 12306 乘客信息页面的姓名
  const username = "";  // 必填：请填写乘客姓名，例如："张三"
  
  // 12306 乘客信息页面的身份证号（部分已知的信息）
  // 格式1：月日未知 - 例如："1101011990xxxx3319"（中间4位用x表示）
  // 格式2：序列码未知 - 例如："110101199001018xxxx" (已知前14位，最后4位未知)
  // 格式3：序列码未知但知道性别 - 例如："11010119900821xx1x"(男性) "11010119900821xx2x"(女性)
  const knowID = "";  // 必填：请填写部分已知的身份证号

  // 自动操作延迟时间(毫秒)
  const SAVE_DELAY = 5000;      // 填写后等待点击保存的时间
  const CONFIRM_DELAY = 5000;   // 等待点击确认按钮的时间
  const CHECK_DELAY = 5000;     // 检查状态的间隔时间

  // ===== 核心逻辑代码 =====

  // 检查用户配置
  if (!username || !knowID) {
    alert('请先在脚本中配置乘客姓名和部分已知的身份证号！');
    console.error('配置错误：乘客姓名和身份证号不能为空');
    return;
  }

  // 开始执行脚本
  let { func, args } = chooseType(knowID);
  const ID_LIST = func(...args);
  
  // 如果没有生成有效的身份证号，提示用户检查输入
  if (!ID_LIST || ID_LIST.length === 0) {
    alert('未能生成有效的身份证号码，请检查输入格式！');
    console.error('生成身份证号失败：请检查输入格式');
    return;
  }

  console.log(`已生成 ${ID_LIST.length} 个可能的身份证号码`);

  /**
   * 计算身份证校验码
   * @param {string} id17 - 身份证前17位
   * @returns {string} 校验码
   */
  function calculateCheckDigit(id17) {
    const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const checkCodes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let total = 0;

    for (let i = 0; i < 17; i++) {
      total += parseInt(id17[i], 10) * weights[i];
    }

    const remainder = total % 11;
    return checkCodes[remainder];
  }

  /**
   * 判断是否为闰年
   * @param {number} year - 年份
   * @returns {boolean} 是否为闰年
   */
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  /**
   * 生成月日未知的身份证号列表
   * @param {string} addressCode - 地址码
   * @param {string} birthYear - 出生年
   * @param {string} sequenceCode - 顺序码
   * @param {string} genderCode - 性别码
   * @param {string} targetCheck - 目标校验码
   * @param {string} outputMode - 输出模式
   * @returns {Array|void} 身份证号列表或控制台输出
   */
  function idMonthDay(addressCode, birthYear, sequenceCode, genderCode, targetCheck, outputMode = 'list') {
    const validIds = [];
    const leap = isLeapYear(parseInt(birthYear, 10));

    for (let month = 1; month <= 12; month++) {
      let maxDay;

      if ([4, 6, 9, 11].includes(month)) {
        maxDay = 30;
      } else if (month === 2) {
        maxDay = leap ? 29 : 28;
      } else {
        maxDay = 31;
      }

      for (let day = 1; day <= maxDay; day++) {
        const monthStr = String(month).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const id17 = `${addressCode}${birthYear}${monthStr}${dayStr}${sequenceCode}${genderCode}`;
        const checkDigit = calculateCheckDigit(id17);

        if (checkDigit === targetCheck) {
          const fullId = id17 + checkDigit;
          validIds.push(fullId);
          if (outputMode === 'str') {
            console.log(`月份: ${monthStr}, 日期: ${dayStr}, 完整号码: ${fullId}`);
          }
        }
      }
    }

    if (outputMode === 'str') {
      console.log(`共找到 ${validIds.length} 个校验码为 ${targetCheck} 的身份证号码。`);
    } else if (outputMode === 'list') {
      return validIds;
    }
  }

  /**
   * 生成序列码未知的身份证号列表
   * @param {string} addressCode - 地址码
   * @param {string} birthYear - 出生年
   * @param {string} birthMonth - 出生月
   * @param {string} birthDay - 出生日
   * @param {string} genderCode - 性别码
   * @param {string} outputMode - 输出模式
   * @returns {Array|void} 身份证号列表或控制台输出
   */
  function idFromPrefix(addressCode, birthYear, birthMonth, birthDay, genderCode, outputMode = 'list') {
    const validIds = [];
    const prefix = `${addressCode}${birthYear}${birthMonth}${birthDay}`;
    let sequenceRange;

    const genderNum = parseInt(genderCode, 10);
    if (!isNaN(genderNum)) {
      // 如果指定了性别码，只生成对应性别的号码（奇数为男，偶数为女）
      sequenceRange = (genderNum % 2 === 1) ? [1, 3, 5, 7, 9] : [0, 2, 4, 6, 8];
    } else {
      // 如果未指定性别，生成所有可能的顺序码
      sequenceRange = [...Array(10).keys()];
    }

    for (let area = 1; area < 100; area++) {
      const areaCode = String(area).padStart(2, '0');

      for (const i of sequenceRange) {
        const id17 = `${prefix}${areaCode}${i}`;
        const checkDigit = calculateCheckDigit(id17);
        const fullId = id17 + checkDigit;

        validIds.push(fullId);
        if (outputMode === 'str') {
          console.log(`月份: ${birthMonth}, 日期: ${birthDay}, 序列码：${areaCode}，性别码：${i}，校验码：${checkDigit}， 完整号码: ${fullId}`);
        }
      }
    }

    if (outputMode === 'str') {
      console.log(`共找到 ${validIds.length} 个身份证号码。`);
    } else if (outputMode === 'list') {
      return validIds;
    }
  }

  /**
   * 根据输入的身份证号格式选择生成方法
   * @param {string} idNumber - 部分已知的身份证号
   * @param {string} outputMode - 输出模式
   * @returns {Object} 函数和参数
   */
  function chooseType(idNumber, outputMode = 'list') {
    if (idNumber.slice(10, 14) === 'xxxx') {
      // 处理月日未知的情况
      const addressCode = idNumber.slice(0, 6);
      const birthYear = idNumber.slice(6, 10);
      const sequenceCode = idNumber.slice(14, 16);
      const genderCode = idNumber[16];
      const checkDigit = idNumber[17];
      return {
        func: idMonthDay,
        args: [addressCode, birthYear, sequenceCode, genderCode, checkDigit, outputMode]
      };
    } else {
      // 处理序列码未知的情况
      const addressCode = idNumber.slice(0, 6);
      const birthYear = idNumber.slice(6, 10);
      const birthMonth = idNumber.slice(10, 12);
      const birthDay = idNumber.slice(12, 14);
      const genderCode = idNumber[16] || ''; // 性别码可能未知
      return {
        func: idFromPrefix,
        args: [addressCode, birthYear, birthMonth, birthDay, genderCode, outputMode]
      };
    }
  }

  /**
   * 创建日志显示面板
   * @returns {HTMLElement} 日志面板DOM元素
   */
  function createLogDisplay() {
    // 如果已存在日志面板，直接返回
    const existingLog = document.getElementById('scriptLog');
    if (existingLog) return existingLog;

    const logDiv = document.createElement('div');
    logDiv.id = 'scriptLog';
    logDiv.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      width: 400px;
      height: 600px;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 10px;
      border-radius: 5px;
      font-size: 14px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
    `;

    // 创建标题栏
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid rgba(255,255,255,0.3);
    `;
    
    const title = document.createElement('div');
    title.textContent = '自动填写身份证号码 - 状态面板';
    title.style.fontWeight = 'bold';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = '隐藏';
    closeButton.style.cssText = `
      background: #333;
      color: white;
      border: none;
      padding: 3px 8px;
      border-radius: 3px;
      cursor: pointer;
    `;
    closeButton.onclick = function() {
      logDiv.style.height = '30px';
      logDiv.style.width = '200px';
      closeButton.textContent = '显示';
      closeButton.onclick = function() {
        logDiv.style.height = '600px';
        logDiv.style.width = '400px';
        closeButton.textContent = '隐藏';
        closeButton.onclick = arguments.callee.caller;
      };
    };
    
    titleBar.appendChild(title);
    titleBar.appendChild(closeButton);
    
    // 创建状态面板
    const statusPanel = document.createElement('div');
    statusPanel.id = 'statusPanel';
    statusPanel.style.cssText = `
      margin-bottom: 10px;
      padding: 10px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 5px;
    `;

    const currentIndex = GM_getValue('currentIndex', 0);
    const nextId = currentIndex < ID_LIST.length ? ID_LIST[currentIndex] : '已用完';

    statusPanel.innerHTML = `
      <div style="margin-bottom: 5px;">当前进度: ${currentIndex}/${ID_LIST.length}</div>
      <div style="margin-bottom: 5px;">下一个要尝试的号码: ${nextId}</div>
      <div style="margin-bottom: 5px;">剩余数量: ${Math.max(0, ID_LIST.length - currentIndex)}</div>
      <div style="display: flex; justify-content: space-between;">
        <button id="resetIndex" style="
          background: #ff4444;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
        ">重置进度</button>
        <button id="pauseButton" style="
          background: #4444ff;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
        ">暂停</button>
      </div>
    `;

    // 创建日志区域
    const logArea = document.createElement('div');
    logArea.id = 'logArea';
    logArea.style.cssText = `
      flex: 1;
      overflow-y: auto;
      background: rgba(0, 0, 0, 0.3);
      padding: 10px;
      border-radius: 5px;
    `;

    logDiv.appendChild(titleBar);
    logDiv.appendChild(statusPanel);
    logDiv.appendChild(logArea);
    document.body.appendChild(logDiv);

    // 添加按钮事件监听
    setTimeout(() => {
      const resetButton = document.getElementById('resetIndex');
      const pauseButton = document.getElementById('pauseButton');
      
      addResetButtonListener(resetButton);
      
      // 添加暂停按钮功能
      if (pauseButton) {
        const isPaused = GM_getValue('isPaused', false);
        pauseButton.textContent = isPaused ? '继续' : '暂停';
        
        pauseButton.addEventListener('click', () => {
          const currentPaused = GM_getValue('isPaused', false);
          GM_setValue('isPaused', !currentPaused);
          pauseButton.textContent = !currentPaused ? '继续' : '暂停';
          showLog(!currentPaused ? '⏸️ 操作已暂停' : '▶️ 操作已继续');
        });
      }
    }, 0);

    return logDiv;
  }

  let hasLoggedReset = false;

  /**
   * 添加重置按钮事件监听
   * @param {HTMLElement} resetButton - 重置按钮元素
   */
  function addResetButtonListener(resetButton) {
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        if (confirm('确定要重置进度吗？这将从第一个身份证号码重新开始。')) {
          if (!hasLoggedReset) {
            GM_setValue('currentIndex', 0);
            showLog('🔄 进度已重置');
            updateStatus();
            hasLoggedReset = true;
            setTimeout(() => {
              showLog('🔄 即将刷新页面...');
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }, 500);
          }
        }
      });
    }
  }

  /**
   * 更新状态面板
   */
  function updateStatus() {
    const statusPanel = document.getElementById('statusPanel');
    if (statusPanel) {
      const currentIndex = GM_getValue('currentIndex', 0);
      const nextId = currentIndex < ID_LIST.length ? ID_LIST[currentIndex] : '已用完';
      const isPaused = GM_getValue('isPaused', false);
      
      statusPanel.innerHTML = `
        <div style="margin-bottom: 5px;">当前进度: ${currentIndex}/${ID_LIST.length}</div>
        <div style="margin-bottom: 5px;">下一个要尝试的号码: ${nextId}</div>
        <div style="margin-bottom: 5px;">剩余数量: ${Math.max(0, ID_LIST.length - currentIndex)}</div>
        <div style="display: flex; justify-content: space-between;">
          <button id="resetIndex" style="
            background: #ff4444;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
          ">重置进度</button>
          <button id="pauseButton" style="
            background: #4444ff;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
          ">${isPaused ? '继续' : '暂停'}</button>
        </div>
      `;

      const resetButton = document.getElementById('resetIndex');
      const pauseButton = document.getElementById('pauseButton');
      
      addResetButtonListener(resetButton);
      
      // 添加暂停按钮功能
      if (pauseButton) {
        pauseButton.addEventListener('click', () => {
          const currentPaused = GM_getValue('isPaused', false);
          GM_setValue('isPaused', !currentPaused);
          pauseButton.textContent = !currentPaused ? '继续' : '暂停';
          showLog(!currentPaused ? '⏸️ 操作已暂停' : '▶️ 操作已继续');
          updateStatus();
        });
      }
    }
  }

  /**
   * 显示日志消息
   * @param {string} message - 日志消息
   */
  function showLog(message) {
    const logDiv = document.querySelector('#scriptLog') || createLogDisplay();
    const logArea = document.querySelector('#logArea');
    const logEntry = document.createElement('div');
    logEntry.style.cssText = `
      margin-bottom: 5px;
      padding: 5px;
      border-bottom: 1px solid rgba(255,255,255,0.2);
    `;
    logEntry.innerHTML = `${new Date().toLocaleTimeString()} - ${message}`;
    logArea.insertBefore(logEntry, logArea.firstChild);
    console.log(message);
    updateStatus();
  }

  // 创建日志显示面板
  createLogDisplay();

  // 检查是否处于暂停状态
  const isPaused = GM_getValue('isPaused', false);
  if (isPaused) {
    showLog('⏸️ 脚本当前处于暂停状态，点击"继续"按钮恢复操作');
  }

  // 根据页面URL执行不同的操作逻辑
  if (window.location.href.includes('passenger_edit.html')) {
    // 乘客编辑页面逻辑
    handleEditPage();
  } else {
    // 乘客列表页面逻辑
    handleListPage();
  }

  /**
   * 处理乘客编辑页面
   */
  function handleEditPage() {
    showLog('进入编辑页面，准备自动填写身份证号码');
    
    setTimeout(() => {
      if (GM_getValue('isPaused', false)) {
        showLog('⏸️ 操作已暂停，请点击"继续"按钮恢复');
        return;
      }
      
      const cardCodeInput = document.getElementById('cardCode');
      if (cardCodeInput) {
        let currentIndex = GM_getValue('currentIndex', 0);
        if (currentIndex >= ID_LIST.length) {
          showLog('⚠️ 已尝试完所有身份证号码，停止执行');
          return;
        }

        const currentId = ID_LIST[currentIndex];
        showLog(`🔄 第${currentIndex + 1}/${ID_LIST.length}个: ${currentId}`);
        cardCodeInput.value = currentId;

        // 更新索引到下一个
        GM_setValue('currentIndex', currentIndex + 1);

        // 触发输入事件
        const event = new Event('input', { bubbles: true });
        cardCodeInput.dispatchEvent(event);

        // 等待后点击保存按钮
        showLog(`⏳ 等待${SAVE_DELAY/1000}秒后将点击保存按钮...`);
        setTimeout(() => {
          if (GM_getValue('isPaused', false)) {
            showLog('⏸️ 操作已暂停，请点击"继续"按钮恢复');
            return;
          }
          
          const saveButton = document.querySelector('.btn.btn-primary');
          if (saveButton) {
            showLog('👆 点击保存按钮');
            saveButton.click();

            showLog('👀 等待确认按钮出现...');
            let buttonCheckAttempts = 0;
            const maxAttempts = 50; // 最多检查50次
            
            const checkOkButton = setInterval(() => {
              if (GM_getValue('isPaused', false)) {
                showLog('⏸️ 操作已暂停，请点击"继续"按钮恢复');
                clearInterval(checkOkButton);
                return;
              }
              
              buttonCheckAttempts++;
              if (buttonCheckAttempts > maxAttempts) {
                clearInterval(checkOkButton);
                showLog('⚠️ 确认按钮检查超时，尝试返回列表页');
                // 尝试返回列表页
                const backButton = document.querySelector('.goback');
                if (backButton) {
                  backButton.click();
                } else {
                  // 如果没有返回按钮，尝试返回上一页
                  window.history.back();
                }
                return;
              }
              
              const okButton = document.querySelector('.btn.btn-primary.ok');
              if (okButton) {
                showLog(`⏳ 找到确认按钮，${CONFIRM_DELAY/1000}秒后点击...`);
                setTimeout(() => {
                  if (GM_getValue('isPaused', false)) {
                    showLog('⏸️ 操作已暂停，请点击"继续"按钮恢复');
                    return;
                  }
                  showLog('👆 点击确认按钮');
                  okButton.click();
                }, CONFIRM_DELAY);
                clearInterval(checkOkButton);
              }
            }, 100);
          } else {
            showLog('⚠️ 未找到保存按钮');
          }
        }, SAVE_DELAY);
      } else {
        showLog('⚠️ 未找到身份证输入框');
      }
    }, 3000);
  }

  /**
   * 处理乘客列表页面
   */
  function handleListPage() {
    const currentIndex = GM_getValue('currentIndex', 0);
    if (currentIndex >= ID_LIST.length) {
      showLog('⚠️ 所有号码已尝试完毕，停止检查');
      return;
    }

    showLog('进入列表页面，等待检查状态...');
    let hasLoggedError = false;

    /**
     * 检查乘客状态并点击编辑按钮
     */
    function checkAndClick() {
      if (GM_getValue('isPaused', false)) {
        showLog('⏸️ 操作已暂停，请点击"继续"按钮恢复');
        return;
      }
      
      // 检查页面是否正在加载
      const loadingIndicator = document.querySelector('.loading-mask');
      if (loadingIndicator && loadingIndicator.style.display !== 'none') {
        showLog(`⏳ 页面加载中，${CHECK_DELAY/1000}秒后重试...`);
        setTimeout(checkAndClick, CHECK_DELAY);
        return;
      }

      // 查找匹配乘客姓名的元素
      const nameElements = Array.from(document.querySelectorAll('.name-yichu')).filter(el =>
        el.textContent.trim() === username
      );

      if (nameElements.length === 0) {
        showLog(`❌ 未找到${username}的信息，请检查姓名是否正确`);
        return;
      }

      nameElements.forEach(nameElement => {
        const row = nameElement.closest('tr');
        if (!row) return;

        const statusBox = row.querySelector('.verification-status-box .verification-status-user');
        if (!statusBox) {
          if (!hasLoggedError) {
            showLog(`⏳ 状态框未加载，${CHECK_DELAY/1000}秒后重试...`);
          }
          setTimeout(checkAndClick, CHECK_DELAY);
          return;
        }

        // 检查是否为错误状态
        if (statusBox.classList.contains('user-check-error')) {
          if (!hasLoggedError) {
            showLog(`🔍 发现错误状态，等待${CHECK_DELAY/1000}秒后确认...`);
            hasLoggedError = true;
            setTimeout(() => {
              if (GM_getValue('isPaused', false)) {
                showLog('⏸️ 操作已暂停，请点击"继续"按钮恢复');
                hasLoggedError = false;
                return;
              }
              
              if (statusBox.classList.contains('user-check-error')) {
                const editButton = row.querySelector('.one-edit');
                if (editButton) {
                  showLog('👆 点击编辑按钮');
                  editButton.click();
                } else {
                  showLog('⚠️ 未找到编辑按钮');
                }
              }
              hasLoggedError = false;
            }, CHECK_DELAY);
          }
        } else {
          // 状态正常，可能已找到正确的身份证号
          if (!hasLoggedError) {
            const currentIndex = GM_getValue('currentIndex', 0);
            const lastId = currentIndex > 0 ? ID_LIST[currentIndex - 1] : '未知';
            showLog(`✅ 状态正常，当前身份证号码: ${lastId}`);
            
            // 创建提示成功的通知
            const successNotice = document.createElement('div');
            successNotice.style.cssText = `
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: rgba(0, 128, 0, 0.9);
              color: white;
              padding: 20px;
              border-radius: 10px;
              font-size: 16px;
              text-align: center;
              z-index: 10000;
              box-shadow: 0 0 20px rgba(0,0,0,0.5);
            `;
            successNotice.innerHTML = `
              <h3 style="margin-top: 0;">成功找到正确的身份证号码</h3>
              <p>乘客: ${username}</p>
              <p>身份证号: ${lastId}</p>
              <button id="closeSuccess" style="
                background: white;
                color: green;
                border: none;
                padding: 5px 15px;
                border-radius: 5px;
                margin-top: 10px;
                cursor: pointer;
                font-weight: bold;
              ">确定</button>
            `;
            
            document.body.appendChild(successNotice);
            
            document.getElementById('closeSuccess').addEventListener('click', () => {
              successNotice.remove();
            });
            
            hasLoggedError = true;
          }
        }
      });
    }

    // 首次检查延迟
    setTimeout(checkAndClick, 3000);

    // 设置页面变化监听
    const observer = new MutationObserver((mutations) => {
      if (currentIndex < ID_LIST.length && !GM_getValue('isPaused', false)) {
        setTimeout(checkAndClick, 3000);
      }
    });

    const config = {
      childList: true,
      subtree: true
    };

    observer.observe(document.body, config);
  }
})();