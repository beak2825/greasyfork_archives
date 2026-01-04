// ==UserScript==
// @name         Stake.com Vault Script
// @description  Sends a percentage of your profits to the vault
// @description  Updated to make it run on all official mirrors
// @description  If stake.com is blocked by your country, is lagging or has a bad performance, try one of their mirrorsites
// @description  Find all official mirrors at -->  https://playstake.io/
// @description  Tips through Stake appreciated: @nyaWon (https://stake.com/?modal=user&name=nyaWon)
// @description  My ref: stake.com/?c=564e5749df
// @description  Based on @Dauersendung script which is outdated
// @description  Tested with crypto display only (don't use USD, EUR, JPY, BRL, CAD, CNY, IDR, INR, KRW, MXN, PHP, RUB  view)
// @description  Setup percentage to be saved at SAVE_AMOUNT (at the beginning of the script)
// @description  Running it in more than one tab might cause duplicated deposits to the vault
// @version      1.5
// @author       Christoph Hummel
// @match        https://stake.com/*
// @match        https://stake.bet/*
// @match        https://stake.games/*
// @match        https://staketr.com/*
// @match        https://staketr2.com/*
// @match        https://staketr3.com/*
// @match        https://staketr4.com/*
// @match        https://stake.bz/*
// @run-at       document-end
// @namespace Stake.com Vault Script
// @downloadURL https://update.greasyfork.org/scripts/408276/Stakecom%20Vault%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/408276/Stakecom%20Vault%20Script.meta.js
// ==/UserScript==
 
(function() {
    const SAVE_AMOUNT = 0.10 //Percentage of the winnings, in decimal (Examples: 50% => 0.50,  75% => 0.75, 15% => 0.15, 10% => 0.10)
    const DISPLAY_VAULT_TOTAL = true; // If true it will display the VAULT TOTAL. If false it will display the SUM of deposits made since opened
 
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
 
    class StakeApi {
        constructor() {
            this._accessToken = getCookie("session").replace(/"/g, '');
            // this._accessToken = localStorage.getItem('session').replace(/"/g, '');
        }
        async call(body) {
            return fetch("https://api.stake.com/graphql", {
                "credentials": "omit",
                "headers": {
                    "content-type": "application/json",
                    'x-access-token': this._accessToken,
                    'x-lockdown-token': ""},
                "referrer": "https://stake.com/",
                "body": body,
                "method": "POST",
                "mode": "cors"
            });
        }
        async getBalances() {
            return this.call("{\"operationName\":\"UserVaultBalances\",\"variables\":{},\"query\":\"query UserVaultBalances {\\n  user {\\n    id\\n    balances {\\n      available {\\n        amount\\n        currency\\n        __typename\\n      }\\n      vault {\\n        amount\\n        currency\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}");
        }
        async depositToVault(currency, amount) {
            var data = {
                operationName: "CreateVaultDeposit",
                variables: {
                    currency: currency,
                    amount: amount
                },
                query: "mutation CreateVaultDeposit($amount: Float!, $currency: CurrencyEnum!) {\n  createVaultDeposit(amount: $amount, currency: $currency) {\n    id\n    amount\n    currency\n    user {\n      id\n      balances {\n        available {\n          amount\n          currency\n          __typename\n        }\n        vault {\n          amount\n          currency\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"
            };
            return this.call(JSON.stringify(data));
        }
    }
 
    // let balanceSelector = 'header .styles__Cashier-puey40-2.dMSTdD .styles__Content-rlm06o-1.ixoRjG';
    let balanceSelector = '.navigation .balance-toggle .currency span.content span';
    var oldBal = '';
    let activeCurrency;
    const stakeApi = new StakeApi();
 
    function getCurrency() {
        return getCookie("currency_currency").replace(/"/g, '');
        // return JSON.parse(localStorage.getItem("v2_currency")).currency;
    }
    function updateCurrency() {
        let c = getCurrency();
        if(c != activeCurrency) {
            activeCurrency = c;
            return true;
        }
        return false;
    }
 
    class Wing {
        constructor() {
            this._element = document.createElement("span");
            this._element.id = "wingElm";
            this._element.innerText = "0.00000000";
            if (DISPLAY_VAULT_TOTAL) {
                this.setVaultBalance();
            }
 
            // document.querySelector(".styles__Wrap-rlm06o-0.bGSyHm").insertBefore(this._element, null);
            document.querySelector(".navigation .balance-toggle .currency").insertBefore(this._element, null);
            this._element.title = "Deposited to vault";
        }
 
        setVaultBalance() {
            stakeApi.getBalances().then((r) => r.json()).then((response) => {
                updateCurrency();
                let balance = response.data.user.balances.find(x => x.vault.currency == activeCurrency);
                if(balance) {
                    this._element.innerText = balance.vault.amount.toFixed(8);
                }
            });
        }
 
        update(amount) {
            console.log('updating');
            if (DISPLAY_VAULT_TOTAL) {
                this._element.innerText = amount.toFixed(8);
            } else {
                this._element.innerText = (parseFloat(this._element.innerText) + amount).toFixed(8);
            }
        }
 
        reset() {
            console.log('reseting');
            if (DISPLAY_VAULT_TOTAL) {
                this.setVaultBalance();
            } else {
                this._element.innerText = "0.00000000";
            }
        }
    }
 
    let wing;
    function init(){
        if (document.readyState === 'complete') {
            var oldBal = document.querySelector(balanceSelector).innerText;
            var curBalEle = document.querySelector(balanceSelector).innerText;
            wing = new Wing();
 
            function tresor() {
                oldBal = curBalEle
                if (oldBal = curBalEle) {
 
                    function checkBalance() {
                        var curBalEle = document.querySelector(balanceSelector);
                        if(updateCurrency()) { // if currency was changed return
                            wing.reset();
                            oldBal = document.querySelector(balanceSelector).innerText;
                            curBalEle = document.querySelector(balanceSelector).innerText;
                            return;
                        }
 
                        if(document.querySelectorAll(balanceSelector).length > 0) {
                            curBalEle = document.querySelector(balanceSelector).innerText;
                            if(curBalEle != '') {
                                if (curBalEle > oldBal) {
                                    var depositAmount = ((curBalEle - oldBal) * SAVE_AMOUNT);
                                    if (depositAmount >= 1e-8) {
                                        oldBal = (parseFloat(curBalEle) - parseFloat(depositAmount)).toFixed(8);
                                        stakeApi.depositToVault(activeCurrency, depositAmount).then((r) => r.json()).then((response) => {
                                            if (DISPLAY_VAULT_TOTAL) {
                                                try {
                                                    let cvd = response.data.createVaultDeposit;
                                                    let balanceObject = cvd.user.balances.find(x => x.vault.currency == cvd.currency);
                                                    wing.update(balanceObject.vault.amount);
                                                } catch (err) {
                                                    console.log('Error trying to read vault balance');
                                                    wing.update(depositAmount);
                                                }
                                            } else {
                                                wing.update(depositAmount);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
 
                    window.setInterval(checkBalance, 751); //timerspeed read send to tresor
                } else {
                    tresor(); //if different balance run func tresor
                }
            }
            var myTimer = setTimeout(tresor, 5500);
        } else {
            setTimeout(init, 5000);
        }
    };
    init();
})();