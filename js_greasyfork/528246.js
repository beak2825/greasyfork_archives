// ==UserScript==
// @name         必购家增强助手
// @namespace    https://github.com/freeyoung
// @version      0.7.2
// @description  增强必购家包裹列表，订单列表，订单详情页功能
// @author       Eric Qian
// @match        https://www.beegoplus.com/zh_CN/member-center/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=beegoplus.com
// @grant        GM_xmlhttpRequest
// @connect      api-jiyun.beegoplus.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528246/%E5%BF%85%E8%B4%AD%E5%AE%B6%E5%A2%9E%E5%BC%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/528246/%E5%BF%85%E8%B4%AD%E5%AE%B6%E5%A2%9E%E5%BC%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储API返回的数据
    let ordersData = [];
    let packagesData = [];

    // 创建统计面板
    let statsPanel = null;

    // 获取认证信息
    async function getAuthHeaders() {
        return new Promise(async (resolve) => {
            console.log('开始获取认证信息...');

            const token = localStorage.getItem('TOKEN');
            const xuuid = localStorage.getItem('XUUID');
            let appKey = '';

            try {
                const headerScriptTag = document.querySelector('script[src*="header.js"]');
                if (headerScriptTag) {
                    const headerJsUrl = headerScriptTag.src;
                    const response = await fetch(headerJsUrl);
                    const text = await response.text();
                    const match = text.match(/e\.headers\["App-key"\]\s*=\s*['"](.*?)['"]/);
                    if (match) {
                        appKey = match[1];
                        console.log('已获取到 appKey');
                    } else {
                        console.error('未能获取到 appKey, header.js 脚本中没有 App-Key header?');
                    }
                } else {
                    console.error('页面中未找到 header.js 脚本标签');
                    console.log('未能获取到 appKey, 页面中是否有 header.js 脚本?');
                }
            } catch (error) {
                console.error('获取 appKey 时出错:', error);
            }

            if (token && xuuid && appKey) {
                console.log('获取到认证信息');
                resolve({
                    'accept': 'application/json, text/plain, */*',
                    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'language': 'zh_CN',
                    'app-key': appKey,
                    'authorization': token,
                    'x-uuid': xuuid
                });
                return;
            }

            console.log('未能获取到认证信息');
            resolve(null);
        });
    }

    // 统一的 API 请求函数
    async function fetchAPI(url, headers, retryCount = 0) {
        if (retryCount >= 5) {
            console.error('重试次数超过限制，停止重试');
            return null;
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: headers,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.ret === 1 && data.data?.data) {
                                resolve(data.data.data);
                            } else {
                                reject(new Error('API返回数据格式不正确'));
                            }
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        reject(new Error(`API 请求失败: ${response.status}`));
                    }
                },
                onerror: reject
            });
        }).catch(error => {
            console.error('API请求失败:', error);
            if (retryCount < 5) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(fetchAPI(url, headers, retryCount + 1));
                    }, 1000);
                });
            }
            return null;
        });
    }

    // 监听页面变化
    function setupPageChangeListener() {
        let lastUrl = window.location.href;
        let isProcessing = false;
        let timeoutId = null;

        const observer = new MutationObserver(async () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(async () => {
                const currentUrl = window.location.href;
                if (lastUrl !== currentUrl) {
                    console.log('检测到页面切换:', currentUrl);
                    lastUrl = currentUrl;

                    if (!isProcessing) {
                        isProcessing = true;

                        // 清理数据
                        ordersData = [];
                        packagesData = [];
                        if (statsPanel) {
                            statsPanel.style.display = 'none';
                        }

                        // 等待页面 DOM 更新完成
                        await new Promise(resolve => setTimeout(resolve, 500));

                        // 根据URL判断当前页面类型并执行相应的增强
                        if (currentUrl.includes('order-management')) {
                            await fetchOrders();
                        } else if (currentUrl.includes('package-list')) {
                            await fetchPackages();
                        } else if (currentUrl.includes('orderDetail')) {
                            await enhanceOrderDetail();
                        }

                        isProcessing = false;
                    }
                }
            }, 300);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始化时执行一次
        const currentUrl = window.location.href;
        if (currentUrl.includes('order-management')) {
            fetchOrders();
        } else if (currentUrl.includes('package-list')) {
            fetchPackages();
        } else if (currentUrl.includes('orderDetail')) {
            enhanceOrderDetail();
        }
    }

    // 格式化订单数据
    function formatOrderData(order) {
        const videoBaseUrl = 'https://jiyun-video-1332579831.cos.ap-hongkong.myqcloud.com/';
        return {
            orderId: order.id,
            orderSn: order.order_sn,
            logisticsSn: order.logistics_sn || '未知',
            expressName: order.express?.name || '未知',
            expressCode: order.express?.code || '未知',
            lineName: order.express_name || '未知',
            actualWeight: order.actual_weight,
            volumeWeight: order.volume_weight,
            paymentWeight: order.payment_weight,
            length: order.length,
            width: order.width,
            height: order.height,
            value: order.value,
            insuranceFee: order.insurance_fee,
            freightFee: order.freight_fee,
            pointAmount: order.point_amount,
            couponDiscountFee: order.coupon_discount_fee,
            modFee: order.mod_fee,
            discountPaymentFee: order.discount_payment_fee,
            actualPaymentFee: order.actual_payment_fee,
            createdAt: order.created_at,
            packedAt: order.packed_at,
            paidAt: order.paid_at,
            shippedAt: order.shipped_at,
            remark: order.remark,
            remarkAgain: order.remark_again,
            vipRemark: order.vip_remark,
            videos: order.videos?.map(video => ({
                id: video.id,
                orderId: video.order_id,
                url: videoBaseUrl + video.name
            })) || []
        };
    }

    // 格式化包裹数据
    function formatPackageData(pkg) {
        return {
            id: pkg.id,
            packageSn: pkg.express_num,
            statusText: pkg.status_text,
            packageName: pkg.package_name,
            packageValue: pkg.package_value,
            packageWeight: pkg.package_weight,
            location: pkg.location,
            packagePictures: pkg.package_pictures || [],
            remark: pkg.remark,
            inStorageRemark: pkg.in_storage_remark,
            inStorageAt: pkg.in_storage_at,
            createdAt: pkg.created_at,
            updatedAt: pkg.updated_at,
            countryName: pkg.country?.cn_name || '未知',
            props: pkg.prop || []
        };
    }

    // 创建统计面板
    function createStatsPanel() {
        if (statsPanel) {
            return statsPanel;
        }

        statsPanel = document.createElement('div');
        statsPanel.className = 'stats-panel';
        statsPanel.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 20px;
            padding: 15px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            z-index: 9999;
            min-width: 250px;
            max-width: 350px;
            font-size: 14px;
        `;

        statsPanel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px; color: #409eff;">统计信息</div>
            <div class="stats-content" style="max-height: 300px; overflow-y: auto;"></div>
        `;

        document.body.appendChild(statsPanel);
        return statsPanel;
    }

    // 更新包裹统计信息
    function updatePackageStats() {
        console.log('执行 updatePackageStats 函数');
        if (!packagesData || packagesData.length === 0) {
            console.log('没有包裹数据，不更新统计信息');
            return;
        }

        const statsPanel = createStatsPanel();
        const statsContent = statsPanel.querySelector('.stats-content');

        // 获取当前页面状态
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('activeName') || '1';
        console.log('当前页面状态:', status);

        // 只在已入库页面（状态为2）显示统计信息
        if (status !== '2') {
            console.log('非已入库页面，隐藏统计面板');
            if (statsPanel) {
                statsPanel.style.display = 'none';
            }
            return;
        }

        const checkedBoxes = document.querySelectorAll('.el-checkbox.is-checked');

        // 如果没有选中的复选框，隐藏统计面板
        if (checkedBoxes.length === 0) {
            console.log('没有选中的复选框，隐藏统计面板');
            if (statsPanel) {
                statsPanel.style.display = 'none';
            }
            return;
        }

        // 获取选中的包裹索引
        const selectedIndices = Array.from(checkedBoxes).map(checkbox => {
            // 向上查找最近的包裹容器
            const packageItem = checkbox.closest('.package-item-container');
            if (!packageItem) {
                console.log('未找到包裹容器');
                return -1;
            }

            const allItems = Array.from(document.querySelectorAll('.package-item-container'));
            const index = allItems.indexOf(packageItem);
            console.log('找到包裹索引:', index);
            return index;
        }).filter(index => index !== -1);

        console.log('选中的包裹索引:', selectedIndices);

        // 过滤出选中的包裹数据
        const selectedPackages = selectedIndices.map(index => packagesData[index]).filter(Boolean);
        console.log('选中的包裹数据数量:', selectedPackages.length);

        // 如果没有有效的选中包裹数据，隐藏统计面板
        if (selectedPackages.length === 0) {
            console.log('没有有效的选中包裹数据，隐藏统计面板');
            if (statsPanel) {
                statsPanel.style.display = 'none';
            }
            return;
        }

        // 计算统计数据
        let totalWeight = 0;
        let totalValue = 0;
        let typeWeights = {
            '普货': 0,
            '非普货': 0
        };
        let typeCounts = {
            '普货': 0,
            '非普货': 0
        };

        selectedPackages.forEach(pkg => {
            const weight = pkg.packageWeight || 0;
            totalWeight += weight;
            totalValue += pkg.packageValue || 0;

            // 统计普货和非普货
            let isPuHuo = false;
            if (pkg.props && pkg.props.length > 0) {
                // 检查是否有普货属性
                isPuHuo = pkg.props.some(prop =>
                    prop.name === '普货' || prop.cn_name === '普货'
                );
            }

            if (isPuHuo) {
                typeCounts['普货']++;
                typeWeights['普货'] += weight;
            } else {
                typeCounts['非普货']++;
                typeWeights['非普货'] += weight;
            }
        });

        // 更新统计面板内容
        statsContent.innerHTML = `
            <div style="margin-bottom: 8px;">已选包裹数: <span style="font-weight: 500;">${selectedPackages.length}</span></div>
            <div style="margin-bottom: 8px;">总入库重量: <span style="font-weight: 500;">${(totalWeight / 1000).toFixed(3)} KG</span></div>
            <div style="margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px;">总申报价值: <span style="font-weight: 500;">¥${(totalValue / 100).toFixed(2)}</span></div>

            <div style="font-weight: bold; margin-top: 12px; margin-bottom: 8px; color: #409eff;">类型分布</div>
            ${Object.entries(typeCounts).filter(([type, count]) => count > 0).map(([type, count]) =>
                `<div style="margin-bottom: 5px; display: flex; justify-content: space-between;">
                    <span>${type}:</span>
                    <span style="font-weight: 500;">${count}件 (${(typeWeights[type] / 1000).toFixed(3)} KG)</span>
                </div>`
            ).join('')}
        `;

        statsPanel.style.display = 'block';
    }

    // 获取订单数据
    async function fetchOrders() {
        console.log('开始获取订单数据...');

        const authHeaders = await getAuthHeaders();
        if (!authHeaders) {
            console.error('获取认证信息失败');
            return;
        }
        console.log('认证信息获取成功');

        // 从 URL 获取分页和状态信息
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = urlParams.get('page') || '1';
        const pageSize = urlParams.get('size') || '10';
        const activeName = urlParams.get('activeName') || '2';  // 默认值设为2
        // 将 activeName 转为数字并减2得到实际的 status
        const status = Math.max(0, parseInt(activeName) - 2).toString();

        const apiUrl = `https://api-jiyun.beegoplus.com/api/client/order?page=${currentPage}&size=${pageSize}&status=${status}`;

        const data = await fetchAPI(apiUrl, authHeaders);
        console.log('API 返回数据:', data);

        if (data) {
            ordersData = data.map(formatOrderData);
            console.log('数据处理完成，订单数量:', ordersData.length);
            enhanceOrderList();
            // 订单管理页面不需要统计信息
            if (statsPanel) {
                statsPanel.style.display = 'none';
            }
        } else {
            console.error('未获取到数据或数据格式错误');
        }
    }

    // 获取包裹数据
    async function fetchPackages() {
        console.log('开始获取包裹数据...');

        const authHeaders = await getAuthHeaders();
        if (!authHeaders) {
            console.error('获取认证信息失败');
            return;
        }
        console.log('认证信息获取成功');

        // 从 URL 获取分页和状态信息
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = urlParams.get('page') || '1';
        const pageSize = urlParams.get('size') || '10';
        const status = urlParams.get('activeName') || '1';

        const apiUrl = `https://api-jiyun.beegoplus.com/api/client/package?page=${currentPage}&size=${pageSize}&keyword=&status=${status}`;

        const data = await fetchAPI(apiUrl, authHeaders);
        console.log('API 返回包裹数据:', data);

        if (data) {
            // 格式化数据
            packagesData = data.map(formatPackageData);
            console.log('数据处理完成，包裹数量:', packagesData.length);
            enhancePackageList();

            // 只在已入库页面显示统计信息
            if (status === '2') {
                // 初始时隐藏统计面板，等待复选框选中后再显示
                if (statsPanel) {
                    statsPanel.style.display = 'none';
                }

                // 监听复选框变化
                setupCheckboxListeners();
            } else {
                // 非已入库页面不显示统计信息
                if (statsPanel) {
                    statsPanel.style.display = 'none';
                }
            }

            // 添加排序按钮
            addSortButton();
        } else {
            console.error('未获取到包裹数据或数据格式错误');
        }
    }

    // 添加排序按钮
    function addSortButton() {
        // 移除已存在的排序按钮
        const existingSortBtn = document.querySelector('.sort-by-time-btn');
        if (existingSortBtn) {
            existingSortBtn.remove();
        }

        // 找到标签导航栏滚动容器
        const tabsNavScroll = document.querySelector('.el-tabs__nav-scroll');
        if (!tabsNavScroll) {
            console.error('未找到标签导航栏滚动容器');
            return;
        }

        // 保存原始数据顺序
        const originalPackagesData = [...packagesData];
        let isSorted = false;

        // 创建排序按钮
        const sortBtn = document.createElement('button');
        sortBtn.className = 'sort-by-time-btn';
        sortBtn.innerHTML = '修改时间倒序 ↓';
        sortBtn.style.cssText = `
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            padding: 4px 12px;
            background: #409eff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.3s;
            line-height: 20px;
            z-index: 1;
        `;

        // 添加点击事件
        sortBtn.addEventListener('click', () => {
            if (!isSorted) {
                // 按修改时间倒序排序
                packagesData.sort((a, b) => {
                    const timeA = new Date(a.updatedAt || 0);
                    const timeB = new Date(b.updatedAt || 0);
                    return timeB - timeA;
                });

                // 隐藏所有的 operate-icon
                document.querySelectorAll('.operate-icon').forEach(icon => {
                    icon.style.display = 'none';
                });

                // 更新按钮文字和样式
                sortBtn.innerHTML = '恢复默认排序 ↺';
                sortBtn.style.background = '#909399';
                isSorted = true;
            } else {
                // 恢复原始顺序
                packagesData = [...originalPackagesData];

                // 显示所有的 operate-icon
                document.querySelectorAll('.operate-icon').forEach(icon => {
                    icon.style.display = '';
                });

                // 恢复按钮文字和样式
                sortBtn.innerHTML = '修改时间倒序 ↓';
                sortBtn.style.background = '#409eff';
                isSorted = false;
            }

            // 重新渲染列表
            enhancePackageList();
        });

        // 直接将按钮添加到导航栏滚动容器中
        tabsNavScroll.appendChild(sortBtn);
    }

    // 创建视频播放模态框
    function createVideoModal() {
        let videoModal = document.querySelector('.video-modal');
        if (videoModal) {
            return videoModal;
        }

        videoModal = document.createElement('div');
        videoModal.className = 'video-modal';
        videoModal.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            justify-content: center;
            align-items: center;
        `;

        videoModal.innerHTML = `
            <div style="position: relative; max-width: 80%; max-height: 80%;">
                <button class="close-modal" style="
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                ">×</button>
                <video controls style="max-width: 100%; max-height: 80vh;"></video>
            </div>
        `;

        document.body.appendChild(videoModal);
        return videoModal;
    }

    // 创建刷新按钮
    function createRefreshButton() {
        let refreshBtn = document.querySelector('.refresh-enhanced-info');
        if (refreshBtn) {
            return refreshBtn;
        }

        refreshBtn = document.createElement('button');
        refreshBtn.className = 'refresh-enhanced-info';
        refreshBtn.innerHTML = '刷新增强信息';
        refreshBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            padding: 8px 16px;
            background: #409eff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            z-index: 9999;
        `;

        refreshBtn.addEventListener('click', async () => {
            refreshBtn.innerHTML = '刷新中...';
            refreshBtn.style.opacity = '0.7';
            refreshBtn.style.cursor = 'not-allowed';

            if (window.location.href.includes('order-management')) {
                await fetchOrders();
            } else if (window.location.href.includes('package-list')) {
                await fetchPackages();
            }

            refreshBtn.innerHTML = '刷新增强信息';
            refreshBtn.style.opacity = '1';
            refreshBtn.style.cursor = 'pointer';
        });

        document.body.appendChild(refreshBtn);
        return refreshBtn;
    }

    // 增强订单列表
    function enhanceOrderList() {
        console.log('开始增强订单列表...');

        // 创建刷新按钮
        createRefreshButton();
        console.log('刷新按钮创建完成');

        // 删除所有现有的增强信息
        const existingEnhanced = document.querySelectorAll('.order-item-container, .enhanced-order-list');
        existingEnhanced.forEach(element => element.remove());
        console.log('已删除原有信息或者现有增强信息');

        // 找到表头元素作为参考点
        const packageTabs = document.querySelector('.package-tabs');
        if (!packageTabs) {
            console.error('未找到表头元素');
            return;
        }
        console.log('找到表头元素');

        // 检查订单数据
        console.log('订单数据数量:', ordersData.length);
        if (ordersData.length === 0) {
            console.warn('没有订单数据可以显示');
            return;
        }

        // 创建订单列表容器
        const orderListContainer = document.createElement('div');
        orderListContainer.className = 'enhanced-order-list';
        console.log('创建订单列表容器完成');

        // 创建视频模态框
        const videoModal = createVideoModal();
        console.log('创建视频模态框完成');

        // 处理每个订单数据
        ordersData.forEach((orderInfo, index) => {
            console.log(`处理第 ${index + 1} 个订单数据`);
            const newContainer = document.createElement('div');
            newContainer.className = 'enhanced-info';

            // 从当前 URL 获取基础路径
            const currentPath = window.location.pathname;
            const basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            const detailUrl = `${basePath}/orderDetail/${orderInfo.orderId}?status=4`;

            newContainer.innerHTML = `
                <div style="background: rgb(241, 247, 254); border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                        <div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">
                                订单号
                                <button class="copy-order" style="
                                    padding: 2px 8px;
                                    background: #409eff;
                                    color: white;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    font-size: 12px;
                                ">复制</button>
                                <a href="${detailUrl}" target="_blank" style="
                                    padding: 2px 8px;
                                    background: #9254de;
                                    color: white;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    font-size: 12px;
                                    text-decoration: none;
                                    display: inline-block;
                                    margin-left: 4px;
                                ">详情</a>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="font-size: 14px; font-weight: 500;">${orderInfo.orderSn || '未知'}</div>
                            </div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">
                                物流单号
                                <button class="copy-tracking" style="
                                    padding: 2px 8px;
                                    background: #409eff;
                                    color: white;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    font-size: 12px;
                                ">复制</button>
                                <button class="track-order" style="
                                    padding: 2px 8px;
                                    background: #9254de;
                                    color: white;
                                    border: none;
                                    border-radius: 4px;
                                    cursor: pointer;
                                    font-size: 12px;
                                ">查询</button>
                            </div>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <div style="font-size: 14px; font-weight: 500;">${orderInfo.logisticsSn || '未知'}</div>
                            </div>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 12px;">
                        <div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">线路名称</div>
                            <div style="font-size: 14px; font-weight: 500;">${orderInfo.lineName || '未知'}</div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">承运商</div>
                            <div style="font-size: 14px; font-weight: 500;">${orderInfo.expressName} - ${orderInfo.expressCode}</div>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 12px;">
                        <div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">包裹尺寸</div>
                            <div style="font-size: 14px; font-weight: 500;">
                                ${orderInfo.length ? (orderInfo.length / 100).toFixed(1) : '0'} ×
                                ${orderInfo.width ? (orderInfo.width / 100).toFixed(1) : '0'} ×
                                ${orderInfo.height ? (orderInfo.height / 100).toFixed(1) : '0'} cm
                            </div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">包裹实重</div>
                            <div style="font-size: 14px; font-weight: 500;">${orderInfo.actualWeight ? (orderInfo.actualWeight / 1000).toFixed(3) : '0'} KG</div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">体积泡重</div>
                            <div style="font-size: 14px; font-weight: 500;">${orderInfo.volumeWeight ? (orderInfo.volumeWeight / 1000).toFixed(3) : '0'} KG</div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">计费重量</div>
                            <div style="font-size: 14px; font-weight: 500;">${orderInfo.paymentWeight ? (orderInfo.paymentWeight / 1000).toFixed(3) : '0'} KG</div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">原始运费(会员折后)</div>
                            <div style="font-size: 14px; font-weight: 500;">¥${orderInfo.freightFee ? (orderInfo.freightFee / 100).toFixed(2) : '0'}</div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">客服调整</div>
                            <div style="font-size: 14px; font-weight: 500;">¥${orderInfo.modFee ? (orderInfo.modFee / 100).toFixed(2) : '0'}</div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">应付运费</div>
                            <div style="font-size: 14px; font-weight: 500;">¥${orderInfo.actualPaymentFee ? (orderInfo.actualPaymentFee / 100).toFixed(2) : '0'}</div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">保险费用</div>
                            <div style="font-size: 14px; font-weight: 500;">¥${orderInfo.insuranceFee ? (orderInfo.insuranceFee / 100).toFixed(2) : '0'} (申报价值 ¥${(orderInfo.value / 100).toFixed(2)})</div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">积分抵扣</div>
                            <div style="font-size: 14px; font-weight: 500;">¥-${orderInfo.pointAmount ? (orderInfo.pointAmount / 100).toFixed(2) : '0'}</div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">优惠券抵扣</div>
                            <div style="font-size: 14px; font-weight: 500;">¥-${orderInfo.couponDiscountFee ? (orderInfo.couponDiscountFee / 100).toFixed(2) : '0'}</div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">最终总价</div>
                            <div style="font-size: 14px; font-weight: 500;">¥${orderInfo.discountPaymentFee ? (orderInfo.discountPaymentFee / 100).toFixed(2) : '0'}</div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">最终单价</div>
                            <div style="font-size: 14px; font-weight: 500;">¥${orderInfo.discountPaymentFee && orderInfo.paymentWeight ? ((orderInfo.discountPaymentFee / 100) / (orderInfo.paymentWeight / 1000)).toFixed(2) : '0'}/kg</div>
                        </div>
                        <div>
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">创建时间</div>
                            <div style="font-size: 14px; font-weight: 500;">${orderInfo.createdAt || '未知'}</div>
                        </div>
                        ${orderInfo.packedAt ? `
                            <div>
                                <div style="color: #666; font-size: 13px; margin-bottom: 8px;">打包时间</div>
                                <div style="font-size: 14px; font-weight: 500;">${orderInfo.packedAt}</div>
                            </div>
                        ` : ''}
                        ${orderInfo.paidAt ? `
                            <div>
                                <div style="color: #666; font-size: 13px; margin-bottom: 8px;">支付时间</div>
                                <div style="font-size: 14px; font-weight: 500;">${orderInfo.paidAt}</div>
                            </div>
                        ` : ''}
                        ${orderInfo.shippedAt ? `
                            <div>
                                <div style="color: #666; font-size: 13px; margin-bottom: 8px;">发货时间</div>
                                <div style="font-size: 14px; font-weight: 500;">${orderInfo.shippedAt}</div>
                            </div>
                        ` : ''}
                    </div>
                    ${orderInfo.remark ? `
                        <div style="margin-top: 12px;">
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">仓库备注</div>
                            <div style="font-size: 14px; font-weight: 500;">${orderInfo.remark}</div>
                        </div>
                    ` : ''}
                    ${orderInfo.remarkAgain ? `
                        <div style="margin-top: 12px;">
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">二次备注</div>
                            <div style="font-size: 14px; font-weight: 500;">${orderInfo.remarkAgain}</div>
                        </div>
                    ` : ''}
                    ${orderInfo.vipRemark ? `
                        <div style="margin-top: 12px;">
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">客户备注</div>
                            <div style="font-size: 14px; font-weight: 500;">${orderInfo.vipRemark}</div>
                        </div>
                    ` : ''}
                    ${orderInfo.videos?.length > 0 ? `
                        <div style="margin-top: 12px;">
                            <div style="color: #666; font-size: 13px; margin-bottom: 8px;">打包视频</div>
                            <div style="display: flex; gap: 4px;">
                                ${orderInfo.videos.map((video, index) => `
                                    <button class="play-video" data-url="${video.url}" style="
                                        padding: 2px 8px;
                                        background: #409eff;
                                        color: white;
                                        border: none;
                                        border-radius: 4px;
                                        cursor: pointer;
                                        font-size: 12px;
                                    ">播放视频${orderInfo.videos.length > 1 ? (index + 1) : ''}</button>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>`

            // 将订单项添加到容器中
            orderListContainer.appendChild(newContainer);
            console.log(`第 ${index + 1} 个订单数据处理完成`);

            // 绑定复制和查询按钮事件
            const copyOrderBtn = newContainer.querySelector('.copy-order');
            const copyTrackingBtn = newContainer.querySelector('.copy-tracking');
            const trackOrderBtn = newContainer.querySelector('.track-order');

            if (copyOrderBtn) {
                copyOrderBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigator.clipboard.writeText(orderInfo.orderSn)
                        .then(() => alert('已复制订单号'))
                        .catch(() => alert('复制失败'));
                });
            }

            if (copyTrackingBtn) {
                copyTrackingBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigator.clipboard.writeText(orderInfo.logisticsSn)
                        .then(() => alert('已复制物流单号'))
                        .catch(() => alert('复制失败'));
                });
            }

            if (trackOrderBtn) {
                trackOrderBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(`https://www.kuaidi100.com/chaxun?nu=${orderInfo.logisticsSn}`, '_blank');
                });
            }

            // 绑定视频播放事件
            const playButtons = newContainer.querySelectorAll('.play-video');

            playButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const videoUrl = button.dataset.url;
                    const videoModal = document.querySelector('.video-modal');
                    if (videoModal) {
                        const video = videoModal.querySelector('video');
                        if (video) {
                            video.src = videoUrl;
                            videoModal.style.display = 'flex';
                        }
                    }
                });
            });
        });

        // 绑定视频模态框事件
        const closeBtn = videoModal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                const video = videoModal.querySelector('video');
                if (video) {
                    video.pause();
                    video.src = '';
                }
                videoModal.style.display = 'none';
            });
        }

        // 点击模态框背景关闭
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                const video = videoModal.querySelector('video');
                if (video) {
                    video.pause();
                    video.src = '';
                }
                videoModal.style.display = 'none';
            }
        });

        // 将整个订单列表容器插入到表头元素后面
        packageTabs.parentNode.insertBefore(orderListContainer, packageTabs.nextSibling);
        // 删除加载遮罩元素
        const loadingMask = document.querySelector('.el-loading-mask');
        if (loadingMask) {
            loadingMask.remove();
        }
        // 删除没啥用的表格首行
        const orderTitle = document.querySelector('.order-title');
        if (orderTitle) {
            orderTitle.remove();
        }
        console.log('增强订单列表完成');
    }

    // 增强包裹列表
    function enhancePackageList() {
        console.log('开始增强包裹列表...');

        // 创建刷新按钮
        createRefreshButton();
        console.log('刷新按钮创建完成');

        // 删除所有现有的增强信息
        const existingEnhanced = document.querySelectorAll('.enhanced-package-info');
        existingEnhanced.forEach(element => element.remove());
        console.log('已删除原有增强信息');

        // 删除所有已添加的按钮
        const existingButtons = document.querySelectorAll('.copy-package, .track-package, .package-prop-tag');
        existingButtons.forEach(button => {
            const parent = button.parentElement;
            if (parent && (parent.classList.contains('copy-track-buttons') || parent.classList.contains('package-prop-container'))) {
                parent.remove();
            }
        });

        // 检查包裹数据
        console.log('包裹数据数量:', packagesData.length);
        if (packagesData.length === 0) {
            console.warn('没有包裹数据可以显示');
            return;
        }

        // 找到所有原始包裹项
        const originalPackageItems = document.querySelectorAll('.package-item-container');
        if (!originalPackageItems || originalPackageItems.length === 0) {
            console.error('未找到原始包裹项');
            return;
        }
        console.log(`找到 ${originalPackageItems.length} 个原始包裹项`);

        // 找到包裹列表容器
        const packageContainer = originalPackageItems[0]?.parentElement;
        if (!packageContainer) {
            console.error('未找到包裹容器');
            return;
        }

        // 根据排序后的数据重新排序DOM元素
        packagesData.forEach((packageInfo) => {
            // 找到对应的DOM元素
            const matchingItem = Array.from(originalPackageItems).find(item => {
                const expressNumDiv = item.querySelector('div.warehouse > div:nth-child(2)');
                return expressNumDiv && expressNumDiv.textContent.includes(packageInfo.packageSn);
            });

            if (matchingItem) {
                // 将包裹项移动到正确的位置
                packageContainer.appendChild(matchingItem);
            }
        });

        // 重新获取排序后的包裹项
        const sortedPackageItems = document.querySelectorAll('.package-item-container');

        // 调整所有包裹详情区域的上下内边距
        sortedPackageItems.forEach(item => {
            const packageDetails = item.querySelector('.package-details');
            if (packageDetails) {
                packageDetails.style.padding = '20px 20px';
            }
        });

        // 为每个包裹项添加增强信息
        sortedPackageItems.forEach((item, index) => {
            if (index >= packagesData.length) {
                console.warn(`包裹项索引 ${index} 超出数据范围`);
                return;
            }

            const packageInfo = packagesData[index];
            console.log(`处理第 ${index + 1} 个包裹数据:`, packageInfo);

            // 找到仓库信息元素 - 第一个子元素包含仓库名称
            const warehouseDiv = item.querySelector('div.warehouse > div:first-child');
            if (warehouseDiv && packageInfo.props && packageInfo.props.length > 0) {
                // 添加包裹属性标签
                const propContainer = document.createElement('span');
                propContainer.className = 'package-prop-container';
                propContainer.style.cssText = `
                    display: inline-flex;
                    gap: 5px;
                    margin-right: 10px;
                    vertical-align: middle;
                `;

                // 为每个属性创建标签
                packageInfo.props.forEach(prop => {
                    const propTag = document.createElement('span');
                    propTag.className = 'package-prop-tag';
                    propTag.textContent = prop.name || prop.cn_name;
                    propTag.style.cssText = `
                        padding: 1px 6px;
                        background: ${(prop.name === '普货' || prop.cn_name === '普货') ? '#67c23a' : '#f56c6c'};
                        color: white;
                        border: none;
                        border-radius: 4px;
                        font-size: 12px;
                        display: inline-block;
                    `;
                    propContainer.appendChild(propTag);
                });

                // 将属性标签插入到仓库名称前面
                warehouseDiv.insertBefore(propContainer, warehouseDiv.firstChild);
            }

            // 找到快递单号元素 - 精确定位包含"快递单号："文本的div
            const expressNumDiv = item.querySelector('div.warehouse > div:nth-child(2)');
            if (expressNumDiv && expressNumDiv.textContent.includes('快递单号：')) {
                // 先移除已存在的按钮，避免重复
                const existingButtons = expressNumDiv.querySelector('.copy-track-buttons');
                if (existingButtons) {
                    existingButtons.remove();
                }

                // 添加复制和查询按钮
                const buttonContainer = document.createElement('span');
                buttonContainer.className = 'copy-track-buttons';
                buttonContainer.style.cssText = `
                    display: inline-flex;
                    gap: 5px;
                    margin-left: 10px;
                    vertical-align: middle;
                `;

                buttonContainer.innerHTML = `
                    <button class="copy-package" style="
                        padding: 1px 6px;
                        background: #409eff;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">复制</button>
                    ${packageInfo.packageSn ? `
                    <button class="track-package" style="
                        padding: 1px 6px;
                        background: #9254de;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">查询</button>
                    ` : ''}
                `;

                expressNumDiv.appendChild(buttonContainer);

                // 绑定复制包裹号按钮事件
                const copyPackageBtn = buttonContainer.querySelector('.copy-package');
                if (copyPackageBtn) {
                    copyPackageBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigator.clipboard.writeText(packageInfo.packageSn)
                            .then(() => alert('已复制快递单号'))
                            .catch(() => alert('复制失败'));
                    });
                }

                // 绑定查询物流按钮事件
                const trackPackageBtn = buttonContainer.querySelector('.track-package');
                if (trackPackageBtn) {
                    trackPackageBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(`https://www.kuaidi100.com/chaxun?nu=${packageInfo.packageSn}`, '_blank');
                    });
                }
            } else {
                // 如果没有找到快递单号元素，尝试其他选择器
                const allDivs = item.querySelectorAll('div.warehouse > div');
                for (const div of allDivs) {
                    if (div.textContent && div.textContent.includes('快递单号：')) {
                        // 先移除已存在的按钮，避免重复
                        const existingButtons = div.querySelector('.copy-track-buttons');
                        if (existingButtons) {
                            existingButtons.remove();
                        }

                        // 添加复制和查询按钮
                        const buttonContainer = document.createElement('span');
                        buttonContainer.className = 'copy-track-buttons';
                        buttonContainer.style.cssText = `
                            display: inline-flex;
                            gap: 5px;
                            margin-left: 10px;
                            vertical-align: middle;
                        `;

                        buttonContainer.innerHTML = `
                            <button class="copy-package" style="
                                padding: 1px 6px;
                                background: #409eff;
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                            ">复制</button>
                            ${packageInfo.packageSn ? `
                            <button class="track-package" style="
                                padding: 1px 6px;
                                background: #9254de;
                                color: white;
                                border: none;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                            ">查询</button>
                            ` : ''}
                        `;

                        div.appendChild(buttonContainer);

                        // 绑定复制包裹号按钮事件
                        const copyPackageBtn = buttonContainer.querySelector('.copy-package');
                        if (copyPackageBtn) {
                            copyPackageBtn.addEventListener('click', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigator.clipboard.writeText(packageInfo.packageSn)
                                    .then(() => alert('已复制快递单号'))
                                    .catch(() => alert('复制失败'));
                            });
                        }

                        // 绑定查询物流按钮事件
                        const trackPackageBtn = buttonContainer.querySelector('.track-package');
                        if (trackPackageBtn) {
                            trackPackageBtn.addEventListener('click', (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(`https://www.kuaidi100.com/chaxun?nu=${packageInfo.packageSn}`, '_blank');
                            });
                        }

                        break;
                    }
                }
            }

            // 找到包裹详情区域
            const packageDetails = item.querySelector('.package-details');
            if (!packageDetails) {
                console.warn('未找到包裹详情区域');
                return;
            }

            // 找到包裹状态区域（最后一个子元素，通常包含复选框）
            const packageStatus = packageDetails.querySelector('.package-status');

            // 清空包裹详情区域中除了包裹状态之外的所有内容
            while (packageDetails.firstChild) {
                if (packageDetails.firstChild === packageStatus) {
                    break;
                }
                packageDetails.removeChild(packageDetails.firstChild);
            }

            // 创建适应网格布局的内容（不包含快递单号）
            const column = document.createElement('div');
            column.className = 'package-detail-column';
            column.style.cssText = `
                grid-column: 1 / 7;
                display: grid;
                grid-template-columns: 1.2fr 1.2fr 1fr 1fr;
                gap: 15px;
                justify-content: start;
                padding: 0 10px;
                max-width: 100%;
                width: 100%;
            `;

            column.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div>
                        <div style="color: #666; margin-bottom: 4px;">包裹名称</div>
                        <div style="font-weight: 500;">${packageInfo.packageName || '未知'}</div>
                    </div>
                    ${packageInfo.packageWeight && packageInfo.packageWeight > 0 ? `
                    <div>
                        <div style="color: #666; margin-bottom: 4px;">包裹重量</div>
                        <div style="font-weight: 500;">${(packageInfo.packageWeight / 1000).toFixed(3)} KG</div>
                    </div>
                    ` : ''}
                    ${packageInfo.packageValue ? `
                    <div>
                        <div style="color: #666; margin-bottom: 4px;">申报价值</div>
                        <div style="font-weight: 500;">¥${(packageInfo.packageValue / 100).toFixed(2)}</div>
                    </div>
                    ` : ''}
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div>
                        <div style="color: #666; margin-bottom: 4px;">添加时间</div>
                        <div style="font-weight: 500; word-break: keep-all; white-space: nowrap;">${packageInfo.createdAt ? packageInfo.createdAt : '未知'}</div>
                    </div>
                    ${packageInfo.inStorageAt ? `
                    <div>
                        <div style="color: #666; margin-bottom: 4px;">入库时间</div>
                        <div style="font-weight: 500; word-break: keep-all; white-space: nowrap;">${packageInfo.inStorageAt}</div>
                    </div>
                    ` : ''}

                    <div>
                        <div style="color: #666; margin-bottom: 4px;">修改时间</div>
                        <div style="font-weight: 500; word-break: keep-all; white-space: nowrap;">${packageInfo.updatedAt}</div>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${packageInfo.remark ? `
                    <div>
                        <div style="color: #666; margin-bottom: 4px;">包裹备注</div>
                        <div style="font-weight: 500;">${packageInfo.remark}</div>
                    </div>
                    ` : ''}
                    ${packageInfo.inStorageRemark ? `
                    <div>
                        <div style="color: #666; font-size: 13px; margin-bottom: 4px;">入库备注</div>
                        <div style="font-size: 14px; font-weight: 500;">${packageInfo.inStorageRemark}</div>
                    </div>
                    ` : ''}
                </div>

                <div style="display: flex; flex-direction: column; gap: 10px; margin-left: 15px;">
                    ${packageInfo.packagePictures && packageInfo.packagePictures.length > 0 ? `
                        <div style="display: flex; flex-direction: column;">
                            <div style="color: #666; font-size: 13px; margin-bottom: 4px;">入库照片</div>
                            <div style="display: flex; align-items: center;">
                                ${packageInfo.packagePictures.map(pic => `
                                    <a href="${pic}" target="_blank" style="display: inline-block;">
                                        <img src="${pic}" style="
                                            width: 24px;
                                            height: 24px;
                                            object-fit: cover;
                                            border-radius: 4px;
                                            vertical-align: middle;
                                        " />
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;

            // 将内容插入到包裹详情区域
            packageDetails.insertBefore(column, packageStatus);

            // 找到仓库信息区域
            const warehouseSection = item.querySelector('div.warehouse');
            if (warehouseSection && packageInfo.location) {
                // 首先删除所有已存在的入库位置元素
                const existingLocationSpans = warehouseSection.querySelectorAll('div');
                existingLocationSpans.forEach(span => {
                    if (span.textContent && span.textContent.includes('入库位置:')) {
                        span.remove();
                    }
                });

                // 创建入库位置元素
                const locationSpan = document.createElement('div');
                locationSpan.style.cssText = `
                    margin: 5px 0;
                    color: #666;
                    text-align: center;
                `;
                locationSpan.textContent = `入库位置: ${packageInfo.location}`;

                // 获取第一个和第二个div元素
                const firstDiv = warehouseSection.querySelector('div:first-child');
                const secondDiv = warehouseSection.querySelector('div:nth-child(2)');

                // 在第一个div和第二个div之间插入位置信息
                if (firstDiv && secondDiv) {
                    warehouseSection.insertBefore(locationSpan, secondDiv);
                }
            }
        });

        // 删除加载遮罩元素
        const loadingMask = document.querySelector('.el-loading-mask');
        if (loadingMask) {
            loadingMask.remove();
        }

        // 删除包裹信息表头
        const packageInfo = document.querySelector('div.package-info');
        if (packageInfo) {
            packageInfo.remove();
            console.log('已删除包裹信息表头');
        }

        console.log('增强包裹列表完成');
    }

    // 设置复选框变化监听
    function setupCheckboxListeners() {
        console.log('开始设置复选框监听器');

        // 等待DOM加载完成
        setTimeout(() => {
            // 使用 ElementUI 的复选框选择器
            const checkboxes = document.querySelectorAll('.el-checkbox');

            if (checkboxes.length > 0) {
                console.log('找到复选框，数量:', checkboxes.length);

                // 使用 MutationObserver 监听复选框的 class 变化
                const observer = new MutationObserver((mutations) => {
                    console.log('检测到复选框状态变化');
                    let needsUpdate = false;

                    mutations.forEach(mutation => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            console.log('复选框 class 属性变化');
                            needsUpdate = true;
                        }
                    });

                    if (needsUpdate) {
                        console.log('需要更新统计信息');
                        updatePackageStats();
                    }
                });

                // 为每个复选框添加观察器
                checkboxes.forEach(checkbox => {
                    observer.observe(checkbox, {
                        attributes: true,
                        attributeFilter: ['class']
                    });
                    console.log('已为复选框添加观察器');
                });

                // 初始检查是否有已选中的复选框
                updatePackageStats();

                // 监听页面上新添加的复选框
                const domObserver = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                            mutation.addedNodes.forEach(node => {
                                if (node.nodeType === 1) { // 元素节点
                                    const newCheckboxes = node.querySelectorAll('.el-checkbox');
                                    if (newCheckboxes.length > 0) {
                                        console.log('发现新添加的复选框，数量:', newCheckboxes.length);
                                        newCheckboxes.forEach(checkbox => {
                                            observer.observe(checkbox, {
                                                attributes: true,
                                                attributeFilter: ['class']
                                            });
                                        });
                                        updatePackageStats();
                                    }
                                }
                            });
                        }
                    });
                });

                domObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });

                console.log('已设置 DOM 变化观察器');

                // 添加点击事件监听，因为有时 class 变化可能不会触发 MutationObserver
                document.addEventListener('click', (event) => {
                    const checkbox = event.target.closest('.el-checkbox');
                    if (checkbox) {
                        console.log('检测到复选框点击事件');
                        setTimeout(() => {
                            updatePackageStats();
                        }, 50);
                    }
                });

                console.log('已添加点击事件监听');
            } else {
                console.warn('未找到复选框元素');
            }
        }, 1000); // 给页面足够的时间加载复选框
    }

    // 增强订单详情页面
    async function enhanceOrderDetail() {
        console.log('开始增强订单详情页面...');

        // 从URL中提取订单ID
        const orderId = window.location.pathname.split('/').pop();
        if (!orderId) {
            console.error('无法从URL中获取订单ID');
            return;
        }

        // 获取认证信息
        const authHeaders = await getAuthHeaders();
        if (!authHeaders) {
            console.error('获取认证信息失败');
            return;
        }

        // 获取订单详情
        const apiUrl = `https://api-jiyun.beegoplus.com/api/client/order/${orderId}`;
        const response = await fetch(apiUrl, {
            headers: authHeaders
        });

        if (!response.ok) {
            console.error('获取订单详情失败:', response.status);
            return;
        }

        const data = await response.json();
        if (!data.data || !data.data.packages) {
            console.error('订单详情数据格式不正确');
            return;
        }

        // 找到包裹单号的表单项
        const formItems = document.querySelectorAll('.el-form-item');
        let targetFormItem = null;
        for (const item of formItems) {
            const label = item.querySelector('.el-form-item__label');
            if (label && label.textContent.includes('包裹单号')) {
                targetFormItem = item;
                break;
            }
        }

        if (!targetFormItem) {
            console.error('未找到包裹单号表单项');
            return;
        }

        // 创建包裹列表容器
        const listContainer = document.createElement('div');
        listContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 16px;
            width: 100%;
            padding: 10px;
            margin-top: 10px;
        `;

        // 为每个包裹创建卡片
        data.data.packages.forEach((packageInfo, index) => {
            // 使用 formatPackageData 函数格式化包裹数据
            const formattedPackage = formatPackageData(packageInfo);

            const packageCard = document.createElement('div');
            packageCard.style.cssText = `
                background: rgb(241, 247, 254);
                border-radius: 8px;
                padding: 4px;
            `;

            // 创建包裹内容
            packageCard.innerHTML = `
                <div style="display: flex; align-items: flex-start; padding: 12px 16px;">
                    <div style="display: flex; flex-direction: column; min-width: 200px; max-width: 400px; flex: 1;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <div style="display: flex; gap: 5px; flex-wrap: wrap; align-items: center;">
                                ${formattedPackage.props ? formattedPackage.props.map(p => `
                                    <span style="
                                        padding: 0 8px;
                                        background: ${(p.name === '普货' || p.cn_name === '普货') ? '#67c23a' : '#f56c6c'};
                                        color: white;
                                        border-radius: 4px;
                                        font-size: 12px;
                                        line-height: 20px;
                                    ">${p.cn_name}</span>
                                `).join('') : ''}
                            </div>
                            <div style="font-size: 14px; font-weight: 600;">${formattedPackage.packageSn || '未知'}</div>
                        </div>
                        <div style="font-size: 14px; font-weight: 600; margin-left: 0px; word-wrap: break-word;">${formattedPackage.packageName || '未知'}</div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 20px; margin-left: 20px; margin-right: 10px; flex-shrink: 0;">
                        <div style="display: flex; flex-direction: column;">
                            <span style="color: #666; font-size: 13px; margin-bottom: 4px;">入库重量</span>
                            <span style="font-size: 14px; font-weight: 600;">${formattedPackage.packageWeight ? (formattedPackage.packageWeight / 1000).toFixed(3) + ' KG' : '未知'}</span>
                        </div>

                        <div style="display: flex; flex-direction: column;">
                            <span style="color: #666; font-size: 13px; margin-bottom: 4px;">申报价值</span>
                            <span style="font-size: 14px; font-weight: 600;">¥${formattedPackage.packageValue ? (formattedPackage.packageValue / 100).toFixed(2) : '未知'}</span>
                        </div>

                        ${formattedPackage.packagePictures && formattedPackage.packagePictures.length > 0 ? `
                            <div style="display: flex; flex-direction: column;">
                                <div style="color: #666; font-size: 13px; margin-bottom: 4px;">入库照片</div>
                                <div style="display: flex; align-items: center;">
                                    ${formattedPackage.packagePictures.map(pic => `
                                        <a href="${pic}" target="_blank" style="display: inline-block;">
                                            <img src="${pic}" style="
                                                width: 24px;
                                                height: 24px;
                                                object-fit: cover;
                                                border-radius: 4px;
                                                vertical-align: middle;
                                            " />
                                        </a>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>

                ${(formattedPackage.remark || formattedPackage.inStorageRemark) ? `
                    <div style="padding: 12px 16px; background: rgba(0, 0, 0, 0.02); border-top: 1px solid rgba(0, 0, 0, 0.06);">
                        ${formattedPackage.remark ? `
                            <div style="margin-bottom: ${formattedPackage.inStorageRemark ? '8px' : '0'}">
                                <span style="
                                    padding: 0 8px;
                                    background: #e6a23c;
                                    color: white;
                                    border-radius: 4px;
                                    font-size: 12px;
                                    line-height: 20px;
                                ">备注</span>
                                <span style="font-size: 14px; font-weight: 600;">${formattedPackage.remark}</span>
                            </div>
                        ` : ''}
                        ${formattedPackage.inStorageRemark ? `
                            <div>
                                <span style="
                                    padding: 0 8px;
                                    background: #e6a23c;
                                    color: white;
                                    border-radius: 4px;
                                    font-size: 12px;
                                    line-height: 20px;
                                ">入库备注</span>
                                <span style="font-size: 14px; font-weight: 600;">${formattedPackage.inStorageRemark}</span>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
            `;

            // 添加到列表容器
            listContainer.appendChild(packageCard);
        });

        // 将列表容器添加到包裹单号表单项的内容区域后面
        const content = targetFormItem.querySelector('.el-form-item__content');
        // 清空内容区域
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }
        content.appendChild(listContainer);

        console.log('订单详情页面增强完成');
    }

    // 初始化
    window.addEventListener('load', () => {
        console.log('页面加载完成，开始初始化...');
        setupPageChangeListener();
    });
})();
