// ==UserScript==
// @name        搜题小帮手｜超全题库，方便快捷，一步到位
// @version      0.7
// @description  搜题就用小帮手，支持复制、图片搜题，题库超全！
// @author       soti
// @match        *://*/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.7.16/vue.min.js

// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js
// @license GUN
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @connect      studypro.club
// @grant        GM_setValue
// @grant        GM_getValue
// @antifeature  payment  脚本题目搜索，需对接第三方接口付费
// @namespace https://greasyfork.org/users/736514
// @downloadURL https://update.greasyfork.org/scripts/534185/%E6%90%9C%E9%A2%98%E5%B0%8F%E5%B8%AE%E6%89%8B%EF%BD%9C%E8%B6%85%E5%85%A8%E9%A2%98%E5%BA%93%EF%BC%8C%E6%96%B9%E4%BE%BF%E5%BF%AB%E6%8D%B7%EF%BC%8C%E4%B8%80%E6%AD%A5%E5%88%B0%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/534185/%E6%90%9C%E9%A2%98%E5%B0%8F%E5%B8%AE%E6%89%8B%EF%BD%9C%E8%B6%85%E5%85%A8%E9%A2%98%E5%BA%93%EF%BC%8C%E6%96%B9%E4%BE%BF%E5%BF%AB%E6%8D%B7%EF%BC%8C%E4%B8%80%E6%AD%A5%E5%88%B0%E4%BD%8D.meta.js
// ==/UserScript==
$(document).ready(function() {

  if (window.self !== window.top) {
    return;
  }

  // 添加CSS作用域前缀函数
  function addCSSScope(css, scope = '#tikuHelper') {
    // 匹配CSS规则
    return css.replace(
      /([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g,
      function(match, selector, delimiter) {
        // 检查选择器是否已经有作用域或是全局选择器
        if (selector.indexOf(scope) !== -1 ||
            selector.trim().startsWith('body >') ||
            selector.trim().startsWith('@keyframes')) {
          return match;
        }

        // 添加作用域
        return scope + ' ' + selector + delimiter;
      }
    );
  }

  // 用户数据管理
  const UserDataManager = {
    _subscribers: { phone: [] }, // Observer pattern: Store subscribers

    // 默认用户数据
    defaultUserData: {
      remainCount: 0,        // 剩余使用次数
      totalUsed: 0,           // 总共已使用次数
      lastResetTime: 0,       // 上次重置时间(时间戳)
      phone: "",              // 用户手机号
      isPaid: false,          // 是否为付费用户
      autoClipboardSearch: false // 自动剪贴板搜索开关，默认关闭
    },

    // 获取用户数据
    getUserData() {
      const userData = GM_getValue("userData");
      if (!userData) {
        return this.defaultUserData;
      }
      try {
        return JSON.parse(userData);
      } catch (e) {
        return this.defaultUserData;
      }
    },

    // 保存用户数据
    saveUserData(userData) {
      GM_setValue("userData", JSON.stringify(userData));
    },

    // 获取手机号
    getPhone() {
      return this.getUserData().phone || "";
    },

    // 保存手机号
    savePhone(phone) {
      const userData = this.getUserData();
      const oldPhone = userData.phone;
      if (oldPhone !== phone) { // Only notify if phone actually changed
        userData.phone = phone;
        this.saveUserData(userData);
        // Notify subscribers
        this._notifySubscribers("phone", phone);
      }
    },

    // Observer: Subscribe to phone changes
    subscribePhoneChange(callback) {
      if (typeof callback === 'function') {
        this._subscribers.phone.push(callback);
      }
    },

    // Observer: Notify subscribers
    _notifySubscribers(key, value) {
      if (this._subscribers[key]) {
        this._subscribers[key].forEach(callback => callback(value));
      }
    },

    // 获取剩余次数
    getRemainingCount() {
      return this.getUserData().remainCount;
    },

    // 设置剩余次数
    setRemainingCount(count) {
      const userData = this.getUserData();
      userData.remainCount = count;
      this.saveUserData(userData);
      return count;
    },

    // 检查剩余次数是否足够
    hasRemainingCount() {
      return this.getRemainingCount() > 0;
    },

    // 减少使用次数
    decreaseRemainingCount() {
      const userData = this.getUserData();
      userData.remainCount = Math.max(0, userData.remainCount - 1);
      userData.totalUsed += 1;
      this.saveUserData(userData);
      return userData.remainCount;
    },

    // 获取自动剪贴板搜索设置
    getAutoClipboardSearch() {
      return this.getUserData().autoClipboardSearch;
    },

    // 设置自动剪贴板搜索
    setAutoClipboardSearch(enabled) {
      const userData = this.getUserData();
      userData.autoClipboardSearch = enabled;
      this.saveUserData(userData);
      return enabled;
    },

    // 查询剩余次数
    async queryRemainingCount(phone) {
      if (!phone || phone.trim() === '') {
        return 0;
      }

      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'https://so.studypro.club/api/getphone',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: `phone=${encodeURIComponent(phone)}`,
          responseType: "json",
          onload: function(r) {
            try {
              // 直接使用返回的数字
              const result = r.response;
              // 确保结果是数字类型，如果不是则转换，如果转换失败则默认为0
              const count = typeof result === 'number' ? result :
                          (parseInt(result) || 0);

              // 更新本地存储
              UserDataManager.setRemainingCount(count);
              resolve(count);
            } catch (err) {
              console.error('解析剩余次数失败:', err);
              resolve(0);
            }
          },
          onerror: function(err) {
            console.error('查询剩余次数失败:', err);
            resolve(0);
          }
        });
      });
    }
  };

  // 购买功能管理
  const PurchaseManager = {
    // 购买页面URL
    purchaseUrl: 'https://so.studypro.club',

    // 价格配置
    priceConfig: {
      "30": 100,
      "800": 500,
      "3000": 1000,
      "1000000": 30000
    },

    // 显示购买提示弹窗
    showPurchaseDialog() {
      const remainCount = UserDataManager.getRemainingCount();
      const phone = UserDataManager.getPhone();

      // 创建弹窗元素
      const dialogHtml = `
        <div class="purchase-dialog" data-soti-dialog="true">
          <div class="purchase-dialog-content">
            <div class="purchase-dialog-header">
              <h3>使用次数不足</h3>
              <span class="purchase-dialog-close"></span>
            </div>
            <div class="purchase-dialog-body">
              <p>您的剩余使用次数为 <span class="highlight">${remainCount}</span> 次</p>
              <p>购买更多次数以继续使用搜题功能</p>
            </div>
            <div class="purchase-dialog-footer">
              <button class="btn primary purchase-btn">立即购买</button>
              <button class="btn bordered cancel-btn">取消</button>
            </div>
          </div>
        </div>
      `;

      // 添加到页面
      $('body').append(dialogHtml);

      // 绑定事件
      $('.purchase-dialog-close, .cancel-btn').on('click', function() {
        // 添加淡出动画
        $('.purchase-dialog-content').css({
          'animation': 'slideOutRight 0.3s ease forwards'
        });

        // 动画结束后移除元素
        setTimeout(() => {
          $('.purchase-dialog').remove();
        }, 300);
      });

      $('.purchase-btn').on('click', function() {
        const redirectUrl = `${PurchaseManager.purchaseUrl}?phone=${encodeURIComponent(phone || '')}`;
        //window.open(redirectUrl, '_blank');

        // 添加淡出动画
        $('.purchase-dialog-content').css({
          'animation': 'slideOutRight 0.3s ease forwards'
        });

        // 动画结束后移除元素
        setTimeout(() => {
          $('.purchase-dialog').remove();
        }, 300);
      });
    },

    // 跳转到购买页面
    redirectToPurchase() {
      const phone = UserDataManager.getPhone();
      const redirectUrl = `${this.purchaseUrl}?phone=${encodeURIComponent(phone || '')}`;
      //window.open(redirectUrl, '_blank');

      // 切换到购买标签页
      const tikuHelper = document.getElementById('tikuHelper');
      if (tikuHelper) {
        const vueInstance = tikuHelper.__vue__;
        if (vueInstance) {
          vueInstance.switchToTab(1); // Use the new public method
        }
      }
    },

    // 购买次数
    purchaseCount(phone, value) {
      return new Promise((resolve, reject) => {
        if (!phone || phone.trim() === '') {
          reject(new Error('请输入手机号'));
          return;
        }

        // 修改为使用URLSearchParams格式传递参数
        const params = new URLSearchParams();
        params.append('phone', phone);
        params.append('value', value);

        axios({
          method: 'post',
          url: 'https://so.studypro.club/api/payphone',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: params
        }).then(function (response) {
          console.log(response.data);
          resolve(response.data);
        }).catch(function (error) {
          console.error('购买请求失败:', error);
          reject(error);
        });
      });
    }
  };

  // 简单的消息提示组件
  const MessageManager = {
    // 添加消息计数和位置调整
    _messageCount: 0,
    _messages: [],

    _createMessage(type, text, duration = 3000) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message message-${type}`;
      messageDiv.setAttribute('data-soti-message', 'true');
      messageDiv.innerHTML = `
        <div class="message-content">
          <i class="message-icon icon-${type}"></i>
          <span>${text}</span>
        </div>
      `;

      // 计算位置
      const messageId = this._messageCount++;
      const offset = this._messages.length * 10 + this._messages.reduce((acc, el) => acc + el.offsetHeight + 10, 0);
      messageDiv.style.top = `${20 + offset}px`;

      document.body.appendChild(messageDiv);
      this._messages.push(messageDiv);

      // 显示动画
      setTimeout(() => {
        messageDiv.classList.add('show');
      }, 10);

      // 自动关闭
      setTimeout(() => {
        messageDiv.classList.remove('show');

        // 移除元素
        setTimeout(() => {
          const index = this._messages.indexOf(messageDiv);
          if (index > -1) {
            this._messages.splice(index, 1);
            this._adjustMessagePositions();
          }
          document.body.removeChild(messageDiv);
        }, 300);
      }, duration);
    },

    // 调整所有消息的位置
    _adjustMessagePositions() {
      let offset = 0;
      this._messages.forEach(message => {
        message.style.top = `${20 + offset}px`;
        offset += message.offsetHeight + 10;
      });
    },

    success(text, duration) {
      this._createMessage('success', text, duration);
    },

    error(text, duration) {
      this._createMessage('error', text, duration);
    },

    warning(text, duration) {
      this._createMessage('warning', text, duration);
    },

    info(text, duration) {
      this._createMessage('info', text, duration);
    }
  };

  // Tab 组件
  Vue.component('soti-tab', {
    props: ['activeTabIndex'], // 接收父组件传递的激活索引
    data: function () {
      return {
        tabList: [
          { name: '搜题'},
          { name: '购买'},
          { name: '通知'} // 添加通知标签
        ]
        // currentIndex: 0 // 移除内部状态，依赖父组件传递
      }
    },
    template: `
      <div class="tab-container">
        <div v-for="(tab, idx) in tabList" class="tab" v-bind:class="{ active: activeTabIndex == idx }" @click="switchTab(idx)">{{tab.name}}</div>
      </div>
    `,
    methods: {
      switchTab(idx) {
        // this.currentIndex = idx; // 移除内部状态更新
        this.$emit('switch-tab', idx); // 通知父组件切换
      }
    }
  });

  // Header
  Vue.component('soti-header', {
    template: `
      <div id="myHeader" class="header">
        <div>搜题小帮手</div>
        <div class="close-icon" @click="closeEv"></div>
      </div>
    `,
    mounted() {
      this.makeDraggable(this.state, document.getElementById(this.draggleId), document.getElementById(this.targetId));
    },
    data: function() {
      return {
        draggleId: 'myHeader',
        targetId: 'tikuHelper',
        state: {
          dragging: false,
          initX: 0,
          initY: 0,
          transX: 0,
          transY: 0,
          moveX: 0,
          moveY: 0,
        }
      }
    },
    methods: {
      closeEv() {
        toggleOpenClose();
      },

      makeDraggable(state, el, target) {
        function globalMousemove(event) {
          const { clientX, clientY } = event;
          const { initX, initY, transX, transY } = state;
          const moveX = clientX - initX;
          const moveY = clientY - initY;
          target.style.transform = `translate(${transX + moveX}px, ${transY + moveY}px)`;
          state.moveX = moveX;
          state.moveY = moveY;
          state.dragging = true;
        }

        function globalMouseup(_event) {
          const { transX, transY, moveX, moveY } = state;
          state.transX = transX + moveX;
          state.transY = transY + moveY;
          state.moveX = 0;
          state.moveYY = 0;
          document.removeEventListener('mousemove', globalMousemove);
          document.removeEventListener('mouseup', globalMouseup);
          state.dragging = null;
        }

        function mousedown(event) {
          const {clientX, clientY} = event;
          state.initX = clientX;
          state.initY = clientY;
          document.addEventListener('mousemove', globalMousemove);
          document.addEventListener('mouseup', globalMouseup);
        }

        el.addEventListener('mousedown', mousedown);
      }
    }
  });

  // 搜索
  Vue.component('soti-content-search', {
    template: `
      <div class="content-search-container">
        <div class="user-info">
          <div class="phone-container">
            <input type="text" placeholder="请输入手机号" class="phone-input" v-model="phone" @input="handlePhoneInput"/>
            <button class="query-btn" @click="queryRemainingCount">查询</button>
          </div>
          <div class="usage-info">
            <div class="count-display" :class="{'count-warning': remainCount <= 3}">
              剩余次数: <span>{{remainCount}}</span>
            </div>
            <button class="buy-btn" @click="handleBuy">购买</button>
          </div>
        </div>

        <div class="clipboard-toggle">
          <label class="toggle-switch">
            <input type="checkbox" v-model="autoClipboardSearch" @change="toggleAutoClipboardSearch">
            <span class="toggle-slider"></span>
          </label>
          <span class="toggle-label">自动读取剪贴板并搜索</span>
        </div>

        <div class="editor-outer">
          <div id="editor-container" contenteditable="true" class="editable-div"  @keyup.enter.prevent ="search"></div>
          <div class="upload-progress">
            <div class="upload-progress-inner"></div>
          </div>
          <div class="tool-bar">
            <button class="tool-btn upload-btn" @click="openFileUpload" title="上传图片">
              上传图片
            </button>
            <button class="tool-btn read-clipboard-btn" @click="readClipboardAndSearch" title="读取剪贴板">
              读取剪贴板
            </button>
            <button class="tool-btn paste-btn" @click="pasteAndSearchBest" title="粘贴并搜索">
              粘贴并搜索
            </button>

            <button class="tool-btn search-btn" @click="search" title="搜索">
              <i class="icon-search"></i>搜索
            </button>
          </div>
        </div>

        <div class="progress-container" v-if="isSearching">
          <div class="progress-bar">
            <div class="progress-inner"></div>
          </div>
          <div class="progress-text">正在搜索中...</div>
        </div>

        <div class="results-panel">
          <div class="empty-state" v-if="!isSearching && results.length === 0">
            <div class="empty-icon"></div>
            <div class="empty-text">输入问题或粘贴内容开始搜索</div>
          </div>
          <div class="results-list" v-if="!isSearching && results.length > 0">
            <div class="result-card" v-for="(item, index) in results" :key="index">
              <div class="result-header">
                <span class="result-number">{{index + 1}}</span>
                <span class="result-similarity" v-if="item.scores">相似度: {{item.scores}}%</span>
              </div>
              <div class="result-question" v-html="item.question"></div>
              <div class="result-answer" v-if="item.answer">
                <div class="answer-label">答案:</div>
                <div class="result-answer-content" v-html="item.answer"></div>
              </div>
              <div class="result-analysis" v-if="item.analysis">
                <div class="analysis-label">解析:</div>
                <div class="result-analysis-content" v-html="item.analysis"></div>
              </div>
            </div>
          </div>
          <div class="scroll-indicator" v-if="!isSearching && results.length > 5">
            向下滚动查看更多结果
          </div>
        </div>
      </div>
    `,
    data: function() {
      return {
        phone: UserDataManager.getPhone(),
        remainCount: UserDataManager.getRemainingCount(),
        isQuerying: false,
        isSearching: false,
        phoneInputTimer: null,
        autoClipboardSearch: UserDataManager.getAutoClipboardSearch(),
        results: [],
        fileInput: null,
        progressBar: null,
        dataQueried: false, // 标记是否已查询过数据
        clipboardMonitorInterval: null // 剪贴板监控定时器
      }
    },
    watch: {
      // 监听手机号变化
      phone(newVal, oldVal) {
        // 保存到本地存储
        UserDataManager.savePhone(newVal);
        // 清除之前的定时器
        if (this.phoneInputTimer) {
          clearTimeout(this.phoneInputTimer);
        }

        // 如果输入的是11位数字，延迟500ms后自动查询
        if (/^1\d{10}$/.test(newVal) && this.dataQueried) {
          this.phoneInputTimer = setTimeout(() => {
            this.queryRemainingCount();
          }, 500);
        }
      },

      // 监听结果变化，更新滚动指示器
      results() {
        this.$nextTick(() => {
          this.updateScrollIndicator();
          this.setupExpandCollapse();
        });
      }
    },
    mounted() {
      // 自动查询剩余次数（如果有手机号）
      if (this.phone && /^1\d{10}$/.test(this.phone)) {
        this.queryRemainingCount();
      }

      // 设置粘贴监听
      this.setupPasteListener();

      // 设置全局快捷键
      this.setupShortcuts();

      // 设置结果面板滚动监听
      this.setupScrollListener();

      // 设置拖放支持
      this.setupDragAndDrop();

      // 初始化上传进度条
      this.initUploadProgress();

      // 确保结果面板可以正确滚动
      this.ensureScrollable();

      // 设置剪贴板监控
      this.setupClipboardMonitor();
    },
    beforeDestroy() {
      // 清除剪贴板监控定时器
      if (this.clipboardMonitorInterval) {
        clearInterval(this.clipboardMonitorInterval);
      }
    },
    methods: {
      // 设置剪贴板监控
      setupClipboardMonitor() {
        // 上一次剪贴板内容
        let lastClipboardContent = '';

        // 每秒检查一次剪贴板
        this.clipboardMonitorInterval = setInterval(() => {
          if (this.autoClipboardSearch) {
            navigator.clipboard.readText()
              .then(text => {
                // 限制剪贴板内容不超过300字
                if (text && text.length > 300) {
                  text = text.substring(0, 300);
                }

                // 如果剪贴板内容不为空，且与上次不同，且长度大于1
                if (text && text.trim() !== '' && text !== lastClipboardContent && text.trim().length > 1) {
                  lastClipboardContent = text;

                  // 清空编辑器
                  const editor = document.getElementById('editor-container');
                  editor.innerHTML = ''; // Clear content

                  // 插入文本
                  editor.innerText = text; // Insert text

                  // 提示粘贴成功
                  MessageManager.success('已自动读取剪贴板内容，正在搜索...');

                  // 自动搜索
                  this.fetchAnswer(text);
                }
              })
              .catch(error => {
                // 剪贴板读取错误，静默处理
                console.error('剪贴板读取错误:', error);
              });
          }
        }, 1000);
      },

      // 切换自动剪贴板搜索
      toggleAutoClipboardSearch() {
        UserDataManager.setAutoClipboardSearch(this.autoClipboardSearch);
        if (this.autoClipboardSearch) {
          MessageManager.info('已开启自动读取剪贴板并搜索');
        } else {
          MessageManager.info('已关闭自动读取剪贴板并搜索');
        }
      },

      // 查询剩余次数
      async queryRemainingCount() {
        if (!this.phone || this.phone.trim() === '') {
          return;
        }

        // 验证手机号格式
        if (!/^1\d{10}$/.test(this.phone)) {
          MessageManager.error('请输入正确的手机号');
          return;
        }

        this.isQuerying = true;

        try {
          // 调用API查询剩余次数
          const count = await UserDataManager.queryRemainingCount(this.phone);
          this.remainCount = count;
          this.dataQueried = true; // 标记已查询过数据

          // 显示查询结果
          if (count > 0) {
            //MessageManager.success(`查询成功，剩余${count}次`);
          } else {
            MessageManager.warning('剩余次数为0，请购买');
          }
        } catch (error) {
          console.error('查询失败:', error);
          MessageManager.error('查询失败，请重试');
        } finally {
          this.isQuerying = false;
        }
      },

      // 处理手机号输入
      handlePhoneInput() {
        // 限制只能输入数字
        this.phone = this.phone.replace(/\D/g, '');

        // 限制最大长度为11位
        if (this.phone.length > 11) {
          this.phone = this.phone.slice(0, 11);
        }
      },

      handleBuy() {
        PurchaseManager.redirectToPurchase();
      },

      // 搜索
      search() {
        const editor = document.getElementById('editor-container');
        const imgElement = editor.querySelector('img');
        const textContent = editor.innerText.trim();
        let question = '';

        if (imgElement && imgElement.src) {
          let base64 = imgElement.src;
          // Ensure it's a data URL before processing
          if (base64.startsWith('data:image')) {
            this.processImage(base64);
          } else {
             MessageManager.warning('无效的图片内容');
          }
        } else if (textContent) {
          question = textContent.replace(/\n|\t/g, '');
          // 限制文本长度不超过300字
          if (question.length > 300) {
            question = question.substring(0, 300);
            // 更新编辑器内容
            editor.innerText = question; // Update editor content
            MessageManager.warning('内容已超过300字，已自动截取前300字');
          }
          this.fetchAnswer(question);
        } else {
          MessageManager.warning('请输入文字或粘贴图片');
        }
      },

      // 清空内容
      clearContent() {
        const editor = document.getElementById("editor-container");
        editor.innerHTML = ''; // Clear content
        MessageManager.info("内容已清空");
      },

      // 处理图片进行OCR识别
      processImage(imgData) {
        // 将base64图片数据转换为Blob对象
        const byteString = atob(imgData.split(',')[1]);
        const mimeString = imgData.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([ab], { type: mimeString });

        // 调用OCR识别
        this.imgHandle(imgData).then(processedBlob => {
          this.imgOcr(processedBlob).then(text => {
            if (text && text.trim() !== '') {
              // 限制文本长度不超过300字
              if (text.length > 300) {
                text = text.substring(0, 300);
                MessageManager.warning('识别内容已超过300字，已自动截取前300字');
              }
              // 自动搜索识别出的文本
              this.fetchAnswer(text);
            } else {
              MessageManager.warning('未能识别出文字，请手动输入或重新上传图片');
            }
          }).catch(error => {
            console.error('OCR识别失败:', error);
            MessageManager.error('图片识别失败，请重试');
          });
        }).catch(error => {
          console.error('图片处理失败:', error);
          MessageManager.error('图片处理失败，请重试');
        });
      },

      // 粘贴并搜索
      pasteAndSearch() {
        // 请求剪贴板权限并获取内容
        navigator.clipboard.read()
          .then(clipboardItems => {
            // 处理剪贴板中的每个项目
            for (const clipboardItem of clipboardItems) {
              // 检查是否有图片
              if (clipboardItem.types.includes('image/png') ||
                  clipboardItem.types.includes('image/jpeg') ||
                  clipboardItem.types.includes('image/gif')) {

                // 获取图片类型
                const imageType = clipboardItem.types.find(type => type.startsWith('image/'));

                // 获取图片数据
                clipboardItem.getType(imageType)
                  .then(blob => {
                    // 将Blob转换为base64
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      const imgData = e.target.result;

                      // 将图片插入编辑器
                      this.insertImageToEditor(imgData);

                      // 提示粘贴成功
                      MessageManager.success('图片粘贴成功，正在识别...');

                      // 处理图片并搜索
                      this.processImage(imgData);
                    };
                    reader.readAsDataURL(blob);
                  })
                  .catch(error => {
                    console.error('获取剪贴板图片失败:', error);
                    MessageManager.error('获取剪贴板图片失败');
                  });

                return; // 找到图片后退出循环
              }
            }

            navigator.clipboard.readText()
              .then(text => {
                if (text && text.trim() !== '') {
                  // 限制文本长度不超过300字
                  if (text.length > 300) {
                    text = text.substring(0, 300);
                    MessageManager.warning('剪贴板内容已超过300字，已自动截取前300字');
                  }

                  // 清空编辑器
                  const editor = document.getElementById('editor-container');
                  editor.innerHTML = ''; // Clear content

                  // 插入文本
                  editor.innerText = text; // Insert text

                  // 提示粘贴成功
                  MessageManager.success('文本粘贴成功，正在搜索...');

                  // 自动搜索
                  this.fetchAnswer(text);
                } else {
                  MessageManager.warning('剪贴板中没有内容');
                }
              })
              .catch(error => {
                console.error('获取剪贴板文本失败:', error);
                MessageManager.error('获取剪贴板内容失败');
              });
          })
          .catch(error => {
            console.error('读取剪贴板失败:', error);

            // 降级方案：尝试只读取文本
            navigator.clipboard.readText()
              .then(text => {
                if (text && text.trim() !== '') {
                  // 限制文本长度不超过300字
                  if (text.length > 300) {
                    text = text.substring(0, 300);
                    MessageManager.warning('剪贴板内容已超过300字，已自动截取前300字');
                  }

                  // 清空编辑器
                  const editor = document.getElementById('editor-container');
                  editor.innerHTML = ''; // Clear content

                  // 插入文本
                  editor.innerText = text; // Insert text

                  // 提示粘贴成功
                  MessageManager.success('文本粘贴成功，正在搜索...');

                  // 自动搜索
                  this.fetchAnswer(text);
                } else {
                  MessageManager.warning('剪贴板中没有内容');
                }
              })
              .catch(err => {
                MessageManager.error('无法访问剪贴板，请检查浏览器权限设置');
              });
          });
      },

      // 检查剪贴板API兼容性
      checkClipboardSupport() {
        if (!navigator.clipboard) {
          console.warn('浏览器不支持Clipboard API');
          return false;
        }

        if (!navigator.clipboard.read) {
          console.warn('浏览器不支持Clipboard.read API');
          return false;
        }

        return true;
      },

      // 根据浏览器兼容性选择粘贴方法
      pasteAndSearchBest() {
        if (this.checkClipboardSupport()) {
          this.pasteAndSearch();
        } else {
          // 降级方案：提示用户手动粘贴
          MessageManager.info('请手动粘贴内容到编辑框中');

          // 聚焦到编辑器
          const editorElement = document.querySelector('#editor-container');
          editorElement.focus();
        }
      },

      // 新增：读取剪贴板并搜索
      readClipboardAndSearch() {
        if (!this.checkClipboardSupport()) {
          MessageManager.info('请手动粘贴内容到编辑框中');
          const editorElement = document.getElementById('editor-container');
          editorElement.focus();
          return;
        }

        navigator.clipboard.read().then(clipboardItems => {
          let foundImage = false;
          for (const item of clipboardItems) {
            const imageType = item.types.find(type => type.startsWith('image/'));
            if (imageType) {
              foundImage = true;
              item.getType(imageType).then(blob => {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const imgData = e.target.result;
                  this.insertImageToEditor(imgData);
                  MessageManager.success('图片读取成功，正在识别...');
                  this.processImage(imgData);
                };
                reader.readAsDataURL(blob);
              }).catch(error => {
                console.error('读取剪贴板图片失败:', error);
                MessageManager.error('读取剪贴板图片失败');
              });
              break; // Process first image found
            }
          }

          if (!foundImage) {
            navigator.clipboard.readText().then(text => {
              if (text && text.trim() !== '') {
                if (text.length > 300) {
                  text = text.substring(0, 300);
                  MessageManager.warning('剪贴板内容已超过300字，已自动截取前300字');
                }
                const editor = document.getElementById('editor-container');
                editor.innerHTML = ''; // Clear editor
                editor.innerText = text; // Insert text
                MessageManager.success('文本读取成功，正在搜索...');
                this.fetchAnswer(text);
              } else {
                MessageManager.warning('剪贴板中没有可识别的内容');
              }
            }).catch(error => {
              console.error('读取剪贴板文本失败:', error);
              MessageManager.error('读取剪贴板文本失败');
            });
          }
        }).catch(error => {
          console.error('读取剪贴板失败:', error);
          // Fallback for browsers that might not support read() but support readText()
          navigator.clipboard.readText().then(text => {
            if (text && text.trim() !== '') {
              if (text.length > 300) {
                text = text.substring(0, 300);
                MessageManager.warning('剪贴板内容已超过300字，已自动截取前300字');
              }
              const editor = document.getElementById('editor-container');
              editor.innerHTML = ''; // Clear editor
              editor.innerText = text; // Insert text
              MessageManager.success('文本读取成功，正在搜索...');
              this.fetchAnswer(text);
            } else {
              MessageManager.warning('剪贴板中没有可识别的内容');
            }
          }).catch(err => {
            MessageManager.error('无法访问剪贴板，请检查浏览器权限设置');
          });
        });
      },

      // 监听编辑器粘贴事件
      setupPasteListener() {
        const editorElement = document.getElementById("editor-container");

        // 监听编辑器的粘贴事件
        editorElement.addEventListener("paste", (e) => {
          // 阻止默认粘贴行为，以便我们可以处理它
          e.preventDefault();
          const clipboardData = e.clipboardData || window.clipboardData;
          let pastedData = "";
          let isImage = false;

          // 检查是否有图片
          if (clipboardData.files && clipboardData.files.length > 0) {
            const file = clipboardData.files[0];
            if (file.type.startsWith("image/")) {
              isImage = true;
              const reader = new FileReader();
              reader.onload = (event) => {
                const imgData = event.target.result;
                this.insertImageToEditor(imgData);
                MessageManager.success("图片粘贴成功，正在识别...");
                this.processImage(imgData);
              };
              reader.readAsDataURL(file);
            }
          }

          // 如果不是图片，获取文本
          if (!isImage) {
            pastedData = clipboardData.getData("text/plain");
            if (pastedData && pastedData.trim() !== "") {
              // 限制文本长度
              if (pastedData.length > 300) {
                pastedData = pastedData.substring(0, 300);
                MessageManager.warning("粘贴内容已超过300字，已自动截取前300字");
              }
              // 清空并插入文本
              editorElement.innerHTML = "";
              editorElement.innerText = pastedData;
              MessageManager.success("文本粘贴成功");

              // 如果自动搜索开启，则搜索
              if (this.autoClipboardSearch) {
                 MessageManager.info("正在自动搜索...");
                 this.fetchAnswer(pastedData);
              }
            }
          }
        });
      },

      // 设置全局快捷键
      setupShortcuts() {
        // 监听Ctrl+V或Command+V
        document.addEventListener("keydown", (e) => {
          // 检查是否是粘贴快捷键
          if ((e.ctrlKey || e.metaKey) && e.key === "v") {
            // 如果焦点不在编辑器内，且工具面板可见，则触发粘贴并搜索
            const editorElement = document.getElementById("editor-container");
            const toolPanel = document.getElementById("tikuHelper");

            // Check if focus is outside the editor and the panel is visible
            if (!editorElement.contains(document.activeElement) &&
                toolPanel && toolPanel.classList.contains("show") &&
                this.autoClipboardSearch) {
              // 阻止默认粘贴行为
              e.preventDefault();

              // 触发读取剪贴板并搜索 (using the new method)
              this.readClipboardAndSearch();
            }
          }
        });
      },

      // 设置结果面板滚动监听
      setupScrollListener() {
        const resultsPanel = document.querySelector('.results-panel');

        resultsPanel.addEventListener('scroll', () => {
          this.updateScrollIndicator();
        });
      },

      // 确保结果面板可以正确滚动
      ensureScrollable() {
        // 监听窗口大小变化，重新计算高度
        window.addEventListener('resize', this.updateResultsPanelHeight);

        // 初始计算
        this.$nextTick(() => {
          this.updateResultsPanelHeight();
        });
      },

      // 更新结果面板高度
      updateResultsPanelHeight() {
        const resultsPanel = document.querySelector('.results-panel');
        if (!resultsPanel) return;

        // 获取容器高度
        const containerHeight = document.querySelector('.content-search-container').offsetHeight;

        // 获取其他元素高度
        const userInfoHeight = document.querySelector('.user-info').offsetHeight;
        const clipboardToggleHeight = document.querySelector('.clipboard-toggle').offsetHeight;
        const editorOuterHeight = document.querySelector('.editor-outer').offsetHeight;
        const progressHeight = this.isSearching ? document.querySelector('.progress-container').offsetHeight : 0;

        // 计算结果面板可用高度
        const availableHeight = containerHeight - userInfoHeight - clipboardToggleHeight - editorOuterHeight - progressHeight - 30; // 30px为边距

        // 设置结果面板高度
        resultsPanel.style.maxHeight = `${availableHeight}px`;

        // 检查是否需要显示滚动指示器
        this.updateScrollIndicator();
      },

      // 更新滚动指示器
      updateScrollIndicator() {
        const resultsPanel = document.querySelector('.results-panel');
        const scrollIndicator = document.querySelector('.scroll-indicator');

        if (!resultsPanel || !scrollIndicator) return;

        // 如果内容高度大于容器高度，且未滚动到底部，显示指示器
        if (resultsPanel.scrollHeight > resultsPanel.clientHeight) {
          if (resultsPanel.scrollTop + resultsPanel.clientHeight < resultsPanel.scrollHeight - 50) {
            scrollIndicator.style.display = 'block';
          } else {
            scrollIndicator.style.display = 'none';
          }
        } else {
          scrollIndicator.style.display = 'none';
        }
      },

      // 处理长文本展开/折叠
      setupExpandCollapse() {
        this.$nextTick(() => {
          const longTextElements = document.querySelectorAll('.result-answer-content, .result-analysis-content');

          longTextElements.forEach(element => {
            // 检查内容高度是否超过300px
            if (element.scrollHeight > 300) {
              // 如果已经设置了展开/折叠按钮，则跳过
              if (element.parentNode.querySelector('.expand-collapse-btn')) {
                return;
              }

              // 设置最大高度
              element.style.maxHeight = '300px';
              element.style.overflow = 'hidden';
              element.style.position = 'relative';

              // 添加长文本指示器
              const indicator = document.createElement('div');
              indicator.className = 'long-text-indicator';
              indicator.textContent = '长文本内容，可展开查看';
              element.parentNode.appendChild(indicator);

              // 添加展开/折叠按钮
              const expandBtn = document.createElement('div');
              expandBtn.className = 'expand-collapse-btn';
              expandBtn.textContent = '点击展开全部';
              expandBtn.dataset.expanded = 'false';

              expandBtn.addEventListener('click', function() {
                if (this.dataset.expanded === 'false') {
                  // 展开
                  element.style.maxHeight = element.scrollHeight + 'px';
                  this.textContent = '点击折叠';
                  this.dataset.expanded = 'true';
                  this.style.background = 'none';
                } else {
                  // 折叠
                  element.style.maxHeight = '300px';
                  this.textContent = '点击展开全部';
                  this.dataset.expanded = 'false';
                  this.style.background = 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))';
                }
              });

              element.parentNode.appendChild(expandBtn);
            }
          });
        });
      },

      // 结果加载完成处理
      onResultsLoaded() {
        // 滚动到结果顶部
        const resultsPanel = document.querySelector('.results-panel');
        if (resultsPanel) {
          resultsPanel.scrollTop = 0;
        }

        // 更新结果面板高度
        this.updateResultsPanelHeight();

        // 设置长文本展开/折叠功能
        this.setupExpandCollapse();

        // 如果结果过多，添加提示
        if (this.results.length > 5) {
          MessageManager.info('共找到 ' + this.results.length + ' 条结果，可滚动查看');
        }
      },

      // 打开文件选择对话框
      openFileUpload() {
        // 创建隐藏的文件输入元素
        if (!this.fileInput) {
          this.fileInput = document.createElement('input');
          this.fileInput.type = 'file';
          this.fileInput.accept = 'image/*';
          this.fileInput.style.display = 'none';
          document.body.appendChild(this.fileInput);

          // 文件选择事件
          this.fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
              const file = e.target.files[0];
              this.handleImageUpload(file);
            }
          });
        }

        // 触发文件选择
        this.fileInput.click();
      },

      // 处理图片上传
      handleImageUpload(file) {
        // 检查文件类型
        if (!file.type.startsWith('image/')) {
          MessageManager.warning('请上传图片文件');
          return;
        }

        // 显示上传进度
        this.showUploadProgress();

        // 读取文件
        const reader = new FileReader();
        reader.onload = (e) => {
          const imgData = e.target.result;

          // 将图片插入编辑器
          const editor = document.getElementById('editor-container');
          editor.innerHTML = ''; // 清空编辑器

          // 插入图片
          const img = document.createElement('img');
          img.src = imgData;
          img.style.maxWidth = '100%';
          editor.appendChild(img);

          // 更新上传进度
          this.updateUploadProgress(100);

          // 提示上传成功
          setTimeout(() => {
            this.hideUploadProgress();
            MessageManager.success('图片上传成功，正在识别...');

            // 处理图片进行OCR识别
            this.processImage(imgData);
          }, 500);
        };

        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            this.updateUploadProgress(progress);
          }
        };

        reader.onerror = () => {
          this.hideUploadProgress();
          MessageManager.error('图片上传失败，请重试');
        };

        reader.readAsDataURL(file);
      },

      // 初始化上传进度条
      initUploadProgress() {
        this.progressBar = {
          container: document.querySelector('.upload-progress'),
          inner: document.querySelector('.upload-progress-inner')
        };
      },

      // 显示上传进度
      showUploadProgress() {
        if (this.progressBar) {
          this.progressBar.container.style.display = 'block';
          this.progressBar.inner.style.width = '0%';
        }
      },

      // 更新上传进度
      updateUploadProgress(progress) {
        if (this.progressBar) {
          this.progressBar.inner.style.width = progress + '%';
        }
      },

      // 隐藏上传进度
      hideUploadProgress() {
        if (this.progressBar) {
          this.progressBar.container.style.display = 'none';
        }
      },

      // 设置拖放支持
      setupDragAndDrop() {
        const dropZone = document.querySelector('#editor-container');

        // 防止浏览器默认行为
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
          dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
          }, false);
        });

        // 高亮拖放区域
        ['dragenter', 'dragover'].forEach(eventName => {
          dropZone.addEventListener(eventName, () => {
            dropZone.classList.add('drag-over');
          }, false);
        });

        // 取消高亮
        ['dragleave', 'drop'].forEach(eventName => {
          dropZone.addEventListener(eventName, () => {
            dropZone.classList.remove('drag-over');
          }, false);
        });

        // 处理拖放文件
        dropZone.addEventListener('drop', (e) => {
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            this.handleImageUpload(file);
          }
        }, false);
      },

      // 将图片插入到编辑器
      insertImageToEditor(imgData) {
        const editor = document.getElementById("editor-container");
        // 清空编辑器内容
        editor.innerHTML = ''; // Clear content

        // 插入图片
        const img = document.createElement('img');
        img.src = imgData;
        img.style.maxWidth = '100%'; // Optional: style the image
        editor.appendChild(img);
      },

      fetchAnswer(question) {
        if (!question) {
          MessageManager.warning('请输入文字，或者复制截图进来');
          return;
        }

        if (question.length < 2) {
          MessageManager.warning(`至少输入2个字，当前值： ${question}`);
          return;
        }

        // 检查是否已查询过用户数据
        if (!this.dataQueried) {
          // 如果有手机号，自动查询
          if (this.phone && /^1\d{10}$/.test(this.phone)) {
            this.queryRemainingCount().then(() => {
              // 查询完成后继续搜索
              this.continueSearch(question);
            });
          } else {
            MessageManager.warning('请先输入手机号并点击查询按钮获取剩余次数');
          }
          return;
        }

        this.continueSearch(question);
      },

      // 继续搜索流程
      continueSearch(question) {
        // 检查剩余次数
        if (!UserDataManager.hasRemainingCount()) {
          // 自动跳转到购买tab
          this.$parent.handleSwitchTab(1);
          PurchaseManager.showPurchaseDialog();
          return;
        }

        this.isSearching = true;

        let prodHost = 'http://so.studypro.club/api/search';

        httpClient({
          method: 'POST',
          url: prodHost,
          headers: {
            "Content-Type": "application/json"
          },
          data: JSON.stringify({
            question: question,
            phone: this.phone
          }),
          onload: (response) => {
            // 减少使用次数
            this.remainCount = UserDataManager.decreaseRemainingCount();
            this.isSearching = false;

            try {
              let dataList = JSON.parse(response.responseText);
              if(dataList && dataList.map){
                this.results = dataList.map((item, index) => {
                  return {
                    answer: item.answer,
                    scores: item.scores,
                    question: item.question,
                    analysis: item.analysis
                  }
                });
              } else {
                this.results = [{
                  answer: dataList.answer,
                  question: question,
                  analysis: dataList.analysis
                }]
              }

              // 结果加载完成后处理
              this.$nextTick(() => {
                this.onResultsLoaded();
              });
            } catch (error) {
              console.error('解析搜索结果失败:', error);
              MessageManager.error('解析搜索结果失败');
            }
          },
          onerror: (error) => {
            this.isSearching = false;
            console.error('搜索请求失败:', error);
            MessageManager.error('搜索失败，请重试');
          }
        });
      },

      imgHandle(base64) {
        return new Promise((resolve, reject) => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          const image = new Image();
          image.setAttribute("crossOrigin", "Anonymous");
          image.src = base64;
          image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
            context.fillStyle = "#fff";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0);
            canvas.toBlob(blob => {
              resolve(blob);
            });
          };
          image.onerror = function() {
            reject(new Error('图片加载失败'));
          };
        });
      },

      imgOcr(blob) {
        return new Promise((resolve, reject) => {
          var formData = new FormData();
          formData.append("image", blob, "screenshot.png");

          GM_xmlhttpRequest({
            url: "https://so.studypro.club/ocr",
            method: "POST",
            data: formData,
            responseType: "json",
            onload: function(r) {
              try {
                // 根据API返回格式调整解析逻辑
                const result = r.response;
                if (result && result.text) {
                  resolve(result.text);
                } else if (result && result.data) {
                  resolve(result.data);
                } else {
                  resolve(JSON.stringify(result));
                }
              } catch (err) {
                reject(err);
              }
            },
            onerror: function(err) {
              reject(err);
            }
          });
        });
      }
    }
  });

  // 通知内容组件
  Vue.component("soti-content-notification", {
    template: `
      <div class="content-notification-container">
        <div v-if="loading" class="loading-state">正在加载通知...</div>
        <div v-else-if="error" class="error-state">加载通知失败: {{ error }}</div>
        <div v-else-if="notifications.length === 0" class="empty-state">
          <div class="empty-icon"></div>
          <div class="empty-text">暂无通知</div>
        </div>
        <div v-else class="notification-list">
          <div v-for="(notification, index) in notifications" :key="index" class="notification-item">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-content" v-html="notification.content"></div>
            <div class="notification-time">{{ formatTime(notification.time) }}</div>
          </div>
        </div>
      </div>
    `,
    data: function() {
      return {
        notifications: [],
        loading: true,
        error: null
      };
    },
    mounted() {
      this.fetchNotifications();
    },
    methods: {
      fetchNotifications() {
        this.loading = true;
        this.error = null;
        // 使用 GM_xmlhttpRequest 避免跨域问题
        GM_xmlhttpRequest({
          method: "GET",
          url: "https://so.studypro.club/api/notice",
          responseType: "json",
          onload: (response) => {
            if (response.status === 200 && response.response && Array.isArray(response.response)) {
              this.notifications = response.response;
            } else {
              this.notifications = [];
              console.warn("通知接口返回数据格式不正确或请求失败:", response);
              this.error = "无法加载通知内容";
            }
            this.loading = false;
          },
          onerror: (error) => {
            console.error("获取通知失败:", error);
            this.error = "网络错误，无法加载通知";
            this.loading = false;
          }
        });
      },
      formatTime(timestamp) {
        if (!timestamp) return "";
        // Assuming timestamp is in seconds, convert to milliseconds
        const date = new Date(timestamp * 1000);
        // Format as YYYY-MM-DD HH:MM:SS
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
    }
  });

  // 购买组件
  Vue.component('soti-content-purchase', {
    template: `
      <div class="content-purchase-container">
        <div class="purchase-header">
          <h2>购买搜题次数</h2>
          <p>当前手机号: <span>{{phone || '未设置'}}</span></p>
          <p>剩余次数: <span>{{remainCount}}</span></p>
        </div>

        <div class="purchase-options">
          <div class="purchase-option-title">请选择购买套餐:</div>
          <div class="purchase-option-list">
            <div
              v-for="(count,price) in priceConfig"
              :key="count"
              class="purchase-option-item"
              :class="{ 'selected': selectedOption === count }"
              @click="selectOption(count)">
              <div class="option-count">{{price}}次</div>
              <div class="option-price">{{formatPrice(count)}}</div>
            </div>
          </div>
        </div>

        <div class="purchase-action">
          <button class="purchase-button" @click="handlePurchase" :disabled="!selectedOption || !phone">
            立即购买
          </button>
          <p class="purchase-tip" v-if="!phone">请先在搜题页面设置手机号</p>
        </div>
      </div>
    `,
    data: function() {
      return {
        phone: UserDataManager.getPhone(),
        remainCount: UserDataManager.getRemainingCount(),
        priceConfig: PurchaseManager.priceConfig,
        selectedOption: null,
        isPurchasing: false
      }
    },
    mounted() {
      // 使用 Observer 监听手机号变化
      UserDataManager.subscribePhoneChange((newPhone) => {
        this.phone = newPhone;
      });

      // 监听剩余次数变化 (这个可以保留，或者也用Observer实现，但当前需求只要求手机号同步)
      this.$watch(() => UserDataManager.getRemainingCount(), (newCount) => {
        this.remainCount = newCount;
      });
    },
    methods: {
      // 选择套餐选项
      selectOption(count) {
        this.selectedOption = count;
      },

      // 格式化价格显示
      formatPrice(price) {
        if (typeof price === 'string') {
          return price;
        }
        return (price / 100).toFixed(2) + '元';
      },

      // 处理购买
      handlePurchase() {
        if (!this.selectedOption || !this.phone || this.isPurchasing) {
          return;
        }

        if (!/^1\d{10}$/.test(this.phone)) {
          MessageManager.error('请输入正确的手机号');
          return;
        }

        this.isPurchasing = true;
        MessageManager.info('正在处理购买请求...');

        PurchaseManager.purchaseCount(this.phone, this.selectedOption)
          .then(payUrl => {
            this.isPurchasing = false;
            // 跳转到支付页面
            window.location.href = payUrl;
          })
          .catch(error => {
            this.isPurchasing = false;
            MessageManager.error('购买请求失败，请重试');
            console.error('购买失败:', error);
          });
      }
    }
  });

  // 个人中心
  Vue.component('soti-content-my', {
    data: function() {
      return {}
    },
    methods: {}
  });

  // 设置
  Vue.component('soti-content-set', {
    template: `
      <div>soti-content-set</div>
    `,
    data: function() {
      return {}
    },
    methods: {}
  });

  let httpClient = GM.xmlHttpRequest ? GM.xmlHttpRequest : (GM_xmlhttpRequest || null);



  // 添加全局样式（不需要作用域）
  GM_addStyle(`
    /* 全局消息提示样式 */
    body > div[data-soti-message="true"] {
      position: fixed;
      top: 20px;
      right: 20px;
      transform: translateX(100%);
      z-index: 10001 !important;
      width: 300px;
      padding: 10px 16px;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      background-color: white;
      transition: all 0.3s ease;
      opacity: 0;
    }

    body > div[data-soti-message="true"].show {
      transform: translateX(0);
      opacity: 1;
    }

    body > div[data-soti-message="true"] .message-content {
      display: flex;
      align-items: center;
    }

    body > div[data-soti-message="true"] .message-icon {
      margin-right: 8px;
      width: 16px;
      height: 16px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }

    body > div[data-soti-message="true"] .icon-success {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMmVjYzcxIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIyIDExLjA4VjEyYTEwIDEwIDAgMSAxLTUuOTMtOS4xNCI+PC9wYXRoPjxwb2x5bGluZSBwb2ludHM9IjIyIDQgMTIgMTQuMDEgOSAxMS4wMSI+PC9wb2x5bGluZT48L3N2Zz4=');
    }

    body > div[data-soti-message="true"] .icon-error {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTc0YzNjIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiPjwvY2lyY2xlPjxsaW5lIHgxPSIxNSIgeTE9IjkiIHgyPSI5IiB5Mj0iMTUiPjwvbGluZT48bGluZSB4MT0iOSIgeTE9IjkiIHgyPSIxNSIgeTI9IjE1Ij48L2xpbmU+PC9zdmc+');
    }

    body > div[data-soti-message="true"] .icon-warning {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZjM5YzEyIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEwLjI5IDMuODZMMS44MiAxOGEyIDIgMCAwIDAgMS43MSAzaDE2Ljk0YTIgMiAwIDAgMCAxLjcxLTNMMTMuNzEgMy44NmEyIDIgMCAwIDAtMy40MiAweiI+PC9wYXRoPjxsaW5lIHgxPSIxMiIgeTE9IjkiIHgyPSIxMiIgeTI9IjEzIj48L2xpbmU+PGxpbmUgeDE9IjEyIiB5MT0iMTciIHgyPSIxMi4wMSIgeTI9IjE3Ij48L2xpbmU+PC9zdmc+');
    }

    body > div[data-soti-message="true"] .icon-info {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzQ5OGRiIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiPjwvY2lyY2xlPjxsaW5lIHgxPSIxMiIgeTE9IjE2IiB4Mj0iMTIiIHkyPSIxMiI+PC9saW5lPjxsaW5lIHgxPSIxMiIgeTE9IjgiIHgyPSIxMi4wMSIgeTI9IjgiPjwvbGluZT48L3N2Zz4=');
    }

    body > div[data-soti-message="true"].message-success {
      border-left: 4px solid #2ecc71;
    }

    body > div[data-soti-message="true"].message-error {
      border-left: 4px solid #e74c3c;
    }

    body > div[data-soti-message="true"].message-warning {
      border-left: 4px solid #f39c12;
    }

    body > div[data-soti-message="true"].message-info {
      border-left: 4px solid #3498db;
    }

    /* 购买弹窗样式 */
    body > div[data-soti-dialog="true"].purchase-dialog {
      position: fixed;
      top: 0;
      right: 0;
      width: 400px;
      height: 100%;
      background-color: transparent;
      z-index: 10000 !important;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      pointer-events: none; /* 允许点击穿透背景 */
    }

    body > div[data-soti-dialog="true"] .purchase-dialog-content {
      width: 350px;
      background-color: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      margin-right: 25px;
      pointer-events: auto; /* 确保内容可以点击 */
      animation: slideInRight 0.3s ease;
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    @keyframes slideOutRight {
      from { transform: translateX(0); }
      to { transform: translateX(100%); }
    }

    body > div[data-soti-dialog="true"] .purchase-dialog-header {
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    body > div[data-soti-dialog="true"] .purchase-dialog-header h3 {
      margin: 0;
      font-size: 18px;
    }

    body > div[data-soti-dialog="true"] .purchase-dialog-close {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;
      background-color: rgba(255,255,255,0.2);
      position: relative;
      border: none !important;
    }

    body > div[data-soti-dialog="true"] .purchase-dialog-close:hover {
      background-color: rgba(255,255,255,0.3);
      transform: rotate(90deg);
    }

    body > div[data-soti-dialog="true"] .purchase-dialog-close::before,
    body > div[data-soti-dialog="true"] .purchase-dialog-close::after {
      content: '';
      position: absolute;
      width: 12px;
      height: 2px;
      background-color: white;
      border-radius: 1px;
    }

    body > div[data-soti-dialog="true"] .purchase-dialog-close::before {
      transform: rotate(45deg);
    }

    body > div[data-soti-dialog="true"] .purchase-dialog-close::after {
      transform: rotate(-45deg);
    }

    body > div[data-soti-dialog="true"] .purchase-dialog-body {
      padding: 20px;
      text-align: center;
    }

    body > div[data-soti-dialog="true"] .purchase-dialog-body p {
      margin: 10px 0;
      font-size: 16px;
    }

    body > div[data-soti-dialog="true"] .highlight {
      color: #e74c3c;
      font-weight: bold;
      font-size: 18px;
    }

    body > div[data-soti-dialog="true"] .purchase-dialog-footer {
      padding: 15px;
      display: flex;
      justify-content: center;
      gap: 10px;
    }

    body > div[data-soti-dialog="true"] .purchase-dialog-footer .btn {
      padding: 8px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    body > div[data-soti-dialog="true"] .purchase-dialog-footer .btn.primary {
      background-color: #3498db;
      color: white;
    }

    body > div[data-soti-dialog="true"] .purchase-dialog-footer .btn.primary:hover {
      background-color: #2980b9;
    }

    body > div[data-soti-dialog="true"] .purchase-dialog-footer .btn.bordered {
      border: 1px solid #6c757d;
      color: #6c757d;
    }

    body > div[data-soti-dialog="true"] .purchase-dialog-footer .btn.bordered:hover {
      background-color: #f8f9fa;
    }

    /* 触发按钮样式 */
    body > div.trigger-btn {
      position: fixed;
      right: 0;
      bottom: 4%;
      width: 40px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
      border-radius: 8px 0 0 8px;
      cursor: pointer;
      box-shadow: -2px 2px 10px rgba(0,0,0,0.2);
      z-index: 9998;
      transition: all 0.3s ease;
    }

    body > div.trigger-btn:hover {
      width: 45px;
      background: linear-gradient(135deg, #2980b9, #1f6aa6);
    }
  `);

  // 对自定义样式应用作用域
  GM_addStyle(addCSSScope(`
    /* 基础样式优化 */
    #tikuHelper {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333333;
      position: fixed;
      top: 100px;
      right: 20px;
      width: 420px;
      height: 700px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999 !important;
      transition: all 0.3s ease;
      opacity: 0;
      transform: scale(0.95);
      pointer-events: none;
    }

    #tikuHelper.show {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
    }

    /* 头部样式 */
    .header {
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
      height: 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;
      cursor: move;
      border-radius: 10px 10px 0 0;
    }

    .header div:first-child {
      font-size: 18px;
      font-weight: bold;
    }

    .close-icon {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;
      background-color: rgba(255,255,255,0.2);
      position: relative;
    }

    .close-icon:hover {
      background-color: rgba(255,255,255,0.3);
      transform: rotate(90deg);
    }

    .close-icon::before,
    .close-icon::after {
      content: '';
      position: absolute;
      width: 14px;
      height: 2px;
      background-color: white;
      border-radius: 1px;
    }

    .close-icon::before {
      transform: rotate(45deg);
    }

    .close-icon::after {
      transform: rotate(-45deg);
    }

    /* 确保结果容器有正确的布局结构 */
    .router-content {
      display: flex;
      flex-direction: column;
      height: calc(100% - 90px); /* 减去头部和标签的高度 */
      overflow: hidden !important;
    }

    .content-search-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden !important;
    }

    /* 用户信息区样式 */
    .user-info {
      padding: 12px 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eee;
      background-color: #f8f9fa;
    }

    .phone-container {
      display: flex;
      align-items: center;
    }

    .phone-input {
      width: 150px;
      height: 32px;
      padding: 0 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .phone-input:focus {
      border-color: #3498db;
      outline: none;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }

    .query-btn {
      margin-left: 5px;
      height: 32px;
      width:56px;
      padding: 0 10px;
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .query-btn:hover {
      background-color: #2980b9;
    }

    .usage-info {
      display: flex;
      align-items: center;
    }

    .count-display {
      font-size: 14px;
      color: #2ecc71;
      margin-right: 10px;
    }

    .count-display.count-warning {
      color: #e74c3c;
    }

    .buy-btn {
      height: 28px;
      width: 56px;
      padding: 0 12px;
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .buy-btn:hover {
      background-color: #c0392b;
    }

    /* 剪贴板开关样式 */
    .clipboard-toggle {
      padding: 8px 15px;
      display: flex;
      align-items: center;
      background-color: #f8f9fa;
      border-bottom: 1px solid #eee;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
      margin-right: 10px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 20px;
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .toggle-slider {
      background-color: #3498db;
    }

    input:checked + .toggle-slider:before {
      transform: translateX(20px);
    }

    .toggle-label {
      font-size: 14px;
      color: #666;
    }

    /* 搜索功能区样式 */
    .editor-outer {
      padding: 15px;
    }

    #editor-container {
      border: 1px solid #ddd;
      border-radius: 6px;
      min-height: 120px;
      max-height: 200px; /* 添加最大高度 */
      overflow-y: auto; /* 添加垂直滚动条 */
      margin-bottom: 10px;
      transition: border-color 0.3s;
      padding: 5px; /* 添加内边距 */
    }

    #editor-container.drag-over {
      border-color: #3498db;
      background-color: rgba(52, 152, 219, 0.1);
    }

    .upload-progress {
      height: 0px;
      background-color: #e9ecef;
      border-radius: 2px;
      margin-top: 5px;
      margin-bottom: 10px;
      overflow: hidden;
      display: none;
    }

    .upload-progress-inner {
      height: 100%;
      background-color: #3498db;
      border-radius: 2px;
      width: 0%;
      transition: width 0.3s ease;
    }

    .tool-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tool-btn {
      height: 36px;
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      background-color: #f8f9fa;
      color: #333;
    }

    .tool-btn:hover {
      background-color: #2980b9;
    }

    .upload-btn, .paste-btn {
      width: 100px;
      padding: 0;
      background-color: #3498db;
      color:#fff;
    }

    .search-btn {
      background-color: #3498db;
      color: white;
      font-weight: bold;
      padding: 0 20px;
    }

    .search-btn:hover {
      background-color: #2980b9;
    }


    .icon-search {
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxjaXJjbGUgY3g9IjExIiBjeT0iMTEiIHI9IjgiPjwvY2lyY2xlPjxsaW5lIHgxPSIyMSIgeTE9IjIxIiB4Mj0iMTYuNjUiIHkyPSIxNi42NSI+PC9saW5lPjwvc3ZnPg==');
      margin-right: 5px;
    }

    /* 进度条样式 */
    .progress-container {
      padding: 10px 15px;
      text-align: center;
    }

    .progress-bar {
      height: 6px;
      background-color: #e9ecef;
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 5px;
    }

    .progress-inner {
      height: 100%;
      width: 0;
      background-color: #3498db;
      border-radius: 3px;
      animation: progress 1.5s infinite ease-in-out;
    }

    .progress-text {
      font-size: 12px;
      color: #6c757d;
    }

    @keyframes progress {
      0% { width: 0%; }
      50% { width: 70%; }
      100% { width: 0%; }
    }

    /* 结果展示区样式 */
    .results-panel {
      flex: 1;
      overflow-y: auto !important; /* 强制显示滚动条 */
      /* max-height: calc(100% - 220px); Removed, let flexbox handle height */

      margin-top:10px; /* Reduced margin */
      scrollbar-width: thin;
      scrollbar-color: #c1c1c1 #f1f1f1;
      position: relative; /* 确保定位正确 */
    }

    /* 美化滚动条 - Webkit浏览器 */
    .results-panel::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
    }

    .results-panel::-webkit-scrollbar-track {
      background: #f1f1f1 !important;
      border-radius: 4px !important;
    }

    .results-panel::-webkit-scrollbar-thumb {
      background: #c1c1c1 !important;
      border-radius: 4px !important;
    }

    .results-panel::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8 !important;
    }

    /* 滚动指示器 - 修改为粘性定位 */
    .scroll-indicator {
      text-align: center;
      padding: 5px 0;
      color: #6c757d;
      font-size: 12px;
      display: none;
      position: sticky;
      bottom: 0;
      width: 100%;
      background-color: rgba(255,255,255,0.8);
      border-top: 1px solid #eee;
      margin-top: 10px;
      z-index: 1;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #999;
    }

    .empty-icon {
      width: 64px;
      height: 64px;
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiPjwvY2lyY2xlPjxsaW5lIHgxPSIxMiIgeTE9IjgiIHgyPSIxMiIgeTI9IjEyIj48L2xpbmU+PGxpbmUgeDE9IjEyIiB5MT0iMTYiIHgyPSIxMi4wMSIgeTI9IjE2Ij48L2xpbmU+PC9zdmc+');
      background-size: contain;
      margin-bottom: 10px;
    }

    /* 确保结果列表正确显示 */
    .results-list {
      width: 100%;
      padding-right: 5px; /* 为滚动条留出空间 */
    }

    /* 确保结果卡片在容器内正确显示 */
    .result-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 15px;
      margin-bottom: 15px;
      transition: transform 0.2s, box-shadow 0.2s;
      animation: slideIn 0.3s ease;
      width: calc(100% - 10px); /* 考虑内边距 */
      box-sizing: border-box !important;
    }

    .result-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .result-number {
      background-color: #3498db;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }

    .result-similarity {
      font-size: 12px;
      color: #666;
      background-color: #f8f9fa;
      padding: 2px 8px;
      border-radius: 10px;
    }

    .result-question {
      font-size: 15px;
      line-height: 1.5;
      margin-bottom: 10px;
      color: #333;
    }

    .result-answer, .result-analysis {
      margin-top: 10px;
      position: relative;
    }

    .answer-label, .analysis-label {
      font-size: 13px;
      font-weight: bold;
      color: #3498db;
      margin-bottom: 5px;
    }

    .result-answer-content {
      background-color: #e8f4fc;
      padding: 10px;
      border-radius: 6px;
      font-size: 14px;
      line-height: 1.5;
      max-height: 300px;
      overflow-y: auto;
      transition: max-height 0.3s ease;
    }

    .result-analysis-content {
      padding: 10px;
      border-radius: 6px;
      background-color: #f8f9fa;
      font-size: 14px;
      line-height: 1.5;
      max-height: 300px;
      overflow-y: auto;
      transition: max-height 0.3s ease;
    }

    /* 长文本处理 */
    .expand-collapse-btn {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      text-align: center;
      background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
      padding: 30px 0 5px 0;
      cursor: pointer;
      color: #3498db;
      font-size: 12px;
      transition: all 0.3s ease;
    }

    /* 长文本指示器 */
    .long-text-indicator {
      font-size: 11px;
      color: #6c757d;
      text-align: right;
      margin-top: 5px;
      font-style: italic;
    }

    /* 优化滚动条样式 */
    .result-answer-content::-webkit-scrollbar,
    .result-analysis-content::-webkit-scrollbar {
      width: 6px;
    }

    .result-answer-content::-webkit-scrollbar-track,
    .result-analysis-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    .result-answer-content::-webkit-scrollbar-thumb,
    .result-analysis-content::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }

    .result-answer-content::-webkit-scrollbar-thumb:hover,
    .result-analysis-content::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }

    /* Tab样式优化 */
    .tab-container {
      padding-left: 12px;
      margin: 6px 0;
      display: flex;
      height: 36px;
      border-bottom: solid #eee 1px;
    }

    .tab-container .tab {
      box-sizing: border-box;
      position: relative;
      top: 1px;
      width: 72px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      cursor: pointer;
      border-bottom: solid #eee 1px;
      border-top: solid #fff 1px;
      transition: all 0.2s ease;
    }

    .tab-container .tab.active {
      border: solid #3498db 1px;
      border-bottom: solid #fff 1px;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      background-color: #fff;
      font-weight: bold;
    }

    /* 购买页面样式 */
    .content-purchase-container {
      padding: 20px;
      height: 100%;
      overflow-y: auto;
    }

    .purchase-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .purchase-header h2 {
      color: #333;
      margin-bottom: 15px;
    }

    .purchase-header p {
      color: #666;
      margin: 5px 0;
    }

    .purchase-header p span {
      font-weight: bold;
      color: #3498db;
    }

    .purchase-options {
      margin-bottom: 30px;
    }

    .purchase-option-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #333;
    }

    .purchase-option-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .purchase-option-item {
      border: 2px solid #eee;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .purchase-option-item:hover {
      border-color: #3498db;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }

    .purchase-option-item.selected {
      border-color: #3498db;
      background-color: rgba(52, 152, 219, 0.1);
    }

    .option-count {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }

    .option-price {
      color: #e74c3c;
      font-weight: bold;
    }

    .purchase-action {
      text-align: center;
    }

    .purchase-button {
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 12px 30px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .purchase-button:hover {
      background-color: #2980b9;
    }

    .purchase-button:disabled {
      background-color: #95a5a6;
      cursor: not-allowed;
    }

    .purchase-tip {
      margin-top: 10px;
      color: #e74c3c;
      font-size: 14px;
    }
.content-notification-container {
            padding: 20px;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
       .loading-state {
            display: flex;
            align-items: center;
            font-size: 16px;
            color: #666;
        }
       .loading-state .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(0, 0, 0, 0.2);
            border-top-color: #007BFF;
            border-radius: 50%;
            animation: spin 1s ease-in-out infinite;
            -webkit-animation: spin 1s ease-in-out infinite;
            margin-right: 10px;
            vertical-align: middle;
        }
       .error-state {
            display: flex;
            align-items: center;
            font-size: 16px;
            color: #ff0000;
        }
       .error-state .error-icon {
            display: inline-block;
            width: 20px;
            height: 20px;

            background-size: contain;
            margin-right: 10px;
            vertical-align: middle;
        }
       .empty-state {
            text-align: center;
            color: #999;
        }
       .empty-state .empty-icon {
            width: 60px;
            height: 60px;
            background-size: contain;
            margin: 0 auto 10px;
        }
       .empty-state .empty-text {
            font-size: 18px;
        }
       .notification-list {
            list-style-type: none;
            padding: 0;
        }
       .notification-list .notification-item {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
        }
       .notification-list .notification-item .notification-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
        }
       .notification-list .notification-item .notification-content {
            font-size: 16px;
            line-height: 1.5;
        }
       .notification-list .notification-item .notification-time {
            font-size: 14px;
            color: #999;
            margin-top: 5px;
        }
        @keyframes spin {
            to {
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }
    /* 动画效果 */
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* 响应式设计 */
    @media (max-width: 768px) {
      #tikuHelper {
        width: 90%;
        right: 5%;
        height: 80vh;
      }

      .tool-btn {
        height: 42px;
      }

      .phone-input {
        width: 120px;
      }
    }
  `));

  var $wrap = $(`
  <div id="tikuHelper">
    <soti-header></soti-header>
    <soti-tab :active-tab-index="currentTabIdx" @switch-tab="handleSwitchTab"></soti-tab>
    <div class="router-content">
      <soti-content-search v-show="currentTabIdx == 0"></soti-content-search>
      <soti-content-purchase v-show="currentTabIdx == 1"></soti-content-purchase>
      <soti-content-notification v-show="currentTabIdx == 2"></soti-content-notification> <!-- 添加通知组件显示 -->
    </div>
  </div>
  <div id="triggerBtn" class="trigger-btn" style="width:100px;">搜题小帮手</div>`);
  $('body').prepend($wrap);

  new Vue({
    el: '#tikuHelper',
    data: {
      currentTabIdx: 0
    },
    methods: {
      handleSwitchTab(idx) {
        this.currentTabIdx = idx;
      },
      // 添加一个公共方法用于外部调用切换标签
      switchToTab(idx) {
        this.currentTabIdx = idx;
      }
    }
  });



  var show = false;
  $('#triggerBtn').on('click', _ => {
    toggleOpenClose();
  })

  function toggleOpenClose() {
    if (show) {
      show = false;
      $('#tikuHelper').removeClass('show');
      $('#triggerBtn').css('background', 'linear-gradient(135deg, #3498db, #2980b9)');
      $('#triggerBtn').css('width', '100px');
      $('#triggerBtn').html('搜题小帮手');
    } else {
      show = true;
      $('#tikuHelper').addClass('show');
      $('#triggerBtn').css('background', 'linear-gradient(135deg, #6c757d, #495057)');
      $('#triggerBtn').html('搜题小帮手');
    }
  }

  // 默认展开搜题小帮手
  setTimeout(() => {
    if (show) {
      toggleOpenClose();
    }
  }, 500);
})
