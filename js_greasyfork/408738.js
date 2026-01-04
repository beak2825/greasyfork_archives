// ==UserScript==
// @name         中国社会扶贫网|广西特色馆 增强工具
// @namespace    3156289387@qq.com
// @version      0.9
// @description  目的：令工作更加便捷，完善官网不合理的部分：1、搜索栏追加商品ID直达功能，输入商品的ID，可以直达商品页面；2、添加三个二级目录到顶部导航，弥补商品页面进去了就出不来的麻烦；3、增加“预算清单”，该功能可以在不登陆帐号的情况下，输入单笔预算，策划要购买的商品，并计算预算，通过保存数据到Cookies，即使关闭浏览器下次访问仍可恢复记录。4、在列表页，默认每页100个商品；5、明显标出“非消费券”的商品；6、在商品页用蓝字显示商品ID。7、购物清单的导出导入。8、增加首页无须登陆即可访问“提货券”入口。9、完善导出清单功能，现在能供打印的清单。
// @compatible   chrome
// @license      MIT
// @author       zenwuyi
// @match        https://xffp.digitalgx.com.cn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408738/%E4%B8%AD%E5%9B%BD%E7%A4%BE%E4%BC%9A%E6%89%B6%E8%B4%AB%E7%BD%91%7C%E5%B9%BF%E8%A5%BF%E7%89%B9%E8%89%B2%E9%A6%86%20%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/408738/%E4%B8%AD%E5%9B%BD%E7%A4%BE%E4%BC%9A%E6%89%B6%E8%B4%AB%E7%BD%91%7C%E5%B9%BF%E8%A5%BF%E7%89%B9%E8%89%B2%E9%A6%86%20%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //---------------------- 全局函数开始-----------------------
    // 延时执行时间，本脚本必须在原网页渲染完毕后执行
    const waitReadyTime = 1500;
    // 主色调 网站同色：#e1251b 开发版（蓝色）：#042167
    const mainTone = "#e1251b";
    // 选择器
    var q=(selectorString)=>document.querySelector(selectorString);
    // 复制一个元素（参数：选择器）
    var copyElement=(selectorString)=>{
        "复制一个元素（参数：选择器）";
        return q(selectorString).cloneNode(true);
    };
    // 定义一个日志函数，便于输出日志到控制台或其他什么
    var log = function(msg,selector) {
        if(selector&&q(selector)){
            q(selector).append(msg);
        }else{
            console.log(msg);
        }
    };
    // 等待
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    // 返回url参数
    var request = function(name){
        let url = window.location.href;
        let reg = new RegExp("(^|bai&)"+ name +"=([^&]*)(&|$)");
        let search = url.substring(url.indexOf("?"));
        let r = search.substr(1).match(reg);
        if (r!=null) return unescape(r[2]); return null;
    };
    // 创建一个元素(元素标签，id，class，style)
    var c = (tagName,id,className,style)=>{
        let el = document.createElement(tagName);
        if(id)el.id=id;
        if(className)el.className=className;
        if(style)el.style=style;
        return el;
    };
    //JS操作cookies方法!
    //写cookies
    var setCookie = function(name,value)
    {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    }
    // 读cookies
    var getCookie = function(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)){
            return unescape(arr[2]);
        }else{
            return null;
        }
    }
    // 公共样式表
    var css={
        // 初始化
        "init":function(){
            let patchStyle = c("style");
            patchStyle.id = "patchStyle";
            document.body.appendChild(patchStyle);
        },
        // 追加
        "append":function(classStyle){
            q("style#patchStyle").append(classStyle);
        }
    };
    // 模拟操作
    function AutoJs(){
        log("[AutoJs] 初始化。");
    };
    AutoJs.prototype={
        "end":function(){
            log("[AutoJs] 完成!");

        },
        "error":function(selector,hand,msg){
            log(`[AutoJs] [error] 操作:${hand} 选择器:${selector} 信息:${msg}`);
            return this;
        },
        // 模拟单击事件
        "click":function(selector){
            let s = q(selector);
            if(s){
                s.click();
                return this;
            }else{
                return this.error(selector,"click","没有找到要点击的网页元素!");
            }
        },
        // 线程等待时间(毫秒)
        "sleep":function(interval){
            for(var t = Date.now(); Date.now() - t <= interval;);
            return this;
        },
        // 执行函数
        "action":function(func){
            if(typeof func == 'function'){
                log("[AutoJs] 执行函数");
                func();
            }else{
                log("[AutoJs] 定义的参数，其类型并不是一个函数。");
                return this.end();
            }
            return this;
        },
        // 等待某个元素出现后执行（元素选择器，执行函数，等待次数（-1为一直等），检查间隔（默认20毫秒））
        "wait":function (selector,func, times, interval) {
            log(`[AutoJs] 等待选择器：“${selector}” 渲染完成并执行指定函数`);
            let _times = times || -1, //100次
                _interval = interval || 20, //20毫秒每次
                _self = q(selector);
            let _iIntervalID; //定时器id
            if (_self) { //如果已经获取到了，就直接执行函数
                func && func.call(_self);
            } else {
                _iIntervalID = setInterval(function () {
                    if (!_times) { //是0就退出
                        clearInterval(_iIntervalID);
                    }
                    _times <= 0 || _times--; //如果是正数就 --

                    _self = q(selector); //再次选择
                    if (_self) { //判断是否取到
                        func && func.call(_self);
                        clearInterval(_iIntervalID);
                    }
                }, _interval);
            }
            return this;
        },
        "extend":function(fn){

        },
    };
    //--------------------- 全局函数结束 ---------------------
    // 购物车
    var shoppingCart={
        // 购物车图标
        "buyCarIconHtml":
            '<svg t="1596793883289" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2489" width="32" height="32" style="margin:0 0 2px 0"><path d="M384 768a64 64 0 1 0 0.032 128.032A64 64 0 0 0 384 768M704 768a64 64 0 1 0 0.032 128.032A64 64 0 0 0 704 768M312.672 512l-51.424-192h560.96l-51.456 192H312.672z m583.36-224a32 32 0 0 0-32-32H244.064L209.792 128H96.032v64h64.64l145.728 544H800v-64H355.52l-25.696-96h490.048l12.16-45.376 64-238.88-0.768-0.192C895.424 290.336 896 289.28 896 288z" fill="#ffffff" p-id="2490"></path><path d="M448 448h192v-64h-192z" fill="#ffffff" p-id="2491"></path></svg>'
        ,// 预算
        "budget":0.0,
        // 加车商品数量
        "inCartCount":0,
        // 消费券合计金额
        "inCartTotal_Coupon":0.0,
        // 非消费券合计金额
        "inCartTotal_notCoupon":0.0,
        // 合计金额
        "inCartTotal":0.0,
        // 剩余预算
        "inCartBalance":0.0,
        // 总人数，控制下单数量
        "peoples":0,
        // 购物车项
        "items":[],
        // 显示当前的购物车数据
        "showItemJson":function(){
            log(JSON.stringify(this.items));
        },
        // 根据ID查找购物车项
        "findById":function(id,sid){
            sid=sid||0; // 多个类型第一个为0，第二为1，类推
            for (let i = 0; i < this.items.length; i++) {
                if(this.items[i].id==id&&this.items[i].sid==sid){
                    return this.items[i];
                }
            }
            return {"id":0};
        },
        // 商品对象的默认值
        "detail_Default":{
            "id":0,
            "sid":0,
            "title":"商品名称",
            "img":"缩略图",
            "price":0.0,
            "specifications":"规格",
            "buyCount":0,
            "stock":0,
            "isCoupon":false
        },
        // 折叠购物车(强制折叠：true|强制展开：false)
        "buyCarBarFold":function(isTofold){
            let buyCarBar = q("#buyCarBar");
            let folded = buyCarBar.className.indexOf("fold")!=-1;
            if(isTofold==undefined)
            {
                // 根据折叠情况执行相反的操作
                if(folded){
                    buyCarBar.classList.remove("fold");
                }else{
                    buyCarBar.classList.add("fold");
                }
            }else if(folded&&!isTofold){
                // 已折叠的要强制展开
                buyCarBar.classList.remove("fold");
            }else if(!folded&&isTofold){
                // 未折叠的要强制折叠
                buyCarBar.classList.add("fold");
            }
        },
        "init":function(){

            // 创建购物车栏
            let buyCarBar = c("div");
            buyCarBar.id = "buyCarBar";
            css.append("#buyCarBar{display: flex;position: fixed; width: 100%;bottom: 0;height: 130px;background: #fff; border-top: 2px solid "+mainTone+";opacity: 1;}");
            css.append("#buyCarBar.fold{width: 310px;border-right: 2px solid "+mainTone+";border-radius: 0 1em;}");
            css.append("#buyCar_title span{cursor: pointer;}")

            let buyCar_titleBar = c("h1");
            buyCar_titleBar.id = "buyCar_title";
            css.append("#buyCar_title{display:block;width:42px;height:100%;background:"+mainTone+";color:#fff;writing-mode: tb-rl;font-size:16px;line-height: 40px;}");
            // 购物车图标
            buyCar_titleBar.innerHTML+=this.buyCarIconHtml;
            // 显示购物车数据
            buyCar_titleBar.addEventListener("dblclick",()=>shoppingCart.showItemJson(),false);
            // 预算清单几个字
            let buyCar_title = c("span");
            buyCar_title.append("预算清单");
            buyCar_title.addEventListener("click",()=>this.buyCarBarFold(),false);
            buyCar_titleBar.append(buyCar_title);
            // 合并入购物车栏
            buyCarBar.append(buyCar_titleBar);
            // 购物数量小红点
            let inCartCountPoint = c("div");
            inCartCountPoint.id="inCartCount";
            css.append("#inCartCount{z-index: 10;min-width: 0.5em;min-height: 0.5em;line-height: 0.5em;text-align: center;border-radius: 500rem;padding: 0.5em !important;position: absolute;background: "+mainTone+";border: 2px solid #fff;color: #fff;left: 30px;top: -10px;}");css.append("#inCartCount{z-index: 10;min-width: 0.5em;min-height: 0.5em;line-height: 0.5em;text-align: center;border-radius: 500rem;padding: 0.5em !important;position: absolute;background: "+mainTone+";border: 2px solid #fff;color: #fff;left: 30px;top: -10px;}");
            inCartCountPoint.append(0);
            buyCarBar.append(inCartCountPoint);

            // 购物车数据栏
            let dataBar = c("div","dataBar");
            let dataBarText = c("div","dataBarText");
            dataBarText.append("数据：");
            dataBar.append(dataBarText);
            dataBar.append(c("i","","after"));
            css.append("#dataBar{color: #fff;position: absolute;top: -30px;display: flex;}");
            css.append("#dataBarText{background: "+mainTone+";padding: 5px;}");
            css.append("#dataBar .after{display:block;width: 0;height: 0;border-color: "+mainTone+" transparent;border-width: 0 30px 30px 0;border-style: solid;}");
            buyCarBar.append(dataBar);


            // 购物车状态栏
            let stateBar = c("ul");
            stateBar.id="stateBar";
            css.append("#stateBar{width:260px;height:100%;padding:5px 5px 5px 10px;font-size:14px;display: flex;flex-flow: column;flex-wrap: wrap;}");
            css.append("#budget,#peoples{width: 60px;height: 2em;padding: 0 5px;}");
            css.append("#stateBar button{border-radius: 0px;padding: 0 5px;line-height: 24px;border: 1px solid "+mainTone+";background-color: #fff;font-size: 12px;font-weight: 700;color: "+mainTone+";transition: background 0.2s ease 0s;margin-right: 2px;cursor: pointer;}");
            css.append("#stateBar li{margin:0;padding:0;line-height: 2em;display:block;width:49%;height: 28px;}");
            let lineArr = [
                '<label>券预算：<input id="budget" type="tel" autocomplete="off" placeholder="请输入" class="el-input__inner"></label>',
                '<label>券消费：</label><label id="inCartTotal_Coupon">0</label><label>元</label>',
                '<label id="inCartBalanceLabel">券余额：</label><label id="inCartBalance">0</label><label>元</label>',
                '<label><button id="cleadBuyCart">清空</button><button id="autoPlaceOrder" enable="false">批量结算</button></label>',

                '<label>总人数：<input id="peoples" type="tel" autocomplete="off" placeholder="请输入" class="el-input__inner"></label>',
                '<label>非券共：</label><label id="inCartTotal_notCoupon">0</label><label>元</label>',
                '<label>总开支：</label><label id="inCartTotal">0</label><label>元</label>',
                '<label><button id="import">导入清单</button><button id="export">导出清单</button></label>'
            ];
            for (let index = 0; index < lineArr.length; index++) {
                let line = lineArr[index];
                let li = c("li");
                li.innerHTML=lineArr[index];
                stateBar.append(li);
            }

            // 合并入购物车栏
            buyCarBar.append(stateBar);

            // 购物车容器
            // 商品容器
            buyCarBar.append(c("ul","itemsBox","itemsBox"));

            // 将购物车注入页面
            q("body").append(buyCarBar);

            // 输入预算的事件
            q("#budget").addEventListener("blur",()=>{
                shoppingCart.budget = parseInt(q("#budget").value);
                // 重新计算购物车数据
                shoppingCart.calculation(true);
            },false);
            // 输入人数事件
            q("#peoples").addEventListener("blur",()=>{
                shoppingCart.peoples = parseInt(q("#peoples").value);
                if(window.location.hash.indexOf("#/shopDetail")!=-1&&shoppingCart.peoples>0){
                    q(".addCart input").value = shoppingCart.peoples;
                }
                // 重新计算购物车数据
                shoppingCart.calculation(true);
            },false);
            // 清空购物车
            q("#cleadBuyCart").addEventListener("click",()=>{
                if(confirm("确认要清空购物车吗？")){
                    this.items=[];
                    this.calculation(true);
                    let itemBox = q(".itemsBox");
                    if(itemBox)itemBox.innerHTML = "";
                }
            },false);
            // 导出清单
            q("#export").addEventListener("click",()=>this.export(),false);
            // 批量结算
            q("#autoPlaceOrder").addEventListener("click",()=>{
                alert("批量结算功能后续实现。请在购物车中逐一点击，进行“单位集采”。");
            },false);
            // 导入清单
            q("#import").addEventListener("click",()=>this.import(),false);

            // 恢复历史记录
            let history = getCookie("offlineBuyCart");
            if(history!=null){
                log("[增强] 恢复记录到购物车");
                let json = JSON.parse(history);
                this.budget = json.budget;
                this.peoples = json.peoples;
                this.items = json.items;
                q("#peoples").value=this.peoples;
                q("#budget").value=this.budget;
                for (let i = 0; i < this.items.length; i++) {
                    let item = this.items[i];
                    q("#itemsBox").append(this.createItem(item));
                }
                this.calculation(true);
            }
        },
        // 自动操作过程中，阻止用户操作页面的遮罩
        "autoOperationMask":function(isShow) {
            let mask;
            if(isShow){
                mask = c("div","autoOperationMask");
                q("body").append(mask);
            }else{
                q("#autoOperationMask").remove();
            }
        },
        // 导入清单
        "import":function(dataStr){
            // 导入必须从列表页或商品页开始，否则不会触发刷新后的事件，为何如此，尚不明确
            if(window.location.hash.indexOf("#/search")==-1
                &&window.location.hash.indexOf("#/shopDetail")==-1){
                window.location.hash="#/search?productTypeId=107&name=%E5%88%9D%E7%BA%A7%E5%86%9C%E4%BA%A7%E5%93%81";
                gxfp.loadedAction=()=>this.import(dataStr);
                return;
            }
            dataStr = dataStr || prompt("请输入或粘贴（CTRL+V）从本插件导出的清单字符串：");
            if(!dataStr)return;
            let arr1 = dataStr.split("+");
            let items = [];
            for (let i1 = 0; i1 < arr1.length; i1++) {
                let arr2 = arr1[i1].split("*");
                switch (arr2[0]) {
                    case "b":
                        this.budget = parseFloat(arr2[1]);
                        break;
                    case "p":
                        this.peoples = parseInt(arr2[1]);
                        break;

                    default:
                        if(arr2[0].indexOf("-")!=-1){
                            let arr3 = arr2[0].split("-");
                            items.push({"id":parseInt(arr3[0]),"sid":parseInt(arr3[1]),"buyCount":parseInt(arr2[1])});
                        }
                        break;
                }
            }
            log("[增强] 即将恢复购物车："+JSON.stringify(items));

            // "接下来会自动把导入数据还原成购物车，期间请勿对页面进行操作！"
            q("#cleadBuyCart").click();
            for (let i = 0; i < items.length; i++) {
                const detail = items[i];
                this.auImCartArr.push(()=>{
                    log(`[autojs] 自动加车：detail.id:${detail.id},detail.sid:${detail.sid},detail.buyCount:${detail.buyCount}`);
                    shoppingCart.auImCart(detail.id,detail.sid,detail.buyCount);
                });
            }

            if(this.auImCartArr.length>0)
            {
                // 用遮罩禁止用户操作
                this.autoOperationMask(true);
                // 执行第一个导入操作
                this.auImCartArr.shift()();
            }
        },
        // 自动执行的操作把导入数据还原成购物车
        "auImCart":function(detailId,detailSid,buyCount){
            gxfp.loadedAction=()=>{
                gxfp.loadedAction=()=>{
                    let auto = function() {
                        var p = new Promise(function(resolve, reject){
                            //做一些异步操作
                            let auObj = new AutoJs()
                                .wait("#showDetailId_finish",function(){
                                    if(detailSid>0){
                                        q(`.choose-attrs button:nth-child(${detailSid+1})`).click();
                                    }
                                    q(".addCart input").value=buyCount;
                                },10000,500)
                                .sleep(1000)
                                .wait("#imCart",function(){gxfp.addShoppingCart(detailId)},10000,500)
                                .sleep(1000)
                                .end();
                                resolve(auObj);
                        });
                        return p;
                    };
                    auto()
                    .then(function(autojsObj){
                        if(shoppingCart.auImCartArr.length>0){
                            shoppingCart.auImCartArr.shift()();
                        }else{
                            // 释放掉载入后执行函数
                            gxfp.loadedAction=null;
                            // 移除遮罩恢复用户操作
                            shoppingCart.autoOperationMask(false);
                        }
                    });
                };
                log(`[AutoJs] 准备转到： #/shopDetail?id=${detailId}`);
                window.location.hash = `#/shopDetail?id=${detailId}`;
            };
            log(`[AutoJs] 准备转到： 过渡页`);
            window.location.hash = "#/help";
        },
        // 自动导入购物车队列
        "auImCartArr":[],
        // 导出清单
        "export":function(){
            // 数据格式{bx总预算,px总人数,商品id_类别sidx数量……}
            let dataStr = "b*"+this.budget+"+p*"+this.peoples;
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                dataStr+="+"+item.id+"-"+item.sid+"*"+item.buyCount;
            }
            log("[增强] 导出："+dataStr);
            let css = "h1,h2{text-align: center;margin: 0;}td{border-left:1px solid #000;border-top:1px solid #000;word-break: break-word;}td img{height:100px;max-height:100px;max-width:150px}.title{vertical-align: top;}table{margin:2em auto;border-spacing: 0;border-right:1px solid #000;border-bottom:1px solid #000}";
            css+=".c1{width:150px;}.c2{width:300px}.c3{width:120px}.c4{width:180px}.c5{width:110px}"
            let html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="widtd=device-widtd, initial-scale=1.0"><title>购物清单</title><style>${css}</style></head><body><h1><img src="https://xffp.digitalgx.com.cn/static/img/header-Logo2.711b7b06.png" alt="中国社会扶贫网广西特色馆"></h1><h2>购物清单(${new Date().toLocaleString()})</h2><table><tbody>`;
            this.items.forEach(detail => {
                let smallTotal = Math.round(detail.price*100*detail.buyCount)/100;
                html+=`<tr><td rowspan="3" class="c1"><img src="${detail.img}" alt="${detail.title}"></td><td rowspan="2" class="c2 title">商品ID：<i id="id">${detail.id}</i> ${detail.title}</td><td class="c3">单价：${detail.price}元</td><td class="c4">订单号：${""}</td><td class="c5">备注</td></tr><tr><td>数量：${detail.buyCount}份</td><td>快递单：${""}</td><td rowspan="2">　</td></tr><tr><td style="over-flow:hidden">规格：${detail.specifications}</td><td>小计：${smallTotal}元</td><td>支付方式：${(detail.isCoupon?"消费券":"转账")}</td><tr>`;

            });
            let ofWhich=`消费券合计：${this.inCartTotal_Coupon} 人均：${Math.round(this.inCartTotal_Coupon*100/this.peoples)/100} 非消费券合计：${this.inCartTotal_notCoupon} 人均：${Math.round(this.inCartTotal_notCoupon*100/this.peoples)/100}`;
            html+=`<tr><td colspan="5">总计：${this.inCartTotal}元（其中：${ofWhich}）</td></tr><tr><td colspan="5">预算清单导入码：${dataStr}</td></tr></tbody></table></body></html>`;
            let newwindow = window.open('', "_blank",'');
            newwindow.document.write(html);
        },
        // 添加商品到购物车（参数商品json对象）
        "addItem":function(detail){
            detail = detail||this.detail_Default;
            if(detail.id==0)
            {
                alert("商品ID没有成功传入！");
                return;
            }
            log("[增强] 添加商品到购物车："+detail.title+",规格："+detail.specifications+",数量："+detail.buyCount+",消费券："+detail.isCoupon);
            var match = this.findById(detail.id,detail.sid);
            if(this.items.length==0||match.id==0)
            {
                // 添加
                this.items.push(detail);
                q("#itemsBox").append(this.createItem(detail));
            }else{
                // 更新购买数量buyCount
                this.updateBuyCount(match,detail.buyCount+0);
            }
            // 重新计算购物车合计数
            this.calculation(true);

        },
        // 重新计算购物车合计数(是否更新购物车页面)
        "calculation":function(isUpdateView) {
            // 品种数量
            this.inCartCount = this.items.length;
            // 购物总额
            let total = 0.0;
            // 消费券消费金额
            let inCartTotal_Coupon = 0.0;
            // 非消费券消费金额
            let inCartTotal_notCoupon = 0.0;
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                if(item.isCoupon)
                {
                    // 消费券
                    inCartTotal_Coupon+=Math.round(item.price*100*item.buyCount)/100;
                }else{
                    // 非消费券
                    inCartTotal_notCoupon+=Math.round(item.price*100*item.buyCount)/100;
                }
            }
            // 消费券消费金额
            this.inCartTotal_Coupon = Math.round(inCartTotal_Coupon*100)/100;
            // 非消费券消费金额
            this.inCartTotal_notCoupon = Math.round(inCartTotal_notCoupon*100)/100;
            // 总开支
            this.inCartTotal=Math.round((inCartTotal_Coupon+inCartTotal_notCoupon)*100)/100;
            // 消费券余额
            this.inCartBalance=Math.round(this.budget*100-inCartTotal_Coupon*100)/100;
            // 更新购物车页面视图
            if(!isUpdateView)return;
            q("#dataBarText").innerText="人均消费券（元）："+
                (Math.round(this.budget*100/this.peoples)/100)+"，开支："+
                (Math.round(inCartTotal_Coupon*100/this.peoples)/100)+"，余额："+
                (Math.round(this.inCartBalance*100/this.peoples)/100)+"";
            q("#inCartTotal_Coupon").innerText=this.inCartTotal_Coupon;
            q("#inCartTotal_notCoupon").innerText = this.inCartTotal_notCoupon;
            q("#inCartCount").innerText=this.inCartCount;
            q("#inCartTotal").innerText=this.inCartTotal;
            if(this.inCartBalance<0){
                // 超预算
                log("[增强] 购物车超预算了。");
                q("#inCartBalanceLabel").innerText="券超支：";
                q("#inCartBalanceLabel").style="color:"+mainTone+"";

                q("#inCartBalance").innerText=Math.abs(this.inCartBalance);
                q("#inCartBalance").style="color:"+mainTone+"";
            }else{
                // 正常消费券余额
                q("#inCartBalanceLabel").innerText="券余额：";
                q("#inCartBalanceLabel").style="";
                q("#inCartBalance").innerText=this.inCartBalance;
                q("#inCartBalance").style="";
            }
            // 保存购物车数据
            setCookie("offlineBuyCart",JSON.stringify({
                "budget":this.budget,
                "peoples":this.peoples,
                "items":this.items
            }));
        },
        // 移除商品)(商品信息对象，是否更新总数据)
        "removeItem":function(detail,isUpdateItemsData){
            detail = detail||this.detail_Default;
            if(detail.id==0)
            {
                alert("商品ID没有成功传入！");
                return;
            }
            log("[增强] 从购物车删除："+detail.title);
            // 从购物车移除
            let box = q('.itemBox[detail-id="'+detail.id+'"][detail-sid="'+detail.sid+'"]')
            if(box)box.remove();

            // 从数据源移除商品
            if(isUpdateItemsData)
            {
                var match = this.findById(detail.id,detail.sid);
                if(match.id!=0){
                    this.items.splice(this.items.findIndex(e => e.id == detail.id && e.sid==detail.sid), 1) ;
                    // 更新视图
                    this.calculation(true);
                }
            }
        },
        // 更新购物车商品信息
        "updateItem":function(detail){
            let s ='.itemBox[detail-id="'+detail.id+'"][detail-sid="'+detail.sid+'"]';
            let t = q(s);
            if(t)
            {
                q(s+' img').src = detail.img;
                q(s+' h2').innerHTML = this.itemTitleManage(detail.title);
                q(s+' h3').innerText = detail.specifications;
                q(s+' .price').innerText='￥'+detail.price;
                q(s+' .buyCount').innerText = detail.buyCount<100?"x"+detail.buyCount:detail.buyCount;
            }
        },
        // 更新购买数量（+1或-1）
        "updateBuyCount" : function (detail,plusCount) {
            // 防止数据超出范围
            let chkVal = detail.buyCount+plusCount;
            if(chkVal<1)return;
            if(chkVal>=1000)return;

            detail.buyCount+=plusCount;
            this.updateItem(detail);
            this.calculation(true);
        },
        // 商品项的样式表
        "itemCss":function(){
            css.append(".itemsBox{display: flex;height: 100%;flex-wrap: wrap;align-content: flex-start;flex:1;width:0;overflow-y:scroll;}");
            css.append(".itemBox{display:block;width: 296px;border: 1px solid rgb(204, 204, 204);margin: 5px 5px 0 0;padding: 3px;display: flex;height: 50px;overflow: hidden;}");
            css.append(".itemBox.selected{border-color: "+mainTone+";}");
            css.append(".itemBox .pic{width: 50px;height: 50px;cursor: pointer;float: left;margin-right: 5px;}");
            css.append(".itemBox h2{overflow: hidden;margin-right: 5px;font-size: 12px;overflow-wrap: break-word;display: block;width: 120px;color: rgb(0, 0, 0);cursor: pointer;float: left;line-height: 140%;}");
            css.append(".itemBox h3{overflow: hidden;overflow-wrap: break-word;font-size:12px;display: block;width: 55px;color: rgb(153, 153, 153);cursor: pointer;}");
            css.append(".itemBox .rightBar{font-size: 12px;width: 65px;text-align: right;}");
            css.append(".itemBox .rightBar button{width: 12px;height: 16px;font-size: 6px;}");
            css.append(".itemBox .rightBar .buyControl{color:red;cursor: pointer;}");
            css.append('.itemBox.notCoupon:after {background: #DDD;content: "非消费券";position: absolute; color: #fff;font-size: 30px;text-align: center;padding: 6px 92px;margin: -4px;z-index: -1;}');
            css.append(".buyCountPlus{margin-right:5px;}");
            css.append(".buyCountSubtract{margin-left:5px;}");
            css.append('.item.notCoupon:before {display: block;content: "非消费券";position: absolute;background: #D0D0D0;color: #fff;font-size: 28px;padding: 232px 9px 57px 8px;text-align: right;width: 220px;z-index: -1;margin: -12px -9px;}');
            css.append('.summary.notCoupon:after {content: "非 消 费 券";display: block;position: absolute; margin-top: -85px;margin-left: 200px;font-size: 56px;color: #FFF;text-shadow: #333 1px 0 0, #333 0 1px 0, #333 -1px 0 0, #333 0 -1px 0;opacity: 0.5;}');
            css.append('div#autoOperationMask { position: fixed;top: 0;bottom: 0;left: 0;right: 0;z-index: 999;background: #aaa;opacity: 0.8;display: flex;align-items: center; justify-content: center;}');
            css.append('div#autoOperationMask:after {content: "正在自动还原购物车，请勿操作！";font-size: 72px;}');
            css.append('.searchBox .tip:before {content: "非消费券，需要微信或转账进行订货。";color: red;}');
            css.append('#stateBar button[enable="false"] {border-color: #ccc;color: #ccc;cursor: not-allowed;}')
        },
        // 向标题输出“消费券”标志
        "itemTitleManage":function(detailTitle){
            let xfqStr = "消费券";
            let xfqIndex = detailTitle.indexOf(xfqStr);
            if(xfqIndex!=-1){
                detailTitle = detailTitle.substring(xfqIndex+xfqStr.length);
                detailTitle = '<span class="el-tag el-tag--danger el-tag--mini el-tag--dark">'+xfqStr+'</span>'+detailTitle;
            }
            return detailTitle;
        },
        // 创建商品项
        "createItem":function(detail){
            // 商品单项容器
            let itemBox = c("li");
            if(detail.isCoupon){
                itemBox.className = "itemBox";
            }else{
                // 非消费券
                itemBox.className = "itemBox notCoupon";
            }
            itemBox.setAttribute("detail-id",detail.id);
            itemBox.setAttribute("detail-sid",detail.sid);
            // 缩略图
            let img = c("img");
            img.className="pic";
            img.src=detail.img;
            img.alt=detail.title;
            itemBox.append(img);
            // 标题
            let title = c("h2");
            title.innerHTML=shoppingCart.itemTitleManage(detail.title);
            itemBox.append(title);
            // 规格
            let stitle = c("h3");
            stitle.append(detail.specifications);
            itemBox.append(stitle);

            let rightBar = c("ul");
            rightBar.className="rightBar";
            itemBox.append(rightBar);

            // 价格
            let price = c("li");
            price.className="price";
            price.style="color:#e4393c;";
            price.append("￥"+detail.price);
            rightBar.append(price);
            // 数量
            let buyCountLi = c("li");
            let buyCount = c("span");
            buyCount.className="buyCount";
            buyCount.style="color:#00f";
            buyCount.append(detail.buyCount<100?"x"+detail.buyCount:detail.buyCount);

            // 加
            buyCountLi.append((()=>{
                let buyCountPlus = c("button");
                buyCountPlus.className="buyCountPlus";
                buyCountPlus.append("+");
                buyCountPlus.addEventListener("click",()=>this.updateBuyCount(detail,1),false);
                return buyCountPlus;
            })());
            // 数量
            buyCountLi.append(buyCount);
            // 减
            buyCountLi.append((()=>{
                let buyCountSubtract = c("button");
                buyCountSubtract.className="buyCountSubtract";
                buyCountSubtract.append("-");
                buyCountSubtract.addEventListener("click",()=>this.updateBuyCount(detail,-1),false);
                return buyCountSubtract;
            })());

            rightBar.append(buyCountLi);
            // 控制删除
            let buyControlLine = c("li");
            let buyControl=c("span",null,"buyControl");
            buyControl.append("删除");
            buyControl.addEventListener("click",()=>this.removeItem(detail,true),false);
            buyControlLine.append("ID:"+detail.id+" ");
            buyControlLine.append(buyControl);
            rightBar.append(buyControlLine);
            // 点击购物车中的商品，转到商品页
            let itemOmClick = ()=>this.jumpToDetail(detail.id);
            img.addEventListener("click",itemOmClick,false);
            title.addEventListener("click",itemOmClick,false);

            //判断元素是否出现了滚动条
            let ele = q("#itemsBox");
            if(ele.scrollHeight > ele.clientHeight) {
                //设置滚动条到最底部
                ele.scrollTop = ele.scrollHeight;
            }

            return itemBox;
        },
        "jumpToHash":function (urlHash)
        {
            // 判断是否需要切一下页面
            let tag = urlHash.substring(0,urlHash.indexOf("?"));
            if(window.location.hash.indexOf(tag)!=-1)
            {
                // 已经在详细页面了，要切换一下页面
                window.location.hash = "#/help";
                setTimeout(()=>{window.location.hash = urlHash},100);
            }else{
                // 直接跳转
                window.location.hash = urlHash;
            }
        },
        // 直接从当前页面跳到商品详细页
        "jumpToDetail":function (detailId,detailSid)
        {

            let jHash = (detailSid)
                ?`#/shopDetail?id=${detailId}&sid=${detailSid}`
                :`#/shopDetail?id=${detailId}`;
            if(window.location.hash.indexOf("#/shopDetail?id=")!=-1)
            {
                // 已经在详细页面了，要切换一下页面
                window.location.hash = "#/help";
                setTimeout(()=>{window.location.hash = jHash;},1);
            }else{
                // 直接跳转
                window.location.hash = jHash;
            }
        },
    };

    var gxfp = {
        // 直接从当前页面跳到商品详细页
        "nav":function (urlHash)
        {
            // 判断是否需要切一下页面
            let tag = urlHash.substring(0,urlHash.indexOf("?"));
            if(window.location.hash.indexOf(tag)!=-1)
            {
                // 已经在详细页面了，要切换一下页面
                window.location.hash = "#/help";
                setTimeout(()=>{window.location.hash = urlHash},100);
            }else{
                // 直接跳转
                window.location.hash = urlHash;
            }
        },
        "setPageSizeMax":function(){
            let url = window.location.href;
            if(url.indexOf("search?")!=-1){
                let chkNotCoupon=function(){
                    log("[增强] 向不支持消费券的项目添加“非消费券”标识");
                    let itemArr = document.querySelectorAll(".shopList .item");
                    for (let i = 0; i < itemArr.length; i++) {
                        let item = itemArr[i];
                        if(!item.querySelector("span.el-tag")){
                            // 向不适用消费券的项，追加“非消费券”标识
                            item.classList.add("notCoupon")
                        }
                    }
                };
                // 首次执行
                chkNotCoupon();
                // 商品列表刷新后保持标识
                q(".shopList").addEventListener("DOMNodeInserted",(e)=>{
                    //chkNotCoupon();
                    //log(event.target);
                    if(!event.target.querySelector("span.el-tag")){
                        // 向不适用消费券的项，追加“非消费券”标识
                        event.target.classList.add("notCoupon")
                    }
                },false);
                // 每页100个
                log("[增强] 将每页商品数量固定为100个/页");
                let pSizeSel = q(".el-pagination__sizes div");
                if(pSizeSel){
                    pSizeSel.click();
                    setTimeout(()=>{
                        let btn = document.querySelectorAll("body > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li.el-select-dropdown__item")[4];
                        if(btn)btn.click();
                    },waitReadyTime);
                }else{
                    log("[增强] 页码控件还没准备好，等待："+waitReadyTime+"毫秒");
                    setTimeout(()=>this.setPageSizeMax,waitReadyTime);
                }
            }
        },
        "goShopDetail":function(){
            if(!q("a.btn-box"))return;
            // 防止重复执行
            if(q("#goShopDetail_finish")){
                log("[增强] 商品ID直达详细页按钮已存在");
                return;
            }
            log("[增强] 搜索栏添加商品ID直达详细页按钮");
            // 搜索栏ID直达详细页按钮
            let btn = document.createElement("button");
            btn.className="button";
            btn.style='border-radius: 0;right: 0px;width: 90px;height: 32px;line-height: 32px;border: none;background-color: '+mainTone+';font-size: 16px;font-weight: 700;color: #fff;transition: background .2s ease;position: absolute;top: 0;outline: none;cursor: pointer;';
            let btn_name=document.createElement("span");
            btn_name.append("直达商品");
            btn.id="goShopDetail_finish";
            btn.append(btn_name);
            btn.onclick=function(){
                shoppingCart.jumpToDetail(q(".el-input__inner").value);
            };
            let appendNode = function(){
                if(q(".el-input__inner"))
                {
                    q(".el-input__inner").placeholder="请输入内容搜索，或，输入商品ID点击“直达商品”";
                    q(".searchbox").append(btn);
                    // 原来的搜索按钮左移
                    q(".searchbox button").style="right: 92px";
                }
                else
                {
                    log("[增强] 搜索栏没准备好，等待："+waitReadyTime+"毫秒");
                    setTimeout(appendNode,waitReadyTime);
                }
            };
            appendNode();
        },"showDetailId":function(retry){
            // 重试次数
            //retry = retry || 3;
            // 显示商品ID
            let url = window.location.href;
            if(url.indexOf("shopDetail?id=")!=-1)
            {
                // 令滚动条回到顶部
                window.scrollTo(0,0);
                // 防止重复执行
                if(q("#showDetailId_finish")!=null)return;
                log("[增强] 商品详细页添加显示商品ID");
                // 防止渲染未完成
                if(q(".summary")==null)
                {
                    if(retry>0){
                        log(`[增强] 商品ID没准备好，等待：${waitReadyTime}毫秒 重试：${retry}`);
                        retry--;
                        setTimeout(()=>this.showDetailId(retry),waitReadyTime);
                    }else{
                        log("[增强] 商品ID 不存在，或已经下架。");
                    }
                    return;
                }
                // 设置订购的默认数量
                if(shoppingCart.peoples>0){
                    q(".addCart input").value = shoppingCart.peoples;
                }
                let id = request("id");
                let sl=document.createElement("span");
                sl.style="color: #999;font-size: 12px;margin-left: 10px;";
                sl.append("商品直达ID：");
                let sd=document.createElement("div");
                sd.style="color:#00F";
                sd.append(id);
                let sBox = document.createElement("div");
                sBox.className="box";
                sBox.id="showDetailId_finish";
                sBox.append(sl);
                sBox.append(sd);
                // 显示商品直达ID
                q(".summary").append(sBox);
                // 预算加车按钮

                // 检查库存
                let hasCountDiv = q(".summary .box:nth-child(2) div");
                let hasCount = 0;
                if(hasCountDiv)hasCount = parseInt(hasCountDiv.innerText);
                var btn = copyElement(".addcartBtn");
                btn.id="imCart";
                if(hasCount<=0){
                    // 缺货
                    btn.innerHTML="<span>缺货</span>";
                    btn.style="background-color: #fff;color: #ccc;border: 2px solid #ccc;cursor: not-allowed;";
                }else{
                    // 加车
                    btn.innerHTML="<span>加入预算清单</span>";
                    btn.style="background-color: #fff;color: "+mainTone+";border: 2px solid "+mainTone+"";
                    btn.removeEventListener("click",()=>{this.addShoppingCart(id)});
                    // 加车方法
                    btn.addEventListener("click",()=>{
                        this.addShoppingCart(id);
                    },false);
                }
                q(".addCart").appendChild(btn);
                // 检查是否消费券
                if(q(".title span")==null){
                    q(".summary").classList.add("notCoupon")
                }


            }
        },
        // 加入购物车
        "addShoppingCart":function(id){
            // TODO: 加车并计算剩余预算
            let arr = document.querySelectorAll(".choose-attrs button");
            // 检查库存
            let hasCountDiv = q(".summary .box:nth-child(2) div");
            let hasCount = 0;
            if(hasCountDiv)hasCount = parseInt(hasCountDiv.innerText);
            let sid = 0;
            for (let i = 0; i < arr.length; i++) {
                if(arr[i].className.indexOf("selected")!=-1){
                    sid = i;
                    break;
                }
            }
            shoppingCart.addItem(
            {
                "id":parseInt(id),
                "sid":sid,
                "title":q(".title").innerText,
                "img":q(".preview-box img").src,
                "price":parseFloat(q(".price").innerText),
                "specifications":q(".choose-attrs .selected i").innerText,
                "buyCount":parseInt(q(".addCart input").value),
                "stock":hasCount,
                "isCoupon":q(".title span")!=null // 是否有消费券标志
            });
        },
        // 增加栏目导航
        "navTopBar":function(){
            // 追加导航（标题文本，锚点路由）
            if(!q(".navitems"))return;
            let addNav = function(title,urlHash){
                let tpl = copyElement(".navitems ul li:not(.style-red)");
                let link = tpl.querySelector("a");
                link.href="javascript:;";
                if(window.location.hash.indexOf(urlHash)!=-1){
                    // 当前页为选中项
                    link.className+=" style-red";
                }else{
                    // 赋予单击事件
                    link.addEventListener("click",()=>gxfp.nav(urlHash),false);
                }
                tpl.querySelector("span").innerText=title;
                q(".navitems ul").append(tpl);
            };
            addNav("初级农产品","#/search?productTypeId=107&name=%E5%88%9D%E7%BA%A7%E5%86%9C%E4%BA%A7%E5%93%81");
            addNav("食品饮料","#/search?productTypeId=106&name=%E9%A3%9F%E5%93%81%E9%A5%AE%E6%96%99");
            addNav("粮油干货","#/search?productTypeId=105&name=%E7%B2%AE%E6%B2%B9%E5%B9%B2%E8%B4%A7");
        },
        "offlineBuyCar":function(){
            log("[增强] 预算清单 初始化");
            shoppingCart.init();
        },
        // 自动折叠购物车
        "autoFoldShoppingCart":function(){
            let hash = window.location.hash;
            if(hash.indexOf("#/index")!=-1
                ||hash.indexOf("#/search")!=-1
                ||hash.indexOf("#/shopDetail")!=-1
            ){
                shoppingCart.buyCarBarFold(false);
            }else{
                shoppingCart.buyCarBarFold(true);
            }
        },
        // 无须登陆就显示“提货券”入口
        "indexShowAD":function(){
            if(window.location.hash.indexOf("#/index")!=-1){
                q(".log-box").innerHTML+=
                    '<a target="_blank" href="https://gxfp.digitalgx.com.cn" class="zttp"><img src="/static/img/ts.dac6a531.jpeg" alt="购买提货券（工会节日慰问品套餐，非消费券）" style="width: 100%;"></a>';
            }
        },
        "reg":function(){
            // 向页面注册本工具,侦听页面改变事件，当局部刷新页面后再次执行本增强工具
            log("[增强]向页面注册本工具,侦听页面改变事件，当局部刷新页面后再次执行本增强工具");
            q("#app").addEventListener('DOMNodeInserted', (e) => {
                if(e.path.length==6){
                    log("[增强] 捕获到页面 #app 局部刷新");
                    setTimeout(()=>gxfp.load(),waitReadyTime);
                }
            }, false);
        },
        // 每次全页刷新后执行
        "load":function(){
            log("[增强] 准备执行");
            this.navTopBar();
            this.goShopDetail();
            this.showDetailId(3);
            this.setPageSizeMax();
            this.autoFoldShoppingCart();
            this.indexShowAD();
            log("[增强] 公共函数执行完成");
            if(this.loadedAction&&
                typeof this.loadedAction == "function")
            {
                log("[增强] 准备进行执行后续函数");
                this.loadedAction();
            }
            log("[增强] 完成 -----------------------");
        },
        "loadedAction":null,
        // 只运行一次的
        "disposableRun":function(){
            css.init();
            css.append("#app .main-box .bottom-box{height:160px}");
            css.append("#showDetailId_finish{display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-align: center;-ms-flex-align: center;align-items: center;padding-bottom: 5px;}");
            css.append(".sort .item{float: left;cursor: pointer;padding: 4px 15px;font-size: 12px;background: #fff;color: #606266;}")
            css.append(".sort .item.active{background: "+mainTone+";color: #fff;}");
            shoppingCart.itemCss();
        },
        "start":function(){
            this.disposableRun();
            this.offlineBuyCar();
            this.load();
            this.reg();
        }
    };//end

    //setInterval(gxfp.start(),waitReadyTime);
    setTimeout(()=>gxfp.start(),waitReadyTime);
})();