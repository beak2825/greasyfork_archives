// ==UserScript==
// @name         temu回传token
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  回传token
// @author       dang.zheng
// @match        https://kuajing.pinduoduo.com/*
// @match        https://seller.kuajingmaihuo.com/*
// @grant        GM_xmlhttpRequest
// @connect      beyuanfeilitian.yuyueyuyuan.com
// @connect      127.0.0.1
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490805/temu%E5%9B%9E%E4%BC%A0token.user.js
// @updateURL https://update.greasyfork.org/scripts/490805/temu%E5%9B%9E%E4%BC%A0token.meta.js
// ==/UserScript==


(function () {
    'use strict';
    // const API_URL = 'http://127.0.0.1:8001/api/temu_update_token/'
    const API_URL = 'https://beyuanfeilitian.yuyueyuyuan.com/api/temu_update_token/'
    // temu_update_token 缩写 tut
    const TOKEN_DATA_KEY = 'tut_token_data'

    // 校验expire_timestamp是否过期或接近过期, 返回报错信息
    function check_valid(expire_timestamp){
        let now_timestamp = (new Date()).getTime() / 1000
        let valid_hours = (expire_timestamp - now_timestamp) / 3600

        console.log('tokens剩下有效小时:', valid_hours.toFixed(2))
        if(valid_hours < 1){
            return `有效期${valid_hours.toFixed(2)}小时, 小于1小时, 请关闭弹窗, 重新登陆后再保存token`
        }else{
            return ''
        }
    }

    // 插入按钮
    let tut_html = `
    <div id="tut_content" style="display:none; position: fixed; top: 20%;left:40%;z-index:999999;width:20%;background-color: rgba(255,255,255,1);text-align: center;">
        <div style="display: flex;flex-direction: column;">
            <textarea id="tut_token_content" rows="10" placeholder="粘贴内容"></textarea>
            <div style="text-align: center;">
                <input type="submit" id="tut_post_token" value="提交" style="width:80px;">
                <input type="submit" id="tut_close_window" value="关闭" style="width:80px;">
            </div>
            <div id="tut_local_result" style="display:none;"></div>
            <div id="tut_post_result"></span>
        </div>
    </div>
    `
    $('body').after(tut_html)

    // 更新主体token
    $('#tut_post_token').on('click', function(e){
        let err_msg = []
        let shop = $('[class^="layout_mallInfo"] [data-testid="beast-core-icon"] span:first-child')
        let shop_name = shop.eq(0).text()
        if(!shop_name){
            err_msg.push('没有找到店铺名称')
        }
        let cookies = []
        try{
            cookies = JSON.parse($('#tut_token_content').val())
        }catch{
            err_msg.push('粘贴内容格式错误')
        }
        let token = ''
        let expire_timestamp = 0
        for(let cookie of cookies){
            if(cookie['name'] == 'SUB_PASS_ID'){
                token = cookie['value']
                expire_timestamp = cookie['expirationDate']
            }
        }
        if(!token){
            err_msg.push('没有找到token')
        }
        let check_valid_msg = check_valid(expire_timestamp)
        if(check_valid_msg){
            err_msg.push(check_valid_msg)
        }

        if(err_msg.length){
            $('#tut_post_result').html(`<span style="color:#a94442;">${err_msg.join(';')}</span>`)
            return ''
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: API_URL,
            dataType: 'json',
            data: JSON.stringify({shop_name, token}),
            onload: function(response) {
                let res = JSON.parse(response.response)
                if(res.success){
                    window.localStorage.setItem(TOKEN_DATA_KEY, JSON.stringify({
                        token, expire_timestamp
                    }))
                    $('#tut_post_result').html(`<span style="color:#5b80b2;">${res.msg}, 3秒后自动关闭</span>`)
                    setTimeout(() => {
                        $('#tut_token_content').val('')  // 清空之前输入
                        $('#tut_content').hide()
                    }, 3000);
                }else{
                    $('#tut_post_result').html(`<span style="color:#a94442;">${res.msg}</span>`)
                }
            },
        })
    })
    $('#tut_close_window').on('click', function(){
        $('#tut_content').hide()
    })

    // 周期性校验token的expire_timestamp
    function check_token_expire(){
        if(['/login', '/settle/site-main'].includes(window.location.pathname)){
            console.log('登陆界面或站点首页不出现')
            return ''
        }
        // 检查token有效期, 若没有缓存或者有效期小于1小时, 显示更新token的页面
        let msg = ''
        let token_json = JSON.parse(window.localStorage.getItem(TOKEN_DATA_KEY))
        console.log('token_json', token_json)
        if(!token_json){
            msg = '从插件导出cookies后提交'
        }else{
            let expire_timestamp = token_json?.expire_timestamp || 0
            let check_valid_msg = check_valid(expire_timestamp)
            if(check_valid_msg){
                msg = check_valid_msg
            }
        }
        if(msg){
            $('#tut_content').show()
            $('#tut_local_result').show().text(msg)
        }
    }

    check_token_expire()
    setInterval(check_token_expire, 10*60*1000)  // 每10分钟检查一次
})();
