// ==UserScript==
// @name         纪念币预约辅助工具
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  纪念币预约辅助工具，支持数据导入导出、智能填充、格式验证等功能，提升预约效率
// @author       jiangbkvir
// @include      *://*.ccb.com/*
// @include      *://*.psbc.com/*
// @include      *://*.boc.cn/*
// @include      *://*.cmcoins.boc.cn/*
// @include      *://*.95559.com.cn/*
// @include      *://*.hxb.com.cn/*
// @include      *://*.icbc.com.cn/*
// @include      *://*.spdb.com.cn/*
// @include      *://*.hsbank.cc/*
// @include      *://*.startbank.com.cn/*
// @include      *://*.96262.com/*
// @include      *://*.abchina.com/*
// @include      *://*.abchina.com.cn/*
// @include      *://jiangbkvir.github.io/jinianbi/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521357/%E7%BA%AA%E5%BF%B5%E5%B8%81%E9%A2%84%E7%BA%A6%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/521357/%E7%BA%AA%E5%BF%B5%E5%B8%81%E9%A2%84%E7%BA%A6%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==



// ====================================================================================
const bankObj = {
  建设银行: {
    mobile: "https://m2.ccb.com/cn/jnb/mobilev3/subject/index.html",
    pc: "https://sinfo2.ccb.com/cn/jnb/subject/index.html"
  },
  邮政储蓄银行: {
    mobile: "https://wap.psbc.com/mobilebank/commemorativeCoinMenu.do?EMPTEMP=TEMP&version=html5&printNo_temp=o1FgEjzfW-s4SYWrSGZkeAo4Ohkc",
    pc: "https://pbank.psbc.com/perbank/commemorativeCoinMake.gate"
  },
  中国银行: {
    mobile: "https://mbas.cmcoins.boc.cn/CoinSeller/coinNew/index.html#/souvenirCoin?terminal=20&appid=wx567af860fd4db040&bankCode=001001",
    pc: "https://cmcoins.boc.cn/BOC15_CoinSeller/welcome.html"
  },
  交通银行: {
    pc: "https://apply.95559.com.cn/personbank/commemorativeOrderCoins/index.html#/order"
  },
  华夏银行: {
    mobile: "https://mcm.hxb.com.cn/m/coin/#/coinAct?publish_channel_id=003"
  },
  工商银行: {
    mobile: "https://static.jnb.icbc.com.cn/ICBC/ICBCCOIN/roccentry.html",
    pc: "https://static.jnb.icbc.com.cn/ICBC/ICBCCOIN/roccentryPC.html"
  },
  浦发银行: {
    mobile: "https://wap.spdb.com.cn/mspmk-cli-coinrsv/CoinHome"
  },
  徽商银行: {
    mobile: "https://wxyh.hsbank.cc:10443/GATEWAYPZB-SERVER/index.html#/?_ChannleId=hsbank&type=123"
  },
  晋商银行: {
    mobile: "https://upbp.startbank.com.cn/rvcc/JNB/index.html?channel=01#/"
  },
  陕西农信: {
    pc: "https://www.96262.com/xh/jnb/index.shtml"
  },
  农业银行: {
    mobile: "https://coin.abchina.com.cn/static/mbank/index.html#/",
    pc: "https://eapply.abchina.com/coin/"
  }
};
// ====================================================================================

(function () {
    'use strict';

    // 全局配置：可能的元素选择器列表
    const ELEMENT_SELECTORS = {
        // 姓名可能的 ID/Class/Name
        name: [
            '#custNameInput',      // 工商银行
            '#custName',
            '#customerName',
            '#name',
            '#userName',
            '#USR_NM',             // 建设银行
            '#rarewords > div.layout-right > div > div > div > input',  // 中国银行移动端
            'input.el-input__inner[maxlength="20"]',  // 农业银行移动端
            '[name="custName"]',
            '[name="customerName"]',
            '[name="userName"]',
            '[name="name"]',
            '.cust-name-input',
            '.name-input',
            '.customer-name',
            '[id*="custName"]',
            '[id*="name"]',
            '[id*="USR_NM"]'
        ],
        // 身份证可能的 ID/Class/Name
        idCard: [
            '#certNoInput',        // 工商银行
            '#certificateNo',
            '#idCard',
            '#idCardNo',
            '#certNo',
            '#CRDT_NO',            // 建设银行
            '[name="certNo"]',
            '[name="certificateNo"]',
            '[name="idCard"]',
            '[name="idCardNo"]',
            '[name="IDCardNo"]',
            '[name="identNo"]',    // 农业银行移动端
            '.information-input:nth-child(3) input.el-input__inner',  // 农业银行移动端（证件号码）
            '.cert-no-input',
            '.id-card-input',
            '.certificate-input',
            '[id*="cert"]',
            '[id*="idCard"]',
            '[id*="IdCard"]',
            '[id*="CRDT_NO"]'
        ],
        // 手机号可能的 ID/Class/Name
        mobile: [
            '#telInput',           // 工商银行
            '#mobile',
            '#phone',
            '#phoneNumber',
            '#mobileNo',
            '#tel',
            '#MBLPH_NO',           // 建设银行
            '#txt_mobile_1956715', // 中国银行PC端
            '.information-input:nth-child(4) input.el-input__inner',  // 农业银行移动端（手机号码）
            '[name="mobile"]',
            '[name="phone"]',
            '[name="phoneNumber"]',
            '[name="tel"]',
            '.mobile-input',
            '.phone-input',
            '.tel-input',
            '[id*="mobile"]',
            '[id*="phone"]',
            '[id*="tel"]',
            '[id*="MBLPH_NO"]'
        ],
        // 预约数量可能的 ID/Class/Name
        amount: [
            'input[type="number"].unm-textfield-core', // 工商银行（必须type="number"）
            '[class*="unm-textfield"][type="number"]', // 工商银行（type="number"）
            '#BOOKING_NUM',      // 建设银行
            '#amount',
            '#count',
            '#quantity',
            '#num',
            '#bookAmount',
            '#reservationAmount',
            '[name="BOOKING_NUM"]',
            '[name="amount"]',
            '[name="count"]',
            '[name="quantity"]',
            '[name="num"]',
            '[name="bookAmount"]',
            '[name="reservationAmount"]',
            '[id*="BOOKING"]',
            '[id*="amount"]',
            '[id*="count"]',
            '[id*="quantity"]',
            '[id*="num"]'
        ]
    };


    // DOM 加载完成后立即执行（不等待图片等资源）
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM 已经加载完成，直接执行
        init();
    }

    function init() {
        console.log('=== 纪念币预约辅助工具启动 ===');
        console.log('当前网站:', window.location.hostname);
        console.log('当前URL:', window.location.href);

        const savedState = GM_getValue('containerState', {});
        const savedPosition = GM_getValue('containerPosition', {});

        // ==================== 样式配置常量 ====================
        const STYLES = {
            // 颜色常量
            COLORS: {
                PRIMARY: '#007bff',
                SUCCESS: '#28a745',
                WARNING: '#ffc107',
                DANGER: '#ff4d4f',
                INFO: '#1890ff',
                SECONDARY: '#6c757d',
                LIGHT: '#f5f5f5',
                WHITE: '#fff',
                GRAY: '#f9f9f9',
                BORDER: '#e0e0e0',
                ERROR_BG: '#ffccc7',
                WARNING_BG: '#fffbe6'
            },

            // 按钮样式
            BUTTON: {
                padding: '4px 8px',
                height: '28px',
                background: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '11px',
                flex: '1'
            },

            // 图标按钮样式
            ICON_BUTTON: {
                width: '32px',
                height: '28px',
                padding: '0',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            },

            // 输入框样式
            INPUT: {
                flex: '1',
                padding: '3px 6px',
                border: '1px solid #ddd',
                borderRadius: '3px',
                fontSize: '11px',
                minWidth: '0'
            },

            // 卡片样式
            CARD: {
                marginBottom: '6px',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                background: '#fff',
                overflow: 'hidden'
            },

            // 序号标签样式
            INDEX_LABEL: {
                fontSize: '14px',
                color: '#fff',
                fontWeight: 'bold',
                width: '28px',
                height: '28px',
                background: '#6c757d',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
            },

            // 时间常量
            TIMING: {
                FILL_DELAY: 0,
                BRANCH_FILL_DELAY: 600,
                AMOUNT_FILL_DELAY: 900,
                ANIMATION_DURATION: 300,
                MESSAGE_DURATION: 3000
            },

            // 尺寸常量
            SIZES: {
                CONTAINER_WIDTH: '280px',
                CONTAINER_MAX_HEIGHT: '60vh',
                BUTTON_MAX_WIDTH: '120px'
            }
        };

        // ==================== UI工具函数 ====================
        const UIUtils = {
            // 应用样式到元素
            applyStyles(element, styles) {
                Object.assign(element.style, styles);
                return element;
            },

            // 创建带样式的元素
            createStyledElement(tag, styles = {}, content = '') {
                const element = document.createElement(tag);
                this.applyStyles(element, styles);
                if (content) element.textContent = content;
                return element;
            },

            // 创建带样式的按钮
            createButton(text, options = {}) {
                const defaults = {
                    padding: '4px 8px',
                    background: STYLES.COLORS.PRIMARY,
                    color: STYLES.COLORS.WHITE,
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '11px'
                };

                const button = document.createElement('button');
                button.innerText = text;
                this.applyStyles(button, { ...defaults, ...options });
                return button;
            },

            // 创建图标按钮
            createIconButton(icon, options = {}) {
                const defaults = {
                    width: '32px',
                    height: '28px',
                    padding: '0',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: '1'
                };

                const button = document.createElement('button');
                button.innerText = icon;
                this.applyStyles(button, { ...defaults, ...options });
                return button;
            }
        };

        // ==================== 验证工具函数 ====================
        const ValidationUtils = {
            // 字段验证配置
            getFieldValidator(field) {
                const validators = {
                    name: (value) => !!value,
                    idCard: (value) => !value || validateIDCard(value),
                    mobile: (value) => !value || validateMobile(value),
                    branch: () => true,
                    amount: () => true
                };
                return validators[field] || (() => true);
            },

            // 获取字段错误提示
            getFieldErrorMessage(field) {
                const messages = {
                    name: '姓名',
                    idCard: '身份证',
                    mobile: '手机号'
                };
                return messages[field];
            },

            // 获取字段背景色
            getFieldBackground(field, value) {
                const validator = this.getFieldValidator(field);
                if (field === 'name') {
                    return !value ? STYLES.COLORS.ERROR_BG : STYLES.COLORS.WHITE;
                } else if (field === 'idCard') {
                    return (!value || (value && !validateIDCard(value))) ? STYLES.COLORS.ERROR_BG : STYLES.COLORS.WHITE;
                } else if (field === 'mobile') {
                    return (!value || (value && !validateMobile(value))) ? STYLES.COLORS.ERROR_BG : STYLES.COLORS.WHITE;
                }
                return STYLES.COLORS.WHITE;
            }
        };

        // ==================== 基础验证函数 ====================
        function validateMobile(mobile) {
            return /^1[3-9]\d{9}$/.test(mobile);
        }

        function validateIDCard(idCard) {
            return /^\d{15}$|^\d{17}[0-9Xx]$/.test(idCard);
        }

        // ==================== 防抖工具函数 ====================
        function debounce(func, delay) {
            let timeoutId;
            return function(...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                }, delay);
            };
        }

        // ==================== 数据管理模块 ====================
        const DataManager = {
            // 保存数据
            save(data) {
                console.log('[保存数据] 保存数据，条数:', data.length);
                GM_setValue('formData', data);
            },

            // 加载数据
            load() {
                return GM_getValue('formData', []);
            },

            // 检查必填字段
            checkRequiredFields(entry) {
                if (!entry.name || !entry.idCard || !entry.mobile) {
                    const missing = [];
                    if (!entry.name) missing.push('姓名');
                    if (!entry.idCard) missing.push('身份证');
                    if (!entry.mobile) missing.push('手机号');
                    return {
                        valid: false,
                        message: `请完善${missing.join('、')}信息！`
                    };
                }

                if (entry.idCard && !validateIDCard(entry.idCard)) {
                    return { valid: false, message: '身份证格式不正确，请检查！' };
                }
                if (entry.mobile && !validateMobile(entry.mobile)) {
                    return { valid: false, message: '手机号格式不正确，请检查！' };
                }

                return { valid: true };
            },

            // 清洗数据
            clean(dataArray) {
                const cleaned = dataArray.filter(entry => {
                    const hasMainFields = entry.name || entry.idCard || entry.mobile;
                    if (!hasMainFields) {
                        console.log('[数据清洗] 过滤无效数据:', entry);
                    }
                    return hasMainFields;
                });

                let idCardErrors = 0;
                let mobileErrors = 0;

                cleaned.forEach(entry => {
                    if (entry.idCard && !validateIDCard(entry.idCard)) {
                        idCardErrors++;
                    }
                    if (entry.mobile && !validateMobile(entry.mobile)) {
                        mobileErrors++;
                    }
                });

                return {
                    data: cleaned,
                    stats: {
                        total: cleaned.length,
                        idCardErrors,
                        mobileErrors
                    }
                };
            },

            // 去重数据（接受Message作为参数）
            deduplicate(dataArray, messageCallback) {
                const seen = new Set();
                const deduplicated = [];
                let duplicateCount = 0;

                dataArray.forEach(entry => {
                    if (entry.name && entry.idCard && entry.mobile) {
                        const key = `${entry.name}-${entry.idCard}-${entry.mobile}`;
                        if (!seen.has(key)) {
                            seen.add(key);
                            deduplicated.push(entry);
                        } else {
                            duplicateCount++;
                            console.log('[数据去重] 发现重复数据:', entry.name, entry.idCard, entry.mobile);
                        }
                    } else {
                        deduplicated.push(entry);
                    }
                });

                if (duplicateCount > 0 && messageCallback) {
                    console.log(`[数据去重] 已过滤 ${duplicateCount} 条重复数据`);
                    messageCallback(`发现 ${duplicateCount} 条重复数据，已自动去除`);
                }

                return deduplicated;
            }
        };

        // ==================== 表单卡片模块 ====================
        const FormCard = {
            // 创建卡片容器
            createCard() {
                const card = document.createElement('div');
                UIUtils.applyStyles(card, STYLES.CARD);
                return card;
            },

            // 创建序号标签
            createIndexLabel(entry, index) {
                const indexLabel = document.createElement('span');
                indexLabel.className = 'card-index-label';
                indexLabel.innerText = entry.index !== undefined ? entry.index + 1 : index + 1;
                UIUtils.applyStyles(indexLabel, STYLES.INDEX_LABEL);
                return indexLabel;
            },

            // 创建姓名按钮（接受回调参数）
            createNameButton(entry, onValidate, fillFormCallback, messageCallback) {
                const nameCopyButton = document.createElement('button');
                const displayName = entry.name || '姓名';
                nameCopyButton.innerText = displayName;
                nameCopyButton.style.cssText = `
                    padding: 4px 10px;
                    height: 28px;
                    min-width: 120px;
                    max-width: 120px;
                    line-height: 20px;
                    background: #007bff;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: bold;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                `;

                // 更新按钮状态
                function updateButton() {
                    if (entry.name) {
                        nameCopyButton.style.display = 'inline-block';
                        nameCopyButton.innerText = entry.name;
                        nameCopyButton.style.background = STYLES.COLORS.PRIMARY;
                        nameCopyButton.style.cursor = 'pointer';
                    } else {
                        nameCopyButton.style.display = 'none';
                    }
                }

                // 点击事件
                nameCopyButton.addEventListener('click', () => {
                    if (entry.name) {
                        const validation = onValidate(entry);
                        if (validation.valid) {
                            console.log('[姓名按钮点击] entry:', entry);
                            fillFormCallback(entry);
                        } else {
                            messageCallback.error(validation.message);
                        }
                    }
                });

                // 初始化
                updateButton();

                return { button: nameCopyButton, updateButton };
            },

            // 创建折叠按钮
            createToggleButton(onToggle) {
                const toggleButton = UIUtils.createIconButton('▼', {
                    width: '32px',
                    height: '28px',
                    background: STYLES.COLORS.SUCCESS,
                    color: STYLES.COLORS.WHITE
                });
                // 设置 tabindex="-1"，使 Tab 键不会跳到折叠按钮
                toggleButton.setAttribute('tabindex', '-1');

                toggleButton.addEventListener('click', () => {
                    const isCollapsed = toggleButton.innerText === '▼';
                    toggleButton.innerText = isCollapsed ? '▲' : '▼';
                    onToggle(isCollapsed);
                });

                return toggleButton;
            },

            // 创建删除按钮（接受回调函数参数）
            createDeleteButton(entry, card, onDelete) {
                const deleteButton = UIUtils.createIconButton('×', {
                    background: STYLES.COLORS.DANGER,
                    fontSize: '20px'
                });
                // 设置 tabindex="-1"，使 Tab 键不会跳到删除按钮
                deleteButton.setAttribute('tabindex', '-1');

                deleteButton.addEventListener('mouseenter', () => {
                    deleteButton.style.background = '#ff7875';
                });

                deleteButton.addEventListener('mouseleave', () => {
                    deleteButton.style.background = STYLES.COLORS.DANGER;
                });

                deleteButton.addEventListener('click', () => {
                    console.log('[删除按钮点击] 删除索引:', entry.index);
                    onDelete(entry.index, card);
                });

                return deleteButton;
            },

            // 创建内容区域
            createContentArea(collapsed = true) {
                const contentArea = document.createElement('div');
                contentArea.style.cssText = `
                    padding: 6px 6px 6px 36px;
                    display: ${collapsed ? 'none' : 'block'};
                `;
                return contentArea;
            },

            // 创建字段行（接受回调参数）
            createFieldRow(field, label, value, entry, onUpdate, messageCallback, saveDataCallback) {
                const row = document.createElement('div');
                row.style.cssText = `
                    display: flex;
                    align-items: center;
                    margin-bottom: 4px;
                    gap: 4px;
                `;

                // 标签
                const labelEl = document.createElement('label');
                labelEl.innerText = label;
                labelEl.style.cssText = `
                    min-width: 40px;
                    font-size: 11px;
                    color: #666;
                    flex-shrink: 0;
                `;

                // 输入框
                const input = document.createElement('input');
                input.type = 'text';
                input.value = value;
                UIUtils.applyStyles(input, STYLES.INPUT);

                // 更新背景色
                function updateBackground() {
                    input.style.background = ValidationUtils.getFieldBackground(field, input.value);
                }

                // 验证字段值（不清空输入）
                function validateField() {
                    let isValid = true;
                    let errorMsg = '';

                    if (field === 'mobile' && input.value && !validateMobile(input.value)) {
                        isValid = false;
                        errorMsg = '手机号格式不正确！';
                    }
                    if (field === 'idCard' && input.value && !validateIDCard(input.value)) {
                        isValid = false;
                        errorMsg = '身份证号格式不正确！';
                    }

                    return { isValid, errorMsg };
                }

                // 保存数据（防抖）
                const debouncedSave = debounce(() => {
                    const validation = validateField();
                    if (validation.isValid) {
                        entry[field] = input.value;
                        saveDataCallback();
                    }
                }, 500);

                // 初始化背景色
                updateBackground();

                // 失焦事件 - 只验证和提示，不清空输入
                input.addEventListener('blur', () => {
                    const validation = validateField();
                    if (validation.isValid && input.value) {
                        entry[field] = input.value;
                        messageCallback.success('数据已保存！');
                        saveDataCallback();
                    } else if (!validation.isValid) {
                        messageCallback.error(validation.errorMsg);
                    }
                    onUpdate(field, entry);
                });

                // 输入事件 - 实时更新，使用防抖保存
                input.addEventListener('input', () => {
                    entry[field] = input.value;
                    updateBackground();
                    onUpdate(field, entry);
                    debouncedSave();
                });

                // 复制按钮
                const copyButton = UIUtils.createButton('复制', {
                    padding: '2px 6px',
                    flexShrink: '0'
                });
                copyButton.className = 'copy-btn';
                // 设置 tabindex="-1"，使 Tab 键不会跳到复制按钮
                copyButton.setAttribute('tabindex', '-1');

                copyButton.addEventListener('click', () => {
                    const inputValue = input.value;
                    console.log('[复制按钮点击] 字段:', field, '值:', inputValue);
                    if (inputValue) {
                        navigator.clipboard.writeText(inputValue)
                            .then(() => {
                                const name = entry.name || '姓名';
                                let message = `${name} 已复制`;
                                if (field === 'idCard') {
                                    message = `${name} 身份证已复制`;
                                } else if (field === 'mobile') {
                                    message = `${name} 手机号已复制`;
                                }
                                messageCallback.success(message);
                                console.log('[复制按钮点击] 复制成功:', message);
                            })
                            .catch((err) => {
                                console.error('[复制按钮点击] 复制失败:', err);
                                messageCallback.error('复制失败！');
                            });
                    }
                });

                row.appendChild(labelEl);
                row.appendChild(input);
                row.appendChild(copyButton);

                return { row, input };
            },

            // 创建完整的卡片（接受所有回调参数）
            create(entry, index, cardContainer, data, updateAllIndexesCallback, saveDataCallback, fillFormCallback, messageCallback) {
                const card = this.createCard();
                let collapsed = true;

                // 创建头部
                const headerRow = document.createElement('div');
                headerRow.style.cssText = `
                    display: flex;
                    align-items: center;
                    padding: 6px 8px;
                    gap: 6px;
                    background: #f9f9f9;
                    border-bottom: ${collapsed ? 'none' : '1px solid #e0e0e0'};
                `;

                // 存储索引
                if (entry.index === undefined) {
                    entry.index = index;
                }

                // 添加序号
                headerRow.appendChild(this.createIndexLabel(entry, index));

                // 添加姓名按钮（传入回调参数）
                const nameButton = this.createNameButton(entry, DataManager.checkRequiredFields, fillFormCallback, messageCallback);
                headerRow.appendChild(nameButton.button);
                card.nameButtonUpdate = nameButton.updateButton;

                // 添加折叠按钮
                const toggleButton = this.createToggleButton((isCollapsed) => {
                    collapsed = !isCollapsed;
                    headerRow.style.borderBottom = collapsed ? 'none' : '1px solid #e0e0e0';
                    contentArea.style.display = collapsed ? 'none' : 'block';
                });
                headerRow.appendChild(toggleButton);

                // 添加删除按钮（传入回调函数）
                headerRow.appendChild(this.createDeleteButton(entry, card, (idx, card) => {
                    data.splice(idx, 1);
                    card.remove();
                    updateAllIndexesCallback();
                    messageCallback.success('表单已删除！');
                    saveDataCallback();
                }));

                // 错误标签
                const errorLabel = document.createElement('span');
                errorLabel.className = 'card-error-label';
                errorLabel.style.display = 'none';
                headerRow.appendChild(errorLabel);

                card.appendChild(headerRow);

                // 更新错误提示
                function updateErrorLabel() {
                    const hasEmptyRequired = !entry.name || !entry.idCard || !entry.mobile;
                    const hasFormatError = (entry.idCard && !validateIDCard(entry.idCard)) ||
                                          (entry.mobile && !validateMobile(entry.mobile));

                    if (hasEmptyRequired || hasFormatError) {
                        headerRow.style.background = STYLES.COLORS.ERROR_BG;
                    } else {
                        headerRow.style.background = STYLES.COLORS.GRAY;
                    }
                }

                // 初始化时检查
                updateErrorLabel();

                // 创建内容区域
                const contentArea = this.createContentArea(collapsed);
                card.appendChild(contentArea);

                // 创建字段行 - 只显示姓名、身份证、手机号（网点和数量保留数据但不显示）
                const fields = ['name', 'idCard', 'mobile'];
                const labels = ['姓名', '身份证', '手机号'];

                fields.forEach((field, idx) => {
                    const { row } = this.createFieldRow(field, labels[idx], entry[field], entry, (field, entry) => {
                        if (field === 'name') {
                            nameButton.updateButton();
                        }
                        updateErrorLabel();
                    }, messageCallback, saveDataCallback);
                    contentArea.appendChild(row);
                });

                cardContainer.appendChild(card);

                return card;
            }
        };

        // 创建表单容器
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.width = '280px';
        container.style.maxHeight = '60vh';
        container.style.padding = '0';
        container.style.background = 'rgba(249, 249, 249, .9)';
        container.style.border = '1px solid #ddd';
        container.style.borderRadius = '6px';
        container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        container.style.zIndex = '9999';
        container.id = 'mainContainer';
        container.style.fontSize = '12px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';

        // 创建卡片容器（可滚动）
        const cardContainer = document.createElement('div');
        cardContainer.id = 'formContainer';
        cardContainer.style.flex = '1';
        cardContainer.style.overflowY = 'auto';
        cardContainer.style.padding = '0';

        // 自定义滚动条样式
        const style = document.createElement('style');
        style.textContent = `
            #formContainer::-webkit-scrollbar {
                width: 8px;
            }
            #formContainer::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
            }
            #formContainer::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 4px;
            }
            #formContainer::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        `;
        document.head.appendChild(style);

        function ensureInViewport(element) {
            const rect = element.getBoundingClientRect();
            const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

            let needsAdjustment = false;
            let newTop = rect.top;
            let newLeft = rect.left;

            if (rect.top < 0) {
                newTop = 10;
                needsAdjustment = true;
            }

            if (rect.bottom > viewportHeight) {
                newTop = viewportHeight - rect.height - 10;
                needsAdjustment = true;
            }

            if (rect.left < 0) {
                newLeft = 10;
                needsAdjustment = true;
            }

            if (rect.right > viewportWidth) {
                newLeft = viewportWidth - rect.width - 10;
                needsAdjustment = true;
            }

            if (needsAdjustment) {
                element.style.top = newTop + 'px';
                element.style.left = newLeft + 'px';
                element.style.right = 'auto';
                element.style.transform = 'none';
            }

            return needsAdjustment;
        }

        if (savedPosition.top !== undefined) {
            container.style.top = savedPosition.top;
            container.style.right = 'auto';
            container.style.left = savedPosition.left || 'auto';
            container.style.transform = 'none';

            document.body.appendChild(container);
            ensureInViewport(container);
        } else {
            container.style.top = '50%';
            container.style.right = '0';
            container.style.transform = 'translateY(-50%)';
        }

        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        let draggedElement = null;

        container.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        container.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', dragEnd);

        function dragStart(e) {
            // 允许从展开按钮拖拽
            const expandButton = e.target.closest('#expandButton');
            if (expandButton) {
                draggedElement = expandButton;
            } else {
                // 检查是否点击在交互元素上（如输入框、复制按钮等），如果是则不触发拖拽
                const interactiveElements = e.target.closest('input, .copy-btn, [role="button"]:not(#expandButton)');
                if (interactiveElements) return;

                // 允许从容器的其他区域拖拽（例如面板头部）
                if (!container.contains(e.target)) return;
                
                draggedElement = container;
            }
            const rect = draggedElement.getBoundingClientRect();
            const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;

            draggedElement.dataset.startX = clientX;
            draggedElement.dataset.startY = clientY;
            draggedElement.dataset.wasDragging = 'false';

            draggedElement.style.transition = 'none';

            const style = window.getComputedStyle(draggedElement);
            const matrix = new WebKitCSSMatrix(style.transform);
            xOffset = matrix.m41;
            yOffset = matrix.m42;

            if (e.type === 'touchstart') {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            } else {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            }

            isDragging = true;
            draggedElement.style.cursor = 'move';
        }

        function drag(e) {
            if (isDragging && draggedElement) {
                e.preventDefault();

                let clientX, clientY;

                if (e.type === 'touchmove') {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }

                currentX = clientX - initialX;
                currentY = clientY - initialY;

                const rect = draggedElement.getBoundingClientRect();
                const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
                const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

                let newX = currentX;
                let newY = currentY;

                const computedStyle = window.getComputedStyle(draggedElement);
                const originalTop = parseInt(computedStyle.top) || rect.top;
                const originalLeft = parseInt(computedStyle.left) || rect.left;

                let actualTop = originalTop + newY;
                let actualLeft = originalLeft + newX;

                if (actualTop < 0) {
                    newY = -originalTop;
                }
                if (actualTop + rect.height > viewportHeight) {
                    newY = viewportHeight - rect.height - originalTop;
                }
                if (actualLeft < 0) {
                    newX = -originalLeft;
                }
                if (actualLeft + rect.width > viewportWidth) {
                    newX = viewportWidth - rect.width - originalLeft;
                }

                xOffset = newX;
                yOffset = newY;

                setTranslate(newX, newY, draggedElement);

                if (Math.abs(newX) > 5 || Math.abs(newY) > 5) {
                    draggedElement.dataset.wasDragging = 'true';
                }
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }

        function dragEnd(e) {
            if (isDragging && draggedElement) {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
                draggedElement.style.cursor = 'default';

                const endX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
                const endY = e.type === 'touchend' ? e.changedTouches[0].clientY : e.clientY;
                const startX = parseFloat(draggedElement.dataset.startX) || endX;
                const startY = parseFloat(draggedElement.dataset.startY) || endY;
                const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));

                if (distance > 5) {
                    draggedElement.dataset.wasDragging = 'true';
                }

                const rect = draggedElement.getBoundingClientRect();
                draggedElement.style.top = rect.top + 'px';
                draggedElement.style.left = rect.left + 'px';
                draggedElement.style.right = 'auto';
                draggedElement.style.transform = 'none';

                let needSnap = false;
                let buttonElement = null;
                if (draggedElement.id === 'expandButton') {
                    const viewportWidth = window.innerWidth;
                    const buttonCenter = rect.left + rect.width / 2;
                    const buttonWidth = rect.width;

                    const middleThreshold = 100;
                    const distanceToLeft = buttonCenter;
                    const distanceToRight = viewportWidth - buttonCenter;

                    if (distanceToLeft > middleThreshold && distanceToRight > middleThreshold) {
                        needSnap = true;
                        const snapToLeft = distanceToLeft < distanceToRight;

                        buttonElement = draggedElement;

                        buttonElement.style.transition = 'left 0.3s ease-out';

                        setTimeout(() => {
                            if (buttonElement) {
                                if (snapToLeft) {
                                    buttonElement.style.left = '10px';
                                } else {
                                    buttonElement.style.left = (viewportWidth - buttonWidth - 10) + 'px';
                                }

                                setTimeout(() => {
                                    if (buttonElement) {
                                        buttonElement.style.transition = '';
                                    }
                                }, 300);
                            }
                        }, 10);
                    }
                }

                const adjusted = ensureInViewport(draggedElement);

                if (needSnap && buttonElement) {
                    setTimeout(() => {
                        if (buttonElement) {
                            const finalRectAfterSnap = buttonElement.getBoundingClientRect();
                            GM_setValue('containerPosition', {
                                top: finalRectAfterSnap.top + 'px',
                                left: finalRectAfterSnap.left + 'px'
                            });
                        }
                    }, 310);
                } else {
                    const finalRect = draggedElement.getBoundingClientRect();
                    GM_setValue('containerPosition', {
                        top: finalRect.top + 'px',
                        left: finalRect.left + 'px'
                    });
                }

                draggedElement = null;
            }
        }

        window.addEventListener('resize', () => {
            ensureInViewport(container);

            if (expandButton.style.display !== 'none') {
                ensureInViewport(expandButton);
            }
        });

        // 统一的 Message 提示组件
        const Message = {
            container: null,
            init() {
                if (!this.container) {
                    this.container = document.createElement('div');
                    this.container.id = 'message-container';
                    this.container.style.position = 'fixed';
                    this.container.style.top = '20px';
                    this.container.style.left = '50%';
                    this.container.style.transform = 'translateX(-50%)';
                    this.container.style.zIndex = '10000';
                    this.container.style.display = 'flex';
                    this.container.style.flexDirection = 'column';
                    this.container.style.gap = '10px';
                    this.container.style.pointerEvents = 'none';
                    document.body.appendChild(this.container);
                }
            },
            show(message, type = 'success', duration = 3000) {
                this.init();

                const msg = document.createElement('div');
                msg.className = `message-${type}`;
                msg.style.pointerEvents = 'auto';
                msg.style.minWidth = '300px';
                msg.style.maxWidth = '500px';
                msg.style.padding = '12px 16px';
                msg.style.borderRadius = '6px';
                msg.style.boxShadow = '0 3px 12px rgba(0, 0, 0, 0.15)';
                msg.style.fontSize = '14px';
                msg.style.display = 'flex';
                msg.style.alignItems = 'center';
                msg.style.gap = '8px';
                msg.style.opacity = '0';
                msg.style.transform = 'translateY(-20px)';
                msg.style.transition = 'all 0.3s ease';

                const iconColor = {
                    success: '#52c41a',
                    error: '#ff4d4f',
                    warning: '#faad14',
                    info: '#1890ff'
                };

                const bgColor = {
                    success: '#f6ffed',
                    error: '#fff2f0',
                    warning: '#fffbe6',
                    info: '#e6f7ff'
                };

                const borderColor = {
                    success: '#b7eb8f',
                    error: '#ffccc7',
                    warning: '#ffe58f',
                    info: '#91d5ff'
                };

                const icons = {
                    success: '✓',
                    error: '✕',
                    warning: '!',
                    info: 'i'
                };

                msg.style.background = bgColor[type] || bgColor.info;
                msg.style.border = `1px solid ${borderColor[type] || borderColor.info}`;

                const icon = document.createElement('span');
                icon.innerText = icons[type] || icons.info;
                icon.style.display = 'inline-flex';
                icon.style.alignItems = 'center';
                icon.style.justifyContent = 'center';
                icon.style.width = '20px';
                icon.style.height = '20px';
                icon.style.borderRadius = '50%';
                icon.style.background = iconColor[type] || iconColor.info;
                icon.style.color = '#fff';
                icon.style.fontSize = '12px';
                icon.style.fontWeight = 'bold';
                icon.style.flexShrink = '0';

                const text = document.createElement('span');
                text.innerText = message;
                text.style.color = '#000';
                text.style.wordBreak = 'break-word';

                msg.appendChild(icon);
                msg.appendChild(text);
                this.container.appendChild(msg);

                // 触发动画
                requestAnimationFrame(() => {
                    msg.style.opacity = '1';
                    msg.style.transform = 'translateY(0)';
                });

                // 自动关闭
                const timer = setTimeout(() => {
                    this.close(msg);
                }, duration);

                // 鼠标悬停暂停关闭
                msg.addEventListener('mouseenter', () => {
                    clearTimeout(timer);
                });

                msg.addEventListener('mouseleave', () => {
                    setTimeout(() => {
                        this.close(msg);
                    }, duration);
                });

                console.log(`[Message ${type.toUpperCase()}]`, message);
                return msg;
            },
            close(msg) {
                if (!msg || !msg.parentNode) return;
                msg.style.opacity = '0';
                msg.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    if (msg.parentNode) {
                        msg.parentNode.removeChild(msg);
                    }
                }, 300);
            },
            success(message, duration) {
                return this.show(message, 'success', duration);
            },
            error(message, duration) {
                return this.show(message, 'error', duration);
            },
            warning(message, duration) {
                return this.show(message, 'warning', duration);
            },
            info(message, duration) {
                return this.show(message, 'info', duration);
            }
        };


        // 存储表单数据
        const data = [];

        // 填充表单功能
        function fillForm(entry) {
            console.log('=== 开始填充 ===');
            console.log('填充内容:', entry);
            console.log('姓名:', entry.name);
            console.log('身份证:', entry.idCard);
            console.log('手机号:', entry.mobile);
            console.log('网点:', entry.branch);
            console.log('数量:', entry.amount);
            console.log('================');

            if (!entry.name && !entry.idCard && !entry.mobile && !entry.branch && !entry.amount) {
                Message.error('请至少填写一项信息！');
                return;
            }

            if (entry.name) {
                console.log('[填充] 查找姓名元素');
                let nameElement = findElement(ELEMENT_SELECTORS.name);
                if (!nameElement) {
                    console.log('[填充] 预设选择器未找到，使用智能查找');
                    nameElement = findElementSmart('name');
                }
                if (nameElement) {
                    fillElement(nameElement, entry.name, '姓名');
                } else {
                    console.log('[填充] 姓名元素未找到');
                }
            }

            if (entry.idCard) {
                console.log('[填充] 查找身份证元素');
                let idCardElement = findElement(ELEMENT_SELECTORS.idCard);
                if (!idCardElement) {
                    console.log('[填充] 预设选择器未找到，使用智能查找');
                    idCardElement = findElementSmart('idCard');
                }
                if (idCardElement) {
                    fillElement(idCardElement, entry.idCard, '身份证号');
                } else {
                    console.log('[填充] 身份证元素未找到');
                }
            }

            if (entry.mobile) {
                console.log('[填充] 查找手机号元素');
                let mobileElement = findElement(ELEMENT_SELECTORS.mobile);
                if (!mobileElement) {
                    console.log('[填充] 预设选择器未找到，使用智能查找');
                    mobileElement = findElementSmart('mobile');
                }
                if (mobileElement) {
                    setTimeout(() => {
                        fillElement(mobileElement, entry.mobile, '手机号');
                    }, 300);
                } else {
                    console.log('[填充] 手机号元素未找到');
                }
            }

            if (entry.branch) {
                setTimeout(() => {
                    console.log('[填充] 查找网点元素');
                    let branchElement = findElementSmart('branch');
                    if (branchElement) {
                        fillElement(branchElement, entry.branch, '网点');
                    } else {
                        console.log('[填充] 网点元素未找到');
                    }
                }, 600);
            }

            if (entry.amount) {
                setTimeout(() => {
                    console.log('[填充] 查找数量元素');
                    let amountElement = findElement(ELEMENT_SELECTORS.amount);
                    if (!amountElement) {
                        console.log('[填充] 预设选择器未找到，使用智能查找');
                        amountElement = findElementSmart('amount');
                    }
                    if (amountElement) {
                        fillElement(amountElement, entry.amount, '预约数量');
                    } else {
                        console.log('[填充] 数量元素未找到');
                    }
                }, 900);
            }

            Message.success('填充完成！');
        }

        function findElement(selectorList) {
            for (const selector of selectorList) {
                let element = document.querySelector(selector);
                if (element) {
                    console.log('[findElement] 找到元素:', selector, element);
                    return element;
                }
            }
            console.log('[findElement] 未找到匹配元素');
            return null;
        }

        // 智能查找元素（支持 id、name、placeholder、label 多种方式）
        function findElementSmart(type) {
            console.log('[findElementSmart] 智能查找:', type);

            const inputType = type === 'mobile' ? 'input[type="tel"], input[type="text"], input[type="number"]' :
                type === 'idCard' ? 'input' :
                    type === 'name' ? 'input[type="text"]' :
                        type === 'amount' ? 'input[type="number"]' :
                            'input[type="text"], select';

            const elements = document.querySelectorAll(inputType);
            console.log('[findElementSmart] 候选元素数量:', elements.length);

            for (const element of elements) {
                const inputId = (element.id || '').toLowerCase();
                const inputName = (element.name || '').toLowerCase();
                const inputPlaceholder = (element.placeholder || '').toLowerCase();
                const inputLabel = element.labels && element.labels[0] ? (element.labels[0].textContent || '').toLowerCase() : '';
                const inputClass = (element.className || '').toLowerCase();

                if (type === 'name') {
                    if (
                        inputId.includes('name') || inputName.includes('name') ||
                        inputId.includes('oppacnme') || inputName.includes('oppacnme') ||
                        inputId.includes('usr_nm') || inputName.includes('usr_nm') ||
                        inputId.includes('username') || inputName.includes('username') ||
                        inputId.includes('fullname') || inputName.includes('fullname') ||
                        inputId.includes('realname') || inputName.includes('realname') ||
                        inputPlaceholder.includes('姓名') || inputPlaceholder.includes('name') ||
                        inputPlaceholder.includes('真实姓名') ||
                        inputLabel.includes('姓名') || inputLabel.includes('客户') ||
                        inputLabel.includes('真实姓名') ||
                        (inputId.includes('客户') && inputId.includes('姓名')) ||
                        (inputName.includes('客户') && inputName.includes('姓名'))
                    ) {
                        console.log('[findElementSmart] 找到姓名元素:', element, { inputId, inputName, inputPlaceholder, inputLabel });
                        return element;
                    }
                }

                if (type === 'idCard') {
                    if (
                        inputId.includes('id') || inputName.includes('id') ||
                        inputId.includes('crednumtemp') || inputName.includes('crednumtemp') ||
                        inputId.includes('crdt_no') || inputName.includes('crdt_no') ||
                        inputId.includes('idcard') || inputName.includes('idcard') ||
                        inputId.includes('idnumber') || inputName.includes('idnumber') ||
                        inputId.includes('certno') || inputName.includes('certno') ||
                        inputId.includes('certificateno') || inputName.includes('certificateno') ||
                        inputId.includes('证件') || inputName.includes('证件') ||
                        inputPlaceholder.includes('身份证') || inputPlaceholder.includes('证件') ||
                        inputPlaceholder.includes('证件号') || inputPlaceholder.includes('证件号码') ||
                        inputLabel.includes('身份证') || inputLabel.includes('证件') ||
                        inputLabel.includes('证件号') || inputLabel.includes('证件号码') ||
                        inputClass.includes('cert') || inputClass.includes('idcard')
                    ) {
                        if (inputId.includes('bankid') || inputName.includes('bankid') ||
                            inputId.includes('branchid') || inputName.includes('branchid')) {
                            continue;
                        }
                        console.log('[findElementSmart] 找到身份证元素:', element, { inputId, inputName, inputPlaceholder, inputLabel });
                        return element;
                    }
                }

                if (type === 'mobile') {
                    if (
                        inputId.includes('phone') || inputId.includes('mobile') || inputId.includes('tel') ||
                        inputName.includes('phone') || inputName.includes('mobile') || inputName.includes('tel') ||
                        inputId.includes('mblph_no') || inputName.includes('mblph_no') ||
                        inputId.includes('cellphone') || inputName.includes('cellphone') ||
                        inputId.includes('telephone') || inputName.includes('telephone') ||
                        inputPlaceholder.includes('手机') || inputPlaceholder.includes('电话') ||
                        inputPlaceholder.includes('联系方式') || inputPlaceholder.includes('联系电话') ||
                        inputPlaceholder.includes('手机号码') || inputPlaceholder.includes('手机号') ||
                        inputPlaceholder.includes('移动电话') ||
                        inputLabel.includes('手机') || inputLabel.includes('电话') ||
                        inputLabel.includes('联系方式') || inputLabel.includes('联系电话') ||
                        inputLabel.includes('手机号码') || inputLabel.includes('手机号') ||
                        (inputId.includes('客户') && (inputId.includes('手机') || inputId.includes('电话'))) ||
                        (inputName.includes('客户') && (inputName.includes('手机') || inputName.includes('电话'))) ||
                        (inputPlaceholder.includes('客户') && (inputPlaceholder.includes('手机') || inputPlaceholder.includes('电话'))) ||
                        (inputLabel.includes('客户') && (inputLabel.includes('手机') || inputLabel.includes('电话')))
                    ) {
                        console.log('[findElementSmart] 找到手机号元素:', element, { inputId, inputName, inputPlaceholder, inputLabel });
                        return element;
                    }
                }

                if (type === 'branch') {
                    if (
                        inputId.includes('branch') || inputName.includes('branch') ||
                        inputId.includes('bank') || inputName.includes('bank') ||
                        inputId.includes('outlet') || inputName.includes('outlet') ||
                        inputId.includes('org_code') || inputName.includes('org_code') ||
                        inputId.includes('org_name') || inputName.includes('org_name') ||
                        inputId.includes('org') || inputName.includes('org') ||
                        inputPlaceholder.includes('网点') || inputPlaceholder.includes('银行') ||
                        inputPlaceholder.includes('兑换') || inputPlaceholder.includes('领取') ||
                        inputLabel.includes('网点') || inputLabel.includes('银行') ||
                        inputLabel.includes('兑换') || inputLabel.includes('领取') ||
                        (inputId.includes('选择') && (inputId.includes('网点') || inputId.includes('银行'))) ||
                        (inputName.includes('选择') && (inputName.includes('网点') || inputName.includes('银行')))
                    ) {
                        console.log('[findElementSmart] 找到网点元素:', element, { inputId, inputName, inputPlaceholder, inputLabel });
                        return element;
                    }
                }

                if (type === 'amount') {
                    if (
                        inputId.includes('amount') || inputName.includes('amount') ||
                        inputId.includes('count') || inputName.includes('count') ||
                        inputId.includes('quantity') || inputName.includes('quantity') ||
                        inputId.includes('num') || inputName.includes('num') ||
                        inputId.includes('booking_num') || inputName.includes('booking_num') ||
                        inputPlaceholder.includes('数量') ||
                        inputLabel.includes('数量') ||
                        inputPlaceholder.includes('预约') || inputLabel.includes('预约') ||
                        inputPlaceholder.includes('兑换') || inputLabel.includes('兑换') ||
                        inputPlaceholder.includes('预约数量') || inputLabel.includes('预约数量') ||
                        inputPlaceholder.includes('兑换数量') || inputLabel.includes('兑换数量') ||
                        inputPlaceholder.includes('枚') || inputLabel.includes('枚') ||
                        inputPlaceholder.includes('张') || inputLabel.includes('张') ||
                        (inputId.includes('预约') && (inputId.includes('数量') || inputId.includes('amount'))) ||
                        (inputName.includes('预约') && (inputName.includes('数量') || inputName.includes('amount'))) ||
                        (inputPlaceholder.includes('预约') && (inputPlaceholder.includes('数量') || inputPlaceholder.includes('amount'))) ||
                        (inputLabel.includes('预约') && (inputLabel.includes('数量') || inputLabel.includes('amount')))
                    ) {
                        console.log('[findElementSmart] 找到数量元素:', element, { inputId, inputName, inputPlaceholder, inputLabel });
                        return element;
                    }
                }
            }

            console.log('[findElementSmart] 未找到匹配元素:', type);
            return null;
        }

        // 统一的填充函数（支持多种元素类型）
        function fillElement(element, value, fieldName) {
            console.log('[fillElement] 填充字段:', fieldName, '值:', value);
            try {
                const tagName = element.tagName.toLowerCase();
                console.log('[fillElement] 元素类型:', tagName, '元素:', element);

                if (tagName === 'input' || tagName === 'textarea') {
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                    const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;

                    if (tagName === 'input') {
                        nativeInputValueSetter.call(element, value);
                    } else {
                        nativeTextareaValueSetter.call(element, value);
                    }

                    const events = ['input', 'change', 'blur'];
                    events.forEach(eventType => {
                        const event = new Event(eventType, { bubbles: true, cancelable: true });
                        element.dispatchEvent(event);
                    });

                    Message.success(`${fieldName}已填充`);
                    return;
                }

                if (tagName === 'div' || element.hasAttribute('contenteditable')) {
                    element.innerText = value;
                    element.textContent = value;

                    if (element.hasAttribute('contenteditable')) {
                        const events = ['input', 'change', 'blur'];
                        events.forEach(eventType => {
                            const event = new Event(eventType, { bubbles: true });
                            element.dispatchEvent(event);
                        });
                    }

                    if (element.__vue__) {
                        const vueData = element.__vue__;
                        if (vueData.$el) {
                            vueData.$el.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    }

                    Message.success(`${fieldName}已填充`);
                    return;
                }

                if (tagName === 'select') {
                    let optionFound = false;
                    const options = element.querySelectorAll('option');
                    for (const option of options) {
                        const optionValue = (option.value || '').toLowerCase();
                        const optionText = (option.textContent || '').toLowerCase();
                        const valueLower = value.toLowerCase();

                        if (optionValue === valueLower || optionText === valueLower ||
                            optionValue.includes(valueLower) || optionText.includes(valueLower)) {
                            option.selected = true;
                            optionFound = true;
                            break;
                        }
                    }

                    if (optionFound) {
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                        Message.success(`${fieldName}已填充`);
                    } else {
                        element.value = value;
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                        Message.success(`${fieldName}已填充（请验证）`);
                    }
                    return;
                }

                element.setAttribute('value', value);
                Message.success(`${fieldName}已填充（请验证）`);

            } catch (error) {
                console.error('[fillElement] 填充错误:', error);
                Message.error(`${fieldName}填充失败，请手动输入`);
            }
        }

        // 创建单个表单（卡片样式）- 使用 FormCard 模块
        function createForm(entry, index) {
            FormCard.create(entry || { name: '', mobile: '', idCard: '', branch: '', amount: '', index: null }, index, cardContainer, data, updateAllIndexes, saveData, fillForm, Message);
        }

        function saveData() {
            DataManager.save(data);
        }

        // 更新所有卡片的序号
        function updateAllIndexes() {
            const indexLabels = document.querySelectorAll('.card-index-label');
            indexLabels.forEach((label, index) => {
                label.innerText = index + 1;  // 显示时 +1
            });

            // 更新数据中的 index 字段为当前数组索引
            data.forEach((entry, index) => {
                entry.index = index;  // 存储数组索引
            });
        }

        // 添加按钮组（放置按钮）
        function addButtons() {
            const buttonsContainer = document.createElement('div');
            buttonsContainer.id = 'buttonsContainer';
            buttonsContainer.style.padding = '6px';
            buttonsContainer.style.display = 'flex';
            buttonsContainer.style.gap = '4px';
            buttonsContainer.style.background = '#f5f5f5';
            buttonsContainer.style.borderTop = '1px solid #e0e0e0';
            buttonsContainer.style.flexShrink = '0';

            // 添加表单按钮
            const addButton = document.createElement('button');
            addButton.innerText = '+ 添加';
            addButton.style.padding = '4px 8px';
            addButton.style.background = '#28a745';
            addButton.style.color = '#fff';
            addButton.style.border = 'none';
            addButton.style.borderRadius = '3px';
            addButton.style.cursor = 'pointer';
            addButton.style.fontSize = '11px';
            addButton.style.flex = '1';

            addButton.addEventListener('click', () => {
                console.log('[添加按钮点击] 尝试添加新表单');

                // 如果已有数据，校验最后一条数据是否完整
                if (data.length > 0) {
                    const lastEntry = data[data.length - 1];
                    const validation = DataManager.checkRequiredFields(lastEntry);
                    if (!validation.valid) {
                        console.log('[添加按钮点击] 校验失败:', validation.message);
                        Message.error(validation.message);
                        return;
                    }
                }

                const newEntry = { name: '', mobile: '', idCard: '', branch: '', amount: '', index: data.length };
                data.push(newEntry);
                createForm(newEntry, data.length);
                updateAllIndexes();
                saveData();
                console.log('[添加按钮点击] 添加成功，当前数据总数:', data.length);
            });

            // 导出按钮
            const exportButton = document.createElement('button');
            exportButton.innerText = '导出';
            exportButton.style.padding = '4px 8px';
            exportButton.style.background = '#007bff';
            exportButton.style.color = '#fff';
            exportButton.style.border = 'none';
            exportButton.style.borderRadius = '3px';
            exportButton.style.cursor = 'pointer';
            exportButton.style.fontSize = '11px';
            exportButton.style.flex = '1';

            exportButton.addEventListener('click', () => {
                console.log('[导出按钮点击] 导出数据，总数:', data.length);
                // 只导出5个字段，排除 index 等内部字段
                const exportData = data.map(entry => ({
                    name: entry.name || '',
                    idCard: entry.idCard || '',
                    mobile: entry.mobile || '',
                    branch: entry.branch || '',
                    amount: entry.amount || ''
                }));
                const jsonData = JSON.stringify(exportData, null, 2);
                const blob = new Blob([jsonData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'form_data.json';
                a.click();
                console.log('[导出按钮点击] 导出完成');
            });

            // 导入按钮
            const importButton = document.createElement('button');
            importButton.innerText = '导入';
            importButton.style.padding = '4px 8px';
            importButton.style.background = '#ffc107';
            importButton.style.color = '#000';
            importButton.style.border = 'none';
            importButton.style.borderRadius = '3px';
            importButton.style.cursor = 'pointer';
            importButton.style.fontSize = '11px';
            importButton.style.flex = '1';

            importButton.addEventListener('click', () => {
                console.log('[导入按钮点击] 开始导入流程');
                if (confirm('导入会覆盖现有数据，确定导入吗？')) {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.json';
                    input.addEventListener('change', (event) => {
                        const file = event.target.files[0];
                        if (file) {
                            console.log('[导入按钮点击] 读取文件:', file.name);
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                try {
                                    let importedData = JSON.parse(e.target.result);

                                    // 数据类型校验：确保导入的是数组
                                    if (!Array.isArray(importedData)) {
                                        console.error('[导入校验] 导入的数据不是数组');
                                        Message.error('导入的文件格式不正确：数据必须是数组格式！');
                                        return;
                                    }

                                    console.log('[导入按钮点击] 解析数据成功，条数:', importedData.length);

                                    // 空数据检查
                                    if (importedData.length === 0) {
                                        Message.warning('导入的数据为空！');
                                        return;
                                    }

                                    // 使用 cleanData 函数过滤无效数据并统计
                                    const cleanResult = DataManager.clean(importedData);
                                    console.log('[数据清洗] 清洗后数据条数:', cleanResult.stats.total);

                                    // 使用 deduplicateData 函数去重
                                    const finalData = DataManager.deduplicate(cleanResult.data, Message.warning.bind(Message));

                                    // 显示格式错误统计
                                    if (cleanResult.stats.idCardErrors > 0 || cleanResult.stats.mobileErrors > 0) {
                                        console.log(`[数据统计] 身份证格式错误: ${cleanResult.stats.idCardErrors} 条, 手机号格式错误: ${cleanResult.stats.mobileErrors} 条`);
                                    }

                                    // 清空现有数据和界面
                                    data.length = 0;
                                    cardContainer.innerHTML = '';
                                    const buttonsContainer = document.getElementById('buttonsContainer');
                                    if (buttonsContainer) {
                                        buttonsContainer.remove();
                                    }
                                    addButtons();

                                    // 重新创建所有卡片
                                    finalData.forEach((entry, idx) => {
                                        data.push(entry);
                                        createForm(entry, idx);
                                    });
                                    updateAllIndexes();
                                    saveData();
                                    console.log('[导入按钮点击] 导入完成，当前数据总数:', data.length);
                                    Message.success(`已导入 ${data.length} 条数据！`);
                                } catch (error) {
                                    console.error('[导入按钮点击] 解析失败:', error);
                                    Message.error('导入的文件格式不正确！');
                                }
                            };
                            reader.readAsText(file);
                        }
                    });
                    input.click();
                }
            });

            // 收起按钮
            const collapseButton = document.createElement('button');
            collapseButton.innerText = '收起';
            collapseButton.style.padding = '4px 8px';
            collapseButton.style.background = '#6c757d';
            collapseButton.style.color = '#fff';
            collapseButton.style.border = 'none';
            collapseButton.style.borderRadius = '3px';
            collapseButton.style.cursor = 'pointer';
            collapseButton.style.fontSize = '11px';
            collapseButton.style.flex = '1';

            collapseButton.addEventListener('click', () => {
                // 先将容器的 transform 转换为绝对位置（如果容器刚被拖动过）
                if (container.style.transform && container.style.transform !== 'none') {
                    const rect = container.getBoundingClientRect();
                    container.style.top = rect.top + 'px';
                    container.style.left = rect.left + 'px';
                    container.style.right = 'auto';
                    container.style.transform = 'none';
                }

                // 获取容器当前位置和尺寸
                const containerRect = container.getBoundingClientRect();
                const viewportWidth = window.innerWidth;

                // 先显示按钮以获取其宽度
                expandButton.style.display = 'inline-block';
                expandButton.style.visibility = 'hidden';
                const buttonWidth = expandButton.offsetWidth;
                expandButton.style.visibility = 'visible';

                container.style.display = 'none';  // 收起表单容器
                expandButton.style.display = 'inline-block';  // 显示展开按钮

                // 判断容器在屏幕左侧还是右侧
                // 如果容器右边缘在屏幕右半部分，按钮在容器右边缘；否则在容器左边缘
                const isOnRightSide = containerRect.right > viewportWidth / 2;

                let buttonLeft;
                if (isOnRightSide) {
                    // 容器在右侧，按钮在容器右边缘
                    buttonLeft = containerRect.right - buttonWidth;
                } else {
                    // 容器在左侧，按钮在容器左边缘
                    buttonLeft = containerRect.left;
                }

                expandButton.style.top = containerRect.top + 'px';
                expandButton.style.left = buttonLeft + 'px';
                expandButton.style.right = 'auto';
                expandButton.style.transform = 'none';

                // 保存容器位置和按钮位置信息
                GM_setValue('containerState', { collapsed: true });
                GM_setValue('containerPosition', {
                    top: containerRect.top + 'px',
                    left: containerRect.left + 'px',  // 容器左边缘
                    buttonLeft: buttonLeft + 'px',      // 按钮位置
                    isOnRightSide: isOnRightSide
                });
            });

            buttonsContainer.appendChild(addButton);
            buttonsContainer.appendChild(exportButton);
            buttonsContainer.appendChild(importButton);
            buttonsContainer.appendChild(collapseButton);

            // 将按钮容器添加到主容器（在卡片容器之后）
            // const mainContainer = document.getElementById('mainContainer');
            // if (mainContainer) {
            //     mainContainer.appendChild(buttonsContainer);
            // }
            container.appendChild(buttonsContainer)
        }

        // 展开按钮
        const expandButton = document.createElement('button');
        expandButton.id = 'expandButton'; // 添加 id 用于拖动识别
        expandButton.innerText = '📋';
        expandButton.style.padding = '6px 10px';
        expandButton.style.background = '#28a745';
        expandButton.style.color = '#fff';
        expandButton.style.border = 'none';
        expandButton.style.borderRadius = '6px';
        expandButton.style.cursor = 'move'; // 改为 move，因为可以拖动
        expandButton.style.fontSize = '14px';
        expandButton.style.position = 'fixed';
        expandButton.style.zIndex = '9998';
        expandButton.style.transition = 'left 0.3s ease-out'; // 添加平滑过渡
        expandButton.title = '展开工具（可拖动）';

        // 根据保存的状态设置初始显示状态
        if (savedState.collapsed) {
            expandButton.style.display = 'inline-block';
            // 恢复展开按钮的位置
            if (savedPosition.top !== undefined) {
                expandButton.style.top = savedPosition.top;
                expandButton.style.right = 'auto';
                expandButton.style.left = savedPosition.left || 'auto';
                expandButton.style.transform = 'none';
            } else {
                expandButton.style.top = '50%';
                expandButton.style.right = '0';
                expandButton.style.transform = 'translateY(-50%)';
            }
        } else {
            expandButton.style.display = 'none';
        }

        expandButton.addEventListener('click', (e) => {
            // 如果刚刚在拖动，不触发点击
            if (expandButton.dataset.wasDragging === 'true') {
                expandButton.dataset.wasDragging = 'false';
                return;
            }

            // 获取按钮当前位置和容器宽度
            const btnRect = expandButton.getBoundingClientRect();
            const containerWidth = container.offsetWidth;
            const viewportWidth = window.innerWidth;

            container.style.display = 'block';  // 展开表单容器
            expandButton.style.display = 'none';  // 隐藏展开按钮

            // 使用按钮当前位置判断在容器哪一侧（而不是保存的值）
            // 这样即使按钮被拖动到中间，也能正确判断
            const btnCenter = btnRect.left + btnRect.width / 2;
            const isOnRightSide = btnCenter > viewportWidth / 2;

            let containerLeft;
            if (isOnRightSide) {
                // 按钮在容器右边缘
                containerLeft = btnRect.left - (containerWidth - btnRect.width);
            } else {
                // 按钮在容器左边缘
                containerLeft = btnRect.left;
            }

            // 设置容器位置
            container.style.top = btnRect.top + 'px';
            container.style.left = containerLeft + 'px';
            container.style.right = 'auto';
            container.style.transform = 'none';

            // 保存展开状态和容器位置
            GM_setValue('containerState', { collapsed: false });
            GM_setValue('containerPosition', {
                top: btnRect.top + 'px',
                left: containerLeft + 'px',
                buttonLeft: btnRect.left + 'px',
                isOnRightSide: isOnRightSide
            });

            // 展开后确保容器在视口内
            setTimeout(() => {
                const adjusted = ensureInViewport(container);
                if (adjusted) {
                    const finalRect = container.getBoundingClientRect();
                    GM_setValue('containerPosition', {
                        top: finalRect.top + 'px',
                        left: finalRect.left + 'px',
                        isOnRightSide: isOnRightSide
                    });
                }
            }, 10);
        });

        // 为展开按钮添加拖动事件监听
        expandButton.addEventListener('mousedown', dragStart);
        expandButton.addEventListener('touchstart', dragStart, { passive: false });

        // 添加展开按钮到 body
        document.body.appendChild(expandButton);

        // 如果展开按钮可见，确保它在视口内
        if (savedState.collapsed) {
            ensureInViewport(expandButton);
        }

        let savedData = GM_getValue('formData', []);
        console.log('[数据初始化] 保存的数据:', savedData);
        console.log('[数据初始化] 数据类型:', typeof savedData);

        if (!savedData || savedData.length === 0) {
            console.log('[数据初始化] 没有找到保存的数据或数据为空');
        } else {
            try {
                // 如果保存的数据是字符串，需要解析
                let parsedData = typeof savedData === 'string' ? JSON.parse(savedData) : savedData;

                // 数据类型校验
                if (!Array.isArray(parsedData)) {
                    console.error('[数据初始化] 保存的数据不是数组');
                    Message.error('保存的数据格式错误！');
                    parsedData = [];
                } else {
                    console.log('[数据初始化] 解析后的数据:', parsedData);
                    console.log('[数据初始化] 数据条数:', parsedData.length);

                    // 使用 cleanData 函数清洗数据
                    const cleanResult = DataManager.clean(parsedData);
                    console.log('[数据初始化] 清洗后数据条数:', cleanResult.stats.total);

                    // 使用 deduplicateData 函数去重
                    const finalData = DataManager.deduplicate(cleanResult.data, Message.warning.bind(Message));

                    // 显示格式错误统计
                    if (cleanResult.stats.idCardErrors > 0 || cleanResult.stats.mobileErrors > 0) {
                        console.log(`[数据初始化] 身份证格式错误: ${cleanResult.stats.idCardErrors} 条, 手机号格式错误: ${cleanResult.stats.mobileErrors} 条`);
                    }

                    // 重新计算索引并创建卡片
                    finalData.forEach((entry, idx) => {
                        entry.index = idx;
                        data.push(entry);
                        createForm(entry, idx);
                    });
                    updateAllIndexes();

                    // 如果数据有变化，保存更新后的数据
                    if (finalData.length !== parsedData.length) {
                        console.log('[数据初始化] 数据已清洗或去重，保存更新后的数据...');
                        GM_setValue('formData', finalData);
                        Message.info('数据已自动优化！');
                    }

                    Message.success('已加载保存的数据！');
                }
            } catch (error) {
                console.error('[数据初始化] 加载数据失败:', error);
                Message.error('加载保存的数据失败！');
            }
        }

        // 先将卡片容器添加到主容器
        container.appendChild(cardContainer);

        // 然后调用 addButtons，它会将按钮容器插入到卡片容器之前
        addButtons();

        // 确保 body 存在后再添加元素
        function addToBody() {
            if (!document.body) {
                console.warn('[初始化] body 尚未创建，延迟添加...');
                setTimeout(addToBody, 50);
                return;
            }

            // 添加主容器到页面
            document.body.appendChild(container);
            console.log('[初始化] 主容器已添加到页面');

            // 如果之前是折叠状态，显示展开按钮
            if (savedState.collapsed) {
                container.style.display = 'none';
                expandButton.style.display = 'inline-block';
                console.log('[初始化] 恢复折叠状态，显示展开按钮');
            }

            console.log('=== 纪念币预约辅助工具初始化完成 ===');
        }

        addToBody();
    }
})();
