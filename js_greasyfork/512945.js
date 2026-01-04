// ==UserScript==
// @name         alimm视频生成
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  alimm视频生成!
// @author       You
// @match        https://chuangyi.taobao.com/external/meditorLite*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      End-User License Agreement
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/512945/alimm%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/512945/alimm%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
let div_css = `
        .cyOperate{
            width: 500px;
            max-height: 700px;
            overflow-y: auto;
            padding: 15px 20px;
            background: #fff;
            border-radius: 10px;
            position: fixed;
            right: 15%;
            top: 50%;
            transform: translateY(-50%);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 99999;
            color: #333;
            box-sizing: initial;
        }
        .cyInp input{
            width: 220px;
            height: 40px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 4px;
            border: 1px solid #aaa;
            margin-left: 20px;
        }
        .cyBtn{
            text-align: center;
        }
        .cyBtn button{
            width: 150px;
            height: 35px;
            background-color: #0096DB;
            color: #fff;
            border: 0;
            border-radius: 3px;
            cursor: pointer;
            font-size: 16px;
            letter-spacing: 3px;
        }
        .cyloading{
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 9999999;
            display: none;
        }
        .cyloading svg{
            width: 300px;
            height: 300px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -150px;
            margin-top: -150px;
        }
        .cyloading svg text{
            font-size: 2px;
        }
        .cyInp {
            width: 220px;
            height: 40px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 4px;
            border: 1px solid #aaa;
            margin:0 0 20px 10px;
        }
        .keyword {
           margin:20px 0;
        }
        .title {
           font-size:16px;
           font-weight:500;
           color:blue;
        }
        .h1_content{
        font-size:22px;
        font-weight:bold;
        display:none;
        }
    `
    // 引用自定义css
    GM_addStyle(div_css);
    let div = `
        <div class="cyOperate">
             <div class="h1_content"><span id="content_text"></span>将在<span id="countdown">60</span> 秒后重新加载</div>
           <h3>商品名为空</h3>
        </div>
        <div class="cyloading">
            <svg
            version="1.1"
            id="dc-spinner"
            xmlns="http://www.w3.org/2000/svg"
            x="0px" y="0px"
            width:"38"
            height:"38"
            viewBox="0 0 38 38"
            preserveAspectRatio="xMinYMin meet"
            >
            <text x="7" y="21" font-family="Monaco" font-size="2px" style="letter-spacing:0.6" fill="#fff">达人抓取中，请勿关闭
            <animate
                attributeName="opacity"
                values="0;1;0" dur="1.8s"
                repeatCount="indefinite"/>
            </text>
            <path fill="#373a42" d="M20,35c-8.271,0-15-6.729-15-15S11.729,5,20,5s15,6.729,15,15S28.271,35,20,35z M20,5.203
            C11.841,5.203,5.203,11.841,5.203,20c0,8.159,6.638,14.797,14.797,14.797S34.797,28.159,34.797,20
            C34.797,11.841,28.159,5.203,20,5.203z">
            </path>
            <path fill="#373a42" d="M20,33.125c-7.237,0-13.125-5.888-13.125-13.125S12.763,6.875,20,6.875S33.125,12.763,33.125,20
            S27.237,33.125,20,33.125z M20,7.078C12.875,7.078,7.078,12.875,7.078,20c0,7.125,5.797,12.922,12.922,12.922
            S32.922,27.125,32.922,20C32.922,12.875,27.125,7.078,20,7.078z">
            </path>
            <path fill="#2AA198" stroke="#2AA198" stroke-width="0.6027" stroke-miterlimit="10" d="M5.203,20
                    c0-8.159,6.638-14.797,14.797-14.797V5C11.729,5,5,11.729,5,20s6.729,15,15,15v-0.203C11.841,34.797,5.203,28.159,5.203,20z">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                calcMode="spline"
                keySplines="0.4, 0, 0.2, 1"
                keyTimes="0;1"
                dur="2s" repeatCount="indefinite" />
            </path>
            <path fill="#859900" stroke="#859900" stroke-width="0.2027" stroke-miterlimit="10" d="M7.078,20
            c0-7.125,5.797-12.922,12.922-12.922V6.875C12.763,6.875,6.875,12.763,6.875,20S12.763,33.125,20,33.125v-0.203
            C12.875,32.922,7.078,27.125,7.078,20z">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                dur="1.8s"
                repeatCount="indefinite" />
            </path>
            </svg>
        </div>
    `
     $("body").append(div);
    let rex = window.location.href;
    // apiHost
    var apiHost = "https://api.oa.cyek.com/";
    const version = "1.0.4"

    let intervals
    const countdown = (text,callback,time=60)=>{
        clearInterval(intervals); // 清除之前的计时器
        var countdownTimer = time;
        intervals = setInterval(function() {
            document.querySelector(".h1_content").style.display = "flex";
            document.getElementById("content_text").innerText =text;
            document.getElementById("countdown").innerText = countdownTimer;
            countdownTimer--;
            if (countdownTimer < 0) {
                clearInterval(intervals);
                document.querySelector(".h1_content").style.display = "none";
                if(callback) {
                    callback()
                }else{
                    window.location.reload();
                }
            }
        }, 1000);
    }

    function req(url,data,sucFun,specialFun){
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data),
            onload: function(res) {
                if (res.status == 200) {
                    var text = res.responseText;
                    var json = JSON.parse(text);
                    // console.log(json);
                    if(json.code == 1000){
                        sucFun(json)
                    }else if(json.code == 1002){
                        window.close()
                    }else{
                        window.close()
                        if (typeof(specialFun) == "function") {
                            specialFun()
                        }
                    }
                }
            }
        });
    }

    function getCookie(cname)
    {
        var name = cname + "=";
        var ca = document.cookie.split(';').reverse();
        for(var i=0; i<ca.length; i++)
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    }
    //检测元素出现的方法
    function waitForElement(selector) {
        return new Promise((resolve) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
            } else {
                const observer = new MutationObserver((mutations) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        observer.disconnect();
                        resolve(element);
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }
        });
    }
    function waitForAnyElement(selectors=[]) {
        return new Promise((resolve) => {
            const elements = selectors.map(selector => document.querySelector(selector));
            const hasElement = elements.some(element => element);

            if (hasElement) {
                const foundElement = elements.find(element => element);
                resolve(foundElement);
            } else {
                const observer = new MutationObserver((mutations) => {
                    const foundElement = selectors.map(selector => document.querySelector(selector)).find(element => element);
                    if (foundElement) {
                        observer.disconnect();
                        resolve(foundElement);
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            }
        });
    }
    //代码延时
    function delay(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        })
    }
    //阿里妈妈
    if(rex.match(/https:\/\/chuangyi.taobao.com\/*/) != null){
        window.onload = async function() {
            await waitForElement('.kb-login-panel-user-nick')//检测是否登录
            await waitForElement('.kb-view-page-icon-item:nth-child(2)')
            let lee= document.querySelectorAll(".kb-view-page-icon-item:nth-child(2)")[0]//点击绘剪
            console.log(lee)
            // 创建一个点击事件
            let clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: false,
                view: unsafeWindow
            });
            lee.dispatchEvent(clickEvent);
        }
    }
    // 模拟输入文本
    function simulateTyping(input, text) {
        const event = new Event('input', { bubbles: true });
        const inputField = document.querySelector(input);
        let lastValue = inputField.value
        inputField.value = text;
        let tracker = inputField._valueTracker;
        tracker.setValue(lastValue);
        inputField.dispatchEvent(event);
    }
    //阿里妈妈绘剪入口
    if(rex.match(/https:\/\/chuangyi.taobao.com\/external\/meditorLite\/*/) != null){
        window.onload = async function() {
            //商品数组
            const skus = [
{
                    "sku_id_encrypt": "j9787c6605a2311ef",
                    "sku_name": "京东健康-富士康店检-A心脑血管套餐(A2)女性",
                    "sku_short_name": "京东健康富士康店检a心脑血管套餐",
                    "link1": "//detail.tmall.com/item.htm?id=674810751993&ns=1&abbucket=4&umpChannel=bybtqdyh&u_channel=bybtqdyh&xxc=taobaoSearch&skuId=5748869354322",
                    "link2": "//detail.tmall.com/item.htm?id=689684899069&ns=1&abbucket=4&xxc=taobaoSearch&skuId=5521777496052",
                    "link3": "//detail.tmall.com/item.htm?id=551063491078&ns=1&abbucket=4&xxc=taobaoSearch&skuId=5681523126517"
                }, {
                    "sku_id_encrypt": "04810ed449e52c6ed356",
                    "sku_name": "美国原装进口康力士乳清蛋白粉400克动物蛋白质粉成人中老年人营养品2桶",
                    "sku_short_name": "康力士乳清蛋白粉",
                    "link1": "//item.taobao.com/item.htm?id=678868366558&ns=1&abbucket=4&xxc=taobaoSearch",
                    "link2": "//detail.tmall.com/item.htm?id=565099574868&ns=1&abbucket=4&xxc=taobaoSearch&skuId=5767771899978",
                    "link3": "//item.taobao.com/item.htm?id=586419804215&ns=1&abbucket=4&xxc=taobaoSearch"
                }, {
                    "sku_id_encrypt": "b06dca0120fdc6d704b1",
                    "sku_name": "雀巢健康科学 佳膳悠选 400克 特殊医学用途全营养配方食品 送礼 400g3罐 全营养特配",
                    "sku_short_name": "400g3罐",
                    "link1": "//detail.tmall.com/item.htm?id=796150927198&ns=1&xxc=ad_ztc&skuId=5615122868776",
                    "link2": "//detail.tmall.com/item.htm?id=622660322737&ns=1&abbucket=4&xxc=taobaoSearch&skuId=5445569154055",
                    "link3": "//item.taobao.com/item.htm?id=740671016566&ns=1&abbucket=4&xxc=taobaoSearch&skuId=5522971564613"
                }, {
                    "sku_id_encrypt": "j1f782e67fe8047e30208",
                    "sku_name": "杰士邦 超凡持久避孕套 超薄安全套 男用延时套 苯佐卡因延迟套套 情趣用品 成人计生 【90%2次购买】纯超凡持久10只",
                    "sku_short_name": "杰士邦超凡持久组合",
                    "link1": "//detail.tmall.com/item.htm?id=675072347115&ns=1&xxc=ad_ztc&skuId=4854989477240",
                    "link2": "//detail.tmall.com/item.htm?id=43030795002&ns=1&abbucket=4&xxc=taobaoSearch&skuId=5076668665362",
                    "link3": "//detail.tmall.com/item.htm?id=43863743986&ns=1&abbucket=4&xxc=taobaoSearch&skuId=5084546771131"
                }, {
                    "sku_id_encrypt": "2809b69103214320bfc9",
                    "sku_name": "Moslate肠胃益生菌片非粉剂益生菌成人调理肠胃肠道便秘肠胃脾胃虚弱口臭",
                    "sku_short_name": "德国进口调理肠胃肠道",
                    "link1": "//detail.tmall.com/item.htm?id=710274181930&ns=1&xxc=ad_ztc&skuId=5613575812574",
                    "link2": "//detail.tmall.com/item.htm?id=837690098992&ns=1&abbucket=4&xxc=taobaoSearch&skuId=5606547585618",
                    "link3": "//detail.tmall.com/item.htm?id=840061939360&ns=1&abbucket=4&xxc=taobaoSearch"
                }, {
                    "sku_id_encrypt": "400e8d89cf06b4eab20c",
                    "sku_name": "ENLANG鹿胎素纯鹿胎素膏胶囊羊胎素粉添加PQQ大豆异黄酮内膜薄 鹿胎素* 一瓶基础装",
                    "sku_short_name": "恩朗美国进口鹿胎素胶",
                    "link1": "//detail.tmall.com/item.htm?id=732717226194&ns=1&abbucket=4&xxc=taobaoSearch&skuId=5241080938865",
                    "link2": "//detail.tmall.com/item.htm?id=684165995901&ns=1&abbucket=4&xxc=taobaoSearch&skuId=5126044220999",
                    "link3": ""
                }, {
                    "sku_id_encrypt": "e622e9091cdeb6a87127",
                    "sku_name": "Excellent-Med德国强力消石素胶囊胆结石通肾结石药尿结石进口香港直邮150粒 德国消石素（双料配方150粒1瓶） 金钱草，白桦，紫锥花，木贼，一支黄花，垂柳，燕叶",
                    "sku_short_name": "excellentmed德国消石素胶囊",
                    "link1": "//detail.tmall.com/item.htm?id=626049596527&ns=1&abbucket=4&xxc=taobaoSearch",
                    "link2": "//detail.tmall.com/item.htm?id=612249263201&ns=1&abbucket=4&xxc=taobaoSearch",
                    "link3": "//detail.tmall.com/item.htm?id=644717704358&ns=1&abbucket=4&xxc=taobaoSearch&skuId=5021837207492"
                }, {
                    "sku_id_encrypt": "j677c02116610af62a8b8",
                    "sku_name": "草本星球电子口腔雾化棒 中药草本口气清新提神  便携式气体植物饮料 菠萝冰8ml",
                    "sku_short_name": "草本星球电子雾化菠萝冰",
                    "link1": "",
                    "link2": "",
                    "link3": ""
                }, {
                    "sku_id_encrypt": "0822fb912c3a0702a750",
                    "sku_name": "雷允上 胶城牌阿胶地黄人参口服液   增强免疫力品礼品送长辈【送礼礼盒】汉方滋补 养心方 美颜方 600ml(20ml/支*30支)",
                    "sku_short_name": "雷允上胶城人参口服液",
                    "link1": "//detail.tmall.com/item.htm?id=768433892124&ns=1&abbucket=4&xxc=taobaoSearch&skuId=5444455663362",
                    "link2": "//item.taobao.com/item.htm?id=807654599996&ns=1&abbucket=4&xxc=taobaoSearch&skuId=5491507993221",
                    "link3": ""
                }
            ]
            await delay(5000)
            saveLink(0)
            //处理链接数据
            async function saveLink (i,callback){
                console.log(skus[i]?.sku_name,"商品名")
                document.querySelector('h3').innerHTML = skus[i]?.sku_name
                const linksArray = [skus[i]?.link1, skus[i]?.link2, skus[i]?.link3].filter(link => link);
                if(linksArray.length==0) return saveLink(i+1)
                if(i==skus.length-1&&linksArray.length==0) return alert("所有数据处理完毕")
                await saveLinkData(linksArray,0,i,async()=>{
                    console.log(i,skus.length,'skus.length')
                    if(i==skus.length-1) {
                        return alert("所有数据处理完毕")
                    }else{ //一条数据处理完后开启下一条数据处理
                        console.log("开启下一条数据处理")
                        await waitForElement('.item-wrapper button')
                        document.querySelector('.item-wrapper button').click()
                        return saveLink(i+1)
                    }
                })
            }
            async function saveLinkData (arr,e,i,fc){
                console.log("正在处理"+arr[e],e,"第"+i+"个数据")
                await waitForElement('.mux-input-inner')
                let dom = document.querySelector(".mux-input-inner")
                dom.focus()
                await delay(3000)
                console.log("https:"+arr[e],dom)
                simulateTyping('.mux-input-inner', 'https:'+arr[e])
                await delay(3000)
                document.querySelector(".add-item").click()//点击
                await delay(3000)
                document.querySelector(".generate-btn").click()//点击
                console.log("处理完成")
                await waitForElement('#creation-panel')
                await waitForAnyElement(['.no-templates','.save-btn-wrapper'])
                let noDom = document.querySelector(".no-templates")
                console.log(noDom,'nono')
                if(noDom){
                    if(arr.length -1==e){//3个链接处理完毕
                        return await fc()
                    }
                    console.log("数据为空取下一个连接")
                    await waitForElement('.item-wrapper button')
                    document.querySelector('.item-wrapper button').click()
                    return saveLinkData(arr,e+1,i,fc)
                }
                await waitForElement('.item-body')
                await waitForElement('.save-btn-wrapper')
                await delay(10000)
                let eleVideo = document.querySelectorAll(".save-btn-wrapper")
                console.log(eleVideo.length+"个视频")
                if(eleVideo.length>9){
                    await handleVideo(6,i);
                    await handleVideo(7,i);
                    await handleVideo(8,i);
                }else{
                    if(eleVideo.length>=3) await handleVideo(2,i);
                    if(eleVideo.length>=1) await handleVideo(1,i);
                    if(eleVideo.length>=0) await handleVideo(0,i);
                }
                console.log(arr.length,e,'eee')
                if(arr.length -1==e){//3个链接处理完毕
                    console.log(arr.length+"个链接处理完毕")
                    await fc()
                }else{
                    await waitForElement('.item-wrapper button')
                    document.querySelector('.item-wrapper button').click()
                    await saveLinkData(arr,e+1,i,fc)
                }
            }
            //处理视频数据
            async function handleVideo(index,e){//处理视频数据
                let i = index +1
                document.querySelector(`.video-item:nth-child(${i}) .footer-operation button:first-child`).click()
                console.log(`第${i}个视频的编辑器加载完成，点击编辑智能解说按钮`)
                await waitForElement('.cEAoAR')
                await delay(3000)
                document.querySelector(`[data-testid="edit-text-to-speech"]`).click()
                console.log("等待文案生成")
                await delay(10000);
                document.querySelector('.sc-cWSHoV').value = '50';
                let textarea = document.querySelector(`.mux-textarea-inner`).value
                console.log(`第${i}个视频的文案为：${textarea}`)
                if (textarea.length == 0) {
                    let btn = document.querySelector("[data-testid='regenerate-btn']")
                    if(btn){
                        console.log(`点击重新生成文案`);
                        btn.click()
                        let text = document.querySelector(`.mux-textarea-inner`).value
                        text = textarea.slice(0, 60);
                        console.log(`处理后：${text}`)
                        document.querySelector('.mux-textarea-inner').value = '';
                        simulateTyping('.mux-textarea-inner', text)
                    }else{
                        alert("没找到生成按钮")
                    }
                }else{
                    //处理字符
                    textarea = textarea.slice(0, 60);
                    simulateTyping('.mux-textarea-inner', textarea)
                    console.log("处理字符完毕",textarea)
                }
                await delay(3000);
                //
                let subBtn = document.querySelector('[data-testid="confirm-btn"]')
                if(subBtn)subBtn.click()//点击确认文案
                await delay(10000);
                let saveBtn = document.querySelector('.sc-dExYaf:nth-child(2) button:nth-child(2)')
                if(saveBtn)saveBtn.click()//点击确认编辑
                console.log("hover第"+i+"个视频")
                document.querySelector(`.video-item:nth-child(${i}) .save-btn-wrapper button:first-child`).click()
                console.log(`开始下载第${i}个视频`)
                await waitForElement('.content-wrapper iframe')
                let u = new URL(document.querySelector(".content-wrapper iframe").src)
                let src = new URLSearchParams(u.search).get('content_data');
                src = JSON.parse(src)
                src = src.video.url
                let urlData = {
                    sku_id:skus[e]?.sku_id_encrypt,
                    keyword:skus[e]?.sku_name,
                    img:src+'?x-oss-process=video/snapshot,t_0,w_720,h_1280',
                    video:src
                }
                console.log(urlData,'urlData')
                 await req(apiHost+"pushAiPost",urlData,async function(res){
                     console.log(res,'请求完毕')
                     await waitForElement('.mux-drawer-close')
                     await delay(3000)
                     //关闭
                    return document.querySelector('.mux-drawer-close').click()
                })

            }
        }
    }

    // 登录框拖拽
    function dragInfo(yTop,yBot){
        var _move1=false;//移动标记
        var _x1,_y1;//鼠标离控件左上角的相对位置
        $(".cyOperate").click(function(){
            //alert("click");//点击（松开后触发）
        }).mousedown(function(e){
            //console.log(e);
            _move1=true;
            _x1=e.pageX-parseInt($(".cyOperate").css("left"));
            _y1=e.pageY-parseInt($(".cyOperate").css("top"));
            // $(".operate").fadeTo(20, 0.5);//点击后开始拖动并透明显示
        });
        $(document).mousemove(function(e){
            if(_move1){
                var x=e.pageX-_x1;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y=e.pageY-_y1;
                // console.log("y",y);
                if(x < 0){
                    x = 0;
                }else if(x > $(document).width() - $('.cyOperate').outerWidth(true)){ // 判断是否超出浏览器宽度
                    x = $(document).width() - $('.cyOperate').outerWidth(true)
                }
                if (y < yTop) {
                    y = yTop;
                } else if (y > $(window).height() - $('.cyOperate').outerHeight(true) + yBot) { // 判断是否超出浏览器高度
                    y = $(window).height() - $('.cyOperate').outerHeight(true) + yBot;
                }
                $(".cyOperate").css({top:y,left:x});//控件新位置
            }
        }).mouseup(function(){
            _move1=false;

            // 记录每次拖拽后位置存储
            localStorage.setItem("elLeftLogin",$(".cyOperate").css("left"));
            localStorage.setItem("elTopLogin",$(".cyOperate").css("top"));
            // $(".operate").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
        });
    }

    // 获取登录框拖拽后位置
    var elLeftLogin = localStorage.getItem("elLeftLogin");
    var elTopLogin = localStorage.getItem("elTopLogin");
    $(".cyOperate").css({
        "left": elLeftLogin,
        "top": elTopLogin
    })

    dragInfo(100,0)
    // Your code here...
})();