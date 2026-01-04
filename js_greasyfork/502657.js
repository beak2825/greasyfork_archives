// ==UserScript==
// @name         temu抢发货台
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  zh-cn
// @author       summer
// @match        https://seller.kuajingmaihuo.com/main/*
// @grant        GM_xmlhttpRequest
// @connect      118.89.199.245
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502657/temu%E6%8A%A2%E5%8F%91%E8%B4%A7%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/502657/temu%E6%8A%A2%E5%8F%91%E8%B4%A7%E5%8F%B0.meta.js
// ==/UserScript==


(async function () {
    'use strict';

    let dz_html = `
    <div id="dz_auto_ship" style="position: fixed; top: 0;left:0;z-index:9999;">
    <div style="display: flex;flex-direction: column;">
    <button id="action_status_button">初始化中</button>
    <div style="background-color: rgb(255,255,255)">
    点击运行或停止;<span id="dz_countdown"></span>
    </div>
    </div>
    </div>
    `
    $('body').append(dz_html)

    // const SHOP_USER_DICT = {
    //     'metabest': 'dang.zheng',
    //     'metabest kiddofan': 'li.dongchao',
    // }
    const SHOP_USER_DICT = {
        "celeratehub": "sun.yongquan",
        "petopia meow": "xiao.ping",
        "petopia woof": "xiao.ping",
        "custom lazy": "sun.yongquan",
        "metabset belazy": "liu.jiming",
        "crafty decor": "chen.lili",
        "diy tool depot": "sun.zhengqi",
        "depart in time": "xiao.ping",
        "elite pick": "xie.yan",
        "featopia": "yang.songchao",
        "home want": "sun.zhengqi",
        "ikeana": "liu.jiming",
        "ishtar craft": "yang.songchao",
        "items grocery shop": "liu.jiming",
        "lazy pick": "xie.yan",
        "metabest": "xiao.ping",
        "metabest angler": "sun.yongquan",
        "metabest fashion": "sun.zhengqi",
        "metabest gym gear": "sun.zhengqi",
        "metabest gym pro": "xiao.ping",
        "metabest outdoor": "sun.zhengqi",
        "metabestpucatog": "sun.zhengqi",
        "metabest ccc": "xiao.ping",
        "metabest home": "xiao.ping",
        "metabest kiddofan": "chen.lili",
        "metabest outdoor gear": "sun.zhengqi",
        "metabest tool": "xiao.ping",
        "nebu decor": "yang.songchao",
        "oakland": "xiao.ping",
        "petopia supply": "yang.songchao",
        "petopia meow": "xiao.ping",
        "petopia woof": "xiao.ping",
        "petopia mall": "yang.songchao",
        "the cozy camp": "xiao.ping",
        "young fashionistas": "xiao.ping"
    }
    const LOOP_TIME = 60 * 1000 // 多久执行一次
    let shop_name = ''
    let action_status_key = ''
    let is_auto_shipping_key = ''
    let reload_key = 0
    let interval_key = 0

    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

    function get_now() {
        // 获取当前时间, 使用标准格式
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const formattedMilliseconds = date.getMilliseconds().toString().padStart(3, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${formattedMilliseconds}`;
    }

    function set_data(key, val){
        window.localStorage.setItem(key, val)
    }
    function get_data(key){
        return window.localStorage.getItem(key)
    }
    function cus_log(msg){
        console.log(msg)

        let log_key = `${shop_name}:logs`
        let logs = JSON.parse(get_data(log_key) || '[]')
        logs.push([get_now(), msg])

        //只保留最近2000条log, 超过去掉最早的
        if(logs.length > 2000){
            // logs = logs.slice(1, logs.length)
            logs = logs.slice(Math.max(logs.length-2000), logs.length)
        }
        set_data(log_key, JSON.stringify(logs))
    }

    function send_qq(msg, username){
        GM_xmlhttpRequest({
            method: "GET",
            url: `http://118.89.199.245:8008/send_private_msg?user=${username}&message=${msg}`,
            onload: function(response) {
                cus_log(`给${username}发送消息成功:${msg}`)
            },
            onerror: function(error) {
                cus_log(`给${username}发送消息失败:${msg}, 失败原因:${error}`)
            }
        })
    }
    // 给店铺负责人发信息
    function send_qq_by_shop(msg=''){
        let now = (new Date()).toLocaleString()
        msg = `${now}(消息可能延迟,请先确认时间)\n店铺${shop_name}\n` + msg

        let user_str = SHOP_USER_DICT[shop_name.toLowerCase()]

        if(!user_str){
            user_str = 'dang.zheng'
            msg += '\n未找到店铺负责人'
        }
        send_qq(msg, user_str)
    }

    async function interval_check_wrapper(){
        // 检查并关闭弹窗
        const BUTTON_TEXTS = [
            '下一条',
            '我知道了',
            '我已阅读',
        ]
        let wrappers = $('[data-testid="beast-core-modal-innerWrapper"]')
        // 从上往下关闭弹窗
        wrappers.sort(function(a, b){
            return Number($(b).css('z-index')) - Number($(a).css('z-index'))
        })
        for(let wrapper of wrappers.get()){
            let title = $(wrapper).find('[class^="modal_title"]')
            let title_text = $.trim(title.text())
            let button = $(wrapper).find('button[data-testid="beast-core-button"]')
            let button_text = $.trim(button.text())
            let all_text = $(wrapper).text()

            // 排除切换店铺的弹窗
            if(all_text.includes('切换店铺')){
                continue
            }

            cus_log(`发现弹窗,标题:${title_text}, 按钮文字:${button_text},弹窗全部内容:${all_text}`)
            if(BUTTON_TEXTS.includes(button_text)){
                console.log('1秒后关闭弹窗')
                await sleep(1000)
                button.click()
            }else{
                // todo send_qq
                // 排除 下一条(3s后关闭) 的倒计时
                if(BUTTON_TEXTS.every(e=>!button_text.includes(e))){
                    // send_qq_by_shop('脚本未识别的弹窗: '+ all_text)
                }
            }
        }
    }

    async function get_ele(query_text){
        // 点击前检查并关闭
        await interval_check_wrapper()
        // 在5s内循环找指定元素
        for(let i=0;i<50;i++){
            let ele = $(query_text)
            if(ele.length){
                return ele
            }
            await sleep(100)
        }
        console.log(`没有找到${query_text}`)
        return $('')
    }

    async function get_shop_name(){
        let shop = await get_ele('[class^="layout-main_mallInfo"] [data-testid="beast-core-icon"] span:first-child')
        return shop.eq(0).text()
    }

    function update_page_status_button(){
        // 根据缓存值更新页面状态按钮
        let action_status_val = get_data(action_status_key) || ''
        if(action_status_val == 'running'){
            $('#action_status_button').text('运行中')
        }else{
            $('#action_status_button').text('停止中')
        }
    }

    async function main_event(){
        // 加入发货台的主要操作
        try {
            cus_log('开始加入发货台')
            set_data(is_auto_shipping_key, 'Yes')

            // let check_all = $('[data-testid="beast-core-table-header-tr"] th:first-child input[type="checkbox"]')
            let check_all = await get_ele('[data-testid="beast-core-table-header-tr"] th:first-child input[type="checkbox"]')
            if(!check_all.length){
                throw '没有找到全选框'
            }
            if(!check_all.prop('checked')){
                // 已选中不需要再选
                check_all[0].click()
            }

            // await sleep(1000)
            // let action_button = $('[class^="order-manage_leftCnt"] button:not(:disabled) span:contains("批量加入发货台")')
            let action_button = await get_ele('[class^="order-manage_leftCnt"] button:not(:disabled) span:contains("批量加入发货台")')

            if(!action_button.length){
                throw '没有找到可点击的[批量加入发货台]'
            }
            action_button[0].click()

            // await sleep(2000)
            // let modals = $('[data-testid="beast-core-modal-body"]')
            let modals = await get_ele('[data-testid="beast-core-modal-body"]')
            let confirm_button = $('')
            $.each(modals, function(){
                let title = $.trim($(this).find('[class^="components_confirmTitle"]').text())
                if(title === '确认批量加入发货台吗？'){
                    confirm_button = $(this).find('button span:contains("确认")')
                }
            })
            if(!confirm_button.length){
                throw '没有找到[确认批量加入发货台吗？]的弹窗确认按钮'
            }
            confirm_button[0].click()

            let has_success = false
            // await sleep(3000)

            async function check_result(){
                // 检查提交结果有无成功
                for(let i=0;i<6;i++){
                    // 检查大的弹窗
                    let modals2 = $('[data-testid="beast-core-modal-body"]')
                    $.each(modals2, function(){
                        let res = $('[class^="delivery-platform-error-modal_countContainer"]')
                        if(!res.length){
                            return ''
                        }
                        let all_qty = Number(res.eq(0).find('[data-testid="beast-core-box"]').text())
                        let fail_qty = Number(res.eq(2).find('[data-testid="beast-core-box"]').text())
                        if(all_qty != fail_qty){
                            has_success = true
                        }
                    })

                    // 检查小的提示
                    let notices = $('[class^="TST_noticeContent"]')
                    $.each(notices, function(){
                        let text = $.trim($(this).text())
                        if(text == '已加入发货台'){
                            has_success = true
                        }
                    })

                    if(has_success){
                        break
                    }
                    await sleep(500)
                }
            }
            await check_result()

            if(has_success){
                cus_log('加入发货台-成功, 开始发送通知')
                send_qq_by_shop('将备货单加入了发货台')
            }else{
                cus_log('加入发货台-失败')
            }
        } catch (error) {
            cus_log(`加入发货台中断:${error}`)
        }

        // let count_val = 60
        // let cound_down = setInterval(function(){
        //     $('#dz_countdown').text(`${count_val}shou再次`)
        // }, 1000)

        // 完成后重新查询
        // cus_log(`${LOOP_TIME/1000}s后再次查询`)
        reload_key = setTimeout(() => {
            // cus_log('点击查询按钮')
            let query_button = $('[data-testid="beast-core-grid-col-wrapper"] [data-testid="beast-core-button"]:contains("查询")')
            query_button[0].click()
            // 点击查询按钮3秒后, 更新占用状态, 以便再次批量加入发货单
            setTimeout(() => {
                set_data(is_auto_shipping_key, 'No')
            }, 3000)
        }, LOOP_TIME);
    }

    function start_interval(){
        interval_key = setInterval(()=>{
            let hour = (new Date()).getHours()
            if(!(hour >= 9 && hour < 18)){
                // console.log('只在9点到18点加入发货台')
                return ''
            }

            let action_status_val = get_data(action_status_key) || ''
            let is_auto_shipping_val = get_data(is_auto_shipping_key) || ''
            let trs_length = $('[data-testid="beast-core-table-body-tr"]').length

            if(
                window.location.pathname == '/main/order-manage'
                && action_status_val == 'running'
                && is_auto_shipping_val == 'No'
                && trs_length > 0
            ){
                main_event()
            }else{
                // console.log(
                //     window.location.pathname,
                //     action_status_val,
                //     is_auto_shipping_val,
                //     trs_length
                // )
            }

        }, 3000)
    }

    // 点击页面按钮, 只更新缓存状态, 不处理定时循环
    $('#action_status_button').on('click', function(){
        // send_qq_by_shop('测试发送消息')
        let action_status_val = get_data(action_status_key)

        // 移除页面刷新的定时任务
        if (action_status_val == 'running'){
            cus_log('用户修改成暂停中')
            clearTimeout(reload_key)
            clearInterval(interval_key)
        }else{
            // 防止代码执行一半时点击暂停和运行, 导致is_auto_shipping_key固定Yes
            cus_log('用户修改成运行中')
            set_data(is_auto_shipping_key, 'No')
            start_interval()
        }
        // 更新按钮
        set_data(
            action_status_key,
            action_status_val == 'stopping' ? 'running': 'stopping'
        )
        update_page_status_button()
    })

    // 初始化函数
    async function init(){
        await sleep(3000) // 防止弹窗还未展示
        // 找到店铺名称
        shop_name = await get_shop_name()
        cus_log('页面刷新:' + shop_name)

        action_status_key = `${shop_name}:action_status`
        is_auto_shipping_key = `${shop_name}:is_auto_shipping`

        // 默认第一次打开页面就自动执行
        if(!get_data(action_status_key)){
            set_data(action_status_key, 'running')
        }

        // 页面初始化加载时清空一次 防止历史没有正确清空, 例如清空代码执行前刷新页面
        set_data(is_auto_shipping_key, 'No')
        update_page_status_button()

        // 开始循环监听
        if(get_data(action_status_key) == 'running'){
            start_interval()
        }
    }
    await init()
})()
