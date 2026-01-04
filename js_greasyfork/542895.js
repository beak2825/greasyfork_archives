// ==UserScript==
// @name         同步数据插件
// @namespace    http://sync-data-plugins.com/
// @version      0.8
// @description  支持美团、携程、飞猪、去哪、同城订单数据同步
// @match        *://me.meituan.com/*
// @match        *://seariver.meituan.com/*
// @match        *://hotel.fliggy.com/*
// @match        *://www.vipdlt.com/*
// @match        *://ebooking.elong.com/*
// @match        *://sfbfxg.zcfgoagain.qunar.com/*
// @connect      hotel.bingtrip.cn
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542895/%E5%90%8C%E6%AD%A5%E6%95%B0%E6%8D%AE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/542895/%E5%90%8C%E6%AD%A5%E6%95%B0%E6%8D%AE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    debugger;
    let send_task_host_url = "https://hotel.bingtrip.cn:34561"  // 正式环境， 需要同步更新 // @connect      hotel.bingtrip.cn
    // let send_task_host_url = "http://hoteluat.bingtrip.cn:34561"  // uat环境  // @connect      hoteluat.bingtrip.cn

    // 存储原始XMLHttpRequest构造函数
    const originalXHR = unsafeWindow.XMLHttpRequest;
    // 重写XMLHttpRequest以拦截请求
    unsafeWindow.XMLHttpRequest = function () {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;

        // 重写open方法记录URL
        xhr.open = function (method, url, async, user, password) {
            // debugger;
            // 美团订单详情API
            if (url.includes('api/agent/v1/oversea/order/apt') && url.includes('detail')) {
                this.mt_url = url;
            }
            // 携程订单列表API
            if (url.includes('api/scrollOrderList')) {
                this.ctrip_url = url;
            }
            // 飞猪订单详情API
            if (url.includes('h5api.m.fliggy.com/h5/mtop.taobao.hotel.ebooking.order.detail')) {
                // debugger;
                this.feizhu_url = url;
            }
            // 去哪订单 '/confirm/api/detail/queryOrderDetail?id=494157165223&_time=1753700586961'
            if (url.includes('confirm/api/detail/queryOrderDetail')) {
                // debugger;
                this.quna_url = url;
            }
            // 同城
            // https://ebooking.elong.com/ebkorder/searchOrder/getTodayCheckInOrders 列表
            // https://ebooking.elong.com/ebkorder/searchOrder/getSearchOrderDetail 详情
            if (url.includes('searchOrder/getTodayCheckInOrders') || url.includes('ebkorder/searchOrder/getSearchOrders')) {
                // debugger;
                this.elong_url = url;
            }
            if (url.includes('searchOrder/getSearchOrderDetail')) {
                // debugger;
                this.elong_Detail_url = url;
            }
            originalOpen.apply(xhr, arguments);
        };

        // 重写send方法处理响应
        xhr.send = function (body) {
            xhr.onload = function () {
                // 美团响应
                if (this.mt_url && xhr.responseText.includes('goodsName') &&
                    xhr.responseText.includes('checkInDateModels') && !xhr.responseText.includes('webpackJsonp')) {
                    localStorage.setItem('meituanApiResponse', xhr.responseText);
                    meituanCheckAndAddButton();
                }
                // 携程响应
                if (this.ctrip_url && xhr.status === 200 &&
                    xhr.responseText.includes('infoBos') && xhr.responseText.includes('channelOrderId') &&
                    !xhr.responseText.includes('webpackJsonp')) {
                    try {
                        const existingResponse = JSON.parse(localStorage.getItem('Vipdlt_ApiResponse') || '{"data":{"infoBos":[]}}');
                        const newResponse = JSON.parse(xhr.responseText);

                        const existingIds = new Set(existingResponse.data.infoBos.map(item => item.channelOrderId));
                        const uniqueItems = newResponse.data.infoBos.filter(item => !existingIds.has(item.channelOrderId));

                        existingResponse.data.infoBos = existingResponse.data.infoBos.concat(uniqueItems);
                        localStorage.setItem('Vipdlt_ApiResponse', JSON.stringify(existingResponse));
                    } catch (e) {
                        console.error('携程响应处理错误:', e);
                    }
                }
                // 飞猪
                if (this.feizhu_url && xhr.responseText.includes('encryptSellerId')) {
                    // debugger;
                    try {
                        localStorage.setItem('feizhuApiResponse', xhr.responseText);
                        feizhuCheckAndAddButton()
                    } catch (e) {
                        console.log('飞猪响应处理错误:', e);
                    }
                }
                // 去哪
                // if (this.quna_url && xhr.responseText.includes('productName')) {
                //     debugger;
                //     try {
                //         localStorage.setItem('feizhuApiResponse', xhr.responseText);
                //         feizhuCheckAndAddButton()
                //     } catch (e) {
                //         console.log('飞猪响应处理错误:', e);
                //     }
                // }
                // elong
                if (this.elong_url && xhr.responseText.includes('infomations') && xhr.responseText.includes('cardNo')) {
                    // debugger;
                    try {
                        localStorage.setItem('elongListApiResponse', xhr.responseText);
                        // feizhuCheckAndAddButton()
                    } catch (e) {
                        console.log('同城响应处理错误:', e);
                    }
                }
                // elong_Detail_url
                if (this.elong_Detail_url && xhr.responseText.includes('orderDetail') && xhr.responseText.includes('hotelName')) {
                    // debugger;
                    try {
                        let select_info;
                        let list_info = JSON.parse(localStorage.getItem('elongListApiResponse') || '{}');
                        for (let i=0; i<list_info.infomations.length; i++) {
                            var infomation = list_info.infomations[i];
                            if (infomation.orderId === JSON.parse(xhr.responseText).orderDetail.orderId) {
                                select_info = infomation;
                                break;
                            }
                        }
                        // 把select_info dict 更新到xhr.responseText
                        let detail_info = JSON.parse(xhr.responseText);
                        detail_info.orderDetail.createDate = select_info.notifyTime;
                        localStorage.setItem('elongDetailApiResponse', JSON.stringify(detail_info));
                        elongCheckAndButtons()
                    } catch (e) {
                        console.log('同城详情响应处理错误:', e);
                    }
                }
            };
            originalSend.apply(xhr, arguments);
        };

        return xhr;
    };
    // 去哪儿
    const quna_open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        if (url.includes('confirm/api/detail/queryOrderDetail')) {
            // 监听响应数据
            const originalOnReadyStateChange = this.onreadystatechange;
            this.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    console.log('Intercepted Response:', this.responseText);
                    localStorage.setItem('qunaApiResponse', this.responseText);
                    qunaCheckAndButtons()
                }
                // 确保调用原始的 onreadystatechange 处理
                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                }
            };
        }
        return quna_open.apply(this, arguments);
    };


    // 美团按钮添加逻辑
    const meituanCheckAndAddButton = () => {
        const footers = document.getElementsByClassName("dialog-footer");
        if (footers.length > 0) {
            const span = footers[0];
            if (!span.querySelector('.meituan-sync-btn')) { // 避免重复添加
                const newButton = document.createElement("button");
                newButton.className = 'meituan-sync-btn';
                newButton.textContent = "导入美团订单";
                // 美团按钮样式
                newButton.style.textSizeAdjust = '100%';
                newButton.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
                newButton.style.webkitFontSmoothing = 'antialiased';
                newButton.style.boxSizing = 'border-box';
                newButton.style.font = 'inherit';
                newButton.style.margin = '0';
                newButton.style.fontSize = '12px';
                newButton.style.fontFamily = 'inherit';
                newButton.style.overflow = 'visible';
                newButton.style.webkitAppearance = 'button';
                newButton.style.textTransform = 'none';
                newButton.style.display = 'inline-block';
                newButton.style.marginBottom = '0';
                newButton.style.fontWeight = '400';
                newButton.style.textAlign = 'center';
                newButton.style.verticalAlign = 'middle';
                newButton.style.touchAction = 'manipulation';
                newButton.style.cursor = 'pointer';
                newButton.style.backgroundImage = 'none';
                newButton.style.whiteSpace = 'nowrap';
                newButton.style.padding = '7px 10px';
                newButton.style.lineHeight = '1.42857143';
                newButton.style.borderRadius = '2px';
                newButton.style.minWidth = '50px';
                newButton.style.userSelect = 'none';
                newButton.style.color = '#fff';
                newButton.style.backgroundColor = '#3dc6b6';
                newButton.style.border = '1px solid #3dc6b6';
                newButton.style.marginRight = '5px';

                newButton.addEventListener('click', () => {
                    const apiResponse = JSON.parse(localStorage.getItem('meituanApiResponse') || '{}');
                    if (apiResponse.data) {
                        showAutoDismissAlert("订单导入完成", 1000, true);
                        const targetButton = document.querySelector('button[data-v-45d2b34a].btn.btn-primary');
                        if (targetButton) targetButton.click();
                    } else {
                        console.log('未找到美团订单数据');
                        // alert('未找到美团订单数据, 联系技术确认！')
                    }
                });
                span.insertBefore(newButton, span.firstChild);
            }
        } else {
            setTimeout(meituanCheckAndAddButton, 3000);
        }
    };

    // 飞猪按钮添加逻辑
    const feizhuCheckAndAddButton = () => {
        // document.getElementsByClassName("footer___1J8wE")[0].getElementsByClassName("ant-space-item")
        const footers = document.getElementsByClassName("footer___1J8wE")[0].getElementsByClassName("ant-space-item");
        if (footers.length > 0) {
            const div = footers[0];
            if (!div.querySelector('.feizhu-sync-btn')) {
                const newButton = document.createElement("button");
                newButton.className = 'feizhu-sync-btn';
                newButton.textContent = "导入飞猪订单";
                // 飞猪按钮样式
                // 设置按钮样式
                newButton.style.webkitTextSizeAdjust = '100%';
                newButton.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
                newButton.style.setProperty('--antd-wave-shadow-color', '#5050e6');
                newButton.style.setProperty('--scroll-bar', '0');
                newButton.style.setProperty('--padding', '16px');
                newButton.style.setProperty('--font-size-big', '16px');
                newButton.style.setProperty('--font-size-normal', '14px');
                newButton.style.webkitFontSmoothing = 'antialiased';
                newButton.style.margin = '0';
                newButton.style.fontFamily = 'inherit';
                newButton.style.overflow = 'visible';
                newButton.style.textTransform = 'none';
                newButton.style.boxSizing = 'border-box';
                newButton.style.lineHeight = '1.5715';
                newButton.style.position = 'relative';
                newButton.style.display = 'inline-block';
                newButton.style.fontWeight = '400';
                newButton.style.whiteSpace = 'nowrap';
                newButton.style.textAlign = 'center';
                newButton.style.cursor = 'pointer';
                newButton.style.transition = 'all .3s cubic-bezier(.645,.045,.355,1)';
                newButton.style.userSelect = 'none';
                newButton.style.touchAction = 'manipulation';
                newButton.style.height = '32px';
                newButton.style.padding = '4px 15px';
                newButton.style.fontSize = '14px';
                newButton.style.borderRadius = '2px';
                newButton.style.border = '1px solid #d9d9d9';
                newButton.style.outline = '0';
                newButton.style.color = '#fff';
                newButton.style.borderColor = '#5050e6';
                newButton.style.background = '#5050e6';
                newButton.style.textShadow = '0 -1px 0 rgba(0,0,0,.12)';
                newButton.style.boxShadow = '0 2px 0 rgba(0,0,0,.045)';
                newButton.style.webkitAppearance = 'button';
                // newButton.style.marginRight = '20px';
                newButton.style.marginLeft = "10px"

                // 新增一个div显示 "正在导入..."
                const loadingMessage = document.createElement('div');
                loadingMessage.style.position = 'fixed';
                loadingMessage.style.top = '50%';
                loadingMessage.style.left = '50%';
                loadingMessage.style.transform = 'translate(-50%, -50%)';
                loadingMessage.style.fontSize = '18px';
                loadingMessage.style.fontWeight = 'bold';
                loadingMessage.style.color = '#4CAF50';
                loadingMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                loadingMessage.style.padding = '20px 30px';
                loadingMessage.style.borderRadius = '10px';
                loadingMessage.style.color = '#fff';
                loadingMessage.style.zIndex = '9999';
                loadingMessage.style.display = 'none';  // 默认隐藏

                document.body.appendChild(loadingMessage); // 把loadingMessage添加到body中

                newButton.addEventListener('click', () => {
                    const apiResponse = JSON.parse(localStorage.getItem('feizhuApiResponse') || '{}');
                    if (apiResponse.data) {
                        // debugger;
                        loadingMessage.textContent = '正在导入...';
                        loadingMessage.style.display = 'block';
                        let orderData = JSON.stringify(apiResponse, null, 2);
                        syncFeizhuSendTask(orderData, loadingMessage)
                        // showAutoDismissAlert("订单导入完成", 1000, true);
                    } else {
                        console.log('未找到飞猪订单数据');
                        // alert('未找到飞猪订单数据, 联系技术确认！')
                    }
                });
                div.appendChild(newButton);

            }
        }
    }

    // 飞猪导入订单
    const syncFeizhuSendTask = (orderData, loadingMessage) => {
        let originalUrl = send_task_host_url + "/hotel-api/inter/order/FZ_BT_EBK/createFeizhuOrder"; // 飞猪请求 URL
        // 使用代理发送请求
        GM_xmlhttpRequest({
            method: 'POST',
            url: originalUrl,  // 使用飞猪的接口 URL
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
                "Origin": "https://hotel.bingtrip.cn:34561",
                "Referer": "https://hotel.bingtrip.cn:34561/",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
            },
            data: orderData,  // 发送的数据
            onload: function (response) {
                if (response.status === 200) {
                    let respons_body = JSON.parse(response.responseText);
                    if (respons_body.code === 200) {
                        loadingMessage.textContent = '订单导入完成！';
                    } else if (respons_body.code === 266) {
                        loadingMessage.textContent = '该订单已导入！';
                    } else {
                        loadingMessage.textContent = '订单导入失败！';
                    }
                }
                if (response.status === 401) {
                    loadingMessage.textContent = '请先登录后台！！';
                }
                // 延迟 1s
                setTimeout(() => {
                    loadingMessage.style.display = 'none'; // 隐藏正在导入提示
                    // syncBtn.disabled = false;  // 重新启用按钮
                }, 1000);
            },
            onerror: function (error) {
                console.error('请求错误:', error);
                showAutoDismissAlert("订单导入失败！", 1000, true);
                loadingMessage.style.display = 'none';
                // syncBtn.disabled = false;  // 重新启用按钮
            }
        });
    };

    // 去哪按钮
    const qunaCheckAndButtons = () => {
        debugger;
        const tabSetUl = document.getElementsByClassName("ui-tab-set")[0].querySelectorAll('li');
        if (tabSetUl.length < 2) {
            setTimeout(qunaCheckAndButtons, 500); // 3秒后执行 qunaCheckAndButton
            return
        }
        const tabSet = document.getElementsByClassName("ui-tab-set")[0];
        if (tabSet) {
            // 关键：检查是否已存在目标li（通过按钮类名判断）
            const existingLi = tabSet.querySelector('li:has(.quna-sync-btn)');
            if (existingLi) {
                console.log('已存在相同的li元素，无需重复添加');
                return; // 已存在则直接退出
            }
            // 获取所有li元素
            const allLis = tabSet.querySelectorAll('li');
            // 获取需要的值（请替换为实际行选择器）
            const row = document.querySelector('适当的行选择器');
            const valuesText = row ? row.querySelector('td:first-child a').textContent : '';
            // 创建新的li元素
            const newLi = document.createElement('li');
            newLi.classList.add('ui-tab-item'); // 保持样式一致
            // 创建按钮
            const newButton = document.createElement('button');
            newButton.classList.add('quna-sync-btn', 'btn', 'btn-sm', 'btn-primary');
            newButton.value = valuesText;
            newButton.textContent = '导入去哪订单';

            // 按钮样式
            newButton.style.display = 'flex';
            newButton.style.alignItems = 'center';
            newButton.style.justifyContent = 'center';
            newButton.style.fontFamily = 'Tahoma, Arial, "Hiragino Sans GB", SimSun, sans-serif';
            newButton.style.fontSize = '20px';
            newButton.style.lineHeight = '1.5';
            newButton.style.fontWeight = '400';
            newButton.style.color = '#0084bb';
            newButton.style.textDecoration = 'none';
            newButton.style.whiteSpace = 'nowrap';
            newButton.style.border = '0';
            newButton.style.backgroundColor = 'transparent';
            newButton.style.padding = '0 10px';
            newButton.style.cursor = 'pointer';

            // 按钮点击事件
            newButton.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    const apiResponse = JSON.parse(localStorage.getItem('qunaApiResponse') || '{}');
                    createCtripModal(
                        apiResponse,
                        syncCtripSendTask,
                        "/hotel-api/inter/order/QUNAR_FX/createQunarOrder"
                    );
                } catch (error) {
                    console.error('请求失败:', error);
                    alert('操作失败，请稍后重试');
                }
            });
            // 将按钮添加到新li中
            newLi.appendChild(newButton);
            // 将新li添加到ul的末尾（即所有现有li的后面）
            tabSet.appendChild(newLi);
        } else {
            console.log('未找到ul.ui-tab-set元素');
        }

    };

    // 携程按钮添加逻辑
    const ctripCheckAndAddButton = () => {
        const tabOrderList = document.getElementById('tabOrderList');
        if (!tabOrderList) return;
        //
        const retargetButtons = tabOrderList.getElementsByClassName('hoteltr');
        if (retargetButtons.length > 0) {
            Array.from(retargetButtons).forEach((button) => {
                const tdList = button.getElementsByClassName('supplier')[0]?.querySelectorAll('td');
                const lastTd = tdList?.[tdList.length - 1];
                if (lastTd && !lastTd.querySelector('.ctrip-sync-btn')) {
                    const formItems = button.getElementsByClassName('table-inline')[0]?.getElementsByClassName('d-form-item');
                    const concatenatedText = formItems ? Array.from(formItems)
                        .map(item => item.textContent.trim())
                        .join(' ') : '';
                    const newButton = document.createElement('button');
                    newButton.className = 'ctrip-sync-btn';
                    newButton.value = concatenatedText;
                    newButton.textContent = '导入携程订单';
                    newButton.style.fontSize = '98%';
                    newButton.style.display = 'flex';
                    newButton.style.alignItems = 'center';
                    newButton.style.justifyContent = 'center';
                    newButton.classList.add('btn', 'btn-sm', 'btn-primary');
                    newButton.addEventListener('click', async (e) => {
                        const orderId = e.currentTarget.value;
                        const apiResponse = JSON.parse(localStorage.getItem('Vipdlt_ApiResponse') || '{"data":{"infoBos":[]}}');
                        const orderData = apiResponse.data.infoBos.find(item => item.channelOrderId === orderId);
                        // 展示框
                        if (orderData) {
                            const detail = await syncCtripData(orderData.orderId);
                            createCtripModal(detail, syncCtripSendTask, "/hotel-api/inter/order/CTRIP_BINGTRIP/createOrder");
                        } else {
                            console.log('未找到携程订单数据');
                            alert('未找到携程订单数据, 联系技术确认！')
                        }
                    });
                    lastTd.appendChild(newButton);
                }
            });
        } else {
            setTimeout(ctripCheckAndAddButton, 3000);
        }
    };

    // 携程订单详情请求
    const syncCtripData = async (orderId) => {
        try {
            const url = "https://www.vipdlt.com/order/api/getOrderDetail";
            const referer = `https://www.vipdlt.com/order/orderDetail?ordertype=ctrip&OrderID=${orderId}&hasDiscount=false`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "x-requested-with": "XMLHttpRequest",
                    "referer": referer,
                    'Cookie': document.cookie
                },
                body: JSON.stringify({orderId, channel: "ctrip", historyId: ""})
            });
            return response.ok ? await response.json() : {error: '请求失败'};
        } catch (e) {
            console.error('携程详情请求错误:', e);
            return {error: e.message};
        }
    };

    // 同步订单请求
    const syncCtripSendTask = (orderData, loadingMessage, ginalUrl) => {
        let originalUrl = send_task_host_url + ginalUrl
        debugger;
        // 使用代理发送请求
        GM_xmlhttpRequest({
            method: 'POST',
            url: originalUrl, // 加上代理 URL
            headers: {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Language": "zh,zh-CN;q=0.9",
                "Cache-Control": "no-cache",
                "Content-Type": "application/json",
                "Pragma": "no-cache",
                "Proxy-Connection": "keep-alive",
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
                "X-Requested-With": "XMLHttpRequest"
            },
            data: JSON.stringify(orderData),
            onload: function (response) {
                if (response.status === 200) {
                    let respons_body = JSON.parse(response.responseText);
                    if (respons_body.code === 200) {
                        loadingMessage.textContent = '订单导入完成！';
                    } else if (respons_body.code === 266) {
                        loadingMessage.textContent = '该订单已导入！';
                    } else {
                        loadingMessage.textContent = '订单导入失败！';
                    }
                }
                if (response.status === 401) {
                    loadingMessage.textContent = '请先登录后台！！';
                }
                // 延迟 0.5s
                setTimeout(() => {
                    loadingMessage.style.display = 'none'; // 隐藏正在导入提示
                    // syncBtn.disabled = false;  // 重新启用按钮
                    // modal.remove();  // 移除模态框
                }, 1000);
            },
            onerror: function (error) {
                console.error('请求错误:', error);
                showAutoDismissAlert("订单导入失败！", 1000, true);
                loadingMessage.style.display = 'none';
                // syncBtn.disabled = false;  // 重新启用按钮
            }
        });
    };

    // elong
    const elongCheckAndButtons = () => {
        debugger;
        const title_text = document.getElementsByClassName("ebk-orderDetail ebk-order-box")[0].getElementsByClassName("title")[0].textContent;
        // title_text 不包含 "订单详情" 则返回
        if (!title_text.includes("订单详情")) {
            setTimeout(elongCheckAndButtons, 500); // 3秒后执行 qunaCheckAndButton
            return
        }

        if (title_text) {
            let title_div= document.getElementsByClassName("ebk-orderDetail ebk-order-box")[0].getElementsByClassName("title")[0];
            const existingLi = document.getElementsByClassName("ebk-orderDetail ebk-order-box")[0].getElementsByClassName("title")[0].querySelector('div:has(.elong-sync-btn)');
            if (existingLi) {
                console.log('已存在相同的div元素，无需重复添加');
                return; // 已存在则直接退出
            }
            const newLi = document.createElement('div');
            newLi.classList.add('ui-tab-item'); // 保持样式一致

            // 创建按钮
            const newButton = document.createElement('button');
            newButton.classList.add('elong-sync-btn', 'btn', 'btn-sm', 'btn-primary');
            // newButton.value = valuesText;
            newButton.textContent = '导入同程订单';

            // 按钮样式
            newButton.style.display = 'flex';
            newButton.style.alignItems = 'center';
            newButton.style.justifyContent = 'center';
            newButton.style.fontFamily = 'Tahoma, Arial, "Hiragino Sans GB", SimSun, sans-serif';
            newButton.style.fontSize = '20px';
            newButton.style.lineHeight = '1.5';
            newButton.style.fontWeight = '400';
            newButton.style.color = '#0084bb';
            newButton.style.textDecoration = 'none';
            newButton.style.whiteSpace = 'nowrap';
            newButton.style.border = '0';
            newButton.style.backgroundColor = 'transparent';
            newButton.style.padding = '0 10px';
            newButton.style.cursor = 'pointer';
            newButton.style.float = 'right';

            // 按钮点击事件
            newButton.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    const elongDetail = JSON.parse(localStorage.getItem('elongDetailApiResponse') || '{}');
                    createCtripModal(
                        elongDetail,
                        syncCtripSendTask,
                        "/hotel-api/inter/order/TCI_EBK/createTcOrder"
                    );
                } catch (error) {
                    console.error('请求失败:', error);
                    alert('操作失败，请稍后重试');
                }
            });

            // 将按钮添加到新li中
            newLi.appendChild(newButton);

            // 将新li添加到ul的末尾（即所有现有li的后面）
            title_div.appendChild(newLi);
        } else {
            console.log('未找到ul.ui-tab-set元素');
        }


    }
    // 模态框创建
    const createCtripModal = (orderData, sendTaskfunc, ginalUrl) => {
        // 新增一个div显示 "正在导入..."
        const loadingMessage = document.createElement('div');
        loadingMessage.style.position = 'fixed';
        loadingMessage.style.top = '50%';
        loadingMessage.style.left = '50%';
        loadingMessage.style.transform = 'translate(-50%, -50%)';
        loadingMessage.style.fontSize = '18px';
        loadingMessage.style.fontWeight = 'bold';
        loadingMessage.style.color = '#4CAF50';
        loadingMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        loadingMessage.style.padding = '20px 30px';
        loadingMessage.style.borderRadius = '10px';
        loadingMessage.style.color = '#fff';
        loadingMessage.style.zIndex = '9999';
        loadingMessage.style.display = 'none';  // 默认隐藏

        document.body.appendChild(loadingMessage); // 把loadingMessage添加到body中
        loadingMessage.textContent = '正在导入...';
        loadingMessage.style.display = 'block';
        sendTaskfunc(orderData, loadingMessage, ginalUrl);
    };

    // 通用弹窗函数（支持是否显示遮罩）
    function showAutoDismissAlert(message, duration, hasOverlay = false) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.padding = '15px 30px';
        modal.style.backgroundColor = '#4CAF50';
        modal.style.color = 'white';
        modal.style.borderRadius = '4px';
        modal.style.zIndex = '9999';
        modal.style.fontSize = '14px';
        modal.style.fontFamily = 'Arial, sans-serif';
        modal.style.textAlign = 'center';
        modal.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        modal.style.width = 'auto';
        modal.style.maxWidth = '300px';
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.5s';
        modal.textContent = message;

        let overlay = null;
        if (hasOverlay) {
            overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '9998';
            overlay.style.transition = 'opacity 0.5s';
            overlay.style.opacity = '0';
            document.body.appendChild(overlay);
        }

        document.body.appendChild(modal);

        setTimeout(() => {
            modal.style.opacity = '1';
            overlay?.style.setProperty('opacity', '1');
        }, 10);

        setTimeout(() => {
            modal.style.opacity = '0';
            overlay?.style.setProperty('opacity', '0');
            setTimeout(() => {
                modal.remove();
                overlay?.remove();
            }, 500);
        }, duration);
    }

    // 携程页面初始化
    window.addEventListener('load', () => {
        localStorage.removeItem('Vipdlt_ApiResponse'); // 清空携程缓存
        const tabOrderList = document.getElementById('tabOrderList');
        if (tabOrderList) {
            new MutationObserver(ctripCheckAndAddButton).observe(tabOrderList, {childList: true, subtree: true});
            ctripCheckAndAddButton();
        }
        // 去哪
        const orderList = document.querySelector('div[avalonctrl="orderList"]');
        if (orderList) {
            new MutationObserver(qunaCheckAndButton).observe(orderList, {childList: true, subtree: true});
            qunaCheckAndButton();
        }
    });

    // 初始化美团按钮检查
    meituanCheckAndAddButton();
})();

