// ==UserScript==
// @name         Steam Show Purchase History by Type
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  在Steam账户消费历史页面，显示指定类别的消费历史。Show purchases of checked types on Steam account purchase history site.
// @author       lyzlyslyc
// @match        http*://store.steampowered.com/account/history*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      open.er-api.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455525/Steam%20Show%20Purchase%20History%20by%20Type.user.js
// @updateURL https://update.greasyfork.org/scripts/455525/Steam%20Show%20Purchase%20History%20by%20Type.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //货币单位和货币缩写的映射
    let currencySymbolMap = {
        "$ USD":"USD",
        "$": "USD",
        "£": "GBP",
        "€": "EUR",
        "CHF": "CHF",
        "pуб.": "RUB",
        "R$": "BRL",
        "¥": "CNY",
        "kr": "SEK",
        "Rp": "IDR",
        "RM": "MYR",
        "P": "PHP",
        "S$": "SGD",
        "฿": "THB",
        "₫": "VND",
        "₩": "KRW",
        "TL": "TRY",
        "₴": "UAH",
        "Mex$": "MXN",
        "CDN$": "CAD",
        "A$": "AUD",
        "NZ$": "NZD",
        "zł": "PLN",
        "₹": "INR",
        "CLP$": "CLP",
        "S/.": "PEN",
        "COL$": "COP",
        "R": "ZAR",
        "HK$": "HKD",
        "NT$": "TWD",
        "SR": "SAR",
        "AED": "AED",
        "ARS$": "ARS",
        "₪": "ILS",
        "Br": "BYN",
        "₸": "KZT",
        "KD": "KWD",
        "QR": "QAR",
        "₡": "CRC",
        "$U": "UYU",
        "лв": "BGN",
        "kn": "HRK",
        "Kč": "CZK",
        "kr.": "DKK",
        "Ft": "HUF",
        "lei": "RON",
        "刀币": "RMB",
        "원": "NXP"
    };

    // Your code here...
    let classified_history = {};
    let market_type = "";
    let market_item_name = "";
    let market_single_type = "";
    let is_market_type_found = false;
    let conversion_type = "充值";
    let is_conversion_type_found = false;
    let walletCurrencyCode = getWalletCurrencyCode();
    let transactions_type = {};
    if(walletCurrencyCode===undefined)walletCurrencyCode="CNY";
    //寻找市场交易的特殊类型
    document.querySelectorAll(".wallet_table_row ").forEach(row=>{
        //"转换"类型
        if(!is_conversion_type_found){
            if(row.querySelector(".wht_wallet_change")==null)return;
            if(row.querySelector(".wht_wallet_change").innerText==""&&row.querySelector(".wht_total").innerText==""){
                let typeStr = row.querySelector("td.wht_type > div:nth-child(1)").innerText.replace(/^\d* */,"");
                classified_history[typeStr]=[];
                conversion_type = typeStr;
                is_conversion_type_found = true;
                return;
            }
        }
        //市场交易复数类型，因为在某些语言下市场交易类型有单复数之分
        if(!is_market_type_found){
            if(row.querySelector("td.wht_type > div:nth-child(1)").innerText.match(/^[023456789](\d+)? */)!=null){
                let typeStr = row.querySelector("td.wht_type > div:nth-child(1)").innerText.replace(/^\d* */,"");
                classified_history[typeStr]=[];
                market_type = typeStr;
                market_item_name = row.querySelector(".wht_items").innerText.strip();
                is_market_type_found=true;
                return;
            }
        }
    })
    //遍历记录
    if(classified_history[conversion_type]===undefined)classified_history[conversion_type]=[];
    document.querySelectorAll(".wallet_table_row ").forEach(row=>{
        //如果是数字充值卡，放入转换类型
        if(row.querySelector("td.wht_type").innerText==""){
            classified_history[conversion_type].push(row);
            row.type = "conversion";
            return;
        }
        let typeStr = row.querySelector("td.wht_type > div:nth-child(1)").innerText.replace(/^\d* */,"");
        if(classified_history[typeStr]===undefined){
            //如果找到市场复数类型，且新类型的物品名称和复数类型的物品名称一样，则说明是市场单数类型
            if(is_market_type_found){
                if(row.querySelector(".wht_items").innerText.strip()==market_item_name){
                    //记录类型名字
                    market_single_type = typeStr;
                }
            }
            classified_history[typeStr]=[];
        }
        //如果类型是市场单数类型，把记录合并进复数类型集合
        if(typeStr==market_single_type||typeStr==market_type){
            classified_history[market_type].push(row);
            row.type = "market";
        }
        //如果是钱包充值，放进转换类型
        else if(row.querySelector(".wht_items > div")==null){
            classified_history[conversion_type].push(row);
            row.type = "wallet";
        }
        else if(row.querySelector(".wht_items > .wth_payment")!=null){
            //礼物类型
            if(row.querySelector(".wht_items > .wth_payment > div")!=null)row.type="gift";
            //内购类型
            else row.type = "ingame";
            //退款类型
            if(row.querySelector(".wht_items > .wth_item_refunded")!=null)row.type="refund";
            classified_history[typeStr].push(row);
        }
        //退款类型
        else if (row.querySelector(".wht_items > .wth_item_refunded") != null) {
            //充值退款放进转换类型
            if (row.querySelector(".wht_items").innerText.indexOf(row.querySelector(".wht_total").innerText) != -1) {
                row.type = "wallet";
                classified_history[conversion_type].push(row);
            }
            //游戏退款
            else {
                row.type = "refund";
                classified_history[typeStr].push(row);
            }
        }
        //购买类型
        else {
            row.type = "purchase";
            classified_history[typeStr].push(row);
        }

        //查询各记录货币情况
        let total = row.querySelector("td.wht_total");
        if(total.innerText=="")total = row.querySelector("td.wht_wallet_balance");
        if(total&&total.querySelector("div")!=null)total=total.children[0];
        if(total==null)row.currencyCode===undefined;
        else row.currencyCode = currencySymbolMap[total.innerText.replace(/\(.*\)/g,"").replace(/\d+((.|,)\d+)*/g,"").strip()];
        if(row.currencyCode===undefined)row.currencyCode = walletCurrencyCode;
        //记录交易id类型
        if(row.getAttribute("onclick")!=null){
            let match = row.getAttribute("onclick").match(/transid=(\d+)/);
            if(match!=null){
                row.transid=match[1];
                if(row.type!="refund")transactions_type[match[1]]=row.type;
            }
        }
    })

    let div = document.createElement("div");
    div.className = "wallet_history_click_hint";
    div.innerHTML="<span style='padding:0px 10px;'>类型</span>";
    //添加搜索框
    let input_span = document.createElement("span");
    input_span.style="float:right;color:#ffffff;";
    input_span.append("搜索：");
    let input = document.createElement("input");
    input.oninput = ()=>{
        if(input.value==""){
            document.querySelectorAll(".wallet_table_row ").forEach(row=>{
                if(row.isShown)row.style.display="table-row";
                else row.style.display="none";
            })
        }
        document.querySelectorAll(".wallet_table_row ").forEach(row=>{
            if(!row.isShown)return;
            if(row.innerText.match(new RegExp(input.value,"i"))!=null)row.style.display="table-row";
            else row.style.display="none";
        })
    }
    input_span.append(input);
    //创建复选框
    for(let type in classified_history){
        //如果是单数类型，不创建按钮
        if(classified_history[type]===undefined||classified_history[type].length<=0)continue;
        let span = document.createElement("span");
        span.className = "history-type-container";
        span.style = "margin:0px 10px;color: #ffffff;";
        let check = document.createElement("input");
        check.value = type;
        check.className = "history-type-checkbox";
        check.type = "checkbox";
        check.style = "vertical-align: text-top;margin-right: 3px;";
        check.addEventListener("click",(e)=>{
            showRows(type,check.checked);
            input.oninput();
        })
        span.append(check);
        span.append(type);
        div.append(span);
    }
    //添加至页面
    div.append(input_span);
    document.querySelector("#main_content").insertBefore(div,document.querySelector("table.wallet_history_table"));

    //礼物计算部分
    let gift_div = document.createElement("div");
    gift_div.className = "wallet_history_click_hint";
    gift_div.innerHTML+=`
    <span style="padding: 0px 10px">一共花费: <span id="spendAmount"></span><span id="refundAmount"></span></span>
	<span style="padding: 0px 10px">送出礼物: <span id="giftAmount"></span><span id="giftRefundAmount"></span></span>
	<span style="padding: 0px 10px">礼物额度(一共花费-送出礼物): <span id="availableAmount"></span></span>`;
    let gift_btn = document.createElement("a");
    gift_btn.className = "btnv6_blue_hoverfade";
    gift_btn.style = "padding: 0px 10px;";
    gift_btn.innerText = "计算";
    gift_btn.href = "javascript:;";
    gift_btn.addEventListener("click",(e)=>{
        Promise.all([loadAll(),getRate(walletCurrencyCode)]).then(results=>{
            let result = calculateGifts(results[1]);
            document.querySelector("#spendAmount").innerText = GStoreItemData.fnFormatCurrency(result.spend);
            document.querySelector("#giftAmount").innerText = GStoreItemData.fnFormatCurrency(result.gift);
            document.querySelector("#availableAmount").innerText = GStoreItemData.fnFormatCurrency(result.gift_remain);
            if(result.refund>0)document.querySelector("#refundAmount").innerText = `(${GStoreItemData.fnFormatCurrency(result.refund)}已退款)`;
            if(result.gift_refund>0) document.querySelector("#giftRefundAmount").innerText = `(${GStoreItemData.fnFormatCurrency(result.gift_refund)}已退款)`;
        })
    })
    gift_div.prepend(gift_btn);
    document.querySelector("#main_content").insertBefore(gift_div,div);


    //记录加载监视器
    let observer = new MutationObserver((mutations)=>{
        mutations.forEach((mutation)=>{
            if(mutation.type=="childList"){
                //如果仍未找到市场复数类型，先寻找该类型
                if(!is_market_type_found||!is_conversion_type_found){
                    mutation.addedNodes.forEach(row=>{
                        if(row.querySelector===undefined)return;
                        if(row.querySelector("td.wht_type").innerText=="")return;
                        let typeStr = row.querySelector("td.wht_type > div:nth-child(1)").innerText.replace(/^\d* */,"");
                        if(!is_conversion_type_found){
                            if(row.querySelector(".wht_wallet_change")&&row.querySelector(".wht_wallet_change").innerText==""&&row.querySelector(".wht_total").innerText==""){
                                classified_history[typeStr]=classified_history[conversion_type].clone();
                                delete classified_history[conversion_type];
                                conversion_type = typeStr;
                                is_conversion_type_found = true;
                            }
                        }
                        if(!is_market_type_found){
                            if(row.querySelector("td.wht_type > div:nth-child(1)").innerText.match(/^[023456789](\d+)? */)!=null){
                                classified_history[typeStr]=[];
                                market_type = typeStr;
                                market_item_name = row.querySelector(".wht_items").innerText.strip();
                                is_market_type_found=true;
                                //将之前的类型合并
                                for(let type in classified_history){
                                    if(type==typeStr)continue;
                                    if(classified_history[type].length<=0)continue;
                                    if(classified_history[type][0].querySelector(".wht_items").innerText.strip()==market_item_name){
                                        for(let i=0;i<classified_history[type].length;i++)classified_history[typeStr].push(classified_history[type][i]);
                                        classified_history[type]=[];
                                        market_single_type=type;
                                    }
                                }
                            }
                        }
                    });
                }
                //遍历新增的记录
                mutation.addedNodes.forEach(row=>{
                    if(row.querySelector===undefined)return;
                    if(row.querySelector("td.wht_type").innerText==""){
                        classified_history[conversion_type].push(row);
                        row.type = "wallet";
                        return;
                    }
                    let typeStr = row.querySelector("td.wht_type > div:nth-child(1)").innerText.replace(/^\d* */,"");
                    //出现新的类型
                    if(classified_history[typeStr]===undefined){
                        if(is_market_type_found){
                            if(row.querySelector(".wht_items").innerText.strip()==market_item_name){
                                market_single_type = typeStr;
                            }
                        }
                        classified_history[typeStr]=[];
                    }
                    //如果类型是市场单数类型，把记录合并进复数类型集合
                    if(typeStr==market_single_type||typeStr==market_type){
                        classified_history[market_type].push(row);
                        row.type = "market";
                    }
                    //如果是钱包充值，放进转换类型
                    else if(row.querySelector(".wht_items > div")==null){
                        classified_history[conversion_type].push(row);
                        row.type = "wallet";
                    }
                    else if(row.querySelector(".wht_items > .wth_payment")!=null){
                        //礼物类型
                        if(row.querySelector(".wht_items > .wth_payment > div")!=null)row.type="gift";
                        //内购类型
                        else row.type = "ingame";
                        //退款类型
                        if(row.querySelector(".wht_items > .wth_item_refunded")!=null)row.type="refund";
                        classified_history[typeStr].push(row);
                    }
                    //退款类型
                    else if (row.querySelector(".wht_items > .wth_item_refunded") != null) {
                        //充值退款放进转换类型
                        if (row.querySelector(".wht_items").innerText.indexOf(row.querySelector(".wht_total").innerText) != -1) {
                            row.type = "wallet";
                            classified_history[conversion_type].push(row);
                        }
                        //游戏退款
                        else {
                            row.type = "refund";
                            classified_history[typeStr].push(row);
                        }
                    }
                    //购买类型
                    else {
                        row.type = "purchase";
                        classified_history[typeStr].push(row);
                    }

                    //确定记录的货币
                    let total = row.querySelector("td.wht_total");
                    if(total.innerText=="")total = row.querySelector("td.wht_wallet_balance");
                    if(total&&total.querySelector("div")!=null)total=total.children[0];
                    if(total==null)row.currencyCode===undefined;
                    else row.currencyCode = currencySymbolMap[total.innerText.replace(/\(.*\)/g,"").replace(/\d+((.|,)\d+)*/g,"").strip()];
                    if(row.currencyCode===undefined)row.currencyCode = walletCurrencyCode;
                    //记录交易id类型
                    if(row.getAttribute("onclick")!=null){
                        let match = row.getAttribute("onclick").match(/transid=(\d+)/);
                        if(match!=null){
                            row.transid=match[1];
                            if(row.type!="refund")transactions_type[match[1]]=row.type;
                        }
                    }
                });

                //记录按钮的状态，并删除勾选框
                let checks = document.querySelectorAll(".history-type-container");
                let checked = {};
                for(let i=0;i<checks.length;i++){
                    let check = checks[i].querySelector(".history-type-checkbox");
                    checked[check.value] = check.checked;
                    checks[i].remove();
                }
                //重新添加勾选框（有可能原先没有市场复数类型，现在有了，所以要重新添加）
                for(let type in classified_history){
                    if(classified_history[type]===undefined||classified_history[type].length<=0)continue;
                    let span = document.createElement("span");
                    span.className = "history-type-container";
                    span.style = "margin-left: 5px;color: #ffffff;";
                    let check = document.createElement("input");
                    check.value = type;
                    check.className = "history-type-checkbox";
                    check.type = "checkbox";
                    check.style = "vertical-align: text-top;margin-right: 3px;";
                    check.addEventListener("click",(e)=>{
                        showRows(type,check.checked);
                        input.oninput();
                    })
                    span.append(check);
                    span.append(type);
                    div.append(span);
                    //还原按钮的状态
                    if(checked[type]!==undefined)check.checked=checked[type];
                    else if((type==market_type)&&(checked[market_single_type]!==undefined))check.checked=checked[market_single_type];
                }
                document.querySelectorAll(".history-type-checkbox").forEach((ele)=>{showRows(ele.value,ele.checked)});
            }
        });
    })
    observer.observe(document.querySelector("table.wallet_history_table > tbody"),{childList:true});
    document.querySelectorAll(".history-type-checkbox").forEach((ele)=>{ele.click()});

    //按照类别显示记录
    function showRows(type,visible){
        for(let i=0;i<classified_history[type].length;i++){
            if(visible==true){
                classified_history[type][i].style.display="table-row";
                classified_history[type][i].isShown = true;
            }
            else {
                classified_history[type][i].style.display="none";
                classified_history[type][i].isShown = false;
            }
        }
    }

    //获取钱包的货币代码
    function getWalletCurrencyCode(){
        let format = GStoreItemData.fnFormatCurrency(0).replace(/\d+((.|,)\d+)*/g,"").strip();
        return currencySymbolMap[format];
    }

    //获取汇率
    function getRate(currencyCode){
        return new Promise((resolve,reject)=>{
            let rates = GM_getValue("rates");
            if(rates===undefined||rates[currencyCode]==undefined||(new Date()-rates[currencyCode].time_last_request_unix>86400000)){
                console.log("Updating rates...");
                GM_xmlhttpRequest({
                    method: "get",
                    url:`https://open.er-api.com/v6/latest/${currencyCode}`,
                    onload: (result)=>{
                        let data = JSON.parse(result.response);
                        data.time_last_request_unix = new Date().getTime();
                        if(rates===undefined)rates={};
                        rates[currencyCode] = data;
                        GM_setValue("rates",rates);
                        console.log(rates);
                        resolve(data.rates);
                    }
                });
            }
            else resolve(rates[currencyCode].rates);
        })
    }

    //计算礼物额度
    function calculateGifts(rates){
        let spend = 0;
        let gift = 0;
        let refund = 0;
        let gift_refund = 0;
        let rows = document.querySelectorAll(".wallet_table_row ");
        for(let i=0;i<rows.length;i++){
            if(rows[i].type!="purchase"&&rows[i].type!="gift"&&rows[i].type!="refund")continue;
            if(rows[i].currencyCode===undefined)rows[i].currencyCode = walletCurrencyCode;
            let total = rows[i].querySelector(".wht_total").innerText;
            let price = parseInt(total.replace(/\(.*\)/g,"").replace(/[^\d]/g,""))/rates[rows[i].currencyCode];
            switch(rows[i].type){
                case "purchase":
                    spend+=price;
                    break;
                case "gift":
                    gift+=price;
                    break;
                case "refund":
                    //只有购买游戏或者礼物才会加入计算
                    if(transactions_type[rows[i].transid]=="purchase")refund+=price;
                    else if(transactions_type[rows[i].transid]=="gift")gift_refund+=price;
                    break;
                default:
                    break;
            }
        }
        return {
            "spend":parseInt(spend),
            "gift":parseInt(gift),
            "gift_remain":parseInt(spend)-parseInt(gift)-parseInt(refund)+parseInt(gift_refund),
            "gift_refund":parseInt(gift_refund),
            "refund":parseInt(refund)
        }
    }

    //加载所有记录
    function loadAll(){
        return loadHistory().then((result)=>{
            if(result=="load")return loadAll();
            else return "done";
        })
    }

    //加载一次记录
    function loadHistory(){
        return new Promise(function(resolve){
            $J('#load_more_button').hide();
            if ( g_historyCursor == null )
                resolve("done");

            var request_data = {
                cursor: g_historyCursor,
                sessionid: g_sessionID
            };

            g_historyCursor = null;

            $J('#wallet_history_loading').show();
            $J.ajax({
                type: "POST",
                url: "https://store.steampowered.com/account/AjaxLoadMoreHistory/",
                data: request_data
            }).done( function( data ) {
                if ( data.html )
                {
                    var elem_prev = $J('#more_history').prev();

                    $J('#more_history').before( data.html );

                    var new_elems = elem_prev.nextAll();
                    new_elems.hide();


                    new_elems.fadeIn( 500 );

                    WalletHistory_BindTooltips();
                }

                if ( data.cursor )
                {
                    g_historyCursor = data.cursor;
                    $J('#load_more_button').fadeIn( 50 );
                    resolve("load");

                }
                else
                {
                    $J('#load_more_button').hide();
                    resolve("done");
                }
            }).always( function() {
                $J('#wallet_history_loading').hide();
            } );
        });
    }
})();
