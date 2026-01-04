// ==UserScript==
// @name         Steam計算礼物额度
// @match        https://store.steampowered.com/account/history/*
// @grant        GM.xmlHttpRequest
// @author       LinkSpider
// @connect      wise.com
// @version      1.30
// @description  Steam計算礼物额度，支持中英文。支持中国，阿根廷，土耳其，俄罗斯，美国，中国香港，中国台湾等地区货币
// @license MIT
// @namespace https://greasyfork.org/users/305985
// @downloadURL https://update.greasyfork.org/scripts/444786/Steam%E8%A8%88%E7%AE%97%E7%A4%BC%E7%89%A9%E9%A2%9D%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/444786/Steam%E8%A8%88%E7%AE%97%E7%A4%BC%E7%89%A9%E9%A2%9D%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function loadAll(){


        function send(){
            return new Promise(function(resolve){
                $J('#load_more_button').hide();
                if ( g_historyCursor == null )
                    return;

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

        var rst = await send();
        console.log(rst);
        if(rst == "load") return loadAll();
        else return Promise.resolve();
    }

    function getExchange(from, to){
        return new Promise(resolve => {
            if(from == to) {
                resolve(amount);
                return;
            };
            var temp = `https://wise.com/gb/currency-converter/`+from+`-to-`+to+`-rate?amount=1`
            GM.xmlHttpRequest({
                url: `https://wise.com/gb/currency-converter/`+from+`-to-`+to+`-rate?amount=1`,
                method: "GET",
                onload: function(response) {
                    if(response.readyState == XMLHttpRequest.DONE){
                        var amount = 0,Mydoc=null;
                        if(response.status == 200){
                            Mydoc = new DOMParser().parseFromString(response.responseText, "text/html");
                            amount = parseFloat(Mydoc.querySelector("body > main > section > div:nth-child(2) > section > div > div.text-xs-center.text-sm-left > div.cc-rate-graph__header.m-b-3 > h3.cc__source-to-target.hidden-xs > span.text-success").innerText.replace(/,/g, ""));
                        }
                        resolve({
                            from: from,
                            amount: amount
                        });
                    }
                }
            });
        });
    }


	var totalSpendAmount = 0;

    function readPage(){
        var wallet = [].slice.call(document.querySelectorAll(".wallet_table_row"));
        if(!wallet.length) return undefined;

        var text = document.querySelector("#responsive_page_template_content > div.page_header_ctn.account_management > div > div > div.blockbg > span.breadcrumb_current_page").innerText
        var language = (text =='Purchase History')?'en':'cn'
        var gift, spend
        if(language == 'cn'){
            //若wallet沒有任何交易，即返回
            //取得所有礼物购买交易
            gift = wallet.filter(e => /礼物购买/.test(e.querySelector(".wht_type").innerText))
            //去除退款的交易
            .filter(e => !e.querySelector(".wht_refunded"));


            spend = wallet
            //去除所有礼物
            .filter(e => !/礼物购买/.test(e.querySelector(".wht_type").innerText))
            //去除所有錢包增加資金的交易
            .filter(e => !/\+/.test(e.querySelector("td.wht_wallet_change").innerText))
            //去除所有购买钱包资金的交易
            .filter(e => !/购买.+钱包资金/.test(e.querySelector("td.wht_items").innerText))
            //去除所有社区市场的交易
            .filter(e => !/Steam 社区市场/.test(e.querySelector("td.wht_items").innerText))
            //去除所有退款的游戏购买
            .filter(e => !e.querySelector(".wht_refunded"))
            //去除钱包退款
            .filter(e => !/退款/.test(e.querySelector(".wht_type").innerText))
			//去除内购
            .filter(e => !/游戏内购买/.test(e.querySelector(".wht_type").innerText));

        }else{

            //取得所有礼物购买交易
            gift = wallet.filter(e => /Gift Purchase/.test(e.querySelector(".wht_type").innerText))
            //去除退款的交易
            .filter(e => !e.querySelector(".wht_refunded"));

            spend = wallet
            //去除購買禮物的交易
            .filter(e => !/Gift Purchase/.test(e.querySelector(".wht_type").innerText))
            //去除所有錢包增加資金的交易
            .filter(e => !/\+/.test(e.querySelector("td.wht_wallet_change").innerText))
            //去除所有钱包资金的交易
            .filter(e => !/Purchase.+Wallet/.test(e.querySelector("td.wht_items").innerText))
            //去除所有社区市场的交易
            .filter(e => !/Steam Community Market/.test(e.querySelector("td.wht_items").innerText))
            //去除所有退款的游戏购买
            .filter(e => !e.querySelector(".wht_refunded"))
            //去除钱包退款
            .filter(e => !/Refund/.test(e.querySelector(".wht_type").innerText))
			//去除内购
			.filter(e => !/In-Game Purchase/.test(e.querySelector(".wht_type").innerText));
        }


        var calculate = async function(list, targetCurrency, type){

				function insertNode(totalAmount){
					if(type == "spend") totalSpendAmount = totalAmount;
					var currencyStr = (amount) => {
						switch(targetCurrency){
							case "USD":
								return `\$ ${amount}`;
								break;
							case "CNY":
								return `¥ ${amount}`;
								break;
							case "TWD":
								return `NT\$ ${amount}`;
								break;
							case "ARS":
								return `ARS ${amount}`.replace(".", ",");
								break;
							case "RUB":
								return `${amount} pуб.`;
								break;
							case "HKD":
								return `HK$ ${amount}`;
								break;
							case "TRY":
								return `TL ${amount}`.replace(".", ",");
								break;
						}
					};


					if(type == "spend") document.querySelector("#totalSpendAmount").innerText = currencyStr(totalSpendAmount);
					if(type == "gift"){
						document.querySelector("#totalGiftAmount").innerText = currencyStr(totalAmount);
						document.querySelector("#totalAvailableAmount").innerText = currencyStr((totalSpendAmount-totalAmount).toFixed(2));
					}

				}

				var total = [], toExchange = [];
				for(let i of list){
					let currency,money;
                    money = i.querySelector(".wht_total").innerText.replace(/^\s+|\s+$/, "")
					if(money.length){
						if(/^\$/.test(money)){
                            currency = "USD";
                            money=money.replace(/,/g, "");
                        }else if(/¥/.test(money)){
                            currency = "CNY";
                            money=money.replace(/,/g, "");
                        }else if(/NT/.test(money)){
                            currency = "TWD";
                            money=money.replace(/,/g, "");
                        }else if(/ARS/.test(money)){
                            currency = "ARS";
                            money=money.replace(".", "").replace(",", ".")
                        }else if(/pуб./.test(money)){
                            currency = "RUB";
                            money=money.replace(".", "").replace(",", ".")
                        }else if(/HK/.test(money)){
                            currency = "HKD";
                            money=money.replace(/,/g, "");
                        }else if(/TL/.test(money)){
                            currency = "TRY";
                            money=money.replace(".", "").replace(",", ".")
                        }else continue;
                        let amount = parseFloat(money.match(/[0-9]+(\.[0-9]{1,})?/)[0]);
						total.push({
							currency: currency,
							amount: amount
						});

						if(targetCurrency != currency && toExchange.indexOf(currency) == -1) toExchange.push(currency);
					}
					else
						total.push({
							currency: targetCurrency,
							amount: 0
						});
				}

				var totalAmount = 0;


				if(toExchange.length){
					var getAllExchange = async function(idx, arr){
						if(idx == toExchange.length) return Promise.resolve(arr);
						arr.push(await getExchange(toExchange[idx], targetCurrency));
						return getAllExchange(idx+1, arr);
					}

					var allExchange = await getAllExchange(0, []);
					for(let i of total){
						if(i.currency == targetCurrency) {
                            totalAmount += i.amount;
                        }else{
							for(let j of allExchange){
								if(j.from == i.currency){
									totalAmount += (i.amount * j.amount);
									break;
								}
							}
						}
					}


					insertNode(totalAmount.toFixed(2));
					totalSpendAmount = totalAmount.toFixed(2);

				}
				else{
					for(let i of total){
						totalAmount += i.amount;
                    }
					insertNode(totalAmount.toFixed(2));
					return Promise.resolve();
				}

        }

        return {
            calculateSpend: (targetCurrency) => calculate(spend, targetCurrency, "spend"),
            calculateGift: (targetCurrency) => calculate(gift, targetCurrency, "gift")
        }
    }



	function calculateDiv(){
		var div = document.createElement("div");
		div.innerHTML = `
			<span style="padding: 0px 10px 0px 0px">选择货币
				<select id="targetCurrency" style="border: none;">
					<option value="s">请选择</option>
                    <option value="ARS">阿根廷比索</option>
					<option value="TRY">土耳其里拉</option>
					<option value="CNY">人民币</option>
                    <option value="RUB">卢布</option>
                    <option value="HKD">港币</option>
					<option value="USD">美元</option>
                    <option value="TWD">台币</option>
				</select>
			</span>
			<span style="padding: 0px 10px">一共花费: <span id="totalSpendAmount"></span></span>
			<span style="padding: 0px 10px">送出礼物: <span id="totalGiftAmount"></span></span>
			<span style="padding: 0px 10px">礼物额度(一共花费-送出礼物): <span id="totalAvailableAmount"></span></span>

		`;
		document.querySelector(".wallet_history_click_hint").appendChild(div);
		document.querySelector("#targetCurrency").onchange = async function(e){
			if(e.target.value != "s"){
				var calculater = readPage();
				if(typeof calculater != "undefined"){
					await calculater.calculateSpend(e.target.value);
					await calculater.calculateGift(e.target.value);
				}
			}
		}
	}


    if(document.querySelector("#load_more_button").style.display != "none")
        loadAll().then(calculateDiv);
    else{
		calculateDiv();
    }
})();