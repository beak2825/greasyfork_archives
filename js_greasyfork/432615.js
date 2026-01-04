// ==UserScript==
// @name         Add SteamDB Sale Item Into Steam Chart
// @namespace    http://tampermonkey.net/
// @version      1.5.5
// @description  SteamDB一键添加购物车
// @icon         https://steamdb.info/static/logos/32px.png
// @author       jklujklu
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-jgrowl/1.4.8/jquery.jgrowl.min.js
// @match        https://steamdb.info/sales/*
// @match        http://steamdb.info/sales/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @run-at       document-end
// @resource     layerCss https://cdnjs.cloudflare.com/ajax/libs/jquery-jgrowl/1.4.8/jquery.jgrowl.min.css
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/432615/Add%20SteamDB%20Sale%20Item%20Into%20Steam%20Chart.user.js
// @updateURL https://update.greasyfork.org/scripts/432615/Add%20SteamDB%20Sale%20Item%20Into%20Steam%20Chart.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const steamStore = 'https://store.steampowered.com';
    const steamCart = 'https://store.steampowered.com/cart/addtocart';
    const steamInfo = 'https://store.steampowered.com/app/'


    let sessionId = '';

    function getSessionId() {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: steamStore,
                onload: response => {
                    console.log("SessionId请求成功");
                    // console.log(response.responseText);
                    const str = response.responseText;
                    const pattern = /g_sessionID = "(.+)";/;
                    if (pattern.test(str)) {
                        // console.log(pattern.exec(str)[1])
                        sessionId = pattern.exec(str)[1];
                        popUp(`SessionId 獲取成功！${sessionId}`);
                    } else {
                        popUp(`SessionId 獲取失敗!`);
                    }
                    resolve(sessionId);
                },
                onerror: response => {
                    popUp("SessionId请求失败，请检查网络状况！");
                }
            });
        });
    }

    function addChart(subId, subType, appId, parentElement) {
        if (subType !== 'game'){
            popUp('暂不支持添加Bundle类型的游戏！');
            return;
        }
        const formData = new FormData()
        formData.append('subid', subId);
        formData.append('sessionid', sessionId);
        formData.append('action', 'add_to_cart');
        GM_xmlhttpRequest({
            url: steamCart,
            headers: {
                'Content-Type': 'multipart/form-data',
                Origin: 'https://store.steampowered.com',
                Referer: 'https://store.steampowered.com/'
            },
            data: formData,
            method: 'POST',
            onload: response => {
                console.log("Add Chart请求成功");
                const rs = JSON.parse(response.responseText);
                console.log(rs);
                if (rs.success) {
                    popUp(`appId: ${appId} 添加购物车成功！`);
                    parentElement.style.background = 'rgba(0,156,0,0.5)';
                    document.querySelector('#app-2').style.opacity = 0;
                    document.querySelector('#app-2').style.display = 'none';

                } else {
                    popUp(`添加购物车失败！`)
                }
            },
            onerror: response => {
                popUp("添加购物车请求失败，请检查网络状况！");
            }
        });
    }

    function popUp(msg) {
        $.jGrowl(msg)
    }

    function getGameSubs(appId){
        return new Promise(resolve =>{
            GM_xmlhttpRequest({
                url: steamInfo + appId,
                headers: {
                    Origin: 'https://store.steampowered.com',
                    Referer: 'https://store.steampowered.com/'
                },
                method: 'GET',
                onload: response => {
                    console.log("获取游戏界面成功！");
                    if(response.responseText.indexOf('agegate_birthday_selector') !== -1){
                        resolve('birthday')
                    }
                    const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                    let games = [];
                    const wrappers = doc.querySelectorAll('.game_area_purchase_game_wrapper');
                    for (let index = 0; index < wrappers.length; index++) {
                        const game = wrappers[index];
                        let input_sub = game.querySelector('form input[name="subid"]');
                        const div_discount = game.querySelector('.discount_pct');
                        let div_price = game.querySelector('.discount_final_price');
                        if(!div_discount){
                            div_price = game.querySelector('.game_purchase_price');
                        }
                        let subType = 'game';
                        if(!input_sub){
                            subType = 'bundle';
                            input_sub = game.querySelector('form input[name="bundleid"]');
                        }
                        const title = game.querySelector('.game_area_purchase_game h1').firstChild.nodeValue.replace(/(^\s*)|(\s*$)/g, "").replace('购买', '');
                        const discount = div_discount ? div_discount.firstChild.nodeValue.replace(/(^\s*)|(\s*$)/g, "") : '-0%'
                        const sub = input_sub.getAttribute('value');
                        const price = div_price.firstChild.nodeValue.replace(/(^\s*)|(\s*$)/g, "");
                        console.log(title, discount, price, sub, subType);
                        games.push({title, discount, price, sub, subType})
                    }
                    resolve(games);
                },
                onerror: response => {
                    popUp("获取游戏Sub失败！");
                }
            });
        })
    }

    function bindElement(){
        console.log('start bind steam icon')
        const appimgs = document.querySelectorAll('.app');
        for (let index = 0; index < appimgs.length; index++) {
            const element = appimgs[index];
            if (element.querySelector('td:nth-child(1) a').getAttribute('href') !== 'javascript:void(0)') {
                element.querySelector('td:nth-child(1) a').setAttribute('href', 'javascript:void(0)');
                element.querySelector('td:nth-child(1) a').removeAttribute('target');
                element.querySelector('td:nth-child(1)').onclick = async() => {
                    document.querySelector('#app-2 tbody').innerHTML = '';
                    const dataId = element.getAttribute('data-appid');
                    const subs = await getGameSubs(dataId);
                    if(subs === 'birthday'){
                        popUp('需要进行生日验证，请手动前往该游戏页面验证！');
                        window.open(steamInfo + dataId,"_blank", '');
                        return;
                    }
                    const game_subs = subs.filter(e => e.subType === 'game');
                    if(game_subs.length === 1){
                        addChart(game_subs[0].sub, game_subs[0].subType, dataId, element);
                        return;
                    }else if(game_subs.length === 0){
                        popUp('未找到该游戏的Sub，请前往商店查看是否存在购买选项！');
                        window.open(steamInfo + dataId,"_blank", '');
                        return;
                    }
                    document.querySelector('#app-2').style.opacity = 1;
                    document.querySelector('#app-2').style.display = 'block';
                    for (let index = 0; index < subs.length; index++) {
                        const game = subs[index];
                        const _tr = document.createElement('tr');
                        _tr.innerHTML =
                            `<th>${game.title}</th>
                            <th>${game.discount}</th>
                            <th>${game.price}</th>
                            <th>${game.subType}</th>
                            <th>${game.sub}</th>
                            <th><button class="btn">Add</div></th>`
                        _tr.querySelector('.btn').addEventListener('click', ()=>{
                            addChart(game.sub, game.subType, dataId, element);
                        })
                        document.querySelector('#app-2 tbody').append(_tr);
                    }
                }
            }
        }
    }

    function initPane(){
        const div = document.createElement('div');
        div.innerHTML =
            `<div id="app-2" class="header-sales-filters" style="display:none;opacity: 0;transition: 0.5s;width: 60%;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);background: #eee;z-index: 9999;color: black;padding: 10px;">
                <table style="width: 100%;height: 100%;">
                    <thead>
                    <tr>
                        <th>游戏</th>
                        <th>折扣</th>
                        <th>价格</th>
                        <th>Sub类型</th>
                        <th>SubId</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>`
        document.body.append(div);
    }

    // Your code here...
    const layerCss = GM_getResourceText('layerCss');
    GM_addStyle(layerCss);

    async function start(){
        initPane();
        bindElement();
        const rs = await getSessionId();
        console.log(`Receive Session: ${rs}`);
        $("#DataTables_Table_0 > tbody").bind('DOMNodeInserted', bindElement);
    }

    const timer = setInterval(()=>{
        if(typeof $.jGrowl === 'function'){
            document.styleSheets[0].addRule('#jGrowl', 'top: 48px');
            clearInterval(timer);
            start();
        }else{
            console.log('wait for jquery.jgrowl')
        }
    }, 200)

})();

