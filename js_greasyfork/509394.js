// ==UserScript==
// @name         auto write card info
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @author       king, nudejs, bin, 南风知我意, duck duck
// @match        *://*/c/pay/*
// @match        https://buy.stripe.com/*
// @grant        GM_addStyle
// @license      MIT
// @description  信用卡自动填写和生成器
// @downloadURL https://update.greasyfork.org/scripts/509394/auto%20write%20card%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/509394/auto%20write%20card%20info.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('信用卡工具 v3.0.0 已启动');

    // ────────── 配置常量 ──────────
    const CONFIG = {
        toggleBtnText: '💳',
        storageKey: 'cardToolTheme',
        addressStorageKey: 'cardToolSavedAddresses',
        lastUsedAddressKey: 'cardToolLastAddress',
        defaultCountry: 'US'
    };

    // ────────── 真实美国地址数据库 ──────────
    // 确保城市、州、邮编匹配的真实数据
    const US_ADDRESS_DATABASE = [
        // California
        { state: 'CA', stateCode: 'CA', city: 'Los Angeles', zipRanges: ['90001', '90089', '90210', '90291', '90404'] },
        { state: 'CA', stateCode: 'CA', city: 'San Francisco', zipRanges: ['94102', '94103', '94107', '94109', '94110'] },
        { state: 'CA', stateCode: 'CA', city: 'San Diego', zipRanges: ['92101', '92102', '92103', '92104', '92109'] },
        { state: 'CA', stateCode: 'CA', city: 'San Jose', zipRanges: ['95110', '95112', '95113', '95125', '95126'] },
        { state: 'CA', stateCode: 'CA', city: 'Palo Alto', zipRanges: ['94301', '94303', '94304', '94306'] },
        // New York
        { state: 'NY', stateCode: 'NY', city: 'New York', zipRanges: ['10001', '10011', '10016', '10019', '10022', '10036'] },
        { state: 'NY', stateCode: 'NY', city: 'Brooklyn', zipRanges: ['11201', '11211', '11215', '11217', '11231'] },
        { state: 'NY', stateCode: 'NY', city: 'Buffalo', zipRanges: ['14201', '14202', '14203', '14204', '14210'] },
        // Texas
        { state: 'TX', stateCode: 'TX', city: 'Houston', zipRanges: ['77001', '77002', '77003', '77004', '77006'] },
        { state: 'TX', stateCode: 'TX', city: 'Dallas', zipRanges: ['75201', '75202', '75204', '75205', '75206'] },
        { state: 'TX', stateCode: 'TX', city: 'Austin', zipRanges: ['78701', '78702', '78703', '78704', '78705'] },
        { state: 'TX', stateCode: 'TX', city: 'San Antonio', zipRanges: ['78201', '78202', '78204', '78205', '78207'] },
        // Florida
        { state: 'FL', stateCode: 'FL', city: 'Miami', zipRanges: ['33101', '33109', '33125', '33130', '33131'] },
        { state: 'FL', stateCode: 'FL', city: 'Orlando', zipRanges: ['32801', '32803', '32804', '32806', '32807'] },
        { state: 'FL', stateCode: 'FL', city: 'Tampa', zipRanges: ['33602', '33603', '33604', '33605', '33606'] },
        // Illinois
        { state: 'IL', stateCode: 'IL', city: 'Chicago', zipRanges: ['60601', '60602', '60603', '60604', '60605', '60607'] },
        // Washington
        { state: 'WA', stateCode: 'WA', city: 'Seattle', zipRanges: ['98101', '98102', '98103', '98104', '98105'] },
        { state: 'WA', stateCode: 'WA', city: 'Bellevue', zipRanges: ['98004', '98005', '98006', '98007', '98008'] },
        // Massachusetts
        { state: 'MA', stateCode: 'MA', city: 'Boston', zipRanges: ['02101', '02108', '02109', '02110', '02111'] },
        { state: 'MA', stateCode: 'MA', city: 'Cambridge', zipRanges: ['02138', '02139', '02140', '02141', '02142'] },
        // Colorado
        { state: 'CO', stateCode: 'CO', city: 'Denver', zipRanges: ['80202', '80203', '80204', '80205', '80206'] },
        // Arizona
        { state: 'AZ', stateCode: 'AZ', city: 'Phoenix', zipRanges: ['85001', '85003', '85004', '85006', '85007'] },
        { state: 'AZ', stateCode: 'AZ', city: 'Scottsdale', zipRanges: ['85250', '85251', '85254', '85255', '85258'] },
        // Georgia
        { state: 'GA', stateCode: 'GA', city: 'Atlanta', zipRanges: ['30301', '30303', '30305', '30308', '30309'] },
        // Nevada
        { state: 'NV', stateCode: 'NV', city: 'Las Vegas', zipRanges: ['89101', '89102', '89104', '89106', '89109'] },
        // Oregon
        { state: 'OR', stateCode: 'OR', city: 'Portland', zipRanges: ['97201', '97202', '97204', '97205', '97209'] },
        // Pennsylvania
        { state: 'PA', stateCode: 'PA', city: 'Philadelphia', zipRanges: ['19102', '19103', '19104', '19106', '19107'] },
        // Ohio
        { state: 'OH', stateCode: 'OH', city: 'Columbus', zipRanges: ['43201', '43202', '43203', '43204', '43205'] },
        // Michigan
        { state: 'MI', stateCode: 'MI', city: 'Detroit', zipRanges: ['48201', '48202', '48204', '48205', '48206'] },
        // North Carolina
        { state: 'NC', stateCode: 'NC', city: 'Charlotte', zipRanges: ['28202', '28203', '28204', '28205', '28206'] }
    ];

    const STREET_NAMES = [
        'Main St', 'Oak Ave', 'Maple Dr', 'Pine St', 'Cedar Ln', 'Elm St',
        'Park Ave', 'Washington Blvd', 'Lake Dr', 'River Rd', 'Hill St',
        'Forest Ave', 'Sunset Blvd', 'Broadway', 'Market St', 'Church St',
        'High St', 'Union St', 'Spring St', 'Water St', 'Center St'
    ];

    const APARTMENT_TYPES = ['Apt', 'Suite', 'Unit', '#'];

    // ────────── 地址生成函数 ──────────
    function generateRealisticAddress() {
        const location = US_ADDRESS_DATABASE[Math.floor(Math.random() * US_ADDRESS_DATABASE.length)];
        const streetNumber = Math.floor(Math.random() * 9899) + 100;
        const streetName = STREET_NAMES[Math.floor(Math.random() * STREET_NAMES.length)];
        const zipCode = location.zipRanges[Math.floor(Math.random() * location.zipRanges.length)];

        // 20% 概率添加公寓号
        let address = `${streetNumber} ${streetName}`;
        if (Math.random() < 0.2) {
            const aptType = APARTMENT_TYPES[Math.floor(Math.random() * APARTMENT_TYPES.length)];
            const aptNumber = Math.floor(Math.random() * 999) + 1;
            address += ` ${aptType} ${aptNumber}`;
        }

        return {
            address: address,
            city: location.city,
            state: location.stateCode,
            postalCode: zipCode,
            country: 'US'
        };
    }

    function generateAddressByState(stateCode) {
        const stateLocations = US_ADDRESS_DATABASE.filter(loc => loc.stateCode === stateCode);
        if (stateLocations.length === 0) return generateRealisticAddress();

        const location = stateLocations[Math.floor(Math.random() * stateLocations.length)];
        const streetNumber = Math.floor(Math.random() * 9899) + 100;
        const streetName = STREET_NAMES[Math.floor(Math.random() * STREET_NAMES.length)];
        const zipCode = location.zipRanges[Math.floor(Math.random() * location.zipRanges.length)];

        return {
            address: `${streetNumber} ${streetName}`,
            city: location.city,
            state: location.stateCode,
            postalCode: zipCode,
            country: 'US'
        };
    }

    // ────────── 插入样式 ──────────
    GM_addStyle(`
    /* CSS变量 */
    :root {
        --card-bg: rgba(255, 255, 255, 0.98);
        --card-bg-blur: rgba(255, 255, 255, 0.85);
        --panel-bg: #f8f9fa;
        --text-primary: #1a1a2e;
        --text-secondary: #6c757d;
        --text-muted: #adb5bd;
        --accent: #6366f1;
        --accent-hover: #4f46e5;
        --accent-light: rgba(99, 102, 241, 0.1);
        --success: #10b981;
        --success-light: rgba(16, 185, 129, 0.1);
        --warning: #f59e0b;
        --danger: #ef4444;
        --border: rgba(0, 0, 0, 0.08);
        --shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        --shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.08);
        --radius: 16px;
        --radius-sm: 10px;
        --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .dark-mode {
        --card-bg: rgba(24, 24, 27, 0.98);
        --card-bg-blur: rgba(24, 24, 27, 0.9);
        --panel-bg: rgba(39, 39, 42, 0.95);
        --text-primary: #fafafa;
        --text-secondary: #a1a1aa;
        --text-muted: #71717a;
        --accent: #818cf8;
        --accent-hover: #6366f1;
        --accent-light: rgba(129, 140, 248, 0.15);
        --success: #34d399;
        --success-light: rgba(52, 211, 153, 0.15);
        --border: rgba(255, 255, 255, 0.1);
        --shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
    }

    /* 主容器 */
    #cardTools {
        position: fixed !important;
        top: 70px !important;
        right: 20px !important;
        width: 380px !important;
        max-width: calc(100vw - 40px) !important;
        max-height: calc(100vh - 90px) !important;
        z-index: 2147483646 !important;
        background: var(--card-bg) !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border-radius: var(--radius) !important;
        box-shadow: var(--shadow) !important;
        border: 1px solid var(--border) !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        display: none !important;
        overflow: hidden !important;
        animation: slideIn 0.3s ease !important;
    }

    @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }

    /* 头部可拖动区域 */
    .card-tool-header {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        padding: 16px 20px !important;
        background: linear-gradient(135deg, var(--accent), var(--accent-hover)) !important;
        cursor: move !important;
        user-select: none !important;
    }

    .card-tool-header h2 {
        margin: 0 !important;
        font-size: 17px !important;
        font-weight: 600 !important;
        color: white !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
    }

    .header-actions {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
    }

    .version-badge {
        background: rgba(255,255,255,0.2) !important;
        color: white !important;
        font-size: 11px !important;
        font-weight: 500 !important;
        padding: 4px 10px !important;
        border-radius: 20px !important;
    }

    .close-btn {
        width: 28px !important;
        height: 28px !important;
        border: none !important;
        border-radius: 50% !important;
        background: rgba(255,255,255,0.2) !important;
        color: white !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: var(--transition) !important;
    }

    .close-btn:hover {
        background: rgba(255,255,255,0.3) !important;
        transform: rotate(90deg) !important;
    }

    /* 内容区域 */
    .card-content {
        padding: 20px !important;
        overflow-y: auto !important;
        max-height: calc(100vh - 200px) !important;
    }

    /* 面板样式 */
    .content-panel {
        animation: fadeIn 0.25s ease !important;
    }

    /* 菜单按钮 */
    .menu-button {
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        padding: 14px 16px !important;
        margin-bottom: 10px !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius-sm) !important;
        background: var(--panel-bg) !important;
        color: var(--text-primary) !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        text-align: left !important;
        cursor: pointer !important;
        transition: var(--transition) !important;
    }

    .menu-button:hover {
        border-color: var(--accent) !important;
        background: var(--accent-light) !important;
        transform: translateX(4px) !important;
    }

    .menu-button .icon {
        width: 36px !important;
        height: 36px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        margin-right: 12px !important;
        border-radius: 10px !important;
        background: var(--accent-light) !important;
        color: var(--accent) !important;
    }

    .menu-button .menu-text {
        flex: 1 !important;
    }

    .menu-button .menu-text small {
        display: block !important;
        font-size: 12px !important;
        color: var(--text-muted) !important;
        font-weight: 400 !important;
        margin-top: 2px !important;
    }

    .menu-button .arrow {
        color: var(--text-muted) !important;
        transition: var(--transition) !important;
    }

    .menu-button:hover .arrow {
        transform: translateX(4px) !important;
        color: var(--accent) !important;
    }

    /* 面板头部 */
    .panel-header {
        display: flex !important;
        align-items: center !important;
        margin-bottom: 20px !important;
        padding-bottom: 16px !important;
        border-bottom: 1px solid var(--border) !important;
    }

    .back-button {
        width: 36px !important;
        height: 36px !important;
        padding: 0 !important;
        margin-right: 12px !important;
        border: 1px solid var(--border) !important;
        border-radius: 10px !important;
        background: var(--panel-bg) !important;
        color: var(--text-primary) !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: var(--transition) !important;
    }

    .back-button:hover {
        background: var(--accent-light) !important;
        border-color: var(--accent) !important;
        color: var(--accent) !important;
    }

    .panel-header span {
        font-size: 16px !important;
        font-weight: 600 !important;
        color: var(--text-primary) !important;
    }

    /* 表单输入 */
    .input-field {
        margin-bottom: 16px !important;
    }

    .input-field label {
        display: block !important;
        margin-bottom: 6px !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        color: var(--text-secondary) !important;
    }

    #cardTools input,
    #cardTools textarea,
    #cardTools select {
        width: 100% !important;
        padding: 12px 14px !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius-sm) !important;
        background: var(--panel-bg) !important;
        color: var(--text-primary) !important;
        font-size: 14px !important;
        transition: var(--transition) !important;
        box-sizing: border-box !important;
    }

    #cardTools input:focus,
    #cardTools textarea:focus,
    #cardTools select:focus {
        outline: none !important;
        border-color: var(--accent) !important;
        box-shadow: 0 0 0 3px var(--accent-light) !important;
    }

    #cardTools input::placeholder,
    #cardTools textarea::placeholder {
        color: var(--text-muted) !important;
    }

    /* 按钮样式 */
    .button-row {
        display: flex !important;
        gap: 10px !important;
        margin-bottom: 16px !important;
    }

    .btn {
        padding: 12px 20px !important;
        border: none !important;
        border-radius: var(--radius-sm) !important;
        font-weight: 500 !important;
        font-size: 14px !important;
        cursor: pointer !important;
        transition: var(--transition) !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
    }

    .btn-primary {
        background: var(--accent) !important;
        color: white !important;
        flex: 1 !important;
    }

    .btn-primary:hover {
        background: var(--accent-hover) !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3) !important;
    }

    .btn-secondary {
        background: var(--panel-bg) !important;
        color: var(--text-primary) !important;
        border: 1px solid var(--border) !important;
    }

    .btn-secondary:hover {
        border-color: var(--accent) !important;
        color: var(--accent) !important;
    }

    .btn-success {
        background: var(--success) !important;
        color: white !important;
    }

    .btn-success:hover {
        filter: brightness(1.1) !important;
    }

    .btn-full {
        width: 100% !important;
    }

    .btn:disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
        transform: none !important;
    }

    /* 输出区域 */
    .output-field textarea {
        min-height: 120px !important;
        resize: vertical !important;
        font-family: 'SF Mono', Monaco, monospace !important;
        font-size: 13px !important;
        line-height: 1.5 !important;
    }

    /* 提示文本 */
    .hint-text {
        margin: 0 0 12px !important;
        font-size: 13px !important;
        color: var(--text-muted) !important;
        line-height: 1.4 !important;
    }

    /* 地址预览卡片 */
    .address-preview {
        background: var(--panel-bg) !important;
        border: 1px solid var(--border) !important;
        border-radius: var(--radius-sm) !important;
        padding: 14px !important;
        margin-bottom: 16px !important;
        font-size: 13px !important;
        line-height: 1.6 !important;
        color: var(--text-secondary) !important;
    }

    .address-preview strong {
        color: var(--text-primary) !important;
        font-weight: 500 !important;
    }

    /* 状态选择器 */
    .state-selector {
        margin-bottom: 16px !important;
    }

    .state-selector select {
        appearance: none !important;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236c757d' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") !important;
        background-repeat: no-repeat !important;
        background-position: right 14px center !important;
        padding-right: 40px !important;
    }

    /* Toast 通知 */
    .toast {
        position: fixed !important;
        bottom: 20px !important;
        left: 50% !important;
        transform: translateX(-50%) translateY(100px) !important;
        background: var(--text-primary) !important;
        color: var(--card-bg) !important;
        padding: 12px 24px !important;
        border-radius: 30px !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        box-shadow: var(--shadow) !important;
        z-index: 2147483647 !important;
        opacity: 0 !important;
        transition: all 0.3s ease !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
    }

    .toast.show {
        opacity: 1 !important;
        transform: translateX(-50%) translateY(0) !important;
    }

    .toast.success { background: var(--success) !important; color: white !important; }
    .toast.error { background: var(--danger) !important; color: white !important; }
    .toast.warning { background: var(--warning) !important; color: white !important; }

    /* 页脚 */
    .card-footer {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        padding: 14px 20px !important;
        border-top: 1px solid var(--border) !important;
        background: var(--panel-bg) !important;
    }

    .theme-switch {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
    }

    .theme-switch label {
        font-size: 13px !important;
        color: var(--text-secondary) !important;
        cursor: pointer !important;
    }

    .switch {
        position: relative !important;
        width: 44px !important;
        height: 24px !important;
    }

    .switch input {
        display: none !important;
    }

    .slider {
        position: absolute !important;
        cursor: pointer !important;
        inset: 0 !important;
        background: var(--text-muted) !important;
        border-radius: 24px !important;
        transition: var(--transition) !important;
    }

    .slider:before {
        content: "" !important;
        position: absolute !important;
        height: 18px !important;
        width: 18px !important;
        left: 3px !important;
        bottom: 3px !important;
        background: white !important;
        border-radius: 50% !important;
        transition: var(--transition) !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
    }

    input:checked + .slider {
        background: var(--accent) !important;
    }

    input:checked + .slider:before {
        transform: translateX(20px) !important;
    }

    .version-text {
        font-size: 11px !important;
        color: var(--text-muted) !important;
    }

    /* 切换按钮 */
    #toggleBtn {
        position: fixed !important;
        top: 12px !important;
        right: 12px !important;
        z-index: 2147483647 !important;
        width: 48px !important;
        height: 48px !important;
        border: none !important;
        border-radius: 50% !important;
        background: linear-gradient(135deg, var(--accent), var(--accent-hover)) !important;
        color: white !important;
        font-size: 20px !important;
        cursor: pointer !important;
        transition: var(--transition) !important;
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }

    #toggleBtn:hover {
        transform: scale(1.1) rotate(10deg) !important;
        box-shadow: 0 6px 24px rgba(99, 102, 241, 0.5) !important;
    }

    #toggleBtn.active {
        background: linear-gradient(135deg, var(--danger), #dc2626) !important;
        box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4) !important;
    }

    /* 卡片队列指示器 */
    .queue-indicator {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 10px 14px !important;
        background: var(--accent-light) !important;
        border-radius: var(--radius-sm) !important;
        margin-bottom: 12px !important;
        font-size: 13px !important;
    }

    .queue-count {
        font-weight: 600 !important;
        color: var(--accent) !important;
    }

    /* 快捷键提示 */
    .shortcut-hint {
        font-size: 11px !important;
        color: var(--text-muted) !important;
        margin-top: 8px !important;
        text-align: center !important;
    }

    .shortcut-hint kbd {
        background: var(--panel-bg) !important;
        border: 1px solid var(--border) !important;
        border-radius: 4px !important;
        padding: 2px 6px !important;
        font-family: inherit !important;
        font-size: 11px !important;
    }

    /* 响应式 */
    @media (max-width: 480px) {
        #cardTools {
            width: calc(100vw - 20px) !important;
            right: 10px !important;
            top: 60px !important;
        }

        #toggleBtn {
            width: 44px !important;
            height: 44px !important;
            font-size: 18px !important;
        }

        .button-row {
            flex-direction: column !important;
        }

        .card-content {
            padding: 16px !important;
        }
    }

    /* 加载状态 */
    .btn.loading {
        pointer-events: none !important;
        opacity: 0.7 !important;
    }

    .btn.loading::after {
        content: "" !important;
        width: 16px !important;
        height: 16px !important;
        border: 2px solid transparent !important;
        border-top-color: currentColor !important;
        border-radius: 50% !important;
        animation: spin 0.8s linear infinite !important;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    `);

    // ────────── 状态变量 ──────────
    let generatedCardsList = [];
    let currentAddress = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // ────────── 辅助函数 ──────────
    function $(id) {
        return document.getElementById(id);
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function showToast(message, type = 'success') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠'
        };

        toast.innerHTML = `<span>${icons[type] || ''}</span>${message}`;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    async function setNativeValue(element, valueToSet) {
        if (!element) return;
        if (typeof valueToSet === 'number') valueToSet = String(valueToSet);
        if (typeof valueToSet !== 'string') return;

        if (element.tagName === 'SELECT') {
            const valueToSetLower = valueToSet.toLowerCase().trim();
            let found = false;

            for (let opt of element.options) {
                if (opt.value.toLowerCase().trim() === valueToSetLower ||
                    opt.textContent.toLowerCase().trim() === valueToSetLower) {
                    element.value = opt.value;
                    found = true;
                    break;
                }
            }

            if (!found && CONFIG.defaultCountry && element.id === 'billingCountry') {
                for (let opt of element.options) {
                    if (opt.value.toLowerCase() === CONFIG.defaultCountry.toLowerCase()) {
                        element.value = opt.value;
                        break;
                    }
                }
            }
        } else {
            const valueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value')?.set;
            if (valueSetter) valueSetter.call(element, valueToSet);
            else element.value = valueToSet;
        }

        ['input', 'change', 'blur'].forEach(eventType => {
            element.dispatchEvent(new Event(eventType, { bubbles: true }));
        });
        await delay(50);
    }

    // ────────── 卡号生成逻辑 ──────────
    function getCvvLength(bin) {
        return (bin.startsWith('34') || bin.startsWith('37')) ? 4 : 3;
    }

    function parseBinInput(input) {
        const parts = input.split('|').map(p => p.trim());
        return {
            bin: parts[0] || '',
            expiryDate: (parts[1] && parts[2]) ? `${parts[1]}|${parts[2]}` : '',
            cvv: parts[3] || ''
        };
    }

    function validateInputs(bin, expiryDate, cvv) {
        if (bin.length < 6 || bin.length > 12 || !/^\d+$/.test(bin)) {
            throw new Error("BIN 必须是 6-12 位数字");
        }
        if (expiryDate && !isValidExpiryDate(expiryDate)) {
            throw new Error("日期格式无效，请使用 MM|YY 格式");
        }
        const cvvLength = getCvvLength(bin);
        if (cvv && (!/^\d{3,4}$/.test(cvv) || cvv.length !== cvvLength)) {
            throw new Error(`CVV 必须是 ${cvvLength} 位数字`);
        }
    }

    function isValidExpiryDate(date) {
        if (!/^\d{2}\|\d{2}$/.test(date)) return false;
        const month = parseInt(date.split('|')[0], 10);
        return month >= 1 && month <= 12;
    }

    function generateCard(bin, cvvLength, fixedCVV, fixedExpiryDate) {
        let number = bin;
        const targetLength = (cvvLength === 4) ? 15 : 16;
        while (number.length < targetLength - 1) {
            number += Math.floor(Math.random() * 10);
        }
        number += generateCheckDigit(number);
        return {
            number,
            expiryDate: fixedExpiryDate || generateRandomExpiryDate(),
            cvv: fixedCVV || generateRandomCVV(cvvLength)
        };
    }

    function generateCheckDigit(number) {
        let sum = 0;
        let shouldDouble = (number.length % 2) !== 0;
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i), 10);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return ((10 - (sum % 10)) % 10).toString();
    }

    function generateRandomCVV(length) {
        return Math.floor(Math.random() * (10 ** length)).toString().padStart(length, '0');
    }

    function generateRandomExpiryDate() {
        const now = new Date();
        const year = now.getFullYear() + Math.floor(Math.random() * 4) + 1;
        const month = Math.floor(Math.random() * 12) + 1;
        return `${month.toString().padStart(2, '0')}|${(year % 100).toString().padStart(2, '0')}`;
    }

    function generateCards() {
        const binInputValue = $('binInput').value.trim();
        const quantity = parseInt($('quantity').value) || 10;

        if (!binInputValue) {
            showToast('请输入 BIN 码', 'warning');
            return;
        }

        try {
            const { bin, expiryDate, cvv } = parseBinInput(binInputValue);
            validateInputs(bin, expiryDate, cvv);

            generatedCardsList = [];
            const cvvLength = getCvvLength(bin);

            for (let i = 0; i < quantity; i++) {
                const card = generateCard(bin, cvvLength, cvv, expiryDate);
                generatedCardsList.push(`${card.number}|${card.expiryDate}|${card.cvv}`);
            }

            $('generatedCards').value = generatedCardsList.join('\n');
            showToast(`成功生成 ${quantity} 张卡号`, 'success');
            updateQueueCount();
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    function clearInputs() {
        $('binInput').value = "";
        $('quantity').value = "10";
        $('generatedCards').value = "";
        generatedCardsList = [];
        updateQueueCount();
        showToast('已清除', 'success');
    }

    function copyAndFill() {
        const allCardsText = $('generatedCards').value;
        if (!allCardsText) {
            showToast('请先生成卡号', 'warning');
            return;
        }

        navigator.clipboard.writeText(allCardsText).then(() => {
            $('card-input').value = allCardsText;
            showPanel('autofillPanel');
            updateQueueCount();
            showToast('已复制并跳转到填写面板', 'success');
        }).catch(() => {
            $('card-input').value = allCardsText;
            showPanel('autofillPanel');
            showToast('已跳转到填写面板', 'success');
        });
    }

    // ────────── 自动填写逻辑 ──────────
    function getEmailInput() {
        const selectors = [
            'input[type="email"]',
            'input[name="email"]',
            'input[id*="email" i]',
            '#email'
        ];

        for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el) return el;
        }

        const allInputs = document.querySelectorAll('input[type="text"], input:not([type])');
        for (let input of allInputs) {
            const attrs = [input.placeholder, input.getAttribute('aria-label'), input.name, input.id].join(' ').toLowerCase();
            if (attrs.includes('email') || attrs.includes('邮箱')) {
                return input;
            }
        }
        return null;
    }

    function processCardData(text) {
        text = text.replace(/[\s\/]+/g, '|').replace(/\|+/g, '|');
        const cardPattern = /(\d{13,19})\|(0?[1-9]|1[0-2])\|(\d{2}|\d{4})\|(\d{3,4})/g;
        let formattedLines = [];
        let match;

        while ((match = cardPattern.exec(text)) !== null) {
            let [fullMatch, num, mo, yr, cv] = match;
            if (yr.length === 4) yr = yr.slice(-2);
            mo = mo.padStart(2, '0');
            formattedLines.push(`${num}|${mo}|${yr}|${cv}`);
        }

        return formattedLines.join('\n');
    }

    function updateQueueCount() {
        const cardInput = $('card-input');
        if (!cardInput) return;

        const lines = cardInput.value.trim().split('\n').filter(l => l.trim());
        const countEl = document.querySelector('.queue-count');
        if (countEl) {
            countEl.textContent = `${lines.length} 张`;
        }
    }

    async function handleAutoFill() {
        const cardInputTextArea = $('card-input');
        if (!cardInputTextArea) {
            showToast('未找到输入区域', 'error');
            return;
        }

        const cardInputText = cardInputTextArea.value.trim();
        const lines = processCardData(cardInputText).split('\n').filter(line => line.trim());

        if (lines.length === 0) {
            showToast('卡队列已空', 'warning');
            return;
        }

        const submitBtn = $('submit-button');
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }

        try {
            const cardData = lines.shift();
            cardInputTextArea.value = lines.join('\n');
            updateQueueCount();

            const parts = cardData.split('|').map(p => p.trim());
            let cardNumber, month, year, cvc;

            if (parts.length >= 4) {
                [cardNumber, month, year, cvc] = parts;
            } else {
                throw new Error('卡号格式不正确');
            }

            if (year.length === 4) year = year.slice(-2);
            if (month.length === 1) month = month.padStart(2, '0');

            // 获取姓名
            let emailName = 'John Doe';
            const emailInputElement = getEmailInput();
            if (emailInputElement) {
                const emailValue = (emailInputElement.value || '').trim();
                if (emailValue && emailValue.includes('@')) {
                    emailName = emailValue.split('@')[0].replace(/[^a-zA-Z0-9\s]/g, ' ').trim() || 'User';
                }
            }

            // 生成地址
            const selectedState = $('stateSelect')?.value || '';
            currentAddress = selectedState ? generateAddressByState(selectedState) : generateRealisticAddress();

            // 填写表单
            if ($('cardNumber')) await setNativeValue($('cardNumber'), cardNumber);
            if ($('cardExpiry')) await setNativeValue($('cardExpiry'), `${month}/${year}`);
            if ($('cardCvc')) await setNativeValue($('cardCvc'), cvc);
            if ($('billingName')) await setNativeValue($('billingName'), emailName);
            if ($('billingCountry')) await setNativeValue($('billingCountry'), currentAddress.country);
            if ($('billingAddressLine1')) await setNativeValue($('billingAddressLine1'), currentAddress.address);
            if ($('billingLocality')) await setNativeValue($('billingLocality'), currentAddress.city);
            if ($('billingPostalCode')) await setNativeValue($('billingPostalCode'), currentAddress.postalCode);
            if ($('billingAdministrativeArea')) await setNativeValue($('billingAdministrativeArea'), currentAddress.state);

            // 更新地址预览
            updateAddressPreview();

            // 点击提交
            SubmitClick();
            showToast('表单已填写', 'success');

        } catch (error) {
            console.error('填写错误:', error);
            showToast(error.message || '填写失败', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        }
    }

    function updateAddressPreview() {
        const preview = document.querySelector('.address-preview');
        if (preview && currentAddress) {
            preview.innerHTML = `
                <strong>${currentAddress.address}</strong><br>
                ${currentAddress.city}, ${currentAddress.state} ${currentAddress.postalCode}<br>
                ${currentAddress.country}
            `;
        }
    }

    function refreshAddress() {
        const selectedState = $('stateSelect')?.value || '';
        currentAddress = selectedState ? generateAddressByState(selectedState) : generateRealisticAddress();
        updateAddressPreview();
        showToast('地址已刷新', 'success');
    }

    function SubmitClick() {
        const submitButton = document.querySelector("button[type='submit'], button[data-testid='hosted-payment-submit-button'], input[type='submit']");
        if (submitButton) {
            if (submitButton.disabled) {
                setTimeout(SubmitClick, 1000);
                return;
            }
            submitButton.click();
        }
    }

    // ────────── UI 控制 ──────────
    function toggleContainer() {
        const cardTools = $('cardTools');
        const toggleBtn = $('toggleBtn');
        if (!cardTools) return;

        if (cardTools.style.display === 'none' || cardTools.style.display === '') {
            cardTools.style.cssText = 'display: block !important;';
            toggleBtn?.classList.add('active');
            showPanel('mainMenu');
        } else {
            cardTools.style.cssText = 'display: none !important;';
            toggleBtn?.classList.remove('active');
        }
    }

    function showPanel(panelId) {
        ['mainMenu', 'cardGenerator', 'autofillPanel'].forEach(id => {
            const panel = $(id);
            if (panel) {
                panel.style.display = id === panelId ? 'block' : 'none';
            }
        });

        if (panelId === 'autofillPanel') {
            updateQueueCount();
            if (!currentAddress) currentAddress = generateRealisticAddress();
            updateAddressPreview();
        }
    }

    function toggleTheme() {
        const isDark = $('themeSwitch')?.checked;
        if (isDark) {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem(CONFIG.storageKey, 'dark');
        } else {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem(CONFIG.storageKey, 'light');
        }
    }

    function initializeTheme() {
        const savedTheme = localStorage.getItem(CONFIG.storageKey);
        const themeSwitch = $('themeSwitch');
        if (!themeSwitch) return;

        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark-mode');
            themeSwitch.checked = true;
        }
    }

    // ────────── 拖动功能 ──────────
    function initDragging() {
        const header = document.querySelector('.card-tool-header');
        const container = $('cardTools');
        if (!header || !container) return;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.close-btn')) return;
            isDragging = true;
            const rect = container.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            container.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;
            container.style.left = `${Math.max(0, Math.min(x, window.innerWidth - container.offsetWidth))}px`;
            container.style.top = `${Math.max(0, Math.min(y, window.innerHeight - container.offsetHeight))}px`;
            container.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                $('cardTools').style.transition = '';
            }
        });
    }

    // ────────── 快捷键 ──────────
    function initShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + C: 切换面板
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                toggleContainer();
            }
            // Escape: 关闭面板
            if (e.key === 'Escape' && $('cardTools')?.style.display !== 'none') {
                toggleContainer();
            }
        });
    }

    // ────────── 创建 DOM ──────────
    function createElements() {
        // 切换按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'toggleBtn';
        toggleBtn.textContent = CONFIG.toggleBtnText;
        toggleBtn.title = '信用卡工具 (Ctrl+Shift+C)';
        document.body.appendChild(toggleBtn);

        // 获取可用州列表
        const states = [...new Set(US_ADDRESS_DATABASE.map(l => l.stateCode))].sort();
        const stateOptions = states.map(s => `<option value="${s}">${s}</option>`).join('');

        // 主容器
        const container = document.createElement('div');
        container.id = 'cardTools';
        container.innerHTML = `
            <div class="card-tool-header">
                <h2>💳 信用卡工具</h2>
                <div class="header-actions">
                    <span class="version-badge">v3.0</span>
                    <button class="close-btn" title="关闭">✕</button>
                </div>
            </div>
            <div class="card-content">
                <div id="mainMenu" class="content-panel">
                    <button id="generatorBtn" class="menu-button">
                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="5" width="20" height="14" rx="2"/>
                                <line x1="2" y1="10" x2="22" y2="10"/>
                            </svg>
                        </span>
                        <span class="menu-text">
                            卡号生成器
                            <small>根据 BIN 生成有效卡号</small>
                        </span>
                        <span class="arrow">→</span>
                    </button>
                    <button id="autofillBtn" class="menu-button">
                        <span class="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                                <rect x="9" y="3" width="6" height="4" rx="1"/>
                                <path d="M9 12h6M9 16h6"/>
                            </svg>
                        </span>
                        <span class="menu-text">
                            自动填写
                            <small>一键填写支付表单</small>
                        </span>
                        <span class="arrow">→</span>
                    </button>
                    <p class="shortcut-hint">按 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd> 快速切换</p>
                </div>

                <div id="cardGenerator" class="content-panel" style="display:none;">
                    <div class="panel-header">
                        <button class="back-button" aria-label="返回">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        <span>卡号生成器</span>
                    </div>
                    <div class="input-field">
                        <label for="binInput">BIN 码</label>
                        <input type="text" id="binInput" placeholder="输入 BIN (如: 424242)">
                    </div>
                    <div class="input-field">
                        <label for="quantity">生成数量</label>
                        <input type="number" id="quantity" value="10" min="1" max="100">
                    </div>
                    <div class="button-row">
                        <button type="button" id="generateBtn" class="btn btn-primary">生成卡号</button>
                        <button type="button" id="clearBtn" class="btn btn-secondary">清除</button>
                    </div>
                    <div class="output-field">
                        <textarea id="generatedCards" rows="5" readonly placeholder="生成的卡号将显示在这里..."></textarea>
                    </div>
                    <button id="copyAndFillBtn" class="btn btn-success btn-full">复制并跳转填写 →</button>
                </div>

                <div id="autofillPanel" class="content-panel" style="display:none;">
                    <div class="panel-header">
                        <button class="back-button backBtn" aria-label="返回">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M15 19l-7-7 7-7"/>
                            </svg>
                        </button>
                        <span>自动填写</span>
                    </div>

                    <div class="queue-indicator">
                        <span>待处理卡片</span>
                        <span class="queue-count">0 张</span>
                    </div>

                    <p class="hint-text">粘贴卡号信息，格式：卡号|月|年|CVV</p>
                    <textarea id="card-input" rows="4" placeholder="4242424242424242|12|25|123"></textarea>

                    <div class="state-selector">
                        <label for="stateSelect">地址州份（可选）</label>
                        <select id="stateSelect">
                            <option value="">随机州份</option>
                            ${stateOptions}
                        </select>
                    </div>

                    <p class="hint-text">当前地址预览：</p>
                    <div class="address-preview">点击生成地址...</div>

                    <div class="button-row">
                        <button id="refreshAddressBtn" class="btn btn-secondary">🔄 刷新地址</button>
                    </div>

                    <button id="submit-button" class="btn btn-primary btn-full">⚡ 自动填写并提交</button>
                </div>
            </div>
            <div class="card-footer">
                <div class="theme-switch">
                    <label for="themeSwitch">深色模式</label>
                    <label class="switch">
                        <input type="checkbox" id="themeSwitch">
                        <span class="slider"></span>
                    </label>
                </div>
                <span class="version-text">Enhanced v3.0.0</span>
            </div>
        `;

        container.style.cssText = 'display: none !important;';
        document.body.appendChild(container);
    }

    // ────────── 绑定事件 ──────────
    function bindEvents() {
        $('toggleBtn')?.addEventListener('click', toggleContainer);
        $('generateBtn')?.addEventListener('click', generateCards);
        $('clearBtn')?.addEventListener('click', clearInputs);
        $('copyAndFillBtn')?.addEventListener('click', copyAndFill);
        $('generatorBtn')?.addEventListener('click', () => showPanel('cardGenerator'));
        $('autofillBtn')?.addEventListener('click', () => showPanel('autofillPanel'));
        $('submit-button')?.addEventListener('click', handleAutoFill);
        $('themeSwitch')?.addEventListener('change', toggleTheme);
        $('refreshAddressBtn')?.addEventListener('click', refreshAddress);
        $('stateSelect')?.addEventListener('change', refreshAddress);
        $('card-input')?.addEventListener('input', updateQueueCount);

        document.querySelectorAll('.back-button').forEach(btn => {
            btn.addEventListener('click', () => showPanel('mainMenu'));
        });

        document.querySelector('.close-btn')?.addEventListener('click', toggleContainer);
    }

    // ────────── 初始化 ──────────
    function init() {
        try {
            createElements();
            bindEvents();
            initializeTheme();
            initDragging();
            initShortcuts();
            console.log('信用卡工具初始化完成');
        } catch (error) {
            console.error('初始化错误:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();