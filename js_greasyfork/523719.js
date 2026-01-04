// ==UserScript==
// @name         desty Shopee Collection Plugin
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @license      MIT
// @description  Only applicable for collecting similar data https://shopee.co.id/product/shop_id/item_id The address
// @author       Gao yongshun
// @match        *://shopee.co.id/*
// @icon         https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/icon_favicon_1_32.0Wecxv.png
// @grant        none
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/523719/desty%20Shopee%20Collection%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/523719/desty%20Shopee%20Collection%20Plugin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 代码1 - 创建加载效果的 HTML 结构
    const loadingHTML = `
        <div id="custom-loading" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); z-index: 10000; justify-content: center; align-items: center;">
            <div style="border: 5px solid #f3f3f3; border-top: 5px solid rgba(249, 78, 47); border-radius: 50%; width: 30px; height: 30px; animation: spin 2s linear infinite;"></div>
        </div>
    `;

    // 将加载效果的 HTML 插入到页面中
    document.body.insertAdjacentHTML('beforeend', loadingHTML);

    // CSS 动画定义
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // 控制加载效果显示或隐藏的函数
    function toggleLoading(show) {
        const loadingElement =$('#custom-loading');
        if (show) {
            loadingElement.css({
                'display': 'flex'
            });
        } else {
            loadingElement.hide();
        }
    };

    // 代码2 - 创建弹窗的 HTML 结构
    const modalHTML = `
        <div id="customModal" style="display: none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0, 0, 0, 0.4);">
            <div style="background-color: #fefefe; margin: 20px auto 0; padding: 20px; border: 1px solid #888; width: 520px; border-radius: 10px;">
                <div style=" display: flex; align-items: center; justify-content: space-between;">
                     <span class="msg" style="font-weight: bold;">Custom Content</span>
                     <span class="close" style="color: rgba(249, 78, 47); float: right; font-size: 28px; font-weight: bold; cursor: pointer;">&times;</span>
                </div>
                <div class="product-info">
                     <p class="title"></p>
                     <p class="price"></p>
                     <p class="item_id"></p>
                     <p class="currency"></p>
                     <div class="imgs"></div>
                </div>
            </div>
        </div>
    `;

    // 将弹窗 HTML 结构插入到页面中
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 获取弹窗元素
    const modal = $('#customModal');
    const msgDom = $('#customModal .msg');
    const closeBtn = $('#customModal .close');
    const infoDom = $('#customModal .product-info')
    const titleDom = $('#customModal .title')
    const priceDom =  $('#customModal .price')
    const itemIdDom = $('#customModal .item_id')
    const currencyDom = $('#customModal .currency')
    const imgsDom = $('#customModal .imgs')

    // 显示弹窗
    function showModal(msg, form = null) {
        msgDom.text(msg)
        if(form) {
            titleDom.text("title: " + form.title)
            priceDom.text("price: " + form.price)
            itemIdDom.text("item_id: " + form.item_id)
            currencyDom.text("currency: " + form.currency)
            imgsDom.html("<p>images: </p>" + form.imgs.map(img => "<p>" + img + "</p>").join(""))
            infoDom.show()
        }else {
            infoDom.hide()
        }

        modal.show();
        // 设置定时器，3秒后自动关闭弹窗title
         //setTimeout(() => {
            //modal.hide();
        //}, 3000);
    }

    // 绑定关闭按钮的点击事件
    closeBtn.on('click', () => {
        modal.hide();
    });

    // 代码3 - 创建功能区域的 dom 元素
    // 后续增加功能按钮请在此处维护
    const buttons = [
        { id: 'colectButton', content: 'collect'}
    ];

    const floatingButtonsContainer = document.createElement('div');
    floatingButtonsContainer.id = 'floating-buttons-container';
    document.body.appendChild(floatingButtonsContainer);

    buttons.forEach(button => {
        const buttonElement = document.createElement('a');
        buttonElement.id = button.id;
        buttonElement.className = 'floating-button';
        buttonElement.innerHTML = button.content;
        buttonElement.title = 'Only applicable for collecting similar data https://shopee.co.id/product/shop_id/item_id The address'
        floatingButtonsContainer.appendChild(buttonElement);
    });

    const customStyle = document.createElement('style');
    customStyle.innerHTML = `
        #floating-buttons-container {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 50%;
            right: 5px;
            transform: translateY(-50%);
            z-index: 9999;
        }

        .floating-button {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(249, 78, 47);
            color: #ffffff;
            width: 50px;
            height: 50px;
            border-radius: 5px;
            font-weight: bold;
            font-size: 14px;
            margin-top: 10px;
            text-align: center;
            cursor: pointer;
        }
    `;
    document.head.appendChild(customStyle);

    // 代码4 - 功能按钮绑定事件
    // 商品详情接口
    const requestPath = '/api/v4/pdp/get_pc'
    // 图片地址前缀
    const filePath = 'https://down-id.img.susercontent.com/file/'
    // 获取指定cookie方法
    function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
    }

    // 1、绑定采集事件
    // 采集次数,最多允许采集三次
    let number = 0
    $('#colectButton').on('click', function(e) {
        e.preventDefault()
        const origin = window.location.origin
        const pathArr = window.location.pathname?.split('/') || []
        const headers = {
            'accept': 'application/json',
            'content-type': 'application/json',
            'x-api-source': 'pc',
            'x-requested-with': 'XMLHttpRequest',
            'x-shopee-language': 'en',
            'x-csrftoken': getCookie('csrftoken')
        }
        const path = origin + requestPath + '?item_id=' + pathArr[3] + '&shop_id=' + pathArr[2] + '&tz_offset_minutes=480&detail_level=0&'
        if(number >= 3) {
            showModal('Please do not collect frequently')
            return
        }
        toggleLoading(true)
        axios.get(path,{
           headers: headers
        }).then((res) => {
            toggleLoading(false)
            if(res.data.error) {
                showModal('Collection failed')
                return
            }
            const data = res.data.data
            // 存储采集信息
            const form = {}
            form.title = data.item.title
            form.item_id = data.item.item_id
            form.price = data.item.price
            form.currency = data.item.currency
            form.imgs = data.product_images.images.map(img => filePath + img )
            showModal('Collection successful', form)
            console.log('Collected data', form)
            // 将数据上传到后台
            // ......
        }).catch((error) => {
            toggleLoading(false)
            console.error('请求失败:', error);
        }).finally(() => {
            ++number;
        })
    })
})();
