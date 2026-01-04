// ==UserScript==
// @name         掘金签到+可视化智能抽奖
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  掘金签到和智能可视化抽奖
// @author       凡繁烦
// @icon         chrome://favicon/http://juejin.cn/
// @grant        GM_getValue
// @grant        GM_setValue
// @create       2021-08-29
// @run-at       document-body
// @include      https://juejin.cn/*
// @exclude      https://juejin.cn/editor/drafts/*
// @require      https://unpkg.com/coco-message/coco-message.min.js
// @note         2021-09-29 V0.1.2 增加自动签到，签到后使用一次免费抽奖；使用第三方弹框库提示;排除文章编辑页面
// @downloadURL https://update.greasyfork.org/scripts/431457/%E6%8E%98%E9%87%91%E7%AD%BE%E5%88%B0%2B%E5%8F%AF%E8%A7%86%E5%8C%96%E6%99%BA%E8%83%BD%E6%8A%BD%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/431457/%E6%8E%98%E9%87%91%E7%AD%BE%E5%88%B0%2B%E5%8F%AF%E8%A7%86%E5%8C%96%E6%99%BA%E8%83%BD%E6%8A%BD%E5%A5%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var autoSign = true;

    console.log(
              `%c 反馈问题->掘金 %c https://juejin.cn/post/7000936088969674783 %c`,
              `background:#2d8cf0;border:1px solid #2d8cf0; padding: 1px; border-radius: 4px 0 0 4px; color: #fff;`,
              `border:1px solid #2d8cf0; padding: 1px; border-radius: 0 4px 4px 0; color: #2d8cf0;`,
              'background:transparent'
          )

    cocoMessage.config({
        duration: 2000,
    });

    const styleContent = `
    ._jj_draw_container {
        position:fixed;
        top: 80px;
        right: 0;
        z-index: 9999;
        background-color: rgba(0,0,0,0.6);
        padding: 20px;
    }
        ._jj_button {
            padding: 6px;
            background-color: #1e80ff;
            color: #fff;
            border-radius: 4px;
            text-align: center;
            vertical-align: middle;
            border: 1px solid transparent;
            font-weight: 700;
            letter-spacing: 1em;
            text-indent: 1em;
            cursor: pointer;
        }
        ._jj_btn_sign_in{
            background-color:#e8f3ff !important;
            color:#1e80ff !important;
        }
        ._jj_button:hover {
            opacity: 0.8;
        }
        table._jj_hovertable thead {
            text-align: center;
            font-size: 16px;
            font-weight: 700;
            color:#333;
        }
        table._jj_hovertable {
            font-family: verdana, arial, sans-serif;
            font-size: 11px;
            color: #d25f00;
            border-width: 1px;
            border-color: #999999;
            border-collapse: collapse;
        }
        table._jj_hovertable th {
            background-color: #c3dde0;
            border-width: 1px;
            padding: 8px;
            border-style: solid;
            border-color: #a9c6c9;
        }
        table._jj_hovertable tr {
            background-color: #fff;
        }
        table._jj_hovertable td {
            border-width: 1px;
            padding: 8px;
            border-style: solid;
            border-color: #a9c6c9;
        }
        ._jj_button_close{
            font-size: 20px;
            font-weight: 700;
            color: #FFF;
        }
        .__jj_dialog_title{
            display: flex;
        }
        .__jj_dialog_title_left{
            flex:1;
            font-size: 14px;
            color: #fff;
        }
        .__jj_dialog_title_left span{
            color: #1e80ff;
            font-size:20px;
            font-weight: 700;
        }
        .__jj_dialog_title_right{
            width: 30px;
        }

    `;


    const htmlContent = `
    <div class="">
        <div class="__jj_dialog_title">
            <div class="__jj_dialog_title_left" id="__jj_dialog_title_left" style="visibility:hidden;">矿石<span id="ore_num">0</span>个 | 可抽奖<span id="draws_num">0</span>次</div>
            <div class="__jj_dialog_title_right">
            <a href="javascript:void(0)" id="_jj_btn_close" class="_jj_button_close">X</a>
            </div>
        </div>
        <div style="text-align:center;margin: 10px;">
            <button id="_jj_btn_sign_in" type="button" class="_jj_button _jj_btn_sign_in">签到</button>
            <button id="_jj_btn_draw" type="button" class="_jj_button _jj_btn_draw">抽奖</button>
            <button id="_jj_btn_stop" type="button" class="_jj_button">停止</button>
            
        </div>
        <table class="_jj_hovertable">
            <thead>
                <tr>
                    <td>奖品图标</td>
                    <td>奖品名称</td>
                    <td>中奖次数</td>
                    <td>累计奖励</td>
                </tr>
            <tbody id="_jj_tbodyList">
            </tbody>
            </thead>
        </table>
    </div>
    `



    function appendStyle(text) {
        const styleEl = document.createElement('style');
        styleEl.textContent = text;
        document.head.appendChild(styleEl);
    }

    function appendHTML(htmlContent) {
        const htmlEl = document.createElement('div');
        htmlEl.id = "_jj_draw_container";
        htmlEl.className = "_jj_draw_container";
        htmlEl.innerHTML = htmlContent;
        document.body.appendChild(htmlEl);
        getCurPoint();
    }

    appendStyle(styleContent);
    appendHTML(htmlContent);

    let lotteryConfig = [];
    let isDrawing = false;
    let prizes = [];
    const tbodyListEl = document.getElementById("_jj_tbodyList")

    function delay(fn = () => { }, delay = 5000, context = null) {
        let ticket = null;
        let runned = false;
        return {
            run(...args) {
                return new Promise((resolve, reject) => {
                    if (runned === true) {
                        return;
                    }
                    runned = true;
                    ticket = setTimeout(async () => {
                        try {
                            const res = await fn.apply(context, args);
                            resolve(res);
                        } catch (err) {
                            reject(err)
                        }
                    }, delay)
                })
            },
            cancel: () => {
                clearTimeout(ticket);
            }
        }
    }

    function getLotteryConfig() {
        return fetch("https://api.juejin.cn/growth_api/v1/lottery_config/get")
            .then(res => res.json())
    }

    function getSignCount(){
        return fetch('https://api.juejin.cn/growth_api/v1/get_counts?aid=2608&uuid=6986922219256989198',{
            method: 'GET',
            credentials: "include"
        }).then(res => res.json())
    }

    function getCurPoint(){
        return fetch('https://api.juejin.cn/growth_api/v1/get_cur_point?aid=2608&uuid=6986922219256989198',{
            method: 'GET',
            credentials: "include"
        }).then(res => res.json()).then(data=>{
            document.getElementById("ore_num").innerText = data.data;
            document.getElementById("draws_num").innerText = Math.floor(data.data/200);
            document.getElementById("__jj_dialog_title_left").style.visibility='visible';
        })
    }

    function onSignIn(isAuto=false) {
        return fetch('https://api.juejin.cn/growth_api/v1/check_in',{
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json;charset=utf-8;'
            },
            body: JSON.stringify({aid: '2608',uuid:'6986922219256989198'})
        }).then(res => res.json()).then(data=>{
            if(data.err_no!==0){
                cocoMessage.error(data.err_msg)
            }else{
                onSuccess(isAuto);
            }
        })
    }

    //自动签到
    function autoSignHandle(){
        let signDate = GM_getValue("signDate");
        console.log(signDate)
        if(autoSign && (!signDate || signDate < today())){
            onSignIn(true)
        }
    }

    autoSignHandle();

    //获取今天的日期
    function today(){
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        return currentdate;

    }

    async function onSuccess(isAuto){
        const count = await getSignCount();
        getCurPoint();
        GM_setValue("signDate",today())
        cocoMessage.success(`签到成功,连续签到${count.data.cont_count}天,累计签到${count.data.sum_count}天`);
        if(isAuto){
          onDraw(!isAuto)
        }
    }

    // {"err_no":7003,"err_msg":"积分不足，无法进行抽奖lack of point","data":null}
    function doDraw() {
        return fetch('https://api.juejin.cn/growth_api/v1/lottery/draw', {
            method: 'POST',
            credentials: "include"
        }).then(res => res.json())
    }


    async function onDraw(isOnce=true) {
        if (isDrawing) {
            return;
        }
        isDrawing = true;

        try {
            let errNo = 0;
            do {
                if(!isDrawing){
                    break;
                }

                const res = await doDraw();
                getCurPoint();
                errNo = res.err_no;

                if (errNo !== 0) {
                    cocoMessage.error(res.err_msg);
                    isDrawing = false;
                    break;
                }

                // 增加奖励
                addPrize(res.data)
                // 渲染
                renderPrizes();
                // 暂停16ms
                await delay(undefined, 16).run();

                //isDrawing = false;
                //break;

            } while (errNo == 0 && isOnce)

        } catch (err) {
            isDrawing = false
            cocoMessage.error(err.message);
        }
    }

    function addPrize(data) {

        let prize = prizes.find(p => p.lottery_id == data.lottery_id);
        if(!prize) {
            return;
        }
        prize.counts += 1;

    }

    function onStop() {
        isDrawing = false;
    }

    function getTotal(data){
        if(data.lottery_id == "6981716980386496552" || data.lottery_name == "66矿石"){
            return data.counts * 66;
        }
        return data.counts;
    }

    function renderPrizes() {
        tbodyListEl.innerHTML = prizes.map(prize => `
        <tr id="_jj_${prize.lottery_id}">
            <td class="_jj_price_icon"><img style="height:30px" src="${prize.lottery_image}" /></td>
            <td>${prize.lottery_name}</td>
            <td class="_jj_count">${prize.counts}</td>
            <td class="_jj_total">${getTotal(prize)}</td>
        </tr>
    `).join("");

    }


    async function init() {
        lotteryConfig = (await getLotteryConfig()).data.lottery;

        prizes = lotteryConfig.map(c => ({
            lottery_id: c.lottery_id,
            lottery_name: c.lottery_name,
            lottery_image: c.lottery_image,
            counts: 0
        }));

        renderPrizes();
        document.getElementById("_jj_btn_sign_in").addEventListener("click",onSignIn)
        document.getElementById("_jj_btn_draw").addEventListener("click", onDraw);
        document.getElementById("_jj_btn_stop").addEventListener("click", onStop);
        document.getElementById("_jj_btn_close").addEventListener("click", function () {
            document.querySelector("#_jj_draw_container").style.display = "none"
        });
    }
    init();
})();