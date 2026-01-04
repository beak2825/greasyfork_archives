// ==UserScript==
// @name          亚马逊商品采集工具(终极优化版)
// @namespace     https://blog.csdn.net/mukes
// @version       5.0.0
// @description   全字段支持+技术规格解析的亚马逊数据采集工具
// @author       AI数据标注猿
// @match        *://*.amazon.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_addStyle
// @connect      *
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.10/dayjs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/i18next/22.5.0/i18next.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/i18next-http-backend/2.2.2/i18nextHttpBackend.min.js
// @downloadURL https://update.greasyfork.org/scripts/537565/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%95%86%E5%93%81%E9%87%87%E9%9B%86%E5%B7%A5%E5%85%B7%28%E7%BB%88%E6%9E%81%E4%BC%98%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537565/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%95%86%E5%93%81%E9%87%87%E9%9B%86%E5%B7%A5%E5%85%B7%28%E7%BB%88%E6%9E%81%E4%BC%98%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const dayjs = window.dayjs;

    // ===================== 全局配置 =====================
    const CONFIG = {
        API_URL: 'https://gather.mytool.maykis.cn/api/gather/saveListing',
        FIELD_CONFIG: [
            // 基础字段
            { label: 'ASIN码 (ASIN)', key: 'asin', type: 'text', readonly: true },
            { label: '商品标题 (Title)', key: 'title', type: 'text', required: true },
            { label: '商品描述 (Description)', key: 'description', type: 'textarea' },
            { label: '品牌 (Brand)', key: 'brand', type: 'text' },
            { label: '价格 (USD)', key: 'price', type: 'number', min: 0, step: 0.01, unit: '$' },
            { label: '人民币价格 (CNY)', key: 'priceCNY', type: 'number', readonly: true, unit: '¥' },
            { label: '类目 (Category)', key: 'categoryName', type: 'text' },
            { label: '库存状态 (Stock)', key: 'stock', type: 'select', options: ['有库存', '少量库存', '无库存'] },

            // 技术规格字段
            { label: '长度 (Length)', key: 'length', type: 'number', unit: 'cm' },
            { label: '宽度 (Width)', key: 'width', type: 'number', unit: 'cm' },
            { label: '高度 (Height)', key: 'height', type: 'number', unit: 'cm' },
            { label: '颜色', key: 'color', type: 'text' },
            { label: '尺寸', key: 'size', type: 'text' },
            { label: '风格', key: 'style', type: 'text' },
            {
                label: '商品图片 (Images)',
                key: 'images',
                type: 'thumbnails',  // 改为缩略图类型
                readonly: true
            },

            // 其他字段
            { label: '货币 (Currency)', key: 'currency', type: 'text', readonly: true },
            { label: '卖家 (Sold by)', key: 'seller', type: 'text', readonly: true },
            { label: '发货方式 (Delivery Method)', key: 'deliveryMethod', type: 'text' },
            { label: '上架时间 (Upload Time)', key: 'uploadTime', type: 'date' },
            { label: '评价数量 (Reviews)', key: 'reviewsNum', type: 'number' },
            { label: '商品星级 (Rating)', key: 'commodityStar', type: 'number', step: 0.1, min: 0, max: 5 },
            { label: '卖家数量 (Sellers)', key: 'sellersNum', type: 'number' },
            {
                label: '免费配送时间 (Free Delivery)',
                key: 'freeDeliveryTime',
                type: 'date_range',  // 改为日期区间类型
                keys: ['freeDeliveryStart', 'freeDeliveryEnd']  // 添加开始和结束日期的键名
            },
            { label: '最快配送 (Fast Delivery)', key: 'fastestDeliveryTime', type: 'date' },
            { label: 'BSR大类排名', key: 'bsrMainRank', type: 'number', readonly: true },
            { label: 'BSR大类类目', key: 'bsrMainCategory', type: 'text', readonly: true },
            { label: 'BSR小类排名', key: 'bsrSubRank', type: 'number', readonly: true },
            { label: 'BSR小类类目', key: 'bsrSubCategory', type: 'text', readonly: true },
            {
                label: 'BSR排名 (BSR Ranking)',
                key: 'bsr_group',
                type: 'bsr_group',
                fields: [
                    {
                        label: '大类排名',
                        keys: ['bsrMainRank', 'bsrMainCategory'],
                        readonly: true
                    },
                    {
                        label: '小类排名',
                        keys: ['bsrSubRank', 'bsrSubCategory'],
                        readonly: true
                    }
                ]
            },
        ],
        SELECTORS: {
            TITLE: '#productTitle, #title',
            BRAND: '#bylineInfo, #brand, .contributorNameID',
            PRICE: '#priceblock_ourprice, #priceblock_dealprice, .a-price .a-offscreen, #price_inside_buybox',
            CATEGORY: '#wayfinding-breadcrumbs_feature_div .a-list-item, .a-breadcrumb li:not(.a-breadcrumb-divider)',
            PRODUCT_DETAILS: '#productDetails_detailBullets_sections1 tr, #detailBullets_feature_div li',
            TECH_SPECS: '#productDetails_techSpec_section_1 tr, #technicalSpecifications_section_1 tr',
            AVAILABILITY: '#availability span, #deliveryMessageMirId',
            DESCRIPTION: '.a-unordered-list.a-vertical.a-spacing-mini .a-list-item.mitp__source',
            REVIEWS: '#acrCustomerReviewText, #reviewsMedley .a-size-base',
            SELLERS: '#olpLinkWidget_feature_div, #mbc-sold-by-1',
            UPLOAD_TIME: '#productDetails_detailBullets_sections1 tr:has(th:contains("Date First Available")) td',
            FREE_DELIVERY: '#deliveryBlockMessage [data-csa-c-delivery-time]',
            SELLER: '.offer-display-feature-text a[id="sellerProfileTriggerId"]',
            SELLERS_COUNT: '.a-section.a-spacing-none.daodi-content .a-color-base',  // 更新卖家数量选择器
            PRODUCT_IMAGES: '.a-button-text img[src*="images"]',  // 添加商品图片选择器
        },
        TECH_SPEC_MAP: {
            'Product Dimensions': 'productDimensions',
            'Color': 'color',
            'Fabric Type': 'fabricType',
            'Base Material': 'baseMaterial',
            'Frame Material': 'frameMaterial',
            'Seat Height': 'seatHeight',
            'Maximum Weight Recommendation': 'maxWeight',
            'Size': 'size',
            'Style': 'style'
        },
        TRANSLATIONS: {
            colors: {
                'Green': '绿色',
                'Black': '黑色',
                'White': '白色',
                'Brown': '棕色',
                'Gray': '灰色',
                // 可以添加更多颜色映射
            },
            materials: {
                'Wood': '木质',
                'Leather': '皮革',
                'Faux Leather': '人造皮革',
                'Fabric': '布料',
                'Metal': '金属',
                'Plastic': '塑料',
                // 可以添加更多材质映射
            },
            styles: {
                'Modern': '现代',
                'Traditional': '传统',
                'Contemporary': '当代',
                'Industrial': '工业风',
                'Rustic': '乡村',
                // 可以添加更多风格映射
            },
            common: {
                'chair': '椅子',
                'table': '桌子',
                'desk': '书桌',
                'sofa': '沙发',
                'bed': '床',
                'shelf': '架子',
                'cabinet': '柜子',
                'storage': '储物',
                'office': '办公',
                'living room': '客厅',
                'bedroom': '卧室',
                'kitchen': '厨房',
                'bathroom': '浴室',
                'outdoor': '户外',
                'indoor': '室内',
                'adjustable': '可调节',
                'foldable': '可折叠',
                'portable': '便携',
                'comfortable': '舒适',
                'durable': '耐用',
                'premium': '优质',
                'high quality': '高品质',
                'easy': '简易',
                'assembly': '组装',
                // 可以继续添加更多常用词汇映射
            }
        }
    };

    // ===================== 增强工具模块 =====================
    const Utils = {
        // 元素查询
        safeQuery: (selector, context = document) => {
            try {
                return context.querySelector(selector);
            } catch (error) {
                console.warn(`无效选择器: ${selector}`, error);
                return null;
            }
        },

        // 英寸转厘米
        inchToCm: (inch) => {
            return (parseFloat(inch) * 2.54).toFixed(1);
        },

        // 技术规格解析
        parseTechSpecs: () => {
            const specs = {};
            try {
                // 尝试从技术规格表格获取
                const rows = document.querySelectorAll('table.a-normal tr[class*="po-"]');
                let hasDimensions = false;

                rows.forEach(row => {
                    const label = row.querySelector('.a-text-bold')?.textContent.trim();
                    const value = row.querySelector('.po-break-word')?.textContent.trim();

                    if (!label || !value) return;

                    // 根据标签匹配字段
                    switch (label) {
                        case 'Product Dimensions': {
                            const dimMatch = value.match(/([\d.]+)"D x ([\d.]+)"W x ([\d.]+)"H/);
                            if (dimMatch) {
                                specs.length = Utils.inchToCm(dimMatch[1]); // 长度（深度）
                                specs.width = Utils.inchToCm(dimMatch[2]);  // 宽度
                                specs.height = Utils.inchToCm(dimMatch[3]); // 高度
                                hasDimensions = true;
                            }
                            break;
                        }
                        case 'Color':
                            specs.color = value;
                            break;
                        case 'Size':
                            specs.size = value;
                            break;
                        case 'Style':
                            specs.style = value;
                            break;
                    }
                });

                // 如果没有找到 Product Dimensions，尝试从 Package Dimensions 获取
                if (!hasDimensions) {
                    const detailsTable = document.querySelector('#productDetails_detailBullets_sections1');
                    if (detailsTable) {
                        const packageDimRow = Array.from(detailsTable.querySelectorAll('tr')).find(row =>
                            row.querySelector('th')?.textContent.trim() === 'Package Dimensions'
                        );

                        if (packageDimRow) {
                            const dimValue = packageDimRow.querySelector('td')?.textContent.trim();
                            const dimMatch = dimValue.match(/([\d.]+)\s*x\s*([\d.]+)\s*x\s*([\d.]+)\s*inches/);
                            if (dimMatch) {
                                specs.length = Utils.inchToCm(dimMatch[1]); // 长度
                                specs.width = Utils.inchToCm(dimMatch[2]);  // 宽度
                                specs.height = Utils.inchToCm(dimMatch[3]); // 高度
                            }
                        }
                    }
                }

                return specs;
            } catch (error) {
                console.error('解析技术规格失败:', error);
                return {};
            }
        },

            // 规格值标准化
            normalizeSpecValue: (key, value) => {
                value = value.replace(/[\u200E]/g, '').trim();
                switch(key) {
                    case 'productDimensions': {
                        const dimMatch = value.match(/([\d.]+)"D x ([\d.]+)"W x ([\d.]+)"H/);
                        return dimMatch ? {
                            depth: `${dimMatch[1]}英寸`,
                            width: `${dimMatch[2]}英寸`,
                            height: `${dimMatch[3]}英寸`
                        } : value;
                    }
                    case 'maxWeight':
                        return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
                    case 'seatHeight':
                        return value.replace(/(\d+)\s*Centimeters/, '$1cm');
                    default:
                        return value;
                }
            },

            // 智能日期解析
            parseDate: (text) => {
                if (!text) return '';
                try {
                    // 处理 "July 20, 2022" 格式
                    const date = dayjs(text);
                    return date.isValid() ? date.format('YYYY-MM-DD') : '';
                } catch (error) {
                    console.error('日期解析失败:', error);
                    return '';
                }
            },

            // 元素等待
            waitForElement: (selector, timeout = 5000) => {
                return new Promise((resolve, reject) => {
                    // 先检查元素是否已存在
                    const element = document.querySelector(selector);
                    if (element) {
                        resolve(element);
                        return;
                    }

                    // 设置重试次数和间隔
                    let retries = 10;
                    let interval = timeout / retries;
                    let count = 0;

                    const observer = new MutationObserver(() => {
                        const el = document.querySelector(selector);
                        if (el) {
                            observer.disconnect();
                            resolve(el);
                        }
                    });

                    observer.observe(document.body, {
                        childList: true,
                        subtree: true,
                        attributes: true
                    });

                    // 定期检查元素
                    const checker = setInterval(() => {
                        count++;
                        const el = document.querySelector(selector);
                        if (el) {
                            clearInterval(checker);
                            observer.disconnect();
                            resolve(el);
                        } else if (count >= retries) {
                            clearInterval(checker);
                            observer.disconnect();
                            console.warn(`等待元素超时: ${selector}`);
                            // 不要reject，而是resolve null
                            resolve(null);
                        }
                    }, interval);
                });
            },

            // 增加多元素查询方法
            safeQueryAll: (selector, context = document) => {
                try {
                    return Array.from(context.querySelectorAll(selector));
                } catch (error) {
                    console.warn(`Invalid selector: ${selector}`, error);
                    return [];
                }
            },

            // 增加文本提取方法
            extractText: (element, selector) => {
                if (!element) return '';
                const target = selector ? element.querySelector(selector) : element;
                return target ? target.textContent.trim() : '';
            },

            // 增加价格提取方法
            extractPrice: (priceElement) => {
                if (!priceElement) return 0.00;
                const text = priceElement.textContent.trim();
                const match = text.match(/[\d,.]+/);
                if (!match) return 0.00;
                const price = parseFloat(match[0].replace(/,/g, ''));
                return Number(price.toFixed(2));
            },

            // 增加重试机制
            retry: async (fn, retries = 3, delay = 1000) => {
                for (let i = 0; i < retries; i++) {
                    try {
                        return await fn();
                    } catch (error) {
                        if (i === retries - 1) throw error;
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            },

            getElementTextById(id) {
                try {
                    return document.getElementById(id)?.textContent.trim() || '';
                } catch (error) {
                    return '';
                }
            },

            getElementTextByClassName(className, index = 0) {
                try {
                    return document.getElementsByClassName(className)[index]?.textContent.trim() || '';
                } catch (error) {
                    return '';
                }
            },

            getElementValueById(id) {
                try {
                    return document.getElementById(id)?.value || '';
                } catch (error) {
                    return '';
                }
            },

            extractJsonFromScript(pattern, pagesource) {
                try {
                    const match = pagesource.match(pattern);
                    return match ? JSON.parse(match[1]) : null;
                } catch (error) {
                    return null;
                }
            },

            // 美元转人民币 (使用固定汇率，你可以根据需要调整)
            usdToCny: (usd) => {
                const rate = 7.2; // USD to CNY 汇率
                return Number((usd * rate).toFixed(2));
            },

            // 添加 MD5 工具函数
            MD5: function(string) {
                function RotateLeft(lValue, iShiftBits) {
                    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
                }

                function AddUnsigned(lX, lY) {
                    var lX4, lY4, lX8, lY8, lResult;
                    lX8 = (lX & 0x80000000);
                    lY8 = (lY & 0x80000000);
                    lX4 = (lX & 0x40000000);
                    lY4 = (lY & 0x40000000);
                    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                    if (lX4 & lY4) {
                        return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                    }
                    if (lX4 | lY4) {
                        if (lResult & 0x40000000) {
                            return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                        } else {
                            return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                        }
                    } else {
                        return (lResult ^ lX8 ^ lY8);
                    }
                }

                function F(x, y, z) {
                    return (x & y) | ((~x) & z);
                }

                function G(x, y, z) {
                    return (x & z) | (y & (~z));
                }

                function H(x, y, z) {
                    return (x ^ y ^ z);
                }

                function I(x, y, z) {
                    return (y ^ (x | (~z)));
                }

                function FF(a, b, c, d, x, s, ac) {
                    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
                    return AddUnsigned(RotateLeft(a, s), b);
                }

                function GG(a, b, c, d, x, s, ac) {
                    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
                    return AddUnsigned(RotateLeft(a, s), b);
                }

                function HH(a, b, c, d, x, s, ac) {
                    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
                    return AddUnsigned(RotateLeft(a, s), b);
                }

                function II(a, b, c, d, x, s, ac) {
                    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
                    return AddUnsigned(RotateLeft(a, s), b);
                }

                function ConvertToWordArray(string) {
                    var lWordCount;
                    var lMessageLength = string.length;
                    var lNumberOfWords_temp1 = lMessageLength + 8;
                    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
                    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                    var lWordArray = Array(lNumberOfWords - 1);
                    var lBytePosition = 0;
                    var lByteCount = 0;
                    while (lByteCount < lMessageLength) {
                        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                        lBytePosition = (lByteCount % 4) * 8;
                        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                        lByteCount++;
                    }
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                    return lWordArray;
                }

                function WordToHex(lValue) {
                    var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
                    for (lCount = 0; lCount <= 3; lCount++) {
                        lByte = (lValue >>> (lCount * 8)) & 255;
                        WordToHexValue_temp = "0" + lByte.toString(16);
                        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
                    }
                    return WordToHexValue;
                }

                function Utf8Encode(string) {
                    string = string.replace(/\r\n/g, "\n");
                    var utftext = "";

                    for (var n = 0; n < string.length; n++) {
                        var c = string.charCodeAt(n);
                        if (c < 128) {
                            utftext += String.fromCharCode(c);
                        } else if ((c > 127) && (c < 2048)) {
                            utftext += String.fromCharCode((c >> 6) | 192);
                            utftext += String.fromCharCode((c & 63) | 128);
                        } else {
                            utftext += String.fromCharCode((c >> 12) | 224);
                            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }
                    }
                    return utftext;
                }

                var x = Array();
                var k, AA, BB, CC, DD, a, b, c, d;
                var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
                var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
                var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
                var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

                string = Utf8Encode(string);
                x = ConvertToWordArray(string);
                a = 0x67452301;
                b = 0xEFCDAB89;
                c = 0x98BADCFE;
                d = 0x10325476;

                for (k = 0; k < x.length; k += 16) {
                    AA = a;
                    BB = b;
                    CC = c;
                    DD = d;
                    a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                    d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                    c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                    b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                    a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                    d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                    c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                    b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                    a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                    d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                    c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                    b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                    a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                    d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                    c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                    b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                    a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                    d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                    c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                    b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                    a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                    c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                    b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                    a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                    d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                    c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                    b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                    a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                    d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                    c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                    b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                    a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                    d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                    c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                    b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                    a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                    d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                    c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                    b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                    a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                    d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                    c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                    b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                    a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                    d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                    c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                    b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                    a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                    d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                    c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                    b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                    a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                    d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                    c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                    b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                    a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                    d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                    c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                    b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                    a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                    d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                    c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                    b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                    a = AddUnsigned(a, AA);
                    b = AddUnsigned(b, BB);
                    c = AddUnsigned(c, CC);
                    d = AddUnsigned(d, DD);
                }

                var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
                return temp.toLowerCase();
            },

            initTranslation: async () => {
                return Promise.resolve(); // 空方法
            },

            parseDescription: () => {
                try {
                    const descriptionItems = document.querySelectorAll(CONFIG.SELECTORS.DESCRIPTION);
                    if (!descriptionItems.length) return '';

                    // 将所有描述项合并成一个字符串，每项用换行符分隔
                    const description = Array.from(descriptionItems)
                        .map(item => item.textContent.trim())
                        .filter(text => text) // 过滤掉空文本
                        .join('\n\n');

                    return description;
                } catch (error) {
                    console.error('解析商品描述失败:', error);
                    return '';
                }
            },

            parseUploadTime: () => {
                try {
                    const uploadTimeElement = document.querySelector(CONFIG.SELECTORS.UPLOAD_TIME);
                    if (!uploadTimeElement) return '';

                    const dateText = uploadTimeElement.textContent.trim();
                    // 将日期转换为 YYYY-MM-DD 格式
                    const date = dayjs(dateText);
                    return date.isValid() ? date.format('YYYY-MM-DD') : '';
                } catch (error) {
                    console.error('解析上架时间失败:', error);
                    return '';
                }
            },

            // 解析配送时间
            parseDeliveryTime(text) {
                try {
                    if (!text) return null;

                    // 处理同月的情况，如 "FREE delivery June 12 - 24"
                    const sameMonthMatch = text.match(/(\w+)\s+(\d+)\s*-\s*(\d+)/i);
                    if (sameMonthMatch) {
                        const [_, month, startDay, endDay] = sameMonthMatch;
                        const year = new Date().getFullYear();
                        return {
                            start: dayjs(`${month} ${startDay} ${year}`).format('YYYY-MM-DD'),
                            end: dayjs(`${month} ${endDay} ${year}`).format('YYYY-MM-DD')
                        };
                    }

                    // 处理跨月的情况，如 "FREE delivery June 28 - July 5"
                    const crossMonthMatch = text.match(/(\w+)\s+(\d+)\s*-\s*(\w+)\s+(\d+)/i);
                    if (crossMonthMatch) {
                        const [_, startMonth, startDay, endMonth, endDay] = crossMonthMatch;
                        const year = new Date().getFullYear();
                        return {
                            start: dayjs(`${startMonth} ${startDay} ${year}`).format('YYYY-MM-DD'),
                            end: dayjs(`${endMonth} ${endDay} ${year}`).format('YYYY-MM-DD')
                        };
                    }

                    return null;
                } catch (error) {
                    console.error('解析配送时间失败:', error);
                    return null;
                }
            },

            // 获取配送时间
            getDeliveryTime() {
                try {
                    const deliveryEl = document.querySelector(CONFIG.SELECTORS.FREE_DELIVERY);
                    if (!deliveryEl) return null;

                    const deliveryText = deliveryEl.textContent.trim();
                    return this.parseDeliveryTime(deliveryText);
                } catch (error) {
                    console.error('获取配送时间失败:', error);
                    return null;
                }
            },

            // 提取卖家信息
            extractSeller() {
                try {
                    const sellerEl = document.querySelector(CONFIG.SELECTORS.SELLER);
                    return sellerEl ? sellerEl.textContent.trim() : '';
                } catch (error) {
                    console.error('提取卖家信息失败:', error);
                    return '';
                }
            },

            // 提取卖家数量
            extractSellersCount() {
                try {
                    const sellersEl = document.querySelector(CONFIG.SELECTORS.SELLERS_COUNT);
                    if (!sellersEl) return 1;  // 如果找不到元素，默认返回1

                    const text = sellersEl.textContent.trim();
                    const match = text.match(/New\s*\((\d+)\)/);
                    return match ? parseInt(match[1]) : 1;
                } catch (error) {
                    console.error('提取卖家数量失败:', error);
                    return 1;  // 发生错误时默认返回1
                }
            },

            // 提取商品图片
            extractProductImages() {
                try {
                    const images = [];
                    const imageElements = document.querySelectorAll(CONFIG.SELECTORS.PRODUCT_IMAGES);

                    imageElements.forEach(img => {
                        if (img.src) {
                            // 将小图URL转换为高清大图URL
                            const bigImageUrl = img.src
                                .replace(/_US40_/, '_SL1500_')  // 首先尝试最大尺寸
                                .replace(/_AC_/, '_AC_SL1500_') // 确保使用高质量版本
                                .replace(/\._[^\.]*_\./, '.');  // 移除其他尺寸标记

                            if (!images.includes(bigImageUrl)) {
                                images.push(bigImageUrl);
                            }
                        }
                    });

                    return images.join('\n');
                } catch (error) {
                    console.error('提取商品图片失败:', error);
                    return '';
                }
            }
        };

        // ===================== 数据提取引擎 =====================
        const DataExtractor = {
            async extractFullData() {
                try {
                    const pagesource = document.documentElement.outerHTML;
                    const [basicInfo, productDetails, techSpecs] = await Promise.all([
                        this.getBasicInfo(),
                        this.getProductDetails(),
                        Utils.parseTechSpecs()
                    ]);

                    const deliveryTime = Utils.getDeliveryTime();

                    return {
                        ...basicInfo,
                        ...productDetails,
                        ...techSpecs,
                        ...this.getAdditionalInfo(pagesource),
                        ...this.getDeliveryInfo(),
                        freeDeliveryStart: deliveryTime?.start || '',
                        freeDeliveryEnd: deliveryTime?.end || ''
                    };
                } catch (error) {
                    console.error('数据提取失败:', error);
                    throw error;
                }
            },

            async getBasicInfo() {
                try {
                    // 等待关键元素加载
                    await Promise.all([
                        Utils.waitForElement(CONFIG.SELECTORS.TITLE),
                        Utils.waitForElement(CONFIG.SELECTORS.PRICE)
                    ]);

                    // 添加短暂延迟确保DOM完全加载
                    await new Promise(resolve => setTimeout(resolve, 500));

                    const title = this.getTitle();
                    console.log('获取到标题:', title); // 添加调试日志

                    if (!title) {
                        throw new Error('无法获取商品标题');
                    }

                    const price = this.getPrice();
                    const brand = this.getBrand();
                    const categoryName = this.getCategory();

                    console.log('基本信息:', { title, price, brand, categoryName }); // 添加调试日志

                return {
                        title,
                        brand: brand || '未知品牌',
                        price: Number(price.toFixed(2)),
                        priceCNY: Utils.usdToCny(price),
                        categoryName: categoryName || '未知类目',
                        mainImage: this.getMainImageUrl(),
                        keyFeatures: this.getKeyFeatures()
                    };
                } catch (error) {
                    console.error('获取基本信息失败:', error);
                    throw new Error('无法获取商品基本信息，请刷新页面重试');
                }
            },

            getPrice() {
                try {
                    const priceSelectors = [
                        '#priceblock_ourprice',
                        '#priceblock_dealprice',
                        '.a-price .a-offscreen',
                        '#price_inside_buybox',
                        '.a-price-whole'
                    ];

                    for (const selector of priceSelectors) {
                        const element = document.querySelector(selector);
                        if (element) {
                            const priceText = element.textContent.trim();
                            const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
                            if (!isNaN(price)) {
                                return Number(price.toFixed(2));
                            }
                        }
                    }

                    return 0.00;
                } catch (error) {
                    console.error('获取价格失败:', error);
                    return 0.00;
                }
            },

            getCategory() {
                try {
                    const breadcrumbs = document.querySelectorAll('.a-breadcrumb li:not(.a-breadcrumb-divider)');
                    return breadcrumbs.length > 2 ? breadcrumbs[2].textContent.trim() : '';
                } catch (error) {
                    return '';
                }
            },

            getProductDetails() {
                try {
                    const technicalDetails = this.getTechnicalDetails();
                    const bsrRanking = this.getBestSellerRank();

                    return {
                        packageWeight: technicalDetails.item_weight || '',
                        productDimensions: technicalDetails.product_dimensions || '',
                        length: technicalDetails.length || '',
                        width: technicalDetails.width || '',
                        height: technicalDetails.height || '',
                        bsrRanking: `${bsrRanking.main.category}: ${bsrRanking.main.rank}, ${bsrRanking.sub.category}: ${bsrRanking.sub.rank}`,
                        bsrMainRank: bsrRanking.main.rank,
                        bsrMainCategory: bsrRanking.main.category,
                        bsrSubRank: bsrRanking.sub.rank,
                        bsrSubCategory: bsrRanking.sub.category,
                        seller: Utils.extractSeller(), // 添加卖家字段
                        uploadTime: technicalDetails.date_first_available || '',
                        // 技术规格
                        color: technicalDetails.color || '',
                        fabricType: technicalDetails.fabric_type || '',
                        baseMaterial: technicalDetails.base_material || '',
                        frameMaterial: technicalDetails.frame_material || '',
                        seatHeight: technicalDetails.seat_height?.replace('Centimeters', 'cm').trim() || '',
                        maxWeight: technicalDetails.maximum_weight_recommendation?.replace('Kilograms', 'kg').trim() || '',
                        size: technicalDetails.size || '',
                        style: technicalDetails.style || '',
                        images: Utils.extractProductImages(),
                        sellersNum: Utils.extractSellersCount(),  // 添加卖家数量
                    };
                } catch (error) {
                    console.error('获取产品详情失败:', error);
                    return {
                        bsrRanking: '',
                        bsrMainRank: 0,
                        bsrMainCategory: '',
                        bsrSubRank: 0,
                        bsrSubCategory: ''
                    };
                }
            },

            getAdditionalInfo(pagesource) {
                return {
                    asin: this.getAsin(pagesource),
                    currency: this.getCurrency(pagesource),
                    stock: this.getStore(),
                    description: Utils.parseDescription(),
                    attributes: this.getAttributes(pagesource, this.getAsin(pagesource)),
                    reviewsNum: this.getReviewsNumber(),
                    sellersNum: this.getSellersNumber(),
                    commodityStar: parseFloat(this.getCommodityStar()) || 0,
                    imgList: this.getImgList(pagesource)
                };
            },

            getReviewsNumber() {
                try {
                    const reviewText = Utils.getElementTextById('acrCustomerReviewText') || '';
                    return parseInt(reviewText.match(/[\d,]+/)[0].replace(/,/g, '')) || 0;
                } catch (error) {
                    return 0;
                }
            },

            getSellersNumber() {
                try {
                    return Utils.extractSellersCount();
                } catch (error) {
                    console.error('获取卖家数量失败:', error);
                    return 1;  // 发生错误时默认返回1
                }
            },

            getDeliveryInfo() {
                const deliveryTime = Utils.getDeliveryTime();
                return {
                    deliveryMethod: this.getDeliveryMethod(),
                    freeDeliveryStart: deliveryTime?.start || '',
                    freeDeliveryEnd: deliveryTime?.end || '',
                    fastestDeliveryTime: this.getFastestDeliveryTime()
                };
            },

            // 获取品牌
            getBrand() {
                try {
                    const brandText = Utils.getElementTextById('bylineInfo') || '';
                    return brandText.replace(/Brand:|Visit the | Store/gi, '').trim();
                } catch (error) {
                    return '';
                }
            },

            // 获取主图URL
            getMainImageUrl() {
                try {
                    const imgElement = document.querySelector('#imgTagWrapperId img');
                    return imgElement ? imgElement.src : '';
                } catch (error) {
                    return '';
                }
            },

            // 获取关键特性
            getKeyFeatures() {
                try {
                    const featureList = document.querySelectorAll('#feature-bullets .a-list-item');
                    return Array.from(featureList).map(item => item.textContent.trim());
                } catch (error) {
                    return [];
                }
            },

            // 获取ASIN
            getAsin(pagesource) {
                try {
                    const match = pagesource.match(/"asin":"(.*?)"/) ||
                                 pagesource.match(/ASIN\s*:\s*"([^"]+)"/) ||
                                 pagesource.match(/data-asin="([^"]+)"/);
                    return match ? match[1] : '';
                } catch (error) {
                    return '';
                }
            },

            // 获取币种
            getCurrency(pagesource) {
                try {
                    const match = pagesource.match(/currencyCode":"(.*?)"/) ||
                                 pagesource.match(/currency: "(.*?)"/);
                    return match ? match[1] : 'USD';
                } catch (error) {
                    return 'USD';
                }
            },

            // 获取库存状态
            getStore() {
                try {
                    const availabilityText = Utils.getElementTextById('availability')?.toLowerCase() || '';
                    if (availabilityText.includes('in stock')) return '有库存';
                    if (availabilityText.includes('only')) return '少量库存';
                    if (availabilityText.includes('temporarily')) return '暂时缺货';
                return '无库存';
                } catch (error) {
                    return '未知';
                }
            },

            // 获取商品描述
            getDescription() {
                try {
                    return Utils.getElementTextById('productDescription') ||
                           Utils.getElementTextById('aplus_feature_div') ||
                           '';
                } catch (error) {
                    return '';
                }
            },

            // 获取商品属性
            getAttributes(pagesource, asin) {
                try {
                    const variationData = Utils.extractJsonFromScript(/"dimensionValuesDisplayData" :(.*?\}),/, pagesource);
                    const labels = Utils.extractJsonFromScript(/"variationDisplayLabels" :(.*?\})/, pagesource);

                    if (!variationData || !labels || !asin) return {};

                    const attributes = {};
                    const keyList = Object.values(labels);
                    keyList.forEach((key, index) => {
                        if (variationData[asin] && variationData[asin][index]) {
                            attributes[key] = variationData[asin][index];
                        }
                    });
                    return attributes;
                } catch (error) {
                    return {};
                }
            },

            // 获取商品星级
            getCommodityStar() {
                try {
                    const ratingText = Utils.getElementTextById('acrPopover') || '';
                    const match = ratingText.match(/(\d+(\.\d+)?)/);
                    return match ? parseFloat(match[1]) : 0;
                } catch (error) {
                    return 0;
                }
            },

            // 获取图片列表
            getImgList(pagesource) {
                try {
                    const match = pagesource.match(/'colorImages': \{ 'initial':(.*)\},/);
                    if (!match) return [];

                    const data = JSON.parse(match[1]);
                    return data.map(img => img.hiRes || img.large || '');
                } catch (error) {
                    return [];
                }
            },

            // 获取发货方式
            getDeliveryMethod() {
                try {
                    const deliveryText = Utils.getElementTextById('merchantInfoFeature_feature_div') ||
                                       Utils.getElementTextById('fulfillerInfoFeature_feature_div') || '';

                    if (deliveryText.toLowerCase().includes('amazon')) {
                        return 'FBA';
                    }
                    return 'FBM';
                } catch (error) {
                    return '';
                }
            },

            // 获取免费配送时间
            getFreeDeliveryTime() {
                try {
                    return Utils.getElementTextById('mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE') || '';
                } catch (error) {
                    return '';
                }
            },

            // 获取最快配送时间
            getFastestDeliveryTime() {
                try {
                    return Utils.getElementTextById('mir-layout-DELIVERY_BLOCK-slot-SECONDARY_DELIVERY_MESSAGE_LARGE') || '';
                } catch (error) {
                    return '';
                }
            },

            // 添加 getTitle 方法
            getTitle() {
                try {
                    const selectors = [
                        '#productTitle',
                        '#title',
                        '.product-title',
                        'h1.a-size-large',
                        '[data-feature-name="title"]'
                    ];

                    for (const selector of selectors) {
                        const element = document.querySelector(selector);
                        if (element) {
                            const title = element.textContent.trim();
                            if (title) return title;
                        }
                    }

                    return '';
                } catch (error) {
                    console.error('获取标题失败:', error);
                    return '';
                }
            },

            // 修改 getBestSellerRank 方法
            getBestSellerRank() {
                try {
                    // 首先找到包含 "Best Sellers Rank" 的所有行
                    const rows = document.querySelectorAll('#productDetails_detailBullets_sections1 tr');
                    let bsrRow = null;

                    // 遍历找到包含 "Best Sellers Rank" 的行
                    for (const row of rows) {
                        const th = row.querySelector('th.a-color-secondary');
                        if (th && th.textContent.includes('Best Sellers Rank')) {
                            bsrRow = row;
                            break;
                        }
                    }

                    if (!bsrRow) return { main: { rank: 0, category: '' }, sub: { rank: 0, category: '' } };

                    // 获取所有排名 span 元素
                    const spans = bsrRow.querySelectorAll('td > span > span');
                    if (!spans || spans.length < 2) {
                        // 如果没有找到 span，尝试直接从 td 文本中提取
                        const tdText = bsrRow.querySelector('td')?.textContent || '';
                        const mainMatch = tdText.match(/#([\d,]+)\s+in\s+([^(]+)/);
                        const subMatch = tdText.match(/\s+#([\d,]+)\s+in\s+([^(]+?)(?=\s*\(|$)/g)?.[1]?.match(/#([\d,]+)\s+in\s+([^(]+)/);

                        return {
                            main: {
                                rank: mainMatch ? parseInt(mainMatch[1].replace(/,/g, '')) : 0,
                                category: mainMatch ? mainMatch[2].replace(/&amp;/g, '&').trim() : ''
                            },
                            sub: {
                                rank: subMatch ? parseInt(subMatch[1].replace(/,/g, '')) : 0,
                                category: subMatch ? subMatch[2].replace(/&amp;/g, '&').trim() : ''
                            }
                        };
                    }

                    // 从 span 元素中提取排名信息
                    const mainText = spans[0].textContent;
                    const mainMatch = mainText.match(/#([\d,]+)\s+in\s+([^(]+)/);
                    const mainRank = mainMatch ? parseInt(mainMatch[1].replace(/,/g, '')) : 0;
                    const mainCategory = mainMatch ? mainMatch[2].replace(/&amp;/g, '&').trim() : '';

                    const subText = spans[1].textContent;
                    const subMatch = subText.match(/#([\d,]+)\s+in\s+([^(]+)/);
                    const subRank = subMatch ? parseInt(subMatch[1].replace(/,/g, '')) : 0;
                    const subCategory = subMatch ? subMatch[2].replace(/&amp;/g, '&').trim() : '';

                    return {
                        main: {
                            rank: mainRank,
                            category: mainCategory
                        },
                        sub: {
                            rank: subRank,
                            category: subCategory
                        }
                    };
                } catch (error) {
                    console.error('获取BSR排名失败:', error);
                    return { main: { rank: 0, category: '' }, sub: { rank: 0, category: '' } };
                }
            },

            // 修改技术规格获取方法
            getTechnicalDetails() {
                try {
                    const details = {};
                    const rows = document.querySelectorAll('#productDetails_detailBullets_sections1 tr');

                    rows.forEach(row => {
                        const label = row.querySelector('th')?.textContent.trim();
                        const value = row.querySelector('td')?.textContent.trim();

                        if (label && value) {
                            // 特别处理上架时间
                            if (label === 'Date First Available') {
                                details.date_first_available = Utils.parseDate(value);
                            } else {
                                // 处理其他字段...
                                details[this.formatSpecKey(label)] = value.replace(/^‎/, '').trim();
                            }
                        }
                    });

                    return details;
                } catch (error) {
                    console.error('获取技术规格失败:', error);
                    return {};
                }
            },

            // 格式化规格键名
            formatSpecKey(key) {
                return key
                    .toLowerCase()
                    .replace(/[^a-z0-9\s]/g, '')
                    .replace(/\s+/g, '_');
            },

            // 英寸转厘米
            inchToCm(inch) {
                return (parseFloat(inch) * 2.54).toFixed(1);
            }
        };

        // ===================== 增强编辑器模块 =====================
        class EnhancedEditor {
            constructor() {
                this.container = this.createEditor();
                this.overlay = this.createOverlay();
                document.body.append(this.overlay, this.container);
                this.bindEvents();
            }

            createEditor() {
                const editor = document.createElement('div');
                editor.className = 'data-editor';
                editor.innerHTML = `
                    <div class="editor-header">
                        <h3>数据验证与编辑</h3>
                        <div class="editor-actions">
                            <button class="save-btn primary hidden" title="保存">保存</button>
                            <button class="close-btn" title="关闭">&times;</button>
                        </div>
                    </div>
                    <div class="editor-content">
                        <div class="field-group basic-info">
                            <div class="field-group-title">基础信息</div>
                            ${this.createFieldsHTML(this.getBasicFields())}
                        </div>
                        <div class="field-group tech-specs">
                            <div class="field-group-title">技术规格</div>
                            ${this.createFieldsHTML(this.getTechSpecFields())}
                        </div>
                        <div class="field-group additional-info">
                            <div class="field-group-title">其他信息</div>
                            ${this.createFieldsHTML(this.getAdditionalFields())}
                        </div>
                    </div>
                `;
                return editor;
            }

            createOverlay() {
                const overlay = document.createElement('div');
                overlay.className = 'editor-overlay';
                return overlay;
            }

            // 获取基础字段
            getBasicFields() {
                return CONFIG.FIELD_CONFIG.filter(field =>
                    ['asin', 'title', 'description', 'brand', 'price', 'priceCNY', 'categoryName', 'bsr_group', 'stock'].includes(field.key)
                );
            }

            // 获取技术规格字段
            getTechSpecFields() {
                return CONFIG.FIELD_CONFIG.filter(field =>
                    ['length', 'width', 'height', 'color', 'size', 'style', 'images'].includes(field.key)
                );
            }

            // 获取其他字段
            getAdditionalFields() {
                return CONFIG.FIELD_CONFIG.filter(field =>
                    ['currency', 'seller', 'deliveryMethod',
                     'uploadTime', 'reviewsNum', 'commodityStar', 'sellersNum',
                     'freeDeliveryTime', 'fastestDeliveryTime'].includes(field.key)
                );
            }

            // 创建字段HTML
            createFieldsHTML(fields) {
                return fields.reduce((html, field) => {
                    // 处理缩略图类型
                    if (field.type === 'thumbnails') {
                        return html + `
                            <div class="form-field">
                                <label>${field.label}</label>
                                <div class="thumbnails-container" data-field="${field.key}">
                                    <div class="loading-placeholder">加载中...</div>
                                </div>
                            </div>
                        `;
                    }

                    // 标题字段 - 移除翻译输入框
                    if (field.key === 'title') {
                        return html + `
                            <div class="form-field title-field">
                                <label>${field.label}</label>
                                <div class="input-group">
                                    <input type="text"
                                           data-field="${field.key}"
                                           ${field.readonly ? 'readonly' : ''}
                                           ${field.required ? 'required' : ''}>
                                </div>
                            </div>
                        `;
                    }

                    // 其他字段 - 移除双语输入框
                    if (['color', 'fabricType', 'baseMaterial', 'frameMaterial', 'style'].includes(field.key)) {
                        return html + `
                            <div class="form-field">
                                <label>${field.label}</label>
                                <div class="input-group">
                                    <input type="text"
                                           data-field="${field.key}"
                                           ${field.readonly ? 'readonly' : ''}
                                           ${field.required ? 'required' : ''}>
                                </div>
                            </div>
                        `;
                    }

                    // 特殊处理 BSR 排名组
                    if (field.type === 'bsr_group') {
                        return html + `
                            <div class="form-field bsr-group">
                                <label>${field.label}</label>
                                <div class="bsr-inputs">
                                    ${field.fields.map(f => `
                                        <div class="bsr-input">
                                            <div class="input-group">
                                                <input type="text"
                                                       data-field="${f.keys[1]}"
                                                       placeholder="类目"
                                                       readonly>
                                                <span class="bsr-separator">:</span>
                                                <input type="number"
                                                       data-field="${f.keys[0]}"
                                                       placeholder="排名"
                                                       readonly>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }

                    // 特殊处理价格字段组
                    if (field.key === 'price') {
                        const priceFields = fields.filter(f => ['price', 'priceCNY'].includes(f.key));
                        return html + `
                            <div class="form-field price-group">
                                <div class="price-inputs">
                                    ${priceFields.map(f => `
                                        <div class="price-input">
                                            <label>${f.label}</label>
                                            <div class="input-group">
                                                <input type="number"
                                                       data-field="${f.key}"
                                                       step="0.01"
                                                       min="0"
                                                       ${f.key === 'priceCNY' ? 'readonly disabled' : ''}
                                                       ${f.required ? 'required' : ''}>
                                                <span class="unit">${f.unit}</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }

                    // 跳过人民币价格字段，因为已经在价格组中处理
                    if (field.key === 'priceCNY') {
                        return html;
                    }

                    // 特殊处理尺寸字段组
                    if (field.key === 'length') {
                        const dimensionFields = fields.filter(f => ['length', 'width', 'height'].includes(f.key));
                        return html + `
                            <div class="form-field dimensions-group">
                                <label>商品尺寸 (Dimensions)</label>
                                <div class="dimensions-inputs">
                                    ${dimensionFields.map(f => `
                                        <div class="dimension-input">
                                            <input type="number"
                                                   data-field="${f.key}"
                                                   placeholder="${f.label.split(' ')[0]}"
                                                   ${f.readonly ? 'readonly' : ''}>
                                            <span class="unit">cm</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }
                    // 跳过宽度和高度字段，因为已经在尺寸组中处理
                    if (['width', 'height'].includes(field.key)) {
                        return html;
                    }

                    // 处理其他字段
                    return html + `
                        <div class="form-field">
                    <label>${field.label}</label>
                    <div class="input-group">
                        ${this.getInputHTML(field)}
                        ${field.unit ? `<span class="unit">${field.unit}</span>` : ''}
                            </div>
                    </div>
                `;
                }, '');
            }

            getInputHTML(field) {
                let input = '';
                switch(field.type) {
                    case 'select':
                        input = `<select data-field="${field.key}">${field.options.map(o => `<option>${o}</option>`).join('')}</select>`;
                        break;
                    case 'textarea':
                        input = `<textarea data-field="${field.key}" rows="3"></textarea>`;
                        break;
                    case 'date':
                        // 为日期输入框添加特殊处理
                        input = `
                            <div class="date-input-wrapper">
                                <input type="date"
                                       data-field="${field.key}"
                                       ${field.readonly ? 'readonly' : ''}
                                       ${field.required ? 'required' : ''}>
                                <span class="calendar-icon">📅</span>
                            </div>`;
                        break;
                    case 'number':
                        input = `
                            <div class="number-input-wrapper">
                                <input type="number"
                                       data-field="${field.key}"
                                       ${field.readonly ? 'readonly' : ''}
                                       ${field.required ? 'required' : ''}
                                       ${field.min ? `min="${field.min}"` : ''}
                                       ${field.max ? `max="${field.max}"` : ''}
                                       ${field.step ? `step="${field.step}"` : ''}>
                                ${field.unit ? `<span class="unit">${field.unit}</span>` : ''}
                            </div>`;
                        break;
                    case 'date_range':
                        input = `
                            <div class="date-range-wrapper">
                                <div class="date-input-wrapper">
                                    <input type="date"
                                           data-field="${field.keys[0]}"
                                           placeholder="开始日期">
                                    <span class="calendar-icon">📅</span>
                                </div>
                                <span class="date-separator">至</span>
                                <div class="date-input-wrapper">
                                    <input type="date"
                                           data-field="${field.keys[1]}"
                                           placeholder="结束日期">
                                    <span class="calendar-icon">📅</span>
                                </div>
                            </div>`;
                        break;
                    default:
                        input = `<input type="${field.type}"
                                       data-field="${field.key}"
                                      ${field.readonly ? 'readonly' : ''}
                                      ${field.required ? 'required' : ''}>`;
                }
                return input;
            }

            async show(data) {
                this.populateForm(data);
                this.container.classList.add('active');
                this.overlay.classList.add('active');
                return new Promise(resolve => this.resolve = resolve);
            }

            async populateForm(data) {
                this.data = data; // 保存数据以供后续使用

                for (const field of CONFIG.FIELD_CONFIG) {
                    if (field.type === 'thumbnails') {
                        const container = this.container.querySelector(`[data-field="${field.key}"]`);
                        if (!container) continue;

                        const images = (data[field.key] || '').split('\n').filter(url => url);
                        container.innerHTML = images.length === 0
                            ? '<div style="color:#999;text-align:center;width:100%;">暂无图片</div>'
                            : images.map(url => {
                                // 为缩略图使用较小的尺寸，为放大图使用最大尺寸
                                const thumbUrl = url.replace(/_SL1500_/, '_SL200_');
                                return `
                                    <div class="thumbnail-item" data-full-img="${url}">
                                        <img src="${thumbUrl}" alt="商品图片">
                                    </div>
                                `;
                            }).join('');

                        // 修改放大图片容器的HTML
                        if (!document.querySelector('.global-image-zoom')) {
                            const zoomContainer = document.createElement('div');
                            zoomContainer.className = 'global-image-zoom';
                            zoomContainer.innerHTML = `
                                <div class="zoom-header">
                                    <div class="similar-buttons">
                                        <button class="find-similar-btn taobao">淘宝找相似</button>
                                        <button class="find-similar-btn alibaba">阿里巴巴找相似</button>
                                        <button class="find-similar-btn platform-1688">1688找相似</button>
                                    </div>
                                </div>
                                <img src="" alt="商品大图">
                            `;
                            document.body.appendChild(zoomContainer);

                            // 绑定三个平台的找相似按钮点击事件
                            const imgElement = zoomContainer.querySelector('img');

                            // 淘宝找相似
                            zoomContainer.querySelector('.find-similar-btn.taobao').addEventListener('click', (e) => {
                                e.stopPropagation();
                                const imgUrl = imgElement.src;
                                openTaobaoImageSearch(imgUrl);
                            });

                            // 阿里巴巴找相似
                            zoomContainer.querySelector('.find-similar-btn.alibaba').addEventListener('click', (e) => {
                                e.stopPropagation();
                                const imgUrl = imgElement.src;
                                openAlibabaImageSearch(imgUrl);
                            });

                            // 1688找相似
                            zoomContainer.querySelector('.find-similar-btn.platform-1688').addEventListener('click', (e) => {
                                e.stopPropagation();
                                const imgUrl = imgElement.src;
                                open1688ImageSearch(imgUrl);
                            });

                            // 添加鼠标事件监听
                            zoomContainer.addEventListener('mouseenter', () => {
                                zoomContainer.style.display = 'block';
                            });

                            zoomContainer.addEventListener('mouseleave', () => {
                                zoomContainer.style.display = 'none';
                            });
                        }

                        // 修改缩略图的鼠标事件处理
                        container.querySelectorAll('.thumbnail-item').forEach(item => {
                            item.addEventListener('mouseenter', (e) => {
                                const zoomContainer = document.querySelector('.global-image-zoom');
                                const fullImg = e.currentTarget.dataset.fullImg;
                                zoomContainer.querySelector('img').src = fullImg;
                                zoomContainer.style.display = 'block';
                            });

                            item.addEventListener('mouseleave', (e) => {
                                const zoomContainer = document.querySelector('.global-image-zoom');
                                // 检查鼠标是否移动到放大容器上
                                const rect = zoomContainer.getBoundingClientRect();
                                const toElement = e.relatedTarget;
                                if (!zoomContainer.contains(toElement)) {
                                    zoomContainer.style.display = 'none';
                                }
                            });
                        });
                    } else {
                        const input = this.container.querySelector(`[data-field="${field.key}"]`);
                        if (!input) continue;

                        input.value = typeof data[field.key] === 'object'
                            ? JSON.stringify(data[field.key])
                            : data[field.key] || '';
                    }
                }
            }

            validateForm() {
                let isValid = true;
                this.container.querySelectorAll('[required]').forEach(input => {
                    if (!input.value.trim()) {
                        input.classList.add('invalid');
                        isValid = false;
                    }
                });
                return isValid;
            }

            bindEvents() {
                // 保存按钮事件
                this.container.querySelector('.save-btn').addEventListener('click', e => {
                    e.preventDefault();
                    if (this.validateForm()) {
                        const formData = this.collectFormData();
                        this.resolve(formData);
                        this.hide();
                    }
                });

                // 关闭按钮事件
                this.container.querySelector('.close-btn').addEventListener('click', () => {
                    this.resolve(null);
                    this.hide();
                });

                // 点击遮罩层关闭
                this.overlay.addEventListener('click', (e) => {
                    if (e.target === this.overlay) {
                        this.resolve(null);
                        this.hide();
                    }
                });

                // ESC键关闭
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.container.classList.contains('active')) {
                        this.resolve(null);
                        this.hide();
                    }
                });

                // 添加价格联动事件
                const priceInput = this.container.querySelector('[data-field="price"]');
                const priceCNYInput = this.container.querySelector('[data-field="priceCNY"]');

                priceInput?.addEventListener('input', (e) => {
                    const usdPrice = parseFloat(e.target.value) || 0;
                    priceCNYInput.value = Utils.usdToCny(usdPrice);
                });
            }

            collectFormData() {
                const data = {};
                CONFIG.FIELD_CONFIG.forEach(field => {
                    if (field.type === 'date_range') {
                        const startInput = this.container.querySelector(`[data-field="${field.keys[0]}"]`);
                        const endInput = this.container.querySelector(`[data-field="${field.keys[1]}"]`);
                        data[field.key] = {
                            start: startInput?.value || '',
                            end: endInput?.value || ''
                        };
                    } else {
                    const input = this.container.querySelector(`[data-field="${field.key}"]`);
                        if (input) {
                    data[field.key] = input.value;
                        }
                    }
                });
                return data;
            }

            hide() {
                this.container.classList.remove('active');
                this.overlay.classList.remove('active');
            }

            gatherData() {
                const deliveryTime = Utils.getDeliveryTime();
                const data = {
                    // ... 其他字段 ...
                    description: Utils.parseDescription(),
                    uploadTime: Utils.parseUploadTime(),
                    freeDeliveryStart: deliveryTime?.start || '',
                    freeDeliveryEnd: deliveryTime?.end || '',
                    // ... 其他字段 ...
                };
                return data;
            }

            renderField(field) {
                if (field.type === 'thumbnails') {
                    return this.renderThumbnails(field);
                }
                // ... 其他字段类型的渲染逻辑 ...
            }

            renderThumbnails(field) {
                const container = document.createElement('div');
                container.className = 'thumbnails-container';

                const images = (this.data[field.key] || '').split('\n').filter(url => url);

                if (images.length === 0) {
                    container.innerHTML = '<div style="color:#999;text-align:center;width:100%;">暂无图片</div>';
                    return container;
                }

                images.forEach(url => {
                    const item = document.createElement('div');
                    item.className = 'thumbnail-item';

                    const img = document.createElement('img');
                    img.src = url;
                    img.alt = '商品图片';

                    img.onclick = () => {
                        window.open(url, '_blank');
                    };

                    item.appendChild(img);
                    container.appendChild(item);
                });

                return container;
            }
        }

        // ===================== 主界面模块 =====================
        class MainUI {
            constructor() {
                this.container = null;
                this.overlay = null;
                this.editor = new EnhancedEditor();
                this.createUI();
                this.bindEvents();
            }

            // 添加事件绑定方法
            bindEvents() {
                // 点击遮罩层关闭
                this.overlay.addEventListener('click', (e) => {
                    // 确保点击的是遮罩层而不是其子元素
                    if (e.target === this.overlay) {
                        this.hide();
                    }
                });

                // ESC键关闭
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        this.hide();
                    }
                });
            }

            // 添加隐藏方法
            hide() {
                this.container.classList.remove('active');
                this.overlay.classList.remove('active');
            }

            // 添加显示方法
            show() {
                this.container.classList.add('active');
                this.overlay.classList.add('active');
            }

            // 修改 createUI 方法，添加遮罩层
            createUI() {
                // 创建遮罩层
                this.overlay = document.createElement('div');
                this.overlay.className = 'scraper-overlay';
                document.body.appendChild(this.overlay);

                // 创建主容器
                this.container = document.createElement('div');
                this.container.className = 'scraper-ui';
                this.container.innerHTML = `
                    <button class="scraper-btn">开始采集</button>
                    <div class="loading">
                        <div class="spinner"></div>
                    </div>
                `;
                document.body.appendChild(this.container);

                // 绑定采集按钮点击事件
                this.container.querySelector('.scraper-btn').addEventListener('click', () => {
                    this.handleCollect().catch(console.error);
                });
            }

            async handleCollect() {
                const btn = document.querySelector('.scraper-btn');
                const loadingEl = document.querySelector('.loading');
                btn.disabled = true;
                loadingEl.style.display = 'flex';

                try {
                    const rawData = await DataExtractor.extractFullData();

                    // 检查关键数据是否存在
                    if (!rawData.title || rawData.title === '获取失败') {
                        throw new Error('无法获取商品基本信息，请刷新页面重试');
                    }

                    const finalData = await this.editor.show(rawData);
                    if (finalData) {
                        await this.sendData(finalData);
                        GM_notification({
                            title: '采集成功',
                            text: '数据已保存',
                            timeout: 2000
                        });
                    }
                } catch (error) {
                    console.error('采集失败:', error);
                    GM_notification({
                        title: '采集失败',
                        text: error.message || '请检查网络连接并重试',
                        timeout: 3000
                    });
                } finally {
                    btn.disabled = false;
                    loadingEl.style.display = 'none';
                }
            }

            async sendData(data) {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: CONFIG.API_URL,
                        headers: { 'Content-Type': 'application/json' },
                        data: JSON.stringify(data),
                        onload: res => res.status === 200 ? resolve() : reject(res.statusText),
                        onerror: reject
                    });
                });
            }

            bindEvents() {
                document.querySelector('.scraper-btn').addEventListener('click', () => {
                    this.handleCollect().catch(console.error);
                });
            }
        }

        // ===================== 样式注入 =====================
        GM_addStyle(`
            .scraper-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9998;
            }

            .scraper-overlay.active {
                display: block;
            }

            .scraper-ui {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                display: block;
            }

            .scraper-btn {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: #4CAF50;
                color: white;
                border: none;
                cursor: pointer;
                font-size: 14px;
                line-height: 1.2;
                padding: 10px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                word-break: keep-all;
                white-space: nowrap;
            }

            .scraper-btn::before {
                content: '📥';
                font-size: 24px;
                margin-bottom: 4px;
            }

            .scraper-btn:hover {
                background: #45a049;
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            .scraper-btn:active {
                transform: scale(0.95);
            }

            .scraper-btn:disabled {
                background: #cccccc;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            .data-editor {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 1200px;
                width: 95%;
                max-height: 90vh;
                overflow-y: auto;
                z-index: 10000;
            }

            .editor-content {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin-bottom: 20px;
            }

            .field-group {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 6px;
            }

            .field-group-title {
                font-size: 14px;
                font-weight: bold;
                color: #1a73e8;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 1px solid #e0e0e0;
            }

            .form-field {
                margin-bottom: 12px;
            }

            .form-field label {
                display: block;
                margin-bottom: 4px;
                color: #333;
                font-size: 12px;
            }

            .form-field input,
            .form-field select,
            .form-field textarea {
                width: 100%;
                padding: 6px 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 13px;
            }

            .form-field textarea {
                height: 60px;
                resize: vertical;
            }

            .form-field input.invalid {
                border-color: #ff4444;
            }

            .editor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 15px;
                margin-bottom: 20px;
                border-bottom: 1px solid #e0e0e0;
            }

            .editor-header h3 {
                margin: 0;
                font-size: 18px;
                color: #1a73e8;
            }

            .editor-actions {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .save-btn {
                padding: 6px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                background: #1a73e8;
                color: white;
                transition: background 0.2s;
            }

            .save-btn:hover {
                background: #1557b0;
            }

            .close-btn {
                padding: 4px 8px;
                border: none;
                background: none;
                font-size: 24px;
                line-height: 1;
                color: #666;
                cursor: pointer;
                transition: color 0.2s;
            }

            .close-btn:hover {
                color: #333;
            }

            .data-editor {
                display: none;
                cursor: default;
            }

            .data-editor.active {
                display: block;
            }

            .loading {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                justify-content: center;
                align-items: center;
            }

            .spinner {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .unit {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                color: #666;
            }

            .dimensions-group {
                margin-bottom: 12px;
            }

            .dimensions-inputs {
                display: flex;
                gap: 10px;
            }

            .dimension-input {
                flex: 1;
                position: relative;
            }

            .dimension-input input {
                width: 100%;
                padding: 6px 8px;
                padding-right: 30px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 13px;
            }

            .dimension-input .unit {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                color: #666;
                font-size: 12px;
            }

            .dimension-input input::-webkit-outer-spin-button,
            .dimension-input input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            .dimension-input input[type=number] {
                -moz-appearance: textfield;
            }

            .price-group {
                margin-bottom: 12px;
            }

            .price-inputs {
                display: flex;
                gap: 15px;
            }

            .price-input {
                flex: 1;
            }

            .price-input input {
                padding-right: 25px !important;
            }

            .price-input .unit {
                right: 8px;
                font-weight: bold;
            }

            .price-input input[disabled] {
                background-color: #f5f5f5;
                cursor: not-allowed;
            }

            .bsr-group {
                margin-bottom: 12px;
            }

            .bsr-inputs {
                display: grid;
                grid-template-columns: 1fr;
                gap: 8px;
            }

            .bsr-input .input-group {
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .bsr-input input[type="text"] {
                flex: 1;
                min-width: 120px;
            }

            .bsr-input input[type="number"] {
                width: 100px;
                text-align: right;
            }

            .bsr-separator {
                font-weight: bold;
                color: #666;
                padding: 0 5px;
            }

            .bsr-input input {
                padding: 6px 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 13px;
                background-color: #f5f5f5;
            }

            .date-input-wrapper {
                position: relative;
                width: 100%;
            }

            .date-input-wrapper input[type="date"] {
                width: 100%;
                padding-right: 30px;
            }

            .calendar-icon {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                pointer-events: none;
                font-size: 14px;
                color: #666;
            }

            /* 隐藏默认的日期选择器图标 */
            input[type="date"]::-webkit-calendar-picker-indicator {
                opacity: 0;
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                cursor: pointer;
            }

            .number-input-wrapper {
                position: relative;
                width: 100%;
            }

            .number-input-wrapper input {
                width: 100%;
                padding-right: 30px !important;
            }

            .number-input-wrapper .unit {
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                color: #666;
                font-size: 12px;
                pointer-events: none;
            }

            .title-field .input-group.stacked {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .title-field input {
                width: 100%;
            }

            .title-field .cn-translation {
                background-color: #f5f5f5;
                color: #666;
                border: 1px solid #ddd;
                font-style: italic;
            }

            .bilingual-field .input-group {
                display: flex;
                gap: 8px;
            }

            .bilingual-field input {
                flex: 1;
            }

            .bilingual-field .cn-translation {
                background-color: #f5f5f5;
                color: #666;
                border: 1px solid #ddd;
                min-width: 80px;
            }

            .date-range-wrapper {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .date-range-wrapper .date-input-wrapper {
                flex: 1;
            }

            .date-separator {
                color: #666;
                font-size: 12px;
            }

            .zoom-header {
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 10002;
            }

            .find-similar-btn {
                background: #ff4400;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .find-similar-btn:hover {
                background: #ff5500;
                transform: scale(1.05);
            }

            .find-similar-btn:active {
                transform: scale(0.95);
            }

            .global-image-zoom {
                position: relative;
            }

            .similar-buttons {
                display: flex;
                gap: 8px;
            }

            .find-similar-btn {
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s ease;
                border: none;
                color: white;
            }

            .find-similar-btn.taobao {
                background: #ff4400;
            }

            .find-similar-btn.alibaba {
                background: #FF6A00;
            }

            .find-similar-btn.platform-1688 {
                background: #FF8C00;
            }

            .find-similar-btn:hover {
                transform: scale(1.05);
                opacity: 0.9;
            }

            .find-similar-btn:active {
                transform: scale(0.95);
            }

            .hidden {
                display: none !important;
            }
        `);

        // 移除翻译相关样式
        GM_addStyle(`
            /* 移除翻译相关样式 */
            .title-field .input-group.stacked,
            .title-field .cn-translation,
            .bilingual-field .input-group,
            .bilingual-field .cn-translation {
                display: none;
            }
        `);

        // 更新缩略图样式
        GM_addStyle(`
            .thumbnails-container {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                padding: 10px;
                background: #f8f8f8;
                border: 1px solid #ddd;
                border-radius: 4px;
                min-height: 100px;
                max-height: 300px;
                overflow-y: auto;
            }

            .thumbnail-item {
                position: relative;
                width: 80px;
                height: 80px;
                border: 1px solid #ddd;
                border-radius: 4px;
                overflow: hidden;
                background: white;
                cursor: pointer;
            }

            .thumbnail-item img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }

            .global-image-zoom {
                display: none;
                position: fixed;
                z-index: 10001;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 800px;  /* 增加放大图片的尺寸 */
                height: 800px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                padding: 20px;
                transition: opacity 0.2s;
            }

            .global-image-zoom img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                image-rendering: -webkit-optimize-contrast;  /* 提高图片渲染质量 */
                image-rendering: crisp-edges;
            }

            .loading-placeholder {
                width: 100%;
                text-align: center;
                color: #999;
                padding: 20px;
            }
        `);

        // ===================== 初始化逻辑 =====================
        async function init() {
            try {
                // 检查是否已经存在采集工具
                if (!document.querySelector('.scraper-ui')) {
            new MainUI();
                }

                // 监听页面变化
            new MutationObserver(_.debounce(() => {
                    if (!document.querySelector('.scraper-ui')) {
                    new MainUI();
                }
            }, 300)).observe(document.body, {
                childList: true,
                subtree: true
            });
            } catch (error) {
                console.error('初始化失败:', error);
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    })();

    // 将搜索方法移到类的外部，作为独立函数
    function openTaobaoImageSearch(imgUrl) {
        try {
            // 生成随机的 localImgKey
            const timestamp = Date.now();
            const random1 = Math.floor(Math.random() * 1000);
            const random2 = Math.floor(Math.random() * 1000);
            const random3 = Math.floor(Math.random() * 1000);
            const localImgKey = `localImgSearchKey1_${random1}_${random2}_${random3}_${timestamp}`;

            // 使用完整的淘宝以图搜链接格式
            const searchUrl = `https://s.taobao.com/search?` +
                `ie=utf8` +
                `&search_type=item` +
                `&spm=a21bo.jianhua.search_image.image_search_button` +
                `&tab=all` +
                `&imgfile=${encodeURIComponent(imgUrl)}` +
                `&localImgKey=${localImgKey}`;

            // 在新窗口中打开搜索结果
            window.open(searchUrl, '_blank');

            // 提示用户
            GM_notification({
                title: '淘宝找相似',
                text: '正在搜索相似商品...',
                timeout: 3000
            });

        } catch (error) {
            console.error('淘宝搜索失败:', error);
            GM_notification({
                title: '错误',
                text: '淘宝搜索失败，请重试',
                timeout: 3000
            });
        }
    }

    function openAlibabaImageSearch(imgUrl) {
        try {
            const searchUrl = `https://www.alibaba.com/picture/search.htm?imageAddress=${encodeURIComponent(imgUrl)}&imageType=url`;
            window.open(searchUrl, '_blank');
            GM_notification({
                title: '阿里巴巴找相似',
                text: '正在搜索相似商品...',
                timeout: 3000
            });
        } catch (error) {
            console.error('阿里巴巴搜索失败:', error);
            GM_notification({
                title: '错误',
                text: '阿里巴巴搜索失败，请重试',
                timeout: 3000
            });
        }
    }

    function open1688ImageSearch(imgUrl) {
        try {
            const searchUrl = `https://s.1688.com/similar/similar_search.htm?imageAddress=${encodeURIComponent(imgUrl)}`;
            window.open(searchUrl, '_blank');
            GM_notification({
                title: '1688找相似',
                text: '正在搜索相似商品...',
                timeout: 3000
            });
        } catch (error) {
            console.error('1688搜索失败:', error);
            GM_notification({
                title: '错误',
                text: '1688搜索失败，请重试',
                timeout: 3000
            });
        }
    }