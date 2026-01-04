// ==UserScript==
// @name         脚本测试---------------------
// @version      1.0.0
// @description  同步华为商城服务器时间，毫秒级抢购
// @author       LongM

// @grant        GM_setValue
// @grant        GM_getValue
// @match        https://www.vmall.com/product/*.html
// @match        https://*.cloud.huawei.com/*
// @match        https://www.vmall.com/member/*
// @match        https://sale.vmall.com/rush/*
// @include      https://www.vmall.com/cart2
// @include      https://www.vmall.com/order/confirmcart
// @grant        GM_xmlhttpRequest
// @run-at document-start
// @namespace https://greasyfork.org/users/669806
// @downloadURL https://update.greasyfork.org/scripts/429729/%E8%84%9A%E6%9C%AC%E6%B5%8B%E8%AF%95---------------------.user.js
// @updateURL https://update.greasyfork.org/scripts/429729/%E8%84%9A%E6%9C%AC%E6%B5%8B%E8%AF%95---------------------.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let STARTTIME = 0 // 活动开始时间
    let NETWORKTIME = 0 // 网络延迟
    let SKUID=0
    let paras ={}
    let options={}
    window.onload = () => {
        // 界面显示
        if (window.location.href.indexOf('/enterprise') !== -1) {
            initBox()
        }

       if(window.location.href.indexOf('/confirmcart') !== -1){
           initBox()
       }
        if(window.location.href.indexOf('/cart2') !== -1){
           if(GM_getValue('ADDTOBUY') == 1)
           {
               GM_setValue('ADDTOBUY',0)
               alert("修改变量成功，确认后将跳转订单界面")
               document.querySelector("#app > div > div.layout > div:nth-child(4) > div > div.sc-total-btn > a").click()
           }
       }
    }

    let cycle = 0

    const initBox = () => {
            const style = `#rushToBuyBox{z-index: 9999;background-color:rgba(255,255,255,0.7);width:260px;font-size:14px;position:fixed;top:20%;right:-150px;padding:10px;border-radius:5px;box-shadow:1px 1px 9px 0 #888;transition:right 1s;text-align:center}#rushToBuyBox:hover{right:10px}.title{font-size:16px;font-weight:bold;margin:10px 0}.title span{font-size:12px;color:#9c9c9c}#formList{margin:10px}.time span{color:red}#formList input{background:0;height:20px;font-size:14px;outline:0;border:1px solid #ccc;margin-bottom:10px}#formList input:focus{border:1px solid #4ebd0d}#formList div span{font-size:12px;color:red}#formList div{margin-bottom:10px}.countdown{margin-top:10px}`
            const html = `
                    <div id='rushToBuyBox'>
                        <h3 class="title">
                            华为商城抢购助手 <span>by: LONGM</span>
                        </h3>
                        <div class='time'>
                            <p>网络延迟: <span id='timer'>200ms</span></p>
                        </div>
                        <div id='formList'>
                            <div>data-skucode</div>
                            <input type="text" id="skuId" value="" placeholder="" /><br><button id='addToBuy'>添加到购物车</button>
                            <div>多少毫秒提交一次(建议2000)</div>
                            <input type="text" id="oldtime" value="2000" placeholder="" /><span>ms</span>
                            </br>
                            <button id='rushToBuy'>开始运行</button><button style='margin-left:5px' id='stop'>停止</button><button style='margin-left:5px' id='getTimer'>测试延迟</button>
                        </div>
                        <div class='countdown'>倒计时: <span id='g_countdown'>1天 2:3:4</span></div>
                    </div>
                    `
            var stylenode = document.createElement('style');
            stylenode.setAttribute("type", "text/css");
            if (stylenode.styleSheet) { // IE
                stylenode.styleSheet.cssText = style;
            } else { // w3c
                var cssText = document.createTextNode(style);
                stylenode.appendChild(cssText);
            }
            var node = document.createElement('div');
            node.innerHTML = html;
            document.head.appendChild(stylenode);
            document.body.appendChild(node);
            const skuInput = document.querySelector('#skuId')
            const addToBuy=document.querySelector('#addToBuy')
           // 设置活动开始时间

            const countdown = document.querySelector('#rushToBuy')
            const stop = document.querySelector('#stop')
            const getTimer=document.querySelector('#getTimer')

            getTimer.addEventListener('click', () => {
                SKUID=skuInput.value
                getSkuRushbuyInfo(SKUID,new Date().getTime())
                // 延时
                document.querySelector('#timer').innerText = NETWORKTIME
            })
            addToBuy.addEventListener('click', () => {
                const temp={"salePortal": 1, "saleChannel": 1001,"needResultset": 0,"cartjson": "{\"itemCode\":\"3102020019601\",\"itemType\":\"I\",\"qty\":1}"}
                temp.cartjson="{\"itemCode\":\""+document.querySelector("#skuId").value+"\",\"itemType\":\"I\",\"qty\":1}"
                ec.cart.add(temp,options)
                GM_setValue('ADDTOBUY',1)
                setTimeout(function(){ document.location.href="https://www.vmall.com/cart2"; }, 3000);
            })
            countdown.addEventListener('click', () => {
                countdown.disabled = true
                countdown.innerText = '抢购中...'
                sessionStorage.setItem('isRun', true)
                rushToBuy(document.querySelector("#oldtime").value)
            })
            stop.addEventListener('click', () => {
                countdown.disabled = false
                countdown.innerText = '开始运行'
                sessionStorage.setItem('isRun', false)
                clearInterval(cycle)
            })

        }
        // 获取活动信息
    const getSkuRushbuyInfo = (skuIds, getTime) => {
            const details = {
                method: 'GET',
                url: `https://buy.vmall.com/getSkuRushbuyInfo.json?skuIds=${skuIds}&t=${new Date().getTime()}`,
                onload: (responseDetails) => {
                    if (responseDetails.status === 200) {
                        const res = JSON.parse(responseDetails.responseText)
                        NETWORKTIME = res.currentTime - getTime
                        STARTTIME = res.skuRushBuyInfoList[0].startTime
                        console.log(res)
                    }
                }
            }
            GM_xmlhttpRequest(details)
        }
   const getBuyRoom=()=>{
       const details = {
                method: 'GET',
                url: `https://openapi.vmall.com/mcp/queryCart?lang=zh-CN&country=CN&portal=1&_=${new Date().getTime()}`,
                onload: (responseDetails) => {
                    if (responseDetails.status === 200) {
                        console.log(res)
                    }
                }
            }
            GM_xmlhttpRequest(details)
   }
        // 购买
    const rushToBuy = (time) => {
           cycle=setInterval(()=>{
               ec.order.submit();
               document.querySelector("#no_product_tips > div > div.box-header > div.box-tc > div.box-tc2 > a").click()
           },time);
           console.log("启动定时器"+cycle)
        }

        // 抢购倒计时对比
    const getDistanceSpecifiedTime = (dateTime, currentTime) => {
            // 指定日期和时间
            var EndTime = new Date(dateTime).getTime();
            // 当前系统时间
            // var NowTime = new Date();
            // var t = EndTime.getTime() - NowTime.getTime();
            var t = EndTime - currentTime
            var d = Math.floor(t / 1000 / 60 / 60 / 24);
            var h = Math.floor(t / 1000 / 60 / 60 % 24);
            var m = Math.floor(t / 1000 / 60 % 60);
            var s = Math.floor(t / 1000 % 60);
            return `${fillZero(d)}天 ${fillZero(h)}:${fillZero(m)}:${fillZero(s)}`
        }
        // 格式化时间
    const formatTime = (time) => {
            var datetime = new Date();
            datetime.setTime(time);
            var year = datetime.getFullYear();
            var month = datetime.getMonth() + 1
            var date = datetime.getDate()
            var hour = datetime.getHours()
            var minute = datetime.getMinutes()
            var second = datetime.getSeconds()
            return `${year}-${fillZero(month)}-${fillZero(date)} ${fillZero(hour)}:${fillZero(minute)}:${fillZero(second)}`
        }
        // 补零
    const fillZero = (str, len = 2) => {
        return (`${str}`).padStart(len, '0')
            // return (`${str}`).slice(-len)
    }
})();