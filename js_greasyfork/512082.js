// ==UserScript==
// @name         挂刀网优化
// @namespace    https://greasyfork.org/users/1362311
// @version      1.3.3
// @description  优化界面。优化表格价格列展示信息，增加数据更新时间；支持配置查询参数首次进入时自动查询；增加挂刀比例计算器；
// @author       honguangli
// @license      MIT
// @match        https://www.hangknife.com/
// @match        https://hangknife.com/
// @icon         https://www.hangknife.com/static/imgs/logo_home_black.png
// @run-at       document-body
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/512082/%E6%8C%82%E5%88%80%E7%BD%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/512082/%E6%8C%82%E5%88%80%E7%BD%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const routerHash = '#/Home'; // 需要开启优化的页面
    const searchUrl = 'https://www.hangknife.com/api/steam/queryItemList'; // 查询接口
    let state = true; // 是否默认开启优化
    const updateDurationMinutes = 30; // 期望更新时间间隔，单位为分钟，当前时间与更新时间差值小于此配置时会标黄色
    const closeRealTimeData = true; // 是否关闭实时上架数据

    // csgo配置
    const csgoOption = {
        game: 'csgo',
        selector: '#pane-csgo .el-table', // 表格选择器
        priceColumnIndex: 15, // 价格列下标
        search: true, // 是否自定义查询，每次进入页面时执行一次
        searchParam: {
            orderBy: 'minPrice / steamSafeBuyerPrice,ascending', // 排序方式
            minPrice: '1', // 最低价
            maxPrice: '', // 最高价
            last24Volume: '', // 成交数
            platform: ["uupin"], // 交易平台
        },
        minWidth: 190, // 表格价格列最小宽度
        _isInit: false, // 是否已初始化
        _isSearch: false, // 是否已触发自定义查询
        _width: undefined, // 表格价格列宽度，缓存初始值，用于恢复默认样式
        _minWidth: undefined, // 表格价格列最小宽度，缓存初始值，用于恢复默认样式
    };

    // dota2配置
    const dota2Option = {
        game: 'dota2',
        selector: '#pane-dota2 .el-table', // 表格选择器
        priceColumnIndex: 9, // 价格列下标
        search: true, // 是否自定义查询，每次进入页面时执行一次
        searchParam: {
            orderBy: 'minPrice / steamSafeBuyerPrice,ascending', // 排序方式
            minPrice: '1', // 最低价
            maxPrice: '', // 最高价
            last24Volume: '', // 成交数
            platform: ["buff"], // 交易平台
        },
        minWidth: 190, // 表格价格列最小宽度
        _isInit: false, // 是否已初始化
        _isSearch: false, // 是否已触发自定义查询
        _width: undefined, // 表格价格列宽度，缓存初始值，用于恢复默认样式
        _minWidth: undefined, // 表格价格列最小宽度，缓存初始值，用于恢复默认样式
    };

    // csgo 查询参数
    // 交易平台可选项
    // ['buff', 'dmarket', 'c5game', 'skinPort', 'igxe', 'uupin', 'v5Item', 'csMoney', 'waxpeer', 'eco', 'bitSkins', 'haloskins']
    // 排序方式可选项
    // {value: 'minPrice / steamSellerPrice,ascending', label: '最优寄售'}
    // {value: 'minPrice / steamBuyerPrice,ascending', label: '最优求购'}
    // {value: 'minPrice / steamSafeBuyerPrice,ascending', label: '稳定成交'}
    // {value: 'minPrice,ascending', label: '底价升序'}
    // {value: 'minPrice / steamSellerPrice,descending', label: '第三方寄售价降序'}
    // {value: '(buffBuyOrderPrice - minPrice)/minPrice,descending', label: '低于Buff求购'}
    // {value: '(uupinBuyerPrice - minPrice)/minPrice,descending', label: '低于UU求购'}
    // {value: '(dmarketOrderPrice - minPrice)/minPrice,descending', label: '低于DMarket求购'}

    // steam货币配置，此处仅保留美元和人民币
    const g_rgCurrencyData = {"USD":{"strCode":"USD","eCurrencyCode":1,"strSymbol":"$","bSymbolIsPrefix":true,"bWholeUnitsOnly":false,"strDecimalSymbol":".","strThousandsSeparator":",","strSymbolAndNumberSeparator":""},"CNY":{"strCode":"CNY","eCurrencyCode":23,"strSymbol":"\u00a5","bSymbolIsPrefix":true,"bWholeUnitsOnly":false,"strDecimalSymbol":".","strThousandsSeparator":",","strSymbolAndNumberSeparator":" "},};
    // steam交易配置
    const g_rgWalletInfo = {
        "wallet_currency": 23, // 货币类型，等同于g_rgCurrencyData.eCurrencyCode，23表示人民币元
        "wallet_fee": "1", // 是否计算steam交易费
        "wallet_fee_minimum": "1", // steam交易费最低金额，单位分；
        "wallet_fee_percent": "0.05", // steam交易费比例，百分比；计算方式：卖家收款金额*比例，保留2位小数向下取整，最低收取wallet_fee_minimum配置金额
        "wallet_publisher_fee_percent_default": "0.10", // 游戏交易费比例，百分比；计算方式：卖家收款金额*比例，保留2位小数向下取整，最低收取1分
        "wallet_fee_base": "0", // steam额外交易费，单位分；计算完steam交易费后直接追加
    };

    // 隐藏原生的折扣内容
    // 通过改变DOM属性实现
    GM_addStyle('tbody > tr > td:last-child > div.cell[data-optimize="true"] > div:not([data-type="optimize"]) { display: none; }');

    // 优化成交数量输入框尺寸
    GM_addStyle('.el-tabs .el-tab-pane > div > div > div > div:nth-child(2) > div:nth-child(2) > div:first-child > div:first-child { width: 185px !important; }');
    GM_addStyle('.el-tabs .el-tab-pane > div > div > div > div:nth-child(2) > div:nth-child(2) > div:first-child > div:first-child > div:first-child { padding: 0 12px; }');

    // 监听页面变化
    // 匹配路由成功后重新初始化
    const observerApp = () => {
        const interval = setInterval(()=>{
            // 获取app节点
            const domApp = document.getElementById('app');
            const app = domApp.__vue__;

            if (app && app._isVue) {
                // 初始化配置
                initOption();
                // 插入优化选项
                insertOptimizeCheckBox();
                // 插入挂刀比例计算器
                insertCalculator();
                if (closeRealTimeData) {
                    closeRealTimeDataWebSocket();
                }

                // 开启监听
                const observer = new MutationObserver(() => {
                    // 初始化配置
                    initOption();
                    // 等待DOM刷新
                    app.$nextTick(() => {
                        if (location.hash === routerHash) {
                            // 插入优化选项
                            insertOptimizeCheckBox();
                            // 插入挂刀比例计算器
                            insertCalculator();
                            if (closeRealTimeData) {
                                closeRealTimeDataWebSocket();
                            }
                        }
                    });
                });
                observer.observe(domApp, { childList: true });
                clearInterval(interval);
            }

        }, 100);
    };

    // 劫持请求
    const listenHttpRequest = () => {
        let oldOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
            this._url = url;
            return oldOpen.call(this, method, url, async, user, password);
        };
        let oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            // 替换查询参数
            if (this._url === searchUrl) {
                const args = JSON.parse(arguments[0]);
                this._game = args.game;
                // 替换自定义查询参数
                if (args.game === 'csgo' && !csgoOption._isSearch) {
                    Object.entries(csgoOption.searchParam).forEach(item => {
                        if (args.hasOwnProperty(item[0])) {
                            args[item[0]] = item[1];
                        }
                    });
                    arguments[0] = JSON.stringify(args);
                } else if (args.game === 'dota2' && !dota2Option._isSearch) {
                    Object.entries(dota2Option.searchParam).forEach(item => {
                        if (args.hasOwnProperty(item[0])) {
                            args[item[0]] = item[1];
                        }
                    });
                    arguments[0] = JSON.stringify(args);
                }
            }
            // 监听请求响应
            this.addEventListener("load", function () {
                if (this._url === searchUrl) {
                    // 同步自定义查询参数
                    if (this._game === 'csgo' && csgoOption.search && !csgoOption._isSearch) {
                        csgoOption._isSearch = true;
                        const tableElement = document.querySelector(csgoOption.selector);
                        const table = tableElement.__vue__;
                        Object.entries(csgoOption.searchParam).forEach(item => {
                            if (table.$parent.initPage.hasOwnProperty(item[0])) {
                                table.$parent.initPage[item[0]] = item[1];
                            }
                        });
                    } else if (this._game === 'dota2' && dota2Option.search && !dota2Option._isSearch) {
                        dota2Option._isSearch = true;
                        const tableElement = document.querySelector(dota2Option.selector);
                        const table = tableElement.__vue__;
                        Object.entries(dota2Option.searchParam).forEach(item => {
                            if (table.$parent.initPage.hasOwnProperty(item[0])) {
                                table.$parent.initPage[item[0]] = item[1];
                            }
                        });
                    }

                    // 触发优化选项
                    if (this.readyState == 4 && this.status == 200) {
                        if (this._game === 'csgo' || this._game === 'dota2') {
                            changeState(state);
                        }
                    }
                }
            });
            return oldSend.apply(this, arguments);
        };
    };

    // 初始化配置
    const initOption = () => {
        // 重置配置
        csgoOption._isInit = false;
        csgoOption._isSearch = false;
        csgoOption._width = undefined;
        csgoOption._minWidth = undefined;
        dota2Option._isInit = false;
        dota2Option._isSearch = false;
        dota2Option._width = undefined;
        dota2Option._minWidth = undefined;
    };

    // 插入优化选项
    const insertOptimizeCheckBox = () => {
        if (document.getElementById('optimize-checkbox')) {
            return;
        }

        // 获取右侧导航栏
        const domRightMenu = document.getElementsByClassName('avatarDiv')[0];

        // 添加优化选项
        const h = `<label id="optimize-checkbox" class="el-checkbox is-bordered" style="height: 32px; margin-right: 8px; padding: 6px 12px;">
            <span class="el-checkbox__input">
                <span class="el-checkbox__inner"></span>
            </span>
            <span class="el-checkbox__label">自定义优化</span>
        </label>
        `;
        domRightMenu.insertAdjacentHTML('afterBegin', h);

        const checkbox = document.getElementById('optimize-checkbox');
        checkbox.addEventListener('click', (e) => {
            state = !state;
            changeState(state);
        });

        // 是否默认开启优化
        if (state) {
            changeState(state);
        }
    };

    // 插入挂刀比例计算器
    const insertCalculator = () => {
        if (document.getElementById('calculator')) {
            return;
        }

        const row = document.querySelector('.el-main');
        if (!row) {
            return;
        }

        const h = `<div id="calculator" style="display: flex; justify-content: end; align-items: center; column-gap: 12px; margin-bottom: 20px;">
            <div class="el-input el-input--small el-input-group el-input-group--prepend" style="width: 100px;">
                <div class="el-input-group__prepend">第三方平台购入价</div>
                <input id="calculator-buy-price" type="text" autocomplete="off" class="el-input__inner" style="width: 100px;">
            </div>
            <div class="el-input el-input--small el-input-group el-input-group--prepend" style="width: 100px;">
                <div class="el-input-group__prepend">Steam买家支付价</div>
                <input id="calculator-sell-price" type="text" autocomplete="off" class="el-input__inner" style="width: 100px;">
            </div>
            <div class="el-input el-input--small el-input-group el-input-group--prepend is-disabled" style="width: 100px;">
                <div class="el-input-group__prepend">Steam到手余额</div>
                <input id="calculator-steam-balance" type="text" autocomplete="off" class="el-input__inner" style="width: 100px; color: #67c23a;" disabled>
            </div>
            <div class="el-input el-input--small el-input-group el-input-group--prepend is-disabled" style="width: 100px;">
                <div class="el-input-group__prepend">比例</div>
                <input id="calculator-discount" type="text" autocomplete="off" class="el-input__inner" style="width: 100px;" disabled>
            </div>
        <div>
        `;
        row.insertAdjacentHTML('afterBegin', h);

        // 计算折扣
        const calculate = (buyPrice, sellPrice) => {
            const inputSteamBalance = document.getElementById('calculator-steam-balance');
            const inputDiscount = document.getElementById('calculator-discount');

            // 格式化金额
            const buyPriceInt = GetPriceValueAsInt(buyPrice);
            const sellPriceInt = GetPriceValueAsInt(sellPrice);

            // 若steam买家支付金额未设置，则不显示steam到手余额和折扣信息
            if (sellPriceInt <= 0) {
                inputSteamBalance.value = '';
                inputDiscount.value = '';
                return;
            }

            const fees = CalculateFeeAmount(sellPriceInt, g_rgWalletInfo.wallet_publisher_fee_percent_default);
            inputSteamBalance.value = (fees.amount - fees.fees)/100;

            // 若第三方平台购入金额未设置，则不显示折扣信息
            if (buyPriceInt <= 0) {
                inputDiscount.value = '';
                return;
            }

            const discount = buyPriceInt / (fees.amount - fees.fees);
            inputDiscount.value = discount.toFixed(3);
            if (discount <= 0.7) {
                inputDiscount.style.setProperty('color', '#67c23a');
            } else if (discount <= 0.8) {
                inputDiscount.style.setProperty('color', '#409eff');
            } else if (discount <= 0.9) {
                inputDiscount.style.setProperty('color', '#e6a23c');
            } else {
                inputDiscount.style.setProperty('color', '#f56c6c');
            }
        };

        const inputBuyPrice = document.getElementById('calculator-buy-price');
        const inputSellPrice = document.getElementById('calculator-sell-price');

        inputBuyPrice.addEventListener('input', (e) => {
            calculate(inputBuyPrice.value, inputSellPrice.value);
        });

        inputSellPrice.addEventListener('input', (e) => {
            calculate(inputBuyPrice.value, inputSellPrice.value);
        });
    };

    /**
     * 优化状态变更
     * @param {bool} state 状态
     */
    const changeState = (state) => {
        if (!state) {
            // 关闭
            const checkbox = document.getElementById('optimize-checkbox');
            checkbox.classList.remove('is-checked');
            checkbox.querySelector('.el-checkbox__input').classList.remove('is-checked');
            reset(csgoOption);
            reset(dota2Option);
        } else {
            // 开启
            const checkbox = document.getElementById('optimize-checkbox');
            checkbox.classList.add('is-checked');
            checkbox.querySelector('.el-checkbox__input').classList.add('is-checked');
            optimize(csgoOption);
            optimize(dota2Option);
        }
    };

    /**
     * 优化表格
     * @param {object} option 配置
     */
    const optimize = (option) => {
        const tableElement = document.querySelector(option.selector);
        if (!tableElement) {
            return;
        }

        const table = tableElement.__vue__;
        if (!table) {
            return;
        }

        // 初始化
        if (!option._isInit) {
            option._isInit = true;

            // 缓存参数
            option._width = table.columns[option.priceColumnIndex].width;
            option._minWidth = table.columns[option.priceColumnIndex].minWidth;
        }
        // 执行优化
        setTimeout(()=>{
            optimizeTable(table, option);
        }, 50);
    };

    /**
     * 优化表格
     * @param {object} table 表格对象
     * @param {object} option 配置
     */
    const optimizeTable = (table, option) => {
        // 开启表格纵向边框，开启后可以拖动改变列宽度
        table.border = true;
        // 设置折扣列宽度，需清除width并设置最小宽度，否则宽度占不满则会出现空白列
        table.columns[option.priceColumnIndex].width = undefined;
        table.columns[option.priceColumnIndex].minWidth = option.minWidth;
        // 修改UI后需重新渲染表格布局
        table.doLayout();

        // 移除优化生成的内容
        const domOptimizes = table.$el.querySelectorAll(`tbody > tr > td:nth-child(${ option.priceColumnIndex+1 }) > div.cell > div[data-type="optimize"]`);
        for (let i = 0; i < domOptimizes.length; i++) {
            domOptimizes[i].parentNode.removeAttribute('data-optimize');
            domOptimizes[i].remove();
        }

        // 找到每行的折扣内容
        const cells = table.$el.querySelectorAll(`tbody > tr > td:nth-child(${ option.priceColumnIndex+1 }) > div.cell`);

        const nowUnix = Math.round(new Date() / 1000);

        // 遍历每行生成优化内容
        const data = table.data;
        for (let i = 0; i < data.length; i++) {
            // 寄售
            const sellerFees = CalculateFeeAmount(GetPriceValueAsInt(data[i].steamSellerPrice+''), g_rgWalletInfo.wallet_publisher_fee_percent_default);
            const sellerDiscount = (data[i].minPlatformPrice * 100) / (sellerFees.amount - sellerFees.fees);
            // 求购
            const buyerFees = CalculateFeeAmount(GetPriceValueAsInt(data[i].steamBuyerPrice+''), g_rgWalletInfo.wallet_publisher_fee_percent_default);
            const buyerDiscount = (data[i].minPlatformPrice * 100) / (buyerFees.amount - buyerFees.fees);
            // 稳定
            const safeBuyerFees = CalculateFeeAmount(GetPriceValueAsInt(data[i].steamSafeBuyerPrice+''), g_rgWalletInfo.wallet_publisher_fee_percent_default);
            const safeBuyerDiscount = (data[i].minPlatformPrice * 100) / (safeBuyerFees.amount - safeBuyerFees.fees);
            const h = `
            <div data-type="optimize">
                <div style="display: flex;">
                    <div style="min-width: 33px;">寄售:</div>
                    ${ data[i].steamSellerPrice === null ? '<div style="flex: 1; color: rgb(170, 170, 170);">暂无记录</div>' : `
                    <div style="flex: 1">${ table.$parent.formatterPrice(sellerFees.amount/100) } &rarr; ${ table.$parent.formatterPrice((sellerFees.amount-sellerFees.fees)/100) }</div>
                    <span class="el-tag el-tag--${ table.$parent.formatterTagType(sellerDiscount) } el-tag--mini el-tag--plain">${ sellerDiscount.toFixed(3) }</span>
                    `}
                </div>
                <div style="display: flex;">
                    <div style="min-width: 33px;">求购:</div>
                    ${ data[i].steamBuyerPrice === null ? '<div style="flex: 1; color: rgb(170, 170, 170);">暂无记录</div>' : `
                    <div style="flex: 1">${ table.$parent.formatterPrice(buyerFees.amount/100) } &rarr; ${ table.$parent.formatterPrice((buyerFees.amount-buyerFees.fees)/100) }</div>
                    <span class="el-tag el-tag--${ table.$parent.formatterTagType(buyerDiscount) } el-tag--mini el-tag--plain">${ buyerDiscount.toFixed(3) }</span>
                    `}
                </div>
                <div style="display: flex;">
                    <div style="min-width: 33px;">稳定:</div>
                    ${ data[i].steamSafeBuyerPrice === null ? '<div style="flex: 1; color: rgb(170, 170, 170);">暂无记录</div>' : `
                    <div style="flex: 1">${ table.$parent.formatterPrice(safeBuyerFees.amount/100) } &rarr; ${ table.$parent.formatterPrice((safeBuyerFees.amount-safeBuyerFees.fees)/100) }</div>
                    <span class="el-tag el-tag--${ table.$parent.formatterTagType(safeBuyerDiscount) } el-tag--mini el-tag--plain">${ safeBuyerDiscount.toFixed(3) }</span>
                    `}
                </div>
                <div style="display: flex;">
                    <div style="min-width: 33px;">更新:</div>
                    <div style="${ nowUnix - Math.round(new Date(data[i].updateTime)/1000) < updateDurationMinutes * 60 ? 'color: #e6a23c' : '' }">${ data[i].updateTime }</div>
                </div>
            </div>`;
            cells[i].insertAdjacentHTML('beforeEnd', h);
            cells[i].setAttribute('data-optimize', 'true');
        }
    };

    /**
     * 重置
     * @param {object} option 配置
     */
    const reset = (option) => {
        const tableElement = document.querySelector(option.selector);
        if (!tableElement) {
            return;
        }

        const table = tableElement.__vue__;
        if (!table) {
            return;
        }

        // 关闭表格纵向边框
        table.border = false;
        // 重置列宽度
        table.columns[option.priceColumnIndex].width = option._width;
        table.columns[option.priceColumnIndex].minWidth = option._minWidth;
        // 修改UI后需重新渲染表格布局
        table.doLayout();

        // 移除优化生成的内容
        const domOptimizes = table.$el.querySelectorAll(`tbody > tr > td:nth-child(${ option.priceColumnIndex+1 }) > div.cell > div[data-type="optimize"]`);
        for (let i = 0; i < domOptimizes.length; i++) {
            domOptimizes[i].parentNode.removeAttribute('data-optimize');
            domOptimizes[i].remove();
        }
    };

    // 关闭实时上架数据websocket
    const closeRealTimeDataWebSocket = () => {
        const dom = document.querySelector('.el-header .el-card');
        if (!dom || !dom.__vue__ || !dom.__vue__._isVue || !dom.__vue__.$parent || !dom.__vue__.$parent._isVue) {
            return;
        }
        dom.__vue__.$parent.disconnect();
    };

    /**
     * @typedef {Object} Fees
     * @property {number} steam_fee - steam交易费
     * @property {number} publisher_fee - 游戏交易费
     * @property {number} fees - 总交易费
     * @property {number} amount - 买家支付金额
     */

    /**
     * 计算交易费用
     * steam官网源码，未作改动
     * @param {number} amount 买家支付金额
     * @param {number} publisherFee 游戏交易费比例
     * @return {Fees} 交易费用明细
     */
    function CalculateFeeAmount( amount, publisherFee ) {
        if ( !g_rgWalletInfo['wallet_fee'] ) {
            return 0;
        }

        publisherFee = ( typeof publisherFee == 'undefined' ) ? 0 : publisherFee;

        // Since CalculateFeeAmount has a Math.floor, we could be off a cent or two. Let's check:
        var iterations = 0; // shouldn't be needed, but included to be sure nothing unforseen causes us to get stuck
        var nEstimatedAmountOfWalletFundsReceivedByOtherParty = parseInt( ( amount - parseInt( g_rgWalletInfo['wallet_fee_base'] ) ) / ( parseFloat( g_rgWalletInfo['wallet_fee_percent'] ) + parseFloat( publisherFee ) + 1 ) );

        var bEverUndershot = false;
        var fees = CalculateAmountToSendForDesiredReceivedAmount( nEstimatedAmountOfWalletFundsReceivedByOtherParty, publisherFee );
        while ( fees.amount != amount && iterations < 10 )
        {
            if ( fees.amount > amount )
            {
                if ( bEverUndershot )
                {
                    fees = CalculateAmountToSendForDesiredReceivedAmount( nEstimatedAmountOfWalletFundsReceivedByOtherParty - 1, publisherFee );
                    fees.steam_fee += ( amount - fees.amount );
                    fees.fees += ( amount - fees.amount );
                    fees.amount = amount;
                    break;
                }
                else
                {
                    nEstimatedAmountOfWalletFundsReceivedByOtherParty--;
                }
            }
            else
            {
                bEverUndershot = true;
                nEstimatedAmountOfWalletFundsReceivedByOtherParty++;
            }

            fees = CalculateAmountToSendForDesiredReceivedAmount( nEstimatedAmountOfWalletFundsReceivedByOtherParty, publisherFee );
            iterations++;
        }

        // fees.amount should equal the passed in amount

        return fees;
    }

    /**
     * 计算交易费用
     * steam官网源码，未作改动
     * @param {number} receivedAmount 卖家收款金额
     * @param {number} publisherFee 游戏交易费比例
     * @return {Fees} 交易费用明细
     */
    function CalculateAmountToSendForDesiredReceivedAmount( receivedAmount, publisherFee ){
        if ( !g_rgWalletInfo['wallet_fee'] ){
            return receivedAmount;
        }

        publisherFee = ( typeof publisherFee == 'undefined' ) ? 0 : publisherFee;

        var nSteamFee = parseInt( Math.floor( Math.max( receivedAmount * parseFloat( g_rgWalletInfo['wallet_fee_percent'] ), g_rgWalletInfo['wallet_fee_minimum'] ) + parseInt( g_rgWalletInfo['wallet_fee_base'] ) ) );
        var nPublisherFee = parseInt( Math.floor( publisherFee > 0 ? Math.max( receivedAmount * publisherFee, 1 ) : 0 ) );
        var nAmountToSend = receivedAmount + nSteamFee + nPublisherFee;

        return {
            steam_fee: nSteamFee,
            publisher_fee: nPublisherFee,
            fees: nSteamFee + nPublisherFee,
            amount: parseInt( nAmountToSend )
        };
    }

    /**
     * 格式化金额
     * steam官网源码，未作改动
     * @param {string} strAmount 金额，单位元
     * @return {number} 金额，单位分
     */
    function GetPriceValueAsInt( strAmount ) {
        var nAmount;
        if ( !strAmount )
        {
            return 0;
        }

        // Users may enter either comma or period for the decimal mark and digit group separators.
        strAmount = strAmount.replace( /,/g, '.' );

        // strip the currency symbol, set .-- to .00
        strAmount = strAmount.replace( GetCurrencySymbol( GetCurrencyCode( g_rgWalletInfo['wallet_currency'] ) ), '' ).replace( '.--', '.00');

        // strip spaces
        strAmount = strAmount.replace( / /g, '' );

        // Remove all but the last period so that entries like "1,147.6" work
        if ( strAmount.indexOf( '.' ) != -1 )
        {
            var splitAmount = strAmount.split( '.' );
            var strLastSegment = splitAmount[splitAmount.length-1];

            if ( !isNaN( strLastSegment ) && strLastSegment.length == 3 && splitAmount[splitAmount.length-2] != '0' )
            {
                // Looks like the user only entered thousands separators. Remove all commas and periods.
                // Ensures an entry like "1,147" is not treated as "1.147"
                //
                // Users may be surprised to find that "1.147" is treated as "1,147". "1.147" is either an error or the user
                // really did mean one thousand one hundred and forty seven since no currencies can be split into more than
                // hundredths. If it was an error, the user should notice in the next step of the dialog and can go back and
                // correct it. If they happen to not notice, it is better that we list the item at a higher price than
                // intended instead of lower than intended (which we would have done if we accepted the 1.147 value as is).
                strAmount = splitAmount.join( '' );
            }
            else
            {
                strAmount = splitAmount.slice( 0, -1 ).join( '' ) + '.' + strLastSegment;
            }
        }

        var flAmount = parseFloat( strAmount ) * 100;
        nAmount = Math.floor( isNaN(flAmount) ? 0 : flAmount + 0.000001 ); // round down

        nAmount = Math.max( nAmount, 0 );
        return nAmount;
    }

    /**
     * 获取货币符号
     * steam官网源码，未作改动
     * @param {string} currencyCode 货币代码
     * @return {string} 货币符号
     */
    // Return the symbol to use for a currency
    function GetCurrencySymbol( currencyCode ) {
        return g_rgCurrencyData[currencyCode] ? g_rgCurrencyData[currencyCode].strSymbol : currencyCode + ' ';
    }

    /**
     * 获取货币代码
     * steam官网源码，未作改动
     * @param {number} currencyId 货币id
     * @return {string} 货币代码
     */
    function GetCurrencyCode( currencyId ) {
        for ( var code in g_rgCurrencyData )
        {
            if ( g_rgCurrencyData[code].eCurrencyCode == currencyId )
                return code;
        }
        return 'Unknown';
    }

    // 监听页面
    observerApp();

    // 劫持请求
    listenHttpRequest();
})();