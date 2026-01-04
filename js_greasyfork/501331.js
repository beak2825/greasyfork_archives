// ==UserScript==
// @name         YouTube SuperChat货币转换器
// @name:zh-CN   YouTube SuperChat货币转换器
// @name:zh-TW   YouTube SuperChat貨幣轉換器
// @name:zh-HK   YouTube SuperChat貨幣轉換器
// @description         将各种国际货币金额转为你所在地区的币种（如CNY,HKD,NTD,USD,JPY等）
// @description:zh-CN   将各种国际货币金额转为你所在地区的币种（如CNY,HKD,NTD,USD,JPY等）
// @description:zh-TW   將各種國際貨幣金額轉為你所在地區的幣種（如CNY,HKD,NTD,USD,JPY等）
// @description:zh-HK   將各種國際貨幣金額轉為你所在地區的幣種（如CNY,HKD,NTD,USD,JPY等）
// @namespace    http://tampermonkey.net/
// @version      1.9
// @author       kksskkoopp
// @match        https://www.youtube.com/live_chat_replay*
// @match        https://www.youtube.com/live_chat*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      v6.exchangerate-api.com
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/501331/YouTube%20SuperChat%E8%B4%A7%E5%B8%81%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/501331/YouTube%20SuperChat%E8%B4%A7%E5%B8%81%E8%BD%AC%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
    .YoutubeSuperChatCurrencyConverter-split-text {
        display: inline-block;
        white-space: nowrap;
        /*background-color: blue;*/
    }

    .YoutubeSuperChatCurrencyConverter-currency-name {
        font-size: 8px;
        line-height: 8px;
        margin: 0;
        padding: 0;
        border: none;
        outline: none;
        /*background-color: yellow;*/
    }

    .YoutubeSuperChatCurrencyConverter-currency-amount {
        font-size: 12px;
        line-height: 10px;
        margin: 0;
        padding: 0;
        border: none;
        outline: none;
        /*background-color: pink;*/
    }
    `);



    // 参数
    let chinese_name_font_size = 8; // 中文货币名 字体大小
    let converted_currency_font_size = 12; // 转换后的货币金额 字体大小

    let targetCurrencyCode = 'CNY'; // 目标币种
    let targetCurrencyPrecision = 2; // 目标币种保留的小数位数

    let API_KEYS = [
        'd6aa54b3dd223922e629fcc8',
        '064bacfc0b0c5d7fe525b541',
        '35d768f3c2f9e84a00116085',
        '975287c29230eca269117358',
        'd19bd71673e8e9980deefaba',
        '584f75e69792e927b9762e84',
        '9754118030c85779016419b2',
        'd57dae6b98c0b9208acaaaa4',
        '459b2a205aa1a8a89356e660',
        'cf86cf604df768f5e3aa8554'
    ];

    let currencyMap = {
        '$': {ISO_code: 'USD', chinese_name: '美元'},
        '¥': {ISO_code: 'JPY', chinese_name: '日元'},
        '₱': {ISO_code: 'PHP', chinese_name: '菲律宾比索'},
        '£': {ISO_code: 'GBP', chinese_name: '英镑'},
        '€': {ISO_code: 'EUR', chinese_name: '欧元'},
        '₩': {ISO_code: 'KRW', chinese_name: '韩元'},
        '₽': {ISO_code: 'RUB', chinese_name: '俄罗斯卢布'},
        '₹': {ISO_code: 'INR', chinese_name: '印度卢比'},
        '฿': {ISO_code: 'THB', chinese_name: '泰铢'},
        '₫': {ISO_code: 'VND', chinese_name: '越南盾'},

        'A$': {ISO_code: 'AUD', chinese_name: '澳大利亚元'},
        'AU$': {ISO_code: 'AUD', chinese_name: '澳大利亚元'},
        'NZ$': {ISO_code: 'NZD', chinese_name: '新西兰元'},
        'R$': {ISO_code: 'BRL', chinese_name: '巴西雷亚尔'},
        'HK$': {ISO_code: 'HKD', chinese_name: '港币'},
        'NT$': {ISO_code: 'TWD', chinese_name: '新台币'},
        'CA$': {ISO_code: 'CAD', chinese_name: '加拿大元'},
        'US$': {ISO_code: 'USD', chinese_name: '美元'},
        'JP¥': {ISO_code: 'JPY', chinese_name: '日元'},

        'AED': {ISO_code: 'AED', chinese_name: '阿联酋迪拉姆'},
        'AFN': {ISO_code: 'AFN', chinese_name: '阿富汗尼'},
        'ALL': {ISO_code: 'ALL', chinese_name: '阿尔巴尼亚列克'},
        'AMD': {ISO_code: 'AMD', chinese_name: '亚美尼亚德拉姆'},
        'ANG': {ISO_code: 'ANG', chinese_name: '荷属安的列斯盾'},
        'AOA': {ISO_code: 'AOA', chinese_name: '安哥拉宽扎'},
        'ARS': {ISO_code: 'ARS', chinese_name: '阿根廷比索'},
        'AUD': {ISO_code: 'AUD', chinese_name: '澳大利亚元'},
        'AWG': {ISO_code: 'AWG', chinese_name: '阿鲁巴弗罗林'},
        'AZN': {ISO_code: 'AZN', chinese_name: '阿塞拜疆马纳特'},
        'BAM': {ISO_code: 'BAM', chinese_name: '波斯尼亚和黑塞哥维那马克'},
        'BBD': {ISO_code: 'BBD', chinese_name: '巴巴多斯元'},
        'BDT': {ISO_code: 'BDT', chinese_name: '孟加拉塔卡'},
        'BGN': {ISO_code: 'BGN', chinese_name: '保加利亚列弗'},
        'BHD': {ISO_code: 'BHD', chinese_name: '巴林第纳尔'},
        'BIF': {ISO_code: 'BIF', chinese_name: '布隆迪法郎'},
        'BMD': {ISO_code: 'BMD', chinese_name: '百慕大元'},
        'BND': {ISO_code: 'BND', chinese_name: '文莱元'},
        'BOB': {ISO_code: 'BOB', chinese_name: '玻利维亚诺'},
        'BRL': {ISO_code: 'BRL', chinese_name: '巴西雷亚尔'},
        'BSD': {ISO_code: 'BSD', chinese_name: '巴哈马元'},
        'BTN': {ISO_code: 'BTN', chinese_name: '不丹努扎姆'},
        'BWP': {ISO_code: 'BWP', chinese_name: '博茨瓦纳普拉'},
        'BYN': {ISO_code: 'BYN', chinese_name: '白俄罗斯卢布'},
        'BZD': {ISO_code: 'BZD', chinese_name: '伯利兹元'},
        'CAD': {ISO_code: 'CAD', chinese_name: '加拿大元'},
        'CDF': {ISO_code: 'CDF', chinese_name: '刚果法郎'},
        'CHF': {ISO_code: 'CHF', chinese_name: '瑞士法郎'},
        'CLP': {ISO_code: 'CLP', chinese_name: '智利比索'},
        'CNY': {ISO_code: 'CNY', chinese_name: '人民币'},
        'COP': {ISO_code: 'COP', chinese_name: '哥伦比亚比索'},
        'CRC': {ISO_code: 'CRC', chinese_name: '哥斯达黎加科朗'},
        'CUP': {ISO_code: 'CUP', chinese_name: '古巴比索'},
        'CVE': {ISO_code: 'CVE', chinese_name: '佛得角埃斯库多'},
        'CZK': {ISO_code: 'CZK', chinese_name: '捷克克朗'},
        'DJF': {ISO_code: 'DJF', chinese_name: '吉布提法郎'},
        'DKK': {ISO_code: 'DKK', chinese_name: '丹麦克朗'},
        'DOP': {ISO_code: 'DOP', chinese_name: '多米尼加比索'},
        'DZD': {ISO_code: 'DZD', chinese_name: '阿尔及利亚第纳尔'},
        'EGP': {ISO_code: 'EGP', chinese_name: '埃及镑'},
        'ERN': {ISO_code: 'ERN', chinese_name: '厄立特里亚纳克法'},
        'ETB': {ISO_code: 'ETB', chinese_name: '埃塞俄比亚比尔'},
        'EUR': {ISO_code: 'EUR', chinese_name: '欧元'},
        'FJD': {ISO_code: 'FJD', chinese_name: '斐济元'},
        'FKP': {ISO_code: 'FKP', chinese_name: '福克兰群岛镑'},
        'FOK': {ISO_code: 'FOK', chinese_name: '法罗克朗'},
        'GBP': {ISO_code: 'GBP', chinese_name: '英镑'},
        'GEL': {ISO_code: 'GEL', chinese_name: '格鲁吉亚拉里'},
        'GGP': {ISO_code: 'GGP', chinese_name: '根西镑'},
        'GHS': {ISO_code: 'GHS', chinese_name: '加纳塞地'},
        'GIP': {ISO_code: 'GIP', chinese_name: '直布罗陀镑'},
        'GMD': {ISO_code: 'GMD', chinese_name: '冈比亚达拉西'},
        'GNF': {ISO_code: 'GNF', chinese_name: '几内亚法郎'},
        'GTQ': {ISO_code: 'GTQ', chinese_name: '危地马拉格查尔'},
        'GYD': {ISO_code: 'GYD', chinese_name: '圭亚那元'},
        'HKD': {ISO_code: 'HKD', chinese_name: '港币'},
        'HNL': {ISO_code: 'HNL', chinese_name: '洪都拉斯伦皮拉'},
        'HRK': {ISO_code: 'HRK', chinese_name: '克罗地亚库纳'},
        'HTG': {ISO_code: 'HTG', chinese_name: '海地古德'},
        'HUF': {ISO_code: 'HUF', chinese_name: '匈牙利福林'},
        'IDR': {ISO_code: 'IDR', chinese_name: '印尼卢比'},
        'ILS': {ISO_code: 'ILS', chinese_name: '以色列新谢克尔'},
        'IMP': {ISO_code: 'IMP', chinese_name: '马恩岛镑'},
        'INR': {ISO_code: 'INR', chinese_name: '印度卢比'},
        'IQD': {ISO_code: 'IQD', chinese_name: '伊拉克第纳尔'},
        'IRR': {ISO_code: 'IRR', chinese_name: '伊朗里亚尔'},
        'ISK': {ISO_code: 'ISK', chinese_name: '冰岛克朗'},
        'JEP': {ISO_code: 'JEP', chinese_name: '泽西镑'},
        'JMD': {ISO_code: 'JMD', chinese_name: '牙买加元'},
        'JOD': {ISO_code: 'JOD', chinese_name: '约旦第纳尔'},
        'JPY': {ISO_code: 'JPY', chinese_name: '日元'},
        'KES': {ISO_code: 'KES', chinese_name: '肯尼亚先令'},
        'KGS': {ISO_code: 'KGS', chinese_name: '吉尔吉斯斯坦索姆'},
        'KHR': {ISO_code: 'KHR', chinese_name: '柬埔寨瑞尔'},
        'KID': {ISO_code: 'KID', chinese_name: '基里巴斯元'},
        'KMF': {ISO_code: 'KMF', chinese_name: '科摩罗法郎'},
        'KRW': {ISO_code: 'KRW', chinese_name: '韩元'},
        'KWD': {ISO_code: 'KWD', chinese_name: '科威特第纳尔'},
        'KYD': {ISO_code: 'KYD', chinese_name: '开曼群岛元'},
        'KZT': {ISO_code: 'KZT', chinese_name: '哈萨克斯坦坚戈'},
        'LAK': {ISO_code: 'LAK', chinese_name: '老挝基普'},
        'LBP': {ISO_code: 'LBP', chinese_name: '黎巴嫩镑'},
        'LKR': {ISO_code: 'LKR', chinese_name: '斯里兰卡卢比'},
        'LRD': {ISO_code: 'LRD', chinese_name: '利比里亚元'},
        'LSL': {ISO_code: 'LSL', chinese_name: '莱索托洛蒂'},
        'LYD': {ISO_code: 'LYD', chinese_name: '利比亚第纳尔'},
        'MAD': {ISO_code: 'MAD', chinese_name: '摩洛哥迪拉姆'},
        'MDL': {ISO_code: 'MDL', chinese_name: '摩尔多瓦列伊'},
        'MGA': {ISO_code: 'MGA', chinese_name: '马达加斯加阿里亚里'},
        'MKD': {ISO_code: 'MKD', chinese_name: '马其顿第纳尔'},
        'MMK': {ISO_code: 'MMK', chinese_name: '缅元'},
        'MNT': {ISO_code: 'MNT', chinese_name: '蒙古图格里克'},
        'MOP': {ISO_code: 'MOP', chinese_name: '澳门元'},
        'MRU': {ISO_code: 'MRU', chinese_name: '毛里塔尼亚乌吉亚'},
        'MUR': {ISO_code: 'MUR', chinese_name: '毛里求斯卢比'},
        'MVR': {ISO_code: 'MVR', chinese_name: '马尔代夫拉菲亚'},
        'MWK': {ISO_code: 'MWK', chinese_name: '马拉维克瓦查'},
        'MXN': {ISO_code: 'MXN', chinese_name: '墨西哥比索'},
        'MYR': {ISO_code: 'MYR', chinese_name: '马来西亚林吉特'},
        'MZN': {ISO_code: 'MZN', chinese_name: '莫桑比克梅蒂卡尔'},
        'NAD': {ISO_code: 'NAD', chinese_name: '纳米比亚元'},
        'NGN': {ISO_code: 'NGN', chinese_name: '尼日利亚奈拉'},
        'NIO': {ISO_code: 'NIO', chinese_name: '尼加拉瓜科多巴'},
        'NOK': {ISO_code: 'NOK', chinese_name: '挪威克朗'},
        'NPR': {ISO_code: 'NPR', chinese_name: '尼泊尔卢比'},
        'NZD': {ISO_code: 'NZD', chinese_name: '新西兰元'},
        'OMR': {ISO_code: 'OMR', chinese_name: '阿曼里亚尔'},
        'PAB': {ISO_code: 'PAB', chinese_name: '巴拿马巴波亚'},
        'PEN': {ISO_code: 'PEN', chinese_name: '秘鲁新索尔'},
        'PGK': {ISO_code: 'PGK', chinese_name: '巴布亚新几内亚基那'},
        'PHP': {ISO_code: 'PHP', chinese_name: '菲律宾比索'},
        'PKR': {ISO_code: 'PKR', chinese_name: '巴基斯坦卢比'},
        'PLN': {ISO_code: 'PLN', chinese_name: '波兰兹罗提'},
        'PYG': {ISO_code: 'PYG', chinese_name: '巴拉圭瓜拉尼'},
        'QAR': {ISO_code: 'QAR', chinese_name: '卡塔尔里亚尔'},
        'RON': {ISO_code: 'RON', chinese_name: '罗马尼亚列伊'},
        'RSD': {ISO_code: 'RSD', chinese_name: '塞尔维亚第纳尔'},
        'RUB': {ISO_code: 'RUB', chinese_name: '俄罗斯卢布'},
        'RWF': {ISO_code: 'RWF', chinese_name: '卢旺达法郎'},
        'SAR': {ISO_code: 'SAR', chinese_name: '沙特里亚尔'},
        'SBD': {ISO_code: 'SBD', chinese_name: '所罗门群岛元'},
        'SCR': {ISO_code: 'SCR', chinese_name: '塞舌尔卢比'},
        'SDG': {ISO_code: 'SDG', chinese_name: '苏丹镑'},
        'SEK': {ISO_code: 'SEK', chinese_name: '瑞典克朗'},
        'SGD': {ISO_code: 'SGD', chinese_name: '新加坡元'},
        'SHP': {ISO_code: 'SHP', chinese_name: '圣赫勒拿镑'},
        'SLE': {ISO_code: 'SLE', chinese_name: '塞拉利昂利昂'},
        'SOS': {ISO_code: 'SOS', chinese_name: '索马里先令'},
        'SRD': {ISO_code: 'SRD', chinese_name: '苏里南元'},
        'SSP': {ISO_code: 'SSP', chinese_name: '南苏丹镑'},
        'STN': {ISO_code: 'STN', chinese_name: '圣多美和普林西比多布拉'},
        'SYP': {ISO_code: 'SYP', chinese_name: '叙利亚镑'},
        'SZL': {ISO_code: 'SZL', chinese_name: '斯威士兰里兰吉尼'},
        'THB': {ISO_code: 'THB', chinese_name: '泰铢'},
        'TJS': {ISO_code: 'TJS', chinese_name: '塔吉克斯坦索莫尼'},
        'TMT': {ISO_code: 'TMT', chinese_name: '土库曼斯坦马纳特'},
        'TND': {ISO_code: 'TND', chinese_name: '突尼斯第纳尔'},
        'TOP': {ISO_code: 'TOP', chinese_name: '汤加潘加'},
        'TRY': {ISO_code: 'TRY', chinese_name: '土耳其里拉'},
        'TTD': {ISO_code: 'TTD', chinese_name: '特立尼达和多巴哥元'},
        'TVD': {ISO_code: 'TVD', chinese_name: '图瓦卢元'},
        'TWD': {ISO_code: 'TWD', chinese_name: '新台币'},
        'TZS': {ISO_code: 'TZS', chinese_name: '坦桑尼亚先令'},
        'UAH': {ISO_code: 'UAH', chinese_name: '乌克兰格里夫纳'},
        'UGX': {ISO_code: 'UGX', chinese_name: '乌干达先令'},
        'USD': {ISO_code: 'USD', chinese_name: '美元'},
        'UYU': {ISO_code: 'UYU', chinese_name: '乌拉圭比索'},
        'UZS': {ISO_code: 'UZS', chinese_name: '乌兹别克斯坦苏姆'},
        'VES': {ISO_code: 'VES', chinese_name: '委内瑞拉主权玻利瓦尔'},
        'VND': {ISO_code: 'VND', chinese_name: '越南盾'},
        'VUV': {ISO_code: 'VUV', chinese_name: '瓦努阿图瓦图'},
        'WST': {ISO_code: 'WST', chinese_name: '萨摩亚塔拉'},
        'XAF': {ISO_code: 'XAF', chinese_name: '中非法郎'},
        'XCD': {ISO_code: 'XCD', chinese_name: '东加勒比元'},
        'XDR': {ISO_code: 'XDR', chinese_name: '特别提款权'},
        'XOF': {ISO_code: 'XOF', chinese_name: '西非法郎'},
        'XPF': {ISO_code: 'XPF', chinese_name: '太平洋法郎'},
        'YER': {ISO_code: 'YER', chinese_name: '也门里亚尔'},
        'ZAR': {ISO_code: 'ZAR', chinese_name: '南非兰特'},
        'ZMW': {ISO_code: 'ZMW', chinese_name: '赞比亚克瓦查'},
        'ZWL': {ISO_code: 'ZWL', chinese_name: '津巴布韦元'}
    };

    let currentKeyIndex = 0;
    let exchangeRates = {};

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async function fetchExchangeRates() {
        if (API_KEYS.length === 0) {
            console.log('无API_KEY, 请添加至少一个API_KEY');
            return null;
        }
        let API_URL = `https://v6.exchangerate-api.com/v6/${API_KEYS[currentKeyIndex]}/latest/${targetCurrencyCode}`;
        console.log(`开始请求汇率[${currentKeyIndex}][${API_URL}]`);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: API_URL,
                onload: function (response) {
                    let data = JSON.parse(response.responseText);
                    if (data.result === 'success') {
                        exchangeRates = data.conversion_rates;
                        let datetime = new Date();
                        console.log(`今日汇率 [${datetime.toLocaleDateString()} ${datetime.toLocaleTimeString()}]`);
                        console.log(exchangeRates);
                        console.log('汇率请求完毕');

                        let API_QUOTA_URL = `https://v6.exchangerate-api.com/v6/${API_KEYS[currentKeyIndex]}/quota`;
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: API_QUOTA_URL,
                            onload: function (response) {
                                let data = JSON.parse(response.responseText);
                                if (data.result === 'success') {
                                    console.log(`每月计划额度:${data.plan_quota}, 剩余额度:${data.requests_remaining}`);
                                } else if (data.result === 'error') {
                                    if (data['error-type'] === 'invalid-key') {
                                        console.log("错误：无效的API密钥。");
                                    } else if (data['error-type'] === 'inactive-account') {
                                        console.log("错误：账户未激活，请在您的电子邮件激活。");
                                    } else if (data['error-type'] === 'quota-reached') {
                                        console.log("错误：无剩余查询额度，您的全部查询额度已使用完毕。");
                                    }
                                }
                                resolve();
                            },
                            onerror: function () {
                                console.error('错误：脚本无法连接到汇率接口 https://www.exchangerate-api.com/');
                                reject();
                            }
                        });
                    } else if (data.result === 'error') {
                        if (data['error-type'] === 'unsupported-code') {
                            console.log("错误：不支持的币种。");
                        } else if (data['error-type'] === 'malformed-request') {
                            console.log("错误：请求格式错误。");
                        } else if (data['error-type'] === 'invalid-key') {
                            console.log("错误：无效的API密钥。");
                            switchApiKey().then(resolve).catch(reject);
                        } else if (data['error-type'] === 'inactive-account') {
                            console.log("错误：账户未激活，请在您的电子邮件激活。");
                            switchApiKey().then(resolve).catch(reject);
                        } else if (data['error-type'] === 'quota-reached') {
                            console.log("错误：无剩余查询额度，您的全部查询额度已使用完毕。");
                            switchApiKey().then(resolve).catch(reject);
                        }
                    }
                },
                onerror: function () {
                    console.error('错误：脚本无法连接到汇率接口 https://www.exchangerate-api.com/');
                    reject();
                }
            });
        });
    }

    async function switchApiKey() {
        currentKeyIndex++;
        if (currentKeyIndex < API_KEYS.length) {
            await fetchExchangeRates();
        } else {
            console.error('所有API密钥均已失效或达到配额限制。');
        }
    }

    function parseAmountAndCurrency(text) {
        text = text.replace(/\s+/g, '');
        for (const [symbol, info] of Object.entries(currencyMap)) {
            if (text.startsWith(symbol)) {
                const amount = parseFloat(text.replace(symbol, '').replace(/,/g, ''));
                return { amount, fromCurrencyCode: info.ISO_code, chinese_name: info.chinese_name };
            }
        }
        console.error(`不支持的币种或无效的匹配[${text}].`);
        return null;
    }

    function observeSuperChat() {
        let targetNode = document.body;
        let config = { childList: true, subtree: true };
        let callback = async function () {
            observer.disconnect();
            //console.log('[YTB SC]DOM变化');
            let elements = document.querySelectorAll('yt-formatted-string.style-scope.yt-live-chat-paid-message-renderer:not(#deleted-state):not(#dashboard-deleted-state), yt-formatted-string.style-scope.yt-live-chat-paid-sticker-renderer:not(#deleted-state):not(#dashboard-deleted-state)');
            if (elements.length > 0) {
                for (let i = 0; i < elements.length; i++) {
                    if (!elements[i].getAttribute('YoutubeSuperChatCurrencyConverter-converted')) {
                        //console.log(`【==============`);
                        //console.log(elements[i]);
                        //console.log(`===============】`);

                        let message = elements[i].textContent.trim();
                        let parsed = parseAmountAndCurrency(message);
                        if (parsed) {
                            console.log(`解析成功[${message}]=[${parsed.fromCurrencyCode} ${parsed.amount}]`);
                            if (Object.keys(exchangeRates).length === 0) {
                                shuffleArray(API_KEYS);
                                await fetchExchangeRates();
                            }
                            let targetCurrencyAmount = parsed.amount / exchangeRates[parsed.fromCurrencyCode];
                            let targetCurrencyAmount_str = targetCurrencyAmount.toFixed(targetCurrencyPrecision);


                            let splitTextDiv = document.createElement('div');
                            splitTextDiv.classList.add('YoutubeSuperChatCurrencyConverter-split-text');

                            let chineseNameDiv = document.createElement('div');
                            chineseNameDiv.classList.add('YoutubeSuperChatCurrencyConverter-currency-name');
                            chineseNameDiv.textContent = parsed.chinese_name;

                            let convertedCurrencyDiv = document.createElement('div');
                            convertedCurrencyDiv.classList.add('YoutubeSuperChatCurrencyConverter-currency-amount');
                            convertedCurrencyDiv.textContent = `=${targetCurrencyCode} ${targetCurrencyAmount_str}`;

                            splitTextDiv.appendChild(chineseNameDiv);
                            splitTextDiv.appendChild(convertedCurrencyDiv);

                            // 插入动态构造的内容
                            elements[i].textContent = message; // 清空原有内容
                            elements[i].appendChild(splitTextDiv);
                            elements[i].setAttribute('YoutubeSuperChatCurrencyConverter-converted', 'true'); // 标记已处理
                        } else {
                            console.log(`解析失败[${message}]`);
                        }
                    }
                }
            }
            observer.observe(targetNode, config);
        };

        let observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }
    console.log('[Youtube Superchat转换器]启动');
    document.addEventListener('DOMContentLoaded', observeSuperChat);
})();
