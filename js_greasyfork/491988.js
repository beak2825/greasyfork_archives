// ==UserScript==
// @name         有赞自动蹲票（萤火虫漫展/虫娘小卖部等）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  蹲开票之后的第n波票或掉落余票，开票时需手动刷新
// @author       浩劫者12345
// @match        https://*.youzan.com/*
// @icon         https://img01.yzcdn.cn/v2/image/yz_fc.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491988/%E6%9C%89%E8%B5%9E%E8%87%AA%E5%8A%A8%E8%B9%B2%E7%A5%A8%EF%BC%88%E8%90%A4%E7%81%AB%E8%99%AB%E6%BC%AB%E5%B1%95%E8%99%AB%E5%A8%98%E5%B0%8F%E5%8D%96%E9%83%A8%E7%AD%89%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/491988/%E6%9C%89%E8%B5%9E%E8%87%AA%E5%8A%A8%E8%B9%B2%E7%A5%A8%EF%BC%88%E8%90%A4%E7%81%AB%E8%99%AB%E6%BC%AB%E5%B1%95%E8%99%AB%E5%A8%98%E5%B0%8F%E5%8D%96%E9%83%A8%E7%AD%89%EF%BC%89.meta.js
// ==/UserScript==


(async function () {

    // 初始化购票信息
    /** @type {RegExp} */
    var ticketToBuy_regex
    try {
        ticketToBuy_regex = new RegExp(GM_getValue('autoBuyRegex') || '电子预售票');
    } catch (error) {
        console.log('正则表达式解析失败，正在使用默认值')
        ticketToBuy_regex = /电子预售票/;
    }
    const idcard = GM_getValue('autoBuyIDCard') || '';
    const realname = GM_getValue('autoBuyRealname') || '';
    const phonenumber = GM_getValue('autoBuyPhonenumber') || '';
    const minAcceptPrice = parseInt(GM_getValue('autoBuyMinAcceptPrice')) || 99999;

    function checkAutoBuyInfo() {
        return idcard && idcard.length == 18 && realname && realname.length >= 2 && phonenumber && phonenumber.length == 11
    }

    function saveAutoBuyInfo() {
        console.log('正在保存蹲票配置')
        GM_setValue('autoBuyRegex', document.getElementById('settingsRegex').value)
        GM_setValue('autoBuyIDCard', document.getElementById('settingsIDCard').value)
        GM_setValue('autoBuyRealname', document.getElementById('settingsRealname').value)
        GM_setValue('autoBuyPhonenumber', document.getElementById('settingsPhonenumber').value)
        GM_setValue('autoBuyMinAcceptPrice', document.getElementById('settingsMinAcceptPrice').value)
        location.reload()
    }

    // 设置按钮和设置界面
    const settingsEl = document.createElement('template')
    settingsEl.innerHTML = `
        <button id="settingsBtn" onclick="document.getElementById('settingsOverlay').style.display = 'block'" style="
            position: fixed;
            left: 4px;
            top: 30%;
            border-radius: 25%;
            background-color: #0f0;
            padding: 8px;
            line-height: 1em;
            z-index: 999;
        ">蹲票<br>设置</button>
        <div id="settingsOverlay" style="
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            padding: 8px;
            border: 2px solid;
            background-color: white;
            overflow: auto;
            z-index: 999;
        ">
            <p>票名（支持正则表达式匹配）：</p>
            <input id="settingsRegex" style="height: initial; background-color: #ff0;" value="${ticketToBuy_regex.source}">
            <p>
                举例：<br>
                所有普票：电子预售票<br>
                所有32nd普票：电子预售票.*32<br>
                所有32nd 5月1号普票：5月1日电子预售票.*32<br>
                所有32nd所有票（包括VIP）：32<br>
                （正则表达式用于匹配商品标题，如果不会请百度）
            </p><br><br>
            <p>身份证：</p>
            <input id="settingsIDCard" style="height: initial; background-color: #ff0;" value="${idcard}"><br><br>
            <p>姓名：</p>
            <input id="settingsRealname" style="height: initial; background-color: #ff0;" value="${realname}"><br><br>
            <p>手机号：</p>
            <input id="settingsPhonenumber" style="height: initial; background-color: #ff0;" value="${phonenumber}"><br><br>
            <p>最大可接受价格 (普票￥85):</p>
            <input id="settingsMinAcceptPrice" style="height: initial; background-color: #ff0;" value="${minAcceptPrice}"><br><br>
            <button id="settingsSetBtn" style="float: right">确定</button>
        </div>
    `
    document.body.appendChild(settingsEl.content)
    document.getElementById('settingsSetBtn').onclick = saveAutoBuyInfo


    // 所有商品页
    //
    if (location.href.includes('/wscshop/feature/goods/all')) {
        // 蹲票状态覆盖层
        const overlayEl = document.createElement('template')
        overlayEl.innerHTML = `
            <div id="autoBuyStatus" style="
                position: fixed;
                left: 8px;
                bottom: 8px;
                box-sizing: border-box;
                max-width: 60%;
                max-height: 30%;
                padding: 8px;
                background-color: rgba(0, 0, 0, 0.5);
                color: white;
                font-size: 12px;
                line-height: 1.2;
                overflow: auto;
            "></div>
        `
        document.body.appendChild(overlayEl.content)

        // 检查蹲票信息是否正确，不正确则留下提示然后退出
        if (!checkAutoBuyInfo()) {
            console.log('购票信息有误')
            document.getElementById('autoBuyStatus').innerHTML = '请先正确填写蹲票信息！'
            document.getElementById('autoBuyStatus').style.fontSize = '20px'
            document.getElementById('autoBuyStatus').style.color = '#ff0'
            return
        }


        // 申请浏览器通知权限
        Notification.requestPermission().then(() => {
            new Notification('蹲票脚本已启动', {
                body: '有票时将通过浏览器通知提醒支付',
            });
        })

        // 启动 worker 以便页面挂起时也能继续蹲票
        function workerInterval() {
            setInterval(() => {
                postMessage('')
            }, 1000);
        }
        const workerBlob = URL.createObjectURL(new Blob([`(${workerInterval.toString()})()`], { type: 'application/javascript' }));
        const worker = new Worker(workerBlob)

        let count = 0

        worker.onmessage = () => {
            /*
                https://shop46404892.youzan.com/wscshop/showcase/goods/allGoods.json?
                pageSize=20&
                page=1&
                offlineId=0&
                openIndependentPrice=0&
                order=&
                json=1&
                uuid=a5f75232-3ec1-66c4-5ec2-b0db133d7765&
                activityPriceIndependent=1&
                order_by=algPVD30&
                goodsType=2&
                needActivity=0&
                clientSource=2&
                tagAlias=&
                needGroupFilter=false&
                needGoodsRank=true&
                supportCombo=true&
                excludedComboSubType=%5B%22none%22%5D", {
            */
            // 获取前20个商品
            fetch("/wscshop/showcase/goods/allGoods.json?json=1&order_by=createdTime", {
                "method": "GET",
                "credentials": "include"
            }).then(r => r.json()).then(data => {
                // 清空蹲票信息显示
                document.getElementById('autoBuyStatus').innerHTML = `正在蹲以下票（${Notification.permission == "granted" ? '浏览器通知已启用' : '请启用浏览器通知以便接收结果'}）：<br>`
                // 遍历商品
                data.data.list.forEach((item) => {
                    // 匹配商品标题
                    if (item.title.match(ticketToBuy_regex)) {
                        // 蹲票状态显示在覆盖层
                        document.getElementById('autoBuyStatus').innerHTML += `${item.title}&emsp;价格: ${item.price}&emsp;余票: ${item.totalStock}<br>`
                        if (item.totalStock > 0 && item.price <= minAcceptPrice) {
                            // 有票时发送浏览器通知并跳转商品详情页
                            new Notification('发现有票，请10分钟内前往手动支付', {
                                body: item.title,
                            });
                            document.querySelectorAll('.cap-goods-layout__container>.cap-goods-layout__wrapper>.cap-goods-layout__item').forEach((el) => {
                                if (el.innerText.match(item.title)) {
                                    console.log('正在打开商品详情页')
                                    el.click()
                                }
                            })
                        }
                    }
                })
                count++
                document.getElementById('autoBuyStatus').innerHTML += `已蹲票次数：${count}<br>`
            })
        }
    }


    // 除了所有商品页外，其他页面若无法正确识别购票信息则退出
    if (!checkAutoBuyInfo()) {
        console.log('购票信息有误')
        return
    }

    // 商品详情页有两种，结构略有不同
    //
    if (location.href.includes('/wscgoods/detail') || location.href.includes('/pay/wscgoods_order')) {
        /**
         * 列出所有商品类型选项
         * @returns {NodeListOf<HTMLElement>} 
         */
        function getGoodsItemList() {
            return document.querySelectorAll('.sku-row .sku-row__item')
        }

        while (true) {
            // 暂停间隔
            await new Promise(r => setTimeout(r, 500))

            try {
                if (!document.querySelector('.goods-title__main-text').innerText.match(ticketToBuy_regex)) {
                    console.log('商品不匹配，跳过自动点击')
                    break
                }
                if (document.querySelector('.mrb__no-goods')) {
                    console.log('没票了！')
                    break
                }

                // 商品选择页未打开，先打开页面
                if (getGoodsItemList().length == 0) {
                    console.log('正在打开购买页面')
                    if (true) {
                        // 点击商品选择列表
                        document.querySelectorAll('.group-block .sku-bar')[0].click()
                    } else {
                        // 以下代码已弃用
                        // 两种“立即购买”按钮，其中一种要点击更内层的 div 才可触发购买界面
                        try {
                            document.querySelector('.goods-btns__button.button--last .goods-btns__authorize .user-authorize__btn-empty').click()
                        } catch (error) {
                            document.querySelector('.goods-btns__button.button--last .goods-btns__authorize').click()
                        }
                    }
                }
                // 商品选择页已打开
                else {
                    // 选择匹配到的票种
                    console.log('正在选择票种')
                    getGoodsItemList().forEach(el => {
                        if (!el.classList.contains('sku-row__item--active') && el.innerText.match(ticketToBuy_regex)) {
                            el.click()
                        }
                    })

                    // 填实名信息（需手动触发 input 刷新变量，blur 事件确认购买价），两种页面通用
                    console.log('正在填写信息')
                    // 旧文本框 '.tee-view.sku-row__item-main'
                    document.querySelectorAll('.sku-messages>.tee-view').forEach(el => {
                        let labelText = el.querySelector('.t-cell__title').innerText
                        let inputEl = el.querySelector('.t-cell__value input')

                        inputEl.focus()

                        if (labelText.includes('身份证')) {
                            inputEl.value = idcard
                        }
                        if (labelText.includes('姓名')) {
                            inputEl.value = realname
                        }
                        if (labelText.includes('电话') || labelText.includes('手机')) {
                            inputEl.value = phonenumber
                        }

                        inputEl.dispatchEvent(new Event('input'))
                        inputEl.dispatchEvent(new Event('blur'))
                    })

                    // 确认购买
                    setTimeout(() => {
                        console.log('正在跳转提交订单界面')
                        // 确认购买按钮
                        for (let selector of [
                            '.sku-actions__btn--main',
                            '.sku-actions .user-authorize-btn button',
                            '.pay-btn-order',
                        ]) {
                            let el = document.querySelector(selector)
                            if (el) {
                                el.click()
                                break
                            }
                        }
                    }, 50);
                }
            } catch (error) { }
        }
    }


    // 提交订单页面
    //
    if (location.href.includes('/pay/wsctrade_buy')) {
        await new Promise(r => setTimeout(r, 1000))

        if (!document.querySelector('.new-goods-list-card__title__text').innerText.match(ticketToBuy_regex)) {
            console.log('商品不匹配，跳过自动点击')
            return
        }

        console.log('正在提交订单')
        document.querySelector('.submit-bar__button').click()
    }

})();