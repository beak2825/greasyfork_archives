// ==UserScript==
// @name         GZ-tools
// @namespace    http://tampermonkey.net/
// @version      3.31

// @description    GZPT
// @author       GZ-tools
// @license      MIT
// @match        https://www.dianxiaomi.com/order/index.htm*
// @match        https://detail.1688.com/*
// @match        https://detail.tmall.com/*
// @match        https://*.aliexpress.us/*
// @match        https://*.aliexpress.com/*
// @match        https://item.taobao.com/*
// @match        https://*.amazon.com/*
// @match        https://*.amazon.com/*
// @match        https://*.amazon.ca/*
// @match        https://*.amazon.es/*
// @match        https://*.amazon.fr/*
// @match        https://*.amazon.co.uk/*
// @match        https://s.1688.com/*
// @match        https://cart.1688.com/cart.htm*
// @match        https://trade.1688.com/oramazonder/new_step_order_detail.htm*
// @match        https://air.1688.com/app/ctf-page/payment-cashier-pc-air/cashier.html*
// @match        https://order.1688.com/order/smart_make_order.htm*
// @match        https://trade.1688.com/order/trade_flow.htm*
// @match        https://trade.1688.com/order/buyer_order_list.htm*
// @match        https://www.dianxiaomi.com/shopifyProduct/index.htm*
// @match        https://work.1688.com/home/buyer.htm*
// @match        https://www.1688.com*
// @include      https://1688.com
// @include      https://work.1688.com
// @include      https://oms2uc.yunexpress.cn
// @icon        https://img.alicdn.com/tfs/TB1uh..zbj1gK0jSZFuXXcrHpXa-16-16.ico?_=2020
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_cookie
// @grant        GM_openInTab
// @grant        GM_addValueChangeListener
// @grant        window.focus
// @grant        window.close
// @connect      *
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/489581/GZ-tools.user.js
// @updateURL https://update.greasyfork.org/scripts/489581/GZ-tools.meta.js
// ==/UserScript==
/* global refreshAjaxPage */

if (window.location.href.indexOf(".aliexpress.") > -1 ) {
    let itemId = window.location.href.match(/\/item\/(\d+)\.html/)?.[0];
    if (itemId) {window.history.pushState({}, '', `${window.location.origin}${itemId}`);}
}else if (window.location.href.indexOf("item.taobao.com") > -1 ) {
    let productId = window.location.href.match(/id=(\d+)/)?.[1];
    if (productId) {window.history.pushState({}, '', `${window.location.origin}/item.htm?id=${productId}`);}
}else if (window.location.href.indexOf("detail.tmall.com") > -1 ) {
    let productId = window.location.href.match(/id=(\d+)/)?.[1];
    if (productId) {window.history.pushState({}, '', `${window.location.origin}/item.htm?id=${productId}`);}
}else if (window.location.href.indexOf("detail.1688.com") > -1 ) {
    let productId = window.location.href.match(/offer\/(\d+)\.html/)?.[1];
    if (productId) {window.history.pushState({}, '', `${window.location.origin}/offer/${productId}.html`);}
} else if (window.location.href.includes(".amazon.")) {
    let productId = window.location.href.match(/\/(dp|gp\/product)\/([A-Z0-9]{10})/)?.[2];
    if (productId) {window.history.pushState({}, '', `${window.location.origin}/dp/${productId}`);}
}else if (window.location.href.indexOf("www.dianxiaomi.com/order/index") > -1 && (GM_getValue('param1') === true)) {
    GM_addStyle('.relative.m-top5.gray-c.hover-prompt.hoverPrompt.pointer.uClick.small.order-profit-prompt { display: none !important; }');
}
var 店铺和订单号 = GM_getValue('店铺和订单号');
var 默认1688地址ID = 8876232292
// 设置参数
GM_registerMenuCommand('参数设置', setpParameters );

function setpParameters() {
    var paramNames = {
        param1: '店小秘订单页面总开关',
        param3: '备注订单窗口，检查和来源按钮',
        param6: '图片跳转1688搜索',

        param11: '1688订单完成后自动复制订单号',
        param13: '1688自动填写地址和备注信息',
        param14: '1688修改地址',
    };
    var group1 = ['param1', 'param3', 'param6'];
    var group3 = [ 'param11', 'param13', 'param14'];
    if (!document.getElementById("szcskm")) {
        var panelDiv = document.createElement('div');
        panelDiv.id = 'szcskm'
        panelDiv.setAttribute('style', 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; border: 1px solid black; z-index: 9999; font-size: 16px;');
        var colorDiv = document.createElement('div');
        colorDiv.setAttribute('class', 'col-sm-1000');
        var colorss = ['#009926', '#F00', '#0005FD', '#FF5800', '#8E0075', '#FF6666', '#FFCAC5', '#00D0FF'];
        GM_setValue('selectedColor', GM_getValue('selectedColor', "#009926"))
        colorss.forEach(function(color) {
            var colorBlock = document.createElement('div');
            colorBlock.setAttribute('style', 'display: inline-block; width: 24px;border-radius: 4px; height: 24px; margin-right: 5px; background-color: ' + color + '; border: 2px solid transparent;');
            colorBlock.addEventListener('click', function() {
                var allColorBlocks = colorDiv.querySelectorAll('div');
                allColorBlocks.forEach(function(block) {
                    block.style.border = '2px solid transparent';
                });
                colorBlock.style.border = '2px solid black';
                GM_setValue('selectedColor', color);
            });
            colorDiv.appendChild(colorBlock);
            var selectedColor = GM_getValue('selectedColor');
            if (selectedColor && color === selectedColor) {
                colorBlock.style.border = '2px solid black';
            }
        });
        panelDiv.appendChild(colorDiv);
        function createGroup(group, groupName) {
            var groupTitle = document.createElement('h3');
            groupTitle.textContent = groupName;
            groupTitle.style.fontWeight = 'bold';
            groupTitle.style.fontSize = 'larger';
            groupTitle.style.marginTop = '10px';
            groupTitle.style.marginBottom = '10px';
            panelDiv.appendChild(groupTitle);
            group.forEach(function(param) {
                var paramName = paramNames[param];
                var checkboxLabel = document.createElement('label');
                var checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.checked = [true].includes(GM_getValue(param));
                checkbox.addEventListener('change', function() {
                    GM_setValue(param, this.checked);
                });
                checkbox.id = param;
                checkboxLabel.appendChild(checkbox);
                checkboxLabel.appendChild(document.createTextNode(' '+paramName));
                panelDiv.appendChild(checkboxLabel);
                panelDiv.appendChild(document.createElement('br'));
            });
        }
        createGroup(group1, '店小秘订单页面开关');
        createGroup(group3, '1688其他页面开关');

        var buttonDiv = document.createElement('div');
        buttonDiv.style.textAlign = 'right';
        buttonDiv.style.marginTop = '20px';
        var confirmButton = document.createElement('button');
        confirmButton.textContent = '确认';
        confirmButton.style.marginRight = '10px';
        confirmButton.addEventListener('click', function() {
            panelDiv.remove();
        });
        buttonDiv.appendChild(confirmButton);
        var cancelButton = document.createElement('button');
        cancelButton.textContent = '取消';
        cancelButton.addEventListener('click', function() {
            panelDiv.remove();
        });
        buttonDiv.appendChild(cancelButton);
        panelDiv.appendChild(buttonDiv);
        document.body.appendChild(panelDiv);
    }
}
window.onload = async () => {
    if ((window.location.href.indexOf("detail.1688.com/offer") > -1) && (GM_getValue('param13') === true)) {
        b1688产品界面创建备注();
    }
    if ((window.location.href.indexOf("cart.1688.com/cart.htm") > -1) && (GM_getValue('param13') === true)) {
        b1688采购界面创建备注();
    }
    if (window.location.href.indexOf("air.1688.com/app/ctf-page/payment-cashier-pc-air/cashier") > -1 && (GM_getValue('param11') === true)) {
        自动复制1688订单();
    }
    if (window.location.href.indexOf("work.1688.com/home/buyer.htm") > -1 ) {
        s设置Cookie1688和token1688()
    }
    if (window.location.href.indexOf("order/buyer_order_list.htm") > -1 ) {
        t批量添加购物车()
    }
    if (window.location.href.indexOf("order/smart_make_order.htm") > -1 && (GM_getValue('param14') === true)) {
        生成修改1688地址编辑框()
    }
}
function 自动复制1688订单() {
    let pageClicked = false;
    let intervalId;

    function handleClick() {
        pageClicked = true;
        clearInterval(intervalId);
        document.removeEventListener('click', handleClick);
    }
    document.addEventListener('click', handleClick);

    setTimeout(click_item1, 400);

    function click_item1() {
        const checkInterval = setInterval(() => {
            const el = document.querySelector('.order-no.orderNo_20oqa span');
            if (el) {
                clearInterval(checkInterval);
                let orderNo1 = el.innerText.trim();
                GM_setClipboard(orderNo1);
                var isBlinking = false;
                var counter = 0;
                function blinkTitle() {
                    if (counter >= 10 || pageClicked) {
                        clearInterval(intervalId);
                        if (!pageClicked) {
                            window.close();
                        }
                        return;
                    }
                    document.title = isBlinking ? "复制 " + orderNo1 : "成功复制!";
                    isBlinking = !isBlinking;
                    counter++;
                }
                intervalId = setInterval(blinkTitle, 500);
            }
        }, 300);
    }
}
function s设置Cookie1688和token1688() {
    return new Promise((resolve, reject) => {
        let cookieNames6 = ["cookie2", "cookie17", "_tb_token_", "_csrf_token", "t", "_m_h5_tk_enc", "_m_h5_tk"];
        GM_cookie.list({ url: 'https://1688.com' }, function (cookies, error) {
            if (error) {
                reject("获取 Cookie 出错");
                return;
            }

            cookies.forEach(cookie => {
                if (cookieNames6.includes(cookie.name)) {
                    GM_setValue(cookie.name, cookie.value);
                    cookieNames6 = cookieNames6.filter(name => name !== cookie.name);
                }
            });

            if (cookieNames6.length > 0) {
                document.cookie.split('; ').forEach(cookie => {
                    let [key, value] = cookie.split('=');
                    if (cookieNames6.includes(key)) {
                        GM_setValue(key, value);
                        cookieNames6 = cookieNames6.filter(name => name !== key);
                    }
                });
            }

            if (cookieNames6.length > 0) {
                reject("缺少部分 cookie");
            } else {
                GM_setValue('token1688', GM_getValue('_m_h5_tk', '').slice(0, 32));
                GM_setValue('1688Date', `${new Date().toString()} ${Math.random()}`);
                GM_setValue('Cookie1688', `_m_h5_tk=${GM_getValue('_m_h5_tk', '')}; _m_h5_tk_enc=${GM_getValue('_m_h5_tk_enc', '')}`);
                resolve("cookie 已设置完成");
            }
        });
    });
}

var observer;
// 店小秘菜单

function t批量添加购物车() {
    s设置Cookie1688和token1688().then(result => {
        console.log("获取成功:", result);
        var combinePayElement = document.querySelector('.combine-pay.fd-left');
        if (combinePayElement) {
            const button = document.createElement('button');
            button.className = 'plgwc button lang-button';
            button.innerText = '批量购物车';

            button.addEventListener('click', function () {
                let infoData = '';
                let 店铺和订单号 = '';
                const checkboxes = document.querySelectorAll('.single-select-checkbox');

                const promises = Array.from(checkboxes).map(checkbox => {
                    if (!checkbox.querySelector('.single-select').checked) return Promise.resolve();

                    const label = checkbox.parentNode;
                    const orderId = label.textContent.match(/\d{19}/)[0];

                    return jsapi.query1688Order(orderId).then(rawText => {
                        const JSONp = JSON.parse(rawText)?.data?.model;
                        const ttoArea = JSONp.toArea;
                        const cpymids = Object.keys(JSONp.groupEntriesMap);

                        const innerPromises = cpymids.map(cpymid => {
                            const groupItems = JSONp.groupEntriesMap[cpymid];
                            const specList = groupItems.map(item => ({
                                amount: item.canRefundCount,
                                specId: item.specId
                            }));

                            return jsapi.addToCart1688({ cpymid, specList }).then(result => {
                                const remarkMatch = ttoArea.includes('宝益路89号北大楼');
                                const remark = remarkMatch
                                ? ttoArea.split('宝益路89号北大楼')[1]
                                : ttoArea;

                                if (remarkMatch) {
                                    店铺和订单号 += remark + ';';
                                    infoData += `${orderId}: ${result.msg}\n 已获取备注:${remark}\n`;
                                } else {
                                    infoData += `${orderId}: ${result.msg}\n 未获取备注:${remark}\n`;
                                }
                            });
                        });

                        return Promise.all(innerPromises);
                    });
                });

                Promise.all(promises).then(() => {
                    alert(infoData);
                    GM_setValue('店铺和订单号', 店铺和订单号);
                }).catch(err => {
                    console.error("处理失败：", err);
                    alert('处理订单时出错，请检查 Cookie 或 token');
                });
            });

            combinePayElement.insertBefore(button, combinePayElement.firstChild);
        }

    }).catch(err => {
        console.error("获取失败:", err);
    });
}
function b1688采购界面创建备注() {
    function insertInputElement() {
        const targetElement = document.querySelector('[class*="bottom-bar--leftPanel--"]');
        const inputId = 'custom-input-id';
        if (targetElement && !document.getElementById(inputId)) {
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.placeholder = '请输入备注内容';
            inputElement.id = inputId;
            inputElement.style.height = '40px';
            inputElement.style.padding = '10px';
            inputElement.style.border = '2px solid #dcdcdc';
            inputElement.style.borderRadius = '5px';
            inputElement.style.fontSize = '16px';
            inputElement.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
            inputElement.value = GM_getValue('店铺和订单号');
            inputElement.addEventListener('blur', function() {
                GM_setValue('店铺和订单号', inputElement.value)
            });
            targetElement.appendChild(inputElement);
            const buttonElement = document.querySelector('.next-btn.next-large.next-btn-primary');
            if (buttonElement) {
                buttonElement.addEventListener('click', function() {
                    b修改地址(inputElement.value)
                });
            }
            clearInterval(intervalId);
            console.log("成功插入编辑框");
        }
    }
    const intervalId = setInterval(() => {
        insertInputElement();
    }, 1000);
}
function 生成修改1688地址编辑框() {
    let addressPlaceObserver = null;
    let latestInputValue = ""; // 缓存输入的值

    function getAddressParts(addr) {
        const parts = addr.trim().split(/\s+/);
        const seg = parts[3];
        if (seg && seg.includes("镇") && seg.length >= 2 && seg.length <= 5) {
            return [parts.slice(0, 4).join(' '), parts.slice(4).join(' ')];
        } else {
            return [parts.slice(0, 3).join(' '), parts.slice(3).join(' ')];
        }
    }

    function clickButtonByText(classSelector, text) {
        document.querySelectorAll(classSelector).forEach(btn => {
            const span = btn.querySelector('span');
            if (span && span.textContent.trim() === text) {
                btn.click();
            }
        });
    }

    function waitFor(checkFn, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const timer = setInterval(() => {
                if (checkFn()) {
                    clearInterval(timer);
                    resolve();
                } else if (Date.now() - start > timeout) {
                    clearInterval(timer);
                    reject(new Error("waitFor 超时"));
                }
            }, 100);
        });
    }

    async function autoSaveAddress(newValue) {
        if (!newValue || !newValue.trim()) {
            console.warn("地址为空，不执行保存");
            return;
        }

        document.querySelector('.address-action')?.click();

        await waitFor(() =>
                      document.querySelector('.ant-modal-header') &&
                      document.querySelector('.address-item.selected .ant-btn.ant-btn-text')
                     );

        document.querySelector('.address-item.selected .ant-btn.ant-btn-text')?.click();

        await waitFor(() => document.querySelector('#address'));

        const textarea = document.querySelector('#address');
        textarea.focus();
        textarea.setRangeText(newValue, 0, textarea.value.length, 'end');
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.blur();

        await waitFor(() => document.querySelector('.ant-btn.ant-btn-round.ant-btn-primary.ant-btn-lg'));

        clickButtonByText('.ant-btn.ant-btn-round.ant-btn-primary.ant-btn-lg', '保 存');
        clickButtonByText('.ant-btn.ant-btn-round.ant-btn-primary.ant-btn-lg', '确 定');
    }

    function createAddressInput() {
        const addressplace = document.querySelector('.address-place');
        if (!addressplace) return;
        if (addressplace.querySelector('textarea')) return;

        addressplace.style.display = 'flex';
        addressplace.style.alignItems = 'center';
        addressplace.style.gap = '10px';

        const raw = addressplace.textContent.trim();
        const [prefix, simplified] = getAddressParts(raw);

        const span = document.createElement('span');
        span.textContent = prefix;

        const span1 = document.createElement('span');
        span1.innerHTML = "温馨提示! 备注不包含<br>店小秘备注: " + GM_getValue('店铺和订单号');
        span1.style.fontSize = '12px';
        span1.style.color = 'red';

        const input = document.createElement('textarea');
        input.value = simplified;
        latestInputValue = simplified; // 初始缓存
        input.style.width = '600px';
        input.style.height = '36px';
        input.style.fontSize = '16px';
        input.style.resize = 'both';
        input.style.lineHeight = '1.5';
        input.style.boxSizing = 'border-box';
        input.style.padding = '4px 4px';
        input.style.borderRadius = '6px';
        input.style.border = '1px solid #ddd';

        // 实时缓存输入值
        input.addEventListener('input', function () {
            latestInputValue = input.value;
        });

        // 切回页面时恢复丢失的值
        window.addEventListener('focus', function () {
            if (input && input.value.trim() !== latestInputValue.trim()) {
                input.value = latestInputValue;
            }
        });

        // 失焦时保存
        input.addEventListener('blur', async function () {
            if (input.value.trim() === simplified.trim()) return;
            const style = document.createElement('style');
            style.id = 'hide-ant-modal-root-style';
            style.innerHTML = `.ant-modal-root {opacity: 0.01 !important;pointer-events: none !important;}`;
            document.head.appendChild(style);

            try {
                await autoSaveAddress(latestInputValue);
            } catch (err) {
                console.error("autoSaveAddress 出错:", err);
            } finally {
                setTimeout(() => {
                    const style = document.getElementById('hide-ant-modal-root-style');
                    if (style) style.remove();
                }, 500);
            }
        });

        addressplace.innerHTML = '';
        addressplace.appendChild(span);
        addressplace.appendChild(input);
        if (!simplified.includes(GM_getValue('店铺和订单号'))) {
            addressplace.appendChild(span1);
        }
    }

    function observeAddressPlace() {
        if (addressPlaceObserver) addressPlaceObserver.disconnect();

        const addressplace = document.querySelector('.address-place');
        if (addressplace && !addressplace.querySelector('textarea')) {
            createAddressInput();
        }

        addressPlaceObserver = new MutationObserver(() => {
            const node = document.querySelector('.address-place');
            if (node && !node.querySelector('textarea')) {
                createAddressInput();
            }
        });
        addressPlaceObserver.observe(document.body, { childList: true, subtree: true });
    }

    observeAddressPlace();
}
function b1688产品界面创建备注() {
    const element = document.querySelector('#submitOrder')||document.querySelector('.order-button-children-list');
    if (element) {
        const label = document.createElement('label');
        label.innerHTML = '默认地址: 江苏省 苏州市 昆山市 玉山镇<br>宝益路89号北大楼';
        label.className = 'order-button-label';
        label.style.fontSize = '14px';
        label.style.fontWeight = 'bold';
        label.style.marginRight = '10px';
        label.style.marginLeft = '18px';
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = '备注内容...';
        input.className = 'order-button-edit-box';
        input.style.fontSize = '14px';
        input.style.padding = '8px';
        input.style.width = '280px';
        input.style.border = '2px solid #d9d9d9';
        input.style.borderRadius = '4px';
        input.style.marginBottom = '10px';
        input.value = GM_getValue('店铺和订单号');
        input.style.marginRight = '18px';
        input.addEventListener('blur', function() {
            GM_setValue('店铺和订单号', input.value)
        });
        const container = document.createElement('div');
        container.className = 'edit-container';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.marginBottom = '20px';
        container.appendChild(label);
        container.appendChild(input);
        element.parentNode.insertBefore(container, element);
        const buttonElement = document.querySelector('.v-button.primary');
        if (buttonElement) {
            buttonElement.addEventListener('click', function() {
                b修改地址(input.value)
            });
        }
    }
}
function b修改地址(address1688){
    let m_h5_tk_value = null;

    document.cookie.split('; ').forEach(cookie => {
        let [key, value] = cookie.split('=');
        if (key === '_m_h5_tk') {
            m_h5_tk_value = value;
        }
    });
    if (m_h5_tk_value){
        let addressb = "宝益路89号北大楼 "+address1688
        let dataObject = {
            "id": 默认1688地址ID,
            "default": true,
            "mobilePhone": "17821039469",
            "countryCode": "CN",
            "addressCode": "320583",
            "addressCodeText": "江苏省 苏州市 昆山市",
            "townCode":"320583100",
            "townName":"玉山镇",
            "address": addressb,
            "fullName": "邱小姐",
            "post": ""
        };

        const updatedDataString = 'data=' + encodeURIComponent(JSON.stringify(dataObject));
        let token1688 = m_h5_tk_value.slice(0, 32)
        let r2 = "12574478";
        let t2 = (new Date).getTime();
        let datad = JSON.stringify(dataObject);
        let sign2 = md5(token1688 + "&" + t2 + "&" + r2 + "&" + datad);
        GM_xmlhttpRequest({
            method: "POST",
            url: `https://h5api.m.1688.com/h5/mtop.1688.trade.receiveaddress.updatereceiveaddress/1.0/?jsv=2.7.2&appKey=12574478&t=${t2}&sign=${sign2}&api=mtop.1688.trade.receiveaddress.updateReceiveAddress`,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0",
                "Accept": "application/json",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Content-Type": "application/x-www-form-urlencoded",
                "Cookie": document.cookie
            },
            data: updatedDataString,
            onload: function(response) {
                console.log(response.responseText);
            },
            onerror: function(error) {
                console.error('Error:', error);
            }
        });
    }
}
const jsapi = {
    // 1688获取公共参数
    getCommonParams1688() {
        const token = GM_getValue('token1688');
        const cookie = GM_getValue('Cookie1688');
        const t = Date.now();
        if (!token || !cookie) throw new Error("token 或 cookie 未设置");
        return { token, cookie, t };
    },

    // 上传图片并以图搜图
    uploadAndSearch1688(base64) {
        return new Promise((resolve, reject) => {
            let token, cookie, t;
            try {
                ({ token, cookie, t } = jsapi.getCommonParams1688());
            } catch (e) {
                return reject(e.message);
            }

            const imageBase64 = base64.split(',')[1];
            const dataJson = JSON.stringify({
                imageBase64,
                appName: "searchImageUpload",
                appKey: "pvvljh1grxcmaay2vgpe9nb68gg9ueg2"
            });
            const sign = md5(`${token}&${t}&12574478&${dataJson}`);
            const url = `https://h5api.m.1688.com/h5/mtop.1688.imageservice.putimage/1.0/?jsv=2.7.2&appKey=12574478&t=${t}&sign=${sign}&api=mtop.1688.imageService.putImage&ecode=0&v=1.0&type=originaljson&dataType=jsonp`;

            GM_xmlhttpRequest({
                method: "POST",
                url,
                data: new URLSearchParams({ data: dataJson }),
                headers: { 'Cookie': cookie },
                onload: res => {
                    if (res.status !== 200) return reject("请求失败：" + res.status);
                    resolve(res.responseText); // 调用方自己解析 JSON
                },
                onerror: err => reject("请求失败：" + (err?.error || err))
            });
        });
    },

    // 查询订单详情
    query1688Order(tradeId) {
        return new Promise((resolve, reject) => {
            let token, cookie, t;
            try {
                ({ token, cookie, t } = jsapi.getCommonParams1688());
            } catch (e) {
                return reject(e.message);
            }

            const dataJson = JSON.stringify({ orderId: tradeId });
            const sign = md5(`${token}&${t}&12574478&${dataJson}`);
            const url = `https://h5api.m.1688.com/h5/com.alibaba.shared.trade.service.mtoporderservice.queryorder/1.0/?jsv=2.6.1&appKey=12574478&t=${t}&sign=${sign}&data=${encodeURIComponent(dataJson)}`;

            GM_xmlhttpRequest({
                method: "GET",
                url,
                headers: {
                    'Cookie': cookie,
                    'Content-Type': 'application/json'
                },
                onload: res => {
                    if (res.status !== 200) return reject("请求失败：" + res.status);
                    resolve(res.responseText);
                },
                onerror: err => reject("网络请求错误：" + err)
            });
        });
    },

    // 查询快递状态
    query1688LogisticsTrace({ tradeId, mailNo, cpCode, cpName, logisticsId }) {
        return new Promise((resolve, reject) => {
            const url = `https://wuliu.1688.com/order/ajax/logistics_trace_ajax.jsx?_input_charset=UTF-8&callback=${Date.now()}&tradeId=${tradeId}&mailNo=${mailNo}&cpCode=${cpCode}&cpName=${cpName}&logisticsId=${logisticsId}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url,
                headers: { 'Cookie': GM_getValue('Cookie1688') },
                responseType: 'arraybuffer',
                onload: function (response) {
                    if (response.status !== 200) return reject("请求失败：" + response.status);
                    try {
                        const decoder = new TextDecoder('gbk');
                        const text = decoder.decode(response.response);
                        const jsonText = text.match(/\{.*\}/)?.[0];
                        const traceData = JSON.parse(jsonText);
                        resolve(traceData);
                    } catch (e) {
                        reject("解析失败：" + e.message);
                    }
                },
                onerror: err => reject("请求错误：" + err)
            });
        });
    },

    // 添加购物车
    addToCart1688({ cpymid, specList }) {
        return new Promise((resolve, reject) => {
            const data = {
                cargoIdentity: cpymid,
                _csrf_token: md5(GM_getValue('_csrf_token', '')),
                t: Date.now(),
                specData: JSON.stringify(specList)
            };

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://cart.1688.com/ajax/safe/add_to_cart_list_new.jsx',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': document.cookie
                },
                data: new URLSearchParams(data).toString(),
                responseType: 'arraybuffer',
                onload: function (response) {
                    try {
                        const decoder = new TextDecoder('gbk');
                        const decodedText = decoder.decode(new Uint8Array(response.response));
                        const json = JSON.parse(decodedText);
                        resolve(json);
                    } catch (e) {
                        reject("解析失败：" + e.message);
                    }
                },
                onerror: reject
            });
        });
    }

};

// md5加密32小写
function md5(a) {
    function b(a, b) {
        return a << b | a >>> 32 - b
    }
    function c(a, b) {
        var c, d, e, f, g;
        return e = 2147483648 & a,
            f = 2147483648 & b,
            c = 1073741824 & a,
            d = 1073741824 & b,
            g = (1073741823 & a) + (1073741823 & b),
            c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f
    }
    function d(a, b, c) {
        return a & b | ~a & c
    }
    function e(a, b, c) {
        return a & c | b & ~c
    }
    function f(a, b, c) {
        return a ^ b ^ c
    }
    function g(a, b, c) {
        return b ^ (a | ~c)
    }
    function h(a, e, f, g, h, i, j) {
        return a = c(a, c(c(d(e, f, g), h), j)),
            c(b(a, i), e)
    }
    function i(a, d, f, g, h, i, j) {
        return a = c(a, c(c(e(d, f, g), h), j)),
            c(b(a, i), d)
    }
    function j(a, d, e, g, h, i, j) {
        return a = c(a, c(c(f(d, e, g), h), j)),
            c(b(a, i), d)
    }
    function k(a, d, e, f, h, i, j) {
        return a = c(a, c(c(g(d, e, f), h), j)),
            c(b(a, i), d)
    }
    function l(a) {
        for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i; )
            b = (i - i % 4) / 4,
                h = i % 4 * 8,
                g[b] = g[b] | a.charCodeAt(i) << h,
                i++;
        return b = (i - i % 4) / 4,
            h = i % 4 * 8,
            g[b] = g[b] | 128 << h,
            g[f - 2] = c << 3,
            g[f - 1] = c >>> 29,
            g
    }
    function m(a) {
        var b, c, d = "", e = "";
        for (c = 0; 3 >= c; c++)
            b = a >>> 8 * c & 255,
                e = "0" + b.toString(16),
                d += e.substr(e.length - 2, 2);
        return d
    }
    function n(a) {
        a = a.replace(/\r\n/g, "\n");
        for (var b = "", c = 0; c < a.length; c++) {
            var d = a.charCodeAt(c);
            128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192),
                                                                           b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224),
                                                                                                                      b += String.fromCharCode(d >> 6 & 63 | 128),
                                                                                                                      b += String.fromCharCode(63 & d | 128))
        }
        return b
    }
    var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21;
    for (a = n(a),
         x = l(a),
         t = 1732584193,
         u = 4023233417,
         v = 2562383102,
         w = 271733878,
         o = 0; o < x.length; o += 16)
        p = t,
            q = u,
            r = v,
            s = w,
            t = h(t, u, v, w, x[o + 0], y, 3614090360),
            w = h(w, t, u, v, x[o + 1], z, 3905402710),
            v = h(v, w, t, u, x[o + 2], A, 606105819),
            u = h(u, v, w, t, x[o + 3], B, 3250441966),
            t = h(t, u, v, w, x[o + 4], y, 4118548399),
            w = h(w, t, u, v, x[o + 5], z, 1200080426),
            v = h(v, w, t, u, x[o + 6], A, 2821735955),
            u = h(u, v, w, t, x[o + 7], B, 4249261313),
            t = h(t, u, v, w, x[o + 8], y, 1770035416),
            w = h(w, t, u, v, x[o + 9], z, 2336552879),
            v = h(v, w, t, u, x[o + 10], A, 4294925233),
            u = h(u, v, w, t, x[o + 11], B, 2304563134),
            t = h(t, u, v, w, x[o + 12], y, 1804603682),
            w = h(w, t, u, v, x[o + 13], z, 4254626195),
            v = h(v, w, t, u, x[o + 14], A, 2792965006),
            u = h(u, v, w, t, x[o + 15], B, 1236535329),
            t = i(t, u, v, w, x[o + 1], C, 4129170786),
            w = i(w, t, u, v, x[o + 6], D, 3225465664),
            v = i(v, w, t, u, x[o + 11], E, 643717713),
            u = i(u, v, w, t, x[o + 0], F, 3921069994),
            t = i(t, u, v, w, x[o + 5], C, 3593408605),
            w = i(w, t, u, v, x[o + 10], D, 38016083),
            v = i(v, w, t, u, x[o + 15], E, 3634488961),
            u = i(u, v, w, t, x[o + 4], F, 3889429448),
            t = i(t, u, v, w, x[o + 9], C, 568446438),
            w = i(w, t, u, v, x[o + 14], D, 3275163606),
            v = i(v, w, t, u, x[o + 3], E, 4107603335),
            u = i(u, v, w, t, x[o + 8], F, 1163531501),
            t = i(t, u, v, w, x[o + 13], C, 2850285829),
            w = i(w, t, u, v, x[o + 2], D, 4243563512),
            v = i(v, w, t, u, x[o + 7], E, 1735328473),
            u = i(u, v, w, t, x[o + 12], F, 2368359562),
            t = j(t, u, v, w, x[o + 5], G, 4294588738),
            w = j(w, t, u, v, x[o + 8], H, 2272392833),
            v = j(v, w, t, u, x[o + 11], I, 1839030562),
            u = j(u, v, w, t, x[o + 14], J, 4259657740),
            t = j(t, u, v, w, x[o + 1], G, 2763975236),
            w = j(w, t, u, v, x[o + 4], H, 1272893353),
            v = j(v, w, t, u, x[o + 7], I, 4139469664),
            u = j(u, v, w, t, x[o + 10], J, 3200236656),
            t = j(t, u, v, w, x[o + 13], G, 681279174),
            w = j(w, t, u, v, x[o + 0], H, 3936430074),
            v = j(v, w, t, u, x[o + 3], I, 3572445317),
            u = j(u, v, w, t, x[o + 6], J, 76029189),
            t = j(t, u, v, w, x[o + 9], G, 3654602809),
            w = j(w, t, u, v, x[o + 12], H, 3873151461),
            v = j(v, w, t, u, x[o + 15], I, 530742520),
            u = j(u, v, w, t, x[o + 2], J, 3299628645),
            t = k(t, u, v, w, x[o + 0], K, 4096336452),
            w = k(w, t, u, v, x[o + 7], L, 1126891415),
            v = k(v, w, t, u, x[o + 14], M, 2878612391),
            u = k(u, v, w, t, x[o + 5], N, 4237533241),
            t = k(t, u, v, w, x[o + 12], K, 1700485571),
            w = k(w, t, u, v, x[o + 3], L, 2399980690),
            v = k(v, w, t, u, x[o + 10], M, 4293915773),
            u = k(u, v, w, t, x[o + 1], N, 2240044497),
            t = k(t, u, v, w, x[o + 8], K, 1873313359),
            w = k(w, t, u, v, x[o + 15], L, 4264355552),
            v = k(v, w, t, u, x[o + 6], M, 2734768916),
            u = k(u, v, w, t, x[o + 13], N, 1309151649),
            t = k(t, u, v, w, x[o + 4], K, 4149444226),
            w = k(w, t, u, v, x[o + 11], L, 3174756917),
            v = k(v, w, t, u, x[o + 2], M, 718787259),
            u = k(u, v, w, t, x[o + 9], N, 3951481745),
            t = c(t, p),
            u = c(u, q),
            v = c(v, r),
            w = c(w, s);
    var O = m(t) + m(u) + m(v) + m(w);
    return O.toLowerCase()
}