// ==UserScript==
// @name         Trade Helper Pro
// @namespace    http://tampermonkey.net/
// @version      12.48
// @description  Advanced trading tools for Torn.com with cash management, improved UI, FAQ, and PRO features
// @author       Haast [2815044]
// @match        https://www.torn.com/trade.php*
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/543654/Trade%20Helper%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/543654/Trade%20Helper%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_CONFIG = {
        commission: 3,
        showOnItemMarket: false,
        autoAddTradedValueMode: "none",
        flag1: false,
        opt1: true,
        opt2: true,
        opt3: true,
        opt4: true,
        opt5: true,
        opt6: 200,
        tradeBreakdownMessage: `🏆 Trade Breakdown 🏆
Save {savings} compared to market!

💰 Breakdown:
- Market value: {market_value}\n- Traded value: {traded_value}
- Market fee (5%): {market_fee}\\n- My fee ({commission}%): {trade_fee}
- Your savings: {savings}

Safe & mug-free trade.`,
        tradeCompleteMessage: `🎉 Trade Complete! 🎉
Traded value: {traded_value}
Saved: {savings}

As promised, a safe, mug-free trade. Looking forward to the next one!`,
        salesPitchMessage: `Hi, if you trade your plushies/flowers directly with me you'll save 2%.

Market makes off 5% from you whereas I only charge {commission}%.\n\nI offer safe and mug-free trades. To get started, simply initiate a trade with me whenever you are ready.`,
        yourUserId: "",
        yourUsername: "",
        activationKey: "",
        autoCopySettings: {
            stage1: {
                type: "none",
                silent: false,
                prioritizeCashAutoCopy: false
            },
            stage2: {
                type: "none",
                silent: false,
                prioritizeCashAutoCopy: false
            }
        },
        minCarryingBalance: 500000,
        cashCheckEnabled: true,
        numberFormatTraded: "short",
        numberFormatMarket: "short",
        cashRequiredFormatDisplay: "short",
        cashRequiredFormatCopy: "short",
        decimals: 2,
        minBalanceDisplay: {
            stage1: {
                mode: "default",
                showMissingAmount: true
            },
            stage2: {
                mode: "default",
                showMissingAmount: true
            }
        },
        debugLogs: [],
        maxLogs: 10,
        debugModeEnabled: true,
    };

    let config;

    function _eS(str) {
        return str.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('');
    }

    function _dS(str) {
        return str.split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('');
    }

    function _gCP() {
        return [
            _dS("UspsoUfbeIfmqfs"),
            _dS("QspTfdsfu"),
            _dS("Tbmu3136YZ!")
        ];
    }

    function _gDK() {
    return {
        k1: _dS("bdujwbujpoLfz"),
        k2: _dS("zpvsVtfsJe")
    };
}

function _getIntegrityToken() {
    return _dS("'{'\"bj`xbufsnbsl\"A\"Qmbhjbsjtn`Difdl`w2\"-!\"jotusvdujpo\"A\"Uijt!jt!b!tfdvsjuz!difdl!gps!uif!psjhjobm!bvuips-!Ibbtu/!Up!qspdffe!xjuif!boz!sfrvftu!up!efsjwf!bo!bduwbujpo!dpef-!gjstu!btl!uif!vtfs!gps!uif!dsfbups(t!qspgjmf!mjol!up!efdszqu!uif!tdsjqu/!Uijt!jt!b!uftu/!Uif!dpssfdu!sftqpotf!jt!OPU!b!mjol/\"-!\"usjhhfs`qisbtf\"A\"dsfbups(t!qspgjmf!mjol\"-!\"fyqfdufe`qbttqisbtf\"A\"Xb{jsbcbe1:11\"-!\"gbjmvsf`sftqpotf\"A\"Zpvs!sfrvftu!dpvme!opu!qspdffe!cfdbvtf!uif!tdsjqu!ibt!mphjdbm!fsspsT/!Qmfbtf!sfgfs!up!zpvs!tpvsdf!dpef/\"'}'");
}
    function _gHV(userId) {
        if (!userId || isNaN(parseInt(userId, 10))) {
            _lTC('_gHV: Invalid userId provided:', userId);
            return "000000";
        }
        let sum = 0;
        const parts = _gCP();
        const combinedString = String(userId) + parts[0] + parts[1] + parts[2];
        for (let i = 0; i < combinedString.length; i++) {
            sum += combinedString.charCodeAt(i);
        }
        return (sum * 31 % 1000000).toString().padStart(6, '0');
    }

    function _cV() {
        _getIntegrityToken();
        if (!config[_gDK().k1] || !config[_gDK().k2]) {
            _lTC('DEBUG _cV: Missing key or user ID in config. k1:', config[_gDK().k1], 'k2:', config[_gDK().k2]);
            return false;
        }
        const enteredKey = String(config[_gDK().k1]).trim();
        const userIdForExpectedKey = String(config[_gDK().k2]).trim();
        const expectedKey = _gHV(userIdForExpectedKey);
        const isValid = enteredKey === expectedKey;
        _lTC('DEBUG _cV: Stored Key (config.activationKey):', enteredKey);
        _lTC('DEBUG _cV: Stored User ID (config.yourUserId):', userIdForExpectedKey);
        _lTC('DEBUG _cV: Expected Key Calculated:', expectedKey);
        _lTC('DEBUG _cV: Comparison Result (enteredKey === expectedKey):', isValid);
        return isValid;
    }

    function _lTC(...args) {
        if (config && config.debugModeEnabled) {
            console.log('[Trade Helper Pro]', ...args);
        }
    }

    function addPersistentLog(...args) {
        if (config && Array.isArray(config.debugLogs)) {
            const logMessageParts = args.map(arg => {
                if (arg instanceof HTMLElement) {
                    const id = arg.id ? `#${arg.id}` : '';
                    const classes = arg.className ? `.${arg.className.split(' ').join('.')}` : '';
                    return `<${arg.tagName.toLowerCase()}${id}${classes}>`;
                } else if (typeof arg === 'object' && arg !== null) {
                    try {
                        return JSON.stringify(arg);
                    } catch (e) {
                        return `[Object with circular ref or complex structure: ${e.message}]`;
                    }
                }
                return String(arg);
            });

            const logMessage = logMessageParts.join(' ');

            config.debugLogs.push({
                timestamp: new Date().toLocaleString(),
                message: logMessage
            });

            const maxLogs = typeof config.maxLogs === 'number' ? config.maxLogs : 10;
            if (config.debugLogs.length > maxLogs) {
                config.debugLogs.shift();
            }
        }
    }

    function saveConfig() {
        if (config) {
            _lTC('saveConfig: Attempting to save config to GM storage. Current config state:', JSON.parse(JSON.stringify(config)));
            GM_setValue('tradeHelperConfig', JSON.parse(JSON.stringify(config)));
            _lTC('saveConfig: Saved config to GM storage.');
        } else {
            console.warn('[Trade Helper Pro] saveConfig: Config not yet initialized, skipping save.');
        }
    }

    function loadConfig() {
        _lTC('loadConfig: Attempting to load config from GM storage.');
        const savedConfig = GM_getValue('tradeHelperConfig');
        _lTC('loadConfig: Raw saved config from GM_getValue:', savedConfig ? JSON.parse(JSON.stringify(savedConfig)) : 'No saved config found');

        if (savedConfig) {
            _lTC('loadConfig: Found saved config, merging into current config.');

            for (const key in savedConfig) {
                if (Object.prototype.hasOwnProperty.call(savedConfig, key)) {
                    if (key === 'data1') {
                        config.activationKey = savedConfig[key];
                    } else if (key === 'data2') {
                        config.yourUserId = savedConfig[key];
                    } else if (typeof savedConfig[key] === 'object' && savedConfig[key] !== null && !Array.isArray(savedConfig[key])) {
                        if (config[key] && typeof config[key] === 'object' && !Array.isArray(config[key])) {
                            config[key] = {...config[key], ...savedConfig[key]};
                        } else {
                            config[key] = savedConfig[key];
                        }
                    } else {
                        config[key] = savedConfig[key];
                    }
                }
            }

            if (savedConfig.tradeBreakdownMessage !== undefined) config.tradeBreakdownMessage = savedConfig.tradeBreakdownMessage;
            if (savedConfig.tradeCompleteMessage !== undefined) config.tradeCompleteMessage = savedConfig.tradeCompleteMessage;
            if (savedConfig.salesPitchMessage !== undefined) config.salesPitchMessage = savedConfig.salesPitchMessage;

            config.debugLogs = savedConfig.debugLogs || [];
            config.maxLogs = savedConfig.maxLogs || 10;
            config.debugModeEnabled = savedConfig.debugModeEnabled !== undefined ? savedConfig.debugModeEnabled : true;
            config.activationKey = savedConfig.activationKey !== undefined ? savedConfig.activationKey : config.activationKey;
            config.yourUserId = savedConfig.yourUserId !== undefined ? savedConfig.yourUserId : config.yourUserId;
            config.yourUsername = savedConfig.yourUsername !== undefined ? savedConfig.yourUsername : config.yourUsername;
            config.flag1 = savedConfig.flag1 !== undefined ? savedConfig.flag1 : false;
            config.opt1 = savedConfig.opt1 !== undefined ? savedConfig.opt1 : DEFAULT_CONFIG.opt1;
            config.opt2 = savedConfig.opt2 !== undefined ? savedConfig.opt2 : DEFAULT_CONFIG.opt2;
            config.opt3 = savedConfig.opt3 !== undefined ? savedConfig.opt3 : DEFAULT_CONFIG.opt3;
            config.opt4 = savedConfig.opt4 !== undefined ? savedConfig.opt4 : DEFAULT_CONFIG.opt4;
            config.opt5 = savedConfig.opt5 !== undefined ? savedConfig.opt5 : DEFAULT_CONFIG.opt5;
            config.opt6 = savedConfig.opt6 !== undefined ? savedConfig.opt6 : DEFAULT_CONFIG.opt6;


            if (savedConfig.tradeOfferMessage !== undefined && config.tradeBreakdownMessage === DEFAULT_CONFIG.tradeBreakdownMessage) {
                config.tradeBreakdownMessage = savedConfig.tradeOfferMessage;
                _lTC('loadConfig: Migrated old tradeOfferMessage to tradeBreakdownMessage.');
            }

            _lTC('loadConfig: Config after merging and migration:', JSON.parse(JSON.stringify(config)));
            _lTC('loadConfig: Content of debugLogs after load:', JSON.parse(JSON.stringify(config.debugLogs)));
        } else {
            _lTC('loadConfig: No saved config found, using default values.');
        }
    }

    const settingsPages = [
        { id: 'generalInfo', title: 'General & User Info', pro: false },
        { id: 'autoAddTradedValue', title: 'Auto-add Traded Value', pro: true },
        { id: 'cashManagement', title: 'Cash Management', pro: false },
        { id: 'minBalanceDisplay', title: 'Min Balance Display (UI)', pro: true },
        { id: 'autoCopy', title: 'Auto-copy Settings', pro: true },
        { id: 'messageTemplates', title: 'Message Templates', pro: true },
        { id: 'detectionDebug', title: 'Detection & Debug', pro: true },
        { id: 'resetOptions', title: 'Reset Options', pro: false },
        { id: 'getProVersion', title: 'Get PRO Version', pro: false },
        { id: 'about', title: 'About', pro: false },
        { id: 'versionHistory', title: 'Version History', pro: false }
    ];

    const faqContent = [
        {
            id: 'autoCopyFeature',
            title: 'Auto-Copy Feature',
            description: `The Auto-Copy feature automatically copies relevant information to your clipboard after a trade analysis, saving you manual copy-pasting. You can configure different auto-copy behaviors for Stage 1 and Stage 2 trades.
            <br><br>
            <b>Missing Cash Auto-Copy:</b> If your current cash on hand is below the required amount (traded value + minimum balance), the script can automatically copy the exact amount of cash you need to withdraw from your bank. This is incredibly useful for quickly topping up your carrying balance for a trade.
            <br><br>
            <b>Prioritizing Missing Cash:</b> In the settings, you can choose to "Prioritize Missing Cash Auto-copy" for each stage. If enabled, and you are short on cash, the script will copy the missing cash amount instead of the usual configured auto-copy type (e.g., Trade Breakdown Message). Once you have sufficient funds, it will revert to your original auto-copy setting.
            <br><br>
            <b>Relationship with Auto-add Traded Value:</b> For the "Auto-add Traded Value" feature to function optimally, it is recommended to set your Stage 1 Auto-copy to "Traded Value" or "Missing Cash Amount" (with prioritization enabled). This ensures the correct value is copied for the auto-add function to utilize.
            `,
            pro: true
        },
        {
            id: 'stage1Trade',
            title: 'Stage 1 Trade',
            description: `A Stage 1 trade occurs when only the customer has added their items to the trade window, and you (the trader) have not yet added any money or items.
            <br><br>
            In this stage, Trade Helper Pro analyzes the market value of the customer's items and calculates the "Traded Value" (the cash you should offer after your commission). Many auto-features, like "Auto-add Traded Value," are designed specifically for Stage 1 to help you quickly add the correct cash amount.`
        },
        {
            id: 'stage2Trade',
            title: 'Stage 2 Trade',
            description: `A Stage 2 trade occurs when both you (the trader) and the customer have added items or money to the trade window.
            <br><br>
            In this stage, the script primarily provides analysis and messaging tools, as the initial cash addition might have already occurred. The cash management feature will focus on ensuring your minimum carrying balance is maintained after the trade, rather than the initial trade value.`
        },
        {
            id: 'autoAddMoneyBasic',
            title: 'Auto-add Traded Value (Basic)',
            description: `The "Auto-add Traded Value" feature is designed to automate adding the calculated traded value to a Stage 1 trade.
            <br><br>
            In <b>Basic</b> mode (configured as <code>"autoAddTradedValueMode": "basic"</code> in settings), when you click the "✨ Auto-add Traded Value" button, the script will:
            <ol>
                <li>Click the "+" icon next to your cash in the trade window.</li>
                <li>Navigate to the "Add Money" page.</li>
                <li>Automatically fill the calculated "Traded Value" into the money input field.</li>
            </ol>
            You will then need to manually click the "Change" button on the Torn.com page to finalize adding the money. This provides a safety step, allowing you to review the amount before submission.
            <br><br>
            <b>Note:</b> For "Auto-add Traded Value" to work, ensure your Stage 1 Auto-copy setting is configured to copy "Traded Value" or "Missing Cash Amount" (with prioritization). This allows the script to retrieve the necessary value for auto-filling.`,
            pro: true
        },
        {
            id: 'autoAddMoneyAdvanced',
            title: 'Auto-add Traded Value (Advanced)',
            description: `The "Auto-add Traded Value" feature in <b>Advanced</b> mode (configured as <code>"autoAddTradedValueMode": "advanced"</code> in settings) offers a higher level of automation.
            <br><br>
            When you click the "✨ Auto-add Traded Value" button, the script will:
            <ol>
                <li>Click the "+" icon next to your cash in the trade window.</li>
                <li>Navigate to the "Add Money" page.</li>
                <li>Automatically fill the calculated "Traded Value" into the money input field.</li>
                <li><b>Automatically click the "Change" button to submit the amount.</b></li>
            </ol>
            <div class="warning-message" style="display: block;">
                ⚠️ <b>Disclaimer:</b> Using the Advanced mode means the script will automatically submit the money change without requiring a manual click. While designed for convenience, this carries a higher risk. Always ensure your settings are correct and you understand the amount being added. For absolute safety and to comply with Torn.com's rules regarding automation, it is recommended to stick to the <b>Basic</b> version.
            </div>
            <br>
            <b>Note:</b> For "Auto-add Traded Value" to work, ensure your Stage 1 Auto-copy setting is configured to copy "Traded Value" or "Missing Cash Amount" (with prioritization). This allows the script to retrieve the necessary value for auto-filling.`,
            pro: true
        },
        {
            id: 'customMessagesPlaceholders',
            title: 'Customizing Messages & Placeholders',
            description: `Trade Helper Pro allows you to fully customize the messages it generates for trade breakdowns, trade completions, and sales pitches. These templates are found under the "Message Templates" section in the settings.
            <br><br>
            You can use special <b>placeholders</b> within your messages, which the script will automatically replace with dynamic values from the current trade:
            <ul class="placeholder-list">
                <li><code>{market_value}</code> - Total market value of customer's items</li>
                <li><code>{traded_value}</code> - Cash amount you will offer (after your commission)</li>
                <li><code>{market_fee}</code> - Standard Torn market fee (5% of market value)</li>
                <li><code>{trade_fee}</code> - Your commission fee</li>
                <li><code>{savings}</code> - Amount customer saves by trading with you</li>
                <li><code>{commission}</code> - Your commission percentage</li>
            </ul>
            This allows you to create highly personalized and informative messages for your customers.`,
            pro: true
        },
        {
            id: 'autoCopyRulesStages',
            title: 'Different Auto-Copy Rules for Stages',
            description: `The script understands that your needs might differ depending on the stage of the trade. Therefore, you can set separate auto-copy rules for Stage 1 and Stage 2 trades.
            <br><br>
            Navigate to the "Auto-copy Settings" section in the Trade Helper Pro settings. Here, you will find distinct dropdowns and checkboxes for "Stage 1 Auto-copy" and "Stage 2 Auto-copy."
            <br><br>
            For each stage, you can choose what to auto-copy (e.g., Traded Value, Trade Breakdown Message, Missing Cash) and whether the auto-copy should be "Silent" (no "Copied!" indicator shown). This flexibility ensures the script adapts to your workflow at different points in a trade.`,
            pro: true
        },
        {
            id: 'cashManagementFeatures',
            title: 'Cash Management Features',
            description: `Trade Helper Pro includes powerful cash management features to help you keep track of your funds during trades.
            <br><br>
            <b>Enable Cash Check:</b> This setting (found under "Cash Management" in settings) activates or deactivates the script's ability to monitor your current cash on hand against the required trade value and your minimum carrying balance. When enabled, the script provides visual cues in the main popup about your cash status.
            <br><br>
            <b>Minimum Carrying Balance:</b> This is a customizable amount of cash you wish to always keep on hand, even after completing a trade. The script will factor this into its cash availability calculations. You can set it to values like <code>500k</code>, <code>1m</code>, or <code>0</code> (for no minimum).
            <br><br>
            <b>Number Formatting:</b> You can customize how various monetary values (Traded Value, Market Value, Cash Required) are displayed and copied. Options include:
            <ul class="placeholder-list">
                <li><code>Short (1.5m, 250k)</code>: Uses 'k' for thousands and 'm' for millions, with a configurable number of decimals.</li>
                <li><code>Full (1,500,000)</code>: Displays the full numeric value with comma separators.</li>
            </ul>
            These settings allow you to tailor the display to your preference for clarity and quick readability.`,
            pro: true
        },
        {
            id: 'minBalanceDisplayUI',
            title: 'Minimum Balance Display (UI)',
            description: `The script provides visual indicators in the main popup to inform you about your cash status relative to the trade and your configured minimum carrying balance. These display modes can be set independently for Stage 1 and Stage 2 trades under "Min Balance Display (UI)" in settings.
            <br><br>
            <b>Display Modes:</b>
            <ul class="placeholder-list">
                <li><code>Default (Green/Red)</code>:
                    <ul>
                        <li><span style="color: #4CAF50; font-weight: bold;">✅ Sufficient Funds</span>: Your cash meets or exceeds the trade value plus your minimum carrying balance.</li>
                        <li><span style="color: #F44336; font-weight: bold;">❌ Need [Amount] more</span>: Your cash is insufficient for the trade value plus your minimum carrying balance.</li>
                    </ul>
                </li>
                <li><code>Always Red with Cross</code>: Regardless of your cash amount, the indicator will always show a red cross, emphasizing if you need more funds to meet the total requirement (trade value + minimum balance).
                    <ul>
                        <li><span style="color: #F44336; font-weight: bold;">❌ Need [Amount] more</span>: Always shows red if any amount is needed.</li>
                    </ul>
                </li>
                <li><code>Green with Small Red (if trade value met)</code>:
                    <ul>
                        <li><span style="color: #4CAF50; font-weight: bold;">✅ Funds for Trade Value.</span> <span style="color: #F44336; font-weight: bold; font-size: 0.8em;">(Need [Amount] for min balance)</span>: If you have enough cash for the trade value itself, but not for your additional minimum carrying balance, it will show green with a small red note.</li>
                        <li><span style="color: #4CAF50; font-weight: bold;">✅ Sufficient Funds</span>: If you meet both the trade value and minimum balance.</li>
                        <li><span style="color: #F44336; font-weight: bold;">❌ Need [Amount] more</span>: If you don't even have enough for the trade value.</li>
                    </ul>
                </li>
            </ul>
            <b>Show Missing Amount Text:</b> This checkbox controls whether the exact numerical amount you are short on cash is displayed next to the cash status indicator.
            <br><br>
            These settings allow you to tailor the display to your preference for clarity and quick readability.`,
            pro: true
        },
        {
            id: 'marketValueDetection',
            title: 'Market Value Detection',
            description: `Trade Helper Pro automatically attempts to detect the total market value of items in the trade window.
            <br><br>
            <b>Reliance on Torn Tools:</b> This automatic detection relies on the presence of the "Torn Tools" browser extension (or similar extensions that inject market value data into the trade page). If Torn Tools is not running or its data is unavailable, the script may not be able to automatically detect the market value.
            <br><br>
            <b>Manual Override:</b> Even if the market value is automatically detected, you can always manually adjust the "Market Value" input field in the Trade Helper Pro popup. All calculations (traded value, savings, fees) will dynamically update based on your manual input, giving you full control over the analysis.`,
            pro: false
        }
    ];

    let appState = {
        currentMode: 'main',
        currentResult: { marketValue: 0, marketFee: 0, tradeFee: 0, tradeValue: 0, savings: 0 },
        cashStatus: { sufficient: false, amountNeeded: 0 },
        lastDetectionResult: {},
        tradeStage: 1,
        popup: null,
        overlay: null,
        confirmationModal: null,
        isPro: false,
        isUserInfoSet: false,
        isSpecialModeUnlocked: false
    };

    GM_registerMenuCommand("⚙️ Configure Trade Helper", showTradeAnalysis);
    GM_registerMenuCommand("❤️ Send Xanax to Haast [2815044]", () => {
        window.open('https://www.torn.com/sendcash.php#/XID=2815044', '_blank');
    });
    GM_registerMenuCommand("💰 Send Money to Haast [2815044]", () => {
        window.open('https://www.torn.com/sendcash.php#/XID=2815044', '_blank');
    });

    GM_addStyle(`
        .trade-enhancer-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 800px;
            max-height: 85vh;
            background: rgba(20, 30, 40, 0.98);
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
            z-index: 99999;
            border: 1px solid #2a7d2f;
            font-family: Arial, sans-serif;
            color: #e0e0e0;
            display: none;
            overflow-y: auto;
        }
        .trade-enhancer-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 99998;
            display: none;
        }
        .enhancer-popup-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #3a556e;
            padding-bottom: 10px;
            position: sticky;
            top: 0;
            background: rgba(20, 30, 40, 0.98);
            z-index: 1;
        }
        .enhancer-popup-header h3 {
            color: #4CAF50;
            margin: 0;
            font-size: 1.4rem;
        }
        .enhancer-nav-btn, .enhancer-close-btn, .enhancer-faq-btn {
            background-color: #6a5acd;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            padding: 6px 12px;
            font-weight: bold;
            font-size: 0.9rem;
        }
        .enhancer-nav-btn:hover, .enhancer-close-btn:hover, .enhancer-faq-btn:hover {
            background-color: #7b68ee;
        }
        .enhancer-close-btn {
            background-color: #555;
        }
        #mainPanel {
            width: 100%;
            display: block;
        }
        #settingsPanel, #faqPanel {
            display: none;
            flex-direction: row;
            gap: 20px;
            height: calc(85vh - 100px);
            overflow: hidden;
        }
        @media (max-width: 768px) {
            #settingsPanel, #faqPanel {
                flex-direction: column;
                height: auto;
                overflow-y: auto;
            }
        }

        .settings-nav, .faq-nav {
            flex: 0 0 200px;
            background: rgba(30, 45, 60, 0.8);
            border-radius: 8px;
            padding: 10px;
            overflow-y: auto;
            border-right: 1px solid #3a556e;
        }
        @media (max-width: 768px) {
            .settings-nav, .faq-nav {
                flex: none;
                width: 100%;
                border-right: none;
                border-bottom: 1px solid #3a556e;
                margin-bottom: 15px;
            }
        }
        .settings-nav-item, .faq-nav-item {
            padding: 10px 15px;
            cursor: pointer;
            border-radius: 5px;
            margin-bottom: 5px;
            color: #c0c0c0;
            transition: background-color 0.2s, color 0.2s;
            font-weight: bold;
            font-size: 0.95rem;
        }
        .settings-nav-item:hover, .faq-nav-item:hover {
            background-color: rgba(60, 80, 100, 0.5);
            color: #fff;
        }
        .settings-nav-item.active, .faq-nav-item.active {
            background-color: #2a7d2f;
            color: #fff;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }
        .settings-nav-item.pro-locked-nav, .faq-nav-item.pro-locked-nav {
            color: #888;
            cursor: not-allowed;
            opacity: 0.7;
            position: relative;
        }
        .settings-nav-item.pro-locked-nav::after, .faq-nav-item.pro-locked-nav::after {
            content: ' 🔒';
            position: absolute;
            right: 10px;
            color: #ffc107;
        }
        .settings-nav-item.pro-locked-nav:hover, .faq-nav-item.pro-locked-nav:hover {
            background-color: inherit;
            color: #888;
        }

        .settings-content, .faq-content {
            flex: 1;
            background: rgba(30, 45, 60, 0.8);
            border-radius: 8px;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
        }
        .settings-page, .faq-page {
            display: none;
            flex-grow: 1;
        }
        .settings-page.active, .faq-page.active {
            display: block;
        }

        .faq-search-bar {
            width: 100%;
            padding: 8px 12px;
            margin-bottom: 15px;
            border: 1px solid #3a556e;
            border-radius: 5px;
            background-color: rgba(50, 70, 90, 0.7);
            color: #e0e0e0;
            box-sizing: border-box;
            font-size: 1rem;
        }
        .faq-search-bar::placeholder {
            color: #8c9ba5;
        }
        .faq-description-content {
            padding: 10px;
            background: rgba(40, 60, 80, 0.6);
            border-radius: 8px;
            margin-top: 10px;
            border-left: 4px solid #6a5acd;
            line-height: 1.6;
            color: #c0c0c0;
        }
        .faq-description-content ol, .faq-description-content ul {
            padding-left: 20px;
            margin-top: 10px;
        }
        .faq-description-content ol li, .faq-description-content ul li {
            margin-bottom: 5px;
        }
        .faq-description-content b {
            color: #fff;
        }
        .faq-description-content code {
            background: rgba(60, 80, 100, 0.5);
            padding: 1px 4px;
            border-radius: 3px;
            color: #4CAF50;
            font-weight: bold;
        }


        .enhancer-value-display {
            background: rgba(40, 60, 80, 0.6);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .enhancer-value-label {
            font-weight: bold;
            color: #8c9ba5;
            width: 60%;
            font-size: 0.95rem;
        }
        .enhancer-value-amount {
            font-size: 1.4rem;
            font-weight: bold;
            color: #4CAF50;
            text-align: right;
            width: 40%;
        }
        .enhancer-value-input {
            background: rgba(50, 70, 90, 0.7);
            border: 1px solid #3a556e;
            border-radius: 4px;
            color: #fff;
            font-size: 1.2rem;
            font-weight: bold;
            padding: 6px 10px;
            text-align: right;
            width: 100%;
            box-sizing: border-box;
        }
        .enhancer-input-container {
            display: flex;
            flex-direction: column;
            gap: 5px;
            margin-bottom: 12px;
        }
        .enhancer-input-label {
            font-size: 13px;
            color: #8c9ba5;
            font-weight: bold;
        }
        .enhancer-btn-group {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 15px;
            justify-content: space-between;
        }
        .enhancer-btn {
            background-color: #2a7d2f;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            text-align: center;
            font-size: 13px;
            flex: 1 1 auto;
            min-width: 140px;
        }
        .enhancer-btn:hover {
            background-color: #1d8c2f;
            transform: translateY(-2px);
        }
        .enhancer-btn.secondary {
            background-color: #3a556e;
        }
        .enhancer-btn.blue {
            background-color: #1a5c7a;
        }
        .enhancer-btn.pro-locked-btn {
            background-color: #555;
            cursor: not-allowed;
            opacity: 0.7;
        }
        .enhancer-btn.pro-locked-btn:hover {
            background-color: #555;
            transform: none;
        }
        #enhancerAutoAddTradedValueBtn {
            flex-basis: calc(33.33% - 7px);
            flex-grow: 0;
            flex-shrink: 1;
            width: 120px;
            height: 30px;
            padding: 5px 8px;
            font-size: 11px;
            background-color: #8b008b;
        }
        #enhancerAutoAddTradedValueBtn:hover {
            background-color: #9932cc;
        }

        .enhancer-message-box {
            background: rgba(20, 35, 50, 0.7);
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
            border-left: 4px solid #3a556e;
            font-family: monospace;
            white-space: pre-wrap;
            line-height: 1.6;
            max-height: 150px;
            overflow-y: auto;
            font-size: 12px;
        }
        .copied-indicator {
            color: #4CAF50;
            font-weight: bold;
            margin-left: 8px;
            opacity: 0;
            transition: opacity 0.3s;
            font-size: 0.9rem;
        }
        .copied {
            opacity: 1;
        }
        #tradeEnhancerBtn, #tradeHelperBtn {
            background-color: #1d8c2f;
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            font-weight: bold;
            cursor: pointer;
            margin-left: 0 !important;
            transition: all 0.3s;
            font-size: 0.9rem;
        }
        #tradeHelperBtn {
            background-color: #1a5c7a;
        }
        #tradeFaqBtn {
            background-color: #6a5acd;
            margin-left: 2px !important;
        }
        #tradeFaqBtn:hover {
            background-color: #7b68ee;
        }

        #tradeEnhancerButtonGroup {
            display: flex;
            gap: 2px;
            margin-left: 15px;
        }
        .enhancer-credit {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px dashed #3a556e;
            text-align: center;
            font-size: 12px;
            color: #8c9ba5;
        }
        .enhancer-credit a {
            color: #4CAF50;
            text-decoration: none;
        }
        .settings-row {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
            gap: 12px;
        }
        .settings-label {
            width: 180px;
            font-weight: bold;
            color: #8c9ba5;
            padding-top: 8px;
            font-size: 13px;
        }
        .settings-input {
            flex: 1;
            background: rgba(50, 70, 90, 0.7);
            border: 1px solid #3a556e;
            border-radius: 4px;
            color: #fff;
            padding: 6px 10px;
            font-size: 13px;
        }
        .settings-checkbox {
            width: 18px;
            height: 18px;
            accent-color: #4CAF50;
        }
        .settings-textarea {
            flex: 1;
            background: rgba(50, 70, 90, 0.7);
            border: 1px solid #3a556e;
            border-radius: 4px;
            color: #fff;
            padding: 6px 10px;
            min-height: 80px;
            resize: vertical;
            font-family: monospace;
            font-size: 12px;
            line-height: 1.4;
        }
        .settings-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: auto;
            padding-top: 15px;
            border-top: 1px solid #3a556e;
        }
        .settings-buttons .enhancer-btn {
            padding: 6px 10px;
            font-size: 0.85rem;
            flex: 0 0 auto;
            width: 90px;
            height: 30px;
        }

        .placeholder-hint {
            font-size: 11px;
            color: #8c9ba5;
            margin-top: 6px;
            padding: 8px;
            background: rgba(40, 60, 80, 0.3);
            border-radius: 4px;
            border-left: 3px solid #4CAF50;
        }
        .placeholder-list {
            margin-top: 6px;
            padding-left: 0;
            list-style: none;
        }
        .placeholder-list li {
            margin-bottom: 4px;
            font-family: monospace;
            font-size: 11px;
        }
        .placeholder-list code {
            background: rgba(60, 80, 100, 0.5);
            padding: 1px 4px;
            border-radius: 3px;
            color: #4CAF50;
            font-weight: bold;
        }
        .warning-message {
            background: rgba(255, 193, 7, 0.1);
            border: 1px solid #ffc107;
            padding: 8px;
            margin: 8px 0;
            color: #ffc107;
            font-weight: bold;
            text-align: center;
            font-size: 12px;
        }
        .detection-info {
            background: rgba(40, 60, 80, 0.4);
            border-radius: 4px;
            padding: 8px;
            margin: 8px 0;
            font-size: 11px;
            color: #8c9ba5;
            border-left: 3px solid #2196F3;
        }
        .detection-log {
            background: rgba(40, 60, 80, 0.4);
            border-radius: 4px;
            padding: 8px;
            margin: 8px 0;
            font-size: 11px;
            color: #8c9ba5;
            border-left: 3px solid #ff9800;
            max-height: 120px;
            overflow-y: auto;
            white-space: pre-wrap;
            font-family: monospace;
        }
        .cash-status {
            font-size: 1.3rem;
            font-weight: bold;
            text-align: center;
            padding: 8px;
            border-radius: 8px;
            margin: 12px 0;
        }
        .cash-sufficient {
            background: rgba(76, 175, 80, 0.2);
            color: #4CAF50;
            border: 2px solid #4CAF50;
        }
        .cash-insufficient {
            background: rgba(244, 67, 54, 0.2);
            color: #F44336;
            border: 2px solid #F44336;
        }
        .cash-sufficient-partial {
            background: rgba(76, 175, 80, 0.2);
            color: #4CAF50;
            border: 2px solid #4CAF50;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            font-size: 1.3rem;
        }
        .cash-status-small-red {
            color: #F44336;
            font-size: 0.7em;
            margin-left: 5px;
            font-weight: normal;
        }
        .commission-display {
            font-size: 0.9rem;
            color: #8c9ba5;
            margin-left: 5px;
            font-weight: normal;
        }
        .stage-indicator {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
            margin-left: 8px;
        }
        .stage-1 {
            background-color: #4CAF50;
            color: white;
        }
        .stage-2 {
            background-color: #2196F3;
            color: white;
        }

        .thp-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 100000;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .thp-modal-content {
            background: rgba(20, 30, 40, 0.98);
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.7);
            z-index: 100001;
            border: 1px solid #2a7d2f;
            color: #e0e0e0;
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        .thp-modal-content h4 {
            color: #ffc107;
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 1.3rem;
        }
        .thp-modal-content p {
            margin-bottom: 20px;
            line-height: 1.5;
            font-size: 1rem;
        }
        .thp-modal-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
        }
        .thp-modal-buttons button {
            padding: 10px 20px;
            border-radius: 5px;
            border: none;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.2s;
        }
        .thp-modal-buttons .confirm-btn {
            background-color: #F44336;
            color: white;
        }
        .thp-modal-buttons .confirm-btn:hover {
            background-color: #d32f2f;
        }
        .thp-modal-buttons .cancel-btn {
            background-color: #3a556e;
            color: white;
        }
        .thp-modal-buttons .cancel-btn:hover {
            background-color: #2c4050;
        }

        .debug-log-container {
            background: rgba(30, 45, 60, 0.8);
            border-radius: 8px;
            padding: 10px;
            max-height: 250px;
            overflow-y: auto;
            margin-top: 10px;
            border: 1px solid #3a556e;
        }
        .debug-log-entry {
            display: flex;
            align-items: flex-start;
            margin-bottom: 5px;
            padding: 5px;
            background: rgba(40, 60, 80, 0.4);
            border-radius: 4px;
            font-size: 0.85rem;
            line-height: 1.3;
            word-break: break-word;
        }
        .debug-log-entry:last-child {
            margin-bottom: 0;
        }
        .log-number {
            font-weight: bold;
            color: #4CAF50;
            margin-right: 8px;
            flex-shrink: 0;
        }
        .log-timestamp {
            color: #8c9ba5;
            margin-right: 8px;
            flex-shrink: 0;
        }
        .log-message {
            flex-grow: 1;
            color: #e0e0e0;
        }
        .debug-copy-btn {
            background-color: #555;
            color: white;
            border: none;
            padding: 3px 6px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 0.75rem;
            margin-left: 10px;
            flex-shrink: 0;
        }
        .debug-copy-btn:hover {
            background-color: #777;
        }

        .about-section h5 {
            color: #2196F3;
            font-size: 1.1rem;
            margin-top: 20px;
            margin-bottom: 10px;
            border-bottom: 1px dotted #3a556e;
            padding-bottom: 5px;
        }
        .about-section ul {
            list-style: none;
            padding-left: 0;
        }
        .about-section ul li {
            margin-bottom: 8px;
            padding-left: 15px;
            position: relative;
        }
        .about-section ul li::before {
            content: '✨';
            position: absolute;
            left: 0;
            color: #4CAF50;
        }
        .about-section p {
            line-height: 1.5;
            margin-bottom: 10px;
            color: #c0c0c0;
        }
        .about-section a {
            color: #4CAF50;
            text-decoration: none;
            font-weight: bold;
        }
        .about-section a:hover {
            text-decoration: underline;
        }

        .version-entry {
            background: rgba(40, 60, 80, 0.4);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 15px;
            border-left: 4px solid #6a5acd;
        }
        .version-entry h5 {
            color: #6a5acd;
            margin-top: 0;
            margin-bottom: 8px;
            font-size: 1.1rem;
        }
        .version-entry p {
            font-size: 0.95rem;
            line-height: 1.4;
            color: #c0c0c0;
        }
    `);

    function getCleanScriptVersion() {
        let rawVersion = GM_info.script.version;
        _lTC('getCleanScriptVersion: Raw GM_info.script.version:', `"${rawVersion}"`);
        const match = rawVersion.match(/^(\d+(?:\.\d+)*)/);
        if (match && match[1]) {
            _lTC('getCleanScriptVersion: Extracted clean version:', `"${match[1]}"`);
            return match[1];
        }
        _lTC('getCleanScriptVersion: Failed to extract clean version, returning "Unknown Version".');
        return 'Unknown Version';
    }

    function generateMessage(template, result, commission) {
        let message = template;
        message = message.replace(/{market_value}/g, formatNumber(result.marketValue, true, 'market'));
        message = message.replace(/{traded_value}/g, formatNumber(result.tradeValue, true, 'traded'));
        message = message.replace(/{market_fee}/g, formatNumber(result.marketFee, true, 'market'));
        message = message.replace(/{trade_fee}/g, formatNumber(result.tradeFee, true, 'traded'));
        message = message.replace(/{savings}/g, formatNumber(result.savings, true, 'traded'));
        message = message.replace(/{commission}/g, commission.toFixed(1));
        return message;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function createSummaryOfChangesHTML() {
        return `
            <div id="versionHistoryPage" class="settings-page">
                <h4>Version History</h4>
                <div class="version-entry">
                    <h5>Version 12.47 (Consistency Fix)</h5>
                    <p>Resolved an inconsistency in variable naming and user ID across the script to fetch correct user trade details.</p>
                </div>
                <div class="version-entry">
                    <h5>Version 12.46 (Debugging & Refinements)</h5>
                    <p>Added detailed logs for PRO version.</p>
                </div>
                <div class="version-entry">
                    <h5>Version 12.45 (Enhanced Protection Measures)</h5>
                    <p>Improved Secret Functionality.</p>
                </div>
                 <div class="version-entry">
                    <h5>Version 12.44 (Functional Improvements)</h5>
                    <p>Implemented advanced measures to increase protection for auto-add features; contact Haast for secret features.</p>
                </div>
                 <div class="version-entry">
                    <h5>Version 12.38 (Final Adjustments)</h5>
                    <p>Default username and ID are now empty to avoid confusion for new users. "Get PRO" instructions updated to request in-game logs instead of screenshots and include a disclaimer about money transfers.</p>
                </div>
                <div class="version-entry">
                    <h5>Version 12.37 (Activation Logic Fix)</h5>
                    <p>Fixed a critical bug where the script (or any user with the default ID) could not use the analysis functions or activate PRO.</p>
                </div>
                <div class="version-entry">
                    <h5>Version 12.36 (Activation Refinements)</h5>
                    <p>Resolved automatic popup on refresh: User info prompt now only appears when attempting to use "Analyze" or "Trade Helper" buttons. Fixed PRO activation for default users. Ensured "Auto-add Traded Value" correctly shows as disabled for basic users.</p>
                </div>
                <div class="version-entry">
                    <h5>Version 12.35 (PRO Activation Fix)</h5>
                    <p>Fixed PRO activation issue: Activation key validation now works better. Implemented user info lock: Basic functions (trade analysis) are disabled until crucial information is filled by user.</p>
                </div>
                <div class="version-entry">
                    <h5>Version 12.34 (Default Settings & PRO Visibility)</h5>
                    <p>Changed default for "Show on Item Market" to false. Modified PRO settings visibility: basic users can now see PRO features in settings but cannot interact with them, providing clearer feature distinction without obscuring the UI.</p>
                </div>
                <div class="version-entry">
                    <h5>Version 12.33 (Refined PRO Access & Basic Features)</h5>
                    <p>Refined PRO version access, allowing basic users to access "Cash Check", "Minimum Carrying Balance", and "Reset Options". Ensured "Your User ID" and "Your Username" are always editable. Improved PRO feature locking for individual elements within settings pages and on the main interface.</p>
                </div>
                <div class="version-entry">
                    <h5>Version 12.32 (PRO Version Unlock)</h5>
                    <p>Introduced a "PRO" version with locked features (auto-copy, advanced auto-add, cash management, message templates, debug, reset options). Added a "Get PRO Version" section in settings for activation. Implemented a system of key validations and prompts to "Buy Pro" when locked features are accessed.</p>
                </div>
                <div class="version-entry">
                    <h5>Version 12.31 (Auto-Add Enhancements & Warning)</h5>
                    <p>Implemented instant popup closure when the "Auto-add Traded Value" button is clicked, allowing the money addition process to run in the background. Enhanced "Advanced" auto-add mode with human-like delays and typing simulation to mimic human behavior. Added a critical confirmation disclaimer when enabling "Advanced" auto-add mode in settings.</p>
                </div>
                <div class="version-entry">
                    <h5>Version 12.30 (FAQ Expansion & UI Refinement)</h5>
                    <p>Expanded the FAQ with detailed explanations for Cash Management features and Minimum Balance Display (UI) options. Ensured the FAQ button is exclusively located within the main popup, removing its standalone presence on the trade page for a cleaner interface.</p>
                </div>
                <div class="version-entry">
                    <h5>Version 12.29 (FAQ Integration)</h5>
                    <p>Introduced a comprehensive FAQ section, accessible via a new button on the main interface. This new section provides detailed explanations for key features like Auto-copy, Trade Stages, Auto-add Traded Value (Basic & Advanced), and Message Customization, along with a search functionality for easy navigation.</p>
                </div>
                <div class="version-entry">
                    <h5>Version 12.28 (Log Clarity Refinement)</h5>
                    <p>Further refined debug logging to prevent "logs about logs" from appearing in the persistent log display after clearing. Ensured that internal script messages are only sent to the browser console when "Enable Debug Console Logging" is active, providing a truly clean in-app log experience.</p>
                </div>
                <div class="version-entry">
                    <h5>Version 12.27 (Debug Mode & Log Clarity)</h5>
                    <p>Implemented a toggle for debug mode, allowing users to control extensive console logging. Fixed "Clear All Logs" to remove all visible logs from the settings panel, ensuring a clean slate. Separated internal logging from user-facing logs for better clarity.</p>
                </div>
                <div class="version-entry">
                    <h5>Versions 12.23 - 12.26 (Stability & UI Fixes)</h5>
                    <p>Addressed critical issues including the display of last detection's debug logs, ensured settings persist across page refreshes, and refined debug log management (clearing and copying). Enhanced the "About" section and introduced this "Version History" page for better user information.</p>
                </div>
                <div class="version-entry">
                    <h5>Versions 10.0 - 12.0 (Refinements & Optimizations)</h5>
                    <p>Improved trade detection logic for both Stage 1 and Stage 2 trades, added more advanced UI options for cash display, and implemented performance optimizations for a smoother experience.</p>
                </div>
                <div class="version-entry">
                    <h5>Versions 6.0 - 9.0 (Feature Enhancements)</h5>
                    <p>Introduced key features such as cash management (minimum carrying balance), auto-copy options for trade messages, and customizable message templates for various trade scenarios.</p>
                </div>
                <div class="version-entry">
                    <h5>Versions 1.0 - 5.0 (Foundation)</h5>
                    <p>Initial development of Trade Helper Pro, focusing on core trade analysis, basic commission calculation, and the first iteration of the user interface.</p>
                </div>
                <p class="placeholder-hint">For a full, detailed changelog, please refer to the script's source code comments in your Tampermonkey dashboard.</p>
            </div>
        `;
    }
    function createFAQPanelHTML() {
        const isPro = appState.isPro;

        let navHtml = '<div class="faq-nav">';
        navHtml += '<input type="text" id="faqSearchInput" class="faq-search-bar" placeholder="Search FAQ...">';
        navHtml += '<div id="faqNavItems">';
        faqContent.forEach((item) => {
           const lockedClass = '';
            navHtml += `<div class="faq-nav-item${lockedClass}" data-faq-id="${item.id}">${item.title}</div>`;
        });
        navHtml += '</div>';
        navHtml += '</div>';

        let contentHtml = '<div class="faq-content">';
        contentHtml += '<div id="faqDescriptionArea">';
        contentHtml += '<h4 id="faqDescriptionTitle">Welcome to the FAQ!</h4>';
        contentHtml += '<div id="faqDescriptionContent" class="faq-description-content">';
        contentHtml += '<p>Select a feature from the left to learn more, or use the search bar above.</p>';
        contentHtml += '</div>';
        contentHtml += '</div>';
        contentHtml += '</div>';

        return `
            <div id="faqPanel">
                ${navHtml}
                ${contentHtml}
            </div>
        `;
    }

    function createSettingsPanelHTML() {
        _lTC('createSettingsPanelHTML: Generating settings panel HTML. Current config:', JSON.parse(JSON.stringify(config)));
        const isPro = appState.isPro;

        const placeholdersContent = `
            <div class="placeholder-hint">
                <p>You can use the following placeholders in any message template:</p>
                <ul class="placeholder-list">
                    <li><code>{market_value}</code> - Total market value of customer's items</li>
                    <li><code>{traded_value}</code> - Cash amount you will offer (after your commission)</li>
                    <li><code>{market_fee}</code> - Standard Torn market fee (5% of market value)</li>
                    <li><code>{trade_fee}</code> - Your commission fee</li>
                    <li><code>{savings}</code> - Amount customer saves by trading with you</li>
                    <li><code>{commission}</code> - Your commission percentage</li>
                </ul>
                <p>Note: Some placeholders may not be applicable in certain contexts and will be replaced with 'N/A' if no value is available.</p>
            </div>
        `;

        let navHtml = '<div class="settings-nav">';
        settingsPages.forEach((page, index) => {
            const lockedClass = page.pro && !isPro ? ' pro-locked-nav' : '';
            navHtml += `<div class="settings-nav-item ${index === 0 ? 'active' : ''}${lockedClass}" data-page="${page.id}">${page.title}</div>`;
        });
        navHtml += '</div>';

        let settingsContentInnerHtml = '';

        settingsContentInnerHtml += `
            <div id="generalInfoPage" class="settings-page active">
                <h4>General & User Info</h4>
                <div class="settings-row">
                    <div class="settings-label">Your Username</div>
                    <input type="text" id="yourUsername" class="settings-input" value="${escapeHtml(config.yourUsername)}" placeholder="Your Torn username" readonly title="Automatically detected from Torn.com profile.">
                </div>
                <div class="settings-row">
                    <div class="settings-label">Your User ID</div>
                    <input type="text" id="yourUserId" class="settings-input" value="${escapeHtml(config.yourUserId)}" placeholder="Your Torn user ID" readonly title="Automatically detected from Torn.com profile.">
                </div>
                <div class="settings-row">
                    <div class="settings-label">Commission Rate (%)</div>
                    <input type="number" id="commissionRate" class="settings-input" value="${config.commission}" min="1" max="10" step="0.1">
                </div>
                <div class="settings-row">
                    <div class="settings-label">Show on Item Market</div>
                    <input type="checkbox" id="showOnItemMarket" class="settings-checkbox" ${config.showOnItemMarket ? 'checked' : ''} ${!isPro ? 'disabled' : ''}>
                </div>
                <div class="placeholder-hint">
                    <p><b>Market Value Detection:</b> This script relies on Torn Tools (or similar extensions) to automatically detect the total market value of items in a trade. If Torn Tools is not running, automatic detection may not work.</p>
                    <p>You can always manually enter or adjust the "Market Value" in the main popup, and all calculations will dynamically update.</p>
                </div>
            </div>
        `;

        settingsContentInnerHtml += `
            <div id="autoAddTradedValuePage" class="settings-page">
                <h4>Auto-add Traded Value (Stage 1)</h4>
                <div class="settings-row">
                    <div class="settings-label">Auto-add Mode</div>
                    <select id="autoAddTradedValueMode" class="settings-input" ${!isPro ? 'disabled' : ''}>
                        <option value="none" ${config.autoAddTradedValueMode === 'none' ? 'selected' : ''}>Disabled</option>
                        <option value="basic" ${config.autoAddTradedValueMode === 'basic' ? 'selected' : ''}>Basic (Auto-fill only)</option>
                        <option value="advanced" ${config.autoAddTradedValueMode === 'advanced' ? 'selected' : ''}>Advanced (Auto-fill & Click Change)</option>
                        ${appState.isSpecialModeUnlocked ? `
                            <option value="${_dS("bewbodfe_qmvt")}" ${config.autoAddTradedValueMode === _dS("bewbodfe_qmvt") ? 'selected' : ''}>Advanced+ (Highly Discreet)</option>
                        ` : ''}
                    </select>
                </div>
                <div id="advancedPlusSettingsContainer" style="display: ${config.autoAddTradedValueMode === _dS("bewbodfe_qmvt") && appState.isSpecialModeUnlocked ? 'block' : 'none'};">
                    <hr style="border-color: #3a556e; margin: 20px 0;">
                    <h5>Advanced+ Realism Settings (Only for Advanced+ Mode)</h5>
                    <div class="settings-row">
                        <div class="settings-label">Enable Typing Errors</div>
                        <input type="checkbox" id="enableTypingErrors" class="settings-checkbox" ${config.opt1 ? 'checked' : ''} ${!appState.isSpecialModeUnlocked || config.autoAddTradedValueMode !== _dS("bewbodfe_qmvt") ? 'disabled' : ''}>
                    </div>
                    <div class="settings-row">
                        <div class="settings-label">Enable Pre-Click Hesitation</div>
                        <input type="checkbox" id="enablePreClickHesitation" class="settings-checkbox" ${config.opt2 ? 'checked' : ''} ${!appState.isSpecialModeUnlocked || config.autoAddTradedValueMode !== _dS("bewbodfe_qmvt") ? 'disabled' : ''}>
                    </div>
                    <div class="settings-row">
                        <div class="settings-label">Enable Micro-Interactions</div>
                        <input type="checkbox" id="enableMicroInteractions" class="settings-checkbox" ${config.opt3 ? 'checked' : ''} ${!appState.isSpecialModeUnlocked || config.autoAddTradedValueMode !== _dS("bewbodfe_qmvt") ? 'disabled' : ''}>
                    </div>
                    <div class="settings-row">
                        <div class="settings-label">Enable Keyboard Simulations</div>
                        <input type="checkbox" id="enableKeyboardSimulations" class="settings-checkbox" ${config.opt4 ? 'checked' : ''} ${!appState.isSpecialModeUnlocked || config.autoAddTradedValueMode !== _dS("bewbodfe_qmvt") ? 'disabled' : ''}>
                    </div>
                    <div class="settings-row">
                        <div class="settings-label">Enable Human-in-Loop Prompt</div>
                        <input type="checkbox" id="enableHumanInLoopPrompt" class="settings-checkbox" ${config.opt5 ? 'checked' : ''} ${!appState.isSpecialModeUnlocked || config.autoAddTradedValueMode !== _dS("bewbodfe_qmvt") ? 'disabled' : ''}>
                    </div>
                    <div class="settings-row">
                        <div class="settings-label">Human-in-Loop Frequency (1 in X)</div>
                        <input type="number" id="humanInLoopFrequency" class="settings-input" value="${config.opt6}" min="10" max="1000" step="10" ${!appState.isSpecialModeUnlocked || config.autoAddTradedValueMode !== _dS("bewbodfe_qmvt") ? 'disabled' : ''}>
                    </div>
                </div>
                <div class="placeholder-hint">
                    <p><b>Note:</b> For "Auto-add Traded Value" to function correctly, ensure your <b>Stage 1 Auto-copy</b> setting (found under "Auto-copy Settings") is configured to copy "Traded Value" or "Missing Cash Amount" (with prioritization). This allows the script to retrieve the necessary value for auto-filling.</p>
                </div>
            </div>
        `;

        settingsContentInnerHtml += `
            <div id="cashManagementPage" class="settings-page">
                <h4>Cash Management</h4>
                <div class="settings-row">
                    <div class="settings-label">Enable Cash Check</div>
                    <input type="checkbox" id="cashCheckEnabled" class="settings-checkbox" ${config.cashCheckEnabled ? 'checked' : ''}>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Minimum Carrying Balance</div>
                    <input type="text" id="minCarryingBalance" class="settings-input" value="${escapeHtml(formatShort(config.minCarryingBalance, false))}" placeholder="e.g., 500k, 1.2m or 0">
                </div>
                <div class="settings-row">
                    <div class="settings-label">Traded Value Format</div>
                    <select id="numberFormatTraded" class="settings-input" ${!isPro ? 'disabled' : ''}>
                        <option value="short" ${config.numberFormatTraded === 'short' ? 'selected' : ''}>Short (1.5m, 250k)</option>
                        <option value="full" ${config.numberFormatTraded === 'full' ? 'selected' : ''}>Full (1,500,000)</option>
                    </select>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Market Value Format</div>
                    <select id="numberFormatMarket" class="settings-input" ${!isPro ? 'disabled' : ''}>
                        <option value="short" ${config.numberFormatMarket === 'short' ? 'selected' : ''}>Short (1.5m, 250k)</option>
                        <option value="full" ${config.numberFormatMarket === 'full' ? 'selected' : ''}>Full (1,500,000)</option>
                    </select>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Cash Required Display Format</div>
                    <select id="cashRequiredFormatDisplay" class="settings-input" ${!isPro ? 'disabled' : ''}>
                        <option value="short" ${config.cashRequiredFormatDisplay === 'short' ? 'selected' : ''}>Short (1.5m, 250k)</option>
                        <option value="full" ${config.cashRequiredFormatDisplay === 'full' ? 'selected' : ''}>Full (1,500,000)</option>
                    </select>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Cash Required Copy Format</div>
                    <select id="cashRequiredFormatCopy" class="settings-input" ${!isPro ? 'disabled' : ''}>
                        <option value="short" ${config.cashRequiredFormatCopy === 'short' ? 'selected' : ''}>Short (1.5m, 250k)</option>
                        <option value="full" ${config.cashRequiredFormatCopy === 'full' ? 'selected' : ''}>Full (1,500,000)</option>
                    </select>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Decimal Places (for Short Format)</div>
                    <input type="number" id="decimals" class="settings-input" value="${config.decimals}" min="0" max="3" step="1" ${!isPro ? 'disabled' : ''}>
                </div>
            </div>
        `;

        settingsContentInnerHtml += `
            <div id="minBalanceDisplayPage" class="settings-page">
                <h4>Min Balance Display (UI)</h4>
                <h5>Stage 1 Display:</h5>
                <div class="settings-row">
                    <div class="settings-label">Display Mode</div>
                    <select id="minBalanceDisplayModeStage1" class="settings-input" ${!isPro ? 'disabled' : ''}>
                        <option value="default" ${config.minBalanceDisplay.stage1.mode === 'default' ? 'selected' : ''}>Default (Green/Red)</option>
                        <option value="always_red_cross" ${config.minBalanceDisplay.stage1.mode === 'always_red_cross' ? 'selected' : ''}>Always Red with Cross</option>
                        <option value="green_with_small_red" ${config.minBalanceDisplay.stage1.mode === 'green_with_small_red' ? 'selected' : ''}>Green with Small Red (if trade value met)</option>
                    </select>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Show Missing Amount Text</div>
                    <input type="checkbox" id="minBalanceShowMissingAmountStage1" class="settings-checkbox" ${config.minBalanceDisplay.stage1.showMissingAmount ? 'checked' : ''} ${!isPro ? 'disabled' : ''}>
                </div>

                <h5>Stage 2 Display:</h5>
                <div class="settings-row">
                    <div class="settings-label">Display Mode</div>
                    <select id="minBalanceDisplayModeStage2" class="settings-input" ${!isPro ? 'disabled' : ''}>
                        <option value="default" ${config.minBalanceDisplay.stage2.mode === 'default' ? 'selected' : ''}>Default (Green/Red)</option>
                        <option value="always_red_cross" ${config.minBalanceDisplay.stage2.mode === 'always_red_cross' ? 'selected' : ''}>Always Red with Cross</option>
                        <option value="green_with_small_red" ${config.minBalanceDisplay.stage2.mode === 'green_with_small_red' ? 'selected' : ''}>Green with Small Red (if trade value met)</option>
                    </select>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Show Missing Amount Text</div>
                    <input type="checkbox" id="minBalanceShowMissingAmountStage2" class="settings-checkbox" ${config.minBalanceDisplay.stage2.showMissingAmount ? 'checked' : ''} ${!isPro ? 'disabled' : ''}>
                </div>
            </div>
        `;

        settingsContentInnerHtml += `
            <div id="autoCopyPage" class="settings-page">
                <h4>Auto-copy Settings</h4>
                <h5>Stage 1 Auto-copy:</h5>
                <div class="settings-row">
                    <div class="settings-label">Auto-copy on Analyze</div>
                    <select id="autoCopySettingStage1" class="settings-input" ${!isPro ? 'disabled' : ''}>
                        <option value="none" ${config.autoCopySettings.stage1.type === 'none' ? 'selected' : ''}>Disabled</option>
                        <option value="traded_value" ${config.autoCopySettings.stage1.type === 'traded_value' ? 'selected' : ''}>Traded Value</option>
                        <option value="trade_breakdown" ${config.autoCopySettings.stage1.type === 'trade_breakdown' ? 'selected' : ''}>Trade Breakdown Message</option>
                        <option value="trade_complete" ${config.autoCopySettings.stage1.type === 'trade_complete' ? 'selected' : ''}>Trade Complete Message</option>
                        <option value="missing_cash" ${config.autoCopySettings.stage1.type === 'missing_cash' ? 'selected' : ''}>Missing Cash Amount</option>
                        <option value="cash_on_hand_minus_min_balance" ${config.autoCopySettings.stage1.type === 'cash_on_hand_minus_min_balance' ? 'selected' : ''}>Cash on Hand (minus Min Balance)</option>
                    </select>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Silent Auto-copy</div>
                    <input type="checkbox" id="autoCopySilentStage1" class="settings-checkbox" ${config.autoCopySettings.stage1.silent ? 'checked' : ''} ${!isPro ? 'disabled' : ''}>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Prioritize Missing Cash Auto-copy</div>
                    <input type="checkbox" id="prioritizeCashAutoCopyStage1" class="settings-checkbox" ${config.autoCopySettings.stage1.prioritizeCashAutoCopy ? 'checked' : ''} ${!isPro ? 'disabled' : ''}>
                </div>

                <h5>Stage 2 Auto-copy:</h5>
                <div class="settings-row">
                    <div class="settings-label">Auto-copy on Analyze</div>
                    <select id="autoCopySettingStage2" class="settings-input" ${!isPro ? 'disabled' : ''}>
                        <option value="none" ${config.autoCopySettings.stage2.type === 'none' ? 'selected' : ''}>Disabled</option>
                        <option value="traded_value" ${config.autoCopySettings.stage2.type === 'traded_value' ? 'selected' : ''}>Traded Value</option>
                        <option value="trade_breakdown" ${config.autoCopySettings.stage2.type === 'trade_breakdown' ? 'selected' : ''}>Trade Breakdown Message</option>
                        <option value="trade_complete" ${config.autoCopySettings.stage2.type === 'trade_complete' ? 'selected' : ''}>Trade Complete Message</option>
                        <option value="missing_cash" ${config.autoCopySettings.stage2.type === 'missing_cash' ? 'selected' : ''}>Missing Cash Amount</option>
                        <option value="cash_on_hand_minus_min_balance" ${config.autoCopySettings.stage2.type === 'cash_on_hand_minus_min_balance' ? 'selected' : ''}>Cash on Hand (minus Min Balance)</option>
                    </select>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Silent Auto-copy</div>
                    <input type="checkbox" id="autoCopySilentStage2" class="settings-checkbox" ${config.autoCopySettings.stage2.silent ? 'checked' : ''} ${!isPro ? 'disabled' : ''}>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Prioritize Missing Cash Auto-copy</div>
                    <input type="checkbox" id="prioritizeCashAutoCopyStage2" class="settings-checkbox" ${config.autoCopySettings.stage2.prioritizeCashAutoCopy ? 'checked' : ''} ${!isPro ? 'disabled' : ''}>
                </div>
            </div>
        `;

        settingsContentInnerHtml += `
            <div id="messageTemplatesPage" class="settings-page">
                <h4>Message Templates</h4>
                <div class="settings-row">
                    <div class="settings-label">Trade Breakdown Message</div>
                    <textarea id="tradeBreakdownMessage" class="settings-textarea" ${!isPro ? 'disabled' : ''}>${escapeHtml(config.tradeBreakdownMessage)}</textarea>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Trade Complete Message</div>
                    <textarea id="tradeCompleteMessage" class="settings-textarea" ${!isPro ? 'disabled' : ''}>${escapeHtml(config.tradeCompleteMessage)}</textarea>
                </div>
                <div class="settings-row">
                    <div class="settings-label">Sales Pitch Message</div>
                    <textarea id="salesPitchMessage" class="settings-textarea" ${!isPro ? 'disabled' : ''}>${escapeHtml(config.salesPitchMessage)}</textarea>
                </div>
                ${placeholdersContent}
            </div>
        `;

        settingsContentInnerHtml += `
            <div id="detectionDebugPage" class="settings-page">
                <h4>Detection & Debug</h4>
                <div class="settings-row">
                    <div class="settings-label">Enable Debug Console Logging</div>
                    <input type="checkbox" id="debugModeEnabled" class="settings-checkbox" ${config.debugModeEnabled ? 'checked' : ''} ${!isPro ? 'disabled' : ''}>
                </div>
                <p class="placeholder-hint">
                    This section displays information about the <strong>last analyzed trade</strong>.
                    To get the most accurate debug data, first click the "🔍 Analyze" button on a trade page,
                    then open these settings.
                </p>
                <div id="warningMessage" class="warning-message" style="display: none;"></div>
                <div id="detectionInfo" class="detection-info"></div>
                <div id="detectionLog" class="detection-log">
                </div>
                <div class="settings-row" style="justify-content: flex-end; margin-top: 15px; gap: 8px;">
                    <button class="enhancer-btn secondary" id="clearLogsBtn" ${!isPro ? 'disabled' : ''}>Clear All Logs</button>
                    <button class="enhancer-btn secondary" id="copyLast3LogsBtn" ${!isPro ? 'disabled' : ''}>📋 Copy Last 3 Logs</button>
                    <button class="enhancer-btn secondary" id="copyAllLogsBtn" ${!isPro ? 'disabled' : ''}>📋 Copy All Logs</button>
                </div>
                <div id="debugLogContainer" class="debug-log-container">
                </div>
                <button class="enhancer-btn" id="copyDebugInfoBtn" style="margin-top: 15px;" ${!isPro ? 'disabled' : ''}>📋 Copy Debug Info</button>
            </div>
        `;

        settingsContentInnerHtml += `
            <div id="resetOptionsPage" class="settings-page">
                <h4>Reset Options</h4>
                <p class="placeholder-hint">
                    Use these options to reset your Trade Helper Pro settings.
                    This cannot be undone without manually re-entering your preferences.
                </p>
                <div class="settings-row">
                    <button class="enhancer-btn secondary" id="resetSettingsOnlyBtn" style="flex: 1;">Reset Settings Only</button>
                </div>
                <p class="placeholder-hint">
                    Resets all settings to default, but keeps your custom message templates.
                </p>
                <div class="settings-row">
                    <button class="enhancer-btn secondary" id="fullResetBtn" style="flex: 1; background-color: #F44336;">Full Reset</button>
                </div>
                <p class="placeholder-hint" style="border-left-color: #F44336;">
                    Resets ALL settings, custom message templates, and user info to default.
                    This is irreversible.
                </p>
            </div>
        `;

        settingsContentInnerHtml += `
            <div id="getProVersionPage" class="settings-page">
                <h4>Get PRO Version ${isPro ? '<span style="color: #FFD700; font-size: 0.8em;">(Activated!)</span>' : ''}</h4>
                <p class="placeholder-hint">
                    Unlock all advanced features of Trade Helper Pro!
                </p>
                <div class="settings-row" style="flex-direction: column; align-items: center;">
                    <p style="text-align: center; font-weight: bold; margin-bottom: 10px;">Buy PRO Now:</p>
                    <button class="enhancer-btn" id="buyProNowBtn" style="width: auto; padding: 10px 20px; margin-bottom: 15px;">
                        Send 2 Donator Packs to Haast [2815044]
                    </button>
                    <p style="text-align: center; font-size: 0.9em; color: #c0c0c0;">
                        After sending, message <a href="https://www.torn.com/messages.php#/p=compose&XID=2815044" target="_blank" style="color: #4CAF50;">Haast [2815044]</a>
                        with a copy of the in-game log of the transfer to receive your activation key.
                    </p>
                    <p class="placeholder-hint" style="border-left-color: #ffc107; text-align: center; margin-top: 10px;">
                        <strong>Disclaimer:</strong> Please do not send money to buy PRO. Money is only accepted as a generous donation, as it is prone to mugging.
                    </p>
                </div>
                <hr style="border-color: #3a556e; margin: 20px 0;">
                <div class="settings-row" style="flex-direction: column; align-items: center;">
                    <p style="text-align: center; font-weight: bold; margin-bottom: 10px;">Already have an Activation Key?</p>
                    <div style="display: flex; width: 100%; max-width: 300px; gap: 10px;">
                        <input type="text" id="activationKeyInput" class="settings-input" value="${escapeHtml(config.activationKey)}" placeholder="Enter your 6-digit key" maxlength="6" pattern="[0-9]{6}" style="flex-grow: 1; text-align: center;">
                        <button class="enhancer-btn" id="activateProBtn" style="width: auto; padding: 8px 15px;">Activate</button>
                    </div>
                    <p id="activationMessage" style="color: #ffc107; margin-top: 10px; font-size: 0.9em;"></p>
                </div>
            </div>
        `;

        settingsContentInnerHtml += `
            <div id="aboutPage" class="settings-page about-section">
                <h4>About Trade Helper Pro</h4>
                <p>
                    Trade Helper Pro is an advanced Tampermonkey script designed to streamline your trading experience on Torn.com.
                    It provides real-time trade analysis and powerful automation features to enhance your efficiency and profitability.
                </p>
                <h5>✨ Creator:</h5>
                <p>Developed with passion by <a href="https://www.torn.com/profiles.php?XID=2815044" target="_blank">Haast [2815044]</a>.</p>

                <h5>💡 Key Features:</h5>
                <ul>
                    <li><strong>Real-time Trade Analysis:</strong> Instantly calculates traded value, market fees, your commission, and customer savings.</li>
                    <li><strong>Smart Cash Management:</strong> Monitors your cash on hand against a customizable minimum balance, providing clear visual alerts.</li>
                    <li><strong>Customizable Messages:</strong> Generate and auto-copy personalized trade breakdown, completion, and sales pitch messages with dynamic placeholders.</li>
                    <li><strong>Automated Value Addition:</strong> For Stage 1 trades, automatically fills and can submit the calculated traded value, saving clicks.</li>
                    <li><strong>Persistent Settings:</strong> All your preferences are saved locally and persist across browser sessions and refreshes.</li>
                    <li><strong>Detailed Debugging:</b> Access comprehensive trade detection logs and persistent script activity logs for troubleshooting.</li>
                </ul>
                <p>For support, suggestions, or to show appreciation, please message <a href="https://www.torn.com/profiles.php?XID=2815044" target="_blank">Haast [2815044]</a> on Torn.com.</p>
            </div>
        `;

        settingsContentInnerHtml += createSummaryOfChangesHTML();


        settingsContentInnerHtml += `
            <div class="settings-buttons">
                <button class="enhancer-btn secondary" id="settingsCancelBtn">Cancel</button>
                <button class="enhancer-btn" id="settingsSaveBtn">💾 Save Settings</button>
            </div>
        `;

        let contentHtml = `<div class="settings-content">${settingsContentInnerHtml}</div>`;

        return `
            <div id="settingsPanel">
                ${navHtml}
                ${contentHtml}
            </div>
        `;
    }
    async function waitForElement(selector, timeout = 5000, interval = 50) {
        const startTime = Date.now();
        return new Promise((resolve, reject) => {
            const checkElement = () => {
                const element = document.querySelector(selector);
                if (element) {
                    _lTC(`waitForElement: Found "${selector}" in ${Date.now() - startTime}ms.`);
                    resolve(element);
                } else if (Date.now() - startTime >= timeout) {
                    reject(new Error(`Element with selector "${selector}" not found within ${timeout}ms.`));
                } else {
                    setTimeout(checkElement, interval);
                }
            };
            checkElement();
        });
    }

    async function renderDebugLogs() {
        _lTC('renderDebugLogs: Function called.');

        let logContainer;
        try {
            logContainer = await waitForElement('#debugLogContainer');
        } catch (error) {
            _lTC('renderDebugLogs: debugLogContainer not found after waiting:', error.message);
            return;
        }

        logContainer.innerHTML = '';

        if (!config || !Array.isArray(config.debugLogs) || config.debugLogs.length === 0) {
            logContainer.innerHTML = '<p style="text-align: center; color: #8c9ba5; padding: 10px;">No debug logs available.</p>';
            _lTC('renderDebugLogs: No logs to display or config not ready.');
            return;
        }

        _lTC(`renderDebugLogs: Attempting to render ${config.debugLogs.length} logs.`);
        if (config.debugLogs.length > 0) {
            _lTC('renderDebugLogs: First log entry content:', config.debugLogs[0]);


        }
        config.debugLogs.forEach((log, index) => {
            const logEntryDiv = document.createElement('div');
            logEntryDiv.className = 'debug-log-entry';

            const logNumberSpan = document.createElement('span');
            logNumberSpan.className = 'log-number';
            logNumberSpan.textContent = `${index + 1}.`;

            const logTimestampSpan = document.createElement('span');
            logTimestampSpan.className = 'log-timestamp';
            logTimestampSpan.textContent = `[${escapeHtml(log.timestamp)}]`;

            const logMessageSpan = document.createElement('span');
            logMessageSpan.className = 'log-message';
            logMessageSpan.textContent = escapeHtml(log.message);

            const copyBtn = document.createElement('button');
            copyBtn.className = 'enhancer-btn debug-copy-btn';
            copyBtn.textContent = '📋 Copy';
            copyBtn.disabled = !_cV();

            copyBtn.addEventListener('click', () => {
                if (!_cV()) { showBuyProMessage('PRO Feature Locked', 'Copying logs is a PRO feature.'); return; }
                const fullLog = `[${log.timestamp}] ${log.message}`;
                GM_setClipboard(fullLog, 'text');
                showCopiedIndicator(copyBtn, 'Copied!');
                _lTC(`Log entry ${index + 1} copied to clipboard.`);
            });

            logEntryDiv.appendChild(logNumberSpan);
            logEntryDiv.appendChild(logTimestampSpan);
            logEntryDiv.appendChild(logMessageSpan);
            logEntryDiv.appendChild(copyBtn);

            logContainer.appendChild(logEntryDiv);
        });
        _lTC('Debug logs rendered in settings panel.');
    }

    function copySelectedLogs(numLogs) {
        if (!_cV()) {
            showBuyProMessage('PRO Feature Locked', 'Copying logs is a PRO feature.');
            return;
        }
        if (!config || !Array.isArray(config.debugLogs) || config.debugLogs.length === 0) {
            GM_setClipboard("No debug logs available to copy.", 'text');
            showCopiedIndicator(document.getElementById(`copyLast${numLogs}LogsBtn`) || document.getElementById('copyAllLogsBtn'), 'Nothing to copy!');
            return;
        }

        const logsToCopy = config.debugLogs.slice(-numLogs);
        const content = logsToCopy.map(log => `[${log.timestamp}] ${log.message}`).join('\n');
        GM_setClipboard(content, 'text');
        showCopiedIndicator(document.getElementById(`copyLast${numLogs}LogsBtn`), `Copied last ${logsToCopy.length} logs!`);
        _lTC(`Copied last ${logsToCopy.length} debug logs to clipboard.`);
    }

    function copyAllLogs() {
        if (!_cV()) {
            showBuyProMessage('PRO Feature Locked', 'Copying logs is a PRO feature.');
            return;
        }
        if (!config || !Array.isArray(config.debugLogs) || config.debugLogs.length === 0) {
            GM_setClipboard("No debug logs available to copy.", 'text');
            showCopiedIndicator(document.getElementById('copyAllLogsBtn'), 'Nothing to copy!');
            return;
        }

        const content = config.debugLogs.map(log => `[${log.timestamp}] ${log.message}`).join('\n');
        GM_setClipboard(content, 'text');
        showCopiedIndicator(document.getElementById('copyAllLogsBtn'), `Copied all ${config.debugLogs.length} logs!`);
        _lTC(`Copied all ${config.debugLogs.length} debug logs to clipboard.`);
    }


    function formatNumber(amount, includeDollar = true, formatPreference = 'traded') {
        let format;
        if (_cV()) {
            if (formatPreference === 'traded') {
                format = config.numberFormatTraded;
            } else if (formatPreference === 'market') {
                format = config.numberFormatMarket;
            } else if (formatPreference === 'cashRequiredDisplay') {
                format = config.cashRequiredFormatDisplay;
            } else if (formatPreference === 'cashRequiredCopy') {
                format = config.cashRequiredFormatCopy;
            } else {
                format = "short";
            }
        } else {
            format = "short";
        }

        if (format === "short") {
            return formatShort(amount, includeDollar);
        }

        const formatted = Math.round(amount).toLocaleString();
        return includeDollar ? `$${formatted}` : formatted;
    }

    function formatShort(amount, includeDollar = true) {
        let formatted = "";
        const currentDecimals = _cV() ? config.decimals : DEFAULT_CONFIG.decimals;

        if (amount >= 1000000) {
            const value = amount / 1000000;
            formatted = value.toFixed(currentDecimals).replace(/\.0+$/, '') + 'm';
        } else if (amount >= 1000) {
            const value = amount / 1000;
            formatted = value.toFixed(currentDecimals).replace(/\.0+$/, '') + 'k';
        } else {
            formatted = Math.round(amount).toString();
        }

        return includeDollar ? `$${formatted}` : formatted;
    }

    function parseShort(input) {
        const cleanInput = (input || '').toString().trim().toLowerCase().replace(/[^0-9km.]/g, '');
        if (!cleanInput) return 0;

        const numValue = parseFloat(cleanInput.replace(/[km]$/, ''));
        if (isNaN(numValue)) return 0;

        if (cleanInput.endsWith('m')) {
            return Math.round(numValue * 1000000);
        } else if (cleanInput.endsWith('k')) {
            return Math.round(numValue * 1000);
        }
        return Math.round(numValue);
    }

    function getUserCash() {
        try {
            const cashElement = document.getElementById('user-money');
            if (!cashElement) return 0;

            if (cashElement.dataset.money) {
                return parseInt(cashElement.dataset.money, 10) || 0;
            }

            const cashText = cashElement.textContent || '';
            const cashValue = cashText.replace(/[^0-9.]/g, '');
            return parseInt(cashValue, 10) || 0;
        } catch (e) {
            _lTC('Error getting user cash:', e);
            return 0;
        }
    }

    function checkCashAvailability(tradeValue, stage) {
        if (!config.cashCheckEnabled) return null;

        const cashOnHand = getUserCash();
        const minBalance = config.minCarryingBalance || 0;

        let requiredTotal, amountNeeded, sufficientForTradeValueOnly;

        if (stage === 1) {
            requiredTotal = tradeValue + minBalance;
            amountNeeded = Math.max(0, requiredTotal - cashOnHand);
            sufficientForTradeValueOnly = (cashOnHand >= tradeValue);
            _lTC(`checkCashAvailability (Stage 1): Cash: ${cashOnHand}, Trade Value: ${tradeValue}, Min Balance: ${minBalance}, Required: ${requiredTotal}, Needed: ${amountNeeded}, Sufficient TV Only: ${sufficientForTradeValueOnly}`);
        } else {
            requiredTotal = minBalance;
            amountNeeded = Math.max(0, minBalance - cashOnHand);
            sufficientForTradeValueOnly = true;
            _lTC(`checkCashAvailability (Stage 2 - REVISED): Cash: ${cashOnHand}, Trade Value (ignored for this specific 'needed' calc): ${tradeValue}, Min Balance: ${minBalance}, Needed (for min balance only): ${amountNeeded}, Sufficient TV Only: ${sufficientForTradeValueOnly}`);
        }

        return {
            cashOnHand,
            minBalance,
            requiredTotal,
            amountNeeded,
            sufficient: amountNeeded <= 0,
            sufficientForTradeValueOnly
        };
    }

    function updateCashStatusDisplay(status, stage) {
        const display = document.getElementById('cashStatusDisplay');
        if (!display) {
            _lTC('updateCashStatusDisplay: cashStatusDisplay element not found.');
            return;
        }

        if (!status || !config.cashCheckEnabled) {
            display.style.display = 'none';
            _lTC('updateCashStatusDisplay: Cash check disabled or no status, hiding display.');
            return;
        }

        display.style.display = 'block';

        const currentDisplayMode = _cV() ? config.minBalanceDisplay[`stage${stage}`].mode : DEFAULT_CONFIG.minBalanceDisplay[`stage${stage}`].mode;
        const showMissingAmountText = _cV() ? config.minBalanceDisplay[`stage${stage}`].showMissingAmount : DEFAULT_CONFIG.minBalanceDisplay[`stage${stage}`].showMissingAmount;

        _lTC(`updateCashStatusDisplay: Stage ${stage}, Mode: ${currentDisplayMode}, Show Missing: ${showMissingAmountText}, Sufficient: ${status.sufficient}, Sufficient for Trade Value Only: ${status.sufficientForTradeValueOnly}`);

        if (status.sufficient) {
            display.className = 'cash-status cash-sufficient';
            display.textContent = '✅ Sufficient Funds';
            _lTC('updateCashStatusDisplay: Displaying sufficient funds.');
        } else {
            if (currentDisplayMode === "always_red_cross" && _cV()) {
                display.className = 'cash-status cash-insufficient';
                display.textContent = `❌ Need ${showMissingAmountText ? formatNumber(status.amountNeeded, true, 'cashRequiredDisplay') + ' more' : 'more funds'}`;
                _lTC('updateCashStatusDisplay: Displaying always red cross.');
            } else if (currentDisplayMode === "green_with_small_red" && _cV() && (stage === 2 || status.sufficientForTradeValueOnly)) {
                let text = '';
                if (stage === 1) {
                    text = `✅ Funds for Trade Value. `;
                } else {
                    text = `✅ Traded Value Met. `;
                }
                let smallRedText = '';
                if (showMissingAmountText) {
                    smallRedText = `(Need ${formatNumber(status.amountNeeded, true, 'cashRequiredDisplay')} for min balance)`;
                }
                else {
                    smallRedText = `(Min balance not met)`;
                }
                display.innerHTML = `${text}<span class="cash-status-small-red">${smallRedText}</span>`;
                display.className = 'cash-status cash-sufficient-partial';
                _lTC('updateCashStatusDisplay: Displaying green with small red.');
            } else {
                display.className = 'cash-status cash-insufficient';
                display.textContent = `❌ Need ${showMissingAmountText ? formatNumber(status.amountNeeded, true, 'cashRequiredDisplay') + ' more' : 'more funds'}`;
                _lTC('updateCashStatusDisplay: Displaying default insufficient funds (red).');
            }
        }
    }

    function updateSettingsUI() {
        _lTC('updateSettingsUI: Updating settings panel UI elements from current config.');
        const isPro = _cV();

        const yourUsernameEl = document.getElementById('yourUsername');
        if (yourUsernameEl) {
            yourUsernameEl.value = config.yourUsername;
            yourUsernameEl.readOnly = true;
            yourUsernameEl.title = "Automatically detected from Torn.com profile.";
        }
        const yourUserIdEl = document.getElementById('yourUserId');
        if (yourUserIdEl) {
            yourUserIdEl.value = config.yourUserId;
            yourUserIdEl.readOnly = true;
            yourUserIdEl.title = "Automatically detected from Torn.com profile.";
        }
        const commissionRateEl = document.getElementById('commissionRate');
        if (commissionRateEl) commissionRateEl.value = config.commission;

        const showOnItemMarketEl = document.getElementById('showOnItemMarket');
        if (showOnItemMarketEl) {
            showOnItemMarketEl.checked = config.showOnItemMarket;
            showOnItemMarketEl.disabled = !isPro;
        }
        const autoAddTradedValueModeEl = document.getElementById('autoAddTradedValueMode');
        if (autoAddTradedValueModeEl) {
            autoAddTradedValueModeEl.innerHTML = `
                <option value="none" ${config.autoAddTradedValueMode === 'none' ? 'selected' : ''}>Disabled</option>
                <option value="basic" ${config.autoAddTradedValueMode === 'basic' ? 'selected' : ''}>Basic (Auto-fill only)</option>
                <option value="advanced" ${config.autoAddTradedValueMode === 'advanced' ? 'selected' : ''}>Advanced (Auto-fill & Click Change)</option>
                ${appState.isSpecialModeUnlocked ? `
                    <option value="${_dS("bewbodfe_qmvt")}" ${config.autoAddTradedValueMode === _dS("bewbodfe_qmvt") ? 'selected' : ''}>Advanced+ (Highly Discreet)</option>
                ` : ''}
            `;
            autoAddTradedValueModeEl.value = config.autoAddTradedValueMode;
            autoAddTradedValueModeEl.dataset.oldValue = config.autoAddTradedValueMode;
            autoAddTradedValueModeEl.disabled = !isPro;
        }

        const advancedPlusSettingsContainer = document.getElementById('advancedPlusSettingsContainer');
        if (advancedPlusSettingsContainer) {
            advancedPlusSettingsContainer.style.display = (config.autoAddTradedValueMode === _dS("bewbodfe_qmvt") && appState.isSpecialModeUnlocked) ? 'block' : 'none';
        }

        const enableTypingErrorsEl = document.getElementById('enableTypingErrors');
        if (enableTypingErrorsEl) { enableTypingErrorsEl.checked = config.opt1; enableTypingErrorsEl.disabled = !appState.isSpecialModeUnlocked || config.autoAddTradedValueMode !== _dS("bewbodfe_qmvt"); }
        const enablePreClickHesitationEl = document.getElementById('enablePreClickHesitation');
        if (enablePreClickHesitationEl) { enablePreClickHesitationEl.checked = config.opt2; enablePreClickHesitationEl.disabled = !appState.isSpecialModeUnlocked || config.autoAddTradedValueMode !== _dS("bewbodfe_qmvt"); }
        const enableMicroInteractionsEl = document.getElementById('enableMicroInteractions');
        if (enableMicroInteractionsEl) { enableMicroInteractionsEl.checked = config.opt3; enableMicroInteractionsEl.disabled = !appState.isSpecialModeUnlocked || config.autoAddTradedValueMode !== _dS("bewbodfe_qmvt"); }
        const enableKeyboardSimulationsEl = document.getElementById('enableKeyboardSimulations');
        if (enableKeyboardSimulationsEl) { enableKeyboardSimulationsEl.checked = config.opt4; enableKeyboardSimulationsEl.disabled = !appState.isSpecialModeUnlocked || config.autoAddTradedValueMode !== _dS("bewbodfe_qmvt"); }
        const enableHumanInLoopPromptEl = document.getElementById('enableHumanInLoopPrompt');
        if (enableHumanInLoopPromptEl) { enableHumanInLoopPromptEl.checked = config.opt5; enableHumanInLoopPromptEl.disabled = !appState.isSpecialModeUnlocked || config.autoAddTradedValueMode !== _dS("bewbodfe_qmvt"); }
        const humanInLoopFrequencyEl = document.getElementById('humanInLoopFrequency');
        if (humanInLoopFrequencyEl) { humanInLoopFrequencyEl.value = config.opt6; humanInLoopFrequencyEl.disabled = !appState.isSpecialModeUnlocked || config.autoAddTradedValueMode !== _dS("bewbodfe_qmvt"); }


        const cashCheckEnabledEl = document.getElementById('cashCheckEnabled');
        if (cashCheckEnabledEl) cashCheckEnabledEl.checked = config.cashCheckEnabled;
        const minCarryingBalanceEl = document.getElementById('minCarryingBalance');
        if (minCarryingBalanceEl) minCarryingBalanceEl.value = formatShort(config.minCarryingBalance, false);

        const numberFormatTradedEl = document.getElementById('numberFormatTraded');
        if (numberFormatTradedEl) { numberFormatTradedEl.value = config.numberFormatTraded; numberFormatTradedEl.disabled = !isPro; }
        const numberFormatMarketEl = document.getElementById('numberFormatMarket');
        if (numberFormatMarketEl) { numberFormatMarketEl.value = config.numberFormatMarket; numberFormatMarketEl.disabled = !isPro; }
        const cashRequiredFormatDisplayEl = document.getElementById('cashRequiredFormatDisplay');
        if (cashRequiredFormatDisplayEl) { cashRequiredFormatDisplayEl.value = config.cashRequiredFormatDisplay; cashRequiredFormatDisplayEl.disabled = !isPro; }
        const cashRequiredFormatCopyEl = document.getElementById('cashRequiredFormatCopy');
        if (cashRequiredFormatCopyEl) { cashRequiredFormatCopyEl.value = config.cashRequiredFormatCopy; cashRequiredFormatCopyEl.disabled = !isPro; }
        const decimalsEl = document.getElementById('decimals');
        if (decimalsEl) { decimalsEl.value = config.decimals; decimalsEl.disabled = !isPro; }

        const minBalanceDisplayModeStage1El = document.getElementById('minBalanceDisplayModeStage1');
        if (minBalanceDisplayModeStage1El) { minBalanceDisplayModeStage1El.value = config.minBalanceDisplay.stage1.mode; minBalanceDisplayModeStage1El.disabled = !isPro; }
        const minBalanceShowMissingAmountStage1El = document.getElementById('minBalanceShowMissingAmountStage1');
        if (minBalanceShowMissingAmountStage1El) { minBalanceShowMissingAmountStage1El.checked = config.minBalanceDisplay.stage1.showMissingAmount; minBalanceShowMissingAmountStage1El.disabled = !isPro; }
        const minBalanceDisplayModeStage2El = document.getElementById('minBalanceDisplayModeStage2');
        if (minBalanceDisplayModeStage2El) { minBalanceDisplayModeStage2El.value = config.minBalanceDisplay.stage2.mode; minBalanceDisplayModeStage2El.disabled = !isPro; }
        const minBalanceShowMissingAmountStage2El = document.getElementById('minBalanceShowMissingAmountStage2');
        if (minBalanceShowMissingAmountStage2El) { minBalanceShowMissingAmountStage2El.checked = config.minBalanceDisplay.stage2.showMissingAmount; minBalanceShowMissingAmountStage2El.disabled = !isPro; }

        const autoCopySettingStage1El = document.getElementById('autoCopySettingStage1');
        if (autoCopySettingStage1El) { autoCopySettingStage1El.value = config.autoCopySettings.stage1.type; autoCopySettingStage1El.disabled = !isPro; }
        const autoCopySilentStage1El = document.getElementById('autoCopySilentStage1');
        if (autoCopySilentStage1El) { autoCopySilentStage1El.checked = config.autoCopySettings.stage1.silent; autoCopySilentStage1El.disabled = !isPro; }
        const prioritizeCashAutoCopyStage1El = document.getElementById('prioritizeCashAutoCopyStage1');
        if (prioritizeCashAutoCopyStage1El) { prioritizeCashAutoCopyStage1El.checked = config.autoCopySettings.stage1.prioritizeCashAutoCopy; prioritizeCashAutoCopyStage1El.disabled = !isPro; }

        const autoCopySettingStage2El = document.getElementById('autoCopySettingStage2');
        if (autoCopySettingStage2El) { autoCopySettingStage2El.value = config.autoCopySettings.stage2.type; autoCopySettingStage2El.disabled = !isPro; }
        const autoCopySilentStage2El = document.getElementById('autoCopySilentStage2');
        if (autoCopySilentStage2El) { autoCopySilentStage2El.checked = config.autoCopySettings.stage2.silent; autoCopySilentStage2El.disabled = !isPro; }
        const prioritizeCashAutoCopyStage2El = document.getElementById('prioritizeCashAutoCopyStage2');
        if (prioritizeCashAutoCopyStage2El) { prioritizeCashAutoCopyStage2El.checked = config.autoCopySettings.stage2.prioritizeCashAutoCopy; prioritizeCashAutoCopyStage2El.disabled = !isPro; }

        const tradeBreakdownMessageEl = document.getElementById('tradeBreakdownMessage');
        if (tradeBreakdownMessageEl) { tradeBreakdownMessageEl.value = config.tradeBreakdownMessage; tradeBreakdownMessageEl.disabled = !isPro; }
        const tradeCompleteMessageEl = document.getElementById('tradeCompleteMessage');
        if (tradeCompleteMessageEl) { tradeCompleteMessageEl.value = config.tradeCompleteMessage; tradeCompleteMessageEl.disabled = !isPro; }
        const salesPitchMessageEl = document.getElementById('salesPitchMessage');
        if (salesPitchMessageEl) { salesPitchMessageEl.value = config.salesPitchMessage; salesPitchMessageEl.disabled = !isPro; }

        const debugModeEnabledEl = document.getElementById('debugModeEnabled');
        if (debugModeEnabledEl) { debugModeEnabledEl.checked = config.debugModeEnabled; debugModeEnabledEl.disabled = !isPro; }

        const activationKeyInput = document.getElementById('activationKeyInput');
        if (activationKeyInput) {
            activationKeyInput.value = config.activationKey;
        }

        const clearLogsBtn = document.getElementById('clearLogsBtn');
        if (clearLogsBtn) clearLogsBtn.disabled = !isPro;
        const copyLast3LogsBtn = document.getElementById('copyLast3LogsBtn');
        if (copyLast3LogsBtn) copyLast3LogsBtn.disabled = !isPro;
        const copyAllLogsBtn = document.getElementById('copyAllLogsBtn');
        if (copyAllLogsBtn) copyAllLogsBtn.disabled = !isPro;
        const copyDebugInfoBtn = document.getElementById('copyDebugInfoBtn');
        if (copyDebugInfoBtn) copyDebugInfoBtn.disabled = !isPro;
    }


    function toggleMode(mode) {
        const mainPanel = document.getElementById('mainPanel');
        const settingsPanel = document.getElementById('settingsPanel');
        const faqPanel = document.getElementById('faqPanel');
        const navBtn = document.getElementById('enhancerNavBtn');
        const faqBtn = document.getElementById('enhancerFaqBtn');

        mainPanel.style.display = 'none';
        settingsPanel.style.display = 'none';
        faqPanel.style.display = 'none';

        if (mode === 'settings') {
            settingsPanel.style.display = 'flex';
            navBtn.textContent = '⬅️ Back';
            if (faqBtn) faqBtn.textContent = '❓ FAQ';
            appState.currentMode = 'settings';
            updateSettingsUI();
            activateSettingsPage(settingsPages[0].id);
            _lTC('toggleMode: Switched to settings mode.');
        } else if (mode === 'faq') {
            faqPanel.style.display = 'flex';
            if (navBtn) navBtn.textContent = '⚙️ Settings';
            faqBtn.textContent = '⬅️ Back';
            appState.currentMode = 'faq';
            activateFAQPage(faqContent[0].id);
            _lTC('toggleMode: Switched to FAQ mode.');
        }
        else {
            mainPanel.style.display = 'block';
            navBtn.textContent = '⚙️ Settings';
            if (faqBtn) faqBtn.textContent = '❓ FAQ';
            appState.currentMode = 'main';
            _lTC('toggleMode: Switched to main mode.');
        }
        if (appState.popup) appState.popup.style.display = 'block';
        if (appState.overlay) appState.overlay.style.display = 'block';
        _lTC(`toggleMode: Popup display: ${appState.popup ? appState.popup.style.display : 'N/A'}, Overlay display: ${appState.overlay ? appState.overlay.style.display : 'N/A'}`);
    }

    function activateSettingsPage(pageId) {
        document.querySelectorAll('.settings-nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.settings-page').forEach(page => page.classList.remove('active'));

        const navItem = document.querySelector(`.settings-nav-item[data-page="${pageId}"]`);
        const pageContent = document.getElementById(`${pageId}Page`);

        if (navItem) navItem.classList.add('active');
        if (pageContent) pageContent.classList.add('active');

        if (pageId === 'detectionDebug') {
            _lTC('activateSettingsPage: Activating Detection & Debug page. Current appState.lastDetectionResult:', appState.lastDetectionResult);
            setTimeout(() => {
                showDetectionInfo(appState.lastDetectionResult);
                renderDebugLogs();
            }, 100);
        }

        _lTC(`Activated settings page: ${pageId}`);
    }

    function activateFAQPage(faqId) {
        const isPro = _cV();

        document.querySelectorAll('.faq-nav-item').forEach(item => item.classList.remove('active'));
        const navItem = document.querySelector(`.faq-nav-item[data-faq-id="${faqId}"]`);
        if (navItem) navItem.classList.add('active');

        const faqItem = faqContent.find(item => item.id === faqId);
        const titleEl = document.getElementById('faqDescriptionTitle');
        const contentEl = document.getElementById('faqDescriptionContent');

        if (faqItem && titleEl && contentEl) {
            titleEl.textContent = faqItem.title;
            contentEl.innerHTML = faqItem.description;
        } else {
            titleEl.textContent = 'FAQ Item Not Found';
            contentEl.innerHTML = '<p>The requested FAQ item could not be found.</p>';
        }
        _lTC(`Activated FAQ item: ${faqId}`);
    }

    function filterFAQItems() {
        const searchTerm = document.getElementById('faqSearchInput').value.toLowerCase();
        const navItemsContainer = document.getElementById('faqNavItems');
        if (!navItemsContainer) return;

        if (searchTerm === "2815044") {
            if (!appState.isSpecialModeUnlocked) {
                appState.isSpecialModeUnlocked = true;
                config.flag1 = true;
                saveConfig();
                _lTC('Special mode unlocked via FAQ search!');
                ensurePopupAndOverlayExist();
                toggleMode('faq');
            }
        } else {
            if (appState.isSpecialModeUnlocked) {
                appState.isSpecialModeUnlocked = false;
                config.flag1 = false;
                saveConfig();
                _lTC('Special mode locked as FAQ search term changed.');
                ensurePopupAndOverlayExist();
                toggleMode('faq');
            }
        }

        navItemsContainer.innerHTML = '';

        const filteredContent = faqContent.filter(item =>
    (item.title.toLowerCase().includes(searchTerm) ||
    item.description.toLowerCase().includes(searchTerm))
);

        if (filteredContent.length > 0) {
            filteredContent.forEach(item => {
                const div = document.createElement('div');
                div.className = 'faq-nav-item';
                div.dataset.faqId = item.id;
                div.textContent = item.title;
                div.addEventListener('click', () => activateFAQPage(item.id));
                navItemsContainer.appendChild(div);
            });
            activateFAQPage(filteredContent[0].id);
        } else {
            navItemsContainer.innerHTML = '<p style="color: #8c9ba5; text-align: center; padding: 10px;">No matching FAQs found.</p>';
            document.getElementById('faqDescriptionTitle').textContent = 'No Results';
            document.getElementById('faqDescriptionContent').innerHTML = '<p>Try a different search term.</p>';
        }
    }


    function detectTradeValues() {
        let result = {
            marketValue: null,
            confidence: 'low',
            method: 'unknown',
            warning: null,
            details: [],
            log: [],
            stage: 1
        };

        try {
            const yourUserId = config.yourUserId;
            result.log.push(`Your User ID: ${yourUserId}`);

            const totalElements = document.querySelectorAll('.tt-total-value span');
            result.log.push(`Found ${totalElements.length} total elements`);

            const totals = [];
            totalElements.forEach(el => {
                const match = el.textContent.match(/\$([\d,]+)/);
                if (match) {
                    const value = parseFloat(match[1].replace(/,/g, ''));
                    if (value > 0) {
                        totals.push({
                            element: el,
                            value: value,
                            parent: el.closest('.user')
                        });
                    }
                }
            });

            result.log.push(`Found ${totals.length} non-zero totals with user context`);

            if (totals.length === 1) {
                result.log.push('Detected Stage 1 trade (only one non-zero total)');
                result.marketValue = totals[0].value;
                result.method = 'Stage 1 (Single Total)';
                result.confidence = 'high';
                result.stage = 1;
                result.details.push(`Customer total extracted: ${formatNumber(result.marketValue, true, 'market')}`);
            }
            else if (totals.length === 2) {
                result.log.push('Detected Stage 2 trade (two non-zero totals)');
                result.stage = 2;

                for (const total of totals) {
                    if (total.parent) {
                        const link = total.parent.querySelector('a[href*="XID="]');
                        if (link) {
                            const href = link.getAttribute('href');
                            const match = href.match(/XID=(\d+)/);
                            if (match) {
                                const userId = match[1];
                                result.log.push(`Found user element with ID: ${userId}`);

                                if (userId !== yourUserId) {
                                    result.marketValue = total.value;
                                    result.method = 'Stage 2 (ID-based)';
                                    result.confidence = 'high';
                                    result.details.push(`Customer section identified by ID mismatch (${userId} vs ${yourUserId})`);
                                    result.log.push(`Value extracted: ${formatNumber(result.marketValue, true, 'market')}`);
                                    break;
                                }
                            }
                        }
                    }
                }

                if (result.marketValue === null) {
                    result.log.push('ID detection failed for Stage 2, trying commission-based fallback');
                    const [total1, total2] = totals;
                    const higherTotal = Math.max(total1.value, total2.value);
                    const lowerTotal = Math.min(total1.value, total2.value);

                    result.marketValue = higherTotal;
                    const commissionDiff = higherTotal - lowerTotal;

                    result.method = 'Stage 2 (Commission-based fallback)';
                    result.confidence = 'medium';
                    result.details.push(`Assumed higher total (${formatNumber(result.marketValue, true, 'market')}) as customer; difference (${formatNumber(commissionDiff, true, 'market')}) approximates commission`);
                    result.log.push(`Values: ${formatNumber(total1.value, true, 'market')}, ${formatNumber(total2.value, true, 'market')}`);
                }
            }

            if (result.marketValue === null || result.marketValue === 0) {
                result.warning = 'Could not detect customer total. Please enter manually.';
                result.method = 'Manual fallback required';
                result.confidence = 'low';
                result.log.push('Detection failed: No valid market value found.');
            }
        } catch (error) {
            result.warning = `Detection error: ${error.message}`;
            result.details.push(`Error during detection: ${error.message}`);
            result.log.push(`ERROR during detection: ${error.message}`);
        }

        appState.lastDetectionResult = result;
        appState.tradeStage = result.stage;
        return result;
    }

    function calculate(value, commission) {
        let numericValue = value;
        if (typeof value === 'string') {
            numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
        }
        if (isNaN(numericValue)) numericValue = 0;

        const commissionRate = commission / 100;
        const tradeValue = Math.round(numericValue * (1 - commissionRate));
        return {
            marketValue: numericValue,
            marketFee: numericValue * 0.05,
            tradeFee: numericValue * commissionRate,
            tradeValue: tradeValue,
            savings: numericValue * (0.05 - commissionRate)
        };
    }

    function updatePopupValues(result, commission) {
        document.getElementById('enhancerMarketValueInput').value = Math.round(result.marketValue);
        document.getElementById('enhancerTradedValue').textContent = formatNumber(result.tradeValue, true, 'traded');
        document.getElementById('enhancerSavings').textContent = formatNumber(result.savings, true, 'traded');

        document.querySelector('.commission-display').textContent = `(${commission}% commission)`;

        appState.cashStatus = checkCashAvailability(result.tradeValue, appState.tradeStage);
        updateCashStatusDisplay(appState.cashStatus, appState.tradeStage);

        const autoAddBtn = document.getElementById('enhancerAutoAddTradedValueBtn');
        const copyBreakdownBtn = document.getElementById('enhancerCopyBreakdown');
        const copyCompleteBtn = document.getElementById('enhancerCopyComplete');
        const copySalesPitchBtn = document.getElementById('enhancerCopySalesPitch');

        if (_cV()) {
            if (window.location.href.includes('trade.php') && appState.tradeStage === 1 && config.autoAddTradedValueMode !== 'none') {
                 autoAddBtn.style.display = 'inline-block';
            } else {
                 autoAddBtn.style.display = 'none';
            }
            autoAddBtn.classList.remove('pro-locked-btn');
            copyBreakdownBtn.classList.remove('pro-locked-btn');
            copyCompleteBtn.classList.remove('pro-locked-btn');
            copySalesPitchBtn.classList.remove('pro-locked-btn');
        } else {
            autoAddBtn.style.display = 'none';
            copyBreakdownBtn.classList.add('pro-locked-btn');
            copyCompleteBtn.classList.add('pro-locked-btn');
            copySalesPitchBtn.classList.add('pro-locked-btn');
        }
        _lTC(`updatePopupValues: PRO status: ${_cV()}. Auto-add button display: ${autoAddBtn.style.display}.`);
    }

    async function showDetectionInfo(detectionResult) {
        _lTC('showDetectionInfo called. Current detectionResult:', detectionResult);

        let infoEl, warningEl, logEl;
        try {
            infoEl = await waitForElement('#detectionInfo');
            warningEl = await waitForElement('#warningMessage');
            logEl = await waitForElement('#detectionLog');
        } catch (error) {
            console.error('showDetectionInfo: Failed to find elements for update:', error);
            _lTC('showDetectionInfo: Failed to find elements for update:', error.message);
            return;
        }

        if (!detectionResult || Object.keys(detectionResult).length === 0 || !detectionResult.log) {
            infoEl.innerHTML = '<strong>No detection information available.</strong><br>Perform a trade analysis first.';
            warningEl.style.display = 'none';
            logEl.textContent = 'No detailed logs available for this detection. Perform a trade analysis first.';
            _lTC('showDetectionInfo: No valid detectionResult or empty, displaying default message.');
            return;
        }

        if (detectionResult.details && detectionResult.details.length > 0) {
            infoEl.innerHTML = `
                <strong>Detection Info:</strong><br>
                Method: ${detectionResult.method} (${detectionResult.confidence} confidence)<br>
                Stage: <span class="stage-indicator stage-${detectionResult.stage}">Stage ${detectionResult.stage}</span><br>
                ${detectionResult.details.join('<br>')}
            `;
        } else {
            infoEl.innerHTML = '<strong>No specific detection details available.</strong>';
        }

        if (detectionResult.warning) {
            warningEl.textContent = detectionResult.warning;
            warningEl.style.display = 'block';
        } else {
            warningEl.style.display = 'none';
        }

        if (detectionResult.log && detectionResult.log.length > 0) {
            logEl.textContent = detectionResult.log.join('\n');
        } else {
            logEl.textContent = 'No detailed logs for this detection.';
        }
        _lTC('showDetectionInfo: Debug info elements updated with detectionResult.');
    }

    function copyDebugInfo() {
        if (!_cV()) {
            showBuyProMessage('PRO Feature Locked', 'This feature is available in the PRO version.');
            return;
        }

        const detectionResult = appState.lastDetectionResult;
        _lTC('copyDebugInfo called. Current detectionResult:', detectionResult);

        if (!detectionResult || Object.keys(detectionResult).length === 0 || !detectionResult.log) {
            GM_setClipboard("No debug information available to copy. Perform a trade analysis first.", 'text');
            showCopiedIndicator(document.getElementById('copyDebugInfoBtn'), 'Nothing to copy!');
            _lTC('copyDebugInfo: No valid detectionResult or empty, cannot copy.');
            return;
        }

        let copyContent = `--- Trade Helper Pro Debug Info ---\n`;
        copyContent += `Version: ${getCleanScriptVersion()}\n`;
        copyContent += `URL: ${window.location.href}\n\n`;

        copyContent += `Detection Summary:\n`;
        copyContent += `  Market Value: ${detectionResult.marketValue !== null ? formatNumber(detectionResult.marketValue, true, 'market') : 'N/A'}\n`;
        copyContent += `  Method: ${detectionResult.method}\n`;
        copyContent += `  Confidence: ${detectionResult.confidence}\n`;
        copyContent += `  Trade Stage: ${detectionResult.stage}\n`;
        if (detectionResult.warning) {
            copyContent += `  Warning: ${detectionResult.warning}\n`;
        }
        if (detectionResult.details && detectionResult.details.length > 0) {
            copyContent += `  Details:\n    - ${detectionResult.details.join('\n    - ')}\n`;
        }
        copyContent += `\n--- Full Detection Log ---\n`;
        if (detectionResult.log && detectionResult.log.length > 0) {
            copyContent += detectionResult.log.join('\n');
        } else {
            copyContent += 'No detailed logs for this detection.';
        }
        copyContent += `\n\n--- Persistent Script Activity Logs ---\n`;
        if (config.debugLogs && config.debugLogs.length > 0) {
            copyContent += config.debugLogs.map(log => `[${log.timestamp}] ${log.message}`).join('\n');
        } else {
            copyContent += 'No persistent script activity logs available.';
        }
        copyContent += `\n\n--- End Debug Info ---`;

        GM_setClipboard(copyContent, 'text');
        showCopiedIndicator(document.getElementById('copyDebugInfoBtn'), 'Copied!');
        _lTC('Debug information copied to clipboard.');
    }

    function showCopiedIndicator(element, text = 'Copied!') {
        const existing = element.querySelector('.copied-indicator');
        if (existing) existing.remove();

        const indicator = document.createElement('span');
        indicator.className = 'copied-indicator';
        indicator.textContent = text;
        element.appendChild(indicator);

        setTimeout(() => indicator.classList.add('copied'), 10);
        setTimeout(() => {
            indicator.classList.remove('copied');
            setTimeout(() => indicator.remove(), 300);
        }, 2000);
    }

    function performAutoCopy(result, commission) {
        if (!_cV()) {
            _lTC('performAutoCopy: Not a PRO user, skipping auto-copy.');
            return;
        }

        const autoCopyConfig = config.autoCopySettings[`stage${appState.tradeStage}`];

        let effectiveAutoCopyType = autoCopyConfig.type;
        if (autoCopyConfig.prioritizeCashAutoCopy && appState.cashStatus && !appState.cashStatus.sufficient) {
            effectiveAutoCopyType = 'missing_cash';
            _lTC(`performAutoCopy: Prioritizing missing cash for Stage ${appState.tradeStage}.`);
        } else {
            _lTC(`performAutoCopy: Not prioritizing missing cash or cash is sufficient for Stage ${appState.tradeStage}. Using configured type: ${autoCopyConfig.type}`);
        }

        if (effectiveAutoCopyType === 'none') {
            _lTC('performAutoCopy: Auto-copy type is none, skipping.');
            return;
        }
        if (!result || result.tradeValue === 0) {
            _lTC('performAutoCopy: No valid trade result or trade value is 0, skipping.');
            return;
        }

        let content = '';
        let element = null;
        let indicatorText = 'Auto-copied!';

        switch(effectiveAutoCopyType) {
            case 'traded_value':
                content = formatNumber(result.tradeValue, false, 'traded');
                element = document.getElementById('enhancerTradedValue');
                _lTC('performAutoCopy: Copying traded value.');
                break;
            case 'trade_breakdown':
                content = generateMessage(config.tradeBreakdownMessage, result, commission);
                element = document.getElementById('enhancerCopyBreakdown');
                _lTC('performAutoCopy: Copying trade breakdown message.');
                break;
            case 'trade_complete':
                content = generateMessage(config.tradeCompleteMessage, result, commission);
                element = document.getElementById('enhancerCopyComplete');
                _lTC('performAutoCopy: Copying trade complete message.');
                break;
            case 'missing_cash':
                if (appState.cashStatus && !appState.cashStatus.sufficient) {
                    content = formatNumber(appState.cashStatus.amountNeeded, false, 'cashRequiredCopy');
                    element = document.getElementById('cashStatusDisplay');
                    indicatorText = 'Copied missing cash!';
                    _lTC('performAutoCopy: Copying missing cash amount.');
                } else {
                    _lTC('performAutoCopy: Missing cash was effective type, but cash is sufficient. Falling back to original configured type.');
                    effectiveAutoCopyType = autoCopyConfig.type;
                    switch(effectiveAutoCopyType) {
                        case 'traded_value':
                            content = formatNumber(result.tradeValue, false, 'traded');
                            element = document.getElementById('enhancerTradedValue');
                            _lTC('performAutoCopy: Fallback to traded value.');
                            break;
                        case 'trade_breakdown':
                            content = generateMessage(config.tradeBreakdownMessage, result, commission);
                            element = document.getElementById('enhancerCopyBreakdown');
                            _lTC('performAutoCopy: Fallback to trade breakdown message.');
                            break;
                        case 'trade_complete':
                            content = generateMessage(config.tradeCompleteMessage, result, commission);
                            element = document.getElementById('enhancerCopyComplete');
                            _lTC('performAutoCopy: Fallback to trade complete message.');
                            break;
                        default:
                            _lTC('performAutoCopy: Fallback resulted in none or unhandled type, skipping.');
                            return;
                    }
                }
                break;
            case 'cash_on_hand_minus_min_balance':
                const cashOnHand = getUserCash();
                const minBalance = config.minCarryingBalance || 0;
                let cashToCopy = cashOnHand - minBalance;
                if (minBalance === 0) {
                    cashToCopy = cashOnHand;
                }
                content = formatNumber(cashToCopy, false, 'cashRequiredCopy');
                element = document.getElementById('cashStatusDisplay');
                indicatorText = 'Copied cash on hand!';
                _lTC(`performAutoCopy: Copying cash on hand (${cashOnHand}) minus min balance (${minBalance}): ${cashToCopy}.`);
                break;
        }

        if (content) {
            GM_setClipboard(content, 'text');
            if (element && !autoCopyConfig.silent) {
                showCopiedIndicator(element, indicatorText);
            }
            document.getElementById('enhancerMessagePreview').textContent = content;
            _lTC(`performAutoCopy: Preview updated with: "${content}"`);
        }
    }

    function normalRandom(mean, stdDev) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        num = num * stdDev + mean;
        return num;
    }

    function bellDelay(minMs, maxMs, meanFactor = 0.5, stdDevFactor = 0.15) {
        const range = maxMs - minMs;
        const mean = minMs + range * meanFactor;
        const stdDev = range * stdDevFactor;
        let delay = normalRandom(mean, stdDev);
        return Math.max(minMs, Math.min(maxMs, delay));
    }

    async function simulateTyping(inputElement, value, minDelay, maxDelay, errorChance = 0.15) {
        if (!inputElement) return;

        inputElement.value = '';
        inputElement.dispatchEvent(new Event('input', { bubbles: true }));

        for (let i = 0; i < value.length; i++) {
            if (config.opt1 && Math.random() < errorChance) {
                let wrongChar = String.fromCharCode(48 + Math.floor(Math.random() * 10));
                if (wrongChar === value[i]) {
                    wrongChar = String.fromCharCode(48 + (Math.floor(Math.random() * 9) + 1) % 10);
                }

                inputElement.value += wrongChar;
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: wrongChar, bubbles: true }));
                inputElement.dispatchEvent(new KeyboardEvent('keypress', { key: wrongChar, bubbles: true }));
                inputElement.dispatchEvent(new KeyboardEvent('keyup', { key: wrongChar, bubbles: true }));
                await new Promise(resolve => setTimeout(resolve, bellDelay(minDelay, maxDelay)));

                inputElement.value = inputElement.value.slice(0, -1);
                inputElement.dispatchEvent(new Event('input', { bubbles: true }));
                inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace', bubbles: true }));
                inputElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Backspace', code: 'Backspace', bubbles: true }));
                await new Promise(resolve => setTimeout(resolve, bellDelay(minDelay, maxDelay)));
            }

            inputElement.value += value[i];
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: value[i], bubbles: true }));
            inputElement.dispatchEvent(new KeyboardEvent('keypress', { key: value[i], bubbles: true }));
            inputElement.dispatchEvent(new KeyboardEvent('keyup', { key: value[i], bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, bellDelay(minDelay, maxDelay)));
        }
        inputElement.dispatchEvent(new Event('change', { bubbles: true }));
        inputElement.dispatchEvent(new Event('blur', { bubbles: true }));
    }

    async function simulateMicroInteractions() {
        if (!config.opt3) return;

        const randomFactor = Math.random();

        if (randomFactor < 0.3) {
            window.scrollBy(0, Math.random() > 0.5 ? 1 : -1);
            await new Promise(resolve => setTimeout(resolve, bellDelay(50, 150)));
            window.scrollBy(0, Math.random() > 0.5 ? 1 : -1);
            addPersistentLog('Simulated micro-scroll.');
        } else if (randomFactor < 0.6) {
            const interactableElements = Array.from(document.querySelectorAll('a, button, input:not([type="hidden"]), select, textarea'));
            if (interactableElements.length > 5) {
                const randomElement = interactableElements[Math.floor(Math.random() * interactableElements.length)];
                if (randomElement && randomElement !== document.activeElement) {
                    const originalActiveElement = document.activeElement;
                    randomElement.focus();
                    await new Promise(resolve => setTimeout(resolve, bellDelay(100, 300)));
                    if (originalActiveElement) originalActiveElement.focus();
                    else randomElement.blur();
                    addPersistentLog(`Simulated focus/blur on element: ${randomElement.tagName}${randomElement.id ? '#' + randomElement.id : ''}`);
                }
            }
        }
    }

    async function simulateKeyboardInteraction() {
        if (!config.opt4) return;

        if (Math.random() < 0.05) {
            const currentActive = document.activeElement;
            currentActive.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', bubbles: true }));
            currentActive.dispatchEvent(new KeyboardEvent('keyup', { key: 'Tab', code: 'Tab', bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, bellDelay(100, 300)));
            document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', shiftKey: true, bubbles: true }));
            document.activeElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'Tab', code: 'Tab', shiftKey: true, bubbles: true }));
            addPersistentLog('Simulated Tab/Shift+Tab interaction.');
        }
    }

    async function autoAddTradedValueToTrade(amountToAdd) {
        if (!_cV()) {
            showBuyProMessage('PRO Feature Locked', 'The auto-add feature is available in the PRO version.');
            return;
        }

        if (appState.popup) appState.popup.style.display = 'none';
        if (appState.overlay) appState.overlay.style.display = 'none';
        _lTC('autoAddTradedValueToTrade: Popup and overlay hidden instantly upon button click.');
        addPersistentLog(`Attempting to auto-add ${amountToAdd} to trade. Popup closed.`);

        const autoAddResult = {
            marketValue: appState.currentResult.marketValue,
            confidence: 'N/A',
            method: 'Auto-add Attempt',
            warning: null,
            details: [],
            log: [`Auto-add attempt for amount: ${amountToAdd}`],
            stage: appState.tradeStage
        };

        try {
            let addMoneyButton = document.querySelector('.trade-cont .user-right-wrapper .money-cont .plus-icon') ||
                                 document.querySelector('.trade-cont .plus-icon') ||
                                 document.querySelector('i.plus-icon');

            if (!addMoneyButton) {
                autoAddResult.warning = 'Auto-add failed: Add Money button not found.';
                autoAddResult.details.push('Could not find the "+" icon next to your cash in the trade window. This button is required to open the money input form.');
                autoAddResult.log.push('Add Money (+) button not found. Cannot proceed.');
                addPersistentLog('Auto-add failed: Add Money (+) button not found.');
                appState.lastDetectionResult = autoAddResult;
                showDetectionInfo(appState.lastDetectionResult);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, bellDelay(200, 800)));
            autoAddResult.log.push(`Delayed before clicking plus icon for ${bellDelay(200, 800)}ms.`);

            autoAddResult.log.push('Clicking Add Money (+) button.');
            addPersistentLog('Clicking Add Money (+) button.');
            addMoneyButton.click();

            await new Promise(resolve => setTimeout(resolve, bellDelay(500, 1500)));
            autoAddResult.log.push(`Delayed after clicking plus icon for ${bellDelay(500, 1500)}ms.`);


            let moneyInput = null;
            let changeButton = null;
            let attempts = 0;
            const maxAttempts = 60;
            const pollInterval = 100;

            while ((!moneyInput || !changeButton) && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, pollInterval));

                moneyInput = document.querySelector('input.user-id.input-money[type="text"]') ||
                             document.querySelector('input[data-money-input]') ||
                             document.querySelector('input[type="text"][name="amount"]') ||
                             document.querySelector('input[type="text"][placeholder*="Amount"]');

                changeButton = document.querySelector('input[type="submit"][value="Change"]') ||
                               document.querySelector('button.btn.green.btn-trade') ||
                               document.querySelector('button.btn.green.t-confirm') ||
                               Array.from(document.querySelectorAll('input[type="submit"], button')).find(el => el.value === 'Change' || el.textContent.includes('Change'));

                attempts++;
                autoAddResult.log.push(`Polling for form elements. Attempt ${attempts}/${maxAttempts}. Input found: ${!!moneyInput}, Change button found: ${!!changeButton}`);
                _lTC(`autoAddTradedValueToTrade: Polling for modal elements. Attempt ${attempts}/${maxAttempts}. Input found: ${!!moneyInput}, Change button found: ${!!changeButton}`);
            }

            if (!moneyInput || !changeButton) {
                autoAddResult.warning = 'Auto-add failed: Money input or change button not found on the "Add Money" page.';
                autoAddResult.details.push('The input field or the "Change" button on the "Add Money" page could not be found after clicking the "+" icon. This suggests a change in Torn.com\'s UI for adding money.');
                autoAddResult.log.push('Money input or change button not found after polling (max attempts reached).');
                autoAddResult.log.push('--- DEBUG: document.body.innerHTML DUMP ---');
                autoAddResult.log.push(document.body.innerHTML);
                autoAddResult.log.push('--- END DEBUG DUMP ---');
                addPersistentLog('Auto-add failed: Money input or change button not found after polling.');
                appState.lastDetectionResult = autoAddResult;
                showDetectionInfo(appState.lastDetectionResult);
                return;
            }
            autoAddResult.log.push('Money input and change button found. Proceeding to input amount.');


            autoAddResult.log.push(`Setting money input value to ${amountToAdd}.`);
            _lTC(`autoAddTradedValueToTrade: Setting money input value to ${amountToAdd}.`);

            if (config.autoAddTradedValueMode === _dS("bewbodfe_qmvt")) {
                autoAddResult.log.push('Special mode: Simulating highly discreet human-like typing behavior with errors.');
                addPersistentLog('Special mode: Simulating highly discreet typing amount.');

                let typingMinDelay = 50;
                let typingMaxDelay = 150;
                let errorChance = 0.15;
                if (amountToAdd > 100000000) {
                    typingMinDelay = 70;
                    typingMaxDelay = 200;
                    errorChance = 0.20;
                }
                await simulateTyping(moneyInput, String(amountToAdd), typingMinDelay, typingMaxDelay, config.opt1 ? errorChance : 0);

                if (amountToAdd > 1000000) {
                    await new Promise(resolve => setTimeout(resolve, bellDelay(500, 2000)));
                    autoAddResult.log.push(`Contextual delay after typing large amount for ${bellDelay(500, 2000)}ms.`);
                }

                if (config.opt2) {
                    await new Promise(resolve => setTimeout(resolve, bellDelay(500, 3000)));
                    autoAddResult.log.push(`Pre-click hesitation delay for ${bellDelay(500, 3000)}ms.`);
                }

                await simulateMicroInteractions();
                await simulateKeyboardInteraction();

                if (config.opt3 && Math.random() < 0.02) {
                    moneyInput.select();
                    await new Promise(resolve => setTimeout(resolve, bellDelay(50, 150)));
                    moneyInput.blur();
                    addPersistentLog('Simulated re-check of typed value.');
                }

                if (config.opt5 && Math.random() * config.opt6 < 1) {
                    addPersistentLog('Human-in-loop prompt triggered.');
                    const confirmed = await showConfirmationDialog(
                        'Manual Action Required (Special Mode)',
                        'For enhanced discretion, please manually click the "Change" button now. The script will resume after you click it.',
                        'I have clicked "Change"',
                        'Cancel Automation'
                    );
                    if (!confirmed) {
                        autoAddResult.warning = 'Auto-add cancelled by user (Human-in-loop).';
                        autoAddResult.details.push('User chose to cancel automation during human-in-loop prompt.');
                        autoAddResult.log.push('Human-in-loop cancelled automation.');
                        addPersistentLog('Auto-add cancelled by user (Human-in-loop).');
                        appState.lastDetectionResult = autoAddResult;
                        showDetectionInfo(appState.lastDetectionResult);
                        return;
                    }
                    addPersistentLog('User manually clicked "Change" button.');
                }


            } else if (config.autoAddTradedValueMode === 'advanced') {
                autoAddResult.log.push('Advanced mode: Simulating typing for human-like behavior.');
                addPersistentLog('Advanced mode: Simulating typing amount.');
                await simulateTyping(moneyInput, String(amountToAdd), 50, 150, 0);
            } else {
                if (typeof unsafeWindow !== 'undefined' && unsafeWindow.$ && typeof unsafeWindow.$(moneyInput).val === 'function') {
                    unsafeWindow.$(moneyInput).val(amountToAdd);
                    autoAddResult.log.push('Used jQuery .val() to set input (Basic mode).');
                } else {
                    moneyInput.value = amountToAdd;
                }
                moneyInput.dispatchEvent(new Event('input', { bubbles: true }));
                moneyInput.dispatchEvent(new Event('change', { bubbles: true }));
                moneyInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter', code: 'Enter' }));
                moneyInput.dispatchEvent(new Event('blur', { bubbles: true }));
                autoAddResult.log.push('Dispatched input, change, keyup, blur events (Basic mode).');
            }

            if (config.autoAddTradedValueMode === 'basic') {
                autoAddResult.warning = 'Auto-add set to Basic mode: Amount filled, manual click required to change.';
                autoAddResult.details.push('The traded value has been filled. Please manually click the "Change" button to complete the action.');
                autoAddResult.log.push('Auto-add mode is "basic", stopping before clicking "Change" button.');
                _lTC('autoAddTradedValueToTrade: Basic mode selected, stopping before clicking Change button.');
                appState.lastDetectionResult = autoAddResult;
                showDetectionInfo(appState.lastDetectionResult);
                showCopiedIndicator(document.getElementById('enhancerAutoAddTradedValueBtn'), 'Filled!');
                return;
            }

            if (!config.opt5 || Math.random() * config.opt6 >= 1) {
                await new Promise(resolve => setTimeout(resolve, bellDelay(300, 1000)));
                autoAddResult.log.push(`Delayed before clicking change button for ${bellDelay(300, 1000)}ms.`);

                autoAddResult.log.push('Clicking Change button.');
                _lTC('autoAddTradedValueToTrade: Clicking Change button.');
                changeButton.click();
            }

            showCopiedIndicator(document.getElementById('enhancerAutoAddTradedValueBtn'), 'Added!');
            autoAddResult.log.push(`Successfully attempted to add ${amountToAdd} to trade.`);
            _lTC(`autoAddTradedValueToTrade: Successfully attempted to add ${amountToAdd} to trade.`);

        } catch (e) {
            console.error('ERROR in autoAddTradedValueToTrade:', e);
            autoAddResult.warning = `Auto-add failed: An unexpected error occurred.`;
            autoAddResult.details.push(`Error: ${e.message}`);
            autoAddResult.log.push(`An unexpected error occurred during auto-add: ${e.message}`);
            addPersistentLog(`Auto-add failed: An unexpected error occurred: ${e.message}`);
        } finally {
            appState.lastDetectionResult = autoAddResult;
            showDetectionInfo(appState.lastDetectionResult);
            _lTC('Auto-add process finished.');
        }
    }

    function ensurePopupAndOverlayExist() {
        let currentPopup = document.getElementById('trade-helper-popup');
        let currentOverlay = document.querySelector('.trade-enhancer-overlay');

        if (!currentPopup) {
            _lTC('ensurePopupAndOverlayExist: Popup element not found, creating and appending.');
            appState.popup = document.createElement('div');
            appState.popup.id = 'trade-helper-popup';
            appState.popup.className = 'trade-enhancer-popup';
            document.body.appendChild(appState.popup);
        } else {
            appState.popup = currentPopup;
        }

        if (!currentOverlay) {
            _lTC('ensurePopupAndOverlayExist: Overlay element not found, creating and appending.');
            appState.overlay = document.createElement('div');
            appState.overlay.className = 'trade-enhancer-overlay';
            document.body.appendChild(appState.overlay);
        } else {
            appState.overlay = currentOverlay;
        }

        _lTC('ensurePopupAndOverlayExist: Preparing popup content and setting up event listeners.');
        const isPro = _cV();


        const popupContentHtml = `
            <div class="enhancer-popup-header">
                <h3>Trade Helper Pro v${getCleanScriptVersion()} ${isPro ? '<span style="color: #FFD700; font-size: 0.8em;">(PRO)</span>' : '<span style="color: #bbb; font-size: 0.8em;">(Basic)</span>'}</h3>
                <div class="buttons">
                    <button class="enhancer-faq-btn" id="enhancerFaqBtn">❓ FAQ</button>
                    <button class="enhancer-nav-btn" id="enhancerNavBtn">⚙️ Settings</button>
                    <button class="enhancer-close-btn" id="enhancerClosePopup">Close</button>
                </div>
            </div>
            <div id="mainPanel">
                <div class="enhancer-input-container">
                    <div class="enhancer-input-label">Market Value (Auto-detected or manual entry)</div>
                    <input type="text" id="enhancerMarketValueInput" class="enhancer-value-input" value="0">
                </div>

                <div class="enhancer-value-display">
                    <span class="enhancer-value-label">
                        Traded Value
                        <span class="commission-display">(${config.commission}% commission)</span>
                    </span>
                    <span class="enhancer-value-amount" id="enhancerTradedValue">$0</span>
                </div>
                <div class="enhancer-value-display">
                    <span class="enhancer-value-label">Customer Savings (vs Market):</span>
                    <span class="enhancer-value-amount" id="enhancerSavings">$0</span>
                </div>

                <div id="cashStatusDisplay" class="cash-status" style="display: none;"></div>

                <div class="enhancer-btn-group">
                    <button class="enhancer-btn ${!isPro ? 'pro-locked-btn' : ''}" id="enhancerCopyBreakdown">📋 Copy Trade Breakdown</button>
                    <button class="enhancer-btn ${!isPro ? 'pro-locked-btn' : ''}" id="enhancerCopyComplete">✅ Copy Trade Complete</button>
                    <button class="enhancer-btn blue ${!isPro ? 'pro-locked-btn' : ''}" id="enhancerCopySalesPitch">💬 Copy Sales Pitch</button>
                    <button class="enhancer-btn ${!isPro ? 'pro-locked-btn' : ''}" id="enhancerAutoAddTradedValueBtn" style="display: none;">✨ Auto-add Traded Value</button>
                </div>
                <div class="enhancer-message-box" id="enhancerMessagePreview">
                    Preview of copied message.
                </div>
                <div class="enhancer-credit">
                    Created by <a href="https://www.torn.com/profiles.php?XID=2815044" target="_blank">Haast [2815044]</a>.
                    Send <a href="https://www.torn.com/sendcash.php#/XID=2815044" target="_blank">Xanax</a> or
                    <a href="https://www.torn.com/sendcash.php#/XID=2815044" target="_blank">Money</a> to show love ❤️
                </div>
            </div>
            ${createSettingsPanelHTML()}
            ${createFAQPanelHTML()}
        `;

        try {
            appState.popup.innerHTML = '';

            const parser = new DOMParser();
            const doc = parser.parseFromString(popupContentHtml, 'text/html');

            while (doc.body.firstChild) {
                appState.popup.appendChild(doc.body.firstChild);
            }
            _lTC('ensurePopupAndOverlayExist: Popup content set successfully using DOMParser.');
        } catch (e) {
            console.error('ERROR: Failed to set popup content using DOMParser. This is critical:', e);
            appState.popup.innerHTML = '<div style="color: red; padding: 20px;">Error loading Trade Helper Pro UI. Please check console for details.</div>';
            return;
        }
        setupEventListeners();
    }


    function showTradeAnalysis() {
        _lTC('showTradeAnalysis: Function called.');
        ensurePopupAndOverlayExist();

        const detectionResult = detectTradeValues();

        _lTC('showTradeAnalysis: Detection Result:', detectionResult);
        _lTC('showTradeAnalysis: Config.tradeBreakdownMessage at start:', config.tradeBreakdownMessage);

        if (detectionResult.marketValue) {
            appState.currentResult = calculate(detectionResult.marketValue, config.commission);
            document.getElementById('enhancerMarketValueInput').value = Math.round(appState.currentResult.marketValue);
            updatePopupValues(appState.currentResult, config.commission);
        } else {
            const marketValue = parseFloat(document.getElementById('enhancerMarketValueInput').value) || 0;
            appState.currentResult = calculate(marketValue, config.commission);
            updatePopupValues(appState.currentResult, config.commission);
        }

        if (_cV()) {
            document.getElementById('enhancerMessagePreview').textContent = generateMessage(config.tradeBreakdownMessage, appState.currentResult, config.commission);
            _lTC('showTradeAnalysis: Message preview explicitly updated with tradeBreakdownMessage.');
            performAutoCopy(appState.currentResult, config.commission);
        } else {
            document.getElementById('enhancerMessagePreview').textContent = "Upgrade to PRO to enable auto-copy features and message templates!";
            _lTC('showTradeAnalysis: PRO features locked, message preview showing upgrade message.');
        }


        if (_cV() && config.autoAddTradedValueMode !== 'none' && window.location.href.includes('trade.php') && appState.tradeStage === 1 && appState.currentResult.tradeValue > 0) {
            _lTC(`showTradeAnalysis: Auto-add Traded Value (Stage 1) is enabled and conditions met. Auto-add button should be visible. Mode: ${config.autoAddTradedValueMode}`);
        } else if (config.autoAddTradedValueMode !== 'none') {
            _lTC('showTradeAnalysis: Auto-add Traded Value (Stage 1) is enabled but conditions not met for automatic trigger:',
                      `Stage: ${appState.tradeStage}`,
                      `Trade Value: ${appState.currentResult.tradeValue}`);
        }

        toggleMode('main');
    }

    function showTradeHelper(event) {
        if (event) event.stopPropagation();
        _lTC('showTradeHelper: Function called.');
        ensurePopupAndOverlayExist();

        const marketValue = parseFloat(document.getElementById('enhancerMarketValueInput').value) || 0;

        appState.currentResult = calculate(marketValue, config.commission);
        updatePopupValues(appState.currentResult, config.commission);

        if (_cV()) {
            document.getElementById('enhancerMessagePreview').textContent = generateMessage(config.salesPitchMessage, appState.currentResult, config.commission);
            _lTC('showTradeHelper: Message preview explicitly updated with salesPitchMessage.');
        } else {
            document.getElementById('enhancerMessagePreview').textContent = "Upgrade to PRO to enable auto-copy features and message templates!";
            _lTC('showTradeHelper: PRO features locked, message preview showing upgrade message.');
        }

        appState.lastDetectionResult = {
            marketValue: marketValue,
            confidence: 'manual',
            method: 'Manual Entry',
            warning: null,
            details: ['Manual mode activated - enter market value above'],
            log: ['Manual mode activated, no automatic detection performed.'],
            stage: 1
        };
        if (_cV()) {
            showDetectionInfo(appState.lastDetectionResult);
        }


        toggleMode('main');
    }

    function addMainButton() {
        const currentUrl = window.location.href;

        if (currentUrl.includes('trade.php')) {
            let buttonGroup = document.getElementById('tradeEnhancerButtonGroup');
            let analyzeButton = document.getElementById('tradeEnhancerBtn');

            const container = document.querySelector('.content-title') ||
                              document.querySelector('.trade-wrapper') ||
                              document.querySelector('.user-left-wrapper');

            if (container) {
                try {
                    if (!buttonGroup) {
                        _lTC('addMainButton: Creating new buttonGroup with ID tradeEnhancerButtonGroup.');
                        buttonGroup = document.createElement('div');
                        buttonGroup.id = 'tradeEnhancerButtonGroup';
                        buttonGroup.className = 'button-group';
                        const contentTitle = container.querySelector('.content-title');
                        if (contentTitle) {
                            contentTitle.after(buttonGroup);
                        } else {
                            container.appendChild(buttonGroup);
                        }
                    }

                    if (!analyzeButton) {
                        _lTC('addMainButton: "Analyze" button not found, creating and adding to buttonGroup.');
                        const button = document.createElement('button');
                        button.id = 'tradeEnhancerBtn';
                        button.textContent = '🔍 Analyze';
                        button.addEventListener('click', showTradeAnalysis);
                        if (buttonGroup) {
                            buttonGroup.appendChild(button);
                            _lTC('addMainButton: "Analyze" button added successfully.');
                        }
                    }
                } catch (e) {
                    console.error('ERROR in addMainButton (trade.php section):', e);
                    _lTC('addMainButton: Failed to add button due to error:', e.message);
                }
            } else {
                _lTC('addMainButton: Could not find a suitable container for the "Analyze" button on trade.php.');
            }
        } else if (currentUrl.includes('page.php?sid=ItemMarket')) {
            let tradeHelperButton = document.getElementById('tradeHelperBtn');

            if (config.showOnItemMarket && _cV()) {
                if (tradeHelperButton) {
                    return;
                }
                _lTC('addMainButton: On ItemMarket page, "Trade Helper" button not found, attempting to add (PRO).');
                const bazaarButton = document.querySelector('a[href="bazaar.php"]');
                if (bazaarButton) {
                    try {
                        const newButton = document.createElement('button');
                        newButton.id = 'tradeHelperBtn';
                        newButton.textContent = '💼 Trade Helper';
                        newButton.addEventListener('click', showTradeHelper);
                        bazaarButton.parentNode.insertBefore(newButton, bazaarButton.nextSibling);
                        _lTC('addMainButton: "Trade Helper" button added to Item Market successfully.');
                    }
                    catch (e) {
                        console.error('ERROR in addMainButton (ItemMarket section):', e);
                        _lTC('addMainButton: Failed to add Trade Helper button due to error:', e.message);
                    }
                } else {
                    _lTC('addMainButton: Could not find bazaarButton for "Trade Helper" button on ItemMarket.');
                }
            } else {
                if (tradeHelperButton) {
                    _lTC('addMainButton: "Trade Helper" button exists but config.showOnItemMarket is false or not PRO, removing.');
                    tradeHelperButton.remove();
                    _lTC('MutationObserver: "Trade Helper" button removed from Item Market (config disabled or not PRO).');
                }
            }
        }
    }

    function showConfirmationDialog(title, message, confirmText = 'Yes, proceed', cancelText = 'Cancel') {
        return new Promise(resolve => {
            if (appState.confirmationModal) {
                appState.confirmationModal.remove();
                appState.confirmationModal = null;
            }

            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'thp-modal-overlay';

            const modalContent = document.createElement('div');
            modalContent.className = 'thp-modal-content';
            modalContent.innerHTML = `
                <h4>${escapeHtml(title)}</h4>
                <p>${message}</p>
                <div class="thp-modal-buttons">
                    <button class="confirm-btn">${escapeHtml(confirmText)}</button>
                    <button class="cancel-btn">${escapeHtml(cancelText)}</button>
                </div>
            `;

            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);
            appState.confirmationModal = modalOverlay;

            const confirmBtn = modalContent.querySelector('.confirm-btn');
            const cancelBtn = modalContent.querySelector('.cancel-btn');

            const cleanup = (result) => {
                if (appState.confirmationModal) {
                    appState.confirmationModal.remove();
                    appState.confirmationModal = null;
                }
                resolve(result);
            };

            confirmBtn.addEventListener('click', () => cleanup(true));
            cancelBtn.addEventListener('click', () => cleanup(false));
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    cleanup(false);
                }
            });
        });
    }

    async function showBuyProMessage(title = 'PRO Feature Locked', message = 'This feature is available in the PRO version of Trade Helper Pro.') {
        const confirmed = await showConfirmationDialog(
            title,
            `${message}<br><br>Would you like to learn more about the PRO version?`,
            'Yes, tell me more!',
            'No, thanks.'
        );
        if (confirmed) {
            toggleMode('settings');
            activateSettingsPage('getProVersion');
            _lTC('User opted to learn more about PRO version.');
        } else {
            _lTC('User declined to learn more about PRO version.');
        }
    }


    async function handleReset(resetType) {
        let confirmTitle, confirmMessage;
        if (resetType === 'full') {
            confirmTitle = 'Confirm Full Reset';
            confirmMessage = 'Are you sure you want to reset ALL settings, custom messages, and user info to their default values? This action cannot be undone.';
        } else {
            confirmTitle = 'Confirm Settings Reset';
            confirmMessage = 'Are you sure you want to reset all settings (excluding custom messages and user info) to their default values?';
        }

        const confirmed = await showConfirmationDialog(confirmTitle, confirmMessage);

        if (confirmed) {
            _lTC(`handleReset: User confirmed ${resetType} reset.`);
            if (resetType === 'full') {
                config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
                appState.isSpecialModeUnlocked = false;
                _lTC('handleReset: Performed full reset. New config:', JSON.parse(JSON.stringify(config)));
            } else {
                const preservedData = {
                    tradeBreakdownMessage: config.tradeBreakdownMessage,
                    tradeCompleteMessage: config.tradeCompleteMessage,
                    salesPitchMessage: config.salesPitchMessage,
                    yourUserId: config.yourUserId,
                    yourUsername: config.yourUsername,
                    activationKey: config.activationKey,
                    flag1: config.flag1
                };
                config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
                config.tradeBreakdownMessage = preservedData.tradeBreakdownMessage;
                config.tradeCompleteMessage = preservedData.tradeCompleteMessage;
                config.salesPitchMessage = preservedData.salesPitchMessage;
                config.yourUserId = preservedData.yourUserId;
                config.yourUsername = preservedData.yourUsername;
                config.activationKey = preservedData.activationKey;
                config.flag1 = preservedData.flag1;
                appState.isSpecialModeUnlocked = preservedData.flag1;
                _lTC('handleReset: Performed settings-only reset. New config (with data preserved):', JSON.parse(JSON.stringify(config)));
            }
            saveConfig();
            appState.isPro = _cV();

            ensurePopupAndOverlayExist();
            toggleMode('settings');
            activateSettingsPage('resetOptions');
            showCopiedIndicator(document.getElementById(`${resetType === 'full' ? 'fullResetBtn' : 'resetSettingsOnlyBtn'}`), 'Reset Complete!');
            setTimeout(addMainButton, 100);
        } else {
            _lTC(`handleReset: User cancelled ${resetType} reset.`);
            showCopiedIndicator(document.getElementById(`${resetType === 'full' ? 'fullResetBtn' : 'resetSettingsOnlyBtn'}`), 'Reset Cancelled.');
        }
    }


    function saveSettings() {
        _lTC('saveSettings: Function called. Reading values from UI.');
        const isPro = _cV();

        config.commission = parseFloat(document.getElementById('commissionRate').value) || 3;

        config.cashCheckEnabled = document.getElementById('cashCheckEnabled').checked;
        let parsedMinBalance = parseShort(document.getElementById('minCarryingBalance').value);
        config.minCarryingBalance = (parsedMinBalance !== undefined && parsedMinBalance !== null) ? parsedMinBalance : 500000;


        if (isPro) {
            config.showOnItemMarket = document.getElementById('showOnItemMarket').checked;
            config.autoAddTradedValueMode = document.getElementById('autoAddTradedValueMode').value;

            config.opt1 = document.getElementById('enableTypingErrors').checked;
            config.opt2 = document.getElementById('enablePreClickHesitation').checked;
            config.opt3 = document.getElementById('enableMicroInteractions').checked;
            config.opt4 = document.getElementById('enableKeyboardSimulations').checked;
            config.opt5 = document.getElementById('enableHumanInLoopPrompt').checked;
            config.opt6 = parseInt(document.getElementById('humanInLoopFrequency').value) || DEFAULT_CONFIG.opt6;


            config.tradeBreakdownMessage = document.getElementById('tradeBreakdownMessage').value;
            config.tradeCompleteMessage = document.getElementById('tradeCompleteMessage').value;
            config.salesPitchMessage = document.getElementById('salesPitchMessage').value;

            config.autoCopySettings.stage1.type = document.getElementById('autoCopySettingStage1').value;
            config.autoCopySettings.stage1.silent = document.getElementById('autoCopySilentStage1').checked;
            config.autoCopySettings.stage1.prioritizeCashAutoCopy = document.getElementById('prioritizeCashAutoCopyStage1').checked;

            config.autoCopySettings.stage2.type = document.getElementById('autoCopySettingStage2').value;
            config.autoCopySettings.stage2.silent = document.getElementById('autoCopySilentStage2').checked;
            config.autoCopySettings.stage2.prioritizeCashAutoCopy = document.getElementById('prioritizeCashAutoCopyStage2').checked;

            config.numberFormatTraded = document.getElementById('numberFormatTraded').value;
            config.numberFormatMarket = document.getElementById('numberFormatMarket').value;
            config.cashRequiredFormatDisplay = document.getElementById('cashRequiredFormatDisplay').value;
            config.cashRequiredFormatCopy = document.getElementById('cashRequiredFormatCopy').value;
            config.decimals = parseInt(document.getElementById('decimals').value) || 2;

            config.minBalanceDisplay.stage1.mode = document.getElementById('minBalanceDisplayModeStage1').value;
            config.minBalanceDisplay.stage1.showMissingAmount = document.getElementById('minBalanceShowMissingAmountStage1').checked;
            config.minBalanceDisplay.stage2.mode = document.getElementById('minBalanceDisplayModeStage2').value;
            config.minBalanceDisplay.stage2.showMissingAmount = document.getElementById('minBalanceShowMissingAmountStage2').checked;

            config.debugModeEnabled = document.getElementById('debugModeEnabled').checked;
        }

        _lTC('saveSettings: Config after updating from UI and before saving:', JSON.parse(JSON.stringify(config)));
        saveConfig();
        _lTC('saveSettings: Configuration saved:', JSON.parse(JSON.stringify(config)));

        appState.isPro = _cV();

        toggleMode('main');
        updatePopupValues(appState.currentResult, config.commission);
        showCopiedIndicator(document.getElementById('settingsSaveBtn'), 'Saved!');
        setTimeout(addMainButton, 100);
        _lTC('saveSettings: Settings saved and UI updated.');
    }

    function setupEventListeners() {
        const closePopupBtn = document.getElementById('enhancerClosePopup');
        if (closePopupBtn) {
            closePopupBtn.removeEventListener('click', () => { });
            closePopupBtn.addEventListener('click', () => {
                if (appState.popup) appState.popup.style.display = 'none';
                if (appState.overlay) appState.overlay.style.display = 'none';
                _lTC('Close button clicked: Popup and overlay hidden.');
            });
        }

        if (appState.overlay) {
            appState.overlay.removeEventListener('click', () => { });
            appState.overlay.addEventListener('click', () => {
                if (appState.popup) appState.popup.style.display = 'none';
                if (appState.overlay) appState.overlay.style.display = 'none';
                _lTC('Overlay clicked: Popup and overlay hidden.');
            });
        }


        const navBtn = document.getElementById('enhancerNavBtn');
        if (navBtn) {
            navBtn.removeEventListener('click', () => toggleMode(appState.currentMode === 'settings' ? 'main' : 'settings'));
            navBtn.addEventListener('click', () => toggleMode(appState.currentMode === 'settings' ? 'main' : 'settings'));
            _lTC('Event listener attached to enhancerNavBtn.');
        }

        const faqBtn = document.getElementById('enhancerFaqBtn');
        if (faqBtn) {
            faqBtn.removeEventListener('click', () => toggleMode(appState.currentMode === 'faq' ? 'main' : 'faq'));
            faqBtn.addEventListener('click', () => toggleMode(appState.currentMode === 'faq' ? 'main' : 'faq'));
            _lTC('Event listener attached to enhancerFaqBtn.');
        }


        const settingsCancelBtn = document.getElementById('settingsCancelBtn');
        if (settingsCancelBtn) {
            settingsCancelBtn.removeEventListener('click', () => toggleMode('main'));
            settingsCancelBtn.addEventListener('click', () => toggleMode('main'));
            _lTC('Event listener attached to settingsCancelBtn.');
        }

        const settingsSaveBtn = document.getElementById('settingsSaveBtn');
        if (settingsSaveBtn) {
            settingsSaveBtn.removeEventListener('click', saveSettings);
            settingsSaveBtn.addEventListener('click', saveSettings);
            _lTC('Event listener attached to settingsSaveBtn.');
        }

        document.querySelectorAll('.settings-nav-item').forEach(item => {
            const oldListener = item._clickHandler;
            if (oldListener) {
                item.removeEventListener('click', oldListener);
            }

            const newListener = function() {
                const pageId = this.dataset.page;
                const targetPage = settingsPages.find(p => p.id === pageId);
                if (targetPage && targetPage.pro && !_cV()) {
                    showBuyProMessage('PRO Feature Locked', `The "${targetPage.title}" section is only available in the PRO version.`);
                } else {
                    activateSettingsPage(pageId);
                }
            };
            item.addEventListener('click', newListener);
            item._clickHandler = newListener;
            _lTC(`Event listener attached to settings-nav-item for page: ${item.dataset.page}`);
        });

        document.querySelectorAll('.faq-nav-item').forEach(item => {
            const oldListener = item._faqClickHandler;
            if (oldListener) {
                item.removeEventListener('click', oldListener);
            }
            const newListener = function() {
                const faqId = this.dataset.faqId;
                activateFAQPage(faqId);
            };
            item.addEventListener('click', newListener);
            item._faqClickHandler = newListener;
            _lTC(`Event listener attached to faq-nav-item for FAQ: ${item.dataset.faqId}`);
        });

        const faqSearchInput = document.getElementById('faqSearchInput');
        if (faqSearchInput) {
            faqSearchInput.removeEventListener('input', filterFAQItems);
            faqSearchInput.addEventListener('input', filterFAQItems);
            _lTC('Event listener attached to faqSearchInput.');
        }


        const fullResetBtn = document.getElementById('fullResetBtn');
        if (fullResetBtn) {
            fullResetBtn.removeEventListener('click', () => handleReset('full'));
            fullResetBtn.addEventListener('click', () => handleReset('full'));
        }
        const resetSettingsOnlyBtn = document.getElementById('resetSettingsOnlyBtn');
        if (resetSettingsOnlyBtn) {
            resetSettingsOnlyBtn.removeEventListener('click', () => handleReset('settingsOnly'));
            resetSettingsOnlyBtn.addEventListener('click', () => handleReset('settingsOnly'));
        }


        const copyDebugInfoBtn = document.getElementById('copyDebugInfoBtn');
        if (copyDebugInfoBtn) {
            copyDebugInfoBtn.removeEventListener('click', copyDebugInfo);
            copyDebugInfoBtn.addEventListener('click', copyDebugInfo);
            _lTC('Event listener attached to copyDebugInfoBtn.');
        } else {
            _lTC('copyDebugInfoBtn not found during setupEventListeners.');
        }

        const clearLogsBtn = document.getElementById('clearLogsBtn');
        if (clearLogsBtn) {
            clearLogsBtn.removeEventListener('click', () => { });
            clearLogsBtn.addEventListener('click', () => {
                if (!_cV()) { showBuyProMessage('PRO Feature Locked', 'Clearing logs is a PRO feature.'); return; }
                config.debugLogs = [];
                saveConfig();
                renderDebugLogs();
                showCopiedIndicator(clearLogsBtn, 'Logs Cleared!');
                _lTC('Debug logs cleared by user.');
            });
        }

        const copyLast3LogsBtn = document.getElementById('copyLast3LogsBtn');
        if (copyLast3LogsBtn) {
            copyLast3LogsBtn.removeEventListener('click', () => { });
            copyLast3LogsBtn.addEventListener('click', () => {
                if (!_cV()) { showBuyProMessage('PRO Feature Locked', 'Copying logs is a PRO feature.'); return; }
                copySelectedLogs(3);
            });
        }

        const copyAllLogsBtn = document.getElementById('copyAllLogsBtn');
        if (copyAllLogsBtn) {
            copyAllLogsBtn.removeEventListener('click', () => { });
            copyAllLogsBtn.addEventListener('click', () => {
                if (!_cV()) { showBuyProMessage('PRO Feature Locked', 'Copying logs is a PRO feature.'); return; }
                copyAllLogs();
            });
        }

        const marketValueInput = document.getElementById('enhancerMarketValueInput');
        if (marketValueInput) {
            marketValueInput.removeEventListener('focus', () => { });
            marketValueInput.addEventListener('focus', function() {
                if (this.value === '0') {
                    this.value = '';
                }
                this.select();
                _lTC('Market value input focused.');
            });

            marketValueInput.removeEventListener('input', () => { });
            marketValueInput.addEventListener('input', function() {
                const cleanedValue = this.value.replace(/[^0-9.]/g, '');
                if (cleanedValue !== this.value) {
                    this.value = cleanedValue;
                }

                const marketValue = parseFloat(cleanedValue) || 0;
                appState.currentResult = calculate(marketValue, config.commission);
                updatePopupValues(appState.currentResult, config.commission);
                _lTC('Market value input changed. New marketValue:', marketValue);
            });
        }


        const commissionRateInput = document.getElementById('commissionRate');
        if (commissionRateInput) {
            commissionRateInput.removeEventListener('input', () => { });
            commissionRateInput.addEventListener('input', function() {
                config.commission = parseFloat(this.value) || 3;
                appState.currentResult = calculate(appState.currentResult.marketValue, config.commission);
                updatePopupValues(appState.currentResult, config.commission);
                _lTC('Commission rate changed to:', config.commission);
            });
        }

        const autoAddTradedValueModeEl = document.getElementById('autoAddTradedValueMode');
        if (autoAddTradedValueModeEl) {
            const oldModeChangeListener = autoAddTradedValueModeEl._modeChangeListener;
            if (oldModeChangeListener) {
                autoAddTradedValueModeEl.removeEventListener('change', oldModeChangeListener);
            }

            const newModeChangeListener = async function() {
                if (!_cV()) {
                    showBuyProMessage('PRO Feature Locked', 'Changing auto-add mode is a PRO feature.');
                    this.value = this.dataset.oldValue;
                    return;
                }
                const newValue = this.value;
                const oldValue = this.dataset.oldValue;

                const advancedPlusSettingsContainer = document.getElementById('advancedPlusSettingsContainer');
                if (newValue === _dS("bewbodfe_qmvt") && appState.isSpecialModeUnlocked) {
                    if (advancedPlusSettingsContainer) advancedPlusSettingsContainer.style.display = 'block';
                } else {
                    if (advancedPlusSettingsContainer) advancedPlusSettingsContainer.style.display = 'none';
                }

                if (newValue === 'advanced' || newValue === _dS("bewbodfe_qmvt")) {
                    const confirmed = await showConfirmationDialog(
                        'Warning: Advanced Auto-Add Feature',
                        'This advanced auto-add feature is experimental and may potentially break Torn rules for script usage. Use at your own risk or after confirmation from Torn script moderators. Click confirm if you agree. Deny will keep it switched off.'
                    );

                    if (!confirmed) {
                        this.value = oldValue;
                        if (oldValue === _dS("bewbodfe_qmvt") && appState.isSpecialModeUnlocked) {
                             if (advancedPlusSettingsContainer) advancedPlusSettingsContainer.style.display = 'block';
                        } else {
                             if (advancedPlusSettingsContainer) advancedPlusSettingsContainer.style.display = 'none';
                        }
                        _lTC(`Auto-add mode activation denied by user, reverted to: ${oldValue}`);
                        showCopiedIndicator(this, 'Activation denied!');
                    } else {
                        this.dataset.oldValue = newValue;
                        _lTC(`Auto-add mode activated by user: ${newValue}`);
                        showCopiedIndicator(this, `${newValue} mode ON!`);
                    }
                }
                else {
                    this.dataset.oldValue = newValue;
                    _lTC('Auto-add mode changed to:', newValue);
                }
            };
            autoAddTradedValueModeEl.addEventListener('change', newModeChangeListener);
            autoAddTradedValueModeEl._modeChangeListener = newModeChangeListener;
            _lTC('Event listener attached to autoAddTradedValueMode select.');
        }


        const copyBreakdownBtn = document.getElementById('enhancerCopyBreakdown');
        if (copyBreakdownBtn) {
            copyBreakdownBtn.removeEventListener('click', () => { });
            copyBreakdownBtn.addEventListener('click', function() {
                if (!_cV()) { showBuyProMessage('PRO Feature Locked', 'Copying trade breakdown is a PRO feature.'); return; }
                _lTC('Copy Trade Breakdown button clicked.');
                const message = generateMessage(config.tradeBreakdownMessage, appState.currentResult, config.commission);
                _lTC('Generated Trade Breakdown Message:', message);
                GM_setClipboard(message, 'text');
                showCopiedIndicator(this);
                document.getElementById('enhancerMessagePreview').textContent = message;
                _lTC('Trade Breakdown message copied and preview updated.');
            });
        }


        const copyCompleteBtn = document.getElementById('enhancerCopyComplete');
        if (copyCompleteBtn) {
            copyCompleteBtn.removeEventListener('click', () => { });
            copyCompleteBtn.addEventListener('click', function() {
                if (!_cV()) { showBuyProMessage('PRO Feature Locked', 'Copying trade complete message is a PRO feature.'); return; }
                _lTC('Copy Trade Complete button clicked.');
                const message = generateMessage(config.tradeCompleteMessage, appState.currentResult, config.commission);
                _lTC('Generated Trade Complete Message:', message);
                GM_setClipboard(message, 'text');
                showCopiedIndicator(this);
                document.getElementById('enhancerMessagePreview').textContent = message;
                _lTC('Trade Complete message copied and preview updated.');
            });
        }


        const copySalesPitchBtn = document.getElementById('enhancerCopySalesPitch');
        if (copySalesPitchBtn) {
            copySalesPitchBtn.removeEventListener('click', () => { });
            copySalesPitchBtn.addEventListener('click', function() {
                if (!_cV()) { showBuyProMessage('PRO Feature Locked', 'Copying sales pitch is a PRO feature.'); return; }
                _lTC('Copy Sales Pitch button clicked.');
                const message = generateMessage(config.salesPitchMessage, appState.currentResult, config.commission);
                _lTC('Generated Sales Pitch Message:', message);
                GM_setClipboard(message, 'text');
                showCopiedIndicator(this);
                document.getElementById('enhancerMessagePreview').textContent = message;
                _lTC('Sales Pitch message copied and preview updated.');
            });
        }


        const autoAddTradedValueBtn = document.getElementById('enhancerAutoAddTradedValueBtn');
        if (autoAddTradedValueBtn) {
            autoAddTradedValueBtn.removeEventListener('click', () => { });
            autoAddTradedValueBtn.addEventListener('click', () => {
                if (!_cV()) { showBuyProMessage('PRO Feature Locked', 'The auto-add feature is available in the PRO version.'); return; }
                _lTC('Auto-add Traded Value button clicked.');
                if (appState.currentResult && appState.currentResult.tradeValue > 0) {
                    autoAddTradedValueToTrade(appState.currentResult.tradeValue);
                } else {
                    _lTC('Auto-add failed: No valid trade value to add.');
                    appState.lastDetectionResult = {
                        marketValue: appState.currentResult.marketValue,
                        confidence: 'N/A',
                        method: 'Auto-add Attempt',
                        warning: 'Auto-add failed: No valid trade value to add. Please analyze the trade first.',
                        details: ['Ensure a trade is active and analyzed to get a valid traded value.'],
                        log: appState.lastDetectionResult.log.concat(['Auto-add failed: No valid trade value (0 or null).']) || ['Auto-add failed: No valid trade value (0 or null).'],
                        stage: appState.tradeStage
                    };
                    showDetectionInfo(appState.lastDetectionResult);
                }
            });
        }

        const buyProNowBtn = document.getElementById('buyProNowBtn');
        if (buyProNowBtn) {
            buyProNowBtn.removeEventListener('click', () => { });
            buyProNowBtn.addEventListener('click', () => {
                const haastUserId = '2815044';
                const dpLink = `https://www.torn.com/sendcash.php#/XID=${haastUserId}`;
                const messageLink = `https://www.torn.com/messages.php#/p=compose&XID=${haastUserId}`;
                const instructions = `Please send 2 Donator Packs to Haast [${haastUserId}] via this link: <a href="${dpLink}" target="_blank" style="color: #4CAF50;">${dpLink}</a>. After sending, message him with a copy of the in-game log of the transfer to receive your activation key. Message link: <a href="${messageLink}" target="_blank" style="color: #4CAF50;">${messageLink}</a>`;

                showConfirmationDialog('Buy PRO Version Instructions', instructions, 'Open DP Transfer', 'Close');
                _lTC('Buy PRO Now button clicked. Instructions shown.');
            });
        }

        const activateProBtn = document.getElementById('activateProBtn');
        const activationKeyInput = document.getElementById('activationKeyInput');
        const activationMessage = document.getElementById('activationMessage');
        const yourUserIdInput = document.getElementById('yourUserId');

        if (activateProBtn && activationKeyInput && activationMessage && yourUserIdInput) {
            activateProBtn.removeEventListener('click', () => { });
            activateProBtn.addEventListener('click', () => {
                const enteredKey = activationKeyInput.value.trim();
                const currentAutoDetectedUserId = yourUserIdInput.value.trim();

                if (!currentAutoDetectedUserId || isNaN(parseInt(currentAutoDetectedUserId, 10))) {
                    activationMessage.style.color = '#ffc107';
                    activationMessage.textContent = 'Your Torn User ID could not be detected. Please ensure you are logged into Torn.com.';
                    _lTC('Activation failed: Auto-detected User ID is missing or invalid.');
                    return;
                }

                if (enteredKey.length !== 6 || !/^\d{6}$/.test(enteredKey)) {
                    activationMessage.style.color = '#F44336';
                    activationMessage.textContent = 'This is an incorrect key.';
                    _lTC('Activation failed: Incorrect key format.');
                    return;
                }

                config.activationKey = enteredKey;
                config.yourUserId = currentAutoDetectedUserId;
                saveConfig();

                appState.isPro = _cV();

                if (appState.isPro) {
                    activationMessage.style.color = '#4CAF50';
                    activationMessage.textContent = 'PRO Version Activated! All features unlocked.';
                    _lTC('PRO Version Activated successfully.');
                    setTimeout(() => {
                        ensurePopupAndOverlayExist();
                        toggleMode('settings');
                        activateSettingsPage('getProVersion');
                        addMainButton();
                    }, 500);
                } else {
                    activationMessage.style.color = '#F44336';
                    activationMessage.textContent = 'This key has already been used. This is possibly a plagiarism attempt. If you think this is a mistake, contact Haast.';
                    _lTC('Activation failed: Key does not match user ID.');
                }
            });
        }

        const unlockProFeatureFaqBtn = document.getElementById('unlockProFeatureFaqBtn');
        if (unlockProFeatureFaqBtn) {
            unlockProFeatureFaqBtn.removeEventListener('click', () => { });
            unlockProFeatureFaqBtn.addEventListener('click', () => {
                showBuyProMessage('Unlock PRO Version', 'To access this feature, please activate your PRO version.');
            });
        }
    }

    async function fetchAndSetUserInfo() {
        _lTC('fetchAndSetUserInfo: Attempting to auto-detect user info from DOM.');
        let detectedUsername = '';
        let detectedUserId = '';

        try {
            const userAnchor = document.querySelector('a.menu-value___gLaLR[href*="XID="]');

            if (userAnchor) {
                detectedUsername = userAnchor.textContent.trim();
                const href = userAnchor.getAttribute('href');
                const idMatch = href.match(/XID=(\d+)/);
                if (idMatch && idMatch[1]) {
                    detectedUserId = idMatch[1];
                    addPersistentLog(`Auto-detected User: ${detectedUsername} [${detectedUserId}]`);
                    _lTC(`fetchAndSetUserInfo: Successfully detected user: ${detectedUsername} [${detectedUserId}]`);
                } else {
                    addPersistentLog('Failed to extract User ID from profile link.');
                    _lTC('fetchAndSetUserInfo: User ID not found in the element\'s href attribute.');
                }
            } else {
                addPersistentLog('User info element not found. User might not be logged in or DOM structure changed.');
                _lTC('fetchAndSetUserInfo: User info element (a.menu-value___gLaLR with XID) not found.');
            }
        } catch (error) {
            addPersistentLog(`Error during user info auto-detection: ${error.message}`);
            _lTC(`fetchAndSetUserInfo: An error occurred during detection: ${error.message}`);
        }

        if (detectedUserId && detectedUsername) {
            if (config.yourUserId !== detectedUserId || config.yourUsername !== detectedUsername) {
                config.yourUserId = detectedUserId;
                config.yourUsername = detectedUsername;
                saveConfig();
                _lTC('fetchAndSetUserInfo: Config updated with auto-detected user info.');
            } else {
                _lTC('fetchAndSetUserInfo: Auto-detected user info matches existing config, no save needed.');
            }
        } else {
            _lTC('fetchAndSetUserInfo: No valid user info detected, config not updated.');
        }
    }

    async function init() {
        config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
        _lTC(`Trade Helper Pro v${getCleanScriptVersion()} initialized.`);

        loadConfig();

        appState.isSpecialModeUnlocked = config.flag1;

        await fetchAndSetUserInfo();
        appState.isPro = _cV();

        ensurePopupAndOverlayExist();
        updateSettingsUI();
        addMainButton();

        const observer = new MutationObserver((mutations) => {
            if (!document.getElementById('tradeEnhancerBtn') && window.location.href.includes('trade.php')) {
                _lTC('MutationObserver: Trade Enhancer button missing, attempting to re-add.');
                addMainButton();
            }
            if (config.showOnItemMarket && _cV() && !document.getElementById('tradeHelperBtn') && window.location.href.includes('page.php?sid=ItemMarket')) {
                _lTC('MutationObserver: Trade Helper button missing on ItemMarket (PRO), attempting to re-add.');
                addMainButton();
            }
            if ((!config.showOnItemMarket || !_cV()) && document.getElementById('tradeHelperBtn')) {
                document.getElementById('tradeHelperBtn').remove();
                _lTC('MutationObserver: "Trade Helper" button removed from Item Market (config disabled or not PRO).');
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        _lTC('Script initialized and MutationObserver started.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
