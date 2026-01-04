// ==UserScript==
// @name         JLC_SHOP_SEARCH_TOOL_2.0
// @namespace    http://tampermonkey.net/
// @version      2.1.3
// @description  JLC_SHOP_SEARCH_TOOL_2.0.
// @author       Lx
// @match        https://so.szlcsc.com/global.html**
// @match        https://list.szlcsc.com/brand/**
// @match        https://list.szlcsc.com/catalog**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=szlcsc.com
// @require      https://update.greasyfork.org/scripts/494892/1376206/jquery-351.js
// @resource searchCSS https://gitee.com/mlx6_admin/public_resource_lc/raw/master/search.css
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_openInTab
// @grant        GM_addStyle
// @connect      szlcsc.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537815/JLC_SHOP_SEARCH_TOOL_20.user.js
// @updateURL https://update.greasyfork.org/scripts/537815/JLC_SHOP_SEARCH_TOOL_20.meta.js
// ==/UserScript==
/**
 * Message 全局消息通知组件
 * 使用方式：
 * window.$message.success('操作成功')
 * window.$message.error('操作失败')
 * window.$message.warning('警告信息')
 * window.$message.info('普通信息')
 */
(function(window) {
    // 样式定义
    const style = `
    .message-container {
      position: fixed;
      top: 20px;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      pointer-events: none;
      z-index: 1000000000000000000;
    }
    .message-item {
      min-width: 300px;
      max-width: 600px;
      padding: 8px 20px;
      margin-bottom: 10px;
      border-radius: 4px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      background: #fff;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      pointer-events: auto;
      overflow: hidden;
    }
    .message-item.success {
      background-color: #f0f9eb;
      color: #67c23a;
      border: 1px solid #e1f3d8;
    }
    .message-item.error {
      background-color: #fef0f0;
      color: #f56c6c;
      border: 1px solid #fde2e2;
    }
    .message-item.warning {
      background-color: #fdf6ec;
      color: #e6a23c;
      border: 1px solid #faecd8;
    }
    .message-item.info {
      background-color: #edf2fc;
      color: #909399;
      border: 1px solid #ebeeef;
    }
    .message-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .message-content {
      flex: 1;
      font-size: 14px;
      line-height: 1.5;
    }
    .message-close {
      margin-left: 15px;
      color: #c0c4cc;
      cursor: pointer;
      font-size: 16px;
    }
    .message-close:hover {
      color: #909399;
    }
    .message-fade-enter-active, .message-fade-leave-active {
      transition: all 0.3s;
    }
    .message-fade-enter, .message-fade-leave-to {
      opacity: 0;
      transform: translateY(-20px);
    }
  `;

    // 添加样式到head
    const styleElement = document.createElement('style');
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);

    // 消息队列
    let messages = [];
    let container = null;

    // 创建消息容器
    function createContainer() {
        if (!container) {
            container = document.createElement('div');
            container.className = 'message-container';
            document.body.appendChild(container);
        }
        return container;
    }

    // 创建消息元素
    function createMessage(type, message, duration = 3000) {
        const container = createContainer();
        const messageId = Date.now() + Math.random().toString(36).substr(2, 9);

        const messageEl = document.createElement('div');
        messageEl.className = `message-item ${type}`;
        messageEl.dataset.id = messageId;

        // 图标
        const iconMap = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const iconEl = document.createElement('span');
        iconEl.className = 'message-icon';
        iconEl.textContent = iconMap[type] || '';

        // 内容
        const contentEl = document.createElement('span');
        contentEl.className = 'message-content';
        contentEl.textContent = message;

        // 关闭按钮
        const closeEl = document.createElement('span');
        closeEl.className = 'message-close';
        closeEl.innerHTML = '&times;';
        closeEl.onclick = () => removeMessage(messageId);

        messageEl.appendChild(iconEl);
        messageEl.appendChild(contentEl);
        messageEl.appendChild(closeEl);

        // 添加到DOM
        container.appendChild(messageEl);

        // 触发动画
        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateY(0)';
        }, 10);

        // 自动关闭
        if (duration > 0) {
            setTimeout(() => {
                removeMessage(messageId);
            }, duration);
        }

        // 添加到消息队列
        messages.push({
            id: messageId,
            element: messageEl
        });

        return messageId;
    }

    // 移除消息
    function removeMessage(id) {
        const index = messages.findIndex(msg => msg.id === id);
        if (index === -1) return;

        const { element } = messages[index];

        // 触发离开动画
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px)';

        // 动画结束后移除
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }

            // 从队列中移除
            messages.splice(index, 1);

            // 如果没有消息了，移除容器
            if (messages.length === 0 && container) {
                document.body.removeChild(container);
                container = null;
            }
        }, 300);
    }

    // 清除所有消息
    function clearAll() {
        messages.forEach(msg => {
            if (msg.element.parentNode) {
                msg.element.parentNode.removeChild(msg.element);
            }
        });
        messages = [];

        if (container) {
            document.body.removeChild(container);
            container = null;
        }
    }

    // 导出到全局
    window.$message = {
        success: (message, duration) => createMessage('success', message, duration),
        error: (message, duration) => createMessage('error', message, duration),
        warning: (message, duration) => createMessage('warning', message, duration),
        info: (message, duration) => createMessage('info', message, duration),
        closeAll: clearAll
    };

})(window);

(async function() {
        'use strict';

        const searchCSS = GM_getResourceText("searchCSS")
        GM_addStyle(searchCSS)

        /**
         * 空列表占位组件
         * @class EmptyState
         */
        class EmptyState {
            /**
             * 构造函数
             * @param {string} selector 容器选择器
             * @param {object} options 配置选项
             */
            constructor(selector, options = {}) {
                // 默认配置
                const defaults = {
                    icon: 'fa fa-inbox', // 图标类名（推荐使用Font Awesome）
                    iconSize: 48, // 图标尺寸
                    title: '暂无数据', // 主标题
                    description: '', // 描述文本
                    showAction: false, // 是否显示操作按钮
                    actionText: '刷新', // 按钮文字
                    actionClass: 'btn btn-primary', // 按钮样式类
                    onAction: null // 按钮点击回调
                };

                // 合并配置
                this.settings = $.extend({}, defaults, options);

                // 容器元素
                this.$container = $(selector);
                if (this.$container.length === 0) {
                    console.error('EmptyState: 容器元素未找到');
                    return;
                }

                // 初始化
                this._init();
            }

            /**
             * 初始化组件
             * @private
             */
            _init() {
                    // 创建占位元素
                    this.$element = $(`
      <div class="empty-state" style="display: none;">
        <div class="empty-state-icon">
          <i class="${this.settings.icon}"></i>
        </div>
        <div class="empty-state-content">
          <h3 class="empty-state-title">${this.settings.title}</h3>
          ${this.settings.description ?
                `<p class="empty-state-desc">${this.settings.description}</p>` : ''}
        </div>
        ${this.settings.showAction ? `
        <div class="empty-state-actions">
          <button class="${this.settings.actionClass}">${this.settings.actionText}</button>
        </div>
        ` : ''}
      </div>
    `);

            // 设置图标尺寸
            this.$element.find('.empty-state-icon i').css({
                'font-size': `${this.settings.iconSize}px`,
                'width': `${this.settings.iconSize}px`,
                'height': `${this.settings.iconSize}px`
            });

            // 添加到容器
            this.$container.append(this.$element);

            // 绑定事件
            if (this.settings.showAction && this.settings.onAction) {
                this.$element.find('button').on('click', this.settings.onAction);
            }

            // 确保样式存在
            this._ensureStyles();
        }

        /**
         * 确保样式存在
         * @private
         */
        _ensureStyles() {
            if ($('#empty-state-styles').length === 0) {
                $('<style id="empty-state-styles">')
                    .text(`
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            text-align: center;
            color: #6c757d;
          }
          .empty-state-icon {
            margin-bottom: 20px;
            color: #adb5bd;
          }
          .empty-state-icon i {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .empty-state-content {
            max-width: 500px;
          }
          .empty-state-title {
            margin: 0 0 10px;
            font-size: 18px;
            font-weight: 500;
            color: #343a40;
          }
          .empty-state-desc {
            margin: 0;
            font-size: 14px;
            line-height: 1.5;
          }
          .empty-state-actions {
            margin-top: 20px;
          }
          .btn {
            display: inline-block;
            font-weight: 400;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            user-select: none;
            border: 1px solid transparent;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: 0.25rem;
            transition: all 0.15s ease-in-out;
            cursor: pointer;
          }
          .btn-primary {
            color: #fff;
            background-color: #007bff;
            border-color: #007bff;
          }
          .btn-primary:hover {
            background-color: #0069d9;
            border-color: #0062cc;
          }
        `)
                    .appendTo('head');
            }
        }

        /**
         * 显示空状态
         * @public
         */
        show() {
            // 隐藏容器内其他内容
            this.$container.children().not(this.$element).hide();
            // 显示占位
            this.$element.show();
            return this;
        }

        /**
         * 隐藏空状态
         * @public
         */
        hide() {
            this.$element.hide();
            // 显示容器内其他内容
            this.$container.children().show();
            return this;
        }

        /**
         * 切换显示状态
         * @param {boolean} [state] 显示/隐藏
         * @public
         */
        toggle(state) {
            if (typeof state === 'undefined') {
                state = !this.$element.is(':visible');
            }
            return state ? this.show() : this.hide();
        }

        /**
         * 更新配置
         * @param {object} newSettings 新配置
         * @public
         */
        update(newSettings) {
            // 合并新配置
            this.settings = $.extend({}, this.settings, newSettings);

            // 更新图标
            if (newSettings.icon) {
                const $icon = this.$element.find('.empty-state-icon i');
                $icon.attr('class', newSettings.icon);
                if (newSettings.iconSize) {
                    $icon.css({
                        'font-size': `${newSettings.iconSize}px`,
                        'width': `${newSettings.iconSize}px`,
                        'height': `${newSettings.iconSize}px`
                    });
                }
            }

            // 更新标题
            if (newSettings.title) {
                this.$element.find('.empty-state-title').text(newSettings.title);
            }

            // 更新描述
            if (newSettings.description !== undefined) {
                const $desc = this.$element.find('.empty-state-desc');
                if (newSettings.description) {
                    if ($desc.length) {
                        $desc.text(newSettings.description);
                    } else {
                        this.$element.find('.empty-state-content').append(
                            `<p class="empty-state-desc">${newSettings.description}</p>`
                        );
                    }
                } else if ($desc.length) {
                    $desc.remove();
                }
            }

            // 更新操作按钮
            if (newSettings.showAction !== undefined ||
                newSettings.actionText ||
                newSettings.actionClass ||
                newSettings.onAction) {

                const $actions = this.$element.find('.empty-state-actions');

                if (this.settings.showAction) {
                    if ($actions.length) {
                        $actions.html(`<button class="${this.settings.actionClass}">${this.settings.actionText}</button>`);
                    } else {
                        this.$element.append(`
            <div class="empty-state-actions">
              <button class="${this.settings.actionClass}">${this.settings.actionText}</button>
            </div>
          `);
                    }

                    if (this.settings.onAction) {
                        this.$element.find('button').off('click').on('click', this.settings.onAction);
                    }
                } else if ($actions.length) {
                    $actions.remove();
                }
            }

            return this;
        }

        /**
         * 销毁组件
         * @public
         */
        destroy() {
            this.$element.remove();
            this.$element = null;
            this.$container = null;
        }
    }

// 使用示例
// $(function() {
//   // 初始化
//   const emptyState = new EmptyState('#list-container', {
//     icon: 'fa fa-search',
//     title: '没有找到结果',
//     description: '请尝试其他搜索条件',
//     showAction: true,
//     actionText: '重新加载',
//     onAction: function() {
//       console.log('执行刷新操作');
//     }
//   });
//
//   // 显示空状态
//   emptyState.show();
//
//   // 更新内容
//   // emptyState.update({
//   //   title: '新的标题',
//   //   description: '新的描述信息'
//   // });
//
//   // 隐藏空状态
//   // emptyState.hide();
//
//   // 销毁实例
//   // emptyState.destroy();
// });

    class PriceCalculator {
        /**
         * 根据数量和价格数据计算最终价格
         * @param {number} quantity 购买数量
         * @param {number} theRatio 起订量
         * @param {Array} productPriceList 产品价格列表
         * @param {Object} priceDiscount 折扣信息
         * @returns {Object} 计算结果 { originalPrice, discountPrice, discountRate, priceTier }
         */
        static calculatePrice(quantity, theRatio, productPriceList, priceDiscount) {
            // 验证输入
            if (!productPriceList || !Array.isArray(productPriceList) || productPriceList.length === 0) {
                throw new Error('无效的产品价格列表');
            }

            if (quantity <= 0) {
                throw new Error('数量必须大于0');
            }

            // 1. 找到对应的价格区间
            const priceTier = this.findPriceTier(quantity, theRatio, productPriceList);
            if (!priceTier) {
                throw new Error('找不到对应数量的价格区间');
            }

            // 2. 计算原始价格
            const originalPrice = priceTier.productPrice;

            // 3. 计算折扣价格
            let discountPrice = originalPrice;
            let discountRate = 1; // 默认无折扣

            if (priceDiscount && priceDiscount.priceList) {
                const discountTier = this.findDiscountTier(quantity, priceDiscount.priceList);
                if (discountTier) {
                    discountRate = discountTier.discount;
                    discountPrice = originalPrice * discountRate;
                }
            }

            return {
                originalPrice: this.formatPrice(originalPrice),
                discountPrice: this.formatPrice(discountPrice),
                discountTotalPrice: this.formatPrice(discountPrice * quantity),
                discountRateText: this.formatPrice(discountRate * 100) + '%',
                discountRate,
                priceTier: priceTier,
                minEncapsulationUnitPrice: priceTier.minEncapsulationUnitPrice
                    ? this.formatPrice(priceTier.minEncapsulationUnitPrice)
                    : null
            };
        }

        /**
         * 根据数量查找对应的价格区间
         * @param {number} quantity
         * @param {number} theRatio
         * @param {Array} priceList
         * @returns {Object|null}
         */
        static findPriceTier(quantity, theRatio, priceList) {
            for (const tier of priceList) {
                const start = tier.startPurchasedNumber * theRatio;
                let end = tier.endPurchasedNumber * theRatio;

                // 处理无限数量的情况 (endPurchasedNumber = -1)
                if (end === -1) end = Infinity;

                if (quantity >= start && quantity <= end) {
                    return tier;
                }
            }
            return null;
        }

        /**
         * 根据数量查找对应的折扣区间
         * @param {number} quantity
         * @param {Array} discountList
         * @returns {Object|null}
         */
        static findDiscountTier(quantity, discountList) {
            for (const tier of discountList) {
                const start = tier.spNumber;
                let end = tier.epNumber;

                // 处理无限数量的情况 (epNumber = -1)
                if (end === -1) end = Infinity;

                if (quantity >= start && quantity <= end) {
                    return tier;
                }
            }
            return null;
        }

        /**
         * 格式化价格，保留4位小数
         * @param {number} price
         * @returns {number}
         */
        static formatPrice(price) {
            return parseFloat(price.toFixed(4));
        }
    }

    class ConditionalWaiter {
        /**
         * 创建一个条件等待器
         * @param {Object} options 配置选项
         * @param {number} [options.maxWaitTime=5000] 最大等待时间(毫秒)
         * @param {number} [options.checkInterval=100] 检查间隔(毫秒)
         */
        constructor(options = {}) {
            this.maxWaitTime = options.maxWaitTime || 5000; // 默认5秒
            this.checkInterval = options.checkInterval || 100; // 默认100毫秒
            this.timeoutId = null;
            this.intervalId = null;
        }

        /**
         * 等待直到条件满足
         * @param {Function} conditionFn 条件函数，返回true时停止等待
         * @param {Function} [callback] 条件满足时的回调
         * @return {Promise} 返回Promise，可在条件满足时resolve
         */
        waitUntil(conditionFn, callback) {
            return new Promise((resolve, reject) => {
                const startTime = Date.now();

                // 设置超时定时器
                this.timeoutId = setTimeout(() => {
                    this.clear();
                    const err = new Error(`Condition not met within ${this.maxWaitTime}ms`);
                    if (callback) callback(err, false);
                    reject(err);
                }, this.maxWaitTime);

                // 递归检查函数
                const checkCondition = () => {
                    try {
                        if (conditionFn()) {
                            this.clear();
                            if (callback) callback(null, true);
                            resolve(true);
                        } else if (Date.now() - startTime < this.maxWaitTime) {
                            this.intervalId = setTimeout(checkCondition, this.checkInterval);
                        }
                    } catch (error) {
                        this.clear();
                        if (callback) callback(error, false);
                        reject(error);
                    }
                };

                // 开始第一次检查
                checkCondition();
            });
        }

        /**
         * 清除所有定时器
         */
        clear() {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
            if (this.intervalId) {
                clearTimeout(this.intervalId);
                this.intervalId = null;
            }
        }

        /**
         * 销毁实例
         */
        destroy() {
            this.clear();
        }
    }

    const Util = {
        /**
         * 根据value排序Map
         * @param {*} map
         * @returns
         */
        sortMapByValue: function (map) {
            var arrayObj = Array.from(map);
            // 按照value值降序排序
            arrayObj.sort(function (a, b) {
                return b[1] - a[1]; // 修改为降序排序
            });
            return arrayObj;
        },

        /**
         * GET请求封装
         * @param {*} url
         */
        getAjax: function (url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url: url,
                    method: 'GET',
                    onload: (r) => {
                        resolve(r.response);
                    },
                    onerror: (err) => {
                        reject(err);
                    }
                });
            });
        },

        /**
         * POST请求封装
         * @param {*} url
         * @param {*} data
         */
        postAjaxJSON: function (url, data) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url: url,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(data), // 确保数据被正确转换为JSON字符串
                    onload: (r) => {
                        resolve(r.response);
                    },
                    onerror: (err) => {
                        reject(err);
                    }
                });
            });
        },

        /**
         * 获取品牌名称
         * 支持列表：
         * 1、XUNDA(讯答)
         * 2、立创开发板
         * 3、50元德立品牌优惠
         * 4、<新人专享>15元芯声品牌优惠
         * @param text
         */
        brandNameProcess: function (text) {
            let replaceText = text;
            try {
                // 取括号里的品牌名称 如：ICEY(冰禹)
                if (replaceText.includes("(")) {
                    const t = replaceText.split(/\(|\)/g).filter((e => e));
                    replaceText = (1 === t.length ? t[0] : t.length > 1 ? t[t.length - 1] : name)
                } else {
                    const t = /<.+>/g.exec(text)
                    if (t != null) {
                        replaceText = t[0].replace(/<|>/g, '')
                        if (replaceText === '新人专享') {
                            replaceText = text.replace(/^.[^元]*元(.*)品牌.*$/, '$1')
                        }
                    } else {
                        replaceText = text.replace(/^.[^元]*元(.*)品牌.*$/, '$1')
                    }
                }
            } catch (e) {
                console.error(e)
            } finally {
                return replaceText
            }
        },

        jsonToUrlParam: function (json, ignoreFields = '') {
            return Object.keys(json)
                .filter(key => ignoreFields.indexOf(key) === -1)
                .map(key => key + '=' + encodeURIComponent(json[key])).join('&'); // 使用 encodeURIComponent 避免URL编码问题
        },

        /**
         * POST请求封装
         * @param {*} url
         * @param {*} jsonData
         */
        postFormAjax: function (url, jsonData) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url: url,
                    data: this.jsonToUrlParam(jsonData), // 使用 Util.jsonToUrlParam 方法
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    onload: (r) => {
                        resolve(r.response);
                    },
                    onerror: (err) => {
                        reject(err);
                    }
                });
            });
        },

        /**
         * 有进度的等待所有异步任务的执行
         * @param {*} requests
         * @param {*} callback
         * @returns
         */
        allWithProgress: function (requests, callback) {
            let index = 0;
            requests.forEach(item => {
                item.then(() => {
                    index++;
                    const progress = (index / requests.length) * 100;
                    callback({
                        total: requests.length,
                        cur: index,
                        progress: progress
                    });
                }).catch((err) => {
                    console.error(err);
                });
            });
            return Promise.all(requests);
        },

        /**
         * 等待
         * @param {*} timeout
         * @returns
         */
        sleep: function (timeout) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(true);
                }, timeout);
            });
        },

        /**
         * 等待 执行函数
         * @param {*} timeout
         * @param {*} func
         * @returns
         */
        sleepFunc: function (timeout, func) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    func && func();
                }, timeout);
            });
        },

        /**
         * 获取本地缓存
         * @param {*} key
         */
        getLocalData: function (k) {
            return localStorage.getItem(k);
        },

        /**
         * 设置本地缓存
         * @param {*} key
         * @param {*} value
         */
        setLocalData: function (k, v) {
            localStorage.setItem(k, v);
        },

        /**
         * 获取session缓存
         * @param {*} key
         */
        getSessionData: function (k) {
            return sessionStorage.getItem(k);
        },

        /**
         * 设置session缓存
         * @param {*} key
         * @param {*} value
         */
        setSessionData: function (k, v) {
            sessionStorage.setItem(k, v);
        }
    };

    // ========================================================
    // 基础方法
    const Base = {
        // 优惠券只保存1元购的优惠券信息
        allOneCouponMap: new Map(),
        // 存放新人券的map
        isNewCouponMap: new Map(),
        // 存放非新人券的map
        isNotNewCouponMap: new Map(),
        // 搜索页获取每一行的元素
        getSearchRows: () => {
            const rows = $('div.product-group-leader section, div.group section');
            rows.each(function () {
                if (!$(this).hasClass('line-box')) {
                    $(this).addClass('line-box');
                }
            });
            return rows;
        },
        // 获取顶级的行元素
        getParentRow: (that) => $(that).closest('.line-box'),
        // 获取顶级的行元素并查找
        getParentRowWithFind: (that, selector) => Base.getParentRow(that).find(selector)
    }


    /**
     * 一键索索淘宝
     */
    class SearchPageHelper {

        // 使用私有静态字段保存单例实例
        static instance;

        constructor() {
            // 如果实例已存在，直接返回
            if (SearchPageHelper.instance) {
                return SearchPageHelper.instance;
            }

            // 初始化成员变量
            this.someCouponMapping = {
                "MDD": "辰达半导体",
            };

            // 保存当前实例
            SearchPageHelper.instance = this;
        }

        /**
         * 搜索列表中，对品牌颜色进行上色
         * list.szlcsc.com/catalog
         */
        static catalogBrandColor() {
            const brands = Array.from(Base.allOneCouponMap.entries());
            let index = 0;

            function processBatch() {
                const batchSize = 10; // 每帧处理10个品牌
                const end = Math.min(index + batchSize, brands.length);

                for (; index < end; index++) {
                    const [brandName, brandDetail] = brands[index];
                    const $brandEle = $(`li[title*="${brandName}"], span[title*="${brandName}"], a.brand-name[title*="${brandName}"]`)
                        .not('[style*="background-color"]')
                        .not('.isNew, .isNotNew');

                    if ($brandEle.length > 0) {
                        $brandEle.css({
                            "background-color": brandDetail.isNew ? '#00bfffb8' : '#7fffd4b8'
                        }).addClass(brandDetail.isNew ? 'isNew' : 'isNotNew');
                    }
                }

                if (index < brands.length) {
                    requestAnimationFrame(processBatch);
                }
            }

            processBatch();
        }


        /**
         * 筛选条件：多选品牌
         * @param {*} isNew 是否新人券 true/false
         */
        async multiFilterBrand(isNew) {
            $('li:contains("品牌"):contains("多选") div:contains("多选")').last().click();
            await Util.sleep(3000);
            const elementStr = isNew ? 'isNew' : 'isNotNew';
            $(`.${elementStr}`).each(function () {
                // 品牌名称
                const brandNameOrigin = Util.brandNameProcess($(this).text().trim().trim());
                if (Base.allOneCouponMap.has(brandNameOrigin)) {
                    if (Base.allOneCouponMap.get(brandNameOrigin).isNew === isNew) {
                        // 多选框选中
                        $(this).find('label').click();
                    }
                }
            })
            await Util.sleep(800);
            $('button[data-need-query*="lcsc_vid="][data-spm-reset]:contains("确定")').click();
        }

        /**
         * 类目筛选按钮租
         */
        btnsRender() {
            if ($('#_remind').length === 0) {
                $('li:contains("品牌"):contains("多选")').append(`
        <div id='_remind'>
            <span class='row_center get_new_coupon'><p class='new_'></p>新人券</span>
            <span class='row_center get_notnew_coupon'><p class='not_new_'></p>非新人券</span>
        </div>
        <style>
        #_remind {
            display: inline-block;
            position: absolute;
            top: 0px;
            right: 100px;
            width: 100px;
        }
        .row_center {
            display: inline-flex;
            align-items: center;
        }
        .new_ {
            background-color: #00bfffb8;
            margin-right: 10px;
            width: 20px;
            height: 10px;
        }
        .not_new_ {
            background-color: #7fffd4b8;
            margin-right: 10px;
            width: 20px;
            height: 10px;
        }
        .get_new_coupon,
        .get_notnew_coupon {
            cursor: pointer;
        }
        .get_new_coupon:hover,
        .get_notnew_coupon:hover {
            background: #e1e1e1;
        }
        </style>
        `)
                // 多选新人券
                $('.get_new_coupon').click(() => this.multiFilterBrand(true))
                // 多选非新人券
                $('.get_notnew_coupon').click(() => this.multiFilterBrand(false))
            }
        }

        /**
         * 获取优惠券列表信息，并暂存在变量集合中
         * 只获取1元购的优惠券
         */
        async getAllCoupon() {

            const buildData = (jsonText) => {
                const json = JSON.parse(jsonText);
                if (json.code === 200) {
                    // 取数据
                    const resultMap = json.result.couponModelVOListMap;
                    const allCouponNotNew = Object.values(resultMap).flat();
                    // 优惠券处理
                    processCouponList(allCouponNotNew, this.someCouponMapping);
                    console.log('allOneCouponMap: ', Base.allOneCouponMap);
                    console.log('isNewCouponMap: ', Base.isNewCouponMap);
                }
            }

            // 处理单个优惠券
            const processItem = (couponItem, referenceMap, someCouponMapping) => {
                // 是否新人券
                const isNew = couponItem.couponName.includes("<新人专享>");
                // 一些优惠券特殊处理
                for (let key in someCouponMapping) {
                    if (couponItem.couponTypeName == key) {
                        const newBrandName = someCouponMapping[key]
                        // 存到变量Map中
                        const newVar = {
                            brandId: couponItem.brandIds,
                            brandNames: couponItem.brandNames,
                            couponName: couponItem.couponName, // 优惠券名称
                            isNew: isNew, // 是否新人专享
                            couponPrice: couponItem.couponAmount, //优惠券金额减免
                            minOrderMoney: couponItem.minOrderMoney, //要求最低金额
                            pay: couponItem.minOrderMoney - couponItem.couponAmount, // 实际支付金额
                            brandName: newBrandName, // 品牌名称
                            couponId: couponItem.uuid, // 优惠券id
                            isHaved: couponItem.isReceive, // 是否已经领取
                            isUsed: couponItem.isUse, // 是否已经使用过
                            brandIndexHref: couponItem.targetUrl, // 对应的品牌主页地址
                            couponLink: `https://www.szlcsc.com/getCoupon/${couponItem.uuid}`, // 领券接口地址
                        };
                        referenceMap.set(newBrandName, newVar);
                        isNew && (Base.isNewCouponMap.set(couponItem.brandNames, newVar));
                        !isNew && (Base.isNotNewCouponMap.set(couponItem.brandNames, newVar));
                    }
                }
                // 存到变量Map中
                const newVar1 = {
                    brandId: couponItem.brandIds,
                    brandNames: couponItem.brandNames,
                    couponName: couponItem.couponName, // 优惠券名称
                    isNew: isNew, // 是否新人专享
                    couponPrice: couponItem.couponAmount, //优惠券金额减免
                    minOrderMoney: couponItem.minOrderMoney, //要求最低金额
                    pay: couponItem.minOrderMoney - couponItem.couponAmount, // 实际支付金额
                    brandName: couponItem.couponTypeName, // 品牌名称
                    couponId: couponItem.uuid, // 优惠券id
                    isHaved: couponItem.isReceive, // 是否已经领取
                    isUsed: couponItem.isUse, // 是否已经使用过
                    brandIndexHref: couponItem.targetUrl, // 对应的品牌主页地址
                    couponLink: `https://www.szlcsc.com/getCoupon/${couponItem.uuid}`, // 领券接口地址
                };
                referenceMap.set(couponItem.couponTypeName, newVar1);
                isNew && (Base.isNewCouponMap.set(couponItem.brandNames, newVar1));
                !isNew && (Base.isNotNewCouponMap.set(couponItem.brandNames, newVar1));
            }
            // 优惠券简单封装
            const processCouponList = (couponList, someCouponMapping) => {
                // 遍历
                for (let couponItem of couponList) {
                    const {
                        couponAmount,
                        minOrderMoney
                    } = couponItem;
                    // 1元购
                    if ((minOrderMoney - couponAmount) === 1) {
                        processItem(couponItem, Base.allOneCouponMap, someCouponMapping)
                    }
                }
            }

            // 获取缓存的我的优惠券数据
            const couponData = Util.getSessionData('COUPON_DATA');
            if (couponData) {
                if ([...Base.allOneCouponMap.keys()].length == 0) {
                    buildData(couponData);
                }
                return;
            }

            // http获取优惠券信息
            let json = await Util.getAjax(`https://activity.szlcsc.com/activity/coupon`);
            Util.setSessionData('COUPON_DATA', json);
            buildData(json);
        }

        /**
         * 一键搜索淘宝
         */
        appendSearchTbBtn() {
            if ($('.searchTaobao_').length === 0) {
                // 预售拼团 不处理，其他的都追加按钮
                $('button:contains("加入购物车")').after(`
                <button type="button" class="mb-[6px] h-[32px] w-full rounded-[6px] bg-[#0093E6] text-[12px] text-[white] hover:bg-[#47B2ED] searchTaobao_">一键搜淘宝</button>
            `)
            } else if ($('.searchTaobao_:not([addedClickHandler])').length > 0) {
                /**
                 * 非阻容，其他数据处理
                 * @param {*} parents 行级标签
                 * @param {*} resArr  数据存放的数组
                 */
                function other(parents, resArr) {
                    let productName = parents.find('dl dd:eq(0)').text().trim() || '';
                    if (productName.length === 0 || resArr.length > 0) {
                        return;
                    }
                    let footprint = parents.find('dl:contains("封装") dd span').text().trim() || '';
                    resArr.push(productName);
                    resArr.push(footprint);
                }

                /**
                 * 电阻数据处理
                 * @param {*} parents 行级标签
                 * @param {*} resArr  数据存放的数组
                 */
                function R(parents, resArr) {
                    const r = parents.find('dl:contains("阻值") dd span:eq(0)').text().replace('Ω', '').trim() || '';
                    if (r.length === 0 || resArr.length > 0) {
                        return;
                    }
                    const f = parents.find('dl:contains("封装") dd span:eq(0)').text().trim() || '';
                    const j = parents.find('dl:contains("精度") dd span:eq(0)').text().replace('±', '').trim() || '';
                    resArr.push(r);
                    resArr.push(f);
                    resArr.push(j);
                }

                /**
                 * 电容数据处理
                 * @param {*} parents  行级标签
                 * @param {*} resArr  数据存放的数组
                 */
                function C(parents, resArr) {
                    const c = parents.find('dl:contains("容值") dd span:eq(0)').text().trim() || '';
                    if (c.length === 0 || resArr.length > 0) {
                        return;
                    }
                    const v = parents.find('dl:contains("额定电压") dd span:eq(0)').text().trim() || '';
                    const j = parents.find('dl:contains("精度") dd span:eq(0)').text().replace('±', '').trim() || '';
                    const f = parents.find('dl:contains("封装") dd span:eq(0)').text().trim() || '';
                    resArr.push(c);
                    resArr.push(v);
                    resArr.push(j);
                    resArr.push(f);
                }

                $('.searchTaobao_:not([addedClickHandler])').attr('addedClickHandler', true).on('click', function (params) {
                    let searchArrVals = [];
                    const $parents = Base.getParentRow(this);
                    // 阻容处理、其他元件处理
                    R($parents, searchArrVals);
                    C($parents, searchArrVals);
                    other($parents, searchArrVals);
                    GM_openInTab(`https://s.taobao.com/search?q=${searchArrVals.join('/')}`, {
                        active: true,
                        insert: true,
                        setParent: true
                    })
                })
            }
        }

        /**
         * 左侧封装搜索
         */
        appendLeftRowBtns() {
            const rows = this.getSearchRows();
            [...rows.find('button:contains("复制")')].forEach(row => {
                const $btn = $(row);
                const specName = $btn.closest('section').find('dl:contains("封装")').find('dd').text();
                if ($btn.length > 0 && $btn.siblings('button:contains("封装精确匹配")').length === 0) {
                    // $btn.before(`<button spec-name="${specName}" select-type="MHC" style="width: 110px;" class='btn_search_manual mr-[10px] flex h-[26px] items-center justify-center rounded-[13px] bg-[#F5F6F9] text-[#333] hover:bg-[#ECEEF0]'>
                    //        <svg style="margin-right: 3px" t="1748570264460" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6531" width="16" height="16"><path d="M949.76 884.3264a88.68864 88.68864 0 0 1-25.64096 62.67904 87.14752 87.14752 0 0 1-123.76576 0.16896l-164.29568-160.87552a382.4128 382.4128 0 0 1-26.43968 12.6208 382.83776 382.83776 0 0 1-300.032 0 383.38048 383.38048 0 0 1-122.48064-83.39968 391.296 391.296 0 0 1 0-550.36928 384.56832 384.56832 0 0 1 627.55328 123.648 391.00416 391.00416 0 0 1-40.704 376.57088l150.32882 156.56448a88.576 88.576 0 0 1 25.47712 62.39232z m-153.6512-444.04736c0-186.33216-150.41536-337.92-335.30368-337.92s-335.32928 151.6032-335.32928 337.92S275.89632 778.24 460.8 778.24s335.3088-151.64928 335.3088-337.96096z m-503.61344 168.90368a240.45568 240.45568 0 0 1 0-337.73568l34.63168 40.07424a183.46496 183.46496 0 0 0 0 257.50528z" fill="#fa6650" p-id="6532"></path></svg>
                    //        封装模糊匹配
                    //        </button>`);
                    $btn.before(`<button spec-name="${specName}" select-type="JQC" style="width: 110px;" class='btn_search_manual mr-[10px] flex h-[26px] items-center justify-center rounded-[13px] bg-[#F5F6F9] text-[#333] hover:bg-[#ECEEF0]'>
                           <svg style="margin-right: 3px" t="1748569569792" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7704" width="16" height="16"><path d="M945.71 946c-18.67 18.67-49.21 18.67-67.88 0L674.18 742.35c-18.67-18.67-18.67-49.21 0-67.88 18.67-18.67 49.21-18.67 67.88 0l203.65 203.65c18.66 18.66 18.66 49.21 0 67.88z" fill="#CDD8F8" p-id="7705"></path><path d="M447.71 832c-51.82 0-102.11-10.16-149.49-30.2-45.73-19.34-86.79-47.02-122.04-82.27-35.25-35.25-62.93-76.31-82.27-122.04-20.04-47.37-30.2-97.67-30.2-149.49s10.16-102.11 30.2-149.49c19.34-45.73 47.02-86.79 82.27-122.04 35.25-35.25 76.31-62.93 122.04-82.27C345.6 74.16 395.89 64 447.71 64S549.82 74.16 597.2 94.2c45.73 19.34 86.79 47.02 122.04 82.27 35.25 33.25 62.93 76.31 82.27 122.04 20.04 47.37 30.2 97.67 30.2 149.49s-10.16 102.11-30.2 149.49c-19.34 45.73-47.02 86.79-82.27 122.04-35.25 35.25-76.31 62.93-122.04 82.27-47.38 20.04-97.67 30.2-149.49 30.2z m0-667.83c-75.81 0-147.09 29.52-200.7 83.13S163.88 372.18 163.88 448s29.52 147.09 83.13 200.7c53.61 53.61 124.88 83.13 200.7 83.13s147.09-29.52 200.7-83.13c53.61-53.61 83.13-124.88 83.13-200.7s-29.52-147.09-83.13-200.7-124.89-83.13-200.7-83.13z" fill="#5C76F9" p-id="7706"></path></svg>
                           封装精确匹配
                           </button>`);
                }
            });

            $('.btn_search_manual').off('click').on('click', function (e) {
                this._clickSpecFunc($(e.currentTarget), $(e.currentTarget).attr('spec-name'), $(e.currentTarget).attr('select-type'));
            }.bind(this));
        }

        /**
         * 获取搜索结果行
         */
        getSearchRows() {
            return Base.getSearchRows();
        }

        /**
         * 封装模糊匹配
         * @param specName
         * @private
         */
        _MHCEachClick(that, specName) {
            if ($(`.det-screen:contains("封装：") label.fuxuanku-lable:contains("${specName}")`).length > 0) {
                $(`.det-screen:contains("封装：") label.fuxuanku-lable:contains("${specName}")`).click();
            } else {
                if (specName.includes('-')) {
                    this._MHCEachClick(specName.split('-').slice(0, -1).join('-'));
                }
            }
        }

        /**
         * 封装精确匹配
         * @param specName
         * @private
         */
        async _JQCEachClick(that, specName) {
            console.log('Base.getParentRow(that)', Base.getParentRow(that))
            await Util.sleep(200);
            if ($(`.det-screen:contains("封装：") label.fuxuanku-lable[title="${specName}"]`).length > 0) {
                $(`.det-screen:contains("封装：") label.fuxuanku-lable[title="${specName}"]`).click();
            } else {
                if (specName.includes('-')) {
                    this._JQCEachClick(specName.split('-').slice(0, -1).join('-'));
                }
            }
        }

        async _clickSpecFunc(that, specName, selectType) {
            // 封装的筛选条件那一行 展开规格
            $('li:contains("封装"):contains("多选")').find('div:contains("多选")').click();
            switch (selectType) {
                // 模糊查
                case "MHC":
                    this._MHCEachClick(that, specName);
                    break;
                // 精确查
                case "JQC":
                    this._JQCEachClick(that, specName);
                    break;
            }
            // 查找规格对应的选项
            $(`.det-screen:contains("封装：") input[value="确定"]`).click();
        }
    };

    /**
     * 搜索页凑单列表
     */
    class SearchListHelper {
        // 使用私有静态字段保存单例实例
        static instance;
        // 是否已添加右下角的按钮
        static btnStatus = false;
        // 请求状态
        static fetchStatus = false;
        // 分页大小
        static searchPageRealSize = 200;
        // 查询结果暂存
        static listData = [];

        // 初始化默认选中状态
        static defaultTabs = {
            region: '江苏',
            userType: false
        };

        constructor() {
            // 如果实例已存在，直接返回
            if (SearchListHelper.instance) {
                return SearchListHelper.instance;
            }

            // 保存当前实例
            SearchListHelper.instance = this;
        }

        static async start(brandsNameOrSearchText, brandsId, maxCount, stock, parallel = false) {
            SearchListHelper.fetchStatus = false;
            SearchListHelper.listData = await SearchListHelper.getBrandsProducts(brandsNameOrSearchText, brandsId, maxCount, stock, parallel);
            console.log(SearchListHelper.listData);
            SearchListHelper.setCouponSign();
            SearchListHelper.renderMinPriceSearch();
        }

        // 设置商品列表的券标记
        static setCouponSign() {
            SearchListHelper.listData.forEach(e => {
                const newCoupon = Base.isNewCouponMap.get(e.lightBrandName);
                const notNewCoupon = Base.isNotNewCouponMap.get(e.lightBrandName);
                newCoupon && (e.isNew = newCoupon.isNew);
                notNewCoupon && (e.isNew = notNewCoupon.isNew);
            })
        }

        // 渲染页面
        renderListItems() {
            const stock = 'js';
            const searchValue = $('#global-seach-input').val() || '';
            let brandId = null;
            if (location.pathname.indexOf('brand') >= 0) {
                brandId = /\d+/.exec(location.pathname)[0] || null;
            }
            SearchListHelper.start(searchValue, brandId, 300, stock, false);
        }

        render() {
            if (!this.btnStatus) {
                $('head').prepend(`<style>
                .floating-button {
                  position: fixed;
                  border-radius: 5px;
                  right: 30px;
                  bottom: 30px;
                  z-index: 9999;
                  background-color: #409EFF; /* Element UI 主色 */
                  color: white;
                  padding: 15px 20px;
                  font-size: 15px;
                  font-weight: bold;
                  text-align: center;
                  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
                  transition: all 0.3s ease;
                  cursor: pointer;
                  border: none;
                  outline: none;
                  user-select: none;
                }
            
                .floating-button:hover {
                  background-color: #337ecc; /* 深蓝 */
                  box-shadow: 0 12px 16px rgba(0, 0, 0, 0.15);
                }
            
                .floating-button:active {
                  transform: scale(0.95); /* 点击反馈 */
                }
               
                .floating-card {
                    display: none; 
                    position: fixed;
                    border-radius: 10px;
                    width: 1220px;
                    right: 30px;
                    bottom: 90px;
                    min-height: 30vh; 
                    max-height: 85vh; 
                    overflow: hidden; 
                    border: 2px solid #199fe9; 
                    z-index: 10000000;
                    padding: 5px; 
                    background: white;
                }
                /* Tab 容器，占满卡片顶部宽度 */
                .tab-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 5px 10px 8px 10px;
                    border-bottom: 1px solid #ebeef5;
                    /*background-color: #f0f2f5;*/
                }

                /* Tab 按钮 */
                .tab-button {
                    width: 45%;
                flex: 1; /* 平均分配宽度 */
                margin: 0; /* 移除额外间距 */
                padding: 8px 12px;
                border: 2px solid #409EFF;
                background-color: white;
                color: #333;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: center;
                box-sizing: border-box;
                }

                /* 圆角处理：第一项左圆角，最后一项右圆角 */
                .tab-button:first-child {
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;
                }
                .tab-group:nth-child(2) .tab-button:nth-child(2) {
                border-left: unset;
                border-right: unset;
                }
                .tab-button:last-child {
                border-top-right-radius: 10px;
                border-bottom-right-radius: 10px;
                }

                /* 按钮悬停 */
                .tab-button:hover {
                background-color: #ecf5ff;
                }

                .tab-group {
                    width: 45%;
                    display: flex;
                    height: 50px;
                    justify-content: space-between;
                }

                /* 按钮选中样式 */
                .tab-button.active {
                background-color: #409EFF;
                color: white;
                font-weight: bold;
                }
                .card-body {
                    overflow-x: hidden;
                    overflow-y: scroll;
                    height: 65vh;
                }
                .inside-page1.list-items .line-box .one img {
                    width: 185px !important;
                }
              </style>`);
                $('body').prepend(`
                    <button id="searchListButton" show="false" class="floating-button">排序列表</button>
                    <!-- 卡片容器 -->
                    <div id="cardContainer" class="floating-card">
                        <!-- 卡片头部，包含 Tab 切换 -->
                        <div class="card-header">
                            <div class="tab-container">
                                <div class="tab-group">
                                <button class="tab-button" data-group="region" data-value="广东">广东</button>
                                <button class="tab-button active" data-group="region" data-value="江苏">江苏</button>
                                </div>
                                <div class="tab-group">
                                <button class="tab-button" data-group="userType" data-value="all">全部</button>
                                <button class="tab-button" data-group="userType" data-value="true">新人</button>
                                <button class="tab-button active" data-group="userType" data-value="false">非新人</button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body" id="listContainer">
                        <!-- 列表项将动态插入到这里 -->
                        
                        </div>
                    </div>
                    `);



                // 使用 jQuery 为按钮绑定点击事件
                $('#searchListButton').on('click', async () => {
                    $('#cardContainer').toggle();
                    $(this).attr('show', !$(this).attr('show'));
                    // 初始化
                    const emptyState = new EmptyState('#listContainer', {
                        icon: 'fa fa-search',
                        title: '没有找到结果 或 正在请求数据，请稍等。。',
                        showAction: false,
                        onAction: function() {
                            console.log('执行刷新操作');
                        }
                    });
                    // 显示空状态
                    emptyState.show();
                    if ($(this).attr('show')) {
                        await this.renderListItems();
                    }
                    emptyState.hide();
                    emptyState.destroy();
                });

                // 点击 Tab 按钮
                $('.tab-button').on('click', function () {
                    const $button = $(this);
                    const group = $button.data('group'); // 获取 data-group 属性
                    const value = $button.data('value'); // 获取 data-value 属性

                    // 移除同组所有按钮的 active 类
                    $('.tab-button').filter(function () {
                        return $(this).data('group') === group;
                    }).removeClass('active');

                    // 为当前按钮添加 active 类
                    $button.addClass('active');

                    // 更新选中状态
                    SearchListHelper.defaultTabs[group] = value;
                    console.log('当前选中:', SearchListHelper.defaultTabs);

                    SearchListHelper.renderMinPriceSearch();
                });

                this.btnStatus = true;
            }
        }

        /**
         * 搜索主页的凑单逻辑
         */
        async renderMainPageMinPriceSearch() {
            // 避免重复执行
            if (this.globalSearchEnd) return;

            const searchInput = $('#search-input');
            const searchValue = searchInput.val();

            // 输入为空时清空缓存并返回
            if (!searchValue?.trim()) {
                searchTempList = [];
                return;
            }

            this.globalSearchEnd = true;

            try {
                // 获取总页数
                const totalPage = searchTotalPage();

                // 收集表单数据
                const formData = Array.from($('form#allProjectFrom > input[type="hidden"]'))
                    .filter(item => !$(item).attr('id')?.includes('SloganVal') &&
                        !$(item).attr('id')?.includes('LinkUrlVal'))
                    .reduce((acc, item) => {
                        const name = $(item).attr('name');
                        acc[name] = $(item).val();
                        return acc;
                    }, {});

                // 创建并发请求队列（限制并发数为3）
                const requestQueue = [];
                for (let pn = 1; pn <= totalPage && pn <= 30; pn++) {
                    const data = {
                        ...formData,
                        pageNumber: pn,
                        k: searchValue,
                        sk: searchValue,
                        localQueryKeyword: ''
                    };

                    requestQueue.push(
                        $.ajax({
                            url: "https://so.szlcsc.com/search",
                            method: "POST",
                            data: data,
                            timeout: 10000 // 添加超时限制
                        })
                    );
                }

                // 显示加载进度
                const progressContainer = $('.wait-h2');
                progressContainer.html(`数据加载中...</br>(共${Math.min(totalPage, 30)}页，正在加载第1页...`);

                // 并发执行请求并跟踪进度
                const results = await allWithProgress(requestQueue, ({total, cur}) => {
                    progressContainer.html(`数据加载中...</br>(共${total}页，正在加载第${cur}页... ${Math.round((cur / total) * 100)}%)`);
                });

                // 处理响应数据（过滤无效响应）
                const validResults = results.filter(
                    res => res?.code === 200 && res.result?.productRecordList?.length > 0
                );

                // 合并搜索结果（使用Set去重）
                searchTempList = [...new Set([
                    ...searchTempList,
                    ...validResults.flatMap(res => res.result.productRecordList)
                ])];

                // 渲染结果
                renderMinPriceSearch();

                // 延迟触发筛选事件（使用MutationObserver替代setTimeout）
                const observer = new MutationObserver(() => {
                    $('#js-filter-btn').trigger('click');
                    observer.disconnect();
                });

                observer.observe(document.body, {childList: true, subtree: true});

                console.timeEnd('搜索首页凑单渲染速度');

            } catch (error) {
                console.error('搜索请求失败:', error);
                $('.wait-h2').html('搜索加载失败，请重试');
                this.globalSearchEnd = false;
            }
        }

        /**
         * 搜索页-查找最低价 列表渲染方法
         */
        static renderMinPriceSearch() {
            // 如果广东仓和江苏仓同时没有货的话，那么就属于订货商品，不需要显示
            // 如果没有价格区间，证明是停售商品
            var newList = SearchListHelper.listData.filter(item => !(parseInt(item.jsWarehouseStockNumber || 0) <= 0 && parseInt(item.gdWarehouseStockNumber || 0) <= 0) && item.productPriceList.length > 0);
            // 去重
            const map = new Map();
            newList.forEach(item => {
                map.set(item.productId, item);
            });
            newList = [...map.values()];
            // 列表自动正序，方便凑单
            newList.sort((o1, o2) => {
                return (o1.theRatio * o1.productPriceList[0].productPrice * (o1.listProductDiscount || 10) / 10).toFixed(6) - (o2.theRatio * o2.productPriceList[0].productPrice * (o2.listProductDiscount || 10) / 10).toFixed(6);
            });

            // 指定仓库
            const {region, userType} = SearchListHelper.defaultTabs;
            newList.forEach(e => {
                if (userType === 'all' && region === '江苏') {
                    e.show = (e.jsWarehouseStockNumber > 0);
                    return
                } else if (userType === 'all' && region === '广东') {
                    e.show = (e.gdWarehouseStockNumber > 0);
                    return
                }

                if (region === '江苏') {
                    e.show = (e.jsWarehouseStockNumber > 0) && e.isNew == userType;
                    return
                } else if (region == '广东') {
                    e.show = (e.gdWarehouseStockNumber > 0) && e.isNew == userType;
                    return
                }
            })

            // 取指定条数的数据。默认50个
            const html = newList.slice(0, (SearchListHelper.searchPageRealSize || 50)).map(item => {
                const {
                    productId,
                    lightStandard,
                    lightProductCode,
                    productCode,
                    productMinEncapsulationNumber,
                    productMinEncapsulationUnit,
                    productName,
                    productModel,
                    lightProductModel,
                    productGradePlateId,
                    productPriceList,
                    priceDiscount,
                    listProductDiscount,
                    productGradePlateName,
                    hkConvesionRatio,
                    convesionRatio,
                    theRatio,
                    smtStockNumber,
                    smtLabel,
                    productStockStatus,
                    isPlusDiscount,
                    productUnit,
                    isPresent,
                    isGuidePrice,
                    minBuyNumber,
                    hasSampleRule,
                    breviaryImageUrl,
                    luceneBreviaryImageUrls,
                    productType,
                    productTypeCode,
                    pdfDESProductId,
                    gdWarehouseStockNumber,
                    jsWarehouseStockNumber,
                    paramLinkedMap,
                    recentlySalesCount,
                    batchStockLimit,
                    isNew,
                    show,
                } = item;

                return `<table class="inside inside-page1 tab-data no-one-hk list-items" 
                                            style="${show ? 'display: block;' : 'display: none;'}"
                            id="product-tbody-line-${productId}" width="100%" border="0"
                            cellspacing="0" cellpadding="0" data-curpage="1" data-mainproductindex="0"
                            pid="${productId}" psid
                            data-batchstocklimit="${batchStockLimit}" data-encapstandard="${lightStandard}"
                            data-hassamplerule="${hasSampleRule}" data-productcode="${productCode}"
                            data-productminencapsulationnumber="${productMinEncapsulationNumber}"
                            data-productminencapsulationunit="${productMinEncapsulationUnit}" data-productmodel="${productModel}"
                            data-productname="${productName}"
                            data-productstockstatus="${productStockStatus}"
                            data-convesionratio="${convesionRatio}" data-theratio="${theRatio}" data-hkconvesionratio="${hkConvesionRatio}"
                            data-productunit="${productUnit}" data-isplusdiscount="${isPlusDiscount}"
                            data-isguideprice="${isGuidePrice}" data-ispresent="${isPresent}" data-brandid="${productGradePlateId}"
                            data-brandname="${productGradePlateName}"
                            data-productmodel-unlight="${lightProductModel}" data-istiprovider data-isptoc
                            data-firstprice="${productPriceList[0].discountPrice || productPriceList[0].productPrice}" data-minbuynumber="${minBuyNumber}"
                            data-provider data-reposition data-productid="${productId}">
                            <tbody>
                                <tr class="no-tj-tr add-cart-tr" data-inventory-type="local" pid="${productId}">
                                <td class="line-box">
                                    <div class="one line-box-left">
                                    <a class="one-to-item-link"
                                        href="https://item.szlcsc.com/${productId}.html?fromZone=s_s__%2522123%2522"
                                        target="_blank" data-trackzone="s_s__&quot;123&quot;"
                                        onclick="goItemDetailBuriedPoint('${productId}', this, 'picture', 's_s__&quot;${$("#search-input").val()}&quot;', null, '0')">
                                        <img
                                        src="${breviaryImageUrl}"
                                        productid="${productId}" alt="${productName}"
                                        xpath="${breviaryImageUrl}"
                                        data-urls="${luceneBreviaryImageUrls}"
                                        showflag="yes"
                                        onerror="javascript:this.src='//static.szlcsc.com/ecp/assets/web/static/images/default_pic.gif'">
                                    </a>
                                    </div>
                                    <div class="line-box-right">
                                    <div class="line-box-right-bottom">
                                        <div class="two">
                                        <div class="two-01 two-top">
                                            <ul class="l02-zb">
                                            <li class="li-ellipsis">
                                                <a title="${productName}"
                                                class="ellipsis product-name-link  item-go-detail"
                                                href="https://item.szlcsc.com/${productId}.html?fromZone=s_s__%2522123%2522"
                                                target="_blank"
                                                data-trackzone="s_s__&quot;123&quot;"
                                                onclick="goItemDetailBuriedPoint('${productId}', this, 'name', 's_s__&quot;${$("#search-input").val()}&quot;', null, '0')">
                                                ${lightProductModel}</a>
                                            </li>
                                            <li class="band li-ellipsis"
                                                onclick="commonBuriedPoint(this, 'go_brand')">
                                                <span class="c9a9a9a" title="品牌：${productGradePlateName}">品牌:</span>
                                                <a class="brand-name" title="点击查看${productGradePlateName}的品牌信息"
                                                href="https://list.szlcsc.com/brand/${productGradePlateId}.html"
                                                target="_blank">
                                                ${productGradePlateName}
                                                </a>
                                            </li>
                                            <li class="li-ellipsis">
                                                <span class="c9a9a9a" title="封装:${lightStandard}">封装:</span>
                                                <span title="${lightStandard}">${lightStandard}</span>
                                            </li>
                                            <li>
                                            </li>
                                            </ul>
                                            <ul class="l02-zb params-list">
                                            ${Object.keys(paramLinkedMap).map(key => {
                    return `<li class="li-ellipsis">
                                                <span class="c9a9a9a">${key}</span>:
                                                <span title="${paramLinkedMap[key]}">${paramLinkedMap[key]}</span>
                                                </li>`
                }).join('')}
                                            </ul>
                                            <ul class="l02-zb">
                                            <li class="li-ellipsis"
                                                onclick="commonBuriedPoint(this, 'go_catalog')">
                                                <span class="c9a9a9a">类目:</span>
                                                <a title="${productType}" target="_blank"
                                                class="catalog ellipsis underLine"
                                                href="https://list.szlcsc.com/catalog/${productTypeCode}.html">
                                                ${productType}
                                                </a>
                                            </li>
                                            <li class="li-ellipsis">
                                                <span class="c9a9a9a">编号:</span>
                                                <span>${lightProductCode}</span>
                                            </li>
                                            <li class="li-ellipsis">
                                                <span class="c9a9a9a">详细:</span>
                                                <a class="sjsc underLine" target="_blank" href="https://item.szlcsc.com/datasheet/1N4148W/${productId}.html" productid="${productId}"
                                                param-click="${pdfDESProductId}">
                                                数据手册
                                                </a>
                                            </li>
                                            </ul>
                                        </div>
                                        <div class="two-bottom">
                                            <!-- <li class="tag-wrapper">-->
                                            <!--</li>-->
                                            <!--<div class="three-box-bottom common-label common-useless-label">-->
                                            <!--<section class="smt-price" id="SP-LIST">-->
                                            <!--    <a target="_blank" data-pc="${lightProductCode}" class="to-jlc-smt-list"-->
                                            <!--    href="https://www.jlcsmt.com/lcsc/detail?componentCode=${lightProductCode}&amp;stockNumber=10&amp;presaleOrderSource=shop">嘉立创贴片惊喜价格(库存<span-->
                                            <!--        class="smtStockNumber">${smtStockNumber}</span>)</a>-->
                                            <!--</section>-->
                                            <!--</div>-->
                                            <!-- SMT 基础库、扩展库 -->
                                            <!--<div class="smt-flag common-label">${smtLabel}</div> -->
                                        </div>
                                        </div>
                                        <div class="three-box hasSMT">
                                        <div class="three-box-top">
                                            <div class="three">
                                            <ul class="three-nr">
                                            ${listProductDiscount != null && listProductDiscount < 10 ? `
                                            <li class="three-nr-01">
                                            <span>${listProductDiscount}折</span>
                                            <span class="show-discount-icon">
                                                <div class="common-float-dialog">
                                                <div class="common-float-content">
                                                    <ul class="cel-item num-cel">
                                                    <li></li>
                                                    ${productPriceList.map(item => {
                    return `<li>${item.startPurchasedNumber * theRatio}+:&nbsp;</li>`;
                }).join('')}
                                                    </ul>
                                                    <ul class="cel-item mr5">
                                                    <li class="text-align-center">折后价</li>
                                                    ${productPriceList.map(item => {
                    return `<li>￥${parseFloat((item.productPrice * (listProductDiscount || 10) / 10).toFixed(6))}</li>`;
                }).join('')}
                                                    </ul>
                                                    <ul class="cel-item not-plus-o-price-cel">
                                                    <li class="text-align-center">原价</li>
                                                        ${productPriceList.map(item => {
                    return `<li class="o-price">￥${item.productPrice}</li>`;
                }).join('')}
                                                    </ul>
                                                </div>
                                                <s class="f-s"><i class="f-i"></i></s>
                                                </div>
                                            </span>
                                        </li>
                                            ` : ''}
                                                <p class="minBuyMoney_" style="
                                                    width: fit-content;
                                                    padding: 2px 3px;
                                                    font-weight: 600;
                                                    color: #0094e7;">最低购入价： ${parseFloat((theRatio * productPriceList[0].productPrice * (listProductDiscount || 10) / 10).toFixed(6))}</p>
                                                    ${productPriceList.map(item => {
                    const discountPrice = parseFloat((item.productPrice * (listProductDiscount || 10) / 10).toFixed(6));
                    return `<li class="three-nr-item">
                                                                        <div class="price-warp price-warp-local">
                                                                            <p class="ppbbz-p no-special " minordernum="${item.startPurchasedNumber * theRatio}"
                                                                            originalprice="${item.productPrice}" discountprice="${discountPrice}"
                                                                            orderprice="${discountPrice}">
                                                                            ${item.startPurchasedNumber * theRatio}+:&nbsp;
                                                                            </p>
                                                                            <span class="ccd ccd-ppbbz show-price-span"
                                                                            minordernum="${item.startPurchasedNumber * theRatio}" data-endpurchasednumber="${item.endPurchasedNumber}"
                                                                            data-productprice="${item.productPrice}" data-productprice-discount
                                                                            orderprice="${item.productPrice}"
                                                                            data-startpurchasednumber="${item.startPurchasedNumber}">
                                                                            ￥${discountPrice}
                                                                            </span>
                                                                        </div>
                                                                    </li>`;
                }).join('')}
                                            </ul>
                                            </div>
                                            <div class="three three-hk">
                                            </div>
                                        </div>
                                        </div>
                                        <div class="conformity-box">
                                        <div class="conformity-box-top">
                                            <div class="three-change">
                                            <ul class="finput">
                                                <li class="stocks stocks-change stocks-style"
                                                local-show="yes" hk-usd-show="no">
                                                <div class="stock-nums-gd">广东仓:<span style="font-weight:bold">${gdWarehouseStockNumber}</span></div>
                                                <div class="stock-nums-js">江苏仓:<span style="font-weight:bold">${jsWarehouseStockNumber}</span></div>
                                                </li>
                                                <li class="display-none">
                                                <div local-show="no" hk-usd-show="yes">
                                                </div>
                                                </li>
                                            </ul>
                                            <!--
                                                <div class="smt-stock">广东SMT仓: <span style="font-weight:bold">
                                                ${smtStockNumber}
                                                </span></div>
                                            -->
                                            </div>
                                            <div class="ffour">
                                            <ul class="finput">
                                                <li class="price-input price-input-gd local-input">
                                                <input type="text" maxlength="9" unit-type="single"
                                                    class="cartnumbers " pluszk="false"
                                                    oninput="if(value>${gdWarehouseStockNumber})value=${gdWarehouseStockNumber};if(value<0)value=0"
                                                    max="${gdWarehouseStockNumber}" min="${productMinEncapsulationNumber}"
                                                    data-theratio="${theRatio}"
                                                    data-pricediscount='${JSON.stringify(priceDiscount)}'
                                                    data-productpricelist='${JSON.stringify(productPriceList)}'
                                                    data-unitnum="${productMinEncapsulationNumber}" placeholder="广东仓" data-defaultwarehouse="sz"
                                                    data-type="gd" data-gdstock="${gdWarehouseStockNumber}" value>
                                                <div class="unit ">
                                                    <span class="cur-unit ">个</span>
                                                    <i class="xl"></i>
                                                    <div class="unit-contain" style="display: none;">
                                                    <div class="unit-type">
                                                        <span class="unit-one">个</span>
                                                        <span class="unit-two">${productMinEncapsulationUnit}</span>
                                                    </div>
                                                    <i class="sl"></i>
                                                    </div>
                                                </div>
                                                </li>
                                                <li class="price-input price-input-js local-input">
                                                <input type="text" maxlength="9" unit-type="single"
                                                    class="cartnumbers " pluszk="false"
                                                    oninput="if(value>${gdWarehouseStockNumber})value=${gdWarehouseStockNumber};if(value<0)value=0"
                                                    max="${jsWarehouseStockNumber}" min="${productMinEncapsulationNumber}"
                                                    data-theratio="${theRatio}"
                                                    data-pricediscount='${JSON.stringify(priceDiscount)}'
                                                    data-productpricelist='${JSON.stringify(productPriceList)}'
                                                    data-unitnum="${productMinEncapsulationNumber}" placeholder="江苏仓" data-defaultwarehouse="sz"
                                                    data-type="js" data-jsstock="${jsWarehouseStockNumber}" value>
                                                <div class="unit ">
                                                    <span class="cur-unit ">个</span>
                                                    <i class="xl"></i>
                                                    <div class="unit-contain" style="display: none;">
                                                    <div class="unit-type">
                                                        <span class="unit-one">个</span>
                                                        <span class="unit-two">${productMinEncapsulationUnit}</span>
                                                    </div>
                                                    <i class="sl"></i>
                                                    </div>
                                                </div>
                                                </li>
                                                <li class="totalPrice-li">
                                                ${productMinEncapsulationNumber}个/${productMinEncapsulationUnit}
                                                &nbsp;总额:<span class="goldenrod totalPrice">￥0</span>
                                                <div class="plus_mj">
                                                    <div class="plus-flag">
                                                    <span><span class="mj-name"></span>已优惠<span
                                                        class="mj-money">0</span>元！</span>
                                                    <s><i></i></s>
                                                    </div>
                                                </div>
                                                
                                                </li>
                                            </ul>
                                            <button type="button" style="
                                                width: 130px;
                                                height: 33px;
                                                border: none;
                                                border-radius: 2px;
                                                background: #ff7800;
                                                color: #fff;
                                                " class="pan-list-btn addCartBtn" 
                                                data-theratio="${theRatio}" 
                                                data-productcode="${productCode}">加入购物车</button>
                                            <ul class="pan">
                                                <li class="pan-list">
                                                <div class="stocks">
                                                    <span>近期成交${recentlySalesCount}单</span>
                                                </div>
                                            </ul>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </td>
                                </tr>
                                <tr
                                class="more-channel-products items-overseas-products display-none hide-tr">
                                <td colspan="6" id="overseasList" oldbatchproductlist
                                    isgroupproduct="false" listlength="30" productid="${productId}">
                                </td>
                                </tr>
                                <tr class="more-channel-products items-hk-products display-none hide-tr">
                                <td colspan="6" id="hkProductList" oldbatchproductlist
                                    isgroupproduct="false" listlength="30" productid="${productId}">
                                </td>
                                </tr>
                            </tbody>
                            </table>`;
            }).join('');

            $('#listContainer').html(html);

            $('.cartnumbers').off('change').on('change', function () {
                let val = $(this).val();
                if (!val) { return ; }
                const theratio = $(this).data("theratio");
                val = Math.max(parseInt(val / theratio) * theratio, theratio);
                $(this).val(val);
                const productPriceList = $(this).data("productpricelist");
                const priceDiscount = $(this).data("pricediscount");
                const result = PriceCalculator.calculatePrice(val, theratio, productPriceList, priceDiscount);

                console.log(val)
                console.log('计算结果:', result);
                Base.getParentRow(this).find('.totalPrice').text('￥' + result.discountTotalPrice.toFixed(2));
            });

            $('.addCartBtn').off('click').on('click', function () {
                let num = [...Base.getParentRowWithFind(this, '.cartnumbers')]
                    .reduce((a,b)=> a + (parseInt($(b).val()) || 0), 0);

                if (!num) {
                    const newNum = parseInt($(this).data('theratio'));
                    window.$message.error(`数量为空，已为您修正数量为：${newNum}！`, 3000);
                    num = newNum;
                }

                Util.postFormAjax(`https://cart.szlcsc.com/cart/quick`, {
                    productCode: $(this).data('productcode'),
                    productNumber: num
                }).then(e => {
                    if(JSON.parse(e).code === 200) {
                        window.$message.success('加入购物车成功！', 3000);
                    }
                });
            });
        }

        /**
         * 获取品牌商品列表
         * @param brandsNameOrSearchText 品牌名称或者搜索框内容
         * @param brandsId 品牌id，可为空，不为空时提高搜索准确率
         * @param maxCount 最大商品数量，为空时返回所有商品
         * @param stock 仓库，js/gd
         * @returns {Promise<unknown>}
         */
        static getBrandsProducts_old(brandsNameOrSearchText, brandsId = null, maxCount = null, stock = 'js') {
            return new Promise((resolve, reject) => {
                const url = 'https://so.szlcsc.com/search';
                let products = [];
                let counts = 0;
                const getData = (page) => {
                    let data = {
                        os: '',
                        dp: '',
                        sb: 1, // 价格从低排序
                        queryPlaceProduction: '',
                        pn: page,
                        c: '',
                        k: brandsNameOrSearchText,
                        tc: 0,
                        pds: 0,
                        pa: 0,
                        pt: 0,
                        gp: 0, /*品牌id*/
                        queryProductDiscount: '',
                        st: '',
                        sk: brandsNameOrSearchText,
                        searchSource: '',
                        bp: '',
                        ep: '',
                        bpTemp: '',
                        epTemp: '',
                        stock: stock,
                        needChooseCusType: '',
                        'link-phone': '',
                        companyName: '',
                        taxpayerIdNum: '',
                        realityName: '',
                    }

                    if (brandsId) {
                        // data.queryProductGradePlateId = brandsId
                        data.gp = brandsId
                    }
                    Util.postFormAjax(url, data).then(res => {
                        if (!res) return reject('获取品牌商品列表失败')
                        res = typeof res === 'object' ? res : JSON.parse(res)
                        if (!res.code || res.code !== 200) return reject(res.msg || '获取品牌商品列表失败')
                        if (!res.result || !res.result.productRecordList || res.result.productRecordList.length === 0) return resolve(products)
                        products = products.concat(res.result.productRecordList)
                        counts += res.result.productRecordList.length
                        if (maxCount && counts >= maxCount) return resolve(products)
                        getData(page + 1)
                    }).catch(err => {
                        reject(err)
                    })
                }
                getData(1);
            })
        }

        /**
         * 获取品牌商品列表
         * @param brandsName 品牌名称
         * @param brandsId 品牌id，可为空，不为空时提高搜索准确率
         * @param maxCount 最大商品数量，为空时返回所有商品
         * @param stock 仓库，js/gd
         * @returns {Promise<unknown>}
         */
        static getBrandsProducts_new(brandsName, brandsId = null, maxCount = null, stock = 'js') {

            // sortNumber 10 广东有货排序
            // sortNumber 12 江苏有货排序
            // sortNumber 6  销量排序
            return new Promise((resolve, reject) => {
                const url = 'https://list.szlcsc.com/brand/product?';
                let products = [];
                let counts = 0;
                const sortNumber = !brandsId || brandsId.length == 0 ? 0 : (stock == 'js' ? 1 : 2);
                const getData = (page) => {
                    let data = {
                        "currentPage": page,
                        "pageSize": 30,
                        "catalogIdFilter": "",
                        "brandIdFilter": brandsId + "",
                        "standardFilter": "",
                        "arrangeFilter": "",
                        "labelFilter": "",
                        "keyword": brandsName,
                        "sortNumber": 6,
                        "satisfyStockType": "",
                        "startPrice": "",
                        "endPrice": "",
                        "demandNumber": "",
                        "spotFilter": 1,
                        "discountFilter": 1,
                        "hasDataFile": false,
                        "brandPlaceFilter": "",
                        "secondKeyword": "",
                        "queryParameterValue": "",
                        "lastParamName": ""
                    }
                    Util.getAjax(url + Util.jsonToUrlParam(data)).then(res => {
                        if (!res) return reject('获取品牌商品列表失败')
                        res = typeof res === 'object'? res : JSON.parse(res)
                        if (!res.code || res.code !== 200) return reject(res.msg || '获取品牌商品列表失败')
                        const list = res?.result?.searchResult?.productRecordList;
                        if (!list || list.length === 0) return resolve(products)
                        products = products.concat(list)
                        counts += list.length
                        if (maxCount && counts >= maxCount) return resolve(products)
                        getData(page + 1)
                    }).catch(err => {
                        reject(err)
                    })
                }
                getData(1)
            })
        }

        /**
         * 获取品牌商品列表（支持并行或单线程）
         * @param brandsNameOrSearchText 品牌名称或者搜索框内容
         * @param brandsId 品牌id，可为空，不为空时提高搜索准确率
         * @param maxCount 最大商品数量，为空时返回所有商品
         * @param stock 仓库，js/gd
         * @param parallel 是否并行执行请求，默认为false（单线程）
         * @returns {Promise<unknown>}
         */
        static getBrandsProducts(brandsNameOrSearchText, brandsId = null, maxCount = null, stock = 'js', parallel = false) {
            return new Promise((resolve, reject) => {
                const url = 'https://so.szlcsc.com/search';
                let products = [];
                let counts = 0;

                const getPageDataByNewApi = (page) => {
                    let data = {
                        currentPage: 1,
                        pageSize: 30,
                        catalogIdFilter:526,
                        brandIdFilter:15352,
                        standardFilter: '',
                        brandPlaceFilter: '',
                        labelFilter: '',
                        arrangeFilter: '',
                        smtLabelFilter: '',
                        spotFilter:1,
                        discountFilter: 1,
                        startPrice: '',
                        endPrice: '',
                        sortNumber: 0,
                        queryParameterValue: '',
                        lastParamName: '',
                        keyword: '',
                        secondKeyword: '',
                        hasDataFile:false,
                        demandNumber: '',
                        satisfyStockType: ''
                    }


                }

                // 获取单页数据
                const getPageData = (page) => {
                    let data = {
                        os: '',
                        dp: '',
                        sb: 1,
                        queryPlaceProduction: '',
                        pn: page,
                        c: '',
                        k: brandsNameOrSearchText,
                        tc: 0,
                        pds: 0,
                        pa: 0,
                        pt: 0,
                        gp: 0, /*品牌id*/
                        queryProductDiscount: '',
                        st: '',
                        sk: brandsNameOrSearchText,
                        searchSource: '',
                        bp: '',
                        ep: '',
                        bpTemp: '',
                        epTemp: '',
                        stock: stock,
                        needChooseCusType: '',
                        'link-phone': '',
                        companyName: '',
                        taxpayerIdNum: '',
                        realityName: '',
                    };

                    if (brandsId) {
                        // data.queryProductGradePlateId = brandsId;
                        data.gp = brandsId;
                    }

                    return Util.postFormAjax(url, data)
                        .then(res => {
                            if (!res) throw new Error('获取品牌商品列表失败');
                            res = typeof res === 'object' ? res : JSON.parse(res);
                            if (!res.code || res.code !== 200) throw new Error(res.msg || '获取品牌商品列表失败');
                            return res.result.productRecordList || [];
                        });
                };

                // 单线程模式（顺序执行）
                const executeSequentially = (page) => {
                    getPageData(page)
                        .then(pageProducts => {
                            if (pageProducts.length === 0) return resolve(products);

                            products = products.concat(pageProducts);
                            counts += pageProducts.length;

                            if (maxCount && counts >= maxCount) {
                                return resolve(products.slice(0, maxCount));
                            }

                            executeSequentially(page + 1);
                        })
                        .catch(err => reject(err));
                };

                // 并行模式（不考虑顺序）
                const executeInParallel = () => {
                    // 先获取第一页，确定总页数
                    getPageData(1)
                        .then(firstPageProducts => {
                            if (firstPageProducts.length === 0) return resolve([]);

                            // 假设每页数量相同，计算总页数
                            const estimatedTotalPages = maxCount
                                ? Math.ceil(maxCount / firstPageProducts.length)
                                : 10; // 默认最多10页（防止无限请求）

                            // 生成所有页面的请求数组
                            const pageRequests = [];
                            for (let i = 1; i <= estimatedTotalPages; i++) {
                                pageRequests.push(getPageData(i));
                            }

                            // 并行执行所有请求
                            Promise.all(pageRequests)
                                .then(allPages => {
                                    const allProducts = allPages.flat();
                                    if (maxCount) {
                                        resolve(allProducts.slice(0, maxCount));
                                    } else {
                                        resolve(allProducts);
                                    }
                                })
                                .catch(err => reject(err));
                        })
                        .catch(err => reject(err));
                };

                // 根据 parallel 参数选择执行模式
                if (parallel) {
                    executeInParallel();
                } else {
                    executeSequentially(1);
                }
            });
        }
    }

    // 分类品牌颜色定时器开启状态，默认false
    let catalogBrandColorTaskIsStartStatus = false;

    // 搜索页启动
    function searchStart() {
        // 每行追加到按钮组
        const searchPageHelper = new SearchPageHelper();
        searchPageHelper.appendLeftRowBtns();
        searchPageHelper.appendSearchTbBtn();
        // 优惠券信息获取
        searchPageHelper.getAllCoupon();
        // // 搜索页按钮组渲染
        searchPageHelper.btnsRender();
        // // 定时上色
        if (!catalogBrandColorTaskIsStartStatus) {
            setInterval(SearchPageHelper.catalogBrandColor, 3000);
            catalogBrandColorTaskIsStartStatus = true;
        }

        const searchListHelper = new SearchListHelper();
        searchListHelper.render();
    }

    // 搜索页判断
    let isSearchPage = () => location.href.includes('so.szlcsc.com/global.html') ||
        location.href.includes('list.szlcsc.com/brand/') ||
        location.href.includes('list.szlcsc.com/catalog');

    setInterval(function () {
        if (isSearchPage()) {
            searchStart();
        }
    }, 1500)

})()
