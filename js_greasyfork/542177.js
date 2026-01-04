// ==UserScript==
// @name         GMV计算器 - 多角度业务分析工具
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  支持8种不同角度的GMV计算，现代化苹果风格UI，数据记录功能
// @author       Your Name
// @match        *://*/*
// @grant        GM_setValue
// @license MIT
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/542177/GMV%E8%AE%A1%E7%AE%97%E5%99%A8%20-%20%E5%A4%9A%E8%A7%92%E5%BA%A6%E4%B8%9A%E5%8A%A1%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/542177/GMV%E8%AE%A1%E7%AE%97%E5%99%A8%20-%20%E5%A4%9A%E8%A7%92%E5%BA%A6%E4%B8%9A%E5%8A%A1%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式定义
    const styles = `
        .gmv-calculator {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 420px;
            max-height: 90vh;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }

        .gmv-calculator.minimized {
            width: 60px;
            height: 60px;
            border-radius: 30px;
        }

        .gmv-header {
            background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
            color: white;
            padding: 16px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: move;
        }

        .gmv-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }

        .gmv-controls {
            display: flex;
            gap: 8px;
        }

        .gmv-btn {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            border-radius: 8px;
            color: white;
            padding: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .gmv-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .gmv-content {
            padding: 20px;
            max-height: calc(90vh - 80px);
            overflow-y: auto;
        }

        .gmv-calculator.minimized .gmv-content,
        .gmv-calculator.minimized .gmv-header h3,
        .gmv-calculator.minimized .gmv-controls .gmv-btn:not(.minimize-btn) {
            display: none;
        }

        .angle-selector {
            margin-bottom: 20px;
        }

        .angle-selector label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #1d1d1f;
        }

        .angle-select {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e5e7;
            border-radius: 12px;
            font-size: 14px;
            background: white;
            transition: all 0.2s ease;
        }

        .angle-select:focus {
            outline: none;
            border-color: #007AFF;
            box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
        }

        .input-group {
            margin-bottom: 16px;
        }

        .input-group label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #424245;
            font-size: 13px;
        }

        .input-field {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e5e7;
            border-radius: 12px;
            font-size: 14px;
            transition: all 0.2s ease;
            box-sizing: border-box;
        }

        .input-field:focus {
            outline: none;
            border-color: #007AFF;
            box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
        }

        .calculate-btn {
            width: 100%;
            background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
            color: white;
            border: none;
            padding: 14px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 20px;
        }

        .calculate-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 20px rgba(0, 122, 255, 0.3);
        }

        .result {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 20px;
            border-left: 4px solid #007AFF;
        }

        .result h4 {
            margin: 0 0 8px 0;
            color: #1d1d1f;
            font-size: 16px;
        }

        .result .value {
            font-size: 24px;
            font-weight: 700;
            color: #007AFF;
            margin: 8px 0;
        }

        .result .details {
            font-size: 12px;
            color: #86868b;
        }

        .history-section {
            border-top: 1px solid #e5e5e7;
            padding-top: 20px;
            margin-top: 20px;
        }

        .history-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

        .history-header h4 {
            margin: 0;
            font-size: 14px;
            color: #424245;
        }

        .clear-history {
            background: #ff3b30;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 8px;
            font-size: 12px;
            cursor: pointer;
        }

        .history-item {
            background: white;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 8px;
            border: 1px solid #e5e5e7;
            font-size: 12px;
        }

        .history-item .time {
            color: #86868b;
            margin-bottom: 4px;
        }

        .history-item .angle {
            font-weight: 600;
            color: #1d1d1f;
            margin-bottom: 4px;
        }

        .history-item .result-value {
            color: #007AFF;
            font-weight: 600;
        }

        .fade-in {
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* 滚动条样式 */
        .gmv-content::-webkit-scrollbar {
            width: 6px;
        }

        .gmv-content::-webkit-scrollbar-track {
            background: transparent;
        }

        .gmv-content::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
        }

        .gmv-content::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.3);
        }

        /* GPM 多字段样式 */
        .gpm-field-group {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 16px;
            border-left: 3px solid #007AFF;
        }

        .gpm-field-group h5 {
            margin: 0 0 12px 0;
            font-size: 13px;
            font-weight: 600;
            color: #424245;
        }

        .gpm-field-row {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 8px;
            margin-bottom: 12px;
        }

        .gpm-field-row:last-child {
            margin-bottom: 0;
        }

        .gpm-field-item {
            display: flex;
            flex-direction: column;
        }

        .gpm-field-item label {
            font-size: 11px;
            margin-bottom: 4px;
            color: #86868b;
        }

        .gpm-field-item input {
            padding: 8px 12px;
            font-size: 12px;
            border: 1px solid #e5e5e7;
            border-radius: 6px;
        }

        /* 单品多品选择器 */
        .product-mode-selector {
            background: #f0f0f0;
            border-radius: 8px;
            padding: 8px;
            margin-bottom: 16px;
            display: flex;
            gap: 4px;
        }

        .product-mode-option {
            flex: 1;
            padding: 8px 16px;
            background: transparent;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 500;
            color: #424245;
            transition: all 0.2s ease;
        }

        .product-mode-option.active {
            background: #007AFF;
            color: white;
        }

        .product-mode-option:hover:not(.active) {
            background: rgba(0, 122, 255, 0.1);
        }

        /* 动态商品输入 */
        .product-input-section {
            margin-bottom: 16px;
        }

        .product-input-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
        }

        .add-product-btn {
            background: #34c759;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .add-product-btn:hover {
            background: #30d158;
        }

        .product-item {
            background: white;
            border: 1px solid #e5e5e7;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 8px;
            position: relative;
        }

        .product-item-header {
            display: flex;
            justify-content: between;
            align-items: center;
            margin-bottom: 8px;
        }

        .product-item-title {
            font-weight: 600;
            font-size: 13px;
            color: #424245;
        }

        .remove-product-btn {
            background: #ff3b30;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            cursor: pointer;
            position: absolute;
            top: 8px;
            right: 8px;
        }

        .remove-product-btn:hover {
            background: #ff2d20;
        }

        /* 计算结果详情 */
        .calculation-details {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 12px;
            margin-top: 12px;
            font-size: 12px;
        }

        .calculation-step {
            margin-bottom: 8px;
            padding: 6px 8px;
            background: white;
            border-radius: 4px;
            border-left: 3px solid #007AFF;
        }

        .calculation-step:last-child {
            margin-bottom: 0;
        }

        .calculation-step-title {
            font-weight: 600;
            color: #424245;
            margin-bottom: 2px;
        }

        .calculation-step-value {
            color: #007AFF;
            font-weight: 600;
        }
    `;

    // 计算角度配置
    const calculationAngles = {
        business: {
            name: '经营模式角度',
            formula: 'GMV = 自营GMV + 合作GMV',
            fields: [
                { key: 'self_gmv', label: '自营GMV (元)', type: 'number' },
                { key: 'coop_gmv', label: '合作GMV (元)', type: 'number' }
            ],
            calculate: (data) => {
                return {
                    result: (parseFloat(data.self_gmv) || 0) + (parseFloat(data.coop_gmv) || 0),
                    details: `自营GMV: ${formatNumber(data.self_gmv)} + 合作GMV: ${formatNumber(data.coop_gmv)}`
                };
            }
        },
        platform: {
            name: '三大载体角度',
            formula: 'GMV = 直播GMV + 短视频GMV + 商品卡GMV',
            fields: [
                { key: 'live_gmv', label: '直播GMV (元)', type: 'number' },
                { key: 'video_gmv', label: '短视频GMV (元)', type: 'number' },
                { key: 'card_gmv', label: '商品卡GMV (元)', type: 'number' }
            ],
            calculate: (data) => {
                return {
                    result: (parseFloat(data.live_gmv) || 0) + (parseFloat(data.video_gmv) || 0) + (parseFloat(data.card_gmv) || 0),
                    details: `直播: ${formatNumber(data.live_gmv)} + 短视频: ${formatNumber(data.video_gmv)} + 商品卡: ${formatNumber(data.card_gmv)}`
                };
            }
        },
        live_duration: {
            name: '直播间角度 - 时长维度',
            formula: 'GMV = 直播时长 × 单小时曝光次数 × 进入率 × 千次观看成交金额 ÷ 1000',
            fields: [
                { key: 'duration', label: '直播时长 (小时)', type: 'number' },
                { key: 'hourly_exposure', label: '单小时曝光次数', type: 'number' },
                { key: 'entry_rate', label: '进入率 (%)', type: 'number' },
                { key: 'cpm_amount', label: '千次观看成交金额 (元)', type: 'number' }
            ],
            calculate: (data) => {
                const result = (parseFloat(data.duration) || 0) * (parseFloat(data.hourly_exposure) || 0) *
                              (parseFloat(data.entry_rate) || 0) / 100 * (parseFloat(data.cpm_amount) || 0) / 1000;
                return {
                    result: result,
                    details: `${data.duration}小时 × ${formatNumber(data.hourly_exposure)}次曝光 × ${data.entry_rate}%进入率 × ${formatNumber(data.cpm_amount)}元CPM`
                };
            }
        },
        live_exposure: {
            name: '直播间角度 - 曝光维度',
            formula: 'GMV = 直播间曝光PV × 千次曝光成交金额 ÷ 1000',
            fields: [
                { key: 'exposure_pv', label: '直播间曝光PV', type: 'number' },
                { key: 'cpm_amount', label: '千次曝光成交金额 (元)', type: 'number' }
            ],
            calculate: (data) => {
                const result = (parseFloat(data.exposure_pv) || 0) * (parseFloat(data.cpm_amount) || 0) / 1000;
                return {
                    result: result,
                    details: `${formatNumber(data.exposure_pv)}PV × ${formatNumber(data.cpm_amount)}元CPM`
                };
            }
        },
        video_traffic: {
            name: '短视频角度 - 引流',
            formula: 'GMV = 直播期间曝光次数 × 直播进入率 × 千次观看成交金额 ÷ 1000',
            fields: [
                { key: 'exposure_count', label: '直播期间曝光次数', type: 'number' },
                { key: 'live_entry_rate', label: '直播进入率 (%)', type: 'number' },
                { key: 'cpm_amount', label: '千次观看成交金额 (元)', type: 'number' }
            ],
            calculate: (data) => {
                const result = (parseFloat(data.exposure_count) || 0) * (parseFloat(data.live_entry_rate) || 0) / 100 *
                              (parseFloat(data.cpm_amount) || 0) / 1000;
                return {
                    result: result,
                    details: `${formatNumber(data.exposure_count)}次曝光 × ${data.live_entry_rate}%进入率 × ${formatNumber(data.cpm_amount)}元CPM`
                };
            }
        },
        video_cart: {
            name: '短视频角度 - 挂车',
            formula: 'GMV = 短视频播放量 × 千次曝光成交金额 ÷ 1000',
            fields: [
                { key: 'play_count', label: '短视频播放量', type: 'number' },
                { key: 'cpm_amount', label: '千次曝光成交金额 (元)', type: 'number' }
            ],
            calculate: (data) => {
                const result = (parseFloat(data.play_count) || 0) * (parseFloat(data.cpm_amount) || 0) / 1000;
                return {
                    result: result,
                    details: `${formatNumber(data.play_count)}播放量 × ${formatNumber(data.cpm_amount)}元CPM`
                };
            }
        },
        product_card: {
            name: '商品卡角度',
            formula: 'GMV = 商品卡曝光人数 × 点击率 × 转化率 × 客单价',
            fields: [
                { key: 'exposure_users', label: '商品卡曝光人数', type: 'number' },
                { key: 'click_rate', label: '点击率 (%)', type: 'number' },
                { key: 'conversion_rate', label: '转化率 (%)', type: 'number' },
                { key: 'avg_order_value', label: '客单价 (元)', type: 'number' }
            ],
            calculate: (data) => {
                const result = (parseFloat(data.exposure_users) || 0) * (parseFloat(data.click_rate) || 0) / 100 *
                              (parseFloat(data.conversion_rate) || 0) / 100 * (parseFloat(data.avg_order_value) || 0);
                return {
                    result: result,
                    details: `${formatNumber(data.exposure_users)}人曝光 × ${data.click_rate}%点击率 × ${data.conversion_rate}%转化率 × ${formatNumber(data.avg_order_value)}元客单价`
                };
            }
        },
        store: {
            name: '店铺角度',
            formula: 'GMV = 成交人数 × 人均购买频次 × 客单价 × 单次购买件数',
            fields: [
                { key: 'buyers', label: '成交人数', type: 'number' },
                { key: 'purchase_frequency', label: '人均购买频次', type: 'number' },
                { key: 'avg_order_value', label: '客单价 (元)', type: 'number' },
                { key: 'items_per_order', label: '单次购买件数', type: 'number' }
            ],
            calculate: (data) => {
                const result = (parseFloat(data.buyers) || 0) * (parseFloat(data.purchase_frequency) || 0) *
                              (parseFloat(data.avg_order_value) || 0) * (parseFloat(data.items_per_order) || 0);
                return {
                    result: result,
                    details: `${formatNumber(data.buyers)}人 × ${data.purchase_frequency}次频次 × ${formatNumber(data.avg_order_value)}元客单价 × ${data.items_per_order}件/次`
                };
            }
        },
        video_gpm: {
            name: 'GPM计算 - 挂车视频',
            formula: '总GPM = Σ(各渠道GPM × 流量占比)，单渠道GPM = GMV/PV × 1000',
            fields: [
                { key: 'feed_gmv', label: '推荐feed GMV (元)', type: 'number' },
                { key: 'feed_pv', label: '推荐feed PV', type: 'number' },
                { key: 'feed_ratio', label: '推荐feed流量占比 (%)', type: 'number' },
                { key: 'search_gmv', label: '搜索 GMV (元)', type: 'number' },
                { key: 'search_pv', label: '搜索 PV', type: 'number' },
                { key: 'search_ratio', label: '搜索流量占比 (%)', type: 'number' },
                { key: 'other_gmv', label: '其他 GMV (元)', type: 'number' },
                { key: 'other_pv', label: '其他 PV', type: 'number' },
                { key: 'other_ratio', label: '其他流量占比 (%)', type: 'number' },
                { key: 'profile_gmv', label: '个人主页 GMV (元)', type: 'number' },
                { key: 'profile_pv', label: '个人主页 PV', type: 'number' },
                { key: 'profile_ratio', label: '个人主页流量占比 (%)', type: 'number' },
                { key: 'follow_gmv', label: '关注 GMV (元)', type: 'number' },
                { key: 'follow_pv', label: '关注 PV', type: 'number' },
                { key: 'follow_ratio', label: '关注流量占比 (%)', type: 'number' }
            ],
            calculate: (data) => {
                // 计算各渠道GPM
                const feedGPM = (parseFloat(data.feed_gmv) || 0) / (parseFloat(data.feed_pv) || 1) * 1000;
                const searchGPM = (parseFloat(data.search_gmv) || 0) / (parseFloat(data.search_pv) || 1) * 1000;
                const otherGPM = (parseFloat(data.other_gmv) || 0) / (parseFloat(data.other_pv) || 1) * 1000;
                const profileGPM = (parseFloat(data.profile_gmv) || 0) / (parseFloat(data.profile_pv) || 1) * 1000;
                const followGPM = (parseFloat(data.follow_gmv) || 0) / (parseFloat(data.follow_pv) || 1) * 1000;

                // 计算加权GPM
                const feedWeightedGPM = feedGPM * (parseFloat(data.feed_ratio) || 0) / 100;
                const searchWeightedGPM = searchGPM * (parseFloat(data.search_ratio) || 0) / 100;
                const otherWeightedGPM = otherGPM * (parseFloat(data.other_ratio) || 0) / 100;
                const profileWeightedGPM = profileGPM * (parseFloat(data.profile_ratio) || 0) / 100;
                const followWeightedGPM = followGPM * (parseFloat(data.follow_ratio) || 0) / 100;

                const totalGPM = feedWeightedGPM + searchWeightedGPM + otherWeightedGPM + profileWeightedGPM + followWeightedGPM;

                return {
                    result: totalGPM,
                    details: `推荐feed: ${feedGPM.toFixed(2)}×${data.feed_ratio}%=${feedWeightedGPM.toFixed(2)} + 搜索: ${searchGPM.toFixed(2)}×${data.search_ratio}%=${searchWeightedGPM.toFixed(2)} + 其他: ${otherGPM.toFixed(2)}×${data.other_ratio}%=${otherWeightedGPM.toFixed(2)} + 主页: ${profileGPM.toFixed(2)}×${data.profile_ratio}%=${profileWeightedGPM.toFixed(2)} + 关注: ${followGPM.toFixed(2)}×${data.follow_ratio}%=${followWeightedGPM.toFixed(2)} = 总GPM: ${totalGPM.toFixed(2)}`
                };
            }
        },
        live_product_gpm: {
            name: 'GPM计算 - 直播间商品',
            formula: '商品总GPM = 总GMV/总曝光次数×1000',
            fields: [
                { key: 'live_exposure', label: '直播间曝光次数', type: 'number' },
                { key: 'exposure_entry_rate', label: '曝光进入率 (%)', type: 'number' }
            ],
            calculate: (data) => {
                // 动态处理商品数据
                const products = [];

                // 收集所有商品数据 - 遍历所有可能的键
                Object.keys(data).forEach(key => {
                    if (key.endsWith('_gmv')) {
                        const index = key.replace('product_', '').replace('_gmv', '');
                        const gmvKey = `product_${index}_gmv`;
                        const gpmKey = `product_${index}_gpm`;

                        if (data[gmvKey] && data[gpmKey]) {
                            const gmv = parseFloat(data[gmvKey]) || 0;
                            const gpm = parseFloat(data[gpmKey]) || 1;
                            products.push({ gmv, gpm });
                        }
                    }
                });

                // 如果没有动态商品数据，使用传统的ABCD字段
                if (products.length === 0) {
                    ['a', 'b', 'c', 'd'].forEach(letter => {
                        const gmv = parseFloat(data[`product_${letter}_gmv`]) || 0;
                        const gpm = parseFloat(data[`product_${letter}_gpm`]) || 1;
                        if (gmv > 0) {
                            products.push({ gmv, gpm });
                        }
                    });
                }

                // 1. 计算各商品曝光次数
                const productExposures = products.map(product => product.gmv / product.gpm * 1000);

                // 2. 商品总曝光次数
                const totalProductExposure = productExposures.reduce((sum, exposure) => sum + exposure, 0);

                // 3. 总GMV
                const totalGMV = products.reduce((sum, product) => sum + product.gmv, 0);

                // 4. 计算商品总GPM
                const totalProductGPM = totalProductExposure > 0 ? totalGMV / totalProductExposure * 1000 : 0;

                // 5. 计算直播间观看次数
                const liveViewCount = (parseFloat(data.live_exposure) || 0) * (parseFloat(data.exposure_entry_rate) || 0) / 100;

                // 6. 计算商品曝光率（次数）= 商品曝光次数/直播间观看次数*100%
                const productExposureRate = liveViewCount > 0 ? totalProductExposure / liveViewCount * 100 : 0;

                // 7. 计算千次观看成交金额 = 商品总GPM × 商品曝光率
                const cpmAmount = totalProductGPM * (productExposureRate / 100);

                return {
                    result: totalProductGPM,
                    details: {
                        totalProductExposure: totalProductExposure.toFixed(2),
                        totalProductGPM: totalProductGPM.toFixed(2),
                        liveViewCount: liveViewCount.toFixed(2),
                        productExposureRate: productExposureRate.toFixed(2),
                        cpmAmount: cpmAmount.toFixed(2),
                        totalGMV: totalGMV.toFixed(2),
                        productCount: products.length
                    }
                };
            }
        }
    };

    // 工具函数
    function formatNumber(num) {
        if (!num) return '0';
        return parseFloat(num).toLocaleString('zh-CN');
    }

    function formatCurrency(num) {
        if (!num) return '¥0.00';
        return '¥' + parseFloat(num).toLocaleString('zh-CN', { minimumFractionDigits: 2 });
    }

    function saveCalculation(angle, data, result) {
        const history = JSON.parse(GM_getValue('gmv_history', '[]'));
        const calculation = {
            id: Date.now(),
            timestamp: new Date().toLocaleString('zh-CN'),
            angle: calculationAngles[angle].name,
            data: data,
            result: result.result,
            details: result.details
        };
        history.unshift(calculation);
        // 只保留最近50条记录
        if (history.length > 50) {
            history.splice(50);
        }
        GM_setValue('gmv_history', JSON.stringify(history));
    }

    function getHistory() {
        return JSON.parse(GM_getValue('gmv_history', '[]'));
    }

    function clearHistory() {
        GM_setValue('gmv_history', '[]');
    }

    // 创建UI
    function createCalculatorUI() {
        const calculator = document.createElement('div');
        calculator.className = 'gmv-calculator';
        calculator.innerHTML = `
            <div class="gmv-header">
                <h3>GMV计算器</h3>
                <div class="gmv-controls">
                    <button class="gmv-btn minimize-btn" title="最小化">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                            <path d="M2 7h10v1H2V7z"/>
                        </svg>
                    </button>
                    <button class="gmv-btn close-btn" title="关闭">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                            <path d="M7 6.293l4.646-4.647.708.708L7.707 7l4.647 4.646-.708.708L7 7.707 2.354 12.354l-.708-.708L6.293 7 1.646 2.354l.708-.708L7 6.293z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="gmv-content">
                <div class="angle-selector">
                    <label for="angle-select">选择计算角度</label>
                    <select id="angle-select" class="angle-select">
                        <option value="">请选择计算角度...</option>
                        ${Object.entries(calculationAngles).map(([key, angle]) =>
                            `<option value="${key}">${angle.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div id="formula-display" style="display: none; margin-bottom: 20px; padding: 12px; background: #f8f9fa; border-radius: 8px; font-size: 12px; color: #424245;"></div>
                <div id="input-fields"></div>
                <button id="calculate-btn" class="calculate-btn" style="display: none;">计算GMV</button>
                <div id="result-display"></div>
                <div class="history-section">
                    <div class="history-header">
                        <h4>计算历史</h4>
                        <button id="clear-history" class="clear-history">清空</button>
                    </div>
                    <div id="history-list"></div>
                </div>
            </div>
        `;

        return calculator;
    }

    // 初始化
    function init() {
        // 添加样式
        const style = document.createElement('style');
        style.textContent = styles;
        document.head.appendChild(style);

        // 创建计算器
        const calculator = createCalculatorUI();
        document.body.appendChild(calculator);

        // 使计算器可拖拽
        makeDraggable(calculator);

        // 绑定事件
        bindEvents(calculator);

        // 加载历史记录
        loadHistory();
    }

    // 拖拽功能
    function makeDraggable(element) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const header = element.querySelector('.gmv-header');

        header.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target.closest('.gmv-controls')) return;

            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === header || header.contains(e.target)) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, element);
            }
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }
    }

    // 绑定事件
    function bindEvents(calculator) {
        const angleSelect = calculator.querySelector('#angle-select');
        const calculateBtn = calculator.querySelector('#calculate-btn');
        const minimizeBtn = calculator.querySelector('.minimize-btn');
        const closeBtn = calculator.querySelector('.close-btn');
        const clearHistoryBtn = calculator.querySelector('#clear-history');

        // 角度选择
        angleSelect.addEventListener('change', function() {
            const selectedAngle = this.value;
            if (selectedAngle) {
                showInputFields(selectedAngle);
                showFormula(selectedAngle);
                calculateBtn.style.display = 'block';
            } else {
                hideInputFields();
                hideFormula();
                calculateBtn.style.display = 'none';
            }
        });

        // 计算按钮
        calculateBtn.addEventListener('click', function() {
            const selectedAngle = angleSelect.value;
            if (selectedAngle) {
                performCalculation(selectedAngle);
            }
        });

        // 最小化
        minimizeBtn.addEventListener('click', function() {
            calculator.classList.toggle('minimized');
        });

        // 关闭
        closeBtn.addEventListener('click', function() {
            calculator.style.display = 'none';
        });

        // 清空历史
        clearHistoryBtn.addEventListener('click', function() {
            if (confirm('确定要清空所有计算历史吗？')) {
                clearHistory();
                loadHistory();
            }
        });
    }

    // 显示公式
    function showFormula(angleKey) {
        const formulaDisplay = document.querySelector('#formula-display');
        const angle = calculationAngles[angleKey];
        formulaDisplay.textContent = `计算公式：${angle.formula}`;
        formulaDisplay.style.display = 'block';
        formulaDisplay.classList.add('fade-in');
    }

    // 隐藏公式
    function hideFormula() {
        const formulaDisplay = document.querySelector('#formula-display');
        formulaDisplay.style.display = 'none';
    }

    // 显示输入字段
    function showInputFields(angleKey) {
        const inputFields = document.querySelector('#input-fields');
        const angle = calculationAngles[angleKey];

        // GPM计算特殊布局
        if (angleKey === 'video_gpm') {
            inputFields.innerHTML = `
                <div class="gpm-field-group">
                    <h5>推荐Feed流量</h5>
                    <div class="gpm-field-row">
                        <div class="gpm-field-item">
                            <label for="feed_gmv">GMV (元)</label>
                            <input type="number" id="feed_gmv" class="input-field" placeholder="133905.98">
                        </div>
                        <div class="gpm-field-item">
                            <label for="feed_pv">PV</label>
                            <input type="number" id="feed_pv" class="input-field" placeholder="1485690">
                        </div>
                        <div class="gpm-field-item">
                            <label for="feed_ratio">流量占比 (%)</label>
                            <input type="number" id="feed_ratio" class="input-field" placeholder="82">
                        </div>
                    </div>
                </div>
                <div class="gpm-field-group">
                    <h5>搜索流量</h5>
                    <div class="gpm-field-row">
                        <div class="gpm-field-item">
                            <label for="search_gmv">GMV (元)</label>
                            <input type="number" id="search_gmv" class="input-field" placeholder="23799.57">
                        </div>
                        <div class="gpm-field-item">
                            <label for="search_pv">PV</label>
                            <input type="number" id="search_pv" class="input-field" placeholder="146361">
                        </div>
                        <div class="gpm-field-item">
                            <label for="search_ratio">流量占比 (%)</label>
                            <input type="number" id="search_ratio" class="input-field" placeholder="8">
                        </div>
                    </div>
                </div>
                <div class="gpm-field-group">
                    <h5>其他流量</h5>
                    <div class="gpm-field-row">
                        <div class="gpm-field-item">
                            <label for="other_gmv">GMV (元)</label>
                            <input type="number" id="other_gmv" class="input-field" placeholder="15529.2">
                        </div>
                        <div class="gpm-field-item">
                            <label for="other_pv">PV</label>
                            <input type="number" id="other_pv" class="input-field" placeholder="108985">
                        </div>
                        <div class="gpm-field-item">
                            <label for="other_ratio">流量占比 (%)</label>
                            <input type="number" id="other_ratio" class="input-field" placeholder="6">
                        </div>
                    </div>
                </div>
                <div class="gpm-field-group">
                    <h5>个人主页流量</h5>
                    <div class="gpm-field-row">
                        <div class="gpm-field-item">
                            <label for="profile_gmv">GMV (元)</label>
                            <input type="number" id="profile_gmv" class="input-field" placeholder="8416.7">
                        </div>
                        <div class="gpm-field-item">
                            <label for="profile_pv">PV</label>
                            <input type="number" id="profile_pv" class="input-field" placeholder="44707">
                        </div>
                        <div class="gpm-field-item">
                            <label for="profile_ratio">流量占比 (%)</label>
                            <input type="number" id="profile_ratio" class="input-field" placeholder="2">
                        </div>
                    </div>
                </div>
                <div class="gpm-field-group">
                    <h5>关注流量</h5>
                    <div class="gpm-field-row">
                        <div class="gpm-field-item">
                            <label for="follow_gmv">GMV (元)</label>
                            <input type="number" id="follow_gmv" class="input-field" placeholder="3186.3">
                        </div>
                        <div class="gpm-field-item">
                            <label for="follow_pv">PV</label>
                            <input type="number" id="follow_pv" class="input-field" placeholder="20428">
                        </div>
                        <div class="gpm-field-item">
                            <label for="follow_ratio">流量占比 (%)</label>
                            <input type="number" id="follow_ratio" class="input-field" placeholder="1">
                        </div>
                    </div>
                </div>
            `;
        } else if (angleKey === 'live_product_gpm') {
            inputFields.innerHTML = `
                <div class="product-mode-selector">
                    <button type="button" class="product-mode-option active" data-mode="single">单品计算</button>
                    <button type="button" class="product-mode-option" data-mode="multiple">多品计算</button>
                </div>

                <div id="single-product-section" class="product-input-section">
                    <div class="gpm-field-group">
                        <h5>单品数据</h5>
                        <div class="gpm-field-row">
                            <div class="gpm-field-item">
                                <label for="single_product_gmv">商品GMV (元)</label>
                                <input type="number" id="single_product_gmv" class="input-field" placeholder="4453.6">
                            </div>
                            <div class="gpm-field-item">
                                <label for="single_product_gpm">商品GPM</label>
                                <input type="number" id="single_product_gpm" class="input-field" placeholder="574.51">
                            </div>
                            <div class="gpm-field-item"></div>
                        </div>
                    </div>
                </div>

                <div id="multiple-product-section" class="product-input-section" style="display: none;">
                    <div class="product-input-header">
                        <h5>多商品数据</h5>
                        <button type="button" class="add-product-btn" id="add-product-btn">
                            <span>+</span> 添加商品
                        </button>
                    </div>
                    <div id="products-container">
                        <div class="product-item" data-index="0">
                            <button type="button" class="remove-product-btn" data-index="0" style="display: none;">删除</button>
                            <div class="product-item-header">
                                <span class="product-item-title">商品 1</span>
                            </div>
                            <div class="gpm-field-row">
                                <div class="gpm-field-item">
                                    <label for="product_0_gmv">GMV (元)</label>
                                    <input type="number" id="product_0_gmv" class="input-field" placeholder="4453.6">
                                </div>
                                <div class="gpm-field-item">
                                    <label for="product_0_gpm">GPM</label>
                                    <input type="number" id="product_0_gpm" class="input-field" placeholder="574.51">
                                </div>
                                <div class="gpm-field-item"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="gpm-field-group">
                    <h5>直播间数据</h5>
                    <div class="gpm-field-row">
                        <div class="gpm-field-item">
                            <label for="live_exposure">直播间曝光次数</label>
                            <input type="number" id="live_exposure" class="input-field" placeholder="请输入直播间曝光次数">
                        </div>
                        <div class="gpm-field-item">
                            <label for="exposure_entry_rate">曝光进入率 (%)</label>
                            <input type="number" id="exposure_entry_rate" class="input-field" placeholder="请输入曝光进入率">
                        </div>
                        <div class="gpm-field-item"></div>
                    </div>
                </div>
            `;

            // 重置商品计数器并绑定模式切换事件
            setTimeout(() => {
                resetProductCount();
                bindProductModeEvents();
            }, 100);
        } else {
            // 默认布局
            inputFields.innerHTML = angle.fields.map(field => `
                <div class="input-group">
                    <label for="${field.key}">${field.label}</label>
                    <input type="${field.type}" id="${field.key}" class="input-field" placeholder="请输入${field.label}">
                </div>
            `).join('');
        }

        inputFields.classList.add('fade-in');
    }

    // 隐藏输入字段
    function hideInputFields() {
        const inputFields = document.querySelector('#input-fields');
        inputFields.innerHTML = '';
    }

    // 执行计算
    function performCalculation(angleKey) {
        const angle = calculationAngles[angleKey];
        const data = {};
        let isValid = true;

        // 特殊处理直播间商品GPM计算
        if (angleKey === 'live_product_gpm') {
            // 收集直播间数据
            const liveExposure = document.querySelector('#live_exposure');
            const entryRate = document.querySelector('#exposure_entry_rate');

            if (!liveExposure || !entryRate || !liveExposure.value.trim() || !entryRate.value.trim()) {
                alert('请填写直播间数据');
                return;
            }

            data.live_exposure = liveExposure.value;
            data.exposure_entry_rate = entryRate.value;

            // 直接尝试收集所有可能的商品数据
            let hasProductData = false;

            // 尝试单品模式数据
            const singleGmv = document.querySelector('#single_product_gmv');
            const singleGpm = document.querySelector('#single_product_gpm');

            if (singleGmv && singleGpm && singleGmv.value.trim() && singleGpm.value.trim()) {
                data.product_0_gmv = singleGmv.value;
                data.product_0_gpm = singleGpm.value;
                hasProductData = true;
            }

            // 尝试收集多品模式数据（product_0, product_1, etc.）
            for (let i = 0; i < 20; i++) { // 最多检查20个商品
                const gmvInput = document.querySelector(`#product_${i}_gmv`);
                const gpmInput = document.querySelector(`#product_${i}_gpm`);

                if (gmvInput && gpmInput && gmvInput.value.trim() && gpmInput.value.trim()) {
                    data[`product_${i}_gmv`] = gmvInput.value;
                    data[`product_${i}_gpm`] = gpmInput.value;
                    hasProductData = true;
                }
            }

            if (!hasProductData) {
                alert('请填写商品数据（GMV和GPM都必须填写）');
                return;
            }
        } else {
            // 标准字段收集
            angle.fields.forEach(field => {
                const input = document.querySelector(`#${field.key}`);
                const value = input.value.trim();
                if (!value) {
                    isValid = false;
                    input.style.borderColor = '#ff3b30';
                    setTimeout(() => {
                        input.style.borderColor = '#e5e5e7';
                    }, 2000);
                } else {
                    data[field.key] = value;
                }
            });

            if (!isValid) {
                alert('请填写所有必需字段');
                return;
            }
        }

        // 执行计算
        const result = angle.calculate(data);

        // 保存计算记录
        saveCalculation(angleKey, data, result);

        // 显示结果
        showResult(result, angle.name);

        // 刷新历史记录
        loadHistory();
    }

    // 显示结果
    function showResult(result, angleName) {
        const resultDisplay = document.querySelector('#result-display');
        const isGPM = angleName.includes('GPM');
        const resultValue = isGPM ? `${result.result.toFixed(2)} GPM` : formatCurrency(result.result);

        let detailsHtml = '';

        // 特殊处理直播间商品GPM的详细计算步骤
        if (angleName.includes('直播间商品') && typeof result.details === 'object') {
            detailsHtml = `
                <div class="calculation-details">
                    <div class="calculation-step">
                        <div class="calculation-step-title">1. 商品总曝光次数</div>
                        <div class="calculation-step-value">${result.details.totalProductExposure} 次</div>
                    </div>
                    <div class="calculation-step">
                        <div class="calculation-step-title">2. 商品总GMV</div>
                        <div class="calculation-step-value">¥${result.details.totalGMV}</div>
                    </div>
                    <div class="calculation-step">
                        <div class="calculation-step-title">3. 计算商品总GPM</div>
                        <div class="calculation-step-value">${result.details.totalProductGPM} GPM</div>
                    </div>
                    <div class="calculation-step">
                        <div class="calculation-step-title">4. 直播间观看次数</div>
                        <div class="calculation-step-value">${result.details.liveViewCount} 次</div>
                    </div>
                    <div class="calculation-step">
                        <div class="calculation-step-title">5. 商品曝光率</div>
                        <div class="calculation-step-value">${result.details.productExposureRate}%</div>
                    </div>
                    <div class="calculation-step">
                        <div class="calculation-step-title">6. 千次观看成交金额</div>
                        <div class="calculation-step-value">¥${result.details.cpmAmount}</div>
                        <div style="font-size: 10px; color: #86868b; margin-top: 2px;">
                            ${result.details.totalProductGPM} × ${result.details.productExposureRate}% = ${result.details.cpmAmount}
                        </div>
                    </div>
                    <div style="text-align: center; margin-top: 8px; font-size: 11px; color: #86868b;">
                        基于 ${result.details.productCount} 个商品的数据计算
                    </div>
                </div>
            `;
        } else {
            detailsHtml = `<div class="details">${result.details}</div>`;
        }

        resultDisplay.innerHTML = `
            <div class="result fade-in">
                <h4>${angleName} - 计算结果</h4>
                <div class="value">${resultValue}</div>
                ${detailsHtml}
            </div>
        `;
    }

    // 加载历史记录
    function loadHistory() {
        const historyList = document.querySelector('#history-list');
        const history = getHistory();

        if (history.length === 0) {
            historyList.innerHTML = '<div style="text-align: center; color: #86868b; padding: 20px; font-size: 12px;">暂无计算历史</div>';
            return;
        }

        historyList.innerHTML = history.slice(0, 10).map(item => {
            const isGPM = item.angle.includes('GPM');
            const resultValue = isGPM ? `${item.result.toFixed(2)} GPM` : formatCurrency(item.result);
            return `
                <div class="history-item">
                    <div class="time">${item.timestamp}</div>
                    <div class="angle">${item.angle}</div>
                    <div class="result-value">${resultValue}</div>
                </div>
            `;
        }).join('');
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 添加快捷键支持
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key === 'g') {
            const calculator = document.querySelector('.gmv-calculator');
            if (calculator) {
                calculator.style.display = calculator.style.display === 'none' ? 'block' : 'none';
            }
        }
    });

    // 商品管理函数
    let productCount = 1;

    // 重置商品计数器
    function resetProductCount() {
        productCount = 1;
    }

    window.bindProductModeEvents = function() {
        const modeButtons = document.querySelectorAll('.product-mode-option');
        const singleSection = document.getElementById('single-product-section');
        const multipleSection = document.getElementById('multiple-product-section');
        const addProductBtn = document.getElementById('add-product-btn');

        // 模式切换事件
        modeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                modeButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const mode = this.dataset.mode;
                if (mode === 'single') {
                    singleSection.style.display = 'block';
                    multipleSection.style.display = 'none';
                } else {
                    singleSection.style.display = 'none';
                    multipleSection.style.display = 'block';
                }
            });
        });

        // 添加商品按钮事件
        if (addProductBtn) {
            addProductBtn.addEventListener('click', addProductField);
        }

        // 删除商品按钮事件（事件委托）
        const productsContainer = document.getElementById('products-container');
        if (productsContainer) {
            productsContainer.addEventListener('click', function(e) {
                if (e.target.classList.contains('remove-product-btn')) {
                    const index = e.target.dataset.index;
                    removeProductField(index);
                }
            });
        }
    };

    window.addProductField = function() {
        const container = document.getElementById('products-container');
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.dataset.index = productCount;

        productItem.innerHTML = `
            <button type="button" class="remove-product-btn" data-index="${productCount}">删除</button>
            <div class="product-item-header">
                <span class="product-item-title">商品 ${productCount + 1}</span>
            </div>
            <div class="gpm-field-row">
                <div class="gpm-field-item">
                    <label for="product_${productCount}_gmv">GMV (元)</label>
                    <input type="number" id="product_${productCount}_gmv" class="input-field" placeholder="请输入GMV">
                </div>
                <div class="gpm-field-item">
                    <label for="product_${productCount}_gpm">GPM</label>
                    <input type="number" id="product_${productCount}_gpm" class="input-field" placeholder="请输入GPM">
                </div>
                <div class="gpm-field-item"></div>
            </div>
        `;

        container.appendChild(productItem);
        productCount++;

        // 显示第一个商品的删除按钮
        const firstProduct = document.querySelector('.product-item[data-index="0"] .remove-product-btn');
        if (firstProduct && productCount > 1) {
            firstProduct.style.display = 'block';
        }
    };

    window.removeProductField = function(index) {
        const productItem = document.querySelector(`.product-item[data-index="${index}"]`);
        if (productItem) {
            productItem.remove();

            // 重新编号剩余商品
            const remainingProducts = document.querySelectorAll('.product-item');
            remainingProducts.forEach((product, idx) => {
                const title = product.querySelector('.product-item-title');
                if (title) {
                    title.textContent = `商品 ${idx + 1}`;
                }
            });

            // 如果只剩一个商品，隐藏删除按钮
            if (remainingProducts.length <= 1) {
                const firstDeleteBtn = document.querySelector('.product-item .remove-product-btn');
                if (firstDeleteBtn) {
                    firstDeleteBtn.style.display = 'none';
                }
            }
        }
    };

})();