// ==UserScript==
// @name         Add SteamDB Sale Item Into Steam Chart魔改
// @namespace    http://tampermonkey.net/
// @version      1.5.4.9.3
// @description  SteamDB一键添加购物车
// @icon         https://steamdb.info/static/logos/32px.png
// @author       shiquda（原作者jklujklu）
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
// @downloadURL https://update.greasyfork.org/scripts/457109/Add%20SteamDB%20Sale%20Item%20Into%20Steam%20Chart%E9%AD%94%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/457109/Add%20SteamDB%20Sale%20Item%20Into%20Steam%20Chart%E9%AD%94%E6%94%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const steamStore = 'https://store.steampowered.com';
    const steamCart = 'https://store.steampowered.com/cart/';
    const steamInfo = 'https://store.steampowered.com/app/'
    const skipMultiSubs = true //（魔改）是否隐藏多sub显示，选择true后将自动选择第一个sub（一般是价格最低的），可能会造成添加失败，请自行核对，后果自负。
    const addCartInterval = 200 //（魔改）多选加入购物车的延时，默认为200ms

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
                        popUp(`SessionId 获取成功！${sessionId}`);
                    } else {
                        popUp(`SessionId 获取失败！`);
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
        GM_xmlhttpRequest({
            url: steamCart,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Origin: 'https://store.steampowered.com',
                Referer: 'https://store.steampowered.com/'
            },
            data: `snr=1_5_9__403&action=add_to_cart&sessionid=${sessionId}&subid=${subId}`,
            method: 'POST',
            onload: response => {
                console.log("Add Chart请求成功");
                // console.log(response.responseText);
                if (response.responseText.search(appId) !== -1) {
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
                    }else if(game_subs.length >0 && skipMultiSubs){
                        addChart(game_subs[0].sub, game_subs[0].subType, dataId, element)
                        return
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
                <table style="width: 80%;height: 80%;">
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
        seleceAllBtn()
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

    function seleceAllBtn(){
        function enable(){
            allBtn.disabled = false
            allBtn.textContent = "开启购物车多选功能"
        }
        document.querySelector("#start_card_query").addEventListener("click",enable)
        var allBtn = document.createElement('button')
        allBtn.textContent = '先点击👆开启购物车多选功能'
        allBtn.className = "btn card-filter-btn"
        allBtn.addEventListener('click',()=>{
            createUI()
            allBtn.style.display = "none"
        })
        var tab1 = document.querySelector('#card_filter_container')
        tab1.appendChild(allBtn)
    }

    function createUI(){
        function addListener(){
                document.querySelector("#DataTables_Table_0_paginate").addEventListener("click",boxesCreate)
                document.querySelector("#DataTables_Table_0_length > label > select").addEventListener("change",boxesCreate)
                document.querySelector("#DataTables_Table_0 > thead").addEventListener("click",boxesCreate)
            }
        addListener()
        //复选框
        function createBox (num){
            var box = document.createElement("input")
            box.setAttribute("type","checkbox")
            box.className = 'box'
            box.id ='box' + (num)
            box.style = "width: 100%;height: 30px;"
            box.title = "购物车多选"
            var tab = document.querySelector("#DataTables_Table_0 > tbody > tr:nth-child("+ num +")")
            tab.appendChild(box)
        }
        function boxesCreate(){
            for(var i = 0;i < document.querySelectorAll('.app').length;i++){
                if (document.querySelector("#DataTables_Table_0 > tbody > tr:nth-child(" + (i + 1) + ") > input") !== null)continue
                createBox(i+1)}
            }
            //document.querySelector("#DataTables_Table_0 > tbody > tr:nth-child(1) > td.price-discount")
        boxesCreate()
        //表头
        var table = document.querySelector(".text-left")
        var mult = document.createElement('th')
        mult.textContent = "购物车多选"
        mult.id = "boxes"
        mult.className = "sorting"
        table.appendChild(mult)

        var tab1 = document.querySelector('#card_filter_container')
        appendElement('btn','确认',"btn card-filter-btn",multiAdd,tab1)
        //筛选
        appendElement('btn','点击筛选👇可选条件',"btn card-filter-btn",filter,tab1)

        var low = document.createElement("input")
        low.id = "lowestIncome"
        low.placeholder = "输入最低的CardIncome"
        low.style = "background-color: white;color: black;"
        tab1.appendChild(low)

        var max = document.createElement("input")
        max.id = "highestPrice"
        max.placeholder = "输入最高的游戏价格"
        max.style = "background-color: white;color: black;"
        tab1.appendChild(max)

        appendElement('btn','全选',"btn card-filter-btn",tickAll,tab1)
        appendElement('btn','反选',"btn card-filter-btn",overturnAll,tab1)
        appendElement('btn','取消选择',"btn card-filter-btn",cancelAll,tab1)
        appendElement('btn','统计信息',"btn card-filter-btn",showPrices,tab1)
        appendElement('btn','点击前往Steam购物车',"btn card-filter-btn",goToCart,tab1)
        }
        function multiAdd() {
            const ckBox = Array.from(document.querySelectorAll('.box')).filter(box => box.checked);
            function btnClick(m) {
                ckBox[m].parentElement.cells[0].click()
            }
            if (ckBox.length === 0) {
                return
            }
            btnClick(0)
            for (var i = 1; i < ckBox.length; i++) {
                setTimeout(btnClick, (2500 + addCartInterval * i), i)
            }
        }
    function filter(){
        cancelAll()
        let min = Number(document.querySelector("#lowestIncome").value)
        let max = Number(document.querySelector("#highestPrice").value)
        if (max == 0){max = Infinity}
        if (isNaN(min)||isNaN(max)||max < 0){
            popUp("请检查筛选范围的输入!")
            return
        }
        var boxlist = document.querySelectorAll(".box")
        for (var i = 0;i < document.querySelectorAll('.app').length;i++){
            var inc = document.querySelector("#DataTables_Table_0 > tbody > tr:nth-child(" + (i+1) + ") > td.card_income > a").textContent.slice(5)
            var prc = document.querySelector("#DataTables_Table_0 > tbody > tr:nth-child(" + (i+1) + ") > td:nth-child(5)").dataset.sort
            if (inc === ''){continue}
            else if (Number(inc) > min && Number(prc)/100 <= max){boxlist[i].checked = true}
        }
        showPrices()
    }
    function appendElement(type,text,class_name,func,appendTo){
        if (type === 'btn'){
        var a = document.createElement('button')
        a.textContent = text
        a.className = class_name
        a.addEventListener("click",func)
        appendTo.appendChild(a)
        }
    }
    function cancelAll(){
        var boxlist = document.querySelectorAll(".box")
        for (var i = 0;i < boxlist.length;i++){
            boxlist[i].checked = false
        }
    }
    function tickAll(){
        var boxlist = document.querySelectorAll(".box")
        for (var i = 0;i < boxlist.length;i++){
            boxlist[i].checked = true
        }
    }
    function overturnAll(){
        var boxlist = document.querySelectorAll(".box")
        for (var i = 0;i < boxlist.length;i++){
            boxlist[i].checked = !boxlist[i].checked
        }
    }
    function showPrices(){
        var boxlist = document.querySelectorAll(".box")
        var count = 0,sumPay = 0,sumGet = 0
        var localCurrency = document.querySelector("#DataTables_Table_0 > tbody > tr:nth-child(1) > td:nth-child(5)").textContent.match(/([A-Z]{3})?./)[0]
        for (var i = 0;i < boxlist.length;i++){
            if (boxlist[i].checked){
                count++
                var pay = document.querySelector(`#DataTables_Table_0 > tbody > tr:nth-child(${i+1}) > td:nth-child(5)`).dataset.sort
                sumPay += Number(pay)/100
                sumGet += Number(document.querySelector(`#DataTables_Table_0 > tbody > tr:nth-child(${i+1}) > td.card_income`).dataset.sort)
            }
        }
        var earn = sumGet - sumPay
        popUp(`一共勾选了${count}款游戏，总价格是${localCurrency} ${sumPay.toFixed(2)}，预计赚${localCurrency} ${earn.toFixed(2)}。`)
    }
    function goToCart(){
        window.open("https://store.steampowered.com/cart/");
    }
})();
