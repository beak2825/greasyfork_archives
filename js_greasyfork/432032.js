// ==UserScript==
// @name         Buff批量购买商品
// @namespace    http://tampermonkey.net/
// @version      0.51
// @description  Buff商品界面批量购买
// @author       jklujklu
// @include      https://buff.163.com/goods/*
// @icon         https://g.fp.ps.netease.com/market/file/59b156975e6027bce06e8f6ceTyFGdsj
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/432032/Buff%E6%89%B9%E9%87%8F%E8%B4%AD%E4%B9%B0%E5%95%86%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/432032/Buff%E6%89%B9%E9%87%8F%E8%B4%AD%E4%B9%B0%E5%95%86%E5%93%81.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const LIST = 'https://buff.163.com/api/market/goods/sell_order'
    const ORDER = 'https://buff.163.com/api/market/goods/buy/preview'
    const PAY = 'https://buff.163.com/api/market/goods/buy'
    const ASK = 'https://buff.163.com/api/market/bill_order/ask_seller_to_send_offer'
 
    // 购买最大单价
    let max_price = 0;
    // 购买最大数量
    let max_count = 20;
    // 查询单页数量
    let page_size = 20;
 
    let item_id = document.querySelector('.add-bookmark').getAttribute('data-target-id');
    document.querySelector('#asset_tag-filter').style.minHeight = '70px'
 
    const header = document.querySelector('.market-header')
    const div = document.createElement('div')
    header.insertBefore(div, header.children[0])
 
    const right = document.querySelector('.criteria .l_Right')
    const btn = document.createElement('div')
    btn.innerText = '一键购买'
    btn.classList.add('i_Btn','i_Btn_mid');
    btn.style.background = '#45536C'
    btn.onclick = run;
    right.insertBefore(btn, right.children[0])
 
    const price_input = document.createElement('input')
    price_input.classList.add('i_Text')
    price_input.style.margin = '5px'
    price_input.style.width = '80px'
    price_input.placeholder = 'Max Price'
    price_input.value = max_price;
    right.insertBefore(price_input, right.children[0])
 
    const number_input = document.createElement('input')
    number_input.classList.add('i_Text')
    number_input.style.margin = '5px'
    number_input.style.width = '80px'
    number_input.placeholder = 'Max Count'
    number_input.value = max_count;
    right.insertBefore(number_input, right.children[0])
 
 
    const span = document.createElement('span')
    span.innerText = '对方报价'
    right.insertBefore(span, right.children[0])
 
    const check = document.createElement('input')
    check.type = 'checkbox'
    right.insertBefore(check, right.children[0])
 
 
    function getCookie(name) {
        var prefix = name + "="
        var start = document.cookie.indexOf(prefix)
 
        if (start == -1) {
            return null;
        }
 
        var end = document.cookie.indexOf(";", start + prefix.length)
        if (end == -1) {
            end = document.cookie.length;
        }
 
        var value = document.cookie.substring(start + prefix.length, end)
        return unescape(value);
    }
 
    function ajax(method, url, data){
        return new Promise(resolve=>{
            if(method === 'get'){
                $.getJSON(url, data, rs => {
                    // console.log(rs);
                    resolve(rs)
                })
            }else if(method === 'post'){
                $.ajax({
                    type: "POST",
                    url: url,
                    data: data,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("X-CSRFToken", getCookie('csrf_token'));
                    },
                    contentType: "application/json",
                    dataType: "json",
                    success: rs => resolve(rs)
                });
            }
 
        })
    }
 
    const params = {
        game:'csgo',
        goods_id:item_id,
        page_num:1,
        sort_by:'default',
        mode:null,
        allow_tradable_cooldown:1,
        _:Date.parse(new Date()),
        page_size: page_size
    }
 
    async function run(){
        div.innerHTML = '';
        max_price = parseFloat(price_input.value);
        max_count = parseInt(number_input.value);
        div.innerHTML += (`你设定的价格为：${max_price}, 数量为：${max_count}, ${check.checked? '对方报价':'自己报价'}</br>`);
 
        div.innerHTML += (`获取最新商品列表</br>`);
 
        const rs = await ajax('get',LIST, params);
        const items = rs['data']['items'];
 
        const newItems = items.filter(e => e['price'] <= max_price);
        div.innerHTML += (`共筛选出：${newItems.length}个商品！</br>`);
 
        let success_count = 0;
        let request_count = 0;
        let price_count = 0;
        for (let index = 0; index < newItems.length; index++) {
            const element = newItems[index];
            const price = element['price'];
            const id = element['id'];
            console.log(price, id);
 
            // 下订单
            const order_params = {
                game: "csgo",
                sell_order_id: id,
                goods_id: item_id,
                price: price,
                allow_tradable_cooldown: "0",
                cdkey_id:null,
                _:Date.parse(new Date()),
            }
            const rs = await ajax('get',ORDER, order_params);
 
            // 商品已被购买
            if(rs['code'] !== 'OK'){
                console.log(rs['error']);
                div.innerHTML += (`错误：${rs['error']}</br>`);
                continue;
            }
            
            // 寻找buff余额选项
            const buffOption = rs['data']['pay_methods'].filter(x => x['name'].indexOf('BUFF余额-支付宝') !== -1)
            
            if(buffOption.length !== 1){
                div.innerHTML += (`错误：找不到BUFF支付选项，请反馈bug！</br>`);
                break
            }

            const is_enough = buffOption[0]['enough']
            const error = buffOption[0]['error']
            // 余额不足
            if(!is_enough){
                console.log(error);
                div.innerHTML += (`错误：${error}</br>`);
                break;
            }
            // 其他错误，如不支持支付宝购买
            if(error){
                console.log(error);
                div.innerHTML += (`错误：${error}</br>`);
                continue;
            }
 
            const coupon_params = {
                state: "unuse",
                coupon_type: "reduction",
                order_amount: price,
                sell_order_id: id,
                _: Date.parse(new Date()),
            }
 
            // await ajax('get', COUPON, coupon_params);
 
            const data = {
                "game":"csgo",
                "goods_id":item_id,
                "sell_order_id":id,
                "price":price,
                "pay_method":3,
                "allow_tradable_cooldown":0,
                "token":"","cdkey_id":""
            }
            const pay_rs = await ajax('post', PAY, JSON.stringify(data));
            console.log(pay_rs);
            let order_id = ''
            if(pay_rs['code'] === 'OK'){
                success_count = success_count + 1;
                price_count = price_count + parseFloat(price);
                order_id = pay_rs['data']['id']
                console.log('购买成功！');
                div.innerHTML += (`${id}购买成功，共花费${price}</br>`);
            }else{
                console.log(pay_rs['error']);
                div.innerHTML += (`${id}购买失败，${pay_rs['error']}</br>`);
                continue;
            }
 
            if(check.checked){
                for(let i=0;i<5;i++){
                    const ask_data = {"bill_orders":[order_id],"game":"csgo"}
                    const ask_rs = await ajax('post', ASK, JSON.stringify(ask_data));
                    if(ask_rs['code'] === 'OK'){
                        div.innerHTML += (`第${i +1 }次尝试：${id}已请求对方报价</br>`);
                        request_count += 1;
                        break;
                    }else{
                        div.innerHTML += (`第${i +1 }次尝试：${id}请求报价失败，${ask_rs['error']}</br>`);
                    }
                }
 
            }
 
            if(success_count === max_count){
                break;
            }
 
        }
 
        div.innerHTML += (`总计购买成功：${success_count}, 请求对方报价：${request_count}件,共花费${price_count}</br>`);
        if(request_count != success_count){
            alert(`注意：有${success_count - request_count}请求对方报价失败，请手动前往Buff发送报价，否则可能会被封购买！`)
        }
    }
})();