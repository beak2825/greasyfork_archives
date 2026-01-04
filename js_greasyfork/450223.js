// ==UserScript==
// @name         C5GAME挂饰品脚本
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  C5GAME挂饰品倒余额脚本
// @author       lyzlyslyc
// @license      AGPL-3.0
// @match        *://c5game.com/*
// @match        *://www.c5game.com/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @connect      www.c5game.com
// @connect      steamcommunity.com
// @connect      steamcommunity-a.akamaihd.net
// @downloadURL https://update.greasyfork.org/scripts/450223/C5GAME%E6%8C%82%E9%A5%B0%E5%93%81%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/450223/C5GAME%E6%8C%82%E9%A5%B0%E5%93%81%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* 比例相关参数 */
    let min_sell_num = 5;              //最小在售数量，在售大于等于该数量才会查询
    let high_sell_rate = 0.7;          //高出售比例阈值，大于该阈值的比例会显示为红色，小于阈值显示为绿色
    let high_buy_rate = 0.85;          //高求购比例阈值，大于该阈值的比例会显示为红色，小于阈值显示为绿色
    let auto_sort = 1;                 //查询完后自动排序，1出售比例升序，-1降序，2求购比例升序，-2降序，其他值不排序
    let rate_precision = 4;            //饰品详细页面的比例精度，精确到小数点后n位

    /* 网络请求参数 */
    let max_request_num = 10;          //最大同时进行的请求数
    let request_interval_ms = 1200;    //查询请求的发送间隔，单位毫秒
    let timeout_ms = 5000;             //查询超时的时长，单位毫秒，当超过这个时长会被认为请求超时

    /* 自动翻页参数 */
    let enable_auto_paging = false;    //启用自动翻页，按p键切换开启和关闭，开启后会在查询完成后自动翻页
    let auto_paging_timeout_ms = 1500; //自动翻页延迟，单位毫秒，查询完成后会在等待这个延迟然后自动翻页
    /* 自动点击参数 */
    let enable_auto_tabbing = false;   //启用自动点击，按t键切换开启和关闭，开启后会自动点击符合要求的饰品
    // 符合需求饰品的判定表达式，参见下方编写方法说明
    let tabbing_exp = '(sell < 0.7) && (buy < 0.75)';
    /*********** tabbing_exp的编写方法 *********
     *
     * sell变量 - 出售折扣
     * buy变量 - 求购折扣
     * && - 并且
     * || - 或者
     *
     * 举例：
     * 1. 出售折扣小于0.7并且折扣求购小于0.8    -   '(sell < 0.7) && (buy < 0.8)'
     *
     * 2. 出售折扣小于0.7或者折扣求购小于0.7    -   '(sell < 0.6) || (buy < 0.7)'
     *******************************************/

    /* 汇率查询参数 */
    let currency_checking = 1;         //是否启用汇率更新，启用为1，不启用为0
    // 关闭汇率更新后，需要手动输入账号货币兑人民币汇率，例如美元输入7.0，人民币输入1.0
    // 输入负数则会使用历史数据，没有历史数据默认设定为1.0
    let currency_rate = -1;
    /*
     * 汇率基准物品查询链接，建议steam市场上架量大于150且价格大于200人民币的热门饰品
     * 找到目标饰品后进入steam饰品详情界面，将链接复制粘贴至下方，将链接用英文双引号包围，并在该行的末尾添加英文逗号
     * 链接格式形如 https://steamcommunity.com/market/listings/<游戏id>/<饰品名称>
     */
    let currency_query_urls = [
        // 在此处加入备用查询链接，每行一条链接
        "https://steamcommunity.com/market/listings/730/AWP%20|%20Redline%20(Minimal%20Wear)",
        "https://steamcommunity.com/market/listings/730/Souvenir%20UMP-45%20%7C%20Blaze%20%28Factory%20New%29",
        "https://steamcommunity.com/market/listings/730/Souvenir%20USP-S%20%7C%20Orange%20Anolis%20%28Factory%20New%29",
    ];
    /*
     * 备用链接查询的页面号，默认查询第31-40个上架物品。
     */
    let backup_query_page = 3;
    // 默认查询链接和饰品id，不建议修改，修改前请查看下方说明
    let currency_default_query_url = "https://steamcommunity.com/market/listings/730/Souvenir%20Sawed-Off%20|%20Snake%20Camo%20(Well-Worn)/render/?query=&start=10";
    let currency_default_query_itemid = "644674168631156892";
    /*
     * 汇率查询原理：
     * 1.找到一个以人民币上架的物品，currency_id 23
     * 2.查询该物品信息，包括该物品上架时使用的货币的价格（人民币），以及当前账号显示的货币的价格
     * 3.计算汇率
     *
     *
     * 查询链接格式：
     * https://steamcommunity.com/market/listings/<appid>/<item_name>/render/?query=&start=<start_num>&currency=<currency_id>
     *
     * appid - 游戏id，饰品详情页面会给出
     * item_name - 饰品名称，饰品详情页面会给出
     * start_num - 从第几个上架物品开始查询，例如40表示从第40个上架物品也就是第4页开始查询
     *             备用链接的start_num为0
     * currency_id - 货币的id，人民币为23，在本脚本中会自动生成，无需加入请求链接
     * 该链接会以JSON格式(加入/render/的效果)列出上架商品的详情信息
     *
     * 默认查询链接修改须知：
     * 1. 默认查询链接会不定期更新
     * 2. 不要将&currency=<currency_id>加入修改链接
     * 3. 需要修改的值：上架商品url，start_num，item_count
     * 4. itemid可以在更新链接后，通过本脚本的控制台获取
     *
     */


    //以下为代码实现，请勿轻易更改
    let list_div = null;
    let nextBtn = document.querySelector(".btn-next");
    let prevBtn = document.querySelector(".btn-prev");
    let cardListSelector = ".list .el-row";
    let appId;
    let priceCSSEle=document.createElement("style");
    let requests=[];
    let current_request_num = 0;
    let rateInfo = GM_getValue("exchangeRate");
    let communityInfo = GM_getValue("communityInfo");
    let currentPage = 1;
    let sortAsc = true;
    let sortKey = "sellsort";
    let queryCompleted = false;
    if(!communityInfo)communityInfo={};

    // 等待Nuxt框架加载完成
    function waitForNuxt(callback, interval_ms){
        if(!unsafeWindow.$nuxt){
            setTimeout(()=>{
                console.log("未找到$nuxt");
                waitForNuxt(callback,interval_ms);
            },interval_ms);
            return;
        }
        console.log("找到$nuxt");
        callback();
    }

    //商品详情页
    if(location.href.match(/c5game.com\/[^/]+\/(\d+)\/.*/)){
        console.log("c5挂刀脚本运行中：饰品详情页面");
        waitForNuxt(()=>{
            let c5ItemId = location.href.match(/c5game.com\/[^/]+\/(\d+)\/.*/)[1];
            if(!rateInfo){
                fetchCommunityInfo().then(checkAndUpdateRate).then(()=>{
                    queryItemPage(document.querySelector(".check-market a").href);
                },()=>{});
            }
            else checkAndUpdateRate().then(()=>{queryItemPage(document.querySelector(".check-market a").href)},()=>{});
            let infoDiv = document.querySelector("main .bottom-info");
            infoDiv.style.marginTop = "";
        }, 500);
        return;
    }
    else if(document.getElementById("market_index")!=null){
        console.log("c5挂刀脚本运行中：饰品搜索页面");

        //快速跳转插件
        let quickJumpInput = document.createElement("span");
        quickJumpInput.innerHTML = '第<input id="quickjump" style="width: 30px;margin: 4px;text-align:center;">页';
        quickJumpInput.style = `line-height: 36px;padding: 0 8px 0 8px;height: 36px;background: white;margin-left: 10px;font-weight: normal;font-size: medium;border-top-left-radius: 4px;border-bottom-left-radius: 4px;`;
        let quickJumpButton = document.createElement("button");
        quickJumpButton.type="button";
        quickJumpButton.className = "btn-next";
        quickJumpButton.style = "margin-left: 1px;";
        quickJumpButton.innerHTML = '<i class="el-icon el-icon-search"></i>';
        quickJumpButton.addEventListener("click",()=>{
            let page = document.getElementById("quickjump").value.replace(/[^\d]/g,"");
            document.getElementById("quickjump").value = page;
            if(page==="")return;
            else jumpToPage(page);
        });
        let pagination = document.querySelector("div.el-pagination");
        pagination.append(quickJumpInput);
        pagination.append(quickJumpButton);

        waitForNuxt(()=>{
            console.log("初始化")
            let notification = $nuxt.$notify.info({
                title:"C5挂刀脚本",
                message:"正在初始化...",
                duration:0
            })
            currentPage = document.querySelector("li.number.active").innerText;
            fetchCommunityInfo().then(checkAndUpdateRate).then(()=>{
                notification.close();
                initQueryPage();
                queryMain();
                setInterval(sendRequest,request_interval_ms);
            },()=>{
                notification.close();
            });
        },500);
    }

    /********************函数实现***********************/

    /********************页面相关***********************/
    //初始化商品列表页面
    function initQueryPage(){
        GM_addStyle(`
            .s_s_s_s_cell_rate{color:green;}
            .s_s_s_s_cell_rate_high{color:red;}
            div[doquery=false] .li-btm {background: darkgray !important;}
        `);
        //翻页插件
        let asc = true;
        document.addEventListener("keydown",(e)=>{
            if(e.target.tagName=="INPUT")return;
            if(!(e.alterKey||e.shiftKey||e.ctrlKey)){
                switch(e.key){
                    case 'd':
                    case 'ArrowRight':
                        nextBtn.click();
                        break;
                    case 'ArrowLeft':
                    case 'a':
                        prevBtn.click();
                        break;
                    case '-':
                        if(sortKey=="sellsort")asc=!asc;
                        else sortKey="sellsort";
                        sort(asc,"sellsort");
                        break;
                    case '=':
                        if(sortKey=="buysort")asc=!asc;
                        else sortKey="buysort";
                        sort(asc,"buysort");
                        break;
                    case 'p':
                        toggleAutoPaging();
                        break;
                    case 't':
                        toggleAutoTabbing();
                        break;
                    default:
                        break;
                }
            }
        });

        //新页面加载完毕
        let observer = new MutationObserver((mutations)=>{
            mutations.forEach((m)=>{
                if(m.attributeName=="style"){
                    if(m.target.style.display=="none"){
                        requests = [];
                        currentPage = document.querySelector("li.number.active").innerText;
                        document.querySelectorAll(".ratio-div").forEach((e)=>{e.remove()});
                        //GM_setValue("c5_last_page",document.querySelector(".el-pager .active").innerText);
                        queryMain();
                    }
                }
            })
        });
        setTimeout(setObserver,100);
        function setObserver(){
            if(!document.querySelector(".list > .el-loading-mask")){setTimeout(setObserver,100);return}
            observer.observe(document.querySelector(".list > .el-loading-mask"),{attributes: true});
        }
    }

    //查询列表页面饰品信息
    function queryC5ItemInfoList(){
     return new Promise(function(resolve,reject){
         appId = __NUXT__.data[0].query.appId;
         let cards = document.querySelectorAll(".goodsCard");
         for(let i=0;i<cards.length;i++){
             //设置英文名
             let data = GM_getValue(cards[i].__vue__.item.itemId);
             if(!data)GM_setValue(cards[i].__vue__.item.itemId,`{"enName":"${cards[i].__vue__.item.marketHashName}"}`);
             //console.log(GM_getValue(cards[i].__vue__.item.itemId));
         }
         resolve();
     });
    }

    //获取饰品的英文名
    //queryC5ItemInfoList查询到的信息和当前页面实际的饰品可能存在出入
    //靠这个函数补充获取饰品的英文名
    function getEnName(c5ItemId){
        return new Promise(function(resolve,reject){
            let url = location.href.replace(/([^?]+)(\?.*)?/,`$1/${c5ItemId}/`);
            console.log(`getting hash name of c5ItemId ${c5ItemId}`);
            requests.push({
                url: url,
                timeout: timeout_ms,
                method: "get",
                onload: function (res) {
                    try{
                        resolve(res.responseText.match(/"https?:\/\/steamcommunity.com\/market\/listings\/\d+\/(.*?)"/)[1]);
                    }
                    catch(err){
                        console.log("获取hash name错误：", err);
                        err.statusText="获取hash name错误";
                        reject(err);
                    }
                },
                onerror: function (err) {
                    console.log("获取hash name错误：", err);
                    err.statusText="获取hash name错误";
                    reject(err);
                },
                ontimeout: function () {
                    let err = { "status": 408, "statusText": "获取hash name超时" };
                    console.log("获取hash name超时：", err);
                    reject(err);
                }
            });
        });
    }

    //列表页面排序
    function sort(asc,key){
        let cards = document.querySelector(cardListSelector);
        let list = Array.from(cards.querySelectorAll("div[doquery=true]"));
        list.sort((a,b)=>{
            let res = parseFloat(a.querySelector(".ratio-div")[key])-parseFloat(b.querySelector(".ratio-div")[key]);
            if(!asc)res*=-1;
            return res;
        });
        for(let i=list.length-1;i>=0;i--)cards.prepend(list[i]);
    }

    //页面快速跳转
    function jumpToPage(page){
        document.querySelector(".el-pagination").__vue__.handleCurrentChange(page);
    }

    /***************************饰品列表界面查询函数**************************/

    //获取steam社区登录信息和钱包信息
    function fetchCommunityInfo(){
        return new Promise((resolve,reject)=>{
            console.log("c5挂刀脚本：检查steam社区连通性...");
            GM_xmlhttpRequest({
                method: "get",
                url: "https://steamcommunity.com/market/",
                timeout: timeout_ms,
                onload: function (res) {
                    if (res && res.status == 200) {
                        if(res.responseText.match(/var +g_bLoggedIn += +(true|false);/i)[1]=="false"){
                            $nuxt.$notify.warning({
                                title: "C5挂刀脚本",
                                dangerouslyUseHTMLString: true,
                                message: '<h2>STEAM市场未登录</h2><a href="https://steamcommunity.com/login/home/" target="_blank">去登录</a>',
                                duration: 0
                            })
                            reject(false);
                            return;
                        }
                        communityInfo.g_walletCurrency = parseInt(res.responseText.match(/"wallet_currency":(\d+)/)[1]);
                        communityInfo.g_strLanguage = res.responseText.match(/g_strLanguage = "([^"]+)"/)[1];
                        communityInfo.g_strCountryCode = res.responseText.match(/g_strCountryCode = "([^"]+)"/)[1];
                        GM_setValue("communityInfo",communityInfo);
                        console.log("c5挂刀脚本steam社区信息：",communityInfo);
                        resolve();
                    } else {
                        console.log("检测steam连接性出错：状态错误", res);
                        $nuxt.$notify.error({
                            title: "C5挂刀脚本",
                            message: `检测steam连接性出错：状态错误${res.status}`,
                        })
                        reject(res);
                    }
                },
                onerror: function (err) {
                    console.log("检测steam连接性出错：连接错误", err);
                    $nuxt.$notify.error({
                        title: "C5挂刀脚本",
                        message: `检测steam连接性出错：连接错误${err}`,
                    })
                    reject(err);
                },
                ontimeout: function () {
                    console.log("检测steam连接性出错：尝试超时");
                    $nuxt.$notify.error({
                        title: "C5挂刀脚本",
                        message: `检测steam连接性出错：请求超时，请开启加速器后刷新页面。`,
                        duration: 0
                    })
                    reject();
                }
            });
        });
    }

    //检查并更新汇率信息
    function checkAndUpdateRate(force=false,backup=0){
        return new Promise((resolve,reject)=>{
            rateInfo = GM_getValue("exchangeRate");
            console.log("c5挂刀脚本：正在检查汇率...");
            if(!currency_checking){
                if(!(currency_rate>0)){
                    if(rateInfo)
                        currency_rate = parseFloat(rateInfo.FtoC);
                    else
                        currency_rate = 1.0;
                }
                let msg = $nuxt.$notify.info({
                    title:"C5挂刀脚本",
                    message:`已关闭汇率检查，目前设定账号货币兑人民币汇率为${currency_rate.toFixed(2)}`
                });
                let timeUnix = Date.now();
                rateInfo = {
                    FtoC: (currency_rate).toFixed(6),
                    CtoF: (1.0/currency_rate).toFixed(6),
                    currencyCode: communityInfo.g_walletCurrency,
                    time_next_update_unix: timeUnix + 10800000,
                    time_update_unix: timeUnix,
                    auto: 0
                }
                GM_setValue("exchangeRate", rateInfo);
                resolve();
                return;
            }
            if((!force) && rateInfo && rateInfo.auto && rateInfo.time_next_update_unix > Date.now() && rateInfo.currencyCode == communityInfo.g_walletCurrency){resolve();return;}
            console.log("c5挂刀脚本：正在更新汇率...");
            let msg = $nuxt.$notify.info({
                title:"C5挂刀脚本",
                message:"正在更新汇率...",
                duration:0
            });
            // 默认锚点
            let queryUrl = currency_default_query_url.replace(/\/$/,"") + `&currency=${communityInfo.g_walletCurrency}`;
            // 备用锚点
            if(backup > 0)
                queryUrl = currency_query_urls[backup-1].replace(/\/$/,"") + `/render/?query=&start=${backup_query_page*10}&currency=${communityInfo.g_walletCurrency}`;
            GM_xmlhttpRequest({
                url: queryUrl,
                method: "get",
                timeout: timeout_ms,
                onload: function (response) {
                    let data = response.status == 200 ? JSON.parse(response.responseText) : {};
                    // 默认锚点物品id
                    let itemid = currency_default_query_itemid
                    let found = true;
                    if(!data.success){
                        found = false;
                    }
                    else if(!data.listinginfo){
                        found = false;
                    }
                    else if(!data.listinginfo[itemid]){
                        console.log("默认锚点未找到，寻找其他人民币锚点");
                        found = false;
                        for(let key in data.listinginfo){
                            if(data.listinginfo[key].currencyid==2023){
                                console.log("新锚点物品id：",key);
                                itemid = key;
                                found = true;
                                break;
                            }
                        }
                    }
                    if(!found){
                        msg.close();
                        if(!data.success){
                            msg.close();
                            console.log("获取汇率时出现错误："+JSON.stringify(data));
                            console.log("URL:",queryUrl);
                            if(backup < currency_query_urls.length && response.status != 429){
                                console.log(`使用备用链接${backup + 1}查询...`);
                                $nuxt.$notify.info({
                                    title: "C5挂刀脚本",
                                    message: `汇率查询失败，2秒后使用备用链接${backup + 1}查询...`,
                                    duration: 2000
                                });
                                setTimeout(()=>{
                                    checkAndUpdateRate(true,backup+1).then(resolve,reject);
                                },2000);
                                return;
                            }
                            else{
                                $nuxt.$notify.error({
                                    title: "C5挂刀脚本",
                                    message: `汇率请求过于频繁，请稍后重试。`,
                                });
                            }
                        }
                        else {
                            msg.close();
                            console.log("人民币锚点未找到,url:",queryUrl);
                            if(backup < currency_query_urls.length){
                                console.log(`使用备用链接${backup + 1}查询...`);
                                $nuxt.$notify.info({
                                    title: "C5挂刀脚本",
                                    message: `汇率锚点商品未找到，2秒后使用备用链接${backup + 1}查询...`,
                                    duration: 2000
                                });
                                setTimeout(()=>{
                                    checkAndUpdateRate(true,backup+1).then(resolve,reject);
                                },2000);
                                return;
                            }
                            else{
                                $nuxt.$notify.error({
                                    title: "C5挂刀脚本",
                                    message: `未找到汇率锚点商品，请在脚本中更新汇率查询链接。`,
                                });
                            }
                        }
                        reject();
                        return;
                    }
                    if (data.listinginfo[itemid].converted_currencyid % 2000 != communityInfo.g_walletCurrency) {
                        return; // 对结果返回前的多次操作进行屏蔽，只取最后一次的结果
                    }
                    let timeUnix = Date.now();
                    rateInfo = {
                        FtoC: (data.listinginfo[itemid].price / data.listinginfo[itemid].converted_price).toFixed(6),
                        CtoF: (data.listinginfo[itemid].converted_price / data.listinginfo[itemid].price).toFixed(6),
                        currencyCode: communityInfo.g_walletCurrency,
                        time_next_update_unix: timeUnix + 10800000,
                        time_update_unix: timeUnix,
                        auto: 1
                    }
                    GM_setValue("exchangeRate", rateInfo);
                    console.log("汇率已更新：",rateInfo);
                    msg.close();
                    $nuxt.$notify.success({
                        title: "C5挂刀脚本",
                        message: `社区货币汇率已更新：${rateInfo.FtoC}`,
                    })
                    resolve();
                    return;
                    console.log("获取汇率时出现错误：", response);
                    console.log("url_id:",backup);
                    console.log("url:",queryUrl);
                    msg.close();
                    $nuxt.$notify.error({
                        title: "C5挂刀脚本",
                        message: `获取汇率时出现错误，请查看控制台信息。`,
                    });
                    resolve();
                    return;
                },
                onerror: function (err) {
                    console.log("获取汇率失败：", err);
                    console.log("url_id:",backup);
                    console.log("url:",queryUrl);
                    msg.close();
                    $nuxt.$notify.error({
                        title: "C5挂刀脚本",
                        message: `汇率请求出错（${backup>0?"默认":"备用"}链接${backup>0?(backup+1):""}），请刷新重试。`,
                    })
                    reject();
                },
                ontimeout: function () {
                    console.log("获取汇率超时");
                    console.log("url_id:",backup);
                    console.log("url:",queryUrl);
                    msg.close();
                    $nuxt.$notify.error({
                        title: "C5挂刀脚本",
                        message: `获取汇率超时（${backup>0?"默认":"备用"}链接${backup>0?(backup+1):""}），请刷新重试。`,
                    })
                    reject();
                }
            });
        })
    }

    //查询主函数
    function queryMain(){
        //获取当前页面物品信息列表
        queryCompleted = false;
        queryC5ItemInfoList().then((result)=>{
            let cards = document.querySelector(cardListSelector).children;
            let count;
            let c5price;
            let ratioDiv;
            let promises = [];
            let ignores = [];
            for(let i=0;i<cards.length;i++){
                //检查最低在售量
                count = cards[i].querySelector(".count");
                if(!count)count=0;
                else count = count.innerText.match(/\d+/)?count.innerText.match(/\d+/)[0]:0;
                if(count<min_sell_num)cards[i].setAttribute("doQuery",false);
                else cards[i].setAttribute("doQuery",true);

                //创建元素
                ratioDiv = document.createElement("div");
                ratioDiv.className = "d-flex d-b-s ratio-div";
                ratioDiv.innerHTML=`<div class="sellRatio" style="font-size: large;">查询商品steamId</div><div class="buyRatio"></div>`;
                cards[i].querySelector(".li-btm").appendChild(ratioDiv);

                if(cards[i].getAttribute("doQuery")=="false"){
                    ratioDiv.querySelector(".sellRatio").innerText="已忽略";
                    ignores.push(cards[i]);
                    continue;
                }

                //查询饰品
                c5price = cards[i].querySelector(".price").innerText.replace(/[^0-9.]/,"");
                promises.push(queryOne(cards[i].querySelector("a").href.match(/\/(\d+)\//)[1],parseFloat(c5price),ratioDiv));
            }
            for(let i=0;i<ignores.length;i++)document.querySelector(cardListSelector).append(ignores[i]);
            Promise.all(promises).then(()=>{
                switch(auto_sort){
                    case 1:
                        sort(true,"sellsort");
                        sortKey="sellsort";
                        sortAsc=true;
                        break;
                    case 2:
                        sort(true,"buysort");
                        sortKey="buysort";
                        sortAsc=true;
                        break;
                    case -1:
                        sort(false,"sellsort");
                        sortKey="sellsort";
                        sortAsc=false;
                        break;
                    case 2:
                        sort(false,"buysort");
                        sortKey="buysort";
                        sortAsc=false;
                        break;
                    default:
                        break;
                }
                queryCompleted = true;
                setTimeout(autoPaging,auto_paging_timeout_ms);
            })
        });
    }

    //查询单个饰品，并更新查询结果div
    function queryOne(c5ItemId,c5price,ratioDiv){
        //查询饰品steamID然后查询订单信息
        return getSteamItemInfo(c5ItemId,appId).then((json)=>{
            ratioDiv.querySelector(".sellRatio").innerText="查询物品订单中";
            return getItemOrder(json);
        }).then((res)=>{
            //求购比例
            let steamBuyRatio = (c5price*rateInfo.CtoF / calcfee(parseFloat(res.highest_buy_order)) * 100).toFixed(2);
            //出售比例
            let steamSellRatio = (c5price*rateInfo.CtoF / calcfee(parseFloat(res.lowest_sell_order)) * 100).toFixed(2);
            let sellDiv = ratioDiv.querySelector(".sellRatio");
            let buyDiv = ratioDiv.querySelector(".buyRatio");
            if(steamSellRatio<high_sell_rate)sellDiv.classList.add("s_s_s_s_cell_rate")
            else sellDiv.classList.add("s_s_s_s_cell_rate_high")
            sellDiv.innerText=steamSellRatio;
            if(steamBuyRatio<high_buy_rate)buyDiv.classList.add("s_s_s_s_cell_rate")
            else buyDiv.classList.add("s_s_s_s_cell_rate_high")
            buyDiv.innerText=steamBuyRatio;
            ratioDiv.sellsort = steamSellRatio;
            ratioDiv.buysort = steamBuyRatio;
            // 自动点击
            if(enable_auto_tabbing){
                if(isExpressionTrue(tabbing_exp,{sell:parseFloat(steamSellRatio),buy:parseFloat(steamBuyRatio)})){
                    ratioDiv.click();
                }
            }
        },(err)=>{
            ratioDiv.querySelector(".sellRatio").innerText=err.statusText;
            ratioDiv.querySelector(".sellRatio").classList.add("text-red");
            ratioDiv.querySelector(".sellRatio").style.fontWeight = "bold";
            let parent = ratioDiv.parentNode;
            while(parent&&(parent.getAttribute("doquery")===null))parent = parent.parentNode;
            if(parent)parent.setAttribute("doquery","false");
        });
    }

    //获取物品在steam社区的itemid，后续使用itemid获取物品价格信息
    function getSteamItemInfo(c5ItemId,appId){
        return new Promise(function(resolve,reject){
            let data = GM_getValue(c5ItemId);
            let steamItemId;
            let json;
            if(!data){
                //获取英文名，然后获取id
                getEnName(c5ItemId).then((enName)=>{
                    GM_setValue(c5ItemId,`{"enName":"${enName}"}`);
                    console.log(GM_getValue(c5ItemId));
                    return getSteamItemInfo(c5ItemId,appId);
                }).then(resolve,reject);
                return;
            }
            else{
                json = JSON.parse(data);
                if(json.steamItemId)steamItemId=json.steamItemId;
            }
            if(steamItemId){
                resolve(json);
                return;
            }
            else if (steamItemId === null) {
                reject({ status: 404, statusText: "物品不在货架上" });
            }

            //console.log(`Getting steamItemId of ${json.enName}`);
            let request = {
                url: encodeURI(`https://steamcommunity.com/market/listings/${appId}/${json.enName}`),
                timeout: timeout_ms,
                method: "get",
                onload: function (res) {
                    if (res.status == 200) {
                        let html = res.responseText;
                        try {
                            steamItemId = /Market_LoadOrderSpread\(\s?(\d+)\s?\)/.exec(html)[1];
                        } catch (error) {
                            json.steamItemId=null;
                            GM_setValue(c5ItemId, JSON.stringify(json));
                            res.status = 404;
                            res.statusText = "物品不在货架上";
                            console.log("获取itemID状态异常：", res);
                            reject(res);
                            return;
                        }
                        json.steamItemId=steamItemId;
                        GM_setValue(c5ItemId, JSON.stringify(json));
                        //console.log(steamItemId);
                        resolve(json);
                    }
                    else if(res.status == 429){
                        res.statusText = "请求过于频繁";
                        console.log("获取itemID状态异常：", res);
                        reject(res);
                    }
                    else {
                        console.log("获取itemID状态异常：", res);
                        reject(res);
                    }
                },
                onerror: function (err) {
                    console.log("获取itemID错误：", err);
                    err.statusText = "获取itemID错误";
                    reject(err);
                },
                ontimeout: function () {
                    let err = { "status": 408, "statusText": "连接steam超时" };
                    console.log("获取itemID超时：", err);
                    reject(err);
                }
            };
            requests.push(request);
        })
    }

    //获取饰品订单报价信息
    function getItemOrder(steamItemInfo){
        return new Promise(function(resolve,reject){
            //console.log(`getting order info of steamItemId ${steamItemId}`);
            requests.push({
                url: `https://steamcommunity.com/market/itemordershistogram?country=${communityInfo.g_strCountryCode}&language=${communityInfo.g_strLanguage}&currency=${communityInfo.g_walletCurrency}&item_nameid=${steamItemInfo.steamItemId}&two_factor=0`,
                headers: {
                    "referer": encodeURI(`https://steamcommunity.com/market/listings/${appId}/${steamItemInfo.enName}`),
                    "X-Requested-With": "XMLHttpRequest",
                    "Host": "steamcommunity.com",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.35"
                },
                timeout: timeout_ms,
                method: "get",
                onload: function (res) {
                    if (res.status == 200) {
                        resolve(JSON.parse(res.responseText));
                    } else if(res.status == 429){
                        res.statusText = "请求过于频繁";
                        console.log("访问steamorder状态状态异常：", res);
                        reject(res);
                    }
                    else {
                        console.log("访问steamorder状态异常：", res);
                        if(res.statusText==="")res.statusText="查询steamorder出错";
                        reject(res);
                    }
                },
                onerror: function (err) {
                    console.log("访问steamorder列表出错：", err);
                    err.statusText = "访问steamorder出错";
                    reject(err);
                },
                ontimeout: function () {
                    let err = { "status": 408, "statusText": "连接steam超时" };
                    console.log("访问steamorder超时", err);
                    reject(err);
                }
            });
        })
    }

    //发送请求线程，限制最大同时请求数量
    function sendRequest(){
        if(requests.length==0)return;
        if(current_request_num<max_request_num){
            let request = requests.shift();
            let onload = request.onload;
            let onerror = request.onerror;
            let ontimeout = request.ontimeout;

            //特殊时期，steam市场对该请求有限制
            if(request.url.match(/itemordershistogram/)!=null&&current_request_num>=1){
                requests.push(request);
                return;
            }

            request.onload = (res)=>{
                current_request_num--;
                onload(res);
            }
            request.onerror = (res)=>{
                current_request_num--;
                onerror(res);
            }
            request.ontimeout = ()=>{
                current_request_num--;
                ontimeout();
            }
            GM_xmlhttpRequest(request);
            //console.log("Sending request");
            current_request_num++;
        }
    }

    //计算手续费，p是无小数点的价格（价格*100）
    function calcfee(p){
        var pnofee = Math.max(Math.floor(p/1.15),1);
        var vfee = Math.max(Math.floor(pnofee*0.1),1);
        var pfee = Math.max(Math.floor(pnofee*0.05),1);
        var i = 0;
        while((pnofee + vfee + pfee) != p && i < 100) {
            if((pnofee + vfee + pfee) > p) {
                pnofee--;
            }
            if((pnofee + vfee + pfee) < p) {
                pnofee++;
            }
            vfee = Math.max(Math.floor(pnofee*0.1),1);
            pfee = Math.max(Math.floor(pnofee*0.05),1);
            i++;
        }
        return pnofee;
    }

    /***************************饰品界面函数部分****************************/
    /***********************部分代码来自AFKOUT大佬**************************/

    //饰品界面查询函数
    function queryItemPage(itemUrl){
        get24MarketSell(itemUrl);
        initCalculator();
        GM_xmlhttpRequest({
            method: "GET",
            url: itemUrl,
            timeout:timeout_ms,
            onload: function(res){
                if(res.status == "200" &&res.responseText!=="null"){
                    try{
                        var nameid = res.responseText.match(/Market_LoadOrderSpread\( (\d+)/)[1];
                    }
                    catch(err){
                        if(res.responseText.indexOf('market_listing_nav_container') != -1){
                            steamxj();
                            return;
                        }
                    }
                    //console.log("https://steamcommunity.com/market/itemordershistogram?country=" + g_strCountryCode + "&language=" + g_strLanguage + "&currency=" + g_walletCurrency + "&item_nameid=" + nameid)
                    GM_xmlhttpRequest({
                        timeout:timeout_ms,
                        method: "GET",
                        url: "https://steamcommunity.com/market/itemordershistogram?country=" + communityInfo.g_strCountryCode + "&language=" + communityInfo.g_strLanguage + "&currency=" + communityInfo.g_walletCurrency + "&item_nameid=" + nameid,
                        headers: {
                            "referer": itemUrl,
                            "X-Requested-With": "XMLHttpRequest",
                            "Host": "steamcommunity.com",
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.35"
                        },
                        responseType: "json",
                        onload: function(data){
                            var obj = data.response;
                            if(obj){
                                if(!obj.lowest_sell_order&&!obj.highest_buy_order){
                                    return;
                                }

                                GM_addStyle(`.price > div{ margin-top:4px;font-size:16px; }
                                        .ls, .hb {color:#e46409; }
                                        .lsnf, .hbnf {color:#7ccc35; }
                                        .lsr, .hbr {color:#1ee44a; }
                                        .price > div > span{ text-align:center;display:-moz-inline-box; display:inline-block; width:110px;}
                                        .titleafk { font-size:14px; }
                                        .titleafk > strong:nth-child(1) { margin-left:90px; }
                                        .titleafk > strong:nth-child(2) { margin-left:70px; }
                                        .afkout { float:left;width:280px;margin-top:15px; }
                                        .afkout strong { color:#afb0b2;font-size: 15px}
                                       `);

                                var outDiv = document.createElement("div");
                                outDiv.className = "afkout";

                                outDiv.innerHTML =`<div class="titleafk">
                                            <strong>出售</strong><strong>求购</strong>
                                            </div>
                                            <div class="price">
                                            <div><strong>价格：</strong><span class="ls"></span><span class="hb"></span></div>
                                            <div><strong>税后：</strong><span class="lsnf"></span><span class="hbnf"></span></div>
                                            <div><strong>比例：</strong><span class="lsr"></span><span class="hbr"></span></div>
                                            </div>
                                         `;

                                let infoDiv = document.querySelector("main .bottom-info");
                                document.querySelector("main").insertBefore(outDiv,infoDiv);

                                // 修改Dota页面Style防止错位
                                let dotaDiv = document.querySelector(".media-middle.d-flex.d-c.mb20");
                                if(dotaDiv)dotaDiv.style = "margin-bottom: 0px !important;";

                                if(obj.lowest_sell_order){
                                    var lowest_sell_order = parseInt(obj.lowest_sell_order);
                                    document.querySelector("span.ls").innerText=obj.price_prefix + " " + lowest_sell_order/100 + " " + obj.price_suffix;
                                    var lsnofee = calcfee(lowest_sell_order);
                                    document.querySelector("span.lsnf").innerText=obj.price_prefix + " " + lsnofee/100 + " " + obj.price_suffix;
                                }

                                if(obj.highest_buy_order){
                                    var highest_buy_order = parseInt(obj.highest_buy_order);
                                    document.querySelector("span.hb").innerText=obj.price_prefix + " " + highest_buy_order/100 + " " + obj.price_suffix;
                                    var hbnofee = calcfee(highest_buy_order);
                                    document.querySelector("span.hbnf").innerText=obj.price_prefix + " " + hbnofee/100 + " " + obj.price_suffix;
                                }
                                let siteprice = getFloat(document.querySelector(".onsale-table-head + div > div.on-sale-table-item .text-price").innerText);
                                document.querySelector("span.lsr").innerText=(siteprice*100/lsnofee*rateInfo.CtoF).toFixed(rate_precision);
                                document.querySelector("span.hbr").innerText=(siteprice*100/hbnofee*rateInfo.CtoF).toFixed(rate_precision);

                                document.getElementById("calcPrice").value = document.querySelector("span.ls").innerText;
                                document.getElementById("calcCost").value = siteprice;
                                var e = document.createEvent("HTMLEvents");
                                e.initEvent("input",true,true);
                                document.getElementById("calcPrice").dispatchEvent(e);

                            }
                        },
                        ontimeout:steam302,
                        onerror: steam302
                    });
                }
            },
            ontimeout:steam302,
            onerror: steam302
        });
    }

    //获取24小时成交量
    function get24MarketSell(itemUrl){
        let oriLink = itemUrl.split('/');
        let appid = parseInt(oriLink[oriLink.length-2]);
        oriLink = oriLink[oriLink.length-1];
        GM_xmlhttpRequest({
            method: "get",
            url: `https://steamcommunity.com/market/priceoverview/?appid=${appid}&market_hash_name=${oriLink}`,
            headers: {
                "referer": `https://steamcommunity.com/market/listings/${appid}/${oriLink}`,
                "X-Requested-With": "XMLHttpRequest",
                "Host": "steamcommunity.com",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418.35"
            },
            responseType: "json",
            timeout: timeout_ms,
            onload: function (result) {
                result = result.response;
                result.volume=result.volume?result.volume:'0';
                var volume = '';
                if (result.success) {
                    volume = `在 <span>24</span> 小时内卖出了 <span class="text-green">${parseInt(result.volume.replace(/\, ?/gi, ''))}</span> 个`;
                }
                let oriDesc = document.querySelector("main");
                let newDesc = document.createElement('div');
                newDesc.style="margin-top:15px";
                newDesc.setAttribute('class', 'text-grey');
                newDesc.innerHTML = volume;
                oriDesc.appendChild(newDesc);
            }
        });
    }

    function initCalculator(){
        //计算器
        let calculator = document.createElement("div");
        calculator.className = "calc";
        calculator.style = "position: fixed;top: 20%;left: 20px;width: 150px;height: 100px;z-index: 999;background-color: #2C3040;color: white;font-weight: 600;height:fit-content;";
        calculator.innerHTML =
            "<p class=\"calcP\" style=\"\">售价 <input class=\"calcInput\" id=\"calcPrice\" autocomplete='off'></p>"+
            "<p class=\"calcP\">比例 <input class=\"calcInput\" id=\"calcRatio\" autocomplete='off'></p>"+
            "<p class=\"calcP\">进价 <input class=\"calcInput\" id=\"calcCost\" autocomplete='off'></p>";
        calculator.show = true;
        GM_addStyle(`
                                    p.calcP {margin-left: 10px;margin-top: 15px;margin-bottom: 15px;}
                                    input.calcInput {width: 90px;color: black;padding: unset;}
                                `);
        document.body.appendChild(calculator);
        document.getElementById("calcPrice").oninput = function(){
            this.value = correctInput(this.value);
            if(this.value === ""|| parseFloat(this.value) == 0){
                document.getElementById("calcRatio").value="";
                return;
            }
            let priceNoFee = calcfee((parseFloat(this.value*100)).toFixed(0))/100;
            let ratio = parseFloat(correctInput(document.getElementById("calcCost").value))*rateInfo.CtoF/priceNoFee;
            document.getElementById("calcRatio").value = ratio.toFixed(rate_precision);
        };
        document.getElementById("calcRatio").oninput = function(){
            this.value = correctInput(this.value);
            if(this.value === "" || parseFloat(this.value) == 0){
                document.getElementById("calcPrice").value="";
                return;
            }
            let priceNoFee = correctInput(document.getElementById("calcCost").value)/parseFloat(this.value)*rateInfo.CtoF;
            document.getElementById("calcPrice").value = calcOriPrice((priceNoFee*100).toFixed(0))/100;
        };
        document.getElementById("calcCost").oninput = function(){
            this.value = correctInput(this.value);
            if(this.value === "" || parseFloat(this.value) == 0){
                document.getElementById("calcRatio").value="";
                return;
            }
            let priceNoFee = calcfee((parseFloat(document.getElementById("calcPrice").value*100)).toFixed(0))/100;
            let ratio = this.value*rateInfo.CtoF/priceNoFee;
            document.getElementById("calcRatio").value = ratio.toFixed(rate_precision);
        };

        // 计算器隐藏图标
        let icon = document.createElement("div");
        icon.className = "item d-flex relative pointer default-bg";
        icon.style = "font-size: 19px; width: 45px;height: 45px;"+
            "align-items: center;justify-content: center;"+
            "user-select: none;border-radius: 0px 0px 0px 5px;"+
            "background: var(--color-nav-bg);";
        icon.innerHTML = "计";
        icon.addEventListener("click",()=>{
            if(calculator.show){
                calculator.style.display = "none";
                calculator.show=false;
            }
            else{
                calculator.style.display = "";
                calculator.show=true;
            }
        });
        function addIcon(retry){
            let nav_bar = document.querySelector(".navigate-wrapper");
            if(nav_bar)
                nav_bar.appendChild(icon);
            else if(retry<=10)
                setTimeout(addIcon,500,retry+1);
        }
        addIcon(0);
    }

    function getFloat(str){
        try{
            str = str.replace(/[^0-9\.,]/g,"");
            var f = parseFloat(str.match(/[\d]{1,}(\.\d+)?/)[0]);
        }
        catch(err){
            return 0;
        }
        return f;
    }

    function correctInput(input){
        var f = input.replaceAll(/[^0-9.]/g,"");
        var index = f.indexOf(".");
        if(index!=-1){
            f = f.substr(0,index+1)+f.substr(index+1).replace(".","");
        }
        return f;
    }

    function calcOriPrice(pNoFee){
        var p = (pNoFee*1.15).toFixed(0);
        var calcP = calcfee(p);
        while(calcP!=pNoFee){
            if(calcP>pNoFee){
                p--;
            }
            if(calcP<pNoFee){
                p++;
            }
            calcP = calcfee(p);
        }
        return p;
    }

    function steam302(){
        var s302 = document.createElement("div");
        s302.style="color:#FF0000;margin-top:15px";
        s302.innerHTML=`<span class="glyphicon glyphicon-remove"></span><strong>查询超时，建议使用<a target="_blank" href="https://steamcn.com/t339527-1-1" style="color:#0b84d3">Steam302</a></strong>`;
        let infoDiv = document.querySelector("main .bottom-info");
        document.querySelector("main").insertBefore(s302,infoDiv);
    }

    function steamxj(){
        var xj = document.createElement("div");
        xj.style="color:#FF0000;margin-top:15px";
        xj.innerHTML=`<strong>物品不在货架上</strong>`;
        let infoDiv = document.querySelector("main .bottom-info");
        document.querySelector("main").insertBefore(xj,infoDiv);
    }

    function toggleAutoPaging(){
        enable_auto_paging=(!enable_auto_paging);
        $nuxt.$notify.info({
                                title: "C5挂刀脚本",
                                message: `已${enable_auto_paging?"启用":"禁用"}自动翻页`,
                                duration: 1000
                            })
        if(queryCompleted && enable_auto_paging){
            setTimeout(autoPaging,auto_paging_timeout_ms);
        }
    }

    function autoPaging(){
        if(enable_auto_paging)nextBtn.click();
    }

    function toggleAutoTabbing(){
        enable_auto_tabbing=(!enable_auto_tabbing);
        $nuxt.$notify.info({
            title: "C5挂刀脚本",
            message: `已${enable_auto_tabbing?"启用":"禁用"}自动点击`,
            duration: 1000
        })
    }

    function goodIndex(sell,buy){
        return (0.75 * sell + 0.15 * buy + 0.02 * Math.exp(8 * (Math.pow(buy, 2) - Math.pow(sell + 0.1, 2))));
    }

    function isExpressionTrue(expression, context = {}) {
        try {
            const fullContext = { ...context, goodIndex: goodIndex };

            // 使用 Function 构造函数创建一个函数
            const func = new Function(...Object.keys(fullContext), `return (${expression})`);
            // 执行函数并传入上下文值
            return !!func(...Object.values(fullContext));
        } catch (e) {
            console.error("表达式解析错误:", e);
            return false;
        }
    }

})();