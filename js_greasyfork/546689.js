// ==UserScript==
// @name         Solidgate Refund Checker
// @namespace    http://tampermonkey.net/
// @version      7.4-Bulimia
// @description  Intercepts website's own search requests to capture customer data and provides a step-by-step log of the refund decision process. Includes an interactive Simulation Mode with Live Analysis and Shortcut Templates. Optimized & Compressed.
// @author       Swiftlyx & Roslelive
// @match        https://hub.solidgate.com/payments/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      cdn.jsdelivr.net
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=solidgate.com
// @downloadURL https://update.greasyfork.org/scripts/546689/Solidgate%20Refund%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/546689/Solidgate%20Refund%20Checker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- CONFIGURATION & CONSTANTS ---
    class Config {
        static get DATA_MAPPING() {
            return {
                id: 'id',
                merchantOrderId: 'merchantOrder.id',
                status: 'status',
                amount: 'price.amount',
                currency: 'price.currencyCode',
                paymentType: 'paymentType',
                paymentMethod: 'method.paymentMethod',
                cardBrand: 'method.cardInfo.cardBrand',
                cardType: 'method.cardInfo.cardType',
                issuerCountry: 'method.cardInfo.issuerCountry',
                geoCountry: 'source.geoCountry',
                ipCountry: 'source.ipCountry',
                createdAt: 'createdAt',
                isTrial: 'source.website',
                altGateDispute: 'altGateDispute',
                subscriptionId: 'subscriptionId',
                customerEmail: 'customer.email',
                channelName: 'channelLink.name',
                description: 'merchantOrder.description'
            };
        }

        static get ZERO_DECIMAL_CURRENCIES() {
            return ['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'];
        }

        static get SCA_COUNTRIES() {
            return ['BEL', 'BGR', 'CYP', 'DNK', 'DEU', 'EST', 'FIN', 'FRA', 'GRC', 'HUN', 'IRL', 'ITA', 'HRV', 'LVA', 'LIE', 'LTU', 'LUX', 'MLT', 'NLD', 'NOR', 'AUT', 'POL', 'PRT', 'ROU', 'SVN', 'SVK', 'ESP', 'CZE', 'ISL', 'SWE', 'GBR', 'CHE', 'AND', 'SMR', 'VAT', 'GUF', 'GLP', 'MTQ', 'MYT', 'REU', 'MAF'];
        }
    }

    // --- UTILITIES ---
    class Logger {
        static notify(message, type = 'info') {
            UIManager.showNotification(message, type);
        }

        static error(message, errorObj = null) {
            // Critical errors are shown in UI.
            UIManager.showNotification(`${message} ${errorObj ? errorObj.message : ''}`, 'error');
        }
    }

    class Utils {
        static get(path, obj) {
            return path.split('.').reduce((p, c) => p && p[c], obj);
        }

        static getUtcDateString(dateStr) {
            if (!dateStr) return 'N/A';
            try {
                return new Date(dateStr).toISOString().split('T')[0];
            } catch (e) { return 'Invalid Date'; }
        }

        static formatAmount(amount, currency) {
            const isZeroDecimal = Config.ZERO_DECIMAL_CURRENCIES.includes(currency);
            const displayNum = isZeroDecimal ? amount : amount / 100;
            const decimalPlaces = isZeroDecimal ? 0 : 2;
            return displayNum.toFixed(decimalPlaces);
        }
    }

    // --- RISK DATA MANAGER ---
    /**
     * Manages risk profiles for different countries to determine refund eligibility.
     * The data is compressed using a 4-bit signature (e.g., "0010").
     *
     * Bit Logic:
     * 1st bit (8): Ignored (Mastercard Not-Prepaid) - Default Low Risk
     * 2nd bit (4): Ignored (Mastercard Prepaid)     - Default Low Risk
     * 3rd bit (2): Visa Not-Prepaid       (1 = Low Risk, 0 = Normal)
     * 4th bit (1): Visa Prepaid           (1 = Low Risk, 0 = Normal)
     */
    class RiskDataManager {
        constructor() {
            this.riskProfiles = {
                "0010": ["ARM", "DZA", "KGZ", "BGD", "HND", "BWA", "COD", "TJK", "UGA", "NAM", "ZMB", "NIC", "BHS", "MOZ", "MCO", "RWA", "GIN", "SXM", "SSD", "GMB", "CYM", "BOL", "KIR", "CMR", "BFA", "SLB", "LIE", "TGO", "CPV", "GUM", "GAB", "LBR", "SWZ", "PNG", "SLE", "TON", "NPL", "CIV", "NER", "VCT", "DJI", "MWI", "KNA", "WSM", "VGB", "SYC", "PRY", "MLI", "GRD", "GNQ", "FJI", "DMA", "COK"],
                "0100": ["USA", "FRA", "PHL", "AUS", "GRC", "THA", "HKG", "KWT", "POL", "MYS", "SRB", "GHA", "MEX", "COL", "SMR", "MRT", "CHL", "SUR", "CZE"],
                "0110": ["KEN", "SGP", "HRV", "BHR", "AND", "SEN", "TUN", "HTI", "LAO"],
                "0111": ["AGO"],
                "1000": ["ISR", "SWE", "NZL", "DNK", "BIH", "EGY", "SVK", "DOM", "OMN", "ECU", "PRI", "PAN", "LKA", "PER", "GTM"],
                "1010": ["HUN", "GEO", "EST", "MAR", "MDA", "FIN", "AZE", "MNE", "NGA", "LUX", "SLV", "UZB", "MNG", "CUW", "JAM", "TTO", "MUS", "MDV", "BRB", "BMU"],
                "1100": ["GBR", "CAN", "JPN", "LVA", "PRT", "IRL", "JOR", "IND", "SOM", "ARG"],
                "1110": ["DEU", "ARE", "NLD", "ROU", "AUT", "LTU", "BGR", "QAT", "SVN", "NOR", "ISL", "ALB", "KAZ", "MLT", "CRI", "KHM", "TZA", "URY", "BRN"],
                "1111": ["ITA", "SAU", "CHE", "BEL"]
            };
            this.countryMap = this._buildCountryMap();
        }

        _buildCountryMap() {
            const map = {};
            for (const [profile, countries] of Object.entries(this.riskProfiles)) {
                // Mastercard logic removed (indices 0 and 1 are ignored).
                const rules = {
                    visa: { not_prepaid: parseInt(profile[2]), prepaid: parseInt(profile[3]) }
                };
                countries.forEach(c => { map[c] = rules; });
            }
            return map;
        }

        getRisk(country, brand, cardType) {
            const countryRules = this.countryMap[country];
            if (!countryRules) return undefined;

            // Only Visa rules are stored now
            const brandRules = countryRules[brand.toLowerCase()];
            if (!brandRules) return undefined;

            const mappedType = (cardType === 'PREPAID') ? 'prepaid' : 'not_prepaid';
            return brandRules[mappedType];
        }
    }

    // --- API SERVICE ---
    class APIService {
        constructor() {
            this.capturedAccountId = localStorage.getItem('sg_script_account_id') || "";
            this.capturedAuthToken = localStorage.getItem('sg_script_auth_token') || "";
            this.exchangeRates = null;
        }

        updateCredentials(accId, auth) {
            let updated = false;
            if (accId && accId !== this.capturedAccountId) {
                this.capturedAccountId = accId;
                localStorage.setItem('sg_script_account_id', accId);
                updated = true;
            }
            if (auth && auth !== this.capturedAuthToken) {
                this.capturedAuthToken = auth;
                localStorage.setItem('sg_script_auth_token', auth);
                updated = true;
            }
            if (updated) UIManager.updateCredentialStatus(!!this.capturedAccountId);
        }

        async fetchSubscriptionLogs(subId) {
            if (!this.capturedAccountId) return null;
            const API_URL = "https://hub.solidgate.com/grpc/solidgate.hub_bff.subscription.v1beta.PaymentLogService/ListSubscriptionPaymentLog";
            try {
                const headers = { 'Content-Type': 'application/json', 'x-account-id': this.capturedAccountId };
                if (this.capturedAuthToken) headers.Authorization = this.capturedAuthToken;

                const response = await App.originalFetch(API_URL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ subscriptionId: subId, pagination: { pageSize: "100" } }),
                    credentials: 'include',
                    cache: 'no-store'
                });
                if (!response.ok) return null;
                const data = await response.json();
                return data.records || [];
            } catch (e) {
                Logger.error("Failed to fetch logs", e);
                return null;
            }
        }

        async fetchSubscriptionDetails(subId) {
            if (!this.capturedAccountId) return null;
            const API_URL = "https://hub.solidgate.com/grpc/solidgate.hub_bff.subscription.v1beta.SubscriptionService/GetSubscription";
            try {
                const headers = { 'Content-Type': 'application/json', 'x-account-id': this.capturedAccountId };
                if (this.capturedAuthToken) headers.Authorization = this.capturedAuthToken;

                const response = await App.originalFetch(API_URL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ subscriptionId: subId }),
                    credentials: 'include',
                    cache: 'no-store'
                });
                if (!response.ok) return null;
                const data = await response.json();
                return data.subscription || null;
            } catch (e) {
                Logger.error("Failed to fetch subscription details", e);
                return null;
            }
        }

        async fetchTransactionDetails(orderId) {
            if (!this.capturedAccountId) return null;
            const API_URL = "https://hub.solidgate.com/grpc/solidgate.hub_bff.payment.v1beta.TransactionService/GetTransactionByOrder";
            try {
                const headers = { 'Content-Type': 'application/json', 'x-account-id': this.capturedAccountId };
                if (this.capturedAuthToken) headers.Authorization = this.capturedAuthToken;

                const response = await App.originalFetch(API_URL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ orderId: orderId }),
                    credentials: 'include',
                    cache: 'no-store'
                });
                if (!response.ok) return null;
                const data = await response.json();
                return data.transactions || [];
            } catch (e) {
                Logger.error("Failed to fetch transaction details", e);
                return null;
            }
        }

        async convertToUsdAndCheck(amount, currency) {
            const isZeroDecimal = Config.ZERO_DECIMAL_CURRENCIES.includes(currency);
            const originalAmount = isZeroDecimal ? amount : amount / 100;

            if (currency === 'USD') return { isLessThan5: originalAmount <= 5, usdAmount: originalAmount, originalAmount };

            try {
                if (!this.exchangeRates) {
                    this.exchangeRates = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
                            onload: function (response) {
                                if (response.status === 200) resolve(JSON.parse(response.responseText).usd);
                                else reject(new Error(`API request failed with status ${response.status}`));
                            },
                            onerror: reject
                        });
                    });
                }
                const rate = this.exchangeRates[currency.toLowerCase()];
                if (!rate) return { isLessThan5: false, usdAmount: null, originalAmount };

                const usdAmount = originalAmount / rate;
                return { isLessThan5: usdAmount <= 5, usdAmount, originalAmount };
            } catch (error) {
                Logger.error("Currency conversion failed", error);
                return { isLessThan5: false, usdAmount: null, originalAmount };
            }
        }
    }

    // --- REFUND CALCULATOR ---
    class RefundCalculator {
        constructor(riskManager, apiService) {
            this.riskManager = riskManager;
            this.apiService = apiService;
        }

        _getOrderStatusName(status) {
            const statusMap = {
                'ORDER_STATUS_AUTH_OK': 'Authorized', 'ORDER_STATUS_SETTLE_OK': 'Settled',
                'ORDER_STATUS_REFUNDED': 'Refunded', 'ORDER_STATUS_FAILED': 'Failed',
                'ORDER_STATUS_AUTH_FAILED': 'Auth Failed', 'ORDER_STATUS_DECLINED': 'Declined',
                'ORDER_STATUS_VOIDED_OK': 'Voided', 'ORDER_STATUS_PROCESSING': 'Processing',
                'ORDER_STATUS_APPROVED': 'Settled'
            };
            return statusMap[status] || status;
        }

        _getDisputeStatusName(status) {
            const statusMap = {
                'ALT_GATE_DISPUTE_STATUS_UNDER_REVIEW': 'Under review',
                'ALT_GATE_DISPUTE_STATUS_RESOLVED': 'Resolved',
                'ALT_GATE_DISPUTE_STATUS_WAITING_FOR_SELLER_RESPONSE': 'Waiting for seller response',
                'ALT_GATE_DISPUTE_STATUS_WAITING_FOR_BUYER_RESPONSE': 'Waiting for buyer response'
            };
            return statusMap[status] || status;
        }

        calculateRefundAmount(orders, refundType, currency, recurringPaymentsCount, customOrdersOverride, ignoreRefundedStatus = false) {
            if (refundType === 'rejected') return { amount: `0.00 ${currency}`, count: 0, breakdown: null };

            let totalAmount = 0, trialAmount = 0, recurringAmount = 0, eligibleTxnCount = 0, upsellAmount = 0;
            const get = Utils.get;

            let ordersToProcess = customOrdersOverride || orders.filter(order => {
                const status = get(Config.DATA_MAPPING.status, order);
                return !['ORDER_STATUS_FAILED', 'ORDER_STATUS_AUTH_FAILED', 'ORDER_STATUS_DECLINED', 'ORDER_STATUS_PROCESSING', 'ORDER_STATUS_VOID_OK'].includes(status);
            });

            // Pre-calculate Trial Eligibility for logic dependency
            const trialOrder = ordersToProcess.find(o => o.paymentType === 'PAYMENT_TYPE_FIRST');
            let isTrialEligibleForRefund = false;

            if (trialOrder) {
                const paymentMethod = get(Config.DATA_MAPPING.paymentMethod, trialOrder);
                const isPaypal = (paymentMethod === 'PAYMENT_METHOD_PAYPAL' || paymentMethod === 'PAYMENT_METHOD_PAYPAL_VAULT');
                const ageLimit = isPaypal ? 180 : 125;
                const transactionDate = new Date(get(Config.DATA_MAPPING.createdAt, trialOrder));
                const daysDiff = (new Date().getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24);

                const totalRefundedAmount = parseFloat(get('price.refundedAmount.amount', trialOrder) || '0');
                const orderAmount = parseFloat(get(Config.DATA_MAPPING.amount, trialOrder));
                const status = get(Config.DATA_MAPPING.status, trialOrder);
                const isAlreadyRefunded = !ignoreRefundedStatus && (status === 'ORDER_STATUS_REFUNDED' || (orderAmount > 0 && totalRefundedAmount / orderAmount >= 0.95));
                const isRefundableStatus = ['ORDER_STATUS_AUTH_OK', 'ORDER_STATUS_SETTLE_OK', 'ORDER_STATUS_APPROVED'].includes(status) || (ignoreRefundedStatus && status === 'ORDER_STATUS_REFUNDED');

                if (!isAlreadyRefunded && isRefundableStatus && (customOrdersOverride || daysDiff < ageLimit)) {
                    isTrialEligibleForRefund = true;
                }
            }

            ordersToProcess.forEach(order => {
                const paymentMethod = get(Config.DATA_MAPPING.paymentMethod, order);
                const isPaypal = (paymentMethod === 'PAYMENT_METHOD_PAYPAL' || paymentMethod === 'PAYMENT_METHOD_PAYPAL_VAULT');
                const ageLimit = isPaypal ? 180 : 125;
                const transactionDate = new Date(get(Config.DATA_MAPPING.createdAt, order));
                const daysDiff = (new Date().getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24);
                const totalRefundedAmount = parseFloat(get('price.refundedAmount.amount', order) || '0');
                const orderAmount = parseFloat(get(Config.DATA_MAPPING.amount, order));
                const status = get(Config.DATA_MAPPING.status, order);
                const isAlreadyRefunded = !ignoreRefundedStatus && (status === 'ORDER_STATUS_REFUNDED' || (orderAmount > 0 && totalRefundedAmount / orderAmount >= 0.95));

                // IMPORTANT: Upsell inclusion logic for general eligibility count
                // If it's an upsell, it only counts as eligible if the trial is eligible.
                const isUpsell = (get(Config.DATA_MAPPING.description, order) || '').toLowerCase().includes('upsell');
                if (isUpsell && !isTrialEligibleForRefund) return;

                if ((customOrdersOverride || daysDiff < ageLimit) && !isAlreadyRefunded) eligibleTxnCount++;
            });

            if (refundType === 'full') {
                ordersToProcess.forEach(order => {
                    const totalRefundedAmount = parseFloat(get('price.refundedAmount.amount', order) || '0');
                    const orderAmount = parseFloat(get(Config.DATA_MAPPING.amount, order));
                    const status = get(Config.DATA_MAPPING.status, order);
                    const isAlreadyRefunded = !ignoreRefundedStatus && (status === 'ORDER_STATUS_REFUNDED' || (orderAmount > 0 && totalRefundedAmount / orderAmount >= 0.95));

                    const paymentMethod = get(Config.DATA_MAPPING.paymentMethod, order);
                    const isPaypal = (paymentMethod === 'PAYMENT_METHOD_PAYPAL' || paymentMethod === 'PAYMENT_METHOD_PAYPAL_VAULT');
                    const ageLimit = isPaypal ? 180 : 125;
                    const transactionDate = new Date(get(Config.DATA_MAPPING.createdAt, order));
                    const daysDiff = (new Date().getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24);
                    const isRefundableStatus = ['ORDER_STATUS_AUTH_OK', 'ORDER_STATUS_SETTLE_OK', 'ORDER_STATUS_APPROVED'].includes(status) || (ignoreRefundedStatus && status === 'ORDER_STATUS_REFUNDED');

                    // IMPORTANT: Upsell Logic for Full Refund
                    // Upsells only get refunded if the Trial is eligible for refund.
                    const isUpsell = (get(Config.DATA_MAPPING.description, order) || '').toLowerCase().includes('upsell');
                    if (isUpsell && !isTrialEligibleForRefund) return;

                    if (!isAlreadyRefunded && isRefundableStatus && (customOrdersOverride || daysDiff < ageLimit)) {
                        totalAmount += parseFloat(get(Config.DATA_MAPPING.amount, order) || '0');
                    }
                });
            } else if (refundType === 'partial') {
                const successfulOrders = ordersToProcess;
                const latestRecurringOrder = successfulOrders.find(o => o.paymentType === 'PAYMENT_TYPE_RECURRING' && !(get(Config.DATA_MAPPING.description, o) || '').toLowerCase().includes('upsell'));

                if (latestRecurringOrder) {
                    const isPaypal = (get(Config.DATA_MAPPING.paymentMethod, latestRecurringOrder) || '').includes('PAYPAL');
                    const ageLimit = isPaypal ? 180 : 125;
                    const daysDiff = (new Date().getTime() - new Date(get(Config.DATA_MAPPING.createdAt, latestRecurringOrder)).getTime()) / (1000 * 60 * 60 * 24);
                    if (daysDiff < ageLimit) {
                        const rawAmount = parseFloat(get(Config.DATA_MAPPING.amount, latestRecurringOrder) || '0');
                        const currency = get(Config.DATA_MAPPING.currency, latestRecurringOrder);
                        const isZeroDecimal = Config.ZERO_DECIMAL_CURRENCIES.includes(currency);

                        if (isZeroDecimal) {
                            recurringAmount = Math.round(rawAmount * 0.5);
                        } else {
                            recurringAmount = Math.floor((rawAmount * 0.5) / 50) * 50;
                        }
                    }
                }

                // Calculate Upsells
                const upsellOrders = successfulOrders.filter(o => (get(Config.DATA_MAPPING.description, o) || '').toLowerCase().includes('upsell'));
                upsellOrders.forEach(u => {
                    const isPaypal = (get(Config.DATA_MAPPING.paymentMethod, u) || '').includes('PAYPAL');
                    const ageLimit = isPaypal ? 180 : 125;
                    const daysDiff = (new Date().getTime() - new Date(get(Config.DATA_MAPPING.createdAt, u)).getTime()) / (1000 * 60 * 60 * 24);
                    if (daysDiff < ageLimit) upsellAmount += parseFloat(get(Config.DATA_MAPPING.amount, u) || '0');
                });

                if (recurringPaymentsCount < 2) {
                    const trialOrder = successfulOrders.find(o => o.paymentType === 'PAYMENT_TYPE_FIRST');
                    if (trialOrder) {
                        const isPaypal = (get(Config.DATA_MAPPING.paymentMethod, trialOrder) || '').includes('PAYPAL');
                        const ageLimit = isPaypal ? 180 : 125;
                        const daysDiff = (new Date().getTime() - new Date(get(Config.DATA_MAPPING.createdAt, trialOrder)).getTime()) / (1000 * 60 * 60 * 24);
                        if (daysDiff < ageLimit) trialAmount = parseFloat(get(Config.DATA_MAPPING.amount, trialOrder) || '0');
                    }
                }

                // Enforce Rule: Upsell always follows Trial.
                // In partial refunds, if the Trial is not being refunded (trialAmount == 0), then Upsells are also not refunded.
                if (trialAmount > 0) {
                    totalAmount = trialAmount + recurringAmount + upsellAmount;
                } else {
                    totalAmount = recurringAmount;
                    upsellAmount = 0; // Force upsell amount to 0 if trial is not included
                }
            }

            const breakdown = refundType === 'partial' && (trialAmount > 0 || recurringAmount > 0) ?
                { trial: Utils.formatAmount(trialAmount, currency), recurring: Utils.formatAmount(recurringAmount, currency), upsell: Utils.formatAmount(upsellAmount, currency) } : null;

            return { amount: `${Utils.formatAmount(totalAmount, currency)} ${currency}`, count: eligibleTxnCount, breakdown };
        }

        async getRefundDecision(orders, isCurrentOrderLatest = true, isChargeback = false, selectedChannel = null, isMcChargebackFull = false, ignoreRefundedStatus = false) {
            let logs = [];
            const get = Utils.get;

            if (selectedChannel) {
                orders = orders.filter(order => get(Config.DATA_MAPPING.channelName, order) === selectedChannel);
                logs.push({ check: 'Channel Filtering', result: `Channel: ${selectedChannel}`, outcome: 'Applied' });
            }

            const trialOrders = orders.filter(o => o.paymentType === 'PAYMENT_TYPE_FIRST');
            const ordersToExclude = new Set();
            trialOrders.forEach(trial => {
                const trialDate = Utils.getUtcDateString(get('createdAt', trial));
                const trialAmount = get('price.amount', trial);
                orders.forEach(order => {
                    if (get('id', order) !== get('id', trial) && get('paymentType', order) === 'PAYMENT_TYPE_RECURRING') {
                        // FIX: Ensure Upsells are not excluded as verification fees
                        const isUpsell = (get(Config.DATA_MAPPING.description, order) || '').toLowerCase().includes('upsell');

                        if (!isUpsell) {
                            const orderDate = Utils.getUtcDateString(get('createdAt', order));
                            const orderAmount = get('price.amount', order);
                            if (orderDate === trialDate && orderAmount === trialAmount) ordersToExclude.add(get('id', order));
                        }
                    }
                });
            });

            const allOrdersWithFlags = orders.map(order => ({ ...order, isExcludedDuplicate: ordersToExclude.has(get('id', order)) }));
            const processedOrders = allOrdersWithFlags.filter(order => !order.isExcludedDuplicate);

            for (let order of processedOrders) {
                if (order.paymentType === 'PAYMENT_TYPE_FIRST') {
                    const amountInCents = parseFloat(get(Config.DATA_MAPPING.amount, order) || '0');
                    const currency = get(Config.DATA_MAPPING.currency, order);
                    const conversionResult = await this.apiService.convertToUsdAndCheck(amountInCents, currency);
                    if (conversionResult.usdAmount !== null && conversionResult.usdAmount > 10) order.paymentType = 'PAYMENT_TYPE_RECURRING';
                }
            }

            const successfulOrders = processedOrders.filter(o => {
                const status = get(Config.DATA_MAPPING.status, o);
                return !['ORDER_STATUS_FAILED', 'ORDER_STATUS_AUTH_FAILED', 'ORDER_STATUS_DECLINED', 'ORDER_STATUS_PROCESSING', 'ORDER_STATUS_VOID_OK'].includes(status);
            });

            const referenceOrder = allOrdersWithFlags[0];
            const extraInfo = {
                email: get(Config.DATA_MAPPING.customerEmail, referenceOrder) || 'N/A',
                channel: get(Config.DATA_MAPPING.channelName, referenceOrder) || 'N/A',
                subscriptionId: successfulOrders.map(o => get(Config.DATA_MAPPING.subscriptionId, o)).find(id => id) || null,
                currency: get(Config.DATA_MAPPING.currency, referenceOrder) || 'USD',
                allOrders: allOrdersWithFlags,
                isMcChargebackFull: isMcChargebackFull
            };

            if (successfulOrders.length === 0) {
                logs.push({ check: 'Analysis Start', result: 'No successful transactions found', outcome: 'Analysis stopped' });
                return { decision: 'Refund rejected', reason: 'No successful transactions for refund.', logs, extraInfo, totalAmount: `0.00 ${extraInfo.currency}` };
            }

            const currentOrder = successfulOrders[0];

            // Fetch fresh details to ensure data is up-to-date (fix for stale cache)
            try {
                const freshTxDetails = await this.apiService.fetchTransactionDetails(get(Config.DATA_MAPPING.id, currentOrder));
                if (freshTxDetails && freshTxDetails.length > 0) {
                    let freshRefunded = 0;
                    let freshSettled = 0;
                    let latestRefundDate = null;

                    freshTxDetails.forEach(tx => {
                        const amt = parseFloat(tx.price.amount);
                        if (tx.type === 'TRANSACTION_TYPE_REFUND' && tx.status === 'TRANSACTION_STATUS_SUCCESS') {
                            freshRefunded += amt;
                            const txDate = new Date(tx.createdAt);
                            if (!latestRefundDate || txDate > latestRefundDate) {
                                latestRefundDate = txDate;
                            }
                        } else if (tx.type === 'TRANSACTION_TYPE_SETTLE') {
                            freshSettled += amt;
                        }
                    });

                    if (latestRefundDate) {
                        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        extraInfo.refundDate = `${latestRefundDate.getUTCDate()} ${months[latestRefundDate.getUTCMonth()]} ${latestRefundDate.getUTCFullYear()}`;
                    }

                    // Update currentOrder with fresh data
                    if (!currentOrder.price) currentOrder.price = {};
                    if (!currentOrder.price.refundedAmount) currentOrder.price.refundedAmount = {};
                    currentOrder.price.refundedAmount.amount = freshRefunded;

                    // Update status if fully refunded
                    if (freshSettled > 0 && freshRefunded >= freshSettled * 0.99) { // 0.99 tolerance
                        currentOrder.status = 'ORDER_STATUS_REFUNDED';
                    }
                }
            } catch (e) {
                console.error("Failed to refresh transaction details", e);
            }

            logs.push({ check: 'Analysis Start', result: `Transaction ID: ${get(Config.DATA_MAPPING.merchantOrderId, currentOrder)}`, outcome: 'Started' });

            const targetCountries = ['BRA', 'PER', 'MEX', 'CHL'];
            const targetChannel = 'pdfaid';
            const userCountry = get(Config.DATA_MAPPING.issuerCountry, currentOrder) || get(Config.DATA_MAPPING.geoCountry, currentOrder);
            const ipCountry = get(Config.DATA_MAPPING.ipCountry, currentOrder) || userCountry;
            const orderChannel = get(Config.DATA_MAPPING.channelName, currentOrder);
            const orderStatus = get(Config.DATA_MAPPING.status, currentOrder);
            const isSpecialVoidCase = targetCountries.includes(userCountry) && orderChannel === targetChannel && orderStatus === 'ORDER_STATUS_AUTH_OK';
            if (isSpecialVoidCase) logs.push({ check: 'Special Void Logic', result: 'Matches BRA/PER/MEX/CHL + pdfaid + Auth', outcome: 'Void Note Pending' });

            const subscriptionId = extraInfo.subscriptionId;
            if (subscriptionId) {
                logs.push({ check: 'Subscription Logs & Details', result: 'Fetching...', outcome: 'Pending' });
                const [subLogs, subDetails] = await Promise.all([
                    this.apiService.fetchSubscriptionLogs(subscriptionId),
                    this.apiService.fetchSubscriptionDetails(subscriptionId)
                ]);

                if (subDetails) {
                    extraInfo.subscriptionStatus = subDetails.status;
                    extraInfo.cancelledAt = subDetails.cancelledAt;
                }

                if (subLogs) {
                    const restoreLog = subLogs.find(l => l.name === 'subscription.restore');
                    if (restoreLog) {
                        logs.pop();
                        if (isChargeback) {
                            logs.push({ check: 'Subscription Logs', result: "Found 'subscription.restore' (Ignored for Chargeback)", outcome: 'Continue' });
                        } else if (ignoreRefundedStatus) {
                            logs.push({ check: 'Subscription Logs', result: "Found 'subscription.restore' (Ignored due to Force Check)", outcome: 'Continue' });
                        } else {
                            const hasRefunded = successfulOrders.some(o => {
                                const s = get(Config.DATA_MAPPING.status, o);
                                const amt = parseFloat(get(Config.DATA_MAPPING.amount, o));
                                const refAmt = parseFloat(get('price.refundedAmount.amount', o) || '0');
                                return s === 'ORDER_STATUS_REFUNDED' || (amt > 0 && refAmt / amt >= 0.95);
                            });
                            let reason = 'Subscription was restored by user (subscription.restore log found).';
                            if (hasRefunded) reason += ' + Refund already processed.';

                            logs.push({ check: 'Subscription Logs', result: "Found 'subscription.restore'", outcome: 'Refund Rejected' });
                            return { decision: 'Refund rejected', reason: reason, logs, extraInfo, totalAmount: `0.00 ${extraInfo.currency}` };
                        }
                    } else {
                        logs.pop();
                        logs.push({ check: 'Subscription Logs', result: "No 'subscription.restore' found", outcome: 'Continue' });
                    }
                } else {
                    logs.pop();
                    logs.push({ check: 'Subscription Logs', result: "Failed to fetch (Missing Creds?)", outcome: 'Skipped' });
                }
            }

            let decision = 'Refund rejected';
            let reason = '';
            let refundType = 'rejected';
            let recurringPaymentsCount = successfulOrders.filter(o => o.paymentType === 'PAYMENT_TYPE_RECURRING' && !(get(Config.DATA_MAPPING.description, o) || '').toLowerCase().includes('upsell')).length;

            if (isChargeback) {
                logs = [];
                logs.push({ check: 'Request Type', result: 'Chargeback', outcome: 'Special Processing' });
                const cardBrand = (get(Config.DATA_MAPPING.cardBrand, currentOrder) || 'unknown').toLowerCase();
                let eligibleTxnCount = 0;
                let totalRefundAmount = 0;
                let totalSettledAmount = 0;
                let breakdown = { recurring: 0, trial: 0, upsell: 0 };

                // PRE-CHECK: Determine if Trial (First) payment is eligible.
                // Upsells can only be refunded if the Trial is also eligible for refund.
                const trialOrder = successfulOrders.find(o => o.paymentType === 'PAYMENT_TYPE_FIRST');
                let isTrialEligibleForChb = false;
                if (trialOrder) {
                    const tMethod = get(Config.DATA_MAPPING.paymentMethod, trialOrder);
                    const tIsPaypal = (tMethod === 'PAYMENT_METHOD_PAYPAL' || tMethod === 'PAYMENT_METHOD_PAYPAL_VAULT');
                    // Age limit determination for Trial eligibility
                    let tAgeLimit = tIsPaypal ? 180 : 125;
                    if (cardBrand === 'mastercard' && isMcChargebackFull) tAgeLimit = 120;
                    else if (cardBrand === 'mastercard' && !isMcChargebackFull) tAgeLimit = 120; // Default to standard window for eligibility check even if we only refund last tx

                    const tDiff = (new Date().getTime() - new Date(get(Config.DATA_MAPPING.createdAt, trialOrder)).getTime()) / (1000 * 60 * 60 * 24);
                    if (tDiff < tAgeLimit) isTrialEligibleForChb = true;
                }

                let eligibleOrders = [];
                if (cardBrand === 'mastercard') {
                    if (isMcChargebackFull) {
                        eligibleOrders = successfulOrders.filter(o => {
                            const diff = (new Date().getTime() - new Date(get(Config.DATA_MAPPING.createdAt, o)).getTime()) / (1000 * 60 * 60 * 24);
                            return diff < 120;
                        });
                    } else {
                        // MC Last Tx Only (Default) -> NOW CHECK RECURRING COUNT
                        if (recurringPaymentsCount === 1) {
                            // If exactly 1 recurring payment, include Trial (and Upsells via standard filter if trial eligible)
                            eligibleOrders = successfulOrders.filter(o => {
                                const diff = (new Date().getTime() - new Date(get(Config.DATA_MAPPING.createdAt, o)).getTime()) / (1000 * 60 * 60 * 24);
                                return diff < 120;
                            });
                        } else {
                            eligibleOrders = [successfulOrders[0]];
                        }
                    }
                } else {
                    eligibleOrders = successfulOrders.filter(o => {
                        const paymentMethod = get(Config.DATA_MAPPING.paymentMethod, o);
                        const isPaypal = (paymentMethod === 'PAYMENT_METHOD_PAYPAL' || paymentMethod === 'PAYMENT_METHOD_PAYPAL_VAULT');
                        const ageLimit = isPaypal ? 180 : 125;
                        const diff = (new Date().getTime() - new Date(get(Config.DATA_MAPPING.createdAt, o)).getTime()) / (1000 * 60 * 60 * 24);
                        return diff < ageLimit;
                    });
                }

                // Apply Strict Filtering & Upsell Rule
                eligibleOrders = eligibleOrders.filter(o => {
                    const status = get(Config.DATA_MAPPING.status, o);
                    const isUpsell = (get(Config.DATA_MAPPING.description, o) || '').toLowerCase().includes('upsell');

                    // Upsell Rule: If Trial is NOT eligible, Upsell is automatically excluded.
                    if (isUpsell && !isTrialEligibleForChb) return false;

                    // ADDED ORDER_STATUS_APPROVED for PayPal support
                    return ['ORDER_STATUS_AUTH_OK', 'ORDER_STATUS_SETTLE_OK', 'ORDER_STATUS_REFUNDED', 'ORDER_STATUS_APPROVED'].includes(status);
                });

                for (const order of eligibleOrders) {
                    const orderId = get(Config.DATA_MAPPING.id, order);
                    const txDetails = await this.apiService.fetchTransactionDetails(orderId);

                    let settledAmount = 0;
                    let refundedAmount = 0;

                    if (txDetails && txDetails.length > 0) {
                        txDetails.forEach(tx => {
                            const amount = parseFloat(tx.price.amount);
                            if (tx.type === 'TRANSACTION_TYPE_SETTLE') {
                                settledAmount += amount;
                            } else if (tx.type === 'TRANSACTION_TYPE_REFUND' && tx.status === 'TRANSACTION_STATUS_SUCCESS') {
                                if (!ignoreRefundedStatus) {
                                    refundedAmount += amount;
                                }
                            }
                        });
                    }

                    if (settledAmount === 0) {
                         // Fallback: If no settlement log found (e.g. PayPal Approved or missing logs), use order amount.
                         // We already filtered eligibleOrders by valid statuses, so we can trust this order is valid.
                         // SAFETY FIX: Added || '0' to parsing to prevent NaN
                         settledAmount = parseFloat(get(Config.DATA_MAPPING.amount, order) || '0');
                    }

                    if (refundedAmount === 0 && !ignoreRefundedStatus) {
                        // Fallback: If no refund log found but order says refunded amount exists
                        refundedAmount = parseFloat(get('price.refundedAmount.amount', order) || '0');
                    }

                    const remaining = settledAmount - refundedAmount;
                    if (remaining > 0) {
                        totalRefundAmount += remaining;
                        totalSettledAmount += settledAmount;
                        eligibleTxnCount++;

                        const desc = get(Config.DATA_MAPPING.description, order);
                        const type = order.paymentType;
                        const currency = get(Config.DATA_MAPPING.currency, order);
                        const formattedRemaining = (Config.ZERO_DECIMAL_CURRENCIES.includes(currency) ? remaining : remaining / 100).toFixed(2);

                        if (type === 'PAYMENT_TYPE_FIRST') breakdown.trial += parseFloat(formattedRemaining);
                        else if ((desc || '').toLowerCase().includes('upsell')) breakdown.upsell += parseFloat(formattedRemaining);
                        else breakdown.recurring += parseFloat(formattedRemaining);
                    }
                }

                const currency = get(Config.DATA_MAPPING.currency, currentOrder);
                const formattedTotal = (Config.ZERO_DECIMAL_CURRENCIES.includes(currency) ? totalRefundAmount : totalRefundAmount / 100).toFixed(2);
                const totalAmountStr = `${formattedTotal} ${currency}`;

                const formattedSettledTotal = (Config.ZERO_DECIMAL_CURRENCIES.includes(currency) ? totalSettledAmount : totalSettledAmount / 100).toFixed(2);
                const templateTotalAmount = `${formattedSettledTotal} ${currency}`;

                if (eligibleTxnCount === 0) {
                    return { decision: 'Refund is already processed.', reason: "Inform client that refund is already processed from our side. <b>Don't forget to attach refund confirmation!</b>", logs, extraInfo: { ...extraInfo, eligibleTxnCount, isChargeback: true, breakdown }, totalAmount: totalAmountStr };
                }

                let decisionText = 'Full refund (Chargeback)';
                if (totalRefundAmount < totalSettledAmount) {
                    decisionText = 'Full refund (Chargeback after Partial refund)';
                }

                let reasonText = 'A full refund of ALL card transactions made within 125 days or PayPal transactions made within 180 days (including Trial)';

                if (cardBrand === 'mastercard') {
                    if (isMcChargebackFull) {
                        decisionText = 'Full refund (MC Chargeback - 120 Days)';
                        if (totalRefundAmount < totalSettledAmount) {
                            decisionText = 'Full refund (MC Chargeback - 120 Days after Partial refund)';
                        }
                        reasonText = 'Mastercard Chargeback: Full refund of all transactions within 120 days.';
                    } else {
                        if (recurringPaymentsCount === 1) {
                            decisionText = 'Full refund (MC Chargeback - 1 Recurring + Trial)';
                            if (totalRefundAmount < totalSettledAmount) {
                                decisionText = 'Full refund (MC Chargeback - 1 Recurring + Trial after Partial)';
                            }
                            reasonText = 'Mastercard Chargeback: 1 Recurring payment found. Refund Recurring + Trial.';
                        } else {
                            decisionText = 'Full refund (MC Chargeback - Last Tx Only)';
                            if (totalRefundAmount < totalSettledAmount) {
                                decisionText = 'Full refund (MC Chargeback - Last Tx Only after Partial refund)';
                            }
                            reasonText = 'Mastercard Chargeback: Refund only the last successful transaction.';
                        }
                    }
                }

                return { decision: decisionText, reason: reasonText, logs, extraInfo: { ...extraInfo, eligibleTxnCount, isChargeback: true, breakdown, templateTotalAmount }, totalAmount: totalAmountStr };
            }

            const trialOrder = successfulOrders.find(o => o.paymentType === 'PAYMENT_TYPE_FIRST');
            let isTrialRefundable = false;
            if (trialOrder) {
                const trialPaymentMethod = get(Config.DATA_MAPPING.paymentMethod, trialOrder);
                const isTrialPaypal = trialPaymentMethod === 'PAYMENT_METHOD_PAYPAL' || trialPaymentMethod === 'PAYMENT_METHOD_PAYPAL_VAULT';
                const trialAgeLimit = isTrialPaypal ? 180 : 125;
                const trialDaysDiff = (new Date().getTime() - new Date(get(Config.DATA_MAPPING.createdAt, trialOrder)).getTime()) / (1000 * 60 * 60 * 24);
                if (trialDaysDiff < trialAgeLimit) isTrialRefundable = true;
            }

            const paymentMethod = get(Config.DATA_MAPPING.paymentMethod, currentOrder);
            const isPaypal = paymentMethod === 'PAYMENT_METHOD_PAYPAL' || paymentMethod === 'PAYMENT_METHOD_PAYPAL_VAULT';
            const orderStatusName = this._getOrderStatusName(orderStatus);
            const totalRefundedAmount = parseFloat(get('price.refundedAmount.amount', currentOrder) || '0');
            const orderAmount = parseFloat(get(Config.DATA_MAPPING.amount, currentOrder));

            if (!ignoreRefundedStatus && (orderStatus === 'ORDER_STATUS_REFUNDED' || (orderAmount > 0 && totalRefundedAmount / orderAmount >= 0.95))) {
                logs.push({ check: 'Status Check', result: `Status: ${orderStatusName}`, outcome: 'Refund already processed' });
                decision = 'Refund is already processed.';
                const dateStr = extraInfo.refundDate ? ` on ${extraInfo.refundDate}` : '';
                reason = `Transaction already fully refunded${dateStr}.`;
            } else {
                if (ignoreRefundedStatus && (orderStatus === 'ORDER_STATUS_REFUNDED' || (orderAmount > 0 && totalRefundedAmount / orderAmount >= 0.95))) {
                    logs.push({ check: 'Status Check', result: `Status: ${orderStatusName} (Ignored)`, outcome: 'Continue' });
                }

                const validStatuses = ['ORDER_STATUS_SETTLE_OK', 'ORDER_STATUS_AUTH_OK', 'ORDER_STATUS_REFUNDED'];
                if (isPaypal) validStatuses.push('ORDER_STATUS_APPROVED');

                if (!validStatuses.includes(orderStatus) && !ignoreRefundedStatus) {
                    logs.push({ check: 'Status Check', result: `Status: ${orderStatusName}`, outcome: 'Refund impossible' });
                    reason = `Refund impossible for transaction with status '${orderStatusName}'.`;
                } else {
                    if (!ignoreRefundedStatus) logs.push({ check: 'Status Check', result: `Status: ${orderStatusName}`, outcome: 'Continue' });
                    const ageLimit = isPaypal ? 180 : 125;
                    const daysDiff = (new Date().getTime() - new Date(get(Config.DATA_MAPPING.createdAt, currentOrder)).getTime()) / (1000 * 60 * 60 * 24);

                    if (daysDiff >= ageLimit) {
                        logs.push({ check: 'Transaction Age', result: `${Math.floor(daysDiff)}d (>= ${ageLimit}d)`, outcome: 'Analysis stopped' });
                        reason = `Transaction age ${Math.floor(daysDiff)}d (>= ${ageLimit}d).`;
                    } else {
                        logs.push({ check: 'Transaction Age', result: `${Math.floor(daysDiff)}d (< ${ageLimit}d)`, outcome: 'Continue' });
                        const disputeInfo = get(Config.DATA_MAPPING.altGateDispute, currentOrder);

                        if (disputeInfo && disputeInfo.id) {
                            const disputeStatusName = this._getDisputeStatusName(disputeInfo.status);
                            logs.push({ check: 'Dispute Check', result: `Dispute found - ${disputeStatusName}`, outcome: 'Forward to billing' });
                            decision = 'Forward to billing';
                            refundType = 'rejected';
                            reason = `User has an active dispute (status: ${disputeStatusName}). Forward request to billing.`;
                            extraInfo.billingTicketLink = `https://hub.solidgate.com/billing/tickets/new?order_id=${get(Config.DATA_MAPPING.merchantOrderId, currentOrder)}`;
                        } else {
                            logs.push({ check: 'Dispute Check', result: 'No disputes found', outcome: 'Continue' });
                            const firstTransaction = [...successfulOrders].sort((a, b) => new Date(get(Config.DATA_MAPPING.createdAt, a)) - new Date(get(Config.DATA_MAPPING.createdAt, b)))[0];
                            const subscriptionStartDate = new Date(get(Config.DATA_MAPPING.createdAt, firstTransaction));
                            const daysSinceSubStart = (new Date().getTime() - subscriptionStartDate.getTime()) / (1000 * 60 * 60 * 24);
                            const trialDateStr = subscriptionStartDate.toISOString().split('T')[0];

                            if (daysSinceSubStart <= 14 && Config.SCA_COUNTRIES.includes(ipCountry)) {
                                logs.push({ check: 'SCA/UK 14-day rule', result: `IP Country ${ipCountry}, ${Math.floor(daysSinceSubStart)}d since ${trialDateStr}`, outcome: 'Full refund recommended' });
                                decision = 'Full refund';
                                refundType = 'full';
                                reason = `SCA/UK region (${ipCountry}) and less than 14 days since subscription start.`;
                            } else {
                                logs.push({ check: 'SCA/UK 14-day rule', result: `IP Country ${ipCountry}, ${Math.floor(daysSinceSubStart)}d since ${trialDateStr}`, outcome: 'Rule does not apply' });

                                if (!isPaypal) {
                                    const cardBrand = (get(Config.DATA_MAPPING.cardBrand, currentOrder) || 'unknown').toLowerCase();
                                    const highRiskBrands = ['discover', 'amex'];

                                    if (!highRiskBrands.includes(cardBrand)) {
                                        const rawCardType = get(Config.DATA_MAPPING.cardType, currentOrder) || 'UNKNOWN';
                                        const riskValue = this.riskManager.getRisk(userCountry, cardBrand, rawCardType);

                                        let isLowRisk = false;
                                        let lowRiskReason = '';

                                        if (riskValue === 1 && orderChannel === 'pdfaid') {
                                            logs.push({ check: 'Low Risk (Pre-Trial)', result: `Combo (${userCountry}, ${cardBrand}, ${rawCardType}) = Low Risk for pdfaid`, outcome: 'Refund Rejected' });
                                            isLowRisk = true;
                                            lowRiskReason = 'Transaction identified as Low-risk per pdfaid rules.';
                                        } else if (cardBrand === 'mastercard') {
                                            // MODIFIED: Mastercard is now rejected by default as per request.
                                            logs.push({ check: 'Low Risk (Pre-Trial)', result: 'Mastercard (Default)', outcome: 'Refund Rejected' });
                                            isLowRisk = true;
                                            lowRiskReason = 'Mastercard is Low-risk by default.';
                                        } else if (!['visa', 'mastercard'].includes(cardBrand)) {
                                            logs.push({ check: 'Low Risk (Pre-Trial)', result: `Brand: ${cardBrand}`, outcome: 'Refund Rejected' });
                                            isLowRisk = true;
                                            lowRiskReason = `Low-risk transaction (card: ${cardBrand.toUpperCase()}).`;
                                        }

                                        if (isLowRisk) {
                                            decision = 'Refund rejected';
                                            reason = lowRiskReason;
                                            const { amount: totalAmount, count: eligibleTxnCount, breakdown } = this.calculateRefundAmount(processedOrders, 'rejected', extraInfo.currency, recurringPaymentsCount, null, ignoreRefundedStatus);
                                            return { decision, reason, logs, extraInfo: { ...extraInfo, eligibleTxnCount, breakdown }, totalAmount };
                                        }
                                    }
                                }

                                if (currentOrder.paymentType === 'PAYMENT_TYPE_FIRST' && recurringPaymentsCount === 0) {
                                    logs.push({ check: 'Trial Only', result: 'First payment, 0 recurring', outcome: 'Full refund recommended' });
                                    decision = 'Full refund';
                                    refundType = 'full';
                                    reason = 'User has only a Trial subscription.';
                                } else {
                                    logs.push({ check: 'Trial Only', result: 'This is not the only Trial transaction', outcome: 'Continue' });

                                    if (isPaypal) {
                                        logs.push({ check: 'Payment Method', result: `Paypal, ${recurringPaymentsCount} recurring`, outcome: 'Paypal logic applies' });
                                        if (recurringPaymentsCount >= 2) {
                                            decision = 'Partial refund';
                                            refundType = 'partial';
                                            let reasonText = 'Paypal, 2+ subscriptions. Refund 50% of last payment.';
                                            if (isTrialRefundable) reasonText += ' Trial - on request.';
                                            reason = reasonText;
                                        } else {
                                            decision = 'Full refund';
                                            refundType = 'full';
                                            reason = 'Paypal. User with one subscription.';
                                        }
                                    } else {
                                        logs.push({ check: 'Payment Method', result: 'Not Paypal', outcome: 'Proceeding with card rules' });
                                        const cardBrand = (get(Config.DATA_MAPPING.cardBrand, currentOrder) || 'unknown').toLowerCase();
                                        const highRiskBrands = ['discover', 'amex'];
                                        const defaultRiskBrands = ['visa', 'mastercard'];

                                        if (highRiskBrands.includes(cardBrand)) {
                                            logs.push({ check: 'Risk Category', result: `High-risk brand (${cardBrand.toUpperCase()})`, outcome: 'Full refund recommended' });
                                            decision = 'Full refund';
                                            refundType = 'full';
                                            reason = `Refund policy for ${cardBrand.toUpperCase()} cards.`;
                                        } else if (defaultRiskBrands.includes(cardBrand)) {
                                            logs.push({ check: 'Subscription Count', result: `${recurringPaymentsCount} recurring payments`, outcome: 'Analyze' });
                                            if (recurringPaymentsCount >= 2) {
                                                if (isCurrentOrderLatest) {
                                                    logs.push({ check: '2+ subscriptions', result: 'Latest transaction of the last payment', outcome: 'Partial refund recommended' });
                                                    decision = 'Partial refund';
                                                    refundType = 'partial';
                                                    let reasonText = '2+ subscriptions. Refund 50% of last payment.';
                                                    if (isTrialRefundable) reasonText += ' Trial - on request.';
                                                    reason = reasonText;
                                                } else {
                                                    logs.push({ check: '2+ subscriptions', result: 'This is not the latest transaction', outcome: 'Refund not recommended' });
                                                    reason = 'User with 2+ subscriptions, but this is not the latest transaction.';
                                                }
                                            } else {
                                                const amountInCents = parseFloat(get(Config.DATA_MAPPING.amount, currentOrder) || '0');
                                                const currency = get(Config.DATA_MAPPING.currency, currentOrder);
                                                const conversionResult = await this.apiService.convertToUsdAndCheck(amountInCents, currency);
                                                const logResult = `${conversionResult.originalAmount.toFixed(Config.ZERO_DECIMAL_CURRENCIES.includes(currency) ? 0 : 2)} ${currency} (~${conversionResult.usdAmount !== null ? conversionResult.usdAmount.toFixed(2) : 'N/A'} USD)`;

                                                if (conversionResult.isLessThan5) {
                                                    logs.push({ check: 'Transaction Amount', result: `${logResult} (<= 5 USD)`, outcome: 'Full refund recommended' });
                                                    decision = 'Full refund';
                                                    refundType = 'full';
                                                    reason = `Small transaction amount.`;
                                                } else {
                                                    logs.push({ check: 'Transaction Amount', result: `${logResult} (> 5 USD)`, outcome: 'Continue' });
                                                    // MODIFIED: Removed the "Mastercard Allowed" check here. It now falls through to the logic below (or was caught by the Low Risk check earlier).
                                                    logs.push({ check: 'Final Rule', result: '1 subscription (Visa)', outcome: 'Partial refund recommended' });
                                                    decision = 'Partial refund';
                                                    refundType = 'partial';
                                                    reason = '1 subscription (Visa). Refund Trial + 50% subscription.';
                                                }
                                            }
                                        } else {
                                            logs.push({ check: 'Risk Category', result: `Low-risk brand (${cardBrand.toUpperCase()})`, outcome: 'Refund rejected' });
                                            reason = `Low-risk transaction (card: ${cardBrand.toUpperCase()}).`;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (isSpecialVoidCase) reason += " ⚠️ IMPORTANT: expert need to refund not settled transactions used Void instead of settle+refund.";

            const { amount: totalAmount, count: eligibleTxnCount, breakdown } = this.calculateRefundAmount(processedOrders, refundType, extraInfo.currency, recurringPaymentsCount, null, ignoreRefundedStatus);
            extraInfo.eligibleTxnCount = eligibleTxnCount;
            extraInfo.breakdown = breakdown;

            if (eligibleTxnCount === 0 && (decision.toLowerCase().includes('full refund') || decision.toLowerCase().includes('partial refund'))) {
                decision = 'Refund is already processed.';
                reason = "Inform client that refund is already processed from our side. <b>Don't forget to attach refund confirmation!</b>";
            }

            return { decision, reason, logs, extraInfo, totalAmount };
        }
    }

    // --- UI MANAGER ---
    class UIManager {
        static addCheckButton() {
            if (document.getElementById('refund-controls-container')) return;

            const container = document.createElement('div');
            container.id = 'refund-controls-container';
            container.style.cssText = 'position:fixed; left:20px; top:50%; transform:translateY(-50%); z-index:9999; display:flex; flex-direction:column; gap:10px;';

            const btnStyle = 'padding:12px 20px; color:white; border:none; border-radius:8px; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.2); transition:all 0.3s; font-family:Arial,sans-serif; font-size:14px; font-weight:bold; text-align:center; min-width:160px;';

            const createBtn = (text, color, hoverColor, onClick) => {
                const btn = document.createElement('button');
                btn.innerText = text;
                btn.style.cssText = btnStyle + `background-color:${color};`;
                btn.onmouseover = () => { btn.style.backgroundColor = hoverColor; };
                btn.onmouseout = () => { btn.style.backgroundColor = color; };
                btn.onclick = onClick;
                return btn;
            };

            container.appendChild(createBtn('Consider refund', '#6a5acd', '#5a4abd', () => App.handleAnalysisClick(false)));
            container.appendChild(createBtn('Potential chargeback', '#fd7e14', '#e36d0c', () => App.handleAnalysisClick(true)));
            container.appendChild(createBtn('Simulator', '#20c997', '#1aa179', () => App.createSimulationModal()));

            const statusDiv = document.createElement('div');
            statusDiv.id = 'sg-cred-status';
            statusDiv.style.cssText = 'font-size:10px; color:#fff; text-align:center; background:rgba(0,0,0,0.5); padding:4px; border-radius:4px; margin-top:5px;';
            statusDiv.innerText = 'Logs: Waiting...';
            container.appendChild(statusDiv);

            document.body.appendChild(container);
            this.updateCredentialStatus(!!App.apiService.capturedAccountId);
        }

        static updateCredentialStatus(hasCreds) {
            const el = document.getElementById('sg-cred-status');
            if (!el) return;
            if (hasCreds) {
                el.innerText = 'Logs: Ready (Acc ID captured)';
                el.style.color = '#2ecc71';
            } else {
                el.innerText = 'Logs: Waiting for Acc ID...';
                el.style.color = '#f39c12';
            }
        }

        static showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            const colors = { success: '#28a745', warning: '#ffc107', error: '#dc3545', info: '#17a2b8' };
            notification.style.cssText = `position:fixed; top:20px; right:20px; padding:15px 35px 15px 20px; background-color:${colors[type]}; color:white; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.2); z-index:10001; transition:opacity 0.5s, transform 0.5s; opacity:0; transform:translateX(100%);`;
            notification.innerText = message;

            const closeBtn = document.createElement('span');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = 'position:absolute; right:10px; top:50%; transform:translateY(-50%); cursor:pointer; font-weight:bold; font-size:18px; opacity:0.8;';
            closeBtn.onmouseover = () => { closeBtn.style.opacity = '1'; };
            closeBtn.onmouseout = () => { closeBtn.style.opacity = '0.8'; };
            closeBtn.onclick = () => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 500);
            };
            notification.appendChild(closeBtn);

            document.body.appendChild(notification);
            setTimeout(() => { notification.style.opacity = '1'; notification.style.transform = 'translateX(0)'; }, 10);
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(() => notification.remove(), 500);
                }
            }, 4000);
        }

        static generateResponseTemplate(decision, totalAmount, isChargeback, isMcChargebackFull, paymentMethod, subscriptionStatus, formattedCancelDate, refundDate) {
            const isPaypal = (paymentMethod || '').toUpperCase().includes('PAYPAL');
            let days = isPaypal ? 180 : 125;
            if (isMcChargebackFull) days = 120;

            const cleanDecision = decision.toLowerCase();
            const isMcDefaultChb = isChargeback && decision.includes('Last Tx Only');

            let cancelText = "I’ve also canceled your subscription to prevent further charges.";
            if (subscriptionStatus === 'STATUS_CANCELLED') {
                cancelText = "Your subscription has already been cancelled, so you won't be charged anymore until you decide to resubscribe.";
            } else if (subscriptionStatus === 'STATUS_ACTIVE' && formattedCancelDate) {
                cancelText = `I’ve also canceled your subscription to prevent further charges. Access will remain active until ${formattedCancelDate}.`;
            }

            if ((!isChargeback && cleanDecision.includes('full')) || isMcDefaultChb) {
                return `I’m really sorry to see you go, but I completely respect your decision.\n\nI’ve approved your refund request, and a total of ${totalAmount} will be returned to your account within 7 business days, though in rare cases it may take up to 30 days, depending on your payment provider. You’ll receive the funds back via your original payment method.\n\nIf you don’t see it after that time, I recommend checking directly with your payment provider for more details.\n\n${cancelText}\n\nIf there’s anything else I can assist with in the meantime, feel free to let me know.`;
            }
            if (cleanDecision.includes('partial')) {
                return `Thank you for your patience — I’ve completed the review of your request. Based on our internal criteria, you’re eligible for a 50% refund of your most recent charge.\n\nThis is in line with our refund policy, and we always aim to provide the best possible option based on the situation. The refund of ${totalAmount} has been processed and should reach your account within 7 business days, though in rare cases it may take up to 30 days, depending on your payment provider. You’ll receive the funds back via your original payment method.\n\nIf you don’t see it after that time, I recommend checking directly with your payment provider for more details.\n\n${cancelText}`;
            }
            if (cleanDecision.includes('rejected')) {
                return `I’ve carefully reviewed your account and want to clarify that your subscription was activated directly by you — full details, including the recurring fee and cancellation terms, were available during sign-up and confirmed through acceptance of our Terms of Service.\n\nYour refund request has been rejected.\n\n${cancelText}`;
            }
            if (decision === 'Refund is already processed.') {
                const dateStr = refundDate || 'DATE';
                return `I’m sorry that our service did not meet your expectations. Once again, I’d like to confirm that a refund was issued to your account on ${dateStr}.\n\nPlease, see attached a confirmation of a refund being processed on our side.\n\nRefunds typically take 5-7 business days to process, though in rare cases it may take up to 30 days, depending on your payment provider.\n\nIf you don’t see it after that time, I recommend checking directly with your payment provider for more details.`;
            }
            if (isChargeback) {
                return `Normally, our Terms of Use & Service don’t allow refunds for recurring charges.\n\nHowever, after carefully reviewing your situation, I’ve decided to make a one-time exception and issue a full refund for all transactions made over the last ${days} days.\n\nA total of ${totalAmount} will be credited back to your original payment method within 7 business days, though in rare cases it may take up to 30 days, depending on your payment provider. You’ll receive the funds back via your original payment method.\n\nIf you don’t see it after that time, I recommend checking directly with your payment provider for more details.\n\n${cancelText}\n\nI truly hope this resolves the issue, and thank you for your patience throughout the process.`;
            }
            return 'No template available for this decision.';
        }

        static showLoadingModal() {
            const existingModal = document.getElementById('refund-result-modal');
            if (existingModal) existingModal.remove();

            const modal = document.createElement('div');
            modal.id = 'refund-result-modal'; // Reuse ID to be replaced later
            modal.style.cssText = 'position:fixed; left:50%; top:50%; transform:translate(-50%, -50%); width:300px; background-color:white; border-radius:12px; box-shadow:0 6px 20px rgba(0,0,0,0.25); z-index:10000; font-family:Arial, sans-serif; padding: 30px; text-align: center;';

            modal.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #6a5acd; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                </div>
                <div style="color: #555; font-size: 16px; font-weight: bold;">Analyzing transaction...</div>
                <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
            `;

            document.body.appendChild(modal);
        }

        static displayChannelSelectionModal(channels, onConfirm) {
            const existingModal = document.getElementById('channel-selection-modal');
            if (existingModal) existingModal.remove();

            const modal = document.createElement('div');
            modal.id = 'channel-selection-modal';
            modal.style.cssText = 'position:fixed; left:50%; top:50%; transform:translate(-50%, -50%); width:400px; max-width:95%; background-color:white; border-radius:12px; box-shadow:0 6px 20px rgba(0,0,0,0.25); z-index:10001; font-family:Arial, sans-serif; padding: 25px;';
            modal.innerHTML = `
                <h3 style="margin: 0 0 20px; font-size: 18px; color: #333; text-align: center;">Select Channel</h3>
                <div id="channel-options" style="margin-bottom: 20px;">
                    ${channels.map(channel => `<div style="margin-bottom: 10px;"><input type="radio" name="channel" id="channel_${channel}" value="${channel}" style="margin-right: 8px;"><label for="channel_${channel}" style="font-size: 14px; color: #555;">${channel}</label></div>`).join('')}
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <button id="cancel-channel-selection" style="padding: 8px 15px; background-color: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer;">Cancel</button>
                    <button id="confirm-channel-selection" style="padding: 8px 15px; background-color: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer;">Confirm</button>
                </div>
            `;
            document.body.appendChild(modal);

            const removeModal = () => { if (modal.parentNode) modal.parentNode.removeChild(modal); document.removeEventListener('keydown', handleEsc); };
            const handleEsc = (e) => { if (e.key === 'Escape') removeModal(); };
            document.addEventListener('keydown', handleEsc);

            document.getElementById('confirm-channel-selection').addEventListener('click', () => {
                const selectedChannel = document.querySelector('input[name="channel"]:checked')?.value;
                if (selectedChannel) { onConfirm(selectedChannel); removeModal(); } else { this.showNotification('Please select a channel.', 'warning'); }
            });
            document.getElementById('cancel-channel-selection').addEventListener('click', removeModal);
        }

        static displayResult(result, isCurrentOrderLatest = true, isChargeback = false, selectedChannel = null) {
            const existingModal = document.getElementById('refund-result-modal');
            if (existingModal) existingModal.remove();

            const modal = document.createElement('div');
            modal.id = 'refund-result-modal';
            modal.style.cssText = 'position:fixed; left:50%; top:50%; transform:translate(-50%, -50%); width:700px; max-width:95%; background-color:white; border-radius:12px; box-shadow:0 6px 20px rgba(0,0,0,0.25); z-index:10000; font-family:Arial, sans-serif;';

            let decisionColor = '#333';
            if (result.decision.toLowerCase().includes('full refund')) decisionColor = '#28a745';
            else if (result.decision.toLowerCase().includes('partial refund') || result.decision === 'Refund is already processed.') decisionColor = '#ffc107';
            else if (result.decision.toLowerCase().includes('rejected') || result.decision === 'Forward to billing' || result.decision === 'Automation') decisionColor = '#dc3545';

            const logsHtml = result.logs.map(log => `
                <li style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; align-items: center;">
                    <span style="color: #555; flex-basis: 30%; text-align: left;">${log.check}</span>
                    <span style="color: #333; flex-basis: 40%; text-align: center;">${log.result}</span>
                    <span style="color: ${log.outcome.includes('Continue') || log.outcome.includes('Started') || log.outcome.includes('analysis') ? '#6c757d' : '#000'}; font-weight: bold; flex-basis: 30%; text-align: right;">${log.outcome}</span>
                </li>`).join('');

            const get = Utils.get;
            const latestOrder = result.extraInfo.allOrders[0];
            const paymentMethod = get(Config.DATA_MAPPING.paymentMethod, latestOrder);
            let formattedCancelDate = null;
            if (result.extraInfo.cancelledAt) {
                const d = new Date(result.extraInfo.cancelledAt);
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                formattedCancelDate = `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
            }

            const templateText = this.generateResponseTemplate(result.decision, result.extraInfo.templateTotalAmount || result.totalAmount, isChargeback, result.extraInfo.isMcChargebackFull, paymentMethod, result.extraInfo.subscriptionStatus, formattedCancelDate, result.extraInfo.refundDate);
            const subscriptionLink = result.extraInfo.subscriptionId ? `<a href="https://hub.solidgate.com/billing/subscription/${result.extraInfo.subscriptionId}" target="_blank" style="color: #6a5acd; text-decoration: none;">${result.extraInfo.subscriptionId}</a>` : 'N/A';
            const billingTicketLink = result.extraInfo.billingTicketLink ? `<a href="${result.extraInfo.billingTicketLink}" target="_blank" style="color: #6a5acd; text-decoration: none; display: inline-block; margin-top: 5px;">Create Billing Ticket</a>` : '';
            const calculationNote = result.decision !== 'Refund rejected' && result.decision !== 'Forward to billing' && result.decision !== 'Automation' && result.decision !== 'Refund is already processed.' && !result.extraInfo.isChargeback ? `<p style="margin: 5px 0 0; color: #666; font-size: 12px;">(Calculation based on ${result.extraInfo.eligibleTxnCount} eligible transactions)</p>` : '';

            let amountDisplayHtml = `<span style="font-size: 22px; font-weight: bold; color: ${decisionColor};">${result.totalAmount}</span>`;
            if (result.extraInfo.breakdown) {
                const b = result.extraInfo.breakdown;
                const parts = [];
                const isPartial = result.decision.toLowerCase().includes('partial');
                if (parseFloat(b.recurring) > 0) parts.push(`${b.recurring}${isPartial ? ' (50%)' : ''}`);
                if (parseFloat(b.trial) > 0) parts.push(`${b.trial} (Trial)`);
                if (parseFloat(b.upsell) > 0) parts.push(`${b.upsell} (Upsell)`);
                if (parts.length > 0) amountDisplayHtml = `<span style="font-size: 22px; font-weight: bold; color: ${decisionColor};">${result.totalAmount}</span><div style="font-size: 14px; color: #FF4500; font-weight: bold; margin-top: 5px;">(${parts.join(' + ')})</div>`;
            }

            const transactionDetailsHtml = result.extraInfo.allOrders.map(order => {
                const paymentMethod = get(Config.DATA_MAPPING.paymentMethod, order);
                const isPaypal = (paymentMethod === 'PAYMENT_METHOD_PAYPAL' || paymentMethod === 'PAYMENT_METHOD_PAYPAL_VAULT');
                const ageLimit = isPaypal ? 180 : 125;
                const transactionDate = new Date(get(Config.DATA_MAPPING.createdAt, order));
                const daysDiff = (new Date() - transactionDate) / (1000 * 60 * 60 * 24);
                const isEligible = daysDiff < ageLimit;
                const status = get(Config.DATA_MAPPING.status, order);
                const isFailed = status === 'ORDER_STATUS_FAILED' || status === 'ORDER_STATUS_AUTH_FAILED' || status === 'ORDER_STATUS_DECLINED' || status === 'ORDER_STATUS_PROCESSING' || status === 'ORDER_STATUS_VOID_OK';
                const currency = get(Config.DATA_MAPPING.currency, order);
                const amount = parseFloat(get(Config.DATA_MAPPING.amount, order));
                const displayAmount = Utils.formatAmount(amount, currency);
                const totalRefundedAmount = parseFloat(get('price.refundedAmount.amount', order) || '0');
                const isRefunded = status === 'ORDER_STATUS_REFUNDED' || (amount > 0 && totalRefundedAmount / amount >= 0.95);
                const isExcluded = order.isExcludedDuplicate;

                let eligibilityText = '';
                if (isExcluded) eligibilityText = `<span style="color: #6c757d;">(Excluded - Card verification fee)</span>`;
                else if (isRefunded) eligibilityText = `<span style="color: #b75705;">(Refunded)</span>`;
                else if (isFailed) eligibilityText = `<span style="color: #6c757d;">(Failed)</span>`;
                else if (isEligible) eligibilityText = `<span style="color: #28a745;">(Included)</span>`;
                else eligibilityText = `<span style="color: #dc3545;">(Outdated)</span>`;

                return `<li style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 8px 0; border-bottom: 1px solid #f0f0f0; align-items: center; font-size: 12px;"><span>${get(Config.DATA_MAPPING.merchantOrderId, order)}</span><span style="text-align: center;">${transactionDate.toLocaleDateString('en-GB')}</span><span style="text-align: center;">${displayAmount} ${currency}</span><span style="text-align: right;">${eligibilityText}</span></li>`;
            }).join('');

            const recalcSection = `
                <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
                    <div style="display: flex; align-items: center; margin-bottom: 10px;"><input type="checkbox" id="notLatestTransaction" ${isCurrentOrderLatest ? '' : 'checked'} style="margin-right: 8px;"><label for="notLatestTransaction" style="font-size: 14px; color: #555;">This is not the latest transaction</label></div>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;"><input type="checkbox" id="chargeback" ${isChargeback ? 'checked' : ''} style="margin-right: 8px;"><label for="chargeback" style="font-size: 14px; color: #555;">Processing Chargeback</label></div>
                    <div style="display: flex; align-items: center; margin-bottom: 10px;"><input type="checkbox" id="ignoreRefunded" style="margin-right: 8px;"><label for="ignoreRefunded" style="font-size: 14px; color: #555;">Ignore Refunded Status (Force Check)</label></div>
                    ${isChargeback ? `<div style="display: flex; align-items: center; margin-bottom: 10px; margin-left: 20px;"><input type="checkbox" id="mcChargebackFull" ${result.extraInfo.isMcChargebackFull ? 'checked' : ''} style="margin-right: 8px;"><label for="mcChargebackFull" style="font-size: 14px; color: #555;">Returned after potential chargeback MC</label></div>` : ''}
                    <button id="recalculate-button" style="padding: 8px 15px; background-color: #6a5acd; color: white; border: none; border-radius: 6px; cursor: pointer;">Recalculate</button>
                </div>`;

            modal.innerHTML = `
                <div style="padding: 20px 25px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;"><h2 style="margin: 0; color: #333; font-size: 20px;">Refund Check Result</h2><button id="close-refund-modal-top" style="background: #f1f1f1; border: none; border-radius: 50%; width: 28px; height: 28px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #555; font-size: 16px; transition: all 0.2s;">×</button></div>
                <div style="padding: 25px; max-height: 80vh; overflow-y: auto;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; font-size: 14px; background: #f9f9f9; padding: 15px; border-radius: 8px;">
                        <div><strong>Email:</strong> ${result.extraInfo.email}</div>
                        <div><strong>Channel:</strong> ${result.extraInfo.channel}</div>
                        <div><strong>Subscription ID:</strong> ${subscriptionLink}</div>
                        <div>
                            <strong>Sub Status:</strong>
                            ${(() => {
                    const status = result.extraInfo.subscriptionStatus;
                    const cancelledAt = result.extraInfo.cancelledAt;
                    if (status === 'STATUS_CANCELLED') {
                        return `<span style="color: #dc3545; font-weight: bold;">Cancelled</span>`;
                    } else if (status === 'STATUS_ACTIVE' && cancelledAt) {
                        return `<span style="color: #fd7e14; font-weight: bold;">Active (Soft Cancel)</span>
                                            <div style="font-size: 11px; color: #dc3545; margin-top: 2px;">Will be cancelled at: ${formattedCancelDate}</div>`;
                    } else if (status === 'STATUS_ACTIVE') {
                        return `<span style="color: #28a745; font-weight: bold;">Active</span>`;
                    } else if (status === 'STATUS_PAUSED') {
                        return `<span style="color: #b86b12; font-weight: bold;">Paused</span>`;
                    } else {
                        return `<span style="color: #6c757d; font-weight: bold;">${(status || 'N/A').replace('STATUS_', '')}</span>`;
                    }
                })()}
                        </div>
                    </div>
                    <div style="margin-bottom: 20px; text-align: center; background-color: #f0f0f0; padding: 15px; border-radius: 8px;"><strong style="display: block; color: #555; margin-bottom: 5px; font-size: 16px;">Decision:</strong><span style="font-size: 28px; font-weight: bold; color: ${decisionColor};">${result.decision}</span>${result.decision !== 'Refund rejected' && result.decision !== 'Forward to billing' && result.decision !== 'Automation' && result.decision !== 'Refund is already processed.' ? `<strong style="display: block; color: #555; margin-top: 10px; font-size: 16px;">Refund Amount:</strong>${amountDisplayHtml}` : ''}<p style="margin: 5px 0 0; color: #666;">${result.reason}</p>${calculationNote}${result.decision === 'Forward to billing' ? `<div style="margin-top: 10px; text-align: center;">${billingTicketLink}</div>` : ''}</div>
                    <div style="margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px; padding: 15px; background: #fff;"><div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;"><strong style="color: #333; font-size: 14px;">Response Template</strong><button id="copy-template-btn" style="font-size: 12px; padding: 4px 8px; cursor: pointer; border: 1px solid #ccc; background: #eee; border-radius: 4px;">Copy Text</button></div><div id="template-text" style="background: #f9f9f9; padding: 10px; font-size: 12px; color: #555; white-space: pre-wrap; border-radius: 4px; border: 1px solid #eee;">${templateText}</div></div>
                    <div><h3 style="margin: 0 0 10px; font-size: 16px; color: #333; border-bottom: 2px solid #6a5acd; padding-bottom: 5px;">Check Log (for last transaction):</h3><ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;">${logsHtml}</ul></div>
                    <div style="margin-top: 20px;"><h3 style="margin: 0 0 10px; font-size: 16px; color: #333; border-bottom: 2px solid #6a5acd; padding-bottom: 5px;">Transaction Details:</h3><ul style="list-style: none; padding: 0; margin: 0; font-size: 14px;"><li style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding-bottom: 5px; border-bottom: 2px solid #333; font-weight: bold;"><span>Transaction ID</span><span style="text-align: center;">Date</span><span style="text-align: center;">Amount</span><span style="text-align: right;">Status</span></li>${transactionDetailsHtml}</ul></div>
                    ${recalcSection}
                </div>`;

            document.body.appendChild(modal);

            const removeModal = () => { if (modal.parentNode) modal.parentNode.removeChild(modal); document.removeEventListener('keydown', handleEsc); };
            const handleEsc = (e) => { if (e.key === 'Escape') removeModal(); };
            document.addEventListener('keydown', handleEsc);
            document.getElementById('close-refund-modal-top').addEventListener('click', removeModal);
            document.getElementById('copy-template-btn').addEventListener('click', () => {
                const text = document.getElementById('template-text').innerText;
                navigator.clipboard.writeText(text);
                const btn = document.getElementById('copy-template-btn');
                const originalText = btn.innerText;
                btn.innerText = 'Copied!';
                setTimeout(() => { btn.innerText = originalText; }, 2000);
            });

            document.getElementById('recalculate-button').addEventListener('click', async () => {
                const isLatestChecked = !document.getElementById('notLatestTransaction').checked;
                const isChargebackChecked = document.getElementById('chargeback').checked;
                const isIgnoreRefundedChecked = document.getElementById('ignoreRefunded').checked;
                let isMcFull = false;
                const mcCheckbox = document.getElementById('mcChargebackFull');
                if (mcCheckbox) isMcFull = mcCheckbox.checked;

                try {
                    const dataset = App.simulatedOrders.length > 0 && !App.lastCapturedOrders ? App.simulatedOrders : (App.lastCapturedOrders || App.simulatedOrders);
                    const recalculatedResult = await App.refundCalculator.getRefundDecision(dataset, isLatestChecked, isChargebackChecked, selectedChannel, isMcFull, isIgnoreRefundedChecked);
                    removeModal();
                    this.displayResult(recalculatedResult, isLatestChecked, isChargebackChecked, selectedChannel);
                    setTimeout(() => { const newIgnoreBox = document.getElementById('ignoreRefunded'); if (newIgnoreBox) newIgnoreBox.checked = isIgnoreRefundedChecked; }, 50);
                } catch (error) {
                    Logger.error("Error during recalculation", error);
                }
            });
        }

        static createSimulationModal() {
            const existingModal = document.getElementById('sim-modal');
            if (existingModal) existingModal.remove();

            if (App.simulatedOrders.length === 0 && App.lastCapturedOrders) {
                App.simulatedOrders = JSON.parse(JSON.stringify(App.lastCapturedOrders));
            }

            const modal = document.createElement('div');
            modal.id = 'sim-modal';
            modal.style.cssText = 'position:fixed; left:50%; top:50%; transform:translate(-50%, -50%); width:800px; max-width:95%; max-height:90vh; overflow-y:auto; background-color:white; border-radius:12px; box-shadow:0 6px 20px rgba(0,0,0,0.25); z-index:10002; font-family:Arial, sans-serif; padding:25px; display:flex; flex-direction:column;';
            modal.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;"><h2 style="margin:0; color:#333; font-size:20px;">Simulation Mode</h2><button id="close-sim" style="border:none; background:transparent; font-size:24px; cursor:pointer;">&times;</button></div>
                <div style="display:flex; gap:10px; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;"><button id="tab-builder" style="padding:6px 12px; border:none; background:#e9ecef; border-radius:4px; cursor:pointer; font-weight:bold; color:#495057;">Builder</button><button id="tab-json" style="padding:6px 12px; border:none; background:transparent; border-radius:4px; cursor:pointer; color:#6c757d;">JSON Input</button></div>
                <div id="view-builder" style="background:#f9f9f9; padding:15px; border-radius:8px; margin-bottom:20px;">
                     <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;"><div><label style="display:block; font-size:12px; color:#666;">Date</label><input type="date" id="sim-date" style="width:100%; padding:6px; border:1px solid #ddd; border-radius:4px;" value="${new Date().toISOString().split('T')[0]}"></div><div><label style="display:block; font-size:12px; color:#666;">Issuer Country (Low-Risk)</label><input type="text" id="sim-country" value="USA" style="width:100%; padding:6px; border:1px solid #ddd; border-radius:4px;"></div></div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; margin-bottom:10px;"><div><label style="display:block; font-size:12px; color:#666;">Amount</label><input type="number" id="sim-amount" value="10" style="width:100%; padding:6px; border:1px solid #ddd; border-radius:4px;"></div><div><label style="display:block; font-size:12px; color:#666;">Currency</label><select id="sim-currency" style="width:100%; padding:6px; border:1px solid #ddd; border-radius:4px;"><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="CAD">CAD</option><option value="AUD">AUD</option><option value="JPY">JPY</option></select></div><div><label style="display:block; font-size:12px; color:#666;">Status</label><select id="sim-status" style="width:100%; padding:6px; border:1px solid #ddd; border-radius:4px;"><option value="ORDER_STATUS_SETTLE_OK">Settled</option><option value="ORDER_STATUS_AUTH_OK">Authorized</option><option value="ORDER_STATUS_REFUNDED">Refunded</option><option value="ORDER_STATUS_FAILED">Failed</option></select></div></div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;"><div><label style="display:block; font-size:12px; color:#666;">Type</label><select id="sim-type" style="width:100%; padding:6px; border:1px solid #ddd; border-radius:4px;"><option value="PAYMENT_TYPE_RECURRING">Recurring</option><option value="PAYMENT_TYPE_FIRST">First (Trial)</option><option value="upsell">Upsell</option></select></div><div><label style="display:block; font-size:12px; color:#666;">Method</label><select id="sim-method" style="width:100%; padding:6px; border:1px solid #ddd; border-radius:4px;"><option value="PAYMENT_METHOD_CARD">Card</option><option value="PAYMENT_METHOD_PAYPAL">PayPal</option></select></div></div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;" id="sim-card-opts"><div><label style="display:block; font-size:12px; color:#666;">Brand</label><select id="sim-brand" style="width:100%; padding:6px; border:1px solid #ddd; border-radius:4px;"><option value="visa">Visa</option><option value="mastercard">Mastercard</option><option value="amex">Amex</option><option value="discover">Discover</option></select></div><div><label style="display:block; font-size:12px; color:#666;">Card Type</label><select id="sim-cardtype" style="width:100%; padding:6px; border:1px solid #ddd; border-radius:4px;"><option value="DEBIT">Standard/Debit</option><option value="PREPAID">Prepaid</option></select></div></div>
                     <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px;"><div><label style="display:block; font-size:12px; color:#666;">Channel</label><select id="sim-channel" style="width:100%; padding:6px; border:1px solid #ddd; border-radius:4px;"><option value="pdfaid">pdfaid</option><option value="pdfhouse">pdfhouse</option><option value="docs.howly.com/pdf-to-edit">docs.howly.com/pdf-to-edit</option></select></div><div><label style="display:block; font-size:12px; color:#666;">IP Country (SCA)</label><input type="text" id="sim-ip-country" placeholder="ISO (e.g. GBR)" style="width:100%; padding:6px; border:1px solid #ddd; border-radius:4px;"></div></div>
                    <button id="sim-add" style="width:100%; background:#6a5acd; color:white; padding:10px; border:none; border-radius:6px; margin-top:10px; cursor:pointer;">Add Transaction</button>
                </div>
                <div id="view-json" style="display:none; margin-bottom:20px;"><textarea id="sim-json-input" placeholder='Paste JSON response here: {"order": [...]}' style="width:100%; height:200px; padding:10px; border:1px solid #ddd; border-radius:8px; font-family:monospace; font-size:12px; resize:vertical;"></textarea><button id="sim-import" style="width:100%; background:#17a2b8; color:white; padding:10px; border:none; border-radius:6px; margin-top:10px; cursor:pointer;">Import JSON</button></div>
                <div style="margin-bottom:20px; flex-grow:1;"><div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding-bottom:5px; margin-bottom:10px;"><h3 style="margin:0; font-size:16px; color:#555;">Transaction List</h3><button id="sim-clear" style="font-size:12px; color:red; background:none; border:none; cursor:pointer;">Clear All</button></div><div id="sim-list" style="max-height:150px; overflow-y:auto; border:1px solid #eee; border-radius:4px; margin-bottom:15px;"></div></div>
                <div id="sim-live-result" style="background:#fff; border:2px dashed #eee; border-radius:8px; padding:15px; margin-bottom:15px; text-align:center;"><div style="color:#999; font-size:14px;">Add transactions to see live analysis</div></div>
            `;
            document.body.appendChild(modal);

            const removeModal = () => { if (modal.parentNode) modal.parentNode.removeChild(modal); document.removeEventListener('keydown', handleEsc); };
            const handleEsc = (e) => { if (e.key === 'Escape') removeModal(); };
            document.addEventListener('keydown', handleEsc);
            document.getElementById('close-sim').onclick = removeModal;

            if (App.lastCapturedOrders && App.lastCapturedOrders.length > 0) {
                const get = Utils.get;
                const latest = App.lastCapturedOrders[0];
                document.getElementById('sim-ip-country').value = get(Config.DATA_MAPPING.ipCountry, latest) || get(Config.DATA_MAPPING.geoCountry, latest) || '';
                document.getElementById('sim-country').value = get(Config.DATA_MAPPING.issuerCountry, latest) || get(Config.DATA_MAPPING.geoCountry, latest) || '';
                const ch = get(Config.DATA_MAPPING.channelName, latest) || '';
                const sel = document.getElementById('sim-channel');
                if ([...sel.options].some(o => o.value === ch)) sel.value = ch;
                const curr = get(Config.DATA_MAPPING.currency, latest);
                if (curr) document.getElementById('sim-currency').value = curr;
            }

            document.getElementById('tab-builder').onclick = () => { document.getElementById('view-builder').style.display = 'block'; document.getElementById('view-json').style.display = 'none'; document.getElementById('tab-builder').style.background = '#e9ecef'; document.getElementById('tab-json').style.background = 'transparent'; };
            document.getElementById('tab-json').onclick = () => { document.getElementById('view-json').style.display = 'block'; document.getElementById('view-builder').style.display = 'none'; document.getElementById('tab-json').style.background = '#e9ecef'; document.getElementById('tab-builder').style.background = 'transparent'; };

            document.getElementById('sim-add').onclick = () => {
                const isZero = Config.ZERO_DECIMAL_CURRENCIES.includes(document.getElementById('sim-currency').value);
                const amt = parseFloat(document.getElementById('sim-amount').value);
                const finalAmt = isZero ? Math.round(amt) : Math.round(amt * 100);
                const rawType = document.getElementById('sim-type').value;
                const isUpsell = rawType === 'upsell';
                const rawDate = document.getElementById('sim-date').value;
                const utcDate = new Date(rawDate + 'T00:00:00.000Z').toISOString();

                const newOrder = {
                    id: 'sim_' + Date.now(),
                    merchantOrder: { id: 'ord_' + Math.floor(Math.random() * 10000), description: isUpsell ? 'upsell' : undefined },
                    status: document.getElementById('sim-status').value,
                    price: { amount: finalAmt, currencyCode: document.getElementById('sim-currency').value, refundedAmount: { amount: 0 } },
                    paymentType: isUpsell ? 'PAYMENT_TYPE_RECURRING' : rawType,
                    method: {
                        paymentMethod: document.getElementById('sim-method').value,
                        cardInfo: document.getElementById('sim-method').value === 'PAYMENT_METHOD_CARD' ? { cardBrand: document.getElementById('sim-brand').value, cardType: document.getElementById('sim-cardtype').value, issuerCountry: document.getElementById('sim-country').value } : undefined
                    },
                    source: { geoCountry: document.getElementById('sim-country').value, ipCountry: document.getElementById('sim-ip-country').value || document.getElementById('sim-country').value },
                    createdAt: utcDate,
                    customer: { email: 'sim@test.com' },
                    channelLink: { name: document.getElementById('sim-channel').value },
                    subscriptionId: 'sub_sim'
                };
                App.simulatedOrders.push(newOrder);
                App.simulatedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                this.renderSimList();
                this.updateLiveResult();
            };

            document.getElementById('sim-clear').onclick = () => { App.simulatedOrders = []; this.renderSimList(); this.updateLiveResult(); };
            document.getElementById('sim-import').onclick = () => {
                try {
                    const parsed = JSON.parse(document.getElementById('sim-json-input').value);
                    let orders = [];
                    if (Array.isArray(parsed)) orders = parsed;
                    else if (parsed.order) orders = parsed.order;
                    App.simulatedOrders = orders;
                    this.renderSimList();
                    this.updateLiveResult();
                    document.getElementById('sim-json-input').value = '';
                    document.getElementById('tab-builder').click();
                } catch (e) { this.showNotification('Invalid JSON', 'error'); }
            };

            this.renderSimList();
            if (App.simulatedOrders.length > 0) this.updateLiveResult();
        }

        static renderSimList() {
            const list = document.getElementById('sim-list');
            if (!list) return;
            if (App.simulatedOrders.length === 0) { list.innerHTML = '<div style="padding:10px; text-align:center; color:#999; font-size:12px;">No transactions</div>'; return; }
            const get = Utils.get;
            list.innerHTML = App.simulatedOrders.map((o) => {
                const isZero = Config.ZERO_DECIMAL_CURRENCIES.includes(get('price.currencyCode', o));
                const amt = get('price.amount', o);
                const displayAmt = isZero ? amt : (amt / 100).toFixed(2);
                const isUpsell = (get(Config.DATA_MAPPING.description, o) || '').toLowerCase().includes('upsell');
                const typeDisplay = isUpsell ? 'Upsell' : (get('paymentType', o) === 'PAYMENT_TYPE_FIRST' ? 'First' : 'Recurring');
                return `<div style="padding:10px; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;"><div><div style="font-weight:bold; font-size:14px;">${displayAmt} ${get('price.currencyCode', o)}</div><div style="font-size:11px; color:#666;">${new Date(get('createdAt', o)).toLocaleDateString()} • ${typeDisplay}</div></div><div style="text-align:right;"><div style="font-size:11px; padding:2px 6px; background:#eee; border-radius:4px; display:inline-block;">${get('status', o).replace('ORDER_STATUS_', '')}</div></div></div>`;
            }).join('');
        }

        static async updateLiveResult() {
            const container = document.getElementById('sim-live-result');
            if (!container || App.simulatedOrders.length === 0) { if (container) container.innerHTML = '<div style="color:#999; font-size:14px;">Add transactions to see live analysis</div>'; return; }
            const result = await App.refundCalculator.getRefundDecision(App.simulatedOrders, true, false, null, false, false);
            let color = '#333';
            if (result.decision.toLowerCase().includes('full')) color = '#28a745';
            else if (result.decision.toLowerCase().includes('partial')) color = '#ffc107';
            else color = '#dc3545';
            let breakdownHtml = '';
            if (result.extraInfo.breakdown) {
                const b = result.extraInfo.breakdown;
                const parts = [];
                if (parseFloat(b.recurring) > 0) parts.push(`${b.recurring} (50%)`);
                if (parseFloat(b.trial) > 0) parts.push(`${b.trial} (Trial)`);
                if (parseFloat(b.upsell) > 0) parts.push(`${b.upsell} (Upsell)`);
                if (parts.length > 0) breakdownHtml = `<div style="font-size:12px; color:#e36d0c; font-weight:bold; margin-top:2px;">(${parts.join(' + ')})</div>`;
            }
            container.innerHTML = `<div style="font-size:11px; color:#999; margin-bottom:2px; text-transform:uppercase; letter-spacing:0.5px; font-weight:bold;">Recommendation</div><div style="font-size:20px; font-weight:bold; color:${color}; margin-bottom:2px;">${result.decision}</div><div style="font-size:16px; font-weight:bold; color:#333;">${result.totalAmount}</div>${breakdownHtml}<div style="font-size:11px; color:#666; margin-top:8px; border-top:1px solid #eee; padding-top:6px;">${result.reason}</div>`;
        }
    }

    // --- APP CORE ---
    class App {
        static init() {
            try {
                this.riskManager = new RiskDataManager();
                this.apiService = new APIService();
                this.refundCalculator = new RefundCalculator(this.riskManager, this.apiService);
                this.lastCapturedOrders = null;
                this.simulatedOrders = [];
                this.isProcessingResponse = false;
                this.originalFetch = unsafeWindow.fetch.bind(unsafeWindow);

                this.setupFetchInterceptor();
                this.startUI();
            } catch (e) {
                // Global error handler for init
                Logger.error("Initialization Failed", e);
            }
        }

        static setupFetchInterceptor() {
            unsafeWindow.fetch = async (...args) => {
                const [resource, config] = args;

                const getHeader = (headers, key) => {
                    if (!headers) return null;
                    if (typeof headers.get === 'function') return headers.get(key);
                    if (Array.isArray(headers)) return (headers.find(h => h[0].toLowerCase() === key.toLowerCase()) || [])[1];
                    if (typeof headers === 'object') {
                        const match = Object.keys(headers).find(k => k.toLowerCase() === key.toLowerCase());
                        return match ? headers[match] : null;
                    }
                    return null;
                };

                let accId = null;
                let authToken = null;

                // Check config (init object) first
                if (config && config.headers) {
                    accId = getHeader(config.headers, 'x-account-id');
                    authToken = getHeader(config.headers, 'Authorization');
                }

                // If not found, check resource (Request object)
                if ((!accId || !authToken) && resource instanceof Request) {
                    accId = accId || getHeader(resource.headers, 'x-account-id');
                    authToken = authToken || getHeader(resource.headers, 'Authorization');
                }

                if (accId || authToken) {
                    this.apiService.updateCredentials(accId, authToken);
                }

                const searchOrderUrl = '/grpc/solidgate.hub_bff.payment.v1beta.SearchOrderService/SearchOrder';
                let requestUrl = '';
                if (typeof resource === 'string') requestUrl = resource;
                else if (resource && resource.url) requestUrl = resource.url;

                const response = await this.originalFetch.apply(unsafeWindow, args);

                if (requestUrl.includes(searchOrderUrl)) {
                    this.isProcessingResponse = true;
                    const responseClone = response.clone();
                    try {
                        const data = await responseClone.json();
                        if (data && data.order && data.order.length > 0) {
                            this.lastCapturedOrders = data.order;
                            Logger.notify('Customer data captured! Consider refund.', 'success');
                        } else {
                            this.lastCapturedOrders = null;
                        }
                    } catch (err) {
                        Logger.error('Error parsing SearchOrder response', err);
                        this.lastCapturedOrders = null;
                    } finally {
                        this.isProcessingResponse = false;
                    }
                }
                return response;
            };
        }

        static startUI() {
            const check = () => {
                const isOnPaymentsPage = window.location.href.includes('/payments');
                const container = document.getElementById('refund-controls-container');
                if (isOnPaymentsPage && !container) UIManager.addCheckButton();
                else if (!isOnPaymentsPage && container) container.remove();
            };
            check();
            setInterval(check, 500);
        }

        static handleAnalysisClick(isChargebackMode) {
            if (this.isProcessingResponse) { Logger.notify('Please wait, data is processing...', 'info'); return; }
            if (this.lastCapturedOrders) {
                const get = Utils.get;
                const uniqueChannels = [...new Set(this.lastCapturedOrders.map(order => get(Config.DATA_MAPPING.channelName, order)).filter(channel => channel))];

                if (uniqueChannels.length > 1) {
                    UIManager.displayChannelSelectionModal(uniqueChannels, (selectedChannel) => {
                        UIManager.showLoadingModal(); // Show loader immediately after channel selection
                        this.refundCalculator.getRefundDecision(this.lastCapturedOrders, true, isChargebackMode, selectedChannel, false, false)
                            .then(result => UIManager.displayResult(result, true, isChargebackMode, selectedChannel))
                            .catch(err => {
                                const modal = document.getElementById('refund-result-modal');
                                if (modal) modal.remove();
                                Logger.error("Analysis failed", err);
                            });
                    });
                } else {
                    UIManager.showLoadingModal(); // Show loader immediately
                    this.refundCalculator.getRefundDecision(this.lastCapturedOrders, true, isChargebackMode, null, false, false)
                        .then(result => UIManager.displayResult(result, true, isChargebackMode, null))
                        .catch(err => {
                            const modal = document.getElementById('refund-result-modal');
                            if (modal) modal.remove();
                            Logger.error("Analysis failed", err);
                        });
                }
            } else {
                Logger.notify('Perform a customer search first to capture data.', 'warning');
            }
        }

        static createSimulationModal() {
            UIManager.createSimulationModal();
        }
    }
    // Start Application with Global Error Handling
    try {
        window.addEventListener('load', () => App.init());
    } catch (e) {
        // Global error handler for init
        if (typeof Logger !== 'undefined') Logger.error("Critical Global Error", e);
    }
})();