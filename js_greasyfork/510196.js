// ==UserScript==
// @name             网购省钱小助手,不花冤枉钱：自动查询淘宝、天猫、天猫国际、京东、京东国际等隐藏的大额优惠券，简洁无广告，有无优惠券一目了然，持续维护更新，请放心使用！
// @name:zh          网购省钱小助手,不花冤枉钱：自动查询淘宝、天猫、天猫国际、京东、京东国际等隐藏的大额优惠券，简洁无广告，有无优惠券一目了然，持续维护更新，请放心使用！
// @name:zh-TW       網購省錢小助手,不花冤枉錢：自動查詢淘寶、天貓、天貓國際、京東、京東國際等隱藏的大額優惠券，簡潔無廣告，有無優惠券一目了然，持續維護更新，請放心使用！
// @namespace        couponZhihu
// @version           1.0
// @description       或许是最简洁好用的购物小助手啦~ 自动显示京东(jd.com)、淘宝(taobao.com)、天猫(tmall.com)、聚划算、天猫超市、天猫国际(tmall.hk)、京东国际(jd.hk)、京东图书、京东电子书、京东工业品、京东大药房(yiyaojd.com)隐藏优惠券。不止让您省钱开心购物，更可以告别虚假降价，以最优惠的价格，把宝贝抱回家。
// @description:zh    或许是最简洁好用的购物小助手啦~ 自动显示京东(jd.com)、淘宝(taobao.com)、天猫(tmall.com)、聚划算、天猫超市、天猫国际(tmall.hk)、京东国际(jd.hk)、京东图书、京东电子书、京东工业品、京东大药房(yiyaojd.com)隐藏优惠券。不止让您省钱开心购物，更可以告别虚假降价，以最优惠的价格，把宝贝抱回家。
// @description:zh-TW 或許是最簡潔好用的購物小助手啦~ 自動顯示京東(jd.com)、淘寶(taobao.com)、天貓(tmall.com)、聚劃算、天貓超市、天貓國際(tmall.hk)、京東國際(jd.hk)、京東圖書、京東電子書、京東工業品、京東大藥房(yiyaojd.com)隱藏優惠券格。不止讓您省錢開心購物，更可以告別虛假降價，以最優惠的價格，把寶貝抱回家。
// @author            智狐
// @license      End-User License Agreement
// @match             *://*.taobao.com/*
// @match             *://*.tmall.com/*
// @match             *://chaoshi.detail.tmall.com/*
// @match             *://*.tmall.hk/*
// @match             *://*.liangxinyao.com/*
// @match             *://*.jd.com/*
// @match             *://*.jd.hk/*
// @match             *://*.yiyaojd.com/*
// @match             *://*.vip.com/*
// @match             *://*.vipglobal.hk/*
// @exclude           *://login.taobao.com/*
// @exclude           *://login.tmall.com/*
// @exclude           *://uland.taobao.com/*
// @exclude           *://wq.jd.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @antifeature  	  referral-link 【此提示为GreasyFork代码规范要求含有查券功能的脚本必须添加，请知悉！】
// @connect      api.zhihupe.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/510196/%E7%BD%91%E8%B4%AD%E7%9C%81%E9%92%B1%E5%B0%8F%E5%8A%A9%E6%89%8B%2C%E4%B8%8D%E8%8A%B1%E5%86%A4%E6%9E%89%E9%92%B1%EF%BC%9A%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E5%A4%A9%E7%8C%AB%E5%9B%BD%E9%99%85%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E4%BA%AC%E4%B8%9C%E5%9B%BD%E9%99%85%E7%AD%89%E9%9A%90%E8%97%8F%E7%9A%84%E5%A4%A7%E9%A2%9D%E4%BC%98%E6%83%A0%E5%88%B8%EF%BC%8C%E7%AE%80%E6%B4%81%E6%97%A0%E5%B9%BF%E5%91%8A%EF%BC%8C%E6%9C%89%E6%97%A0%E4%BC%98%E6%83%A0%E5%88%B8%E4%B8%80%E7%9B%AE%E4%BA%86%E7%84%B6%EF%BC%8C%E6%8C%81%E7%BB%AD%E7%BB%B4%E6%8A%A4%E6%9B%B4%E6%96%B0%EF%BC%8C%E8%AF%B7%E6%94%BE%E5%BF%83%E4%BD%BF%E7%94%A8%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/510196/%E7%BD%91%E8%B4%AD%E7%9C%81%E9%92%B1%E5%B0%8F%E5%8A%A9%E6%89%8B%2C%E4%B8%8D%E8%8A%B1%E5%86%A4%E6%9E%89%E9%92%B1%EF%BC%9A%E8%87%AA%E5%8A%A8%E6%9F%A5%E8%AF%A2%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E5%A4%A9%E7%8C%AB%E5%9B%BD%E9%99%85%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E4%BA%AC%E4%B8%9C%E5%9B%BD%E9%99%85%E7%AD%89%E9%9A%90%E8%97%8F%E7%9A%84%E5%A4%A7%E9%A2%9D%E4%BC%98%E6%83%A0%E5%88%B8%EF%BC%8C%E7%AE%80%E6%B4%81%E6%97%A0%E5%B9%BF%E5%91%8A%EF%BC%8C%E6%9C%89%E6%97%A0%E4%BC%98%E6%83%A0%E5%88%B8%E4%B8%80%E7%9B%AE%E4%BA%86%E7%84%B6%EF%BC%8C%E6%8C%81%E7%BB%AD%E7%BB%B4%E6%8A%A4%E6%9B%B4%E6%96%B0%EF%BC%8C%E8%AF%B7%E6%94%BE%E5%BF%83%E4%BD%BF%E7%94%A8%EF%BC%81.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //全局对象
    // const window = unsafeWindow || window;
      const API_DOMAIN = '//coupon.zhihupe.com';
   // const API_DOMAIN = 'http://127.0.0.1:7001';

    //---------------------------公共方法开始---------------------------
    const Utils = {
        //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
        getValue: function (name, value) {
            if (typeof GM_getValue === "function") {
                return GM_getValue(name, value);
            } else {
                return GM.getValue(name, value);
            }
        },

        //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
        setValue: function (name, value) {
            if (typeof GM_setValue === "function") {
                GM_setValue(name, value);
            } else {
                GM.setValue(name, value);
            }
        },
        /**
         * 添加css
         * @params {String||Array} css - css样式
         */
        appendStyle(css) {
            let style = document.createElement('style');
            if (css instanceof Array) {
                style.textContent = css.join('');
            } else {
                style.textContent = css
            }
            style.type = 'text/css';
            let doc = document.head || document.documentElement;
            doc.appendChild(style);
        },
        /**
         * 添加js文件
         * @params {String} url - js文件地址
         */
        appendScript: function (type, content) {
            let script = document.createElement('script');
            if (type === 'url') {
                script.src = content;
            } else {
                script.innerHTML = content;
            }
            var docu = document.body;
            docu.appendChild(script);
        },
        getObjectValue(object, path, defValue) {
            let obj = object;
            if (typeof path === 'string') {
                const reg = /[^\[\].]+/g;
                path = path.match(reg);
            }
            for (const key of path) {
                if (!obj) {
                    return defValue
                }
                obj = obj[key];
            }
            return obj === undefined ? defValue : obj;
        },
        getQueryParam(query, url = '') {
            let search = ''
            if (url && url.indexOf('?' !== -1)) {
                search = url.split('?').slice(1).join();
            } else {
                search = window.location.search.replace('?', '')
            }

            const queryArr = search.split('&');
            let param = null;
            queryArr.forEach(item => {
                const paramArr = item.split('=');
                if (paramArr[0] === query) {
                    param = paramArr[1];
                }
            });
            return param;
        },
        getUrlid(url) {
            var id = "";
            if (url.indexOf("?") != -1) {
                url = url.split("?")[0]
            }
            if (url.indexOf("#") != -1) {
                url = url.split("#")[0]
            }
            var text = url.split("/");
            id = text[text.length - 1];
            id = id.replace(".html", "");
            return id
        },
        monitorElement(attr) {
            let attrArr = [];

            if (attr instanceof Array && attr.length > 0) {
                attrArr = [...attr];
            } else {
                attrArr.push(attr)
            }
            let element = null;
            return new Promise((resolve, reject) => {
                attrArr.forEach(ele => {
                    let timer = null, count = 0;
                    element = document.querySelector(ele);
                    timer = setInterval(() => {
                        if (element) {
                            clearInterval(timer);
                            resolve(element);
                        }
                        if (count > 50) {
                            clearInterval(timer);
                            reject('未找到元素节点');
                        }
                        console.log(1)
                        element = document.querySelector(ele);
                        count++
                    }, 200)
                })
            })
        }
    }
    const initData = {
        "basicHasCouponBtnText": "点击领取优惠券",
        "basicNoCommissionBtnText": "搜索同款优惠",
        "basicNoCouponBtnText": "立即购买",
        "basicRedirectApi": "http://api.shop.xuelg.com/quan?url={URL}",
        "basicQqGroup": "",
        "basicQqGroupUrl": "",
        "jdDetailCouponMountElement": [
            ".summary-price.J-summary-price"
        ],
        "jdDetailCouponMountElementPosition": 'afterend',
        "jdListCouponMountElement": [
            ".more2_lk",
            ".J-goods-list .gl-i-wrap .p-img a",
            ".productList_goods-list__wMdJe .productList_gl-item__kt547 .productList_p-img__FGbqQ a"
        ],
        "jdGoodsTitleElement":[
            ".sku-name",
        ],
        "jdSearchUrl":"//gouwu.zhihupe.com/?r=/l/jdlist&kw={KEYWORD}&origin_id=&sort=0",
        "jdDetailIsOpenApi": false,
        "jdDetailApiUrl": "http:www.baidu.com",
        "jdDetailApiResultIndex": "http:www.baidu.com",
        "jdDetailApiResultGoodsIdType": "itemId",
        "jdListIsOpenApi": false,
        "jdListApiUrl": "http:www.baidu.com",
        "jdListApiResultIndex": "http:www.baidu.com",
        "jdListApiResultGoodsIdType": "itemId",

        "taobaoDetailCouponMountElement": [
            ".Actions--root--hwEujgc",
            ".footWrap--LePfCZWd"
        ],
        "taobaoDetailCouponMountElementPosition": 'afterbegin',
        "taobaoListCouponMountElement": [
            '.item-link', 
            '.Content--content--sgSCZ12 .Card--doubleCardWrapper--L2XFE73',
            '.item .photo .J_TGoldData', //店铺分类页
            '.feeds-item a',// 天猫超市分类页
        ],
        "taobaoGoodsTitleElement":[
            "h1.mainTitle--O1XCl8e2",
            "h1.ItemHeader--mainTitle--3CIjqW5"
        ],
        "taobaoSearchUrl":"//gouwu.zhihupe.com/?r=/l&kw={KEYWORD}&origin_id=&sort=0",
        "taobaoDetailIsOpenApi": true,
        "taobaoDetailApiUrl": "https://api.shop.xuelg.com/?id={ID}&m=shangpin",
        "taobaoDetailApiResultIndex": "shorturl",
        "taobaoDetailApiResultGoodsIdType": "link",
        "taobaoListIsOpenApi": false,
        "taobaoListApiUrl": "https://api.shop.xuelg.com/?id={ID}&m=shangpin",
        "taobaoListApiResultIndex": "shorturl",
        "taobaoListApiResultGoodsIdType": "link",
    }

    class Coupon {
        initElement = null;
        // 平台
        platform = '';
        //优惠券查询地址
        couponApiUrl = '';
        // 是否开启第三方API
        isOpenApi = false;
        //第三方API地址
        apiUrl = '';
        // 第三方API返回索引
        apiResultIndex = null;
        // 第三方API返回商品ID格式
        apiResultGoodsIdType = 'id';
        constructor(platform) {
            this.platform = platform;
        }
        getParamUrl(id) {
            let paramUrl = `?platform=${this.platform}&id=${id}`;

            if (!this.isOpenApi || !this.apiUrl || !this.apiResultIndex || !this.apiResultGoodsIdType) {
                paramUrl += '&type=id';
                return Promise.resolve(paramUrl);
            }

            return new Promise((resolve, reject) => {
                const api = this.apiUrl.replace('{ID}', id);
                fetch(api, {
                    method: 'GET',
                    mode: 'cors',
                }).then(r => r.json()).then(response => {
                    const data = Utils.getObjectValue(response, this.apiResultIndex);
                    if (data) {
                        paramUrl += `&type=${this.apiResultGoodsIdType}&${this.apiResultGoodsIdType}=${data}`;
                    } else {
                        paramUrl += '&type=id';
                    }
                    resolve(paramUrl);
                }).catch(err => {
                    paramUrl += '&type=id';
                    resolve(paramUrl);
                })
            })
        }
        /* 
            获取优惠券信息
            return {Promise}
        */
        getCouponInfo() {
            if (!this.couponApiUrl) throw new TypeError('优惠券查询地址不存在');
            return new Promise((resolve, reject) => {
                fetch(this.couponApiUrl, {
                    method: 'GET',
                    mode: 'cors',
                }).then(r => r.json()).then(response => {
                    console.log(response)
                    if (response.code === 1) {
                        resolve(response.data)
                    } else {
                        reject(new TypeError(response.message))
                    }
                }).catch(err => {
                    reject(err)
                })
            });
        }
    }
    class DetailCoupon extends Coupon {
        couponMountElement = '';
        couponMountElementPosition = 'afterbegin';
        goodsTitleElememt = [];
        searchUrl = '';
        constructor(platform) {
            super(platform);
            switch (platform) {
                case 'taobao':
                    this.couponMountElement = initData.taobaoDetailCouponMountElement||'';
                    this.couponMountElementPosition = initData.taobaoDetailCouponMountElementPosition||'afterbegin';
                    this.goodsTitleElememt = initData.taobaoGoodsTitleElement;
                    this.searchUrl = initData.taobaoSearchUrl;
                    this.isOpenApi = initData.taobaoDetailIsOpenApi||false;
                    this.apiUrl = initData.taobaoDetailApiUrl||'';
                    this.apiResultIndex = initData.taobaoDetailApiResultIndex||'';
                    this.apiResultGoodsIdType = initData.taobaoDetailApiResultGoodsIdType||'';
                    break;
                case 'jd':
                    this.couponMountElement = initData.jdDetailCouponMountElement||'';
                    this.couponMountElementPosition = initData.jdDetailCouponMountElementPosition||'afterbegin';
                    this.goodsTitleElememt = initData.jdGoodsTitleElement;
                    this.searchUrl = initData.jdSearchUrl;
                    this.isOpenApi = initData.jdDetailIsOpenApi||false;
                    this.apiUrl = initData.jdDetailApiUrl||'';
                    this.apiResultIndex = initData.jdDetailApiResultIndex||'';
                    this.apiResultGoodsIdType = initData.jdDetailApiResultGoodsIdType||'';
                    break;
            }
            console.log('constructor', platform)
            this.addCouponElement();
        }
        async addCouponElement() {
            let couponInfo = null;
            try {
                let goodsId = ''
                //获取商品ID和优惠券API链接
                if (this.platform == 'taobao') {
                    goodsId = Utils.getQueryParam('id') || null;
                } else if (this.platform === 'jd') {
                    goodsId = Utils.getUrlid(window.location.href) || null;
                }
                console.log(goodsId)
                // 拼接请求URL
                const paramUrl = await this.getParamUrl(goodsId);
                this.couponApiUrl = API_DOMAIN + '/api/script/detail' + paramUrl;
                // 获取优惠券信息
                couponInfo = await this.getCouponInfo();
                // 如果是京东，另外添加领券按钮
                if(this.platform === 'jd'){
                    this.addJdBtnElement(couponInfo);
                }
               
            } catch (error) {
                console.log(error);
            }
            const element = await Utils.monitorElement(this.couponMountElement);
            this.appendCouponHtml(couponInfo, element);

        }

        async appendCouponHtml(couponInfo = null, element) {
            let tips = '点击右侧按钮搜索同款商品优惠👉',
                btnLink = '',
                btnText = initData.basicNoCommissionBtnText,
                mainHtml = '<div style="padding:10px 0;color:#FF0036;font-size:28px;font-weight:bold;text-align: center;"> 暂未发现可用优惠券 </div>'
            if (!couponInfo||!couponInfo.shortUrl) {
                // 获取商品标题
                const title = (await Utils.monitorElement(this.goodsTitleElememt)).innerText||'';
                if(!this.searchUrl||this.searchUrl.indexOf('{KEYWORD}')<0){
                    throw new Error('this.searchUrl未设置或this.searchUrl不包含{KEYWORD}替换字段')
                }
                btnLink = this.searchUrl.replace('{KEYWORD}',encodeURIComponent(title));
                console.log(title)
            } else if (couponInfo && couponInfo.hasCoupon) {
                if (this.platform === 'taobao') {
                    tips = '👇赶紧使用手淘APP扫码领取吧'
                } else if (this.platform === 'jd') {
                    tips = '👇使用京东APP或微信扫码领取吧'
                }
                btnLink = `${API_DOMAIN}/api/script/coupon?url=${encodeURIComponent(couponInfo.shortUrl)}&platform=${this.platform}`;
                btnText = initData.basicHasCouponBtnText;
                mainHtml = `
                    <div style="display:flex;align-items: flex-start;">
                        <img style="width:100px;height:100px" src="${API_DOMAIN}/api/script/qrcode?text=${couponInfo.shortUrl}">
                        <div style="margin-left:10px"> 
                            <div style="color:#FF0036;font-size:28px;line-height: 36px;font-weight:bold;">${couponInfo.couponInfo}</div>
                            <div style="color:#333;margin-top:8px;font-size:12px;line-height: 1;">使用时间： ${couponInfo.couponEndTime} 到期 </div>
                            <div style="color:#333;margin-top:8px;font-size:12px;line-height: 1;">券值：￥${couponInfo.couponAmount} </div>
                            <div style="color:#333;margin-top:8px;font-size:12px;line-height: 1;">券后价：￥${couponInfo.actualPrice}</div>
                        </div>
                    </div>
                `
            } else if (couponInfo&&couponInfo.shortUrl) {
                if (this.platform === 'taobao') {
                    tips = '👇赶紧使用手淘APP扫码购买吧'
                } else if (this.platform === 'jd') {
                    tips = '👇使用京东APP或微信扫码购买吧';
                     // 添加跳转
                     if(location.href.indexOf(couponInfo.sign) == -1){
                        const url = initData.basicRedirectApi.replace('{URL}',encodeURIComponent(couponInfo.longUrl))
                        window.location.replace(url);
                    }
                }
                btnLink = `${API_DOMAIN}/api/script/coupon?url=${encodeURIComponent(couponInfo.shortUrl)}&platform=${this.platform}`;
                btnText = initData.basicNoCouponBtnText;
                mainHtml = `
                    <div style="display:flex;align-items: center;">
                        <img style="width:100px;height:100px" src="${API_DOMAIN}/api/script/qrcode?text=${couponInfo.shortUrl}">
                        <div style="margin-left:10px"> 
                           <div style="padding:10px 0;color:#FF0036;font-size:28px;font-weight:bold;text-align: center;"> 暂未发现可用优惠券 </div>
                        </div>
                    </div>
                `
            }
            const div = document.createElement('div');
            div.style = 'width:450px;height:auto;border-radius:16px;margin-bottom:10px;font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif;';
            div.innerHTML = `
                <div style="display:flex;justify-content: space-between;align-items: center;border-radius: 16px 16px 0 0;background:linear-gradient(90deg, #FF7C54, #FE293D);height:45px;width:100%;padding:0 16px;box-sizing: border-box;">
                    <span style="font-size:16px;color:#fff">${tips}</span>
                    <span id="zhihuCouponBtn" style="color: #FF0036;background: #fff;padding: 5px 10px;border-radius: 6px;font-size: 14px;font-weight: bold;cursor:pointer">${btnText}</span>
                </div>
                <div style="width:100%;padding:10px 16px;box-sizing: border-box;background:#fff;border-radius:0 0 16px 16px;border: 1px solid #f0f3f5;">
                    ${mainHtml}
                </div>
            `;
            console.log(div)
            element.insertAdjacentElement(this.couponMountElementPosition, div);
            // 跳转领券页
            document.querySelector('#zhihuCouponBtn').onclick = () => {
                window.open(btnLink)
            }
        }
        async addJdBtnElement(couponInfo){
            const a = document.createElement('a');
            a.classList.add('btn-lg');
            a.style = 'background-color: rgb(253 2 57);color: #fff;font-weight:700';
            if(couponInfo.hasCoupon){
                a.href =  initData.basicRedirectApi.replace('{URL}',encodeURIComponent(couponInfo.longUrl))
            }else{
                a.href = `${API_DOMAIN}/api/script/coupon?url=${encodeURIComponent(couponInfo.shortUrl)}&platform=${this.platform}`
            }
            a.target="_blank";
            a.innerText = '领券下单';
            document.querySelector("#choose-btns").insertAdjacentElement('beforeend', a);
        }
    }
    class ListCoupon extends Coupon {
        initElement = null;

        constructor(element, platform) {
            super(platform);
            switch (platform) {
                case 'taobao':
                    this.isOpenApi = initData.taobaoListIsOpenApi||false;
                    this.apiUrl = initData.taobaoListApiUrl||'';
                    this.apiResultIndex = initData.taobaoListApiResultIndex||'';
                    this.apiResultGoodsIdType = initData.taobaoListApiResultGoodsIdType||'';
                    break;
                case 'jd':
                    this.isOpenApi = initData.jdListIsOpenApi||false;
                    this.apiUrl = initData.jdListApiUrl||'';
                    this.apiResultIndex = initData.jdListApiResultIndex||'';
                    this.apiResultGoodsIdType = initData.jdListApiResultGoodsIdType||'';
                    break;
            }
            this.addCouponElement(element);
        }
        async addCouponElement(element) {
            try {
                let goodsId = ''
                //获取商品ID和优惠券API链接
                if (this.platform == 'taobao' || this.platform == 'tmallcs') {
                    const href = element.getAttribute('href');
                    goodsId = Utils.getQueryParam('id', href) || null;

                } else if (this.platform === 'jd') {
                    const href = element.getAttribute('href');
                    goodsId = Utils.getUrlid(href) || null;
                }
                // 添加查询提示
                element.style.position = 'relative';
                this.appendInitCouponHtml(element, 'beforeend');
                // 拼接请求URL
                const paramUrl = await this.getParamUrl(goodsId);
                this.couponApiUrl = API_DOMAIN + '/api/script/search' + paramUrl;
                // 获取优惠券信息
                const result = await this.getCouponInfo();
                //添加优惠券节点
                this.appendCouponHtml(result);
            } catch (error) {
                console.log('error', error)
                this.appendCouponHtml()
            }
        }
        appendInitCouponHtml(element, position = "beforeend") {
            const div = document.createElement('div');
            div.style = 'position: absolute;top: 10px;right: 10px;z-index: 99999999;font-size: 12px;';
            div.innerHTML = `
                <span style="background: rgba(0, 0, 0, 0.4);border-radius: 6px;padding: 5px 10px;color: #fff;">正在搜索优惠</span>
            `;
            this.initElement = div;
            element.insertAdjacentElement(position, this.initElement);
        }
        appendCouponHtml(result = null) {
            let html = `<span style="background: rgba(0, 0, 0, 0.4);border-radius: 6px;padding: 5px 10px;color: #fff;">暂无优惠</span>`
            if (result && result.hasCoupon) {
                html = `<span style="background: rgb(253 2 57);border-radius: 6px;padding: 5px 10px;color: #fff;">有券:减${result.couponAmount}元</span>`
            }
            if (this.initElement) this.initElement.innerHTML = html
        }

    }
    async function getInitData(){
        const request = ()=>{
            return new Promise((resolve, reject) => {
                fetch(API_DOMAIN + '/api/script/init',{
                    method:'GET',
                    mode:'cors',
                }).then(r=>r.json()).then(response=>{
                    if(response.code === 1){
                        resolve(response.data)
                    }else{
                        resolve(null)
                    }
                }).catch(err=>{
                    resolve(null)
                })
            })
        }
        // 查询是否有缓存
        const key = 'scriptInitData'
        const cache = sessionStorage.getItem(key);
        let  _initData = {};
        if(cache){
            _initData = JSON.parse(cache)
        }else{
            const data = await request();
            data&& Object.assign(_initData,data);
            // 存储
            sessionStorage.setItem(key,JSON.stringify(_initData));
        }
        Object.assign(initData,_initData);
    } 
    async function detailCouponInit(platform) {
        console.log(platform)
        await getInitData();
        new DetailCoupon(platform);

        //移除节点
        // if(initData.coupon.blackElement instanceof Array && initData.coupon.blackElement.length > 0){
        //     const blackElement = initData.coupon.blackElement;
        //     blackElement.forEach(item => {
        //         Utils.monitorElement(item).then(selector=>{
        //             selector.remove()
        //         })  
        //     })
        // }
    }

    async function listCouponInit(platform) {

        await getInitData();

        let clss = '';
        if (platform === 'taobao') {
            clss = initData.taobaoListCouponMountElement;
        } else if (platform === 'jd') {
            clss = initData.jdListCouponMountElement;
        }
        console.log(clss)
        if (!(clss instanceof Array) || clss.length === 0) return
        //监听商品卡片
        setInterval(() => {
            //遍历class数组
            for (let i = 0; i < clss.length; i++) {
                const elements = document.querySelectorAll(clss[i]);
                if (elements && elements.length > 0) {
                    Array.from(elements).forEach(element => {
                        if (element.classList.contains('zhihu-coupon-added')) return;
                        //添加class标记
                        element.classList.add('zhihu-coupon-added');
                        new ListCoupon(element, platform);
                    })
                }
            }
        }, 1000)
    }

    //网址匹配
    const siteMap = [
        {
            match: ['www.taobao.com', 'www.tmall.com', 's.taobao.com/search.*', 'suning.tmall.com/category.*', '.*.tmall.com/search.htm.*', 'pages.tmall.com/wow/an/cs/search.*'],
            platform: 'taobao',
            initFunc: listCouponInit
        },
        {
            match: ['www.jd.com','search.jd.com/search.*','search.jd.hk/search.*','list.jd.com/list.*'],
            platform: 'jd',
            initFunc: listCouponInit
        },
        {
            match: ['item.taobao.com/item.htm.*', 'detail.tmall.com/item.htm.*', 'detail.tmall.hk/hk/item.htm.*'],
            platform: 'taobao',
            initFunc: detailCouponInit
        },
        {
            match: ['item.jd.com/.*', 'npcitem.jd.hk/.*','item.yiyaojd.com/.*'],
            platform: 'jd',
            initFunc: detailCouponInit
        },
    ]

    //生成正则表达式
    function createReg(arr) {
        return new RegExp(arr.join('|'))
    }

    //根据网址匹配
    for (const site of siteMap) {
        let reg = createReg(site.match)
        let host = window.location.hostname + window.location.pathname
        let result = reg.test(host.toLowerCase())
        if (result) {
            console.log(host, result)
            let platform = site.platform || '';
            site.initFunc(platform);
        }
    }
    // Your code here...
})();