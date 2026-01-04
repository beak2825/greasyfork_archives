// ==UserScript==
// @name         Fanatical批量刮key
// @namespace    kb1000fx
// @version      0.6
// @description  批量提取整理F站key
// @author       kb1000fx
// @include      https://www.fanatical.com/*
// @include      /https://www\.fanatical\.com/[\S]*redeem-code$/
// @icon         https://cdn.fanatical.com/production/icons/favicon-32x32.png
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.onload
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/436105/Fanatical%E6%89%B9%E9%87%8F%E5%88%AEkey.user.js
// @updateURL https://update.greasyfork.org/scripts/436105/Fanatical%E6%89%B9%E9%87%8F%E5%88%AEkey.meta.js
// ==/UserScript==

(function(){
    'use strict';
    unsafeWindow.$ = $;
    let gameTitles = [];

    const cbxHTML = `
        <div class="checkbox">
            <input type="checkbox" name="ordercbx"/>        
        </div>
    `;

    const textHTML = `
        <div id="redeem-input">
            <p class="redeem-form-label">批量激活</p>
            <div class="input-group">
                <textarea class="form-control" rows="10"/>
                <div class="input-group-append">
                    <button id="redeem-code-btn" class="btn btn-primary">批量激活</button>
                </div>
            </div>
            <p class="redeem-form-label">优惠券检验</p>
            <div class="input-group">
                <input type="text" id="voucher-input" class="form-control">
                <div class="input-group-append">
                    <button id="voucher-check-btn" class="btn btn-primary">优惠券检验</button>
                </div>
            </div>
        </div>
    `;

    const css = `
        .table-item{
            display: flex;
            flex-direction: row;
        }
        .checkbox{
            display: flex;
            justify-content:center; 
            width: 5%;
            align-items: center;
        }
        .table-item a{
            width: 95%
        }
        .tm-panel{
            margin-bottom: 24px;
        }
        .tm-btn{
            margin-right: 20px;
        }
        #redeem-input .input-group{
            margin-bottom: 16px;
        }
    `;

    const panelHTML = `
        <div class="tm-panel">
            <button id="redeem-btn" class="btn btn-primary tm-btn">刮Key</button>
            <button id="get-btn" class="btn btn-primary tm-btn">提取</button>
            <button id="copy-btn" class="btn btn-primary tm-btn">复制</button>
            <input type="checkbox" name="showName" checked /> 显示名称
        </div>
    `;

    let orderIDList = [];
    let unrevealedList = [];
    let revealedList = [];
    let sortedJson ={};
    let str = "";

    const getRes = async ()=>{
        orderIDList = [];
        unrevealedList = [];
        revealedList = [];
        $("input[name='ordercbx']:checked").each(function (i,e){
            const orderStr = $(e).parent("div").next().attr("href");
            orderIDList.push( orderStr.split("/")[3] ); 
        });        
        console.log(`已选择 ${orderIDList.length}个订单`);
        let gameList = [];
        for (let index = 0; index < orderIDList.length; index++) {
            const ID = orderIDList[index];
            await fetch(`https://www.fanatical.com/api/user/orders/${ID}`, {
                method: 'GET',
                headers: {
                    'anonid': JSON.parse(window.localStorage.bsanonymous).id,
                    'authorization': JSON.parse(window.localStorage.bsauth).token,
                    'content-type': 'application/json; charset=utf-8'
                }
            }).then(res => res.json()).then(res => {
                console.log(res)
                if (res.status == "COMPLETE") { 
                    for (const item of res.items) {
                        if (item.type == "game") {
                            gameList.push(item)
                        } else if (item.type == "bundle") {
                            for (const tier of item.bundles) {
                                gameList = [...gameList, ...tier.games]
                            }
                        } else {
                            console.log(item)
                        }
                    }
                } else {
                    console.log(`Order ${res._id} is ${res.status}`)
                }
            })
            console.log(gameList)
        }
        for (let index = 0; index < gameList.length; index++) {
                const game = gameList[index];
                if (game.status == "revealed") {
                    revealedList.push({
                        name: game.name,
                        key: game.key,
                    })
                } else if (game.status == "fulfilled") {
                    unrevealedList.push(game)
                }
       }
    };

    const revealKey = async ()=>{
        for (const item of unrevealedList) {
            let e = {};
            e["name"] = item.name;    
            await fetch(`https://www.fanatical.com/api/user/orders/redeem`, {
                method: 'POST',
                body: JSON.stringify(item),
                headers: {
                    'anonid': JSON.parse(window.localStorage.bsanonymous).id,
                    'authorization': JSON.parse(window.localStorage.bsauth).token,
                    'content-type': 'application/json; charset=utf-8'
                }
            }).then(res => res.json()).then(res => {
                e["key"] = res.key;
                revealedList.push(e);
            })
        }
    };

    const sortRes = ()=>{
        const showName = $("input[name='showName']").prop("checked")
        sortedJson ={};
        str = "";
        let maxLegth = 0;
        for (const e of revealedList) {
            if(!(e.name in sortedJson)) {
                sortedJson[e.name] = [];             
            };
            sortedJson[e.name].push(e.key);
        }
        console.log(sortedJson); 
        maxLegth = Math.max.apply(Math, Object.values(sortedJson).map((e)=>e.length))
        for (const name in sortedJson) {
            const lst = sortedJson[name];
            if (showName) {
              str += `\n${name}:\n`;
            }           
            for (const key of lst) {
                str += `${key}\n`
            }
         }           

        copyRes();
    };

    const copyRes = ()=>{
        console.log(str);
        GM_setClipboard(str);
        alert("结果已导出至剪切板")
    };

    const redeemCodes = async ()=>{
        let succ = 0;
        const keys = $("#redeem-input textarea").val().split(/[(\r\n)\r\n]+/).filter(e=>e);
        console.log(keys);
        for (const key of keys) {
            let flag = true;
            const res = await fetch(`https://www.fanatical.com/api/user/redeem-code/redeem`, {
                method: 'POST',
	            body: JSON.stringify({
                    code: key
                }),
                headers: {
                    'anonid': JSON.parse(window.localStorage.bsanonymous).id,
                    'authorization': JSON.parse(window.localStorage.bsauth).token,
                    'content-type': 'application/json; charset=utf-8'
                }
            }).then(res => res.json()).catch(e=>{console.log(e);flag = false})
            if (flag) {
                console.log(res)
                if (res._id) {
                    succ += 1;
                }
            }
        }
        alert(`共激活${keys.length}个，成功${succ}个`)
    };

    const checkVoucher = async ()=>{
        const voucher = $("#voucher-input").val()
        const res = await fetch(`https://www.fanatical.com/api/user/discount`, {
            method: 'POST',
	        body: JSON.stringify({
                discountCode: voucher
            }),
            headers: {
                'anonid': JSON.parse(window.localStorage.bsanonymous).id,
                'authorization': JSON.parse(window.localStorage.bsauth).token,
                'content-type': 'application/json; charset=utf-8'
            }
        })
        if (res.status == 200) {
            const rs = await res.json()
            console.log(rs)
            alert(`名称: ${rs.name}\n优惠券: ${rs.code}\n有效期至: ${rs.valid_until}`)
        } else if(res.status == 400){
            alert(`${voucher} 已过期`)
        }
    };

    const initUI = ()=>{
        GM_addStyle(css);
        if (window.location.href.match(/https:\/\/www\.fanatical\.com\/[\S]*redeem-code$/)) {
            $(".redeem-form").after(textHTML);
        } else {
            $(".table-item").prepend(cbxHTML);
            $(".order-search").after(panelHTML);  
            replaceDate();
        }
    };

    const replaceDate = ()=>{
        fetch(`https://www.fanatical.com/api/user/orders`, {
            method: 'GET',
            headers: {
                'anonid': JSON.parse(window.localStorage.bsanonymous).id,
                'authorization': JSON.parse(window.localStorage.bsauth).token,
                'content-type': 'application/json; charset=utf-8'
            }
        }).then(res => res.json()).then(res=>{
            const els = $(".details-container .date-col");
            for (let index = 0; index < els.length; index++) {
                $(els[index]).html(new Date(res[index].date).toLocaleString())
            }
        })
    };

    const addListeners = ()=>{
        $("#redeem-btn").click(async ()=>{
            await getRes();
            await revealKey();
            sortRes();
        });
        $("#get-btn").click(async ()=>{
            await getRes();
            sortRes();
        });
        $("#copy-btn").click(()=>{
            copyRes();
        });
        $("#redeem-code-btn").click(()=>{
            redeemCodes()
        });
        $("#voucher-check-btn").click(()=>{
            checkVoucher()
        });
    };

    (()=>{
        const init_timer = setInterval(()=>{
            const status1 = $(".table-item").length;
            const status2 = $(".redeem-form").length;
            if (status1 || status2) {
                clearInterval(init_timer);
                initUI();
                addListeners();    
            }
        }, 200)
    })();
})();
