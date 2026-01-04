// ==UserScript==
// @name         【智狐】淘宝、天猫、京东、唯品会隐藏优惠券查询，自动显示历史价格和比价，拒绝虚假价格，让您购买到最优惠的商品,网购省钱小助手
// @name:zh      【智狐】淘宝、天猫、京东、唯品会隐藏优惠券查询，自动显示历史价格和比价，拒绝虚假价格，让您购买到最优惠的商品,网购省钱小助手
// @name:zh-TW   【智狐】淘寶、天貓、京東、唯品會隱藏優惠券查詢，自动显示历史价格和比价，拒絕虛假價格，讓您購買到最優惠的商品,網購省錢小助手
// @namespace    zhCoupon
// @version      1.8.6
// @description  无强制跳转，自动显示淘宝、天猫、京东、唯品会隐藏优惠券，包括双十一和618的价格，让你快速了解商品低价，同款商品各大平台快速自动比价，同时显示比价列表，直接点击即可跳转其他平台，历史价格与比价功能正在开发中...
// @description:zh  无强制跳转，自动显示淘宝、天猫、京东、唯品会隐藏优惠券，包括双十一和618的价格，让你快速了解商品低价，同款商品各大平台快速自动比价，同时显示比价列表，直接点击即可跳转其他平台，历史价格与比价功能正在开发中...
// @description:zh-TW  無強製跳轉，自動顯示淘寶、天貓、京東、唯品會隱藏優惠券，包括雙十一和618的價格，讓你快速了解商品低價，同款商品各大平臺快速自動比價，同時顯示比價列表，直接點擊即可跳轉其他平臺，歷史價格與比價功能正在開發中...
// @author       zhihu
// @run-at       none
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
// @exclude           *://pages.tmall.com/*
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
// @downloadURL https://update.greasyfork.org/scripts/437043/%E3%80%90%E6%99%BA%E7%8B%90%E3%80%91%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E5%94%AF%E5%93%81%E4%BC%9A%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E6%9F%A5%E8%AF%A2%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E5%92%8C%E6%AF%94%E4%BB%B7%EF%BC%8C%E6%8B%92%E7%BB%9D%E8%99%9A%E5%81%87%E4%BB%B7%E6%A0%BC%EF%BC%8C%E8%AE%A9%E6%82%A8%E8%B4%AD%E4%B9%B0%E5%88%B0%E6%9C%80%E4%BC%98%E6%83%A0%E7%9A%84%E5%95%86%E5%93%81%2C%E7%BD%91%E8%B4%AD%E7%9C%81%E9%92%B1%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/437043/%E3%80%90%E6%99%BA%E7%8B%90%E3%80%91%E6%B7%98%E5%AE%9D%E3%80%81%E5%A4%A9%E7%8C%AB%E3%80%81%E4%BA%AC%E4%B8%9C%E3%80%81%E5%94%AF%E5%93%81%E4%BC%9A%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E6%9F%A5%E8%AF%A2%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E5%92%8C%E6%AF%94%E4%BB%B7%EF%BC%8C%E6%8B%92%E7%BB%9D%E8%99%9A%E5%81%87%E4%BB%B7%E6%A0%BC%EF%BC%8C%E8%AE%A9%E6%82%A8%E8%B4%AD%E4%B9%B0%E5%88%B0%E6%9C%80%E4%BC%98%E6%83%A0%E7%9A%84%E5%95%86%E5%93%81%2C%E7%BD%91%E8%B4%AD%E7%9C%81%E9%92%B1%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    //全局对象
    const window = unsafeWindow||window;
    const API_DOMAIN = 'https://api.zhihupe.com';
    //const API_DOMAIN = 'http://127.0.0.1:7001';
    //---------------------------公共方法开始---------------------------
    const Utils = {
        //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
        getValue:function(name, value) {
            if (typeof GM_getValue === "function") {
                return GM_getValue(name, value);
            } else {
                return GM.getValue(name, value);
            }
        },
 
        //兼容 Tampermonkey | Violentmonkey | Greasymonkey 4.0+
        setValue:function(name, value) {
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
        appendStyle(css){
            let style = document.createElement('style');
            if(css instanceof Array){
                style.textContent = css.join('');
            }else{
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
        appendScript:function(type,content) {
            let script = document.createElement('script');
            if(type === 'url'){
                script.src = content;
            }else{
                script.innerHTML = content;
            }
            var docu = document.body;
            docu.appendChild(script);
        },
        getObjectValue(object,path,defValue){
            let obj = object;
            if(typeof path === 'string'){
               const reg = /[^\[\].]+/g;
                path = path.match(reg);
            }
            for(const key of path){
                if(!obj) {
                    return defValue
                }
                obj = obj[key];
            }
            return obj === undefined ? defValue : obj;
        },
        getQueryParam(query,url = ''){
            let search = ''
            if(url&&url.indexOf('?' !== -1)){
                search = url.split('?').slice(1).join();
            }else{
                search = window.location.search.replace('?','')
            }
 
            const queryArr = search.split('&');
            let param = null;
            queryArr.forEach(item => {
                const paramArr = item.split('=');
                if(paramArr[0] === query){
                    param = paramArr[1];
                }
            });
            return param;
        },
        getUrlid(url) {
            var id ="";
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
        monitorElement(attr){
            let attrArr = [];
 
            if(attr instanceof Array&&attr.length > 0){
                attrArr = [...attr];
            }else{
                attrArr.push(attr)
            }
            let element = null;
            return new Promise((resolve, reject) => {
                attrArr.forEach(ele =>{
                    let timer = null,count = 0;
                    element = document.querySelector(ele);
                    timer = setInterval(()=>{
                        if(element){
                            clearInterval(timer);
                            resolve(element);
                        } 
                        if(count > 50){
                            clearInterval(timer);
                            reject('未找到元素节点');
                        } 
                        element = document.querySelector(ele);
                        count ++
                    },200)
                })
            })
        }
    }
    const initData = {
        wenku:{
            codeInputElement:"#code",
            loginCode:"123456",
        },
        coupon:{
            shopGuideGroupText:'捡漏导购Q群',
            shopGuideGroup:'188872170',
            hasCouponBtnText:'领券购买',
            noCouponBtnText:'直接购买',
            noCommissionBtnText:'搜索同款优惠',
            buyUrl:'http://tool.wezhicms.com/coupon/getscan.php',
            tbShortUrlApi:'https://api.shop.xuelg.com/?id={ID}&m=shangpin',
            tbShortUrlApiReqQuery: 'shorturl',
            blackElement:['.coupon-wrap','#toolbar-qrcode'],
            taobao:{
                detailCouponMountElement:['.SecurityPrice--securityPrice--25lJx-X','.Price--root--1CrVGjc'],
                searchGoodsCardElement:['.Content--content--sgSCZ12 .Card--doubleCardWrapper--L2XFE73','.Content--content--sgSCZ12 .Card--doubleCardWrapperMall--uPmo5Bz','.J_TItems .item .photo a']
            },
            tmall:{
                detailCouponMountElement:['.SecurityPrice--securityPrice--25lJx-X','.Price--root--1CrVGjc']
            },
            tmallcs:{
                searchGoodsCardElement:['.feeds-list .feeds-item a']
            },
            jd:{
                detailCouponMountElement:'#J-summary-top',
                searchGoodsCardElement:['.J-goods-list .gl-i-wrap .p-img a','.jSearchListArea .jItem .jPic a']
            }
        }
    }
    class Coupon{
        //优惠券查询地址
        couponApiUrl = '';
        //优惠券展示节点
        initElement = null;
 
        get isHasCoupon(){
            return this.couponInfo?.couponAmount > 0;
        }
        constructor(platform){
            this.platform = platform;
            //优惠券信息
            let couponInfo = {};
            Object.defineProperty(this,'couponInfo',{
                set(value){
                    couponInfo = value;
                    //更新优惠券信息
                    this.updateCouponHtml();
                },
                get(){
                    return couponInfo;
                }
            })    
        }
        /* 
            获取优惠券信息
            return {Promise}
        */
        getCouponInfo(){
            if(!this.goodsId) throw new TypeError('商品ID获取失败');
            if(!this.couponApiUrl) throw new TypeError('优惠券查询链接不存在');
            return new Promise((resolve, reject) => {
                fetch(this.couponApiUrl,{
                    method:'GET',
                    mode:'cors',
                }).then(r=>r.json()).then(response=>{
                    if(response.code === 1){
                        resolve(response.data)
                    }else{
                        reject(new TypeError(response.message))
                    }
                }).catch(err=>{
                    reject(err)
                })
            });
        }
        getTbShortUrl(id){
             const api = initData.coupon.tbShortUrlApi.replace('{ID}',id)
             return new Promise((resolve, reject) => {
                fetch(api,{
                    method:'GET',
                    mode:'cors',
                }).then(r=>r.json()).then(response=>{
                    resolve(Utils.getObjectValue(response,initData.coupon.tbShortUrlApiReqQuery));
                }).catch(err=>{
                    reject(err)
                })
            });
        }
        /* 
        *插入优惠券节点
        * params {ElementObject} 定位元素对象
        * params {String} position 插入位置
        */
        async appendCouponElement(element,position = "afterend"){
            //插入css
            this.css&&Utils.appendStyle(this.css)
            //插入Html
            this.initElement = this.loadingElement||null;
            if(this.initElement)element.insertAdjacentElement(position,this.initElement);
        }
        async updateCouponHtml(){
            if(this.initElement){
                this.initElement.innerHTML = this.couponHtml
                //添加关闭二维码事件
                const qr = document.querySelectorAll('.closeQr');
                if(qr.length > 0){
                    console.log(qr)
                    Array.from(qr).forEach(e=>{e.onclick = ()=> e.parentNode.style.display = 'none'})
                }
            }
        }
        async updateCouponErrorHtml(){
            if(this.initElement)this.initElement.innerHTML = this.couponHtml
        }
    }
    class DetailCoupon extends Coupon{
        css = `
            .zhihu-coupon:hover .zhihu-scan{
                display:block!important;
            }
        `
        get mobileAppText(){
            let text = '手机淘宝';
            switch (this.platform) {
                case 'tmall':
                case 'taobao':
                    text = '手机淘宝'
                    break;
            
                case 'jd':
                    text = '手机京东或微信'
                    break;
            }
            return text;
        }
        get couponHtml(){
            let couponHtml = '<text style="font-size: 20px;">暂未发现优惠券</text>',
                tipsText = initData.coupon.shopGuideGroupText + ':' + initData.coupon.shopGuideGroup,
                btnText = initData.coupon.noCouponBtnText,
                buyLink = `${initData.coupon.buyUrl}?link=${this.couponInfo.shortUrl}&platform=${encodeURIComponent(this.mobileAppText)}`,
                qrcodebox = `<div style="position:fixed;bottom:50px;right:50px;width: 124px; z-index: 999999;">${this.qrcodeHtml}</div>`
            if(this.isHasCoupon){
                couponHtml = `
                    <text style="font-size: 20px;">优惠券:</text>
                    <text style="font-size: 18px; margin-right: 2px;">￥</text>${Math.round(this.couponInfo.couponAmount)}
                `;
                tipsText = `${this.couponInfo.couponStartTime} - ${this.couponInfo.couponEndTime}`;
                btnText = initData.coupon.hasCouponBtnText;
            }else if(this.noCommission){
                couponHtml = '<text style="font-size: 20px;">暂未发现优惠券</text>';
                buyLink = '';
                btnText = initData.coupon.noCommissionBtnText;
                qrcodebox = '';
            }
            return `
                    <div style="width: 279px; color: rgb(255, 255, 255); padding-left: 20px; box-sizing: border-box;">
                        <div style="font-size: 28px; line-height: 28px; font-weight: 900; white-space: nowrap;">
                           ${couponHtml}
                        </div>
                        <div style="margin-top: 5px;">${tipsText}</div>
                    </div>
                    <div style="text-align: center; width: calc(100% - 279px); font-size: 20px; color: rgb(255, 255, 255); font-weight: bold; letter-spacing: 1px; cursor: pointer;">
                        <a target="_blank" href="${buyLink}" style="text-decoration: none; color: rgb(255, 255, 255);">${btnText}</a>
                    </div>
                    <div class="zhihu-scan" style="position: absolute; display: block; right: 426px; padding-right: 5px; top: -10px; width: 124px; z-index: 999999;">
                        ${this.qrcodeHtml}
                    </div>
                    ${qrcodebox}
            `
        }
        get loadingElement(){
            const div = document.createElement('div');
            div.classList = 'zhihu-coupon';
            div.style = 'background-image: url(https://gw.alicdn.com/tfs/TB16d.1ykPoK1RjSZKbXXX1IXXa-665-115.png); position: relative; font-family: HelveticaNeue-Bold, "Helvetica Neue"; width: 426px; height: 75px; background-size: 100%, 100%; background-repeat: no-repeat; margin: 10px 0px 10px 10px; display: flex; align-items: center;'
            div.innerHTML = `
                <div style="width: 279px; color: rgb(255, 255, 255); padding-left: 20px; box-sizing: border-box;">
                    <div style="font-size: 28px; line-height: 28px; font-weight: 900; white-space: nowrap;">
                        <text style="font-size: 20px;">正在搜索优惠券···</text>
                    </div>
                </div>
            `;
            return div;
        }
        get qrcodeHtml(){
            if(!this.couponInfo?.shortUrl) return '';
            return `
                <i class="closeQr" style="position: absolute;right: -2px;top: -2px;cursor: pointer;"><svg t="1712718308343" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1614" width="18" height="18"><path d="M512 960C264.97 960 64 759.03 64 512S264.97 64 512 64c247.04 0 448 200.97 448 448S759.04 960 512 960z m0-861.54C283.98 98.46 98.46 283.98 98.46 512S283.98 925.54 512 925.54 925.54 740.02 925.54 512 740.02 98.46 512 98.46z" fill="#666666" p-id="1615"></path><path d="M353.61 687.62c-4.41 0-8.82-1.68-12.18-5.05-6.73-6.73-6.73-17.63 0-24.37l316.78-316.78c6.73-6.73 17.63-6.73 24.37 0s6.73 17.63 0 24.37L365.79 682.57a17.14 17.14 0 0 1-12.18 5.05z" fill="#666666" p-id="1616"></path><path d="M670.39 687.62c-4.41 0-8.82-1.68-12.18-5.05L341.43 365.79c-6.73-6.73-6.73-17.63 0-24.37s17.63-6.73 24.37 0L682.58 658.2c6.73 6.73 6.73 17.63 0 24.37a17.18 17.18 0 0 1-12.19 5.05z" fill="#666666" p-id="1617"></path></svg></i>
                <div style="text-align: center; padding: 12px 5px 8px; background: rgb(255, 255, 255); border: 1px solid rgba(0, 0, 0, 0.08); border-radius: 12px;">
                    <div style="margin: 0px auto; width: 100px;">
                        <img src="http://v.zhihupe.com/enQrcode?url=${this.couponInfo.shortUrl}" style="width: 100px;">
                    </div>
                    <div style="margin-top: 4px;">${this.mobileAppText}扫一扫，享优惠</div>
                </div>
            `
        }
        constructor(platform){
            super(platform);
            this.addCouponElement();
        }
        async addCouponElement(){
            try {
                //获取商品ID和优惠券API链接
                if(this.platform == 'taobao'||this.platform == 'tmall'){
                    this.goodsId = Utils.getQueryParam('id')||null;
                    const shortUrl = await this.getTbShortUrl(this.goodsId);
                    console.log(shortUrl)
                    this.couponApiUrl = API_DOMAIN + '/api/coupon/info?platform=taobao' + '&id=' + shortUrl
                }else if(this.platform === 'jd'){
                    this.goodsId = Utils.getUrlid(window.location.href)||null;
                    this.couponApiUrl = API_DOMAIN + '/api/coupon/info?platform=jd' + '&id=' + this.goodsId;
                }
                 //添加优惠券元素
                const attr = initData.coupon[this.platform]['detailCouponMountElement'];
                console.log(initData.coupon[this.platform])
                const element = await Utils.monitorElement(attr);
                this.appendCouponElement(element);
                //获取商品优惠券
                this.couponInfo = await this.getCouponInfo();
            } catch (error) {
                //添加无佣金状态
                this.noCommission = true;
                //更新无佣金html
                this.updateCouponErrorHtml()
                console.log(error)
            }
        }
    }
    class SearchCoupon extends Coupon{
        get couponHtml(){
            let html = `<span style="background: rgb(0 0 0 / 51%);border-radius: 999px;padding: 5px 10px;color: #fff;">暂无优惠</span>`
            if(this.isHasCoupon){
                html = `<span style="background: rgb(253 2 57);border-radius: 999px;padding: 5px 10px;color: #fff;">有券:减${this.couponInfo.couponAmount}元</span>`
            }
            return html
        }
        get loadingElement(){
            const div = document.createElement('div');
            div.style = 'position: absolute;top: 10px;right: 10px;z-index: 99999999;font-size: 12px;';
            div.innerHTML = `
                <span style="background: rgb(0 0 0 / 51%);border-radius: 999px;padding: 5px 10px;color: #fff;">正在搜索优惠</span>
            `;
            return div;
        }
        constructor(element,platform){
            super(platform);
            this.addCouponElement(element)
        }
        async addCouponElement(element){
            try {
                 //获取商品ID和优惠券API链接
                if(this.platform == 'taobao'||this.platform == 'tmallcs'){
                    const href = element.getAttribute('href');
                    this.goodsId = Utils.getQueryParam('id',href)||null;
                    const shortUrl = await this.getTbShortUrl(this.goodsId);
                    console.log(shortUrl)
                    this.couponApiUrl = API_DOMAIN + '/api/coupon/search?platform=taobao' + '&id=' + shortUrl
                }else if(this.platform === 'jd'){
                    const href = element.getAttribute('href');
                    this.goodsId = Utils.getUrlid(href)||null;
                    this.couponApiUrl = API_DOMAIN + '/api/coupon/search?platform=jd' + '&id=' + this.goodsId;
                }
                element.style.position = 'relative';
                //添加优惠券节点
                this.appendCouponElement(element,'beforeend');
                //获取商品优惠券
                this.couponInfo = await this.getCouponInfo();
            } catch (error) {
                console.log(error)
                 //更新无佣金html
                 this.updateCouponErrorHtml()
                 console.log(error.message)
            }
        }
    }
    async function getInitData(){
        const request = ()=>{
            return new Promise((resolve, reject) => {
                fetch(API_DOMAIN + '/api/coupon/init',{
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
        const _initData = await request();
 
        _initData&&(initData.coupon = {..._initData});
    } 
    async function detailCouponInit(platform = 'taobao'){
        
        await getInitData();
 
        new DetailCoupon(platform);
 
        //移除节点
        if(initData.coupon.blackElement instanceof Array && initData.coupon.blackElement.length > 0){
            const blackElement = initData.coupon.blackElement;
            blackElement.forEach(item => {
                Utils.monitorElement(item).then(selector=>{
                    selector.remove()
                })  
            })
        }
    }
    async function searchCouponInit(platform = 'taobao'){
 
        await getInitData();
 
        if(!(initData.coupon?.[platform]?.searchGoodsCardElement instanceof Array)||initData.coupon?.[platform]?.searchGoodsCardElement.length === 0) return
        
        //class数组
        const clss = initData.coupon[platform].searchGoodsCardElement;
        //监听商品卡片
        setInterval(()=>{
            //遍历class数组
            for (let i = 0; i < clss.length; i++) {
                const elements = document.querySelectorAll(clss[i]);
                if(elements&&elements.length > 0){
                    Array.from(elements).forEach(element=>{
                        if(element.classList.contains('zhihu-coupon-added')) return;
                        //添加class标记
                        element.classList.add('zhihu-coupon-added');
 
                        new SearchCoupon(element,platform);
                    })
                }
            }
        },1500)   
    }
    async function zhihuWenkuInit(){
         sessionStorage.setItem('zhihu_sign',true);
    }
    //网址匹配
    const siteMap = [
        {
            match:['item.taobao.com/item.htm.*'],
            platform:'taobao',
            initFunc:detailCouponInit
        },
        {
            match:['detail.tmall.com/item.htm.*','detail.tmall.hk/hk/item.htm.*'],
            platform:'tmall',
            initFunc:detailCouponInit
        },
        {
            match:['item.jd.com/.*','npcitem.jd.hk/.*','item.yiyaojd.com/.*'],
            platform:'jd',
            initFunc:detailCouponInit
        },
        {
            match:['s.taobao.com/search.*','suning.tmall.com/category.*'],
            platform:'taobao',
            initFunc:searchCouponInit
        },
        {
            match:['pages.tmall.com/wow/an/cs/search.*'],
            platform:'tmallcs',
            initFunc:searchCouponInit
        },
        {
            match:['search.jd.com/Search.*','list.jd.com/list.html.*','mall.jd.com/view_search.*'],
            platform:'jd',
            initFunc:searchCouponInit
        },
        {
            match:['wenku.zhihupe.com/tool/index.*','wenku.zhihupe.com/#.*'],
            initFunc:zhihuWenkuInit
        }
    ]
 
    //生成正则表达式
    function createReg(arr){
        return new RegExp(arr.join('|'))
    }
 
    //根据网址匹配
    for (const site of siteMap) {
        let reg = createReg(site.match)
        let host = window.location.hostname + window.location.pathname
        let result = reg.test(host)
        if(result){
            let platform = site.platform||'';
            return site.initFunc(platform);
        }
    }
    // Your code here...
})();